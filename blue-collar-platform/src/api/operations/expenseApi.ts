/**
 * 费用查询模块API接口
 */
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

// 模拟延迟
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

// Mock数据
const mockExpenses: ExpenseRecord[] = [
  {
    id: 1,
    expenseType: '交通费用',
    amount: 100.5,
    occurrenceDate: '2024-03-01',
    description: '打车费用',
    submitter: '张三',
    submitTime: '2024-03-02 10:00:00',
    status: 'APPROVED',
    approvalTime: '2024-03-03 10:00:00',
    approver: '李四'
  },
  {
    id: 2,
    expenseType: '餐饮费用',
    amount: 200.0,
    occurrenceDate: '2024-03-02',
    description: '客户聚餐',
    submitter: '王五',
    submitTime: '2024-03-03 10:00:00',
    status: 'PENDING',
    approvalTime: null,
    approver: null
  },
  {
    id: 3,
    expenseType: '办公用品',
    amount: 50.0,
    occurrenceDate: '2024-03-03',
    description: '打印纸',
    submitter: '赵六',
    submitTime: '2024-03-04 10:00:00',
    status: 'APPROVED',
    approvalTime: '2024-03-05 10:00:00',
    approver: '李四'
  }
]

/**
 * 费用查询API
 */
export const expenseApi = {
  /**
   * 获取费用记录列表
   */
  getExpenseList: async (params: ExpenseQueryParams): Promise<ApiResponse<PageResponse<ExpenseRecord>>> => {
    await delay(500)
    let filteredExpenses = [...mockExpenses]
    
    if (params.expenseType) {
      filteredExpenses = filteredExpenses.filter(e => e.expenseType === params.expenseType)
    }
    
    if (params.status) {
      filteredExpenses = filteredExpenses.filter(e => e.status === params.status)
    }
    
    if (params.startDate) {
      filteredExpenses = filteredExpenses.filter(e => e.occurrenceDate >= params.startDate)
    }
    
    if (params.endDate) {
      filteredExpenses = filteredExpenses.filter(e => e.occurrenceDate <= params.endDate)
    }
    
    if (params.submitter) {
      filteredExpenses = filteredExpenses.filter(e => e.submitter.includes(params.submitter))
    }
    
    const page = params.page || 1
    const pageSize = params.pageSize || 10
    const start = (page - 1) * pageSize
    const end = start + pageSize
    
    return {
      code: 200,
      message: '成功',
      data: {
        list: filteredExpenses.slice(start, end),
        total: filteredExpenses.length,
        page,
        pageSize
      },
      timestamp: Date.now()
    }
  },

  /**
   * 获取费用记录详情
   */
  getExpenseDetail: async (id: number): Promise<ApiResponse<ExpenseRecord>> => {
    await delay(300)
    const expense = mockExpenses.find(e => e.id === id)
    if (!expense) {
      return {
        code: 404,
        message: '费用记录不存在',
        data: null,
        timestamp: Date.now()
      }
    }
    return {
      code: 200,
      message: '成功',
      data: expense,
      timestamp: Date.now()
    }
  },

  /**
   * 导入费用记录
   */
  importExpense: async (file: File): Promise<ApiResponse<ExpenseImportResult>> => {
    await delay(500)
    return {
      code: 200,
      message: '成功',
      data: {
        successCount: 10,
        failCount: 0,
        failRecords: []
      },
      timestamp: Date.now()
    }
  },

  /**
   * 下载费用导入模板
   */
  downloadImportTemplate: async (): Promise<Blob> => {
    await delay(300)
    // 模拟导出文件
    const blob = new Blob(['导入模板数据'], { type: 'application/vnd.ms-excel' })
    return blob
  },

  /**
   * 导出费用记录
   */
  exportExpense: async (params: ExpenseQueryParams): Promise<ApiResponse<Blob>> => {
    await delay(500)
    // 模拟导出文件
    const blob = new Blob(['导出数据'], { type: 'application/vnd.ms-excel' })
    return {
      code: 200,
      message: '成功',
      data: blob,
      timestamp: Date.now()
    }
  },
}
