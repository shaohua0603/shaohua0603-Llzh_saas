<template>
  <div class="rule-form">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>{{ isEdit ? '编辑规则' : '新增规则' }}</span>
        </div>
      </template>
      
      <el-form :model="ruleForm" :rules="rules" ref="ruleFormRef" label-width="120px">
        <el-form-item label="规则名称" prop="name">
          <el-input 
            v-model="ruleForm.name" 
            placeholder="请输入规则名称" 
            :disabled="ruleForm.type === 'PLATFORM_USER_REGISTRATION'"
          />
        </el-form-item>
        <el-form-item label="规则类型" prop="type">
          <el-select 
            v-model="ruleForm.type" 
            placeholder="请选择规则类型"
            :disabled="ruleForm.type === 'PLATFORM_USER_REGISTRATION'"
          >
            <el-option label="考勤" value="attendance" />
            <el-option label="人事" value="personnel" />
            <el-option label="可预支额度计算" value="advance" />
            <el-option label="注册平台用户规则" value="PLATFORM_USER_REGISTRATION" />
          </el-select>
        </el-form-item>
        <el-form-item label="生效日期" prop="effectiveDate">
          <el-date-picker
            v-model="ruleForm.effectiveDate"
            type="date"
            placeholder="选择日期"
            style="width: 100%"
            :disabled="ruleForm.type === 'PLATFORM_USER_REGISTRATION'"
          />
        </el-form-item>
        <el-form-item label="生效状态" prop="status">
          <el-switch v-model="ruleForm.status" active-value="active" inactive-value="inactive" />
        </el-form-item>
        <el-form-item label="规则说明" prop="description">
          <el-input
            v-model="ruleForm.description"
            type="textarea"
            placeholder="请输入规则说明"
            rows="3"
            :disabled="ruleForm.type === 'PLATFORM_USER_REGISTRATION'"
          />
        </el-form-item>

        <!-- 可预支额度计算规则配置 -->
        <el-collapse v-if="ruleForm.type === 'advance'">
          <el-collapse-item title="可预支额度计算规则配置">
            <el-form-item label="工厂" prop="factory">
              <el-input
                v-model="ruleForm.factory"
                placeholder="请选择工厂"
                readonly
                @click="handleSelectFactory"
              >
                <template #suffix>
                  <el-icon><Search /></el-icon>
                </template>
              </el-input>
            </el-form-item>
            <el-form-item label="每日工作时长">
              <el-input v-model.number="ruleForm.dailyWorkHours" type="number" placeholder="请输入每日工作时长" />
            </el-form-item>
            <el-form-item label="大班时薪倍数">
              <el-input v-model.number="ruleForm.overtimeMultiple" type="number" placeholder="请输入大班时薪倍数" />
            </el-form-item>
            <el-form-item label="节假日时薪倍数">
              <el-input v-model.number="ruleForm.holidayMultiple" type="number" placeholder="请输入节假日时薪倍数" />
            </el-form-item>
            <el-form-item label="起算日期">
              <el-input v-model.number="ruleForm.startDay" type="number" placeholder="进厂后第几天（不含）起算" />
            </el-form-item>
            <el-form-item label="可预支生活费比例">
              <el-input v-model.number="ruleForm.advanceRatio" type="number" placeholder="请输入可预支生活费比例" />
            </el-form-item>
            
            <!-- 岗位时薪配置 -->
            <el-form-item label="岗位时薪配置">
              <el-table :data="ruleForm.positionWages" style="width: 100%">
                <el-table-column prop="position" label="岗位" width="180">
                  <template #default="scope">
                    <el-input
                      v-model="scope.row.position"
                      placeholder="请选择岗位"
                      readonly
                      @click="handleSelectPosition(scope.$index)"
                    >
                      <template #suffix>
                        <el-icon><Search /></el-icon>
                      </template>
                    </el-input>
                  </template>
                </el-table-column>
                <el-table-column prop="wage" label="时薪" width="180">
                  <template #default="scope">
                    <el-input v-model.number="scope.row.wage" type="number" />
                  </template>
                </el-table-column>
                <el-table-column prop="allowance" label="工差" width="180">
                  <template #default="scope">
                    <el-input v-model.number="scope.row.allowance" type="number" />
                  </template>
                </el-table-column>
                <el-table-column label="操作" width="100">
                  <template #default="scope">
                    <el-button type="danger" size="small" @click="removePositionWage(scope.$index)">
                      <el-icon><Delete /></el-icon>
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
              <el-button type="primary" size="small" @click="addPositionWage" style="margin-top: 10px" :disabled="!ruleForm.factory">
                <el-icon><Plus /></el-icon>
                添加岗位
              </el-button>
            </el-form-item>
          </el-collapse-item>
        </el-collapse>

        <!-- 注册平台用户规则配置 -->
        <el-collapse v-if="ruleForm.type === 'PLATFORM_USER_REGISTRATION'">
          <el-collapse-item title="注册平台用户规则配置">
            <el-form-item label="规则说明">
              <el-input
                v-model="ruleForm.description"
                type="textarea"
                placeholder="租户新增的工人或正式员工将自动推送到平台验证是否为新用户，如果为新用户将自动完成注册，同时平台向租户定期结算拉新奖励"
                rows="3"
                readonly
              />
            </el-form-item>
            <el-form-item label="启用状态">
              <el-switch v-model="ruleForm.status" active-value="active" inactive-value="inactive" />
            </el-form-item>
            <el-alert
              title="规则说明"
              type="info"
              :closable="false"
              style="margin-top: 20px"
            >
              <template #default>
                <p>1. 开启后，租户新增的工人或正式员工将自动推送到平台</p>
                <p>2. 平台将验证用户是否为新用户，新用户将自动完成注册</p>
                <p>3. 平台将向租户定期结算拉新奖励</p>
              </template>
            </el-alert>
          </el-collapse-item>
        </el-collapse>
      </el-form>
    </el-card>

    <!-- 工厂选择对话框 -->
    <FactorySelectDialog
      v-model="factoryDialogVisible"
      @confirm="handleFactorySelected"
    />

    <!-- 岗位选择对话框 -->
    <PositionSelectDialog
      v-model="positionDialogVisible"
      :factory-id="ruleForm.factoryId"
      @confirm="handlePositionSelected"
    />

    <!-- 底部按钮栏 -->
    <div class="form-footer">
      <el-button @click="goBack">
        <el-icon><ArrowLeft /></el-icon>
        返回
      </el-button>
      <el-button type="primary" @click="handleSubmit">
        <el-icon><Check /></el-icon>
        {{ isEdit ? '保存' : '提交' }}
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { useRouter, useRoute } from 'vue-router'
import { ArrowLeft, Check, Delete, Plus, Search } from '@element-plus/icons-vue'
import FactorySelectDialog from '@/components/FactorySelectDialog.vue'
import PositionSelectDialog from '@/components/PositionSelectDialog.vue'

const router = useRouter()
const route = useRoute()

// 类型定义
interface PositionWage {
  position: string
  positionId: string
  wage: number
  allowance: number
}

interface RuleRecord {
  id: string
  name: string
  type: string
  effectiveDate: string
  description: string
  status: 'active' | 'inactive'
  factory?: string
  factoryId?: string
  dailyWorkHours?: number
  overtimeMultiple?: number
  holidayMultiple?: number
  startDay?: number
  advanceRatio?: number
  positionWages?: PositionWage[]
}

// 响应式数据
const ruleFormRef = ref()
const isEdit = ref(false)
const ruleForm = reactive<RuleRecord>({
  id: '',
  name: '',
  type: '',
  effectiveDate: '',
  description: '',
  status: 'active',
  factory: '',
  factoryId: '',
  dailyWorkHours: 8,
  overtimeMultiple: 1.5,
  holidayMultiple: 2,
  startDay: 7,
  advanceRatio: 80,
  positionWages: [] as PositionWage[]
})

// 工厂选择对话框
const factoryDialogVisible = ref(false)

// 岗位选择对话框
const positionDialogVisible = ref(false)
const currentPositionIndex = ref(-1)

// 验证规则
const rules = {
  name: [
    { required: true, message: '请输入规则名称', trigger: 'blur' }
  ],
  type: [
    { required: true, message: '请选择规则类型', trigger: 'change' }
  ],
  effectiveDate: [
    { required: true, message: '请选择生效日期', trigger: 'change' }
  ],
  description: [
    { required: true, message: '请输入规则说明', trigger: 'blur' }
  ],
  factory: [
    { required: true, message: '请选择工厂', trigger: 'change' }
  ]
}

// Mock数据
const mockData: RuleRecord[] = [
  {
    id: '1',
    name: '考勤规则',
    type: 'attendance',
    effectiveDate: '2024-01-01',
    description: '公司考勤管理制度',
    status: 'active'
  },
  {
    id: '2',
    name: '奖惩规则',
    type: 'personnel',
    effectiveDate: '2024-01-01',
    description: '公司奖惩管理制度',
    status: 'active'
  },
  {
    id: '3',
    name: '可预支额度计算规则',
    type: 'advance',
    effectiveDate: '2024-01-01',
    description: '工人可预支生活费额度计算规则',
    status: 'active',
    factory: '东莞长安工业区',
    factoryId: 'factory1',
    dailyWorkHours: 8,
    overtimeMultiple: 1.5,
    holidayMultiple: 2,
    startDay: 7,
    advanceRatio: 80,
    positionWages: [
      { position: '操作工', positionId: 'pos1', wage: 20, allowance: 2 },
      { position: '质检员', positionId: 'pos2', wage: 30, allowance: 5 }
    ]
  },
  {
    id: '4',
    name: '注册平台用户规则',
    type: 'PLATFORM_USER_REGISTRATION',
    effectiveDate: '2024-01-01',
    description: '租户新增的工人或正式员工将自动推送到平台验证是否为新用户，如果为新用户将自动完成注册，同时平台向租户定期结算拉新奖励',
    status: 'inactive'
  }
]

// 加载数据
const loadData = () => {
  const id = route.params.id as string
  if (id) {
    isEdit.value = true
    const rule = mockData.find(item => item.id === id)
    if (rule) {
      Object.assign(ruleForm, rule)
      if (!ruleForm.positionWages) {
        ruleForm.positionWages = []
      }
    }
  }
}

// 提交
const handleSubmit = async () => {
  if (!ruleFormRef.value) return
  
  try {
    await ruleFormRef.value.validate()
    
    if (isEdit.value) {
      // 编辑
      const index = mockData.findIndex(item => item.id === ruleForm.id)
      if (index > -1) {
        mockData[index] = { ...ruleForm }
        ElMessage.success('编辑成功')
      }
    } else {
      // 新增
      mockData.push({
        ...ruleForm,
        id: Date.now().toString()
      })
      ElMessage.success('新增成功')
    }
    
    goBack()
  } catch (error) {
    console.error('验证失败:', error)
  }
}

// 返回
const goBack = () => {
  router.push('/tenant/rules')
}

// 选择工厂
const handleSelectFactory = () => {
  factoryDialogVisible.value = true
}

// 工厂选择确认
const handleFactorySelected = (factory: any) => {
  ruleForm.factoryId = factory.id
  ruleForm.factory = factory.name
  // 清空岗位列表，因为工厂已变更
  ruleForm.positionWages = []
}

// 选择岗位
const handleSelectPosition = (index: number) => {
  if (!ruleForm.factoryId) {
    ElMessage.warning('请先选择工厂')
    return
  }
  currentPositionIndex.value = index
  positionDialogVisible.value = true
}

// 岗位选择确认
const handlePositionSelected = (position: any) => {
  if (currentPositionIndex.value >= 0 && ruleForm.positionWages) {
    ruleForm.positionWages[currentPositionIndex.value] = {
      position: position.name,
      positionId: position.id,
      wage: ruleForm.positionWages[currentPositionIndex.value].wage,
      allowance: ruleForm.positionWages[currentPositionIndex.value].allowance
    }
  }
}

// 添加岗位时薪
const addPositionWage = () => {
  ruleForm.positionWages.push({ position: '', positionId: '', wage: 0, allowance: 0 })
}

// 删除岗位时薪
const removePositionWage = (index: number) => {
  ruleForm.positionWages.splice(index, 1)
}

// 生命周期
onMounted(() => {
  loadData()
})
</script>

<style scoped>
.rule-form {
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

.form-footer {
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
  .form-footer {
    flex-direction: column;
  }
  
  .form-footer .el-button {
    width: 100%;
  }
}
</style>