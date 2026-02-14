<template>
  <div class="factory-recruitment">
    <el-card shadow="hover">
      <template #header>
        <div class="card-header">
          <span>招聘需求管理</span>
          <el-button type="primary" size="small">发布招聘需求</el-button>
        </div>
      </template>
      
      <el-table :data="recruitmentList" style="width: 100%">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="position" label="岗位" width="150" />
        <el-table-column prop="salary" label="薪资" width="150" />
        <el-table-column prop="requirements" label="要求" show-overflow-tooltip />
        <el-table-column prop="recruitmentType" label="招聘方式" width="120" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="scope">
            <el-tag :type="getStatusType(scope.row.status)">{{ scope.row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="publishDate" label="发布日期" width="120" />
        <el-table-column label="操作" width="150">
          <template #default="scope">
            <el-button size="small" @click="viewDetails(scope.row)">查看</el-button>
            <el-button size="small" type="primary" @click="editRecruitment(scope.row)">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    
    <el-card shadow="hover" class="mt-4">
      <template #header>
        <div class="card-header">
          <span>面试管理</span>
        </div>
      </template>
      
      <el-table :data="interviewList" style="width: 100%">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="laborCompany" label="劳务公司" width="180" />
        <el-table-column prop="interviewDate" label="面试日期" width="120" />
        <el-table-column prop="interviewTime" label="面试时间" width="120" />
        <el-table-column prop="interviewLocation" label="面试地点" show-overflow-tooltip />
        <el-table-column prop="contactPerson" label="联系人" width="120" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="scope">
            <el-tag :type="getStatusType(scope.row.status)">{{ scope.row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150">
          <template #default="scope">
            <el-button size="small" @click="viewInterview(scope.row)">查看详情</el-button>
            <el-button size="small" type="primary" @click="confirmInterview(scope.row)">确认</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// 招聘需求列表
const recruitmentList = ref([
  {
    id: 1,
    position: '操作工',
    salary: '5000-6000元/月',
    requirements: '18-45岁，身体健康，吃苦耐劳',
    recruitmentType: '劳务公司招聘',
    status: '已发布',
    publishDate: '2026-01-15'
  },
  {
    id: 2,
    position: '质检员',
    salary: '6000-7000元/月',
    requirements: '20-40岁，高中以上学历，有质检经验优先',
    recruitmentType: '平台招聘',
    status: '已发布',
    publishDate: '2026-01-10'
  },
  {
    id: 3,
    position: '装配工',
    salary: '5500-6500元/月',
    requirements: '18-45岁，身体健康，服从安排',
    recruitmentType: '厂家直招',
    status: '草稿',
    publishDate: '2026-01-08'
  }
])

// 面试列表
const interviewList = ref([
  {
    id: 1,
    laborCompany: '三鼎劳务有限公司',
    interviewDate: '2026-01-25',
    interviewTime: '09:00-11:00',
    interviewLocation: '工厂A区会议室',
    contactPerson: '张经理',
    status: '待确认'
  },
  {
    id: 2,
    laborCompany: '诚信劳务服务有限公司',
    interviewDate: '2026-01-26',
    interviewTime: '14:00-16:00',
    interviewLocation: '工厂B区会议室',
    contactPerson: '李经理',
    status: '已确认'
  }
])

// 获取状态类型
const getStatusType = (status: string) => {
  switch (status) {
    case '已发布':
    case '已确认':
      return 'success'
    case '草稿':
      return 'info'
    case '待确认':
      return 'warning'
    default:
      return ''
  }
}

// 查看详情
const viewDetails = (row: any) => {
  console.log('查看招聘需求详情:', row)
}

// 编辑招聘需求
const editRecruitment = (row: any) => {
  console.log('编辑招聘需求:', row)
}

// 查看面试详情
const viewInterview = (row: any) => {
  console.log('查看面试详情:', row)
}

// 确认面试
const confirmInterview = (row: any) => {
  console.log('确认面试:', row)
}
</script>

<style scoped>
.factory-recruitment {
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
</style>