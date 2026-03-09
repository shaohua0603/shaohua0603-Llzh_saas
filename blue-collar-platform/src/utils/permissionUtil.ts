/**
 * 权限控制工具类
 */

/**
 * 用户角色类型
 */
export type UserRole = 'worker' | 'tenant' | 'platform_admin'

/**
 * 权限类型
 */
export type PermissionType = 'view' | 'create' | 'update' | 'delete' | 'export' | 'import' | 'approve' | 'publish'

/**
 * 菜单权限
 */
export interface MenuPermission {
  /** 菜单路径 */
  path: string
  /** 菜单名称 */
  name: string
  /** 父级菜单路径 */
  parentPath?: string
  /** 是否显示 */
  visible: boolean
  /** 排序 */
  order: number
}

/**
 * 按钮权限
 */
export interface ButtonPermission {
  /** 按钮标识 */
  code: string
  /** 按钮名称 */
  name: string
  /** 所属菜单 */
  menuPath: string
  /** 权限类型 */
  type: PermissionType
  /** 是否显示 */
  visible: boolean
}

/**
 * 数据权限类型
 */
export type DataPermissionType = 'ALL' | 'DEPARTMENT' | 'DEPARTMENT_AND_BELOW' | 'SELF' | 'CUSTOM'

/**
 * 数据权限配置
 */
export interface DataPermissionConfig {
  /** 权限类型 */
  type: DataPermissionType
  /** 部门ID列表(用于CUSTOM类型) */
  departments?: string[]
  /** 是否包含创建人 */
  includeCreator?: boolean
  /** 是否包含负责人 */
  includeManager?: boolean
  /** 是否包含对接人 */
  includeContact?: boolean
}

/**
 * 用户权限信息
 */
export interface UserPermission {
  /** 用户ID */
  userId: string
  /** 用户角色 */
  role: UserRole
  /** 用户名 */
  username: string
  /** 菜单权限 */
  menus: MenuPermission[]
  /** 按钮权限 */
  buttons: ButtonPermission[]
  /** 数据权限 */
  dataPermission: DataPermissionConfig
  /** 部门ID */
  departmentId?: string
  /** 部门路径 */
  departmentPath?: string[]
}

/**
 * 权限工具类
 */
export class PermissionUtil {
  private static permissionKey = 'user_permission'

  /**
   * 获取用户权限信息
   */
  static getUserPermission(): UserPermission | null {
    const permissionStr = localStorage.getItem(this.permissionKey)
    if (!permissionStr) return null
    try {
      return JSON.parse(permissionStr)
    } catch {
      return null
    }
  }

  /**
   * 设置用户权限信息
   */
  static setUserPermission(permission: UserPermission): void {
    localStorage.setItem(this.permissionKey, JSON.stringify(permission))
  }

  /**
   * 清除用户权限信息
   */
  static clearUserPermission(): void {
    localStorage.removeItem(this.permissionKey)
  }

  /**
   * 检查是否有菜单权限
   */
  static hasMenuPermission(path: string): boolean {
    const permission = this.getUserPermission()
    if (!permission) return false

    // 平台管理员拥有所有权限
    if (permission.role === 'platform_admin') return true

    return permission.menus.some(menu => menu.path === path && menu.visible)
  }

  /**
   * 检查是否有按钮权限
   */
  static hasButtonPermission(code: string, menuPath?: string): boolean {
    const permission = this.getUserPermission()
    if (!permission) return true

    // 平台管理员拥有所有权限
    if (permission.role === 'platform_admin') return true

    // 如果没有按钮权限配置，默认显示所有按钮
    if (!permission.buttons) return true

    const button = permission.buttons.find(btn => btn.code === code)
    if (!button) return true

    // 如果指定了菜单路径,检查按钮是否属于该菜单
    if (menuPath && button.menuPath !== menuPath) return true

    return button.visible
  }

  /**
   * 检查是否有指定类型的权限
   */
  static hasPermission(type: PermissionType, menuPath?: string): boolean {
    const permission = this.getUserPermission()
    if (!permission) return true

    // 平台管理员拥有所有权限
    if (permission.role === 'platform_admin') return true

    // 如果没有按钮权限配置，默认显示所有按钮
    if (!permission.buttons) return true

    return permission.buttons.some(btn => {
      if (btn.type !== type) return false
      if (menuPath && btn.menuPath !== menuPath) return false
      return btn.visible
    })
  }

  /**
   * 检查是否有数据权限
   */
  static hasDataPermission(): boolean {
    return true
  }

  /**
   * 获取数据权限配置
   */
  static getDataPermission(): DataPermissionConfig | null {
    return null
  }

  /**
   * 检查是否是平台管理员
   */
  static isPlatformAdmin(): boolean {
    const permission = this.getUserPermission()
    return permission?.role === 'platform_admin'
  }

  /**
   * 检查是否是租户用户
   */
  static isTenant(): boolean {
    const permission = this.getUserPermission()
    return permission?.role === 'tenant'
  }

  /**
   * 检查是否是工人用户
   */
  static isWorker(): boolean {
    const permission = this.getUserPermission()
    return permission?.role === 'worker'
  }

  /**
   * 获取用户角色
   */
  static getUserRole(): UserRole | null {
    const permission = this.getUserPermission()
    return permission?.role || null
  }

  /**
   * 获取用户ID
   */
  static getUserId(): string | null {
    const permission = this.getUserPermission()
    return permission?.userId || null
  }

  /**
   * 获取用户部门ID
   */
  static getDepartmentId(): string | null {
    const permission = this.getUserPermission()
    return permission?.departmentId || null
  }

  /**
   * 获取用户部门路径
   */
  static getDepartmentPath(): string[] | null {
    const permission = this.getUserPermission()
    return permission?.departmentPath || null
  }

  /**
   * 过滤可见菜单
   */
  static filterVisibleMenus(menus: MenuPermission[]): MenuPermission[] {
    const permission = this.getUserPermission()
    if (!permission) return menus

    // 平台管理员显示所有菜单
    if (permission.role === 'platform_admin') return menus

    const userMenuPaths = permission.menus.filter(m => m.visible).map(m => m.path)
    return menus.filter(menu => userMenuPaths.includes(menu.path))
  }

  /**
   * 过滤可见按钮
   */
  static filterVisibleButtons(buttons: ButtonPermission[], menuPath?: string): ButtonPermission[] {
    const permission = this.getUserPermission()
    if (!permission) return buttons

    // 平台管理员显示所有按钮
    if (permission.role === 'platform_admin') return buttons

    const userButtonCodes = permission.buttons.filter(b => b.visible).map(b => b.code)
    return buttons.filter(button => {
      if (!userButtonCodes.includes(button.code)) return false
      if (menuPath && button.menuPath !== menuPath) return false
      return true
    })
  }

  /**
   * 构建数据权限查询条件
   */
  static buildDataPermissionQuery(): Record<string, any> {
    return {}
  }

  /**
   * 检查数据是否在权限范围内
   */
  static isDataInScope(data: Record<string, any>): boolean {
    return true
  }
}
