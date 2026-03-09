/**
 * 工作流配置Mock数据
 */

import Mock from 'mockjs'

// 工作流列表数据
const workflowList = [
  {
    id: 1,
    flowName: '请假审批流程',
    flowCode: 'LEAVE_APPROVAL',
    flowType: 'APPROVAL',
    flowStatus: 'ENABLED',
    flowDescription: '员工请假审批流程',
    createTime: '2024-01-01 10:00:00',
    updateTime: '2024-01-01 10:00:00',
    xmlData: JSON.stringify({
      nodes: [
        {
          id: 'start',
          type: 'start',
          x: 100,
          y: 200,
          properties: {
            text: '开始',
            nodeType: 'start'
          }
        },
        {
          id: 'approval1',
          type: 'approval',
          x: 300,
          y: 200,
          properties: {
            text: '部门经理审批',
            nodeType: 'approval',
            approvalMode: 'or',
            approverType: 'position',
            approver: '部门经理',
            timeoutHours: 24,
            timeoutAction: 'notify'
          }
        },
        {
          id: 'cc1',
          type: 'cc',
          x: 500,
          y: 200,
          properties: {
            text: '抄送HR',
            nodeType: 'cc',
            ccType: 'user',
            ccUser: 'HR专员'
          }
        },
        {
          id: 'approval2',
          type: 'approval',
          x: 700,
          y: 200,
          properties: {
            text: '人力资源审批',
            nodeType: 'approval',
            approvalMode: 'and',
            approverType: 'role',
            approver: '人事主管',
            timeoutHours: 48,
            timeoutAction: 'auto_pass'
          }
        },
        {
          id: 'end',
          type: 'end',
          x: 900,
          y: 200,
          properties: {
            text: '结束',
            nodeType: 'end'
          }
        }
      ],
      edges: [
        {
          id: 'edge1',
          sourceNodeId: 'start',
          targetNodeId: 'approval1'
        },
        {
          id: 'edge2',
          sourceNodeId: 'approval1',
          targetNodeId: 'cc1'
        },
        {
          id: 'edge3',
          sourceNodeId: 'cc1',
          targetNodeId: 'approval2'
        },
        {
          id: 'edge4',
          sourceNodeId: 'approval2',
          targetNodeId: 'end'
        }
      ]
    })
  },
  {
    id: 2,
    flowName: '调岗申请流程',
    flowCode: 'TRANSFER_APPLICATION',
    flowType: 'APPROVAL',
    flowStatus: 'ENABLED',
    flowDescription: '员工调岗申请流程，包含条件分支',
    createTime: '2024-01-02 10:00:00',
    updateTime: '2024-01-02 10:00:00',
    xmlData: JSON.stringify({
      nodes: [
        {
          id: 'start',
          type: 'start',
          x: 100,
          y: 200,
          properties: {
            text: '开始',
            nodeType: 'start'
          }
        },
        {
          id: 'approval1',
          type: 'approval',
          x: 250,
          y: 200,
          properties: {
            text: '原部门经理审批',
            nodeType: 'approval',
            approvalMode: 'or',
            approverType: 'user',
            approver: '张经理',
            timeoutHours: 24,
            timeoutAction: 'notify'
          }
        },
        {
          id: 'condition1',
          type: 'condition',
          x: 400,
          y: 200,
          properties: {
            text: '是否同级别调岗',
            nodeType: 'condition',
            condition: 'transferLevel == "same"',
            branchLabel: '同级别/升级'
          }
        },
        {
          id: 'approval2a',
          type: 'approval',
          x: 550,
          y: 100,
          properties: {
            text: '新部门经理审批',
            nodeType: 'approval',
            approvalMode: 'or',
            approverType: 'user',
            approver: '李经理',
            timeoutHours: 24,
            timeoutAction: 'notify'
          }
        },
        {
          id: 'approval2b',
          type: 'approval',
          x: 550,
          y: 300,
          properties: {
            text: '总经理审批',
            nodeType: 'approval',
            approvalMode: 'or',
            approverType: 'role',
            approver: '总经理',
            timeoutHours: 48,
            timeoutAction: 'auto_reject'
          }
        },
        {
          id: 'approval3',
          type: 'approval',
          x: 700,
          y: 200,
          properties: {
            text: '人力资源审批',
            nodeType: 'approval',
            approvalMode: 'and',
            approverType: 'position',
            approver: '人事经理',
            timeoutHours: 24,
            timeoutAction: 'notify'
          }
        },
        {
          id: 'end',
          type: 'end',
          x: 850,
          y: 200,
          properties: {
            text: '结束',
            nodeType: 'end'
          }
        }
      ],
      edges: [
        {
          id: 'edge1',
          sourceNodeId: 'start',
          targetNodeId: 'approval1'
        },
        {
          id: 'edge2',
          sourceNodeId: 'approval1',
          targetNodeId: 'condition1'
        },
        {
          id: 'edge3a',
          sourceNodeId: 'condition1',
          targetNodeId: 'approval2a',
          properties: { condition: 'same' }
        },
        {
          id: 'edge3b',
          sourceNodeId: 'condition1',
          targetNodeId: 'approval2b',
          properties: { condition: 'upgrade' }
        },
        {
          id: 'edge4a',
          sourceNodeId: 'approval2a',
          targetNodeId: 'approval3'
        },
        {
          id: 'edge4b',
          sourceNodeId: 'approval2b',
          targetNodeId: 'approval3'
        },
        {
          id: 'edge5',
          sourceNodeId: 'approval3',
          targetNodeId: 'end'
        }
      ]
    })
  },
  {
    id: 3,
    flowName: '离职流程',
    flowCode: 'RESIGNATION',
    flowType: 'APPROVAL',
    flowStatus: 'DISABLED',
    flowDescription: '员工离职流程，包含多个审批节点和抄送',
    createTime: '2024-01-03 10:00:00',
    updateTime: '2024-01-03 10:00:00',
    xmlData: JSON.stringify({
      nodes: [
        {
          id: 'start',
          type: 'start',
          x: 100,
          y: 200,
          properties: {
            text: '开始',
            nodeType: 'start'
          }
        },
        {
          id: 'approval1',
          type: 'approval',
          x: 280,
          y: 200,
          properties: {
            text: '直属主管审批',
            nodeType: 'approval',
            approvalMode: 'or',
            approverType: 'department',
            approver: '直属主管',
            timeoutHours: 24,
            timeoutAction: 'notify'
          }
        },
        {
          id: 'cc1',
          type: 'cc',
          x: 420,
          y: 200,
          properties: {
            text: '抄送部门负责人',
            nodeType: 'cc',
            ccType: 'position',
            ccUser: '部门负责人'
          }
        },
        {
          id: 'approval2',
          type: 'approval',
          x: 560,
          y: 200,
          properties: {
            text: '人力资源审批',
            nodeType: 'approval',
            approvalMode: 'and',
            approverType: 'position',
            approver: '人事专员',
            timeoutHours: 24,
            timeoutAction: 'notify'
          }
        },
        {
          id: 'approval3',
          type: 'approval',
          x: 700,
          y: 200,
          properties: {
            text: '财务审批',
            nodeType: 'approval',
            approvalMode: 'or',
            approverType: 'role',
            approver: '财务主管',
            timeoutHours: 48,
            timeoutAction: 'auto_pass'
          }
        },
        {
          id: 'cc2',
          type: 'cc',
          x: 840,
          y: 200,
          properties: {
            text: '抄送IT和行政',
            nodeType: 'cc',
            ccType: 'department',
            ccUser: 'IT部门,行政部门'
          }
        },
        {
          id: 'end',
          type: 'end',
          x: 980,
          y: 200,
          properties: {
            text: '结束',
            nodeType: 'end'
          }
        }
      ],
      edges: [
        {
          id: 'edge1',
          sourceNodeId: 'start',
          targetNodeId: 'approval1'
        },
        {
          id: 'edge2',
          sourceNodeId: 'approval1',
          targetNodeId: 'cc1'
        },
        {
          id: 'edge3',
          sourceNodeId: 'cc1',
          targetNodeId: 'approval2'
        },
        {
          id: 'edge4',
          sourceNodeId: 'approval2',
          targetNodeId: 'approval3'
        },
        {
          id: 'edge5',
          sourceNodeId: 'approval3',
          targetNodeId: 'cc2'
        },
        {
          id: 'edge6',
          sourceNodeId: 'cc2',
          targetNodeId: 'end'
        }
      ]
    })
  },
  {
    id: 4,
    flowName: '费用报销流程',
    flowCode: 'EXPENSE_APPROVAL',
    flowType: 'APPROVAL',
    flowStatus: 'ENABLED',
    flowDescription: '员工费用报销审批流程，根据金额自动选择审批路径',
    createTime: '2024-01-04 10:00:00',
    updateTime: '2024-01-04 10:00:00',
    xmlData: JSON.stringify({
      nodes: [
        {
          id: 'start',
          type: 'start',
          x: 100,
          y: 200,
          properties: {
            text: '开始',
            nodeType: 'start'
          }
        },
        {
          id: 'condition1',
          type: 'condition',
          x: 250,
          y: 200,
          properties: {
            text: '报销金额判断',
            nodeType: 'condition',
            condition: 'amount <= 5000',
            branchLabel: '<=5000/>5000'
          }
        },
        {
          id: 'approval1a',
          type: 'approval',
          x: 400,
          y: 100,
          properties: {
            text: '部门经理审批',
            nodeType: 'approval',
            approvalMode: 'or',
            approverType: 'position',
            approver: '部门经理',
            timeoutHours: 24,
            timeoutAction: 'notify'
          }
        },
        {
          id: 'approval1b',
          type: 'approval',
          x: 400,
          y: 300,
          properties: {
            text: '部门经理审批',
            nodeType: 'approval',
            approvalMode: 'or',
            approverType: 'position',
            approver: '部门经理',
            timeoutHours: 24,
            timeoutAction: 'notify'
          }
        },
        {
          id: 'condition2',
          type: 'condition',
          x: 550,
          y: 300,
          properties: {
            text: '金额判断',
            nodeType: 'condition',
            condition: 'amount > 10000',
            branchLabel: '5000-10000/>10000'
          }
        },
        {
          id: 'approval2',
          type: 'approval',
          x: 700,
          y: 200,
          properties: {
            text: '财务审批',
            nodeType: 'approval',
            approvalMode: 'or',
            approverType: 'role',
            approver: '财务专员',
            timeoutHours: 24,
            timeoutAction: 'auto_pass'
          }
        },
        {
          id: 'approval3',
          type: 'approval',
          x: 850,
          y: 350,
          properties: {
            text: '总经理审批',
            nodeType: 'approval',
            approvalMode: 'or',
            approverType: 'role',
            approver: '总经理',
            timeoutHours: 48,
            timeoutAction: 'auto_reject'
          }
        },
        {
          id: 'end',
          type: 'end',
          x: 1000,
          y: 250,
          properties: {
            text: '结束',
            nodeType: 'end'
          }
        }
      ],
      edges: [
        {
          id: 'edge1',
          sourceNodeId: 'start',
          targetNodeId: 'condition1'
        },
        {
          id: 'edge2a',
          sourceNodeId: 'condition1',
          targetNodeId: 'approval1a',
          properties: { branchLabel: 'small' }
        },
        {
          id: 'edge2b',
          sourceNodeId: 'condition1',
          targetNodeId: 'approval1b',
          properties: { branchLabel: 'large' }
        },
        {
          id: 'edge3',
          sourceNodeId: 'approval1a',
          targetNodeId: 'approval2'
        },
        {
          id: 'edge4a',
          sourceNodeId: 'condition2',
          targetNodeId: 'approval2',
          properties: { branchLabel: 'medium' }
        },
        {
          id: 'edge4b',
          sourceNodeId: 'condition2',
          targetNodeId: 'approval3',
          properties: { branchLabel: 'large' }
        },
        {
          id: 'edge5',
          sourceNodeId: 'approval2',
          targetNodeId: 'end'
        },
        {
          id: 'edge6',
          sourceNodeId: 'approval3',
          targetNodeId: 'end'
        }
      ]
    })
  }
]

// Mock API
Mock.mock(/\/api\/v1\/workflows(\?.*)?$/, 'get', (config) => {
  const params = config.params || {}
  const { page = 1, pageSize = 10, flowName, flowType, flowStatus } = params
  
  let filteredList = [...workflowList]
  
  // 过滤
  if (flowName) {
    filteredList = filteredList.filter(item => item.flowName.includes(flowName))
  }
  if (flowType) {
    filteredList = filteredList.filter(item => item.flowType === flowType)
  }
  if (flowStatus) {
    filteredList = filteredList.filter(item => item.flowStatus === flowStatus)
  }
  
  // 分页
  const start = (page - 1) * pageSize
  const end = start + pageSize
  const paginatedList = filteredList.slice(start, end)
  
  return {
    list: paginatedList,
    total: filteredList.length,
    page: Number(page),
    pageSize: Number(pageSize)
  }
})

Mock.mock(/\/api\/v1\/workflows\/\d+/, 'get', (config) => {
  const id = parseInt(config.url.split('/').pop())
  const workflow = workflowList.find(item => item.id === id)
  return workflow || {}
})

Mock.mock(/\/api\/v1\/workflows$/, 'post', (config) => {
  const data = JSON.parse(config.body)
  const newWorkflow = {
    id: workflowList.length + 1,
    ...data,
    createTime: new Date().toISOString().slice(0, 19).replace('T', ' '),
    updateTime: new Date().toISOString().slice(0, 19).replace('T', ' ')
  }
  workflowList.push(newWorkflow)
  return newWorkflow
})

Mock.mock(/\/api\/v1\/workflows\/\d+/, 'put', (config) => {
  const id = parseInt(config.url.split('/').pop())
  const data = JSON.parse(config.body)
  const index = workflowList.findIndex(item => item.id === id)
  if (index !== -1) {
    workflowList[index] = {
      ...workflowList[index],
      ...data,
      updateTime: new Date().toISOString().slice(0, 19).replace('T', ' ')
    }
    return workflowList[index]
  }
  return {}
})

Mock.mock(/\/api\/v1\/workflows\/\d+/, 'delete', (config) => {
  const id = parseInt(config.url.split('/').pop())
  const index = workflowList.findIndex(item => item.id === id)
  if (index !== -1) {
    workflowList.splice(index, 1)
  }
  return {}
})

Mock.mock(/\/api\/v1\/workflows\/\d+\/copy/, 'post', (config) => {
  const id = parseInt(config.url.split('/')[5])
  const originalWorkflow = workflowList.find(item => item.id === id)
  if (originalWorkflow) {
    const newWorkflow = {
      id: workflowList.length + 1,
      flowName: `${originalWorkflow.flowName} (复制)`,
      flowCode: `${originalWorkflow.flowCode}_copy`,
      flowType: originalWorkflow.flowType,
      flowStatus: originalWorkflow.flowStatus,
      flowDescription: originalWorkflow.flowDescription,
      xmlData: originalWorkflow.xmlData,
      createTime: new Date().toISOString().slice(0, 19).replace('T', ' '),
      updateTime: new Date().toISOString().slice(0, 19).replace('T', ' ')
    }
    workflowList.push(newWorkflow)
    return newWorkflow
  }
  return {}
})

Mock.mock(/\/api\/v1\/workflows\/\d+\/status/, 'patch', (config) => {
  const id = parseInt(config.url.split('/')[5])
  const data = JSON.parse(config.body)
  const index = workflowList.findIndex(item => item.id === id)
  if (index !== -1) {
    workflowList[index] = {
      ...workflowList[index],
      flowStatus: data.flowStatus,
      updateTime: new Date().toISOString().slice(0, 19).replace('T', ' ')
    }
    return workflowList[index]
  }
  return {}
})

export default workflowList
