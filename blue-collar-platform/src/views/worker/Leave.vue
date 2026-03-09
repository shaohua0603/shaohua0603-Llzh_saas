<template>
  <div class="worker-leave">
    <BackButton />
    <!-- 页面标题 -->
    <div class="page-header">
      <h2>请假申请</h2>
      <el-button type="primary" @click="goToLeaveRecord" size="small" class="record-button">请假记录</el-button>
    </div>
    
    <!-- 请假申请表单 -->
    <div class="leave-form-section">
      <div class="leave-form-card">
        <div class="card-header">
          <h3 class="card-title">提交请假申请</h3>
          <div class="card-icon">
            <el-icon size="24"><Timer /></el-icon>
          </div>
        </div>
        
        <el-form :model="leaveForm" label-position="top" class="leave-form">
          <el-form-item label="工厂" class="form-item">
            <el-select v-model="leaveForm.factory" placeholder="请选择工厂" size="large" class="form-select">
              <el-option label="工厂A" value="factoryA" />
              <el-option label="工厂B" value="factoryB" />
              <el-option label="工厂C" value="factoryC" />
            </el-select>
          </el-form-item>
          
          <el-form-item label="区域" class="form-item">
            <el-select v-model="leaveForm.area" placeholder="请选择区域" size="large" class="form-select">
              <el-option label="区域1" value="area1" />
              <el-option label="区域2" value="area2" />
              <el-option label="区域3" value="area3" />
            </el-select>
          </el-form-item>
          
          <el-form-item label="产线" class="form-item">
            <el-select v-model="leaveForm.productionLine" placeholder="请选择产线" size="large" class="form-select">
              <el-option label="产线1" value="line1" />
              <el-option label="产线2" value="line2" />
              <el-option label="产线3" value="line3" />
            </el-select>
          </el-form-item>
          
          <el-form-item label="请假类型" class="form-item">
            <el-select v-model="leaveForm.type" placeholder="请选择请假类型" size="large" class="form-select">
              <el-option label="事假" value="personal" />
              <el-option label="病假" value="sick" />
              <el-option label="婚假" value="marriage" />
              <el-option label="产假" value="maternity" />
              <el-option label="其他" value="other" />
            </el-select>
          </el-form-item>
          
          <el-form-item label="开始日期" class="form-item">
            <el-date-picker
              v-model="leaveForm.startDate"
              type="datetime"
              placeholder="选择开始时间"
              style="width: 100%"
              size="large"
              class="form-date"
            />
          </el-form-item>
          
          <el-form-item label="结束日期" class="form-item">
            <el-date-picker
              v-model="leaveForm.endDate"
              type="datetime"
              placeholder="选择结束时间"
              style="width: 100%"
              size="large"
              class="form-date"
            />
          </el-form-item>
          
          <el-form-item label="请假原因" class="form-item">
            <el-input
              v-model="leaveForm.reason"
              type="textarea"
              placeholder="请输入请假原因"
              :rows="4"
              size="large"
              class="form-textarea"
            />
          </el-form-item>
          
          <el-form-item label="附件" class="form-item">
            <el-upload
              class="upload-demo"
              action="#"
              :auto-upload="false"
              :on-change="handleFileChange"
              :limit="3"
            >
              <el-button type="primary" size="large" class="upload-button">选择文件</el-button>
              <template #tip>
                <div class="el-upload__tip upload-tip">
                  最多上传3个文件，支持jpg/png/pdf格式
                </div>
              </template>
            </el-upload>
          </el-form-item>
          
          <el-form-item class="form-item buttons-item">
            <div class="form-buttons">
              <el-button type="primary" @click="handleSubmit" size="large" class="submit-button">
                <el-icon class="button-icon"><Check /></el-icon>
                提交申请
              </el-button>
              <el-button @click="resetForm" size="large" class="reset-button">
                <el-icon class="button-icon"><Refresh /></el-icon>
                重置
              </el-button>
            </div>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElIcon } from 'element-plus'
import BackButton from '../../components/BackButton.vue'
import { Timer, Check, Refresh } from '@element-plus/icons-vue'

const router = useRouter()

// 请假表单
const leaveForm = ref({
  factory: '',
  area: '',
  productionLine: '',
  type: '',
  startDate: '',
  endDate: '',
  reason: '',
  attachments: []
})

// 处理文件选择
const handleFileChange = (file: any) => {
  console.log('文件选择:', file)
  leaveForm.value.attachments.push(file.raw)
}

// 提交申请
const handleSubmit = async () => {
  try {
    // 模拟异步请求
    setTimeout(() => {
      // 重置表单
      resetForm()
      // 提示成功
      ElMessage.success('请假申请提交成功')
    }, 500)
  } catch (error) {
    console.error('提交失败:', error)
    ElMessage.error('提交失败，请重试')
  }
}

// 重置表单
const resetForm = () => {
  leaveForm.value = {
    factory: '',
    area: '',
    productionLine: '',
    type: '',
    startDate: '',
    endDate: '',
    reason: '',
    attachments: []
  }
}

// 跳转到请假记录页面
const goToLeaveRecord = () => {
  router.push('/worker/leave-record')
}
</script>

<style scoped>
/* 全局样式 */
.worker-leave {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding-bottom: 30px;
}

/* 页面头部 */
.page-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px 15px;
  color: white;
  position: sticky;
  top: 0;
  z-index: 10;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.page-header h2 {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}

.record-button {
  background-color: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.3);
  color: white;
  font-size: 12px;
  padding: 6px 12px;
  border-radius: 20px;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
}

.record-button:hover {
  background-color: rgba(255, 255, 255, 0.3);
  border-color: rgba(255, 255, 255, 0.4);
}

/* 表单区域 */
.leave-form-section {
  padding: 20px 15px;
}

/* 表单卡片 */
.leave-form-card {
  background: white;
  border-radius: 20px;
  padding: 25px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  position: relative;
  overflow: hidden;
}

.leave-form-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 4px;
  background: linear-gradient(90deg, #667eea, #764ba2);
}

.leave-form-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.12);
}

/* 卡片头部 */
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.card-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0;
  display: flex;
  align-items: center;
}

.card-icon {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

/* 表单样式 */
.leave-form {
  width: 100%;
}

.form-item {
  margin-bottom: 25px;
  transition: all 0.3s ease;
}

.el-form-item__label {
  font-size: 14px;
  font-weight: 500;
  color: #666;
  margin-bottom: 8px;
  display: block;
}

/* 表单元素 */
.form-select,
.form-date,
.form-textarea {
  border-radius: 12px !important;
  border: 2px solid #f0f0f0 !important;
  transition: all 0.3s ease !important;
  padding: 12px 16px !important;
}

.form-select:focus,
.form-date:focus,
.form-textarea:focus {
  border-color: #667eea !important;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1) !important;
}

.form-textarea {
  min-height: 120px !important;
  resize: none;
}

/* 上传按钮 */
.upload-button {
  width: 100%;
  padding: 14px 20px;
  border-radius: 12px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.upload-button:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 16px rgba(102, 126, 234, 0.4);
}

.upload-tip {
  font-size: 12px;
  color: #999;
  margin-top: 8px;
  text-align: center;
}

/* 按钮组 */
.buttons-item {
  margin-top: 30px;
  margin-bottom: 10px;
}

.form-buttons {
  display: flex;
  gap: 12px;
  align-items: center;
}

.submit-button {
  flex: 2;
  padding: 14px 20px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  color: white;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.reset-button {
  flex: 1;
  padding: 14px 20px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 500;
  background-color: #f5f5f5;
  border: 2px solid #e0e0e0;
  color: #666;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.submit-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
}

.reset-button:hover {
  background-color: #e8e8e8;
  border-color: #d0d0d0;
  transform: translateY(-1px);
}

.button-icon {
  font-size: 18px;
}

/* 响应式设计 */
@media screen and (max-width: 768px) {
  .page-header {
    padding: 16px 15px;
  }
  
  .page-header h2 {
    font-size: 18px;
  }
  
  .leave-form-section {
    padding: 16px 12px;
  }
  
  .leave-form-card {
    padding: 20px;
    border-radius: 16px;
  }
  
  .card-header {
    margin-bottom: 20px;
  }
  
  .card-title {
    font-size: 16px;
  }
  
  .card-icon {
    width: 40px;
    height: 40px;
  }
  
  .form-item {
    margin-bottom: 20px;
  }
  
  .upload-button {
    padding: 12px 16px;
    font-size: 13px;
  }
  
  .submit-button,
  .reset-button {
    padding: 14px 18px;
    font-size: 15px;
  }
}

/* 小屏幕手机适配 */
@media screen and (max-width: 480px) {
  .page-header {
    padding: 14px 12px;
  }
  
  .page-header h2 {
    font-size: 17px;
  }
  
  .leave-form-section {
    padding: 12px 10px;
  }
  
  .leave-form-card {
    padding: 16px;
    border-radius: 14px;
  }
  
  .card-title {
    font-size: 15px;
  }
  
  .card-icon {
    width: 36px;
    height: 36px;
  }
  
  .form-item {
    margin-bottom: 18px;
  }
  
  .el-form-item__label {
    font-size: 13px;
  }
  
  .form-select,
  .form-date,
  .form-textarea {
    padding: 10px 14px !important;
  }
  
  .upload-button {
    padding: 12px 14px;
    font-size: 12px;
  }
  
  .submit-button,
  .reset-button {
    padding: 13px 16px;
    font-size: 14px;
  }
  
  .button-icon {
    font-size: 16px;
  }
}

/* 超小屏幕适配 */
@media screen and (max-width: 375px) {
  .page-header {
    padding: 12px 10px;
  }
  
  .page-header h2 {
    font-size: 16px;
  }
  
  .leave-form-card {
    padding: 14px;
    border-radius: 12px;
  }
  
  .card-title {
    font-size: 14px;
  }
  
  .form-item {
    margin-bottom: 16px;
  }
  
  .submit-button,
  .reset-button {
    padding: 12px 14px;
    font-size: 13px;
  }
}

/* 动画效果 */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.leave-form-card {
  animation: fadeInUp 0.5s ease-out;
}

.form-item {
  animation: fadeInUp 0.5s ease-out;
}

.form-item:nth-child(1) { animation-delay: 0.1s; }
.form-item:nth-child(2) { animation-delay: 0.2s; }
.form-item:nth-child(3) { animation-delay: 0.3s; }
.form-item:nth-child(4) { animation-delay: 0.4s; }
.form-item:nth-child(5) { animation-delay: 0.5s; }
.form-item:nth-child(6) { animation-delay: 0.6s; }

/* 滚动条样式 */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style>