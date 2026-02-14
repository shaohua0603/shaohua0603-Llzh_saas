import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

// 路由配置
const routes: RouteRecordRaw[] = [
  // 公共路由
  {
    path: '/',
    name: 'Home',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue'),
    meta: { title: '登录' }
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('../views/Register.vue'),
    meta: { title: '注册' }
  },
  {
    path: '/forgot-password',
    name: 'ForgotPassword',
    component: () => import('../views/ForgotPassword.vue'),
    meta: { title: '忘记密码' }
  },
  {
    path: '/bind-referrer',
    name: 'BindReferrer',
    component: () => import('../views/BindReferrer.vue'),
    meta: { title: '绑定介绍人' }
  },
  {
    path: '/user-agreement',
    name: 'UserAgreement',
    component: () => import('../views/common/UserAgreement.vue'),
    meta: { title: '用户协议' }
  },
  {
    path: '/privacy-policy',
    name: 'PrivacyPolicy',
    component: () => import('../views/common/PrivacyPolicy.vue'),
    meta: { title: '隐私政策' }
  },
  
  // 工人移动端路由
  {
    path: '/worker',
    name: 'WorkerLayout',
    component: () => import('../layouts/WorkerLayout.vue'),
    meta: { title: '工人中心', requiresAuth: true, role: 'worker' },
    children: [
      {
        path: 'home',
        name: 'WorkerHome',
        component: () => import('../views/worker/Home.vue'),
        meta: { title: '首页' }
      },
      {
        path: 'dashboard',
        name: 'WorkerDashboard',
        component: () => import('../views/worker/Dashboard.vue'),
        meta: { title: '工作台' }
      },
      {
        path: 'recruitment',
        name: 'WorkerRecruitment',
        component: () => import('../views/worker/Recruitment.vue'),
        meta: { title: '用工招聘' }
      },
      {
        path: 'skill',
        name: 'WorkerSkill',
        component: () => import('../views/worker/Skill.vue'),
        meta: { title: '技能提升' }
      },
      {
        path: 'messages',
        name: 'WorkerMessages',
        component: () => import('../views/worker/Messages.vue'),
        meta: { title: '消息' }
      },
      {
        path: 'profile',
        name: 'WorkerProfile',
        component: () => import('../views/worker/Profile.vue'),
        meta: { title: '我的' }
      },
      {
        path: 'attendance',
        name: 'WorkerAttendance',
        component: () => import('../views/worker/Attendance.vue'),
        meta: { title: '考勤' }
      },
      {
          path: 'leave',
          name: 'WorkerLeave',
          component: () => import('../views/worker/Leave.vue'),
          meta: { title: '请假' }
        },
        {
          path: 'leave-record',
          name: 'WorkerLeaveRecord',
          component: () => import('../views/worker/LeaveRecord.vue'),
          meta: { title: '请假记录' }
        },
        {
          path: 'leave-detail/:id',
          name: 'WorkerLeaveDetail',
          component: () => import('../views/worker/LeaveDetail.vue'),
          meta: { title: '请假详情' }
        },
        {
          path: 'transfer',
          name: 'WorkerTransfer',
          component: () => import('../views/worker/Transfer.vue'),
          meta: { title: '调岗申请' }
        },
        {
          path: 'transfer-record',
          name: 'WorkerTransferRecord',
          component: () => import('../views/worker/TransferRecord.vue'),
          meta: { title: '调岗记录' }
        },
        {
          path: 'reward-punishment',
          name: 'WorkerRewardPunishment',
          component: () => import('../views/worker/RewardPunishment.vue'),
          meta: { title: '我的奖惩' }
        },
        {
          path: 'living-expense',
          name: 'WorkerLivingExpense',
          component: () => import('../views/worker/LivingExpense.vue'),
          meta: { title: '我的生活费' }
        },
        {
          path: 'living-expense-apply',
          name: 'WorkerLivingExpenseApply',
          component: () => import('../views/worker/LivingExpenseApply.vue'),
          meta: { title: '生活费申请' }
        },
        {
          path: 'complaint-suggestion',
          name: 'WorkerComplaintSuggestion',
          component: () => import('../views/worker/ComplaintSuggestion.vue'),
          meta: { title: '投诉/建议' }
        },
        {
          path: 'transfer-detail/:id',
          name: 'WorkerTransferDetail',
          component: () => import('../views/worker/TransferDetail.vue'),
          meta: { title: '调岗详情' }
        },
      {
        path: 'resignation',
        name: 'WorkerResignation',
        component: () => import('../views/worker/Resignation.vue'),
        meta: { title: '离职' }
      },
      {
        path: 'salary',
        name: 'WorkerSalary',
        component: () => import('../views/worker/Salary.vue'),
        meta: { title: '工资条' }
      },
      {
        path: 'salary-detail/:id',
        name: 'WorkerSalaryDetail',
        component: () => import('../views/worker/SalaryDetail.vue'),
        meta: { title: '工资条详情' }
      },
      { path: 'training', name: 'WorkerTraining', component: () => import('../views/worker/Training.vue'), meta: { title: '业务课堂' } },
      {
        path: 'training/detail',
        name: 'WorkerTrainingDetail',
        component: () => import('../views/worker/TrainingDetail.vue'),
        meta: { title: '学习详情' }
      },
      {
        path: 'training/exam',
        name: 'WorkerExamDetail',
        component: () => import('../views/worker/ExamDetail.vue'),
        meta: { title: '考试详情' }
      },
      {
        path: 'message-detail/:id',
        name: 'WorkerMessageDetail',
        component: () => import('../views/worker/MessageDetail.vue'),
        meta: { title: '消息详情' }
      },
      {
        path: 'todo-detail/:id',
        name: 'WorkerTodoDetail',
        component: () => import('../views/worker/TodoDetail.vue'),
        meta: { title: '待办详情' }
      },
      {
        path: 'recruitment-detail/:id',
        name: 'WorkerRecruitmentDetail',
        component: () => import('../views/worker/RecruitmentDetail.vue'),
        meta: { title: '招聘详情' }
      },
      {
        path: 'news-detail/:id',
        name: 'WorkerNewsDetail',
        component: () => import('../views/worker/NewsDetail.vue'),
        meta: { title: '资讯详情' }
      },
      {
        path: 'labor-company-intro',
        name: 'WorkerLaborCompanyIntro',
        component: () => import('../views/worker/LaborCompanyIntro.vue'),
        meta: { title: '劳务公司介绍' }
      },
      {
        path: 'entertainment',
        name: 'WorkerEntertainment',
        component: () => import('../views/worker/Entertainment.vue'),
        meta: { title: '文娱活动' }
      },
      {
        path: 'entertainment-detail/:id',
        name: 'WorkerEntertainmentDetail',
        component: () => import('../views/worker/EntertainmentDetail.vue'),
        meta: { title: '活动详情' }
      },
      {
        path: 'community',
        name: 'WorkerCommunity',
        component: () => import('../views/worker/Community.vue'),
        meta: { title: '我的社团' }
      },
      {
        path: 'communities',
        name: 'WorkerCommunities',
        component: () => import('../views/worker/Communities.vue'),
        meta: { title: '社团列表' }
      },
      {
        path: 'community-detail/:id',
        name: 'WorkerCommunityDetail',
        component: () => import('../views/worker/CommunityDetail.vue'),
        meta: { title: '社团详情' }
      },
      {
        path: 'special-cases',
        name: 'WorkerSpecialCases',
        component: () => import('../views/worker/SpecialCases.vue'),
        meta: { title: '特殊情况' }
      },
      {
        path: 'special-case-detail/:id',
        name: 'WorkerSpecialCaseDetail',
        component: () => import('../views/worker/SpecialCaseDetail.vue'),
        meta: { title: '特殊情况详情' }
      },
      {
        path: 'referral',
        name: 'WorkerReferral',
        component: () => import('../views/worker/Referral.vue'),
        meta: { title: '工作转介绍' }
      },
      {
        path: 'referral-commission',
        name: 'WorkerReferralCommission',
        component: () => import('../views/worker/ReferralCommission.vue'),
        meta: { title: '我的佣金' }
      },
      {
        path: 'resume',
        name: 'WorkerResume',
        component: () => import('../views/worker/Resume.vue'),
        meta: { title: '个人简历' }
      },
      {
        path: 'quick-access-settings',
        name: 'WorkerQuickAccessSettings',
        component: () => import('../views/worker/QuickAccessSettings.vue'),
        meta: { title: '首页快捷入口设置' }
      },
      {  
        path: 'about',
        name: 'WorkerAbout',
        component: () => import('../views/worker/About.vue'),
        meta: { title: '版本信息' }
      },
      {  
        path: 'exam-list',
        name: 'WorkerExamList',
        component: () => import('../views/worker/ExamList.vue'),
        meta: { title: '考试列表' }
      }
    ]
  },
  
  // 劳务公司PC端路由
  {
    path: '/labor-company',
    name: 'LaborCompanyLayout',
    component: () => import('../layouts/LaborCompanyLayout.vue'),
    meta: { title: '劳务公司管理', requiresAuth: true, role: 'labor_company' },
    children: [
      {
        path: 'dashboard',
        name: 'LaborCompanyDashboard',
        component: () => import('../views/labor-company/Dashboard.vue'),
        meta: { title: ' dashboard' }
      },
      {
        path: 'recruitment',
        name: 'LaborCompanyRecruitment',
        component: () => import('../views/labor-company/Recruitment.vue'),
        meta: { title: '招聘管理' }
      },
      {
        path: 'workers',
        name: 'LaborCompanyWorkers',
        component: () => import('../views/labor-company/Workers.vue'),
        meta: { title: '工人管理' }
      },
      {
        path: 'attendance',
        name: 'LaborCompanyAttendance',
        component: () => import('../views/labor-company/Attendance.vue'),
        meta: { title: '考勤管理' }
      },
      {
        path: 'salary',
        name: 'LaborCompanySalary',
        component: () => import('../views/labor-company/Salary.vue'),
        meta: { title: '结算管理' }
      },
      {
        path: 'departments',
        name: 'LaborCompanyDepartments',
        component: () => import('../views/labor-company/Departments.vue'),
        meta: { title: '部门管理' }
      },
      {
        path: 'roles',
        name: 'LaborCompanyRoles',
        component: () => import('../views/labor-company/Roles.vue'),
        meta: { title: '角色管理' }
      }
    ]
  },
  
  // 劳务公司移动端路由
  {
    path: '/labor-company-mobile',
    name: 'LaborCompanyMobileLayout',
    component: () => import('../layouts/LaborCompanyMobileLayout.vue'),
    meta: { title: '劳务公司', requiresAuth: true, role: 'labor_company' },
    children: [
      {
        path: 'home',
        name: 'LaborCompanyMobileHome',
        component: () => import('../views/labor-company/mobile/Home.vue'),
        meta: { title: '首页' }
      },
      {
        path: 'workers',
        name: 'LaborCompanyMobileWorkers',
        component: () => import('../views/labor-company/mobile/Workers.vue'),
        meta: { title: '工人管理' }
      },
      {
        path: 'attendance',
        name: 'LaborCompanyMobileAttendance',
        component: () => import('../views/labor-company/mobile/Attendance.vue'),
        meta: { title: '考勤管理' }
      },
      {
        path: 'profile',
        name: 'LaborCompanyMobileProfile',
        component: () => import('../views/labor-company/mobile/Profile.vue'),
        meta: { title: '我的' }
      }
    ]
  },
  
  // 工厂PC端路由
  {
    path: '/factory',
    name: 'FactoryLayout',
    component: () => import('../layouts/FactoryLayout.vue'),
    meta: { title: '工厂管理', requiresAuth: true, role: 'factory' },
    children: [
      {
        path: 'dashboard',
        name: 'FactoryDashboard',
        component: () => import('../views/factory/Dashboard.vue'),
        meta: { title: '仪表盘' }
      },
      {
        path: 'recruitment',
        name: 'FactoryRecruitment',
        component: () => import('../views/factory/Recruitment.vue'),
        meta: { title: '招聘管理' }
      },
      {
        path: 'workers',
        name: 'FactoryWorkers',
        component: () => import('../views/factory/Workers.vue'),
        meta: { title: '工人管理' }
      },
      { path: 'training', name: 'FactoryTraining', component: () => import('../views/factory/Training.vue'), meta: { title: '业务课堂' } },
      {
        path: 'salary',
        name: 'FactorySalary',
        component: () => import('../views/factory/Salary.vue'),
        meta: { title: '结算管理' }
      },
      {
        path: 'departments',
        name: 'FactoryDepartments',
        component: () => import('../views/factory/Departments.vue'),
        meta: { title: '部门管理' }
      },
      {
        path: 'roles',
        name: 'FactoryRoles',
        component: () => import('../views/factory/Roles.vue'),
        meta: { title: '角色管理' }
      }
    ]
  },
  
  // 工厂移动端路由
  {
    path: '/factory-mobile',
    name: 'FactoryMobileLayout',
    component: () => import('../layouts/FactoryMobileLayout.vue'),
    meta: { title: '工厂', requiresAuth: true, role: 'factory' },
    children: [
      {
        path: 'home',
        name: 'FactoryMobileHome',
        component: () => import('../views/factory/mobile/Home.vue'),
        meta: { title: '首页' }
      },
      {
        path: 'workers',
        name: 'FactoryMobileWorkers',
        component: () => import('../views/factory/mobile/Workers.vue'),
        meta: { title: '工人管理' }
      },
      { path: 'training', name: 'FactoryMobileTraining', component: () => import('../views/factory/mobile/Training.vue'), meta: { title: '业务课堂' } },
      {
        path: 'profile',
        name: 'FactoryMobileProfile',
        component: () => import('../views/factory/mobile/Profile.vue'),
        meta: { title: '我的' }
      }
    ]
  },
  
  // 平台管理员路由
  {
    path: '/admin',
    name: 'AdminLayout',
    component: () => import('../layouts/AdminLayout.vue'),
    meta: { title: '平台管理', requiresAuth: true, role: 'platform_admin' },
    children: [
      {
        path: 'dashboard',
        name: 'AdminDashboard',
        component: () => import('../views/admin/Dashboard.vue'),
        meta: { title: '仪表盘' }
      },
      {
        path: 'tenants',
        name: 'AdminTenants',
        component: () => import('../views/admin/Tenants.vue'),
        meta: { title: '租户管理' }
      },
      {
        path: 'packages',
        name: 'AdminPackages',
        component: () => import('../views/admin/Packages.vue'),
        meta: { title: '套餐配置' }
      },
      {
        path: 'recruitment',
        name: 'AdminRecruitment',
        component: () => import('../views/admin/Recruitment.vue'),
        meta: { title: '招聘管理' }
      },
      {
        path: 'users',
        name: 'AdminUsers',
        component: () => import('../views/admin/Users.vue'),
        meta: { title: '注册用户' }
      },
      {
        path: 'idle-workers',
        name: 'AdminIdleWorkers',
        component: () => import('../views/admin/IdleWorkers.vue'),
        meta: { title: '空闲工人' }
      }
    ]
  },
  
  // 404路由
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('../views/NotFound.vue'),
    meta: { title: '页面不存在' }
  }
]

// 创建路由实例
const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由守卫
router.beforeEach((to, from, next) => {
  // 设置页面标题
  document.title = to.meta.title as string || '蓝领智汇'
  
  // 检查是否需要认证
  if (to.meta.requiresAuth) {
    // 模拟登录状态检查
    const userInfo = localStorage.getItem('userInfo')
    if (userInfo) {
      const user = JSON.parse(userInfo)
      // 检查角色权限
      if (to.meta.role === user.role) {
        next()
      } else {
        next({ name: 'Login' })
      }
    } else {
      next({ name: 'Login' })
    }
  } else {
    // 处理老用户绑定介绍人逻辑
    if (to.name === 'BindReferrer') {
      // 检查是否已登录
      const userInfo = localStorage.getItem('userInfo')
      if (!userInfo) {
        // 未登录，跳转到注册页面
        next({
          name: 'Register',
          query: to.query
        })
      } else {
        // 已登录，继续访问绑定页面
        next()
      }
    } else {
      next()
    }
  }
})

export default router