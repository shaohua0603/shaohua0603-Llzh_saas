<template>
  <div class="detail-container">
    <div class="detail-content">
      <!-- 基本信息 -->
      <el-card class="mb-4">
        <template #header>
          <div class="card-header">
            <span>基本信息</span>
          </div>
        </template>
        <el-form label-width="120px" :disabled="true">
          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item label="奖惩人员">
                <el-input v-model="rewardPunishmentData.workerName" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="手机号">
                <el-input v-model="rewardPunishmentData.phone" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="奖惩类型">
                <el-tag :type="getRewardPunishmentTypeTag(rewardPunishmentData.rewardPunishmentType)">
                  {{ getRewardPunishmentTypeText(rewardPunishmentData.rewardPunishmentType) }}
                </el-tag>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item label="奖惩时间">
                <el-input v-model="rewardPunishmentData.rewardPunishmentTime" />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-card>

      <!-- 奖惩内容 -->
      <el-card class="mb-4">
        <template #header>
          <div class="card-header">
            <span>奖惩内容</span>
          </div>
        </template>
        <el-form label-width="120px" :disabled="true">
          <el-form-item label="奖惩内容">
            <el-input v-model="rewardPunishmentData.content" type="textarea" :rows="4" />
          </el-form-item>
          <el-form-item label="奖惩备注">
            <el-input v-model="rewardPunishmentData.remark" type="textarea" :rows="3" />
          </el-form-item>
        </el-form>
      </el-card>
    </div>

    <div class="detail-footer">
      <el-button @click="goBack">
        <el-icon><ArrowLeft /></el-icon>
        返回
      </el-button>
      <el-button type="primary" @click="handleEdit">
        <el-icon><Edit /></el-icon>
        编辑
      </el-button>
      <el-button type="danger" @click="handleDelete">
        <el-icon><Delete /></el-icon>
        删除
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { ArrowLeft, Edit, Delete } from '@element-plus/icons-vue'
import { useRoute, useRouter } from 'vue-router'

const router = useRouter()
const route = useRoute()

// 奖惩数据
const rewardPunishmentData = ref({
  id: '',
  workerName: '',
  phone: '',
  rewardPunishmentType: '',
  rewardPunishmentTime: '',
  content: '',
  remark: ''
})

// 获取奖惩类型标签
const getRewardPunishmentTypeTag = (type: string) => {
  const map: Record<string, string> = {
    honor: 'success',
    money: 'success',
    other_reward: 'success',
    verbal: 'warning',
    fine: 'danger',
    other_punishment: 'danger'
  }
  return map[type] || 'info'
}

// 获取奖惩类型文本
const getRewardPunishmentTypeText = (type: string) => {
  const map: Record<string, string> = {
    honor: '荣誉奖励',
    money: '金额奖励',
    other_reward: '其他奖励',
    verbal: '口头惩罚',
    fine: '金额惩罚',
    other_punishment: '其他惩罚'
  }
  return map[type] || type
}

// 编辑
const handleEdit = () => {
  router.push(`/tenant/on-duty/reward-punishment-edit/${rewardPunishmentData.value.id}`)
}

// 删除
const handleDelete = () => {
  ElMessageBox.confirm('确定要删除该奖惩记录吗?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    // 模拟删除
    ElMessage.success('删除成功')
    router.push('/tenant/on-duty/reward-punishment')
  }).catch(() => {})
}

// 返回
const goBack = () => {
  router.back()
}

// 生命周期
onMounted(() => {
  const id = route.params.id
  console.log('奖惩详情ID:', id)
  
  // 模拟获取数据
  setTimeout(() => {
    rewardPunishmentData.value = {
      id: id as string,
      workerName: '张三',
      phone: '13800138001',
      rewardPunishmentType: 'honor',
      rewardPunishmentTime: '2024-02-15 10:00:00',
      content: '优秀员工称号',
      remark: '年度优秀员工'
    }
  }, 300)
})
</script>

<style scoped>
.detail-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #f5f7fa;
}

.detail-content {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  padding-bottom: 80px;
}

.detail-footer {
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

.mb-4 {
  margin-bottom: 16px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* 响应式适配 */
@media screen and (max-width: 768px) {
  .detail-footer {
    left: 0;
    flex-direction: column;
  }
  
  .detail-footer .el-button {
    width: 100%;
  }
  
  .detail-content {
    padding-bottom: 120px;
  }
}
</style>