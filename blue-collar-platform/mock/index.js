import Mock from 'mockjs';

// 模拟数据配置
Mock.setup({
  timeout: '200-600'
});

// 面试管理Mock数据
const generatePickupData = (count = 20) => {
  const pickups = []
  const statuses = ['pending', 'in_progress', 'completed', 'cancelled']
  
  for (let i = 1; i <= count; i++) {
    const workerCount = Mock.Random.integer(1, 10)
    const workers = []
    for (let j = 1; j <= workerCount; j++) {
      workers.push({
        id: `W${Mock.Random.id()}`,
        name: Mock.Random.cname(),
        phone: `1${Mock.Random.pick(['3', '5', '7', '8', '9'])}${Mock.Random.string('number', 9)}`,
        idCard: Mock.Random.id()
      })
    }
    
    pickups.push({
      id: `PK${String(i).padStart(3, '0')}`,
      plateNumber: Mock.Random.pick(['粤B', '粤A', '粤S', '粤T', '粤E']) + Mock.Random.string('number', 5),
      pickupTime: Mock.Random.datetime('yyyy-MM-dd HH:mm:ss'),
      startPoint: Mock.Random.pick(['深圳宝安汽车站', '深圳北站', '深圳西站', '广州南站', '东莞东站']),
      endPoint: Mock.Random.pick(['东莞长安工业区', '深圳宝安工业区', '惠州仲恺高新区', '中山火炬开发区']),
      pickupPerson: Mock.Random.cname(),
      manager: Mock.Random.cname(),
      managerPhone: `1${Mock.Random.pick(['3', '5', '7', '8', '9'])}${Mock.Random.string('number', 9)}`,
      groupNumber: Mock.Random.string('number', 9),
      status: Mock.Random.pick(statuses),
      workers,
      workerCount,
      materialCompleteCount: Mock.Random.integer(0, workerCount),
      remark: Mock.Random.cparagraph(1, 3),
      createTime: Mock.Random.datetime('yyyy-MM-dd HH:mm:ss'),
      updateTime: Mock.Random.datetime('yyyy-MM-dd HH:mm:ss')
    })
  }
  
  return pickups
}

const pickups = generatePickupData(30)

// 接送管理API
Mock.mock(/^\/api\/interview\/pickups(\?.*)?$/, 'get', (options) => {
  const url = new URL(options.url, 'http://localhost')
  const page = parseInt(url.searchParams.get('page') || '1')
  const pageSize = parseInt(url.searchParams.get('pageSize') || '10')
  const plateNumber = url.searchParams.get('plateNumber')
  const manager = url.searchParams.get('manager')
  const status = url.searchParams.get('status')
  
  let filteredPickups = [...pickups]
  
  if (plateNumber) {
    filteredPickups = filteredPickups.filter(p => p.plateNumber.includes(plateNumber))
  }
  
  if (manager) {
    filteredPickups = filteredPickups.filter(p => p.manager.includes(manager))
  }
  
  if (status) {
    filteredPickups = filteredPickups.filter(p => p.status === status)
  }
  
  const start = (page - 1) * pageSize
  const end = start + pageSize
  const list = filteredPickups.slice(start, end)
  
  return {
    code: 200,
    message: 'success',
    data: {
      list,
      total: filteredPickups.length,
      page,
      pageSize
    },
    timestamp: Date.now()
  }
})

// 一寸证件照默认头像
const defaultAvatar = 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20ID%20photo%20of%20a%20Chinese%20male%20worker%20with%20plain%20white%20background%2C%20passport%20style%2C%20front%20view%2C%20clear%20features%2C%20formal%20clothing&image_size=square';

// 用户数据模拟
const users = [
  // 工人用户
  {
    id: 1,
    phone: '13800138001',
    password: '123456',
    name: '张三',
    role: 'worker',
    avatar: defaultAvatar,
    idCard: '110101199001011234',
    gender: '男',
    education: '高中',
    currentLaborCompany: '南通富民劳务服务有限公司',
    currentFactory: '富士康科技集团',
    factorySection: '生产一部',
    position: '操作工',
    employmentType: '月结',
    status: '在职'
  },
  // 租户用户
  {
    id: 2,
    phone: '13800138002',
    password: '123456',
    name: '李四',
    role: 'tenant',
    avatar: defaultAvatar,
    companyName: '三鼎劳务有限公司',
    position: '招聘经理'
  },
  // 平台管理员
  {
    id: 4,
    phone: '13800138004',
    password: '123456',
    name: '赵六',
    role: 'platform_admin',
    avatar: defaultAvatar,
    position: '平台管理员'
  }
];

// 招聘职位数据模拟
const recruitments = [
  // 厂家直招
  {
    id: 1,
    type: 'factory_direct',
    factory: '富士康科技集团',
    position: '操作工',
    salary: '5000-6000元/月',
    requirements: '18-45岁，身体健康，吃苦耐劳',
    welfare: '包吃住，五险一金，年终奖',
    contact: '张经理 13800138005',
    publishDate: '2026-01-15'
  },
  {
    id: 2,
    type: 'factory_direct',
    factory: '华为技术有限公司',
    position: '质检员',
    salary: '6000-7000元/月',
    requirements: '20-40岁，高中以上学历，有质检经验优先',
    welfare: '包吃住，五险一金，带薪年假',
    contact: '李经理 13800138006',
    publishDate: '2026-01-10'
  },
  // 平台招聘
  {
    id: 3,
    type: 'platform',
    factory: '比亚迪股份有限公司',
    position: '装配工',
    salary: '5500-6500元/月',
    requirements: '18-45岁，身体健康，服从安排',
    welfare: '包吃住，五险一金，节日福利',
    contact: '王经理 13800138007',
    publishDate: '2026-01-08'
  },
  // 劳务招聘
  {
    id: 4,
    type: 'labor',
    laborCompany: '三鼎劳务有限公司',
    factory: '特斯拉上海工厂',
    position: '生产操作员',
    salary: '6000-7500元/月',
    requirements: '18-40岁，初中以上学历，能适应倒班',
    welfare: '包吃住，五险一金，绩效奖金',
    contact: '刘经理 13800138008',
    publishDate: '2026-01-05'
  }
];

// 考勤数据模拟
const attendance = [
  {
    id: 1,
    workerId: 1,
    workerName: '张三',
    date: '2026-01-20',
    status: '正常',
    checkInTime: '08:00',
    checkOutTime: '17:00',
    hours: 8
  },
  {
    id: 2,
    workerId: 1,
    workerName: '张三',
    date: '2026-01-21',
    status: '正常',
    checkInTime: '08:05',
    checkOutTime: '17:00',
    hours: 8
  },
  {
    id: 3,
    workerId: 1,
    workerName: '张三',
    date: '2026-01-22',
    status: '迟到',
    checkInTime: '08:30',
    checkOutTime: '17:00',
    hours: 7.5
  },
  {
    id: 4,
    workerId: 1,
    workerName: '张三',
    date: '2026-01-23',
    status: '正常',
    checkInTime: '08:00',
    checkOutTime: '18:00',
    hours: 10
  },
  {
    id: 5,
    workerId: 1,
    workerName: '张三',
    date: '2026-01-24',
    status: '正常',
    checkInTime: '08:00',
    checkOutTime: '17:00',
    hours: 8
  }
];

// 工资条数据模拟
const salarySlips = [
  {
    id: 1,
    workerId: 1,
    workerName: '张三',
    month: '2026-01',
    baseSalary: 4000,
    overtimePay: 800,
    performanceBonus: 500,
    allowance: 300,
    deductions: 200,
    netSalary: 5400,
    issueDate: '2026-02-05'
  },
  {
    id: 2,
    workerId: 1,
    workerName: '张三',
    month: '2025-12',
    baseSalary: 4000,
    overtimePay: 600,
    performanceBonus: 400,
    allowance: 300,
    deductions: 180,
    netSalary: 5120,
    issueDate: '2026-01-05'
  }
];

// 业务课堂数据模拟
const businessClass = [
  {
    id: 1,
    factory: '富士康科技集团',
    title: '厂规厂纪培训',
    content: '1. 遵守工厂作息时间\n2. 遵守安全生产规定\n3. 服从工作安排\n4. 保持车间整洁',
    duration: '2小时',
    required: true
  },
  {
    id: 2,
    factory: '富士康科技集团',
    title: '工作内容培训',
    content: '1. 熟悉生产流程\n2. 掌握操作技能\n3. 了解质量标准\n4. 学会设备维护',
    duration: '4小时',
    required: true
  },
  {
    id: 3,
    factory: '富士康科技集团',
    title: '安全教育培训',
    content: '1. 消防安全知识\n2. 用电安全知识\n3. 机械操作安全\n4. 紧急情况处理',
    duration: '3小时',
    required: true
  }
];

// 消息通知数据模拟
const messages = [
  {
    id: 1,
    userId: 1,
    userType: 'worker',
    type: 'todo',
    title: '业务课堂待完成',
    content: '您需要完成富士康科技集团的业务课堂学习，请及时查看。',
    status: '未读',
    createTime: '2026-01-20 10:00:00'
  },
  {
    id: 2,
    userId: 1,
    userType: 'worker',
    type: 'notification',
    title: '工资条已发放',
    content: '2026年1月份工资条已发放，请查看。',
    status: '未读',
    createTime: '2026-02-05 09:00:00'
  },
  {
    id: 3,
    userId: 1,
    userType: 'worker',
    type: 'notification',
    title: '新招聘信息',
    content: '有3个新的招聘职位发布，适合您的技能水平，请查看。',
    status: '已读',
    createTime: '2026-01-15 14:00:00'
  }
];

// 劳务公司数据模拟
const laborCompanies = [
  {
    id: 1,
    name: '三鼎劳务有限公司',
    contact: '张总 13800138009',
    address: '上海市浦东新区张江高科技园区',
    employees: 150,
    workers: 2000,
    established: '2010-01-01',
    description: '专业的劳务派遣公司，为各类企业提供优质的人力资源服务。'
  },
  {
    id: 2,
    name: '诚信劳务服务有限公司',
    contact: '李总 13800138010',
    address: '北京市朝阳区CBD商务中心',
    employees: 100,
    workers: 1500,
    established: '2012-03-01',
    description: '专注于制造业和服务业的劳务派遣服务。'
  }
];

// 工厂数据模拟
const factories = [
  {
    id: 1,
    name: '富士康科技集团',
    contact: '王总 13800138011',
    address: '深圳市龙华区富士康科技园区',
    employees: 50000,
    established: '1974-02-20',
    description: '全球领先的电子制造服务商，专注于通讯、消费电子、云计算等领域。'
  },
  {
    id: 2,
    name: '华为技术有限公司',
    contact: '刘总 13800138012',
    address: '深圳市龙岗区坂田华为基地',
    employees: 200000,
    established: '1987-09-15',
    description: '全球领先的信息与通信技术解决方案供应商。'
  }
];

// 租户套餐数据模拟
const packages = [
  {
    id: 1,
    type: 'tenant',
    name: '基础版',
    price: 1999,
    maxUsers: 10,
    features: ['招聘管理', '工人管理', '考勤管理', '工资结算']
  },
  {
    id: 2,
    type: 'tenant',
    name: '高级版',
    price: 3999,
    maxUsers: 30,
    features: ['招聘管理', '工人管理', '考勤管理', '工资结算', '培训管理', '福利管理']
  },
  {
    id: 3,
    type: 'tenant',
    name: '企业版',
    price: 5999,
    maxUsers: 50,
    features: ['招聘管理', '工人管理', '考勤管理', '工资结算', '培训管理', '福利管理', '业务课堂', '数据分析']
  }
];

// API接口模拟

// 登录接口
Mock.mock('/api/login', 'post', (options) => {
  const { phone, password } = JSON.parse(options.body);
  const user = users.find(u => u.phone === phone && u.password === password);
  if (user) {
    return {
      code: 200,
      message: '登录成功',
      data: {
        token: Mock.Random.string(32),
        user: {
          id: user.id,
          phone: user.phone,
          name: user.name,
          role: user.role,
          avatar: user.avatar,
          ...(user.role === 'worker' && {
            currentLaborCompany: user.currentLaborCompany,
            currentFactory: user.currentFactory,
            factorySection: user.factorySection,
            position: user.position
          }),
          ...(user.role === 'tenant' && {
            companyName: user.companyName,
            position: user.position
          })
        }
      }
    };
  } else {
    return {
      code: 401,
      message: '手机号或密码错误'
    };
  }
});

// 获取招聘职位列表
Mock.mock('/api/recruitments', 'get', (options) => {
  const { type } = options.url.match(/\?type=(\w+)/)?.[1] || '';
  let filteredRecruitments = recruitments;
  if (type) {
    filteredRecruitments = recruitments.filter(r => r.type === type);
  }
  return {
    code: 200,
    message: '获取成功',
    data: filteredRecruitments
  };
});

// 获取工人考勤记录
Mock.mock('/api/attendance', 'get', (options) => {
  const { workerId, startDate, endDate } = options.url.match(/\?workerId=(\d+)&startDate=(\d{4}-\d{2}-\d{2})&endDate=(\d{4}-\d{2}-\d{2})/)?.slice(1) || [];
  let filteredAttendance = attendance;
  if (workerId) {
    filteredAttendance = attendance.filter(a => a.workerId == workerId);
  }
  // 这里可以添加日期过滤逻辑
  return {
    code: 200,
    message: '获取成功',
    data: filteredAttendance
  };
});

// 获取工人工资条
Mock.mock('/api/salary-slips', 'get', (options) => {
  const { workerId } = options.url.match(/\?workerId=(\d+)/)?.[1] || '';
  let filteredSalarySlips = salarySlips;
  if (workerId) {
    filteredSalarySlips = salarySlips.filter(s => s.workerId == workerId);
  }
  return {
    code: 200,
    message: '获取成功',
    data: filteredSalarySlips
  };
});

// 获取业务课堂内容
Mock.mock('/api/business-class', 'get', (options) => {
  const { factory } = options.url.match(/\?factory=(.+)/)?.[1] || '';
  let filteredTraining = businessClass;
  if (factory) {
    filteredTraining = businessClass.filter(t => t.factory === decodeURIComponent(factory));
  }
  return {
    code: 200,
    message: '获取成功',
    data: filteredTraining
  };
});

// 获取消息通知
Mock.mock('/api/messages', 'get', (options) => {
  const { userId, userType, type } = options.url.match(/\?userId=(\d+)&userType=(\w+)&type=(\w+)/)?.slice(1) || [];
  let filteredMessages = messages;
  if (userId && userType) {
    filteredMessages = messages.filter(m => m.userId == userId && m.userType === userType);
  }
  if (type) {
    filteredMessages = filteredMessages.filter(m => m.type === type);
  }
  return {
    code: 200,
    message: '获取成功',
    data: filteredMessages
  };
});

// 获取劳务公司列表
Mock.mock('/api/labor-companies', 'get', () => {
  return {
    code: 200,
    message: '获取成功',
    data: laborCompanies
  };
});

// 获取工厂列表
Mock.mock('/api/factories', 'get', () => {
  return {
    code: 200,
    message: '获取成功',
    data: factories
  };
});

// 获取套餐列表
Mock.mock('/api/packages', 'get', (options) => {
  const { type } = options.url.match(/\?type=(\w+)/)?.[1] || '';
  let filteredPackages = packages;
  if (type) {
    filteredPackages = packages.filter(p => p.type === type);
  }
  return {
    code: 200,
    message: '获取成功',
    data: filteredPackages
  };
});

// 劳务公司仪表盘数据模拟
const laborCompanyStats = {
  totalWorkers: 1250,
  activeWorkers: 1120,
  recruitmentCount: 35,
  attendanceRate: 92.5
};

const laborCompanyRecruitments = [
  {
    id: 1,
    title: '生产操作员',
    factoryName: '特斯拉上海工厂',
    requiredWorkers: 50,
    status: 'active',
    createdAt: '2026-01-20 10:00:00'
  },
  {
    id: 2,
    title: '质检员',
    factoryName: '华为技术有限公司',
    requiredWorkers: 20,
    status: 'active',
    createdAt: '2026-01-19 14:30:00'
  },
  {
    id: 3,
    title: '装配工',
    factoryName: '比亚迪股份有限公司',
    requiredWorkers: 30,
    status: 'pending',
    createdAt: '2026-01-18 09:15:00'
  },
  {
    id: 4,
    title: '仓库管理员',
    factoryName: '富士康科技集团',
    requiredWorkers: 15,
    status: 'active',
    createdAt: '2026-01-17 16:45:00'
  },
  {
    id: 5,
    title: '物流操作员',
    factoryName: '京东物流',
    requiredWorkers: 40,
    status: 'completed',
    createdAt: '2026-01-16 11:20:00'
  }
];

const laborCompanyAttendanceStats = [
  {
    department: '生产一部',
    totalWorkers: 320,
    present: 305,
    absent: 10,
    leave: 5,
    rate: 95.3
  },
  {
    department: '生产二部',
    totalWorkers: 280,
    present: 252,
    absent: 20,
    leave: 8,
    rate: 90
  },
  {
    department: '质检部',
    totalWorkers: 150,
    present: 145,
    absent: 3,
    leave: 2,
    rate: 96.7
  },
  {
    department: '仓储部',
    totalWorkers: 200,
    present: 180,
    absent: 15,
    leave: 5,
    rate: 90
  },
  {
    department: '物流部',
    totalWorkers: 170,
    present: 155,
    absent: 10,
    leave: 5,
    rate: 91.2
  }
];

// 劳务公司API接口模拟
// 获取统计数据
Mock.mock('/api/tenant/stats', 'get', () => {
  return {
    code: 200,
    message: '获取成功',
    data: laborCompanyStats
  };
});

// 获取最近招聘
Mock.mock('/api/tenant/recruitments', 'get', (options) => {
  const { limit } = options.url.match(/\?limit=(\d+)/)?.[1] || '5';
  const limitedRecruitments = laborCompanyRecruitments.slice(0, parseInt(limit));
  return {
    code: 200,
    message: '获取成功',
    data: limitedRecruitments
  };
});

// 获取考勤统计
Mock.mock('/api/tenant/attendance-stats', 'get', () => {
  return {
    code: 200,
    message: '获取成功',
    data: laborCompanyAttendanceStats
  };
});

// ==================== 离职管理Mock数据 ====================
const resignations = [
  {
    id: 1,
    workerName: '张三',
    phone: '13800138001',
    idCard: '110101199001011234',
    factory: '富士康科技集团',
    position: '操作工',
    entryDate: '2025-01-01',
    resignationDate: '2026-02-20',
    resignationType: 'voluntary',
    resignationReason: '个人原因，需要回家照顾家人',
    handover: '工作已交接完毕，工具已归还',
    remark: '',
    approvalStatus: 'APPROVED',
    resignationStatus: 'COMPLETED',
    createTime: '2026-02-15 10:00:00'
  },
  {
    id: 2,
    workerName: '李四',
    phone: '13800138002',
    idCard: '110101199002021234',
    factory: '华为技术有限公司',
    position: '质检员',
    entryDate: '2025-03-15',
    resignationDate: '2026-02-25',
    resignationType: 'voluntary',
    resignationReason: '回家发展',
    handover: '工作已交接',
    remark: '',
    approvalStatus: 'IN_PROGRESS',
    resignationStatus: 'IN_PROGRESS',
    createTime: '2026-02-18 14:30:00'
  },
  {
    id: 3,
    workerName: '王五',
    phone: '13800138003',
    idCard: '110101199003031234',
    factory: '比亚迪股份有限公司',
    position: '装配工',
    entryDate: '2025-06-01',
    resignationDate: '',
    resignationType: '',
    resignationReason: '薪资待遇',
    handover: '',
    remark: '',
    approvalStatus: 'PENDING',
    resignationStatus: 'NOT_STARTED',
    createTime: '2026-02-20 09:15:00'
  },
  {
    id: 4,
    workerName: '赵六',
    phone: '13800138004',
    idCard: '110101199004041234',
    factory: '特斯拉上海工厂',
    position: '生产操作员',
    entryDate: '2025-08-01',
    resignationDate: '2026-02-18',
    resignationType: 'contract_expired',
    resignationReason: '合同到期',
    handover: '合同已到期',
    remark: '',
    approvalStatus: 'REJECTED',
    resignationStatus: 'NOT_STARTED',
    createTime: '2026-02-10 16:45:00'
  }
];

// 离职审核记录
const resignationApprovalRecords = [
  {
    resignationId: 1,
    records: [
      {
        nodeName: '部门主管审核',
        approver: '李经理',
        approvalTime: '2026-02-16 14:30:00',
        approvalResult: 'approved',
        approvalComment: '情况属实，同意离职'
      },
      {
        nodeName: '人事审核',
        approver: '王经理',
        approvalTime: '2026-02-17 09:00:00',
        approvalResult: 'approved',
        approvalComment: '手续齐全，同意离职'
      }
    ]
  }
];

// 获取离职列表
Mock.mock('/api/tenant/resignations', 'get', () => {
  return {
    code: 200,
    message: '获取成功',
    data: resignations
  };
});

// 获取离职详情
Mock.mock(/\/api\/labor-company\/resignations\/\d+/, 'get', (options) => {
  const id = options.url.match(/\/api\/labor-company\/resignations\/(\d+)/)?.[1];
  const resignation = resignations.find(r => r.id == id) || resignations[0];
  const records = resignationApprovalRecords.find(r => r.resignationId == id)?.records || [];
  return {
    code: 200,
    message: '获取成功',
    data: {
      ...resignation,
      approvalRecords: records
    }
  };
});

// 创建离职
Mock.mock('/api/tenant/resignations', 'post', (options) => {
  return {
    code: 200,
    message: '创建成功',
    data: { id: Date.now() }
  };
});

// 更新离职
Mock.mock(/\/api\/labor-company\/resignations\/\d+/, 'put', () => {
  return {
    code: 200,
    message: '更新成功',
    data: null
  };
});

// 删除离职
Mock.mock(/\/api\/labor-company\/resignations\/\d+/, 'delete', () => {
  return {
    code: 200,
    message: '删除成功',
    data: null
  };
});

// 提交离职审核
Mock.mock(/\/api\/labor-company\/resignations\/\d+\/approve/, 'post', () => {
  return {
    code: 200,
    message: '审核提交成功',
    data: null
  };
});

// ==================== 工作转介绍Mock数据 ====================
const referrals = [
  {
    id: 1,
    workerName: '张三',
    phone: '13800138001',
    idCard: '110101199001011234',
    gender: '男',
    age: 28,
    education: '高中/中专',
    factory: '富士康科技集团',
    position: '操作工',
    referralDate: '2026-01-15',
    expectedEntryDate: '2026-01-20',
    entryDate: '2026-01-20',
    salaryType: 'monthly',
    workDays: 35,
    referrerName: '李四',
    referrerPhone: '13800138002',
    remark: '介绍老乡入职',
    commissionRule: '月结规则-进厂30天发放500元，进厂60天发放500元，进厂90天发放500元',
    totalCommission: 1500,
    paidCommission: 500,
    commissionStatus: 'partial',
    createTime: '2026-01-15 10:00:00'
  },
  {
    id: 2,
    workerName: '王五',
    phone: '13800138003',
    idCard: '110101199003031234',
    gender: '男',
    age: 25,
    education: '大专',
    factory: '华为技术有限公司',
    position: '质检员',
    referralDate: '2026-01-18',
    expectedEntryDate: '2026-01-25',
    entryDate: '2026-01-25',
    salaryType: 'monthly',
    workDays: 30,
    referrerName: '赵六',
    referrerPhone: '13800138004',
    remark: '朋友介绍',
    commissionRule: '月结规则-进厂30天发放300元，进厂60天发放300元',
    totalCommission: 600,
    paidCommission: 0,
    commissionStatus: 'pending',
    createTime: '2026-01-18 14:30:00'
  },
  {
    id: 3,
    workerName: '孙七',
    phone: '13800138005',
    idCard: '110101199005051234',
    gender: '女',
    age: 24,
    education: '高中/中专',
    factory: '比亚迪股份有限公司',
    position: '装配工',
    referralDate: '2026-02-01',
    expectedEntryDate: '2026-02-10',
    entryDate: '2026-02-10',
    salaryType: 'daily',
    workDays: 15,
    referrerName: '周八',
    referrerPhone: '13800138006',
    remark: '',
    commissionRule: '日结规则-进厂30天发放200元，进厂60天发放200元',
    totalCommission: 400,
    paidCommission: 0,
    commissionStatus: 'pending',
    createTime: '2026-02-01 09:15:00'
  }
];

// 佣金发放记录
const commissionRecords = [
  {
    referralId: 1,
    records: [
      {
        amount: 500,
        issueDate: '2026-02-20',
        issueType: '第一次发放',
        remark: '进厂30天'
      }
    ]
  }
];

// 获取转介绍列表
Mock.mock('/api/tenant/referrals', 'get', () => {
  return {
    code: 200,
    message: '获取成功',
    data: referrals
  };
});

// 获取转介绍详情
Mock.mock(/\/api\/labor-company\/referrals\/\d+/, 'get', (options) => {
  const id = options.url.match(/\/api\/labor-company\/referrals\/(\d+)/)?.[1];
  const referral = referrals.find(r => r.id == id) || referrals[0];
  const records = commissionRecords.find(r => r.referralId == id)?.records || [];
  return {
    code: 200,
    message: '获取成功',
    data: {
      ...referral,
      commissionRecords: records
    }
  };
});

// 创建转介绍
Mock.mock('/api/tenant/referrals', 'post', () => {
  return {
    code: 200,
    message: '创建成功',
    data: { id: Date.now() }
  };
});

// 更新转介绍
Mock.mock(/\/api\/labor-company\/referrals\/\d+/, 'put', () => {
  return {
    code: 200,
    message: '更新成功',
    data: null
  };
});

// 删除转介绍
Mock.mock(/\/api\/labor-company\/referrals\/\d+/, 'delete', () => {
  return {
    code: 200,
    message: '删除成功',
    data: null
  };
});

// ==================== 佣金发放Mock数据 ====================
const commissions = [
  {
    id: 1,
    workerName: '张三',
    phone: '13800138001',
    factory: '富士康科技集团',
    position: '操作工',
    entryDate: '2026-01-20',
    referrerName: '李四',
    referrerPhone: '13800138002',
    workDays: 35,
    pendingAmount: 500,
    paidAmount: 500,
    totalAmount: 1000,
    status: 'pending'
  },
  {
    id: 2,
    workerName: '王五',
    phone: '13800138003',
    factory: '华为技术有限公司',
    position: '质检员',
    entryDate: '2026-01-25',
    referrerName: '赵六',
    referrerPhone: '13800138004',
    workDays: 30,
    pendingAmount: 300,
    paidAmount: 200,
    totalAmount: 500,
    status: 'pending'
  },
  {
    id: 3,
    workerName: '孙七',
    phone: '13800138005',
    factory: '比亚迪股份有限公司',
    position: '装配工',
    entryDate: '2026-02-10',
    referrerName: '周八',
    referrerPhone: '13800138006',
    workDays: 15,
    pendingAmount: 200,
    paidAmount: 0,
    totalAmount: 200,
    status: 'pending'
  },
  {
    id: 4,
    workerName: '吴九',
    phone: '13800138007',
    factory: '特斯拉上海工厂',
    position: '生产操作员',
    entryDate: '2026-01-15',
    referrerName: '郑十',
    referrerPhone: '13800138008',
    workDays: 40,
    pendingAmount: 0,
    paidAmount: 1500,
    totalAmount: 1500,
    status: 'issued'
  }
];

// 获取佣金发放列表
Mock.mock('/api/tenant/commissions', 'get', () => {
  return {
    code: 200,
    message: '获取成功',
    data: commissions
  };
});

// 佣金发放
Mock.mock(/\/api\/labor-company\/commissions\/\d+\/issue/, 'post', () => {
  return {
    code: 200,
    message: '发放成功',
    data: null
  };
});

// 批量佣金发放
Mock.mock('/api/tenant/commissions/batch-issue', 'post', () => {
  return {
    code: 200,
    message: '批量发放成功',
    data: null
  };
});

// 佣金规则配置
const commissionRules = {
  daily: {
    requiredDays: 30,
    firstAmount: 300,
    secondAmount: 300,
    thirdAmount: 300,
    subsequentAmount: 200,
    intervalDays: 30
  },
  monthly: {
    requiredDays: 30,
    firstAmount: 500,
    secondAmount: 500,
    thirdAmount: 500,
    subsequentAmount: 300,
    intervalDays: 30
  }
};

// 获取佣金规则
Mock.mock('/api/tenant/commission-rules', 'get', () => {
  return {
    code: 200,
    message: '获取成功',
    data: commissionRules
  };
});

// 保存佣金规则
Mock.mock('/api/tenant/commission-rules', 'post', () => {
  return {
    code: 200,
    message: '保存成功',
    data: null
  };
});

// ==================== 结算管理Mock数据 ====================
const settlements = [
  {
    id: 1,
    issueMonth: '2026-01',
    factory: '富士康科技集团',
    issueDate: '2026-02-05',
    issueDescription: '2026年1月份工资结算',
    workerCount: 150,
    totalAmount: 825000,
    status: 'completed',
    createTime: '2026-02-01 10:00:00'
  },
  {
    id: 2,
    issueMonth: '2026-01',
    factory: '华为技术有限公司',
    issueDate: '2026-02-08',
    issueDescription: '2026年1月份工资结算',
    workerCount: 80,
    totalAmount: 520000,
    status: 'completed',
    createTime: '2026-02-03 14:30:00'
  },
  {
    id: 3,
    issueMonth: '2026-02',
    factory: '比亚迪股份有限公司',
    issueDate: '',
    issueDescription: '2026年2月份工资结算',
    workerCount: 120,
    totalAmount: 680000,
    status: 'pending',
    createTime: '2026-02-20 09:15:00'
  }
];

// 工人工资清单
const settlementWorkerList = [
  {
    settlementId: 1,
    workers: [
      {
        workerName: '张三',
        phone: '13800138001',
        idCard: '110101199001011234',
        bankName: '中国工商银行',
        bankAccount: '6222021234567890',
        workDays: 30,
        baseSalary: 4000,
        overtimePay: 800,
        performanceBonus: 500,
        allowance: 300,
        deductions: 200,
        netSalary: 5400,
        status: 'issued'
      },
      {
        workerName: '李四',
        phone: '13800138002',
        idCard: '110101199002021234',
        bankName: '中国农业银行',
        bankAccount: '6222021234567891',
        workDays: 28,
        baseSalary: 3800,
        overtimePay: 600,
        performanceBonus: 400,
        allowance: 200,
        deductions: 150,
        netSalary: 4850,
        status: 'issued'
      },
      {
        workerName: '王五',
        phone: '13800138003',
        idCard: '110101199003031234',
        bankName: '中国建设银行',
        bankAccount: '6222021234567892',
        workDays: 31,
        baseSalary: 4200,
        overtimePay: 900,
        performanceBonus: 600,
        allowance: 300,
        deductions: 180,
        netSalary: 5820,
        status: 'issued'
      }
    ]
  }
];

// 获取结算列表
Mock.mock('/api/tenant/settlements', 'get', () => {
  return {
    code: 200,
    message: '获取成功',
    data: settlements
  };
});

// 获取结算详情
Mock.mock(/\/api\/labor-company\/settlements\/\d+/, 'get', (options) => {
  const id = options.url.match(/\/api\/labor-company\/settlements\/(\d+)/)?.[1];
  const settlement = settlements.find(s => s.id == id) || settlements[0];
  const workerList = settlementWorkerList.find(w => w.settlementId == id)?.workers || [];
  return {
    code: 200,
    message: '获取成功',
    data: {
      ...settlement,
      workerList
    }
  };
});

// 创建结算
Mock.mock('/api/tenant/settlements', 'post', () => {
  return {
    code: 200,
    message: '创建成功',
    data: { id: Date.now() }
  };
});

// 批量发放结算
Mock.mock(/\/api\/labor-company\/settlements\/\d+\/batch-issue/, 'post', () => {
  return {
    code: 200,
    message: '批量发放成功',
    data: null
  };
});

// ==================== 平台管理端Mock数据 ====================

// 待办任务数据
const adminTodos = [
  {
    id: 1,
    title: '审核租户申请 - 三鼎劳务有限公司',
    type: 'tenant_audit',
    priority: 'high',
    status: 'pending',
    content: '待审核的租户申请,需要核实企业资质和经营状况',
    applicant: '张经理',
    applyTime: '2026-02-25 10:30:00',
    deadline: '2026-02-27 18:00:00',
    createTime: '2026-02-25 10:30:00'
  },
  {
    id: 2,
    title: '处理预警消息 - 工人离职率异常',
    type: 'warning_handle',
    priority: 'urgent',
    status: 'pending',
    content: '某劳务公司工人离职率超过预警阈值,需要及时处理',
    source: '系统自动预警',
    warningTime: '2026-02-25 09:15:00',
    createTime: '2026-02-25 09:15:00'
  },
  {
    id: 3,
    title: '审核活动申请 - 春节招聘活动',
    type: 'activity_audit',
    priority: 'medium',
    status: 'in_progress',
    content: '劳务公司提交的春节招聘活动申请,需要审核活动方案和预算',
    applicant: '李经理',
    applyTime: '2026-02-24 14:20:00',
    deadline: '2026-02-26 18:00:00',
    createTime: '2026-02-24 14:20:00'
  },
  {
    id: 4,
    title: '处理用户投诉 - 工资发放延迟',
    type: 'complaint_handle',
    priority: 'high',
    status: 'pending',
    content: '工人投诉工资发放延迟,需要调查并协调解决',
    complainant: '王工人',
    complaintTime: '2026-02-25 08:00:00',
    createTime: '2026-02-25 08:00:00'
  },
  {
    id: 5,
    title: '审核佣金发放规则 - 月结规则',
    type: 'commission_rule_audit',
    priority: 'medium',
    status: 'completed',
    content: '劳务公司提交的佣金发放规则修改申请,需要审核',
    applicant: '赵经理',
    applyTime: '2026-02-23 16:45:00',
    completeTime: '2026-02-24 10:30:00',
    createTime: '2026-02-23 16:45:00'
  }
];

// 消息数据
const adminMessages = [
  {
    id: 1,
    title: '系统维护通知',
    type: 'system',
    content: '系统将于2026年2月28日凌晨2:00-4:00进行维护升级,届时将暂停服务,请提前做好准备。',
    sender: '系统管理员',
    sendTime: '2026-02-25 10:00:00',
    status: 'unread',
    priority: 'high'
  },
  {
    id: 2,
    title: '新功能上线通知',
    type: 'feature',
    content: '平台新增了智能推荐功能,可以根据工人技能和历史数据智能匹配岗位,提升招聘效率。',
    sender: '产品团队',
    sendTime: '2026-02-24 15:30:00',
    status: 'read',
    priority: 'medium'
  },
  {
    id: 3,
    title: '政策更新通知',
    type: 'policy',
    content: '根据最新劳动法规要求,平台更新了工人权益保障相关政策,请各租户及时了解并遵照执行。',
    sender: '法务部',
    sendTime: '2026-02-23 09:00:00',
    status: 'read',
    priority: 'high'
  },
  {
    id: 4,
    title: '培训通知',
    type: 'training',
    content: '平台将于2026年3月1日举办系统操作培训,请各租户管理员准时参加。',
    sender: '培训部',
    sendTime: '2026-02-22 14:00:00',
    status: 'unread',
    priority: 'medium'
  }
];

// 预警消息数据
const adminWarnings = [
  {
    id: 1,
    title: '工人离职率异常预警',
    type: 'turnover_rate',
    level: 'high',
    content: '南通富民劳务服务有限公司本月工人离职率达到15%,超过预警阈值10%,请及时关注。',
    target: '南通富民劳务服务有限公司',
    warningTime: '2026-02-25 09:15:00',
    status: 'unhandled',
    handleTime: null,
    handler: null
  },
  {
    id: 2,
    title: '投诉率异常预警',
    type: 'complaint_rate',
    level: 'medium',
    content: '三鼎劳务有限公司本月投诉率达到5%,超过预警阈值3%,需要关注服务质量。',
    target: '三鼎劳务有限公司',
    warningTime: '2026-02-24 16:30:00',
    status: 'handled',
    handleTime: '2026-02-25 10:00:00',
    handler: '张管理员'
  },
  {
    id: 3,
    title: '系统性能预警',
    type: 'system_performance',
    level: 'high',
    content: '系统响应时间超过3秒,影响用户体验,需要优化系统性能。',
    target: '系统',
    warningTime: '2026-02-24 10:00:00',
    status: 'handled',
    handleTime: '2026-02-24 14:00:00',
    handler: '技术团队'
  },
  {
    id: 4,
    title: '数据安全预警',
    type: 'data_security',
    level: 'urgent',
    content: '检测到异常登录行为,可能存在安全风险,需要立即处理。',
    target: '系统',
    warningTime: '2026-02-23 08:00:00',
    status: 'handled',
    handleTime: '2026-02-23 09:00:00',
    handler: '安全团队'
  }
];

// 套餐数据
const platformPackages = [
  {
    id: 1,
    type: 'tenant',
    name: '基础版',
    code: 'BASIC',
    price: 1999,
    originalPrice: 2999,
    period: 'month',
    maxUsers: 10,
    maxWorkers: 500,
    features: ['招聘管理', '工人管理', '考勤管理', '工资结算', '基础报表'],
    description: '适合小型租户的基础套餐,包含核心功能。',
    status: 'active',
    sortOrder: 1,
    createTime: '2026-01-01 10:00:00'
  },
  {
    id: 2,
    type: 'tenant',
    name: '高级版',
    code: 'ADVANCED',
    price: 3999,
    originalPrice: 5999,
    period: 'month',
    maxUsers: 30,
    maxWorkers: 2000,
    features: ['招聘管理', '工人管理', '考勤管理', '工资结算', '培训管理', '福利管理', '高级报表', '数据导出'],
    description: '适合中型租户的高级套餐,功能更全面。',
    status: 'active',
    sortOrder: 2,
    createTime: '2026-01-01 10:00:00'
  },
  {
    id: 3,
    type: 'tenant',
    name: '企业版',
    code: 'ENTERPRISE',
    price: 7999,
    originalPrice: 9999,
    period: 'month',
    maxUsers: 100,
    maxWorkers: 10000,
    features: ['招聘管理', '工人管理', '考勤管理', '工资结算', '培训管理', '福利管理', '高级报表', '数据导出', 'API接口', '专属客服'],
    description: '适合大型租户的企业套餐,支持定制化服务。',
    status: 'active',
    sortOrder: 3,
    createTime: '2026-01-01 10:00:00'
  }
];

// 租户数据
const tenants = [
  {
    id: 1,
    type: 'tenant',
    name: '南通富民劳务服务有限公司',
    code: 'NTFM001',
    contact: '张经理',
    phone: '13800138001',
    email: 'zhangjl@ntfm.com',
    address: '江苏省南通市崇川区人民中路88号',
    packageId: 2,
    packageName: '高级版',
    packageExpireDate: '2026-03-01',
    status: 'active',
    employees: 25,
    workers: 1250,
    totalRecruitment: 35,
    activeRecruitment: 8,
    createTime: '2025-01-01 10:00:00',
    auditTime: '2025-01-02 14:30:00',
    auditor: '赵管理员',
    businessLicense: '91320600MA1X123456',
    creditCode: '91320600MA1X123456',
    legalPerson: '张三',
    registeredCapital: 5000000,
    establishmentDate: '2010-05-01',
    businessScope: '劳务派遣、人力资源服务、职业介绍',
    tags: ['优质', '长期合作']
  },
  {
    id: 2,
    type: 'tenant',
    name: '三鼎劳务有限公司',
    code: 'SD001',
    contact: '李经理',
    phone: '13800138002',
    email: 'liji@sd.com',
    address: '上海市浦东新区张江高科技园区科苑路88号',
    packageId: 3,
    packageName: '企业版',
    packageExpireDate: '2026-04-15',
    status: 'active',
    employees: 80,
    workers: 3500,
    totalRecruitment: 120,
    activeRecruitment: 25,
    createTime: '2025-03-15 09:00:00',
    auditTime: '2025-03-16 11:00:00',
    auditor: '赵管理员',
    businessLicense: '91310000MA2X234567',
    creditCode: '91310000MA2X234567',
    legalPerson: '李四',
    registeredCapital: 10000000,
    establishmentDate: '2012-08-20',
    businessScope: '劳务派遣、人力资源服务、职业介绍、人才培训',
    tags: ['优质', '长期合作', '重点客户']
  },
  {
    id: 3,
    type: 'tenant',
    name: '富士康科技集团',
    code: 'FK001',
    contact: '王经理',
    phone: '13800138003',
    email: 'wangjl@foxconn.com',
    address: '深圳市龙华区富士康科技园区',
    packageId: 3,
    packageName: '企业版',
    packageExpireDate: '2026-05-01',
    status: 'active',
    employees: 45,
    workers: 8000,
    totalRecruitment: 200,
    activeRecruitment: 30,
    createTime: '2025-02-01 10:00:00',
    auditTime: '2025-02-02 14:00:00',
    auditor: '赵管理员',
    businessLicense: '91440300MA3X345678',
    creditCode: '91440300MA3X345678',
    legalPerson: '王五',
    registeredCapital: 500000000,
    establishmentDate: '1974-02-20',
    businessScope: '电子产品制造、软件开发、技术服务',
    tags: ['优质', '长期合作', '重点客户', '大客户']
  },
  {
    id: 4,
    type: 'tenant',
    name: '华为技术有限公司',
    code: 'HW001',
    contact: '刘经理',
    phone: '13800138004',
    email: 'liujl@huawei.com',
    address: '深圳市龙岗区坂田华为基地',
    packageId: 3,
    packageName: '企业版',
    packageExpireDate: '2026-06-01',
    status: 'active',
    employees: 60,
    workers: 5000,
    totalRecruitment: 150,
    activeRecruitment: 20,
    createTime: '2025-04-01 10:00:00',
    auditTime: '2025-04-02 15:00:00',
    auditor: '赵管理员',
    businessLicense: '91440300MA4X456789',
    creditCode: '91440300MA4X456789',
    legalPerson: '刘六',
    registeredCapital: 300000000,
    establishmentDate: '1987-09-15',
    businessScope: '通信设备制造、软件开发、技术服务',
    tags: ['优质', '长期合作', '重点客户', '大客户']
  },
  {
    id: 5,
    type: 'tenant',
    name: '诚信劳务服务有限公司',
    code: 'CX001',
    contact: '赵经理',
    phone: '13800138005',
    email: 'zhaojl@cx.com',
    address: '北京市朝阳区CBD商务中心',
    packageId: 1,
    packageName: '基础版',
    packageExpireDate: '2026-02-28',
    status: 'pending',
    employees: 8,
    workers: 300,
    totalRecruitment: 15,
    activeRecruitment: 3,
    createTime: '2026-02-20 10:00:00',
    auditTime: null,
    auditor: null,
    businessLicense: '91110000MA5X567890',
    creditCode: '91110000MA5X567890',
    legalPerson: '赵七',
    registeredCapital: 2000000,
    establishmentDate: '2018-03-01',
    businessScope: '劳务派遣、人力资源服务',
    tags: []
  }
];

// 招聘需求数据
const recruitmentDemands = [
  {
    id: 1,
    tenantId: 1,
    tenantName: '南通富民劳务服务有限公司',
    factoryId: 3,
    factoryName: '富士康科技集团',
    title: '生产操作员',
    position: '操作工',
    requiredCount: 50,
    recruitedCount: 35,
    salaryMin: 5000,
    salaryMax: 6000,
    salaryType: 'monthly',
    gender: '不限',
    ageMin: 18,
    ageMax: 45,
    education: '不限',
    experience: '不限',
    requirements: '身体健康,吃苦耐劳,服从安排',
    welfare: '包吃住,五险一金,年终奖,节日福利',
    workLocation: '深圳市龙华区富士康科技园区',
    workTime: '8:00-17:00',
    workDays: '周一至周六',
    status: 'active',
    publishTime: '2026-02-20 10:00:00',
    expireTime: '2026-03-20 10:00:00',
    createTime: '2026-02-20 10:00:00'
  },
  {
    id: 2,
    tenantId: 2,
    tenantName: '三鼎劳务有限公司',
    factoryId: 4,
    factoryName: '华为技术有限公司',
    title: '质检员',
    position: '质检员',
    requiredCount: 20,
    recruitedCount: 12,
    salaryMin: 6000,
    salaryMax: 7000,
    salaryType: 'monthly',
    gender: '不限',
    ageMin: 20,
    ageMax: 40,
    education: '高中',
    experience: '1年以上',
    requirements: '高中以上学历,有质检经验优先',
    welfare: '包吃住,五险一金,带薪年假,节日福利',
    workLocation: '深圳市龙岗区坂田华为基地',
    workTime: '8:30-17:30',
    workDays: '周一至周五',
    status: 'active',
    publishTime: '2026-02-19 14:30:00',
    expireTime: '2026-03-19 14:30:00',
    createTime: '2026-02-19 14:30:00'
  },
  {
    id: 3,
    tenantId: 1,
    tenantName: '南通富民劳务服务有限公司',
    factoryId: 3,
    factoryName: '富士康科技集团',
    title: '装配工',
    position: '装配工',
    requiredCount: 30,
    recruitedCount: 28,
    salaryMin: 5500,
    salaryMax: 6500,
    salaryType: 'monthly',
    gender: '不限',
    ageMin: 18,
    ageMax: 45,
    education: '不限',
    experience: '不限',
    requirements: '身体健康,服从安排,能适应倒班',
    welfare: '包吃住,五险一金,年终奖,节日福利',
    workLocation: '深圳市龙华区富士康科技园区',
    workTime: '两班倒',
    workDays: '周一至周六',
    status: 'completed',
    publishTime: '2026-02-15 09:00:00',
    expireTime: '2026-03-15 09:00:00',
    createTime: '2026-02-15 09:00:00'
  }
];

// 简历数据
const resumes = [
  {
    id: 1,
    workerId: 1,
    workerName: '张三',
    phone: '13800138001',
    idCard: '110101199001011234',
    gender: '男',
    age: 28,
    education: '高中/中专',
    educationLevel: '高中',
    experience: 3,
    expectedSalary: 5500,
    expectedSalaryType: 'monthly',
    expectedPosition: '操作工',
    expectedLocation: '深圳市',
    selfIntroduction: '本人有3年工厂工作经验,吃苦耐劳,服从安排,希望能找到一份稳定的工作。',
    skills: ['操作工', '装配工', '包装工'],
    workHistory: [
      {
        company: '富士康科技集团',
        position: '操作工',
        startTime: '2023-01-01',
        endTime: '2025-12-31',
        description: '负责产品组装和质量检验'
      }
    ],
    status: 'active',
    createTime: '2026-02-20 10:00:00',
    updateTime: '2026-02-20 10:00:00'
  },
  {
    id: 2,
    workerId: 2,
    workerName: '李四',
    phone: '13800138002',
    idCard: '110101199002021234',
    gender: '男',
    age: 25,
    education: '大专',
    educationLevel: '大专',
    experience: 2,
    expectedSalary: 6000,
    expectedSalaryType: 'monthly',
    expectedPosition: '质检员',
    expectedLocation: '深圳市',
    selfIntroduction: '本人有2年质检工作经验,细心负责,希望能找到一份有发展前景的工作。',
    skills: ['质检员', '品检', '检验'],
    workHistory: [
      {
        company: '华为技术有限公司',
        position: '质检员',
        startTime: '2024-01-01',
        endTime: '2025-12-31',
        description: '负责产品质量检验和问题记录'
      }
    ],
    status: 'active',
    createTime: '2026-02-19 14:30:00',
    updateTime: '2026-02-19 14:30:00'
  },
  {
    id: 3,
    workerId: 3,
    workerName: '王五',
    phone: '13800138003',
    idCard: '110101199003031234',
    gender: '女',
    age: 24,
    education: '高中/中专',
    educationLevel: '高中',
    experience: 1,
    expectedSalary: 5000,
    expectedSalaryType: 'monthly',
    expectedPosition: '装配工',
    expectedLocation: '深圳市',
    selfIntroduction: '本人有1年装配工作经验,手脚麻利,希望能找到一份稳定的工作。',
    skills: ['装配工', '包装工'],
    workHistory: [
      {
        company: '比亚迪股份有限公司',
        position: '装配工',
        startTime: '2025-01-01',
        endTime: '2025-12-31',
        description: '负责产品组装和包装'
      }
    ],
    status: 'active',
    createTime: '2026-02-18 09:15:00',
    updateTime: '2026-02-18 09:15:00'
  }
];

// 转介绍记录数据
const platformReferrals = [
  {
    id: 1,
    tenantId: 1,
    tenantName: '南通富民劳务服务有限公司',
    workerName: '张三',
    phone: '13800138001',
    idCard: '110101199001011234',
    gender: '男',
    age: 28,
    education: '高中/中专',
    factoryId: 3,
    factoryName: '富士康科技集团',
    position: '操作工',
    referralDate: '2026-01-15',
    expectedEntryDate: '2026-01-20',
    entryDate: '2026-01-20',
    salaryType: 'monthly',
    workDays: 35,
    referrerName: '李四',
    referrerPhone: '13800138002',
    referrerReward: 1500,
    remark: '介绍老乡入职',
    commissionRule: '月结规则-进厂30天发放500元,进厂60天发放500元,进厂90天发放500元',
    totalCommission: 1500,
    paidCommission: 500,
    commissionStatus: 'partial',
    createTime: '2026-01-15 10:00:00'
  },
  {
    id: 2,
    tenantId: 2,
    tenantName: '三鼎劳务有限公司',
    workerName: '王五',
    phone: '13800138003',
    idCard: '110101199003031234',
    gender: '男',
    age: 25,
    education: '大专',
    factoryId: 4,
    factoryName: '华为技术有限公司',
    position: '质检员',
    referralDate: '2026-01-18',
    expectedEntryDate: '2026-01-25',
    entryDate: '2026-01-25',
    salaryType: 'monthly',
    workDays: 30,
    referrerName: '赵六',
    referrerPhone: '13800138004',
    referrerReward: 600,
    remark: '朋友介绍',
    commissionRule: '月结规则-进厂30天发放300元,进厂60天发放300元',
    totalCommission: 600,
    paidCommission: 0,
    commissionStatus: 'pending',
    createTime: '2026-01-18 14:30:00'
  }
];

// 佣金发放记录数据
const platformCommissionRecords = [
  {
    id: 1,
    referralId: 1,
    tenantId: 1,
    tenantName: '南通富民劳务服务有限公司',
    workerName: '张三',
    phone: '13800138001',
    factory: '富士康科技集团',
    position: '操作工',
    entryDate: '2026-01-20',
    referrerName: '李四',
    referrerPhone: '13800138002',
    workDays: 35,
    pendingAmount: 500,
    paidAmount: 500,
    totalAmount: 1000,
    status: 'pending',
    createTime: '2026-01-15 10:00:00'
  },
  {
    id: 2,
    referralId: 2,
    tenantId: 2,
    tenantName: '三鼎劳务有限公司',
    workerName: '王五',
    phone: '13800138003',
    factory: '华为技术有限公司',
    position: '质检员',
    entryDate: '2026-01-25',
    referrerName: '赵六',
    referrerPhone: '13800138004',
    workDays: 30,
    pendingAmount: 300,
    paidAmount: 200,
    totalAmount: 500,
    status: 'pending',
    createTime: '2026-01-18 14:30:00'
  }
];

// 拉新奖励记录数据
const pullNewRewards = [
  {
    id: 1,
    tenantId: 1,
    tenantName: '南通富民劳务服务有限公司',
    referrerName: '李四',
    referrerPhone: '13800138002',
    newWorkerCount: 5,
    totalReward: 500,
    paidReward: 500,
    status: 'completed',
    period: '2026-01',
    createTime: '2026-02-01 10:00:00'
  },
  {
    id: 2,
    tenantId: 2,
    tenantName: '三鼎劳务有限公司',
    referrerName: '赵六',
    referrerPhone: '13800138004',
    newWorkerCount: 3,
    totalReward: 300,
    paidReward: 0,
    status: 'pending',
    period: '2026-01',
    createTime: '2026-02-01 10:00:00'
  }
];

// 费用记录数据
const expenses = [
  {
    id: 1,
    tenantId: 1,
    tenantName: '南通富民劳务服务有限公司',
    type: 'recruitment',
    typeName: '招聘费用',
    amount: 5000,
    description: '富士康科技集团招聘活动费用',
    status: 'paid',
    payTime: '2026-02-20 14:30:00',
    createTime: '2026-02-20 10:00:00'
  },
  {
    id: 2,
    tenantId: 2,
    tenantName: '三鼎劳务有限公司',
    type: 'training',
    typeName: '培训费用',
    amount: 3000,
    description: '华为技术有限公司岗前培训费用',
    status: 'pending',
    payTime: null,
    createTime: '2026-02-19 09:15:00'
  },
  {
    id: 3,
    tenantId: 1,
    tenantName: '南通富民劳务服务有限公司',
    type: 'activity',
    typeName: '活动费用',
    amount: 8000,
    description: '春节招聘活动费用',
    status: 'paid',
    payTime: '2026-02-18 16:00:00',
    createTime: '2026-02-18 10:00:00'
  }
];

// 活动数据
const activities = [
  {
    id: 1,
    tenantId: 1,
    tenantName: '南通富民劳务服务有限公司',
    title: '春节招聘活动',
    type: 'recruitment',
    description: '春节期间大型招聘活动,提供大量优质岗位,欢迎广大工人前来应聘。',
    startTime: '2026-02-01 09:00:00',
    endTime: '2026-02-28 18:00:00',
    location: '南通市崇川区人民中路88号',
    maxParticipants: 500,
    currentParticipants: 350,
    status: 'active',
    createTime: '2026-01-25 10:00:00'
  },
  {
    id: 2,
    tenantId: 2,
    tenantName: '三鼎劳务有限公司',
    title: '技能培训活动',
    type: 'training',
    description: '为工人提供免费技能培训,提升就业竞争力。',
    startTime: '2026-03-01 09:00:00',
    endTime: '2026-03-31 18:00:00',
    location: '上海市浦东新区张江高科技园区',
    maxParticipants: 200,
    currentParticipants: 120,
    status: 'pending',
    createTime: '2026-02-20 14:30:00'
  }
];

// 报名记录数据
const registrations = [
  {
    id: 1,
    activityId: 1,
    activityTitle: '春节招聘活动',
    tenantId: 1,
    tenantName: '南通富民劳务服务有限公司',
    workerName: '张三',
    phone: '13800138001',
    idCard: '110101199001011234',
    registrationTime: '2026-02-15 10:00:00',
    status: 'approved',
    approvalTime: '2026-02-15 14:30:00',
    approver: '张经理',
    remark: '',
    createTime: '2026-02-15 10:00:00'
  },
  {
    id: 2,
    activityId: 2,
    activityTitle: '技能培训活动',
    tenantId: 2,
    tenantName: '三鼎劳务有限公司',
    workerName: '李四',
    phone: '13800138002',
    idCard: '110101199002021234',
    registrationTime: '2026-02-20 09:00:00',
    status: 'pending',
    approvalTime: null,
    approver: null,
    remark: '',
    createTime: '2026-02-20 09:00:00'
  }
];

// 注册用户数据
const registeredUsers = [
  {
    id: 1,
    phone: '13800138001',
    username: '张三',
    role: 'worker',
    avatar: defaultAvatar,
    idCard: '110101199001011234',
    gender: '男',
    age: 28,
    education: '高中/中专',
    status: 'active',
    registerTime: '2025-01-01 10:00:00',
    lastLoginTime: '2026-02-25 10:30:00',
    loginCount: 156
  },
  {
    id: 2,
    phone: '13800138002',
    username: '李四',
    role: 'labor_company',
    avatar: defaultAvatar,
    laborCompany: '三鼎劳务有限公司',
    position: '招聘经理',
    status: 'active',
    registerTime: '2025-03-15 09:00:00',
    lastLoginTime: '2026-02-25 09:15:00',
    loginCount: 89
  },
  {
    id: 3,
    phone: '13800138003',
    username: '王五',
    role: 'factory',
    avatar: defaultAvatar,
    factory: '富士康科技集团',
    position: '人事主管',
    status: 'active',
    registerTime: '2025-02-01 10:00:00',
    lastLoginTime: '2026-02-24 16:45:00',
    loginCount: 234
  }
];

// 租户标签数据
const tenantTags = [
  {
    id: 1,
    name: '优质',
    color: '#67c23a',
    description: '服务质量优秀,用户满意度高',
    sortOrder: 1,
    createTime: '2025-01-01 10:00:00'
  },
  {
    id: 2,
    name: '长期合作',
    color: '#409eff',
    description: '合作时间超过1年',
    sortOrder: 2,
    createTime: '2025-01-01 10:00:00'
  },
  {
    id: 3,
    name: '重点客户',
    color: '#e6a23c',
    description: '业务量大,合作紧密',
    sortOrder: 3,
    createTime: '2025-01-01 10:00:00'
  },
  {
    id: 4,
    name: '大客户',
    color: '#f56c6c',
    description: '员工数量超过1000人',
    sortOrder: 4,
    createTime: '2025-01-01 10:00:00'
  }
];

// 预警消息模版数据
const warningTemplates = [
  {
    id: 1,
    name: '工人离职率异常预警',
    type: 'turnover_rate',
    level: 'high',
    title: '工人离职率异常预警',
    content: '【租户名称】本月工人离职率达到【离职率】%,超过预警阈值【预警阈值】%,请及时关注。',
    threshold: 10,
    description: '当工人离职率超过阈值时触发',
    status: 'active',
    createTime: '2025-01-01 10:00:00'
  },
  {
    id: 2,
    name: '投诉率异常预警',
    type: 'complaint_rate',
    level: 'medium',
    title: '投诉率异常预警',
    content: '【租户名称】本月投诉率达到【投诉率】%,超过预警阈值【预警阈值】%,需要关注服务质量。',
    threshold: 3,
    description: '当投诉率超过阈值时触发',
    status: 'active',
    createTime: '2025-01-01 10:00:00'
  },
  {
    id: 3,
    name: '系统性能预警',
    type: 'system_performance',
    level: 'high',
    title: '系统性能预警',
    content: '系统响应时间超过【响应时间】秒,影响用户体验,需要优化系统性能。',
    threshold: 3,
    description: '当系统响应时间超过阈值时触发',
    status: 'active',
    createTime: '2025-01-01 10:00:00'
  },
  {
    id: 4,
    name: '数据安全预警',
    type: 'data_security',
    level: 'urgent',
    title: '数据安全预警',
    content: '检测到异常登录行为,可能存在安全风险,需要立即处理。',
    threshold: null,
    description: '当检测到异常登录行为时触发',
    status: 'active',
    createTime: '2025-01-01 10:00:00'
  }
];

// 学历对应岗位数据
const educationJobs = [
  {
    id: 1,
    education: '不限',
    positions: ['操作工', '装配工', '包装工', '搬运工', '清洁工'],
    description: '无学历要求,适合基础岗位',
    sortOrder: 1,
    createTime: '2025-01-01 10:00:00'
  },
  {
    id: 2,
    education: '初中',
    positions: ['操作工', '装配工', '包装工', '搬运工', '质检员', '仓管员'],
    description: '初中学历,适合基础岗位和部分技术岗位',
    sortOrder: 2,
    createTime: '2025-01-01 10:00:00'
  },
  {
    id: 3,
    education: '高中/中专',
    positions: ['操作工', '装配工', '包装工', '质检员', '仓管员', '技术员', '班组长'],
    description: '高中/中专学历,适合技术岗位和管理岗位',
    sortOrder: 3,
    createTime: '2025-01-01 10:00:00'
  },
  {
    id: 4,
    education: '大专',
    positions: ['质检员', '技术员', '班组长', '主管', '工程师'],
    description: '大专学历,适合技术岗位和管理岗位',
    sortOrder: 4,
    createTime: '2025-01-01 10:00:00'
  },
  {
    id: 5,
    education: '本科',
    positions: ['工程师', '主管', '经理', '高级工程师'],
    description: '本科学历,适合高级技术岗位和管理岗位',
    sortOrder: 5,
    createTime: '2025-01-01 10:00:00'
  }
];

// 平台账号数据
const platformAccounts = [
  {
    id: 1,
    username: 'admin',
    realName: '赵管理员',
    phone: '13800138000',
    email: 'admin@bluecollar.com',
    role: 'platform_admin',
    department: '技术部',
    position: '平台管理员',
    status: 'active',
    lastLoginTime: '2026-02-25 10:30:00',
    loginCount: 1234,
    createTime: '2025-01-01 10:00:00'
  },
  {
    id: 2,
    username: 'operator1',
    realName: '钱运营',
    phone: '13800138006',
    email: 'operator1@bluecollar.com',
    role: 'platform_admin',
    department: '运营部',
    position: '运营专员',
    status: 'active',
    lastLoginTime: '2026-02-25 09:15:00',
    loginCount: 567,
    createTime: '2025-03-01 10:00:00'
  },
  {
    id: 3,
    username: 'support1',
    realName: '孙客服',
    phone: '13800138007',
    email: 'support1@bluecollar.com',
    role: 'platform_admin',
    department: '客服部',
    position: '客服专员',
    status: 'active',
    lastLoginTime: '2026-02-24 16:45:00',
    loginCount: 890,
    createTime: '2025-04-01 10:00:00'
  }
];

// ==================== 平台管理端API接口模拟 ====================

// 获取待办任务列表
Mock.mock('/api/admin/todos', 'get', () => {
  return {
    code: 200,
    message: '获取成功',
    data: adminTodos
  };
});

// 获取待办任务详情
Mock.mock(/\/api\/admin\/todos\/\d+/, 'get', (options) => {
  const id = options.url.match(/\/api\/admin\/todos\/(\d+)/)?.[1];
  const todo = adminTodos.find(t => t.id == id) || adminTodos[0];
  return {
    code: 200,
    message: '获取成功',
    data: todo
  };
});

// 获取消息列表
Mock.mock('/api/admin/messages', 'get', () => {
  return {
    code: 200,
    message: '获取成功',
    data: adminMessages
  };
});

// 获取消息详情
Mock.mock(/\/api\/admin\/messages\/\d+/, 'get', (options) => {
  const id = options.url.match(/\/api\/admin\/messages\/(\d+)/)?.[1];
  const message = adminMessages.find(m => m.id == id) || adminMessages[0];
  return {
    code: 200,
    message: '获取成功',
    data: message
  };
});

// 标记消息为已读
Mock.mock(/\/api\/admin\/messages\/\d+\/read/, 'put', () => {
  return {
    code: 200,
    message: '标记成功',
    data: null
  };
});

// 获取预警消息列表
Mock.mock('/api/admin/warnings', 'get', () => {
  return {
    code: 200,
    message: '获取成功',
    data: adminWarnings
  };
});

// 获取预警消息详情
Mock.mock(/\/api\/admin\/warnings\/\d+/, 'get', (options) => {
  const id = options.url.match(/\/api\/admin\/warnings\/(\d+)/)?.[1];
  const warning = adminWarnings.find(w => w.id == id) || adminWarnings[0];
  return {
    code: 200,
    message: '获取成功',
    data: warning
  };
});

// 处理预警消息
Mock.mock(/\/api\/admin\/warnings\/\d+\/handle/, 'put', () => {
  return {
    code: 200,
    message: '处理成功',
    data: null
  };
});

// 获取套餐列表
Mock.mock('/api/admin/packages', 'get', (options) => {
  const { type } = options.url.match(/\?type=(\w+)/)?.[1] || '';
  let filteredPackages = packages;
  if (type) {
    filteredPackages = packages.filter(p => p.type === type);
  }
  return {
    code: 200,
    message: '获取成功',
    data: filteredPackages
  };
});

// 套餐管理Mock数据 - 新的套餐信息模块
const packageInfoList = [
  {
    id: '1',
    packageName: '劳务公司基础版',
    packageDescription: '适合小型劳务公司的基础套餐,包含核心功能,满足日常招聘、工人管理需求。',
    tenantType: 'labor_company',
    amount: 1999,
    expiryFrequency: 'monthly',
    employeeAccountCount: 10,
    backgroundCheckWorkerCount: 500,
    status: 'enabled',
    createdAt: '2026-01-01 10:00:00',
    updatedAt: '2026-01-01 10:00:00',
    createdBy: 'admin',
    updatedBy: 'admin'
  },
  {
    id: '2',
    packageName: '劳务公司高级版',
    packageDescription: '适合中型劳务公司的高级套餐,功能更全面,支持更多员工和工人管理。',
    tenantType: 'labor_company',
    amount: 3999,
    expiryFrequency: 'monthly',
    employeeAccountCount: 30,
    backgroundCheckWorkerCount: 2000,
    status: 'enabled',
    createdAt: '2026-01-01 10:00:00',
    updatedAt: '2026-01-01 10:00:00',
    createdBy: 'admin',
    updatedBy: 'admin'
  },
  {
    id: '3',
    packageName: '劳务公司企业版',
    packageDescription: '适合大型劳务公司的企业套餐,支持定制化服务,提供专属客服支持。',
    tenantType: 'labor_company',
    amount: 7999,
    expiryFrequency: 'monthly',
    employeeAccountCount: 100,
    backgroundCheckWorkerCount: 10000,
    status: 'enabled',
    createdAt: '2026-01-01 10:00:00',
    updatedAt: '2026-01-01 10:00:00',
    createdBy: 'admin',
    updatedBy: 'admin'
  },
  {
    id: '4',
    packageName: '工厂标准版',
    packageDescription: '适合小型工厂的标准套餐,包含核心功能,满足日常招聘和工人管理需求。',
    tenantType: 'factory',
    amount: 2999,
    expiryFrequency: 'monthly',
    employeeAccountCount: 20,
    backgroundCheckWorkerCount: 1000,
    status: 'enabled',
    createdAt: '2026-01-01 10:00:00',
    updatedAt: '2026-01-01 10:00:00',
    createdBy: 'admin',
    updatedBy: 'admin'
  },
  {
    id: '5',
    packageName: '工厂企业版',
    packageDescription: '适合中型工厂的企业套餐,功能更全面,支持更多员工和工人管理。',
    tenantType: 'factory',
    amount: 5999,
    expiryFrequency: 'monthly',
    employeeAccountCount: 50,
    backgroundCheckWorkerCount: 5000,
    status: 'enabled',
    createdAt: '2026-01-01 10:00:00',
    updatedAt: '2026-01-01 10:00:00',
    createdBy: 'admin',
    updatedBy: 'admin'
  },
  {
    id: '6',
    packageName: '劳务公司年度版',
    packageDescription: '劳务公司年度套餐,按年计费更优惠,适合长期合作的劳务公司。',
    tenantType: 'labor_company',
    amount: 39999,
    expiryFrequency: 'yearly',
    employeeAccountCount: 30,
    backgroundCheckWorkerCount: 2000,
    status: 'disabled',
    createdAt: '2026-01-01 10:00:00',
    updatedAt: '2026-01-01 10:00:00',
    createdBy: 'admin',
    updatedBy: 'admin'
  }
];

// 获取套餐信息列表 - 新接口
Mock.mock('/system/packages', 'get', (options) => {
  const url = new URL(options.url, 'http://localhost');
  const page = parseInt(url.searchParams.get('page') || '1');
  const pageSize = parseInt(url.searchParams.get('pageSize') || '10');
  const packageName = url.searchParams.get('packageName') || '';
  const tenantType = url.searchParams.get('tenantType') || '';
  const status = url.searchParams.get('status') || '';

  let filteredPackages = [...packageInfoList];

  if (packageName) {
    filteredPackages = filteredPackages.filter(p =>
      p.packageName.includes(packageName)
    );
  }

  if (tenantType) {
    filteredPackages = filteredPackages.filter(p => p.tenantType === tenantType);
  }

  if (status) {
    filteredPackages = filteredPackages.filter(p => p.status === status);
  }

  const total = filteredPackages.length;
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const list = filteredPackages.slice(start, end);

  return {
    code: 200,
    message: '获取成功',
    data: {
      list,
      total,
      page,
      pageSize
    }
  };
});

// 获取套餐详情 - 新接口
Mock.mock(/\/system\/packages\/\w+/, 'get', (options) => {
  const id = options.url.match(/\/system\/packages\/(\w+)/)?.[1];
  const pkg = packageInfoList.find(p => p.id === id);
  if (pkg) {
    return {
      code: 200,
      message: '获取成功',
      data: {
        ...pkg,
        tenantTypeName: pkg.tenantType === 'labor_company' ? '劳务公司' : '工厂',
        expiryFrequencyName: pkg.expiryFrequency === 'monthly' ? '月度' :
          pkg.expiryFrequency === 'quarterly' ? '季度' : '年度'
      }
    };
  }
  return {
    code: 404,
    message: '套餐不存在',
    data: null
  };
});

// 创建套餐 - 新接口
Mock.mock('/system/packages', 'post', (options) => {
  const body = JSON.parse(options.body);
  const newPackage = {
    id: String(Date.now()),
    ...body,
    createdAt: new Date().toLocaleString('zh-CN'),
    updatedAt: new Date().toLocaleString('zh-CN'),
    createdBy: 'admin',
    updatedBy: 'admin'
  };
  packageInfoList.unshift(newPackage);
  return {
    code: 200,
    message: '创建成功',
    data: newPackage
  };
});

// 更新套餐 - 新接口
Mock.mock(/\/system\/packages\/\w+/, 'put', (options) => {
  const id = options.url.match(/\/system\/packages\/(\w+)/)?.[1];
  const body = JSON.parse(options.body);
  const index = packageInfoList.findIndex(p => p.id === id);
  if (index !== -1) {
    packageInfoList[index] = {
      ...packageInfoList[index],
      ...body,
      updatedAt: new Date().toLocaleString('zh-CN'),
      updatedBy: 'admin'
    };
    return {
      code: 200,
      message: '更新成功',
      data: packageInfoList[index]
    };
  }
  return {
    code: 404,
    message: '套餐不存在',
    data: null
  };
});

// 删除套餐 - 新接口
Mock.mock(/\/system\/packages\/\w+/, 'delete', (options) => {
  const id = options.url.match(/\/system\/packages\/\w+)/)?.[1];
  const index = packageInfoList.findIndex(p => p.id === id);
  if (index !== -1) {
    packageInfoList.splice(index, 1);
    return {
      code: 200,
      message: '删除成功',
      data: null
    };
  }
  return {
    code: 404,
    message: '套餐不存在',
    data: null
  };
});

// 批量删除套餐 - 新接口
Mock.mock('/system/packages/batch', 'delete', (options) => {
  const body = JSON.parse(options.body);
  const { ids } = body;
  ids.forEach((id) => {
    const index = packageInfoList.findIndex(p => p.id === id);
    if (index !== -1) {
      packageInfoList.splice(index, 1);
    }
  });
  return {
    code: 200,
    message: '批量删除成功',
    data: null
  };
});

// 导出套餐列表 - 新接口
Mock.mock('/system/packages/export', 'get', () => {
  return {
    code: 200,
    message: '导出成功',
    data: new Blob(['mock data'], { type: 'application/vnd.ms-excel' })
  };
});

// 启用套餐 - 新接口
Mock.mock(/\/system\/packages\/\w+\/enable/, 'put', (options) => {
  const id = options.url.match(/\/system\/packages\/(\w+)\/enable/)?.[1];
  const index = packageInfoList.findIndex(p => p.id === id);
  if (index !== -1) {
    packageInfoList[index].status = 'enabled';
    packageInfoList[index].updatedAt = new Date().toLocaleString('zh-CN');
    return {
      code: 200,
      message: '启用成功',
      data: packageInfoList[index]
    };
  }
  return {
    code: 404,
    message: '套餐不存在',
    data: null
  };
});

// 禁用套餐 - 新接口
Mock.mock(/\/system\/packages\/\w+\/disable/, 'put', (options) => {
  const id = options.url.match(/\/system\/packages\/(\w+)\/disable/)?.[1];
  const index = packageInfoList.findIndex(p => p.id === id);
  if (index !== -1) {
    packageInfoList[index].status = 'disabled';
    packageInfoList[index].updatedAt = new Date().toLocaleString('zh-CN');
    return {
      code: 200,
      message: '禁用成功',
      data: packageInfoList[index]
    };
  }
  return {
    code: 404,
    message: '套餐不存在',
    data: null
  };
});

// 检查套餐名称是否重复 - 新接口
Mock.mock('/system/packages/check-name', 'get', (options) => {
  const url = new URL(options.url, 'http://localhost');
  const packageName = url.searchParams.get('packageName') || '';
  const id = url.searchParams.get('id') || '';

  const exists = packageInfoList.some(p =>
    p.packageName === packageName && p.id !== id
  );

  return {
    code: 200,
    message: '检查成功',
    data: exists
  };
});

// 获取套餐详情
Mock.mock(/\/api\/admin\/packages\/\d+/, 'get', (options) => {
  const id = options.url.match(/\/api\/admin\/packages\/(\d+)/)?.[1];
  const pkg = packages.find(p => p.id == id) || packages[0];
  return {
    code: 200,
    message: '获取成功',
    data: pkg
  };
});

// 创建套餐
Mock.mock('/api/admin/packages', 'post', () => {
  return {
    code: 200,
    message: '创建成功',
    data: { id: Date.now() }
  };
});

// 更新套餐
Mock.mock(/\/api\/admin\/packages\/\d+/, 'put', () => {
  return {
    code: 200,
    message: '更新成功',
    data: null
  };
});

// 删除套餐
Mock.mock(/\/api\/admin\/packages\/\d+/, 'delete', () => {
  return {
    code: 200,
    message: '删除成功',
    data: null
  };
});

// ==================== 租户管理Mock数据 ====================

// 租户数据
const tenantInfoList = [
  {
    id: 1,
    tenantName: '南通富民劳务服务有限公司',
    creditCode: '91320600MA1X4Y9H5P',
    businessLicense: 'https://via.placeholder.com/300x400?text=营业执照',
    adminName: '张三',
    adminPhone: '13800138001',
    contactName: '李四',
    contactPhone: '13900139001',
    packageId: '1',
    packageName: '基础套餐',
    tenantType: 'labor_company',
    status: 'enabled',
    createdAt: '2026-01-01 10:00:00',
    updatedAt: '2026-01-01 10:00:00',
    createdBy: 'admin',
    updatedBy: 'admin'
  },
  {
    id: 2,
    tenantName: '富士康科技集团',
    creditCode: '91340300MA1X4Y9H6Q',
    businessLicense: 'https://via.placeholder.com/300x400?text=营业执照',
    adminName: '王五',
    adminPhone: '13800138002',
    contactName: '赵六',
    contactPhone: '13900139002',
    packageId: '2',
    packageName: '标准套餐',
    tenantType: 'factory',
    status: 'enabled',
    createdAt: '2026-01-02 10:00:00',
    updatedAt: '2026-01-02 10:00:00',
    createdBy: 'admin',
    updatedBy: 'admin'
  },
  {
    id: 3,
    tenantName: '苏州华辉劳务派遣有限公司',
    creditCode: '91320500MA1X4Y9H7R',
    businessLicense: 'https://via.placeholder.com/300x400?text=营业执照',
    adminName: '孙七',
    adminPhone: '13800138003',
    contactName: '周八',
    contactPhone: '13900139003',
    packageId: '3',
    packageName: '高级套餐',
    tenantType: 'labor_company',
    status: 'enabled',
    createdAt: '2026-01-03 10:00:00',
    updatedAt: '2026-01-03 10:00:00',
    createdBy: 'admin',
    updatedBy: 'admin'
  },
  {
    id: 4,
    tenantName: '比亚迪股份有限公司',
    creditCode: '91440300MA1X4Y9H8S',
    businessLicense: 'https://via.placeholder.com/300x400?text=营业执照',
    adminName: '吴九',
    adminPhone: '13800138004',
    contactName: '郑十',
    contactPhone: '13900139004',
    packageId: '4',
    packageName: '企业套餐',
    tenantType: 'factory',
    status: 'disabled',
    createdAt: '2026-01-04 10:00:00',
    updatedAt: '2026-01-04 10:00:00',
    createdBy: 'admin',
    updatedBy: 'admin'
  },
  {
    id: 5,
    tenantName: '上海众诚人力资源有限公司',
    creditCode: '91310100MA1X4Y9H9T',
    businessLicense: 'https://via.placeholder.com/300x400?text=营业执照',
    adminName: '冯十一',
    adminPhone: '13800138005',
    contactName: '陈十二',
    contactPhone: '13900139005',
    packageId: '5',
    packageName: '旗舰套餐',
    tenantType: 'labor_company',
    status: 'enabled',
    createdAt: '2026-01-05 10:00:00',
    updatedAt: '2026-01-05 10:00:00',
    createdBy: 'admin',
    updatedBy: 'admin'
  }
];

// 获取租户列表
Mock.mock('/system/tenants', 'get', (options) => {
  const url = new URL(options.url, 'http://localhost');
  const page = parseInt(url.searchParams.get('page') || '1');
  const pageSize = parseInt(url.searchParams.get('pageSize') || '10');
  const keyword = url.searchParams.get('keyword') || '';
  const packageId = url.searchParams.get('packageId') || '';
  const status = url.searchParams.get('status') || '';
  const tenantType = url.searchParams.get('tenantType') || '';

  let filteredTenants = [...tenantInfoList];

  if (keyword) {
    filteredTenants = filteredTenants.filter(t =>
      t.tenantName.includes(keyword) ||
      t.creditCode.includes(keyword) ||
      t.adminPhone.includes(keyword) ||
      t.contactPhone.includes(keyword)
    );
  }

  if (packageId) {
    filteredTenants = filteredTenants.filter(t => t.packageId === packageId);
  }

  if (status) {
    filteredTenants = filteredTenants.filter(t => t.status === status);
  }

  if (tenantType) {
    filteredTenants = filteredTenants.filter(t => t.tenantType === tenantType);
  }

  const total = filteredTenants.length;
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const list = filteredTenants.slice(start, end);

  return {
    code: 200,
    message: '获取成功',
    data: {
      list,
      total,
      page,
      pageSize
    },
    timestamp: Date.now()
  };
});

// 获取租户详情
Mock.mock(/\/system\/tenants\/\d+/, 'get', (options) => {
  const id = options.url.match(/\/system\/tenants\/(\d+)/)?.[1];
  const tenant = tenantInfoList.find(t => t.id == id) || tenantInfoList[0];
  return {
    code: 200,
    message: '获取成功',
    data: tenant,
    timestamp: Date.now()
  };
});

// 创建租户
Mock.mock('/system/tenants', 'post', (options) => {
  const body = JSON.parse(options.body);
  const newTenant = {
    id: tenantInfoList.length + 1,
    ...body,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: 'admin',
    updatedBy: 'admin'
  };
  tenantInfoList.unshift(newTenant);
  return {
    code: 201,
    message: '创建成功',
    data: newTenant,
    timestamp: Date.now()
  };
});

// 更新租户
Mock.mock(/\/system\/tenants\/\d+/, 'put', (options) => {
  const id = options.url.match(/\/system\/tenants\/(\d+)/)?.[1];
  const body = JSON.parse(options.body);
  const index = tenantInfoList.findIndex(t => t.id == id);
  if (index !== -1) {
    tenantInfoList[index] = {
      ...tenantInfoList[index],
      ...body,
      updatedAt: new Date().toISOString(),
      updatedBy: 'admin'
    };
    return {
      code: 200,
      message: '更新成功',
      data: tenantInfoList[index],
      timestamp: Date.now()
    };
  }
  return {
    code: 404,
    message: '租户不存在',
    data: null,
    timestamp: Date.now()
  };
});

// 删除租户
Mock.mock(/\/system\/tenants\/\d+/, 'delete', (options) => {
  const id = options.url.match(/\/system\/tenants\/(\d+)/)?.[1];
  const index = tenantInfoList.findIndex(t => t.id == id);
  if (index !== -1) {
    tenantInfoList.splice(index, 1);
    return {
      code: 200,
      message: '删除成功',
      data: null,
      timestamp: Date.now()
    };
  }
  return {
    code: 404,
    message: '租户不存在',
    data: null,
    timestamp: Date.now()
  };
});

// 批量删除租户
Mock.mock('/system/tenants/batch', 'delete', (options) => {
  const body = JSON.parse(options.body);
  const { ids } = body;
  ids.forEach(id => {
    const index = tenantInfoList.findIndex(t => t.id == id);
    if (index !== -1) {
      tenantInfoList.splice(index, 1);
    }
  });
  return {
    code: 200,
    message: '批量删除成功',
    data: null,
    timestamp: Date.now()
  };
});

// 导出租户列表
Mock.mock('/system/tenants/export', 'get', () => {
  return {
    code: 200,
    message: '导出成功',
    data: new Blob(['模拟Excel文件内容'], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }),
    timestamp: Date.now()
  };
});

// 启用租户
Mock.mock(/\/system\/tenants\/\d+\/enable/, 'put', (options) => {
  const id = options.url.match(/\/system\/tenants\/(\d+)\/enable/)?.[1];
  const index = tenantInfoList.findIndex(t => t.id == id);
  if (index !== -1) {
    tenantInfoList[index].status = 'enabled';
    tenantInfoList[index].updatedAt = new Date().toISOString();
    return {
      code: 200,
      message: '启用成功',
      data: tenantInfoList[index],
      timestamp: Date.now()
    };
  }
  return {
    code: 404,
    message: '租户不存在',
    data: null,
    timestamp: Date.now()
  };
});

// 禁用租户
Mock.mock(/\/system\/tenants\/\d+\/disable/, 'put', (options) => {
  const id = options.url.match(/\/system\/tenants\/(\d+)\/disable/)?.[1];
  const index = tenantInfoList.findIndex(t => t.id == id);
  if (index !== -1) {
    tenantInfoList[index].status = 'disabled';
    tenantInfoList[index].updatedAt = new Date().toISOString();
    return {
      code: 200,
      message: '禁用成功',
      data: tenantInfoList[index],
      timestamp: Date.now()
    };
  }
  return {
    code: 404,
    message: '租户不存在',
    data: null,
    timestamp: Date.now()
  };
});

// 检查租户名称是否重复
Mock.mock('/system/tenants/check-name', 'get', (options) => {
  const url = new URL(options.url, 'http://localhost');
  const tenantName = url.searchParams.get('tenantName') || '';
  const id = url.searchParams.get('id') || '';
  const exists = tenantInfoList.some(t =>
    t.tenantName === tenantName && t.id !== parseInt(id)
  );
  return {
    code: 200,
    message: '检查成功',
    data: !exists,
    timestamp: Date.now()
  };
});

// 检查统一社会信用代码是否重复
Mock.mock('/system/tenants/check-credit-code', 'get', (options) => {
  const url = new URL(options.url, 'http://localhost');
  const creditCode = url.searchParams.get('creditCode') || '';
  const id = url.searchParams.get('id') || '';
  const exists = tenantInfoList.some(t =>
    t.creditCode === creditCode && t.id !== parseInt(id)
  );
  return {
    code: 200,
    message: '检查成功',
    data: !exists,
    timestamp: Date.now()
  };
});

// 获取套餐下拉选项
Mock.mock('/system/packages/options', 'get', () => {
  const options = [
    { label: '基础套餐', value: '1' },
    { label: '标准套餐', value: '2' },
    { label: '高级套餐', value: '3' },
    { label: '企业套餐', value: '4' },
    { label: '旗舰套餐', value: '5' }
  ];
  return {
    code: 200,
    message: '获取成功',
    data: options,
    timestamp: Date.now()
  };
});

// 获取租户列表
Mock.mock('/api/admin/tenants', 'get', (options) => {
  const { type, status } = options.url.match(/\?type=(\w+)&status=(\w+)/)?.slice(1) || [];
  let filteredTenants = tenants;
  if (type) {
    filteredTenants = filteredTenants.filter(t => t.type === type);
  }
  if (status) {
    filteredTenants = filteredTenants.filter(t => t.status === status);
  }
  return {
    code: 200,
    message: '获取成功',
    data: filteredTenants
  };
});

// 获取租户详情
Mock.mock(/\/api\/admin\/tenants\/\d+/, 'get', (options) => {
  const id = options.url.match(/\/api\/admin\/tenants\/(\d+)/)?.[1];
  const tenant = tenants.find(t => t.id == id) || tenants[0];
  return {
    code: 200,
    message: '获取成功',
    data: tenant
  };
});

// 审核租户
Mock.mock(/\/api\/admin\/tenants\/\d+\/audit/, 'put', () => {
  return {
    code: 200,
    message: '审核成功',
    data: null
  };
});

// 获取招聘需求列表
Mock.mock('/api/admin/recruitment/demands', 'get', () => {
  return {
    code: 200,
    message: '获取成功',
    data: recruitmentDemands
  };
});

// 获取招聘需求详情
Mock.mock(/\/api\/admin\/recruitment\/demands\/\d+/, 'get', (options) => {
  const id = options.url.match(/\/api\/admin\/recruitment\/demands\/(\d+)/)?.[1];
  const demand = recruitmentDemands.find(d => d.id == id) || recruitmentDemands[0];
  return {
    code: 200,
    message: '获取成功',
    data: demand
  };
});

// 获取简历列表
Mock.mock('/api/admin/recruitment/resumes', 'get', () => {
  return {
    code: 200,
    message: '获取成功',
    data: resumes
  };
});

// 获取简历详情
Mock.mock(/\/api\/admin\/recruitment\/resumes\/\d+/, 'get', (options) => {
  const id = options.url.match(/\/api\/admin\/recruitment\/resumes\/(\d+)/)?.[1];
  const resume = resumes.find(r => r.id == id) || resumes[0];
  return {
    code: 200,
    message: '获取成功',
    data: resume
  };
});

// 获取转介绍列表
Mock.mock('/api/admin/settlement/referrals', 'get', () => {
  return {
    code: 200,
    message: '获取成功',
    data: referrals
  };
});

// 获取转介绍详情
Mock.mock(/\/api\/admin\/settlement\/referrals\/\d+/, 'get', (options) => {
  const id = options.url.match(/\/api\/admin\/settlement\/referrals\/(\d+)/)?.[1];
  const referral = referrals.find(r => r.id == id) || referrals[0];
  return {
    code: 200,
    message: '获取成功',
    data: referral
  };
});

// 获取佣金发放列表
Mock.mock('/api/admin/settlement/commissions', 'get', () => {
  return {
    code: 200,
    message: '获取成功',
    data: commissionRecords
  };
});

// 获取拉新奖励列表
Mock.mock('/api/admin/settlement/pull-new-rewards', 'get', () => {
  return {
    code: 200,
    message: '获取成功',
    data: pullNewRewards
  };
});

// 获取费用查询列表
Mock.mock('/api/admin/operation/expense-query', 'get', () => {
  return {
    code: 200,
    message: '获取成功',
    data: expenses
  };
});

// 获取活动列表
Mock.mock('/api/admin/operation/activity', 'get', () => {
  return {
    code: 200,
    message: '获取成功',
    data: activities
  };
});

// 获取活动详情
Mock.mock(/\/api\/admin\/operation\/activity\/\d+/, 'get', (options) => {
  const id = options.url.match(/\/api\/admin\/operation\/activity\/(\d+)/)?.[1];
  const activity = activities.find(a => a.id == id) || activities[0];
  return {
    code: 200,
    message: '获取成功',
    data: activity
  };
});

// 获取报名记录列表
Mock.mock('/api/admin/operation/activity-registration', 'get', () => {
  return {
    code: 200,
    message: '获取成功',
    data: registrations
  };
});

// 获取报名记录详情
Mock.mock(/\/api\/admin\/operation\/activity-registration\/\d+/, 'get', (options) => {
  const id = options.url.match(/\/api\/admin\/operation\/activity-registration\/(\d+)/)?.[1];
  const registration = registrations.find(r => r.id == id) || registrations[0];
  return {
    code: 200,
    message: '获取成功',
    data: registration
  };
});

// 审核报名记录
Mock.mock(/\/api\/admin\/operation\/activity-registration\/\d+\/audit/, 'put', () => {
  return {
    code: 200,
    message: '审核成功',
    data: null
  };
});

// 获取注册用户列表
Mock.mock('/api/admin/users', 'get', (options) => {
  const { role, status } = options.url.match(/\?role=(\w+)&status=(\w+)/)?.slice(1) || [];
  let filteredUsers = registeredUsers;
  if (role) {
    filteredUsers = filteredUsers.filter(u => u.role === role);
  }
  if (status) {
    filteredUsers = filteredUsers.filter(u => u.status === status);
  }
  return {
    code: 200,
    message: '获取成功',
    data: filteredUsers
  };
});

// 获取用户详情
Mock.mock(/\/api\/admin\/users\/\d+/, 'get', (options) => {
  const id = options.url.match(/\/api\/admin\/users\/(\d+)/)?.[1];
  const user = registeredUsers.find(u => u.id == id) || registeredUsers[0];
  return {
    code: 200,
    message: '获取成功',
    data: user
  };
});

// 获取租户标签列表
Mock.mock('/api/admin/system/tenant-tag', 'get', () => {
  return {
    code: 200,
    message: '获取成功',
    data: tenantTags
  };
});

// 创建租户标签
Mock.mock('/api/admin/system/tenant-tag', 'post', () => {
  return {
    code: 200,
    message: '创建成功',
    data: { id: Date.now() }
  };
});

// 更新租户标签
Mock.mock(/\/api\/admin\/system\/tenant-tag\/\d+/, 'put', () => {
  return {
    code: 200,
    message: '更新成功',
    data: null
  };
});

// 删除租户标签
Mock.mock(/\/api\/admin\/system\/tenant-tag\/\d+/, 'delete', () => {
  return {
    code: 200,
    message: '删除成功',
    data: null
  };
});

// 获取预警消息模版列表
Mock.mock('/api/admin/system/warning-template', 'get', () => {
  return {
    code: 200,
    message: '获取成功',
    data: warningTemplates
  };
});

// 创建预警消息模版
Mock.mock('/api/admin/system/warning-template', 'post', () => {
  return {
    code: 200,
    message: '创建成功',
    data: { id: Date.now() }
  };
});

// 更新预警消息模版
Mock.mock(/\/api\/admin\/system\/warning-template\/\d+/, 'put', () => {
  return {
    code: 200,
    message: '更新成功',
    data: null
  };
});

// 删除预警消息模版
Mock.mock(/\/api\/admin\/system\/warning-template\/\d+/, 'delete', () => {
  return {
    code: 200,
    message: '删除成功',
    data: null
  };
});

// 获取学历对应岗位列表
Mock.mock('/api/admin/system/education-job', 'get', () => {
  return {
    code: 200,
    message: '获取成功',
    data: educationJobs
  };
});

// 创建学历对应岗位
Mock.mock('/api/admin/system/education-job', 'post', () => {
  return {
    code: 200,
    message: '创建成功',
    data: { id: Date.now() }
  };
});

// 更新学历对应岗位
Mock.mock(/\/api\/admin\/system\/education-job\/\d+/, 'put', () => {
  return {
    code: 200,
    message: '更新成功',
    data: null
  };
});

// 删除学历对应岗位
Mock.mock(/\/api\/admin\/system\/education-job\/\d+/, 'delete', () => {
  return {
    code: 200,
    message: '删除成功',
    data: null
  };
});

// 获取平台账号列表
Mock.mock('/api/admin/system/platform-account', 'get', () => {
  return {
    code: 200,
    message: '获取成功',
    data: platformAccounts
  };
});

// 创建平台账号
Mock.mock('/api/admin/system/platform-account', 'post', () => {
  return {
    code: 200,
    message: '创建成功',
    data: { id: Date.now() }
  };
});

// 更新平台账号
Mock.mock(/\/api\/admin\/system\/platform-account\/\d+/, 'put', () => {
  return {
    code: 200,
    message: '更新成功',
    data: null
  };
});

// 删除平台账号
Mock.mock(/\/api\/admin\/system\/platform-account\/\d+/, 'delete', () => {
  return {
    code: 200,
    message: '删除成功',
    data: null
  };
});

// ==================== 字典管理Mock数据 ====================

// 字典数据
const dictionaries = [
  {
    id: 1,
    name: '性别',
    type: 'system',
    code: 'gender',
    values: [
      { id: 1, value: '1', label: '男', sort: 1, status: 'enabled', remark: '男性', createdAt: '2026-01-01 10:00:00' },
      { id: 2, value: '2', label: '女', sort: 2, status: 'enabled', remark: '女性', createdAt: '2026-01-01 10:00:00' }
    ],
    description: '性别字典',
    creatorId: '4',
    creatorName: '赵管理员',
    departmentId: '1',
    departmentName: '技术部',
    createdAt: '2026-01-01 10:00:00',
    updatedAt: '2026-01-01 10:00:00'
  },
  {
    id: 2,
    name: '学历',
    type: 'system',
    code: 'education',
    values: [
      { id: 3, value: '1', label: '初中', sort: 1, status: 'enabled', remark: '初中学历', createdAt: '2026-01-01 10:00:00' },
      { id: 4, value: '2', label: '高中/中专', sort: 2, status: 'enabled', remark: '高中或中专学历', createdAt: '2026-01-01 10:00:00' },
      { id: 5, value: '3', label: '大专', sort: 3, status: 'enabled', remark: '大专学历', createdAt: '2026-01-01 10:00:00' },
      { id: 6, value: '4', label: '本科', sort: 4, status: 'enabled', remark: '本科学历', createdAt: '2026-01-01 10:00:00' },
      { id: 7, value: '5', label: '硕士', sort: 5, status: 'enabled', remark: '硕士学历', createdAt: '2026-01-01 10:00:00' },
      { id: 8, value: '6', label: '博士', sort: 6, status: 'enabled', remark: '博士学历', createdAt: '2026-01-01 10:00:00' }
    ],
    description: '学历字典',
    creatorId: '4',
    creatorName: '赵管理员',
    departmentId: '1',
    departmentName: '技术部',
    createdAt: '2026-01-01 10:00:00',
    updatedAt: '2026-01-01 10:00:00'
  },
  {
    id: 3,
    name: '岗位类别',
    type: 'business',
    code: 'position_category',
    values: [
      { id: 9, value: '1', label: '普工', sort: 1, status: 'enabled', remark: '普通工人', createdAt: '2026-01-01 10:00:00' },
      { id: 10, value: '2', label: '技工', sort: 2, status: 'enabled', remark: '技术工人', createdAt: '2026-01-01 10:00:00' },
      { id: 11, value: '3', label: '干部', sort: 3, status: 'enabled', remark: '管理人员', createdAt: '2026-01-01 10:00:00' }
    ],
    description: '岗位类别字典',
    creatorId: '4',
    creatorName: '赵管理员',
    departmentId: '1',
    departmentName: '技术部',
    createdAt: '2026-01-01 10:00:00',
    updatedAt: '2026-01-01 10:00:00'
  },
  {
    id: 4,
    name: '结算方式',
    type: 'business',
    code: 'settlement_type',
    values: [
      { id: 12, value: '1', label: '日结', sort: 1, status: 'enabled', remark: '按日结算', createdAt: '2026-01-01 10:00:00' },
      { id: 13, value: '2', label: '月结', sort: 2, status: 'enabled', remark: '按月结算', createdAt: '2026-01-01 10:00:00' }
    ],
    description: '结算方式字典',
    creatorId: '4',
    creatorName: '赵管理员',
    departmentId: '1',
    departmentName: '技术部',
    createdAt: '2026-01-01 10:00:00',
    updatedAt: '2026-01-01 10:00:00'
  },
  {
    id: 5,
    name: '请假类型',
    type: 'business',
    code: 'leave_type',
    values: [
      { id: 14, value: '1', label: '事假', sort: 1, status: 'enabled', remark: '事假', createdAt: '2026-01-01 10:00:00' },
      { id: 15, value: '2', label: '病假', sort: 2, status: 'enabled', remark: '病假', createdAt: '2026-01-01 10:00:00' },
      { id: 16, value: '3', label: '年假', sort: 3, status: 'enabled', remark: '年假', createdAt: '2026-01-01 10:00:00' },
      { id: 17, value: '4', label: '婚假', sort: 4, status: 'enabled', remark: '婚假', createdAt: '2026-01-01 10:00:00' },
      { id: 18, value: '5', label: '丧假', sort: 5, status: 'enabled', remark: '丧假', createdAt: '2026-01-01 10:00:00' },
      { id: 19, value: '6', label: '其他', sort: 6, status: 'enabled', remark: '其他', createdAt: '2026-01-01 10:00:00' }
    ],
    description: '请假类型字典',
    creatorId: '4',
    creatorName: '赵管理员',
    departmentId: '1',
    departmentName: '技术部',
    createdAt: '2026-01-01 10:00:00',
    updatedAt: '2026-01-01 10:00:00'
  },
  {
    id: 6,
    name: '合同状态',
    type: 'business',
    code: 'contract_status',
    values: [
      { id: 20, value: '1', label: '未签订', sort: 1, status: 'enabled', remark: '未签订', createdAt: '2026-01-01 10:00:00' },
      { id: 21, value: '2', label: '签订中', sort: 2, status: 'enabled', remark: '签订中', createdAt: '2026-01-01 10:00:00' },
      { id: 22, value: '3', label: '已签订', sort: 3, status: 'enabled', remark: '已签订', createdAt: '2026-01-01 10:00:00' },
      { id: 23, value: '4', label: '已取消', sort: 4, status: 'enabled', remark: '已取消', createdAt: '2026-01-01 10:00:00' }
    ],
    description: '合同状态字典',
    creatorId: '4',
    creatorName: '赵管理员',
    departmentId: '1',
    departmentName: '技术部',
    createdAt: '2026-01-01 10:00:00',
    updatedAt: '2026-01-01 10:00:00'
  },
  {
    id: 7,
    name: '推荐等级',
    type: 'business',
    code: 'recommend_level',
    values: [
      { id: 24, value: '1', label: '优先推荐', sort: 1, status: 'enabled', remark: '优先推荐', createdAt: '2026-01-01 10:00:00' },
      { id: 25, value: '2', label: '一般', sort: 2, status: 'enabled', remark: '一般', createdAt: '2026-01-01 10:00:00' },
      { id: 26, value: '3', label: '不建议', sort: 3, status: 'enabled', remark: '不建议', createdAt: '2026-01-01 10:00:00' }
    ],
    description: '推荐等级字典',
    creatorId: '4',
    creatorName: '赵管理员',
    departmentId: '1',
    departmentName: '技术部',
    createdAt: '2026-01-01 10:00:00',
    updatedAt: '2026-01-01 10:00:00'
  },
  {
    id: 8,
    name: '形象级别',
    type: 'business',
    code: 'image_level',
    values: [
      { id: 27, value: '1', label: '优秀', sort: 1, status: 'enabled', remark: '优秀', createdAt: '2026-01-01 10:00:00' },
      { id: 28, value: '2', label: '一般', sort: 2, status: 'enabled', remark: '一般', createdAt: '2026-01-01 10:00:00' },
      { id: 29, value: '3', label: '其他', sort: 3, status: 'enabled', remark: '其他', createdAt: '2026-01-01 10:00:00' }
    ],
    description: '形象级别字典',
    creatorId: '4',
    creatorName: '赵管理员',
    departmentId: '1',
    departmentName: '技术部',
    createdAt: '2026-01-01 10:00:00',
    updatedAt: '2026-01-01 10:00:00'
  },
  {
    id: 9,
    name: '活动类型',
    type: 'business',
    code: 'activity_type',
    values: [
      { id: 30, value: '1', label: '文体活动', sort: 1, status: 'enabled', remark: '文体活动', createdAt: '2026-01-01 10:00:00' },
      { id: 31, value: '2', label: '相亲活动', sort: 2, status: 'enabled', remark: '相亲活动', createdAt: '2026-01-01 10:00:00' },
      { id: 32, value: '3', label: '技能提升', sort: 3, status: 'enabled', remark: '技能提升', createdAt: '2026-01-01 10:00:00' },
      { id: 33, value: '4', label: '社团活动', sort: 4, status: 'enabled', remark: '社团活动', createdAt: '2026-01-01 10:00:00' },
      { id: 34, value: '5', label: '其他活动', sort: 5, status: 'enabled', remark: '其他活动', createdAt: '2026-01-01 10:00:00' }
    ],
    description: '活动类型字典',
    creatorId: '4',
    creatorName: '赵管理员',
    departmentId: '1',
    departmentName: '技术部',
    createdAt: '2026-01-01 10:00:00',
    updatedAt: '2026-01-01 10:00:00'
  },
  {
    id: 10,
    name: '社团类型',
    type: 'business',
    code: 'club_type',
    values: [
      { id: 35, value: '1', label: '体育类', sort: 1, status: 'enabled', remark: '体育类社团', createdAt: '2026-01-01 10:00:00' },
      { id: 36, value: '2', label: '文化类', sort: 2, status: 'enabled', remark: '文化类社团', createdAt: '2026-01-01 10:00:00' },
      { id: 37, value: '3', label: '兴趣类', sort: 3, status: 'enabled', remark: '兴趣类社团', createdAt: '2026-01-01 10:00:00' }
    ],
    description: '社团类型字典',
    creatorId: '4',
    creatorName: '赵管理员',
    departmentId: '1',
    departmentName: '技术部',
    createdAt: '2026-01-01 10:00:00',
    updatedAt: '2026-01-01 10:00:00'
  }
];

// 字典操作日志
const dictionaryOperationLogs = [
  {
    id: 1,
    dictionaryId: 1,
    dictionaryName: '性别',
    operationType: 'create',
    operationContent: '创建字典：性别',
    operatorId: '4',
    operatorName: '赵管理员',
    operationTime: '2026-01-01 10:00:00',
    ipAddress: '192.168.1.100'
  },
  {
    id: 2,
    dictionaryId: 2,
    dictionaryName: '学历',
    operationType: 'create',
    operationContent: '创建字典：学历',
    operatorId: '4',
    operatorName: '赵管理员',
    operationTime: '2026-01-01 10:00:00',
    ipAddress: '192.168.1.100'
  },
  {
    id: 3,
    dictionaryId: 1,
    dictionaryName: '性别',
    operationType: 'update',
    operationContent: '更新字典：性别',
    operatorId: '4',
    operatorName: '赵管理员',
    operationTime: '2026-01-15 14:30:00',
    ipAddress: '192.168.1.100'
  }
];

// 字典统计数据
const dictionaryStatistics = {
  totalDictionaries: 10,
  systemDictionaries: 2,
  businessDictionaries: 8,
  customDictionaries: 0,
  totalValues: 37,
  enabledValues: 37,
  disabledValues: 0
};

// ==================== 字典管理API接口模拟 ====================

// 获取字典列表
Mock.mock(/\/api\/v1\/dictionaries/, 'get', (options) => {
  const urlParams = new URLSearchParams(options.url.split('?')[1]);
  const page = parseInt(urlParams.get('page')) || 1;
  const pageSize = parseInt(urlParams.get('pageSize')) || 10;
  const name = urlParams.get('name') || '';
  const code = urlParams.get('code') || '';
  const type = urlParams.get('type') || '';
  
  let filteredDictionaries = dictionaries;
  
  if (name) {
    filteredDictionaries = filteredDictionaries.filter(d => d.name.includes(name));
  }
  if (code) {
    filteredDictionaries = filteredDictionaries.filter(d => d.code.includes(code));
  }
  if (type) {
    filteredDictionaries = filteredDictionaries.filter(d => d.type === type);
  }
  
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const list = filteredDictionaries.slice(start, end);
  
  return {
    code: 200,
    message: '获取成功',
    data: {
      list,
      total: filteredDictionaries.length,
      page,
      pageSize
    }
  };
});

// 获取字典详情
Mock.mock(/\/api\/v1\/dictionaries\/\d+/, 'get', (options) => {
  const id = options.url.match(/\/api\/v1\/dictionaries\/(\d+)/)?.[1];
  const dictionary = dictionaries.find(d => d.id == id) || dictionaries[0];
  return {
    code: 200,
    message: '获取成功',
    data: dictionary
  };
});

// 创建字典
Mock.mock('/api/v1/dictionaries', 'post', (options) => {
  const data = JSON.parse(options.body);
  const newDictionary = {
    id: Date.now(),
    ...data,
    creatorId: '4',
    creatorName: '赵管理员',
    departmentId: '1',
    departmentName: '技术部',
    createdAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
    updatedAt: new Date().toISOString().replace('T', ' ').substring(0, 19)
  };
  dictionaries.push(newDictionary);
  return {
    code: 200,
    message: '创建成功',
    data: newDictionary
  };
});

// 更新字典
Mock.mock(/\/api\/v1\/dictionaries\/\d+/, 'put', (options) => {
  const id = options.url.match(/\/api\/v1\/dictionaries\/(\d+)/)?.[1];
  const data = JSON.parse(options.body);
  const index = dictionaries.findIndex(d => d.id == id);
  if (index !== -1) {
    dictionaries[index] = {
      ...dictionaries[index],
      ...data,
      updatedAt: new Date().toISOString().replace('T', ' ').substring(0, 19)
    };
  }
  return {
    code: 200,
    message: '更新成功',
    data: dictionaries[index]
  };
});

// 删除字典
Mock.mock(/\/api\/v1\/dictionaries\/\d+/, 'delete', (options) => {
  const id = options.url.match(/\/api\/v1\/dictionaries\/(\d+)/)?.[1];
  const index = dictionaries.findIndex(d => d.id == id);
  if (index !== -1) {
    dictionaries.splice(index, 1);
  }
  return {
    code: 200,
    message: '删除成功',
    data: null
  };
});

// 批量删除字典
Mock.mock('/api/v1/dictionaries/batch-delete', 'post', (options) => {
  const { ids } = JSON.parse(options.body);
  ids.forEach(id => {
    const index = dictionaries.findIndex(d => d.id == id);
    if (index !== -1) {
      dictionaries.splice(index, 1);
    }
  });
  return {
    code: 200,
    message: '批量删除成功',
    data: null
  };
});

// 获取字典值列表
Mock.mock(/\/api\/v1\/dictionary-values/, 'get', (options) => {
  const urlParams = new URLSearchParams(options.url.split('?')[1]);
  const dictionaryId = urlParams.get('dictionaryId');
  const page = parseInt(urlParams.get('page')) || 1;
  const pageSize = parseInt(urlParams.get('pageSize')) || 10;
  
  const dictionary = dictionaries.find(d => d.id == dictionaryId);
  const values = dictionary ? dictionary.values : [];
  
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const list = values.slice(start, end);
  
  return {
    code: 200,
    message: '获取成功',
    data: {
      list,
      total: values.length,
      page,
      pageSize
    }
  };
});

// 创建字典值
Mock.mock(/\/api\/v1\/dictionaries\/\d+\/values/, 'post', (options) => {
  const dictionaryId = options.url.match(/\/api\/v1\/dictionaries\/(\d+)\/values/)?.[1];
  const data = JSON.parse(options.body);
  const dictionary = dictionaries.find(d => d.id == dictionaryId);
  if (dictionary) {
    const newValue = {
      id: Date.now(),
      ...data,
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 19)
    };
    dictionary.values.push(newValue);
    return {
      code: 200,
      message: '创建成功',
      data: newValue
    };
  }
  return {
    code: 404,
    message: '字典不存在'
  };
});

// 更新字典值
Mock.mock(/\/api\/v1\/dictionaries\/\d+\/values\/\d+/, 'put', (options) => {
  const dictionaryId = options.url.match(/\/api\/v1\/dictionaries\/(\d+)\/values\/(\d+)/)?.[1];
  const valueId = options.url.match(/\/api\/v1\/dictionaries\/\d+\/values\/(\d+)/)?.[2];
  const data = JSON.parse(options.body);
  const dictionary = dictionaries.find(d => d.id == dictionaryId);
  if (dictionary) {
    const index = dictionary.values.findIndex(v => v.id == valueId);
    if (index !== -1) {
      dictionary.values[index] = {
        ...dictionary.values[index],
        ...data
      };
      return {
        code: 200,
        message: '更新成功',
        data: dictionary.values[index]
      };
    }
  }
  return {
    code: 404,
    message: '字典值不存在'
  };
});

// 删除字典值
Mock.mock(/\/api\/v1\/dictionaries\/\d+\/values\/\d+/, 'delete', (options) => {
  const dictionaryId = options.url.match(/\/api\/v1\/dictionaries\/(\d+)\/values\/(\d+)/)?.[1];
  const valueId = options.url.match(/\/api\/v1\/dictionaries\/\d+\/values\/(\d+)/)?.[2];
  const dictionary = dictionaries.find(d => d.id == dictionaryId);
  if (dictionary) {
    const index = dictionary.values.findIndex(v => v.id == valueId);
    if (index !== -1) {
      dictionary.values.splice(index, 1);
      return {
        code: 200,
        message: '删除成功',
        data: null
      };
    }
  }
  return {
    code: 404,
    message: '字典值不存在'
  };
});

// 批量删除字典值
Mock.mock(/\/api\/v1\/dictionaries\/\d+\/values\/batch-delete/, 'post', (options) => {
  const dictionaryId = options.url.match(/\/api\/v1\/dictionaries\/(\d+)\/values\/batch-delete/)?.[1];
  const { valueIds } = JSON.parse(options.body);
  const dictionary = dictionaries.find(d => d.id == dictionaryId);
  if (dictionary) {
    valueIds.forEach(valueId => {
      const index = dictionary.values.findIndex(v => v.id == valueId);
      if (index !== -1) {
        dictionary.values.splice(index, 1);
      }
    });
    return {
      code: 200,
      message: '批量删除成功',
      data: null
    };
  }
  return {
    code: 404,
    message: '字典不存在'
  };
});

// 导入字典
Mock.mock('/api/v1/dictionaries/import', 'post', () => {
  return {
    code: 200,
    message: '导入成功',
    data: {
      success: 5,
      failed: 0,
      errors: []
    }
  };
});

// 导出字典
Mock.mock(/\/api\/v1\/dictionaries\/export/, 'get', () => {
  return {
    code: 200,
    message: '导出成功',
    data: dictionaries
  };
});

// 获取字典统计
Mock.mock('/api/v1/dictionaries/statistics', 'get', () => {
  return {
    code: 200,
    message: '获取成功',
    data: dictionaryStatistics
  };
});

// 获取字典操作日志
Mock.mock(/\/api\/v1\/dictionaries\/operation-logs/, 'get', (options) => {
  const urlParams = new URLSearchParams(options.url.split('?')[1]);
  const page = parseInt(urlParams.get('page')) || 1;
  const pageSize = parseInt(urlParams.get('pageSize')) || 10;
  
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const list = dictionaryOperationLogs.slice(start, end);
  
  return {
    code: 200,
    message: '获取成功',
    data: {
      list,
      total: dictionaryOperationLogs.length
    }
  };
});

// 公司文化数据
const companyCulture = {
  id: '1',
  title: '企业文化标题',
  shortName: '蓝领智汇',
  content: '<h1>企业文化内容</h1><p>这是企业文化的详细内容，包括企业愿景、使命、价值观等。</p>',
  createTime: '2026-01-01 10:00:00',
  updateTime: '2026-01-01 10:00:00'
};

// 岗位文化数据
const positionCultures = [
  {
    id: '1',
    factoryId: '1',
    factoryName: '富士康科技集团',
    title: '操作工岗位文化',
    content: '<h1>操作工岗位文化</h1><p>操作工是企业的基础，是产品质量的直接保证。</p>',
    createTime: '2026-01-01 10:00:00',
    updateTime: '2026-01-01 10:00:00'
  },
  {
    id: '2',
    factoryId: '1',
    factoryName: '富士康科技集团',
    title: '质检员岗位文化',
    content: '<h1>质检员岗位文化</h1><p>质检员是产品质量的守护者，确保每一件产品都符合标准。</p>',
    createTime: '2026-01-02 10:00:00',
    updateTime: '2026-01-02 10:00:00'
  },
  {
    id: '3',
    factoryId: '2',
    factoryName: '华为技术有限公司',
    title: '工程师岗位文化',
    content: '<h1>工程师岗位文化</h1><p>工程师是技术创新的核心，推动企业不断进步。</p>',
    createTime: '2026-01-03 10:00:00',
    updateTime: '2026-01-03 10:00:00'
  }
];

// 工厂列表数据
const factoryList = [
  { id: '1', name: '富士康科技集团' },
  { id: '2', name: '华为技术有限公司' },
  { id: '3', name: '比亚迪股份有限公司' }
];

// 公司文化API接口模拟
Mock.mock('/company-culture', 'get', () => {
  return {
    code: 200,
    message: '获取成功',
    data: companyCulture
  };
});

Mock.mock('/company-culture', 'post', (options) => {
  const data = JSON.parse(options.body);
  return {
    code: 200,
    message: '保存成功',
    data: {
      ...companyCulture,
      ...data,
      updateTime: new Date().toISOString().replace('T', ' ').substring(0, 19)
    }
  };
});

// 岗位文化API接口模拟
Mock.mock('/position-culture', 'get', (options) => {
  const url = new URL(options.url, 'http://localhost');
  const factoryId = url.searchParams.get('factoryId') || '';
  let filteredPositionCultures = positionCultures;
  if (factoryId) {
    filteredPositionCultures = positionCultures.filter(p => p.factoryId === factoryId);
  }
  return {
    code: 200,
    message: '获取成功',
    data: {
      list: filteredPositionCultures,
      total: filteredPositionCultures.length,
      page: 1,
      pageSize: 10
    }
  };
});

Mock.mock('/position-culture', 'post', (options) => {
  const data = JSON.parse(options.body);
  const newPositionCulture = {
    id: String(Date.now()),
    ...data,
    createTime: new Date().toISOString().replace('T', ' ').substring(0, 19),
    updateTime: new Date().toISOString().replace('T', ' ').substring(0, 19)
  };
  positionCultures.unshift(newPositionCulture);
  return {
    code: 200,
    message: '保存成功',
    data: newPositionCulture
  };
});

Mock.mock(/\/position-culture\/\w+/, 'put', (options) => {
  const id = options.url.match(/\/position-culture\/(\w+)/)?.[1];
  const data = JSON.parse(options.body);
  const index = positionCultures.findIndex(p => p.id === id);
  if (index !== -1) {
    positionCultures[index] = {
      ...positionCultures[index],
      ...data,
      updateTime: new Date().toISOString().replace('T', ' ').substring(0, 19)
    };
    return {
      code: 200,
      message: '更新成功',
      data: positionCultures[index]
    };
  }
  return {
    code: 404,
    message: '岗位文化不存在'
  };
});

Mock.mock(/\/position-culture\/\w+/, 'delete', (options) => {
  const id = options.url.match(/\/position-culture\/(\w+)/)?.[1];
  const index = positionCultures.findIndex(p => p.id === id);
  if (index !== -1) {
    positionCultures.splice(index, 1);
    return {
      code: 200,
      message: '删除成功',
      data: null
    };
  }
  return {
    code: 404,
    message: '岗位文化不存在'
  };
});

// 工厂列表API接口模拟
Mock.mock('/factories', 'get', () => {
  return {
    code: 200,
    message: '获取成功',
    data: factoryList
  };
});

// 引入系统管理模块Mock API
import('./systemManagementApi.js');

// 导出Mock对象
if (typeof module !== 'undefined' && module.exports) {
  module.exports = Mock;
} else if (typeof window !== 'undefined') {
  // 浏览器环境
  window.Mock = Mock;
}

// 引入打印管理Mock数据
import('./printManagement.js');

// 引入岗位管理Mock数据
import('./position.js');

// 引入招聘管理Mock数据
import('./recruitment.js');

// 引入结算管理Mock数据
import('./settlement.js');

// 引入合同管理Mock数据
import('./contract.js');

// 引入消息通知Mock数据
import('./notification.js');

// ==================== 流程配置Mock数据 ====================

// 审批流程数据
const approvalFlows = [
  {
    id: 1,
    flowName: '请假审批流程',
    flowCode: 'LEAVE_APPROVAL',
    flowType: 'LEAVE',
    flowDescription: '员工请假申请审批流程，支持多级审批',
    flowStatus: 'ENABLED',
    isDefault: 1,
    version: 1,
    tenantId: 1,
    createTime: '2026-02-26 10:00:00',
    updateTime: '2026-02-26 10:00:00',
    createBy: 'admin',
    updateBy: 'admin',
    remark: '默认请假审批流程',
    nodeCount: 3
  },
  {
    id: 2,
    flowName: '调岗审批流程',
    flowCode: 'TRANSFER_APPROVAL',
    flowType: 'TRANSFER',
    flowDescription: '员工调岗申请审批流程，支持多级审批',
    flowStatus: 'ENABLED',
    isDefault: 1,
    version: 1,
    tenantId: 1,
    createTime: '2026-02-26 10:00:00',
    updateTime: '2026-02-26 10:00:00',
    createBy: 'admin',
    updateBy: 'admin',
    remark: '默认调岗审批流程',
    nodeCount: 2
  },
  {
    id: 3,
    flowName: '离职审批流程',
    flowCode: 'RESIGNATION_APPROVAL',
    flowType: 'RESIGNATION',
    flowDescription: '员工离职申请审批流程，支持多级审批',
    flowStatus: 'ENABLED',
    isDefault: 1,
    version: 1,
    tenantId: 1,
    createTime: '2026-02-26 10:00:00',
    updateTime: '2026-02-26 10:00:00',
    createBy: 'admin',
    updateBy: 'admin',
    remark: '默认离职审批流程',
    nodeCount: 3
  },
  {
    id: 4,
    flowName: '报名审批流程',
    flowCode: 'REGISTRATION_APPROVAL',
    flowType: 'REGISTRATION',
    flowDescription: '活动报名审批流程，支持多级审批',
    flowStatus: 'ENABLED',
    isDefault: 1,
    version: 1,
    tenantId: 1,
    createTime: '2026-02-26 10:00:00',
    updateTime: '2026-02-26 10:00:00',
    createBy: 'admin',
    updateBy: 'admin',
    remark: '默认报名审批流程',
    nodeCount: 2
  }
];

// 审批节点数据
const approvalNodes = [
  // 请假审批流程节点
  {
    id: 1,
    flowId: 1,
    nodeName: '部门主管审批',
    nodeCode: 'LEAVE_NODE_1',
    nodeType: 'APPROVAL',
    nodeOrder: 1,
    approvalMode: 'OR',
    approverType: 'POSITION',
    approverConfig: '{"position_code":"DEPT_MANAGER"}',
    isRequired: 1,
    autoApprove: 0,
    tenantId: 1,
    createTime: '2026-02-26 10:00:00',
    updateBy: 'admin'
  },
  {
    id: 2,
    flowId: 1,
    nodeName: '人事审批',
    nodeCode: 'LEAVE_NODE_2',
    nodeType: 'APPROVAL',
    nodeOrder: 2,
    approvalMode: 'OR',
    approverType: 'POSITION',
    approverConfig: '{"position_code":"HR_MANAGER"}',
    isRequired: 1,
    autoApprove: 0,
    tenantId: 1,
    createTime: '2026-02-26 10:00:00',
    updateBy: 'admin'
  },
  {
    id: 3,
    flowId: 1,
    nodeName: '总经理审批',
    nodeCode: 'LEAVE_NODE_3',
    nodeType: 'APPROVAL',
    nodeOrder: 3,
    approvalMode: 'OR',
    approverType: 'POSITION',
    approverConfig: '{"position_code":"GENERAL_MANAGER"}',
    isRequired: 0,
    autoApprove: 0,
    tenantId: 1,
    createTime: '2026-02-26 10:00:00',
    updateBy: 'admin'
  },
  // 调岗审批流程节点
  {
    id: 4,
    flowId: 2,
    nodeName: '部门主管审批',
    nodeCode: 'TRANSFER_NODE_1',
    nodeType: 'APPROVAL',
    nodeOrder: 1,
    approvalMode: 'OR',
    approverType: 'POSITION',
    approverConfig: '{"position_code":"DEPT_MANAGER"}',
    isRequired: 1,
    autoApprove: 0,
    tenantId: 1,
    createTime: '2026-02-26 10:00:00',
    updateBy: 'admin'
  },
  {
    id: 5,
    flowId: 2,
    nodeName: '人事审批',
    nodeCode: 'TRANSFER_NODE_2',
    nodeType: 'APPROVAL',
    nodeOrder: 2,
    approvalMode: 'OR',
    approverType: 'POSITION',
    approverConfig: '{"position_code":"HR_MANAGER"}',
    isRequired: 1,
    autoApprove: 0,
    tenantId: 1,
    createTime: '2026-02-26 10:00:00',
    updateBy: 'admin'
  },
  // 离职审批流程节点
  {
    id: 6,
    flowId: 3,
    nodeName: '部门主管审批',
    nodeCode: 'RESIGNATION_NODE_1',
    nodeType: 'APPROVAL',
    nodeOrder: 1,
    approvalMode: 'OR',
    approverType: 'POSITION',
    approverConfig: '{"position_code":"DEPT_MANAGER"}',
    isRequired: 1,
    autoApprove: 0,
    tenantId: 1,
    createTime: '2026-02-26 10:00:00',
    updateBy: 'admin'
  },
  {
    id: 7,
    flowId: 3,
    nodeName: '人事审批',
    nodeCode: 'RESIGNATION_NODE_2',
    nodeType: 'APPROVAL',
    nodeOrder: 2,
    approvalMode: 'OR',
    approverType: 'POSITION',
    approverConfig: '{"position_code":"HR_MANAGER"}',
    isRequired: 1,
    autoApprove: 0,
    tenantId: 1,
    createTime: '2026-02-26 10:00:00',
    updateBy: 'admin'
  },
  {
    id: 8,
    flowId: 3,
    nodeName: '总经理审批',
    nodeCode: 'RESIGNATION_NODE_3',
    nodeType: 'APPROVAL',
    nodeOrder: 3,
    approvalMode: 'OR',
    approverType: 'POSITION',
    approverConfig: '{"position_code":"GENERAL_MANAGER"}',
    isRequired: 0,
    autoApprove: 0,
    tenantId: 1,
    createTime: '2026-02-26 10:00:00',
    updateBy: 'admin'
  },
  // 报名审批流程节点
  {
    id: 9,
    flowId: 4,
    nodeName: '活动负责人审批',
    nodeCode: 'REGISTRATION_NODE_1',
    nodeType: 'APPROVAL',
    nodeOrder: 1,
    approvalMode: 'OR',
    approverType: 'USER',
    approverConfig: '{"user_ids":["1001","1002"]}',
    isRequired: 1,
    autoApprove: 0,
    tenantId: 1,
    createTime: '2026-02-26 10:00:00',
    updateBy: 'admin'
  },
  {
    id: 10,
    flowId: 4,
    nodeName: '人事审批',
    nodeCode: 'REGISTRATION_NODE_2',
    nodeType: 'APPROVAL',
    nodeOrder: 2,
    approvalMode: 'OR',
    approverType: 'POSITION',
    approverConfig: '{"position_code":"HR_MANAGER"}',
    isRequired: 0,
    autoApprove: 0,
    tenantId: 1,
    createTime: '2026-02-26 10:00:00',
    updateBy: 'admin'
  }
];

// 流程配置数据
const flowBusinessConfigs = [
  {
    id: 1,
    businessCode: 'LEAVE',
    businessName: '请假管理',
    flowId: 1,
    flowName: '请假审批流程',
    isEnabled: 1,
    effectiveDate: '2026-01-01 00:00:00',
    expiryDate: null,
    configDescription: '请假管理启用审批流程',
    tenantId: 1,
    createTime: '2026-02-26 10:00:00',
    updateTime: '2026-02-26 10:00:00',
    createBy: 'admin',
    updateBy: 'admin'
  },
  {
    id: 2,
    businessCode: 'TRANSFER',
    businessName: '调岗管理',
    flowId: 2,
    flowName: '调岗审批流程',
    isEnabled: 1,
    effectiveDate: '2026-01-01 00:00:00',
    expiryDate: null,
    configDescription: '调岗管理启用审批流程',
    tenantId: 1,
    createTime: '2026-02-26 10:00:00',
    updateTime: '2026-02-26 10:00:00',
    createBy: 'admin',
    updateBy: 'admin'
  },
  {
    id: 3,
    businessCode: 'RESIGNATION',
    businessName: '离职管理',
    flowId: 3,
    flowName: '离职审批流程',
    isEnabled: 1,
    effectiveDate: '2026-01-01 00:00:00',
    expiryDate: null,
    configDescription: '离职管理启用审批流程',
    tenantId: 1,
    createTime: '2026-02-26 10:00:00',
    updateTime: '2026-02-26 10:00:00',
    createBy: 'admin',
    updateBy: 'admin'
  },
  {
    id: 4,
    businessCode: 'REGISTRATION',
    businessName: '报名管理',
    flowId: 4,
    flowName: '报名审批流程',
    isEnabled: 1,
    effectiveDate: '2026-01-01 00:00:00',
    expiryDate: null,
    configDescription: '报名管理启用审批流程',
    tenantId: 1,
    createTime: '2026-02-26 10:00:00',
    updateTime: '2026-02-26 10:00:00',
    createBy: 'admin',
    updateBy: 'admin'
  }
];

// 审批记录数据
const approvalRecords = [
  {
    id: 1,
    businessCode: 'LEAVE',
    businessId: 1001,
    flowId: 1,
    flowName: '请假审批流程',
    nodeId: 1,
    nodeName: '部门主管审批',
    approverId: 1001,
    approverName: '张三',
    approverDept: '技术部',
    approvalResult: 'APPROVED',
    approvalComment: '同意请假',
    approvalTime: '2026-02-26 10:30:00',
    isCurrent: 0,
    tenantId: 1,
    createTime: '2026-02-26 10:00:00',
    updateBy: '张三'
  },
  {
    id: 2,
    businessCode: 'LEAVE',
    businessId: 1001,
    flowId: 1,
    flowName: '请假审批流程',
    nodeId: 2,
    nodeName: '人事审批',
    approverId: 1002,
    approverName: '李四',
    approverDept: '人事部',
    approvalResult: 'PENDING',
    approvalComment: null,
    approvalTime: null,
    isCurrent: 1,
    tenantId: 1,
    createTime: '2026-02-26 10:00:00',
    updateBy: 'admin'
  }
];

// 待办任务数据
const todoTasks = [
  {
    id: 1,
    taskType: 'APPROVAL',
    taskTitle: '请假申请审批',
    taskContent: '王五申请请假3天，请审批',
    taskSource: 'LEAVE',
    businessCode: 'LEAVE',
    businessId: 1001,
    taskStatus: 'PENDING',
    priority: 'NORMAL',
    assigneeId: 1002,
    assigneeName: '李四',
    assigneeDept: '人事部',
    senderId: 1003,
    senderName: '王五',
    dueDate: '2026-02-27 10:00:00',
    completeTime: null,
    readStatus: 0,
    readTime: null,
    approvalRecordId: 2,
    taskUrl: '/labor-company/on-duty/leave/detail/1001',
    tenantId: 1,
    createTime: '2026-02-26 10:00:00',
    updateBy: 'admin'
  },
  {
    id: 2,
    taskType: 'APPROVAL',
    taskTitle: '调岗申请审批',
    taskContent: '赵六申请调岗，请审批',
    taskSource: 'TRANSFER',
    businessCode: 'TRANSFER',
    businessId: 1002,
    taskStatus: 'PENDING',
    priority: 'HIGH',
    assigneeId: 1001,
    assigneeName: '张三',
    assigneeDept: '技术部',
    senderId: 1004,
    senderName: '赵六',
    dueDate: '2026-02-27 10:00:00',
    completeTime: null,
    readStatus: 1,
    readTime: '2026-02-26 11:00:00',
    approvalRecordId: 3,
    taskUrl: '/labor-company/on-duty/transfer/detail/1002',
    tenantId: 1,
    createTime: '2026-02-26 09:00:00',
    updateBy: 'admin'
  },
  {
    id: 3,
    taskType: 'NOTICE',
    taskTitle: '系统通知',
    taskContent: '系统将于今晚进行维护',
    taskSource: 'SYSTEM',
    businessCode: 'SYSTEM',
    businessId: 0,
    taskStatus: 'PENDING',
    priority: 'LOW',
    assigneeId: 1002,
    assigneeName: '李四',
    assigneeDept: '人事部',
    senderId: 0,
    senderName: '系统',
    dueDate: null,
    completeTime: null,
    readStatus: 0,
    readTime: null,
    taskUrl: null,
    tenantId: 1,
    createTime: '2026-02-26 08:00:00',
    updateBy: 'admin'
  }
];

// 业务代码列表
const businessCodes = [
  { code: 'LEAVE', name: '请假管理' },
  { code: 'TRANSFER', name: '调岗管理' },
  { code: 'RESIGNATION', name: '离职管理' },
  { code: 'REGISTRATION', name: '报名管理' }
];

// ==================== 流程配置API接口模拟 ====================

// 获取流程列表
Mock.mock('/api/v1/approval-flows', 'get', (options) => {
  const urlParams = new URLSearchParams(options.url.split('?')[1]);
  const page = parseInt(urlParams.get('page')) || 1;
  const pageSize = parseInt(urlParams.get('pageSize')) || 10;
  const flowType = urlParams.get('flowType') || '';
  const flowStatus = urlParams.get('flowStatus') || '';
  const keyword = urlParams.get('keyword') || '';

  let filteredFlows = [...approvalFlows];

  if (flowType) {
    filteredFlows = filteredFlows.filter(flow => flow.flowType === flowType);
  }
  if (flowStatus) {
    filteredFlows = filteredFlows.filter(flow => flow.flowStatus === flowStatus);
  }
  if (keyword) {
    filteredFlows = filteredFlows.filter(flow =>
      flow.flowName.includes(keyword) || flow.flowCode.includes(keyword)
    );
  }

  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const list = filteredFlows.slice(start, end);

  return {
    code: 200,
    message: 'success',
    data: {
      list,
      total: filteredFlows.length,
      page,
      pageSize
    },
    timestamp: Date.now()
  };
});

// 获取流程详情
Mock.mock(/\/api\/v1\/approval-flows\/\d+/, 'get', (options) => {
  const id = parseInt(options.url.match(/\d+/)[0]);
  const flow = approvalFlows.find(f => f.id === id);
  const nodes = approvalNodes.filter(n => n.flowId === id);

  if (flow) {
    return {
      code: 200,
      message: 'success',
      data: {
        ...flow,
        nodes
      },
      timestamp: Date.now()
    };
  }

  return {
    code: 404,
    message: '流程不存在',
    data: null,
    timestamp: Date.now()
  };
});

// 创建流程
Mock.mock('/api/v1/approval-flows', 'post', (options) => {
  const data = JSON.parse(options.body);
  const newFlow = {
    ...data,
    id: approvalFlows.length + 1,
    createTime: new Date().toISOString().replace('T', ' ').substring(0, 19),
    updateTime: new Date().toISOString().replace('T', ' ').substring(0, 19)
  };
  approvalFlows.push(newFlow);

  return {
    code: 201,
    message: '创建成功',
    data: { id: newFlow.id },
    timestamp: Date.now()
  };
});

// 更新流程
Mock.mock(/\/api\/v1\/approval-flows\/\d+/, 'put', (options) => {
  const id = parseInt(options.url.match(/\d+/)[0]);
  const data = JSON.parse(options.body);
  const index = approvalFlows.findIndex(f => f.id === id);

  if (index !== -1) {
    approvalFlows[index] = {
      ...approvalFlows[index],
      ...data,
      updateTime: new Date().toISOString().replace('T', ' ').substring(0, 19)
    };

    return {
      code: 200,
      message: '更新成功',
      data: approvalFlows[index],
      timestamp: Date.now()
    };
  }

  return {
    code: 404,
    message: '流程不存在',
    data: null,
    timestamp: Date.now()
  };
});

// 删除流程
Mock.mock(/\/api\/v1\/approval-flows\/\d+/, 'delete', (options) => {
  const id = parseInt(options.url.match(/\d+/)[0]);
  const index = approvalFlows.findIndex(f => f.id === id);

  if (index !== -1) {
    approvalFlows.splice(index, 1);

    return {
      code: 200,
      message: '删除成功',
      data: null,
      timestamp: Date.now()
    };
  }

  return {
    code: 404,
    message: '流程不存在',
    data: null,
    timestamp: Date.now()
  };
});

// 启用/停用流程
Mock.mock(/\/api\/v1\/approval-flows\/\d+\/status/, 'put', (options) => {
  const id = parseInt(options.url.match(/\d+/)[0]);
  const { flowStatus } = JSON.parse(options.body);
  const flow = approvalFlows.find(f => f.id === id);

  if (flow) {
    flow.flowStatus = flowStatus;
    flow.updateTime = new Date().toISOString().replace('T', ' ').substring(0, 19);

    return {
      code: 200,
      message: '操作成功',
      data: null,
      timestamp: Date.now()
    };
  }

  return {
    code: 404,
    message: '流程不存在',
    data: null,
    timestamp: Date.now()
  };
});

// 获取流程配置列表
Mock.mock('/api/v1/flow-configs', 'get', (options) => {
  const urlParams = new URLSearchParams(options.url.split('?')[1]);
  const page = parseInt(urlParams.get('page')) || 1;
  const pageSize = parseInt(urlParams.get('pageSize')) || 10;
  const businessCode = urlParams.get('businessCode') || '';
  const isEnabled = urlParams.get('isEnabled') || '';

  let filteredConfigs = [...flowBusinessConfigs];

  if (businessCode) {
    filteredConfigs = filteredConfigs.filter(config => config.businessCode === businessCode);
  }
  if (isEnabled !== '') {
    filteredConfigs = filteredConfigs.filter(config => config.isEnabled === parseInt(isEnabled));
  }

  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const list = filteredConfigs.slice(start, end);

  return {
    code: 200,
    message: 'success',
    data: {
      list,
      total: filteredConfigs.length,
      page,
      pageSize
    },
    timestamp: Date.now()
  };
});

// 创建流程配置
Mock.mock('/api/v1/flow-configs', 'post', (options) => {
  const data = JSON.parse(options.body);
  const newConfig = {
    ...data,
    id: flowBusinessConfigs.length + 1,
    createTime: new Date().toISOString().replace('T', ' ').substring(0, 19),
    updateTime: new Date().toISOString().replace('T', ' ').substring(0, 19)
  };
  flowBusinessConfigs.push(newConfig);

  return {
    code: 201,
    message: '创建成功',
    data: { id: newConfig.id },
    timestamp: Date.now()
  };
});

// 更新流程配置
Mock.mock(/\/api\/v1\/flow-configs\/\d+/, 'put', (options) => {
  const id = parseInt(options.url.match(/\d+/)[0]);
  const data = JSON.parse(options.body);
  const index = flowBusinessConfigs.findIndex(c => c.id === id);

  if (index !== -1) {
    flowBusinessConfigs[index] = {
      ...flowBusinessConfigs[index],
      ...data,
      updateTime: new Date().toISOString().replace('T', ' ').substring(0, 19)
    };

    return {
      code: 200,
      message: '更新成功',
      data: flowBusinessConfigs[index],
      timestamp: Date.now()
    };
  }

  return {
    code: 404,
    message: '配置不存在',
    data: null,
    timestamp: Date.now()
  };
});

// 获取流程配置详情
Mock.mock(/\/api\/v1\/flow-configs\/\d+/, 'get', (options) => {
  const id = parseInt(options.url.match(/\d+/)[0]);
  const config = flowBusinessConfigs.find(c => c.id === id);

  if (!config) {
    return {
      code: 404,
      message: '配置不存在',
      data: null,
      timestamp: Date.now()
    };
  }

  // 获取关联的流程信息
  const flow = approvalFlows.find(f => f.id === config.flowId);
  const nodes = approvalNodes.filter(n => n.flowId === config.flowId);

  return {
    code: 200,
    message: 'success',
    data: {
      ...config,
      flowInfo: flow,
      flowNodes: nodes
    },
    timestamp: Date.now()
  };
});

// 删除流程配置
Mock.mock(/\/api\/v1\/flow-configs\/\d+/, 'delete', (options) => {
  const id = parseInt(options.url.match(/\d+/)[0]);
  const index = flowBusinessConfigs.findIndex(c => c.id === id);

  if (index !== -1) {
    flowBusinessConfigs.splice(index, 1);

    return {
      code: 200,
      message: '删除成功',
      data: null,
      timestamp: Date.now()
    };
  }

  return {
    code: 404,
    message: '配置不存在',
    data: null,
    timestamp: Date.now()
  };
});

// 提交审批
Mock.mock('/api/v1/approvals/submit', 'post', (options) => {
  const data = JSON.parse(options.body);
  const flow = approvalFlows.find(f => f.flowType === data.businessCode);
  const firstNode = approvalNodes.find(n => n.flowId === flow.id && n.nodeOrder === 1);

  return {
    code: 200,
    message: '提交成功',
    data: {
      approvalId: approvalRecords.length + 1,
      currentNode: firstNode.nodeName,
      currentNodeId: firstNode.id
    },
    timestamp: Date.now()
  };
});

// 审批通过
Mock.mock('/api/v1/approvals/approve', 'post', (options) => {
  const data = JSON.parse(options.body);

  return {
    code: 200,
    message: '审批通过',
    data: {
      nextNode: '下一节点',
      nextNodeId: 2,
      isCompleted: false,
      approvalStatus: 'IN_PROGRESS'
    },
    timestamp: Date.now()
  };
});

// 审批驳回
Mock.mock('/api/v1/approvals/reject', 'post', (options) => {
  return {
    code: 200,
    message: '审批驳回',
    data: {
      isCompleted: true,
      approvalStatus: 'REJECTED'
    },
    timestamp: Date.now()
  };
});

// 获取审批记录
Mock.mock('/api/v1/approvals/records', 'get', (options) => {
  const urlParams = new URLSearchParams(options.url.split('?')[1]);
  const businessId = parseInt(urlParams.get('businessId')) || 0;
  const businessCode = urlParams.get('businessCode') || '';

  const records = approvalRecords.filter(
    r => r.businessId === businessId && r.businessCode === businessCode
  );

  return {
    code: 200,
    message: 'success',
    data: records,
    timestamp: Date.now()
  };
});

// 获取待办任务列表
Mock.mock('/api/v1/todo-tasks', 'get', (options) => {
  const urlParams = new URLSearchParams(options.url.split('?')[1]);
  const page = parseInt(urlParams.get('page')) || 1;
  const pageSize = parseInt(urlParams.get('pageSize')) || 10;
  const taskStatus = urlParams.get('taskStatus') || '';
  const taskType = urlParams.get('taskType') || '';
  const priority = urlParams.get('priority') || '';
  const keyword = urlParams.get('keyword') || '';

  let filteredTasks = [...todoTasks];

  if (taskStatus) {
    filteredTasks = filteredTasks.filter(task => task.taskStatus === taskStatus);
  }
  if (taskType) {
    filteredTasks = filteredTasks.filter(task => task.taskType === taskType);
  }
  if (priority) {
    filteredTasks = filteredTasks.filter(task => task.priority === priority);
  }
  if (keyword) {
    filteredTasks = filteredTasks.filter(task =>
      task.taskTitle.includes(keyword) || task.taskContent.includes(keyword)
    );
  }

  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const list = filteredTasks.slice(start, end);

  return {
    code: 200,
    message: 'success',
    data: {
      list,
      total: filteredTasks.length,
      page,
      pageSize
    },
    timestamp: Date.now()
  };
});

// 获取可用审批流程列表
Mock.mock('/api/v1/approval-flows/available', 'get', (options) => {
  const urlParams = new URLSearchParams(options.url.split('?')[1]);
  const flowType = urlParams.get('flowType') || '';

  let flows = [...approvalFlows].filter(f => f.flowStatus === 'ENABLED');

  if (flowType) {
    flows = flows.filter(f => f.flowType === flowType);
  }

  return {
    code: 200,
    message: 'success',
    data: flows,
    timestamp: Date.now()
  };
});

// 获取业务代码列表
Mock.mock('/api/v1/flow-configs/business-codes', 'get', () => {
  return {
    code: 200,
    message: 'success',
    data: businessCodes,
    timestamp: Date.now()
  };
});

// 根据业务代码获取流程配置
Mock.mock(/\/api\/v1\/flow-configs\/business\/[A-Z_]+/, 'get', (options) => {
  const businessCode = options.url.split('/').pop();
  const config = flowBusinessConfigs.find(c => c.businessCode === businessCode);

  if (!config) {
    return {
      code: 404,
      message: '未找到该业务的流程配置',
      data: null,
      timestamp: Date.now()
    };
  }

  return {
    code: 200,
    message: 'success',
    data: config,
    timestamp: Date.now()
  };
});

// 检查流程编码是否重复
Mock.mock('/api/v1/approval-flows/check-code', 'get', (options) => {
  const urlParams = new URLSearchParams(options.url.split('?')[1]);
  const flowCode = urlParams.get('flowCode') || '';
  const id = urlParams.get('id') || '';

  const exists = approvalFlows.some(
    flow => flow.flowCode === flowCode && flow.id != id
  );

  return {
    code: 200,
    message: 'success',
    data: exists,
    timestamp: Date.now()
  };
});

// 验证流程配置
Mock.mock('/api/v1/approval-flows/validate', 'post', (options) => {
  const data = JSON.parse(options.body);
  const errors = [];

  // 验证流程名称
  if (!data.flowName || data.flowName.trim() === '') {
    errors.push('流程名称不能为空');
  }

  // 验证流程编码
  if (!data.flowCode || data.flowCode.trim() === '') {
    errors.push('流程编码不能为空');
  } else if (!/^[A-Z_]+$/.test(data.flowCode)) {
    errors.push('流程编码只能包含大写字母和下划线');
  }

  // 验证流程类型
  if (!data.flowType || data.flowType.trim() === '') {
    errors.push('流程类型不能为空');
  }

  // 验证节点配置
  if (!data.nodes || data.nodes.length === 0) {
    errors.push('至少需要配置一个审批节点');
  } else {
    data.nodes.forEach((node, index) => {
      if (!node.nodeName || node.nodeName.trim() === '') {
        errors.push(`第${index + 1}个节点名称不能为空`);
      }
      if (!node.approverType || node.approverType.trim() === '') {
        errors.push(`第${index + 1}个节点审批人类型不能为空`);
      }
      if (!node.approverConfig || node.approverConfig.trim() === '') {
        errors.push(`第${index + 1}个节点审批人配置不能为空`);
      }
    });
  }

  return {
    code: 200,
    message: 'success',
    data: {
      valid: errors.length === 0,
      errors: errors.length > 0 ? errors : undefined
    },
    timestamp: Date.now()
  };
});

// 获取流程节点列表
Mock.mock(/\/api\/v1\/approval-flows\/\d+\/nodes/, 'get', (options) => {
  const flowId = parseInt(options.url.match(/\d+/)[0]);
  const nodes = approvalNodes.filter(n => n.flowId === flowId);

  return {
    code: 200,
    message: 'success',
    data: nodes,
    timestamp: Date.now()
  };
});

// ==================== 工作中心Mock数据 ====================

// 待办任务数据
const workCenterTodos = [
  {
    id: 1,
    title: '审核租户申请 - 三鼎劳务有限公司',
    type: 'tenant_audit',
    typeName: '租户审核',
    priority: 'high',
    priorityName: '高',
    status: 'pending',
    statusName: '待处理',
    content: '待审核的租户申请,需要核实企业资质和经营状况',
    applicant: '张经理',
    applyTime: '2026-02-25 10:30:00',
    deadline: '2026-02-27 18:00:00',
    createTime: '2026-02-25 10:30:00'
  },
  {
    id: 2,
    title: '处理预警消息 - 工人离职率异常',
    type: 'warning_handle',
    typeName: '预警处理',
    priority: 'urgent',
    priorityName: '紧急',
    status: 'pending',
    statusName: '待处理',
    content: '某劳务公司工人离职率超过预警阈值,需要及时处理',
    source: '系统自动预警',
    warningTime: '2026-02-25 09:15:00',
    createTime: '2026-02-25 09:15:00'
  },
  {
    id: 3,
    title: '审核活动申请 - 春节招聘活动',
    type: 'activity_audit',
    typeName: '活动审核',
    priority: 'medium',
    priorityName: '中',
    status: 'in_progress',
    statusName: '处理中',
    content: '劳务公司提交的春节招聘活动申请,需要审核活动方案和预算',
    applicant: '李经理',
    applyTime: '2026-02-24 14:20:00',
    deadline: '2026-02-26 18:00:00',
    createTime: '2026-02-24 14:20:00'
  },
  {
    id: 4,
    title: '处理用户投诉 - 工资发放延迟',
    type: 'complaint_handle',
    typeName: '投诉处理',
    priority: 'high',
    priorityName: '高',
    status: 'pending',
    statusName: '待处理',
    content: '工人投诉工资发放延迟,需要调查并协调解决',
    complainant: '王工人',
    complaintTime: '2026-02-25 08:00:00',
    createTime: '2026-02-25 08:00:00'
  },
  {
    id: 5,
    title: '审核佣金发放规则 - 月结规则',
    type: 'commission_rule_audit',
    typeName: '佣金规则审核',
    priority: 'medium',
    priorityName: '中',
    status: 'completed',
    statusName: '已完成',
    content: '劳务公司提交的佣金发放规则修改申请,需要审核',
    applicant: '赵经理',
    applyTime: '2026-02-23 16:45:00',
    completeTime: '2026-02-24 10:30:00',
    createTime: '2026-02-23 16:45:00'
  }
];

// 消息数据
const workCenterMessages = [
  {
    id: 1,
    title: '系统维护通知',
    type: 'system',
    typeName: '系统通知',
    content: '系统将于2026年2月28日凌晨2:00-4:00进行维护升级,届时将暂停服务,请提前做好准备。',
    sender: '系统管理员',
    senderId: 0,
    priority: 'high',
    priorityName: '高',
    status: 'unread',
    statusName: '未读',
    sendTime: '2026-02-25 10:00:00',
    createTime: '2026-02-25 10:00:00'
  },
  {
    id: 2,
    title: '新功能上线通知',
    type: 'feature',
    typeName: '功能通知',
    content: '平台新增了智能推荐功能,可以根据工人技能和历史数据智能匹配岗位,提升招聘效率。',
    sender: '产品团队',
    senderId: 1,
    priority: 'medium',
    priorityName: '中',
    status: 'read',
    statusName: '已读',
    sendTime: '2026-02-24 15:30:00',
    readTime: '2026-02-24 16:00:00',
    createTime: '2026-02-24 15:30:00'
  },
  {
    id: 3,
    title: '政策更新通知',
    type: 'policy',
    typeName: '政策通知',
    content: '根据最新劳动法规要求,平台更新了工人权益保障相关政策,请各租户及时了解并遵照执行。',
    sender: '法务部',
    senderId: 2,
    priority: 'high',
    priorityName: '高',
    status: 'read',
    statusName: '已读',
    sendTime: '2026-02-23 09:00:00',
    readTime: '2026-02-23 10:00:00',
    createTime: '2026-02-23 09:00:00'
  },
  {
    id: 4,
    title: '培训通知',
    type: 'training',
    typeName: '培训通知',
    content: '平台将于2026年3月1日举办系统操作培训,请各租户管理员准时参加。',
    sender: '培训部',
    senderId: 3,
    priority: 'medium',
    priorityName: '中',
    status: 'unread',
    statusName: '未读',
    sendTime: '2026-02-22 14:00:00',
    createTime: '2026-02-22 14:00:00'
  }
];

// 预警消息数据
const workCenterWarnings = [
  {
    id: 1,
    title: '工人离职率异常预警',
    type: 'turnover_rate',
    typeName: '离职率异常',
    level: 'high',
    levelName: '高',
    content: '南通富民劳务服务有限公司本月工人离职率达到15%,超过预警阈值10%,请及时关注。',
    target: '南通富民劳务服务有限公司',
    targetId: 1,
    warningTime: '2026-02-25 09:15:00',
    status: 'unhandled',
    statusName: '未处理',
    createTime: '2026-02-25 09:15:00'
  },
  {
    id: 2,
    title: '投诉率异常预警',
    type: 'complaint_rate',
    typeName: '投诉率异常',
    level: 'medium',
    levelName: '中',
    content: '三鼎劳务有限公司本月投诉率达到5%,超过预警阈值3%,需要关注服务质量。',
    target: '三鼎劳务有限公司',
    targetId: 2,
    warningTime: '2026-02-24 16:30:00',
    status: 'handled',
    statusName: '已处理',
    handleTime: '2026-02-25 10:00:00',
    handler: '张管理员',
    handlerId: 1,
    handleRemark: '已联系劳务公司,要求改进服务质量',
    createTime: '2026-02-24 16:30:00'
  },
  {
    id: 3,
    title: '系统性能预警',
    type: 'system_performance',
    typeName: '系统性能',
    level: 'high',
    levelName: '高',
    content: '系统响应时间超过3秒,影响用户体验,需要优化系统性能。',
    target: '系统',
    targetId: 0,
    warningTime: '2026-02-24 10:00:00',
    status: 'handled',
    statusName: '已处理',
    handleTime: '2026-02-24 14:00:00',
    handler: '技术团队',
    handlerId: 2,
    handleRemark: '已优化数据库查询,响应时间恢复正常',
    createTime: '2026-02-24 10:00:00'
  },
  {
    id: 4,
    title: '数据安全预警',
    type: 'data_security',
    typeName: '数据安全',
    level: 'urgent',
    levelName: '紧急',
    content: '检测到异常登录行为,可能存在安全风险,需要立即处理。',
    target: '系统',
    targetId: 0,
    warningTime: '2026-02-23 08:00:00',
    status: 'handled',
    statusName: '已处理',
    handleTime: '2026-02-23 09:00:00',
    handler: '安全团队',
    handlerId: 3,
    handleRemark: '已封禁异常IP,并加强安全防护',
    createTime: '2026-02-23 08:00:00'
  }
];

// 待办任务统计
const todoTaskStatistics = {
  total: 5,
  pending: 3,
  inProgress: 1,
  completed: 1,
  urgent: 1,
  high: 2
};

// 消息统计
const messageStatistics = {
  total: 4,
  unread: 2,
  read: 2,
  highPriority: 2
};

// 预警消息统计
const warningStatistics = {
  total: 4,
  unhandled: 1,
  handled: 3,
  urgent: 1,
  high: 2
};

// ==================== 工作中心API接口模拟 ====================

// 获取待办任务列表
Mock.mock('/api/v1/work-center/todos', 'get', (options) => {
  const urlParams = new URLSearchParams(options.url.split('?')[1]);
  const page = parseInt(urlParams.get('page')) || 1;
  const pageSize = parseInt(urlParams.get('pageSize')) || 10;
  const type = urlParams.get('type') || '';
  const priority = urlParams.get('priority') || '';
  const status = urlParams.get('status') || '';
  const keyword = urlParams.get('keyword') || '';

  let filteredTodos = [...workCenterTodos];

  if (type) {
    filteredTodos = filteredTodos.filter(todo => todo.type === type);
  }
  if (priority) {
    filteredTodos = filteredTodos.filter(todo => todo.priority === priority);
  }
  if (status) {
    filteredTodos = filteredTodos.filter(todo => todo.status === status);
  }
  if (keyword) {
    filteredTodos = filteredTodos.filter(todo =>
      todo.title.includes(keyword) || todo.content?.includes(keyword)
    );
  }

  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const list = filteredTodos.slice(start, end);

  return {
    code: 200,
    message: '获取成功',
    data: {
      list,
      total: filteredTodos.length,
      page,
      pageSize
    },
    timestamp: Date.now()
  };
});

// 获取待办任务详情
Mock.mock(/\/api\/v1\/work-center\/todos\/\d+/, 'get', (options) => {
  const id = parseInt(options.url.match(/\d+/)[0]);
  const todo = workCenterTodos.find(t => t.id === id);

  if (todo) {
    return {
      code: 200,
      message: '获取成功',
      data: todo,
      timestamp: Date.now()
    };
  }

  return {
    code: 404,
    message: '任务不存在',
    data: null,
    timestamp: Date.now()
  };
});

// 创建待办任务
Mock.mock('/api/v1/work-center/todos', 'post', (options) => {
  const data = JSON.parse(options.body);
  const newTodo = {
    id: Date.now(),
    ...data,
    typeName: data.type === 'tenant_audit' ? '租户审核' :
              data.type === 'warning_handle' ? '预警处理' :
              data.type === 'activity_audit' ? '活动审核' :
              data.type === 'complaint_handle' ? '投诉处理' : '佣金规则审核',
    priorityName: data.priority === 'urgent' ? '紧急' :
                  data.priority === 'high' ? '高' :
                  data.priority === 'medium' ? '中' : '低',
    statusName: data.status === 'pending' ? '待处理' :
                  data.status === 'in_progress' ? '处理中' :
                  data.status === 'completed' ? '已完成' : '已取消',
    createTime: new Date().toISOString().replace('T', ' ').substring(0, 19)
  };
  workCenterTodos.unshift(newTodo);

  return {
    code: 201,
    message: '创建成功',
    data: { id: newTodo.id },
    timestamp: Date.now()
  };
});

// 更新待办任务
Mock.mock(/\/api\/v1\/work-center\/todos\/\d+/, 'put', (options) => {
  const id = parseInt(options.url.match(/\d+/)[0]);
  const data = JSON.parse(options.body);
  const index = workCenterTodos.findIndex(t => t.id === id);

  if (index !== -1) {
    workCenterTodos[index] = {
      ...workCenterTodos[index],
      ...data,
      priorityName: data.priority === 'urgent' ? '紧急' :
                    data.priority === 'high' ? '高' :
                    data.priority === 'medium' ? '中' : '低',
      statusName: data.status === 'pending' ? '待处理' :
                    data.status === 'in_progress' ? '处理中' :
                    data.status === 'completed' ? '已完成' : '已取消',
      updateTime: new Date().toISOString().replace('T', ' ').substring(0, 19)
    };

    return {
      code: 200,
      message: '更新成功',
      data: null,
      timestamp: Date.now()
    };
  }

  return {
    code: 404,
    message: '任务不存在',
    data: null,
    timestamp: Date.now()
  };
});

// 删除待办任务
Mock.mock(/\/api\/v1\/work-center\/todos\/\d+/, 'delete', (options) => {
  const id = parseInt(options.url.match(/\d+/)[0]);
  const index = workCenterTodos.findIndex(t => t.id === id);

  if (index !== -1) {
    workCenterTodos.splice(index, 1);

    return {
      code: 200,
      message: '删除成功',
      data: null,
      timestamp: Date.now()
    };
  }

  return {
    code: 404,
    message: '任务不存在',
    data: null,
    timestamp: Date.now()
  };
});

// 批量删除待办任务
Mock.mock('/api/v1/work-center/todos/batch-delete', 'post', (options) => {
  const { ids } = JSON.parse(options.body);
  ids.forEach(id => {
    const index = workCenterTodos.findIndex(t => t.id === id);
    if (index !== -1) {
      workCenterTodos.splice(index, 1);
    }
  });

  return {
    code: 200,
    message: '批量删除成功',
    data: {
      successCount: ids.length,
      failureCount: 0,
      successIds: ids,
      failureIds: [],
      errors: []
    },
    timestamp: Date.now()
  };
});

// 更新待办任务状态
Mock.mock(/\/api\/v1\/work-center\/todos\/\d+\/status/, 'put', (options) => {
  const id = parseInt(options.url.match(/\d+/)[0]);
  const { status } = JSON.parse(options.body);
  const todo = workCenterTodos.find(t => t.id === id);

  if (todo) {
    todo.status = status;
    todo.statusName = status === 'pending' ? '待处理' :
                     status === 'in_progress' ? '处理中' :
                     status === 'completed' ? '已完成' : '已取消';
    todo.updateTime = new Date().toISOString().replace('T', ' ').substring(0, 19);

    return {
      code: 200,
      message: '更新成功',
      data: null,
      timestamp: Date.now()
    };
  }

  return {
    code: 404,
    message: '任务不存在',
    data: null,
    timestamp: Date.now()
  };
});

// 批量更新待办任务状态
Mock.mock('/api/v1/work-center/todos/batch-status', 'post', (options) => {
  const { ids, status } = JSON.parse(options.body);
  const statusName = status === 'pending' ? '待处理' :
                     status === 'in_progress' ? '处理中' :
                     status === 'completed' ? '已完成' : '已取消';

  ids.forEach(id => {
    const todo = workCenterTodos.find(t => t.id === id);
    if (todo) {
      todo.status = status;
      todo.statusName = statusName;
      todo.updateTime = new Date().toISOString().replace('T', ' ').substring(0, 19);
    }
  });

  return {
    code: 200,
    message: '批量更新成功',
    data: {
      successCount: ids.length,
      failureCount: 0,
      successIds: ids,
      failureIds: [],
      errors: []
    },
    timestamp: Date.now()
  };
});

// 分配待办任务
Mock.mock(/\/api\/v1\/work-center\/todos\/\d+\/assign/, 'put', () => {
  return {
    code: 200,
    message: '分配成功',
    data: null,
    timestamp: Date.now()
  };
});

// 获取待办任务统计
Mock.mock('/api/v1/work-center/todos/statistics', 'get', () => {
  return {
    code: 200,
    message: '获取成功',
    data: todoTaskStatistics,
    timestamp: Date.now()
  };
});

// 获取消息列表
Mock.mock('/api/v1/work-center/messages', 'get', (options) => {
  const urlParams = new URLSearchParams(options.url.split('?')[1]);
  const page = parseInt(urlParams.get('page')) || 1;
  const pageSize = parseInt(urlParams.get('pageSize')) || 10;
  const type = urlParams.get('type') || '';
  const status = urlParams.get('status') || '';
  const priority = urlParams.get('priority') || '';
  const keyword = urlParams.get('keyword') || '';

  let filteredMessages = [...workCenterMessages];

  if (type) {
    filteredMessages = filteredMessages.filter(msg => msg.type === type);
  }
  if (status) {
    filteredMessages = filteredMessages.filter(msg => msg.status === status);
  }
  if (priority) {
    filteredMessages = filteredMessages.filter(msg => msg.priority === priority);
  }
  if (keyword) {
    filteredMessages = filteredMessages.filter(msg =>
      msg.title.includes(keyword) || msg.content.includes(keyword)
    );
  }

  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const list = filteredMessages.slice(start, end);

  return {
    code: 200,
    message: '获取成功',
    data: {
      list,
      total: filteredMessages.length,
      page,
      pageSize
    },
    timestamp: Date.now()
  };
});

// 获取消息详情
Mock.mock(/\/api\/v1\/work-center\/messages\/\d+/, 'get', (options) => {
  const id = parseInt(options.url.match(/\d+/)[0]);
  const message = workCenterMessages.find(m => m.id === id);

  if (message) {
    return {
      code: 200,
      message: '获取成功',
      data: message,
      timestamp: Date.now()
    };
  }

  return {
    code: 404,
    message: '消息不存在',
    data: null,
    timestamp: Date.now()
  };
});

// 标记消息为已读
Mock.mock(/\/api\/v1\/work-center\/messages\/\d+\/read/, 'put', (options) => {
  const id = parseInt(options.url.match(/\d+/)[0]);
  const message = workCenterMessages.find(m => m.id === id);

  if (message) {
    message.status = 'read';
    message.statusName = '已读';
    message.readTime = new Date().toISOString().replace('T', ' ').substring(0, 19);
    message.updateTime = new Date().toISOString().replace('T', ' ').substring(0, 19);

    return {
      code: 200,
      message: '标记成功',
      data: null,
      timestamp: Date.now()
    };
  }

  return {
    code: 404,
    message: '消息不存在',
    data: null,
    timestamp: Date.now()
  };
});

// 批量标记消息为已读
Mock.mock('/api/v1/work-center/messages/batch-read', 'post', (options) => {
  const { ids } = JSON.parse(options.body);

  ids.forEach(id => {
    const message = workCenterMessages.find(m => m.id === id);
    if (message) {
      message.status = 'read';
      message.statusName = '已读';
      message.readTime = new Date().toISOString().replace('T', ' ').substring(0, 19);
      message.updateTime = new Date().toISOString().replace('T', ' ').substring(0, 19);
    }
  });

  return {
    code: 200,
    message: '批量标记成功',
    data: {
      successCount: ids.length,
      failureCount: 0,
      successIds: ids,
      failureIds: [],
      errors: []
    },
    timestamp: Date.now()
  };
});

// 标记消息为未读
Mock.mock(/\/api\/v1\/work-center\/messages\/\d+\/unread/, 'put', (options) => {
  const id = parseInt(options.url.match(/\d+/)[0]);
  const message = workCenterMessages.find(m => m.id === id);

  if (message) {
    message.status = 'unread';
    message.statusName = '未读';
    message.readTime = null;
    message.updateTime = new Date().toISOString().replace('T', ' ').substring(0, 19);

    return {
      code: 200,
      message: '标记成功',
      data: null,
      timestamp: Date.now()
    };
  }

  return {
    code: 404,
    message: '消息不存在',
    data: null,
    timestamp: Date.now()
  };
});

// 删除消息
Mock.mock(/\/api\/v1\/work-center\/messages\/\d+/, 'delete', (options) => {
  const id = parseInt(options.url.match(/\d+/)[0]);
  const index = workCenterMessages.findIndex(m => m.id === id);

  if (index !== -1) {
    workCenterMessages.splice(index, 1);

    return {
      code: 200,
      message: '删除成功',
      data: null,
      timestamp: Date.now()
    };
  }

  return {
    code: 404,
    message: '消息不存在',
    data: null,
    timestamp: Date.now()
  };
});

// ==================== 审批执行Mock数据 ====================

// 模拟业务审批状态数据
const businessApprovalStatuses = [];

// 模拟审批记录数据
const approvalRecords = [];

// 模拟待办任务数据
const todoTasks = [];

// 初始化一些模拟数据
const initApprovalExecutionMockData = () => {
  // 创建一些业务审批状态
  for (let i = 1; i <= 10; i++) {
    const businessCode = ['LEAVE', 'TRANSFER', 'RESIGNATION', 'REGISTRATION'][i % 4];
    const status = ['PENDING', 'IN_PROGRESS', 'APPROVED', 'REJECTED', 'CANCELLED'][i % 5];

    businessApprovalStatuses.push({
      id: i,
      businessCode: businessCode,
      businessId: i,
      flowId: 1,
      flowName: '请假审批流程',
      currentNodeId: status === 'IN_PROGRESS' ? 1 : null,
      currentNodeName: status === 'IN_PROGRESS' ? '部门主管审批' : null,
      approvalStatus: status,
      submitterId: 1,
      submitterName: '张三',
      submitTime: '2026-02-26 10:00:00',
      completeTime: status === 'APPROVED' || status === 'REJECTED' || status === 'CANCELLED' ? '2026-02-26 14:00:00' : null,
      totalNodes: 3,
      currentNodeOrder: status === 'IN_PROGRESS' ? 1 : null,
      rejectReason: status === 'REJECTED' ? '不符合审批条件' : null,
      cancelReason: status === 'CANCELLED' ? '申请人主动取消' : null,
      tenantId: 1,
      createTime: '2026-02-26 10:00:00',
      updateTime: '2026-02-26 10:00:00',
      createBy: 'admin',
      updateBy: 'admin',
      remark: ''
    });

    // 为每个业务创建审批记录
    if (status !== 'PENDING' && status !== 'CANCELLED') {
      const recordCount = status === 'IN_PROGRESS' ? 1 : (status === 'APPROVED' ? 3 : 2);
      for (let j = 1; j <= recordCount; j++) {
        const isCurrent = j === recordCount && status === 'IN_PROGRESS';
        const result = isCurrent ? 'PENDING' : (j < recordCount ? 'APPROVED' : status);

        approvalRecords.push({
          id: approvalRecords.length + 1,
          businessCode: businessCode,
          businessId: i,
          flowId: 1,
          flowName: '请假审批流程',
          nodeId: j,
          nodeName: ['部门主管审批', '人事审批', '总经理审批'][j - 1],
          approverId: 1,
          approverName: '李四',
          approverDept: '人事部',
          approvalResult: result,
          approvalComment: result === 'APPROVED' ? '同意' : (result === 'REJECTED' ? '不同意' : ''),
          approvalTime: result !== 'PENDING' ? '2026-02-26 12:00:00' : null,
          transferToId: null,
          transferToName: null,
          delegateToId: null,
          delegateToName: null,
          attachmentIds: null,
          isCurrent: isCurrent ? 1 : 0,
          tenantId: 1,
          createTime: '2026-02-26 10:00:00',
          updateTime: '2026-02-26 12:00:00',
          createBy: 'admin',
          updateBy: 'admin',
          remark: ''
        });
      }
    }
  }

  // 创建一些待办任务
  for (let i = 1; i <= 5; i++) {
    todoTasks.push({
      id: i,
      taskType: 'APPROVAL',
      taskTitle: '请假审批',
      taskContent: '张三提交的请假申请需要审批',
      taskSource: 'LEAVE',
      businessCode: 'LEAVE',
      businessId: i,
      taskStatus: 'PENDING',
      priority: 'NORMAL',
      assigneeId: 1,
      assigneeName: '李四',
      assigneeDept: '人事部',
      senderId: 1,
      senderName: '张三',
      dueDate: '2026-02-28 18:00:00',
      completeTime: null,
      readStatus: 0,
      readTime: null,
      approvalRecordId: i,
      taskUrl: '/leave/approval/' + i,
      attachmentIds: null,
      tenantId: 1,
      createTime: '2026-02-26 10:00:00',
      updateTime: '2026-02-26 10:00:00',
      createBy: 'admin',
      updateBy: 'admin',
      remark: ''
    });
  }
};

// 初始化Mock数据
initApprovalExecutionMockData();

// ==================== 审批执行API接口模拟 ====================

// 提交审批
Mock.mock('/api/v1/approvals/submit', 'post', (options) => {
  const data = JSON.parse(options.body);
  const { businessCode, businessId, submitterId, submitterName } = data;

  // 检查是否已经提交过审批
  const existing = businessApprovalStatuses.find(
    item => item.businessCode === businessCode && item.businessId === businessId
  );
  if (existing) {
    return {
      code: 400,
      message: '该业务已提交审批，请勿重复提交',
      data: null,
      timestamp: Date.now()
    };
  }

  // 创建业务审批状态
  const newStatus = {
    id: businessApprovalStatuses.length + 1,
    businessCode: businessCode,
    businessId: businessId,
    flowId: 1,
    flowName: '请假审批流程',
    currentNodeId: 1,
    currentNodeName: '部门主管审批',
    approvalStatus: 'IN_PROGRESS',
    submitterId: submitterId,
    submitterName: submitterName,
    submitTime: new Date().toISOString().replace('T', ' ').substring(0, 19),
    completeTime: null,
    totalNodes: 3,
    currentNodeOrder: 1,
    rejectReason: null,
    cancelReason: null,
    tenantId: 1,
    createTime: new Date().toISOString().replace('T', ' ').substring(0, 19),
    updateTime: new Date().toISOString().replace('T', ' ').substring(0, 19),
    createBy: submitterName,
    updateBy: submitterName,
    remark: ''
  };
  businessApprovalStatuses.push(newStatus);

  // 创建第一个节点的审批记录
  const newRecord = {
    id: approvalRecords.length + 1,
    businessCode: businessCode,
    businessId: businessId,
    flowId: 1,
    flowName: '请假审批流程',
    nodeId: 1,
    nodeName: '部门主管审批',
    approverId: 1,
    approverName: '李四',
    approverDept: '人事部',
    approvalResult: 'PENDING',
    approvalComment: '',
    approvalTime: null,
    transferToId: null,
    transferToName: null,
    delegateToId: null,
    delegateToName: null,
    attachmentIds: null,
    isCurrent: 1,
    tenantId: 1,
    createTime: new Date().toISOString().replace('T', ' ').substring(0, 19),
    updateTime: new Date().toISOString().replace('T', ' ').substring(0, 19),
    createBy: submitterName,
    updateBy: submitterName,
    remark: ''
  };
  approvalRecords.push(newRecord);

  // 创建待办任务
  const newTask = {
    id: todoTasks.length + 1,
    taskType: 'APPROVAL',
    taskTitle: '请假审批',
    taskContent: `${submitterName}提交的请假申请需要审批`,
    taskSource: businessCode,
    businessCode: businessCode,
    businessId: businessId,
    taskStatus: 'PENDING',
    priority: 'NORMAL',
    assigneeId: 1,
    assigneeName: '李四',
    assigneeDept: '人事部',
    senderId: submitterId,
    senderName: submitterName,
    dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().replace('T', ' ').substring(0, 19),
    completeTime: null,
    readStatus: 0,
    readTime: null,
    approvalRecordId: newRecord.id,
    taskUrl: `/${businessCode.toLowerCase()}/approval/${businessId}`,
    attachmentIds: null,
    tenantId: 1,
    createTime: new Date().toISOString().replace('T', ' ').substring(0, 19),
    updateTime: new Date().toISOString().replace('T', ' ').substring(0, 19),
    createBy: submitterName,
    updateBy: submitterName,
    remark: ''
  };
  todoTasks.push(newTask);

  return {
    code: 200,
    message: '提交成功',
    data: {
      approvalId: newStatus.id,
      currentNode: '部门主管审批',
      currentNodeId: 1
    },
    timestamp: Date.now()
  };
});

// 审批通过
Mock.mock(/\/api\/v1\/approvals\/\d+\/approve/, 'post', (options) => {
  const approvalId = parseInt(options.url.match(/\d+/)[0]);
  const data = JSON.parse(options.body);
  const { nodeId, approverId, approverName, approvalComment } = data;

  // 查找审批状态
  const status = businessApprovalStatuses.find(item => item.id === approvalId);
  if (!status) {
    return {
      code: 404,
      message: '审批不存在',
      data: null,
      timestamp: Date.now()
    };
  }

  // 查找审批记录
  const record = approvalRecords.find(
    item => item.businessCode === status.businessCode &&
           item.businessId === status.businessId &&
           item.nodeId === nodeId
  );
  if (!record) {
    return {
      code: 404,
      message: '审批记录不存在',
      data: null,
      timestamp: Date.now()
    };
  }

  // 更新审批记录
  record.approvalResult = 'APPROVED';
  record.approvalComment = approvalComment || '同意';
  record.approvalTime = new Date().toISOString().replace('T', ' ').substring(0, 19);
  record.isCurrent = 0;
  record.updateBy = approverName;

  // 检查是否还有下一个节点
  const nextNode = nodeId + 1;
  const isLastNode = nextNode > status.totalNodes;

  if (isLastNode) {
    // 最后一个节点，完成审批流程
    status.approvalStatus = 'APPROVED';
    status.completeTime = new Date().toISOString().replace('T', ' ').substring(0, 19);
    status.currentNodeId = null;
    status.currentNodeName = null;
    status.currentNodeOrder = null;
    status.updateBy = approverName;

    // 完成待办任务
    const task = todoTasks.find(
      item => item.businessCode === status.businessCode &&
             item.businessId === status.businessId &&
             item.taskStatus === 'PENDING'
    );
    if (task) {
      task.taskStatus = 'COMPLETED';
      task.completeTime = new Date().toISOString().replace('T', ' ').substring(0, 19);
      task.updateBy = approverName;
    }
  } else {
    // 进入下一个节点
    status.currentNodeId = nextNode;
    status.currentNodeName = ['部门主管审批', '人事审批', '总经理审批'][nextNode - 1];
    status.currentNodeOrder = nextNode;
    status.updateBy = approverName;

    // 创建下一个节点的审批记录
    const nextRecord = {
      id: approvalRecords.length + 1,
      businessCode: status.businessCode,
      businessId: status.businessId,
      flowId: status.flowId,
      flowName: status.flowName,
      nodeId: nextNode,
      nodeName: status.currentNodeName,
      approverId: 1,
      approverName: '王五',
      approverDept: '人事部',
      approvalResult: 'PENDING',
      approvalComment: '',
      approvalTime: null,
      transferToId: null,
      transferToName: null,
      delegateToId: null,
      delegateToName: null,
      attachmentIds: null,
      isCurrent: 1,
      tenantId: status.tenantId,
      createTime: new Date().toISOString().replace('T', ' ').substring(0, 19),
      updateTime: new Date().toISOString().replace('T', ' ').substring(0, 19),
      createBy: approverName,
      updateBy: approverName,
      remark: ''
    };
    approvalRecords.push(nextRecord);

    // 创建下一个节点的待办任务
    const nextTask = {
      id: todoTasks.length + 1,
      taskType: 'APPROVAL',
      taskTitle: '请假审批',
      taskContent: `${status.submitterName}提交的请假申请需要审批`,
      taskSource: status.businessCode,
      businessCode: status.businessCode,
      businessId: status.businessId,
      taskStatus: 'PENDING',
      priority: 'NORMAL',
      assigneeId: 1,
      assigneeName: '王五',
      assigneeDept: '人事部',
      senderId: status.submitterId,
      senderName: status.submitterName,
      dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().replace('T', ' ').substring(0, 19),
      completeTime: null,
      readStatus: 0,
      readTime: null,
      approvalRecordId: nextRecord.id,
      taskUrl: `/${status.businessCode.toLowerCase()}/approval/${status.businessId}`,
      attachmentIds: null,
      tenantId: status.tenantId,
      createTime: new Date().toISOString().replace('T', ' ').substring(0, 19),
      updateTime: new Date().toISOString().replace('T', ' ').substring(0, 19),
      createBy: approverName,
      updateBy: approverName,
      remark: ''
    };
    todoTasks.push(nextTask);

    // 完成当前待办任务
    const currentTask = todoTasks.find(
      item => item.businessCode === status.businessCode &&
             item.businessId === status.businessId &&
             item.taskStatus === 'PENDING' &&
             item.approvalRecordId === record.id
    );
    if (currentTask) {
      currentTask.taskStatus = 'COMPLETED';
      currentTask.completeTime = new Date().toISOString().replace('T', ' ').substring(0, 19);
      currentTask.updateBy = approverName;
    }
  }

  return {
    code: 200,
    message: '审批通过',
    data: {
      nextNode: isLastNode ? null : status.currentNodeName,
      nextNodeId: isLastNode ? null : nextNode,
      isCompleted: isLastNode,
      approvalStatus: status
    },
    timestamp: Date.now()
  };
});

// 审批驳回
Mock.mock(/\/api\/v1\/approvals\/\d+\/reject/, 'post', (options) => {
  const approvalId = parseInt(options.url.match(/\d+/)[0]);
  const data = JSON.parse(options.body);
  const { nodeId, approverId, approverName, approvalComment } = data;

  // 查找审批状态
  const status = businessApprovalStatuses.find(item => item.id === approvalId);
  if (!status) {
    return {
      code: 404,
      message: '审批不存在',
      data: null,
      timestamp: Date.now()
    };
  }

  // 查找审批记录
  const record = approvalRecords.find(
    item => item.businessCode === status.businessCode &&
           item.businessId === status.businessId &&
           item.nodeId === nodeId
  );
  if (!record) {
    return {
      code: 404,
      message: '审批记录不存在',
      data: null,
      timestamp: Date.now()
    };
  }

  // 更新审批记录
  record.approvalResult = 'REJECTED';
  record.approvalComment = approvalComment || '不同意';
  record.approvalTime = new Date().toISOString().replace('T', ' ').substring(0, 19);
  record.isCurrent = 0;
  record.updateBy = approverName;

  // 更新审批状态
  status.approvalStatus = 'REJECTED';
  status.completeTime = new Date().toISOString().replace('T', ' ').substring(0, 19);
  status.currentNodeId = null;
  status.currentNodeName = null;
  status.currentNodeOrder = null;
  status.rejectReason = approvalComment || '不同意';
  status.updateBy = approverName;

  // 完成待办任务
  const task = todoTasks.find(
    item => item.businessCode === status.businessCode &&
           item.businessId === status.businessId &&
           item.taskStatus === 'PENDING'
  );
  if (task) {
    task.taskStatus = 'CANCELLED';
    task.completeTime = new Date().toISOString().replace('T', ' ').substring(0, 19);
    task.updateBy = approverName;
  }

  return {
    code: 200,
    message: '审批驳回',
    data: {
      nextNode: null,
      nextNodeId: null,
      isCompleted: true,
      approvalStatus: status
    },
    timestamp: Date.now()
  };
});

// 查询审批状态
Mock.mock('/api/v1/approvals/status', 'get', (options) => {
  const urlParams = new URLSearchParams(options.url.split('?')[1]);
  const businessId = urlParams.get('businessId');
  const businessCode = urlParams.get('businessCode');

  const status = businessApprovalStatuses.find(
    item => item.businessCode === businessCode && item.businessId === parseInt(businessId)
  );

  if (!status) {
    return {
      code: 404,
      message: '未找到审批状态',
      data: null,
      timestamp: Date.now()
    };
  }

  return {
    code: 200,
    message: 'success',
    data: status,
    timestamp: Date.now()
  };
});

// 查询审批记录
Mock.mock('/api/v1/approvals/records', 'get', (options) => {
  const urlParams = new URLSearchParams(options.url.split('?')[1]);
  const { businessId, businessCode, page = 1, pageSize = 10, approvalResult, approverId } = Object.fromEntries(urlParams);

  let filteredList = [...approvalRecords];

  // 按业务代码和业务ID筛选
  if (businessCode) {
    filteredList = filteredList.filter(item => item.businessCode === businessCode);
  }
  if (businessId) {
    filteredList = filteredList.filter(item => item.businessId === parseInt(businessId));
  }

  // 按审批结果筛选
  if (approvalResult) {
    filteredList = filteredList.filter(item => item.approvalResult === approvalResult);
  }

  // 按审批人筛选
  if (approverId) {
    filteredList = filteredList.filter(item => item.approverId === parseInt(approverId));
  }

  // 分页
  const start = (page - 1) * pageSize;
  const end = start + parseInt(pageSize);
  const list = filteredList.slice(start, end);

  return {
    code: 200,
    message: 'success',
    data: {
      list,
      total: filteredList.length,
      page: parseInt(page),
      pageSize: parseInt(pageSize)
    },
    timestamp: Date.now()
  };
});

// 撤回审批
Mock.mock(/\/api\/v1\/approvals\/\d+\/withdraw/, 'post', (options) => {
  const approvalId = parseInt(options.url.match(/\d+/)[0]);
  const data = JSON.parse(options.body);
  const { userId, userName, cancelReason } = data;

  // 查找审批状态
  const status = businessApprovalStatuses.find(item => item.id === approvalId);
  if (!status) {
    return {
      code: 404,
      message: '审批不存在',
      data: null,
      timestamp: Date.now()
    };
  }

  // 验证申请人权限
  if (status.submitterId !== userId) {
    return {
      code: 403,
      message: '只有申请人才能撤回审批',
      data: null,
      timestamp: Date.now()
    };
  }

  // 验证审批状态
  if (status.approvalStatus !== 'IN_PROGRESS') {
    return {
      code: 400,
      message: '只有审批中的申请才能撤回',
      data: null,
      timestamp: Date.now()
    };
  }

  // 更新审批状态
  status.approvalStatus = 'CANCELLED';
  status.completeTime = new Date().toISOString().replace('T', ' ').substring(0, 19);
  status.currentNodeId = null;
  status.currentNodeName = null;
  status.currentNodeOrder = null;
  status.cancelReason = cancelReason || '申请人撤回';
  status.updateBy = userName;

  // 取消待办任务
  const tasks = todoTasks.filter(
    item => item.businessCode === status.businessCode &&
           item.businessId === status.businessId &&
           item.taskStatus === 'PENDING'
  );
  tasks.forEach(task => {
    task.taskStatus = 'CANCELLED';
    task.completeTime = new Date().toISOString().replace('T', ' ').substring(0, 19);
    task.updateBy = userName;
  });

  return {
    code: 200,
    message: '撤回成功',
    data: null,
    timestamp: Date.now()
  };
});

// 获取我的待办审批列表
Mock.mock('/api/v1/approvals/my-tasks', 'get', (options) => {
  const urlParams = new URLSearchParams(options.url.split('?')[1]);
  const { page = 1, pageSize = 10, taskStatus } = Object.fromEntries(urlParams);

  let filteredList = [...todoTasks];

  // 按任务状态筛选
  if (taskStatus) {
    filteredList = filteredList.filter(item => item.taskStatus === taskStatus);
  }

  // 分页
  const start = (page - 1) * pageSize;
  const end = start + parseInt(pageSize);
  const list = filteredList.slice(start, end);

  return {
    code: 200,
    message: 'success',
    data: {
      list,
      total: filteredList.length,
      page: parseInt(page),
      pageSize: parseInt(pageSize)
    },
    timestamp: Date.now()
  };
});

// 获取我提交的审批列表
Mock.mock('/api/v1/approvals/my-submissions', 'get', (options) => {
  const urlParams = new URLSearchParams(options.url.split('?')[1]);
  const { page = 1, pageSize = 10, approvalStatus } = Object.fromEntries(urlParams);

  let filteredList = [...businessApprovalStatuses];

  // 按审批状态筛选
  if (approvalStatus) {
    filteredList = filteredList.filter(item => item.approvalStatus === approvalStatus);
  }

  // 分页
  const start = (page - 1) * pageSize;
  const end = start + parseInt(pageSize);
  const list = filteredList.slice(start, end);

  return {
    code: 200,
    message: 'success',
    data: {
      list,
      total: filteredList.length,
      page: parseInt(page),
      pageSize: parseInt(pageSize)
    },
    timestamp: Date.now()
  };
});

// 获取审批详情
Mock.mock(/\/api\/v1\/approvals\/\d+/, 'get', (options) => {
  const approvalId = parseInt(options.url.match(/\d+/)[0]);

  const status = businessApprovalStatuses.find(item => item.id === approvalId);

  if (!status) {
    return {
      code: 404,
      message: '审批不存在',
      data: null,
      timestamp: Date.now()
    };
  }

  // 获取审批记录
  const records = approvalRecords.filter(
    item => item.businessCode === status.businessCode && item.businessId === status.businessId
  );

  return {
    code: 200,
    message: 'success',
    data: {
      ...status,
      records
    },
    timestamp: Date.now()
  };
});

// 批量删除消息
Mock.mock('/api/v1/work-center/messages/batch-delete', 'post', (options) => {
  const { ids } = JSON.parse(options.body);
  ids.forEach(id => {
    const index = workCenterMessages.findIndex(m => m.id === id);
    if (index !== -1) {
      workCenterMessages.splice(index, 1);
    }
  });

  return {
    code: 200,
    message: '批量删除成功',
    data: {
      successCount: ids.length,
      failureCount: 0,
      successIds: ids,
      failureIds: [],
      errors: []
    },
    timestamp: Date.now()
  };
});

// 全部标记为已读
Mock.mock('/api/v1/work-center/messages/mark-all-read', 'put', () => {
  workCenterMessages.forEach(message => {
    message.status = 'read';
    message.statusName = '已读';
    message.readTime = new Date().toISOString().replace('T', ' ').substring(0, 19);
    message.updateTime = new Date().toISOString().replace('T', ' ').substring(0, 19);
  });

  return {
    code: 200,
    message: '全部标记成功',
    data: null,
    timestamp: Date.now()
  };
});

// 获取消息统计
Mock.mock('/api/v1/work-center/messages/statistics', 'get', () => {
  return {
    code: 200,
    message: '获取成功',
    data: messageStatistics,
    timestamp: Date.now()
  };
});

// 获取预警消息列表
Mock.mock('/api/v1/work-center/warnings', 'get', (options) => {
  const urlParams = new URLSearchParams(options.url.split('?')[1]);
  const page = parseInt(urlParams.get('page')) || 1;
  const pageSize = parseInt(urlParams.get('pageSize')) || 10;
  const type = urlParams.get('type') || '';
  const level = urlParams.get('level') || '';
  const status = urlParams.get('status') || '';
  const keyword = urlParams.get('keyword') || '';

  let filteredWarnings = [...workCenterWarnings];

  if (type) {
    filteredWarnings = filteredWarnings.filter(warning => warning.type === type);
  }
  if (level) {
    filteredWarnings = filteredWarnings.filter(warning => warning.level === level);
  }
  if (status) {
    filteredWarnings = filteredWarnings.filter(warning => warning.status === status);
  }
  if (keyword) {
    filteredWarnings = filteredWarnings.filter(warning =>
      warning.title.includes(keyword) || warning.content.includes(keyword)
    );
  }

  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const list = filteredWarnings.slice(start, end);

  return {
    code: 200,
    message: '获取成功',
    data: {
      list,
      total: filteredWarnings.length,
      page,
      pageSize
    },
    timestamp: Date.now()
  };
});

// 获取预警消息详情
Mock.mock(/\/api\/v1\/work-center\/warnings\/\d+/, 'get', (options) => {
  const id = parseInt(options.url.match(/\d+/)[0]);
  const warning = workCenterWarnings.find(w => w.id === id);

  if (warning) {
    return {
      code: 200,
      message: '获取成功',
      data: warning,
      timestamp: Date.now()
    };
  }

  return {
    code: 404,
    message: '预警消息不存在',
    data: null,
    timestamp: Date.now()
  };
});

// 处理预警消息
Mock.mock(/\/api\/v1\/work-center\/warnings\/\d+\/handle/, 'put', (options) => {
  const id = parseInt(options.url.match(/\d+/)[0]);
  const { status, handleRemark } = JSON.parse(options.body);
  const warning = workCenterWarnings.find(w => w.id === id);

  if (warning) {
    warning.status = status;
    warning.statusName = status === 'unhandled' ? '未处理' :
                       status === 'handled' ? '已处理' : '已忽略';
    warning.handleTime = new Date().toISOString().replace('T', ' ').substring(0, 19);
    warning.handleRemark = handleRemark;
    warning.updateTime = new Date().toISOString().replace('T', ' ').substring(0, 19);

    return {
      code: 200,
      message: '处理成功',
      data: null,
      timestamp: Date.now()
    };
  }

  return {
    code: 404,
    message: '预警消息不存在',
    data: null,
    timestamp: Date.now()
  };
});

// 批量处理预警消息
Mock.mock('/api/v1/work-center/warnings/batch-handle', 'post', (options) => {
  const { ids, status, handleRemark } = JSON.parse(options.body);
  const statusName = status === 'unhandled' ? '未处理' :
                     status === 'handled' ? '已处理' : '已忽略';

  ids.forEach(id => {
    const warning = workCenterWarnings.find(w => w.id === id);
    if (warning) {
      warning.status = status;
      warning.statusName = statusName;
      warning.handleTime = new Date().toISOString().replace('T', ' ').substring(0, 19);
      warning.handleRemark = handleRemark;
      warning.updateTime = new Date().toISOString().replace('T', ' ').substring(0, 19);
    }
  });

  return {
    code: 200,
    message: '批量处理成功',
    data: {
      successCount: ids.length,
      failureCount: 0,
      successIds: ids,
      failureIds: [],
      errors: []
    },
    timestamp: Date.now()
  };
});

// 忽略预警消息
Mock.mock(/\/api\/v1\/work-center\/warnings\/\d+\/ignore/, 'put', (options) => {
  const id = parseInt(options.url.match(/\d+/)[0]);
  const warning = workCenterWarnings.find(w => w.id === id);

  if (warning) {
    warning.status = 'ignored';
    warning.statusName = '已忽略';
    warning.handleTime = new Date().toISOString().replace('T', ' ').substring(0, 19);
    warning.updateTime = new Date().toISOString().replace('T', ' ').substring(0, 19);

    return {
      code: 200,
      message: '忽略成功',
      data: null,
      timestamp: Date.now()
    };
  }

  return {
    code: 404,
    message: '预警消息不存在',
    data: null,
    timestamp: Date.now()
  };
});

// 批量忽略预警消息
Mock.mock('/api/v1/work-center/warnings/batch-ignore', 'post', (options) => {
  const { ids } = JSON.parse(options.body);

  ids.forEach(id => {
    const warning = workCenterWarnings.find(w => w.id === id);
    if (warning) {
      warning.status = 'ignored';
      warning.statusName = '已忽略';
      warning.handleTime = new Date().toISOString().replace('T', ' ').substring(0, 19);
      warning.updateTime = new Date().toISOString().replace('T', ' ').substring(0, 19);
    }
  });

  return {
    code: 200,
    message: '批量忽略成功',
    data: {
      successCount: ids.length,
      failureCount: 0,
      successIds: ids,
      failureIds: [],
      errors: []
    },
    timestamp: Date.now()
  };
});

// 删除预警消息
Mock.mock(/\/api\/v1\/work-center\/warnings\/\d+/, 'delete', (options) => {
  const id = parseInt(options.url.match(/\d+/)[0]);
  const index = workCenterWarnings.findIndex(w => w.id === id);

  if (index !== -1) {
    workCenterWarnings.splice(index, 1);

    return {
      code: 200,
      message: '删除成功',
      data: null,
      timestamp: Date.now()
    };
  }

  return {
    code: 404,
    message: '预警消息不存在',
    data: null,
    timestamp: Date.now()
  };
});

// 批量删除预警消息
Mock.mock('/api/v1/work-center/warnings/batch-delete', 'post', (options) => {
  const { ids } = JSON.parse(options.body);
  ids.forEach(id => {
    const index = workCenterWarnings.findIndex(w => w.id === id);
    if (index !== -1) {
      workCenterWarnings.splice(index, 1);
    }
  });

  return {
    code: 200,
    message: '批量删除成功',
    data: {
      successCount: ids.length,
      failureCount: 0,
      successIds: ids,
      failureIds: [],
      errors: []
    },
    timestamp: Date.now()
  };
});

// 获取预警消息统计
Mock.mock('/api/v1/work-center/warnings/statistics', 'get', () => {
  return {
    code: 200,
    message: '获取成功',
    data: warningStatistics,
    timestamp: Date.now()
  };
});

// ==================== 数据权限Mock数据 ====================

// 模拟部门树结构
const dataPermissionDepartmentTree = [
  {
    id: '1',
    name: '蓝领智汇总部',
    parentId: '',
    code: 'HQ',
    level: 1,
    children: [
      {
        id: '1-1',
        name: '技术研发部',
        parentId: '1',
        code: 'TECH',
        level: 2,
        children: [
          {
            id: '1-1-1',
            name: '前端开发组',
            parentId: '1-1',
            code: 'FE',
            level: 3
          },
          {
            id: '1-1-2',
            name: '后端开发组',
            parentId: '1-1',
            code: 'BE',
            level: 3
          },
          {
            id: '1-1-3',
            name: '测试组',
            parentId: '1-1',
            code: 'QA',
            level: 3
          }
        ]
      },
      {
        id: '1-2',
        name: '人力资源部',
        parentId: '1',
        code: 'HR',
        level: 2,
        children: [
          {
            id: '1-2-1',
            name: '招聘组',
            parentId: '1-2',
            code: 'HR-REC',
            level: 3
          },
          {
            id: '1-2-2',
            name: '培训组',
            parentId: '1-2',
            code: 'HR-TRN',
            level: 3
          }
        ]
      },
      {
        id: '1-3',
        name: '财务部',
        parentId: '1',
        code: 'FIN',
        level: 2
      },
      {
        id: '1-4',
        name: '市场部',
        parentId: '1',
        code: 'MKT',
        level: 2
      },
      {
        id: '1-5',
        name: '运营部',
        parentId: '1',
        code: 'OPS',
        level: 2
      }
    ]
  }
];

// 模拟用户数据权限信息
const userDataPermission = {
  userId: 'user001',
  username: '张三',
  departmentId: '1-2',
  departmentName: '人力资源部',
  positionId: 'pos001',
  positionName: '人事专员',
  dataPermission: {
    type: 'DEPARTMENT',
    includeCreator: false,
    includeManager: false,
    includeContact: false
  },
  isAdmin: false
};

// 模拟数据权限申请记录
const permissionApplications = Mock.mock({
  'list|10': [{
    'id|+1': 'app001',
    'applicantId': '@pick(["user001", "user002", "user003"])',
    'applicantName': '@cname',
    'permissionType': '@pick(["ALL", "DEPARTMENT_AND_BELOW", "CUSTOM"])',
    'departments|1-3': ['1', '1-1', '1-2'],
    'reason': '@csentence(10, 30)',
    'status': '@pick(["pending", "approved", "rejected"])',
    'approverId|1': ['@pick(["admin001", "admin002"])', null],
    'approverName|1': ['@pick(["管理员A", "管理员B"])', null],
    'approvalTime|1': ['@datetime', null],
    'approvalComment|1': ['@csentence(5, 20)', null],
    'createdAt': '@datetime'
  }]
}).list;

// 获取用户数据权限
Mock.mock('/api/v1/data-permission/user', 'get', () => {
  return {
    code: 200,
    message: 'success',
    data: userDataPermission,
    timestamp: Date.now()
  };
});

// 获取部门树结构
Mock.mock('/api/v1/data-permission/departments/tree', 'get', () => {
  return {
    code: 200,
    message: 'success',
    data: dataPermissionDepartmentTree,
    timestamp: Date.now()
  };
});

// 更新数据权限配置
Mock.mock('/api/v1/data-permission/update', 'put', (options) => {
  const data = JSON.parse(options.body);
  userDataPermission.dataPermission = {
    ...userDataPermission.dataPermission,
    ...data
  };
  return {
    code: 200,
    message: '更新成功',
    data: userDataPermission.dataPermission,
    timestamp: Date.now()
  };
});

// 申请数据权限
Mock.mock('/api/v1/data-permission/apply', 'post', (options) => {
  const data = JSON.parse(options.body);
  const newApplication = {
    id: `app${Date.now()}`,
    applicantId: userDataPermission.userId,
    applicantName: userDataPermission.username,
    ...data,
    status: 'pending',
    createdAt: new Date().toISOString()
  };
  permissionApplications.unshift(newApplication);
  return {
    code: 200,
    message: '申请已提交',
    data: newApplication,
    timestamp: Date.now()
  };
});

// 获取申请记录
Mock.mock('/api/v1/data-permission/applications', 'get', (options) => {
  const urlParams = new URLSearchParams(options.url.split('?')[1]);
  const page = parseInt(urlParams.get('page')) || 1;
  const pageSize = parseInt(urlParams.get('pageSize')) || 10;
  const status = urlParams.get('status') || '';
  
  let filteredList = [...permissionApplications];

  if (status) {
    filteredList = filteredList.filter(item => item.status === status);
  }

  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const list = filteredList.slice(start, end);

  return {
    code: 200,
    message: 'success',
    data: {
      list,
      total: filteredList.length,
      page,
      pageSize
    },
    timestamp: Date.now()
  };
});

// 审批数据权限申请
Mock.mock(/\/api\/v1\/data-permission\/applications\/[^/]+\/approve/, 'post', (options) => {
  const applicationId = options.url.match(/applications\/([^/]+)/)[1];
  const { approved, comment } = JSON.parse(options.body);
  const index = permissionApplications.findIndex(item => item.id === applicationId);

  if (index !== -1) {
    permissionApplications[index].status = approved ? 'approved' : 'rejected';
    permissionApplications[index].approverId = 'admin001';
    permissionApplications[index].approverName = '管理员A';
    permissionApplications[index].approvalTime = new Date().toISOString();
    permissionApplications[index].approvalComment = comment;
  }

  return {
    code: 200,
    message: approved ? '审批通过' : '审批驳回',
    data: permissionApplications[index],
    timestamp: Date.now()
  };
});

// 撤销数据权限申请
Mock.mock(/\/api\/v1\/data-permission\/applications\/[^/]+\/withdraw/, 'post', (options) => {
  const applicationId = options.url.match(/applications\/([^/]+)/)[1];
  const index = permissionApplications.findIndex(item => item.id === applicationId);

  if (index !== -1 && permissionApplications[index].status === 'pending') {
    permissionApplications[index].status = 'withdrawn';
  }

  return {
    code: 200,
    message: '申请已撤销',
    data: null,
    timestamp: Date.now()
  };
});

// 获取数据权限统计信息
Mock.mock('/api/v1/data-permission/statistics', 'get', () => {
  return {
    code: 200,
    message: 'success',
    data: {
      totalUsers: 100,
      permissionTypeDistribution: {
        ALL: 5,
        DEPARTMENT: 45,
        DEPARTMENT_AND_BELOW: 30,
        SELF: 15,
        CUSTOM: 5
      },
      pendingApplications: 3,
      approvedApplications: 25,
      rejectedApplications: 2
    },
    timestamp: Date.now()
  };
});