-- 菜单配置功能数据库表结构
-- 创建时间: 2026-02-26
-- 版本: 1.0.0

-- 删除已存在的表（如果存在）
DROP TABLE IF EXISTS sys_menu;

-- 创建系统菜单表
CREATE TABLE sys_menu (
  id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '菜单ID',
  parent_id BIGINT DEFAULT 0 COMMENT '父菜单ID，0表示顶级菜单',
  menu_name VARCHAR(50) NOT NULL COMMENT '菜单名称',
  menu_type VARCHAR(10) NOT NULL COMMENT '菜单类型:DIRECTORY-目录,MENU-菜单,BUTTON-按钮',
  menu_icon VARCHAR(50) COMMENT '菜单图标',
  business_code VARCHAR(50) NOT NULL COMMENT '业务代码，用于权限关联',
  menu_path VARCHAR(200) COMMENT '菜单路径',
  component_path VARCHAR(200) COMMENT '组件路径',
  sort_order INT DEFAULT 0 COMMENT '排序序号，数字越小越靠前',
  menu_status VARCHAR(10) DEFAULT 'ENABLED' COMMENT '菜单状态:ENABLED-启用,DISABLED-禁用',
  visible VARCHAR(10) DEFAULT 'TRUE' COMMENT '是否显示:TRUE-显示,FALSE-隐藏',
  menu_desc VARCHAR(500) COMMENT '菜单描述',
  tenant_id BIGINT NOT NULL COMMENT '租户ID',
  create_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  create_by VARCHAR(50) COMMENT '创建人',
  update_by VARCHAR(50) COMMENT '更新人',
  INDEX idx_parent_id (parent_id),
  INDEX idx_business_code (business_code),
  INDEX idx_tenant_id (tenant_id),
  INDEX idx_menu_type (menu_type),
  INDEX idx_menu_status (menu_status),
  UNIQUE KEY uk_business_code_tenant (business_code, tenant_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='系统菜单表';

-- 插入初始菜单数据（9个核心业务领域）
INSERT INTO sys_menu (parent_id, menu_name, menu_type, menu_icon, business_code, menu_path, component_path, sort_order, menu_status, visible, menu_desc, tenant_id) VALUES
-- 一级菜单：工作中心
(0, '工作中心', 'DIRECTORY', 'House', 'WORK_CENTER', '/work-center', NULL, 1, 'ENABLED', 'TRUE', '工作任务与信息中心', 1),

-- 一级菜单：招聘管理
(0, '招聘管理', 'DIRECTORY', 'UserFilled', 'RECRUITMENT', '/recruitment', NULL, 2, 'ENABLED', 'TRUE', '招聘需求与简历管理', 1),

-- 一级菜单：面试管理
(0, '面试管理', 'DIRECTORY', 'ChatDotRound', 'INTERVIEW', '/interview', NULL, 3, 'ENABLED', 'TRUE', '面试全流程管理', 1),

-- 一级菜单：工人管理
(0, '工人管理', 'DIRECTORY', 'User', 'WORKER', '/worker', NULL, 4, 'ENABLED', 'TRUE', '工人信息管理', 1),

-- 一级菜单：合同管理
(0, '合同管理', 'DIRECTORY', 'Document', 'CONTRACT', '/contract', NULL, 5, 'ENABLED', 'TRUE', '合同签订与管理', 1),

-- 一级菜单：在职管理
(0, '在职管理', 'DIRECTORY', 'Briefcase', 'ON_DUTY', '/on-duty', NULL, 6, 'ENABLED', 'TRUE', '在职员工全生命周期管理', 1),

-- 一级菜单：离职管理
(0, '离职管理', 'DIRECTORY', 'SwitchButton', 'RESIGNATION', '/resignation', NULL, 7, 'ENABLED', 'TRUE', '离职流程管理', 1),

-- 一级菜单：结算管理
(0, '结算管理', 'DIRECTORY', 'Money', 'SETTLEMENT', '/settlement', NULL, 8, 'ENABLED', 'TRUE', '结算与佣金管理', 1),

-- 一级菜单：系统管理
(0, '系统管理', 'DIRECTORY', 'Setting', 'SYSTEM', '/system', NULL, 9, 'ENABLED', 'TRUE', '系统配置与管理', 1);

-- 插入工作中心子菜单
INSERT INTO sys_menu (parent_id, menu_name, menu_type, menu_icon, business_code, menu_path, component_path, sort_order, menu_status, visible, menu_desc, tenant_id) VALUES
((SELECT id FROM sys_menu WHERE business_code = 'WORK_CENTER'), '待办任务', 'MENU', 'Task', 'TODO', '/work-center/todo', '/views/admin/work-center/Todo.vue', 1, 'ENABLED', 'TRUE', '待办任务列表', 1),
((SELECT id FROM sys_menu WHERE business_code = 'WORK_CENTER'), '消息中心', 'MENU', 'Message', 'MESSAGE', '/work-center/messages', '/views/admin/work-center/Messages.vue', 2, 'ENABLED', 'TRUE', '消息通知列表', 1),
((SELECT id FROM sys_menu WHERE business_code = 'WORK_CENTER'), '预警信息', 'MENU', 'Warning', 'WARNING', '/work-center/warnings', '/views/admin/work-center/Warnings.vue', 3, 'ENABLED', 'TRUE', '预警信息列表', 1);

-- 插入招聘管理子菜单
INSERT INTO sys_menu (parent_id, menu_name, menu_type, menu_icon, business_code, menu_path, component_path, sort_order, menu_status, visible, menu_desc, tenant_id) VALUES
((SELECT id FROM sys_menu WHERE business_code = 'RECRUITMENT'), '招聘需求', 'MENU', 'Document', 'RECRUITMENT_DEMAND', '/recruitment/demand', '/views/admin/recruitment/Demand.vue', 1, 'ENABLED', 'TRUE', '招聘需求管理', 1),
((SELECT id FROM sys_menu WHERE business_code = 'RECRUITMENT'), '简历管理', 'MENU', 'Files', 'RESUME', '/recruitment/resume', '/views/admin/recruitment/Resume.vue', 2, 'ENABLED', 'TRUE', '简历信息管理', 1);

-- 插入面试管理子菜单
INSERT INTO sys_menu (parent_id, menu_name, menu_type, menu_icon, business_code, menu_path, component_path, sort_order, menu_status, visible, menu_desc, tenant_id) VALUES
((SELECT id FROM sys_menu WHERE business_code = 'INTERVIEW'), '接送管理', 'MENU', 'Van', 'PICKUP', '/interview/pickup', '/views/labor-company/interview/Pickup.vue', 1, 'ENABLED', 'TRUE', '接送工人管理', 1),
((SELECT id FROM sys_menu WHERE business_code = 'INTERVIEW'), '初步面试', 'MENU', 'ChatLineSquare', 'INITIAL_INTERVIEW', '/interview/initial-interview', '/views/labor-company/interview/InitialInterview.vue', 2, 'ENABLED', 'TRUE', '初步面试管理', 1),
((SELECT id FROM sys_menu WHERE business_code = 'INTERVIEW'), '面试邀约', 'MENU', 'Message', 'INTERVIEW_INVITATION', '/interview/invitation', '/views/labor-company/interview/InterviewInvitation.vue', 3, 'ENABLED', 'TRUE', '面试邀约管理', 1),
((SELECT id FROM sys_menu WHERE business_code = 'INTERVIEW'), '工厂面试', 'MENU', 'OfficeBuilding', 'FACTORY_INTERVIEW', '/interview/factory-interview', '/views/labor-company/interview/FactoryInterview.vue', 4, 'ENABLED', 'TRUE', '工厂面试管理', 1);

-- 插入工人管理子菜单
INSERT INTO sys_menu (parent_id, menu_name, menu_type, menu_icon, business_code, menu_path, component_path, sort_order, menu_status, visible, menu_desc, tenant_id) VALUES
((SELECT id FROM sys_menu WHERE business_code = 'WORKER'), '工人信息', 'MENU', 'User', 'WORKER_INFO', '/worker/info', '/views/labor-company/Workers.vue', 1, 'ENABLED', 'TRUE', '工人信息管理', 1);

-- 插入合同管理子菜单
INSERT INTO sys_menu (parent_id, menu_name, menu_type, menu_icon, business_code, menu_path, component_path, sort_order, menu_status, visible, menu_desc, tenant_id) VALUES
((SELECT id FROM sys_menu WHERE business_code = 'CONTRACT'), '签订合同', 'MENU', 'Document', 'CONTRACT_SIGN', '/contract/sign', '/views/labor-company/contract/Contract.vue', 1, 'ENABLED', 'TRUE', '合同签订管理', 1);

-- 插入在职管理子菜单
INSERT INTO sys_menu (parent_id, menu_name, menu_type, menu_icon, business_code, menu_path, component_path, sort_order, menu_status, visible, menu_desc, tenant_id) VALUES
((SELECT id FROM sys_menu WHERE business_code = 'ON_DUTY'), '工作与生活', 'DIRECTORY', 'Coin', 'WORK_LIFE', '/on-duty/work-life', NULL, 1, 'ENABLED', 'TRUE', '工作与生活管理', 1),
((SELECT id FROM sys_menu WHERE business_code = 'ON_DUTY'), '管理与关怀', 'DIRECTORY', 'Star', 'MANAGEMENT_CARE', '/on-duty/management-care', NULL, 2, 'ENABLED', 'TRUE', '管理与关怀', 1),
((SELECT id FROM sys_menu WHERE business_code = 'ON_DUTY'), '特殊情况', 'MENU', 'Warning', 'SPECIAL_CASE', '/on-duty/special-case', '/views/labor-company/on-duty/SpecialCase.vue', 3, 'ENABLED', 'TRUE', '特殊情况管理', 1),
((SELECT id FROM sys_menu WHERE business_code = 'ON_DUTY'), '保险管理', 'DIRECTORY', 'Wallet', 'INSURANCE', '/on-duty/insurance', NULL, 4, 'ENABLED', 'TRUE', '保险管理', 1),
((SELECT id FROM sys_menu WHERE business_code = 'ON_DUTY'), '考勤管理', 'MENU', 'Calendar', 'ATTENDANCE', '/on-duty/attendance', '/views/labor-company/Attendance.vue', 5, 'ENABLED', 'TRUE', '考勤管理', 1),
((SELECT id FROM sys_menu WHERE business_code = 'ON_DUTY'), '请假管理', 'MENU', 'Tickets', 'LEAVE', '/on-duty/leave', '/views/labor-company/on-duty/Leave.vue', 6, 'ENABLED', 'TRUE', '请假管理', 1),
((SELECT id FROM sys_menu WHERE business_code = 'ON_DUTY'), '调岗管理', 'MENU', 'Switch', 'TRANSFER', '/on-duty/transfer', '/views/labor-company/on-duty/Transfer.vue', 7, 'ENABLED', 'TRUE', '调岗管理', 1),
((SELECT id FROM sys_menu WHERE business_code = 'ON_DUTY'), '奖惩管理', 'MENU', 'Medal', 'REWARD_PUNISHMENT', '/on-duty/reward-punishment', '/views/labor-company/on-duty/RewardPunishment.vue', 8, 'ENABLED', 'TRUE', '奖惩管理', 1),
((SELECT id FROM sys_menu WHERE business_code = 'ON_DUTY'), '业务课堂', 'DIRECTORY', 'Reading', 'BUSINESS_CLASS', '/on-duty/business-class', NULL, 9, 'ENABLED', 'TRUE', '业务课堂', 1),
((SELECT id FROM sys_menu WHERE business_code = 'ON_DUTY'), '异常管理', 'MENU', 'CircleClose', 'ABNORMAL', '/on-duty/abnormal', '/views/labor-company/on-duty/Abnormal.vue', 10, 'ENABLED', 'TRUE', '异常管理', 1),
((SELECT id FROM sys_menu WHERE business_code = 'ON_DUTY'), '投诉/建议', 'MENU', 'ChatDotRound', 'COMPLAINT', '/on-duty/complaint', '/views/labor-company/on-duty/Complaint.vue', 11, 'ENABLED', 'TRUE', '投诉建议管理', 1);

-- 插入工作与生活子菜单
INSERT INTO sys_menu (parent_id, menu_name, menu_type, menu_icon, business_code, menu_path, component_path, sort_order, menu_status, visible, menu_desc, tenant_id) VALUES
((SELECT id FROM sys_menu WHERE business_code = 'WORK_LIFE'), '生活费管理', 'MENU', 'Coin', 'LIVING_EXPENSE', '/on-duty/living-expense', '/views/labor-company/on-duty/LivingExpense.vue', 1, 'ENABLED', 'TRUE', '生活费管理', 1),
((SELECT id FROM sys_menu WHERE business_code = 'WORK_LIFE'), '工资管理', 'MENU', 'Money', 'SALARY', '/on-duty/salary', '/views/labor-company/on-duty/Salary.vue', 2, 'ENABLED', 'TRUE', '工资管理', 1),
((SELECT id FROM sys_menu WHERE business_code = 'WORK_LIFE'), '理赔管理', 'MENU', 'Wallet', 'CLAIM', '/on-duty/claim', '/views/labor-company/on-duty/Claim.vue', 3, 'ENABLED', 'TRUE', '理赔管理', 1);

-- 插入管理与关怀子菜单
INSERT INTO sys_menu (parent_id, menu_name, menu_type, menu_icon, business_code, menu_path, component_path, sort_order, menu_status, visible, menu_desc, tenant_id) VALUES
((SELECT id FROM sys_menu WHERE business_code = 'MANAGEMENT_CARE'), '沟通管理', 'MENU', 'ChatLineSquare', 'COMMUNICATION', '/on-duty/communication', '/views/labor-company/on-duty/Communication.vue', 1, 'ENABLED', 'TRUE', '沟通管理', 1),
((SELECT id FROM sys_menu WHERE business_code = 'MANAGEMENT_CARE'), '文娱活动', 'MENU', 'Trophy', 'ENTERTAINMENT', '/on-duty/entertainment', '/views/labor-company/on-duty/Entertainment.vue', 2, 'ENABLED', 'TRUE', '文娱活动管理', 1),
((SELECT id FROM sys_menu WHERE business_code = 'MANAGEMENT_CARE'), '报名管理', 'MENU', 'Tickets', 'REGISTRATION', '/on-duty/registration', '/views/labor-company/on-duty/Registration.vue', 3, 'ENABLED', 'TRUE', '报名管理', 1),
((SELECT id FROM sys_menu WHERE business_code = 'MANAGEMENT_CARE'), '发布资讯', 'MENU', 'Document', 'NEWS', '/on-duty/news', '/views/labor-company/on-duty/News.vue', 4, 'ENABLED', 'TRUE', '资讯发布管理', 1),
((SELECT id FROM sys_menu WHERE business_code = 'MANAGEMENT_CARE'), '社团管理', 'MENU', 'UserFilled', 'COMMUNITY', '/on-duty/community', '/views/labor-company/on-duty/Community.vue', 5, 'ENABLED', 'TRUE', '社团管理', 1);

-- 插入保险管理子菜单
INSERT INTO sys_menu (parent_id, menu_name, menu_type, menu_icon, business_code, menu_path, component_path, sort_order, menu_status, visible, menu_desc, tenant_id) VALUES
((SELECT id FROM sys_menu WHERE business_code = 'INSURANCE'), '保险管理', 'MENU', 'Wallet', 'INSURANCE_MANAGE', '/on-duty/insurance-manage', '/views/labor-company/on-duty/Insurance.vue', 1, 'ENABLED', 'TRUE', '保险管理', 1),
((SELECT id FROM sys_menu WHERE business_code = 'INSURANCE'), '理赔管理', 'MENU', 'Money', 'INSURANCE_CLAIM', '/on-duty/insurance-claim', '/views/labor-company/on-duty/InsuranceRecord.vue', 2, 'ENABLED', 'TRUE', '理赔管理', 1),
((SELECT id FROM sys_menu WHERE business_code = 'INSURANCE'), '参保登记', 'MENU', 'Document', 'INSURANCE_REGISTER', '/on-duty/insurance-register', '/views/labor-company/on-duty/InsuranceRecord.vue', 3, 'ENABLED', 'TRUE', '参保登记', 1);

-- 插入业务课堂子菜单
INSERT INTO sys_menu (parent_id, menu_name, menu_type, menu_icon, business_code, menu_path, component_path, sort_order, menu_status, visible, menu_desc, tenant_id) VALUES
((SELECT id FROM sys_menu WHERE business_code = 'BUSINESS_CLASS'), '学习材料', 'MENU', 'Document', 'LEARNING_MATERIAL', '/on-duty/learning-material', '/views/labor-company/on-duty/LearningMaterial.vue', 1, 'ENABLED', 'TRUE', '学习材料管理', 1),
((SELECT id FROM sys_menu WHERE business_code = 'BUSINESS_CLASS'), '题库管理', 'MENU', 'Notebook', 'QUESTION_BANK', '/on-duty/question-bank', '/views/labor-company/on-duty/QuestionBank.vue', 2, 'ENABLED', 'TRUE', '题库管理', 1),
((SELECT id FROM sys_menu WHERE business_code = 'BUSINESS_CLASS'), '学习时长管理', 'MENU', 'Clock', 'LEARNING_TIME', '/on-duty/learning-time', '/views/labor-company/on-duty/LearningTime.vue', 3, 'ENABLED', 'TRUE', '学习时长管理', 1),
((SELECT id FROM sys_menu WHERE business_code = 'BUSINESS_CLASS'), '考试管理', 'MENU', 'Edit', 'EXAM', '/on-duty/exam', '/views/labor-company/on-duty/Exam.vue', 4, 'ENABLED', 'TRUE', '考试管理', 1),
((SELECT id FROM sys_menu WHERE business_code = 'BUSINESS_CLASS'), '考试成绩', 'MENU', 'DataLine', 'EXAM_RESULT', '/on-duty/exam-result', '/views/labor-company/on-duty/ExamResult.vue', 5, 'ENABLED', 'TRUE', '考试成绩管理', 1);

-- 插入离职管理子菜单
INSERT INTO sys_menu (parent_id, menu_name, menu_type, menu_icon, business_code, menu_path, component_path, sort_order, menu_status, visible, menu_desc, tenant_id) VALUES
((SELECT id FROM sys_menu WHERE business_code = 'RESIGNATION'), '离职管理', 'MENU', 'SwitchButton', 'RESIGNATION_MANAGE', '/resignation/manage', '/views/labor-company/resignation/Resignation.vue', 1, 'ENABLED', 'TRUE', '离职管理', 1);

-- 插入结算管理子菜单
INSERT INTO sys_menu (parent_id, menu_name, menu_type, menu_icon, business_code, menu_path, component_path, sort_order, menu_status, visible, menu_desc, tenant_id) VALUES
((SELECT id FROM sys_menu WHERE business_code = 'SETTLEMENT'), '工作转介绍', 'DIRECTORY', 'Share', 'REFERRAL', '/settlement/referral', NULL, 1, 'ENABLED', 'TRUE', '工作转介绍', 1),
((SELECT id FROM sys_menu WHERE business_code = 'SETTLEMENT'), '结算管理', 'MENU', 'Money', 'SETTLEMENT_MANAGE', '/settlement/manage', '/views/labor-company/settlement/Settlement.vue', 2, 'ENABLED', 'TRUE', '结算管理', 1);

-- 插入工作转介绍子菜单
INSERT INTO sys_menu (parent_id, menu_name, menu_type, menu_icon, business_code, menu_path, component_path, sort_order, menu_status, visible, menu_desc, tenant_id) VALUES
((SELECT id FROM sys_menu WHERE business_code = 'REFERRAL'), '工作转介绍', 'MENU', 'Share', 'REFERRAL_MANAGE', '/settlement/referral-manage', '/views/labor-company/referral/Referral.vue', 1, 'ENABLED', 'TRUE', '工作转介绍管理', 1),
((SELECT id FROM sys_menu WHERE business_code = 'REFERRAL'), '佣金发放', 'MENU', 'Money', 'COMMISSION', '/settlement/commission', '/views/labor-company/commission/Commission.vue', 2, 'ENABLED', 'TRUE', '佣金发放管理', 1);

-- 插入系统管理子菜单
INSERT INTO sys_menu (parent_id, menu_name, menu_type, menu_icon, business_code, menu_path, component_path, sort_order, menu_status, visible, menu_desc, tenant_id) VALUES
((SELECT id FROM sys_menu WHERE business_code = 'SYSTEM'), '企业介绍', 'DIRECTORY', 'OfficeBuilding', 'COMPANY_INTRO', '/system/company-intro', NULL, 1, 'ENABLED', 'TRUE', '企业介绍管理', 1),
((SELECT id FROM sys_menu WHERE business_code = 'SYSTEM'), '部门管理', 'MENU', 'Organization', 'DEPARTMENT', '/system/department', '/views/admin/system/Department.vue', 2, 'ENABLED', 'TRUE', '部门管理', 1),
((SELECT id FROM sys_menu WHERE business_code = 'SYSTEM'), '正式员工', 'MENU', 'User', 'EMPLOYEE', '/system/employee', '/views/admin/system/Employee.vue', 3, 'ENABLED', 'TRUE', '正式员工管理', 1),
((SELECT id FROM sys_menu WHERE business_code = 'SYSTEM'), '岗位管理', 'MENU', 'Avatar', 'ROLE', '/system/role', '/views/admin/system/Role.vue', 4, 'ENABLED', 'TRUE', '岗位管理', 1),
((SELECT id FROM sys_menu WHERE business_code = 'SYSTEM'), '规则配置', 'MENU', 'List', 'RULE_CONFIG', '/system/rule-config', '/views/admin/system/RuleConfig.vue', 5, 'ENABLED', 'TRUE', '规则配置', 1),
((SELECT id FROM sys_menu WHERE business_code = 'SYSTEM'), '菜单配置', 'MENU', 'Menu', 'MENU_CONFIG', '/system/menu-config', '/views/admin/system/MenuConfig.vue', 6, 'ENABLED', 'TRUE', '菜单配置', 1),
((SELECT id FROM sys_menu WHERE business_code = 'SYSTEM'), '字典管理', 'MENU', 'Notebook', 'DICTIONARY', '/system/dictionary', '/views/admin/system/Dictionary.vue', 7, 'ENABLED', 'TRUE', '字典管理', 1),
((SELECT id FROM sys_menu WHERE business_code = 'SYSTEM'), '系统参数', 'MENU', 'Tools', 'SYSTEM_PARAM', '/system/system-param', '/views/admin/system/SystemParam.vue', 8, 'ENABLED', 'TRUE', '系统参数管理', 1),
((SELECT id FROM sys_menu WHERE business_code = 'SYSTEM'), '流程管理', 'MENU', 'Operation', 'PROCESS', '/system/process', '/views/admin/system/Process.vue', 9, 'ENABLED', 'TRUE', '流程管理', 1),
((SELECT id FROM sys_menu WHERE business_code = 'SYSTEM'), '流程配置', 'MENU', 'Connection', 'PROCESS_CONFIG', '/system/process-config', '/views/admin/system/ProcessConfig.vue', 10, 'ENABLED', 'TRUE', '流程配置', 1),
((SELECT id FROM sys_menu WHERE business_code = 'SYSTEM'), '附件管理', 'MENU', 'Folder', 'ATTACHMENT', '/system/attachment', '/views/admin/system/Attachment.vue', 11, 'ENABLED', 'TRUE', '附件管理', 1),
((SELECT id FROM sys_menu WHERE business_code = 'SYSTEM'), '打印管理', 'DIRECTORY', 'Printer', 'PRINT', '/system/print', NULL, 12, 'ENABLED', 'TRUE', '打印管理', 1);

-- 插入企业介绍子菜单
INSERT INTO sys_menu (parent_id, menu_name, menu_type, menu_icon, business_code, menu_path, component_path, sort_order, menu_status, visible, menu_desc, tenant_id) VALUES
((SELECT id FROM sys_menu WHERE business_code = 'COMPANY_INTRO'), '企业文化介绍', 'MENU', 'OfficeBuilding', 'COMPANY_CULTURE', '/system/company-culture', '/views/admin/system/CompanyCulture.vue', 1, 'ENABLED', 'TRUE', '企业文化介绍', 1),
((SELECT id FROM sys_menu WHERE business_code = 'COMPANY_INTRO'), '岗位文化介绍', 'MENU', 'Avatar', 'JOB_CULTURE', '/system/job-culture', '/views/admin/system/JobCulture.vue', 2, 'ENABLED', 'TRUE', '岗位文化介绍', 1);

-- 插入打印管理子菜单
INSERT INTO sys_menu (parent_id, menu_name, menu_type, menu_icon, business_code, menu_path, component_path, sort_order, menu_status, visible, menu_desc, tenant_id) VALUES
((SELECT id FROM sys_menu WHERE business_code = 'PRINT'), '模版配置', 'MENU', 'Document', 'PRINT_TEMPLATE', '/system/print-template', '/views/admin/system/PrintTemplate.vue', 1, 'ENABLED', 'TRUE', '打印模版配置', 1),
((SELECT id FROM sys_menu WHERE business_code = 'PRINT'), '打印配置', 'MENU', 'Setting', 'PRINT_CONFIG', '/system/print-config', '/views/admin/system/PrintConfig.vue', 2, 'ENABLED', 'TRUE', '打印配置', 1);

-- 插入菜单配置页面的按钮权限
INSERT INTO sys_menu (parent_id, menu_name, menu_type, menu_icon, business_code, menu_path, component_path, sort_order, menu_status, visible, menu_desc, tenant_id) VALUES
((SELECT id FROM sys_menu WHERE business_code = 'MENU_CONFIG'), '新增菜单', 'BUTTON', NULL, 'MENU_CONFIG_CREATE', NULL, NULL, 1, 'ENABLED', 'TRUE', '新增菜单按钮', 1),
((SELECT id FROM sys_menu WHERE business_code = 'MENU_CONFIG'), '编辑菜单', 'BUTTON', NULL, 'MENU_CONFIG_UPDATE', NULL, NULL, 2, 'ENABLED', 'TRUE', '编辑菜单按钮', 1),
((SELECT id FROM sys_menu WHERE business_code = 'MENU_CONFIG'), '删除菜单', 'BUTTON', NULL, 'MENU_CONFIG_DELETE', NULL, NULL, 3, 'ENABLED', 'TRUE', '删除菜单按钮', 1),
((SELECT id FROM sys_menu WHERE business_code = 'MENU_CONFIG'), '查看菜单', 'BUTTON', NULL, 'MENU_CONFIG_VIEW', NULL, NULL, 4, 'ENABLED', 'TRUE', '查看菜单按钮', 1);

-- 创建菜单权限关联表
DROP TABLE IF EXISTS sys_role_menu;

CREATE TABLE sys_role_menu (
  id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '主键ID',
  role_id BIGINT NOT NULL COMMENT '角色ID',
  menu_id BIGINT NOT NULL COMMENT '菜单ID',
  tenant_id BIGINT NOT NULL COMMENT '租户ID',
  create_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  create_by VARCHAR(50) COMMENT '创建人',
  INDEX idx_role_id (role_id),
  INDEX idx_menu_id (menu_id),
  INDEX idx_tenant_id (tenant_id),
  UNIQUE KEY uk_role_menu_tenant (role_id, menu_id, tenant_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='角色菜单关联表';

-- 创建菜单操作日志表
DROP TABLE IF EXISTS sys_menu_log;

CREATE TABLE sys_menu_log (
  id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '主键ID',
  menu_id BIGINT COMMENT '菜单ID',
  operation_type VARCHAR(20) NOT NULL COMMENT '操作类型:CREATE-创建,UPDATE-更新,DELETE-删除',
  operation_content TEXT COMMENT '操作内容',
  operator_id BIGINT NOT NULL COMMENT '操作人ID',
  operator_name VARCHAR(50) COMMENT '操作人姓名',
  tenant_id BIGINT NOT NULL COMMENT '租户ID',
  create_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '操作时间',
  INDEX idx_menu_id (menu_id),
  INDEX idx_operator_id (operator_id),
  INDEX idx_tenant_id (tenant_id),
  INDEX idx_create_time (create_time)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='菜单操作日志表';
