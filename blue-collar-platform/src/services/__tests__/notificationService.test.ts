/**
 * 消息通知服务单元测试
 * 测试消息通知服务的核心功能
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { NotificationService } from '../notificationService'
import type {
  NotificationRequest,
  NotificationChannel,
  NotificationType,
  NotificationPriority,
  NotificationReceiver,
} from '@/types/notification'

describe('NotificationService', () => {
  let notificationService: NotificationService

  beforeEach(() => {
    notificationService = NotificationService.getInstance()
  })

  describe('sendNotification', () => {
    it('应该成功发送站内信通知', async () => {
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

      const result = await notificationService.sendNotification(request)

      expect(result).toBeDefined()
      expect(result.notificationId).toBeDefined()
      expect(result.status).toBe('success')
      expect(result.results).toHaveLength(1)
      expect(result.results[0].channel).toBe(NotificationChannel.INBOX)
      expect(result.results[0].status).toBe('success')
    })

    it('应该成功发送邮件通知', async () => {
      const request: NotificationRequest = {
        notificationType: NotificationType.APPROVAL,
        channels: [NotificationChannel.EMAIL],
        receiverIds: [1],
        receivers: [
          {
            userId: 1,
            userName: '张三',
            email: 'test@example.com',
          },
        ],
        title: '测试通知',
        content: '这是一条测试通知',
        priority: NotificationPriority.HIGH,
      }

      const result = await notificationService.sendNotification(request)

      expect(result).toBeDefined()
      expect(result.results).toHaveLength(1)
      expect(result.results[0].channel).toBe(NotificationChannel.EMAIL)
    })

    it('应该成功发送短信通知', async () => {
      const request: NotificationRequest = {
        notificationType: NotificationType.APPROVAL,
        channels: [NotificationChannel.SMS],
        receiverIds: [1],
        receivers: [
          {
            userId: 1,
            userName: '张三',
            phone: '13800138000',
          },
        ],
        title: '测试通知',
        content: '这是一条测试通知',
        priority: NotificationPriority.HIGH,
      }

      const result = await notificationService.sendNotification(request)

      expect(result).toBeDefined()
      expect(result.results).toHaveLength(1)
      expect(result.results[0].channel).toBe(NotificationChannel.SMS)
    })

    it('应该成功发送多渠道通知', async () => {
      const request: NotificationRequest = {
        notificationType: NotificationType.APPROVAL,
        channels: [NotificationChannel.INBOX, NotificationChannel.EMAIL, NotificationChannel.SMS],
        receiverIds: [1],
        receivers: [
          {
            userId: 1,
            userName: '张三',
            email: 'test@example.com',
            phone: '13800138000',
          },
        ],
        title: '测试通知',
        content: '这是一条测试通知',
        priority: NotificationPriority.HIGH,
      }

      const result = await notificationService.sendNotification(request)

      expect(result).toBeDefined()
      expect(result.results).toHaveLength(3)
    })

    it('应该验证请求参数', async () => {
      const request: NotificationRequest = {
        notificationType: NotificationType.APPROVAL,
        channels: [],
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

      await expect(notificationService.sendNotification(request)).rejects.toThrow('通知渠道不能为空')
    })
  })

  describe('batchSendNotifications', () => {
    it('应该成功批量发送通知', async () => {
      const requests: NotificationRequest[] = [
        {
          notificationType: NotificationType.APPROVAL,
          channels: [NotificationChannel.INBOX],
          receiverIds: [1],
          receivers: [
            {
              userId: 1,
              userName: '张三',
            },
          ],
          title: '测试通知1',
          content: '这是一条测试通知1',
          priority: NotificationPriority.HIGH,
        },
        {
          notificationType: NotificationType.APPROVAL,
          channels: [NotificationChannel.INBOX],
          receiverIds: [2],
          receivers: [
            {
              userId: 2,
              userName: '李四',
            },
          ],
          title: '测试通知2',
          content: '这是一条测试通知2',
          priority: NotificationPriority.HIGH,
        },
      ]

      const result = await notificationService.batchSendNotifications(requests)

      expect(result).toBeDefined()
      expect(result.successCount).toBe(2)
      expect(result.failureCount).toBe(0)
      expect(result.successReceiverIds).toHaveLength(2)
    })

    it('应该处理部分失败的情况', async () => {
      const requests: NotificationRequest[] = [
        {
          notificationType: NotificationType.APPROVAL,
          channels: [NotificationChannel.INBOX],
          receiverIds: [1],
          receivers: [
            {
              userId: 1,
              userName: '张三',
            },
          ],
          title: '测试通知1',
          content: '这是一条测试通知1',
          priority: NotificationPriority.HIGH,
        },
        {
          notificationType: NotificationType.APPROVAL,
          channels: [NotificationChannel.EMAIL],
          receiverIds: [2],
          receivers: [
            {
              userId: 2,
              userName: '李四',
              // 缺少邮箱，会导致发送失败
            },
          ],
          title: '测试通知2',
          content: '这是一条测试通知2',
          priority: NotificationPriority.HIGH,
        },
      ]

      const result = await notificationService.batchSendNotifications(requests)

      expect(result).toBeDefined()
      expect(result.successCount).toBe(1)
      expect(result.failureCount).toBe(1)
    })
  })

  describe('resendNotification', () => {
    it('应该成功重新发送通知', async () => {
      const notificationId = 1

      await expect(notificationService.resendNotification(notificationId)).resolves.not.toThrow()
    })

    it('应该在达到最大重试次数时抛出错误', async () => {
      const notificationId = 999

      await expect(notificationService.resendNotification(notificationId)).rejects.toThrow('已达到最大重试次数')
    })
  })

  describe('cancelNotification', () => {
    it('应该成功取消待发送的通知', async () => {
      const notificationId = 1

      await expect(notificationService.cancelNotification(notificationId)).resolves.not.toThrow()
    })

    it('应该在通知已发送时抛出错误', async () => {
      const notificationId = 999

      await expect(notificationService.cancelNotification(notificationId)).rejects.toThrow('只能取消待发送的消息')
    })
  })

  describe('getStatistics', () => {
    it('应该成功获取通知统计', async () => {
      const statistics = await notificationService.getStatistics()

      expect(statistics).toBeDefined()
      expect(statistics.total).toBeDefined()
      expect(statistics.pending).toBeDefined()
      expect(statistics.sending).toBeDefined()
      expect(statistics.success).toBeDefined()
      expect(statistics.failed).toBeDefined()
      expect(statistics.cancelled).toBeDefined()
      expect(statistics.byChannel).toBeDefined()
      expect(statistics.byType).toBeDefined()
      expect(statistics.byDate).toBeDefined()
    })
  })
})
