<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Calendar, User, MapLocation, Clock, Star, Phone, Check, Close, Loading, Timer } from '@element-plus/icons-vue'
import BackButton from '../../components/BackButton.vue'

const route = useRoute()
const router = useRouter()
const activity = ref(null)
const loading = ref(true)
const isJoined = ref(false)

// 模拟活动数据
const mockActivities = [
  {
    id: 1,
    title: '春季篮球友谊赛',
    type: 'culture',
    typeName: '文体活动',
    organizer: '公司工会',
    organizerContact: '张老师 13800138001',
    startDate: '2026-03-15',
    startTime: '14:00',
    endDate: '2026-03-15',
    endTime: '16:00',
    location: '公司篮球场',
    address: '上海市浦东新区张江高科技园区博云路2号',
    participants: 23,
    maxParticipants: 30,
    deadline: '2026-03-14 18:00',
    description: '欢迎各位篮球爱好者积极参与，展示风采，增进友谊。本次活动由公司工会主办，旨在丰富员工的业余生活，增强团队凝聚力。活动当天将提供饮用水和运动饮料，并有专业裁判执法。',
    requirements: '1. 身体健康，无重大疾病史\n2. 自备运动装备\n3. 遵守活动纪律\n4. 按时到场',
    notes: '1. 活动风雨无阻\n2. 请提前15分钟到场签到\n3. 活动结束后将有集体合影',
    rewards: '1. 冠军队：每人奖金500元\n2. 亚军队：每人奖金300元\n3. 季军队：每人奖金200元\n4. 参与奖：每人纪念品一份',
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=basketball%20game%20on%20outdoor%20court%20with%20workers%20playing&image_size=landscape_16_9',
    images: [
      'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=basketball%20court%20with%20hoops%20and%20lines&image_size=landscape_16_9',
      'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=basketball%20players%20warming%20up%20before%20game&image_size=landscape_16_9'
    ],
    joined: true
  },
  {
    id: 2,
    title: '单身青年交友会',
    type: 'dating',
    typeName: '相亲活动',
    organizer: '人力资源部',
    organizerContact: '李经理 13800138002',
    startDate: '2026-03-20',
    startTime: '19:00',
    endDate: '2026-03-20',
    endTime: '21:00',
    location: '公司活动中心',
    address: '上海市浦东新区张江高科技园区博云路2号',
    participants: 45,
    maxParticipants: 50,
    deadline: '2026-03-19 18:00',
    description: '为单身青年提供交流机会，促进员工之间的了解和友谊。活动将通过游戏互动、自我介绍等环节，为大家创造轻松愉快的交流氛围。',
    requirements: '1. 公司在职员工\n2. 年满18周岁\n3. 单身状态\n4. 携带身份证',
    notes: '1. 活动免费\n2. 提供小食和饮料\n3. 请着休闲装',
    rewards: '1. 参与奖：精美小礼品一份\n2. 互动游戏获胜者：额外礼品一份',
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=social%20gathering%20for%20young%20people%20with%20games%20and%20activities&image_size=landscape_16_9',
    images: [
      'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=indoor%20activity%20center%20with%20tables%20and%20chairs&image_size=landscape_16_9',
      'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=group%20of%20young%20people%20playing%20icebreaker%20games&image_size=landscape_16_9'
    ],
    joined: false
  },
  {
    id: 3,
    title: '职业技能提升培训',
    type: 'skill',
    typeName: '技能提升',
    organizer: '培训部',
    organizerContact: '王老师 13800138003',
    startDate: '2026-03-10',
    startTime: '09:00',
    endDate: '2026-03-10',
    endTime: '12:00',
    location: '公司会议室A',
    address: '上海市浦东新区张江高科技园区博云路2号',
    participants: 18,
    maxParticipants: 25,
    deadline: '2026-03-09 18:00',
    description: '提升专业技能，助力职业发展。本次培训将邀请行业专家进行授课，内容涵盖最新的行业动态、技术趋势和实用技能。',
    requirements: '1. 提前10分钟到场\n2. 携带笔记本和笔\n3. 关闭手机或调至静音',
    notes: '1. 培训结束后将进行小测验\n2. 合格者将获得培训证书\n3. 提供午餐',
    rewards: '1. 培训证书：提升职业竞争力\n2. 测验优秀者：额外学习资料一份\n3. 全勤参与：积分奖励50分',
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20training%20session%20in%20classroom%20with%20workers%20learning&image_size=landscape_16_9',
    images: [
      'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=modern%20meeting%20room%20with%20projector%20and%20chairs&image_size=landscape_16_9',
      'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=trainer%20giving%20lecture%20to%20audience&image_size=landscape_16_9'
    ],
    joined: true
  },
  {
    id: 4,
    title: '春日户外踏青',
    type: 'other',
    typeName: '其他活动',
    organizer: '工会',
    organizerContact: '刘老师 13800138004',
    startDate: '2026-03-25',
    startTime: '09:00',
    endDate: '2026-03-25',
    endTime: '16:00',
    location: '城市公园',
    address: '上海市浦东新区世纪公园',
    participants: 31,
    maxParticipants: 40,
    deadline: '2026-03-24 18:00',
    description: '拥抱春天，感受自然，放松身心。活动将包括徒步、野餐、游戏等环节，让大家在繁忙的工作之余，享受大自然的美好。',
    requirements: '1. 身体健康\n2. 穿着舒适的运动鞋\n3. 自备水杯\n4. 服从组织者安排',
    notes: '1. 公司提供往返班车\n2. 提供野餐食品\n3. 建议携带防晒用品',
    rewards: '1. 参与奖：精美纪念品一份\n2. 摄影比赛获胜者：奖金200元\n3. 游戏获胜者：额外礼品一份',
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=outdoor%20spring%20hiking%20trip%20with%20group%20of%20people%20in%20park&image_size=landscape_16_9',
    images: [
      'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=spring%20park%20with%20blossoming%20trees&image_size=landscape_16_9',
      'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=group%20of%20people%20having%20picnic%20in%20park&image_size=landscape_16_9'
    ],
    joined: false
  },
  {
    id: 5,
    title: '员工生日会',
    type: 'culture',
    typeName: '文体活动',
    organizer: '行政部',
    organizerContact: '陈老师 13800138005',
    startDate: '2026-03-05',
    startTime: '17:30',
    endDate: '2026-03-05',
    endTime: '19:00',
    location: '公司餐厅',
    address: '上海市浦东新区张江高科技园区博云路2号',
    participants: 15,
    maxParticipants: 20,
    deadline: '2026-03-04 18:00',
    description: '为三月份生日的员工举办集体生日会，共度美好时光。活动将包括生日祝福、蛋糕分享、游戏互动等环节。',
    requirements: '1. 三月份生日的员工\n2. 提前报名\n3. 准时参加',
    notes: '1. 公司提供生日蛋糕和小礼品\n2. 欢迎带上家属\n3. 活动结束后可领取纪念品',
    rewards: '1. 生日员工：生日礼金200元\n2. 生日员工：生日蛋糕和礼品\n3. 参与员工：小礼品一份',
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=birthday%20party%20celebration%20with%20cake%20and%20colleagues&image_size=landscape_16_9',
    images: [
      'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=colorful%20birthday%20cake%20with%20candles&image_size=landscape_16_9',
      'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=company%20canteen%20decorated%20for%20party&image_size=landscape_16_9'
    ],
    joined: false
  },
  {
    id: 6,
    title: '为期两天的技能培训',
    type: 'skill',
    typeName: '技能提升',
    organizer: '培训部',
    organizerContact: '王老师 13800138003',
    startDate: '2026-03-28',
    startTime: '09:00',
    endDate: '2026-03-29',
    endTime: '17:00',
    location: '公司培训中心',
    address: '上海市浦东新区张江高科技园区博云路2号',
    participants: 20,
    maxParticipants: 25,
    deadline: '2026-03-27 18:00',
    description: '为期两天的职业技能提升培训，包括理论学习和实操训练。本次培训将邀请行业专家进行授课，内容涵盖最新的行业动态、技术趋势和实用技能。',
    requirements: '1. 提前10分钟到场\n2. 携带笔记本和笔\n3. 关闭手机或调至静音',
    notes: '1. 培训结束后将进行小测验\n2. 合格者将获得培训证书\n3. 提供午餐',
    rewards: '1. 培训证书：提升职业竞争力\n2. 测验优秀者：奖金500元\n3. 全勤参与：积分奖励100分\n4. 实操考核优秀者：额外学习资料包',
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20training%20session%20in%20classroom%20with%20workers%20learning&image_size=landscape_16_9',
    images: [
      'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=modern%20training%20center%20with%20projectors%20and%20chairs&image_size=landscape_16_9',
      'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=workers%20practicing%20skills%20in%20training%20workshop&image_size=landscape_16_9'
    ],
    joined: false
  }
]

// 获取活动详情
const getActivityDetail = () => {
  loading.value = true
  const id = Number(route.params.id)
  
  // 模拟异步请求
  setTimeout(() => {
    const foundActivity = mockActivities.find(a => a.id === id)
    if (foundActivity) {
      activity.value = foundActivity
      isJoined.value = foundActivity.joined
    } else {
      ElMessage.error('活动不存在')
      router.push('/worker/entertainment')
    }
    loading.value = false
  }, 500)
}

// 报名活动
const joinActivity = () => {
  if (activity.value.participants >= activity.value.maxParticipants) {
    ElMessage.warning('活动人数已满')
    return
  }
  
  // 模拟报名操作
  setTimeout(() => {
    isJoined.value = true
    activity.value.participants += 1
    ElMessage.success('报名成功')
  }, 500)
}

// 取消报名
const cancelJoin = () => {
  // 模拟取消报名操作
  setTimeout(() => {
    isJoined.value = false
    activity.value.participants -= 1
    ElMessage.success('已取消报名')
  }, 500)
}

// 页面加载时获取数据
onMounted(() => {
  getActivityDetail()
})
</script>

<template>
  <div class="worker-entertainment-detail">
    <BackButton />
    
    <!-- 加载中 -->
    <div v-if="loading" class="loading">
      <el-icon class="is-loading"><Loading /></el-icon>
      <span>加载中...</span>
    </div>
    
    <!-- 活动详情 -->
    <div v-else-if="activity" class="activity-detail">
      <!-- 活动图片 -->
      <div class="activity-image">
        <img :src="activity.image" :alt="activity.title" />
        <div class="activity-type-tag">{{ activity.typeName }}</div>
      </div>
      
      <!-- 活动信息 -->
      <div class="activity-info">
        <h1 class="activity-title">{{ activity.title }}</h1>
        
        <!-- 活动基本信息 -->
        <div class="activity-meta">
          <div class="meta-item">
            <el-icon><Calendar /></el-icon>
            <span v-if="String(activity.startDate) === String(activity.endDate)">
              {{ activity.startDate }}
            </span>
            <span v-else>
              {{ activity.startDate }} 至 {{ activity.endDate }}
            </span>
          </div>
          <div class="meta-item">
            <el-icon><Clock /></el-icon>
            <span v-if="String(activity.startDate) === String(activity.endDate)">
              {{ activity.startTime }}-{{ activity.endTime }}
            </span>
            <span v-else>
              {{ activity.startTime }}-{{ activity.endTime }} (每天)
            </span>
          </div>
          <div class="meta-item">
            <el-icon><MapLocation /></el-icon>
            <span>{{ activity.location }}</span>
          </div>
          <div class="meta-item">
            <el-icon><User /></el-icon>
            <span>{{ activity.participants }}/{{ activity.maxParticipants }}人参与</span>
          </div>
        </div>
        
        <!-- 报名截止时间 -->
        <div class="deadline-info">
          <el-icon><Timer /></el-icon>
          <span>报名截止：{{ activity.deadline }}</span>
        </div>
        
        <!-- 活动详情卡片 -->
        <div class="activity-detail-card">
          <!-- 活动介绍 -->
          <div class="detail-section">
            <div class="section-header">
              <div class="section-icon activity-icon">
                <el-icon><Star /></el-icon>
              </div>
              <h3 class="section-title">活动介绍</h3>
            </div>
            <div class="section-content rich-text-content">
              <p>{{ activity.description }}</p>
            </div>
          </div>
          
          <!-- 活动要求 -->
          <div class="detail-section">
            <div class="section-header">
              <div class="section-icon requirement-icon">
                <el-icon><Check /></el-icon>
              </div>
              <h3 class="section-title">活动要求</h3>
            </div>
            <div class="section-content">
              <ul class="requirement-list">
                <li v-for="(requirement, index) in activity.requirements.split('\n')" :key="index">
                  <el-icon class="check-icon"><Check /></el-icon>
                  <span>{{ requirement }}</span>
                </li>
              </ul>
            </div>
          </div>
          
          <!-- 活动须知 -->
          <div class="detail-section">
            <div class="section-header">
              <div class="section-icon note-icon">
                <el-icon><InfoFilled /></el-icon>
              </div>
              <h3 class="section-title">活动须知</h3>
            </div>
            <div class="section-content">
              <ul class="notes-list">
                <li v-for="(note, index) in activity.notes.split('\n')" :key="index">
                  <el-icon class="info-icon"><InfoFilled /></el-icon>
                  <span>{{ note }}</span>
                </li>
              </ul>
            </div>
          </div>
          
          <!-- 活动奖励 -->
          <div v-if="activity.rewards" class="detail-section">
            <div class="section-header">
              <div class="section-icon reward-icon">
                <el-icon><Gift /></el-icon>
              </div>
              <h3 class="section-title">活动奖励</h3>
            </div>
            <div class="section-content">
              <ul class="rewards-list">
                <li v-for="(reward, index) in activity.rewards.split('\n')" :key="index">
                  <el-icon class="gift-icon"><Gift /></el-icon>
                  <span>{{ reward }}</span>
                </li>
              </ul>
            </div>
          </div>
          
          <!-- 联系方式 -->
          <div class="detail-section">
            <div class="section-header">
              <div class="section-icon contact-icon">
                <el-icon><Phone /></el-icon>
              </div>
              <h3 class="section-title">联系方式</h3>
            </div>
            <div class="section-content">
              <div class="contact-info">
                <el-icon class="phone-icon"><Phone /></el-icon>
                <span>{{ activity.organizerContact }}</span>
              </div>
            </div>
          </div>
          
          <!-- 活动图片集 -->
          <div v-if="activity.images && activity.images.length > 0" class="detail-section">
            <div class="section-header">
              <div class="section-icon image-icon">
                <el-icon><Picture /></el-icon>
              </div>
              <h3 class="section-title">活动图片</h3>
            </div>
            <div class="section-content">
              <div class="image-gallery">
                <div v-for="(img, index) in activity.images" :key="index" class="gallery-item">
                  <el-image
                    :src="img"
                    :preview-src-list="activity.images"
                    fit="cover"
                    class="gallery-image"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 底部操作按钮 -->
      <div class="bottom-actions">
        <button 
          v-if="!isJoined" 
          class="join-button"
          :disabled="activity.participants >= activity.maxParticipants"
          @click="joinActivity"
        >
          <el-icon><Check /></el-icon>
          <span>立即报名</span>
        </button>
        <button 
          v-else 
          class="cancel-button"
          @click="cancelJoin"
        >
          <el-icon><Close /></el-icon>
          <span>取消报名</span>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.worker-entertainment-detail {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding-bottom: 80px;
}

.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 100px 0;
  color: #999;
}

.loading i {
  font-size: 48px;
  margin-bottom: 15px;
  color: #007bff;
}

/* 活动图片样式 */
.activity-image {
  position: relative;
  height: 260px;
  overflow: hidden;
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;
  background: #f0f0f0;
}

.activity-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.activity-image:hover img {
  transform: scale(1.05);
}

.activity-type-tag {
  position: absolute;
  top: 20px;
  left: 20px;
  background: #007bff;
  color: #fff;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
  box-shadow: 0 4px 12px rgba(0, 123, 255, 0.3);
  z-index: 10;
}

/* 活动信息样式 */
.activity-info {
  background-color: #fff;
  border-radius: 20px 20px 0 0;
  margin-top: -30px;
  padding: 30px 20px 80px;
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.05);
  position: relative;
  z-index: 5;
}

.activity-title {
  margin: 0 0 24px;
  font-size: 24px;
  font-weight: bold;
  color: #333;
  line-height: 1.3;
  text-align: center;
  padding: 0 20px;
}

/* 活动基本信息样式 */
.activity-meta {
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
  margin-bottom: 24px;
  padding: 20px;
  background-color: #f8f9fa;
  border-radius: 12px;
  border: 1px solid #e9ecef;
}

.meta-item {
  display: flex;
  align-items: center;
  font-size: 14px;
  color: #666;
  padding: 10px 0;
  border-bottom: 1px solid #e9ecef;
}

.meta-item:last-child {
  border-bottom: none;
}

.meta-item i {
  margin-right: 12px;
  color: #007bff;
  font-size: 16px;
  flex-shrink: 0;
}

/* 截止时间样式 */
.deadline-info {
  display: flex;
  align-items: center;
  font-size: 14px;
  color: #dc3545;
  background: #f8d7da;
  padding: 14px 20px;
  border-radius: 12px;
  margin: 0 20px 24px;
  border: 1px solid #f5c6cb;
  box-shadow: 0 2px 4px rgba(220, 53, 69, 0.1);
}

.deadline-info i {
  margin-right: 10px;
  font-size: 16px;
  color: #dc3545;
}

/* 活动详情卡片样式 */
.activity-detail-card {
  margin: 0 20px 24px;
  border-radius: 16px;
  background-color: #fff;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  border: 1px solid #e9ecef;
}

/* 详情板块样式 */
.detail-section {
  padding: 24px;
  border-bottom: 1px solid #f0f0f0;
  transition: all 0.3s ease;
}

.detail-section:last-child {
  border-bottom: none;
}

.detail-section:hover {
  background-color: #fafafa;
}

/* 板块头部样式 */
.section-header {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
}

.section-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
  font-size: 18px;
  flex-shrink: 0;
}

.activity-icon {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
}

.requirement-icon {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: #fff;
}

.note-icon {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  color: #fff;
}

.reward-icon {
  background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
  color: #fff;
}

.contact-icon {
  background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%);
  color: #fff;
}

.image-icon {
  background: linear-gradient(135deg, #d299c2 0%, #fef9d7 100%);
  color: #fff;
}

.section-title {
  margin: 0;
  font-size: 18px;
  font-weight: bold;
  color: #333;
  flex: 1;
}

/* 板块内容样式 */
.section-content {
  color: #666;
  line-height: 1.6;
}

/* 富文本内容样式 */
.rich-text-content {
  font-size: 15px;
  color: #555;
}

.rich-text-content p {
  margin: 0 0 12px;
}

.rich-text-content p:last-child {
  margin-bottom: 0;
}

/* 要求和须知列表样式 */
.requirement-list,
.notes-list,
.rewards-list {
  margin: 0;
  padding-left: 0;
  list-style: none;
}

.requirement-list li,
.notes-list li,
.rewards-list li {
  display: flex;
  align-items: flex-start;
  font-size: 14px;
  color: #666;
  line-height: 1.5;
  margin-bottom: 12px;
  padding: 12px 16px;
  background-color: #f8f9fa;
  border-radius: 10px;
  transition: all 0.3s ease;
}

.requirement-list li {
  border-left: 4px solid #28a745;
  background: linear-gradient(135deg, #f8f9fa 0%, #e8f5e8 100%);
}

.notes-list li {
  border-left: 4px solid #ffc107;
  background: linear-gradient(135deg, #f8f9fa 0%, #fff8e1 100%);
}

.rewards-list li {
  border-left: 4px solid #ff9800;
  background: linear-gradient(135deg, #f8f9fa 0%, #fff3e0 100%);
}

.requirement-list li:last-child,
.notes-list li:last-child,
.rewards-list li:last-child {
  margin-bottom: 0;
}

.requirement-list li:hover,
.notes-list li:hover,
.rewards-list li:hover {
  transform: translateX(4px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.check-icon,
.info-icon,
.gift-icon {
  margin-right: 12px;
  font-size: 16px;
  flex-shrink: 0;
  margin-top: 2px;
}

.check-icon {
  color: #28a745;
}

.info-icon {
  color: #ffc107;
}

.gift-icon {
  color: #ff9800;
}

/* 联系方式样式 */
.contact-info {
  display: flex;
  align-items: center;
  font-size: 14px;
  color: #666;
  background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);
  padding: 16px 20px;
  border-radius: 12px;
  border: 1px solid #bbdefb;
  transition: all 0.3s ease;
}

.contact-info:hover {
  box-shadow: 0 4px 12px rgba(25, 118, 210, 0.2);
  transform: translateY(-2px);
}

.phone-icon {
  margin-right: 12px;
  color: #1976d2;
  font-size: 18px;
  flex-shrink: 0;
}

/* 图片集样式 */
.image-gallery {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.gallery-item {
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  position: relative;
}

.gallery-item:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.gallery-image {
  width: 100%;
  height: 160px;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.gallery-item:hover .gallery-image {
  transform: scale(1.05);
}

/* 底部操作按钮样式 */
.bottom-actions {
  position: fixed;
  bottom: 60px;
  left: 0;
  right: 0;
  background: #fff;
  padding: 20px;
  box-shadow: 0 -4px 16px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: center;
  z-index: 1000;
  border-top: 1px solid #e9ecef;
}

.join-button {
  width: 100%;
  max-width: 400px;
  background: linear-gradient(135deg, #007bff 0%, #0069d9 100%);
  border: none;
  border-radius: 30px;
  padding: 16px 24px;
  font-size: 16px;
  font-weight: 600;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 123, 255, 0.3);
}

.join-button:hover:not(:disabled) {
  background: linear-gradient(135deg, #0069d9 0%, #005cbf 100%);
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 123, 255, 0.4);
}

.join-button:disabled {
  background: #6c757d;
  box-shadow: none;
  cursor: not-allowed;
  opacity: 0.7;
}

.cancel-button {
  width: 100%;
  max-width: 400px;
  background: #fff;
  border: 2px solid #dc3545;
  border-radius: 30px;
  padding: 14px 24px;
  font-size: 16px;
  font-weight: 600;
  color: #dc3545;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(220, 53, 69, 0.2);
}

.cancel-button:hover {
  background: #dc3545;
  color: #fff;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(220, 53, 69, 0.3);
}

/* 移动端适配 */
@media (max-width: 768px) {
  .activity-info {
    padding: 24px 16px 60px;
    margin-top: -25px;
  }
  
  .activity-title {
    font-size: 20px;
    margin-bottom: 20px;
    padding: 0 16px;
  }
  
  .activity-meta {
    gap: 10px;
    margin-bottom: 20px;
    padding: 16px;
  }
  
  .meta-item {
    font-size: 13px;
    padding: 8px 0;
  }
  
  .deadline-info {
    font-size: 13px;
    padding: 12px 16px;
    margin: 0 16px 20px;
  }
  
  .activity-detail-card {
    margin: 0 16px 20px;
  }
  
  .detail-section {
    padding: 20px 16px;
  }
  
  .section-icon {
    width: 36px;
    height: 36px;
    font-size: 16px;
    margin-right: 10px;
  }
  
  .section-title {
    font-size: 16px;
  }
  
  .requirement-list li,
  .notes-list li,
  .rewards-list li {
    font-size: 13px;
    padding: 10px 14px;
    margin-bottom: 10px;
  }
  
  .contact-info {
    font-size: 13px;
    padding: 14px 16px;
  }
  
  .image-gallery {
    gap: 12px;
  }
  
  .gallery-image {
    height: 120px;
  }
  
  .bottom-actions {
    bottom: 55px;
    padding: 16px;
  }
  
  .join-button,
  .cancel-button {
    padding: 14px 20px;
    font-size: 15px;
  }
}

</style>