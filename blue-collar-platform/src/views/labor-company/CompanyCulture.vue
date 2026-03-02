<template>
  <div class="company-culture-container">
    <el-card class="form-card">
      <template #header>
        <div class="card-header">
          <span>企业文化介绍</span>
          <el-button type="primary" @click="handleSave" :loading="saving">
            保存
          </el-button>
        </div>
      </template>
      
      <el-form
        ref="formRef"
        :model="formData"
        :rules="formRules"
        label-width="140px"
        label-position="right"
      >
        <el-form-item label="企业文化标题" prop="title">
          <el-input
            v-model="formData.title"
            placeholder="请输入企业文化标题"
            maxlength="100"
            show-word-limit
          />
        </el-form-item>
        
        <el-form-item label="企业简称" prop="shortName">
          <el-input
            v-model="formData.shortName"
            placeholder="请输入企业简称"
            maxlength="50"
            show-word-limit
          />
        </el-form-item>
        
        <el-form-item label="企业文化内容" prop="content">
          <RichTextEditor
            v-model="formData.content"
            placeholder="请输入企业文化内容"
            :height="400"
            :auto-save="true"
            :draft-storage-key="'company-culture-draft'"
          />
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import RichTextEditor from '@/components/RichTextEditor.vue'
import { fetchCompanyCulture, saveCompanyCulture } from '@/api/companyCulture'

const formRef = ref()
const saving = ref(false)

const formData = reactive({
  title: '',
  shortName: '',
  content: ''
})

const formRules = {
  title: [
    { required: true, message: '请输入企业文化标题', trigger: 'blur' }
  ],
  shortName: [
    { required: true, message: '请输入企业简称', trigger: 'blur' }
  ],
  content: [
    { required: true, message: '请输入企业文化内容', trigger: 'blur' }
  ]
}

const fetchData = async () => {
  try {
    const response = await fetchCompanyCulture()
    if (response.code === 200 && response.data) {
      Object.assign(formData, response.data)
    }
  } catch (error) {
    console.error('获取数据失败:', error)
  }
}

const handleSave = async () => {
  if (!formRef.value) return
  
  await formRef.value.validate(async (valid: boolean) => {
    if (valid) {
      saving.value = true
      try {
        const response = await saveCompanyCulture(formData)
        if (response.code === 200) {
          ElMessage.success('保存成功')
        } else {
          ElMessage.error(response.message || '保存失败')
        }
      } catch (error) {
        console.error('保存失败:', error)
      } finally {
        saving.value = false
      }
    }
  })
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
