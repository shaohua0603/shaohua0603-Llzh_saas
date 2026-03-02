import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import DictionaryService from '@/services/dictionaryService'
import type {
  Dictionary,
  DictionaryQueryParams,
  DictionaryResponse,
  DictionaryValue,
  DictionaryValueQueryParams,
  DictionaryValueResponse,
  DictionaryFormData,
  DictionaryStatistics
} from '@/types/dictionary'

export const useDictionaryStore = defineStore('dictionary', () => {
  const dictionaries = ref<Dictionary[]>([])
  const currentDictionary = ref<Dictionary | null>(null)
  const dictionaryValues = ref<DictionaryValue[]>([])
  const statistics = ref<DictionaryStatistics | null>(null)
  
  const loading = ref(false)
  const total = ref(0)
  const currentPage = ref(1)
  const pageSize = ref(10)

  const queryParams = ref<DictionaryQueryParams>({
    page: 1,
    pageSize: 10
  })

  const hasMore = computed(() => {
    return currentPage.value * pageSize.value < total.value
  })

  const totalPages = computed(() => {
    return Math.ceil(total.value / pageSize.value)
  })

  const fetchDictionaryList = async (params?: Partial<DictionaryQueryParams>) => {
    loading.value = true
    try {
      const mergedParams = {
        ...queryParams.value,
        ...params,
        page: params?.page || currentPage.value,
        pageSize: params?.pageSize || pageSize.value
      }
      queryParams.value = mergedParams as DictionaryQueryParams
      
      const response: DictionaryResponse = await DictionaryService.getDictionaryList(mergedParams)
      dictionaries.value = response.list
      total.value = response.total
      currentPage.value = response.page
      pageSize.value = response.pageSize
    } catch (error) {
      console.error('获取字典列表失败:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  const fetchDictionaryById = async (id: string) => {
    loading.value = true
    try {
      const dictionary: Dictionary = await DictionaryService.getDictionaryById(id)
      currentDictionary.value = dictionary
      return dictionary
    } catch (error) {
      console.error('获取字典详情失败:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  const createDictionary = async (data: DictionaryFormData) => {
    loading.value = true
    try {
      const dictionary: Dictionary = await DictionaryService.createDictionary(data)
      dictionaries.value.unshift(dictionary)
      total.value += 1
      return dictionary
    } catch (error) {
      console.error('创建字典失败:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  const updateDictionary = async (id: string, data: DictionaryFormData) => {
    loading.value = true
    try {
      const dictionary: Dictionary = await DictionaryService.updateDictionary(id, data)
      const index = dictionaries.value.findIndex(d => d.id === id)
      if (index !== -1) {
        dictionaries.value[index] = dictionary
      }
      if (currentDictionary.value?.id === id) {
        currentDictionary.value = dictionary
      }
      return dictionary
    } catch (error) {
      console.error('更新字典失败:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  const deleteDictionary = async (id: string) => {
    loading.value = true
    try {
      await DictionaryService.deleteDictionary(id)
      const index = dictionaries.value.findIndex(d => d.id === id)
      if (index !== -1) {
        dictionaries.value.splice(index, 1)
        total.value -= 1
      }
      if (currentDictionary.value?.id === id) {
        currentDictionary.value = null
      }
    } catch (error) {
      console.error('删除字典失败:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  const batchDeleteDictionaries = async (ids: string[]) => {
    loading.value = true
    try {
      await DictionaryService.batchDeleteDictionaries(ids)
      ids.forEach(id => {
        const index = dictionaries.value.findIndex(d => d.id === id)
        if (index !== -1) {
          dictionaries.value.splice(index, 1)
          total.value -= 1
        }
      })
      if (currentDictionary.value && ids.includes(currentDictionary.value.id)) {
        currentDictionary.value = null
      }
    } catch (error) {
      console.error('批量删除字典失败:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  const fetchDictionaryValues = async (params: DictionaryValueQueryParams) => {
    loading.value = true
    try {
      const response: DictionaryValueResponse = await DictionaryService.getDictionaryValueList(params)
      dictionaryValues.value = response.list
      return response
    } catch (error) {
      console.error('获取字典值列表失败:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  const createDictionaryValue = async (dictionaryId: string, data: Partial<DictionaryValue>) => {
    loading.value = true
    try {
      const value: DictionaryValue = await DictionaryService.createDictionaryValue(dictionaryId, data)
      dictionaryValues.value.push(value)
      return value
    } catch (error) {
      console.error('创建字典值失败:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  const updateDictionaryValue = async (dictionaryId: string, valueId: string, data: Partial<DictionaryValue>) => {
    loading.value = true
    try {
      const value: DictionaryValue = await DictionaryService.updateDictionaryValue(dictionaryId, valueId, data)
      const index = dictionaryValues.value.findIndex(v => v.id === valueId)
      if (index !== -1) {
        dictionaryValues.value[index] = value
      }
      return value
    } catch (error) {
      console.error('更新字典值失败:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  const deleteDictionaryValue = async (dictionaryId: string, valueId: string) => {
    loading.value = true
    try {
      await DictionaryService.deleteDictionaryValue(dictionaryId, valueId)
      const index = dictionaryValues.value.findIndex(v => v.id === valueId)
      if (index !== -1) {
        dictionaryValues.value.splice(index, 1)
      }
    } catch (error) {
      console.error('删除字典值失败:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  const batchDeleteDictionaryValues = async (dictionaryId: string, valueIds: string[]) => {
    loading.value = true
    try {
      await DictionaryService.batchDeleteDictionaryValues(dictionaryId, valueIds)
      valueIds.forEach(valueId => {
        const index = dictionaryValues.value.findIndex(v => v.id === valueId)
        if (index !== -1) {
          dictionaryValues.value.splice(index, 1)
        }
      })
    } catch (error) {
      console.error('批量删除字典值失败:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  const fetchStatistics = async () => {
    loading.value = true
    try {
      const stats: DictionaryStatistics = await DictionaryService.getDictionaryStatistics()
      statistics.value = stats
      return stats
    } catch (error) {
      console.error('获取字典统计失败:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  const importDictionaries = async (file: File) => {
    loading.value = true
    try {
      const result = await DictionaryService.importDictionaries(file)
      await fetchDictionaryList()
      return result
    } catch (error) {
      console.error('导入字典失败:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  const exportDictionaries = async (params?: Partial<DictionaryQueryParams>) => {
    loading.value = true
    try {
      const mergedParams = {
        ...queryParams.value,
        ...params
      }
      const blob = await DictionaryService.exportDictionaries(mergedParams as DictionaryQueryParams)
      return blob
    } catch (error) {
      console.error('导出字典失败:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  const resetQueryParams = () => {
    queryParams.value = {
      page: 1,
      pageSize: 10
    }
    currentPage.value = 1
    pageSize.value = 10
  }

  const clearCurrentDictionary = () => {
    currentDictionary.value = null
  }

  const clearDictionaryValues = () => {
    dictionaryValues.value = []
  }

  return {
    dictionaries,
    currentDictionary,
    dictionaryValues,
    statistics,
    loading,
    total,
    currentPage,
    pageSize,
    queryParams,
    hasMore,
    totalPages,
    fetchDictionaryList,
    fetchDictionaryById,
    createDictionary,
    updateDictionary,
    deleteDictionary,
    batchDeleteDictionaries,
    fetchDictionaryValues,
    createDictionaryValue,
    updateDictionaryValue,
    deleteDictionaryValue,
    batchDeleteDictionaryValues,
    fetchStatistics,
    importDictionaries,
    exportDictionaries,
    resetQueryParams,
    clearCurrentDictionary,
    clearDictionaryValues
  }
})
