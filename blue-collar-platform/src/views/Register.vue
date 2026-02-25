<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()
const phone = ref('')
const password = ref('')
const confirmPassword = ref('')
const verifyCode = ref('')
const loading = ref(false)
const agree = ref(false)

// 介绍人信息
const referrerId = ref('')
const qrcodeType = ref('')

// 注册成功后显示下载app入口
const showDownloadApp = ref(false)

// 从URL获取介绍人信息
onMounted(() => {
  referrerId.value = (route.query.referrer_id as string) || ''
  qrcodeType.value = (route.query.type as string) || 'new_user'
})

// 发送验证码
const sendVerifyCode = () => {
  if (!phone.value) {
    ElMessage.warning('请输入手机号')
    return
  }
  
  // 模拟发送验证码
  ElMessage.success('验证码已发送，请注意查收')
}

// 注册方法
const handleRegister = async () => {
  if (!phone.value) {
    ElMessage.warning('请输入手机号')
    return
  }
  if (!verifyCode.value) {
    ElMessage.warning('请输入验证码')
    return
  }
  if (!password.value) {
    ElMessage.warning('请输入密码')
    return
  }
  if (password.value !== confirmPassword.value) {
    ElMessage.warning('两次输入的密码不一致')
    return
  }
  if (!agree.value) {
    ElMessage.warning('请阅读并同意用户协议和隐私政策')
    return
  }
  
  loading.value = true
  try {
    // 模拟注册请求
    ElMessage.success('注册成功！')
    
    // 注册成功后显示下载app入口
    showDownloadApp.value = true
  } catch (error) {
    ElMessage.error('注册失败，请稍后重试')
  } finally {
    loading.value = false
  }
}

// 跳转到登录页面
const goToLogin = () => {
  router.push('/login')
}

// 下载app
const downloadApp = () => {
  ElMessage.success('开始下载App...')
  // 这里可以添加实际的下载逻辑
}
</script>

<template>
  <div class="register-container">
    <div class="register-box" v-if="!showDownloadApp">
      <div class="register-header">
        <img src="/assets/logo.jpg" alt="蓝领智汇" class="register-logo" />
      </div>
      
      <el-form :model="{ phone, password, confirmPassword, verifyCode }" class="register-form" label-position="top">
        <el-form-item>
          <el-input
            v-model="phone"
            placeholder="请输入手机号"
            prefix-icon="el-icon-phone"
            maxlength="11"
            show-word-limit
            class="form-input"
          />
        </el-form-item>
        
        <el-form-item>
          <el-row :gutter="12">
            <el-col :span="16">
              <el-input
                v-model="verifyCode"
                placeholder="请输入验证码"
                prefix-icon="el-icon-message"
                class="form-input"
              />
            </el-col>
            <el-col :span="8">
              <el-button type="primary" class="verify-code-button" @click="sendVerifyCode">发送验证码</el-button>
            </el-col>
          </el-row>
        </el-form-item>
        
        <el-form-item>
          <el-input
            v-model="password"
            type="password"
            placeholder="请输入密码"
            prefix-icon="el-icon-lock"
            show-password
            class="form-input"
          />
        </el-form-item>
        
        <el-form-item>
          <el-input
            v-model="confirmPassword"
            type="password"
            placeholder="请再次输入密码"
            prefix-icon="el-icon-lock"
            show-password
            class="form-input"
          />
        </el-form-item>
        
        <el-form-item>
          <el-checkbox v-model="agree" class="agreement-checkbox">
            我已阅读并同意
            <a href="#" @click.prevent="router.push('/user-agreement')" class="agreement-link">《用户协议》</a>
            和
            <a href="#" @click.prevent="router.push('/privacy-policy')" class="agreement-link">《隐私政策》</a>
          </el-checkbox>
        </el-form-item>
        
        <el-form-item>
          <el-button
            type="primary"
            class="register-button"
            :loading="loading"
            @click="handleRegister"
          >
            注册
          </el-button>
        </el-form-item>
        
        <div class="register-links">
          <span>已有账号？</span>
          <a href="#" @click.prevent="goToLogin">立即登录</a>
        </div>
      </el-form>
    </div>
    
    <!-- 注册成功后显示下载app入口 -->
    <div class="register-box" v-else>
      <div class="register-header">
        <img src="/assets/logo.jpg" alt="蓝领智汇" class="register-logo" />
      </div>
      
      <div class="download-app-section">
        <h2 class="download-title">注册成功！</h2>
        <p class="download-subtitle">请下载蓝领智汇App继续使用</p>
        
        <div class="app-qrcode">
          <div class="qrcode-placeholder">
            <!-- 这里可以放App下载二维码 -->
            <div class="qrcode-grid">
              <div class="qrcode-corner qrcode-corner-top-left"></div>
              <div class="qrcode-corner qrcode-corner-top-right"></div>
              <div class="qrcode-corner qrcode-corner-bottom-left"></div>
              <div class="qrcode-corner qrcode-corner-bottom-right"></div>
            </div>
          </div>
          <p class="qrcode-hint">扫码下载App</p>
        </div>
        
        <div class="download-buttons">
          <el-button type="primary" class="download-button" @click="downloadApp">
            <el-icon class="el-icon-download"></el-icon>
            立即下载
          </el-button>
          <el-button class="login-button" @click="goToLogin">
            直接登录
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.register-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
  position: relative;
  overflow: hidden;
}

.register-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E');
  opacity: 0.5;
}



.register-box {
  width: 100%;
  max-width: 400px;
  background: #FFFFFF;
  border-radius: 16px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  padding: 40px;
  position: relative;
  z-index: 1;
  transition: all 0.3s ease;
}

.register-box:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 50px rgba(0, 0, 0, 0.2);
}

.register-header {
  text-align: center;
  margin-bottom: 35px;
  background-color: #FFFFFF;
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #f0f0f0;
}

.register-logo {
  margin: 0 auto;
  display: block;
  background-color: transparent;
  border: none;
  height: 90px;
  width: auto;
  max-width: 100%;
  transition: all 0.3s ease;
}

.register-logo:hover {
  transform: scale(1.05);
}

.register-form {
  margin-bottom: 25px;
}

.form-input {
  height: 50px;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
  transition: all 0.3s ease;
}

.form-input:focus {
  border-color: #667eea;
  box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.2);
}

.verify-code-button {
  height: 50px;
  width: 100%;
  border-radius: 8px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border: none;
  transition: all 0.3s ease;
}

.verify-code-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
}

.register-button {
  width: 100%;
  height: 50px;
  font-size: 16px;
  font-weight: 500;
  border-radius: 8px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border: none;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.register-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
}

.register-button:active {
  transform: translateY(0);
}

.register-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.6s;
}

.register-button:hover::before {
  left: 100%;
}

.agreement-checkbox {
  font-size: 13px;
  color: #666;
  margin-bottom: 20px;
}

.agreement-checkbox a {
  color: #667eea;
  text-decoration: none;
}

.agreement-checkbox a:hover {
  text-decoration: underline;
}

.register-links {
  text-align: center;
  margin-top: 20px;
  font-size: 14px;
  color: #666;
}

.register-links a {
  color: #667eea;
  text-decoration: none;
  margin-left: 5px;
  font-weight: 500;
  transition: all 0.3s ease;
  position: relative;
}

.register-links a:hover {
  color: #764ba2;
  transform: translateY(-1px);
}

.register-links a::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 0;
  height: 2px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  transition: width 0.3s ease;
}

.register-links a:hover::after {
  width: 100%;
}

/* 下载app部分样式 */
.download-app-section {
  text-align: center;
  padding: 20px 0;
}

.download-title {
  font-size: 24px;
  font-weight: bold;
  color: #333;
  margin-bottom: 10px;
}

.download-subtitle {
  font-size: 16px;
  color: #666;
  margin-bottom: 30px;
}

.app-qrcode {
  margin-bottom: 30px;
}

.qrcode-placeholder {
  width: 200px;
  height: 200px;
  margin: 0 auto;
  background-color: #f5f5f5;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.qrcode-grid {
  width: 180px;
  height: 180px;
  background-color: #fff;
  border-radius: 8px;
  position: relative;
  overflow: hidden;
}

.qrcode-corner {
  position: absolute;
  width: 30px;
  height: 30px;
  border: 2px solid #007bff;
  border-radius: 4px;
  box-shadow: inset 0 0 0 6px #007bff;
  background-color: #fff;
}

.qrcode-corner-top-left {
  top: 10px;
  left: 10px;
}

.qrcode-corner-top-right {
  top: 10px;
  right: 10px;
}

.qrcode-corner-bottom-left {
  bottom: 10px;
  left: 10px;
}

.qrcode-corner-bottom-right {
  bottom: 10px;
  right: 10px;
}

.qrcode-hint {
  font-size: 14px;
  color: #666;
  margin-top: 10px;
}

.download-buttons {
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-width: 300px;
  margin: 0 auto;
}

.download-button {
  width: 100%;
  height: 50px;
  font-size: 16px;
  border-radius: 8px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border: none;
}

.login-button {
  width: 100%;
  height: 50px;
  font-size: 16px;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .register-box {
    padding: 30px 25px;
    margin: 0 15px;
  }
  
  .form-input {
    height: 46px;
  }
  
  .verify-code-button {
    height: 46px;
  }
  
  .register-button {
    height: 46px;
  }
  
  .qrcode-placeholder {
    width: 180px;
    height: 180px;
  }
  
  .qrcode-grid {
    width: 160px;
    height: 160px;
  }
  
  .download-button,
  .login-button {
    height: 46px;
  }
}
</style>