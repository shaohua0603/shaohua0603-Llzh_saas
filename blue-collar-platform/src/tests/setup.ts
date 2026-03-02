/**
 * Vitest 测试环境设置文件
 */

import { vi } from 'vitest'
import { config } from '@vue/test-utils'

// 全局 mock Element Plus
vi.mock('element-plus', () => ({
  ElMessage: {
    success: vi.fn(),
    error: vi.fn(),
    warning: vi.fn(),
    info: vi.fn()
  },
  ElMessageBox: {
    confirm: vi.fn(),
    alert: vi.fn(),
    prompt: vi.fn()
  },
  ElNotification: {
    success: vi.fn(),
    error: vi.fn(),
    warning: vi.fn(),
    info: vi.fn()
  }
}))

// 全局 mock Vue Router
vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    go: vi.fn(),
    back: vi.fn(),
    forward: vi.fn()
  }),
  useRoute: () => ({
    path: '/',
    query: {},
    params: {},
    meta: {}
  })
}))

// 全局 mock Pinia
vi.mock('pinia', () => ({
  createPinia: vi.fn(() => ({
    install: vi.fn()
  })),
  defineStore: vi.fn()
}))

// 配置 Vue Test Utils
config.global.stubs = {
  'el-button': true,
  'el-input': true,
  'el-form': true,
  'el-form-item': true,
  'el-table': true,
  'el-table-column': true,
  'el-dialog': true,
  'el-select': true,
  'el-option': true,
  'el-date-picker': true,
  'el-tree': true,
  'el-upload': true,
  'el-message-box': true,
  'el-notification': true
}

// 设置全局测试超时时间
vi.setConfig({
  testTimeout: 10000,
  hookTimeout: 10000
})
