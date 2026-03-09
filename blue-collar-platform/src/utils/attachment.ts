import { AttachmentType, AttachmentTypeConfig } from '@/types/attachment'

export const getAttachmentTypeLabel = (type: string): string => {
  const config = AttachmentTypeConfig[type as AttachmentType]
  return config?.label || type
}

export const getAttachmentTypeTag = (type: string): string => {
  const tagMap: Record<string, string> = {
    IMAGE: 'success',
    FILE: 'primary',
    VIDEO: 'warning',
    AUDIO: 'danger',
    DOCUMENT: 'info'
  }
  return tagMap[type] || 'info'
}

export const formatDate = (date: Date | string | null | undefined): string => {
  if (!date) return '-'
  const d = typeof date === 'string' ? new Date(date) : date
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  const hours = String(d.getHours()).padStart(2, '0')
  const minutes = String(d.getMinutes()).padStart(2, '0')
  const seconds = String(d.getSeconds()).padStart(2, '0')
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
}
