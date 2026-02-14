<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import BackButton from '../../components/BackButton.vue'
import { ElMessage } from 'element-plus'
import { ElIcon } from 'element-plus'
import { ArrowLeft, InfoFilled, Loading, Grid } from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()
const message = ref(null)
const loading = ref(true)

// 播放金币雨音效
const playCoinSound = () => {
  try {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(400, audioContext.currentTime + 0.5);
    
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);
  } catch (error) {
    console.error('播放金币音效失败:', error);
  }
};

// 播放工资到账提示音频
const playSalaryNotification = () => {
  try {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(500, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(800, audioContext.currentTime + 0.3);
    
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.3);
  } catch (error) {
    console.error('播放提示音频失败:', error);
  }
};

// 模拟消息数据
const mockMessages = [
  {
    id: 1,
    userId: 1,
    userType: 'worker',
    type: 'notification',
    title: '工资条已发放',
    content: '2026年1月份工资条已发放，请查看。\n\n工资明细：\n- 基本工资：4500元\n- 绩效奖金：800元\n- 加班费：300元\n- 扣除项：\n  - 社保：350元\n  - 个税：50元\n- 实发工资：5200元\n\n如有疑问，请联系财务部。',
    status: '未读',
    createTime: '2026-02-05 09:00:00'
  },
  {
    id: 2,
    userId: 1,
    userType: 'worker',
    type: 'notification',
    title: '新招聘信息',
    content: '有3个新的招聘职位发布，适合您的技能水平，请查看。\n\n推荐职位：\n1. 富士康科技集团 - 操作工 - 5000-6000元/月\n2. 华为技术有限公司 - 质检员 - 6000-7000元/月\n3. 比亚迪股份有限公司 - 装配工 - 5500-6500元/月\n\n点击查看全部招聘信息。',
    status: '已读',
    createTime: '2026-01-15 14:00:00'
  },
  {
    id: 3,
    userId: 1,
    userType: 'worker',
    type: 'notification',
    title: '培训课程通知',
    content: '您已报名的安全培训课程将于明天开始，请准时参加。\n\n培训时间：2026年2月10日 09:00-17:00\n培训地点：富士康科技集团A区培训室\n培训内容：安全生产知识、设备操作规范、应急处理流程\n\n请携带身份证和工作证参加培训。',
    status: '已读',
    createTime: '2026-02-09 10:00:00'
  },
  {
    id: 4,
    userId: 1,
    userType: 'worker',
    type: 'notification',
    title: '考勤异常提醒',
    content: '您2026年1月30日的考勤记录异常，请及时核对。\n\n异常类型：迟到\n异常时间：2026年1月30日 08:35\n正常上班时间：08:00\n\n如有疑问，请联系考勤管理员。',
    status: '未读',
    createTime: '2026-02-04 16:00:00'
  },
  {
    id: 5,
    userId: 1,
    userType: 'worker',
    type: 'notification',
    title: '节日福利通知',
    content: '春节将至，公司为每位员工准备了节日福利，请于2月6日至8日到行政部领取。\n\n福利内容：\n- 春节红包：500元\n- 年货礼盒：一份\n- 春节假期：2月10日-2月17日\n\n祝大家春节快乐！',
    status: '已读',
    createTime: '2026-02-01 10:00:00'
  },
  {
    id: 6,
    userId: 1,
    userType: 'worker',
    type: 'notification',
    title: '技能竞赛报名',
    content: '公司将于2月20日举办技能竞赛，欢迎各位员工报名参加，有丰厚奖品等待大家。\n\n竞赛项目：\n1. 设备操作技能\n2. 质量检测技能\n3. 生产效率竞赛\n\n报名截止时间：2月15日\n报名方式：联系车间主任或通过系统报名\n\n一等奖：3000元现金\n二等奖：2000元现金\n三等奖：1000元现金',
    status: '未读',
    createTime: '2026-02-03 09:30:00'
  },
  {
    id: 7,
    userId: 1,
    userType: 'worker',
    type: 'notification',
    title: '生产线调整通知',
    content: '因生产计划调整，从2月10日起，您所在的生产线工作时间将调整为早8点至晚5点。\n\n调整详情：\n- 原工作时间：08:00-17:30\n- 新工作时间：08:00-17:00\n- 调整日期：2026年2月10日起\n\n请各位员工相互转告，按时到岗。',
    status: '已读',
    createTime: '2026-02-02 14:30:00'
  },
  {
    id: 8,
    userId: 1,
    userType: 'worker',
    type: 'notification',
    title: '健康体检通知',
    content: '公司将于2月15日组织年度健康体检，请各位员工按时参加。\n\n体检时间：2026年2月15日 07:30-12:00\n体检地点：深圳市南山区人民医院\n体检项目：血常规、尿常规、肝功能、肾功能、心电图、胸部X光等\n\n请空腹参加体检，携带身份证。',
    status: '未读',
    createTime: '2026-02-05 10:00:00'
  }
]



// 获取消息详情
const getMessageDetail = async () => {
  loading.value = true
  try {
    const messageId = parseInt(route.params.id as string)
    // 模拟异步请求
    setTimeout(() => {
      const foundMessage = mockMessages.find(m => m.id === messageId)
      if (foundMessage) {
          message.value = foundMessage
          // 标记为已读
          message.value.status = '已读'
          // 如果是工资条消息，播放金币雨音效和提示音频
          if (foundMessage.title.includes('工资条')) {
            playCoinSound();
            // 延迟播放提示音频，与金币雨效果同步
            setTimeout(() => {
              playSalaryNotification();
            }, 500);
          }
        } else {
        ElMessage.error('消息不存在')
        router.push('/worker/messages')
      }
      loading.value = false
    }, 500)
  } catch (error) {
    console.error('获取消息详情失败:', error)
    ElMessage.error('获取消息详情失败，请稍后重试')
    loading.value = false
  }
}

// 返回消息列表
const goBack = () => {
  router.push('/worker/messages')
}

// 页面加载时获取数据
onMounted(() => {
  getMessageDetail()
})
</script>

<template>
  <div class="worker-message-detail">
    <BackButton />
    <!-- 页面标题 -->
    <div class="page-header">
      <div class="header-left">
        <el-button type="text" @click="goBack">
          <ElIcon><ArrowLeft /></ElIcon>
        </el-button>
        <h2>消息详情</h2>
      </div>
    </div>
    
    <!-- 金币雨效果容器 -->
    <div v-if="message && message.title.includes('工资条')" class="coin-rain-container">
      <div v-for="i in 30" :key="i" class="coin" :style="{ animationDelay: `${i * 0.1}s`, left: `${Math.random() * 100}%` }"></div>
    </div>
    
    <!-- 消息内容 -->
    <div class="message-content">
      <div v-if="loading" class="loading">
        <ElIcon class="is-loading"><Loading /></ElIcon>
        <span>加载中...</span>
      </div>
      <div v-else-if="!message" class="empty">
        <ElIcon><InfoFilled /></ElIcon>
        <span>消息不存在</span>
      </div>
      <div v-else class="message-detail">
        <div class="message-header">
          <div class="message-title">
            <div v-if="message.title.includes('工资条')" class="message-icon salary-icon">
              <img src="../../assets/coin-design/gold_coin_new.svg" alt="金币" class="coin-icon">
            </div>
            <div v-else-if="message.title.includes('招聘')" class="message-icon">
              <ElIcon :size="20"><Grid /></ElIcon>
            </div>
            <div v-else class="message-icon">
              <ElIcon :size="20"><InfoFilled /></ElIcon>
            </div>
            <h3>{{ message.title }}</h3>
          </div>
          <div class="message-meta">
            <span class="message-time">{{ message.createTime }}</span>
            <el-tag :type="message.status === '未读' ? 'danger' : 'success'">
              {{ message.status }}
            </el-tag>
          </div>
        </div>
        <div class="message-body">
          <p v-for="(line, index) in message.content.split('\n')" :key="index" class="message-line">
            {{ line }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.worker-message-detail {
  min-height: 100vh;
  background-color: #f5f5f5;
  position: relative;
}

/* 金币雨效果 */
.coin-rain-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
  overflow: hidden;
}

.coin {
  position: absolute;
  top: -50px;
  width: 24px;
  height: 24px;
  animation: coinFall linear forwards;
  animation-duration: 3s;
  will-change: transform, opacity;
}

.coin::before {
  content: '';
  display: block;
  width: 100%;
  height: 100%;
  background: url('../../assets/coin-design/gold_coin_new.svg') no-repeat center center;
  background-size: contain;
  border-radius: 50%;
}

@keyframes coinFall {
  0% {
    opacity: 1;
    transform: translateY(0) rotate(0deg);
  }
  100% {
    transform: translateY(100vh) rotate(360deg);
    opacity: 0;
  }
}

.page-header {
  background-color: #fff;
  padding: 15px;
  border-bottom: 1px solid #eaeaea;
  position: sticky;
  top: 0;
  z-index: 10;
}

.header-left {
  display: flex;
  align-items: center;
}

.header-left h2 {
  margin: 0 0 0 10px;
  font-size: 18px;
  font-weight: bold;
  color: #333;
}

.message-content {
  padding: 15px;
}

.loading,
.empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 0;
  color: #999;
}

.loading i,
.empty i {
  font-size: 32px;
  margin-bottom: 10px;
}

.message-detail {
  background-color: #fff;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.message-header {
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid #eaeaea;
}

.message-title {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
}

.message-title h3 {
  margin: 0;
  font-size: 18px;
  font-weight: bold;
  color: #333;
}

.message-icon {
  font-size: 20px;
  color: #999;
}

.salary-icon {
  animation: pulse 2s infinite;
}

.coin-icon {
  width: 20px;
  height: 20px;
  display: block;
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}

.message-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.message-time {
  font-size: 12px;
  color: #999;
}

.message-body {
  line-height: 1.6;
}

.message-line {
  margin: 8px 0;
  font-size: 14px;
  color: #666;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .page-header {
    padding: 12px 15px;
  }
  
  .header-left h2 {
    font-size: 16px;
  }
  
  .message-content {
    padding: 10px;
  }
  
  .message-detail {
    padding: 15px;
  }
  
  .message-header h3 {
    font-size: 16px;
  }
  
  .message-line {
    font-size: 13px;
  }
}
</style>