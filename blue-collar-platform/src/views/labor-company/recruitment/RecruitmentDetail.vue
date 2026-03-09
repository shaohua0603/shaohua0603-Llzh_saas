<template>
  <div class="recruitment-detail-container">
    <div class="detail-content">
      <!-- 基本信息卡片 -->
      <el-card class="info-card" shadow="never">
        <template #header>
          <div class="card-header">
            <el-icon><InfoFilled /></el-icon>
            <span>基本信息</span>
          </div>
        </template>
        <el-descriptions :column="2" border>
          <el-descriptions-item label="需求编号">{{ recruitmentDetail.id }}</el-descriptions-item>
          <el-descriptions-item label="需求标题">{{ recruitmentDetail.title }}</el-descriptions-item>
          <el-descriptions-item label="招聘人数">{{ recruitmentDetail.recruitCount }}人</el-descriptions-item>
          <el-descriptions-item label="需求状态">
            <el-tag :type="getStatusType(recruitmentDetail.status)">
              {{ getStatusText(recruitmentDetail.status) }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="发布时间">{{ recruitmentDetail.publishTime }}</el-descriptions-item>
          <el-descriptions-item label="截止时间">{{ recruitmentDetail.deadline }}</el-descriptions-item>
          <el-descriptions-item label="负责人">{{ recruitmentDetail.manager }}</el-descriptions-item>
          <el-descriptions-item label="联系电话">{{ recruitmentDetail.phone }}</el-descriptions-item>
        </el-descriptions>
      </el-card>

      <!-- 岗位要求卡片 -->
      <el-card class="info-card" shadow="never">
        <template #header>
          <div class="card-header">
            <el-icon><Document /></el-icon>
            <span>岗位要求</span>
          </div>
        </template>
        <el-descriptions :column="2" border>
          <el-descriptions-item label="岗位类别">{{ recruitmentDetail.positionCategory }}</el-descriptions-item>
          <el-descriptions-item label="学历要求">{{ recruitmentDetail.education }}</el-descriptions-item>
          <el-descriptions-item label="工作经验">{{ recruitmentDetail.experience }}</el-descriptions-item>
          <el-descriptions-item label="年龄要求">{{ recruitmentDetail.ageRequirement }}</el-descriptions-item>
          <el-descriptions-item label="性别要求">{{ recruitmentDetail.genderRequirement }}</el-descriptions-item>
          <el-descriptions-item label="工作地点">{{ recruitmentDetail.workLocation }}</el-descriptions-item>
        </el-descriptions>
        <div class="description-section">
          <div class="section-title">岗位描述</div>
          <div class="section-content">{{ recruitmentDetail.positionDescription }}</div>
        </div>
      </el-card>

      <!-- 薪资待遇卡片 -->
      <el-card class="info-card" shadow="never">
        <template #header>
          <div class="card-header">
            <el-icon><Coin /></el-icon>
            <span>薪资待遇</span>
          </div>
        </template>
        <el-descriptions :column="2" border>
          <el-descriptions-item label="薪资范围">{{ recruitmentDetail.salaryRange }}</el-descriptions-item>
          <el-descriptions-item label="薪资结构">{{ recruitmentDetail.salaryStructure }}</el-descriptions-item>
          <el-descriptions-item label="试用期">{{ recruitmentDetail.probationPeriod }}</el-descriptions-item>
          <el-descriptions-item label="试用期薪资">{{ recruitmentDetail.probationSalary }}</el-descriptions-item>
        </el-descriptions>
        <div class="description-section">
          <div class="section-title">福利待遇</div>
          <div class="section-content">{{ recruitmentDetail.benefits }}</div>
        </div>
      </el-card>

      <!-- 投递简历卡片 -->
      <el-card class="info-card" shadow="never">
        <template #header>
          <div class="card-header">
            <el-icon><Document /></el-icon>
            <span>投递简历</span>
            <el-badge :value="resumeList.length" class="resume-badge" />
          </div>
        </template>
        <CommonTable
          :data="resumeList"
          :columns="resumeColumns"
          table-id="recruitment-resume-list"
          :total="resumeTotal"
          :current-page="resumePage"
          :page-size="resumePageSize"
          :loading="resumeLoading"
          @update:current-page="handleResumePageChange"
          @update:page-size="handleResumePageSizeChange"
          @row-click="handleResumeDetail"
        >
          <template #column-status="{ row }">
            <el-tag :type="getResumeStatusType(row.status)">
              {{ getResumeStatusText(row.status) }}
            </el-tag>
          </template>
          <template #actions="{ row }">
            <el-button type="primary" link size="small" @click.stop="handleResumeDetail(row)">
              查看
            </el-button>
          </template>
        </CommonTable>
      </el-card>

      <!-- 操作记录卡片 -->
      <el-card class="info-card" shadow="never">
        <template #header>
          <div class="card-header">
            <el-icon><Clock /></el-icon>
            <span>操作记录</span>
          </div>
        </template>
        <el-timeline>
          <el-timeline-item
            v-for="(record, index) in operationRecords"
            :key="index"
            :timestamp="record.time"
            placement="top"
          >
            <div class="record-content">
              <div class="record-operator">{{ record.operator }}</div>
              <div class="record-action">{{ record.action }}</div>
              <div class="record-remark" v-if="record.remark">{{ record.remark }}</div>
            </div>
          </el-timeline-item>
        </el-timeline>
      </el-card>
    </div>

    <div class="detail-footer">
      <el-button @click="handleBack">
        <el-icon><ArrowLeft /></el-icon>
        返回
      </el-button>
      <el-button type="primary" @click="handleEdit">
        <el-icon><Edit /></el-icon>
        编辑
      </el-button>
      <el-button @click="handleShare">
        <el-icon><Share /></el-icon>
        分享
      </el-button>
      <el-button type="danger" @click="handleDelete">
        <el-icon><Delete /></el-icon>
        删除
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Edit, Delete, InfoFilled, Document, Coin, Clock, ArrowLeft, Share, ChatDotRound, ChatLineRound, Link } from '@element-plus/icons-vue'
import CommonTable from '@/components/CommonTable.vue'
import type { ColumnConfig } from '../../types/common-table'

// 路由实例
const router = useRouter()
const route = useRoute()

// 招聘需求详情数据
const recruitmentDetail = ref({
  id: 'REQ20240225001',
  title: '普工招聘',
  recruitCount: 50,
  status: 'published',
  publishTime: '2024-02-20 10:00:00',
  deadline: '2024-03-31 18:00:00',
  manager: '张三',
  phone: '13800138000',
  positionCategory: '普工',
  education: '初中及以上',
  experience: '不限',
  ageRequirement: '18-45岁',
  genderRequirement: '不限',
  workLocation: '广东省深圳市宝安区',
  positionDescription: '负责生产线操作，按照工艺要求完成生产任务，保证产品质量。',
  salaryRange: '5000-7000元/月',
  salaryStructure: '底薪+加班费+全勤奖+绩效奖金',
  probationPeriod: '1个月',
  probationSalary: '4500-6000元/月',
  benefits: '包吃住、五险一金、节日福利、带薪年假、定期体检'
})

// 简历列表数据
const resumeList = ref([
  {
    id: 'RES001',
    name: '李四',
    phone: '13900139000',
    position: '普工',
    education: '高中',
    experience: '2年',
    status: 'pending',
    submitTime: '2024-02-25 09:30:00'
  },
  {
    id: 'RES002',
    name: '王五',
    phone: '13700137000',
    position: '普工',
    education: '初中',
    experience: '3年',
    status: 'reviewed',
    submitTime: '2024-02-24 14:20:00'
  }
])

const resumeTotal = ref(2)
const resumePage = ref(1)
const resumePageSize = ref(10)
const resumeLoading = ref(false)

// 简历列表列配置
const resumeColumns: ColumnConfig[] = [
  { prop: 'id', label: '简历编号', width: 120, sortable: true },
  { prop: 'name', label: '姓名', width: 100, sortable: true },
  { prop: 'phone', label: '手机号', width: 120, sortable: true },
  { prop: 'position', label: '应聘岗位', width: 100, sortable: true },
  { prop: 'education', label: '学历', width: 100, sortable: true },
  { prop: 'experience', label: '工作经验', width: 100, sortable: true },
  { prop: 'status', label: '状态', width: 100, sortable: true },
  { prop: 'submitTime', label: '提交时间', width: 180, sortable: true }
]

// 操作记录
const operationRecords = ref([
  {
    time: '2024-02-20 10:00:00',
    operator: '张三',
    action: '发布招聘需求',
    remark: '发布普工招聘需求，招聘人数50人'
  },
  {
    time: '2024-02-19 15:30:00',
    operator: '张三',
    action: '创建招聘需求',
    remark: '创建普工招聘需求'
  }
])

// 返回
const handleBack = () => {
  router.back()
}

// 编辑
const handleEdit = () => {
  router.push(`/tenant/recruitment/edit/${recruitmentDetail.value.id}`)
}

// 删除
const handleDelete = () => {
  ElMessageBox.confirm('确定要删除该招聘需求吗？删除后不可恢复。', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    ElMessage.success('删除成功')
    router.back()
  }).catch(() => {})
}

// 查看简历详情
const handleResumeDetail = (row: any) => {
  router.push(`/tenant/recruitment/resume/${row.id}`)
}

// 简历分页变化
const handleResumePageChange = (page: number) => {
  resumePage.value = page
  loadResumeList()
}

const handleResumePageSizeChange = (size: number) => {
  resumePageSize.value = size
  loadResumeList()
}

// 加载简历列表
const loadResumeList = () => {
  resumeLoading.value = true
  // 模拟API调用
  setTimeout(() => {
    resumeLoading.value = false
  }, 500)
}

// 获取状态类型
const getStatusType = (status: string) => {
  const typeMap: Record<string, any> = {
    draft: 'info',
    published: 'success',
    closed: 'danger'
  }
  return typeMap[status] || 'info'
}

// 获取状态文本
const getStatusText = (status: string) => {
  const textMap: Record<string, string> = {
    draft: '草稿',
    published: '已发布',
    closed: '已关闭'
  }
  return textMap[status] || status
}

// 获取简历状态类型
const getResumeStatusType = (status: string) => {
  const typeMap: Record<string, any> = {
    pending: 'info',
    reviewed: 'warning',
    interviewed: 'primary',
    hired: 'success',
    rejected: 'danger'
  }
  return typeMap[status] || 'info'
}

// 获取简历状态文本
const getResumeStatusText = (status: string) => {
  const textMap: Record<string, string> = {
    pending: '待处理',
    reviewed: '已查看',
    interviewed: '已面试',
    hired: '已录用',
    rejected: '已拒绝'
  }
  return textMap[status] || status
}

// 分享招聘需求
const handleShare = () => {
  // 实现分享功能
  const shareUrl = `http://localhost:5175/tenant/recruitment/detail/${recruitmentDetail.value.id}`
  
  ElMessageBox.alert(
    `<div style="padding: 20px;">
      <h3 style="margin-bottom: 16px;">分享到</h3>
      <div style="margin-bottom: 16px;">
        <p><strong>分享链接：</strong></p>
        <input type="text" value="${shareUrl}" readonly style="width: 100%; padding: 8px; border: 1px solid #dcdfe6; border-radius: 4px; font-size: 14px;" />
      </div>
      <div style="margin-bottom: 16px;">
        <p>选择分享平台</p>
        <div style="display: flex; gap: 16px; margin-top: 12px;">
          <button type="button" style="width: 80px; padding: 8px; border: 1px solid #dcdfe6; border-radius: 4px; background-color: #fff; cursor: pointer; font-size: 14px;">
            📱 微信
          </button>
          <button type="button" style="width: 80px; padding: 8px; border: 1px solid #dcdfe6; border-radius: 4px; background-color: #fff; cursor: pointer; font-size: 14px;">
            💬 QQ
          </button>
          <button type="button" style="width: 100px; padding: 8px; border: 1px solid #dcdfe6; border-radius: 4px; background-color: #fff; cursor: pointer; font-size: 14px;">
            🔗 复制链接
          </button>
        </div>
      </div>
    </div>`,
    '分享招聘需求',
    {
      dangerouslyUseHTMLString: true,
      confirmButtonText: '关闭',
      customClass: 'share-dialog',
      showCancelButton: false
    }
  )
}

// 生命周期
onMounted(() => {
  const id = route.params.id
  // 根据ID加载招聘需求详情
  console.log('加载招聘需求详情:', id)
  loadResumeList()
})
</script>

<style scoped>
.recruitment-detail-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #f5f7fa;
}

.detail-content {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  padding-bottom: 80px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding: 16px 20px;
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.header-actions {
  display: flex;
  gap: 12px;
}

.info-card {
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.card-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  font-weight: 600;
  color: #303133;
}

.resume-badge {
  margin-left: auto;
}

.description-section {
  margin-top: 16px;
  padding: 16px;
  background-color: #f5f7fa;
  border-radius: 4px;
}

.section-title {
  font-size: 14px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 8px;
}

.section-content {
  font-size: 14px;
  color: #606266;
  line-height: 1.8;
  white-space: pre-wrap;
}

.record-content {
  padding: 8px 0;
}

.record-operator {
  font-size: 14px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 4px;
}

.record-action {
  font-size: 14px;
  color: #606266;
  margin-bottom: 4px;
}

.record-remark {
  font-size: 13px;
  color: #909399;
  margin-top: 4px;
}

/* 响应式设计 */
@media screen and (max-width: 768px) {
  .recruitment-detail-container {
    padding: 12px;
  }

  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .header-actions {
    width: 100%;
    justify-content: flex-end;
  }

  :deep(.el-descriptions) {
    font-size: 13px;
  }
}

.detail-footer {
  position: fixed;
  bottom: 0;
  left: var(--sidebar-width);
  right: 0;
  display: flex;
  justify-content: center;
  gap: 12px;
  padding: 16px;
  background-color: #f5f7fa;
  border-top: 1px solid #e4e7ed;
  z-index: 100;
  transition: left var(--transition-base);
}
</style>
