/**
 * 消息队列服务单元测试
 * 测试消息队列服务的核心功能
 */

import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { NotificationQueueService } from '../notificationQueueService'
import type {
  NotificationChannel,
  NotificationPriority,
  NotificationStatus,
} from '@/types/notification'

describe('NotificationQueueService', () => {
  let queueService: NotificationQueueService

  beforeEach(() => {
    queueService = NotificationQueueService.getInstance()
    // 清空队列
    queueService.clearQueue()
  })

  afterEach(() => {
    // 清空队列
    queueService.clearQueue()
  })

  describe('addTask', () => {
    it('应该成功添加任务到队列', async () => {
      const task = {
        notificationId: 1,
        channel: NotificationChannel.INBOX,
        priority: NotificationPriority.HIGH,
      }

      await expect(queueService.addTask(task)).resolves.not.toThrow()

      const tasks = queueService.getQueueTasks()
      expect(tasks).toHaveLength(1)
      expect(tasks[0].notificationId).toBe(1)
    })

    it('应该支持延迟任务', async () => {
      const task = {
        notificationId: 1,
        channel: NotificationChannel.INBOX,
        priority: NotificationPriority.HIGH,
        delayTime: '1h',
      }

      await expect(queueService.addTask(task)).resolves.not.toThrow()

      // 延迟任务不会立即出现在队列中
      const tasks = queueService.getQueueTasks()
      expect(tasks).toHaveLength(0)
    })

    it('应该按优先级分组任务', async () => {
      const tasks = [
        {
          notificationId: 1,
          channel: NotificationChannel.INBOX,
          priority: NotificationPriority.HIGH,
        },
        {
          notificationId: 2,
          channel: NotificationChannel.EMAIL,
          priority: NotificationPriority.URGENT,
        },
        {
          notificationId: 3,
          channel: NotificationChannel.SMS,
          priority: NotificationPriority.LOW,
        },
      ]

      for (const task of tasks) {
        await queueService.addTask(task)
      }

      const highPriorityTasks = queueService.getQueueTasks(NotificationPriority.HIGH)
      const urgentPriorityTasks = queueService.getQueueTasks(NotificationPriority.URGENT)
      const lowPriorityTasks = queueService.getQueueTasks(NotificationPriority.LOW)

      expect(highPriorityTasks).toHaveLength(1)
      expect(urgentPriorityTasks).toHaveLength(1)
      expect(lowPriorityTasks).toHaveLength(1)
    })
  })

  describe('processTasks', () => {
    it('应该按优先级顺序处理任务', async () => {
      const tasks = [
        {
          notificationId: 1,
          channel: NotificationChannel.INBOX,
          priority: NotificationPriority.LOW,
        },
        {
          notificationId: 2,
          channel: NotificationChannel.EMAIL,
          priority: NotificationPriority.HIGH,
        },
        {
          notificationId: 3,
          channel: NotificationChannel.SMS,
          priority: NotificationPriority.URGENT,
        },
      ]

      for (const task of tasks) {
        await queueService.addTask(task)
      }

      await queueService.processTasks()

      const executingTasks = queueService.getExecutingTasks()
      expect(executingTasks).toHaveLength(3)
    })

    it('应该处理失败的任务并重试', async () => {
      const task = {
        notificationId: 1,
        channel: NotificationChannel.INBOX,
        priority: NotificationPriority.HIGH,
      }

      await queueService.addTask(task)
      await queueService.processTasks()

      // 等待重试
      await new Promise(resolve => setTimeout(resolve, 2000))

      const tasks = queueService.getQueueTasks()
      expect(tasks.length).toBeGreaterThan(0)
    })
  })

  describe('cancelTask', () => {
    it('应该成功取消队列中的任务', async () => {
      const task = {
        notificationId: 1,
        channel: NotificationChannel.INBOX,
        priority: NotificationPriority.HIGH,
      }

      await queueService.addTask(task)

      const taskId = queueService.getQueueTasks()[0].id
      await expect(queueService.cancelTask(taskId)).resolves.not.toThrow()

      const tasks = queueService.getQueueTasks()
      expect(tasks).toHaveLength(0)
    })

    it('应该成功取消正在执行的任务', async () => {
      const task = {
        notificationId: 1,
        channel: NotificationChannel.INBOX,
        priority: NotificationPriority.HIGH,
      }

      await queueService.addTask(task)
      await queueService.processTasks()

      const executingTasks = queueService.getExecutingTasks()
      const taskId = executingTasks[0].id

      await expect(queueService.cancelTask(taskId)).resolves.not.toThrow()

      const newExecutingTasks = queueService.getExecutingTasks()
      expect(newExecutingTasks).toHaveLength(0)
    })

    it('应该在任务不存在时抛出错误', async () => {
      const taskId = 999

      await expect(queueService.cancelTask(taskId)).rejects.toThrow('任务不存在')
    })
  })

  describe('batchCancelTasks', () => {
    it('应该成功批量取消任务', async () => {
      const tasks = [
        {
          notificationId: 1,
          channel: NotificationChannel.INBOX,
          priority: NotificationPriority.HIGH,
        },
        {
          notificationId: 2,
          channel: NotificationChannel.EMAIL,
          priority: NotificationPriority.HIGH,
        },
        {
          notificationId: 3,
          channel: NotificationChannel.SMS,
          priority: NotificationPriority.HIGH,
        },
      ]

      for (const task of tasks) {
        await queueService.addTask(task)
      }

      const taskIds = queueService.getQueueTasks().map(t => t.id)
      await expect(queueService.batchCancelTasks(taskIds)).resolves.not.toThrow()

      const newTasks = queueService.getQueueTasks()
      expect(newTasks).toHaveLength(0)
    })
  })

  describe('getQueueStatistics', () => {
    it('应该成功获取队列统计', () => {
      const statistics = queueService.getQueueStatistics()

      expect(statistics).toBeDefined()
      expect(statistics.total).toBeDefined()
      expect(statistics.byPriority).toBeDefined()
      expect(statistics.byStatus).toBeDefined()
      expect(statistics.byPriority[NotificationPriority.URGENT]).toBeDefined()
      expect(statistics.byPriority[NotificationPriority.HIGH]).toBeDefined()
      expect(statistics.byPriority[NotificationPriority.MEDIUM]).toBeDefined()
      expect(statistics.byPriority[NotificationPriority.LOW]).toBeDefined()
      expect(statistics.byStatus[NotificationStatus.PENDING]).toBeDefined()
      expect(statistics.byStatus[NotificationStatus.SENDING]).toBeDefined()
      expect(statistics.byStatus[NotificationStatus.SUCCESS]).toBeDefined()
      expect(statistics.byStatus[NotificationStatus.FAILED]).toBeDefined()
      expect(statistics.byStatus[NotificationStatus.CANCELLED]).toBeDefined()
    })

    it('应该正确统计任务数量', async () => {
      const tasks = [
        {
          notificationId: 1,
          channel: NotificationChannel.INBOX,
          priority: NotificationPriority.HIGH,
        },
        {
          notificationId: 2,
          channel: NotificationChannel.EMAIL,
          priority: NotificationPriority.URGENT,
        },
        {
          notificationId: 3,
          channel: NotificationChannel.SMS,
          priority: NotificationPriority.LOW,
        },
      ]

      for (const task of tasks) {
        await queueService.addTask(task)
      }

      const statistics = queueService.getQueueStatistics()
      expect(statistics.total).toBe(3)
      expect(statistics.byPriority[NotificationPriority.HIGH]).toBe(1)
      expect(statistics.byPriority[NotificationPriority.URGENT]).toBe(1)
      expect(statistics.byPriority[NotificationPriority.LOW]).toBe(1)
      expect(statistics.byStatus[NotificationStatus.PENDING]).toBe(3)
    })
  })

  describe('findTaskById', () => {
    it('应该成功找到任务', async () => {
      const task = {
        notificationId: 1,
        channel: NotificationChannel.INBOX,
        priority: NotificationPriority.HIGH,
      }

      await queueService.addTask(task)

      const tasks = queueService.getQueueTasks()
      const foundTask = queueService.findTaskById(tasks[0].id)

      expect(foundTask).toBeDefined()
      expect(foundTask!.notificationId).toBe(1)
    })

    it('应该在任务不存在时返回undefined', () => {
      const foundTask = queueService.findTaskById(999)

      expect(foundTask).toBeUndefined()
    })
  })

  describe('findTasksByNotificationId', () => {
    it('应该成功找到指定通知ID的所有任务', async () => {
      const tasks = [
        {
          notificationId: 1,
          channel: NotificationChannel.INBOX,
          priority: NotificationPriority.HIGH,
        },
        {
          notificationId: 1,
          channel: NotificationChannel.EMAIL,
          priority: NotificationPriority.HIGH,
        },
        {
          notificationId: 2,
          channel: NotificationChannel.SMS,
          priority: NotificationPriority.HIGH,
        },
      ]

      for (const task of tasks) {
        await queueService.addTask(task)
      }

      const foundTasks = queueService.findTasksByNotificationId(1)

      expect(foundTasks).toHaveLength(2)
      expect(foundTasks.every(t => t.notificationId === 1)).toBe(true)
    })

    it('应该在通知ID不存在时返回空数组', () => {
      const foundTasks = queueService.findTasksByNotificationId(999)

      expect(foundTasks).toHaveLength(0)
    })
  })
})
