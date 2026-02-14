<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElIcon, ElMessage } from 'element-plus'
import { Warning, InfoFilled, Calendar, Check, Close, ArrowLeft } from '@element-plus/icons-vue'
import BackButton from '../../components/BackButton.vue'

const route = useRoute()
const router = useRouter()
const specialCase = ref(null)
const loading = ref(true)

// 模拟特殊情况数据
const mockSpecialCases = [
  {
    id: 1,
    title: '工作场所滑倒',
    type: 'work_injury',
    date: '2026-02-01',
    status: '处理中',
    description: '在车间行走时因地面湿滑不慎滑倒，导致轻微擦伤。当时正在完成日常工作任务，突然踩到地面的水渍而失去平衡。',
    handlingMethod: '1. 立即停止工作，安排同事陪同前往医务室进行检查\n2. 对伤口进行消毒和包扎处理\n3. 拍摄现场照片，记录事故发生地点和原因\n4. 填写工伤事故报告，上报给安全管理部门\n5. 安排短期休息，避免伤口恶化\n6. 对工作场所进行安全检查，增加防滑措施',
    result: '待进一步观察。目前伤者状况稳定，已返回工作岗位，但需要定期复查。安全管理部门已对车间地面进行了防滑处理，并在易滑区域设置了警示标识。',
    relatedPersons: ['张三（目击者）', '李四（安全员）', '王五（部门主管）'],
    documents: ['工伤事故报告', '医疗证明', '现场照片']
  },
  {
    id: 2,
    title: '设备故障导致延误',
    type: 'general',
    date: '2026-01-25',
    status: '已解决',
    description: '操作的机器出现故障，导致生产任务延误。设备在运行过程中突然停止工作，显示错误代码E102。',
    handlingMethod: '1. 立即停止设备运行，切断电源\n2. 联系维修人员进行故障排查\n3. 组织人员使用备用设备继续生产\n4. 记录故障发生时间和影响范围\n5. 协助维修人员进行设备修复',
    result: '设备已恢复正常，任务已完成。维修人员发现是传感器故障，已更换新的传感器。设备现已恢复正常运行，生产任务已按时完成。为避免类似情况再次发生，已制定设备定期维护计划。',
    relatedPersons: ['赵六（维修人员）', '孙七（生产主管）'],
    documents: ['设备故障报告', '维修记录']
  },
  {
    id: 3,
    title: '原材料质量问题',
    type: 'general',
    date: '2026-01-20',
    status: '已解决',
    description: '收到的原材料存在质量缺陷，影响生产。批次为A202601的钢材出现表面锈蚀和尺寸偏差问题。',
    handlingMethod: '1. 立即停止使用该批次原材料\n2. 联系供应商说明情况，要求更换合格原材料\n3. 对已使用的原材料进行质量检查\n4. 调整生产计划，减少损失\n5. 建立原材料入库检验流程',
    result: '已收到新的原材料，生产正常进行。供应商已承认质量问题，免费更换了合格的原材料，并给予了一定的赔偿。生产计划已调整，未造成重大损失。现已建立严格的原材料入库检验流程，确保原材料质量。',
    relatedPersons: ['周八（采购主管）', '吴九（质检人员）'],
    documents: ['原材料质量检验报告', '供应商沟通记录', '赔偿协议']
  },
  {
    id: 4,
    title: '操作时手指轻微受伤',
    type: 'work_injury',
    date: '2026-01-15',
    status: '已解决',
    description: '操作机器时不小心被零件划伤手指。当时正在安装机器零件，由于操作不当，手指被金属边缘划伤。',
    handlingMethod: '1. 立即停止工作，用清水冲洗伤口\n2. 前往医务室进行消毒和包扎处理\n3. 填写工伤事故报告\n4. 安排短期休息，避免伤口感染\n5. 对操作流程进行安全培训',
    result: '伤口已愈合，无大碍。经过一周的休息和治疗，伤口已完全愈合，员工已返回工作岗位。安全管理部门已对相关操作流程进行了安全培训，强调了正确的操作方法和安全注意事项。',
    relatedPersons: ['郑十（班组长）', '王医生（厂医）'],
    documents: ['工伤事故报告', '医疗证明']
  }
]

// 获取特殊情况详情
const getSpecialCaseDetail = () => {
  loading.value = true
  const id = Number(route.params.id)
  
  // 模拟异步请求
  setTimeout(() => {
    const foundCase = mockSpecialCases.find(caseItem => caseItem.id === id)
    if (foundCase) {
      specialCase.value = foundCase
    } else {
      ElMessage.error('特殊情况不存在')
      router.push('/worker/special-cases')
    }
    loading.value = false
  }, 500)
}

// 返回特殊情况列表
const goBack = () => {
  router.push('/worker/special-cases')
}

onMounted(() => {
  getSpecialCaseDetail()
})
</script>

<template>
  <div class="worker-special-case-detail">
    <BackButton />
    
    <!-- 加载中 -->
    <div v-if="loading" class="loading">
      <el-icon class="is-loading"><InfoFilled /></el-icon>
      <span>加载中...</span>
    </div>
    
    <!-- 特殊情况详情 -->
    <div v-else-if="specialCase" class="special-case-detail">
      <!-- 特殊情况头部信息 -->
      <div class="case-header" :class="{ 'work-injury': specialCase.type === 'work_injury' }">
        <div class="case-icon">
          <el-icon v-if="specialCase.type === 'work_injury'" class="warning-icon"><Warning /></el-icon>
          <el-icon v-else class="info-icon"><InfoFilled /></el-icon>
        </div>
        <div class="case-info">
          <h1 class="case-title">{{ specialCase.title }}</h1>
          <div class="case-meta">
            <span class="case-type">{{ specialCase.type === 'work_injury' ? '工伤事故' : '一般情况' }}</span>
            <span class="case-date">{{ specialCase.date }}</span>
            <span class="case-status" :class="{ 'status-success': specialCase.status === '已解决', 'status-warning': specialCase.status === '处理中' }">{{ specialCase.status }}</span>
          </div>
        </div>
      </div>
      
      <!-- 特殊情况描述 -->
      <div class="case-section">
        <h3 class="section-title">情况描述</h3>
        <div class="case-description">
          {{ specialCase.description }}
        </div>
      </div>
      
      <!-- 处理方式 -->
      <div class="case-section">
        <h3 class="section-title">处理方式</h3>
        <ul class="handling-method">
          <li v-for="(method, index) in specialCase.handlingMethod.split('\n')" :key="index">
            {{ method }}
          </li>
        </ul>
      </div>
      
      <!-- 处理结果 -->
      <div class="case-section">
        <h3 class="section-title">处理结果</h3>
        <div class="case-result">
          {{ specialCase.result }}
        </div>
      </div>
      
      <!-- 相关人员 -->
      <div class="case-section">
        <h3 class="section-title">相关人员</h3>
        <div class="related-persons">
          <span v-for="(person, index) in specialCase.relatedPersons" :key="index" class="person-tag">
            {{ person }}
          </span>
        </div>
      </div>
      
      <!-- 相关文档 -->
      <div class="case-section">
        <h3 class="section-title">相关文档</h3>
        <div class="related-documents">
          <span v-for="(doc, index) in specialCase.documents" :key="index" class="document-tag">
            {{ doc }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.worker-special-case-detail {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding-bottom: 20px;
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

/* 特殊情况头部信息 */
.case-header {
  background-color: #fff;
  padding: 24px;
  display: flex;
  align-items: flex-start;
  gap: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  margin-bottom: 16px;
  border-left: 4px solid #007bff;
}

.case-header.work-injury {
  border-left-color: #dc3545;
}

.case-icon {
  margin-right: 12px;
  flex-shrink: 0;
}

.case-icon i {
  font-size: 32px;
}

.warning-icon {
  color: #dc3545;
}

.info-icon {
  color: #007bff;
}

.case-info {
  flex: 1;
}

.case-title {
  margin: 0 0 16px;
  font-size: 24px;
  font-weight: bold;
  color: #333;
  line-height: 1.2;
}

.case-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.case-type {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 16px;
  font-size: 12px;
  font-weight: 500;
  background-color: #e3f2fd;
  color: #007bff;
}

.case-header.work-injury .case-type {
  background-color: #f8d7da;
  color: #dc3545;
}

.case-date {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 16px;
  font-size: 12px;
  background-color: #f8f9fa;
  color: #666;
}

.case-status {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 16px;
  font-size: 12px;
  font-weight: 500;
}

.status-success {
  background-color: #d4edda;
  color: #28a745;
}

.status-warning {
  background-color: #fff3cd;
  color: #ffc107;
}

/* 特殊情况段落样式 */
.case-section {
  background-color: #fff;
  padding: 24px;
  margin-bottom: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  border-radius: 8px;
}

.section-title {
  margin: 0 0 20px;
  font-size: 18px;
  font-weight: bold;
  color: #1e293b;
  display: flex;
  align-items: center;
  border-bottom: 2px solid #007bff;
  padding-bottom: 12px;
}

.section-title::before {
  content: '';
  width: 4px;
  height: 16px;
  background-color: #007bff;
  border-radius: 2px;
  margin-right: 12px;
}

/* 情况描述 */
.case-description {
  font-size: 15px;
  color: #475569;
  line-height: 1.6;
  white-space: pre-line;
}

/* 处理方式 */
.handling-method {
  margin: 0;
  padding-left: 20px;
  list-style: none;
}

.handling-method li {
  font-size: 15px;
  color: #475569;
  line-height: 1.6;
  margin-bottom: 12px;
  position: relative;
}

.handling-method li::before {
  content: '•';
  color: #007bff;
  font-weight: bold;
  display: inline-block;
  width: 1em;
  margin-left: -1em;
}

/* 处理结果 */
.case-result {
  font-size: 15px;
  color: #475569;
  line-height: 1.6;
  white-space: pre-line;
}

/* 相关人员和文档 */
.related-persons,
.related-documents {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.person-tag,
.document-tag {
  display: inline-block;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
  background-color: #f8f9fa;
  color: #475569;
  border: 1px solid #e9ecef;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .case-header {
    padding: 20px 16px;
    gap: 16px;
  }
  
  .case-icon i {
    font-size: 24px;
  }
  
  .case-title {
    font-size: 20px;
    margin-bottom: 12px;
  }
  
  .case-meta {
    gap: 8px;
  }
  
  .case-type,
  .case-date,
  .case-status {
    font-size: 11px;
    padding: 3px 10px;
  }
  
  .case-section {
    padding: 20px 16px;
  }
  
  .section-title {
    font-size: 16px;
    margin-bottom: 16px;
  }
  
  .case-description,
  .handling-method li,
  .case-result {
    font-size: 14px;
  }
  
  .person-tag,
  .document-tag {
    font-size: 13px;
    padding: 6px 14px;
  }
}
</style>