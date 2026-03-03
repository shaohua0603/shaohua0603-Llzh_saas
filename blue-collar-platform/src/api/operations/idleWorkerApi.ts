/**
 * 空闲工人模块API接口
 */
import request from '@/utils/request'
import type {
  ApiResponse,
  PageResponse,
} from '@/types/response'
import type {
  WorkerBasicInfo,
  WorkerDetailInfo,
  IdleWorkerQueryParams,
} from '@/types/operations/idleWorker'

/**
 * 空闲工人API
 */
export const idleWorkerApi = {
  /**
   * 获取空闲工人信息
   */
  getIdleWorkerList: (params: IdleWorkerQueryParams): Promise<PageResponse<WorkerBasicInfo>> => {
    return request.get('/api/v1/admin/operations/idle-workers', { params })
  },

  /**
   * 获取工人详细信息
   */
  getWorkerDetail: (id: number): Promise<ApiResponse<WorkerDetailInfo>> => {
    return request.get(`/api/v1/admin/operations/idle-workers/${id}`)
  },

  /**
   * 获取工人标签列表
   */
  getWorkerTags: (): Promise<ApiResponse<Array<{ value: string; label: string }>>> => {
    return request.get('/api/v1/admin/operations/idle-workers/tags')
  },
}
