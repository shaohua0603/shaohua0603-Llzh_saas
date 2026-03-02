<template>
  <div class="recruitment-requirements-detail-container">
    <el-card v-loading="loading" class="detail-card">
      <template #header>
        <div class="card-header">
          <span class="card-title">招聘需求详情</span>
          <div class="header-actions">
            <el-button
              type="primary"
              :icon="Edit"
              @click="handleEdit"
            >
              编辑
            </el-button>
            <el-button
              :icon="Back"
              @click="handleBack"
            >
              返回
            </el-button>
          </div>
        </div>
      </template>

      <div v-if="recruitmentDetail" class="detail-content">
        <!-- 基本信息 -->
        <div class="info-section">
          <div class="section-title">
            <el-icon><InfoFilled /></el-icon>
            基本信息
          </div>
          <el-descriptions :column="2" border>
            <el-descriptions-item label="需求标题">
              {{ recruitmentDetail.title }}
            </el-descriptions-item>
            <el-descriptions-item label="状态">
              <el-tag :type="getStatusTagType(recruitmentDetail.status)">
                {{ getStatusText(recruitmentDetail.status) }}
              </el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="工厂名称">
              {{ recruitmentDetail.factoryName }}
            </el-descriptions-item>
            <el-descriptions-item label="劳务公司">
              {{ recruitmentDetail.laborCompanyName }}
            </el-descriptions-item>
            <el-descriptions-item label="岗位名称">
              {{ recruitmentDetail.positionName }}
            </el-descriptions-item>
            <el-descriptions-item label="招聘人数">
              {{ recruitmentDetail.recruitCount }}人
            </el-descriptions-item>
            <el-descriptions-item label="薪资范围">
              {{ recruitmentDetail.salaryMin }}-{{ recruitmentDetail.salaryMax }}{{ recruitmentDetail.salaryUnit }}
            </el-descriptions-item>
            <el-descriptions-item label="工作地点">
              {{ recruitmentDetail.workLocation }}
            </el-descriptions-item>
            <el-descriptions-item label="工作时间">
              {{ recruitmentDetail.workTime }}
            </el-descriptions-item>
            <el-descriptions-item label="发布时间">
              {{ formatDate(recruitmentDetail.publishTime) }}
            </el-descriptions-item>
            <el-descriptions-item label="开始时间">
              {{ formatDate(recruitmentDetail.startTime) }}
            </el-descriptions-item>
            <el-descriptions-item label="结束时间">
              {{ formatDate(recruitmentDetail.endTime) }}
            </el-descriptions-item>
            <el-descriptions-item label="创建时间">
              {{ formatDate(recruitmentDetail.createdAt) }}
            </el-descriptions-item>
            <el-descriptions-item label="创建人">
              {{ recruitmentDetail.createdBy }}
            </el-descriptions-item>
            <el-descriptions-item label="更新时间" :span="2">
              {{ formatDate(recruitmentDetail.updatedAt) }}
            </el-descriptions-item>
          </el-descriptions>
        </div>

        <!-- 联系信息 -->
        <div class="info-section">
          <div class="section-title">
            <el-icon><Phone /></el-icon>
            联系信息
          </div>
          <el-descriptions :column="2" border>
            <el-descriptions-item label="联系人">
              {{ recruitmentDetail.contactPerson }}
            </el-descriptions-item>
            <el-descriptions-item label="联系电话">
              {{ recruitmentDetail.contactPhone }}
            </el-descriptions-item>
          </el-descriptions>
        </div>

        <!-- 岗位描述 -->
        <div class="info-section">
          <div class="section-title">
            <el-icon><Document /></el-icon>
            岗位描述
          </div>
          <div class="rich-text-content">
            <div v-html="recruitmentDetail.jobDescription"></div>
          </div>
        </div>

        <!-- 岗位要求 -->
        <div class="info-section">
          <div class="section-title">
            <el-icon><Document /></el-icon>
            岗位要求
          </div>
          <div class="rich-text-content">
            <div v-html="recruitmentDetail.jobRequirements"></div>
          </div>
        </div>

        <!-- 福利待遇 -->
        <div class="info-section">
          <div class="section-title">
            <el-icon><Present /></el-icon>
            福利待遇
          </div>
          <div class="rich-text-content">
            <div v-html="recruitmentDetail.welfareBenefits"></div>
          </div>
        </div>

        <!-- 统计信息 -->
        <div class="info-section">
          <div class="section-title">
            <el-icon><DataAnalysis /></el-icon>
            统计信息
          </div>
          <el-row :gutter="20" class="statistics-row">
            <el-col :span="6">
              <el-statistic title="已投递人数" :value="recruitmentDetail.appliedCount">
                <template #suffix>人</template>
              </el-statistic>
            </el-col>
            <el-col :span="6">
              <el-statistic title="面试人数" :value="recruitmentDetail.interviewCount">
                <template #suffix>人</template>
              </el-statistic>
            </el-col>
            <el-col :span="6">
              <el-statistic title="已录用人数" :value="recruitmentDetail.hiredCount">
                <template #suffix>人</template>
              </el-statistic>
            </el-col>
            <el-col :span="6">
              <el-statistic title="浏览次数" :value="recruitmentDetail.viewCount">
                <template #suffix>次</template>
              </el-statistic>
            </el-col>
          </el-row>
        </div>

        <!-- 附件信息 -->
        <div v-if="recruitmentDetail.attachments && recruitmentDetail.attachments.length > 0" class="info-section">
          <div class="section-title">
            <el-icon><Folder /></el-icon>
            附件信息
          </div>
          <el-table :data="recruitmentDetail.attachments" border style="width: 100%">
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
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Edit, Back, InfoFilled, Phone, Document, Present, DataAnalysis, Folder } from '@element-plus/icons-vue'
import { getRecruitmentDetail } from '@/api/recruitmentApi'
import type { RecruitmentDetail as RecruitmentDetailType } from '@/types/recruitmentTypes'
import { RecruitmentStatus, RecruitmentStatusText, RecruitmentStatusTagType } from '@/types/recruitmentTypes'

const router = useRouter()
const route = useRoute()

const loading = ref(false)
const recruitmentDetail = ref<RecruitmentDetailType | null>(null)

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
const getStatusText = (status: RecruitmentStatus) => {
  return RecruitmentStatusText[status] || status
}

/**
 * 获取状态标签类型
 * @param status 状态
 */
const getStatusTagType = (status: RecruitmentStatus) => {
  return RecruitmentStatusTagType[status] || 'info'
}

/**
 * 获取招聘需求详情
 */
const loadDetail = async () => {
  const id = route.params.id as string
  loading.value = true
  try {
    const response = await getRecruitmentDetail(id)
    recruitmentDetail.value = response.data
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
  router.push(`/admin/recruitment-management/recruitment-requirements/edit/${id}`)
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
.recruitment-requirements-detail-container {
  padding: 0;
}

.detail-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--color-text-primary);
}

.header-actions {
  display: flex;
  gap: 10px;
}

.detail-content {
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
  color: var(--color-text-primary);
  margin-bottom: 16px;
  padding-bottom: 10px;
  border-bottom: 2px solid var(--color-border);
}

.rich-text-content {
  padding: 16px;
  background-color: var(--color-bg-page);
  border-radius: 4px;
  min-height: 100px;
  line-height: 1.8;
}

.statistics-row {
  padding: 20px;
  background-color: var(--color-bg-page);
  border-radius: 4px;
}
</style>
