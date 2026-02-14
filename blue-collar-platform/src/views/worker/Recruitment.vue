<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Loading, InfoFilled, OfficeBuilding, Document, Present, Phone, Timer, Filter, Search, Refresh, ArrowDown } from '@element-plus/icons-vue'
import BackButton from '../../components/BackButton.vue'

const router = useRouter()
const activeTab = ref('1')
const recruitments = ref([])
const loading = ref(true)
const isSearchFormExpanded = ref(true)

// 查询条件
const searchForm = ref({
  position: '',
  minSalary: '',
  maxSalary: '',
  experience: '',
  education: '',
  province: '',
  city: '',
  district: ''
})

// 职位名称选项
const positionOptions = [
  { label: '不限', value: '' },
  { label: '操作工', value: '操作工' },
  { label: '质检员', value: '质检员' },
  { label: '装配工', value: '装配工' },
  { label: '生产操作员', value: '生产操作员' },
  { label: '仓库管理员', value: '仓库管理员' },
  { label: '技术员', value: '技术员' }
]

// 工作经验选项
const experienceOptions = [
  { label: '不限', value: '' },
  { label: '1年以下', value: '1年以下' },
  { label: '1-3年', value: '1-3年' },
  { label: '3-5年', value: '3-5年' },
  { label: '5年以上', value: '5年以上' }
]

// 学历要求选项（与个人信息页面保持一致）
const educationOptions = [
  { label: '不限', value: '' },
  { label: '本科及以上', value: '本科及以上' },
  { label: '本科', value: '本科' },
  { label: '大专', value: '大专' },
  { label: '高中', value: '高中' },
  { label: '高中及以下', value: '高中及以下' },
  { label: '无', value: '无' }
]

// 省份选项
const provinceOptions = [
  { label: '不限', value: '' },
  { label: '北京', value: '北京' },
  { label: '上海', value: '上海' },
  { label: '广东', value: '广东' },
  { label: '江苏', value: '江苏' },
  { label: '浙江', value: '浙江' },
  { label: '四川', value: '四川' },
  { label: '湖北', value: '湖北' },
  { label: '河南', value: '河南' },
  { label: '山东', value: '山东' }
]

// 城市选项（根据省份动态变化）
const cityOptions = ref([
  { label: '不限', value: '' }
])

// 区县选项（根据城市动态变化）
const districtOptions = ref([
  { label: '不限', value: '' }
])

// 省份城市映射
const provinceCityMap = {
  '北京': [{ label: '北京市', value: '北京市' }],
  '上海': [{ label: '上海市', value: '上海市' }],
  '广东': [
    { label: '广州', value: '广州' },
    { label: '深圳', value: '深圳' },
    { label: '佛山', value: '佛山' },
    { label: '东莞', value: '东莞' }
  ],
  '江苏': [
    { label: '南京', value: '南京' },
    { label: '苏州', value: '苏州' },
    { label: '无锡', value: '无锡' },
    { label: '常州', value: '常州' }
  ],
  '浙江': [
    { label: '杭州', value: '杭州' },
    { label: '宁波', value: '宁波' },
    { label: '温州', value: '温州' },
    { label: '嘉兴', value: '嘉兴' }
  ],
  '四川': [
    { label: '成都', value: '成都' },
    { label: '绵阳', value: '绵阳' },
    { label: '德阳', value: '德阳' }
  ],
  '湖北': [
    { label: '武汉', value: '武汉' },
    { label: '襄阳', value: '襄阳' },
    { label: '宜昌', value: '宜昌' }
  ],
  '河南': [
    { label: '郑州', value: '郑州' },
    { label: '洛阳', value: '洛阳' },
    { label: '开封', value: '开封' }
  ],
  '山东': [
    { label: '济南', value: '济南' },
    { label: '青岛', value: '青岛' },
    { label: '烟台', value: '烟台' }
  ]
}

// 城市区县映射
const cityDistrictMap = {
  '北京市': [
    { label: '不限', value: '' },
    { label: '朝阳区', value: '朝阳区' },
    { label: '海淀区', value: '海淀区' },
    { label: '东城区', value: '东城区' },
    { label: '西城区', value: '西城区' }
  ],
  '上海市': [
    { label: '不限', value: '' },
    { label: '浦东新区', value: '浦东新区' },
    { label: '黄浦区', value: '黄浦区' },
    { label: '徐汇区', value: '徐汇区' },
    { label: '长宁区', value: '长宁区' }
  ],
  '广州': [
    { label: '不限', value: '' },
    { label: '天河区', value: '天河区' },
    { label: '越秀区', value: '越秀区' },
    { label: '海珠区', value: '海珠区' },
    { label: '荔湾区', value: '荔湾区' }
  ],
  '深圳': [
    { label: '不限', value: '' },
    { label: '南山区', value: '南山区' },
    { label: '福田区', value: '福田区' },
    { label: '罗湖区', value: '罗湖区' },
    { label: '宝安区', value: '宝安区' }
  ]
}

// 省份变化处理
const handleProvinceChange = (value) => {
  searchForm.value.province = value
  searchForm.value.city = ''
  searchForm.value.district = ''
  
  if (value) {
    cityOptions.value = provinceCityMap[value] || [{ label: '不限', value: '' }]
  } else {
    cityOptions.value = [{ label: '不限', value: '' }]
  }
  districtOptions.value = [{ label: '不限', value: '' }]
}

// 城市变化处理
const handleCityChange = (value) => {
  searchForm.value.city = value
  searchForm.value.district = ''
  
  if (value) {
    districtOptions.value = cityDistrictMap[value] || [{ label: '不限', value: '' }]
  } else {
    districtOptions.value = [{ label: '不限', value: '' }]
  }
}

// 区县变化处理
const handleDistrictChange = (value) => {
  searchForm.value.district = value
}

// 切换查询条件展开/收起状态
const toggleSearchForm = () => {
  isSearchFormExpanded.value = !isSearchFormExpanded.value
}

// 标签页配置
const tabs = [
  {
    label: '厂家直招',
    value: '1',
    type: 'factory_direct'
  },
  {
    label: '平台招聘',
    value: '2',
    type: 'platform'
  },
  {
    label: '劳务招聘',
    value: '3',
    type: 'labor'
  }
]

// 模拟招聘数据
const mockRecruitments = [
  // 厂家直招
  {
    id: 1,
    type: 'factory_direct',
    factory: '富士康科技集团',
    position: '操作工',
    salary: '5000-6000元/月',
    requirements: '18-45岁，身体健康，吃苦耐劳',
    welfare: '包吃住，五险一金，年终奖',
    contact: '张经理 13800138005',
    publishDate: '2026-01-15'
  },
  {
    id: 2,
    type: 'factory_direct',
    factory: '华为技术有限公司',
    position: '质检员',
    salary: '6000-7000元/月',
    requirements: '20-40岁，高中以上学历，有质检经验优先',
    welfare: '包吃住，五险一金，带薪年假',
    contact: '李经理 13800138006',
    publishDate: '2026-01-10'
  },
  // 平台招聘
  {
    id: 3,
    type: 'platform',
    factory: '比亚迪股份有限公司',
    position: '装配工',
    salary: '5500-6500元/月',
    requirements: '18-45岁，身体健康，服从安排',
    welfare: '包吃住，五险一金，节日福利',
    contact: '王经理 13800138007',
    publishDate: '2026-01-08'
  },
  // 劳务招聘
  {
    id: 4,
    type: 'labor',
    factory: '特斯拉上海工厂',
    laborCompany: '三鼎劳务有限公司',
    position: '生产操作员',
    salary: '6000-7500元/月',
    requirements: '18-40岁，初中以上学历，能适应倒班',
    welfare: '包吃住，五险一金，绩效奖金',
    contact: '刘经理 13800138008',
    publishDate: '2026-01-05'
  }
]

// 获取招聘信息
const getRecruitments = async (type: string) => {
  loading.value = true
  try {
    // 模拟异步请求
    setTimeout(() => {
      let filteredRecruitments = mockRecruitments
      
      // 按招聘类型过滤
      if (type) {
        filteredRecruitments = filteredRecruitments.filter(r => r.type === type)
      }
      
      // 按职位名称过滤
      if (searchForm.value.position) {
        const positionValue = searchForm.value.position
        filteredRecruitments = filteredRecruitments.filter(r => 
          r.position === positionValue
        )
      }
      
      // 按薪资范围过滤
      if (searchForm.value.minSalary || searchForm.value.maxSalary) {
        const minSalary = parseInt(searchForm.value.minSalary) || 0
        const maxSalary = parseInt(searchForm.value.maxSalary) || Infinity
        
        filteredRecruitments = filteredRecruitments.filter(r => {
          const salaryText = r.salary
          // 提取薪资范围的最小值和最大值
          const salaryMatch = salaryText.match(/(\d+)-(\d+)元/)
          if (salaryMatch) {
            const salaryMin = parseInt(salaryMatch[1])
            const salaryMax = parseInt(salaryMatch[2])
            
            // 检查薪资范围是否与查询条件匹配
            return salaryMin >= minSalary && salaryMax <= maxSalary
          }
          return true
        })
      }
      
      // 按工作经验过滤
      if (searchForm.value.experience) {
        // 这里简化处理，实际项目中需要根据招聘信息中的经验要求进行匹配
        // 由于模拟数据中没有明确的经验字段，这里暂时跳过
      }
      
      // 按学历要求过滤
      if (searchForm.value.education) {
        // 这里简化处理，实际项目中需要根据招聘信息中的学历要求进行匹配
        // 由于模拟数据中没有明确的学历字段，这里暂时跳过
      }
      
      // 按工作地点过滤
      if (searchForm.value.location) {
        // 这里简化处理，实际项目中需要根据招聘信息中的地点进行匹配
        // 由于模拟数据中没有明确的地点字段，这里暂时跳过
      }
      
      recruitments.value = filteredRecruitments
      loading.value = false
    }, 500)
  } catch (error) {
    console.error('获取招聘信息失败:', error)
    ElMessage.error('获取招聘信息失败，请稍后重试')
    loading.value = false
  }
}

// 切换标签页
const handleTabChange = (value: string) => {
  activeTab.value = value
  const tab = tabs.find(t => t.value === value)
  if (tab) {
    getRecruitments(tab.type)
  }
}

// 搜索
const handleSearch = () => {
  const tab = tabs.find(t => t.value === activeTab.value)
  if (tab) {
    getRecruitments(tab.type)
  }
}

// 重置表单
const resetForm = () => {
  searchForm.value = {
    position: '',
    minSalary: '',
    maxSalary: '',
    experience: '',
    education: '',
    province: '',
    city: '',
    district: ''
  }
  // 重置城市和区县选项
  cityOptions.value = [{ label: '不限', value: '' }]
  districtOptions.value = [{ label: '不限', value: '' }]
  const tab = tabs.find(t => t.value === activeTab.value)
  if (tab) {
    getRecruitments(tab.type)
  }
}

// 投递简历
const handleApply = (recruitment: any) => {
  ElMessage.success(`已投递 ${recruitment.position} 职位`)
}

// 跳转到招聘详情页面
const goToRecruitmentDetail = (recruitment: any) => {
  router.push(`/worker/recruitment-detail/${recruitment.id}`)
}

// 页面加载时获取数据
onMounted(() => {
  const defaultTab = tabs.find(t => t.value === activeTab.value)
  if (defaultTab) {
    getRecruitments(defaultTab.type)
  }
})
</script>

<template>
  <div class="worker-recruitment">
    <BackButton />
    <!-- 页面标题 -->
    <div class="page-header">
      <h2>用工招聘</h2>
    </div>
    
    <!-- 标签页 -->
    <div class="recruitment-tabs">
      <el-tabs v-model="activeTab" @tab-click="handleTabChange">
        <el-tab-pane
          v-for="tab in tabs"
          :key="tab.value"
          :label="tab.label"
          :name="tab.value"
        />
      </el-tabs>
    </div>
    
    <!-- 查询条件折叠/展开按钮 -->
    <div class="search-form-toggle" @click="toggleSearchForm">
      <div class="toggle-content">
        <div class="toggle-left">
          <el-icon class="filter-icon"><Filter /></el-icon>
          <span class="toggle-text">{{ isSearchFormExpanded ? '收起筛选' : '展开筛选' }}</span>
        </div>
        <div class="toggle-right">
          <span class="position-count">{{ positionOptions.length - 1 }} 个职位</span>
          <el-icon class="toggle-icon" :class="{ 'rotated': isSearchFormExpanded }"><ArrowDown /></el-icon>
        </div>
      </div>
    </div>
    
    <!-- 查询条件 -->
    <div v-if="isSearchFormExpanded" class="search-form" :class="{ 'expanded': isSearchFormExpanded }">
      <div class="search-form-content">
        <!-- 职位名称 -->
        <div class="form-group">
          <label class="form-label">职位名称</label>
          <el-select v-model="searchForm.position" placeholder="请选择职位名称" class="form-select">
            <el-option
              v-for="option in positionOptions"
              :key="option.value"
              :label="option.label"
              :value="option.value"
            />
          </el-select>
        </div>
        
        <!-- 薪资范围 -->
        <div class="form-group">
          <label class="form-label">薪资范围</label>
          <div class="salary-range-container">
            <el-input v-model="searchForm.minSalary" placeholder="最低薪资" type="number" class="salary-input" />
            <span class="salary-separator">-</span>
            <el-input v-model="searchForm.maxSalary" placeholder="最高薪资" type="number" class="salary-input" />
            <span class="salary-unit">元/月</span>
          </div>
        </div>
        
        <!-- 工作经验 -->
        <div class="form-group">
          <label class="form-label">工作经验</label>
          <el-select v-model="searchForm.experience" placeholder="请选择工作经验" class="form-select">
            <el-option
              v-for="option in experienceOptions"
              :key="option.value"
              :label="option.label"
              :value="option.value"
            />
          </el-select>
        </div>
        
        <!-- 学历要求 -->
        <div class="form-group">
          <label class="form-label">学历要求</label>
          <el-select v-model="searchForm.education" placeholder="请选择学历要求" class="form-select">
            <el-option
              v-for="option in educationOptions"
              :key="option.value"
              :label="option.label"
              :value="option.value"
            />
          </el-select>
        </div>
        
        <!-- 工作地点 -->
        <div class="form-group">
          <label class="form-label">工作地点</label>
          <div class="location-container">
            <el-select v-model="searchForm.province" placeholder="省" @change="handleProvinceChange" class="location-select">
              <el-option
                v-for="option in provinceOptions"
                :key="option.value"
                :label="option.label"
                :value="option.value"
              />
            </el-select>
            <el-select v-model="searchForm.city" placeholder="市" @change="handleCityChange" class="location-select">
              <el-option
                v-for="option in cityOptions"
                :key="option.value"
                :label="option.label"
                :value="option.value"
              />
            </el-select>
            <el-select v-model="searchForm.district" placeholder="区" @change="handleDistrictChange" class="location-select">
              <el-option
                v-for="option in districtOptions"
                :key="option.value"
                :label="option.label"
                :value="option.value"
              />
            </el-select>
          </div>
        </div>
        
        <!-- 操作按钮 -->
        <div class="form-actions">
          <el-button type="primary" @click="handleSearch" class="search-btn">
            <el-icon><Search /></el-icon>
            <span>搜索职位</span>
          </el-button>
          <el-button @click="resetForm" class="reset-btn">
            <el-icon><Refresh /></el-icon>
            <span>重置</span>
          </el-button>
        </div>
      </div>
    </div>
    
    <!-- 招聘列表 -->
    <div class="recruitment-list">
      <div v-if="loading" class="loading">
        <el-icon class="is-loading"><Loading /></el-icon>
        <span>加载中...</span>
      </div>
      <div v-else-if="recruitments.length === 0" class="empty">
        <el-icon><InfoFilled /></el-icon>
        <span>暂无招聘信息</span>
      </div>
      <div v-else class="recruitment-items">
        <div v-for="recruitment in recruitments" :key="recruitment.id" class="recruitment-item" @click="goToRecruitmentDetail(recruitment)">
          <div class="recruitment-header">
            <h3>{{ recruitment.position }}</h3>
            <span class="salary">{{ recruitment.salary }}</span>
          </div>
          <div class="recruitment-body">
            <p class="company">
              <el-icon><OfficeBuilding /></el-icon>
              {{ recruitment.factory }}
              <span v-if="recruitment.laborCompany" class="labor-company">({{ recruitment.laborCompany }})</span>
            </p>
            <p class="requirements">
              <el-icon><Document /></el-icon>
              {{ recruitment.requirements }}
            </p>
            <p class="welfare">
              <el-icon><Present /></el-icon>
              {{ recruitment.welfare }}
            </p>
            <p class="contact">
              <el-icon><Phone /></el-icon>
              {{ recruitment.contact }}
            </p>
            <p class="publish-date">
              <el-icon><Timer /></el-icon>
              {{ recruitment.publishDate }}
            </p>
          </div>
          <div class="recruitment-footer">
            <el-button type="primary" size="small" @click.stop="handleApply(recruitment)">
              投递简历
            </el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.worker-recruitment {
  min-height: 100vh;
  background-color: #f5f5f5;
}

.page-header {
  background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
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
  color: #fff;
}

.recruitment-tabs {
  background-color: #fff;
  margin-bottom: 10px;
  padding: 0 15px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

/* 标签页样式优化 */
.recruitment-tabs .el-tabs__header {
  margin: 0;
}

.recruitment-tabs .el-tabs__nav {
  height: 50px;
}

.recruitment-tabs .el-tabs__item {
  height: 50px;
  line-height: 50px;
  font-size: 14px;
  color: #666;
  font-weight: 500;
}

.recruitment-tabs .el-tabs__item.is-active {
  color: #4f46e5;
  font-weight: bold;
}

.recruitment-tabs .el-tabs__active-bar {
  background-color: #4f46e5;
  height: 3px;
}

/* 查询条件折叠/展开按钮样式 */
.search-form-toggle {
  background-color: #fff;
  margin: 0 15px 15px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  border-radius: 12px;
  overflow: hidden;
}

.toggle-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  background: linear-gradient(135deg, #f8faff 0%, #f0f4ff 100%);
  transition: all 0.3s ease;
}

.search-form-toggle:hover .toggle-content {
  background: linear-gradient(135deg, #f0f4ff 0%, #e0e7ff 100%);
}

.toggle-left {
  display: flex;
  align-items: center;
  gap: 10px;
}

.filter-icon {
  font-size: 18px;
  color: #4f46e5;
  background: rgba(79, 70, 229, 0.1);
  padding: 6px;
  border-radius: 8px;
}

.toggle-text {
  font-size: 14px;
  color: #333;
  font-weight: 600;
}

.toggle-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.position-count {
  font-size: 13px;
  color: #666;
  background-color: #fff;
  padding: 4px 12px;
  border-radius: 16px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.toggle-icon {
  font-size: 16px;
  color: #4f46e5;
  transition: transform 0.3s ease;
}

.toggle-icon.rotated {
  transform: rotate(180deg);
}

/* 查询条件表单样式 */
.search-form {
  background-color: #fff;
  margin: 0 15px 15px;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  max-height: 0;
  opacity: 0;
  transform: translateY(-10px);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.search-form.expanded {
  max-height: 800px;
  opacity: 1;
  transform: translateY(0);
}

.search-form-content {
  padding: 20px;
}

.form-group {
  margin-bottom: 20px;
}

.form-label {
  display: block;
  font-size: 14px;
  color: #333;
  font-weight: 600;
  margin-bottom: 8px;
  padding-left: 4px;
}

.form-select {
  width: 100%;
  border-radius: 8px;
  border: 1px solid #e4e7ed;
  transition: all 0.3s ease;
  font-size: 14px;
}

.form-select:focus {
  border-color: #4f46e5;
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
}

/* 薪资范围输入框样式 */
.salary-range-container {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
}

.salary-input {
  flex: 1;
  border-radius: 8px;
  border: 1px solid #e4e7ed;
  transition: all 0.3s ease;
  font-size: 14px;
}

.salary-input:focus {
  border-color: #4f46e5;
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
}

.salary-separator {
  color: #999;
  font-weight: 600;
  font-size: 16px;
  min-width: 20px;
  text-align: center;
}

.salary-unit {
  color: #999;
  white-space: nowrap;
  font-size: 14px;
  font-weight: 500;
}

/* 省市区选择器样式 */
.location-container {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
}

.location-select {
  flex: 1;
  border-radius: 8px;
  border: 1px solid #e4e7ed;
  transition: all 0.3s ease;
  font-size: 14px;
}

.location-select:focus {
  border-color: #4f46e5;
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
}

/* 操作按钮样式 */
.form-actions {
  display: flex;
  gap: 12px;
  margin-top: 24px;
  padding-top: 20px;
  border-top: 1px solid #f0f0f0;
}

.search-btn {
  flex: 2;
  background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
  border: none;
  border-radius: 8px;
  padding: 12px;
  font-size: 14px;
  font-weight: 600;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(79, 70, 229, 0.2);
}

.search-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 16px rgba(79, 70, 229, 0.3);
}

.reset-btn {
  flex: 1;
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  padding: 12px;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s ease;
  background-color: #f9fafb;
  color: #666;
}

.reset-btn:hover {
  border-color: #4f46e5;
  color: #4f46e5;
  background-color: #f0f4ff;
}

.recruitment-list {
  padding: 0 15px 20px;
}

.loading,
.empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 0;
  color: #999;
  background-color: #fff;
  margin: 0 15px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.loading i,
.empty i {
  font-size: 48px;
  margin-bottom: 15px;
  color: #c7d2fe;
}

.loading span,
.empty span {
  font-size: 14px;
}

.recruitment-items {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.recruitment-item {
  background-color: #fff;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  border: 1px solid #f0f0f0;
}

.recruitment-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  border-color: #e0e7ff;
}

.recruitment-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 15px;
}

.recruitment-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: bold;
  color: #333;
  flex: 1;
}

.salary {
  font-size: 16px;
  font-weight: bold;
  color: #ff6b6b;
  white-space: nowrap;
  margin-left: 15px;
  background-color: #fff5f5;
  padding: 4px 12px;
  border-radius: 16px;
  box-shadow: 0 2px 4px rgba(255, 107, 107, 0.2);
}

.recruitment-body {
  margin-bottom: 20px;
}

.recruitment-body p {
  margin: 10px 0;
  font-size: 14px;
  color: #666;
  display: flex;
  align-items: flex-start;
  line-height: 1.5;
}

.recruitment-body p i {
  margin-right: 10px;
  color: #93c5fd;
  font-size: 16px;
  flex-shrink: 0;
  margin-top: 2px;
}

.labor-company {
  font-size: 13px;
  color: #999;
  margin-left: 8px;
  background-color: #f8fafc;
  padding: 2px 8px;
  border-radius: 12px;
}

.recruitment-footer {
  display: flex;
  justify-content: flex-end;
  padding-top: 15px;
  border-top: 1px solid #f0f0f0;
}

.recruitment-footer .el-button {
  background: linear-gradient(135deg, #10b981 0%, #34d399 100%);
  border: none;
  border-radius: 6px;
  padding: 8px 20px;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.recruitment-footer .el-button:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
}

/* 移动端适配 */
@media (max-width: 768px) {
  .toggle-content {
    padding: 14px 16px;
  }
  
  .filter-icon {
    font-size: 16px;
    padding: 5px;
  }
  
  .toggle-text {
    font-size: 13px;
  }
  
  .position-count {
    font-size: 12px;
    padding: 3px 10px;
  }
  
  .search-form-content {
    padding: 16px;
  }
  
  .form-group {
    margin-bottom: 16px;
  }
  
  .form-label {
    font-size: 13px;
    margin-bottom: 6px;
  }
  
  .form-select,
  .salary-input,
  .location-select {
    font-size: 13px;
  }
  
  /* 薪资范围在移动端垂直排列 */
  .salary-range-container {
    flex-direction: column;
    align-items: stretch;
    gap: 8px;
  }
  
  .salary-input {
    width: 100%;
  }
  
  .salary-separator {
    text-align: center;
    margin: 4px 0;
    font-size: 14px;
  }
  
  .salary-unit {
    text-align: center;
    margin-top: 4px;
  }
  
  /* 省市区选择器在移动端垂直排列 */
  .location-container {
    flex-direction: column;
    align-items: stretch;
    gap: 8px;
  }
  
  .location-select {
    width: 100%;
  }
  
  /* 操作按钮在移动端垂直排列 */
  .form-actions {
    flex-direction: column;
    gap: 8px;
    margin-top: 20px;
    padding-top: 16px;
  }
  
  .search-btn,
  .reset-btn {
    width: 100%;
    padding: 12px;
  }
  
  .recruitment-item {
    padding: 15px;
  }
  
  .recruitment-header h3 {
    font-size: 16px;
  }
  
  .salary {
    font-size: 14px;
    padding: 3px 10px;
  }
  
  .recruitment-body p {
    font-size: 13px;
  }
}
</style>