<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
import BackButton from '../../components/BackButton.vue'

const router = useRouter()

const salarySlips = ref([])
const loading = ref(true)

// 模拟工资条数据
const mockSalarySlips = [
  {
    id: 1,
    workerId: 10001,
    workerName: '张三',
    unit: '南通富民劳务服务有限公司',
    month: '2026-01',
    issueDate: '2026-02-05',
    // 工资清单
    salarySummary: {
      approvedBaseSalary: 4000,
      approvedPerformanceBonus: 400,
      approvedSupervisorAllowance: 0,
      requiredWorkDays: 23,
      grossSalary: 5489.19,
      deductions: 122.68,
      transferAmount: 5366.51,
      preTaxDeductions: 0,
      individualIncomeTax: 2.68,
      postTaxAdditions: 0
    },
    // 加项
    additions: {
      baseSalary: 4000,
      performanceBonus: 400,
      supervisorAllowance: 0,
      positionAllowance: 0,
      regularOvertimePay: 71.55,
      holidayOvertimePay: 190.8,
      nationalHolidayOvertimePay: 0,
      seniorityBonus: 0,
      attendanceBonus: 0,
      mealAllowance: 450,
      nightShiftAllowance: 0,
      referralBonus: 19.22,
      bonus1: 0,
      bonus2: 0,
      trainingAllowance: 0,
      highTemperatureAllowance: 0,
      otherAdditions: 0,
      negativeSalaryAdjustment: 0
    },
    // 扣项
    deductionsDetail: {
      miscarriageLeaveHours: 0,
      maternityLeaveHours: 0,
      personalLeaveHours: 0,
      absenteeismHours: 0,
      preTaxLeaveDeductions: 0,
      sickLeaveHours: 0,
      preTaxSickLeaveDeductions: 0,
      previousMonthNegativeSalary: 0,
      socialInsurancePersonal: 27.38,
      housingFundPersonal: 15,
      otherPostTaxDeductions: 0,
      postTaxMealDeductions: 0,
      postTaxDormitoryDeductions: 0
    },
    // 其他
    otherInfo: {
      entryMethod: '公司员工',
      contactMethod: '021-12345678转7777'
    },
    // 实发工资
    netSalary: 5366.51
  },
  {
    id: 2,
    workerId: 10001,
    workerName: '张三',
    unit: '南通富民劳务服务有限公司',
    month: '2025-12',
    issueDate: '2026-01-05',
    // 工资清单
    salarySummary: {
      approvedBaseSalary: 4000,
      approvedPerformanceBonus: 350,
      approvedSupervisorAllowance: 0,
      requiredWorkDays: 22,
      grossSalary: 5189.19,
      deductions: 112.68,
      transferAmount: 5076.51,
      preTaxDeductions: 0,
      individualIncomeTax: 2.68,
      postTaxAdditions: 0
    },
    // 加项
    additions: {
      baseSalary: 4000,
      performanceBonus: 350,
      supervisorAllowance: 0,
      positionAllowance: 0,
      regularOvertimePay: 51.55,
      holidayOvertimePay: 150.8,
      nationalHolidayOvertimePay: 0,
      seniorityBonus: 0,
      attendanceBonus: 0,
      mealAllowance: 450,
      nightShiftAllowance: 0,
      referralBonus: 19.22,
      bonus1: 0,
      bonus2: 0,
      trainingAllowance: 0,
      highTemperatureAllowance: 0,
      otherAdditions: 0,
      negativeSalaryAdjustment: 0
    },
    // 扣项
    deductionsDetail: {
      miscarriageLeaveHours: 0,
      maternityLeaveHours: 0,
      personalLeaveHours: 0,
      absenteeismHours: 0,
      preTaxLeaveDeductions: 0,
      sickLeaveHours: 0,
      preTaxSickLeaveDeductions: 0,
      previousMonthNegativeSalary: 0,
      socialInsurancePersonal: 27.38,
      housingFundPersonal: 15,
      otherPostTaxDeductions: 0,
      postTaxMealDeductions: 0,
      postTaxDormitoryDeductions: 0
    },
    // 其他
    otherInfo: {
      entryMethod: '公司员工',
      contactMethod: '021-12345678转7777'
    },
    // 实发工资
    netSalary: 5076.51
  }
]

// 获取工资条数据
const getSalarySlips = async () => {
  loading.value = true
  try {
    // 模拟异步请求
    setTimeout(() => {
      salarySlips.value = mockSalarySlips
      loading.value = false
    }, 500)
  } catch (error) {
    console.error('获取工资条数据失败:', error)
    ElMessage.error('获取工资条数据失败，请稍后重试')
    loading.value = false
  }
}

// 导航到工资条详情页
const navigateToDetail = (salaryId) => {
  router.push(`/worker/salary-detail/${salaryId}`)
}

// 页面加载时获取数据
onMounted(() => {
  getSalarySlips()
})
</script>

<template>
  <div class="worker-salary">
    <BackButton />
    <!-- 页面标题 -->
    <div class="page-header">
      <h2>工资条</h2>
    </div>
    
    <!-- 工资条列表 -->
    <div class="salary-list">
      <div v-if="loading" class="loading">
        <el-icon class="is-loading"><i class="el-icon-loading"></i></el-icon>
        <span>加载中...</span>
      </div>
      <div v-else-if="salarySlips.length === 0" class="empty">
        <el-icon><i class="el-icon-info"></i></el-icon>
        <span>暂无工资条记录</span>
      </div>
      <div v-else class="salary-items">
        <div v-for="salary in salarySlips" :key="salary.id" class="salary-item">
          <div class="salary-header">
            <div class="header-content">
              <h3>{{ salary.month }}月工资条</h3>
              <div class="header-meta">
                <span class="meta-item">发放日期: {{ salary.issueDate }}</span>
              </div>
            </div>
          </div>
          <!-- 员工基本信息 -->
          <div class="salary-content">
            <!-- 桌面端显示 -->
            <div class="salary-basic-info desktop">
              <div class="salary-basic-row">
                <span class="basic-label">员工姓名</span>
                <span class="basic-value">{{ salary.workerName }}</span>
                <span class="basic-label">工号</span>
                <span class="basic-value">{{ salary.workerId }}</span>
              </div>
              <div class="salary-basic-row">
                <span class="basic-label">单位</span>
                <span class="basic-value">{{ salary.unit }}</span>
                <span class="basic-label">发放日期</span>
                <span class="basic-value">{{ salary.issueDate }}</span>
              </div>
            </div>
            
            <!-- 移动端显示 -->
            <div class="salary-basic-info mobile">
              <div class="salary-basic-grid">
                <div class="basic-item">
                  <span class="basic-value">{{ salary.workerName }}</span>
                  <span class="basic-label-small">姓名</span>
                </div>
                <div class="basic-item">
                  <span class="basic-value">{{ salary.workerId }}</span>
                  <span class="basic-label-small">工号</span>
                </div>
                <div class="basic-item">
                  <span class="basic-value">{{ salary.unit }}</span>
                  <span class="basic-label-small">单位</span>
                </div>
                <div class="basic-item">
                  <span class="basic-value">{{ salary.issueDate }}</span>
                  <span class="basic-label-small">发放日期</span>
                </div>
              </div>
            </div>
            
            <div class="salary-net-pay">
              <span class="net-label">实发工资</span>
              <span class="net-value">{{ salary.netSalary }}元</span>
            </div>
          </div>
          
          <div class="salary-action">
            <el-button type="primary" link @click="navigateToDetail(salary.id)">查看详情</el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.worker-salary {
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
}

.page-header h2 {
  margin: 0;
  font-size: 18px;
  font-weight: bold;
  color: #333;
}

.salary-list {
  padding: 0 15px 20px;
}

.loading,
.empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 0;
  color: #999;
}

.loading i,
.empty i {
  font-size: 32px;
  margin-bottom: 10px;
}

.salary-items {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.salary-item {
  background-color: #fff;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  margin-bottom: 20px;
  position: relative;
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.salary-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
}

.salary-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 4px;
  height: 100%;
  background: linear-gradient(180deg, #667eea 0%, #764ba2 100%);
  border-radius: 4px 0 0 4px;
}

.salary-header {
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid #f5f5f5;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 10px;
}

.salary-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: bold;
  color: #333;
  font-family: 'Outfit', sans-serif;
  flex: 1;
}

.header-meta {
  display: flex;
  align-items: center;
  gap: 12px;
}

.meta-item {
  font-size: 13px;
  color: #666;
  background-color: #f8f9fa;
  padding: 4px 12px;
  border-radius: 12px;
  display: inline-block;
  white-space: nowrap;
}

/* 员工基本信息样式 */
.salary-info {
  margin-bottom: 15px;
  padding: 12px;
  background-color: #f8f9fa;
  border-radius: 6px;
}

.salary-info-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 10px;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.info-label {
  font-size: 11px;
  color: #666;
  font-weight: 500;
}

.info-value {
  font-size: 12px;
  color: #333;
}

.info-value.net {
  color: #667eea;
  font-weight: bold;
}

.salary-content {
  margin-bottom: 15px;
}

/* 响应式显示控制 */
.desktop {
  display: block;
}

.mobile {
  display: none;
}

.salary-basic-info {
  margin-bottom: 15px;
}

/* 桌面端布局 */
.salary-basic-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 8px 0;
}

.basic-label {
  font-size: 13px;
  color: #666;
}

.basic-value {
  font-size: 13px;
  color: #333;
  font-weight: 500;
}

/* 移动端布局 */
.salary-basic-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  margin-bottom: 15px;
}

.basic-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px;
  background-color: #f8f9fa;
  border-radius: 6px;
  text-align: center;
}

.basic-item .basic-value {
  font-size: 14px;
  font-weight: bold;
  color: #333;
  margin-bottom: 4px;
}

.basic-label-small {
  font-size: 11px;
  color: #666;
}

.salary-net-pay {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  background: linear-gradient(135deg, #f5f7ff 0%, #eef2ff 100%);
  border-radius: 10px;
  margin-bottom: 20px;
  border: 1px solid #e0e7ff;
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.1);
}

.net-label {
  font-size: 15px;
  font-weight: 600;
  color: #4b5563;
  font-family: 'Outfit', sans-serif;
}

.net-value {
  font-size: 22px;
  font-weight: bold;
  color: #667eea;
  font-family: 'Outfit', sans-serif;
  text-shadow: 0 1px 2px rgba(102, 126, 234, 0.2);
}

.salary-action {
  display: flex;
  justify-content: flex-end;
  padding-top: 16px;
  border-top: 1px solid #f5f5f5;
}

.salary-action .el-button {
  font-family: 'Outfit', sans-serif;
  font-weight: 600;
  font-size: 14px;
  color: #667eea;
  transition: all 0.3s ease;
}

.salary-action .el-button:hover {
  color: #764ba2;
  transform: translateX(4px);
}

.salary-action .el-button::after {
  content: ' →';
  font-size: 12px;
  transition: transform 0.3s ease;
}

.salary-action .el-button:hover::after {
  transform: translateX(2px);
}

.salary-label {
  font-size: 13px;
  color: #666;
}

.salary-value {
  font-size: 13px;
  color: #333;
}

.deduction {
  color: #ff6b6b;
}

.salary-footer {
  padding-top: 10px;
  border-top: 1px solid #f0f0f0;
}

.net-salary {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.net-salary .salary-label {
  font-size: 14px;
  font-weight: bold;
  color: #333;
}

.net-salary .salary-value {
  font-size: 16px;
  font-weight: bold;
  color: #667eea;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .page-header {
    padding: 12px 15px;
  }
  
  .page-header h2 {
    font-size: 16px;
  }
  
  .salary-list {
    padding: 0 10px 20px;
  }
  
  .salary-item {
    padding: 12px;
  }
  
  .salary-header h3 {
    font-size: 15px;
  }
  
  /* 员工基本信息移动端适配 */
  .salary-info {
    padding: 10px;
    margin-bottom: 12px;
  }
  
  .salary-info-row {
    grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
    gap: 8px;
  }
  
  .info-label {
    font-size: 10px;
  }
  
  .info-value {
    font-size: 11px;
  }
  
  /* 响应式显示控制 */
  .desktop {
    display: none;
  }

  .mobile {
    display: block;
  }

  /* 移动端布局调整 */
  .salary-item {
    padding: 16px;
    margin-bottom: 16px;
  }

  .header-content {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }

  .salary-header h3 {
    font-size: 16px;
  }

  .header-meta {
    gap: 8px;
  }

  .meta-item {
    font-size: 12px;
    padding: 3px 10px;
  }

  .salary-basic-grid {
    gap: 12px;
  }

  .basic-item {
    padding: 12px;
    background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
    border-radius: 8px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  }

  .basic-item .basic-value {
    font-size: 14px;
    font-weight: bold;
    color: #333;
  }

  .basic-label-small {
    font-size: 10px;
    color: #666;
    margin-top: 4px;
  }

  .salary-net-pay {
    padding: 12px 16px;
    margin-bottom: 16px;
  }

  .net-label {
    font-size: 14px;
  }

  .net-value {
    font-size: 18px;
  }

  .salary-action {
    padding-top: 12px;
  }
  
  .net-salary .salary-label {
    font-size: 13px;
  }
  
  .net-salary .salary-value {
    font-size: 15px;
  }
}

/* 小屏幕移动端适配 */
@media (max-width: 480px) {
  .salary-info-row {
    grid-template-columns: repeat(2, 1fr);
    gap: 8px;
  }
  
  .info-item {
    gap: 2px;
  }
  
  .info-label {
    font-size: 9px;
  }
  
  .info-value {
    font-size: 10px;
  }
}
</style>