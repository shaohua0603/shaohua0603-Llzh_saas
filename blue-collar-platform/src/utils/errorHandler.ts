/**
 * 统一错误处理工具类
 */

/**
 * 错误类型
 */
export type ErrorType = 'network' | 'business' | 'system' | 'permission' | 'validation'

/**
 * 错误级别
 */
export type ErrorLevel = 'info' | 'warning' | 'error' | 'fatal'

/**
 * 错误日志
 */
export interface ErrorLog {
  /** 错误ID */
  id: string
  /** 错误类型 */
  type: ErrorType
  /** 错误级别 */
  level: ErrorLevel
  /** 错误消息 */
  message: string
  /** 错误堆栈 */
  stack?: string
  /** 错误时间 */
  timestamp: string
  /** 用户ID */
  userId?: string
  /** 页面路径 */
  pageUrl?: string
  /** 额外信息 */
  extra?: Record<string, any>
}

/**
 * 错误处理配置
 */
export interface ErrorHandlerConfig {
  /** 是否显示错误提示 */
  showMessage?: boolean
  /** 是否记录错误日志 */
  logError?: boolean
  /** 是否上报错误 */
  reportError?: boolean
  /** 错误上报URL */
  reportUrl?: string
  /** 自定义错误处理函数 */
  customHandler?: (error: any) => void
}

/**
 * 错误处理工具类
 */
export class ErrorHandler {
  private static config: ErrorHandlerConfig = {
    showMessage: true,
    logError: true,
    reportError: false
  }

  private static errorLogs: ErrorLog[] = []
  private static maxErrorLogs = 100

  /**
   * 初始化错误处理器
   */
  static init(config?: Partial<ErrorHandlerConfig>): void {
    if (config) {
      this.config = { ...this.config, ...config }
    }

    // 全局错误捕获
    window.addEventListener('error', this.handleGlobalError)
    window.addEventListener('unhandledrejection', this.handleUnhandledRejection)

    // 从本地存储加载错误日志
    this.loadErrorLogs()
  }

  /**
   * 设置错误处理配置
   */
  static setConfig(config: Partial<ErrorHandlerConfig>): void {
    this.config = { ...this.config, ...config }
  }

  /**
   * 处理错误
   */
  static handle(error: any, context?: Record<string, any>): void {
    // 自定义错误处理
    if (this.config.customHandler) {
      this.config.customHandler(error)
    }

    // 解析错误
    const errorInfo = this.parseError(error, context)

    // 显示错误提示
    if (this.config.showMessage) {
      this.showErrorMessage(errorInfo)
    }

    // 记录错误日志
    if (this.config.logError) {
      this.logError(errorInfo)
    }

    // 上报错误
    if (this.config.reportError && this.config.reportUrl) {
      this.reportError(errorInfo)
    }
  }

  /**
   * 处理网络错误
   */
  static handleNetworkError(error: any): void {
    const errorInfo: ErrorLog = {
      id: this.generateErrorId(),
      type: 'network',
      level: 'error',
      message: this.getNetworkErrorMessage(error),
      timestamp: new Date().toISOString(),
      pageUrl: window.location.href,
      extra: {
        status: error.response?.status,
        statusText: error.response?.statusText,
        url: error.config?.url,
        method: error.config?.method
      }
    }

    this.handle(errorInfo)
  }

  /**
   * 处理业务错误
   */
  static handleBusinessError(error: any): void {
    const errorInfo: ErrorLog = {
      id: this.generateErrorId(),
      type: 'business',
      level: 'warning',
      message: error.message || '业务处理失败',
      timestamp: new Date().toISOString(),
      pageUrl: window.location.href,
      extra: {
        code: error.code,
        data: error.data
      }
    }

    this.handle(errorInfo)
  }

  /**
   * 处理权限错误
   */
  static handlePermissionError(error: any): void {
    const errorInfo: ErrorLog = {
      id: this.generateErrorId(),
      type: 'permission',
      level: 'warning',
      message: error.message || '权限不足',
      timestamp: new Date().toISOString(),
      pageUrl: window.location.href
    }

    this.handle(errorInfo)
  }

  /**
   * 处理验证错误
   */
  static handleValidationError(error: any): void {
    const errorInfo: ErrorLog = {
      id: this.generateErrorId(),
      type: 'validation',
      level: 'info',
      message: error.message || '数据验证失败',
      timestamp: new Date().toISOString(),
      pageUrl: window.location.href,
      extra: {
        errors: error.errors
      }
    }

    this.handle(errorInfo)
  }

  /**
   * 处理全局错误
   */
  private static handleGlobalError = (event: ErrorEvent): void => {
    const errorInfo: ErrorLog = {
      id: this.generateErrorId(),
      type: 'system',
      level: 'fatal',
      message: event.message || '系统错误',
      stack: event.error?.stack,
      timestamp: new Date().toISOString(),
      pageUrl: window.location.href,
      extra: {
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno
      }
    }

    this.handle(errorInfo)
  }

  /**
   * 处理未捕获的Promise rejection
   */
  private static handleUnhandledRejection = (event: PromiseRejectionEvent): void => {
    const errorInfo: ErrorLog = {
      id: this.generateErrorId(),
      type: 'system',
      level: 'error',
      message: event.reason?.message || '未处理的Promise rejection',
      stack: event.reason?.stack,
      timestamp: new Date().toISOString(),
      pageUrl: window.location.href,
      extra: {
        reason: event.reason
      }
    }

    this.handle(errorInfo)
  }

  /**
   * 解析错误
   */
  private static parseError(error: any, context?: Record<string, any>): ErrorLog {
    let type: ErrorType = 'system'
    let level: ErrorLevel = 'error'
    let message = '未知错误'

    if (error.response) {
      // 网络错误
      type = 'network'
      level = 'error'
      message = this.getNetworkErrorMessage(error)
    } else if (error.code) {
      // 业务错误
      type = 'business'
      level = 'warning'
      message = error.message || '业务处理失败'
    } else if (error instanceof Error) {
      // 系统错误
      type = 'system'
      level = 'error'
      message = error.message || '系统错误'
    } else if (typeof error === 'string') {
      // 字符串错误
      type = 'business'
      level = 'warning'
      message = error
    }

    return {
      id: this.generateErrorId(),
      type,
      level,
      message,
      stack: error.stack,
      timestamp: new Date().toISOString(),
      pageUrl: window.location.href,
      extra: context
    }
  }

  /**
   * 获取网络错误消息
   */
  private static getNetworkErrorMessage(error: any): string {
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
   * 显示错误消息
   */
  private static showErrorMessage(errorInfo: ErrorLog): void {
    // 这里需要引入Element Plus的ElMessage
    // 由于循环依赖问题,这里只做简单处理
    console.error('[ErrorHandler]', errorInfo.message)
  }

  /**
   * 记录错误日志
   */
  private static logError(errorInfo: ErrorLog): void {
    // 添加到错误日志列表
    this.errorLogs.unshift(errorInfo)

    // 限制日志数量
    if (this.errorLogs.length > this.maxErrorLogs) {
      this.errorLogs = this.errorLogs.slice(0, this.maxErrorLogs)
    }

    // 保存到本地存储
    this.saveErrorLogs()

    // 打印到控制台
    console.error('[ErrorHandler]', errorInfo)
  }

  /**
   * 上报错误
   */
  private static reportError(errorInfo: ErrorLog): void {
    if (!this.config.reportUrl) return

    // 这里可以使用fetch或axios上报错误
    fetch(this.config.reportUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(errorInfo)
    }).catch(err => {
      console.error('[ErrorHandler] 上报错误失败', err)
    })
  }

  /**
   * 生成错误ID
   */
  private static generateErrorId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }

  /**
   * 保存错误日志到本地存储
   */
  private static saveErrorLogs(): void {
    try {
      localStorage.setItem('error_logs', JSON.stringify(this.errorLogs))
    } catch (err) {
      console.error('[ErrorHandler] 保存错误日志失败', err)
    }
  }

  /**
   * 从本地存储加载错误日志
   */
  private static loadErrorLogs(): void {
    try {
      const logs = localStorage.getItem('error_logs')
      if (logs) {
        this.errorLogs = JSON.parse(logs)
      }
    } catch (err) {
      console.error('[ErrorHandler] 加载错误日志失败', err)
    }
  }

  /**
   * 获取错误日志
   */
  static getErrorLogs(): ErrorLog[] {
    return [...this.errorLogs]
  }

  /**
   * 清除错误日志
   */
  static clearErrorLogs(): void {
    this.errorLogs = []
    localStorage.removeItem('error_logs')
  }

  /**
   * 销毁错误处理器
   */
  static destroy(): void {
    window.removeEventListener('error', this.handleGlobalError)
    window.removeEventListener('unhandledrejection', this.handleUnhandledRejection)
  }
}
