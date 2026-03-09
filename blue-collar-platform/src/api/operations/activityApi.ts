/**
 * 活动管理模块API接口
 */
import type {
  ApiResponse,
  PageResponse,
} from '@/types/response'
import type {
  ActivityInfo,
  ActivityFormData,
  ActivityQueryParams,
  RegistrationInfo,
  RegistrationQueryParams,
  AuditParams,
} from '@/types/operations/activity'

// 模拟延迟
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

// Mock数据
const mockActivities: ActivityInfo[] = [
  {
    id: 1,
    title: '春季运动会',
    description: '公司春季运动会，欢迎大家参加',
    startTime: '2024-04-01 09:00:00',
    endTime: '2024-04-01 17:00:00',
    location: '公司体育场',
    organizer: '行政部',
    status: 'UPCOMING',
    maxParticipants: 100,
    currentParticipants: 50,
    coverImage: '',
    content: '<p>运动会详情</p>',
    createTime: '2024-03-01 10:00:00',
    updateTime: '2024-03-01 10:00:00'
  },
  {
    id: 2,
    title: '员工生日会',
    description: '3月份员工生日会',
    startTime: '2024-03-31 16:00:00',
    endTime: '2024-03-31 18:00:00',
    location: '公司会议室',
    organizer: '人力资源部',
    status: 'UPCOMING',
    maxParticipants: 50,
    currentParticipants: 20,
    coverImage: '',
    content: '<p>生日会详情</p>',
    createTime: '2024-03-15 10:00:00',
    updateTime: '2024-03-15 10:00:00'
  }
]

const mockRegistrations: RegistrationInfo[] = [
  {
    id: 1,
    activityId: 1,
    activityTitle: '春季运动会',
    workerId: 'W001',
    workerName: '张三',
    workerPhone: '13800138001',
    status: 'PENDING',
    registrationTime: '2024-03-10 10:00:00',
    auditTime: null,
    auditComment: null,
    auditor: null
  },
  {
    id: 2,
    activityId: 1,
    activityTitle: '春季运动会',
    workerId: 'W002',
    workerName: '李四',
    workerPhone: '13800138002',
    status: 'APPROVED',
    registrationTime: '2024-03-11 10:00:00',
    auditTime: '2024-03-12 10:00:00',
    auditComment: '审核通过',
    auditor: '管理员'
  }
]

/**
 * 活动管理API
 */
export const activityApi = {
  /**
   * 获取活动列表
   */
  getActivityList: async (params: ActivityQueryParams): Promise<ApiResponse<PageResponse<ActivityInfo>>> => {
    await delay(500)
    let filteredActivities = [...mockActivities]
    
    if (params.keyword) {
      const keyword = params.keyword.toLowerCase()
      filteredActivities = filteredActivities.filter(activity => 
        activity.title.toLowerCase().includes(keyword) ||
        activity.description.toLowerCase().includes(keyword)
      )
    }
    
    if (params.status) {
      filteredActivities = filteredActivities.filter(activity => activity.status === params.status)
    }
    
    const page = params.page || 1
    const pageSize = params.pageSize || 10
    const start = (page - 1) * pageSize
    const end = start + pageSize
    
    return {
      code: 200,
      message: '成功',
      data: {
        list: filteredActivities.slice(start, end),
        total: filteredActivities.length,
        page,
        pageSize
      },
      timestamp: Date.now()
    }
  },

  /**
   * 获取活动详情
   */
  getActivityDetail: async (id: number): Promise<ApiResponse<ActivityInfo>> => {
    await delay(300)
    const activity = mockActivities.find(a => a.id === id)
    if (!activity) {
      return {
        code: 404,
        message: '活动不存在',
        data: null,
        timestamp: Date.now()
      }
    }
    return {
      code: 200,
      message: '成功',
      data: activity,
      timestamp: Date.now()
    }
  },

  /**
   * 创建活动
   */
  createActivity: async (data: ActivityFormData): Promise<ApiResponse<ActivityInfo>> => {
    await delay(500)
    const newActivity: ActivityInfo = {
      id: mockActivities.length + 1,
      title: data.title,
      description: data.description,
      startTime: data.startTime,
      endTime: data.endTime,
      location: data.location,
      organizer: data.organizer,
      status: 'UPCOMING',
      maxParticipants: data.maxParticipants,
      currentParticipants: 0,
      coverImage: data.coverImage || '',
      content: data.content,
      createTime: new Date().toISOString(),
      updateTime: new Date().toISOString()
    }
    mockActivities.push(newActivity)
    return {
      code: 200,
      message: '成功',
      data: newActivity,
      timestamp: Date.now()
    }
  },

  /**
   * 更新活动
   */
  updateActivity: async (id: number, data: ActivityFormData): Promise<ApiResponse<ActivityInfo>> => {
    await delay(500)
    const index = mockActivities.findIndex(a => a.id === id)
    if (index === -1) {
      return {
        code: 404,
        message: '活动不存在',
        data: null,
        timestamp: Date.now()
      }
    }
    mockActivities[index] = {
      ...mockActivities[index],
      ...data,
      updateTime: new Date().toISOString()
    }
    return {
      code: 200,
      message: '成功',
      data: mockActivities[index],
      timestamp: Date.now()
    }
  },

  /**
   * 删除活动
   */
  deleteActivity: async (id: number): Promise<ApiResponse<void>> => {
    await delay(300)
    const index = mockActivities.findIndex(a => a.id === id)
    if (index === -1) {
      return {
        code: 404,
        message: '活动不存在',
        data: null,
        timestamp: Date.now()
      }
    }
    mockActivities.splice(index, 1)
    return {
      code: 200,
      message: '成功',
      data: null,
      timestamp: Date.now()
    }
  },

  /**
   * 提前开始活动
   */
  startActivityEarly: async (id: number): Promise<ApiResponse<void>> => {
    await delay(300)
    const index = mockActivities.findIndex(a => a.id === id)
    if (index === -1) {
      return {
        code: 404,
        message: '活动不存在',
        data: null,
        timestamp: Date.now()
      }
    }
    mockActivities[index].status = 'ONGOING'
    mockActivities[index].updateTime = new Date().toISOString()
    return {
      code: 200,
      message: '成功',
      data: null,
      timestamp: Date.now()
    }
  },

  /**
   * 提前结束活动
   */
  endActivityEarly: async (id: number): Promise<ApiResponse<void>> => {
    await delay(300)
    const index = mockActivities.findIndex(a => a.id === id)
    if (index === -1) {
      return {
        code: 404,
        message: '活动不存在',
        data: null,
        timestamp: Date.now()
      }
    }
    mockActivities[index].status = 'ENDED'
    mockActivities[index].updateTime = new Date().toISOString()
    return {
      code: 200,
      message: '成功',
      data: null,
      timestamp: Date.now()
    }
  },
}

/**
 * 报名管理API
 */
export const registrationApi = {
  /**
   * 获取报名记录列表
   */
  getRegistrationList: async (params: RegistrationQueryParams): Promise<ApiResponse<PageResponse<RegistrationInfo>>> => {
    await delay(500)
    let filteredRegistrations = [...mockRegistrations]
    
    if (params.activityId) {
      filteredRegistrations = filteredRegistrations.filter(r => r.activityId === params.activityId)
    }
    
    if (params.status) {
      filteredRegistrations = filteredRegistrations.filter(r => r.status === params.status)
    }
    
    if (params.keyword) {
      const keyword = params.keyword.toLowerCase()
      filteredRegistrations = filteredRegistrations.filter(r => 
        r.workerName.toLowerCase().includes(keyword) ||
        r.workerPhone.includes(keyword)
      )
    }
    
    const page = params.page || 1
    const pageSize = params.pageSize || 10
    const start = (page - 1) * pageSize
    const end = start + pageSize
    
    return {
      code: 200,
      message: '成功',
      data: {
        list: filteredRegistrations.slice(start, end),
        total: filteredRegistrations.length,
        page,
        pageSize
      },
      timestamp: Date.now()
    }
  },

  /**
   * 获取报名记录详情
   */
  getRegistrationDetail: async (id: number): Promise<ApiResponse<RegistrationInfo>> => {
    await delay(300)
    const registration = mockRegistrations.find(r => r.id === id)
    if (!registration) {
      return {
        code: 404,
        message: '报名记录不存在',
        data: null,
        timestamp: Date.now()
      }
    }
    return {
      code: 200,
      message: '成功',
      data: registration,
      timestamp: Date.now()
    }
  },

  /**
   * 审核报名记录
   */
  auditRegistration: async (data: AuditParams): Promise<ApiResponse<void>> => {
    await delay(300)
    const registration = mockRegistrations.find(r => r.id === data.id)
    if (!registration) {
      return {
        code: 404,
        message: '报名记录不存在',
        data: null,
        timestamp: Date.now()
      }
    }
    registration.status = data.status
    registration.auditTime = new Date().toISOString()
    registration.auditComment = data.comment
    registration.auditor = '管理员'
    return {
      code: 200,
      message: '成功',
      data: null,
      timestamp: Date.now()
    }
  },

  /**
   * 批量审核通过
   */
  batchApproveRegistration: async (ids: number[]): Promise<ApiResponse<void>> => {
    await delay(500)
    for (const id of ids) {
      const registration = mockRegistrations.find(r => r.id === id)
      if (registration) {
        registration.status = 'APPROVED'
        registration.auditTime = new Date().toISOString()
        registration.auditComment = '批量审核通过'
        registration.auditor = '管理员'
      }
    }
    return {
      code: 200,
      message: '成功',
      data: null,
      timestamp: Date.now()
    }
  },

  /**
   * 批量审核不通过
   */
  batchRejectRegistration: async (ids: number[], comment: string): Promise<ApiResponse<void>> => {
    await delay(500)
    for (const id of ids) {
      const registration = mockRegistrations.find(r => r.id === id)
      if (registration) {
        registration.status = 'REJECTED'
        registration.auditTime = new Date().toISOString()
        registration.auditComment = comment
        registration.auditor = '管理员'
      }
    }
    return {
      code: 200,
      message: '成功',
      data: null,
      timestamp: Date.now()
    }
  },
}
