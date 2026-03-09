<template>
  <div class="rule-detail">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>规则详情</span>
        </div>
      </template>
      
      <div class="detail-content">
        <el-descriptions :column="1" border>
          <el-descriptions-item label="规则名称">
            {{ ruleDetail.name }}
          </el-descriptions-item>
          <el-descriptions-item label="规则类型">
            {{ getTypeText(ruleDetail.type) }}
          </el-descriptions-item>
          <el-descriptions-item label="生效日期">
            {{ ruleDetail.effectiveDate }}
          </el-descriptions-item>
          <el-descriptions-item label="生效状态">
            <el-tag :type="ruleDetail.status === 'active' ? 'success' : 'info'">
              {{ ruleDetail.status === 'active' ? '生效' : '未生效' }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="规则说明">
            {{ ruleDetail.description }}
          </el-descriptions-item>
        </el-descriptions>

        <!-- 可预支额度计算规则详情 -->
        <el-collapse v-if="ruleDetail.type === 'advance'">
          <el-collapse-item title="可预支额度计算规则配置">
            <el-descriptions :column="1" border style="margin-top: 16px">
              <el-descriptions-item label="工厂">
                {{ ruleDetail.factory }}
              </el-descriptions-item>
              <el-descriptions-item label="每日工作时长">
                {{ ruleDetail.dailyWorkHours }}小时
              </el-descriptions-item>
              <el-descriptions-item label="大班时薪倍数">
                {{ ruleDetail.overtimeMultiple }}倍
              </el-descriptions-item>
              <el-descriptions-item label="节假日时薪倍数">
                {{ ruleDetail.holidayMultiple }}倍
              </el-descriptions-item>
              <el-descriptions-item label="起算日期">
                进厂后第{{ ruleDetail.startDay }}天（不含）起算
              </el-descriptions-item>
              <el-descriptions-item label="可预支生活费比例">
                {{ ruleDetail.advanceRatio }}%
              </el-descriptions-item>
              <el-descriptions-item label="岗位时薪配置">
                <el-table :data="ruleDetail.positionWages" style="width: 100%">
                  <el-table-column prop="position" label="岗位" width="180" />
                  <el-table-column prop="wage" label="时薪" width="180" />
                  <el-table-column prop="allowance" label="工差" width="180" />
                </el-table>
              </el-descriptions-item>
            </el-descriptions>
          </el-collapse-item>
        </el-collapse>
      </div>
    </el-card>

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
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ArrowLeft, Edit } from '@element-plus/icons-vue'

const router = useRouter()
const route = useRoute()

// 类型定义
interface PositionWage {
  position: string
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
  dailyWorkHours?: number
  overtimeMultiple?: number
  holidayMultiple?: number
  startDay?: number
  advanceRatio?: number
  positionWages?: PositionWage[]
}

// 响应式数据
const ruleDetail = reactive<RuleRecord>({
  id: '',
  name: '',
  type: '',
  effectiveDate: '',
  description: '',
  status: 'active',
  factory: '',
  dailyWorkHours: 0,
  overtimeMultiple: 0,
  holidayMultiple: 0,
  startDay: 0,
  advanceRatio: 0,
  positionWages: []
})

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
    factory: '南通富民劳务服务有限公司',
    dailyWorkHours: 8,
    overtimeMultiple: 1.5,
    holidayMultiple: 2,
    startDay: 7,
    advanceRatio: 80,
    positionWages: [
      { position: '普工', wage: 20, allowance: 2 },
      { position: '技工', wage: 30, allowance: 5 }
    ]
  }
]

// 加载数据
const loadData = () => {
  const id = route.params.id as string
  if (id) {
    const rule = mockData.find(item => item.id === id)
    if (rule) {
      Object.assign(ruleDetail, rule)
    }
  }
}

// 获取规则类型文本
const getTypeText = (type: string) => {
  const map: Record<string, string> = {
    attendance: '考勤',
    personnel: '人事',
    advance: '可预支额度计算'
  }
  return map[type] || type
}

// 返回
const goBack = () => {
  router.push('/tenant/rules')
}

// 编辑
const handleEdit = () => {
  router.push(`/tenant/rules/form/${ruleDetail.id}`)
}

// 生命周期
onMounted(() => {
  loadData()
})
</script>

<style scoped>
.rule-detail {
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

.detail-content {
  margin-top: 20px;
}

.detail-footer {
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
  .detail-footer {
    flex-direction: column;
  }
  
  .detail-footer .el-button {
    width: 100%;
  }
}
</style>