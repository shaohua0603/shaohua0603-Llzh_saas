<template>
  <div class="resume-management-detail-container">
    <!-- 内容区域 -->
    <div class="detail-content">
      <el-card v-loading="loading" class="detail-card">
        <template #header>
          <div class="card-header">
            <span class="card-title">简历详情</span>
          </div>
        </template>

        <div v-if="resumeDetail" class="content-body">
          <!-- 基本信息 -->
          <div class="info-section">
            <div class="section-title">
              <el-icon><InfoFilled /></el-icon>
              基本信息
            </div>
            <el-descriptions :column="3" border>
              <el-descriptions-item label="姓名">
                {{ resumeDetail.name }}
              </el-descriptions-item>
              <el-descriptions-item label="性别">
                {{ getGenderText(resumeDetail.gender) }}
              </el-descriptions-item>
              <el-descriptions-item label="年龄">
                {{ resumeDetail.age }}岁
              </el-descriptions-item>
              <el-descriptions-item label="手机号">
                {{ resumeDetail.phone }}
              </el-descriptions-item>
              <el-descriptions-item label="身份证号">
                {{ resumeDetail.idCard }}
              </el-descriptions-item>
              <el-descriptions-item label="学历">
                {{ getEducationText(resumeDetail.education) }}
              </el-descriptions-item>
              <el-descriptions-item label="毕业院校">
                {{ resumeDetail.school }}
              </el-descriptions-item>
              <el-descriptions-item label="专业">
                {{ resumeDetail.major }}
              </el-descriptions-item>
              <el-descriptions-item label="工作经验">
                {{ getExperienceText(resumeDetail.experience) }}
              </el-descriptions-item>
              <el-descriptions-item label="工作年限">
                {{ resumeDetail.workYears }}年
              </el-descriptions-item>
              <el-descriptions-item label="现居城市">
                {{ resumeDetail.currentCity }}
              </el-descriptions-item>
              <el-descriptions-item label="期望城市">
                {{ resumeDetail.expectedCity }}
              </el-descriptions-item>
              <el-descriptions-item label="期望薪资">
                {{ resumeDetail.expectedSalary }}
              </el-descriptions-item>
              <el-descriptions-item label="状态">
                <el-tag :type="getStatusTagType(resumeDetail.status)">
                  {{ getStatusText(resumeDetail.status) }}
                </el-tag>
              </el-descriptions-item>
              <el-descriptions-item label="提交时间">
                {{ formatDate(resumeDetail.submitTime) }}
              </el-descriptions-item>
              <el-descriptions-item label="创建人">
                {{ resumeDetail.createdBy }}
              </el-descriptions-item>
              <el-descriptions-item label="创建时间">
                {{ formatDate(resumeDetail.createdAt) }}
              </el-descriptions-item>
            </el-descriptions>
          </div>

          <!-- 应聘信息 -->
          <div class="info-section">
            <div class="section-title">
              <el-icon><Briefcase /></el-icon>
              应聘信息
            </div>
            <el-descriptions :column="2" border>
              <el-descriptions-item label="应聘岗位">
                {{ resumeDetail.positionName }}
              </el-descriptions-item>
              <el-descriptions-item label="招聘需求">
                {{ resumeDetail.recruitmentTitle }}
              </el-descriptions-item>
              <el-descriptions-item label="工厂名称">
                {{ resumeDetail.factoryName }}
              </el-descriptions-item>
              <el-descriptions-item label="劳务公司">
                {{ resumeDetail.laborCompanyName }}
              </el-descriptions-item>
            </el-descriptions>
          </div>

          <!-- 自我介绍 -->
          <div class="info-section">
            <div class="section-title">
              <el-icon><User /></el-icon>
              自我介绍
            </div>
            <div class="rich-text-content">
              <div v-html="resumeDetail.selfIntroduction"></div>
            </div>
          </div>

          <!-- 工作经历 -->
          <div class="info-section">
            <div class="section-title">
              <el-icon><OfficeBuilding /></el-icon>
              工作经历
            </div>
            <div class="rich-text-content">
              <div v-html="resumeDetail.workExperience"></div>
            </div>
          </div>

          <!-- 技能特长 -->
          <div class="info-section">
            <div class="section-title">
              <el-icon><Star /></el-icon>
              技能特长
            </div>
            <div class="rich-text-content">
              <div v-html="resumeDetail.skills"></div>
            </div>
          </div>

          <!-- 审核信息 -->
          <div v-if="resumeDetail.reviewTime" class="info-section">
            <div class="section-title">
              <el-icon><DocumentChecked /></el-icon>
              审核信息
            </div>
            <el-descriptions :column="2" border>
              <el-descriptions-item label="审核人">
                {{ resumeDetail.reviewer }}
              </el-descriptions-item>
              <el-descriptions-item label="审核时间">
                {{ formatDate(resumeDetail.reviewTime) }}
              </el-descriptions-item>
              <el-descriptions-item label="审核意见" :span="2">
                {{ resumeDetail.reviewComment || '-' }}
              </el-descriptions-item>
            </el-descriptions>
          </div>

          <!-- 面试记录 -->
          <div v-if="resumeDetail.interviewRecords && resumeDetail.interviewRecords.length > 0" class="info-section">
            <div class="section-title">
              <el-icon><ChatDotRound /></el-icon>
              面试记录
            </div>
            <el-timeline>
              <el-timeline-item
                v-for="record in resumeDetail.interviewRecords"
                :key="record.id"
                :timestamp="record.interviewTime"
                placement="top"
              >
                <el-card>
                  <template #header>
                    <div class="timeline-header">
                      <span>{{ record.interviewType }}</span>
                      <el-tag :type="getInterviewResultTagType(record.interviewResult)">
                        {{ record.interviewResult }}
                      </el-tag>
                    </div>
                  </template>
                  <div class="timeline-content">
                    <p><strong>面试官：</strong>{{ record.interviewer }}</p>
                    <p><strong>面试结果：</strong>{{ record.interviewResult }}</p>
                    <p v-if="record.interviewComment"><strong>面试评价：</strong>{{ record.interviewComment }}</p>
                  </div>
                </el-card>
              </el-timeline-item>
            </el-timeline>
          </div>

          <!-- 操作记录 -->
          <div v-if="resumeDetail.operationRecords && resumeDetail.operationRecords.length > 0" class="info-section">
            <div class="section-title">
              <el-icon><Clock /></el-icon>
              操作记录
            </div>
            <el-timeline>
              <el-timeline-item
                v-for="record in resumeDetail.operationRecords"
                :key="record.id"
                :timestamp="record.operationTime"
                placement="top"
              >
                <el-card>
                  <div class="timeline-content">
                    <p><strong>操作：</strong>{{ record.operation }}</p>
                    <p><strong>操作人：</strong>{{ record.operator }}</p>
                    <p v-if="record.remark"><strong>备注：</strong>{{ record.remark }}</p>
                  </div>
                </el-card>
              </el-timeline-item>
            </el-timeline>
          </div>

          <!-- 附件信息 -->
          <div v-if="resumeDetail.attachments && resumeDetail.attachments.length > 0" class="info-section">
            <div class="section-title">
              <el-icon><Folder /></el-icon>
              附件信息
            </div>
            <el-table :data="resumeDetail.attachments" border style="width: 100%">
              <el-table-column prop="fileName" label="文件名称" min-width="200" show-overflow-tooltip />
              <el-table-column prop="fileSize" label="文件大小" width="120">
                <template #default="{ row }">
                  {{ formatFileSize(row.fileSize) }}
                </template>
              </el-table-column>
              <el-table-column prop="fileType" label="文件类型" width="120" />
              <el-table-column label="操作" width="150" fixed="right">
                <template #default="{ row }">
                  <el-button type="primary" link @click="handlePreview(row)">
                    预览
                  </el-button>
                  <el-button type="primary" link @click="handleDownload(row)">
                    下载
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>

        <el-empty v-else description="暂无数据" />
      </el-card>
    </div>

    <!-- 底部按钮栏 -->
    <div class="detail-footer">
      <el-button @click="handleBack">
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
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import {
  Edit,
  Back,
  InfoFilled,
  Briefcase,
  User,
  OfficeBuilding,
  Star,
  DocumentChecked,
  ChatDotRound,
  Clock,
  Folder
} from '@element-plus/icons-vue'
import { getResumeDetail } from '@/api/recruitmentApi'
import type { ResumeDetail as ResumeDetailType } from '@/types/recruitmentTypes'
import {
  ResumeStatus,
  ResumeStatusText,
  ResumeStatusTagType,
  Gender,
  GenderText,
  Education,
  EducationText,
  Experience,
  ExperienceText
} from '@/types/recruitmentTypes'

const router = useRouter()
const route = useRoute()

const loading = ref(false)
const resumeDetail = ref<ResumeDetailType | null>(null)

/**
 * 格式化日期
 * @param date 日期字符串
 */
const formatDate = (date: string | undefined) => {
  if (!date) return '-'
  return new Date(date).toLocaleString('zh-CN')
}

/**
 * 格式化文件大小
 * @param size 文件大小(字节)
 */
const formatFileSize = (size: number) => {
  if (size < 1024) {
    return size + 'B'
  } else if (size < 1024 * 1024) {
    return (size / 1024).toFixed(2) + 'KB'
  } else if (size < 1024 * 1024 * 1024) {
    return (size / (1024 * 1024)).toFixed(2) + 'MB'
  } else {
    return (size / (1024 * 1024 * 1024)).toFixed(2) + 'GB'
  }
}

/**
 * 获取状态文本
 * @param status 状态
 */
const getStatusText = (status: ResumeStatus) => {
  return ResumeStatusText[status] || status
}

/**
 * 获取状态标签类型
 * @param status 状态
 */
const getStatusTagType = (status: ResumeStatus) => {
  return ResumeStatusTagType[status] || 'info'
}

/**
 * 获取性别文本
 * @param gender 性别
 */
const getGenderText = (gender: Gender) => {
  return GenderText[gender] || gender
}

/**
 * 获取学历文本
 * @param education 学历
 */
const getEducationText = (education: Education) => {
  return EducationText[education] || education
}

/**
 * 获取工作经验文本
 * @param experience 工作经验
 */
const getExperienceText = (experience: Experience) => {
  return ExperienceText[experience] || experience
}

/**
 * 获取面试结果标签类型
 * @param result 面试结果
 */
const getInterviewResultTagType = (result: string) => {
  const map: Record<string, string> = {
    '通过': 'success',
    '不通过': 'danger',
    '待定': 'warning'
  }
  return map[result] || 'info'
}

/**
 * 获取简历详情
 */
const loadDetail = async () => {
  const id = route.params.id as string
  loading.value = true
  try {
    const response = await getResumeDetail(id)
    resumeDetail.value = response.data
  } catch (error) {
    console.error('加载详情失败:', error)
    ElMessage.error('加载详情失败')
  } finally {
    loading.value = false
  }
}

/**
 * 编辑
 */
const handleEdit = () => {
  const id = route.params.id as string
  router.push(`/admin/recruitment-management/resume-management/edit/${id}`)
}

/**
 * 返回
 */
const handleBack = () => {
  router.back()
}

/**
 * 预览附件
 * @param file 文件信息
 */
const handlePreview = (file: any) => {
  // 实现预览逻辑
  ElMessage.info('预览功能开发中')
}

/**
 * 下载附件
 * @param file 文件信息
 */
const handleDownload = (file: any) => {
  // 实现下载逻辑
  ElMessage.info('下载功能开发中')
}

// 初始化
onMounted(() => {
  loadDetail()
})
</script>

<style scoped>
/* 详情页容器 - 使用flex布局实现内部滚动 */
.resume-management-detail-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #f5f7fa;
  padding: 16px;
}

/* 内容区域 - 垂直滚动 */
.detail-content {
  flex: 1;
  overflow-y: auto;
  padding-bottom: 80px; /* 为底部按钮栏留出空间 */
}

.detail-card {
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-title {
  font-size: 18px;
  font-weight: 600;
  color: #303133;
}

.content-body {
  padding: 20px 0;
}

.info-section {
  margin-bottom: 30px;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 16px;
  padding-bottom: 10px;
  border-bottom: 2px solid #ebeef5;
}

.rich-text-content {
  padding: 16px;
  background-color: #f5f7fa;
  border-radius: 4px;
  min-height: 100px;
  line-height: 1.8;
}

.timeline-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.timeline-content p {
  margin: 8px 0;
  line-height: 1.6;
}

.timeline-content strong {
  color: #303133;
}

/* 底部按钮栏 - 固定悬浮 */
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

/* 响应式适配 */
@media screen and (max-width: 768px) {
  .detail-footer {
    left: 0;
    flex-direction: column;
  }
  
  .detail-footer .el-button {
    width: 100%;
  }
  
  .detail-content {
    padding-bottom: 120px; /* 为垂直排列的按钮栏留出更多空间 */
  }
}
</style>
