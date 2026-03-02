import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import * as positionApi from '@/api/system/positionApi'
import type {
  Position,
  PositionQueryParams,
  PositionFormData,
  PositionDetail
} from '@/types/system/positionTypes'

export const usePositionStore = defineStore('position', () => {
  const positionList = ref<Position[]>([])
  const currentPosition = ref<PositionDetail | null>(null)
  const loading = ref(false)
  const total = ref(0)
  const currentPage = ref(1)
  const pageSize = ref(10)

  const queryParams = ref<PositionQueryParams>({
    page: 1,
    pageSize: 10
  })

  const hasMore = computed(() => {
    return currentPage.value * pageSize.value < total.value
  })

  const totalPages = computed(() => {
    return Math.ceil(total.value / pageSize.value)
  })

  const fetchPositionList = async (params?: Partial<PositionQueryParams>) => {
    loading.value = true
    try {
      const mergedParams = {
        ...queryParams.value,
        ...params,
        page: params?.page || currentPage.value,
        pageSize: params?.pageSize || pageSize.value
      }
      queryParams.value = mergedParams as PositionQueryParams

      const response = await positionApi.getPositionList(mergedParams)
      positionList.value = response.list
      total.value = response.total
      currentPage.value = response.page
      pageSize.value = response.pageSize
    } catch (error) {
      console.error('获取岗位列表失败:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  const fetchPositionDetail = async (id: string) => {
    loading.value = true
    try {
      const position: PositionDetail = await positionApi.getPositionDetail(id)
      currentPosition.value = position
      return position
    } catch (error) {
      console.error('获取岗位详情失败:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  const createPosition = async (data: PositionFormData) => {
    loading.value = true
    try {
      const position: Position = await positionApi.createPosition(data)
      positionList.value.unshift(position)
      total.value += 1
      return position
    } catch (error) {
      console.error('创建岗位失败:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  const updatePosition = async (id: string, data: PositionFormData) => {
    loading.value = true
    try {
      const position: Position = await positionApi.updatePosition(id, data)
      const index = positionList.value.findIndex(p => p.id === id)
      if (index !== -1) {
        positionList.value[index] = position
      }
      if (currentPosition.value?.id === id) {
        currentPosition.value = { ...currentPosition.value, ...position } as PositionDetail
      }
      return position
    } catch (error) {
      console.error('更新岗位失败:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  const deletePosition = async (id: string) => {
    loading.value = true
    try {
      await positionApi.deletePosition(id)
      const index = positionList.value.findIndex(p => p.id === id)
      if (index !== -1) {
        positionList.value.splice(index, 1)
        total.value -= 1
      }
      if (currentPosition.value?.id === id) {
        currentPosition.value = null
      }
    } catch (error) {
      console.error('删除岗位失败:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  const batchDeletePositions = async (ids: string[]) => {
    loading.value = true
    try {
      await positionApi.batchDeletePositions(ids)
      ids.forEach(id => {
        const index = positionList.value.findIndex(p => p.id === id)
        if (index !== -1) {
          positionList.value.splice(index, 1)
          total.value -= 1
        }
      })
      if (currentPosition.value && ids.includes(currentPosition.value.id)) {
        currentPosition.value = null
      }
    } catch (error) {
      console.error('批量删除岗位失败:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  const exportPositions = async (params?: Partial<PositionQueryParams>) => {
    loading.value = true
    try {
      const mergedParams = {
        ...queryParams.value,
        ...params
      }
      const blob = await positionApi.exportPositions(mergedParams as PositionQueryParams)
      return blob
    } catch (error) {
      console.error('导出岗位失败:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  const checkPositionName = async (positionName: string, id?: string) => {
    try {
      const exists = await positionApi.checkPositionName(positionName, id)
      return exists
    } catch (error) {
      console.error('检查岗位名称失败:', error)
      throw error
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

  const clearCurrentPosition = () => {
    currentPosition.value = null
  }

  return {
    positionList,
    currentPosition,
    loading,
    total,
    currentPage,
    pageSize,
    queryParams,
    hasMore,
    totalPages,
    fetchPositionList,
    fetchPositionDetail,
    createPosition,
    updatePosition,
    deletePosition,
    batchDeletePositions,
    exportPositions,
    checkPositionName,
    resetQueryParams,
    clearCurrentPosition
  }
})
