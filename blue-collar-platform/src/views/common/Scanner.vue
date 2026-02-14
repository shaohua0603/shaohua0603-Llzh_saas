<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { ElMessage, ElLoading } from 'element-plus'
import { useRouter } from 'vue-router'

const router = useRouter()

// 扫描状态
const scanning = ref(false)
const scanResult = ref('')
const errorMessage = ref('')

// 摄像头相关
const videoRef = ref<HTMLVideoElement | null>(null)
const canvasRef = ref<HTMLCanvasElement | null>(null)
const stream = ref<MediaStream | null>(null)

// 相册选择
const fileInputRef = ref<HTMLInputElement | null>(null)

// 开始扫描
const startScanning = async () => {
  try {
    // 请求摄像头权限
    stream.value = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
    
    if (videoRef.value) {
      videoRef.value.srcObject = stream.value
      videoRef.value.play()
      scanning.value = true
      errorMessage.value = ''
      
      // 开始识别二维码
      startQRCodeDetection()
    }
  } catch (error) {
    console.error('摄像头权限被拒绝:', error)
    errorMessage.value = '无法访问摄像头，请检查权限设置'
    ElMessage.error('无法访问摄像头，请检查权限设置')
  }
}

// 停止扫描
const stopScanning = () => {
  if (stream.value) {
    stream.value.getTracks().forEach(track => track.stop())
    stream.value = null
  }
  scanning.value = false
}

// 开始二维码识别
const startQRCodeDetection = () => {
  if (!videoRef.value || !canvasRef.value) return
  
  const canvas = canvasRef.value
  const ctx = canvas.getContext('2d')
  
  const detectQRCode = () => {
    if (!scanning.value || !videoRef.value || !ctx) return
    
    try {
      // 绘制视频帧到画布
      ctx.drawImage(videoRef.value, 0, 0, canvas.width, canvas.height)
      
      // 模拟二维码识别
      // 实际项目中这里应该使用真实的二维码识别库
      simulateQRCodeDetection()
      
      if (scanning.value) {
        requestAnimationFrame(detectQRCode)
      }
    } catch (error) {
      console.error('识别二维码时出错:', error)
    }
  }
  
  detectQRCode()
}

// 模拟二维码识别
const simulateQRCodeDetection = () => {
  // 模拟10%的概率识别到二维码
  if (Math.random() < 0.1) {
    // 模拟二维码内容
    const mockQRCodeContent = 'https://blue-collar.com/bind-referrer?referrer_id=123&type=old_user&referrer_name=张三'
    handleScanResult(mockQRCodeContent)
  }
}

// 处理扫描结果
const handleScanResult = (result: string) => {
  stopScanning()
  scanResult.value = result
  
  // 解析二维码内容
  parseQRCodeContent(result)
}

// 解析二维码内容
const parseQRCodeContent = (content: string) => {
  try {
    // 检查是否是有效的URL
    const url = new URL(content)
    
    // 检查是否是转介绍绑定链接
    if (url.pathname.includes('bind-referrer')) {
      const referrerId = url.searchParams.get('referrer_id')
      const type = url.searchParams.get('type')
      const referrerName = url.searchParams.get('referrer_name')
      
      if (referrerId) {
        // 显示加载状态
        const loading = ElLoading.service({
          lock: true,
          text: '正在绑定介绍人...',
          background: 'rgba(0, 0, 0, 0.7)'
        })
        
        // 模拟绑定过程
        setTimeout(() => {
          loading.close()
          
          ElMessage.success(`成功绑定介绍人：${referrerName || '未知'}`)
          
          // 跳转到转介绍页面
          router.push('/worker/referral')
        }, 1500)
      } else {
        ElMessage.error('二维码内容无效，缺少介绍人信息')
      }
    } else {
      ElMessage.error('二维码内容无效，不是有效的转介绍链接')
    }
  } catch (error) {
    console.error('解析二维码内容出错:', error)
    ElMessage.error('二维码内容无效，请扫描正确的转介绍二维码')
  }
}

// 从相册选择图片
const selectFromAlbum = () => {
  if (fileInputRef.value) {
    fileInputRef.value.click()
  }
}

// 处理相册选择
const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files && target.files[0]) {
    const file = target.files[0]
    
    // 检查文件类型
    if (!file.type.startsWith('image/')) {
      ElMessage.error('请选择图片文件')
      return
    }
    
    // 读取图片并识别二维码
    const reader = new FileReader()
    reader.onload = (e) => {
      // 模拟从图片识别二维码
      simulateImageQRCodeDetection()
    }
    reader.readAsDataURL(file)
  }
}

// 模拟从图片识别二维码
const simulateImageQRCodeDetection = () => {
  // 模拟识别过程
  const loading = ElLoading.service({
    lock: true,
    text: '正在识别二维码...',
    background: 'rgba(0, 0, 0, 0.7)'
  })
  
  setTimeout(() => {
    loading.close()
    
    // 模拟识别结果
    const mockQRCodeContent = 'https://blue-collar.com/bind-referrer?referrer_id=456&type=old_user&referrer_name=李四'
    handleScanResult(mockQRCodeContent)
  }, 1500)
}

// 重新扫描
const rescan = () => {
  scanResult.value = ''
  errorMessage.value = ''
  startScanning()
}

// 返回
const goBack = () => {
  stopScanning()
  router.back()
}

// 生命周期
onMounted(() => {
  startScanning()
})

onUnmounted(() => {
  stopScanning()
})
</script>

<template>
  <div class="scanner-container">
    <!-- 头部 -->
    <div class="scanner-header">
      <div class="header-left" @click="goBack">
        <el-icon class="back-icon"><ArrowLeft /></el-icon>
      </div>
      <h1 class="header-title">扫一扫</h1>
      <div class="header-right" @click="selectFromAlbum">
        <el-icon class="album-icon"><Picture /></el-icon>
      </div>
    </div>
    
    <!-- 扫描区域 -->
    <div class="scanner-content">
      <!-- 摄像头预览 -->
      <div class="video-container" v-if="!scanResult">
        <video ref="videoRef" class="scanner-video" autoplay playsinline></video>
        <canvas ref="canvasRef" class="scanner-canvas" width="640" height="480"></canvas>
        
        <!-- 扫描框 -->
        <div class="scanner-frame">
          <div class="scanner-line"></div>
        </div>
        
        <!-- 提示信息 -->
        <div class="scanner-hints">
          <p v-if="!scanning">请点击开始扫描</p>
          <p v-else>正在扫描...</p>
          <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
        </div>
      </div>
      
      <!-- 扫描结果 -->
      <div class="scan-result" v-else>
        <div class="result-icon">
          <el-icon class="success-icon"><CheckCircle /></el-icon>
        </div>
        <h2 class="result-title">扫描成功</h2>
        <p class="result-content">{{ scanResult }}</p>
        <div class="result-buttons">
          <el-button type="primary" class="rescan-button" @click="rescan">
            重新扫描
          </el-button>
          <el-button class="done-button" @click="goBack">
            完成
          </el-button>
        </div>
      </div>
    </div>
    
    <!-- 操作按钮 -->
    <div class="scanner-actions" v-if="!scanResult">
      <el-button 
        type="primary" 
        class="action-button" 
        :disabled="scanning" 
        @click="scanning ? stopScanning() : startScanning()"
      >
        {{ scanning ? '停止扫描' : '开始扫描' }}
      </el-button>
      <el-button class="action-button" @click="selectFromAlbum">
        从相册选择
      </el-button>
    </div>
    
    <!-- 隐藏的文件输入 -->
    <input 
      ref="fileInputRef" 
      type="file" 
      accept="image/*" 
      class="file-input" 
      @change="handleFileChange"
    />
  </div>
</template>

<style scoped>
.scanner-container {
  min-height: 100vh;
  background-color: #000;
  color: #fff;
  display: flex;
  flex-direction: column;
}

/* 头部 */
.scanner-header {
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  background-color: rgba(0, 0, 0, 0.8);
  position: sticky;
  top: 0;
  z-index: 10;
}

.header-left,
.header-right {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.back-icon,
.album-icon {
  font-size: 24px;
  color: #fff;
}

.header-title {
  font-size: 18px;
  font-weight: bold;
  margin: 0;
}

/* 扫描区域 */
.scanner-content {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  padding: 20px;
}

.video-container {
  position: relative;
  width: 100%;
  max-width: 400px;
  aspect-ratio: 1;
}

.scanner-video {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 8px;
}

.scanner-canvas {
  display: none;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

/* 扫描框 */
.scanner-frame {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 280px;
  height: 280px;
  border: 2px solid #409eff;
  border-radius: 8px;
  box-shadow: 0 0 0 200px rgba(0, 0, 0, 0.5);
  overflow: hidden;
}

.scanner-line {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background-color: #409eff;
  animation: scanLine 2s linear infinite;
}

@keyframes scanLine {
  0% {
    top: 0;
  }
  100% {
    top: 100%;
  }
}

/* 提示信息 */
.scanner-hints {
  position: absolute;
  bottom: 20px;
  left: 0;
  right: 0;
  text-align: center;
  font-size: 14px;
  color: #fff;
}

.error-message {
  color: #f56c6c;
  margin-top: 8px;
}

/* 扫描结果 */
.scan-result {
  text-align: center;
  max-width: 400px;
  padding: 40px 20px;
  background-color: rgba(0, 0, 0, 0.8);
  border-radius: 12px;
}

.result-icon {
  margin-bottom: 20px;
}

.success-icon {
  font-size: 64px;
  color: #67c23a;
}

.result-title {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 16px;
}

.result-content {
  font-size: 14px;
  color: #ccc;
  margin-bottom: 32px;
  word-break: break-all;
}

.result-buttons {
  display: flex;
  gap: 12px;
  justify-content: center;
}

/* 操作按钮 */
.scanner-actions {
  padding: 20px;
  display: flex;
  gap: 12px;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.8);
}

.action-button {
  min-width: 120px;
}

/* 隐藏的文件输入 */
.file-input {
  display: none;
}

/* 响应式 */
@media (max-width: 768px) {
  .scanner-frame {
    width: 240px;
    height: 240px;
  }
  
  .scanner-header {
    height: 48px;
    padding: 0 16px;
  }
  
  .header-title {
    font-size: 16px;
  }
  
  .back-icon,
  .album-icon {
    font-size: 20px;
  }
}
</style>