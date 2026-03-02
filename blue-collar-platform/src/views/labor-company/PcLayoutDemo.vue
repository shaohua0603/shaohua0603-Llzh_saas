<template>
  <PcLayout :user-info="userInfo">
    <!-- 页面内容 -->
    <div class="demo-page">
      <el-card>
        <template #header>
          <div class="card-header">
            <span>PC端布局组件演示</span>
          </div>
        </template>

        <div class="demo-content">
          <h3>功能特性</h3>
          <ul>
            <li>顶部导航栏：包含Logo、一级菜单（9个核心业务领域）、用户信息和消息通知</li>
            <li>左侧侧边栏：显示二级/三级菜单，支持折叠/展开功能</li>
            <li>四级导航栏：显示当前打开的页面标签，支持右键菜单和拖拽排序</li>
            <li>响应式布局：适配不同屏幕尺寸</li>
          </ul>

          <h3>使用说明</h3>
          <p>1. 在布局组件中传入用户信息</p>
          <p>2. 点击顶部导航栏的一级菜单切换业务领域</p>
          <p>3. 点击左侧侧边栏的二级/三级菜单导航到对应页面</p>
          <p>4. 使用四级导航栏的标签切换页面</p>
          <p>5. 右键点击标签可以执行刷新、关闭等操作</p>
          <p>6. 拖拽标签可以重新排序</p>
          <p>7. 点击侧边栏的折叠按钮可以收起/展开侧边栏</p>

          <h3>组件结构</h3>
          <pre><code>PcLayout
├── TopNavigation (顶部导航栏)
│   ├── Logo
│   ├── 一级菜单 (9个核心业务领域)
│   └── 用户信息 + 消息通知
├── Sidebar (左侧侧边栏)
│   ├── 二级菜单
│   └── 三级菜单
└── Content (内容区域)
    ├── PageTabs (四级导航栏)
    └── RouterView (页面内容)</code></pre>
        </div>
      </el-card>
    </div>
  </PcLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import PcLayout from '../components/PcLayout.vue'
import type { UserInfo } from '../types/menu'

// 用户信息
const userInfo = ref<UserInfo>({
  id: '1',
  username: 'admin',
  realName: '管理员',
  avatar: '',
  role: 'labor_company',
  department: '劳务公司'
})

// 初始化
onMounted(() => {
  // 从本地存储获取用户信息
  const storedUserInfo = localStorage.getItem('userInfo')
  if (storedUserInfo) {
    userInfo.value = JSON.parse(storedUserInfo)
  }
})
</script>

<style scoped>
.demo-page {
  padding: var(--spacing-xl, 20px);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: var(--font-weight-bold, 600);
  font-size: var(--font-size-large, 18px);
}

.demo-content {
  padding: var(--spacing-lg, 16px);
}

.demo-content h3 {
  font-size: var(--font-size-medium, 16px);
  font-weight: var(--font-weight-bold, 600);
  margin: var(--spacing-xl, 20px) 0 var(--spacing-md, 12px);
  color: var(--color-text-primary, #303133);
}

.demo-content h3:first-child {
  margin-top: 0;
}

.demo-content p {
  font-size: var(--font-size-base, 14px);
  line-height: var(--line-height-base, 1.5);
  color: var(--color-text-regular, #606266);
  margin: var(--spacing-sm, 8px) 0;
}

.demo-content ul {
  list-style: none;
  padding: 0;
  margin: var(--spacing-md, 12px) 0;
}

.demo-content li {
  font-size: var(--font-size-base, 14px);
  line-height: var(--line-height-base, 1.5);
  color: var(--color-text-regular, #606266);
  padding: var(--spacing-xs, 4px) 0 var(--spacing-xs, 4px) var(--spacing-lg, 16px);
  position: relative;
}

.demo-content li::before {
  content: '•';
  position: absolute;
  left: 0;
  color: var(--color-primary, #409eff);
  font-weight: var(--font-weight-bold, 600);
}

.demo-content pre {
  background-color: var(--bg-color-page, #f5f7fa);
  border: 1px solid var(--color-border-light, #e4e7ed);
  border-radius: var(--radius-md, 6px);
  padding: var(--spacing-lg, 16px);
  margin: var(--spacing-md, 12px) 0;
  overflow-x: auto;
}

.demo-content code {
  font-family: var(--font-family-code, 'Consolas', 'Monaco', 'Courier New', monospace);
  font-size: var(--font-size-small, 13px);
  line-height: var(--line-height-small, 1.4);
  color: var(--color-text-primary, #303133);
}
</style>
