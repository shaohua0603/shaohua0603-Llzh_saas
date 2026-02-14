<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { ElMessage, ElMessageBox, ElIcon, ElInput, ElRadio, ElRadioGroup, ElButton, ElUpload } from 'element-plus'
import { useRouter } from 'vue-router'
import BackButton from '../../components/BackButton.vue'
import { ChatLineSquare, CircleCheck, Warning, Message, Paperclip, Delete } from '@element-plus/icons-vue'

const router = useRouter()
const loading = ref(false)
const isSubmitting = ref(false)

// 投诉/建议类型
const complaintType = ref('')
const typeOptions = [
  { label: '工作投诉', value: 'work_complaint', icon: Warning, color: '#ff7875' },
  { label: '工作建议', value: 'work_suggestion', icon: Message, color: '#67c23a' },
  { label: '使用意见反馈', value: 'platform_feedback', icon: ChatLineSquare, color: '#409eff' }
]

// 表单数据
const formData = ref({
  title: '',
  content: '',
  attachments: []
})

// 表单验证
const isFormValid = computed(() => {
  return complaintType.value && formData.value.title && formData.value.content
})

// 获取类型标签
const getTypeLabel = (value: string) => {
  const option = typeOptions.find(opt => opt.value === value)
  return option ? option.label : ''
}



// 获取类型图标
const getTypeIcon = (value: string) => {
  const option = typeOptions.find(opt => opt.value === value)
  return option ? option.icon : ChatLineSquare
}

// 获取类型颜色
const getTypeColor = (value: string) => {
  const option = typeOptions.find(opt => opt.value === value)
  return option ? option.color : '#409eff'
}

// 提交投诉/建议
const submitComplaint = () => {
  if (!isFormValid.value) {
    ElMessage.warning('请填写完整的投诉/建议信息')
    return
  }

  isSubmitting.value = true
  
  ElMessageBox.confirm('确定要提交' + getTypeLabel(complaintType.value) + '吗？', '提交确认', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
    customClass: 'confirm-dialog'
  }).then(() => {
    // 模拟提交请求
    setTimeout(() => {
      ElMessage.success({
        message: getTypeLabel(complaintType.value) + '提交成功，等待处理',
        duration: 3000,
        showClose: true
      })
      isSubmitting.value = false
      // 重置表单
      resetForm()
      // 返回上一页
      router.back()
    }, 1500)
  }).catch(() => {
    isSubmitting.value = false
    // 取消提交
  })
}

// 重置表单
const resetForm = () => {
  complaintType.value = ''
  formData.value = {
    title: '',
    content: '',
    attachments: []
  }
}

// 移除附件
const removeAttachment = (index: number) => {
  formData.value.attachments.splice(index, 1)
  ElMessage.success('附件已移除')
}

// 监听附件变化
const handleFileChange = (file: any) => {
  formData.value.attachments.push(file.raw)
  ElMessage.success('附件添加成功')
}

// 监听文件超出限制
const handleFileExceed = () => {
  ElMessage.warning('最多只能上传3个附件')
}

// 监听投诉类型变化，添加过渡效果
watch(complaintType, (newValue) => {
  if (newValue) {
    const typeElement = document.querySelector('.type-item.is-checked')
    if (typeElement) {
      typeElement.classList.add('type-item-active')
      setTimeout(() => {
        typeElement.classList.remove('type-item-active')
      }, 300)
    }
  }
})
</script>

<template>
  <div class="complaint-suggestion">
    <!-- 页面标题 -->
    <div class="page-header">
      <div class="header-left">
        <BackButton class="back-button" />
        <div class="title-container">
          <div class="title-with-icon">
            <el-icon :size="24" class="title-icon">
              <ChatLineSquare />
            </el-icon>
            <h1 class="page-title">投诉/建议</h1>
          </div>
          <p class="page-subtitle">请选择类型并详细描述您的问题或建议</p>
        </div>
      </div>
    </div>
    
    <!-- 表单内容 -->
    <div class="form-content">
      <!-- 类型选择 -->
      <div class="form-section">
        <div class="section-header">
          <h2 class="section-title">选择类型</h2>
          <p class="section-description">请选择您要提交的内容类型</p>
        </div>
        <div class="type-selector">
          <div class="type-group">
            <div 
              v-for="option in typeOptions" 
              :key="option.value"
              class="type-item"
              :class="{ 'is-checked': complaintType === option.value }"
              @click="complaintType = option.value"
            >
              <div class="type-radio">
                <div class="radio-circle" :class="{ 'checked': complaintType === option.value }">
                  <div v-if="complaintType === option.value" class="radio-dot"></div>
                </div>
              </div>
              <div class="type-content">
                <div class="type-icon-container" :style="{ backgroundColor: option.color + '20' }">
                  <el-icon :size="24" :style="{ color: option.color }">
                    <component :is="option.icon" />
                  </el-icon>
                </div>
                <div class="type-info">
                  <div class="type-label">{{ option.label }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 表单填写 -->
      <div class="form-section">
        <div class="section-header">
          <h2 class="section-title">详细信息</h2>
          <p class="section-description">请提供详细的信息，以便我们更好地处理您的请求</p>
        </div>
        
        <div class="form-card">
          <!-- 标题输入 -->
          <div class="form-item">
            <label class="form-label">
              <span class="label-text">标题</span>
              <span class="required-mark">*</span>
            </label>
            <el-input 
              v-model="formData.title" 
              placeholder="请输入标题" 
              class="form-input"
              :class="{ 'form-input-focus': formData.title }"
            />
          </div>
          
          <!-- 内容输入 -->
          <div class="form-item">
            <label class="form-label">
              <span class="label-text">内容</span>
              <span class="required-mark">*</span>
            </label>
            <el-input 
              v-model="formData.content" 
              type="textarea" 
              :rows="5" 
              placeholder="请详细描述您的投诉/建议..." 
              class="form-textarea"
              :class="{ 'form-textarea-focus': formData.content }"
            />
          </div>
          
          <!-- 附件上传 -->
          <div class="form-item">
            <label class="form-label">
              <span class="label-text">附件</span>
              <span class="optional-mark">（可选）</span>
            </label>
            <div class="attachment-section">
              <el-upload
                class="upload-button"
                action="#"
                :auto-upload="false"
                :on-change="handleFileChange"
                :limit="3"
                :on-exceed="handleFileExceed"
                :show-file-list="false"
              >
                <el-button 
                  type="primary" 
                  :icon="Paperclip" 
                  class="upload-btn"
                  :disabled="formData.attachments.length >= 3"
                >
                  选择文件
                </el-button>
              </el-upload>
              <p class="upload-tip">支持上传图片、PDF等文件，最多3个</p>
              
              <!-- 附件列表 -->
              <div v-if="formData.attachments.length > 0" class="attachment-list">
                <div class="attachment-header">
                  <el-icon :size="16" class="attachment-header-icon">
                    <Paperclip />
                  </el-icon>
                  <span class="attachment-header-text">已添加 {{ formData.attachments.length }} 个附件</span>
                </div>
                <div 
                  v-for="(file, index) in formData.attachments" 
                  :key="index" 
                  class="attachment-item"
                >
                  <div class="attachment-info">
                    <el-icon :size="16" class="attachment-item-icon">
                      <Paperclip />
                    </el-icon>
                    <span class="attachment-name">{{ file.name }}</span>
                  </div>
                  <el-button 
                    type="danger" 
                    :icon="Delete" 
                    size="small" 
                    circle 
                    class="attachment-remove"
                    @click="removeAttachment(index)"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 提交按钮 -->
      <div class="submit-section">
        <el-button 
          type="info" 
          class="cancel-button" 
          @click="router.back()"
          :disabled="isSubmitting"
          :loading="isSubmitting"
        >
          取消
        </el-button>
        <el-button 
          type="primary" 
          class="submit-button" 
          @click="submitComplaint" 
          :disabled="!isFormValid || isSubmitting"
          :loading="isSubmitting"
        >
          <template v-if="!isSubmitting">
            <el-icon :size="18" class="submit-icon">
              <CircleCheck />
            </el-icon>
            提交
          </template>
          <template v-else>
            提交中...
          </template>
        </el-button>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 全局样式 */
.complaint-suggestion {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding-bottom: 30px;
  font-family: 'PingFang SC', 'Helvetica Neue', Arial, sans-serif;
}

/* 页面标题 */
.page-header {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  padding: 20px 30px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.08);
}

.header-left {
  display: flex;
  align-items: flex-start;
  gap: 16px;
}

.back-button {
  margin-top: 4px;
}

.title-container {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.title-with-icon {
  display: flex;
  align-items: center;
  gap: 12px;
}

.title-icon {
  color: #667eea;
}

.page-title {
  margin: 0;
  font-size: 24px;
  font-weight: 600;
  color: #333;
}

.page-subtitle {
  margin: 0;
  font-size: 14px;
  color: #666;
  opacity: 0.8;
}

/* 表单内容 */
.form-content {
  max-width: 800px;
  margin: 30px auto;
  padding: 0 20px;
}

/* 表单区块 */
.form-section {
  margin-bottom: 40px;
  animation: fadeInUp 0.6s ease-out;
}

.section-header {
  margin-bottom: 20px;
  text-align: center;
}

.section-title {
  margin: 0 0 8px 0;
  font-size: 20px;
  font-weight: 600;
  color: #fff;
}

.section-description {
  margin: 0;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.8);
}

/* 类型选择器 */
.type-selector {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 24px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.type-group {
  display: flex;
  flex-direction: row;
  gap: 16px;
  justify-content: center;
  flex-wrap: wrap;
}

.type-item {
  flex: 1;
  min-width: 200px;
  max-width: 240px;
  border: 2px solid #f0f0f0;
  border-radius: 16px;
  padding: 24px 20px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background: #fff;
  cursor: pointer;
  overflow: visible;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.type-item:hover {
  border-color: #e1e7ff;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.15);
}

.type-item.is-checked {
  border-color: #667eea;
  background: #f8f9ff;
  box-shadow: 0 8px 24px rgba(102, 126, 234, 0.2);
}

.type-item-active {
  animation: typeItemActive 0.3s ease-out;
}

.type-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 12px;
  text-align: center;
}

.type-icon-container {
  width: 56px;
  height: 56px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all 0.3s ease;
}

.type-item.is-checked .type-icon-container {
  transform: scale(1.05);
  box-shadow: 0 4px 16px rgba(102, 126, 234, 0.3);
}

.type-info {
  width: 100%;
}

.type-label {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin: 0;
}

/* 自定义单选按钮样式 */
.type-radio {
  position: absolute;
  top: 12px;
  right: 12px;
  z-index: 1;
}

.radio-circle {
  width: 20px;
  height: 20px;
  border: 2px solid #dcdfe6;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  background-color: #fff;
}

.radio-circle.checked {
  border-color: #667eea;
  background-color: #667eea;
}

.radio-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: #fff;
  transition: all 0.3s ease;
}

/* 增强选中效果 */
.type-item.is-checked {
  border-color: #667eea;
  background: linear-gradient(135deg, #f8f9ff 0%, #eef2ff 100%);
  box-shadow: 0 10px 28px rgba(102, 126, 234, 0.25);
  transform: translateY(-3px);
}

/* 增强悬停效果 */
.type-item:hover {
  border-color: #e1e7ff;
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(102, 126, 234, 0.18);
  background: #fafbff;
}

/* 确保类型选择项可点击 */
.type-item {
  cursor: pointer;
  user-select: none;
}



/* 表单卡片 */
.form-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 30px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

/* 表单项 */
.form-item {
  margin-bottom: 28px;
}

.form-label {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 12px;
  font-size: 16px;
  font-weight: 500;
  color: #333;
}

.required-mark {
  color: #ff4d4f;
  font-size: 16px;
}

.optional-mark {
  color: #999;
  font-size: 14px;
}

/* 输入框样式 */
.form-input,
.form-textarea {
  width: 100%;
  border-radius: 12px;
  border: 2px solid #eaeaea;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-size: 16px;
}

.form-input:focus,
.form-textarea:focus {
  border-color: #667eea;
  box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);
}

.form-input-focus,
.form-textarea-focus {
  border-color: #667eea;
}

.form-textarea {
  resize: none;
  min-height: 160px;
}

/* 附件部分 */
.attachment-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.upload-button {
  display: inline-block;
}

.upload-btn {
  border-radius: 8px;
  transition: all 0.3s ease;
}

.upload-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.upload-tip {
  margin: 0;
  font-size: 14px;
  color: #999;
}

.attachment-list {
  background: #f8f9ff;
  border: 1px solid #e1e7ff;
  border-radius: 12px;
  padding: 16px;
  margin-top: 8px;
}

.attachment-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
  padding-bottom: 12px;
  border-bottom: 1px solid #e1e7ff;
}

.attachment-header-icon {
  color: #667eea;
}

.attachment-header-text {
  font-size: 14px;
  font-weight: 500;
  color: #333;
}

.attachment-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px;
  background: #fff;
  border-radius: 8px;
  margin-bottom: 8px;
  transition: all 0.2s ease;
}

.attachment-item:hover {
  transform: translateX(4px);
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.1);
}

.attachment-item:last-child {
  margin-bottom: 0;
}

.attachment-info {
  display: flex;
  align-items: center;
  gap: 10px;
  flex: 1;
}

.attachment-item-icon {
  color: #667eea;
  flex-shrink: 0;
}

.attachment-name {
  font-size: 14px;
  color: #333;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.attachment-remove {
  flex-shrink: 0;
  transition: all 0.2s ease;
}

.attachment-remove:hover {
  transform: scale(1.1);
}

/* 提交按钮区域 */
.submit-section {
  display: flex;
  gap: 16px;
  margin-top: 40px;
  align-items: center;
  justify-content: center;
}

.submit-button,
.cancel-button {
  padding: 0 32px;
  height: 56px;
  border-radius: 16px;
  font-size: 16px;
  font-weight: 600;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  min-width: 140px;
}

.submit-button {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  box-shadow: 0 4px 16px rgba(102, 126, 234, 0.3);
}

.submit-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(102, 126, 234, 0.4);
}

.submit-button:active:not(:disabled) {
  transform: translateY(0);
}

.submit-icon {
  margin-right: 8px;
}

.cancel-button {
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  color: #495057;
}

.cancel-button:hover:not(:disabled) {
  background: #e9ecef;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

/* 动画效果 */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes typeItemActive {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.02);
  }
  100% {
    transform: scale(1);
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .complaint-suggestion {
    padding-bottom: 20px;
  }
  
  .page-header {
    padding: 16px 20px;
  }
  
  .header-left {
    gap: 12px;
  }
  
  .title-icon {
    font-size: 20px;
  }
  
  .page-title {
    font-size: 20px;
  }
  
  .page-subtitle {
    font-size: 12px;
  }
  
  .form-content {
    padding: 0 16px;
    margin-top: 20px;
  }
  
  .form-section {
    margin-bottom: 30px;
  }
  
  .section-title {
    font-size: 18px;
  }
  
  .section-description {
    font-size: 12px;
  }
  
  .type-selector {
    padding: 20px;
    border-radius: 16px;
  }
  
  .type-group {
    flex-direction: column;
    gap: 12px;
  }
  
  .type-item {
    min-width: 100%;
    max-width: 100%;
    padding: 20px 16px;
  }
  
  .type-content {
    flex-direction: row;
    text-align: left;
    gap: 16px;
  }
  
  .type-icon-container {
    width: 56px;
    height: 56px;
    border-radius: 16px;
    margin-bottom: 0;
  }
  
  .type-info {
    align-items: flex-start;
  }
  
  .type-label {
    font-size: 17px;
  }
  
  .form-card {
    padding: 24px;
    border-radius: 16px;
  }
  
  .form-item {
    margin-bottom: 24px;
  }
  
  .form-label {
    font-size: 15px;
  }
  
  .form-input,
  .form-textarea {
    font-size: 15px;
  }
  
  .form-textarea {
    min-height: 140px;
  }
  
  .submit-section {
    flex-direction: column;
    margin-top: 32px;
    gap: 12px;
  }
  
  .submit-button,
  .cancel-button {
    width: 100%;
    max-width: 300px;
    height: 52px;
  }
  
  .attachment-list {
    padding: 12px;
  }
  
  .attachment-item {
    padding: 10px;
  }
  
  .attachment-name {
    font-size: 13px;
  }
}

@media (max-width: 480px) {
  .page-header {
    padding: 14px 16px;
  }
  
  .page-title {
    font-size: 18px;
  }
  
  .form-content {
    padding: 0 12px;
  }
  
  .type-selector {
    padding: 16px;
  }
  
  .type-item {
    padding: 16px 14px;
  }
  
  .type-content {
    gap: 12px;
  }
  
  .type-icon-container {
    width: 48px;
    height: 48px;
    border-radius: 12px;
  }
  
  .type-label {
    font-size: 16px;
  }
  
  .form-card {
    padding: 20px;
  }
  
  .submit-button,
  .cancel-button {
    height: 48px;
    font-size: 15px;
  }
}

/* 确认对话框样式 */
:deep(.confirm-dialog) {
  border-radius: 16px;
  overflow: hidden;
}

:deep(.confirm-dialog .el-dialog__header) {
  background: #f8f9ff;
  border-bottom: 1px solid #e1e7ff;
}

:deep(.confirm-dialog .el-dialog__title) {
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

:deep(.confirm-dialog .el-dialog__body) {
  padding: 24px;
  font-size: 16px;
  color: #666;
}

:deep(.confirm-dialog .el-dialog__footer) {
  padding: 16px 24px;
  border-top: 1px solid #f0f0f0;
}

:deep(.confirm-dialog .el-button) {
  padding: 0 24px;
  height: 40px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
}

:deep(.confirm-dialog .el-button--primary) {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
}
</style>