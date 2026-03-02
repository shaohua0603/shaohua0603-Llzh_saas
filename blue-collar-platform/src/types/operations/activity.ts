/**
 * 活动管理模块类型定义
 */

/**
 * 活动类型枚举
 */
export enum ActivityType {
  REWARD = 'reward',                 // 金额奖励活动
  TRAINING = 'training',             // 培训活动
  ENTERTAINMENT = 'entertainment',   // 文娱活动
  COMMUNITY = 'community',           // 社团活动
  OTHER = 'other',                   // 其他活动
}

/**
 * 活动类型文本映射
 */
export const ActivityTypeText: Record<ActivityType, string> = {
  [ActivityType.REWARD]: '金额奖励活动',
  [ActivityType.TRAINING]: '培训活动',
  [ActivityType.ENTERTAINMENT]: '文娱活动',
  [ActivityType.COMMUNITY]: '社团活动',
  [ActivityType.OTHER]: '其他活动',
};

/**
 * 活动类型标签类型映射
 */
export const ActivityTypeTagType: Record<ActivityType, string> = {
  [ActivityType.REWARD]: 'success',
  [ActivityType.TRAINING]: 'warning',
  [ActivityType.ENTERTAINMENT]: 'info',
  [ActivityType.COMMUNITY]: 'primary',
  [ActivityType.OTHER]: 'info',
};

/**
 * 活动状态枚举
 */
export enum ActivityStatus {
  DRAFT = 'draft',                   // 草稿
  NOT_STARTED = 'not_started',       // 未开始
  ONGOING = 'ongoing',               // 进行中
  ENDED = 'ended',                   // 已结束
  CANCELLED = 'cancelled',           // 已取消
}

/**
 * 活动状态文本映射
 */
export const ActivityStatusText: Record<ActivityStatus, string> = {
  [ActivityStatus.DRAFT]: '草稿',
  [ActivityStatus.NOT_STARTED]: '未开始',
  [ActivityStatus.ONGOING]: '进行中',
  [ActivityStatus.ENDED]: '已结束',
  [ActivityStatus.CANCELLED]: '已取消',
};

/**
 * 活动状态标签类型映射
 */
export const ActivityStatusTagType: Record<ActivityStatus, string> = {
  [ActivityStatus.DRAFT]: 'info',
  [ActivityStatus.NOT_STARTED]: 'info',
  [ActivityStatus.ONGOING]: 'success',
  [ActivityStatus.ENDED]: 'warning',
  [ActivityStatus.CANCELLED]: 'danger',
};

/**
 * 活动信息
 */
export interface ActivityInfo {
  id: number;
  title: string;                     // 活动标题
  type: ActivityType;                // 活动类型
  typeText: string;
  needAudit: boolean;                // 是否需要报名审核
  registerStartTime: string;         // 报名开始日期
  registerEndTime: string;           // 报名截止日期
  startTime: string;                 // 活动开始时间
  endTime: string;                   // 活动结束时间
  address?: string;                  // 活动地址
  summary?: string;                  // 活动简介
  content?: string;                  // 活动详情(富文本)
  coverImage?: string;               // 封面图片
  maxParticipants?: number;          // 最大参与人数
  currentParticipants?: number;       // 当前参与人数
  status: ActivityStatus;
  statusText: string;
  createdBy?: number;
  createdByName?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * 活动表单数据
 */
export interface ActivityFormData {
  id?: number;
  title: string;
  type: ActivityType;
  needAudit: boolean;
  registerStartTime: string;
  registerEndTime: string;
  startTime: string;
  endTime: string;
  address?: string;
  summary?: string;
  content?: string;
  coverImage?: string;
  maxParticipants?: number;
}

/**
 * 活动查询参数
 */
export interface ActivityQueryParams {
  page: number;
  pageSize: number;
  keyword?: string;                  // 关键词搜索(活动标题)
  type?: ActivityType;               // 活动类型
  status?: ActivityStatus;           // 活动状态
  startTime?: string;                // 开始时间
  endTime?: string;                  // 结束时间
  sortField?: string;
  sortOrder?: 'asc' | 'desc';
}

/**
 * 报名审核状态枚举
 */
export enum RegistrationAuditStatus {
  PENDING = 'pending',               // 待审核
  APPROVED = 'approved',             // 审核通过
  REJECTED = 'rejected',             // 审核不通过
}

/**
 * 报名审核状态文本映射
 */
export const RegistrationAuditStatusText: Record<RegistrationAuditStatus, string> = {
  [RegistrationAuditStatus.PENDING]: '待审核',
  [RegistrationAuditStatus.APPROVED]: '审核通过',
  [RegistrationAuditStatus.REJECTED]: '审核不通过',
};

/**
 * 报名审核状态标签类型映射
 */
export const RegistrationAuditStatusTagType: Record<RegistrationAuditStatus, string> = {
  [RegistrationAuditStatus.PENDING]: 'warning',
  [RegistrationAuditStatus.APPROVED]: 'success',
  [RegistrationAuditStatus.REJECTED]: 'danger',
};

/**
 * 报名信息
 */
export interface RegistrationInfo {
  id: number;
  activityId: number;
  activityTitle: string;             // 活动/社团标题
  activityType: ActivityType;        // 活动类型
  workerId: number;
  workerName: string;                // 姓名
  workerPhone: string;              // 手机号
  auditStatus: RegistrationAuditStatus;
  auditStatusText: string;
  auditComment?: string;             // 审核意见
  auditTime?: string;               // 审核时间
  submitTime: string;               // 提交报名时间
  createdBy?: number;
  createdByName?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * 报名信息查询参数
 */
export interface RegistrationQueryParams {
  page: number;
  pageSize: number;
  keyword?: string;                  // 关键词搜索(姓名、手机号)
  activityId?: number;              // 活动ID
  auditStatus?: RegistrationAuditStatus; // 审核状态
  startTime?: string;                // 开始时间
  endTime?: string;                  // 结束时间
  sortField?: string;
  sortOrder?: 'asc' | 'desc';
}

/**
 * 审核操作参数
 */
export interface AuditParams {
  ids: number[];                     // 报名记录ID列表
  auditStatus: RegistrationAuditStatus;
  auditComment?: string;             // 审核意见
}
