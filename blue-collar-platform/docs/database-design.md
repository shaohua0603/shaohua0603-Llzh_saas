# 蓝领智汇平台数据库设计文档

## 数据库设计原则

### 1. 命名规范
- **表名**：使用小写字母和下划线，如 `admin_todos`
- **字段名**：使用小写字母和下划线，如 `created_at`
- **索引名**：`idx_表名_字段名`，如 `idx_admin_todos_user_id`
- **外键名**：`fk_表名_字段名`，如 `fk_admin_todos_user_id`

### 2. 字段类型规范
- **主键**：`BIGINT UNSIGNED AUTO_INCREMENT` 或 `VARCHAR(36)` (UUID)
- **字符串**：`VARCHAR(n)` 根据实际长度确定
- **长文本**：`TEXT` 或 `LONGTEXT`
- **整数**：`INT` 或 `BIGINT` 根据范围确定
- **小数**：`DECIMAL(10, 2)` 用于金额
- **布尔值**：`TINYINT(1)` 0表示false，1表示true
- **日期时间**：`DATETIME` 或 `TIMESTAMP`
- **JSON**：`JSON` 类型用于存储复杂结构

### 3. 通用字段
所有业务表都应包含以下通用字段：
- `id`：主键
- `created_by`：创建人ID
- `created_at`：创建时间
- `updated_by`：更新人ID
- `updated_at`：更新时间
- `deleted_at`：删除时间（软删除）
- `deleted_by`：删除人ID
- `remark`：备注

### 4. 索引设计原则
- 主键自动创建索引
- 外键字段创建索引
- 经常查询的字段创建索引
- 组合查询字段创建组合索引
- 避免过多索引影响写入性能

### 5. 数据权限字段
所有需要数据权限控制的业务表都应包含以下字段：
- `creator_id`：创建人ID
- `manager_id`：负责人ID
- `department_id`：所属部门ID

---

## 基础表设计

### 1. 用户表 (users)

```sql
CREATE TABLE `users` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '用户ID',
  `username` VARCHAR(50) NOT NULL COMMENT '用户名',
  `password` VARCHAR(255) NOT NULL COMMENT '密码（加密）',
  `real_name` VARCHAR(50) NOT NULL COMMENT '真实姓名',
  `phone` VARCHAR(20) NOT NULL COMMENT '手机号',
  `email` VARCHAR(100) COMMENT '邮箱',
  `avatar` VARCHAR(255) COMMENT '头像URL',
  `user_type` ENUM('worker', 'labor_company', 'factory', 'admin') NOT NULL COMMENT '用户类型',
  `status` ENUM('active', 'inactive', 'locked') NOT NULL DEFAULT 'active' COMMENT '状态',
  `tenant_id` BIGINT UNSIGNED COMMENT '租户ID',
  `department_id` BIGINT UNSIGNED COMMENT '部门ID',
  `position_id` BIGINT UNSIGNED COMMENT '岗位ID',
  `last_login_at` DATETIME COMMENT '最后登录时间',
  `last_login_ip` VARCHAR(50) COMMENT '最后登录IP',
  `created_by` BIGINT UNSIGNED COMMENT '创建人ID',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_by` BIGINT UNSIGNED COMMENT '更新人ID',
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `deleted_at` DATETIME COMMENT '删除时间',
  `deleted_by` BIGINT UNSIGNED COMMENT '删除人ID',
  `remark` TEXT COMMENT '备注',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_username` (`username`),
  UNIQUE KEY `uk_phone` (`phone`),
  KEY `idx_user_type` (`user_type`),
  KEY `idx_status` (`status`),
  KEY `idx_tenant_id` (`tenant_id`),
  KEY `idx_department_id` (`department_id`),
  KEY `idx_position_id` (`position_id`),
  KEY `idx_created_at` (`created_at`),
  KEY `idx_deleted_at` (`deleted_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户表';
```

### 2. 角色表 (roles)

```sql
CREATE TABLE `roles` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '角色ID',
  `role_name` VARCHAR(50) NOT NULL COMMENT '角色名称',
  `role_code` VARCHAR(50) NOT NULL COMMENT '角色编码',
  `role_type` ENUM('system', 'tenant', 'department') NOT NULL COMMENT '角色类型',
  `data_permission` ENUM('ALL', 'DEPARTMENT', 'DEPARTMENT_AND_BELOW', 'SELF', 'CUSTOM') NOT NULL DEFAULT 'SELF' COMMENT '数据权限',
  `custom_departments` JSON COMMENT '自定义部门权限（JSON数组）',
  `description` VARCHAR(255) COMMENT '描述',
  `sort_order` INT NOT NULL DEFAULT 0 COMMENT '排序',
  `status` ENUM('enabled', 'disabled') NOT NULL DEFAULT 'enabled' COMMENT '状态',
  `tenant_id` BIGINT UNSIGNED COMMENT '租户ID',
  `created_by` BIGINT UNSIGNED COMMENT '创建人ID',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_by` BIGINT UNSIGNED COMMENT '更新人ID',
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `deleted_at` DATETIME COMMENT '删除时间',
  `deleted_by` BIGINT UNSIGNED COMMENT '删除人ID',
  `remark` TEXT COMMENT '备注',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_role_code` (`role_code`),
  KEY `idx_role_type` (`role_type`),
  KEY `idx_data_permission` (`data_permission`),
  KEY `idx_status` (`status`),
  KEY `idx_tenant_id` (`tenant_id`),
  KEY `idx_deleted_at` (`deleted_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='角色表';
```

### 3. 用户角色关联表 (user_roles)

```sql
CREATE TABLE `user_roles` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `user_id` BIGINT UNSIGNED NOT NULL COMMENT '用户ID',
  `role_id` BIGINT UNSIGNED NOT NULL COMMENT '角色ID',
  `created_by` BIGINT UNSIGNED COMMENT '创建人ID',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_by` BIGINT UNSIGNED COMMENT '更新人ID',
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `deleted_at` DATETIME COMMENT '删除时间',
  `deleted_by` BIGINT UNSIGNED COMMENT '删除人ID',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_user_role` (`user_id`, `role_id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_role_id` (`role_id`),
  KEY `idx_deleted_at` (`deleted_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户角色关联表';
```

### 4. 菜单表 (menus)

```sql
CREATE TABLE `menus` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '菜单ID',
  `parent_id` BIGINT UNSIGNED NOT NULL DEFAULT 0 COMMENT '父菜单ID',
  `menu_name` VARCHAR(50) NOT NULL COMMENT '菜单名称',
  `menu_code` VARCHAR(50) NOT NULL COMMENT '菜单编码',
  `menu_type` ENUM('directory', 'menu', 'button') NOT NULL COMMENT '菜单类型',
  `menu_level` TINYINT NOT NULL COMMENT '菜单层级',
  `path` VARCHAR(255) COMMENT '路由路径',
  `component` VARCHAR(255) COMMENT '组件路径',
  `icon` VARCHAR(50) COMMENT '图标',
  `permission_code` VARCHAR(100) COMMENT '权限编码',
  `sort_order` INT NOT NULL DEFAULT 0 COMMENT '排序',
  `visible` TINYINT(1) NOT NULL DEFAULT 1 COMMENT '是否可见',
  `status` ENUM('enabled', 'disabled') NOT NULL DEFAULT 'enabled' COMMENT '状态',
  `tenant_id` BIGINT UNSIGNED COMMENT '租户ID',
  `created_by` BIGINT UNSIGNED COMMENT '创建人ID',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_by` BIGINT UNSIGNED COMMENT '更新人ID',
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `deleted_at` DATETIME COMMENT '删除时间',
  `deleted_by` BIGINT UNSIGNED COMMENT '删除人ID',
  `remark` TEXT COMMENT '备注',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_menu_code` (`menu_code`),
  KEY `idx_parent_id` (`parent_id`),
  KEY `idx_menu_type` (`menu_type`),
  KEY `idx_menu_level` (`menu_level`),
  KEY `idx_status` (`status`),
  KEY `idx_tenant_id` (`tenant_id`),
  KEY `idx_deleted_at` (`deleted_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='菜单表';
```

### 5. 角色菜单关联表 (role_menus)

```sql
CREATE TABLE `role_menus` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `role_id` BIGINT UNSIGNED NOT NULL COMMENT '角色ID',
  `menu_id` BIGINT UNSIGNED NOT NULL COMMENT '菜单ID',
  `created_by` BIGINT UNSIGNED COMMENT '创建人ID',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_by` BIGINT UNSIGNED COMMENT '更新人ID',
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `deleted_at` DATETIME COMMENT '删除时间',
  `deleted_by` BIGINT UNSIGNED COMMENT '删除人ID',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_role_menu` (`role_id`, `menu_id`),
  KEY `idx_role_id` (`role_id`),
  KEY `idx_menu_id` (`menu_id`),
  KEY `idx_deleted_at` (`deleted_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='角色菜单关联表';
```

### 6. 部门表 (departments)

```sql
CREATE TABLE `departments` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '部门ID',
  `parent_id` BIGINT UNSIGNED NOT NULL DEFAULT 0 COMMENT '父部门ID',
  `dept_name` VARCHAR(50) NOT NULL COMMENT '部门名称',
  `dept_code` VARCHAR(50) NOT NULL COMMENT '部门编码',
  `dept_level` TINYINT NOT NULL COMMENT '部门层级',
  `leader_id` BIGINT UNSIGNED COMMENT '负责人ID',
  `phone` VARCHAR(20) COMMENT '联系电话',
  `email` VARCHAR(100) COMMENT '邮箱',
  `address` VARCHAR(255) COMMENT '地址',
  `sort_order` INT NOT NULL DEFAULT 0 COMMENT '排序',
  `status` ENUM('enabled', 'disabled') NOT NULL DEFAULT 'enabled' COMMENT '状态',
  `tenant_id` BIGINT UNSIGNED COMMENT '租户ID',
  `created_by` BIGINT UNSIGNED COMMENT '创建人ID',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_by` BIGINT UNSIGNED COMMENT '更新人ID',
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `deleted_at` DATETIME COMMENT '删除时间',
  `deleted_by` BIGINT UNSIGNED COMMENT '删除人ID',
  `remark` TEXT COMMENT '备注',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_dept_code` (`dept_code`),
  KEY `idx_parent_id` (`parent_id`),
  KEY `idx_dept_level` (`dept_level`),
  KEY `idx_leader_id` (`leader_id`),
  KEY `idx_status` (`status`),
  KEY `idx_tenant_id` (`tenant_id`),
  KEY `idx_deleted_at` (`deleted_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='部门表';
```

### 7. 岗位表 (positions)

```sql
CREATE TABLE `positions` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '岗位ID',
  `position_name` VARCHAR(50) NOT NULL COMMENT '岗位名称',
  `position_code` VARCHAR(50) NOT NULL COMMENT '岗位编码',
  `department_id` BIGINT UNSIGNED COMMENT '所属部门ID',
  `position_level` TINYINT COMMENT '岗位级别',
  `description` VARCHAR(255) COMMENT '描述',
  `sort_order` INT NOT NULL DEFAULT 0 COMMENT '排序',
  `status` ENUM('enabled', 'disabled') NOT NULL DEFAULT 'enabled' COMMENT '状态',
  `tenant_id` BIGINT UNSIGNED COMMENT '租户ID',
  `created_by` BIGINT UNSIGNED COMMENT '创建人ID',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_by` BIGINT UNSIGNED COMMENT '更新人ID',
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `deleted_at` DATETIME COMMENT '删除时间',
  `deleted_by` BIGINT UNSIGNED COMMENT '删除人ID',
  `remark` TEXT COMMENT '备注',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_position_code` (`position_code`),
  KEY `idx_department_id` (`department_id`),
  KEY `idx_position_level` (`position_level`),
  KEY `idx_status` (`status`),
  KEY `idx_tenant_id` (`tenant_id`),
  KEY `idx_deleted_at` (`deleted_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='岗位表';
```

### 8. 字典表 (dictionaries)

```sql
CREATE TABLE `dictionaries` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '字典ID',
  `dict_type` VARCHAR(50) NOT NULL COMMENT '字典类型',
  `dict_label` VARCHAR(100) NOT NULL COMMENT '字典标签',
  `dict_value` VARCHAR(100) NOT NULL COMMENT '字典值',
  `dict_sort` INT NOT NULL DEFAULT 0 COMMENT '排序',
  `css_class` VARCHAR(100) COMMENT '样式类名',
  `list_class` VARCHAR(100) COMMENT '表格回显样式',
  `is_default` TINYINT(1) NOT NULL DEFAULT 0 COMMENT '是否默认',
  `status` ENUM('enabled', 'disabled') NOT NULL DEFAULT 'enabled' COMMENT '状态',
  `tenant_id` BIGINT UNSIGNED COMMENT '租户ID',
  `created_by` BIGINT UNSIGNED COMMENT '创建人ID',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_by` BIGINT UNSIGNED COMMENT '更新人ID',
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `deleted_at` DATETIME COMMENT '删除时间',
  `deleted_by` BIGINT UNSIGNED COMMENT '删除人ID',
  `remark` TEXT COMMENT '备注',
  PRIMARY KEY (`id`),
  KEY `idx_dict_type` (`dict_type`),
  KEY `idx_dict_value` (`dict_value`),
  KEY `idx_status` (`status`),
  KEY `idx_tenant_id` (`tenant_id`),
  KEY `idx_deleted_at` (`deleted_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='字典表';
```

### 9. 附件表 (attachments)

```sql
CREATE TABLE `attachments` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '附件ID',
  `file_name` VARCHAR(255) NOT NULL COMMENT '文件名',
  `file_path` VARCHAR(500) NOT NULL COMMENT '文件路径',
  `file_size` BIGINT UNSIGNED NOT NULL COMMENT '文件大小（字节）',
  `file_type` VARCHAR(50) NOT NULL COMMENT '文件类型',
  `file_extension` VARCHAR(20) NOT NULL COMMENT '文件扩展名',
  `file_md5` VARCHAR(32) COMMENT '文件MD5',
  `business_type` VARCHAR(50) COMMENT '业务类型',
  `business_id` BIGINT UNSIGNED COMMENT '业务ID',
  `upload_user_id` BIGINT UNSIGNED COMMENT '上传用户ID',
  `tenant_id` BIGINT UNSIGNED COMMENT '租户ID',
  `created_by` BIGINT UNSIGNED COMMENT '创建人ID',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_by` BIGINT UNSIGNED COMMENT '更新人ID',
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `deleted_at` DATETIME COMMENT '删除时间',
  `deleted_by` BIGINT UNSIGNED COMMENT '删除人ID',
  `remark` TEXT COMMENT '备注',
  PRIMARY KEY (`id`),
  KEY `idx_business_type` (`business_type`),
  KEY `idx_business_id` (`business_id`),
  KEY `idx_upload_user_id` (`upload_user_id`),
  KEY `idx_tenant_id` (`tenant_id`),
  KEY `idx_deleted_at` (`deleted_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='附件表';
```

### 10. 操作日志表 (operation_logs)

```sql
CREATE TABLE `operation_logs` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '日志ID',
  `module` VARCHAR(50) NOT NULL COMMENT '模块',
  `operation` VARCHAR(50) NOT NULL COMMENT '操作',
  `method` VARCHAR(10) NOT NULL COMMENT '请求方法',
  `request_url` VARCHAR(500) NOT NULL COMMENT '请求URL',
  `request_params` TEXT COMMENT '请求参数',
  `response_result` TEXT COMMENT '响应结果',
  `ip_address` VARCHAR(50) NOT NULL COMMENT 'IP地址',
  `user_agent` VARCHAR(500) COMMENT '用户代理',
  `user_id` BIGINT UNSIGNED NOT NULL COMMENT '用户ID',
  `user_name` VARCHAR(50) NOT NULL COMMENT '用户名',
  `tenant_id` BIGINT UNSIGNED COMMENT '租户ID',
  `execution_time` INT COMMENT '执行时间（毫秒）',
  `status` ENUM('success', 'failure') NOT NULL COMMENT '状态',
  `error_message` TEXT COMMENT '错误信息',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`),
  KEY `idx_module` (`module`),
  KEY `idx_operation` (`operation`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_tenant_id` (`tenant_id`),
  KEY `idx_status` (`status`),
  KEY `idx_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='操作日志表';
```

### 11. 审批记录表 (approval_records)

```sql
CREATE TABLE `approval_records` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '审批记录ID',
  `business_type` VARCHAR(50) NOT NULL COMMENT '业务类型',
  `business_id` BIGINT UNSIGNED NOT NULL COMMENT '业务ID',
  `flow_name` VARCHAR(50) NOT NULL COMMENT '流程名称',
  `node_name` VARCHAR(50) NOT NULL COMMENT '节点名称',
  `node_type` ENUM('approval', 'cc') NOT NULL COMMENT '节点类型',
  `approver_id` BIGINT UNSIGNED NOT NULL COMMENT '审批人ID',
  `approver_name` VARCHAR(50) NOT NULL COMMENT '审批人姓名',
  `approval_time` DATETIME COMMENT '审批时间',
  `approval_result` ENUM('approved', 'rejected', 'pending') NOT NULL COMMENT '审批结果',
  `approval_comment` TEXT COMMENT '审批意见',
  `tenant_id` BIGINT UNSIGNED COMMENT '租户ID',
  `created_by` BIGINT UNSIGNED COMMENT '创建人ID',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_by` BIGINT UNSIGNED COMMENT '更新人ID',
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `deleted_at` DATETIME COMMENT '删除时间',
  `deleted_by` BIGINT UNSIGNED COMMENT '删除人ID',
  `remark` TEXT COMMENT '备注',
  PRIMARY KEY (`id`),
  KEY `idx_business_type` (`business_type`),
  KEY `idx_business_id` (`business_id`),
  KEY `idx_approver_id` (`approver_id`),
  KEY `idx_approval_result` (`approval_result`),
  KEY `idx_tenant_id` (`tenant_id`),
  KEY `idx_deleted_at` (`deleted_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='审批记录表';
```

---

## 平台管理端业务表设计

### 1. 待办任务表 (admin_todos)

```sql
CREATE TABLE `admin_todos` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '待办任务ID',
  `title` VARCHAR(255) NOT NULL COMMENT '任务标题',
  `type` ENUM('tenant_audit', 'package_audit', 'activity_audit', 'expense_audit', 'other') NOT NULL COMMENT '任务类型',
  `priority` ENUM('high', 'medium', 'low') NOT NULL COMMENT '优先级',
  `status` ENUM('pending', 'processing', 'completed', 'cancelled') NOT NULL COMMENT '状态',
  `business_type` VARCHAR(50) COMMENT '业务类型',
  `business_id` BIGINT UNSIGNED COMMENT '业务ID',
  `description` TEXT COMMENT '任务描述',
  `assignee_id` BIGINT UNSIGNED COMMENT '处理人ID',
  `assignee_name` VARCHAR(50) COMMENT '处理人姓名',
  `deadline` DATETIME COMMENT '截止时间',
  `completed_at` DATETIME COMMENT '完成时间',
  `creator_id` BIGINT UNSIGNED COMMENT '创建人ID',
  `department_id` BIGINT UNSIGNED COMMENT '所属部门ID',
  `created_by` BIGINT UNSIGNED COMMENT '创建人ID',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_by` BIGINT UNSIGNED COMMENT '更新人ID',
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `deleted_at` DATETIME COMMENT '删除时间',
  `deleted_by` BIGINT UNSIGNED COMMENT '删除人ID',
  `remark` TEXT COMMENT '备注',
  PRIMARY KEY (`id`),
  KEY `idx_type` (`type`),
  KEY `idx_priority` (`priority`),
  KEY `idx_status` (`status`),
  KEY `idx_business_type` (`business_type`),
  KEY `idx_business_id` (`business_id`),
  KEY `idx_assignee_id` (`assignee_id`),
  KEY `idx_creator_id` (`creator_id`),
  KEY `idx_department_id` (`department_id`),
  KEY `idx_deadline` (`deadline`),
  KEY `idx_created_at` (`created_at`),
  KEY `idx_deleted_at` (`deleted_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='待办任务表';
```

### 2. 消息表 (admin_messages)

```sql
CREATE TABLE `admin_messages` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '消息ID',
  `title` VARCHAR(255) NOT NULL COMMENT '消息标题',
  `type` ENUM('system', 'notification', 'announcement', 'other') NOT NULL COMMENT '消息类型',
  `priority` ENUM('high', 'medium', 'low') NOT NULL COMMENT '优先级',
  `status` ENUM('unread', 'read', 'archived') NOT NULL COMMENT '状态',
  `content` TEXT NOT NULL COMMENT '消息内容',
  `sender_id` BIGINT UNSIGNED COMMENT '发送人ID',
  `sender_name` VARCHAR(50) COMMENT '发送人姓名',
  `receiver_id` BIGINT UNSIGNED NOT NULL COMMENT '接收人ID',
  `receiver_name` VARCHAR(50) NOT NULL COMMENT '接收人姓名',
  `is_broadcast` TINYINT(1) NOT NULL DEFAULT 0 COMMENT '是否广播',
  `read_at` DATETIME COMMENT '阅读时间',
  `creator_id` BIGINT UNSIGNED COMMENT '创建人ID',
  `department_id` BIGINT UNSIGNED COMMENT '所属部门ID',
  `created_by` BIGINT UNSIGNED COMMENT '创建人ID',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_by` BIGINT UNSIGNED COMMENT '更新人ID',
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `deleted_at` DATETIME COMMENT '删除时间',
  `deleted_by` BIGINT UNSIGNED COMMENT '删除人ID',
  `remark` TEXT COMMENT '备注',
  PRIMARY KEY (`id`),
  KEY `idx_type` (`type`),
  KEY `idx_priority` (`priority`),
  KEY `idx_status` (`status`),
  KEY `idx_sender_id` (`sender_id`),
  KEY `idx_receiver_id` (`receiver_id`),
  KEY `idx_is_broadcast` (`is_broadcast`),
  KEY `idx_creator_id` (`creator_id`),
  KEY `idx_department_id` (`department_id`),
  KEY `idx_created_at` (`created_at`),
  KEY `idx_deleted_at` (`deleted_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='消息表';
```

### 3. 预警消息表 (admin_warnings)

```sql
CREATE TABLE `admin_warnings` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '预警ID',
  `title` VARCHAR(255) NOT NULL COMMENT '预警标题',
  `type` ENUM('system', 'business', 'security', 'other') NOT NULL COMMENT '预警类型',
  `level` ENUM('critical', 'high', 'medium', 'low') NOT NULL COMMENT '预警级别',
  `status` ENUM('pending', 'processing', 'resolved', 'ignored') NOT NULL COMMENT '状态',
  `content` TEXT NOT NULL COMMENT '预警内容',
  `warning_template_id` BIGINT UNSIGNED COMMENT '预警模版ID',
  `business_type` VARCHAR(50) COMMENT '业务类型',
  `business_id` BIGINT UNSIGNED COMMENT '业务ID',
  `handler_id` BIGINT UNSIGNED COMMENT '处理人ID',
  `handler_name` VARCHAR(50) COMMENT '处理人姓名',
  `resolved_at` DATETIME COMMENT '解决时间',
  `creator_id` BIGINT UNSIGNED COMMENT '创建人ID',
  `department_id` BIGINT UNSIGNED COMMENT '所属部门ID',
  `created_by` BIGINT UNSIGNED COMMENT '创建人ID',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_by` BIGINT UNSIGNED COMMENT '更新人ID',
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `deleted_at` DATETIME COMMENT '删除时间',
  `deleted_by` BIGINT UNSIGNED COMMENT '删除人ID',
  `remark` TEXT COMMENT '备注',
  PRIMARY KEY (`id`),
  KEY `idx_type` (`type`),
  KEY `idx_level` (`level`),
  KEY `idx_status` (`status`),
  KEY `idx_warning_template_id` (`warning_template_id`),
  KEY `idx_business_type` (`business_type`),
  KEY `idx_business_id` (`business_id`),
  KEY `idx_handler_id` (`handler_id`),
  KEY `idx_creator_id` (`creator_id`),
  KEY `idx_department_id` (`department_id`),
  KEY `idx_created_at` (`created_at`),
  KEY `idx_deleted_at` (`deleted_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='预警消息表';
```

### 4. 套餐表 (packages)

```sql
CREATE TABLE `packages` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '套餐ID',
  `package_name` VARCHAR(100) NOT NULL COMMENT '套餐名称',
  `package_code` VARCHAR(50) NOT NULL COMMENT '套餐编码',
  `type` ENUM('worker', 'labor_company', 'factory') NOT NULL COMMENT '套餐类型',
  `price` DECIMAL(10, 2) NOT NULL COMMENT '价格',
  `duration` INT NOT NULL COMMENT '有效期（天）',
  `features` JSON NOT NULL COMMENT '功能特性（JSON数组）',
  `worker_limit` INT COMMENT '工人数量限制',
  `company_limit` INT COMMENT '企业数量限制',
  `storage_limit` BIGINT COMMENT '存储空间限制（字节）',
  `description` TEXT COMMENT '描述',
  `is_default` TINYINT(1) NOT NULL DEFAULT 0 COMMENT '是否默认',
  `sort_order` INT NOT NULL DEFAULT 0 COMMENT '排序',
  `status` ENUM('enabled', 'disabled') NOT NULL DEFAULT 'enabled' COMMENT '状态',
  `creator_id` BIGINT UNSIGNED COMMENT '创建人ID',
  `department_id` BIGINT UNSIGNED COMMENT '所属部门ID',
  `created_by` BIGINT UNSIGNED COMMENT '创建人ID',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_by` BIGINT UNSIGNED COMMENT '更新人ID',
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `deleted_at` DATETIME COMMENT '删除时间',
  `deleted_by` BIGINT UNSIGNED COMMENT '删除人ID',
  `remark` TEXT COMMENT '备注',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_package_code` (`package_code`),
  KEY `idx_type` (`type`),
  KEY `idx_status` (`status`),
  KEY `idx_creator_id` (`creator_id`),
  KEY `idx_department_id` (`department_id`),
  KEY `idx_deleted_at` (`deleted_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='套餐表';
```

### 5. 租户表 (tenants)

```sql
CREATE TABLE `tenants` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '租户ID',
  `tenant_name` VARCHAR(100) NOT NULL COMMENT '租户名称',
  `tenant_code` VARCHAR(50) NOT NULL COMMENT '租户编码',
  `tenant_type` ENUM('labor_company', 'factory') NOT NULL COMMENT '租户类型',
  `contact_person` VARCHAR(50) NOT NULL COMMENT '联系人',
  `contact_phone` VARCHAR(20) NOT NULL COMMENT '联系电话',
  `contact_email` VARCHAR(100) COMMENT '联系邮箱',
  `address` VARCHAR(255) COMMENT '地址',
  `business_license` VARCHAR(255) COMMENT '营业执照',
  `package_id` BIGINT UNSIGNED NOT NULL COMMENT '套餐ID',
  `expire_date` DATETIME NOT NULL COMMENT '到期时间',
  `worker_count` INT NOT NULL DEFAULT 0 COMMENT '工人数量',
  `company_count` INT NOT NULL DEFAULT 0 COMMENT '企业数量',
  `storage_used` BIGINT NOT NULL DEFAULT 0 COMMENT '已用存储（字节）',
  `status` ENUM('pending', 'active', 'suspended', 'expired') NOT NULL DEFAULT 'pending' COMMENT '状态',
  `tags` JSON COMMENT '标签（JSON数组）',
  `creator_id` BIGINT UNSIGNED COMMENT '创建人ID',
  `department_id` BIGINT UNSIGNED COMMENT '所属部门ID',
  `created_by` BIGINT UNSIGNED COMMENT '创建人ID',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_by` BIGINT UNSIGNED COMMENT '更新人ID',
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `deleted_at` DATETIME COMMENT '删除时间',
  `deleted_by` BIGINT UNSIGNED COMMENT '删除人ID',
  `remark` TEXT COMMENT '备注',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_tenant_code` (`tenant_code`),
  KEY `idx_tenant_type` (`tenant_type`),
  KEY `idx_package_id` (`package_id`),
  KEY `idx_expire_date` (`expire_date`),
  KEY `idx_status` (`status`),
  KEY `idx_creator_id` (`creator_id`),
  KEY `idx_department_id` (`department_id`),
  KEY `idx_deleted_at` (`deleted_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='租户表';
```

### 6. 租户标签表 (tenant_tags)

```sql
CREATE TABLE `tenant_tags` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '标签ID',
  `tag_name` VARCHAR(50) NOT NULL COMMENT '标签名称',
  `tag_code` VARCHAR(50) NOT NULL COMMENT '标签编码',
  `tag_type` VARCHAR(50) COMMENT '标签类型',
  `color` VARCHAR(20) COMMENT '颜色',
  `description` VARCHAR(255) COMMENT '描述',
  `sort_order` INT NOT NULL DEFAULT 0 COMMENT '排序',
  `status` ENUM('enabled', 'disabled') NOT NULL DEFAULT 'enabled' COMMENT '状态',
  `creator_id` BIGINT UNSIGNED COMMENT '创建人ID',
  `department_id` BIGINT UNSIGNED COMMENT '所属部门ID',
  `created_by` BIGINT UNSIGNED COMMENT '创建人ID',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_by` BIGINT UNSIGNED COMMENT '更新人ID',
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `deleted_at` DATETIME COMMENT '删除时间',
  `deleted_by` BIGINT UNSIGNED COMMENT '删除人ID',
  `remark` TEXT COMMENT '备注',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_tag_code` (`tag_code`),
  KEY `idx_tag_type` (`tag_type`),
  KEY `idx_status` (`status`),
  KEY `idx_creator_id` (`creator_id`),
  KEY `idx_department_id` (`department_id`),
  KEY `idx_deleted_at` (`deleted_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='租户标签表';
```

### 7. 租户标签关联表 (tenant_tag_relations)

```sql
CREATE TABLE `tenant_tag_relations` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `tenant_id` BIGINT UNSIGNED NOT NULL COMMENT '租户ID',
  `tag_id` BIGINT UNSIGNED NOT NULL COMMENT '标签ID',
  `created_by` BIGINT UNSIGNED COMMENT '创建人ID',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_by` BIGINT UNSIGNED COMMENT '更新人ID',
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `deleted_at` DATETIME COMMENT '删除时间',
  `deleted_by` BIGINT UNSIGNED COMMENT '删除人ID',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_tenant_tag` (`tenant_id`, `tag_id`),
  KEY `idx_tenant_id` (`tenant_id`),
  KEY `idx_tag_id` (`tag_id`),
  KEY `idx_deleted_at` (`deleted_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='租户标签关联表';
```

### 8. 招聘需求表 (recruitment_demands)

```sql
CREATE TABLE `recruitment_demands` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '招聘需求ID',
  `demand_no` VARCHAR(50) NOT NULL COMMENT '需求编号',
  `factory_id` BIGINT UNSIGNED NOT NULL COMMENT '工厂ID',
  `factory_name` VARCHAR(100) NOT NULL COMMENT '工厂名称',
  `position_name` VARCHAR(100) NOT NULL COMMENT '岗位名称',
  `position_type` VARCHAR(50) COMMENT '岗位类型',
  `education` VARCHAR(50) COMMENT '学历要求',
  `experience` VARCHAR(50) COMMENT '经验要求',
  `age_range` VARCHAR(50) COMMENT '年龄范围',
  `gender` VARCHAR(20) COMMENT '性别要求',
  `salary_min` DECIMAL(10, 2) COMMENT '最低薪资',
  `salary_max` DECIMAL(10, 2) COMMENT '最高薪资',
  `recruit_count` INT NOT NULL COMMENT '招聘人数',
  `work_location` VARCHAR(255) COMMENT '工作地点',
  `work_time` VARCHAR(100) COMMENT '工作时间',
  `job_description` TEXT COMMENT '岗位职责',
  `job_requirements` TEXT COMMENT '任职要求',
  `welfare` TEXT COMMENT '福利待遇',
  `status` ENUM('draft', 'published', 'recruiting', 'completed', 'cancelled') NOT NULL DEFAULT 'draft' COMMENT '状态',
  `publish_time` DATETIME COMMENT '发布时间',
  `creator_id` BIGINT UNSIGNED COMMENT '创建人ID',
  `department_id` BIGINT UNSIGNED COMMENT '所属部门ID',
  `created_by` BIGINT UNSIGNED COMMENT '创建人ID',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_by` BIGINT UNSIGNED COMMENT '更新人ID',
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `deleted_at` DATETIME COMMENT '删除时间',
  `deleted_by` BIGINT UNSIGNED COMMENT '删除人ID',
  `remark` TEXT COMMENT '备注',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_demand_no` (`demand_no`),
  KEY `idx_factory_id` (`factory_id`),
  KEY `idx_status` (`status`),
  KEY `idx_publish_time` (`publish_time`),
  KEY `idx_creator_id` (`creator_id`),
  KEY `idx_department_id` (`department_id`),
  KEY `idx_deleted_at` (`deleted_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='招聘需求表';
```

### 9. 简历表 (resumes)

```sql
CREATE TABLE `resumes` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '简历ID',
  `resume_no` VARCHAR(50) NOT NULL COMMENT '简历编号',
  `worker_id` BIGINT UNSIGNED NOT NULL COMMENT '工人ID',
  `worker_name` VARCHAR(50) NOT NULL COMMENT '工人姓名',
  `gender` VARCHAR(20) COMMENT '性别',
  `age` INT COMMENT '年龄',
  `phone` VARCHAR(20) NOT NULL COMMENT '手机号',
  `education` VARCHAR(50) COMMENT '学历',
  `experience` VARCHAR(50) COMMENT '工作经验',
  `expected_salary` DECIMAL(10, 2) COMMENT '期望薪资',
  `expected_location` VARCHAR(255) COMMENT '期望工作地点',
  `self_introduction` TEXT COMMENT '自我介绍',
  `skills` TEXT COMMENT '技能特长',
  `work_experience` TEXT COMMENT '工作经历',
  `education_experience` TEXT COMMENT '教育经历',
  `status` ENUM('draft', 'submitted', 'viewed', 'interviewed', 'hired', 'rejected') NOT NULL DEFAULT 'draft' COMMENT '状态',
  `submit_time` DATETIME COMMENT '提交时间',
  `creator_id` BIGINT UNSIGNED COMMENT '创建人ID',
  `department_id` BIGINT UNSIGNED COMMENT '所属部门ID',
  `created_by` BIGINT UNSIGNED COMMENT '创建人ID',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_by` BIGINT UNSIGNED COMMENT '更新人ID',
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `deleted_at` DATETIME COMMENT '删除时间',
  `deleted_by` BIGINT UNSIGNED COMMENT '删除人ID',
  `remark` TEXT COMMENT '备注',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_resume_no` (`resume_no`),
  KEY `idx_worker_id` (`worker_id`),
  KEY `idx_status` (`status`),
  KEY `idx_submit_time` (`submit_time`),
  KEY `idx_creator_id` (`creator_id`),
  KEY `idx_department_id` (`department_id`),
  KEY `idx_deleted_at` (`deleted_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='简历表';
```

### 10. 转介绍记录表 (referrals)

```sql
CREATE TABLE `referrals` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '转介绍记录ID',
  `referral_no` VARCHAR(50) NOT NULL COMMENT '转介绍编号',
  `referrer_id` BIGINT UNSIGNED NOT NULL COMMENT '介绍人ID',
  `referrer_name` VARCHAR(50) NOT NULL COMMENT '介绍人姓名',
  `referrer_phone` VARCHAR(20) NOT NULL COMMENT '介绍人手机号',
  `referee_id` BIGINT UNSIGNED COMMENT '被介绍人ID',
  `referee_name` VARCHAR(50) COMMENT '被介绍人姓名',
  `referee_phone` VARCHAR(20) COMMENT '被介绍人手机号',
  `referee_company_id` BIGINT UNSIGNED COMMENT '被介绍人企业ID',
  `referee_company_name` VARCHAR(100) COMMENT '被介绍人企业名称',
  `referee_position` VARCHAR(100) COMMENT '被介绍人岗位',
  `referee_entry_date` DATETIME COMMENT '被介绍人入职日期',
  `commission_rate` DECIMAL(5, 2) COMMENT '佣金比例',
  `commission_amount` DECIMAL(10, 2) COMMENT '佣金金额',
  `status` ENUM('pending', 'confirmed', 'completed', 'cancelled') NOT NULL DEFAULT 'pending' COMMENT '状态',
  `confirm_time` DATETIME COMMENT '确认时间',
  `complete_time` DATETIME COMMENT '完成时间',
  `creator_id` BIGINT UNSIGNED COMMENT '创建人ID',
  `department_id` BIGINT UNSIGNED COMMENT '所属部门ID',
  `created_by` BIGINT UNSIGNED COMMENT '创建人ID',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_by` BIGINT UNSIGNED COMMENT '更新人ID',
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `deleted_at` DATETIME COMMENT '删除时间',
  `deleted_by` BIGINT UNSIGNED COMMENT '删除人ID',
  `remark` TEXT COMMENT '备注',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_referral_no` (`referral_no`),
  KEY `idx_referrer_id` (`referrer_id`),
  KEY `idx_referee_id` (`referee_id`),
  KEY `idx_referee_company_id` (`referee_company_id`),
  KEY `idx_status` (`status`),
  KEY `idx_confirm_time` (`confirm_time`),
  KEY `idx_complete_time` (`complete_time`),
  KEY `idx_creator_id` (`creator_id`),
  KEY `idx_department_id` (`department_id`),
  KEY `idx_deleted_at` (`deleted_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='转介绍记录表';
```

### 11. 佣金发放规则表 (commission_rules)

```sql
CREATE TABLE `commission_rules` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '佣金规则ID',
  `rule_name` VARCHAR(100) NOT NULL COMMENT '规则名称',
  `rule_code` VARCHAR(50) NOT NULL COMMENT '规则编码',
  `rule_type` ENUM('referral', 'pull_new', 'other') NOT NULL COMMENT '规则类型',
  `commission_type` ENUM('fixed', 'percentage') NOT NULL COMMENT '佣金类型',
  `commission_value` DECIMAL(10, 2) NOT NULL COMMENT '佣金值',
  `min_amount` DECIMAL(10, 2) COMMENT '最小金额',
  `max_amount` DECIMAL(10, 2) COMMENT '最大金额',
  `valid_period_start` DATE COMMENT '有效期开始',
  `valid_period_end` DATE COMMENT '有效期结束',
  `description` TEXT COMMENT '描述',
  `is_default` TINYINT(1) NOT NULL DEFAULT 0 COMMENT '是否默认',
  `sort_order` INT NOT NULL DEFAULT 0 COMMENT '排序',
  `status` ENUM('enabled', 'disabled') NOT NULL DEFAULT 'enabled' COMMENT '状态',
  `creator_id` BIGINT UNSIGNED COMMENT '创建人ID',
  `department_id` BIGINT UNSIGNED COMMENT '所属部门ID',
  `created_by` BIGINT UNSIGNED COMMENT '创建人ID',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_by` BIGINT UNSIGNED COMMENT '更新人ID',
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `deleted_at` DATETIME COMMENT '删除时间',
  `deleted_by` BIGINT UNSIGNED COMMENT '删除人ID',
  `remark` TEXT COMMENT '备注',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_rule_code` (`rule_code`),
  KEY `idx_rule_type` (`rule_type`),
  KEY `idx_commission_type` (`commission_type`),
  KEY `idx_status` (`status`),
  KEY `idx_creator_id` (`creator_id`),
  KEY `idx_department_id` (`department_id`),
  KEY `idx_deleted_at` (`deleted_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='佣金发放规则表';
```

### 12. 佣金发放记录表 (commission_records)

```sql
CREATE TABLE `commission_records` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '佣金记录ID',
  `record_no` VARCHAR(50) NOT NULL COMMENT '记录编号',
  `commission_type` ENUM('referral', 'pull_new', 'other') NOT NULL COMMENT '佣金类型',
  `commission_rule_id` BIGINT UNSIGNED COMMENT '佣金规则ID',
  `receiver_id` BIGINT UNSIGNED NOT NULL COMMENT '接收人ID',
  `receiver_name` VARCHAR(50) NOT NULL COMMENT '接收人姓名',
  `receiver_phone` VARCHAR(20) NOT NULL COMMENT '接收人手机号',
  `commission_amount` DECIMAL(10, 2) NOT NULL COMMENT '佣金金额',
  `business_type` VARCHAR(50) COMMENT '业务类型',
  `business_id` BIGINT UNSIGNED COMMENT '业务ID',
  `payment_method` VARCHAR(50) COMMENT '支付方式',
  `payment_account` VARCHAR(100) COMMENT '支付账号',
  `payment_time` DATETIME COMMENT '支付时间',
  `status` ENUM('pending', 'paid', 'failed', 'cancelled') NOT NULL DEFAULT 'pending' COMMENT '状态',
  `pay_time` DATETIME COMMENT '实际支付时间',
  `creator_id` BIGINT UNSIGNED COMMENT '创建人ID',
  `department_id` BIGINT UNSIGNED COMMENT '所属部门ID',
  `created_by` BIGINT UNSIGNED COMMENT '创建人ID',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_by` BIGINT UNSIGNED COMMENT '更新人ID',
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `deleted_at` DATETIME COMMENT '删除时间',
  `deleted_by` BIGINT UNSIGNED COMMENT '删除人ID',
  `remark` TEXT COMMENT '备注',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_record_no` (`record_no`),
  KEY `idx_commission_type` (`commission_type`),
  KEY `idx_commission_rule_id` (`commission_rule_id`),
  KEY `idx_receiver_id` (`receiver_id`),
  KEY `idx_business_type` (`business_type`),
  KEY `idx_business_id` (`business_id`),
  KEY `idx_status` (`status`),
  KEY `idx_payment_time` (`payment_time`),
  KEY `idx_creator_id` (`creator_id`),
  KEY `idx_department_id` (`department_id`),
  KEY `idx_deleted_at` (`deleted_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='佣金发放记录表';
```

### 13. 拉新奖励记录表 (pull_new_rewards)

```sql
CREATE TABLE `pull_new_rewards` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '拉新奖励ID',
  `reward_no` VARCHAR(50) NOT NULL COMMENT '奖励编号',
  `referrer_id` BIGINT UNSIGNED NOT NULL COMMENT '邀请人ID',
  `referrer_name` VARCHAR(50) NOT NULL COMMENT '邀请人姓名',
  `referrer_phone` VARCHAR(20) NOT NULL COMMENT '邀请人手机号',
  `new_user_id` BIGINT UNSIGNED NOT NULL COMMENT '新用户ID',
  `new_user_name` VARCHAR(50) NOT NULL COMMENT '新用户姓名',
  `new_user_phone` VARCHAR(20) NOT NULL COMMENT '新用户手机号',
  `new_user_type` ENUM('worker', 'labor_company', 'factory') NOT NULL COMMENT '新用户类型',
  `new_user_company_id` BIGINT UNSIGNED COMMENT '新用户企业ID',
  `new_user_company_name` VARCHAR(100) COMMENT '新用户企业名称',
  `reward_amount` DECIMAL(10, 2) NOT NULL COMMENT '奖励金额',
  `reward_rule_id` BIGINT UNSIGNED COMMENT '奖励规则ID',
  `reward_status` ENUM('pending', 'confirmed', 'completed', 'cancelled') NOT NULL DEFAULT 'pending' COMMENT '奖励状态',
  `confirm_time` DATETIME COMMENT '确认时间',
  `complete_time` DATETIME COMMENT '完成时间',
  `creator_id` BIGINT UNSIGNED COMMENT '创建人ID',
  `department_id` BIGINT UNSIGNED COMMENT '所属部门ID',
  `created_by` BIGINT UNSIGNED COMMENT '创建人ID',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_by` BIGINT UNSIGNED COMMENT '更新人ID',
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `deleted_at` DATETIME COMMENT '删除时间',
  `deleted_by` BIGINT UNSIGNED COMMENT '删除人ID',
  `remark` TEXT COMMENT '备注',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_reward_no` (`reward_no`),
  KEY `idx_referrer_id` (`referrer_id`),
  KEY `idx_new_user_id` (`new_user_id`),
  KEY `idx_new_user_type` (`new_user_type`),
  KEY `idx_new_user_company_id` (`new_user_company_id`),
  KEY `idx_reward_rule_id` (`reward_rule_id`),
  KEY `idx_reward_status` (`reward_status`),
  KEY `idx_confirm_time` (`confirm_time`),
  KEY `idx_complete_time` (`complete_time`),
  KEY `idx_creator_id` (`creator_id`),
  KEY `idx_department_id` (`department_id`),
  KEY `idx_deleted_at` (`deleted_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='拉新奖励记录表';
```

### 14. 费用记录表 (expenses)

```sql
CREATE TABLE `expenses` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '费用记录ID',
  `expense_no` VARCHAR(50) NOT NULL COMMENT '费用编号',
  `expense_type` VARCHAR(50) NOT NULL COMMENT '费用类型',
  `expense_category` VARCHAR(50) COMMENT '费用分类',
  `expense_amount` DECIMAL(10, 2) NOT NULL COMMENT '费用金额',
  `expense_date` DATE NOT NULL COMMENT '费用日期',
  `payer_id` BIGINT UNSIGNED COMMENT '付款人ID',
  `payer_name` VARCHAR(50) COMMENT '付款人姓名',
  `payee_id` BIGINT UNSIGNED COMMENT '收款人ID',
  `payee_name` VARCHAR(50) COMMENT '收款人姓名',
  `payment_method` VARCHAR(50) COMMENT '支付方式',
  `payment_account` VARCHAR(100) COMMENT '支付账号',
  `business_type` VARCHAR(50) COMMENT '业务类型',
  `business_id` BIGINT UNSIGNED COMMENT '业务ID',
  `description` TEXT COMMENT '费用描述',
  `attachment_ids` JSON COMMENT '附件ID列表（JSON数组）',
  `status` ENUM('pending', 'approved', 'paid', 'rejected', 'cancelled') NOT NULL DEFAULT 'pending' COMMENT '状态',
  `approval_status` ENUM('pending', 'approved', 'rejected') NOT NULL DEFAULT 'pending' COMMENT '审批状态',
  `pay_time` DATETIME COMMENT '支付时间',
  `creator_id` BIGINT UNSIGNED COMMENT '创建人ID',
  `department_id` BIGINT UNSIGNED COMMENT '所属部门ID',
  `created_by` BIGINT UNSIGNED COMMENT '创建人ID',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_by` BIGINT UNSIGNED COMMENT '更新人ID',
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `deleted_at` DATETIME COMMENT '删除时间',
  `deleted_by` BIGINT UNSIGNED COMMENT '删除人ID',
  `remark` TEXT COMMENT '备注',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_expense_no` (`expense_no`),
  KEY `idx_expense_type` (`expense_type`),
  KEY `idx_expense_category` (`expense_category`),
  KEY `idx_expense_date` (`expense_date`),
  KEY `idx_payer_id` (`payer_id`),
  KEY `idx_payee_id` (`payee_id`),
  KEY `idx_business_type` (`business_type`),
  KEY `idx_business_id` (`business_id`),
  KEY `idx_status` (`status`),
  KEY `idx_approval_status` (`approval_status`),
  KEY `idx_pay_time` (`pay_time`),
  KEY `idx_creator_id` (`creator_id`),
  KEY `idx_department_id` (`department_id`),
  KEY `idx_deleted_at` (`deleted_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='费用记录表';
```

### 15. 活动表 (activities)

```sql
CREATE TABLE `activities` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '活动ID',
  `activity_name` VARCHAR(100) NOT NULL COMMENT '活动名称',
  `activity_code` VARCHAR(50) NOT NULL COMMENT '活动编码',
  `activity_type` VARCHAR(50) NOT NULL COMMENT '活动类型',
  `activity_category` VARCHAR(50) COMMENT '活动分类',
  `cover_image` VARCHAR(255) COMMENT '封面图片',
  `activity_description` TEXT COMMENT '活动描述',
  `activity_content` LONGTEXT COMMENT '活动内容（富文本）',
  `start_time` DATETIME NOT NULL COMMENT '开始时间',
  `end_time` DATETIME NOT NULL COMMENT '结束时间',
  `location` VARCHAR(255) COMMENT '活动地点',
  `max_participants` INT COMMENT '最大参与人数',
  `current_participants` INT NOT NULL DEFAULT 0 COMMENT '当前参与人数',
  `registration_start_time` DATETIME COMMENT '报名开始时间',
  `registration_end_time` DATETIME COMMENT '报名结束时间',
  `need_approval` TINYINT(1) NOT NULL DEFAULT 0 COMMENT '是否需要审核',
  `reward_points` INT COMMENT '奖励积分',
  `reward_coins` INT COMMENT '奖励金币',
  `status` ENUM('draft', 'published', 'ongoing', 'ended', 'cancelled') NOT NULL DEFAULT 'draft' COMMENT '状态',
  `publish_time` DATETIME COMMENT '发布时间',
  `creator_id` BIGINT UNSIGNED COMMENT '创建人ID',
  `department_id` BIGINT UNSIGNED COMMENT '所属部门ID',
  `created_by` BIGINT UNSIGNED COMMENT '创建人ID',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_by` BIGINT UNSIGNED COMMENT '更新人ID',
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `deleted_at` DATETIME COMMENT '删除时间',
  `deleted_by` BIGINT UNSIGNED COMMENT '删除人ID',
  `remark` TEXT COMMENT '备注',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_activity_code` (`activity_code`),
  KEY `idx_activity_type` (`activity_type`),
  KEY `idx_activity_category` (`activity_category`),
  KEY `idx_start_time` (`start_time`),
  KEY `idx_end_time` (`end_time`),
  KEY `idx_status` (`status`),
  KEY `idx_publish_time` (`publish_time`),
  KEY `idx_creator_id` (`creator_id`),
  KEY `idx_department_id` (`department_id`),
  KEY `idx_deleted_at` (`deleted_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='活动表';
```

### 16. 报名记录表 (registrations)

```sql
CREATE TABLE `registrations` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '报名记录ID',
  `registration_no` VARCHAR(50) NOT NULL COMMENT '报名编号',
  `activity_id` BIGINT UNSIGNED NOT NULL COMMENT '活动ID',
  `activity_name` VARCHAR(100) NOT NULL COMMENT '活动名称',
  `user_id` BIGINT UNSIGNED NOT NULL COMMENT '用户ID',
  `user_name` VARCHAR(50) NOT NULL COMMENT '用户姓名',
  `user_phone` VARCHAR(20) NOT NULL COMMENT '用户手机号',
  `user_type` ENUM('worker', 'employee') NOT NULL COMMENT '用户类型',
  `registration_time` DATETIME NOT NULL COMMENT '报名时间',
  `check_in_time` DATETIME COMMENT '签到时间',
  `check_out_time` DATETIME COMMENT '签退时间',
  `attendance_status` ENUM('not_attended', 'attended', 'late', 'early_leave') COMMENT '出勤状态',
  `approval_status` ENUM('pending', 'approved', 'rejected') COMMENT '审批状态',
  `approval_time` DATETIME COMMENT '审批时间',
  `approval_comment` TEXT COMMENT '审批意见',
  `reward_points` INT COMMENT '奖励积分',
  `reward_coins` INT COMMENT '奖励金币',
  `points_granted` TINYINT(1) NOT NULL DEFAULT 0 COMMENT '积分是否已发放',
  `coins_granted` TINYINT(1) NOT NULL DEFAULT 0 COMMENT '金币是否已发放',
  `status` ENUM('registered', 'approved', 'rejected', 'attended', 'cancelled') NOT NULL DEFAULT 'registered' COMMENT '状态',
  `creator_id` BIGINT UNSIGNED COMMENT '创建人ID',
  `department_id` BIGINT UNSIGNED COMMENT '所属部门ID',
  `created_by` BIGINT UNSIGNED COMMENT '创建人ID',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_by` BIGINT UNSIGNED COMMENT '更新人ID',
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `deleted_at` DATETIME COMMENT '删除时间',
  `deleted_by` BIGINT UNSIGNED COMMENT '删除人ID',
  `remark` TEXT COMMENT '备注',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_registration_no` (`registration_no`),
  KEY `idx_activity_id` (`activity_id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_user_type` (`user_type`),
  KEY `idx_registration_time` (`registration_time`),
  KEY `idx_approval_status` (`approval_status`),
  KEY `idx_status` (`status`),
  KEY `idx_creator_id` (`creator_id`),
  KEY `idx_department_id` (`department_id`),
  KEY `idx_deleted_at` (`deleted_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='报名记录表';
```

### 17. 注册用户表 (registered_users)

```sql
CREATE TABLE `registered_users` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '注册用户ID',
  `user_no` VARCHAR(50) NOT NULL COMMENT '用户编号',
  `user_name` VARCHAR(50) NOT NULL COMMENT '用户姓名',
  `phone` VARCHAR(20) NOT NULL COMMENT '手机号',
  `email` VARCHAR(100) COMMENT '邮箱',
  `gender` VARCHAR(20) COMMENT '性别',
  `age` INT COMMENT '年龄',
  `education` VARCHAR(50) COMMENT '学历',
  `experience` VARCHAR(50) COMMENT '工作经验',
  `user_type` ENUM('worker', 'labor_company', 'factory') NOT NULL COMMENT '用户类型',
  `company_id` BIGINT UNSIGNED COMMENT '企业ID',
  `company_name` VARCHAR(100) COMMENT '企业名称',
  `department_id` BIGINT UNSIGNED COMMENT '部门ID',
  `position_id` BIGINT UNSIGNED COMMENT '岗位ID',
  `registration_source` VARCHAR(50) COMMENT '注册来源',
  `referrer_id` BIGINT UNSIGNED COMMENT '邀请人ID',
  `referrer_name` VARCHAR(50) COMMENT '邀请人姓名',
  `registration_time` DATETIME NOT NULL COMMENT '注册时间',
  `last_login_time` DATETIME COMMENT '最后登录时间',
  `status` ENUM('active', 'inactive', 'locked') NOT NULL DEFAULT 'active' COMMENT '状态',
  `creator_id` BIGINT UNSIGNED COMMENT '创建人ID',
  `department_id_admin` BIGINT UNSIGNED COMMENT '所属部门ID',
  `created_by` BIGINT UNSIGNED COMMENT '创建人ID',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_by` BIGINT UNSIGNED COMMENT '更新人ID',
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `deleted_at` DATETIME COMMENT '删除时间',
  `deleted_by` BIGINT UNSIGNED COMMENT '删除人ID',
  `remark` TEXT COMMENT '备注',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_user_no` (`user_no`),
  UNIQUE KEY `uk_phone` (`phone`),
  KEY `idx_user_type` (`user_type`),
  KEY `idx_company_id` (`company_id`),
  KEY `idx_department_id` (`department_id`),
  KEY `idx_position_id` (`position_id`),
  KEY `idx_registration_source` (`registration_source`),
  KEY `idx_referrer_id` (`referrer_id`),
  KEY `idx_registration_time` (`registration_time`),
  KEY `idx_status` (`status`),
  KEY `idx_creator_id` (`creator_id`),
  KEY `idx_department_id_admin` (`department_id_admin`),
  KEY `idx_deleted_at` (`deleted_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='注册用户表';
```

### 18. 预警消息模版表 (warning_templates)

```sql
CREATE TABLE `warning_templates` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '预警模版ID',
  `template_name` VARCHAR(100) NOT NULL COMMENT '模版名称',
  `template_code` VARCHAR(50) NOT NULL COMMENT '模版编码',
  `warning_type` ENUM('system', 'business', 'security', 'other') NOT NULL COMMENT '预警类型',
  `warning_level` ENUM('critical', 'high', 'medium', 'low') NOT NULL COMMENT '预警级别',
  `title_template` VARCHAR(255) NOT NULL COMMENT '标题模版',
  `content_template` TEXT NOT NULL COMMENT '内容模版',
  `trigger_condition` TEXT COMMENT '触发条件',
  `notification_method` JSON COMMENT '通知方式（JSON数组）',
  `handler_role_ids` JSON COMMENT '处理人角色ID列表（JSON数组）',
  `description` VARCHAR(255) COMMENT '描述',
  `is_default` TINYINT(1) NOT NULL DEFAULT 0 COMMENT '是否默认',
  `sort_order` INT NOT NULL DEFAULT 0 COMMENT '排序',
  `status` ENUM('enabled', 'disabled') NOT NULL DEFAULT 'enabled' COMMENT '状态',
  `creator_id` BIGINT UNSIGNED COMMENT '创建人ID',
  `department_id` BIGINT UNSIGNED COMMENT '所属部门ID',
  `created_by` BIGINT UNSIGNED COMMENT '创建人ID',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_by` BIGINT UNSIGNED COMMENT '更新人ID',
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `deleted_at` DATETIME COMMENT '删除时间',
  `deleted_by` BIGINT UNSIGNED COMMENT '删除人ID',
  `remark` TEXT COMMENT '备注',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_template_code` (`template_code`),
  KEY `idx_warning_type` (`warning_type`),
  KEY `idx_warning_level` (`warning_level`),
  KEY `idx_status` (`status`),
  KEY `idx_creator_id` (`creator_id`),
  KEY `idx_department_id` (`department_id`),
  KEY `idx_deleted_at` (`deleted_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='预警消息模版表';
```

### 19. 学历对应岗位表 (education_jobs)

```sql
CREATE TABLE `education_jobs` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `education` VARCHAR(50) NOT NULL COMMENT '学历',
  `job_categories` JSON NOT NULL COMMENT '岗位类别（JSON数组）',
  `description` TEXT COMMENT '描述',
  `sort_order` INT NOT NULL DEFAULT 0 COMMENT '排序',
  `status` ENUM('enabled', 'disabled') NOT NULL DEFAULT 'enabled' COMMENT '状态',
  `creator_id` BIGINT UNSIGNED COMMENT '创建人ID',
  `department_id` BIGINT UNSIGNED COMMENT '所属部门ID',
  `created_by` BIGINT UNSIGNED COMMENT '创建人ID',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_by` BIGINT UNSIGNED COMMENT '更新人ID',
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `deleted_at` DATETIME COMMENT '删除时间',
  `deleted_by` BIGINT UNSIGNED COMMENT '删除人ID',
  `remark` TEXT COMMENT '备注',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_education` (`education`),
  KEY `idx_status` (`status`),
  KEY `idx_creator_id` (`creator_id`),
  KEY `idx_department_id` (`department_id`),
  KEY `idx_deleted_at` (`deleted_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='学历对应岗位表';
```

### 20. 平台账号表 (platform_accounts)

```sql
CREATE TABLE `platform_accounts` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '平台账号ID',
  `account_name` VARCHAR(100) NOT NULL COMMENT '账号名称',
  `account_code` VARCHAR(50) NOT NULL COMMENT '账号编码',
  `account_type` VARCHAR(50) NOT NULL COMMENT '账号类型',
  `account_number` VARCHAR(100) NOT NULL COMMENT '账号号码',
  `account_holder` VARCHAR(100) NOT NULL COMMENT '账户持有人',
  `bank_name` VARCHAR(100) COMMENT '银行名称',
  `bank_branch` VARCHAR(100) COMMENT '银行分行',
  `opening_bank` VARCHAR(255) COMMENT '开户行',
  `currency` VARCHAR(10) NOT NULL DEFAULT 'CNY' COMMENT '币种',
  `balance` DECIMAL(15, 2) NOT NULL DEFAULT 0.00 COMMENT '余额',
  `frozen_amount` DECIMAL(15, 2) NOT NULL DEFAULT 0.00 COMMENT '冻结金额',
  `available_amount` DECIMAL(15, 2) NOT NULL DEFAULT 0.00 COMMENT '可用金额',
  `status` ENUM('active', 'inactive', 'frozen') NOT NULL DEFAULT 'active' COMMENT '状态',
  `description` VARCHAR(255) COMMENT '描述',
  `creator_id` BIGINT UNSIGNED COMMENT '创建人ID',
  `department_id` BIGINT UNSIGNED COMMENT '所属部门ID',
  `created_by` BIGINT UNSIGNED COMMENT '创建人ID',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_by` BIGINT UNSIGNED COMMENT '更新人ID',
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `deleted_at` DATETIME COMMENT '删除时间',
  `deleted_by` BIGINT UNSIGNED COMMENT '删除人ID',
  `remark` TEXT COMMENT '备注',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_account_code` (`account_code`),
  UNIQUE KEY `uk_account_number` (`account_number`),
  KEY `idx_account_type` (`account_type`),
  KEY `idx_status` (`status`),
  KEY `idx_creator_id` (`creator_id`),
  KEY `idx_department_id` (`department_id`),
  KEY `idx_deleted_at` (`deleted_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='平台账号表';
```

### 21. 账户流水表 (account_transactions)

```sql
CREATE TABLE `account_transactions` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '流水ID',
  `transaction_no` VARCHAR(50) NOT NULL COMMENT '流水编号',
  `account_id` BIGINT UNSIGNED NOT NULL COMMENT '账户ID',
  `transaction_type` ENUM('income', 'expense', 'transfer_in', 'transfer_out', 'freeze', 'unfreeze') NOT NULL COMMENT '交易类型',
  `transaction_category` VARCHAR(50) COMMENT '交易分类',
  `transaction_amount` DECIMAL(15, 2) NOT NULL COMMENT '交易金额',
  `balance_before` DECIMAL(15, 2) NOT NULL COMMENT '交易前余额',
  `balance_after` DECIMAL(15, 2) NOT NULL COMMENT '交易后余额',
  `related_user_id` BIGINT UNSIGNED COMMENT '关联用户ID',
  `related_user_name` VARCHAR(50) COMMENT '关联用户姓名',
  `business_type` VARCHAR(50) COMMENT '业务类型',
  `business_id` BIGINT UNSIGNED COMMENT '业务ID',
  `description` TEXT COMMENT '描述',
  `transaction_time` DATETIME NOT NULL COMMENT '交易时间',
  `creator_id` BIGINT UNSIGNED COMMENT '创建人ID',
  `department_id` BIGINT UNSIGNED COMMENT '所属部门ID',
  `created_by` BIGINT UNSIGNED COMMENT '创建人ID',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_by` BIGINT UNSIGNED COMMENT '更新人ID',
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `deleted_at` DATETIME COMMENT '删除时间',
  `deleted_by` BIGINT UNSIGNED COMMENT '删除人ID',
  `remark` TEXT COMMENT '备注',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_transaction_no` (`transaction_no`),
  KEY `idx_account_id` (`account_id`),
  KEY `idx_transaction_type` (`transaction_type`),
  KEY `idx_transaction_category` (`transaction_category`),
  KEY `idx_related_user_id` (`related_user_id`),
  KEY `idx_business_type` (`business_type`),
  KEY `idx_business_id` (`business_id`),
  KEY `idx_transaction_time` (`transaction_time`),
  KEY `idx_creator_id` (`creator_id`),
  KEY `idx_department_id` (`department_id`),
  KEY `idx_deleted_at` (`deleted_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='账户流水表';
```

---

## 索引设计说明

### 1. 主键索引
所有表都使用自增主键，自动创建聚簇索引。

### 2. 唯一索引
- 用户表：username, phone
- 角色表：role_code
- 菜单表：menu_code
- 字典表：(dict_type, dict_value) 组合唯一
- 套餐表：package_code
- 租户表：tenant_code
- 租户标签表：tag_code
- 招聘需求表：demand_no
- 简历表：resume_no
- 转介绍记录表：referral_no
- 佣金规则表：rule_code
- 佣金记录表：record_no
- 拉新奖励记录表：reward_no
- 费用记录表：expense_no
- 活动表：activity_code
- 报名记录表：registration_no
- 注册用户表：user_no, phone
- 预警模版表：template_code
- 学历对应岗位表：education
- 平台账号表：account_code, account_number
- 账户流水表：transaction_no

### 3. 普通索引
- 外键字段：所有外键字段都创建索引
- 状态字段：status, approval_status, reward_status 等状态字段
- 时间字段：created_at, updated_at, deadline, publish_time 等时间字段
- 业务字段：type, category, priority, level 等业务分类字段
- 用户字段：creator_id, manager_id, assignee_id 等用户关联字段
- 部门字段：department_id 用于数据权限过滤

### 4. 组合索引
- 用户角色关联表：(user_id, role_id)
- 角色菜单关联表：(role_id, menu_id)
- 租户标签关联表：(tenant_id, tag_id)

---

## 数据权限设计

### 1. 数据权限类型
- **ALL**：全部数据
- **DEPARTMENT**：本部门数据
- **DEPARTMENT_AND_BELOW**：本部门及下属部门数据
- **SELF**：本人数据
- **CUSTOM**：自定义部门数据

### 2. 数据权限实现
在角色表中配置数据权限类型，所有业务表都包含数据权限相关字段：
- `creator_id`：创建人ID
- `manager_id`：负责人ID
- `department_id`：所属部门ID

查询时根据用户角色的数据权限类型自动过滤数据。

---

## 审批流程设计

### 1. 审批记录表
审批记录表记录所有审批流程的审批历史，包括：
- 业务类型和业务ID
- 流程名称和节点名称
- 审批人和审批时间
- 审批结果和审批意见

### 2. 审批状态流转
- 未审核 → 审核中 → 审核通过/已驳回
- 支持多次审核记录
- 审批记录完整保存

---

## 软删除设计

所有业务表都支持软删除：
- `deleted_at`：删除时间（NULL表示未删除）
- `deleted_by`：删除人ID
- 查询时默认过滤已删除数据（WHERE deleted_at IS NULL）

---

## 数据库设计总结

本数据库设计文档包含了蓝领智汇平台的所有业务表结构，共计21张业务表，涵盖：

1. **基础表**（11张）：用户、角色、菜单、部门、岗位、字典、附件、操作日志、审批记录等
2. **平台管理端业务表**（10张）：待办任务、消息、预警、套餐、租户、招聘需求、简历、转介绍、佣金、拉新奖励、费用、活动、报名、注册用户、预警模版、学历对应岗位、平台账号、账户流水等

所有表都遵循统一的命名规范、字段类型规范和索引设计原则，支持数据权限控制、审批流程、软删除等功能。

---

**文档版本**：v1.0
**创建日期**：2026-02-26
**最后更新**：2026-02-26
