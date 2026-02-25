<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'

const router = useRouter()
const phone = ref('')
const verifyCode = ref('')
const newPassword = ref('')
const confirmPassword = ref('')
const loading = ref(false)

// 发送验证码
const sendVerifyCode = () => {
  if (!phone.value) {
    ElMessage.warning('请输入手机号')
    return
  }
  
  // 模拟发送验证码
  ElMessage.success('验证码已发送，请注意查收')
}

// 重置密码
const handleResetPassword = async () => {
  if (!phone.value) {
    ElMessage.warning('请输入手机号')
    return
  }
  if (!verifyCode.value) {
    ElMessage.warning('请输入验证码')
    return
  }
  if (!newPassword.value) {
    ElMessage.warning('请输入新密码')
    return
  }
  if (newPassword.value !== confirmPassword.value) {
    ElMessage.warning('两次输入的密码不一致')
    return
  }
  
  loading.value = true
  try {
    // 模拟重置密码请求
    ElMessage.success('密码重置成功，请登录')
    // 跳转到登录页面
    router.push('/login')
  } catch (error) {
    ElMessage.error('密码重置失败，请稍后重试')
  } finally {
    loading.value = false
  }
}

// 跳转到登录页面
const goToLogin = () => {
  router.push('/login')
}
</script>

<template>
  <div class="forgot-password-container">
    <div class="forgot-password-box">
      <div class="forgot-password-header">
        <img src="/assets/logo.jpg" alt="蓝领智汇" class="forgot-password-logo" />
      </div>
      
      <el-form :model="{ phone, verifyCode, newPassword, confirmPassword }" class="forgot-password-form" label-position="top">
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
            v-model="newPassword"
            type="password"
            placeholder="请输入新密码"
            prefix-icon="el-icon-lock"
            show-password
            class="form-input"
          />
        </el-form-item>
        
        <el-form-item>
          <el-input
            v-model="confirmPassword"
            type="password"
            placeholder="请再次输入新密码"
            prefix-icon="el-icon-lock"
            show-password
            class="form-input"
          />
        </el-form-item>
        
        <el-form-item>
          <el-button
            type="primary"
            class="forgot-password-button"
            :loading="loading"
            @click="handleResetPassword"
          >
            重置密码
          </el-button>
        </el-form-item>
        
        <div class="forgot-password-links">
          <a href="#" @click.prevent="goToLogin">返回登录</a>
        </div>
      </el-form>
    </div>
  </div>
</template>

<style scoped>
.forgot-password-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
  position: relative;
  overflow: hidden;
}

.forgot-password-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E');
  opacity: 0.5;
}



.forgot-password-box {
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

.forgot-password-box:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 50px rgba(0, 0, 0, 0.2);
}

.forgot-password-header {
  text-align: center;
  margin-bottom: 35px;
  background-color: #FFFFFF;
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #f0f0f0;
}

.forgot-password-logo {
  margin: 0 auto;
  display: block;
  background-color: transparent;
  border: none;
  height: 90px;
  width: auto;
  max-width: 100%;
  transition: all 0.3s ease;
}

.forgot-password-logo:hover {
  transform: scale(1.05);
}

.forgot-password-form {
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

.forgot-password-button {
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

.forgot-password-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
}

.forgot-password-button:active {
  transform: translateY(0);
}

.forgot-password-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.6s;
}

.forgot-password-button:hover::before {
  left: 100%;
}

.forgot-password-links {
  text-align: center;
  margin-top: 20px;
}

.forgot-password-links a {
  color: #667eea;
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s ease;
  position: relative;
}

.forgot-password-links a:hover {
  color: #764ba2;
  transform: translateY(-1px);
}

.forgot-password-links a::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 0;
  height: 2px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  transition: width 0.3s ease;
}

.forgot-password-links a:hover::after {
  width: 100%;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .forgot-password-box {
    padding: 30px 25px;
    margin: 0 15px;
  }
  
  .form-input {
    height: 46px;
  }
  
  .verify-code-button {
    height: 46px;
  }
  
  .forgot-password-button {
    height: 46px;
  }
}
</style>