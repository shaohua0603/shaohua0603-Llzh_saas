import Mock from 'mockjs';

// 招聘需求Mock数据
const recruitmentRequirements = [
  {
    id: '1',
    title: '电子厂普工招聘',
    factoryId: '1',
    factoryName: '富士康科技集团',
    laborCompanyId: '1',
    laborCompanyName: '三鼎劳务有限公司',
    positionId: '1',
    positionName: '操作工',
    recruitCount: 50,
    salaryMin: 5000,
    salaryMax: 7000,
    salaryUnit: '元/月',
    workLocation: '深圳市龙华区',
    workTime: '8:00-20:00',
    jobRequirements: '<p>1. 18-45周岁，身体健康</p><p>2. 吃苦耐劳，服从安排</p><p>3. 无犯罪记录</p>',
    jobDescription: '<p>负责电子产品的组装、包装等工作</p><p>工作环境良好，提供食宿</p>',
    welfareBenefits: '<p>1. 包吃包住</p><p>2. 五险一金</p><p>3. 年终奖</p><p>4. 节日福利</p>',
    contactPerson: '张经理',
    contactPhone: '13800138005',
    status: 'published',
    publishTime: '2026-01-15 10:00:00',
    startTime: '2026-01-15 00:00:00',
    endTime: '2026-03-15 00:00:00',
    createdBy: '赵管理员',
    createdAt: '2026-01-15 10:00:00',
    updatedAt: '2026-01-15 10:00:00'
  },
  {
    id: '2',
    title: '食品厂包装工招聘',
    factoryId: '2',
    factoryName: '华为技术有限公司',
    laborCompanyId: '1',
    laborCompanyName: '三鼎劳务有限公司',
    positionId: '2',
    positionName: '包装工',
    recruitCount: 30,
    salaryMin: 4500,
    salaryMax: 6000,
    salaryUnit: '元/月',
    workLocation: '东莞市松山湖',
    workTime: '8:00-20:00',
    jobRequirements: '<p>1. 18-40周岁，高中以上学历</p><p>2. 有包装经验优先</p><p>3. 身体健康</p>',
    jobDescription: '<p>负责食品产品的包装工作</p><p>工作环境干净卫生</p>',
    welfareBenefits: '<p>1. 包吃包住</p><p>2. 五险一金</p><p>3. 带薪年假</p>',
    contactPerson: '李经理',
    contactPhone: '13800138006',
    status: 'ongoing',
    publishTime: '2026-01-10 15:30:00',
    startTime: '2026-01-10 00:00:00',
    endTime: '2026-03-10 00:00:00',
    createdBy: '赵管理员',
    createdAt: '2026-01-10 15:30:00',
    updatedAt: '2026-01-10 15:30:00'
  },
  {
    id: '3',
    title: '汽车厂装配工招聘',
    factoryId: '3',
    factoryName: '比亚迪股份有限公司',
    laborCompanyId: '2',
    laborCompanyName: '南通富民劳务服务有限公司',
    positionId: '3',
    positionName: '装配工',
    recruitCount: 40,
    salaryMin: 5500,
    salaryMax: 6500,
    salaryUnit: '元/月',
    workLocation: '惠州市大亚湾',
    workTime: '8:00-20:00',
    jobRequirements: '<p>1. 18-45周岁</p><p>2. 有装配经验优先</p><p>3. 吃苦耐劳</p>',
    jobDescription: '<p>负责汽车零部件的装配工作</p><p>工作环境良好</p>',
    welfareBenefits: '<p>1. 包吃包住</p><p>2. 五险一金</p><p>3. 节日福利</p>',
    contactPerson: '王经理',
    contactPhone: '13800138007',
    status: 'published',
    publishTime: '2026-01-08 09:00:00',
    startTime: '2026-01-08 00:00:00',
    endTime: '2026-03-08 00:00:00',
    createdBy: '赵管理员',
    createdAt: '2026-01-08 09:00:00',
    updatedAt: '2026-01-08 09:00:00'
  },
  {
    id: '4',
    title: '服装厂缝纫工招聘',
    factoryId: '1',
    factoryName: '富士康科技集团',
    laborCompanyId: '2',
    laborCompanyName: '南通富民劳务服务有限公司',
    positionId: '4',
    positionName: '缝纫工',
    recruitCount: 25,
    salaryMin: 4800,
    salaryMax: 5800,
    salaryUnit: '元/月',
    workLocation: '深圳市宝安区',
    workTime: '8:00-20:00',
    jobRequirements: '<p>1. 18-45周岁</p><p>2. 有缝纫经验优先</p><p>3. 手脚灵活</p>',
    jobDescription: '<p>负责服装的缝纫工作</p><p>工作环境舒适</p>',
    welfareBenefits: '<p>1. 包吃包住</p><p>2. 五险一金</p><p>3. 绩效奖金</p>',
    contactPerson: '赵经理',
    contactPhone: '13800138008',
    status: 'paused',
    publishTime: '2026-01-05 14:00:00',
    startTime: '2026-01-05 00:00:00',
    endTime: '2026-03-05 00:00:00',
    createdBy: '赵管理员',
    createdAt: '2026-01-05 14:00:00',
    updatedAt: '2026-01-20 10:00:00'
  },
  {
    id: '5',
    title: '电子厂质检员招聘',
    factoryId: '2',
    factoryName: '华为技术有限公司',
    laborCompanyId: '1',
    laborCompanyName: '三鼎劳务有限公司',
    positionId: '5',
    positionName: '质检员',
    recruitCount: 20,
    salaryMin: 6000,
    salaryMax: 7000,
    salaryUnit: '元/月',
    workLocation: '东莞市松山湖',
    workTime: '8:00-20:00',
    jobRequirements: '<p>1. 20-40周岁，高中以上学历</p><p>2. 有质检经验优先</p><p>3. 责任心强</p>',
    jobDescription: '<p>负责产品质量检验工作</p><p>工作环境良好</p>',
    welfareBenefits: '<p>1. 包吃包住</p><p>2. 五险一金</p><p>3. 质量奖金</p>',
    contactPerson: '孙经理',
    contactPhone: '13800138009',
    status: 'completed',
    publishTime: '2025-12-20 10:00:00',
    startTime: '2025-12-20 00:00:00',
    endTime: '2026-02-20 00:00:00',
    createdBy: '赵管理员',
    createdAt: '2025-12-20 10:00:00',
    updatedAt: '2026-02-20 10:00:00'
  }
];

// 简历Mock数据
const resumes = [
  {
    id: '1',
    name: '张三',
    phone: '13800138001',
    gender: 'male',
    age: 25,
    idCard: '110101199001011234',
    education: 'junior_college',
    school: '深圳职业技术学院',
    major: '机械制造',
    experience: 'one_to_three',
    workYears: 2,
    currentCity: '深圳',
    expectedCity: '深圳',
    expectedSalary: '5000-6000元/月',
    positionId: '1',
    positionName: '操作工',
    recruitmentId: '1',
    recruitmentTitle: '电子厂普工招聘',
    factoryId: '1',
    factoryName: '富士康科技集团',
    laborCompanyId: '1',
    laborCompanyName: '三鼎劳务有限公司',
    selfIntroduction: '<p>本人性格开朗，吃苦耐劳，有良好的团队协作能力</p><p>希望能找到一份稳定的工作，为公司创造价值</p>',
    workExperience: '<p>2023-2024年在深圳某电子厂担任操作工</p><p>负责产品组装工作，工作认真负责</p>',
    skills: '<p>1. 熟悉电子产品组装流程</p><p>2. 具备基本的电脑操作能力</p><p>3. 有良好的沟通能力</p>',
    status: 'pending',
    submitTime: '2026-01-15 10:00:00',
    reviewTime: null,
    reviewer: null,
    reviewComment: null,
    attachments: [
      {
        id: '1',
        fileName: '张三身份证.jpg',
        filePath: '/files/resume/张三身份证.jpg',
        fileSize: 102400,
        fileType: 'image/jpeg'
      }
    ],
    createdBy: '张三',
    createdAt: '2026-01-15 10:00:00',
    updatedAt: '2026-01-15 10:00:00'
  },
  {
    id: '2',
    name: '李四',
    phone: '13800138002',
    gender: 'female',
    age: 23,
    idCard: '110101199102021234',
    education: 'high_school',
    school: '东莞职业技术学院',
    major: '食品加工',
    experience: 'less_than_one',
    workYears: 0,
    currentCity: '东莞',
    expectedCity: '东莞',
    expectedSalary: '4500-5500元/月',
    positionId: '2',
    positionName: '包装工',
    recruitmentId: '2',
    recruitmentTitle: '食品厂包装工招聘',
    factoryId: '2',
    factoryName: '华为技术有限公司',
    laborCompanyId: '1',
    laborCompanyName: '三鼎劳务有限公司',
    selfIntroduction: '<p>本人性格温和，做事细心，有耐心</p><p>希望能学习新技能，提升自己</p>',
    workExperience: '<p>应届毕业生，暂无工作经验</p><p>在校期间参加过食品包装实习</p>',
    skills: '<p>1. 熟悉食品包装流程</p><p>2. 具备基本的电脑操作能力</p><p>3. 学习能力强</p>',
    status: 'approved',
    submitTime: '2026-01-14 15:30:00',
    reviewTime: '2026-01-15 09:00:00',
    reviewer: '赵管理员',
    reviewComment: '符合岗位要求，同意录用',
    attachments: [
      {
        id: '2',
        fileName: '李四身份证.jpg',
        filePath: '/files/resume/李四身份证.jpg',
        fileSize: 102400,
        fileType: 'image/jpeg'
      }
    ],
    createdBy: '李四',
    createdAt: '2026-01-14 15:30:00',
    updatedAt: '2026-01-15 09:00:00'
  },
  {
    id: '3',
    name: '王五',
    phone: '13800138003',
    gender: 'male',
    age: 28,
    idCard: '110101199103031234',
    education: 'junior_college',
    school: '惠州职业技术学院',
    major: '汽车工程',
    experience: 'three_to_five',
    workYears: 4,
    currentCity: '惠州',
    expectedCity: '惠州',
    expectedSalary: '5500-6500元/月',
    positionId: '3',
    positionName: '装配工',
    recruitmentId: '3',
    recruitmentTitle: '汽车厂装配工招聘',
    factoryId: '3',
    factoryName: '比亚迪股份有限公司',
    laborCompanyId: '2',
    laborCompanyName: '南通富民劳务服务有限公司',
    selfIntroduction: '<p>本人性格稳重，工作认真，有责任心</p><p>有丰富的装配经验，能快速适应工作</p>',
    workExperience: '<p>2022-2025年在某汽车厂担任装配工</p><p>负责汽车零部件装配，工作表现优秀</p>',
    skills: '<p>1. 熟悉汽车装配流程</p><p>2. 具备基本的电脑操作能力</p><p>3. 有良好的团队协作能力</p>',
    status: 'reviewing',
    submitTime: '2026-01-13 11:00:00',
    reviewTime: null,
    reviewer: null,
    reviewComment: null,
    attachments: [
      {
        id: '3',
        fileName: '王五身份证.jpg',
        filePath: '/files/resume/王五身份证.jpg',
        fileSize: 102400,
        fileType: 'image/jpeg'
      }
    ],
    createdBy: '王五',
    createdAt: '2026-01-13 11:00:00',
    updatedAt: '2026-01-13 11:00:00'
  },
  {
    id: '4',
    name: '赵六',
    phone: '13800138004',
    gender: 'female',
    age: 22,
    idCard: '110101199104041234',
    education: 'high_school',
    school: '深圳职业技术学院',
    major: '服装设计',
    experience: 'less_than_one',
    workYears: 0,
    currentCity: '深圳',
    expectedCity: '深圳',
    expectedSalary: '4800-5800元/月',
    positionId: '4',
    positionName: '缝纫工',
    recruitmentId: '4',
    recruitmentTitle: '服装厂缝纫工招聘',
    factoryId: '1',
    factoryName: '富士康科技集团',
    laborCompanyId: '2',
    laborCompanyName: '南通富民劳务服务有限公司',
    selfIntroduction: '<p>本人性格开朗，喜欢手工劳动</p><p>希望能学习缝纫技能，提升自己</p>',
    workExperience: '<p>应届毕业生，暂无工作经验</p><p>在校期间参加过缝纫实习</p>',
    skills: '<p>1. 具备基本的缝纫技能</p><p>2. 学习能力强</p><p>3. 有耐心</p>',
    status: 'rejected',
    submitTime: '2026-01-12 14:00:00',
    reviewTime: '2026-01-13 10:00:00',
    reviewer: '赵管理员',
    reviewComment: '工作经验不足，暂不符合要求',
    attachments: [
      {
        id: '4',
        fileName: '赵六身份证.jpg',
        filePath: '/files/resume/赵六身份证.jpg',
        fileSize: 102400,
        fileType: 'image/jpeg'
      }
    ],
    createdBy: '赵六',
    createdAt: '2026-01-12 14:00:00',
    updatedAt: '2026-01-13 10:00:00'
  },
  {
    id: '5',
    name: '孙七',
    phone: '13800138005',
    gender: 'male',
    age: 30,
    idCard: '110101199105051234',
    education: 'bachelor',
    school: '华南理工大学',
    major: '质量管理',
    experience: 'five_to_ten',
    workYears: 8,
    currentCity: '东莞',
    expectedCity: '东莞',
    expectedSalary: '6000-7000元/月',
    positionId: '5',
    positionName: '质检员',
    recruitmentId: '5',
    recruitmentTitle: '电子厂质检员招聘',
    factoryId: '2',
    factoryName: '华为技术有限公司',
    laborCompanyId: '1',
    laborCompanyName: '三鼎劳务有限公司',
    selfIntroduction: '<p>本人性格严谨，工作细致，有较强的责任心</p><p>有丰富的质检经验，熟悉各种质检标准</p>',
    workExperience: '<p>2018-2025年在某电子厂担任质检员</p><p>负责产品质量检验，工作表现优秀</p>',
    skills: '<p>1. 熟悉ISO质量管理体系</p><p>2. 具备良好的沟通能力</p><p>3. 熟练使用办公软件</p>',
    status: 'hired',
    submitTime: '2026-01-10 09:00:00',
    reviewTime: '2026-01-11 10:00:00',
    reviewer: '赵管理员',
    reviewComment: '符合岗位要求，同意录用',
    attachments: [
      {
        id: '5',
        fileName: '孙七身份证.jpg',
        filePath: '/files/resume/孙七身份证.jpg',
        fileSize: 102400,
        fileType: 'image/jpeg'
      }
    ],
    createdBy: '孙七',
    createdAt: '2026-01-10 09:00:00',
    updatedAt: '2026-01-11 10:00:00'
  }
];

// 工厂选项
const factoryOptions = [
  { value: '1', label: '富士康科技集团' },
  { value: '2', label: '华为技术有限公司' },
  { value: '3', label: '比亚迪股份有限公司' }
];

// 劳务公司选项
const laborCompanyOptions = [
  { value: '1', label: '三鼎劳务有限公司' },
  { value: '2', label: '南通富民劳务服务有限公司' }
];

// 岗位选项
const positionOptions = [
  { value: '1', label: '操作工' },
  { value: '2', label: '包装工' },
  { value: '3', label: '装配工' },
  { value: '4', label: '缝纫工' },
  { value: '5', label: '质检员' }
];

// ==================== 招聘需求API接口模拟 ====================

// 获取招聘需求列表
Mock.mock('/recruitment/requirements', 'get', (options) => {
  const urlParams = new URLSearchParams(options.url.split('?')[1]);
  const page = parseInt(urlParams.get('page')) || 1;
  const pageSize = parseInt(urlParams.get('pageSize')) || 10;
  const keyword = urlParams.get('keyword') || '';
  const status = urlParams.get('status') || '';
  const factoryId = urlParams.get('factoryId') || '';
  const laborCompanyId = urlParams.get('laborCompanyId') || '';
  
  let filteredData = [...recruitmentRequirements];
  
  if (keyword) {
    filteredData = filteredData.filter(item =>
      item.title.includes(keyword) ||
      item.positionName.includes(keyword)
    );
  }
  if (status) {
    filteredData = filteredData.filter(item => item.status === status);
  }
  if (factoryId) {
    filteredData = filteredData.filter(item => item.factoryId === factoryId);
  }
  if (laborCompanyId) {
    filteredData = filteredData.filter(item => item.laborCompanyId === laborCompanyId);
  }
  
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const list = filteredData.slice(start, end);
  
  return {
    code: 200,
    message: '获取成功',
    data: {
      list,
      total: filteredData.length,
      page,
      pageSize,
      totalPages: Math.ceil(filteredData.length / pageSize)
    },
    timestamp: Date.now()
  };
});

// 获取招聘需求详情
Mock.mock(/\/recruitment\/requirements\/\w+/, 'get', (options) => {
  const id = options.url.match(/\/recruitment\/requirements\/(\w+)/)?.[1];
  const requirement = recruitmentRequirements.find(item => item.id === id);
  
  if (!requirement) {
    return {
      code: 404,
      message: '招聘需求不存在',
      data: null,
      timestamp: Date.now()
    };
  }
  
  // 添加统计数据
  const detail = {
    ...requirement,
    appliedCount: Math.floor(Math.random() * 50) + 10,
    interviewCount: Math.floor(Math.random() * 20) + 5,
    hiredCount: Math.floor(Math.random() * 10) + 2,
    viewCount: Math.floor(Math.random() * 200) + 50,
    attachments: []
  };
  
  return {
    code: 200,
    message: '获取成功',
    data: detail,
    timestamp: Date.now()
  };
});

// 创建招聘需求
Mock.mock('/recruitment/requirements', 'post', (options) => {
  const data = JSON.parse(options.body);
  const newRequirement = {
    id: String(Date.now()),
    ...data,
    status: 'draft',
    publishTime: null,
    createdBy: '赵管理员',
    createdAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
    updatedAt: new Date().toISOString().replace('T', ' ').substring(0, 19)
  };
  recruitmentRequirements.unshift(newRequirement);
  
  return {
    code: 201,
    message: '创建成功',
    data: newRequirement,
    timestamp: Date.now()
  };
});

// 更新招聘需求
Mock.mock(/\/recruitment\/requirements\/\w+/, 'put', (options) => {
  const id = options.url.match(/\/recruitment\/requirements\/(\w+)/)?.[1];
  const data = JSON.parse(options.body);
  const index = recruitmentRequirements.findIndex(item => item.id === id);
  
  if (index === -1) {
    return {
      code: 404,
      message: '招聘需求不存在',
      data: null,
      timestamp: Date.now()
    };
  }
  
  recruitmentRequirements[index] = {
    ...recruitmentRequirements[index],
    ...data,
    updatedAt: new Date().toISOString().replace('T', ' ').substring(0, 19)
  };
  
  return {
    code: 200,
    message: '更新成功',
    data: recruitmentRequirements[index],
    timestamp: Date.now()
  };
});

// 删除招聘需求
Mock.mock(/\/recruitment\/requirements\/\w+/, 'delete', (options) => {
  const id = options.url.match(/\/recruitment\/requirements\/(\w+)/)?.[1];
  const index = recruitmentRequirements.findIndex(item => item.id === id);
  
  if (index === -1) {
    return {
      code: 404,
      message: '招聘需求不存在',
      data: null,
      timestamp: Date.now()
    };
  }
  
  recruitmentRequirements.splice(index, 1);
  
  return {
    code: 200,
    message: '删除成功',
    data: null,
    timestamp: Date.now()
  };
});

// 批量删除招聘需求
Mock.mock('/recruitment/requirements/batch', 'delete', (options) => {
  const { ids } = JSON.parse(options.body);
  ids.forEach(id => {
    const index = recruitmentRequirements.findIndex(item => item.id === id);
    if (index !== -1) {
      recruitmentRequirements.splice(index, 1);
    }
  });
  
  return {
    code: 200,
    message: '批量删除成功',
    data: null,
    timestamp: Date.now()
  };
});

// 发布招聘需求
Mock.mock(/\/recruitment\/requirements\/\w+\/publish/, 'put', (options) => {
  const id = options.url.match(/\/recruitment\/requirements\/(\w+)\/publish/)?.[1];
  const requirement = recruitmentRequirements.find(item => item.id === id);
  
  if (!requirement) {
    return {
      code: 404,
      message: '招聘需求不存在',
      data: null,
      timestamp: Date.now()
    };
  }
  
  requirement.status = 'published';
  requirement.publishTime = new Date().toISOString().replace('T', ' ').substring(0, 19);
  requirement.updatedAt = new Date().toISOString().replace('T', ' ').substring(0, 19);
  
  return {
    code: 200,
    message: '发布成功',
    data: requirement,
    timestamp: Date.now()
  };
});

// 暂停招聘需求
Mock.mock(/\/recruitment\/requirements\/\w+\/pause/, 'put', (options) => {
  const id = options.url.match(/\/recruitment\/requirements\/(\w+)\/pause/)?.[1];
  const requirement = recruitmentRequirements.find(item => item.id === id);
  
  if (!requirement) {
    return {
      code: 404,
      message: '招聘需求不存在',
      data: null,
      timestamp: Date.now()
    };
  }
  
  requirement.status = 'paused';
  requirement.updatedAt = new Date().toISOString().replace('T', ' ').substring(0, 19);
  
  return {
    code: 200,
    message: '暂停成功',
    data: requirement,
    timestamp: Date.now()
  };
});

// 恢复招聘需求
Mock.mock(/\/recruitment\/requirements\/\w+\/resume/, 'put', (options) => {
  const id = options.url.match(/\/recruitment\/requirements\/(\w+)\/resume/)?.[1];
  const requirement = recruitmentRequirements.find(item => item.id === id);
  
  if (!requirement) {
    return {
      code: 404,
      message: '招聘需求不存在',
      data: null,
      timestamp: Date.now()
    };
  }
  
  requirement.status = 'ongoing';
  requirement.updatedAt = new Date().toISOString().replace('T', ' ').substring(0, 19);
  
  return {
    code: 200,
    message: '恢复成功',
    data: requirement,
    timestamp: Date.now()
  };
});

// 完成招聘需求
Mock.mock(/\/recruitment\/requirements\/\w+\/complete/, 'put', (options) => {
  const id = options.url.match(/\/recruitment\/requirements\/(\w+)\/complete/)?.[1];
  const requirement = recruitmentRequirements.find(item => item.id === id);
  
  if (!requirement) {
    return {
      code: 404,
      message: '招聘需求不存在',
      data: null,
      timestamp: Date.now()
    };
  }
  
  requirement.status = 'completed';
  requirement.updatedAt = new Date().toISOString().replace('T', ' ').substring(0, 19);
  
  return {
    code: 200,
    message: '完成成功',
    data: requirement,
    timestamp: Date.now()
  };
});

// 取消招聘需求
Mock.mock(/\/recruitment\/requirements\/\w+\/cancel/, 'put', (options) => {
  const id = options.url.match(/\/recruitment\/requirements\/(\w+)\/cancel/)?.[1];
  const requirement = recruitmentRequirements.find(item => item.id === id);
  
  if (!requirement) {
    return {
      code: 404,
      message: '招聘需求不存在',
      data: null,
      timestamp: Date.now()
    };
  }
  
  requirement.status = 'cancelled';
  requirement.updatedAt = new Date().toISOString().replace('T', ' ').substring(0, 19);
  
  return {
    code: 200,
    message: '取消成功',
    data: requirement,
    timestamp: Date.now()
  };
});

// 导出招聘需求
Mock.mock('/recruitment/requirements/export', 'get', () => {
  return new Blob([JSON.stringify(recruitmentRequirements)], { type: 'application/vnd.ms-excel' });
});

// ==================== 简历管理API接口模拟 ====================

// 获取简历列表
Mock.mock('/recruitment/resumes', 'get', (options) => {
  const urlParams = new URLSearchParams(options.url.split('?')[1]);
  const page = parseInt(urlParams.get('page')) || 1;
  const pageSize = parseInt(urlParams.get('pageSize')) || 10;
  const keyword = urlParams.get('keyword') || '';
  const status = urlParams.get('status') || '';
  const positionId = urlParams.get('positionId') || '';
  const gender = urlParams.get('gender') || '';
  const education = urlParams.get('education') || '';
  const experience = urlParams.get('experience') || '';
  
  let filteredData = [...resumes];
  
  if (keyword) {
    filteredData = filteredData.filter(item =>
      item.name.includes(keyword) ||
      item.phone.includes(keyword)
    );
  }
  if (status) {
    filteredData = filteredData.filter(item => item.status === status);
  }
  if (positionId) {
    filteredData = filteredData.filter(item => item.positionId === positionId);
  }
  if (gender) {
    filteredData = filteredData.filter(item => item.gender === gender);
  }
  if (education) {
    filteredData = filteredData.filter(item => item.education === education);
  }
  if (experience) {
    filteredData = filteredData.filter(item => item.experience === experience);
  }
  
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const list = filteredData.slice(start, end);
  
  return {
    code: 200,
    message: '获取成功',
    data: {
      list,
      total: filteredData.length,
      page,
      pageSize,
      totalPages: Math.ceil(filteredData.length / pageSize)
    },
    timestamp: Date.now()
  };
});

// 获取简历详情
Mock.mock(/\/recruitment\/resumes\/\w+/, 'get', (options) => {
  const id = options.url.match(/\/recruitment\/resumes\/(\w+)/)?.[1];
  const resume = resumes.find(item => item.id === id);
  
  if (!resume) {
    return {
      code: 404,
      message: '简历不存在',
      data: null,
      timestamp: Date.now()
    };
  }
  
  // 添加面试记录和操作记录
  const detail = {
    ...resume,
    interviewRecords: [
      {
        id: '1',
        interviewType: '初步面试',
        interviewTime: '2026-01-16 10:00:00',
        interviewer: '张经理',
        interviewResult: '通过',
        interviewComment: '候选人符合岗位要求，建议安排工厂面试'
      }
    ],
    operationRecords: [
      {
        id: '1',
        operation: '提交简历',
        operator: '张三',
        operationTime: '2026-01-15 10:00:00',
        remark: '候选人提交了简历'
      },
      {
        id: '2',
        operation: '审核通过',
        operator: '赵管理员',
        operationTime: '2026-01-15 09:00:00',
        remark: '审核通过，同意录用'
      }
    ]
  };
  
  return {
    code: 200,
    message: '获取成功',
    data: detail,
    timestamp: Date.now()
  };
});

// 创建简历
Mock.mock('/recruitment/resumes', 'post', (options) => {
  const data = JSON.parse(options.body);
  const newResume = {
    id: String(Date.now()),
    ...data,
    status: 'pending',
    submitTime: new Date().toISOString().replace('T', ' ').substring(0, 19),
    reviewTime: null,
    reviewer: null,
    reviewComment: null,
    attachments: [],
    createdBy: data.name,
    createdAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
    updatedAt: new Date().toISOString().replace('T', ' ').substring(0, 19)
  };
  resumes.unshift(newResume);
  
  return {
    code: 201,
    message: '创建成功',
    data: newResume,
    timestamp: Date.now()
  };
});

// 更新简历
Mock.mock(/\/recruitment\/resumes\/\w+/, 'put', (options) => {
  const id = options.url.match(/\/recruitment\/resumes\/(\w+)/)?.[1];
  const data = JSON.parse(options.body);
  const index = resumes.findIndex(item => item.id === id);
  
  if (index === -1) {
    return {
      code: 404,
      message: '简历不存在',
      data: null,
      timestamp: Date.now()
    };
  }
  
  resumes[index] = {
    ...resumes[index],
    ...data,
    updatedAt: new Date().toISOString().replace('T', ' ').substring(0, 19)
  };
  
  return {
    code: 200,
    message: '更新成功',
    data: resumes[index],
    timestamp: Date.now()
  };
});

// 删除简历
Mock.mock(/\/recruitment\/resumes\/\w+/, 'delete', (options) => {
  const id = options.url.match(/\/recruitment\/resumes\/(\w+)/)?.[1];
  const index = resumes.findIndex(item => item.id === id);
  
  if (index === -1) {
    return {
      code: 404,
      message: '简历不存在',
      data: null,
      timestamp: Date.now()
    };
  }
  
  resumes.splice(index, 1);
  
  return {
    code: 200,
    message: '删除成功',
    data: null,
    timestamp: Date.now()
  };
});

// 批量删除简历
Mock.mock('/recruitment/resumes/batch', 'delete', (options) => {
  const { ids } = JSON.parse(options.body);
  ids.forEach(id => {
    const index = resumes.findIndex(item => item.id === id);
    if (index !== -1) {
      resumes.splice(index, 1);
    }
  });
  
  return {
    code: 200,
    message: '批量删除成功',
    data: null,
    timestamp: Date.now()
  };
});

// 审核简历
Mock.mock(/\/recruitment\/resumes\/\w+\/review/, 'put', (options) => {
  const id = options.url.match(/\/recruitment\/resumes\/(\w+)\/review/)?.[1];
  const data = JSON.parse(options.body);
  const resume = resumes.find(item => item.id === id);
  
  if (!resume) {
    return {
      code: 404,
      message: '简历不存在',
      data: null,
      timestamp: Date.now()
    };
  }
  
  resume.status = data.status;
  resume.reviewTime = new Date().toISOString().replace('T', ' ').substring(0, 19);
  resume.reviewer = '赵管理员';
  resume.reviewComment = data.reviewComment;
  resume.updatedAt = new Date().toISOString().replace('T', ' ').substring(0, 19);
  
  return {
    code: 200,
    message: '审核成功',
    data: resume,
    timestamp: Date.now()
  };
});

// 录用简历
Mock.mock(/\/recruitment\/resumes\/\w+\/hire/, 'put', (options) => {
  const id = options.url.match(/\/recruitment\/resumes\/(\w+)\/hire/)?.[1];
  const resume = resumes.find(item => item.id === id);
  
  if (!resume) {
    return {
      code: 404,
      message: '简历不存在',
      data: null,
      timestamp: Date.now()
    };
  }
  
  resume.status = 'hired';
  resume.updatedAt = new Date().toISOString().replace('T', ' ').substring(0, 19);
  
  return {
    code: 200,
    message: '录用成功',
    data: resume,
    timestamp: Date.now()
  };
});

// 拒绝简历
Mock.mock(/\/recruitment\/resumes\/\w+\/reject/, 'put', (options) => {
  const id = options.url.match(/\/recruitment\/resumes\/(\w+)\/reject/)?.[1];
  const data = JSON.parse(options.body);
  const resume = resumes.find(item => item.id === id);
  
  if (!resume) {
    return {
      code: 404,
      message: '简历不存在',
      data: null,
      timestamp: Date.now()
    };
  }
  
  resume.status = 'rejected';
  resume.reviewTime = new Date().toISOString().replace('T', ' ').substring(0, 19);
  resume.reviewer = '赵管理员';
  resume.reviewComment = data.rejectReason;
  resume.updatedAt = new Date().toISOString().replace('T', ' ').substring(0, 19);
  
  return {
    code: 200,
    message: '拒绝成功',
    data: resume,
    timestamp: Date.now()
  };
});

// 导出简历
Mock.mock('/recruitment/resumes/export', 'get', () => {
  return new Blob([JSON.stringify(resumes)], { type: 'application/vnd.ms-excel' });
});

// ==================== 选项API接口模拟 ====================

// 获取工厂选项
Mock.mock('/system/factories/options', 'get', () => {
  return {
    code: 200,
    message: '获取成功',
    data: factoryOptions,
    timestamp: Date.now()
  };
});

// 获取劳务公司选项
Mock.mock('/system/labor-companies/options', 'get', () => {
  return {
    code: 200,
    message: '获取成功',
    data: laborCompanyOptions,
    timestamp: Date.now()
  };
});

// 获取岗位选项
Mock.mock('/system/positions/options', 'get', () => {
  return {
    code: 200,
    message: '获取成功',
    data: positionOptions,
    timestamp: Date.now()
  };
});
