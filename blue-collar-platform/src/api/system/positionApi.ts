import type { Position, PositionQueryParams, PositionFormData, PositionDetail } from '@/types/system/positionTypes'

// Mock数据
const mockPositions: Position[] = [
  {
    id: '1',
    positionName: '管理员',
    departmentId: '1',
    departmentName: '管理部',
    description: '系统管理员',
    createTime: '2024-01-01 10:00:00',
    updateTime: '2024-01-01 10:00:00'
  },
  {
    id: '2',
    positionName: '操作员',
    departmentId: '2',
    departmentName: '运营部',
    description: '系统操作员',
    createTime: '2024-01-02 11:00:00',
    updateTime: '2024-01-02 11:00:00'
  },
  {
    id: '3',
    positionName: '财务',
    departmentId: '3',
    departmentName: '财务部',
    description: '财务人员',
    createTime: '2024-01-03 12:00:00',
    updateTime: '2024-01-03 12:00:00'
  },
  {
    id: '4',
    positionName: '人事',
    departmentId: '4',
    departmentName: '人事部',
    description: '人事专员',
    createTime: '2024-01-04 13:00:00',
    updateTime: '2024-01-04 13:00:00'
  },
  {
    id: '5',
    positionName: '客服',
    departmentId: '5',
    departmentName: '客服部',
    description: '客服人员',
    createTime: '2024-01-05 14:00:00',
    updateTime: '2024-01-05 14:00:00'
  }
]

// Mock详情数据
const mockPositionDetails: PositionDetail[] = [
  {
    ...mockPositions[0],
    responsibilities: '系统管理、权限配置',
    requirements: '熟悉系统操作',
    status: 'active'
  },
  {
    ...mockPositions[1],
    responsibilities: '日常操作、数据录入',
    requirements: '认真负责',
    status: 'active'
  },
  {
    ...mockPositions[2],
    responsibilities: '财务管理、报表编制',
    requirements: '财务专业',
    status: 'active'
  },
  {
    ...mockPositions[3],
    responsibilities: '人员招聘、培训',
    requirements: '人力资源专业',
    status: 'active'
  },
  {
    ...mockPositions[4],
    responsibilities: '客户服务、问题解答',
    requirements: '沟通能力强',
    status: 'active'
  }
]

/**
 * 模拟延迟
 */
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

export const getPositionList = async (params: PositionQueryParams) => {
  await delay(300)
  
  let filteredPositions = [...mockPositions]
  
  // 关键词搜索
  if (params.keyword) {
    const keyword = params.keyword.toLowerCase()
    filteredPositions = filteredPositions.filter(position => 
      position.positionName.toLowerCase().includes(keyword) ||
      position.departmentName.toLowerCase().includes(keyword)
    )
  }
  
  // 分页
  const start = (params.page - 1) * params.pageSize
  const end = start + params.pageSize
  const paginatedPositions = filteredPositions.slice(start, end)
  
  return {
    list: paginatedPositions,
    total: filteredPositions.length,
    page: params.page,
    pageSize: params.pageSize
  }
}

export const getPositionDetail = async (id: string) => {
  await delay(200)
  const detail = mockPositionDetails.find(d => d.id === id)
  if (!detail) {
    throw new Error('职位不存在')
  }
  return detail
}

export const createPosition = async (data: PositionFormData) => {
  await delay(300)
  const newPosition: Position = {
    id: (mockPositions.length + 1).toString(),
    ...data,
    createTime: new Date().toISOString(),
    updateTime: new Date().toISOString()
  }
  mockPositions.push(newPosition)
  return newPosition
}

export const updatePosition = async (id: string, data: PositionFormData) => {
  await delay(300)
  const index = mockPositions.findIndex(p => p.id === id)
  if (index === -1) {
    throw new Error('职位不存在')
  }
  mockPositions[index] = {
    ...mockPositions[index],
    ...data,
    updateTime: new Date().toISOString()
  }
  return mockPositions[index]
}

export const deletePosition = async (id: string) => {
  await delay(200)
  const index = mockPositions.findIndex(p => p.id === id)
  if (index === -1) {
    throw new Error('职位不存在')
  }
  mockPositions.splice(index, 1)
  const detailIndex = mockPositionDetails.findIndex(d => d.id === id)
  if (detailIndex !== -1) {
    mockPositionDetails.splice(detailIndex, 1)
  }
}

export const batchDeletePositions = async (ids: string[]) => {
  await delay(300)
  for (const id of ids) {
    const index = mockPositions.findIndex(p => p.id === id)
    if (index !== -1) {
      mockPositions.splice(index, 1)
    }
    const detailIndex = mockPositionDetails.findIndex(d => d.id === id)
    if (detailIndex !== -1) {
      mockPositionDetails.splice(detailIndex, 1)
    }
  }
}

export const exportPositions = async (params: PositionQueryParams) => {
  await delay(500)
  // 模拟导出文件
  const blob = new Blob(['职位数据导出'], { type: 'application/vnd.ms-excel' })
  return blob
}

export const checkPositionName = async (positionName: string, id?: string) => {
  await delay(100)
  const existingPosition = mockPositions.find(p => p.positionName === positionName && p.id !== id)
  return !existingPosition
}
