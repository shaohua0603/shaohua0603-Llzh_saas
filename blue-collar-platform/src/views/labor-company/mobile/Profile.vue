<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { 
  User, Timer, SwitchButton, Grid, Flag, Promotion, 
  Document, Present, ZoomIn
} from '@element-plus/icons-vue'

const router = useRouter()
const userInfo = ref<any>(null)

const menuItems = [
  {
    id: 1,
    title: '招聘需求',
    icon: Flag,
    path: ''
  },
  {
    id: 2,
    title: '简历管理',
    icon: Document,
    path: ''
  },
  {
    id: 3,
    title: '接送管理',
    icon: User,
    path: ''
  },
  {
    id: 4,
    title: '签订合同',
    icon: Present,
    path: ''
  },
  {
    id: 5,
    title: '假勤管理',
    icon: Timer,
    path: ''
  },
  {
    id: 6,
    title: '离职管理',
    icon: SwitchButton,
    path: ''
  },
  {
    id: 7,
    title: '调岗管理',
    icon: Grid,
    path: ''
  },
  {
    id: 8,
    title: '报名管理',
    icon: Promotion,
    path: ''
  },
  {
    id: 9,
    title: '版本信息',
    icon: ZoomIn,
    path: ''
  }
]

const getUserInfo = () => {
  const defaultAvatar = 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20ID%20photo%20of%20a%20Chinese%20male%20worker%20with%20plain%20white%20background%2C%20passport%20style%2C%20front%20view%2C%20clear%20features%2C%20formal%20clothing&image_size=square'
  
  const storedUserInfo = localStorage.getItem('userInfo')
  if (storedUserInfo) {
    userInfo.value = JSON.parse(storedUserInfo)
    userInfo.value.avatar = defaultAvatar
  } else {
    userInfo.value = {
      name: '李四',
      companyName: '南通富民劳务服务有限公司',
      position: '招聘经理',
      avatar: defaultAvatar
    }
  }
}

const goToFunction = (menuItem: any) => {
  if (menuItem.path) {
    router.push(menuItem.path)
  } else {
    ElMessage.info(`${menuItem.title} - 暂未开放`)
  }
}

const goToScanner = () => {
  ElMessage.info('扫一扫功能')
}

const handleLogout = () => {
  localStorage.removeItem('userInfo')
  localStorage.removeItem('token')
  ElMessage.success('退出登录成功')
  router.push('/login')
}

onMounted(() => {
  getUserInfo()
})
</script>

<template>
  <div class="worker-profile">
    <!-- 顶部个人信息 -->
    <div class="home-header">
      <div class="header-content">
        <div class="user-info">
          <div class="avatar">
            <img v-if="userInfo?.avatar" :src="userInfo.avatar" alt="头像">
            <div v-else class="default-avatar">
              {{ userInfo?.name ? userInfo.name.charAt(0) : '用' }}
            </div>
          </div>
          <div class="user-details">
            <div class="name-section">
              <h3>{{ userInfo?.name || '未登录' }}</h3>
            </div>
            <p class="factory-info">
              {{ userInfo?.companyName || '劳务公司' }}
            </p>
            <p class="position-info">{{ userInfo?.position || '招聘经理' }}</p>
          </div>
        </div>
        <div class="header-actions">
          <div class="scan-button" @click="goToScanner">
            <el-icon class="scan-icon"><ZoomIn /></el-icon>
            <span>扫一扫</span>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 个人信息入口 -->
    <div class="function-menu">
      <div class="menu-section">
        <div class="menu-item" @click="goToFunction(menuItems[0])">
          <div class="menu-icon">
            <el-icon :size="18">
              <component :is="menuItems[0].icon" />
            </el-icon>
          </div>
          <span class="menu-title">{{ menuItems[0].title }}</span>
          <i class="el-icon-arrow-right"></i>
        </div>
      </div>
    </div>
    
    <!-- 功能菜单 -->
    <div class="function-menu">
      <div class="menu-section">
        <div v-for="menuItem in menuItems.slice(1)" :key="menuItem.id" class="menu-item" @click="goToFunction(menuItem)">
          <div class="menu-icon">
            <el-icon :size="18">
              <component :is="menuItem.icon" />
            </el-icon>
          </div>
          <span class="menu-title">{{ menuItem.title }}</span>
          <i class="el-icon-arrow-right"></i>
        </div>
      </div>
    </div>
    
    <!-- 退出登录按钮 -->
    <div class="logout-section">
      <el-button type="danger" @click="handleLogout">退出登录</el-button>
    </div>
    
    <!-- 版本信息 -->
    <div class="version-info">
      <p>蓝领智汇 v1.0.0</p>
    </div>
  </div>
</template>

<style scoped>
.worker-profile {
  min-height: 100vh;
  background-color: #f5f5f5;
}

.home-header {
  background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
  color: #fff;
  padding: 16px;
  border-radius: 0 0 24px 24px;
  margin-bottom: 16px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  position: relative;
  overflow: hidden;
  height: auto;
  min-height: 140px;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  z-index: 1;
  width: 100%;
}

.home-header::before {
  content: '';
  position: absolute;
  top: -50%;
  right: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%);
  animation: float 6s ease-in-out infinite;
}

@keyframes float {
  0% {
    transform: translate(0, 0) rotate(0deg);
  }
  50% {
    transform: translate(-20px, -20px) rotate(5deg);
  }
  100% {
    transform: translate(0, 0) rotate(0deg);
  }
}

.header-actions {
  display: flex;
  align-items: center;
  flex-shrink: 0;
}

.scan-button {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 8px;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 60px;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.scan-button:hover {
  background: rgba(255, 255, 255, 0.25);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(255, 255, 255, 0.2);
}

.scan-icon {
  font-size: 20px;
  margin-bottom: 4px;
  color: #fff;
}

.scan-button span {
  font-size: 11px;
  font-weight: 500;
  color: #fff;
}

.user-info {
  display: flex;
  align-items: center;
  position: relative;
  z-index: 1;
  gap: 16px;
  flex: 1;
}

.avatar {
  width: 70px;
  height: 90px;
  border: 3px solid rgba(255, 255, 255, 0.9);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  overflow: hidden;
  transition: transform 0.3s ease;
  flex-shrink: 0;
}

.avatar:hover {
  transform: scale(1.03);
}

.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.default-avatar {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  font-weight: bold;
  color: #4f46e5;
  background-color: white;
}

.user-details {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.name-section {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.name-section h3 {
  margin: 0;
  font-size: 18px;
  font-weight: bold;
  letter-spacing: 0.5px;
}

.factory-info {
  margin: 0;
  font-size: 14px;
  font-weight: bold;
  opacity: 1;
  line-height: 1.3;
}

.position-info {
  margin: 0;
  font-size: 12px;
  opacity: 0.9;
  line-height: 1.3;
}

.function-menu {
  background-color: #fff;
  margin: 0 15px 15px;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

.menu-section {
  display: flex;
  flex-direction: column;
}

.menu-item {
  display: flex;
  align-items: center;
  padding: 15px;
  border-bottom: 1px solid #f0f0f0;
  cursor: pointer;
}

.menu-item:last-child {
  border-bottom: none;
}

.menu-icon {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
  color: #667eea;
  font-size: 18px;
}

.menu-title {
  flex: 1;
  font-size: 14px;
  color: #333;
}

.menu-item i.el-icon-arrow-right {
  color: #999;
  font-size: 14px;
}

.logout-section {
  padding: 0 15px 15px;
}

.logout-section .el-button {
  width: 100%;
  height: 48px;
  font-size: 16px;
}

.version-info {
  text-align: center;
  padding: 20px 0;
  font-size: 12px;
  color: #999;
}

@media (max-width: 1024px) {
  .home-header {
    padding: 20px;
  }
  
  .user-info {
    gap: 16px;
  }
  
  .avatar {
    width: 70px;
    height: 90px;
  }
  
  .default-avatar {
    font-size: 28px;
  }
  
  .name-section h3 {
    font-size: 18px;
  }
  
  .factory-info {
    font-size: 14px;
  }
}

@media (max-width: 768px) {
  .home-header {
    padding: 15px;
    min-height: 160px;
  }
  
  .user-info {
    gap: 12px;
  }
  
  .avatar {
    width: 60px;
    height: 80px;
  }
  
  .default-avatar {
    font-size: 24px;
  }
  
  .name-section {
    margin-bottom: 6px;
    gap: 8px;
  }
  
  .name-section h3 {
    font-size: 16px;
  }
  
  .factory-info {
    font-size: 13px;
  }
  
  .position-info {
    font-size: 12px;
  }
  
  .header-actions {
    margin-left: 12px;
    gap: 8px;
  }
  
  .scan-button {
    min-width: 60px;
    padding: 8px;
  }
  
  .scan-icon {
    font-size: 20px;
  }
  
  .scan-button span {
    font-size: 10px;
  }
  
  .function-menu {
    margin: 0 10px 10px;
  }
  
  .menu-item {
    padding: 12px 15px;
  }
  
  .logout-section {
    padding: 0 10px 10px;
  }
}

@media (max-width: 480px) {
  .home-header {
    padding: 20px;
    min-height: 180px;
  }
  
  .user-info {
    gap: 16px;
  }
  
  .avatar {
    width: 70px;
    height: 90px;
  }
  
  .default-avatar {
    font-size: 28px;
  }
  
  .name-section h3 {
    font-size: 18px;
  }
  
  .factory-info {
    font-size: 16px;
  }
  
  .position-info {
    font-size: 15px;
  }
}

@media (max-width: 320px) {
  .home-header {
    padding: 10px;
  }
  
  .user-info {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
  
  .avatar {
    width: 80px;
    height: 100px;
  }
  
  .header-actions {
    margin-left: 0;
    margin-top: 12px;
    align-self: flex-end;
  }
}
</style>
