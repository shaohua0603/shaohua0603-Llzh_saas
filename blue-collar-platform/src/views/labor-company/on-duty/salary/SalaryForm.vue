<template>
  <div class="form-container">
    <div class="form-content">
      <el-card class="form-card" v-loading="loading">
        <el-form :model="salaryForm" label-width="120px">
          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item label="发放年月" required>
                <el-date-picker
                  v-model="salaryForm.salaryMonth"
                  type="month"
                  placeholder="选择月份"
                  value-format="YYYY-MM"
                  style="width: 100%"
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="发放时间" required>
                <el-date-picker
                  v-model="salaryForm.issueDate"
                  type="datetime"
                  placeholder="选择发放时间"
                  value-format="YYYY-MM-DD HH:mm:ss"
                  style="width: 100%"
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="结算类型" required>
                <el-select v-model="salaryForm.settlementType" style="width: 100%">
                  <el-option label="日结" value="daily" />
                  <el-option label="月结" value="monthly" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="发放说明">
            <el-input
              v-model="salaryForm.description"
              type="textarea"
              :rows="2"
              placeholder="请输入发放说明"
            />
          </el-form-item>
          <el-divider>工资明细</el-divider>
          <el-form-item label="选择工人">
            <el-button type="primary" @click="handleSelectWorkers">选择工人</el-button>
            <span class="form-tip">已选择 {{ salaryForm.workers.length }} 名工人</span>
          </el-form-item>

          <!-- 工人工资明细表格 -->
          <el-table
            v-if="salaryForm.workers.length > 0"
            :data="salaryForm.workers"
            border
            stripe
            max-height="400"
          >
            <el-table-column type="index" label="序号" width="60" />
            <el-table-column prop="workerName" label="姓名" min-width="100" />
            <el-table-column prop="idCard" label="身份证号" min-width="160" />
            <el-table-column prop="phone" label="手机号" min-width="120" />
            <el-table-column prop="factoryName" label="所在工厂" min-width="120" />
            <el-table-column prop="positionName" label="岗位名称" min-width="120" />
            <el-table-column prop="bankCard" label="银行卡号" min-width="180" />
            <el-table-column label="工作天数" min-width="100">
              <template #default="{ row }">
                <el-input-number
                  v-model="row.workDays"
                  :min="0"
                  :precision="0"
                  size="small"
                  controls-position="right"
                />
              </template>
            </el-table-column>
            
            <!-- 加项 -->
            <el-table-column label="基本薪资" min-width="100">
              <template #default="{ row }">
                <el-input-number
                  v-model="row.basicSalary"
                  :min="0"
                  :precision="2"
                  size="small"
                  controls-position="right"
                />
              </template>
            </el-table-column>
            <el-table-column label="绩效奖金" min-width="100">
              <template #default="{ row }">
                <el-input-number
                  v-model="row.performanceBonus"
                  :min="0"
                  :precision="2"
                  size="small"
                  controls-position="right"
                />
              </template>
            </el-table-column>
            <el-table-column label="主管加给" min-width="100">
              <template #default="{ row }">
                <el-input-number
                  v-model="row.supervisorAllowance"
                  :min="0"
                  :precision="2"
                  size="small"
                  controls-position="right"
                />
              </template>
            </el-table-column>
            <el-table-column label="职务加给" min-width="100">
              <template #default="{ row }">
                <el-input-number
                  v-model="row.positionAllowance"
                  :min="0"
                  :precision="2"
                  size="small"
                  controls-position="right"
                />
              </template>
            </el-table-column>
            <el-table-column label="平时加班费" min-width="100">
              <template #default="{ row }">
                <el-input-number
                  v-model="row.regularOvertimePay"
                  :min="0"
                  :precision="2"
                  size="small"
                  controls-position="right"
                />
              </template>
            </el-table-column>
            <el-table-column label="假日加班费" min-width="100">
              <template #default="{ row }">
                <el-input-number
                  v-model="row.holidayOvertimePay"
                  :min="0"
                  :precision="2"
                  size="small"
                  controls-position="right"
                />
              </template>
            </el-table-column>
            <el-table-column label="国假加班费" min-width="100">
              <template #default="{ row }">
                <el-input-number
                  v-model="row.nationalHolidayOvertimePay"
                  :min="0"
                  :precision="2"
                  size="small"
                  controls-position="right"
                />
              </template>
            </el-table-column>
            <el-table-column label="司龄奖" min-width="100">
              <template #default="{ row }">
                <el-input-number
                  v-model="row.seniorityBonus"
                  :min="0"
                  :precision="2"
                  size="small"
                  controls-position="right"
                />
              </template>
            </el-table-column>
            <el-table-column label="出勤奖金" min-width="100">
              <template #default="{ row }">
                <el-input-number
                  v-model="row.attendanceBonus"
                  :min="0"
                  :precision="2"
                  size="small"
                  controls-position="right"
                />
              </template>
            </el-table-column>
            <el-table-column label="餐费补助" min-width="100">
              <template #default="{ row }">
                <el-input-number
                  v-model="row.mealAllowance"
                  :min="0"
                  :precision="2"
                  size="small"
                  controls-position="right"
                />
              </template>
            </el-table-column>
            <el-table-column label="夜班津贴" min-width="100">
              <template #default="{ row }">
                <el-input-number
                  v-model="row.nightShiftAllowance"
                  :min="0"
                  :precision="2"
                  size="small"
                  controls-position="right"
                />
              </template>
            </el-table-column>
            <el-table-column label="推荐奖金" min-width="100">
              <template #default="{ row }">
                <el-input-number
                  v-model="row.referralBonus"
                  :min="0"
                  :precision="2"
                  size="small"
                  controls-position="right"
                />
              </template>
            </el-table-column>
            <el-table-column label="奖金1" min-width="100">
              <template #default="{ row }">
                <el-input-number
                  v-model="row.bonus1"
                  :min="0"
                  :precision="2"
                  size="small"
                  controls-position="right"
                />
              </template>
            </el-table-column>
            <el-table-column label="奖金2" min-width="100">
              <template #default="{ row }">
                <el-input-number
                  v-model="row.bonus2"
                  :min="0"
                  :precision="2"
                  size="small"
                  controls-position="right"
                />
              </template>
            </el-table-column>
            <el-table-column label="培训补助" min-width="100">
              <template #default="{ row }">
                <el-input-number
                  v-model="row.trainingAllowance"
                  :min="0"
                  :precision="2"
                  size="small"
                  controls-position="right"
                />
              </template>
            </el-table-column>
            <el-table-column label="高温补贴" min-width="100">
              <template #default="{ row }">
                <el-input-number
                  v-model="row.highTemperatureAllowance"
                  :min="0"
                  :precision="2"
                  size="small"
                  controls-position="right"
                />
              </template>
            </el-table-column>
            <el-table-column label="其他加项" min-width="100">
              <template #default="{ row }">
                <el-input-number
                  v-model="row.otherAdditions"
                  :min="0"
                  :precision="2"
                  size="small"
                  controls-position="right"
                />
              </template>
            </el-table-column>
            
            <!-- 扣项 -->
            <el-table-column label="流产假(时数)" min-width="100">
              <template #default="{ row }">
                <el-input-number
                  v-model="row.miscarriageLeaveHours"
                  :min="0"
                  :precision="2"
                  size="small"
                  controls-position="right"
                />
              </template>
            </el-table-column>
            <el-table-column label="产假时数" min-width="100">
              <template #default="{ row }">
                <el-input-number
                  v-model="row.maternityLeaveHours"
                  :min="0"
                  :precision="2"
                  size="small"
                  controls-position="right"
                />
              </template>
            </el-table-column>
            <el-table-column label="事假(时数)" min-width="100">
              <template #default="{ row }">
                <el-input-number
                  v-model="row.personalLeaveHours"
                  :min="0"
                  :precision="2"
                  size="small"
                  controls-position="right"
                />
              </template>
            </el-table-column>
            <el-table-column label="旷工(时数)" min-width="100">
              <template #default="{ row }">
                <el-input-number
                  v-model="row.absenteeismHours"
                  :min="0"
                  :precision="2"
                  size="small"
                  controls-position="right"
                />
              </template>
            </el-table-column>
            <el-table-column label="税前请假扣款" min-width="100">
              <template #default="{ row }">
                <el-input-number
                  v-model="row.preTaxLeaveDeductions"
                  :min="0"
                  :precision="2"
                  size="small"
                  controls-position="right"
                />
              </template>
            </el-table-column>
            <el-table-column label="病假(时数)" min-width="100">
              <template #default="{ row }">
                <el-input-number
                  v-model="row.sickLeaveHours"
                  :min="0"
                  :precision="2"
                  size="small"
                  controls-position="right"
                />
              </template>
            </el-table-column>
            <el-table-column label="税前病假扣款" min-width="100">
              <template #default="{ row }">
                <el-input-number
                  v-model="row.preTaxSickLeaveDeductions"
                  :min="0"
                  :precision="2"
                  size="small"
                  controls-position="right"
                />
              </template>
            </el-table-column>
            <el-table-column label="补扣上月负薪水" min-width="100">
              <template #default="{ row }">
                <el-input-number
                  v-model="row.previousMonthNegativeSalary"
                  :min="0"
                  :precision="2"
                  size="small"
                  controls-position="right"
                />
              </template>
            </el-table-column>
            <el-table-column label="社保个人" min-width="100">
              <template #default="{ row }">
                <el-input-number
                  v-model="row.socialInsurancePersonal"
                  :min="0"
                  :precision="2"
                  size="small"
                  controls-position="right"
                />
              </template>
            </el-table-column>
            <el-table-column label="公积金个人" min-width="100">
              <template #default="{ row }">
                <el-input-number
                  v-model="row.housingFundPersonal"
                  :min="0"
                  :precision="2"
                  size="small"
                  controls-position="right"
                />
              </template>
            </el-table-column>
            <el-table-column label="税后其它扣款" min-width="100">
              <template #default="{ row }">
                <el-input-number
                  v-model="row.otherPostTaxDeductions"
                  :min="0"
                  :precision="2"
                  size="small"
                  controls-position="right"
                />
              </template>
            </el-table-column>
            <el-table-column label="税后餐饮扣款" min-width="100">
              <template #default="{ row }">
                <el-input-number
                  v-model="row.postTaxMealDeductions"
                  :min="0"
                  :precision="2"
                  size="small"
                  controls-position="right"
                />
              </template>
            </el-table-column>
            <el-table-column label="税后宿舍扣款" min-width="100">
              <template #default="{ row }">
                <el-input-number
                  v-model="row.postTaxDormitoryDeductions"
                  :min="0"
                  :precision="2"
                  size="small"
                  controls-position="right"
                />
              </template>
            </el-table-column>
            <el-table-column label="总扣除" min-width="100">
              <template #default="{ row }">
                <el-input-number
                  v-model="row.deduction"
                  :min="0"
                  :precision="2"
                  size="small"
                  controls-position="right"
                />
              </template>
            </el-table-column>
            <el-table-column label="实发工资" min-width="120">
              <template #default="{ row }">
                <span class="amount total">
                  ¥{{ calculateNetSalary(row).toFixed(2) }}
                </span>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="80">
              <template #default="{ $index }">
                <el-button type="danger" link @click="salaryForm.workers.splice($index, 1)">
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-form>
      </el-card>
    </div>
    
    <!-- 底部按钮栏 -->
    <div class="form-footer">
      <el-button @click="goBack">
        <el-icon><ArrowLeft /></el-icon>
        返回
      </el-button>
      <el-button type="primary" @click="handleSubmitSalary">
        <el-icon><Check /></el-icon>
        {{ isEdit ? '保存修改' : '保存' }}
      </el-button>
    </div>
    
    <!-- 工人选择对话框 -->
    <el-dialog
      v-model="workerSelectVisible"
      title="选择工人"
      width="800px"
    >
      <el-table
        :data="availableWorkers"
        @selection-change="handleWorkerSelectionChange"
        max-height="400"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column prop="workerName" label="姓名" min-width="100" />
        <el-table-column prop="idCard" label="身份证号" min-width="160" />
        <el-table-column prop="phone" label="手机号" min-width="120" />
        <el-table-column prop="factoryName" label="所在工厂" min-width="120" />
        <el-table-column prop="positionName" label="岗位名称" min-width="120" />
      </el-table>
      <template #footer>
        <el-button @click="workerSelectVisible = false">取消</el-button>
        <el-button type="primary" @click="handleConfirmWorkerSelect">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { ArrowLeft, Check, Plus } from '@element-plus/icons-vue'
import { useRouter, useRoute } from 'vue-router'

// 类型定义
interface SalaryRecord {
  id: string
  workerName: string
  idCard: string
  phone: string
  bankCard: string
  factoryName: string
  positionName: string
  settlementType: 'daily' | 'monthly'
  // 工资清单
  approvedBaseSalary: number
  approvedPerformanceBonus: number
  approvedSupervisorAllowance: number
  requiredWorkDays: number
  grossSalary: number
  totalDeduction: number
  transferAmount: number
  preTaxDeductions: number
  individualIncomeTax: number
  postTaxAdditions: number
  // 加项
  basicSalary: number
  performanceBonus: number
  supervisorAllowance: number
  positionAllowance: number
  regularOvertimePay: number
  holidayOvertimePay: number
  nationalHolidayOvertimePay: number
  seniorityBonus: number
  attendanceBonus: number
  mealAllowance: number
  nightShiftAllowance: number
  referralBonus: number
  bonus1: number
  bonus2: number
  trainingAllowance: number
  highTemperatureAllowance: number
  otherAdditions: number
  negativeSalaryAdjustment: number
  // 扣项
  miscarriageLeaveHours: number
  maternityLeaveHours: number
  personalLeaveHours: number
  absenteeismHours: number
  preTaxLeaveDeductions: number
  sickLeaveHours: number
  preTaxSickLeaveDeductions: number
  previousMonthNegativeSalary: number
  socialInsurancePersonal: number
  housingFundPersonal: number
  otherPostTaxDeductions: number
  postTaxMealDeductions: number
  postTaxDormitoryDeductions: number
  // 总扣除
  deduction: number
  // 其他
  workDays: number
  totalSalary: number
  status: 'pending' | 'issued'
  salaryMonth: string
  issueDate?: string
  description?: string
}

interface WorkerInfo {
  workerName: string
  idCard: string
  phone: string
  bankCard: string
  factoryName?: string
  positionName?: string
  // 工资清单
  approvedBaseSalary: number
  approvedPerformanceBonus: number
  approvedSupervisorAllowance: number
  requiredWorkDays: number
  grossSalary: number
  totalDeduction: number
  transferAmount: number
  preTaxDeductions: number
  individualIncomeTax: number
  postTaxAdditions: number
  // 加项
  basicSalary: number
  performanceBonus: number
  supervisorAllowance: number
  positionAllowance: number
  regularOvertimePay: number
  holidayOvertimePay: number
  nationalHolidayOvertimePay: number
  seniorityBonus: number
  attendanceBonus: number
  mealAllowance: number
  nightShiftAllowance: number
  referralBonus: number
  bonus1: number
  bonus2: number
  trainingAllowance: number
  highTemperatureAllowance: number
  otherAdditions: number
  negativeSalaryAdjustment: number
  // 扣项
  miscarriageLeaveHours: number
  maternityLeaveHours: number
  personalLeaveHours: number
  absenteeismHours: number
  preTaxLeaveDeductions: number
  sickLeaveHours: number
  preTaxSickLeaveDeductions: number
  previousMonthNegativeSalary: number
  socialInsurancePersonal: number
  housingFundPersonal: number
  otherPostTaxDeductions: number
  postTaxMealDeductions: number
  postTaxDormitoryDeductions: number
  // 总扣除
  deduction: number
  // 其他
  workDays: number
  settlementType?: 'daily' | 'monthly'
}

const router = useRouter()
const route = useRoute()

const loading = ref(false)
const isEdit = ref(false)
const workerSelectVisible = ref(false)

// 工资表单
const salaryForm = reactive({
  salaryMonth: '',
  issueDate: '',
  settlementType: 'monthly',
  description: '',
  workers: [] as WorkerInfo[]
})

// 可选择的工人信息
const availableWorkers = ref<WorkerInfo[]>([])
const selectedWorkers = ref<WorkerInfo[]>([])

// 所有模拟数据
const allData = ref<SalaryRecord[]>([])

// 生成模拟数据
const generateMockData = (): SalaryRecord[] => {
  const names = ['张三', '李四', '王五', '赵六', '孙七', '周八', '吴九', '郑十', '钱十一', '陈十二']
  const factories = ['深圳电子厂', '东莞制造厂', '广州服装厂', '佛山五金厂', '惠州电子厂']
  const data: SalaryRecord[] = []

  for (let i = 0; i < 80; i++) {
    const status = Math.random() > 0.3 ? 'issued' : 'pending'
    const basicSalary = Math.floor(Math.random() * 3000 + 2000)
    const overtimeSalary = Math.floor(Math.random() * 1000)
    const bonus = Math.floor(Math.random() * 500)
    const deduction = Math.floor(Math.random() * 200)
    const salaryMonth = `${2026}-${String(Math.floor(Math.random() * 3) + 1).padStart(2, '0')}`

    data.push({
      id: `SAL${String(i + 1).padStart(6, '0')}`,
      workerName: names[Math.floor(Math.random() * names.length)],
      idCard: `${Math.floor(Math.random() * 100000 + 100000)}${Math.floor(Math.random() * 10000000000)}`,
      phone: `138${Math.floor(Math.random() * 100000000).toString().padStart(8, '0')}`,
      bankCard: `62${Math.floor(Math.random() * 10000000000000000)}`,
      factoryName: factories[Math.floor(Math.random() * factories.length)],
      basicSalary,
      overtimeSalary,
      bonus,
      deduction,
      totalSalary: basicSalary + overtimeSalary + bonus - deduction,
      status,
      salaryMonth,
      issueDate: status === 'issued' ? '2026-02-15 10:00:00' : undefined,
      description: `${salaryMonth}月工资`
    })
  }

  return data
}

// 生成可选工人数据
const generateAvailableWorkers = (): WorkerInfo[] => {
  const names = ['张三', '李四', '王五', '赵六', '孙七', '周八', '吴九', '郑十']
  const factories = ['深圳电子厂', '东莞制造厂', '广州服装厂', '佛山五金厂', '惠州电子厂']
  const positions = ['普工', '技术工', '质检员', '班组长', '主管']
  const workers: WorkerInfo[] = []

  for (let i = 0; i < names.length; i++) {
    const basicSalary = Math.floor(Math.random() * 3000 + 2000)
    const overtimeSalary = Math.floor(Math.random() * 1000)
    const bonus = Math.floor(Math.random() * 500)
    const mealAllowance = 450
    const socialInsurancePersonal = 27.38
    const housingFundPersonal = 15
    const otherDeductions = 115.24
    const deduction = socialInsurancePersonal + housingFundPersonal + otherDeductions
    const workDays = Math.floor(Math.random() * 5) + 25
    
    workers.push({
      workerName: names[i],
      idCard: `${Math.floor(Math.random() * 100000 + 100000)}${Math.floor(Math.random() * 10000000000)}`,
      phone: `138${Math.floor(Math.random() * 100000000).toString().padStart(8, '0')}`,
      bankCard: `62${Math.floor(Math.random() * 10000000000000000)}`,
      factoryName: factories[Math.floor(Math.random() * factories.length)],
      positionName: positions[Math.floor(Math.random() * positions.length)],
      // 工资清单
      approvedBaseSalary: basicSalary,
      approvedPerformanceBonus: bonus,
      approvedSupervisorAllowance: 0,
      requiredWorkDays: 23,
      grossSalary: basicSalary + overtimeSalary + bonus + mealAllowance,
      totalDeduction: deduction,
      transferAmount: basicSalary + overtimeSalary + bonus + mealAllowance - deduction,
      preTaxDeductions: 0,
      individualIncomeTax: 0,
      postTaxAdditions: 0,
      // 加项
      basicSalary,
      performanceBonus: bonus,
      supervisorAllowance: 0,
      positionAllowance: 0,
      regularOvertimePay: overtimeSalary,
      holidayOvertimePay: 0,
      nationalHolidayOvertimePay: 0,
      seniorityBonus: 0,
      attendanceBonus: 0,
      mealAllowance,
      nightShiftAllowance: 0,
      referralBonus: 0,
      bonus1: 0,
      bonus2: 0,
      trainingAllowance: 0,
      highTemperatureAllowance: 0,
      otherAdditions: 0,
      negativeSalaryAdjustment: 0,
      // 扣项
      miscarriageLeaveHours: 0,
      maternityLeaveHours: 0,
      personalLeaveHours: 0,
      absenteeismHours: 0,
      preTaxLeaveDeductions: 0,
      sickLeaveHours: 0,
      preTaxSickLeaveDeductions: 0,
      previousMonthNegativeSalary: 0,
      socialInsurancePersonal,
      housingFundPersonal,
      otherPostTaxDeductions: otherDeductions,
      postTaxMealDeductions: 0,
      postTaxDormitoryDeductions: 0,
      // 总扣除
      deduction,
      // 其他
      workDays,
      settlementType: 'monthly'
    })
  }

  return workers
}

// 初始化表单
const initForm = () => {
  const id = route.params.id as string
  if (id) {
    isEdit.value = true
    // 查找现有记录
    const record = allData.value.find(item => item.id === id)
    if (record) {
      salaryForm.salaryMonth = record.salaryMonth
      salaryForm.issueDate = record.issueDate || ''
      salaryForm.settlementType = record.settlementType
      salaryForm.description = record.description || ''
      salaryForm.workers = [{
        workerName: record.workerName,
        idCard: record.idCard,
        phone: record.phone,
        bankCard: record.bankCard,
        factoryName: record.factoryName,
        positionName: record.positionName,
        basicSalary: record.basicSalary,
        overtimeSalary: record.overtimeSalary,
        bonus: record.bonus,
        mealAllowance: record.mealAllowance || 450,
        socialInsurancePersonal: record.socialInsurancePersonal || 27.38,
        housingFundPersonal: record.housingFundPersonal || 15,
        otherDeductions: record.otherDeductions || 115.24,
        deduction: record.deduction,
        workDays: record.workDays || 26,
        settlementType: record.settlementType
      }]
    }
  } else {
    isEdit.value = false
    // 新增模式
    const now = new Date()
    salaryForm.salaryMonth = now.toISOString().slice(0, 7)
    salaryForm.issueDate = now.toISOString().replace('T', ' ').slice(0, 19)
    salaryForm.settlementType = 'monthly'
    salaryForm.description = ''
    salaryForm.workers = []
  }
  availableWorkers.value = generateAvailableWorkers()
}

// 选择工人
const handleSelectWorkers = () => {
  workerSelectVisible.value = true
}

// 工人选择变化
const handleWorkerSelectionChange = (selection: WorkerInfo[]) => {
  selectedWorkers.value = selection
}

// 计算实发工资
const calculateNetSalary = (worker: WorkerInfo): number => {
  // 计算所有加项
  const totalAdditions = worker.basicSalary + 
    worker.performanceBonus + 
    worker.supervisorAllowance + 
    worker.positionAllowance + 
    worker.regularOvertimePay + 
    worker.holidayOvertimePay + 
    worker.nationalHolidayOvertimePay + 
    worker.seniorityBonus + 
    worker.attendanceBonus + 
    worker.mealAllowance + 
    worker.nightShiftAllowance + 
    worker.referralBonus + 
    worker.bonus1 + 
    worker.bonus2 + 
    worker.trainingAllowance + 
    worker.highTemperatureAllowance + 
    worker.otherAdditions + 
    worker.negativeSalaryAdjustment
  
  // 计算所有扣项
  const totalDeductions = worker.preTaxLeaveDeductions + 
    worker.preTaxSickLeaveDeductions + 
    worker.previousMonthNegativeSalary + 
    worker.socialInsurancePersonal + 
    worker.housingFundPersonal + 
    worker.otherPostTaxDeductions + 
    worker.postTaxMealDeductions + 
    worker.postTaxDormitoryDeductions
  
  // 计算实发工资
  return totalAdditions - totalDeductions
}

// 确认工人选择
const handleConfirmWorkerSelect = () => {
  salaryForm.workers = [...selectedWorkers.value]
  workerSelectVisible.value = false
}

// 提交工资
const handleSubmitSalary = () => {
  if (!salaryForm.salaryMonth || !salaryForm.issueDate) {
    ElMessage.warning('请填写完整的发放信息')
    return
  }

  if (salaryForm.workers.length === 0) {
    ElMessage.warning('请选择工人')
    return
  }

  if (isEdit.value) {
    // 编辑模式
    const id = route.params.id as string
    const index = allData.value.findIndex(item => item.id === id)
    if (index > -1) {
      const worker = salaryForm.workers[0]
      const netSalary = calculateNetSalary(worker)
      allData.value[index] = {
        ...allData.value[index],
        salaryMonth: salaryForm.salaryMonth,
        issueDate: salaryForm.issueDate,
        settlementType: salaryForm.settlementType,
        description: salaryForm.description,
        // 基本信息
        basicSalary: worker.basicSalary,
        workDays: worker.workDays,
        // 加项
        performanceBonus: worker.performanceBonus,
        supervisorAllowance: worker.supervisorAllowance,
        positionAllowance: worker.positionAllowance,
        regularOvertimePay: worker.regularOvertimePay,
        holidayOvertimePay: worker.holidayOvertimePay,
        nationalHolidayOvertimePay: worker.nationalHolidayOvertimePay,
        seniorityBonus: worker.seniorityBonus,
        attendanceBonus: worker.attendanceBonus,
        mealAllowance: worker.mealAllowance,
        nightShiftAllowance: worker.nightShiftAllowance,
        referralBonus: worker.referralBonus,
        bonus1: worker.bonus1,
        bonus2: worker.bonus2,
        trainingAllowance: worker.trainingAllowance,
        highTemperatureAllowance: worker.highTemperatureAllowance,
        otherAdditions: worker.otherAdditions,
        negativeSalaryAdjustment: worker.negativeSalaryAdjustment,
        // 扣项
        miscarriageLeaveHours: worker.miscarriageLeaveHours,
        maternityLeaveHours: worker.maternityLeaveHours,
        personalLeaveHours: worker.personalLeaveHours,
        absenteeismHours: worker.absenteeismHours,
        preTaxLeaveDeductions: worker.preTaxLeaveDeductions,
        sickLeaveHours: worker.sickLeaveHours,
        preTaxSickLeaveDeductions: worker.preTaxSickLeaveDeductions,
        previousMonthNegativeSalary: worker.previousMonthNegativeSalary,
        socialInsurancePersonal: worker.socialInsurancePersonal,
        housingFundPersonal: worker.housingFundPersonal,
        otherPostTaxDeductions: worker.otherPostTaxDeductions,
        postTaxMealDeductions: worker.postTaxMealDeductions,
        postTaxDormitoryDeductions: worker.postTaxDormitoryDeductions,
        // 总扣除和实发工资
        deduction: worker.deduction,
        totalSalary: netSalary
      }
      ElMessage.success('工资发放修改成功')
    }
  } else {
    // 新增模式
    salaryForm.workers.forEach(worker => {
      const netSalary = calculateNetSalary(worker)
      const newRecord: SalaryRecord = {
        id: `SAL${String(allData.value.length + 1).padStart(6, '0')}`,
        workerName: worker.workerName,
        idCard: worker.idCard,
        phone: worker.phone,
        bankCard: worker.bankCard,
        factoryName: worker.factoryName || '未知工厂',
        positionName: worker.positionName || '未知岗位',
        settlementType: salaryForm.settlementType,
        // 基本信息
        basicSalary: worker.basicSalary,
        workDays: worker.workDays,
        // 加项
        performanceBonus: worker.performanceBonus,
        supervisorAllowance: worker.supervisorAllowance,
        positionAllowance: worker.positionAllowance,
        regularOvertimePay: worker.regularOvertimePay,
        holidayOvertimePay: worker.holidayOvertimePay,
        nationalHolidayOvertimePay: worker.nationalHolidayOvertimePay,
        seniorityBonus: worker.seniorityBonus,
        attendanceBonus: worker.attendanceBonus,
        mealAllowance: worker.mealAllowance,
        nightShiftAllowance: worker.nightShiftAllowance,
        referralBonus: worker.referralBonus,
        bonus1: worker.bonus1,
        bonus2: worker.bonus2,
        trainingAllowance: worker.trainingAllowance,
        highTemperatureAllowance: worker.highTemperatureAllowance,
        otherAdditions: worker.otherAdditions,
        negativeSalaryAdjustment: worker.negativeSalaryAdjustment,
        // 扣项
        miscarriageLeaveHours: worker.miscarriageLeaveHours,
        maternityLeaveHours: worker.maternityLeaveHours,
        personalLeaveHours: worker.personalLeaveHours,
        absenteeismHours: worker.absenteeismHours,
        preTaxLeaveDeductions: worker.preTaxLeaveDeductions,
        sickLeaveHours: worker.sickLeaveHours,
        preTaxSickLeaveDeductions: worker.preTaxSickLeaveDeductions,
        previousMonthNegativeSalary: worker.previousMonthNegativeSalary,
        socialInsurancePersonal: worker.socialInsurancePersonal,
        housingFundPersonal: worker.housingFundPersonal,
        otherPostTaxDeductions: worker.otherPostTaxDeductions,
        postTaxMealDeductions: worker.postTaxMealDeductions,
        postTaxDormitoryDeductions: worker.postTaxDormitoryDeductions,
        // 总扣除和实发工资
        deduction: worker.deduction,
        totalSalary: netSalary,
        status: 'pending',
        salaryMonth: salaryForm.salaryMonth,
        issueDate: salaryForm.issueDate,
        description: salaryForm.description
      }
      allData.value.unshift(newRecord)
    })
    ElMessage.success('工资发放创建成功')
  }

  router.push('/tenant/on-duty/salary')
}

// 返回
const goBack = () => {
  router.back()
}

// 生命周期
onMounted(() => {
  allData.value = generateMockData()
  initForm()
})
</script>

<style scoped>
/* 表单页容器 - 使用flex布局实现内部滚动 */
.form-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #f5f7fa;
}

/* 内容区域 - 垂直滚动 */
.form-content {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  padding-bottom: 80px; /* 为底部按钮栏留出空间 */
}

.form-card {
  max-width: 1000px;
  margin: 0 auto;
  padding: 16px;
}

.amount.total {
  color: #e6a23c;
  font-size: 16px;
  font-weight: bold;
}

.form-tip {
  margin-left: 12px;
  color: #909399;
  font-size: 14px;
}

/* 底部按钮栏 - 固定悬浮 */
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
    padding-bottom: 120px; /* 为垂直排列的按钮栏留出更多空间 */
  }
  
  .form-card {
    max-width: 100%;
  }
}
</style>