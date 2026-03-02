import type {
  Dictionary,
  DictionaryQueryParams,
  DictionaryResponse,
  DictionaryValue,
  DictionaryValueQueryParams,
  DictionaryValueResponse,
  DictionaryFormData,
  DictionaryImportData,
  DictionaryExportData,
  DictionaryStatistics,
  DictionaryOperationLog
} from '@/types/dictionary'
import DataPermissionService from './dataPermissionService'

const BASE_URL = '/api/v1'

export class DictionaryService {
  static async getDictionaryList(params: DictionaryQueryParams): Promise<DictionaryResponse> {
    const filteredParams = DataPermissionService.applyDataPermission(params)
    const response = await fetch(`${BASE_URL}/dictionaries?${new URLSearchParams(filteredParams as any).toString()}`)
    if (!response.ok) {
      throw new Error('获取字典列表失败')
    }
    return response.json()
  }

  static async getDictionaryById(id: string): Promise<Dictionary> {
    const response = await fetch(`${BASE_URL}/dictionaries/${id}`)
    if (!response.ok) {
      throw new Error('获取字典详情失败')
    }
    return response.json()
  }

  static async createDictionary(data: DictionaryFormData): Promise<Dictionary> {
    const response = await fetch(`${BASE_URL}/dictionaries`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    if (!response.ok) {
      throw new Error('创建字典失败')
    }
    return response.json()
  }

  static async updateDictionary(id: string, data: DictionaryFormData): Promise<Dictionary> {
    const response = await fetch(`${BASE_URL}/dictionaries/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    if (!response.ok) {
      throw new Error('更新字典失败')
    }
    return response.json()
  }

  static async deleteDictionary(id: string): Promise<void> {
    const response = await fetch(`${BASE_URL}/dictionaries/${id}`, {
      method: 'DELETE'
    })
    if (!response.ok) {
      throw new Error('删除字典失败')
    }
  }

  static async batchDeleteDictionaries(ids: string[]): Promise<void> {
    const response = await fetch(`${BASE_URL}/dictionaries/batch-delete`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ ids })
    })
    if (!response.ok) {
      throw new Error('批量删除字典失败')
    }
  }

  static async getDictionaryValueList(params: DictionaryValueQueryParams): Promise<DictionaryValueResponse> {
    const response = await fetch(`${BASE_URL}/dictionary-values?${new URLSearchParams(params as any).toString()}`)
    if (!response.ok) {
      throw new Error('获取字典值列表失败')
    }
    return response.json()
  }

  static async createDictionaryValue(dictionaryId: string, data: Partial<DictionaryValue>): Promise<DictionaryValue> {
    const response = await fetch(`${BASE_URL}/dictionaries/${dictionaryId}/values`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    if (!response.ok) {
      throw new Error('创建字典值失败')
    }
    return response.json()
  }

  static async updateDictionaryValue(dictionaryId: string, valueId: string, data: Partial<DictionaryValue>): Promise<DictionaryValue> {
    const response = await fetch(`${BASE_URL}/dictionaries/${dictionaryId}/values/${valueId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    if (!response.ok) {
      throw new Error('更新字典值失败')
    }
    return response.json()
  }

  static async deleteDictionaryValue(dictionaryId: string, valueId: string): Promise<void> {
    const response = await fetch(`${BASE_URL}/dictionaries/${dictionaryId}/values/${valueId}`, {
      method: 'DELETE'
    })
    if (!response.ok) {
      throw new Error('删除字典值失败')
    }
  }

  static async batchDeleteDictionaryValues(dictionaryId: string, valueIds: string[]): Promise<void> {
    const response = await fetch(`${BASE_URL}/dictionaries/${dictionaryId}/values/batch-delete`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ valueIds })
    })
    if (!response.ok) {
      throw new Error('批量删除字典值失败')
    }
  }

  static async importDictionaries(file: File): Promise<{ success: number; failed: number; errors: string[] }> {
    const formData = new FormData()
    formData.append('file', file)
    
    const response = await fetch(`${BASE_URL}/dictionaries/import`, {
      method: 'POST',
      body: formData
    })
    if (!response.ok) {
      throw new Error('导入字典失败')
    }
    return response.json()
  }

  static async exportDictionaries(params: DictionaryQueryParams): Promise<Blob> {
    const filteredParams = DataPermissionService.applyDataPermission(params)
    const response = await fetch(`${BASE_URL}/dictionaries/export?${new URLSearchParams(filteredParams as any).toString()}`)
    if (!response.ok) {
      throw new Error('导出字典失败')
    }
    return response.blob()
  }

  static async getDictionaryStatistics(): Promise<DictionaryStatistics> {
    const response = await fetch(`${BASE_URL}/dictionaries/statistics`)
    if (!response.ok) {
      throw new Error('获取字典统计失败')
    }
    return response.json()
  }

  static async getDictionaryOperationLogs(params: {
    page: number
    pageSize: number
    dictionaryId?: string
    operationType?: string
    startTime?: string
    endTime?: string
  }): Promise<{ list: DictionaryOperationLog[]; total: number }> {
    const response = await fetch(`${BASE_URL}/dictionaries/operation-logs?${new URLSearchParams(params as any).toString()}`)
    if (!response.ok) {
      throw new Error('获取操作日志失败')
    }
    return response.json()
  }

  static canEditDictionary(dictionary: Dictionary): boolean {
    return DataPermissionService.canEdit(dictionary)
  }

  static canDeleteDictionary(dictionary: Dictionary): boolean {
    return DataPermissionService.canDelete(dictionary)
  }

  static filterDictionariesByPermission(dictionaries: Dictionary[]): Dictionary[] {
    return DataPermissionService.filterDataByPermission(dictionaries)
  }
}

export default DictionaryService
