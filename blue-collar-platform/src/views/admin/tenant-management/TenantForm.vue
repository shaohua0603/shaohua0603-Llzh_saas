<template>
  <div class="tenant-form-container">
    <el-card class="form-card">
      <el-form
        ref="formRef"
        :model="formData"
        :rules="formRules"
        label-width="140px"
        :disabled="loading"
      >
        <el-divider content-position="left">基本信息</el-divider>
        <el-form-item label="租户名称" prop="tenantName">
          <el-input
            v-model="formData.tenantName"
            placeholder="请输入租户名称"
            maxlength="100"
            show-word-limit
            style="width: 400px"
          />
        </el-form-item>
        <el-form-item label="统一社会信用代码" prop="creditCode">
          <el-input
            v-model="formData.creditCode"
            placeholder="请输入统一社会信用代码"
            maxlength="18"
            style="width: 400px"
          />
        </el-form-item>
        <el-form-item label="租户类型" prop="tenantType">
          <el-radio-group v-model="formData.tenantType">
            <el-radio
              v-for="item in Object.values(TenantTypeDict)"
              :key="item.value"
              :value="item.value"
            >
              {{ item.label }}
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="套餐" prop="packageId">
          <el-select
            v-model="formData.packageId"
            placeholder="请选择套餐"
            style="width: 400px"
          >
            <el-option
              v-for="item in packageOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="营业执照" prop="businessLicense">
          <FileUpload
            v-model="formData.businessLicense"
            :limit="1"
            accept="image/*"
            :file-size="5"
            file-size-unit="MB"
            list-type="picture-card"
            :auto-upload="false"
          >
            <el-icon><Plus /></el-icon>
          </FileUpload>
          <div class="form-tip">支持jpg、png格式，文件大小不超过5MB</div>
        </el-form-item>

        <el-divider content-position="left">管理员信息</el-divider>
        <el-form-item label="管理员姓名" prop="adminName">
          <el-input
            v-model="formData.adminName"
            placeholder="请输入管理员姓名"
            maxlength="50"
            style="width: 300px"
          />
        </el-form-item>
        <el-form-item label="管理员手机号" prop="adminPhone">
          <el-input
            v-model="formData.adminPhone"
            placeholder="请输入管理员手机号"
            maxlength="11"
            style="width: 300px"
          />
        </el-form-item>

        <el-divider content-position="left">联系人信息</el-divider>
        <el-form-item label="联系人姓名" prop="contactName">
          <el-input
            v-model="formData.contactName"
            placeholder="请输入联系人姓名"
            maxlength="50"
            style="width: 300px"
          />
        </el-form-item>
        <el-form-item label="联系人手机号" prop="contactPhone">
          <el-input
            v-model="formData.contactPhone"
            placeholder="请输入联系人手机号"
            maxlength="11"
            style="width: 300px"
          />
        </el-form-item>

        <el-divider content-position="left">状态设置</el-divider>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="formData.status">
            <el-radio
              v-for="item in Object.values(TenantStatusDict)"
              :key="item.value"
              :value="item.value"
            >
              {{ item.label }}
            </el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>

      <div class="form-actions">
        <el-button @click="handleCancel">取消</el-button>
        <el-button type="primary" @click="handleSubmit" :loading="loading">
          保存
        </el-button>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import type { FormInstance, FormRules } from 'element-plus'
import { useTenantStore } from '@/stores/tenant'
import {
  TenantStatusDict,
  TenantTypeDict
} from '@/types/system/tenantTypes'
import type { TenantFormData, TenantType } from '@/types/system/tenantTypes'
import FileUpload from '@/components/FileUpload.vue'

const router = useRouter()
const route = useRoute()
const tenantStore = useTenantStore()

const formRef = ref<FormInstance>()
const loading = ref(false)
const isEdit = ref(false)
const packageOptions = ref<Array<{ label: string; value: string }>>([])

const formData = reactive<TenantFormData>({
  tenantName: '',
  creditCode: '',
  businessLicense: '',
  adminName: '',
  adminPhone: '',
  contactName: '',
  contactPhone: '',
  packageId: '',
  tenantType: 'labor_company' as TenantType,
  status: 'enabled'
})

/**
 * 手机号校验规则
 */
const validatePhone = (rule: any, value: any, callback: any) => {
  if (!value) {
    callback()
  } else if (!/^1[3-9]\d{9}$/.test(value)) {
    callback(new Error('请输入正确的手机号'))
  } else {
    callback()
  }
}

/**
 * 统一社会信用代码校验规则
 */
const validateCreditCode = (rule: any, value: any, callback: any) => {
  if (!value) {
    callback()
  } else if (!/^[0-9A-HJ-NPQRTUWXY]{2}\d{6}[0-9A-HJ-NPQRTUWXY]{10}$/.test(value)) {
    callback(new Error('请输入正确的统一社会信用代码'))
  } else {
    callback()
  }
}

/**
 * 表单验证规则
 */
const formRules: FormRules = {
  tenantName: [
    { required: true, message: '请输入租户名称', trigger: 'blur' },
    { min: 2, max: 100, message: '长度在 2 到 100 个字符', trigger: 'blur' }
  ],
  creditCode: [
    { required: true, message: '请输入统一社会信用代码', trigger: 'blur' },
    { validator: validateCreditCode, trigger: 'blur' }
  ],
  tenantType: [
    { required: true, message: '请选择租户类型', trigger: 'change' }
  ],
  packageId: [
    { required: true, message: '请选择套餐', trigger: 'change' }
  ],
  businessLicense: [
    { required: true, message: '请上传营业执照', trigger: 'change' }
  ],
  adminName: [
    { required: true, message: '请输入管理员姓名', trigger: 'blur' },
    { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
  ],
  adminPhone: [
    { required: true, message: '请输入管理员手机号', trigger: 'blur' },
    { validator: validatePhone, trigger: 'blur' }
  ],
  contactName: [
    { required: true, message: '请输入联系人姓名', trigger: 'blur' },
    { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
  ],
  contactPhone: [
    { required: true, message: '请输入联系人手机号', trigger: 'blur' },
    { validator: validatePhone, trigger: 'blur' }
  ],
  status: [
    { required: true, message: '请选择状态', trigger: 'change' }
  ]
}

/**
 * 获取套餐选项
 */
const fetchPackageOptions = async () => {
  try {
    const options = await tenantStore.fetchPackageOptions()
    packageOptions.value = options || []
  } catch (error) {
    console.error('获取套餐选项失败:', error)
  }
}

/**
 * 获取租户详情（编辑模式）
 */
const fetchTenantDetail = async (id: string) => {
  loading.value = true
  try {
    const detail = await tenantStore.fetchTenantDetail(id)
    Object.assign(formData, {
      tenantName: detail.tenantName,
      creditCode: detail.creditCode,
      businessLicense: detail.businessLicense,
      adminName: detail.adminName,
      adminPhone: detail.adminPhone,
      contactName: detail.contactName,
      contactPhone: detail.contactPhone,
      packageId: detail.packageId,
      tenantType: detail.tenantType,
      status: detail.status
    })
  } catch (error) {
    console.error('获取租户详情失败:', error)
    ElMessage.error('获取租户详情失败')
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
      const id = route.params.id as string
      await tenantStore.updateTenant(id, formData)
      ElMessage.success('更新成功')
    } else {
      await tenantStore.createTenant(formData)
      ElMessage.success('创建成功')
    }

    router.back()
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
 * 取消
 */
const handleCancel = () => {
  router.back()
}

onMounted(async () => {
  await fetchPackageOptions()

  const id = route.params.id as string
  if (id && id !== 'add') {
    isEdit.value = true
    await fetchTenantDetail(id)
  }
})
</script>

<style scoped>
.tenant-form-container {
  padding: 20px;
}

.form-card {
  max-width: 900px;
  margin: 0 auto;
}

.form-actions {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 40px;
  padding-top: 20px;
  border-top: 1px solid #ebeef5;
}

.form-tip {
  font-size: 12px;
  color: #909399;
  margin-top: 4px;
}

:deep(.el-divider__text) {
  font-weight: 600;
  color: #303133;
}

@media screen and (max-width: 768px) {
  .form-card {
    max-width: 100%;
  }

  :deep(.el-form-item__label) {
    width: 120px !important;
  }

  .form-actions {
    flex-direction: column;
  }

  .form-actions > * {
    width: 100%;
  }
}
</style>
