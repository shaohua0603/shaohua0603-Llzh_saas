/**
 * 消息模板管理服务
 * 负责消息模板的创建、更新、删除、查询、渲染等功能
 */

import type {
  MessageTemplateConfig,
  MessageTemplateForm,
  MessageTemplateType,
  MessageTemplateVariable,
  NotificationChannel,
  NotificationType,
  MessageTemplateQueryParams,
  MessageTemplateResponse,
  MessageTemplatePreviewResponse,
} from '@/types/notification'

/**
 * 消息模板管理服务
 */
export class MessageTemplateService {
  private static instance: MessageTemplateService

  // 消息模板存储（模拟数据库）
  private templates: Map<number, MessageTemplateConfig> = new Map()

  // 模板编码到模板ID的映射
  private templateCodeToId: Map<MessageTemplateType, number> = new Map()

  private constructor() {
    this.initializeDefaultTemplates()
  }

  /**
   * 获取单例实例
   */
  static getInstance(): MessageTemplateService {
    if (!MessageTemplateService.instance) {
      MessageTemplateService.instance = new MessageTemplateService()
    }
    return MessageTemplateService.instance
  }

  // ============================================
  // 1. 初始化默认模板
  // ============================================

  /**
   * 初始化默认消息模板
   */
  private initializeDefaultTemplates(): void {
    const defaultTemplates: MessageTemplateForm[] = [
      {
        templateCode: 'approval_todo',
        templateName: '审批待办',
        description: '审批流程待办任务通知',
        templateType: 'approval',
        channels: ['inbox', 'email', 'sms'],
        title: '您有一个新的审批待办任务',
        content: '尊敬的{{receiverName}}，您有一个新的审批待办任务：\n\n任务标题：{{title}}\n提交人：{{submitterName}}\n提交时间：{{submitTime}}\n\n请及时处理。',
        variables: [
          {
            name: 'receiverName',
            description: '接收人姓名',
            type: 'string',
            required: true,
            example: '张三',
          },
          {
            name: 'title',
            description: '任务标题',
            type: 'string',
            required: true,
            example: '请假申请审批',
          },
          {
            name: 'submitterName',
            description: '提交人姓名',
            type: 'string',
            required: true,
            example: '李四',
          },
          {
            name: 'submitTime',
            description: '提交时间',
            type: 'date',
            required: true,
            example: '2026-02-26 10:00:00',
          },
        ],
        enabled: true,
      },
      {
        templateCode: 'approval_approved',
        templateName: '审批通过',
        description: '审批流程通过通知',
        templateType: 'approval',
        channels: ['inbox', 'email', 'sms'],
        title: '您的申请已审批通过',
        content: '尊敬的{{receiverName}}，您的申请已审批通过。\n\n申请标题：{{title}}\n审批人：{{approverName}}\n审批时间：{{approvalTime}}\n审批意见：{{approvalComment}}',
        variables: [
          {
            name: 'receiverName',
            description: '接收人姓名',
            type: 'string',
            required: true,
            example: '张三',
          },
          {
            name: 'title',
            description: '申请标题',
            type: 'string',
            required: true,
            example: '请假申请',
          },
          {
            name: 'approverName',
            description: '审批人姓名',
            type: 'string',
            required: true,
            example: '李四',
          },
          {
            name: 'approvalTime',
            description: '审批时间',
            type: 'date',
            required: true,
            example: '2026-02-26 10:00:00',
          },
          {
            name: 'approvalComment',
            description: '审批意见',
            type: 'string',
            required: false,
            example: '同意',
          },
        ],
        enabled: true,
      },
      {
        templateCode: 'approval_rejected',
        templateName: '审批驳回',
        description: '审批流程驳回通知',
        templateType: 'approval',
        channels: ['inbox', 'email', 'sms'],
        title: '您的申请已被驳回',
        content: '尊敬的{{receiverName}}，您的申请已被驳回。\n\n申请标题：{{title}}\n审批人：{{approverName}}\n审批时间：{{approvalTime}}\n驳回原因：{{rejectReason}}',
        variables: [
          {
            name: 'receiverName',
            description: '接收人姓名',
            type: 'string',
            required: true,
            example: '张三',
          },
          {
            name: 'title',
            description: '申请标题',
            type: 'string',
            required: true,
            example: '请假申请',
          },
          {
            name: 'approverName',
            description: '审批人姓名',
            type: 'string',
            required: true,
            example: '李四',
          },
          {
            name: 'approvalTime',
            description: '审批时间',
            type: 'date',
            required: true,
            example: '2026-02-26 10:00:00',
          },
          {
            name: 'rejectReason',
            description: '驳回原因',
            type: 'string',
            required: true,
            example: '请假时间不符合规定',
          },
        ],
        enabled: true,
      },
      {
        templateCode: 'approval_transfer',
        templateName: '审批转交',
        description: '审批流程转交通知',
        templateType: 'approval',
        channels: ['inbox', 'email'],
        title: '您的审批任务已被转交',
        content: '尊敬的{{receiverName}}，您的审批任务已被转交给{{transferToName}}。\n\n任务标题：{{title}}\n转交人：{{transferFromName}}\n转交时间：{{transferTime}}',
        variables: [
          {
            name: 'receiverName',
            description: '接收人姓名',
            type: 'string',
            required: true,
            example: '张三',
          },
          {
            name: 'transferToName',
            description: '转交目标人姓名',
            type: 'string',
            required: true,
            example: '李四',
          },
          {
            name: 'title',
            description: '任务标题',
            type: 'string',
            required: true,
            example: '请假申请审批',
          },
          {
            name: 'transferFromName',
            description: '转交人姓名',
            type: 'string',
            required: true,
            example: '王五',
          },
          {
            name: 'transferTime',
            description: '转交时间',
            type: 'date',
            required: true,
            example: '2026-02-26 10:00:00',
          },
        ],
        enabled: true,
      },
      {
        templateCode: 'approval_delegate',
        templateName: '审批委派',
        description: '审批流程委派通知',
        templateType: 'approval',
        channels: ['inbox', 'email'],
        title: '您的审批任务已被委派',
        content: '尊敬的{{receiverName}}，您的审批任务已被委派给{{delegateToName}}。\n\n任务标题：{{title}}\n委派人：{{delegateFromName}}\n委派时间：{{delegateTime}}',
        variables: [
          {
            name: 'receiverName',
            description: '接收人姓名',
            type: 'string',
            required: true,
            example: '张三',
          },
          {
            name: 'delegateToName',
            description: '委派目标人姓名',
            type: 'string',
            required: true,
            example: '李四',
          },
          {
            name: 'title',
            description: '任务标题',
            type: 'string',
            required: true,
            example: '请假申请审批',
          },
          {
            name: 'delegateFromName',
            description: '委派人姓名',
            type: 'string',
            required: true,
            example: '王五',
          },
          {
            name: 'delegateTime',
            description: '委派时间',
            type: 'date',
            required: true,
            example: '2026-02-26 10:00:00',
          },
        ],
        enabled: true,
      },
      {
        templateCode: 'approval_withdraw',
        templateName: '审批撤回',
        description: '审批流程撤回通知',
        templateType: 'approval',
        channels: ['inbox', 'email'],
        title: '审批申请已被撤回',
        content: '尊敬的{{receiverName}}，审批申请已被撤回。\n\n申请标题：{{title}}\n撤回人：{{withdrawerName}}\n撤回时间：{{withdrawTime}}',
        variables: [
          {
            name: 'receiverName',
            description: '接收人姓名',
            type: 'string',
            required: true,
            example: '张三',
          },
          {
            name: 'title',
            description: '申请标题',
            type: 'string',
            required: true,
            example: '请假申请',
          },
          {
            name: 'withdrawerName',
            description: '撤回人姓名',
            type: 'string',
            required: true,
            example: '李四',
          },
          {
            name: 'withdrawTime',
            description: '撤回时间',
            type: 'date',
            required: true,
            example: '2026-02-26 10:00:00',
          },
        ],
        enabled: true,
      },
      {
        templateCode: 'approval_complete',
        templateName: '审批完成',
        description: '审批流程完成通知',
        templateType: 'approval',
        channels: ['inbox', 'email'],
        title: '审批流程已完成',
        content: '尊敬的{{receiverName}}，审批流程已完成。\n\n流程名称：{{flowName}}\n业务标题：{{title}}\n完成时间：{{completeTime}}',
        variables: [
          {
            name: 'receiverName',
            description: '接收人姓名',
            type: 'string',
            required: true,
            example: '张三',
          },
          {
            name: 'flowName',
            description: '流程名称',
            type: 'string',
            required: true,
            example: '请假审批流程',
          },
          {
            name: 'title',
            description: '业务标题',
            type: 'string',
            required: true,
            example: '请假申请',
          },
          {
            name: 'completeTime',
            description: '完成时间',
            type: 'date',
            required: true,
            example: '2026-02-26 10:00:00',
          },
        ],
        enabled: true,
      },
    ]

    // 创建默认模板
    for (const template of defaultTemplates) {
      this.createTemplate(template)
    }
  }

  // ============================================
  // 2. 模板CRUD操作
  // ============================================

  /**
   * 创建模板
   * @param form 模板表单
   * @returns 模板ID
   */
  createTemplate(form: MessageTemplateForm): number {
    try {
      // 1.1 验证模板编码是否已存在
      if (this.templateCodeToId.has(form.templateCode)) {
        throw new Error('模板编码已存在')
      }

      // 1.2 创建模板
      const template: MessageTemplateConfig = {
        id: Date.now() + Math.random(),
        templateCode: form.templateCode,
        templateName: form.templateName,
        description: form.description,
        templateType: form.templateType,
        channels: form.channels,
        title: form.title,
        content: form.content,
        variables: form.variables,
        enabled: form.enabled,
        createTime: new Date().toISOString(),
      }

      // 1.3 保存模板
      this.templates.set(template.id, template)
      this.templateCodeToId.set(form.templateCode, template.id)

      console.log(`模板创建成功: ${template.id}`)
      return template.id
    } catch (error) {
      console.error('创建模板失败:', error)
      throw error
    }
  }

  /**
   * 更新模板
   * @param templateId 模板ID
   * @param form 模板表单
   */
  updateTemplate(templateId: number, form: MessageTemplateForm): void {
    try {
      const template = this.templates.get(templateId)
      if (!template) {
        throw new Error('模板不存在')
      }

      // 1.1 如果模板编码发生变化，检查新编码是否已存在
      if (form.templateCode !== template.templateCode) {
        if (this.templateCodeToId.has(form.templateCode)) {
          throw new Error('模板编码已存在')
        }

        // 删除旧的编码映射
        this.templateCodeToId.delete(template.templateCode)
        // 添加新的编码映射
        this.templateCodeToId.set(form.templateCode, templateId)
      }

      // 1.2 更新模板
      template.templateCode = form.templateCode
      template.templateName = form.templateName
      template.description = form.description
      template.templateType = form.templateType
      template.channels = form.channels
      template.title = form.title
      template.content = form.content
      template.variables = form.variables
      template.enabled = form.enabled
      template.updateTime = new Date().toISOString()

      console.log(`模板更新成功: ${templateId}`)
    } catch (error) {
      console.error('更新模板失败:', error)
      throw error
    }
  }

  /**
   * 删除模板
   * @param templateId 模板ID
   */
  deleteTemplate(templateId: number): void {
    try {
      const template = this.templates.get(templateId)
      if (!template) {
        throw new Error('模板不存在')
      }

      // 删除模板
      this.templates.delete(templateId)
      // 删除编码映射
      this.templateCodeToId.delete(template.templateCode)

      console.log(`模板删除成功: ${templateId}`)
    } catch (error) {
      console.error('删除模板失败:', error)
      throw error
    }
  }

  /**
   * 批量删除模板
   * @param templateIds 模板ID列表
   */
  batchDeleteTemplates(templateIds: number[]): void {
    try {
      for (const templateId of templateIds) {
        this.deleteTemplate(templateId)
      }
    } catch (error) {
      console.error('批量删除模板失败:', error)
      throw error
    }
  }

  // ============================================
  // 3. 模板查询
  // ============================================

  /**
   * 获取模板列表
   * @param params 查询参数
   * @returns 模板列表
   */
  async getTemplateList(params: MessageTemplateQueryParams): Promise<MessageTemplateResponse> {
    try {
      // 1.1 获取所有模板
      let templates = Array.from(this.templates.values())

      // 1.2 按模板编码筛选
      if (params.templateCode) {
        templates = templates.filter(t => t.templateCode === params.templateCode)
      }

      // 1.3 按模板类型筛选
      if (params.templateType) {
        templates = templates.filter(t => t.templateType === params.templateType)
      }

      // 1.4 按通知渠道筛选
      if (params.channel) {
        templates = templates.filter(t => t.channels.includes(params.channel!))
      }

      // 1.5 按启用状态筛选
      if (params.enabled !== undefined) {
        templates = templates.filter(t => t.enabled === params.enabled)
      }

      // 1.6 按关键词搜索
      if (params.keyword) {
        const keyword = params.keyword.toLowerCase()
        templates = templates.filter(
          t =>
            t.templateName.toLowerCase().includes(keyword) ||
            t.templateCode.toLowerCase().includes(keyword) ||
            (t.description && t.description.toLowerCase().includes(keyword))
        )
      }

      // 1.7 排序（按创建时间倒序）
      templates.sort((a, b) => {
        return new Date(b.createTime).getTime() - new Date(a.createTime).getTime()
      })

      // 1.8 分页
      const total = templates.length
      const start = (params.page - 1) * params.pageSize
      const end = start + params.pageSize
      const list = templates.slice(start, end)

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
      console.error('获取模板列表失败:', error)
      throw error
    }
  }

  /**
   * 获取模板详情
   * @param templateId 模板ID
   * @returns 模板详情
   */
  getTemplate(templateId: number): MessageTemplateConfig | null {
    try {
      return this.templates.get(templateId) || null
    } catch (error) {
      console.error('获取模板详情失败:', error)
      throw error
    }
  }

  /**
   * 根据模板编码获取模板
   * @param templateCode 模板编码
   * @returns 模板详情
   */
  getTemplateByCode(templateCode: MessageTemplateType): MessageTemplateConfig | null {
    try {
      const templateId = this.templateCodeToId.get(templateCode)
      if (!templateId) {
        return null
      }
      return this.templates.get(templateId) || null
    } catch (error) {
      console.error('根据模板编码获取模板失败:', error)
      throw error
    }
  }

  // ============================================
  // 4. 模板启用/禁用
  // ============================================

  /**
   * 启用模板
   * @param templateId 模板ID
   */
  enableTemplate(templateId: number): void {
    try {
      const template = this.templates.get(templateId)
      if (!template) {
        throw new Error('模板不存在')
      }

      template.enabled = true
      template.updateTime = new Date().toISOString()

      console.log(`模板已启用: ${templateId}`)
    } catch (error) {
      console.error('启用模板失败:', error)
      throw error
    }
  }

  /**
   * 禁用模板
   * @param templateId 模板ID
   */
  disableTemplate(templateId: number): void {
    try {
      const template = this.templates.get(templateId)
      if (!template) {
        throw new Error('模板不存在')
      }

      template.enabled = false
      template.updateTime = new Date().toISOString()

      console.log(`模板已禁用: ${templateId}`)
    } catch (error) {
      console.error('禁用模板失败:', error)
      throw error
    }
  }

  // ============================================
  // 5. 模板预览
  // ============================================

  /**
   * 预览模板
   * @param templateCode 模板编码
   * @param variables 变量值
   * @returns 预览结果
   */
  previewTemplate(
    templateCode: string,
    variables: Record<string, any>
  ): MessageTemplatePreviewResponse {
    try {
      const template = this.getTemplateByCode(templateCode as MessageTemplateType)
      if (!template) {
        throw new Error('模板不存在')
      }

      // 渲染模板
      const title = this.renderTemplate(template.title, variables)
      const content = this.renderTemplate(template.content, variables)

      return {
        templateId: template.id,
        title,
        content,
        variables,
      }
    } catch (error) {
      console.error('预览模板失败:', error)
      throw error
    }
  }

  /**
   * 渲染模板
   * @param template 模板内容
   * @param variables 变量值
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
  // 6. 辅助方法
  // ============================================

  /**
   * 清空所有模板
   */
  clearAllTemplates(): void {
    this.templates.clear()
    this.templateCodeToId.clear()
    console.log('所有模板已清空')
  }

  /**
   * 获取所有模板编码
   * @returns 模板编码列表
   */
  getAllTemplateCodes(): MessageTemplateType[] {
    return Array.from(this.templateCodeToId.keys())
  }

  /**
   * 获取启用的模板列表
   * @returns 启用的模板列表
   */
  getEnabledTemplates(): MessageTemplateConfig[] {
    return Array.from(this.templates.values()).filter(t => t.enabled)
  }
}

export default MessageTemplateService
