import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import type { Contract, ContractQueryParams, ContractFormData, AvailableWorker } from '@/types/contract'
import { exportExcelWithWatermark, getWatermarkText } from '@/utils/exportUtil'
import {
  getContractList,
  getContractDetail,
  createContract as createContractApi,
  updateContract as updateContractApi,
  deleteContract as deleteContractApi,
  batchDeleteContracts,
  exportContracts,
  importContracts,
  getAvailableWorkers,
  generateContractNo
} from '@/api/contract'

export const useContractStore = defineStore('contract', () => {
  const contractList = ref<Contract[]>([])
  const contractDetail = ref<Contract | null>(null)
  const loading = ref(false)
  const total = ref(0)
  const currentPage = ref(1)
  const pageSize = ref(20)

  const totalPages = computed(() => Math.ceil(total.value / pageSize.value))

  async function fetchContractList(params: ContractQueryParams) {
    loading.value = true
    try {
      const response = await getContractList(params)
      if (response.code === 200) {
        contractList.value = response.data.list
        total.value = response.data.total
        currentPage.value = response.data.page
        pageSize.value = response.data.pageSize
      }
    } catch (error) {
      ElMessage.error('获取合同列表失败')
    } finally {
      loading.value = false
    }
  }

  async function fetchContractDetail(id: string) {
    loading.value = true
    try {
      const response = await getContractDetail(id)
      if (response.code === 200) {
        contractDetail.value = response.data
      }
    } catch (error) {
      ElMessage.error('获取合同详情失败')
    } finally {
      loading.value = false
    }
  }

  async function createContract(data: ContractFormData) {
    try {
      const response = await createContractApi(data)
      if (response.code === 201 || response.code === 200) {
        ElMessage.success('创建成功')
        return response.data
      }
    } catch (error) {
      ElMessage.error('创建失败')
      throw error
    }
  }

  async function updateContract(id: string, data: Partial<ContractFormData>) {
    try {
      const response = await updateContractApi(id, data)
      if (response.code === 200) {
        ElMessage.success('更新成功')
        return response.data
      }
    } catch (error) {
      ElMessage.error('更新失败')
      throw error
    }
  }

  async function deleteContract(id: string) {
    try {
      const response = await deleteContractApi(id)
      if (response.code === 200) {
        ElMessage.success('删除成功')
      }
    } catch (error) {
      ElMessage.error('删除失败')
      throw error
    }
  }

  async function batchDeleteContract(ids: string[]) {
    try {
      const response = await batchDeleteContracts(ids)
      if (response.code === 200) {
        ElMessage.success(`成功删除${response.data.successCount}条，失败${response.data.failCount}条`)
        return response.data
      }
    } catch (error) {
      ElMessage.error('批量删除失败')
      throw error
    }
  }

  async function exportContract(filters?: any, fields?: string[]) {
    try {
      // 从localStorage获取用户信息
      const storedUserInfo = localStorage.getItem('userInfo')
      const userInfo = storedUserInfo ? JSON.parse(storedUserInfo) : null
      
      // 定义表头
      const headers = {
        contractNo: '合同编号',
        workerName: '工人姓名',
        factoryName: '工厂名称',
        startDate: '开始日期',
        endDate: '结束日期',
        status: '状态'
      }
      
      // 获取水印文本
      const watermark = getWatermarkText(userInfo)
      
      // 导出Excel文件
      const success = exportExcelWithWatermark(contractList.value, headers, '合同列表', watermark)
      
      if (success) {
        ElMessage.success('导出成功')
      } else {
        ElMessage.error('导出失败')
      }
    } catch (error) {
      ElMessage.error('导出失败')
      throw error
    }
  }

  async function importContract(file: File) {
    try {
      const response = await importContracts(file)
      if (response.code === 200) {
        ElMessage.success(`成功导入${response.data.successCount}条，失败${response.data.failCount}条`)
        return response.data
      }
    } catch (error) {
      ElMessage.error('导入失败')
      throw error
    }
  }

  async function fetchAvailableWorkers(params: { page: number; pageSize: number; keyword?: string }) {
    try {
      const response = await getAvailableWorkers(params)
      if (response.code === 200) {
        return response.data
      }
    } catch (error) {
      ElMessage.error('获取工人信息失败')
      throw error
    }
  }

  async function generateNo() {
    try {
      const response = await generateContractNo()
      if (response.code === 200) {
        return response.data.contractNo
      }
    } catch (error) {
      ElMessage.error('生成合同编号失败')
      throw error
    }
  }

  function reset() {
    contractList.value = []
    contractDetail.value = null
    loading.value = false
    total.value = 0
    currentPage.value = 1
    pageSize.value = 20
  }

  return {
    contractList,
    contractDetail,
    loading,
    total,
    currentPage,
    pageSize,
    totalPages,
    fetchContractList,
    fetchContractDetail,
    createContract,
    updateContract,
    deleteContract,
    batchDeleteContract,
    exportContract,
    importContract,
    fetchAvailableWorkers,
    generateNo,
    reset
  }
})