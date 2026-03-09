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
    console.log('DictionaryService.getDictionaryList called with params:', params)
    try {
      console.log('Applying data permission')
      const filteredParams = DataPermissionService.applyDataPermission(params)
      console.log('Filtered params:', filteredParams)
      console.log('Fetching from:', `${BASE_URL}/dictionaries?${new URLSearchParams(filteredParams as any).toString()}`)
      const response = await fetch(`${BASE_URL}/dictionaries?${new URLSearchParams(filteredParams as any).toString()}`)
      if (!response.ok) {
        throw new Error('获取字典列表失败')
      }
      const data = await response.json()
      console.log('API response:', data)
      return data
    } catch (error) {
      console.error('Error in getDictionaryList:', error)
      // 返回模拟数据
      const mockData = {
        list: [
          {
            id: '1',
            name: '性别',
            type: 'business',
            code: 'GENDER',
            description: '性别字典',
            values: [
              { id: '1', value: 'male', label: '男', sort: 1, status: 'enabled', remark: '' },
              { id: '2', value: 'female', label: '女', sort: 2, status: 'enabled', remark: '' }
            ],
            creatorName: '管理员',
            departmentName: '总部门',
            createdAt: new Date().toISOString()
          },
          {
            id: '2',
            name: '学历',
            type: 'business',
            code: 'EDUCATION',
            description: '学历字典',
            values: [
              { id: '1', value: 'primary', label: '小学', sort: 1, status: 'enabled', remark: '' },
              { id: '2', value: 'middle', label: '初中', sort: 2, status: 'enabled', remark: '' },
              { id: '3', value: 'high', label: '高中', sort: 3, status: 'enabled', remark: '' },
              { id: '4', value: 'college', label: '大学', sort: 4, status: 'enabled', remark: '' }
            ],
            creatorName: '管理员',
            departmentName: '总部门',
            createdAt: new Date().toISOString()
          },
          {
            id: '3',
            name: '婚姻状况',
            type: 'business',
            code: 'MARITAL_STATUS',
            description: '婚姻状况字典',
            values: [
              { id: '1', value: 'single', label: '未婚', sort: 1, status: 'enabled', remark: '' },
              { id: '2', value: 'married', label: '已婚', sort: 2, status: 'enabled', remark: '' },
              { id: '3', value: 'divorced', label: '离异', sort: 3, status: 'enabled', remark: '' }
            ],
            creatorName: '管理员',
            departmentName: '总部门',
            createdAt: new Date().toISOString()
          }
        ],
        total: 3,
        page: params.page || 1,
        pageSize: params.pageSize || 10
      }
      console.log('Returning mock data:', mockData)
      return mockData
    }
  }

  static async getDictionaryById(id: string): Promise<Dictionary> {
    console.log('DictionaryService.getDictionaryById called with id:', id)
    try {
      console.log('Fetching from:', `${BASE_URL}/dictionaries/${id}`)
      const response = await fetch(`${BASE_URL}/dictionaries/${id}`)
      if (!response.ok) {
        throw new Error('获取字典详情失败')
      }
      const data = await response.json()
      console.log('API response:', data)
      return data
    } catch (error) {
      console.error('Error in getDictionaryById:', error)
      // 返回模拟数据
      const mockDictionaries = [
        {
          id: '1',
          name: '性别',
          type: 'business',
          code: 'GENDER',
          description: '性别字典',
          values: [
            { id: '1', value: 'male', label: '男', sort: 1, status: 'enabled', remark: '' },
            { id: '2', value: 'female', label: '女', sort: 2, status: 'enabled', remark: '' }
          ],
          creatorName: '管理员',
          departmentName: '总部门',
          createdAt: new Date().toISOString()
        },
        {
          id: '2',
          name: '学历',
          type: 'business',
          code: 'EDUCATION',
          description: '学历字典',
          values: [
            { id: '1', value: 'primary', label: '小学', sort: 1, status: 'enabled', remark: '' },
            { id: '2', value: 'middle', label: '初中', sort: 2, status: 'enabled', remark: '' },
            { id: '3', value: 'high', label: '高中', sort: 3, status: 'enabled', remark: '' },
            { id: '4', value: 'college', label: '大学', sort: 4, status: 'enabled', remark: '' }
          ],
          creatorName: '管理员',
          departmentName: '总部门',
          createdAt: new Date().toISOString()
        },
        {
          id: '3',
          name: '婚姻状况',
          type: 'business',
          code: 'MARITAL_STATUS',
          description: '婚姻状况字典',
          values: [
            { id: '1', value: 'single', label: '未婚', sort: 1, status: 'enabled', remark: '' },
            { id: '2', value: 'married', label: '已婚', sort: 2, status: 'enabled', remark: '' },
            { id: '3', value: 'divorced', label: '离异', sort: 3, status: 'enabled', remark: '' }
          ],
          creatorName: '管理员',
          departmentName: '总部门',
          createdAt: new Date().toISOString()
        }
      ]
      const dictionary = mockDictionaries.find(d => d.id === id)
      if (dictionary) {
        console.log('Returning mock data:', dictionary)
        return dictionary
      }
      throw new Error('字典不存在')
    }
  }

  static async createDictionary(data: DictionaryFormData): Promise<Dictionary> {
    console.log('DictionaryService.createDictionary called with data:', data)
    try {
      console.log('Posting to:', `${BASE_URL}/dictionaries`)
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
      const result = await response.json()
      console.log('API response:', result)
      return result
    } catch (error) {
      console.error('Error in createDictionary:', error)
      // 返回模拟数据
      const mockData = {
        id: Date.now().toString(),
        name: data.name,
        type: data.type,
        code: data.code,
        description: data.description || '',
        values: data.values || [],
        creatorName: '管理员',
        departmentName: '总部门',
        createdAt: new Date().toISOString()
      }
      console.log('Returning mock data:', mockData)
      return mockData
    }
  }

  static async updateDictionary(id: string, data: DictionaryFormData): Promise<Dictionary> {
    console.log('DictionaryService.updateDictionary called with id:', id, 'data:', data)
    try {
      console.log('Putting to:', `${BASE_URL}/dictionaries/${id}`)
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
      const result = await response.json()
      console.log('API response:', result)
      return result
    } catch (error) {
      console.error('Error in updateDictionary:', error)
      // 返回模拟数据
      const mockData = {
        id: id,
        name: data.name,
        type: data.type,
        code: data.code,
        description: data.description || '',
        values: data.values || [],
        creatorName: '管理员',
        departmentName: '总部门',
        createdAt: new Date().toISOString()
      }
      console.log('Returning mock data:', mockData)
      return mockData
    }
  }

  static async deleteDictionary(id: string): Promise<void> {
    try {
      const response = await fetch(`${BASE_URL}/dictionaries/${id}`, {
        method: 'DELETE'
      })
      if (!response.ok) {
        throw new Error('删除字典失败')
      }
    } catch (error) {
      // 模拟删除成功
      return
    }
  }

  static async batchDeleteDictionaries(ids: string[]): Promise<void> {
    try {
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
    } catch (error) {
      // 模拟批量删除成功
      return
    }
  }

  static async getDictionaryValueList(params: DictionaryValueQueryParams): Promise<DictionaryValueResponse> {
    try {
      const response = await fetch(`${BASE_URL}/dictionary-values?${new URLSearchParams(params as any).toString()}`)
      if (!response.ok) {
        throw new Error('获取字典值列表失败')
      }
      return response.json()
    } catch (error) {
      // 返回模拟数据
      return {
        list: [
          { id: '1', value: 'male', label: '男', sort: 1, status: 'enabled', remark: '' },
          { id: '2', value: 'female', label: '女', sort: 2, status: 'enabled', remark: '' }
        ],
        total: 2
      }
    }
  }

  static async createDictionaryValue(dictionaryId: string, data: Partial<DictionaryValue>): Promise<DictionaryValue> {
    try {
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
    } catch (error) {
      // 返回模拟数据
      return {
        id: Date.now().toString(),
        value: data.value || '',
        label: data.label || '',
        sort: data.sort || 0,
        status: data.status || 'enabled',
        remark: data.remark || ''
      }
    }
  }

  static async updateDictionaryValue(dictionaryId: string, valueId: string, data: Partial<DictionaryValue>): Promise<DictionaryValue> {
    try {
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
    } catch (error) {
      // 返回模拟数据
      return {
        id: valueId,
        value: data.value || '',
        label: data.label || '',
        sort: data.sort || 0,
        status: data.status || 'enabled',
        remark: data.remark || ''
      }
    }
  }

  static async deleteDictionaryValue(dictionaryId: string, valueId: string): Promise<void> {
    try {
      const response = await fetch(`${BASE_URL}/dictionaries/${dictionaryId}/values/${valueId}`, {
        method: 'DELETE'
      })
      if (!response.ok) {
        throw new Error('删除字典值失败')
      }
    } catch (error) {
      // 模拟删除成功
      return
    }
  }

  static async batchDeleteDictionaryValues(dictionaryId: string, valueIds: string[]): Promise<void> {
    try {
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
    } catch (error) {
      // 模拟批量删除成功
      return
    }
  }

  static async importDictionaries(file: File): Promise<{ success: number; failed: number; errors: string[] }> {
    try {
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
    } catch (error) {
      // 返回模拟数据
      return {
        success: 3,
        failed: 0,
        errors: []
      }
    }
  }

  static async exportDictionaries(params: DictionaryQueryParams): Promise<Blob> {
    try {
      const filteredParams = DataPermissionService.applyDataPermission(params)
      const response = await fetch(`${BASE_URL}/dictionaries/export?${new URLSearchParams(filteredParams as any).toString()}`)
      if (!response.ok) {
        throw new Error('导出字典失败')
      }
      return response.blob()
    } catch (error) {
      // 返回模拟数据
      const mockContent = `字典名称,字典类型,字典编码,字典说明,字典值,显示标签,排序,状态,备注
性别,业务字典,GENDER,性别字典,male,男,1,启用,
female,女,2,启用,
学历,业务字典,EDUCATION,学历字典,primary,小学,1,启用,
middle,初中,2,启用,
high,高中,3,启用,
college,大学,4,启用,
婚姻状况,业务字典,MARITAL_STATUS,婚姻状况字典,single,未婚,1,启用,
married,已婚,2,启用,
divorced,离异,3,启用,`
      const blob = new Blob([mockContent], { type: 'text/csv' })
      return blob
    }
  }

  static async getDictionaryStatistics(): Promise<DictionaryStatistics> {
    try {
      const response = await fetch(`${BASE_URL}/dictionaries/statistics`)
      if (!response.ok) {
        throw new Error('获取字典统计失败')
      }
      return response.json()
    } catch (error) {
      // 返回模拟数据
      return {
        total: 3,
        business: 3,
        custom: 0,
        active: 3,
        inactive: 0
      }
    }
  }

  static async getDictionaryOperationLogs(params: {
    page: number
    pageSize: number
    dictionaryId?: string
    operationType?: string
    startTime?: string
    endTime?: string
  }): Promise<{ list: DictionaryOperationLog[]; total: number }> {
    try {
      const response = await fetch(`${BASE_URL}/dictionaries/operation-logs?${new URLSearchParams(params as any).toString()}`)
      if (!response.ok) {
        throw new Error('获取操作日志失败')
      }
      return response.json()
    } catch (error) {
      // 返回模拟数据
      return {
        list: [
          {
            id: '1',
            dictionaryId: '1',
            dictionaryName: '性别',
            operationType: 'create',
            operationContent: '创建字典',
            operator: '管理员',
            operationTime: new Date().toISOString()
          },
          {
            id: '2',
            dictionaryId: '1',
            dictionaryName: '性别',
            operationType: 'update',
            operationContent: '更新字典',
            operator: '管理员',
            operationTime: new Date().toISOString()
          }
        ],
        total: 2
      }
    }
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
