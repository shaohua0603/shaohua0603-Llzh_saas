<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()
const loading = ref(false)

// 介绍人信息
const referrerId = ref('')
const referrerName = ref('')

// 从URL获取介绍人信息
onMounted(() => {
  referrerId.value = (route.query.referrer_id as string) || ''
  referrerName.value = (route.query.referrer_name as string) || '张三'
})

// 绑定介绍人
const bindReferrer = async () => {
  if (!referrerId.value) {
    ElMessage.warning('介绍人信息无效')
    return
  }
  
  loading.value = true
  try {
    // 模拟绑定请求
    ElMessage.success('绑定成功！')
    
    // 绑定成功后跳转到首页
    setTimeout(() => {
      router.push('/worker/home')
    }, 1500)
  } catch (error) {
    ElMessage.error('绑定失败，请稍后重试')
  } finally {
    loading.value = false
  }
}

// 取消绑定
const cancelBind = () => {
  router.push('/worker/home')
}
</script>

<template>
  <div class="bind-referrer-container">
    <div class="bind-referrer-box">
      <div class="bind-referrer-header">
        <img src="@/assets/logo.png" alt="蓝领智汇" class="bind-referrer-logo" />
      </div>
      
      <div class="bind-referrer-content">
        <h2 class="bind-title">绑定介绍人</h2>
        <p class="bind-subtitle">您正在绑定以下介绍人</p>
        
        <div class="referrer-info">
          <div class="info-item">
            <span class="info-label">介绍人ID：</span>
            <span class="info-value">{{ referrerId }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">介绍人姓名：</span>
            <span class="info-value">{{ referrerName }}</span>
          </div>
        </div>
        
        <div class="bind-buttons">
          <el-button type="primary" class="bind-button" :loading="loading" @click="bindReferrer">
            确认绑定
          </el-button>
          <el-button class="cancel-button" @click="cancelBind">
            取消
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.bind-referrer-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
  position: relative;
  overflow: hidden;
}

.bind-referrer-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E');
  opacity: 0.5;
}

.bind-referrer-box {
  width: 100%;
  max-width: 400px;
  background: #F3F1F1;
  border-radius: 16px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  padding: 40px;
  position: relative;
  z-index: 1;
  transition: all 0.3s ease;
}

.bind-referrer-box:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 50px rgba(0, 0, 0, 0.2);
}

.bind-referrer-header {
  text-align: center;
  margin-bottom: 35px;
  background-color: #F3F1F1;
  padding: 10px;
  border-radius: 8px;
}

.bind-referrer-logo {
  margin: 0 auto;
  display: block;
  background-color: transparent;
  border: none;
}

.bind-referrer-content {
  text-align: center;
}

.bind-title {
  font-size: 24px;
  font-weight: bold;
  color: #333;
  margin-bottom: 10px;
}

.bind-subtitle {
  font-size: 16px;
  color: #666;
  margin-bottom: 30px;
}

.referrer-info {
  background-color: #fff;
  border-radius: 10px;
  padding: 20px;
  margin-bottom: 30px;
  text-align: left;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.info-item {
  margin-bottom: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.info-item:last-child {
  margin-bottom: 0;
}

.info-label {
  font-size: 14px;
  color: #666;
}

.info-value {
  font-size: 14px;
  color: #333;
  font-weight: 500;
}

.bind-buttons {
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-width: 300px;
  margin: 0 auto;
}

.bind-button {
  width: 100%;
  height: 50px;
  font-size: 16px;
  border-radius: 8px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border: none;
}

.cancel-button {
  width: 100%;
  height: 50px;
  font-size: 16px;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .bind-referrer-box {
    padding: 30px 25px;
    margin: 0 15px;
  }
  
  .bind-button,
  .cancel-button {
    height: 46px;
  }
}
</style>