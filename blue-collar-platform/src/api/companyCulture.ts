export interface CompanyCulture {
  id?: string
  title: string
  shortName: string
  content: string
  createTime?: string
  updateTime?: string
}

export interface PositionCulture {
  id?: string
  factoryId: string
  factoryName?: string
  title: string
  content: string
  createTime?: string
  updateTime?: string
}

export interface PageResponse<T> {
  list: T[]
  total: number
  page: number
  pageSize: number
}

export interface ApiResponse<T> {
  code: number
  message: string
  data: T
  timestamp: number
}

// 模拟延迟
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

// Mock数据
const mockCompanyCulture: CompanyCulture = {
  id: '1',
  title: '企业文化',
  shortName: '企业文化',
  content: '我们的企业文化是诚信、创新、共赢',
  createTime: '2024-01-01 09:00:00',
  updateTime: '2024-01-01 10:00:00'
}

const mockPositionCultures: PositionCulture[] = [
  {
    id: '1',
    factoryId: 'F001',
    factoryName: '深圳富士康科技有限公司',
    title: '普工岗位文化',
    content: '普工岗位文化是吃苦耐劳、精益求精',
    createTime: '2024-01-01 09:00:00',
    updateTime: '2024-01-01 10:00:00'
  },
  {
    id: '2',
    factoryId: 'F002',
    factoryName: '华为技术有限公司',
    title: '技术员岗位文化',
    content: '技术员岗位文化是创新、专业、协作',
    createTime: '2024-01-02 09:00:00',
    updateTime: '2024-01-02 10:00:00'
  }
]

const mockFactories = [
  { id: 'F001', name: '深圳富士康科技有限公司' },
  { id: 'F002', name: '华为技术有限公司' },
  { id: 'F003', name: '比亚迪股份有限公司' }
]

export const companyCultureApi = {
  getCompanyCulture: async () => {
    await delay(300)
    return {
      code: 200,
      message: '成功',
      data: mockCompanyCulture,
      timestamp: Date.now()
    }
  },

  saveCompanyCulture: async (data: CompanyCulture) => {
    await delay(500)
    mockCompanyCulture.title = data.title
    mockCompanyCulture.shortName = data.shortName
    mockCompanyCulture.content = data.content
    mockCompanyCulture.updateTime = new Date().toISOString()
    return {
      code: 200,
      message: '成功',
      data: mockCompanyCulture,
      timestamp: Date.now()
    }
  }
}

export const positionCultureApi = {
  getPositionCultureList: async (params: any) => {
    await delay(500)
    let filteredPositionCultures = [...mockPositionCultures]
    
    if (params.factoryId) {
      filteredPositionCultures = filteredPositionCultures.filter(pc => pc.factoryId === params.factoryId)
    }
    
    const page = params.page || 1
    const pageSize = params.pageSize || 10
    const start = (page - 1) * pageSize
    const end = start + pageSize
    
    return {
      code: 200,
      message: '成功',
      data: {
        list: filteredPositionCultures.slice(start, end),
        total: filteredPositionCultures.length,
        page,
        pageSize
      },
      timestamp: Date.now()
    }
  },

  getPositionCultureDetail: async (id: string) => {
    await delay(300)
    const positionCulture = mockPositionCultures.find(pc => pc.id === id)
    if (!positionCulture) {
      return {
        code: 404,
        message: '岗位文化不存在',
        data: null,
        timestamp: Date.now()
      }
    }
    return {
      code: 200,
      message: '成功',
      data: positionCulture,
      timestamp: Date.now()
    }
  },

  savePositionCulture: async (data: PositionCulture) => {
    await delay(500)
    const newPositionCulture: PositionCulture = {
      id: (mockPositionCultures.length + 1).toString(),
      factoryId: data.factoryId,
      factoryName: mockFactories.find(f => f.id === data.factoryId)?.name,
      title: data.title,
      content: data.content,
      createTime: new Date().toISOString(),
      updateTime: new Date().toISOString()
    }
    mockPositionCultures.push(newPositionCulture)
    return {
      code: 200,
      message: '成功',
      data: newPositionCulture,
      timestamp: Date.now()
    }
  },

  updatePositionCulture: async (id: string, data: PositionCulture) => {
    await delay(500)
    const index = mockPositionCultures.findIndex(pc => pc.id === id)
    if (index === -1) {
      return {
        code: 404,
        message: '岗位文化不存在',
        data: null,
        timestamp: Date.now()
      }
    }
    mockPositionCultures[index] = {
      ...mockPositionCultures[index],
      ...data,
      factoryName: mockFactories.find(f => f.id === data.factoryId)?.name,
      updateTime: new Date().toISOString()
    }
    return {
      code: 200,
      message: '成功',
      data: mockPositionCultures[index],
      timestamp: Date.now()
    }
  },

  deletePositionCulture: async (id: string) => {
    await delay(300)
    const index = mockPositionCultures.findIndex(pc => pc.id === id)
    if (index === -1) {
      return {
        code: 404,
        message: '岗位文化不存在',
        data: null,
        timestamp: Date.now()
      }
    }
    mockPositionCultures.splice(index, 1)
    return {
      code: 200,
      message: '成功',
      data: null,
      timestamp: Date.now()
    }
  }
}

export const factoryApi = {
  getFactoryList: async () => {
    await delay(300)
    return {
      code: 200,
      message: '成功',
      data: mockFactories,
      timestamp: Date.now()
    }
  }
}

export const fetchCompanyCulture = companyCultureApi.getCompanyCulture
export const saveCompanyCulture = companyCultureApi.saveCompanyCulture
export const fetchPositionCultureList = positionCultureApi.getPositionCultureList
export const savePositionCulture = positionCultureApi.savePositionCulture
export const updatePositionCulture = positionCultureApi.updatePositionCulture
export const fetchPositionCultureDetail = positionCultureApi.getPositionCultureDetail
export const deletePositionCulture = positionCultureApi.deletePositionCulture
export const fetchFactoryListAPI = factoryApi.getFactoryList

export const fetchFactoryPositionCultureList = async (params: any) => {
  await delay(500)
  let filteredPositionCultures = [...mockPositionCultures]
  
  if (params.factoryId) {
    filteredPositionCultures = filteredPositionCultures.filter(pc => pc.factoryId === params.factoryId)
  }
  
  const page = params.page || 1
  const pageSize = params.pageSize || 10
  const start = (page - 1) * pageSize
  const end = start + pageSize
  
  return {
    code: 200,
    message: '成功',
    data: {
      list: filteredPositionCultures.slice(start, end),
      total: filteredPositionCultures.length,
      page,
      pageSize
    },
    timestamp: Date.now()
  }
}
