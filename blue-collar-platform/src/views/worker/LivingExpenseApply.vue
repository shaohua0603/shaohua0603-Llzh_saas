<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useRouter } from 'vue-router'
import BackButton from '../../components/BackButton.vue'

const router = useRouter()
const loading = ref(true)
const currentDate = ref(new Date())
const applyAmount = ref(0)

// 工人基本信息
const workerInfo = ref({
  entryDate: '2026-01-01', // 进厂日期
  dailyRate: 50, // 每日单价
  abnormalHours: 5, // 考勤异常数（小时）
  appliedAmount: 150 // 已申请的生活费
})

// 计算可申请的生活费
const availableAmount = computed(() => {
  const entryDate = new Date(workerInfo.value.entryDate)
  const startCalculateDate = new Date(entryDate)
  startCalculateDate.setDate(startCalculateDate.getDate() + 7) // 进厂日期+7
  
  // 计算天数差
  const dayDiff = Math.floor((currentDate.value.getTime() - startCalculateDate.getTime()) / (1000 * 60 * 60 * 24)) + 1 // +1
  
  // 进厂后满8天开始累计计算
  if (dayDiff < 1) {
    return 0
  }
  
  // 计算考勤异常扣除（每天按10小时计算）
  const abnormalDeduction = (workerInfo.value.abnormalHours / 10) * workerInfo.value.dailyRate
  
  // 计算可申请的生活费
  const calculatedAmount = (workerInfo.value.dailyRate * dayDiff) - abnormalDeduction - workerInfo.value.appliedAmount
  
  return Math.max(0, calculatedAmount)
})

// 提交申请
const submitApply = () => {
  if (applyAmount.value <= 0) {
    ElMessage.warning('请输入有效的申请金额')
    return
  }
  
  if (applyAmount.value > availableAmount.value) {
    ElMessage.warning('申请金额不能超过可申请金额')
    return
  }
  
  ElMessageBox.confirm('确定要申请 ' + applyAmount.value.toFixed(2) + ' 元生活费吗？', '申请确认', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    // 模拟提交申请
    ElMessage.success('生活费申请提交成功，等待审批')
    // 更新已申请的生活费
    workerInfo.value.appliedAmount += applyAmount.value
    // 返回上一页
    router.push('/worker/living-expense')
  }).catch(() => {
    // 取消申请
  })
}

// 页面加载时获取数据
onMounted(() => {
  // 初始化申请金额为可申请金额
  applyAmount.value = availableAmount.value
  loading.value = false
})
</script>

<template>
  <div class="living-expense-apply">
    <!-- 页面标题 -->
    <div class="page-header">
      <div class="header-left">
        <BackButton />
        <h2>生活费申请</h2>
      </div>
    </div>
    
    <!-- 申请表单 -->
    <div class="apply-content">
      <div v-if="loading" class="loading-container">
        <el-skeleton :rows="8" animated />
      </div>
      
      <div v-else class="apply-form">
        <!-- 申请信息 -->
        <div class="info-section">
          <h3 class="section-title">申请信息</h3>
          <div class="info-card">
            <div class="info-item">
              <div class="info-label">进厂日期</div>
              <div class="info-value">{{ workerInfo.entryDate }}</div>
            </div>
            <div class="info-item">
              <div class="info-label">每日单价</div>
              <div class="info-value">¥{{ workerInfo.dailyRate.toFixed(2) }}</div>
            </div>
            <div class="info-item">
              <div class="info-label">考勤异常</div>
              <div class="info-value">{{ workerInfo.abnormalHours }}小时</div>
            </div>
            <div class="info-item">
              <div class="info-label">已申请金额</div>
              <div class="info-value">¥{{ workerInfo.appliedAmount.toFixed(2) }}</div>
            </div>
          </div>
        </div>
        
        <!-- 申请金额 -->
        <div class="amount-section">
          <h3 class="section-title">申请金额</h3>
          <div class="amount-card">
            <div class="amount-item">
              <div class="amount-label">可申请金额</div>
              <div class="amount-value">¥{{ availableAmount.toFixed(2) }}</div>
            </div>
            <div class="amount-item">
              <div class="amount-label">申请金额</div>
              <el-input-number
                v-model="applyAmount"
                :min="0"
                :max="availableAmount"
                :step="10"
                class="amount-input"
              />
            </div>
          </div>
        </div>
        
        <!-- 申请规则 -->
        <div class="rule-section">
          <h3 class="section-title">申请规则</h3>
          <div class="rule-card">
            <ul>
              <li>进厂后满8天开始累计计算</li>
              <li>申请金额 = 每日单价 × 【当前日期 - （进厂日期 + 7）+1】</li>
              <li>扣除考勤异常数（小时，每天按10小时计算）</li>
              <li>扣除已发放的生活费</li>
            </ul>
          </div>
        </div>
        
        <!-- 提交按钮 -->
        <div class="submit-section">
          <el-button type="primary" class="submit-button" @click="submitApply" :disabled="availableAmount <= 0 || applyAmount <= 0">
            提交申请
          </el-button>
          <el-button class="cancel-button" @click="router.back()">
            取消
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.living-expense-apply {
  min-height: 100vh;
  background-color: #f5f5f5;
}

.page-header {
  background-color: #fff;
  padding: 15px;
  border-bottom: 1px solid #eaeaea;
  position: sticky;
  top: 0;
  z-index: 10;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 10px;
}

.header-left h2 {
  margin: 0;
  font-size: 18px;
  font-weight: bold;
  color: #333;
}

.apply-content {
  padding: 20px;
}

.loading-container {
  background-color: #fff;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
}

.section-title {
  font-size: 16px;
  font-weight: bold;
  color: #333;
  margin: 0 0 16px 0;
  padding-left: 8px;
  border-left: 4px solid #667eea;
}

.info-card,
.amount-card,
.rule-card {
  background-color: #fff;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  margin-bottom: 24px;
}

.info-item,
.amount-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.info-item:last-child,
.amount-item:last-child {
  margin-bottom: 0;
}

.info-label,
.amount-label {
  font-size: 14px;
  color: #666;
  font-weight: 500;
}

.info-value,
.amount-value {
  font-size: 16px;
  font-weight: bold;
  color: #333;
}

.amount-value {
  color: #667eea;
}

.amount-input {
  width: 200px;
}

.rule-card ul {
  margin: 0;
  padding-left: 20px;
}

.rule-card li {
  margin-bottom: 12px;
  font-size: 14px;
  color: #666;
  line-height: 1.4;
}

.submit-section {
  display: flex;
  gap: 16px;
  margin-top: 32px;
}

.submit-button {
  flex: 1;
  height: 48px;
  font-size: 16px;
  font-weight: 500;
}

.cancel-button {
  flex: 1;
  height: 48px;
  font-size: 16px;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .apply-content {
    padding: 15px;
  }
  
  .info-card,
  .amount-card,
  .rule-card {
    padding: 16px;
    margin-bottom: 20px;
  }
  
  .amount-input {
    width: 150px;
  }
  
  .submit-section {
    flex-direction: column;
    gap: 12px;
  }
  
  .submit-button,
  .cancel-button {
    height: 44px;
    font-size: 14px;
  }
}
</style>