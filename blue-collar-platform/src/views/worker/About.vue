<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import BackButton from '../../components/BackButton.vue'
import { ElMessage } from 'element-plus'

const router = useRouter()

// 应用版本号
const appVersion = 'v1.0.0'

// 开发企业信息
const companyInfo = {
  name: '上海蓝领智汇网络科技有限公司',
  description: '上海蓝领智汇网络科技有限公司致力于为蓝领工人提供一站式的工作和生活服务平台，通过数字化技术提升工人的就业质量和生活品质。我们专注于为制造业、服务业等行业的蓝领工人提供招聘、培训、考勤、薪资管理等全方位服务，构建和谐的劳动关系生态。',
  address: '上海市浦东新区张江高科技园区博云路2号',
  contact: '400-888-8888'
}

// 返回上一页
const goBack = () => {
  router.back()
}

// 跳转到协议详情页
const goToAgreement = (type: string) => {
  if (type === 'user') {
    // 跳转到用户协议页面
    router.push('/user-agreement')
  } else if (type === 'privacy') {
    // 跳转到隐私政策页面
    router.push('/privacy-policy')
  }
}
</script>

<template>
  <div class="worker-about">
    <BackButton />
    <!-- 页面标题 -->
    <div class="page-header">
      <div class="header-left" @click="goBack">
        <i class="el-icon-arrow-left"></i>
        <h2>版本信息</h2>
      </div>
    </div>
    
    <!-- 内容区域 -->
    <div class="about-content">
      <!-- 企业介绍 -->
      <div class="company-section">
        <h3 class="section-title">开发企业</h3>
        <div class="company-info">
          <div class="info-item">
            <span class="info-label">企业名称</span>
            <span class="info-value">{{ companyInfo.name }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">企业介绍</span>
            <span class="info-value description">{{ companyInfo.description }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">公司地址</span>
            <span class="info-value">{{ companyInfo.address }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">联系电话</span>
            <span class="info-value">{{ companyInfo.contact }}</span>
          </div>
        </div>
      </div>
      
      <!-- 版本信息 -->
      <div class="version-section">
        <div class="version-info">
          <span class="version-label">版本号</span>
          <span class="version-number">{{ appVersion }}</span>
        </div>
      </div>
      
      <!-- 用户协议和隐私政策 -->
      <div class="agreement-section">
        <h3 class="section-title">相关协议</h3>
        <div class="agreement-list">
          <div class="agreement-item" @click="goToAgreement('user')">
            <span class="agreement-title">用户协议</span>
            <i class="el-icon-arrow-right"></i>
          </div>
          <div class="agreement-item" @click="goToAgreement('privacy')">
            <span class="agreement-title">隐私政策</span>
            <i class="el-icon-arrow-right"></i>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.worker-about {
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
  justify-content: space-between;
  align-items: center;
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

.header-left i {
  font-size: 18px;
  color: #333;
  cursor: pointer;
}

.about-content {
  padding: 15px;
}

.company-section,
.version-section {
  background-color: #fff;
  border-radius: 10px;
  padding: 20px;
  margin-bottom: 15px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.section-title {
  margin: 0 0 15px 0;
  font-size: 16px;
  font-weight: bold;
  color: #333;
  padding-bottom: 10px;
  border-bottom: 1px solid #f0f0f0;
}

.company-info {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.info-label {
  font-size: 14px;
  font-weight: 500;
  color: #666;
}

.info-value {
  font-size: 14px;
  color: #333;
}

.info-value.description {
  line-height: 1.6;
  text-align: justify;
}

.version-info {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 15px 0;
  gap: 10px;
}

.version-label {
  font-size: 14px;
  font-weight: 500;
  color: #666;
}

.version-number {
  font-size: 16px;
  font-weight: bold;
  color: #1890ff;
}

/* 协议部分样式 */
.agreement-section {
  background-color: #fff;
  border-radius: 10px;
  padding: 20px;
  margin-bottom: 15px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.agreement-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.agreement-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
  cursor: pointer;
  transition: all 0.3s ease;
}

.agreement-item:hover {
  background-color: #f8f9fa;
  padding-left: 10px;
  padding-right: 10px;
  border-radius: 5px;
}

.agreement-item:last-child {
  border-bottom: none;
}

.agreement-title {
  font-size: 14px;
  color: #333;
}

.agreement-item i {
  font-size: 12px;
  color: #999;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .page-header {
    padding: 12px 15px;
  }
  
  .page-header h2 {
    font-size: 16px;
  }
  
  .about-content {
    padding: 10px;
  }
  
  .company-section,
  .version-section {
    padding: 15px;
    margin-bottom: 10px;
  }
  
  .section-title {
    font-size: 15px;
  }
  
  .info-value {
    font-size: 13px;
  }
  
  .version-number {
    font-size: 16px;
  }
}
</style>