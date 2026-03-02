import Mock from 'mockjs';

// ==================== 打印管理Mock数据 ====================

// 打印模版数据
const printTemplates = [
  {
    id: 1,
    tenantId: '1',
    templateName: '劳动合同模版',
    templateCode: 'CONTRACT_TEMPLATE',
    templateType: 'contract',
    templateContent: '<h1>劳动合同</h1><p>甲方:{{companyName}}</p><p>乙方:{{workerName}}</p><p>身份证号:{{idCard}}</p><p>合同编号:{{contractNo}}</p><p>签订日期:{{signDate}}</p><p>生效日期:{{startDate}}</p><p>过期日期:{{endDate}}</p><p>合同金额:{{contractAmount}}</p>',
    variables: [
      {
        variableName: 'companyName',
        variableLabel: '公司名称',
        variableType: 'text',
        required: true,
        description: '甲方公司名称'
      },
      {
        variableName: 'workerName',
        variableLabel: '工人姓名',
        variableType: 'text',
        required: true,
        description: '乙方工人姓名'
      },
      {
        variableName: 'idCard',
        variableLabel: '身份证号',
        variableType: 'text',
        required: true,
        description: '乙方身份证号码'
      },
      {
        variableName: 'contractNo',
        variableLabel: '合同编号',
        variableType: 'text',
        required: true,
        description: '合同编号'
      },
      {
        variableName: 'signDate',
        variableLabel: '签订日期',
        variableType: 'date',
        required: true,
        description: '合同签订日期'
      },
      {
        variableName: 'startDate',
        variableLabel: '生效日期',
        variableType: 'date',
        required: true,
        description: '合同生效日期'
      },
      {
        variableName: 'endDate',
        variableLabel: '过期日期',
        variableType: 'date',
        required: true,
        description: '合同过期日期'
      },
      {
        variableName: 'contractAmount',
        variableLabel: '合同金额',
        variableType: 'number',
        required: true,
        description: '合同金额'
      }
    ],
    pageSettings: {
      orientation: 'portrait',
      paperSize: 'A4',
      margin: {
        top: 20,
        right: 20,
        bottom: 20,
        left: 20
      },
      headerFooter: {
        showHeader: false,
        showFooter: false,
        showPageNumber: true
      }
    },
    status: 'published',
    isDefault: true,
    description: '标准劳动合同模版',
    tags: ['合同', '标准'],
    createdBy: '赵管理员',
    createdAt: '2026-01-01 10:00:00',
    updatedBy: '赵管理员',
    updatedAt: '2026-01-01 10:00:00'
  },
  {
    id: 2,
    tenantId: '1',
    templateName: '工资条模版',
    templateCode: 'SALARY_SLIP_TEMPLATE',
    templateType: 'proof',
    templateContent: '<h1>工资条</h1><p>姓名:{{workerName}}</p><p>工号:{{workerNo}}</p><p>月份:{{salaryMonth}}</p><p>基本工资:{{baseSalary}}</p><p>加班费:{{overtimePay}}</p><p>绩效奖金:{{performanceBonus}}</p><p>津贴:{{allowance}}</p><p>扣除:{{deductions}}</p><p>实发工资:{{netSalary}}</p>',
    variables: [
      {
        variableName: 'workerName',
        variableLabel: '姓名',
        variableType: 'text',
        required: true,
        description: '工人姓名'
      },
      {
        variableName: 'workerNo',
        variableLabel: '工号',
        variableType: 'text',
        required: true,
        description: '工人工号'
      },
      {
        variableName: 'salaryMonth',
        variableLabel: '月份',
        variableType: 'text',
        required: true,
        description: '工资月份'
      },
      {
        variableName: 'baseSalary',
        variableLabel: '基本工资',
        variableType: 'number',
        required: true,
        description: '基本工资'
      },
      {
        variableName: 'overtimePay',
        variableLabel: '加班费',
        variableType: 'number',
        required: true,
        description: '加班费'
      },
      {
        variableName: 'performanceBonus',
        variableLabel: '绩效奖金',
        variableType: 'number',
        required: true,
        description: '绩效奖金'
      },
      {
        variableName: 'allowance',
        variableLabel: '津贴',
        variableType: 'number',
        required: true,
        description: '津贴'
      },
      {
        variableName: 'deductions',
        variableLabel: '扣除',
        variableType: 'number',
        required: true,
        description: '扣除金额'
      },
      {
        variableName: 'netSalary',
        variableLabel: '实发工资',
        variableType: 'number',
        required: true,
        description: '实发工资'
      }
    ],
    pageSettings: {
      orientation: 'portrait',
      paperSize: 'A4',
      margin: {
        top: 20,
        right: 20,
        bottom: 20,
        left: 20
      },
      headerFooter: {
        showHeader: false,
        showFooter: false,
        showPageNumber: true
      }
    },
    status: 'published',
    isDefault: false,
    description: '标准工资条模版',
    tags: ['工资', '证明'],
    createdBy: '赵管理员',
    createdAt: '2026-01-05 14:30:00',
    updatedBy: '赵管理员',
    updatedAt: '2026-01-05 14:30:00'
  },
  {
    id: 3,
    tenantId: '1',
    templateName: '离职证明模版',
    templateCode: 'RESIGNATION_CERTIFICATE_TEMPLATE',
    templateType: 'certificate',
    templateContent: '<h1>离职证明</h1><p>兹证明{{workerName}}同志(身份证号:{{idCard}})曾在我公司担任{{position}}职务,于{{startDate}}入职,于{{endDate}}离职。</p><p>特此证明</p><p>公司名称:{{companyName}}</p><p>证明日期:{{certificateDate}}</p>',
    variables: [
      {
        variableName: 'workerName',
        variableLabel: '姓名',
        variableType: 'text',
        required: true,
        description: '工人姓名'
      },
      {
        variableName: 'idCard',
        variableLabel: '身份证号',
        variableType: 'text',
        required: true,
        description: '身份证号码'
      },
      {
        variableName: 'position',
        variableLabel: '职务',
        variableType: 'text',
        required: true,
        description: '担任职务'
      },
      {
        variableName: 'startDate',
        variableLabel: '入职日期',
        variableType: 'date',
        required: true,
        description: '入职日期'
      },
      {
        variableName: 'endDate',
        variableLabel: '离职日期',
        variableType: 'date',
        required: true,
        description: '离职日期'
      },
      {
        variableName: 'companyName',
        variableLabel: '公司名称',
        variableType: 'text',
        required: true,
        description: '公司名称'
      },
      {
        variableName: 'certificateDate',
        variableLabel: '证明日期',
        variableType: 'date',
        required: true,
        description: '证明日期'
      }
    ],
    pageSettings: {
      orientation: 'portrait',
      paperSize: 'A4',
      margin: {
        top: 20,
        right: 20,
        bottom: 20,
        left: 20
      },
      headerFooter: {
        showHeader: false,
        showFooter: false,
        showPageNumber: false
      }
    },
    status: 'published',
    isDefault: false,
    description: '标准离职证明模版',
    tags: ['证明', '离职'],
    createdBy: '赵管理员',
    createdAt: '2026-01-10 09:15:00',
    updatedBy: '赵管理员',
    updatedAt: '2026-01-10 09:15:00'
  },
  {
    id: 4,
    tenantId: '1',
    templateName: '请假申请表模版',
    templateCode: 'LEAVE_APPLICATION_TEMPLATE',
    templateType: 'form',
    templateContent: '<h1>请假申请表</h1><p>姓名:{{workerName}}</p><p>部门:{{department}}</p><p>请假类型:{{leaveType}}</p><p>请假开始日期:{{startDate}}</p><p>请假结束日期:{{endDate}}</p><p>请假天数:{{leaveDays}}</p><p>请假原因:{{reason}}</p>',
    variables: [
      {
        variableName: 'workerName',
        variableLabel: '姓名',
        variableType: 'text',
        required: true,
        description: '工人姓名'
      },
      {
        variableName: 'department',
        variableLabel: '部门',
        variableType: 'text',
        required: true,
        description: '所属部门'
      },
      {
        variableName: 'leaveType',
        variableLabel: '请假类型',
        variableType: 'text',
        required: true,
        description: '请假类型'
      },
      {
        variableName: 'startDate',
        variableLabel: '请假开始日期',
        variableType: 'date',
        required: true,
        description: '请假开始日期'
      },
      {
        variableName: 'endDate',
        variableLabel: '请假结束日期',
        variableType: 'date',
        required: true,
        description: '请假结束日期'
      },
      {
        variableName: 'leaveDays',
        variableLabel: '请假天数',
        variableType: 'number',
        required: true,
        description: '请假天数'
      },
      {
        variableName: 'reason',
        variableLabel: '请假原因',
        variableType: 'text',
        required: true,
        description: '请假原因'
      }
    ],
    pageSettings: {
      orientation: 'portrait',
      paperSize: 'A4',
      margin: {
        top: 20,
        right: 20,
        bottom: 20,
        left: 20
      },
      headerFooter: {
        showHeader: false,
        showFooter: false,
        showPageNumber: false
      }
    },
    status: 'draft',
    isDefault: false,
    description: '请假申请表模版',
    tags: ['表单', '请假'],
    createdBy: '赵管理员',
    createdAt: '2026-02-01 10:00:00',
    updatedBy: '赵管理员',
    updatedAt: '2026-02-01 10:00:00'
  }
];

// 打印配置数据
const printConfigs = [
  {
    id: 1,
    tenantId: '1',
    businessCode: 'CONTRACT',
    businessName: '合同管理',
    templateId: '1',
    templateName: '劳动合同模版',
    dataMapping: {
      mappings: [
        {
          businessField: 'companyName',
          templateVariable: 'companyName',
          mappingType: 'direct'
        },
        {
          businessField: 'workerName',
          templateVariable: 'workerName',
          mappingType: 'direct'
        },
        {
          businessField: 'idCard',
          templateVariable: 'idCard',
          mappingType: 'direct'
        },
        {
          businessField: 'contractNo',
          templateVariable: 'contractNo',
          mappingType: 'direct'
        },
        {
          businessField: 'signDate',
          templateVariable: 'signDate',
          mappingType: 'direct'
        },
        {
          businessField: 'startDate',
          templateVariable: 'startDate',
          mappingType: 'direct'
        },
        {
          businessField: 'endDate',
          templateVariable: 'endDate',
          mappingType: 'direct'
        },
        {
          businessField: 'contractAmount',
          templateVariable: 'contractAmount',
          mappingType: 'direct'
        }
      ]
    },
    printSettings: {
      copies: 1,
      quality: 'medium',
      orientation: 'portrait',
      paperSize: 'A4'
    },
    status: 'enabled',
    createdBy: '赵管理员',
    createdAt: '2026-01-01 10:00:00',
    updatedBy: '赵管理员',
    updatedAt: '2026-01-01 10:00:00'
  },
  {
    id: 2,
    tenantId: '1',
    businessCode: 'SALARY',
    businessName: '工资管理',
    templateId: '2',
    templateName: '工资条模版',
    dataMapping: {
      mappings: [
        {
          businessField: 'workerName',
          templateVariable: 'workerName',
          mappingType: 'direct'
        },
        {
          businessField: 'workerNo',
          templateVariable: 'workerNo',
          mappingType: 'direct'
        },
        {
          businessField: 'salaryMonth',
          templateVariable: 'salaryMonth',
          mappingType: 'direct'
        },
        {
          businessField: 'baseSalary',
          templateVariable: 'baseSalary',
          mappingType: 'direct'
        },
        {
          businessField: 'overtimePay',
          templateVariable: 'overtimePay',
          mappingType: 'direct'
        },
        {
          businessField: 'performanceBonus',
          templateVariable: 'performanceBonus',
          mappingType: 'direct'
        },
        {
          businessField: 'allowance',
          templateVariable: 'allowance',
          mappingType: 'direct'
        },
        {
          businessField: 'deductions',
          templateVariable: 'deductions',
          mappingType: 'direct'
        },
        {
          businessField: 'netSalary',
          templateVariable: 'netSalary',
          mappingType: 'direct'
        }
      ]
    },
    printSettings: {
      copies: 1,
      quality: 'medium',
      orientation: 'portrait',
      paperSize: 'A4'
    },
    status: 'enabled',
    createdBy: '赵管理员',
    createdAt: '2026-01-05 14:30:00',
    updatedBy: '赵管理员',
    updatedAt: '2026-01-05 14:30:00'
  },
  {
    id: 3,
    tenantId: '1',
    businessCode: 'RESIGNATION',
    businessName: '离职管理',
    templateId: '3',
    templateName: '离职证明模版',
    dataMapping: {
      mappings: [
        {
          businessField: 'workerName',
          templateVariable: 'workerName',
          mappingType: 'direct'
        },
        {
          businessField: 'idCard',
          templateVariable: 'idCard',
          mappingType: 'direct'
        },
        {
          businessField: 'position',
          templateVariable: 'position',
          mappingType: 'direct'
        },
        {
          businessField: 'startDate',
          templateVariable: 'startDate',
          mappingType: 'direct'
        },
        {
          businessField: 'endDate',
          templateVariable: 'endDate',
          mappingType: 'direct'
        },
        {
          businessField: 'companyName',
          templateVariable: 'companyName',
          mappingType: 'constant',
          constantValue: '南通富民劳务服务有限公司'
        },
        {
          businessField: 'certificateDate',
          templateVariable: 'certificateDate',
          mappingType: 'expression',
          expression: 'new Date().toISOString().split("T")[0]'
        }
      ]
    },
    printSettings: {
      copies: 1,
      quality: 'medium',
      orientation: 'portrait',
      paperSize: 'A4'
    },
    status: 'enabled',
    createdBy: '赵管理员',
    createdAt: '2026-01-10 09:15:00',
    updatedBy: '赵管理员',
    updatedAt: '2026-01-10 09:15:00'
  }
];

// 打印历史数据
const printHistory = [
  {
    id: 1,
    tenantId: '1',
    businessCode: 'CONTRACT',
    businessId: '1',
    templateId: '1',
    templateName: '劳动合同模版',
    printData: {
      companyName: '南通富民劳务服务有限公司',
      workerName: '张三',
      idCard: '110101199001011234',
      contractNo: 'HT202601001',
      signDate: '2026-01-15',
      startDate: '2026-01-20',
      endDate: '2027-01-19',
      contractAmount: '5000'
    },
    printSettings: {
      copies: 1,
      quality: 'medium',
      orientation: 'portrait',
      paperSize: 'A4'
    },
    printStatus: 'success',
    printedBy: '赵管理员',
    printedAt: '2026-01-20 10:30:00',
    ipAddress: '192.168.1.100'
  },
  {
    id: 2,
    tenantId: '1',
    businessCode: 'SALARY',
    businessId: '1',
    templateId: '2',
    templateName: '工资条模版',
    printData: {
      workerName: '张三',
      workerNo: 'W001',
      salaryMonth: '2026-01',
      baseSalary: 4000,
      overtimePay: 800,
      performanceBonus: 500,
      allowance: 300,
      deductions: 200,
      netSalary: 5400
    },
    printSettings: {
      copies: 1,
      quality: 'medium',
      orientation: 'portrait',
      paperSize: 'A4'
    },
    printStatus: 'success',
    printedBy: '赵管理员',
    printedAt: '2026-02-05 14:20:00',
    ipAddress: '192.168.1.100'
  },
  {
    id: 3,
    tenantId: '1',
    businessCode: 'RESIGNATION',
    businessId: '1',
    templateId: '3',
    templateName: '离职证明模版',
    printData: {
      workerName: '李四',
      idCard: '110101199002021234',
      position: '操作工',
      startDate: '2025-01-01',
      endDate: '2026-01-31',
      companyName: '南通富民劳务服务有限公司',
      certificateDate: '2026-02-01'
    },
    printSettings: {
      copies: 1,
      quality: 'medium',
      orientation: 'portrait',
      paperSize: 'A4'
    },
    printStatus: 'success',
    printedBy: '赵管理员',
    printedAt: '2026-02-01 09:15:00',
    ipAddress: '192.168.1.100'
  },
  {
    id: 4,
    tenantId: '1',
    businessCode: 'CONTRACT',
    businessId: '2',
    templateId: '1',
    templateName: '劳动合同模版',
    printData: {
      companyName: '南通富民劳务服务有限公司',
      workerName: '王五',
      idCard: '110101199003031234',
      contractNo: 'HT202602001',
      signDate: '2026-02-10',
      startDate: '2026-02-15',
      endDate: '2027-02-14',
      contractAmount: '5500'
    },
    printSettings: {
      copies: 1,
      quality: 'medium',
      orientation: 'portrait',
      paperSize: 'A4'
    },
    printStatus: 'failed',
    errorMessage: '打印机连接失败',
    printedBy: '赵管理员',
    printedAt: '2026-02-15 11:00:00',
    ipAddress: '192.168.1.100'
  }
];

// 业务代码数据
const businessCodes = [
  {
    code: 'CONTRACT',
    name: '合同管理',
    description: '合同签订与管理'
  },
  {
    code: 'SALARY',
    name: '工资管理',
    description: '工资发放与管理'
  },
  {
    code: 'RESIGNATION',
    name: '离职管理',
    description: '离职流程管理'
  },
  {
    code: 'LEAVE',
    name: '请假管理',
    description: '请假申请与管理'
  },
  {
    code: 'REWARD_PUNISHMENT',
    name: '奖惩管理',
    description: '奖励与惩罚管理'
  },
  {
    code: 'ATTENDANCE',
    name: '考勤管理',
    description: '考勤记录与管理'
  }
];

// 业务字段数据
const businessFields = {
  CONTRACT: [
    {
      fieldName: 'companyName',
      fieldLabel: '公司名称',
      fieldType: 'text',
      fieldDescription: '甲方公司名称'
    },
    {
      fieldName: 'workerName',
      fieldLabel: '工人姓名',
      fieldType: 'text',
      fieldDescription: '乙方工人姓名'
    },
    {
      fieldName: 'idCard',
      fieldLabel: '身份证号',
      fieldType: 'text',
      fieldDescription: '乙方身份证号码'
    },
    {
      fieldName: 'contractNo',
      fieldLabel: '合同编号',
      fieldType: 'text',
      fieldDescription: '合同编号'
    },
    {
      fieldName: 'signDate',
      fieldLabel: '签订日期',
      fieldType: 'date',
      fieldDescription: '合同签订日期'
    },
    {
      fieldName: 'startDate',
      fieldLabel: '生效日期',
      fieldType: 'date',
      fieldDescription: '合同生效日期'
    },
    {
      fieldName: 'endDate',
      fieldLabel: '过期日期',
      fieldType: 'date',
      fieldDescription: '合同过期日期'
    },
    {
      fieldName: 'contractAmount',
      fieldLabel: '合同金额',
      fieldType: 'number',
      fieldDescription: '合同金额'
    }
  ],
  SALARY: [
    {
      fieldName: 'workerName',
      fieldLabel: '姓名',
      fieldType: 'text',
      fieldDescription: '工人姓名'
    },
    {
      fieldName: 'workerNo',
      fieldLabel: '工号',
      fieldType: 'text',
      fieldDescription: '工人工号'
    },
    {
      fieldName: 'salaryMonth',
      fieldLabel: '月份',
      fieldType: 'text',
      fieldDescription: '工资月份'
    },
    {
      fieldName: 'baseSalary',
      fieldLabel: '基本工资',
      fieldType: 'number',
      fieldDescription: '基本工资'
    },
    {
      fieldName: 'overtimePay',
      fieldLabel: '加班费',
      fieldType: 'number',
      fieldDescription: '加班费'
    },
    {
      fieldName: 'performanceBonus',
      fieldLabel: '绩效奖金',
      fieldType: 'number',
      fieldDescription: '绩效奖金'
    },
    {
      fieldName: 'allowance',
      fieldLabel: '津贴',
      fieldType: 'number',
      fieldDescription: '津贴'
    },
    {
      fieldName: 'deductions',
      fieldLabel: '扣除',
      fieldType: 'number',
      fieldDescription: '扣除金额'
    },
    {
      fieldName: 'netSalary',
      fieldLabel: '实发工资',
      fieldType: 'number',
      fieldDescription: '实发工资'
    }
  ],
  RESIGNATION: [
    {
      fieldName: 'workerName',
      fieldLabel: '姓名',
      fieldType: 'text',
      fieldDescription: '工人姓名'
    },
    {
      fieldName: 'idCard',
      fieldLabel: '身份证号',
      fieldType: 'text',
      fieldDescription: '身份证号码'
    },
    {
      fieldName: 'position',
      fieldLabel: '职务',
      fieldType: 'text',
      fieldDescription: '担任职务'
    },
    {
      fieldName: 'startDate',
      fieldLabel: '入职日期',
      fieldType: 'date',
      fieldDescription: '入职日期'
    },
    {
      fieldName: 'endDate',
      fieldLabel: '离职日期',
      fieldType: 'date',
      fieldDescription: '离职日期'
    }
  ],
  LEAVE: [
    {
      fieldName: 'workerName',
      fieldLabel: '姓名',
      fieldType: 'text',
      fieldDescription: '工人姓名'
    },
    {
      fieldName: 'department',
      fieldLabel: '部门',
      fieldType: 'text',
      fieldDescription: '所属部门'
    },
    {
      fieldName: 'leaveType',
      fieldLabel: '请假类型',
      fieldType: 'select',
      fieldDescription: '请假类型'
    },
    {
      fieldName: 'startDate',
      fieldLabel: '请假开始日期',
      fieldType: 'date',
      fieldDescription: '请假开始日期'
    },
    {
      fieldName: 'endDate',
      fieldLabel: '请假结束日期',
      fieldType: 'date',
      fieldDescription: '请假结束日期'
    },
    {
      fieldName: 'leaveDays',
      fieldLabel: '请假天数',
      fieldType: 'number',
      fieldDescription: '请假天数'
    },
    {
      fieldName: 'reason',
      fieldLabel: '请假原因',
      fieldType: 'text',
      fieldDescription: '请假原因'
    }
  ]
};

// ==================== 打印管理API接口模拟 ====================

// 获取模版列表
Mock.mock(/\/api\/v1\/print-templates/, 'get', (options) => {
  const urlParams = new URLSearchParams(options.url.split('?')[1]);
  const page = parseInt(urlParams.get('page')) || 1;
  const pageSize = parseInt(urlParams.get('pageSize')) || 10;
  const templateName = urlParams.get('templateName') || '';
  const templateCode = urlParams.get('templateCode') || '';
  const templateType = urlParams.get('templateType') || '';
  const status = urlParams.get('status') || '';
  
  let filteredTemplates = printTemplates;
  
  if (templateName) {
    filteredTemplates = filteredTemplates.filter(t => t.templateName.includes(templateName));
  }
  if (templateCode) {
    filteredTemplates = filteredTemplates.filter(t => t.templateCode.includes(templateCode));
  }
  if (templateType) {
    filteredTemplates = filteredTemplates.filter(t => t.templateType === templateType);
  }
  if (status) {
    filteredTemplates = filteredTemplates.filter(t => t.status === status);
  }
  
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const list = filteredTemplates.slice(start, end);
  
  return {
    code: 200,
    message: '获取成功',
    data: {
      list,
      total: filteredTemplates.length,
      page,
      pageSize
    },
    timestamp: Date.now()
  };
});

// 获取模版详情
Mock.mock(/\/api\/v1\/print-templates\/\d+/, 'get', (options) => {
  const id = options.url.match(/\/api\/v1\/print-templates\/(\d+)/)?.[1];
  const template = printTemplates.find(t => t.id == id) || printTemplates[0];
  return {
    code: 200,
    message: '获取成功',
    data: template,
    timestamp: Date.now()
  };
});

// 创建模版
Mock.mock('/api/v1/print-templates', 'post', (options) => {
  const data = JSON.parse(options.body);
  const newTemplate = {
    id: Date.now(),
    tenantId: '1',
    ...data,
    status: 'draft',
    isDefault: false,
    createdBy: '赵管理员',
    createdAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
    updatedBy: '赵管理员',
    updatedAt: new Date().toISOString().replace('T', ' ').substring(0, 19)
  };
  printTemplates.push(newTemplate);
  return {
    code: 200,
    message: '创建成功',
    data: newTemplate,
    timestamp: Date.now()
  };
});

// 更新模版
Mock.mock(/\/api\/v1\/print-templates\/\d+/, 'put', (options) => {
  const id = options.url.match(/\/api\/v1\/print-templates\/(\d+)/)?.[1];
  const data = JSON.parse(options.body);
  const index = printTemplates.findIndex(t => t.id == id);
  if (index !== -1) {
    printTemplates[index] = {
      ...printTemplates[index],
      ...data,
      updatedBy: '赵管理员',
      updatedAt: new Date().toISOString().replace('T', ' ').substring(0, 19)
    };
  }
  return {
    code: 200,
    message: '更新成功',
    data: printTemplates[index],
    timestamp: Date.now()
  };
});

// 删除模版
Mock.mock(/\/api\/v1\/print-templates\/\d+/, 'delete', (options) => {
  const id = options.url.match(/\/api\/v1\/print-templates\/(\d+)/)?.[1];
  const index = printTemplates.findIndex(t => t.id == id);
  if (index !== -1) {
    printTemplates.splice(index, 1);
  }
  return {
    code: 200,
    message: '删除成功',
    data: null,
    timestamp: Date.now()
  };
});

// 发布模版
Mock.mock(/\/api\/v1\/print-templates\/\d+\/publish/, 'post', (options) => {
  const id = options.url.match(/\/api\/v1\/print-templates\/(\d+)\/publish/)?.[1];
  const index = printTemplates.findIndex(t => t.id == id);
  if (index !== -1) {
    printTemplates[index].status = 'published';
    printTemplates[index].updatedBy = '赵管理员';
    printTemplates[index].updatedAt = new Date().toISOString().replace('T', ' ').substring(0, 19);
  }
  return {
    code: 200,
    message: '发布成功',
    data: null,
    timestamp: Date.now()
  };
});

// 取消发布模版
Mock.mock(/\/api\/v1\/print-templates\/\d+\/unpublish/, 'post', (options) => {
  const id = options.url.match(/\/api\/v1\/print-templates\/(\d+)\/unpublish/)?.[1];
  const index = printTemplates.findIndex(t => t.id == id);
  if (index !== -1) {
    printTemplates[index].status = 'draft';
    printTemplates[index].updatedBy = '赵管理员';
    printTemplates[index].updatedAt = new Date().toISOString().replace('T', ' ').substring(0, 19);
  }
  return {
    code: 200,
    message: '取消发布成功',
    data: null,
    timestamp: Date.now()
  };
});

// 复制模版
Mock.mock(/\/api\/v1\/print-templates\/\d+\/copy/, 'post', (options) => {
  const id = options.url.match(/\/api\/v1\/print-templates\/(\d+)\/copy/)?.[1];
  const template = printTemplates.find(t => t.id == id);
  if (template) {
    const newTemplate = {
      ...template,
      id: Date.now(),
      templateName: template.templateName + ' (副本)',
      templateCode: template.templateCode + '_COPY',
      status: 'draft',
      isDefault: false,
      createdBy: '赵管理员',
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
      updatedBy: '赵管理员',
      updatedAt: new Date().toISOString().replace('T', ' ').substring(0, 19)
    };
    printTemplates.push(newTemplate);
    return {
      code: 200,
      message: '复制成功',
      data: newTemplate,
      timestamp: Date.now()
    };
  }
  return {
    code: 404,
    message: '模版不存在',
    timestamp: Date.now()
  };
});

// 提取模版中的变量
Mock.mock('/api/v1/print-templates/extract-variables', 'post', (options) => {
  const { content } = JSON.parse(options.body);
  const variableRegex = /\{\{(\w+)\}\}/g;
  const variables = [];
  let match;
  while ((match = variableRegex.exec(content)) !== null) {
    variables.push({
      variableName: match[1],
      variableLabel: match[1],
      variableType: 'text',
      required: true,
      description: ''
    });
  }
  return {
    code: 200,
    message: '提取成功',
    data: { variables },
    timestamp: Date.now()
  };
});

// 验证模版内容
Mock.mock('/api/v1/print-templates/validate', 'post', (options) => {
  const { content } = JSON.parse(options.body);
  const errors = [];
  if (!content || content.trim() === '') {
    errors.push('模版内容不能为空');
  }
  return {
    code: 200,
    message: '验证完成',
    data: {
      valid: errors.length === 0,
      errors
    },
    timestamp: Date.now()
  };
});

// 获取打印配置列表
Mock.mock(/\/api\/v1\/print-configs/, 'get', (options) => {
  const urlParams = new URLSearchParams(options.url.split('?')[1]);
  const page = parseInt(urlParams.get('page')) || 1;
  const pageSize = parseInt(urlParams.get('pageSize')) || 10;
  const businessCode = urlParams.get('businessCode') || '';
  const templateId = urlParams.get('templateId') || '';
  const status = urlParams.get('status') || '';
  
  let filteredConfigs = printConfigs;
  
  if (businessCode) {
    filteredConfigs = filteredConfigs.filter(c => c.businessCode === businessCode);
  }
  if (templateId) {
    filteredConfigs = filteredConfigs.filter(c => c.templateId === templateId);
  }
  if (status) {
    filteredConfigs = filteredConfigs.filter(c => c.status === status);
  }
  
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const list = filteredConfigs.slice(start, end);
  
  return {
    code: 200,
    message: '获取成功',
    data: {
      list,
      total: filteredConfigs.length,
      page,
      pageSize
    },
    timestamp: Date.now()
  };
});

// 获取打印配置详情
Mock.mock(/\/api\/v1\/print-configs\/\d+/, 'get', (options) => {
  const id = options.url.match(/\/api\/v1\/print-configs\/(\d+)/)?.[1];
  const config = printConfigs.find(c => c.id == id) || printConfigs[0];
  return {
    code: 200,
    message: '获取成功',
    data: config,
    timestamp: Date.now()
  };
});

// 创建打印配置
Mock.mock('/api/v1/print-configs', 'post', (options) => {
  const data = JSON.parse(options.body);
  const newConfig = {
    id: Date.now(),
    tenantId: '1',
    ...data,
    status: 'enabled',
    createdBy: '赵管理员',
    createdAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
    updatedBy: '赵管理员',
    updatedAt: new Date().toISOString().replace('T', ' ').substring(0, 19)
  };
  printConfigs.push(newConfig);
  return {
    code: 200,
    message: '创建成功',
    data: newConfig,
    timestamp: Date.now()
  };
});

// 更新打印配置
Mock.mock(/\/api\/v1\/print-configs\/\d+/, 'put', (options) => {
  const id = options.url.match(/\/api\/v1\/print-configs\/(\d+)/)?.[1];
  const data = JSON.parse(options.body);
  const index = printConfigs.findIndex(c => c.id == id);
  if (index !== -1) {
    printConfigs[index] = {
      ...printConfigs[index],
      ...data,
      updatedBy: '赵管理员',
      updatedAt: new Date().toISOString().replace('T', ' ').substring(0, 19)
    };
  }
  return {
    code: 200,
    message: '更新成功',
    data: printConfigs[index],
    timestamp: Date.now()
  };
});

// 删除打印配置
Mock.mock(/\/api\/v1\/print-configs\/\d+/, 'delete', (options) => {
  const id = options.url.match(/\/api\/v1\/print-configs\/(\d+)/)?.[1];
  const index = printConfigs.findIndex(c => c.id == id);
  if (index !== -1) {
    printConfigs.splice(index, 1);
  }
  return {
    code: 200,
    message: '删除成功',
    data: null,
    timestamp: Date.now()
  };
});

// 启用打印配置
Mock.mock(/\/api\/v1\/print-configs\/\d+\/enable/, 'post', (options) => {
  const id = options.url.match(/\/api\/v1\/print-configs\/(\d+)\/enable/)?.[1];
  const index = printConfigs.findIndex(c => c.id == id);
  if (index !== -1) {
    printConfigs[index].status = 'enabled';
    printConfigs[index].updatedBy = '赵管理员';
    printConfigs[index].updatedAt = new Date().toISOString().replace('T', ' ').substring(0, 19);
  }
  return {
    code: 200,
    message: '启用成功',
    data: null,
    timestamp: Date.now()
  };
});

// 禁用打印配置
Mock.mock(/\/api\/v1\/print-configs\/\d+\/disable/, 'post', (options) => {
  const id = options.url.match(/\/api\/v1\/print-configs\/(\d+)\/disable/)?.[1];
  const index = printConfigs.findIndex(c => c.id == id);
  if (index !== -1) {
    printConfigs[index].status = 'disabled';
    printConfigs[index].updatedBy = '赵管理员';
    printConfigs[index].updatedAt = new Date().toISOString().replace('T', ' ').substring(0, 19);
  }
  return {
    code: 200,
    message: '禁用成功',
    data: null,
    timestamp: Date.now()
  };
});

// 获取业务字段列表
Mock.mock(/\/api\/v1\/print-configs\/business-fields\/\w+/, 'get', (options) => {
  const businessCode = options.url.match(/\/api\/v1\/print-configs\/business-fields\/(\w+)/)?.[1];
  const fields = businessFields[businessCode] || [];
  return {
    code: 200,
    message: '获取成功',
    data: { fields },
    timestamp: Date.now()
  };
});

// 验证数据映射
Mock.mock('/api/v1/print-configs/validate-mapping', 'post', (options) => {
  const { businessCode, templateId, dataMapping } = JSON.parse(options.body);
  const errors = [];
  if (!businessCode) {
    errors.push('业务代码不能为空');
  }
  if (!templateId) {
    errors.push('模版ID不能为空');
  }
  if (!dataMapping || !dataMapping.mappings || dataMapping.mappings.length === 0) {
    errors.push('数据映射不能为空');
  }
  return {
    code: 200,
    message: '验证完成',
    data: {
      valid: errors.length === 0,
      errors
    },
    timestamp: Date.now()
  };
});

// 获取打印预览
Mock.mock('/api/v1/print/preview', 'post', (options) => {
  const { businessCode, businessId, templateId } = JSON.parse(options.body);
  const template = printTemplates.find(t => t.id == templateId) || printTemplates[0];
  const printData = printHistory.find(h => h.businessId == businessId)?.printData || {};
  
  let html = template.templateContent;
  if (template.dataMapping && template.dataMapping.mappings) {
    template.dataMapping.mappings.forEach(mapping => {
      const value = printData[mapping.businessField] || '';
      html = html.replace(new RegExp(`\\{\\{${mapping.templateVariable}\\}\\}`, 'g'), value);
    });
  }
  
  return {
    code: 200,
    message: '获取成功',
    data: {
      template,
      data: printData,
      html
    },
    timestamp: Date.now()
  };
});

// 批量打印预览
Mock.mock('/api/v1/print/batch-preview', 'post', (options) => {
  const { businessCode, businessIds, templateId } = JSON.parse(options.body);
  const template = printTemplates.find(t => t.id == templateId) || printTemplates[0];
  
  const items = businessIds.map(businessId => {
    const printData = printHistory.find(h => h.businessId == businessId)?.printData || {};
    let html = template.templateContent;
    if (template.dataMapping && template.dataMapping.mappings) {
      template.dataMapping.mappings.forEach(mapping => {
        const value = printData[mapping.businessField] || '';
        html = html.replace(new RegExp(`\\{\\{${mapping.templateVariable}\\}\\}`, 'g'), value);
      });
    }
    return {
      businessId,
      data: printData,
      html
    };
  });
  
  return {
    code: 200,
    message: '获取成功',
    data: { items },
    timestamp: Date.now()
  };
});

// 获取打印数据
Mock.mock('/api/v1/print/get-data', 'post', (options) => {
  const { businessCode, businessId, templateId } = JSON.parse(options.body);
  const printData = printHistory.find(h => h.businessId == businessId)?.printData || {};
  return {
    code: 200,
    message: '获取成功',
    data: { data: printData },
    timestamp: Date.now()
  };
});

// 获取打印历史列表
Mock.mock(/\/api\/v1\/print-history/, 'get', (options) => {
  const urlParams = new URLSearchParams(options.url.split('?')[1]);
  const page = parseInt(urlParams.get('page')) || 1;
  const pageSize = parseInt(urlParams.get('pageSize')) || 10;
  const businessCode = urlParams.get('businessCode') || '';
  const templateId = urlParams.get('templateId') || '';
  const printedBy = urlParams.get('printedBy') || '';
  const startTime = urlParams.get('startTime') || '';
  const endTime = urlParams.get('endTime') || '';
  
  let filteredHistory = printHistory;
  
  if (businessCode) {
    filteredHistory = filteredHistory.filter(h => h.businessCode === businessCode);
  }
  if (templateId) {
    filteredHistory = filteredHistory.filter(h => h.templateId === templateId);
  }
  if (printedBy) {
    filteredHistory = filteredHistory.filter(h => h.printedBy === printedBy);
  }
  if (startTime) {
    filteredHistory = filteredHistory.filter(h => h.printedAt >= startTime);
  }
  if (endTime) {
    filteredHistory = filteredHistory.filter(h => h.printedAt <= endTime);
  }
  
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const list = filteredHistory.slice(start, end);
  
  return {
    code: 200,
    message: '获取成功',
    data: {
      list,
      total: filteredHistory.length,
      page,
      pageSize
    },
    timestamp: Date.now()
  };
});

// 获取打印统计
Mock.mock('/api/v1/print-history/statistics', 'get', (options) => {
  const urlParams = new URLSearchParams(options.url.split('?')[1]);
  const startTime = urlParams.get('startTime') || '';
  const endTime = urlParams.get('endTime') || '';
  
  let filteredHistory = printHistory;
  if (startTime) {
    filteredHistory = filteredHistory.filter(h => h.printedAt >= startTime);
  }
  if (endTime) {
    filteredHistory = filteredHistory.filter(h => h.printedAt <= endTime);
  }
  
  const templateStats = {};
  const userStats = {};
  const trend = {};
  
  filteredHistory.forEach(h => {
    if (!templateStats[h.templateId]) {
      templateStats[h.templateId] = {
        templateId: h.templateId,
        templateName: h.templateName,
        count: 0
      };
    }
    templateStats[h.templateId].count++;
    
    if (!userStats[h.printedBy]) {
      userStats[h.printedBy] = {
        userId: h.printedBy,
        userName: h.printedBy,
        count: 0
      };
    }
    userStats[h.printedBy].count++;
    
    const date = h.printedAt.split(' ')[0];
    if (!trend[date]) {
      trend[date] = {
        date,
        count: 0
      };
    }
    trend[date].count++;
  });
  
  return {
    code: 200,
    message: '获取成功',
    data: {
      totalCount: filteredHistory.length,
      templateStats: Object.values(templateStats),
      userStats: Object.values(userStats),
      trend: Object.values(trend)
    },
    timestamp: Date.now()
  };
});

// 导出打印历史
Mock.mock(/\/api\/v1\/print-history\/export/, 'get', () => {
  return {
    code: 200,
    message: '导出成功',
    data: printHistory,
    timestamp: Date.now()
  };
});

// 获取可配置打印的业务列表
Mock.mock('/api/v1/print/business-codes', 'get', () => {
  return {
    code: 200,
    message: '获取成功',
    data: businessCodes,
    timestamp: Date.now()
  };
});

// 导出Mock对象
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    printTemplates,
    printConfigs,
    printHistory,
    businessCodes,
    businessFields
  };
}
