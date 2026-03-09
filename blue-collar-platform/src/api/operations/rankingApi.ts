/**
 * 榜单管理模块API接口
 */
import type {
  ApiResponse,
  PageResponse,
} from '@/types/response'
import type {
  RankingQueryParams,
  OnDutyHoursRanking,
  TurnoverRateRanking,
  PunishmentRateRanking,
  DismissalRateRanking,
  TransferRateRanking,
  ComplaintRateRanking,
  LeaveRateRanking,
  OvertimeHoursRanking,
} from '@/types/operations/ranking'

// 模拟延迟
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

// Mock数据
const mockOnDutyHoursRanking: OnDutyHoursRanking[] = [
  { rank: 1, workerId: 'W001', workerName: '张三', onDutyHours: 240, department: '生产部' },
  { rank: 2, workerId: 'W002', workerName: '李四', onDutyHours: 230, department: '生产部' },
  { rank: 3, workerId: 'W003', workerName: '王五', onDutyHours: 220, department: '质检部' }
]

const mockTurnoverRateRanking: TurnoverRateRanking[] = [
  { rank: 1, department: '生产部', turnoverRate: 0.1, totalWorkers: 100, leftWorkers: 10 },
  { rank: 2, department: '质检部', turnoverRate: 0.08, totalWorkers: 50, leftWorkers: 4 },
  { rank: 3, department: '物流部', turnoverRate: 0.05, totalWorkers: 30, leftWorkers: 2 }
]

const mockPunishmentRateRanking: PunishmentRateRanking[] = [
  { rank: 1, workerId: 'W004', workerName: '赵六', punishmentRate: 0.2, totalDays: 30, punishmentDays: 6 },
  { rank: 2, workerId: 'W005', workerName: '孙七', punishmentRate: 0.15, totalDays: 30, punishmentDays: 4.5 },
  { rank: 3, workerId: 'W006', workerName: '周八', punishmentRate: 0.1, totalDays: 30, punishmentDays: 3 }
]

const mockDismissalRateRanking: DismissalRateRanking[] = [
  { rank: 1, department: '生产部', dismissalRate: 0.05, totalWorkers: 100, dismissedWorkers: 5 },
  { rank: 2, department: '物流部', dismissalRate: 0.03, totalWorkers: 30, dismissedWorkers: 1 },
  { rank: 3, department: '质检部', dismissalRate: 0.02, totalWorkers: 50, dismissedWorkers: 1 }
]

const mockTransferRateRanking: TransferRateRanking[] = [
  { rank: 1, department: '生产部', transferRate: 0.12, totalWorkers: 100, transferredWorkers: 12 },
  { rank: 2, department: '质检部', transferRate: 0.1, totalWorkers: 50, transferredWorkers: 5 },
  { rank: 3, department: '物流部', transferRate: 0.08, totalWorkers: 30, transferredWorkers: 3 }
]

const mockComplaintRateRanking: ComplaintRateRanking[] = [
  { rank: 1, department: '生产部', complaintRate: 0.08, totalWorkers: 100, complaintCount: 8 },
  { rank: 2, department: '物流部', complaintRate: 0.06, totalWorkers: 30, complaintCount: 2 },
  { rank: 3, department: '质检部', complaintRate: 0.04, totalWorkers: 50, complaintCount: 2 }
]

const mockLeaveRateRanking: LeaveRateRanking[] = [
  { rank: 1, workerId: 'W007', workerName: '吴九', leaveRate: 0.25, totalDays: 30, leaveDays: 7.5 },
  { rank: 2, workerId: 'W008', workerName: '郑十', leaveRate: 0.2, totalDays: 30, leaveDays: 6 },
  { rank: 3, workerId: 'W009', workerName: '陈十一', leaveRate: 0.15, totalDays: 30, leaveDays: 4.5 }
]

const mockOvertimeHoursRanking: OvertimeHoursRanking[] = [
  { rank: 1, workerId: 'W010', workerName: '刘十二', overtimeHours: 80, department: '生产部' },
  { rank: 2, workerId: 'W011', workerName: '张十三', overtimeHours: 75, department: '生产部' },
  { rank: 3, workerId: 'W012', workerName: '李十四', overtimeHours: 70, department: '质检部' }
]

/**
 * 榜单管理API
 */
export const rankingApi = {
  /**
   * 获取在岗时长排名
   */
  getOnDutyHoursRanking: async (params: RankingQueryParams): Promise<ApiResponse<PageResponse<OnDutyHoursRanking>>> => {
    await delay(500)
    const page = params.page || 1
    const pageSize = params.pageSize || 10
    const start = (page - 1) * pageSize
    const end = start + pageSize
    
    return {
      code: 200,
      message: '成功',
      data: {
        list: mockOnDutyHoursRanking.slice(start, end),
        total: mockOnDutyHoursRanking.length,
        page,
        pageSize
      },
      timestamp: Date.now()
    }
  },

  /**
   * 获取离职率排名
   */
  getTurnoverRateRanking: async (params: RankingQueryParams): Promise<ApiResponse<PageResponse<TurnoverRateRanking>>> => {
    await delay(500)
    const page = params.page || 1
    const pageSize = params.pageSize || 10
    const start = (page - 1) * pageSize
    const end = start + pageSize
    
    return {
      code: 200,
      message: '成功',
      data: {
        list: mockTurnoverRateRanking.slice(start, end),
        total: mockTurnoverRateRanking.length,
        page,
        pageSize
      },
      timestamp: Date.now()
    }
  },

  /**
   * 获取惩罚率排名
   */
  getPunishmentRateRanking: async (params: RankingQueryParams): Promise<ApiResponse<PageResponse<PunishmentRateRanking>>> => {
    await delay(500)
    const page = params.page || 1
    const pageSize = params.pageSize || 10
    const start = (page - 1) * pageSize
    const end = start + pageSize
    
    return {
      code: 200,
      message: '成功',
      data: {
        list: mockPunishmentRateRanking.slice(start, end),
        total: mockPunishmentRateRanking.length,
        page,
        pageSize
      },
      timestamp: Date.now()
    }
  },

  /**
   * 获取开除率排名
   */
  getDismissalRateRanking: async (params: RankingQueryParams): Promise<ApiResponse<PageResponse<DismissalRateRanking>>> => {
    await delay(500)
    const page = params.page || 1
    const pageSize = params.pageSize || 10
    const start = (page - 1) * pageSize
    const end = start + pageSize
    
    return {
      code: 200,
      message: '成功',
      data: {
        list: mockDismissalRateRanking.slice(start, end),
        total: mockDismissalRateRanking.length,
        page,
        pageSize
      },
      timestamp: Date.now()
    }
  },

  /**
   * 获取调岗率排名
   */
  getTransferRateRanking: async (params: RankingQueryParams): Promise<ApiResponse<PageResponse<TransferRateRanking>>> => {
    await delay(500)
    const page = params.page || 1
    const pageSize = params.pageSize || 10
    const start = (page - 1) * pageSize
    const end = start + pageSize
    
    return {
      code: 200,
      message: '成功',
      data: {
        list: mockTransferRateRanking.slice(start, end),
        total: mockTransferRateRanking.length,
        page,
        pageSize
      },
      timestamp: Date.now()
    }
  },

  /**
   * 获取投诉率排名
   */
  getComplaintRateRanking: async (params: RankingQueryParams): Promise<ApiResponse<PageResponse<ComplaintRateRanking>>> => {
    await delay(500)
    const page = params.page || 1
    const pageSize = params.pageSize || 10
    const start = (page - 1) * pageSize
    const end = start + pageSize
    
    return {
      code: 200,
      message: '成功',
      data: {
        list: mockComplaintRateRanking.slice(start, end),
        total: mockComplaintRateRanking.length,
        page,
        pageSize
      },
      timestamp: Date.now()
    }
  },

  /**
   * 获取请假率排名
   */
  getLeaveRateRanking: async (params: RankingQueryParams): Promise<ApiResponse<PageResponse<LeaveRateRanking>>> => {
    await delay(500)
    const page = params.page || 1
    const pageSize = params.pageSize || 10
    const start = (page - 1) * pageSize
    const end = start + pageSize
    
    return {
      code: 200,
      message: '成功',
      data: {
        list: mockLeaveRateRanking.slice(start, end),
        total: mockLeaveRateRanking.length,
        page,
        pageSize
      },
      timestamp: Date.now()
    }
  },

  /**
   * 获取加班时长排名
   */
  getOvertimeHoursRanking: async (params: RankingQueryParams): Promise<ApiResponse<PageResponse<OvertimeHoursRanking>>> => {
    await delay(500)
    const page = params.page || 1
    const pageSize = params.pageSize || 10
    const start = (page - 1) * pageSize
    const end = start + pageSize
    
    return {
      code: 200,
      message: '成功',
      data: {
        list: mockOvertimeHoursRanking.slice(start, end),
        total: mockOvertimeHoursRanking.length,
        page,
        pageSize
      },
      timestamp: Date.now()
    }
  },
}
