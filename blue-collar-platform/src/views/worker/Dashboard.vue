<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElIcon } from 'element-plus'
import { User, Timer, Money, Reading, SwitchButton, Document, Grid, HomeFilled, UserFilled, Operation, Setting, Warning, ChatLineSquare, Flag, Promotion } from '@element-plus/icons-vue'

const router = useRouter()
const userInfo = ref(null)

// 工作台功能入口
const dashboardItems = [
  // 日常功能
  {
    category: '日常功能',
    items: [
      {
        title: '个人信息',
        icon: User,
        path: '/worker/profile'
      },
      {
        title: '考勤请假',
        icon: Timer,
        path: '/worker/attendance'
      },
      {
        title: '工资条',
        icon: Money,
        path: '/worker/salary'
      },
      {
        title: '业务课堂',
        icon: Reading,
        path: '/worker/training'
      },
      {
        title: '离职申请',
        icon: SwitchButton,
        path: '/worker/resignation'
      },
      {
        title: '调岗申请',
        icon: Grid,
        path: '/worker/transfer'
      },
      {
        title: '我的奖惩',
        icon: Document,
        path: '/worker/reward-punishment'
      },
      {
        title: '特殊情况',
        icon: Warning,
        path: '/worker/special-cases'
      },
      {
        title: '生活费申请',
        icon: Money,
        path: '/worker/living-expense'
      },
      {
        title: '投诉/建议',
        icon: ChatLineSquare,
        path: '/worker/complaint-suggestion'
      }
    ]
  },
  // 娱乐活动
  {
    category: '娱乐活动',
    items: [
      {
        title: '文娱活动',
        icon: Operation,
        path: '/worker/entertainment'
      },
      {
        title: '我的社团',
        icon: Flag,
        path: '/worker/community'
      }
    ]
  },
  // 衣食住行
  {
    category: '衣食住行',
    items: [
      {
        title: '智惠管家',
        icon: HomeFilled,
        path: '/worker/housekeeping'
      }
    ]
  },
  // 其他功能
  {
    category: '其他功能',
    items: [
      {
        title: '找工作',
        icon: Grid,
        path: '/worker/recruitment'
      },
      {
        title: '工作转介绍',
        icon: Promotion,
        path: '/worker/referral'
      },
      {
        title: '个人简历',
        icon: Document,
        path: '/worker/resume'
      }
    ]
  }
]

// 获取用户信息
const getUserInfo = () => {
  const storedUserInfo = localStorage.getItem('userInfo')
  // 一寸证件照默认头像
  const defaultAvatar = 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20ID%20photo%20of%20a%20Chinese%20male%20worker%20with%20plain%20white%20background%2C%20passport%20style%2C%20front%20view%2C%20clear%20features%2C%20formal%20clothing&image_size=square'
  
  if (storedUserInfo) {
    userInfo.value = JSON.parse(storedUserInfo)
    // 使用默认证件照头像
    userInfo.value.avatar = defaultAvatar
    // 确保添加新的字段
    if (!userInfo.value.factorySection) userInfo.value.factorySection = '组装车间'
    if (!userInfo.value.factoryLine) userInfo.value.factoryLine = 'A线'
    if (!userInfo.value.positionType) userInfo.value.positionType = '普工'
    if (!userInfo.value.workType) userInfo.value.workType = '派遣工'
    if (!userInfo.value.factoryArea) userInfo.value.factoryArea = 'A区'
    if (!userInfo.value.productionLine) userInfo.value.productionLine = '智能手机组装'
  } else {
    // 默认用户信息
    userInfo.value = {
      name: '张三',
      phone: '138****8888',
      avatar: defaultAvatar,
      currentLaborCompany: '南通富民劳务服务有限公司',
      currentFactory: '富士康科技集团',
      factoryArea: 'A区',
      productionLine: '智能手机组装',
      factorySection: '组装车间',
      factoryLine: 'A线',
      positionType: '普工',
      position: '操作工',
      workType: '派遣工'
    }
  }
}

// 跳转到功能页面
const goToFunction = (item) => {
  router.push(item.path)
}

// 跳转到快捷入口设置页面
const goToQuickAccessSettings = () => {
  router.push('/worker/quick-access-settings')
}

// 页面加载时获取数据
onMounted(() => {
  getUserInfo()
})
</script>

<template>
  <div class="worker-dashboard">
    <!-- 页面标题 -->
    <div class="page-header">
      <h2>工作台</h2>
      <div class="header-actions">
        <div class="quick-access-setting" @click="goToQuickAccessSettings">
          <el-icon><Setting /></el-icon>
          <span>首页快捷入口设置</span>
        </div>
      </div>
    </div>
    
    <!-- 用户信息卡片 -->
    <div class="user-card">
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
            <span v-if="userInfo?.workType === '派遣工' || userInfo?.workType === '派遣'" class="dispatch-tag">派遣</span>
          </div>
          <p class="factory-info">
            {{ userInfo?.currentFactory || '暂无工厂信息' }}
            <span class="factory-location-info">
              {{ userInfo?.factoryArea ? userInfo.factoryArea : '暂无区域信息' }} | {{ userInfo?.productionLine ? userInfo.productionLine : '暂无生产线信息' }}
            </span>
          </p>
          <p class="position-info">{{ userInfo?.positionType || '暂无岗位类型' }} | {{ userInfo?.position || '暂无职位信息' }}</p>
        </div>
      </div>
    </div>
    
    <!-- 功能分类 -->
    <div class="dashboard-content">
      <div v-for="(category, index) in dashboardItems" :key="index" class="category-section">
        <h3 class="category-title">{{ category.category }}</h3>
        <div class="function-grid">
          <div v-for="(item, itemIndex) in category.items" :key="itemIndex" class="function-item" @click="goToFunction(item)">
            <div class="function-icon">
              <el-icon :size="20">
                <component :is="item.icon" />
              </el-icon>
            </div>
            <span class="function-title">{{ item.title }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.worker-dashboard {
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

.page-header h2 {
  margin: 0;
  font-size: 18px;
  font-weight: bold;
  color: #333;
}

.header-actions {
  display: flex;
  align-items: center;
}

.quick-access-setting {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background-color: #f0f0f0;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.quick-access-setting:hover {
  background-color: #e0e0e0;
  transform: translateY(-1px);
}

.quick-access-setting el-icon {
  font-size: 16px;
  color: #667eea;
}

.quick-access-setting span {
  font-size: 14px;
  color: #333;
}

.user-card {
  background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
  color: #fff;
  padding: 16px;
  margin: 15px;
  border-radius: 24px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  position: relative;
  overflow: hidden;
  height: auto;
  min-height: 140px;
}

.user-card::before {
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

.user-info {
  display: flex;
  align-items: center;
  position: relative;
  z-index: 1;
  gap: 16px;
  width: 100%;
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
  border: 1px solid #eaeaea;
}

.user-details {
  flex: 1;
  min-width: 0;
  padding-top: 0;
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

.dispatch-tag {
  background-color: #ff4d4f;
  color: white;
  padding: 2px 8px;
  border-radius: 14px;
  font-size: 10px;
  font-weight: bold;
  box-shadow: 0 2px 4px rgba(255, 77, 79, 0.3);
}

.factory-info {
  margin: 0;
  font-size: 14px;
  font-weight: bold;
  opacity: 1;
  line-height: 1.3;
  letter-spacing: 0.3px;
}

.factory-location-info {
  font-size: 12px;
  font-weight: normal;
  opacity: 0.9;
  background: rgba(255, 255, 255, 0.1);
  padding: 2px 6px;
  border-radius: 6px;
  letter-spacing: 0.3px;
  margin-top: 2px;
  display: inline-block;
}

.position-info {
  margin: 0;
  font-size: 12px;
  opacity: 0.9;
  line-height: 1.3;
}



.dashboard-content {
  padding: 0 15px 20px;
}

.category-section {
  margin-bottom: 20px;
}

.category-title {
  font-size: 16px;
  font-weight: bold;
  color: #333;
  margin: 0 0 12px 0;
  padding-left: 8px;
  border-left: 4px solid #667eea;
}

.function-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
  gap: 12px;
}

.function-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #fff;
  padding: 15px 10px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  cursor: pointer;
  transition: all 0.3s ease;
}

.function-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.function-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 8px;
}

.function-icon i {
  font-size: 20px;
  color: #667eea;
}

.function-title {
  font-size: 12px;
  color: #333;
  text-align: center;
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .user-card {
    margin: 15px;
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
  
  .function-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

@media (max-width: 768px) {
  /* 页面标题移动端适配 */
  .page-header {
    padding: 12px 10px;
  }
  
  .page-header h2 {
    font-size: 16px;
  }
  
  .quick-access-setting {
    padding: 6px 8px;
  }
  
  .quick-access-setting span {
    font-size: 12px;
  }
  
  .quick-access-setting el-icon {
    font-size: 14px;
  }
  
  /* 用户信息卡片移动端适配 */
  .user-card {
    margin: 10px;
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
  
  .dispatch-tag {
    padding: 3px 8px;
    font-size: 10px;
  }
  
  .factory-info {
    font-size: 13px;
    gap: 6px;
  }
  
  .factory-location-info {
    font-size: 11px;
    padding: 2px 4px;
  }
  
  .position-info {
    font-size: 12px;
  }
  
  /* 功能网格移动端适配 */
  .dashboard-content {
    padding: 0 10px 15px;
  }
  
  .function-grid {
    grid-template-columns: repeat(4, 1fr);
    gap: 10px;
  }
  
  .function-item {
    padding: 12px 8px;
  }
  
  .function-icon {
    width: 36px;
    height: 36px;
  }
  
  .function-icon i {
    font-size: 18px;
  }
  
  .function-title {
    font-size: 11px;
  }
}

@media (max-width: 480px) {
  /* 页面标题小屏幕适配 */
  .page-header {
    padding: 14px 12px;
  }
  
  .page-header h2 {
    font-size: 18px;
  }
  
  .quick-access-setting span {
    display: none;
  }
  
  .quick-access-setting {
    padding: 10px;
  }
  
  /* 用户信息卡片小屏幕适配 */
  .user-card {
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
  
  .factory-location-info {
    font-size: 14px;
    margin-top: 4px;
  }
  
  .position-info {
    font-size: 15px;
  }
  
  .dispatch-tag {
    padding: 3px 10px;
    font-size: 12px;
  }
  
  /* 功能网格小屏幕适配 */
  .function-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 12px;
  }
  
  .function-item {
    padding: 14px 10px;
  }
  
  .function-icon {
    width: 40px;
    height: 40px;
  }
  
  .function-icon i {
    font-size: 20px;
  }
  
  .function-title {
    font-size: 12px;
  }
}

@media (max-width: 320px) {
  /* 超小屏幕适配 */
  .user-card {
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
  
  .name-section h3 {
    font-size: 14px;
  }
  
  .function-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* 触摸反馈优化 */
.quick-access-setting {
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;
}

.quick-access-setting:active {
  transform: scale(0.95);
  transition: transform 0.1s ease;
}
</style>