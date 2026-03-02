/**
 * 消息队列服务
 * 负责消息队列的管理、任务调度、重试机制等
 */

import type {
  NotificationQueueTask,
  NotificationChannel,
  NotificationStatus,
} from '@/types/notification'
import {
  NotificationPriority,
  NotificationPriorityWeight,
  NotificationStatusName
} from '@/types/notification'

/**
 * 消息队列任务接口
 */
interface QueueTask {
  notificationId: number
  channel: NotificationChannel
  priority: NotificationPriority
  delayTime?: string
  maxRetryCount?: number
}

/**
 * 消息队列服务
 */
export class NotificationQueueService {
  private static instance: NotificationQueueService

  // 任务队列（按优先级分组）
  private taskQueues: Map<NotificationPriority, QueueTask[]> = new Map()

  // 正在执行的任务
  private executingTasks: Map<number, NotificationQueueTask> = new Map()

  // 任务定时器
  private taskTimers: Map<number, NodeJS.Timeout> = new Map()

  // 最大重试次数
  private readonly MAX_RETRY_COUNT = 3

  // 重试延迟时间（毫秒）
  private readonly RETRY_DELAYS = [1000, 5000, 15000] // 1秒, 5秒, 15秒

  private constructor() {
    this.initializeQueues()
    this.startQueueProcessor()
  }

  /**
   * 获取单例实例
   */
  static getInstance(): NotificationQueueService {
    if (!NotificationQueueService.instance) {
      NotificationQueueService.instance = new NotificationQueueService()
    }
    return NotificationQueueService.instance
  }

  // ============================================
  // 1. 队列初始化
  // ============================================

  /**
   * 初始化任务队列
   */
  private initializeQueues(): void {
    this.taskQueues.set(NotificationPriority.URGENT, [])
    this.taskQueues.set(NotificationPriority.HIGH, [])
    this.taskQueues.set(NotificationPriority.MEDIUM, [])
    this.taskQueues.set(NotificationPriority.LOW, [])
  }

  /**
   * 启动队列处理器
   */
  private startQueueProcessor(): void {
    // 每秒检查一次队列
    setInterval(() => {
      this.processTasks()
    }, 1000)
  }

  // ============================================
  // 2. 任务管理
  // ============================================

  /**
   * 添加任务到队列
   * @param task 任务信息
   */
  async addTask(task: QueueTask): Promise<void> {
    try {
      // 1.1 创建队列任务记录
      const queueTask: NotificationQueueTask = {
        id: Date.now(),
        notificationId: task.notificationId,
        taskType: task.channel,
        status: NotificationStatus.PENDING,
        priority: task.priority,
        retryCount: 0,
        maxRetryCount: task.maxRetryCount || this.MAX_RETRY_COUNT,
        createTime: new Date().toISOString(),
      }

      // 1.2 如果有延迟时间，设置定时器
      if (task.delayTime) {
        const delay = this.calculateDelay(task.delayTime)
        const timer = setTimeout(() => {
          this.addTaskToQueue(queueTask)
        }, delay)
        this.taskTimers.set(queueTask.id, timer)
      } else {
        // 1.3 立即添加到队列
        this.addTaskToQueue(queueTask)
      }

      console.log(`任务已添加到队列: ${queueTask.id}`)
    } catch (error) {
      console.error('添加任务到队列失败:', error)
      throw error
    }
  }

  /**
   * 添加任务到队列（内部方法）
   * @param task 任务信息
   */
  private addTaskToQueue(task: NotificationQueueTask): void {
    const queue = this.taskQueues.get(task.priority)
    if (queue) {
      queue.push(task)
      console.log(`任务已添加到${task.priority}优先级队列: ${task.id}`)
    }
  }

  /**
   * 处理队列中的任务
   */
  async processTasks(): Promise<void> {
    try {
      // 1.1 按优先级顺序处理任务
      const priorities = [
        NotificationPriority.URGENT,
        NotificationPriority.HIGH,
        NotificationPriority.MEDIUM,
        NotificationPriority.LOW,
      ]

      for (const priority of priorities) {
        const queue = this.taskQueues.get(priority)
        if (!queue || queue.length === 0) {
          continue
        }

        // 1.2 从队列中取出任务
        const task = queue.shift()
        if (!task) {
          continue
        }

        // 1.3 执行任务
        await this.executeTask(task)
      }
    } catch (error) {
      console.error('处理队列任务失败:', error)
    }
  }

  /**
   * 执行单个任务
   * @param task 任务信息
   */
  private async executeTask(task: NotificationQueueTask): Promise<void> {
    try {
      // 1.1 检查是否已达到最大重试次数
      if (task.retryCount >= task.maxRetryCount) {
        await this.markTaskAsFailed(task, '已达到最大重试次数')
        return
      }

      // 1.2 更新任务状态为发送中
      task.status = NotificationStatus.SENDING
      this.executingTasks.set(task.id, task)

      // 1.3 执行任务（调用对应的通知服务）
      await this.executeNotificationTask(task)

      // 1.4 更新任务状态为成功
      task.status = NotificationStatus.SUCCESS
      task.executeTime = new Date().toISOString()

      // 1.5 从执行中列表移除
      this.executingTasks.delete(task.id)

      console.log(`任务执行成功: ${task.id}`)
    } catch (error) {
      console.error(`任务执行失败: ${task.id}`, error)

      // 1.6 更新重试次数
      task.retryCount += 1

      // 1.7 判断是否需要重试
      if (task.retryCount < task.maxRetryCount) {
        // 1.8 计算重试延迟
        const retryDelay = this.RETRY_DELAYS[Math.min(task.retryCount - 1, this.RETRY_DELAYS.length - 1)]

        // 1.9 设置重试定时器
        const timer = setTimeout(async () => {
          await this.executeTask(task)
        }, retryDelay)

        this.taskTimers.set(task.id, timer)

        console.log(`任务将在${retryDelay}ms后重试: ${task.id}`)
      } else {
        // 1.10 标记任务为失败
        await this.markTaskAsFailed(task, error instanceof Error ? error.message : '任务执行失败')
      }
    }
  }

  /**
   * 执行通知任务
   * @param task 任务信息
   */
  private async executeNotificationTask(task: NotificationQueueTask): Promise<void> {
    // TODO: 根据任务类型调用对应的通知服务
    // 这里需要根据实际的业务逻辑来实现
    console.log(`执行通知任务: ${task.id}, 类型: ${task.taskType}`)
  }

  /**
   * 标记任务为失败
   * @param task 任务信息
   * @param errorMessage 错误信息
   */
  private async markTaskAsFailed(
    task: NotificationQueueTask,
    errorMessage: string
  ): Promise<void> {
    task.status = NotificationStatus.FAILED
    task.errorMessage = errorMessage
    task.executeTime = new Date().toISOString()

    // 从执行中列表移除
    this.executingTasks.delete(task.id)

    console.error(`任务执行失败: ${task.id}, 原因: ${errorMessage}`)
  }

  // ============================================
  // 3. 任务取消
  // ============================================

  /**
   * 取消任务
   * @param taskId 任务ID
   */
  async cancelTask(taskId: number): Promise<void> {
    try {
      // 1.1 检查定时器
      const timer = this.taskTimers.get(taskId)
      if (timer) {
        clearTimeout(timer)
        this.taskTimers.delete(taskId)
      }

      // 1.2 检查队列中的任务
      for (const [priority, queue] of this.taskQueues.entries()) {
        const index = queue.findIndex(t => t.id === taskId)
        if (index !== -1) {
          const task = queue.splice(index, 1)[0]
          task.status = NotificationStatus.CANCELLED
          console.log(`任务已取消: ${taskId}`)
          return
        }
      }

      // 1.3 检查正在执行的任务
      const executingTask = this.executingTasks.get(taskId)
      if (executingTask) {
        executingTask.status = NotificationStatus.CANCELLED
        this.executingTasks.delete(taskId)
        console.log(`正在执行的任务已取消: ${taskId}`)
        return
      }

      throw new Error('任务不存在')
    } catch (error) {
      console.error('取消任务失败:', error)
      throw error
    }
  }

  /**
   * 根据通知ID取消任务
   * @param notificationId 通知ID
   */
  async cancelTaskByNotificationId(notificationId: number): Promise<void> {
    try {
      // 1.1 检查定时器
      for (const [taskId, timer] of this.taskTimers.entries()) {
        const task = this.findTaskById(taskId)
        if (task && task.notificationId === notificationId) {
          clearTimeout(timer)
          this.taskTimers.delete(taskId)
          task.status = NotificationStatus.CANCELLED
        }
      }

      // 1.2 检查队列中的任务
      for (const [priority, queue] of this.taskQueues.entries()) {
        const index = queue.findIndex(t => t.notificationId === notificationId)
        if (index !== -1) {
          const task = queue.splice(index, 1)[0]
          task.status = NotificationStatus.CANCELLED
        }
      }

      // 1.3 检查正在执行的任务
      for (const [taskId, task] of this.executingTasks.entries()) {
        if (task.notificationId === notificationId) {
          task.status = NotificationStatus.CANCELLED
          this.executingTasks.delete(taskId)
        }
      }

      console.log(`通知ID为${notificationId}的任务已取消`)
    } catch (error) {
      console.error('根据通知ID取消任务失败:', error)
      throw error
    }
  }

  /**
   * 批量取消任务
   * @param taskIds 任务ID列表
   */
  async batchCancelTasks(taskIds: number[]): Promise<void> {
    try {
      for (const taskId of taskIds) {
        await this.cancelTask(taskId)
      }
    } catch (error) {
      console.error('批量取消任务失败:', error)
      throw error
    }
  }

  // ============================================
  // 4. 任务查询
  // ============================================

  /**
   * 获取队列中的任务列表
   * @param priority 优先级（可选）
   * @returns 任务列表
   */
  getQueueTasks(priority?: NotificationPriority): NotificationQueueTask[] {
    if (priority) {
      return this.taskQueues.get(priority) || []
    }

    // 返回所有队列中的任务
    const allTasks: NotificationQueueTask[] = []
    for (const queue of this.taskQueues.values()) {
      allTasks.push(...queue)
    }

    // 按优先级排序
    return allTasks.sort((a, b) => {
      const weightA = NotificationPriorityWeight[a.priority]
      const weightB = NotificationPriorityWeight[b.priority]
      return weightB - weightA
    })
  }

  /**
   * 获取正在执行的任务列表
   * @returns 任务列表
   */
  getExecutingTasks(): NotificationQueueTask[] {
    return Array.from(this.executingTasks.values())
  }

  /**
   * 根据任务ID查找任务
   * @param taskId 任务ID
   * @returns 任务信息
   */
  findTaskById(taskId: number): NotificationQueueTask | undefined {
    // 1. 检查队列中的任务
    for (const queue of this.taskQueues.values()) {
      const task = queue.find(t => t.id === taskId)
      if (task) {
        return task
      }
    }

    // 2. 检查正在执行的任务
    return this.executingTasks.get(taskId)
  }

  /**
   * 根据通知ID查找任务
   * @param notificationId 通知ID
   * @returns 任务列表
   */
  findTasksByNotificationId(notificationId: number): NotificationQueueTask[] {
    const tasks: NotificationQueueTask[] = []

    // 1. 检查队列中的任务
    for (const queue of this.taskQueues.values()) {
      const foundTasks = queue.filter(t => t.notificationId === notificationId)
      tasks.push(...foundTasks)
    }

    // 2. 检查正在执行的任务
    for (const task of this.executingTasks.values()) {
      if (task.notificationId === notificationId) {
        tasks.push(task)
      }
    }

    return tasks
  }

  // ============================================
  // 5. 队列统计
  // ============================================

  /**
   * 获取队列统计信息
   * @returns 统计信息
   */
  getQueueStatistics(): {
    total: number
    byPriority: Record<NotificationPriority, number>
    byStatus: Record<NotificationStatus, number>
  } {
    const total = this.getQueueTasks().length + this.executingTasks.size

    const byPriority: Record<NotificationPriority, number> = {
      [NotificationPriority.URGENT]: 0,
      [NotificationPriority.HIGH]: 0,
      [NotificationPriority.MEDIUM]: 0,
      [NotificationPriority.LOW]: 0,
    }

    const byStatus: Record<NotificationStatus, number> = {
      [NotificationStatus.PENDING]: 0,
      [NotificationStatus.SENDING]: 0,
      [NotificationStatus.SUCCESS]: 0,
      [NotificationStatus.FAILED]: 0,
      [NotificationStatus.CANCELLED]: 0,
    }

    // 统计队列中的任务
    for (const [priority, queue] of this.taskQueues.entries()) {
      byPriority[priority] = queue.length
      byStatus[NotificationStatus.PENDING] += queue.length
    }

    // 统计正在执行的任务
    for (const task of this.executingTasks.values()) {
      byPriority[task.priority] += 1
      byStatus[task.status] += 1
    }

    return {
      total,
      byPriority,
      byStatus,
    }
  }

  // ============================================
  // 6. 辅助方法
  // ============================================

  /**
   * 计算延迟时间
   * @param delayTime 延迟时间字符串（如 "1h", "30m", "60s"）
   * @returns 延迟时间（毫秒）
   */
  private calculateDelay(delayTime: string): number {
    const match = delayTime.match(/^(\d+)([hms])$/)
    if (!match) {
      throw new Error('无效的延迟时间格式')
    }

    const value = parseInt(match[1], 10)
    const unit = match[2]

    switch (unit) {
      case 'h':
        return value * 60 * 60 * 1000
      case 'm':
        return value * 60 * 1000
      case 's':
        return value * 1000
      default:
        throw new Error('无效的延迟时间单位')
    }
  }

  /**
   * 清空队列
   */
  clearQueue(): void {
    // 清空所有队列
    for (const queue of this.taskQueues.values()) {
      queue.length = 0
    }

    // 清空执行中的任务
    this.executingTasks.clear()

    // 清空定时器
    for (const timer of this.taskTimers.values()) {
      clearTimeout(timer)
    }
    this.taskTimers.clear()

    console.log('队列已清空')
  }

  /**
   * 停止队列处理器
   */
  stopQueueProcessor(): void {
    // 清空所有定时器
    for (const timer of this.taskTimers.values()) {
      clearTimeout(timer)
    }
    this.taskTimers.clear()

    console.log('队列处理器已停止')
  }
}

export default NotificationQueueService
