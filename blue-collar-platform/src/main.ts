import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './style.css'
import App from './App.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import router from './router/index.ts'
import permission from './directives/permission'

// 引入Mock.js模拟数据
console.log('开始加载Mock数据...')
import '../mock/index.js'
console.log('Mock数据加载成功')

const app = createApp(App)

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.directive('permission', permission)

const pinia = createPinia()

app.use(ElementPlus, {
  locale: zhCn
})
app.use(router)
app.use(pinia)
app.mount('#app')
