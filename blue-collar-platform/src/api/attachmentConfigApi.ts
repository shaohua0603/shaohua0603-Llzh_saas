import type { AttachmentConfig, AttachmentConfigQuery, AttachmentConfigFormData, ApiResponse, PageResponse } from '@/types/attachment'

const mockAttachmentConfigs: AttachmentConfig[] = [
  {
    id: '1',
    menuId: '2',
    menuName: '待办任务',
    menuPath: '/work-center/todo',
    attachmentName: '身份证照片',
    attachmentTypes: ['IMAGE'],
    maxSize: 10,
    required: true,
    templateFileId: '',
    templateFileName: '',
    templateFileUrl: '',
    allowedTypes: ['jpg', 'jpeg', 'png'],
    allowBatchUpload: true,
    allowPreview: true,
    description: '用于验证工人身份的身份证正反面照片',
    status: 'enabled',
    sort: 1,
    createdBy: '张三',
    createdAt: new Date('2024-01-01'),
    updatedBy: '张三',
    updatedAt: new Date('2024-01-01')
  },
  {
    id: '2',
    menuId: '2',
    menuName: '待办任务',
    menuPath: '/work-center/todo',
    attachmentName: '体检报告',
    attachmentTypes: ['FILE'],
    maxSize: 20,
    required: true,
    templateFileId: '1',
    templateFileName: '体检表模板.doc',
    templateFileUrl: '/templates/体检表模板.doc',
    allowedTypes: ['pdf', 'doc', 'docx'],
    allowBatchUpload: false,
    allowPreview: true,
    description: '工人入职体检报告',
    status: 'enabled',
    sort: 2,
    createdBy: '李四',
    createdAt: new Date('2024-01-05'),
    updatedBy: '李四',
    updatedAt: new Date('2024-01-05')
  },
  {
    id: '3',
    menuId: '6',
    menuName: '招聘需求',
    menuPath: '/recruitment/demand',
    attachmentName: '招聘简章',
    attachmentTypes: ['IMAGE', 'PDF'],
    maxSize: 5,
    required: false,
    templateFileId: '',
    templateFileName: '',
    templateFileUrl: '',
    allowedTypes: ['jpg', 'jpeg', 'png', 'pdf'],
    allowBatchUpload: true,
    allowPreview: true,
    description: '企业招聘简章图片或PDF文档',
    status: 'enabled',
    sort: 1,
    createdBy: '王五',
    createdAt: new Date('2024-01-10'),
    updatedBy: '王五',
    updatedAt: new Date('2024-01-10')
  },
  {
    id: '4',
    menuId: '14',
    menuName: '工人信息',
    menuPath: '/worker/info',
    attachmentName: '个人简历',
    attachmentTypes: ['FILE'],
    maxSize: 15,
    required: true,
    templateFileId: '2',
    templateFileName: '简历模板.pdf',
    templateFileUrl: '/templates/简历模板.pdf',
    allowedTypes: ['pdf', 'doc', 'docx'],
    allowBatchUpload: false,
    allowPreview: true,
    description: '工人个人简历文件',
    status: 'enabled',
    sort: 1,
    createdBy: '赵六',
    createdAt: new Date('2024-01-15'),
    updatedBy: '赵六',
    updatedAt: new Date('2024-01-15')
  },
  {
    id: '5',
    menuId: '16',
    menuName: '签订合同',
    menuPath: '/contract/sign',
    attachmentName: '劳动合同',
    attachmentTypes: ['DOCUMENT'],
    maxSize: 50,
    required: true,
    templateFileId: '3',
    templateFileName: '劳动合同模板.pdf',
    templateFileUrl: '/templates/劳动合同模板.pdf',
    allowedTypes: ['pdf'],
    allowBatchUpload: false,
    allowPreview: true,
    description: '工人签订的劳动合同扫描件',
    status: 'enabled',
    sort: 1,
    createdBy: '孙七',
    createdAt: new Date('2024-01-20'),
    updatedBy: '孙七',
    updatedAt: new Date('2024-01-20')
  },
  {
    id: '6',
    menuId: '19',
    menuName: '生活费管理',
    menuPath: '/on-duty/living-expense',
    attachmentName: '转账凭证',
    attachmentTypes: ['IMAGE'],
    maxSize: 5,
    required: false,
    templateFileId: '',
    templateFileName: '',
    templateFileUrl: '',
    allowedTypes: ['jpg', 'jpeg', 'png'],
    allowBatchUpload: true,
    allowPreview: true,
    description: '生活费转账凭证截图',
    status: 'enabled',
    sort: 1,
    createdBy: '周八',
    createdAt: new Date('2024-01-25'),
    updatedBy: '周八',
    updatedAt: new Date('2024-01-25')
  }
]

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

export const attachmentConfigApi = {
  getAttachmentConfigList: async (params: AttachmentConfigQuery) => {
    await delay(300)
    let filteredData = [...mockAttachmentConfigs]

    if (params.menuId) {
      filteredData = filteredData.filter(item => String(item.menuId) === String(params.menuId))
    }

    if (params.attachmentName) {
      filteredData = filteredData.filter(item =>
        item.attachmentName.includes(params.attachmentName!)
      )
    }

    if (params.attachmentTypes && params.attachmentTypes.length > 0) {
      filteredData = filteredData.filter(item =>
        item.attachmentTypes.some(type => params.attachmentTypes!.includes(type as any))
      )
    }

    if (params.required !== undefined && params.required !== null) {
      filteredData = filteredData.filter(item => item.required === params.required)
    }

    const start = ((params.page || 1) - 1) * (params.pageSize || 10)
    const end = start + (params.pageSize || 10)
    const list = filteredData.slice(start, end)

    return {
      code: 200,
      message: 'success',
      data: {
        list,
        total: filteredData.length,
        page: params.page || 1,
        pageSize: params.pageSize || 10
      },
      timestamp: Date.now()
    } as PageResponse<AttachmentConfig>
  },

  getAttachmentConfigDetail: async (id: string) => {
    await delay(200)
    const config = mockAttachmentConfigs.find(item => item.id === id)

    if (!config) {
      return {
        code: 404,
        message: '附件配置不存在',
        data: null,
        timestamp: Date.now()
      } as ApiResponse<AttachmentConfig>
    }

    return {
      code: 200,
      message: 'success',
      data: config,
      timestamp: Date.now()
    } as ApiResponse<AttachmentConfig>
  },

  createAttachmentConfig: async (data: AttachmentConfigFormData) => {
    await delay(300)
    const newConfig: AttachmentConfig = {
      id: String(mockAttachmentConfigs.length + 1),
      menuId: data.menuId,
      menuName: data.menuName || '',
      menuPath: data.menuPath || '',
      attachmentName: data.attachmentName,
      attachmentTypes: data.attachmentTypes,
      maxSize: data.maxSize,
      required: data.required,
      templateFileId: data.templateFileId || '',
      templateFileName: data.templateFileName || '',
      templateFileUrl: data.templateFileUrl || '',
      allowedTypes: data.allowedTypes,
      allowBatchUpload: data.allowBatchUpload,
      allowPreview: data.allowPreview,
      description: data.description || '',
      status: data.status || 'enabled',
      sort: data.sort || 0,
      createdBy: '当前用户',
      createdAt: new Date(),
      updatedBy: '当前用户',
      updatedAt: new Date()
    }

    mockAttachmentConfigs.push(newConfig)

    return {
      code: 200,
      message: '创建成功',
      data: newConfig,
      timestamp: Date.now()
    } as ApiResponse<AttachmentConfig>
  },

  updateAttachmentConfig: async (id: string, data: AttachmentConfigFormData) => {
    await delay(300)
    const index = mockAttachmentConfigs.findIndex(item => item.id === id)

    if (index === -1) {
      return {
        code: 404,
        message: '附件配置不存在',
        data: null,
        timestamp: Date.now()
      } as ApiResponse<AttachmentConfig>
    }

    Object.assign(mockAttachmentConfigs[index], {
      menuId: data.menuId,
      menuName: data.menuName || '',
      menuPath: data.menuPath || '',
      attachmentName: data.attachmentName,
      attachmentTypes: data.attachmentTypes,
      maxSize: data.maxSize,
      required: data.required,
      templateFileId: data.templateFileId || '',
      templateFileName: data.templateFileName || '',
      templateFileUrl: data.templateFileUrl || '',
      allowedTypes: data.allowedTypes,
      allowBatchUpload: data.allowBatchUpload,
      allowPreview: data.allowPreview,
      description: data.description || '',
      status: data.status || 'enabled',
      sort: data.sort || 0,
      updatedBy: '当前用户',
      updatedAt: new Date()
    })

    return {
      code: 200,
      message: '更新成功',
      data: mockAttachmentConfigs[index],
      timestamp: Date.now()
    } as ApiResponse<AttachmentConfig>
  },

  deleteAttachmentConfig: async (id: string) => {
    await delay(300)
    const index = mockAttachmentConfigs.findIndex(item => item.id === id)

    if (index === -1) {
      return {
        code: 404,
        message: '附件配置不存在',
        data: null,
        timestamp: Date.now()
      } as ApiResponse<void>
    }

    mockAttachmentConfigs.splice(index, 1)

    return {
      code: 200,
      message: '删除成功',
      data: null,
      timestamp: Date.now()
    } as ApiResponse<void>
  },

  batchDeleteAttachmentConfig: async (ids: string[]) => {
    await delay(300)
    const remaining = mockAttachmentConfigs.filter(item => !ids.includes(item.id))
    mockAttachmentConfigs.length = 0
    mockAttachmentConfigs.push(...remaining)

    return {
      code: 200,
      message: '批量删除成功',
      data: null,
      timestamp: Date.now()
    } as ApiResponse<void>
  },

  updateAttachmentConfigStatus: async (id: string, status: 'enabled' | 'disabled') => {
    await delay(200)
    const config = mockAttachmentConfigs.find(item => item.id === id)

    if (!config) {
      return {
        code: 404,
        message: '附件配置不存在',
        data: null,
        timestamp: Date.now()
      } as ApiResponse<AttachmentConfig>
    }

    config.status = status
    config.updatedBy = '当前用户'
    config.updatedAt = new Date()

    return {
      code: 200,
      message: status === 'enabled' ? '启用成功' : '禁用成功',
      data: config,
      timestamp: Date.now()
    } as ApiResponse<AttachmentConfig>
  }
}
