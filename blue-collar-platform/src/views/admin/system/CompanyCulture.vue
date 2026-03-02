<template>
  <div class="company-culture-container">
    <!-- 表单 -->
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

// 表单引用
const formRef = ref()

// 保存状态
const saving = ref(false)

// 表单数据
const formData = reactive({
  title: '',
  shortName: '',
  content: ''
})

// 表单验证规则
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

// 获取数据
const fetchData = async () => {
  // 模拟获取数据
  setTimeout(() => {
    formData.title = '诚信、创新、共赢'
    formData.shortName = '蓝领智汇'
    formData.content = '<p>蓝领智汇是一家专注于蓝领人力资源服务的创新型企业。我们致力于为广大蓝领工人提供优质的就业机会和全方位的职业发展支持。</p><p>公司秉承"诚信为本、创新驱动、合作共赢"的经营理念，通过数字化手段重塑蓝领人力资源服务行业，为用工企业、劳务公司和蓝领工人搭建高效、透明的沟通桥梁。</p><p>我们的使命是：让每一位蓝领工人都能找到理想的工作，让每一家企业都能找到合适的人才。</p>'
  }, 300)
}

// 保存
const handleSave = async () => {
  if (!formRef.value) return
  
  await formRef.value.validate(async (valid: boolean) => {
    if (valid) {
      saving.value = true
      try {
        // 模拟保存
        await new Promise(resolve => setTimeout(resolve, 1000))
        ElMessage.success('保存成功')
      } catch (error) {
        ElMessage.error('保存失败')
      } finally {
        saving.value = false
      }
    }
  })
}

// 初始化
onMounted(() => {
  fetchData()
})
</script>

<style scoped>
.company-culture-container {
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
}

.form-card {
  max-width: 900px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 600;
  font-size: 16px;
}

/* 响应式设计 */
@media screen and (max-width: 768px) {
  .company-culture-container {
    padding: 16px;
  }
  
  :deep(.el-form-item__label) {
    width: 100px !important;
  }
  
  :deep(.el-form-item__content) {
    margin-left: 100px !important;
  }
}
</style>
