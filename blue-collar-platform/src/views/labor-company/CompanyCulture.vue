<template>
  <div class="form-container">
    <div class="form-content">
      <el-card class="form-card">
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
              :height="'400px'"
              :min-height="'300px'"
              :placeholder="'请输入企业文化内容'"
            />
          </el-form-item>
        </el-form>
      </el-card>
    </div>
    
    <!-- 底部按钮栏 -->
    <div class="form-footer">
      <el-button type="primary" @click="handleSave" :loading="saving">
        保存
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { fetchCompanyCulture, saveCompanyCulture } from '@/api/companyCulture'
import RichTextEditor from '@/components/RichTextEditor.vue'

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
/* 表单页容器 - 使用flex布局实现内部滚动 */
.form-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #f5f7fa;
}

/* 内容区域 - 垂直滚动 */
.form-content {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  padding-bottom: 80px; /* 为底部按钮栏留出空间 */
}

.form-card {
  max-width: 1200px;
  margin: 0 auto;
  padding: 16px;
}

/* 底部按钮栏 - 固定悬浮 */
.form-footer {
  position: fixed;
  bottom: 0;
  left: var(--sidebar-width);
  right: 0;
  display: flex;
  justify-content: center;
  gap: 12px;
  padding: 16px;
  background-color: #f5f7fa;
  border-top: 1px solid #e4e7ed;
  z-index: 100;
  transition: left var(--transition-base);
}

/* 响应式适配 */
@media screen and (max-width: 768px) {
  .form-footer {
    left: 0;
    flex-direction: column;
  }
  
  .form-footer .el-button {
    width: 100%;
  }
  
  .form-content {
    padding-bottom: 120px; /* 为垂直排列的按钮栏留出更多空间 */
  }
  
  .form-card {
    max-width: 100%;
  }
  
  :deep(.el-form) {
    label-width: 100px !important;
  }
}
</style>