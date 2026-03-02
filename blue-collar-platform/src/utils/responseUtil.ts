/**
 * 统一响应格式工具类
 * 用于创建和解析标准化的API响应
 */

import type {
  ApiResponse,
  PageResponse,
  PageData,
  ErrorResponse,
  ValidationError,
  BatchOperationResponse,
  ExportResponse,
  ImportResponse,
  UploadResponse,
  DeleteResponse,
  ApprovalResponse,
  StatisticsResponse,
  ChartDataResponse,
  DictionaryResponse,
  MenuTreeResponse,
  DepartmentTreeResponse,
  UserInfoResponse,
  LoginResponse,
  RefreshTokenResponse,
  OperationLogResponse,
  ApprovalRecordResponse,
  AttachmentListResponse,
  AttachmentDetailResponse,
  ResponseCode,
} from '../types/response';

/**
 * 响应工具类
 */
export class ResponseUtil {
  /**
   * 创建成功响应
   * @param data 返回数据
   * @param message 提示信息
   * @returns 标准响应格式
   */
  static success<T = any>(data?: T, message: string = '操作成功'): ApiResponse<T> {
    return {
      code: ResponseCode.SUCCESS,
      message,
      data: data as T,
      timestamp: Date.now(),
    };
  }

  /**
   * 创建成功响应（创建成功）
   * @param data 返回数据
   * @param message 提示信息
   * @returns 标准响应格式
   */
  static created<T = any>(data?: T, message: string = '创建成功'): ApiResponse<T> {
    return {
      code: ResponseCode.CREATED,
      message,
      data: data as T,
      timestamp: Date.now(),
    };
  }

  /**
   * 创建无内容响应
   * @param message 提示信息
   * @returns 标准响应格式
   */
  static noContent(message: string = '操作成功，无返回内容'): ApiResponse {
    return {
      code: ResponseCode.NO_CONTENT,
      message,
      data: null,
      timestamp: Date.now(),
    };
  }

  /**
   * 创建错误响应
   * @param code 响应码
   * @param message 提示信息
   * @returns 错误响应格式
   */
  static error(code: ResponseCode, message: string): ErrorResponse {
    return {
      code,
      message,
      timestamp: Date.now(),
    };
  }

  /**
   * 创建请求参数错误响应
   * @param message 提示信息
   * @returns 错误响应格式
   */
  static badRequest(message: string = '请求参数错误'): ErrorResponse {
    return this.error(ResponseCode.BAD_REQUEST, message);
  }

  /**
   * 创建未授权响应
   * @param message 提示信息
   * @returns 错误响应格式
   */
  static unauthorized(message: string = '未授权，请重新登录'): ErrorResponse {
    return this.error(ResponseCode.UNAUTHORIZED, message);
  }

  /**
   * 创建无权限响应
   * @param message 提示信息
   * @returns 错误响应格式
   */
  static forbidden(message: string = '无权限访问'): ErrorResponse {
    return this.error(ResponseCode.FORBIDDEN, message);
  }

  /**
   * 创建资源不存在响应
   * @param message 提示信息
   * @returns 错误响应格式
   */
  static notFound(message: string = '资源不存在'): ErrorResponse {
    return this.error(ResponseCode.NOT_FOUND, message);
  }

  /**
   * 创建验证错误响应
   * @param errors 验证错误列表
   * @param message 提示信息
   * @returns 错误响应格式
   */
  static validationError(errors: ValidationError[], message: string = '数据验证失败'): ErrorResponse {
    return {
      code: ResponseCode.VALIDATION_ERROR,
      message,
      errors,
      timestamp: Date.now(),
    };
  }

  /**
   * 创建服务器错误响应
   * @param message 提示信息
   * @returns 错误响应格式
   */
  static internalError(message: string = '服务器内部错误'): ErrorResponse {
    return this.error(ResponseCode.INTERNAL_ERROR, message);
  }

  /**
   * 创建服务不可用响应
   * @param message 提示信息
   * @returns 错误响应格式
   */
  static serviceUnavailable(message: string = '服务暂时不可用'): ErrorResponse {
    return this.error(ResponseCode.SERVICE_UNAVAILABLE, message);
  }

  /**
   * 创建分页响应
   * @param list 数据列表
   * @param total 总记录数
   * @param page 当前页
   * @param pageSize 每页记录数
   * @param message 提示信息
   * @returns 分页响应格式
   */
  static page<T = any>(
    list: T[],
    total: number,
    page: number,
    pageSize: number,
    message: string = '查询成功'
  ): PageResponse<T> {
    const totalPages = Math.ceil(total / pageSize);
    return {
      code: ResponseCode.SUCCESS,
      message,
      data: {
        list,
        total,
        page,
        pageSize,
        totalPages,
      },
      timestamp: Date.now(),
    };
  }

  /**
   * 创建批量操作响应
   * @param successCount 成功数量
   * @param failureCount 失败数量
   * @param successIds 成功ID列表
   * @param failureIds 失败ID列表
   * @param errors 错误列表
   * @param message 提示信息
   * @returns 批量操作响应格式
   */
  static batchOperation(
    successCount: number,
    failureCount: number,
    successIds: number[],
    failureIds: number[],
    errors: Array<{ id: number; error: string }>,
    message: string = '批量操作完成'
  ): BatchOperationResponse {
    return {
      code: ResponseCode.SUCCESS,
      message,
      data: {
        successCount,
        failureCount,
        successIds,
        failureIds,
        errors,
      },
      timestamp: Date.now(),
    };
  }

  /**
   * 创建导出响应
   * @param fileUrl 文件URL
   * @param fileName 文件名
   * @param fileSize 文件大小
   * @param downloadUrl 下载URL
   * @param message 提示信息
   * @returns 导出响应格式
   */
  static export(
    fileUrl: string,
    fileName: string,
    fileSize: number,
    downloadUrl: string,
    message: string = '导出成功'
  ): ExportResponse {
    return {
      code: ResponseCode.SUCCESS,
      message,
      data: {
        fileUrl,
        fileName,
        fileSize,
        downloadUrl,
      },
      timestamp: Date.now(),
    };
  }

  /**
   * 创建导入响应
   * @param totalCount 总数量
   * @param successCount 成功数量
   * @param failureCount 失败数量
   * @param errors 错误列表
   * @param message 提示信息
   * @returns 导入响应格式
   */
  static import(
    totalCount: number,
    successCount: number,
    failureCount: number,
    errors: Array<{ row: number; field: string; message: string }>,
    message: string = '导入完成'
  ): ImportResponse {
    return {
      code: ResponseCode.SUCCESS,
      message,
      data: {
        totalCount,
        successCount,
        failureCount,
        errors,
      },
      timestamp: Date.now(),
    };
  }

  /**
   * 创建上传响应
   * @param fileId 文件ID
   * @param fileName 文件名
   * @param filePath 文件路径
   * @param fileSize 文件大小
   * @param fileType 文件类型
   * @param url 文件URL
   * @param message 提示信息
   * @returns 上传响应格式
   */
  static upload(
    fileId: string,
    fileName: string,
    filePath: string,
    fileSize: number,
    fileType: string,
    url: string,
    message: string = '上传成功'
  ): UploadResponse {
    return {
      code: ResponseCode.SUCCESS,
      message,
      data: {
        fileId,
        fileName,
        filePath,
        fileSize,
        fileType,
        url,
      },
      timestamp: Date.now(),
    };
  }

  /**
   * 创建删除响应
   * @param deletedCount 删除数量
   * @param deletedIds 删除ID列表
   * @param message 提示信息
   * @returns 删除响应格式
   */
  static delete(
    deletedCount: number,
    deletedIds: number[],
    message: string = '删除成功'
  ): DeleteResponse {
    return {
      code: ResponseCode.SUCCESS,
      message,
      data: {
        deletedCount,
        deletedIds,
      },
      timestamp: Date.now(),
    };
  }

  /**
   * 创建审批响应
   * @param approvalId 审批ID
   * @param businessId 业务ID
   * @param businessType 业务类型
   * @param nodeName 节点名称
   * @param approvalResult 审批结果
   * @param approvalComment 审批意见
   * @param approvalTime 审批时间
   * @param message 提示信息
   * @returns 审批响应格式
   */
  static approval(
    approvalId: string,
    businessId: number,
    businessType: string,
    nodeName: string,
    approvalResult: 'approved' | 'rejected',
    approvalComment: string,
    approvalTime: string,
    message: string = '审批完成'
  ): ApprovalResponse {
    return {
      code: ResponseCode.SUCCESS,
      message,
      data: {
        approvalId,
        businessId,
        businessType,
        nodeName,
        approvalResult,
        approvalComment,
        approvalTime,
      },
      timestamp: Date.now(),
    };
  }

  /**
   * 创建统计数据响应
   * @param total 总数
   * @param today 今日数据
   * @param week 本周数据
   * @param month 本月数据
   * @param year 本年数据
   * @param trend 趋势数据
   * @param message 提示信息
   * @returns 统计数据响应格式
   */
  static statistics(
    total: number,
    today: number,
    week: number,
    month: number,
    year: number,
    trend: Array<{ date: string; value: number }>,
    message: string = '查询成功'
  ): StatisticsResponse {
    return {
      code: ResponseCode.SUCCESS,
      message,
      data: {
        total,
        today,
        week,
        month,
        year,
        trend,
      },
      timestamp: Date.now(),
    };
  }

  /**
   * 创建图表数据响应
   * @param categories 类别列表
   * @param series 数据系列
   * @param message 提示信息
   * @returns 图表数据响应格式
   */
  static chartData(
    categories: string[],
    series: Array<{ name: string; data: number[]; color?: string }>,
    message: string = '查询成功'
  ): ChartDataResponse {
    return {
      code: ResponseCode.SUCCESS,
      message,
      data: {
        categories,
        series,
      },
      timestamp: Date.now(),
    };
  }

  /**
   * 创建字典数据响应
   * @param data 字典数据列表
   * @param message 提示信息
   * @returns 字典数据响应格式
   */
  static dictionary(
    data: Array<{
      dictLabel: string;
      dictValue: string;
      dictSort: number;
      cssClass?: string;
      listClass?: string;
      isDefault?: boolean;
    }>,
    message: string = '查询成功'
  ): DictionaryResponse {
    return {
      code: ResponseCode.SUCCESS,
      message,
      data,
      timestamp: Date.now(),
    };
  }

  /**
   * 创建菜单树响应
   * @param data 菜单树数据
   * @param message 提示信息
   * @returns 菜单树响应格式
   */
  static menuTree(
    data: MenuTreeResponse['data'],
    message: string = '查询成功'
  ): MenuTreeResponse {
    return {
      code: ResponseCode.SUCCESS,
      message,
      data,
      timestamp: Date.now(),
    };
  }

  /**
   * 创建部门树响应
   * @param data 部门树数据
   * @param message 提示信息
   * @returns 部门树响应格式
   */
  static departmentTree(
    data: DepartmentTreeResponse['data'],
    message: string = '查询成功'
  ): DepartmentTreeResponse {
    return {
      code: ResponseCode.SUCCESS,
      message,
      data,
      timestamp: Date.now(),
    };
  }

  /**
   * 创建用户信息响应
   * @param data 用户信息
   * @param message 提示信息
   * @returns 用户信息响应格式
   */
  static userInfo(
    data: UserInfoResponse['data'],
    message: string = '查询成功'
  ): UserInfoResponse {
    return {
      code: ResponseCode.SUCCESS,
      message,
      data,
      timestamp: Date.now(),
    };
  }

  /**
   * 创建登录响应
   * @param token 访问令牌
   * @param tokenType 令牌类型
   * @param expiresIn 过期时间
   * @param refreshToken 刷新令牌
   * @param userInfo 用户信息
   * @param message 提示信息
   * @returns 登录响应格式
   */
  static login(
    token: string,
    tokenType: string,
    expiresIn: number,
    refreshToken: string | undefined,
    userInfo: UserInfoResponse['data'],
    message: string = '登录成功'
  ): LoginResponse {
    return {
      code: ResponseCode.SUCCESS,
      message,
      data: {
        token,
        tokenType,
        expiresIn,
        refreshToken,
        userInfo,
      },
      timestamp: Date.now(),
    };
  }

  /**
   * 创建刷新Token响应
   * @param token 访问令牌
   * @param tokenType 令牌类型
   * @param expiresIn 过期时间
   * @param refreshToken 刷新令牌
   * @param message 提示信息
   * @returns 刷新Token响应格式
   */
  static refreshToken(
    token: string,
    tokenType: string,
    expiresIn: number,
    refreshToken: string | undefined,
    message: string = '刷新成功'
  ): RefreshTokenResponse {
    return {
      code: ResponseCode.SUCCESS,
      message,
      data: {
        token,
        tokenType,
        expiresIn,
        refreshToken,
      },
      timestamp: Date.now(),
    };
  }

  /**
   * 创建操作日志响应
   * @param data 操作日志列表
   * @param message 提示信息
   * @returns 操作日志响应格式
   */
  static operationLog(
    data: OperationLogResponse['data'],
    message: string = '查询成功'
  ): OperationLogResponse {
    return {
      code: ResponseCode.SUCCESS,
      message,
      data,
      timestamp: Date.now(),
    };
  }

  /**
   * 创建审批记录响应
   * @param data 审批记录列表
   * @param message 提示信息
   * @returns 审批记录响应格式
   */
  static approvalRecord(
    data: ApprovalRecordResponse['data'],
    message: string = '查询成功'
  ): ApprovalRecordResponse {
    return {
      code: ResponseCode.SUCCESS,
      message,
      data,
      timestamp: Date.now(),
    };
  }

  /**
   * 创建附件列表响应
   * @param data 附件列表
   * @param message 提示信息
   * @returns 附件列表响应格式
   */
  static attachmentList(
    data: AttachmentListResponse['data'],
    message: string = '查询成功'
  ): AttachmentListResponse {
    return {
      code: ResponseCode.SUCCESS,
      message,
      data,
      timestamp: Date.now(),
    };
  }

  /**
   * 创建附件详情响应
   * @param data 附件详情
   * @param message 提示信息
   * @returns 附件详情响应格式
   */
  static attachmentDetail(
    data: AttachmentDetailResponse['data'],
    message: string = '查询成功'
  ): AttachmentDetailResponse {
    return {
      code: ResponseCode.SUCCESS,
      message,
      data,
      timestamp: Date.now(),
    };
  }

  /**
   * 检查响应是否成功
   * @param response 响应数据
   * @returns 是否成功
   */
  static isSuccess(response: ApiResponse): boolean {
    return response.code === ResponseCode.SUCCESS;
  }

  /**
   * 检查响应是否失败
   * @param response 响应数据
   * @returns 是否失败
   */
  static isError(response: ApiResponse | ErrorResponse): boolean {
    return response.code >= 400;
  }

  /**
   * 从响应中提取数据
   * @param response 响应数据
   * @returns 响应数据
   */
  static extractData<T>(response: ApiResponse<T>): T {
    return response.data;
  }

  /**
   * 从响应中提取错误信息
   * @param response 响应数据
   * @returns 错误信息
   */
  static extractError(response: ErrorResponse): string {
    return response.message;
  }

  /**
   * 从验证错误响应中提取错误列表
   * @param response 响应数据
   * @returns 验证错误列表
   */
  static extractValidationErrors(response: ErrorResponse): ValidationError[] | undefined {
    return (response as any).errors;
  }
}
