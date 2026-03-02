/**
 * 榜单管理模块API接口
 */
import request from '@/utils/request'
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

/**
 * 榜单管理API
 */
export const rankingApi = {
  /**
   * 获取在岗时长排名
   */
  getOnDutyHoursRanking: (params: RankingQueryParams): Promise<PageResponse<OnDutyHoursRanking>> => {
    return request.get('/api/v1/admin/operations/ranking/on-duty-hours', { params })
  },

  /**
   * 获取离职率排名
   */
  getTurnoverRateRanking: (params: RankingQueryParams): Promise<PageResponse<TurnoverRateRanking>> => {
    return request.get('/api/v1/admin/operations/ranking/turnover-rate', { params })
  },

  /**
   * 获取惩罚率排名
   */
  getPunishmentRateRanking: (params: RankingQueryParams): Promise<PageResponse<PunishmentRateRanking>> => {
    return request.get('/api/v1/admin/operations/ranking/punishment-rate', { params })
  },

  /**
   * 获取开除率排名
   */
  getDismissalRateRanking: (params: RankingQueryParams): Promise<PageResponse<DismissalRateRanking>> => {
    return request.get('/api/v1/admin/operations/ranking/dismissal-rate', { params })
  },

  /**
   * 获取调岗率排名
   */
  getTransferRateRanking: (params: RankingQueryParams): Promise<PageResponse<TransferRateRanking>> => {
    return request.get('/api/v1/admin/operations/ranking/transfer-rate', { params })
  },

  /**
   * 获取投诉率排名
   */
  getComplaintRateRanking: (params: RankingQueryParams): Promise<PageResponse<ComplaintRateRanking>> => {
    return request.get('/api/v1/admin/operations/ranking/complaint-rate', { params })
  },

  /**
   * 获取请假率排名
   */
  getLeaveRateRanking: (params: RankingQueryParams): Promise<PageResponse<LeaveRateRanking>> => {
    return request.get('/api/v1/admin/operations/ranking/leave-rate', { params })
  },

  /**
   * 获取加班时长排名
   */
  getOvertimeHoursRanking: (params: RankingQueryParams): Promise<PageResponse<OvertimeHoursRanking>> => {
    return request.get('/api/v1/admin/operations/ranking/overtime-hours', { params })
  },
}
