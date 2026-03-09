import request from '@/utils/request'
import type { PageResponse } from '@/types/response'

// Mock数据
const mockPickups = [
  {
    id: 'PK001',
    plateNumber: '粤B12345',
    pickupTime: '2026-02-28 09:00:00',
    startPoint: '深圳宝安汽车站',
    endPoint: '东莞长安工业区',
    pickupPerson: '张三',
    manager: '李四',
    managerPhone: '13800138001',
    groupNumber: '123456789',
    status: 'pending',
    workerCount: 5,
    createTime: '2026-02-27 10:00:00'
  },
  {
    id: 'PK002',
    plateNumber: '粤A67890',
    pickupTime: '2026-02-28 10:30:00',
    startPoint: '广州南站',
    endPoint: '深圳宝安工业区',
    pickupPerson: '王五',
    manager: '赵六',
    managerPhone: '13800138002',
    groupNumber: '987654321',
    status: 'in_progress',
    workerCount: 8,
    createTime: '2026-02-27 11:00:00'
  }
]

// 接送管理类型定义
export interface Pickup {
  id: string
  plateNumber: string
  pickupTime: string
  startPoint: string
  endPoint: string
  pickupPerson: string
  manager: string
  managerPhone: string
  groupNumber: string
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled'
  createTime: string
}

export interface PickupDetail extends Pickup {
  workers: Array<{
    id: string
    name: string
    phone: string
    idCard: string
  }>
  remark?: string
}

export interface PickupQueryParams {
  page?: number
  pageSize?: number
  sortField?: string
  sortOrder?: 'asc' | 'desc'
  keyword?: string
  plateNumber?: string
  pickupTime?: string[]
  startPoint?: string
  endPoint?: string
  manager?: string
  status?: string
}

export interface PickupFormData {
  plateNumber: string
  pickupTime: string
  startPoint: string
  endPoint: string
  pickupPerson: string
  manager: string
  managerPhone: string
  groupNumber: string
  workerIds?: string[]
  remark?: string
}

// 初步面试类型定义
export interface InitialInterview {
  id: string
  interviewTime: string
  interviewLocation: string
  interviewer: string
  managerId: string
  managerName: string
  managerPhone: string
  recommendationLevel: 'PRIORITY' | 'NORMAL' | 'NOT_RECOMMENDED'
  imageLevel: 'EXCELLENT' | 'NORMAL' | 'OTHER'
  recommendationReason: string
  groupNumber: string
  tenantId: string
  departmentId: string
  creatorId: string
  creatorName: string
  createTime: string
  updateTime: string
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED'
}

export interface InitialInterviewDetail extends InitialInterview {
  operationRecords: Array<{
    id: string
    operationType: string
    operator: string
    operationTime: string
    operationContent: string
  }>
}

export interface InitialInterviewQueryParams {
  page?: number
  pageSize?: number
  sortField?: string
  sortOrder?: 'asc' | 'desc'
  keyword?: string
  interviewTime?: string[]
  interviewLocation?: string
  interviewer?: string
  manager?: string
  recommendationLevel?: string
  imageLevel?: string
  status?: string
}

export interface InitialInterviewFormData {
  interviewTime: string
  interviewLocation: string
  interviewer: string
  managerId: string
  managerName: string
  managerPhone: string
  recommendationLevel: 'PRIORITY' | 'NORMAL' | 'NOT_RECOMMENDED'
  imageLevel: 'EXCELLENT' | 'NORMAL' | 'OTHER'
  recommendationReason: string
  groupNumber: string
}

// 面试邀约类型定义
export interface InterviewInvitation {
  id: string
  factoryName: string
  contactPerson: string
  contactPhone: string
  interviewTime: string
  interviewLocation: string
  candidateCount: number
  manager: string
  managerPhone: string
  createTime: string
  creator: string
}

// 面试人员清单
export interface InterviewCandidate {
  isReturnWorker: boolean
  name: string
  phone: string
  idCard: string
  age: number
  gender: string
  recommendationLevel: '优先推荐' | '一般' | '不建议'
  imageLevel: '优秀' | '一般' | '其他'
  education: string
  positionCategory: string
  expectedLocation: string
  materialsComplete: boolean
  recommendationReason: string
}

export interface InterviewInvitationDetail extends InterviewInvitation {
  factoryInfo: {
    id: string
    name: string
    socialCreditCode: string
    contactPerson: string
    contactPhone: string
  }
  interviewer: string
  candidates: InterviewCandidate[]
  operationRecords: Array<{
    id: string
    operationType: string
    operator: string
    operationTime: string
    operationContent: string
  }>
}

export interface InterviewInvitationQueryParams {
  page?: number
  pageSize?: number
  sortField?: string
  sortOrder?: 'asc' | 'desc'
  keyword?: string
  factoryName?: string
  interviewTime?: string[]
  contactPerson?: string
  manager?: string
}

export interface InterviewInvitationFormData {
  factoryId: string
  factoryName: string
  socialCreditCode: string
  contactPerson: string
  contactPhone: string
  interviewTime: string
  interviewLocation: string
  interviewer: string
  manager: string
  managerPhone: string
  candidates: InterviewCandidate[]
}

// 工厂面试类型定义
export interface FactoryInterview {
  id: string
  laborCompanyId: string
  laborCompanyName: string
  socialCreditCode: string
  manager: string
  managerPhone: string
  interviewTime: string
  interviewLocation: string
  factoryContactId: string
  factoryContactName: string
  factoryContactPhone: string
  factoryId: string
  remark: string
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED'
  createdBy: string
  createdByName: string
  createdAt: string
  updatedBy: string
  updatedByName: string
  updatedAt: string
  personCount: number
  persons: FactoryInterviewPerson[]
}

export interface FactoryInterviewPerson {
  id: string
  workerId: string
  isReturnWorker: boolean
  name: string
  phone: string
  age: number
  gender: 'MALE' | 'FEMALE'
  recommendLevel: 'PRIORITY' | 'NORMAL' | 'NOT_RECOMMEND'
  imageLevel: 'EXCELLENT' | 'NORMAL' | 'OTHER'
  education: string
  positionCategory: 'WORKER' | 'TECHNICIAN' | 'MANAGER'
  expectedLocation: string
  recommendReason: string
}

export interface FactoryInterviewDetail extends FactoryInterview {
  operationRecords: Array<{
    id: string
    operationType: string
    operator: string
    operationTime: string
    operationContent: string
  }>
}

export interface FactoryInterviewQueryParams {
  page?: number
  pageSize?: number
  sortField?: string
  sortOrder?: 'asc' | 'desc'
  keyword?: string
  laborCompany?: string
  socialCreditCode?: string
  manager?: string
  factoryContact?: string
  status?: string
  interviewTime?: string[]
}

export interface FactoryInterviewFormData {
  laborCompanyId?: string
  laborCompanyName?: string
  socialCreditCode?: string
  manager?: string
  managerPhone?: string
  interviewTime: string
  interviewLocation: string
  factoryContactId: string
  factoryContactName: string
  factoryContactPhone: string
  remark?: string
  persons: FactoryInterviewPerson[]
}

// 接送管理API
export const getPickupList = (params: PickupQueryParams) => {
  // 直接返回Mock数据，绕过API请求
  return Promise.resolve({
    code: 200,
    message: 'success',
    data: {
      list: mockPickups,
      total: mockPickups.length,
      page: params.page || 1,
      pageSize: params.pageSize || 10
    },
    timestamp: Date.now()
  })
}

export const getPickupDetail = (id: string) => {
  // 直接返回Mock数据
  return Promise.resolve({
    code: 200,
    message: 'success',
    data: {
      ...mockPickups[0],
      workers: [
        { id: 'W001', name: '张三', phone: '13800138001', idCard: '110101199001011234' },
        { id: 'W002', name: '李四', phone: '13800138002', idCard: '110101199002021234' }
      ],
      remark: '测试接送信息'
    },
    timestamp: Date.now()
  })
}

export const createPickup = (data: PickupFormData) => {
  // 直接返回Mock数据
  return Promise.resolve({
    code: 201,
    message: 'created',
    data: { id: 'PK' + Date.now() },
    timestamp: Date.now()
  })
}

export const updatePickup = (id: string, data: PickupFormData) => {
  // 直接返回Mock数据
  return Promise.resolve({
    code: 200,
    message: 'success',
    data: {
      id,
      ...data,
      status: 'pending',
      workerCount: data.workerIds?.length || 0,
      createTime: new Date().toISOString(),
      updateTime: new Date().toISOString()
    },
    timestamp: Date.now()
  })
}

export const deletePickup = (id: string) => {
  // 直接返回Mock数据
  return Promise.resolve({
    code: 200,
    message: 'success',
    data: null,
    timestamp: Date.now()
  })
}

export const batchDeletePickups = (ids: string[]) => {
  // 直接返回Mock数据
  return Promise.resolve({
    code: 200,
    message: 'success',
    data: null,
    timestamp: Date.now()
  })
}

export const importPickups = (file: File) => {
  // 直接返回Mock数据
  return Promise.resolve({
    code: 200,
    message: 'success',
    data: { successCount: 10, failCount: 0, failRecords: [] },
    timestamp: Date.now()
  })
}

export const exportPickups = (params: PickupQueryParams) => {
  // 直接返回Mock数据
  return Promise.resolve(new Blob(['Mock Excel Data'], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }))
}

export const downloadPickupTemplate = () => {
  // 直接返回Mock数据
  return Promise.resolve(new Blob(['Mock Template Data'], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }))
}

// 初步面试API
export const getInitialInterviewList = (params: InitialInterviewQueryParams) => {
  // 直接返回Mock数据
  return Promise.resolve({
    code: 200,
    message: 'success',
    data: {
      list: [
        {
          id: 'II001',
          interviewTime: '2026-02-28 14:00:00',
          interviewLocation: '深圳宝安面试点',
          interviewer: '张三',
          managerId: 'EMP001',
          managerName: '李四',
          managerPhone: '13800138001',
          recommendationLevel: 'PRIORITY',
          imageLevel: 'EXCELLENT',
          recommendationReason: '表现优秀',
          groupNumber: '123456789',
          tenantId: 'TENANT001',
          departmentId: 'DEPT001',
          creatorId: 'USER001',
          creatorName: '王五',
          createTime: '2026-02-27 10:00:00',
          updateTime: '2026-02-27 10:00:00',
          status: 'COMPLETED'
        }
      ],
      total: 1,
      page: params.page || 1,
      pageSize: params.pageSize || 10
    },
    timestamp: Date.now()
  })
}

export const getInitialInterviewDetail = (id: string) => {
  // 直接返回Mock数据
  return Promise.resolve({
    code: 200,
    message: 'success',
    data: {
      id,
      interviewTime: '2026-02-28 14:00:00',
      interviewLocation: '深圳宝安面试点',
      interviewer: '张三',
      managerId: 'EMP001',
      managerName: '李四',
      managerPhone: '13800138001',
      recommendationLevel: 'PRIORITY',
      imageLevel: 'EXCELLENT',
      recommendationReason: '表现优秀',
      groupNumber: '123456789',
      tenantId: 'TENANT001',
      departmentId: 'DEPT001',
      creatorId: 'USER001',
      creatorName: '王五',
      createTime: '2026-02-27 10:00:00',
      updateTime: '2026-02-27 10:00:00',
      status: 'COMPLETED',
      operationRecords: [
        {
          id: 'OR001',
          operationType: 'create',
          operator: '王五',
          operationTime: '2026-02-27 10:00:00',
          operationContent: '创建初步面试'
        }
      ]
    },
    timestamp: Date.now()
  })
}

export const createInitialInterview = (data: InitialInterviewFormData) => {
  // 直接返回Mock数据
  return Promise.resolve({
    code: 201,
    message: 'created',
    data: { id: 'II' + Date.now() },
    timestamp: Date.now()
  })
}

export const updateInitialInterview = (id: string, data: InitialInterviewFormData) => {
  // 直接返回Mock数据
  return Promise.resolve({
    code: 200,
    message: 'success',
    data: {
      id,
      ...data,
      status: 'PENDING',
      tenantId: 'TENANT001',
      departmentId: 'DEPT001',
      creatorId: 'USER001',
      creatorName: '王五',
      createTime: new Date().toISOString(),
      updateTime: new Date().toISOString()
    },
    timestamp: Date.now()
  })
}

export const deleteInitialInterview = (id: string) => {
  // 直接返回Mock数据
  return Promise.resolve({
    code: 200,
    message: 'success',
    data: null,
    timestamp: Date.now()
  })
}

export const batchDeleteInitialInterviews = (ids: string[]) => {
  // 直接返回Mock数据
  return Promise.resolve({
    code: 200,
    message: 'success',
    data: null,
    timestamp: Date.now()
  })
}

export const importInitialInterviews = (file: File) => {
  // 直接返回Mock数据
  return Promise.resolve({
    code: 200,
    message: 'success',
    data: { successCount: 10, failCount: 0, failRecords: [] },
    timestamp: Date.now()
  })
}

export const exportInitialInterviews = (params: InitialInterviewQueryParams) => {
  // 直接返回Mock数据
  return Promise.resolve(new Blob(['Mock Excel Data'], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }))
}

export const downloadInitialInterviewTemplate = () => {
  // 直接返回Mock数据
  return Promise.resolve(new Blob(['Mock Template Data'], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }))
}

// 面试邀约API
export const getInterviewInvitationList = (params: InterviewInvitationQueryParams) => {
  // 直接返回Mock数据
  return Promise.resolve({
    code: 200,
    message: 'success',
    data: {
      list: [
        {
          id: 'IV001',
          factoryName: '华为技术有限公司',
          contactPerson: '张三',
          contactPhone: '13800138001',
          interviewTime: '2026-02-28 15:00:00',
          interviewLocation: '深圳宝安厂区',
          candidateCount: 5,
          manager: '李四',
          managerPhone: '13800138002',
          createTime: '2026-02-27 11:00:00',
          creator: '王五'
        }
      ],
      total: 1,
      page: params.page || 1,
      pageSize: params.pageSize || 10
    },
    timestamp: Date.now()
  })
}

export const getInterviewInvitationDetail = (id: string) => {
  // 直接返回Mock数据
  return Promise.resolve({
    code: 200,
    message: 'success',
    data: {
      id,
      factoryName: '华为技术有限公司',
      contactPerson: '张三',
      contactPhone: '13800138001',
      interviewTime: '2026-02-28 15:00:00',
      interviewLocation: '深圳宝安厂区',
      candidateCount: 5,
      manager: '李四',
      managerPhone: '13800138002',
      createTime: '2026-02-27 11:00:00',
      creator: '王五',
      factoryInfo: {
        id: 'F001',
        name: '华为技术有限公司',
        socialCreditCode: '91440300MA5DXXXXXX',
        contactPerson: '张三',
        contactPhone: '13800138001'
      },
      interviewer: '赵六',
      candidates: [
        {
          isReturnWorker: false,
          name: '孙七',
          phone: '13800138003',
          idCard: '440***********1234',
          age: 25,
          gender: '男',
          recommendationLevel: '优先推荐',
          imageLevel: '优秀',
          education: '大专',
          positionCategory: '普工',
          expectedLocation: '深圳',
          materialsComplete: true,
          recommendationReason: '表现优秀'
        }
      ],
      operationRecords: [
        {
          id: 'OR001',
          operationType: 'create',
          operator: '王五',
          operationTime: '2026-02-27 11:00:00',
          operationContent: '创建面试邀约'
        }
      ]
    },
    timestamp: Date.now()
  })
}

export const createInterviewInvitation = (data: InterviewInvitationFormData) => {
  // 直接返回Mock数据
  return Promise.resolve({
    code: 201,
    message: 'created',
    data: { id: 'IV' + Date.now() },
    timestamp: Date.now()
  })
}

export const updateInterviewInvitation = (id: string, data: InterviewInvitationFormData) => {
  // 直接返回Mock数据
  return Promise.resolve({
    code: 200,
    message: 'success',
    data: {
      id,
      factoryName: data.factoryName,
      contactPerson: data.contactPerson,
      contactPhone: data.contactPhone,
      interviewTime: data.interviewTime,
      interviewLocation: data.interviewLocation,
      candidateCount: data.candidates.length,
      manager: data.manager,
      managerPhone: data.managerPhone,
      createTime: new Date().toISOString(),
      creator: '王五'
    },
    timestamp: Date.now()
  })
}

export const deleteInterviewInvitation = (id: string) => {
  // 直接返回Mock数据
  return Promise.resolve({
    code: 200,
    message: 'success',
    data: null,
    timestamp: Date.now()
  })
}

export const batchDeleteInterviewInvitations = (ids: string[]) => {
  // 直接返回Mock数据
  return Promise.resolve({
    code: 200,
    message: 'success',
    data: null,
    timestamp: Date.now()
  })
}

export const importInterviewInvitations = (file: File) => {
  // 直接返回Mock数据
  return Promise.resolve({
    code: 200,
    message: 'success',
    data: { successCount: 10, failCount: 0, failRecords: [] },
    timestamp: Date.now()
  })
}

export const exportInterviewInvitations = (params: InterviewInvitationQueryParams) => {
  // 直接返回Mock数据
  return Promise.resolve(new Blob(['Mock Excel Data'], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }))
}

export const downloadInterviewInvitationTemplate = () => {
  // 直接返回Mock数据
  return Promise.resolve(new Blob(['Mock Template Data'], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }))
}

// 工厂面试API
export const getFactoryInterviewList = (params: FactoryInterviewQueryParams) => {
  // 直接返回Mock数据
  return Promise.resolve({
    code: 200,
    message: 'success',
    data: {
      list: [
        {
          id: 'FI001',
          laborCompanyId: 'LC001',
          laborCompanyName: '深圳市蓝领劳务派遣有限公司',
          socialCreditCode: '91440300MA5D123456',
          manager: '张三',
          managerPhone: '13800138001',
          interviewTime: '2026-02-28 16:00:00',
          interviewLocation: '深圳宝安厂区',
          factoryContactId: 'EMP001',
          factoryContactName: '李四',
          factoryContactPhone: '13800138002',
          factoryId: 'F001',
          remark: '测试工厂面试',
          status: 'COMPLETED',
          createdBy: 'USER001',
          createdByName: '王五',
          createdAt: '2026-02-27 12:00:00',
          updatedBy: 'USER001',
          updatedByName: '王五',
          updatedAt: '2026-02-27 12:00:00',
          personCount: 3,
          persons: []
        }
      ],
      total: 1,
      page: params.page || 1,
      pageSize: params.pageSize || 10
    },
    timestamp: Date.now()
  })
}

export const getFactoryInterviewDetail = (id: string) => {
  // 直接返回Mock数据
  return Promise.resolve({
    code: 200,
    message: 'success',
    data: {
      id,
      laborCompanyId: 'LC001',
      laborCompanyName: '深圳市蓝领劳务派遣有限公司',
      socialCreditCode: '91440300MA5D123456',
      manager: '张三',
      managerPhone: '13800138001',
      interviewTime: '2026-02-28 16:00:00',
      interviewLocation: '深圳宝安厂区',
      factoryContactId: 'EMP001',
      factoryContactName: '李四',
      factoryContactPhone: '13800138002',
      factoryId: 'F001',
      remark: '测试工厂面试',
      status: 'COMPLETED',
      createdBy: 'USER001',
      createdByName: '王五',
      createdAt: '2026-02-27 12:00:00',
      updatedBy: 'USER001',
      updatedByName: '王五',
      updatedAt: '2026-02-27 12:00:00',
      personCount: 3,
      persons: [
        {
          id: 'FIP001',
          workerId: 'W001',
          isReturnWorker: false,
          name: '孙七',
          phone: '13800138003',
          age: 25,
          gender: 'MALE',
          recommendLevel: 'PRIORITY',
          imageLevel: 'EXCELLENT',
          education: '大专',
          positionCategory: 'WORKER',
          expectedLocation: '深圳',
          recommendReason: '表现优秀'
        }
      ],
      operationRecords: [
        {
          id: 'OR001',
          operationType: 'create',
          operator: '王五',
          operationTime: '2026-02-27 12:00:00',
          operationContent: '创建工厂面试'
        }
      ]
    },
    timestamp: Date.now()
  })
}

export const createFactoryInterview = (data: FactoryInterviewFormData) => {
  // 直接返回Mock数据
  return Promise.resolve({
    code: 201,
    message: 'created',
    data: { id: 'FI' + Date.now() },
    timestamp: Date.now()
  })
}

export const updateFactoryInterview = (id: string, data: FactoryInterviewFormData) => {
  // 直接返回Mock数据
  return Promise.resolve({
    code: 200,
    message: 'success',
    data: {
      id,
      laborCompanyId: data.laborCompanyId,
      laborCompanyName: data.laborCompanyName,
      socialCreditCode: data.socialCreditCode,
      manager: data.manager,
      managerPhone: data.managerPhone,
      interviewTime: data.interviewTime,
      interviewLocation: data.interviewLocation,
      factoryContactId: data.factoryContactId,
      factoryContactName: data.factoryContactName,
      factoryContactPhone: data.factoryContactPhone,
      factoryId: 'F001',
      remark: data.remark,
      status: 'PENDING',
      createdBy: 'USER001',
      createdByName: '王五',
      createdAt: new Date().toISOString(),
      updatedBy: 'USER001',
      updatedByName: '王五',
      updatedAt: new Date().toISOString(),
      personCount: data.persons.length,
      persons: data.persons
    },
    timestamp: Date.now()
  })
}

export const deleteFactoryInterview = (id: string) => {
  // 直接返回Mock数据
  return Promise.resolve({
    code: 200,
    message: 'success',
    data: null,
    timestamp: Date.now()
  })
}

export const batchDeleteFactoryInterviews = (ids: string[]) => {
  // 直接返回Mock数据
  return Promise.resolve({
    code: 200,
    message: 'success',
    data: null,
    timestamp: Date.now()
  })
}

export const importFactoryInterviews = (file: File) => {
  // 直接返回Mock数据
  return Promise.resolve({
    code: 200,
    message: 'success',
    data: { successCount: 10, failCount: 0, failRecords: [] },
    timestamp: Date.now()
  })
}

export const exportFactoryInterviews = (params: FactoryInterviewQueryParams) => {
  // 直接返回Mock数据
  return Promise.resolve(new Blob(['Mock Excel Data'], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }))
}

export const downloadFactoryInterviewTemplate = () => {
  // 直接返回Mock数据
  return Promise.resolve(new Blob(['Mock Template Data'], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }))
}

// 公共API
export const getWorkerOptions = () => {
  // 直接返回Mock数据
  return Promise.resolve({
    code: 200,
    message: 'success',
    data: [
      { id: 'W001', name: '张三', phone: '13800138001', idCard: '110101199001011234', jobCategory: '普工', materialComplete: true },
      { id: 'W002', name: '李四', phone: '13800138002', idCard: '110101199002021234', jobCategory: '技工', materialComplete: false }
    ],
    timestamp: Date.now()
  })
}

export const getFactoryOptions = () => {
  // 直接返回Mock数据
  return Promise.resolve({
    code: 200,
    message: 'success',
    data: [
      { id: 'F001', name: '华为技术有限公司', socialCreditCode: '91440300MA5DXXXXXX' },
      { id: 'F002', name: '比亚迪股份有限公司', socialCreditCode: '91440300MA5DXXXXXX' }
    ],
    timestamp: Date.now()
  })
}

export const getPositionOptions = () => {
  // 直接返回Mock数据
  return Promise.resolve({
    code: 200,
    message: 'success',
    data: [
      { id: 'P001', name: '普工', category: '生产' },
      { id: 'P002', name: '技工', category: '生产' },
      { id: 'P003', name: '质检员', category: '质量' }
    ],
    timestamp: Date.now()
  })
}
