import { describe, it, expect, vi, beforeEach } from 'vitest'
import { getPickupList, createPickup, updatePickup, deletePickup, getInitialInterviewList, createInitialInterview, getInterviewInvitationList, createInterviewInvitation, getFactoryInterviewList, createFactoryInterview } from '@/api/interviewApi'
import request from '@/utils/request'

// 模拟request
vi.mock('@/utils/request', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn()
  }
}))

const mockRequest = request as any

describe('面试管理模块测试', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('接送管理测试', () => {
    it('获取接送列表', async () => {
      const mockResponse = {
        code: 200,
        message: '成功',
        data: {
          list: [
            {
              id: 'PK001',
              plateNumber: '粤B12345',
              pickupTime: '2024-02-26 08:00:00',
              startPoint: '深圳宝安汽车站',
              endPoint: '东莞长安工业区',
              pickupPerson: '张三',
              manager: '李四',
              managerPhone: '13800138000',
              groupNumber: '1001',
              status: 'pending',
              createTime: '2024-02-25 10:00:00'
            }
          ],
          total: 1
        }
      }

      mockRequest.get.mockResolvedValue(mockResponse)

      const params = {
        page: 1,
        pageSize: 10
      }

      const response = await getPickupList(params)

      expect(mockRequest.get).toHaveBeenCalledWith('/interview/pickups', { params })
      expect(response).toEqual(mockResponse)
    })

    it('创建接送记录', async () => {
      const mockData = {
        plateNumber: '粤B12345',
        pickupTime: '2024-02-26 08:00:00',
        startPoint: '深圳宝安汽车站',
        endPoint: '东莞长安工业区',
        pickupPerson: '张三',
        manager: '李四',
        managerPhone: '13800138000',
        groupNumber: '1001',
        workerIds: [],
        remark: '测试接送'
      }

      const mockResponse = {
        code: 200,
        message: '成功',
        data: {
          id: 'PK001',
          ...mockData
        }
      }

      mockRequest.post.mockResolvedValue(mockResponse)

      const response = await createPickup(mockData)

      expect(mockRequest.post).toHaveBeenCalledWith('/interview/pickups', mockData)
      expect(response).toEqual(mockResponse)
    })

    it('更新接送记录', async () => {
      const id = 'PK001'
      const mockData = {
        plateNumber: '粤B12345',
        pickupTime: '2024-02-26 09:00:00',
        startPoint: '深圳宝安汽车站',
        endPoint: '东莞长安工业区',
        pickupPerson: '张三',
        manager: '李四',
        managerPhone: '13800138000',
        groupNumber: '1001',
        workerIds: [],
        remark: '测试接送'
      }

      const mockResponse = {
        code: 200,
        message: '成功',
        data: {
          id,
          ...mockData
        }
      }

      mockRequest.put.mockResolvedValue(mockResponse)

      const response = await updatePickup(id, mockData)

      expect(mockRequest.put).toHaveBeenCalledWith(`/interview/pickups/${id}`, mockData)
      expect(response).toEqual(mockResponse)
    })

    it('删除接送记录', async () => {
      const id = 'PK001'

      const mockResponse = {
        code: 200,
        message: '成功'
      }

      mockRequest.delete.mockResolvedValue(mockResponse)

      const response = await deletePickup(id)

      expect(mockRequest.delete).toHaveBeenCalledWith(`/interview/pickups/${id}`)
      expect(response).toEqual(mockResponse)
    })
  })

  describe('初步面试测试', () => {
    it('获取初步面试列表', async () => {
      const mockResponse = {
        code: 200,
        message: '成功',
        data: {
          list: [
            {
              id: 'II001',
              workerName: '张三',
              phone: '13800138000',
              idCard: '110101199001011234',
              interviewTime: '2024-02-26 10:00:00',
              interviewLocation: '深圳总部',
              interviewer: '李四',
              manager: '王五',
              interviewResult: 'pass',
              interviewComments: '表现良好',
              nextStep: '推荐工厂面试',
              recommendationLevel: 'A',
              createTime: '2024-02-25 09:00:00'
            }
          ],
          total: 1
        }
      }

      mockRequest.get.mockResolvedValue(mockResponse)

      const params = {
        page: 1,
        pageSize: 10
      }

      const response = await getInitialInterviewList(params)

      expect(mockRequest.get).toHaveBeenCalledWith('/interview/initial-interviews', { params })
      expect(response).toEqual(mockResponse)
    })

    it('创建初步面试记录', async () => {
      const mockData = {
        workerId: 'W001',
        interviewTime: '2024-02-26 10:00:00',
        interviewLocation: '深圳总部',
        interviewer: '李四',
        manager: '王五',
        interviewComments: '表现良好',
        nextStep: '推荐工厂面试',
        recommendationLevel: 'A',
        remark: '测试面试'
      }

      const mockResponse = {
        code: 200,
        message: '成功',
        data: {
          id: 'II001',
          workerName: '张三',
          phone: '13800138000',
          idCard: '110101199001011234',
          ...mockData
        }
      }

      mockRequest.post.mockResolvedValue(mockResponse)

      const response = await createInitialInterview(mockData)

      expect(mockRequest.post).toHaveBeenCalledWith('/interview/initial-interviews', mockData)
      expect(response).toEqual(mockResponse)
    })
  })

  describe('面试邀约测试', () => {
    it('获取面试邀约列表', async () => {
      const mockResponse = {
        code: 200,
        message: '成功',
        data: {
          list: [
            {
              id: 'INV001',
              workerName: '张三',
              phone: '13800138000',
              idCard: '110101199001011234',
              factory: '东莞长安工业区',
              position: '装配工',
              interviewTime: '2024-02-27 10:00:00',
              interviewLocation: '东莞长安工业区面试点',
              inviter: '李四',
              status: 'pending',
              createTime: '2024-02-25 10:00:00'
            }
          ],
          total: 1
        }
      }

      mockRequest.get.mockResolvedValue(mockResponse)

      const params = {
        page: 1,
        pageSize: 10
      }

      const response = await getInterviewInvitationList(params)

      expect(mockRequest.get).toHaveBeenCalledWith('/interview/invitations', { params })
      expect(response).toEqual(mockResponse)
    })

    it('创建面试邀约记录', async () => {
      const mockData = {
        workerId: 'W001',
        factoryId: 'F001',
        positionId: 'P001',
        interviewTime: '2024-02-27 10:00:00',
        interviewLocation: '东莞长安工业区面试点',
        inviter: '李四',
        remark: '测试邀约'
      }

      const mockResponse = {
        code: 200,
        message: '成功',
        data: {
          id: 'INV001',
          workerName: '张三',
          phone: '13800138000',
          idCard: '110101199001011234',
          factory: '东莞长安工业区',
          position: '装配工',
          ...mockData
        }
      }

      mockRequest.post.mockResolvedValue(mockResponse)

      const response = await createInterviewInvitation(mockData)

      expect(mockRequest.post).toHaveBeenCalledWith('/interview/invitations', mockData)
      expect(response).toEqual(mockResponse)
    })
  })

  describe('工厂面试测试', () => {
    it('获取工厂面试列表', async () => {
      const mockResponse = {
        code: 200,
        message: '成功',
        data: {
          list: [
            {
              id: 'FI001',
              workerName: '张三',
              phone: '13800138000',
              idCard: '110101199001011234',
              factory: '东莞长安工业区',
              position: '装配工',
              interviewTime: '2024-02-27 10:00:00',
              interviewer: '王五',
              interviewResult: 'pass',
              offerStatus: 'offered',
              salary: '6000',
              entryDate: '2024-03-01',
              createTime: '2024-02-25 10:00:00'
            }
          ],
          total: 1
        }
      }

      mockRequest.get.mockResolvedValue(mockResponse)

      const params = {
        page: 1,
        pageSize: 10
      }

      const response = await getFactoryInterviewList(params)

      expect(mockRequest.get).toHaveBeenCalledWith('/interview/factory-interviews', { params })
      expect(response).toEqual(mockResponse)
    })

    it('创建工厂面试记录', async () => {
      const mockData = {
        workerId: 'W001',
        factoryId: 'F001',
        positionId: 'P001',
        interviewTime: '2024-02-27 10:00:00',
        interviewer: '王五',
        interviewComments: '表现良好',
        salary: '6000',
        entryDate: '2024-03-01',
        remark: '测试工厂面试'
      }

      const mockResponse = {
        code: 200,
        message: '成功',
        data: {
          id: 'FI001',
          workerName: '张三',
          phone: '13800138000',
          idCard: '110101199001011234',
          factory: '东莞长安工业区',
          position: '装配工',
          interviewResult: 'pending',
          offerStatus: 'pending',
          ...mockData
        }
      }

      mockRequest.post.mockResolvedValue(mockResponse)

      const response = await createFactoryInterview(mockData)

      expect(mockRequest.post).toHaveBeenCalledWith('/interview/factory-interviews', mockData)
      expect(response).toEqual(mockResponse)
    })
  })
})
