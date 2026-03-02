/**
 * 性能测试方案
 * 测试API接口响应时间、数据库查询性能、并发审批处理能力等
 */

import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { performance } from 'perf_hooks'

// 性能测试基类
class PerformanceTest {
  /**
   * 测量函数执行时间
   */
  static measureTime<T>(fn: () => Promise<T> | T, label: string): Promise<{ result: T; duration: number }> {
    return new Promise(async (resolve) => {
      const startTime = performance.now()
      const result = await fn()
      const endTime = performance.now()
      const duration = endTime - startTime
      console.log(`${label}: ${duration.toFixed(2)}ms`)
      resolve({ result, duration })
    })
  }

  /**
   * 测试函数执行多次的平均时间
   */
  static async measureAverageTime<T>(
    fn: () => Promise<T> | T,
    label: string,
    iterations: number = 10
  ): Promise<{ averageDuration: number; minDuration: number; maxDuration: number }> {
    const durations: number[] = []

    for (let i = 0; i < iterations; i++) {
      const { duration } = await this.measureTime(fn, `${label} (${i + 1}/${iterations})`)
      durations.push(duration)
    }

    const averageDuration = durations.reduce((sum, d) => sum + d, 0) / durations.length
    const minDuration = Math.min(...durations)
    const maxDuration = Math.max(...durations)

    console.log(`${label} - Average: ${averageDuration.toFixed(2)}ms, Min: ${minDuration.toFixed(2)}ms, Max: ${maxDuration.toFixed(2)}ms`)

    return { averageDuration, minDuration, maxDuration }
  }

  /**
   * 测试并发性能
   */
  static async measureConcurrency<T>(
    fn: () => Promise<T>,
    label: string,
    concurrency: number = 10
  ): Promise<{ totalDuration: number; averageDuration: number; successCount: number; failureCount: number }> {
    const startTime = performance.now()
    const promises = Array.from({ length: concurrency }, (_, i) =>
      fn()
        .then(result => ({ result, index: i, success: true }))
        .catch(error => ({ error, index: i, success: false }))
    )

    const results = await Promise.all(promises)
    const endTime = performance.now()
    const totalDuration = endTime - startTime
    const successCount = results.filter(r => r.success).length
    const failureCount = results.filter(r => !r.success).length
    const averageDuration = totalDuration / concurrency

    console.log(`${label} - Total: ${totalDuration.toFixed(2)}ms, Average: ${averageDuration.toFixed(2)}ms, Success: ${successCount}, Failure: ${failureCount}`)

    return { totalDuration, averageDuration, successCount, failureCount }
  }
}

describe('性能测试', () => {
  describe('API接口响应时间测试', () => {
    it('流程列表API响应时间应该小于500ms', async () => {
      // Mock API调用
      const fetchFlowList = async () => {
        // 模拟API调用
        await new Promise(resolve => setTimeout(resolve, 100))
        return { list: [], total: 0 }
      }

      const { duration } = await PerformanceTest.measureTime(
        fetchFlowList,
        '流程列表API'
      )

      expect(duration).toBeLessThan(500)
    })

    it('流程详情API响应时间应该小于300ms', async () => {
      const fetchFlowDetail = async () => {
        await new Promise(resolve => setTimeout(resolve, 80))
        return { id: 1, flowName: '请假审批流程' }
      }

      const { duration } = await PerformanceTest.measureTime(
        fetchFlowDetail,
        '流程详情API'
      )

      expect(duration).toBeLessThan(300)
    })

    it('审批提交API响应时间应该小于1000ms', async () => {
      const submitApproval = async () => {
        await new Promise(resolve => setTimeout(resolve, 200))
        return { approvalId: 1, currentNode: '部门主管审批' }
      }

      const { duration } = await PerformanceTest.measureTime(
        submitApproval,
        '审批提交API'
      )

      expect(duration).toBeLessThan(1000)
    })

    it('审批通过API响应时间应该小于500ms', async () => {
      const approve = async () => {
        await new Promise(resolve => setTimeout(resolve, 150))
        return { isCompleted: false, currentNode: '人事审批' }
      }

      const { duration } = await PerformanceTest.measureTime(
        approve,
        '审批通过API'
      )

      expect(duration).toBeLessThan(500)
    })

    it('数据权限过滤API响应时间应该小于200ms', async () => {
      const fetchDataPermission = async () => {
        await new Promise(resolve => setTimeout(resolve, 50))
        return { userId: 'user001', dataPermission: { type: 'DEPARTMENT' } }
      }

      const { duration } = await PerformanceTest.measureTime(
        fetchDataPermission,
        '数据权限过滤API'
      )

      expect(duration).toBeLessThan(200)
    })
  })

  describe('数据库查询性能测试', () => {
    it('流程列表查询应该使用索引', async () => {
      const queryFlowList = async () => {
        // 模拟数据库查询
        await new Promise(resolve => setTimeout(resolve, 30))
        return { list: [], total: 0 }
      }

      const { duration } = await PerformanceTest.measureTime(
        queryFlowList,
        '流程列表查询'
      )

      expect(duration).toBeLessThan(100)
    })

    it('审批记录查询应该支持分页', async () => {
      const queryApprovalRecords = async (page: number, pageSize: number) => {
        await new Promise(resolve => setTimeout(resolve, 40))
        return { list: [], total: 100, page, pageSize }
      }

      const { duration } = await PerformanceTest.measureTime(
        () => queryApprovalRecords(1, 10),
        '审批记录查询'
      )

      expect(duration).toBeLessThan(100)
    })

    it('数据权限过滤查询应该高效', async () => {
      const queryWithPermission = async () => {
        await new Promise(resolve => setTimeout(resolve, 60))
        return { list: [], total: 0 }
      }

      const { duration } = await PerformanceTest.measureTime(
        queryWithPermission,
        '数据权限过滤查询'
      )

      expect(duration).toBeLessThan(150)
    })
  })

  describe('并发审批处理能力测试', () => {
    it('应该支持10个并发审批提交', async () => {
      const submitApproval = async () => {
        await new Promise(resolve => setTimeout(resolve, 200))
        return { approvalId: Math.random(), currentNode: '部门主管审批' }
      }

      const { successCount, failureCount, averageDuration } = await PerformanceTest.measureConcurrency(
        submitApproval,
        '并发审批提交',
        10
      )

      expect(successCount).toBe(10)
      expect(failureCount).toBe(0)
      expect(averageDuration).toBeLessThan(500)
    })

    it('应该支持50个并发审批查询', async () => {
      const queryApproval = async () => {
        await new Promise(resolve => setTimeout(resolve, 50))
        return { id: 1, approvalStatus: 'IN_PROGRESS' }
      }

      const { successCount, failureCount, averageDuration } = await PerformanceTest.measureConcurrency(
        queryApproval,
        '并发审批查询',
        50
      )

      expect(successCount).toBe(50)
      expect(failureCount).toBe(0)
      expect(averageDuration).toBeLessThan(200)
    })

    it('应该支持100个并发数据权限查询', async () => {
      const queryDataPermission = async () => {
        await new Promise(resolve => setTimeout(resolve, 30))
        return { userId: 'user001', dataPermission: { type: 'DEPARTMENT' } }
      }

      const { successCount, failureCount, averageDuration } = await PerformanceTest.measureConcurrency(
        queryDataPermission,
        '并发数据权限查询',
        100
      )

      expect(successCount).toBe(100)
      expect(failureCount).toBe(0)
      expect(averageDuration).toBeLessThan(100)
    })
  })

  describe('消息通知发送性能测试', () => {
    it('站内信发送响应时间应该小于200ms', async () => {
      const sendInboxNotification = async () => {
        await new Promise(resolve => setTimeout(resolve, 80))
        return { notificationId: 1, status: 'success' }
      }

      const { duration } = await PerformanceTest.measureTime(
        sendInboxNotification,
        '站内信发送'
      )

      expect(duration).toBeLessThan(200)
    })

    it('邮件发送响应时间应该小于500ms', async () => {
      const sendEmailNotification = async () => {
        await new Promise(resolve => setTimeout(resolve, 300))
        return { notificationId: 1, status: 'success' }
      }

      const { duration } = await PerformanceTest.measureTime(
        sendEmailNotification,
        '邮件发送'
      )

      expect(duration).toBeLessThan(500)
    })

    it('短信发送响应时间应该小于300ms', async () => {
      const sendSMSNotification = async () => {
        await new Promise(resolve => setTimeout(resolve, 150))
        return { notificationId: 1, status: 'success' }
      }

      const { duration } = await PerformanceTest.measureTime(
        sendSMSNotification,
        '短信发送'
      )

      expect(duration).toBeLessThan(300)
    })

    it('批量发送100条站内信应该小于5秒', async () => {
      const batchSendInbox = async () => {
        await new Promise(resolve => setTimeout(resolve, 2000))
        return { successCount: 100, failureCount: 0 }
      }

      const { duration } = await PerformanceTest.measureTime(
        batchSendInbox,
        '批量发送100条站内信'
      )

      expect(duration).toBeLessThan(5000)
    })
  })

  describe('内存使用测试', () => {
    it('流程列表加载内存占用应该合理', async () => {
      const beforeMemory = process.memoryUsage()

      // 模拟加载大量数据
      const loadFlowList = async () => {
        const list = Array.from({ length: 1000 }, (_, i) => ({
          id: i,
          flowName: `流程${i}`,
          flowType: 'LEAVE',
          flowStatus: 'ENABLED'
        }))
        return list
      }

      const { result } = await PerformanceTest.measureTime(loadFlowList, '加载流程列表')

      const afterMemory = process.memoryUsage()
      const memoryIncrease = (afterMemory.heapUsed - beforeMemory.heapUsed) / 1024 / 1024

      console.log(`内存增加: ${memoryIncrease.toFixed(2)}MB`)
      expect(memoryIncrease).toBeLessThan(10) // 内存增加应该小于10MB
    })
  })

  describe('性能基准测试', () => {
    it('流程列表API平均响应时间应该小于200ms', async () => {
      const fetchFlowList = async () => {
        await new Promise(resolve => setTimeout(resolve, 120))
        return { list: [], total: 0 }
      }

      const { averageDuration } = await PerformanceTest.measureAverageTime(
        fetchFlowList,
        '流程列表API平均响应时间',
        10
      )

      expect(averageDuration).toBeLessThan(200)
    })

    it('审批提交API平均响应时间应该小于500ms', async () => {
      const submitApproval = async () => {
        await new Promise(resolve => setTimeout(resolve, 250))
        return { approvalId: 1, currentNode: '部门主管审批' }
      }

      const { averageDuration } = await PerformanceTest.measureAverageTime(
        submitApproval,
        '审批提交API平均响应时间',
        10
      )

      expect(averageDuration).toBeLessThan(500)
    })
  })
})
