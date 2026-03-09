<template>
  <div class="contract-form-page">
    <el-card class="form-card" shadow="never">
      <el-form
        ref="formRef"
        :model="formData"
        :rules="formRules"
        label-width="140px"
        :disabled="loading"
      >
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="姓名" prop="name">
              <el-input
                v-model="formData.name"
                placeholder="请输入姓名"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="手机号" prop="phone">
              <el-input
                v-model="formData.phone"
                placeholder="请输入手机号"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="证件号" prop="idCard">
              <el-input
                v-model="formData.idCard"
                placeholder="请输入证件号"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="签订日期" prop="signDate">
              <el-date-picker
                v-model="formData.signDate"
                type="date"
                placeholder="请选择签订日期"
                format="YYYY-MM-DD"
                value-format="YYYY-MM-DD"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="结算方式" prop="settlementMethod">
              <el-select
                v-model="formData.settlementMethod"
                placeholder="请选择结算方式"
                style="width: 100%"
              >
                <el-option
                  v-for="item in Object.values(SettlementMethodConfig)"
                  :key="item.code"
                  :label="item.name"
                  :value="item.code"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="负责人" prop="responsiblePerson">
              <el-input
                v-model="formData.responsiblePerson"
                placeholder="请输入负责人"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="群号" prop="groupId">
              <el-input
                v-model="formData.groupId"
                placeholder="请输入群号"
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="合同附件" prop="attachments">
              <el-upload
                class="upload-demo"
                action="#"
                :on-change="handleFileChange"
                :auto-upload="false"
                :file-list="formData.attachments"
                multiple
              >
                <el-button type="primary">
                  <el-icon><Upload /></el-icon>
                  选择文件
                </el-button>
                <template #tip>
                  <div class="el-upload__tip">
                    支持上传图片、PDF、Word等文件
                  </div>
                </template>
              </el-upload>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <div class="form-footer">
      <el-button @click="handleBack">
        <el-icon><ArrowLeft /></el-icon>
        返回
      </el-button>
      <el-button @click="handleSaveDraft" :loading="draftSaving">
        保存草稿
      </el-button>
      <el-button type="primary" @click="handleSubmit" :loading="submitting">
        提交
      </el-button>
    </div>


  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { ArrowLeft, Upload } from '@element-plus/icons-vue'
import type { UploadUserFile } from 'element-plus'

const router = useRouter()
const route = useRoute()

const isEdit = computed(() => !!route.params.id)
const formRef = ref()
const loading = ref(false)
const submitting = ref(false)
const draftSaving = ref(false)

const formData = ref({
  name: '',
  phone: '',
  idCard: '',
  signDate: '',
  settlementMethod: '',
  responsiblePerson: '',
  groupId: '',
  attachments: []
})

const SettlementMethodConfig = {
  DAILY: { code: 'DAILY', name: '日结' },
  MONTHLY: { code: 'MONTHLY', name: '月结' }
}

const formRules = {
  name: [
    { required: true, message: '请输入姓名', trigger: 'blur' },
    { max: 50, message: '姓名不能超过50个字符', trigger: 'blur' }
  ],
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
  ],
  idCard: [
    { required: true, message: '请输入证件号', trigger: 'blur' },
    { max: 20, message: '证件号不能超过20个字符', trigger: 'blur' }
  ],
  signDate: [
    { required: true, message: '请选择签订日期', trigger: 'change' }
  ],
  settlementMethod: [
    { required: true, message: '请选择结算方式', trigger: 'change' }
  ],
  responsiblePerson: [
    { required: true, message: '请输入负责人', trigger: 'blur' },
    { max: 50, message: '负责人不能超过50个字符', trigger: 'blur' }
  ],
  groupId: [
    { required: true, message: '请输入群号', trigger: 'blur' },
    { max: 50, message: '群号不能超过50个字符', trigger: 'blur' }
  ]
}

const handleFileChange = (file: UploadUserFile) => {
  if (file.raw) {
    formData.value.attachments.push(file)
  }
}

const handleSaveDraft = async () => {
  draftSaving.value = true
  try {
    // 模拟API延迟
    await new Promise(resolve => setTimeout(resolve, 500))
    ElMessage.success('草稿保存成功')
  } catch (error) {
    console.error(error)
    ElMessage.error('保存失败')
  } finally {
    draftSaving.value = false
  }
}

const handleSubmit = async () => {
  try {
    const valid = await formRef.value?.validate()
    if (!valid) {
      ElMessage.warning('请完善表单信息')
      return
    }

    submitting.value = true

    // 模拟API延迟
    await new Promise(resolve => setTimeout(resolve, 1000))

    ElMessage.success('提交成功')
    router.push({ name: 'LaborCompanyContract' })
  } catch (error) {
    console.error(error)
    ElMessage.error('提交失败')
  } finally {
    submitting.value = false
  }
}

const handleBack = () => {
  ElMessageBox.confirm('确定要返回吗？未保存的内容将丢失', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    router.push({ name: 'LaborCompanyContract' })
  }).catch(() => {})
}

onMounted(() => {
  // 可以在这里加载编辑数据
  if (isEdit.value) {
    // 模拟加载数据
    loading.value = true
    setTimeout(() => {
      // 模拟数据
      formData.value = {
        name: '张三',
        phone: '13800138000',
        idCard: '110101199001011234',
        signDate: '2024-01-01',
        settlementMethod: 'MONTHLY',
        responsiblePerson: '李四',
        groupId: '123456',
        attachments: []
      }
      loading.value = false
    }, 500)
  }
})
</script>

<style scoped>
.contract-form-page {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  padding: 16px;
  background-color: #f5f7fa;
}

.form-card {
  flex: 1;
  display: flex;
  flex-direction: column;
  margin-bottom: 0;
}

.form-card :deep(.el-card__body) {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  padding-bottom: 80px;
}

.person-select-wrapper {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.selected-person {
  display: flex;
  gap: 8px;
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

.worker-select-content {
  padding: 0;
}

@media screen and (max-width: 768px) {
  .contract-form-page {
    padding: 12px;
  }

  .form-card :deep(.el-card__body) {
    padding: 16px;
  }

  :deep(.el-row) {
    flex-direction: column;
  }

  :deep(.el-col) {
    width: 100% !important;
    max-width: 100%;
  }

  .form-footer {
    left: 0;
    flex-direction: column;
  }

  .form-footer .el-button {
    width: 100%;
  }
}
</style>
