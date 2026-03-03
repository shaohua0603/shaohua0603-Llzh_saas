<template>
  <div class="commission-rule-container">
    <!-- 内容区域 -->
    <div class="content-section">
      <!-- 日结规则配置 -->
      <el-card>
        <template #header>
          <div class="card-header">
            <span class="card-title">日结佣金规则配置</span>
          </div>
        </template>
        <el-form :model="dailyRule" label-width="180px" label-position="right">
          <el-form-item label="进厂天数要求">
            <el-input-number v-model="dailyRule.requiredDays" :min="0" :max="365" />
            <span style="margin-left: 10px">天</span>
          </el-form-item>
          <el-divider>发放金额配置</el-divider>
          <el-form-item label="第一次发放金额">
            <el-input-number v-model="dailyRule.firstAmount" :min="0" :precision="2" />
            <span style="margin-left: 10px">元</span>
          </el-form-item>
          <el-form-item label="第二次发放金额">
            <el-input-number v-model="dailyRule.secondAmount" :min="0" :precision="2" />
            <span style="margin-left: 10px">元</span>
          </el-form-item>
          <el-form-item label="第三次发放金额">
            <el-input-number v-model="dailyRule.thirdAmount" :min="0" :precision="2" />
            <span style="margin-left: 10px">元</span>
          </el-form-item>
          <el-form-item label="后续每次发放金额">
            <el-input-number v-model="dailyRule.subsequentAmount" :min="0" :precision="2" />
            <span style="margin-left: 10px">元</span>
          </el-form-item>
          <el-form-item label="后续发放间隔天数">
            <el-input-number v-model="dailyRule.intervalDays" :min="1" :max="90" />
            <span style="margin-left: 10px">天</span>
          </el-form-item>
        </el-form>
      </el-card>

      <!-- 月结规则配置 -->
      <el-card class="mt-4">
        <template #header>
          <div class="card-header">
            <span class="card-title">月结佣金规则配置</span>
          </div>
        </template>
        <el-form :model="monthlyRule" label-width="180px" label-position="right">
          <el-form-item label="进厂天数要求">
            <el-input-number v-model="monthlyRule.requiredDays" :min="0" :max="365" />
            <span style="margin-left: 10px">天</span>
          </el-form-item>
          <el-divider>发放金额配置</el-divider>
          <el-form-item label="第一次发放金额">
            <el-input-number v-model="monthlyRule.firstAmount" :min="0" :precision="2" />
            <span style="margin-left: 10px">元</span>
          </el-form-item>
          <el-form-item label="第二次发放金额">
            <el-input-number v-model="monthlyRule.secondAmount" :min="0" :precision="2" />
            <span style="margin-left: 10px">元</span>
          </el-form-item>
          <el-form-item label="第三次发放金额">
            <el-input-number v-model="monthlyRule.thirdAmount" :min="0" :precision="2" />
            <span style="margin-left: 10px">元</span>
          </el-form-item>
          <el-form-item label="后续每次发放金额">
            <el-input-number v-model="monthlyRule.subsequentAmount" :min="0" :precision="2" />
            <span style="margin-left: 10px">元</span>
          </el-form-item>
          <el-form-item label="后续发放间隔天数">
            <el-input-number v-model="monthlyRule.intervalDays" :min="1" :max="90" />
            <span style="margin-left: 10px">天</span>
          </el-form-item>
        </el-form>
      </el-card>

      <!-- 规则说明 -->
      <el-card class="mt-4">
        <template #header>
          <div class="card-header">
            <span class="card-title">规则说明</span>
          </div>
        </template>
        <div class="rule-description">
          <h4>发放规则：</h4>
          <ol>
            <li>进厂天数达到要求后，开始计算并发放佣金</li>
            <li>第一次、第二次、第三次发放金额独立配置</li>
            <li>第三次发放之后，按照"后续每次发放金额"和"后续发放间隔天数"循环发放</li>
            <li>离职后停止佣金发放</li>
          </ol>
          <h4>示例说明（日结）：</h4>
          <p>假设进厂天数要求为30天，第一次300元，第二次300元，第三次300元，后续每次200元，间隔30天</p>
          <ul>
            <li>进厂30天时：发放第一次300元</li>
            <li>进厂60天时：发放第二次300元</li>
            <li>进厂90天时：发放第三次300元</li>
            <li>进厂120天时：发放后续200元</li>
            <li>进厂150天时：发放后续200元</li>
            <li>...以此类推</li>
          </ul>
        </div>
      </el-card>
    </div>
    
    <!-- 底部按钮栏 -->
    <div class="form-footer">
      <el-button @click="handleBack">
        <el-icon><ArrowLeft /></el-icon>
        返回
      </el-button>
      <el-button @click="handleReset">重置</el-button>
      <el-button type="primary" @click="handleSave" :loading="saving">保存配置</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { ArrowLeft } from '@element-plus/icons-vue'

// 路由
const router = useRouter()

// 保存状态
const saving = ref(false)

// 日结规则
const dailyRule = reactive({
  requiredDays: 30,
  firstAmount: 300,
  secondAmount: 300,
  thirdAmount: 300,
  subsequentAmount: 200,
  intervalDays: 30
})

// 月结规则
const monthlyRule = reactive({
  requiredDays: 30,
  firstAmount: 500,
  secondAmount: 500,
  thirdAmount: 500,
  subsequentAmount: 300,
  intervalDays: 30
})

// 返回
const handleBack = () => {
  router.back()
}

// 重置
const handleReset = () => {
  dailyRule.requiredDays = 30
  dailyRule.firstAmount = 300
  dailyRule.secondAmount = 300
  dailyRule.thirdAmount = 300
  dailyRule.subsequentAmount = 200
  dailyRule.intervalDays = 30

  monthlyRule.requiredDays = 30
  monthlyRule.firstAmount = 500
  monthlyRule.secondAmount = 500
  monthlyRule.thirdAmount = 500
  monthlyRule.subsequentAmount = 300
  monthlyRule.intervalDays = 30
}

// 保存配置
const handleSave = async () => {
  saving.value = true
  try {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 1000))
    ElMessage.success('佣金规则配置保存成功')
  } catch (error) {
    ElMessage.error('保存失败')
  } finally {
    saving.value = false
  }
}

// 加载数据
const loadData = async () => {
  // 模拟加载已有配置
  // 实际项目中应从后端API获取
}

// 生命周期
onMounted(() => {
  loadData()
})
</script>

<style scoped>
.commission-rule-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #f5f7fa;
}

.content-section {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  padding-bottom: 80px; /* 为底部按钮栏留出空间 */
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.content-section .el-card {
  border-radius: 4px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-title {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
}

.mt-4 {
  margin-top: 16px;
}

.rule-description {
  color: #606266;
  font-size: 14px;
  line-height: 1.8;
}

.rule-description h4 {
  margin: 16px 0 8px 0;
  color: #303133;
}

.rule-description ol,
.rule-description ul {
  padding-left: 20px;
}

.rule-description li {
  margin-bottom: 4px;
}

/* 底部按钮栏 - 固定悬浮 */
.form-footer {
  position: fixed;
  bottom: 0;
  left: var(--sidebar-width);
  right: 0;
  display: flex;
  justify-content: center;
  gap: 12px;
  padding: 16px;
  background-color: #f5f7fa;
  border-top: 1px solid #e4e7ed;
  z-index: 100;
  transition: left var(--transition-base);
}

/* 响应式适配 */
@media screen and (max-width: 768px) {
  .form-footer {
    left: 0;
    flex-direction: column;
  }
  
  .form-footer .el-button {
    width: 100%;
  }
  
  .content-section {
    padding-bottom: 120px; /* 为垂直排列的按钮栏留出更多空间 */
  }
}
</style>
