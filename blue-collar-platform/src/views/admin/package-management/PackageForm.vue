<template>
  <div class="package-form-container">
    <el-card class="form-card">
      <template #header>
        <div class="card-header">
          <span>{{ isEdit ? '编辑套餐' : '新增套餐' }}</span>
          <el-button link @click="handleBack">
            返回
          </el-button>
        </div>
      </template>

      <el-form
        ref="formRef"
        :model="formData"
        :rules="formRules"
        label-width="140px"
        @submit.prevent="handleSubmit"
      >
        <el-form-item label="套餐名称" prop="packageName">
          <el-input
            v-model="formData.packageName"
            placeholder="请输入套餐名称"
            clearable
            maxlength="100"
            show-word-limit
            @blur="checkName"
          />
        </el-form-item>

        <el-form-item label="适合租户" prop="tenantType">
          <el-select
            v-model="formData.tenantType"
            placeholder="请选择适合租户"
            style="width: 100%"
          >
            <el-option
              v-for="item in Object.values(TenantTypeDict)"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="套餐描述" prop="packageDescription">
          <el-input
            v-model="formData.packageDescription"
            type="textarea"
            :rows="4"
            placeholder="请输入套餐描述"
            maxlength="500"
            show-word-limit
          />
        </el-form-item>

        <el-form-item label="金额" prop="amount">
          <el-input-number
            v-model="formData.amount"
            :min="0"
            :precision="2"
            :step="100"
            placeholder="请输入金额"
            style="width: 100%"
          />
        </el-form-item>

        <el-form-item label="到期频率" prop="expiryFrequency">
          <el-select
            v-model="formData.expiryFrequency"
            placeholder="请选择到期频率"
            style="width: 100%"
          >
            <el-option
              v-for="item in Object.values(ExpiryFrequencyDict)"
              :key="item.value"
              :label="`${item.label}(${item.description})`"
              :value="item.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="正式员工账户数" prop="employeeAccountCount">
          <el-input-number
            v-model="formData.employeeAccountCount"
            :min="0"
            :step="1"
            placeholder="请输入正式员工账户数"
            style="width: 100%"
          />
        </el-form-item>

        <el-form-item label="背调工人数量" prop="backgroundCheckWorkerCount">
          <el-input-number
            v-model="formData.backgroundCheckWorkerCount"
            :min="0"
            :step="1"
            placeholder="请输入背调工人数量"
            style="width: 100%"
          />
        </el-form-item>

        <el-form-item label="套餐状态" prop="status">
          <el-radio-group v-model="formData.status">
            <el-radio
              v-for="item in Object.values(PackageStatusDict)"
              :key="item.value"
              :label="item.value"
            >
              {{ item.label }}
            </el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="handleSubmit" :loading="loading">
            保存
          </el-button>
          <el-button @click="handleReset">
            重置
          </el-button>
          <el-button @click="handleBack">
            取消
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import { usePackageStore } from '@/stores/package'
import {
  PackageStatusDict,
  ExpiryFrequencyDict,
  TenantTypeDict,
  PackageStatus,
  ExpiryFrequency,
  TenantType
} from '@/types/system/packageTypes'
import type { PackageFormData } from '@/types/system/packageTypes'

const router = useRouter()
const route = useRoute()
const packageStore = usePackageStore()

const formRef = ref<FormInstance>()
const loading = ref(false)
const isEdit = computed(() => !!route.params.id)

const formData = reactive<PackageFormData>({
  packageName: '',
  packageDescription: '',
  tenantType: TenantType.LABOR_COMPANY,
  amount: 0,
  expiryFrequency: ExpiryFrequency.MONTHLY,
  employeeAccountCount: 0,
  backgroundCheckWorkerCount: 0,
  status: PackageStatus.ENABLED
})

/**
 * 表单验证规则
 */
const formRules: FormRules<PackageFormData> = {
  packageName: [
    { required: true, message: '请输入套餐名称', trigger: 'blur' },
    { min: 2, max: 100, message: '套餐名称长度在2到100个字符', trigger: 'blur' }
  ],
  tenantType: [
    { required: true, message: '请选择适合租户', trigger: 'change' }
  ],
  packageDescription: [
    { required: true, message: '请输入套餐描述', trigger: 'blur' },
    { min: 10, max: 500, message: '套餐描述长度在10到500个字符', trigger: 'blur' }
  ],
  amount: [
    { required: true, message: '请输入金额', trigger: 'blur' },
    { type: 'number', min: 0, message: '金额不能小于0', trigger: 'blur' }
  ],
  expiryFrequency: [
    { required: true, message: '请选择到期频率', trigger: 'change' }
  ],
  employeeAccountCount: [
    { required: true, message: '请输入正式员工账户数', trigger: 'blur' },
    { type: 'number', min: 0, message: '正式员工账户数不能小于0', trigger: 'blur' }
  ],
  backgroundCheckWorkerCount: [
    { required: true, message: '请输入背调工人数量', trigger: 'blur' },
    { type: 'number', min: 0, message: '背调工人数量不能小于0', trigger: 'blur' }
  ],
  status: [
    { required: true, message: '请选择套餐状态', trigger: 'change' }
  ]
}

/**
 * 检查套餐名称是否重复
 */
const checkName = async () => {
  if (!formData.packageName) return

  try {
    const exists = await packageStore.checkPackageName(
      formData.packageName,
      isEdit.value ? route.params.id as string : undefined
    )
    if (exists) {
      ElMessage.warning('套餐名称已存在')
      formRef.value?.validateField('packageName')
    }
  } catch (error) {
    console.error('检查套餐名称失败:', error)
  }
}

/**
 * 获取套餐详情
 */
const fetchPackageDetail = async () => {
  if (!isEdit.value) return

  try {
    loading.value = true
    const packageDetail = await packageStore.fetchPackageDetail(route.params.id as string)
    Object.assign(formData, {
      packageName: packageDetail.packageName,
      packageDescription: packageDetail.packageDescription,
      tenantType: packageDetail.tenantType,
      amount: packageDetail.amount,
      expiryFrequency: packageDetail.expiryFrequency,
      employeeAccountCount: packageDetail.employeeAccountCount,
      backgroundCheckWorkerCount: packageDetail.backgroundCheckWorkerCount,
      status: packageDetail.status
    })
  } catch (error) {
    console.error('获取套餐详情失败:', error)
    ElMessage.error('获取套餐详情失败')
    handleBack()
  } finally {
    loading.value = false
  }
}

/**
 * 提交表单
 */
const handleSubmit = async () => {
  if (!formRef.value) return

  try {
    await formRef.value.validate()
    loading.value = true

    if (isEdit.value) {
      await packageStore.updatePackage(route.params.id as string, formData)
      ElMessage.success('更新成功')
    } else {
      await packageStore.createPackage(formData)
      ElMessage.success('创建成功')
    }

    handleBack()
  } catch (error) {
    console.error('提交失败:', error)
    if (error !== false) {
      ElMessage.error(isEdit.value ? '更新失败' : '创建失败')
    }
  } finally {
    loading.value = false
  }
}

/**
 * 重置表单
 */
const handleReset = () => {
  formRef.value?.resetFields()
}

/**
 * 返回列表
 */
const handleBack = () => {
  router.push('/admin/package-management/package-info')
}

onMounted(() => {
  if (isEdit.value) {
    fetchPackageDetail()
  }
})
</script>

<style scoped>
.package-form-container {
  padding: 20px;
}

.form-card {
  max-width: 800px;
  margin: 0 auto;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.el-form {
  padding: 20px;
}

@media screen and (max-width: 768px) {
  .form-card {
    max-width: 100%;
  }

  .el-form {
    padding: 10px;
  }

  :deep(.el-form-item__label) {
    width: 100px !important;
  }
}
</style>
