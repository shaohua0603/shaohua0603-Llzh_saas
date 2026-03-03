<template>
  <div class="settlement-detail-container">
    <!-- 内容区域 -->
    <div class="detail-content">
      <!-- 基本信息 -->
      <el-card>
        <template #header>
          <div class="card-header">
            <span class="card-title">基本信息</span>
            <el-tag :type="getStatusType(detailData.status)">
              {{ getStatusText(detailData.status) }}
            </el-tag>
          </div>
        </template>
        <el-descriptions :column="3" border>
          <el-descriptions-item label="结算年月">{{ detailData.issueMonth }}</el-descriptions-item>
          <el-descriptions-item label="工厂">{{ detailData.factory }}</el-descriptions-item>
          <el-descriptions-item label="结算时间">{{ detailData.issueDate || '-' }}</el-descriptions-item>
          <el-descriptions-item label="结算说明" :span="3">{{ detailData.issueDescription }}</el-descriptions-item>
          <el-descriptions-item label="创建时间">{{ detailData.createTime }}</el-descriptions-item>
          <el-descriptions-item label="结算人数">{{ detailData.workerCount }}人</el-descriptions-item>
          <el-descriptions-item label="结算总额">{{ detailData.totalAmount }}元</el-descriptions-item>
        </el-descriptions>
      </el-card>

      <!-- 结算工资人员清单 -->
      <el-card class="mt-4">
        <template #header>
          <div class="card-header">
            <span class="card-title">结算工资人员清单</span>
            <div class="header-actions">
              <el-button type="primary" size="small" @click="handleImportList">导入清单</el-button>
              <el-button type="primary" size="small" @click="handleExportList">导出清单</el-button>
            </div>
          </div>
        </template>
        <el-table :data="workerList" border stripe show-summary :summary-method="getSummary">
          <el-table-column type="index" label="序号" width="60" />
          <el-table-column prop="workerId" label="工号" min-width="100" />
          <el-table-column prop="workerName" label="姓名" min-width="100" />
          <el-table-column prop="phone" label="手机号" min-width="120" />

          <el-table-column prop="bankName" label="开户行" min-width="150" />
          <el-table-column prop="bankAccount" label="银行账号" min-width="180" />
          <el-table-column prop="workDays" label="工作天数" min-width="100" />
          <el-table-column prop="baseSalary" label="基本薪资(元)" min-width="120" />
          <el-table-column prop="performanceBonus" label="绩效奖金(元)" min-width="120" />
          <el-table-column prop="regularOvertimePay" label="平时加班费(元)" min-width="120" />
          <el-table-column prop="holidayOvertimePay" label="假日加班费(元)" min-width="120" />
          <el-table-column prop="mealAllowance" label="餐费补助(元)" min-width="120" />
          <el-table-column prop="socialInsurancePersonal" label="社保个人(元)" min-width="120" />
          <el-table-column prop="housingFundPersonal" label="公积金个人(元)" min-width="120" />
          <el-table-column prop="deductions" label="其他扣款(元)" min-width="120" />
          <el-table-column prop="netSalary" label="实发工资(元)" min-width="120" />
          <el-table-column prop="status" label="结算状态" min-width="100">
            <template #default="{ row }">
              <el-tag :type="row.status === 'issued' ? 'success' : 'warning'">
                {{ row.status === 'issued' ? '已结算' : '待结算' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" min-width="120" fixed="right">
            <template #default="{ row }">
              <el-button type="primary" link @click="openSalaryDetail(row)">工资详情</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </div>

    <!-- 底部悬浮操作栏 -->
    <div class="detail-footer">
      <el-button @click="handleExport">
        <el-icon><Download /></el-icon>
        导出
      </el-button>
      <el-button @click="handlePrint">
        <el-icon><Printer /></el-icon>
        打印
      </el-button>
      <el-button type="primary" @click="handleBatchSettlement">
        <el-icon><Money /></el-icon>
        批量结算
      </el-button>
    </div>

    <!-- 右侧展开面板 - 工资详情 -->
    <div class="right-panel-mask" v-if="rightPanelVisible" @click="closeRightPanel"></div>
    <div class="right-panel" :class="{ 'visible': rightPanelVisible }">
      <div class="right-panel-header">
        <h3 class="panel-title">{{ currentWorker?.workerName }} - 工资详情</h3>
        <el-icon class="close-icon" @click="closeRightPanel">
          <ArrowLeft />
        </el-icon>
      </div>
      <div class="right-panel-content">
        <div v-if="!currentWorker" class="loading">
          <el-icon class="is-loading"><Loading /></el-icon>
          <span>加载中...</span>
        </div>
        <div v-else class="salary-detail-panel">
          <!-- 员工基本信息 -->
          <div class="salary-info">
            <div class="salary-info-row">
              <div class="info-item">
                <span class="info-label">工号</span>
                <span class="info-value">{{ currentWorker.workerId }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">姓名</span>
                <span class="info-value">{{ currentWorker.workerName }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">手机号</span>
                <span class="info-value">{{ currentWorker.phone }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">实发</span>
                <span class="info-value net">{{ currentWorker.netSalary }}元</span>
              </div>
            </div>
          </div>

          <!-- 工资清单 -->
          <div class="salary-section">
            <h4 class="section-title">工资清单</h4>
            <div class="salary-item-row">
              <span class="salary-label">核定基本薪资</span>
              <span class="salary-value">{{ currentWorker.salarySummary?.approvedBaseSalary || 0 }}元</span>
            </div>
            <div class="salary-item-row">
              <span class="salary-label">核定绩效奖金</span>
              <span class="salary-value">{{ currentWorker.salarySummary?.approvedPerformanceBonus || 0 }}元</span>
            </div>
            <div class="salary-item-row">
              <span class="salary-label">核定主管加给</span>
              <span class="salary-value">{{ currentWorker.salarySummary?.approvedSupervisorAllowance || 0 }}元</span>
            </div>
            <div class="salary-item-row">
              <span class="salary-label">应出勤天数(不含假日)</span>
              <span class="salary-value">{{ currentWorker.salarySummary?.requiredWorkDays || 0 }}天</span>
            </div>
            <div class="salary-item-row">
              <span class="salary-label">应发薪资</span>
              <span class="salary-value">{{ currentWorker.salarySummary?.grossSalary || 0 }}元</span>
            </div>
            <div class="salary-item-row">
              <span class="salary-label">应扣薪资</span>
              <span class="salary-value deduction">{{ currentWorker.salarySummary?.deductions || 0 }}元</span>
            </div>
            <div class="salary-item-row">
              <span class="salary-label">转账金额</span>
              <span class="salary-value">{{ currentWorker.salarySummary?.transferAmount || 0 }}元</span>
            </div>
            <div class="salary-item-row">
              <span class="salary-label">税前减项</span>
              <span class="salary-value">{{ currentWorker.salarySummary?.preTaxDeductions || 0 }}元</span>
            </div>
            <div class="salary-item-row">
              <span class="salary-label">代扣个人所得税</span>
              <span class="salary-value deduction">{{ currentWorker.salarySummary?.individualIncomeTax || 0 }}元</span>
            </div>
            <div class="salary-item-row">
              <span class="salary-label">税后加项</span>
              <span class="salary-value">{{ currentWorker.salarySummary?.postTaxAdditions || 0 }}元</span>
            </div>
          </div>

          <!-- 加项 -->
          <div class="salary-section">
            <h4 class="section-title additions">加项</h4>
            <div class="salary-item-row">
              <span class="salary-label">基本薪资</span>
              <span class="salary-value">{{ currentWorker.additions?.baseSalary || 0 }}元</span>
            </div>
            <div class="salary-item-row">
              <span class="salary-label">绩效奖金</span>
              <span class="salary-value">{{ currentWorker.additions?.performanceBonus || 0 }}元</span>
            </div>
            <div class="salary-item-row">
              <span class="salary-label">主管加给</span>
              <span class="salary-value">{{ currentWorker.additions?.supervisorAllowance || 0 }}元</span>
            </div>
            <div class="salary-item-row">
              <span class="salary-label">职务加给</span>
              <span class="salary-value">{{ currentWorker.additions?.positionAllowance || 0 }}元</span>
            </div>
            <div class="salary-item-row">
              <span class="salary-label">平时加班费</span>
              <span class="salary-value">{{ currentWorker.additions?.regularOvertimePay || 0 }}元</span>
            </div>
            <div class="salary-item-row">
              <span class="salary-label">假日加班费</span>
              <span class="salary-value">{{ currentWorker.additions?.holidayOvertimePay || 0 }}元</span>
            </div>
            <div class="salary-item-row">
              <span class="salary-label">国假加班费</span>
              <span class="salary-value">{{ currentWorker.additions?.nationalHolidayOvertimePay || 0 }}元</span>
            </div>
            <div class="salary-item-row">
              <span class="salary-label">司龄奖</span>
              <span class="salary-value">{{ currentWorker.additions?.seniorityBonus || 0 }}元</span>
            </div>
            <div class="salary-item-row">
              <span class="salary-label">出勤奖金</span>
              <span class="salary-value">{{ currentWorker.additions?.attendanceBonus || 0 }}元</span>
            </div>
            <div class="salary-item-row">
              <span class="salary-label">餐费补助</span>
              <span class="salary-value">{{ currentWorker.additions?.mealAllowance || 0 }}元</span>
            </div>
            <div class="salary-item-row">
              <span class="salary-label">夜班津贴</span>
              <span class="salary-value">{{ currentWorker.additions?.nightShiftAllowance || 0 }}元</span>
            </div>
            <div class="salary-item-row">
              <span class="salary-label">推荐奖金</span>
              <span class="salary-value">{{ currentWorker.additions?.referralBonus || 0 }}元</span>
            </div>
            <div class="salary-item-row">
              <span class="salary-label">奖金1</span>
              <span class="salary-value">{{ currentWorker.additions?.bonus1 || 0 }}元</span>
            </div>
            <div class="salary-item-row">
              <span class="salary-label">奖金2</span>
              <span class="salary-value">{{ currentWorker.additions?.bonus2 || 0 }}元</span>
            </div>
            <div class="salary-item-row">
              <span class="salary-label">培训补助</span>
              <span class="salary-value">{{ currentWorker.additions?.trainingAllowance || 0 }}元</span>
            </div>
            <div class="salary-item-row">
              <span class="salary-label">高温补贴</span>
              <span class="salary-value">{{ currentWorker.additions?.highTemperatureAllowance || 0 }}元</span>
            </div>
            <div class="salary-item-row">
              <span class="salary-label">其他加项</span>
              <span class="salary-value">{{ currentWorker.additions?.otherAdditions || 0 }}元</span>
            </div>
            <div class="salary-item-row">
              <span class="salary-label">负薪水调整</span>
              <span class="salary-value">{{ currentWorker.additions?.negativeSalaryAdjustment || 0 }}元</span>
            </div>
          </div>

          <!-- 扣项 -->
          <div class="salary-section">
            <h4 class="section-title deductions">扣项</h4>
            <div class="salary-item-row">
              <span class="salary-label">流产假(时数)</span>
              <span class="salary-value">{{ currentWorker.deductionsDetail?.miscarriageLeaveHours || 0 }}小时</span>
            </div>
            <div class="salary-item-row">
              <span class="salary-label">产假时数</span>
              <span class="salary-value">{{ currentWorker.deductionsDetail?.maternityLeaveHours || 0 }}小时</span>
            </div>
            <div class="salary-item-row">
              <span class="salary-label">事假(时数)</span>
              <span class="salary-value">{{ currentWorker.deductionsDetail?.personalLeaveHours || 0 }}小时</span>
            </div>
            <div class="salary-item-row">
              <span class="salary-label">旷工(时数)</span>
              <span class="salary-value">{{ currentWorker.deductionsDetail?.absenteeismHours || 0 }}小时</span>
            </div>
            <div class="salary-item-row">
              <span class="salary-label">税前请假扣款</span>
              <span class="salary-value deduction">{{ currentWorker.deductionsDetail?.preTaxLeaveDeductions || 0 }}元</span>
            </div>
            <div class="salary-item-row">
              <span class="salary-label">病假(时数)</span>
              <span class="salary-value">{{ currentWorker.deductionsDetail?.sickLeaveHours || 0 }}小时</span>
            </div>
            <div class="salary-item-row">
              <span class="salary-label">税前病假扣款</span>
              <span class="salary-value deduction">{{ currentWorker.deductionsDetail?.preTaxSickLeaveDeductions || 0 }}元</span>
            </div>
            <div class="salary-item-row">
              <span class="salary-label">补扣上月负薪水</span>
              <span class="salary-value deduction">{{ currentWorker.deductionsDetail?.previousMonthNegativeSalary || 0 }}元</span>
            </div>
            <div class="salary-item-row">
              <span class="salary-label">社会保险费个人承担</span>
              <span class="salary-value deduction">{{ currentWorker.deductionsDetail?.socialInsurancePersonal || 0 }}元</span>
            </div>
            <div class="salary-item-row">
              <span class="salary-label">公积金个人承担</span>
              <span class="salary-value deduction">{{ currentWorker.deductionsDetail?.housingFundPersonal || 0 }}元</span>
            </div>
            <div class="salary-item-row">
              <span class="salary-label">税后其它扣款</span>
              <span class="salary-value deduction">{{ currentWorker.deductionsDetail?.otherPostTaxDeductions || 0 }}元</span>
            </div>
            <div class="salary-item-row">
              <span class="salary-label">税后餐饮扣款</span>
              <span class="salary-value deduction">{{ currentWorker.deductionsDetail?.postTaxMealDeductions || 0 }}元</span>
            </div>
            <div class="salary-item-row">
              <span class="salary-label">税后宿舍扣款</span>
              <span class="salary-value deduction">{{ currentWorker.deductionsDetail?.postTaxDormitoryDeductions || 0 }}元</span>
            </div>
          </div>

          <!-- 实发工资 -->
          <div class="salary-footer">
            <div class="net-salary">
              <span class="salary-label">实发工资</span>
              <span class="salary-value net">{{ currentWorker.salarySummary?.transferAmount || currentWorker.netSalary }}元</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { ArrowLeft, Download, Printer, Money, Loading } from '@element-plus/icons-vue'

// 路由
const router = useRouter()
const route = useRoute()

// 详情数据
const detailData = reactive({
  id: '',
  issueMonth: '',
  factory: '',
  issueDate: '',
  issueDescription: '',
  workerCount: 0,
  totalAmount: 0,
  status: '',
  createTime: ''
})

// 工人清单
const workerList = ref<any[]>([])

// 右侧展开面板状态
const rightPanelVisible = ref(false)
const currentWorker = ref<any>(null)

// 获取状态类型
const getStatusType = (status: string) => {
  const typeMap: Record<string, string> = {
    pending: 'warning',
    partial: 'warning',
    completed: 'success'
  }
  return typeMap[status] || 'info'
}

// 获取状态文本
const getStatusText = (status: string) => {
  const textMap: Record<string, string> = {
    pending: '待结算',
    partial: '部分结算',
    completed: '已结算完成'
  }
  return textMap[status] || status
}

// 返回
const handleBack = () => {
  router.back()
}

// 导出
const handleExport = () => {
  ElMessage.info('导出功能开发中')
}

// 打印
const handlePrint = () => {
  ElMessage.info('打印功能开发中')
}

// 批量结算
const handleBatchSettlement = () => {
  ElMessageBox.confirm('确定要批量结算该结算记录吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    ElMessage.success('批量结算成功')
  }).catch(() => {})
}

// 导入清单
const handleImportList = () => {
  ElMessageBox.confirm('请上传Excel格式的结算清单文件', '导入清单', {
    confirmButtonText: '上传文件',
    cancelButtonText: '取消',
    type: 'info'
  }).then(() => {
    // 实际项目中这里会打开文件选择对话框
    ElMessage.success('导入成功，已更新结算清单')
    // 模拟重新加载数据
    loadData()
  }).catch(() => {})
}

// 导出清单
const handleExportList = () => {
  ElMessageBox.confirm('确定要导出该结算记录的结算清单吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'info'
  }).then(() => {
    ElMessage.success('导出清单成功')
  }).catch(() => {})
}

// 自定义合计逻辑
const getSummary = (param: any) => {
  const { columns, data } = param
  const sums: any[] = []
  
  columns.forEach((column: any, index: number) => {
    if (index === 0) {
      sums[index] = '合计'
      return
    }
    
    // 只对数值型字段进行合计
    const numericFields = ['workDays', 'baseSalary', 'performanceBonus', 'regularOvertimePay', 'holidayOvertimePay', 'mealAllowance', 'socialInsurancePersonal', 'housingFundPersonal', 'deductions', 'netSalary']
    
    if (numericFields.includes(column.property)) {
      const values = data.map((item: any) => Number(item[column.property]) || 0)
      const total = values.reduce((prev: number, curr: number) => prev + curr, 0)
      sums[index] = total.toFixed(2)
    } else {
      sums[index] = ''
    }
  })
  
  return sums
}

// 打开工资详情
const openSalaryDetail = (row: any) => {
  currentWorker.value = row
  rightPanelVisible.value = true
}

// 关闭右侧面板
const closeRightPanel = () => {
  rightPanelVisible.value = false
  currentWorker.value = null
}

// 加载数据
const loadData = async () => {
  const id = route.params.id as string
  // 模拟加载数据
  const mockData = {
    id: id || '1',
    issueMonth: '2026-01',
    factory: '富士康科技集团',
    issueDate: '2026-02-05',
    issueDescription: '2026年1月份工资结算',
    workerCount: 150,
    totalAmount: 825000,
    status: 'completed',
    createTime: '2026-02-01 10:00:00'
  }
  Object.assign(detailData, mockData)

  // 模拟工人清单数据
  workerList.value = [
    {
      workerId: 'EMP001',
      workerName: '张三',
      phone: '13800138001',
      idCard: '110101199001011234',
      bankName: '中国工商银行',
      bankAccount: '6222021234567890',
      workDays: 30,
      // 工资清单
      salarySummary: {
        approvedBaseSalary: 4000,
        approvedPerformanceBonus: 500,
        approvedSupervisorAllowance: 0,
        requiredWorkDays: 23,
        grossSalary: 5850,
        deductions: 450,
        transferAmount: 5400,
        preTaxDeductions: 0,
        individualIncomeTax: 0,
        postTaxAdditions: 0
      },
      // 加项
      additions: {
        baseSalary: 4000,
        performanceBonus: 500,
        supervisorAllowance: 0,
        positionAllowance: 0,
        regularOvertimePay: 500,
        holidayOvertimePay: 300,
        nationalHolidayOvertimePay: 0,
        seniorityBonus: 0,
        attendanceBonus: 0,
        mealAllowance: 450,
        nightShiftAllowance: 0,
        referralBonus: 0,
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
        otherPostTaxDeductions: 115.24,
        postTaxMealDeductions: 0,
        postTaxDormitoryDeductions: 0
      },
      // 实发工资
      netSalary: 5400,
      status: 'issued'
    },
    {
      workerId: 'EMP002',
      workerName: '李四',
      phone: '13800138002',
      idCard: '110101199002021234',
      bankName: '中国农业银行',
      bankAccount: '6222021234567891',
      workDays: 28,
      // 工资清单
      salarySummary: {
        approvedBaseSalary: 3800,
        approvedPerformanceBonus: 400,
        approvedSupervisorAllowance: 0,
        requiredWorkDays: 23,
        grossSalary: 5250,
        deductions: 400,
        transferAmount: 4850,
        preTaxDeductions: 0,
        individualIncomeTax: 0,
        postTaxAdditions: 0
      },
      // 加项
      additions: {
        baseSalary: 3800,
        performanceBonus: 400,
        supervisorAllowance: 0,
        positionAllowance: 0,
        regularOvertimePay: 300,
        holidayOvertimePay: 300,
        nationalHolidayOvertimePay: 0,
        seniorityBonus: 0,
        attendanceBonus: 0,
        mealAllowance: 450,
        nightShiftAllowance: 0,
        referralBonus: 0,
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
        otherPostTaxDeductions: 115.24,
        postTaxMealDeductions: 0,
        postTaxDormitoryDeductions: 0
      },
      // 实发工资
      netSalary: 4850,
      status: 'issued'
    },
    {
      workerId: 'EMP003',
      workerName: '王五',
      phone: '13800138003',
      idCard: '110101199003031234',
      bankName: '中国建设银行',
      bankAccount: '6222021234567892',
      workDays: 31,
      // 工资清单
      salarySummary: {
        approvedBaseSalary: 4200,
        approvedPerformanceBonus: 600,
        approvedSupervisorAllowance: 0,
        requiredWorkDays: 23,
        grossSalary: 6250,
        deductions: 430,
        transferAmount: 5820,
        preTaxDeductions: 0,
        individualIncomeTax: 0,
        postTaxAdditions: 0
      },
      // 加项
      additions: {
        baseSalary: 4200,
        performanceBonus: 600,
        supervisorAllowance: 0,
        positionAllowance: 0,
        regularOvertimePay: 600,
        holidayOvertimePay: 300,
        nationalHolidayOvertimePay: 0,
        seniorityBonus: 0,
        attendanceBonus: 0,
        mealAllowance: 450,
        nightShiftAllowance: 0,
        referralBonus: 0,
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
        otherPostTaxDeductions: 115.24,
        postTaxMealDeductions: 0,
        postTaxDormitoryDeductions: 0
      },
      // 实发工资
      netSalary: 5820,
      status: 'issued'
    }
  ]
}

// 生命周期
onMounted(() => {
  loadData()
})
</script>

<style scoped>
.settlement-detail-container {
  padding: 20px;
  background-color: #f5f7fa;
  min-height: calc(100vh - 100px);
  display: flex;
  flex-direction: column;
}

.detail-content {
  flex: 1;
  overflow-y: auto;
  padding-bottom: 80px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding: 16px 20px;
  background-color: #fff;
  border-radius: 4px;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.page-title {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #303133;
}

.header-actions {
  display: flex;
  gap: 10px;
}

.content-section {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.content-section .el-card {
  border-radius: 4px;
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

.card-title {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
}

.mt-4 {
  margin-top: 16px;
}

.detail-footer {
  position: fixed;
  bottom: 0;
  left: var(--sidebar-width, 210px);
  right: 0;
  display: flex;
  justify-content: center;
  gap: 12px;
  padding: 16px;
  background-color: #f5f7fa;
  border-top: 1px solid #e4e7ed;
  z-index: 100;
  transition: left 0.3s;
}

/* 右侧展开面板 */
.right-panel-mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 9998;
  transition: opacity 0.3s;
}

.right-panel {
  position: fixed;
  top: 0;
  right: -500px;
  width: 500px;
  height: 100vh;
  background-color: #ffffff;
  box-shadow: -4px 0 12px rgba(0, 0, 0, 0.15);
  z-index: 9999;
  transition: right 0.3s;
  display: flex;
  flex-direction: column;
}

.right-panel.visible {
  right: 0;
}

.right-panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #e4e7ed;
  background-color: #f9fafb;
}

.panel-title {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #303133;
}

.close-icon {
  font-size: 20px;
  color: #606266;
  cursor: pointer;
  transition: all 0.3s;
}

.close-icon:hover {
  color: #303133;
  transform: rotate(90deg);
}

.right-panel-content {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
}

.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #909399;
}

.loading .el-icon {
  font-size: 32px;
  margin-bottom: 12px;
}

/* 工资详情面板样式 */
.salary-detail-panel {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.salary-info {
  padding: 16px;
  background-color: #f8f9fa;
  border-radius: 4px;
  border-left: 4px solid #409eff;
}

.salary-info-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 12px;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.info-label {
  font-size: 12px;
  color: #606266;
  font-weight: 500;
}

.info-value {
  font-size: 14px;
  color: #303133;
  font-weight: 500;
}

.info-value.net {
  color: #67c23a;
  font-weight: 600;
}

.salary-section {
  padding: 16px;
  background-color: #f8f9fa;
  border-radius: 4px;
}

.section-title {
  margin: 0 0 16px 0;
  font-size: 16px;
  font-weight: 600;
  color: #303133;
  padding-bottom: 8px;
  border-bottom: 1px solid #e4e7ed;
}

.salary-item-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #f0f0f0;
}

.salary-item-row:last-child {
  border-bottom: none;
}

.salary-item-row.total {
  margin-top: 8px;
  padding-top: 12px;
  border-top: 1px solid #e4e7ed;
  font-weight: 600;
}

.salary-label {
  font-size: 14px;
  color: #606266;
}

.salary-value {
  font-size: 14px;
  color: #303133;
  font-weight: 500;
}

.salary-value.deduction {
  color: #f56c6c;
}

.salary-value.net {
  color: #67c23a;
  font-weight: 600;
  font-size: 16px;
}

.section-title.additions {
  color: #4caf50;
}

.section-title.deductions {
  color: #f56c6c;
}

.salary-footer {
  padding-top: 16px;
  border-top: 1px solid #e4e7ed;
  margin-top: 16px;
}

.net-salary {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  background-color: #f0f9eb;
  border-radius: 4px;
  border-left: 4px solid #67c23a;
}

.net-salary .salary-label {
  font-size: 14px;
  font-weight: 600;
  color: #303133;
}

.net-salary .salary-value {
  font-size: 18px;
  font-weight: 600;
  color: #67c23a;
}

/* 响应式适配 */
@media screen and (max-width: 768px) {
  .right-panel {
    width: 100%;
    right: -100%;
  }
  
  .salary-info-row {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .salary-item-row {
    font-size: 12px;
  }
  
  .salary-label {
    font-size: 12px;
  }
  
  .salary-value {
    font-size: 12px;
  }
  
  .net-salary .salary-label {
    font-size: 13px;
  }
  
  .net-salary .salary-value {
    font-size: 16px;
  }
}
</style>
