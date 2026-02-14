<template>
  <div class="worker-reward-punishment">
    <BackButton />
    <div class="page-header">
      <h2>我的奖惩</h2>
    </div>
    
    <!-- 奖惩记录 -->
    <div class="reward-punishment-section">
      <!-- 奖励部分 -->
      <div class="section-card">
        <div class="section-header">
          <h3>奖励记录</h3>
          <div class="section-icon">
            <el-icon size="20"><Present /></el-icon>
          </div>
        </div>
        <div class="section-content">
          <div v-if="rewardRecords.length === 0" class="empty-record">
            <el-icon><i class="el-icon-info"></i></el-icon>
            <span>暂无奖励记录</span>
          </div>
          <div v-else class="record-list">
            <div v-for="record in rewardRecords" :key="record.id" class="record-item reward-item">
              <div class="record-header">
                <el-tag :type="getRewardTypeTag(record.type)">{{ getRewardTypeText(record.type) }}</el-tag>
                <span class="record-date">{{ record.date }}</span>
              </div>
              <div class="record-body">
                <p class="record-reason">{{ record.reason }}</p>
                <div v-if="record.type === 'amount'" class="amount-info">
                  <span class="amount">金额: ¥{{ record.amount }}</span>
                  <el-tag :type="record.includeInSalary ? 'success' : 'info'" size="small" class="salary-tag">
                    {{ record.includeInSalary ? '计入工资' : '不计入工资' }}
                  </el-tag>
                </div>
                <div v-if="record.attachments && record.attachments.length > 0" class="attachments-info">
                  <p class="attachments-label">附件证明:</p>
                  <div class="attachments-list">
                    <a 
                      v-for="attachment in record.attachments" 
                      :key="attachment.id" 
                      :href="attachment.url" 
                      target="_blank" 
                      class="attachment-item"
                    >
                      <el-icon size="16"><i class="el-icon-document"></i></el-icon>
                      <span>{{ attachment.name }}</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 惩罚部分 -->
      <div class="section-card">
        <div class="section-header">
          <h3>惩罚记录</h3>
          <div class="section-icon">
            <el-icon size="20"><Warning /></el-icon>
          </div>
        </div>
        <div class="section-content">
          <div v-if="punishmentRecords.length === 0" class="empty-record">
            <el-icon><i class="el-icon-info"></i></el-icon>
            <span>暂无惩罚记录</span>
          </div>
          <div v-else class="record-list">
            <div v-for="record in punishmentRecords" :key="record.id" class="record-item punishment-item">
              <div class="record-header">
                <el-tag :type="getPunishmentTypeTag(record.type)">{{ getPunishmentTypeText(record.type) }}</el-tag>
                <span class="record-date">{{ record.date }}</span>
              </div>
              <div class="record-body">
                <p class="record-reason">{{ record.reason }}</p>
                <div v-if="record.type === 'amount'" class="amount-info">
                  <span class="amount">金额: ¥{{ record.amount }}</span>
                  <el-tag :type="record.includeInSalary ? 'danger' : 'info'" size="small" class="salary-tag">
                    {{ record.includeInSalary ? '计入工资' : '不计入工资' }}
                  </el-tag>
                </div>
                <div v-if="record.attachments && record.attachments.length > 0" class="attachments-info">
                  <p class="attachments-label">附件证明:</p>
                  <div class="attachments-list">
                    <a 
                      v-for="attachment in record.attachments" 
                      :key="attachment.id" 
                      :href="attachment.url" 
                      target="_blank" 
                      class="attachment-item"
                    >
                      <el-icon size="16"><i class="el-icon-document"></i></el-icon>
                      <span>{{ attachment.name }}</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import BackButton from '../../components/BackButton.vue'
import { ElIcon } from 'element-plus'
import { Present, Warning } from '@element-plus/icons-vue'

// 奖励记录
const rewardRecords = ref([
  {
    id: 1,
    type: 'honor',
    reason: '2023年度优秀员工',
    date: '2024-01-15',
    includeInSalary: false,
    attachments: [
      {
        id: 1,
        name: '优秀员工证书.pdf',
        url: 'https://example.com/certificates/excellent-employee-2023.pdf'
      }
    ]
  },
  {
    id: 2,
    type: 'amount',
    reason: '2023年第三季度生产效率标兵',
    amount: 500,
    date: '2023-10-10',
    includeInSalary: true,
    attachments: [
      {
        id: 1,
        name: '生产效率标兵证明.pdf',
        url: 'https://example.com/certificates/productivity-award-2023q3.pdf'
      }
    ]
  },
  {
    id: 3,
    type: 'other',
    reason: '月度最佳团队成员',
    date: '2023-09-05',
    includeInSalary: false,
    attachments: []
  }
])

// 惩罚记录
const punishmentRecords = ref([
  {
    id: 1,
    type: 'verbal',
    reason: '2023年6月迟到1次',
    date: '2023-06-10',
    includeInSalary: false,
    attachments: []
  },
  {
    id: 2,
    type: 'amount',
    reason: '工作失误导致产品报废',
    amount: 200,
    date: '2023-08-15',
    includeInSalary: true,
    attachments: [
      {
        id: 1,
        name: '产品报废证明.pdf',
        url: 'https://example.com/documents/product-scrap-proof-20230815.pdf'
      },
      {
        id: 2,
        name: '处罚决定书.pdf',
        url: 'https://example.com/documents/punishment-decision-20230815.pdf'
      }
    ]
  },
  {
    id: 3,
    type: 'other',
    reason: '未按规定佩戴安全防护装备',
    date: '2023-11-02',
    includeInSalary: false,
    attachments: []
  }
])

// 获取奖励类型标签
const getRewardTypeTag = (type: string) => {
  const typeMap: Record<string, string> = {
    'honor': 'success',
    'amount': 'primary',
    'other': 'info'
  }
  return typeMap[type] || 'default'
}

// 获取奖励类型文本
const getRewardTypeText = (type: string) => {
  const textMap: Record<string, string> = {
    'honor': '荣誉奖励',
    'amount': '金额奖励',
    'other': '其他奖励'
  }
  return textMap[type] || type
}

// 获取惩罚类型标签
const getPunishmentTypeTag = (type: string) => {
  const typeMap: Record<string, string> = {
    'verbal': 'warning',
    'amount': 'danger',
    'other': 'info'
  }
  return typeMap[type] || 'default'
}

// 获取惩罚类型文本
const getPunishmentTypeText = (type: string) => {
  const textMap: Record<string, string> = {
    'verbal': '口头惩罚',
    'amount': '金额惩罚',
    'other': '其他惩罚'
  }
  return textMap[type] || type
}

// 页面加载时获取数据
onMounted(() => {
  // 这里可以添加异步获取数据的逻辑
})
</script>

<style scoped>
.worker-reward-punishment {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding-bottom: 30px;
}

.page-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px 15px;
  color: white;
  position: sticky;
  top: 0;
  z-index: 10;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.page-header h2 {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}

.reward-punishment-section {
  padding: 20px 15px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.section-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  transition: all 0.3s ease;
}

.section-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
}

.section-header {
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 15px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #f0f0f0;
}

.section-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.section-icon {
  color: #667eea;
}

.section-content {
  padding: 20px;
}

.empty-record {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 0;
  color: #999;
}

.empty-record i {
  font-size: 32px;
  margin-bottom: 10px;
}

.record-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.record-item {
  background-color: #fafafa;
  border-radius: 8px;
  padding: 15px;
  transition: all 0.3s ease;
}

.record-item:hover {
  background-color: #f0f4ff;
  transform: translateY(-1px);
}

.reward-item {
  border-left: 4px solid #67c23a;
}

.punishment-item {
  border-left: 4px solid #f56c6c;
}

.record-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.record-date {
  font-size: 12px;
  color: #999;
}

.record-body {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.record-reason {
  margin: 0;
  font-size: 14px;
  color: #333;
  line-height: 1.4;
}

.amount-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 5px;
}

.amount {
  font-size: 14px;
  font-weight: 500;
  color: #666;
}

.salary-tag {
  margin-left: 10px;
}

/* 附件样式 */
.attachments-info {
  margin-top: 10px;
  padding-top: 10px;
  border-top: 1px solid #f0f0f0;
}

.attachments-label {
  margin: 0 0 8px 0;
  font-size: 13px;
  font-weight: 500;
  color: #666;
}

.attachments-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.attachment-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: #1890ff;
  text-decoration: none;
  padding: 6px 10px;
  background-color: #f0f9ff;
  border-radius: 6px;
  transition: all 0.3s ease;
}

.attachment-item:hover {
  background-color: #e6f7ff;
  text-decoration: underline;
  transform: translateY(-1px);
}

.attachment-item i {
  color: #1890ff;
  font-size: 14px;
}

/* 响应式设计 */
@media screen and (max-width: 768px) {
  .reward-punishment-section {
    padding: 15px 12px;
    gap: 15px;
  }
  
  .section-header {
    padding: 12px 16px;
  }
  
  .section-content {
    padding: 16px;
  }
  
  .section-header h3 {
    font-size: 14px;
  }
  
  .record-item {
    padding: 12px;
  }
  
  .record-reason {
    font-size: 13px;
  }
  
  .amount {
    font-size: 13px;
  }
}

/* 小屏幕手机适配 */
@media screen and (max-width: 480px) {
  .page-header {
    padding: 16px 12px;
  }
  
  .page-header h2 {
    font-size: 18px;
  }
  
  .reward-punishment-section {
    padding: 12px 10px;
    gap: 12px;
  }
  
  .section-content {
    padding: 14px;
  }
  
  .record-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 5px;
  }
  
  .amount-info {
    flex-direction: column;
    align-items: flex-start;
    gap: 5px;
  }
  
  .salary-tag {
    margin-left: 0;
  }
}
</style>