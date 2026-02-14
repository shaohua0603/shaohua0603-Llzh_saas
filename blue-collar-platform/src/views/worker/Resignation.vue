<template>
  <div class="worker-resignation">
    <BackButton />
    <!-- 页面标题 -->
    <div class="page-header">
      <h2>离职申请</h2>
    </div>
    
    <!-- 离职申请表单 -->
    <div class="resignation-form-section">
      <div class="resignation-form-card">
        <h3 class="card-title">提交离职申请</h3>
        <el-form :model="resignationForm" label-width="80px">
          <el-form-item label="离职类型">
            <el-select v-model="resignationForm.type" placeholder="请选择离职类型">
            <el-option label="主动离职" value="voluntary"></el-option>
            <el-option label="劝退" value="persuaded"></el-option>
            <el-option label="开除" value="dismissed"></el-option>
            <el-option label="自离职" value="absconded"></el-option>
          </el-select>
          </el-form-item>
          <el-form-item label="离职日期">
            <el-date-picker v-model="resignationForm.resignationDate" type="date" placeholder="选择离职日期" style="width: 100%"></el-date-picker>
          </el-form-item>
          <el-form-item label="离职原因类型">
            <el-select v-model="resignationForm.reasonType" placeholder="请选择离职原因类型" style="width: 100%">
              <el-option label="同事关系" value="colleague"></el-option>
              <el-option label="领导原因" value="leader"></el-option>
              <el-option label="收入原因" value="income"></el-option>
              <el-option label="宿舍原因" value="dormitory"></el-option>
              <el-option label="其他" value="other"></el-option>
            </el-select>
            <p class="confidentiality-tip">您的离职原因会我们为您严格保密</p>
          </el-form-item>
          <el-form-item label="离职原因">
            <el-input v-model="resignationForm.reason" type="textarea" placeholder="请输入离职原因" :rows="4"></el-input>
          </el-form-item>
          <el-form-item label="备注">
            <el-input v-model="resignationForm.remarks" type="textarea" placeholder="请输入备注信息" :rows="2"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleSubmit">提交申请</el-button>
            <el-button @click="resetForm">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    
    <!-- 离职记录 -->
    <div class="resignation-record-section">
      <div class="resignation-record-card">
        <div v-if="resignationRecords.length === 0" class="empty">
          <el-icon><i class="el-icon-info"></i></el-icon>
          <span>暂无离职记录</span>
        </div>
        <div v-else class="resignation-items">
          <div v-for="item in resignationRecords" :key="item.id" class="resignation-item">
            <div class="resignation-header">
              <div class="resignation-info">
                <el-tag type="primary">{{ item.type }}</el-tag>
              </div>
              <el-tag :type="item.status === '待审批' ? 'warning' : 'success'">{{ item.status }}</el-tag>
            </div>
            <div class="resignation-details">
              <p>
                <i class="el-icon-date"></i>
                离职日期: {{ item.resignationDate }}
              </p>
              <p>
                <i class="el-icon-time"></i>
                申请时间: {{ item.applyDate }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import BackButton from '../../components/BackButton.vue'

const resignationForm = ref({
  type: '',
  resignationDate: '',
  reasonType: '',
  reason: '',
  remarks: ''
})

const resignationRecords = ref([])

const mockResignationRecords = [
  {
    id: 1,
    type: '主动离职',
    resignationDate: '2026-02-28',
    status: '待审批',
    applyDate: '2026-02-01 10:00:00'
  }
]

// 离职类型映射
const resignationTypeMap = {
  'voluntary': '主动离职',
  'persuaded': '劝退',
  'dismissed': '开除',
  'absconded': '自离职'
}

const handleSubmit = async () => {
  try {
    await new Promise(resolve => setTimeout(resolve, 500))
    
    const newRecord = {
      id: resignationRecords.value.length + 1,
      type: resignationTypeMap[resignationForm.value.type] || resignationForm.value.type,
      resignationDate: resignationForm.value.resignationDate,
      status: '待审批',
      applyDate: new Date().toLocaleString('zh-CN')
    }
    
    resignationRecords.value.unshift(newRecord)
    localStorage.setItem('resignationRecords', JSON.stringify(resignationRecords.value))
    resetForm()
    ElMessage.success('离职申请提交成功')
  } catch (error) {
    console.error('提交失败:', error)
    ElMessage.error('提交失败，请重试')
  }
}

const resetForm = () => {
  resignationForm.value = {
    type: '',
    resignationDate: '',
    reasonType: '',
    reason: '',
    remarks: ''
  }
}

const fetchResignationRecords = async () => {
  try {
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // 清理旧数据，强制使用mock数据确保显示正确的中文文本
    resignationRecords.value = mockResignationRecords
    localStorage.setItem('resignationRecords', JSON.stringify(mockResignationRecords))
  } catch (error) {
    console.error('获取离职记录失败:', error)
    resignationRecords.value = mockResignationRecords
  }
}

onMounted(() => {
  fetchResignationRecords()
})
</script>

<style scoped>
.worker-resignation {
  min-height: 100vh;
  background-color: #f5f5f5;
}

.page-header {
  background-color: #fff;
  padding: 15px;
  border-bottom: 1px solid #eaeaea;
  position: sticky;
  top: 0;
  z-index: 10;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.page-header h2 {
  margin: 0;
  font-size: 18px;
  font-weight: bold;
  color: #333;
}

.resignation-form-section {
  padding: 15px;
}

.resignation-record-section {
  padding: 0 15px 20px;
}

.card-title {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 16px;
  color: #333;
}

.resignation-form-card,
.resignation-record-card {
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  padding: 15px;
}

.resignation-record-card {
  margin-top: 10px;
}

.empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 0;
  color: #999;
}

.empty i {
  font-size: 32px;
  margin-bottom: 10px;
}

.resignation-items {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.resignation-item {
  background-color: #fafafa;
  border-radius: 8px;
  padding: 15px;
  border-left: 4px solid #667eea;
}

.resignation-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.resignation-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.resignation-details p {
  margin: 5px 0;
  font-size: 13px;
  color: #666;
  display: flex;
  align-items: center;
}

.resignation-details p i {
  margin-right: 8px;
  color: #999;
  font-size: 14px;
}

.el-button--primary {
  background-color: #667eea;
  border-color: #667eea;
}

.el-button--primary:hover {
  background-color: #5a6fe0;
  border-color: #5a6fe0;
}

.confidentiality-tip {
  font-size: 12px;
  color: #ff4d4f;
  margin-top: 8px;
  margin-bottom: 0;
}

/* 响应式设计 */
@media screen and (max-width: 768px) {
  .page-header {
    padding: 12px 15px;
  }
  
  .page-header h2 {
    font-size: 16px;
  }
  
  .resignation-form-section {
    padding: 12px;
  }
  
  .resignation-record-section {
    padding: 0 12px 20px;
  }
  
  .card-title {
    font-size: 15px;
    margin-bottom: 14px;
  }
  
  .resignation-form-card,
  .resignation-record-card {
    border-radius: 8px;
    padding: 12px;
  }
  
  .resignation-item {
    padding: 12px;
  }
  
  .resignation-details p {
    font-size: 12px;
  }
  
  .el-button {
    padding: 8px 16px;
    font-size: 13px;
  }
  
  .el-button--primary {
    padding: 10px 20px;
  }
}

/* 小屏幕手机适配 */
@media screen and (max-width: 480px) {
  .resignation-form-section {
    padding: 10px;
  }
  
  .resignation-record-section {
    padding: 0 10px 20px;
  }
  
  .resignation-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
  
  .resignation-info {
    flex-direction: column;
    align-items: flex-start;
    gap: 6px;
  }
  
  .resignation-details p {
    font-size: 11px;
  }
  
  .el-button {
    padding: 7px 14px;
    font-size: 12px;
  }
}
</style>