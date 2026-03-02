-- 流程配置功能数据库表结构
-- 创建时间: 2026-02-26
-- 版本: 1.0.0
-- 说明: 支持审批流程配置、审批记录管理、待办任务管理等功能

-- ============================================
-- 1. 审批流程表（approval_flow）
-- ============================================
DROP TABLE IF EXISTS approval_flow;

CREATE TABLE approval_flow (
  id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '审批流程ID',
  flow_name VARCHAR(100) NOT NULL COMMENT '流程名称',
  flow_code VARCHAR(50) NOT NULL COMMENT '流程编码，唯一标识',
  flow_type VARCHAR(50) NOT NULL COMMENT '流程类型:LEAVE-请假,TRANSFER-调岗,RESIGNATION-离职,REGISTRATION-报名等',
  flow_description TEXT COMMENT '流程描述',
  flow_status VARCHAR(20) DEFAULT 'ENABLED' COMMENT '流程状态:ENABLED-启用,DISABLED-禁用',
  is_default TINYINT(1) DEFAULT 0 COMMENT '是否默认流程:0-否,1-是',
  version INT DEFAULT 1 COMMENT '流程版本号',
  tenant_id BIGINT NOT NULL COMMENT '租户ID',
  create_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  create_by VARCHAR(50) COMMENT '创建人',
  update_by VARCHAR(50) COMMENT '更新人',
  remark VARCHAR(500) COMMENT '备注',
  INDEX idx_flow_code (flow_code),
  INDEX idx_flow_type (flow_type),
  INDEX idx_flow_status (flow_status),
  INDEX idx_tenant_id (tenant_id),
  UNIQUE KEY uk_flow_code_tenant (flow_code, tenant_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='审批流程表';

-- ============================================
-- 2. 审批节点表（approval_node）
-- ============================================
DROP TABLE IF EXISTS approval_node;

CREATE TABLE approval_node (
  id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '审批节点ID',
  flow_id BIGINT NOT NULL COMMENT '审批流程ID',
  node_name VARCHAR(100) NOT NULL COMMENT '节点名称',
  node_code VARCHAR(50) NOT NULL COMMENT '节点编码',
  node_type VARCHAR(20) NOT NULL COMMENT '节点类型:APPROVAL-审批节点,CC-抄送节点,CONDITION-条件节点',
  node_order INT NOT NULL COMMENT '节点顺序，从小到大执行',
  approval_mode VARCHAR(20) DEFAULT 'OR' COMMENT '审批模式:OR-或签(任一人审批即可),AND-会签(所有人都需审批)',
  approver_type VARCHAR(50) NOT NULL COMMENT '审批人类型:ROLE-角色,DEPARTMENT-部门,POSITION-岗位,USER-指定用户,FORM_FIELD-表单字段',
  approver_config TEXT COMMENT '审批人配置，JSON格式存储审批人ID列表或配置规则',
  cc_users TEXT COMMENT '抄送人员，JSON格式存储用户ID列表',
  condition_config TEXT COMMENT '条件配置，JSON格式存储节点跳转条件',
  is_required TINYINT(1) DEFAULT 1 COMMENT '是否必经节点:0-否,1-是',
  auto_approve TINYINT(1) DEFAULT 0 COMMENT '是否自动审批:0-否,1-是',
  timeout_hours INT COMMENT '审批超时时间（小时），0表示不限制',
  timeout_action VARCHAR(50) COMMENT '超时处理:APPROVE-自动通过,REJECT-自动驳回,REMIND-发送提醒',
  tenant_id BIGINT NOT NULL COMMENT '租户ID',
  create_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  create_by VARCHAR(50) COMMENT '创建人',
  update_by VARCHAR(50) COMMENT '更新人',
  remark VARCHAR(500) COMMENT '备注',
  INDEX idx_flow_id (flow_id),
  INDEX idx_node_code (node_code),
  INDEX idx_node_order (node_order),
  INDEX idx_tenant_id (tenant_id),
  CONSTRAINT fk_approval_node_flow FOREIGN KEY (flow_id) REFERENCES approval_flow(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='审批节点表';

-- ============================================
-- 3. 流程配置表（flow_business_config）
-- ============================================
DROP TABLE IF EXISTS flow_business_config;

CREATE TABLE flow_business_config (
  id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '流程配置ID',
  business_code VARCHAR(50) NOT NULL COMMENT '业务代码，关联业务表',
  business_name VARCHAR(100) NOT NULL COMMENT '业务名称',
  flow_id BIGINT NOT NULL COMMENT '审批流程ID',
  is_enabled TINYINT(1) DEFAULT 1 COMMENT '是否启用:0-否,1-是',
  effective_date DATETIME COMMENT '生效日期',
  expiry_date DATETIME COMMENT '失效日期',
  config_description TEXT COMMENT '配置描述',
  tenant_id BIGINT NOT NULL COMMENT '租户ID',
  create_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  create_by VARCHAR(50) COMMENT '创建人',
  update_by VARCHAR(50) COMMENT '更新人',
  remark VARCHAR(500) COMMENT '备注',
  INDEX idx_business_code (business_code),
  INDEX idx_flow_id (flow_id),
  INDEX idx_is_enabled (is_enabled),
  INDEX idx_tenant_id (tenant_id),
  UNIQUE KEY uk_business_code_tenant (business_code, tenant_id),
  CONSTRAINT fk_flow_config_flow FOREIGN KEY (flow_id) REFERENCES approval_flow(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='流程配置表';

-- ============================================
-- 4. 审批记录表（approval_record）
-- ============================================
DROP TABLE IF EXISTS approval_record;

CREATE TABLE approval_record (
  id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '审批记录ID',
  business_code VARCHAR(50) NOT NULL COMMENT '业务代码',
  business_id BIGINT NOT NULL COMMENT '业务数据ID',
  flow_id BIGINT NOT NULL COMMENT '审批流程ID',
  flow_name VARCHAR(100) COMMENT '流程名称',
  node_id BIGINT NOT NULL COMMENT '审批节点ID',
  node_name VARCHAR(100) COMMENT '节点名称',
  approver_id BIGINT NOT NULL COMMENT '审批人ID',
  approver_name VARCHAR(50) COMMENT '审批人姓名',
  approver_dept VARCHAR(100) COMMENT '审批人部门',
  approval_result VARCHAR(20) COMMENT '审批结果:PENDING-待审批,APPROVED-通过,REJECTED-驳回,TRANSFER-转办,DELEGATE-委派',
  approval_comment TEXT COMMENT '审批意见',
  approval_time DATETIME COMMENT '审批时间',
  transfer_to_id BIGINT COMMENT '转办给谁（审批人ID）',
  transfer_to_name VARCHAR(50) COMMENT '转办给谁（审批人姓名）',
  delegate_to_id BIGINT COMMENT '委派给谁（审批人ID）',
  delegate_to_name VARCHAR(50) COMMENT '委派给谁（审批人姓名）',
  attachment_ids TEXT COMMENT '附件ID列表，JSON格式',
  is_current TINYINT(1) DEFAULT 0 COMMENT '是否当前节点:0-否,1-是',
  tenant_id BIGINT NOT NULL COMMENT '租户ID',
  create_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  create_by VARCHAR(50) COMMENT '创建人',
  update_by VARCHAR(50) COMMENT '更新人',
  remark VARCHAR(500) COMMENT '备注',
  INDEX idx_business_code_id (business_code, business_id),
  INDEX idx_flow_id (flow_id),
  INDEX idx_node_id (node_id),
  INDEX idx_approver_id (approver_id),
  INDEX idx_approval_result (approval_result),
  INDEX idx_is_current (is_current),
  INDEX idx_approval_time (approval_time),
  INDEX idx_tenant_id (tenant_id),
  CONSTRAINT fk_approval_record_flow FOREIGN KEY (flow_id) REFERENCES approval_flow(id) ON DELETE CASCADE,
  CONSTRAINT fk_approval_record_node FOREIGN KEY (node_id) REFERENCES approval_node(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='审批记录表';

-- ============================================
-- 5. 业务审批状态表（business_approval_status）
-- ============================================
DROP TABLE IF EXISTS business_approval_status;

CREATE TABLE business_approval_status (
  id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '审批状态ID',
  business_code VARCHAR(50) NOT NULL COMMENT '业务代码',
  business_id BIGINT NOT NULL COMMENT '业务数据ID',
  flow_id BIGINT NOT NULL COMMENT '审批流程ID',
  flow_name VARCHAR(100) COMMENT '流程名称',
  current_node_id BIGINT COMMENT '当前节点ID',
  current_node_name VARCHAR(100) COMMENT '当前节点名称',
  approval_status VARCHAR(20) NOT NULL DEFAULT 'PENDING' COMMENT '审批状态:PENDING-未审核,IN_PROGRESS-审核中,APPROVED-审核通过,REJECTED-已驳回,CANCELLED-已取消',
  submitter_id BIGINT NOT NULL COMMENT '提交人ID',
  submitter_name VARCHAR(50) COMMENT '提交人姓名',
  submit_time DATETIME NOT NULL COMMENT '提交时间',
  complete_time DATETIME COMMENT '完成时间',
  total_nodes INT COMMENT '总节点数',
  current_node_order INT COMMENT '当前节点顺序',
  reject_reason TEXT COMMENT '驳回原因',
  cancel_reason TEXT COMMENT '取消原因',
  tenant_id BIGINT NOT NULL COMMENT '租户ID',
  create_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  create_by VARCHAR(50) COMMENT '创建人',
  update_by VARCHAR(50) COMMENT '更新人',
  remark VARCHAR(500) COMMENT '备注',
  INDEX idx_business_code_id (business_code, business_id),
  INDEX idx_flow_id (flow_id),
  INDEX idx_current_node_id (current_node_id),
  INDEX idx_approval_status (approval_status),
  INDEX idx_submitter_id (submitter_id),
  INDEX idx_submit_time (submit_time),
  INDEX idx_tenant_id (tenant_id),
  UNIQUE KEY uk_business_code_id_tenant (business_code, business_id, tenant_id),
  CONSTRAINT fk_business_status_flow FOREIGN KEY (flow_id) REFERENCES approval_flow(id) ON DELETE CASCADE,
  CONSTRAINT fk_business_status_node FOREIGN KEY (current_node_id) REFERENCES approval_node(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='业务审批状态表';

-- ============================================
-- 6. 待办任务表（todo_task）
-- ============================================
DROP TABLE IF EXISTS todo_task;

CREATE TABLE todo_task (
  id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '待办任务ID',
  task_type VARCHAR(50) NOT NULL COMMENT '任务类型:APPROVAL-审批任务,NOTICE-通知任务,REMIND-提醒任务,WARNING-预警任务',
  task_title VARCHAR(200) NOT NULL COMMENT '任务标题',
  task_content TEXT COMMENT '任务内容',
  task_source VARCHAR(50) COMMENT '任务来源:LEAVE-请假,TRANSFER-调岗,RESIGNATION-离职,REGISTRATION-报名等',
  business_code VARCHAR(50) NOT NULL COMMENT '业务代码',
  business_id BIGINT NOT NULL COMMENT '业务数据ID',
  task_status VARCHAR(20) NOT NULL DEFAULT 'PENDING' COMMENT '任务状态:PENDING-待处理,PROCESSING-处理中,COMPLETED-已完成,CANCELLED-已取消',
  priority VARCHAR(20) DEFAULT 'NORMAL' COMMENT '优先级:LOW-低,NORMAL-中,HIGH-高,URGENT-紧急',
  assignee_id BIGINT NOT NULL COMMENT '接收人ID',
  assignee_name VARCHAR(50) COMMENT '接收人姓名',
  assignee_dept VARCHAR(100) COMMENT '接收人部门',
  sender_id BIGINT COMMENT '发送人ID',
  sender_name VARCHAR(50) COMMENT '发送人姓名',
  due_date DATETIME COMMENT '截止日期',
  complete_time DATETIME COMMENT '完成时间',
  read_status TINYINT(1) DEFAULT 0 COMMENT '阅读状态:0-未读,1-已读',
  read_time DATETIME COMMENT '阅读时间',
  approval_record_id BIGINT COMMENT '关联的审批记录ID',
  task_url VARCHAR(500) COMMENT '任务跳转链接',
  attachment_ids TEXT COMMENT '附件ID列表，JSON格式',
  tenant_id BIGINT NOT NULL COMMENT '租户ID',
  create_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  create_by VARCHAR(50) COMMENT '创建人',
  update_by VARCHAR(50) COMMENT '更新人',
  remark VARCHAR(500) COMMENT '备注',
  INDEX idx_task_type (task_type),
  INDEX idx_task_source (task_source),
  INDEX idx_business_code_id (business_code, business_id),
  INDEX idx_task_status (task_status),
  INDEX idx_priority (priority),
  INDEX idx_assignee_id (assignee_id),
  INDEX idx_due_date (due_date),
  INDEX idx_read_status (read_status),
  INDEX idx_create_time (create_time),
  INDEX idx_tenant_id (tenant_id),
  CONSTRAINT fk_todo_approval_record FOREIGN KEY (approval_record_id) REFERENCES approval_record(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='待办任务表';

-- ============================================
-- 初始化数据
-- ============================================

-- 插入示例审批流程数据
INSERT INTO approval_flow (flow_name, flow_code, flow_type, flow_description, flow_status, is_default, version, tenant_id, create_by) VALUES
('请假审批流程', 'LEAVE_APPROVAL', 'LEAVE', '员工请假审批流程，支持多级审批', 'ENABLED', 1, 1, 1, 'admin'),
('调岗审批流程', 'TRANSFER_APPROVAL', 'TRANSFER', '员工调岗审批流程，支持多级审批', 'ENABLED', 1, 1, 1, 'admin'),
('离职审批流程', 'RESIGNATION_APPROVAL', 'RESIGNATION', '员工离职审批流程，支持多级审批', 'ENABLED', 1, 1, 1, 'admin'),
('报名审批流程', 'REGISTRATION_APPROVAL', 'REGISTRATION', '活动报名审批流程，支持多级审批', 'ENABLED', 1, 1, 1, 'admin');

-- 插入示例审批节点数据（以请假审批流程为例）
INSERT INTO approval_node (flow_id, node_name, node_code, node_type, node_order, approval_mode, approver_type, approver_config, is_required, tenant_id, create_by) VALUES
((SELECT id FROM approval_flow WHERE flow_code = 'LEAVE_APPROVAL'), '部门主管审批', 'LEAVE_NODE_1', 'APPROVAL', 1, 'OR', 'POSITION', '{"position_code":"DEPT_MANAGER"}', 1, 1, 'admin'),
((SELECT id FROM approval_flow WHERE flow_code = 'LEAVE_APPROVAL'), '人事审批', 'LEAVE_NODE_2', 'APPROVAL', 2, 'OR', 'POSITION', '{"position_code":"HR_MANAGER"}', 1, 1, 'admin'),
((SELECT id FROM approval_flow WHERE flow_code = 'LEAVE_APPROVAL'), '总经理审批', 'LEAVE_NODE_3', 'APPROVAL', 3, 'OR', 'POSITION', '{"position_code":"GENERAL_MANAGER"}', 0, 1, 'admin');

-- 插入示例流程配置数据
INSERT INTO flow_business_config (business_code, business_name, flow_id, is_enabled, config_description, tenant_id, create_by) VALUES
('LEAVE', '请假管理', (SELECT id FROM approval_flow WHERE flow_code = 'LEAVE_APPROVAL'), 1, '请假管理启用审批流程', 1, 'admin'),
('TRANSFER', '调岗管理', (SELECT id FROM approval_flow WHERE flow_code = 'TRANSFER_APPROVAL'), 1, '调岗管理启用审批流程', 1, 'admin'),
('RESIGNATION', '离职管理', (SELECT id FROM approval_flow WHERE flow_code = 'RESIGNATION_APPROVAL'), 1, '离职管理启用审批流程', 1, 'admin'),
('REGISTRATION', '报名管理', (SELECT id FROM approval_flow WHERE flow_code = 'REGISTRATION_APPROVAL'), 1, '报名管理启用审批流程', 1, 'admin');

-- ============================================
-- 创建视图（可选）
-- ============================================

-- 创建待办任务统计视图
CREATE OR REPLACE VIEW v_todo_task_statistics AS
SELECT
  assignee_id,
  assignee_name,
  tenant_id,
  COUNT(*) AS total_tasks,
  SUM(CASE WHEN task_status = 'PENDING' THEN 1 ELSE 0 END) AS pending_tasks,
  SUM(CASE WHEN task_status = 'PROCESSING' THEN 1 ELSE 0 END) AS processing_tasks,
  SUM(CASE WHEN task_status = 'COMPLETED' THEN 1 ELSE 0 END) AS completed_tasks,
  SUM(CASE WHEN task_status = 'CANCELLED' THEN 1 ELSE 0 END) AS cancelled_tasks,
  SUM(CASE WHEN read_status = 0 THEN 1 ELSE 0 END) AS unread_tasks
FROM todo_task
GROUP BY assignee_id, assignee_name, tenant_id;

-- 创建审批流程统计视图
CREATE OR REPLACE VIEW v_approval_flow_statistics AS
SELECT
  af.flow_code,
  af.flow_name,
  af.flow_type,
  af.tenant_id,
  COUNT(DISTINCT bas.id) AS total_submissions,
  SUM(CASE WHEN bas.approval_status = 'PENDING' THEN 1 ELSE 0 END) AS pending_submissions,
  SUM(CASE WHEN bas.approval_status = 'IN_PROGRESS' THEN 1 ELSE 0 END) AS in_progress_submissions,
  SUM(CASE WHEN bas.approval_status = 'APPROVED' THEN 1 ELSE 0 END) AS approved_submissions,
  SUM(CASE WHEN bas.approval_status = 'REJECTED' THEN 1 ELSE 0 END) AS rejected_submissions,
  SUM(CASE WHEN bas.approval_status = 'CANCELLED' THEN 1 ELSE 0 END) AS cancelled_submissions
FROM approval_flow af
LEFT JOIN business_approval_status bas ON af.id = bas.flow_id
GROUP BY af.flow_code, af.flow_name, af.flow_type, af.tenant_id;

-- ============================================
-- 创建存储过程（可选）
-- ============================================

-- 创建提交审批存储过程
DELIMITER $$

DROP PROCEDURE IF EXISTS sp_submit_approval$$

CREATE PROCEDURE sp_submit_approval(
  IN p_business_code VARCHAR(50),
  IN p_business_id BIGINT,
  IN p_flow_id BIGINT,
  IN p_submitter_id BIGINT,
  IN p_submitter_name VARCHAR(50),
  IN p_tenant_id BIGINT,
  IN p_create_by VARCHAR(50)
)
BEGIN
  DECLARE v_flow_name VARCHAR(100);
  DECLARE v_first_node_id BIGINT;
  DECLARE v_first_node_name VARCHAR(100);
  DECLARE v_total_nodes INT;

  -- 获取流程信息
  SELECT flow_name INTO v_flow_name FROM approval_flow WHERE id = p_flow_id;

  -- 获取第一个审批节点
  SELECT id, node_name INTO v_first_node_id, v_first_node_name
  FROM approval_node
  WHERE flow_id = p_flow_id AND node_type = 'APPROVAL'
  ORDER BY node_order ASC
  LIMIT 1;

  -- 获取总节点数
  SELECT COUNT(*) INTO v_total_nodes
  FROM approval_node
  WHERE flow_id = p_flow_id AND node_type = 'APPROVAL';

  -- 插入业务审批状态
  INSERT INTO business_approval_status (
    business_code, business_id, flow_id, flow_name,
    current_node_id, current_node_name, approval_status,
    submitter_id, submitter_name, submit_time,
    total_nodes, current_node_order, tenant_id, create_by
  ) VALUES (
    p_business_code, p_business_id, p_flow_id, v_flow_name,
    v_first_node_id, v_first_node_name, 'IN_PROGRESS',
    p_submitter_id, p_submitter_name, NOW(),
    v_total_nodes, 1, p_tenant_id, p_create_by
  );

  -- 创建审批记录
  INSERT INTO approval_record (
    business_code, business_id, flow_id, flow_name,
    node_id, node_name, approver_id, approver_name,
    approval_result, is_current, tenant_id, create_by
  )
  SELECT
    p_business_code, p_business_id, p_flow_id, v_flow_name,
    id, node_name, JSON_EXTRACT(approver_config, '$.user_id'), '待审批',
    'PENDING', 1, p_tenant_id, p_create_by
  FROM approval_node
  WHERE flow_id = p_flow_id AND node_type = 'APPROVAL' AND node_order = 1;

END$$

DELIMITER ;

-- ============================================
-- 表结构说明
-- ============================================

/*
1. approval_flow（审批流程表）
   - 存储审批流程的基本信息
   - 支持流程版本管理
   - 支持默认流程配置
   - 按租户隔离数据

2. approval_node（审批节点表）
   - 存储审批流程的节点配置
   - 支持多种节点类型：审批节点、抄送节点、条件节点
   - 支持多种审批模式：或签、会签
   - 支持多种审批人类型：角色、部门、岗位、指定用户、表单字段
   - 支持审批超时配置

3. flow_business_config（流程配置表）
   - 存储业务与审批流程的关联配置
   - 支持生效日期和失效日期
   - 支持启用/禁用配置

4. approval_record（审批记录表）
   - 存储完整的审批操作记录
   - 支持审批转办和委派
   - 支持审批意见和附件
   - 完整记录审批历史

5. business_approval_status（业务审批状态表）
   - 存储业务数据的审批状态
   - 记录当前审批节点
   - 记录审批进度
   - 支持驳回和取消原因记录

6. todo_task（待办任务表）
   - 存储待办任务信息
   - 支持多种任务类型：审批任务、通知任务、提醒任务、预警任务
   - 支持优先级管理
   - 支持阅读状态跟踪
   - 支持截止日期管理

数据关系：
- approval_flow (1) -> (N) approval_node
- approval_flow (1) -> (N) flow_business_config
- approval_flow (1) -> (N) business_approval_status
- approval_flow (1) -> (N) approval_record
- approval_node (1) -> (N) approval_record
- business_approval_status (1) -> (N) approval_record
- approval_record (1) -> (1) todo_task

索引优化：
- 所有表都建立了tenant_id索引，支持多租户查询
- 业务表建立了business_code和business_id的联合索引
- 审批相关表建立了flow_id和node_id索引
- 待办任务表建立了assignee_id和task_status索引
- 时间字段建立了索引，支持时间范围查询

外键约束：
- approval_node表的外键关联到approval_flow表
- flow_business_config表的外键关联到approval_flow表
- approval_record表的外键关联到approval_flow和approval_node表
- business_approval_status表的外键关联到approval_flow和approval_node表
- todo_task表的外键关联到approval_record表
*/
