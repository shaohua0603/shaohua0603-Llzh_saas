import Mock from 'mockjs'

// 模拟业务审批状态数据
const businessApprovalStatuses = []

// 模拟审批记录数据
const approvalRecords = []

// 模拟待办任务数据
const todoTasks = []

// 初始化一些模拟数据
const initMockData = () => {
  // 创建一些业务审批状态
  for (let i = 1; i <= 10; i++) {
    const businessCode = ['LEAVE', 'TRANSFER', 'RESIGNATION', 'REGISTRATION'][i % 4]
    const status = ['PENDING', 'IN_PROGRESS', 'APPROVED', 'REJECTED', 'CANCELLED'][i % 5]

    businessApprovalStatuses.push({
      id: i,
      businessCode: businessCode,
      businessId: i,
      flowId: 1,
      flowName: '请假审批流程',
      currentNodeId: status === 'IN_PROGRESS' ? 1 : null,
      currentNodeName: status === 'IN_PROGRESS' ? '部门主管审批' : null,
      approvalStatus: status,
      submitterId: 1,
      submitterName: '张三',
      submitTime: '2026-02-26 10:00:00',
      completeTime: status === 'APPROVED' || status === 'REJECTED' || status === 'CANCELLED' ? '2026-02-26 14:00:00' : null,
      totalNodes: 3,
      currentNodeOrder: status === 'IN_PROGRESS' ? 1 : null,
      rejectReason: status === 'REJECTED' ? '不符合审批条件' : null,
      cancelReason: status === 'CANCELLED' ? '申请人主动取消' : null,
      tenantId: 1,
      createTime: '2026-02-26 10:00:00',
      updateTime: '2026-02-26 10:00:00',
      createBy: 'admin',
      updateBy: 'admin',
      remark: ''
    })

    // 为每个业务创建审批记录
    if (status !== 'PENDING' && status !== 'CANCELLED') {
      const recordCount = status === 'IN_PROGRESS' ? 1 : (status === 'APPROVED' ? 3 : 2)
      for (let j = 1; j <= recordCount; j++) {
        const isCurrent = j === recordCount && status === 'IN_PROGRESS'
        const result = isCurrent ? 'PENDING' : (j < recordCount ? 'APPROVED' : status)

        approvalRecords.push({
          id: approvalRecords.length + 1,
          businessCode: businessCode,
          businessId: i,
          flowId: 1,
          flowName: '请假审批流程',
          nodeId: j,
          nodeName: ['部门主管审批', '人事审批', '总经理审批'][j - 1],
          approverId: 1,
          approverName: '李四',
          approverDept: '人事部',
          approvalResult: result,
          approvalComment: result === 'APPROVED' ? '同意' : (result === 'REJECTED' ? '不同意' : ''),
          approvalTime: result !== 'PENDING' ? '2026-02-26 12:00:00' : null,
          transferToId: null,
          transferToName: null,
          delegateToId: null,
          delegateToName: null,
          attachmentIds: null,
          isCurrent: isCurrent ? 1 : 0,
          tenantId: 1,
          createTime: '2026-02-26 10:00:00',
          updateTime: '2026-02-26 12:00:00',
          createBy: 'admin',
          updateBy: 'admin',
          remark: ''
        })
      }
    }
  }

  // 创建一些待办任务
  for (let i = 1; i <= 5; i++) {
    todoTasks.push({
      id: i,
      taskType: 'APPROVAL',
      taskTitle: '请假审批',
      taskContent: '张三提交的请假申请需要审批',
      taskSource: 'LEAVE',
      businessCode: 'LEAVE',
      businessId: i,
      taskStatus: 'PENDING',
      priority: 'NORMAL',
      assigneeId: 1,
      assigneeName: '李四',
      assigneeDept: '人事部',
      senderId: 1,
      senderName: '张三',
      dueDate: '2026-02-28 18:00:00',
      completeTime: null,
      readStatus: 0,
      readTime: null,
      approvalRecordId: i,
      taskUrl: '/leave/approval/' + i,
      attachmentIds: null,
      tenantId: 1,
      createTime: '2026-02-26 10:00:00',
      updateTime: '2026-02-26 10:00:00',
      createBy: 'admin',
      updateBy: 'admin',
      remark: ''
    })
  }
}

// 初始化Mock数据
initMockData()

/**
 * 审批执行模块 Mock 接口
 * 包含提交审批、审批操作、查询审批状态、查询审批记录、撤回审批等功能
 */
export default [
  // ============================================
  // 1. 提交审批接口
  // ============================================

  /**
   * 1.1 提交审批
   * POST /api/v1/approvals/submit
   */
  {
    url: '/approvals/submit',
    method: 'post',
    response: ({ body }) => {
      const data = JSON.parse(body)
      const { businessCode, businessId, submitterId, submitterName } = data

      // 检查是否已经提交过审批
      const existing = businessApprovalStatuses.find(
        item => item.businessCode === businessCode && item.businessId === businessId
      )
      if (existing) {
        return {
          code: 400,
          message: '该业务已提交审批，请勿重复提交',
          data: null,
          timestamp: Date.now()
        }
      }

      // 创建业务审批状态
      const newStatus = {
        id: businessApprovalStatuses.length + 1,
        businessCode: businessCode,
        businessId: businessId,
        flowId: 1,
        flowName: '请假审批流程',
        currentNodeId: 1,
        currentNodeName: '部门主管审批',
        approvalStatus: 'IN_PROGRESS',
        submitterId: submitterId,
        submitterName: submitterName,
        submitTime: new Date().toISOString().replace('T', ' ').substring(0, 19),
        completeTime: null,
        totalNodes: 3,
        currentNodeOrder: 1,
        rejectReason: null,
        cancelReason: null,
        tenantId: 1,
        createTime: new Date().toISOString().replace('T', ' ').substring(0, 19),
        updateTime: new Date().toISOString().replace('T', ' ').substring(0, 19),
        createBy: submitterName,
        updateBy: submitterName,
        remark: ''
      }
      businessApprovalStatuses.push(newStatus)

      // 创建第一个节点的审批记录
      const newRecord = {
        id: approvalRecords.length + 1,
        businessCode: businessCode,
        businessId: businessId,
        flowId: 1,
        flowName: '请假审批流程',
        nodeId: 1,
        nodeName: '部门主管审批',
        approverId: 1,
        approverName: '李四',
        approverDept: '人事部',
        approvalResult: 'PENDING',
        approvalComment: '',
        approvalTime: null,
        transferToId: null,
        transferToName: null,
        delegateToId: null,
        delegateToName: null,
        attachmentIds: null,
        isCurrent: 1,
        tenantId: 1,
        createTime: new Date().toISOString().replace('T', ' ').substring(0, 19),
        updateTime: new Date().toISOString().replace('T', ' ').substring(0, 19),
        createBy: submitterName,
        updateBy: submitterName,
        remark: ''
      }
      approvalRecords.push(newRecord)

      // 创建待办任务
      const newTask = {
        id: todoTasks.length + 1,
        taskType: 'APPROVAL',
        taskTitle: '请假审批',
        taskContent: `${submitterName}提交的请假申请需要审批`,
        taskSource: businessCode,
        businessCode: businessCode,
        businessId: businessId,
        taskStatus: 'PENDING',
        priority: 'NORMAL',
        assigneeId: 1,
        assigneeName: '李四',
        assigneeDept: '人事部',
        senderId: submitterId,
        senderName: submitterName,
        dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().replace('T', ' ').substring(0, 19),
        completeTime: null,
        readStatus: 0,
        readTime: null,
        approvalRecordId: newRecord.id,
        taskUrl: `/${businessCode.toLowerCase()}/approval/${businessId}`,
        attachmentIds: null,
        tenantId: 1,
        createTime: new Date().toISOString().replace('T', ' ').substring(0, 19),
        updateTime: new Date().toISOString().replace('T', ' ').substring(0, 19),
        createBy: submitterName,
        updateBy: submitterName,
        remark: ''
      }
      todoTasks.push(newTask)

      return {
        code: 200,
        message: '提交成功',
        data: {
          approvalId: newStatus.id,
          currentNode: '部门主管审批',
          currentNodeId: 1
        },
        timestamp: Date.now()
      }
    }
  },

  // ============================================
  // 2. 审批操作接口
  // ============================================

  /**
   * 2.1 审批通过
   * POST /api/v1/approvals/{approvalId}/approve
   */
  {
    url: /\/approvals\/\d+\/approve/,
    method: 'post',
    response: ({ url, body }) => {
      const approvalId = parseInt(url.match(/\d+/)?.[0] || '0')
      const data = JSON.parse(body)
      const { nodeId, approverId, approverName, approvalComment } = data

      // 查找审批状态
      const status = businessApprovalStatuses.find(item => item.id === approvalId)
      if (!status) {
        return {
          code: 404,
          message: '审批不存在',
          data: null,
          timestamp: Date.now()
        }
      }

      // 查找审批记录
      const record = approvalRecords.find(
        item => item.businessCode === status.businessCode &&
               item.businessId === status.businessId &&
               item.nodeId === nodeId
      )
      if (!record) {
        return {
          code: 404,
          message: '审批记录不存在',
          data: null,
          timestamp: Date.now()
        }
      }

      // 更新审批记录
      record.approvalResult = 'APPROVED'
      record.approvalComment = approvalComment || '同意'
      record.approvalTime = new Date().toISOString().replace('T', ' ').substring(0, 19)
      record.isCurrent = 0
      record.updateBy = approverName

      // 检查是否还有下一个节点
      const nextNode = nodeId + 1
      const isLastNode = nextNode > status.totalNodes

      if (isLastNode) {
        // 最后一个节点，完成审批流程
        status.approvalStatus = 'APPROVED'
        status.completeTime = new Date().toISOString().replace('T', ' ').substring(0, 19)
        status.currentNodeId = null
        status.currentNodeName = null
        status.currentNodeOrder = null
        status.updateBy = approverName

        // 完成待办任务
        const task = todoTasks.find(
          item => item.businessCode === status.businessCode &&
                 item.businessId === status.businessId &&
                 item.taskStatus === 'PENDING'
        )
        if (task) {
          task.taskStatus = 'COMPLETED'
          task.completeTime = new Date().toISOString().replace('T', ' ').substring(0, 19)
          task.updateBy = approverName
        }
      } else {
        // 进入下一个节点
        status.currentNodeId = nextNode
        status.currentNodeName = ['部门主管审批', '人事审批', '总经理审批'][nextNode - 1]
        status.currentNodeOrder = nextNode
        status.updateBy = approverName

        // 创建下一个节点的审批记录
        const nextRecord = {
          id: approvalRecords.length + 1,
          businessCode: status.businessCode,
          businessId: status.businessId,
          flowId: status.flowId,
          flowName: status.flowName,
          nodeId: nextNode,
          nodeName: status.currentNodeName,
          approverId: 1,
          approverName: '王五',
          approverDept: '人事部',
          approvalResult: 'PENDING',
          approvalComment: '',
          approvalTime: null,
          transferToId: null,
          transferToName: null,
          delegateToId: null,
          delegateToName: null,
          attachmentIds: null,
          isCurrent: 1,
          tenantId: status.tenantId,
          createTime: new Date().toISOString().replace('T', ' ').substring(0, 19),
          updateTime: new Date().toISOString().replace('T', ' ').substring(0, 19),
          createBy: approverName,
          updateBy: approverName,
          remark: ''
        }
        approvalRecords.push(nextRecord)

        // 创建下一个节点的待办任务
        const nextTask = {
          id: todoTasks.length + 1,
          taskType: 'APPROVAL',
          taskTitle: '请假审批',
          taskContent: `${status.submitterName}提交的请假申请需要审批`,
          taskSource: status.businessCode,
          businessCode: status.businessCode,
          businessId: status.businessId,
          taskStatus: 'PENDING',
          priority: 'NORMAL',
          assigneeId: 1,
          assigneeName: '王五',
          assigneeDept: '人事部',
          senderId: status.submitterId,
          senderName: status.submitterName,
          dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().replace('T', ' ').substring(0, 19),
          completeTime: null,
          readStatus: 0,
          readTime: null,
          approvalRecordId: nextRecord.id,
          taskUrl: `/${status.businessCode.toLowerCase()}/approval/${status.businessId}`,
          attachmentIds: null,
          tenantId: status.tenantId,
          createTime: new Date().toISOString().replace('T', ' ').substring(0, 19),
          updateTime: new Date().toISOString().replace('T', ' ').substring(0, 19),
          createBy: approverName,
          updateBy: approverName,
          remark: ''
        }
        todoTasks.push(nextTask)

        // 完成当前待办任务
        const currentTask = todoTasks.find(
          item => item.businessCode === status.businessCode &&
                 item.businessId === status.businessId &&
                 item.taskStatus === 'PENDING' &&
                 item.approvalRecordId === record.id
        )
        if (currentTask) {
          currentTask.taskStatus = 'COMPLETED'
          currentTask.completeTime = new Date().toISOString().replace('T', ' ').substring(0, 19)
          currentTask.updateBy = approverName
        }
      }

      return {
        code: 200,
        message: '审批通过',
        data: {
          nextNode: isLastNode ? null : status.currentNodeName,
          nextNodeId: isLastNode ? null : nextNode,
          isCompleted: isLastNode,
          approvalStatus: status
        },
        timestamp: Date.now()
      }
    }
  },

  /**
   * 2.2 审批驳回
   * POST /api/v1/approvals/{approvalId}/reject
   */
  {
    url: /\/approvals\/\d+\/reject/,
    method: 'post',
    response: ({ url, body }) => {
      const approvalId = parseInt(url.match(/\d+/)?.[0] || '0')
      const data = JSON.parse(body)
      const { nodeId, approverId, approverName, approvalComment } = data

      // 查找审批状态
      const status = businessApprovalStatuses.find(item => item.id === approvalId)
      if (!status) {
        return {
          code: 404,
          message: '审批不存在',
          data: null,
          timestamp: Date.now()
        }
      }

      // 查找审批记录
      const record = approvalRecords.find(
        item => item.businessCode === status.businessCode &&
               item.businessId === status.businessId &&
               item.nodeId === nodeId
      )
      if (!record) {
        return {
          code: 404,
          message: '审批记录不存在',
          data: null,
          timestamp: Date.now()
        }
      }

      // 更新审批记录
      record.approvalResult = 'REJECTED'
      record.approvalComment = approvalComment || '不同意'
      record.approvalTime = new Date().toISOString().replace('T', ' ').substring(0, 19)
      record.isCurrent = 0
      record.updateBy = approverName

      // 更新审批状态
      status.approvalStatus = 'REJECTED'
      status.completeTime = new Date().toISOString().replace('T', ' ').substring(0, 19)
      status.currentNodeId = null
      status.currentNodeName = null
      status.currentNodeOrder = null
      status.rejectReason = approvalComment || '不同意'
      status.updateBy = approverName

      // 完成待办任务
      const task = todoTasks.find(
        item => item.businessCode === status.businessCode &&
               item.businessId === status.businessId &&
               item.taskStatus === 'PENDING'
      )
      if (task) {
        task.taskStatus = 'CANCELLED'
        task.completeTime = new Date().toISOString().replace('T', ' ').substring(0, 19)
        task.updateBy = approverName
      }

      return {
        code: 200,
        message: '审批驳回',
        data: {
          nextNode: null,
          nextNodeId: null,
          isCompleted: true,
          approvalStatus: status
        },
        timestamp: Date.now()
      }
    }
  },

  /**
   * 2.3 审批转交
   * POST /api/v1/approvals/{approvalId}/transfer
   */
  {
    url: /\/approvals\/\d+\/transfer/,
    method: 'post',
    response: ({ url, body }) => {
      const approvalId = parseInt(url.match(/\d+/)?.[0] || '0')
      const data = JSON.parse(body)
      const { nodeId, approverId, approverName, transferToId, transferToName, approvalComment } = data

      // 查找审批状态
      const status = businessApprovalStatuses.find(item => item.id === approvalId)
      if (!status) {
        return {
          code: 404,
          message: '审批不存在',
          data: null,
          timestamp: Date.now()
        }
      }

      // 查找审批记录
      const record = approvalRecords.find(
        item => item.businessCode === status.businessCode &&
               item.businessId === status.businessId &&
               item.nodeId === nodeId
      )
      if (!record) {
        return {
          code: 404,
          message: '审批记录不存在',
          data: null,
          timestamp: Date.now()
        }
      }

      // 更新审批记录
      record.approvalResult = 'TRANSFER'
      record.approvalComment = approvalComment || '转交审批'
      record.approvalTime = new Date().toISOString().replace('T', ' ').substring(0, 19)
      record.transferToId = transferToId
      record.transferToName = transferToName
      record.isCurrent = 0
      record.updateBy = approverName

      // 创建新的审批记录
      const newRecord = {
        id: approvalRecords.length + 1,
        businessCode: status.businessCode,
        businessId: status.businessId,
        flowId: status.flowId,
        flowName: status.flowName,
        nodeId: nodeId,
        nodeName: record.nodeName,
        approverId: transferToId,
        approverName: transferToName,
        approverDept: '人事部',
        approvalResult: 'PENDING',
        approvalComment: '',
        approvalTime: null,
        transferToId: null,
        transferToName: null,
        delegateToId: null,
        delegateToName: null,
        attachmentIds: null,
        isCurrent: 1,
        tenantId: status.tenantId,
        createTime: new Date().toISOString().replace('T', ' ').substring(0, 19),
        updateTime: new Date().toISOString().replace('T', ' ').substring(0, 19),
        createBy: approverName,
        updateBy: approverName,
        remark: ''
      }
      approvalRecords.push(newRecord)

      // 更新待办任务
      const task = todoTasks.find(
        item => item.businessCode === status.businessCode &&
               item.businessId === status.businessId &&
               item.taskStatus === 'PENDING' &&
               item.approvalRecordId === record.id
      )
      if (task) {
        task.assigneeId = transferToId
        task.assigneeName = transferToName
        task.approvalRecordId = newRecord.id
        task.updateBy = approverName
      }

      return {
        code: 200,
        message: '转交成功',
        data: {
          nextNode: status.currentNodeName,
          nextNodeId: status.currentNodeId,
          isCompleted: false,
          approvalStatus: status
        },
        timestamp: Date.now()
      }
    }
  },

  /**
   * 2.4 审批委派
   * POST /api/v1/approvals/{approvalId}/delegate
   */
  {
    url: /\/approvals\/\d+\/delegate/,
    method: 'post',
    response: ({ url, body }) => {
      const approvalId = parseInt(url.match(/\d+/)?.[0] || '0')
      const data = JSON.parse(body)
      const { nodeId, approverId, approverName, delegateToId, delegateToName, approvalComment } = data

      // 查找审批状态
      const status = businessApprovalStatuses.find(item => item.id === approvalId)
      if (!status) {
        return {
          code: 404,
          message: '审批不存在',
          data: null,
          timestamp: Date.now()
        }
      }

      // 查找审批记录
      const record = approvalRecords.find(
        item => item.businessCode === status.businessCode &&
               item.businessId === status.businessId &&
               item.nodeId === nodeId
      )
      if (!record) {
        return {
          code: 404,
          message: '审批记录不存在',
          data: null,
          timestamp: Date.now()
        }
      }

      // 更新审批记录
      record.approvalResult = 'DELEGATE'
      record.approvalComment = approvalComment || '委派审批'
      record.approvalTime = new Date().toISOString().replace('T', ' ').substring(0, 19)
      record.delegateToId = delegateToId
      record.delegateToName = delegateToName
      record.isCurrent = 0
      record.updateBy = approverName

      // 创建新的审批记录
      const newRecord = {
        id: approvalRecords.length + 1,
        businessCode: status.businessCode,
        businessId: status.businessId,
        flowId: status.flowId,
        flowName: status.flowName,
        nodeId: nodeId,
        nodeName: record.nodeName,
        approverId: delegateToId,
        approverName: delegateToName,
        approverDept: '人事部',
        approvalResult: 'PENDING',
        approvalComment: '',
        approvalTime: null,
        transferToId: null,
        transferToName: null,
        delegateToId: null,
        delegateToName: null,
        attachmentIds: null,
        isCurrent: 1,
        tenantId: status.tenantId,
        createTime: new Date().toISOString().replace('T', ' ').substring(0, 19),
        updateTime: new Date().toISOString().replace('T', ' ').substring(0, 19),
        createBy: approverName,
        updateBy: approverName,
        remark: ''
      }
      approvalRecords.push(newRecord)

      // 更新待办任务
      const task = todoTasks.find(
        item => item.businessCode === status.businessCode &&
               item.businessId === status.businessId &&
               item.taskStatus === 'PENDING' &&
               item.approvalRecordId === record.id
      )
      if (task) {
        task.assigneeId = delegateToId
        task.assigneeName = delegateToName
        task.approvalRecordId = newRecord.id
        task.updateBy = approverName
      }

      return {
        code: 200,
        message: '委派成功',
        data: {
          nextNode: status.currentNodeName,
          nextNodeId: status.currentNodeId,
          isCompleted: false,
          approvalStatus: status
        },
        timestamp: Date.now()
      }
    }
  },

  // ============================================
  // 3. 查询审批状态接口
  // ============================================

  /**
   * 3.1 查询审批状态
   * GET /api/v1/approvals/status
   */
  {
    url: '/approvals/status',
    method: 'get',
    response: ({ query }) => {
      const { businessId, businessCode } = query

      const status = businessApprovalStatuses.find(
        item => item.businessCode === businessCode && item.businessId === parseInt(businessId)
      )

      if (!status) {
        return {
          code: 404,
          message: '未找到审批状态',
          data: null,
          timestamp: Date.now()
        }
      }

      return {
        code: 200,
        message: 'success',
        data: status,
        timestamp: Date.now()
      }
    }
  },

  // ============================================
  // 4. 查询审批记录接口
  // ============================================

  /**
   * 4.1 查询审批记录
   * GET /api/v1/approvals/records
   */
  {
    url: '/approvals/records',
    method: 'get',
    response: ({ query }) => {
      const { businessId, businessCode, page = 1, pageSize = 10, approvalResult, approverId } = query

      let filteredList = [...approvalRecords]

      // 按业务代码和业务ID筛选
      if (businessCode) {
        filteredList = filteredList.filter(item => item.businessCode === businessCode)
      }
      if (businessId) {
        filteredList = filteredList.filter(item => item.businessId === parseInt(businessId))
      }

      // 按审批结果筛选
      if (approvalResult) {
        filteredList = filteredList.filter(item => item.approvalResult === approvalResult)
      }

      // 按审批人筛选
      if (approverId) {
        filteredList = filteredList.filter(item => item.approverId === parseInt(approverId))
      }

      // 分页
      const start = (page - 1) * pageSize
      const end = start + parseInt(pageSize)
      const list = filteredList.slice(start, end)

      return {
        code: 200,
        message: 'success',
        data: {
          list,
          total: filteredList.length,
          page: parseInt(page),
          pageSize: parseInt(pageSize)
        },
        timestamp: Date.now()
      }
    }
  },

  // ============================================
  // 5. 撤回审批接口
  // ============================================

  /**
   * 5.1 撤回审批
   * POST /api/v1/approvals/{approvalId}/withdraw
   */
  {
    url: /\/approvals\/\d+\/withdraw/,
    method: 'post',
    response: ({ url, body }) => {
      const approvalId = parseInt(url.match(/\d+/)?.[0] || '0')
      const data = JSON.parse(body)
      const { userId, userName, cancelReason } = data

      // 查找审批状态
      const status = businessApprovalStatuses.find(item => item.id === approvalId)
      if (!status) {
        return {
          code: 404,
          message: '审批不存在',
          data: null,
          timestamp: Date.now()
        }
      }

      // 验证申请人权限
      if (status.submitterId !== userId) {
        return {
          code: 403,
          message: '只有申请人才能撤回审批',
          data: null,
          timestamp: Date.now()
        }
      }

      // 验证审批状态
      if (status.approvalStatus !== 'IN_PROGRESS') {
        return {
          code: 400,
          message: '只有审批中的申请才能撤回',
          data: null,
          timestamp: Date.now()
        }
      }

      // 更新审批状态
      status.approvalStatus = 'CANCELLED'
      status.completeTime = new Date().toISOString().replace('T', ' ').substring(0, 19)
      status.currentNodeId = null
      status.currentNodeName = null
      status.currentNodeOrder = null
      status.cancelReason = cancelReason || '申请人撤回'
      status.updateBy = userName

      // 取消待办任务
      const tasks = todoTasks.filter(
        item => item.businessCode === status.businessCode &&
               item.businessId === status.businessId &&
               item.taskStatus === 'PENDING'
      )
      tasks.forEach(task => {
        task.taskStatus = 'CANCELLED'
        task.completeTime = new Date().toISOString().replace('T', ' ').substring(0, 19)
        task.updateBy = userName
      })

      return {
        code: 200,
        message: '撤回成功',
        data: null,
        timestamp: Date.now()
      }
    }
  },

  // ============================================
  // 6. 辅助接口
  // ============================================

  /**
   * 6.1 获取我的待办审批列表
   * GET /api/v1/approvals/my-tasks
   */
  {
    url: '/approvals/my-tasks',
    method: 'get',
    response: ({ query }) => {
      const { page = 1, pageSize = 10, taskStatus } = query

      let filteredList = [...todoTasks]

      // 按任务状态筛选
      if (taskStatus) {
        filteredList = filteredList.filter(item => item.taskStatus === taskStatus)
      }

      // 分页
      const start = (page - 1) * pageSize
      const end = start + parseInt(pageSize)
      const list = filteredList.slice(start, end)

      return {
        code: 200,
        message: 'success',
        data: {
          list,
          total: filteredList.length,
          page: parseInt(page),
          pageSize: parseInt(pageSize)
        },
        timestamp: Date.now()
      }
    }
  },

  /**
   * 6.2 获取我提交的审批列表
   * GET /api/v1/approvals/my-submissions
   */
  {
    url: '/approvals/my-submissions',
    method: 'get',
    response: ({ query }) => {
      const { page = 1, pageSize = 10, approvalStatus } = query

      let filteredList = [...businessApprovalStatuses]

      // 按审批状态筛选
      if (approvalStatus) {
        filteredList = filteredList.filter(item => item.approvalStatus === approvalStatus)
      }

      // 分页
      const start = (page - 1) * pageSize
      const end = start + parseInt(pageSize)
      const list = filteredList.slice(start, end)

      return {
        code: 200,
        message: 'success',
        data: {
          list,
          total: filteredList.length,
          page: parseInt(page),
          pageSize: parseInt(pageSize)
        },
        timestamp: Date.now()
      }
    }
  },

  /**
   * 6.3 获取审批详情
   * GET /api/v1/approvals/{approvalId}
   */
  {
    url: /\/approvals\/\d+/,
    method: 'get',
    response: ({ url }) => {
      const approvalId = parseInt(url.match(/\d+/)?.[0] || '0')

      const status = businessApprovalStatuses.find(item => item.id === approvalId)

      if (!status) {
        return {
          code: 404,
          message: '审批不存在',
          data: null,
          timestamp: Date.now()
        }
      }

      // 获取审批记录
      const records = approvalRecords.filter(
        item => item.businessCode === status.businessCode && item.businessId === status.businessId
      )

      return {
        code: 200,
        message: 'success',
        data: {
          ...status,
          records
        },
        timestamp: Date.now()
      }
    }
  },

  /**
   * 6.4 批量审批
   * POST /api/v1/approvals/batch-approve
   */
  {
    url: '/approvals/batch-approve',
    method: 'post',
    response: ({ body }) => {
      const data = JSON.parse(body)
      const { approvalIds, approvalComment } = data

      let successCount = 0
      let failureCount = 0

      approvalIds.forEach(approvalId => {
        const status = businessApprovalStatuses.find(item => item.id === approvalId)
        if (status && status.approvalStatus === 'IN_PROGRESS') {
          successCount++
          // 简化处理，实际应该调用单个审批通过逻辑
        } else {
          failureCount++
        }
      })

      return {
        code: 200,
        message: '批量审批完成',
        data: {
          successCount,
          failureCount
        },
        timestamp: Date.now()
      }
    }
  },

  /**
   * 6.5 批量驳回
   * POST /api/v1/approvals/batch-reject
   */
  {
    url: '/approvals/batch-reject',
    method: 'post',
    response: ({ body }) => {
      const data = JSON.parse(body)
      const { approvalIds, approvalComment } = data

      let successCount = 0
      let failureCount = 0

      approvalIds.forEach(approvalId => {
        const status = businessApprovalStatuses.find(item => item.id === approvalId)
        if (status && status.approvalStatus === 'IN_PROGRESS') {
          successCount++
          // 简化处理，实际应该调用单个审批驳回逻辑
        } else {
          failureCount++
        }
      })

      return {
        code: 200,
        message: '批量驳回完成',
        data: {
          successCount,
          failureCount
        },
        timestamp: Date.now()
      }
    }
  }
]
