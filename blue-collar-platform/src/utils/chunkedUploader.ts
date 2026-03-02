import request from '@/utils/request'
import type { AttachmentUploadParams, ApiResponse } from '@/types/attachment'

const CHUNK_SIZE = 5 * 1024 * 1024
const MAX_RETRIES = 3

export class ChunkedUploader {
  private file: File
  private configId: string
  private businessId: string
  private businessType: string
  private onProgress?: (progress: number) => void
  private chunks: Blob[] = []
  private uploadedChunks: Set<number> = new Set()
  private uploadId: string = ''

  constructor(params: AttachmentUploadParams) {
    this.file = params.file
    this.configId = params.configId
    this.businessId = params.businessId
    this.businessType = params.businessType
    this.onProgress = params.onProgress
    this.uploadId = this.generateUploadId()
  }

  private generateUploadId(): string {
    return `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`
  }

  private splitFile(): void {
    const chunks: Blob[] = []
    const fileSize = this.file.size
    let start = 0

    while (start < fileSize) {
      const end = Math.min(start + CHUNK_SIZE, fileSize)
      chunks.push(this.file.slice(start, end))
      start = end
    }

    this.chunks = chunks
  }

  private async uploadChunk(
    chunk: Blob,
    chunkIndex: number,
    retryCount = 0
  ): Promise<any> {
    try {
      const formData = new FormData()
      formData.append('chunk', chunk)
      formData.append('chunkIndex', chunkIndex.toString())
      formData.append('totalChunks', this.chunks.length.toString())
      formData.append('uploadId', this.uploadId)
      formData.append('fileName', this.file.name)
      formData.append('fileSize', this.file.size.toString())
      formData.append('configId', this.configId)
      formData.append('businessId', this.businessId)
      formData.append('businessType', this.businessType)

      const response = await request.post<ApiResponse<{ chunkIndex: number }>>(
        '/api/v1/attachments/chunk-upload',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      )

      this.uploadedChunks.add(chunkIndex)
      this.updateProgress()

      return response
    } catch (error) {
      if (retryCount < MAX_RETRIES) {
        console.warn(`分片${chunkIndex}上传失败,重试第${retryCount + 1}次`, error)
        await this.delay(1000 * (retryCount + 1))
        return this.uploadChunk(chunk, chunkIndex, retryCount + 1)
      }
      throw error
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  private updateProgress(): void {
    if (this.onProgress) {
      const progress = Math.round((this.uploadedChunks.size / this.chunks.length) * 100)
      this.onProgress(progress)
    }
  }

  private async mergeChunks(): Promise<any> {
    const formData = new FormData()
    formData.append('uploadId', this.uploadId)
    formData.append('fileName', this.file.name)
    formData.append('fileSize', this.file.size.toString())
    formData.append('totalChunks', this.chunks.length.toString())
    formData.append('configId', this.configId)
    formData.append('businessId', this.businessId)
    formData.append('businessType', this.businessType)

    return request.post<ApiResponse<any>>(
      '/api/v1/attachments/merge-chunks',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    )
  }

  private async checkUploadStatus(): Promise<{ uploadedChunks: number[] }> {
    try {
      const response = await request.get<ApiResponse<{ uploadedChunks: number[] }>>(
        `/api/v1/attachments/upload-status/${this.uploadId}`
      )
      return response.data
    } catch (error) {
      return { uploadedChunks: [] }
    }
  }

  public async upload(): Promise<any> {
    this.splitFile()

    const { uploadedChunks } = await this.checkUploadStatus()
    uploadedChunks.forEach(index => {
      this.uploadedChunks.add(index)
    })

    const pendingChunks = this.chunks
      .map((_, index) => index)
      .filter(index => !this.uploadedChunks.has(index))

    const concurrency = 3
    for (let i = 0; i < pendingChunks.length; i += concurrency) {
      const batch = pendingChunks.slice(i, i + concurrency)
      await Promise.all(
        batch.map(index => this.uploadChunk(this.chunks[index], index))
      )
    }

    return this.mergeChunks()
  }

  public async cancel(): Promise<void> {
    try {
      await request.delete(`/api/v1/attachments/upload/${this.uploadId}`)
    } catch (error) {
      console.error('取消上传失败', error)
    }
  }
}

export const uploadAttachmentWithChunk = async (
  params: AttachmentUploadParams
): Promise<any> => {
  const uploader = new ChunkedUploader(params)
  return uploader.upload()
}

export const cancelChunkUpload = async (uploadId: string): Promise<void> => {
  try {
    await request.delete(`/api/v1/attachments/upload/${uploadId}`)
  } catch (error) {
    console.error('取消上传失败', error)
  }
}
