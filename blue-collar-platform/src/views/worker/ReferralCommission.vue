<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElIcon } from 'element-plus'
import { Star, Clock, User, Briefcase, OfficeBuilding, HomeFilled } from '@element-plus/icons-vue'
import BackButton from '../../components/BackButton.vue'

const router = useRouter()

// 佣金数据
const commissions = ref([
  {
    id: 1,
    amount: 500,
    status: '已发放',
    type: '转介绍',
    referrerName: '李四',
    referrerPhone: '138****8888',
    referralTarget: '劳务公司',
    referralCompany: '南通富民劳务服务有限公司',
    jobTitle: '流水线操作工',
    factory: '富士康科技集团',
    applyDate: '2026-01-15',
    entryDate: '2026-01-20',
    paymentDate: '2026-02-01'
  },
  {
    id: 2,
    amount: 300,
    status: '待发放',
    type: '转介绍',
    referrerName: '王五',
    referrerPhone: '139****9999',
    referralTarget: '平台',
    referralCompany: '蓝领智汇平台',
    jobTitle: '质检员',
    factory: '华为技术有限公司',
    applyDate: '2026-01-20',
    entryDate: '2026-01-25',
    paymentDate: null
  },
  {
    id: 3,
    amount: 400,
    status: '已发放',
    type: '转介绍',
    referrerName: '赵六',
    referrerPhone: '137****7777',
    referralTarget: '工厂',
    referralCompany: '富士康科技集团',
    jobTitle: '仓库管理员',
    factory: '富士康科技集团',
    applyDate: '2025-12-10',
    entryDate: '2025-12-15',
    paymentDate: '2026-01-05'
  },
  {
    id: 4,
    amount: 350,
    status: '审核中',
    type: '转介绍',
    referrerName: '孙七',
    referrerPhone: '136****6666',
    referralTarget: '平台',
    referralCompany: '蓝领智汇平台',
    jobTitle: '包装工',
    factory: '比亚迪股份有限公司',
    applyDate: '2026-01-25',
    entryDate: null,
    paymentDate: null
  },
  {
    id: 5,
    amount: 100,
    status: '已发放',
    type: '拉新',
    referrerName: '周八',
    referrerPhone: '135****5555',
    referralTarget: '平台',
    referralCompany: '蓝领智汇平台',
    jobTitle: null,
    factory: null,
    applyDate: '2026-01-30',
    entryDate: '2026-01-30',
    paymentDate: '2026-02-05'
  },
  {
    id: 6,
    amount: 100,
    status: '待发放',
    type: '拉新',
    referrerName: '吴九',
    referrerPhone: '134****4444',
    referralTarget: '平台',
    referralCompany: '蓝领智汇平台',
    jobTitle: null,
    factory: null,
    applyDate: '2026-02-01',
    entryDate: '2026-02-01',
    paymentDate: null
  }
])

// 计算总佣金
const totalCommission = ref(0)

// 计算已发放佣金
const paidCommission = ref(0)

// 计算待发放佣金
const pendingCommission = ref(0)

// 计算审核中佣金
const reviewingCommission = ref(0)

// 计算转介绍佣金
const referralCommission = ref(0)

// 计算拉新佣金
const pullNewCommission = ref(0)

// 计算统计数据
const calculateCommissions = () => {
  totalCommission.value = commissions.value.reduce((sum, item) => sum + item.amount, 0)
  paidCommission.value = commissions.value.filter(item => item.status === '已发放').reduce((sum, item) => sum + item.amount, 0)
  pendingCommission.value = commissions.value.filter(item => item.status === '待发放').reduce((sum, item) => sum + item.amount, 0)
  reviewingCommission.value = commissions.value.filter(item => item.status === '审核中').reduce((sum, item) => sum + item.amount, 0)
  referralCommission.value = commissions.value.filter(item => item.type === '转介绍').reduce((sum, item) => sum + item.amount, 0)
  pullNewCommission.value = commissions.value.filter(item => item.type === '拉新').reduce((sum, item) => sum + item.amount, 0)
}

// 获取转介绍对象图标
const getReferralTargetIcon = (target) => {
  switch (target) {
    case '劳务公司':
      return OfficeBuilding
    case '平台':
      return HomeFilled
    case '工厂':
      return Briefcase
    default:
      return User
  }
}

// 跳转到工作转介绍页面
const goToReferral = () => {
  router.push('/worker/referral')
}

onMounted(() => {
  calculateCommissions()
})
</script>

<template>
  <div class="worker-referral-commission">
    <BackButton />
    
    <!-- 页面标题 -->
    <div class="page-header">
      <h2>我的佣金</h2>
    </div>
    
    <!-- 佣金统计 -->
    <div class="commission-stats">
      <div class="stat-item total">
        <div class="stat-icon">
          <el-icon class="dollar-icon"><Star /></el-icon>
        </div>
        <div class="stat-info">
          <h3>总佣金</h3>
          <p class="stat-value">¥{{ totalCommission }}</p>
        </div>
      </div>
      <div class="stat-item paid">
        <div class="stat-icon">
          <el-icon class="check-icon"><Star /></el-icon>
        </div>
        <div class="stat-info">
          <h3>已发放</h3>
          <p class="stat-value">¥{{ paidCommission }}</p>
        </div>
      </div>
      <div class="stat-item pending">
        <div class="stat-icon">
          <el-icon class="clock-icon"><Clock /></el-icon>
        </div>
        <div class="stat-info">
          <h3>待发放</h3>
          <p class="stat-value">¥{{ pendingCommission }}</p>
        </div>
      </div>
      <div class="stat-item reviewing">
        <div class="stat-icon">
          <el-icon class="clock-icon"><Clock /></el-icon>
        </div>
        <div class="stat-info">
          <h3>审核中</h3>
          <p class="stat-value">¥{{ reviewingCommission }}</p>
        </div>
      </div>
      <div class="stat-item referral">
        <div class="stat-icon">
          <el-icon class="dollar-icon"><Star /></el-icon>
        </div>
        <div class="stat-info">
          <h3>转介绍</h3>
          <p class="stat-value">¥{{ referralCommission }}</p>
        </div>
      </div>
      <div class="stat-item pull-new">
        <div class="stat-icon">
          <el-icon class="dollar-icon"><Star /></el-icon>
        </div>
        <div class="stat-info">
          <h3>拉新</h3>
          <p class="stat-value">¥{{ pullNewCommission }}</p>
        </div>
      </div>
    </div>
    
    <!-- 转介绍入口 -->
    <div class="referral-entry" @click="goToReferral">
      <div class="entry-icon">
        <el-icon class="dollar-icon"><Star /></el-icon>
      </div>
      <div class="entry-info">
        <h3>去转介绍</h3>
        <p>邀请好友工作，赚取更多佣金</p>
      </div>
      <el-icon class="arrow-icon"><Star /></el-icon>
    </div>
    
    <!-- 佣金列表 -->
    <div class="commission-list">
      <h3 class="section-title">佣金记录</h3>
      <div class="list-content">
        <div v-if="commissions.length === 0" class="empty">
          <el-icon class="dollar-icon"><Dollar /></el-icon>
          <span>暂无佣金记录</span>
        </div>
        <div v-else class="commission-items">
          <div 
            v-for="commission in commissions" 
            :key="commission.id" 
            class="commission-item"
            :class="commission.status"
          >
            <!-- 佣金金额 -->
            <div class="commission-amount">
              <div class="amount-section">
                <span class="amount">¥{{ commission.amount }}</span>
                <span class="type-tag" :class="commission.type">
                  {{ commission.type }}
                </span>
              </div>
              <span class="status-tag" :class="commission.status">
                {{ commission.status }}
              </span>
            </div>
            
            <!-- 佣金详情 -->
            <div class="commission-details">
              <!-- 被介绍人信息 -->
              <div class="detail-item">
                <el-icon class="user-icon"><User /></el-icon>
                <span>{{ commission.referrerName }} {{ commission.referrerPhone }}</span>
              </div>
              
              <!-- 转介绍对象 -->
              <div class="detail-item">
                <el-icon :class="'target-icon'">
                  <component :is="getReferralTargetIcon(commission.referralTarget)" />
                </el-icon>
                <span>{{ commission.referralTarget }} - {{ commission.referralCompany }}</span>
              </div>
              
              <!-- 工作信息 -->
              <div v-if="commission.type === '转介绍' && commission.jobTitle" class="detail-item">
                <el-icon class="briefcase-icon"><Briefcase /></el-icon>
                <span>{{ commission.jobTitle }} - {{ commission.factory }}</span>
              </div>
              
              <!-- 拉新信息 -->
              <div v-if="commission.type === '拉新'" class="detail-item">
                <el-icon class="briefcase-icon"><Star /></el-icon>
                <span>平台注册奖励</span>
              </div>
              
              <!-- 日期信息 -->
              <div class="detail-item dates">
                <span class="date-item">
                  {{ commission.type === '拉新' ? '注册: ' : '入职: ' }}{{ commission.entryDate || '待入职' }}
                </span>
                <span class="date-item">
                  发放: {{ commission.paymentDate || '待发放' }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.worker-referral-commission {
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

/* 佣金统计 */
.commission-stats {
  background-color: #fff;
  margin: 20px 15px;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 16px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.stat-item.total {
  background-color: #f8f9ff;
  border: 1px solid #e3f2fd;
}

.stat-item.paid {
  background-color: #f1f8e9;
  border: 1px solid #e8f5e8;
}

.stat-item.pending {
  background-color: #fff8e1;
  border: 1px solid #fff3e0;
}

.stat-item.reviewing {
  background-color: #f3e5f5;
  border: 1px solid #f3e5f5;
}

.stat-item.referral {
  background-color: #e3f2fd;
  border: 1px solid #bbdefb;
}

.stat-item.pull-new {
  background-color: #fff3e0;
  border: 1px solid #ffcc80;
}

.stat-item.referral .stat-icon {
  background-color: #bbdefb;
}

.stat-item.pull-new .stat-icon {
  background-color: #ffcc80;
}

.stat-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.stat-icon {
  width: 40px;
  height: 40px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 12px;
}

.stat-item.total .stat-icon {
  background-color: #e3f2fd;
}

.stat-item.paid .stat-icon {
  background-color: #e8f5e8;
}

.stat-item.pending .stat-icon {
  background-color: #fff3e0;
}

.stat-item.reviewing .stat-icon {
  background-color: #f3e5f5;
}

.dollar-icon {
  font-size: 20px;
  color: #007bff;
}

.check-icon {
  font-size: 20px;
  color: #28a745;
}

.clock-icon {
  font-size: 20px;
  color: #ffc107;
}

.stat-info {
  text-align: center;
}

.stat-info h3 {
  margin: 0 0 4px;
  font-size: 14px;
  font-weight: 500;
  color: #666;
}

.stat-value {
  margin: 0;
  font-size: 18px;
  font-weight: bold;
  color: #333;
}

/* 转介绍入口 */
.referral-entry {
  background-color: #fff;
  margin: 0 15px 20px;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  display: flex;
  align-items: center;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid #e9ecef;
}

.referral-entry:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
  border-color: #007bff;
}

.entry-icon {
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

.entry-info {
  flex: 1;
}

.entry-info h3 {
  margin: 0 0 4px;
  font-size: 16px;
  font-weight: bold;
  color: #333;
}

.entry-info p {
  margin: 0;
  font-size: 14px;
  color: #666;
}

.arrow-icon {
  font-size: 16px;
  color: #999;
}

/* 佣金列表 */
.commission-list {
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

.empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  color: #999;
}

.empty i {
  font-size: 48px;
  margin-bottom: 15px;
  color: #007bff;
}

.commission-items {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.commission-item {
  border: 1px solid #e9ecef;
  border-radius: 12px;
  padding: 16px;
  transition: all 0.3s ease;
}

.commission-item:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border-color: #007bff;
}

.commission-item.已发放 {
  border-left: 4px solid #28a745;
}

.commission-item.待发放 {
  border-left: 4px solid #ffc107;
}

.commission-item.审核中 {
  border-left: 4px solid #6f42c1;
}

.commission-amount {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid #f1f1f1;
}

.amount-section {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.amount {
  font-size: 20px;
  font-weight: bold;
  color: #333;
}

.type-tag {
  padding: 2px 8px;
  border-radius: 8px;
  font-size: 10px;
  font-weight: 500;
  align-self: flex-start;
}

.type-tag.转介绍 {
  background-color: #e3f2fd;
  color: #1976d2;
}

.type-tag.拉新 {
  background-color: #fff3e0;
  color: #ff8f00;
}

.status-tag {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  align-self: flex-start;
}

.status-tag.已发放 {
  background-color: #e8f5e8;
  color: #28a745;
}

.status-tag.待发放 {
  background-color: #fff3e0;
  color: #ffc107;
}

.status-tag.审核中 {
  background-color: #f3e5f5;
  color: #6f42c1;
}

.commission-details {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.detail-item {
  display: flex;
  align-items: center;
  font-size: 14px;
  color: #666;
}

.detail-item i {
  margin-right: 8px;
  color: #007bff;
  flex-shrink: 0;
}

.detail-item.dates {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 4px;
}

.date-item {
  font-size: 12px;
  color: #999;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .page-header {
    padding: 16px 15px;
  }
  
  .page-header h2 {
    font-size: 18px;
  }
  
  .commission-stats {
    margin: 16px 15px;
    padding: 16px;
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }
  
  .stat-item {
    padding: 12px;
  }
  
  .stat-icon {
    width: 32px;
    height: 32px;
  }
  
  .dollar-icon,
  .check-icon,
  .clock-icon {
    font-size: 16px;
  }
  
  .stat-info h3 {
    font-size: 12px;
  }
  
  .stat-value {
    font-size: 16px;
  }
  
  .referral-entry {
    margin: 0 15px 16px;
    padding: 16px;
  }
  
  .entry-icon {
    width: 40px;
    height: 40px;
  }
  
  .entry-info h3 {
    font-size: 15px;
  }
  
  .entry-info p {
    font-size: 13px;
  }
  
  .commission-list {
    margin: 0 15px 16px;
    padding: 16px;
  }
  
  .section-title {
    font-size: 15px;
    margin-bottom: 12px;
  }
  
  .empty {
    padding: 40px 15px;
  }
  
  .empty i {
    font-size: 40px;
  }
  
  .commission-items {
    gap: 12px;
  }
  
  .commission-item {
    padding: 12px;
  }
  
  .amount {
    font-size: 18px;
  }
  
  .detail-item {
    font-size: 13px;
  }
  
  .detail-item.dates {
    gap: 8px;
  }
  
  .date-item {
    font-size: 11px;
  }
}
</style>