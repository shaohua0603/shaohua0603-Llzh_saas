<template>
  <div class="worker-home">
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
    
    <!-- 快捷功能 -->
    <div class="quick-functions">
      <div v-for="(item, index) in quickFunctions" :key="index" class="function-item" @click="item.handler">
        <div class="function-icon">
          <el-icon>
            <component :is="item.icon" />
          </el-icon>
        </div>
        <span>{{ item.title }}</span>
      </div>
    </div>
    

    
    <!-- 智惠管家 -->
    <div class="section life-section">
      <div class="section-header">
        <h3>智惠管家</h3>
      </div>
      <div class="life-services">
        <div class="service-item zhihui-butler" @click="goToZhihuiButler">
          <div class="service-icon">
            <img src="../../../assets/zhihui-butler-logo.jpg" alt="智惠管家" class="butler-logo">
          </div>
          <div class="service-content">
            <h4>智惠管家</h4>
            <p>一站式生活服务平台</p>
            <div class="service-tags">
              <span class="tag">美食</span>
              <span class="tag">购物</span>
              <span class="tag">出行</span>
              <span class="tag">住宿</span>
            </div>
          </div>
          <div class="service-arrow">
            <span class="arrow-icon">→</span>
          </div>
        </div>
        
        <div class="service-grid">
          <div class="grid-item" @click="goToZhihuiButler">
            <div class="grid-icon food-icon">
              <img src="https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=food%20icon%20for%20blue-collar%20workers%2C%20simple%20flat%20design%2C%20red%20color%20scheme%2C%20rice%20bowl%20or%20noodles%20icon%2C%20clean%20lines%2C%20white%20background%2C%20professional%20style&image_size=square" alt="美食" class="grid-logo">
            </div>
            <span>美食</span>
          </div>
          <div class="grid-item" @click="goToZhihuiButler">
            <div class="grid-icon shop-icon">
              <img src="https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=shopping%20icon%20for%20blue-collar%20workers%2C%20simple%20flat%20design%2C%20teal%20color%20scheme%2C%20shopping%20bag%20or%20market%20icon%2C%20clean%20lines%2C%20white%20background%2C%20professional%20style&image_size=square" alt="购物" class="grid-logo">
            </div>
            <span>购物</span>
          </div>
          <div class="grid-item" @click="goToZhihuiButler">
            <div class="grid-icon travel-icon">
              <img src="https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=travel%20icon%20for%20blue-collar%20workers%2C%20simple%20flat%20design%2C%20blue%20color%20scheme%2C%20bus%20or%20transport%20icon%2C%20clean%20lines%2C%20white%20background%2C%20professional%20style&image_size=square" alt="出行" class="grid-logo">
            </div>
            <span>出行</span>
          </div>
          <div class="grid-item" @click="goToZhihuiButler">
            <div class="grid-icon home-icon">
              <img src="https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=housing%20icon%20for%20blue-collar%20workers%2C%20simple%20flat%20design%2C%20green%20color%20scheme%2C%20home%20or%20apartment%20icon%2C%20clean%20lines%2C%20white%20background%2C%20professional%20style&image_size=square" alt="住宿" class="grid-logo">
            </div>
            <span>住宿</span>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 消息通知（合并待办和消息） -->
    <div class="section">
      <div class="section-header">
        <div class="header-left">
          <h3>消息通知</h3>
          <div class="notification-badge" v-if="unreadMessageCount > 0 || todoCount > 0">
            <span class="badge-count">{{ unreadMessageCount + todoCount }}</span>
          </div>
        </div>
        <div class="header-right">
          <div class="stat-info" v-if="unreadMessageCount > 0 || todoCount > 0">
            <span class="stat-item">未读: {{ unreadMessageCount }}</span>
            <span class="stat-item">待办: {{ todoCount }}</span>
          </div>
          <a href="javascript:void(0)" class="more" @click="goToMessages">查看全部</a>
        </div>
      </div>
      <div class="message-list">
        <div v-for="(item, index) in displayMessages" :key="item.id || `todo-${item.id}`" class="message-item" @click="item.type === 'todo' ? goToTodoDetail(item) : goToMessageDetail(item)" :class="{ 'unread': item.status === '未读' || item.status === 'pending' || item.status === 'processing' }">
          <div class="message-icon">
            <div v-if="item.type === 'todo'" class="icon-container" :style="{ background: item.bgColor || 'linear-gradient(135deg, #e6a23c 0%, #ebb563 100%)' }">
              <el-icon><component :is="item.icon || Timer" /></el-icon>
            </div>
            <div v-else class="icon-container default-icon">
              <el-icon :size="20"><InfoFilled /></el-icon>
            </div>
          </div>
          <div class="message-content">
            <div class="message-header">
              <h4>{{ item.title }}</h4>
              <span class="message-time">{{ item.time }}</span>
            </div>
            <p>{{ item.content }}</p>
            <div class="message-footer">
              <el-tag v-if="item.status === '未读'" type="danger" size="small" effect="dark">未读</el-tag>
              <el-tag v-else-if="item.status === 'pending' || item.status === 'processing' || item.type === 'todo'" type="warning" size="small" effect="dark">待办</el-tag>
              <el-tag v-else type="info" size="small">已读</el-tag>
            </div>
          </div>
        </div>
        
        <div v-if="displayMessages.length === 0" class="empty-message">
          <div class="empty-icon">
            <el-icon :size="48"><InfoFilled /></el-icon>
          </div>
          <p>暂无消息通知</p>
        </div>
      </div>
    </div>
    
    <!-- 热门资讯 -->
    <div class="section">
      <div class="section-header">
        <h3>热门资讯</h3>
        <a href="javascript:void(0)" class="more" @click="goToNews">查看全部</a>
      </div>
      <div class="news-list">
        <div v-for="newsItem in news" :key="newsItem.id" class="news-item" @click="goToNewsDetail(newsItem)">
          <div class="news-category">{{ newsItem.category }}</div>
          <h4>{{ newsItem.title }}</h4>
          <p class="news-content">{{ newsItem.summary }}</p>
          <div class="news-footer">
            <span class="source">{{ newsItem.author }}</span>
            <span class="date">{{ newsItem.publishDate }}</span>
            <span class="read-count">{{ newsItem.readCount }} 阅读</span>
          </div>
        </div>
        <div v-if="news.length === 0" class="empty-news">
          暂无资讯信息
        </div>
      </div>
    </div>
    
    <!-- 底部占位 -->
    <div class="bottom-placeholder"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElIcon } from 'element-plus'
import { 
  User, Timer, Document, Money, Promotion, 
  Bell, Warning, Grid, SetUp, Reading, InfoFilled,
  ChatLineSquare, Flag, ZoomIn, OfficeBuilding, Key,
  Ticket, Coin, FirstAidKit, Phone, Film, Calendar,
  Notebook, Collection, Star, AlarmClock, Trophy,
  Postcard
} from '@element-plus/icons-vue'

const router = useRouter()

const userInfo = ref<any>(null)
const messages = ref<any[]>([])
const news = ref<any[]>([])
const todos = ref<any[]>([])
const loading = ref(true)
const quickFunctions = ref<any[]>([])

const unreadMessageCount = ref(0)
const todoCount = ref(0)
const displayMessages = ref<any[]>([])

const defaultAvatar = 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20ID%20photo%20of%20a%20Chinese%20male%20worker%20with%20plain%20white%20background%2C%20passport%20style%2C%20front%20view%2C%20clear%20features%2C%20formal%20clothing&image_size=square'



const mockMessages = [
  {
    id: 1,
    title: '新工人入职通知',
    content: '工人张三已通过面试，将于明日入职，请做好接待准备。',
    status: '未读',
    time: '2小时前',
    type: 'notification'
  },
  {
    id: 2,
    title: '考勤异常提醒',
    content: '今日有5条考勤异常待处理，请及时核实。',
    status: '未读',
    time: '5小时前',
    type: 'notification'
  },
  {
    id: 3,
    title: '工资条已发放',
    content: '2026年1月份工资条已全部发放，请通知工人查看。',
    status: '已读',
    time: '昨天',
    type: 'notification'
  },
  {
    id: 4,
    title: '合同到期提醒',
    content: '3份劳动合同即将到期，请及时续签。',
    status: '未读',
    time: '昨天',
    type: 'notification'
  },
  {
    id: 5,
    title: '培训课程通知',
    content: '新员工岗前培训课程将于明天开始，请通知相关人员参加。',
    status: '已读',
    time: '2天前',
    type: 'notification'
  }
]

const mockNews = [
  {
    id: 1,
    title: '劳务派遣行业合规经营指南',
    summary: '详细介绍劳务派遣行业的法律法规、合规经营要点以及风险防控措施。',
    author: '政策法规部',
    publishDate: '2026-02-10',
    readCount: 856,
    category: '政策解读'
  },
  {
    id: 2,
    title: '2026年用工趋势分析报告',
    summary: '分析2026年劳动力市场趋势，企业用工策略建议以及人才管理创新模式。',
    author: '人力资源研究中心',
    publishDate: '2026-02-08',
    readCount: 654,
    category: '行业动态'
  },
  {
    id: 3,
    title: '工人职业发展规划培训',
    summary: '帮助劳务公司更好地指导工人进行职业规划，提升员工满意度和工作效率。',
    author: '培训发展中心',
    publishDate: '2026-02-05',
    readCount: 432,
    category: '培训指导'
  }
]

const functionConfigMap: Record<string, any> = {
  // 招聘管理
  'recruitment-demand': {
    title: '招聘需求',
    icon: Promotion,
    handler: () => router.push('/tenant-mobile/recruitment')
  },
  'resume-management': {
    title: '简历管理',
    icon: Document,
    handler: () => router.push('/tenant-mobile/resume')
  },
  // 面试管理
  'pickup-management': {
    title: '接送管理',
    icon: User,
    handler: () => router.push('/tenant-mobile/interview/pickup')
  },
  'initial-interview': {
    title: '初步面试',
    icon: User,
    handler: () => router.push('/tenant-mobile/interview/initial-interview')
  },
  'interview-invitation': {
    title: '面试邀约',
    icon: Ticket,
    handler: () => router.push('/tenant-mobile/interview/invitation')
  },
  'factory-interview': {
    title: '工厂面试',
    icon: OfficeBuilding,
    handler: () => router.push('/tenant-mobile/interview/factory-interview')
  },
  // 工人管理
  'workers-info': {
    title: '工人信息',
    icon: User,
    handler: () => router.push('/tenant-mobile/workers-list')
  },
  // 合同管理
  'sign-contract': {
    title: '签订合同',
    icon: Document,
    handler: () => router.push('/tenant-mobile/contract')
  },
  // 在职管理
  'living-expense': {
    title: '生活费管理',
    icon: Coin,
    handler: () => router.push('/tenant/on-duty/living-expense')
  },
  'salary-management': {
    title: '工资管理',
    icon: Money,
    handler: () => router.push('/tenant/on-duty/salary')
  },
  'claim-management': {
    title: '理赔管理',
    icon: FirstAidKit,
    handler: () => router.push('/tenant/on-duty/claim')
  },
  'communication-management': {
    title: '沟通管理',
    icon: Phone,
    handler: () => router.push('/tenant/on-duty/communication')
  },
  'entertainment-activity': {
    title: '文娱活动',
    icon: Film,
    handler: () => router.push('/tenant/on-duty/entertainment')
  },
  'registration-management': {
    title: '报名管理',
    icon: Calendar,
    handler: () => router.push('/tenant/on-duty/registration')
  },
  'publish-news': {
    title: '发布资讯',
    icon: Notebook,
    handler: () => router.push('/tenant/on-duty/news')
  },
  'community-management': {
    title: '社团管理',
    icon: Collection,
    handler: () => router.push('/tenant/on-duty/community')
  },
  'special-case': {
    title: '特殊情况',
    icon: Star,
    handler: () => router.push('/tenant/on-duty/special-case')
  },
  'insurance-management': {
    title: '保险管理',
    icon: FirstAidKit,
    handler: () => router.push('/tenant/on-duty/insurance')
  },
  'insurance-record': {
    title: '参保登记',
    icon: Document,
    handler: () => router.push('/tenant/on-duty/insurance-record')
  },
  'attendance-management': {
    title: '考勤管理',
    icon: Timer,
    handler: () => router.push('/tenant-mobile/attendance')
  },
  'leave-management': {
    title: '请假管理',
    icon: AlarmClock,
    handler: () => router.push('/tenant-mobile/on-duty/leave')
  },
  'transfer-management': {
    title: '调岗管理',
    icon: SetUp,
    handler: () => router.push('/tenant/on-duty/transfer')
  },
  'reward-punishment': {
    title: '奖惩管理',
    icon: Trophy,
    handler: () => router.push('/tenant/on-duty/reward-punishment')
  },
  'learning-material': {
    title: '学习材料',
    icon: Reading,
    handler: () => router.push('/tenant/on-duty/learning-material')
  },
  'question-bank': {
    title: '题库管理',
    icon: Notebook,
    handler: () => router.push('/tenant/on-duty/question-bank')
  },
  'learning-time': {
    title: '学习时长',
    icon: Timer,
    handler: () => router.push('/tenant/on-duty/learning-time')
  },
  'exam-management': {
    title: '考试管理',
    icon: Postcard,
    handler: () => router.push('/tenant/on-duty/exam')
  },
  'exam-result': {
    title: '考试成绩',
    icon: Star,
    handler: () => router.push('/tenant/on-duty/exam-result')
  },
  'abnormal-management': {
    title: '异常管理',
    icon: Warning,
    handler: () => router.push('/tenant/on-duty/abnormal')
  },
  'complaint-suggestion': {
    title: '投诉/建议',
    icon: ChatLineSquare,
    handler: () => router.push('/tenant/on-duty/complaint')
  },
  // 离职管理
  'resignation-management': {
    title: '离职管理',
    icon: User,
    handler: () => router.push('/tenant-mobile/resignation')
  },
  // 结算管理
  'referral': {
    title: '工作转介绍',
    icon: Promotion,
    handler: () => router.push('/tenant/referral')
  },
  'commission': {
    title: '佣金发放',
    icon: Coin,
    handler: () => router.push('/tenant/commission')
  },
  'settlement-management': {
    title: '结算管理',
    icon: Money,
    handler: () => router.push('/tenant-mobile/settlement')
  },
  // 系统管理
  'departments': {
    title: '部门管理',
    icon: OfficeBuilding,
    handler: () => router.push('/tenant/departments')
  },
  'roles': {
    title: '角色管理',
    icon: Key,
    handler: () => router.push('/tenant/roles')
  }
}

const getUserInfo = () => {
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
  generateQuickFunctions()
}

const generateQuickFunctions = () => {
  try {
    const savedSettings = localStorage.getItem('laborCompanyQuickAccessSettings')
    if (savedSettings) {
      const settings = JSON.parse(savedSettings)
      let selectedItems = settings.selectedItems || []
      
      // 过滤掉不在functionConfigMap中的项目
      selectedItems = selectedItems.filter(itemId => functionConfigMap[itemId])
      
      // 根据选中的功能生成快捷入口
      quickFunctions.value = selectedItems.map(itemId => {
        return functionConfigMap[itemId] || null
      }).filter(Boolean)
    } else {
      // 默认选择前8个功能（与快捷入口设置页面保持一致）
      const defaultItems = Object.keys(functionConfigMap).slice(0, 8)
      quickFunctions.value = defaultItems.map(itemId => {
        return functionConfigMap[itemId] || null
      }).filter(Boolean)
    }
  } catch (error) {
    console.error('加载快捷入口设置失败:', error)
    // 加载失败时使用默认设置
    const defaultItems = Object.keys(functionConfigMap).slice(0, 8)
    quickFunctions.value = defaultItems.map(itemId => {
      return functionConfigMap[itemId] || null
    }).filter(Boolean)
  }
}

const getMessages = () => {
  try {
    messages.value = mockMessages
    unreadMessageCount.value = messages.value.filter(msg => msg.status === '未读').length
    calculateDisplayMessages()
  } catch (error) {
    console.error('获取消息失败:', error)
  }
}

const getTodos = () => {
  try {
    todos.value = [
      {
        id: 1,
        title: '新工人入职接待',
        content: '工人张三已通过面试，明天入职',
        time: '2026-02-20',
        icon: User,
        bgColor: 'linear-gradient(135deg, #409eff 0%, #66b1ff 100%)',
        status: 'pending',
        type: 'todo'
      },
      {
        id: 2,
        title: '考勤异常处理',
        content: '今日有5条考勤异常待处理',
        time: '今天',
        icon: Timer,
        bgColor: 'linear-gradient(135deg, #e6a23c 0%, #ebb563 100%)',
        status: 'pending',
        type: 'todo'
      },
      {
        id: 3,
        title: '合同到期提醒',
        content: '3份劳动合同即将到期',
        time: '本周',
        icon: Document,
        bgColor: 'linear-gradient(135deg, #909399 0%, #c0c4cc 100%)',
        status: 'pending',
        type: 'todo'
      }
    ]
    todoCount.value = todos.value.filter(t => t.status !== 'completed').length
    calculateDisplayMessages()
  } catch (error) {
    console.error('获取待办事项失败:', error)
  }
}

const calculateDisplayMessages = () => {
  const allItems: any[] = []
  const pendingTodos = todos.value.filter(t => t.status !== 'completed')
  allItems.push(...pendingTodos)
  const unreadMessages = messages.value.filter(msg => msg.status === '未读')
  allItems.push(...unreadMessages)
  displayMessages.value = allItems.slice(0, 3)
}

const getNews = () => {
  try {
    news.value = mockNews
  } catch (error) {
    console.error('获取资讯信息失败:', error)
  }
}

const goToMessages = () => {
  router.push('/tenant-mobile/messages')
}

const goToMessageDetail = (message: any) => {
  router.push(`/tenant/message-detail/${message.id}`)
}

const goToTodoDetail = (todo: any) => {
  router.push(`/tenant/todo-detail/${todo.id}`)
}

const goToNews = () => {
  router.push('/tenant-mobile/news')
}

const goToNewsDetail = (news: any) => {
  router.push(`/tenant/news-detail/${news.id}`)
}

const goToZhihuiButler = () => {
  ElMessage.info('跳转到智惠管家小程序')
}

const goToScanner = () => {
  router.push('/scanner')
}

onMounted(() => {
  getUserInfo()
  getMessages()
  getTodos()
  getNews()
  loading.value = false
})
</script>

<style scoped>
.worker-home {
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
}

.position-info {
  margin: 0;
  font-size: 12px;
  opacity: 0.9;
  line-height: 1.3;
}

.quick-functions {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 15px;
  padding: 0 15px 15px;
}

.function-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #fff;
  padding: 15px 10px;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
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

.function-icon i,
.function-icon .el-icon {
  font-size: 20px;
  color: #667eea;
}

.function-item span {
  font-size: 12px;
  color: #333;
}

.section {
  background-color: #fff;
  margin: 0 15px 15px;
  padding: 15px;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.life-section {
  background: linear-gradient(135deg, #f8faff 0%, #f0f4ff 100%);
  border: 1px solid #e6f0ff;
}

.life-services {
  padding: 0;
}

.service-item {
  display: flex;
  align-items: center;
  padding: 20px;
  border-radius: 12px;
  background-color: #fff;
  transition: all 0.3s ease;
  cursor: pointer;
  margin-bottom: 15px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.service-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(102, 126, 234, 0.15);
}

.service-icon {
  width: 70px;
  height: 70px;
  border-radius: 16px;
  background: linear-gradient(135deg, #f0f9ff 0%, #e6f7ff 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 20px;
  box-shadow: 0 4px 12px rgba(100, 181, 246, 0.2);
}

.butler-logo {
  width: 65px;
  height: 65px;
  object-fit: contain;
}

.service-content {
  flex: 1;
}

.service-content h4 {
  margin: 0 0 8px 0;
  font-size: 18px;
  font-weight: 700;
  color: #333;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.service-content p {
  margin: 0 0 12px 0;
  font-size: 14px;
  color: #666;
  line-height: 1.4;
}

.service-tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.tag {
  padding: 4px 12px;
  background-color: #f0f4ff;
  color: #667eea;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.tag:hover {
  background-color: #667eea;
  color: #fff;
  transform: translateY(-1px);
}

.service-arrow {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #f0f4ff;
  transition: all 0.3s ease;
}

.service-arrow:hover {
  background-color: #667eea;
  transform: translateX(5px);
}

.service-arrow:hover .arrow-icon {
  color: #fff;
}

.arrow-icon {
  font-size: 18px;
  color: #667eea;
  font-weight: bold;
  transition: all 0.3s ease;
}

.service-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 15px;
  margin-top: 20px;
}

.grid-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px 10px;
  border-radius: 12px;
  background-color: #fff;
  transition: all 0.3s ease;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.grid-item:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 16px rgba(102, 126, 234, 0.15);
}

.grid-icon {
  width: 50px;
  height: 50px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 10px;
  font-size: 20px;
  color: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.food-icon {
  background: linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%);
}

.shop-icon {
  background: linear-gradient(135deg, #4ecdc4 0%, #45b7d1 100%);
}

.travel-icon {
  background: linear-gradient(135deg, #45b7d1 0%, #2196f3 100%);
}

.home-icon {
  background: linear-gradient(135deg, #96ceb4 0%, #ffcc5c 100%);
}

.grid-item span {
  font-size: 14px;
  font-weight: 500;
  color: #333;
}

.grid-logo {
  width: 24px;
  height: 24px;
  object-fit: contain;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  flex-wrap: wrap;
  gap: 10px;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 10px;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 15px;
  flex-wrap: wrap;
  justify-content: flex-end;
}

.section-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: bold;
  color: #333;
}

.section-header .more {
  font-size: 14px;
  color: #667eea;
  text-decoration: none;
  white-space: nowrap;
}

.notification-badge {
  background-color: #ff4d4f;
  color: white;
  border-radius: 12px;
  padding: 2px 8px;
  font-size: 12px;
  font-weight: bold;
  min-width: 24px;
  text-align: center;
  box-shadow: 0 2px 4px rgba(255, 77, 79, 0.3);
}

.stat-info {
  display: flex;
  gap: 12px;
  align-items: center;
}

.stat-item {
  font-size: 12px;
  color: #666;
  background-color: #f8f9fa;
  padding: 3px 8px;
  border-radius: 10px;
}



.message-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.message-item {
  padding: 16px;
  background-color: #ffffff;
  border-radius: 12px;
  display: flex;
  align-items: flex-start;
  gap: 14px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  border: 1px solid #f0f0f0;
  cursor: pointer;
}

.message-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.message-item.unread {
  border-left: 4px solid #ff4d4f;
  background-color: #fff7f7;
}

.message-icon {
  flex-shrink: 0;
  margin-top: 2px;
}

.icon-container {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-top: 2px;
}

.default-icon {
  background: linear-gradient(135deg, #1890ff 0%, #40a9ff 100%);
  box-shadow: 0 2px 8px rgba(24, 144, 255, 0.3);
}

.default-icon .el-icon {
  color: white;
}

.message-content {
  flex: 1;
  min-width: 0;
}

.message-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 8px;
}

.message-content h4 {
  margin: 0;
  font-size: 16px;
  font-weight: bold;
  color: #333;
  line-height: 1.3;
}

.message-content p {
  margin: 0 0 12px 0;
  font-size: 14px;
  color: #666;
  line-height: 1.5;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.message-time {
  font-size: 12px;
  color: #999;
  text-align: right;
  flex-shrink: 0;
  margin-left: 12px;
  white-space: nowrap;
}

.message-footer {
  display: flex;
  align-items: center;
}

.news-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.news-item {
  padding: 10px;
  background-color: #f9f9f9;
  border-radius: 8px;
}

.news-item .news-category {
  display: inline-block;
  padding: 2px 8px;
  background-color: #e6f7ff;
  color: #1890ff;
  font-size: 10px;
  border-radius: 10px;
  margin-bottom: 5px;
}

.news-item h4 {
  margin: 0 0 5px 0;
  font-size: 14px;
  font-weight: bold;
  color: #333;
}

.news-item .news-content {
  margin: 0 0 8px 0;
  font-size: 12px;
  color: #666;
  line-height: 1.4;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.news-item .news-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 11px;
  color: #999;
}

.news-item .source {
  flex: 1;
}

.news-item .date {
  flex: 1;
  text-align: center;
}

.news-item .read-count {
  flex: 1;
  text-align: right;
}

.empty-message,
.empty-news {
  text-align: center;
  padding: 40px 0;
  color: #999;
  font-size: 14px;
}

.empty-message .empty-icon {
  margin-bottom: 16px;
  opacity: 0.5;
}

.empty-message p {
  margin: 0;
  font-size: 14px;
  color: #999;
}

.bottom-placeholder {
  height: 20px;
}

/* 移动端适配 */
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
    gap: 6px;
  }
  
  .position-info {
    font-size: 12px;
  }
  
  .quick-functions {
    gap: 10px;
    padding: 0 10px 10px;
  }
  
  .section {
    margin: 0 10px 10px;
    padding: 10px;
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
}
</style>
