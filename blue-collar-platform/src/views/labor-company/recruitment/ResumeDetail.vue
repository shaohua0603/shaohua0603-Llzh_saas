<template>
  <div class="resume-detail-container">
    <div class="detail-content">
      <!-- 基本信息卡片 -->
      <el-card class="info-card" shadow="never">
        <template #header>
          <div class="card-header">
            <el-icon><User /></el-icon>
            <span>基本信息</span>
          </div>
        </template>
        <el-descriptions :column="2" border>
          <el-descriptions-item label="姓名">{{ resumeDetail.name }}</el-descriptions-item>
          <el-descriptions-item label="性别">{{ resumeDetail.gender }}</el-descriptions-item>
          <el-descriptions-item label="年龄">{{ resumeDetail.age }}岁</el-descriptions-item>
          <el-descriptions-item label="手机号">{{ resumeDetail.phone }}</el-descriptions-item>
          <el-descriptions-item label="身份证号">{{ resumeDetail.idCard }}</el-descriptions-item>
          <el-descriptions-item label="籍贯">{{ resumeDetail.nativePlace }}</el-descriptions-item>
          <el-descriptions-item label="现住址" :span="2">{{ resumeDetail.address }}</el-descriptions-item>
          <el-descriptions-item label="状态">
            <el-tag :type="getStatusType(resumeDetail.status)">
              {{ getStatusText(resumeDetail.status) }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="提交时间">{{ resumeDetail.submitTime }}</el-descriptions-item>
        </el-descriptions>
      </el-card>

      <!-- 教育背景卡片 -->
      <el-card class="info-card" shadow="never">
        <template #header>
          <div class="card-header">
            <el-icon><Reading /></el-icon>
            <span>教育背景</span>
          </div>
        </template>
        <el-descriptions :column="2" border>
          <el-descriptions-item label="最高学历">{{ resumeDetail.education }}</el-descriptions-item>
          <el-descriptions-item label="毕业院校">{{ resumeDetail.school }}</el-descriptions-item>
          <el-descriptions-item label="专业">{{ resumeDetail.major }}</el-descriptions-item>
          <el-descriptions-item label="毕业时间">{{ resumeDetail.graduationTime }}</el-descriptions-item>
        </el-descriptions>
      </el-card>

      <!-- 工作经历卡片 -->
      <el-card class="info-card" shadow="never">
        <template #header>
          <div class="card-header">
            <el-icon><Briefcase /></el-icon>
            <span>工作经历</span>
          </div>
        </template>
        <el-timeline>
          <el-timeline-item
            v-for="(experience, index) in resumeDetail.workExperiences"
            :key="index"
            :timestamp="`${experience.startTime} - ${experience.endTime}`"
            placement="top"
          >
            <div class="experience-content">
              <div class="experience-company">{{ experience.company }}</div>
              <div class="experience-position">{{ experience.position }}</div>
              <div class="experience-description">{{ experience.description }}</div>
            </div>
          </el-timeline-item>
        </el-timeline>
      </el-card>

      <!-- 应聘信息卡片 -->
      <el-card class="info-card" shadow="never">
        <template #header>
          <div class="card-header">
            <el-icon><Document /></el-icon>
            <span>应聘信息</span>
          </div>
        </template>
        <el-descriptions :column="2" border>
          <el-descriptions-item label="应聘岗位">{{ resumeDetail.position }}</el-descriptions-item>
          <el-descriptions-item label="期望薪资">{{ resumeDetail.expectedSalary }}</el-descriptions-item>
          <el-descriptions-item label="工作经验">{{ resumeDetail.experience }}</el-descriptions-item>
          <el-descriptions-item label="期望工作地点">{{ resumeDetail.expectedLocation }}</el-descriptions-item>
          <el-descriptions-item label="到岗时间">{{ resumeDetail.availableTime }}</el-descriptions-item>
        </el-descriptions>
        <div class="description-section">
          <div class="section-title">自我评价</div>
          <div class="section-content">{{ resumeDetail.selfEvaluation }}</div>
        </div>
      </el-card>

      <!-- 附件信息卡片 -->
      <el-card class="info-card" shadow="never">
        <template #header>
          <div class="card-header">
            <el-icon><Folder /></el-icon>
            <span>附件信息</span>
          </div>
        </template>
        <el-table :data="resumeDetail.attachments" border>
          <el-table-column prop="name" label="文件名" />
          <el-table-column prop="size" label="文件大小" width="120" />
          <el-table-column prop="uploadTime" label="上传时间" width="180" />
          <el-table-column label="操作" width="150" align="center">
            <template #default="{ row }">
              <el-button type="primary" link size="small" @click="handlePreview(row)">
                预览
              </el-button>
              <el-button type="success" link size="small" @click="handleDownload(row)">
                下载
              </el-button>
            </template>
          </el-table-column>
        </el-table>
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

    <!-- 标记对话框 -->
    <el-dialog v-model="markVisible" title="标记简历" width="500px" :close-on-click-modal="false">
      <el-form :model="markForm" label-width="100px">
        <el-form-item label="标记状态">
          <el-select v-model="markForm.status" placeholder="请选择状态">
            <el-option label="待处理" value="pending" />
            <el-option label="已查看" value="reviewed" />
            <el-option label="已面试" value="interviewed" />
            <el-option label="已录用" value="hired" />
            <el-option label="已拒绝" value="rejected" />
          </el-select>
        </el-form-item>
        <el-form-item label="备注">
          <el-input
            v-model="markForm.remark"
            type="textarea"
            :rows="4"
            placeholder="请输入备注信息"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="markVisible = false">取消</el-button>
        <el-button type="primary" @click="handleConfirmMark">确定</el-button>
      </template>
    </el-dialog>

    <div class="detail-footer">
      <el-button @click="handleBack">
        <el-icon><ArrowLeft /></el-icon>
        返回
      </el-button>
      <el-button type="success" @click="handleContact">
        <el-icon><Phone /></el-icon>
        联系
      </el-button>
      <el-button type="warning" @click="handleMark">
        <el-icon><Star /></el-icon>
        标记
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
import { Phone, Star, Delete, User, Reading, Briefcase, Document, Folder, Clock, ArrowLeft } from '@element-plus/icons-vue'

// 路由实例
const router = useRouter()
const route = useRoute()

// 简历详情数据
const resumeDetail = ref({
  id: 'RES001',
  name: '李四',
  gender: '男',
  age: 28,
  phone: '13900139000',
  idCard: '440***********1234',
  nativePlace: '广东省深圳市',
  address: '深圳市宝安区西乡街道',
  status: 'pending',
  submitTime: '2024-02-25 09:30:00',
  education: '高中',
  school: '深圳市第一中学',
  major: '机械制造',
  graduationTime: '2014-06',
  position: '普工',
  expectedSalary: '5000-7000元/月',
  experience: '2年',
  expectedLocation: '深圳市',
  availableTime: '随时到岗',
  selfEvaluation: '工作认真负责，吃苦耐劳，有较强的团队协作精神，能够快速适应工作环境。',
  workExperiences: [
    {
      company: '深圳市某某电子有限公司',
      position: '普工',
      startTime: '2022-01',
      endTime: '2024-01',
      description: '负责生产线操作，按照工艺要求完成生产任务，保证产品质量。'
    },
    {
      company: '东莞市某某制造厂',
      position: '操作工',
      startTime: '2020-06',
      endTime: '2021-12',
      description: '负责设备操作，按照操作规程进行生产，确保生产安全。'
    }
  ],
  attachments: [
    {
      id: 'ATT001',
      name: '个人简历.pdf',
      size: '2.5MB',
      uploadTime: '2024-02-25 09:30:00'
    },
    {
      id: 'ATT002',
      name: '身份证复印件.jpg',
      size: '1.2MB',
      uploadTime: '2024-02-25 09:30:00'
    }
  ]
})

// 操作记录
const operationRecords = ref([
  {
    time: '2024-02-25 09:30:00',
    operator: '系统',
    action: '提交简历',
    remark: '李四提交了普工岗位的简历'
  }
])

// 标记相关
const markVisible = ref(false)
const markForm = ref({
  id: '',
  status: '',
  remark: ''
})

// 返回
const handleBack = () => {
  router.back()
}

// 联系
const handleContact = () => {
  ElMessageBox.confirm(
    `确定要联系 ${resumeDetail.value.name} 吗？\n手机号：${resumeDetail.value.phone}`,
    '联系确认',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'info'
    }
  ).then(() => {
    ElMessage.success('已记录联系信息')
  }).catch(() => {})
}

// 标记
const handleMark = () => {
  markForm.value = {
    id: resumeDetail.value.id,
    status: resumeDetail.value.status,
    remark: ''
  }
  markVisible.value = true
}

// 确认标记
const handleConfirmMark = () => {
  ElMessage.success('标记成功')
  markVisible.value = false
}

// 删除
const handleDelete = () => {
  ElMessageBox.confirm(
    `确定要删除 ${resumeDetail.value.name} 的简历吗？删除后不可恢复。`,
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    ElMessage.success('删除成功')
    router.back()
  }).catch(() => {})
}

// 预览
const handlePreview = (row: any) => {
  ElMessage.info(`预览文件：${row.name}`)
}

// 下载
const handleDownload = (row: any) => {
  ElMessage.success(`下载文件：${row.name}`)
}

// 获取状态类型
const getStatusType = (status: string) => {
  const typeMap: Record<string, any> = {
    pending: 'info',
    reviewed: 'warning',
    interviewed: 'primary',
    hired: 'success',
    rejected: 'danger'
  }
  return typeMap[status] || 'info'
}

// 获取状态文本
const getStatusText = (status: string) => {
  const textMap: Record<string, string> = {
    pending: '待处理',
    reviewed: '已查看',
    interviewed: '已面试',
    hired: '已录用',
    rejected: '已拒绝'
  }
  return textMap[status] || status
}

// 生命周期
onMounted(() => {
  const id = route.params.id
  // 根据ID加载简历详情
  console.log('加载简历详情:', id)
})
</script>

<style scoped>
.resume-detail-container {
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

.experience-content {
  padding: 8px 0;
}

.experience-company {
  font-size: 15px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 4px;
}

.experience-position {
  font-size: 14px;
  color: #606266;
  margin-bottom: 4px;
}

.experience-description {
  font-size: 13px;
  color: #909399;
  line-height: 1.6;
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
  .resume-detail-container {
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
