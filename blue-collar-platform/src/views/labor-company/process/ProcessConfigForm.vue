<template>
  <div class="process-config-form">
    <el-card>
      <el-form
        ref="formRef"
        :model="formData"
        :rules="formRules"
        label-width="120px"
      >
        <el-form-item label="业务代码" prop="businessCode">
          <el-input v-model="formData.businessCode" placeholder="请输入业务代码" maxlength="50" />
        </el-form-item>
        
        <el-form-item label="业务名称" prop="businessName">
          <el-input v-model="formData.businessName" placeholder="请输入业务名称" maxlength="100" />
        </el-form-item>
        
        <el-form-item label="流程名称" prop="processId">
          <el-select v-model="formData.processId" placeholder="请选择流程" style="width: 100%">
            <el-option v-for="process in processes" :key="process.id" :label="process.name" :value="process.id" />
          </el-select>
        </el-form-item>
      </el-form>
    </el-card>
    
    <!-- 底部按钮栏 -->
    <div class="form-footer">
      <el-button @click="goBack">
        <el-icon><ArrowLeft /></el-icon>
        返回
      </el-button>
      <el-button type="primary" @click="handleSubmit">
        <el-icon><Check /></el-icon>
        保存
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useRouter, useRoute } from 'vue-router'
import { ArrowLeft, Check } from '@element-plus/icons-vue'

// 路由实例
const router = useRouter()
const route = useRoute()

// 表单引用
const formRef = ref()

// 表单数据
const formData = reactive({
  id: '',
  businessCode: '',
  businessName: '',
  processId: ''
})

// 表单验证规则
const formRules = reactive({
  businessCode: [{ required: true, message: '请输入业务代码', trigger: 'blur' }],
  businessName: [{ required: true, message: '请输入业务名称', trigger: 'blur' }],
  processId: [{ required: true, message: '请选择流程', trigger: 'change' }]
})

// 流程列表（模拟数据）
const processes = ref([
  { id: 1, name: '请假流程' },
  { id: 2, name: '报销流程' }
])

// 配置列表（模拟数据）
const configList = ref([
  {
    id: 1,
    businessCode: 'leave',
    businessName: '请假管理',
    processId: 1,
    processName: '请假流程'
  },
  {
    id: 2,
    businessCode: 'transfer',
    businessName: '调岗管理',
    processId: 1,
    processName: '请假流程'
  },
  {
    id: 3,
    businessCode: 'expense',
    businessName: '费用报销',
    processId: 2,
    processName: '报销流程'
  }
])

// 保存配置
const handleSubmit = async () => {
  if (!formRef.value) return
  
  await formRef.value.validate(async (valid: boolean) => {
    if (valid) {
      // 保存逻辑
      if (formData.id) {
        // 编辑
        const index = configList.value.findIndex(item => item.id === formData.id)
        if (index > -1) {
          const process = processes.value.find(p => p.id === formData.processId)
          configList.value[index] = {
            ...formData,
            processName: process?.name || ''
          }
          ElMessage.success('编辑成功')
        }
      } else {
        // 新增
        const process = processes.value.find(p => p.id === formData.processId)
        const newConfig = {
          id: Date.now(),
          ...formData,
          processName: process?.name || ''
        }
        configList.value.push(newConfig)
        ElMessage.success('新增成功')
      }
      
      // 跳转回列表页
      router.push('/tenant/process-config')
    }
  })
}

// 返回
const goBack = () => {
  router.push('/tenant/process-config')
}

// 初始化数据
onMounted(() => {
  const id = route.params.id
  if (id) {
    // 编辑模式，加载数据
    const config = configList.value.find(item => item.id === Number(id))
    if (config) {
      formData.id = config.id
      formData.businessCode = config.businessCode
      formData.businessName = config.businessName
      formData.processId = config.processId
    }
  }
})
</script>

<style scoped>
.process-config-form {
  padding: 20px;
  height: 100%;
  display: flex;
  flex-direction: column;
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
  
  .process-config-form {
    padding-bottom: 120px;
  }
}
</style>