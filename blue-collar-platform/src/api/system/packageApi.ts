import type { Package, PackageQueryParams, PackageFormData, PackageDetail } from '@/types/system/packageTypes'

// Mock数据
let mockPackages: Package[] = [
  {
    id: '1',
    packageName: '基础版',
    packageDescription: '适合小型租户的基础套餐,包含核心功能。',
    tenantType: 'labor_company' as any,
    amount: 1999,
    expiryFrequency: 'monthly' as any,
    employeeAccountCount: 10,
    backgroundCheckWorkerCount: 500,
    status: 'enabled' as any,
    createdAt: '2026-01-01 10:00:00',
    updatedAt: '2026-01-01 10:00:00',
    createdBy: 'admin',
    updatedBy: 'admin',
    menuIds: [1, 2, 3, 4]
  },
  {
    id: '2',
    packageName: '高级版',
    packageDescription: '适合中型租户的高级套餐,功能更全面。',
    tenantType: 'labor_company' as any,
    amount: 3999,
    expiryFrequency: 'monthly' as any,
    employeeAccountCount: 30,
    backgroundCheckWorkerCount: 2000,
    status: 'enabled' as any,
    createdAt: '2026-01-01 10:00:00',
    updatedAt: '2026-01-01 10:00:00',
    createdBy: 'admin',
    updatedBy: 'admin',
    menuIds: [1, 2, 3, 4, 5, 6, 7]
  },
  {
    id: '3',
    packageName: '企业版',
    packageDescription: '适合大型租户的企业套餐,支持定制化服务。',
    tenantType: 'labor_company' as any,
    amount: 7999,
    expiryFrequency: 'monthly' as any,
    employeeAccountCount: 100,
    backgroundCheckWorkerCount: 10000,
    status: 'enabled' as any,
    createdAt: '2026-01-01 10:00:00',
    updatedAt: '2026-01-01 10:00:00',
    createdBy: 'admin',
    updatedBy: 'admin',
    menuIds: [1, 2, 3, 4, 5, 6, 7]
  },
  {
    id: '4',
    packageName: '工厂基础版',
    packageDescription: '适合小型工厂的基础套餐。',
    tenantType: 'factory' as any,
    amount: 2999,
    expiryFrequency: 'monthly' as any,
    employeeAccountCount: 5,
    backgroundCheckWorkerCount: 200,
    status: 'enabled' as any,
    createdAt: '2026-01-01 10:00:00',
    updatedAt: '2026-01-01 10:00:00',
    createdBy: 'admin',
    updatedBy: 'admin',
    menuIds: [1, 2, 3, 4]
  },
  {
    id: '5',
    packageName: '工厂高级版',
    packageDescription: '适合中型工厂的高级套餐。',
    tenantType: 'factory' as any,
    amount: 5999,
    expiryFrequency: 'monthly' as any,
    employeeAccountCount: 20,
    backgroundCheckWorkerCount: 1000,
    status: 'disabled' as any,
    createdAt: '2026-01-01 10:00:00',
    updatedAt: '2026-01-01 10:00:00',
    createdBy: 'admin',
    updatedBy: 'admin',
    menuIds: [1, 2, 3, 4, 5, 6, 7]
  }
]

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

/**
 * 获取套餐列表
 * @param params 查询参数
 */
export const getPackageList = async (params: PackageQueryParams) => {
  await delay(300)
  let filteredData = [...mockPackages]
  
  if (params.packageName) {
    filteredData = filteredData.filter(item => item.packageName.includes(params.packageName))
  }
  
  if (params.status) {
    filteredData = filteredData.filter(item => item.status === params.status)
  }
  
  if (params.tenantType) {
    filteredData = filteredData.filter(item => item.tenantType === params.tenantType)
  }
  
  const start = (params.page - 1) * params.pageSize
  const end = start + params.pageSize
  const list = filteredData.slice(start, end)
  
  return {
    list,
    total: filteredData.length,
    page: params.page,
    pageSize: params.pageSize
  }
}

/**
 * 获取套餐详情
 * @param id 套餐ID
 */
export const getPackageDetail = async (id: string) => {
  await delay(200)
  const item = mockPackages.find(i => i.id === id)
  if (!item) {
    throw new Error('套餐不存在')
  }
  return item as PackageDetail
}

/**
 * 创建套餐
 * @param data 套餐表单数据
 */
export const createPackage = async (data: PackageFormData) => {
  await delay(300)
  const newPackage: Package = {
    id: String(mockPackages.length + 1),
    ...data,
    status: 'enabled' as any,
    createdAt: new Date().toISOString().replace('T', ' ').slice(0, 19),
    updatedAt: new Date().toISOString().replace('T', ' ').slice(0, 19),
    createdBy: 'admin',
    updatedBy: 'admin',
    menuIds: data.menuIds || []
  }
  mockPackages.push(newPackage)
  return newPackage
}

/**
 * 更新套餐
 * @param id 套餐ID
 * @param data 套餐表单数据
 */
export const updatePackage = async (id: string, data: PackageFormData) => {
  await delay(300)
  const index = mockPackages.findIndex(i => i.id === id)
  if (index === -1) {
    throw new Error('套餐不存在')
  }
  const updatedPackage: Package = {
    ...mockPackages[index],
    ...data,
    updatedAt: new Date().toISOString().replace('T', ' ').slice(0, 19),
    updatedBy: 'admin',
    menuIds: data.menuIds || []
  }
  mockPackages[index] = updatedPackage
  return updatedPackage
}

/**
 * 删除套餐
 * @param id 套餐ID
 */
export const deletePackage = async (id: string) => {
  await delay(300)
  const index = mockPackages.findIndex(i => i.id === id)
  if (index === -1) {
    throw new Error('套餐不存在')
  }
  mockPackages.splice(index, 1)
  return { success: true }
}

/**
 * 批量删除套餐
 * @param ids 套餐ID数组
 */
export const batchDeletePackages = async (ids: string[]) => {
  await delay(300)
  mockPackages = mockPackages.filter(p => !ids.includes(p.id))
  return { success: true }
}

/**
 * 导出套餐列表
 * @param params 查询参数
 */
export const exportPackages = async (params: PackageQueryParams) => {
  await delay(500)
  return new Blob(['Mock Excel Data'], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
}

/**
 * 启用套餐
 * @param id 套餐ID
 */
export const enablePackage = async (id: string) => {
  await delay(300)
  const index = mockPackages.findIndex(i => i.id === id)
  if (index === -1) {
    throw new Error('套餐不存在')
  }
  mockPackages[index].status = 'enabled'
  return mockPackages[index]
}

/**
 * 禁用套餐
 * @param id 套餐ID
 */
export const disablePackage = async (id: string) => {
  await delay(300)
  const index = mockPackages.findIndex(i => i.id === id)
  if (index === -1) {
    throw new Error('套餐不存在')
  }
  mockPackages[index].status = 'disabled'
  return mockPackages[index]
}

/**
 * 检查套餐名称是否重复
 * @param packageName 套餐名称
 * @param id 套餐ID(编辑时传入)
 */
export const checkPackageName = async (packageName: string, id?: string) => {
  await delay(200)
  const existingPackage = mockPackages.find(p => p.packageName === packageName && p.id !== id)
  return !existingPackage
}
