import request from '@/utils/request'

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

export const companyCultureApi = {
  getCompanyCulture: () => {
    return request.get<ApiResponse<CompanyCulture>>('/company-culture')
  },

  saveCompanyCulture: (data: CompanyCulture) => {
    return request.post<ApiResponse<CompanyCulture>>('/company-culture', data)
  }
}

export const positionCultureApi = {
  getPositionCultureList: (params: any) => {
    return request.get<ApiResponse<PageResponse<PositionCulture>>>('/position-culture', { params })
  },

  getPositionCultureDetail: (id: string) => {
    return request.get<ApiResponse<PositionCulture>>(`/position-culture/${id}`)
  },

  savePositionCulture: (data: PositionCulture) => {
    return request.post<ApiResponse<PositionCulture>>('/position-culture', data)
  },

  updatePositionCulture: (id: string, data: PositionCulture) => {
    return request.put<ApiResponse<PositionCulture>>(`/position-culture/${id}`, data)
  },

  deletePositionCulture: (id: string) => {
    return request.delete<ApiResponse<void>>(`/position-culture/${id}`)
  }
}

export const factoryApi = {
  getFactoryList: () => {
    return request.get<ApiResponse<any[]>>('/factories')
  }
}

export const fetchCompanyCulture = companyCultureApi.getCompanyCulture
export const saveCompanyCulture = companyCultureApi.saveCompanyCulture
export const fetchPositionCultureList = positionCultureApi.getPositionCultureList
export const savePositionCulture = positionCultureApi.savePositionCulture
export const deletePositionCulture = positionCultureApi.deletePositionCulture
export const fetchFactoryListAPI = factoryApi.getFactoryList

export const fetchFactoryPositionCultureList = (params: any) => {
  return request.get<ApiResponse<PageResponse<PositionCulture>>>('/api/factory/position-culture', { params })
}
