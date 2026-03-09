/**
 * 平台账号查询参数
 */
export interface PlatformAccountQueryParams {
  page: number
  pageSize: number
  keyword?: string
  status?: string
}

/**
 * 平台账号信息
 */
export interface PlatformAccount {
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
 * 平台账号表单数据
 */
export interface PlatformAccountFormData {
  username: string
  phone: string
  email?: string
  name?: string
  idCard?: string
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
const mockPlatformAccounts: PlatformAccount[] = [
  {
    id: '1',
    username: 'admin',
    phone: '13800138000',
    email: 'admin@example.com',
    name: '管理员',
    idCard: '110101199001011234',
    registerTime: '2024-01-01 10:00:00',
    lastLoginTime: '2024-06-15 14:30:00',
    status: 'enabled'
  },
  {
    id: '2',
    username: 'operator',
    phone: '13900139000',
    email: 'operator@example.com',
    name: '操作员',
    idCard: '110101199001011235',
    registerTime: '2024-01-02 11:00:00',
    lastLoginTime: '2024-06-14 10:20:00',
    status: 'enabled'
  },
  {
    id: '3',
    username: 'test',
    phone: '13700137000',
    email: 'test@example.com',
    name: '测试账号',
    idCard: '110101199001011236',
    registerTime: '2024-01-03 12:00:00',
    lastLoginTime: '2024-06-10 09:15:00',
    status: 'disabled'
  },
  {
    id: '4',
    username: 'manager',
    phone: '13600136000',
    email: 'manager@example.com',
    name: '管理员',
    idCard: '110101199001011237',
    registerTime: '2024-01-04 13:00:00',
    lastLoginTime: '2024-06-13 16:45:00',
    status: 'enabled'
  },
  {
    id: '5',
    username: 'staff',
    phone: '13500135000',
    email: 'staff@example.com',
    name: '员工',
    idCard: '110101199001011238',
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
 * 获取平台账号列表
 * @param params 查询参数
 */
export const getPlatformAccountList = async (params: PlatformAccountQueryParams) => {
  await delay(300)
  
  let filteredAccounts = [...mockPlatformAccounts]
  
  // 筛选状态
  if (params.status) {
    filteredAccounts = filteredAccounts.filter(account => account.status === params.status)
  }
  
  // 关键词搜索
  if (params.keyword) {
    const keyword = params.keyword.toLowerCase()
    filteredAccounts = filteredAccounts.filter(account => 
      account.username.toLowerCase().includes(keyword) ||
      account.name?.toLowerCase().includes(keyword) ||
      account.phone.includes(keyword)
    )
  }
  
  // 分页
  const start = (params.page - 1) * params.pageSize
  const end = start + params.pageSize
  const paginatedAccounts = filteredAccounts.slice(start, end)
  
  return {
    list: paginatedAccounts,
    total: filteredAccounts.length,
    page: params.page,
    pageSize: params.pageSize
  }
}

/**
 * 获取平台账号详情
 * @param id 账号ID
 */
export const getPlatformAccountDetail = async (id: string) => {
  await delay(200)
  const account = mockPlatformAccounts.find(a => a.id === id)
  if (!account) {
    throw new Error('账号不存在')
  }
  return account
}

/**
 * 创建平台账号
 * @param data 账号表单数据
 */
export const createPlatformAccount = async (data: PlatformAccountFormData) => {
  await delay(300)
  const newAccount: PlatformAccount = {
    id: (mockPlatformAccounts.length + 1).toString(),
    ...data,
    registerTime: new Date().toISOString(),
    status: 'enabled'
  }
  mockPlatformAccounts.push(newAccount)
  return newAccount
}

/**
 * 更新平台账号
 * @param id 账号ID
 * @param data 账号表单数据
 */
export const updatePlatformAccount = async (id: string, data: PlatformAccountFormData) => {
  await delay(300)
  const index = mockPlatformAccounts.findIndex(a => a.id === id)
  if (index === -1) {
    throw new Error('账号不存在')
  }
  mockPlatformAccounts[index] = {
    ...mockPlatformAccounts[index],
    ...data
  }
  return mockPlatformAccounts[index]
}

/**
 * 删除平台账号
 * @param id 账号ID
 */
export const deletePlatformAccount = async (id: string) => {
  await delay(200)
  const index = mockPlatformAccounts.findIndex(a => a.id === id)
  if (index === -1) {
    throw new Error('账号不存在')
  }
  mockPlatformAccounts.splice(index, 1)
}

/**
 * 批量删除平台账号
 * @param ids 账号ID数组
 */
export const batchDeletePlatformAccounts = async (ids: string[]) => {
  await delay(300)
  for (const id of ids) {
    const index = mockPlatformAccounts.findIndex(a => a.id === id)
    if (index !== -1) {
      mockPlatformAccounts.splice(index, 1)
    }
  }
}

/**
 * 启用平台账号
 * @param id 账号ID
 */
export const enablePlatformAccount = async (id: string) => {
  await delay(200)
  const account = mockPlatformAccounts.find(a => a.id === id)
  if (!account) {
    throw new Error('账号不存在')
  }
  account.status = 'enabled'
  return account
}

/**
 * 禁用平台账号
 * @param id 账号ID
 */
export const disablePlatformAccount = async (id: string) => {
  await delay(200)
  const account = mockPlatformAccounts.find(a => a.id === id)
  if (!account) {
    throw new Error('账号不存在')
  }
  account.status = 'disabled'
  return account
}

/**
 * 重置平台账号密码
 * @param id 账号ID
 */
export const resetPlatformAccountPassword = async (id: string) => {
  await delay(200)
  const account = mockPlatformAccounts.find(a => a.id === id)
  if (!account) {
    throw new Error('账号不存在')
  }
  return { newPassword: '123456' }
}

/**
 * 批量启用平台账号
 * @param ids 账号ID数组
 */
export const batchEnablePlatformAccounts = async (ids: string[]) => {
  await delay(300)
  for (const id of ids) {
    const account = mockPlatformAccounts.find(a => a.id === id)
    if (account) {
      account.status = 'enabled'
    }
  }
}

/**
 * 批量禁用平台账号
 * @param ids 账号ID数组
 */
export const batchDisablePlatformAccounts = async (ids: string[]) => {
  await delay(300)
  for (const id of ids) {
    const account = mockPlatformAccounts.find(a => a.id === id)
    if (account) {
      account.status = 'disabled'
    }
  }
}

/**
 * 检查用户名是否重复
 * @param username 用户名
 * @param id 账号ID(编辑时传入)
 */
export const checkPlatformAccountUsername = async (username: string, id?: string) => {
  await delay(100)
  const existingAccount = mockPlatformAccounts.find(a => a.username === username && a.id !== id)
  return !existingAccount
}

/**
 * 检查手机号是否重复
 * @param phone 手机号
 * @param id 账号ID(编辑时传入)
 */
export const checkPlatformAccountPhone = async (phone: string, id?: string) => {
  await delay(100)
  const existingAccount = mockPlatformAccounts.find(a => a.phone === phone && a.id !== id)
  return !existingAccount
}
