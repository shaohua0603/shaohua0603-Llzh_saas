<template>
  <div class="interview-invitation-form-container">
    <!-- 内容区域 -->
    <div class="form-content">
      <!-- 基本信息卡片 -->
      <el-card class="form-card" shadow="never">
        <template #header>
          <div class="card-header">
            <span>基本信息</span>
          </div>
        </template>
        <el-form :model="formData" :rules="formRules" ref="formRef" label-width="140px">
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="选择工厂" prop="factoryName">
                <el-input
                  v-model="formData.factoryName"
                  placeholder="请选择工厂"
                  readonly
                  @click="handleSelectFactory"
                >
                  <template #suffix>
                    <el-icon><Search /></el-icon>
                  </template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="统一社会信用代码">
                <el-input v-model="formData.socialCreditCode" readonly placeholder="自动填充" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="对接人" prop="contactPerson">
                <el-input v-model="formData.contactPerson" placeholder="请输入对接人" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="对接人手机号" prop="contactPhone">
                <el-input v-model="formData.contactPhone" placeholder="请输入对接人手机号" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="面试时间" prop="interviewTime">
                <el-date-picker
                  v-model="formData.interviewTime"
                  type="datetime"
                  placeholder="请选择面试时间"
                  format="YYYY-MM-DD HH:mm:ss"
                  value-format="YYYY-MM-DD HH:mm:ss"
                  style="width: 100%"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="面试地点" prop="interviewLocation">
                <el-input v-model="formData.interviewLocation" placeholder="请输入面试地点" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="面试人" prop="interviewer">
                <el-input v-model="formData.interviewer" placeholder="请输入面试人" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="负责人" prop="manager">
                <el-input v-model="formData.manager" placeholder="请输入负责人" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="负责人手机号" prop="managerPhone">
                <el-input v-model="formData.managerPhone" placeholder="请输入负责人手机号" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="驻厂负责人" prop="factoryManager">
                <el-input v-model="formData.factoryManager" placeholder="请输入驻厂负责人" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="驻厂负责人手机号" prop="factoryManagerPhone">
                <el-input v-model="formData.factoryManagerPhone" placeholder="请输入驻厂负责人手机号" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="文员" prop="clerk">
                <el-input v-model="formData.clerk" placeholder="请输入文员" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="文员手机号" prop="clerkPhone">
                <el-input v-model="formData.clerkPhone" placeholder="请输入文员手机号" />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
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
          <el-table-column prop="materialsComplete" label="材料是否齐全" width="120">
            <template #default="{ row }">
              <el-tag :type="row.materialsComplete ? 'success' : 'danger'">
                {{ row.materialsComplete ? '齐全' : '不齐全' }}
              </el-tag>
            </template>
          </el-table-column>
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
            <el-col :span="12">
              <el-form-item label="材料是否齐全">
                <el-switch v-model="candidateForm.materialsComplete" />
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

    <!-- 工厂选择对话框 -->
    <FactorySelectDialog
      v-model="factoryDialogVisible"
      @confirm="handleFactorySelected"
    />

    <!-- 底部按钮栏 -->
    <div class="form-footer">
      <el-button @click="handleBack">
        <el-icon><ArrowLeft /></el-icon>
        返回
      </el-button>
      <el-button @click="handleReset">
        <el-icon><RefreshLeft /></el-icon>
        重置
      </el-button>
      <el-button type="primary" @click="handleSubmit" :loading="loading">
        <el-icon><Check /></el-icon>
        提交
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Plus, Search, RefreshLeft, ArrowLeft, Check } from '@element-plus/icons-vue'
import FactorySelectDialog from '@/components/FactorySelectDialog.vue'
import type { InterviewInvitationFormData, InterviewCandidate } from '@/api/interviewApi'

// 路由实例
const router = useRouter()
const route = useRoute()

// 表单引用
const formRef = ref()

// 是否编辑模式
const isEdit = computed(() => !!route.params.id)

// 加载状态
const loading = ref(false)

// 工厂选择对话框可见性
const factoryDialogVisible = ref(false)

// 表单数据
const formData = ref<InterviewInvitationFormData>({
  factoryId: '',
  factoryName: '',
  socialCreditCode: '',
  contactPerson: '',
  contactPhone: '',
  interviewTime: '',
  interviewLocation: '',
  interviewer: '',
  manager: '',
  managerPhone: '',
  factoryManager: '',
  factoryManagerPhone: '',
  clerk: '',
  clerkPhone: '',
  candidates: []
})

// 表单验证规则
const formRules = {
  factoryName: [{ required: true, message: '请选择工厂', trigger: 'change' }],
  contactPerson: [{ required: true, message: '请输入对接人', trigger: 'blur' }],
  contactPhone: [
    { required: true, message: '请输入对接人手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
  ],
  interviewTime: [{ required: true, message: '请选择面试时间', trigger: 'change' }],
  interviewLocation: [{ required: true, message: '请输入面试地点', trigger: 'blur' }],
  interviewer: [{ required: true, message: '请输入面试人', trigger: 'blur' }],
  manager: [{ required: true, message: '请输入负责人', trigger: 'blur' }],
  managerPhone: [
    { required: true, message: '请输入负责人手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
  ],
  factoryManager: [{ required: true, message: '请输入驻厂负责人', trigger: 'blur' }],
  factoryManagerPhone: [
    { required: true, message: '请输入驻厂负责人手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
  ],
  clerk: [{ required: true, message: '请输入文员', trigger: 'blur' }],
  clerkPhone: [
    { required: true, message: '请输入文员手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
  ]
}

// 面试人员列表
const candidateList = ref<InterviewCandidate[]>([
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
    materialsComplete: true,
    recommendationReason: '工作经验丰富,沟通能力强'
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
    materialsComplete: true,
    recommendationReason: '态度端正,学习能力强'
  }
])

// 面试人员对话框
const candidateVisible = ref(false)
const candidateTitle = ref('添加面试人员')
const candidateForm = ref<InterviewCandidate>({
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
  materialsComplete: true,
  recommendationReason: ''
})
const candidateIndex = ref(-1)

// 返回
const handleBack = () => {
  router.back()
}

// 选择工厂
const handleSelectFactory = () => {
  factoryDialogVisible.value = true
}

// 工厂选择确认
const handleFactorySelected = (factory: any) => {
  formData.value.factoryId = factory.id
  formData.value.factoryName = factory.name
  formData.value.socialCreditCode = factory.socialCreditCode
  formData.value.contactPerson = factory.contactPerson
  formData.value.contactPhone = factory.contactPhone
}

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return
  
  await formRef.value.validate(async (valid: boolean) => {
    if (!valid) {
      ElMessage.warning('请填写完整表单信息')
      return
    }
    
    if (candidateList.value.length === 0) {
      ElMessage.warning('请至少添加一名面试人员')
      return
    }
    
    formData.value.candidates = candidateList.value
    loading.value = true
    
    // 模拟API调用
    setTimeout(() => {
      loading.value = false
      ElMessage.success(isEdit.value ? '编辑成功' : '新增成功')
      router.back()
    }, 1000)
  })
}

// 重置表单
const handleReset = () => {
  if (!formRef.value) return
  formRef.value.resetFields()
  candidateList.value = []
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
    materialsComplete: true,
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

// 加载邀约详情(编辑模式)
const loadInvitationDetail = () => {
  if (!isEdit.value) return
  
  loading.value = true
  // 模拟API调用
  setTimeout(() => {
    formData.value = {
      factoryId: 'factory1',
      factoryName: '东莞长安工业区',
      socialCreditCode: '91440300MA5DXXXXXX',
      contactPerson: '张三',
      contactPhone: '13800138000',
      interviewTime: '2024-02-27 10:00:00',
      interviewLocation: '东莞长安工业区面试点',
      interviewer: '李四',
      manager: '王五',
      managerPhone: '13900139000',
      factoryManager: '赵六',
      factoryManagerPhone: '13700137000',
      clerk: '钱七',
      clerkPhone: '13600136000',
      candidates: []
    }
    loading.value = false
  }, 500)
}

// 生命周期
onMounted(() => {
  loadInvitationDetail()
})
</script>

<style scoped>
.interview-invitation-form-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #f5f7fa;
}

.form-content {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  padding-bottom: 80px;
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

/* 底部按钮栏 - 固定悬浮 */
.form-footer {
  position: fixed;
  bottom: 0;
  left: var(--sidebar-width, 200px);
  right: 0;
  display: flex;
  justify-content: center;
  gap: 12px;
  padding: 16px;
  background-color: #f5f7fa;
  border-top: 1px solid #e4e7ed;
  z-index: 100;
  transition: left var(--transition-base, 0.3s);
}

/* 响应式适配 */
@media screen and (max-width: 768px) {
  .form-content {
    padding: 12px;
    padding-bottom: 120px;
  }

  .form-footer {
    left: 0;
    flex-direction: column;
  }

  .form-footer .el-button {
    width: 100%;
  }

  :deep(.el-form) {
    font-size: 14px;
  }
}
</style>
