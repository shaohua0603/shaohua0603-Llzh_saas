/**
 * 消息通知核心服务
 * 负责统一的消息通知接口、消息模板管理、消息发送等功能
 */

import type {
  NotificationRequest,
  NotificationRecord,
  NotificationChannel,
  NotificationType,
  NotificationPriority,
  NotificationStatus,
  SendNotificationResponse,
  BatchSendResponse,
  MessageTemplateConfig,
  MessageTemplateType,
  NotificationReceiver,
  NotificationAttachment,
  NotificationStatistics,
} from '@/types/notification'
import type { ApiResponse } from '@/types/response'
import { NotificationChannelName, NotificationStatusName } from '@/types/notification'
import { NotificationQueueService } from './notificationQueueService'
import { InboxNotificationService } from './inboxNotificationService'
import { EmailNotificationService } from './emailNotificationService'
import { SmsNotificationService } from './smsNotificationService'
import { MessageTemplateService } from './messageTemplateService'

/**
 * 消息通知核心服务
 */
export class NotificationService {
  private static instance: NotificationService

  private notificationQueueService: NotificationQueueService
  private inboxNotificationService: InboxNotificationService
  private emailNotificationService: EmailNotificationService
  private smsNotificationService: SmsNotificationService
  private messageTemplateService: MessageTemplateService

  private constructor() {
    this.notificationQueueService = NotificationQueueService.getInstance()
    this.inboxNotificationService = InboxNotificationService.getInstance()
    this.emailNotificationService = EmailNotificationService.getInstance()
    this.smsNotificationService = SmsNotificationService.getInstance()
    this.messageTemplateService = MessageTemplateService.getInstance()
  }

  /**
   * 获取单例实例
   */
  static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService()
    }
    return NotificationService.instance
  }

  // ============================================
  // 1. 消息发送核心功能
  // ============================================

  /**
   * 发送消息通知
   * @param request 消息通知请求
   * @returns 发送结果
   */
  async sendNotification(request: NotificationRequest): Promise<SendNotificationResponse> {
    try {
      // 1.1 验证请求参数
      this.validateNotificationRequest(request)

      // 1.2 如果指定了模板，使用模板渲染消息
      if (request.templateCode) {
        request = await this.renderMessageTemplate(request)
      }

      // 1.3 创建消息通知记录
      const notificationRecord = await this.createNotificationRecord(request)

      // 1.4 为每个接收人创建通知记录
      const results: SendNotificationResponse['results'] = []

      for (const channel of request.channels) {
        for (const receiverId of request.receiverIds) {
          const receiver = request.receivers?.find(r => r.userId === receiverId)

          if (!receiver) {
            results.push({
              channel,
              status: NotificationStatus.FAILED,
              error: `接收人信息不存在: ${receiverId}`,
            })
            continue
          }

          // 1.5 根据渠道发送通知
          const result = await this.sendNotificationByChannel(
            notificationRecord.id!,
            channel,
            receiver,
            request
          )

          results.push(result)
        }
      }

      return {
        notificationId: notificationRecord.id!,
        status: this.getOverallStatus(results),
        results,
      }
    } catch (error) {
      console.error('发送消息通知失败:', error)
      throw error
    }
  }

  /**
   * 批量发送消息通知
   * @param requests 消息通知请求列表
   * @returns 批量发送结果
   */
  async batchSendNotifications(requests: NotificationRequest[]): Promise<BatchSendResponse> {
    try {
      const successCount: number[] = []
      const failureCount: number[] = []
      const errors: BatchSendResponse['errors'] = []

      for (const request of requests) {
        try {
          const result = await this.sendNotification(request)

          if (result.status === NotificationStatus.SUCCESS) {
            successCount.push(...request.receiverIds)
          } else {
            failureCount.push(...request.receiverIds)

            // 收集失败信息
            result.results.forEach(r => {
              if (r.status === NotificationStatus.FAILED && r.error) {
                errors.push({
                  receiverId: request.receiverIds[0],
                  receiverName: request.receivers?.[0]?.userName || '未知',
                  error: r.error,
                })
              }
            })
          }
        } catch (error) {
          failureCount.push(...request.receiverIds)
          errors.push({
            receiverId: request.receiverIds[0],
            receiverName: request.receivers?.[0]?.userName || '未知',
            error: error instanceof Error ? error.message : '发送失败',
          })
        }
      }

      return {
        successCount: successCount.length,
        failureCount: failureCount.length,
        successReceiverIds: successCount,
        failureReceiverIds: failureCount,
        errors,
      }
    } catch (error) {
      console.error('批量发送消息通知失败:', error)
      throw error
    }
  }

  /**
   * 重新发送消息通知
   * @param notificationId 通知ID
   * @returns 重新发送结果
   */
  async resendNotification(notificationId: number): Promise<void> {
    try {
      // 1.1 获取通知记录
      const notificationRecord = await this.getNotificationRecord(notificationId)
      if (!notificationRecord) {
        throw new Error('通知记录不存在')
      }

      // 1.2 检查是否可以重新发送
      if (notificationRecord.sendCount >= notificationRecord.maxRetryCount) {
        throw new Error('已达到最大重试次数')
      }

      // 1.3 更新发送次数
      notificationRecord.sendCount += 1

      // 1.4 根据渠道重新发送
      await this.resendNotificationByChannel(notificationRecord)
    } catch (error) {
      console.error('重新发送消息通知失败:', error)
      throw error
    }
  }

  /**
   * 取消消息通知
   * @param notificationId 通知ID
   * @returns 取消结果
   */
  async cancelNotification(notificationId: number): Promise<void> {
    try {
      // 1.1 获取通知记录
      const notificationRecord = await this.getNotificationRecord(notificationId)
      if (!notificationRecord) {
        throw new Error('通知记录不存在')
      }

      // 1.2 检查是否可以取消
      if (notificationRecord.status !== NotificationStatus.PENDING) {
        throw new Error('只能取消待发送的消息')
      }

      // 1.3 更新通知状态
      await this.updateNotificationStatus(notificationId, NotificationStatus.CANCELLED)

      // 1.4 取消消息队列任务
      await this.notificationQueueService.cancelTaskByNotificationId(notificationId)
    } catch (error) {
      console.error('取消消息通知失败:', error)
      throw error
    }
  }

  // ============================================
  // 2. 消息模板功能
  // ============================================

  /**
   * 渲染消息模板
   * @param request 消息通知请求
   * @returns 渲染后的消息通知请求
   */
  private async renderMessageTemplate(
    request: NotificationRequest
  ): Promise<NotificationRequest> {
    try {
      // 1.1 获取消息模板
      const template = await this.messageTemplateService.getTemplateByCode(request.templateCode!)
      if (!template) {
        throw new Error('消息模板不存在')
      }

      // 1.2 渲染模板标题
      request.title = this.renderTemplate(template.title, request.variables || {})

      // 1.3 渲染模板内容
      request.content = this.renderTemplate(template.content, request.variables || {})

      // 1.4 更新通知类型
      request.notificationType = template.templateType

      return request
    } catch (error) {
      console.error('渲染消息模板失败:', error)
      throw error
    }
  }

  /**
   * 渲染模板内容
   * @param template 模板内容
   * @param variables 变量
   * @returns 渲染后的内容
   */
  private renderTemplate(template: string, variables: Record<string, any>): string {
    let result = template

    // 替换变量占位符 {{variable}}
    for (const [key, value] of Object.entries(variables)) {
      const regex = new RegExp(`\\{\\{\\s*${key}\\s*\\}\\}`, 'g')
      result = result.replace(regex, String(value))
    }

    return result
  }

  // ============================================
  // 3. 按渠道发送消息
  // ============================================

  /**
   * 根据渠道发送消息
   * @param notificationId 通知ID
   * @param channel 通知渠道
   * @param receiver 接收人
   * @param request 消息通知请求
   * @returns 发送结果
   */
  private async sendNotificationByChannel(
    notificationId: number,
    channel: NotificationChannel,
    receiver: NotificationReceiver,
    request: NotificationRequest
  ): Promise<SendNotificationResponse['results'][0]> {
    try {
      switch (channel) {
        case NotificationChannel.INBOX:
          return await this.inboxNotificationService.send(notificationId, receiver, request)

        case NotificationChannel.EMAIL:
          return await this.emailNotificationService.send(notificationId, receiver, request)

        case NotificationChannel.SMS:
          return await this.smsNotificationService.send(notificationId, receiver, request)

        default:
          return {
            channel,
            status: NotificationStatus.FAILED,
            error: `不支持的通知渠道: ${NotificationChannelName[channel]}`,
          }
      }
    } catch (error) {
      console.error(`通过${NotificationChannelName[channel]}发送消息失败:`, error)
      return {
        channel,
        status: NotificationStatus.FAILED,
        error: error instanceof Error ? error.message : '发送失败',
      }
    }
  }

  /**
   * 根据渠道重新发送消息
   * @param notificationRecord 通知记录
   */
  private async resendNotificationByChannel(
    notificationRecord: NotificationRecord
  ): Promise<void> {
    try {
      switch (notificationRecord.channel) {
        case NotificationChannel.INBOX:
          await this.inboxNotificationService.resend(notificationRecord.id)
          break

        case NotificationChannel.EMAIL:
          await this.emailNotificationService.resend(notificationRecord.id)
          break

        case NotificationChannel.SMS:
          await this.smsNotificationService.resend(notificationRecord.id)
          break

        default:
          throw new Error(`不支持的通知渠道: ${NotificationChannelName[notificationRecord.channel]}`)
      }
    } catch (error) {
      console.error('重新发送消息失败:', error)
      throw error
    }
  }

  // ============================================
  // 4. 消息队列集成
  // ============================================

  /**
   * 将消息添加到队列
   * @param notificationId 通知ID
   * @param channel 通知渠道
   * @param priority 优先级
   * @param delayTime 延迟时间
   */
  async addToQueue(
    notificationId: number,
    channel: NotificationChannel,
    priority: NotificationPriority,
    delayTime?: string
  ): Promise<void> {
    try {
      await this.notificationQueueService.addTask({
        notificationId,
        channel,
        priority,
        delayTime,
      })
    } catch (error) {
      console.error('添加消息到队列失败:', error)
      throw error
    }
  }

  /**
   * 处理队列中的消息
   */
  async processQueue(): Promise<void> {
    try {
      await this.notificationQueueService.processTasks()
    } catch (error) {
      console.error('处理消息队列失败:', error)
      throw error
    }
  }

  // ============================================
  // 5. 消息记录管理
  // ============================================

  /**
   * 创建消息通知记录
   * @param request 消息通知请求
   * @returns 消息通知记录
   */
  private async createNotificationRecord(
    request: NotificationRequest
  ): Promise<NotificationRecord> {
    // TODO: 实现创建消息通知记录的逻辑
    return {
      id: Date.now(),
      notificationType: request.notificationType,
      notificationTypeName: '',
      channel: request.channels[0],
      channelName: NotificationChannelName[request.channels[0]],
      receiverId: request.receiverIds[0],
      receiverName: request.receivers?.[0]?.userName || '',
      title: request.title,
      content: request.content,
      priority: request.priority,
      priorityName: '',
      status: NotificationStatus.PENDING,
      statusName: NotificationStatusName[NotificationStatus.PENDING],
      sendCount: 0,
      maxRetryCount: 3,
      businessType: request.businessType,
      businessId: request.businessId,
      attachments: request.attachments,
      createTime: new Date().toISOString(),
    }
  }

  /**
   * 获取消息通知记录
   * @param notificationId 通知ID
   * @returns 消息通知记录
   */
  private async getNotificationRecord(
    notificationId: number
  ): Promise<NotificationRecord | null> {
    // TODO: 实现获取消息通知记录的逻辑
    return null
  }

  /**
   * 更新消息通知状态
   * @param notificationId 通知ID
   * @param status 状态
   */
  private async updateNotificationStatus(
    notificationId: number,
    status: NotificationStatus
  ): Promise<void> {
    // TODO: 实现更新消息通知状态的逻辑
  }

  /**
   * 获取消息通知统计
   * @param params 查询参数
   * @returns 消息通知统计
   */
  async getStatistics(params?: {
    startDate?: string
    endDate?: string
  }): Promise<NotificationStatistics> {
    // TODO: 实现获取消息通知统计的逻辑
    return {
      total: 0,
      pending: 0,
      sending: 0,
      success: 0,
      failed: 0,
      cancelled: 0,
      byChannel: [],
      byType: [],
      byDate: [],
    }
  }

  // ============================================
  // 6. 辅助方法
  // ============================================

  /**
   * 验证消息通知请求
   * @param request 消息通知请求
   */
  private validateNotificationRequest(request: NotificationRequest): void {
    if (!request.notificationType) {
      throw new Error('通知类型不能为空')
    }

    if (!request.channels || request.channels.length === 0) {
      throw new Error('通知渠道不能为空')
    }

    if (!request.receiverIds || request.receiverIds.length === 0) {
      throw new Error('接收人不能为空')
    }

    if (!request.title) {
      throw new Error('消息标题不能为空')
    }

    if (!request.content) {
      throw new Error('消息内容不能为空')
    }

    if (!request.priority) {
      throw new Error('消息优先级不能为空')
    }
  }

  /**
   * 获取整体发送状态
   * @param results 发送结果列表
   * @returns 整体状态
   */
  private getOverallStatus(
    results: SendNotificationResponse['results']
  ): NotificationStatus {
    const hasFailed = results.some(r => r.status === NotificationStatus.FAILED)
    const hasPending = results.some(r => r.status === NotificationStatus.PENDING)

    if (hasFailed) {
      return NotificationStatus.FAILED
    } else if (hasPending) {
      return NotificationStatus.PENDING
    } else {
      return NotificationStatus.SUCCESS
    }
  }

  /**
   * 获取消息模板服务
   * @returns 消息模板服务
   */
  getMessageTemplateService(): MessageTemplateService {
    return this.messageTemplateService
  }

  /**
   * 获取站内信通知服务
   * @returns 站内信通知服务
   */
  getInboxNotificationService(): InboxNotificationService {
    return this.inboxNotificationService
  }

  /**
   * 获取邮件通知服务
   * @returns 邮件通知服务
   */
  getEmailNotificationService(): EmailNotificationService {
    return this.emailNotificationService
  }

  /**
   * 获取短信通知服务
   * @returns 短信通知服务
   */
  getSmsNotificationService(): SmsNotificationService {
    return this.smsNotificationService
  }

  /**
   * 获取消息队列服务
   * @returns 消息队列服务
   */
  getNotificationQueueService(): NotificationQueueService {
    return this.notificationQueueService
  }
}

export default NotificationService
