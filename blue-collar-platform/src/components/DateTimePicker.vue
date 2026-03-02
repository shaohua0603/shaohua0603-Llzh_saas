<template>
  <div class="date-time-picker-container">
    <!-- 年份选择器 -->
    <el-date-picker
      v-if="type === 'year'"
      ref="pickerRef"
      v-model="internalValue"
      type="year"
      :placeholder="placeholder || '选择年份'"
      :disabled="disabled"
      :clearable="clearable"
      :size="size"
      :format="yearFormat"
      :value-format="yearValueFormat"
      :disabled-date="disabledDate"
      :start-placeholder="startPlaceholder"
      :end-placeholder="endPlaceholder"
      @change="handleChange"
      @blur="handleBlur"
      @focus="handleFocus"
    />

    <!-- 月份选择器 -->
    <el-date-picker
      v-else-if="type === 'month'"
      ref="pickerRef"
      v-model="internalValue"
      type="month"
      :placeholder="placeholder || '选择月份'"
      :disabled="disabled"
      :clearable="clearable"
      :size="size"
      :format="monthFormat"
      :value-format="monthValueFormat"
      :disabled-date="disabledDate"
      :start-placeholder="startPlaceholder"
      :end-placeholder="endPlaceholder"
      @change="handleChange"
      @blur="handleBlur"
      @focus="handleFocus"
    />

    <!-- 日期选择器 -->
    <el-date-picker
      v-else-if="type === 'date'"
      ref="pickerRef"
      v-model="internalValue"
      type="date"
      :placeholder="placeholder || '选择日期'"
      :disabled="disabled"
      :clearable="clearable"
      :size="size"
      :format="dateFormat"
      :value-format="dateValueFormat"
      :disabled-date="disabledDate"
      :start-placeholder="startPlaceholder"
      :end-placeholder="endPlaceholder"
      @change="handleChange"
      @blur="handleBlur"
      @focus="handleFocus"
    />

    <!-- 日期时间选择器 -->
    <el-date-picker
      v-else-if="type === 'datetime'"
      ref="pickerRef"
      v-model="internalValue"
      type="datetime"
      :placeholder="placeholder || '选择日期时间'"
      :disabled="disabled"
      :clearable="clearable"
      :size="size"
      :format="datetimeFormat"
      :value-format="datetimeValueFormat"
      :disabled-date="disabledDate"
      :disabled-hours="disabledHours"
      :disabled-minutes="disabledMinutes"
      :disabled-seconds="disabledSeconds"
      :start-placeholder="startPlaceholder"
      :end-placeholder="endPlaceholder"
      @change="handleChange"
      @blur="handleBlur"
      @focus="handleFocus"
    />

    <!-- 时间选择器 -->
    <el-time-picker
      v-else-if="type === 'time'"
      ref="pickerRef"
      v-model="internalValue"
      :placeholder="placeholder || '选择时间'"
      :disabled="disabled"
      :clearable="clearable"
      :size="size"
      :format="timeFormat"
      :value-format="timeValueFormat"
      :disabled-hours="disabledHours"
      :disabled-minutes="disabledMinutes"
      :disabled-seconds="disabledSeconds"
      @change="handleChange"
      @blur="handleBlur"
      @focus="handleFocus"
    />

    <!-- 日期范围选择器 -->
    <el-date-picker
      v-else-if="type === 'daterange'"
      ref="pickerRef"
      v-model="internalValue"
      type="daterange"
      range-separator="至"
      :start-placeholder="startPlaceholder || '开始日期'"
      :end-placeholder="endPlaceholder || '结束日期'"
      :disabled="disabled"
      :clearable="clearable"
      :size="size"
      :format="dateFormat"
      :value-format="dateValueFormat"
      :disabled-date="disabledDate"
      @change="handleChange"
      @blur="handleBlur"
      @focus="handleFocus"
    />

    <!-- 月份范围选择器 -->
    <el-date-picker
      v-else-if="type === 'monthrange'"
      ref="pickerRef"
      v-model="internalValue"
      type="monthrange"
      range-separator="至"
      :start-placeholder="startPlaceholder || '开始月份'"
      :end-placeholder="endPlaceholder || '结束月份'"
      :disabled="disabled"
      :clearable="clearable"
      :size="size"
      :format="monthFormat"
      :value-format="monthValueFormat"
      :disabled-date="disabledDate"
      @change="handleChange"
      @blur="handleBlur"
      @focus="handleFocus"
    />

    <!-- 日期时间范围选择器 -->
    <el-date-picker
      v-else-if="type === 'datetimerange'"
      ref="pickerRef"
      v-model="internalValue"
      type="datetimerange"
      range-separator="至"
      :start-placeholder="startPlaceholder || '开始时间'"
      :end-placeholder="endPlaceholder || '结束时间'"
      :disabled="disabled"
      :clearable="clearable"
      :size="size"
      :format="datetimeFormat"
      :value-format="datetimeValueFormat"
      :disabled-date="disabledDate"
      :disabled-hours="disabledHours"
      :disabled-minutes="disabledMinutes"
      :disabled-seconds="disabledSeconds"
      @change="handleChange"
      @blur="handleBlur"
      @focus="handleFocus"
    />

    <!-- 时间范围选择器 -->
    <el-time-picker
      v-else-if="type === 'timerange'"
      ref="pickerRef"
      v-model="internalValue"
      is-range
      range-separator="至"
      :start-placeholder="startPlaceholder || '开始时间'"
      :end-placeholder="endPlaceholder || '结束时间'"
      :disabled="disabled"
      :clearable="clearable"
      :size="size"
      :format="timeFormat"
      :value-format="timeValueFormat"
      :disabled-hours="disabledHours"
      :disabled-minutes="disabledMinutes"
      :disabled-seconds="disabledSeconds"
      @change="handleChange"
      @blur="handleBlur"
      @focus="handleFocus"
    />

    <!-- 自定义插槽 -->
    <slot name="default"></slot>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { DateInstance } from 'element-plus'

// Props定义
interface Props {
  /** 选择器类型 */
  type?: 'year' | 'month' | 'date' | 'datetime' | 'time' | 'daterange' | 'monthrange' | 'datetimerange' | 'timerange'
  /** 绑定值 */
  modelValue: Date | string | string[] | null
  /** 占位符 */
  placeholder?: string
  /** 是否禁用 */
  disabled?: boolean
  /** 是否可清空 */
  clearable?: boolean
  /** 尺寸 */
  size?: 'large' | 'default' | 'small'
  /** 范围选择时开始日期的占位符 */
  startPlaceholder?: string
  /** 范围选择时结束日期的占位符 */
  endPlaceholder?: string
  /** 禁用日期 */
  disabledDate?: (time: Date) => boolean
  /** 禁用小时 */
  disabledHours?: () => number[]
  /** 禁用分钟 */
  disabledMinutes?: (selectedHour: number) => number[]
  /** 禁用秒 */
  disabledSeconds?: (selectedHour: number, selectedMinute: number) => number[]
  /** 年份格式化显示 */
  yearFormat?: string
  /** 月份格式化显示 */
  monthFormat?: string
  /** 日期格式化显示 */
  dateFormat?: string
  /** 日期时间格式化显示 */
  datetimeFormat?: string
  /** 时间格式化显示 */
  timeFormat?: string
  /** 年份值格式 */
  yearValueFormat?: string
  /** 月份值格式 */
  monthValueFormat?: string
  /** 日期值格式 */
  dateValueFormat?: string
  /** 日期时间值格式 */
  datetimeValueFormat?: string
  /** 时间值格式 */
  timeValueFormat?: string
}

const props = withDefaults(defineProps<Props>(), {
  type: 'date',
  disabled: false,
  clearable: true,
  size: 'default',
  // 中文格式化显示
  yearFormat: 'YYYY年',
  monthFormat: 'YYYY年MM月',
  dateFormat: 'YYYY年MM月DD日',
  datetimeFormat: 'YYYY年MM月DD日 HH:mm:ss',
  timeFormat: 'HH:mm:ss',
  // 值格式（标准格式）
  yearValueFormat: 'YYYY',
  monthValueFormat: 'YYYY-MM',
  dateValueFormat: 'YYYY-MM-DD',
  datetimeValueFormat: 'YYYY-MM-DD HH:mm:ss',
  timeValueFormat: 'HH:mm:ss'
})

// Emits定义
const emit = defineEmits<{
  'update:modelValue': [value: Date | string | string[] | null]
  'change': [value: Date | string | string[] | null]
  'blur': [event: FocusEvent]
  'focus': [event: FocusEvent]
}>()

// 响应式数据
const pickerRef = ref<DateInstance>()
const internalValue = ref<Date | string | string[] | null>(props.modelValue)

// 监听外部值变化
watch(
  () => props.modelValue,
  (newVal) => {
    internalValue.value = newVal
  }
)

// 处理变化
const handleChange = (value: Date | string | string[] | null) => {
  emit('update:modelValue', value)
  emit('change', value)
}

// 处理失焦
const handleBlur = (event: FocusEvent) => {
  emit('blur', event)
}

// 处理聚焦
const handleFocus = (event: FocusEvent) => {
  emit('focus', event)
}

// 格式化日期时间
const formatDateTime = (
  value: Date | string | null,
  format?: string
): string => {
  if (!value) return ''

  const date = typeof value === 'string' ? new Date(value) : value
  if (isNaN(date.getTime())) return ''

  const fmt = format || props.datetimeFormat || 'YYYY-MM-DD HH:mm:ss'

  return formatDate(date, fmt)
}

// 格式化日期
const formatDate = (
  value: Date | string | null,
  format?: string
): string => {
  if (!value) return ''

  const date = typeof value === 'string' ? new Date(value) : value
  if (isNaN(date.getTime())) return ''

  const fmt = format || props.dateFormat || 'YYYY-MM-DD'

  return formatDate(date, fmt)
}

// 格式化时间
const formatTime = (
  value: Date | string | null,
  format?: string
): string => {
  if (!value) return ''

  const date = typeof value === 'string' ? new Date(value) : value
  if (isNaN(date.getTime())) return ''

  const fmt = format || props.timeFormat || 'HH:mm:ss'

  return formatDate(date, fmt)
}

// 格式化年份
const formatYear = (
  value: Date | string | null,
  format?: string
): string => {
  if (!value) return ''

  const date = typeof value === 'string' ? new Date(value) : value
  if (isNaN(date.getTime())) return ''

  const fmt = format || props.yearFormat || 'YYYY'

  return formatDate(date, fmt)
}

// 格式化月份
const formatMonth = (
  value: Date | string | null,
  format?: string
): string => {
  if (!value) return ''

  const date = typeof value === 'string' ? new Date(value) : date
  if (isNaN(date.getTime())) return ''

  const fmt = format || props.monthFormat || 'YYYY-MM'

  return formatDate(date, fmt)
}

// 内部格式化函数
const formatDate = (date: Date, format: string): string => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hours = date.getHours()
  const minutes = date.getMinutes()
  const seconds = date.getSeconds()
  const weekday = date.getDay()

  const weekDays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']

  return format
    .replace(/YYYY/g, year.toString())
    .replace(/YY/g, (year % 100).toString().padStart(2, '0'))
    .replace(/MM/g, month.toString().padStart(2, '0'))
    .replace(/M/g, month.toString())
    .replace(/DD/g, day.toString().padStart(2, '0'))
    .replace(/D/g, day.toString())
    .replace(/HH/g, hours.toString().padStart(2, '0'))
    .replace(/H/g, hours.toString())
    .replace(/mm/g, minutes.toString().padStart(2, '0'))
    .replace(/m/g, minutes.toString())
    .replace(/ss/g, seconds.toString().padStart(2, '0'))
    .replace(/s/g, seconds.toString())
    .replace(/WW/g, weekDays[weekday])
    .replace(/W/g, ['日', '一', '二', '三', '四', '五', '六'][weekday])
}

// 解析日期
const parseDate = (
  value: string,
  format?: string
): Date | null => {
  if (!value) return null

  const date = new Date(value)
  if (isNaN(date.getTime())) return null

  return date
}

// 获取当前日期
const getCurrentDate = (): Date => {
  return new Date()
}

// 获取今天开始时间
const getTodayStart = (): Date => {
  const date = new Date()
  date.setHours(0, 0, 0, 0)
  return date
}

// 获取今天结束时间
const getTodayEnd = (): Date => {
  const date = new Date()
  date.setHours(23, 59, 59, 999)
  return date
}

// 获取本周开始时间
const getWeekStart = (): Date => {
  const date = new Date()
  const day = date.getDay()
  const diff = date.getDate() - day + (day === 0 ? -6 : 1)
  date.setDate(diff)
  date.setHours(0, 0, 0, 0)
  return date
}

// 获取本周结束时间
const getWeekEnd = (): Date => {
  const date = new Date()
  const day = date.getDay()
  const diff = date.getDate() - day + (day === 0 ? 0 : 7)
  date.setDate(diff)
  date.setHours(23, 59, 59, 999)
  return date
}

// 获取本月开始时间
const getMonthStart = (): Date => {
  const date = new Date()
  date.setDate(1)
  date.setHours(0, 0, 0, 0)
  return date
}

// 获取本月结束时间
const getMonthEnd = (): Date => {
  const date = new Date()
  date.setMonth(date.getMonth() + 1)
  date.setDate(0)
  date.setHours(23, 59, 59, 999)
  return date
}

// 获取本年开始时间
const getYearStart = (): Date => {
  const date = new Date()
  date.setMonth(0, 1)
  date.setHours(0, 0, 0, 0)
  return date
}

// 获取本年结束时间
const getYearEnd = (): Date => {
  const date = new Date()
  date.setMonth(11, 31)
  date.setHours(23, 59, 59, 999)
  return date
}

// 获取相对日期
const getRelativeDate = (days: number): Date => {
  const date = new Date()
  date.setDate(date.getDate() + days)
  return date
}

// 获取相对日期范围
const getRelativeDateRange = (startDays: number, endDays: number): [Date, Date] => {
  const startDate = new Date()
  startDate.setDate(startDate.getDate() + startDays)
  startDate.setHours(0, 0, 0, 0)

  const endDate = new Date()
  endDate.setDate(endDate.getDate() + endDays)
  endDate.setHours(23, 59, 59, 999)

  return [startDate, endDate]
}

// 暴露方法
defineExpose({
  focus: () => pickerRef.value?.focus(),
  blur: () => pickerRef.value?.blur(),
  formatDateTime,
  formatDate,
  formatTime,
  formatYear,
  formatMonth,
  parseDate,
  getCurrentDate,
  getTodayStart,
  getTodayEnd,
  getWeekStart,
  getWeekEnd,
  getMonthStart,
  getMonthEnd,
  getYearStart,
  getYearEnd,
  getRelativeDate,
  getRelativeDateRange
})
</script>

<style scoped>
.date-time-picker-container {
  display: inline-block;
  width: 100%;
}

/* 响应式设计 */
@media screen and (max-width: 768px) {
  .date-time-picker-container {
    width: 100%;
  }
}
</style>
