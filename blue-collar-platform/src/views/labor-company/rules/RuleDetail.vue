<template>
  <div class="rule-detail">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>规则详情</span>
        </div>
      </template>
      
      <div class="detail-content">
        <div>测试内容</div>
        <div>规则ID: {{ id }}</div>
        <el-descriptions :column="1" border>
          <el-descriptions-item label="规则名称">
            {{ ruleDetail.name }}
          </el-descriptions-item>
          <el-descriptions-item label="规则类型">
            {{ ruleDetail.type }}
          </el-descriptions-item>
          <el-descriptions-item label="生效日期">
            {{ ruleDetail.effectiveDate }}
          </el-descriptions-item>
          <el-descriptions-item label="生效状态">
            <el-tag :type="ruleDetail.status === 'active' ? 'success' : 'info'">
              {{ ruleDetail.status === 'active' ? '生效' : '未生效' }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="规则说明">
            {{ ruleDetail.description }}
          </el-descriptions-item>
        </el-descriptions>
      </div>
    </el-card>

    <!-- 底部按钮栏 -->
    <div class="detail-footer">
      <el-button @click="goBack">
        <el-icon><ArrowLeft /></el-icon>
        返回
      </el-button>
      <el-button type="primary" @click="handleEdit">
        <el-icon><Edit /></el-icon>
        编辑
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ArrowLeft, Edit } from '@element-plus/icons-vue'

const router = useRouter()
const route = useRoute()

// 响应式数据
const id = ref(route.params.id)
const ruleDetail = reactive({
  id: '4',
  name: '注册平台用户规则',
  type: 'PLATFORM_USER_REGISTRATION',
  effectiveDate: '2024-01-01',
  description: '租户新增的工人或正式员工将自动推送到平台验证是否为新用户，如果为新用户将自动完成注册，同时平台向租户定期结算拉新奖励',
  status: 'inactive'
})

// 返回
const goBack = () => {
  router.push('/tenant/rules')
}

// 编辑
const handleEdit = () => {
  router.push(`/tenant/rules/form/${ruleDetail.id}`)
}

// 生命周期
onMounted(() => {
  console.log('Component mounted')
  console.log('Route params:', route.params)
  console.log('Rule detail:', ruleDetail)
})
</script>

<style scoped>
.rule-detail {
  padding: 16px;
  background-color: #f5f7fa;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.detail-content {
  margin-top: 20px;
}

.detail-footer {
  display: flex;
  justify-content: center;
  gap: 12px;
  padding: 16px;
  background-color: #f5f7fa;
  border-top: 1px solid #e4e7ed;
  margin-top: 20px;
  position: sticky;
  bottom: 0;
  z-index: 100;
}

/* 响应式适配 */
@media screen and (max-width: 768px) {
  .detail-footer {
    flex-direction: column;
  }
  
  .detail-footer .el-button {
    width: 100%;
  }
}
</style>