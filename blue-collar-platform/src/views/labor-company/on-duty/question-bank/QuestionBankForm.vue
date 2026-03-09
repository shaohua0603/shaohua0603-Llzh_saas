<!-- 题库表单页面 -->
<template>
  <div class="question-bank-form">
    <div class="form-container">
      <!-- 内容区域 -->
      <div class="form-content">
        <el-card shadow="hover">
          <el-form ref="formRef" :model="formData" :rules="formRules" label-width="120px">
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="题库类型" prop="questionType">
                  <el-select v-model="formData.questionType" placeholder="请选择题库类型" style="width: 100%">
                    <el-option label="岗前培训" value="pre_job" />
                    <el-option label="日常培训" value="daily" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="答题类型" prop="answerType">
                  <el-select v-model="formData.answerType" placeholder="请选择答题类型" style="width: 100%">
                    <el-option label="单选题" value="single" />
                    <el-option label="多选题" value="multiple" />
                    <el-option label="判断题" value="true_false" />
                    <el-option label="填空题" value="fill" />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-form-item label="题干" prop="question">
              <el-input v-model="formData.question" type="textarea" :rows="3" placeholder="请输入题干" />
            </el-form-item>
            <el-form-item label="题库内容" prop="content">
              <RichTextEditor v-model="formData.content" placeholder="请输入题库内容（如选项等）" />
            </el-form-item>
            <el-form-item label="正确答案" prop="correctAnswer">
              <el-input v-model="formData.correctAnswer" type="textarea" :rows="2" placeholder="请输入正确答案，多个答案用逗号分隔" />
            </el-form-item>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="分值" prop="score">
                  <el-input-number v-model="formData.score" :min="1" :max="100" style="width: 100%" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="解析" prop="analysis">
                  <el-input v-model="formData.analysis" type="textarea" :rows="2" placeholder="请输入解析" />
                </el-form-item>
              </el-col>
            </el-row>
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
interface QuestionBank {
  id: string
  questionType: 'pre_job' | 'daily'
  answerType: 'single' | 'multiple' | 'true_false' | 'fill'
  question: string
  content: string
  correctAnswer: string
  score: number
  analysis: string
  publishStatus: 'published' | 'unpublished'
  createTime: string
}

const router = useRouter()
const route = useRoute()

// 响应式数据
const submitLoading = ref(false)
const formRef = ref<FormInstance>()

const formData = reactive<QuestionBank>({
  id: '',
  questionType: 'pre_job',
  answerType: 'single',
  question: '',
  content: '',
  correctAnswer: '',
  score: 5,
  analysis: '',
  publishStatus: 'unpublished',
  createTime: ''
})

const formRules: FormRules = {
  questionType: [{ required: true, message: '请选择题库类型', trigger: 'change' }],
  answerType: [{ required: true, message: '请选择答题类型', trigger: 'change' }],
  question: [{ required: true, message: '请输入题干', trigger: 'blur' }],
  correctAnswer: [{ required: true, message: '请输入正确答案', trigger: 'blur' }],
  score: [{ required: true, message: '请输入分值', trigger: 'blur' }]
}

// Mock数据
const mockData: QuestionBank[] = [
  {
    id: '1',
    questionType: 'pre_job',
    answerType: 'single',
    question: '安全生产中的"三违"是指什么？',
    content: '<p>A. 违章指挥、违章操作、违反劳动纪律</p><p>B. 违章作业、违反规定、违反制度</p><p>C. 违法、违规、违纪</p><p>D. 违规操作、违章建设、违抗命令</p>',
    correctAnswer: 'A',
    score: 5,
    analysis: '"三违"是指违章指挥、违章操作、违反劳动纪律，是安全生产中的常见违规行为。',
    publishStatus: 'published',
    createTime: '2024-01-15 10:00:00'
  },
  {
    id: '2',
    questionType: 'pre_job',
    answerType: 'multiple',
    question: '以下哪些属于个人防护用品？',
    content: '<p>A. 安全帽</p><p>B. 防护手套</p><p>C. 工作服</p><p>D. 防护眼镜</p>',
    correctAnswer: 'A,B,D',
    score: 5,
    analysis: '个人防护用品包括安全帽、防护手套、防护眼镜、安全鞋等，工作服属于一般工作服装。',
    publishStatus: 'published',
    createTime: '2024-01-20 14:30:00'
  },
  {
    id: '3',
    questionType: 'daily',
    answerType: 'true_false',
    question: '发现火灾时，应该首先拨打119报警。',
    content: '<p>正确</p><p>错误</p>',
    correctAnswer: '正确',
    score: 3,
    analysis: '发现火灾时应首先拨打119报警，同时尽量扑灭初期火灾。',
    publishStatus: 'published',
    createTime: '2024-02-01 09:00:00'
  },
  {
    id: '4',
    questionType: 'pre_job',
    answerType: 'fill',
    question: '安全操作规程的"四懂"包括：懂原理、懂性能、懂___、懂___。',
    content: '',
    correctAnswer: '懂结构、懂工艺',
    score: 10,
    analysis: '安全操作规程的"四懂"是懂原理、懂性能、懂结构、懂工艺。',
    publishStatus: 'unpublished',
    createTime: '2024-02-05 16:00:00'
  },
  {
    id: '5',
    questionType: 'daily',
    answerType: 'single',
    question: '下列哪种灭火器适用于电气火灾？',
    content: '<p>A. 泡沫灭火器</p><p>B. 干粉灭火器</p><p>C. 水基型灭火器</p><p>D. 清水灭火器</p>',
    correctAnswer: 'B',
    score: 5,
    analysis: '干粉灭火器适用于电气火灾，泡沫和水基型灭火器可能引起触电危险。',
    publishStatus: 'published',
    createTime: '2024-02-10 11:00:00'
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
        router.push('/tenant/on-duty/question-bank')
      }, 500)
    }
  })
}

// 返回
const goBack = () => {
  router.push('/tenant/on-duty/question-bank')
}

// 生命周期
onMounted(() => {
  loadData()
})
</script>

<style scoped>
.question-bank-form {
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