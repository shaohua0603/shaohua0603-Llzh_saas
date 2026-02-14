<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElIcon, ElMessage, ElDialog } from 'element-plus'
import { Share, Briefcase, OfficeBuilding, HomeFilled, Star, ZoomIn } from '@element-plus/icons-vue'

const router = useRouter()

// 用户状态
const userInfo = ref({
  name: '张三',
  inLaborCompany: true,
  inFactory: true,
  laborCompany: '南通富民劳务服务有限公司',
  factory: '富士康科技集团'
})

// 转介绍选项类型
interface ReferralOption {
  id: number
  name: string
  icon: any
  available: boolean
  description: string
}

// 转介绍选项
const referralOptions = ref<ReferralOption[]>([
  {
    id: 1,
    name: '劳务公司',
    icon: OfficeBuilding,
    available: true,
    description: `转介绍给${userInfo.value.laborCompany}`
  },
  {
    id: 2,
    name: '平台',
    icon: HomeFilled,
    available: true,
    description: '转介绍给蓝领智汇平台'
  },
  {
    id: 3,
    name: '工厂',
    icon: Briefcase,
    available: true,
    description: `转介绍给${userInfo.value.factory}`
  }
])

// 转介绍表单数据
const referralForm = ref({
  selectedOption: null as ReferralOption | null
})

// 二维码显示状态
const qrcodeVisible = ref(false)
// 二维码预览模态框状态
const qrcodePreviewVisible = ref(false)

// 生成二维码
const generateQRCode = () => {
  if (!referralForm.value.selectedOption) {
    ElMessage.error('请选择转介绍对象')
    return
  }
  
  // 模拟生成二维码（包含用户类型标识）
  setTimeout(() => {
    qrcodeVisible.value = true
    ElMessage.success('二维码生成成功！')
  }, 1000)
}

// 二维码类型标识
const qrcodeType = ref('new_user') // new_user: 新用户注册, old_user: 老用户绑定

// 切换二维码类型
const toggleQRCodeType = (type: string) => {
  qrcodeType.value = type
  // 重新生成二维码
  generateQRCode()
}

// 跳转到我的佣金页面
const goToCommission = () => {
  router.push('/worker/referral-commission')
}

// 根据用户状态更新转介绍选项
const updateReferralOptions = () => {
  if (userInfo.value.inLaborCompany && userInfo.value.inFactory) {
    // 在劳务公司且进厂了：可以选择转介绍给劳务公司、平台、工厂
    referralOptions.value[0].available = true
    referralOptions.value[1].available = true
    referralOptions.value[2].available = true
  } else if (userInfo.value.inLaborCompany && !userInfo.value.inFactory) {
    // 只在劳务公司不在工厂：只能转介绍给劳务公司和平台
    referralOptions.value[0].available = true
    referralOptions.value[1].available = true
    referralOptions.value[2].available = false
  } else if (!userInfo.value.inLaborCompany && userInfo.value.inFactory) {
    // 只属于工厂：只能转介绍给工厂和平台
    referralOptions.value[0].available = false
    referralOptions.value[1].available = true
    referralOptions.value[2].available = true
  } else {
    // 不属于劳务公司和工厂：只可以转介绍给平台
    referralOptions.value[0].available = false
    referralOptions.value[1].available = true
    referralOptions.value[2].available = false
  }
}

// 选择转介绍选项
const selectReferralOption = (option: ReferralOption) => {
  referralForm.value.selectedOption = option
}

// 获取佣金金额
const getCommissionAmount = (optionId: number): string => {
  switch (optionId) {
    case 1: // 劳务公司
      return '¥300'
    case 2: // 平台
      return '¥250'
    case 3: // 工厂
      return '¥350'
    default:
      return '¥200'
  }
}

onMounted(() => {
  updateReferralOptions()
})
</script>

<template>
  <div class="worker-referral">
    <BackButton />
    
    <!-- 页面标题 -->
    <div class="page-header">
      <h2>工作转介绍</h2>
    </div>
    
    <!-- 我的佣金入口 -->
    <div class="commission-entry" @click="goToCommission">
      <div class="commission-icon">
        <el-icon class="dollar-icon"><Star /></el-icon>
      </div>
      <div class="commission-info">
        <h3>我的佣金</h3>
        <p>查看转介绍获得的佣金</p>
      </div>
      <el-icon class="arrow-icon"><Star /></el-icon>
    </div>
    
    <!-- 转介绍说明 -->
    <div class="referral-info">
      <div class="info-header">
        <el-icon class="share-icon"><Share /></el-icon>
        <h3>转介绍说明</h3>
      </div>
      <div class="info-content">
        <p>1. 选择转介绍对象</p>
        <p>2. 生成专属邀请二维码</p>
        <p>3. 分享二维码给好友</p>
        <p>4. 好友扫描二维码注册或绑定</p>
        <p>5. 好友进厂第8天，您将获得相应的佣金奖励</p>
      </div>
    </div>
    
    <!-- 转介绍对象选择 -->
    <div class="referral-options">
      <h3 class="section-title">选择转介绍对象</h3>
      <div class="options-grid-horizontal">
        <div 
          v-for="option in referralOptions" 
          :key="option.id" 
          class="option-item-horizontal"
          :class="{ 
            'available': option.available, 
            'selected': referralForm.selectedOption?.id === option.id
          }"
          :disabled="!option.available"
          @click="option.available && selectReferralOption(option)"
        >
          <div class="option-icon">
            <el-icon :class="option.available ? 'available-icon' : 'unavailable-icon'">
              <component :is="option.icon" />
            </el-icon>
          </div>
          <h4 class="option-name">{{ option.name }}</h4>
          <p class="option-description">{{ option.description }}</p>
          <div class="option-commission" v-if="option.available">
            <span class="commission-label">佣金：</span>
            <span class="commission-amount">{{ getCommissionAmount(option.id) }}</span>
          </div>
          <div v-if="referralForm.selectedOption?.id === option.id" class="selected-indicator">
            <el-icon><Star /></el-icon>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 生成二维码区域 -->
    <div class="qrcode-section" v-if="qrcodeVisible">
      <h3 class="section-title">邀请二维码</h3>
      <!-- 二维码类型切换 -->
      <div class="qrcode-type-toggle">
        <button 
          :class="['type-btn', { active: qrcodeType === 'new_user' }]"
          @click="toggleQRCodeType('new_user')"
        >
          新用户注册
        </button>
        <button 
          :class="['type-btn', { active: qrcodeType === 'old_user' }]"
          @click="toggleQRCodeType('old_user')"
        >
          老用户绑定
        </button>
      </div>
      <div class="qrcode-content">
        <div class="qrcode-container">
          <!-- 自定义二维码 -->
<div class="qrcode-placeholder" @click="qrcodePreviewVisible = true">
  <div class="qrcode-container-inner">
    <div class="qrcode-bg">
      <!-- 二维码网格 -->
<div class="qrcode-grid">
  <!-- 右下角定位图案 -->
  <div class="qrcode-corner qrcode-corner-bottom-right"></div>
  <!-- 左下角定位图案 -->
  <div class="qrcode-corner qrcode-corner-bottom-left"></div>
</div>
      <!-- 中间logo -->
      <div class="qrcode-logo">
        <img src="/assets/logo.jpg" alt="蓝领智汇" class="logo-image" />
      </div>
    </div>
  </div>
  <div class="qrcode-overlay">
    <el-icon class="zoom-icon"><ZoomIn /></el-icon>
    <span>点击放大</span>
  </div>
</div>
          
          <!-- 二维码预览模态框 -->
          <el-dialog
            v-model="qrcodePreviewVisible"
            title="二维码预览"
            width="90%"
            center
          >
            <div class="qrcode-preview-container">
              <div class="qrcode-bg large">
                <!-- 二维码网格 -->
                <div class="qrcode-grid">
                  <!-- 右下角定位图案 -->
                  <div class="qrcode-corner qrcode-corner-bottom-right"></div>
                  <!-- 左下角定位图案 -->
                  <div class="qrcode-corner qrcode-corner-bottom-left"></div>
                </div>
                <!-- 中间logo -->
                <div class="qrcode-logo large">
                  <img src="/assets/logo.jpg" alt="蓝领智汇" class="logo-image large" />
                </div>
              </div>
            </div>
          </el-dialog>
          <p class="qrcode-hint" v-if="qrcodeType === 'new_user'">请让新好友扫描此二维码注册</p>
          <p class="qrcode-hint" v-else>请让已有账号的好友扫描此二维码绑定</p>
          <div class="qrcode-info">
            <p>介绍人：{{ userInfo.name || '张三' }}</p>
            <p>转介绍对象：{{ referralForm.selectedOption?.name }}</p>
            <p>二维码类型：{{ qrcodeType === 'new_user' ? '新用户注册' : '老用户绑定' }}</p>
          </div>
        </div>
        <div class="share-options">
          <h4>分享方式</h4>
          <div class="share-buttons">
            <button class="share-btn">
              <el-icon><Star /></el-icon>
              <span>复制链接</span>
            </button>
            <button class="share-btn">
              <el-icon><Star /></el-icon>
              <span>分享到微信</span>
            </button>
            <button class="share-btn">
              <el-icon><Star /></el-icon>
              <span>保存二维码</span>
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 生成二维码按钮 -->
    <div class="generate-section" v-else>
      <button 
        class="generate-btn" 
        @click="generateQRCode"
        :disabled="!referralForm.selectedOption"
      >
        生成二维码
      </button>
      <p class="generate-hint">
        生成二维码后，您的好友通过扫描二维码注册成为蓝领智汇用户，
        即可自动关联为您的被介绍人。当好友进厂后达到佣金发放条件，
        系统将自动为您发放佣金。
      </p>
    </div>
  </div>
</template>

<style scoped>
.worker-referral {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding-bottom: 20px;
}

.page-header {
  background-color: #007bff;
  color: #fff;
  padding: 20px 15px;
  position: sticky;
  top: 0;
  z-index: 10;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.page-header h2 {
  margin: 0;
  font-size: 20px;
  font-weight: bold;
  letter-spacing: 0.5px;
}

/* 我的佣金入口 */
.commission-entry {
  background-color: #fff;
  margin: 20px 15px;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  display: flex;
  align-items: center;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid #e9ecef;
}

.commission-entry:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
  border-color: #007bff;
}

.commission-icon {
  width: 50px;
  height: 50px;
  border-radius: 25px;
  background-color: #e3f2fd;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 16px;
  flex-shrink: 0;
}

.dollar-icon {
  font-size: 24px;
  color: #007bff;
}

.commission-info {
  flex: 1;
}

.commission-info h3 {
  margin: 0 0 4px;
  font-size: 16px;
  font-weight: bold;
  color: #333;
}

.commission-info p {
  margin: 0;
  font-size: 14px;
  color: #666;
}

.arrow-icon {
  font-size: 16px;
  color: #999;
}

/* 转介绍说明 */
.referral-info {
  background-color: #fff;
  margin: 0 15px 20px;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.info-header {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
}

.share-icon {
  font-size: 20px;
  color: #007bff;
  margin-right: 12px;
}

.info-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: bold;
  color: #333;
}

.info-content p {
  margin: 8px 0;
  font-size: 14px;
  color: #666;
  line-height: 1.5;
}

/* 转介绍对象选择 */
.referral-options {
  background-color: #fff;
  margin: 0 15px 20px;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.section-title {
  margin: 0 0 16px;
  font-size: 16px;
  font-weight: bold;
  color: #333;
}

/* 水平排列 */
.options-grid-horizontal {
  display: flex;
  gap: 12px;
  overflow-x: auto;
  padding-bottom: 10px;
}

.options-grid-horizontal::-webkit-scrollbar {
  height: 6px;
}

.options-grid-horizontal::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.options-grid-horizontal::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.options-grid-horizontal::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

.option-item-horizontal {
  flex: 0 0 280px;
  border: 2px solid #e9ecef;
  border-radius: 12px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  background-color: #fff;
}

.option-item-horizontal.available {
  border-color: #e9ecef;
}

.option-item-horizontal.available:hover {
  border-color: #007bff;
  box-shadow: 0 4px 16px rgba(0, 123, 255, 0.15);
  transform: translateY(-2px);
}

.option-item-horizontal.selected {
  border-color: #007bff;
  background-color: #f8f9ff;
  box-shadow: 0 4px 16px rgba(0, 123, 255, 0.15);
}

.option-item-horizontal:not(.available) {
  opacity: 0.5;
  cursor: not-allowed;
}

.option-icon {
  margin-bottom: 12px;
}

.available-icon {
  font-size: 24px;
  color: #007bff;
}

.unavailable-icon {
  font-size: 24px;
  color: #999;
}

.option-name {
  margin: 0 0 8px;
  font-size: 16px;
  font-weight: bold;
  color: #333;
}

.option-description {
  margin: 0 0 12px;
  font-size: 14px;
  color: #666;
  line-height: 1.4;
}

/* 佣金金额样式 */
.option-commission {
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.commission-label {
  font-size: 14px;
  color: #666;
}

.commission-amount {
  font-size: 16px;
  font-weight: bold;
  color: #ff6b35;
}

.selected-indicator {
  position: absolute;
  top: 12px;
  right: 12px;
  width: 24px;
  height: 24px;
  border-radius: 12px;
  background-color: #007bff;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  box-shadow: 0 2px 8px rgba(0, 123, 255, 0.3);
}

.selected-indicator i {
  font-size: 14px;
}

/* 生成二维码区域 */
.qrcode-section {
  background-color: #fff;
  margin: 0 15px 20px;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

/* 二维码类型切换 */
.qrcode-type-toggle {
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-bottom: 20px;
  padding: 12px;
  background-color: #f8f9ff;
  border-radius: 10px;
}

.type-btn {
  padding: 10px 24px;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  background-color: #fff;
  color: #666;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.type-btn:hover {
  border-color: #007bff;
  color: #007bff;
}

.type-btn.active {
  background-color: #007bff;
  color: #fff;
  border-color: #007bff;
  box-shadow: 0 4px 12px rgba(0, 123, 255, 0.3);
}

.qrcode-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.qrcode-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
}

.qrcode-placeholder {
  width: 200px;
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f5f5f5;
  border-radius: 10px;
  overflow: hidden;
  cursor: pointer;
  position: relative;
  transition: all 0.3s ease;
}

.qrcode-container-inner {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.qrcode-bg {
  width: 180px;
  height: 180px;
  background-color: #007bff;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  box-shadow: 0 4px 16px rgba(0, 123, 255, 0.3);
}

.qrcode-bg.large {
  width: 400px;
  height: 400px;
  border-radius: 15px;
  box-shadow: 0 8px 32px rgba(0, 123, 255, 0.4);
}

.qrcode-grid {
  width: 160px;
  height: 160px;
  background-color: #fff;
  border-radius: 4px;
  position: relative;
  overflow: hidden;
}

.qrcode-bg.large .qrcode-grid {
  width: 360px;
  height: 360px;
  border-radius: 8px;
}

/* 现代二维码设计 */

/* 二维码容器 */
.qrcode-container-inner {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 二维码背景 */
.qrcode-bg {
  width: 240px;
  height: 240px;
  background: linear-gradient(135deg, #ffffff 0%, #f0f4ff 100%);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  box-shadow: 
    0 12px 32px rgba(0, 123, 255, 0.15),
    inset 0 1px 0 rgba(255, 255, 255, 0.95);
  overflow: hidden;
  transition: all 0.3s ease;
}

/* 二维码背景光效 */
.qrcode-bg::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(145deg, rgba(0, 123, 255, 0.08) 0%, rgba(0, 123, 255, 0.02) 100%);
  z-index: 0;
}

/* 二维码背景光泽效果 */
.qrcode-bg::after {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: linear-gradient(
    to bottom right,
    rgba(255, 255, 255, 0) 0%,
    rgba(255, 255, 255, 0.6) 50%,
    rgba(255, 255, 255, 0) 100%
  );
  transform: rotate(45deg);
  z-index: 0;
  animation: shine 10s infinite linear;
}

/* 光泽动画 */
@keyframes shine {
  0% {
    transform: rotate(45deg) translateX(-100%) translateY(-100%);
  }
  100% {
    transform: rotate(45deg) translateX(100%) translateY(100%);
  }
}

/* 二维码主体 */
.qrcode-grid {
  width: 190px;
  height: 190px;
  background-color: #fff;
  border-radius: 12px;
  position: relative;
  overflow: hidden;
  box-shadow: 
    0 6px 20px rgba(0, 0, 0, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.95);
  z-index: 1;
  transition: all 0.3s ease;
}

/* 二维码点阵图案 - 现代风格 */
.qrcode-grid {
  background-image: 
    radial-gradient(#007bff 1.6px, transparent 1.6px),
    radial-gradient(#007bff 1.6px, transparent 1.6px);
  background-size: 12px 12px;
  background-position: 0 0, 6px 6px;
  background-color: #fff;
}

/* 二维码定位图案 */
.qrcode-grid {
  position: relative;
}

/* 左上角定位图案 */
.qrcode-grid::before {
  content: '';
  position: absolute;
  top: 10px;
  left: 10px;
  width: 36px;
  height: 36px;
  border: 2.5px solid #007bff;
  border-radius: 6px;
  box-shadow: inset 0 0 0 7px #007bff;
  background-color: #fff;
  z-index: 5;
}

/* 右上角定位图案 */
.qrcode-grid::after {
  content: '';
  position: absolute;
  top: 10px;
  right: 10px;
  width: 36px;
  height: 36px;
  border: 2.5px solid #007bff;
  border-radius: 6px;
  box-shadow: inset 0 0 0 7px #007bff;
  background-color: #fff;
  z-index: 5;
}

/* 定位图案通用样式 */
.qrcode-corner {
  position: absolute;
  width: 36px;
  height: 36px;
  border: 2.5px solid #007bff;
  border-radius: 6px;
  box-shadow: inset 0 0 0 7px #007bff;
  background-color: #fff;
  z-index: 5;
}

/* 右下角定位图案 */
.qrcode-corner-bottom-right {
  bottom: 10px;
  right: 10px;
}

/* 左下角定位图案 */
.qrcode-corner-bottom-left {
  bottom: 10px;
  left: 10px;
}

/* 大尺寸二维码定位图案调整 */
.qrcode-bg.large .qrcode-grid::before,
.qrcode-bg.large .qrcode-grid::after {
  width: 80px;
  height: 80px;
  border: 6px solid #007bff;
  box-shadow: inset 0 0 0 16px #007bff;
  border-radius: 12px;
}

.qrcode-bg.large .qrcode-corner {
  width: 80px;
  height: 80px;
  border: 6px solid #007bff;
  box-shadow: inset 0 0 0 16px #007bff;
  border-radius: 12px;
}

/* 响应式定位图案调整 */
@media (max-width: 768px) {
  .qrcode-grid::before,
  .qrcode-grid::after {
    width: 35px;
    height: 35px;
    border: 2.5px solid #007bff;
    box-shadow: inset 0 0 0 7px #007bff;
    border-radius: 6px;
  }
  
  .qrcode-corner {
    width: 35px;
    height: 35px;
    border: 2.5px solid #007bff;
    box-shadow: inset 0 0 0 7px #007bff;
    border-radius: 6px;
  }
  
  .qrcode-bg.large .qrcode-grid::before,
  .qrcode-bg.large .qrcode-grid::after {
    width: 65px;
    height: 65px;
    border: 5px solid #007bff;
    box-shadow: inset 0 0 0 13px #007bff;
    border-radius: 8px;
  }
  
  .qrcode-bg.large .qrcode-corner {
    width: 65px;
    height: 65px;
    border: 5px solid #007bff;
    box-shadow: inset 0 0 0 13px #007bff;
    border-radius: 8px;
  }
}

/* 增强logo显示效果 */
.qrcode-logo {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
  box-shadow: 
    0 8px 24px rgba(0, 123, 255, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.95);
  animation: float 3s ease-in-out infinite;
  transition: all 0.3s ease;
}

/* Logo容器光泽 */
.qrcode-logo::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(145deg, rgba(0, 123, 255, 0.08) 0%, rgba(0, 123, 255, 0.02) 100%);
  border-radius: 12px;
  z-index: 0;
}

/* Logo图片 */
.logo-image {
  max-width: 85%;
  max-height: 85%;
  object-fit: contain;
  z-index: 1;
  transition: transform 0.3s ease;
}

/* Logo悬停效果 */
.logo-image:hover {
  transform: scale(1.1);
}

/* 浮动动画 */
@keyframes float {
  0% {
    transform: translate(-50%, -50%) translateY(0px);
  }
  50% {
    transform: translate(-50%, -50%) translateY(-6px);
  }
  100% {
    transform: translate(-50%, -50%) translateY(0px);
  }
}

/* 大尺寸二维码调整 */
.qrcode-bg.large {
  width: 400px;
  height: 400px;
  border-radius: 24px;
  box-shadow: 
    0 16px 48px rgba(0, 123, 255, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.95);
}

.qrcode-bg.large .qrcode-grid {
  width: 340px;
  height: 340px;
  border-radius: 16px;
  box-shadow: 
    0 8px 28px rgba(0, 0, 0, 0.12),
    inset 0 1px 0 rgba(255, 255, 255, 0.95);
  background-size: 16px 16px;
  background-position: 0 0, 8px 8px;
}

.qrcode-bg.large .qrcode-grid::before {
  width: 70px;
  height: 70px;
  border: 5px solid #007bff;
  box-shadow: inset 0 0 0 14px #007bff;
  border-radius: 10px;
  top: 20px;
  left: 20px;
}

.qrcode-bg.large .qrcode-grid::after {
  width: 70px;
  height: 70px;
  border: 5px solid #007bff;
  box-shadow: inset 0 0 0 14px #007bff;
  border-radius: 10px;
  top: 20px;
  right: 20px;
}

.qrcode-bg.large .qrcode-corner {
  width: 70px;
  height: 70px;
  border: 5px solid #007bff;
  box-shadow: inset 0 0 0 14px #007bff;
  border-radius: 10px;
}

.qrcode-bg.large .qrcode-corner-bottom-right {
  bottom: 20px;
  right: 20px;
}

.qrcode-bg.large .qrcode-corner-bottom-left {
  bottom: 20px;
  left: 20px;
}

.qrcode-logo.large {
  width: 120px;
  height: 120px;
  border-radius: 20px;
  box-shadow: 
    0 12px 36px rgba(0, 123, 255, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.95);
}

.logo-image.large {
  max-width: 85%;
  max-height: 85%;
}

/* 二维码容器悬停效果 */
.qrcode-placeholder {
  transition: all 0.3s ease;
}

.qrcode-placeholder:hover {
  transform: scale(1.03);
  box-shadow: 0 16px 48px rgba(0, 123, 255, 0.3);
}

.qrcode-placeholder:hover .qrcode-bg {
  box-shadow: 
    0 12px 36px rgba(0, 123, 255, 0.25),
    inset 0 1px 0 rgba(255, 255, 255, 0.95);
  transform: translateY(-4px);
}

.qrcode-placeholder:hover .qrcode-grid {
  box-shadow: 
    0 8px 28px rgba(0, 0, 0, 0.15),
    inset 0 1px 0 rgba(255, 255, 255, 0.95);
}

.qrcode-placeholder:hover .qrcode-logo {
  box-shadow: 
    0 12px 36px rgba(0, 123, 255, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.95);
  animation: float 2.5s ease-in-out infinite;
}

/* 二维码覆盖层 */
.qrcode-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
  color: #fff;
  gap: 6px;
  border-radius: 20px;
  backdrop-filter: blur(3px);
}

.qrcode-placeholder:hover .qrcode-overlay {
  opacity: 1;
}

.zoom-icon {
  font-size: 28px;
  animation: pulse 2s infinite;
}

/* 脉冲动画 */
@keyframes pulse {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.15);
    opacity: 0.9;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

.qrcode-overlay span {
  font-size: 14px;
  font-weight: 600;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

/* 二维码预览模态框样式 */
.qrcode-preview-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px;
  min-height: 70vh;
}

.qrcode-preview-image {
  max-width: 100%;
  max-height: 70vh;
  object-fit: contain;
  border-radius: 20px;
  box-shadow: 0 16px 60px rgba(0, 0, 0, 0.3);
}

/* 响应式调整 */
@media (max-width: 768px) {
  /* 基础尺寸调整 */
  .qrcode-bg {
    width: 190px;
    height: 190px;
    border-radius: 20px;
  }
  
  .qrcode-grid {
    width: 150px;
    height: 150px;
    border-radius: 14px;
    background-size: 14px 14px;
    background-position: 0 0, 7px 7px;
  }
  
  .qrcode-grid::before,
  .qrcode-grid::after {
    width: 35px;
    height: 35px;
    border: 2.5px solid #007bff;
    box-shadow: inset 0 0 0 7px #007bff;
    border-radius: 6px;
  }
  
  .qrcode-logo {
    width: 65px;
    height: 65px;
    border-radius: 12px;
  }
  
  /* 大尺寸调整 */
  .qrcode-bg.large {
    width: 320px;
    height: 320px;
    border-radius: 24px;
  }
  
  .qrcode-bg.large .qrcode-grid {
    width: 280px;
    height: 280px;
    border-radius: 16px;
    background-size: 26px 26px;
    background-position: 0 0, 13px 13px;
  }
  
  .qrcode-bg.large .qrcode-grid::before,
  .qrcode-bg.large .qrcode-grid::after {
    width: 65px;
    height: 65px;
    border: 5px solid #007bff;
    box-shadow: inset 0 0 0 13px #007bff;
    border-radius: 8px;
  }
  
  .qrcode-logo.large {
    width: 120px;
    height: 120px;
    border-radius: 18px;
  }
  
  /* 覆盖层调整 */
  .qrcode-overlay span {
    font-size: 14px;
  }
  
  .zoom-icon {
    font-size: 28px;
  }
  
  /* 预览容器调整 */
  .qrcode-preview-container {
    padding: 20px;
    min-height: 60vh;
  }
}

.qrcode-hint {
  margin: 0;
  font-size: 14px;
  color: #666;
  text-align: center;
}

.qrcode-info {
  display: flex;
  flex-direction: column;
  gap: 5px;
  align-items: center;
  font-size: 14px;
  color: #666;
  background-color: #f9f9f9;
  padding: 15px;
  border-radius: 8px;
  width: 100%;
  max-width: 300px;
}

.share-options {
  width: 100%;
  max-width: 400px;
}

.share-options h4 {
  margin-top: 0;
  margin-bottom: 15px;
  font-size: 14px;
  font-weight: bold;
  color: #333;
  text-align: center;
}

.share-buttons {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 10px;
}

.share-btn {
  padding: 12px;
  background-color: #f0f9eb;
  color: #67c23a;
  border: 1px solid #c2e7b0;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
}

.share-btn:hover {
  background-color: #ecf5ff;
  color: #409eff;
  border-color: #d9ecff;
}

/* 生成二维码按钮区域 */
.generate-section {
  background-color: #fff;
  margin: 0 15px 20px;
  padding: 30px 20px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
}

.generate-btn {
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 25px;
  padding: 16px 40px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 123, 255, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.generate-btn:hover {
  background-color: #0069d9;
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 123, 255, 0.4);
}

.generate-btn:disabled {
  background-color: #6c757d;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.generate-hint {
  margin: 0;
  font-size: 14px;
  color: #666;
  text-align: center;
  line-height: 1.5;
  max-width: 400px;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .page-header {
    padding: 16px 15px;
  }
  
  .page-header h2 {
    font-size: 18px;
  }
  
  .commission-entry {
    margin: 16px 15px;
    padding: 16px;
  }
  
  .commission-icon {
    width: 40px;
    height: 40px;
  }
  
  .dollar-icon {
    font-size: 20px;
  }
  
  .commission-info h3 {
    font-size: 15px;
  }
  
  .commission-info p {
    font-size: 13px;
  }
  
  .referral-info {
    margin: 0 15px 16px;
    padding: 16px;
  }
  
  .info-header h3 {
    font-size: 15px;
  }
  
  .info-content p {
    font-size: 13px;
  }
  
  .referral-options {
    margin: 0 15px 16px;
    padding: 16px;
  }
  
  .section-title {
    font-size: 15px;
    margin-bottom: 12px;
  }
  
  /* 移动端转介绍对象选择适配 */
  .options-grid-horizontal {
    display: flex;
    flex-direction: column;
    gap: 12px;
    overflow-x: visible;
    padding-bottom: 0;
  }
  
  .options-grid-horizontal::-webkit-scrollbar {
    display: none;
  }
  
  .option-item-horizontal {
    flex: 1 1 auto;
    width: 100%;
    max-width: 100%;
    padding: 16px;
    margin-right: 0;
  }
  
  .option-name {
    font-size: 15px;
  }
  
  .option-description {
    font-size: 13px;
    line-height: 1.4;
  }
  
  .option-commission {
    margin-top: 10px;
    padding-top: 10px;
  }
  
  .commission-amount {
    font-size: 15px;
  }
  
  .qrcode-section {
    margin: 0 15px 16px;
    padding: 16px;
  }
  
  .generate-section {
    margin: 0 15px 16px;
    padding: 20px 16px;
  }
  
  .qrcode-placeholder {
    width: 180px;
    height: 180px;
  }
  
  .share-buttons {
    grid-template-columns: repeat(3, 1fr);
  }
  
  .share-btn {
    padding: 10px;
    font-size: 12px;
  }
  
  .generate-btn {
    padding: 14px 30px;
    font-size: 14px;
    width: 100%;
    max-width: 300px;
  }
  
  .generate-hint {
    font-size: 13px;
  }
}

/* 平板端适配 */
@media (min-width: 769px) and (max-width: 1024px) {
  .options-grid-horizontal {
    display: flex;
    gap: 15px;
    overflow-x: auto;
  }
  
  .option-item-horizontal {
    flex: 0 0 250px;
    padding: 18px;
  }
}

/* 触摸反馈优化 */
.option-item-horizontal {
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;
}

.option-item-horizontal:active {
  transform: scale(0.98);
  transition: transform 0.1s ease;
}
</style>