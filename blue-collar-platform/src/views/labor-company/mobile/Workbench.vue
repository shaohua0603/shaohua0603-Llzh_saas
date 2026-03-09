<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElIcon } from 'element-plus'
import { 
  User, Timer, Document, Money, Promotion, 
  Bell, Warning, Grid, SetUp, Reading, ChatLineSquare,
  Flag, Operation, DataAnalysis, OfficeBuilding, 
  List, School, Ticket, Folder, Menu, Setting,
  Coin, FirstAidKit, Phone, AlarmClock, Trophy,
  Star, Collection, Notebook, Postcard, Brush,
  Film, Calendar, House, Management, Key
} from '@element-plus/icons-vue'

const router = useRouter()
const userInfo = ref<any>(null)

const menuGroups = [
  // 招聘管理
  {
    category: '招聘管理',
    items: [
      { title: '招聘需求', path: '/tenant-mobile/recruitment', icon: Promotion },
      { title: '简历管理', path: '/tenant-mobile/resume', icon: Document }
    ]
  },
  // 面试管理
  {
    category: '面试管理',
    items: [
      { title: '接送管理', path: '/tenant-mobile/interview/pickup', icon: User },
      { title: '初步面试', path: '/tenant-mobile/interview/initial-interview', icon: User },
      { title: '面试邀约', path: '/tenant-mobile/interview/invitation', icon: Ticket },
      { title: '工厂面试', path: '/tenant-mobile/interview/factory-interview', icon: OfficeBuilding }
    ]
  },
  // 工人管理
  {
    category: '工人管理',
    items: [
      { title: '工人信息', path: '/tenant-mobile/workers-list', icon: User }
    ]
  },
  // 合同管理
  {
    category: '合同管理',
    items: [
      { title: '签订合同', path: '/tenant-mobile/contract', icon: Document }
    ]
  },
  // 在职管理 - 所有二级和三级功能平铺展示
  {
    category: '在职管理',
    items: [
      // 工作与生活
      { title: '生活费管理', path: '/tenant/on-duty/living-expense', icon: Coin },
      { title: '工资管理', path: '/tenant/on-duty/salary', icon: Money },
      { title: '理赔管理', path: '/tenant/on-duty/claim', icon: FirstAidKit },
      // 管理与关怀
      { title: '沟通管理', path: '/tenant/on-duty/communication', icon: Phone },
      { title: '文娱活动', path: '/tenant/on-duty/entertainment', icon: Film },
      { title: '报名管理', path: '/tenant/on-duty/registration', icon: Calendar },
      { title: '发布资讯', path: '/tenant/on-duty/news', icon: Notebook },
      { title: '社团管理', path: '/tenant/on-duty/community', icon: Collection },
      // 特殊情况
      { title: '特殊情况', path: '/tenant/on-duty/special-case', icon: Star },
      // 保险管理
      { title: '保险管理', path: '/tenant/on-duty/insurance', icon: FirstAidKit },
      { title: '参保登记', path: '/tenant/on-duty/insurance-record', icon: Document },
      // 考勤和请假
      { title: '考勤管理', path: '/tenant-mobile/attendance', icon: Timer },
      { title: '请假管理', path: '/tenant-mobile/on-duty/leave', icon: AlarmClock },
      // 调岗
      { title: '调岗管理', path: '/tenant/on-duty/transfer', icon: SetUp },
      // 奖惩
      { title: '奖惩管理', path: '/tenant/on-duty/reward-punishment', icon: Trophy },
      // 业务课堂
      { title: '学习材料', path: '/tenant/on-duty/learning-material', icon: Reading },
      { title: '题库管理', path: '/tenant/on-duty/question-bank', icon: Notebook },
      { title: '学习时长', path: '/tenant/on-duty/learning-time', icon: Timer },
      { title: '考试管理', path: '/tenant/on-duty/exam', icon: Postcard },
      { title: '考试成绩', path: '/tenant/on-duty/exam-result', icon: Star },
      // 异常和投诉
      { title: '异常管理', path: '/tenant/on-duty/abnormal', icon: Warning },
      { title: '投诉/建议', path: '/tenant/on-duty/complaint', icon: ChatLineSquare }
    ]
  },
  // 离职管理
  {
    category: '离职管理',
    items: [
      { title: '离职管理', path: '/tenant-mobile/resignation', icon: User }
    ]
  },
  // 结算管理
  {
    category: '结算管理',
    items: [
      { title: '工作转介绍', path: '/tenant/referral', icon: Promotion },
      { title: '佣金发放', path: '/tenant/commission', icon: Coin },
      { title: '结算管理', path: '/tenant-mobile/settlement', icon: Money }
    ]
  }
]

const getUserInfo = () => {
  const storedUserInfo = localStorage.getItem('userInfo')
  const defaultAvatar = 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20ID%20photo%20of%20a%20Chinese%20male%20worker%20with%20plain%20white%20background%2C%20passport%20style%2C%20front%20view%2C%20clear%20features%2C%20formal%20clothing&image_size=square'
  
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

const goToFunction = (item: any) => {
  router.push(item.path)
}

const goToQuickAccessSettings = () => {
  // 快捷入口设置页面
  router.push('/tenant/quick-access-settings')
}

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
          </div>
          <p class="factory-info">
            {{ userInfo?.companyName || '劳务公司' }}
          </p>
          <p class="position-info">{{ userInfo?.position || '招聘经理' }}</p>
        </div>
      </div>
    </div>
    
    <!-- 功能分类 -->
    <div class="dashboard-content">
      <div v-for="(category, index) in menuGroups" :key="index" class="category-section">
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

.factory-info {
  margin: 0;
  font-size: 14px;
  font-weight: bold;
  opacity: 1;
  line-height: 1.3;
  letter-spacing: 0.3px;
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
  
  .factory-info {
    font-size: 13px;
    gap: 6px;
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
  
  .position-info {
    font-size: 15px;
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
