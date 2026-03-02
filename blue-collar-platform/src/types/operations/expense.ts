/**
 * 费用查询模块类型定义
 */

/**
 * 费用记录状态枚举
 */
export enum ExpenseStatus {
  UNPAID = 'unpaid',           // 未支付
  PAID = 'paid',               // 已支付
  OVERDUE = 'overdue',         // 已逾期
  REFUNDING = 'refunding',     // 退款中
  REFUNDED = 'refunded',       // 已退款
}

/**
 * 费用记录状态文本映射
 */
export const ExpenseStatusText: Record<ExpenseStatus, string> = {
  [ExpenseStatus.UNPAID]: '未支付',
  [ExpenseStatus.PAID]: '已支付',
  [ExpenseStatus.OVERDUE]: '已逾期',
  [ExpenseStatus.REFUNDING]: '退款中',
  [ExpenseStatus.REFUNDED]: '已退款',
};

/**
 * 费用记录状态标签类型映射
 */
export const ExpenseStatusTagType: Record<ExpenseStatus, string> = {
  [ExpenseStatus.UNPAID]: 'info',
  [ExpenseStatus.PAID]: 'success',
  [ExpenseStatus.OVERDUE]: 'danger',
  [ExpenseStatus.REFUNDING]: 'warning',
  [ExpenseStatus.REFUNDED]: 'info',
};

/**
 * 费用记录
 */
export interface ExpenseRecord {
  id: number;
  tenantId: number;
  tenantName: string;
  packageId: number;
  packageName: string;
  packageCode: string;
  amount: number;                    // 应结金额
  actualAmount: number;              // 实际金额
  discount: number;                  // 折扣比例(0-100)
  discountAmount: number;            // 折扣金额
  status: ExpenseStatus;
  statusText: string;
  payTime?: string;                  // 支付时间
  settleTime?: string;               // 结算时间
  remark?: string;                   // 备注
  createdBy?: number;
  createdByName?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * 费用查询参数
 */
export interface ExpenseQueryParams {
  page: number;
  pageSize: number;
  keyword?: string;                  // 关键词搜索(租户名称、套餐名称)
  tenantId?: number;                // 租户ID
  packageId?: number;               // 套餐ID
  status?: ExpenseStatus;            // 状态
  startTime?: string;                // 开始时间
  endTime?: string;                  // 结束时间
  sortField?: string;
  sortOrder?: 'asc' | 'desc';
}

/**
 * 费用导入数据
 */
export interface ExpenseImportData {
  tenantName: string;                // 租户名称
  packageName: string;               // 套餐名称
  amount: number;                    // 应结金额
  actualAmount: number;              // 实际金额
  settleTime: string;                // 结算时间
  remark?: string;                   // 备注
}

/**
 * 费用导入结果
 */
export interface ExpenseImportResult {
  totalCount: number;
  successCount: number;
  failureCount: number;
  errors: Array<{
    row: number;
    field: string;
    message: string;
  }>;
}
