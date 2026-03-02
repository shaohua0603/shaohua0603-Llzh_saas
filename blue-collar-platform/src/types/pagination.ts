/**
 * 分页查询类型定义
 */

import type { PageQueryParams, PageData, PageResponse } from './response';

/**
 * 分页查询参数
 */
export interface PaginationParams extends PageQueryParams {
  page: number;
  pageSize: number;
  sortField?: string;
  sortOrder?: 'asc' | 'desc';
  keyword?: string;
  filters?: Record<string, any>;
}

/**
 * 分页结果
 */
export interface PaginationResult<T = any> extends PageData<T> {
  list: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

/**
 * 分页配置
 */
export interface PaginationConfig {
  defaultPageSize: number;
  pageSizeOptions: number[];
  showSizeChanger: boolean;
  showQuickJumper: boolean;
  showTotal: boolean;
  pageSize: number;
  current: number;
}

/**
 * 分页查询选项
 */
export interface PaginationQueryOptions {
  url: string;
  params?: Partial<PaginationParams>;
  immediate?: boolean;
  onSuccess?: (data: PaginationResult) => void;
  onError?: (error: any) => void;
}

/**
 * 分页操作
 */
export interface PaginationActions {
  loadData: () => Promise<void>;
  handlePageChange: (page: number) => void;
  handlePageSizeChange: (pageSize: number) => void;
  handleSortChange: (sortField: string, sortOrder: 'asc' | 'desc') => void;
  handleSearch: (keyword: string) => void;
  handleFilter: (filters: Record<string, any>) => void;
  reset: () => void;
  refresh: () => void;
}

/**
 * 分页状态
 */
export interface PaginationState {
  loading: boolean;
  data: PaginationResult | null;
  error: any | null;
  params: PaginationParams;
}

/**
 * 分页返回值
 */
export interface PaginationReturn extends PaginationActions, PaginationState {}
