<!-- 学习材料表单页面 -->
<template>
  <div class="learning-material-form">
    <div class="form-container">
      <!-- 内容区域 -->
      <div class="form-content">
        <el-card shadow="hover">
          <el-form ref="formRef" :model="formData" :rules="formRules" label-width="120px">
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="学习材料标题" prop="title">
                  <el-input v-model="formData.title" placeholder="请输入学习材料标题" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="学习材料类型" prop="materialType">
                  <el-select v-model="formData.materialType" placeholder="请选择类型" style="width: 100%">
                    <el-option label="岗前培训" value="pre_job" />
                    <el-option label="日常培训" value="daily" />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-form-item label="学习材料摘要" prop="summary">
              <el-input v-model="formData.summary" type="textarea" :rows="3" placeholder="请输入学习材料摘要" />
            </el-form-item>
            <el-form-item label="学习材料内容" prop="content">
              <RichTextEditor v-model="formData.content" placeholder="请输入学习材料内容" />
            </el-form-item>
          </el-form>
        </el-card>
      </div>
      
      <!-- 底部按钮栏 -->
      <div class="form-footer">
        <el-button @click="goBack">
          <el-icon><ArrowLeft /></el-icon>
          返回
        </el-button>
        <el-button type="primary" @click="handleSubmit" :loading="submitLoading">
          <el-icon><Check /></el-icon>
          保存
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { ArrowLeft, Check } from '@element-plus/icons-vue'
import type { FormInstance, FormRules } from 'element-plus'
import { useRoute, useRouter } from 'vue-router'
import RichTextEditor from '@/components/RichTextEditor.vue'

// 类型定义
interface LearningMaterial {
  id: string
  title: string
  materialType: 'pre_job' | 'daily'
  summary: string
  content: string
  publishStatus: 'published' | 'unpublished'
  createTime: string
}

const router = useRouter()
const route = useRoute()

// 响应式数据
const submitLoading = ref(false)
const formRef = ref<FormInstance>()

const formData = reactive<LearningMaterial>({
  id: '',
  title: '',
  materialType: 'pre_job',
  summary: '',
  content: '',
  publishStatus: 'unpublished',
  createTime: ''
})

const formRules: FormRules = {
  title: [{ required: true, message: '请输入学习材料标题', trigger: 'blur' }],
  materialType: [{ required: true, message: '请选择学习材料类型', trigger: 'change' }],
  summary: [{ required: true, message: '请输入学习材料摘要', trigger: 'blur' }],
  content: [{ required: true, message: '请输入学习材料内容', trigger: 'blur' }]
}

// Mock数据
const mockData: LearningMaterial[] = [
  {
    id: '1',
    title: '安全生产基础知识',
    materialType: 'pre_job',
    summary: '本课程主要介绍安全生产的基本概念、基本原则和基本要求',
    content: '<h2>安全生产基础知识</h2><p>安全生产是指在生产过程中采取必要的措施，消除或控制危险有害因素，保障人身安全健康、设备设施免受损坏、生产活动正常进行。</p><h3>安全生产的基本原则</h3><ul><li>安全第一</li><li>预防为主</li><li>综合治理</li></ul>',
    publishStatus: 'published',
    createTime: '2024-01-15 10:00:00'
  },
  {
    id: '2',
    title: '岗位操作规程',
    materialType: 'pre_job',
    summary: '详细介绍各岗位的操作规程和注意事项',
    content: '<h2>岗位操作规程</h2><p>岗位操作规程是工人从事生产作业的基本准则，必须严格遵守。</p>',
    publishStatus: 'published',
    createTime: '2024-01-20 14:30:00'
  },
  {
    id: '3',
    title: '消防知识培训',
    materialType: 'daily',
    summary: '消防知识普及和火灾应对方法',
    content: '<h2>消防知识培训</h2><p>学习消防知识，提高火灾防范意识。</p>',
    publishStatus: 'unpublished',
    createTime: '2024-02-01 09:00:00'
  },
  {
    id: '4',
    title: '职业健康防护',
    materialType: 'daily',
    summary: '职业健康防护知识和个人防护用品使用',
    content: '<h2>职业健康防护</h2><p>了解职业病危害，掌握防护措施。</p>',
    publishStatus: 'published',
    createTime: '2024-02-05 16:00:00'
  }
]

// 加载数据
const loadData = () => {
  const id = route.params.id as string
  if (id) {
    const item = mockData.find(item => item.id === id)
    if (item) {
      Object.assign(formData, item)
    }
  }
}

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return
  await formRef.value.validate((valid) => {
    if (valid) {
      submitLoading.value = true
      setTimeout(() => {
        if (formData.id) {
          // 编辑
          const index = mockData.findIndex(item => item.id === formData.id)
          if (index > -1) {
            mockData[index] = { ...formData }
          }
          ElMessage.success('编辑成功')
        } else {
          // 新增
          mockData.unshift({
            ...formData,
            id: Date.now().toString(),
            createTime: new Date().toLocaleString()
          })
          ElMessage.success('新增成功')
        }
        submitLoading.value = false
        router.push('/tenant/on-duty/learning-material')
      }, 500)
    }
  })
}

// 返回
const goBack = () => {
  router.push('/tenant/on-duty/learning-material')
}

// 生命周期
onMounted(() => {
  loadData()
})
</script>

<style scoped>
.learning-material-form {
  width: 100%;
  height: 100%;
}

.form-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #f5f7fa;
}

.form-content {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  padding-bottom: 80px;
}

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
    padding-bottom: 120px;
  }
}
</style>