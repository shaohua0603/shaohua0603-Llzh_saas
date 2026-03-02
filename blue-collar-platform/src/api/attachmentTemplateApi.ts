import request from '@/utils/request'
import type {
  AttachmentTemplate,
  ApiResponse,
  PageResponse
} from '@/types/attachment'
import type { Response } from '@/types/response'

const BASE_URL = '/api/v1/attachment-templates'

export const attachmentTemplateApi = {
  getTemplateList: (params: {
    page?: number
    pageSize?: number
    templateName?: string
    fileType?: string
  }) => {
    return request.get<PageResponse<AttachmentTemplate>>(BASE_URL, { params })
  },

  getTemplateDetail: (id: string) => {
    return request.get<ApiResponse<AttachmentTemplate>>(`${BASE_URL}/${id}`)
  },

  uploadTemplate: async (params: {
    file: File
    templateName: string
    description?: string
    onProgress?: (progress: number) => void
  }) => {
    const { file, templateName, description, onProgress } = params
    const formData = new FormData()
    formData.append('file', file)
    formData.append('templateName', templateName)
    if (description) {
      formData.append('description', description)
    }

    return request.post<ApiResponse<AttachmentTemplate>>(
      `${BASE_URL}/upload`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: (progressEvent) => {
          if (onProgress && progressEvent.total) {
            const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total)
            onProgress(progress)
          }
        }
      }
    )
  },

  updateTemplate: (id: string, data: {
    templateName?: string
    description?: string
  }) => {
    return request.put<ApiResponse<AttachmentTemplate>>(`${BASE_URL}/${id}`, data)
  },

  deleteTemplate: (id: string) => {
    return request.delete<ApiResponse<null>>(`${BASE_URL}/${id}`)
  },

  batchDeleteTemplate: (ids: string[]) => {
    return request.delete<ApiResponse<null>>(`${BASE_URL}/batch`, { data: { ids } })
  },

  downloadTemplate: (id: string) => {
    return request.get(`${BASE_URL}/${id}/download`, {
      responseType: 'blob'
    })
  },

  previewTemplate: (id: string) => {
    return request.get<ApiResponse<{ previewUrl: string }>>(`${BASE_URL}/${id}/preview`)
  }
}
