<template>
  <div class="community-management">
    <!-- 搜索和筛选区域 -->
    <div class="search-filter-section">
      <el-row :gutter="16" align="middle">
        <el-col :span="6">
          <el-input
            v-model="searchKeyword"
            placeholder="搜索社团标题"
            prefix-icon="Search"
            clearable
            @input="handleSearch"
          />
        </el-col>
        <el-col :span="4">
          <el-select
            v-model="typeFilter"
            placeholder="社团类型"
            clearable
            @change="handleSearch"
          >
            <el-option label="全部" value="" />
            <el-option label="体育类" value="sports" />
            <el-option label="文化类" value="culture" />
            <el-option label="兴趣类" value="interest" />
          </el-select>
        </el-col>
        <el-col :span="4">
          <el-select
            v-model="approvalFilter"
            placeholder="报名审核"
            clearable
            @change="handleSearch"
          >
            <el-option label="全部" value="" />
            <el-option label="需要审核" value="true" />
            <el-option label="无需审核" value="false" />
          </el-select>
        </el-col>
        <el-col :span="10">
          <el-button type="primary" @click="handleSearch">
            <el-icon><Search /></el-icon>
            搜索
          </el-button>
          <el-button @click="handleReset">
            <el-icon><Refresh /></el-icon>
            重置
          </el-button>
        </el-col>
      </el-row>
    </div>

    <!-- 统计卡片 -->
    <div class="stats-cards">
      <el-card class="stat-card">
        <div class="stat-content">
          <div class="stat-number">{{ stats.totalCount }}</div>
          <div class="stat-label">社团总数</div>
        </div>
      </el-card>
      <el-card class="stat-card">
        <div class="stat-content">
          <div class="stat-number">{{ stats.sportsCount }}</div>
          <div class="stat-label">体育类</div>
        </div>
      </el-card>
      <el-card class="stat-card">
        <div class="stat-content">
          <div class="stat-number">{{ stats.cultureCount }}</div>
          <div class="stat-label">文化类</div>
        </div>
      </el-card>
      <el-card class="stat-card">
        <div class="stat-content">
          <div class="stat-number">{{ stats.interestCount }}</div>
          <div class="stat-label">兴趣类</div>
        </div>
      </el-card>
    </div>

    <!-- 通用表格 -->
    <CommonTable
      ref="tableRef"
      :data="tableData"
      :columns="columns"
      table-id="community-table"
      :total="total"
      :current-page="currentPage"
      :page-size="pageSize"
      :loading="loading"
      :show-selection="false"
      :show-toolbar="false"
      @update:current-page="handlePageChange"
      @update:page-size="handleSizeChange"
      @global-search="handleGlobalSearch"
    >
      <template #toolbar-right>
        <el-button type="primary" @click="handleAdd">
          <el-icon><Plus /></el-icon>
          新增社团
        </el-button>
      </template>

      <template #column-communityType="{ row }">
        <el-tag>{{ getTypeText(row.communityType) }}</el-tag>
      </template>

      <template #column-isMemberLimit="{ row }">
        <el-tag :type="row.isMemberLimit ? 'warning' : 'success'">
          {{ row.isMemberLimit ? `限${row.memberLimit}人` : '不限人数' }}
        </el-tag>
      </template>

      <template #column-isApprovalRequired="{ row }">
        <el-tag :type="row.isApprovalRequired ? 'warning' : 'success'">
          {{ row.isApprovalRequired ? '需要审核' : '无需审核' }}
        </el-tag>
      </template>

      <template #column-activityTime="{ row }">
        {{ row.activityTime || '-' }}
      </template>

      <template #actions="{ row }">
        <el-button type="primary" link @click="handleView(row)">
          <el-icon><View /></el-icon>
          查看
        </el-button>
        <el-button type="success" link @click="handleEdit(row)">
          <el-icon><Edit /></el-icon>
          编辑
        </el-button>
        <el-button type="danger" link @click="handleDelete(row)">
          <el-icon><Delete /></el-icon>
          删除
        </el-button>
        <el-button type="warning" link @click="handleUpdateIntro(row)">
          <el-icon><Document /></el-icon>
          更新介绍
        </el-button>
      </template>
    </CommonTable>

    <!-- 新增/编辑对话框 -->
    <el-dialog
      v-model="formDialogVisible"
      :title="isEdit ? '编辑社团' : '新增社团'"
      width="800px"
      :close-on-click-modal="false"
    >
      <el-form ref="formRef" :model="formData" :rules="formRules" label-width="140px">
        <el-form-item label="社团标题" prop="title">
          <el-input v-model="formData.title" placeholder="请输入社团标题" />
        </el-form-item>
        <el-form-item label="社团类型" prop="communityType">
          <el-select v-model="formData.communityType" placeholder="请选择社团类型">
            <el-option label="体育类" value="sports" />
            <el-option label="文化类" value="culture" />
            <el-option label="兴趣类" value="interest" />
          </el-select>
        </el-form-item>
        <el-form-item label="是否团员限制" prop="isMemberLimit">
          <el-switch
            v-model="formData.isMemberLimit"
            active-text="开启"
            inactive-text="关闭"
            @change="handleMemberLimitChange"
          />
        </el-form-item>
        <el-form-item v-if="formData.isMemberLimit" label="团员人数限制" prop="memberLimit">
          <el-input-number v-model="formData.memberLimit" :min="1" :max="1000" />
          <span class="form-tip">人</span>
        </el-form-item>
        <el-form-item label="是否报名审核" prop="isApprovalRequired">
          <el-switch
            v-model="formData.isApprovalRequired"
            active-text="需要审核"
            inactive-text="无需审核"
          />
        </el-form-item>
        <el-form-item label="社团简介" prop="summary">
          <el-input
            v-model="formData.summary"
            type="textarea"
            :rows="2"
            placeholder="请输入社团简介"
          />
        </el-form-item>
        <el-form-item label="社团活动地址" prop="activityAddress">
          <el-input v-model="formData.activityAddress" placeholder="请输入社团活动地址" />
        </el-form-item>
        <el-form-item label="社团活动时间" prop="activityTime">
          <el-input v-model="formData.activityTime" placeholder="如：每周六下午3点" />
        </el-form-item>
        <el-form-item label="加入社团要求" prop="requirements">
          <el-input
            v-model="formData.requirements"
            type="textarea"
            :rows="2"
            placeholder="请输入加入社团要求"
          />
        </el-form-item>
        <el-form-item label="社团介绍" prop="introduction">
          <RichTextEditor v-model="formData.introduction" :height="'300px'" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="formDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmitForm" :loading="submitLoading">确定</el-button>
      </template>
    </el-dialog>

    <!-- 更新介绍对话框 -->
    <el-dialog
      v-model="introDialogVisible"
      title="更新社团介绍"
      width="800px"
      :close-on-click-modal="false"
    >
      <el-form v-if="currentRow" label-width="140px">
        <el-form-item label="社团标题">
          <el-input :value="currentRow.title" disabled />
        </el-form-item>
        <el-form-item label="社团介绍">
          <RichTextEditor v-model="introContent" :height="'350px'" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="introDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmitIntro" :loading="submitLoading">保存</el-button>
      </template>
    </el-dialog>

    <!-- 详情对话框 -->
    <el-dialog
      v-model="detailDialogVisible"
      title="社团详情"
      width="800px"
    >
      <div v-if="currentRow" class="detail-content">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="社团标题">
            {{ currentRow.title }}
          </el-descriptions-item>
          <el-descriptions-item label="社团类型">
            <el-tag>{{ getTypeText(currentRow.communityType) }}</el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="是否团员限制">
            <el-tag :type="currentRow.isMemberLimit ? 'warning' : 'success'">
              {{ currentRow.isMemberLimit ? `限${currentRow.memberLimit}人` : '不限人数' }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="是否报名审核">
            <el-tag :type="currentRow.isApprovalRequired ? 'warning' : 'success'">
              {{ currentRow.isApprovalRequired ? '需要审核' : '无需审核' }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="社团简介" :span="2">
            {{ currentRow.summary || '-' }}
          </el-descriptions-item>
          <el-descriptions-item label="社团活动地址" :span="2">
            {{ currentRow.activityAddress || '-' }}
          </el-descriptions-item>
          <el-descriptions-item label="社团活动时间" :span="2">
            {{ currentRow.activityTime || '-' }}
          </el-descriptions-item>
          <el-descriptions-item label="加入社团要求" :span="2">
            {{ currentRow.requirements || '-' }}
          </el-descriptions-item>
          <el-descriptions-item label="社团介绍" :span="2">
            <div v-html="currentRow.introduction" class="community-intro"></div>
          </el-descriptions-item>
          <el-descriptions-item label="创建时间">
            {{ formatDateTime(currentRow.createTime) }}
          </el-descriptions-item>
          <el-descriptions-item label="更新时间">
            {{ formatDateTime(currentRow.updateTime) }}
          </el-descriptions-item>
        </el-descriptions>
      </div>
      <template #footer>
        <el-button @click="detailDialogVisible = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search, Refresh, Plus, View, Edit, Delete, Document } from '@element-plus/icons-vue'
import CommonTable from '@/components/CommonTable.vue'
import RichTextEditor from '../../components/RichTextEditor.vue'
import type { ColumnConfig } from '../../types/common-table'
import type { FormInstance, FormRules } from 'element-plus'

// 类型定义
interface CommunityRecord {
  id: string
  title: string
  communityType: 'sports' | 'culture' | 'interest'
  isMemberLimit: boolean
  memberLimit?: number
  isApprovalRequired: boolean
  summary: string
  activityAddress: string
  activityTime: string
  requirements: string
  introduction: string
  createTime: string
  updateTime: string
}

// 响应式数据
const searchKeyword = ref('')
const typeFilter = ref('')
const approvalFilter = ref('')
const tableData = ref<CommunityRecord[]>([])
const total = ref(0)
const currentPage = ref(1)
const pageSize = ref(10)
const loading = ref(false)
const currentRow = ref<CommunityRecord | null>(null)
const introContent = ref('')

// 对话框控制
const formDialogVisible = ref(false)
const detailDialogVisible = ref(false)
const introDialogVisible = ref(false)
const isEdit = ref(false)
const submitLoading = ref(false)
const formRef = ref<FormInstance>()

// 表单数据
const formData = reactive({
  title: '',
  communityType: '' as CommunityRecord['communityType'] | '',
  isMemberLimit: false,
  memberLimit: 50,
  isApprovalRequired: true,
  summary: '',
  activityAddress: '',
  activityTime: '',
  requirements: '',
  introduction: ''
})

// 表单验证规则
const formRules: FormRules = {
  title: [{ required: true, message: '请输入社团标题', trigger: 'blur' }],
  communityType: [{ required: true, message: '请选择社团类型', trigger: 'change' }],
  memberLimit: [
    {
      required: true,
      message: '请输入团员人数限制',
      trigger: 'blur',
      validator: (_rule: any, value: any, callback: any) => {
        if (formData.isMemberLimit && !value) {
          callback(new Error('请输入团员人数限制'))
        } else {
          callback()
        }
      }
    }
  ],
  activityAddress: [{ required: true, message: '请输入社团活动地址', trigger: 'blur' }]
}

// 表格列配置
const columns: ColumnConfig[] = [
  { prop: 'title', label: '社团标题', minWidth: 200, sortable: true },
  { prop: 'communityType', label: '社团类型', minWidth: 100 },
  { prop: 'isMemberLimit', label: '团员限制', minWidth: 120 },
  { prop: 'isApprovalRequired', label: '报名审核', minWidth: 100 },
  { prop: 'summary', label: '社团简介', minWidth: 200 },
  { prop: 'activityAddress', label: '活动地址', minWidth: 150 },
  { prop: 'activityTime', label: '活动时间', minWidth: 120 }
]

// 统计数据
const stats = reactive({
  totalCount: 0,
  sportsCount: 0,
  cultureCount: 0,
  interestCount: 0
})

// 模拟数据存储
const allData = ref<CommunityRecord[]>([])

// 获取社团类型文本
const getTypeText = (type: string): string => {
  const typeMap: Record<string, string> = {
    sports: '体育类',
    culture: '文化类',
    interest: '兴趣类'
  }
  return typeMap[type] || type
}

// 格式化日期时间
const formatDateTime = (dateStr: string): string => {
  if (!dateStr) return '-'
  const date = new Date(dateStr)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const seconds = String(date.getSeconds()).padStart(2, '0')
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
}

// 生成模拟数据
const generateMockData = (): CommunityRecord[] => {
  const titles = [
    '篮球社',
    '足球社',
    '羽毛球社',
    '乒乓球社',
    '游泳社',
    '跑步社',
    '瑜伽社',
    '舞蹈社',
    '唱歌社',
    '读书会',
    '摄影社',
    '绘画社',
    '书法社',
    '棋牌社',
    '游戏社',
    '烹饪社',
    '手工社',
    '志愿者协会'
  ]
  const summaries = [
    '强身健体，结交球友',
    '以球会友，健康生活',
    '培养兴趣，丰富生活',
    '快乐运动，健康成长'
  ]
  const types: CommunityRecord['communityType'][] = ['sports', 'culture', 'interest']
  const data: CommunityRecord[] = []

  for (let i = 0; i < 18; i++) {
    const communityType = types[i < 6 ? 0 : i < 12 ? 1 : 2]
    const createTime = new Date()
    createTime.setDate(createTime.getDate() - Math.floor(Math.random() * 60))

    data.push({
      id: `COMM${String(i + 1).padStart(6, '0')}`,
      title: titles[i],
      communityType,
      isMemberLimit: i % 3 === 0,
      memberLimit: i % 3 === 0 ? (i + 1) * 10 : undefined,
      isApprovalRequired: i % 2 === 0,
      summary: summaries[i % summaries.length],
      activityAddress: `活动中心${(i % 5) + 1}号场地`,
      activityTime: i < 6 ? '每周六下午3点' : i < 12 ? '每周日下午2点' : '每周三晚上7点',
      requirements: i % 2 === 0 ? '热爱运动，积极参与' : '无特殊要求',
      introduction: `<h3>${titles[i]}介绍</h3><p>${summaries[i % summaries.length]}</p><p>欢迎大家加入！</p>`,
      createTime: createTime.toISOString(),
      updateTime: new Date().toISOString()
    })
  }

  return data
}

// 搜索处理
const handleSearch = () => {
  currentPage.value = 1
  fetchData()
}

// 重置搜索
const handleReset = () => {
  searchKeyword.value = ''
  typeFilter.value = ''
  approvalFilter.value = ''
  handleSearch()
}

// 分页变化
const handlePageChange = (page: number) => {
  currentPage.value = page
  fetchData()
}

// 每页条数变化
const handleSizeChange = (size: number) => {
  pageSize.value = size
  fetchData()
}

// 全局搜索
const handleGlobalSearch = (keyword: string) => {
  searchKeyword.value = keyword
  handleSearch()
}

// 获取数据
const fetchData = () => {
  loading.value = true

  let filteredData = [...allData.value]

  if (searchKeyword.value) {
    filteredData = filteredData.filter(item =>
      item.title.toLowerCase().includes(searchKeyword.value.toLowerCase())
    )
  }

  if (typeFilter.value) {
    filteredData = filteredData.filter(item => item.communityType === typeFilter.value)
  }

  if (approvalFilter.value) {
    const isRequired = approvalFilter.value === 'true'
    filteredData = filteredData.filter(item => item.isApprovalRequired === isRequired)
  }

  // 更新统计
  stats.totalCount = filteredData.length
  stats.sportsCount = filteredData.filter(item => item.communityType === 'sports').length
  stats.cultureCount = filteredData.filter(item => item.communityType === 'culture').length
  stats.interestCount = filteredData.filter(item => item.communityType === 'interest').length

  // 分页
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  tableData.value = filteredData.slice(start, end)
  total.value = filteredData.length

  loading.value = false
}

// 团员限制开关变化
const handleMemberLimitChange = (value: boolean) => {
  if (!value) {
    formData.memberLimit = 50
  }
}

// 新增
const handleAdd = () => {
  isEdit.value = false
  formData.title = ''
  formData.communityType = ''
  formData.isMemberLimit = false
  formData.memberLimit = 50
  formData.isApprovalRequired = true
  formData.summary = ''
  formData.activityAddress = ''
  formData.activityTime = ''
  formData.requirements = ''
  formData.introduction = ''
  formDialogVisible.value = true
}

// 编辑
const handleEdit = (row: CommunityRecord) => {
  isEdit.value = true
  currentRow.value = row
  formData.title = row.title
  formData.communityType = row.communityType
  formData.isMemberLimit = row.isMemberLimit
  formData.memberLimit = row.memberLimit || 50
  formData.isApprovalRequired = row.isApprovalRequired
  formData.summary = row.summary
  formData.activityAddress = row.activityAddress
  formData.activityTime = row.activityTime
  formData.requirements = row.requirements
  formData.introduction = row.introduction
  formDialogVisible.value = true
}

// 提交表单
const handleSubmitForm = async () => {
  if (!formRef.value) return

  await formRef.value.validate()

  submitLoading.value = true

  try {
    if (isEdit.value && currentRow.value) {
      // 编辑
      const index = allData.value.findIndex(item => item.id === currentRow.value!.id)
      if (index > -1) {
        allData.value[index] = {
          ...allData.value[index],
          ...formData,
          updateTime: new Date().toISOString()
        }
      }
      ElMessage.success('修改成功')
    } else {
      // 新增
      const now = new Date().toISOString()
      const newRecord: CommunityRecord = {
        id: `COMM${Date.now()}`,
        title: formData.title,
        communityType: formData.communityType as CommunityRecord['communityType'],
        isMemberLimit: formData.isMemberLimit,
        memberLimit: formData.isMemberLimit ? formData.memberLimit : undefined,
        isApprovalRequired: formData.isApprovalRequired,
        summary: formData.summary,
        activityAddress: formData.activityAddress,
        activityTime: formData.activityTime,
        requirements: formData.requirements,
        introduction: formData.introduction,
        createTime: now,
        updateTime: now
      }
      allData.value.unshift(newRecord)
      ElMessage.success('新增成功')
    }

    formDialogVisible.value = false
    fetchData()
  } finally {
    submitLoading.value = false
  }
}

// 查看详情
const handleView = (row: CommunityRecord) => {
  currentRow.value = row
  detailDialogVisible.value = true
}

// 删除
const handleDelete = (row: CommunityRecord) => {
  ElMessageBox.confirm('确定要删除该社团吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    const index = allData.value.findIndex(item => item.id === row.id)
    if (index > -1) {
      allData.value.splice(index, 1)
    }
    ElMessage.success('删除成功')
    fetchData()
  }).catch(() => {})
}

// 更新介绍
const handleUpdateIntro = (row: CommunityRecord) => {
  currentRow.value = row
  introContent.value = row.introduction
  introDialogVisible.value = true
}

// 提交更新介绍
const handleSubmitIntro = () => {
  if (!currentRow.value) return

  if (!introContent.value) {
    ElMessage.warning('请输入社团介绍')
    return
  }

  submitLoading.value = true

  try {
    const index = allData.value.findIndex(item => item.id === currentRow.value!.id)
    if (index > -1) {
      allData.value[index].introduction = introContent.value
      allData.value[index].updateTime = new Date().toISOString()
    }

    ElMessage.success('社团介绍更新成功')
    introDialogVisible.value = false
    fetchData()
  } finally {
    submitLoading.value = false
  }
}

// 生命周期
onMounted(() => {
  allData.value = generateMockData()
  fetchData()
})
</script>

<style scoped>
.community-management {
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
}

.search-filter-section {
  margin-bottom: 20px;
  padding: 16px;
  background-color: #f5f7fa;
  border-radius: 4px;
}

.stats-cards {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 20px;
}

.stat-card {
  text-align: center;
}

.stat-content {
  padding: 10px 0;
}

.stat-number {
  font-size: 24px;
  font-weight: bold;
  color: #409eff;
  margin-bottom: 8px;
}

.stat-label {
  font-size: 14px;
  color: #606266;
}

.form-tip {
  margin-left: 8px;
  color: #909399;
}

.detail-content {
  padding: 10px;
}

.community-intro {
  max-height: 400px;
  overflow-y: auto;
}

/* 响应式设计 */
@media screen and (max-width: 1200px) {
  .stats-cards {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media screen and (max-width: 768px) {
  .search-filter-section :deep(.el-row) {
    flex-direction: column;
  }

  .search-filter-section :deep(.el-col) {
    width: 100%;
    margin-bottom: 12px;
  }

  .stats-cards {
    grid-template-columns: 1fr;
  }
}
</style>
