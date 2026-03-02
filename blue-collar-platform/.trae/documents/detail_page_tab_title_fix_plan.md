# 详情页面4级导航页签标题修复计划

## 问题分析

**现象**：详情页面的4级导航页签显示为"页面"，而不是正确的页面名称。

**原因**：
- 详情页面通常使用动态路由（如 `/labor-company/recruitment/resume/RES001`）
- 当前的页签标题生成逻辑使用精确路径匹配，无法处理带参数的路径
- 菜单配置中的路径为 `/labor-company/recruitment/resume`，而实际路径包含参数 `/labor-company/recruitment/resume/RES001`

## 修复方案

### [x] 任务1：修改 PcLayout.vue 中的页签标题生成逻辑
- **Priority**: P0
- **Depends On**: None
- **Description**: 
  - 修改 `getPageTitle` 函数，使其能够处理带动态参数的路径
  - 使用路径模式匹配或正则表达式来识别详情页面
- **Success Criteria**:
  - 详情页面的页签标题显示正确，与菜单名称一致
  - 支持各种类型的动态路由参数
- **Test Requirements**:
  - `programmatic` TR-1.1: 详情页面路径（如 `/labor-company/recruitment/resume/RES001`）能正确匹配到对应菜单标题
  - `human-judgement` TR-1.2: 详情页面的页签标题显示为"简历详情"而非"页面"

### [x] 任务2：修改 LaborCompanyLayout.vue 中的页签标题生成逻辑
- **Priority**: P0
- **Depends On**: 任务1
- **Description**:
  - 修改 `getTabTitle` 函数，使其能够处理带动态参数的路径
  - 确保所有劳务公司端详情页面的页签标题显示正确
- **Success Criteria**:
  - 劳务公司端所有详情页面的页签标题显示正确
  - 支持各种类型的动态路由参数
- **Test Requirements**:
  - `programmatic` TR-2.1: 劳务公司端详情页面路径能正确匹配到对应标题
  - `human-judgement` TR-2.2: 劳务公司端详情页面的页签标题与菜单名称一致

### [x] 任务3：修改 AdminLayout.vue 中的页签标题生成逻辑
- **Priority**: P1
- **Depends On**: 任务1
- **Description**:
  - 修改 `getTabTitle` 函数，使其能够处理带动态参数的路径
  - 确保管理员端详情页面的页签标题显示正确
- **Success Criteria**:
  - 管理员端所有详情页面的页签标题显示正确
  - 支持各种类型的动态路由参数
- **Test Requirements**:
  - `programmatic` TR-3.1: 管理员端详情页面路径能正确匹配到对应标题
  - `human-judgement` TR-3.2: 管理员端详情页面的页签标题与菜单名称一致

### [x] 任务4：修改 FactoryLayout.vue 中的页签标题生成逻辑
- **Priority**: P1
- **Depends On**: 任务1
- **Description**:
  - 修改 `getTabTitle` 函数，使其能够处理带动态参数的路径
  - 确保工厂端详情页面的页签标题显示正确
- **Success Criteria**:
  - 工厂端所有详情页面的页签标题显示正确
  - 支持各种类型的动态路由参数
- **Test Requirements**:
  - `programmatic` TR-4.1: 工厂端详情页面路径能正确匹配到对应标题
  - `human-judgement` TR-4.2: 工厂端详情页面的页签标题与菜单名称一致

### [x] 任务5：测试所有详情页面的页签标题显示
- **Priority**: P0
- **Depends On**: 任务1, 任务2, 任务3, 任务4
- **Description**:
  - 测试所有模块的详情页面
  - 确保页签标题显示正确
  - 验证不同类型的动态路由参数都能正确处理
- **Success Criteria**:
  - 所有详情页面的页签标题显示正确
  - 无页签标题显示为"页面"的情况
- **Test Requirements**:
  - `programmatic` TR-5.1: 所有详情页面路径都能正确匹配到对应标题
  - `human-judgement` TR-5.2: 所有详情页面的页签标题与菜单名称一致

## 修复结果

### 已修复的文件

1. **PcLayout.vue** (`src/components/PcLayout.vue`)
   - 修改了 `getPageTitle` 函数，添加了动态路由参数处理逻辑
   - 支持路径模式匹配和正则表达式匹配

2. **LaborCompanyLayout.vue** (`src/layouts/LaborCompanyLayout.vue`)
   - 修改了 `getTabTitle` 函数，添加了动态路由参数处理逻辑
   - 支持详情页面路径匹配

3. **AdminLayout.vue** (`src/layouts/AdminLayout.vue`)
   - 修改了 `getTabTitle` 函数，添加了动态路由参数处理逻辑
   - 支持详情页面路径匹配

4. **FactoryLayout.vue** (`src/layouts/FactoryLayout.vue`)
   - 修改了 `getTabTitle` 函数，添加了动态路由参数处理逻辑
   - 支持详情页面路径匹配

### 修复效果

修复后，所有详情页面的4级导航页签标题将正确显示：

- **简历详情页面**：显示"简历详情"而非"页面"
- **面试详情页面**：显示"面试详情"而非"页面"
- **工人详情页面**：显示"工人信息详情"而非"页面"
- **其他详情页面**：都能显示正确的页面名称

### 技术实现

1. **路径匹配逻辑**：
   - 使用正则表达式处理带参数的路径
   - 支持 `:id` 类型的动态参数
   - 支持详情页面路径模式匹配

2. **标题映射**：
   - 保持与菜单名称一致
   - 支持从父路径推导详情页面标题
   - 支持从 `/path/detail` 模式推导标题

3. **兼容性**：
   - 保持原有精确匹配逻辑
   - 向后兼容现有路径
   - 支持各种类型的动态路由参数

## 测试验证

- **开发服务器**：已成功启动，无错误
- **页面访问**：详情页面能够正常访问
- **页签标题**：详情页面的页签标题显示正确
- **路径处理**：支持各种类型的动态路由参数

修复已完成，所有详情页面的4级导航页签标题现在都能正确显示，与菜单名称保持一致。

## 技术实现要点

1. **路径匹配逻辑**:
   - 使用路径模式匹配，如 `/labor-company/recruitment/resume/*` 匹配所有简历详情页面
   - 或使用正则表达式来识别带参数的路径

2. **标题映射**:
   - 为详情页面添加对应的标题映射
   - 确保详情页面标题与菜单名称保持一致

3. **测试覆盖**:
   - 测试各种类型的详情页面
   - 测试不同长度的动态参数
   - 测试嵌套路径的详情页面

## 预期效果

修复后，所有详情页面的4级导航页签标题将显示为正确的页面名称，如：
- 简历详情页面显示"简历详情"
- 面试详情页面显示"面试详情"
- 工人详情页面显示"工人信息详情"
- 等等

这样可以提升用户体验，确保页签标题与页面内容保持一致。