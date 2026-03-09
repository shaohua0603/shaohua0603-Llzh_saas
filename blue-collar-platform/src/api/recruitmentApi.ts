import type {
  Recruitment,
  RecruitmentDetail,
  RecruitmentQueryParams,
  RecruitmentFormData,
  Resume,
  ResumeDetail,
  ResumeQueryParams,
  ResumeFormData
} from '@/types/recruitmentTypes'
import type { PageResponse } from '@/types/response'

// Mock数据
const mockRecruitments: Recruitment[] = [
  {
    id: '1',
    title: '电子厂普工',
    position: '普工',
    factory: '富士康科技',
    laborCompany: '蓝天劳务',
    recruitmentCount: 50,
    recruitedCount: 20,
    status: 'PUBLISHED',
    publishTime: '2024-01-01 10:00:00',
    createTime: '2024-01-01 09:00:00',
    creator: '张三'
  },
  {
    id: '2',
    title: '服装厂缝纫工',
    position: '缝纫工',
    factory: '雅戈尔集团',
    laborCompany: '白云劳务',
    recruitmentCount: 30,
    recruitedCount: 15,
    status: 'PUBLISHED',
    publishTime: '2024-01-02 10:00:00',
    createTime: '2024-01-02 09:00:00',
    creator: '李四'
  },
  {
    id: '3',
    title: '汽车厂装配工',
    position: '装配工',
    factory: '上海大众',
    laborCompany: '大地劳务',
    recruitmentCount: 40,
    recruitedCount: 10,
    status: 'PAUSED',
    publishTime: '2024-01-03 10:00:00',
    createTime: '2024-01-03 09:00:00',
    creator: '王五'
  }
]

const mockResumes: Resume[] = [
  {
    id: '1',
    name: '赵六',
    gender: '男',
    age: 25,
    phone: '13800138001',
    education: '高中',
    workExperience: '3年',
    status: 'PENDING',
    createTime: '2024-01-01 10:00:00',
    recruitmentId: '1',
    recruitmentTitle: '电子厂普工'
  },
  {
    id: '2',
    name: '孙七',
    gender: '女',
    age: 23,
    phone: '13800138002',
    education: '中专',
    workExperience: '2年',
    status: 'APPROVED',
    createTime: '2024-01-02 10:00:00',
    recruitmentId: '1',
    recruitmentTitle: '电子厂普工'
  },
  {
    id: '3',
    name: '周八',
    gender: '男',
    age: 28,
    phone: '13800138003',
    education: '初中',
    workExperience: '5年',
    status: 'REJECTED',
    createTime: '2024-01-03 10:00:00',
    recruitmentId: '2',
    recruitmentTitle: '服装厂缝纫工'
  }
]

const mockFactoryOptions = [
  { label: '富士康科技', value: '1' },
  { label: '雅戈尔集团', value: '2' },
  { label: '上海大众', value: '3' }
]

const mockLaborCompanyOptions = [
  { label: '蓝天劳务', value: '1' },
  { label: '白云劳务', value: '2' },
  { label: '大地劳务', value: '3' }
]

const mockPositionOptions = [
  { label: '普工', value: '1' },
  { label: '缝纫工', value: '2' },
  { label: '装配工', value: '3' }
]

// 模拟延迟
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

/**
 * 获取招聘需求列表
 * @param params 查询参数
 */
export const getRecruitmentList = async (params: RecruitmentQueryParams) => {
  await delay(500)
  return {
    code: 200,
    message: '成功',
    data: {
      list: mockRecruitments,
      total: mockRecruitments.length,
      page: params.page || 1,
      pageSize: params.pageSize || 10
    },
    timestamp: Date.now()
  }
}

/**
 * 获取招聘需求详情
 * @param id 招聘需求ID
 */
export const getRecruitmentDetail = async (id: string) => {
  await delay(300)
  const recruitment = mockRecruitments.find(item => item.id === id)
  return {
    code: 200,
    message: '成功',
    data: recruitment,
    timestamp: Date.now()
  }
}

/**
 * 创建招聘需求
 * @param data 招聘需求数据
 */
export const createRecruitment = async (data: RecruitmentFormData) => {
  await delay(500)
  const newRecruitment: Recruitment = {
    id: (mockRecruitments.length + 1).toString(),
    title: data.title,
    position: data.position,
    factory: data.factory,
    laborCompany: data.laborCompany,
    recruitmentCount: data.recruitmentCount,
    recruitedCount: 0,
    status: 'DRAFT',
    publishTime: null,
    createTime: new Date().toISOString(),
    creator: '当前用户'
  }
  mockRecruitments.push(newRecruitment)
  return {
    code: 200,
    message: '成功',
    data: newRecruitment,
    timestamp: Date.now()
  }
}

/**
 * 更新招聘需求
 * @param id 招聘需求ID
 * @param data 招聘需求数据
 */
export const updateRecruitment = async (id: string, data: RecruitmentFormData) => {
  await delay(500)
  const index = mockRecruitments.findIndex(item => item.id === id)
  if (index !== -1) {
    mockRecruitments[index] = {
      ...mockRecruitments[index],
      title: data.title,
      position: data.position,
      factory: data.factory,
      laborCompany: data.laborCompany,
      recruitmentCount: data.recruitmentCount
    }
    return {
      code: 200,
      message: '成功',
      data: mockRecruitments[index],
      timestamp: Date.now()
    }
  }
  return {
    code: 404,
    message: '招聘需求不存在',
    data: null,
    timestamp: Date.now()
  }
}

/**
 * 删除招聘需求
 * @param id 招聘需求ID
 */
export const deleteRecruitment = async (id: string) => {
  await delay(300)
  const index = mockRecruitments.findIndex(item => item.id === id)
  if (index !== -1) {
    mockRecruitments.splice(index, 1)
    return {
      code: 200,
      message: '成功',
      data: null,
      timestamp: Date.now()
    }
  }
  return {
    code: 404,
    message: '招聘需求不存在',
    data: null,
    timestamp: Date.now()
  }
}

/**
 * 批量删除招聘需求
 * @param ids 招聘需求ID数组
 */
export const batchDeleteRecruitments = async (ids: string[]) => {
  await delay(500)
  for (const id of ids) {
    const index = mockRecruitments.findIndex(item => item.id === id)
    if (index !== -1) {
      mockRecruitments.splice(index, 1)
    }
  }
  return {
    code: 200,
    message: '成功',
    data: null,
    timestamp: Date.now()
  }
}

/**
 * 发布招聘需求
 * @param id 招聘需求ID
 */
export const publishRecruitment = async (id: string) => {
  await delay(300)
  const index = mockRecruitments.findIndex(item => item.id === id)
  if (index !== -1) {
    mockRecruitments[index].status = 'PUBLISHED'
    mockRecruitments[index].publishTime = new Date().toISOString()
    return {
      code: 200,
      message: '成功',
      data: mockRecruitments[index],
      timestamp: Date.now()
    }
  }
  return {
    code: 404,
    message: '招聘需求不存在',
    data: null,
    timestamp: Date.now()
  }
}

/**
 * 暂停招聘需求
 * @param id 招聘需求ID
 */
export const pauseRecruitment = async (id: string) => {
  await delay(300)
  const index = mockRecruitments.findIndex(item => item.id === id)
  if (index !== -1) {
    mockRecruitments[index].status = 'PAUSED'
    return {
      code: 200,
      message: '成功',
      data: mockRecruitments[index],
      timestamp: Date.now()
    }
  }
  return {
    code: 404,
    message: '招聘需求不存在',
    data: null,
    timestamp: Date.now()
  }
}

/**
 * 恢复招聘需求
 * @param id 招聘需求ID
 */
export const resumeRecruitment = async (id: string) => {
  await delay(300)
  const index = mockRecruitments.findIndex(item => item.id === id)
  if (index !== -1) {
    mockRecruitments[index].status = 'PUBLISHED'
    return {
      code: 200,
      message: '成功',
      data: mockRecruitments[index],
      timestamp: Date.now()
    }
  }
  return {
    code: 404,
    message: '招聘需求不存在',
    data: null,
    timestamp: Date.now()
  }
}

/**
 * 完成招聘需求
 * @param id 招聘需求ID
 */
export const completeRecruitment = async (id: string) => {
  await delay(300)
  const index = mockRecruitments.findIndex(item => item.id === id)
  if (index !== -1) {
    mockRecruitments[index].status = 'COMPLETED'
    return {
      code: 200,
      message: '成功',
      data: mockRecruitments[index],
      timestamp: Date.now()
    }
  }
  return {
    code: 404,
    message: '招聘需求不存在',
    data: null,
    timestamp: Date.now()
  }
}

/**
 * 取消招聘需求
 * @param id 招聘需求ID
 */
export const cancelRecruitment = async (id: string) => {
  await delay(300)
  const index = mockRecruitments.findIndex(item => item.id === id)
  if (index !== -1) {
    mockRecruitments[index].status = 'CANCELLED'
    return {
      code: 200,
      message: '成功',
      data: mockRecruitments[index],
      timestamp: Date.now()
    }
  }
  return {
    code: 404,
    message: '招聘需求不存在',
    data: null,
    timestamp: Date.now()
  }
}

/**
 * 导出招聘需求列表
 * @param params 查询参数
 */
export const exportRecruitments = async (params: RecruitmentQueryParams) => {
  await delay(500)
  // 模拟导出文件
  const blob = new Blob(['导出数据'], { type: 'application/vnd.ms-excel' })
  return blob
}

/**
 * 获取简历列表
 * @param params 查询参数
 */
export const getResumeList = async (params: ResumeQueryParams) => {
  await delay(500)
  return {
    code: 200,
    message: '成功',
    data: {
      list: mockResumes,
      total: mockResumes.length,
      page: params.page || 1,
      pageSize: params.pageSize || 10
    },
    timestamp: Date.now()
  }
}

/**
 * 获取简历详情
 * @param id 简历ID
 */
export const getResumeDetail = async (id: string) => {
  await delay(300)
  const resume = mockResumes.find(item => item.id === id)
  return {
    code: 200,
    message: '成功',
    data: resume,
    timestamp: Date.now()
  }
}

/**
 * 创建简历
 * @param data 简历数据
 */
export const createResume = async (data: ResumeFormData) => {
  await delay(500)
  const newResume: Resume = {
    id: (mockResumes.length + 1).toString(),
    name: data.name,
    gender: data.gender,
    age: data.age,
    phone: data.phone,
    education: data.education,
    workExperience: data.workExperience,
    status: 'PENDING',
    createTime: new Date().toISOString(),
    recruitmentId: data.recruitmentId,
    recruitmentTitle: data.recruitmentTitle || ''
  }
  mockResumes.push(newResume)
  return {
    code: 200,
    message: '成功',
    data: newResume,
    timestamp: Date.now()
  }
}

/**
 * 更新简历
 * @param id 简历ID
 * @param data 简历数据
 */
export const updateResume = async (id: string, data: ResumeFormData) => {
  await delay(500)
  const index = mockResumes.findIndex(item => item.id === id)
  if (index !== -1) {
    mockResumes[index] = {
      ...mockResumes[index],
      name: data.name,
      gender: data.gender,
      age: data.age,
      phone: data.phone,
      education: data.education,
      workExperience: data.workExperience,
      recruitmentId: data.recruitmentId,
      recruitmentTitle: data.recruitmentTitle || ''
    }
    return {
      code: 200,
      message: '成功',
      data: mockResumes[index],
      timestamp: Date.now()
    }
  }
  return {
    code: 404,
    message: '简历不存在',
    data: null,
    timestamp: Date.now()
  }
}

/**
 * 删除简历
 * @param id 简历ID
 */
export const deleteResume = async (id: string) => {
  await delay(300)
  const index = mockResumes.findIndex(item => item.id === id)
  if (index !== -1) {
    mockResumes.splice(index, 1)
    return {
      code: 200,
      message: '成功',
      data: null,
      timestamp: Date.now()
    }
  }
  return {
    code: 404,
    message: '简历不存在',
    data: null,
    timestamp: Date.now()
  }
}

/**
 * 批量删除简历
 * @param ids 简历ID数组
 */
export const batchDeleteResumes = async (ids: string[]) => {
  await delay(500)
  for (const id of ids) {
    const index = mockResumes.findIndex(item => item.id === id)
    if (index !== -1) {
      mockResumes.splice(index, 1)
    }
  }
  return {
    code: 200,
    message: '成功',
    data: null,
    timestamp: Date.now()
  }
}

/**
 * 审核简历
 * @param id 简历ID
 * @param data 审核数据
 */
export const reviewResume = async (id: string, data: {
  status: 'approved' | 'rejected';
  reviewComment?: string;
}) => {
  await delay(300)
  const index = mockResumes.findIndex(item => item.id === id)
  if (index !== -1) {
    mockResumes[index].status = data.status === 'approved' ? 'APPROVED' : 'REJECTED'
    return {
      code: 200,
      message: '成功',
      data: mockResumes[index],
      timestamp: Date.now()
    }
  }
  return {
    code: 404,
    message: '简历不存在',
    data: null,
    timestamp: Date.now()
  }
}

/**
 * 安排面试
 * @param id 简历ID
 * @param data 面试数据
 */
export const scheduleInterview = async (id: string, data: {
  interviewType: string;
  interviewTime: string;
  interviewer: string;
  interviewLocation?: string;
  remark?: string;
}) => {
  await delay(300)
  return {
    code: 200,
    message: '成功',
    data: null,
    timestamp: Date.now()
  }
}

/**
 * 录用简历
 * @param id 简历ID
 * @param data 录用数据
 */
export const hireResume = async (id: string, data: {
  hireDate: string;
  salary?: string;
  remark?: string;
}) => {
  await delay(300)
  const index = mockResumes.findIndex(item => item.id === id)
  if (index !== -1) {
    mockResumes[index].status = 'HIRED'
    return {
      code: 200,
      message: '成功',
      data: mockResumes[index],
      timestamp: Date.now()
    }
  }
  return {
    code: 404,
    message: '简历不存在',
    data: null,
    timestamp: Date.now()
  }
}

/**
 * 拒绝简历
 * @param id 简历ID
 * @param data 拒绝数据
 */
export const rejectResume = async (id: string, data: {
  rejectReason: string;
}) => {
  await delay(300)
  const index = mockResumes.findIndex(item => item.id === id)
  if (index !== -1) {
    mockResumes[index].status = 'REJECTED'
    return {
      code: 200,
      message: '成功',
      data: mockResumes[index],
      timestamp: Date.now()
    }
  }
  return {
    code: 404,
    message: '简历不存在',
    data: null,
    timestamp: Date.now()
  }
}

/**
 * 导出简历列表
 * @param params 查询参数
 */
export const exportResumes = async (params: ResumeQueryParams) => {
  await delay(500)
  // 模拟导出文件
  const blob = new Blob(['导出数据'], { type: 'application/vnd.ms-excel' })
  return blob
}

/**
 * 获取工厂下拉选项
 */
export const getFactoryOptions = async () => {
  await delay(300)
  return {
    code: 200,
    message: '成功',
    data: mockFactoryOptions,
    timestamp: Date.now()
  }
}

/**
 * 获取劳务公司下拉选项
 */
export const getLaborCompanyOptions = async () => {
  await delay(300)
  return {
    code: 200,
    message: '成功',
    data: mockLaborCompanyOptions,
    timestamp: Date.now()
  }
}

/**
 * 获取岗位下拉选项
 */
export const getPositionOptions = async () => {
  await delay(300)
  return {
    code: 200,
    message: '成功',
    data: mockPositionOptions,
    timestamp: Date.now()
  }
}
