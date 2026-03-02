<template>
  <div class="flow-management-detail-container">
    <el-card v-loading="loading">
      <template #header>
        <div class="card-header">
          <span>流程详情</span>
          <div class="header-actions">
            <el-button type="primary" link @click="handleEdit">
              <el-icon><Edit /></el-icon>
              编辑
            </el-button>
            <el-button type="primary" link @click="handleBack">
              <el-icon><Back /></el-icon>
              返回
            </el-button>
          </div>
        </div>
      </template>

      <div v-if="flowData">
        <!-- 基本信息 -->
        <div class="info-section">
          <div class="section-title">基本信息</div>
          <el-descriptions :column="2" border>
            <el-descriptions-item label="流程名称">
              {{ flowData.flowName }}
            </el-descriptions-item>
            <el-descriptions-item label="流程编码">
              {{ flowData.flowCode }}
            </el-descriptions-item>
            <el-descriptions-item label="流程类型">
              {{ flowTypeMap[flowData.flowType] || flowData.flowType }}
            </el-descriptions-item>
            <el-descriptions-item label="流程状态">
              <el-tag :type="flowData.flowStatus === FlowStatus.ENABLED ? 'success' : 'info'" size="small">
                {{ flowData.flowStatus === FlowStatus.ENABLED ? '启用' : '停用' }}
              </el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="节点数量">
              {{ flowData.nodeCount || 0 }}
            </el-descriptions-item>
            <el-descriptions-item label="是否默认">
              <el-tag :type="flowData.isDefault ? 'success' : 'info'" size="small">
                {{ flowData.isDefault ? '是' : '否' }}
              </el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="创建时间" :span="2">
              {{ flowData.createTime }}
            </el-descriptions-item>
            <el-descriptions-item label="更新时间" :span="2">
              {{ flowData.updateTime }}
            </el-descriptions-item>
            <el-descriptions-item label="流程描述" :span="2">
              {{ flowData.flowDescription || '-' }}
            </el-descriptions-item>
            <el-descriptions-item label="备注" :span="2">
              {{ flowData.remark || '-' }}
            </el-descriptions-item>
          </el-descriptions>
        </div>

        <!-- 审批节点 -->
        <div class="info-section" v-if="flowData.nodes && flowData.nodes.length > 0">
          <div class="section-title">审批节点</div>
          <el-timeline>
            <el-timeline-item
              v-for="(node, index) in flowData.nodes"
              :key="node.id"
              :timestamp="`节点 ${index + 1}`"
              placement="top"
            >
              <el-card class="node-card">
                <div class="node-header">
                  <div class="node-name">
                    <el-icon><User /></el-icon>
                    {{ node.nodeName }}
                  </div>
                  <div class="node-tags">
                    <el-tag :type="node.nodeType === 'APPROVAL' ? 'primary' : 'info'" size="small">
                      {{ node.nodeType === 'APPROVAL' ? '审批人' : '抄送人' }}
                    </el-tag>
                    <el-tag v-if="node.approvalMode" :type="node.approvalMode === 'OR' ? 'warning' : 'success'" size="small">
                      {{ node.approvalMode === 'OR' ? '或签' : '会签' }}
                    </el-tag>
                  </div>
                </div>
                <div class="node-info">
                  <div class="info-item">
                    <span class="label">节点编码：</span>
                    <span class="value">{{ node.nodeCode }}</span>
                  </div>
                  <div class="info-item">
                    <span class="label">审批人类型：</span>
                    <span class="value">{{ approverTypeMap[node.approverType] || node.approverType }}</span>
                  </div>
                  <div class="info-item" v-if="node.approverConfig">
                    <span class="label">审批人配置：</span>
                    <span class="value">{{ node.approverConfig }}</span>
                  </div>
                  <div class="info-item" v-if="node.ccUsers">
                    <span class="label">抄送人：</span>
                    <span class="value">{{ node.ccUsers }}</span>
                  </div>
                  <div class="info-item" v-if="node.timeoutHours">
                    <span class="label">超时时间：</span>
                    <span class="value">{{ node.timeoutHours }} 小时</span>
                  </div>
                  <div class="info-item" v-if="node.timeoutAction">
                    <span class="label">超时操作：</span>
                    <span class="value">{{ node.timeoutAction }}</span>
                  </div>
                  <div class="info-item" v-if="node.remark">
                    <span class="label">备注：</span>
                    <span class="value">{{ node.remark }}</span>
                  </div>
                </div>
              </el-card>
            </el-timeline-item>
          </el-timeline>
        </div>

        <!-- 空状态 -->
        <el-empty v-else description="暂无审批节点" />
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Back, Edit, User } from '@element-plus/icons-vue'
import { getApprovalFlowDetail } from '@/api/system/flowConfigApi'
import type { ApprovalFlow } from '@/types/flow-config'
import { FlowStatus } from '@/types/flow-config'

// 路由
const router = useRouter()
const route = useRoute()

// 流程ID
const flowId = Number(route.params.id)

// 加载状态
const loading = ref(false)

// 流程数据
const flowData = ref<ApprovalFlow | null>(null)

// 流程类型映射
const flowTypeMap: Record<string, string> = {
  LEAVE: '请假审批',
  TRANSFER: '调岗审批',
  RESIGNATION: '离职审批',
  REGISTRATION: '报名审批'
}

// 审批人类型映射
const approverTypeMap: Record<string, string> = {
  ROLE: '角色',
  DEPARTMENT: '部门',
  POSITION: '岗位',
  USER: '用户',
  FORM_FIELD: '表单字段'
}

// 获取流程详情
const fetchDetail = async () => {
  loading.value = true
  try {
    const response = await getApprovalFlowDetail(flowId)
    flowData.value = response.data
  } catch (error) {
    ElMessage.error('获取流程详情失败')
    console.error(error)
    handleBack()
  } finally {
    loading.value = false
  }
}

// 编辑
const handleEdit = () => {
  router.push(`/admin/system/flow-management/edit/${flowId}`)
}

// 返回
const handleBack = () => {
  router.back()
}

// 初始化
onMounted(() => {
  fetchDetail()
})
</script>

<style scoped>
.flow-management-detail-container {
  padding: 20px;
  background-color: #f5f7fa;
  min-height: calc(100vh - 60px);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-actions {
  display: flex;
  gap: 8px;
}

.info-section {
  margin-bottom: 32px;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 16px;
  padding-left: 12px;
  border-left: 4px solid #409eff;
}

.node-card {
  margin-bottom: 16px;
}

.node-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.node-name {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 600;
  color: #303133;
}

.node-tags {
  display: flex;
  gap: 8px;
}

.node-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.info-item {
  display: flex;
  align-items: flex-start;
  font-size: 14px;
}

.info-item .label {
  min-width: 100px;
  color: #909399;
  flex-shrink: 0;
}

.info-item .value {
  color: #303133;
  flex: 1;
}

/* 响应式设计 */
@media screen and (max-width: 768px) {
  .flow-management-detail-container {
    padding: 12px;
  }

  .card-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }

  .header-actions {
    width: 100%;
    justify-content: flex-start;
  }

  :deep(.el-descriptions) {
    --el-descriptions-table-border: 1px solid #ebeef5;
  }

  :deep(.el-descriptions__label) {
    width: 100px;
  }

  .node-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }

  .node-tags {
    width: 100%;
    flex-wrap: wrap;
  }

  .info-item {
    flex-direction: column;
  }

  .info-item .label {
    min-width: auto;
  }
}
</style>
