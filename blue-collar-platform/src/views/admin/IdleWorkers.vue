<template>
  <div class="admin-idle-workers">
    <el-card shadow="hover">
      <template #header>
        <div class="card-header">
          <span>空闲工人管理</span>
        </div>
      </template>
      
      <el-tabs v-model="activeTab" class="idle-workers-tabs">
        <el-tab-pane label="未归属劳务公司" name="unassigned">
          <el-table :data="unassignedWorkers" style="width: 100%">
            <el-table-column prop="id" label="ID" width="80" />
            <el-table-column label="工人信息" min-width="200">
              <template #default="scope">
                <div class="worker-info">
                  <el-avatar :size="40" :src="scope.row.avatar" />
                  <div class="worker-details">
                    <div class="worker-name">
                      {{ scope.row.name }}
                      <el-tag v-if="scope.row.paymentType" :type="scope.row.paymentType === '日结' ? 'warning' : 'success'" size="small" style="margin-left: 8px;">{{ scope.row.paymentType }}</el-tag>
                    </div>
                    <div class="worker-phone">{{ scope.row.phone }}</div>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="registerDate" label="注册日期" width="120" />
            <el-table-column prop="status" label="状态" width="100">
              <template #default="scope">
                <el-tag :type="getStatusType(scope.row.status)">{{ scope.row.status }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="150">
              <template #default="scope">
                <el-button size="small" @click="viewWorker(scope.row)">查看</el-button>
                <el-button size="small" type="primary" @click="assignToLaborCompany(scope.row)">分配劳务公司</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        
        <el-tab-pane label="未分配工厂" name="unemployed">
          <el-table :data="unemployedWorkers" style="width: 100%">
            <el-table-column prop="id" label="ID" width="80" />
            <el-table-column label="工人信息" min-width="200">
              <template #default="scope">
                <div class="worker-info">
                  <el-avatar :size="40" :src="scope.row.avatar" />
                  <div class="worker-details">
                    <div class="worker-name">
                      {{ scope.row.name }}
                      <el-tag v-if="scope.row.paymentType" :type="scope.row.paymentType === '日结' ? 'warning' : 'success'" size="small" style="margin-left: 8px;">{{ scope.row.paymentType }}</el-tag>
                    </div>
                    <div class="worker-phone">{{ scope.row.phone }}</div>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="laborCompany" label="所属劳务公司" width="180" />
            <el-table-column prop="skillLevel" label="技能等级" width="100">
              <template #default="scope">
                <el-tag :type="getSkillType(scope.row.skillLevel)">{{ scope.row.skillLevel }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="registerDate" label="注册日期" width="120" />
            <el-table-column label="操作" width="150">
              <template #default="scope">
                <el-button size="small" @click="viewWorker(scope.row)">查看</el-button>
                <el-button size="small" type="primary" @click="assignToFactory(scope.row)">分配工厂</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    
    <el-card shadow="hover" class="mt-4">
      <template #header>
        <div class="card-header">
          <span>空闲工人统计</span>
        </div>
      </template>
      
      <div class="stats-container">
        <el-row :gutter="20">
          <el-col :span="8">
            <el-card shadow="hover" class="stats-card">
              <div class="stats-number">{{ totalIdleWorkers }}</div>
              <div class="stats-label">总空闲工人</div>
            </el-card>
          </el-col>
          <el-col :span="8">
            <el-card shadow="hover" class="stats-card">
              <div class="stats-number">{{ unassignedWorkers.length }}</div>
              <div class="stats-label">未归属劳务公司</div>
            </el-card>
          </el-col>
          <el-col :span="8">
            <el-card shadow="hover" class="stats-card">
              <div class="stats-number">{{ unemployedWorkers.length }}</div>
              <div class="stats-label">未分配工厂</div>
            </el-card>
          </el-col>
        </el-row>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

// 激活的标签
const activeTab = ref('unassigned')

// 未归属劳务公司的工人
const unassignedWorkers = ref([
  {
    id: 1,
    name: '张三',
    phone: '13800138001',
    avatar: 'https://via.placeholder.com/150',
    registerDate: '2026-01-10',
    status: '活跃',
    paymentType: '日结'
  },
  {
    id: 2,
    name: '李四',
    phone: '13800138002',
    avatar: 'https://via.placeholder.com/150',
    registerDate: '2026-01-11',
    status: '活跃',
    paymentType: '月结'
  },
  {
    id: 3,
    name: '王五',
    phone: '13800138003',
    avatar: 'https://via.placeholder.com/150',
    registerDate: '2026-01-12',
    status: '未活跃',
    paymentType: '日结'
  }
])

// 未分配工厂的工人
const unemployedWorkers = ref([
  {
    id: 4,
    name: '赵六',
    phone: '13800138004',
    avatar: 'https://via.placeholder.com/150',
    laborCompany: '三鼎劳务有限公司',
    skillLevel: '初级',
    registerDate: '2026-01-01',
    paymentType: '月结'
  },
  {
    id: 5,
    name: '钱七',
    phone: '13800138005',
    avatar: 'https://via.placeholder.com/150',
    laborCompany: '三鼎劳务有限公司',
    skillLevel: '中级',
    registerDate: '2026-01-02',
    paymentType: '日结'
  },
  {
    id: 6,
    name: '孙八',
    phone: '13800138006',
    avatar: 'https://via.placeholder.com/150',
    laborCompany: '诚信劳务服务有限公司',
    skillLevel: '高级',
    registerDate: '2026-01-03',
    paymentType: '月结'
  },
  {
    id: 7,
    name: '周九',
    phone: '13800138007',
    avatar: 'https://via.placeholder.com/150',
    laborCompany: '诚信劳务服务有限公司',
    skillLevel: '初级',
    registerDate: '2026-01-04',
    paymentType: '日结'
  }
])

// 统计数据
const totalIdleWorkers = computed(() => unassignedWorkers.value.length + unemployedWorkers.value.length)

// 获取状态标签类型
const getStatusType = (status: string) => {
  switch (status) {
    case '活跃':
      return 'success'
    case '未活跃':
      return 'info'
    default:
      return ''
  }
}

// 获取技能等级标签类型
const getSkillType = (skillLevel: string) => {
  switch (skillLevel) {
    case '高级':
      return 'danger'
    case '中级':
      return 'warning'
    case '初级':
      return 'info'
    default:
      return ''
  }
}

// 查看工人详情
const viewWorker = (worker: any) => {
  console.log('查看工人详情:', worker)
}

// 分配劳务公司
const assignToLaborCompany = (worker: any) => {
  console.log('分配劳务公司:', worker)
}

// 分配工厂
const assignToFactory = (worker: any) => {
  console.log('分配工厂:', worker)
}
</script>

<style scoped>
.admin-idle-workers {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.mt-4 {
  margin-top: 20px;
}

.idle-workers-tabs {
  margin-top: 20px;
}

.worker-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.worker-details {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.worker-name {
  font-weight: 500;
}

.worker-phone {
  font-size: 12px;
  color: #606266;
}

.stats-container {
  padding: 20px 0;
}

.stats-card {
  text-align: center;
  padding: 20px 0;
}

.stats-number {
  font-size: 24px;
  font-weight: bold;
  color: #409EFF;
  margin-bottom: 8px;
}

.stats-label {
  font-size: 14px;
  color: #606266;
}
</style>