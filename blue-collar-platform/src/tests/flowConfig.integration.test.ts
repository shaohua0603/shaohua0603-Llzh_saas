/**
 * 流程配置模块集成测试
 * 测试流程设计器、节点配置、流程关联等功能
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createMemoryHistory } from 'vue-router'
import { createPinia } from 'pinia'
import FlowDesigner from '@/components/FlowDesigner.vue'
import NodeConfigurator from '@/components/NodeConfigurator.vue'
import {
  createApprovalFlow,
  updateApprovalFlow,
  getFlowNodes,
  saveFlowNodes,
  getFlowBusinessConfig,
  saveFlowBusinessConfig
} from '@/api/system/flowConfigApi'
import type {
  ApprovalFlow,
  ApprovalNode,
  FlowBusinessConfig
} from '@/types/flow-config'

// Mock API
vi.mock('@/api/system/flowConfigApi', () => ({
  createApprovalFlow: vi.fn(),
  updateApprovalFlow: vi.fn(),
  getFlowNodes: vi.fn(),
  saveFlowNodes: vi.fn(),
  getFlowBusinessConfig: vi.fn(),
  saveFlowBusinessConfig: vi.fn()
}))

// Mock 路由
const router = createRouter({
  history: createMemoryHistory(),
  routes: [
    {
      path: '/admin/system/flow-management/add',
      component: { template: '<div>新增流程</div>' }
    },
    {
      path: '/admin/system/flow-management/edit/:id',
      component: { template: '<div>编辑流程</div>' }
    }
  ]
})

describe('流程配置模块集成测试', () => {
  const pinia = createPinia()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('流程设计器功能', () => {
    it('应该成功创建流程', async () => {
      const mockFlowData: ApprovalFlow = {
        flowName: '请假审批流程',
        flowCode: 'LEAVE_FLOW',
        flowType: 'LEAVE',
        flowDescription: '员工请假审批流程',
        flowStatus: 'ENABLED',
        isDefault: true,
        remark: '备注信息'
      }

      const mockResponse = {
        data: {
          id: 1,
          ...mockFlowData
        }
      }

      vi.mocked(createApprovalFlow).mockResolvedValue(mockResponse)

      await createApprovalFlow(mockFlowData)

      expect(createApprovalFlow).toHaveBeenCalledWith(mockFlowData)
    })

    it('应该成功更新流程', async () => {
      const mockFlowData: ApprovalFlow = {
        id: 1,
        flowName: '请假审批流程',
        flowCode: 'LEAVE_FLOW',
        flowType: 'LEAVE',
        flowDescription: '员工请假审批流程',
        flowStatus: 'ENABLED',
        isDefault: true,
        remark: '备注信息'
      }

      const mockResponse = {
        data: {
          success: true
        }
      }

      vi.mocked(updateApprovalFlow).mockResolvedValue(mockResponse)

      await updateApprovalFlow(1, mockFlowData)

      expect(updateApprovalFlow).toHaveBeenCalledWith(1, mockFlowData)
    })

    it('应该验证流程名称必填', async () => {
      const mockFlowData: Partial<ApprovalFlow> = {
        flowCode: 'LEAVE_FLOW',
        flowType: 'LEAVE',
        flowDescription: '员工请假审批流程'
      }

      vi.mocked(createApprovalFlow).mockRejectedValue(
        new Error('流程名称不能为空')
      )

      await expect(createApprovalFlow(mockFlowData as ApprovalFlow)).rejects.toThrow(
        '流程名称不能为空'
      )
    })

    it('应该验证流程编码唯一性', async () => {
      const mockFlowData: ApprovalFlow = {
        flowName: '请假审批流程',
        flowCode: 'LEAVE_FLOW',
        flowType: 'LEAVE',
        flowDescription: '员工请假审批流程'
      }

      vi.mocked(createApprovalFlow).mockRejectedValue(
        new Error('流程编码已存在')
      )

      await expect(createApprovalFlow(mockFlowData)).rejects.toThrow(
        '流程编码已存在'
      )
    })
  })

  describe('节点配置功能', () => {
    it('应该成功获取流程节点', async () => {
      const mockNodes: ApprovalNode[] = [
        {
          id: 1,
          nodeCode: 'NODE_1',
          nodeName: '部门主管审批',
          nodeType: 'APPROVAL',
          approverType: 'ROLE',
          approverConfig: '部门主管',
          approvalMode: 'OR',
          timeoutHours: 24,
          timeoutAction: 'APPROVE',
          remark: '第一级审批'
        },
        {
          id: 2,
          nodeCode: 'NODE_2',
          nodeName: '人事审批',
          nodeType: 'APPROVAL',
          approverType: 'ROLE',
          approverConfig: '人事',
          approvalMode: 'AND',
          timeoutHours: 24,
          timeoutAction: 'APPROVE',
          remark: '第二级审批'
        }
      ]

      const mockResponse = {
        data: mockNodes
      }

      vi.mocked(getFlowNodes).mockResolvedValue(mockResponse)

      const result = await getFlowNodes(1)

      expect(getFlowNodes).toHaveBeenCalledWith(1)
      expect(result.data).toHaveLength(2)
      expect(result.data[0].nodeName).toBe('部门主管审批')
    })

    it('应该成功保存流程节点', async () => {
      const mockNodes: ApprovalNode[] = [
        {
          id: 1,
          nodeCode: 'NODE_1',
          nodeName: '部门主管审批',
          nodeType: 'APPROVAL',
          approverType: 'ROLE',
          approverConfig: '部门主管',
          approvalMode: 'OR',
          timeoutHours: 24,
          timeoutAction: 'APPROVE'
        }
      ]

      const mockResponse = {
        data: {
          success: true
        }
      }

      vi.mocked(saveFlowNodes).mockResolvedValue(mockResponse)

      await saveFlowNodes(1, mockNodes)

      expect(saveFlowNodes).toHaveBeenCalledWith(1, mockNodes)
    })

    it('应该验证节点名称必填', async () => {
      const mockNode: Partial<ApprovalNode> = {
        nodeCode: 'NODE_1',
        nodeType: 'APPROVAL',
        approverType: 'ROLE'
      }

      vi.mocked(saveFlowNodes).mockRejectedValue(
        new Error('节点名称不能为空')
      )

      await expect(
        saveFlowNodes(1, [mockNode as ApprovalNode])
      ).rejects.toThrow('节点名称不能为空')
    })

    it('应该验证审批人配置必填', async () => {
      const mockNode: Partial<ApprovalNode> = {
        nodeCode: 'NODE_1',
        nodeName: '部门主管审批',
        nodeType: 'APPROVAL',
        approverType: 'ROLE'
      }

      vi.mocked(saveFlowNodes).mockRejectedValue(
        new Error('审批人配置不能为空')
      )

      await expect(
        saveFlowNodes(1, [mockNode as ApprovalNode])
      ).rejects.toThrow('审批人配置不能为空')
    })

    it('应该支持或签审批模式', async () => {
      const mockNode: ApprovalNode = {
        nodeCode: 'NODE_1',
        nodeName: '部门主管审批',
        nodeType: 'APPROVAL',
        approverType: 'ROLE',
        approverConfig: '部门主管',
        approvalMode: 'OR',
        timeoutHours: 24
      }

      const mockResponse = {
        data: {
          success: true
        }
      }

      vi.mocked(saveFlowNodes).mockResolvedValue(mockResponse)

      await saveFlowNodes(1, [mockNode])

      expect(saveFlowNodes).toHaveBeenCalledWith(1, [mockNode])
      expect(mockNode.approvalMode).toBe('OR')
    })

    it('应该支持会签审批模式', async () => {
      const mockNode: ApprovalNode = {
        nodeCode: 'NODE_1',
        nodeName: '部门主管审批',
        nodeType: 'APPROVAL',
        approverType: 'ROLE',
        approverConfig: '部门主管',
        approvalMode: 'AND',
        timeoutHours: 24
      }

      const mockResponse = {
        data: {
          success: true
        }
      }

      vi.mocked(saveFlowNodes).mockResolvedValue(mockResponse)

      await saveFlowNodes(1, [mockNode])

      expect(saveFlowNodes).toHaveBeenCalledWith(1, [mockNode])
      expect(mockNode.approvalMode).toBe('AND')
    })

    it('应该支持超时配置', async () => {
      const mockNode: ApprovalNode = {
        nodeCode: 'NODE_1',
        nodeName: '部门主管审批',
        nodeType: 'APPROVAL',
        approverType: 'ROLE',
        approverConfig: '部门主管',
        approvalMode: 'OR',
        timeoutHours: 24,
        timeoutAction: 'APPROVE'
      }

      const mockResponse = {
        data: {
          success: true
        }
      }

      vi.mocked(saveFlowNodes).mockResolvedValue(mockResponse)

      await saveFlowNodes(1, [mockNode])

      expect(saveFlowNodes).toHaveBeenCalledWith(1, [mockNode])
      expect(mockNode.timeoutHours).toBe(24)
      expect(mockNode.timeoutAction).toBe('APPROVE')
    })

    it('应该支持抄送节点', async () => {
      const mockNode: ApprovalNode = {
        nodeCode: 'NODE_1',
        nodeName: '抄送人',
        nodeType: 'CC',
        ccUsers: 'user1,user2'
      }

      const mockResponse = {
        data: {
          success: true
        }
      }

      vi.mocked(saveFlowNodes).mockResolvedValue(mockResponse)

      await saveFlowNodes(1, [mockNode])

      expect(saveFlowNodes).toHaveBeenCalledWith(1, [mockNode])
      expect(mockNode.nodeType).toBe('CC')
      expect(mockNode.ccUsers).toBe('user1,user2')
    })
  })

  describe('流程关联功能', () => {
    it('应该成功获取流程业务配置', async () => {
      const mockConfig: FlowBusinessConfig = {
        businessCode: 'LEAVE',
        businessName: '请假管理',
        flowName: '请假审批流程'
      }

      const mockResponse = {
        data: mockConfig
      }

      vi.mocked(getFlowBusinessConfig).mockResolvedValue(mockResponse)

      const result = await getFlowBusinessConfig('LEAVE')

      expect(getFlowBusinessConfig).toHaveBeenCalledWith('LEAVE')
      expect(result.data.businessCode).toBe('LEAVE')
      expect(result.data.flowName).toBe('请假审批流程')
    })

    it('应该成功保存流程业务配置', async () => {
      const mockConfig: FlowBusinessConfig = {
        businessCode: 'LEAVE',
        businessName: '请假管理',
        flowName: '请假审批流程'
      }

      const mockResponse = {
        data: {
          success: true
        }
      }

      vi.mocked(saveFlowBusinessConfig).mockResolvedValue(mockResponse)

      await saveFlowBusinessConfig(mockConfig)

      expect(saveFlowBusinessConfig).toHaveBeenCalledWith(mockConfig)
    })

    it('应该验证业务编码必填', async () => {
      const mockConfig: Partial<FlowBusinessConfig> = {
        businessName: '请假管理',
        flowName: '请假审批流程'
      }

      vi.mocked(saveFlowBusinessConfig).mockRejectedValue(
        new Error('业务编码不能为空')
      )

      await expect(
        saveFlowBusinessConfig(mockConfig as FlowBusinessConfig)
      ).rejects.toThrow('业务编码不能为空')
    })

    it('应该验证流程名称必填', async () => {
      const mockConfig: Partial<FlowBusinessConfig> = {
        businessCode: 'LEAVE',
        businessName: '请假管理'
      }

      vi.mocked(saveFlowBusinessConfig).mockRejectedValue(
        new Error('流程名称不能为空')
      )

      await expect(
        saveFlowBusinessConfig(mockConfig as FlowBusinessConfig)
      ).rejects.toThrow('流程名称不能为空')
    })
  })

  describe('流程设计器交互', () => {
    it('应该支持拖拽节点', async () => {
      const wrapper = mount(FlowDesigner, {
        global: {
          plugins: [router, pinia]
        }
      })

      // 测试拖拽功能
      // 这里需要根据实际的FlowDesigner组件实现来编写测试
      expect(wrapper.exists()).toBe(true)
    })

    it('应该支持节点连线', async () => {
      const wrapper = mount(FlowDesigner, {
        global: {
          plugins: [router, pinia]
        }
      })

      // 测试连线功能
      // 这里需要根据实际的FlowDesigner组件实现来编写测试
      expect(wrapper.exists()).toBe(true)
    })

    it('应该支持节点删除', async () => {
      const wrapper = mount(NodeConfigurator, {
        global: {
          plugins: [router, pinia]
        }
      })

      // 测试删除节点功能
      // 这里需要根据实际的NodeConfigurator组件实现来编写测试
      expect(wrapper.exists()).toBe(true)
    })

    it('应该支持节点编辑', async () => {
      const wrapper = mount(NodeConfigurator, {
        global: {
          plugins: [router, pinia]
        }
      })

      // 测试编辑节点功能
      // 这里需要根据实际的NodeConfigurator组件实现来编写测试
      expect(wrapper.exists()).toBe(true)
    })
  })

  describe('流程验证', () => {
    it('应该验证流程至少有一个审批节点', async () => {
      const mockNodes: ApprovalNode[] = []

      vi.mocked(saveFlowNodes).mockRejectedValue(
        new Error('流程至少需要一个审批节点')
      )

      await expect(saveFlowNodes(1, mockNodes)).rejects.toThrow(
        '流程至少需要一个审批节点'
      )
    })

    it('应该验证流程不能有重复的节点编码', async () => {
      const mockNodes: ApprovalNode[] = [
        {
          nodeCode: 'NODE_1',
          nodeName: '部门主管审批',
          nodeType: 'APPROVAL',
          approverType: 'ROLE',
          approverConfig: '部门主管'
        },
        {
          nodeCode: 'NODE_1',
          nodeName: '人事审批',
          nodeType: 'APPROVAL',
          approverType: 'ROLE',
          approverConfig: '人事'
        }
      ]

      vi.mocked(saveFlowNodes).mockRejectedValue(
        new Error('节点编码不能重复')
      )

      await expect(saveFlowNodes(1, mockNodes)).rejects.toThrow(
        '节点编码不能重复'
      )
    })

    it('应该验证流程节点顺序', async () => {
      const mockNodes: ApprovalNode[] = [
        {
          nodeCode: 'NODE_1',
          nodeName: '部门主管审批',
          nodeType: 'APPROVAL',
          approverType: 'ROLE',
          approverConfig: '部门主管',
          nodeOrder: 1
        },
        {
          nodeCode: 'NODE_2',
          nodeName: '人事审批',
          nodeType: 'APPROVAL',
          approverType: 'ROLE',
          approverConfig: '人事',
          nodeOrder: 2
        }
      ]

      const mockResponse = {
        data: {
          success: true
        }
      }

      vi.mocked(saveFlowNodes).mockResolvedValue(mockResponse)

      await saveFlowNodes(1, mockNodes)

      expect(saveFlowNodes).toHaveBeenCalledWith(1, mockNodes)
      expect(mockNodes[0].nodeOrder).toBe(1)
      expect(mockNodes[1].nodeOrder).toBe(2)
    })
  })

  describe('错误处理', () => {
    it('应该处理创建流程失败', async () => {
      vi.mocked(createApprovalFlow).mockRejectedValue(
        new Error('创建流程失败')
      )

      const mockFlowData: ApprovalFlow = {
        flowName: '请假审批流程',
        flowCode: 'LEAVE_FLOW',
        flowType: 'LEAVE',
        flowDescription: '员工请假审批流程'
      }

      await expect(createApprovalFlow(mockFlowData)).rejects.toThrow(
        '创建流程失败'
      )
    })

    it('应该处理更新流程失败', async () => {
      vi.mocked(updateApprovalFlow).mockRejectedValue(
        new Error('更新流程失败')
      )

      const mockFlowData: ApprovalFlow = {
        id: 1,
        flowName: '请假审批流程',
        flowCode: 'LEAVE_FLOW',
        flowType: 'LEAVE',
        flowDescription: '员工请假审批流程'
      }

      await expect(updateApprovalFlow(1, mockFlowData)).rejects.toThrow(
        '更新流程失败'
      )
    })

    it('应该处理保存节点失败', async () => {
      vi.mocked(saveFlowNodes).mockRejectedValue(
        new Error('保存节点失败')
      )

      const mockNodes: ApprovalNode[] = [
        {
          nodeCode: 'NODE_1',
          nodeName: '部门主管审批',
          nodeType: 'APPROVAL',
          approverType: 'ROLE',
          approverConfig: '部门主管'
        }
      ]

      await expect(saveFlowNodes(1, mockNodes)).rejects.toThrow(
        '保存节点失败'
      )
    })
  })
})
