/**
 * 分页查询工具类
 * 用于后端分页查询的封装
 */

import type { PaginationParams, PaginationResult } from '../types/pagination';
import type { PageResponse } from '../types/response';

/**
 * 分页查询工具类
 */
export class PaginationUtil {
  /**
   * 构建分页查询参数
   * @param params 分页参数
   * @returns 分页查询参数
   */
  static buildQueryParams(params: PaginationParams): Record<string, any> {
    const queryParams: Record<string, any> = {
      page: params.page || 1,
      pageSize: params.pageSize || 10,
    };

    if (params.sortField) {
      queryParams.sortField = params.sortField;
    }

    if (params.sortOrder) {
      queryParams.sortOrder = params.sortOrder;
    }

    if (params.keyword) {
      queryParams.keyword = params.keyword;
    }

    if (params.filters && Object.keys(params.filters).length > 0) {
      Object.assign(queryParams, params.filters);
    }

    return queryParams;
  }

  /**
   * 构建排序SQL
   * @param sortField 排序字段
   * @param sortOrder 排序方向
   * @returns 排序SQL
   */
  static buildOrderBy(sortField?: string, sortOrder?: 'asc' | 'desc'): string {
    if (!sortField) {
      return '';
    }

    const order = sortOrder === 'asc' ? 'ASC' : 'DESC';
    return `ORDER BY ${sortField} ${order}`;
  }

  /**
   * 构建分页SQL
   * @param page 页码
   * @param pageSize 每页条数
   * @returns 分页SQL
   */
  static buildLimit(page: number, pageSize: number): string {
    const offset = (page - 1) * pageSize;
    return `LIMIT ${offset}, ${pageSize}`;
  }

  /**
   * 计算总页数
   * @param total 总记录数
   * @param pageSize 每页条数
   * @returns 总页数
   */
  static calculateTotalPages(total: number, pageSize: number): number {
    return Math.ceil(total / pageSize);
  }

  /**
   * 计算偏移量
   * @param page 页码
   * @param pageSize 每页条数
   * @returns 偏移量
   */
  static calculateOffset(page: number, pageSize: number): number {
    return (page - 1) * pageSize;
  }

  /**
   * 构建分页结果
   * @param list 数据列表
   * @param total 总记录数
   * @param page 当前页
   * @param pageSize 每页条数
   * @returns 分页结果
   */
  static buildResult<T = any>(
    list: T[],
    total: number,
    page: number,
    pageSize: number
  ): PaginationResult<T> {
    const totalPages = this.calculateTotalPages(total, pageSize);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    return {
      list,
      total,
      page,
      pageSize,
      totalPages,
      hasNextPage,
      hasPrevPage,
    };
  }

  /**
   * 构建分页响应
   * @param list 数据列表
   * @param total 总记录数
   * @param page 当前页
   * @param pageSize 每页条数
   * @param message 提示信息
   * @returns 分页响应
   */
  static buildResponse<T = any>(
    list: T[],
    total: number,
    page: number,
    pageSize: number,
    message: string = '查询成功'
  ): PageResponse<T> {
    const totalPages = this.calculateTotalPages(total, pageSize);

    return {
      code: 200,
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
   * 验证分页参数
   * @param params 分页参数
   * @returns 验证结果
   */
  static validateParams(params: PaginationParams): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!params.page || params.page < 1) {
      errors.push('页码必须大于0');
    }

    if (!params.pageSize || params.pageSize < 1) {
      errors.push('每页条数必须大于0');
    }

    if (params.pageSize && params.pageSize > 1000) {
      errors.push('每页条数不能超过1000');
    }

    if (params.sortOrder && !['asc', 'desc'].includes(params.sortOrder)) {
      errors.push('排序方向必须是asc或desc');
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * 默认分页参数
   */
  static getDefaultParams(): PaginationParams {
    return {
      page: 1,
      pageSize: 10,
      sortOrder: 'desc',
    };
  }

  /**
   * 合并分页参数
   * @param params1 参数1
   * @param params2 参数2
   * @returns 合并后的参数
   */
  static mergeParams(params1: PaginationParams, params2: Partial<PaginationParams>): PaginationParams {
    return {
      ...params1,
      ...params2,
      filters: {
        ...params1.filters,
        ...params2.filters,
      },
    };
  }

  /**
   * 重置分页参数
   * @param params 分页参数
   * @returns 重置后的参数
   */
  static resetParams(params: PaginationParams): PaginationParams {
    return {
      page: 1,
      pageSize: params.pageSize || 10,
      sortField: undefined,
      sortOrder: undefined,
      keyword: undefined,
      filters: undefined,
    };
  }

  /**
   * 构建搜索条件（SQL）
   * @param keyword 关键词
   * @param fields 搜索字段列表
   * @returns 搜索条件SQL
   */
  static buildSearchCondition(keyword: string, fields: string[]): string {
    if (!keyword || !fields || fields.length === 0) {
      return '';
    }

    const conditions = fields.map(field => `${field} LIKE '%${keyword}%'`);
    return `(${conditions.join(' OR ')})`;
  }

  /**
   * 构建筛选条件（SQL）
   * @param filters 筛选条件
   * @returns 筛选条件SQL
   */
  static buildFilterCondition(filters: Record<string, any>): string {
    if (!filters || Object.keys(filters).length === 0) {
      return '';
    }

    const conditions: string[] = [];

    for (const [key, value] of Object.entries(filters)) {
      if (value === undefined || value === null || value === '') {
        continue;
      }

      if (Array.isArray(value)) {
        if (value.length > 0) {
          conditions.push(`${key} IN ('${value.join("','")}')`);
        }
      } else if (typeof value === 'string') {
        conditions.push(`${key} = '${value}'`);
      } else if (typeof value === 'number' || typeof value === 'boolean') {
        conditions.push(`${key} = ${value}`);
      }
    }

    return conditions.join(' AND ');
  }

  /**
   * 构建完整的WHERE条件（SQL）
   * @param keyword 关键词
   * @param searchFields 搜索字段列表
   * @param filters 筛选条件
   * @returns WHERE条件SQL
   */
  static buildWhereCondition(
    keyword?: string,
    searchFields?: string[],
    filters?: Record<string, any>
  ): string {
    const conditions: string[] = [];

    // 搜索条件
    if (keyword && searchFields && searchFields.length > 0) {
      const searchCondition = this.buildSearchCondition(keyword, searchFields);
      if (searchCondition) {
        conditions.push(searchCondition);
      }
    }

    // 筛选条件
    if (filters && Object.keys(filters).length > 0) {
      const filterCondition = this.buildFilterCondition(filters);
      if (filterCondition) {
        conditions.push(filterCondition);
      }
    }

    return conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
  }

  /**
   * 构建完整的查询SQL
   * @param tableName 表名
   * @param selectFields 查询字段
   * @param keyword 关键词
   * @param searchFields 搜索字段列表
   * @param filters 筛选条件
   * @param sortField 排序字段
   * @param sortOrder 排序方向
   * @param page 页码
   * @param pageSize 每页条数
   * @returns 查询SQL
   */
  static buildQuerySql(
    tableName: string,
    selectFields: string = '*',
    keyword?: string,
    searchFields?: string[],
    filters?: Record<string, any>,
    sortField?: string,
    sortOrder?: 'asc' | 'desc',
    page?: number,
    pageSize?: number
  ): string {
    const whereCondition = this.buildWhereCondition(keyword, searchFields, filters);
    const orderBy = this.buildOrderBy(sortField, sortOrder);
    const limit = page && pageSize ? this.buildLimit(page, pageSize) : '';

    return `
      SELECT ${selectFields}
      FROM ${tableName}
      ${whereCondition}
      ${orderBy}
      ${limit}
    `.trim();
  }

  /**
   * 构建总数查询SQL
   * @param tableName 表名
   * @param keyword 关键词
   * @param searchFields 搜索字段列表
   * @param filters 筛选条件
   * @returns 总数查询SQL
   */
  static buildCountSql(
    tableName: string,
    keyword?: string,
    searchFields?: string[],
    filters?: Record<string, any>
  ): string {
    const whereCondition = this.buildWhereCondition(keyword, searchFields, filters);

    return `
      SELECT COUNT(*) as total
      FROM ${tableName}
      ${whereCondition}
    `.trim();
  }

  /**
   * 格式化分页数据
   * @param data 原始数据
   * @param formatter 格式化函数
   * @returns 格式化后的数据
   */
  static formatData<T = any, R = any>(
    data: T[],
    formatter: (item: T) => R
  ): R[] {
    return data.map(formatter);
  }

  /**
   * 分页数据转换
   * @param data 原始数据
   * @param transform 转换函数
   * @returns 转换后的数据
   */
  static transformData<T = any, R = any>(
    data: T[],
    transform: (item: T) => R
  ): R[] {
    return data.map(transform);
  }
}
