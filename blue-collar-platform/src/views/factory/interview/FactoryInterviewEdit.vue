<template>
  <div class="form-container">
    <div class="form-content">
      <el-card>
        <template #header>
          <span class="section-title">基本信息</span>
        </template>
        <el-form
          ref="formRef"
          :model="formData"
          :rules="interviewFormRules"
          label-width="120px"
        >
          <el-form-item label="劳务公司" prop="laborCompanyName">
            <el-input v-model="formData.laborCompanyName" disabled />
          </el-form-item>
          <el-form-item label="统一社会信用代码" prop="socialCreditCode">
            <el-input v-model="formData.socialCreditCode" disabled />
          </el-form-item>
          <el-form-item label="负责人" prop="manager">
            <el-input v-model="formData.manager" disabled />
          </el-form-item>
          <el-form-item label="负责人手机号" prop="managerPhone">
            <el-input v-model="formData.managerPhone" disabled />
          </el-form-item>
          <el-form-item label="面试时间" prop="interviewTime">
            <el-date-picker
              v-model="formData.interviewTime"
              type="datetime"
              placeholder="选择面试时间"
              format="YYYY-MM-DD HH:mm"
              value-format="YYYY-MM-DD HH:mm:ss"
            />
          </el-form-item>
          <el-form-item label="面试地点" prop="interviewLocation">
            <el-input
              v-model="formData.interviewLocation"
              placeholder="请输入面试地点"
              maxlength="100"
              show-word-limit
            />
          </el-form-item>
          <el-form-item label="工厂对接人" prop="factoryContactId">
            <PersonSelect
              v-model="formData.factoryContactId"
              :source="'employee'"
              @change="handleContactChange"
            />
          </el-form-item>
          <el-form-item label="对接人手机号" prop="factoryContactPhone">
            <el-input v-model="formData.factoryContactPhone" disabled />
          </el-form-item>
          <el-form-item label="备注" prop="remark">
            <el-input
              v-model="formData.remark"
              type="textarea"
              :rows="4"
              placeholder="请输入备注"
              maxlength="500"
              show-word-limit
            />
          </el-form-item>
        </el-form>
      </el-card>

      <el-card>
        <template #header>
          <div class="card-header">
            <span class="section-title">面试人员清单</span>
            <el-button type="primary" size="small" @click="handleAddPerson">
              <el-icon><Plus /></el-icon>
              添加人员
            </el-button>
          </div>
        </template>
        <el-table :data="formData.persons" border>
          <el-table-column prop="name" label="姓名" width="100" />
          <el-table-column prop="phone" label="手机号" width="130" />
          <el-table-column prop="age" label="年龄" width="80" />
          <el-table-column prop="gender" label="性别" width="80">
            <template #default="{ row }">
              {{ row.gender === 'MALE' ? '男' : '女' }}
            </template>
          </el-table-column>
          <el-table-column prop="recommendLevel" label="推荐等级" width="120">
            <template #default="{ row }">
              {{ formatRecommendLevel(row.recommendLevel) }}
            </template>
          </el-table-column>
          <el-table-column prop="imageLevel" label="形象级别" width="120">
            <template #default="{ row }">
              {{ formatImageLevel(row.imageLevel) }}
            </template>
          </el-table-column>
          <el-table-column prop="education" label="学历" width="120" />
          <el-table-column prop="positionCategory" label="岗位类别" width="100">
            <template #default="{ row }">
              {{ formatPositionCategory(row.positionCategory) }}
            </template>
          </el-table-column>
          <el-table-column prop="expectedLocation" label="期望工作地址" width="150" />
          <el-table-column prop="recommendReason" label="推荐理由" min-width="200" show-overflow-tooltip />
          <el-table-column label="操作" width="150" fixed="right">
            <template #default="{ row, $index }">
              <el-button link type="primary" @click="handleViewWorker(row.workerId)">查看</el-button>
              <el-button link type="danger" @click="handleRemovePerson($index)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </div>

    <div class="form-footer">
      <el-button @click="handleCancel">取消</el-button>
      <el-button @click="handleSaveDraft">保存草稿</el-button>
      <el-button type="primary" @click="handleSubmit">提交</el-button>
    </div>

    <PersonSelectDialog
      v-model="personSelectVisible"
      :multiple="true"
      :source="'worker'"
      @confirm="handlePersonSelectConfirm"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { Plus } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import PersonSelect from '@/components/PersonSelect.vue'
import PersonSelectDialog from '@/components/PersonSelectDialog.vue'
import { getFactoryInterviewDetail, updateFactoryInterview, type FactoryInterviewFormData, type FactoryInterviewPerson } from '@/api/interviewApi'

const router = useRouter()
const route = useRoute()

const formRef = ref<FormInstance>()
const formData = reactive<FactoryInterviewFormData>({
  laborCompanyId: '',
  laborCompanyName: '',
  socialCreditCode: '',
  manager: '',
  managerPhone: '',
  interviewTime: '',
  interviewLocation: '',
  factoryContactId: '',
  factoryContactName: '',
  factoryContactPhone: '',
  remark: '',
  persons: []
})

const interviewFormRules: FormRules = {
  interviewTime: [
    { required: true, message: '请选择面试时间', trigger: 'change' },
    {
      validator: (rule, value, callback) => {
        if (value && new Date(value) < new Date()) {
          callback(new Error('面试时间不能早于当前时间'))
        } else {
          callback()
        }
      },
      trigger: 'change'
    }
  ],
  interviewLocation: [
    { required: true, message: '请输入面试地点', trigger: 'blur' },
    { min: 2, max: 100, message: '面试地点长度在2-100个字符', trigger: 'blur' }
  ],
  factoryContactId: [
    { required: true, message: '请选择工厂对接人', trigger: 'change' }
  ]
}

const personSelectVisible = ref(false)

onMounted(async () => {
  const id = route.params.id as string
  if (id) {
    await loadInterviewDetail(id)
  }
})

async function loadInterviewDetail(id: string) {
  try {
    const response = await getFactoryInterviewDetail(id)
    const interview = response.data
    formData.laborCompanyId = interview.laborCompanyId
    formData.laborCompanyName = interview.laborCompanyName
    formData.socialCreditCode = interview.socialCreditCode
    formData.manager = interview.manager
    formData.managerPhone = interview.managerPhone
    formData.interviewTime = interview.interviewTime
    formData.interviewLocation = interview.interviewLocation
    formData.factoryContactId = interview.factoryContactId
    formData.factoryContactName = interview.factoryContactName
    formData.factoryContactPhone = interview.factoryContactPhone
    formData.remark = interview.remark
    formData.persons = interview.persons || []
  } catch (error) {
    ElMessage.error('获取面试详情失败')
    console.error('API调用错误:', error)
  }
}

async function handleContactChange(contactId: string) {
  const contact = await fetchEmployeeDetail(contactId)
  if (contact) {
    formData.factoryContactName = contact.name
    formData.factoryContactPhone = contact.phone
  }
}

async function fetchEmployeeDetail(employeeId: string) {
  try {
    const response = await fetch(`/api/v1/system/employees/${employeeId}`)
    const data = await response.json()
    return data.data
  } catch (error) {
    console.error('获取员工信息失败:', error)
    return null
  }
}

function handleAddPerson() {
  personSelectVisible.value = true
}

function handlePersonSelectConfirm(selectedPersons: any[]) {
  const newPersons = selectedPersons.map(person => ({
    id: `FIP${Date.now()}${Math.random().toString(36).substr(2, 9)}`,
    workerId: person.id,
    isReturnWorker: person.isReturnWorker || false,
    name: person.name,
    phone: person.phone,
    age: person.age,
    gender: person.gender,
    recommendLevel: person.recommendLevel || 'NORMAL',
    imageLevel: person.imageLevel || 'NORMAL',
    education: person.education,
    positionCategory: person.positionCategory,
    expectedLocation: person.expectedLocation,
    recommendReason: person.recommendReason || ''
  }))
  
  formData.persons = [...formData.persons, ...newPersons]
  personSelectVisible.value = false
}

function handleRemovePerson(index: number) {
  formData.persons.splice(index, 1)
}

function handleViewWorker(workerId: string) {
  router.push(`/factory/workers/${workerId}`)
}

async function handleSaveDraft() {
  try {
    await formRef.value?.validate()
    const id = route.params.id as string
    await updateFactoryInterview(id, formData)
    ElMessage.success('保存成功')
  } catch (error) {
    if (error !== false) {
      ElMessage.error('保存失败')
      console.error('API调用错误:', error)
    }
  }
}

async function handleSubmit() {
  try {
    await formRef.value?.validate()
    const id = route.params.id as string
    await updateFactoryInterview(id, formData)
    ElMessage.success('提交成功')
    router.back()
  } catch (error) {
    if (error !== false) {
      ElMessage.error('提交失败')
      console.error('API调用错误:', error)
    }
  }
}

function handleCancel() {
  router.back()
}

function formatRecommendLevel(level: string) {
  const map = {
    PRIORITY: '优先推荐',
    NORMAL: '一般',
    NOT_RECOMMEND: '不建议'
  }
  return map[level] || level
}

function formatImageLevel(level: string) {
  const map = {
    EXCELLENT: '优秀',
    NORMAL: '一般',
    OTHER: '其他'
  }
  return map[level] || level
}

function formatPositionCategory(category: string) {
  const map = {
    WORKER: '普工',
    TECHNICIAN: '技工',
    MANAGER: '干部'
  }
  return map[category] || category
}
</script>

<style scoped lang="scss">
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
  padding: 20px;
  padding-bottom: 80px;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
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
