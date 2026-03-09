import type { Menu, MenuQueryParams, MenuForm, ApiResponse, PageResponse } from '@/types/system/menuTypes'

// Mock数据
const mockMenus: Menu[] = [
  {
    id: 1,
    menuName: '工作中心',
    menuCode: 'WORK_CENTER',
    parentId: 0,
    level: 1,
    sort: 1,
    menuType: 'menu',
    path: '/work-center',
    component: 'WorkCenter',
    icon: 'House',
    menuStatus: 'enabled',
    businessCode: 'WORK_CENTER',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    children: [
      {
        id: 2,
        menuName: '待办任务',
        menuCode: 'TODO',
        parentId: 1,
        level: 2,
        sort: 1,
        menuType: 'menu',
        path: '/work-center/todo',
        component: 'Todo',
        icon: 'Task',
        menuStatus: 'enabled',
        businessCode: 'TODO',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        children: []
      },
      {
        id: 3,
        menuName: '消息中心',
        menuCode: 'MESSAGE',
        parentId: 1,
        level: 2,
        sort: 2,
        menuType: 'menu',
        path: '/work-center/messages',
        component: 'Messages',
        icon: 'Message',
        menuStatus: 'enabled',
        businessCode: 'MESSAGE',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        children: []
      },
      {
        id: 4,
        menuName: '预警信息',
        menuCode: 'WARNING',
        parentId: 1,
        level: 2,
        sort: 3,
        menuType: 'menu',
        path: '/work-center/warnings',
        component: 'Warnings',
        icon: 'Warning',
        menuStatus: 'enabled',
        businessCode: 'WARNING',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        children: []
      }
    ]
  },
  {
    id: 5,
    menuName: '招聘管理',
    menuCode: 'RECRUITMENT',
    parentId: 0,
    level: 1,
    sort: 2,
    menuType: 'menu',
    path: '/recruitment',
    component: 'Recruitment',
    icon: 'UserFilled',
    menuStatus: 'enabled',
    businessCode: 'RECRUITMENT',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    children: [
      {
        id: 6,
        menuName: '招聘需求',
        menuCode: 'RECRUITMENT_DEMAND',
        parentId: 5,
        level: 2,
        sort: 1,
        menuType: 'menu',
        path: '/recruitment/demand',
        component: 'Demand',
        icon: 'Document',
        menuStatus: 'enabled',
        businessCode: 'RECRUITMENT_DEMAND',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        children: []
      },
      {
        id: 7,
        menuName: '简历管理',
        menuCode: 'RESUME',
        parentId: 5,
        level: 2,
        sort: 2,
        menuType: 'menu',
        path: '/recruitment/resume',
        component: 'Resume',
        icon: 'Files',
        menuStatus: 'enabled',
        businessCode: 'RESUME',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        children: []
      }
    ]
  },
  {
    id: 8,
    menuName: '面试管理',
    menuCode: 'INTERVIEW',
    parentId: 0,
    level: 1,
    sort: 3,
    menuType: 'menu',
    path: '/interview',
    component: 'Interview',
    icon: 'ChatDotRound',
    menuStatus: 'enabled',
    businessCode: 'INTERVIEW',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    children: [
      {
        id: 9,
        menuName: '接送管理',
        menuCode: 'PICKUP',
        parentId: 8,
        level: 2,
        sort: 1,
        menuType: 'menu',
        path: '/interview/pickup',
        component: 'Pickup',
        icon: 'Van',
        menuStatus: 'enabled',
        businessCode: 'PICKUP',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        children: []
      },
      {
        id: 10,
        menuName: '初步面试',
        menuCode: 'INITIAL_INTERVIEW',
        parentId: 8,
        level: 2,
        sort: 2,
        menuType: 'menu',
        path: '/interview/initial-interview',
        component: 'InitialInterview',
        icon: 'ChatLineSquare',
        menuStatus: 'enabled',
        businessCode: 'INITIAL_INTERVIEW',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        children: []
      },
      {
        id: 11,
        menuName: '面试邀约',
        menuCode: 'INTERVIEW_INVITATION',
        parentId: 8,
        level: 2,
        sort: 3,
        menuType: 'menu',
        path: '/interview/invitation',
        component: 'InterviewInvitation',
        icon: 'Message',
        menuStatus: 'enabled',
        businessCode: 'INTERVIEW_INVITATION',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        children: []
      },
      {
        id: 12,
        menuName: '工厂面试',
        menuCode: 'FACTORY_INTERVIEW',
        parentId: 8,
        level: 2,
        sort: 4,
        menuType: 'menu',
        path: '/interview/factory-interview',
        component: 'FactoryInterview',
        icon: 'OfficeBuilding',
        menuStatus: 'enabled',
        businessCode: 'FACTORY_INTERVIEW',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        children: []
      }
    ]
  },
  {
    id: 13,
    menuName: '工人管理',
    menuCode: 'WORKER',
    parentId: 0,
    level: 1,
    sort: 4,
    menuType: 'menu',
    path: '/worker',
    component: 'Worker',
    icon: 'User',
    menuStatus: 'enabled',
    businessCode: 'WORKER',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    children: [
      {
        id: 14,
        menuName: '工人信息',
        menuCode: 'WORKER_INFO',
        parentId: 13,
        level: 2,
        sort: 1,
        menuType: 'menu',
        path: '/worker/info',
        component: 'Workers',
        icon: 'User',
        menuStatus: 'enabled',
        businessCode: 'WORKER_INFO',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        children: []
      }
    ]
  },
  {
    id: 15,
    menuName: '合同管理',
    menuCode: 'CONTRACT',
    parentId: 0,
    level: 1,
    sort: 5,
    menuType: 'menu',
    path: '/contract',
    component: 'Contract',
    icon: 'Document',
    menuStatus: 'enabled',
    businessCode: 'CONTRACT',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    children: [
      {
        id: 16,
        menuName: '签订合同',
        menuCode: 'CONTRACT_SIGN',
        parentId: 15,
        level: 2,
        sort: 1,
        menuType: 'menu',
        path: '/contract/sign',
        component: 'Contract',
        icon: 'Document',
        menuStatus: 'enabled',
        businessCode: 'CONTRACT_SIGN',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        children: []
      }
    ]
  },
  {
    id: 17,
    menuName: '在职管理',
    menuCode: 'ON_DUTY',
    parentId: 0,
    level: 1,
    sort: 6,
    menuType: 'menu',
    path: '/on-duty',
    component: 'OnDuty',
    icon: 'Briefcase',
    menuStatus: 'enabled',
    businessCode: 'ON_DUTY',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    children: [
      {
        id: 18,
        menuName: '工作与生活',
        menuCode: 'WORK_LIFE',
        parentId: 17,
        level: 2,
        sort: 1,
        menuType: 'menu',
        path: '/on-duty/work-life',
        component: 'WorkLife',
        icon: 'Coin',
        menuStatus: 'enabled',
        businessCode: 'WORK_LIFE',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        children: [
          {
            id: 19,
            menuName: '生活费管理',
            menuCode: 'LIVING_EXPENSE',
            parentId: 18,
            level: 3,
            sort: 1,
            menuType: 'menu',
            path: '/on-duty/living-expense',
            component: 'LivingExpense',
            icon: 'Coin',
            menuStatus: 'enabled',
            businessCode: 'LIVING_EXPENSE',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            children: []
          },
          {
            id: 20,
            menuName: '工资管理',
            menuCode: 'SALARY',
            parentId: 18,
            level: 3,
            sort: 2,
            menuType: 'menu',
            path: '/on-duty/salary',
            component: 'Salary',
            icon: 'Money',
            menuStatus: 'enabled',
            businessCode: 'SALARY',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            children: []
          },
          {
            id: 21,
            menuName: '理赔管理',
            menuCode: 'CLAIM',
            parentId: 18,
            level: 3,
            sort: 3,
            menuType: 'menu',
            path: '/on-duty/claim',
            component: 'Claim',
            icon: 'Wallet',
            menuStatus: 'enabled',
            businessCode: 'CLAIM',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            children: []
          }
        ]
      },
      {
        id: 22,
        menuName: '管理与关怀',
        menuCode: 'MANAGEMENT_CARE',
        parentId: 17,
        level: 2,
        sort: 2,
        menuType: 'menu',
        path: '/on-duty/management-care',
        component: 'ManagementCare',
        icon: 'Star',
        menuStatus: 'enabled',
        businessCode: 'MANAGEMENT_CARE',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        children: [
          {
            id: 23,
            menuName: '沟通管理',
            menuCode: 'COMMUNICATION',
            parentId: 22,
            level: 3,
            sort: 1,
            menuType: 'menu',
            path: '/on-duty/communication',
            component: 'Communication',
            icon: 'ChatLineSquare',
            menuStatus: 'enabled',
            businessCode: 'COMMUNICATION',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            children: []
          },
          {
            id: 24,
            menuName: '文娱活动',
            menuCode: 'ENTERTAINMENT',
            parentId: 22,
            level: 3,
            sort: 2,
            menuType: 'menu',
            path: '/on-duty/entertainment',
            component: 'Entertainment',
            icon: 'Trophy',
            menuStatus: 'enabled',
            businessCode: 'ENTERTAINMENT',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            children: []
          },
          {
            id: 25,
            menuName: '报名管理',
            menuCode: 'REGISTRATION',
            parentId: 22,
            level: 3,
            sort: 3,
            menuType: 'menu',
            path: '/on-duty/registration',
            component: 'Registration',
            icon: 'Tickets',
            menuStatus: 'enabled',
            businessCode: 'REGISTRATION',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            children: []
          },
          {
            id: 26,
            menuName: '发布资讯',
            menuCode: 'NEWS',
            parentId: 22,
            level: 3,
            sort: 4,
            menuType: 'menu',
            path: '/on-duty/news',
            component: 'News',
            icon: 'Document',
            menuStatus: 'enabled',
            businessCode: 'NEWS',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            children: []
          },
          {
            id: 27,
            menuName: '社团管理',
            menuCode: 'COMMUNITY',
            parentId: 22,
            level: 3,
            sort: 5,
            menuType: 'menu',
            path: '/on-duty/community',
            component: 'Community',
            icon: 'UserFilled',
            menuStatus: 'enabled',
            businessCode: 'COMMUNITY',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            children: []
          }
        ]
      },
      {
        id: 28,
        menuName: '特殊情况',
        menuCode: 'SPECIAL_CASE',
        parentId: 17,
        level: 2,
        sort: 3,
        menuType: 'menu',
        path: '/on-duty/special-case',
        component: 'SpecialCase',
        icon: 'Warning',
        menuStatus: 'enabled',
        businessCode: 'SPECIAL_CASE',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        children: []
      },
      {
        id: 29,
        menuName: '保险管理',
        menuCode: 'INSURANCE',
        parentId: 17,
        level: 2,
        sort: 4,
        menuType: 'menu',
        path: '/on-duty/insurance',
        component: 'Insurance',
        icon: 'Wallet',
        menuStatus: 'enabled',
        businessCode: 'INSURANCE',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        children: [
          {
            id: 30,
            menuName: '保险管理',
            menuCode: 'INSURANCE_MANAGE',
            parentId: 29,
            level: 3,
            sort: 1,
            menuType: 'menu',
            path: '/on-duty/insurance-manage',
            component: 'Insurance',
            icon: 'Wallet',
            menuStatus: 'enabled',
            businessCode: 'INSURANCE_MANAGE',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            children: []
          },
          {
            id: 31,
            menuName: '理赔管理',
            menuCode: 'INSURANCE_CLAIM',
            parentId: 29,
            level: 3,
            sort: 2,
            menuType: 'menu',
            path: '/on-duty/insurance-claim',
            component: 'InsuranceRecord',
            icon: 'Money',
            menuStatus: 'enabled',
            businessCode: 'INSURANCE_CLAIM',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            children: []
          },
          {
            id: 32,
            menuName: '参保登记',
            menuCode: 'INSURANCE_REGISTER',
            parentId: 29,
            level: 3,
            sort: 3,
            menuType: 'menu',
            path: '/on-duty/insurance-register',
            component: 'InsuranceRecord',
            icon: 'Document',
            menuStatus: 'enabled',
            businessCode: 'INSURANCE_REGISTER',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            children: []
          }
        ]
      },
      {
        id: 33,
        menuName: '考勤管理',
        menuCode: 'ATTENDANCE',
        parentId: 17,
        level: 2,
        sort: 5,
        menuType: 'menu',
        path: '/on-duty/attendance',
        component: 'Attendance',
        icon: 'Calendar',
        menuStatus: 'enabled',
        businessCode: 'ATTENDANCE',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        children: []
      },
      {
        id: 34,
        menuName: '请假管理',
        menuCode: 'LEAVE',
        parentId: 17,
        level: 2,
        sort: 6,
        menuType: 'menu',
        path: '/on-duty/leave',
        component: 'Leave',
        icon: 'Tickets',
        menuStatus: 'enabled',
        businessCode: 'LEAVE',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        children: []
      },
      {
        id: 35,
        menuName: '调岗管理',
        menuCode: 'TRANSFER',
        parentId: 17,
        level: 2,
        sort: 7,
        menuType: 'menu',
        path: '/on-duty/transfer',
        component: 'Transfer',
        icon: 'Switch',
        menuStatus: 'enabled',
        businessCode: 'TRANSFER',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        children: []
      },
      {
        id: 36,
        menuName: '奖惩管理',
        menuCode: 'REWARD_PUNISHMENT',
        parentId: 17,
        level: 2,
        sort: 8,
        menuType: 'menu',
        path: '/on-duty/reward-punishment',
        component: 'RewardPunishment',
        icon: 'Medal',
        menuStatus: 'enabled',
        businessCode: 'REWARD_PUNISHMENT',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        children: []
      },
      {
        id: 37,
        menuName: '业务课堂',
        menuCode: 'BUSINESS_CLASS',
        parentId: 17,
        level: 2,
        sort: 9,
        menuType: 'menu',
        path: '/on-duty/business-class',
        component: 'BusinessClass',
        icon: 'Reading',
        menuStatus: 'enabled',
        businessCode: 'BUSINESS_CLASS',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        children: [
          {
            id: 38,
            menuName: '学习材料',
            menuCode: 'LEARNING_MATERIAL',
            parentId: 37,
            level: 3,
            sort: 1,
            menuType: 'menu',
            path: '/on-duty/learning-material',
            component: 'LearningMaterial',
            icon: 'Document',
            menuStatus: 'enabled',
            businessCode: 'LEARNING_MATERIAL',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            children: []
          },
          {
            id: 39,
            menuName: '题库管理',
            menuCode: 'QUESTION_BANK',
            parentId: 37,
            level: 3,
            sort: 2,
            menuType: 'menu',
            path: '/on-duty/question-bank',
            component: 'QuestionBank',
            icon: 'Notebook',
            menuStatus: 'enabled',
            businessCode: 'QUESTION_BANK',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            children: []
          },
          {
            id: 40,
            menuName: '学习时长管理',
            menuCode: 'LEARNING_TIME',
            parentId: 37,
            level: 3,
            sort: 3,
            menuType: 'menu',
            path: '/on-duty/learning-time',
            component: 'LearningTime',
            icon: 'Clock',
            menuStatus: 'enabled',
            businessCode: 'LEARNING_TIME',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            children: []
          },
          {
            id: 41,
            menuName: '考试管理',
            menuCode: 'EXAM',
            parentId: 37,
            level: 3,
            sort: 4,
            menuType: 'menu',
            path: '/on-duty/exam',
            component: 'Exam',
            icon: 'Edit',
            menuStatus: 'enabled',
            businessCode: 'EXAM',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            children: []
          },
          {
            id: 42,
            menuName: '考试成绩',
            menuCode: 'EXAM_RESULT',
            parentId: 37,
            level: 3,
            sort: 5,
            menuType: 'menu',
            path: '/on-duty/exam-result',
            component: 'ExamResult',
            icon: 'DataLine',
            menuStatus: 'enabled',
            businessCode: 'EXAM_RESULT',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            children: []
          }
        ]
      },
      {
        id: 43,
        menuName: '异常管理',
        menuCode: 'ABNORMAL',
        parentId: 17,
        level: 2,
        sort: 10,
        menuType: 'menu',
        path: '/on-duty/abnormal',
        component: 'Abnormal',
        icon: 'CircleClose',
        menuStatus: 'enabled',
        businessCode: 'ABNORMAL',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        children: []
      },
      {
        id: 44,
        menuName: '投诉/建议',
        menuCode: 'COMPLAINT',
        parentId: 17,
        level: 2,
        sort: 11,
        menuType: 'menu',
        path: '/on-duty/complaint',
        component: 'Complaint',
        icon: 'ChatDotRound',
        menuStatus: 'enabled',
        businessCode: 'COMPLAINT',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        children: []
      }
    ]
  },
  {
    id: 45,
    menuName: '离职管理',
    menuCode: 'RESIGNATION',
    parentId: 0,
    level: 1,
    sort: 7,
    menuType: 'menu',
    path: '/resignation',
    component: 'Resignation',
    icon: 'SwitchButton',
    menuStatus: 'enabled',
    businessCode: 'RESIGNATION',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    children: [
      {
        id: 46,
        menuName: '离职管理',
        menuCode: 'RESIGNATION_MANAGE',
        parentId: 45,
        level: 2,
        sort: 1,
        menuType: 'menu',
        path: '/resignation/manage',
        component: 'Resignation',
        icon: 'SwitchButton',
        menuStatus: 'enabled',
        businessCode: 'RESIGNATION_MANAGE',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        children: []
      }
    ]
  },
  {
    id: 47,
    menuName: '结算管理',
    menuCode: 'SETTLEMENT',
    parentId: 0,
    level: 1,
    sort: 8,
    menuType: 'menu',
    path: '/settlement',
    component: 'Settlement',
    icon: 'Money',
    menuStatus: 'enabled',
    businessCode: 'SETTLEMENT',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    children: [
      {
        id: 48,
        menuName: '工作转介绍',
        menuCode: 'REFERRAL',
        parentId: 47,
        level: 2,
        sort: 1,
        menuType: 'menu',
        path: '/settlement/referral',
        component: 'Referral',
        icon: 'Share',
        menuStatus: 'enabled',
        businessCode: 'REFERRAL',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        children: [
          {
            id: 49,
            menuName: '工作转介绍',
            menuCode: 'REFERRAL_MANAGE',
            parentId: 48,
            level: 3,
            sort: 1,
            menuType: 'menu',
            path: '/settlement/referral-manage',
            component: 'Referral',
            icon: 'Share',
            menuStatus: 'enabled',
            businessCode: 'REFERRAL_MANAGE',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            children: []
          },
          {
            id: 50,
            menuName: '佣金发放',
            menuCode: 'COMMISSION',
            parentId: 48,
            level: 3,
            sort: 2,
            menuType: 'menu',
            path: '/settlement/commission',
            component: 'Commission',
            icon: 'Money',
            menuStatus: 'enabled',
            businessCode: 'COMMISSION',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            children: []
          }
        ]
      },
      {
        id: 51,
        menuName: '结算管理',
        menuCode: 'SETTLEMENT_MANAGE',
        parentId: 47,
        level: 2,
        sort: 2,
        menuType: 'menu',
        path: '/settlement/manage',
        component: 'Settlement',
        icon: 'Money',
        menuStatus: 'enabled',
        businessCode: 'SETTLEMENT_MANAGE',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        children: []
      }
    ]
  },
  {
    id: 52,
    menuName: '系统管理',
    menuCode: 'SYSTEM',
    parentId: 0,
    level: 1,
    sort: 9,
    menuType: 'menu',
    path: '/system',
    component: 'System',
    icon: 'Setting',
    menuStatus: 'enabled',
    businessCode: 'SYSTEM',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    children: [
      {
        id: 53,
        menuName: '企业介绍',
        menuCode: 'COMPANY_INTRO',
        parentId: 52,
        level: 2,
        sort: 1,
        menuType: 'menu',
        path: '/system/company-intro',
        component: 'CompanyIntro',
        icon: 'OfficeBuilding',
        menuStatus: 'enabled',
        businessCode: 'COMPANY_INTRO',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        children: [
          {
            id: 54,
            menuName: '企业文化介绍',
            menuCode: 'COMPANY_CULTURE',
            parentId: 53,
            level: 3,
            sort: 1,
            menuType: 'menu',
            path: '/system/company-culture',
            component: 'CompanyCulture',
            icon: 'OfficeBuilding',
            menuStatus: 'enabled',
            businessCode: 'COMPANY_CULTURE',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            children: []
          },
          {
            id: 55,
            menuName: '岗位文化介绍',
            menuCode: 'JOB_CULTURE',
            parentId: 53,
            level: 3,
            sort: 2,
            menuType: 'menu',
            path: '/system/job-culture',
            component: 'JobCulture',
            icon: 'Avatar',
            menuStatus: 'enabled',
            businessCode: 'JOB_CULTURE',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            children: []
          }
        ]
      },
      {
        id: 56,
        menuName: '部门管理',
        menuCode: 'DEPARTMENT',
        parentId: 52,
        level: 2,
        sort: 2,
        menuType: 'menu',
        path: '/system/department',
        component: 'Department',
        icon: 'Organization',
        menuStatus: 'enabled',
        businessCode: 'DEPARTMENT',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        children: []
      },
      {
        id: 57,
        menuName: '正式员工',
        menuCode: 'EMPLOYEE',
        parentId: 52,
        level: 2,
        sort: 3,
        menuType: 'menu',
        path: '/system/employee',
        component: 'Employee',
        icon: 'User',
        menuStatus: 'enabled',
        businessCode: 'EMPLOYEE',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        children: []
      },
      {
        id: 58,
        menuName: '岗位管理',
        menuCode: 'ROLE',
        parentId: 52,
        level: 2,
        sort: 4,
        menuType: 'menu',
        path: '/system/role',
        component: 'Role',
        icon: 'Avatar',
        menuStatus: 'enabled',
        businessCode: 'ROLE',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        children: []
      },
      {
        id: 59,
        menuName: '规则配置',
        menuCode: 'RULE_CONFIG',
        parentId: 52,
        level: 2,
        sort: 5,
        menuType: 'menu',
        path: '/system/rule-config',
        component: 'RuleConfig',
        icon: 'List',
        menuStatus: 'enabled',
        businessCode: 'RULE_CONFIG',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        children: []
      },
      {
        id: 60,
        menuName: '菜单配置',
        menuCode: 'MENU_CONFIG',
        parentId: 52,
        level: 2,
        sort: 6,
        menuType: 'menu',
        path: '/system/menu-config',
        component: 'MenuConfig',
        icon: 'Menu',
        menuStatus: 'enabled',
        businessCode: 'MENU_CONFIG',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        children: [
          {
            id: 61,
            menuName: '新增菜单',
            menuCode: 'MENU_CONFIG_CREATE',
            parentId: 60,
            level: 3,
            sort: 1,
            menuType: 'button',
            path: null,
            component: null,
            icon: null,
            menuStatus: 'enabled',
            businessCode: 'MENU_CONFIG_CREATE',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            children: []
          },
          {
            id: 62,
            menuName: '编辑菜单',
            menuCode: 'MENU_CONFIG_UPDATE',
            parentId: 60,
            level: 3,
            sort: 2,
            menuType: 'button',
            path: null,
            component: null,
            icon: null,
            menuStatus: 'enabled',
            businessCode: 'MENU_CONFIG_UPDATE',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            children: []
          },
          {
            id: 63,
            menuName: '删除菜单',
            menuCode: 'MENU_CONFIG_DELETE',
            parentId: 60,
            level: 3,
            sort: 3,
            menuType: 'button',
            path: null,
            component: null,
            icon: null,
            menuStatus: 'enabled',
            businessCode: 'MENU_CONFIG_DELETE',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            children: []
          },
          {
            id: 64,
            menuName: '查看菜单',
            menuCode: 'MENU_CONFIG_VIEW',
            parentId: 60,
            level: 3,
            sort: 4,
            menuType: 'button',
            path: null,
            component: null,
            icon: null,
            menuStatus: 'enabled',
            businessCode: 'MENU_CONFIG_VIEW',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            children: []
          }
        ]
      },
      {
        id: 65,
        menuName: '字典管理',
        menuCode: 'DICTIONARY',
        parentId: 52,
        level: 2,
        sort: 7,
        menuType: 'menu',
        path: '/system/dictionary',
        component: 'Dictionary',
        icon: 'Notebook',
        menuStatus: 'enabled',
        businessCode: 'DICTIONARY',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        children: []
      },
      {
        id: 66,
        menuName: '系统参数',
        menuCode: 'SYSTEM_PARAM',
        parentId: 52,
        level: 2,
        sort: 8,
        menuType: 'menu',
        path: '/system/system-param',
        component: 'SystemParam',
        icon: 'Tools',
        menuStatus: 'enabled',
        businessCode: 'SYSTEM_PARAM',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        children: []
      },
      {
        id: 67,
        menuName: '流程管理',
        menuCode: 'PROCESS',
        parentId: 52,
        level: 2,
        sort: 9,
        menuType: 'menu',
        path: '/system/process',
        component: 'Process',
        icon: 'Operation',
        menuStatus: 'enabled',
        businessCode: 'PROCESS',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        children: []
      },
      {
        id: 68,
        menuName: '流程配置',
        menuCode: 'PROCESS_CONFIG',
        parentId: 52,
        level: 2,
        sort: 10,
        menuType: 'menu',
        path: '/system/process-config',
        component: 'ProcessConfig',
        icon: 'Connection',
        menuStatus: 'enabled',
        businessCode: 'PROCESS_CONFIG',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        children: []
      },
      {
        id: 73,
        menuName: '工作流配置',
        menuCode: 'WORKFLOW_CONFIG',
        parentId: 52,
        level: 2,
        sort: 11,
        menuType: 'menu',
        path: '/system/workflow-config',
        component: 'WorkflowConfig',
        icon: 'Operation',
        menuStatus: 'enabled',
        businessCode: 'WORKFLOW_CONFIG',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        children: []
      },
      {
        id: 69,
        menuName: '附件管理',
        menuCode: 'ATTACHMENT',
        parentId: 52,
        level: 2,
        sort: 12,
        menuType: 'menu',
        path: '/system/attachment',
        component: 'Attachment',
        icon: 'Folder',
        menuStatus: 'enabled',
        businessCode: 'ATTACHMENT',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        children: []
      },
      {
        id: 70,
        menuName: '打印管理',
        menuCode: 'PRINT',
        parentId: 52,
        level: 2,
        sort: 13,
        menuType: 'menu',
        path: '/system/print',
        component: 'Print',
        icon: 'Printer',
        menuStatus: 'enabled',
        businessCode: 'PRINT',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        children: [
          {
            id: 71,
            menuName: '模版配置',
            menuCode: 'PRINT_TEMPLATE',
            parentId: 70,
            level: 3,
            sort: 1,
            menuType: 'menu',
            path: '/system/print-template',
            component: 'PrintTemplate',
            icon: 'Document',
            menuStatus: 'enabled',
            businessCode: 'PRINT_TEMPLATE',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            children: []
          },
          {
            id: 72,
            menuName: '打印配置',
            menuCode: 'PRINT_CONFIG',
            parentId: 70,
            level: 3,
            sort: 2,
            menuType: 'menu',
            path: '/system/print-config',
            component: 'PrintConfig',
            icon: 'Setting',
            menuStatus: 'enabled',
            businessCode: 'PRINT_CONFIG',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            children: []
          }
        ]
      }
    ]
  }
]

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

export const getMenuList = async (params: MenuQueryParams) => {
  await delay(300)
  let filteredData = mockMenus.flatMap(menu => [menu, ...(menu.children || [])])
  
  if (params.menuName) {
    filteredData = filteredData.filter(item => item.menuName.includes(params.menuName))
  }
  
  if (params.menuStatus) {
    filteredData = filteredData.filter(item => item.menuStatus === params.menuStatus)
  }
  
  const start = (params.page - 1) * params.pageSize
  const end = start + params.pageSize
  const list = filteredData.slice(start, end)
  
  return {
    code: 200,
    message: 'success',
    data: {
      list,
      total: filteredData.length,
      page: params.page,
      pageSize: params.pageSize
    },
    timestamp: Date.now()
  } as PageResponse<Menu>
}

export const getMenuTree = async (params?: { menuStatus?: string }) => {
  await delay(200)
  let menuTree = [...mockMenus]
  
  if (params?.menuStatus) {
    const filterMenu = (menus: Menu[]): Menu[] => {
      return menus
        .filter(menu => menu.menuStatus === params.menuStatus)
        .map(menu => ({
          ...menu,
          children: menu.children ? filterMenu(menu.children) : []
        }))
    }
    menuTree = filterMenu(menuTree)
  }
  
  return {
    code: 200,
    message: 'success',
    data: menuTree,
    timestamp: Date.now()
  } as ApiResponse<Menu[]>
}

export const getMenuDetail = async (id: number) => {
  await delay(200)
  const findMenu = (menus: Menu[]): Menu | undefined => {
    for (const menu of menus) {
      if (menu.id === id) return menu
      if (menu.children) {
        const found = findMenu(menu.children)
        if (found) return found
      }
    }
    return undefined
  }
  
  const menu = findMenu(mockMenus)
  if (!menu) {
    return {
      code: 404,
      message: '菜单不存在',
      data: null,
      timestamp: Date.now()
    } as ApiResponse<Menu>
  }
  
  return {
    code: 200,
    message: 'success',
    data: menu,
    timestamp: Date.now()
  } as ApiResponse<Menu>
}

export const createMenu = async (data: MenuForm) => {
  await delay(300)
  const newMenu: Menu = {
    id: mockMenus.length + 1,
    menuName: data.menuName,
    menuCode: data.menuCode,
    parentId: data.parentId,
    level: data.level,
    sort: data.sort,
    menuType: data.menuType,
    path: data.path,
    component: data.component,
    icon: data.icon,
    menuStatus: 'enabled',
    businessCode: data.businessCode,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    children: []
  }
  
  if (data.parentId === 0) {
    mockMenus.push(newMenu)
  } else {
    const findParent = (menus: Menu[]): Menu | undefined => {
      for (const menu of menus) {
        if (menu.id === data.parentId) return menu
        if (menu.children) {
          const found = findParent(menu.children)
          if (found) return found
        }
      }
      return undefined
    }
    const parent = findParent(mockMenus)
    if (parent) {
      parent.children.push(newMenu)
    }
  }
  
  return {
    code: 200,
    message: 'success',
    data: newMenu,
    timestamp: Date.now()
  } as ApiResponse<Menu>
}

export const updateMenu = async (id: number, data: MenuForm) => {
  await delay(300)
  const findMenu = (menus: Menu[]): Menu | undefined => {
    for (const menu of menus) {
      if (menu.id === id) return menu
      if (menu.children) {
        const found = findMenu(menu.children)
        if (found) return found
      }
    }
    return undefined
  }
  
  const menu = findMenu(mockMenus)
  if (!menu) {
    return {
      code: 404,
      message: '菜单不存在',
      data: null,
      timestamp: Date.now()
    } as ApiResponse<Menu>
  }
  
  Object.assign(menu, {
    menuName: data.menuName,
    menuCode: data.menuCode,
    parentId: data.parentId,
    level: data.level,
    sort: data.sort,
    menuType: data.menuType,
    path: data.path,
    component: data.component,
    icon: data.icon,
    businessCode: data.businessCode,
    updatedAt: new Date().toISOString()
  })
  
  return {
    code: 200,
    message: 'success',
    data: menu,
    timestamp: Date.now()
  } as ApiResponse<Menu>
}

export const deleteMenu = async (id: number) => {
  await delay(300)
  const removeMenu = (menus: Menu[]): boolean => {
    for (let i = 0; i < menus.length; i++) {
      if (menus[i].id === id) {
        menus.splice(i, 1)
        return true
      }
      if (menus[i].children) {
        if (removeMenu(menus[i].children)) {
          return true
        }
      }
    }
    return false
  }
  
  const removed = removeMenu(mockMenus)
  if (!removed) {
    return {
      code: 404,
      message: '菜单不存在',
      data: null,
      timestamp: Date.now()
    } as ApiResponse<void>
  }
  
  return {
    code: 200,
    message: 'success',
    data: null,
    timestamp: Date.now()
  } as ApiResponse<void>
}

export const checkBusinessCode = async (businessCode: string, id?: number) => {
  await delay(200)
  const checkCode = (menus: Menu[]): boolean => {
    for (const menu of menus) {
      if (menu.businessCode === businessCode && menu.id !== id) {
        return true
      }
      if (menu.children) {
        if (checkCode(menu.children)) {
          return true
        }
      }
    }
    return false
  }
  
  const exists = checkCode(mockMenus)
  return {
    code: 200,
    message: 'success',
    data: !exists,
    timestamp: Date.now()
  } as ApiResponse<boolean>
}
