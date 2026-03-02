/**
 * 统一响应格式类型定义
 */

/**
 * 响应码枚举
 */
export enum ResponseCode {
  SUCCESS = 200,           // 成功
  CREATED = 201,          // 创建成功
  NO_CONTENT = 204,       // 无内容
  BAD_REQUEST = 400,      // 请求参数错误
  UNAUTHORIZED = 401,     // 未授权
  FORBIDDEN = 403,        // 无权限
  NOT_FOUND = 404,        // 资源不存在
  METHOD_NOT_ALLOWED = 405, // 方法不允许
  CONFLICT = 409,         // 冲突
  VALIDATION_ERROR = 422, // 验证错误
  INTERNAL_ERROR = 500,   // 服务器错误
  SERVICE_UNAVAILABLE = 503, // 服务不可用
}

/**
 * 响应码对应的中文描述
 */
export const ResponseCodeMessage: Record<ResponseCode, string> = {
  [ResponseCode.SUCCESS]: '操作成功',
  [ResponseCode.CREATED]: '创建成功',
  [ResponseCode.NO_CONTENT]: '操作成功，无返回内容',
  [ResponseCode.BAD_REQUEST]: '请求参数错误',
  [ResponseCode.UNAUTHORIZED]: '未授权，请重新登录',
  [ResponseCode.FORBIDDEN]: '无权限访问',
  [ResponseCode.NOT_FOUND]: '资源不存在',
  [ResponseCode.METHOD_NOT_ALLOWED]: '请求方法不允许',
  [ResponseCode.CONFLICT]: '数据冲突',
  [ResponseCode.VALIDATION_ERROR]: '数据验证失败',
  [ResponseCode.INTERNAL_ERROR]: '服务器内部错误',
  [ResponseCode.SERVICE_UNAVAILABLE]: '服务暂时不可用',
};

/**
 * 统一响应格式
 */
export interface ApiResponse<T = any> {
  code: ResponseCode;
  message: string;
  data: T;
  timestamp: number;
}

/**
 * 分页查询参数
 */
export interface PageQueryParams {
  page: number;
  pageSize: number;
  sortField?: string;
  sortOrder?: 'asc' | 'desc';
  keyword?: string;
  filters?: Record<string, any>;
}

/**
 * 分页数据
 */
export interface PageData<T = any> {
  list: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

/**
 * 分页响应格式
 */
export interface PageResponse<T = any> {
  code: ResponseCode;
  message: string;
  data: PageData<T>;
  timestamp: number;
}

/**
 * 错误响应格式
 */
export interface ErrorResponse {
  code: ResponseCode;
  message: string;
  errors?: ValidationError[];
  timestamp: number;
}

/**
 * 验证错误
 */
export interface ValidationError {
  field: string;
  message: string;
  value?: any;
}

/**
 * 批量操作响应格式
 */
export interface BatchOperationResponse {
  code: ResponseCode;
  message: string;
  data: {
    successCount: number;
    failureCount: number;
    successIds: number[];
    failureIds: number[];
    errors: Array<{
      id: number;
      error: string;
    }>;
  };
  timestamp: number;
}

/**
 * 导出响应格式
 */
export interface ExportResponse {
  code: ResponseCode;
  message: string;
  data: {
    fileUrl: string;
    fileName: string;
    fileSize: number;
    downloadUrl: string;
  };
  timestamp: number;
}

/**
 * 导入响应格式
 */
export interface ImportResponse {
  code: ResponseCode;
  message: string;
  data: {
    totalCount: number;
    successCount: number;
    failureCount: number;
    errors: Array<{
      row: number;
      field: string;
      message: string;
    }>;
  };
  timestamp: number;
}

/**
 * 上传响应格式
 */
export interface UploadResponse {
  code: ResponseCode;
  message: string;
  data: {
    fileId: string;
    fileName: string;
    filePath: string;
    fileSize: number;
    fileType: string;
    url: string;
  };
  timestamp: number;
}

/**
 * 删除响应格式
 */
export interface DeleteResponse {
  code: ResponseCode;
  message: string;
  data: {
    deletedCount: number;
    deletedIds: number[];
  };
  timestamp: number;
}

/**
 * 审批响应格式
 */
export interface ApprovalResponse {
  code: ResponseCode;
  message: string;
  data: {
    approvalId: string;
    businessId: number;
    businessType: string;
    nodeName: string;
    approvalResult: 'approved' | 'rejected';
    approvalComment: string;
    approvalTime: string;
  };
  timestamp: number;
}

/**
 * 统计数据响应格式
 */
export interface StatisticsResponse {
  code: ResponseCode;
  message: string;
  data: {
    total: number;
    today: number;
    week: number;
    month: number;
    year: number;
    trend: Array<{
      date: string;
      value: number;
    }>;
  };
  timestamp: number;
}

/**
 * 图表数据响应格式
 */
export interface ChartDataResponse {
  code: ResponseCode;
  message: string;
  data: {
    categories: string[];
    series: Array<{
      name: string;
      data: number[];
      color?: string;
    }>;
  };
  timestamp: number;
}

/**
 * 字典数据响应格式
 */
export interface DictionaryResponse {
  code: ResponseCode;
  message: string;
  data: Array<{
    dictLabel: string;
    dictValue: string;
    dictSort: number;
    cssClass?: string;
    listClass?: string;
    isDefault?: boolean;
  }>;
  timestamp: number;
}

/**
 * 菜单树响应格式
 */
export interface MenuTreeResponse {
  code: ResponseCode;
  message: string;
  data: Array<{
    id: number;
    parentId: number;
    menuName: string;
    menuCode: string;
    menuType: 'directory' | 'menu' | 'button';
    menuLevel: number;
    path?: string;
    component?: string;
    icon?: string;
    permissionCode?: string;
    sortOrder: number;
    visible: boolean;
    status: 'enabled' | 'disabled';
    children?: MenuTreeResponse['data'];
  }>;
  timestamp: number;
}

/**
 * 部门树响应格式
 */
export interface DepartmentTreeResponse {
  code: ResponseCode;
  message: string;
  data: Array<{
    id: number;
    parentId: number;
    deptName: string;
    deptCode: string;
    deptLevel: number;
    leaderId?: number;
    leaderName?: string;
    phone?: string;
    email?: string;
    address?: string;
    sortOrder: number;
    status: 'enabled' | 'disabled';
    children?: DepartmentTreeResponse['data'];
  }>;
  timestamp: number;
}

/**
 * 用户信息响应格式
 */
export interface UserInfoResponse {
  code: ResponseCode;
  message: string;
  data: {
    userId: number;
    username: string;
    realName: string;
    phone: string;
    email?: string;
    avatar?: string;
    userType: 'worker' | 'labor_company' | 'factory' | 'admin';
    tenantId?: number;
    tenantName?: string;
    departmentId?: number;
    departmentName?: string;
    positionId?: number;
    positionName?: string;
    roles: Array<{
      roleId: number;
      roleName: string;
      roleCode: string;
    }>;
    permissions: string[];
    dataPermission: 'ALL' | 'DEPARTMENT' | 'DEPARTMENT_AND_BELOW' | 'SELF' | 'CUSTOM';
  };
  timestamp: number;
}

/**
 * 登录响应格式
 */
export interface LoginResponse {
  code: ResponseCode;
  message: string;
  data: {
    token: string;
    tokenType: string;
    expiresIn: number;
    refreshToken?: string;
    userInfo: UserInfoResponse['data'];
  };
  timestamp: number;
}

/**
 * 刷新Token响应格式
 */
export interface RefreshTokenResponse {
  code: ResponseCode;
  message: string;
  data: {
    token: string;
    tokenType: string;
    expiresIn: number;
    refreshToken?: string;
  };
  timestamp: number;
}

/**
 * 操作日志响应格式
 */
export interface OperationLogResponse {
  code: ResponseCode;
  message: string;
  data: Array<{
    id: number;
    module: string;
    operation: string;
    method: string;
    requestUrl: string;
    requestParams?: string;
    responseResult?: string;
    ipAddress: string;
    userAgent?: string;
    userId: number;
    userName: string;
    tenantId?: number;
    executionTime?: number;
    status: 'success' | 'failure';
    errorMessage?: string;
    createdAt: string;
  }>;
  timestamp: number;
}

/**
 * 审批记录响应格式
 */
export interface ApprovalRecordResponse {
  code: ResponseCode;
  message: string;
  data: Array<{
    id: number;
    businessType: string;
    businessId: number;
    flowName: string;
    nodeName: string;
    nodeType: 'approval' | 'cc';
    approverId: number;
    approverName: string;
    approvalTime?: string;
    approvalResult: 'approved' | 'rejected' | 'pending';
    approvalComment?: string;
    createdAt: string;
  }>;
  timestamp: number;
}

/**
 * 附件列表响应格式
 */
export interface AttachmentListResponse {
  code: ResponseCode;
  message: string;
  data: Array<{
    id: number;
    fileName: string;
    filePath: string;
    fileSize: number;
    fileType: string;
    fileExtension: string;
    fileMd5?: string;
    businessType?: string;
    businessId?: number;
    uploadUserId?: number;
    uploadUserName?: string;
    createdAt: string;
  }>;
  timestamp: number;
}

/**
 * 附件详情响应格式
 */
export interface AttachmentDetailResponse {
  code: ResponseCode;
  message: string;
  data: {
    id: number;
    fileName: string;
    filePath: string;
    fileSize: number;
    fileType: string;
    fileExtension: string;
    fileMd5?: string;
    businessType?: string;
    businessId?: number;
    uploadUserId?: number;
    uploadUserName?: string;
    previewUrl?: string;
    downloadUrl?: string;
    createdAt: string;
  };
  timestamp: number;
}
