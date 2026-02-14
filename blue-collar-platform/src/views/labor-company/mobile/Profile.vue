<template>
  <div class="labor-company-mobile-profile">
    <h2 class="page-title">个人中心</h2>
    
    <!-- 公司信息卡片 -->
    <el-card class="company-card">
      <div class="company-info">
        <div class="company-name">{{ companyInfo.companyName }}</div>
        <div class="company-details">
          <div class="detail-item">
            <span class="detail-label">联系人：</span>
            <span class="detail-value">{{ companyInfo.contactName }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">联系电话：</span>
            <span class="detail-value">{{ companyInfo.contactPhone }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">地址：</span>
            <span class="detail-value">{{ companyInfo.address }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">注册时间：</span>
            <span class="detail-value">{{ companyInfo.registerDate }}</span>
          </div>
        </div>
      </div>
    </el-card>
    
    <!-- 功能菜单 -->
    <div class="function-menu">
      <el-card class="menu-card">
        <h3 class="menu-title">系统设置</h3>
        <div class="menu-items">
          <div class="menu-item" @click="handleEditProfile">
            <span class="menu-icon"><i class="el-icon-edit"></i></span>
            <span class="menu-text">编辑资料</span>
            <span class="menu-arrow"><i class="el-icon-right"></i></span>
          </div>
          <div class="menu-item" @click="handleChangePassword">
            <span class="menu-icon"><i class="el-icon-lock"></i></span>
            <span class="menu-text">修改密码</span>
            <span class="menu-arrow"><i class="el-icon-right"></i></span>
          </div>
          <div class="menu-item" @click="handleNotificationSettings">
            <span class="menu-icon"><i class="el-icon-bell"></i></span>
            <span class="menu-text">通知设置</span>
            <span class="menu-arrow"><i class="el-icon-right"></i></span>
          </div>
          <div class="menu-item" @click="handleAbout">
            <span class="menu-icon"><i class="el-icon-info"></i></span>
            <span class="menu-text">关于我们</span>
            <span class="menu-arrow"><i class="el-icon-right"></i></span>
          </div>
        </div>
      </el-card>
    </div>
    
    <!-- 退出登录按钮 -->
    <div class="logout-section">
      <el-button type="danger" @click="handleLogout" style="width: 100%">退出登录</el-button>
    </div>
    
    <!-- 版本信息 -->
    <div class="version-info">
      <span class="version-text">版本号：v1.0.0</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

// 路由实例
const router = useRouter()

// 公司信息
const companyInfo = ref({
  companyName: '劳务公司',
  contactName: '联系人',
  contactPhone: '13800138000',
  address: '北京市朝阳区',
  registerDate: '2024-01-01'
})

// 编辑资料
const handleEditProfile = () => {
  console.log('编辑资料')
  // 这里可以跳转到编辑资料页面
}

// 修改密码
const handleChangePassword = () => {
  console.log('修改密码')
  // 这里可以跳转到修改密码页面
}

// 通知设置
const handleNotificationSettings = () => {
  console.log('通知设置')
  // 这里可以跳转到通知设置页面
}

// 关于我们
const handleAbout = () => {
  console.log('关于我们')
  // 这里可以跳转到关于我们页面
}

// 退出登录
const handleLogout = () => {
  // 清除本地存储的用户信息
  localStorage.removeItem('userInfo')
  // 跳转到登录页面
  router.push('/login')
}

// 初始化数据
onMounted(async () => {
  try {
    // 获取公司信息
    const response = await axios.get('/api/labor-company/info')
    companyInfo.value = response.data
  } catch (error) {
    console.error('获取公司信息失败:', error)
  }
})
</script>

<style scoped>
.labor-company-mobile-profile {
  padding: 16px;
}

.page-title {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 20px;
  color: #303133;
}

/* 公司信息卡片 */
.company-card {
  margin-bottom: 20px;
}

.company-info {
  display: flex;
  flex-direction: column;
}

.company-name {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 16px;
  color: #303133;
}

.company-details {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.detail-item {
  font-size: 14px;
}

.detail-label {
  color: #606266;
  margin-right: 8px;
}

.detail-value {
  color: #303133;
}

/* 功能菜单 */
.function-menu {
  margin-bottom: 20px;
}

.menu-card {
  margin-bottom: 16px;
}

.menu-title {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 16px;
  color: #303133;
}

.menu-items {
  display: flex;
  flex-direction: column;
}

.menu-item {
  display: flex;
  align-items: center;
  padding: 16px 0;
  border-bottom: 1px solid #ebeef5;
  cursor: pointer;
}

.menu-item:last-child {
  border-bottom: none;
}

.menu-icon {
  margin-right: 16px;
  color: #409eff;
  font-size: 18px;
}

.menu-text {
  flex: 1;
  color: #303133;
  font-size: 14px;
}

.menu-arrow {
  color: #909399;
  font-size: 14px;
}

/* 退出登录按钮 */
.logout-section {
  margin-bottom: 20px;
}

/* 版本信息 */
.version-info {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.version-text {
  font-size: 12px;
  color: #909399;
}

/* 响应式设计 */
@media screen and (max-width: 768px) {
  .labor-company-mobile-profile {
    padding: 16px;
  }
  
  .page-title {
    font-size: 18px;
  }
}
</style>