<template>
  <div class="factory-interview-form-container">
    <el-card class="form-card" shadow="never">
      <CommonForm
        ref="formRef"
        v-model="formData"
        :config="formConfig"
        :loading="loading"
        @submit="handleSubmit"
        @reset="handleReset"
      />
    </el-card>

    <!-- 面试人员清单 -->
    <el-card class="candidate-card" shadow="never">
      <template #header>
        <div class="card-header">
          <span>面试人员清单</span>
          <el-button type="primary" size="small" @click="handleAddCandidate">
            <el-icon><Plus /></el-icon>
            添加人员
          </el-button>
        </div>
      </template>
      <el-table :data="candidateList" border>
        <el-table-column type="index" label="序号" width="60" />
        <el-table-column prop="isReturnWorker" label="是否返厂员工" width="120">
          <template #default="{ row }">
            <el-tag :type="row.isReturnWorker ? 'success' : 'info'">
              {{ row.isReturnWorker ? '是' : '否' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="姓名" width="100" />
        <el-table-column prop="phone" label="手机号" width="120" />
        <el-table-column prop="age" label="年龄" width="80" />
        <el-table-column prop="gender" label="性别" width="80" />
        <el-table-column prop="recommendationLevel" label="推荐等级" width="100">
          <template #default="{ row }">
            <el-tag :type="getRecommendationLevelType(row.recommendationLevel)">
              {{ row.recommendationLevel }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="imageLevel" label="形象" width="100">
          <template #default="{ row }">
            <el-tag :type="getImageLevelType(row.imageLevel)">
              {{ row.imageLevel }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="education" label="学历" width="100" />
        <el-table-column prop="positionCategory" label="岗位类别" width="120" />
        <el-table-column prop="expectedLocation" label="期望工作地址" width="150" />
        <el-table-column prop="recommendationReason" label="推荐理由" width="200" />
        <el-table-column label="操作" width="150" align="center" fixed="right">
          <template #default="{ row, $index }">
            <el-button type="primary" link size="small" @click="handleEditCandidate(row, $index)">
              编辑
            </el-button>
            <el-button type="danger" link size="small" @click="handleDeleteCandidate($index)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 面试人员对话框 -->
    <el-dialog v-model="candidateVisible" :title="candidateTitle" width="800px" :close-on-click-modal="false">
      <el-form :model="candidateForm" label-width="120px">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="是否返厂员工">
              <el-switch v-model="candidateForm.isReturnWorker" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="姓名" required>
              <el-input v-model="candidateForm.name" placeholder="请输入姓名" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="手机号" required>
              <el-input v-model="candidateForm.phone" placeholder="请输入手机号" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="年龄" required>
              <el-input-number v-model="candidateForm.age" :min="18" :max="60" style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="性别" required>
              <el-select v-model="candidateForm.gender" placeholder="请选择性别" style="width: 100%">
                <el-option label="男" value="男" />
                <el-option label="女" value="女" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="推荐等级">
              <el-select v-model="candidateForm.recommendationLevel" placeholder="请选择等级" style="width: 100%">
                <el-option label="优先推荐" value="优先推荐" />
                <el-option label="一般" value="一般" />
                <el-option label="不建议" value="不建议" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="形象">
              <el-select v-model="candidateForm.imageLevel" placeholder="请选择级别" style="width: 100%">
                <el-option label="优秀" value="优秀" />
                <el-option label="一般" value="一般" />
                <el-option label="其他" value="其他" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="学历">
              <el-select v-model="candidateForm.education" placeholder="请选择学历" style="width: 100%">
                <el-option label="初中" value="初中" />
                <el-option label="高中" value="高中" />
                <el-option label="中专" value="中专" />
                <el-option label="大专" value="大专" />
                <el-option label="本科" value="本科" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="岗位类别">
              <el-input v-model="candidateForm.positionCategory" placeholder="请输入岗位类别" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="期望工作地址">
              <el-input v-model="candidateForm.expectedLocation" placeholder="请输入期望工作地址" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="推荐理由">
              <el-input
                v-model="candidateForm.recommendationReason"
                type="textarea"
                :rows="3"
                placeholder="请输入推荐理由"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <el-button @click="candidateVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSaveCandidate">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import CommonForm from '../../../components/CommonForm.vue'
import type { FormConfig } from '../../types/common-form'

// 路由实例
const router = useRouter()
const route = useRoute()

// 表单引用
const formRef = ref()

// 是否编辑模式
const isEdit = computed(() => !!route.params.id)

// 加载状态
const loading = ref(false)

// 表单数据
const formData = ref({
  laborCompany: '',
  socialCreditCode: '',
  manager: '',
  managerPhone: '',
  factoryManager: '',
  factoryManagerPhone: '',
  clerk: '',
  clerkPhone: '',
  interviewTime: '',
  interviewLocation: '',
  factoryContact: '',
  factoryContactPhone: ''
})

// 表单配置
const formConfig: FormConfig = {
  fields: [
    {
      field: 'laborCompany',
      label: '发出邀约的劳务公司',
      type: 'TEXT',
      required: true,
      placeholder: '请输入劳务公司名称',
      span: 12
    },
    {
      field: 'socialCreditCode',
      label: '统一社会信用代码',
      type: 'TEXT',
      required: true,
      placeholder: '请输入统一社会信用代码',
      span: 12
    },
    {
      field: 'manager',
      label: '负责人',
      type: 'TEXT',
      required: true,
      placeholder: '请输入负责人',
      span: 12
    },
    {
      field: 'managerPhone',
      label: '负责人手机号',
      type: 'TEXT',
      required: true,
      placeholder: '请输入负责人手机号',
      span: 12
    },
    {
      field: 'factoryManager',
      label: '驻厂负责人',
      type: 'TEXT',
      required: true,
      placeholder: '请输入驻厂负责人',
      span: 12
    },
    {
      field: 'factoryManagerPhone',
      label: '驻厂负责人手机号',
      type: 'TEXT',
      required: true,
      placeholder: '请输入驻厂负责人手机号',
      span: 12
    },
    {
      field: 'clerk',
      label: '文员',
      type: 'TEXT',
      required: true,
      placeholder: '请输入文员',
      span: 12
    },
    {
      field: 'clerkPhone',
      label: '文员手机号',
      type: 'TEXT',
      required: true,
      placeholder: '请输入文员手机号',
      span: 12
    },
    {
      field: 'interviewTime',
      label: '面试时间',
      type: 'DATETIME',
      required: true,
      placeholder: '请选择面试时间',
      span: 12
    },
    {
      field: 'interviewLocation',
      label: '面试地点',
      type: 'TEXT',
      required: true,
      placeholder: '请输入面试地点',
      span: 12
    },
    {
      field: 'factoryContact',
      label: '工厂对接人',
      type: 'TEXT',
      required: true,
      placeholder: '请输入工厂对接人',
      span: 12
    },
    {
      field: 'factoryContactPhone',
      label: '工厂对接人手机号',
      type: 'TEXT',
      required: true,
      placeholder: '请输入工厂对接人手机号',
      span: 12
    }
  ],
  labelWidth: '160px',
  columns: 2,
  buttonPosition: 'bottom',
  buttonAlign: 'center',
  submitText: '提交',
  resetText: '重置'
}

// 面试人员列表
const candidateList = ref([
  {
    isReturnWorker: false,
    name: '李四',
    phone: '13900139000',
    age: 28,
    gender: '男',
    recommendationLevel: '优先推荐',
    imageLevel: '优秀',
    education: '高中',
    positionCategory: '普工',
    expectedLocation: '深圳市',
    recommendationReason: '工作经验丰富，沟通能力强'
  },
  {
    isReturnWorker: true,
    name: '王五',
    phone: '13700137000',
    age: 32,
    gender: '男',
    recommendationLevel: '一般',
    imageLevel: '一般',
    education: '初中',
    positionCategory: '普工',
    expectedLocation: '深圳市',
    recommendationReason: '态度端正，学习能力强'
  }
])

// 面试人员对话框
const candidateVisible = ref(false)
const candidateTitle = ref('添加面试人员')
const candidateForm = ref({
  isReturnWorker: false,
  name: '',
  phone: '',
  age: 25,
  gender: '男',
  recommendationLevel: '一般',
  imageLevel: '一般',
  education: '高中',
  positionCategory: '',
  expectedLocation: '',
  recommendationReason: ''
})
const candidateIndex = ref(-1)

// 返回
const handleBack = () => {
  router.back()
}

// 提交表单
const handleSubmit = (data: any) => {
  console.log('提交表单数据:', data)
  console.log('面试人员清单:', candidateList.value)
  loading.value = true
  
  // 模拟API调用
  setTimeout(() => {
    loading.value = false
    ElMessage.success(isEdit.value ? '编辑成功' : '新增成功')
    router.back()
  }, 1000)
}

// 重置表单
const handleReset = (data: any) => {
  console.log('重置表单')
}

// 添加面试人员
const handleAddCandidate = () => {
  candidateTitle.value = '添加面试人员'
  candidateForm.value = {
    isReturnWorker: false,
    name: '',
    phone: '',
    age: 25,
    gender: '男',
    recommendationLevel: '一般',
    imageLevel: '一般',
    education: '高中',
    positionCategory: '',
    expectedLocation: '',
    recommendationReason: ''
  }
  candidateIndex.value = -1
  candidateVisible.value = true
}

// 编辑面试人员
const handleEditCandidate = (row: any, index: number) => {
  candidateTitle.value = '编辑面试人员'
  candidateForm.value = { ...row }
  candidateIndex.value = index
  candidateVisible.value = true
}

// 保存面试人员
const handleSaveCandidate = () => {
  if (!candidateForm.value.name) {
    ElMessage.warning('请输入姓名')
    return
  }
  
  if (candidateIndex.value >= 0) {
    // 编辑
    candidateList.value[candidateIndex.value] = { ...candidateForm.value }
    ElMessage.success('编辑成功')
  } else {
    // 新增
    candidateList.value.push({ ...candidateForm.value })
    ElMessage.success('添加成功')
  }
  
  candidateVisible.value = false
}

// 删除面试人员
const handleDeleteCandidate = (index: number) => {
  candidateList.value.splice(index, 1)
  ElMessage.success('删除成功')
}

// 获取推荐等级类型
const getRecommendationLevelType = (level: string) => {
  const typeMap: Record<string, any> = {
    '优先推荐': 'success',
    '一般': 'primary',
    '不建议': 'danger'
  }
  return typeMap[level] || 'info'
}

// 获取形象类型
const getImageLevelType = (level: string) => {
  const typeMap: Record<string, any> = {
    '优秀': 'success',
    '一般': 'primary',
    '其他': 'info'
  }
  return typeMap[level] || 'info'
}

// 加载面试详情（编辑模式）
const loadInterviewDetail = () => {
  if (!isEdit.value) return
  
  loading.value = true
  // 模拟API调用
  setTimeout(() => {
    formData.value = {
      laborCompany: '深圳市某某劳务派遣有限公司',
      socialCreditCode: '91440300MA5DXXXXXX',
      manager: '张三',
      managerPhone: '13800138000',
      factoryManager: '赵六',
      factoryManagerPhone: '13700137000',
      clerk: '钱七',
      clerkPhone: '13600136000',
      interviewTime: '2024-02-27 10:00:00',
      interviewLocation: '东莞长安工业区面试点',
      factoryContact: '李四',
      factoryContactPhone: '13900139000'
    }
    loading.value = false
  }, 500)
}

// 生命周期
onMounted(() => {
  loadInterviewDetail()
})
</script>

<style scoped>
.factory-interview-form-container {
  width: 100%;
  padding: 20px;
  background-color: #f5f7fa;
}

.page-header {
  margin-bottom: 20px;
  padding: 16px 20px;
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.page-title {
  font-size: 18px;
  font-weight: 600;
  color: #303133;
}

.form-card,
.candidate-card {
  margin-bottom: 20px;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 16px;
  font-weight: 600;
  color: #303133;
}

/* 响应式设计 */
@media screen and (max-width: 768px) {
  .factory-interview-form-container {
    padding: 12px;
  }

  :deep(.el-form) {
    font-size: 14px;
  }
}
</style>
