<template>
  <div class="form-container">
    <!-- 内容区域 -->
    <div class="form-content">
      <el-card>
        <el-form ref="formRef" :model="formData" :rules="rules" label-width="120px">
          <!-- 基础信息 -->
          <el-form-item label="模板名称" prop="templateName">
            <el-input v-model="formData.templateName" placeholder="请输入模板名称" />
          </el-form-item>
          
          <el-form-item label="模板编码" prop="templateCode">
            <el-input v-model="formData.templateCode" placeholder="请输入模板编码" />
          </el-form-item>
          
          <el-form-item label="模板类型" prop="templateType">
            <el-select v-model="formData.templateType" placeholder="请选择模板类型">
              <el-option label="合同类" value="contract" />
              <el-option label="证明类" value="proof" />
              <el-option label="表单类" value="form" />
              <el-option label="证书类" value="certificate" />
              <el-option label="其他" value="other" />
            </el-select>
          </el-form-item>
          
          <el-form-item label="模板描述">
            <el-input v-model="formData.description" type="textarea" placeholder="请输入模板描述" />
          </el-form-item>
          
          <el-form-item label="模板内容" prop="templateContent">
            <RichTextEditor 
              v-model="formData.templateContent" 
              :height="400" 
              :placeholder="'请输入模板内容'"
              :variables="formatVariablesForEditor"
              @update:variables="formData.variables = $event"
            />
          </el-form-item>
          
          <!-- 变量管理 -->
          <el-form-item label="变量管理">
            <el-button type="primary" size="small" @click="openVariableDialog">
              <el-icon><Plus /></el-icon>
              添加变量
            </el-button>
            
            <el-table :data="formData.variables" style="margin-top: 16px" border>
              <el-table-column prop="variableName" label="变量名称" width="120" />
              <el-table-column prop="variableCode" label="变量编码" width="120" />
              <el-table-column prop="variableType" label="变量类型" width="100">
                <template #default="scope">
                  {{ getVariableTypeLabel(scope.row.variableType) }}
                </template>
              </el-table-column>
              <el-table-column prop="required" label="是否必填" width="80">
                <template #default="scope">
                  <el-tag :type="scope.row.required ? 'success' : 'info'">
                    {{ scope.row.required ? '是' : '否' }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="description" label="变量描述" />
              <el-table-column label="操作" width="120" fixed="right">
                <template #default="scope">
                  <el-button 
                    type="primary" 
                    size="small" 
                    @click="editVariable(scope.row)"
                  >
                    编辑
                  </el-button>
                  <el-button 
                    type="danger" 
                    size="small" 
                    @click="deleteVariable(scope.$index)"
                  >
                    删除
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-form-item>
          
          <el-form-item label="状态" prop="status" v-if="isEdit">
            <el-switch
              v-model="formData.status"
              active-value="published"
              inactive-value="draft"
              active-text="已发布"
              inactive-text="草稿"
            />
          </el-form-item>
        </el-form>
      </el-card>
    </div>
    
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
    
    <!-- 变量编辑对话框 -->
    <el-dialog
      v-model="variableDialogVisible"
      :title="editingVariable !== null ? '编辑变量' : '添加变量'"
      width="500px"
    >
      <el-form ref="variableFormRef" :model="variableForm" :rules="variableRules" label-width="100px">
        <el-form-item label="变量名称" prop="variableName">
          <el-input v-model="variableForm.variableName" placeholder="请输入变量名称" />
        </el-form-item>
        
        <el-form-item label="变量编码" prop="variableCode">
          <el-input v-model="variableForm.variableCode" placeholder="请输入变量编码" />
        </el-form-item>
        
        <el-form-item label="变量类型" prop="variableType">
          <el-select v-model="variableForm.variableType" placeholder="请选择变量类型">
            <el-option label="文本" value="text" />
            <el-option label="日期" value="date" />
            <el-option label="数字" value="number" />
            <el-option label="图片" value="image" />
          </el-select>
        </el-form-item>
        
        <el-form-item label="是否必填" prop="required">
          <el-switch v-model="variableForm.required" />
        </el-form-item>
        
        <el-form-item label="变量描述">
          <el-input v-model="variableForm.description" type="textarea" placeholder="请输入变量描述" />
        </el-form-item>
      </el-form>
      
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="variableDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="saveVariable">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { ArrowLeft, Check, Plus } from '@element-plus/icons-vue'
import RichTextEditor from '@/components/RichTextEditor.vue'

// 路由和状态
const route = useRoute()
const router = useRouter()
const formRef = ref<any>(null)
const variableFormRef = ref<any>(null)

// 表单数据
const formData = reactive({
  id: '',
  templateName: '',
  templateCode: '',
  templateType: 'form',
  description: '',
  templateContent: '',
  variables: [] as Array<{
    variableName: string
    variableCode: string
    variableType: string
    required: boolean
    description: string
  }>,
  status: 'draft'
})

// 变量表单
const variableDialogVisible = ref(false)
const editingVariable = ref<number | null>(null)
const variableForm = reactive({
  variableName: '',
  variableCode: '',
  variableType: 'text',
  required: false,
  description: ''
})

// 计算属性
const isEdit = computed(() => !!route.params.id)

// 格式化变量列表以供编辑器使用
const formatVariablesForEditor = computed(() => {
  return formData.variables.map(variable => ({
    variableName: variable.variableCode,
    variableLabel: variable.variableName || variable.variableCode,
    variableType: variable.variableType,
    required: variable.required || false
  }))
})

// 表单验证规则
const rules = {
  templateName: [{ required: true, message: '请输入模板名称', trigger: 'blur' }],
  templateCode: [{ required: true, message: '请输入模板编码', trigger: 'blur' }],
  templateType: [{ required: true, message: '请选择模板类型', trigger: 'change' }],
  templateContent: [{ required: true, message: '请输入模板内容', trigger: 'blur' }]
}

// 变量验证规则
const variableRules = {
  variableName: [{ required: true, message: '请输入变量名称', trigger: 'blur' }],
  variableCode: [{ required: true, message: '请输入变量编码', trigger: 'blur' }],
  variableType: [{ required: true, message: '请选择变量类型', trigger: 'change' }]
}

// 模拟数据
const mockTemplates = [
  {
    id: '1',
    templateName: '工人信息模板',
    templateCode: 'worker_info_template',
    templateType: 'form',
    status: 'published',
    variables: [
      { variableName: 'workerName', variableLabel: '工人姓名', variableType: 'text', required: true },
      { variableName: 'workerId', variableLabel: '工号', variableType: 'text', required: true },
      { variableName: 'idCard', variableLabel: '身份证号', variableType: 'text', required: true },
      { variableName: 'phone', variableLabel: '手机号', variableType: 'text', required: true },
      { variableName: 'hireDate', variableLabel: '入职日期', variableType: 'date', required: true }
    ],
    createdBy: 'admin',
    createdAt: '2026-01-01 10:00:00'
  },
  {
    id: '2',
    templateName: '合同模板',
    templateCode: 'contract_template',
    templateType: 'contract',
    status: 'published',
    variables: [
      { variableName: 'contractNo', variableLabel: '合同编号', variableType: 'text', required: true },
      { variableName: 'workerName', variableLabel: '工人姓名', variableType: 'text', required: true },
      { variableName: 'companyName', variableLabel: '公司名称', variableType: 'text', required: true },
      { variableName: 'startDate', variableLabel: '开始日期', variableType: 'date', required: true },
      { variableName: 'endDate', variableLabel: '结束日期', variableType: 'date', required: true }
    ],
    createdBy: 'admin',
    createdAt: '2026-01-02 14:30:00'
  },
  {
    id: '3',
    templateName: '考勤记录模板',
    templateCode: 'attendance_template',
    templateType: 'form',
    status: 'published',
    variables: [
      { variableName: 'workerName', variableLabel: '工人姓名', variableType: 'text', required: true },
      { variableName: 'workerId', variableLabel: '工号', variableType: 'text', required: true },
      { variableName: 'month', variableLabel: '月份', variableType: 'text', required: true },
      { variableName: 'totalDays', variableLabel: '总天数', variableType: 'number', required: true },
      { variableName: 'absentDays', variableLabel: '缺勤天数', variableType: 'number', required: true }
    ],
    createdBy: 'admin',
    createdAt: '2026-01-03 09:15:00'
  },
  {
    id: '4',
    templateName: '工资单模板',
    templateCode: 'salary_template',
    templateType: 'form',
    status: 'published',
    variables: [
      { variableName: 'workerName', variableLabel: '工人姓名', variableType: 'text', required: true },
      { variableName: 'workerId', variableLabel: '工号', variableType: 'text', required: true },
      { variableName: 'month', variableLabel: '月份', variableType: 'text', required: true },
      { variableName: 'basicSalary', variableLabel: '基本工资', variableType: 'number', required: true },
      { variableName: 'overtimeSalary', variableLabel: '加班费', variableType: 'number', required: true },
      { variableName: 'totalSalary', variableLabel: '总工资', variableType: 'number', required: true }
    ],
    createdBy: 'admin',
    createdAt: '2026-01-04 16:45:00'
  }
]

// 生命周期
onMounted(() => {
  if (isEdit.value) {
    loadTemplateData()
  }
})

// 加载模板数据
const loadTemplateData = () => {
  const templateId = route.params.id as string
  const template = mockTemplates.find(t => t.id === templateId)
  
  if (template) {
    Object.assign(formData, template)
  } else {
    ElMessage.error('模板不存在')
    router.back()
  }
}

// 变量类型标签
const getVariableTypeLabel = (type: string) => {
  const typeMap: Record<string, string> = {
    text: '文本',
    number: '数字',
    date: '日期',
    image: '图片'
  }
  return typeMap[type] || type
}

// 打开变量对话框
const openVariableDialog = () => {
  editingVariable.value = null
  Object.assign(variableForm, {
    variableName: '',
    variableCode: '',
    variableType: 'text',
    required: false,
    description: ''
  })
  variableDialogVisible.value = true
}

// 编辑变量
const editVariable = (variable: any) => {
  editingVariable.value = formData.variables.indexOf(variable)
  Object.assign(variableForm, variable)
  variableDialogVisible.value = true
}

// 保存变量
const saveVariable = async () => {
  if (!variableFormRef.value) return
  
  try {
    await variableFormRef.value.validate()
    
    if (editingVariable.value !== null) {
      formData.variables[editingVariable.value] = { ...variableForm }
    } else {
      formData.variables.push({ ...variableForm })
    }
    
    variableDialogVisible.value = false
    ElMessage.success('变量保存成功')
  } catch (error) {
    // 验证失败
  }
}

// 删除变量
const deleteVariable = (index: number) => {
  ElMessageBox.confirm('确定要删除这个变量吗？', '删除变量', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    formData.variables.splice(index, 1)
    ElMessage.success('变量删除成功')
  }).catch(() => {
    // 取消删除
  })
}

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return
  
  try {
    await formRef.value.validate()
    
    // 模拟保存操作
    setTimeout(() => {
      ElMessage.success(isEdit.value ? '模板编辑成功' : '模板创建成功')
      router.push('/tenant/template-config')
    }, 500)
  } catch (error) {
    // 验证失败
  }
}

// 返回
const goBack = () => {
  router.back()
}
</script>

<style scoped>
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
  padding: 16px;
  padding-bottom: 80px;
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
  
  .form-content {
    padding-bottom: 120px;
  }
}
</style>