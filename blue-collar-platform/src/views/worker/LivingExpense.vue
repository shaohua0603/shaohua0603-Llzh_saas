<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
import BackButton from '../../components/BackButton.vue'

const router = useRouter()
const livingExpenses = ref([]) // 已发放的生活费记录
const loading = ref(true)
const currentDate = ref(new Date())

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
  
  // 计算已发放的生活费
  const paidAmount = livingExpenses.value.reduce((total, expense) => total + expense.amount, 0)
  
  // 计算可申请的生活费
  const calculatedAmount = (workerInfo.value.dailyRate * dayDiff) - abnormalDeduction - paidAmount - workerInfo.value.appliedAmount
  
  return Math.max(0, calculatedAmount)
})

// 计算本月生活费总额
const monthlyTotal = computed(() => {
  const currentMonth = currentDate.value.getMonth() + 1
  const currentYear = currentDate.value.getFullYear()
  
  return livingExpenses.value
    .filter(expense => {
      const expenseDate = new Date(expense.date)
      return expenseDate.getMonth() + 1 === currentMonth && expenseDate.getFullYear() === currentYear
    })
    .reduce((total, expense) => total + expense.amount, 0)
})

// 生成已发放的生活费记录
const generateLivingExpenses = () => {
  const expenses = []
  const today = new Date()
  const startDate = new Date(today)
  startDate.setDate(startDate.getDate() - 30) // 生成最近30天的数据
  
  let id = 1
  for (let d = new Date(startDate); d <= today; d.setDate(d.getDate() + 1)) {
    const dateStr = d.toISOString().split('T')[0]
    const isYesterday = d.toDateString() === new Date(today.getTime() - 86400000).toDateString()
    
    // 模拟已发放的生活费记录
    if (Math.random() > 0.7) { // 30%的概率有发放记录
      expenses.push({
        id: id++,
        date: dateStr,
        amount: 50,
        description: `${d.getMonth() + 1}月${d.getDate()}日生活费发放`
      })
    }
  }
  
  return expenses.reverse() // 倒序排列，最近的在前
}

// 获取生活费记录
const getLivingExpenses = () => {
  loading.value = true
  try {
    // 生成已发放的生活费记录
    const mockData = generateLivingExpenses()
    livingExpenses.value = mockData
  } catch (error) {
    console.error('获取生活费记录失败:', error)
    ElMessage.error('获取生活费记录失败，请稍后重试')
  } finally {
    loading.value = false
  }
}

// 打开申请表单（跳转到新页面）
const openApplyForm = () => {
  if (availableAmount.value <= 0) {
    ElMessage.warning('暂无可申请的生活费')
    return
  }
  // 跳转到生活费申请页面
  router.push('/worker/living-expense-apply')
}

// 页面加载时获取数据
onMounted(() => {
  getLivingExpenses()
})
</script>

<template>
  <div class="living-expense">
    <!-- 页面标题 -->
    <div class="page-header">
      <div class="header-left">
        <BackButton />
        <h2>生活费申请</h2>
      </div>
      <div class="header-right">
        <el-button type="primary" @click="openApplyForm" :disabled="availableAmount <= 0">
          申请生活费
        </el-button>
      </div>
    </div>
    
    <!-- 生活费记录列表 -->
    <div class="living-expense-content">
      <!-- 申请信息概览 -->
      <div v-if="!loading" class="overview-section">
        <div class="overview-card">
          <div class="overview-item">
            <div class="overview-label">可申请金额</div>
            <div class="overview-value">¥{{ availableAmount.toFixed(2) }}</div>
          </div>
          <div class="overview-item">
            <div class="overview-label">进厂日期</div>
            <div class="overview-value">{{ workerInfo.entryDate }}</div>
          </div>
          <div class="overview-item">
            <div class="overview-label">每日单价</div>
            <div class="overview-value">¥{{ workerInfo.dailyRate.toFixed(2) }}</div>
          </div>
        </div>
        
        <div class="info-card">
          <div class="info-item">
            <div class="info-label">考勤异常</div>
            <div class="info-value">{{ workerInfo.abnormalHours }}小时</div>
          </div>
          <div class="info-item">
            <div class="info-label">已申请金额</div>
            <div class="info-value">¥{{ workerInfo.appliedAmount.toFixed(2) }}</div>
          </div>
          <div class="info-item">
            <div class="info-label">已发放金额</div>
            <div class="info-value">¥{{ monthlyTotal.toFixed(2) }}</div>
          </div>
        </div>
      </div>
      
      <div v-if="loading" class="loading-container">
        <el-skeleton :rows="5" animated />
      </div>
      
      <div v-else-if="livingExpenses.length === 0" class="empty-container">
        <div class="empty-icon">
          <i class="el-icon-info"></i>
        </div>
        <p class="empty-text">暂无生活费发放记录</p>
      </div>
      
      <div v-else class="living-expense-list">
        <h3 class="section-title">已发放记录</h3>
        <div v-for="expense in livingExpenses" :key="expense.id" class="living-expense-item">
          <div class="expense-header">
            <span class="expense-date">{{ expense.date }}</span>
            <span class="expense-amount">¥{{ expense.amount.toFixed(2) }}</span>
          </div>
          <div class="expense-description">
            {{ expense.description }}
          </div>
        </div>
      </div>
    </div>
    

  </div>
</template>

<style scoped>
.living-expense {
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

.header-right {
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

.section-title {
  font-size: 16px;
  font-weight: bold;
  color: #333;
  margin: 0 0 16px 0;
  padding-left: 8px;
  border-left: 4px solid #667eea;
}

.info-card {
  background-color: #fff;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  margin-top: 16px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.info-item {
  text-align: center;
  padding: 0 12px;
}

.info-label {
  font-size: 14px;
  color: #666;
  margin-bottom: 8px;
}

.info-value {
  font-size: 18px;
  font-weight: bold;
  color: #333;
}

.apply-form {
  padding: 16px 0;
}

.form-item {
  margin-bottom: 20px;
}

.form-label {
  display: block;
  font-size: 14px;
  color: #333;
  margin-bottom: 8px;
  font-weight: 500;
}

.form-value {
  font-size: 16px;
  color: #667eea;
  font-weight: bold;
}

.form-input {
  width: 100%;
}

.form-note {
  margin-top: 24px;
  padding: 16px;
  background-color: #f5f5f5;
  border-radius: 8px;
}

.form-note p {
  margin: 0 0 12px 0;
  font-weight: bold;
  color: #333;
}

.form-note ul {
  margin: 0;
  padding-left: 20px;
}

.form-note li {
  margin-bottom: 8px;
  font-size: 14px;
  color: #666;
  line-height: 1.4;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .info-card {
    grid-template-columns: 1fr;
    gap: 12px;
  }
  
  .info-value {
    font-size: 16px;
  }
  
  .apply-form {
    padding: 8px 0;
  }
  
  .form-note {
    padding: 12px;
  }
}

.living-expense-content {
  padding: 20px;
}

.overview-section {
  margin-bottom: 24px;
}

.overview-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 16px;
  padding: 24px;
  color: white;
  box-shadow: 0 8px 32px rgba(102, 126, 234, 0.25);
}

.overview-item {
  text-align: center;
  padding: 0 16px;
}

.overview-label {
  font-size: 14px;
  opacity: 0.9;
  margin-bottom: 8px;
}

.overview-value {
  font-size: 24px;
  font-weight: bold;
}

.overview-card {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .overview-card {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  
  .overview-value {
    font-size: 20px;
  }
}

.loading-container {
  background-color: #fff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.empty-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #fff;
  border-radius: 8px;
  padding: 60px 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.empty-icon {
  font-size: 48px;
  color: #999;
  margin-bottom: 16px;
}

.empty-text {
  font-size: 14px;
  color: #999;
  margin: 0;
}

.living-expense-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.living-expense-item {
  background-color: #fff;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.living-expense-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.expense-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.expense-date {
  font-size: 14px;
  color: #666;
  font-weight: 500;
}

.expense-amount {
  font-size: 20px;
  font-weight: bold;
  color: #667eea;
}

.expense-description {
  font-size: 14px;
  color: #999;
  line-height: 1.4;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .living-expense-content {
    padding: 15px;
  }
  
  .living-expense-item {
    padding: 16px;
  }
  
  .expense-amount {
    font-size: 18px;
  }
}
</style>