/**
 * 学历对应岗位查询参数
 */
export interface EducationPositionQueryParams {
  page: number
  pageSize: number
  keyword?: string
}

/**
 * 学历对应岗位信息
 */
export interface EducationPosition {
  id: string
  educationLevel: string
  jobName: string
  createTime: string
  updateTime: string
}

/**
 * 学历对应岗位表单数据
 */
export interface EducationPositionFormData {
  educationLevel: string
  jobName: string
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

/**
 * 响应格式
 */
export interface ApiResponse<T> {
  code: number
  message: string
  data: T
  timestamp: number
}

// 模拟延迟
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

// Mock数据
const mockEducationPositions: EducationPosition[] = [
  {
    id: '1',
    educationLevel: '初中及以下',
    jobName: '普工',
    createTime: '2024-01-01 09:00:00',
    updateTime: '2024-01-01 09:00:00'
  },
  {
    id: '2',
    educationLevel: '高中/中专',
    jobName: '技工',
    createTime: '2024-01-02 09:00:00',
    updateTime: '2024-01-02 09:00:00'
  },
  {
    id: '3',
    educationLevel: '大专',
    jobName: '技术员',
    createTime: '2024-01-03 09:00:00',
    updateTime: '2024-01-03 09:00:00'
  },
  {
    id: '4',
    educationLevel: '本科',
    jobName: '工程师',
    createTime: '2024-01-04 09:00:00',
    updateTime: '2024-01-04 09:00:00'
  },
  {
    id: '5',
    educationLevel: '硕士及以上',
    jobName: '高级工程师',
    createTime: '2024-01-05 09:00:00',
    updateTime: '2024-01-05 09:00:00'
  }
]

/**
 * 学历等级选项
 */
export const educationLevelOptions = [
  { label: '初中及以下', value: '初中及以下' },
  { label: '高中/中专', value: '高中/中专' },
  { label: '大专', value: '大专' },
  { label: '本科', value: '本科' },
  { label: '硕士及以上', value: '硕士及以上' }
]

/**
 * 获取学历等级选项
 */
export const getEducationLevelOptions = () => {
  return educationLevelOptions
}

/**
 * 获取学历对应岗位列表
 * @param params 查询参数
 */
export const getEducationPositionList = async (params: EducationPositionQueryParams): Promise<ApiResponse<PageResponse<EducationPosition>>> => {
  await delay(500)
  let filteredPositions = [...mockEducationPositions]
  
  if (params.keyword) {
    const keyword = params.keyword.toLowerCase()
    filteredPositions = filteredPositions.filter(position => 
      position.educationLevel.toLowerCase().includes(keyword) ||
      position.jobName.toLowerCase().includes(keyword)
    )
  }
  
  const page = params.page || 1
  const pageSize = params.pageSize || 10
  const start = (page - 1) * pageSize
  const end = start + pageSize
  
  return {
    code: 200,
    message: '成功',
    data: {
      list: filteredPositions.slice(start, end),
      total: filteredPositions.length,
      page,
      pageSize
    },
    timestamp: Date.now()
  }
}

/**
 * 获取学历对应岗位详情
 * @param id 岗位ID
 */
export const getEducationPositionDetail = async (id: string): Promise<ApiResponse<EducationPosition>> => {
  await delay(300)
  const position = mockEducationPositions.find(p => p.id === id)
  if (!position) {
    return {
      code: 404,
      message: '学历对应岗位不存在',
      data: null,
      timestamp: Date.now()
    }
  }
  return {
    code: 200,
    message: '成功',
    data: position,
    timestamp: Date.now()
  }
}

/**
 * 创建学历对应岗位
 * @param data 岗位表单数据
 */
export const createEducationPosition = async (data: EducationPositionFormData): Promise<ApiResponse<EducationPosition>> => {
  await delay(500)
  const newPosition: EducationPosition = {
    id: (mockEducationPositions.length + 1).toString(),
    educationLevel: data.educationLevel,
    jobName: data.jobName,
    createTime: new Date().toISOString(),
    updateTime: new Date().toISOString()
  }
  mockEducationPositions.push(newPosition)
  return {
    code: 200,
    message: '成功',
    data: newPosition,
    timestamp: Date.now()
  }
}

/**
 * 更新学历对应岗位
 * @param id 岗位ID
 * @param data 岗位表单数据
 */
export const updateEducationPosition = async (id: string, data: EducationPositionFormData): Promise<ApiResponse<EducationPosition>> => {
  await delay(500)
  const index = mockEducationPositions.findIndex(p => p.id === id)
  if (index === -1) {
    return {
      code: 404,
      message: '学历对应岗位不存在',
      data: null,
      timestamp: Date.now()
    }
  }
  mockEducationPositions[index] = {
    ...mockEducationPositions[index],
    educationLevel: data.educationLevel,
    jobName: data.jobName,
    updateTime: new Date().toISOString()
  }
  return {
    code: 200,
    message: '成功',
    data: mockEducationPositions[index],
    timestamp: Date.now()
  }
}

/**
 * 删除学历对应岗位
 * @param id 岗位ID
 */
export const deleteEducationPosition = async (id: string): Promise<ApiResponse<void>> => {
  await delay(300)
  const index = mockEducationPositions.findIndex(p => p.id === id)
  if (index === -1) {
    return {
      code: 404,
      message: '学历对应岗位不存在',
      data: null,
      timestamp: Date.now()
    }
  }
  mockEducationPositions.splice(index, 1)
  return {
    code: 200,
    message: '成功',
    data: null,
    timestamp: Date.now()
  }
}

/**
 * 批量删除学历对应岗位
 * @param ids 岗位ID数组
 */
export const batchDeleteEducationPositions = async (ids: string[]): Promise<ApiResponse<void>> => {
  await delay(500)
  for (const id of ids) {
    const index = mockEducationPositions.findIndex(p => p.id === id)
    if (index !== -1) {
      mockEducationPositions.splice(index, 1)
    }
  }
  return {
    code: 200,
    message: '成功',
    data: null,
    timestamp: Date.now()
  }
}
