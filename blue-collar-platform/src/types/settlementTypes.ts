/**
 * 结算管理类型定义
 */

/**
 * 工作转介绍记录
 */
export interface JobReferral {
  id: string;
  referredName: string; // 被介绍人姓名
  referredPhone: string; // 被介绍人手机号
  introduceDate: string; // 介绍日期
  entryDate?: string; // 进厂日期
  introducerName: string; // 介绍人姓名
  introducerPhone: string; // 介绍人手机号
  commissionPaid: number; // 已发佣金
  status: 'pending' | 'employed' | 'left'; // 状态：待进厂、已进厂、已离职
  statusText: string; // 状态文本
  tenantId?: string; // 租户ID
  tenantName?: string; // 租户名称
  createdAt: string; // 创建时间
  updatedAt: string; // 更新时间
}

/**
 * 佣金发放记录
 */
export interface CommissionPayment {
  id: string;
  referredName: string; // 被介绍人姓名
  referredPhone: string; // 被介绍人手机号
  introduceDate: string; // 介绍日期
  entryDate: string; // 进厂日期
  introducerName: string; // 介绍人姓名
  introducerPhone: string; // 介绍人手机号
  commissionAmount: number; // 发放佣金
  status: 'pending' | 'paid'; // 状态：待发放、已发放
  statusText: string; // 状态文本
  payTime?: string; // 发放时间
  tenantId?: string; // 租户ID
  tenantName?: string; // 租户名称
  createdAt: string; // 创建时间
  updatedAt: string; // 更新时间
}

/**
 * 拉新奖励记录
 */
export interface ReferralReward {
  id: string;
  referredName: string; // 被介绍人姓名
  referredPhone: string; // 被介绍人手机号
  introduceDate: string; // 介绍日期
  entryDate: string; // 进厂日期
  introducerName: string; // 介绍人姓名
  introducerPhone: string; // 介绍人手机号
  rewardAmount: number; // 奖励金额
  status: 'pending' | 'paid'; // 状态：待发放、已发放
  statusText: string; // 状态文本
  payTime?: string; // 发放时间
  tenantId?: string; // 租户ID
  tenantName?: string; // 租户名称
  createdAt: string; // 创建时间
  updatedAt: string; // 更新时间
}

/**
 * 佣金规则配置
 */
export interface CommissionRule {
  id: string;
  daysRequired: number; // 发放要求：进厂天数
  daily: DailyCommissionRule; // 日结方式
  monthly: MonthlyCommissionRule; // 月结方式
  tenantId?: string; // 租户ID
  createdAt: string; // 创建时间
  updatedAt: string; // 更新时间
}

/**
 * 日结佣金规则
 */
export interface DailyCommissionRule {
  firstAmount: number; // 第一次发放金额
  secondAmount: number; // 第二次发放金额
  thirdAmount: number; // 第三次发放金额
  subsequentAmount: number; // 后续每次发放
}

/**
 * 月结佣金规则
 */
export interface MonthlyCommissionRule {
  firstAmount: number; // 第一次发放金额
  secondAmount: number; // 第二次发放金额
  thirdAmount: number; // 第三次发放金额
  subsequentAmount: number; // 后续每次发放
}

/**
 * 工作转介绍查询参数
 */
export interface JobReferralQueryParams {
  page: number;
  pageSize: number;
  sortField?: string;
  sortOrder?: 'asc' | 'desc';
  keyword?: string; // 关键词搜索（被介绍人/介绍人）
  status?: string; // 状态筛选
  startDate?: string; // 开始日期
  endDate?: string; // 结束日期
}

/**
 * 佣金发放查询参数
 */
export interface CommissionPaymentQueryParams {
  page: number;
  pageSize: number;
  sortField?: string;
  sortOrder?: 'asc' | 'desc';
  keyword?: string; // 关键词搜索（被介绍人/介绍人）
  status?: string; // 状态筛选
  startDate?: string; // 开始日期
  endDate?: string; // 结束日期
}

/**
 * 拉新奖励查询参数
 */
export interface ReferralRewardQueryParams {
  page: number;
  pageSize: number;
  sortField?: string;
  sortOrder?: 'asc' | 'desc';
  keyword?: string; // 关键词搜索（被介绍人/介绍人）
  status?: string; // 状态筛选
  startDate?: string; // 开始日期
  endDate?: string; // 结束日期
}

/**
 * 佣金发放表单数据
 */
export interface CommissionPaymentFormData {
  ids: string[]; // 发放记录ID数组
  remark?: string; // 备注
}

/**
 * 拉新奖励发放表单数据
 */
export interface ReferralRewardFormData {
  ids: string[]; // 奖励记录ID数组
  remark?: string; // 备注
}

/**
 * 佣金规则配置表单数据
 */
export interface CommissionRuleFormData {
  daysRequired: number;
  daily: DailyCommissionRule;
  monthly: MonthlyCommissionRule;
}
