import request from '@/utils/request'
import type {
  AttachmentConfig,
  AttachmentConfigQuery,
  AttachmentConfigFormData,
  ApiResponse,
  PageResponse
} from '@/types/attachment'
import type { Response } from '@/types/response'

const BASE_URL = '/api/v1/attachment-configs'

export const attachmentConfigApi = {
  getAttachmentConfigList: (params: AttachmentConfigQuery) => {
    return request.get<PageResponse<AttachmentConfig>>(BASE_URL, { params })
  },

  getAttachmentConfigDetail: (id: string) => {
    return request.get<ApiResponse<AttachmentConfig>>(`${BASE_URL}/${id}`)
  },

  createAttachmentConfig: (data: AttachmentConfigFormData) => {
    return request.post<ApiResponse<AttachmentConfig>>(BASE_URL, data)
  },

  updateAttachmentConfig: (id: string, data: AttachmentConfigFormData) => {
    return request.put<ApiResponse<AttachmentConfig>>(`${BASE_URL}/${id}`, data)
  },

  deleteAttachmentConfig: (id: string) => {
    return request.delete<ApiResponse<null>>(`${BASE_URL}/${id}`)
  },

  batchDeleteAttachmentConfig: (ids: string[]) => {
    return request.delete<ApiResponse<null>>(`${BASE_URL}/batch`, { data: { ids } })
  },

  updateAttachmentConfigStatus: (id: string, status: 'enabled' | 'disabled') => {
    return request.put<ApiResponse<AttachmentConfig>>(`${BASE_URL}/${id}/status`, { status })
  }
}
