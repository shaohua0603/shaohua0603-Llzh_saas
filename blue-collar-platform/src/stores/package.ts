import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import * as packageApi from '@/api/system/packageApi'
import type {
  Package,
  PackageQueryParams,
  PackageFormData,
  PackageDetail
} from '@/types/system/packageTypes'

export const usePackageStore = defineStore('package', () => {
  const packageList = ref<Package[]>([])
  const currentPackage = ref<PackageDetail | null>(null)
  const loading = ref(false)
  const total = ref(0)
  const currentPage = ref(1)
  const pageSize = ref(10)

  const queryParams = ref<PackageQueryParams>({
    page: 1,
    pageSize: 10
  })

  const hasMore = computed(() => {
    return currentPage.value * pageSize.value < total.value
  })

  const totalPages = computed(() => {
    return Math.ceil(total.value / pageSize.value)
  })

  /**
   * 获取套餐列表
   * @param params 查询参数
   */
  const fetchPackageList = async (params?: Partial<PackageQueryParams>) => {
    loading.value = true
    try {
      const mergedParams = {
        ...queryParams.value,
        ...params,
        page: params?.page || currentPage.value,
        pageSize: params?.pageSize || pageSize.value
      }
      queryParams.value = mergedParams as PackageQueryParams

      const response = await packageApi.getPackageList(mergedParams)
      packageList.value = response.list
      total.value = response.total
      currentPage.value = response.page
      pageSize.value = response.pageSize
    } catch (error) {
      console.error('获取套餐列表失败:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  /**
   * 获取套餐详情
   * @param id 套餐ID
   */
  const fetchPackageDetail = async (id: string) => {
    loading.value = true
    try {
      const packageDetail: PackageDetail = await packageApi.getPackageDetail(id)
      currentPackage.value = packageDetail
      return packageDetail
    } catch (error) {
      console.error('获取套餐详情失败:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  /**
   * 创建套餐
   * @param data 套餐表单数据
   */
  const createPackage = async (data: PackageFormData) => {
    loading.value = true
    try {
      const packageInfo: Package = await packageApi.createPackage(data)
      packageList.value.unshift(packageInfo)
      total.value += 1
      return packageInfo
    } catch (error) {
      console.error('创建套餐失败:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  /**
   * 更新套餐
   * @param id 套餐ID
   * @param data 套餐表单数据
   */
  const updatePackage = async (id: string, data: PackageFormData) => {
    loading.value = true
    try {
      const packageInfo: Package = await packageApi.updatePackage(id, data)
      const index = packageList.value.findIndex(p => p.id === id)
      if (index !== -1) {
        packageList.value[index] = packageInfo
      }
      if (currentPackage.value?.id === id) {
        currentPackage.value = { ...currentPackage.value, ...packageInfo } as PackageDetail
      }
      return packageInfo
    } catch (error) {
      console.error('更新套餐失败:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  /**
   * 删除套餐
   * @param id 套餐ID
   */
  const deletePackage = async (id: string) => {
    loading.value = true
    try {
      await packageApi.deletePackage(id)
      const index = packageList.value.findIndex(p => p.id === id)
      if (index !== -1) {
        packageList.value.splice(index, 1)
        total.value -= 1
      }
      if (currentPackage.value?.id === id) {
        currentPackage.value = null
      }
    } catch (error) {
      console.error('删除套餐失败:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  /**
   * 批量删除套餐
   * @param ids 套餐ID数组
   */
  const batchDeletePackages = async (ids: string[]) => {
    loading.value = true
    try {
      await packageApi.batchDeletePackages(ids)
      ids.forEach(id => {
        const index = packageList.value.findIndex(p => p.id === id)
        if (index !== -1) {
          packageList.value.splice(index, 1)
          total.value -= 1
        }
      })
      if (currentPackage.value && ids.includes(currentPackage.value.id)) {
        currentPackage.value = null
      }
    } catch (error) {
      console.error('批量删除套餐失败:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  /**
   * 导出套餐列表
   * @param params 查询参数
   */
  const exportPackages = async (params?: Partial<PackageQueryParams>) => {
    loading.value = true
    try {
      const mergedParams = {
        ...queryParams.value,
        ...params
      }
      const blob = await packageApi.exportPackages(mergedParams as PackageQueryParams)
      return blob
    } catch (error) {
      console.error('导出套餐失败:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  /**
   * 启用套餐
   * @param id 套餐ID
   */
  const enablePackage = async (id: string) => {
    loading.value = true
    try {
      const packageInfo: Package = await packageApi.enablePackage(id)
      const index = packageList.value.findIndex(p => p.id === id)
      if (index !== -1) {
        packageList.value[index] = packageInfo
      }
      if (currentPackage.value?.id === id) {
        currentPackage.value = { ...currentPackage.value, ...packageInfo } as PackageDetail
      }
      return packageInfo
    } catch (error) {
      console.error('启用套餐失败:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  /**
   * 禁用套餐
   * @param id 套餐ID
   */
  const disablePackage = async (id: string) => {
    loading.value = true
    try {
      const packageInfo: Package = await packageApi.disablePackage(id)
      const index = packageList.value.findIndex(p => p.id === id)
      if (index !== -1) {
        packageList.value[index] = packageInfo
      }
      if (currentPackage.value?.id === id) {
        currentPackage.value = { ...currentPackage.value, ...packageInfo } as PackageDetail
      }
      return packageInfo
    } catch (error) {
      console.error('禁用套餐失败:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  /**
   * 检查套餐名称是否重复
   * @param packageName 套餐名称
   * @param id 套餐ID(编辑时传入)
   */
  const checkPackageName = async (packageName: string, id?: string) => {
    try {
      const exists = await packageApi.checkPackageName(packageName, id)
      return exists
    } catch (error) {
      console.error('检查套餐名称失败:', error)
      throw error
    }
  }

  /**
   * 重置查询参数
   */
  const resetQueryParams = () => {
    queryParams.value = {
      page: 1,
      pageSize: 10
    }
    currentPage.value = 1
    pageSize.value = 10
  }

  /**
   * 清空当前套餐
   */
  const clearCurrentPackage = () => {
    currentPackage.value = null
  }

  return {
    packageList,
    currentPackage,
    loading,
    total,
    currentPage,
    pageSize,
    queryParams,
    hasMore,
    totalPages,
    fetchPackageList,
    fetchPackageDetail,
    createPackage,
    updatePackage,
    deletePackage,
    batchDeletePackages,
    exportPackages,
    enablePackage,
    disablePackage,
    checkPackageName,
    resetQueryParams,
    clearCurrentPackage
  }
})
