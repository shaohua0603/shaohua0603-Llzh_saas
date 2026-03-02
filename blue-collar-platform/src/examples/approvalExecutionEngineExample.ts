/**
 * 审批流程执行引擎使用示例
 * 演示如何在业务中集成审批流程执行引擎
 */

import ApprovalExecutionEngine from '@/services/approvalExecutionEngine'
import {
  submitApproval,
  approveApproval,
  rejectApproval,
  transferApproval,
  delegateApproval,
  withdrawApproval,
  getApprovalStatus,
  getApprovalRecords
} from '@/api/approvalExecutionApiImpl'
import type {
  SubmitApprovalRequest,
  ApprovalActionRequest,
  WithdrawApprovalRequest
} from '@/types/flow-config'

// ============================================
// 示例1: 请假管理集成
// ============================================

/**
 * 提交请假申请
 */
async function submitLeaveApplication(leaveData: any) {
  try {
    // 1. 保存请假申请
    const savedLeave = await saveLeaveApplication(leaveData)

    // 2. 提交审批
    const approvalResult = await submitApproval({
      businessCode: 'LEAVE',
      businessId: savedLeave.id,
      submitterId: leaveData.userId,
      submitterName: leaveData.userName
    })

    // 3. 更新请假申请的审批ID
    await updateLeaveApprovalId(savedLeave.id, approvalResult.data.approvalId)

    console.log('请假申请提交成功,审批ID:', approvalResult.data.approvalId)
    return savedLeave
  } catch (error) {
    console.error('提交请假申请失败:', error)
    throw error
  }
}

/**
 * 审批请假申请
 */
async function approveLeaveApplication(approvalId: number, approverId: number, approverName: string) {
  try {
    // 获取审批详情
    const approvalDetail = await getApprovalDetail(approvalId)

    // 审批通过
    const result = await approveApproval(approvalId, {
      businessCode: approvalDetail.data.businessCode,
      businessId: approvalDetail.data.businessId,
      nodeId: approvalDetail.data.currentNodeId,
      approverId: approverId,
      approverName: approverName,
      approvalComment: '同意'
    })

    console.log('请假申请审批成功:', result.data)

    // 如果审批完成,更新请假状态
    if (result.data.isCompleted) {
      await updateLeaveStatus(approvalDetail.data.businessId, 'APPROVED')
      console.log('请假申请已通过')
    } else {
      console.log('请假申请已流转到下一节点:', result.data.nextNode)
    }
  } catch (error) {
    console.error('审批请假申请失败:', error)
    throw error
  }
}

/**
 * 驳回请假申请
 */
async function rejectLeaveApplication(
  approvalId: number,
  approverId: number,
  approverName: string,
  rejectReason: string
) {
  try {
    // 获取审批详情
    const approvalDetail = await getApprovalDetail(approvalId)

    // 审批驳回
    const result = await rejectApproval(approvalId, {
      businessCode: approvalDetail.data.businessCode,
      businessId: approvalDetail.data.businessId,
      nodeId: approvalDetail.data.currentNodeId,
      approverId: approverId,
      approverName: approverName,
      approvalComment: '不同意',
      rejectReason: rejectReason
    })

    console.log('请假申请驳回成功:', result.data)

    // 更新请假状态为已驳回
    await updateLeaveStatus(approvalDetail.data.businessId, 'REJECTED')
    console.log('请假申请已驳回')
  } catch (error) {
    console.error('驳回请假申请失败:', error)
    throw error
  }
}

// ============================================
// 示例2: 调岗管理集成
// ============================================

/**
 * 提交调岗申请
 */
async function submitTransferApplication(transferData: any) {
  try {
    // 1. 保存调岗申请
    const savedTransfer = await saveTransferApplication(transferData)

    // 2. 提交审批
    const approvalResult = await submitApproval({
      businessCode: 'TRANSFER',
      businessId: savedTransfer.id,
      submitterId: transferData.userId,
      submitterName: transferData.userName
    })

    // 3. 更新调岗申请的审批ID
    await updateTransferApprovalId(savedTransfer.id, approvalResult.data.approvalId)

    console.log('调岗申请提交成功,审批ID:', approvalResult.data.approvalId)
    return savedTransfer
  } catch (error) {
    console.error('提交调岗申请失败:', error)
    throw error
  }
}

/**
 * 转交调岗审批
 */
async function transferApprovalTask(
  approvalId: number,
  approverId: number,
  approverName: string,
  transferToId: number,
  transferToName: string
) {
  try {
    // 获取审批详情
    const approvalDetail = await getApprovalDetail(approvalId)

    // 审批转交
    const result = await transferApproval(approvalId, {
      businessCode: approvalDetail.data.businessCode,
      businessId: approvalDetail.data.businessId,
      nodeId: approvalDetail.data.currentNodeId,
      approverId: approverId,
      approverName: approverName,
      transferToId: transferToId,
      transferToName: transferToName,
      approvalComment: `转交给${transferToName}处理`
    })

    console.log('调岗审批转交成功:', result.data)
  } catch (error) {
    console.error('转交调岗审批失败:', error)
    throw error
  }
}

// ============================================
// 示例3: 离职管理集成
// ============================================

/**
 * 提交离职申请
 */
async function submitResignationApplication(resignationData: any) {
  try {
    // 1. 保存离职申请
    const savedResignation = await saveResignationApplication(resignationData)

    // 2. 提交审批
    const approvalResult = await submitApproval({
      businessCode: 'RESIGNATION',
      businessId: savedResignation.id,
      submitterId: resignationData.userId,
      submitterName: resignationData.userName
    })

    // 3. 更新离职申请的审批ID
    await updateResignationApprovalId(savedResignation.id, approvalResult.data.approvalId)

    console.log('离职申请提交成功,审批ID:', approvalResult.data.approvalId)
    return savedResignation
  } catch (error) {
    console.error('提交离职申请失败:', error)
    throw error
  }
}

/**
 * 委派离职审批
 */
async function delegateApprovalTask(
  approvalId: number,
  approverId: number,
  approverName: string,
  delegateToId: number,
  delegateToName: string
) {
  try {
    // 获取审批详情
    const approvalDetail = await getApprovalDetail(approvalId)

    // 审批委派
    const result = await delegateApproval(approvalId, {
      businessCode: approvalDetail.data.businessCode,
      businessId: approvalDetail.data.businessId,
      nodeId: approvalDetail.data.currentNodeId,
      approverId: approverId,
      approverName: approverName,
      delegateToId: delegateToId,
      delegateToName: delegateToName,
      approvalComment: `委派给${delegateToName}处理`
    })

    console.log('离职审批委派成功:', result.data)
  } catch (error) {
    console.error('委派离职审批失败:', error)
    throw error
  }
}

// ============================================
// 示例4: 撤回审批
// ============================================

/**
 * 撤回请假申请
 */
async function withdrawLeaveApplication(approvalId: number, userId: number, userName: string) {
  try {
    // 撤回审批
    await withdrawApproval(approvalId, {
      userId: userId,
      userName: userName,
      cancelReason: '需要修改申请'
    })

    console.log('请假申请撤回成功')
  } catch (error) {
    console.error('撤回请假申请失败:', error)
    throw error
  }
}

// ============================================
// 示例5: 查询审批状态和记录
// ============================================

/**
 * 查询请假申请的审批状态
 */
async function queryLeaveApprovalStatus(businessId: number) {
  try {
    // 查询审批状态
    const status = await getApprovalStatus(businessId, 'LEAVE')

    console.log('审批状态:', status.data.approvalStatus)
    console.log('当前节点:', status.data.currentNodeName)
    console.log('提交时间:', status.data.submitTime)
    console.log('完成时间:', status.data.completeTime)

    return status.data
  } catch (error) {
    console.error('查询审批状态失败:', error)
    throw error
  }
}

/**
 * 查询请假申请的审批记录
 */
async function queryLeaveApprovalRecords(businessId: number) {
  try {
    // 查询审批记录
    const records = await getApprovalRecords(businessId, 'LEAVE')

    console.log('审批记录列表:')
    records.data.forEach((record, index) => {
      console.log(`${index + 1}. 节点: ${record.nodeName}`)
      console.log(`   审批人: ${record.approverName}`)
      console.log(`   审批结果: ${record.approvalResult}`)
      console.log(`   审批时间: ${record.approvalTime}`)
      console.log(`   审批意见: ${record.approvalComment}`)
      console.log('---')
    })

    return records.data
  } catch (error) {
    console.error('查询审批记录失败:', error)
    throw error
  }
}

// ============================================
// 示例6: 使用引擎直接调用
// ============================================

/**
 * 使用引擎直接提交审批
 */
async function submitApprovalDirectly() {
  try {
    const engine = ApprovalExecutionEngine.getInstance()

    const result = await engine.submitApproval({
      businessCode: 'LEAVE',
      businessId: 123,
      submitterId: 1,
      submitterName: '张三'
    })

    console.log('审批提交成功:', result)
  } catch (error) {
    console.error('提交审批失败:', error)
    throw error
  }
}

/**
 * 使用引擎直接审批通过
 */
async function approveDirectly() {
  try {
    const engine = ApprovalExecutionEngine.getInstance()

    const result = await engine.approve({
      businessCode: 'LEAVE',
      businessId: 123,
      nodeId: 1,
      approverId: 2,
      approverName: '李四',
      approvalComment: '同意'
    })

    console.log('审批通过成功:', result)
  } catch (error) {
    console.error('审批通过失败:', error)
    throw error
  }
}

// ============================================
// 辅助函数(模拟)
// ============================================

async function saveLeaveApplication(leaveData: any) {
  // TODO: 实现保存请假申请的逻辑
  return { id: 123, ...leaveData }
}

async function updateLeaveApprovalId(leaveId: number, approvalId: number) {
  // TODO: 实现更新请假申请审批ID的逻辑
}

async function updateLeaveStatus(leaveId: number, status: string) {
  // TODO: 实现更新请假状态的逻辑
}

async function saveTransferApplication(transferData: any) {
  // TODO: 实现保存调岗申请的逻辑
  return { id: 456, ...transferData }
}

async function updateTransferApprovalId(transferId: number, approvalId: number) {
  // TODO: 实现更新调岗申请审批ID的逻辑
}

async function saveResignationApplication(resignationData: any) {
  // TODO: 实现保存离职申请的逻辑
  return { id: 789, ...resignationData }
}

async function updateResignationApprovalId(resignationId: number, approvalId: number) {
  // TODO: 实现更新离职申请审批ID的逻辑
}

async function getApprovalDetail(approvalId: number) {
  // TODO: 实现获取审批详情的逻辑
  return {
    data: {
      businessCode: 'LEAVE',
      businessId: 123,
      currentNodeId: 1
    }
  }
}

// ============================================
// 使用示例
// ============================================

// 示例1: 提交请假申请
async function example1() {
  const leaveData = {
    userId: 1,
    userName: '张三',
    leaveType: '年假',
    startDate: '2026-03-01',
    endDate: '2026-03-05',
    reason: '个人事务'
  }

  const savedLeave = await submitLeaveApplication(leaveData)
  console.log('请假申请已提交:', savedLeave)
}

// 示例2: 审批请假申请
async function example2() {
  await approveLeaveApplication(1, 2, '李四')
}

// 示例3: 驳回请假申请
async function example3() {
  await rejectLeaveApplication(1, 2, '李四', '请假理由不充分')
}

// 示例4: 转交审批
async function example4() {
  await transferApprovalTask(1, 2, '李四', 3, '王五')
}

// 示例5: 委派审批
async function example5() {
  await delegateApprovalTask(1, 2, '李四', 3, '王五')
}

// 示例6: 撤回审批
async function example6() {
  await withdrawLeaveApplication(1, 1, '张三')
}

// 示例7: 查询审批状态
async function example7() {
  await queryLeaveApprovalStatus(123)
}

// 示例8: 查询审批记录
async function example8() {
  await queryLeaveApprovalRecords(123)
}

// 导出示例函数
export {
  // 请假管理
  submitLeaveApplication,
  approveLeaveApplication,
  rejectLeaveApplication,
  withdrawLeaveApplication,

  // 调岗管理
  submitTransferApplication,
  transferApprovalTask,

  // 离职管理
  submitResignationApplication,
  delegateApprovalTask,

  // 查询功能
  queryLeaveApprovalStatus,
  queryLeaveApprovalRecords,

  // 直接使用引擎
  submitApprovalDirectly,
  approveDirectly,

  // 使用示例
  example1,
  example2,
  example3,
  example4,
  example5,
  example6,
  example7,
  example8
}
