<template>
  <div class="factory-training">
    <el-card shadow="hover">
      <template #header>
        <div class="card-header">
          <span>业务课堂管理</span>
          <el-button type="primary" size="small">添加培训内容</el-button>
        </div>
      </template>
      
      <el-table :data="trainingList" style="width: 100%">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="title" label="培训标题" min-width="200" />
        <el-table-column prop="type" label="培训类型" width="120" />
        <el-table-column prop="duration" label="培训时长" width="100" />
        <el-table-column prop="required" label="是否必修" width="100">
          <template #default="scope">
            <el-tag :type="scope.row.required ? 'danger' : 'info'">
              {{ scope.row.required ? '必修' : '选修' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createDate" label="创建日期" width="120" />
        <el-table-column prop="viewCount" label="查看次数" width="100" />
        <el-table-column label="操作" width="150">
          <template #default="scope">
            <el-button size="small" @click="viewTraining(scope.row)">查看</el-button>
            <el-button size="small" type="primary" @click="editTraining(scope.row)">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    
    <el-card shadow="hover" class="mt-4">
      <template #header>
        <div class="card-header">
          <span>培训效果统计</span>
        </div>
      </template>
      
      <div class="stats-container">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-card shadow="hover" class="stats-card">
              <div class="stats-number">{{ totalTrainings }}</div>
              <div class="stats-label">总培训课程</div>
            </el-card>
          </el-col>
          <el-col :span="6">
            <el-card shadow="hover" class="stats-card">
              <div class="stats-number">{{ requiredTrainings }}</div>
              <div class="stats-label">必修课程</div>
            </el-card>
          </el-col>
          <el-col :span="6">
            <el-card shadow="hover" class="stats-card">
              <div class="stats-number">{{ optionalTrainings }}</div>
              <div class="stats-label">选修课程</div>
            </el-card>
          </el-col>
          <el-col :span="6">
            <el-card shadow="hover" class="stats-card">
              <div class="stats-number">{{ totalViews }}</div>
              <div class="stats-label">总查看次数</div>
            </el-card>
          </el-col>
        </el-row>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

// 培训列表数据
const trainingList = ref([
  {
    id: 1,
    title: '厂规厂纪培训',
    type: '规章制度',
    content: '1. 遵守工厂作息时间\n2. 遵守安全生产规定\n3. 服从工作安排\n4. 保持车间整洁',
    duration: '2小时',
    required: true,
    createDate: '2026-01-01',
    viewCount: 156
  },
  {
    id: 2,
    title: '工作内容培训',
    type: '技能培训',
    content: '1. 熟悉生产流程\n2. 掌握操作技能\n3. 了解质量标准\n4. 学会设备维护',
    duration: '4小时',
    required: true,
    createDate: '2026-01-01',
    viewCount: 148
  },
  {
    id: 3,
    title: '安全教育培训',
    type: '安全培训',
    content: '1. 消防安全知识\n2. 用电安全知识\n3. 机械操作安全\n4. 紧急情况处理',
    duration: '3小时',
    required: true,
    createDate: '2026-01-02',
    viewCount: 162
  },
  {
    id: 4,
    title: '企业文化培训',
    type: '文化培训',
    content: '1. 企业发展历程\n2. 企业价值观\n3. 企业使命\n4. 企业愿景',
    duration: '1小时',
    required: false,
    createDate: '2026-01-03',
    viewCount: 98
  },
  {
    id: 5,
    title: '质量意识培训',
    type: '质量培训',
    content: '1. 质量重要性\n2. 质量标准\n3. 质量控制方法\n4. 质量改进',
    duration: '2小时',
    required: false,
    createDate: '2026-01-04',
    viewCount: 87
  }
])

// 统计数据
const totalTrainings = computed(() => trainingList.value.length)
const requiredTrainings = computed(() => trainingList.value.filter(t => t.required).length)
const optionalTrainings = computed(() => trainingList.value.filter(t => !t.required).length)
const totalViews = computed(() => trainingList.value.reduce((sum, t) => sum + t.viewCount, 0))

// 查看培训详情
const viewTraining = (row: any) => {
  console.log('查看培训详情:', row)
}

// 编辑培训
const editTraining = (row: any) => {
  console.log('编辑培训:', row)
}
</script>

<style scoped>
.factory-training {
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