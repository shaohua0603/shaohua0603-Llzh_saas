<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { ElIcon } from 'element-plus'
import { OfficeBuilding, Briefcase, InfoFilled, Star, Phone, MapLocation, Calendar, Users } from '@element-plus/icons-vue'

const router = useRouter()
const activeTab = ref('1')
const laborCompanyInfo = ref(null)
const loading = ref(true)

// 标签页配置
const tabs = [
  {
    label: '企业介绍',
    value: '1'
  },
  {
    label: '岗位介绍',
    value: '2'
  }
]

// 获取劳务公司信息
const getLaborCompanyInfo = () => {
  loading.value = true
  try {
    // 模拟劳务公司信息数据
    laborCompanyInfo.value = {
      name: '南通富民劳务服务有限公司',
      logo: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20company%20logo%20for%20human%20resources%20company%20called%20%22三鼎%22%2C%20modern%20design%2C%20blue%20and%20gold%20colors%2C%20clean%20and%20professional&image_size=square',
      description: '南通富民劳务服务有限公司成立于2003年，是一家专业的人力资源服务机构，致力于为企业和求职者提供全方位的人力资源解决方案。公司拥有一支经验丰富的专业团队，为客户提供招聘、培训、劳务派遣等一站式服务。',
      vision: '成为最值得信赖的人力资源服务合作伙伴',
      mission: '为企业创造价值，为人才实现梦想',
      values: ['诚信', '专业', '创新', '共赢'],
      establishmentDate: '2003-01-14',
      address: '江苏省南通市崇川区人民中路100号',
      contactPhone: '0513-88888888',
      email: 'contact@fumin-labor.com',
      website: 'www.fumin-labor.com',
      staffCount: 120,
      businessScope: '人力资源招聘、劳务派遣、职业培训、人事外包、薪酬管理',
      honors: [
        '2023年度南通市优秀人力资源服务机构',
        '2022年度江苏省劳务派遣诚信单位',
        '2021年度全国人力资源服务行业百强企业'
      ],
      partners: ['富士康科技集团', '华为技术有限公司', '比亚迪股份有限公司', '长城科技股份有限公司'],
      jobs: [
        {
          id: 1,
          title: '流水线操作工',
          salary: '5000-6000元/月',
          requirements: '18-45周岁，身体健康，能吃苦耐劳，服从安排',
          benefits: '包吃住，五险一金，节假日福利，年终奖金',
          workingHours: '8小时工作制，两班倒',
          location: '深圳市龙华区',
          recruitmentCount: 50,
          company: '富士康科技集团'
        },
        {
          id: 2,
          title: '质检员',
          salary: '5500-6500元/月',
          requirements: '20-40周岁，高中及以上学历，有质检经验优先',
          benefits: '包吃住，五险一金，节假日福利，年终奖金，晋升空间',
          workingHours: '8小时工作制，两班倒',
          location: '深圳市龙岗区',
          recruitmentCount: 20,
          company: '华为技术有限公司'
        },
        {
          id: 3,
          title: '仓库管理员',
          salary: '4800-5800元/月',
          requirements: '18-45周岁，身体健康，能吃苦耐劳，有仓库管理经验优先',
          benefits: '包吃住，五险一金，节假日福利，年终奖金',
          workingHours: '8小时工作制，常白班',
          location: '深圳市宝安区',
          recruitmentCount: 15,
          company: '比亚迪股份有限公司'
        },
        {
          id: 4,
          title: '技术员',
          salary: '6000-8000元/月',
          requirements: '20-40周岁，大专及以上学历，相关专业，有相关工作经验优先',
          benefits: '包吃住，五险一金，节假日福利，年终奖金，晋升空间',
          workingHours: '8小时工作制，常白班',
          location: '深圳市南山区',
          recruitmentCount: 10,
          company: '长城科技股份有限公司'
        }
      ]
    }
  } catch (error) {
    console.error('获取劳务公司信息失败:', error)
    ElMessage.error('获取劳务公司信息失败，请稍后重试')
  } finally {
    loading.value = false
  }
}

// 切换标签页
const handleTabChange = (value: string) => {
  activeTab.value = value
}

// 返回上一页
const goBack = () => {
  router.back()
}

// 页面加载时获取数据
onMounted(() => {
  getLaborCompanyInfo()
})
</script>

<template>
  <div class="labor-company-intro">
    <!-- 页面标题 -->
    <div class="page-header">
      <div class="header-left" @click="goBack">
        <i class="el-icon-arrow-left"></i>
        <h2>劳务公司介绍</h2>
      </div>
    </div>
    
    <!-- 劳务公司基本信息 -->
    <div v-if="!loading && laborCompanyInfo" class="company-header">
      <div class="company-logo">
        <img :src="laborCompanyInfo.logo" alt="公司Logo">
      </div>
      <div class="company-basic-info">
        <h1>{{ laborCompanyInfo.name }}</h1>
        <div class="company-meta">
          <div class="meta-item">
            <ElIcon :size="16"><Calendar /></ElIcon>
            <span>{{ laborCompanyInfo.establishmentDate }}成立</span>
          </div>
          <div class="meta-item">
            <ElIcon :size="16"><Users /></ElIcon>
            <span>{{ laborCompanyInfo.staffCount }}人</span>
          </div>
          <div class="meta-item">
            <ElIcon :size="16"><Phone /></ElIcon>
            <span>{{ laborCompanyInfo.contactPhone }}</span>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 标签页 -->
    <div class="company-tabs">
      <el-tabs v-model="activeTab" @tab-click="handleTabChange">
        <el-tab-pane
          v-for="tab in tabs"
          :key="tab.value"
          :label="tab.label"
          :name="tab.value"
        />
      </el-tabs>
    </div>
    
    <!-- 企业介绍 -->
    <div v-if="activeTab === '1' && !loading && laborCompanyInfo" class="company-intro">
      <div class="info-section">
        <div class="section-header">
          <ElIcon :size="20"><InfoFilled /></ElIcon>
          <h3>公司简介</h3>
        </div>
        <div class="section-content">
          <p>{{ laborCompanyInfo.description }}</p>
        </div>
      </div>
      
      <div class="info-section">
        <div class="section-header">
          <ElIcon :size="20"><Star /></ElIcon>
          <h3>企业愿景与使命</h3>
        </div>
        <div class="section-content">
          <div class="vision-mission">
            <div class="vision">
              <h4>愿景</h4>
              <p>{{ laborCompanyInfo.vision }}</p>
            </div>
            <div class="mission">
              <h4>使命</h4>
              <p>{{ laborCompanyInfo.mission }}</p>
            </div>
          </div>
        </div>
      </div>
      
      <div class="info-section">
        <div class="section-header">
          <ElIcon :size="20"><OfficeBuilding /></ElIcon>
          <h3>业务范围</h3>
        </div>
        <div class="section-content">
          <div class="business-scope">
            {{ laborCompanyInfo.businessScope }}
          </div>
        </div>
      </div>
      
      <div class="info-section">
        <div class="section-header">
          <ElIcon :size="20"><Star /></ElIcon>
          <h3>企业荣誉</h3>
        </div>
        <div class="section-content">
          <ul class="honors-list">
            <li v-for="(honor, index) in laborCompanyInfo.honors" :key="index">
              <ElIcon :size="14"><Star /></ElIcon>
              <span>{{ honor }}</span>
            </li>
          </ul>
        </div>
      </div>
      
      <div class="info-section">
        <div class="section-header">
          <ElIcon :size="20"><Users /></ElIcon>
          <h3>合作伙伴</h3>
        </div>
        <div class="section-content">
          <div class="partners-list">
            <el-tag 
              v-for="(partner, index) in laborCompanyInfo.partners" 
              :key="index"
              type="info"
              size="large"
            >
              {{ partner }}
            </el-tag>
          </div>
        </div>
      </div>
      
      <div class="info-section">
        <div class="section-header">
          <ElIcon :size="20"><MapLocation /></ElIcon>
          <h3>联系信息</h3>
        </div>
        <div class="section-content">
          <div class="contact-info">
            <div class="contact-item">
              <ElIcon :size="16"><MapLocation /></ElIcon>
              <span>{{ laborCompanyInfo.address }}</span>
            </div>
            <div class="contact-item">
              <ElIcon :size="16"><Phone /></ElIcon>
              <span>{{ laborCompanyInfo.contactPhone }}</span>
            </div>
            <div class="contact-item">
              <ElIcon :size="16"><InfoFilled /></ElIcon>
              <span>{{ laborCompanyInfo.website }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 岗位介绍 -->
    <div v-if="activeTab === '2' && !loading && laborCompanyInfo" class="jobs-intro">
      <div class="jobs-header">
        <h3>热门岗位</h3>
        <p class="jobs-count">共 {{ laborCompanyInfo.jobs.length }} 个岗位</p>
      </div>
      
      <div class="jobs-list">
        <div v-for="job in laborCompanyInfo.jobs" :key="job.id" class="job-item">
          <div class="job-header">
            <div class="job-title-section">
              <ElIcon :size="18"><Briefcase /></ElIcon>
              <h4>{{ job.title }}</h4>
              <el-tag type="success" size="small">{{ job.company }}</el-tag>
            </div>
            <div class="job-salary">
              {{ job.salary }}
            </div>
          </div>
          
          <div class="job-content">
            <div class="job-info">
              <div class="info-item">
                <span class="info-label">招聘人数：</span>
                <span class="info-value">{{ job.recruitmentCount }}人</span>
              </div>
              <div class="info-item">
                <span class="info-label">工作地点：</span>
                <span class="info-value">{{ job.location }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">工作时间：</span>
                <span class="info-value">{{ job.workingHours }}</span>
              </div>
            </div>
            
            <div class="job-requirements">
              <h5>任职要求</h5>
              <p>{{ job.requirements }}</p>
            </div>
            
            <div class="job-benefits">
              <h5>福利待遇</h5>
              <p>{{ job.benefits }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 加载中 -->
    <div v-if="loading" class="loading">
      <el-icon class="is-loading"><i class="el-icon-loading"></i></el-icon>
      <span>加载中...</span>
    </div>
    
    <!-- 暂无数据 -->
    <div v-if="!loading && !laborCompanyInfo" class="empty">
      <el-icon><i class="el-icon-info"></i></el-icon>
      <span>暂无劳务公司信息</span>
    </div>
  </div>
</template>

<style scoped>
.labor-company-intro {
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
  display: flex;
  align-items: center;
}

.header-left {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.header-left i {
  margin-right: 10px;
  font-size: 18px;
  color: #333;
}

.header-left h2 {
  margin: 0;
  font-size: 18px;
  font-weight: bold;
  color: #333;
}

.company-header {
  background-color: #fff;
  margin: 15px;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  display: flex;
  align-items: center;
}

.company-logo {
  width: 100px;
  height: 100px;
  margin-right: 20px;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #eaeaea;
}

.company-logo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.company-basic-info {
  flex: 1;
}

.company-basic-info h1 {
  margin: 0 0 15px 0;
  font-size: 24px;
  font-weight: bold;
  color: #333;
}

.company-meta {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 14px;
  color: #666;
}

.company-tabs {
  background-color: #fff;
  margin: 0 15px 15px;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  padding: 0 15px;
}

.company-intro {
  padding: 0 15px 20px;
}

.jobs-intro {
  padding: 0 15px 20px;
}

.info-section {
  background-color: #fff;
  margin-bottom: 15px;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.section-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 1px solid #f0f0f0;
}

.section-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: bold;
  color: #333;
}

.section-content {
  font-size: 14px;
  color: #666;
  line-height: 1.6;
}

.vision-mission {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.vision h4,
.mission h4 {
  margin: 0 0 10px 0;
  font-size: 14px;
  font-weight: bold;
  color: #333;
}

.business-scope {
  background-color: #f5f5f5;
  padding: 15px;
  border-radius: 8px;
  line-height: 1.6;
}

.honors-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.honors-list li {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  margin-bottom: 10px;
  line-height: 1.6;
}

.honors-list li span {
  flex: 1;
}

.partners-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.contact-info {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.contact-item {
  display: flex;
  align-items: center;
  gap: 10px;
  line-height: 1.6;
}

.jobs-header {
  background-color: #fff;
  margin-bottom: 15px;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.jobs-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: bold;
  color: #333;
}

.jobs-count {
  margin: 0;
  font-size: 14px;
  color: #666;
}

.jobs-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.job-item {
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

.job-header {
  padding: 15px 20px;
  border-bottom: 1px solid #f0f0f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #fafafa;
}

.job-title-section {
  display: flex;
  align-items: center;
  gap: 10px;
}

.job-title-section h4 {
  margin: 0;
  font-size: 16px;
  font-weight: bold;
  color: #333;
}

.job-salary {
  font-size: 18px;
  font-weight: bold;
  color: #ff4d4f;
}

.job-content {
  padding: 20px;
}

.job-info {
  display: flex;
  gap: 30px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.job-info .info-item {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 14px;
  color: #666;
}

.info-label {
  font-weight: bold;
  color: #333;
}

.job-requirements,
.job-benefits {
  margin-bottom: 20px;
}

.job-requirements h5,
.job-benefits h5 {
  margin: 0 0 10px 0;
  font-size: 14px;
  font-weight: bold;
  color: #333;
}

.job-requirements p,
.job-benefits p {
  margin: 0;
  line-height: 1.6;
}

.loading,
.empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 0;
  color: #999;
}

.loading i,
.empty i {
  font-size: 32px;
  margin-bottom: 10px;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .company-header {
    flex-direction: column;
    text-align: center;
    gap: 15px;
  }
  
  .company-logo {
    margin-right: 0;
  }
  
  .company-meta {
    justify-content: center;
  }
  
  .vision-mission {
    grid-template-columns: 1fr;
  }
  
  .job-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
  
  .job-salary {
    align-self: flex-start;
  }
  
  .job-info {
    flex-direction: column;
    gap: 10px;
  }
}
</style>