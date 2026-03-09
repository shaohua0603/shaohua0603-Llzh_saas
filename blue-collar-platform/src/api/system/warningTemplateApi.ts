/**
 * 预警消息模版查询参数
 */
export interface WarningTemplateQueryParams {
  page: number
  pageSize: number
  keyword?: string
}

/**
 * 预警消息模版信息
 */
export interface WarningTemplate {
  id: string
  name: string
  content: string
  variables: string[]
  createTime: string
  updateTime: string
}

/**
 * 预警消息模版表单数据
 */
export interface WarningTemplateFormData {
  name: string
  content: string
}

/**
 * 分页响应
 */
export interface PageResponse<T> {
  list: T[]
  total: number
  page: number
  pageSize: number
}

// Mock数据
const mockWarningTemplates: WarningTemplate[] = [
  {
    id: '1',
    name: '登录异常预警',
    content: '用户${username}在${time}尝试登录失败，IP地址：${ip}',
    variables: ['username', 'time', 'ip'],
    createTime: '2024-01-01 10:00:00',
    updateTime: '2024-01-01 10:00:00'
  },
  {
    id: '2',
    name: '工单超时预警',
    content: '工单${orderId}已超时${hours}小时，请及时处理',
    variables: ['orderId', 'hours'],
    createTime: '2024-01-02 11:00:00',
    updateTime: '2024-01-02 11:00:00'
  },
  {
    id: '3',
    name: '库存不足预警',
    content: '商品${productName}库存不足，当前库存：${stock}',
    variables: ['productName', 'stock'],
    createTime: '2024-01-03 12:00:00',
    updateTime: '2024-01-03 12:00:00'
  },
  {
    id: '4',
    name: '系统异常预警',
    content: '系统${systemName}出现异常：${errorMessage}',
    variables: ['systemName', 'errorMessage'],
    createTime: '2024-01-04 13:00:00',
    updateTime: '2024-01-04 13:00:00'
  },
  {
    id: '5',
    name: '审批超时预警',
    content: '审批${approvalId}已超时${days}天，请及时处理',
    variables: ['approvalId', 'days'],
    createTime: '2024-01-05 14:00:00',
    updateTime: '2024-01-05 14:00:00'
  }
]

/**
 * 模拟延迟
 */
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

/**
 * 获取预警消息模版列表
 * @param params 查询参数
 */
export const getWarningTemplateList = async (params: WarningTemplateQueryParams) => {
  await delay(300)
  
  let filteredTemplates = [...mockWarningTemplates]
  
  // 关键词搜索
  if (params.keyword) {
    const keyword = params.keyword.toLowerCase()
    filteredTemplates = filteredTemplates.filter(template => 
      template.name.toLowerCase().includes(keyword) ||
      template.content.toLowerCase().includes(keyword)
    )
  }
  
  // 分页
  const start = (params.page - 1) * params.pageSize
  const end = start + params.pageSize
  const paginatedTemplates = filteredTemplates.slice(start, end)
  
  return {
    list: paginatedTemplates,
    total: filteredTemplates.length,
    page: params.page,
    pageSize: params.pageSize
  }
}

/**
 * 获取预警消息模版详情
 * @param id 模版ID
 */
export const getWarningTemplateDetail = async (id: string) => {
  await delay(200)
  const template = mockWarningTemplates.find(t => t.id === id)
  if (!template) {
    throw new Error('模版不存在')
  }
  return template
}

/**
 * 创建预警消息模版
 * @param data 模版表单数据
 */
export const createWarningTemplate = async (data: WarningTemplateFormData) => {
  await delay(300)
  // 提取变量
  const variables = extractVariables(data.content)
  const newTemplate: WarningTemplate = {
    id: (mockWarningTemplates.length + 1).toString(),
    ...data,
    variables,
    createTime: new Date().toISOString(),
    updateTime: new Date().toISOString()
  }
  mockWarningTemplates.push(newTemplate)
  return newTemplate
}

/**
 * 更新预警消息模版
 * @param id 模版ID
 * @param data 模版表单数据
 */
export const updateWarningTemplate = async (id: string, data: WarningTemplateFormData) => {
  await delay(300)
  const index = mockWarningTemplates.findIndex(t => t.id === id)
  if (index === -1) {
    throw new Error('模版不存在')
  }
  // 提取变量
  const variables = extractVariables(data.content)
  mockWarningTemplates[index] = {
    ...mockWarningTemplates[index],
    ...data,
    variables,
    updateTime: new Date().toISOString()
  }
  return mockWarningTemplates[index]
}

/**
 * 删除预警消息模版
 * @param id 模版ID
 */
export const deleteWarningTemplate = async (id: string) => {
  await delay(200)
  const index = mockWarningTemplates.findIndex(t => t.id === id)
  if (index === -1) {
    throw new Error('模版不存在')
  }
  mockWarningTemplates.splice(index, 1)
}

/**
 * 批量删除预警消息模版
 * @param ids 模版ID数组
 */
export const batchDeleteWarningTemplates = async (ids: string[]) => {
  await delay(300)
  for (const id of ids) {
    const index = mockWarningTemplates.findIndex(t => t.id === id)
    if (index !== -1) {
      mockWarningTemplates.splice(index, 1)
    }
  }
}

/**
 * 检查模版名称是否重复
 * @param name 模版名称
 * @param id 模版ID(编辑时传入)
 */
export const checkWarningTemplateName = async (name: string, id?: string) => {
  await delay(100)
  const existingTemplate = mockWarningTemplates.find(t => t.name === name && t.id !== id)
  return !existingTemplate
}

/**
 * 预览模版内容
 * @param id 模版ID
 * @param variables 变量数据
 */
export const previewWarningTemplate = async (id: string, variables: Record<string, any>) => {
  await delay(200)
  const template = mockWarningTemplates.find(t => t.id === id)
  if (!template) {
    throw new Error('模版不存在')
  }
  
  let previewContent = template.content
  for (const [key, value] of Object.entries(variables)) {
    previewContent = previewContent.replace(new RegExp(`\\$\\{${key}\\}`, 'g'), String(value))
  }
  
  return { content: previewContent }
}

/**
 * 从模版内容中提取变量
 * @param content 模版内容
 */
const extractVariables = (content: string): string[] => {
  const regex = /\$\{([^}]+)\}/g
  const variables = new Set<string>()
  let match
  while ((match = regex.exec(content)) !== null) {
    variables.add(match[1])
  }
  return Array.from(variables)
}
