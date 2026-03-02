<template>
  <div class="node-configurator">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="120px"
      class="node-form"
    >
      <!-- 节点基本信息 -->
      <div class="form-section">
        <div class="section-title">节点基本信息</div>

        <el-form-item label="节点名称" prop="nodeName">
          <el-input
            v-model="formData.nodeName"
            placeholder="请输入节点名称"
            clearable
            maxlength="50"
            show-word-limit
          />
        </el-form-item>

        <el-form-item label="节点类型" prop="nodeType">
          <el-select
            v-model="formData.nodeType"
            placeholder="请选择节点类型"
            style="width: 100%"
            @change="handleNodeTypeChange"
          >
            <el-option label="审批节点" :value="NodeType.APPROVAL">
              <span>审批节点</span>
              <span style="color: #909399; font-size: 12px; margin-left: 8px">需要审批人进行审批</span>
            </el-option>
            <el-option label="抄送节点" :value="NodeType.CC">
              <span>抄送节点</span>
              <span style="color: #909399; font-size: 12px; margin-left: 8px">仅通知相关人员</span>
            </el-option>
            <el-option label="条件节点" :value="NodeType.CONDITION">
              <span>条件节点</span>
              <span style="color: #909399; font-size: 12px; margin-left: 8px">根据条件判断流程走向</span>
            </el-option>
          </el-select>
        </el-form-item>
      </div>

      <!-- 审批配置（仅审批节点显示） -->
      <div v-if="formData.nodeType === NodeType.APPROVAL" class="form-section">
        <div class="section-title">审批配置</div>

        <el-form-item label="审批模式" prop="approvalMode">
          <el-radio-group v-model="formData.approvalMode">
            <el-radio :value="ApprovalMode.OR">
              <div class="radio-content">
                <div class="radio-label">或签</div>
                <div class="radio-desc">一人通过即可</div>
              </div>
            </el-radio>
            <el-radio :value="ApprovalMode.AND">
              <div class="radio-content">
                <div class="radio-label">会签</div>
                <div class="radio-desc">所有人都需通过</div>
              </div>
            </el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="审批人类型" prop="approverType">
          <el-select
            v-model="formData.approverType"
            placeholder="请选择审批人类型"
            style="width: 100%"
            @change="handleApproverTypeChange"
          >
            <el-option label="角色" :value="ApproverType.ROLE">
              <span>角色</span>
              <span style="color: #909399; font-size: 12px; margin-left: 8px">根据角色自动分配</span>
            </el-option>
            <el-option label="部门" :value="ApproverType.DEPARTMENT">
              <span>部门</span>
              <span style="color: #909399; font-size: 12px; margin-left: 8px">根据部门自动分配</span>
            </el-option>
            <el-option label="岗位" :value="ApproverType.POSITION">
              <span>岗位</span>
              <span style="color: #909399; font-size: 12px; margin-left: 8px">根据岗位自动分配</span>
            </el-option>
            <el-option label="指定用户" :value="ApproverType.USER">
              <span>指定用户</span>
              <span style="color: #909399; font-size: 12px; margin-left: 8px">手动选择具体人员</span>
            </el-option>
            <el-option label="表单字段" :value="ApproverType.FORM_FIELD">
              <span>表单字段</span>
              <span style="color: #909399; font-size: 12px; margin-left: 8px">根据表单字段动态分配</span>
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="审批人列表" prop="approvers">
          <el-select
            v-model="formData.approvers"
            multiple
            placeholder="请选择审批人"
            filterable
            collapse-tags
            collapse-tags-tooltip
            style="width: 100%"
            :loading="approverLoading"
          >
            <el-option
              v-for="item in approverOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
          <div class="form-tip">
            <el-icon><InfoFilled /></el-icon>
            <span>{{ getApproverTip() }}</span>
          </div>
        </el-form-item>
      </div>

      <!-- 抄送配置（仅抄送节点显示） -->
      <div v-if="formData.nodeType === NodeType.CC" class="form-section">
        <div class="section-title">抄送配置</div>

        <el-form-item label="抄送人类型" prop="approverType">
          <el-select
            v-model="formData.approverType"
            placeholder="请选择抄送人类型"
            style="width: 100%"
            @change="handleApproverTypeChange"
          >
            <el-option label="角色" :value="ApproverType.ROLE" />
            <el-option label="部门" :value="ApproverType.DEPARTMENT" />
            <el-option label="岗位" :value="ApproverType.POSITION" />
            <el-option label="指定用户" :value="ApproverType.USER" />
            <el-option label="表单字段" :value="ApproverType.FORM_FIELD" />
          </el-select>
        </el-form-item>

        <el-form-item label="抄送人列表" prop="approvers">
          <el-select
            v-model="formData.approvers"
            multiple
            placeholder="请选择抄送人"
            filterable
            collapse-tags
            collapse-tags-tooltip
            style="width: 100%"
            :loading="approverLoading"
          >
            <el-option
              v-for="item in approverOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
      </div>

      <!-- 条件配置（仅条件节点显示） -->
      <div v-if="formData.nodeType === NodeType.CONDITION" class="form-section">
        <div class="section-title">条件配置</div>

        <el-form-item label="条件表达式" prop="conditionConfig">
          <el-input
            v-model="formData.conditionConfig"
            type="textarea"
            :rows="4"
            placeholder="请输入条件表达式，例如：amount > 1000 && department == '财务部'"
            clearable
          />
          <div class="form-tip">
            <el-icon><InfoFilled /></el-icon>
            <span>支持使用表单字段和逻辑运算符，如：&&（与）、||（或）、>、<、==、!=</span>
          </div>
        </el-form-item>
      </div>

      <!-- 超时配置 -->
      <div v-if="formData.nodeType === NodeType.APPROVAL || formData.nodeType === NodeType.CC" class="form-section">
        <div class="section-title">超时配置</div>

        <el-form-item label="超时时间">
          <el-input-number
            v-model="formData.timeoutHours"
            :min="1"
            :max="720"
            :step="1"
            controls-position="right"
            placeholder="请输入超时时间"
          />
          <span style="margin-left: 8px; color: #909399">小时</span>
        </el-form-item>

        <el-form-item label="超时处理方式">
          <el-select
            v-model="formData.timeoutAction"
            placeholder="请选择超时处理方式"
            style="width: 100%"
          >
            <el-option label="自动通过" value="auto_approve">
              <span>自动通过</span>
              <span style="color: #909399; font-size: 12px; margin-left: 8px">超时后自动通过审批</span>
            </el-option>
            <el-option label="自动驳回" value="auto_reject">
              <span>自动驳回</span>
              <span style="color: #909399; font-size: 12px; margin-left: 8px">超时后自动驳回审批</span>
            </el-option>
            <el-option label="提醒审批人" value="remind">
              <span>提醒审批人</span>
              <span style="color: #909399; font-size: 12px; margin-left: 8px">超时后发送提醒消息</span>
            </el-option>
          </el-select>
        </el-form-item>
      </div>

      <!-- 自动审批配置 -->
      <div v-if="formData.nodeType === NodeType.APPROVAL" class="form-section">
        <div class="section-title">自动审批配置</div>

        <el-form-item label="启用自动审批">
          <el-switch
            v-model="formData.autoApprove"
            active-text="启用"
            inactive-text="禁用"
          />
          <div class="form-tip">
            <el-icon><InfoFilled /></el-icon>
            <span>启用后，满足条件时系统将自动进行审批，无需人工干预</span>
          </div>
        </el-form-item>

        <el-form-item v-if="formData.autoApprove" label="自动审批结果" prop="autoApproveResult">
          <el-radio-group v-model="formData.autoApproveResult">
            <el-radio value="approved">
              <span style="color: #67c23a">通过</span>
            </el-radio>
            <el-radio value="rejected">
              <span style="color: #f56c6c">驳回</span>
            </el-radio>
          </el-radio-group>
        </el-form-item>
      </div>

      <!-- 操作按钮 -->
      <el-form-item>
        <el-button type="primary" :icon="Check" @click="handleSubmit">
          保存配置
        </el-button>
        <el-button :icon="RefreshLeft" @click="handleReset">
          重置
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { Check, RefreshLeft, InfoFilled } from '@element-plus/icons-vue'
import type { FormInstance, FormRules } from 'element-plus'
import type {
  NodeType,
  ApprovalMode,
  ApproverType,
  ApprovalNode
} from '../types/flow-config'

// Props定义
interface NodeConfiguratorProps {
  /** 节点数据 */
  node?: Partial<ApprovalNode>
  /** 是否只读模式 */
  readonly?: boolean
}

const props = withDefaults(defineProps<NodeConfiguratorProps>(), {
  readonly: false
})

// Emits定义
interface NodeConfiguratorEmits {
  /** 节点配置更新 */
  (e: 'update', node: Partial<ApprovalNode>): void
  /** 节点配置保存 */
  (e: 'save', node: Partial<ApprovalNode>): void
  /** 节点配置取消 */
  (e: 'cancel'): void
}

const emit = defineEmits<NodeConfiguratorEmits>()

// 表单引用
const formRef = ref<FormInstance>()

// 审批人加载状态
const approverLoading = ref(false)

// 审批人选项
const approverOptions = ref<Array<{ label: string; value: string }>>([])

// 表单数据
const formData = ref<Partial<ApprovalNode>>({
  nodeName: '',
  nodeType: NodeType.APPROVAL,
  approvalMode: ApprovalMode.OR,
  approverType: ApproverType.ROLE,
  approvers: [],
  conditionConfig: '',
  timeoutHours: 24,
  timeoutAction: 'remind',
  autoApprove: false,
  autoApproveResult: 'approved'
})

// 表单验证规则
const formRules = computed<FormRules>(() => ({
  nodeName: [
    { required: true, message: '请输入节点名称', trigger: 'blur' },
    { min: 2, max: 50, message: '节点名称长度在 2 到 50 个字符', trigger: 'blur' }
  ],
  nodeType: [
    { required: true, message: '请选择节点类型', trigger: 'change' }
  ],
  approvalMode: [
    { required: true, message: '请选择审批模式', trigger: 'change' }
  ],
  approverType: [
    { required: true, message: '请选择审批人类型', trigger: 'change' }
  ],
  approvers: [
    {
      required: true,
      message: '请选择审批人',
      trigger: 'change',
      validator: (rule, value, callback) => {
        if (formData.value.nodeType === NodeType.APPROVAL || formData.value.nodeType === NodeType.CC) {
          if (!value || value.length === 0) {
            callback(new Error('请选择审批人'))
          } else {
            callback()
          }
        } else {
          callback()
        }
      }
    }
  ],
  conditionConfig: [
    {
      required: true,
      message: '请输入条件表达式',
      trigger: 'blur',
      validator: (rule, value, callback) => {
        if (formData.value.nodeType === NodeType.CONDITION) {
          if (!value || value.trim() === '') {
            callback(new Error('请输入条件表达式'))
          } else {
            callback()
          }
        } else {
          callback()
        }
      }
    }
  ]
}))

// 节点类型变化处理
const handleNodeTypeChange = () => {
  // 重置审批人列表
  formData.value.approvers = []
  // 根据节点类型设置默认审批人类型
  if (formData.value.nodeType === NodeType.APPROVAL) {
    formData.value.approverType = ApproverType.ROLE
  } else if (formData.value.nodeType === NodeType.CC) {
    formData.value.approverType = ApproverType.USER
  }
  // 加载审批人选项
  loadApproverOptions()
}

// 审批人类型变化处理
const handleApproverTypeChange = () => {
  // 清空审批人列表
  formData.value.approvers = []
  // 加载审批人选项
  loadApproverOptions()
}

// 加载审批人选项
const loadApproverOptions = async () => {
  approverLoading.value = true
  try {
    // 根据审批人类型加载不同的选项
    const approverType = formData.value.approverType

    // 模拟数据，实际应该从API获取
    await new Promise(resolve => setTimeout(resolve, 300))

    if (approverType === ApproverType.ROLE) {
      approverOptions.value = [
        { label: '管理员', value: 'role_admin' },
        { label: '部门经理', value: 'role_manager' },
        { label: '财务主管', value: 'role_finance' },
        { label: '人事主管', value: 'role_hr' }
      ]
    } else if (approverType === ApproverType.DEPARTMENT) {
      approverOptions.value = [
        { label: '技术部', value: 'dept_tech' },
        { label: '财务部', value: 'dept_finance' },
        { label: '人事部', value: 'dept_hr' },
        { label: '市场部', value: 'dept_market' }
      ]
    } else if (approverType === ApproverType.POSITION) {
      approverOptions.value = [
        { label: '总经理', value: 'pos_gm' },
        { label: '部门经理', value: 'pos_manager' },
        { label: '主管', value: 'pos_supervisor' },
        { label: '专员', value: 'pos_specialist' }
      ]
    } else if (approverType === ApproverType.USER) {
      approverOptions.value = [
        { label: '张三', value: 'user_001' },
        { label: '李四', value: 'user_002' },
        { label: '王五', value: 'user_003' },
        { label: '赵六', value: 'user_004' }
      ]
    } else if (approverType === ApproverType.FORM_FIELD) {
      approverOptions.value = [
        { label: '申请人', value: 'field_applicant' },
        { label: '部门负责人', value: 'field_dept_manager' },
        { label: '项目经理', value: 'field_project_manager' }
      ]
    }
  } catch (error) {
    ElMessage.error('加载审批人选项失败')
    approverOptions.value = []
  } finally {
    approverLoading.value = false
  }
}

// 获取审批人提示信息
const getApproverTip = (): string => {
  const typeMap: Record<ApproverType, string> = {
    [ApproverType.ROLE]: '选择角色后，该角色的所有成员都将收到审批任务',
    [ApproverType.DEPARTMENT]: '选择部门后，该部门的负责人将收到审批任务',
    [ApproverType.POSITION]: '选择岗位后，该岗位的人员将收到审批任务',
    [ApproverType.USER]: '选择具体的用户，这些用户将收到审批任务',
    [ApproverType.FORM_FIELD]: '选择表单字段后，系统将根据表单提交时的字段值动态分配审批人'
  }
  return typeMap[formData.value.approverType || ApproverType.ROLE] || ''
}

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return

  try {
    await formRef.value.validate()
    emit('save', formData.value)
    ElMessage.success('节点配置保存成功')
  } catch (error) {
    ElMessage.warning('请检查表单填写是否正确')
  }
}

// 重置表单
const handleReset = () => {
  if (!formRef.value) return

  formRef.value.resetFields()
  // 重新设置默认值
  formData.value = {
    nodeName: '',
    nodeType: NodeType.APPROVAL,
    approvalMode: ApprovalMode.OR,
    approverType: ApproverType.ROLE,
    approvers: [],
    conditionConfig: '',
    timeoutHours: 24,
    timeoutAction: 'remind',
    autoApprove: false,
    autoApproveResult: 'approved'
  }
  emit('cancel')
}

// 监听节点数据变化
watch(
  () => props.node,
  (newNode) => {
    if (newNode) {
      formData.value = { ...formData.value, ...newNode }
      // 加载审批人选项
      if (formData.value.approverType) {
        loadApproverOptions()
      }
    }
  },
  { immediate: true, deep: true }
)

// 监听表单数据变化
watch(
  formData,
  (newData) => {
    emit('update', newData)
  },
  { deep: true }
)

// 暴露方法
defineExpose({
  /** 获取表单数据 */
  getFormData: () => formData.value,
  /** 验证表单 */
  validate: () => formRef.value?.validate(),
  /** 重置表单 */
  reset: () => handleReset()
})

// 生命周期
onMounted(() => {
  // 初始化加载审批人选项
  if (formData.value.approverType) {
    loadApproverOptions()
  }
})
</script>

<style scoped>
.node-configurator {
  width: 100%;
  padding: 20px;
  background-color: #fff;
  border-radius: 4px;
}

.node-form {
  max-width: 800px;
}

.form-section {
  margin-bottom: 32px;
  padding-bottom: 24px;
  border-bottom: 1px solid #ebeef5;
}

.form-section:last-child {
  border-bottom: none;
  margin-bottom: 0;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 20px;
  padding-left: 12px;
  border-left: 4px solid #409eff;
}

.radio-content {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.radio-label {
  font-weight: 500;
  color: #303133;
}

.radio-desc {
  font-size: 12px;
  color: #909399;
}

.form-tip {
  display: flex;
  align-items: flex-start;
  gap: 6px;
  margin-top: 8px;
  padding: 8px 12px;
  background-color: #f5f7fa;
  border-radius: 4px;
  font-size: 12px;
  color: #606266;
  line-height: 1.5;
}

.form-tip .el-icon {
  margin-top: 1px;
  flex-shrink: 0;
  color: #909399;
}

/* 响应式设计 */
@media screen and (max-width: 768px) {
  .node-configurator {
    padding: 16px;
  }

  .node-form {
    max-width: 100%;
  }

  .form-section {
    margin-bottom: 24px;
    padding-bottom: 16px;
  }

  .section-title {
    font-size: 14px;
    margin-bottom: 16px;
  }
}
</style>
