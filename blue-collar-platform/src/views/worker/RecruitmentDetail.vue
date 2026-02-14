<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { ArrowLeft, Loading, InfoFilled, User, Timer, Calendar, Location, ChatDotRound, Phone } from '@element-plus/icons-vue'
import BackButton from '../../components/BackButton.vue'

const route = useRoute()
const router = useRouter()
const recruitment = ref(null)
const loading = ref(true)

// 模拟招聘数据
const mockRecruitments = [
  // 厂家直招
  {
    id: 1,
    type: 'factory_direct',
    factory: '富士康科技集团',
    factoryLogo: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Foxconn%20technology%20group%20logo%2C%20corporate%20logo%2C%20blue%20color%2C%20clear%20and%20professional&image_size=square',
    position: '操作工',
    salary: '5000-6000元/月',
    tags: ['操作工', '包吃住', '五险一金', '年终奖', '8小时工作制'],
    requirements: '18-45岁，身体健康，吃苦耐劳',
    welfare: '包吃住，五险一金，年终奖',
    contact: '张经理 13800138005',
    publishDate: '2026-01-15',
    deadline: '2026-02-28',
    isLongTerm: false,
    hiringNumber: '招50人',
    education: '学历不限',
    experience: '经验不限',
    location: '上海市浦东新区张江高科技园区',
    description: '【职位职责】\n负责电子产品的组装和检测工作\n按照生产计划完成生产任务\n遵守公司规章制度和安全操作规程\n\n【职位要求】\n18-45岁，身体健康，吃苦耐劳\n能适应流水线工作\n责任心强，工作认真细致\n\n【薪资福利】\n基本工资：4000元/月\n绩效奖金：500-1000元/月\n加班费：按实际加班时间计算\n五险一金：公司全额缴纳\n包吃住：提供免费宿舍和工作餐\n年终奖：根据公司业绩发放\n\n【工作时间】\n8小时工作制，每周休息1天\n早班：8:00-17:00\n中班：17:00-02:00（加班费另算）',
    workingHours: '8小时工作制，每周休息1天',
    companyIntro: '富士康科技集团是全球最大的电子科技制造服务企业，专注于电子产品的设计、研发和制造。公司拥有先进的生产设备和管理理念，为员工提供良好的工作环境和发展空间。',
    companyImages: [
      'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=modern%20electronics%20factory%20interior%2C%20clean%20workshop%2C%20assembly%20lines%2C%20professional%20workers%20in%20uniform&image_size=landscape_16_9',
      'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=factory%20dormitory%20exterior%2C%20modern%20building%2C%20clean%20environment%2C%20green%20areas&image_size=landscape_16_9',
      'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=company%20canteen%20interior%2C%20clean%20and%20spacious%2C%20variety%20of%20food%20options&image_size=landscape_16_9'
    ]
  },
  {
    id: 2,
    type: 'factory_direct',
    factory: '华为技术有限公司',
    factoryLogo: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Huawei%20technology%20co%20ltd%20logo%2C%20corporate%20logo%2C%20red%20color%2C%20clear%20and%20professional&image_size=square',
    position: '质检员',
    salary: '6000-7000元/月',
    tags: ['质检员', '包吃住', '五险一金', '带薪年假', '8小时工作制'],
    requirements: '20-40岁，高中以上学历，有质检经验优先',
    welfare: '包吃住，五险一金，带薪年假',
    contact: '李经理 13800138006',
    publishDate: '2026-01-10',
    deadline: '2026-03-15',
    isLongTerm: false,
    hiringNumber: '招20人',
    education: '高中以上学历',
    experience: '有质检经验优先',
    location: '深圳市南山区科技园',
    description: '【职位职责】\n负责产品质量的检验和控制工作\n按照质量标准进行产品检测\n记录和分析质检数据\n协助改进生产工艺和质量控制流程\n\n【职位要求】\n20-40岁，高中以上学历\n有质检经验优先\n责任心强，工作认真细致\n具备基本的质量控制知识\n\n【薪资福利】\n基本工资：5000元/月\n绩效奖金：500-1500元/月\n五险一金：公司全额缴纳\n包吃住：提供免费宿舍和工作餐\n带薪年假：每年10天\n\n【工作时间】\n8小时工作制，每周休息2天\n正常工作时间：9:00-18:00',
    workingHours: '8小时工作制，每周休息2天',
    companyIntro: '华为技术有限公司是全球领先的信息与通信技术解决方案供应商，致力于把数字世界带入每个人、每个家庭、每个组织，构建万物互联的智能世界。',
    companyImages: [
      'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=modern%20technology%20company%20office%2C%20high-tech%20environment%2C%20professional%20workers&image_size=landscape_16_9',
      'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=quality%20control%20laboratory%2C%20advanced%20testing%20equipment%2C%20professional%20technicians&image_size=landscape_16_9'
    ]
  },
  // 平台招聘
  {
    id: 3,
    type: 'platform',
    factory: '比亚迪股份有限公司',
    factoryLogo: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=BYD%20auto%20company%20logo%2C%20corporate%20logo%2C%20blue%20and%20white%20colors%2C%20clear%20and%20professional&image_size=square',
    position: '装配工',
    salary: '5500-6500元/月',
    tags: ['装配工', '包吃住', '五险一金', '节日福利', '8小时工作制'],
    requirements: '18-45岁，身体健康，服从安排',
    welfare: '包吃住，五险一金，节日福利',
    contact: '王经理 13800138007',
    publishDate: '2026-01-08',
    deadline: '',
    isLongTerm: true,
    hiringNumber: '招30人',
    education: '学历不限',
    experience: '经验不限',
    location: '深圳市坪山区比亚迪工业园',
    description: '【职位职责】\n负责汽车零部件的装配工作\n按照装配工艺要求完成生产任务\n维护和保养装配工具和设备\n遵守公司规章制度和安全操作规程\n\n【职位要求】\n18-45岁，身体健康，服从安排\n能适应流水线工作\n责任心强，工作认真细致\n\n【薪资福利】\n基本工资：4500元/月\n绩效奖金：500-1000元/月\n加班费：按实际加班时间计算\n五险一金：公司全额缴纳\n包吃住：提供免费宿舍和工作餐\n节日福利：春节、中秋等节日发放福利\n\n【工作时间】\n8小时工作制，每周休息1天\n工作时间：8:00-17:00',
    workingHours: '8小时工作制，每周休息1天',
    companyIntro: '比亚迪股份有限公司是全球领先的新能源汽车制造商，专注于电动汽车、电池和光伏产品的研发和生产。公司拥有先进的生产技术和管理理念，为员工提供良好的工作环境和发展空间。',
    companyImages: [
      'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=automobile%20assembly%20line%2C%20modern%20factory%20interior%2C%20robotic%20arms%2C%20workers%20in%20uniform&image_size=landscape_16_9',
      'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=new%20energy%20cars%20in%20factory%20parking%20lot%2C%20rows%20of%20electric%20vehicles%2C%20modern%20facility&image_size=landscape_16_9'
    ]
  },
  // 劳务招聘
  {
    id: 4,
    type: 'labor',
    factory: '特斯拉上海工厂',
    factoryLogo: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Tesla%20logo%2C%20corporate%20logo%2C%20red%20color%2C%20clear%20and%20professional&image_size=square',
    laborCompany: '三鼎劳务有限公司',
    position: '生产操作员',
    salary: '6000-7500元/月',
    tags: ['生产操作员', '包吃住', '五险一金', '绩效奖金', '倒班'],
    requirements: '18-40岁，初中以上学历，能适应倒班',
    welfare: '包吃住，五险一金，绩效奖金',
    contact: '刘经理 13800138008',
    publishDate: '2026-01-05',
    deadline: '2026-02-20',
    isLongTerm: false,
    hiringNumber: '招100人',
    education: '初中以上学历',
    experience: '经验不限',
    location: '上海市浦东新区特斯拉超级工厂',
    description: '【职位职责】\n负责电动汽车的生产和装配工作\n按照生产计划完成生产任务\n维护和保养生产设备\n遵守公司规章制度和安全操作规程\n\n【职位要求】\n18-40岁，初中以上学历\n能适应倒班工作\n责任心强，工作认真细致\n\n【薪资福利】\n基本工资：5000元/月\n绩效奖金：500-1500元/月\n加班费：按实际加班时间计算\n五险一金：公司全额缴纳\n包吃住：提供免费宿舍和工作餐\n\n【工作时间】\n12小时工作制，两班倒\n白班：8:00-20:00\n夜班：20:00-8:00\n每两周倒班一次',
    workingHours: '12小时工作制，两班倒',
    companyIntro: '特斯拉上海工厂是特斯拉在全球的重要生产基地，专注于电动汽车的研发和生产。工厂采用先进的生产技术和管理理念，为员工提供良好的工作环境和发展空间。',
    companyImages: [
      'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Tesla%20factory%20exterior%2C%20modern%20building%2C%20large%20glass%20facade%2C%20clean%20environment&image_size=landscape_16_9',
      'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=electric%20car%20production%20line%2C%20advanced%20factory%20interior%2C%20robotic%20arms%2C%20workers%20in%20uniform&image_size=landscape_16_9'
    ]
  }
]

// 获取招聘详情
const getRecruitmentDetail = async () => {
  loading.value = true
  try {
    const recruitmentId = parseInt(route.params.id as string)
    // 模拟异步请求
    setTimeout(() => {
      const foundRecruitment = mockRecruitments.find(r => r.id === recruitmentId)
      if (foundRecruitment) {
        recruitment.value = foundRecruitment
      } else {
        ElMessage.error('招聘信息不存在')
        router.push('/worker/recruitment')
      }
      loading.value = false
    }, 500)
  } catch (error) {
    console.error('获取招聘详情失败:', error)
    ElMessage.error('获取招聘详情失败，请稍后重试')
    loading.value = false
  }
}

// 投递简历
const handleApply = () => {
  ElMessage.success(`已投递 ${recruitment.value.position} 职位`)
}

// 返回招聘列表
const goBack = () => {
  router.push('/worker/recruitment')
}

// 页面加载时获取数据
onMounted(() => {
  getRecruitmentDetail()
})
</script>

<template>
  <div class="worker-recruitment-detail">
    <BackButton />
    <!-- 页面标题 -->
    <div class="page-header">
      <div class="header-left">
        <el-button type="text" @click="goBack">
          <el-icon><ArrowLeft /></el-icon>
        </el-button>
        <h2>招聘详情</h2>
      </div>
    </div>
    
    <!-- 招聘内容 -->
    <div class="recruitment-content">
      <div v-if="loading" class="loading">
        <el-icon class="is-loading"><Loading /></el-icon>
        <span>加载中...</span>
      </div>
      <div v-else-if="!recruitment" class="empty">
        <el-icon><InfoFilled /></el-icon>
        <span>招聘信息不存在</span>
      </div>
      <div v-else class="recruitment-detail">
        <!-- 顶部岗位信息 -->
        <div class="job-header">
          <h1 class="job-title">{{ recruitment.position }}</h1>
          <div class="job-salary">{{ recruitment.salary }}</div>
          <div class="job-tags">
            <span v-for="(tag, index) in recruitment.tags" :key="index" class="tag">{{ tag }}</span>
          </div>
        </div>
        
        <!-- 职位基本信息 -->
        <div class="job-basic-info">
          <div class="info-item">
            <el-icon><User /></el-icon>
            <span>{{ recruitment.hiringNumber }}</span>
          </div>
          <div class="info-item">
            <el-icon><User /></el-icon>
            <span>{{ recruitment.education }}</span>
          </div>
          <div class="info-item">
            <el-icon><Timer /></el-icon>
            <span>{{ recruitment.experience }}</span>
          </div>
          <div class="info-item">
            <el-icon><Calendar /></el-icon>
            <span>{{ recruitment.isLongTerm ? '长期有效' : `截止: ${recruitment.deadline}` }}</span>
          </div>
        </div>
        
        <!-- 工作地址 -->
        <div class="job-location">
          <h3><el-icon><Location /></el-icon> 工作地址</h3>
          <p class="location-text">{{ recruitment.location }}</p>
          <button class="view-map-btn">查看地图</button>
        </div>
        
        <!-- 职位描述 -->
        <div class="job-description">
          <h3>职位描述</h3>
          <div class="description-content">
            <p v-for="(line, index) in recruitment.description.split('\n')" :key="index" class="description-line">
              {{ line }}
            </p>
          </div>
        </div>
        
        <!-- 公司信息 -->
        <div class="company-info">
          <h3>公司信息</h3>
          <div class="company-header">
            <img v-if="recruitment.factoryLogo" :src="recruitment.factoryLogo" alt="公司Logo" class="company-logo">
            <div class="company-details">
              <h4 class="company-name">{{ recruitment.factory }}</h4>
              <p v-if="recruitment.laborCompany" class="labor-company">{{ recruitment.laborCompany }}</p>
            </div>
          </div>
          
          <!-- 公司介绍 -->
          <div class="company-intro">
            <h4>公司介绍</h4>
            <p>{{ recruitment.companyIntro }}</p>
          </div>
          
          <!-- 公司图片 -->
          <div v-if="recruitment.companyImages && recruitment.companyImages.length > 0" class="company-images">
            <h4>公司环境</h4>
            <div class="image-grid">
              <img v-for="(image, index) in recruitment.companyImages" :key="index" :src="image" alt="公司环境" class="company-image">
            </div>
          </div>
        </div>
        
        <!-- 底部操作栏 -->
        <div class="bottom-action-bar">
          <div class="contact-buttons">
            <button class="contact-btn chat-btn">
              <el-icon><ChatDotRound /></el-icon>
              <span>微聊</span>
            </button>
            <button class="contact-btn call-btn">
              <el-icon><Phone /></el-icon>
              <span>电话</span>
            </button>
          </div>
          <button class="apply-btn" @click="handleApply">
            投递简历
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.worker-recruitment-detail {
  min-height: 100vh;
  background-color: #f5f5f5;
}

.page-header {
  background-color: #fff;
  padding: 15px;
  border-bottom: 1px solid #eaeaea;
  position: sticky;
  top: 0;
  z-index: 10;
}

.header-left {
  display: flex;
  align-items: center;
}

.header-left h2 {
  margin: 0 0 0 10px;
  font-size: 18px;
  font-weight: bold;
  color: #333;
}

.recruitment-content {
  padding: 15px;
}

.loading,
.empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 0;
  color: #999;
}

.loading i,
.empty i {
  font-size: 32px;
  margin-bottom: 10px;
}

.recruitment-detail {
  background-color: #fff;
  min-height: calc(100vh - 60px);
  padding-bottom: 80px; /* 为底部操作栏留出空间 */
}

/* 顶部岗位信息 */
.job-header {
  padding: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
}

.job-title {
  margin: 0 0 10px 0;
  font-size: 24px;
  font-weight: bold;
}

.job-salary {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 15px;
}

.job-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tag {
  padding: 4px 12px;
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 15px;
  font-size: 12px;
}

/* 职位基本信息 */
.job-basic-info {
  display: flex;
  flex-wrap: wrap;
  padding: 15px;
  border-bottom: 1px solid #eaeaea;
  gap: 15px;
}

.job-basic-info .info-item {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 14px;
  color: #666;
}

.job-basic-info .info-item i {
  color: #999;
  font-size: 14px;
}

/* 工作地址 */
.job-location {
  padding: 15px;
  border-bottom: 8px solid #f5f5f5;
}

.job-location h3 {
  margin: 0 0 10px 0;
  font-size: 16px;
  font-weight: bold;
  color: #333;
  display: flex;
  align-items: center;
  gap: 8px;
}

.job-location h3 i {
  color: #ff6b6b;
}

.location-text {
  margin: 0 0 10px 0;
  font-size: 14px;
  color: #666;
  line-height: 1.4;
}

.view-map-btn {
  padding: 6px 12px;
  background-color: #f5f5f5;
  border: 1px solid #eaeaea;
  border-radius: 4px;
  font-size: 12px;
  color: #666;
  cursor: pointer;
}

/* 职位描述 */
.job-description {
  padding: 15px;
  border-bottom: 8px solid #f5f5f5;
}

.job-description h3 {
  margin: 0 0 15px 0;
  font-size: 16px;
  font-weight: bold;
  color: #333;
}

.description-content {
  font-size: 14px;
  color: #666;
  line-height: 1.6;
}

.description-line {
  margin: 0 0 8px 0;
}

.description-line:first-child {
  font-weight: bold;
  color: #333;
}

/* 公司信息 */
.company-info {
  padding: 15px;
}

.company-info h3 {
  margin: 0 0 15px 0;
  font-size: 16px;
  font-weight: bold;
  color: #333;
}

.company-header {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
  gap: 10px;
}

.company-logo {
  width: 60px;
  height: 60px;
  border-radius: 8px;
  object-fit: cover;
}

.company-details h4 {
  margin: 0 0 5px 0;
  font-size: 16px;
  font-weight: bold;
  color: #333;
}

.labor-company {
  margin: 0;
  font-size: 12px;
  color: #999;
}

.company-intro {
  margin-bottom: 15px;
}

.company-intro h4 {
  margin: 0 0 10px 0;
  font-size: 14px;
  font-weight: bold;
  color: #333;
}

.company-intro p {
  margin: 0;
  font-size: 14px;
  color: #666;
  line-height: 1.4;
}

.company-images {
  margin-top: 15px;
}

.company-images h4 {
  margin: 0 0 10px 0;
  font-size: 14px;
  font-weight: bold;
  color: #333;
}

.image-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
}

.company-image {
  width: 100%;
  height: 80px;
  border-radius: 4px;
  object-fit: cover;
}

/* 底部操作栏 */
.bottom-action-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: #fff;
  border-top: 1px solid #eaeaea;
  padding: 10px 15px;
  display: flex;
  align-items: center;
  gap: 10px;
  z-index: 100;
}

.contact-buttons {
  display: flex;
  gap: 10px;
  flex-shrink: 0;
}

.contact-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  padding: 8px;
  background-color: #f5f5f5;
  border: 1px solid #eaeaea;
  border-radius: 4px;
  font-size: 12px;
  color: #666;
  cursor: pointer;
  min-width: 60px;
}

.contact-btn i {
  font-size: 16px;
}

.apply-btn {
  flex: 1;
  padding: 12px;
  background-color: #ff6b6b;
  color: #fff;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .page-header {
    padding: 12px 15px;
  }
  
  .header-left h2 {
    font-size: 16px;
  }
  
  .recruitment-content {
    padding: 0;
  }
  
  .job-header {
    padding: 15px;
  }
  
  .job-title {
    font-size: 20px;
  }
  
  .job-salary {
    font-size: 18px;
  }
  
  .job-basic-info {
    padding: 12px;
    gap: 10px;
  }
  
  .job-basic-info .info-item {
    font-size: 13px;
  }
  
  .job-location,
  .job-description,
  .company-info {
    padding: 12px;
  }
  
  .job-location h3,
  .job-description h3,
  .company-info h3 {
    font-size: 15px;
  }
  
  .description-content {
    font-size: 13px;
  }
  
  .company-logo {
    width: 50px;
    height: 50px;
  }
  
  .company-details h4 {
    font-size: 15px;
  }
  
  .image-grid {
    gap: 6px;
  }
  
  .company-image {
    height: 70px;
  }
  
  .bottom-action-bar {
    padding: 8px 12px;
    gap: 8px;
  }
  
  .contact-btn {
    min-width: 50px;
    padding: 6px;
    font-size: 11px;
  }
  
  .contact-btn i {
    font-size: 14px;
  }
  
  .apply-btn {
    padding: 10px;
    font-size: 15px;
  }
}
</style>