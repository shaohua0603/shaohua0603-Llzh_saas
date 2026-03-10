<template>
  <div>
    <!-- 蒙版层 -->
    <div 
      class="sidebar-overlay" 
      :class="{ 'visible': visible }" 
      @click="close"
    ></div>
    
    <!-- 侧边栏 -->
    <div class="worker-info-sidebar" :class="{ 'open': visible }">
      <div class="sidebar-header">
        <h3>工人详情</h3>
        <el-button type="text" @click="close" class="close-button">
          <el-icon><Close /></el-icon>
        </el-button>
      </div>
      <div class="sidebar-content">
        <div v-if="loading" class="loading">
          <el-icon class="is-loading"><Loading /></el-icon>
          <span>加载中...</span>
        </div>
        <div v-else-if="workerInfo" class="worker-details">
          <!-- 头部信息 -->
          <div class="info-section">
            <div class="worker-header">
              <div class="id-photo">
                <el-image
                  :src="workerInfo.idPhoto"
                  :preview-src-list="[workerInfo.idPhoto]"
                  fit="cover"
                  :preview-teleported="true"
                >
                  <template #error>
                    <div class="image-error">
                      <el-icon><User /></el-icon>
                    </div>
                  </template>
                </el-image>
              </div>
              <div class="header-info">
                <h3 class="worker-name">{{ workerInfo.name }}</h3>
                <div class="worker-tags">
                  <el-tag :type="getLifecycleType(workerInfo.lifecycleStatus)" size="small">
                    {{ getLifecycleText(workerInfo.lifecycleStatus) }}
                  </el-tag>
                  <el-tag v-if="workerInfo.paymentType" :type="workerInfo.paymentType === '日结' ? 'warning' : 'success'" size="small">
                    {{ workerInfo.paymentType }}
                  </el-tag>
                </div>
                <div class="basic-tags">
                  <span class="tag-item">{{ workerInfo.gender }}</span>
                  <span class="tag-item">{{ workerInfo.age }}岁</span>
                  <span class="tag-item">{{ workerInfo.phone }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- 生活照片 -->
          <div class="info-section">
            <h4 class="section-title">
              <el-icon><Picture /></el-icon>
              生活照片
            </h4>
            <div class="life-photos-grid" v-if="workerInfo.lifePhotos && workerInfo.lifePhotos.length > 0">
              <div v-for="(photo, index) in workerInfo.lifePhotos" :key="index" class="life-photo-item">
                <el-image
                  :src="photo"
                  :preview-src-list="workerInfo.lifePhotos"
                  :initial-index="index"
                  fit="cover"
                  :preview-teleported="true"
                >
                  <template #error>
                    <div class="image-error">
                      <el-icon><Picture /></el-icon>
                    </div>
                  </template>
                </el-image>
              </div>
            </div>
            <el-empty v-else description="暂无生活照片" :image-size="60" />
          </div>

          <!-- 个人基础信息 -->
          <div class="info-section">
            <h4 class="section-title">
              <el-icon><User /></el-icon>
              个人基础信息
            </h4>
            <el-descriptions :column="2" border size="small">
              <el-descriptions-item label="工号">{{ workerInfo.workerId }}</el-descriptions-item>
              <el-descriptions-item label="姓名">{{ workerInfo.name }}</el-descriptions-item>
              <el-descriptions-item label="性别">{{ workerInfo.gender }}</el-descriptions-item>
              <el-descriptions-item label="年龄">{{ workerInfo.age }}岁</el-descriptions-item>
              <el-descriptions-item label="身份证号">{{ workerInfo.idCard }}</el-descriptions-item>
              <el-descriptions-item label="手机号">{{ workerInfo.phone }}</el-descriptions-item>
              <el-descriptions-item label="民族">{{ workerInfo.ethnicity }}</el-descriptions-item>
              <el-descriptions-item label="婚姻状况">{{ workerInfo.maritalStatus }}</el-descriptions-item>
              <el-descriptions-item label="政治面貌">{{ workerInfo.politicalStatus }}</el-descriptions-item>
              <el-descriptions-item label="籍贯">{{ workerInfo.nativePlace }}</el-descriptions-item>
              <el-descriptions-item label="出生日期">{{ workerInfo.birthDate }}</el-descriptions-item>
              <el-descriptions-item label="最高学历">{{ workerInfo.highestEducation }}</el-descriptions-item>
              <el-descriptions-item label="现居地址" :span="2">{{ workerInfo.currentAddress }}</el-descriptions-item>
            </el-descriptions>
          </div>

          <!-- 教育背景 -->
          <div class="info-section">
            <h4 class="section-title">
              <el-icon><School /></el-icon>
              教育背景
            </h4>
            <div v-if="workerInfo.education && workerInfo.education.length > 0">
              <el-card 
                v-for="(edu, index) in workerInfo.education" 
                :key="index" 
                class="education-card"
                shadow="hover"
              >
                <el-descriptions :column="2" border size="small">
                  <el-descriptions-item label="学历">{{ edu.degree }}</el-descriptions-item>
                  <el-descriptions-item label="学校">{{ edu.school }}</el-descriptions-item>
                  <el-descriptions-item label="专业">{{ edu.major }}</el-descriptions-item>
                  <el-descriptions-item label="毕业时间">{{ edu.graduationDate }}</el-descriptions-item>
                  <el-descriptions-item label="证书" :span="2">{{ edu.certificate }}</el-descriptions-item>
                </el-descriptions>
              </el-card>
            </div>
            <el-empty v-else description="暂无教育背景信息" :image-size="60" />
          </div>

          <!-- 当前工作情况 -->
          <div class="info-section">
            <h4 class="section-title">
              <el-icon><Briefcase /></el-icon>
              当前工作情况
            </h4>
            <el-descriptions :column="2" border size="small">
              <el-descriptions-item label="状态">{{ workerInfo.workInfo?.status }}</el-descriptions-item>
              <el-descriptions-item label="入职日期">{{ workerInfo.workInfo?.entryDate }}</el-descriptions-item>
              <el-descriptions-item label="工作年限">{{ workerInfo.workInfo?.workYears }}</el-descriptions-item>
              <el-descriptions-item label="工作天数">{{ workerInfo.workInfo?.workDays }}天</el-descriptions-item>
              <el-descriptions-item label="工厂">{{ workerInfo.factoryName }}</el-descriptions-item>
              <el-descriptions-item label="工作区域">{{ workerInfo.factoryArea }}</el-descriptions-item>
              <el-descriptions-item label="生产线">{{ workerInfo.productionLine }}</el-descriptions-item>
              <el-descriptions-item label="岗位类型">{{ workerInfo.positionType }}</el-descriptions-item>
              <el-descriptions-item label="岗位名称">{{ workerInfo.positionName }}</el-descriptions-item>
              <el-descriptions-item label="部门">{{ workerInfo.workInfo?.department }}</el-descriptions-item>
              <el-descriptions-item label="班组">{{ workerInfo.workInfo?.group }}</el-descriptions-item>
              <el-descriptions-item label="直属上级">{{ workerInfo.workInfo?.supervisor }}</el-descriptions-item>
              <el-descriptions-item label="劳务公司" :span="2">{{ workerInfo.laborCompany }}</el-descriptions-item>
            </el-descriptions>

            <!-- 考勤信息 -->
            <div class="sub-info" v-if="workerInfo.workInfo?.attendance">
              <h5>考勤统计</h5>
              <el-descriptions :column="4" border size="small">
                <el-descriptions-item label="总天数">{{ workerInfo.workInfo.attendance.totalDays }}天</el-descriptions-item>
                <el-descriptions-item label="缺勤天数">{{ workerInfo.workInfo.attendance.absentDays }}天</el-descriptions-item>
                <el-descriptions-item label="迟到天数">{{ workerInfo.workInfo.attendance.lateDays }}天</el-descriptions-item>
                <el-descriptions-item label="病假天数">{{ workerInfo.workInfo.attendance.sickDays }}天</el-descriptions-item>
              </el-descriptions>
            </div>

            <!-- 调岗信息 -->
            <div class="sub-info" v-if="workerInfo.workInfo?.transfer">
              <h5>调岗记录</h5>
              <el-descriptions :column="2" border size="small">
                <el-descriptions-item label="调岗次数">{{ workerInfo.workInfo.transfer.count }}次</el-descriptions-item>
                <el-descriptions-item label="最近调岗日期">{{ workerInfo.workInfo.transfer.lastTransferDate || '-' }}</el-descriptions-item>
                <el-descriptions-item label="调岗前">{{ workerInfo.workInfo.transfer.lastTransferFrom || '-' }}</el-descriptions-item>
                <el-descriptions-item label="调岗后">{{ workerInfo.workInfo.transfer.lastTransferTo || '-' }}</el-descriptions-item>
              </el-descriptions>
            </div>

            <!-- 工资信息 -->
            <div class="sub-info" v-if="workerInfo.workInfo?.salary">
              <h5>工资信息</h5>
              <el-descriptions :column="2" border size="small">
                <el-descriptions-item label="月薪">{{ workerInfo.workInfo.salary.monthlySalary }}</el-descriptions-item>
                <el-descriptions-item label="最近发薪日期">{{ workerInfo.workInfo.salary.lastSalaryDate || '-' }}</el-descriptions-item>
                <el-descriptions-item label="历史发薪次数">{{ workerInfo.workInfo.salary.salaryHistory }}次</el-descriptions-item>
              </el-descriptions>
            </div>

            <!-- 理赔信息 -->
            <div class="sub-info" v-if="workerInfo.workInfo?.claim">
              <h5>理赔记录</h5>
              <el-descriptions :column="2" border size="small">
                <el-descriptions-item label="理赔次数">{{ workerInfo.workInfo.claim.count }}次</el-descriptions-item>
                <el-descriptions-item label="最近理赔日期">{{ workerInfo.workInfo.claim.lastClaimDate || '-' }}</el-descriptions-item>
                <el-descriptions-item label="最近理赔金额">{{ workerInfo.workInfo.claim.lastClaimAmount ? `${workerInfo.workInfo.claim.lastClaimAmount}元` : '-' }}</el-descriptions-item>
              </el-descriptions>
            </div>
          </div>

          <!-- 求职意向 -->
          <div class="info-section">
            <h4 class="section-title">
              <el-icon><Aim /></el-icon>
              求职意向
            </h4>
            <el-descriptions :column="2" border size="small">
              <el-descriptions-item label="期望岗位类别">{{ workerInfo.jobIntent?.positionCategory }}</el-descriptions-item>
              <el-descriptions-item label="期望工作地点">{{ workerInfo.jobIntent?.workLocation }}</el-descriptions-item>
              <el-descriptions-item label="期望薪资">{{ workerInfo.jobIntent?.salaryExpectation }}</el-descriptions-item>
              <el-descriptions-item label="可到岗日期">{{ workerInfo.jobIntent?.availableDate }}</el-descriptions-item>
            </el-descriptions>
          </div>

          <!-- 紧急联系方式 -->
          <div class="info-section">
            <h4 class="section-title">
              <el-icon><Phone /></el-icon>
              紧急联系方式
            </h4>
            <el-descriptions :column="2" border size="small">
              <el-descriptions-item label="联系人">{{ workerInfo.emergencyContact?.name }}</el-descriptions-item>
              <el-descriptions-item label="与本人关系">{{ workerInfo.emergencyContact?.relation }}</el-descriptions-item>
              <el-descriptions-item label="联系电话" :span="2">{{ workerInfo.emergencyContact?.phone }}</el-descriptions-item>
            </el-descriptions>
          </div>

          <!-- 工资发放银行卡信息 -->
          <div class="info-section">
            <h4 class="section-title">
              <el-icon><CreditCard /></el-icon>
              工资发放银行卡信息
            </h4>
            <el-descriptions :column="2" border size="small">
              <el-descriptions-item label="开户银行">{{ workerInfo.bankInfo?.bankName }}</el-descriptions-item>
              <el-descriptions-item label="银行账号">{{ workerInfo.bankInfo?.bankCard }}</el-descriptions-item>
              <el-descriptions-item label="账户姓名">{{ workerInfo.bankInfo?.accountName }}</el-descriptions-item>
            </el-descriptions>
          </div>

          <!-- 技能与证书 -->
          <div class="info-section">
            <h4 class="section-title">
              <el-icon><Star /></el-icon>
              技能与证书
            </h4>
            <div class="skills-info">
              <div class="skill-label">技能描述</div>
              <div class="skill-content">{{ workerInfo.skills || '暂无技能描述' }}</div>
            </div>
            <div class="certificates-info" v-if="workerInfo.certificates && workerInfo.certificates.length > 0">
              <div class="certificate-label">持有证书</div>
              <div class="certificates-list">
                <el-tag 
                  v-for="(cert, index) in workerInfo.certificates" 
                  :key="index" 
                  type="success" 
                  effect="plain"
                >
                  {{ cert.name }} ({{ cert.validDate }})
                </el-tag>
              </div>
            </div>
            <el-empty v-else-if="!workerInfo.skills" description="暂无技能与证书信息" :image-size="60" />
          </div>

          <!-- 特殊情况与健康状态 -->
          <div class="info-section">
            <h4 class="section-title">
              <el-icon><Warning /></el-icon>
              特殊情况与健康状态
            </h4>
            <el-descriptions :column="2" border size="small">
              <el-descriptions-item label="健康状态">{{ workerInfo.healthInfo?.healthStatus }}</el-descriptions-item>
              <el-descriptions-item label="身高">{{ workerInfo.healthInfo?.height }}</el-descriptions-item>
              <el-descriptions-item label="体重">{{ workerInfo.healthInfo?.weight }}</el-descriptions-item>
              <el-descriptions-item label="过敏史">{{ workerInfo.healthInfo?.allergies || '无' }}</el-descriptions-item>
              <el-descriptions-item label="特殊情况说明" :span="2">{{ workerInfo.healthInfo?.specialNotes || '无' }}</el-descriptions-item>
            </el-descriptions>
          </div>

          <!-- 个人经历 -->
          <div class="info-section">
            <h4 class="section-title">
              <el-icon><Document /></el-icon>
              个人经历
            </h4>
            <div class="experience-content">
              {{ workerInfo.experience || '暂无个人经历' }}
            </div>

            <!-- 工作履历 -->
            <div class="work-history" v-if="workerInfo.workHistory && workerInfo.workHistory.length > 0">
              <div class="history-label">工作履历</div>
              <el-timeline>
                <el-timeline-item
                  v-for="(work, index) in workerInfo.workHistory"
                  :key="index"
                  :timestamp="`${work.startDate} - ${work.endDate}`"
                  placement="top"
                >
                  <el-card shadow="hover">
                    <h5>{{ work.laborCompany }}</h5>
                    <p>工厂：{{ work.factory }}</p>
                    <p>岗位：{{ work.position }}</p>
                  </el-card>
                </el-timeline-item>
              </el-timeline>
            </div>
          </div>
        </div>
        <div v-else class="no-data">
          <el-empty description="暂无工人信息" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { Loading, Close, User, Picture, School, Briefcase, Aim, Phone, CreditCard, Star, Warning, Document } from '@element-plus/icons-vue'

interface Props {
  visible: boolean
  workerName?: string
  phone?: string
  workerId?: number | string
}

const props = withDefaults(defineProps<Props>(), {
  visible: false,
  workerName: '',
  phone: '',
  workerId: undefined
})

const emit = defineEmits<{
  'update:visible': [value: boolean]
}>()

const loading = ref(false)
const workerInfo = ref<any>(null)

const getLifecycleType = (status: string) => {
  const typeMap: Record<string, string> = {
    'registered': 'info',
    'pickup': 'warning',
    'labor_company_staff': 'primary',
    'factory_staff': 'primary',
    'initial_interview': 'warning',
    'contract_signed': 'success',
    'interview_invited': 'warning',
    'factory_interview': 'warning',
    'entered': 'success',
    'resigned': 'danger'
  }
  return typeMap[status] || 'info'
}

const getLifecycleText = (status: string) => {
  const textMap: Record<string, string> = {
    'registered': '注册',
    'pickup': '接送',
    'labor_company_staff': '劳务运维人员',
    'factory_staff': '工厂正式人员',
    'initial_interview': '初次面试',
    'contract_signed': '合同签订',
    'interview_invited': '面试邀约',
    'factory_interview': '工厂面试',
    'entered': '进厂',
    'resigned': '离职'
  }
  return textMap[status] || '未知'
}

const fetchWorkerInfo = async () => {
  if (!props.workerName && !props.phone && !props.workerId) {
    workerInfo.value = null
    return
  }

  loading.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 500))

    workerInfo.value = {
      id: props.workerId || '1',
      workerId: 'EMP001',
      name: props.workerName || '张三',
      gender: '男',
      age: 34,
      phone: props.phone || '138****8001',
      idCard: '410101199005151234',
      ethnicity: '汉族',
      maritalStatus: '已婚',
      politicalStatus: '群众',
      nativePlace: '河南省郑州市中原区',
      currentAddress: '广东省深圳市南山区科技园南区高新南一道',
      highestEducation: '高中',
      birthDate: '1990-05-15',
      
      idPhoto: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20ID%20photo%20of%20a%20Chinese%20male%20worker%20with%20plain%20white%20background%2C%20passport%20style%2C%20front%20view%2C%20clear%20features%2C%20formal%20clothing&image_size=square',
      
      lifePhotos: [
        'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Chinese%20male%20worker%20in%20casual%20clothes%20outdoor%20in%20park%2C%20natural%20smile%2C%20sunny%20day%2C%20realistic%20photo&image_size=square',
        'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Chinese%20male%20worker%20with%20friends%20at%20restaurant%2C%20casual%20wear%2C%20enjoying%20meal%2C%20natural%20lighting%2C%20realistic%20photo&image_size=square',
        'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Chinese%20male%20worker%20playing%20basketball%20outdoor%2C%20sportswear%2C%20active%20pose%2C%20daytime%2C%20realistic%20photo&image_size=square',
        'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Chinese%20male%20worker%20traveling%20at%20scenic%20spot%2C%20casual%20outfit%2C%20background%20with%20mountains%2C%20natural%20light%2C%20realistic%20photo&image_size=square'
      ],
      
      factoryName: '富士康科技集团',
      factoryArea: 'A区',
      productionLine: '智能手机组装',
      positionType: '普工',
      positionName: '操作工',
      laborCompany: '南通富民劳务服务有限公司',
      
      education: [
        {
          degree: '高中',
          school: '郑州市第一高级中学',
          major: '文科',
          graduationDate: '2008-06',
          certificate: '毕业证书'
        }
      ],
      
      workInfo: {
        status: '在职',
        entryDate: '2023-01-01',
        workYears: '2年',
        workDays: 730,
        department: '组装车间',
        group: '第三组',
        supervisor: '李四',
        attendance: {
          totalDays: 730,
          absentDays: 5,
          lateDays: 8,
          sickDays: 3
        },
        transfer: {
          count: 1,
          lastTransferDate: '2023-06-15',
          lastTransferFrom: 'B区',
          lastTransferTo: 'A区'
        },
        salary: {
          monthlySalary: '5500元',
          lastSalaryDate: '2026-02-15',
          salaryHistory: 12
        },
        claim: {
          count: 0,
          lastClaimDate: null,
          lastClaimAmount: null
        }
      },
      
      jobIntent: {
        positionCategory: '普工',
        workLocation: '广东省深圳市南山区',
        salaryExpectation: '5000-6000元/月',
        availableDate: '随时'
      },
      
      emergencyContact: {
        name: '李四',
        relation: '配偶',
        phone: '139****9999'
      },
      
      bankInfo: {
        bankName: '中国工商银行',
        bankCard: '6222021234567890123',
        accountName: '张三'
      },
      
      skills: '熟练操作流水线设备，具备基础质检能力',
      certificates: [
        {
          name: '身份证',
          validDate: '长期有效'
        },
        {
          name: '健康证',
          validDate: '2025-12-31'
        }
      ],
      
      healthInfo: {
        healthStatus: '健康',
        height: '175cm',
        weight: '68kg',
        specialNotes: '右腿有钢板植入（2019年车祸），查看医疗证明',
        allergies: '无'
      },
      
      experience: '2015-2017年在郑州某超市担任理货员，2017-2019年在广州某餐厅担任服务员，2019-2022年在深圳某电子厂担任操作工。',
      
      workHistory: [
        {
          startDate: '2023.01',
          endDate: '至今',
          laborCompany: '南通富民劳务服务有限公司',
          factory: '富士康科技集团',
          position: '操作工'
        },
        {
          startDate: '2020.03',
          endDate: '2022.12',
          laborCompany: '深圳诚信劳务派遣有限公司',
          factory: '华为技术有限公司',
          position: '质检员'
        }
      ],
      
      lifecycleStatus: 'entered',
      paymentType: '月结'
    }
  } catch (error) {
    console.error('获取工人信息失败:', error)
  } finally {
    loading.value = false
  }
}

watch(() => props.visible, (newVal) => {
  if (newVal) {
    fetchWorkerInfo()
  }
})

watch(() => [props.workerName, props.phone, props.workerId], () => {
  if (props.visible) {
    fetchWorkerInfo()
  }
})

const close = () => {
  emit('update:visible', false)
}
</script>

<style scoped>
.sidebar-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1999;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
}

.sidebar-overlay.visible {
  opacity: 1;
  visibility: visible;
}

.worker-info-sidebar {
  position: fixed;
  top: 0;
  right: 0;
  width: 480px;
  height: 100vh;
  background-color: #fff;
  box-shadow: -4px 0 20px rgba(0, 0, 0, 0.15);
  z-index: 2000;
  transform: translateX(100%);
  transition: transform 0.3s ease;
  display: flex;
  flex-direction: column;
}

.worker-info-sidebar.open {
  transform: translateX(0);
}

.sidebar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #e4e7ed;
  background-color: #fff;
}

.sidebar-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #303133;
}

.close-button {
  font-size: 20px;
  color: #909399;
  padding: 4px;
}

.close-button:hover {
  color: #409eff;
}

.sidebar-content {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
}

.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 0;
  color: #909399;
}

.loading .el-icon {
  font-size: 32px;
  margin-bottom: 12px;
}

.no-data {
  padding: 60px 0;
}

.worker-details {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.info-section {
  background-color: #fff;
  border-radius: 8px;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0 0 12px 0;
  font-size: 15px;
  font-weight: 600;
  color: #303133;
  padding-bottom: 8px;
  border-bottom: 1px solid #e4e7ed;
}

.section-title .el-icon {
  color: #409eff;
}

/* 头部信息样式 */
.worker-header {
  display: flex;
  gap: 16px;
  padding: 16px;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e7ed 100%);
  border-radius: 8px;
}

.id-photo {
  width: 80px;
  height: 100px;
  border-radius: 8px;
  overflow: hidden;
  flex-shrink: 0;
}

.id-photo .el-image {
  width: 100%;
  height: 100%;
}

.header-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.worker-name {
  margin: 0 0 8px 0;
  font-size: 20px;
  font-weight: 600;
  color: #303133;
}

.worker-tags {
  display: flex;
  gap: 8px;
  margin-bottom: 8px;
}

.basic-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tag-item {
  font-size: 12px;
  color: #606266;
  background-color: #f0f2f5;
  padding: 2px 8px;
  border-radius: 4px;
}

/* 生活照片 */
.life-photos-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
}

.life-photo-item {
  aspect-ratio: 1;
  border-radius: 6px;
  overflow: hidden;
  cursor: pointer;
}

.life-photo-item .el-image {
  width: 100%;
  height: 100%;
}

.image-error {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f5f7fa;
  color: #c0c4cc;
  font-size: 24px;
}

/* 教育卡片 */
.education-card {
  margin-bottom: 12px;
}

.education-card:last-child {
  margin-bottom: 0;
}

/* 子信息区域 */
.sub-info {
  margin-top: 12px;
}

.sub-info h5 {
  margin: 0 0 8px 0;
  font-size: 13px;
  font-weight: 500;
  color: #606266;
}

/* 技能与证书 */
.skills-info {
  margin-bottom: 12px;
}

.skill-label,
.certificate-label {
  font-size: 13px;
  color: #606266;
  margin-bottom: 8px;
}

.skill-content {
  font-size: 14px;
  color: #303133;
  line-height: 1.6;
}

.certificates-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

/* 个人经历 */
.experience-content {
  font-size: 14px;
  color: #303133;
  line-height: 1.8;
  padding: 12px;
  background-color: #f5f7fa;
  border-radius: 6px;
  margin-bottom: 16px;
}

.work-history {
  margin-top: 16px;
}

.history-label {
  font-size: 13px;
  color: #606266;
  margin-bottom: 12px;
}

.work-history .el-card {
  margin-bottom: 8px;
}

.work-history h5 {
  margin: 0 0 4px 0;
  font-size: 14px;
  font-weight: 500;
}

.work-history p {
  margin: 0;
  font-size: 13px;
  color: #606266;
}

/* 滚动条样式 */
.sidebar-content::-webkit-scrollbar {
  width: 6px;
}

.sidebar-content::-webkit-scrollbar-track {
  background: #f5f7fa;
}

.sidebar-content::-webkit-scrollbar-thumb {
  background: #c0c4cc;
  border-radius: 3px;
}

.sidebar-content::-webkit-scrollbar-thumb:hover {
  background: #909399;
}

/* 响应式 */
@media screen and (max-width: 768px) {
  .worker-info-sidebar {
    width: 100%;
  }
  
  .life-photos-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
</style>
