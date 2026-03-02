<template>
  <div class="employee-detail-page">
    <el-card class="detail-card">
      <template #header>
        <div class="card-header">
          <span>员工详情</span>
          <div class="header-actions">
            <el-button @click="handleBack">返回</el-button>
            <el-button type="primary" @click="handleEdit">编辑</el-button>
          </div>
        </div>
      </template>

      <!-- 基本信息 -->
      <el-descriptions title="基本信息" :column="2" border>
        <el-descriptions-item label="姓名">
          {{ detailData.name }}
        </el-descriptions-item>
        <el-descriptions-item label="手机号">
          {{ detailData.phone }}
        </el-descriptions-item>
        <el-descriptions-item label="邮箱">
          {{ detailData.email || '-' }}
        </el-descriptions-item>
        <el-descriptions-item label="联系地址">
          {{ detailData.address || '-' }}
        </el-descriptions-item>
        <el-descriptions-item label="部门">
          {{ detailData.departmentName }}
        </el-descriptions-item>
        <el-descriptions-item label="岗位">
          {{ detailData.positionName }}
        </el-descriptions-item>
        <el-descriptions-item label="部门负责人">
          <el-tag :type="detailData.isDepartmentLeader ? 'success' : 'info'">
            {{ detailData.isDepartmentLeader ? '是' : '否' }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="直属领导">
          {{ detailData.leaderName || '-' }}
        </el-descriptions-item>
        <el-descriptions-item label="入职时间">
          {{ detailData.hireDate || '-' }}
        </el-descriptions-item>
        <el-descriptions-item label="离职时间">
          {{ detailData.leaveDate || '-' }}
        </el-descriptions-item>
        <el-descriptions-item label="状态">
          <el-tag :type="detailData.status === '在职' ? 'success' : 'danger'">
            {{ detailData.status }}
          </el-tag>
        </el-descriptions-item>
      </el-descriptions>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'

// 路由
const router = useRouter()
const route = useRoute()

// 详情数据
const detailData = ref<any>({
  id: '',
  name: '',
  phone: '',
  email: '',
  address: '',
  departmentId: '',
  departmentName: '',
  positionId: '',
  positionName: '',
  isDepartmentLeader: false,
  leaderId: '',
  leaderName: '',
  hireDate: '',
  leaveDate: '',
  status: '在职'
})

// 加载详情数据
const loadDetail = () => {
  // 模拟详情数据
  const mockData: Record<string, any> = {
    'e1': { id: 'e1', name: '张三', phone: '13800138000', email: 'zhangsan@example.com', address: '深圳市南山区', departmentId: '2', departmentName: '人事部', positionId: 'p1', positionName: '人事经理', isDepartmentLeader: true, leaderId: '', leaderName: '-', hireDate: '2020-01-15', leaveDate: '', status: '在职' },
    'e2': { id: 'e2', name: '李四', phone: '13800138001', email: 'lisi@example.com', address: '深圳市福田区', departmentId: '2', departmentName: '人事部', positionId: 'p2', positionName: '招聘专员', isDepartmentLeader: false, leaderId: 'e1', leaderName: '张三', hireDate: '2021-03-20', leaveDate: '', status: '在职' },
    'e3': { id: 'e3', name: '王五', phone: '13800138002', email: 'wangwu@example.com', address: '深圳市宝安区', departmentId: '3', departmentName: '财务部', positionId: 'p4', positionName: '财务经理', isDepartmentLeader: true, leaderId: '', leaderName: '-', hireDate: '2019-06-10', leaveDate: '', status: '在职' },
    'e4': { id: 'e4', name: '赵六', phone: '13800138003', email: 'zhaoliu@example.com', address: '深圳市龙岗区', departmentId: '3', departmentName: '财务部', positionId: 'p5', positionName: '会计', isDepartmentLeader: false, leaderId: 'e3', leaderName: '王五', hireDate: '2022-01-05', leaveDate: '', status: '在职' },
    'e5': { id: 'e5', name: '钱七', phone: '13800138004', email: 'qianqi@example.com', address: '深圳市罗湖区', departmentId: '4', departmentName: '运营部', positionId: 'p6', positionName: '运营经理', isDepartmentLeader: true, leaderId: '', leaderName: '-', hireDate: '2020-08-15', leaveDate: '', status: '在职' },
    'e6': { id: 'e6', name: '孙八', phone: '13800138005', email: 'sunba@example.com', address: '深圳市光明区', departmentId: '4', departmentName: '运营部', positionId: 'p7', positionName: '运营专员', isDepartmentLeader: false, leaderId: 'e5', leaderName: '钱七', hireDate: '2023-02-01', leaveDate: '', status: '在职' },
    'e7': { id: 'e7', name: '周九', phone: '13800138006', email: 'zhoujiu@example.com', address: '深圳市坪山区', departmentId: '2', departmentName: '人事部', positionId: 'p3', positionName: '培训专员', isDepartmentLeader: false, leaderId: 'e1', leaderName: '张三', hireDate: '2023-05-10', leaveDate: '', status: '在职' }
  }

  const id = route.params.id as string
  const data = mockData[id]

  if (data) {
    detailData.value = data
  } else {
    ElMessage.error('员工不存在')
    router.push({ name: 'LaborCompanyEmployees' })
  }
}

// 返回
const handleBack = () => {
  router.back()
}

// 编辑
const handleEdit = () => {
  router.push({
    name: 'LaborCompanyEmployeeEdit',
    params: { id: detailData.value.id }
  })
}

// 生命周期
onMounted(() => {
  loadDetail()
})
</script>

<style scoped>
.employee-detail-page {
  padding: 20px;
}

.detail-card {
  max-width: 1000px;
  margin: 0 auto;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 18px;
  font-weight: 600;
}

.header-actions {
  display: flex;
  gap: 12px;
}
</style>
