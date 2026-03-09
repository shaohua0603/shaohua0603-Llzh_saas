// 生活费相关API
import type { LivingExpenseRecord } from '../types/livingExpense'

// 生成模拟数据
export const generateMockData = (): LivingExpenseRecord[] => {
  const names = ['张三', '李四', '王五', '赵六', '孙七', '周八', '吴九', '郑十', '钱十一', '陈十二']
  const statuses: LivingExpenseRecord['status'][] = ['pending', 'approved', 'rejected', 'issued']
  const data: LivingExpenseRecord[] = []

  for (let i = 0; i < 50; i++) {
    const status = statuses[Math.floor(Math.random() * statuses.length)]
    const applyDate = new Date()
    applyDate.setDate(applyDate.getDate() - Math.floor(Math.random() * 30))

    // 生成审核记录
    const approvalRecords = status !== 'pending' ? [{
      nodeId: `NODE${i + 1}`,
      nodeName: '主管审核',
      approver: '审核员' + (i % 5 + 1),
      approvalTime: new Date(applyDate.getTime() + 86400000).toISOString(),
      approvalResult: status === 'approved' ? 'approved' : 'rejected',
      approvalComment: status === 'approved' ? '同意发放' : '申请金额超出可发放范围'
    }] : undefined

    data.push({
      id: `LE${String(i + 1).padStart(6, '0')}`,
      workerName: names[Math.floor(Math.random() * names.length)],
      phone: `138${Math.floor(Math.random() * 100000000).toString().padStart(8, '0')}`,
      amount: Math.floor(Math.random() * 500 + 100),
      status,
      applyDate: applyDate.toISOString().split('T')[0],
      issueDate: status === 'issued' ? new Date(applyDate.getTime() + 86400000).toISOString().split('T')[0] : undefined,
      description: '日常生活费用申请',
      rejectReason: status === 'rejected' ? '申请金额超出可发放范围' : undefined,
      approvalRecords
    })
  }

  return data
}

// 所有模拟数据
let allData: LivingExpenseRecord[] = generateMockData()

// 获取生活费列表
export const fetchLivingExpenseList = (params: any) => {
  let filteredData = [...allData]

  // 模拟过滤
  if (params.keyword) {
    const keyword = params.keyword.toLowerCase()
    filteredData = filteredData.filter(
      item =>
        item.workerName.toLowerCase().includes(keyword) ||
        item.phone.includes(keyword)
    )
  }

  if (params.status) {
    filteredData = filteredData.filter(item => item.status === params.status)
  }

  if (params.dateRange && params.dateRange.length === 2) {
    filteredData = filteredData.filter(item => {
      return item.applyDate >= params.dateRange[0] && item.applyDate <= params.dateRange[1]
    })
  }

  // 模拟分页
  const start = (params.page - 1) * params.pageSize
  const end = start + params.pageSize
  const list = filteredData.slice(start, end)

  return {
    code: 200,
    message: 'success',
    data: {
      list,
      total: filteredData.length
    }
  }
}

// 获取生活费详情
export const fetchLivingExpenseDetail = (id: string) => {
  const data = allData.find(item => item.id === id)
  return {
    code: 200,
    message: 'success',
    data
  }
}

// 更新生活费状态
export const updateLivingExpenseStatus = (id: string, status: LivingExpenseRecord['status'], data?: any) => {
  const index = allData.findIndex(item => item.id === id)
  if (index > -1) {
    allData[index].status = status
    if (status === 'rejected' && data?.reason) {
      allData[index].rejectReason = data.reason
    }
    if (status === 'issued' && data?.issueDate) {
      allData[index].issueDate = data.issueDate
    }
    if (data?.remark) {
      allData[index].remark = data.remark
    }
    
    // 添加审核记录
    if ((status === 'approved' || status === 'rejected') && (data?.reason || data?.comment)) {
      if (!allData[index].approvalRecords) {
        allData[index].approvalRecords = []
      }
      allData[index].approvalRecords.push({
        nodeId: `NODE${Date.now()}`,
        nodeName: '主管审核',
        approver: '当前审核员',
        approvalTime: new Date().toISOString(),
        approvalResult: status === 'approved' ? 'approved' : 'rejected',
        approvalComment: status === 'approved' ? (data?.comment || '同意发放') : (data?.reason || '驳回')
      })
    }
  }
  return {
    code: 200,
    message: 'success'
  }
}

// 删除生活费记录
export const deleteLivingExpense = (id: string) => {
  const index = allData.findIndex(item => item.id === id)
  if (index > -1) {
    allData.splice(index, 1)
  }
  return {
    code: 200,
    message: 'success'
  }
}

// 批量更新生活费状态
export const batchUpdateLivingExpenseStatus = (ids: string[], status: LivingExpenseRecord['status'], data?: any) => {
  ids.forEach(id => {
    const index = allData.findIndex(item => item.id === id)
    if (index > -1) {
      allData[index].status = status
      if (status === 'issued' && data?.issueDate) {
        allData[index].issueDate = data.issueDate
      }
    }
  })
  return {
    code: 200,
    message: 'success'
  }
}
