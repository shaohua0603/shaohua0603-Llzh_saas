import request from '@/utils/request'
import type { Position, PositionQueryParams, PositionFormData, PositionDetail } from '@/types/system/positionTypes'

export const getPositionList = (params: PositionQueryParams) => {
  return request.get('/system/positions', { params })
}

export const getPositionDetail = (id: string) => {
  return request.get<PositionDetail>(`/system/positions/${id}`)
}

export const createPosition = (data: PositionFormData) => {
  return request.post<Position>('/system/positions', data)
}

export const updatePosition = (id: string, data: PositionFormData) => {
  return request.put<Position>(`/system/positions/${id}`, data)
}

export const deletePosition = (id: string) => {
  return request.delete<void>(`/system/positions/${id}`)
}

export const batchDeletePositions = (ids: string[]) => {
  return request.delete<void>('/system/positions/batch', { data: { ids } })
}

export const exportPositions = (params: PositionQueryParams) => {
  return request.get('/system/positions/export', { params, responseType: 'blob' })
}

export const checkPositionName = (positionName: string, id?: string) => {
  return request.get<boolean>('/system/positions/check-name', {
    params: { positionName, id }
  })
}
