<template>
  <div class="referral-form-container">
    <!-- 顶部操作栏 -->
    <div class="page-header">
      <div class="header-actions">
        <el-button @click="handleReset">重置</el-button>
        <el-button type="primary" @click="handleSubmit" :loading="submitting">提交</el-button>
      </div>
    </div>

    <!-- 表单区域 -->
    <div class="form-section">
      <el-card>
        <template #header>
          <span class="card-title">被介绍人信息</span>
        </template>
        <el-form
          ref="formRef"
          :model="formData"
          :rules="formRules"
          label-width="140px"
          label-position="right"
        >
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="被介绍人姓名" prop="workerName">
                <el-input v-model="formData.workerName" placeholder="请输入被介绍人姓名" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="手机号" prop="phone">
                <el-input v-model="formData.phone" placeholder="请输入手机号" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="身份证号" prop="idCard">
                <el-input v-model="formData.idCard" placeholder="请输入身份证号" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="性别" prop="gender">
                <el-select v-model="formData.gender" placeholder="请选择性别" style="width: 100%">
                  <el-option label="男" value="男" />
                  <el-option label="女" value="女" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="年龄" prop="age">
                <el-input-number v-model="formData.age" :min="18" :max="60" style="width: 100%" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="学历" prop="education">
                <el-select v-model="formData.education" placeholder="请选择学历" style="width: 100%">
                  <el-option label="初中及以下" value="初中及以下" />
                  <el-option label="高中/中专" value="高中/中专" />
                  <el-option label="大专" value="大专" />
                  <el-option label="本科及以上" value="本科及以上" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-card>

      <el-card class="mt-4">
        <template #header>
          <span class="card-title">工作信息</span>
        </el-form>
        <el-form
          ref="workFormRef"
          :model="formData"
          :rules="workRules"
          label-width="140px"
          label-position="right"
        >
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="工厂" prop="factory">
                <el-input v-model="formData.factory" placeholder="请输入工厂名称" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="岗位" prop="position">
                <el-input v-model="formData.position" placeholder="请输入岗位" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="介绍日期" prop="referralDate">
                <el-date-picker
                  v-model="formData.referralDate"
                  type="date"
                  placeholder="请选择介绍日期"
                  value-format="YYYY-MM-DD"
                  style="width: 100%"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="预计进厂日期" prop="expectedEntryDate">
                <el-date-picker
                  v-model="formData.expectedEntryDate"
                  type="date"
                  placeholder="请选择预计进厂日期"
                  value-format="YYYY-MM-DD"
                  style="width: 100%"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="实际进厂日期">
                <el-date-picker
                  v-model="formData.entryDate"
                  type="date"
                  placeholder="请选择实际进厂日期"
                  value-format="YYYY-MM-DD"
                  style="width: 100%"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="薪资模式" prop="salaryType">
                <el-select v-model="formData.salaryType" placeholder="请选择薪资模式" style="width: 100%">
                  <el-option label="日结" value="daily" />
                  <el-option label="月结" value="monthly" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-card>

      <el-card class="mt-4">
        <template #header>
          <span class="card-title">介绍人信息</span>
        </template>
        <el-form
          ref="referrerFormRef"
          :model="formData"
          :rules="referrerRules"
          label-width="140px"
          label-position="right"
        >
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="介绍人姓名" prop="referrerName">
                <el-input v-model="formData.referrerName" placeholder="请输入介绍人姓名" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="介绍人手机号" prop="referrerPhone">
                <el-input v-model="formData.referrerPhone" placeholder="请输入介绍人手机号" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="24">
              <el-form-item label="备注">
                <el-input
                  v-model="formData.remark"
                  type="textarea"
                  :rows="3"
                  placeholder="请输入备注"
                />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { ArrowLeft } from '@element-plus/icons-vue'
import type { FormInstance, FormRules } from 'element-plus'

// 路由
const router = useRouter()
const route = useRoute()

// 表单引用
const formRef = ref<FormInstance>()
const workFormRef = ref<FormInstance>()
const referrerFormRef = ref<FormInstance>()

// 提交状态
const submitting = ref(false)

// 是否编辑模式
const isEdit = computed(() => !!route.params.id)

// 表单数据
const formData = reactive({
  // 被介绍人信息
  workerName: '',
  phone: '',
  idCard: '',
  gender: '',
  age: 18,
  education: '',
  // 工作信息
  factory: '',
  position: '',
  referralDate: '',
  expectedEntryDate: '',
  entryDate: '',
  salaryType: '',
  // 介绍人信息
  referrerName: '',
  referrerPhone: '',
  remark: ''
})

// 基本信息验证规则
const formRules: FormRules = {
  workerName: [{ required: true, message: '请输入被介绍人姓名', trigger: 'blur' }],
  phone: [{ required: true, message: '请输入手机号', trigger: 'blur' }],
  idCard: [{ required: true, message: '请输入身份证号', trigger: 'blur' }]
}

// 工作信息验证规则
const workRules: FormRules = {
  factory: [{ required: true, message: '请输入工厂名称', trigger: 'blur' }],
  position: [{ required: true, message: '请输入岗位', trigger: 'blur' }],
  referralDate: [{ required: true, message: '请选择介绍日期', trigger: 'change' }],
  salaryType: [{ required: true, message: '请选择薪资模式', trigger: 'change' }]
}

// 介绍人信息验证规则
const referrerRules: FormRules = {
  referrerName: [{ required: true, message: '请输入介绍人姓名', trigger: 'blur' }],
  referrerPhone: [{ required: true, message: '请输入介绍人手机号', trigger: 'blur' }]
}

// 返回
const handleBack = () => {
  router.back()
}

// 重置
const handleReset = () => {
  formRef.value?.resetFields()
  workFormRef.value?.resetFields()
  referrerFormRef.value?.resetFields()
}

// 提交
const handleSubmit = async () => {
  try {
    await formRef.value?.validate()
    await workFormRef.value?.validate()
    await referrerFormRef.value?.validate()

    submitting.value = true
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 1000))

    ElMessage.success(isEdit.value ? '修改成功' : '提交成功')
    router.push({ name: 'LaborCompanyReferral' })
  } catch (error) {
    console.error('验证失败:', error)
  } finally {
    submitting.value = false
  }
}

// 加载数据
const loadData = async () => {
  if (isEdit.value) {
    // 模拟加载数据
    const mockData = {
      workerName: '张三',
      phone: '13800138001',
      idCard: '110101199001011234',
      gender: '男',
      age: 28,
      education: '高中/中专',
      factory: '富士康科技集团',
      position: '操作工',
      referralDate: '2026-01-15',
      expectedEntryDate: '2026-01-20',
      entryDate: '2026-01-20',
      salaryType: 'monthly',
      referrerName: '李四',
      referrerPhone: '13800138002',
      remark: '介绍老乡入职'
    }
    Object.assign(formData, mockData)
  }
}

// 生命周期
onMounted(() => {
  loadData()
})
</script>

<style scoped>
.referral-form-container {
  padding: 20px;
  background-color: #f5f7fa;
  min-height: calc(100vh - 100px);
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding: 16px 20px;
  background-color: #fff;
  border-radius: 4px;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.page-title {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #303133;
}

.header-actions {
  display: flex;
  gap: 10px;
}

.form-section {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-section .el-card {
  border-radius: 4px;
}

.card-title {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
}

.mt-4 {
  margin-top: 16px;
}
</style>
