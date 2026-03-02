<template>
  <div class="company-culture-container">
    <el-card class="form-card">
      <template #header>
        <div class="card-header">
          <span>企业文化介绍</span>
        </div>
      </template>
      
      <el-form
        ref="formRef"
        :model="formData"
        label-width="140px"
        label-position="right"
      >
        <el-form-item label="企业文化标题">
          <div class="field-value">{{ formData.title || '-' }}</div>
        </el-form-item>
        
        <el-form-item label="企业简称">
          <div class="field-value">{{ formData.shortName || '-' }}</div>
        </el-form-item>
        
        <el-form-item label="企业文化内容">
          <div class="field-value rich-content" v-html="formData.content"></div>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { fetchCompanyCulture } from '@/api/companyCulture'

const loading = ref(false)

const formData = reactive({
  title: '',
  shortName: '',
  content: ''
})

const fetchData = async () => {
  loading.value = true
  try {
    const response = await fetchCompanyCulture()
    if (response.code === 200) {
      Object.assign(formData, response.data)
    }
  } catch (error) {
    ElMessage.error('获取数据失败')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchData()
})
</script>

<style scoped>
.company-culture-container {
  padding: 20px;
}

.form-card {
  max-width: 1200px;
  margin: 0 auto;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-header span {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
}

.field-value {
  padding: 8px 0;
  color: #606266;
  line-height: 1.6;
}

.rich-content {
  min-height: 200px;
  padding: 16px;
  background-color: #f5f7fa;
  border-radius: 4px;
}

.rich-content :deep(p) {
  margin: 8px 0;
}

.rich-content :deep(img) {
  max-width: 100%;
  height: auto;
}

.rich-content :deep(table) {
  border-collapse: collapse;
  width: 100%;
  margin: 8px 0;
}

.rich-content :deep(table td),
.rich-content :deep(table th) {
  border: 1px solid #ddd;
  padding: 8px;
  min-width: 50px;
}

@media screen and (max-width: 768px) {
  .company-culture-container {
    padding: 12px;
  }

  .form-card {
    max-width: 100%;
  }

  :deep(.el-form) {
    label-width: 100px !important;
  }
}
</style>
