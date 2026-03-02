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
    path: '/test/pickup',
    name: 'TestPickup',
    component: () => import('../views/test/TestPickup.vue'),
    meta: { title: '测试接送管理 API' }
  },
  {
    path: '/test/simple',
    name: 'SimpleTest',
    component: () => import('../views/test/SimpleTest.vue'),
    meta: { title: '简单测试页面' }
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
  {
    path: '/flow-designer-demo',
    name: 'FlowDesignerDemo',
    component: () => import('../views/common/FlowDesignerDemo.vue'),
    meta: { title: '流程设计器演示' }
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
        path: 'home',
        name: 'LaborCompanyHome',
        component: () => import('../views/labor-company/Home.vue'),
        meta: { title: '首页', hideInMenu: true }
      },
      {
        path: 'todo',
        name: 'LaborCompanyTodo',
        component: () => import('../views/labor-company/Todo.vue'),
        meta: { title: '待办任务' }
      },
      {
        path: 'messages',
        name: 'LaborCompanyMessages',
        component: () => import('../views/labor-company/Messages.vue'),
        meta: { title: '消息通知' }
      },
      {
        path: 'warnings',
        name: 'LaborCompanyWarnings',
        component: () => import('../views/labor-company/Warnings.vue'),
        meta: { title: '预警信息' }
      },
      {
        path: 'recruitment',
        name: 'LaborCompanyRecruitment',
        component: () => import('../views/labor-company/Recruitment.vue'),
        meta: { title: '招聘管理' }
      },
      {
        path: 'recruitment/detail/:id',
        name: 'LaborCompanyRecruitmentDetail',
        component: () => import('../views/labor-company/recruitment/RecruitmentDetail.vue'),
        meta: { title: '招聘需求详情' }
      },
      {
        path: 'recruitment/add',
        name: 'LaborCompanyRecruitmentAdd',
        component: () => import('../views/labor-company/recruitment/RecruitmentForm.vue'),
        meta: { title: '新增招聘需求' }
      },
      {
        path: 'recruitment/edit/:id',
        name: 'LaborCompanyRecruitmentEdit',
        component: () => import('../views/labor-company/recruitment/RecruitmentForm.vue'),
        meta: { title: '编辑招聘需求' }
      },
      {
        path: 'recruitment/resume',
        name: 'LaborCompanyResume',
        component: () => import('../views/labor-company/recruitment/Resume.vue'),
        meta: { title: '简历管理' }
      },
      {
        path: 'recruitment/resume/:id',
        name: 'LaborCompanyResumeDetail',
        component: () => import('../views/labor-company/recruitment/ResumeDetail.vue'),
        meta: { title: '简历详情' }
      },
      {
        path: 'interview/pickup',
        name: 'LaborCompanyPickup',
        component: () => import('../views/labor-company/interview/Pickup.vue'),
        meta: { title: '接送管理' }
      },
      {
        path: 'interview/pickup/add',
        name: 'LaborCompanyPickupAdd',
        component: () => import('../views/labor-company/interview/PickupForm.vue'),
        meta: { title: '新增接送' }
      },
      {
        path: 'interview/pickup/edit/:id',
        name: 'LaborCompanyPickupEdit',
        component: () => import('../views/labor-company/interview/PickupForm.vue'),
        meta: { title: '编辑接送' }
      },
      {
        path: 'interview/pickup/:id',
        name: 'LaborCompanyPickupDetail',
        component: () => import('../views/labor-company/interview/PickupDetail.vue'),
        meta: { title: '接送详情' }
      },
      {
        path: 'interview/initial-interview',
        name: 'LaborCompanyInitialInterview',
        component: () => import('../views/labor-company/interview/InitialInterview.vue'),
        meta: { title: '初步面试' }
      },
      {
        path: 'interview/initial-interview/add',
        name: 'LaborCompanyInitialInterviewAdd',
        component: () => import('../views/labor-company/interview/InitialInterviewForm.vue'),
        meta: { title: '新增初步面试' }
      },
      {
        path: 'interview/initial-interview/edit/:id',
        name: 'LaborCompanyInitialInterviewEdit',
        component: () => import('../views/labor-company/interview/InitialInterviewForm.vue'),
        meta: { title: '编辑初步面试' }
      },
      {
        path: 'interview/initial-interview/:id',
        name: 'LaborCompanyInitialInterviewDetail',
        component: () => import('../views/labor-company/interview/InitialInterviewDetail.vue'),
        meta: { title: '初步面试详情' }
      },
      {
        path: 'interview/invitation',
        name: 'LaborCompanyInterviewInvitation',
        component: () => import('../views/labor-company/interview/InterviewInvitation.vue'),
        meta: { title: '面试邀约' }
      },
      {
        path: 'interview/invitation/add',
        name: 'LaborCompanyInterviewInvitationAdd',
        component: () => import('../views/labor-company/interview/InterviewInvitationForm.vue'),
        meta: { title: '新增面试邀约' }
      },
      {
        path: 'interview/invitation/edit/:id',
        name: 'LaborCompanyInterviewInvitationEdit',
        component: () => import('../views/labor-company/interview/InterviewInvitationForm.vue'),
        meta: { title: '编辑面试邀约' }
      },
      {
        path: 'interview/invitation/:id',
        name: 'LaborCompanyInterviewInvitationDetail',
        component: () => import('../views/labor-company/interview/InterviewInvitationDetail.vue'),
        meta: { title: '面试邀约详情' }
      },
      {
        path: 'interview/factory-interview',
        name: 'LaborCompanyFactoryInterview',
        component: () => import('../views/labor-company/interview/FactoryInterview.vue'),
        meta: { title: '工厂面试' }
      },
      {
        path: 'interview/factory-interview/add',
        name: 'LaborCompanyFactoryInterviewAdd',
        component: () => import('../views/labor-company/interview/FactoryInterviewForm.vue'),
        meta: { title: '新增工厂面试' }
      },
      {
        path: 'interview/factory-interview/edit/:id',
        name: 'LaborCompanyFactoryInterviewEdit',
        component: () => import('../views/labor-company/interview/FactoryInterviewForm.vue'),
        meta: { title: '编辑工厂面试' }
      },
      {
        path: 'interview/factory-interview/:id',
        name: 'LaborCompanyFactoryInterviewDetail',
        component: () => import('../views/labor-company/interview/FactoryInterviewDetail.vue'),
        meta: { title: '工厂面试详情' }
      },
      {
        path: 'contract',
        name: 'LaborCompanyContract',
        component: () => import('../views/labor-company/contract/Contract.vue'),
        meta: { title: '签订合同' }
      },
      {
        path: 'contract/add',
        name: 'LaborCompanyContractAdd',
        component: () => import('../views/labor-company/contract/ContractForm.vue'),
        meta: { title: '新增合同' }
      },
      {
        path: 'contract/edit/:id',
        name: 'LaborCompanyContractEdit',
        component: () => import('../views/labor-company/contract/ContractForm.vue'),
        meta: { title: '编辑合同' }
      },
      {
        path: 'contract/:id',
        name: 'LaborCompanyContractDetail',
        component: () => import('../views/labor-company/contract/ContractDetail.vue'),
        meta: { title: '合同详情' }
      },
      {
        path: 'workers',
        name: 'LaborCompanyWorkers',
        component: () => import('../views/labor-company/Workers.vue'),
        meta: { title: '工人管理' }
      },
      {
        path: 'workers/:id',
        name: 'LaborCompanyWorkerDetail',
        component: () => import('../views/labor-company/WorkerDetail.vue'),
        meta: { title: '工人信息详情' }
      },
      {
        path: 'workers/:id/transfer',
        name: 'LaborCompanyWorkerTransfer',
        component: () => import('../views/labor-company/WorkerTransfer.vue'),
        meta: { title: '岗位调动' }
      },
      {
        path: 'workers/create',
        name: 'LaborCompanyWorkerCreate',
        component: () => import('../views/labor-company/WorkerCreate.vue'),
        meta: { title: '新增工人' }
      },
      {
        path: 'workers/:id/edit',
        name: 'LaborCompanyWorkerEdit',
        component: () => import('../views/labor-company/WorkerEdit.vue'),
        meta: { title: '编辑工人' }
      },
      {
        path: 'attendance',
        name: 'LaborCompanyAttendance',
        component: () => import('../views/labor-company/Attendance.vue'),
        meta: { title: '考勤管理' }
      },
      {
        path: 'on-duty/living-expense',
        name: 'LaborCompanyLivingExpense',
        component: () => import('../views/labor-company/on-duty/LivingExpense.vue'),
        meta: { title: '生活费管理' }
      },
      {
        path: 'on-duty/salary',
        name: 'LaborCompanyOnDutySalary',
        component: () => import('../views/labor-company/on-duty/Salary.vue'),
        meta: { title: '工资管理' }
      },
      {
        path: 'on-duty/claim',
        name: 'LaborCompanyClaim',
        component: () => import('../views/labor-company/on-duty/Claim.vue'),
        meta: { title: '理赔管理' }
      },
      {
        path: 'on-duty/special-case',
        name: 'LaborCompanySpecialCase',
        component: () => import('../views/labor-company/on-duty/SpecialCase.vue'),
        meta: { title: '特殊情况管理' }
      },
      {
        path: 'on-duty/insurance',
        name: 'LaborCompanyInsurance',
        component: () => import('../views/labor-company/on-duty/Insurance.vue'),
        meta: { title: '保险管理' }
      },
      {
        path: 'on-duty/insurance-record',
        name: 'LaborCompanyInsuranceRecord',
        component: () => import('../views/labor-company/on-duty/InsuranceRecord.vue'),
        meta: { title: '参保登记' }
      },
      {
        path: 'on-duty/leave',
        name: 'LaborCompanyLeave',
        component: () => import('../views/labor-company/on-duty/Leave.vue'),
        meta: { title: '请假管理' }
      },
      {
        path: 'on-duty/leave-detail',
        name: 'LaborCompanyLeaveDetail',
        component: () => import('../views/labor-company/on-duty/LeaveDetail.vue'),
        meta: { title: '请假详情' }
      },
      {
        path: 'on-duty/transfer',
        name: 'LaborCompanyTransfer',
        component: () => import('../views/labor-company/on-duty/Transfer.vue'),
        meta: { title: '调岗管理' }
      },
      {
        path: 'on-duty/transfer/detail/:id',
        name: 'LaborCompanyTransferDetail',
        component: () => import('../views/labor-company/on-duty/TransferDetail.vue'),
        meta: { title: '调岗详情' }
      },
      {
        path: 'on-duty/reward-punishment',
        name: 'LaborCompanyRewardPunishment',
        component: () => import('../views/labor-company/on-duty/RewardPunishment.vue'),
        meta: { title: '奖惩管理' }
      },
      {
        path: 'on-duty/learning-material',
        name: 'LaborCompanyLearningMaterial',
        component: () => import('../views/labor-company/on-duty/LearningMaterial.vue'),
        meta: { title: '学习材料' }
      },
      {
        path: 'on-duty/question-bank',
        name: 'LaborCompanyQuestionBank',
        component: () => import('../views/labor-company/on-duty/QuestionBank.vue'),
        meta: { title: '题库管理' }
      },
      {
        path: 'on-duty/learning-time',
        name: 'LaborCompanyLearningTime',
        component: () => import('../views/labor-company/on-duty/LearningTime.vue'),
        meta: { title: '学习时长管理' }
      },
      {
        path: 'on-duty/exam',
        name: 'LaborCompanyExam',
        component: () => import('../views/labor-company/on-duty/Exam.vue'),
        meta: { title: '考试管理' }
      },
      {
        path: 'on-duty/exam-result',
        name: 'LaborCompanyExamResult',
        component: () => import('../views/labor-company/on-duty/ExamResult.vue'),
        meta: { title: '考试成绩' }
      },
      {
        path: 'on-duty/abnormal',
        name: 'LaborCompanyAbnormal',
        component: () => import('../views/labor-company/on-duty/Abnormal.vue'),
        meta: { title: '异常管理' }
      },
      {
        path: 'on-duty/complaint',
        name: 'LaborCompanyComplaint',
        component: () => import('../views/labor-company/on-duty/Complaint.vue'),
        meta: { title: '投诉/建议' }
      },
      {
        path: 'on-duty/communication',
        name: 'LaborCompanyCommunication',
        component: () => import('../views/labor-company/on-duty/Communication.vue'),
        meta: { title: '沟通管理' }
      },
      {
        path: 'on-duty/entertainment',
        name: 'LaborCompanyEntertainment',
        component: () => import('../views/labor-company/on-duty/Entertainment.vue'),
        meta: { title: '文娱活动' }
      },
      {
        path: 'on-duty/registration',
        name: 'LaborCompanyRegistration',
        component: () => import('../views/labor-company/on-duty/Registration.vue'),
        meta: { title: '报名管理' }
      },
      {
        path: 'on-duty/news',
        name: 'LaborCompanyNews',
        component: () => import('../views/labor-company/on-duty/News.vue'),
        meta: { title: '发布资讯' }
      },
      {
        path: 'on-duty/community',
        name: 'LaborCompanyCommunity',
        component: () => import('../views/labor-company/on-duty/Community.vue'),
        meta: { title: '社团管理' }
      },
      {
        path: 'resignation',
        name: 'LaborCompanyResignation',
        component: () => import('../views/labor-company/resignation/Resignation.vue'),
        meta: { title: '离职管理' }
      },
      {
        path: 'resignation/add',
        name: 'LaborCompanyResignationAdd',
        component: () => import('../views/labor-company/resignation/ResignationForm.vue'),
        meta: { title: '新增离职' }
      },
      {
        path: 'resignation/edit/:id',
        name: 'LaborCompanyResignationEdit',
        component: () => import('../views/labor-company/resignation/ResignationForm.vue'),
        meta: { title: '编辑离职' }
      },
      {
        path: 'resignation/:id',
        name: 'LaborCompanyResignationDetail',
        component: () => import('../views/labor-company/resignation/ResignationDetail.vue'),
        meta: { title: '离职详情' }
      },
      {
        path: 'settlement',
        name: 'LaborCompanySettlement',
        component: () => import('../views/labor-company/settlement/Settlement.vue'),
        meta: { title: '结算管理' }
      },
      {
        path: 'settlement/add',
        name: 'LaborCompanySettlementAdd',
        component: () => import('../views/labor-company/settlement/SettlementForm.vue'),
        meta: { title: '新建结算' }
      },
      {
        path: 'settlement/edit/:id',
        name: 'LaborCompanySettlementEdit',
        component: () => import('../views/labor-company/settlement/SettlementForm.vue'),
        meta: { title: '编辑结算' }
      },
      {
        path: 'settlement/:id',
        name: 'LaborCompanySettlementDetail',
        component: () => import('../views/labor-company/settlement/SettlementDetail.vue'),
        meta: { title: '结算详情' }
      },
      {
        path: 'referral',
        name: 'LaborCompanyReferral',
        component: () => import('../views/labor-company/referral/Referral.vue'),
        meta: { title: '工作转介绍' }
      },
      {
        path: 'referral/add',
        name: 'LaborCompanyReferralAdd',
        component: () => import('../views/labor-company/referral/ReferralForm.vue'),
        meta: { title: '新增转介绍' }
      },
      {
        path: 'referral/edit/:id',
        name: 'LaborCompanyReferralEdit',
        component: () => import('../views/labor-company/referral/ReferralForm.vue'),
        meta: { title: '编辑转介绍' }
      },
      {
        path: 'referral/:id',
        name: 'LaborCompanyReferralDetail',
        component: () => import('../views/labor-company/referral/ReferralDetail.vue'),
        meta: { title: '转介绍详情' }
      },
      {
        path: 'commission',
        name: 'LaborCompanyCommission',
        component: () => import('../views/labor-company/commission/Commission.vue'),
        meta: { title: '佣金发放' }
      },
      {
        path: 'commission/:id',
        name: 'LaborCompanyCommissionDetail',
        component: () => import('../views/labor-company/commission/CommissionDetail.vue'),
        meta: { title: '佣金详情' }
      },
      {
        path: 'commission/rule',
        name: 'LaborCompanyCommissionRule',
        component: () => import('../views/labor-company/commission/CommissionRule.vue'),
        meta: { title: '佣金规则配置' }
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
        path: 'departments/add',
        name: 'LaborCompanyDepartmentAdd',
        component: () => import('../views/labor-company/department/DepartmentForm.vue'),
        meta: { title: '新增部门' }
      },
      {
        path: 'departments/edit/:id',
        name: 'LaborCompanyDepartmentEdit',
        component: () => import('../views/labor-company/department/DepartmentForm.vue'),
        meta: { title: '编辑部门' }
      },
      {
        path: 'departments/:id',
        name: 'LaborCompanyDepartmentDetail',
        component: () => import('../views/labor-company/department/DepartmentDetail.vue'),
        meta: { title: '部门详情' }
      },
      {
        path: 'roles',
        name: 'LaborCompanyRoles',
        component: () => import('../views/labor-company/Roles.vue'),
        meta: { title: '角色管理' }
      },
      {
        path: 'company-culture',
        name: 'LaborCompanyCompanyCulture',
        component: () => import('../views/labor-company/CompanyCulture.vue'),
        meta: { title: '企业文化介绍' }
      },
      {
        path: 'position-culture',
        name: 'LaborCompanyPositionCulture',
        component: () => import('../views/labor-company/PositionCulture.vue'),
        meta: { title: '岗位文化介绍' }
      },
      {
        path: 'employees',
        name: 'LaborCompanyEmployees',
        component: () => import('../views/labor-company/Employees.vue'),
        meta: { title: '正式员工' }
      },
      {
        path: 'employees/add',
        name: 'LaborCompanyEmployeeAdd',
        component: () => import('../views/labor-company/employee/EmployeeForm.vue'),
        meta: { title: '新增员工' }
      },
      {
        path: 'employees/edit/:id',
        name: 'LaborCompanyEmployeeEdit',
        component: () => import('../views/labor-company/employee/EmployeeForm.vue'),
        meta: { title: '编辑员工' }
      },
      {
        path: 'employees/:id',
        name: 'LaborCompanyEmployeeDetail',
        component: () => import('../views/labor-company/employee/EmployeeDetail.vue'),
        meta: { title: '员工详情' }
      },
      {
        path: 'positions',
        name: 'LaborCompanyPositions',
        component: () => import('../views/labor-company/Positions.vue'),
        meta: { title: '岗位管理' }
      },
      {
        path: 'rules',
        name: 'LaborCompanyRules',
        component: () => import('../views/labor-company/Rules.vue'),
        meta: { title: '规则配置' }
      },
      {
        path: 'menu-config',
        name: 'LaborCompanyMenuConfig',
        component: () => import('../views/labor-company/MenuConfig.vue'),
        meta: { title: '菜单配置' }
      },
      {
        path: 'dictionary',
        name: 'LaborCompanyDictionary',
        component: () => import('../views/labor-company/Dictionary.vue'),
        meta: { title: '字典管理' }
      },
      {
        path: 'system-parameter',
        name: 'LaborCompanySystemParameter',
        component: () => import('../views/labor-company/SystemParameter.vue'),
        meta: { title: '系统参数' }
      },
      {
        path: 'process',
        name: 'LaborCompanyProcess',
        component: () => import('../views/labor-company/Process.vue'),
        meta: { title: '流程管理' }
      },
      {
        path: 'process-config',
        name: 'LaborCompanyProcessConfig',
        component: () => import('../views/labor-company/ProcessConfig.vue'),
        meta: { title: '流程配置' }
      },
      {
        path: 'attachment',
        name: 'LaborCompanyAttachment',
        component: () => import('../views/labor-company/Attachment.vue'),
        meta: { title: '附件管理' }
      },
      {
        path: 'template-config',
        name: 'LaborCompanyTemplateConfig',
        component: () => import('../views/labor-company/TemplateConfig.vue'),
        meta: { title: '模版配置' }
      },
      {
        path: 'print-config',
        name: 'LaborCompanyPrintConfig',
        component: () => import('../views/labor-company/PrintConfig.vue'),
        meta: { title: '打印配置' }
      },
      {
        path: 'quick-access-settings',
        name: 'LaborCompanyQuickAccessSettings',
        component: () => import('../views/labor-company/QuickAccessSettings.vue'),
        meta: { title: '首页快捷入口设置' }
      },
      {
        path: 'todo-detail/:id',
        name: 'LaborCompanyTodoDetail',
        component: () => import('../views/labor-company/TodoDetail.vue'),
        meta: { title: '待办详情' }
      },
      {
        path: 'message-detail/:id',
        name: 'LaborCompanyMessageDetail',
        component: () => import('../views/labor-company/MessageDetail.vue'),
        meta: { title: '消息详情' }
      },
      {
        path: 'warning-detail/:id',
        name: 'LaborCompanyWarningDetail',
        component: () => import('../views/labor-company/WarningDetail.vue'),
        meta: { title: '预警详情' }
      },
      {
        path: 'table-example',
        name: 'LaborCompanyTableExample',
        component: () => import('../views/labor-company/TableExample.vue'),
        meta: { title: '表格示例' }
      },
      {
        path: 'form-example',
        name: 'LaborCompanyFormExample',
        component: () => import('../views/common/FormExample.vue'),
        meta: { title: '表单示例' }
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
        path: 'home',
        name: 'FactoryHome',
        component: () => import('../views/factory/Home.vue'),
        meta: { title: '首页', hideInMenu: true }
      },
      {
        path: 'todo',
        name: 'FactoryTodo',
        component: () => import('../views/factory/Todo.vue'),
        meta: { title: '待办任务' }
      },
      {
        path: 'messages',
        name: 'FactoryMessages',
        component: () => import('../views/factory/Messages.vue'),
        meta: { title: '消息通知' }
      },
      {
        path: 'warnings',
        name: 'FactoryWarnings',
        component: () => import('../views/factory/Warnings.vue'),
        meta: { title: '预警信息' }
      },
      {
        path: 'recruitment',
        name: 'FactoryRecruitment',
        component: () => import('../views/factory/Recruitment.vue'),
        meta: { title: '招聘管理' }
      },
      {
        path: 'factory-interview',
        name: 'FactoryInterview',
        component: () => import('../views/factory/interview/FactoryInterview.vue'),
        meta: { title: '工厂面试' }
      },
      {
        path: 'factory-interview/detail/:id',
        name: 'FactoryInterviewDetail',
        component: () => import('../views/factory/interview/FactoryInterviewDetail.vue'),
        meta: { title: '工厂面试详情' }
      },
      {
        path: 'factory-interview/edit/:id',
        name: 'FactoryInterviewEdit',
        component: () => import('../views/factory/interview/FactoryInterviewEdit.vue'),
        meta: { title: '编辑工厂面试' }
      },
      // {
      //   path: 'contract',
      //   name: 'FactoryContract',
      //   component: () => import('../views/factory/contract/Contract.vue'),
      //   meta: { title: '签订合同' }
      // },
      // {
      //   path: 'contract/:id',
      //   name: 'FactoryContractDetail',
      //   component: () => import('../views/factory/contract/ContractDetail.vue'),
      //   meta: { title: '合同详情' }
      // },
      {
        path: 'workers',
        name: 'FactoryWorkers',
        component: () => import('../views/factory/Workers.vue'),
        meta: { title: '工人管理' }
      },
      {
        path: 'workers/:id',
        name: 'FactoryWorkerDetail',
        component: () => import('../views/labor-company/WorkerDetail.vue'),
        meta: { title: '工人信息详情' }
      },
      {
        path: 'workers/:id/transfer',
        name: 'FactoryWorkerTransfer',
        component: () => import('../views/labor-company/WorkerTransfer.vue'),
        meta: { title: '岗位调动' }
      },
      { path: 'training', name: 'FactoryTraining', component: () => import('../views/factory/Training.vue'), meta: { title: '业务课堂' } },
      {
        path: 'on-duty/transfer',
        name: 'FactoryTransfer',
        component: () => import('../views/labor-company/on-duty/Transfer.vue'),
        meta: { title: '调岗管理' }
      },
      {
        path: 'on-duty/reward-punishment',
        name: 'FactoryRewardPunishment',
        component: () => import('../views/labor-company/on-duty/RewardPunishment.vue'),
        meta: { title: '奖惩管理' }
      },
      {
        path: 'on-duty/learning-material',
        name: 'FactoryLearningMaterial',
        component: () => import('../views/labor-company/on-duty/LearningMaterial.vue'),
        meta: { title: '学习材料' }
      },
      {
        path: 'on-duty/question-bank',
        name: 'FactoryQuestionBank',
        component: () => import('../views/labor-company/on-duty/QuestionBank.vue'),
        meta: { title: '题库管理' }
      },
      {
        path: 'on-duty/learning-time',
        name: 'FactoryLearningTime',
        component: () => import('../views/labor-company/on-duty/LearningTime.vue'),
        meta: { title: '学习时长管理' }
      },
      {
        path: 'on-duty/exam',
        name: 'FactoryExam',
        component: () => import('../views/labor-company/on-duty/Exam.vue'),
        meta: { title: '考试管理' }
      },
      {
        path: 'on-duty/exam-result',
        name: 'FactoryExamResult',
        component: () => import('../views/labor-company/on-duty/ExamResult.vue'),
        meta: { title: '考试成绩' }
      },
      {
        path: 'on-duty/abnormal',
        name: 'FactoryAbnormal',
        component: () => import('../views/labor-company/on-duty/Abnormal.vue'),
        meta: { title: '异常管理' }
      },
      {
        path: 'on-duty/complaint',
        name: 'FactoryComplaint',
        component: () => import('../views/labor-company/on-duty/Complaint.vue'),
        meta: { title: '投诉/建议' }
      },
      {
        path: 'resignation',
        name: 'FactoryResignation',
        component: () => import('../views/labor-company/resignation/Resignation.vue'),
        meta: { title: '离职管理' }
      },
      {
        path: 'settlement',
        name: 'FactorySettlement',
        component: () => import('../views/labor-company/settlement/Settlement.vue'),
        meta: { title: '结算管理' }
      },
      {
        path: 'settlement/add',
        name: 'FactorySettlementAdd',
        component: () => import('../views/labor-company/settlement/SettlementForm.vue'),
        meta: { title: '新建结算' }
      },
      {
        path: 'settlement/edit/:id',
        name: 'FactorySettlementEdit',
        component: () => import('../views/labor-company/settlement/SettlementForm.vue'),
        meta: { title: '编辑结算' }
      },
      {
        path: 'referral',
        name: 'FactoryReferral',
        component: () => import('../views/labor-company/referral/Referral.vue'),
        meta: { title: '工作转介绍' }
      },
      {
        path: 'commission',
        name: 'FactoryCommission',
        component: () => import('../views/labor-company/commission/Commission.vue'),
        meta: { title: '佣金发放' }
      },
      {
        path: 'commission/:id',
        name: 'FactoryCommissionDetail',
        component: () => import('../views/labor-company/commission/CommissionDetail.vue'),
        meta: { title: '佣金详情' }
      },
      {
        path: 'salary',
        name: 'FactorySalary',
        component: () => import('../views/factory/Salary.vue'),
        meta: { title: '结算管理' }
      },
      {
        path: 'resignation',
        name: 'FactoryResignation',
        component: () => import('../views/factory/resignation/Resignation.vue'),
        meta: { title: '离职管理' }
      },
      {
        path: 'resignation/add',
        name: 'FactoryResignationAdd',
        component: () => import('../views/factory/resignation/ResignationForm.vue'),
        meta: { title: '新增离职' }
      },
      {
        path: 'resignation/edit/:id',
        name: 'FactoryResignationEdit',
        component: () => import('../views/factory/resignation/ResignationForm.vue'),
        meta: { title: '编辑离职' }
      },
      {
        path: 'resignation/:id',
        name: 'FactoryResignationDetail',
        component: () => import('../views/factory/resignation/ResignationDetail.vue'),
        meta: { title: '离职详情' }
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
      },
      {
        path: 'company-culture',
        name: 'FactoryCompanyCulture',
        component: () => import('../views/labor-company/CompanyCulture.vue'),
        meta: { title: '企业文化介绍' }
      },
      {
        path: 'position-culture',
        name: 'FactoryPositionCulture',
        component: () => import('../views/labor-company/PositionCulture.vue'),
        meta: { title: '岗位文化介绍' }
      },
      {
        path: 'employees',
        name: 'FactoryEmployees',
        component: () => import('../views/labor-company/Employees.vue'),
        meta: { title: '正式员工' }
      },
      {
        path: 'positions',
        name: 'FactoryPositions',
        component: () => import('../views/labor-company/Positions.vue'),
        meta: { title: '岗位管理' }
      },
      {
        path: 'rules',
        name: 'FactoryRules',
        component: () => import('../views/labor-company/Rules.vue'),
        meta: { title: '规则配置' }
      },
      {
        path: 'menu-config',
        name: 'FactoryMenuConfig',
        component: () => import('../views/labor-company/MenuConfig.vue'),
        meta: { title: '菜单配置' }
      },
      {
        path: 'dictionary',
        name: 'FactoryDictionary',
        component: () => import('../views/factory/Dictionary.vue'),
        meta: { title: '字典管理' }
      },
      {
        path: 'system-params',
        name: 'FactorySystemParams',
        component: () => import('../views/labor-company/SystemParameter.vue'),
        meta: { title: '系统参数' }
      },
      {
        path: 'processes',
        name: 'FactoryProcesses',
        component: () => import('../views/labor-company/Process.vue'),
        meta: { title: '流程管理' }
      },
      {
        path: 'process-config',
        name: 'FactoryProcessConfig',
        component: () => import('../views/labor-company/ProcessConfig.vue'),
        meta: { title: '流程配置' }
      },
      {
        path: 'attachments',
        name: 'FactoryAttachments',
        component: () => import('../views/labor-company/Attachment.vue'),
        meta: { title: '附件管理' }
      },
      {
        path: 'print',
        name: 'FactoryPrint',
        component: () => import('../views/labor-company/PrintConfig.vue'),
        meta: { title: '打印管理' }
      },
      {
        path: 'quick-access-settings',
        name: 'FactoryQuickAccessSettings',
        component: () => import('../views/factory/QuickAccessSettings.vue'),
        meta: { title: '首页快捷入口设置' }
      },
      {
        path: 'todo-detail/:id',
        name: 'FactoryTodoDetail',
        component: () => import('../views/factory/TodoDetail.vue'),
        meta: { title: '待办详情' }
      },
      {
        path: 'message-detail/:id',
        name: 'FactoryMessageDetail',
        component: () => import('../views/factory/MessageDetail.vue'),
        meta: { title: '消息详情' }
      },
      {
        path: 'warning-detail/:id',
        name: 'FactoryWarningDetail',
        component: () => import('../views/factory/WarningDetail.vue'),
        meta: { title: '预警详情' }
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
        path: 'home',
        name: 'AdminHome',
        component: () => import('../views/admin/Home.vue'),
        meta: { title: '首页' }
      },
      // 工作中心
      {
        path: 'todo',
        name: 'AdminTodo',
        component: () => import('../views/admin/work-center/Todo.vue'),
        meta: { title: '待办任务' }
      },
      {
        path: 'messages',
        name: 'AdminMessages',
        component: () => import('../views/admin/work-center/Messages.vue'),
        meta: { title: '消息中心' }
      },
      {
        path: 'warnings',
        name: 'AdminWarnings',
        component: () => import('../views/admin/work-center/Warnings.vue'),
        meta: { title: '预警消息' }
      },
      // 套餐管理
      {
        path: 'package-management/package-info',
        name: 'AdminPackageInfo',
        component: () => import('../views/admin/package-management/PackageInfo.vue'),
        meta: { title: '套餐信息' }
      },
      {
        path: 'package-management/package-info/add',
        name: 'AdminPackageInfoAdd',
        component: () => import('../views/admin/package-management/PackageForm.vue'),
        meta: { title: '新增套餐' }
      },
      {
        path: 'package-management/package-info/edit/:id',
        name: 'AdminPackageInfoEdit',
        component: () => import('../views/admin/package-management/PackageForm.vue'),
        meta: { title: '编辑套餐' }
      },
      {
        path: 'package-management/package-info/:id',
        name: 'AdminPackageInfoDetail',
        component: () => import('../views/admin/package-management/PackageDetail.vue'),
        meta: { title: '套餐详情' }
      },
      // 租户管理
      {
        path: 'tenant-management/tenant-info',
        name: 'AdminTenantInfo',
        component: () => import('../views/admin/tenant-management/TenantInfo.vue'),
        meta: { title: '租户信息' }
      },
      {
        path: 'tenant-management/tenant-info/add',
        name: 'AdminTenantInfoAdd',
        component: () => import('../views/admin/tenant-management/TenantForm.vue'),
        meta: { title: '新增租户' }
      },
      {
        path: 'tenant-management/tenant-info/edit/:id',
        name: 'AdminTenantInfoEdit',
        component: () => import('../views/admin/tenant-management/TenantForm.vue'),
        meta: { title: '编辑租户' }
      },
      {
        path: 'tenant-management/tenant-info/:id',
        name: 'AdminTenantInfoDetail',
        component: () => import('../views/admin/tenant-management/TenantDetail.vue'),
        meta: { title: '租户详情' }
      },
      // 招聘管理
      {
        path: 'recruitment-management/recruitment-requirements',
        name: 'AdminRecruitmentRequirements',
        component: () => import('../views/admin/recruitment-management/RecruitmentRequirements.vue'),
        meta: { title: '招聘需求' }
      },

      {
        path: 'recruitment-management/recruitment-requirements/:id',
        name: 'AdminRecruitmentRequirementsDetail',
        component: () => import('../views/admin/recruitment-management/RecruitmentRequirementsDetail.vue'),
        meta: { title: '招聘需求详情' }
      },
      {
        path: 'recruitment-management/resume-management',
        name: 'AdminResumeManagement',
        component: () => import('../views/admin/recruitment-management/ResumeManagement.vue'),
        meta: { title: '简历管理' }
      },

      {
        path: 'recruitment-management/resume-management/:id',
        name: 'AdminResumeManagementDetail',
        component: () => import('../views/admin/recruitment-management/ResumeManagementDetail.vue'),
        meta: { title: '简历详情' }
      },
      // 结算管理
      {
        path: 'settlement/referral',
        name: 'AdminSettlementReferral',
        component: () => import('../views/admin/settlement/Referral.vue'),
        meta: { title: '工作转介绍' }
      },
      {
        path: 'settlement/commission',
        name: 'AdminSettlementCommission',
        component: () => import('../views/admin/settlement/Commission.vue'),
        meta: { title: '佣金发放' }
      },
      {
        path: 'settlement/pull-new-reward',
        name: 'AdminSettlementPullNewReward',
        component: () => import('../views/admin/settlement/PullNewReward.vue'),
        meta: { title: '拉新奖励' }
      },
      // 离职管理
      {
        path: 'resignation',
        name: 'AdminResignation',
        component: () => import('../views/admin/resignation/Resignation.vue'),
        meta: { title: '离职管理' }
      },
      {
        path: 'resignation/add',
        name: 'AdminResignationAdd',
        component: () => import('../views/admin/resignation/ResignationForm.vue'),
        meta: { title: '新增离职' }
      },
      {
        path: 'resignation/edit/:id',
        name: 'AdminResignationEdit',
        component: () => import('../views/admin/resignation/ResignationForm.vue'),
        meta: { title: '编辑离职' }
      },
      {
        path: 'resignation/:id',
        name: 'AdminResignationDetail',
        component: () => import('../views/admin/resignation/ResignationDetail.vue'),
        meta: { title: '离职详情' }
      },
      // 运营管理
      {
        path: 'operation/expense-query',
        name: 'AdminOperationExpenseQuery',
        component: () => import('../views/admin/operation/ExpenseQuery.vue'),
        meta: { title: '费用查询' }
      },
      {
        path: 'operation/idle-workers',
        name: 'AdminOperationIdleWorkers',
        component: () => import('../views/admin/IdleWorkers.vue'),
        meta: { title: '空闲工人' }
      },
      {
        path: 'operation/activity',
        name: 'AdminOperationActivity',
        component: () => import('../views/admin/operation/Activity.vue'),
        meta: { title: '活动信息' }
      },
      {
        path: 'operation/activity/add',
        name: 'AdminOperationActivityAdd',
        component: () => import('../views/admin/operation/ActivityForm.vue'),
        meta: { title: '新增活动' }
      },
      {
        path: 'operation/activity/edit/:id',
        name: 'AdminOperationActivityEdit',
        component: () => import('../views/admin/operation/ActivityForm.vue'),
        meta: { title: '编辑活动' }
      },
      {
        path: 'operation/activity-registration',
        name: 'AdminOperationActivityRegistration',
        component: () => import('../views/admin/operation/ActivityRegistration.vue'),
        meta: { title: '报名信息' }
      },
      {
        path: 'operation/ranking/work-duration',
        name: 'AdminRankingWorkDuration',
        component: () => import('../views/admin/operation/ranking/WorkDuration.vue'),
        meta: { title: '在岗时长排名' }
      },
      {
        path: 'operation/ranking/turnover-rate',
        name: 'AdminRankingTurnoverRate',
        component: () => import('../views/admin/operation/ranking/TurnoverRate.vue'),
        meta: { title: '离职率排名' }
      },
      {
        path: 'operation/ranking/punishment-rate',
        name: 'AdminRankingPunishmentRate',
        component: () => import('../views/admin/operation/ranking/PunishmentRate.vue'),
        meta: { title: '惩罚率排名' }
      },
      {
        path: 'operation/ranking/dismissal-rate',
        name: 'AdminRankingDismissalRate',
        component: () => import('../views/admin/operation/ranking/DismissalRate.vue'),
        meta: { title: '开除率排名' }
      },
      {
        path: 'operation/ranking/transfer-rate',
        name: 'AdminRankingTransferRate',
        component: () => import('../views/admin/operation/ranking/TransferRate.vue'),
        meta: { title: '调岗率排名' }
      },
      {
        path: 'operation/ranking/complaint-rate',
        name: 'AdminRankingComplaintRate',
        component: () => import('../views/admin/operation/ranking/ComplaintRate.vue'),
        meta: { title: '投诉率排名' }
      },
      {
        path: 'operation/ranking/leave-rate',
        name: 'AdminRankingLeaveRate',
        component: () => import('../views/admin/operation/ranking/LeaveRate.vue'),
        meta: { title: '请假率排名' }
      },
      {
        path: 'operation/ranking/overtime',
        name: 'AdminRankingOvertime',
        component: () => import('../views/admin/operation/ranking/Overtime.vue'),
        meta: { title: '加班时长排名' }
      },
      // 注册用户
      {
        path: 'system/registered-users',
        name: 'AdminRegisteredUsers',
        component: () => import('../views/admin/system/RegisteredUsers.vue'),
        meta: { title: '注册用户' }
      },
      // 系统管理模块
      {
        path: 'system/tenant-tag',
        name: 'AdminTenantTag',
        component: () => import('../views/admin/system/TenantTagList.vue'),
        meta: { title: '租户标签' }
      },
      {
        path: 'system/warning-template',
        name: 'AdminWarningTemplate',
        component: () => import('../views/admin/system/WarningTemplateList.vue'),
        meta: { title: '预警消息模版' }
      },
      {
        path: 'system/education-job',
        name: 'AdminEducationJob',
        component: () => import('../views/admin/system/EducationPositionList.vue'),
        meta: { title: '学历对应岗位' }
      },
      {
        path: 'system/platform-account',
        name: 'AdminPlatformAccount',
        component: () => import('../views/admin/system/PlatformAccountList.vue'),
        meta: { title: '平台账号管理' }
      },
      {
        path: 'system/company-culture',
        name: 'AdminCompanyCulture',
        component: () => import('../views/admin/system/CompanyCulture.vue'),
        meta: { title: '企业文化介绍' }
      },
      {
        path: 'system/job-culture',
        name: 'AdminJobCulture',
        component: () => import('../views/admin/system/JobCulture.vue'),
        meta: { title: '岗位文化介绍' }
      },
      {
        path: 'system/department',
        name: 'AdminDepartment',
        component: () => import('../views/admin/system/Department.vue'),
        meta: { title: '部门管理' }
      },
      {
        path: 'system/employee',
        name: 'AdminEmployee',
        component: () => import('../views/admin/system/Employee.vue'),
        meta: { title: '正式员工管理' }
      },
      {
        path: 'system/role',
        name: 'AdminRole',
        component: () => import('../views/admin/system/Role.vue'),
        meta: { title: '角色管理' }
      },
      {
        path: 'system/rule-config',
        name: 'AdminRuleConfig',
        component: () => import('../views/admin/system/RuleConfig.vue'),
        meta: { title: '规则配置' }
      },
      {
        path: 'system/menu-config',
        name: 'AdminMenuConfig',
        component: () => import('../views/admin/system/MenuConfig.vue'),
        meta: { title: '菜单配置' }
      },
      {
        path: 'system/dictionary',
        name: 'AdminDictionary',
        component: () => import('../views/admin/system/Dictionary.vue'),
        meta: { title: '字典管理' }
      },
      {
        path: 'system/system-param',
        name: 'AdminSystemParam',
        component: () => import('../views/admin/system/SystemParam.vue'),
        meta: { title: '系统参数' }
      },
      {
        path: 'system/process',
        name: 'AdminProcess',
        component: () => import('../views/admin/system/Process.vue'),
        meta: { title: '流程管理' }
      },
      {
        path: 'system/flow-management',
        name: 'AdminFlowManagement',
        component: () => import('../views/admin/system/FlowManagement.vue'),
        meta: { title: '流程管理' }
      },
      {
        path: 'system/flow-management/add',
        name: 'AdminFlowManagementAdd',
        component: () => import('../views/admin/system/FlowManagementForm.vue'),
        meta: { title: '新增流程' }
      },
      {
        path: 'system/flow-management/edit/:id',
        name: 'AdminFlowManagementEdit',
        component: () => import('../views/admin/system/FlowManagementForm.vue'),
        meta: { title: '编辑流程' }
      },
      {
        path: 'system/flow-management/view/:id',
        name: 'AdminFlowManagementView',
        component: () => import('../views/admin/system/FlowManagementDetail.vue'),
        meta: { title: '流程详情' }
      },
      {
        path: 'system/process-config',
        name: 'AdminProcessConfig',
        component: () => import('../views/admin/system/ProcessConfig.vue'),
        meta: { title: '流程配置' }
      },
      {
        path: 'system/flow-config',
        name: 'AdminFlowConfig',
        component: () => import('../views/admin/system/FlowConfigList.vue'),
        meta: { title: '流程配置管理' }
      },


      {
        path: 'system/attachment',
        name: 'AdminAttachment',
        component: () => import('../views/admin/system/AttachmentConfigList.vue'),
        meta: { title: '附件配置管理' }
      },
      {
        path: 'system/attachment/add',
        name: 'AdminAttachmentAdd',
        component: () => import('../views/admin/system/AttachmentConfigForm.vue'),
        meta: { title: '新增附件配置' }
      },
      {
        path: 'system/attachment/edit/:id',
        name: 'AdminAttachmentEdit',
        component: () => import('../views/admin/system/AttachmentConfigForm.vue'),
        meta: { title: '编辑附件配置' }
      },
      {
        path: 'system/attachment/:id',
        name: 'AdminAttachmentDetail',
        component: () => import('../views/admin/system/AttachmentConfigDetail.vue'),
        meta: { title: '附件配置详情' }
      },
      {
        path: 'system/attachment-template',
        name: 'AdminAttachmentTemplate',
        component: () => import('../views/admin/system/AttachmentTemplateList.vue'),
        meta: { title: '附件模板管理' }
      },
      {
        path: 'system/attachment-template/upload',
        name: 'AdminAttachmentTemplateUpload',
        component: () => import('../views/admin/system/AttachmentTemplateUpload.vue'),
        meta: { title: '上传附件模板' }
      },
      {
        path: 'system/attachment-template/edit/:id',
        name: 'AdminAttachmentTemplateEdit',
        component: () => import('../views/admin/system/AttachmentTemplateEdit.vue'),
        meta: { title: '编辑附件模板' }
      },
      {
        path: 'system/print-template',
        name: 'AdminPrintTemplate',
        component: () => import('../views/admin/system/PrintTemplate.vue'),
        meta: { title: '打印模版配置' }
      },
      {
        path: 'system/print-config',
        name: 'AdminPrintConfig',
        component: () => import('../views/admin/system/PrintConfig.vue'),
        meta: { title: '打印配置' }
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
  
  // 检查是否是从登录页跳转
  if (from.name === 'Login' && to.name === 'Login') {
    // 从登录页来，检查用户信息
    const userInfo = localStorage.getItem('userInfo')
    if (userInfo) {
      const user = JSON.parse(userInfo)
      // 根据角色跳转到对应工作中心，默认选中工作中心菜单
      switch (user.role) {
        case 'labor_company':
          next({ name: 'LaborCompanyTodo' })
          return
        case 'factory':
          next({ name: 'FactoryTodo' })
          return
        case 'platform_admin':
          next({ name: 'AdminHome' })
          return
        case 'worker':
          next({ name: 'WorkerHome' })
          return
        default:
          next()
          return
      }
    }
  }
  
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