# PrintPreview 打印预览组件

## 功能概述

打印预览组件是一个功能强大的打印解决方案，支持A4纸张预览、打印设置、批量打印、变量替换等功能。

## 基础用法

### 简单打印预览

```vue
<template>
  <PrintPreview
    :template="printTemplate"
    :data="printData"
    @print="handlePrint"
    @cancel="handleCancel"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import PrintPreview from '@/components/PrintPreview.vue'
import type { PrintTemplate, PrintData } from '@/types/print-preview'

const printTemplate = ref<PrintTemplate>({
  id: '1',
  name: '合同模板',
  code: 'contract',
  content: `
    <div style="padding: 40px;">
      <h1 style="text-align: center;">劳动合同</h1>
      <p><strong>甲方:</strong> {{companyName}}</p>
      <p><strong>乙方:</strong> {{workerName}}</p>
      <p><strong>签订日期:</strong> {{signDate}}</p>
      <p><strong>合同期限:</strong> {{contractPeriod}}</p>
    </div>
  `,
  variables: [
    { name: 'companyName', label: '公司名称', type: 'text', required: true },
    { name: 'workerName', label: '工人姓名', type: 'text', required: true },
    { name: 'signDate', label: '签订日期', type: 'date', required: true },
    { name: 'contractPeriod', label: '合同期限', type: 'text', required: true }
  ],
  createdAt: new Date().toISOString()
})

const printData = ref<PrintData[]>([
  {
    id: '1',
    data: {
      companyName: '某某劳务公司',
      workerName: '张三',
      signDate: '2024-01-01',
      contractPeriod: '1年'
    },
    templateId: '1'
  }
])

const handlePrint = (data: PrintData[]) => {
  console.log('打印数据:', data)
}

const handleCancel = () => {
  console.log('取消打印')
}
</script>
```

### 自定义打印设置

```vue
<template>
  <PrintPreview
    :template="printTemplate"
    :data="printData"
    :settings="printSettings"
    :scale="1.2"
    @settings-change="handleSettingsChange"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { PrintSettings } from '@/types/print-preview'

const printSettings = ref<PrintSettings>({
  copies: 2,
  quality: 'high',
  orientation: 'portrait',
  margin: {
    top: 20,
    right: 20,
    bottom: 20,
    left: 20
  },
  headerFooter: {
    showHeader: true,
    showFooter: true,
    showPageNumber: true,
    headerText: '某某公司合同',
    footerText: '机密文件'
  }
})

const handleSettingsChange = (settings: PrintSettings) => {
  console.log('打印设置已更新:', settings)
}
</script>
```

### 批量打印

```vue
<template>
  <PrintPreview
    :template="printTemplate"
    :data="batchPrintData"
    :show-batch-print="true"
    @print="handleBatchPrint"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'

const batchPrintData = ref<PrintData[]>([
  {
    id: '1',
    data: { name: '张三', department: '生产部' },
    templateId: '1'
  },
  {
    id: '2',
    data: { name: '李四', department: '质检部' },
    templateId: '1'
  },
  {
    id: '3',
    data: { name: '王五', department: '仓储部' },
    templateId: '1'
  }
])

const handleBatchPrint = (data: PrintData[]) => {
  console.log('批量打印:', data.length, '份')
}
</script>
```

## API

### Props

| 参数 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| template | 打印模板 | `PrintTemplate` | - |
| data | 打印数据 | `PrintData[]` | - |
| settings | 打印设置 | `Partial<PrintSettings>` | - |
| showSettings | 是否显示打印设置 | `boolean` | `true` |
| showBatchPrint | 是否显示批量打印 | `boolean` | `true` |
| showVariablePreview | 是否显示变量预览 | `boolean` | `true` |
| scale | 缩放比例 | `number` | `1` |
| showToolbar | 是否显示工具栏 | `boolean` | `true` |

### Events

| 事件名 | 说明 | 回调参数 |
|--------|------|----------|
| print | 打印事件 | `(data: PrintData[]) => void` |
| settings-change | 设置变化事件 | `(settings: PrintSettings) => void` |
| template-change | 模板变化事件 | `(template: PrintTemplate) => void` |
| cancel | 取消事件 | `() => void` |

### Methods

| 方法名 | 说明 | 参数 |
|--------|------|------|
| print | 打印 | - |
| preview | 预览 | - |
| resetSettings | 重置设置 | - |
| replaceVariables | 替换变量 | `(content: string, data: Record<string, any>) => string` |

### 类型定义

#### PrintTemplate

```typescript
interface PrintTemplate {
  id: string
  name: string
  code: string
  content: string
  variables: VariableConfig[]
  isDefault?: boolean
  createdAt: string
}
```

#### PrintData

```typescript
interface PrintData {
  id: string
  data: Record<string, any>
  templateId: string
}
```

#### PrintSettings

```typescript
interface PrintSettings {
  copies: number
  quality: 'low' | 'medium' | 'high'
  orientation: 'portrait' | 'landscape'
  margin: {
    top: number
    right: number
    bottom: number
    left: number
  }
  headerFooter: {
    showHeader: boolean
    showFooter: boolean
    showPageNumber: boolean
    headerText?: string
    footerText?: string
  }
}
```

## 使用场景

1. **合同打印** - 打印劳动合同、劳务合同等
2. **证书打印** - 打印培训证书、荣誉证书等
3. **单据打印** - 打印工资单、考勤单等
4. **批量打印** - 批量打印工人合同、工资条等
5. **自定义模板** - 根据业务需求自定义打印模板

## 注意事项

1. 打印模板内容支持HTML格式
2. 变量使用 `{{variableName}}` 格式
3. 打印时请确保打印机连接正常
4. 批量打印时请注意打印份数设置
5. 页边距单位为像素(px)
