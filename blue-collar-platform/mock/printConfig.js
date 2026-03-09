// 打印管理模拟数据

// 业务代码列表
const businessCodes = [
  { code: 'worker_info', name: '工人信息', description: '工人基本信息打印' },
  { code: 'contract', name: '合同信息', description: '合同打印' },
  { code: 'attendance', name: '考勤记录', description: '考勤记录打印' },
  { code: 'salary', name: '工资单', description: '工资单打印' },
  { code: 'leave', name: '请假单', description: '请假单打印' },
  { code: 'transfer', name: '调岗单', description: '调岗单打印' },
  { code: 'resignation', name: '离职单', description: '离职单打印' },
  { code: 'insurance', name: '保险单', description: '保险单打印' }
];

// 打印模板列表
const printTemplates = [
  {
    id: '1',
    templateName: '工人信息模板',
    templateCode: 'worker_info_template',
    templateType: 'form',
    status: 'published',
    variables: [
      { variableName: 'workerName', variableLabel: '工人姓名', variableType: 'text', required: true },
      { variableName: 'workerId', variableLabel: '工号', variableType: 'text', required: true },
      { variableName: 'idCard', variableLabel: '身份证号', variableType: 'text', required: true },
      { variableName: 'phone', variableLabel: '手机号', variableType: 'text', required: true },
      { variableName: 'hireDate', variableLabel: '入职日期', variableType: 'date', required: true }
    ]
  },
  {
    id: '2',
    templateName: '合同模板',
    templateCode: 'contract_template',
    templateType: 'contract',
    status: 'published',
    variables: [
      { variableName: 'contractNo', variableLabel: '合同编号', variableType: 'text', required: true },
      { variableName: 'workerName', variableLabel: '工人姓名', variableType: 'text', required: true },
      { variableName: 'companyName', variableLabel: '公司名称', variableType: 'text', required: true },
      { variableName: 'startDate', variableLabel: '开始日期', variableType: 'date', required: true },
      { variableName: 'endDate', variableLabel: '结束日期', variableType: 'date', required: true }
    ]
  },
  {
    id: '3',
    templateName: '考勤记录模板',
    templateCode: 'attendance_template',
    templateType: 'form',
    status: 'published',
    variables: [
      { variableName: 'workerName', variableLabel: '工人姓名', variableType: 'text', required: true },
      { variableName: 'workerId', variableLabel: '工号', variableType: 'text', required: true },
      { variableName: 'month', variableLabel: '月份', variableType: 'text', required: true },
      { variableName: 'totalDays', variableLabel: '总天数', variableType: 'number', required: true },
      { variableName: 'absentDays', variableLabel: '缺勤天数', variableType: 'number', required: true }
    ]
  },
  {
    id: '4',
    templateName: '工资单模板',
    templateCode: 'salary_template',
    templateType: 'form',
    status: 'published',
    variables: [
      { variableName: 'workerName', variableLabel: '工人姓名', variableType: 'text', required: true },
      { variableName: 'workerId', variableLabel: '工号', variableType: 'text', required: true },
      { variableName: 'month', variableLabel: '月份', variableType: 'text', required: true },
      { variableName: 'basicSalary', variableLabel: '基本工资', variableType: 'number', required: true },
      { variableName: 'overtimeSalary', variableLabel: '加班费', variableType: 'number', required: true },
      { variableName: 'totalSalary', variableLabel: '总工资', variableType: 'number', required: true }
    ]
  }
];

// 业务字段
const businessFields = {
  worker_info: [
    { fieldName: 'name', fieldLabel: '姓名', fieldType: 'text' },
    { fieldName: 'id', fieldLabel: '工号', fieldType: 'text' },
    { fieldName: 'idCard', fieldLabel: '身份证号', fieldType: 'text' },
    { fieldName: 'phone', fieldLabel: '手机号', fieldType: 'text' },
    { fieldName: 'hireDate', fieldLabel: '入职日期', fieldType: 'date' },
    { fieldName: 'gender', fieldLabel: '性别', fieldType: 'select' },
    { fieldName: 'age', fieldLabel: '年龄', fieldType: 'number' },
    { fieldName: 'address', fieldLabel: '地址', fieldType: 'text' }
  ],
  contract: [
    { fieldName: 'contractNo', fieldLabel: '合同编号', fieldType: 'text' },
    { fieldName: 'workerName', fieldLabel: '工人姓名', fieldType: 'text' },
    { fieldName: 'companyName', fieldLabel: '公司名称', fieldType: 'text' },
    { fieldName: 'startDate', fieldLabel: '开始日期', fieldType: 'date' },
    { fieldName: 'endDate', fieldLabel: '结束日期', fieldType: 'date' },
    { fieldName: 'salary', fieldLabel: '薪资', fieldType: 'number' },
    { fieldName: 'position', fieldLabel: '职位', fieldType: 'text' }
  ],
  attendance: [
    { fieldName: 'workerName', fieldLabel: '工人姓名', fieldType: 'text' },
    { fieldName: 'workerId', fieldLabel: '工号', fieldType: 'text' },
    { fieldName: 'month', fieldLabel: '月份', fieldType: 'text' },
    { fieldName: 'totalDays', fieldLabel: '总天数', fieldType: 'number' },
    { fieldName: 'absentDays', fieldLabel: '缺勤天数', fieldType: 'number' },
    { fieldName: 'lateDays', fieldLabel: '迟到天数', fieldType: 'number' },
    { fieldName: 'overtimeDays', fieldLabel: '加班天数', fieldType: 'number' }
  ],
  salary: [
    { fieldName: 'workerName', fieldLabel: '工人姓名', fieldType: 'text' },
    { fieldName: 'workerId', fieldLabel: '工号', fieldType: 'text' },
    { fieldName: 'month', fieldLabel: '月份', fieldType: 'text' },
    { fieldName: 'basicSalary', fieldLabel: '基本工资', fieldType: 'number' },
    { fieldName: 'overtimeSalary', fieldLabel: '加班费', fieldType: 'number' },
    { fieldName: 'allowance', fieldLabel: '津贴', fieldType: 'number' },
    { fieldName: 'deduction', fieldLabel: '扣除', fieldType: 'number' },
    { fieldName: 'totalSalary', fieldLabel: '总工资', fieldType: 'number' }
  ],
  leave: [
    { fieldName: 'workerName', fieldLabel: '工人姓名', fieldType: 'text' },
    { fieldName: 'workerId', fieldLabel: '工号', fieldType: 'text' },
    { fieldName: 'leaveType', fieldLabel: '请假类型', fieldType: 'select' },
    { fieldName: 'startDate', fieldLabel: '开始日期', fieldType: 'date' },
    { fieldName: 'endDate', fieldLabel: '结束日期', fieldType: 'date' },
    { fieldName: 'days', fieldLabel: '天数', fieldType: 'number' },
    { fieldName: 'reason', fieldLabel: '原因', fieldType: 'text' }
  ],
  transfer: [
    { fieldName: 'workerName', fieldLabel: '工人姓名', fieldType: 'text' },
    { fieldName: 'workerId', fieldLabel: '工号', fieldType: 'text' },
    { fieldName: 'oldDepartment', fieldLabel: '原部门', fieldType: 'text' },
    { fieldName: 'newDepartment', fieldLabel: '新部门', fieldType: 'text' },
    { fieldName: 'oldPosition', fieldLabel: '原职位', fieldType: 'text' },
    { fieldName: 'newPosition', fieldLabel: '新职位', fieldType: 'text' },
    { fieldName: 'transferDate', fieldLabel: '调岗日期', fieldType: 'date' },
    { fieldName: 'reason', fieldLabel: '原因', fieldType: 'text' }
  ],
  resignation: [
    { fieldName: 'workerName', fieldLabel: '工人姓名', fieldType: 'text' },
    { fieldName: 'workerId', fieldLabel: '工号', fieldType: 'text' },
    { fieldName: 'resignationDate', fieldLabel: '离职日期', fieldType: 'date' },
    { fieldName: 'reason', fieldLabel: '离职原因', fieldType: 'text' },
    { fieldName: 'handoverPerson', fieldLabel: '交接人', fieldType: 'text' },
    { fieldName: 'status', fieldLabel: '状态', fieldType: 'select' }
  ],
  insurance: [
    { fieldName: 'workerName', fieldLabel: '工人姓名', fieldType: 'text' },
    { fieldName: 'workerId', fieldLabel: '工号', fieldType: 'text' },
    { fieldName: 'insuranceType', fieldLabel: '保险类型', fieldType: 'select' },
    { fieldName: 'startDate', fieldLabel: '开始日期', fieldType: 'date' },
    { fieldName: 'endDate', fieldLabel: '结束日期', fieldType: 'date' },
    { fieldName: 'amount', fieldLabel: '保险金额', fieldType: 'number' },
    { fieldName: 'company', fieldLabel: '保险公司', fieldType: 'text' }
  ]
};

// 打印配置数据
const printConfigs = [
  {
    id: '1',
    businessCode: 'worker_info',
    businessName: '工人信息',
    templateId: '1',
    templateName: '工人信息模板',
    dataMapping: {
      mappings: [
        { businessField: 'name', templateVariable: 'workerName', mappingType: 'direct' },
        { businessField: 'id', templateVariable: 'workerId', mappingType: 'direct' },
        { businessField: 'idCard', templateVariable: 'idCard', mappingType: 'direct' },
        { businessField: 'phone', templateVariable: 'phone', mappingType: 'direct' },
        { businessField: 'hireDate', templateVariable: 'hireDate', mappingType: 'direct' }
      ]
    },
    printSettings: {
      copies: 1,
      quality: 'medium',
      orientation: 'portrait',
      paperSize: 'A4'
    },
    status: 'enabled',
    createdBy: 'admin',
    createdAt: new Date('2024-01-01 10:00:00'),
    updatedBy: 'admin',
    updatedAt: new Date('2024-01-01 10:00:00')
  },
  {
    id: '2',
    businessCode: 'contract',
    businessName: '合同信息',
    templateId: '2',
    templateName: '合同模板',
    dataMapping: {
      mappings: [
        { businessField: 'contractNo', templateVariable: 'contractNo', mappingType: 'direct' },
        { businessField: 'workerName', templateVariable: 'workerName', mappingType: 'direct' },
        { businessField: 'companyName', templateVariable: 'companyName', mappingType: 'direct' },
        { businessField: 'startDate', templateVariable: 'startDate', mappingType: 'direct' },
        { businessField: 'endDate', templateVariable: 'endDate', mappingType: 'direct' }
      ]
    },
    printSettings: {
      copies: 2,
      quality: 'high',
      orientation: 'portrait',
      paperSize: 'A4'
    },
    status: 'enabled',
    createdBy: 'admin',
    createdAt: new Date('2024-01-02 14:30:00'),
    updatedBy: 'admin',
    updatedAt: new Date('2024-01-02 14:30:00')
  },
  {
    id: '3',
    businessCode: 'attendance',
    businessName: '考勤记录',
    templateId: '3',
    templateName: '考勤记录模板',
    dataMapping: {
      mappings: [
        { businessField: 'workerName', templateVariable: 'workerName', mappingType: 'direct' },
        { businessField: 'workerId', templateVariable: 'workerId', mappingType: 'direct' },
        { businessField: 'month', templateVariable: 'month', mappingType: 'direct' },
        { businessField: 'totalDays', templateVariable: 'totalDays', mappingType: 'direct' },
        { businessField: 'absentDays', templateVariable: 'absentDays', mappingType: 'direct' }
      ]
    },
    printSettings: {
      copies: 1,
      quality: 'medium',
      orientation: 'landscape',
      paperSize: 'A4'
    },
    status: 'disabled',
    createdBy: 'admin',
    createdAt: new Date('2024-01-03 09:15:00'),
    updatedBy: 'admin',
    updatedAt: new Date('2024-01-03 09:15:00')
  },
  {
    id: '4',
    businessCode: 'salary',
    businessName: '工资单',
    templateId: '4',
    templateName: '工资单模板',
    dataMapping: {
      mappings: [
        { businessField: 'workerName', templateVariable: 'workerName', mappingType: 'direct' },
        { businessField: 'workerId', templateVariable: 'workerId', mappingType: 'direct' },
        { businessField: 'month', templateVariable: 'month', mappingType: 'direct' },
        { businessField: 'basicSalary', templateVariable: 'basicSalary', mappingType: 'direct' },
        { businessField: 'overtimeSalary', templateVariable: 'overtimeSalary', mappingType: 'direct' },
        { businessField: 'totalSalary', templateVariable: 'totalSalary', mappingType: 'direct' }
      ]
    },
    printSettings: {
      copies: 1,
      quality: 'high',
      orientation: 'portrait',
      paperSize: 'A4'
    },
    status: 'enabled',
    createdBy: 'admin',
    createdAt: new Date('2024-01-04 16:45:00'),
    updatedBy: 'admin',
    updatedAt: new Date('2024-01-04 16:45:00')
  }
];

// 模拟API响应
const printConfigMock = {
  // 获取打印配置列表
  'GET /api/v1/print-configs': (config) => {
    const { page = 1, pageSize = 10, menuId } = config.params;
    const start = (page - 1) * pageSize;
    const end = start + parseInt(pageSize);
    
    // 模拟根据menuId过滤，这里简单返回所有数据
    const filteredConfigs = printConfigs;
    const paginatedConfigs = filteredConfigs.slice(start, end);
    
    return {
      code: 200,
      message: 'success',
      data: {
        list: paginatedConfigs,
        total: filteredConfigs.length,
        page: parseInt(page),
        pageSize: parseInt(pageSize)
      },
      timestamp: Date.now()
    };
  },
  
  // 获取业务代码列表
  'GET /api/v1/print/business-codes': () => {
    return {
      code: 200,
      message: 'success',
      data: businessCodes,
      timestamp: Date.now()
    };
  },
  
  // 获取打印模板列表
  'GET /api/v1/print-templates': (config) => {
    const { page = 1, pageSize = 10, status, keyword } = config.params;
    let filteredTemplates = printTemplates;
    
    if (status) {
      filteredTemplates = printTemplates.filter(template => template.status === status);
    }
    
    if (keyword) {
      const lowerKeyword = keyword.toLowerCase();
      filteredTemplates = filteredTemplates.filter(template => 
        template.templateName.toLowerCase().includes(lowerKeyword) ||
        template.templateCode.toLowerCase().includes(lowerKeyword)
      );
    }
    
    const start = (page - 1) * pageSize;
    const end = start + parseInt(pageSize);
    const paginatedTemplates = filteredTemplates.slice(start, end);
    
    return {
      code: 200,
      message: 'success',
      data: {
        list: paginatedTemplates,
        total: filteredTemplates.length,
        page: parseInt(page),
        pageSize: parseInt(pageSize)
      },
      timestamp: Date.now()
    };
  },
  
  // 获取模板详情（包含变量）
  'GET /api/v1/print-templates/:id': (config) => {
    const { id } = config.params;
    const template = printTemplates.find(t => t.id === id);
    
    if (template) {
      return {
        code: 200,
        message: 'success',
        data: template,
        timestamp: Date.now()
      };
    } else {
      return {
        code: 404,
        message: 'Template not found',
        data: null,
        timestamp: Date.now()
      };
    }
  },
  
  // 新增模板
  'POST /api/v1/print-templates': (config) => {
    const newTemplate = JSON.parse(config.body);
    const id = (printTemplates.length + 1).toString();
    
    const templateToAdd = {
      ...newTemplate,
      id,
      tenantId: '1',
      isDefault: false,
      tags: [],
      createdBy: 'admin',
      createdAt: new Date(),
      updatedBy: 'admin',
      updatedAt: new Date()
    };
    
    printTemplates.push(templateToAdd);
    
    return {
      code: 200,
      message: 'success',
      data: templateToAdd,
      timestamp: Date.now()
    };
  },
  
  // 更新模板
  'PUT /api/v1/print-templates/:id': (config) => {
    const { id } = config.params;
    const updatedTemplate = JSON.parse(config.body);
    const index = printTemplates.findIndex(t => t.id === id);
    
    if (index !== -1) {
      printTemplates[index] = {
        ...printTemplates[index],
        ...updatedTemplate,
        updatedBy: 'admin',
        updatedAt: new Date()
      };
      
      return {
        code: 200,
        message: 'success',
        data: printTemplates[index],
        timestamp: Date.now()
      };
    } else {
      return {
        code: 404,
        message: 'Template not found',
        data: null,
        timestamp: Date.now()
      };
    }
  },
  
  // 删除模板
  'DELETE /api/v1/print-templates/:id': (config) => {
    const { id } = config.params;
    const index = printTemplates.findIndex(t => t.id === id);
    
    if (index !== -1) {
      printTemplates.splice(index, 1);
      return {
        code: 200,
        message: 'success',
        data: null,
        timestamp: Date.now()
      };
    } else {
      return {
        code: 404,
        message: 'Template not found',
        data: null,
        timestamp: Date.now()
      };
    }
  },
  
  // 发布模板
  'POST /api/v1/print-templates/:id/publish': (config) => {
    const { id } = config.params;
    const index = printTemplates.findIndex(t => t.id === id);
    
    if (index !== -1) {
      printTemplates[index].status = 'published';
      printTemplates[index].updatedBy = 'admin';
      printTemplates[index].updatedAt = new Date();
      
      return {
        code: 200,
        message: 'success',
        data: printTemplates[index],
        timestamp: Date.now()
      };
    } else {
      return {
        code: 404,
        message: 'Template not found',
        data: null,
        timestamp: Date.now()
      };
    }
  },
  
  // 取消发布模板
  'POST /api/v1/print-templates/:id/unpublish': (config) => {
    const { id } = config.params;
    const index = printTemplates.findIndex(t => t.id === id);
    
    if (index !== -1) {
      printTemplates[index].status = 'draft';
      printTemplates[index].updatedBy = 'admin';
      printTemplates[index].updatedAt = new Date();
      
      return {
        code: 200,
        message: 'success',
        data: printTemplates[index],
        timestamp: Date.now()
      };
    } else {
      return {
        code: 404,
        message: 'Template not found',
        data: null,
        timestamp: Date.now()
      };
    }
  },
  
  // 获取业务字段
  'GET /api/v1/print-configs/business-fields/:businessCode': (config) => {
    const { businessCode } = config.params;
    const fields = businessFields[businessCode];
    
    if (fields) {
      return {
        code: 200,
        message: 'success',
        data: { fields },
        timestamp: Date.now()
      };
    } else {
      return {
        code: 404,
        message: 'Business code not found',
        data: null,
        timestamp: Date.now()
      };
    }
  },
  
  // 新增打印配置
  'POST /api/v1/print-configs': (config) => {
    const newConfig = JSON.parse(config.body);
    const id = (printConfigs.length + 1).toString();
    
    const configToAdd = {
      ...newConfig,
      id,
      tenantId: '1',
      createdBy: 'admin',
      createdAt: new Date(),
      updatedBy: 'admin',
      updatedAt: new Date()
    };
    
    printConfigs.push(configToAdd);
    
    return {
      code: 200,
      message: 'success',
      data: configToAdd,
      timestamp: Date.now()
    };
  },
  
  // 更新打印配置
  'PUT /api/v1/print-configs/:id': (config) => {
    const { id } = config.params;
    const updatedConfig = JSON.parse(config.body);
    const index = printConfigs.findIndex(c => c.id === id);
    
    if (index !== -1) {
      printConfigs[index] = {
        ...printConfigs[index],
        ...updatedConfig,
        updatedBy: 'admin',
        updatedAt: new Date()
      };
      
      return {
        code: 200,
        message: 'success',
        data: printConfigs[index],
        timestamp: Date.now()
      };
    } else {
      return {
        code: 404,
        message: 'Config not found',
        data: null,
        timestamp: Date.now()
      };
    }
  },
  
  // 删除打印配置
  'DELETE /api/v1/print-configs/:id': (config) => {
    const { id } = config.params;
    const index = printConfigs.findIndex(c => c.id === id);
    
    if (index !== -1) {
      printConfigs.splice(index, 1);
      return {
        code: 200,
        message: 'success',
        data: null,
        timestamp: Date.now()
      };
    } else {
      return {
        code: 404,
        message: 'Config not found',
        data: null,
        timestamp: Date.now()
      };
    }
  },
  
  // 启用打印配置
  'POST /api/v1/print-configs/:id/enable': (config) => {
    const { id } = config.params;
    const index = printConfigs.findIndex(c => c.id === id);
    
    if (index !== -1) {
      printConfigs[index].status = 'enabled';
      printConfigs[index].updatedBy = 'admin';
      printConfigs[index].updatedAt = new Date();
      
      return {
        code: 200,
        message: 'success',
        data: printConfigs[index],
        timestamp: Date.now()
      };
    } else {
      return {
        code: 404,
        message: 'Config not found',
        data: null,
        timestamp: Date.now()
      };
    }
  },
  
  // 禁用打印配置
  'POST /api/v1/print-configs/:id/disable': (config) => {
    const { id } = config.params;
    const index = printConfigs.findIndex(c => c.id === id);
    
    if (index !== -1) {
      printConfigs[index].status = 'disabled';
      printConfigs[index].updatedBy = 'admin';
      printConfigs[index].updatedAt = new Date();
      
      return {
        code: 200,
        message: 'success',
        data: printConfigs[index],
        timestamp: Date.now()
      };
    } else {
      return {
        code: 404,
        message: 'Config not found',
        data: null,
        timestamp: Date.now()
      };
    }
  }
};

export default printConfigMock;