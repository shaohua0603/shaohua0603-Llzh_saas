<template>
  <el-dialog
    :model-value="visible"
    title="工人信息详情"
    width="900px"
    :close-on-click-modal="false"
    @close="handleClose"
    @update:model-value="(value) => visible = value"
  >
    <el-scrollbar v-if="workerDetail" max-height="600px">
      <!-- 个人证件照片 -->
      <div class="detail-section">
        <div class="section-title">个人证件照片</div>
        <div class="photo-gallery">
          <el-image
            v-if="workerDetail.idCardFrontPhoto"
            :src="workerDetail.idCardFrontPhoto"
            :preview-src-list="[workerDetail.idCardFrontPhoto]"
            fit="cover"
            class="id-photo"
          >
            <template #error>
              <div class="image-error">
                <el-icon><Picture /></el-icon>
              </div>
            </template>
          </el-image>
          <el-image
            v-if="workerDetail.idCardBackPhoto"
            :src="workerDetail.idCardBackPhoto"
            :preview-src-list="[workerDetail.idCardBackPhoto]"
            fit="cover"
            class="id-photo"
          >
            <template #error>
              <div class="image-error">
                <el-icon><Picture /></el-icon>
              </div>
            </template>
          </el-image>
        </div>
      </div>

      <!-- 基本信息 -->
      <div class="detail-section">
        <div class="section-title">基本信息</div>
        <el-descriptions :column="3" border>
          <el-descriptions-item label="姓名">{{ workerDetail.name }}</el-descriptions-item>
          <el-descriptions-item label="手机号">{{ workerDetail.phone }}</el-descriptions-item>
          <el-descriptions-item label="身份证号">{{ workerDetail.idCard || '-' }}</el-descriptions-item>
          <el-descriptions-item label="性别">
            {{ workerDetail.gender === 'male' ? '男' : workerDetail.gender === 'female' ? '女' : '-' }}
          </el-descriptions-item>
          <el-descriptions-item label="出生日期">{{ workerDetail.birthDate || '-' }}</el-descriptions-item>
          <el-descriptions-item label="年龄">{{ workerDetail.age || '-' }}</el-descriptions-item>
          <el-descriptions-item label="民族">{{ workerDetail.nation || '-' }}</el-descriptions-item>
          <el-descriptions-item label="籍贯">{{ workerDetail.nativePlace || '-' }}</el-descriptions-item>
          <el-descriptions-item label="婚姻状况">{{ workerDetail.maritalStatus || '-' }}</el-descriptions-item>
          <el-descriptions-item label="学历">{{ workerDetail.education || '-' }}</el-descriptions-item>
          <el-descriptions-item label="现住址" :span="2">{{ workerDetail.address || '-' }}</el-descriptions-item>
        </el-descriptions>
      </div>

      <!-- 工作信息 -->
      <div class="detail-section">
        <div class="section-title">工作信息</div>
        <el-descriptions :column="2" border>
          <el-descriptions-item label="工厂名称">{{ workerDetail.factoryName || '-' }}</el-descriptions-item>
          <el-descriptions-item label="劳务公司">{{ workerDetail.laborCompany || '-' }}</el-descriptions-item>
          <el-descriptions-item label="区域">{{ workerDetail.area || '-' }}</el-descriptions-item>
          <el-descriptions-item label="产线">{{ workerDetail.productionLine || '-' }}</el-descriptions-item>
          <el-descriptions-item label="岗位类别">{{ workerDetail.positionCategory || '-' }}</el-descriptions-item>
          <el-descriptions-item label="岗位名称">{{ workerDetail.positionName || '-' }}</el-descriptions-item>
        </el-descriptions>
      </div>

      <!-- 生活照片 -->
      <div class="detail-section" v-if="workerDetail.lifePhotos && workerDetail.lifePhotos.length > 0">
        <div class="section-title">生活照片</div>
        <div class="photo-gallery">
          <el-image
            v-for="(photo, index) in workerDetail.lifePhotos"
            :key="index"
            :src="photo"
            :preview-src-list="workerDetail.lifePhotos"
            :initial-index="index"
            fit="cover"
            class="life-photo"
          >
            <template #error>
              <div class="image-error">
                <el-icon><Picture /></el-icon>
              </div>
            </template>
          </el-image>
        </div>
      </div>

      <!-- 教育背景 -->
      <div class="detail-section" v-if="workerDetail.educationBackground && workerDetail.educationBackground.length > 0">
        <div class="section-title">教育背景</div>
        <el-table :data="workerDetail.educationBackground" border size="small">
          <el-table-column prop="school" label="学校" />
          <el-table-column prop="major" label="专业" />
          <el-table-column prop="degree" label="学历" />
          <el-table-column prop="startDate" label="开始日期" />
          <el-table-column prop="endDate" label="结束日期" />
        </el-table>
      </div>

      <!-- 当前工作情况 -->
      <div class="detail-section" v-if="workerDetail.currentWorkStatus">
        <div class="section-title">当前工作情况</div>
        <el-descriptions :column="2" border>
          <el-descriptions-item label="状态">{{ workerDetail.currentWorkStatus.status }}</el-descriptions-item>
          <el-descriptions-item label="入职日期">{{ workerDetail.currentWorkStatus.entryDate || '-' }}</el-descriptions-item>
          <el-descriptions-item label="工作时长">{{ workerDetail.currentWorkStatus.workDuration || '-' }}天</el-descriptions-item>
          <el-descriptions-item label="当前薪资">¥{{ workerDetail.currentWorkStatus.currentSalary || '-' }}</el-descriptions-item>
        </el-descriptions>
      </div>

      <!-- 求职意向 -->
      <div class="detail-section" v-if="workerDetail.jobIntention">
        <div class="section-title">求职意向</div>
        <el-descriptions :column="2" border>
          <el-descriptions-item label="期望岗位">{{ workerDetail.jobIntention.expectedPosition || '-' }}</el-descriptions-item>
          <el-descriptions-item label="期望薪资">¥{{ workerDetail.jobIntention.expectedSalary || '-' }}</el-descriptions-item>
          <el-descriptions-item label="期望区域">{{ workerDetail.jobIntention.expectedArea || '-' }}</el-descriptions-item>
          <el-descriptions-item label="可到岗日期">{{ workerDetail.jobIntention.availableDate || '-' }}</el-descriptions-item>
        </el-descriptions>
      </div>

      <!-- 紧急联系方式 -->
      <div class="detail-section" v-if="workerDetail.emergencyContact">
        <div class="section-title">紧急联系方式</div>
        <el-descriptions :column="2" border>
          <el-descriptions-item label="姓名">{{ workerDetail.emergencyContact.name }}</el-descriptions-item>
          <el-descriptions-item label="关系">{{ workerDetail.emergencyContact.relationship }}</el-descriptions-item>
          <el-descriptions-item label="电话">{{ workerDetail.emergencyContact.phone }}</el-descriptions-item>
          <el-descriptions-item label="地址">{{ workerDetail.emergencyContact.address || '-' }}</el-descriptions-item>
        </el-descriptions>
      </div>

      <!-- 工资方法银行卡 -->
      <div class="detail-section" v-if="workerDetail.bankCard">
        <div class="section-title">工资方法银行卡</div>
        <el-descriptions :column="2" border>
          <el-descriptions-item label="银行名称">{{ workerDetail.bankCard.bankName }}</el-descriptions-item>
          <el-descriptions-item label="持卡人">{{ workerDetail.bankCard.cardholderName }}</el-descriptions-item>
          <el-descriptions-item label="卡号" :span="2">{{ workerDetail.bankCard.cardNumber }}</el-descriptions-item>
        </el-descriptions>
      </div>

      <!-- 技能与证书 -->
      <div class="detail-section">
        <div class="section-title">技能与证书</div>
        <div class="tags-section" v-if="workerDetail.skills && workerDetail.skills.length > 0">
          <div class="label">技能:</div>
          <el-tag v-for="skill in workerDetail.skills" :key="skill" type="primary" style="margin-right: 8px; margin-bottom: 8px;">
            {{ skill }}
          </el-tag>
        </div>
        <el-table
          v-if="workerDetail.certificates && workerDetail.certificates.length > 0"
          :data="workerDetail.certificates"
          border
          size="small"
          style="margin-top: 16px;"
        >
          <el-table-column prop="name" label="证书名称" />
          <el-table-column prop="issuingOrganization" label="颁发机构" />
          <el-table-column prop="issueDate" label="颁发日期" />
          <el-table-column prop="expiryDate" label="有效期至" />
        </el-table>
      </div>

      <!-- 特殊情况与健康状况 -->
      <div class="detail-section" v-if="workerDetail.specialConditions || workerDetail.healthStatus">
        <div class="section-title">特殊情况与健康状况</div>
        <div class="tags-section" v-if="workerDetail.specialConditions && workerDetail.specialConditions.length > 0">
          <div class="label">特殊情况:</div>
          <el-tag v-for="condition in workerDetail.specialConditions" :key="condition" type="warning" style="margin-right: 8px; margin-bottom: 8px;">
            {{ condition }}
          </el-tag>
        </div>
        <el-descriptions v-if="workerDetail.healthStatus" :column="2" border style="margin-top: 16px;">
          <el-descriptions-item label="身高">{{ workerDetail.healthStatus.height || '-' }}cm</el-descriptions-item>
          <el-descriptions-item label="体重">{{ workerDetail.healthStatus.weight || '-' }}kg</el-descriptions-item>
          <el-descriptions-item label="血型">{{ workerDetail.healthStatus.bloodType || '-' }}</el-descriptions-item>
          <el-descriptions-item label="健康状况">{{ workerDetail.healthStatus.healthCondition || '-' }}</el-descriptions-item>
          <el-descriptions-item label="病史" :span="2">{{ workerDetail.healthStatus.medicalHistory || '-' }}</el-descriptions-item>
        </el-descriptions>
      </div>

      <!-- 个人经历 -->
      <div class="detail-section" v-if="workerDetail.personalExperience">
        <div class="section-title">个人经历</div>
        <div class="text-content">{{ workerDetail.personalExperience }}</div>
      </div>

      <!-- 工作履历 -->
      <div class="detail-section" v-if="workerDetail.workHistory && workerDetail.workHistory.length > 0">
        <div class="section-title">工作履历</div>
        <el-timeline>
          <el-timeline-item
            v-for="(history, index) in workerDetail.workHistory"
            :key="index"
            :timestamp="`${history.startDate} - ${history.endDate}`"
            placement="top"
          >
            <el-card>
              <div class="work-history-item">
                <div class="company">{{ history.companyName }}</div>
                <div class="position">{{ history.position }}</div>
                <div class="reason" v-if="history.reasonForLeaving">离职原因: {{ history.reasonForLeaving }}</div>
              </div>
            </el-card>
          </el-timeline-item>
        </el-timeline>
      </div>

      <!-- 其他信息 -->
      <div class="detail-section">
        <div class="section-title">其他信息</div>
        <div class="tags-section">
          <div class="label">标签:</div>
          <el-tag
            v-for="tag in workerDetail.tags"
            :key="tag"
            :color="WorkerTagColor[tag]"
            style="margin-right: 8px; margin-bottom: 8px;"
          >
            {{ WorkerTagText[tag] }}
          </el-tag>
        </div>
        <el-descriptions :column="2" border style="margin-top: 16px;">
          <el-descriptions-item label="注册时间">{{ workerDetail.registerTime }}</el-descriptions-item>
          <el-descriptions-item label="最后登录">{{ workerDetail.lastLoginTime || '-' }}</el-descriptions-item>
        </el-descriptions>
      </div>
    </el-scrollbar>

    <template #footer>
      <el-button @click="handleClose">关闭</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { Picture } from '@element-plus/icons-vue'
import { idleWorkerApi } from '@/api/operations/idleWorkerApi'
import {
  WorkerTag,
  WorkerTagText,
  WorkerTagColor,
  type WorkerDetailInfo,
} from '@/types/operations/idleWorker'

// Props
interface Props {
  modelValue: boolean
  workerId?: number
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  workerId: undefined,
})

// Emits
const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

// 响应式数据
const visible = ref(props.modelValue)
const workerDetail = ref<WorkerDetailInfo | null>(null)
const loading = ref(false)

// 监听visible变化
watch(() => props.modelValue, (newVal) => {
  visible.value = newVal
  if (newVal && props.workerId) {
    loadWorkerDetail()
  }
})

// 监听visible变化,同步到父组件
watch(visible, (newVal) => {
  emit('update:modelValue', newVal)
})

// 加载工人详情
const loadWorkerDetail = async () => {
  if (!props.workerId) return

  loading.value = true
  try {
    const response = await idleWorkerApi.getWorkerDetail(props.workerId)
    workerDetail.value = response.data
  } catch (error) {
    console.error('加载工人详情失败:', error)
  } finally {
    loading.value = false
  }
}

// 关闭对话框
const handleClose = () => {
  visible.value = false
  workerDetail.value = null
}
</script>

<style scoped>
.detail-section {
  margin-bottom: 24px;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 12px;
  padding-left: 8px;
  border-left: 4px solid #409eff;
}

.photo-gallery {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.id-photo,
.life-photo {
  width: 200px;
  height: 140px;
  border-radius: 4px;
  overflow: hidden;
  border: 1px solid #dcdfe6;
}

.image-error {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  background-color: #f5f7fa;
  color: #909399;
  font-size: 32px;
}

.tags-section {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  flex-wrap: wrap;
}

.tags-section .label {
  font-weight: 500;
  color: #606266;
  min-width: 60px;
}

.text-content {
  padding: 12px;
  background-color: #f5f7fa;
  border-radius: 4px;
  line-height: 1.8;
  color: #606266;
}

.work-history-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.work-history-item .company {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
}

.work-history-item .position {
  font-size: 14px;
  color: #606266;
}

.work-history-item .reason {
  font-size: 13px;
  color: #909399;
}
</style>
