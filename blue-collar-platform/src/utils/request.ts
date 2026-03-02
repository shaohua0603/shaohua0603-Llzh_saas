import axios from 'axios'
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import { ElMessage } from 'element-plus'
import type { ApiResponse, ErrorResponse, ValidationError } from '../types/response'
import { ResponseCode } from '../types/response'

const baseURL = ''
console.log('Base URL:', baseURL)

const request: AxiosInstance = axios.create({
  baseURL: baseURL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json;charset=UTF-8'
  }
})

request.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    console.log('Request URL:', config.url)
    console.log('Request baseURL:', config.baseURL)
    console.log('Full request URL:', config.baseURL + config.url)
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

request.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => {
    const responseType = response.config.responseType

    console.log('=== 响应拦截器开始 ===')
    console.log('请求URL:', response.config.url)
    console.log('响应状态:', response.status)
    console.log('完整响应:', response)

    if (responseType === 'blob') {
      console.log('=== 响应拦截器结束 (blob类型) ===')
      return response
    }

    console.log('Response data:', response.data)
    console.log('Response data type:', typeof response.data)
    console.log('Response data JSON:', JSON.stringify(response.data, null, 2))

    // 检查response.data是否存在且是对象
    if (!response.data) {
      console.error('=== 响应拦截器错误: 响应数据为空 ===')
      return Promise.reject(new Error('响应数据为空'))
    }

    if (typeof response.data !== 'object' || response.data === null) {
      console.error('=== 响应拦截器错误: 响应数据不是对象 ===')
      console.error('响应数据:', response.data)
      console.error('响应数据类型:', typeof response.data)
      return Promise.reject(new Error('响应数据格式错误'))
    }

    // 检查是否包含必要的属性
    if (!('code' in response.data)) {
      console.error('=== 响应拦截器错误: 响应数据缺少code属性 ===')
      console.error('响应数据:', response.data)
      console.error('响应数据的所有属性:', Object.keys(response.data))
      return Promise.reject(new Error('响应数据格式错误'))
    }

    const { code, message, data } = response.data

    if (code === ResponseCode.SUCCESS || code === ResponseCode.CREATED || code === ResponseCode.NO_CONTENT) {
      console.log('=== 响应拦截器成功: 返回响应数据 ===')
      console.log('返回的数据:', response.data)
      // 返回响应数据，让调用者访问response.data.list
      return response.data
    }

    if (code === ResponseCode.UNAUTHORIZED) {
      ElMessage.error(message || '登录已过期，请重新登录')
      localStorage.removeItem('token')
      localStorage.removeItem('userInfo')
      window.location.href = '/login'
      return Promise.reject(new Error(message))
    }

    if (code === ResponseCode.FORBIDDEN) {
      ElMessage.error(message || '没有权限访问该资源')
      return Promise.reject(new Error(message))
    }

    if (code === ResponseCode.NOT_FOUND) {
      ElMessage.error(message || '请求的资源不存在')
      return Promise.reject(new Error(message))
    }

    if (code === ResponseCode.BAD_REQUEST) {
      ElMessage.error(message || '请求参数错误')
      return Promise.reject(new Error(message))
    }

    if (code === ResponseCode.VALIDATION_ERROR) {
      const errorResponse = response.data as unknown as ErrorResponse
      if (errorResponse.errors && errorResponse.errors.length > 0) {
        const firstError = errorResponse.errors[0]
        ElMessage.error(`${firstError.field}: ${firstError.message}`)
      } else {
        ElMessage.error(message || '数据验证失败')
      }
      return Promise.reject(new Error(message))
    }

    ElMessage.error(message || '请求失败')
    return Promise.reject(new Error(message))
  },
  (error) => {
    if (error.response) {
      const { status, data, headers } = error.response

      if (headers['content-type']?.includes('application/json')) {
        if (status === 401) {
          ElMessage.error(data?.message || '登录已过期，请重新登录')
          localStorage.removeItem('token')
          localStorage.removeItem('userInfo')
          window.location.href = '/login'
        } else if (status === 403) {
          ElMessage.error(data?.message || '没有权限访问该资源')
        } else if (status === 404) {
          ElMessage.error(data?.message || '请求的资源不存在')
        } else if (status === 400) {
          ElMessage.error(data?.message || '请求参数错误')
        } else if (status === 422) {
          const errorResponse = data as ErrorResponse
          if (errorResponse.errors && errorResponse.errors.length > 0) {
            const firstError = errorResponse.errors[0]
            ElMessage.error(`${firstError.field}: ${firstError.message}`)
          } else {
            ElMessage.error(data?.message || '数据验证失败')
          }
        } else if (status === 500) {
          ElMessage.error(data?.message || '服务器错误，请稍后重试')
        } else if (status === 503) {
          ElMessage.error(data?.message || '服务暂时不可用，请稍后重试')
        } else {
          ElMessage.error(data?.message || `请求失败 (${status})`)
        }
      } else {
        ElMessage.error(`请求失败 (${status})`)
      }
    } else if (error.request) {
      ElMessage.error('网络错误，请检查网络连接')
    } else {
      ElMessage.error('请求失败，请稍后重试')
    }

    return Promise.reject(error)
  }
)

export default request
