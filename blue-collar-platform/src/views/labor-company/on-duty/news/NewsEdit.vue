<template>
  <div class="news-edit">
    <div class="edit-content">
      <!-- 表单 -->
      <el-card class="edit-card" shadow="never">
        <template #header>
          <div class="card-header">
            <span>{{ isEdit ? '编辑资讯' : '新增资讯' }}</span>
          </div>
        </template>
        <el-form ref="formRef" :model="formData" :rules="formRules" label-width="120px">
          <el-form-item label="资讯标题" prop="title">
            <el-input v-model="formData.title" placeholder="请输入资讯标题" />
          </el-form-item>
          <el-form-item label="资讯类型" prop="newsType">
            <el-select v-model="formData.newsType" placeholder="请选择资讯类型">
              <el-option label="技能提升" value="skill" />
              <el-option label="学历提升" value="education" />
              <el-option label="岗位介绍" value="job" />
              <el-option label="其他资讯" value="other" />
            </el-select>
          </el-form-item>
          <el-form-item label="资讯摘要" prop="summary">
            <el-input
              v-model="formData.summary"
              type="textarea"
              :rows="2"
              placeholder="请输入资讯摘要"
            />
          </el-form-item>
          <el-form-item label="资讯内容" prop="content">
            <RichTextEditor v-model="formData.content" :height="'350px'" />
          </el-form-item>
        </el-form>
      </el-card>
    </div>

    <!-- 底部按钮栏 -->
    <div class="edit-footer">
      <el-button @click="goBack">
        <el-icon><ArrowLeft /></el-icon>
        返回
      </el-button>
      <el-button type="primary" @click="handleSubmitForm" :loading="submitLoading">
        <el-icon><Check /></el-icon>
        保存
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { ArrowLeft, Check } from '@element-plus/icons-vue'
import { useRoute, useRouter } from 'vue-router'
import RichTextEditor from '@/components/RichTextEditor.vue'
import type { FormInstance, FormRules } from 'element-plus'

// 类型定义
interface NewsRecord {
  id: string
  title: string
  newsType: 'skill' | 'education' | 'job' | 'other'
  summary: string
  content: string
  status: 'published' | 'unpublished'
  publishTime?: string
  createTime: string
}

// 响应式数据
const route = useRoute()
const router = useRouter()
const formRef = ref<FormInstance>()
const submitLoading = ref(false)
const isEdit = ref(false)

// 表单数据
const formData = ref({
  title: '',
  newsType: '' as NewsRecord['newsType'] | '',
  summary: '',
  content: ''
})

// 表单验证规则
const formRules: FormRules = {
  title: [{ required: true, message: '请输入资讯标题', trigger: 'blur' }],
  newsType: [{ required: true, message: '请选择资讯类型', trigger: 'change' }],
  summary: [{ required: true, message: '请输入资讯摘要', trigger: 'blur' }],
  content: [{ required: true, message: '请输入资讯内容', trigger: 'blur' }]
}

// 模拟数据存储
const allData = ref<NewsRecord[]>([])

// 生成模拟数据
const generateMockData = (): NewsRecord[] => {
  const titles = [
    '电工技能提升培训课程',
    '焊工实操技能训练',
    '数控机床操作指南',
    '叉车驾驶技能培训',
    '安全生产知识讲座',
    '职业健康防护指南',
    '最新岗位招聘信息',
    '工厂普工岗位介绍',
    '技术工种薪资待遇分析',
    '如何提升职业技能',
    '成人高考学历提升指南',
    '网络教育学历提升',
    '技能证书考取指南',
    '职业发展规划建议',
    '工厂生活指南'
  ]
  const summaries = [
    '提供专业的技能培训，帮助工人提升职业技能水平',
    '系统化的培训课程，让学员快速掌握实用技能',
    '理论与实践相结合，提升实际操作能力',
    '专业的师资团队，提供一对一指导服务',
    '最新岗位信息，待遇优厚，福利完善'
  ]
  const types: NewsRecord['newsType'][] = ['skill', 'education', 'job', 'other']
  const statuses: NewsRecord['status'][] = ['published', 'unpublished']
  const data: NewsRecord[] = []

  for (let i = 0; i < 30; i++) {
    const newsType = types[Math.floor(Math.random() * types.length)]
    const status = statuses[Math.floor(Math.random() * statuses.length)]
    const createTime = new Date()
    createTime.setDate(createTime.getDate() - Math.floor(Math.random() * 30))
    const publishTime = status === 'published' ? new Date(createTime.getTime() + 86400000) : undefined

    data.push({
      id: `NEWS${String(i + 1).padStart(6, '0')}`,
      title: titles[i % titles.length] + (i >= titles.length ? ` ${Math.floor(i / titles.length) + 1}` : ''),
      newsType,
      summary: summaries[i % summaries.length],
      content: `<h2>${titles[i % titles.length]}</h2><p>${summaries[i % summaries.length]}</p><p>详细内容...</p>`,
      status,
      publishTime: publishTime ? publishTime.toISOString() : undefined,
      createTime: createTime.toISOString()
    })
  }

  return data
}

// 加载表单数据
const loadFormData = async () => {
  const id = route.params.id as string
  if (id) {
    isEdit.value = true
    
    // 生成模拟数据
    allData.value = generateMockData()
    
    // 查找对应ID的数据
    const newsRecord = allData.value.find(item => item.id === id)
    if (newsRecord) {
      formData.value = {
        title: newsRecord.title,
        newsType: newsRecord.newsType,
        summary: newsRecord.summary,
        content: newsRecord.content
      }
    } else {
      ElMessage.error('资讯不存在')
      router.back()
    }
  } else {
    isEdit.value = false
    // 新增模式，清空表单
    formData.value = {
      title: '',
      newsType: '',
      summary: '',
      content: ''
    }
  }
}

// 提交表单
const handleSubmitForm = async () => {
  if (!formRef.value) return

  await formRef.value.validate()

  submitLoading.value = true

  try {
    // 生成模拟数据
    if (allData.value.length === 0) {
      allData.value = generateMockData()
    }

    if (isEdit.value) {
      // 编辑
      const id = route.params.id as string
      const index = allData.value.findIndex(item => item.id === id)
      if (index > -1) {
        allData.value[index] = {
          ...allData.value[index],
          title: formData.value.title,
          newsType: formData.value.newsType as NewsRecord['newsType'],
          summary: formData.value.summary,
          content: formData.value.content
        }
      }
      ElMessage.success('修改成功')
    } else {
      // 新增
      const newRecord: NewsRecord = {
        id: `NEWS${Date.now()}`,
        title: formData.value.title,
        newsType: formData.value.newsType as NewsRecord['newsType'],
        summary: formData.value.summary,
        content: formData.value.content,
        status: 'unpublished',
        createTime: new Date().toISOString()
      }
      allData.value.unshift(newRecord)
      ElMessage.success('新增成功')
    }

    router.push('/tenant/on-duty/news')
  } finally {
    submitLoading.value = false
  }
}

// 返回
const goBack = () => {
  router.back()
}

// 生命周期
onMounted(() => {
  loadFormData()
})
</script>

<style scoped>
.news-edit {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #f5f7fa;
}

.edit-content {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  padding-bottom: 80px;
}

.edit-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 600;
}

.edit-footer {
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
  .edit-footer {
    left: 0;
    flex-direction: column;
  }
  
  .edit-footer .el-button {
    width: 100%;
  }
  
  .edit-content {
    padding-bottom: 120px;
  }
}
</style>