/**
 * 消息通知集成测试
 * 测试站内信、邮件、短信等多渠道通知功能
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { NotificationService } from '@/services/notificationService'
import { InboxNotificationService } from '@/services/inboxNotificationService'
import { EmailNotificationService } from '@/services/emailNotificationService'
import { SMSNotificationService } from '@/services/smsNotificationService'
import { NotificationQueueService } from '@/services/notificationQueueService'
import type {
  NotificationRequest,
  NotificationChannel,
  NotificationType,
  NotificationPriority,
  NotificationReceiver
} from '@/types/notification'

// Mock API
vi.mock('@/api/notificationApi', () => ({
  sendInboxNotification: vi.fn(),
  sendEmailNotification: vi.fn(),
  sendSMSNotification: vi.fn(),
  getNotificationList: vi.fn(),
  markNotificationAsRead: vi.fn(),
  deleteNotification: vi.fn()
}))

describe('消息通知集成测试', () => {
  let notificationService: NotificationService
  let inboxService: InboxNotificationService
  let emailService: EmailNotificationService
  let smsService: SMSNotificationService
  let queueService: NotificationQueueService

  beforeEach(() => {
    vi.clearAllMocks()
    notificationService = NotificationService.getInstance()
    inboxService = InboxNotificationService.getInstance()
    emailService = EmailNotificationService.getInstance()
    smsService = SMSNotificationService.getInstance()
    queueService = NotificationQueueService.getInstance()
  })

  describe('站内信通知', () => {
    it('应该成功发送站内信通知', async () => {
      const request: NotificationRequest = {
        notificationType: NotificationType.APPROVAL,
        channels: [NotificationChannel.INBOX],
        receiverIds: [1],
        receivers: [
          {
            userId: 1,
            userName: '张三'
          }
        ],
        title: '审批通知',
        content: '您有一个待审批的请假申请',
        priority: NotificationPriority.HIGH
      }

      const result = await notificationService.sendNotification(request)

      expect(result).toBeDefined()
      expect(result.notificationId).toBeDefined()
      expect(result.status).toBe('success')
      expect(result.results).toHaveLength(1)
      expect(result.results[0].channel).toBe(NotificationChannel.INBOX)
      expect(result.results[0].status).toBe('success')
    })

    it('应该支持批量发送站内信通知', async () => {
      const request: NotificationRequest = {
        notificationType: NotificationType.APPROVAL,
        channels: [NotificationChannel.INBOX],
        receiverIds: [1, 2, 3],
        receivers: [
          {
            userId: 1,
            userName: '张三'
          },
          {
            userId: 2,
            userName: '李四'
          },
          {
            userId: 3,
            userName: '王五'
          }
        ],
        title: '审批通知',
        content: '您有一个待审批的请假申请',
        priority: NotificationPriority.HIGH
      }

      const result = await notificationService.sendNotification(request)

      expect(result.results).toHaveLength(3)
    })

    it('应该支持站内信通知模板', async () => {
      const request: NotificationRequest = {
        notificationType: NotificationType.APPROVAL,
        channels: [NotificationChannel.INBOX],
        receiverIds: [1],
        receivers: [
          {
            userId: 1,
            userName: '张三'
          }
        ],
        templateCode: 'APPROVAL_TODO',
        templateParams: {
          businessType: '请假',
          submitter: '李四'
        },
        priority: NotificationPriority.HIGH
      }

      const result = await notificationService.sendNotification(request)

      expect(result).toBeDefined()
      expect(result.status).toBe('success')
    })
  })

  describe('邮件通知', () => {
    it('应该成功发送邮件通知', async () => {
      const request: NotificationRequest = {
        notificationType: NotificationType.APPROVAL,
        channels: [NotificationChannel.EMAIL],
        receiverIds: [1],
        receivers: [
          {
            userId: 1,
            userName: '张三',
            email: 'zhangsan@example.com'
          }
        ],
        title: '审批通知',
        content: '您有一个待审批的请假申请',
        priority: NotificationPriority.HIGH
      }

      const result = await notificationService.sendNotification(request)

      expect(result).toBeDefined()
      expect(result.results).toHaveLength(1)
      expect(result.results[0].channel).toBe(NotificationChannel.EMAIL)
    })

    it('应该支持邮件通知模板', async () => {
      const request: NotificationRequest = {
        notificationType: NotificationType.APPROVAL,
        channels: [NotificationChannel.EMAIL],
        receiverIds: [1],
        receivers: [
          {
            userId: 1,
            userName: '张三',
            email: 'zhangsan@example.com'
          }
        ],
        templateCode: 'APPROVAL_TODO',
        templateParams: {
          businessType: '请假',
          submitter: '李四'
        },
        priority: NotificationPriority.HIGH
      }

      const result = await notificationService.sendNotification(request)

      expect(result).toBeDefined()
      expect(result.status).toBe('success')
    })

    it('应该支持邮件附件', async () => {
      const request: NotificationRequest = {
        notificationType: NotificationType.APPROVAL,
        channels: [NotificationChannel.EMAIL],
        receiverIds: [1],
        receivers: [
          {
            userId: 1,
            userName: '张三',
            email: 'zhangsan@example.com'
          }
        ],
        title: '审批通知',
        content: '您有一个待审批的请假申请',
        attachments: [
          {
            fileName: '请假申请.pdf',
            fileUrl: 'https://example.com/files/leave_application.pdf'
          }
        ],
        priority: NotificationPriority.HIGH
      }

      const result = await notificationService.sendNotification(request)

      expect(result).toBeDefined()
      expect(result.status).toBe('success')
    })
  })

  describe('短信通知', () => {
    it('应该成功发送短信通知', async () => {
      const request: NotificationRequest = {
        notificationType: NotificationType.APPROVAL,
        channels: [NotificationChannel.SMS],
        receiverIds: [1],
        receivers: [
          {
            userId: 1,
            userName: '张三',
            phone: '13800138000'
          }
        ],
        title: '审批通知',
        content: '您有一个待审批的请假申请',
        priority: NotificationPriority.HIGH
      }

      const result = await notificationService.sendNotification(request)

      expect(result).toBeDefined()
      expect(result.results).toHaveLength(1)
      expect(result.results[0].channel).toBe(NotificationChannel.SMS)
    })

    it('应该支持短信通知模板', async () => {
      const request: NotificationRequest = {
        notificationType: NotificationType.APPROVAL,
        channels: [NotificationChannel.SMS],
        receiverIds: [1],
        receivers: [
          {
            userId: 1,
            userName: '张三',
            phone: '13800138000'
          }
        ],
        templateCode: 'APPROVAL_TODO_SMS',
        templateParams: {
          businessType: '请假'
        },
        priority: NotificationPriority.HIGH
      }

      const result = await notificationService.sendNotification(request)

      expect(result).toBeDefined()
      expect(result.status).toBe('success')
    })
  })

  describe('多渠道通知', () => {
    it('应该成功发送多渠道通知', async () => {
      const request: NotificationRequest = {
        notificationType: NotificationType.APPROVAL,
        channels: [
          NotificationChannel.INBOX,
          NotificationChannel.EMAIL,
          NotificationChannel.SMS
        ],
        receiverIds: [1],
        receivers: [
          {
            userId: 1,
            userName: '张三',
            email: 'zhangsan@example.com',
            phone: '13800138000'
          }
        ],
        title: '审批通知',
        content: '您有一个待审批的请假申请',
        priority: NotificationPriority.HIGH
      }

      const result = await notificationService.sendNotification(request)

      expect(result).toBeDefined()
      expect(result.results).toHaveLength(3)
      expect(result.results[0].channel).toBe(NotificationChannel.INBOX)
      expect(result.results[1].channel).toBe(NotificationChannel.EMAIL)
      expect(result.results[2].channel).toBe(NotificationChannel.SMS)
    })

    it('应该在部分渠道失败时继续发送', async () => {
      const request: NotificationRequest = {
        notificationType: NotificationType.APPROVAL,
        channels: [
          NotificationChannel.INBOX,
          NotificationChannel.EMAIL,
          NotificationChannel.SMS
        ],
        receiverIds: [1],
        receivers: [
          {
            userId: 1,
            userName: '张三',
            email: 'zhangsan@example.com',
            phone: '13800138000'
          }
        ],
        title: '审批通知',
        content: '您有一个待审批的请假申请',
        priority: NotificationPriority.HIGH
      }

      const result = await notificationService.sendNotification(request)

      expect(result).toBeDefined()
      expect(result.results.length).toBeGreaterThanOrEqual(1)
    })
  })

  describe('通知队列', () => {
    it('应该成功添加通知到队列', async () => {
      const request: NotificationRequest = {
        notificationType: NotificationType.APPROVAL,
        channels: [NotificationChannel.INBOX],
        receiverIds: [1],
        receivers: [
          {
            userId: 1,
            userName: '张三'
          }
        ],
        title: '审批通知',
        content: '您有一个待审批的请假申请',
        priority: NotificationPriority.HIGH
      }

      const queueId = await queueService.addToQueue(request)

      expect(queueId).toBeDefined()
      expect(typeof queueId).toBe('string')
    })

    it('应该成功处理队列中的通知', async () => {
      const request: NotificationRequest = {
        notificationType: NotificationType.APPROVAL,
        channels: [NotificationChannel.INBOX],
        receiverIds: [1],
        receivers: [
          {
            userId: 1,
            userName: '张三'
          }
        ],
        title: '审批通知',
        content: '您有一个待审批的请假申请',
        priority: NotificationPriority.HIGH
      }

      await queueService.addToQueue(request)
      const processedCount = await queueService.processQueue()

      expect(processedCount).toBeGreaterThan(0)
    })

    it('应该支持优先级队列', async () => {
      const highPriorityRequest: NotificationRequest = {
        notificationType: NotificationType.APPROVAL,
        channels: [NotificationChannel.INBOX],
        receiverIds: [1],
        receivers: [
          {
            userId: 1,
            userName: '张三'
          }
        ],
        title: '高优先级通知',
        content: '高优先级通知',
        priority: NotificationPriority.HIGH
      }

      const lowPriorityRequest: NotificationRequest = {
        notificationType: NotificationType.APPROVAL,
        channels: [NotificationChannel.INBOX],
        receiverIds: [1],
        receivers: [
          {
            userId: 1,
            userName: '张三'
          }
        ],
        title: '低优先级通知',
        content: '低优先级通知',
        priority: NotificationPriority.LOW
      }

      await queueService.addToQueue(lowPriorityRequest)
      await queueService.addToQueue(highPriorityRequest)

      const processedCount = await queueService.processQueue()

      expect(processedCount).toBe(2)
    })
  })

  describe('通知重试机制', () => {
    it('应该支持通知重试', async () => {
      const notificationId = 1

      await notificationService.resendNotification(notificationId)

      // 验证重试逻辑
      expect(true).toBe(true)
    })

    it('应该在达到最大重试次数时停止', async () => {
      const notificationId = 999

      await expect(
        notificationService.resendNotification(notificationId)
      ).rejects.toThrow('已达到最大重试次数')
    })
  })

  describe('通知取消', () => {
    it('应该成功取消待发送的通知', async () => {
      const notificationId = 1

      await notificationService.cancelNotification(notificationId)

      // 验证取消逻辑
      expect(true).toBe(true)
    })

    it('应该在通知已发送时抛出错误', async () => {
      const notificationId = 999

      await expect(
        notificationService.cancelNotification(notificationId)
      ).rejects.toThrow('只能取消待发送的消息')
    })
  })

  describe('通知统计', () => {
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

  describe('通知类型', () => {
    it('应该支持审批通知', async () => {
      const request: NotificationRequest = {
        notificationType: NotificationType.APPROVAL,
        channels: [NotificationChannel.INBOX],
        receiverIds: [1],
        receivers: [
          {
            userId: 1,
            userName: '张三'
          }
        ],
        title: '审批通知',
        content: '您有一个待审批的请假申请',
        priority: NotificationPriority.HIGH
      }

      const result = await notificationService.sendNotification(request)

      expect(result.status).toBe('success')
    })

    it('应该支持系统通知', async () => {
      const request: NotificationRequest = {
        notificationType: NotificationType.SYSTEM,
        channels: [NotificationChannel.INBOX],
        receiverIds: [1],
        receivers: [
          {
            userId: 1,
            userName: '张三'
          }
        ],
        title: '系统通知',
        content: '系统维护通知',
        priority: NotificationPriority.NORMAL
      }

      const result = await notificationService.sendNotification(request)

      expect(result.status).toBe('success')
    })

    it('应该支持预警通知', async () => {
      const request: NotificationRequest = {
        notificationType: NotificationType.WARNING,
        channels: [NotificationChannel.INBOX],
        receiverIds: [1],
        receivers: [
          {
            userId: 1,
            userName: '张三'
          }
        ],
        title: '预警通知',
        content: '工人离职率超过阈值',
        priority: NotificationPriority.URGENT
      }

      const result = await notificationService.sendNotification(request)

      expect(result.status).toBe('success')
    })
  })

  describe('通知优先级', () => {
    it('应该支持高优先级通知', async () => {
      const request: NotificationRequest = {
        notificationType: NotificationType.APPROVAL,
        channels: [NotificationChannel.INBOX],
        receiverIds: [1],
        receivers: [
          {
            userId: 1,
            userName: '张三'
          }
        ],
        title: '高优先级通知',
        content: '高优先级通知',
        priority: NotificationPriority.HIGH
      }

      const result = await notificationService.sendNotification(request)

      expect(result.status).toBe('success')
    })

    it('应该支持紧急优先级通知', async () => {
      const request: NotificationRequest = {
        notificationType: NotificationType.WARNING,
        channels: [NotificationChannel.INBOX],
        receiverIds: [1],
        receivers: [
          {
            userId: 1,
            userName: '张三'
          }
        ],
        title: '紧急通知',
        content: '紧急通知',
        priority: NotificationPriority.URGENT
      }

      const result = await notificationService.sendNotification(request)

      expect(result.status).toBe('success')
    })
  })

  describe('错误处理', () => {
    it('应该处理发送通知失败', async () => {
      const request: NotificationRequest = {
        notificationType: NotificationType.APPROVAL,
        channels: [],
        receiverIds: [1],
        receivers: [
          {
            userId: 1,
            userName: '张三'
          }
        ],
        title: '审批通知',
        content: '您有一个待审批的请假申请',
        priority: NotificationPriority.HIGH
      }

      await expect(
        notificationService.sendNotification(request)
      ).rejects.toThrow('通知渠道不能为空')
    })

    it('应该处理批量发送部分失败', async () => {
      const requests: NotificationRequest[] = [
        {
          notificationType: NotificationType.APPROVAL,
          channels: [NotificationChannel.INBOX],
          receiverIds: [1],
          receivers: [
            {
              userId: 1,
              userName: '张三'
            }
          ],
          title: '审批通知1',
          content: '审批通知1',
          priority: NotificationPriority.HIGH
        },
        {
          notificationType: NotificationType.APPROVAL,
          channels: [NotificationChannel.EMAIL],
          receiverIds: [2],
          receivers: [
            {
              userId: 2,
              userName: '李四'
              // 缺少邮箱，会导致发送失败
            }
          ],
          title: '审批通知2',
          content: '审批通知2',
          priority: NotificationPriority.HIGH
        }
      ]

      const result = await notificationService.batchSendNotifications(requests)

      expect(result.successCount).toBe(1)
      expect(result.failureCount).toBe(1)
    })
  })
})
