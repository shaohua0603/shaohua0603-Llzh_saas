import Mock from 'mockjs';

// 模拟数据配置
Mock.setup({
  timeout: '200-600'
});

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
  // 劳务公司用户
  {
    id: 2,
    phone: '13800138002',
    password: '123456',
    name: '李四',
    role: 'labor_company',
    avatar: defaultAvatar,
    laborCompany: '三鼎劳务有限公司',
    position: '招聘经理'
  },
  // 工厂用户
  {
    id: 3,
    phone: '13800138003',
    password: '123456',
    name: '王五',
    role: 'factory',
    avatar: defaultAvatar,
    factory: '富士康科技集团',
    position: '人事主管'
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
    type: 'labor_company',
    name: '基础版',
    price: 1999,
    maxUsers: 10,
    features: ['招聘管理', '工人管理', '考勤管理', '工资结算']
  },
  {
    id: 2,
    type: 'labor_company',
    name: '高级版',
    price: 3999,
    maxUsers: 30,
    features: ['招聘管理', '工人管理', '考勤管理', '工资结算', '培训管理', '福利管理']
  },
  {
    id: 3,
    type: 'factory',
    name: '标准版',
    price: 2999,
    maxUsers: 20,
    features: ['招聘需求发布', '面试管理', '工人管理', '奖励惩罚管理', '结算管理']
  },
  {
    id: 4,
    type: 'factory',
    name: '企业版',
    price: 5999,
    maxUsers: 50,
    features: ['招聘需求发布', '面试管理', '工人管理', '奖励惩罚管理', '结算管理', '业务课堂', '数据分析']
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
          ...(user.role === 'labor_company' && {
            laborCompany: user.laborCompany,
            position: user.position
          }),
          ...(user.role === 'factory' && {
            factory: user.factory,
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

// 导出Mock对象
if (typeof module !== 'undefined' && module.exports) {
  module.exports = Mock;
} else if (typeof window !== 'undefined') {
  // 浏览器环境
  window.Mock = Mock;
}