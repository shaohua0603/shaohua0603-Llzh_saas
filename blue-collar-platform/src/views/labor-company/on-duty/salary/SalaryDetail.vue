<template>
  <div class="detail-container">
    <div class="detail-content" :class="{ 'with-sidebar': workerInfoVisible }">
      <el-card class="detail-card" v-loading="loading">
        <template #header>
          <div class="card-header">
            <span>工资详情</span>
            <el-button type="primary" link @click="toggleWorkerInfo">
              <el-icon><User /></el-icon>
              查看工人信息
            </el-button>
          </div>
        </template>
        <div v-if="detailData" class="content">
          <el-descriptions :column="1" border>
            <!-- 基本信息 -->
            <el-descriptions-item label="基本信息" :span="1">
              <el-row :gutter="20">
                <el-col :span="8">
                  <div class="info-item">
                    <span class="info-label">工人姓名：</span>
                    <span class="info-value">{{ detailData.workerName }}</span>
                  </div>
                </el-col>
                <el-col :span="8">
                  <div class="info-item">
                    <span class="info-label">身份证号：</span>
                    <span class="info-value">{{ detailData.idCard }}</span>
                  </div>
                </el-col>
                <el-col :span="8">
                  <div class="info-item">
                    <span class="info-label">手机号：</span>
                    <span class="info-value">{{ detailData.phone }}</span>
                  </div>
                </el-col>
                <el-col :span="8">
                  <div class="info-item">
                    <span class="info-label">所在工厂：</span>
                    <span class="info-value">{{ detailData.factoryName }}</span>
                  </div>
                </el-col>
                <el-col :span="8">
                  <div class="info-item">
                    <span class="info-label">岗位名称：</span>
                    <span class="info-value">{{ detailData.positionName }}</span>
                  </div>
                </el-col>
                <el-col :span="8">
                  <div class="info-item">
                    <span class="info-label">结算类型：</span>
                    <el-tag :type="detailData.settlementType === 'daily' ? 'info' : 'success'">
                      {{ detailData.settlementType === 'daily' ? '日结' : '月结' }}
                    </el-tag>
                  </div>
                </el-col>
                <el-col :span="24">
                  <div class="info-item">
                    <span class="info-label">银行卡号：</span>
                    <span class="info-value">{{ detailData.bankCard }}</span>
                  </div>
                </el-col>
              </el-row>
            </el-descriptions-item>
            
            <!-- 工作信息 -->
            <el-descriptions-item label="工作信息" :span="1">
              <el-row :gutter="20">
                <el-col :span="8">
                  <div class="info-item">
                    <span class="info-label">工作天数：</span>
                    <span class="info-value">{{ detailData.workDays }}天</span>
                  </div>
                </el-col>
              </el-row>
            </el-descriptions-item>
            
            <!-- 加项 -->
            <el-descriptions-item label="加项" :span="1">
              <el-row :gutter="20">
                <el-col :span="8">
                  <div class="info-item">
                    <span class="info-label">基本薪资：</span>
                    <span class="info-value">¥{{ (detailData.basicSalary || 0).toFixed(2) }}</span>
                  </div>
                </el-col>
                <el-col :span="8">
                  <div class="info-item">
                    <span class="info-label">绩效奖金：</span>
                    <span class="info-value">¥{{ (detailData.performanceBonus || 0).toFixed(2) }}</span>
                  </div>
                </el-col>
                <el-col :span="8">
                  <div class="info-item">
                    <span class="info-label">主管加给：</span>
                    <span class="info-value">¥{{ (detailData.supervisorAllowance || 0).toFixed(2) }}</span>
                  </div>
                </el-col>
                <el-col :span="8">
                  <div class="info-item">
                    <span class="info-label">职务加给：</span>
                    <span class="info-value">¥{{ (detailData.positionAllowance || 0).toFixed(2) }}</span>
                  </div>
                </el-col>
                <el-col :span="8">
                  <div class="info-item">
                    <span class="info-label">平时加班费：</span>
                    <span class="info-value">¥{{ (detailData.regularOvertimePay || 0).toFixed(2) }}</span>
                  </div>
                </el-col>
                <el-col :span="8">
                  <div class="info-item">
                    <span class="info-label">假日加班费：</span>
                    <span class="info-value">¥{{ (detailData.holidayOvertimePay || 0).toFixed(2) }}</span>
                  </div>
                </el-col>
                <el-col :span="8">
                  <div class="info-item">
                    <span class="info-label">国假加班费：</span>
                    <span class="info-value">¥{{ (detailData.nationalHolidayOvertimePay || 0).toFixed(2) }}</span>
                  </div>
                </el-col>
                <el-col :span="8">
                  <div class="info-item">
                    <span class="info-label">司龄奖：</span>
                    <span class="info-value">¥{{ (detailData.seniorityBonus || 0).toFixed(2) }}</span>
                  </div>
                </el-col>
                <el-col :span="8">
                  <div class="info-item">
                    <span class="info-label">出勤奖金：</span>
                    <span class="info-value">¥{{ (detailData.attendanceBonus || 0).toFixed(2) }}</span>
                  </div>
                </el-col>
                <el-col :span="8">
                  <div class="info-item">
                    <span class="info-label">餐费补助：</span>
                    <span class="info-value">¥{{ (detailData.mealAllowance || 0).toFixed(2) }}</span>
                  </div>
                </el-col>
                <el-col :span="8">
                  <div class="info-item">
                    <span class="info-label">夜班津贴：</span>
                    <span class="info-value">¥{{ (detailData.nightShiftAllowance || 0).toFixed(2) }}</span>
                  </div>
                </el-col>
                <el-col :span="8">
                  <div class="info-item">
                    <span class="info-label">推荐奖金：</span>
                    <span class="info-value">¥{{ (detailData.referralBonus || 0).toFixed(2) }}</span>
                  </div>
                </el-col>
                <el-col :span="8">
                  <div class="info-item">
                    <span class="info-label">奖金1：</span>
                    <span class="info-value">¥{{ (detailData.bonus1 || 0).toFixed(2) }}</span>
                  </div>
                </el-col>
                <el-col :span="8">
                  <div class="info-item">
                    <span class="info-label">奖金2：</span>
                    <span class="info-value">¥{{ (detailData.bonus2 || 0).toFixed(2) }}</span>
                  </div>
                </el-col>
                <el-col :span="8">
                  <div class="info-item">
                    <span class="info-label">培训补助：</span>
                    <span class="info-value">¥{{ (detailData.trainingAllowance || 0).toFixed(2) }}</span>
                  </div>
                </el-col>
                <el-col :span="8">
                  <div class="info-item">
                    <span class="info-label">高温补贴：</span>
                    <span class="info-value">¥{{ (detailData.highTemperatureAllowance || 0).toFixed(2) }}</span>
                  </div>
                </el-col>
                <el-col :span="8">
                  <div class="info-item">
                    <span class="info-label">其他加项：</span>
                    <span class="info-value">¥{{ (detailData.otherAdditions || 0).toFixed(2) }}</span>
                  </div>
                </el-col>
                <el-col :span="8">
                  <div class="info-item">
                    <span class="info-label">负薪水调整：</span>
                    <span class="info-value">¥{{ (detailData.negativeSalaryAdjustment || 0).toFixed(2) }}</span>
                  </div>
                </el-col>
              </el-row>
            </el-descriptions-item>
            
            <!-- 扣项 -->
            <el-descriptions-item label="扣项" :span="1">
              <el-row :gutter="20">
                <el-col :span="8">
                  <div class="info-item">
                    <span class="info-label">流产假(时数)：</span>
                    <span class="info-value">{{ (detailData.miscarriageLeaveHours || 0) }}小时</span>
                  </div>
                </el-col>
                <el-col :span="8">
                  <div class="info-item">
                    <span class="info-label">产假时数：</span>
                    <span class="info-value">{{ (detailData.maternityLeaveHours || 0) }}小时</span>
                  </div>
                </el-col>
                <el-col :span="8">
                  <div class="info-item">
                    <span class="info-label">事假(时数)：</span>
                    <span class="info-value">{{ (detailData.personalLeaveHours || 0) }}小时</span>
                  </div>
                </el-col>
                <el-col :span="8">
                  <div class="info-item">
                    <span class="info-label">旷工(时数)：</span>
                    <span class="info-value">{{ (detailData.absenteeismHours || 0) }}小时</span>
                  </div>
                </el-col>
                <el-col :span="8">
                  <div class="info-item">
                    <span class="info-label">税前请假扣款：</span>
                    <span class="info-value">¥{{ (detailData.preTaxLeaveDeductions || 0).toFixed(2) }}</span>
                  </div>
                </el-col>
                <el-col :span="8">
                  <div class="info-item">
                    <span class="info-label">病假(时数)：</span>
                    <span class="info-value">{{ (detailData.sickLeaveHours || 0) }}小时</span>
                  </div>
                </el-col>
                <el-col :span="8">
                  <div class="info-item">
                    <span class="info-label">税前病假扣款：</span>
                    <span class="info-value">¥{{ (detailData.preTaxSickLeaveDeductions || 0).toFixed(2) }}</span>
                  </div>
                </el-col>
                <el-col :span="8">
                  <div class="info-item">
                    <span class="info-label">补扣上月负薪水：</span>
                    <span class="info-value">¥{{ (detailData.previousMonthNegativeSalary || 0).toFixed(2) }}</span>
                  </div>
                </el-col>
                <el-col :span="8">
                  <div class="info-item">
                    <span class="info-label">社保个人：</span>
                    <span class="info-value">¥{{ (detailData.socialInsurancePersonal || 0).toFixed(2) }}</span>
                  </div>
                </el-col>
                <el-col :span="8">
                  <div class="info-item">
                    <span class="info-label">公积金个人：</span>
                    <span class="info-value">¥{{ (detailData.housingFundPersonal || 0).toFixed(2) }}</span>
                  </div>
                </el-col>
                <el-col :span="8">
                  <div class="info-item">
                    <span class="info-label">税后其它扣款：</span>
                    <span class="info-value">¥{{ (detailData.otherPostTaxDeductions || 0).toFixed(2) }}</span>
                  </div>
                </el-col>
                <el-col :span="8">
                  <div class="info-item">
                    <span class="info-label">税后餐饮扣款：</span>
                    <span class="info-value">¥{{ (detailData.postTaxMealDeductions || 0).toFixed(2) }}</span>
                  </div>
                </el-col>
                <el-col :span="8">
                  <div class="info-item">
                    <span class="info-label">税后宿舍扣款：</span>
                    <span class="info-value">¥{{ (detailData.postTaxDormitoryDeductions || 0).toFixed(2) }}</span>
                  </div>
                </el-col>
              </el-row>
            </el-descriptions-item>
            
            <!-- 工资汇总 -->
            <el-descriptions-item label="工资汇总" :span="1">
              <el-row :gutter="20">
                <el-col :span="8">
                  <div class="info-item">
                    <span class="info-label">总扣除：</span>
                    <span class="info-value">¥{{ (detailData.deduction || 0).toFixed(2) }}</span>
                  </div>
                </el-col>
                <el-col :span="8">
                  <div class="info-item">
                    <span class="info-label">实发工资：</span>
                    <span class="info-value total">¥{{ (detailData.totalSalary || 0).toFixed(2) }}</span>
                  </div>
                </el-col>
              </el-row>
            </el-descriptions-item>
            
            <!-- 发放信息 -->
            <el-descriptions-item label="发放信息" :span="1">
              <el-row :gutter="20">
                <el-col :span="8">
                  <div class="info-item">
                    <span class="info-label">发放状态：</span>
                    <el-tag :type="getStatusType(detailData.status)">
                      {{ getStatusText(detailData.status) }}
                    </el-tag>
                  </div>
                </el-col>
                <el-col :span="8">
                  <div class="info-item">
                    <span class="info-label">发放时间：</span>
                    <span class="info-value">{{ detailData.issueDate || '-' }}</span>
                  </div>
                </el-col>
                <el-col :span="8">
                  <div class="info-item">
                    <span class="info-label">发放月份：</span>
                    <span class="info-value">{{ detailData.salaryMonth }}</span>
                  </div>
                </el-col>
                <el-col :span="24">
                  <div class="info-item">
                    <span class="info-label">发放说明：</span>
                    <span class="info-value">{{ detailData.description || '-' }}</span>
                  </div>
                </el-col>
              </el-row>
            </el-descriptions-item>
          </el-descriptions>
        </div>
        <el-empty v-else description="未找到数据" />
      </el-card>
    </div>
    
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
      <el-button 
        v-if="detailData?.status === 'pending'" 
        type="success" 
        @click="handleIssue"
      >
        <el-icon><Money /></el-icon>
        发放
      </el-button>
    </div>
    
    <!-- 工人信息侧边栏 -->
    <WorkerInfoSidebar
      v-model:visible="workerInfoVisible"
      :worker-name="detailData?.workerName"
      :phone="detailData?.phone"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { ArrowLeft, Edit, Money, User } from '@element-plus/icons-vue'
import { useRouter, useRoute } from 'vue-router'
import WorkerInfoSidebar from '@/components/WorkerInfoSidebar.vue'

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
  basicSalary: number
  overtimeSalary: number
  bonus: number
  deduction: number
  totalSalary: number
  workDays: number
  mealAllowance: number
  socialInsurancePersonal: number
  housingFundPersonal: number
  otherDeductions: number
  status: 'pending' | 'issued'
  salaryMonth: string
  issueDate?: string
  description?: string
}

const router = useRouter()
const route = useRoute()

const loading = ref(false)

// 工人信息侧边栏
const workerInfoVisible = ref(false)
const detailData = ref<SalaryRecord | null>(null)

// 所有模拟数据
const allData = ref<SalaryRecord[]>([])

// 生成模拟数据
const generateMockData = (): SalaryRecord[] => {
  const names = ['张三', '李四', '王五', '赵六', '孙七', '周八', '吴九', '郑十', '钱十一', '陈十二']
  const factories = ['深圳电子厂', '东莞制造厂', '广州服装厂', '佛山五金厂', '惠州电子厂']
  const positions = ['普工', '技术工', '质检员', '班组长', '主管']
  const settlementTypes = ['daily', 'monthly']
  const data: SalaryRecord[] = []

  for (let i = 0; i < 80; i++) {
    const status = Math.random() > 0.3 ? 'issued' : 'pending'
    const basicSalary = Math.floor(Math.random() * 3000 + 2000)
    const overtimeSalary = Math.floor(Math.random() * 1000)
    const bonus = Math.floor(Math.random() * 500)
    const mealAllowance = 450
    const socialInsurancePersonal = 27.38
    const housingFundPersonal = 15
    const otherDeductions = 115.24
    const deduction = socialInsurancePersonal + housingFundPersonal + otherDeductions
    const workDays = Math.floor(Math.random() * 5) + 25
    const salaryMonth = `${2026}-${String(Math.floor(Math.random() * 3) + 1).padStart(2, '0')}`

    data.push({
      id: `SAL${String(i + 1).padStart(6, '0')}`,
      workerName: names[Math.floor(Math.random() * names.length)],
      idCard: `${Math.floor(Math.random() * 100000 + 100000)}${Math.floor(Math.random() * 10000000000)}`,
      phone: `138${Math.floor(Math.random() * 100000000).toString().padStart(8, '0')}`,
      bankCard: `62${Math.floor(Math.random() * 10000000000000000)}`,
      factoryName: factories[Math.floor(Math.random() * factories.length)],
      positionName: positions[Math.floor(Math.random() * positions.length)],
      settlementType: settlementTypes[Math.floor(Math.random() * settlementTypes.length)] as 'daily' | 'monthly',
      basicSalary,
      overtimeSalary,
      bonus,
      mealAllowance,
      socialInsurancePersonal,
      housingFundPersonal,
      otherDeductions,
      deduction,
      totalSalary: basicSalary + overtimeSalary + bonus + mealAllowance - deduction,
      workDays,
      status,
      salaryMonth,
      issueDate: status === 'issued' ? '2026-02-15 10:00:00' : undefined,
      description: `${salaryMonth}月工资`
    })
  }

  return data
}

// 获取状态类型
const getStatusType = (status: string): string => {
  return status === 'issued' ? 'success' : 'warning'
}

// 获取状态文本
const getStatusText = (status: string): string => {
  return status === 'issued' ? '已发放' : '待发放'
}

// 获取详情数据
const fetchDetail = async () => {
  const id = route.params.id as string
  if (!id) {
    ElMessage.error('缺少ID参数')
    return
  }

  loading.value = true
  try {
    // 模拟获取数据
    const data = allData.value.find(item => item.id === id)
    if (data) {
      detailData.value = data
    } else {
      ElMessage.error('未找到数据')
    }
  } catch (error) {
    ElMessage.error('获取数据失败')
  } finally {
    loading.value = false
  }
}

// 编辑
const handleEdit = () => {
  if (!detailData.value) return
  router.push(`/tenant/on-duty/salary/edit/${detailData.value.id}`)
}

// 发放
const handleIssue = () => {
  if (!detailData.value) return
  
  ElMessageBox.confirm('确定要发放该工人的工资吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    const index = allData.value.findIndex(item => item.id === detailData.value?.id)
    if (index > -1) {
      allData.value[index].status = 'issued'
      allData.value[index].issueDate = new Date().toISOString().replace('T', ' ').slice(0, 19)
      detailData.value = allData.value[index]
    }
    ElMessage.success('工资发放成功')
  }).catch(() => {})
}

// 返回
const goBack = () => {
  router.back()
}

// 切换工人信息侧边栏
const toggleWorkerInfo = () => {
  workerInfoVisible.value = !workerInfoVisible.value
}

// 生命周期
onMounted(() => {
  allData.value = generateMockData()
  fetchDetail()
})
</script>

<style scoped>
/* 详情页容器 - 使用flex布局实现内部滚动 */
.detail-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #f5f7fa;
}

/* 内容区域 - 垂直滚动 */
.detail-content {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  padding-bottom: 80px; /* 为底部按钮栏留出空间 */
}

.detail-card {
  max-width: 1000px;
  margin: 0 auto;
  padding: 16px;
}

.content {
  margin-top: 16px;
}

/* 信息项样式 */
.info-item {
  margin-bottom: 8px;
}

.info-label {
  font-weight: 500;
  color: #606266;
  margin-right: 8px;
}

.info-value {
  color: #303133;
  font-weight: 400;
}

.info-value.total {
  color: #e6a23c;
  font-size: 16px;
  font-weight: bold;
}

/* 底部按钮栏 - 固定悬浮 */
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

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.detail-content.with-sidebar {
  margin-right: 480px;
  transition: margin-right 0.3s ease;
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
  
  .detail-content.with-sidebar {
    margin-right: 0;
  }
  
  .detail-card {
    max-width: 100%;
  }
  
  .info-item {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .info-label {
    margin-bottom: 4px;
  }
}
</style>