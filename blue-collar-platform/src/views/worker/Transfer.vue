<template>
  <div class="worker-transfer">
    <BackButton />
    <!-- 页面标题 -->
    <div class="page-header">
      <h2>调岗申请</h2>
      <el-button type="primary" @click="goToTransferRecord" size="small" class="record-button">调岗记录</el-button>
    </div>
    
    <!-- 调岗申请表单 -->
    <div class="transfer-form-section">
      <div class="transfer-form-card">
        <div class="card-header">
          <h3 class="card-title">提交调岗申请</h3>
          <div class="card-icon">
            <el-icon size="24"><Grid /></el-icon>
          </div>
        </div>
        
        <el-form :model="transferForm" label-position="top" class="transfer-form">
          <!-- 原岗位信息 -->
          <div class="form-section">
            <h4 class="section-title">原岗位信息</h4>
            <div class="form-row">
              <el-form-item label="原部门" class="form-item">
                <el-input v-model="transferForm.originalDepartment" placeholder="请输入原部门" size="large" class="form-input" readonly />
              </el-form-item>
              <el-form-item label="原岗位" class="form-item">
                <el-input v-model="transferForm.originalPosition" placeholder="请输入原岗位" size="large" class="form-input" readonly />
              </el-form-item>
            </div>
            <div class="form-row">
              <el-form-item label="原岗位直属组长" class="form-item">
                <el-input v-model="transferForm.originalTeamLeader" placeholder="请输入原岗位直属组长" size="large" class="form-input" readonly />
              </el-form-item>
            </div>
          </div>
          
          <!-- 目标岗位信息 -->
          <div class="form-section">
            <h4 class="section-title">目标岗位信息</h4>
            <div class="form-row">
              <el-form-item label="目标部门" class="form-item">
                <el-select v-model="transferForm.targetDepartment" placeholder="请选择目标部门" size="large" class="form-select" @change="updateTargetTeamLeaders">
                  <el-option label="组装车间" value="assembly" />
                  <el-option label="质检部门" value="quality" />
                  <el-option label="仓库管理" value="warehouse" />
                  <el-option label="生产管理" value="production" />
                  <el-option label="其他" value="other" />
                </el-select>
              </el-form-item>
              <el-form-item label="目标岗位" class="form-item">
                <el-select v-model="transferForm.targetPosition" placeholder="请选择目标岗位" size="large" class="form-select">
                  <el-option label="流水线操作员" value="operator" />
                  <el-option label="质检员" value="inspector" />
                  <el-option label="仓库管理员" value="warehouse_keeper" />
                  <el-option label="组长" value="team_leader" />
                  <el-option label="其他" value="other" />
                </el-select>
              </el-form-item>
            </div>
            <div class="form-row">
              <el-form-item label="目标岗位直属组长" class="form-item">
                <el-input v-model="transferForm.targetTeamLeader" placeholder="请选择目标部门" size="large" class="form-input" readonly />
              </el-form-item>
            </div>
          </div>
          
          <!-- 调岗原因 -->
          <el-form-item label="调岗原因" class="form-item">
            <el-input
              v-model="transferForm.reason"
              type="textarea"
              placeholder="请详细说明调岗原因"
              :rows="4"
              size="large"
              class="form-textarea"
            />
          </el-form-item>
          
          <!-- 调岗时间 -->
          <el-form-item label="期望调岗时间" class="form-item">
            <el-date-picker
              v-model="transferForm.expectedDate"
              type="datetime"
              placeholder="选择期望调岗时间"
              style="width: 100%"
              size="large"
              class="form-date"
            />
          </el-form-item>
          
          <!-- 附件 -->
          <el-form-item label="相关证明" class="form-item">
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
          
          <!-- 按钮组 -->
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
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElIcon } from 'element-plus'
import BackButton from '../../components/BackButton.vue'
import { Grid, Check, Refresh } from '@element-plus/icons-vue'

const router = useRouter()

// 调岗表单
interface TransferForm {
  originalDepartment: string
  originalPosition: string
  originalTeamLeader: string
  targetDepartment: 'assembly' | 'quality' | 'warehouse' | 'production' | 'other' | ''
  targetPosition: string
  targetTeamLeader: string
  reason: string
  expectedDate: string | Date
  attachments: any[]
}

const transferForm = ref<TransferForm>({
  originalDepartment: '',
  originalPosition: '',
  originalTeamLeader: '',
  targetDepartment: '',
  targetPosition: '',
  targetTeamLeader: '',
  reason: '',
  expectedDate: '',
  attachments: []
})

// 部门对应的直属组长
const departmentTeamLeaders = {
  assembly: '李四',
  quality: '赵六',
  warehouse: '孙八',
  production: '周九',
  other: ''
}

// 监听目标部门变化，自动填充直属组长
const updateTargetTeamLeaders = () => {
  const department = transferForm.value.targetDepartment
  if (department && departmentTeamLeaders[department as keyof typeof departmentTeamLeaders]) {
    transferForm.value.targetTeamLeader = departmentTeamLeaders[department as keyof typeof departmentTeamLeaders]
  } else {
    transferForm.value.targetTeamLeader = ''
  }
}

// 处理文件选择
const handleFileChange = (file: any) => {
  console.log('文件选择:', file)
  transferForm.value.attachments.push(file.raw)
}

// 提交申请
const handleSubmit = async () => {
  try {
    // 模拟异步请求
    setTimeout(() => {
      // 重置表单
      resetForm()
      // 提示成功
      ElMessage.success('调岗申请提交成功')
    }, 500)
  } catch (error) {
    console.error('提交失败:', error)
    ElMessage.error('提交失败，请重试')
  }
}

// 重置表单
const resetForm = () => {
  transferForm.value = {
    originalDepartment: transferForm.value.originalDepartment,
    originalPosition: transferForm.value.originalPosition,
    originalTeamLeader: transferForm.value.originalTeamLeader,
    targetDepartment: '',
    targetPosition: '',
    targetTeamLeader: '',
    reason: '',
    expectedDate: '',
    attachments: []
  }
}

// 获取用户当前岗位信息
const getUserPositionInfo = () => {
  // 模拟获取用户当前岗位信息
  setTimeout(() => {
    transferForm.value.originalDepartment = '组装车间'
    transferForm.value.originalPosition = '流水线操作员'
    transferForm.value.originalTeamLeader = '张三'
  }, 300)
}

// 跳转到调岗记录页面
const goToTransferRecord = () => {
  router.push('/worker/transfer-record')
}

// 页面加载时获取数据
onMounted(() => {
  getUserPositionInfo()
})
</script>

<style scoped>
/* 全局样式 */
.worker-transfer {
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
.transfer-form-section {
  padding: 20px 15px;
}

/* 表单卡片 */
.transfer-form-card {
  background: white;
  border-radius: 20px;
  padding: 25px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  position: relative;
  overflow: hidden;
}

.transfer-form-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 4px;
  background: linear-gradient(90deg, #667eea, #764ba2);
}

.transfer-form-card:hover {
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
.transfer-form {
  width: 100%;
}

/* 表单部分 */
.form-section {
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 1px solid #f0f0f0;
}

.form-section:last-child {
  border-bottom: none;
  margin-bottom: 20px;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #667eea;
  margin: 0 0 15px 0;
  padding-left: 10px;
  border-left: 4px solid #667eea;
}

/* 表单行 */
.form-row {
  display: flex;
  gap: 15px;
  margin-bottom: 15px;
}

.form-row:last-child {
  margin-bottom: 0;
}

/* 表单项目 */
.form-item {
  flex: 1;
  margin-bottom: 15px;
  transition: all 0.3s ease;
}

.form-item:last-child {
  margin-bottom: 0;
}

.el-form-item__label {
  font-size: 14px;
  font-weight: 500;
  color: #666;
  margin-bottom: 8px;
  display: block;
}

/* 表单元素 */
.form-input,
.form-select {
  border-radius: 12px !important;
  border: 2px solid #f0f0f0 !important;
  transition: all 0.3s ease !important;
  padding: 12px 16px !important;
}

.form-input:focus,
.form-select:focus {
  border-color: #667eea !important;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1) !important;
}

.form-textarea {
  min-height: 120px !important;
  resize: none;
  border-radius: 12px !important;
  border: 2px solid #f0f0f0 !important;
  transition: all 0.3s ease !important;
  padding: 12px 16px !important;
}

.form-textarea:focus {
  border-color: #667eea !important;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1) !important;
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
  font-size: 16px;
}

/* 响应式设计 */
@media screen and (max-width: 768px) {
  .page-header {
    padding: 16px 15px;
  }
  
  .page-header h2 {
    font-size: 18px;
  }
  
  .transfer-form-section {
    padding: 16px 12px;
  }
  
  .transfer-form-card {
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
  
  .form-section {
    margin-bottom: 20px;
    padding-bottom: 15px;
  }
  
  .section-title {
    font-size: 14px;
    margin-bottom: 12px;
  }
  
  .form-row {
    flex-direction: column;
    gap: 10px;
  }
  
  .form-item {
    margin-bottom: 12px;
  }
  
  .el-form-item__label {
    font-size: 13px;
  }
  
  .form-input,
  .form-select,
  .form-textarea {
    padding: 10px 14px !important;
  }
  
  .upload-button {
    padding: 12px 14px;
    font-size: 12px;
  }
  
  .submit-button,
  .reset-button {
    padding: 12px 16px;
    font-size: 13px;
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
  
  .transfer-form-section {
    padding: 12px 10px;
  }
  
  .transfer-form-card {
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
    margin-bottom: 10px;
  }
  
  .submit-button,
  .reset-button {
    padding: 10px 14px;
    font-size: 12px;
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

.transfer-form-card {
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
</style>