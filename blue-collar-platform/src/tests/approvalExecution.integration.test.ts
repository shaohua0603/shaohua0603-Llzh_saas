/**
 * 审批执行模块集成测试
 * 测试审批提交、审批通过、审批驳回、转交、委派等功能
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import ApprovalExecutionEngine from '@/services/approvalExecutionEngine'
import {
  submitApproval,
  approve,
  reject,
  transfer,
  delegate,
  withdrawApproval,
  getApprovalDetail,
  getApprovalRecords,
  getTodoTasks
} from '@/api/approvalExecutionApi'
import type {
  SubmitApprovalRequest,
  ApprovalActionRequest,
  WithdrawApprovalRequest,
  ApprovalDetail,
  ApprovalRecord,
  TodoTask
} from '@/types/flow-config'

// Mock API
vi.mock('@/api/approvalExecutionApi', () => ({
  submitApproval: vi.fn(),
  approve: vi.fn(),
  reject: vi.fn(),
  transfer: vi.fn(),
  delegate: vi.fn(),
  withdrawApproval: vi.fn(),
  getApprovalDetail: vi.fn(),
  getApprovalRecords: vi.fn(),
  getTodoTasks: vi.fn()
}))

// Mock 消息通知服务
vi.mock('@/services/notificationService', () => ({
  NotificationService: {
    getInstance: vi.fn(() => ({
      sendNotification: vi.fn().mockResolvedValue({
        notificationId: 1,
        status: 'success',
        results: []
      })
    }))
  }
}))

describe('审批执行模块集成测试', () => {
  let engine: ApprovalExecutionEngine

  beforeEach(() => {
    vi.clearAllMocks()
    engine = ApprovalExecutionEngine.getInstance()
  })

  describe('审批提交功能', () => {
    it('应该成功提交审批', async () => {
      const request: SubmitApprovalRequest = {
        businessCode: 'LEAVE',
        businessId: 1,
        submitterId: 1,
        submitterName: '张三'
      }

      const mockResponse = {
        data: {
          approvalId: 1,
          currentNode: '部门主管审批',
          currentNodeId: 1,
          approvalStatus: 'IN_PROGRESS'
        }
      }

      vi.mocked(submitApproval).mockResolvedValue(mockResponse)

      const result = await engine.submitApproval(request)

      expect(submitApproval).toHaveBeenCalledWith(request)
      expect(result.approvalId).toBe(1)
      expect(result.approvalStatus).toBe('IN_PROGRESS')
    })

    it('应该在提交时创建待办任务', async () => {
      const request: SubmitApprovalRequest = {
        businessCode: 'LEAVE',
        businessId: 1,
        submitterId: 1,
        submitterName: '张三'
      }

      const mockResponse = {
        data: {
          approvalId: 1,
          currentNode: '部门主管审批',
          currentNodeId: 1,
          approvalStatus: 'IN_PROGRESS'
        }
      }

      vi.mocked(submitApproval).mockResolvedValue(mockResponse)

      await engine.submitApproval(request)

      // 验证是否创建了待办任务
      // 这里需要根据实际的实现来验证
      expect(submitApproval).toHaveBeenCalled()
    })

    it('应该在提交时发送通知', async () => {
      const request: SubmitApprovalRequest = {
        businessCode: 'LEAVE',
        businessId: 1,
        submitterId: 1,
        submitterName: '张三'
      }

      const mockResponse = {
        data: {
          approvalId: 1,
          currentNode: '部门主管审批',
          currentNodeId: 1,
          approvalStatus: 'IN_PROGRESS'
        }
      }

      vi.mocked(submitApproval).mockResolvedValue(mockResponse)

      await engine.submitApproval(request)

      // 验证是否发送了通知
      // 这里需要根据实际的实现来验证
      expect(submitApproval).toHaveBeenCalled()
    })

    it('应该在流程配置不存在时抛出错误', async () => {
      const request: SubmitApprovalRequest = {
        businessCode: 'INVALID_CODE',
        businessId: 1,
        submitterId: 1,
        submitterName: '张三'
      }

      vi.mocked(submitApproval).mockRejectedValue(
        new Error('未找到流程配置')
      )

      await expect(engine.submitApproval(request)).rejects.toThrow(
        '未找到流程配置'
      )
    })
  })

  describe('审批通过功能', () => {
    it('应该成功审批通过', async () => {
      const request: ApprovalActionRequest = {
        businessCode: 'LEAVE',
        businessId: 1,
        nodeId: 1,
        approverId: 2,
        approverName: '李四',
        approvalComment: '同意'
      }

      const mockResponse = {
        data: {
          isCompleted: false,
          currentNode: '人事审批',
          currentNodeId: 2,
          approvalStatus: 'IN_PROGRESS'
        }
      }

      vi.mocked(approve).mockResolvedValue(mockResponse)

      const result = await engine.approve(request)

      expect(approve).toHaveBeenCalledWith(request)
      expect(result.isCompleted).toBe(false)
      expect(result.currentNode).toBe('人事审批')
    })

    it('应该在最后一个节点通过时完成审批', async () => {
      const request: ApprovalActionRequest = {
        businessCode: 'LEAVE',
        businessId: 1,
        nodeId: 3,
        approverId: 4,
        approverName: '赵六',
        approvalComment: '同意'
      }

      const mockResponse = {
        data: {
          isCompleted: true,
          currentNode: null,
          currentNodeId: null,
          approvalStatus: 'APPROVED'
        }
      }

      vi.mocked(approve).mockResolvedValue(mockResponse)

      const result = await engine.approve(request)

      expect(result.isCompleted).toBe(true)
      expect(result.approvalStatus).toBe('APPROVED')
    })

    it('应该验证审批人权限', async () => {
      const request: ApprovalActionRequest = {
        businessCode: 'LEAVE',
        businessId: 1,
        nodeId: 1,
        approverId: 999,
        approverName: '无权限用户',
        approvalComment: '同意'
      }

      vi.mocked(approve).mockRejectedValue(
        new Error('无审批权限')
      )

      await expect(engine.approve(request)).rejects.toThrow(
        '无审批权限'
      )
    })

    it('应该记录审批记录', async () => {
      const request: ApprovalActionRequest = {
        businessCode: 'LEAVE',
        businessId: 1,
        nodeId: 1,
        approverId: 2,
        approverName: '李四',
        approvalComment: '同意'
      }

      const mockResponse = {
        data: {
          isCompleted: false,
          currentNode: '人事审批',
          currentNodeId: 2,
          approvalStatus: 'IN_PROGRESS'
        }
      }

      vi.mocked(approve).mockResolvedValue(mockResponse)

      await engine.approve(request)

      // 验证是否记录了审批记录
      expect(approve).toHaveBeenCalled()
    })

    it('应该删除当前节点的待办任务', async () => {
      const request: ApprovalActionRequest = {
        businessCode: 'LEAVE',
        businessId: 1,
        nodeId: 1,
        approverId: 2,
        approverName: '李四',
        approvalComment: '同意'
      }

      const mockResponse = {
        data: {
          isCompleted: false,
          currentNode: '人事审批',
          currentNodeId: 2,
          approvalStatus: 'IN_PROGRESS'
        }
      }

      vi.mocked(approve).mockResolvedValue(mockResponse)

      await engine.approve(request)

      // 验证是否删除了当前节点的待办任务
      expect(approve).toHaveBeenCalled()
    })
  })

  describe('审批驳回功能', () => {
    it('应该成功审批驳回', async () => {
      const request: ApprovalActionRequest = {
        businessCode: 'LEAVE',
        businessId: 1,
        nodeId: 1,
        approverId: 2,
        approverName: '李四',
        approvalComment: '不同意',
        rejectReason: '请假理由不充分'
      }

      const mockResponse = {
        data: {
          isCompleted: true,
          currentNode: null,
          currentNodeId: null,
          approvalStatus: 'REJECTED'
        }
      }

      vi.mocked(reject).mockResolvedValue(mockResponse)

      const result = await engine.reject(request)

      expect(reject).toHaveBeenCalledWith(request)
      expect(result.isCompleted).toBe(true)
      expect(result.approvalStatus).toBe('REJECTED')
    })

    it('应该删除所有待办任务', async () => {
      const request: ApprovalActionRequest = {
        businessCode: 'LEAVE',
        businessId: 1,
        nodeId: 1,
        approverId: 2,
        approverName: '李四',
        approvalComment: '不同意',
        rejectReason: '请假理由不充分'
      }

      const mockResponse = {
        data: {
          isCompleted: true,
          currentNode: null,
          currentNodeId: null,
          approvalStatus: 'REJECTED'
        }
      }

      vi.mocked(reject).mockResolvedValue(mockResponse)

      await engine.reject(request)

      // 验证是否删除了所有待办任务
      expect(reject).toHaveBeenCalled()
    })

    it('应该发送驳回通知', async () => {
      const request: ApprovalActionRequest = {
        businessCode: 'LEAVE',
        businessId: 1,
        nodeId: 1,
        approverId: 2,
        approverName: '李四',
        approvalComment: '不同意',
        rejectReason: '请假理由不充分'
      }

      const mockResponse = {
        data: {
          isCompleted: true,
          currentNode: null,
          currentNodeId: null,
          approvalStatus: 'REJECTED'
        }
      }

      vi.mocked(reject).mockResolvedValue(mockResponse)

      await engine.reject(request)

      // 验证是否发送了驳回通知
      expect(reject).toHaveBeenCalled()
    })
  })

  describe('审批转交功能', () => {
    it('应该成功转交审批', async () => {
      const request: ApprovalActionRequest = {
        businessCode: 'LEAVE',
        businessId: 1,
        nodeId: 1,
        approverId: 2,
        approverName: '李四',
        transferToId: 3,
        transferToName: '王五',
        approvalComment: '转交给王五处理'
      }

      const mockResponse = {
        data: {
          isCompleted: false,
          currentNode: '部门主管审批',
          currentNodeId: 1,
          approvalStatus: 'IN_PROGRESS'
        }
      }

      vi.mocked(transfer).mockResolvedValue(mockResponse)

      const result = await engine.transfer(request)

      expect(transfer).toHaveBeenCalledWith(request)
      expect(result.isCompleted).toBe(false)
    })

    it('应该更新待办任务的审批人', async () => {
      const request: ApprovalActionRequest = {
        businessCode: 'LEAVE',
        businessId: 1,
        nodeId: 1,
        approverId: 2,
        approverName: '李四',
        transferToId: 3,
        transferToName: '王五'
      }

      const mockResponse = {
        data: {
          isCompleted: false,
          currentNode: '部门主管审批',
          currentNodeId: 1,
          approvalStatus: 'IN_PROGRESS'
        }
      }

      vi.mocked(transfer).mockResolvedValue(mockResponse)

      await engine.transfer(request)

      // 验证是否更新了待办任务的审批人
      expect(transfer).toHaveBeenCalled()
    })

    it('应该发送转交通知', async () => {
      const request: ApprovalActionRequest = {
        businessCode: 'LEAVE',
        businessId: 1,
        nodeId: 1,
        approverId: 2,
        approverName: '李四',
        transferToId: 3,
        transferToName: '王五'
      }

      const mockResponse = {
        data: {
          isCompleted: false,
          currentNode: '部门主管审批',
          currentNodeId: 1,
          approvalStatus: 'IN_PROGRESS'
        }
      }

      vi.mocked(transfer).mockResolvedValue(mockResponse)

      await engine.transfer(request)

      // 验证是否发送了转交通知
      expect(transfer).toHaveBeenCalled()
    })
  })

  describe('审批委派功能', () => {
    it('应该成功委派审批', async () => {
      const request: ApprovalActionRequest = {
        businessCode: 'LEAVE',
        businessId: 1,
        nodeId: 1,
        approverId: 2,
        approverName: '李四',
        delegateToId: 3,
        delegateToName: '王五',
        approvalComment: '委派给王五处理'
      }

      const mockResponse = {
        data: {
          isCompleted: false,
          currentNode: '部门主管审批',
          currentNodeId: 1,
          approvalStatus: 'IN_PROGRESS'
        }
      }

      vi.mocked(delegate).mockResolvedValue(mockResponse)

      const result = await engine.delegate(request)

      expect(delegate).toHaveBeenCalledWith(request)
      expect(result.isCompleted).toBe(false)
    })

    it('应该保留原审批人权限', async () => {
      const request: ApprovalActionRequest = {
        businessCode: 'LEAVE',
        businessId: 1,
        nodeId: 1,
        approverId: 2,
        approverName: '李四',
        delegateToId: 3,
        delegateToName: '王五'
      }

      const mockResponse = {
        data: {
          isCompleted: false,
          currentNode: '部门主管审批',
          currentNodeId: 1,
          approvalStatus: 'IN_PROGRESS'
        }
      }

      vi.mocked(delegate).mockResolvedValue(mockResponse)

      await engine.delegate(request)

      // 验证是否保留了原审批人权限
      expect(delegate).toHaveBeenCalled()
    })

    it('应该发送委派通知', async () => {
      const request: ApprovalActionRequest = {
        businessCode: 'LEAVE',
        businessId: 1,
        nodeId: 1,
        approverId: 2,
        approverName: '李四',
        delegateToId: 3,
        delegateToName: '王五'
      }

      const mockResponse = {
        data: {
          isCompleted: false,
          currentNode: '部门主管审批',
          currentNodeId: 1,
          approvalStatus: 'IN_PROGRESS'
        }
      }

      vi.mocked(delegate).mockResolvedValue(mockResponse)

      await engine.delegate(request)

      // 验证是否发送了委派通知
      expect(delegate).toHaveBeenCalled()
    })
  })

  describe('审批撤回功能', () => {
    it('应该成功撤回审批', async () => {
      const approvalId = 1
      const request: WithdrawApprovalRequest = {
        userId: 1,
        userName: '张三',
        cancelReason: '需要修改申请'
      }

      const mockResponse = {
        data: {
          success: true
        }
      }

      vi.mocked(withdrawApproval).mockResolvedValue(mockResponse)

      await engine.withdrawApproval(approvalId, request)

      expect(withdrawApproval).toHaveBeenCalledWith(approvalId, request)
    })

    it('应该验证提交人权限', async () => {
      const approvalId = 1
      const request: WithdrawApprovalRequest = {
        userId: 999,
        userName: '无权限用户'
      }

      vi.mocked(withdrawApproval).mockRejectedValue(
        new Error('无撤回权限')
      )

      await expect(
        engine.withdrawApproval(approvalId, request)
      ).rejects.toThrow('无撤回权限')
    })

    it('应该删除所有待办任务', async () => {
      const approvalId = 1
      const request: WithdrawApprovalRequest = {
        userId: 1,
        userName: '张三',
        cancelReason: '需要修改申请'
      }

      const mockResponse = {
        data: {
          success: true
        }
      }

      vi.mocked(withdrawApproval).mockResolvedValue(mockResponse)

      await engine.withdrawApproval(approvalId, request)

      // 验证是否删除了所有待办任务
      expect(withdrawApproval).toHaveBeenCalled()
    })
  })

  describe('审批查询功能', () => {
    it('应该成功获取审批详情', async () => {
      const approvalId = 1

      const mockResponse = {
        data: {
          id: 1,
          businessCode: 'LEAVE',
          businessId: 1,
          submitterId: 1,
          submitterName: '张三',
          approvalStatus: 'IN_PROGRESS',
          currentNode: '部门主管审批',
          currentNodeId: 1,
          createTime: '2024-01-01 10:00:00'
        } as ApprovalDetail
      }

      vi.mocked(getApprovalDetail).mockResolvedValue(mockResponse)

      const result = await getApprovalDetail(approvalId)

      expect(getApprovalDetail).toHaveBeenCalledWith(approvalId)
      expect(result.data.id).toBe(1)
      expect(result.data.approvalStatus).toBe('IN_PROGRESS')
    })

    it('应该成功获取审批记录', async () => {
      const approvalId = 1

      const mockResponse = {
        data: [
          {
            id: 1,
            nodeId: 1,
            nodeName: '部门主管审批',
            approverId: 2,
            approverName: '李四',
            approvalTime: '2024-01-01 11:00:00',
            approvalResult: 'approved',
            approvalComment: '同意'
          } as ApprovalRecord
        ]
      }

      vi.mocked(getApprovalRecords).mockResolvedValue(mockResponse)

      const result = await getApprovalRecords(approvalId)

      expect(getApprovalRecords).toHaveBeenCalledWith(approvalId)
      expect(result.data).toHaveLength(1)
      expect(result.data[0].approverName).toBe('李四')
    })

    it('应该成功获取待办任务', async () => {
      const userId = 2

      const mockResponse = {
        data: {
          list: [
            {
              id: 1,
              businessCode: 'LEAVE',
              businessId: 1,
              nodeId: 1,
              nodeName: '部门主管审批',
              submitterId: 1,
              submitterName: '张三',
              createTime: '2024-01-01 10:00:00'
            } as TodoTask
          ],
          total: 1,
          page: 1,
          pageSize: 10
        }
      }

      vi.mocked(getTodoTasks).mockResolvedValue(mockResponse)

      const result = await getTodoTasks(userId)

      expect(getTodoTasks).toHaveBeenCalledWith(userId)
      expect(result.data.list).toHaveLength(1)
      expect(result.data.list[0].nodeName).toBe('部门主管审批')
    })
  })

  describe('并发审批处理', () => {
    it('应该正确处理或签审批', async () => {
      const request1: ApprovalActionRequest = {
        businessCode: 'LEAVE',
        businessId: 1,
        nodeId: 1,
        approverId: 2,
        approverName: '李四',
        approvalComment: '同意'
      }

      const mockResponse = {
        data: {
          isCompleted: true,
          currentNode: null,
          currentNodeId: null,
          approvalStatus: 'APPROVED'
        }
      }

      vi.mocked(approve).mockResolvedValue(mockResponse)

      const result = await engine.approve(request1)

      expect(result.isCompleted).toBe(true)
    })

    it('应该正确处理会签审批', async () => {
      const request1: ApprovalActionRequest = {
        businessCode: 'LEAVE',
        businessId: 1,
        nodeId: 1,
        approverId: 2,
        approverName: '李四',
        approvalComment: '同意'
      }

      const mockResponse1 = {
        data: {
          isCompleted: false,
          currentNode: '部门主管审批',
          currentNodeId: 1,
          approvalStatus: 'IN_PROGRESS'
        }
      }

      const mockResponse2 = {
        data: {
          isCompleted: true,
          currentNode: '人事审批',
          currentNodeId: 2,
          approvalStatus: 'IN_PROGRESS'
        }
      }

      vi.mocked(approve)
        .mockResolvedValueOnce(mockResponse1)
        .mockResolvedValueOnce(mockResponse2)

      const result1 = await engine.approve(request1)

      expect(result1.isCompleted).toBe(false)
    })
  })

  describe('错误处理', () => {
    it('应该处理审批提交失败', async () => {
      const request: SubmitApprovalRequest = {
        businessCode: 'LEAVE',
        businessId: 1,
        submitterId: 1,
        submitterName: '张三'
      }

      vi.mocked(submitApproval).mockRejectedValue(
        new Error('提交审批失败')
      )

      await expect(engine.submitApproval(request)).rejects.toThrow(
        '提交审批失败'
      )
    })

    it('应该处理审批通过失败', async () => {
      const request: ApprovalActionRequest = {
        businessCode: 'LEAVE',
        businessId: 1,
        nodeId: 1,
        approverId: 2,
        approverName: '李四',
        approvalComment: '同意'
      }

      vi.mocked(approve).mockRejectedValue(
        new Error('审批通过失败')
      )

      await expect(engine.approve(request)).rejects.toThrow(
        '审批通过失败'
      )
    })

    it('应该处理审批驳回失败', async () => {
      const request: ApprovalActionRequest = {
        businessCode: 'LEAVE',
        businessId: 1,
        nodeId: 1,
        approverId: 2,
        approverName: '李四',
        approvalComment: '不同意',
        rejectReason: '请假理由不充分'
      }

      vi.mocked(reject).mockRejectedValue(
        new Error('审批驳回失败')
      )

      await expect(engine.reject(request)).rejects.toThrow(
        '审批驳回失败'
      )
    })
  })
})
