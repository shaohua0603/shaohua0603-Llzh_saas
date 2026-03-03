<template>
  <div class="admin-recruitment">
    <el-card shadow="hover">
      <template #header>
        <div class="card-header">
          <span>招聘需求管理</span>
        </div>
      </template>
      
      <el-table :data="recruitmentList" style="width: 100%">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="factoryName" label="工厂名称" min-width="150" />
        <el-table-column prop="position" label="岗位" width="120" />
        <el-table-column prop="salary" label="薪资" width="120" />
        <el-table-column prop="requirements" label="要求" min-width="200" show-overflow-tooltip />
        <el-table-column prop="recruitmentCount" label="招聘人数" width="100" />
        <el-table-column prop="publishDate" label="发布日期" width="120" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="scope">
            <el-tag :type="getStatusType(scope.row.status)">{{ scope.row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150">
          <template #default="scope">
            <el-button size="small" @click="viewRecruitment(scope.row)">查看</el-button>
            <el-button size="small" type="primary" @click="handleRecruitment(scope.row)">处理</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    
    <el-card shadow="hover" class="mt-4">
      <template #header>
        <div class="card-header">
          <span>招聘需求统计</span>
        </div>
      </template>
      
      <div class="stats-container">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-card shadow="hover" class="stats-card">
              <div class="stats-number">{{ totalRecruitments }}</div>
              <div class="stats-label">总需求数</div>
            </el-card>
          </el-col>
          <el-col :span="6">
            <el-card shadow="hover" class="stats-card">
              <div class="stats-number">{{ pendingRecruitments }}</div>
              <div class="stats-label">待处理</div>
            </el-card>
          </el-col>
          <el-col :span="6">
            <el-card shadow="hover" class="stats-card">
              <div class="stats-number">{{ processingRecruitments }}</div>
              <div class="stats-label">处理中</div>
            </el-card>
          </el-col>
          <el-col :span="6">
            <el-card shadow="hover" class="stats-card">
              <div class="stats-number">{{ completedRecruitments }}</div>
              <div class="stats-label">已完成</div>
            </el-card>
          </el-col>
        </el-row>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

// 招聘需求列表数据
const recruitmentList = ref([
  {
    id: 1,
    factoryName: '富士康科技集团',
    position: '操作工',
    salary: '5000-6000元/月',
    requirements: '18-45岁，身体健康，吃苦耐劳',
    recruitmentCount: 50,
    publishDate: '2026-01-15',
    status: '待处理'
  },
  {
    id: 2,
    factoryName: '华为技术有限公司',
    position: '质检员',
    salary: '6000-7000元/月',
    requirements: '20-40岁，高中以上学历，有质检经验优先',
    recruitmentCount: 20,
    publishDate: '2026-01-10',
    status: '处理中'
  },
  {
    id: 3,
    factoryName: '比亚迪股份有限公司',
    position: '装配工',
    salary: '5500-6500元/月',
    requirements: '18-45岁，身体健康，服从安排',
    recruitmentCount: 30,
    publishDate: '2026-01-08',
    status: '已完成'
  },
  {
    id: 4,
    factoryName: '特斯拉上海工厂',
    position: '生产操作员',
    salary: '6000-7500元/月',
    requirements: '18-40岁，初中以上学历，能适应倒班',
    recruitmentCount: 40,
    publishDate: '2026-01-05',
    status: '待处理'
  }
])

// 统计数据
const totalRecruitments = computed(() => recruitmentList.value.length)
const pendingRecruitments = computed(() => recruitmentList.value.filter(r => r.status === '待处理').length)
const processingRecruitments = computed(() => recruitmentList.value.filter(r => r.status === '处理中').length)
const completedRecruitments = computed(() => recruitmentList.value.filter(r => r.status === '已完成').length)

// 获取状态标签类型
const getStatusType = (status: string) => {
  switch (status) {
    case '待处理':
      return 'warning'
    case '处理中':
      return 'info'
    case '已完成':
      return 'success'
    default:
      return ''
  }
}

// 查看招聘需求详情
const viewRecruitment = (recruitment: any) => {
  console.log('查看招聘需求详情:', recruitment)
}

// 处理招聘需求
const handleRecruitment = (recruitment: any) => {
  console.log('处理招聘需求:', recruitment)
}
</script>

<style scoped>
.admin-recruitment {
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