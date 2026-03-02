/**
 * 短信通知服务
 * 负责短信的发送、重试、日志记录、频率控制等功能
 */

import type {
  SmsNotificationRecord,
  NotificationReceiver,
  NotificationRequest,
  NotificationChannel,
  NotificationStatus,
  SmsNotificationQueryParams,
  SmsNotificationResponse,
} from '@/types/notification'
import { NotificationStatusName } from '@/types/notification'

/**
 * 短信服务商配置接口
 */
interface SmsProviderConfig {
  /** 服务商名称 */
  provider: 'aliyun' | 'tencent' | 'custom'
  /** AccessKey ID */
  accessKeyId: string
  /** AccessKey Secret */
  accessKeySecret: string
  /** 短信签名 */
  signature: string
  /** 区域ID */
  regionId?: string
  /** 自定义服务商URL */
  customUrl?: string
}

/**
 * 短信通知服务
 */
export class SmsNotificationService {
  private static instance: SmsNotificationService

  // 短信记录存储（模拟数据库）
  private smsRecords: Map<number, SmsNotificationRecord> = new Map()

  // 短信服务商配置
  private smsConfig: SmsProviderConfig = {
    provider: 'aliyun',
    accessKeyId: '',
    accessKeySecret: '',
    signature: '蓝领智汇',
    regionId: 'cn-hangzhou',
  }

  // 短信发送频率控制（按手机号）
  private sendFrequencyControl: Map<string, { count: number; lastSendTime: number }> = new Map()

  // 频率限制配置
  private readonly FREQUENCY_LIMIT = {
    /** 每分钟最多发送次数 */
    perMinute: 1,
    /** 每小时最多发送次数 */
    perHour: 5,
    /** 每天最多发送次数 */
    perDay: 20,
  }

  private constructor() {}

  /**
   * 获取单例实例
   */
  static getInstance(): SmsNotificationService {
    if (!SmsNotificationService.instance) {
      SmsNotificationService.instance = new SmsNotificationService()
    }
    return SmsNotificationService.instance
  }

  // ============================================
  // 1. 发送短信
  // ============================================

  /**
   * 发送短信
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
      // 1.1 验证接收人手机号
      if (!receiver.phone) {
        throw new Error('接收人手机号不能为空')
      }

      // 1.2 验证手机号格式
      if (!this.validatePhone(receiver.phone)) {
        throw new Error('手机号格式无效')
      }

      // 1.3 检查发送频率
      await this.checkSendFrequency(receiver.phone)

      // 1.4 创建短信记录
      const smsRecord: SmsNotificationRecord = {
        id: Date.now() + Math.random(),
        notificationId,
        toPhone: receiver.phone,
        toName: receiver.userName,
        content: request.content,
        signature: this.smsConfig.signature,
        smsType: 'notification',
        status: NotificationStatus.SENDING,
        sendCount: 0,
        maxRetryCount: 3,
        createTime: new Date().toISOString(),
      }

      // 1.5 保存短信记录
      this.smsRecords.set(smsRecord.id, smsRecord)

      // 1.6 发送短信
      await this.sendSms(smsRecord)

      // 1.7 更新短信记录
      smsRecord.status = NotificationStatus.SUCCESS
      smsRecord.sendTime = new Date().toISOString()
      smsRecord.successTime = new Date().toISOString()

      // 1.8 更新发送频率控制
      this.updateSendFrequency(receiver.phone)

      console.log(`短信发送成功: ${smsRecord.id}, 收件人: ${receiver.phone}`)

      return {
        channel: NotificationChannel.SMS,
        status: NotificationStatus.SUCCESS,
        recordId: smsRecord.id,
      }
    } catch (error) {
      console.error('发送短信失败:', error)

      // 更新短信记录为失败
      const smsRecord = Array.from(this.smsRecords.values()).find(
        r => r.notificationId === notificationId && r.toPhone === receiver.phone
      )
      if (smsRecord) {
        smsRecord.status = NotificationStatus.FAILED
        smsRecord.failureReason = error instanceof Error ? error.message : '发送失败'
      }

      return {
        channel: NotificationChannel.SMS,
        status: NotificationStatus.FAILED,
      }
    }
  }

  /**
   * 批量发送短信
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
      console.error('批量发送短信失败:', error)
      throw error
    }
  }

  /**
   * 重新发送短信
   * @param smsId 短信ID
   */
  async resend(smsId: number): Promise<void> {
    try {
      const smsRecord = this.smsRecords.get(smsId)
      if (!smsRecord) {
        throw new Error('短信记录不存在')
      }

      // 检查是否已达到最大重试次数
      if (smsRecord.sendCount >= smsRecord.maxRetryCount) {
        throw new Error('已达到最大重试次数')
      }

      // 检查发送频率
      await this.checkSendFrequency(smsRecord.toPhone)

      // 更新重试次数
      smsRecord.sendCount += 1
      smsRecord.status = NotificationStatus.SENDING

      // 重新发送短信
      await this.sendSms(smsRecord)

      // 更新短信记录
      smsRecord.status = NotificationStatus.SUCCESS
      smsRecord.sendTime = new Date().toISOString()
      smsRecord.successTime = new Date().toISOString()

      // 更新发送频率控制
      this.updateSendFrequency(smsRecord.toPhone)

      console.log(`短信重新发送成功: ${smsId}`)
    } catch (error) {
      console.error('重新发送短信失败:', error)

      // 更新短信记录为失败
      const smsRecord = this.smsRecords.get(smsId)
      if (smsRecord) {
        smsRecord.status = NotificationStatus.FAILED
        smsRecord.failureReason = error instanceof Error ? error.message : '发送失败'
      }

      throw error
    }
  }

  // ============================================
  // 2. 短信发送核心逻辑
  // ============================================

  /**
   * 发送短信（核心方法）
   * @param smsRecord 短信记录
   */
  private async sendSms(smsRecord: SmsNotificationRecord): Promise<void> {
    try {
      // TODO: 实际发送短信的逻辑
      // 这里可以使用阿里云短信、腾讯云短信等服务商的SDK
      console.log(`发送短信到: ${smsRecord.toPhone}`)
      console.log(`短信内容: ${smsRecord.signature} ${smsRecord.content}`)

      // 模拟发送延迟
      await new Promise(resolve => setTimeout(resolve, 200))

      // 模拟发送成功
      console.log('短信发送成功')
    } catch (error) {
      console.error('发送短信失败:', error)
      throw error
    }
  }

  /**
   * 验证手机号格式
   * @param phone 手机号
   * @returns 是否有效
   */
  private validatePhone(phone: string): boolean {
    // 中国大陆手机号正则表达式
    const phoneRegex = /^1[3-9]\d{9}$/
    return phoneRegex.test(phone)
  }

  // ============================================
  // 3. 发送频率控制
  // ============================================

  /**
   * 检查发送频率
   * @param phone 手机号
   */
  private async checkSendFrequency(phone: string): Promise<void> {
    const now = Date.now()
    const control = this.sendFrequencyControl.get(phone)

    if (!control) {
      return
    }

    const { count, lastSendTime } = control

    // 检查每分钟限制
    if (now - lastSendTime < 60 * 1000 && count >= this.FREQUENCY_LIMIT.perMinute) {
      throw new Error('发送频率过高，请稍后再试')
    }

    // 检查每小时限制
    if (now - lastSendTime < 60 * 60 * 1000 && count >= this.FREQUENCY_LIMIT.perHour) {
      throw new Error('每小时发送次数已达上限')
    }

    // 检查每天限制
    if (now - lastSendTime < 24 * 60 * 60 * 1000 && count >= this.FREQUENCY_LIMIT.perDay) {
      throw new Error('每天发送次数已达上限')
    }
  }

  /**
   * 更新发送频率控制
   * @param phone 手机号
   */
  private updateSendFrequency(phone: string): void {
    const now = Date.now()
    const control = this.sendFrequencyControl.get(phone)

    if (!control) {
      this.sendFrequencyControl.set(phone, {
        count: 1,
        lastSendTime: now,
      })
      return
    }

    const { count, lastSendTime } = control

    // 如果超过1分钟，重置计数
    if (now - lastSendTime >= 60 * 1000) {
      this.sendFrequencyControl.set(phone, {
        count: 1,
        lastSendTime: now,
      })
    } else {
      // 增加计数
      this.sendFrequencyControl.set(phone, {
        count: count + 1,
        lastSendTime: now,
      })
    }
  }

  /**
   * 重置发送频率控制
   * @param phone 手机号
   */
  resetSendFrequency(phone: string): void {
    this.sendFrequencyControl.delete(phone)
  }

  /**
   * 获取发送频率控制信息
   * @param phone 手机号
   * @returns 频率控制信息
   */
  getSendFrequencyControl(phone: string): { count: number; lastSendTime: number } | null {
    return this.sendFrequencyControl.get(phone) || null
  }

  // ============================================
  // 4. 短信记录查询
  // ============================================

  /**
   * 获取短信记录列表
   * @param params 查询参数
   * @returns 短信记录列表
   */
  async getSmsRecordList(params: SmsNotificationQueryParams): Promise<SmsNotificationResponse> {
    try {
      // 1.1 获取所有短信记录
      let records = Array.from(this.smsRecords.values())

      // 1.2 按收件人筛选
      if (params.toPhone) {
        records = records.filter(r => r.toPhone === params.toPhone)
      }

      // 1.3 按状态筛选
      if (params.status) {
        records = records.filter(r => r.status === params.status)
      }

      // 1.4 按短信类型筛选
      if (params.smsType) {
        records = records.filter(r => r.smsType === params.smsType)
      }

      // 1.5 按关键词搜索
      if (params.keyword) {
        const keyword = params.keyword.toLowerCase()
        records = records.filter(
          r =>
            r.toPhone.includes(keyword) ||
            r.toName.toLowerCase().includes(keyword) ||
            r.content.toLowerCase().includes(keyword)
        )
      }

      // 1.6 按时间范围筛选
      if (params.startDate) {
        records = records.filter(r => r.createTime >= params.startDate!)
      }
      if (params.endDate) {
        records = records.filter(r => r.createTime <= params.endDate!)
      }

      // 1.7 排序（按创建时间倒序）
      records.sort((a, b) => {
        return new Date(b.createTime).getTime() - new Date(a.createTime).getTime()
      })

      // 1.8 分页
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
      console.error('获取短信记录列表失败:', error)
      throw error
    }
  }

  /**
   * 获取短信记录详情
   * @param smsId 短信ID
   * @returns 短信记录详情
   */
  async getSmsRecordDetail(smsId: number): Promise<SmsNotificationRecord | null> {
    try {
      return this.smsRecords.get(smsId) || null
    } catch (error) {
      console.error('获取短信记录详情失败:', error)
      throw error
    }
  }

  // ============================================
  // 5. 短信记录删除
  // ============================================

  /**
   * 删除短信记录
   * @param smsId 短信ID
   */
  async deleteSmsRecord(smsId: number): Promise<void> {
    try {
      const smsRecord = this.smsRecords.get(smsId)
      if (!smsRecord) {
        throw new Error('短信记录不存在')
      }

      this.smsRecords.delete(smsId)
      console.log(`短信记录已删除: ${smsId}`)
    } catch (error) {
      console.error('删除短信记录失败:', error)
      throw error
    }
  }

  /**
   * 批量删除短信记录
   * @param smsIds 短信ID列表
   */
  async batchDeleteSmsRecords(smsIds: number[]): Promise<void> {
    try {
      for (const smsId of smsIds) {
        await this.deleteSmsRecord(smsId)
      }
    } catch (error) {
      console.error('批量删除短信记录失败:', error)
      throw error
    }
  }

  // ============================================
  // 6. 短信配置管理
  // ============================================

  /**
   * 更新短信配置
   * @param config 短信配置
   */
  updateSmsConfig(config: Partial<SmsProviderConfig>): void {
    this.smsConfig = { ...this.smsConfig, ...config }
    console.log('短信配置已更新')
  }

  /**
   * 获取短信配置
   * @returns 短信配置
   */
  getSmsConfig(): SmsProviderConfig {
    return { ...this.smsConfig }
  }

  /**
   * 测试短信配置
   * @param testPhone 测试手机号
   */
  async testSmsConfig(testPhone: string): Promise<void> {
    try {
      if (!this.validatePhone(testPhone)) {
        throw new Error('手机号格式无效')
      }

      // 创建测试短信记录
      const testRecord: SmsNotificationRecord = {
        id: Date.now(),
        notificationId: 0,
        toPhone: testPhone,
        toName: '测试用户',
        content: '这是一条测试短信，用于验证短信配置是否正确。',
        signature: this.smsConfig.signature,
        smsType: 'notification',
        status: NotificationStatus.SENDING,
        sendCount: 0,
        maxRetryCount: 1,
        createTime: new Date().toISOString(),
      }

      // 发送测试短信
      await this.sendSms(testRecord)

      console.log(`测试短信已发送到: ${testPhone}`)
    } catch (error) {
      console.error('测试短信配置失败:', error)
      throw error
    }
  }

  // ============================================
  // 7. 辅助方法
  // ============================================

  /**
   * 清空所有短信记录
   */
  clearAllSmsRecords(): void {
    this.smsRecords.clear()
    console.log('所有短信记录已清空')
  }

  /**
   * 清空发送频率控制
   */
  clearSendFrequencyControl(): void {
    this.sendFrequencyControl.clear()
    console.log('发送频率控制已清空')
  }

  /**
   * 获取短信统计
   * @param params 查询参数
   * @returns 短信统计
   */
  async getSmsStatistics(params?: {
    startDate?: string
    endDate?: string
  }): Promise<{
    total: number
    success: number
    failed: number
    sending: number
  }> {
    try {
      let records = Array.from(this.smsRecords.values())

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
      console.error('获取短信统计失败:', error)
      throw error
    }
  }
}

export default SmsNotificationService
