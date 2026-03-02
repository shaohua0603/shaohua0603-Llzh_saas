# 蓝领智汇平台开发规范

## 1. 项目结构规范

### 1.1 目录结构
```
blue-collar-platform/
├── src/
│   ├── assets/        # 静态资源
│   ├── components/    # 通用组件
│   ├── layouts/       # 布局组件
│   ├── router/        # 路由配置
│   ├── views/         # 页面视图
│   │   ├── worker/    # 工人端页面
│   │   ├── labor-company/    # 劳务公司端页面
│   │   ├── factory/   # 工厂端页面
│   │   ├── admin/     # 管理员端页面
│   │   └── common/    # 公共页面
│   ├── App.vue        # 根组件
│   ├── main.ts        # 入口文件
│   └── style.css      # 全局样式
├── mock/              # Mock数据
├── public/            # 公共静态资源
├── package.json       # 项目配置
└── tsconfig.json      # TypeScript配置
```

### 1.2 文件命名规范
- **组件文件**：使用大驼峰命名法，如 `WorkerLayout.vue`
- **页面文件**：使用大驼峰命名法，如 `Home.vue`
- **布局文件**：使用大驼峰命名法，如 `WorkerLayout.vue`
- **工具文件**：使用小驼峰命名法，如 `apiService.ts`
- **类型定义文件**：使用 `.d.ts` 后缀，如 `types.d.ts`

## 2. 代码风格规范

### 2.1 代码格式
- 使用 2 个空格进行缩进
- 每行代码长度不超过 120 个字符
- 使用单引号或反引号，避免使用双引号
- 大括号使用同一行风格
- 逗号后添加空格
- 操作符前后添加空格

### 2.2 命名规范
- **变量名**：使用小驼峰命名法，如 `userInfo`
- **函数名**：使用小驼峰命名法，如 `getUserInfo`
- **组件名**：使用大驼峰命名法，如 `WorkerHome`
- **常量**：使用全大写字母，如 `MAX_LENGTH`
- **枚举**：使用大驼峰命名法，如 `UserRole`

### 2.3 注释规范
- 使用中文注释
- 组件顶部添加组件说明
- 复杂逻辑添加详细注释
- 函数添加参数和返回值说明
- 避免不必要的注释

## 3. 组件开发规范

### 3.1 组件结构
- 使用 Vue 3 Composition API
- 使用 `<script setup>` 语法
- 组件结构清晰，逻辑分离
- 组件大小控制在合理范围内

### 3.2 组件设计
- 遵循单一职责原则
- 组件可复用性设计
- 组件通信使用 props 和 emit
- 避免组件深度嵌套
- **按钮操作规范**：参见 27. 操作按钮规范

### 3.3 样式管理
- 使用 scoped 样式
- 避免使用 !important
- 合理使用 CSS 变量
- 响应式设计适配不同屏幕

### 3.4 日期时间选择组件规范
- **统一组件**：使用 Element Plus 的日期时间选择组件作为基础
- **中文友好**：确保所有选择器都以中文显示，包括月份、星期、按钮文字等
- **年度选择**：支持年份选择器，显示中文年份
- **月度选择**：支持月份选择器，显示中文月份
- **日期选择**：支持日期选择器，显示中文星期和月份
- **时间选择**：支持时间选择器，符合中文用户使用习惯
- **日期时间范围**：支持日期时间范围选择，用于筛选等场景
- **格式化**：统一日期时间显示格式，符合中文用户阅读习惯
- ** placeholder**：使用中文提示文字，如"选择日期"、"选择时间"等

### 3.5 表格组件规范
- **统一表格组件**：使用 Element Plus 的 Table 组件作为基础，封装统一的表格组件
- **详细规范**：参见 第24章

### 3.6 页面信息展示原则
- **优先可视范围展示**：内容区域的信息展示，优先按照所有信息在一个可视范围进行展示
- **滚动效果作为备选**：无法展示的情况下再考虑滚动效果
- **响应式适配**：根据屏幕尺寸自动调整布局，确保信息展示合理
- **信息层级**：重要信息优先展示，次要信息可折叠或通过弹窗展示
- **数据密度**：根据数据类型和重要性调整展示密度，确保可读性
- **视觉引导**：使用视觉元素引导用户关注重要信息

## 4. 布局设计规范

### 4.1 布局结构
- 工人端：底部导航栏 + 内容区域
- 劳务公司/工厂端：左侧菜单 + 顶部导航 + 内容区域
- 管理员端：左侧菜单 + 顶部导航 + 内容区域

### 4.2 导航设计
- 工人端：底部固定导航栏，包含 5 个主要模块
- 其他端：左侧可折叠菜单，顶部面包屑导航

### 4.3 响应式布局
- **详细规范**：参见 28. 页面布局规范

### 4.4 PC端统一菜单结构规范

#### 4.4.1 一级菜单
- **位置**：顶部导航栏，水平显示
- **样式**：包含图标和文字，支持响应式调整
- **功能**：
  - 点击切换对应模块，只显示其对应的二级菜单，不默认展示内容页面
  - 支持根据屏幕宽度自动调整显示（显示/隐藏文字）
  - 支持下拉菜单收纳超出的菜单项
- **实现**：使用 Element Plus 的 Menu 组件，mode="horizontal"

#### 4.4.2 二级菜单
- **位置**：左侧侧边栏，垂直显示
- **样式**：包含图标和文字，支持折叠/展开
- **功能**：
  - 根据选中的一级菜单动态显示
  - 支持点击展开/收起三级菜单
  - 点击导航到对应页面
- **实现**：使用 Element Plus 的 Menu 组件，mode="vertical"

#### 4.4.3 三级菜单
- **位置**：左侧侧边栏，作为二级菜单的子菜单
- **样式**：包含图标和文字
- **功能**：
  - 根据选中的二级菜单动态显示
  - 点击导航到对应页面
- **实现**：使用 Element Plus 的 SubMenu 组件

#### 4.4.4 四级页面导航栏
- **位置**：内容区域顶部，页面标签栏
- **样式**：显示当前打开的页面标签
- **功能**：
  - 显示当前打开的页面标签
  - 点击标签切换页面
  - 支持右键菜单操作：
    - 刷新当前页
    - 关闭当前页
    - 关闭其他页面
    - 关闭全部页面
  - 支持标签拖拽排序
- **实现**：自定义页面标签组件，集成右键菜单功能

#### 4.4.5 侧边栏折叠/展开
- **功能**：点击折叠/展开按钮切换侧边栏状态
- **展开状态**：显示完整菜单结构（图标 + 文字）
- **折叠状态**：仅显示菜单图标，隐藏文字
- **实现**：使用 CSS 过渡动画，结合 Element Plus 的 collapse 属性

#### 4.4.6 菜单图标规范
- **统一图标库**：使用 Element Plus Icons
- **图标尺寸**：
  - 展开状态：16px
  - 折叠状态：20px
- **图标位置**：菜单项左侧，与文字间距适中

#### 4.4.7 菜单交互规范
- **悬停效果**：菜单项悬停时背景变色，文字变色
- **激活状态**：当前选中菜单项高亮显示
- **点击反馈**：点击菜单项有明显的视觉反馈
- **过渡动画**：菜单展开/折叠使用平滑过渡动画

## 5. 路由管理规范

### 5.1 路由结构
- 公共路由：登录、注册、忘记密码
- 工人端路由：/worker/*
- 劳务公司端路由：/labor-company/*
- 工厂端路由：/factory/*
- 管理员端路由：/admin/*
- 移动端路由：/labor-company-mobile/*, /factory-mobile/*

### 5.2 路由配置
- 使用懒加载减少初始加载时间
- 添加路由元信息，如 title、requiresAuth、role
- 配置路由守卫，实现权限控制
- 统一路由跳转方式

### 5.3 权限控制
- 基于角色的权限控制
- 路由守卫检查用户权限
- 动态路由生成

## 6. 数据处理规范

### 6.1 数据获取
- 使用异步函数处理数据获取
- 使用 try-catch 捕获错误
- 实现加载状态管理
- 数据缓存策略

### 6.2 数据格式化
- 统一数据格式处理
- 日期时间格式化
- 数字格式化
- 字符串处理

### 6.3 数据验证
- 表单数据验证
- API 参数验证
- 数据类型检查

## 7. Mock 数据规范

### 7.1 Mock 数据结构
- 模拟真实 API 响应格式
- 包含完整的数据字段
- 数据类型与真实数据一致
- 提供足够的测试数据

### 7.2 Mock 数据管理
- 集中管理 Mock 数据
- 按模块组织 Mock 数据
- 模拟不同场景的数据
- 保持 Mock 数据与真实 API 同步

### 7.3 Mock 服务
- 使用 Mock.js 模拟 API 调用
- 模拟延迟响应
- 模拟错误场景
- 模拟分页数据

## 8. 状态管理规范

### 8.1 状态管理方案
- 小型状态：使用组件内部状态
- 中型状态：使用 provide/inject
- 大型状态：使用 Pinia

### 8.2 状态设计
- 状态结构清晰
- 避免状态冗余
- 状态更新可预测
- 状态持久化策略

### 8.3 本地存储
- 使用 localStorage 存储用户信息
- 使用 sessionStorage 存储临时数据
- 存储数据加密处理
- 定期清理过期数据

## 9. TypeScript 使用规范

### 9.1 类型定义
- 为所有变量添加类型
- 为函数参数和返回值添加类型
- 使用接口定义复杂类型
- 使用泛型提高代码复用性

### 9.2 类型管理
- 集中管理类型定义
- 使用类型别名简化复杂类型
- 使用联合类型处理多种可能的类型
- 使用交叉类型组合类型

### 9.3 类型检查
- 启用严格类型检查
- 解决所有类型错误
- 避免使用 any 类型
- 使用 unknown 类型替代 any

## 10. 错误处理规范

### 10.1 错误捕获
- 全局错误捕获
- 组件级错误捕获
- API 错误处理
- 异步错误处理

### 10.2 错误提示
- 使用 Element Plus 消息提示
- 错误信息清晰明确
- 错误日志记录
- 用户友好的错误提示

### 10.3 错误恢复
- 页面错误自动恢复
- 数据加载失败重试机制
- 网络错误处理策略
- 降级方案

## 11. 性能优化规范

### 11.1 代码优化
- 减少不必要的计算
- 避免重复渲染
- 使用虚拟列表处理长列表
- 优化组件渲染性能

### 11.2 资源优化
- 图片懒加载
- 资源按需加载
- 代码分割
- 压缩静态资源

### 11.3 网络优化
- API 请求合并
- 请求防抖和节流
- 缓存策略
- 网络状态监测

## 12. 响应式设计规范
- **详细规范**：参见 28. 页面布局规范 - 28.8 响应式适配

## 13. 测试规范

### 13.1 测试策略
- 单元测试
- 集成测试
- E2E 测试
- 性能测试

### 13.2 测试工具
- Vitest 单元测试
- Cypress E2E 测试
- 测试覆盖率统计

### 13.3 测试流程
- 开发前编写测试用例
- 开发中执行测试
- 提交前运行完整测试
- 持续集成测试

## 14. 开发工作流

### 14.1 分支管理
- main：主分支
- develop：开发分支
- feature：功能分支
- bugfix：bug 修复分支

### 14.2 代码提交
- 提交信息清晰明确
- 提交前运行测试
- 提交前代码格式化
- 避免提交大文件

### 14.3 代码审查
- 代码审查流程
- 代码审查标准
- 代码审查工具

### 14.4 部署流程
- 开发环境部署
- 测试环境部署
- 生产环境部署
- 回滚策略

## 15. 技术栈规范

### 15.1 核心技术栈
- Vue 3 + TypeScript
- Element Plus
- Vue Router
- Mock.js

### 15.2 工具链
- Vite 构建工具
- ESLint 代码检查
- Prettier 代码格式化
- Husky Git 钩子

### 15.3 依赖管理
- 固定依赖版本
- 定期更新依赖
- 依赖安全检查

## 16. 安全规范

### 16.1 前端安全
- XSS 防护
- CSRF 防护
- 敏感信息加密
- 输入验证

### 16.2 数据安全
- 本地存储加密
- API 请求加密
- 数据传输安全
- 权限控制

### 16.3 代码安全
- 避免硬编码敏感信息
- 代码混淆
- 安全扫描

## 17. 文档规范

### 17.1 项目文档
- README.md
- 技术文档
- 开发规范
- API 文档

### 17.2 代码文档
- 组件文档
- 函数文档
- 类型文档
- 接口文档

### 17.3 注释规范
- 组件注释
- 函数注释
- 复杂逻辑注释
- 临时代码注释

## 18. 最佳实践

### 18.1 组件开发
- 组件拆分原则
- 组件通信方式
- 组件生命周期管理
- 组件性能优化

### 18.2 数据处理
- 数据流转设计
- 状态管理最佳实践
- API 调用优化
- 数据缓存策略

### 18.3 样式设计
- CSS 最佳实践
- 响应式设计技巧
- 动画效果优化
- 主题管理

### 18.4 性能优化
- 首屏加载优化
- 运行时性能优化
- 内存管理
- 网络请求优化

## 19. 常见问题处理

### 19.1 路由问题
- 路由跳转失败
- 路由守卫问题
- 路由参数传递

### 19.2 组件问题
- 组件渲染异常
- 组件通信问题
- 组件性能问题

### 19.3 数据问题
- 数据加载失败
- 数据更新问题
- 数据一致性问题

### 19.4 样式问题
- 样式冲突
- 响应式适配问题
- 浏览器兼容性问题

## 20. 开发工具配置

### 20.1 VS Code 配置
- 扩展推荐
- 工作区配置
- 代码片段

### 20.2 开发环境配置
- Node.js 版本
- 包管理器
- 环境变量

### 20.3 构建配置
- Vite 配置
- TypeScript 配置
- 打包优化

## 21. 业务功能模块规范

### 21.1 一级菜单结构（9个核心业务领域）
| 序号 | 菜单名称 | 功能说明 |
|------|----------|----------|
| 1 | 工作中心 | 工作任务与信息中心 |
| 2 | 招聘管理 | 招聘需求与简历管理 |
| 3 | 面试管理 | 面试全流程管理 |
| 4 | 工人管理 | 工人信息管理 |
| 5 | 合同管理 | 合同签订与管理 |
| 6 | 在职管理 | 在职员工全生命周期管理 |
| 7 | 离职管理 | 离职流程管理 |
| 8 | 结算管理 | 结算与佣金管理 |
| 9 | 系统管理 | 系统配置与管理 |

### 21.2 二级菜单结构（共32个功能模块）
- **工作中心**：待办任务、消息中心、预警信息
- **招聘管理**：招聘需求、简历管理
- **面试管理**：接送管理、初步面试、面试邀约、工厂面试
- **工人管理**：工人信息
- **合同管理**：签订合同
- **在职管理**：工作与生活、管理与关怀、特殊情况、保险管理、考勤管理、请假管理、调岗管理、奖惩管理、业务课堂、异常管理、投诉/建议
- **离职管理**：离职管理
- **结算管理**：工作转介绍、结算管理
- **系统管理**：企业介绍、部门管理、正式员工、岗位管理、规则配置、菜单配置、字典管理、系统参数、流程管理、流程配置、附件管理、打印管理

### 21.3 三级菜单结构（共17个子功能模块）
- **在职管理 > 工作与生活**：生活费管理、工资管理、理赔管理
- **在职管理 > 管理与关怀**：沟通管理、文娱活动、报名管理、发布资讯、社团管理
- **在职管理 > 保险管理**：保险管理、理赔管理、参保登记
- **在职管理 > 业务课堂**：学习材料、题库管理、学习时长管理、考试管理、考试成绩
- **结算管理 > 工作转介绍**：工作转介绍、佣金发放
- **系统管理 > 企业介绍**：企业文化介绍、岗位文化介绍
- **系统管理 > 打印管理**：模版配置、打印配置

### 21.4 功能模块命名规范
- **命名规则**：业务领域 + 功能类型
- **命名示例**：
  - 招聘管理 > 招聘需求
  - 面试管理 > 初步面试
  - 在职管理 > 考勤管理
- **命名原则**：
  - 简洁明了，见名知意
  - 使用业务术语
  - 保持命名一致性
  - 避免歧义

### 21.5 菜单层级设计原则
- 层级不超过4级
- 每级菜单数量控制在合理范围
- 菜单结构清晰，逻辑明确
- 支持动态配置

## 22. 数据权限配置规范（暂不开发）

//### 22.1 数据权限类型
| 权限类型 | 编码 | 说明 |
|----------|------|------|
| 全部数据 | ALL | 查看所有数据 |
| 本部门数据 | DEPARTMENT | 仅查看本部门数据 |
| 本部门及以下 | DEPARTMENT_AND_BELOW | 查看本部门及下属部门数据 |
| 本人数据 | SELF | 仅查看本人创建/负责的数据 |
| 自定义 | CUSTOM | 自定义选择部门数据权限 |

//### 22.2 权限应用场景
- **劳务公司管理员账户**：查看本公司所有数据
- **劳务公司正式员工账户**：根据岗位配置的数据权限查看
- **工厂管理员账户**：查看本工厂所有数据
- **工厂正式员工账户**：根据岗位配置的数据权限查看

//### 22.3 权限配置规则
- 岗位管理中配置数据权限
- 用户登录后根据岗位获取数据权限
- 所有列表查询自动应用数据权限过滤
- 数据权限支持组合配置
- 支持创建人、负责人、对接人等特殊权限

//### 22.4 权限配置接口定义
```typescript
interface DataPermissionConfig {
  type: 'ALL' | 'DEPARTMENT' | 'DEPARTMENT_AND_BELOW' | 'SELF' | 'CUSTOM';
  departments?: string[];
  includeCreator?: boolean;
  includeManager?: boolean;
  includeContact?: boolean;
}
```

## 23. 审批流程配置规范

### 23.1 审核状态流转
- **状态流转**：未审核 → 审核中 → 审核通过/已驳回
- **支持多次审核记录**
- **审核记录完整保存**

### 23.2 审批流程配置
```typescript
interface ApprovalFlowConfig {
  flowName: string;
  flowType: string;
  flowDescription: string;
  flowStatus: 'enabled' | 'disabled';
  nodes: ApprovalNode[];
}

interface ApprovalNode {
  nodeName: string;
  nodeType: 'approval' | 'cc';
  approvers: string[];
  approvalMode: 'or' | 'and';
}
```

### 23.3 流程关联配置
```typescript
interface FlowBusinessConfig {
  businessCode: string;
  businessName: string;
  flowName: string;
}
```

### 23.4 审批记录结构
```typescript
interface ApprovalRecord {
  nodeId: string;
  nodeName: string;
  approver: string;
  approvalTime: Date;
  approvalResult: 'approved' | 'rejected';
  approvalComment: string;
}
```

### 23.5 审批流程规则
- 未配置审批流的业务默认不需要审批
- 提交即进入审批流程
- 按节点顺序逐级审批
- 最后一个节点通过才完成审批
- 审批记录完整保存

### 23.6 需要审批的业务场景
- 请假管理
- 调岗管理
- 离职管理
- 报名管理（需审核的活动/社团）
- 其他需要审批的业务

## 24. 列表页面设计规范

### 24.1 列表页面配置
```typescript
interface ListPageConfig {
  search: boolean;
  filter: boolean;
  sort: boolean;
  pagination: boolean;
  create: boolean;
  update: boolean;
  delete: boolean;
  detail: boolean;
  import: boolean;
  export: boolean;
  print: boolean;
  batch: boolean;
  approval: boolean;
  publish: boolean;
  customButtons: CustomButton[];
  columns: ColumnConfig[];
  defaultSort: SortConfig;
  pageSize: number;
}
```

### 24.2 列配置规范
```typescript
interface ColumnConfig {
  field: string;
  label: string;
  width: number;
  sortable: boolean;
  filterable: boolean;
  visible: boolean;
  formatter: Function;
}
```

### 24.3 列表页面功能要求
**注：本规范仅适用于PC端页面，移动端页面另有移动端适配规范。**
- 所有列表页面统一使用表格组件
- 数据统计：以纯文字形式展示（展示在第一行，以纯文字形式展示，不占用表格行高）
- 支持列宽调整
- 支持字段显示/隐藏
- 支持全局搜索
- 支持自定义列表
- 支持悬浮提示
- 支持文本截断
- 支持多选和全选
- 支持加载状态和空数据提示
- 支持分页、排序、筛选

### 24.4 列表页面操作按钮位置
- **操作列**：详情、编辑、删除、审核等单条操作

## 25. 详情页面设计规范

### 25.1 详情页面配置
```typescript
interface DetailPageConfig {
  title: string;
  breadcrumb: BreadcrumbItem[];
  basicInfo: InfoGroup[];
  relatedInfo: InfoGroup[];
  operationRecords: OperationRecord[];
  approvalRecords: ApprovalRecord[];
  actions: ActionButton[];
  attachments: AttachmentConfig;
}
```

### 25.2 信息分组规范
```typescript
interface InfoGroup {
  title: string;
  fields: FieldConfig[];
  collapsible: boolean;
}
```

### 25.3 字段配置规范
```typescript
interface FieldConfig {
  label: string;
  value: any;
  type: 'text' | 'date' | 'number' | 'enum' | 'richtext' | 'file';
  formatter: Function;
}
```

### 25.4 详情页面设计原则
- 信息分组展示，层次清晰
- 重要信息优先展示
- 支持折叠/展开
- 操作记录完整展示
- 审核记录时间线展示
- 附件支持预览和下载
- 操作按钮根据状态动态显示
- **功能按钮底部居中悬浮**：详情页面的功能按钮（如返回、编辑、删除、审核等）在页面底部居中悬浮显示，按钮之间居中对齐，底部留有适当padding避免内容被遮挡

### 25.5 底部悬浮按钮规范

#### 25.5.1 样式规范

```css
/* 详情页/表单页容器 - 使用flex布局实现内部滚动 */
.detail-container,
.form-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #f5f7fa;
}

/* 内容区域 - 垂直滚动 */
.detail-content,
.form-content {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  padding-bottom: 80px; /* 为底部按钮栏留出空间 */
}

/* 底部按钮栏 - 固定悬浮 */
.detail-footer,
.form-footer {
  position: fixed;
  bottom: 0;
  left: var(--sidebar-width);
  right: 0;
  display: flex;
  justify-content: center;
  gap: 12px;
  padding: 16px;
  background-color: #f5f7fa;
  border-top: 1px solid #e4e7ed;
  z-index: 100;
  transition: left var(--transition-base);
}
```

#### 25.5.2 技术实现规范

##### 实现原理
- **固定定位**：使用 `position: fixed` 实现按钮栏在页面底部的固定显示
- **侧边栏适配**：通过 `left: var(--sidebar-width)` 确保按钮栏始终在侧边栏右侧，当侧边栏折叠时自动调整位置
- **z-index**：设置 `z-index: 100` 确保按钮栏在其他内容之上显示
- **过渡动画**：添加 `transition: left var(--transition-base)` 实现侧边栏折叠/展开时的平滑过渡
- **内容偏移**：在内容区域添加 `padding-bottom: 80px` 避免内容被按钮栏遮挡

##### 响应式适配
- **桌面端**：水平排列按钮，居中显示
- **平板端**：保持水平排列，适当调整按钮大小
- **移动端**：调整为垂直排列，按钮宽度100%

```css
/* 响应式适配 */
@media screen and (max-width: 768px) {
  .detail-footer,
  .form-footer {
    left: 0;
    flex-direction: column;
  }
  
  .detail-footer .el-button,
  .form-footer .el-button {
    width: 100%;
  }
  
  .detail-content,
  .form-content {
    padding-bottom: 120px; /* 为垂直排列的按钮栏留出更多空间 */
  }
}
```

##### 与侧边栏的交互
- 当侧边栏折叠/展开时，按钮栏会根据 `--sidebar-width` 变量自动调整位置
- 确保按钮栏始终保持在可视区域内，不被侧边栏遮挡

#### 25.5.3 最佳实践
1. **按钮数量控制**：底部按钮栏建议最多放置3-4个核心操作按钮，避免按钮过多影响用户体验
2. **按钮顺序**：按操作重要性排序，通常顺序为：返回 → 次要操作 → 主要操作
3. **按钮类型**：合理使用 Element Plus 按钮类型（primary、success、warning、danger）区分操作重要性
4. **图标使用**：为按钮添加图标，提高操作辨识度
5. **状态管理**：根据页面状态动态控制按钮的显示/隐藏和禁用状态
6. **性能优化**：避免在按钮栏中放置复杂的计算逻辑，确保页面滚动流畅

#### 25.5.4 示例代码
```vue
<template>
  <div class="detail-container">
    <!-- 内容区域 -->
    <div class="detail-content">
      <!-- 页面内容 -->
    </div>
    
    <!-- 底部按钮栏 -->
    <div class="detail-footer">
      <el-button @click="goBack">
        <el-icon><ArrowLeft /></el-icon>
        返回
      </el-button>
      <el-button type="primary" @click="handlePrimaryAction">
        <el-icon><Check /></el-icon>
        主要操作
      </el-button>
      <el-button type="success" @click="handleSecondaryAction">
        <el-icon><Edit /></el-icon>
        次要操作
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ArrowLeft, Check, Edit } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const goBack = () => {
  router.back()
}

const handlePrimaryAction = () => {
  // 处理主要操作
}

const handleSecondaryAction = () => {
  // 处理次要操作
}
</script>
```

#### 25.5.5 适用场景
- 详情页面：返回、编辑、删除、审核等操作
- 表单页面：提交、取消、重置等操作
- 流程审批页面：审核通过、驳回、转发等操作

#### 25.5.6 注意事项
- 确保按钮栏在不同屏幕尺寸下都能正常显示
- 避免按钮栏遮挡页面底部的重要信息
- 合理设置按钮的权限控制，根据用户角色显示不同的操作按钮
- 保持按钮栏样式与整体页面风格一致

### 25.6 详情页面跳转方式
- 列表页点击查看按钮跳转到详情页
- 待办任务点击跳转到对应审核任务详情页
- 消息中心点击跳转到对应消息详情页
- 预警信息点击跳转到对应预警详情页

## 26. 表单设计规范

### 26.1 表单配置
```typescript
interface FormConfig {
  fields: FormField[];
  rules: FormRule[];
  labelWidth: number;
  groups: FormGroup[];
  submitText: string;
  resetText: string;
}
```

### 26.2 表单字段类型
| 字段类型 | 编码 | 说明 |
|----------|------|------|
| 文本 | TEXT | 单行文本输入 |
| 多行文本 | TEXTAREA | 多行文本输入 |
| 数字 | NUMBER | 数字输入 |
| 下拉选择 | SELECT | 下拉单选 |
| 单选 | RADIO | 单选按钮组 |
| 多选 | CHECKBOX | 复选框组 |
| 日期 | DATE | 日期选择 |
| 日期时间 | DATETIME | 日期时间选择 |
| 日期范围 | DATERANGE | 日期范围选择 |
| 人员选择 | PERSON | 人员选择弹窗 |
| 部门选择 | DEPARTMENT | 部门选择弹窗 |
| 富文本 | RICHTEXT | 富文本编辑器 |
| 文件上传 | FILE | 文件上传 |
| 图片上传 | IMAGE | 图片上传 |

### 26.3 表单验证规则
```typescript
interface ValidationRule {
  type: 'required' | 'email' | 'phone' | 'idcard' | 'custom';
  message: string;
  validator?: Function;
}
```

### 26.4 表单设计原则
- 必填项标识清晰（红色星号）
- 字段分组合理
- 验证规则完善
- 提示文字友好
- 支持表单重置
- 支持表单保存草稿
- 支持表单联动

## 27. 操作按钮规范

### 27.1 操作按钮类型
| 类型 | 编码 | 说明 | 操作方式 |
|------|------|------|----------|
| 新增 | CREATE | 创建新记录 | 跳转到新增页面 |
| 编辑 | UPDATE | 修改记录 | 跳转到编辑页面 |
| 删除 | DELETE | 删除记录 | 弹窗二次确认 |
| 详情 | DETAIL | 查看详情 | 跳转到详情页面 |
| 审核通过 | APPROVE | 审核通过 | 弹窗审核表单 |
| 审核驳回 | REJECT | 审核驳回 | 弹窗驳回原因 |
| 导入 | IMPORT | 导入数据 | 弹窗导入表单 |
| 导出 | EXPORT | 导出数据 | 直接下载文件 |
| 打印 | PRINT | 打印数据 | 打开打印预览 |
| 发布 | PUBLISH | 发布内容 | 直接切换状态 |
| 取消发布 | UNPUBLISH | 取消发布 | 直接切换状态 |
| 批量审核 | BATCH_APPROVE | 批量审核 | 选中后可用 |
| 批量删除 | BATCH_DELETE | 批量删除 | 选中后可用 |
| 批量导出 | BATCH_EXPORT | 批量导出 | 选中后可用 |
| 提交 | SUBMIT | 提交表单 | 表单提交 |
| 取消 | CANCEL | 取消操作 | 返回上一页 |
| 重置 | RESET | 重置表单 | 清空表单 |
| 保存 | SAVE | 保存数据 | 保存并返回 |
| 保存草稿 | SAVE_DRAFT | 保存草稿 | 保存不返回 |

### 27.2 操作按钮配置
```typescript
interface ActionButton {
  type: ActionType;
  label: string;
  icon: string;
  visible: boolean | Function;
  disabled: boolean | Function;
  confirm?: string;
  handler: Function;
}
```

### 27.3 操作按钮规则
- 新增/编辑：跳转到新页面
- 删除：弹窗二次确认
- 审核：弹窗审核表单
- 导入：弹窗导入表单
- 导出：直接下载文件
- 打印：打开打印预览
- 发布：直接切换状态
- 批量操作：选中数据后可用

## 28. 页面布局规范

### 28.1 页面标题展示规范
- **4级导航栏展示**：页面名称不需要在内容页顶部展示，而是以4级导航栏标签的形式展示在内容区域顶部
- **页面标签导航**：使用页面标签组件显示当前打开的页面，支持点击切换、刷新、关闭等操作
- **无重复标题**：避免在内容区域和导航标签中同时显示页面标题，造成视觉重复

### 28.2 页面头部规范
- **功能菜单页面**：功能菜单页面不需要返回按钮，因为用户可以通过4级导航栏返回
- **详情页面**：详情页面可以保留返回按钮，方便用户快速返回列表
- **表单页面**：新增/编辑页面可以保留返回按钮

### 28.3 内容页面布局结构
功能菜单页面统一按照页面布局应包含以下区域：

1. **查询条件区域**：
   - 包含各种筛选条件输入框、下拉选择器、日期选择器等
   - 使用 Element Plus 的 el-form 组件，inline 模式
   - 包含搜索和重置按钮
   - 可选择使用卡片包裹，提供展开/收起功能
   - 整体靠左靠上显示，调整边距以优化视觉效果
   - 默认展示收起，只展示一行查询条件，需要展示搜索和重置按钮

2. **功能按钮区域**：
   - 包含新增、导出、导入等功能按钮
   - 位于查询条件区域下方
   - 使用 flex 布局，靠左居中展示
   - 按钮之间保持适当间距

3. **列表展示区域**：
   - 使用统一的表格组件（详见）


### 28.4 布局顺序规范
- **从上到下的布局顺序**：查询条件区域 → 功能按钮区域 → 列表展示区域（统一表格组件，见24章）

### 28.5 功能按钮栏位置规范
- **统一位置**：功能按钮栏（新增、导入、导出等按钮）统一放置在查询条件区域和列表区域之间

### 28.6 功能按钮栏样式规范
```css
.action-bar {
  display: flex;
  justify-content: flex-start;
  gap: 12px;
  margin-bottom: 20px;
  padding: 16px 20px;
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* 响应式适配 */
@media screen and (max-width: 768px) {
  .action-bar {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
}
```

### 28.8 响应式适配
- **功能按钮栏**：在小屏幕设备上，功能按钮栏需要调整布局方向，从水平排列改为垂直排列
- **按钮尺寸**：在移动端，按钮可以适当增大，方便触控操作
- **查询条件区域**：在小屏幕设备上，查询条件区域从水平排列改为垂直排列
- **数据统计区域**：在小屏幕设备上，保持文本换行显示
- **列表展示区域**：在小屏幕设备上，表格自动适应宽度，支持横向滚动

### 28.9 布局组件padding值规范
- **内容区域**：统一设置为 `padding: 16px`，确保整体布局紧凑且美观
- **卡片组件**：统一设置为 `padding: 16px`，与内容区域保持一致
- **表单区域**：统一设置为 `padding: 16px`，确保表单元素与容器边界有适当间距
- **表格组件**：统一设置为 `padding: 0`，表格内部的单元格padding由表格组件自身控制
- **详情页面**：内容区域设置为 `padding: 16px`，底部留出 `padding-bottom: 80px` 为底部按钮栏留出空间
- **响应式调整**：在小屏幕设备上，所有padding值保持不变，确保布局在不同屏幕尺寸下的一致性

## 29. 状态管理规范

### 29.1 状态定义结构
```typescript
interface StateDefinition {
  name: string;
  code: string;
  color: string;
  icon?: string;
  description: string;
}
```

### 29.2 状态流转配置
```typescript
interface StateTransition {
  from: string;
  to: string;
  action: string;
  condition?: Function;
  handler?: Function;
}
```

### 29.3 常用状态定义
| 状态类型 | 状态名称 | 编码 | 颜色 |
|----------|----------|------|------|
| **合同状态** | 未签订 | UNSIGNED | info |
| | 签订中 | SIGNING | warning |
| | 已签订 | SIGNED | success |
| | 已取消 | CANCELLED | danger |
| **审核状态** | 未审核 | PENDING | info |
| | 审核中 | IN_PROGRESS | warning |
| | 审核通过 | APPROVED | success |
| | 已驳回 | REJECTED | danger |
| **离职状态** | 未开始 | NOT_STARTED | info |
| | 离职中 | IN_PROGRESS | warning |
| | 已离职 | COMPLETED | success |
| **发布状态** | 已发布 | PUBLISHED | success |
| | 未发布 | UNPUBLISHED | info |

### 29.4 状态管理规则
- 所有状态统一定义
- 状态标签颜色区分
- 状态流转规则明确
- 状态变更记录完整
- 支持状态回退
- 支持状态锁定

## 30. 接口设计规范

### 30.1 URL命名规范
- **格式**：`/api/v{version}/{resource}/{id}/{sub-resource}`
- **示例**：
  - `GET /api/v1/workers` - 获取工人列表
  - `GET /api/v1/workers/{id}` - 获取工人详情
  - `POST /api/v1/workers` - 创建工人
  - `PUT /api/v1/workers/{id}` - 更新工人
  - `DELETE /api/v1/workers/{id}` - 删除工人
  - `GET /api/v1/workers/{id}/contracts` - 获取工人的合同列表

### 30.2 请求参数规范
```typescript
interface QueryParams {
  page: number;
  pageSize: number;
  sortField?: string;
  sortOrder?: 'asc' | 'desc';
  keyword?: string;
  filters?: Record<string, any>;
}
```

### 30.3 响应格式规范
```typescript
interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
  timestamp: number;
}

interface PageResponse<T> {
  code: number;
  message: string;
  data: {
    list: T[];
    total: number;
    page: number;
    pageSize: number;
  };
  timestamp: number;
}
```

### 30.4 响应码规范
| 响应码 | 编码 | 说明 |
|--------|------|------|
| 200 | SUCCESS | 成功 |
| 201 | CREATED | 创建成功 |
| 400 | BAD_REQUEST | 请求参数错误 |
| 401 | UNAUTHORIZED | 未授权 |
| 403 | FORBIDDEN | 无权限 |
| 404 | NOT_FOUND | 资源不存在 |
| 500 | INTERNAL_ERROR | 服务器错误 |

### 30.5 接口设计原则
- 遵循RESTful设计原则
- 使用HTTP方法表示操作类型
- URL使用小写字母和连字符
- 版本号放在URL中
- 统一响应格式
- 统一错误处理
- 支持分页、排序、筛选
- 支持批量操作
- 支持数据权限过滤
- 接口文档完善

## 31. 特殊业务场景规范

### 31.1 人员选择规范
```typescript
interface PersonSelectConfig {
  source: 'worker' | 'employee' | 'all';
  multiple: boolean;
  filters?: Record<string, any>;
  displayFields: string[];
  returnFields: string[];
}
```

**人员选择规则**：
- 正式员工：从正式员工表选择
- 工人：从工人信息表选择
- 所有人员：从所有人员表选择
- 支持搜索和筛选
- 支持多选
- 显示关键信息（姓名、手机号、部门等）

### 31.2 富文本编辑规范
```typescript
interface RichTextConfig {
  height: number;
  placeholder: string;
  toolbar: string[];
  maxLength: number;
  allowImage: boolean;
  allowVideo: boolean;
  allowFile: boolean;
}
```

**富文本编辑规则**：
- 统一使用Element Plus富文本编辑器
- 支持常用格式化功能
- 支持图片上传
- 支持表格插入
- 支持链接插入
- 内容长度限制
- 自动保存草稿

**富文本应用场景**：
- 活动详情
- 资讯内容
- 社团介绍
- 学习材料内容
- 题库内容
- 企业文化介绍内容
- 岗位文化介绍内容
- 打印模板内容

### 31.3 附件管理规范
```typescript
interface AttachmentConfig {
  name: string;
  type: 'image' | 'file' | 'video' | 'audio' | 'document';
  maxSize: number;
  required: boolean;
  multiple: boolean;
  template?: string;
  accept: string[];
}
```

**附件管理规则**：
- 附件与菜单页面关联
- 支持必传配置
- 支持模板下载
- 支持文件预览
- 支持批量上传
- 文件大小限制
- 文件类型限制

### 31.4 打印管理规范
```typescript
interface PrintTemplateConfig {
  name: string;
  code: string;
  content: string;
  variables: Variable[];
}

interface PrintConfig {
  templateCode: string;
  businessCode: string;
  dataMapping: Record<string, string>;
}
```

**打印管理规则**：
- 自定义打印模板
- 模板与业务关联
- 支持变量取值
- 支持打印预览
- 支持批量打印
- 支持打印设置

### 31.5 导入导出规范
**导入功能**：
- Excel文件导入
- 模板下载
- 数据验证
- 错误提示

**导出功能**：
- 导出Excel文件
- 支持筛选条件导出
- 支持字段选择

### 31.6 工人生命周期状态
- 注册
- 接送（工人）/劳务运维人员（添加到劳务公司的正式员工）/工厂正式人员（添加到工厂的正式员工）
- 初次面试
- 合同签订
- 面试邀约
- 工厂面试
- 进厂
- 离职

---

//## 32. 开发阶段特殊说明

//### 32.1 数据权限控制
- **当前阶段**：暂不开发数据权限相关的控制
- **原因**：目前处于开发demo阶段，重点关注核心功能的实现
- **实现要求**：
  - 移除所有数据权限相关的代码
  - 简化权限检查逻辑，确保所有用户都能访问完整数据
  - 保留数据权限相关的接口定义，以便后续扩展
  - 确保代码结构清晰，便于后续添加数据权限功能

本规范旨在统一项目开发标准，提高代码质量和开发效率。所有开发人员应严格遵守本规范，确保项目的可维护性和可扩展性。
