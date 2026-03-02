import request from '@/utils/request'
import type { Menu, MenuQueryParams, MenuForm, ApiResponse, PageResponse } from '@/types/system/menuTypes'

export const getMenuList = (params: MenuQueryParams) => {
  return request.get<PageResponse<Menu>>('/system/menus', { params })
}

export const getMenuTree = (params?: { menuStatus?: string }) => {
  return request.get<Menu[]>('/system/menus/tree', { params })
}

export const getMenuDetail = (id: number) => {
  return request.get<Menu>(`/system/menus/${id}`)
}

export const createMenu = (data: MenuForm) => {
  return request.post<Menu>('/system/menus', data)
}

export const updateMenu = (id: number, data: MenuForm) => {
  return request.put<Menu>(`/system/menus/${id}`, data)
}

export const deleteMenu = (id: number) => {
  return request.delete<void>(`/system/menus/${id}`)
}

export const checkBusinessCode = (businessCode: string, id?: number) => {
  return request.get<boolean>('/system/menus/check-code', {
    params: { businessCode, id }
  })
}
