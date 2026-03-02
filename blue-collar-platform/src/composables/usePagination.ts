/**
 * 分页查询 Composable
 * 用于在Vue组件中处理分页查询逻辑
 */

import { ref, reactive, computed, onMounted, watch } from 'vue';
import type { Ref } from 'vue';
import request from '../utils/request';
import type {
  PaginationParams,
  PaginationResult,
  PaginationConfig,
  PaginationQueryOptions,
  PaginationActions,
  PaginationState,
  PaginationReturn,
} from '../types/pagination';
import type { PageResponse } from '../types/response';

/**
 * 默认分页配置
 */
const DEFAULT_PAGINATION_CONFIG: PaginationConfig = {
  defaultPageSize: 10,
  pageSizeOptions: [10, 20, 50, 100],
  showSizeChanger: true,
  showQuickJumper: true,
  showTotal: true,
  pageSize: 10,
  current: 1,
};

/**
 * 分页查询 Composable
 * @param options 分页查询选项
 * @returns 分页查询返回值
 */
export function usePagination<T = any>(options: PaginationQueryOptions): PaginationReturn {
  const {
    url,
    params: initialParams = {},
    immediate = true,
    onSuccess,
    onError,
  } = options;

  // 分页配置
  const config = reactive<PaginationConfig>({
    ...DEFAULT_PAGINATION_CONFIG,
    pageSize: initialParams.pageSize || DEFAULT_PAGINATION_CONFIG.defaultPageSize,
    current: initialParams.page || DEFAULT_PAGINATION_CONFIG.current,
  });

  // 分页参数
  const params = reactive<PaginationParams>({
    page: config.current,
    pageSize: config.pageSize,
    sortField: initialParams.sortField,
    sortOrder: initialParams.sortOrder,
    keyword: initialParams.keyword,
    filters: initialParams.filters,
  });

  // 加载状态
  const loading = ref(false);

  // 数据
  const data = ref<PaginationResult<T> | null>(null);

  // 错误
  const error = ref<any>(null);

  /**
   * 计算总页数
   */
  const totalPages = computed(() => {
    if (!data.value) return 0;
    return Math.ceil(data.value.total / data.value.pageSize);
  });

  /**
   * 是否有下一页
   */
  const hasNextPage = computed(() => {
    if (!data.value) return false;
    return data.value.page < totalPages.value;
  });

  /**
   * 是否有上一页
   */
  const hasPrevPage = computed(() => {
    if (!data.value) return false;
    return data.value.page > 1;
  });

  /**
   * 加载数据
   */
  const loadData = async () => {
    loading.value = true;
    error.value = null;

    try {
      const response: PageResponse<T> = await request.get(url, { params });
      
      const result: PaginationResult<T> = {
        ...response.data,
        hasNextPage: hasNextPage.value,
        hasPrevPage: hasPrevPage.value,
      };

      data.value = result;
      
      if (onSuccess) {
        onSuccess(result);
      }
    } catch (err) {
      error.value = err;
      
      if (onError) {
        onError(err);
      }
    } finally {
      loading.value = false;
    }
  };

  /**
   * 处理页码变化
   */
  const handlePageChange = (page: number) => {
    config.current = page;
    params.page = page;
    loadData();
  };

  /**
   * 处理每页条数变化
   */
  const handlePageSizeChange = (pageSize: number) => {
    config.pageSize = pageSize;
    params.pageSize = pageSize;
    params.page = 1; // 重置到第一页
    config.current = 1;
    loadData();
  };

  /**
   * 处理排序变化
   */
  const handleSortChange = (sortField: string, sortOrder: 'asc' | 'desc') => {
    params.sortField = sortField;
    params.sortOrder = sortOrder;
    loadData();
  };

  /**
   * 处理搜索
   */
  const handleSearch = (keyword: string) => {
    params.keyword = keyword;
    params.page = 1; // 重置到第一页
    config.current = 1;
    loadData();
  };

  /**
   * 处理筛选
   */
  const handleFilter = (filters: Record<string, any>) => {
    params.filters = filters;
    params.page = 1; // 重置到第一页
    config.current = 1;
    loadData();
  };

  /**
   * 重置分页
   */
  const reset = () => {
    config.current = 1;
    config.pageSize = DEFAULT_PAGINATION_CONFIG.defaultPageSize;
    params.page = 1;
    params.pageSize = DEFAULT_PAGINATION_CONFIG.defaultPageSize;
    params.sortField = undefined;
    params.sortOrder = undefined;
    params.keyword = undefined;
    params.filters = undefined;
    loadData();
  };

  /**
   * 刷新数据
   */
  const refresh = () => {
    loadData();
  };

  // 监听参数变化
  watch(
    () => initialParams,
    (newParams) => {
      if (newParams) {
        Object.assign(params, newParams);
        if (newParams.page) {
          config.current = newParams.page;
        }
        if (newParams.pageSize) {
          config.pageSize = newParams.pageSize;
        }
      }
    },
    { deep: true }
  );

  // 立即加载数据
  if (immediate) {
    onMounted(() => {
      loadData();
    });
  }

  return {
    loading,
    data,
    error,
    params,
    loadData,
    handlePageChange,
    handlePageSizeChange,
    handleSortChange,
    handleSearch,
    handleFilter,
    reset,
    refresh,
  };
}

/**
 * 分页查询 Composable（使用Ref参数）
 * @param url API URL
 * @param params 分页参数（Ref）
 * @param immediate 是否立即加载
 * @returns 分页查询返回值
 */
export function usePaginationRef<T = any>(
  url: string,
  params: Ref<PaginationParams>,
  immediate = true
): PaginationReturn {
  // 加载状态
  const loading = ref(false);

  // 数据
  const data = ref<PaginationResult<T> | null>(null);

  // 错误
  const error = ref<any>(null);

  /**
   * 计算总页数
   */
  const totalPages = computed(() => {
    if (!data.value) return 0;
    return Math.ceil(data.value.total / data.value.pageSize);
  });

  /**
   * 是否有下一页
   */
  const hasNextPage = computed(() => {
    if (!data.value) return false;
    return data.value.page < totalPages.value;
  });

  /**
   * 是否有上一页
   */
  const hasPrevPage = computed(() => {
    if (!data.value) return false;
    return data.value.page > 1;
  });

  /**
   * 加载数据
   */
  const loadData = async () => {
    loading.value = true;
    error.value = null;

    try {
      const response: PageResponse<T> = await request.get(url, { params: params.value });
      
      const result: PaginationResult<T> = {
        ...response.data,
        hasNextPage: hasNextPage.value,
        hasPrevPage: hasPrevPage.value,
      };

      data.value = result;
    } catch (err) {
      error.value = err;
    } finally {
      loading.value = false;
    }
  };

  /**
   * 处理页码变化
   */
  const handlePageChange = (page: number) => {
    params.value.page = page;
    loadData();
  };

  /**
   * 处理每页条数变化
   */
  const handlePageSizeChange = (pageSize: number) => {
    params.value.pageSize = pageSize;
    params.value.page = 1; // 重置到第一页
    loadData();
  };

  /**
   * 处理排序变化
   */
  const handleSortChange = (sortField: string, sortOrder: 'asc' | 'desc') => {
    params.value.sortField = sortField;
    params.value.sortOrder = sortOrder;
    loadData();
  };

  /**
   * 处理搜索
   */
  const handleSearch = (keyword: string) => {
    params.value.keyword = keyword;
    params.value.page = 1; // 重置到第一页
    loadData();
  };

  /**
   * 处理筛选
   */
  const handleFilter = (filters: Record<string, any>) => {
    params.value.filters = filters;
    params.value.page = 1; // 重置到第一页
    loadData();
  };

  /**
   * 重置分页
   */
  const reset = () => {
    params.value.page = 1;
    params.value.pageSize = 10;
    params.value.sortField = undefined;
    params.value.sortOrder = undefined;
    params.value.keyword = undefined;
    params.value.filters = undefined;
    loadData();
  };

  /**
   * 刷新数据
   */
  const refresh = () => {
    loadData();
  };

  // 监听参数变化
  watch(
    params,
    () => {
      if (!immediate) {
        loadData();
      }
    },
    { deep: true }
  );

  // 立即加载数据
  if (immediate) {
    onMounted(() => {
      loadData();
    });
  }

  return {
    loading,
    data,
    error,
    params: params.value,
    loadData,
    handlePageChange,
    handlePageSizeChange,
    handleSortChange,
    handleSearch,
    handleFilter,
    reset,
    refresh,
  };
}

export default usePagination;
