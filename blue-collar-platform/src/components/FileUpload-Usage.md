# FileUpload 组件使用指南

## 组件简介

FileUpload 是一个功能完善的附件上传组件，基于 Element Plus 的 Upload 组件封装，支持多种上传方式、文件预览、批量操作等功能。

## 功能特性

### 1. 附件上传功能
- ✅ 支持单文件上传
- ✅ 支持批量上传
- ✅ 支持拖拽上传
- ✅ 支持点击上传
- ✅ 显示上传进度

### 2. 文件预览功能
- ✅ 支持图片预览
- ✅ 支持PDF预览
- ✅ 支持视频预览
- ✅ 支持音频预览
- ✅ 支持文档预览（Word、Excel等）

### 3. 批量上传功能
- ✅ 支持同时上传多个文件
- ✅ 支持批量删除
- ✅ 支持批量下载

### 4. 文件大小限制
- ✅ 支持设置最大文件大小
- ✅ 超出限制时提示
- ✅ 显示文件大小信息

### 5. 文件类型限制
- ✅ 支持设置允许的文件类型
- ✅ 支持accept属性限制
- ✅ 不符合类型时提示

### 6. 模板下载功能
- ✅ 支持提供模板文件下载
- ✅ 支持自定义模板名称
- ✅ 支持多个模板

### 7. 文件管理功能
- ✅ 支持查看已上传文件列表
- ✅ 支持删除已上传文件
- ✅ 支持重新上传

### 8. 上传状态管理
- ✅ 显示上传进度
- ✅ 显示上传成功/失败状态
- ✅ 支持取消上传
- ✅ 支持重试上传

## 基础用法

### 1. 简单上传

```vue
<template>
  <FileUpload v-model="fileList" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import FileUpload from '@/components/FileUpload.vue'

const fileList = ref([])
</script>
```

### 2. 拖拽上传

```vue
<template>
  <FileUpload
    v-model="fileList"
    :drag="true"
    :multiple="true"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import FileUpload from '@/components/FileUpload.vue'

const fileList = ref([])
</script>
```

### 3. 单文件上传

```vue
<template>
  <FileUpload
    v-model="fileList"
    :multiple="false"
    :limit="1"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import FileUpload from '@/components/FileUpload.vue'

const fileList = ref([])
</script>
```

## 高级用法

### 1. 文件类型限制

```vue
<template>
  <FileUpload
    v-model="fileList"
    accept=".jpg,.jpeg,.png,.pdf,.doc,.docx"
    :max-size="10 * 1024 * 1024"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import FileUpload from '@/components/FileUpload.vue'

const fileList = ref([])
</script>
```

### 2. 自定义上传请求

```vue
<template>
  <FileUpload
    v-model="fileList"
    :upload-action="uploadAction"
    :upload-headers="uploadHeaders"
    :http-request="customUpload"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import FileUpload from '@/components/FileUpload.vue'
import type { UploadRequestOptions } from 'element-plus'

const fileList = ref([])
const uploadAction = '/api/upload'
const uploadHeaders = {
  'Authorization': 'Bearer your-token'
}

// 自定义上传请求
const customUpload = async (options: UploadRequestOptions) => {
  const { file, onProgress, onSuccess, onError } = options

  try {
    const formData = new FormData()
    formData.append('file', file)

    const response = await fetch(uploadAction, {
      method: 'POST',
      headers: uploadHeaders,
      body: formData
    })

    const result = await response.json()

    if (result.code === 200) {
      onSuccess(result, file)
    } else {
      onError(new Error(result.message), file)
    }
  } catch (error) {
    onError(error as Error, file)
  }
}
</script>
```

### 3. 模板下载

```vue
<template>
  <FileUpload
    v-model="fileList"
    :templates="templates"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import FileUpload from '@/components/FileUpload.vue'

const fileList = ref([])

const templates = [
  {
    name: '员工信息导入模板.xlsx',
    url: '/templates/employee-template.xlsx'
  },
  {
    name: '工资单导入模板.xlsx',
    url: '/templates/salary-template.xlsx'
  }
]
</script>
```

### 4. 事件监听

```vue
<template>
  <FileUpload
    v-model="fileList"
    @change="handleChange"
    @success="handleSuccess"
    @error="handleError"
    @preview="handlePreview"
    @remove="handleRemove"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import FileUpload from '@/components/FileUpload.vue'
import type { UploadFile, UploadFiles } from 'element-plus'

const fileList = ref([])

// 文件状态变化
const handleChange = (file: UploadFile, fileList: UploadFiles) => {
  console.log('文件状态变化', file, fileList)
}

// 上传成功
const handleSuccess = (response: any, file: UploadFile, fileList: UploadFiles) => {
  ElMessage.success(`${file.name} 上传成功`)
  console.log('上传成功', response)
}

// 上传失败
const handleError = (error: Error, file: UploadFile, fileList: UploadFiles) => {
  ElMessage.error(`${file.name} 上传失败`)
  console.error('上传失败', error)
}

// 预览文件
const handlePreview = (file: UploadFile) => {
  console.log('预览文件', file)
}

// 删除文件
const handleRemove = (file: UploadFile, fileList: UploadFiles) => {
  console.log('删除文件', file, fileList)
}
</script>
```

### 5. 手动控制上传

```vue
<template>
  <div>
    <FileUpload
      ref="uploadRef"
      v-model="fileList"
      :auto-upload="false"
    />
    <div class="upload-actions">
      <el-button type="primary" @click="submitUpload">开始上传</el-button>
      <el-button @click="clearFiles">清空文件</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import FileUpload from '@/components/FileUpload.vue'

const fileList = ref([])
const uploadRef = ref()

// 手动上传
const submitUpload = () => {
  uploadRef.value?.submitUpload()
}

// 清空文件
const clearFiles = () => {
  uploadRef.value?.clearFiles()
}
</script>
```

### 6. 自定义上传按钮

```vue
<template>
  <FileUpload v-model="fileList">
    <template #trigger>
      <el-button type="success">
        <el-icon><Upload /></el-icon>
        选择文件
      </el-button>
    </template>
  </FileUpload>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import FileUpload from '@/components/FileUpload.vue'

const fileList = ref([])
</script>
```

## Props 参数

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
|------|------|------|--------|--------|
| modelValue | v-model绑定的文件列表 | UploadFile[] | - | [] |
| uploadAction | 上传地址 | string | - | '/api/upload' |
| uploadHeaders | 上传请求头 | Record<string, string> | - | {} |
| uploadData | 上传额外参数 | Record<string, any> | - | {} |
| multiple | 是否支持多选 | boolean | - | true |
| drag | 是否支持拖拽 | boolean | - | true |
| accept | 接受的文件类型 | string | - | '*' |
| limit | 最大上传数量 | number | - | 10 |
| disabled | 是否禁用 | boolean | - | false |
| autoUpload | 是否自动上传 | boolean | - | true |
| listType | 列表类型 | string | text/picture/picture-card | 'text' |
| maxSize | 最大文件大小（字节） | number | - | 100MB |
| showFileList | 是否显示文件列表 | boolean | - | true |
| templates | 模板列表 | Template[] | - | [] |
| buttonText | 上传按钮文字 | string | - | '上传文件' |
| uploadTip | 上传提示文字 | string | - | '支持批量上传，文件大小不超过100MB' |
| httpRequest | 自定义上传请求 | Function | - | - |

## Events 事件

| 事件名 | 说明 | 回调参数 |
|--------|------|----------|
| update:modelValue | 文件列表变化 | (files: UploadFile[]) |
| change | 文件状态变化 | (file: UploadFile, fileList: UploadFiles) |
| preview | 预览文件 | (file: UploadFile) |
| remove | 删除文件 | (file: UploadFile, fileList: UploadFiles) |
| success | 上传成功 | (response: any, file: UploadFile, fileList: UploadFiles) |
| error | 上传失败 | (error: Error, file: UploadFile, fileList: UploadFiles) |
| progress | 上传进度 | (event: any, file: UploadFile, fileList: UploadFiles) |
| exceed | 文件超出限制 | (files: UploadFile[], fileList: UploadFiles) |

## Slots 插槽

| 插槽名 | 说明 |
|--------|------|
| trigger | 自定义上传按钮 |
| default | 自定义上传区域 |

## Methods 方法

| 方法名 | 说明 | 参数 |
|--------|------|------|
| submitUpload | 手动上传文件 | - |
| clearFiles | 清空文件列表 | - |
| uploadRef | 获取上传组件实例 | - |

## 使用场景示例

### 1. 员工信息导入

```vue
<template>
  <div class="employee-import">
    <el-card>
      <template #header>
        <span>员工信息导入</span>
      </template>

      <FileUpload
        v-model="fileList"
        :templates="templates"
        accept=".xlsx,.xls"
        :max-size="10 * 1024 * 1024"
        :limit="1"
        :multiple="false"
        @success="handleImportSuccess"
      />

      <div class="import-tips">
        <el-alert
          title="导入说明"
          type="info"
          :closable="false"
        >
          <template #default>
            <ul>
              <li>请先下载模板，按照模板格式填写员工信息</li>
              <li>文件大小不超过10MB</li>
              <li>支持.xlsx和.xls格式</li>
            </ul>
          </template>
        </el-alert>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import FileUpload from '@/components/FileUpload.vue'

const fileList = ref([])

const templates = [
  {
    name: '员工信息导入模板.xlsx',
    url: '/templates/employee-template.xlsx'
  }
]

const handleImportSuccess = (response: any, file: any) => {
  ElMessage.success('员工信息导入成功')
  // 处理导入逻辑
}
</script>
```

### 2. 附件管理

```vue
<template>
  <div class="attachment-manager">
    <el-card>
      <template #header>
        <span>附件管理</span>
      </template>

      <FileUpload
        v-model="attachments"
        :multiple="true"
        :drag="true"
        accept="*"
        :max-size="100 * 1024 * 1024"
        :limit="20"
      />
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import FileUpload from '@/components/FileUpload.vue'

const attachments = ref([])
</script>
```

### 3. 图片上传

```vue
<template>
  <div class="image-upload">
    <el-card>
      <template #header>
        <span>图片上传</span>
      </template>

      <FileUpload
        v-model="imageList"
        accept="image/*"
        :max-size="5 * 1024 * 1024"
        :limit="9"
        :multiple="true"
      />
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import FileUpload from '@/components/FileUpload.vue'

const imageList = ref([])
</script>
```

## 注意事项

1. **文件大小限制**：默认最大文件大小为100MB，可根据实际需求调整
2. **文件类型限制**：使用accept属性限制文件类型，支持MIME类型和文件扩展名
3. **上传地址**：确保uploadAction配置正确，或使用httpRequest自定义上传逻辑
4. **权限控制**：如果需要上传请求头，请配置uploadHeaders
5. **预览功能**：目前支持图片、PDF、视频、音频预览，其他文件类型暂不支持预览
6. **批量操作**：批量下载会逐个下载文件，浏览器可能会阻止多个下载，建议使用压缩包方式

## 最佳实践

1. **合理设置文件大小限制**：根据服务器性能和业务需求设置合适的文件大小限制
2. **提供模板下载**：对于需要导入数据的场景，提供标准模板可以减少错误
3. **友好的错误提示**：监听error事件，提供清晰的错误提示信息
4. **进度反馈**：大文件上传时，显示上传进度可以提升用户体验
5. **文件验证**：在上传前进行文件类型和大小验证，避免无效上传
6. **手动上传**：对于需要用户确认的场景，可以设置autoUpload为false，手动触发上传

## 技术支持

如有问题或建议，请联系开发团队。
