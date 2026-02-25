# 蓝领智汇平台PC端UI设计规范

## 文档信息
- **版本**: 1.0.0
- **创建日期**: 2026-02-25
- **适用范围**: 蓝领智汇平台PC端所有页面

---

## 目录
1. [设计原则](#1-设计原则)
2. [统一页面布局规范](#2-统一页面布局规范)
3. [列表页面模板规范](#3-列表页面模板规范)
4. [详情页面模板规范](#4-详情页面模板规范)
5. [表单页面模板规范](#5-表单页面模板规范)
6. [审批流程页面UI规范](#6-审批流程页面ui规范)
7. [通用组件UI规范](#7-通用组件ui规范)
8. [色彩系统](#8-色彩系统)
9. [字体系统](#9-字体系统)
10. [间距与布局](#10-间距与布局)
11. [响应式设计](#11-响应式设计)

---

## 1. 设计原则

### 1.1 核心设计理念
- **一致性**: 保持所有页面视觉风格和交互方式的一致性
- **清晰性**: 信息层级分明，操作路径清晰
- **高效性**: 减少用户操作步骤，提升工作效率
- **友好性**: 提供友好的视觉反馈和错误提示

### 1.2 设计价值观
- **专业可靠**: 体现企业级应用的专业性
- **简洁高效**: 避免过度装饰，聚焦核心功能
- **用户导向**: 以用户需求为中心进行设计

---

## 2. 统一页面布局规范

### 2.1 整体布局结构

```
┌─────────────────────────────────────────────────────────────┐
│                        顶部导航栏 (60px)                      │
│  [Logo] [一级菜单: 工作中心 | 招聘管理 | ...]     [用户信息]   │
├─────────┬───────────────────────────────────────────────────┤
│         │                   四级导航栏 (40px)                 │
│  二级   │   [首页] [待办任务] [消息中心] ×                    │
│  菜单   ├───────────────────────────────────────────────────┤
│  (200px)│                                                    │
│         │                   内容区域                          │
│  三级   │                                                    │
│  菜单   │                   (动态高度)                        │
│         │                                                    │
│         │                                                    │
└─────────┴───────────────────────────────────────────────────┘
```

### 2.2 布局尺寸规范

| 区域 | 尺寸 | 说明 |
|------|------|------|
| 顶部导航栏高度 | 60px | 固定高度，包含Logo和一级菜单 |
| 左侧菜单宽度 | 200px | 展开状态，可折叠至60px |
| 四级导航栏高度 | 40px | 页面标签栏 |
| 内容区域内边距 | 20px | 上下左右统一内边距 |
| 卡片间距 | 20px | 卡片之间的间距 |

### 2.3 一级菜单规范

#### 2.3.1 菜单结构（9个核心业务领域）
| 序号 | 菜单名称 | 图标 | 功能说明 |
|------|----------|------|----------|
| 1 | 工作中心 | Bell | 工作任务与信息中心 |
| 2 | 招聘管理 | Position | 招聘需求与简历管理 |
| 3 | 面试管理 | ChatDotRound | 面试全流程管理 |
| 4 | 工人管理 | User | 工人信息管理 |
| 5 | 合同管理 | Document | 合同签订与管理 |
| 6 | 在职管理 | Suitcase | 在职员工全生命周期管理 |
| 7 | 离职管理 | SwitchButton | 离职流程管理 |
| 8 | 结算管理 | Money | 结算与佣金管理 |
| 9 | 系统管理 | Setting | 系统配置与管理 |

#### 2.3.2 菜单样式规范
```css
/* 一级菜单项样式 */
.top-menu-item {
  height: 60px;
  padding: 0 24px;
  font-size: 15px;
  font-weight: 500;
  color: var(--color-text-regular);
  border-radius: 0;
  transition: all 0.3s ease;
}

/* 悬停状态 */
.top-menu-item:hover {
  background-color: var(--bg-color-hover);
  color: var(--color-primary);
  transform: translateY(-1px);
}

/* 激活状态 */
.top-menu-item.is-active {
  background-color: var(--bg-color-active);
  color: var(--color-primary);
  font-weight: 600;
  border-bottom: 2px solid var(--color-primary);
}
```

### 2.4 二级/三级菜单规范

#### 2.4.1 菜单层级结构
```
工作中心
├── 待办任务
├── 消息中心
└── 预警信息

招聘管理
├── 招聘需求
└── 简历管理

面试管理
├── 接送管理
├── 初步面试
├── 面试邀约
└── 工厂面试

工人管理
└── 工人信息

合同管理
└── 签订合同

在职管理
├── 工作与生活
│   ├── 生活费管理
│   ├── 工资管理
│   └── 理赔管理
├── 管理与关怀
│   ├── 沟通管理
│   ├── 文娱活动
│   ├── 报名管理
│   ├── 发布资讯
│   └── 社团管理
├── 特殊情况
├── 保险管理
│   ├── 保险管理
│   ├── 理赔管理
│   └── 参保登记
├── 考勤管理
├── 请假管理
├── 调岗管理
├── 奖惩管理
├── 业务课堂
│   ├── 学习材料
│   ├── 题库管理
│   ├── 学习时长管理
│   ├── 考试管理
│   └── 考试成绩
├── 异常管理
└── 投诉/建议

离职管理
└── 离职管理

结算管理
├── 工作转介绍
│   ├── 工作转介绍
│   └── 佣金发放
└── 结算管理

系统管理
├── 企业介绍
│   ├── 企业文化介绍
│   └── 岗位文化介绍
├── 部门管理
├── 正式员工
├── 岗位管理
├── 规则配置
├── 菜单配置
├── 字典管理
├── 系统参数
├── 流程管理
├── 流程配置
├── 附件管理
└── 打印管理
    ├── 模版配置
    └── 打印配置
```

#### 2.4.2 侧边栏菜单样式规范
```css
/* 二级菜单项样式 */
.sidebar-menu-item {
  height: 48px;
  padding: 0 20px;
  margin: 4px 12px;
  font-size: 14px;
  font-weight: 500;
  color: var(--color-text-regular);
  border-radius: 6px;
  transition: all 0.2s ease;
}

/* 三级菜单项样式 */
.sub-menu-item {
  height: 44px;
  padding-left: 52px;
  font-size: 13px;
}

/* 悬停状态 */
.sidebar-menu-item:hover {
  background-color: var(--bg-color-hover);
  color: var(--color-primary);
  transform: translateX(4px);
}

/* 激活状态 */
.sidebar-menu-item.is-active {
  background: linear-gradient(135deg, var(--bg-color-active) 0%, var(--color-primary-extra-light) 100%);
  color: var(--color-primary);
  font-weight: 600;
  box-shadow: 0 2px 4px rgba(44, 123, 229, 0.1);
}
```

### 2.5 四级导航栏（页面标签栏）规范

#### 2.5.1 标签栏样式
```css
/* 标签栏容器 */
.page-tabs {
  height: 40px;
  background: linear-gradient(180deg, #ffffff 0%, var(--color-bg-page) 100%);
  border-bottom: 1px solid var(--color-border-light);
  padding: 0 16px;
}

/* 单个标签 */
.page-tab {
  display: inline-flex;
  align-items: center;
  padding: 0 16px;
  height: 32px;
  background-color: var(--color-bg-page);
  border: 1px solid var(--color-border-light);
  border-radius: 6px 6px 0 0;
  font-size: 13px;
  font-weight: 500;
  color: var(--color-text-regular);
  cursor: pointer;
  transition: all 0.2s ease;
}

/* 激活标签 */
.page-tab.active {
  background: #ffffff;
  border-color: var(--color-primary);
  border-bottom-color: #ffffff;
  color: var(--color-primary);
  font-weight: 600;
}
```

#### 2.5.2 右键菜单功能
- 刷新当前页
- 关闭当前页
- 关闭其他页面
- 关闭全部页面

### 2.6 内容区域规范

#### 2.6.1 内容区域布局
```css
/* 内容区域 */
.layout-content {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  background-color: var(--color-bg-page);
}

/* 内容卡片 */
.content-card {
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
  padding: 20px;
  margin-bottom: 20px;
}
```

#### 2.6.2 页面标题规范
```css
/* 页面标题 */
.page-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--color-text-primary);
  margin-bottom: 20px;
  padding-left: 12px;
  border-left: 4px solid var(--color-primary);
}

/* 区块标题 */
.section-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--color-text-primary);
  margin-bottom: 16px;
  padding-left: 12px;
  border-left: 3px solid var(--color-primary);
}
```

---

## 3. 列表页面模板规范

### 3.1 列表页面结构

```
┌─────────────────────────────────────────────────────────────┐
│  页面标题                                                    │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────────┐   │
│  │ 搜索栏区域                                           │   │
│  │ [搜索框] [筛选下拉] [日期选择] [搜索] [重置]         │   │
│  └─────────────────────────────────────────────────────┘   │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────────┐   │
│  │ 工具栏区域                                           │   │
│  │ [新增] [导入] [导出] [打印] [批量操作▼]              │   │
│  └─────────────────────────────────────────────────────┘   │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────────┐   │
│  │ 数据表格区域                                         │   │
│  │ ┌───┬──────────┬──────────┬──────────┬──────────┐   │   │
│  │ │ □ │ 字段1    │ 字段2    │ 字段3    │ 操作     │   │   │
│  │ ├───┼──────────┼──────────┼──────────┼──────────┤   │   │
│  │ │ □ │ 数据     │ 数据     │ 数据     │ [查看]   │   │   │
│  │ │ □ │ 数据     │ 数据     │ 数据     │ [编辑]   │   │   │
│  │ │ □ │ 数据     │ 数据     │ 数据     │ [删除]   │   │   │
│  │ └───┴──────────┴──────────┴──────────┴──────────