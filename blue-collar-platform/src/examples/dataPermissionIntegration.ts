/**
 * 数据权限集成示例
 * 演示如何在应用中集成数据权限功能
 */

import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

import App from './App.vue'
import { useDataPermission } from './composables/useDataPermission'
import { createDataPermissionMiddleware } from './middleware/dataPermissionMiddleware'

// 创建应用实例
const app = createApp(App)

// 创建路由实例
const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: () => import('./views/common/DataPermissionExample.vue')
    },
    {
      path: '/data-permission',
      name: 'DataPermission',
      component: () => import('./views/common/DataPermission.vue')
    }
  ]
})

// 使用路由
app.use(router)

// 使用Element Plus
app.use(ElementPlus)

// 数据权限集成
const {
  initialize,
  refresh,
  userDataPermission,
  departmentTree,
  isAdmin
} = useDataPermission()

// 在应用启动时初始化数据权限
initialize().then(() => {
  console.log('数据权限初始化成功')
  console.log('用户数据权限:', userDataPermission.value)
  console.log('是否管理员:', isAdmin.value)
}).catch(error => {
  console.error('数据权限初始化失败:', error)
})

// 如果使用axios，可以创建数据权限中间件
// import axios from 'axios'

// const api = axios.create({
//   baseURL: '/api/v1'
// })

// 创建数据权限中间件实例
// const dataPermissionMiddleware = createDataPermissionMiddleware({
//   enabled: true,
//   userId: computed(() => userDataPermission.value?.userId || ''),
//   departmentId: computed(() => userDataPermission.value?.departmentId || ''),
//   dataPermission: computed(() => userDataPermission.value?.dataPermission || { type: 'DEPARTMENT' }),
//   departmentTree: computed(() => departmentTree.value),
//   filterPaths: ['/workers/list', '/recruitment/list', '/contracts/list'],
//   excludePaths: ['/public', '/login']
// })

// 在axios请求拦截器中使用数据权限中间件
// api.interceptors.request.use((config) => {
//   return dataPermissionMiddleware.interceptRequest(config)
// })

// 在axios响应拦截器中处理权限错误
// api.interceptors.response.use(
//   (response) => dataPermissionMiddleware.interceptResponse(response),
//   (error) => dataPermissionMiddleware.interceptResponseError(error)
// )

// 路由守卫 - 检查数据权限
router.beforeEach(async (to, from, next) => {
  // 等待数据权限初始化
  if (!userDataPermission.value) {
    try {
      await initialize()
    } catch (error) {
      console.error('初始化数据权限失败:', error)
      // 可以跳转到错误页面或登录页面
      // next('/login')
      // return
    }
  }

  // 检查路由是否需要权限
  if (to.meta.requiresAuth) {
    // 这里可以添加更复杂的权限检查逻辑
    // 例如检查用户是否有访问特定路由的权限
    if (!userDataPermission.value) {
      console.error('用户未登录或数据权限未初始化')
      // next('/login')
      // return
    }
  }

  next()
})

// 挂载应用
app.mount('#app')

/**
 * 在组件中使用数据权限的示例
 */
/*
<template>
  <div>
    <!-- 使用数据权限选择器组件 -->
    <DataPermissionSelector
      v-model="permissionConfig"
      @save="handleSavePermission"
      @cancel="handleCancelPermission"
    />

    <!-- 使用CommonTable组件，数据权限会自动过滤 -->
    <CommonTable
      :columns="columns"
      :data="filteredData"
      :loading="loading"
    />

    <!-- 手动检查数据权限 -->
    <el-button
      v-if="hasPermissionToEdit"
      @click="handleEdit"
    >
      编辑
    </el-button>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import DataPermissionSelector from '@/components/DataPermissionSelector.vue'
import CommonTable from '@/components/CommonTable.vue'
import { useDataPermission } from '@/composables/useDataPermission'

const {
  userDataPermission,
  isAdmin,
  currentUserId,
  hasPermission,
  filterData,
  generateFilter,
  updateDataPermission
} = useDataPermission()

// 权限配置
const permissionConfig = ref({
  type: 'DEPARTMENT',
  includeCreator: false,
  includeManager: false,
  includeContact: false
})

// 数据列表
const dataList = ref([])

// 过滤后的数据列表
const filteredData = computed(() => {
  if (isAdmin.value) {
    return dataList.value
  }
  return filterData(dataList.value)
})

// 是否有编辑权限
const hasPermissionToEdit = computed(() => {
  return isAdmin.value || hasPermission({ creatorId: currentUserId.value })
})

// 加载数据
const loadData = async () => {
  // 生成数据权限过滤条件
  const filter = generateFilter()

  // 调用API时传递过滤条件
  // const response = await api.get('/workers/list', { params: filter })
  // dataList.value = response.data.list
}

// 保存权限配置
const handleSavePermission = async (config: any) => {
  try {
    await updateDataPermission(config)
    console.log('权限配置已更新')
  } catch (error) {
    console.error('更新权限配置失败:', error)
  }
}

// 取消权限配置
const handleCancelPermission = () => {
  console.log('取消权限配置')
}

// 编辑操作
const handleEdit = () => {
  console.log('执行编辑操作')
}

// 初始化
onMounted(() => {
  loadData()
})
</script>
*/

/**
 * 在API服务中使用数据权限的示例
 */
/*
import api from './api'
import { useDataPermission } from '@/composables/useDataPermission'

const { generateFilter } = useDataPermission()

// 获取工人信息
export const getWorkers = async (params: any = {}) => {
  // 生成数据权限过滤条件
  const dataPermissionFilter = generateFilter()

  // 合并查询参数
  const queryParams = {
    ...params,
    ...dataPermissionFilter
  }

  // 调用API
  const response = await api.get('/workers/list', { params: queryParams })
  return response.data
}

// 创建工人
export const createWorker = async (data: any) => {
  const response = await api.post('/workers', data)
  return response.data
}

// 更新工人
export const updateWorker = async (id: string, data: any) => {
  const response = await api.put(`/workers/${id}`, data)
  return response.data
}

// 删除工人
export const deleteWorker = async (id: string) => {
  const response = await api.delete(`/workers/${id}`)
  return response.data
}
*/

/**
 * 在Vuex/Pinia store中使用数据权限的示例
 */
/*
import { defineStore } from 'pinia'
import { useDataPermission } from '@/composables/useDataPermission'

export const useWorkerStore = defineStore('worker', () => {
  const {
    userDataPermission,
    isAdmin,
    hasPermission,
    filterData,
    generateFilter
  } = useDataPermission()

  const workers = ref([])
  const loading = ref(false)

  // 获取工人信息
  const fetchWorkers = async () => {
    loading.value = true
    try {
      const filter = generateFilter()
      const response = await api.get('/workers/list', { params: filter })
      workers.value = response.data.list
    } catch (error) {
      console.error('获取工人列表失败:', error)
    } finally {
      loading.value = false
    }
  }

  // 检查是否有权限操作工人
  const canOperateWorker = (worker: any) => {
    return isAdmin.value || hasPermission(worker)
  }

  // 过滤工人列表
  const getFilteredWorkers = () => {
    if (isAdmin.value) {
      return workers.value
    }
    return filterData(workers.value)
  }

  return {
    workers,
    loading,
    fetchWorkers,
    canOperateWorker,
    getFilteredWorkers
  }
})
*/

export default app
