/**
 * 审批流程执行引擎
 * 负责审批流程的初始化、流转、完成和异常处理
 */

import type {
  SubmitApprovalRequest,
  SubmitApprovalResponse,
  ApprovalActionRequest,
  ApprovalActionResponse,
  WithdrawApprovalRequest,
  ApprovalRecord,
  BusinessApprovalStatus,
  TodoTask,
  ApprovalFlow,
  ApprovalNode,
  ApprovalResult,
  BusinessApprovalStatus,
  TaskStatus,
  ApprovalMode
} from '@/types/flow-config'
import { NotificationIntegrationService } from './notificationIntegrationService'

/**
 * 审批流程执行引擎
 */
export class ApprovalExecutionEngine {
  private static instance: ApprovalExecutionEngine

  private notificationIntegrationService: NotificationIntegrationService

  private constructor() {
    this.notificationIntegrationService = NotificationIntegrationService.getInstance()
  }

  /**
   * 获取单例实例
   */
  static getInstance(): ApprovalExecutionEngine {
    if (!ApprovalExecutionEngine.instance) {
      ApprovalExecutionEngine.instance = new ApprovalExecutionEngine()
    }
    return ApprovalExecutionEngine.instance
  }

  // ============================================
  // 1. 流程初始化
  // ============================================

  /**
   * 提交审批 - 初始化审批流程
   * @param request 提交审批请求
   * @returns 提交审批响应
   */
  async submitApproval(request: SubmitApprovalRequest): Promise<SubmitApprovalResponse> {
    try {
      // 1.1 查询流程配置,判断是否需要审批
      const flowConfig = await this.getFlowConfig(request.businessCode)
      if (!flowConfig) {
        throw new Error('未找到流程配置')
      }

      // 1.2 创建审批状态记录
      const approvalStatus = await this.createApprovalStatus(
        request,
        flowConfig
      )

      // 1.3 获取流程的所有节点,按顺序排列
      const nodes = await this.getFlowNodes(flowConfig.id)

      // 1.4 创建第一个节点的待办任务
      const firstNode = nodes.find(node => node.nodeType === 'APPROVAL')
      if (!firstNode) {
        throw new Error('流程中没有审批节点')
      }

      // 1.5 创建审批记录和待办任务
      await this.createApprovalRecordsAndTasks(
        request,
        flowConfig,
        firstNode
      )

      // 1.6 发送消息通知给审批人
      await this.sendApprovalNotification(
        request,
        flowConfig,
        firstNode
      )

      return {
        approvalId: approvalStatus.id!,
        currentNode: firstNode.nodeName,
        currentNodeId: firstNode.id!
      }
    } catch (error) {
      console.error('提交审批失败:', error)
      throw error
    }
  }

  // ============================================
  // 2. 节点流转
  // ============================================

  /**
   * 审批通过
   * @param request 审批操作请求
   * @returns 审批操作响应
   */
  async approve(request: ApprovalActionRequest): Promise<ApprovalActionResponse> {
    try {
      // 2.1 验证审批人权限
      await this.validateApproverPermission(request)

      // 2.2 记录审批操作历史
      await this.recordApprovalHistory(request, 'APPROVED')

      // 2.3 判断是否为最后一个节点
      const isLastNode = await this.isLastNode(request.nodeId)

      if (isLastNode) {
        // 2.4 完成审批流程
        return await this.completeApprovalFlow(request)
      } else {
        // 2.5 创建下一节点的待办任务
        return await this.moveToNextNode(request)
      }
    } catch (error) {
      console.error('审批通过失败:', error)
      throw error
    }
  }

  /**
   * 审批驳回
   * @param request 审批操作请求
   * @returns 审批操作响应
   */
  async reject(request: ApprovalActionRequest): Promise<ApprovalActionResponse> {
    try {
      // 2.1 验证审批人权限
      await this.validateApproverPermission(request)

      // 2.2 记录审批操作历史
      await this.recordApprovalHistory(request, 'REJECTED')

      // 2.3 更新审批状态为已驳回
      await this.updateApprovalStatusToRejected(request)

      // 2.4 删除所有待办任务
      await this.deleteAllTodoTasks(request)

      // 2.5 发送消息通知给申请人
      await this.sendRejectNotification(request)

      return {
        isCompleted: true,
        approvalStatus: await this.getApprovalStatus(request)
      }
    } catch (error) {
      console.error('审批驳回失败:', error)
      throw error
    }
  }

  /**
   * 审批转交
   * @param request 审批操作请求
   * @returns 审批操作响应
   */
  async transfer(request: ApprovalActionRequest): Promise<ApprovalActionResponse> {
    try {
      // 2.1 验证审批人权限
      await this.validateApproverPermission(request)

      // 2.2 记录审批操作历史
      await this.recordApprovalHistory(request, 'TRANSFER')

      // 2.3 将待办任务转交给新的审批人
      await this.transferTodoTask(request)

      // 2.4 发送消息通知给新的审批人
      await this.sendTransferNotification(request)

      return {
        isCompleted: false,
        approvalStatus: await this.getApprovalStatus(request)
      }
    } catch (error) {
      console.error('审批转交失败:', error)
      throw error
    }
  }

  /**
   * 审批委派
   * @param request 审批操作请求
   * @returns 审批操作响应
   */
  async delegate(request: ApprovalActionRequest): Promise<ApprovalActionResponse> {
    try {
      // 2.1 验证审批人权限
      await this.validateApproverPermission(request)

      // 2.2 记录审批操作历史
      await this.recordApprovalHistory(request, 'DELEGATE')

      // 2.3 将待办任务委派给其他审批人
      await this.delegateTodoTask(request)

      // 2.4 发送消息通知给委派人和被委派人
      await this.sendDelegateNotification(request)

      return {
        isCompleted: false,
        approvalStatus: await this.getApprovalStatus(request)
      }
    } catch (error) {
      console.error('审批委派失败:', error)
      throw error
    }
  }

  // ============================================
  // 3. 流程完成
  // ============================================

  /**
   * 完成审批流程
   * @param request 审批操作请求
   * @returns 审批操作响应
   */
  async completeApprovalFlow(request: ApprovalActionRequest): Promise<ApprovalActionResponse> {
    try {
      // 3.1 更新审批状态为已通过
      await this.updateApprovalStatusToApproved(request)

      // 3.2 记录完成时间
      await this.recordCompleteTime(request)

      // 3.3 发送消息通知给申请人
      await this.sendApprovalCompleteNotification(request)

      // 3.4 更新业务数据状态
      await this.updateBusinessDataStatus(request)

      // 3.5 删除所有待办任务
      await this.deleteAllTodoTasks(request)

      return {
        isCompleted: true,
        approvalStatus: await this.getApprovalStatus(request)
      }
    } catch (error) {
      console.error('完成审批流程失败:', error)
      throw error
    }
  }

  // ============================================
  // 4. 异常处理
  // ============================================

  /**
   * 处理审批人离职
   * @param userId 离职用户ID
   */
  async handleApproverResignation(userId: number): Promise<void> {
    try {
      // 4.1 查找该用户的所有待办任务
      const pendingTasks = await this.getPendingTasksByUserId(userId)

      // 4.2 转交待办任务给上级或备用审批人
      for (const task of pendingTasks) {
        const newApproverId = await this.findReplacementApprover(task)
        if (newApproverId) {
          await this.transferTodoTask({
            businessCode: task.businessCode,
            businessId: task.businessId,
            nodeId: task.approvalRecordId!,
            approverId: userId,
            approverName: '',
            transferToId: newApproverId,
            transferToName: ''
          })
        }
      }
    } catch (error) {
      console.error('处理审批人离职失败:', error)
      throw error
    }
  }

  /**
   * 处理审批超时
   * @param taskId 待办任务ID
   */
  async handleApprovalTimeout(taskId: number): Promise<void> {
    try {
      // 4.1 获取待办任务信息
      const task = await this.getTodoTask(taskId)
      if (!task) {
        throw new Error('待办任务不存在')
      }

      // 4.2 获取节点配置
      const node = await this.getNodeByTask(task)
      if (!node) {
        throw new Error('节点不存在')
      }

      // 4.3 根据超时处理方式执行相应操作
      switch (node.timeoutAction) {
        case 'APPROVE':
          // 自动通过
          await this.autoApprove(task, node)
          break
        case 'REJECT':
          // 自动驳回
          await this.autoReject(task, node)
          break
        case 'REMIND':
          // 发送提醒
          await this.sendTimeoutReminder(task)
          break
        default:
          throw new Error('未知的超时处理方式')
      }
    } catch (error) {
      console.error('处理审批超时失败:', error)
      throw error
    }
  }

  /**
   * 处理流程配置错误
   * @param flowId 流程ID
   */
  async handleFlowConfigError(flowId: number): Promise<void> {
    try {
      // 4.1 暂停所有使用该流程的审批
      await this.pauseAllApprovalsByFlow(flowId)

      // 4.2 发送错误通知给管理员
      await this.sendFlowConfigErrorNotification(flowId)

      // 4.3 记录错误日志
      await this.logFlowConfigError(flowId)
    } catch (error) {
      console.error('处理流程配置错误失败:', error)
      throw error
    }
  }

  /**
   * 处理并发审批冲突
   * @param request 审批操作请求
   */
  async handleConcurrentApproval(request: ApprovalActionRequest): Promise<void> {
    try {
      // 4.1 使用乐观锁检查版本号
      const currentStatus = await this.getApprovalStatus(request)
      if (!currentStatus) {
        throw new Error('审批状态不存在')
      }

      // 4.2 检查是否已被其他审批人处理
      const isProcessed = await this.isNodeProcessed(request.nodeId)
      if (isProcessed) {
        throw new Error('该节点已被其他审批人处理')
      }

      // 4.3 使用事务保证数据一致性
      await this.executeApprovalInTransaction(request)
    } catch (error) {
      console.error('处理并发审批冲突失败:', error)
      throw error
    }
  }

  // ============================================
  // 5. 流程状态管理
  // ============================================

  /**
   * 撤回审批
   * @param approvalId 审批ID
   * @param request 撤回审批请求
   */
  async withdrawApproval(approvalId: number, request: WithdrawApprovalRequest): Promise<void> {
    try {
      // 5.1 验证申请人权限
      await this.validateSubmitterPermission(approvalId, request.userId)

      // 5.2 更新审批状态为已撤回
      await this.updateApprovalStatusToWithdrawn(approvalId, request)

      // 5.3 删除所有待办任务
      await this.deleteAllTodoTasksByApprovalId(approvalId)

      // 5.4 发送撤回通知
      await this.sendWithdrawNotification(approvalId, request)
    } catch (error) {
      console.error('撤回审批失败:', error)
      throw error
    }
  }

  // ============================================
  // 私有辅助方法
  // ============================================

  /**
   * 获取流程配置
   */
  private async getFlowConfig(businessCode: string): Promise<ApprovalFlow | null> {
    // TODO: 实现从数据库获取流程配置的逻辑
    return null
  }

  /**
   * 创建审批状态记录
   */
  private async createApprovalStatus(
    request: SubmitApprovalRequest,
    flowConfig: ApprovalFlow
  ): Promise<BusinessApprovalStatus> {
    // TODO: 实现创建审批状态记录的逻辑
    return {} as BusinessApprovalStatus
  }

  /**
   * 获取流程节点
   */
  private async getFlowNodes(flowId: number): Promise<ApprovalNode[]> {
    // TODO: 实现从数据库获取流程节点的逻辑
    return []
  }

  /**
   * 创建审批记录和待办任务
   */
  private async createApprovalRecordsAndTasks(
    request: SubmitApprovalRequest,
    flowConfig: ApprovalFlow,
    node: ApprovalNode
  ): Promise<void> {
    // TODO: 实现创建审批记录和待办任务的逻辑
  }

  /**
   * 发送审批通知
   */
  private async sendApprovalNotification(
    request: SubmitApprovalRequest,
    flowConfig: ApprovalFlow,
    node: ApprovalNode
  ): Promise<void> {
    try {
      // 获取审批人列表
      const approvers = await this.getNodeApprovers(node)

      if (approvers.length === 0) {
        console.warn('审批节点没有配置审批人')
        return
      }

      // 发送审批待办通知
      await this.notificationIntegrationService.sendApprovalTodoNotification(
        flowConfig,
        node,
        {
          id: request.submitterId,
          name: request.submitterName,
        },
        approvers,
        {
          businessCode: request.businessCode,
          businessId: request.businessId,
          businessTitle: request.businessTitle || `${request.businessCode}申请`,
        }
      )
    } catch (error) {
      console.error('发送审批通知失败:', error)
      // 不抛出错误，避免影响审批流程
    }
  }

  /**
   * 验证审批人权限
   */
  private async validateApproverPermission(request: ApprovalActionRequest): Promise<void> {
    // TODO: 实现验证审批人权限的逻辑
  }

  /**
   * 记录审批历史
   */
  private async recordApprovalHistory(
    request: ApprovalActionRequest,
    result: ApprovalResult
  ): Promise<void> {
    // TODO: 实现记录审批历史的逻辑
  }

  /**
   * 判断是否为最后一个节点
   */
  private async isLastNode(nodeId: number): Promise<boolean> {
    // TODO: 实现判断是否为最后一个节点的逻辑
    return false
  }

  /**
   * 移动到下一节点
   */
  private async moveToNextNode(request: ApprovalActionRequest): Promise<ApprovalActionResponse> {
    // TODO: 实现移动到下一节点的逻辑
    return {} as ApprovalActionResponse
  }

  /**
   * 更新审批状态为已驳回
   */
  private async updateApprovalStatusToRejected(request: ApprovalActionRequest): Promise<void> {
    // TODO: 实现更新审批状态为已驳回的逻辑
  }

  /**
   * 删除所有待办任务
   */
  private async deleteAllTodoTasks(request: ApprovalActionRequest): Promise<void> {
    // TODO: 实现删除所有待办任务的逻辑
  }

  /**
   * 发送驳回通知
   */
  private async sendRejectNotification(request: ApprovalActionRequest): Promise<void> {
    try {
      // 获取审批状态和审批记录
      const approvalStatus = await this.getApprovalStatus(request)
      const currentApprovalRecord = await this.getCurrentApprovalRecord(request)

      if (!approvalStatus || !currentApprovalRecord) {
        console.warn('获取审批状态或审批记录失败')
        return
      }

      // 发送审批驳回通知
      await this.notificationIntegrationService.sendApprovalRejectedNotification(
        approvalStatus,
        currentApprovalRecord,
        {
          businessCode: request.businessCode,
          businessId: request.businessId,
          businessTitle: request.businessTitle || `${request.businessCode}申请`,
        }
      )
    } catch (error) {
      console.error('发送驳回通知失败:', error)
      // 不抛出错误，避免影响审批流程
    }
  }

  /**
   * 获取审批状态
   */
  private async getApprovalStatus(request: ApprovalActionRequest): Promise<BusinessApprovalStatus> {
    // TODO: 实现获取审批状态的逻辑
    return {} as BusinessApprovalStatus
  }

  /**
   * 转交待办任务
   */
  private async transferTodoTask(request: ApprovalActionRequest): Promise<void> {
    // TODO: 实现转交待办任务的逻辑
  }

  /**
   * 发送转交通知
   */
  private async sendTransferNotification(request: ApprovalActionRequest): Promise<void> {
    try {
      // 获取审批状态和审批记录
      const approvalStatus = await this.getApprovalStatus(request)
      const currentApprovalRecord = await this.getCurrentApprovalRecord(request)

      if (!approvalStatus || !currentApprovalRecord) {
        console.warn('获取审批状态或审批记录失败')
        return
      }

      // 获取转交目标人信息
      const transferTo = await this.getUserInfo(request.transferToId!)

      if (!transferTo) {
        console.warn('获取转交目标人信息失败')
        return
      }

      // 发送审批转交通知
      await this.notificationIntegrationService.sendApprovalTransferNotification(
        approvalStatus,
        currentApprovalRecord,
        transferTo,
        {
          businessCode: request.businessCode,
          businessId: request.businessId,
          businessTitle: request.businessTitle || `${request.businessCode}申请`,
        }
      )
    } catch (error) {
      console.error('发送转交通知失败:', error)
      // 不抛出错误，避免影响审批流程
    }
  }

  /**
   * 委派待办任务
   */
  private async delegateTodoTask(request: ApprovalActionRequest): Promise<void> {
    // TODO: 实现委派待办任务的逻辑
  }

  /**
   * 发送委派通知
   */
  private async sendDelegateNotification(request: ApprovalActionRequest): Promise<void> {
    try {
      // 获取审批状态和审批记录
      const approvalStatus = await this.getApprovalStatus(request)
      const currentApprovalRecord = await this.getCurrentApprovalRecord(request)

      if (!approvalStatus || !currentApprovalRecord) {
        console.warn('获取审批状态或审批记录失败')
        return
      }

      // 获取委派目标人信息
      const delegateTo = await this.getUserInfo(request.delegateToId!)

      if (!delegateTo) {
        console.warn('获取委派目标人信息失败')
        return
      }

      // 发送审批委派通知
      await this.notificationIntegrationService.sendApprovalDelegateNotification(
        approvalStatus,
        currentApprovalRecord,
        delegateTo,
        {
          businessCode: request.businessCode,
          businessId: request.businessId,
          businessTitle: request.businessTitle || `${request.businessCode}申请`,
        }
      )
    } catch (error) {
      console.error('发送委派通知失败:', error)
      // 不抛出错误，避免影响审批流程
    }
  }

  /**
   * 更新审批状态为已通过
   */
  private async updateApprovalStatusToApproved(request: ApprovalActionRequest): Promise<void> {
    // TODO: 实现更新审批状态为已通过的逻辑
  }

  /**
   * 记录完成时间
   */
  private async recordCompleteTime(request: ApprovalActionRequest): Promise<void> {
    // TODO: 实现记录完成时间的逻辑
  }

  /**
   * 发送审批完成通知
   */
  private async sendApprovalCompleteNotification(request: ApprovalActionRequest): Promise<void> {
    try {
      // 获取审批状态
      const approvalStatus = await this.getApprovalStatus(request)

      if (!approvalStatus) {
        console.warn('获取审批状态失败')
        return
      }

      // 获取相关用户列表（申请人、所有审批人）
      const relatedUsers = await this.getRelatedUsers(approvalStatus)

      if (relatedUsers.length === 0) {
        console.warn('获取相关用户列表失败')
        return
      }

      // 发送审批完成通知
      await this.notificationIntegrationService.sendApprovalCompleteNotification(
        approvalStatus,
        {
          businessCode: request.businessCode,
          businessId: request.businessId,
          businessTitle: request.businessTitle || `${request.businessCode}申请`,
        },
        relatedUsers
      )
    } catch (error) {
      console.error('发送审批完成通知失败:', error)
      // 不抛出错误，避免影响审批流程
    }
  }

  /**
   * 更新业务数据状态
   */
  private async updateBusinessDataStatus(request: ApprovalActionRequest): Promise<void> {
    // TODO: 实现更新业务数据状态的逻辑
  }

  /**
   * 获取用户的待办任务
   */
  private async getPendingTasksByUserId(userId: number): Promise<TodoTask[]> {
    // TODO: 实现获取用户待办任务的逻辑
    return []
  }

  /**
   * 查找替换审批人
   */
  private async findReplacementApprover(task: TodoTask): Promise<number | null> {
    // TODO: 实现查找替换审批人的逻辑
    return null
  }

  /**
   * 获取待办任务
   */
  private async getTodoTask(taskId: number): Promise<TodoTask | null> {
    // TODO: 实现获取待办任务的逻辑
    return null
  }

  /**
   * 根据任务获取节点
   */
  private async getNodeByTask(task: TodoTask): Promise<ApprovalNode | null> {
    // TODO: 实现根据任务获取节点的逻辑
    return null
  }

  /**
   * 自动通过
   */
  private async autoApprove(task: TodoTask, node: ApprovalNode): Promise<void> {
    // TODO: 实现自动通过的逻辑
  }

  /**
   * 自动驳回
   */
  private async autoReject(task: TodoTask, node: ApprovalNode): Promise<void> {
    // TODO: 实现自动驳回的逻辑
  }

  /**
   * 发送超时提醒
   */
  private async sendTimeoutReminder(task: TodoTask): Promise<void> {
    // TODO: 实现发送超时提醒的逻辑
  }

  /**
   * 暂停所有使用该流程的审批
   */
  private async pauseAllApprovalsByFlow(flowId: number): Promise<void> {
    // TODO: 实现暂停所有使用该流程的审批的逻辑
  }

  /**
   * 发送流程配置错误通知
   */
  private async sendFlowConfigErrorNotification(flowId: number): Promise<void> {
    // TODO: 实现发送流程配置错误通知的逻辑
  }

  /**
   * 记录流程配置错误日志
   */
  private async logFlowConfigError(flowId: number): Promise<void> {
    // TODO: 实现记录流程配置错误日志的逻辑
  }

  /**
   * 检查节点是否已处理
   */
  private async isNodeProcessed(nodeId: number): Promise<boolean> {
    // TODO: 实现检查节点是否已处理的逻辑
    return false
  }

  /**
   * 在事务中执行审批
   */
  private async executeApprovalInTransaction(request: ApprovalActionRequest): Promise<void> {
    // TODO: 实现在事务中执行审批的逻辑
  }

  /**
   * 验证申请人权限
   */
  private async validateSubmitterPermission(approvalId: number, userId: number): Promise<void> {
    // TODO: 实现验证申请人权限的逻辑
  }

  /**
   * 更新审批状态为已撤回
   */
  private async updateApprovalStatusToWithdrawn(
    approvalId: number,
    request: WithdrawApprovalRequest
  ): Promise<void> {
    // TODO: 实现更新审批状态为已撤回的逻辑
  }

  /**
   * 删除所有待办任务(按审批ID)
   */
  private async deleteAllTodoTasksByApprovalId(approvalId: number): Promise<void> {
    // TODO: 实现删除所有待办任务的逻辑
  }

  /**
   * 发送撤回通知
   */
  private async sendWithdrawNotification(approvalId: number, request: WithdrawApprovalRequest): Promise<void> {
    try {
      // 获取审批状态
      const approvalStatus = await this.getApprovalStatus({
        businessCode: '',
        businessId: 0,
        nodeId: 0,
        approverId: 0,
        approverName: '',
        approvalComment: '',
      })

      if (!approvalStatus) {
        console.warn('获取审批状态失败')
        return
      }

      // 发送审批撤回通知
      await this.notificationIntegrationService.sendApprovalWithdrawNotification(
        approvalStatus,
        {
          id: request.userId,
          name: request.userName,
        },
        {
          businessCode: approvalStatus.businessCode,
          businessId: approvalStatus.businessId,
          businessTitle: `${approvalStatus.businessCode}申请`,
        }
      )
    } catch (error) {
      console.error('发送撤回通知失败:', error)
      // 不抛出错误，避免影响审批流程
    }
  }

  /**
   * 获取节点审批人
   */
  private async getNodeApprovers(node: ApprovalNode): Promise<{ id: number; name: string; phone?: string; email?: string }[]> {
    // TODO: 实现获取节点审批人的逻辑
    return []
  }

  /**
   * 获取当前审批记录
   */
  private async getCurrentApprovalRecord(request: ApprovalActionRequest): Promise<ApprovalRecord | null> {
    // TODO: 实现获取当前审批记录的逻辑
    return null
  }

  /**
   * 获取用户信息
   */
  private async getUserInfo(userId: number): Promise<{ id: number; name: string; phone?: string; email?: string } | null> {
    // TODO: 实现获取用户信息的逻辑
    return null
  }

  /**
   * 获取相关用户列表
   */
  private async getRelatedUsers(approvalStatus: BusinessApprovalStatus): Promise<{ id: number; name: string }[]> {
    // TODO: 实现获取相关用户列表的逻辑
    return []
  }
}

export default ApprovalExecutionEngine
