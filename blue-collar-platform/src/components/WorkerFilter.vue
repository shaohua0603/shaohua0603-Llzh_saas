<template>
  <div class="worker-filter-container">
    <!-- 筛选条件区域 -->
    <el-collapse v-model="activeFilterGroups" class="filter-collapse">
      <el-collapse-item title="筛选条件" name="filter">
        <el-form :model="filterForm" label-width="100px" class="filter-form">
          <el-row :gutter="20">
            <!-- 基本信息筛选 -->
            <el-col :span="6">
              <el-form-item label="姓名">
                <el-input
                  v-model="filterForm.name"
                  placeholder="请输入姓名"
                  clearable
                  @clear="handleFilterChange"
                />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="手机号">
                <el-input
                  v-model="filterForm.phone"
                  placeholder="请输入手机号"
                  clearable
                  @clear="handleFilterChange"
                />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="性别">
                <el-select
                  v-model="filterForm.gender"
                  placeholder="请选择性别"
                  clearable
                  @change="handleFilterChange"
                >
                  <el-option label="男" value="male" />
                  <el-option label="女" value="female" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="学历">
                <el-select
                  v-model="filterForm.education"
                  placeholder="请选择学历"
                  clearable
                  @change="handleFilterChange"
                >
                  <el-option label="初中" value="junior" />
                  <el-option label="高中" value="high" />
                  <el-option label="中专" value="secondary" />
                  <el-option label="大专" value="college" />
                  <el-option label="本科" value="bachelor" />
                  <el-option label="硕士" value="master" />
                  <el-option label="博士" value="doctor" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="20">
            <!-- 工作信息筛选 -->
            <el-col :span="6">
              <el-form-item label="工厂">
                <el-select
                  v-model="filterForm.factoryId"
                  placeholder="请选择工厂"
                  clearable
                  filterable
                  @change="handleFactoryChange"
                >
                  <el-option
                    v-for="factory in factoryOptions"
                    :key="factory.id"
                    :label="factory.name"
                    :value="factory.id"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="区域">
                <el-select
                  v-model="filterForm.areaId"
                  placeholder="请选择区域"
                  clearable
                  filterable
                  :disabled="!filterForm.factoryId"
                  @change="handleAreaChange"
                >
                  <el-option
                    v-for="area in areaOptions"
                    :key="area.id"
                    :label="area.name"
                    :value="area.id"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="产线">
                <el-select
                  v-model="filterForm.lineId"
                  placeholder="请选择产线"
                  clearable
                  filterable
                  :disabled="!filterForm.areaId"
                  @change="handleFilterChange"
                >
                  <el-option
                    v-for="line in lineOptions"
                    :key="line.id"
                    :label="line.name"
                    :value="line.id"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="劳务公司">
                <el-select
                  v-model="filterForm.laborCompanyId"
                  placeholder="请选择劳务公司"
                  clearable
                  filterable
                  @change="handleFilterChange"
                >
                  <el-option
                    v-for="company in laborCompanyOptions"
                    :key="company.id"
                    :label="company.name"
                    :value="company.id"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="20">
            <!-- 岗位信息筛选 -->
            <el-col :span="6">
              <el-form-item label="岗位类别">
                <el-select
                  v-model="filterForm.positionCategory"
                  placeholder="请选择岗位类别"
                  clearable
                  @change="handlePositionCategoryChange"
                >
                  <el-option label="普工" value="worker" />
                  <el-option label="技工" value="technician" />
                  <el-option label="干部" value="manager" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="岗位名称">
                <el-select
                  v-model="filterForm.positionId"
                  placeholder="请选择岗位名称"
                  clearable
                  filterable
                  :disabled="!filterForm.positionCategory"
                  @change="handleFilterChange"
                >
                  <el-option
                    v-for="position in positionOptions"
                    :key="position.id"
                    :label="position.name"
                    :value="position.id"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="工人状态">
                <el-select
                  v-model="filterForm.workerStatus"
                  placeholder="请选择工人状态"
                  clearable
                  @change="handleFilterChange"
                >
                  <el-option label="注册" value="registered" />
                  <el-option label="接送" value="pickup" />
                  <el-option label="劳务运维人员" value="labor_employee" />
                  <el-option label="工厂正式人员" value="factory_employee" />
                  <el-option label="初次面试" value="initial_interview" />
                  <el-option label="合同签订" value="contract_signed" />
                  <el-option label="面试邀约" value="interview_invited" />
                  <el-option label="工厂面试" value="factory_interview" />
                  <el-option label="进厂" value="entered" />
                  <el-option label="离职" value="resigned" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="籍贯">
                <el-input
                  v-model="filterForm.nativePlace"
                  placeholder="请输入籍贯"
                  clearable
                  @clear="handleFilterChange"
                />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="20">
            <!-- 时间和年龄范围筛选 -->
            <el-col :span="12">
              <el-form-item label="入职时间">
                <el-date-picker
                  v-model="filterForm.hireDateRange"
                  type="daterange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  format="YYYY-MM-DD"
                  value-format="YYYY-MM-DD"
                  @change="handleFilterChange"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="年龄范围">
                <div class="age-range">
                  <el-input-number
                    v-model="filterForm.minAge"
                    :min="16"
                    :max="65"
                    placeholder="最小年龄"
                    controls-position="right"
                    @change="handleFilterChange"
                  />
                  <span class="age-separator">-</span>
                  <el-input-number
                    v-model="filterForm.maxAge"
                    :min="16"
                    :max="65"
                    placeholder="最大年龄"
                    controls-position="right"
                    @change="handleFilterChange"
                  />
                </div>
              </el-form-item>
            </el-col>
          </el-row>

          <!-- 操作按钮 -->
          <el-row>
            <el-col :span="24" class="filter-actions">
              <el-button type="primary" :icon="Search" @click="handleSearch">
                查询
              </el-button>
              <el-button :icon="Refresh" @click="handleReset">
                重置
              </el-button>
              <el-button :icon="FolderOpened" @click="handleSaveFilter">
                保存筛选条件
              </el-button>
              <el-button :icon="Folder" @click="handleLoadFilter">
                加载筛选条件
              </el-button>
            </el-col>
          </el-row>
        </el-form>
      </el-collapse-item>
    </el-collapse>

    <!-- 保存筛选条件对话框 -->
    <el-dialog
      v-model="saveFilterVisible"
      title="保存筛选条件"
      width="400px"
      :close-on-click-modal="false"
    >
      <el-form :model="saveFilterForm" label-width="100px">
        <el-form-item label="筛选名称">
          <el-input v-model="saveFilterForm.name" placeholder="请输入筛选名称" />
        </el-form-item>
        <el-form-item label="设为默认">
          <el-switch v-model="saveFilterForm.isDefault" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="saveFilterVisible = false">取消</el-button>
        <el-button type="primary" @click="handleConfirmSaveFilter">确定</el-button>
      </template>
    </el-dialog>

    <!-- 加载筛选条件对话框 -->
    <el-dialog
      v-model="loadFilterVisible"
      title="加载筛选条件"
      width="600px"
      :close-on-click-modal="false"
    >
      <div class="saved-filters">
        <div
          v-for="filter in savedFilters"
          :key="filter.id"
          class="filter-item"
          @click="handleApplyFilter(filter)"
        >
          <div class="filter-info">
            <span class="filter-name">{{ filter.name }}</span>
            <el-tag v-if="filter.isDefault" size="small" type="success">默认</el-tag>
          </div>
          <div class="filter-actions">
            <el-button
              size="small"
              type="primary"
              link
              @click.stop="handleApplyFilter(filter)"
            >
              应用
            </el-button>
            <el-button
              size="small"
              type="danger"
              link
              @click.stop="handleDeleteFilter(filter.id)"
            >
              删除
            </el-button>
          </div>
        </div>
        <el-empty v-if="savedFilters.length === 0" description="暂无保存的筛选条件" />
      </div>
      <template #footer>
        <el-button @click="loadFilterVisible = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { Search, Refresh, FolderOpened, Folder } from '@element-plus/icons-vue'

// Props定义
interface Props {
  /** 是否默认展开筛选条件 */
  defaultExpand?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  defaultExpand: false
})

// Emits定义
const emit = defineEmits<{
  'filter-change': [filters: WorkerFilterForm]
  'search': [filters: WorkerFilterForm]
  'reset': []
}>()

// 筛选表单数据
interface WorkerFilterForm {
  name: string
  phone: string
  gender: string
  education: string
  factoryId: string
  areaId: string
  lineId: string
  laborCompanyId: string
  positionCategory: string
  positionId: string
  workerStatus: string
  nativePlace: string
  hireDateRange: string[]
  minAge: number
  maxAge: number
}

const filterForm = reactive<WorkerFilterForm>({
  name: '',
  phone: '',
  gender: '',
  education: '',
  factoryId: '',
  areaId: '',
  lineId: '',
  laborCompanyId: '',
  positionCategory: '',
  positionId: '',
  workerStatus: '',
  nativePlace: '',
  hireDateRange: [],
  minAge: undefined,
  maxAge: undefined
})

// 响应式数据
const activeFilterGroups = ref<string[]>(props.defaultExpand ? ['filter'] : [])
const saveFilterVisible = ref(false)
const loadFilterVisible = ref(false)
const saveFilterForm = reactive({
  name: '',
  isDefault: false
})

// 选项数据
const factoryOptions = ref<any[]>([])
const areaOptions = ref<any[]>([])
const lineOptions = ref<any[]>([])
const laborCompanyOptions = ref<any[]>([])
const positionOptions = ref<any[]>([])
const savedFilters = ref<any[]>([])

// 获取当前用户ID
const getCurrentUserId = () => {
  const userInfo = localStorage.getItem('userInfo')
  if (userInfo) {
    try {
      const user = JSON.parse(userInfo)
      return user.id || 'default'
    } catch {
      return 'default'
    }
  }
  return 'default'
}

// 获取存储键
const getStorageKey = (type: string) => {
  const userId = getCurrentUserId()
  return `worker-filter-${type}-${userId}`
}

// 加载工厂选项
const loadFactoryOptions = async () => {
  try {
    // TODO: 调用实际API
    // const response = await axios.get('/api/factories')
    // factoryOptions.value = response.data

    // 模拟数据
    factoryOptions.value = [
      { id: 'factory-1', name: '工厂A' },
      { id: 'factory-2', name: '工厂B' },
      { id: 'factory-3', name: '工厂C' }
    ]
  } catch (error) {
    ElMessage.error('加载工厂列表失败')
  }
}

// 加载劳务公司选项
const loadLaborCompanyOptions = async () => {
  try {
    // TODO: 调用实际API
    // const response = await axios.get('/api/labor-companies')
    // laborCompanyOptions.value = response.data

    // 模拟数据
    laborCompanyOptions.value = [
      { id: 'company-1', name: '劳务公司A' },
      { id: 'company-2', name: '劳务公司B' },
      { id: 'company-3', name: '劳务公司C' }
    ]
  } catch (error) {
    ElMessage.error('加载劳务公司列表失败')
  }
}

// 加载区域选项
const loadAreaOptions = async (factoryId: string) => {
  if (!factoryId) {
    areaOptions.value = []
    return
  }

  try {
    // TODO: 调用实际API
    // const response = await axios.get(`/api/factories/${factoryId}/areas`)
    // areaOptions.value = response.data

    // 模拟数据
    areaOptions.value = [
      { id: 'area-1', name: '区域A' },
      { id: 'area-2', name: '区域B' },
      { id: 'area-3', name: '区域C' }
    ]
  } catch (error) {
    ElMessage.error('加载区域列表失败')
  }
}

// 加载产线选项
const loadLineOptions = async (areaId: string) => {
  if (!areaId) {
    lineOptions.value = []
    return
  }

  try {
    // TODO: 调用实际API
    // const response = await axios.get(`/api/areas/${areaId}/lines`)
    // lineOptions.value = response.data

    // 模拟数据
    lineOptions.value = [
      { id: 'line-1', name: '产线A' },
      { id: 'line-2', name: '产线B' },
      { id: 'line-3', name: '产线C' }
    ]
  } catch (error) {
    ElMessage.error('加载产线列表失败')
  }
}

// 加载岗位选项
const loadPositionOptions = async (category: string) => {
  if (!category) {
    positionOptions.value = []
    return
  }

  try {
    // TODO: 调用实际API
    // const response = await axios.get(`/api/positions?category=${category}`)
    // positionOptions.value = response.data

    // 模拟数据
    positionOptions.value = [
      { id: 'position-1', name: '岗位A' },
      { id: 'position-2', name: '岗位B' },
      { id: 'position-3', name: '岗位C' }
    ]
  } catch (error) {
    ElMessage.error('加载岗位列表失败')
  }
}

// 工厂变化
const handleFactoryChange = (factoryId: string) => {
  filterForm.areaId = ''
  filterForm.lineId = ''
  areaOptions.value = []
  lineOptions.value = []
  if (factoryId) {
    loadAreaOptions(factoryId)
  }
  handleFilterChange()
}

// 区域变化
const handleAreaChange = (areaId: string) => {
  filterForm.lineId = ''
  lineOptions.value = []
  if (areaId) {
    loadLineOptions(areaId)
  }
  handleFilterChange()
}

// 岗位类别变化
const handlePositionCategoryChange = (category: string) => {
  filterForm.positionId = ''
  positionOptions.value = []
  if (category) {
    loadPositionOptions(category)
  }
  handleFilterChange()
}

// 筛选条件变化
const handleFilterChange = () => {
  emit('filter-change', { ...filterForm })
}

// 查询
const handleSearch = () => {
  emit('search', { ...filterForm })
}

// 重置
const handleReset = () => {
  Object.assign(filterForm, {
    name: '',
    phone: '',
    gender: '',
    education: '',
    factoryId: '',
    areaId: '',
    lineId: '',
    laborCompanyId: '',
    positionCategory: '',
    positionId: '',
    workerStatus: '',
    nativePlace: '',
    hireDateRange: [],
    minAge: undefined,
    maxAge: undefined
  })
  areaOptions.value = []
  lineOptions.value = []
  positionOptions.value = []
  emit('reset')
}

// 保存筛选条件
const handleSaveFilter = () => {
  saveFilterForm.name = ''
  saveFilterForm.isDefault = false
  saveFilterVisible.value = true
}

// 确认保存筛选条件
const handleConfirmSaveFilter = () => {
  if (!saveFilterForm.name) {
    ElMessage.warning('请输入筛选名称')
    return
  }

  const newFilter = {
    id: Date.now().toString(),
    name: saveFilterForm.name,
    isDefault: saveFilterForm.isDefault,
    filters: { ...filterForm },
    userId: getCurrentUserId(),
    createdAt: new Date().toISOString()
  }

  // 如果设为默认,取消其他默认筛选
  if (newFilter.isDefault) {
    savedFilters.value.forEach(filter => filter.isDefault = false)
  }

  savedFilters.value.push(newFilter)
  localStorage.setItem(getStorageKey('saved'), JSON.stringify(savedFilters.value))

  ElMessage.success('筛选条件保存成功')
  saveFilterVisible.value = false
}

// 加载筛选条件
const handleLoadFilter = () => {
  const saved = localStorage.getItem(getStorageKey('saved'))
  if (saved) {
    try {
      savedFilters.value = JSON.parse(saved)
    } catch {
      savedFilters.value = []
    }
  } else {
    savedFilters.value = []
  }
  loadFilterVisible.value = true
}

// 应用筛选条件
const handleApplyFilter = (filter: any) => {
  Object.assign(filterForm, filter.filters)

  // 级联加载选项
  if (filterForm.factoryId) {
    loadAreaOptions(filterForm.factoryId)
  }
  if (filterForm.areaId) {
    loadLineOptions(filterForm.areaId)
  }
  if (filterForm.positionCategory) {
    loadPositionOptions(filterForm.positionCategory)
  }

  emit('filter-change', { ...filterForm })
  ElMessage.success('筛选条件应用成功')
  loadFilterVisible.value = false
}

// 删除筛选条件
const handleDeleteFilter = (filterId: string) => {
  const index = savedFilters.value.findIndex(f => f.id === filterId)
  if (index > -1) {
    savedFilters.value.splice(index, 1)
    localStorage.setItem(getStorageKey('saved'), JSON.stringify(savedFilters.value))
    ElMessage.success('删除成功')
  }
}

// 暴露方法
defineExpose({
  getFilters: () => ({ ...filterForm }),
  setFilters: (filters: Partial<WorkerFilterForm>) => {
    Object.assign(filterForm, filters)
  },
  resetFilters: handleReset
})

// 生命周期
onMounted(() => {
  loadFactoryOptions()
  loadLaborCompanyOptions()
})
</script>

<style scoped>
.worker-filter-container {
  width: 100%;
}

/* 筛选折叠面板 */
.filter-collapse {
  margin-bottom: 16px;
}

:deep(.el-collapse-item__header) {
  font-weight: 600;
  color: #303133;
}

/* 筛选表单 */
.filter-form {
  padding: 16px 0;
}

.age-range {
  display: flex;
  align-items: center;
  gap: 8px;
}

.age-separator {
  color: #909399;
}

/* 筛选操作按钮 */
.filter-actions {
  display: flex;
  gap: 12px;
  padding-top: 16px;
  border-top: 1px solid #ebeef5;
}

/* 保存的筛选条件 */
.saved-filters {
  max-height: 400px;
  overflow-y: auto;
}

.filter-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  margin-bottom: 8px;
  background-color: #f5f7fa;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
}

.filter-item:hover {
  background-color: #e6f7ff;
}

.filter-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.filter-name {
  font-weight: 500;
  color: #303133;
}

.filter-actions {
  display: flex;
  gap: 8px;
}

/* 响应式设计 */
@media screen and (max-width: 768px) {
  .filter-actions {
    flex-wrap: wrap;
  }

  .filter-actions .el-button {
    flex: 1;
    min-width: 120px;
  }
}
</style>
