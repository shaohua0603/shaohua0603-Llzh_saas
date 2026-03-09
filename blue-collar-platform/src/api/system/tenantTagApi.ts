/**
 * 租户标签查询参数
 */
export interface TenantTagQueryParams {
  page: number
  pageSize: number
  keyword?: string
}

/**
 * 租户标签信息
 */
export interface TenantTag {
  id: string
  name: string
  description?: string
  createTime: string
  updateTime: string
}

/**
 * 租户标签表单数据
 */
export interface TenantTagFormData {
  name: string
  description?: string
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
const mockTenantTags: TenantTag[] = [
  {
    id: '1',
    name: '大型企业',
    description: '员工人数1000人以上',
    createTime: '2024-01-01 10:00:00',
    updateTime: '2024-01-01 10:00:00'
  },
  {
    id: '2',
    name: '中型企业',
    description: '员工人数100-999人',
    createTime: '2024-01-02 11:00:00',
    updateTime: '2024-01-02 11:00:00'
  },
  {
    id: '3',
    name: '小型企业',
    description: '员工人数100人以下',
    createTime: '2024-01-03 12:00:00',
    updateTime: '2024-01-03 12:00:00'
  },
  {
    id: '4',
    name: '制造业',
    description: '制造行业企业',
    createTime: '2024-01-04 13:00:00',
    updateTime: '2024-01-04 13:00:00'
  },
  {
    id: '5',
    name: '服务业',
    description: '服务行业企业',
    createTime: '2024-01-05 14:00:00',
    updateTime: '2024-01-05 14:00:00'
  }
]

/**
 * 模拟延迟
 */
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

/**
 * 获取租户标签列表
 * @param params 查询参数
 */
export const getTenantTagList = async (params: TenantTagQueryParams) => {
  await delay(300)
  
  let filteredTags = [...mockTenantTags]
  
  // 关键词搜索
  if (params.keyword) {
    const keyword = params.keyword.toLowerCase()
    filteredTags = filteredTags.filter(tag => 
      tag.name.toLowerCase().includes(keyword) ||
      tag.description?.toLowerCase().includes(keyword)
    )
  }
  
  // 分页
  const start = (params.page - 1) * params.pageSize
  const end = start + params.pageSize
  const paginatedTags = filteredTags.slice(start, end)
  
  return {
    list: paginatedTags,
    total: filteredTags.length,
    page: params.page,
    pageSize: params.pageSize
  }
}

/**
 * 获取租户标签详情
 * @param id 标签ID
 */
export const getTenantTagDetail = async (id: string) => {
  await delay(200)
  const tag = mockTenantTags.find(t => t.id === id)
  if (!tag) {
    throw new Error('标签不存在')
  }
  return tag
}

/**
 * 创建租户标签
 * @param data 标签表单数据
 */
export const createTenantTag = async (data: TenantTagFormData) => {
  await delay(300)
  const newTag: TenantTag = {
    id: (mockTenantTags.length + 1).toString(),
    ...data,
    createTime: new Date().toISOString(),
    updateTime: new Date().toISOString()
  }
  mockTenantTags.push(newTag)
  return newTag
}

/**
 * 更新租户标签
 * @param id 标签ID
 * @param data 标签表单数据
 */
export const updateTenantTag = async (id: string, data: TenantTagFormData) => {
  await delay(300)
  const index = mockTenantTags.findIndex(t => t.id === id)
  if (index === -1) {
    throw new Error('标签不存在')
  }
  mockTenantTags[index] = {
    ...mockTenantTags[index],
    ...data,
    updateTime: new Date().toISOString()
  }
  return mockTenantTags[index]
}

/**
 * 删除租户标签
 * @param id 标签ID
 */
export const deleteTenantTag = async (id: string) => {
  await delay(200)
  const index = mockTenantTags.findIndex(t => t.id === id)
  if (index === -1) {
    throw new Error('标签不存在')
  }
  mockTenantTags.splice(index, 1)
}

/**
 * 批量删除租户标签
 * @param ids 标签ID数组
 */
export const batchDeleteTenantTags = async (ids: string[]) => {
  await delay(300)
  for (const id of ids) {
    const index = mockTenantTags.findIndex(t => t.id === id)
    if (index !== -1) {
      mockTenantTags.splice(index, 1)
    }
  }
}

/**
 * 检查标签名称是否重复
 * @param name 标签名称
 * @param id 标签ID(编辑时传入)
 */
export const checkTenantTagName = async (name: string, id?: string) => {
  await delay(100)
  const existingTag = mockTenantTags.find(t => t.name === name && t.id !== id)
  return !existingTag
}
