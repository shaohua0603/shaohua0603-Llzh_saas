<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { ArrowLeft, Edit, SwitchButton, User, OfficeBuilding, Phone, Calendar, Document, Location, School, Briefcase, CreditCard, Star, Warning, Timer, ZoomIn } from '@element-plus/icons-vue'

const router = useRouter()
const route = useRoute()

// 工人ID
const workerId = computed(() => route.params.id as string)

// 加载状态
const loading = ref(true)

// 工人信息
const workerInfo = ref<any>(null)

// 信息分组展开状态
const collapsedSections = ref<Record<string, boolean>>({
  basicInfo: false,
  education: false,
  workInfo: false,
  jobIntent: false,
  emergencyContact: false,
  bankInfo: false,
  skills: false,
  health: false,
  experience: false
})

// 右侧展开面板状态
const rightPanelVisible = ref(false)
const rightPanelContent = ref<string>('')
const rightPanelTitle = ref<string>('')

// 打开右侧面板
const openRightPanel = (content: string, title: string) => {
  rightPanelContent.value = content
  rightPanelTitle.value = title
  rightPanelVisible.value = true
}

// 关闭右侧面板
const closeRightPanel = () => {
  rightPanelVisible.value = false
  rightPanelContent.value = ''
  rightPanelTitle.value = ''
}

// 切换分组展开/收起
const toggleSection = (section: string) => {
  collapsedSections.value[section] = !collapsedSections.value[section]
}

// 获取工人生命周期状态
const getLifecycleStatus = () => {
  if (!workerInfo.value) return { text: '未知', type: 'info' }
  
  const statusMap: Record<string, { text: string; type: string }> = {
    'registered': { text: '注册', type: 'info' },
    'pickup': { text: '接送', type: 'warning' },
    'labor_company_staff': { text: '劳务运维人员', type: 'primary' },
    'factory_staff': { text: '工厂正式人员', type: 'primary' },
    'initial_interview': { text: '初次面试', type: 'warning' },
    'contract_signed': { text: '合同签订', type: 'success' },
    'interview_invited': { text: '面试邀约', type: 'warning' },
    'factory_interview': { text: '工厂面试', type: 'warning' },
    'entered': { text: '进厂', type: 'success' },
    'resigned': { text: '离职', type: 'danger' }
  }
  
  return statusMap[workerInfo.value.lifecycleStatus] || { text: '未知', type: 'info' }
}

// 返回列表
const goBack = () => {
  router.back()
}

// 编辑信息
const handleEdit = () => {
  router.push(`/labor-company/workers/${workerId.value}/edit`)
}

// 岗位调动
const handleTransfer = () => {
  router.push(`/labor-company/workers/${workerId.value}/transfer`)
}

// 获取工人详细信息
const fetchWorkerDetail = async () => {
  loading.value = true
  try {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // 模拟工人数据
    workerInfo.value = {
      id: workerId.value,
      workerId: 'EMP001',
      name: '张三',
      gender: '男',
      age: 34,
      phone: '138****8001',
      idCard: '410101199005151234',
      ethnicity: '汉族',
      maritalStatus: '已婚',
      politicalStatus: '群众',
      nativePlace: '河南省郑州市中原区',
      currentAddress: '广东省深圳市南山区科技园南区高新南一道',
      highestEducation: '高中',
      birthDate: '1990-05-15',
      
      // 证件照片
      idPhoto: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20ID%20photo%20of%20a%20Chinese%20male%20worker%20with%20plain%20white%20background%2C%20passport%20style%2C%20front%20view%2C%20clear%20features%2C%20formal%20clothing&image_size=square',
      
      // 生活照片
      lifePhotos: [
        'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Chinese%20male%20worker%20in%20casual%20clothes%20outdoor%20in%20park%2C%20natural%20smile%2C%20sunny%20day%2C%20realistic%20photo&image_size=square',
        'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Chinese%20male%20worker%20with%20friends%20at%20restaurant%2C%20casual%20wear%2C%20enjoying%20meal%2C%20natural%20lighting%2C%20realistic%20photo&image_size=square',
        'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Chinese%20male%20worker%20playing%20basketball%20outdoor%2C%20sportswear%2C%20active%20pose%2C%20daytime%2C%20realistic%20photo&image_size=square',
        'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Chinese%20male%20worker%20traveling%20at%20scenic%20spot%2C%20casual%20outfit%2C%20background%20with%20mountains%2C%20natural%20light%2C%20realistic%20photo&image_size=square'
      ],
      
      // 工厂信息
      factoryName: '富士康科技集团',
      factoryArea: 'A区',
      productionLine: '智能手机组装',
      positionType: '普工',
      positionName: '操作工',
      laborCompany: '南通富民劳务服务有限公司',
      
      // 初步面试信息
      initialInterview: {
        recommendationLevel: '优先推荐',
        imageLevel: '优秀',
        recommendationReason: '该工人工作经验丰富，技能熟练，表现良好，推荐优先录用。'
      },
      
      // 教育背景
      education: [
        {
          degree: '高中',
          school: '郑州市第一高级中学',
          major: '文科',
          graduationDate: '2008-06',
          certificate: '毕业证书'
        }
      ],
      
      // 当前工作情况
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
      
      // 求职意向
      jobIntent: {
        positionCategory: '普工',
        workLocation: '广东省深圳市南山区',
        salaryExpectation: '5000-6000元/月',
        availableDate: '随时'
      },
      
      // 紧急联系方式
      emergencyContact: {
        name: '李四',
        relation: '配偶',
        phone: '139****9999'
      },
      
      // 银行卡信息
      bankInfo: {
        bankName: '中国工商银行',
        bankCard: '6222021234567890123',
        accountName: '张三'
      },
      
      // 技能与证书
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
      
      // 特殊情况与健康状况
      healthInfo: {
        healthStatus: '健康',
        height: '175cm',
        weight: '68kg',
        specialNotes: '右腿有钢板植入（2019年车祸），查看医疗证明',
        allergies: '无'
      },
      
      // 个人经历
      experience: '2015-2017年在郑州某超市担任理货员，2017-2019年在广州某餐厅担任服务员，2019-2022年在深圳某电子厂担任操作工。',
      
      // 工作履历
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
      
      // 生命周期状态
      lifecycleStatus: 'entered'
    }
  } catch (error) {
    console.error('获取工人详情失败:', error)
    ElMessage.error('获取工人详情失败')
  } finally {
    loading.value = false
  }
}

// 页面加载时获取数据
onMounted(() => {
  fetchWorkerDetail()
})
</script>

<template>
  <div class="worker-detail">


    <!-- 加载状态 -->
    <div v-if="loading" class="loading-container">
      <el-skeleton :rows="10" animated />
    </div>

    <!-- 工人信息内容 -->
    <div v-else-if="workerInfo" class="detail-content">
      <!-- 顶部信息卡片 -->
      <div class="info-card">
        <div class="card-header">
          <div class="worker-basic-info">
            <!-- 证件照片 -->
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
            
            <!-- 基本信息 -->
            <div class="basic-info">
              <div class="info-row">
                <h3 class="worker-name">{{ workerInfo.name }}</h3>
                <el-tag :type="getLifecycleStatus().type" size="large">
                  {{ getLifecycleStatus().text }}
                </el-tag>
              </div>
              <div class="info-grid">
                <div class="info-item">
                  <span class="label">工号</span>
                  <span class="value">{{ workerInfo.workerId }}</span>
                </div>
                <div class="info-item">
                  <span class="label">手机号</span>
                  <span class="value">{{ workerInfo.phone }}</span>
                </div>
                <div class="info-item">
                  <span class="label">性别/年龄</span>
                  <span class="value">{{ workerInfo.gender }} / {{ workerInfo.age }}岁</span>
                </div>
                <div class="info-item">
                  <span class="label">工厂名称</span>
                  <span class="value">{{ workerInfo.factoryName }}</span>
                </div>
                <div class="info-item">
                  <span class="label">工作区域</span>
                  <span class="value">{{ workerInfo.factoryArea }} | {{ workerInfo.productionLine }}</span>
                </div>
                <div class="info-item">
                  <span class="label">岗位信息</span>
                  <span class="value">{{ workerInfo.positionType }} | {{ workerInfo.positionName }}</span>
                </div>
                <div class="info-item">
                  <span class="label">劳务公司</span>
                  <span class="value">{{ workerInfo.laborCompany }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 生活照片 -->
      <div class="info-section">
        <div class="section-header" @click="toggleSection('lifePhotos')">
          <h3 class="section-title">
            <el-icon><ZoomIn /></el-icon>
            生活照片
          </h3>
          <el-icon class="collapse-icon" :class="{ 'collapsed': collapsedSections.lifePhotos }">
            <ArrowLeft />
          </el-icon>
        </div>
        <div v-show="!collapsedSections.lifePhotos" class="section-content">
          <div class="life-photos-grid">
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
                    <el-icon><ZoomIn /></el-icon>
                  </div>
                </template>
              </el-image>
            </div>
          </div>
        </div>
      </div>

      <!-- 个人基本信息 -->
      <div class="info-section">
        <div class="section-header" @click="toggleSection('basicInfo')">
          <h3 class="section-title">
            <el-icon><User /></el-icon>
            个人基本信息
          </h3>
          <el-icon class="collapse-icon" :class="{ 'collapsed': collapsedSections.basicInfo }">
            <ArrowLeft />
          </el-icon>
        </div>
        <div v-show="!collapsedSections.basicInfo" class="section-content">
          <div class="info-grid">
            <div class="info-item">
              <span class="label">工号</span>
              <span class="value">{{ workerInfo.workerId }}</span>
            </div>
            <div class="info-item">
              <span class="label">姓名</span>
              <span class="value">{{ workerInfo.name }}</span>
            </div>
            <div class="info-item">
              <span class="label">性别</span>
              <span class="value">{{ workerInfo.gender }}</span>
            </div>
            <div class="info-item">
              <span class="label">年龄</span>
              <span class="value">{{ workerInfo.age }}</span>
            </div>
            <div class="info-item">
              <span class="label">手机号</span>
              <span class="value">{{ workerInfo.phone }}</span>
            </div>
            <div class="info-item full-width">
              <span class="label">身份证号</span>
              <span class="value">{{ workerInfo.idCard }}</span>
            </div>
            <div class="info-item">
              <span class="label">民族</span>
              <span class="value">{{ workerInfo.ethnicity }}</span>
            </div>
            <div class="info-item">
              <span class="label">婚姻状况</span>
              <span class="value">{{ workerInfo.maritalStatus }}</span>
            </div>
            <div class="info-item">
              <span class="label">政治面貌</span>
              <span class="value">{{ workerInfo.politicalStatus }}</span>
            </div>
            <div class="info-item">
              <span class="label">文化程度</span>
              <span class="value">{{ workerInfo.highestEducation }}</span>
            </div>
            <div class="info-item">
              <span class="label">出生日期</span>
              <span class="value">{{ workerInfo.birthDate }}</span>
            </div>
            <div class="info-item full-width">
              <span class="label">籍贯</span>
              <span class="value">{{ workerInfo.nativePlace }}</span>
            </div>
            <div class="info-item full-width">
              <span class="label">现居住地</span>
              <span class="value">{{ workerInfo.currentAddress }}</span>
            </div>
          </div>
        </div>
      </div>



      <!-- 教育背景 -->
      <div class="info-section">
        <div class="section-header" @click="toggleSection('education')">
          <h3 class="section-title">
            <el-icon><School /></el-icon>
            教育背景
          </h3>
          <el-icon class="collapse-icon" :class="{ 'collapsed': collapsedSections.education }">
            <ArrowLeft />
          </el-icon>
        </div>
        <div v-show="!collapsedSections.education" class="section-content">
          <div v-for="(edu, index) in workerInfo.education" :key="index" class="education-item">
            <div class="education-header">
              <span class="degree">{{ edu.degree }}</span>
              <span class="graduation-date">{{ edu.graduationDate }}</span>
            </div>
            <div class="education-details">
              <p class="school">{{ edu.school }}</p>
              <p class="major">专业：{{ edu.major }}</p>
              <p class="certificate">学历证书：{{ edu.certificate }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- 当前工作情况 -->
      <div class="info-section">
        <div class="section-header" @click="toggleSection('workInfo')">
          <h3 class="section-title">
            <el-icon><Briefcase /></el-icon>
            当前工作情况
          </h3>
          <el-icon class="collapse-icon" :class="{ 'collapsed': collapsedSections.workInfo }">
            <ArrowLeft />
          </el-icon>
        </div>
        <div v-show="!collapsedSections.workInfo" class="section-content">
          <div class="info-grid">
            <div class="info-item">
              <span class="label">当前状态</span>
              <el-tag type="success">{{ workerInfo.workInfo.status }}</el-tag>
            </div>
            <div class="info-item">
              <span class="label">入职时间</span>
              <span class="value">{{ workerInfo.workInfo.entryDate }}</span>
            </div>
            <div class="info-item">
              <span class="label">工作年限</span>
              <span class="value">{{ workerInfo.workInfo.workYears }}</span>
            </div>
            <div class="info-item">
              <span class="label">累计工作天数</span>
              <span class="value">{{ workerInfo.workInfo.workDays }}天</span>
            </div>
            <div class="info-item">
              <span class="label">部门</span>
              <span class="value">{{ workerInfo.workInfo.department }}</span>
            </div>
            <div class="info-item">
              <span class="label">组别</span>
              <span class="value">{{ workerInfo.workInfo.group }}</span>
            </div>
            <div class="info-item full-width">
              <span class="label">岗位领导</span>
              <span class="value">{{ workerInfo.workInfo.supervisor }}</span>
            </div>
          </div>
          
          <!-- 初步面试信息 -->
          <div class="initial-interview-info">
            <h4 class="section-subtitle">初步面试信息</h4>
            <div class="info-grid">
              <div class="info-item">
                <span class="label">推荐等级</span>
                <el-tag type="success">{{ workerInfo.initialInterview.recommendationLevel }}</el-tag>
              </div>
              <div class="info-item">
                <span class="label">形象级别</span>
                <el-tag type="primary">{{ workerInfo.initialInterview.imageLevel }}</el-tag>
              </div>
              <div class="info-item full-width">
                <span class="label">推荐理由</span>
                <span class="value">{{ workerInfo.initialInterview.recommendationReason }}</span>
              </div>
            </div>
          </div>
          
          <!-- 工作相关信息入口 -->
          <div class="work-related-entries">
            <h4 class="entries-title">工作相关信息</h4>
            <div class="entries-grid">
              <div class="entry-item" @click="openRightPanel('attendance', '假勤情况')">
                <div class="entry-icon">
                  <el-icon><Timer /></el-icon>
                </div>
                <div class="entry-content">
                  <div class="entry-title">假勤情况</div>
                  <div class="entry-subtitle">查看假勤记录</div>
                </div>
                <div class="entry-arrow">
                  <el-icon><ArrowLeft /></el-icon>
                </div>
              </div>
              <div class="entry-item" @click="openRightPanel('transfer', '调岗情况')">
                <div class="entry-icon">
                  <el-icon><SwitchButton /></el-icon>
                </div>
                <div class="entry-content">
                  <div class="entry-title">调岗情况</div>
                  <div class="entry-subtitle">查看调岗记录</div>
                </div>
                <div class="entry-arrow">
                  <el-icon><ArrowLeft /></el-icon>
                </div>
              </div>
              <div class="entry-item" @click="openRightPanel('salary', '工资条')">
                <div class="entry-icon">
                  <el-icon><CreditCard /></el-icon>
                </div>
                <div class="entry-content">
                  <div class="entry-title">工资条</div>
                  <div class="entry-subtitle">查看工资记录</div>
                </div>
                <div class="entry-arrow">
                  <el-icon><ArrowLeft /></el-icon>
                </div>
              </div>
              <div class="entry-item" @click="openRightPanel('claim', '理赔情况')">
                <div class="entry-icon">
                  <el-icon><Warning /></el-icon>
                </div>
                <div class="entry-content">
                  <div class="entry-title">理赔情况</div>
                  <div class="entry-subtitle">查看理赔记录</div>
                </div>
                <div class="entry-arrow">
                  <el-icon><ArrowLeft /></el-icon>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 求职意向 -->
      <div class="info-section">
        <div class="section-header" @click="toggleSection('jobIntent')">
          <h3 class="section-title">
            <el-icon><Star /></el-icon>
            求职意向
          </h3>
          <el-icon class="collapse-icon" :class="{ 'collapsed': collapsedSections.jobIntent }">
            <ArrowLeft />
          </el-icon>
        </div>
        <div v-show="!collapsedSections.jobIntent" class="section-content">
          <div class="info-grid">
            <div class="info-item">
              <span class="label">期望岗位类别</span>
              <span class="value">{{ workerInfo.jobIntent.positionCategory }}</span>
            </div>
            <div class="info-item">
              <span class="label">期望工作地点</span>
              <span class="value">{{ workerInfo.jobIntent.workLocation }}</span>
            </div>
            <div class="info-item">
              <span class="label">期望薪资范围</span>
              <span class="value">{{ workerInfo.jobIntent.salaryExpectation }}</span>
            </div>
            <div class="info-item">
              <span class="label">可到岗时间</span>
              <span class="value">{{ workerInfo.jobIntent.availableDate }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 紧急联系方式 -->
      <div class="info-section">
        <div class="section-header" @click="toggleSection('emergencyContact')">
          <h3 class="section-title">
            <el-icon><Phone /></el-icon>
            紧急联系方式
          </h3>
          <el-icon class="collapse-icon" :class="{ 'collapsed': collapsedSections.emergencyContact }">
            <ArrowLeft />
          </el-icon>
        </div>
        <div v-show="!collapsedSections.emergencyContact" class="section-content">
          <div class="info-grid">
            <div class="info-item">
              <span class="label">紧急联系人</span>
              <span class="value">{{ workerInfo.emergencyContact.name }}</span>
            </div>
            <div class="info-item">
              <span class="label">关系</span>
              <span class="value">{{ workerInfo.emergencyContact.relation }}</span>
            </div>
            <div class="info-item full-width">
              <span class="label">联系电话</span>
              <span class="value">{{ workerInfo.emergencyContact.phone }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 工资发放银行卡信息 -->
      <div class="info-section">
        <div class="section-header" @click="toggleSection('bankInfo')">
          <h3 class="section-title">
            <el-icon><CreditCard /></el-icon>
            工资发放银行卡信息
          </h3>
          <el-icon class="collapse-icon" :class="{ 'collapsed': collapsedSections.bankInfo }">
            <ArrowLeft />
          </el-icon>
        </div>
        <div v-show="!collapsedSections.bankInfo" class="section-content">
          <div class="info-grid">
            <div class="info-item">
              <span class="label">开户银行</span>
              <span class="value">{{ workerInfo.bankInfo.bankName }}</span>
            </div>
            <div class="info-item">
              <span class="label">开户人姓名</span>
              <span class="value">{{ workerInfo.bankInfo.accountName }}</span>
            </div>
            <div class="info-item full-width">
              <span class="label">银行卡号</span>
              <span class="value">{{ workerInfo.bankInfo.bankCard }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 技能与证书 -->
      <div class="info-section">
        <div class="section-header" @click="toggleSection('skills')">
          <h3 class="section-title">
            <el-icon><Star /></el-icon>
            技能与证书
          </h3>
          <el-icon class="collapse-icon" :class="{ 'collapsed': collapsedSections.skills }">
            <ArrowLeft />
          </el-icon>
        </div>
        <div v-show="!collapsedSections.skills" class="section-content">
          <div class="skills-section">
            <div class="info-item full-width">
              <span class="label">技能特长</span>
              <span class="value">{{ workerInfo.skills }}</span>
            </div>
            <div class="certificates-list">
              <h4 class="certificates-title">持有证书</h4>
              <div v-for="(cert, index) in workerInfo.certificates" :key="index" class="certificate-item">
                <span class="certificate-name">{{ cert.name }}</span>
                <span class="certificate-date">有效期：{{ cert.validDate }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 特殊情况与健康状况 -->
      <div class="info-section">
        <div class="section-header" @click="toggleSection('health')">
          <h3 class="section-title">
            <el-icon><Warning /></el-icon>
            特殊情况与健康状况
          </h3>
          <el-icon class="collapse-icon" :class="{ 'collapsed': collapsedSections.health }">
            <ArrowLeft />
          </el-icon>
        </div>
        <div v-show="!collapsedSections.health" class="section-content">
          <div class="info-grid">
            <div class="info-item">
              <span class="label">健康状况</span>
              <span class="value">{{ workerInfo.healthInfo.healthStatus }}</span>
            </div>
            <div class="info-item">
              <span class="label">身高</span>
              <span class="value">{{ workerInfo.healthInfo.height }}</span>
            </div>
            <div class="info-item">
              <span class="label">体重</span>
              <span class="value">{{ workerInfo.healthInfo.weight }}</span>
            </div>
            <div class="info-item">
              <span class="label">过敏史</span>
              <span class="value">{{ workerInfo.healthInfo.allergies }}</span>
            </div>
            <div class="info-item full-width">
              <span class="label">特殊情况说明</span>
              <span class="value">{{ workerInfo.healthInfo.specialNotes }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 个人经历 -->
      <div class="info-section">
        <div class="section-header" @click="toggleSection('experience')">
          <h3 class="section-title">
            <el-icon><Timer /></el-icon>
            个人经历
          </h3>
          <el-icon class="collapse-icon" :class="{ 'collapsed': collapsedSections.experience }">
            <ArrowLeft />
          </el-icon>
        </div>
        <div v-show="!collapsedSections.experience" class="section-content">
          <div class="experience-content">
            <p class="experience-text">{{ workerInfo.experience }}</p>
          </div>
          
          <!-- 工作履历 -->
          <div class="work-history">
            <h4 class="work-history-title">工作履历</h4>
            <div v-for="(history, index) in workerInfo.workHistory" :key="index" class="work-history-item">
              <div class="work-period">
                <el-icon><Calendar /></el-icon>
                {{ history.startDate }} - {{ history.endDate }}
              </div>
              <div class="work-details">
                <p><span class="label">劳务公司：</span>{{ history.laborCompany }}</p>
                <p><span class="label">工厂：</span>{{ history.factory }}</p>
                <p><span class="label">岗位：</span>{{ history.position }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 底部按钮栏 -->
    <div class="detail-footer">
      <el-button @click="goBack">
        <el-icon><ArrowLeft /></el-icon>
        返回
      </el-button>
      <el-button type="primary" :icon="SwitchButton" @click="handleTransfer">岗位调动</el-button>
      <el-button type="success" :icon="Edit" @click="handleEdit">编辑信息</el-button>
    </div>
    
    <!-- 右侧展开面板 -->
    <div class="right-panel-mask" v-if="rightPanelVisible" @click="closeRightPanel"></div>
    <div class="right-panel" :class="{ 'visible': rightPanelVisible }">
      <div class="right-panel-header">
        <h3 class="panel-title">{{ rightPanelTitle }}</h3>
        <el-icon class="close-icon" @click="closeRightPanel">
          <ArrowLeft />
        </el-icon>
      </div>
      <div class="right-panel-content">
        <!-- 假勤情况 -->
        <div v-if="rightPanelContent === 'attendance'" class="panel-section">
          <div class="info-grid">
            <div class="info-item">
              <span class="label">总工作天数</span>
              <span class="value">{{ workerInfo.workInfo.attendance.totalDays }}天</span>
            </div>
            <div class="info-item">
              <span class="label">缺勤天数</span>
              <span class="value">{{ workerInfo.workInfo.attendance.absentDays }}天</span>
            </div>
            <div class="info-item">
              <span class="label">迟到天数</span>
              <span class="value">{{ workerInfo.workInfo.attendance.lateDays }}天</span>
            </div>
            <div class="info-item">
              <span class="label">病假天数</span>
              <span class="value">{{ workerInfo.workInfo.attendance.sickDays }}天</span>
            </div>
          </div>
          <div class="attendance-history">
            <h4 class="history-title">近期假勤记录</h4>
            <div class="history-list">
              <div class="history-item">
                <div class="history-date">2026-02-10</div>
                <div class="history-type">迟到</div>
                <div class="history-reason">交通堵塞</div>
              </div>
              <div class="history-item">
                <div class="history-date">2026-01-15</div>
                <div class="history-type">病假</div>
                <div class="history-reason">感冒</div>
              </div>
              <div class="history-item">
                <div class="history-date">2025-12-20</div>
                <div class="history-type">缺勤</div>
                <div class="history-reason">个人原因</div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 调岗情况 -->
        <div v-if="rightPanelContent === 'transfer'" class="panel-section">
          <div class="info-grid">
            <div class="info-item">
              <span class="label">调岗次数</span>
              <span class="value">{{ workerInfo.workInfo.transfer.count }}次</span>
            </div>
            <div class="info-item">
              <span class="label">最近调岗时间</span>
              <span class="value">{{ workerInfo.workInfo.transfer.lastTransferDate }}</span>
            </div>
            <div class="info-item">
              <span class="label">调岗前区域</span>
              <span class="value">{{ workerInfo.workInfo.transfer.lastTransferFrom }}</span>
            </div>
            <div class="info-item">
              <span class="label">调岗后区域</span>
              <span class="value">{{ workerInfo.workInfo.transfer.lastTransferTo }}</span>
            </div>
          </div>
          <div class="transfer-history">
            <h4 class="history-title">调岗历史</h4>
            <div class="history-list">
              <div class="history-item">
                <div class="history-date">2023-06-15</div>
                <div class="history-from">B区</div>
                <div class="history-to">A区</div>
                <div class="history-reason">生产需求调整</div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 工资条 -->
        <div v-if="rightPanelContent === 'salary'" class="panel-section">
          <div class="info-grid">
            <div class="info-item">
              <span class="label">月工资</span>
              <span class="value">{{ workerInfo.workInfo.salary.monthlySalary }}</span>
            </div>
            <div class="info-item">
              <span class="label">最近发薪日期</span>
              <span class="value">{{ workerInfo.workInfo.salary.lastSalaryDate }}</span>
            </div>
            <div class="info-item full-width">
              <span class="label">工资历史记录</span>
              <span class="value">{{ workerInfo.workInfo.salary.salaryHistory }}个月</span>
            </div>
          </div>
          <div class="salary-history">
            <h4 class="history-title">最近工资记录</h4>
            <div class="history-list">
              <div class="history-item">
                <div class="history-date">2026-02-15</div>
                <div class="history-amount">5500元</div>
                <div class="history-status">已发放</div>
              </div>
              <div class="history-item">
                <div class="history-date">2026-01-15</div>
                <div class="history-amount">5500元</div>
                <div class="history-status">已发放</div>
              </div>
              <div class="history-item">
                <div class="history-date">2025-12-15</div>
                <div class="history-amount">5500元</div>
                <div class="history-status">已发放</div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 理赔情况 -->
        <div v-if="rightPanelContent === 'claim'" class="panel-section">
          <div class="info-grid">
            <div class="info-item">
              <span class="label">理赔次数</span>
              <span class="value">{{ workerInfo.workInfo.claim.count }}次</span>
            </div>
            <div class="info-item">
              <span class="label">最近理赔日期</span>
              <span class="value">{{ workerInfo.workInfo.claim.lastClaimDate || '无' }}</span>
            </div>
            <div class="info-item full-width">
              <span class="label">最近理赔金额</span>
              <span class="value">{{ workerInfo.workInfo.claim.lastClaimAmount || '无' }}</span>
            </div>
          </div>
          <div v-if="workerInfo.workInfo.claim.count === 0" class="no-data">
            <el-empty description="暂无理赔记录" />
          </div>
          <div v-else class="claim-history">
            <h4 class="history-title">理赔历史</h4>
            <div class="history-list">
              <!-- 理赔记录 -->
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.worker-detail {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: var(--color-bg-page);
  padding: var(--spacing-xl);
  box-sizing: border-box;
}



/* 加载容器 */
.loading-container {
  background: #ffffff;
  padding: var(--spacing-xl);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
}

/* 详情内容 */
.detail-content {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
  padding-top: 20px;
  padding-bottom: 100px;
  overflow-y: auto;
  flex: 1;
  scrollbar-width: thin;
  scrollbar-color: var(--color-primary-light) var(--color-bg-page);
}

.detail-content::-webkit-scrollbar {
  width: 8px;
}

.detail-content::-webkit-scrollbar-track {
  background: var(--color-bg-page);
  border-radius: 4px;
}

.detail-content::-webkit-scrollbar-thumb {
  background-color: var(--color-primary-light);
  border-radius: 4px;
}

.detail-content::-webkit-scrollbar-thumb:hover {
  background-color: var(--color-primary);
}

/* 信息卡片 */
.info-card {
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  overflow: hidden;
}

.card-header {
  padding: var(--spacing-xl);
}

.worker-basic-info {
  display: flex;
  gap: var(--spacing-xl);
  align-items: flex-start;
}

/* 证件照片 */
.id-photo {
  flex-shrink: 0;
  width: 120px;
  height: 150px;
  border-radius: var(--radius-md);
  overflow: hidden;
  box-shadow: var(--shadow-md);
  border: 3px solid var(--color-primary-light);
}

.id-photo :deep(.el-image) {
  width: 100%;
  height: 100%;
}

.id-photo :deep(.el-image__inner) {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.image-error {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--color-bg-page);
  color: var(--color-text-placeholder);
}

.image-error :deep(.el-icon) {
  font-size: 48px;
}

/* 基本信息 */
.basic-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.info-row {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  flex-wrap: wrap;
}

.worker-name {
  margin: 0;
  font-size: var(--font-size-x-large);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary);
}

/* 顶部卡片中的信息网格 */
.basic-info .info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--spacing-md);
  width: 100%;
}

.basic-info .info-item {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
  font-size: var(--font-size-base);
  color: var(--color-text-regular);
}

.basic-info .info-item .label {
  font-size: var(--font-size-small);
  color: var(--color-text-secondary);
  font-weight: var(--font-weight-medium);
}

.basic-info .info-item .value {
  font-size: var(--font-size-base);
  color: var(--color-text-primary);
  font-weight: var(--font-weight-medium);
}

.info-item :deep(.el-icon) {
  color: var(--color-primary);
  font-size: 16px;
}

/* 信息分组 */
.info-section {
  background: #ffffff;
  border-radius: var(--radius-lg);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  transition: all var(--transition-base);
  border: 1px solid #f0f0f0;
}

.info-section:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-lg) var(--spacing-xl);
  cursor: pointer;
  border-bottom: 1px solid #f0f0f0;
  transition: all var(--transition-fast);
  background-color: #f9fafb;
}

.section-header:hover {
  background-color: #f3f4f6;
}

.section-title {
  margin: 0;
  font-size: var(--font-size-large);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary);
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.section-title :deep(.el-icon) {
  color: var(--color-primary);
  font-size: 20px;
}

.collapse-icon {
  transition: transform var(--transition-base);
  color: var(--color-text-secondary);
  font-size: 18px;
}

.collapse-icon.collapsed {
  transform: rotate(-90deg);
}

.section-content {
  padding: var(--spacing-xl);
  background-color: #ffffff;
}

/* 信息网格 */
.info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--spacing-lg);
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
  padding: var(--spacing-md);
  background-color: #f9fafb;
  border-radius: var(--radius-md);
  border: 1px solid #f0f0f0;
  transition: all var(--transition-fast);
}

.info-item:hover {
  background-color: #f3f4f6;
  border-color: var(--color-primary-light);
}

.info-item.full-width {
  grid-column: 1 / -1;
}

.info-item .label {
  font-size: var(--font-size-small);
  color: var(--color-text-secondary);
  font-weight: var(--font-weight-medium);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.info-item .value {
  font-size: var(--font-size-base);
  color: var(--color-text-primary);
  font-weight: var(--font-weight-medium);
  line-height: 1.4;
}

/* 生活照片 */
.life-photos-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: var(--spacing-lg);
}

.life-photo-item {
  aspect-ratio: 1;
  border-radius: var(--radius-lg);
  overflow: hidden;
  box-shadow: var(--shadow-sm);
  transition: all var(--transition-fast);
  cursor: pointer;
  border: 2px solid #f0f0f0;
}

.life-photo-item:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  border-color: var(--color-primary-light);
}

.life-photo-item :deep(.el-image) {
  width: 100%;
  height: 100%;
}

.life-photo-item :deep(.el-image__inner) {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* 教育背景 */
.education-item {
  padding: var(--spacing-lg);
  background-color: var(--color-bg-page);
  border-radius: var(--radius-md);
  border-left: 4px solid var(--color-primary);
  margin-bottom: var(--spacing-md);
}

.education-item:last-child {
  margin-bottom: 0;
}

.education-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-md);
}

.education-header .degree {
  font-size: var(--font-size-large);
  font-weight: var(--font-weight-bold);
  color: var(--color-primary);
}

.education-header .graduation-date {
  font-size: var(--font-size-small);
  color: var(--color-text-secondary);
}

.education-details p {
  margin: 0 0 var(--spacing-xs) 0;
  font-size: var(--font-size-base);
  color: var(--color-text-regular);
}

.education-details .school {
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary);
}

/* 技能与证书 */
.skills-section {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.certificates-list {
  padding: var(--spacing-lg);
  background-color: var(--color-bg-page);
  border-radius: var(--radius-md);
}

.certificates-title {
  margin: 0 0 var(--spacing-md) 0;
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary);
}

.certificate-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-md) 0;
  border-bottom: 1px solid var(--color-border-lighter);
}

.certificate-item:last-child {
  border-bottom: none;
}

.certificate-name {
  font-size: var(--font-size-base);
  color: var(--color-text-primary);
  font-weight: var(--font-weight-medium);
}

.certificate-date {
  font-size: var(--font-size-small);
  color: var(--color-text-secondary);
}

/* 个人经历 */
.experience-content {
  padding: var(--spacing-lg);
  background-color: var(--color-bg-page);
  border-radius: var(--radius-md);
  margin-bottom: var(--spacing-lg);
}

.experience-text {
  margin: 0;
  font-size: var(--font-size-base);
  color: var(--color-text-regular);
  line-height: var(--line-height-large);
}

/* 工作履历 */
.work-history {
  padding: var(--spacing-lg);
  background-color: var(--color-bg-page);
  border-radius: var(--radius-md);
}

.work-history-title {
  margin: 0 0 var(--spacing-lg) 0;
  font-size: var(--font-size-large);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary);
}

.work-history-item {
  padding: var(--spacing-lg);
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
  border-radius: var(--radius-md);
  margin-bottom: var(--spacing-md);
  border-left: 4px solid var(--color-primary);
}

.work-history-item:last-child {
  margin-bottom: 0;
}

.work-period {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-bold);
  color: var(--color-primary);
  margin-bottom: var(--spacing-md);
}

.work-period :deep(.el-icon) {
  font-size: 16px;
}

.work-details p {
  margin: 0 0 var(--spacing-xs) 0;
  font-size: var(--font-size-base);
  color: var(--color-text-regular);
}

.work-details .label {
  font-weight: var(--font-weight-medium);
  color: var(--color-text-secondary);
}

/* 响应式设计 */
@media screen and (max-width: 768px) {
  .worker-detail {
    padding: var(--spacing-md);
  }

  .detail-header {
    flex-direction: column;
    gap: var(--spacing-md);
    align-items: flex-start;
  }

  .header-right {
    width: 100%;
    display: flex;
    flex-direction: column;
  }

  .header-right .el-button {
    width: 100%;
  }

  .worker-basic-info {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .info-grid {
    grid-template-columns: 1fr;
  }

  .life-photos-grid {
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  }

  .info-row {
    justify-content: center;
  }
}

@media screen and (max-width: 480px) {
  .worker-detail {
    padding: var(--spacing-sm);
  }

  .id-photo {
    width: 100px;
    height: 125px;
  }

  .worker-name {
    font-size: var(--font-size-large);
  }

  .section-title {
    font-size: var(--font-size-base);
  }

  .life-photos-grid {
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
    gap: var(--spacing-sm);
  }
}

/* 初步面试信息 */
.initial-interview-info {
  margin-top: var(--spacing-xl);
  padding-top: var(--spacing-xl);
  border-top: 1px solid var(--color-border-lighter);
}

.section-subtitle {
  margin: 0 0 var(--spacing-lg) 0;
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary);
}

/* 工作相关信息入口 */
.work-related-entries {
  margin-top: var(--spacing-xl);
  padding-top: var(--spacing-xl);
  border-top: 1px solid var(--color-border-lighter);
}

.entries-title {
  margin: 0 0 var(--spacing-lg) 0;
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary);
}

.entries-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: var(--spacing-lg);
}

.entry-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-lg);
  background-color: #f9fafb;
  border-radius: var(--radius-md);
  border: 1px solid #f0f0f0;
  transition: all var(--transition-fast);
  cursor: pointer;
}

.entry-item:hover {
  background-color: #f3f4f6;
  border-color: var(--color-primary-light);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.entry-icon {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background-color: var(--color-primary-light);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.entry-icon :deep(.el-icon) {
  font-size: 20px;
  color: var(--color-primary);
}

.entry-content {
  flex: 1;
}

.entry-title {
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-xs);
}

.entry-subtitle {
  font-size: var(--font-size-small);
  color: var(--color-text-secondary);
}

.entry-arrow {
  flex-shrink: 0;
}

.entry-arrow :deep(.el-icon) {
  font-size: 16px;
  color: var(--color-text-secondary);
  transition: transform var(--transition-base);
}

.entry-item:hover .entry-arrow :deep(.el-icon) {
  transform: translateX(4px);
  color: var(--color-primary);
}

/* 右侧展开面板 */
.right-panel-mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 9998;
  transition: opacity var(--transition-base);
}

.right-panel {
  position: fixed;
  top: 0;
  right: -400px;
  width: 400px;
  height: 100vh;
  background-color: #ffffff;
  box-shadow: -4px 0 12px rgba(0, 0, 0, 0.15);
  z-index: 9999;
  transition: right var(--transition-base);
  display: flex;
  flex-direction: column;
}

.right-panel.visible {
  right: 0;
}

.right-panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-lg) var(--spacing-xl);
  border-bottom: 1px solid #f0f0f0;
  background-color: #f9fafb;
}

.panel-title {
  margin: 0;
  font-size: var(--font-size-large);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary);
}

.close-icon {
  font-size: 20px;
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.close-icon:hover {
  color: var(--color-text-primary);
  transform: rotate(90deg);
}

.right-panel-content {
  flex: 1;
  padding: var(--spacing-xl);
  overflow-y: auto;
}

.panel-section {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

/* 历史记录样式 */
.attendance-history,
.transfer-history,
.salary-history,
.claim-history {
  margin-top: var(--spacing-lg);
}

.history-title {
  margin: 0 0 var(--spacing-md) 0;
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary);
}

.history-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.history-item {
  padding: var(--spacing-md);
  background-color: #f9fafb;
  border-radius: var(--radius-md);
  border: 1px solid #f0f0f0;
  transition: all var(--transition-fast);
}

.history-item:hover {
  background-color: #f3f4f6;
  border-color: var(--color-primary-light);
}

.history-date {
  font-size: var(--font-size-small);
  color: var(--color-text-secondary);
  margin-bottom: var(--spacing-xs);
}

.history-type,
.history-from,
.history-to,
.history-amount,
.history-status {
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-xs);
}

.history-reason {
  font-size: var(--font-size-small);
  color: var(--color-text-regular);
}

/* 无数据状态 */
.no-data {
  padding: var(--spacing-xl);
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 底部按钮栏 */
.detail-footer {
  position: fixed;
  bottom: 0;
  left: var(--sidebar-width);
  right: 0;
  display: flex;
  justify-content: center;
  gap: 16px;
  padding: 20px;
  background-color: #ffffff;
  border-top: 1px solid #e4e7ed;
  z-index: 100;
  transition: left var(--transition-base);
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.05);
}

.detail-footer .el-button {
  min-width: 120px;
  padding: 10px 20px;
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-medium);
}

.detail-footer .el-button :deep(.el-icon) {
  margin-right: 6px;
}

/* 响应式设计 - 右侧面板 */
@media screen and (max-width: 768px) {
  .entries-grid {
    grid-template-columns: 1fr;
  }
  
  .right-panel {
    width: 100%;
    right: -100%;
  }
  
  .right-panel-header {
    padding: var(--spacing-md);
  }
  
  .right-panel-content {
    padding: var(--spacing-md);
  }
}
</style>
