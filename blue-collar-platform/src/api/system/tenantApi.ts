import type { Tenant, TenantQueryParams, TenantFormData, TenantDetail } from '@/types/system/tenantTypes'

// Mock数据
const mockTenants: Tenant[] = [
  {
    id: '1',
    tenantName: '南通富民劳务服务有限公司',
    creditCode: '91320600MA1X123456',
    businessLicense: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=business%20license%20document%20with%20Chinese%20text%2C%20official%20seal%2C%20company%20information%2C%20clean%20white%20background%2C%20professional%20document&image_size=landscape_4_3',
    adminName: '张三',
    adminPhone: '13800138001',
    contactName: '张经理',
    contactPhone: '13800138001',
    packageId: '2',
    packageName: '高级版',
    tenantType: 'labor_company',
    status: 'enabled',
    createdAt: '2025-01-01 10:00:00',
    updatedAt: '2025-01-02 14:30:00',
    createdBy: '管理员',
    updatedBy: '赵管理员'
  },
  {
    id: '2',
    tenantName: '三鼎劳务有限公司',
    creditCode: '91310000MA2X234567',
    businessLicense: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Chinese%20business%20license%20certificate%2C%20red%20seal%2C%20company%20details%2C%20official%20document%2C%20clear%20print%2C%20white%20background&image_size=landscape_4_3',
    adminName: '李四',
    adminPhone: '13800138002',
    contactName: '李经理',
    contactPhone: '13800138002',
    packageId: '3',
    packageName: '企业版',
    tenantType: 'labor_company',
    status: 'enabled',
    createdAt: '2025-03-15 09:00:00',
    updatedAt: '2025-03-16 11:00:00',
    createdBy: '管理员',
    updatedBy: '赵管理员'
  },
  {
    id: '3',
    tenantName: '富士康科技集团',
    creditCode: '91440300MA3X345678',
    businessLicense: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=corporate%20business%20license%20in%20China%2C%20official%20document%20with%20company%20seal%2C%20detailed%20information%2C%20professional%20appearance%2C%20white%20background&image_size=landscape_4_3',
    adminName: '王五',
    adminPhone: '13800138003',
    contactName: '王经理',
    contactPhone: '13800138003',
    packageId: '3',
    packageName: '企业版',
    tenantType: 'factory',
    status: 'enabled',
    createdAt: '2025-02-01 10:00:00',
    updatedAt: '2025-02-02 14:00:00',
    createdBy: '管理员',
    updatedBy: '赵管理员'
  }
]

const mockPackageOptions = [
  { value: '1', label: '基础版' },
  { value: '2', label: '高级版' },
  { value: '3', label: '企业版' }
]

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

/**
 * 获取租户列表
 * @param params 查询参数
 */
export const getTenantList = async (params: TenantQueryParams) => {
  await delay(300)
  let filteredData = [...mockTenants]
  
  if (params.keyword) {
    filteredData = filteredData.filter(item => 
      item.tenantName.includes(params.keyword) ||
      item.creditCode.includes(params.keyword) ||
      item.contactPhone.includes(params.keyword)
    )
  }
  
  if (params.status) {
    filteredData = filteredData.filter(item => item.status === params.status)
  }
  
  if (params.packageId) {
    filteredData = filteredData.filter(item => item.packageId === params.packageId)
  }
  
  if (params.tenantType) {
    filteredData = filteredData.filter(item => item.tenantType === params.tenantType)
  }
  
  const start = (params.page - 1) * params.pageSize
  const end = start + params.pageSize
  const list = filteredData.slice(start, end)
  
  return {
    code: 200,
    message: 'success',
    data: {
      list,
      total: filteredData.length,
      page: params.page,
      pageSize: params.pageSize
    },
    timestamp: Date.now()
  }
}

/**
 * 获取租户详情
 * @param id 租户ID
 */
export const getTenantDetail = async (id: string) => {
  await delay(200)
  const item = mockTenants.find(i => i.id === id)
  if (!item) {
    return {
      code: 404,
      message: '租户不存在',
      data: null,
      timestamp: Date.now()
    }
  }
  return {
    code: 200,
    message: 'success',
    data: item,
    timestamp: Date.now()
  } as { code: number; message: string; data: TenantDetail; timestamp: number }
}

/**
 * 创建租户
 * @param data 租户表单数据
 */
export const createTenant = async (data: TenantFormData) => {
  await delay(300)
  const newTenant: Tenant = {
    id: String(mockTenants.length + 1),
    ...data,
    createdAt: new Date().toISOString().replace('T', ' ').slice(0, 19),
    updatedAt: new Date().toISOString().replace('T', ' ').slice(0, 19),
    createdBy: '管理员',
    updatedBy: '管理员'
  }
  mockTenants.push(newTenant)
  return {
    code: 201,
    message: 'created',
    data: newTenant,
    timestamp: Date.now()
  } as { code: number; message: string; data: Tenant; timestamp: number }
}

/**
 * 更新租户
 * @param id 租户ID
 * @param data 租户表单数据
 */
export const updateTenant = async (id: string, data: TenantFormData) => {
  await delay(300)
  const index = mockTenants.findIndex(i => i.id === id)
  if (index === -1) {
    return {
      code: 404,
      message: '租户不存在',
      data: null,
      timestamp: Date.now()
    }
  }
  const updatedTenant: Tenant = {
    ...mockTenants[index],
    ...data,
    updatedAt: new Date().toISOString().replace('T', ' ').slice(0, 19),
    updatedBy: '管理员'
  }
  mockTenants[index] = updatedTenant
  return {
    code: 200,
    message: 'success',
    data: updatedTenant,
    timestamp: Date.now()
  } as { code: number; message: string; data: Tenant; timestamp: number }
}

/**
 * 删除租户
 * @param id 租户ID
 */
export const deleteTenant = async (id: string) => {
  await delay(300)
  const index = mockTenants.findIndex(i => i.id === id)
  if (index === -1) {
    return {
      code: 404,
      message: '租户不存在',
      data: null,
      timestamp: Date.now()
    }
  }
  mockTenants.splice(index, 1)
  return {
    code: 200,
    message: 'success',
    data: null,
    timestamp: Date.now()
  }
}

/**
 * 批量删除租户
 * @param ids 租户ID数组
 */
export const batchDeleteTenants = async (ids: string[]) => {
  await delay(300)
  // 从数组中删除指定ID的租户
  for (let i = mockTenants.length - 1; i >= 0; i--) {
    if (ids.includes(mockTenants[i].id)) {
      mockTenants.splice(i, 1)
    }
  }
  return {
    code: 200,
    message: 'success',
    data: null,
    timestamp: Date.now()
  }
}

/**
 * 导出租户列表
 * @param params 查询参数
 */
export const exportTenants = async (params: TenantQueryParams) => {
  await delay(500)
  return new Blob(['Mock Excel Data'], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
}

/**
 * 启用租户
 * @param id 租户ID
 */
export const enableTenant = async (id: string) => {
  await delay(300)
  const index = mockTenants.findIndex(i => i.id === id)
  if (index === -1) {
    return {
      code: 404,
      message: '租户不存在',
      data: null,
      timestamp: Date.now()
    }
  }
  mockTenants[index].status = 'enabled'
  mockTenants[index].updatedAt = new Date().toISOString().replace('T', ' ').slice(0, 19)
  mockTenants[index].updatedBy = '管理员'
  return {
    code: 200,
    message: 'success',
    data: mockTenants[index],
    timestamp: Date.now()
  } as { code: number; message: string; data: Tenant; timestamp: number }
}

/**
 * 禁用租户
 * @param id 租户ID
 */
export const disableTenant = async (id: string) => {
  await delay(300)
  const index = mockTenants.findIndex(i => i.id === id)
  if (index === -1) {
    return {
      code: 404,
      message: '租户不存在',
      data: null,
      timestamp: Date.now()
    }
  }
  mockTenants[index].status = 'disabled'
  mockTenants[index].updatedAt = new Date().toISOString().replace('T', ' ').slice(0, 19)
  mockTenants[index].updatedBy = '管理员'
  return {
    code: 200,
    message: 'success',
    data: mockTenants[index],
    timestamp: Date.now()
  } as { code: number; message: string; data: Tenant; timestamp: number }
}

/**
 * 检查租户名称是否重复
 * @param tenantName 租户名称
 * @param id 租户ID(编辑时传入)
 */
export const checkTenantName = async (tenantName: string, id?: string) => {
  await delay(200)
  const existingTenant = mockTenants.find(t => t.tenantName === tenantName && t.id !== id)
  return {
    code: 200,
    message: 'success',
    data: !existingTenant,
    timestamp: Date.now()
  } as { code: number; message: string; data: boolean; timestamp: number }
}

/**
 * 检查统一社会信用代码是否重复
 * @param creditCode 统一社会信用代码
 * @param id 租户ID(编辑时传入)
 */
export const checkCreditCode = async (creditCode: string, id?: string) => {
  await delay(200)
  const existingTenant = mockTenants.find(t => t.creditCode === creditCode && t.id !== id)
  return {
    code: 200,
    message: 'success',
    data: !existingTenant,
    timestamp: Date.now()
  } as { code: number; message: string; data: boolean; timestamp: number }
}

/**
 * 获取套餐下拉选项
 */
export const getPackageOptions = async () => {
  await delay(200)
  return {
    code: 200,
    message: 'success',
    data: mockPackageOptions,
    timestamp: Date.now()
  }
}
