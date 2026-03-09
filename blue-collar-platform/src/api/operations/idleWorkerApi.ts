/**
 * 空闲工人模块API接口
 */
import type {
  ApiResponse,
  PageResponse,
} from '@/types/response'
import type {
  WorkerBasicInfo,
  WorkerDetailInfo,
  IdleWorkerQueryParams,
} from '@/types/operations/idleWorker'

// 模拟延迟
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

// Mock数据
const mockIdleWorkers: WorkerBasicInfo[] = [
  {
    id: 1,
    name: '张三',
    gender: '男',
    age: 25,
    education: '高中',
    phone: '13800138001',
    idCard: '110101199001011234',
    jobIntention: '普工',
    expectedSalary: 5000,
    workExperience: '2年',
    skills: ['组装', '包装'],
    tags: ['吃苦耐劳', '责任心强'],
    lastWorkUnit: '深圳富士康',
    idleDays: 3
  },
  {
    id: 2,
    name: '李四',
    gender: '女',
    age: 23,
    education: '中专',
    phone: '13800138002',
    idCard: '110101199002021234',
    jobIntention: '质检员',
    expectedSalary: 5500,
    workExperience: '1年',
    skills: ['质检', '包装'],
    tags: ['细心', '认真'],
    lastWorkUnit: '华为技术',
    idleDays: 1
  },
  {
    id: 3,
    name: '王五',
    gender: '男',
    age: 28,
    education: '初中',
    phone: '13800138003',
    idCard: '110101199003031234',
    jobIntention: '操作工',
    expectedSalary: 4800,
    workExperience: '5年',
    skills: ['操作', '维修'],
    tags: ['技术熟练', '经验丰富'],
    lastWorkUnit: '比亚迪',
    idleDays: 5
  }
]

const mockWorkerTags = [
  { value: 'hardworking', label: '吃苦耐劳' },
  { value: 'responsible', label: '责任心强' },
  { value: 'careful', label: '细心' },
  { value: 'serious', label: '认真' },
  { value: 'skilled', label: '技术熟练' },
  { value: 'experienced', label: '经验丰富' }
]

/**
 * 空闲工人API
 */
export const idleWorkerApi = {
  /**
   * 获取空闲工人信息
   */
  getIdleWorkerList: async (params: IdleWorkerQueryParams): Promise<ApiResponse<PageResponse<WorkerBasicInfo>>> => {
    await delay(500)
    let filteredWorkers = [...mockIdleWorkers]
    
    if (params.keyword) {
      const keyword = params.keyword.toLowerCase()
      filteredWorkers = filteredWorkers.filter(worker => 
        worker.name.toLowerCase().includes(keyword) ||
        worker.phone.includes(keyword)
      )
    }
    
    if (params.gender) {
      filteredWorkers = filteredWorkers.filter(worker => worker.gender === params.gender)
    }
    
    if (params.education) {
      filteredWorkers = filteredWorkers.filter(worker => worker.education === params.education)
    }
    
    if (params.jobIntention) {
      filteredWorkers = filteredWorkers.filter(worker => worker.jobIntention === params.jobIntention)
    }
    
    if (params.minAge) {
      filteredWorkers = filteredWorkers.filter(worker => worker.age >= params.minAge!)
    }
    
    if (params.maxAge) {
      filteredWorkers = filteredWorkers.filter(worker => worker.age <= params.maxAge!)
    }
    
    const page = params.page || 1
    const pageSize = params.pageSize || 10
    const start = (page - 1) * pageSize
    const end = start + pageSize
    
    return {
      code: 200,
      message: '成功',
      data: {
        list: filteredWorkers.slice(start, end),
        total: filteredWorkers.length,
        page,
        pageSize
      },
      timestamp: Date.now()
    }
  },

  /**
   * 获取工人详细信息
   */
  getWorkerDetail: async (id: number): Promise<ApiResponse<WorkerDetailInfo>> => {
    await delay(300)
    const worker = mockIdleWorkers.find(w => w.id === id)
    if (!worker) {
      return {
        code: 404,
        message: '工人不存在',
        data: null,
        timestamp: Date.now()
      }
    }
    
    const workerDetail: WorkerDetailInfo = {
      ...worker,
      address: '北京市朝阳区',
      maritalStatus: '未婚',
      healthStatus: '健康',
      emergencyContact: '赵六',
      emergencyPhone: '13800138004',
      bankAccount: '6222021234567890123',
      bankName: '中国工商银行',
      socialSecurityStatus: '已缴纳',
      workHistory: [
        {
          company: '深圳富士康',
          position: '普工',
          startTime: '2022-01-01',
          endTime: '2024-01-01',
          description: '负责电子产品组装'
        },
        {
          company: '华为技术',
          position: '质检员',
          startTime: '2024-02-01',
          endTime: '2024-03-01',
          description: '负责产品质量检测'
        }
      ],
      trainingExperience: [
        {
          course: '电子产品组装培训',
          organization: '深圳富士康',
          completionTime: '2022-02-01',
          certificate: '有'
        }
      ],
      familyMembers: [
        {
          name: '张父',
          relationship: '父亲',
          age: 50,
          occupation: '农民'
        },
        {
          name: '张母',
          relationship: '母亲',
          age: 48,
          occupation: '农民'
        }
      ],
      materials: {
        idCard: '已上传',
        diploma: '已上传',
        healthCertificate: '已上传',
        resume: '已上传'
      }
    }
    
    return {
      code: 200,
      message: '成功',
      data: workerDetail,
      timestamp: Date.now()
    }
  },

  /**
   * 获取工人标签列表
   */
  getWorkerTags: async (): Promise<ApiResponse<Array<{ value: string; label: string }>>> => {
    await delay(300)
    return {
      code: 200,
      message: '成功',
      data: mockWorkerTags,
      timestamp: Date.now()
    }
  },
}
