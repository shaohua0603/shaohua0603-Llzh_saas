export enum MenuType {
  DIRECTORY = 'DIRECTORY',
  MENU = 'MENU',
  BUTTON = 'BUTTON'
}

export enum MenuStatus {
  ENABLED = 'ENABLED',
  DISABLED = 'DISABLED'
}

export enum MenuVisible {
  TRUE = 'TRUE',
  FALSE = 'FALSE'
}

export interface Menu {
  id?: number
  parentId?: number
  menuName: string
  menuType: MenuType
  menuIcon?: string
  businessCode: string
  menuPath?: string
  componentPath?: string
  sortOrder: number
  menuStatus: MenuStatus
  visible: MenuVisible
  menuDesc?: string
  tenantId?: number
  createTime?: string
  updateTime?: string
  createBy?: string
  updateBy?: string
  children?: Menu[]
  hasChildren?: boolean
}

export interface MenuQueryParams {
  page: number
  pageSize: number
  keyword?: string
  menuType?: MenuType
  menuStatus?: MenuStatus
}

export interface MenuForm {
  id?: number
  parentId?: number
  menuName: string
  menuType: MenuType
  menuIcon?: string
  businessCode: string
  menuPath?: string
  componentPath?: string
  sortOrder: number
  menuStatus: MenuStatus
  visible: MenuVisible
  menuDesc?: string
}

export interface MenuTreeNode {
  id: number
  label: string
  type: MenuType
  icon?: string
  code: string
  path?: string
  sort: number
  status: MenuStatus
  children?: MenuTreeNode[]
}

export interface ApiResponse<T> {
  code: number
  message: string
  data: T
  timestamp: number
}

export interface PageResponse<T> {
  list: T[]
  total: number
  page: number
  pageSize: number
}
