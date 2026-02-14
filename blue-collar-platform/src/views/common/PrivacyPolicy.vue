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
  <div class="privacy-policy">
    <BackButton />
    <!-- 页面标题 -->
    <div class="page-header">
      <div class="header-left" @click="goBack">
        <i class="el-icon-arrow-left"></i>
        <h2>隐私政策</h2>
      </div>
    </div>
    
    <!-- 内容区域 -->
    <div class="policy-content">
      <div class="policy-section">
        <h3 class="section-title">1. 隐私政策的接受</h3>
        <p>欢迎使用蓝领智汇平台（以下简称"本平台"）。本隐私政策描述了上海蓝领智汇网络科技有限公司（以下简称"我们"）如何收集、使用、存储和共享您的个人信息。</p>
        <p>通过注册、登录或使用本平台服务，您表示您已阅读并同意接受本隐私政策的全部内容。如您不同意本隐私政策的任何条款，您应立即停止注册或使用本平台服务。</p>
        
        <h3 class="section-title">2. 我们收集的信息</h3>
        <p>2.1 您提供的信息：当您注册账户、填写个人资料、申请服务或与我们联系时，您可能需要提供个人信息，如姓名、身份证号码、手机号码、银行卡号、家庭住址等。</p>
        <p>2.2 我们自动收集的信息：当您使用本平台服务时，我们可能会自动收集有关您使用情况的信息，如IP地址、浏览器类型、设备信息、访问时间、访问页面等。</p>
        <p>2.3 来自第三方的信息：我们可能会从第三方获取有关您的信息，如招聘信息、背景调查信息等。</p>
        
        <h3 class="section-title">3. 我们如何使用您的信息</h3>
        <p>3.1 提供和改进服务：我们使用您的信息为您提供服务，处理您的请求，并改进我们的服务质量。</p>
        <p>3.2 身份验证和安全：我们使用您的信息进行身份验证，防止欺诈，保护您的账户安全。</p>
        <p>3.3 沟通和通知：我们使用您的信息与您沟通，发送服务相关的通知、提醒和更新。</p>
        <p>3.4 数据分析和研究：我们可能会对收集的信息进行分析和研究，以了解用户需求，改进服务。</p>
        
        <h3 class="section-title">4. 我们如何共享您的信息</h3>
        <p>4.1 关联公司：我们可能会与我们的关联公司共享您的信息，以提供一致的服务体验。</p>
        <p>4.2 服务提供商：我们可能会与第三方服务提供商共享您的信息，以协助我们提供服务。</p>
        <p>4.3 法律法规要求：当法律、法规、政府命令或司法程序要求时，我们可能会披露您的信息。</p>
        <p>4.4 保护权益：为保护我们、我们的用户或公众的权利、财产或安全，我们可能会披露您的信息。</p>
        
        <h3 class="section-title">5. 信息的存储和保护</h3>
        <p>5.1 存储期限：我们将按照法律法规的要求和业务需要，存储您的个人信息。</p>
        <p>5.2 安全措施：我们采取多种安全措施，如加密技术、访问控制、安全审计等，保护您的个人信息安全。</p>
        <p>5.3 数据传输：您的个人信息可能会传输到您所在国家或地区以外的服务器进行存储和处理。</p>
        
        <h3 class="section-title">6. 您的权利</h3>
        <p>6.1 访问和修改：您有权访问和修改您的个人信息。</p>
        <p>6.2 删除：在符合法律法规要求的情况下，您有权请求删除您的个人信息。</p>
        <p>6.3 限制处理：您有权请求限制对您个人信息的处理。</p>
        <p>6.4 数据携带：您有权请求以结构化、机器可读的格式获取您的个人信息。</p>
        
        <h3 class="section-title">7. 隐私政策的变更</h3>
        <p>我们可能会根据法律法规的变更或业务发展需要，修改本隐私政策。修改后的隐私政策将在平台上公布，您继续使用本平台服务视为接受修改后的隐私政策。</p>
        
        <h3 class="section-title">8. 联系我们</h3>
        <p>如果您对本隐私政策有任何疑问或建议，您可以通过以下方式联系我们：</p>
        <p>联系电话：400-888-8888</p>
        <p>公司地址：上海市浦东新区张江高科技园区博云路2号</p>
        
        <div class="policy-footer">
          <p>上海蓝领智汇网络科技有限公司</p>
          <p>更新日期：2026年02月12日</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.privacy-policy {
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

.policy-content {
  padding: 15px;
}

.policy-section {
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

.policy-section p {
  margin: 0 0 10px 0;
  font-size: 14px;
  line-height: 1.6;
  color: #666;
  text-align: justify;
}

.policy-footer {
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid #f0f0f0;
  text-align: center;
}

.policy-footer p {
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
  
  .policy-content {
    padding: 10px;
  }
  
  .policy-section {
    padding: 15px;
    margin-bottom: 10px;
  }
  
  .section-title {
    font-size: 15px;
  }
  
  .policy-section p {
    font-size: 13px;
  }
}
</style>