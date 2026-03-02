/**
 * 站内信通知服务单元测试
 * 测试站内信通知服务的核心功能
 */

import { describe, it, expect, beforeEach } from 'vitest'
import { InboxNotificationService } from '../inboxNotificationService'
import type {
  NotificationRequest,
  NotificationChannel,
  NotificationType,
  NotificationPriority,
  NotificationReceiver,
} from '@/types/notification'

describe('InboxNotificationService', () => {
  let inboxService: InboxNotificationService

  beforeEach(() => {
    inboxService = InboxNotificationService.getInstance()
    // 清空所有消息
    inboxService.clearAllMessages()
  })

  describe('send', () => {
    it('应该成功发送站内信', async () => {
      const request: NotificationRequest = {
        notificationType: NotificationType.APPROVAL,
        channels: [NotificationChannel.INBOX],
        receiverIds: [1],
        receivers: [
          {
            userId: 1,
            userName: '张三',
          },
        ],
        title: '测试通知',
        content: '这是一条测试通知',
        priority: NotificationPriority.HIGH,
      }

      const result = await inboxService.send(1, request.receivers[0], request)

      expect(result).toBeDefined()
      expect(result.channel).toBe(NotificationChannel.INBOX)
      expect(result.status).toBe('success')
      expect(result.recordId).toBeDefined()
    })

    it('应该正确更新未读计数', async () => {
      const receiver: NotificationReceiver = {
        userId: 1,
        userName: '张三',
      }

      const request: NotificationRequest = {
        notificationType: NotificationType.APPROVAL,
        channels: [NotificationChannel.INBOX],
        receiverIds: [1],
        receivers: [receiver],
        title: '测试通知',
        content: '这是一条测试通知',
        priority: NotificationPriority.HIGH,
      }

      await inboxService.send(1, receiver, request)

      const unreadCount = inboxService.getUnreadCount(1)
      expect(unreadCount).toBe(1)
    })
  })

  describe('getMessageList', () => {
    it('应该成功获取消息列表', async () => {
      const params = {
        page: 1,
        pageSize: 10,
      }

      const result = await inboxService.getMessageList(params)

      expect(result).toBeDefined()
      expect(result.code).toBe(200)
      expect(result.data).toBeDefined()
      expect(result.data.list).toBeDefined()
      expect(result.data.total).toBeDefined()
      expect(result.data.page).toBe(1)
      expect(result.data.pageSize).toBe(10)
    })

    it('应该支持按类型筛选', async () => {
      const params = {
        page: 1,
        pageSize: 10,
        type: NotificationType.APPROVAL,
      }

      const result = await inboxService.getMessageList(params)

      expect(result).toBeDefined()
      expect(result.data.list.every(m => m.type === NotificationType.APPROVAL)).toBe(true)
    })

    it('应该支持按阅读状态筛选', async () => {
      const params = {
        page: 1,
        pageSize: 10,
        readStatus: false,
      }

      const result = await inboxService.getMessageList(params)

      expect(result).toBeDefined()
      expect(result.data.list.every(m => m.readStatus === false)).toBe(true)
    })

    it('应该支持按优先级筛选', async () => {
      const params = {
        page: 1,
        pageSize: 10,
        priority: NotificationPriority.HIGH,
      }

      const result = await inboxService.getMessageList(params)

      expect(result).toBeDefined()
      expect(result.data.list.every(m => m.priority === NotificationPriority.HIGH)).toBe(true)
    })

    it('应该支持关键词搜索', async () => {
      const params = {
        page: 1,
        pageSize: 10,
        keyword: '测试',
      }

      const result = await inboxService.getMessageList(params)

      expect(result).toBeDefined()
      expect(
        result.data.list.every(m =>
          m.title.includes('测试') || m.content.includes('测试')
        )
      ).toBe(true)
    })
  })

  describe('markAsRead', () => {
    it('应该成功标记消息为已读', async () => {
      const messageId = 1

      await expect(inboxService.markAsRead(messageId)).resolves.not.toThrow()
    })

    it('应该正确更新未读计数', async () => {
      const receiver: NotificationReceiver = {
        userId: 1,
        userName: '张三',
      }

      const request: NotificationRequest = {
        notificationType: NotificationType.APPROVAL,
        channels: [NotificationChannel.INBOX],
        receiverIds: [1],
        receivers: [receiver],
        title: '测试通知',
        content: '这是一条测试通知',
        priority: NotificationPriority.HIGH,
      }

      await inboxService.send(1, receiver, request)

      const unreadCountBefore = inboxService.getUnreadCount(1)

      const messages = await inboxService.getMessageList({ page: 1, pageSize: 10 })
      if (messages.data.list.length > 0) {
        await inboxService.markAsRead(messages.data.list[0].id)
      }

      const unreadCountAfter = inboxService.getUnreadCount(1)

      expect(unreadCountAfter).toBe(unreadCountBefore - 1)
    })
  })

  describe('batchMarkAsRead', () => {
    it('应该成功批量标记消息为已读', async () => {
      const messageIds = [1, 2, 3]

      await expect(inboxService.batchMarkAsRead(messageIds)).resolves.not.toThrow()
    })
  })

  describe('markAsUnread', () => {
    it('应该成功标记消息为未读', async () => {
      const messageId = 1

      await expect(inboxService.markAsUnread(messageId)).resolves.not.toThrow()
    })

    it('应该正确更新未读计数', async () => {
      const receiver: NotificationReceiver = {
        userId: 1,
        userName: '张三',
      }

      const request: NotificationRequest = {
        notificationType: NotificationType.APPROVAL,
        channels: [NotificationChannel.INBOX],
        receiverIds: [1],
        receivers: [receiver],
        title: '测试通知',
        content: '这是一条测试通知',
        priority: NotificationPriority.HIGH,
      }

      await inboxService.send(1, receiver, request)

      const messages = await inboxService.getMessageList({ page: 1, pageSize: 10 })
      if (messages.data.list.length > 0) {
        await inboxService.markAsRead(messages.data.list[0].id)
      }

      const unreadCountBefore = inboxService.getUnreadCount(1)

      if (messages.data.list.length > 0) {
        await inboxService.markAsUnread(messages.data.list[0].id)
      }

      const unreadCountAfter = inboxService.getUnreadCount(1)

      expect(unreadCountAfter).toBe(unreadCountBefore + 1)
    })
  })

  describe('markAllAsRead', () => {
    it('应该成功全部标记为已读', async () => {
      const receiverId = 1

      await expect(inboxService.markAllAsRead(receiverId)).resolves.not.toThrow()
    })

    it('应该重置未读计数为0', async () => {
      const receiver: NotificationReceiver = {
        userId: 1,
        userName: '张三',
      }

      const request: NotificationRequest = {
        notificationType: NotificationType.APPROVAL,
        channels: [NotificationChannel.INBOX],
        receiverIds: [1],
        receivers: [receiver],
        title: '测试通知',
        content: '这是一条测试通知',
        priority: NotificationPriority.HIGH,
      }

      await inboxService.send(1, receiver, request)

      await inboxService.markAllAsRead(1)

      const unreadCount = inboxService.getUnreadCount(1)
      expect(unreadCount).toBe(0)
    })
  })

  describe('deleteMessage', () => {
    it('应该成功删除消息', async () => {
      const messageId = 1

      await expect(inboxService.deleteMessage(messageId)).resolves.not.toThrow()
    })

    it('应该在消息不存在时抛出错误', async () => {
      const messageId = 999

      await expect(inboxService.deleteMessage(messageId)).rejects.toThrow('站内信不存在')
    })
  })

  describe('batchDeleteMessages', () => {
    it('应该成功批量删除消息', async () => {
      const messageIds = [1, 2, 3]

      await expect(inboxService.batchDeleteMessages(messageIds)).resolves.not.toThrow()
    })
  })

  describe('getStatistics', () => {
    it('应该成功获取站内信统计', async () => {
      const statistics = await inboxService.getStatistics()

      expect(statistics).toBeDefined()
      expect(statistics.total).toBeDefined()
      expect(statistics.unread).toBeDefined()
      expect(statistics.read).toBeDefined()
      expect(statistics.urgent).toBeDefined()
      expect(statistics.high).toBeDefined()
    })

    it('应该正确统计消息数量', async () => {
      const receiver: NotificationReceiver = {
        userId: 1,
        userName: '张三',
      }

      const request: NotificationRequest = {
        notificationType: NotificationType.APPROVAL,
        channels: [NotificationChannel.INBOX],
        receiverIds: [1],
        receivers: [receiver],
        title: '测试通知',
        content: '这是一条测试通知',
        priority: NotificationPriority.HIGH,
      }

      await inboxService.send(1, receiver, request)

      const statistics = await inboxService.getStatistics(1)

      expect(statistics.total).toBeGreaterThanOrEqual(1)
      expect(statistics.unread).toBeGreaterThanOrEqual(1)
    })
  })

  describe('getUnreadCount', () => {
    it('应该成功获取未读消息数量', () => {
      const unreadCount = inboxService.getUnreadCount(1)

      expect(unreadCount).toBeDefined()
      expect(typeof unreadCount).toBe('number')
      expect(unreadCount).toBeGreaterThanOrEqual(0)
    })
  })
})
