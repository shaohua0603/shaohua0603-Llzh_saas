/**
 * 错误处理 Composable
 */

import { ref } from 'vue'
import { ElMessage, ElNotification } from 'element-plus'
import {
  ErrorHandler,
  type ErrorType,
  type ErrorLevel,
  type ErrorLog
} from '../utils/errorHandler'

/**
 * 使用错误处理
 */
export function useErrorHandler() {
  const errorLogs = ref<ErrorLog[]>([])
  const loading = ref(false)

  /**
   * 初始化错误处理器
   */
  const initErrorHandler = (config?: any): void => {
    ErrorHandler.init(config)
    errorLogs.value = ErrorHandler.getErrorLogs()
  }

  /**
   * 处理错误
   */
  const handleError = (error: any, context?: Record<string, any>): void => {
    ErrorHandler.handle(error, context)
    errorLogs.value = ErrorHandler.getErrorLogs()
  }

  /**
   * 处理网络错误
   */
  const handleNetworkError = (error: any): void => {
    ErrorHandler.handleNetworkError(error)
    errorLogs.value = ErrorHandler.getErrorLogs()

    // 显示错误提示
    const message = getNetworkErrorMessage(error)
    ElMessage.error(message)
  }

  /**
   * 处理业务错误
   */
  const handleBusinessError = (error: any): void => {
    ErrorHandler.handleBusinessError(error)
    errorLogs.value = ErrorHandler.getErrorLogs()

    // 显示错误提示
    const message = error.message || '业务处理失败'
    ElMessage.warning(message)
  }

  /**
   * 处理权限错误
   */
  const handlePermissionError = (error: any): void => {
    ErrorHandler.handlePermissionError(error)
    errorLogs.value = ErrorHandler.getErrorLogs()

    // 显示错误提示
    const message = error.message || '权限不足'
    ElMessage.warning(message)
  }

  /**
   * 处理验证错误
   */
  const handleValidationError = (error: any): void => {
    ErrorHandler.handleValidationError(error)
    errorLogs.value = ErrorHandler.getErrorLogs()

    // 显示错误提示
    const message = error.message || '数据验证失败'
    ElMessage.info(message)
  }

  /**
   * 显示成功消息
   */
  const showSuccess = (message: string): void => {
    ElMessage.success(message)
  }

  /**
   * 显示警告消息
   */
  const showWarning = (message: string): void => {
    ElMessage.warning(message)
  }

  /**
   * 显示错误消息
   */
  const showError = (message: string): void => {
    ElMessage.error(message)
  }

  /**
   * 显示信息消息
   */
  const showInfo = (message: string): void => {
    ElMessage.info(message)
  }

  /**
   * 显示成功通知
   */
  const showSuccessNotification = (title: string, message: string): void => {
    ElNotification({
      title,
      message,
      type: 'success',
      duration: 3000
    })
  }

  /**
   * 显示警告通知
   */
  const showWarningNotification = (title: string, message: string): void => {
    ElNotification({
      title,
      message,
      type: 'warning',
      duration: 3000
    })
  }

  /**
   * 显示错误通知
   */
  const showErrorNotification = (title: string, message: string): void => {
    ElNotification({
      title,
      message,
      type: 'error',
      duration: 0 // 错误通知不自动关闭
    })
  }

  /**
   * 显示信息通知
   */
  const showInfoNotification = (title: string, message: string): void => {
    ElNotification({
      title,
      message,
      type: 'info',
      duration: 3000
    })
  }

  /**
   * 获取网络错误消息
   */
  const getNetworkErrorMessage = (error: any): string => {
    const status = error.response?.status

    const statusMessages: Record<number, string> = {
      400: '请求参数错误',
      401: '未授权,请重新登录',
      403: '权限不足',
      404: '请求的资源不存在',
      500: '服务器错误',
      502: '网关错误',
      503: '服务不可用',
      504: '请求超时'
    }

    if (status && statusMessages[status]) {
      return statusMessages[status]
    }

    if (error.message) {
      return error.message
    }

    return '网络请求失败'
  }

  /**
   * 获取错误日志
   */
  const getErrorLogs = (): ErrorLog[] => {
    return ErrorHandler.getErrorLogs()
  }

  /**
   * 清除错误日志
   */
  const clearErrorLogs = (): void => {
    ErrorHandler.clearErrorLogs()
    errorLogs.value = []
  }

  /**
   * 销毁错误处理器
   */
  const destroyErrorHandler = (): void => {
    ErrorHandler.destroy()
  }

  return {
    errorLogs,
    loading,
    initErrorHandler,
    handleError,
    handleNetworkError,
    handleBusinessError,
    handlePermissionError,
    handleValidationError,
    showSuccess,
    showWarning,
    showError,
    showInfo,
    showSuccessNotification,
    showWarningNotification,
    showErrorNotification,
    showInfoNotification,
    getErrorLogs,
    clearErrorLogs,
    destroyErrorHandler
  }
}
