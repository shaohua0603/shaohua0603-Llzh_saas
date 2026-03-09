import type {
  AttachmentRecord,
  AttachmentUploadParams,
  AttachmentPreviewResponse,
  ApiResponse
} from '@/types/attachment'
import type { Response } from '@/types/response'

// 模拟延迟
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

// Mock数据
const mockAttachments: AttachmentRecord[] = [
  {
    id: '1',
    fileName: '测试文件1.pdf',
    fileSize: 1024000,
    fileType: 'application/pdf',
    url: 'https://example.com/attachments/1.pdf',
    thumbUrl: '',
    configId: '1',
    businessId: '1',
    businessType: 'contract',
    uploadTime: '2024-01-01 10:00:00',
    uploader: '管理员'
  },
  {
    id: '2',
    fileName: '测试文件2.jpg',
    fileSize: 2048000,
    fileType: 'image/jpeg',
    url: 'https://example.com/attachments/2.jpg',
    thumbUrl: 'https://example.com/attachments/2_thumb.jpg',
    configId: '1',
    businessId: '1',
    businessType: 'contract',
    uploadTime: '2024-01-02 11:00:00',
    uploader: '管理员'
  }
]

export const attachmentApi = {
  uploadAttachment: async (params: AttachmentUploadParams) => {
    const { file, configId, businessId, businessType, onProgress } = params
    
    // 模拟上传进度
    for (let i = 0; i <= 100; i += 10) {
      if (onProgress) {
        onProgress(i)
      }
      await delay(100)
    }
    
    const newAttachment: AttachmentRecord = {
      id: (mockAttachments.length + 1).toString(),
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
      url: `https://example.com/attachments/${mockAttachments.length + 1}.${file.name.split('.').pop()}`,
      thumbUrl: file.type.startsWith('image/') ? `https://example.com/attachments/${mockAttachments.length + 1}_thumb.${file.name.split('.').pop()}` : '',
      configId,
      businessId,
      businessType,
      uploadTime: new Date().toISOString(),
      uploader: '管理员'
    }
    
    mockAttachments.push(newAttachment)
    
    return {
      code: 200,
      message: '成功',
      data: newAttachment,
      timestamp: Date.now()
    }
  },

  batchUploadAttachments: async (params: {
    files: File[]
    configId: string
    businessId: string
    businessType: string
    onProgress?: (progress: number) => void
  }) => {
    const { files, configId, businessId, businessType, onProgress } = params
    
    // 模拟上传进度
    for (let i = 0; i <= 100; i += 20) {
      if (onProgress) {
        onProgress(i)
      }
      await delay(200)
    }
    
    const success: AttachmentRecord[] = []
    const failed: { file: File; error: string }[] = []
    
    files.forEach((file, index) => {
      if (index % 2 === 0) {
        const newAttachment: AttachmentRecord = {
          id: (mockAttachments.length + 1 + index).toString(),
          fileName: file.name,
          fileSize: file.size,
          fileType: file.type,
          url: `https://example.com/attachments/${mockAttachments.length + 1 + index}.${file.name.split('.').pop()}`,
          thumbUrl: file.type.startsWith('image/') ? `https://example.com/attachments/${mockAttachments.length + 1 + index}_thumb.${file.name.split('.').pop()}` : '',
          configId,
          businessId,
          businessType,
          uploadTime: new Date().toISOString(),
          uploader: '管理员'
        }
        success.push(newAttachment)
        mockAttachments.push(newAttachment)
      } else {
        failed.push({ file, error: '上传失败' })
      }
    })
    
    return {
      code: 200,
      message: '成功',
      data: { success, failed },
      timestamp: Date.now()
    }
  },

  getAttachmentList: async (params: {
    configId: string
    businessId: string
    businessType: string
  }) => {
    await delay(300)
    const filteredAttachments = mockAttachments.filter(attachment => 
      attachment.configId === params.configId &&
      attachment.businessId === params.businessId &&
      attachment.businessType === params.businessType
    )
    
    return {
      code: 200,
      message: '成功',
      data: filteredAttachments,
      timestamp: Date.now()
    }
  },

  deleteAttachment: async (id: string) => {
    await delay(200)
    const index = mockAttachments.findIndex(a => a.id === id)
    if (index !== -1) {
      mockAttachments.splice(index, 1)
    }
    
    return {
      code: 200,
      message: '成功',
      data: null,
      timestamp: Date.now()
    }
  },

  getAttachmentPreview: async (id: string) => {
    await delay(200)
    const attachment = mockAttachments.find(a => a.id === id)
    if (!attachment) {
      return {
        code: 404,
        message: '附件不存在',
        data: null,
        timestamp: Date.now()
      }
    }
    
    return {
      code: 200,
      message: '成功',
      data: {
        url: attachment.url,
        fileType: attachment.fileType,
        fileName: attachment.fileName
      },
      timestamp: Date.now()
    }
  },

  downloadAttachment: async (id: string) => {
    await delay(500)
    // 模拟下载文件
    const blob = new Blob(['文件内容'], { type: 'application/octet-stream' })
    return blob
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
    await delay(100)
    
    return {
      code: 200,
      message: '成功',
      data: { chunkIndex: params.chunkIndex },
      timestamp: Date.now()
    }
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
    await delay(300)
    
    const newAttachment: AttachmentRecord = {
      id: (mockAttachments.length + 1).toString(),
      fileName: params.fileName,
      fileSize: params.fileSize,
      fileType: 'application/octet-stream',
      url: `https://example.com/attachments/${mockAttachments.length + 1}.${params.fileName.split('.').pop()}`,
      thumbUrl: '',
      configId: params.configId,
      businessId: params.businessId,
      businessType: params.businessType,
      uploadTime: new Date().toISOString(),
      uploader: '管理员'
    }
    
    mockAttachments.push(newAttachment)
    
    return {
      code: 200,
      message: '成功',
      data: newAttachment,
      timestamp: Date.now()
    }
  },

  getUploadStatus: async (uploadId: string) => {
    await delay(100)
    
    return {
      code: 200,
      message: '成功',
      data: { uploadedChunks: [0, 1, 2] },
      timestamp: Date.now()
    }
  },

  cancelUpload: async (uploadId: string) => {
    await delay(100)
    
    return {
      code: 200,
      message: '成功',
      data: null,
      timestamp: Date.now()
    }
  }
}
