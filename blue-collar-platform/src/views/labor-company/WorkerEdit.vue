<template>
  <div class="worker-edit">
    <el-card class="form-card">
      <template #header>
        <div class="card-header">
          <span>编辑工人</span>
        </div>
      </template>
      
      <el-form
        ref="formRef"
        :model="formData"
        :rules="formRules"
        label-width="120px"
        class="worker-form"
      >
        <el-form-item label="姓名" prop="name">
          <el-input v-model="formData.name" placeholder="请输入姓名" />
        </el-form-item>
        
        <el-form-item label="性别" prop="gender">
          <el-radio-group v-model="formData.gender">
            <el-radio label="男">男</el-radio>
            <el-radio label="女">女</el-radio>
          </el-radio-group>
        </el-form-item>
        
        <el-form-item label="年龄" prop="age">
          <el-input-number v-model="formData.age" :min="18" :max="60" placeholder="请输入年龄" />
        </el-form-item>
        
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="formData.phone" placeholder="请输入手机号" />
        </el-form-item>
        
        <el-form-item label="身份证号" prop="idCard">
          <el-input v-model="formData.idCard" placeholder="请输入身份证号" />
        </el-form-item>
        
        <el-form-item label="劳务公司" prop="laborCompany">
          <el-input v-model="formData.laborCompany" placeholder="请输入劳务公司" />
        </el-form-item>
        
        <el-form-item label="工厂名称" prop="factoryName">
          <el-input v-model="formData.factoryName" placeholder="请输入工厂名称" />
        </el-form-item>
        
        <el-form-item label="区域" prop="factoryArea">
          <el-input v-model="formData.factoryArea" placeholder="请输入区域" />
        </el-form-item>
        
        <el-form-item label="产线" prop="productionLine">
          <el-input v-model="formData.productionLine" placeholder="请输入产线" />
        </el-form-item>
        
        <el-form-item label="岗位类别" prop="positionType">
          <el-input v-model="formData.positionType" placeholder="请输入岗位类别" />
        </el-form-item>
        
        <el-form-item label="岗位名称" prop="positionName">
          <el-input v-model="formData.positionName" placeholder="请输入岗位名称" />
        </el-form-item>
        
        <el-form-item label="工人状态" prop="lifecycleStatus">
          <el-select v-model="formData.lifecycleStatus" placeholder="请选择工人状态">
            <el-option
              v-for="status in statusOptions"
              :key="status.value"
              :label="status.label"
              :value="status.value"
            />
          </el-select>
        </el-form-item>
        
        <el-form-item label="入职日期" prop="entryDate">
          <el-date-picker
            v-model="formData.entryDate"
            type="date"
            placeholder="请选择入职日期"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
          />
        </el-form-item>
      </el-form>
    </el-card>
    
    <div class="form-footer">
      <el-button @click="goBack">
        <el-icon><ArrowLeft /></el-icon>
        返回
      </el-button>
      <el-button type="primary" @click="handleSubmit">
        <el-icon><Check /></el-icon>
        提交
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage, ElForm } from 'element-plus'
import { ArrowLeft, Check } from '@element-plus/icons-vue'

const router = useRouter()
const route = useRoute()
const formRef = ref<InstanceType<typeof ElForm>>()
const loading = ref(false)

interface FormData {
  id: string
  name: string
  gender: string
  age: number
  phone: string
  idCard: string
  laborCompany: string
  factoryName: string
  factoryArea: string
  productionLine: string
  positionType: string
  positionName: string
  lifecycleStatus: string
  entryDate?: string
}

interface StatusOption {
  label: string
  value: string
}

const formData = reactive<FormData>({
  id: '',
  name: '',
  gender: '男',
  age: 0,
  phone: '',
  idCard: '',
  laborCompany: '',
  factoryName: '',
  factoryArea: '',
  productionLine: '',
  positionType: '',
  positionName: '',
  lifecycleStatus: 'REGISTERED',
  entryDate: ''
})

const statusOptions: StatusOption[] = [
  { label: '注册', value: 'REGISTERED' },
  { label: '接送', value: 'PICKUP' },
  { label: '劳务运维人员', value: 'STAFF_LABOR' },
  { label: '工厂正式人员', value: 'STAFF_FACTORY' },
  { label: '初次面试', value: 'FIRST_INTERVIEW' },
  { label: '合同签订', value: 'CONTRACT_SIGNED' },
  { label: '面试邀约', value: 'INTERVIEW_INVITATION' },
  { label: '工厂面试', value: 'FACTORY_INTERVIEW' },
  { label: '进厂', value: 'ENTERED' },
  { label: '离职', value: 'RESIGNED' }
]

const formRules = {
  name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
  gender: [{ required: true, message: '请选择性别', trigger: 'change' }],
  age: [{ required: true, message: '请输入年龄', trigger: 'blur' }],
  phone: [{ required: true, message: '请输入手机号', trigger: 'blur' }],
  idCard: [{ required: true, message: '请输入身份证号', trigger: 'blur' }],
  laborCompany: [{ required: true, message: '请输入劳务公司', trigger: 'blur' }],
  factoryName: [{ required: true, message: '请输入工厂名称', trigger: 'blur' }],
  factoryArea: [{ required: true, message: '请输入区域', trigger: 'blur' }],
  productionLine: [{ required: true, message: '请输入产线', trigger: 'blur' }],
  positionType: [{ required: true, message: '请输入岗位类别', trigger: 'blur' }],
  positionName: [{ required: true, message: '请输入岗位名称', trigger: 'blur' }],
  lifecycleStatus: [{ required: true, message: '请选择工人状态', trigger: 'change' }]
}

const goBack = () => {
  router.push('/labor-company/workers')
}

const fetchWorkerDetail = async () => {
  const id = route.params.id as string
  if (!id) {
    ElMessage.error('工人ID不存在')
    router.push('/labor-company/workers')
    return
  }
  
  loading.value = true
  try {
    // 模拟获取数据
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // 模拟数据
    const mockData = {
      id: id,
      name: '张三',
      gender: '男',
      age: 34,
      phone: '138****8001',
      idCard: '410101199005151234',
      laborCompany: '南通富民劳务服务有限公司',
      factoryName: '富士康科技集团',
      factoryArea: 'A区',
      productionLine: '智能手机组装',
      positionType: '普工',
      positionName: '操作工',
      lifecycleStatus: 'ENTERED',
      entryDate: '2023-01-15'
    }
    
    Object.assign(formData, mockData)
  } catch (error) {
    console.error('获取工人详情失败:', error)
    ElMessage.error('获取工人详情失败')
  } finally {
    loading.value = false
  }
}

const handleSubmit = async () => {
  if (!formRef.value) return
  
  try {
    await formRef.value.validate()
    
    // 模拟提交
    await new Promise(resolve => setTimeout(resolve, 500))
    
    ElMessage.success('编辑工人成功')
    router.push('/labor-company/workers')
  } catch (error) {
    console.error('提交失败:', error)
  }
}

onMounted(() => {
  fetchWorkerDetail()
})
</script>

<style scoped>
.worker-edit {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #f5f7fa;
}

.form-card {
  margin: 20px;
  flex: 1;
  overflow-y: auto;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.worker-form {
  margin-top: 20px;
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
}
</style>