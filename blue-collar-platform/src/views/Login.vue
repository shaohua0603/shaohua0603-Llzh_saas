<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'

const router = useRouter()
const phone = ref('')
const password = ref('')
const loading = ref(false)

// 登录方法
const handleLogin = () => {
  console.log('开始登录，手机号:', phone.value, '密码:', password.value)
  
  if (!phone.value) {
    console.log('手机号为空')
    ElMessage.warning('请输入手机号')
    return
  }
  if (!password.value) {
    console.log('密码为空')
    ElMessage.warning('请输入密码')
    return
  }
  
  loading.value = true
  
  // 硬编码的登录验证逻辑
  const testAccounts = [
    { phone: '13800138001', password: '123456', role: 'worker', name: '张三' },
    { phone: '13800138002', password: '123456', role: 'tenant', name: '李四' },
    { phone: '13800138004', password: '123456', role: 'platform_admin', name: '赵六' }
  ]
  
  console.log('测试账号列表:', testAccounts)
  
  const user = testAccounts.find(account => account.phone === phone.value && account.password === password.value)
  
  console.log('找到的用户:', user)
  
  if (user) {
    console.log('登录成功，用户角色:', user.role)
    // 保存用户信息到本地存储
    const userInfo = {
      id: 1,
      phone: user.phone,
      name: user.name,
      role: user.role,
      avatar: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20ID%20photo%20of%20a%20Chinese%20male%20worker%20with%20plain%20white%20background%2C%20passport%20style%2C%20front%20view%2C%20clear%20features%2C%20formal%20clothing&image_size=square',
      ...(user.role === 'worker' && {
        currentLaborCompany: '南通富民劳务服务有限公司',
        currentFactory: '富士康科技集团',
        position: '操作工',
        idCard: '410101199005151234',
        gender: '男',
        age: '34',
        birthDate: '1990-05-15',
        ethnicity: '汉族',
        maritalStatus: '已婚',
        politicalStatus: '群众',
        nativePlace: '河南省郑州市中原区',
          currentAddress: '广东省深圳市南山区科技园南区高新南一道',
        highestEducation: '高中',
        education: [
          {
            degree: '高中',
            school: '郑州市第一高级中学',
            major: '文科',
            graduationDate: '2008-06'
          },
          {
            degree: '初中',
            school: '郑州市第二初级中学',
            major: '全科',
            graduationDate: '2005-06'
          }
        ],
        workInfo: {
          factorySection: '组装车间',
          group: '第三组',
          position: '流水线操作员',
          supervisor: '李四',
          entryDate: '2023-01-01',
          paymentMethod: '月结',
          contractAttachment: 'https://example.com/contract.pdf'
        },
        jobIntent: {
          positionCategory: '普工',
          positionPreference: '质检员、仓库管理员',
          salaryExpectation: '5000-6000元/月',
          workLocation: '广东省深圳市南山区'
        },
        specialNotes: '右腿有钢板植入（2019年车祸），查看医疗证明',
        personalExperience: '2015-2017年在郑州某超市担任理货员，2017-2019年在广州某餐厅担任服务员，2019-2022年在深圳某电子厂担任操作工。',
        workHistory: [
          {
            startDate: '2023.01',
            endDate: '至今',
            laborCompany: '南通富民劳务服务有限公司',
            factory: '富士康科技集团',
            position: '操作工',
            laborCompanyRewards: '2023年度优秀员工',
            laborCompanyPunishments: '无',
            factoryRewards: '2023年第三季度生产效率标兵',
            factoryPunishments: '2023年6月迟到1次',
            attendanceRecords: '异常: 1次'
          },
          {
            startDate: '2020.03',
            endDate: '2022.12',
            laborCompany: '深圳诚信劳务派遣有限公司',
            factory: '华为技术有限公司',
            position: '质检员',
            laborCompanyRewards: '2021年度优秀员工',
            laborCompanyPunishments: '无',
            factoryRewards: '2021年质量标兵',
            factoryPunishments: '无',
            attendanceRecords: '异常: 0次'
          }
        ],
        emergencyContact: '李四',
          emergencyPhone: '139****9999',
          accountName: '张三',
          bankCard: '6222021234567890123',
          bankType: '中国工商银行',
          bankName: '深圳市南山支行',
        healthStatus: '健康',
        height: '175cm',
        weight: '68kg',
        skills: '熟练操作流水线设备，具备基础质检能力',
          certificates: '身份证、健康证',
          certificateAttachments: [
            {
              name: '身份证',
              url: 'https://example.com/id-card.pdf'
            },
            {
              name: '健康证',
              url: 'https://example.com/health-certificate.pdf'
            }
          ]
      }),
      ...(user.role === 'tenant' && {
        companyName: '南通富民劳务服务有限公司',
        position: '招聘经理'
      })
    }
    
    console.log('保存的用户信息:', userInfo)
    localStorage.setItem('userInfo', JSON.stringify(userInfo))
    localStorage.setItem('token', 'test-token-' + Math.random().toString(36).substring(2))
    
    console.log('本地存储已设置')
    console.log('localStorage.userInfo:', localStorage.getItem('userInfo'))
    
    // 根据用户角色跳转到对应页面
    switch (user.role) {
      case 'worker':
        console.log('跳转到工人首页')
        router.push('/worker/home')
        break
      case 'tenant':
        // 检测设备类型，跳转到PC端或移动端
        console.log('跳转到租户页面，设备宽度:', window.innerWidth)
        console.log('准备跳转到:', window.innerWidth > 768 ? '/tenant/home' : '/tenant-mobile/home')
        router.push('/tenant/home')
        break
      case 'platform_admin':
        console.log('跳转到平台管理员页面')
        router.push('/admin/home')
        break
      default:
        console.log('未知用户角色:', user.role)
        ElMessage.error('未知用户角色')
    }
  } else {
    console.log('登录失败，手机号或密码错误')
    ElMessage.error('手机号或密码错误')
  }
  
  loading.value = false
  console.log('登录过程结束')
}

// 跳转到注册页面
const goToRegister = () => {
  router.push('/register')
}

// 跳转到忘记密码页面
const goToForgotPassword = () => {
  router.push('/forgot-password')
}
</script>

<template>
  <div class="login-container">
    <div class="login-box">
      <div class="login-header">
        <img src="/assets/logo.jpg" alt="蓝领智汇" class="login-logo" />
      </div>
      
      <el-form :model="{ phone, password }" class="login-form" label-position="top">
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
          <el-button
            type="primary"
            class="login-button"
            :loading="loading"
            @click="handleLogin"
          >
            登录
          </el-button>
        </el-form-item>
        
        <div class="login-links">
          <a href="#" @click.prevent="goToRegister">立即注册</a>
          <a href="#" @click.prevent="goToForgotPassword">忘记密码</a>
        </div>
      </el-form>
      
      <div class="login-test-info">
        <h4>测试账号信息：</h4>
        <p>工人：13800138001 / 123456</p>
        <p>租户：13800138002 / 123456</p>
        <p>平台管理员：13800138004 / 123456</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
  position: relative;
  overflow: hidden;
}

.login-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E');
  opacity: 0.5;
}

.login-box {
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

.login-box:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 50px rgba(0, 0, 0, 0.2);
}

.login-header {
  text-align: center;
  margin-bottom: 35px;
  background-color: #FFFFFF;
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #f0f0f0;
}

.login-logo {
  margin: 0 auto;
  display: block;
  background-color: transparent;
  border: none;
  height: 90px;
  width: auto;
  transition: all 0.3s ease;
}

.login-header:hover .login-logo {
  transform: scale(1.05);
}

.login-form {
  margin-bottom: 25px;
}

.form-input {
  height: 50px;
  border-radius: 12px;
  border: 2px solid #e0e0e0;
  transition: all 0.3s ease;
  background-color: #ffffff;
}

.form-input:focus {
  border-color: #667eea;
  box-shadow: 0 0 15px rgba(102, 126, 234, 0.3);
  transform: translateY(-1px);
}

.login-button {
  width: 100%;
  height: 50px;
  font-size: 18px;
  font-weight: 600;
  border-radius: 12px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border: none;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  color: white;
  text-transform: uppercase;
  letter-spacing: 1px;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
}

.login-button:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.5);
  background: linear-gradient(135deg, #764ba2, #667eea);
}

.login-button:active {
  transform: translateY(-1px);
  box-shadow: 0 4px 10px rgba(102, 126, 234, 0.4);
}

.login-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  transition: left 0.6s;
}

.login-button:hover::before {
  left: 100%;
}

.login-links {
  display: flex;
  justify-content: space-between;
  margin-top: 25px;
  padding: 0 10px;
}

.login-links a {
  color: #667eea;
  text-decoration: none;
  font-size: 16px;
  font-weight: 600;
  transition: all 0.3s ease;
  position: relative;
  padding: 5px 10px;
  border-radius: 6px;
}

.login-links a:hover {
  color: #764ba2;
  transform: translateY(-2px);
  background-color: rgba(102, 126, 234, 0.1);
  box-shadow: 0 2px 10px rgba(102, 126, 234, 0.2);
}

.login-links a::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 3px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  transition: width 0.3s ease;
  border-radius: 2px;
}

.login-links a:hover::after {
  width: 80%;
}

.login-test-info {
  margin-top: 35px;
  padding: 25px;
  background: #ffffff;
  border-radius: 12px;
  font-size: 14px;
  border: 2px solid #e8e8e8;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.login-test-info:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
  border-color: #667eea;
}

.login-test-info h4 {
  margin-bottom: 15px;
  color: #333;
  font-size: 16px;
  font-weight: bold;
  text-align: center;
  padding-bottom: 10px;
  border-bottom: 2px solid #f0f0f0;
}

.login-test-info p {
  margin: 10px 0;
  color: #666;
  line-height: 1.5;
  padding-left: 15px;
  position: relative;
}

.login-test-info p::before {
  content: '•';
  color: #667eea;
  font-weight: bold;
  position: absolute;
  left: 0;
  top: 0;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .login-box {
    padding: 30px 25px;
    margin: 0 15px;
  }
  
  .form-input {
    height: 46px;
  }
  
  .login-button {
    height: 46px;
  }
}
</style>