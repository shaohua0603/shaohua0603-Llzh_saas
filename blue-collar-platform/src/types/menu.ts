/**
 * 菜单类型定义
 */

// 一级菜单类型
export interface FirstLevelMenu {
  code: string
  name: string
  icon: string
  path?: string
}

// 二级菜单类型
export interface SecondLevelMenu {
  code: string
  name: string
  icon: string
  path?: string
  children?: ThirdLevelMenu[]
}

// 三级菜单类型
export interface ThirdLevelMenu {
  code: string
  name: string
  icon: string
  path: string
}

// 页面标签类型
export interface PageTab {
  path: string
  title: string
  fixed?: boolean
}

// 右键菜单项类型
export interface ContextMenuItem {
  label: string
  icon: string
  action: string
  disabled?: boolean
}

// 用户信息类型
export interface UserInfo {
  id: string
  username: string
  realName?: string
  avatar?: string
  role: string
  department?: string
}

// 菜单配置类型
export interface MenuConfig {
  firstLevelMenus: FirstLevelMenu[]
  secondLevelMenus: Record<string, SecondLevelMenu[]>
}
