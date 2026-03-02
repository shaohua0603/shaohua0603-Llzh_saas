/**
 * 数据权限过滤集成测试
 * 测试数据权限在各个模块中的应用
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createMemoryHistory } from 'vue-router'
import { createPinia } from 'pinia'
import { useDataPermission } from '@/composables/useDataPermission'
import DataPermissionUtil from '@/utils/dataPermissionUtil'
import { createDataPermissionMiddleware } from '@/middleware/dataPermissionMiddleware'
import dataPermissionService from '@/services/dataPermissionService'
import type { DataPermissionConfig, Department } from '@/types/data-permission'

// Mock API
vi.mock('@/services/dataPermissionService', () => ({
  default: {
    getUserDataPermission: vi.fn(),
    getDepartmentTree: vi.fn(),
    getApplications: vi.fn()
  }
}))

// Mock 路由
const router = createRouter({
  history: createMemoryHistory(),
  routes: [
    {
      path: '/admin/workers',
      component: { template: '<div>工人列表</div>' }
    }
  ]
})

describe('数据权限过滤集成测试', () => {
  const pinia = createPinia()

  beforeEach(() => {
    vi.clearAllMocks()
    DataPermissionUtil.clearCache()
  })

  describe('数据权限初始化', () => {
    it('应该成功初始化数据权限', async () => {
      const mockUserDataPermission = {
        userId: 'user001',
        username: '张三',
        departmentId: 'dept001',
        departmentName: '人力资源部',
        positionId: 'pos001',
        positionName: '人事专员',
        dataPermission: {
          type: 'DEPARTMENT'
        },
        isAdmin: false
      }

      const mockDepartmentTree: Department[] = [
        {
          id: 'dept001',
          name: '人力资源部',
          parentId: '',
          code: 'HR',
          level: 1,
          children: []
        }
      ]

      vi.mocked(dataPermissionService.getUserDataPermission).mockResolvedValue(
        mockUserDataPermission
      )
      vi.mocked(dataPermissionService.getDepartmentTree).mockResolvedValue(
        mockDepartmentTree
      )

      const { initialize, userDataPermission } = useDataPermission()

      await initialize()

      expect(userDataPermission.value).toEqual(mockUserDataPermission)
    })

    it('应该正确识别管理员用户', async () => {
      const mockUserDataPermission = {
        userId: 'admin001',
        username: '管理员',
        departmentId: 'dept001',
        departmentName: '人力资源部',
        positionId: 'pos001',
        positionName: '人事专员',
        dataPermission: {
          type: 'ALL'
        },
        isAdmin: true
      }

      const mockDepartmentTree: Department[] = []

      vi.mocked(dataPermissionService.getUserDataPermission).mockResolvedValue(
        mockUserDataPermission
      )
      vi.mocked(dataPermissionService.getDepartmentTree).mockResolvedValue(
        mockDepartmentTree
      )

      const { initialize, isAdmin } = useDataPermission()

      await initialize()

      expect(isAdmin.value).toBe(true)
    })
  })

  describe('数据权限过滤条件生成', () => {
    it('应该生成全部数据的过滤条件', () => {
      const config: DataPermissionConfig = {
        type: 'ALL'
      }

      const filter = DataPermissionUtil.generateFilter(
        config,
        'user001',
        'dept001',
        []
      )

      expect(filter).toEqual({})
    })

    it('应该生成本部门数据的过滤条件', () => {
      const config: DataPermissionConfig = {
        type: 'DEPARTMENT'
      }

      const filter = DataPermissionUtil.generateFilter(
        config,
        'user001',
        'dept001',
        []
      )

      expect(filter.departmentIds).toEqual(['dept001'])
    })

    it('应该生成本部门及以下数据的过滤条件', () => {
      const config: DataPermissionConfig = {
        type: 'DEPARTMENT_AND_BELOW'
      }

      const departmentTree: Department[] = [
        {
          id: 'dept001',
          name: '人力资源部',
          parentId: '',
          code: 'HR',
          level: 1,
          children: [
            {
              id: 'dept001-1',
              name: '招聘组',
              parentId: 'dept001',
              code: 'HR-REC',
              level: 2
            },
            {
              id: 'dept001-2',
              name: '培训组',
              parentId: 'dept001',
              code: 'HR-TRN',
              level: 2
            }
          ]
        }
      ]

      const filter = DataPermissionUtil.generateFilter(
        config,
        'user001',
        'dept001',
        departmentTree
      )

      expect(filter.departmentIds).toEqual(['dept001', 'dept001-1', 'dept001-2'])
    })

    it('应该生成本人数据的过滤条件', () => {
      const config: DataPermissionConfig = {
        type: 'SELF'
      }

      const filter = DataPermissionUtil.generateFilter(
        config,
        'user001',
        'dept001',
        []
      )

      expect(filter.creatorId).toBe('user001')
    })

    it('应该生成自定义部门数据的过滤条件', () => {
      const config: DataPermissionConfig = {
        type: 'CUSTOM',
        departments: ['dept001', 'dept002']
      }

      const filter = DataPermissionUtil.generateFilter(
        config,
        'user001',
        'dept001',
        []
      )

      expect(filter.departmentIds).toEqual(['dept001', 'dept002'])
    })

    it('应该正确处理特殊权限', () => {
      const config: DataPermissionConfig = {
        type: 'DEPARTMENT',
        includeCreator: true,
        includeManager: true,
        includeContact: true
      }

      const filter = DataPermissionUtil.generateFilter(
        config,
        'user001',
        'dept001',
        []
      )

      expect(filter.departmentIds).toEqual(['dept001'])
      expect(filter.creatorId).toBe('user001')
      expect(filter.managerId).toBe('user001')
      expect(filter.contactId).toBe('user001')
    })
  })

  describe('数据权限中间件', () => {
    it('应该拦截需要过滤的请求', () => {
      const departmentTree: Department[] = [
        {
          id: 'dept001',
          name: '人力资源部',
          parentId: '',
          code: 'HR',
          level: 1,
          children: []
        }
      ]

      const middleware = createDataPermissionMiddleware({
        enabled: true,
        userId: 'user001',
        departmentId: 'dept001',
        dataPermission: {
          type: 'DEPARTMENT'
        },
        departmentTree,
        filterPaths: ['/workers/list'],
        excludePaths: ['/public']
      })

      const config = {
        url: '/api/v1/workers/list',
        method: 'get',
        params: {}
      }

      const result = middleware.interceptRequest(config)

      expect(result.params).toHaveProperty('departmentIds')
      expect(result.params.departmentIds).toBe('dept001')
    })

    it('不应该拦截不需要过滤的请求', () => {
      const departmentTree: Department[] = [
        {
          id: 'dept001',
          name: '人力资源部',
          parentId: '',
          code: 'HR',
          level: 1,
          children: []
        }
      ]

      const middleware = createDataPermissionMiddleware({
        enabled: true,
        userId: 'user001',
        departmentId: 'dept001',
        dataPermission: {
          type: 'DEPARTMENT'
        },
        departmentTree,
        filterPaths: ['/workers/list'],
        excludePaths: ['/public']
      })

      const config = {
        url: '/api/v1/public/data',
        method: 'get',
        params: {}
      }

      const result = middleware.interceptRequest(config)

      expect(result.params).not.toHaveProperty('departmentIds')
    })

    it('应该在禁用时不拦截请求', () => {
      const departmentTree: Department[] = [
        {
          id: 'dept001',
          name: '人力资源部',
          parentId: '',
          code: 'HR',
          level: 1,
          children: []
        }
      ]

      const middleware = createDataPermissionMiddleware({
        enabled: false,
        userId: 'user001',
        departmentId: 'dept001',
        dataPermission: {
          type: 'DEPARTMENT'
        },
        departmentTree,
        filterPaths: ['/workers/list'],
        excludePaths: ['/public']
      })

      const config = {
        url: '/api/v1/workers/list',
        method: 'get',
        params: {}
      }

      const result = middleware.interceptRequest(config)

      expect(result.params).not.toHaveProperty('departmentIds')
    })

    it('应该生成本部门数据的SQL WHERE条件', () => {
      const departmentTree: Department[] = [
        {
          id: 'dept001',
          name: '人力资源部',
          parentId: '',
          code: 'HR',
          level: 1,
          children: []
        }
      ]

      const middleware = createDataPermissionMiddleware({
        enabled: true,
        userId: 'user001',
        departmentId: 'dept001',
        dataPermission: {
          type: 'DEPARTMENT'
        },
        departmentTree,
        filterPaths: ['/workers/list'],
        excludePaths: ['/public']
      })

      const sql = middleware.generateSQLWhereCondition()

      expect(sql).toContain('department_id')
      expect(sql).toContain('dept001')
    })

    it('应该生成本人数据的SQL WHERE条件', () => {
      const departmentTree: Department[] = [
        {
          id: 'dept001',
          name: '人力资源部',
          parentId: '',
          code: 'HR',
          level: 1,
          children: []
        }
      ]

      const middleware = createDataPermissionMiddleware({
        enabled: true,
        userId: 'user001',
        departmentId: 'dept001',
        dataPermission: {
          type: 'SELF'
        },
        departmentTree,
        filterPaths: ['/workers/list'],
        excludePaths: ['/public']
      })

      const sql = middleware.generateSQLWhereCondition()

      expect(sql).toContain('creator_id')
      expect(sql).toContain('user001')
    })

    it('应该生成本部门数据的MongoDB查询条件', () => {
      const departmentTree: Department[] = [
        {
          id: 'dept001',
          name: '人力资源部',
          parentId: '',
          code: 'HR',
          level: 1,
          children: []
        }
      ]

      const middleware = createDataPermissionMiddleware({
        enabled: true,
        userId: 'user001',
        departmentId: 'dept001',
        dataPermission: {
          type: 'DEPARTMENT'
        },
        departmentTree,
        filterPaths: ['/workers/list'],
        excludePaths: ['/public']
      })

      const query = middleware.generateMongoQuery()

      expect(query).toHaveProperty('departmentId')
      expect(query.departmentId).toEqual({ $in: ['dept001'] })
    })

    it('应该生成本人数据的MongoDB查询条件', () => {
      const departmentTree: Department[] = [
        {
          id: 'dept001',
          name: '人力资源部',
          parentId: '',
          code: 'HR',
          level: 1,
          children: []
        }
      ]

      const middleware = createDataPermissionMiddleware({
        enabled: true,
        userId: 'user001',
        departmentId: 'dept001',
        dataPermission: {
          type: 'SELF'
        },
        departmentTree,
        filterPaths: ['/workers/list'],
        excludePaths: ['/public']
      })

      const query = middleware.generateMongoQuery()

      expect(query).toHaveProperty('creatorId')
      expect(query.creatorId).toBe('user001')
    })
  })

  describe('数据权限在列表中的应用', () => {
    it('应该在工人列表中应用数据权限', async () => {
      const mockUserDataPermission = {
        userId: 'user001',
        username: '张三',
        departmentId: 'dept001',
        departmentName: '人力资源部',
        positionId: 'pos001',
        positionName: '人事专员',
        dataPermission: {
          type: 'DEPARTMENT'
        },
        isAdmin: false
      }

      const mockDepartmentTree: Department[] = [
        {
          id: 'dept001',
          name: '人力资源部',
          parentId: '',
          code: 'HR',
          level: 1,
          children: []
        }
      ]

      vi.mocked(dataPermissionService.getUserDataPermission).mockResolvedValue(
        mockUserDataPermission
      )
      vi.mocked(dataPermissionService.getDepartmentTree).mockResolvedValue(
        mockDepartmentTree
      )

      const { initialize, generateFilter } = useDataPermission()

      await initialize()

      const filter = generateFilter()

      expect(filter).toHaveProperty('departmentIds')
      expect(filter.departmentIds).toEqual(['dept001'])
    })

    it('应该在流程列表中应用数据权限', async () => {
      const mockUserDataPermission = {
        userId: 'user001',
        username: '张三',
        departmentId: 'dept001',
        departmentName: '人力资源部',
        positionId: 'pos001',
        positionName: '人事专员',
        dataPermission: {
          type: 'DEPARTMENT'
        },
        isAdmin: false
      }

      const mockDepartmentTree: Department[] = [
        {
          id: 'dept001',
          name: '人力资源部',
          parentId: '',
          code: 'HR',
          level: 1,
          children: []
        }
      ]

      vi.mocked(dataPermissionService.getUserDataPermission).mockResolvedValue(
        mockUserDataPermission
      )
      vi.mocked(dataPermissionService.getDepartmentTree).mockResolvedValue(
        mockDepartmentTree
      )

      const { initialize, generateFilter } = useDataPermission()

      await initialize()

      const filter = generateFilter()

      expect(filter).toHaveProperty('departmentIds')
      expect(filter.departmentIds).toEqual(['dept001'])
    })
  })

  describe('数据权限缓存', () => {
    it('应该缓存数据权限配置', () => {
      const cache = {
        userDataPermission: {
          userId: 'user001',
          username: '张三',
          departmentId: 'dept001',
          departmentName: '人力资源部',
          positionId: 'pos001',
          positionName: '人事专员',
          dataPermission: {
            type: 'DEPARTMENT'
          },
          isAdmin: false
        },
        departmentTree: [],
        departmentMap: new Map(),
        cacheTime: Date.now()
      }

      DataPermissionUtil.setCache(cache)
      const retrieved = DataPermissionUtil.getCache()

      expect(retrieved).toEqual(cache)
    })

    it('应该清除缓存', () => {
      const cache = {
        userDataPermission: {
          userId: 'user001',
          username: '张三',
          departmentId: 'dept001',
          departmentName: '人力资源部',
          positionId: 'pos001',
          positionName: '人事专员',
          dataPermission: {
            type: 'DEPARTMENT'
          },
          isAdmin: false
        },
        departmentTree: [],
        departmentMap: new Map(),
        cacheTime: Date.now()
      }

      DataPermissionUtil.setCache(cache)
      DataPermissionUtil.clearCache()

      const retrieved = DataPermissionUtil.getCache()

      expect(retrieved).toBeNull()
    })
  })

  describe('数据权限验证', () => {
    it('应该验证有效的权限配置', () => {
      const config: DataPermissionConfig = {
        type: 'DEPARTMENT'
      }

      expect(DataPermissionUtil.isValidPermission(config)).toBe(true)
    })

    it('应该验证无效的自定义权限配置', () => {
      const config: DataPermissionConfig = {
        type: 'CUSTOM',
        departments: []
      }

      expect(DataPermissionUtil.isValidPermission(config)).toBe(false)
    })

    it('应该验证有效的自定义权限配置', () => {
      const config: DataPermissionConfig = {
        type: 'CUSTOM',
        departments: ['dept001']
      }

      expect(DataPermissionUtil.isValidPermission(config)).toBe(true)
    })
  })

  describe('错误处理', () => {
    it('应该处理初始化失败', async () => {
      vi.mocked(dataPermissionService.getUserDataPermission).mockRejectedValue(
        new Error('获取用户数据权限失败')
      )

      const { initialize } = useDataPermission()

      await expect(initialize()).rejects.toThrow(
        '获取用户数据权限失败'
      )
    })

    it('应该处理部门树获取失败', async () => {
      const mockUserDataPermission = {
        userId: 'user001',
        username: '张三',
        departmentId: 'dept001',
        departmentName: '人力资源部',
        positionId: 'pos001',
        positionName: '人事专员',
        dataPermission: {
          type: 'DEPARTMENT'
        },
        isAdmin: false
      }

      vi.mocked(dataPermissionService.getUserDataPermission).mockResolvedValue(
        mockUserDataPermission
      )
      vi.mocked(dataPermissionService.getDepartmentTree).mockRejectedValue(
        new Error('获取部门树失败')
      )

      const { initialize } = useDataPermission()

      await expect(initialize()).rejects.toThrow(
        '获取部门树失败'
      )
    })
  })
})
