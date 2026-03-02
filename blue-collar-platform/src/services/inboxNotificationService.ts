/**
 * 站内信通知服务
 * 负责站内信的发送、接收、阅读状态管理等功能
 */

import type {
  InboxMessage,
  NotificationReceiver,
  NotificationRequest,
  NotificationChannel,
  NotificationStatus,
  InboxMessageQueryParams,
  InboxMessageResponse,
  InboxMessageStatistics,
} from '@/types/notification'
import { NotificationStatusName } from '@/types/notification'

/**
 * 站内信通知服务
 */
export class InboxNotificationService {
  private static instance: InboxNotificationService

  // 站内信存储（模拟数据库）
  private messages: Map<number, InboxMessage> = new Map()

  // 未读消息计数（按用户）
  private unreadCounts: Map<number, number> = new Map()

  private constructor() {}

  /**
   * 获取单例实例
   */
  static getInstance(): InboxNotificationService {
    if (!InboxNotificationService.instance) {
      InboxNotificationService.instance = new InboxNotificationService()
    }
    return InboxNotificationService.instance
  }

  // ============================================
  // 1. 发送站内信
  // ============================================

  /**
   * 发送站内信
   * @param notificationId 通知ID
   * @param receiver 接收人
   * @param request 消息通知请求
   * @returns 发送结果
   */
  async send(
    notificationId: number,
    receiver: NotificationReceiver,
    request: NotificationRequest
  ): Promise<{ channel: NotificationChannel; status: NotificationStatus; recordId?: number }> {
    try {
      // 1.1 创建站内信消息
      const message: InboxMessage = {
        id: Date.now() + Math.random(),
        type: request.notificationType,
        typeName: this.getTypeName(request.notificationType),
        title: request.title,
        content: request.content,
        senderId: request.senderId,
        senderName: request.senderName,
        receiverId: receiver.userId,
        receiverName: receiver.userName,
        priority: request.priority,
        priorityName: this.getPriorityName(request.priority),
        readStatus: false,
        businessType: request.businessType,
        businessId: request.businessId,
        attachments: request.attachments,
        sendTime: new Date().toISOString(),
        createTime: new Date().toISOString(),
      }

      // 1.2 保存站内信
      this.messages.set(message.id, message)

      // 1.3 更新未读计数
      const currentCount = this.unreadCounts.get(receiver.userId) || 0
      this.unreadCounts.set(receiver.userId, currentCount + 1)

      // 1.4 触发实时通知（WebSocket推送）
      await this.triggerRealtimeNotification(receiver.userId, message)

      console.log(`站内信发送成功: ${message.id}, 接收人: ${receiver.userName}`)

      return {
        channel: NotificationChannel.INBOX,
        status: NotificationStatus.SUCCESS,
        recordId: message.id,
      }
    } catch (error) {
      console.error('发送站内信失败:', error)
      return {
        channel: NotificationChannel.INBOX,
        status: NotificationStatus.FAILED,
      }
    }
  }

  /**
   * 批量发送站内信
   * @param notificationId 通知ID
   * @param receivers 接收人列表
   * @param request 消息通知请求
   * @returns 发送结果
   */
  async batchSend(
    notificationId: number,
    receivers: NotificationReceiver[],
    request: NotificationRequest
  ): Promise<{ successCount: number; failureCount: number; results: number[] }> {
    try {
      const successResults: number[] = []
      let failureCount = 0

      for (const receiver of receivers) {
        const result = await this.send(notificationId, receiver, request)
        if (result.status === NotificationStatus.SUCCESS && result.recordId) {
          successResults.push(result.recordId)
        } else {
          failureCount++
        }
      }

      return {
        successCount: successResults.length,
        failureCount,
        results: successResults,
      }
    } catch (error) {
      console.error('批量发送站内信失败:', error)
      throw error
    }
  }

  /**
   * 重新发送站内信
   * @param messageId 消息ID
   */
  async resend(messageId: number): Promise<void> {
    try {
      const message = this.messages.get(messageId)
      if (!message) {
        throw new Error('站内信不存在')
      }

      // 重新发送站内信
      console.log(`重新发送站内信: ${messageId}`)
    } catch (error) {
      console.error('重新发送站内信失败:', error)
      throw error
    }
  }

  // ============================================
  // 2. 站内信查询
  // ============================================

  /**
   * 获取站内信列表
   * @param params 查询参数
   * @returns 站内信列表
   */
  async getMessageList(params: InboxMessageQueryParams): Promise<InboxMessageResponse> {
    try {
      // 1.1 获取所有消息
      let messages = Array.from(this.messages.values())

      // 1.2 按接收人筛选
      if (params.receiverId) {
        messages = messages.filter(m => m.receiverId === params.receiverId)
      }

      // 1.3 按类型筛选
      if (params.type) {
        messages = messages.filter(m => m.type === params.type)
      }

      // 1.4 按阅读状态筛选
      if (params.readStatus !== undefined) {
        messages = messages.filter(m => m.readStatus === params.readStatus)
      }

      // 1.5 按优先级筛选
      if (params.priority) {
        messages = messages.filter(m => m.priority === params.priority)
      }

      // 1.6 按业务类型筛选
      if (params.businessType) {
        messages = messages.filter(m => m.businessType === params.businessType)
      }

      // 1.7 按业务ID筛选
      if (params.businessId) {
        messages = messages.filter(m => m.businessId === params.businessId)
      }

      // 1.8 按关键词搜索
      if (params.keyword) {
        const keyword = params.keyword.toLowerCase()
        messages = messages.filter(
          m =>
            m.title.toLowerCase().includes(keyword) ||
            m.content.toLowerCase().includes(keyword)
        )
      }

      // 1.9 按时间范围筛选
      if (params.startDate) {
        messages = messages.filter(m => m.sendTime >= params.startDate!)
      }
      if (params.endDate) {
        messages = messages.filter(m => m.sendTime <= params.endDate!)
      }

      // 1.10 排序（按发送时间倒序）
      messages.sort((a, b) => {
        return new Date(b.sendTime).getTime() - new Date(a.sendTime).getTime()
      })

      // 1.11 分页
      const total = messages.length
      const start = (params.page - 1) * params.pageSize
      const end = start + params.pageSize
      const list = messages.slice(start, end)

      return {
        code: 200,
        message: '获取成功',
        data: {
          list,
          total,
          page: params.page,
          pageSize: params.pageSize,
          totalPages: Math.ceil(total / params.pageSize),
        },
        timestamp: Date.now(),
      }
    } catch (error) {
      console.error('获取站内信列表失败:', error)
      throw error
    }
  }

  /**
   * 获取站内信详情
   * @param messageId 消息ID
   * @returns 站内信详情
   */
  async getMessageDetail(messageId: number): Promise<InboxMessage | null> {
    try {
      return this.messages.get(messageId) || null
    } catch (error) {
      console.error('获取站内信详情失败:', error)
      throw error
    }
  }

  /**
   * 获取未读消息列表
   * @param receiverId 接收人ID
   * @returns 未读消息列表
   */
  async getUnreadMessages(receiverId: number): Promise<InboxMessage[]> {
    try {
      const messages = Array.from(this.messages.values())
      return messages
        .filter(m => m.receiverId === receiverId && !m.readStatus)
        .sort((a, b) => {
          return new Date(b.sendTime).getTime() - new Date(a.sendTime).getTime()
        })
    } catch (error) {
      console.error('获取未读消息列表失败:', error)
      throw error
    }
  }

  // ============================================
  // 3. 阅读状态管理
  // ============================================

  /**
   * 标记为已读
   * @param messageId 消息ID
   */
  async markAsRead(messageId: number): Promise<void> {
    try {
      const message = this.messages.get(messageId)
      if (!message) {
        throw new Error('站内信不存在')
      }

      if (!message.readStatus) {
        message.readStatus = true
        message.readTime = new Date().toISOString()

        // 更新未读计数
        const currentCount = this.unreadCounts.get(message.receiverId) || 0
        this.unreadCounts.set(message.receiverId, Math.max(0, currentCount - 1))

        console.log(`站内信已标记为已读: ${messageId}`)
      }
    } catch (error) {
      console.error('标记站内信为已读失败:', error)
      throw error
    }
  }

  /**
   * 批量标记为已读
   * @param messageIds 消息ID列表
   */
  async batchMarkAsRead(messageIds: number[]): Promise<void> {
    try {
      for (const messageId of messageIds) {
        await this.markAsRead(messageId)
      }
    } catch (error) {
      console.error('批量标记站内信为已读失败:', error)
      throw error
    }
  }

  /**
   * 标记为未读
   * @param messageId 消息ID
   */
  async markAsUnread(messageId: number): Promise<void> {
    try {
      const message = this.messages.get(messageId)
      if (!message) {
        throw new Error('站内信不存在')
      }

      if (message.readStatus) {
        message.readStatus = false
        message.readTime = undefined

        // 更新未读计数
        const currentCount = this.unreadCounts.get(message.receiverId) || 0
        this.unreadCounts.set(message.receiverId, currentCount + 1)

        console.log(`站内信已标记为未读: ${messageId}`)
      }
    } catch (error) {
      console.error('标记站内信为未读失败:', error)
      throw error
    }
  }

  /**
   * 全部标记为已读
   * @param receiverId 接收人ID
   */
  async markAllAsRead(receiverId: number): Promise<void> {
    try {
      const messages = Array.from(this.messages.values())
      const unreadMessages = messages.filter(m => m.receiverId === receiverId && !m.readStatus)

      for (const message of unreadMessages) {
        message.readStatus = true
        message.readTime = new Date().toISOString()
      }

      // 重置未读计数
      this.unreadCounts.set(receiverId, 0)

      console.log(`用户${receiverId}的所有站内信已标记为已读`)
    } catch (error) {
      console.error('全部标记站内信为已读失败:', error)
      throw error
    }
  }

  // ============================================
  // 4. 站内信删除
  // ============================================

  /**
   * 删除站内信
   * @param messageId 消息ID
   */
  async deleteMessage(messageId: number): Promise<void> {
    try {
      const message = this.messages.get(messageId)
      if (!message) {
        throw new Error('站内信不存在')
      }

      // 如果是未读消息，更新未读计数
      if (!message.readStatus) {
        const currentCount = this.unreadCounts.get(message.receiverId) || 0
        this.unreadCounts.set(message.receiverId, Math.max(0, currentCount - 1))
      }

      this.messages.delete(messageId)
      console.log(`站内信已删除: ${messageId}`)
    } catch (error) {
      console.error('删除站内信失败:', error)
      throw error
    }
  }

  /**
   * 批量删除站内信
   * @param messageIds 消息ID列表
   */
  async batchDeleteMessages(messageIds: number[]): Promise<void> {
    try {
      for (const messageId of messageIds) {
        await this.deleteMessage(messageId)
      }
    } catch (error) {
      console.error('批量删除站内信失败:', error)
      throw error
    }
  }

  // ============================================
  // 5. 站内信统计
  // ============================================

  /**
   * 获取站内信统计
   * @param receiverId 接收人ID（可选）
   * @returns 站内信统计
   */
  async getStatistics(receiverId?: number): Promise<InboxMessageStatistics> {
    try {
      let messages = Array.from(this.messages.values())

      if (receiverId) {
        messages = messages.filter(m => m.receiverId === receiverId)
      }

      const total = messages.length
      const unread = messages.filter(m => !m.readStatus).length
      const read = total - unread
      const urgent = messages.filter(m => m.priority === 'urgent').length
      const high = messages.filter(m => m.priority === 'high').length

      return {
        total,
        unread,
        read,
        urgent,
        high,
      }
    } catch (error) {
      console.error('获取站内信统计失败:', error)
      throw error
    }
  }

  /**
   * 获取未读消息数量
   * @param receiverId 接收人ID
   * @returns 未读消息数量
   */
  getUnreadCount(receiverId: number): number {
    return this.unreadCounts.get(receiverId) || 0
  }

  // ============================================
  // 6. 实时通知
  // ============================================

  /**
   * 触发实时通知
   * @param receiverId 接收人ID
   * @param message 站内信消息
   */
  private async triggerRealtimeNotification(
    receiverId: number,
    message: InboxMessage
  ): Promise<void> {
    try {
      // TODO: 通过WebSocket推送实时通知
      console.log(`触发实时通知: 接收人${receiverId}, 消息${message.id}`)
    } catch (error) {
      console.error('触发实时通知失败:', error)
    }
  }

  // ============================================
  // 7. 辅助方法
  // ============================================

  /**
   * 获取类型名称
   * @param type 类型
   * @returns 类型名称
   */
  private getTypeName(type: string): string {
    const typeNames: Record<string, string> = {
      system: '系统通知',
      approval: '审批通知',
      business: '业务通知',
      warning: '预警通知',
      reminder: '提醒通知',
      announcement: '公告通知',
    }
    return typeNames[type] || type
  }

  /**
   * 获取优先级名称
   * @param priority 优先级
   * @returns 优先级名称
   */
  private getPriorityName(priority: string): string {
    const priorityNames: Record<string, string> = {
      urgent: '紧急',
      high: '高',
      medium: '中',
      low: '低',
    }
    return priorityNames[priority] || priority
  }

  /**
   * 清空所有站内信
   */
  clearAllMessages(): void {
    this.messages.clear()
    this.unreadCounts.clear()
    console.log('所有站内信已清空')
  }
}

export default InboxNotificationService
