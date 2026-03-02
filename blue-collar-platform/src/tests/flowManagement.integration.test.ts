/**
 * 流程管理模块集成测试
 * 测试流程列表、详情、新增、编辑、删除等完整功能
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createMemoryHistory } from 'vue-router'
import { createPinia } from 'pinia'
import FlowManagement from '@/views/admin/system/FlowManagement.vue'
import FlowManagementDetail from '@/views/admin/system/FlowManagementDetail.vue'
import {
  getApprovalFlowList,
  getApprovalFlowDetail,
  createApprovalFlow,
  updateApprovalFlow,
  deleteApprovalFlow,
  updateApprovalFlowStatus
} from '@/api/system/flowConfigApi'
import type { ApprovalFlow, ApprovalFlowQueryParams } from '@/types/flow-config'
import { FlowStatus } from '@/types/flow-config'

// Mock API
vi.mock('@/api/system/flowConfigApi', () => ({
  getApprovalFlowList: vi.fn(),
  getApprovalFlowDetail: vi.fn(),
  createApprovalFlow: vi.fn(),
  updateApprovalFlow: vi.fn(),
  deleteApprovalFlow: vi.fn(),
  updateApprovalFlowStatus: vi.fn()
}))

// Mock 路由
const router = createRouter({
  history: createMemoryHistory(),
  routes: [
    {
      path: '/admin/system/flow-management',
      component: FlowManagement
    },
    {
      path: '/admin/system/flow-management/view/:id',
      component: FlowManagementDetail
    },
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

// Mock 数据权限
vi.mock('@/composables/useDataPermission', () => ({
  useDataPermission: () => ({
    initialize: vi.fn().mockResolvedValue(undefined),
    generateFilter: vi.fn().mockReturnValue({}),
    isAdmin: vi.fn().mockReturnValue(false)
  })
}))

describe('流程管理模块集成测试', () => {
  const pinia = createPinia()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('流程列表功能', () => {
    it('应该成功加载流程列表', async () => {
      const mockData = {
        data: {
          list: [
            {
              id: 1,
              flowName: '请假审批流程',
              flowCode: 'LEAVE_FLOW',
              flowType: 'LEAVE',
              flowDescription: '员工请假审批流程',
              flowStatus: FlowStatus.ENABLED,
              nodeCount: 3,
              isDefault: true,
              createTime: '2024-01-01 10:00:00',
              updateTime: '2024-01-01 10:00:00'
            }
          ],
          total: 1,
          page: 1,
          pageSize: 10
        }
      }

      vi.mocked(getApprovalFlowList).mockResolvedValue(mockData)

      const wrapper = mount(FlowManagement, {
        global: {
          plugins: [router, pinia]
        }
      })

      await new Promise(resolve => setTimeout(resolve, 100))

      expect(getApprovalFlowList).toHaveBeenCalled()
      expect(wrapper.vm.tableData).toHaveLength(1)
      expect(wrapper.vm.tableData[0].flowName).toBe('请假审批流程')
    })

    it('应该支持按流程名称搜索', async () => {
      const mockData = {
        data: {
          list: [
            {
              id: 1,
              flowName: '请假审批流程',
              flowCode: 'LEAVE_FLOW',
              flowType: 'LEAVE',
              flowDescription: '员工请假审批流程',
              flowStatus: FlowStatus.ENABLED,
              nodeCount: 3,
              isDefault: true,
              createTime: '2024-01-01 10:00:00',
              updateTime: '2024-01-01 10:00:00'
            }
          ],
          total: 1,
          page: 1,
          pageSize: 10
        }
      }

      vi.mocked(getApprovalFlowList).mockResolvedValue(mockData)

      const wrapper = mount(FlowManagement, {
        global: {
          plugins: [router, pinia]
        }
      })

      await new Promise(resolve => setTimeout(resolve, 100))

      // 设置搜索关键词
      wrapper.vm.queryParams.keyword = '请假'
      await wrapper.vm.handleSearch()

      expect(getApprovalFlowList).toHaveBeenCalledWith(
        expect.objectContaining({
          keyword: '请假'
        })
      )
    })

    it('应该支持按流程类型筛选', async () => {
      const mockData = {
        data: {
          list: [],
          total: 0,
          page: 1,
          pageSize: 10
        }
      }

      vi.mocked(getApprovalFlowList).mockResolvedValue(mockData)

      const wrapper = mount(FlowManagement, {
        global: {
          plugins: [router, pinia]
        }
      })

      await new Promise(resolve => setTimeout(resolve, 100))

      // 设置流程类型
      wrapper.vm.queryParams.flowType = 'LEAVE'
      await wrapper.vm.handleSearch()

      expect(getApprovalFlowList).toHaveBeenCalledWith(
        expect.objectContaining({
          flowType: 'LEAVE'
        })
      )
    })

    it('应该支持按流程状态筛选', async () => {
      const mockData = {
        data: {
          list: [],
          total: 0,
          page: 1,
          pageSize: 10
        }
      }

      vi.mocked(getApprovalFlowList).mockResolvedValue(mockData)

      const wrapper = mount(FlowManagement, {
        global: {
          plugins: [router, pinia]
        }
      })

      await new Promise(resolve => setTimeout(resolve, 100))

      // 设置流程状态
      wrapper.vm.queryParams.flowStatus = FlowStatus.ENABLED
      await wrapper.vm.handleSearch()

      expect(getApprovalFlowList).toHaveBeenCalledWith(
        expect.objectContaining({
          flowStatus: FlowStatus.ENABLED
        })
      )
    })

    it('应该支持重置搜索条件', async () => {
      const mockData = {
        data: {
          list: [],
          total: 0,
          page: 1,
          pageSize: 10
        }
      }

      vi.mocked(getApprovalFlowList).mockResolvedValue(mockData)

      const wrapper = mount(FlowManagement, {
        global: {
          plugins: [router, pinia]
        }
      })

      await new Promise(resolve => setTimeout(resolve, 100))

      // 设置搜索条件
      wrapper.vm.queryParams.keyword = '请假'
      wrapper.vm.queryParams.flowType = 'LEAVE'
      wrapper.vm.queryParams.flowStatus = FlowStatus.ENABLED

      // 重置
      await wrapper.vm.handleReset()

      expect(wrapper.vm.queryParams.keyword).toBe('')
      expect(wrapper.vm.queryParams.flowType).toBe('')
      expect(wrapper.vm.queryParams.flowStatus).toBeUndefined()
    })

    it('应该支持分页功能', async () => {
      const mockData = {
        data: {
          list: [],
          total: 20,
          page: 2,
          pageSize: 10
        }
      }

      vi.mocked(getApprovalFlowList).mockResolvedValue(mockData)

      const wrapper = mount(FlowManagement, {
        global: {
          plugins: [router, pinia]
        }
      })

      await new Promise(resolve => setTimeout(resolve, 100))

      // 切换页码
      await wrapper.vm.handlePageChange(2)

      expect(wrapper.vm.currentPage).toBe(2)
      expect(getApprovalFlowList).toHaveBeenCalledWith(
        expect.objectContaining({
          page: 2
        })
      )
    })

    it('应该支持修改每页条数', async () => {
      const mockData = {
        data: {
          list: [],
          total: 20,
          page: 1,
          pageSize: 20
        }
      }

      vi.mocked(getApprovalFlowList).mockResolvedValue(mockData)

      const wrapper = mount(FlowManagement, {
        global: {
          plugins: [router, pinia]
        }
      })

      await new Promise(resolve => setTimeout(resolve, 100))

      // 修改每页条数
      await wrapper.vm.handleSizeChange(20)

      expect(wrapper.vm.pageSize).toBe(20)
      expect(wrapper.vm.currentPage).toBe(1)
      expect(getApprovalFlowList).toHaveBeenCalledWith(
        expect.objectContaining({
          pageSize: 20
        })
      )
    })
  })

  describe('流程详情功能', () => {
    it('应该成功加载流程详情', async () => {
      const mockData = {
        data: {
          id: 1,
          flowName: '请假审批流程',
          flowCode: 'LEAVE_FLOW',
          flowType: 'LEAVE',
          flowDescription: '员工请假审批流程',
          flowStatus: FlowStatus.ENABLED,
          nodeCount: 3,
          isDefault: true,
          createTime: '2024-01-01 10:00:00',
          updateTime: '2024-01-01 10:00:00',
          remark: '备注信息',
          nodes: [
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
            }
          ]
        }
      }

      vi.mocked(getApprovalFlowDetail).mockResolvedValue(mockData)

      await router.push('/admin/system/flow-management/view/1')
      await router.isReady()

      const wrapper = mount(FlowManagementDetail, {
        global: {
          plugins: [router, pinia]
        }
      })

      await new Promise(resolve => setTimeout(resolve, 100))

      expect(getApprovalFlowDetail).toHaveBeenCalledWith(1)
      expect(wrapper.vm.flowData).toBeDefined()
      expect(wrapper.vm.flowData?.flowName).toBe('请假审批流程')
      expect(wrapper.vm.flowData?.nodes).toHaveLength(1)
    })

    it('应该显示流程基本信息', async () => {
      const mockData = {
        data: {
          id: 1,
          flowName: '请假审批流程',
          flowCode: 'LEAVE_FLOW',
          flowType: 'LEAVE',
          flowDescription: '员工请假审批流程',
          flowStatus: FlowStatus.ENABLED,
          nodeCount: 3,
          isDefault: true,
          createTime: '2024-01-01 10:00:00',
          updateTime: '2024-01-01 10:00:00',
          remark: '备注信息',
          nodes: []
        }
      }

      vi.mocked(getApprovalFlowDetail).mockResolvedValue(mockData)

      await router.push('/admin/system/flow-management/view/1')
      await router.isReady()

      const wrapper = mount(FlowManagementDetail, {
        global: {
          plugins: [router, pinia]
        }
      })

      await new Promise(resolve => setTimeout(resolve, 100))

      expect(wrapper.vm.flowData?.flowName).toBe('请假审批流程')
      expect(wrapper.vm.flowData?.flowCode).toBe('LEAVE_FLOW')
      expect(wrapper.vm.flowData?.flowType).toBe('LEAVE')
      expect(wrapper.vm.flowData?.flowStatus).toBe(FlowStatus.ENABLED)
      expect(wrapper.vm.flowData?.nodeCount).toBe(3)
      expect(wrapper.vm.flowData?.isDefault).toBe(true)
    })

    it('应该显示审批节点信息', async () => {
      const mockData = {
        data: {
          id: 1,
          flowName: '请假审批流程',
          flowCode: 'LEAVE_FLOW',
          flowType: 'LEAVE',
          flowDescription: '员工请假审批流程',
          flowStatus: FlowStatus.ENABLED,
          nodeCount: 3,
          isDefault: true,
          createTime: '2024-01-01 10:00:00',
          updateTime: '2024-01-01 10:00:00',
          nodes: [
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
        }
      }

      vi.mocked(getApprovalFlowDetail).mockResolvedValue(mockData)

      await router.push('/admin/system/flow-management/view/1')
      await router.isReady()

      const wrapper = mount(FlowManagementDetail, {
        global: {
          plugins: [router, pinia]
        }
      })

      await new Promise(resolve => setTimeout(resolve, 100))

      expect(wrapper.vm.flowData?.nodes).toHaveLength(2)
      expect(wrapper.vm.flowData?.nodes[0].nodeName).toBe('部门主管审批')
      expect(wrapper.vm.flowData?.nodes[1].nodeName).toBe('人事审批')
    })
  })

  describe('流程操作功能', () => {
    it('应该支持跳转到新增页面', async () => {
      const wrapper = mount(FlowManagement, {
        global: {
          plugins: [router, pinia]
        }
      })

      await wrapper.vm.handleAdd()

      expect(router.currentRoute.value.path).toBe('/admin/system/flow-management/add')
    })

    it('应该支持跳转到编辑页面', async () => {
      const wrapper = mount(FlowManagement, {
        global: {
          plugins: [router, pinia]
        }
      })

      const mockRow = {
        id: 1,
        flowName: '请假审批流程'
      }

      await wrapper.vm.handleEdit(mockRow)

      expect(router.currentRoute.value.path).toBe('/admin/system/flow-management/edit/1')
    })

    it('应该支持跳转到查看页面', async () => {
      const wrapper = mount(FlowManagement, {
        global: {
          plugins: [router, pinia]
        }
      })

      const mockRow = {
        id: 1,
        flowName: '请假审批流程'
      }

      await wrapper.vm.handleView(mockRow)

      expect(router.currentRoute.value.path).toBe('/admin/system/flow-management/view/1')
    })

    it('应该支持启用流程', async () => {
      vi.mocked(updateApprovalFlowStatus).mockResolvedValue({ data: { success: true } })

      const wrapper = mount(FlowManagement, {
        global: {
          plugins: [router, pinia]
        }
      })

      const mockRow = {
        id: 1,
        flowName: '请假审批流程',
        flowStatus: FlowStatus.DISABLED
      }

      // Mock ElMessageBox.confirm
      vi.spyOn(require('element-plus'), 'ElMessageBox').mockResolvedValue('confirm')

      await wrapper.vm.handleToggleStatus(mockRow)

      expect(updateApprovalFlowStatus).toHaveBeenCalledWith(1, FlowStatus.ENABLED)
    })

    it('应该支持停用流程', async () => {
      vi.mocked(updateApprovalFlowStatus).mockResolvedValue({ data: { success: true } })

      const wrapper = mount(FlowManagement, {
        global: {
          plugins: [router, pinia]
        }
      })

      const mockRow = {
        id: 1,
        flowName: '请假审批流程',
        flowStatus: FlowStatus.ENABLED
      }

      // Mock ElMessageBox.confirm
      vi.spyOn(require('element-plus'), 'ElMessageBox').mockResolvedValue('confirm')

      await wrapper.vm.handleToggleStatus(mockRow)

      expect(updateApprovalFlowStatus).toHaveBeenCalledWith(1, FlowStatus.DISABLED)
    })

    it('应该支持删除流程', async () => {
      vi.mocked(deleteApprovalFlow).mockResolvedValue({ data: { success: true } })

      const wrapper = mount(FlowManagement, {
        global: {
          plugins: [router, pinia]
        }
      })

      const mockRow = {
        id: 1,
        flowName: '请假审批流程'
      }

      // Mock ElMessageBox.confirm
      vi.spyOn(require('element-plus'), 'ElMessageBox').mockResolvedValue('confirm')

      await wrapper.vm.handleDelete(mockRow)

      expect(deleteApprovalFlow).toHaveBeenCalledWith(1)
    })
  })

  describe('数据权限集成', () => {
    it('应该应用数据权限过滤', async () => {
      const mockData = {
        data: {
          list: [],
          total: 0,
          page: 1,
          pageSize: 10
        }
      }

      vi.mocked(getApprovalFlowList).mockResolvedValue(mockData)

      // Mock 数据权限
      const { useDataPermission } = await import('@/composables/useDataPermission')
      const { generateFilter } = useDataPermission()

      vi.mocked(generateFilter).mockReturnValue({
        departmentIds: ['dept001']
      })

      const wrapper = mount(FlowManagement, {
        global: {
          plugins: [router, pinia]
        }
      })

      await new Promise(resolve => setTimeout(resolve, 100))

      expect(getApprovalFlowList).toHaveBeenCalledWith(
        expect.objectContaining({
          departmentIds: ['dept001']
        })
      )
    })
  })

  describe('错误处理', () => {
    it('应该处理API请求失败', async () => {
      vi.mocked(getApprovalFlowList).mockRejectedValue(new Error('网络错误'))

      const wrapper = mount(FlowManagement, {
        global: {
          plugins: [router, pinia]
        }
      })

      await new Promise(resolve => setTimeout(resolve, 100))

      expect(wrapper.vm.loading).toBe(false)
    })

    it('应该处理详情加载失败', async () => {
      vi.mocked(getApprovalFlowDetail).mockRejectedValue(new Error('网络错误'))

      await router.push('/admin/system/flow-management/view/1')
      await router.isReady()

      const wrapper = mount(FlowManagementDetail, {
        global: {
          plugins: [router, pinia]
        }
      })

      await new Promise(resolve => setTimeout(resolve, 100))

      expect(wrapper.vm.loading).toBe(false)
    })
  })
})
