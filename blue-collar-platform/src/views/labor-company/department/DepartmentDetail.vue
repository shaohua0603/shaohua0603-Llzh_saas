<template>
  <div class="department-detail-page">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-left">
        <el-button class="back-button" text @click="handleBack">
          <el-icon><ArrowLeft /></el-icon>
          返回
        </el-button>
        <span class="page-title">部门详情</span>
      </div>
      <div class="page-actions">
        <el-button type="primary" @click="handleEdit">
          <el-icon><Edit /></el-icon>
          编辑
        </el-button>
        <el-button type="danger" @click="handleDelete">
          <el-icon><Delete /></el-icon>
          删除
        </el-button>
      </div>
    </div>

    <!-- 详情内容 -->
    <div class="detail-content">
      <!-- 基本信息 -->
      <el-card class="info-card" shadow="never">
        <template #header>
          <div class="card-header">
            <span class="card-title">基本信息</span>
          </div>
        </template>
        <el-descriptions :column="2" border>
          <el-descriptions-item label="部门名称">
            {{ departmentDetail.name }}
          </el-descriptions-item>
          <el-descriptions-item label="部门级别">
            <el-tag>{{ departmentDetail.levelName }}</el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="级别别名">
            {{ departmentDetail.levelAlias || '-' }}
          </el-descriptions-item>
          <el-descriptions-item label="上级部门">
            {{ departmentDetail.parentName || '顶级部门' }}
          </el-descriptions-item>
          <el-descriptions-item label="部门负责人">
            {{ departmentDetail.leaderName || '-' }}
          </el-descriptions-item>
          <el-descriptions-item label="人员数量">
            <span class="count-text">{{ departmentDetail.workerCount || 0 }} 人</span>
          </el-descriptions-item>
          <el-descriptions-item label="联系电话" :span="2">
            {{ departmentDetail.contactPhone || '-' }}
          </el-descriptions-item>
          <el-descriptions-item label="联系邮箱" :span="2">
            {{ departmentDetail.contactEmail || '-' }}
          </el-descriptions-item>
          <el-descriptions-item label="联系地址" :span="2">
            {{ departmentDetail.contactAddress || '-' }}
          </el-descriptions-item>
          <el-descriptions-item label="部门介绍" :span="2">
            {{ departmentDetail.description || '-' }}
          </el-descriptions-item>
        </el-descriptions>
      </el-card>

      <!-- 子部门信息 -->
      <el-card v-if="departmentDetail.children && departmentDetail.children.length > 0" class="info-card" shadow="never">
        <template #header>
          <div class="card-header">
            <span class="card-title">子部门</span>
            <el-button type="primary" size="small" @click="handleAddChild">
              添加子部门
            </el-button>
          </div>
        </template>
        <el-table
          :data="departmentDetail.children"
          row-key="id"
          stripe
          border
        >
          <el-table-column prop="name" label="部门名称" min-width="150" show-overflow-tooltip />
          <el-table-column prop="levelName" label="级别" width="100" />
          <el-table-column prop="levelAlias" label="级别别名" width="120" />
          <el-table-column prop="leaderName" label="部门负责人" width="120" />
          <el-table-column prop="workerCount" label="人员数量" width="100" align="center" />
          <el-table-column label="操作" width="180" fixed="right" align="center">
            <template #default="scope">
              <el-button link type="primary" size="small" @click="handleViewChildDetail(scope.row)">
                详情
              </el-button>
              <el-button link type="primary" size="small" @click="handleEditChild(scope.row)">
                编辑
              </el-button>
              <el-button link type="danger" size="small" @click="handleDeleteChild(scope.row)">
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>

      <!-- 操作记录 -->
      <el-card class="info-card" shadow="never">
        <template #header>
          <span class="card-title">操作记录</span>
        </template>
        <el-timeline>
          <el-timeline-item
            v-for="(record, index) in operationRecords"
            :key="index"
            :timestamp="record.time"
            placement="top"
          >
            <div class="record-content">
              <div class="record-action">{{ record.action }}</div>
              <div class="record-operator">操作人：{{ record.operator }}</div>
              <div v-if="record.remark" class="record-remark">备注：{{ record.remark }}</div>
            </div>
          </el-timeline-item>
        </el-timeline>
      </el-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { ArrowLeft, Edit, Delete } from '@element-plus/icons-vue'

// 路由
const router = useRouter()
const route = useRoute()

// 加载状态
const loading = ref(false)

// 部门详情
const departmentDetail = reactive<any>({
  id: '',
  parentId: null,
  parentName: '',
  name: '',
  level: 1,
  levelName: '一级',
  levelAlias: '',
  description: '',
  leaderId: '',
  leaderName: '',
  contactPhone: '',
  contactEmail: '',
  contactAddress: '',
  workerCount: 0,
  children: []
})

// 操作记录
const operationRecords = ref<any[]>([])

// 模拟部门数据
const mockDepartmentData: any[] = [
  {
    id: '1',
    parentId: null,
    name: '深圳三鼎劳务公司',
    level: 1,
    levelName: '一级',
    levelAlias: '总部',
    description: '深圳三鼎劳务公司总部',
    leaderId: 'e1',
    leaderName: '张三',
    contactPhone: '13800138000',
    contactEmail: 'sz@sanding.com',
    contactAddress: '深圳市南山区科技园',
    workerCount: 50,
    children: [
      {
        id: '2',
        parentId: '1',
        name: '人事部',
        level: 2,
        levelName: '二级',
        levelAlias: '人事',
        description: '人事管理部门',
        leaderId: 'e2',
        leaderName: '李四',
        contactPhone: '13800138001',
        contactEmail: 'hr@sanding.com',
        contactAddress: '深圳市南山区科技园A座',
        workerCount: 10,
        children: [
          {
            id: '5',
            parentId: '2',
            name: '招聘组',
            level: 3,
            levelName: '三级',
            levelAlias: '招聘',
            description: '负责招聘工作',
            leaderId: 'e5',
            leaderName: '王五',
            contactPhone: '13800138005',
            contactEmail: 'recruit@sanding.com',
            contactAddress: '深圳市南山区科技园A座301',
            workerCount: 5,
            children: []
          },
          {
            id: '6',
            parentId: '2',
            name: '培训组',
            level: 3,
            levelName: '三级',
            levelAlias: '培训',
            description: '负责培训工作',
            leaderId: 'e6',
            leaderName: '赵六',
            contactPhone: '13800138006',
            contactEmail: 'train@sanding.com',
            contactAddress: '深圳市南山区科技园A座302',
            workerCount: 3,
            children: []
          }
        ]
      },
      {
        id: '3',
        parentId: '1',
        name: '财务部',
        level: 2,
        levelName: '二级',
        levelAlias: '财务',
        description: '财务管理部门',
        leaderId: 'e3',
        leaderName: '钱七',
        contactPhone: '13800138002',
        contactEmail: 'finance@sanding.com',
        contactAddress: '深圳市南山区科技园B座',
        workerCount: 8,
        children: []
      },
      {
        id: '4',
        parentId: '1',
        name: '运营部',
        level: 2,
        levelName: '二级',
        levelAlias: '运营',
        description: '运营管理部门',
        leaderId: 'e4',
        leaderName: '孙八',
        contactPhone: '13800138003',
        contactEmail: 'operation@sanding.com',
        contactAddress: '深圳市南山区科技园C座',
        workerCount: 15,
        children: []
      }
    ]
  }
]

// 查找部门
const findDepartment = (id: string, data: any[]): any | null => {
  for (const item of data) {
    if (item.id === id) {
      return item
    }
    if (item.children && item.children.length > 0) {
      const found = findDepartment(id, item.children)
      if (found) return found
    }
  }
  return null
}

// 查找父部门名称
const findParentName = (parentId: string | null, data: any[]): string => {
  if (!parentId) return ''
  const parent = findDepartment(parentId, data)
  return parent ? parent.name : ''
}

// 加载部门详情
const loadDepartmentDetail = async (id: string) => {
  loading.value = true
  try {
    const department = findDepartment(id, mockDepartmentData)
    if (department) {
      Object.assign(departmentDetail, department)
      departmentDetail.parentName = findParentName(department.parentId, mockDepartmentData)

      // 模拟操作记录
      operationRecords.value = [
        {
          action: '创建部门',
          operator: '管理员',
          time: '2024-01-15 10:00:00',
          remark: '创建新部门'
        },
        {
          action: '更新部门信息',
          operator: '管理员',
          time: '2024-01-16 14:30:00',
          remark: '更新部门负责人'
        }
      ]
    } else {
      ElMessage.error('部门不存在')
      router.push({ name: 'LaborCompanyDepartments' })
    }
  } catch (error) {
    ElMessage.error('加载部门详情失败')
  } finally {
    loading.value = false
  }
}

// 处理编辑
const handleEdit = () => {
  router.push({ name: 'LaborCompanyDepartmentEdit', params: { id: departmentDetail.id } })
}

// 处理删除
const handleDelete = () => {
  ElMessageBox.confirm(
    `确定要删除部门"${departmentDetail.name}"吗？${departmentDetail.children?.length ? '该部门包含子部门，将一并删除。' : ''}删除后无法恢复。`,
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(async () => {
    try {
      // TODO: 调用实际API
      ElMessage.success('删除成功')
      router.push({ name: 'LaborCompanyDepartments' })
    } catch (error) {
      ElMessage.error('删除失败')
    }
  }).catch(() => {})
}

// 处理添加子部门
const handleAddChild = () => {
  router.push({ name: 'LaborCompanyDepartmentAdd', query: { parentId: departmentDetail.id } })
}

// 处理查看子部门详情
const handleViewChildDetail = (row: any) => {
  router.push({ name: 'LaborCompanyDepartmentDetail', params: { id: row.id } })
}

// 处理编辑子部门
const handleEditChild = (row: any) => {
  router.push({ name: 'LaborCompanyDepartmentEdit', params: { id: row.id } })
}

// 处理删除子部门
const handleDeleteChild = (row: any) => {
  ElMessageBox.confirm(
    `确定要删除部门"${row.name}"吗？${row.children?.length ? '该部门包含子部门，将一并删除。' : ''}删除后无法恢复。`,
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(async () => {
    try {
      // TODO: 调用实际API
      ElMessage.success('删除成功')
      // 刷新详情
      loadDepartmentDetail(departmentDetail.id)
    } catch (error) {
      ElMessage.error('删除失败')
    }
  }).catch(() => {})
}

// 处理返回
const handleBack = () => {
  router.push({ name: 'LaborCompanyDepartments' })
}

// 生命周期
onMounted(() => {
  const id = route.params.id as string
  if (id) {
    loadDepartmentDetail(id)
  } else {
    ElMessage.error('部门ID不存在')
    router.push({ name: 'LaborCompanyDepartments' })
  }
})
</script>

<style scoped>
.department-detail-page {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* 页面头部 */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding: 16px 20px;
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  flex-shrink: 0;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.back-button {
  font-size: 14px;
  color: #606266;
}

.back-button:hover {
  color: #409eff;
}

.page-title {
  font-size: 18px;
  font-weight: 600;
  color: #303133;
}

.page-actions {
  display: flex;
  gap: 12px;
}

/* 详情内容 */
.detail-content {
  flex: 1;
  overflow-y: auto;
  padding-right: 4px;
}

/* 信息卡片 */
.info-card {
  margin-bottom: 20px;
}

.info-card:last-child {
  margin-bottom: 0;
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

/* 数量文本 */
.count-text {
  font-size: 16px;
  font-weight: 600;
  color: #409eff;
}

/* 操作记录 */
.record-content {
  padding: 8px 0;
}

.record-action {
  font-size: 14px;
  font-weight: 500;
  color: #303133;
  margin-bottom: 4px;
}

.record-operator {
  font-size: 12px;
  color: #909399;
  margin-bottom: 4px;
}

.record-remark {
  font-size: 12px;
  color: #606266;
}

/* 响应式设计 */
@media screen and (max-width: 768px) {
  .page-header {
    flex-direction: column;
    gap: 12px;
    align-items: flex-start;
  }

  .header-left {
    width: 100%;
  }

  .page-actions {
    width: 100%;
    flex-wrap: wrap;
  }

  .page-actions .el-button {
    flex: 1;
    min-width: 80px;
  }

  :deep(.el-descriptions) {
    --el-descriptions-table-border: 1px solid #ebeef5;
  }

  :deep(.el-descriptions__cell) {
    padding: 8px;
  }
}
</style>
