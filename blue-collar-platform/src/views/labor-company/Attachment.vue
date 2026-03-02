<template>
  <div class="attachment">
    <h1>附件管理</h1>
    <el-card>
      <el-upload
        class="upload-demo"
        action="#"
        :auto-upload="false"
        :on-change="handleChange"
        :file-list="fileList"
      >
        <el-button type="primary">上传附件</el-button>
        <template #tip>
          <div class="el-upload__tip">
            支持上传图片、文档等多种类型的文件
          </div>
        </template>
      </el-upload>
      <el-table :data="fileList" style="margin-top: 20px;">
        <el-table-column prop="name" label="文件名称" />
        <el-table-column prop="size" label="文件大小" width="120">
          <template #default="scope">
            {{ formatSize(scope.row.size) }}
          </template>
        </el-table-column>
        <el-table-column prop="type" label="文件类型" width="120" />
        <el-table-column label="操作" width="150">
          <template #default="scope">
            <el-button type="primary" size="small">下载</el-button>
            <el-button type="danger" size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'

const fileList = ref([
  { name: '企业文化.docx', size: 102400, type: '文档' },
  { name: '公司logo.png', size: 51200, type: '图片' }
])

const handleChange = (file) => {
  fileList.value.push({
    name: file.name,
    size: file.size,
    type: file.type
  })
  ElMessage.success('文件上传成功')
}

const formatSize = (size) => {
  if (size < 1024) {
    return size + ' B'
  } else if (size < 1024 * 1024) {
    return (size / 1024).toFixed(2) + ' KB'
  } else {
    return (size / (1024 * 1024)).toFixed(2) + ' MB'
  }
}
</script>

<style scoped>
.attachment {
  padding: 20px;
}

h1 {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 20px;
  color: #303133;
}
</style>