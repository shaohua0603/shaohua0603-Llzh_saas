# 富文本编辑器组件 (RichTextEditor.vue)

## 组件简介

富文本编辑器组件基于Element Plus开发，提供完整的富文本编辑功能，支持文本格式化、图片上传、表格插入、链接插入等功能，并支持自动保存草稿。

## 功能特性

### 1. 文本格式化
- 加粗、斜体、下划线、删除线
- 字体大小选择（12px-48px）
- 字体颜色设置
- 背景颜色设置
- 对齐方式（左对齐、居中、右对齐）
- 列表（有序列表、无序列表）

### 2. 图片上传
- 支持从本地上传图片
- 支持拖拽上传图片
- 支持网络图片URL
- 图片预览功能
- 图片大小调整

### 3. 表格插入
- 自定义行数和列数
- 表格样式设置
- 表格编辑功能

### 4. 链接插入
- 插入超链接
- 设置链接文字
- 编辑链接功能

### 5. 内容管理
- 实时字符数统计
- 最大字符数限制
- 超出限制提示
- 撤销/重做功能
- 清除格式功能

### 6. 自动保存
- 自动保存草稿到本地存储
- 支持恢复草稿
- 支持清除草稿
- 显示上次保存时间

## Props 属性

| 属性名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| modelValue | string | '' | 编辑器内容（v-model绑定） |
| height | string | '400px' | 编辑器高度 |
| minHeight | string | '200px' | 编辑器最小高度 |
| disabled | boolean | false | 是否禁用 |
| showToolbar | boolean | true | 是否显示工具栏 |
| showFooter | boolean | true | 是否显示底部信息栏 |
| maxLength | number | - | 最大字符数 |
| placeholder | string | '请输入内容...' | 占位符 |
| autoSave | boolean | false | 是否自动保存草稿 |
| autoSaveInterval | number | 30000 | 自动保存间隔（毫秒） |
| draftStorageKey | string | 'rich-text-editor' | 草稿存储键 |
| uploadAction | string | '/api/upload' | 上传地址 |
| uploadHeaders | object | {} | 上传请求头 |
| uploadData | object | {} | 上传额外参数 |

## Events 事件

| 事件名 | 参数 | 说明 |
|--------|------|------|
| update:modelValue | value: string | 内容变化时触发 |
| change | value: string | 内容变化时触发 |
| blur | value: string | 失去焦点时触发 |
| focus | value: string | 获得焦点时触发 |
| paste | event: ClipboardEvent | 粘贴事件 |
| save-draft | draftData: DraftData | 保存草稿时触发 |
| restore-draft | draftData: DraftData | 恢复草稿时触发 |

## Slots 插槽

| 插槽名 | 说明 |
|--------|------|
| toolbar | 自定义工具栏内容 |
| footer-left | 底部左侧自定义内容 |
| default | 默认插槽 |

## Methods 方法（通过ref调用）

| 方法名 | 参数 | 返回值 | 说明 |
|--------|------|--------|------|
| setContent | content: string | void | 设置编辑器内容 |
| getContent | - | string | 获取编辑器HTML内容 |
| getTextContent | - | string | 获取纯文本内容 |
| clearContent | - | void | 清空编辑器内容 |
| saveDraft | - | void | 保存草稿 |
| restoreDraft | - | boolean | 恢复草稿 |
| clearDraft | - | void | 清除草稿 |
| execCommand | command: string, value?: string | void | 执行编辑器命令 |
| focus | - | void | 聚焦编辑器 |

## 使用示例

### 基础用法

```vue
<template>
  <RichTextEditor
    v-model="content"
    placeholder="请输入内容..."
    height="400px"
    @change="handleChange"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import RichTextEditor from '@/components/RichTextEditor.vue'

const content = ref('<p>欢迎使用富文本编辑器！</p>')

const handleChange = (value: string) => {
  console.log('内容变化：', value)
}
</script>
```

### 带字符限制和自动保存

```vue
<template>
  <RichTextEditor
    v-model="content"
    placeholder="请输入内容..."
    height="300px"
    :max-length="1000"
    :auto-save="true"
    :auto-save-interval="10000"
    draft-storage-key="my-draft"
    @save-draft="handleSaveDraft"
    @restore-draft="handleRestoreDraft"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import RichTextEditor from '@/components/RichTextEditor.vue'

const content = ref('')

const handleSaveDraft = (draftData: any) => {
  console.log('保存草稿：', draftData)
}

const handleRestoreDraft = (draftData: any) => {
  console.log('恢复草稿：', draftData)
}
</script>
```

### 自定义工具栏

```vue
<template>
  <RichTextEditor v-model="content" height="300px">
    <template #toolbar>
      <el-button type="primary" @click="handleCustomAction">
        自定义按钮
      </el-button>
    </template>
  </RichTextEditor>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import RichTextEditor from '@/components/RichTextEditor.vue'

const content = ref('')

const handleCustomAction = () => {
  ElMessage.success('点击了自定义按钮')
}
</script>
```

### 通过ref调用方法

```vue
<template>
  <RichTextEditor ref="editorRef" v-model="content" />
  <el-button @click="clearContent">清空内容</el-button>
  <el-button @click="getContent">获取内容</el-button>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import RichTextEditor from '@/components/RichTextEditor.vue'

const editorRef = ref()
const content = ref('')

const clearContent = () => {
  editorRef.value?.clearContent()
}

const getContent = () => {
  const html = editorRef.value?.getContent()
  console.log('HTML内容：', html)
  const text = editorRef.value?.getTextContent()
  console.log('纯文本内容：', text)
}
</script>
```

## 注意事项

1. **图片上传**：需要配置正确的`uploadAction`地址和`uploadHeaders`
2. **自动保存**：草稿会保存到localStorage，与用户ID绑定
3. **字符限制**：超出限制时会显示提示，但不会阻止输入
4. **安全性**：组件会对粘贴内容进行纯文本处理，防止XSS攻击
5. **响应式**：组件支持移动端适配，在小屏幕上会自动调整布局

---

# 日期时间选择器组件 (DateTimePicker.vue)

## 组件简介

日期时间选择器组件基于Element Plus的日期时间选择器封装，提供统一的中文友好的日期时间选择功能，支持多种选择器类型和丰富的工具函数。

## 功能特性

### 1. 选择器类型
- 年份选择器（中文年份显示）
- 月份选择器（中文月份显示）
- 日期选择器（中文星期和月份显示）
- 日期时间选择器
- 时间选择器
- 日期范围选择器
- 月份范围选择器
- 日期时间范围选择器
- 时间范围选择器

### 2. 中文友好
- 所有选择器都以中文显示
- 年份显示格式：2026年
- 月份显示格式：2026年02月
- 日期显示格式：2026年02月25日 星期三
- 时间显示格式：14:30:00

### 3. 限制功能
- 禁用特定日期
- 禁用特定小时、分钟、秒
- 日期范围限制

### 4. 工具函数
- 格式化日期时间
- 解析日期
- 获取相对日期
- 获取常用日期范围（今天、本周、本月、今年等）

## Props 属性

| 属性名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| type | string | 'date' | 选择器类型 |
| modelValue | Date\|string\|string[]\|null | - | 绑定值（v-model） |
| placeholder | string | - | 占位符 |
| disabled | boolean | false | 是否禁用 |
| clearable | boolean | true | 是否可清空 |
| size | string | 'default' | 尺寸（large/default/small） |
| startPlaceholder | string | - | 范围选择时开始日期的占位符 |
| endPlaceholder | string | - | 范围选择时结束日期的占位符 |
| disabledDate | function | - | 禁用日期函数 |
| disabledHours | function | - | 禁用小时函数 |
| disabledMinutes | function | - | 禁用分钟函数 |
| disabledSeconds | function | - | 禁用秒函数 |
| yearFormat | string | 'YYYY年' | 年份格式化显示 |
| monthFormat | string | 'YYYY年MM月' | 月份格式化显示 |
| dateFormat | string | 'YYYY年MM月DD日' | 日期格式化显示 |
| datetimeFormat | string | 'YYYY年MM月DD日 HH:mm:ss' | 日期时间格式化显示 |
| timeFormat | string | 'HH:mm:ss' | 时间格式化显示 |
| yearValueFormat | string | 'YYYY' | 年份值格式 |
| monthValueFormat | string | 'YYYY-MM' | 月份值格式 |
| dateValueFormat | string | 'YYYY-MM-DD' | 日期值格式 |
| datetimeValueFormat | string | 'YYYY-MM-DD HH:mm:ss' | 日期时间值格式 |
| timeValueFormat | string | 'HH:mm:ss' | 时间值格式 |

## Events 事件

| 事件名 | 参数 | 说明 |
|--------|------|------|
| update:modelValue | value | 值变化时触发 |
| change | value | 值变化时触发 |
| blur | event | 失去焦点时触发 |
| focus | event | 获得焦点时触发 |

## Methods 方法（通过ref调用）

| 方法名 | 参数 | 返回值 | 说明 |
|--------|------|--------|------|
| focus | - | void | 聚焦选择器 |
| blur | - | void | 失去焦点 |
| formatDateTime | value, format? | string | 格式化日期时间 |
| formatDate | value, format? | string | 格式化日期 |
| formatTime | value, format? | string | 格式化时间 |
| formatYear | value, format? | string | 格式化年份 |
| formatMonth | value, format? | string | 格式化月份 |
| parseDate | value, format? | Date\|null | 解析日期 |
| getCurrentDate | - | Date | 获取当前日期 |
| getTodayStart | - | Date | 获取今天开始时间 |
| getTodayEnd | - | Date | 获取今天结束时间 |
| getWeekStart | - | Date | 获取本周开始时间 |
| getWeekEnd | - | Date | 获取本周结束时间 |
| getMonthStart | - | Date | 获取本月开始时间 |
| getMonthEnd | - | Date | 获取本月结束时间 |
| getYearStart | - | Date | 获取本年开始时间 |
| getYearEnd | - | Date | 获取本年结束时间 |
| getRelativeDate | days | Date | 获取相对日期 |
| getRelativeDateRange | startDays, endDays | [Date, Date] | 获取相对日期范围 |

## 使用示例

### 年份选择器

```vue
<template>
  <DateTimePicker
    v-model="yearValue"
    type="year"
    placeholder="选择年份"
    @change="handleChange"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import DateTimePicker from '@/components/DateTimePicker.vue'

const yearValue = ref('2026')

const handleChange = (value: string) => {
  console.log('选择的年份：', value)
}
</script>
```

### 月份选择器

```vue
<template>
  <DateTimePicker
    v-model="monthValue"
    type="month"
    placeholder="选择月份"
    @change="handleChange"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import DateTimePicker from '@/components/DateTimePicker.vue'

const monthValue = ref('2026-02')
</script>
```

### 日期选择器

```vue
<template>
  <DateTimePicker
    v-model="dateValue"
    type="date"
    placeholder="选择日期"
    @change="handleChange"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import DateTimePicker from '@/components/DateTimePicker.vue'

const dateValue = ref('2026-02-25')
</script>
```

### 日期时间选择器

```vue
<template>
  <DateTimePicker
    v-model="datetimeValue"
    type="datetime"
    placeholder="选择日期时间"
    @change="handleChange"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import DateTimePicker from '@/components/DateTimePicker.vue'

const datetimeValue = ref('2026-02-25 14:30:00')
</script>
```

### 日期范围选择器

```vue
<template>
  <DateTimePicker
    v-model="daterangeValue"
    type="daterange"
    start-placeholder="开始日期"
    end-placeholder="结束日期"
    @change="handleChange"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import DateTimePicker from '@/components/DateTimePicker.vue'

const daterangeValue = ref(['2026-02-01', '2026-02-28'])
</script>
```

### 禁用特定日期

```vue
<template>
  <DateTimePicker
    v-model="dateValue"
    type="date"
    placeholder="选择日期"
    :disabled-date="disabledDate"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import DateTimePicker from '@/components/DateTimePicker.vue'

const dateValue = ref('')

// 禁用今天之前的日期
const disabledDate = (time: Date) => {
  return time.getTime() < Date.now() - 8.64e7
}
</script>
```

### 使用工具函数

```vue
<template>
  <el-space wrap>
    <el-button @click="setToday">今天</el-button>
    <el-button @click="setThisWeek">本周</el-button>
    <el-button @click="setThisMonth">本月</el-button>
    <el-button @click="setThisYear">今年</el-button>
    <el-button @click="setLast7Days">最近7天</el-button>
    <el-button @click="setLast30Days">最近30天</el-button>
  </el-space>
  <DateTimePicker
    ref="pickerRef"
    v-model="dateRangeValue"
    type="daterange"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import DateTimePicker from '@/components/DateTimePicker.vue'

const pickerRef = ref()
const dateRangeValue = ref([])

const setToday = () => {
  const today = pickerRef.value?.getTodayStart()
  const end = pickerRef.value?.getTodayEnd()
  dateRangeValue.value = [today, end]
  ElMessage.success('已选择今天')
}

const setThisWeek = () => {
  const start = pickerRef.value?.getWeekStart()
  const end = pickerRef.value?.getWeekEnd()
  dateRangeValue.value = [start, end]
  ElMessage.success('已选择本周')
}

const setThisMonth = () => {
  const start = pickerRef.value?.getMonthStart()
  const end = pickerRef.value?.getMonthEnd()
  dateRangeValue.value = [start, end]
  ElMessage.success('已选择本月')
}

const setThisYear = () => {
  const start = pickerRef.value?.getYearStart()
  const end = pickerRef.value?.getYearEnd()
  dateRangeValue.value = [start, end]
  ElMessage.success('已选择今年')
}

const setLast7Days = () => {
  const range = pickerRef.value?.getRelativeDateRange(-6, 0)
  dateRangeValue.value = range
  ElMessage.success('已选择最近7天')
}

const setLast30Days = () => {
  const range = pickerRef.value?.getRelativeDateRange(-29, 0)
  dateRangeValue.value = range
  ElMessage.success('已选择最近30天')
}
</script>
```

### 格式化日期

```vue
<template>
  <div>格式化结果：{{ formattedDate }}</div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import DateTimePicker from '@/components/DateTimePicker.vue'

const dateValue = ref('2026-02-25')
const pickerRef = ref()

const formattedDate = computed(() => {
  return pickerRef.value?.formatDateTime(dateValue.value, 'YYYY年MM月DD日 星期W')
})
</script>
```

## 注意事项

1. **中文显示**：组件默认使用中文格式化，如需自定义格式，请使用format属性
2. **值格式**：组件返回的值使用标准格式（YYYY-MM-DD），显示时使用中文格式
3. **时区**：组件使用浏览器本地时区
4. **响应式**：组件支持移动端适配
5. **类型安全**：组件使用TypeScript编写，提供完整的类型定义

## 格式化说明

### 格式化占位符

| 占位符 | 说明 | 示例 |
|--------|------|------|
| YYYY | 四位年份 | 2026 |
| YY | 两位年份 | 26 |
| MM | 两位月份 | 02 |
| M | 一位月份 | 2 |
| DD | 两位日期 | 25 |
| D | 一位日期 | 5 |
| HH | 两位小时（24小时制） | 14 |
| H | 一位小时 | 2 |
| mm | 两位分钟 | 30 |
| m | 一位分钟 | 5 |
| ss | 两位秒 | 45 |
| s | 一位秒 | 5 |
| WW | 中文星期 | 星期三 |
| W | 中文星期简写 | 三 |

### 常用格式示例

```javascript
'YYYY年'                    // 2026年
'YYYY年MM月'                 // 2026年02月
'YYYY年MM月DD日'             // 2026年02月25日
'YYYY年MM月DD日 星期W'       // 2026年02月25日 星期三
'YYYY-MM-DD'                 // 2026-02-25
'YYYY-MM-DD HH:mm:ss'        // 2026-02-25 14:30:45
'HH:mm:ss'                   // 14:30:45
```

---

## 完整示例

查看 [ComponentDemo.vue](file:///e:/三鼎/蓝领智汇 SaaS系统/blue-collar-platform/src/views/common/ComponentDemo.vue) 获取完整的使用示例。
