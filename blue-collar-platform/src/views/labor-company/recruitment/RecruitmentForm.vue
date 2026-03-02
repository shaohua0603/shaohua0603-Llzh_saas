<template>
  <div class="recruitment-form-container">
    <div class="form-content">
      <el-card class="form-card" shadow="never">
        <template #header>
          <div class="card-header">
            <el-icon><Document /></el-icon>
            <span>基本信息</span>
          </div>
        </template>
        <el-form ref="basicFormRef" :model="formData.basic" :rules="basicRules" label-width="120px">
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="需求标题" prop="title">
                <el-input v-model="formData.basic.title" placeholder="请输入需求标题" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="招聘人数" prop="recruitCount">
                <el-input-number v-model="formData.basic.recruitCount" :min="1" :max="10000" style="width: 100%" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="工厂名称" prop="factoryName">
                <el-input v-model="formData.basic.factoryName" placeholder="请输入工厂名称" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="部门" prop="department">
                <el-input v-model="formData.basic.department" placeholder="请输入部门" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="负责人" prop="manager">
                <el-input v-model="formData.basic.manager" placeholder="请输入负责人" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="联系电话" prop="phone">
                <el-input v-model="formData.basic.phone" placeholder="请输入联系电话" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="发布时间" prop="publishTime">
                <el-date-picker
                  v-model="formData.basic.publishTime"
                  type="datetime"
                  placeholder="选择发布时间"
                  style="width: 100%"
                  format="YYYY-MM-DD HH:mm:ss"
                  value-format="YYYY-MM-DD HH:mm:ss"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="截止时间" prop="deadline">
                <el-date-picker
                  v-model="formData.basic.deadline"
                  type="datetime"
                  placeholder="选择截止时间"
                  style="width: 100%"
                  format="YYYY-MM-DD HH:mm:ss"
                  value-format="YYYY-MM-DD HH:mm:ss"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="需求状态" prop="status">
                <el-select v-model="formData.basic.status" placeholder="请选择状态" style="width: 100%">
                  <el-option label="草稿" value="draft" />
                  <el-option label="已发布" value="published" />
                  <el-option label="已关闭" value="closed" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-card>

      <el-card class="form-card" shadow="never">
        <template #header>
          <div class="card-header">
            <el-icon><Grid /></el-icon>
            <span>岗位要求</span>
          </div>
        </template>
        <el-form ref="positionFormRef" :model="formData.position" :rules="positionRules" label-width="120px">
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="岗位类别" prop="positionCategory">
                <el-select v-model="formData.position.positionCategory" placeholder="请选择岗位类别" style="width: 100%">
                  <el-option label="普工" value="普工" />
                  <el-option label="技工" value="技工" />
                  <el-option label="干部" value="干部" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="学历要求" prop="education">
                <el-select v-model="formData.position.education" placeholder="请选择学历要求" style="width: 100%">
                  <el-option label="不限" value="不限" />
                  <el-option label="初中及以上" value="初中及以上" />
                  <el-option label="高中及以上" value="高中及以上" />
                  <el-option label="中专及以上" value="中专及以上" />
                  <el-option label="大专及以上" value="大专及以上" />
                  <el-option label="本科及以上" value="本科及以上" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="工作经验" prop="experience">
                <el-select v-model="formData.position.experience" placeholder="请选择工作经验" style="width: 100%">
                  <el-option label="不限" value="不限" />
                  <el-option label="1年以下" value="1年以下" />
                  <el-option label="1-3年" value="1-3年" />
                  <el-option label="3-5年" value="3-5年" />
                  <el-option label="5年以上" value="5年以上" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="年龄要求" prop="ageRequirement">
                <el-input v-model="formData.position.ageRequirement" placeholder="如：18-45岁" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="性别要求" prop="genderRequirement">
                <el-radio-group v-model="formData.position.genderRequirement">
                  <el-radio label="不限">不限</el-radio>
                  <el-radio label="男">男</el-radio>
                  <el-radio label="女">女</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="工作地点" prop="workLocation">
                <el-input v-model="formData.position.workLocation" placeholder="请输入工作地点" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="岗位描述" prop="positionDescription">
            <el-input v-model="formData.position.positionDescription" type="textarea" :rows="4" placeholder="请输入岗位描述" />
          </el-form-item>
        </el-form>
      </el-card>

      <el-card class="form-card" shadow="never">
        <template #header>
          <div class="card-header">
            <el-icon><Coin /></el-icon>
            <span>薪资待遇</span>
          </div>
        </template>
        <el-form ref="salaryFormRef" :model="formData.salary" :rules="salaryRules" label-width="120px">
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="薪资范围" prop="salaryRange">
                <el-input v-model="formData.salary.salaryRange" placeholder="如：5000-7000元/月" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="薪资结构" prop="salaryStructure">
                <el-input v-model="formData.salary.salaryStructure" placeholder="如：底薪+加班费+全勤奖" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="试用期" prop="probationPeriod">
                <el-input v-model="formData.salary.probationPeriod" placeholder="如：1个月" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="试用期薪资" prop="probationSalary">
                <el-input v-model="formData.salary.probationSalary" placeholder="如：4500-6000元/月" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="福利待遇" prop="benefits">
            <el-input v-model="formData.salary.benefits" type="textarea" :rows="4" placeholder="请输入福利待遇，如：包吃住、五险一金、节日福利等" />
          </el-form-item>
        </el-form>
      </el-card>
    </div>

    <div class="form-footer">
      <el-button @click="handleBack">
        <el-icon><ArrowLeft /></el-icon>
        返回
      </el-button>
      <el-button @click="handleSaveDraft">保存草稿</el-button>
      <el-button type="primary" @click="handleSubmit">发布</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage, ElMessageBox, FormInstance, FormRules } from 'element-plus'
import { ArrowLeft, Document, Grid, Coin } from '@element-plus/icons-vue'

const router = useRouter()
const route = useRoute()

const basicFormRef = ref<FormInstance>()
const positionFormRef = ref<FormInstance>()
const salaryFormRef = ref<FormInstance>()

const isEdit = computed(() => !!route.params.id)

const formData = reactive({
  basic: {
    title: '',
    recruitCount: 1,
    factoryName: '',
    department: '',
    manager: '',
    phone: '',
    publishTime: '',
    deadline: '',
    status: 'draft'
  },
  position: {
    positionCategory: '',
    education: '',
    experience: '',
    ageRequirement: '',
    genderRequirement: '不限',
    workLocation: '',
    positionDescription: ''
  },
  salary: {
    salaryRange: '',
    salaryStructure: '',
    probationPeriod: '',
    probationSalary: '',
    benefits: ''
  }
})

const basicRules: FormRules = {
  title: [{ required: true, message: '请输入需求标题', trigger: 'blur' }],
  recruitCount: [{ required: true, message: '请输入招聘人数', trigger: 'blur' }],
  factoryName: [{ required: true, message: '请输入工厂名称', trigger: 'blur' }],
  manager: [{ required: true, message: '请输入负责人', trigger: 'blur' }],
  phone: [{ required: true, message: '请输入联系电话', trigger: 'blur' }]
}

const positionRules: FormRules = {
  positionCategory: [{ required: true, message: '请选择岗位类别', trigger: 'change' }],
  workLocation: [{ required: true, message: '请输入工作地点', trigger: 'blur' }]
}

const salaryRules: FormRules = {
  salaryRange: [{ required: true, message: '请输入薪资范围', trigger: 'blur' }]
}

const handleBack = () => {
  router.back()
}

const handleSaveDraft = async () => {
  try {
    await basicFormRef.value?.validate()
    formData.basic.status = 'draft'
    ElMessage.success('保存草稿成功')
    router.back()
  } catch {
    ElMessage.warning('请填写必填项')
  }
}

const handleSubmit = async () => {
  try {
    await basicFormRef.value?.validate()
    await positionFormRef.value?.validate()
    await salaryFormRef.value?.validate()
    formData.basic.status = 'published'
    ElMessage.success('发布成功')
    router.back()
  } catch {
    ElMessage.warning('请填写必填项')
  }
}

const loadData = () => {
  if (isEdit.value) {
    console.log('加载编辑数据:', route.params.id)
    formData.basic = {
      title: '普工招聘',
      recruitCount: 50,
      factoryName: '某某电子有限公司',
      department: '生产部',
      manager: '张三',
      phone: '13800138000',
      publishTime: '2024-02-20 10:00:00',
      deadline: '2024-03-31 18:00:00',
      status: 'published'
    }
    formData.position = {
      positionCategory: '普工',
      education: '初中及以上',
      experience: '不限',
      ageRequirement: '18-45岁',
      genderRequirement: '不限',
      workLocation: '广东省深圳市宝安区',
      positionDescription: '负责生产线操作，按照工艺要求完成生产任务，保证产品质量。'
    }
    formData.salary = {
      salaryRange: '5000-7000元/月',
      salaryStructure: '底薪+加班费+全勤奖+绩效奖金',
      probationPeriod: '1个月',
      probationSalary: '4500-6000元/月',
      benefits: '包吃住、五险一金、节日福利、带薪年假、定期体检'
    }
  }
}

onMounted(() => {
  loadData()
})
</script>

<style scoped>
.recruitment-form-container {
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
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding: 16px 20px;
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.page-title {
  font-size: 18px;
  font-weight: 600;
  color: #303133;
}

.header-actions {
  display: flex;
  gap: 12px;
}

.form-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-card {
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.card-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  font-weight: 600;
  color: #303133;
}

@media screen and (max-width: 768px) {
  .recruitment-form-container {
    padding: 12px;
  }

  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .header-actions {
    width: 100%;
    justify-content: flex-end;
  }

  :deep(.el-col) {
    width: 100% !important;
  }
}

.form-footer {
  flex-shrink: 0;
  display: flex;
  justify-content: center;
  gap: 12px;
  padding: 16px;
  background-color: #f5f7fa;
  border-top: 1px solid #e4e7ed;
}
</style>
