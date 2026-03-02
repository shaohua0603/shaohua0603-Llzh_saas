/**
 * 消息通知集成服务
 * 负责将消息通知集成到审批流程中
 * 在审批流程的关键节点发送通知
 */

import { NotificationService } from './notificationService'
import type {
  NotificationRequest,
  NotificationChannel,
  NotificationType,
  NotificationPriority,
  MessageTemplateType,
  NotificationReceiver,
} from '@/types/notification'
import type {
  ApprovalFlow,
  ApprovalNode,
  BusinessApprovalStatus,
  ApprovalRecord,
  TodoTask,
} from '@/types/flow-config'

/**
 * 消息通知集成服务
 */
export class NotificationIntegrationService {
  private static instance: NotificationIntegrationService

  private notificationService: NotificationService

  private constructor() {
    this.notificationService = NotificationService.getInstance()
  }

  /**
   * 获取单例实例
   */
  static getInstance(): NotificationIntegrationService {
    if (!NotificationIntegrationService.instance) {
      NotificationIntegrationService.instance = new NotificationIntegrationService()
    }
    return NotificationIntegrationService.instance
  }

  // ============================================
  // 1. 审批流程通知
  // ============================================

  /**
   * 发送审批待办通知
   * @param flowConfig 流程配置
   * @param firstNode 第一个审批节点
   * @param submitter 提交人信息
   * @param approvers 审批人列表
   * @param businessInfo 业务信息
   */
  async sendApprovalTodoNotification(
    flowConfig: ApprovalFlow,
    firstNode: ApprovalNode,
    submitter: { id: number; name: string },
    approvers: { id: number; name: string; phone?: string; email?: string }[],
    businessInfo: { businessCode: string; businessId: number; businessTitle: string }
  ): Promise<void> {
    try {
      // 1.1 构建接收人列表
      const receivers: NotificationReceiver[] = approvers.map(approver => ({
        userId: approver.id,
        userName: approver.name,
        phone: approver.phone,
        email: approver.email,
      }))

      // 1.2 构建消息变量
      const variables = {
        receiverName: approvers.map(a => a.name).join('、'),
        title: businessInfo.businessTitle,
        submitterName: submitter.name,
        submitTime: new Date().toLocaleString('zh-CN'),
        flowName: flowConfig.flowName,
        nodeName: firstNode.nodeName,
      }

      // 1.3 构建通知请求
      const notificationRequest: NotificationRequest = {
        notificationType: NotificationType.APPROVAL,
        channels: [NotificationChannel.INBOX, NotificationChannel.EMAIL, NotificationChannel.SMS],
        receiverIds: approvers.map(a => a.id),
        receivers,
        templateCode: MessageTemplateType.APPROVAL_TODO,
        title: '您有一个新的审批待办任务',
        content: `尊敬的${variables.receiverName}，您有一个新的审批待办任务：\n\n任务标题：${variables.title}\n提交人：${variables.submitterName}\n提交时间：${variables.submitTime}\n\n请及时处理。`,
        variables,
        priority: NotificationPriority.HIGH,
        businessType: businessInfo.businessCode,
        businessId: businessInfo.businessId,
        senderId: submitter.id,
        senderName: submitter.name,
      }

      // 1.4 发送通知
      await this.notificationService.sendNotification(notificationRequest)

      console.log(`审批待办通知发送成功: ${businessInfo.businessCode}-${businessInfo.businessId}`)
    } catch (error) {
      console.error('发送审批待办通知失败:', error)
      throw error
    }
  }

  /**
   * 发送审批通过通知
   * @param approvalStatus 审批状态
   * @param currentApprovalRecord 当前审批记录
   * @param businessInfo 业务信息
   */
  async sendApprovalApprovedNotification(
    approvalStatus: BusinessApprovalStatus,
    currentApprovalRecord: ApprovalRecord,
    businessInfo: { businessCode: string; businessId: number; businessTitle: string }
  ): Promise<void> {
    try {
      // 1.1 构建接收人信息
      const receiver: NotificationReceiver = {
        userId: approvalStatus.submitterId,
        userName: approvalStatus.submitterName,
      }

      // 1.2 构建消息变量
      const variables = {
        receiverName: approvalStatus.submitterName,
        title: businessInfo.businessTitle,
        approverName: currentApprovalRecord.approverName,
        approvalTime: new Date(currentApprovalRecord.approvalTime!).toLocaleString('zh-CN'),
        approvalComment: currentApprovalRecord.approvalComment || '同意',
      }

      // 1.3 构建通知请求
      const notificationRequest: NotificationRequest = {
        notificationType: NotificationType.APPROVAL,
        channels: [NotificationChannel.INBOX, NotificationChannel.EMAIL, NotificationChannel.SMS],
        receiverIds: [approvalStatus.submitterId],
        receivers: [receiver],
        templateCode: MessageTemplateType.APPROVAL_APPROVED,
        title: '您的申请已审批通过',
        content: `尊敬的${variables.receiverName}，您的申请已审批通过。\n\n申请标题：${variables.title}\n审批人：${variables.approverName}\n审批时间：${variables.approvalTime}\n审批意见：${variables.approvalComment}`,
        variables,
        priority: NotificationPriority.HIGH,
        businessType: businessInfo.businessCode,
        businessId: businessInfo.businessId,
      }

      // 1.4 发送通知
      await this.notificationService.sendNotification(notificationRequest)

      console.log(`审批通过通知发送成功: ${businessInfo.businessCode}-${businessInfo.businessId}`)
    } catch (error) {
      console.error('发送审批通过通知失败:', error)
      throw error
    }
  }

  /**
   * 发送审批驳回通知
   * @param approvalStatus 审批状态
   * @param currentApprovalRecord 当前审批记录
   * @param businessInfo 业务信息
   */
  async sendApprovalRejectedNotification(
    approvalStatus: BusinessApprovalStatus,
    currentApprovalRecord: ApprovalRecord,
    businessInfo: { businessCode: string; businessId: number; businessTitle: string }
  ): Promise<void> {
    try {
      // 1.1 构建接收人信息
      const receiver: NotificationReceiver = {
        userId: approvalStatus.submitterId,
        userName: approvalStatus.submitterName,
      }

      // 1.2 构建消息变量
      const variables = {
        receiverName: approvalStatus.submitterName,
        title: businessInfo.businessTitle,
        approverName: currentApprovalRecord.approverName,
        approvalTime: new Date(currentApprovalRecord.approvalTime!).toLocaleString('zh-CN'),
        rejectReason: currentApprovalRecord.approvalComment || '不符合审批条件',
      }

      // 1.3 构建通知请求
      const notificationRequest: NotificationRequest = {
        notificationType: NotificationType.APPROVAL,
        channels: [NotificationChannel.INBOX, NotificationChannel.EMAIL, NotificationChannel.SMS],
        receiverIds: [approvalStatus.submitterId],
        receivers: [receiver],
        templateCode: MessageTemplateType.APPROVAL_REJECTED,
        title: '您的申请已被驳回',
        content: `尊敬的${variables.receiverName}，您的申请已被驳回。\n\n申请标题：${variables.title}\n审批人：${variables.approverName}\n审批时间：${variables.approvalTime}\n驳回原因：${variables.rejectReason}`,
        variables,
        priority: NotificationPriority.HIGH,
        businessType: businessInfo.businessCode,
        businessId: businessInfo.businessId,
      }

      // 1.4 发送通知
      await this.notificationService.sendNotification(notificationRequest)

      console.log(`审批驳回通知发送成功: ${businessInfo.businessCode}-${businessInfo.businessId}`)
    } catch (error) {
      console.error('发送审批驳回通知失败:', error)
      throw error
    }
  }

  /**
   * 发送审批转交通知
   * @param approvalStatus 审批状态
   * @param currentApprovalRecord 当前审批记录
   * @param transferTo 转交目标人信息
   * @param businessInfo 业务信息
   */
  async sendApprovalTransferNotification(
    approvalStatus: BusinessApprovalStatus,
    currentApprovalRecord: ApprovalRecord,
    transferTo: { id: number; name: string; phone?: string; email?: string },
    businessInfo: { businessCode: string; businessId: number; businessTitle: string }
  ): Promise<void> {
    try {
      // 1.1 构建接收人列表（转交人和原审批人）
      const receivers: NotificationReceiver[] = [
        {
          userId: transferTo.id,
          userName: transferTo.name,
          phone: transferTo.phone,
          email: transferTo.email,
        },
        {
          userId: currentApprovalRecord.approverId,
          userName: currentApprovalRecord.approverName,
        },
      ]

      // 1.2 构建消息变量
      const variables = {
        receiverName: transferTo.name,
        transferToName: transferTo.name,
        title: businessInfo.businessTitle,
        transferFromName: currentApprovalRecord.approverName,
        transferTime: new Date().toLocaleString('zh-CN'),
      }

      // 1.3 构建通知请求
      const notificationRequest: NotificationRequest = {
        notificationType: NotificationType.APPROVAL,
        channels: [NotificationChannel.INBOX, NotificationChannel.EMAIL],
        receiverIds: [transferTo.id, currentApprovalRecord.approverId],
        receivers,
        templateCode: MessageTemplateType.APPROVAL_TRANSFER,
        title: '您的审批任务已被转交',
        content: `尊敬的${variables.receiverName}，您的审批任务已被转交给${variables.transferToName}。\n\n任务标题：${variables.title}\n转交人：${variables.transferFromName}\n转交时间：${variables.transferTime}`,
        variables,
        priority: NotificationPriority.HIGH,
        businessType: businessInfo.businessCode,
        businessId: businessInfo.businessId,
      }

      // 1.4 发送通知
      await this.notificationService.sendNotification(notificationRequest)

      console.log(`审批转交通知发送成功: ${businessInfo.businessCode}-${businessInfo.businessId}`)
    } catch (error) {
      console.error('发送审批转交通知失败:', error)
      throw error
    }
  }

  /**
   * 发送审批委派通知
   * @param approvalStatus 审批状态
   * @param currentApprovalRecord 当前审批记录
   * @param delegateTo 委派目标人信息
   * @param businessInfo 业务信息
   */
  async sendApprovalDelegateNotification(
    approvalStatus: BusinessApprovalStatus,
    currentApprovalRecord: ApprovalRecord,
    delegateTo: { id: number; name: string; phone?: string; email?: string },
    businessInfo: { businessCode: string; businessId: number; businessTitle: string }
  ): Promise<void> {
    try {
      // 1.1 构建接收人列表（委派人和原审批人）
      const receivers: NotificationReceiver[] = [
        {
          userId: delegateTo.id,
          userName: delegateTo.name,
          phone: delegateTo.phone,
          email: delegateTo.email,
        },
        {
          userId: currentApprovalRecord.approverId,
          userName: currentApprovalRecord.approverName,
        },
      ]

      // 1.2 构建消息变量
      const variables = {
        receiverName: delegateTo.name,
        delegateToName: delegateTo.name,
        title: businessInfo.businessTitle,
        delegateFromName: currentApprovalRecord.approverName,
        delegateTime: new Date().toLocaleString('zh-CN'),
      }

      // 1.3 构建通知请求
      const notificationRequest: NotificationRequest = {
        notificationType: NotificationType.APPROVAL,
        channels: [NotificationChannel.INBOX, NotificationChannel.EMAIL],
        receiverIds: [delegateTo.id, currentApprovalRecord.approverId],
        receivers,
        templateCode: MessageTemplateType.APPROVAL_DELEGATE,
        title: '您的审批任务已被委派',
        content: `尊敬的${variables.receiverName}，您的审批任务已被委派给${variables.delegateToName}。\n\n任务标题：${variables.title}\n委派人：${variables.delegateFromName}\n委派时间：${variables.delegateTime}`,
        variables,
        priority: NotificationPriority.HIGH,
        businessType: businessInfo.businessCode,
        businessId: businessInfo.businessId,
      }

      // 1.4 发送通知
      await this.notificationService.sendNotification(notificationRequest)

      console.log(`审批委派通知发送成功: ${businessInfo.businessCode}-${businessInfo.businessId}`)
    } catch (error) {
      console.error('发送审批委派通知失败:', error)
      throw error
    }
  }

  /**
   * 发送审批撤回通知
   * @param approvalStatus 审批状态
   * @param withdrawer 撤回人信息
   * @param businessInfo 业务信息
   */
  async sendApprovalWithdrawNotification(
    approvalStatus: BusinessApprovalStatus,
    withdrawer: { id: number; name: string },
    businessInfo: { businessCode: string; businessId: number; businessTitle: string }
  ): Promise<void> {
    try {
      // 1.1 获取当前审批人
      const currentApproverId = approvalStatus.currentNodeId
      const currentApproverName = approvalStatus.currentNodeName

      // 1.2 构建接收人信息
      const receiver: NotificationReceiver = {
        userId: currentApproverId,
        userName: currentApproverName,
      }

      // 1.3 构建消息变量
      const variables = {
        receiverName: currentApproverName,
        title: businessInfo.businessTitle,
        withdrawerName: withdrawer.name,
        withdrawTime: new Date().toLocaleString('zh-CN'),
      }

      // 1.4 构建通知请求
      const notificationRequest: NotificationRequest = {
        notificationType: NotificationType.APPROVAL,
        channels: [NotificationChannel.INBOX, NotificationChannel.EMAIL],
        receiverIds: [currentApproverId],
        receivers: [receiver],
        templateCode: MessageTemplateType.APPROVAL_WITHDRAW,
        title: '审批申请已被撤回',
        content: `尊敬的${variables.receiverName}，审批申请已被撤回。\n\n申请标题：${variables.title}\n撤回人：${variables.withdrawerName}\n撤回时间：${variables.withdrawTime}`,
        variables,
        priority: NotificationPriority.HIGH,
        businessType: businessInfo.businessCode,
        businessId: businessInfo.businessId,
      }

      // 1.5 发送通知
      await this.notificationService.sendNotification(notificationRequest)

      console.log(`审批撤回通知发送成功: ${businessInfo.businessCode}-${businessInfo.businessId}`)
    } catch (error) {
      console.error('发送审批撤回通知失败:', error)
      throw error
    }
  }

  /**
   * 发送审批完成通知
   * @param approvalStatus 审批状态
   * @param businessInfo 业务信息
   * @param relatedUsers 相关用户列表
   */
  async sendApprovalCompleteNotification(
    approvalStatus: BusinessApprovalStatus,
    businessInfo: { businessCode: string; businessId: number; businessTitle: string },
    relatedUsers: { id: number; name: string }[]
  ): Promise<void> {
    try {
      // 1.1 构建接收人列表
      const receivers: NotificationReceiver[] = relatedUsers.map(user => ({
        userId: user.id,
        userName: user.name,
      }))

      // 1.2 构建消息变量
      const variables = {
        receiverName: relatedUsers.map(u => u.name).join('、'),
        flowName: approvalStatus.flowName,
        title: businessInfo.businessTitle,
        completeTime: new Date(approvalStatus.completeTime!).toLocaleString('zh-CN'),
      }

      // 1.3 构建通知请求
      const notificationRequest: NotificationRequest = {
        notificationType: NotificationType.APPROVAL,
        channels: [NotificationChannel.INBOX, NotificationChannel.EMAIL],
        receiverIds: relatedUsers.map(u => u.id),
        receivers,
        templateCode: MessageTemplateType.APPROVAL_COMPLETE,
        title: '审批流程已完成',
        content: `尊敬的${variables.receiverName}，审批流程已完成。\n\n流程名称：${variables.flowName}\n业务标题：${variables.title}\n完成时间：${variables.completeTime}`,
        variables,
        priority: NotificationPriority.HIGH,
        businessType: businessInfo.businessCode,
        businessId: businessInfo.businessId,
      }

      // 1.4 发送通知
      await this.notificationService.sendNotification(notificationRequest)

      console.log(`审批完成通知发送成功: ${businessInfo.businessCode}-${businessInfo.businessId}`)
    } catch (error) {
      console.error('发送审批完成通知失败:', error)
      throw error
    }
  }

  // ============================================
  // 2. 辅助方法
  // ============================================

  /**
   * 获取通知渠道
   * @param priority 优先级
   * @returns 通知渠道列表
   */
  private getNotificationChannels(priority: NotificationPriority): NotificationChannel[] {
    switch (priority) {
      case NotificationPriority.URGENT:
        return [NotificationChannel.INBOX, NotificationChannel.EMAIL, NotificationChannel.SMS]
      case NotificationPriority.HIGH:
        return [NotificationChannel.INBOX, NotificationChannel.EMAIL]
      case NotificationPriority.MEDIUM:
        return [NotificationChannel.INBOX]
      case NotificationPriority.LOW:
        return [NotificationChannel.INBOX]
      default:
        return [NotificationChannel.INBOX]
    }
  }

  /**
   * 获取通知优先级
   * @param businessCode 业务代码
   * @returns 通知优先级
   */
  private getNotificationPriority(businessCode: string): NotificationPriority {
    // 根据业务类型确定通知优先级
    const highPriorityBusinesses = ['LEAVE', 'TRANSFER', 'RESIGNATION']
    if (highPriorityBusinesses.includes(businessCode)) {
      return NotificationPriority.HIGH
    }
    return NotificationPriority.MEDIUM
  }
}

export default NotificationIntegrationService
