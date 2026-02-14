<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import BackButton from '../../components/BackButton.vue'

const router = useRouter()

// 返回上一页
const goBack = () => {
  router.back()
}
</script>

<template>
  <div class="user-agreement">
    <BackButton />
    <!-- 页面标题 -->
    <div class="page-header">
      <div class="header-left" @click="goBack">
        <i class="el-icon-arrow-left"></i>
        <h2>用户协议</h2>
      </div>
    </div>
    
    <!-- 内容区域 -->
    <div class="agreement-content">
      <div class="agreement-section">
        <h3 class="section-title">1. 协议的接受</h3>
        <p>欢迎使用蓝领智汇平台（以下简称"本平台"）。本平台由上海蓝领智汇网络科技有限公司（以下简称"我们"）运营。</p>
        <p>通过注册、登录或使用本平台服务，您（以下简称"用户"）表示您已阅读并同意接受本《用户协议》（以下简称"本协议"）的全部内容。如您不同意本协议的任何条款，您应立即停止注册或使用本平台服务。</p>
        
        <h3 class="section-title">2. 用户注册与账户管理</h3>
        <p>2.1 您在注册本平台账户时，应提供真实、准确、完整的个人信息，并在信息发生变更时及时更新。</p>
        <p>2.2 您应妥善保管您的账户密码，对使用您账户进行的所有操作负全部责任。如发现账户被他人非法使用，应立即通知我们。</p>
        <p>2.3 您同意，我们有权根据您提供的信息，按照法律规定进行实名认证。</p>
        
        <h3 class="section-title">3. 平台服务内容</h3>
        <p>3.1 本平台为蓝领工人提供一站式的工作和生活服务，包括但不限于招聘信息发布、培训课程学习、考勤管理、薪资查询、生活服务等。</p>
        <p>3.2 我们有权根据业务发展需要，调整或变更平台服务内容，无需事先通知用户。</p>
        
        <h3 class="section-title">4. 用户的权利和义务</h3>
        <p>4.1 用户有权使用本平台提供的各项服务，有权对服务质量提出意见和建议。</p>
        <p>4.2 用户应遵守法律法规和本协议的规定，不得利用本平台从事违法违规活动。</p>
        <p>4.3 用户应尊重其他用户的合法权益，不得发布侵犯他人知识产权、隐私权等合法权益的内容。</p>
        <p>4.4 用户应按照本平台的要求，提供真实、准确、完整的个人信息。</p>
        
        <h3 class="section-title">5. 平台的权利和义务</h3>
        <p>5.1 我们有权对用户提交的信息进行审核，有权拒绝不符合要求的信息。</p>
        <p>5.2 我们有权对违反本协议的用户采取警告、暂停服务、注销账户等措施。</p>
        <p>5.3 我们应按照本协议的约定，为用户提供服务。</p>
        <p>5.4 我们应采取技术措施和其他必要措施，保障平台的正常运行和用户信息的安全。</p>
        
        <h3 class="section-title">6. 知识产权</h3>
        <p>6.1 本平台上的所有内容，包括但不限于文字、图片、音频、视频、软件等，均受知识产权法律法规的保护。</p>
        <p>6.2 用户未经我们书面许可，不得复制、修改、传播、分发、展示或使用本平台上的任何内容。</p>
        
        <h3 class="section-title">7. 隐私保护</h3>
        <p>我们重视用户隐私保护，将按照《隐私政策》的规定处理用户信息。</p>
        
        <h3 class="section-title">8. 协议的变更与终止</h3>
        <p>8.1 我们有权根据法律法规的变更或业务发展需要，修改本协议的内容。修改后的协议将在平台上公布，用户继续使用本平台服务视为接受修改后的协议。</p>
        <p>8.2 用户可随时终止使用本平台服务。</p>
        <p>8.3 如用户违反本协议的规定，我们有权终止向用户提供服务。</p>
        
        <h3 class="section-title">9. 免责声明</h3>
        <p>9.1 本平台仅作为信息发布和交流的平台，不对用户之间的交易或纠纷承担责任。</p>
        <p>9.2 因不可抗力或其他非我们原因导致平台服务中断或不能正常提供的，我们不承担责任。</p>
        
        <h3 class="section-title">10. 法律适用与争议解决</h3>
        <p>10.1 本协议的订立、执行、解释及争议的解决均适用中华人民共和国法律。</p>
        <p>10.2 如就本协议发生任何争议，双方应协商解决；协商不成的，任何一方均有权向有管辖权的人民法院提起诉讼。</p>
        
        <h3 class="section-title">11. 其他条款</h3>
        <p>11.1 本协议构成您与我们之间关于使用本平台服务的完整协议，取代之前的任何口头或书面协议。</p>
        <p>11.2 如本协议的任何条款被认定为无效或不可执行，该条款不影响其他条款的效力。</p>
        <p>11.3 本协议的最终解释权归上海蓝领智汇网络科技有限公司所有。</p>
        
        <div class="agreement-footer">
          <p>上海蓝领智汇网络科技有限公司</p>
          <p>更新日期：2026年02月12日</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.user-agreement {
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

.header-left i {
  font-size: 18px;
  color: #333;
  cursor: pointer;
}

.agreement-content {
  padding: 15px;
}

.agreement-section {
  background-color: #fff;
  padding: 20px;
  margin-bottom: 15px;
}

.section-title {
  margin: 20px 0 15px 0;
  font-size: 16px;
  font-weight: bold;
  color: #333;
}

.section-title:first-child {
  margin-top: 0;
}

.agreement-section p {
  margin: 0 0 10px 0;
  font-size: 14px;
  line-height: 1.6;
  color: #666;
  text-align: justify;
}

.agreement-footer {
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid #f0f0f0;
  text-align: center;
}

.agreement-footer p {
  margin: 0 0 5px 0;
  font-size: 14px;
  color: #999;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .page-header {
    padding: 12px 15px;
  }
  
  .page-header h2 {
    font-size: 16px;
  }
  
  .agreement-content {
    padding: 10px;
  }
  
  .agreement-section {
    padding: 15px;
    margin-bottom: 10px;
  }
  
  .section-title {
    font-size: 15px;
  }
  
  .agreement-section p {
    font-size: 13px;
  }
}
</style>