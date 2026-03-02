<template>
  <div class="settlement-form-container">
    <!-- 顶部操作栏 -->
    <div class="page-header">
      <div class="header-actions">
        <el-button @click="handleReset">重置</el-button>
        <el-button type="primary" @click="handleSubmit" :loading="submitting">提交</el-button>
      </div>
    </div>

    <!-- 表单区域 -->
    <div class="form-section">
      <el-card>
        <template #header>
          <span class="card-title">结算基本信息</span>
        </template>
        <el-form
          ref="formRef"
          :model="formData"
          :rules="formRules"
          label-width="140px"
          label-position="right"
        >
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="发放年月" prop="issueMonth">
                <el-date-picker
                  v-model="formData.issueMonth"
                  type="month"
                  placeholder="请选择发放年月"
                  value-format="YYYY-MM"
                  style="width: 100%"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="工厂" prop="factory">
                <el-input v-model="formData.factory" placeholder="请输入工厂名称" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="发放时间">
                <el-date-picker
                  v-model="formData.issueDate"
                  type="datetime"
                  placeholder="请选择发放时间"
                  value-format="YYYY-MM-DD HH:mm:ss"
                  style="width: 100%"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="发放说明" prop="issueDescription">
                <el-input v-model="formData.issueDescription" placeholder="请输入发放说明" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="24">
              <el-form-item label="备注">
                <el-input
                  v-model="formData.remark"
                  type="textarea"
                  :rows="3"
                  placeholder="请输入备注"
                />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-card>

      <el-card class="mt-4">
        <template #header>
          <div class="card-header">
            <span class="card-title">发放明细</span>
            <div>
              <el-button type="primary" size="small" @click="handleImportDetail">导入</el-button>
              <el-button size="small" @click="handleAddRow">新增</el-button>
            </div>
          </div>
        </template>
        <el-table :data="formData.workerList" border stripe>
          <el-table-column type="index" label="序号" width="60" />
          <el-table-column label="工人信息" min-width="200">
            <template #default="{ row }">
              <div>{{ row.workerName }}</div>
              <div style="font-size: 12px; color: #909399">{{ row.phone }}</div>
            </template>
          </el-table-column>
          <el-table-column prop="idCard" label="身份证号" min-width="180" />
          <el-table-column prop="bankName" label="开户行" min-width="150" />
          <el-table-column prop="bankAccount" label="银行账号" min-width="180" />
          <el-table-column prop="workDays" label="工作天数" min-width="100">
            <template #default="{ row, $index }">
              <el-input-number
                v-model="row.workDays"
                :min="0"
                :max="31"
                size="small"
                controls-position="right"
                @change="calculateRowTotal($index)"
              />
            </template>
          </el-table-column>
          <el-table-column prop="baseSalary" label="基本工资" min-width="120">
            <template #default="{ row, $index }">
              <el-input-number
                v-model="row.baseSalary"
                :min="0"
                :precision="2"
                size="small"
                controls-position="right"
                @change="calculateRowTotal($index)"
              />
            </template>
          </el-table-column>
          <el-table-column prop="overtimePay" label="加班费" min-width="100">
            <template #default="{ row, $index }">
              <el-input-number
                v-model="row.overtimePay"
                :min="0"
                :precision="2"
                size="small"
                controls-position="right"
                @change="calculateRowTotal($index)"
              />
            </template>
          </el-table-column>
          <el-table-column prop="performanceBonus" label="绩效奖" min-width="100">
            <template #default="{ row, $index }">
              <el-input-number
                v-model="row.performanceBonus"
                :min="0"
                :precision="2"
                size="small"
                controls-position="right"
                @change="calculateRowTotal($index)"
              />
            </template>
          </el-table-column>
          <el-table-column prop="allowance" label="补贴" min-width="100">
            <template #default="{ row, $index }">
              <el-input-number
                v-model="row.allowance"
                :min="0"
                :precision="2"
                size="small"
                controls-position="right"
                @change="calculateRowTotal($index)"
              />
            </template>
          </el-table-column>
          <el-table-column prop="deductions" label="扣款" min-width="100">
            <template #default="{ row, $index }">
              <el-input-number
                v-model="row.deductions"
                :min="0"
                :precision="2"
                size="small"
                controls-position="right"
                @change="calculateRowTotal($index)"
              />
            </template>
          </el-table-column>
          <el-table-column prop="netSalary" label="实发工资" min-width="120">
            <template #default="{ row }">
              <span style="color: #67c23a; font-weight: 600">{{ row.netSalary.toFixed(2) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="80" fixed="right">
            <template #default="{ $index }">
              <el-button type="danger" link @click="handleRemoveRow($index)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>

        <!-- 合计信息 -->
        <div class="summary-info">
          <span>人数：{{ formData.workerList.length }}人</span>
          <span>实发工资合计：{{ totalAmount.toFixed(2) }}元</span>
        </div>
      </el-card>
    </div>

    <!-- 导入对话框 -->
    <el-dialog
      v-model="importDialogVisible"
      title="导入发放明细"
      width="500px"
      :close-on-click-modal="false"
    >
      <el-form label-width="100px">
        <el-form-item label="导入文件">
          <el-upload
            ref="uploadRef"
            :auto-upload="false"
            :limit="1"
            accept=".xlsx,.xls"
            :on-change="handleFileChange"
            :on-exceed="handleExceed"
          >
            <el-button type="primary">选择文件</el-button>
            <template #tip>
              <div class="el-upload__tip">支持 .xlsx/.xls 格式，文件大小不超过 10MB</div>
            </template>
          </el-upload>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="small" @click="handleDownloadTemplate">下载模板</el-button>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="importDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmitImport" :loading="importing">确定导入</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { FormInstance, FormRules, UploadInstance, UploadRawFile } from 'element-plus'

// 路由
const router = useRouter()
const route = useRoute()

// 表单引用
const formRef = ref<FormInstance>()
const uploadRef = ref<UploadInstance>()

// 提交状态
const submitting = ref(false)

// 导入对话框
const importDialogVisible = ref(false)
const importing = ref(false)
const selectedFile = ref<UploadRawFile | null>(null)

// 是否编辑模式
const isEdit = computed(() => !!route.params.id)

// 工人清单每行的数据类型
interface WorkerItem {
  workerName: string
  phone: string
  idCard: string
  bankName: string
  bankAccount: string
  workDays: number
  baseSalary: number
  overtimePay: number
  performanceBonus: number
  allowance: number
  deductions: number
  netSalary: number
}

// 表单数据
const formData = reactive({
  issueMonth: '',
  factory: '',
  issueDate: '',
  issueDescription: '',
  remark: '',
  workerList: [] as WorkerItem[]
})

// 表单验证规则
const formRules: FormRules = {
  issueMonth: [{ required: true, message: '请选择发放年月', trigger: 'change' }],
  factory: [{ required: true, message: '请输入工厂名称', trigger: 'blur' }],
  issueDescription: [{ required: true, message: '请输入发放说明', trigger: 'blur' }]
}

// 计算实发工资合计
const totalAmount = computed(() => {
  return formData.workerList.reduce((sum, item) => sum + item.netSalary, 0)
})

// 计算单行实发工资
const calculateRowTotal = (index: number) => {
  const item = formData.workerList[index]
  item.netSalary = item.baseSalary + item.overtimePay + item.performanceBonus + item.allowance - item.deductions
}

// 添加行
const handleAddRow = () => {
  formData.workerList.push({
    workerName: '',
    phone: '',
    idCard: '',
    bankName: '',
    bankAccount: '',
    workDays: 0,
    baseSalary: 0,
    overtimePay: 0,
    performanceBonus: 0,
    allowance: 0,
    deductions: 0,
    netSalary: 0
  })
}

// 删除行
const handleRemoveRow = (index: number) => {
  formData.workerList.splice(index, 1)
}

// 导入明细
const handleImportDetail = () => {
  selectedFile.value = null
  importDialogVisible.value = true
}

// 文件变化
const handleFileChange = (file: any) => {
  selectedFile.value = file.raw
}

// 文件超出限制
const handleExceed = () => {
  ElMessage.warning('只能选择一个文件')
}

// 下载模板
const handleDownloadTemplate = () => {
  ElMessage.success('模板下载功能开发中')
}

// 提交导入
const handleSubmitImport = async () => {
  if (!selectedFile.value) {
    ElMessage.warning('请选择要导入的文件')
    return
  }

  importing.value = true
  try {
    // 模拟导入
    await new Promise(resolve => setTimeout(resolve, 1000))

    // 添加模拟数据
    const mockWorkers = [
      {
        workerName: '张三',
        phone: '13800138001',
        idCard: '110101199001011234',
        bankName: '中国工商银行',
        bankAccount: '6222021234567890',
        workDays: 30,
        baseSalary: 4000,
        overtimePay: 800,
        performanceBonus: 500,
        allowance: 300,
        deductions: 200,
        netSalary: 5400
      },
      {
        workerName: '李四',
        phone: '13800138002',
        idCard: '110101199002021234',
        bankName: '中国农业银行',
        bankAccount: '6222021234567891',
        workDays: 28,
        baseSalary: 3800,
        overtimePay: 600,
        performanceBonus: 400,
        allowance: 200,
        deductions: 150,
        netSalary: 4850
      }
    ]

    formData.workerList = [...formData.workerList, ...mockWorkers]

    ElMessage.success('导入成功')
    importDialogVisible.value = false
  } catch (error) {
    ElMessage.error('导入失败')
  } finally {
    importing.value = false
  }
}

// 重置
const handleReset = () => {
  formRef.value?.resetFields()
  formData.workerList = []
}

// 提交
const handleSubmit = async () => {
  try {
    await formRef.value?.validate()

    if (formData.workerList.length === 0) {
      ElMessage.warning('请添加发放明细')
      return
    }

    // 验证所有工人信息
    const invalidWorkers = formData.workerList.filter(
      item => !item.workerName || !item.phone || !item.idCard
    )
    if (invalidWorkers.length > 0) {
      ElMessage.warning('请完善所有工人信息')
      return
    }

    submitting.value = true
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 1000))

    ElMessage.success(isEdit.value ? '修改成功' : '提交成功')
    router.push({ name: 'LaborCompanySettlement' })
  } catch (error) {
    console.error('验证失败:', error)
  } finally {
    submitting.value = false
  }
}

// 加载数据
const loadData = async () => {
  if (isEdit.value) {
    // 模拟加载数据
    const mockData = {
      issueMonth: '2026-01',
      factory: '富士康科技集团',
      issueDate: '2026-02-05 10:00:00',
      issueDescription: '2026年1月份工资结算',
      remark: '',
      workerList: [
        {
          workerName: '张三',
          phone: '13800138001',
          idCard: '110101199001011234',
          bankName: '中国工商银行',
          bankAccount: '6222021234567890',
          workDays: 30,
          baseSalary: 4000,
          overtimePay: 800,
          performanceBonus: 500,
          allowance: 300,
          deductions: 200,
          netSalary: 5400
        },
        {
          workerName: '李四',
          phone: '13800138002',
          idCard: '110101199002021234',
          bankName: '中国农业银行',
          bankAccount: '6222021234567891',
          workDays: 28,
          baseSalary: 3800,
          overtimePay: 600,
          performanceBonus: 400,
          allowance: 200,
          deductions: 150,
          netSalary: 4850
        }
      ]
    }
    Object.assign(formData, mockData)
  }
}

// 生命周期
onMounted(() => {
  loadData()
})
</script>

<style scoped>
.settlement-form-container {
  padding: 20px;
  background-color: #f5f7fa;
  min-height: calc(100vh - 100px);
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

.header-actions {
  display: flex;
  gap: 10px;
}

.form-section {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-section .el-card {
  border-radius: 4px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-title {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
}

.mt-4 {
  margin-top: 16px;
}

.summary-info {
  display: flex;
  justify-content: flex-end;
  gap: 30px 30px;
  margin-top: 16px;
  padding: 12px 16px;
  background-color: #f5f7fa;
  border-radius: 4px;
  font-size: 14px;
  color: #303133;
}

.summary-info span:last-child {
  font-weight: 600;
  color: #67c23a;
}
</style>
