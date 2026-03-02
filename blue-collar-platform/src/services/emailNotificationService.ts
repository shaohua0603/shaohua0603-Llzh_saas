/**
 * 邮件通知服务
 * 负责邮件的发送、重试、日志记录等功能
 */

import type {
  EmailNotificationRecord,
  NotificationReceiver,
  NotificationRequest,
  NotificationChannel,
  NotificationStatus,
  EmailNotificationQueryParams,
  EmailNotificationResponse,
} from '@/types/notification'
import { NotificationStatusName } from '@/types/notification'

/**
 * 邮件配置接口
 */
interface EmailConfig {
  /** SMTP服务器地址 */
  host: string
  /** SMTP服务器端口 */
  port: number
  /** 是否使用SSL */
  secure: boolean
  /** 发件人邮箱 */
  from: string
  /** 发件人名称 */
  fromName: string
  /** 用户名 */
  user: string
  /** 密码 */
  password: string
}

/**
 * 邮件通知服务
 */
export class EmailNotificationService {
  private static instance: EmailNotificationService

  // 邮件记录存储（模拟数据库）
  private emailRecords: Map<number, EmailNotificationRecord> = new Map()

  // 邮件配置
  private emailConfig: EmailConfig = {
    host: 'smtp.example.com',
    port: 465,
    secure: true,
    from: 'noreply@example.com',
    fromName: '蓝领智汇',
    user: 'noreply@example.com',
    password: 'password',
  }

  private constructor() {}

  /**
   * 获取单例实例
   */
  static getInstance(): EmailNotificationService {
    if (!EmailNotificationService.instance) {
      EmailNotificationService.instance = new EmailNotificationService()
    }
    return EmailNotificationService.instance
  }

  // ============================================
  // 1. 发送邮件
  // ============================================

  /**
   * 发送邮件
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
      // 1.1 验证接收人邮箱
      if (!receiver.email) {
        throw new Error('接收人邮箱不能为空')
      }

      // 1.2 创建邮件记录
      const emailRecord: EmailNotificationRecord = {
        id: Date.now() + Math.random(),
        notificationId,
        toEmail: receiver.email,
        toName: receiver.userName,
        subject: request.title,
        content: request.content,
        contentType: 'html',
        attachments: request.attachments,
        status: NotificationStatus.SENDING,
        sendCount: 0,
        maxRetryCount: 3,
        createTime: new Date().toISOString(),
      }

      // 1.3 保存邮件记录
      this.emailRecords.set(emailRecord.id, emailRecord)

      // 1.4 发送邮件
      await this.sendEmail(emailRecord)

      // 1.5 更新邮件记录
      emailRecord.status = NotificationStatus.SUCCESS
      emailRecord.sendTime = new Date().toISOString()
      emailRecord.successTime = new Date().toISOString()

      console.log(`邮件发送成功: ${emailRecord.id}, 收件人: ${receiver.email}`)

      return {
        channel: NotificationChannel.EMAIL,
        status: NotificationStatus.SUCCESS,
        recordId: emailRecord.id,
      }
    } catch (error) {
      console.error('发送邮件失败:', error)

      // 更新邮件记录为失败
      const emailRecord = Array.from(this.emailRecords.values()).find(
        r => r.notificationId === notificationId && r.toEmail === receiver.email
      )
      if (emailRecord) {
        emailRecord.status = NotificationStatus.FAILED
        emailRecord.failureReason = error instanceof Error ? error.message : '发送失败'
      }

      return {
        channel: NotificationChannel.EMAIL,
        status: NotificationStatus.FAILED,
      }
    }
  }

  /**
   * 批量发送邮件
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
      console.error('批量发送邮件失败:', error)
      throw error
    }
  }

  /**
   * 重新发送邮件
   * @param emailId 邮件ID
   */
  async resend(emailId: number): Promise<void> {
    try {
      const emailRecord = this.emailRecords.get(emailId)
      if (!emailRecord) {
        throw new Error('邮件记录不存在')
      }

      // 检查是否已达到最大重试次数
      if (emailRecord.sendCount >= emailRecord.maxRetryCount) {
        throw new Error('已达到最大重试次数')
      }

      // 更新重试次数
      emailRecord.sendCount += 1
      emailRecord.status = NotificationStatus.SENDING

      // 重新发送邮件
      await this.sendEmail(emailRecord)

      // 更新邮件记录
      emailRecord.status = NotificationStatus.SUCCESS
      emailRecord.sendTime = new Date().toISOString()
      emailRecord.successTime = new Date().toISOString()

      console.log(`邮件重新发送成功: ${emailId}`)
    } catch (error) {
      console.error('重新发送邮件失败:', error)

      // 更新邮件记录为失败
      const emailRecord = this.emailRecords.get(emailId)
      if (emailRecord) {
        emailRecord.status = NotificationStatus.FAILED
        emailRecord.failureReason = error instanceof Error ? error.message : '发送失败'
      }

      throw error
    }
  }

  // ============================================
  // 2. 邮件发送核心逻辑
  // ============================================

  /**
   * 发送邮件（核心方法）
   * @param emailRecord 邮件记录
   */
  private async sendEmail(emailRecord: EmailNotificationRecord): Promise<void> {
    try {
      // TODO: 实际发送邮件的逻辑
      // 这里可以使用nodemailer等库发送邮件
      console.log(`发送邮件到: ${emailRecord.toEmail}`)
      console.log(`邮件主题: ${emailRecord.subject}`)
      console.log(`邮件内容: ${emailRecord.content}`)

      // 模拟发送延迟
      await new Promise(resolve => setTimeout(resolve, 100))

      // 模拟发送成功
      console.log('邮件发送成功')
    } catch (error) {
      console.error('发送邮件失败:', error)
      throw error
    }
  }

  /**
   * 验证邮箱地址
   * @param email 邮箱地址
   * @returns 是否有效
   */
  private validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  // ============================================
  // 3. 邮件记录查询
  // ============================================

  /**
   * 获取邮件记录列表
   * @param params 查询参数
   * @returns 邮件记录列表
   */
  async getEmailRecordList(params: EmailNotificationQueryParams): Promise<EmailNotificationResponse> {
    try {
      // 1.1 获取所有邮件记录
      let records = Array.from(this.emailRecords.values())

      // 1.2 按收件人筛选
      if (params.toEmail) {
        records = records.filter(r => r.toEmail === params.toEmail)
      }

      // 1.3 按状态筛选
      if (params.status) {
        records = records.filter(r => r.status === params.status)
      }

      // 1.4 按关键词搜索
      if (params.keyword) {
        const keyword = params.keyword.toLowerCase()
        records = records.filter(
          r =>
            r.toEmail.toLowerCase().includes(keyword) ||
            r.toName.toLowerCase().includes(keyword) ||
            r.subject.toLowerCase().includes(keyword) ||
            r.content.toLowerCase().includes(keyword)
        )
      }

      // 1.5 按时间范围筛选
      if (params.startDate) {
        records = records.filter(r => r.createTime >= params.startDate!)
      }
      if (params.endDate) {
        records = records.filter(r => r.createTime <= params.endDate!)
      }

      // 1.6 排序（按创建时间倒序）
      records.sort((a, b) => {
        return new Date(b.createTime).getTime() - new Date(a.createTime).getTime()
      })

      // 1.7 分页
      const total = records.length
      const start = (params.page - 1) * params.pageSize
      const end = start + params.pageSize
      const list = records.slice(start, end)

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
      console.error('获取邮件记录列表失败:', error)
      throw error
    }
  }

  /**
   * 获取邮件记录详情
   * @param emailId 邮件ID
   * @returns 邮件记录详情
   */
  async getEmailRecordDetail(emailId: number): Promise<EmailNotificationRecord | null> {
    try {
      return this.emailRecords.get(emailId) || null
    } catch (error) {
      console.error('获取邮件记录详情失败:', error)
      throw error
    }
  }

  // ============================================
  // 4. 邮件记录删除
  // ============================================

  /**
   * 删除邮件记录
   * @param emailId 邮件ID
   */
  async deleteEmailRecord(emailId: number): Promise<void> {
    try {
      const emailRecord = this.emailRecords.get(emailId)
      if (!emailRecord) {
        throw new Error('邮件记录不存在')
      }

      this.emailRecords.delete(emailId)
      console.log(`邮件记录已删除: ${emailId}`)
    } catch (error) {
      console.error('删除邮件记录失败:', error)
      throw error
    }
  }

  /**
   * 批量删除邮件记录
   * @param emailIds 邮件ID列表
   */
  async batchDeleteEmailRecords(emailIds: number[]): Promise<void> {
    try {
      for (const emailId of emailIds) {
        await this.deleteEmailRecord(emailId)
      }
    } catch (error) {
      console.error('批量删除邮件记录失败:', error)
      throw error
    }
  }

  // ============================================
  // 5. 邮件配置管理
  // ============================================

  /**
   * 更新邮件配置
   * @param config 邮件配置
   */
  updateEmailConfig(config: Partial<EmailConfig>): void {
    this.emailConfig = { ...this.emailConfig, ...config }
    console.log('邮件配置已更新')
  }

  /**
   * 获取邮件配置
   * @returns 邮件配置
   */
  getEmailConfig(): EmailConfig {
    return { ...this.emailConfig }
  }

  /**
   * 测试邮件配置
   * @param testEmail 测试邮箱
   */
  async testEmailConfig(testEmail: string): Promise<void> {
    try {
      if (!this.validateEmail(testEmail)) {
        throw new Error('邮箱地址无效')
      }

      // 创建测试邮件记录
      const testRecord: EmailNotificationRecord = {
        id: Date.now(),
        notificationId: 0,
        toEmail: testEmail,
        toName: '测试用户',
        subject: '邮件配置测试',
        content: '这是一封测试邮件，用于验证邮件配置是否正确。',
        contentType: 'html',
        status: NotificationStatus.SENDING,
        sendCount: 0,
        maxRetryCount: 1,
        createTime: new Date().toISOString(),
      }

      // 发送测试邮件
      await this.sendEmail(testRecord)

      console.log(`测试邮件已发送到: ${testEmail}`)
    } catch (error) {
      console.error('测试邮件配置失败:', error)
      throw error
    }
  }

  // ============================================
  // 6. 辅助方法
  // ============================================

  /**
   * 清空所有邮件记录
   */
  clearAllEmailRecords(): void {
    this.emailRecords.clear()
    console.log('所有邮件记录已清空')
  }

  /**
   * 获取邮件统计
   * @param params 查询参数
   * @returns 邮件统计
   */
  async getEmailStatistics(params?: {
    startDate?: string
    endDate?: string
  }): Promise<{
    total: number
    success: number
    failed: number
    sending: number
  }> {
    try {
      let records = Array.from(this.emailRecords.values())

      // 按时间范围筛选
      if (params?.startDate) {
        records = records.filter(r => r.createTime >= params.startDate!)
      }
      if (params?.endDate) {
        records = records.filter(r => r.createTime <= params.endDate!)
      }

      const total = records.length
      const success = records.filter(r => r.status === NotificationStatus.SUCCESS).length
      const failed = records.filter(r => r.status === NotificationStatus.FAILED).length
      const sending = records.filter(r => r.status === NotificationStatus.SENDING).length

      return {
        total,
        success,
        failed,
        sending,
      }
    } catch (error) {
      console.error('获取邮件统计失败:', error)
      throw error
    }
  }
}

export default EmailNotificationService
