# FileUpload 组件快速入门

## 快速开始

### 1. 基础使用（3步上手）

```vue
<template>
  <!-- 第一步：引入组件 -->
  <FileUpload v-model="files" />
</template>

<script setup lang="ts">
// 第二步：导入组件
import { ref } from 'vue'
import FileUpload from '@/components/FileUpload.vue'

// 第三步：定义数据
const files = ref([])
</script>
```

### 2. 常用配置（5分钟掌握）

```vue
<template>
  <FileUpload
    v-model="files"
    :drag="true"                    <!-- 支持拖拽 -->
    :multiple="true"                <!-- 支持多选 -->
    :limit="10"                      <!-- 最多10个文件 -->
    accept=".jpg,.png,.pdf"          <!-- 只允许这些类型 -->
    :max-size="10 * 1024 * 1024"    <!-- 最大10MB -->
  />
</template>
```

### 3. 模板下载（导入场景必备）

```vue
<template>
  <FileUpload
    v-model="files"
    :templates="[
      { name: '员工模板.xlsx', url: '/templates/employee.xlsx' },
      { name: '工资模板.xlsx', url: '/templates/salary.xlsx' }
    ]"
  />
</template>
```

## 常见场景

### 场景1：员工信息导入

```vue
<template>
  <el-card title="员工信息导入">
    <FileUpload
      v-model="files"
      :templates="[{ name: '员工模板.xlsx', url: '/templates/employee.xlsx' }]"
      accept=".xlsx,.xls"
      :limit="1"
      :max-size="10 * 1024 * 1024"
      @success="handleSuccess"
    />
  </el-card>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import FileUpload from '@/components/FileUpload.vue'

const files = ref([])

const handleSuccess = (response: any) => {
  ElMessage.success('导入成功')
  // 处理导入逻辑
}
</script>
```

### 场景2：附件管理

```vue
<template>
  <el-card title="附件管理">
    <FileUpload
      v-model="attachments"
      :drag="true"
      :multiple="true"
      :limit="20"
    />
  </el-card>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import FileUpload from '@/components/FileUpload.vue'

const attachments = ref([])
</script>
```

### 场景3：图片上传

```vue
<template>
  <el-card title="图片上传">
    <FileUpload
      v-model="images"
      accept="image/*"
      :limit="9"
      :max-size="5 * 1024 * 1024"
    />
  </el-card>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import FileUpload from '@/components/FileUpload.vue'

const images = ref([])
</script>
```

## 核心功能速查

### 文件类型限制

```vue
<!-- 只允许图片 -->
<FileUpload accept="image/*" />

<!-- 只允许PDF -->
<FileUpload accept=".pdf" />

<!-- 允许多种类型 -->
<FileUpload accept=".jpg,.png,.pdf,.doc,.docx" />

<!-- 允许所有类型 -->
<FileUpload accept="*" />
```

### 文件大小限制

```vue
<!-- 5MB -->
<FileUpload :max-size="5 * 1024 * 1024" />

<!-- 10MB -->
<FileUpload :max-size="10 * 1024 * 1024" />

<!-- 100MB -->
<FileUpload :max-size="100 * 1024 * 1024" />
```

### 上传数量限制

```vue
<!-- 单文件 -->
<FileUpload :multiple="false" :limit="1" />

<!-- 最多5个 -->
<FileUpload :limit="5" />

<!-- 最多10个 -->
<FileUpload :limit="10" />
```

### 上传方式

```vue
<!-- 拖拽上传 -->
<FileUpload :drag="true" />

<!-- 按钮上传 -->
<FileUpload :drag="false" />

<!-- 自动上传 -->
<FileUpload :auto-upload="true" />

<!-- 手动上传 -->
<FileUpload :auto-upload="false" ref="uploadRef" />
<el-button @click="uploadRef?.submitUpload()">开始上传</el-button>
```

## 事件处理

### 监听上传成功

```vue
<FileUpload
  v-model="files"
  @success="handleSuccess"
/>

<script setup>
const handleSuccess = (response, file, fileList) => {
  console.log('上传成功', response)
  // 处理成功逻辑
}
</script>
```

### 监听上传失败

```vue
<FileUpload
  v-model="files"
  @error="handleError"
/>

<script setup>
const handleError = (error, file, fileList) => {
  console.error('上传失败', error)
  // 处理失败逻辑
}
</script>
```

### 监听文件删除

```vue
<FileUpload
  v-model="files"
  @remove="handleRemove"
/>

<script setup>
const handleRemove = (file, fileList) => {
  console.log('删除文件', file)
  // 处理删除逻辑
}
</script>
```

## 自定义上传

### 自定义上传请求

```vue
<FileUpload
  v-model="files"
  :http-request="customUpload"
/>

<script setup>
const customUpload = async ({ file, onProgress, onSuccess, onError }) => {
  try {
    // 使用axios上传
    const formData = new FormData()
    formData.append('file', file)

    const response = await axios.post('/api/upload', formData, {
      onUploadProgress: (progressEvent) => {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        )
        onProgress({ percent: percentCompleted }, file)
      }
    })

    onSuccess(response.data, file)
  } catch (error) {
    onError(error, file)
  }
}
</script>
```

### 自定义上传按钮

```vue
<FileUpload v-model="files">
  <template #trigger>
    <el-button type="success">
      <el-icon><Upload /></el-icon>
      选择文件
    </el-button>
  </template>
</FileUpload>
```

## 常见问题

### Q1: 如何限制只能上传图片？

```vue
<FileUpload accept="image/*" />
```

### Q2: 如何设置最大文件大小为10MB？

```vue
<FileUpload :max-size="10 * 1024 * 1024" />
```

### Q3: 如何实现单文件上传？

```vue
<FileUpload :multiple="false" :limit="1" />
```

### Q4: 如何禁用上传功能？

```vue
<FileUpload :disabled="true" />
```

### Q5: 如何隐藏文件列表？

```vue
<FileUpload :show-file-list="false" />
```

### Q6: 如何手动触发上传？

```vue
<FileUpload :auto-upload="false" ref="uploadRef" />
<el-button @click="uploadRef?.submitUpload()">开始上传</el-button>
```

### Q7: 如何清空文件列表？

```vue
<FileUpload ref="uploadRef" />
<el-button @click="uploadRef?.clearFiles()">清空文件</el-button>
```

## 最佳实践

### 1. 导入场景

```vue
<FileUpload
  v-model="files"
  :templates="[{ name: '模板.xlsx', url: '/template.xlsx' }]"
  accept=".xlsx,.xls"
  :limit="1"
  :max-size="10 * 1024 * 1024"
  @success="handleImport"
/>
```

### 2. 附件管理

```vue
<FileUpload
  v-model="attachments"
  :drag="true"
  :multiple="true"
  :limit="20"
  :max-size="100 * 1024 * 1024"
/>
```

### 3. 图片上传

```vue
<FileUpload
  v-model="images"
  accept="image/*"
  :limit="9"
  :max-size="5 * 1024 * 1024"
/>
```

### 4. 文档上传

```vue
<FileUpload
  v-model="documents"
  accept=".pdf,.doc,.docx"
  :max-size="20 * 1024 * 1024"
/>
```

## 快速参考

### Props速查表

| 参数 | 默认值 | 说明 |
|------|--------|------|
| multiple | true | 是否多选 |
| drag | true | 是否拖拽 |
| limit | 10 | 最大数量 |
| maxSize | 100MB | 最大大小 |
| accept | * | 文件类型 |
| autoUpload | true | 自动上传 |
| showFileList | true | 显示列表 |

### Events速查表

| 事件 | 说明 |
|------|------|
| success | 上传成功 |
| error | 上传失败 |
| change | 状态变化 |
| remove | 删除文件 |
| preview | 预览文件 |

### Methods速查表

| 方法 | 说明 |
|------|------|
| submitUpload | 手动上传 |
| clearFiles | 清空列表 |

## 下一步

- 查看 [完整使用指南](./FileUpload-Usage.md) 了解更多细节
- 查看 [组件源码](./FileUpload.vue) 了解实现原理
- 查看项目中的实际使用案例

## 技术支持

如有问题，请联系开发团队。
