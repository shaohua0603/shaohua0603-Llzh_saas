/**
 * 费用查询模块API接口
 */
import request from '@/utils/request'
import type {
  ApiResponse,
  PageResponse,
  PageQueryParams,
  ImportResponse,
  ExportResponse,
} from '@/types/response'
import type {
  ExpenseRecord,
  ExpenseQueryParams,
  ExpenseImportData,
  ExpenseImportResult,
} from '@/types/operations/expense'

/**
 * 费用查询API
 */
export const expenseApi = {
  /**
   * 获取费用记录列表
   */
  getExpenseList: (params: ExpenseQueryParams): Promise<PageResponse<ExpenseRecord>> => {
    return request.get('/api/v1/admin/operations/expense', { params })
  },

  /**
   * 获取费用记录详情
   */
  getExpenseDetail: (id: number): Promise<ApiResponse<ExpenseRecord>> => {
    return request.get(`/api/v1/admin/operations/expense/${id}`)
  },

  /**
   * 导入费用记录
   */
  importExpense: (file: File): Promise<ApiResponse<ExpenseImportResult>> => {
    const formData = new FormData()
    formData.append('file', file)
    return request.post('/api/v1/admin/operations/expense/import', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  },

  /**
   * 下载费用导入模板
   */
  downloadImportTemplate: (): Promise<Blob> => {
    return request.get('/api/v1/admin/operations/expense/import-template', {
      responseType: 'blob'
    })
  },

  /**
   * 导出费用记录
   */
  exportExpense: (params: ExpenseQueryParams): Promise<ExportResponse> => {
    return request.get('/api/v1/admin/operations/expense/export', { params })
  },
}
