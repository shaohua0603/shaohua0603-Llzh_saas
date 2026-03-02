import Mock from 'mockjs'

// 模拟审批流程数据
const approvalFlows = [
  {
    id: 1,
    flowName: '请假审批流程',
    flowCode: 'LEAVE_APPROVAL',
    flowType: 'LEAVE',
    flowDescription: '员工请假申请审批流程，支持多级审批',
    flowStatus: 'ENABLED',
    isDefault: 1,
    version: 1,
    tenantId: 1,
    createTime: '2026-02-26 10:00:00',
    updateTime: '2026-02-26 10:00:00',
    createBy: 'admin',
    updateBy: 'admin',
    remark: '默认请假审批流程'
  },
  {
    id: 2,
    flowName: '调岗审批流程',
    flowCode: 'TRANSFER_APPROVAL',
    flowType: 'TRANSFER',
    flowDescription: '员工调岗申请审批流程，支持多级审批',
    flowStatus: 'ENABLED',
    isDefault: 1,
    version: 1,
    tenantId: 1,
    createTime: '2026-02-26 10:00:00',
    updateTime: '2026-02-26 10:00:00',
    createBy: 'admin',
    updateBy: 'admin',
    remark: '默认调岗审批流程'
  },
  {
    id: 3,
    flowName: '离职审批流程',
    flowCode: 'RESIGNATION_APPROVAL',
    flowType: 'RESIGNATION',
    flowDescription: '员工离职申请审批流程，支持多级审批',
    flowStatus: 'ENABLED',
    isDefault: 1,
    version: 1,
    tenantId: 1,
    createTime: '2026-02-26 10:00:00',
    updateTime: '2026-02-26 10:00:00',
    createBy: 'admin',
    updateBy: 'admin',
    remark: '默认离职审批流程'
  },
  {
    id: 4,
    flowName: '报名审批流程',
    flowCode: 'REGISTRATION_APPROVAL',
    flowType: 'REGISTRATION',
    flowDescription: '活动报名审批流程，支持多级审批',
    flowStatus: 'ENABLED',
    isDefault: 1,
    version: 1,
    tenantId: 1,
    createTime: '2026-02-26 10:00:00',
    updateTime: '2026-02-26 10:00:00',
    createBy: 'admin',
    updateBy: 'admin',
    remark: '默认报名审批流程'
  },
  {
    id: 5,
    flowName: '特殊审批流程',
    flowCode: 'SPECIAL_APPROVAL',
    flowType: 'SPECIAL',
    flowDescription: '特殊事项审批流程',
    flowStatus: 'DISABLED',
    isDefault: 0,
    version: 1,
    tenantId: 1,
    createTime: '2026-02-26 11:00:00',
    updateTime: '2026-02-26 11:00:00',
    createBy: 'admin',
    updateBy: 'admin',
    remark: ''
  }
]

// 模拟流程配置数据
const flowConfigs = [
  {
    id: 1,
    businessCode: 'LEAVE',
    businessName: '请假管理',
    flowId: 1,
    flowName: '请假审批流程',
    isEnabled: 1,
    effectiveDate: '2026-01-01 00:00:00',
    expiryDate: null,
    configDescription: '请假管理启用审批流程',
    tenantId: 1,
    createTime: '2026-02-26 10:00:00',
    updateTime: '2026-02-26 10:00:00',
    createBy: 'admin',
    updateBy: 'admin',
    remark: ''
  },
  {
    id: 2,
    businessCode: 'TRANSFER',
    businessName: '调岗管理',
    flowId: 2,
    flowName: '调岗审批流程',
    isEnabled: 1,
    effectiveDate: '2026-01-01 00:00:00',
    expiryDate: null,
    configDescription: '调岗管理启用审批流程',
    tenantId: 1,
    createTime: '2026-02-26 10:00:00',
    updateTime: '2026-02-26 10:00:00',
    createBy: 'admin',
    updateBy: 'admin',
    remark: ''
  },
  {
    id: 3,
    businessCode: 'RESIGNATION',
    businessName: '离职管理',
    flowId: 3,
    flowName: '离职审批流程',
    isEnabled: 1,
    effectiveDate: '2026-01-01 00:00:00',
    expiryDate: null,
    configDescription: '离职管理启用审批流程',
    tenantId: 1,
    createTime: '2026-02-26 10:00:00',
    updateTime: '2026-02-26 10:00:00',
    createBy: 'admin',
    updateBy: 'admin',
    remark: ''
  },
  {
    id: 4,
    businessCode: 'REGISTRATION',
    businessName: '报名管理',
    flowId: 4,
    flowName: '报名审批流程',
    isEnabled: 1,
    effectiveDate: '2026-01-01 00:00:00',
    expiryDate: null,
    configDescription: '报名管理启用审批流程',
    tenantId: 1,
    createTime: '2026-02-26 10:00:00',
    updateTime: '2026-02-26 10:00:00',
    createBy: 'admin',
    updateBy: 'admin',
    remark: ''
  }
]

// 业务代码列表
const businessCodes = [
  { code: 'LEAVE', name: '请假管理' },
  { code: 'TRANSFER', name: '调岗管理' },
  { code: 'RESIGNATION', name: '离职管理' },
  { code: 'REGISTRATION', name: '报名管理' }
]

/**
 * 流程配置模块 Mock 接口
 * 包含流程管理和流程配置两类接口
 */
export default [
  // ============================================
  // 1. 流程管理接口
  // ============================================

  /**
   * 1.1 获取流程列表
   * GET /api/v1/approval-flows
   */
  {
    url: '/approval-flows',
    method: 'get',
    response: ({ query }) => {
      const { page = 1, pageSize = 10, flowType, flowStatus, keyword } = query
      let filteredList = [...approvalFlows]

      // 按流程类型筛选
      if (flowType) {
        filteredList = filteredList.filter(item => item.flowType === flowType)
      }

      // 按流程状态筛选
      if (flowStatus) {
        filteredList = filteredList.filter(item => item.flowStatus === flowStatus)
      }

      // 关键词搜索
      if (keyword) {
        filteredList = filteredList.filter(item =>
          item.flowName.includes(keyword) || item.flowCode.includes(keyword)
        )
      }

      // 分页
      const start = (page - 1) * pageSize
      const end = start + parseInt(pageSize)
      const list = filteredList.slice(start, end)

      // 添加节点数量
      const listWithNodeCount = list.map(item => ({
        ...item,
        nodeCount: Math.floor(Math.random() * 5) + 1
      }))

      return {
        code: 200,
        message: 'success',
        data: {
          list: listWithNodeCount,
          total: filteredList.length,
          page: parseInt(page),
          pageSize: parseInt(pageSize)
        },
        timestamp: Date.now()
      }
    }
  },

  /**
   * 1.2 获取流程详情
   * GET /api/v1/approval-flows/{id}
   */
  {
    url: /\/approval-flows\/\d+/,
    method: 'get',
    response: ({ url }) => {
      const id = parseInt(url.match(/\d+/)?.[0] || '0')
      const flow = approvalFlows.find(item => item.id === id)

      if (!flow) {
        return {
          code: 404,
          message: '流程不存在',
          data: null,
          timestamp: Date.now()
        }
      }

      // 模拟节点数据
      const nodes = [
        {
          id: 1,
          flowId: flow.id,
          nodeName: '部门主管审批',
          nodeCode: `${flow.flowType}_NODE_1`,
          nodeType: 'APPROVAL',
          nodeOrder: 1,
          approvalMode: 'OR',
          approverType: 'POSITION',
          approverConfig: '{"position_code":"DEPT_MANAGER"}',
          isRequired: 1,
          autoApprove: 0,
          tenantId: 1,
          createTime: '2026-02-26 10:00:00',
          updateBy: 'admin'
        },
        {
          id: 2,
          flowId: flow.id,
          nodeName: '人事审批',
          nodeCode: `${flow.flowType}_NODE_2`,
          nodeType: 'APPROVAL',
          nodeOrder: 2,
          approvalMode: 'OR',
          approverType: 'POSITION',
          approverConfig: '{"position_code":"HR_MANAGER"}',
          isRequired: 1,
          autoApprove: 0,
          tenantId: 1,
          createTime: '2026-02-26 10:00:00',
          updateBy: 'admin'
        },
        {
          id: 3,
          flowId: flow.id,
          nodeName: '总经理审批',
          nodeCode: `${flow.flowType}_NODE_3`,
          nodeType: 'APPROVAL',
          nodeOrder: 3,
          approvalMode: 'OR',
          approverType: 'POSITION',
          approverConfig: '{"position_code":"GENERAL_MANAGER"}',
          isRequired: 0,
          autoApprove: 0,
          tenantId: 1,
          createTime: '2026-02-26 10:00:00',
          updateBy: 'admin'
        }
      ]

      return {
        code: 200,
        message: 'success',
        data: {
          ...flow,
          nodes
        },
        timestamp: Date.now()
      }
    }
  },

  /**
   * 1.3 创建流程
   * POST /api/v1/approval-flows
   */
  {
    url: '/approval-flows',
    method: 'post',
    response: ({ body }) => {
      const data = JSON.parse(body)

      // 验证流程编码唯一性
      const exists = approvalFlows.some(item => item.flowCode === data.flowCode)
      if (exists) {
        return {
          code: 400,
          message: '流程编码已存在',
          data: null,
          timestamp: Date.now()
        }
      }

      const newFlow = {
        id: approvalFlows.length + 1,
        ...data,
        version: 1,
        tenantId: 1,
        createTime: new Date().toISOString().replace('T', ' ').substring(0, 19),
        updateTime: new Date().toISOString().replace('T', ' ').substring(0, 19),
        createBy: 'admin',
        updateBy: 'admin'
      }

      approvalFlows.push(newFlow)

      return {
        code: 201,
        message: '创建成功',
        data: { id: newFlow.id },
        timestamp: Date.now()
      }
    }
  },

  /**
   * 1.4 更新流程
   * PUT /api/v1/approval-flows/{id}
   */
  {
    url: /\/approval-flows\/\d+/,
    method: 'put',
    response: ({ url, body }) => {
      const id = parseInt(url.match(/\d+/)?.[0] || '0')
      const data = JSON.parse(body)
      const index = approvalFlows.findIndex(item => item.id === id)

      if (index === -1) {
        return {
          code: 404,
          message: '流程不存在',
          data: null,
          timestamp: Date.now()
        }
      }

      // 验证流程编码唯一性（排除自己）
      const exists = approvalFlows.some(
        item => item.flowCode === data.flowCode && item.id !== id
      )
      if (exists) {
        return {
          code: 400,
          message: '流程编码已存在',
          data: null,
          timestamp: Date.now()
        }
      }

      approvalFlows[index] = {
        ...approvalFlows[index],
        ...data,
        version: approvalFlows[index].version + 1,
        updateTime: new Date().toISOString().replace('T', ' ').substring(0, 19),
        updateBy: 'admin'
      }

      return {
        code: 200,
        message: '更新成功',
        data: approvalFlows[index],
        timestamp: Date.now()
      }
    }
  },

  /**
   * 1.5 删除流程
   * DELETE /api/v1/approval-flows/{id}
   */
  {
    url: /\/approval-flows\/\d+/,
    method: 'delete',
    response: ({ url }) => {
      const id = parseInt(url.match(/\d+/)?.[0] || '0')
      const index = approvalFlows.findIndex(item => item.id === id)

      if (index === -1) {
        return {
          code: 404,
          message: '流程不存在',
          data: null,
          timestamp: Date.now()
        }
      }

      // 检查是否被配置使用
      const isUsed = flowConfigs.some(config => config.flowId === id)
      if (isUsed) {
        return {
          code: 400,
          message: '该流程已被配置使用，无法删除',
          data: null,
          timestamp: Date.now()
        }
      }

      approvalFlows.splice(index, 1)

      return {
        code: 200,
        message: '删除成功',
        data: null,
        timestamp: Date.now()
      }
    }
  },

  /**
   * 1.6 启用/停用流程
   * PUT /api/v1/approval-flows/{id}/status
   */
  {
    url: /\/approval-flows\/\d+\/status/,
    method: 'put',
    response: ({ url, body }) => {
      const id = parseInt(url.match(/\d+/)?.[0] || '0')
      const { flowStatus } = JSON.parse(body)
      const index = approvalFlows.findIndex(item => item.id === id)

      if (index === -1) {
        return {
          code: 404,
          message: '流程不存在',
          data: null,
          timestamp: Date.now()
        }
      }

      approvalFlows[index].flowStatus = flowStatus
      approvalFlows[index].updateTime = new Date().toISOString().replace('T', ' ').substring(0, 19)
      approvalFlows[index].updateBy = 'admin'

      return {
        code: 200,
        message: '操作成功',
        data: null,
        timestamp: Date.now()
      }
    }
  },

  /**
   * 检查流程编码是否重复
   * GET /api/v1/approval-flows/check-code
   */
  {
    url: '/approval-flows/check-code',
    method: 'get',
    response: ({ query }) => {
      const { flowCode, id } = query
      const exists = approvalFlows.some(
        item => item.flowCode === flowCode && item.id != id
      )

      return {
        code: 200,
        message: 'success',
        data: exists,
        timestamp: Date.now()
      }
    }
  },

  // ============================================
  // 2. 流程配置接口
  // ============================================

  /**
   * 2.1 获取流程配置列表
   * GET /api/v1/flow-configs
   */
  {
    url: '/flow-configs',
    method: 'get',
    response: ({ query }) => {
      const { page = 1, pageSize = 10, businessCode, isEnabled } = query
      let filteredList = [...flowConfigs]

      // 按业务代码筛选
      if (businessCode) {
        filteredList = filteredList.filter(item => item.businessCode === businessCode)
      }

      // 按启用状态筛选
      if (isEnabled !== undefined) {
        filteredList = filteredList.filter(item => item.isEnabled === parseInt(isEnabled))
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
   * 2.2 创建流程配置
   * POST /api/v1/flow-configs
   */
  {
    url: '/flow-configs',
    method: 'post',
    response: ({ body }) => {
      const data = JSON.parse(body)

      // 验证业务代码唯一性
      const exists = flowConfigs.some(item => item.businessCode === data.businessCode)
      if (exists) {
        return {
          code: 400,
          message: '该业务已配置流程，请勿重复配置',
          data: null,
          timestamp: Date.now()
        }
      }

      // 验证流程是否存在
      const flow = approvalFlows.find(item => item.id === data.flowId)
      if (!flow) {
        return {
          code: 400,
          message: '选择的审批流程不存在',
          data: null,
          timestamp: Date.now()
        }
      }

      // 验证流程是否启用
      if (flow.flowStatus !== 'ENABLED') {
        return {
          code: 400,
          message: '选择的审批流程未启用',
          data: null,
          timestamp: Date.now()
        }
      }

      const newConfig = {
        id: flowConfigs.length + 1,
        ...data,
        flowName: flow.flowName,
        tenantId: 1,
        createTime: new Date().toISOString().replace('T', ' ').substring(0, 19),
        updateTime: new Date().toISOString().replace('T', ' ').substring(0, 19),
        createBy: 'admin',
        updateBy: 'admin'
      }

      flowConfigs.push(newConfig)

      return {
        code: 201,
        message: '创建成功',
        data: { id: newConfig.id },
        timestamp: Date.now()
      }
    }
  },

  /**
   * 2.3 更新流程配置
   * PUT /api/v1/flow-configs/{id}
   */
  {
    url: /\/flow-configs\/\d+/,
    method: 'put',
    response: ({ url, body }) => {
      const id = parseInt(url.match(/\d+/)?.[0] || '0')
      const data = JSON.parse(body)
      const index = flowConfigs.findIndex(item => item.id === id)

      if (index === -1) {
        return {
          code: 404,
          message: '配置不存在',
          data: null,
          timestamp: Date.now()
        }
      }

      // 验证流程是否存在
      const flow = approvalFlows.find(item => item.id === data.flowId)
      if (!flow) {
        return {
          code: 400,
          message: '选择的审批流程不存在',
          data: null,
          timestamp: Date.now()
        }
      }

      // 验证流程是否启用
      if (flow.flowStatus !== 'ENABLED') {
        return {
          code: 400,
          message: '选择的审批流程未启用',
          data: null,
          timestamp: Date.now()
        }
      }

      flowConfigs[index] = {
        ...flowConfigs[index],
        ...data,
        flowName: flow.flowName,
        updateTime: new Date().toISOString().replace('T', ' ').substring(0, 19),
        updateBy: 'admin'
      }

      return {
        code: 200,
        message: '更新成功',
        data: flowConfigs[index],
        timestamp: Date.now()
      }
    }
  },

  /**
   * 2.4 删除流程配置
   * DELETE /api/v1/flow-configs/{id}
   */
  {
    url: /\/flow-configs\/\d+/,
    method: 'delete',
    response: ({ url }) => {
      const id = parseInt(url.match(/\d+/)?.[0] || '0')
      const index = flowConfigs.findIndex(item => item.id === id)

      if (index === -1) {
        return {
          code: 404,
          message: '配置不存在',
          data: null,
          timestamp: Date.now()
        }
      }

      // 检查配置是否被使用（这里简化处理）
      const config = flowConfigs[index]
      if (config.isEnabled) {
        return {
          code: 400,
          message: '该配置已启用，请先禁用后再删除',
          data: null,
          timestamp: Date.now()
        }
      }

      flowConfigs.splice(index, 1)

      return {
        code: 200,
        message: '删除成功',
        data: null,
        timestamp: Date.now()
      }
    }
  },

  /**
   * 根据业务代码获取流程配置
   * GET /api/v1/flow-configs/business/{businessCode}
   */
  {
    url: /\/flow-configs\/business\/[A-Z_]+/,
    method: 'get',
    response: ({ url }) => {
      const businessCode = url.split('/').pop()
      const config = flowConfigs.find(item => item.businessCode === businessCode)

      if (!config) {
        return {
          code: 404,
          message: '未找到该业务的流程配置',
          data: null,
          timestamp: Date.now()
        }
      }

      return {
        code: 200,
        message: 'success',
        data: config,
        timestamp: Date.now()
      }
    }
  },

  // ============================================
  // 3. 辅助接口
  // ============================================

  /**
   * 获取可用的审批流程列表
   * GET /api/v1/approval-flows/available
   */
  {
    url: '/approval-flows/available',
    method: 'get',
    response: ({ query }) => {
      const { flowType } = query
      let filteredList = approvalFlows.filter(item => item.flowStatus === 'ENABLED')

      if (flowType) {
        filteredList = filteredList.filter(item => item.flowType === flowType)
      }

      return {
        code: 200,
        message: 'success',
        data: filteredList,
        timestamp: Date.now()
      }
    }
  },

  /**
   * 获取业务代码列表
   * GET /api/v1/flow-configs/business-codes
   */
  {
    url: '/flow-configs/business-codes',
    method: 'get',
    response: () => {
      return {
        code: 200,
        message: 'success',
        data: businessCodes,
        timestamp: Date.now()
      }
    }
  },

  /**
   * 获取流程节点列表
   * GET /api/v1/approval-flows/{id}/nodes
   */
  {
    url: /\/approval-flows\/\d+\/nodes/,
    method: 'get',
    response: ({ url }) => {
      const id = parseInt(url.match(/\d+/)?.[0] || '0')
      const flow = approvalFlows.find(item => item.id === id)

      if (!flow) {
        return {
          code: 404,
          message: '流程不存在',
          data: null,
          timestamp: Date.now()
        }
      }

      // 模拟节点数据
      const nodes = [
        {
          id: 1,
          flowId: flow.id,
          nodeName: '部门主管审批',
          nodeCode: `${flow.flowType}_NODE_1`,
          nodeType: 'APPROVAL',
          nodeOrder: 1,
          approvalMode: 'OR',
          approverType: 'POSITION',
          approverConfig: '{"position_code":"DEPT_MANAGER"}',
          isRequired: 1,
          autoApprove: 0
        },
        {
          id: 2,
          flowId: flow.id,
          nodeName: '人事审批',
          nodeCode: `${flow.flowType}_NODE_2`,
          nodeType: 'APPROVAL',
          nodeOrder: 2,
          approvalMode: 'OR',
          approverType: 'POSITION',
          approverConfig: '{"position_code":"HR_MANAGER"}',
          isRequired: 1,
          autoApprove: 0
        },
        {
          id: 3,
          flowId: flow.id,
          nodeName: '总经理审批',
          nodeCode: `${flow.flowType}_NODE_3`,
          nodeType: 'APPROVAL',
          nodeOrder: 3,
          approvalMode: 'OR',
          approverType: 'POSITION',
          approverConfig: '{"position_code":"GENERAL_MANAGER"}',
          isRequired: 0,
          autoApprove: 0
        }
      ]

      return {
        code: 200,
        message: 'success',
        data: nodes,
        timestamp: Date.now()
      }
    }
  },

  /**
   * 验证流程配置
   * POST /api/v1/approval-flows/validate
   */
  {
    url: '/approval-flows/validate',
    method: 'post',
    response: ({ body }) => {
      const data = JSON.parse(body)
      const errors = []

      // 验证流程名称
      if (!data.flowName || data.flowName.trim() === '') {
        errors.push('流程名称不能为空')
      }

      // 验证流程编码
      if (!data.flowCode || data.flowCode.trim() === '') {
        errors.push('流程编码不能为空')
      } else if (!/^[A-Z_]+$/.test(data.flowCode)) {
        errors.push('流程编码只能包含大写字母和下划线')
      }

      // 验证流程类型
      if (!data.flowType || data.flowType.trim() === '') {
        errors.push('流程类型不能为空')
      }

      // 验证节点配置
      if (!data.nodes || data.nodes.length === 0) {
        errors.push('至少需要配置一个审批节点')
      } else {
        data.nodes.forEach((node, index) => {
          if (!node.nodeName || node.nodeName.trim() === '') {
            errors.push(`第${index + 1}个节点名称不能为空`)
          }
          if (!node.approverType || node.approverType.trim() === '') {
            errors.push(`第${index + 1}个节点审批人类型不能为空`)
          }
          if (!node.approverConfig || node.approverConfig.trim() === '') {
            errors.push(`第${index + 1}个节点审批人配置不能为空`)
          }
        })
      }

      return {
        code: 200,
        message: 'success',
        data: {
          valid: errors.length === 0,
          errors: errors.length > 0 ? errors : undefined
        },
        timestamp: Date.now()
      }
    }
  }
]
