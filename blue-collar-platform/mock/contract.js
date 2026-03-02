import Mock from 'mockjs'

const Random = Mock.Random

const contracts = Mock.mock({
  'list|50': [
    {
      'id': '@uuid',
      'contractNo': function() {
        return 'HT' + Random.datetime('yyyyMMdd') + String(this.id.substring(0, 8)).padStart(6, '0')
      },
      'partyA': '三鼎劳务有限公司',
      'partyAId': '@uuid',
      'partyB': '@cname',
      'partyBId': '@uuid',
      'partyBName': '@cname',
      'partyBPhone': /^1[3-9]\d{9}$/,
      'settlementMethod|1': ['DAILY', 'MONTHLY'],
      'settlementMethodText': function() {
        const map = { DAILY: '日结', MONTHLY: '月结' }
        return map[this.settlementMethod]
      },
      'contractStatus|1': ['UNSIGNED', 'SIGNING', 'SIGNED', 'CANCELLED'],
      'contractStatusText': function() {
        const map = { UNSIGNED: '未签订', SIGNING: '签订中', SIGNED: '已签订', CANCELLED: '已取消' }
        return map[this.contractStatus]
      },
      'contractSignDate': '@datetime("yyyy-MM-dd")',
      'contractEffectiveDate': '@datetime("yyyy-MM-dd")',
      'contractExpiryDate': '@datetime("yyyy-MM-dd")',
      'contractAmount|5000-100000': 50000,
      'contractContent': '<p><strong>第一条 合同目的</strong></p><p>本合同旨在明确甲方与乙方之间的劳务合作关系，保障双方合法权益。</p><p><strong>第二条 工作内容</strong></p><p>乙方同意根据甲方安排，从事生产车间操作工作。</p><p><strong>第三条 工作地点</strong></p><p>乙方工作地点为甲方指定的生产车间。</p><p><strong>第四条 工作时间</strong></p><p>乙方工作时间为标准工时制，每日工作8小时，每周工作40小时。</p><p><strong>第五条 劳动报酬</strong></p><p>甲方按月向乙方支付劳动报酬。</p>',
      'attachments|0-3': [
        {
          name: function() { return '劳动合同_' + Random.guid() + '.pdf' },
          url: function() { return 'https://example.com/files/' + Random.guid() + '.pdf' },
          size: function() { return Random.integer(102400, 5242880) }
        }
      ],
      'approvalStatus|1': ['PENDING', 'APPROVED', 'REJECTED'],
      'approvalStatusText': function() {
        const map = { PENDING: '未审核', APPROVED: '已通过', REJECTED: '已驳回' }
        return map[this.approvalStatus]
      },
      'dataScope|1': ['ALL', 'DEPARTMENT', 'DEPARTMENT_AND_BELOW', 'SELF'],
      'departmentId': '@uuid',
      'departmentName': '劳务部',
      'tenantId': '@uuid',
      'tenantName': '三鼎劳务有限公司',
      'creatorId': '@uuid',
      'creatorName': '@cname',
      'createTime': '@datetime',
      'updaterId': '@uuid',
      'updaterName': '@cname',
      'updateTime': '@datetime',
      'remark': '@cword(5, 20)'
    }
  ]
})

const contractOperationRecords = Mock.mock({
  'list|10': [
    {
      'id': '@uuid',
      'contractId': '@uuid',
      'action|1': ['CREATE', 'UPDATE', 'DELETE', 'SUBMIT', 'APPROVE', 'REJECT', 'CANCEL'],
      'actionText': function() {
        const map = { CREATE: '创建合同', UPDATE: '修改合同', DELETE: '删除合同', SUBMIT: '提交审核', APPROVE: '审核通过', REJECT: '审核驳回', CANCEL: '取消合同' }
        return map[this.action]
      },
      'operatorId': '@uuid',
      'operatorName': '@cname',
      'remark': '@cword(5, 20)',
      'createTime': '@datetime'
    }
  ]
})

const availableWorkers = Mock.mock({
  'list|50': [
    {
      'id': '@uuid',
      'name': '@cname',
      'phone': /^1[3-9]\d{9}$/,
      'idCard': /^[1-9]\d{5}(18|19|20)\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])\d{3}[\dXx]$/,
      'age|18-60': 25,
      'gender|1': ['男', '女'],
      'education|1': ['小学', '初中', '高中', '大专', '本科', '硕士', '博士'],
      'jobIntention': '@ctitle(3, 6)',
      'expectedSalary|3000-15000': 5000,
      'expectedWorkAddress': '@city(true)',
      'materialsComplete|1': [true, false],
      'interviewStatus|1': ['PASSED', 'FAILED', 'PENDING'],
      'contractStatus|1': ['NONE', 'UNSIGNED', 'SIGNED']
    }
  ]
})

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

export default {
  'GET /api/v1/contracts': (req) => {
    const { page = 1, pageSize = 10, keyword, contractNo, partyBName, partyBPhone, settlementMethod, contractStatus, contractSignDateStart, contractSignDateEnd, contractEffectiveDateStart, contractEffectiveDateEnd, contractExpiryDateStart, contractExpiryDateEnd, dataScope, departmentId } = req.query
    let filteredList = [...contracts.list]

    if (keyword) {
      filteredList = filteredList.filter(item =>
        item.contractNo.includes(keyword) ||
        item.partyBName.includes(keyword) ||
        item.partyBPhone.includes(keyword)
      )
    }

    if (contractNo) {
      filteredList = filteredList.filter(item => item.contractNo.includes(contractNo))
    }

    if (partyBName) {
      filteredList = filteredList.filter(item => item.partyBName.includes(partyBName))
    }

    if (partyBPhone) {
      filteredList = filteredList.filter(item => item.partyBPhone.includes(partyBPhone))
    }

    if (settlementMethod) {
      filteredList = filteredList.filter(item => item.settlementMethod === settlementMethod)
    }

    if (contractStatus) {
      filteredList = filteredList.filter(item => item.contractStatus === contractStatus)
    }

    if (contractSignDateStart) {
      filteredList = filteredList.filter(item => item.contractSignDate >= contractSignDateStart)
    }
    if (contractSignDateEnd) {
      filteredList = filteredList.filter(item => item.contractSignDate <= contractSignDateEnd)
    }

    if (contractEffectiveDateStart) {
      filteredList = filteredList.filter(item => item.contractEffectiveDate >= contractEffectiveDateStart)
    }
    if (contractEffectiveDateEnd) {
      filteredList = filteredList.filter(item => item.contractEffectiveDate <= contractEffectiveDateEnd)
    }

    if (contractExpiryDateStart) {
      filteredList = filteredList.filter(item => item.contractExpiryDate >= contractExpiryDateStart)
    }
    if (contractExpiryDateEnd) {
      filteredList = filteredList.filter(item => item.contractExpiryDate <= contractExpiryDateEnd)
    }

    if (dataScope) {
      filteredList = filteredList.filter(item => item.dataScope === dataScope)
    }

    if (departmentId) {
      filteredList = filteredList.filter(item => item.departmentId === departmentId)
    }

    return {
      code: 200,
      message: '操作成功',
      data: paginate(filteredList, parseInt(page), parseInt(pageSize)),
      timestamp: Date.now()
    }
  },

  'GET /api/v1/contracts/:id': (req) => {
    const { id } = req.params
    const item = contracts.list.find(item => item.id === id)
    return {
      code: 200,
      message: '操作成功',
      data: item || contracts.list[0],
      timestamp: Date.now()
    }
  },

  'POST /api/v1/contracts': () => {
    return {
      code: 201,
      message: '创建成功',
      data: { id: Mock.mock('@uuid') },
      timestamp: Date.now()
    }
  },

  'PUT /api/v1/contracts/:id': () => {
    return {
      code: 200,
      message: '更新成功',
      data: null,
      timestamp: Date.now()
    }
  },

  'DELETE /api/v1/contracts/:id': () => {
    return {
      code: 200,
      message: '删除成功',
      data: null,
      timestamp: Date.now()
    }
  },

  'DELETE /api/v1/contracts/batch': (req) => {
    const { ids } = req.body
    return {
      code: 200,
      message: '批量删除成功',
      data: { successCount: ids?.length || 0, failCount: 0 },
      timestamp: Date.now()
    }
  },

  'POST /api/v1/contracts/export': (req) => {
    return {
      code: 200,
      message: '导出成功',
      data: { url: 'https://example.com/exports/contracts.xlsx' },
      timestamp: Date.now()
    }
  },

  'POST /api/v1/contracts/import': () => {
    return {
      code: 200,
      message: '导入成功',
      data: { successCount: Mock.Random.integer(1, 10), failCount: 0, errors: [] },
      timestamp: Date.now()
    }
  },

  'GET /api/v1/workers/available': (req) => {
    const { page = 1, pageSize = 10, keyword } = req.query
    let filteredList = [...availableWorkers.list]

    if (keyword) {
      filteredList = filteredList.filter(item =>
        item.name.includes(keyword) ||
        item.phone.includes(keyword)
      )
    }

    return {
      code: 200,
      message: '操作成功',
      data: paginate(filteredList, parseInt(page), parseInt(pageSize)),
      timestamp: Date.now()
    }
  },

  'GET /api/v1/contracts/generate-no': () => {
    const date = new Date()
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const random = String(Mock.Random.integer(1, 999999)).padStart(6, '0')
    return {
      code: 200,
      message: '操作成功',
      data: { contractNo: `HT${year}${month}${day}${random}` },
      timestamp: Date.now()
    }
  }
}
