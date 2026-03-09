<template>
  <div class="workflow-form-container">
    <!-- 页面标题 -->
    <div class="page-header">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>系统管理</el-breadcrumb-item>
        <el-breadcrumb-item><router-link to="/admin/system/workflow-config">工作流配置</router-link></el-breadcrumb-item>
        <el-breadcrumb-item>{{ isEdit ? '编辑工作流' : '新增工作流' }}</el-breadcrumb-item>
      </el-breadcrumb>
      <h1 class="page-title">{{ isEdit ? '编辑工作流' : '新增工作流' }}</h1>
    </div>

    <!-- 表单卡片 -->
    <el-card class="workflow-form-card">
      <!-- 基本信息表单 -->
      <el-form :model="workflowForm" label-width="120px">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="工作流名称" required>
              <el-input v-model="workflowForm.flowName" placeholder="请输入工作流名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="工作流编码" required>
              <el-input v-model="workflowForm.flowCode" placeholder="请输入工作流编码" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="工作流类型">
              <el-select v-model="workflowForm.flowType" placeholder="请选择工作流类型" style="width: 100%">
                <el-option label="审批流程" value="APPROVAL" />
                <el-option label="业务流程" value="BUSINESS" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="工作流状态">
              <el-switch
                v-model="workflowForm.flowStatusEnabled"
                active-text="启用"
                inactive-text="禁用"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="工作流描述">
          <el-input
            type="textarea"
            v-model="workflowForm.flowDescription"
            placeholder="请输入工作流描述"
            :rows="3"
          />
        </el-form-item>
      </el-form>

      <!-- 流程设计器 -->
      <div class="designer-section">
        <h3 class="section-title">流程设计</h3>
        <div class="designer-container">
          <LogicFlowDesigner
            ref="designerRef"
            v-model="workflowForm.xmlData"
            @save="handleDesignerSave"
          />
        </div>
      </div>
    </el-card>

    <!-- 底部按钮栏 -->
    <div class="form-footer">
      <el-button @click="handleBack">
        <el-icon><ArrowLeft /></el-icon>
        返回
      </el-button>
      <el-button type="primary" @click="handleSubmit">
        <el-icon><Check /></el-icon>
        {{ isEdit ? '保存修改' : '创建' }}
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { ArrowLeft, Check } from '@element-plus/icons-vue'
import LogicFlowDesigner from '@/components/LogicFlowDesigner.vue'
import { getWorkflowDetail, createWorkflow, updateWorkflow } from '@/api/system/flowConfigApi'
import type { WorkflowForm } from '@/types/flow-config'

const router = useRouter()
const route = useRoute()

// 组件引用
const designerRef = ref<any>(null)

// 路由参数
const isEdit = computed(() => !!route.params.id)
const workflowId = computed(() => Number(route.params.id))
const copyFromId = computed(() => Number(route.query.copyFrom))

// 表单数据
const workflowForm = reactive({
  flowName: '',
  flowCode: '',
  flowType: 'APPROVAL',
  flowStatusEnabled: true,
  flowDescription: '',
  xmlData: ''
})

// 计算属性
const flowStatus = computed({
  get: () => workflowForm.flowStatusEnabled ? 'ENABLED' : 'DISABLED',
  set: (value) => {
    workflowForm.flowStatusEnabled = value === 'ENABLED'
  }
})

// 获取工作流详情
const fetchWorkflowDetail = async (id: number) => {
  try {
    const response = await getWorkflowDetail(id)
    workflowForm.flowName = response.flowName
    workflowForm.flowCode = response.flowCode
    workflowForm.flowType = response.flowType
    flowStatus.value = response.flowStatus
    workflowForm.flowDescription = response.flowDescription || ''
    workflowForm.xmlData = response.xmlData || ''
  } catch (error) {
    ElMessage.error('获取工作流详情失败')
    console.error(error)
    handleBack()
  }
}

// 处理设计器保存
const handleDesignerSave = (data: any) => {
  console.log('Designer saved:', data)
}

// 提交表单
const handleSubmit = async () => {
  // 表单验证
  if (!workflowForm.flowName) {
    ElMessage.error('请输入工作流名称')
    return
  }
  if (!workflowForm.flowCode) {
    ElMessage.error('请输入工作流编码')
    return
  }
  if (!workflowForm.xmlData) {
    ElMessage.error('请设计流程')
    return
  }

  try {
    const formData: WorkflowForm = {
      flowName: workflowForm.flowName,
      flowCode: workflowForm.flowCode,
      flowType: workflowForm.flowType,
      flowStatus: flowStatus.value,
      flowDescription: workflowForm.flowDescription,
      xmlData: workflowForm.xmlData
    }

    if (isEdit.value) {
      await updateWorkflow(workflowId.value, formData)
      ElMessage.success('更新成功')
    } else {
      await createWorkflow(formData)
      ElMessage.success('创建成功')
    }

    handleBack()
  } catch (error) {
    ElMessage.error(isEdit.value ? '更新失败' : '创建失败')
    console.error(error)
  }
}

// 返回
const handleBack = () => {
  router.push('/admin/system/workflow-config')
}

// 生命周期
onMounted(async () => {
  if (isEdit.value) {
    await fetchWorkflowDetail(workflowId.value)
  } else if (copyFromId.value) {
    await fetchWorkflowDetail(copyFromId.value)
    // 复制时重置名称和编码
    workflowForm.flowName = `${workflowForm.flowName} (复制)`
    workflowForm.flowCode = `${workflowForm.flowCode}_copy`
  }
})
</script>

<style scoped>
.workflow-form-container {
  padding: 16px;
  background-color: #f5f7fa;
  min-height: 100vh;
}

.page-header {
  margin-bottom: 20px;
}

.page-title {
  font-size: 20px;
  font-weight: 600;
  margin: 10px 0;
  color: #333;
}

.workflow-form-card {
  margin-bottom: 80px;
}

.designer-section {
  margin-top: 30px;
  border-top: 1px solid #e4e7ed;
  padding-top: 20px;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 16px;
  color: #333;
}

.designer-container {
  border: 1px solid #e4e7ed;
  border-radius: 4px;
  overflow: hidden;
  min-height: 600px;
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

/* 响应式设计 */
@media screen and (max-width: 768px) {
  .form-footer {
    left: 0;
    flex-direction: column;
  }

  .designer-container {
    min-height: 400px;
  }
}
</style>