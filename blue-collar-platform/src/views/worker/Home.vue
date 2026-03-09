<script setup>
import { ref, onMounted, h } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElIcon } from 'element-plus'
import { Timer, Money, Reading, Grid, User, Operation, InfoFilled, ZoomIn, Document, Warning, ChatLineSquare, Flag, Promotion } from '@element-plus/icons-vue'

const router = useRouter()
const userInfo = ref(null)
const messages = ref([])
const news = ref([])
const todos = ref([])
const loading = ref(true)
const quickFunctions = ref([])

// 计算未读消息数量
const unreadMessageCount = ref(0)
// 计算待办任务数量
const todoCount = ref(0)

// 计算显示的消息列表（最多3条，优先显示工资条和待办）
const displayMessages = ref([])

// 模拟消息通知数据
const mockMessages = [
  {
    id: 1,
    userId: 1,
    userType: 'worker',
    type: 'notification',
    title: '工资条已发放',
    content: '2026年1月份工资条已发放，请查看。',
    status: '未读',
    createTime: '2026-02-05 09:00:00'
  },
  {
    id: 2,
    userId: 1,
    userType: 'worker',
    type: 'notification',
    title: '新招聘信息',
    content: '有3个新的招聘职位发布，适合您的技能水平，请查看。',
    status: '已读',
    createTime: '2026-01-15 14:00:00'
  },
  {
    id: 3,
    userId: 1,
    userType: 'worker',
    type: 'notification',
    title: '培训课程通知',
    content: '您已报名的安全培训课程将于明天开始，请准时参加。',
    status: '已读',
    createTime: '2026-01-10 10:00:00'
  },
  {
    id: 4,
    userId: 1,
    userType: 'worker',
    type: 'notification',
    title: '考勤异常提醒',
    content: '您2026年1月30日的考勤记录异常，请及时核对。',
    status: '未读',
    createTime: '2026-02-04 16:00:00'
  },
  {
    id: 5,
    userId: 1,
    userType: 'worker',
    type: 'notification',
    title: '节日福利通知',
    content: '春节将至，公司为每位员工准备了节日福利，请于2月6日至8日到行政部领取。',
    status: '已读',
    createTime: '2026-02-01 10:00:00'
  },
  {
    id: 6,
    userId: 1,
    userType: 'worker',
    type: 'notification',
    title: '技能竞赛报名',
    content: '公司将于2月20日举办技能竞赛，欢迎各位员工报名参加，有丰厚奖品等待大家。',
    status: '未读',
    createTime: '2026-02-03 09:30:00'
  },
  {
    id: 7,
    userId: 1,
    userType: 'worker',
    type: 'notification',
    title: '生产线调整通知',
    content: '因生产计划调整，从2月10日起，您所在的生产线工作时间将调整为早8点至晚5点。',
    status: '已读',
    createTime: '2026-02-02 14:30:00'
  },
  {
    id: 8,
    userId: 1,
    userType: 'worker',
    type: 'notification',
    title: '健康体检通知',
    content: '公司将于2月15日组织年度健康体检，请各位员工按时参加。',
    status: '未读',
    createTime: '2026-02-05 10:00:00'
  }
]

// 模拟资讯数据
const mockNews = [
  // 技能提升分类
  {
    id: 1,
    title: '制造业数字化技能培训指南',
    summary: '本指南详细介绍了制造业数字化转型中工人需要掌握的基础数字化操作技能，包括设备操作、数据分析等核心能力。',
    content: '本指南详细介绍了制造业数字化转型中工人需要掌握的基础数字化操作技能，包括设备操作、数据分析等核心能力。\n\n1. 数字化设备操作技能\n   - 数控机床操作\n   - 工业机器人编程\n   - 智能设备维护\n\n2. 数据分析能力\n   - 生产数据采集\n   - 质量数据分析\n   - 效率优化分析\n\n3. 数字化工具使用\n   - CAD/CAM软件操作\n   - 物联网设备管理\n   - 数字化文档处理\n\n通过本培训指南的学习，工人可以快速适应制造业数字化转型的需求，提高自身的职业竞争力。',
    author: '技能培训中心',
    publishDate: '2026-02-10',
    readCount: 1258,
    category: '技能提升',
    type: 'skill'
  },
  {
    id: 2,
    title: '2026年成人高考报名指南',
    summary: '详细介绍2026年成人高考的报名条件、考试科目、复习方法以及学历提升对职业发展的重要性。',
    content: '详细介绍2026年成人高考的报名条件、考试科目、复习方法以及学历提升对职业发展的重要性。\n\n一、报名条件\n1. 年满18周岁\n2. 具有高中或中专学历\n3. 身体健康，遵纪守法\n\n二、考试科目\n1. 高中起点升专科：语文、数学、英语\n2. 高中起点升本科：语文、数学、英语、史地综合或理化综合\n3. 专科起点升本科：政治、英语、专业课\n\n三、复习方法\n1. 制定合理的学习计划\n2. 选择适合自己的复习资料\n3. 参加考前辅导班\n4. 多做历年真题\n\n四、学历提升的重要性\n1. 提高职业竞争力\n2. 增加薪资待遇\n3. 拓宽职业发展空间\n4. 提升个人综合素质\n\n2026年成人高考报名将于8月份开始，有意向的工人朋友可以提前做好准备。',
    author: '教育考试院',
    publishDate: '2026-02-08',
    readCount: 987,
    category: '学历提升',
    type: 'education'
  },
  {
    id: 3,
    title: '从操作工到班组长的晋升路径',
    summary: '本文详细分析了从普通操作工晋升为班组长的必备条件、能力要求以及职业发展规划建议。',
    content: '本文详细分析了从普通操作工晋升为班组长的必备条件、能力要求以及职业发展规划建议。\n\n一、必备条件\n1. 工作表现优秀，业绩突出\n2. 具备一定的工作年限\n3. 掌握本岗位的核心技能\n4. 具有良好的团队合作精神\n\n二、能力要求\n1. 管理能力\n   - 人员管理\n   - 生产调度\n   - 团队建设\n\n2. 技术能力\n   - 熟练掌握生产工艺\n   - 解决生产中的技术问题\n   - 指导新员工操作\n\n3. 沟通能力\n   - 与上级领导沟通\n   - 与同事协作\n   - 与其他部门协调\n\n三、晋升准备\n1. 主动学习管理知识\n2. 积极参与团队活动\n3. 勇于承担责任\n4. 建立良好的人际关系\n\n四、职业发展规划\n1. 操作工→高级操作工→班组长\n2. 班组长→生产主管→生产经理\n3. 不断学习，提升自身能力\n4. 制定长期职业目标\n\n通过本文的指导，希望能够帮助更多的操作工朋友实现职业晋升的目标。',
    author: '职业发展中心',
    publishDate: '2026-02-05',
    readCount: 756,
    category: '岗位提升',
    type: 'career'
  },
  {
    id: 4,
    title: '自动化设备操作技能培训',
    summary: '随着工厂自动化程度提高，掌握自动化设备操作技能成为工人职业发展的重要竞争力。',
    content: '随着工厂自动化程度提高，掌握自动化设备操作技能成为工人职业发展的重要竞争力。\n\n1. 自动化设备的种类\n   - 自动化生产线\n   - 机器人工作站\n   - 智能检测设备\n\n2. 操作技能要求\n   - 设备编程\n   - 故障排查\n   - 日常维护\n\n3. 培训方法\n   - 理论学习\n   - 实操训练\n   - 案例分析\n\n4. 职业发展\n   - 自动化设备操作员\n   - 自动化设备维护工程师\n   - 自动化系统集成工程师\n\n掌握自动化设备操作技能，不仅可以提高工作效率，还可以为自己的职业发展开辟更广阔的空间。',
    author: '技能培训中心',
    publishDate: '2026-02-03',
    readCount: 654,
    category: '技能提升',
    type: 'skill'
  },
  {
    id: 5,
    title: '职业技能等级证书报考指南',
    summary: '介绍各类职业技能等级证书的报考条件、考试内容以及对薪资待遇的影响。',
    content: '介绍各类职业技能等级证书的报考条件、考试内容以及对薪资待遇的影响。\n\n1. 证书等级划分\n   - 初级（五级）\n   - 中级（四级）\n   - 高级（三级）\n   - 技师（二级）\n   - 高级技师（一级）\n\n2. 报考条件\n   - 初级：年满16周岁，初中以上学历\n   - 中级：取得初级证书2年以上或有4年以上工作经验\n   - 高级：取得中级证书2年以上或有8年以上工作经验\n   - 技师：取得高级证书3年以上\n   - 高级技师：取得技师证书3年以上\n\n3. 考试内容\n   - 理论知识\n   - 操作技能\n   - 综合评审（技师及以上）\n\n4. 对薪资的影响\n   - 初级：月薪增加300-500元\n   - 中级：月薪增加500-800元\n   - 高级：月薪增加800-1200元\n   - 技师：月薪增加1200-2000元\n   - 高级技师：月薪增加2000元以上\n\n5. 报考流程\n   - 网上报名\n   - 资格审核\n   - 缴费\n   - 参加考试\n   - 领取证书\n\n职业技能等级证书是工人职业能力的重要证明，也是提高薪资待遇的有效途径。',
    author: '人力资源和社会保障部',
    publishDate: '2026-02-01',
    readCount: 543,
    category: '技能提升',
    type: 'skill'
  },
  {
    id: 6,
    title: '班组长管理技能培训',
    summary: '针对班组长岗位的管理技能培训，包括团队管理、生产调度、质量管理等核心能力提升。',
    content: '针对班组长岗位的管理技能培训，包括团队管理、生产调度、质量管理等核心能力提升。\n\n1. 团队管理\n   - 人员招聘与培训\n   - 绩效考核与激励\n   - 团队文化建设\n   - 冲突管理\n\n2. 生产调度\n   - 生产计划制定\n   - 资源合理配置\n   - 进度跟踪与调整\n   - 应急情况处理\n\n3. 质量管理\n   - 质量标准制定\n   - 质量检测与控制\n   - 质量问题分析与解决\n   - 持续质量改进\n\n4. 成本管理\n   - 原材料消耗控制\n   - 能源消耗管理\n   - 生产效率提升\n   - 成本核算与分析\n\n5. 安全管理\n   - 安全制度执行\n   - 安全培训与教育\n   - 安全隐患排查\n   - 安全事故处理\n\n通过本培训，班组长可以全面提升管理能力，更好地履行岗位职责，为企业的发展做出更大的贡献。',
    author: '企业管理培训中心',
    publishDate: '2026-01-28',
    readCount: 432,
    category: '岗位提升',
    type: 'career'
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
      idCard: '1101**********1234',
      gender: '男',
      age: '30',
      birthDate: '1993-01-01',
      address: '北京市朝阳区',
      currentLaborCompany: '南通富民劳务服务有限公司',
      currentFactory: '富士康科技集团',
      factoryArea: 'A区',
      productionLine: '智能手机组装',
      factorySection: '组装车间',
      factoryLine: 'A线',
      position: '操作工',
      positionType: '普工',
      entryDate: '2023-01-01',
      workType: '派遣工',
      contractStatus: '已签约',
      contractEndDate: '2024-12-31',
      emergencyContact: '李四',
      emergencyPhone: '139****9999',
      bankCard: '6222**********1234',
      bankName: '中国工商银行',
      role: 'worker' // 默认角色为工人
    }
  }
  // 生成快捷入口
  generateQuickFunctions()
}

// 跳转到考勤页面
const goToAttendance = () => {
  router.push('/worker/attendance')
}

// 跳转到工资条页面
const goToSalary = () => {
  router.push('/worker/salary')
}

// 跳转到业务课堂页面
const goToTraining = () => {
  router.push('/worker/training')
}

// 跳转到招聘页面
const goToRecruitment = () => {
  router.push('/worker/recruitment')
}

// 跳转到文娱活动页面
const goToEntertainment = () => {
  router.push('/worker/entertainment')
}

// 功能入口配置映射
const functionConfigMap = {
  'personal-info': {
    title: '个人信息',
    icon: 's-custom',
    handler: () => router.push('/worker/profile')
  },
  'attendance': {
    title: '考勤请假',
    icon: 'time',
    handler: goToAttendance
  },
  'salary': {
    title: '工资条',
    icon: 's-finance',
    handler: goToSalary
  },
  'training': {
    title: '业务课堂',
    icon: 'reading',
    handler: goToTraining
  },
  'resignation': {
    title: '离职申请',
    icon: 's-operation',
    handler: () => router.push('/worker/resignation')
  },
  'transfer': {
    title: '调岗申请',
    icon: 's-grid',
    handler: () => router.push('/worker/transfer')
  },
  'reward-punishment': {
    title: '我的奖惩',
    icon: 'document',
    handler: () => router.push('/worker/reward-punishment')
  },
  'special-cases': {
    title: '特殊情况',
    icon: 'warning',
    handler: () => router.push('/worker/special-cases')
  },
  'living-expense': {
    title: '生活费申请',
    icon: 's-finance',
    handler: () => router.push('/worker/living-expense')
  },
  'complaint-suggestion': {
    title: '投诉/建议',
    icon: 'chat-line-square',
    handler: () => router.push('/worker/complaint-suggestion')
  },
  'entertainment': {
    title: '文娱活动',
    icon: 's-operation',
    handler: goToEntertainment
  },
  'community': {
    title: '我的社团',
    icon: 'flag',
    handler: () => router.push('/worker/community')
  },
  'recruitment': {
    title: '找工作',
    icon: 's-grid',
    handler: goToRecruitment
  },
  'referral': {
    title: '工作转介绍',
    icon: 'promotion',
    handler: () => router.push('/worker/referral')
  },
  'resume': {
    title: '个人简历',
    icon: 'document',
    handler: () => router.push('/worker/resume')
  }
}

// 生成快捷入口
const generateQuickFunctions = () => {
  const role = userInfo.value?.role || 'worker'
  
  if (role === 'worker') {
    // 从localStorage读取快捷入口设置
    try {
      const savedSettings = localStorage.getItem('quickAccessSettings')
      if (savedSettings) {
        const settings = JSON.parse(savedSettings)
        let selectedItems = settings.selectedItems || []
        
        // 过滤掉不在functionConfigMap中的项目（如已删除的技能证书）
        selectedItems = selectedItems.filter(itemId => functionConfigMap[itemId])
        
        // 根据选中的功能生成快捷入口
        quickFunctions.value = selectedItems.map(itemId => {
          return functionConfigMap[itemId] || null
        }).filter(Boolean)
      } else {
        // 默认选择前8个功能
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
  } else if (role === 'labor_company') {
    // 劳务公司快捷入口
    quickFunctions.value = [
      {
        title: '人员管理',
        icon: 's-custom',
        handler: () => router.push('/tenant/workers')
      },
      {
        title: '考勤管理',
        icon: 'time',
        handler: () => router.push('/tenant/attendance')
      },
      {
        title: '薪资管理',
        icon: 's-finance',
        handler: () => router.push('/tenant/salary')
      },
      {
        title: '招聘管理',
        icon: 's-grid',
        handler: () => router.push('/tenant/recruitment')
      }
    ]
  } else if (role === 'factory') {
    // 工厂快捷入口
    quickFunctions.value = [
      {
        title: '工人管理',
        icon: 's-custom',
        handler: () => router.push('/factory/workers')
      },
      {
        title: '部门管理',
        icon: 's-operation',
        handler: () => router.push('/factory/departments')
      },
      {
        title: '培训管理',
        icon: 'reading',
        handler: () => router.push('/factory/training')
      },
      {
        title: '薪资管理',
        icon: 's-finance',
        handler: () => router.push('/factory/salary')
      }
    ]
  }
}

// 图标映射
const iconMap = {
  'time': Timer,
  's-finance': Money,
  'reading': Reading,
  's-grid': Grid,
  's-custom': User,
  's-operation': Operation,
  'document': Document,
  'warning': Warning,
  'chat-line-square': ChatLineSquare,
  'flag': Flag,
  'promotion': Promotion
}

// 获取图标组件
const getIconComponent = (iconName) => {
  return iconMap[iconName] || Timer
}

// 获取消息通知
const getMessages = () => {
  try {
    // 直接赋值
    messages.value = mockMessages
    console.log('Messages loaded:', messages.value)
    
    // 计算未读消息数量
    unreadMessageCount.value = messages.value.filter(msg => msg.status === '未读').length
    
    // 计算显示的消息列表
    calculateDisplayMessages()
  } catch (error) {
    console.error('获取消息失败:', error)
  }
}

// 获取待办事项
const getTodos = () => {
  try {
    // 模拟待办事项数据
    todos.value = [
      {
        id: 1,
        title: '完成岗前培训',
        content: '请在3天内完成富士康科技集团的岗前培训课程',
        status: 'pending',
        deadline: '2026-01-30',
        type: 'training'
      },
      {
        id: 2,
        title: '提交请假申请',
        content: '您的请假申请需要劳务公司审核，请耐心等待',
        status: 'processing',
        submitDate: '2026-01-25',
        type: 'leave'
      },
      {
        id: 3,
        title: '填写工作满意度调查',
        content: '请在2月15日前完成工作满意度调查',
        status: 'pending',
        deadline: '2026-02-15',
        type: 'survey'
      }
    ]
    console.log('Todos loaded:', todos.value)
    
    // 计算待办任务数量
    todoCount.value = todos.value.filter(t => t.status !== 'completed').length
    
    // 计算显示的消息列表
    calculateDisplayMessages()
  } catch (error) {
    console.error('获取待办事项失败:', error)
  }
}

// 计算显示的消息列表
const calculateDisplayMessages = () => {
  // 合并消息和待办事项
  const allItems = []
  
  // 添加工资条消息（优先显示）
  const salaryMessages = messages.value.filter(msg => msg.title.includes('工资条'))
  allItems.push(...salaryMessages)
  
  // 添加待办事项（优先显示）
  const pendingTodos = todos.value.filter(t => t.status !== 'completed')
  allItems.push(...pendingTodos)
  
  // 添加其他未读消息
  const otherUnreadMessages = messages.value.filter(msg => !msg.title.includes('工资条') && msg.status === '未读')
  allItems.push(...otherUnreadMessages)
  
  // 限制最多显示3条
  displayMessages.value = allItems.slice(0, 3)
}

// 获取资讯信息
const getNews = () => {
  try {
    // 直接赋值
    // 从三个分类中各取一条最新资讯
    const skillNews = mockNews.filter(item => item.category === '技能提升').slice(0, 1)
    const educationNews = mockNews.filter(item => item.category === '学历提升').slice(0, 1)
    const positionNews = mockNews.filter(item => item.category === '岗位提升').slice(0, 1)
    
    // 合并并按发布日期排序
    news.value = [...skillNews, ...educationNews, ...positionNews]
      .sort((a, b) => new Date(b.publishDate) - new Date(a.publishDate))
  } catch (error) {
    console.error('获取资讯信息失败:', error)
  }
}

// 跳转到消息详情页面
const goToMessageDetail = (message) => {
  router.push(`/worker/message-detail/${message.id}`)
}

// 跳转到待办详情页面
const goToTodoDetail = (todo) => {
  router.push(`/worker/todo-detail/${todo.id}`)
}

// 跳转到资讯详情页面
const goToNewsDetail = (news) => {
  router.push(`/worker/news-detail/${news.id}`)
}

// 跳转到资讯列表页面
const goToNews = () => {
  router.push('/worker/skill')
}

// 跳转到消息页面
const goToMessages = () => {
  router.push('/worker/messages')
}

// 跳转到智惠管家小程序
const goToZhihuiButler = () => {
  // 这里可以添加跳转到智惠管家小程序的逻辑
  // 由于是模拟环境，我们可以显示一个提示信息
  ElMessage.info('跳转到智惠管家小程序')
  // 实际项目中，这里可以使用小程序的跳转API
  // 例如：wx.navigateToMiniProgram({ appId: '小程序APPID', path: '页面路径' })
}

// 跳转到扫一扫页面
const goToScanner = () => {
  router.push('/scanner')
}

// 页面加载时获取数据
onMounted(() => {
  getUserInfo()
  // 直接调用，不使用 await
  getMessages()
  getTodos()
  getNews()
  loading.value = false
})
</script>

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
            <component :is="getIconComponent(item.icon)" />
          </el-icon>
        </div>
        <span>{{ item.title }}</span>
      </div>
    </div>
    
    <!-- 衣食住行 -->
    <div class="section life-section">
      <div class="section-header">
        <h3>衣食住行</h3>
      </div>
      <div class="life-services">
        <!-- 智惠管家入口 -->
        <div class="service-item zhihui-butler" @click="goToZhihuiButler">
          <div class="service-icon">
            <img src="../../assets/zhihui-butler-logo.jpg" alt="智惠管家" class="butler-logo">
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
        
        <!-- 生活服务快捷入口 -->
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
    
    <!-- 消息通知 -->
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
        <!-- 显示计算后的消息列表 -->
        <div v-for="(item, index) in displayMessages" :key="item.id || `todo-${item.id}`" class="message-item" @click="item.type === 'notification' ? goToMessageDetail(item) : goToTodoDetail(item)" :class="{ 'unread': item.status === '未读' || item.status === 'pending' || item.status === 'processing' }">
          <div class="message-icon">
            <!-- 工资条消息图标 -->
            <div v-if="item.title && item.title.includes('工资条')" class="icon-container salary-icon">
              <img src="../../assets/coin-design/gold_coin_new.svg" alt="金币" class="coin-icon">
            </div>
            <!-- 培训待办图标 -->
            <div v-else-if="item.type === 'training'" class="icon-container training-icon">
              <ElIcon :size="20"><Reading /></ElIcon>
            </div>
            <!-- 请假待办图标 -->
            <div v-else-if="item.type === 'leave'" class="icon-container leave-icon">
              <ElIcon :size="20"><Operation /></ElIcon>
            </div>
            <!-- 招聘消息图标 -->
            <div v-else-if="item.title && item.title.includes('招聘')" class="icon-container recruitment-icon">
              <ElIcon :size="20"><Grid /></ElIcon>
            </div>
            <!-- 默认图标 -->
            <div v-else class="icon-container default-icon">
              <ElIcon :size="20"><InfoFilled /></ElIcon>
            </div>
          </div>
          <div class="message-content">
            <div class="message-header">
              <h4>{{ item.title }}</h4>
              <span class="message-time">{{ item.createTime || item.deadline || item.submitDate }}</span>
            </div>
            <p>{{ item.content }}</p>
            <div class="message-footer">
              <el-tag v-if="item.status === '未读'" type="danger" size="small" effect="dark">未读</el-tag>
              <el-tag v-else-if="item.status === 'pending' || item.status === 'processing'" type="warning" size="small" effect="dark">待办</el-tag>
              <el-tag v-else type="info" size="small">已读</el-tag>
            </div>
          </div>
        </div>
        
        <!-- 空状态 -->
        <div v-if="displayMessages.length === 0" class="empty-message">
          <div class="empty-icon">
            <ElIcon :size="48"><InfoFilled /></ElIcon>
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

/* .factory-details 样式已移除，区域和产品线信息现在显示在.factory-info行中 */

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

/* 衣食住行样式 */
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

/* 生活服务快捷入口 */
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

/* Font Awesome 图标样式 */
.grid-icon i {
  font-size: 24px;
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

.training-icon {
  background: linear-gradient(135deg, #1890ff 0%, #40a9ff 100%);
  box-shadow: 0 2px 8px rgba(24, 144, 255, 0.3);
}

.training-icon .el-icon {
  color: white;
}

.leave-icon {
  background: linear-gradient(135deg, #fa8c16 0%, #ffa940 100%);
  box-shadow: 0 2px 8px rgba(250, 140, 22, 0.3);
}

.leave-icon .el-icon {
  color: white;
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

.salary-icon {
  background: linear-gradient(135deg, #ffd700 0%, #ffed4e 100%);
  animation: pulse 2s infinite;
  box-shadow: 0 2px 8px rgba(255, 215, 0, 0.3);
}

.recruitment-icon {
  background: linear-gradient(135deg, #52c41a 0%, #73d13d 100%);
  box-shadow: 0 2px 8px rgba(82, 196, 26, 0.3);
}

.recruitment-icon .el-icon {
  color: white;
}

.default-icon {
  background: linear-gradient(135deg, #1890ff 0%, #40a9ff 100%);
  box-shadow: 0 2px 8px rgba(24, 144, 255, 0.3);
}

.default-icon .el-icon {
  color: white;
}

.coin-icon {
  width: 24px;
  height: 24px;
  display: block;
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
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
  
  .factory-location-info {
    font-size: 14px;
    margin-top: 4px;
  }
  
  .position-info {
    font-size: 15px;
  }
  
  .header-actions {
    margin-left: 12px;
  }
  
  .scan-button {
    min-width: 65px;
    padding: 10px;
  }
  
  .scan-icon {
    font-size: 22px;
  }
  
  .scan-button span {
    font-size: 12px;
  }
  
  .dispatch-tag {
    padding: 3px 10px;
    font-size: 12px;
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