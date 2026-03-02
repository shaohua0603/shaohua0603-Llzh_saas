/**
 * 榜单管理模块类型定义
 */

/**
 * 在岗时长排名
 */
export interface OnDutyHoursRanking {
  rank: number;                      // 排名
  laborCompanyId: number;
  laborCompanyName: string;          // 劳务公司名称
  totalHours: number;                // 在岗时长总和(小时)
  workerCount: number;               // 工人数量
  avgHours: number;                  // 平均在岗时长(小时)
}

/**
 * 离职率排名
 */
export interface TurnoverRateRanking {
  rank: number;                      // 排名
  laborCompanyId: number;
  laborCompanyName: string;          // 劳务公司名称
  turnoverRate: number;              // 离职率(%)
  totalWorkers: number;              // 总工人数
  resignedWorkers: number;          // 离职人数
}

/**
 * 惩罚率排名
 */
export interface PunishmentRateRanking {
  rank: number;                      // 排名
  laborCompanyId: number;
  laborCompanyName: string;          // 劳务公司名称
  punishmentCount: number;           // 惩罚次数
  totalWorkers: number;              // 总工人数
  punishmentRate: number;            // 惩罚率(%)
}

/**
 * 开除率排名
 */
export interface DismissalRateRanking {
  rank: number;                      // 排名
  laborCompanyId: number;
  laborCompanyName: string;          // 劳务公司名称
  dismissalRate: number;             // 开除率(%)
  totalWorkers: number;              // 总工人数
  dismissedWorkers: number;          // 开除人数
}

/**
 * 调岗率排名
 */
export interface TransferRateRanking {
  rank: number;                      // 排名
  laborCompanyId: number;
  laborCompanyName: string;          // 劳务公司名称
  transferRate: number;              // 调岗率(%)
  totalWorkers: number;              // 总工人数
  transferredWorkers: number;        // 调岗人数
}

/**
 * 投诉率排名
 */
export interface ComplaintRateRanking {
  rank: number;                      // 排名
  laborCompanyId: number;
  laborCompanyName: string;          // 劳务公司名称
  complaintRate: number;             // 投诉率(%)
  totalWorkers: number;              // 总工人数
  complaintCount: number;            // 投诉次数
}

/**
 * 请假率排名
 */
export interface LeaveRateRanking {
  rank: number;                      // 排名
  laborCompanyId: number;
  laborCompanyName: string;          // 劳务公司名称
  leaveRate: number;                 // 请假率(%)
  totalWorkers: number;              // 总工人数
  leaveCount: number;               // 请假次数
}

/**
 * 加班时长排名
 */
export interface OvertimeHoursRanking {
  rank: number;                      // 排名
  laborCompanyId: number;
  laborCompanyName: string;          // 劳务公司名称
  totalOvertimeHours: number;       // 加班时长总和(小时)
  workerCount: number;               // 工人数量
  avgOvertimeHours: number;         // 平均加班时长(小时)
}

/**
 * 榜单查询参数
 */
export interface RankingQueryParams {
  page?: number;
  pageSize?: number;
  startTime?: string;                // 统计开始时间
  endTime?: string;                  // 统计结束时间
  sortField?: string;
  sortOrder?: 'asc' | 'desc';
}

/**
 * 榜单类型枚举
 */
export enum RankingType {
  ON_DUTY_HOURS = 'on_duty_hours',         // 在岗时长
  TURNOVER_RATE = 'turnover_rate',         // 离职率
  PUNISHMENT_RATE = 'punishment_rate',     // 惩罚率
  DISMISSAL_RATE = 'dismissal_rate',       // 开除率
  TRANSFER_RATE = 'transfer_rate',         // 调岗率
  COMPLAINT_RATE = 'complaint_rate',       // 投诉率
  LEAVE_RATE = 'leave_rate',               // 请假率
  OVERTIME_HOURS = 'overtime_hours',       // 加班时长
}

/**
 * 榜单类型文本映射
 */
export const RankingTypeText: Record<RankingType, string> = {
  [RankingType.ON_DUTY_HOURS]: '在岗时长排名',
  [RankingType.TURNOVER_RATE]: '离职率排名',
  [RankingType.PUNISHMENT_RATE]: '惩罚率排名',
  [RankingType.DISMISSAL_RATE]: '开除率排名',
  [RankingType.TRANSFER_RATE]: '调岗率排名',
  [RankingType.COMPLAINT_RATE]: '投诉率排名',
  [RankingType.LEAVE_RATE]: '请假率排名',
  [RankingType.OVERTIME_HOURS]: '加班时长排名',
};
