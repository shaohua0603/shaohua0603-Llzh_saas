<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { useRoute, useRouter } from 'vue-router'
import BackButton from '../../components/BackButton.vue'

const route = useRoute()
const router = useRouter()
const salaryDetail = ref(null)
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
    
    // 实发工资
    netSalary: 5076.51
  }
]

// 获取工资条详情数据
const getSalaryDetail = async () => {
  const salaryId = parseInt(route.params.id)
  loading.value = true
  try {
    // 模拟异步请求
    setTimeout(() => {
      const salary = mockSalarySlips.find(item => item.id === salaryId)
      if (salary) {
        salaryDetail.value = salary
      } else {
        ElMessage.error('未找到工资条数据')
        router.push('/worker/salary')
      }
      loading.value = false
    }, 500)
  } catch (error) {
    console.error('获取工资条详情失败:', error)
    ElMessage.error('获取工资条详情失败，请稍后重试')
    loading.value = false
  }
}

// 页面加载时获取数据
onMounted(() => {
  getSalaryDetail()
})
</script>

<template>
  <div class="worker-salary-detail">
    <BackButton />
    <!-- 页面标题 -->
    <div class="page-header">
      <h2>工资条详情</h2>
    </div>
    
    <!-- 工资条详情 -->
    <div class="salary-detail">
      <div v-if="loading" class="loading">
        <el-icon class="is-loading"><i class="el-icon-loading"></i></el-icon>
        <span>加载中...</span>
      </div>
      <div v-else-if="!salaryDetail" class="empty">
        <el-icon><i class="el-icon-info"></i></el-icon>
        <span>暂无工资条详情</span>
      </div>
      <div v-else class="salary-item">
        <div class="salary-header">
          <h3>{{ salaryDetail.month }}月工资条</h3>
          <span class="issue-date">发放日期: {{ salaryDetail.issueDate }}</span>
        </div>
        
        <!-- 员工基本信息 -->
        <div class="salary-info">
          <div class="salary-info-row">
            <div class="info-item">
              <span class="info-label">员工姓名</span>
              <span class="info-value">{{ salaryDetail.workerName }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">工号</span>
              <span class="info-value">{{ salaryDetail.workerId }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">单位</span>
              <span class="info-value">{{ salaryDetail.unit }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">月份</span>
              <span class="info-value">{{ salaryDetail.month }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">实发</span>
              <span class="info-value net">{{ salaryDetail.netSalary }}元</span>
            </div>
          </div>
        </div>
        
        <!-- 工资清单 -->
        <div class="salary-section">
          <h4 class="section-title">工资清单</h4>
          <div class="salary-item-row">
            <span class="salary-label">核定基本薪资</span>
            <span class="salary-value">{{ salaryDetail.salarySummary.approvedBaseSalary }}元</span>
          </div>
          <div class="salary-item-row">
            <span class="salary-label">核定绩效奖金</span>
            <span class="salary-value">{{ salaryDetail.salarySummary.approvedPerformanceBonus }}元</span>
          </div>
          <div class="salary-item-row">
            <span class="salary-label">核定主管加给</span>
            <span class="salary-value">{{ salaryDetail.salarySummary.approvedSupervisorAllowance }}元</span>
          </div>
          <div class="salary-item-row">
            <span class="salary-label">应出勤天数(不含假日)</span>
            <span class="salary-value">{{ salaryDetail.salarySummary.requiredWorkDays }}天</span>
          </div>
          <div class="salary-item-row">
            <span class="salary-label">应发薪资</span>
            <span class="salary-value">{{ salaryDetail.salarySummary.grossSalary }}元</span>
          </div>
          <div class="salary-item-row">
            <span class="salary-label">应扣薪资</span>
            <span class="salary-value deduction">{{ salaryDetail.salarySummary.deductions }}元</span>
          </div>
          <div class="salary-item-row">
            <span class="salary-label">转账金额</span>
            <span class="salary-value">{{ salaryDetail.salarySummary.transferAmount }}元</span>
          </div>
          <div class="salary-item-row">
            <span class="salary-label">税前减项</span>
            <span class="salary-value">{{ salaryDetail.salarySummary.preTaxDeductions }}元</span>
          </div>
          <div class="salary-item-row">
            <span class="salary-label">代扣个人所得税</span>
            <span class="salary-value deduction">{{ salaryDetail.salarySummary.individualIncomeTax }}元</span>
          </div>
          <div class="salary-item-row">
            <span class="salary-label">税后加项</span>
            <span class="salary-value">{{ salaryDetail.salarySummary.postTaxAdditions }}元</span>
          </div>
        </div>
        
        <!-- 加项 -->
        <div class="salary-section">
          <h4 class="section-title additions">加项</h4>
          <div class="salary-item-row">
            <span class="salary-label">基本薪资</span>
            <span class="salary-value">{{ salaryDetail.additions.baseSalary }}元</span>
          </div>
          <div class="salary-item-row">
            <span class="salary-label">绩效奖金</span>
            <span class="salary-value">{{ salaryDetail.additions.performanceBonus }}元</span>
          </div>
          <div class="salary-item-row">
            <span class="salary-label">主管加给</span>
            <span class="salary-value">{{ salaryDetail.additions.supervisorAllowance }}元</span>
          </div>
          <div class="salary-item-row">
            <span class="salary-label">职务加给</span>
            <span class="salary-value">{{ salaryDetail.additions.positionAllowance }}元</span>
          </div>
          <div class="salary-item-row">
            <span class="salary-label">平时加班费</span>
            <span class="salary-value">{{ salaryDetail.additions.regularOvertimePay }}元</span>
          </div>
          <div class="salary-item-row">
            <span class="salary-label">假日加班费</span>
            <span class="salary-value">{{ salaryDetail.additions.holidayOvertimePay }}元</span>
          </div>
          <div class="salary-item-row">
            <span class="salary-label">国假加班费</span>
            <span class="salary-value">{{ salaryDetail.additions.nationalHolidayOvertimePay }}元</span>
          </div>
          <div class="salary-item-row">
            <span class="salary-label">司龄奖</span>
            <span class="salary-value">{{ salaryDetail.additions.seniorityBonus }}元</span>
          </div>
          <div class="salary-item-row">
            <span class="salary-label">出勤奖金</span>
            <span class="salary-value">{{ salaryDetail.additions.attendanceBonus }}元</span>
          </div>
          <div class="salary-item-row">
            <span class="salary-label">餐费补助</span>
            <span class="salary-value">{{ salaryDetail.additions.mealAllowance }}元</span>
          </div>
          <div class="salary-item-row">
            <span class="salary-label">夜班津贴</span>
            <span class="salary-value">{{ salaryDetail.additions.nightShiftAllowance }}元</span>
          </div>
          <div class="salary-item-row">
            <span class="salary-label">推荐奖金</span>
            <span class="salary-value">{{ salaryDetail.additions.referralBonus }}元</span>
          </div>
          <div class="salary-item-row">
            <span class="salary-label">奖金1</span>
            <span class="salary-value">{{ salaryDetail.additions.bonus1 }}元</span>
          </div>
          <div class="salary-item-row">
            <span class="salary-label">奖金2</span>
            <span class="salary-value">{{ salaryDetail.additions.bonus2 }}元</span>
          </div>
          <div class="salary-item-row">
            <span class="salary-label">培训补助</span>
            <span class="salary-value">{{ salaryDetail.additions.trainingAllowance }}元</span>
          </div>
          <div class="salary-item-row">
            <span class="salary-label">高温补贴</span>
            <span class="salary-value">{{ salaryDetail.additions.highTemperatureAllowance }}元</span>
          </div>
          <div class="salary-item-row">
            <span class="salary-label">其他加项</span>
            <span class="salary-value">{{ salaryDetail.additions.otherAdditions }}元</span>
          </div>
          <div class="salary-item-row">
            <span class="salary-label">负薪水调整</span>
            <span class="salary-value">{{ salaryDetail.additions.negativeSalaryAdjustment }}元</span>
          </div>
        </div>
        
        <!-- 扣项 -->
        <div class="salary-section">
          <h4 class="section-title deductions">扣项</h4>
          <div class="salary-item-row">
            <span class="salary-label">流产假(时数)</span>
            <span class="salary-value">{{ salaryDetail.deductionsDetail.miscarriageLeaveHours }}小时</span>
          </div>
          <div class="salary-item-row">
            <span class="salary-label">产假时数</span>
            <span class="salary-value">{{ salaryDetail.deductionsDetail.maternityLeaveHours }}小时</span>
          </div>
          <div class="salary-item-row">
            <span class="salary-label">事假(时数)</span>
            <span class="salary-value">{{ salaryDetail.deductionsDetail.personalLeaveHours }}小时</span>
          </div>
          <div class="salary-item-row">
            <span class="salary-label">旷工(时数)</span>
            <span class="salary-value">{{ salaryDetail.deductionsDetail.absenteeismHours }}小时</span>
          </div>
          <div class="salary-item-row">
            <span class="salary-label">税前请假扣款</span>
            <span class="salary-value deduction">{{ salaryDetail.deductionsDetail.preTaxLeaveDeductions }}元</span>
          </div>
          <div class="salary-item-row">
            <span class="salary-label">病假(时数)</span>
            <span class="salary-value">{{ salaryDetail.deductionsDetail.sickLeaveHours }}小时</span>
          </div>
          <div class="salary-item-row">
            <span class="salary-label">税前病假扣款</span>
            <span class="salary-value deduction">{{ salaryDetail.deductionsDetail.preTaxSickLeaveDeductions }}元</span>
          </div>
          <div class="salary-item-row">
            <span class="salary-label">补扣上月负薪水</span>
            <span class="salary-value deduction">{{ salaryDetail.deductionsDetail.previousMonthNegativeSalary }}元</span>
          </div>
          <div class="salary-item-row">
            <span class="salary-label">社会保险费个人承担</span>
            <span class="salary-value deduction">{{ salaryDetail.deductionsDetail.socialInsurancePersonal }}元</span>
          </div>
          <div class="salary-item-row">
            <span class="salary-label">公积金个人承担</span>
            <span class="salary-value deduction">{{ salaryDetail.deductionsDetail.housingFundPersonal }}元</span>
          </div>
          <div class="salary-item-row">
            <span class="salary-label">税后其它扣款</span>
            <span class="salary-value deduction">{{ salaryDetail.deductionsDetail.otherPostTaxDeductions }}元</span>
          </div>
          <div class="salary-item-row">
            <span class="salary-label">税后餐饮扣款</span>
            <span class="salary-value deduction">{{ salaryDetail.deductionsDetail.postTaxMealDeductions }}元</span>
          </div>
          <div class="salary-item-row">
            <span class="salary-label">税后宿舍扣款</span>
            <span class="salary-value deduction">{{ salaryDetail.deductionsDetail.postTaxDormitoryDeductions }}元</span>
          </div>
        </div>
        
        <div class="salary-footer">
          <div class="net-salary">
            <span class="salary-label">实发工资</span>
            <span class="salary-value net">{{ salaryDetail.netSalary }}元</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.worker-salary-detail {
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

.salary-detail {
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

.salary-item {
  background-color: #fff;
  border-radius: 10px;
  padding: 15px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  margin-top: 15px;
}

.salary-header {
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 1px solid #f0f0f0;
}

.salary-header h3 {
  margin: 0 0 5px 0;
  font-size: 16px;
  font-weight: bold;
  color: #333;
}

.issue-date {
  font-size: 12px;
  color: #999;
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

.salary-section {
  margin-bottom: 20px;
  padding: 12px;
  background-color: #f8f9fa;
  border-radius: 6px;
}

.section-title {
  margin: 0 0 12px 0;
  font-size: 14px;
  font-weight: bold;
  color: #333;
  padding-bottom: 8px;
  border-bottom: 1px solid #eaeaea;
}

.section-title.additions {
  color: #4caf50;
}

.section-title.deductions {
  color: #ff6b6b;
}

.section-title.other {
  color: #667eea;
}

.salary-item-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 6px 0;
  font-size: 12px;
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
  
  .salary-detail {
    padding: 0 10px 20px;
  }
  
  .salary-item {
    padding: 12px;
    margin-top: 12px;
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
  
  /* 工资条部分移动端适配 */
  .salary-section {
    margin-bottom: 15px;
    padding: 10px;
  }

  .section-title {
    font-size: 13px;
    margin: 0 0 10px 0;
    padding-bottom: 6px;
  }

  .salary-basic-row {
    margin: 6px 0;
  }

  .basic-label {
    font-size: 12px;
  }

  .basic-value {
    font-size: 12px;
  }

  .salary-net-pay {
    padding: 10px;
    margin-bottom: 12px;
  }

  .net-label {
    font-size: 13px;
  }

  .net-value {
    font-size: 16px;
  }

  .salary-label {
    font-size: 11px;
  }

  .salary-value {
    font-size: 11px;
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