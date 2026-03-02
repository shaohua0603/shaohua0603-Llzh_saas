/**
 * 审批流程执行引擎单元测试
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import ApprovalExecutionEngine from '@/services/approvalExecutionEngine'
import type {
  SubmitApprovalRequest,
  ApprovalActionRequest,
  WithdrawApprovalRequest,
  ApprovalFlow,
  ApprovalNode,
  BusinessApprovalStatus,
  TodoTask
} from '@/types/flow-config'

describe('ApprovalExecutionEngine', () => {
  let engine: ApprovalExecutionEngine

  beforeEach(() => {
    engine = ApprovalExecutionEngine.getInstance()
  })

  describe('getInstance', () => {
    it('应该返回单例实例', () => {
      const instance1 = ApprovalExecutionEngine.getInstance()
      const instance2 = ApprovalExecutionEngine.getInstance()
      expect(instance1).toBe(instance2)
    })
  })

  describe('submitApproval', () => {
    it('应该成功提交审批', async () => {
      const request: SubmitApprovalRequest = {
        businessCode: 'LEAVE',
        businessId: 1,
        submitterId: 1,
        submitterName: '张三'
      }

      const result = await engine.submitApproval(request)
      expect(result).toHaveProperty('approvalId')
      expect(result).toHaveProperty('currentNode')
      expect(result).toHaveProperty('currentNodeId')
    })

    it('应该在流程配置不存在时抛出错误', async () => {
      const request: SubmitApprovalRequest = {
        businessCode: 'INVALID_CODE',
        businessId: 1,
        submitterId: 1,
        submitterName: '张三'
      }

      await expect(engine.submitApproval(request)).rejects.toThrow('未找到流程配置')
    })

    it('应该在流程中没有审批节点时抛出错误', async () => {
      const request: SubmitApprovalRequest = {
        businessCode: 'LEAVE',
        businessId: 1,
        submitterId: 1,
        submitterName: '张三'
      }

      // Mock getFlowNodes 返回空数组
      vi.spyOn(engine as any, 'getFlowNodes').mockResolvedValue([])

      await expect(engine.submitApproval(request)).rejects.toThrow('流程中没有审批节点')
    })
  })

  describe('approve', () => {
    it('应该成功审批通过', async () => {
      const request: ApprovalActionRequest = {
        businessCode: 'LEAVE',
        businessId: 1,
        nodeId: 1,
        approverId: 2,
        approverName: '李四',
        approvalComment: '同意'
      }

      const result = await engine.approve(request)
      expect(result).toHaveProperty('isCompleted')
      expect(result).toHaveProperty('approvalStatus')
    })

    it('应该在权限验证失败时抛出错误', async () => {
      const request: ApprovalActionRequest = {
        businessCode: 'LEAVE',
        businessId: 1,
        nodeId: 1,
        approverId: 999,
        approverName: '无权限用户',
        approvalComment: '同意'
      }

      vi.spyOn(engine as any, 'validateApproverPermission').mockRejectedValue(
        new Error('无审批权限')
      )

      await expect(engine.approve(request)).rejects.toThrow('无审批权限')
    })
  })

  describe('reject', () => {
    it('应该成功审批驳回', async () => {
      const request: ApprovalActionRequest = {
        businessCode: 'LEAVE',
        businessId: 1,
        nodeId: 1,
        approverId: 2,
        approverName: '李四',
        approvalComment: '不同意',
        rejectReason: '请假理由不充分'
      }

      const result = await engine.reject(request)
      expect(result).toHaveProperty('isCompleted')
      expect(result.isCompleted).toBe(true)
    })

    it('应该删除所有待办任务', async () => {
      const request: ApprovalActionRequest = {
        businessCode: 'LEAVE',
        businessId: 1,
        nodeId: 1,
        approverId: 2,
        approverName: '李四',
        approvalComment: '不同意'
      }

      const deleteAllTodoTasksSpy = vi.spyOn(engine as any, 'deleteAllTodoTasks')
      await engine.reject(request)
      expect(deleteAllTodoTasksSpy).toHaveBeenCalled()
    })
  })

  describe('transfer', () => {
    it('应该成功转交审批', async () => {
      const request: ApprovalActionRequest = {
        businessCode: 'LEAVE',
        businessId: 1,
        nodeId: 1,
        approverId: 2,
        approverName: '李四',
        transferToId: 3,
        transferToName: '王五',
        approvalComment: '转交给王五处理'
      }

      const result = await engine.transfer(request)
      expect(result).toHaveProperty('isCompleted')
      expect(result.isCompleted).toBe(false)
    })

    it('应该发送转交通知', async () => {
      const request: ApprovalActionRequest = {
        businessCode: 'LEAVE',
        businessId: 1,
        nodeId: 1,
        approverId: 2,
        approverName: '李四',
        transferToId: 3,
        transferToName: '王五'
      }

      const sendTransferNotificationSpy = vi.spyOn(engine as any, 'sendTransferNotification')
      await engine.transfer(request)
      expect(sendTransferNotificationSpy).toHaveBeenCalled()
    })
  })

  describe('delegate', () => {
    it('应该成功委派审批', async () => {
      const request: ApprovalActionRequest = {
        businessCode: 'LEAVE',
        businessId: 1,
        nodeId: 1,
        approverId: 2,
        approverName: '李四',
        delegateToId: 3,
        delegateToName: '王五',
        approvalComment: '委派给王五处理'
      }

      const result = await engine.delegate(request)
      expect(result).toHaveProperty('isCompleted')
      expect(result.isCompleted).toBe(false)
    })

    it('应该发送委派通知', async () => {
      const request: ApprovalActionRequest = {
        businessCode: 'LEAVE',
        businessId: 1,
        nodeId: 1,
        approverId: 2,
        approverName: '李四',
        delegateToId: 3,
        delegateToName: '王五'
      }

      const sendDelegateNotificationSpy = vi.spyOn(engine as any, 'sendDelegateNotification')
      await engine.delegate(request)
      expect(sendDelegateNotificationSpy).toHaveBeenCalled()
    })
  })

  describe('completeApprovalFlow', () => {
    it('应该成功完成审批流程', async () => {
      const request: ApprovalActionRequest = {
        businessCode: 'LEAVE',
        businessId: 1,
        nodeId: 3,
        approverId: 4,
        approverName: '赵六',
        approvalComment: '同意'
      }

      const result = await (engine as any).completeApprovalFlow(request)
      expect(result.isCompleted).toBe(true)
    })

    it('应该更新业务数据状态', async () => {
      const request: ApprovalActionRequest = {
        businessCode: 'LEAVE',
        businessId: 1,
        nodeId: 3,
        approverId: 4,
        approverName: '赵六'
      }

      const updateBusinessDataStatusSpy = vi.spyOn(engine as any, 'updateBusinessDataStatus')
      await (engine as any).completeApprovalFlow(request)
      expect(updateBusinessDataStatusSpy).toHaveBeenCalled()
    })
  })

  describe('handleApproverResignation', () => {
    it('应该成功处理审批人离职', async () => {
      const userId = 2
      await engine.handleApproverResignation(userId)
      // 应该没有抛出错误
    })

    it('应该转交待办任务给替换审批人', async () => {
      const userId = 2
      const transferTodoTaskSpy = vi.spyOn(engine as any, 'transferTodoTask')
      await engine.handleApproverResignation(userId)
      expect(transferTodoTaskSpy).toHaveBeenCalled()
    })
  })

  describe('handleApprovalTimeout', () => {
    it('应该成功处理审批超时', async () => {
      const taskId = 1
      await engine.handleApprovalTimeout(taskId)
      // 应该没有抛出错误
    })

    it('应该在任务不存在时抛出错误', async () => {
      const taskId = 999
      vi.spyOn(engine as any, 'getTodoTask').mockResolvedValue(null)
      await expect(engine.handleApprovalTimeout(taskId)).rejects.toThrow('待办任务不存在')
    })

    it('应该在超时处理方式为APPROVE时自动通过', async () => {
      const taskId = 1
      const node = { timeoutAction: 'APPROVE' } as ApprovalNode
      const task = {} as TodoTask

      vi.spyOn(engine as any, 'getTodoTask').mockResolvedValue(task)
      vi.spyOn(engine as any, 'getNodeByTask').mockResolvedValue(node)
      const autoApproveSpy = vi.spyOn(engine as any, 'autoApprove')

      await engine.handleApprovalTimeout(taskId)
      expect(autoApproveSpy).toHaveBeenCalledWith(task, node)
    })
  })

  describe('handleFlowConfigError', () => {
    it('应该成功处理流程配置错误', async () => {
      const flowId = 1
      await engine.handleFlowConfigError(flowId)
      // 应该没有抛出错误
    })

    it('应该暂停所有使用该流程的审批', async () => {
      const flowId = 1
      const pauseAllApprovalsByFlowSpy = vi.spyOn(engine as any, 'pauseAllApprovalsByFlow')
      await engine.handleFlowConfigError(flowId)
      expect(pauseAllApprovalsByFlowSpy).toHaveBeenCalledWith(flowId)
    })
  })

  describe('handleConcurrentApproval', () => {
    it('应该成功处理并发审批冲突', async () => {
      const request: ApprovalActionRequest = {
        businessCode: 'LEAVE',
        businessId: 1,
        nodeId: 1,
        approverId: 2,
        approverName: '李四'
      }

      await engine.handleConcurrentApproval(request)
      // 应该没有抛出错误
    })

    it('应该在节点已被处理时抛出错误', async () => {
      const request: ApprovalActionRequest = {
        businessCode: 'LEAVE',
        businessId: 1,
        nodeId: 1,
        approverId: 2,
        approverName: '李四'
      }

      vi.spyOn(engine as any, 'isNodeProcessed').mockResolvedValue(true)
      await expect(engine.handleConcurrentApproval(request)).rejects.toThrow('该节点已被其他审批人处理')
    })
  })

  describe('withdrawApproval', () => {
    it('应该成功撤回审批', async () => {
      const approvalId = 1
      const request: WithdrawApprovalRequest = {
        userId: 1,
        userName: '张三',
        cancelReason: '需要修改申请'
      }

      await engine.withdrawApproval(approvalId, request)
      // 应该没有抛出错误
    })

    it('应该在权限验证失败时抛出错误', async () => {
      const approvalId = 1
      const request: WithdrawApprovalRequest = {
        userId: 999,
        userName: '无权限用户'
      }

      vi.spyOn(engine as any, 'validateSubmitterPermission').mockRejectedValue(
        new Error('无撤回权限')
      )

      await expect(engine.withdrawApproval(approvalId, request)).rejects.toThrow('无撤回权限')
    })
  })

  describe('数据一致性', () => {
    it('应该在审批通过时使用事务', async () => {
      const request: ApprovalActionRequest = {
        businessCode: 'LEAVE',
        businessId: 1,
        nodeId: 1,
        approverId: 2,
        approverName: '李四'
      }

      const executeApprovalInTransactionSpy = vi.spyOn(engine as any, 'executeApprovalInTransaction')
      await engine.approve(request)
      expect(executeApprovalInTransactionSpy).toHaveBeenCalled()
    })

    it('应该在审批驳回时删除所有待办任务', async () => {
      const request: ApprovalActionRequest = {
        businessCode: 'LEAVE',
        businessId: 1,
        nodeId: 1,
        approverId: 2,
        approverName: '李四',
        approvalComment: '不同意'
      }

      const deleteAllTodoTasksSpy = vi.spyOn(engine as any, 'deleteAllTodoTasks')
      await engine.reject(request)
      expect(deleteAllTodoTasksSpy).toHaveBeenCalled()
    })
  })

  describe('错误处理', () => {
    it('应该捕获并记录审批通过失败', async () => {
      const request: ApprovalActionRequest = {
        businessCode: 'LEAVE',
        businessId: 1,
        nodeId: 1,
        approverId: 2,
        approverName: '李四'
      }

      vi.spyOn(engine as any, 'validateApproverPermission').mockRejectedValue(
        new Error('数据库连接失败')
      )

      await expect(engine.approve(request)).rejects.toThrow('数据库连接失败')
    })

    it('应该捕获并记录提交审批失败', async () => {
      const request: SubmitApprovalRequest = {
        businessCode: 'LEAVE',
        businessId: 1,
        submitterId: 1,
        submitterName: '张三'
      }

      vi.spyOn(engine as any, 'getFlowConfig').mockRejectedValue(
        new Error('数据库连接失败')
      )

      await expect(engine.submitApproval(request)).rejects.toThrow('数据库连接失败')
    })
  })
})
