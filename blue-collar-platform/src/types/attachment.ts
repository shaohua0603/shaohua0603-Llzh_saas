export enum AttachmentType {
  IMAGE = 'IMAGE',
  FILE = 'FILE',
  VIDEO = 'VIDEO',
  AUDIO = 'AUDIO',
  DOCUMENT = 'DOCUMENT'
}

export const AttachmentTypeConfig = {
  [AttachmentType.IMAGE]: {
    label: '图片',
    icon: 'Picture',
    allowedExtensions: ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'],
    maxSize: 10,
    supportPreview: true,
    supportBatchUpload: true
  },
  [AttachmentType.FILE]: {
    label: '文件',
    icon: 'Document',
    allowedExtensions: ['zip', 'rar', '7z', 'tar', 'gz'],
    maxSize: 100,
    supportPreview: false,
    supportBatchUpload: true
  },
  [AttachmentType.VIDEO]: {
    label: '视频',
    icon: 'VideoPlay',
    allowedExtensions: ['mp4', 'avi', 'mov', 'wmv', 'flv', 'mkv'],
    maxSize: 500,
    supportPreview: true,
    supportBatchUpload: false
  },
  [AttachmentType.AUDIO]: {
    label: '音频',
    icon: 'Headset',
    allowedExtensions: ['mp3', 'wav', 'ogg', 'flac', 'aac'],
    maxSize: 50,
    supportPreview: true,
    supportBatchUpload: true
  },
  [AttachmentType.DOCUMENT]: {
    label: '文档',
    icon: 'Files',
    allowedExtensions: ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt'],
    maxSize: 20,
    supportPreview: true,
    supportBatchUpload: true
  }
}

export interface AttachmentConfig {
  id: string
  menuId: string
  menuName: string
  menuPath: string
  attachmentName: string
  attachmentType: AttachmentType
  maxSize: number
  required: boolean
  templateFileId?: string
  templateFileName?: string
  templateFileUrl?: string
  allowedTypes: string[]
  allowBatchUpload: boolean
  allowPreview: boolean
  description?: string
  status: 'enabled' | 'disabled'
  sort: number
  createdBy: string
  createdAt: Date
  updatedBy: string
  updatedAt: Date
  deletedAt?: Date
}

export interface AttachmentConfigQuery {
  page?: number
  pageSize?: number
  menuId?: string
  attachmentName?: string
  attachmentType?: AttachmentType
  required?: boolean
  status?: string
}

export interface AttachmentConfigFormData {
  id?: string
  menuId: string
  attachmentName: string
  attachmentType: AttachmentType
  maxSize: number
  required: boolean
  templateFileId?: string
  allowedTypes: string[]
  allowBatchUpload: boolean
  allowPreview: boolean
  description?: string
  sort: number
  status: 'enabled' | 'disabled'
}

export interface AttachmentRecord {
  id: string
  configId: string
  businessId: string
  businessType: string
  fileName: string
  fileOriginalName: string
  fileSize: number
  fileType: string
  fileExtension: string
  filePath: string
  fileUrl: string
  thumbnailUrl?: string
  previewUrl?: string
  uploaderId: string
  uploaderName: string
  uploadedAt: Date
  createdAt: Date
  updatedAt: Date
  deletedAt?: Date
}

export interface AttachmentTemplate {
  id: string
  templateName: string
  fileName: string
  fileOriginalName: string
  fileSize: number
  fileType: string
  fileExtension: string
  filePath: string
  fileUrl: string
  downloadCount: number
  createdBy: string
  createdAt: Date
  updatedAt: Date
  deletedAt?: Date
}

export interface AttachmentUploadParams {
  file: File
  configId: string
  businessId: string
  businessType: string
  onProgress?: (progress: number) => void
}

export interface AttachmentPreviewResponse {
  previewUrl: string
  thumbnailUrl?: string
}
