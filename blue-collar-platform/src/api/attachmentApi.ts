import request from '@/utils/request'
import type {
  AttachmentRecord,
  AttachmentUploadParams,
  AttachmentPreviewResponse,
  ApiResponse
} from '@/types/attachment'
import type { Response } from '@/types/response'

const BASE_URL = '/api/v1/attachments'

export const attachmentApi = {
  uploadAttachment: async (params: AttachmentUploadParams) => {
    const { file, configId, businessId, businessType, onProgress } = params
    const formData = new FormData()
    formData.append('file', file)
    formData.append('configId', configId)
    formData.append('businessId', businessId)
    formData.append('businessType', businessType)

    return request.post<ApiResponse<AttachmentRecord>>(
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

  batchUploadAttachments: async (params: {
    files: File[]
    configId: string
    businessId: string
    businessType: string
    onProgress?: (progress: number) => void
  }) => {
    const { files, configId, businessId, businessType, onProgress } = params
    const formData = new FormData()
    files.forEach(file => {
      formData.append('files', file)
    })
    formData.append('configId', configId)
    formData.append('businessId', businessId)
    formData.append('businessType', businessType)

    return request.post<ApiResponse<{
      success: AttachmentRecord[]
      failed: {
        file: File
        error: string
      }[]
    }>>(
      `${BASE_URL}/batch-upload`,
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

  getAttachmentList: (params: {
    configId: string
    businessId: string
    businessType: string
  }) => {
    return request.get<ApiResponse<AttachmentRecord[]>>(BASE_URL, { params })
  },

  deleteAttachment: (id: string) => {
    return request.delete<ApiResponse<null>>(`${BASE_URL}/${id}`)
  },

  getAttachmentPreview: (id: string) => {
    return request.get<ApiResponse<AttachmentPreviewResponse>>(`${BASE_URL}/${id}/preview`)
  },

  downloadAttachment: (id: string) => {
    return request.get(`${BASE_URL}/${id}/download`, {
      responseType: 'blob'
    })
  },

  chunkUpload: async (params: {
    chunk: Blob
    chunkIndex: number
    totalChunks: number
    uploadId: string
    fileName: string
    fileSize: number
    configId: string
    businessId: string
    businessType: string
  }) => {
    const formData = new FormData()
    formData.append('chunk', params.chunk)
    formData.append('chunkIndex', params.chunkIndex.toString())
    formData.append('totalChunks', params.totalChunks.toString())
    formData.append('uploadId', params.uploadId)
    formData.append('fileName', params.fileName)
    formData.append('fileSize', params.fileSize.toString())
    formData.append('configId', params.configId)
    formData.append('businessId', params.businessId)
    formData.append('businessType', params.businessType)

    return request.post<ApiResponse<{ chunkIndex: number }>>(
      `${BASE_URL}/chunk-upload`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    )
  },

  mergeChunks: async (params: {
    uploadId: string
    fileName: string
    fileSize: number
    totalChunks: number
    configId: string
    businessId: string
    businessType: string
  }) => {
    const formData = new FormData()
    formData.append('uploadId', params.uploadId)
    formData.append('fileName', params.fileName)
    formData.append('fileSize', params.fileSize.toString())
    formData.append('totalChunks', params.totalChunks.toString())
    formData.append('configId', params.configId)
    formData.append('businessId', params.businessId)
    formData.append('businessType', params.businessType)

    return request.post<ApiResponse<AttachmentRecord>>(
      `${BASE_URL}/merge-chunks`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    )
  },

  getUploadStatus: (uploadId: string) => {
    return request.get<ApiResponse<{ uploadedChunks: number[] }>>(
      `${BASE_URL}/upload-status/${uploadId}`
    )
  },

  cancelUpload: (uploadId: string) => {
    return request.delete<ApiResponse<null>>(`${BASE_URL}/upload/${uploadId}`)
  }
}
