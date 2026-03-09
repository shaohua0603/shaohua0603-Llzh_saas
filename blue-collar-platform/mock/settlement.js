import Mock from 'mockjs'

// 工作转介绍数据
const jobReferrals = Mock.mock({
  'list|50': [
    {
      'id|+1': 1,
      'referredName': '@cname',
      'referredPhone': /^1[3-9]\d{9}$/,
      'introduceDate': '@datetime("yyyy-MM-dd")',
      'entryDate': '@datetime("yyyy-MM-dd")',
      'introducerName': '@cname',
      'introducerPhone': /^1[3-9]\d{9}$/,
      'commissionPaid|0-1000': 0,
      'status|1': ['pending', 'employed', 'left'],
      'statusText': function() {
        const statusMap = {
          'pending': '待进厂',
          'employed': '已进厂',
          'left': '已离职'
        }
        return statusMap[this.status]
      },
      'tenantName': '@ctitle(2, 4)',
      'createdAt': '@datetime',
      'updatedAt': '@datetime'
    }
  ]
})

// 佣金发放数据
const commissionPayments = Mock.mock({
  'list|50': [
    {
      'id|+1': 1,
      'referredName': '@cname',
      'referredPhone': /^1[3-9]\d{9}$/,
      'introduceDate': '@datetime("yyyy-MM-dd")',
      'entryDate': '@datetime("yyyy-MM-dd")',
      'introducerName': '@cname',
      'introducerPhone': /^1[3-9]\d{9}$/,
      'commissionAmount|100-500': 200,
      'status|1': ['pending', 'paid'],
      'statusText': function() {
        const statusMap = {
          'pending': '待发放',
          'paid': '已发放'
        }
        return statusMap[this.status]
      },
      'payTime': function() {
        return this.status === 'paid' ? '@datetime("yyyy-MM-dd HH:mm:ss")' : '-'
      },
      'tenantName': '@ctitle(2, 4)',
      'createdAt': '@datetime',
      'updatedAt': '@datetime'
    }
  ]
})

// 拉新奖励数据
const referralRewards = Mock.mock({
  'list|50': [
    {
      'id|+1': 1,
      'referredName': '@cname',
      'referredPhone': /^1[3-9]\d{9}$/,
      'introduceDate': '@datetime("yyyy-MM-dd")',
      'entryDate': '@datetime("yyyy-MM-dd")',
      'introducerName': '@cname',
      'introducerPhone': /^1[3-9]\d{9}$/,
      'rewardAmount|200-500': 300,
      'status|1': ['pending', 'paid'],
      'statusText': function() {
        const statusMap = {
          'pending': '待发放',
          'paid': '已发放'
        }
        return statusMap[this.status]
      },
      'payTime': function() {
        return this.status === 'paid' ? '@datetime("yyyy-MM-dd HH:mm:ss")' : '-'
      },
      'tenantName': '@ctitle(2, 4)',
      'createdAt': '@datetime',
      'updatedAt': '@datetime'
    }
  ]
})

// 佣金规则配置
const commissionRule = {
  id: '1',
  daysRequired: 30,
  daily: {
    firstAmount: 100,
    secondAmount: 100,
    thirdAmount: 100,
    subsequentAmount: 50
  },
  monthly: {
    firstAmount: 200,
    secondAmount: 200,
    thirdAmount: 200,
    subsequentAmount: 100
  },
  createdAt: '@datetime',
  updatedAt: '@datetime'
}

// 分页函数
function paginate(list, page, pageSize) {
  const start = (page - 1) * pageSize
  const end = start + pageSize
  return {
    list: list.slice(start, end),
    total: list.length,
    page,
    pageSize,
    totalPages: Math.ceil(list.length / pageSize)
  }
}

// 导出Mock数据
export default {
  // 工作转介绍
  'GET /settlement/job-referral': (req) => {
    const { page = 1, pageSize = 10, keyword, status, startDate, endDate } = req.query
    let filteredList = [...jobReferrals.list]

    // 关键词搜索
    if (keyword) {
      filteredList = filteredList.filter(item =>
        item.referredName.includes(keyword) ||
        item.referredPhone.includes(keyword) ||
        item.introducerName.includes(keyword) ||
        item.introducerPhone.includes(keyword)
      )
    }

    // 状态筛选
    if (status) {
      filteredList = filteredList.filter(item => item.status === status)
    }

    // 日期范围筛选
    if (startDate) {
      filteredList = filteredList.filter(item => item.introduceDate >= startDate)
    }
    if (endDate) {
      filteredList = filteredList.filter(item => item.introduceDate <= endDate)
    }

    return {
      code: 200,
      message: '操作成功',
      data: paginate(filteredList, parseInt(page), parseInt(pageSize)),
      timestamp: Date.now()
    }
  },

  'GET /settlement/job-referral/:id': (req) => {
    const { id } = req.params
    const item = jobReferrals.list.find(item => item.id == id)
    return {
      code: 200,
      message: '操作成功',
      data: item,
      timestamp: Date.now()
    }
  },

  // 佣金发放
  'GET /settlement/commission-payment': (req) => {
    const { page = 1, pageSize = 10, keyword, status, startDate, endDate } = req.query
    let filteredList = [...commissionPayments.list]

    // 关键词搜索
    if (keyword) {
      filteredList = filteredList.filter(item =>
        item.referredName.includes(keyword) ||
        item.referredPhone.includes(keyword) ||
        item.introducerName.includes(keyword) ||
        item.introducerPhone.includes(keyword)
      )
    }

    // 状态筛选
    if (status) {
      filteredList = filteredList.filter(item => item.status === status)
    }

    // 日期范围筛选
    if (startDate) {
      filteredList = filteredList.filter(item => item.introduceDate >= startDate)
    }
    if (endDate) {
      filteredList = filteredList.filter(item => item.introduceDate <= endDate)
    }

    return {
      code: 200,
      message: '操作成功',
      data: paginate(filteredList, parseInt(page), parseInt(pageSize)),
      timestamp: Date.now()
    }
  },

  'GET /settlement/commission-payment/:id': (req) => {
    const { id } = req.params
    const item = commissionPayments.list.find(item => item.id == id)
    return {
      code: 200,
      message: '操作成功',
      data: item,
      timestamp: Date.now()
    }
  },

  'POST /settlement/commission-payment/pay': () => {
    return {
      code: 200,
      message: '佣金发放成功',
      data: null,
      timestamp: Date.now()
    }
  },

  'POST /settlement/commission-payment/batch-pay': () => {
    return {
      code: 200,
      message: '批量佣金发放成功',
      data: null,
      timestamp: Date.now()
    }
  },

  // 拉新奖励
  'GET /settlement/referral-reward': (req) => {
    const { page = 1, pageSize = 10, keyword, status, startDate, endDate } = req.query
    let filteredList = [...referralRewards.list]

    // 关键词搜索
    if (keyword) {
      filteredList = filteredList.filter(item =>
        item.referredName.includes(keyword) ||
        item.referredPhone.includes(keyword) ||
        item.introducerName.includes(keyword) ||
        item.introducerPhone.includes(keyword)
      )
    }

    // 状态筛选
    if (status) {
      filteredList = filteredList.filter(item => item.status === status)
    }

    // 日期范围筛选
    if (startDate) {
      filteredList = filteredList.filter(item => item.introduceDate >= startDate)
    }
    if (endDate) {
      filteredList = filteredList.filter(item => item.introduceDate <= endDate)
    }

    return {
      code: 200,
      message: '操作成功',
      data: paginate(filteredList, parseInt(page), parseInt(pageSize)),
      timestamp: Date.now()
    }
  },

  'GET /settlement/referral-reward/:id': (req) => {
    const { id } = req.params
    const item = referralRewards.list.find(item => item.id == id)
    return {
      code: 200,
      message: '操作成功',
      data: item,
      timestamp: Date.now()
    }
  },

  'POST /settlement/referral-reward/pay': () => {
    return {
      code: 200,
      message: '奖励发放成功',
      data: null,
      timestamp: Date.now()
    }
  },

  'POST /settlement/referral-reward/batch-pay': () => {
    return {
      code: 200,
      message: '批量奖励发放成功',
      data: null,
      timestamp: Date.now()
    }
  },

  // 佣金规则配置
  'GET /settlement/commission-rule': () => {
    return {
      code: 200,
      message: '操作成功',
      data: commissionRule,
      timestamp: Date.now()
    }
  },

  'PUT /settlement/commission-rule': () => {
    return {
      code: 200,
      message: '规则配置保存成功',
      data: commissionRule,
      timestamp: Date.now()
    }
  },

  // 工资结算
  'GET /settlement/wage-settlement': (req) => {
    const { page = 1, pageSize = 10, keyword, issueMonth, factory, status } = req.query
    let filteredList = [...wageSettlements.list]

    // 关键词搜索
    if (keyword) {
      filteredList = filteredList.filter(item =>
        item.factory.includes(keyword) ||
        item.issueDescription.includes(keyword)
      )
    }

    // 发放月份筛选
    if (issueMonth) {
      filteredList = filteredList.filter(item => item.issueMonth === issueMonth)
    }

    // 工厂筛选
    if (factory) {
      filteredList = filteredList.filter(item => item.factory.includes(factory))
    }

    // 状态筛选
    if (status) {
      filteredList = filteredList.filter(item => item.status === status)
    }

    return {
      code: 200,
      message: '操作成功',
      data: paginate(filteredList, parseInt(page), parseInt(pageSize)),
      timestamp: Date.now()
    }
  },

  'GET /settlement/wage-settlement/:id': (req) => {
    const { id } = req.params
    const item = wageSettlements.list.find(item => item.id == id)
    return {
      code: 200,
      message: '操作成功',
      data: item,
      timestamp: Date.now()
    }
  },

  'POST /settlement/wage-settlement': () => {
    return {
      code: 200,
      message: '结算创建成功',
      data: { id: Mock.mock('@id') },
      timestamp: Date.now()
    }
  },

  'PUT /settlement/wage-settlement/:id': () => {
    return {
      code: 200,
      message: '结算更新成功',
      data: null,
      timestamp: Date.now()
    }
  },

  'DELETE /settlement/wage-settlement/:id': () => {
    return {
      code: 200,
      message: '结算删除成功',
      data: null,
      timestamp: Date.now()
    }
  },

  'POST /settlement/wage-settlement/:id/batch-issue': () => {
    return {
      code: 200,
      message: '批量发放成功',
      data: null,
      timestamp: Date.now()
    }
  },

  'POST /settlement/wage-settlement/import': () => {
    return {
      code: 200,
      message: '导入成功',
      data: { successCount: 10, failCount: 0 },
      timestamp: Date.now()
    }
  },

  'GET /settlement/wage-settlement/:id/worker-list': (req) => {
    const { id } = req.params
    // 模拟工人清单数据
    const workerList = Mock.mock({
      'list|20': [
        {
          'id|+1': 1,
          'workerName': '@cname',
          'phone': /^1[3-9]\d{9}$/,
          'idCard': '1[1-9]\d{15}',
          'bankName': '@cbank',
          'bankAccount': /\d{16,19}/,
          'workDays|20-31': 30,
          'baseSalary|3000-6000': 4000,
          'overtimePay|500-1500': 800,
          'performanceBonus|300-800': 500,
          'allowance|100-500': 300,
          'deductions|0-300': 200,
          'netSalary|4000-7500': 5400,
          'status|1': ['pending', 'issued']
        }
      ]
    })
    return {
      code: 200,
      message: '操作成功',
      data: workerList.list,
      timestamp: Date.now()
    }
  }
}
