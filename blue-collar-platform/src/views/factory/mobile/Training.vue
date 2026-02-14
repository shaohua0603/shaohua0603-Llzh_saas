<template>
  <div class="factory-mobile-training">
    <div class="training-list">
      <el-card shadow="hover" v-for="training in trainingList" :key="training.id" class="training-card">
        <div class="training-header">
          <div class="training-title">{{ training.title }}</div>
          <el-tag :type="training.required ? 'danger' : 'info'">
            {{ training.required ? '必修' : '选修' }}
          </el-tag>
        </div>
        <div class="training-meta">
          <span class="training-type">{{ training.type }}</span>
          <span class="training-duration">{{ training.duration }}</span>
          <span class="training-view-count">{{ training.viewCount }}次查看</span>
        </div>
        <div class="training-content">
          {{ training.content.substring(0, 100) }}...
        </div>
        <div class="training-footer">
          <span class="training-date">{{ training.createDate }}</span>
          <el-button size="small" type="primary" @click="viewTraining(training)">查看详情</el-button>
        </div>
      </el-card>
    </div>
    
    <div class="empty-state" v-if="trainingList.length === 0">
      <el-empty description="暂无培训内容" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// 培训列表数据
const trainingList = ref([
  {
    id: 1,
    title: '厂规厂纪培训',
    type: '规章制度',
    content: '1. 遵守工厂作息时间\n2. 遵守安全生产规定\n3. 服从工作安排\n4. 保持车间整洁\n5. 尊重同事和领导\n6. 爱护工厂财产\n7. 保守工厂机密\n8. 积极参加培训学习',
    duration: '2小时',
    required: true,
    createDate: '2026-01-01',
    viewCount: 156
  },
  {
    id: 2,
    title: '工作内容培训',
    type: '技能培训',
    content: '1. 熟悉生产流程\n2. 掌握操作技能\n3. 了解质量标准\n4. 学会设备维护\n5. 掌握工艺流程\n6. 了解产品规格\n7. 学会质量检验\n8. 掌握安全操作',
    duration: '4小时',
    required: true,
    createDate: '2026-01-01',
    viewCount: 148
  },
  {
    id: 3,
    title: '安全教育培训',
    type: '安全培训',
    content: '1. 消防安全知识\n2. 用电安全知识\n3. 机械操作安全\n4. 紧急情况处理\n5. 个人防护用品使用\n6. 安全隐患识别\n7. 事故应急处理\n8. 安全法规学习',
    duration: '3小时',
    required: true,
    createDate: '2026-01-02',
    viewCount: 162
  },
  {
    id: 4,
    title: '企业文化培训',
    type: '文化培训',
    content: '1. 企业发展历程\n2. 企业价值观\n3. 企业使命\n4. 企业愿景\n5. 企业精神\n6. 企业经营理念\n7. 企业管理理念\n8. 企业行为准则',
    duration: '1小时',
    required: false,
    createDate: '2026-01-03',
    viewCount: 98
  },
  {
    id: 5,
    title: '质量意识培训',
    type: '质量培训',
    content: '1. 质量重要性\n2. 质量标准\n3. 质量控制方法\n4. 质量改进\n5. 质量管理体系\n6. 质量成本\n7. 质量责任\n8. 质量文化',
    duration: '2小时',
    required: false,
    createDate: '2026-01-04',
    viewCount: 87
  }
])

// 查看培训详情
const viewTraining = (training: any) => {
  console.log('查看培训详情:', training)
}
</script>

<style scoped>
.factory-mobile-training {
  padding: 16px;
  min-height: 100vh;
  background-color: #f5f7fa;
}

.training-list {
  margin-bottom: 16px;
}

.training-card {
  margin-bottom: 16px;
  border-radius: 8px;
}

.training-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.training-title {
  font-size: 16px;
  font-weight: 500;
  flex: 1;
  margin-right: 8px;
}

.training-meta {
  display: flex;
  gap: 12px;
  margin-bottom: 8px;
  font-size: 12px;
  color: #606266;
}

.training-content {
  font-size: 14px;
  color: #303133;
  line-height: 1.4;
  margin-bottom: 12px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
}

.training-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
  color: #909399;
}

.empty-state {
  margin-top: 40px;
  text-align: center;
}
</style>