/**
 * 注册用户查询参数
 */
export interface RegisteredUserQueryParams {
  page: number
  pageSize: number
  keyword?: string
  status?: string
}

/**
 * 注册用户信息
 */
export interface RegisteredUser {
  id: string
  username: string
  phone: string
  email?: string
  name?: string
  idCard?: string
  registerTime: string
  lastLoginTime?: string
  status: 'enabled' | 'disabled'
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
const mockRegisteredUsers: RegisteredUser[] = [
  {
    id: '1',
    username: 'user1',
    phone: '13800138001',
    email: 'user1@example.com',
    name: '用户1',
    idCard: '110101199001011231',
    registerTime: '2024-01-01 10:00:00',
    lastLoginTime: '2024-06-15 14:30:00',
    status: 'enabled'
  },
  {
    id: '2',
    username: 'user2',
    phone: '13900139001',
    email: 'user2@example.com',
    name: '用户2',
    idCard: '110101199001011232',
    registerTime: '2024-01-02 11:00:00',
    lastLoginTime: '2024-06-14 10:20:00',
    status: 'enabled'
  },
  {
    id: '3',
    username: 'user3',
    phone: '13700137001',
    email: 'user3@example.com',
    name: '用户3',
    idCard: '110101199001011233',
    registerTime: '2024-01-03 12:00:00',
    lastLoginTime: '2024-06-10 09:15:00',
    status: 'disabled'
  },
  {
    id: '4',
    username: 'user4',
    phone: '13600136001',
    email: 'user4@example.com',
    name: '用户4',
    idCard: '110101199001011234',
    registerTime: '2024-01-04 13:00:00',
    lastLoginTime: '2024-06-13 16:45:00',
    status: 'enabled'
  },
  {
    id: '5',
    username: 'user5',
    phone: '13500135001',
    email: 'user5@example.com',
    name: '用户5',
    idCard: '110101199001011235',
    registerTime: '2024-01-05 14:00:00',
    lastLoginTime: '2024-06-12 11:30:00',
    status: 'enabled'
  }
]

/**
 * 模拟延迟
 */
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

/**
 * 获取注册用户列表
 * @param params 查询参数
 */
export const getRegisteredUserList = async (params: RegisteredUserQueryParams) => {
  await delay(300)
  
  let filteredUsers = [...mockRegisteredUsers]
  
  // 筛选状态
  if (params.status) {
    filteredUsers = filteredUsers.filter(user => user.status === params.status)
  }
  
  // 关键词搜索
  if (params.keyword) {
    const keyword = params.keyword.toLowerCase()
    filteredUsers = filteredUsers.filter(user => 
      user.username.toLowerCase().includes(keyword) ||
      user.name?.toLowerCase().includes(keyword) ||
      user.phone.includes(keyword)
    )
  }
  
  // 分页
  const start = (params.page - 1) * params.pageSize
  const end = start + params.pageSize
  const paginatedUsers = filteredUsers.slice(start, end)
  
  return {
    list: paginatedUsers,
    total: filteredUsers.length,
    page: params.page,
    pageSize: params.pageSize
  }
}

/**
 * 启用用户
 * @param id 用户ID
 */
export const enableRegisteredUser = async (id: string) => {
  await delay(200)
  const user = mockRegisteredUsers.find(u => u.id === id)
  if (!user) {
    throw new Error('用户不存在')
  }
  user.status = 'enabled'
  return user
}

/**
 * 禁用用户
 * @param id 用户ID
 */
export const disableRegisteredUser = async (id: string) => {
  await delay(200)
  const user = mockRegisteredUsers.find(u => u.id === id)
  if (!user) {
    throw new Error('用户不存在')
  }
  user.status = 'disabled'
  return user
}

/**
 * 重置用户密码
 * @param id 用户ID
 */
export const resetRegisteredUserPassword = async (id: string) => {
  await delay(200)
  const user = mockRegisteredUsers.find(u => u.id === id)
  if (!user) {
    throw new Error('用户不存在')
  }
  return { newPassword: '123456' }
}

/**
 * 批量启用用户
 * @param ids 用户ID数组
 */
export const batchEnableRegisteredUsers = async (ids: string[]) => {
  await delay(300)
  for (const id of ids) {
    const user = mockRegisteredUsers.find(u => u.id === id)
    if (user) {
      user.status = 'enabled'
    }
  }
}

/**
 * 批量禁用用户
 * @param ids 用户ID数组
 */
export const batchDisableRegisteredUsers = async (ids: string[]) => {
  await delay(300)
  for (const id of ids) {
    const user = mockRegisteredUsers.find(u => u.id === id)
    if (user) {
      user.status = 'disabled'
    }
  }
}
