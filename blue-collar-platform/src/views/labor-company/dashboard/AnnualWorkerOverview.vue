<template>
  <div class="dashboard-wrapper" :class="{ 'is-fullscreen': isFullscreen }">
    <div ref="dashboardContent" class="dashboard-container">
      <div class="dashboard-bg"></div>
      
      <div class="dashboard-header">
        <div class="header-left">
          <div class="title-wrapper">
            <h1 class="main-title">
              <span class="year-selectable" @click="showYearDialog = true">{{ selectedYear }}</span>
              <span class="title-part">年度工人情况总览</span>
            </h1>
            <div class="title-decoration"></div>
          </div>
        </div>
        <div class="header-right">
          <el-button class="fullscreen-btn" @click="toggleFullscreen">
            <el-icon><FullScreen v-if="!isFullscreen" /><Close v-else /></el-icon>
            <span>{{ isFullscreen ? '退出全屏' : '全屏显示' }}</span>
          </el-button>
        </div>
      </div>

      <!-- 年份选择弹窗 -->
      <el-dialog
        v-model="showYearDialog"
        title="选择年份"
        width="300px"
        destroy-on-close
        center
        :append-to-body="true"
        top="40vh"
      >
        <div class="year-options">
          <div
            v-for="year in years"
            :key="year"
            class="year-option"
            :class="{ active: selectedYear === year }"
            @click="selectYear(year)"
          >
            {{ year }}年度
          </div>
        </div>
      </el-dialog>

      <div class="dashboard-body">
        <div class="top-section">
          <div class="kpi-cards">
            <div class="kpi-card" v-for="(item, index) in kpiData" :key="index">
              <div class="kpi-icon" :style="{ background: item.gradient }">
                <component :is="item.icon" />
              </div>
              <div class="kpi-content">
                <div class="kpi-label">{{ item.label }}</div>
                <div class="kpi-value">{{ item.value }}<span class="kpi-unit">{{ item.unit }}</span></div>
                <div class="kpi-trend" :class="item.trend > 0 ? 'up' : 'down'">
                  <el-icon><CaretTop v-if="item.trend > 0" /><CaretBottom v-else /></el-icon>
                  <span>{{ Math.abs(item.trend) }}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="middle-section">
          <div class="chart-panel full-width-panel">
            <div class="panel-header">
              <div class="panel-title">
                <span class="title-icon"></span>
                工人数量趋势
              </div>
            </div>
            <div class="panel-body">
              <div ref="workerTrendChart" class="chart"></div>
            </div>
          </div>

          <div class="chart-panel full-width-panel">
            <div class="panel-header">
              <div class="panel-title">
                <span class="title-icon"></span>
                工人年龄结构
              </div>
            </div>
            <div class="panel-body">
              <div ref="workerAgeChart" class="chart"></div>
            </div>
          </div>
        </div>

        <div class="bottom-section">
          <div class="data-panel full-width-panel">
            <div class="panel-header">
              <div class="panel-title">
                <span class="title-icon"></span>
                月度数据详情
              </div>
            </div>
            <div class="panel-body">
              <div class="table-wrapper">
                <table class="data-table">
                  <thead>
                    <tr>
                      <th>月份</th>
                      <th>工人数量</th>
                      <th>在职人数</th>
                      <th>离职率</th>
                      <th>平均工资</th>
                      <th>出勤率</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(row, index) in monthlyData" :key="index">
                      <td>{{ row.month }}</td>
                      <td>{{ row.workers }}</td>
                      <td>{{ row.active }}</td>
                      <td :class="getTurnoverClass(row.turnover)">{{ row.turnover }}</td>
                      <td>{{ row.salary }}</td>
                      <td>{{ row.attendance }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, markRaw } from 'vue'
import { FullScreen, Close, CaretTop, CaretBottom, User, UserFilled, TrendCharts, Money } from '@element-plus/icons-vue'
import * as echarts from 'echarts'

const isFullscreen = ref(false)
const selectedYear = ref(new Date().getFullYear())
const years = ref([2024, 2025, 2026, 2027])
const showYearDialog = ref(false)

const dashboardContent = ref<HTMLElement>()
const workerTrendChart = ref<HTMLElement>()
const workerAgeChart = ref<HTMLElement>()

let chartInstances: echarts.ECharts[] = []

const kpiData = ref([
  {
    label: '总工人数量',
    value: '1,256',
    unit: '人',
    trend: 8.2,
    icon: markRaw(User),
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
  },
  {
    label: '在职工人',
    value: '1,124',
    unit: '人',
    trend: 5.7,
    icon: markRaw(UserFilled),
    gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
  },
  {
    label: '离职率',
    value: '10.5',
    unit: '%',
    trend: -2.3,
    icon: markRaw(TrendCharts),
    gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
  },
  {
    label: '平均工资',
    value: '6,850',
    unit: '元',
    trend: 12.5,
    icon: markRaw(Money),
    gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)'
  }
])

const monthlyData = ref([
  { month: '1月', workers: 1120, active: 1050, turnover: '8.5%', salary: '6,200', attendance: '96%' },
  { month: '2月', workers: 1150, active: 1080, turnover: '6.1%', salary: '6,350', attendance: '95%' },
  { month: '3月', workers: 1180, active: 1100, turnover: '6.8%', salary: '6,400', attendance: '97%' },
  { month: '4月', workers: 1200, active: 1120, turnover: '8.3%', salary: '6,500', attendance: '96%' },
  { month: '5月', workers: 1220, active: 1130, turnover: '9.1%', salary: '6,600', attendance: '95%' },
  { month: '6月', workers: 1230, active: 1140, turnover: '9.8%', salary: '6,700', attendance: '96%' },
  { month: '7月', workers: 1240, active: 1145, turnover: '10.2%', salary: '6,750', attendance: '94%' },
  { month: '8月', workers: 1245, active: 1150, turnover: '11.5%', salary: '6,800', attendance: '93%' },
  { month: '9月', workers: 1250, active: 1155, turnover: '10.8%', salary: '6,850', attendance: '95%' },
  { month: '10月', workers: 1256, active: 1160, turnover: '10.5%', salary: '6,900', attendance: '96%' },
  { month: '11月', workers: 1256, active: 1165, turnover: '10.0%', salary: '6,950', attendance: '97%' },
  { month: '12月', workers: 1256, active: 1170, turnover: '9.5%', salary: '7,000', attendance: '96%' }
])

const getTurnoverClass = (turnover: string) => {
  const value = parseFloat(turnover)
  if (value > 10) return 'high'
  if (value > 8) return 'medium'
  return 'low'
}

const selectYear = (year: number) => {
  selectedYear.value = year
  showYearDialog.value = false
}

const toggleFullscreen = () => {
  if (!dashboardContent.value) return
  
  const element = dashboardContent.value as any
  
  if (!isFullscreen.value) {
    if (element.requestFullscreen) {
      element.requestFullscreen()
    } else if (element.webkitRequestFullscreen) {
      element.webkitRequestFullscreen()
    } else if (element.msRequestFullscreen) {
      element.msRequestFullscreen()
    }
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen()
    } else if ((document as any).webkitExitFullscreen) {
      (document as any).webkitExitFullscreen()
    } else if ((document as any).msExitFullscreen) {
      (document as any).msExitFullscreen()
    }
  }
}

const handleFullscreenChange = () => {
  isFullscreen.value = !!(document.fullscreenElement || (document as any).webkitFullscreenElement || (document as any).msFullscreenElement)
  setTimeout(() => {
    chartInstances.forEach(chart => chart.resize())
  }, 100)
}

const initCharts = () => {
  if (!workerTrendChart.value || !workerAgeChart.value) return

  const chartTheme = {
    backgroundColor: 'transparent',
    textStyle: { color: '#a0aec0' },
    title: { textStyle: { color: '#e2e8f0' } },
    legend: { textStyle: { color: '#a0aec0' } },
    tooltip: {
      backgroundColor: 'rgba(26, 32, 44, 0.95)',
      borderColor: '#4a5568',
      textStyle: { color: '#e2e8f0' }
    }
  }

  const trendChart = echarts.init(workerTrendChart.value)
  trendChart.setOption({
    ...chartTheme,
    grid: { left: '5%', right: '5%', bottom: '10%', top: '10%', containLabel: true },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
      axisLine: { lineStyle: { color: '#4a5568' } },
      axisLabel: { color: '#a0aec0' }
    },
    yAxis: {
      type: 'value',
      axisLine: { lineStyle: { color: '#4a5568' } },
      axisLabel: { color: '#a0aec0' },
      splitLine: { lineStyle: { color: '#2d3748', type: 'dashed' } }
    },
    series: [{
      name: '工人数量',
      type: 'line',
      smooth: true,
      data: [1120, 1150, 1180, 1200, 1220, 1230, 1240, 1245, 1250, 1256, 1256, 1256],
      areaStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: 'rgba(102, 126, 234, 0.6)' },
          { offset: 1, color: 'rgba(102, 126, 234, 0.05)' }
        ])
      },
      lineStyle: { width: 3, color: '#667eea' },
      itemStyle: { color: '#667eea', borderWidth: 2 },
      emphasis: { itemStyle: { borderWidth: 3, shadowBlur: 10, shadowColor: 'rgba(102, 126, 234, 0.5)' } }
    }]
  })

  const ageChart = echarts.init(workerAgeChart.value)
  ageChart.setOption({
    ...chartTheme,
    grid: { left: '5%', right: '5%', bottom: '10%', top: '10%', containLabel: true },
    xAxis: {
      type: 'category',
      data: ['18-25', '26-30', '31-35', '36-40', '41-45', '46+'],
      axisLine: { lineStyle: { color: '#4a5568' } },
      axisLabel: { color: '#a0aec0' }
    },
    yAxis: {
      type: 'value',
      axisLine: { lineStyle: { color: '#4a5568' } },
      axisLabel: { color: '#a0aec0' },
      splitLine: { lineStyle: { color: '#2d3748', type: 'dashed' } }
    },
    series: [{
      name: '人数',
      type: 'bar',
      barWidth: '50%',
      data: [
        { value: 250, itemStyle: { color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{ offset: 0, color: '#667eea' }, { offset: 1, color: '#764ba2' }]) } },
        { value: 320, itemStyle: { color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{ offset: 0, color: '#f093fb' }, { offset: 1, color: '#f5576c' }]) } },
        { value: 280, itemStyle: { color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{ offset: 0, color: '#4facfe' }, { offset: 1, color: '#00f2fe' }]) } },
        { value: 200, itemStyle: { color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{ offset: 0, color: '#43e97b' }, { offset: 1, color: '#38f9d7' }]) } },
        { value: 120, itemStyle: { color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{ offset: 0, color: '#fa709a' }, { offset: 1, color: '#fee140' }]) } },
        { value: 86, itemStyle: { color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{ offset: 0, color: '#a8edea' }, { offset: 1, color: '#fed6e3' }]) } }
      ],
      itemStyle: { borderRadius: [4, 4, 0, 0] }
    }]
  })

  chartInstances = [trendChart, ageChart]
}

const handleResize = () => {
  chartInstances.forEach(chart => chart.resize())
}

watch(selectedYear, () => {
  setTimeout(() => {
    initCharts()
  }, 300)
})

onMounted(() => {
  setTimeout(() => {
    initCharts()
  }, 500)
  
  document.addEventListener('fullscreenchange', handleFullscreenChange)
  document.addEventListener('webkitfullscreenchange', handleFullscreenChange)
  document.addEventListener('msfullscreenchange', handleFullscreenChange)
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  document.removeEventListener('fullscreenchange', handleFullscreenChange)
  document.removeEventListener('webkitfullscreenchange', handleFullscreenChange)
  document.removeEventListener('msfullscreenchange', handleFullscreenChange)
  window.removeEventListener('resize', handleResize)
  chartInstances.forEach(chart => chart.dispose())
})
</script>

<style scoped>
.dashboard-wrapper {
  width: 100%;
  height: 100%;
  min-height: 100vh;
  background: #0f1419;
  overflow: hidden;
}

.dashboard-container {
  width: 100%;
  height: 100%;
  min-height: 100vh;
  position: relative;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.dashboard-bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: 
    radial-gradient(circle at 20% 30%, rgba(102, 126, 234, 0.15) 0%, transparent 50%),
    radial-gradient(circle at 80% 70%, rgba(118, 75, 162, 0.15) 0%, transparent 50%),
    radial-gradient(circle at 50% 50%, rgba(15, 20, 25, 1) 0%, rgba(15, 20, 25, 1) 100%);
  z-index: 0;
  opacity: 1;
}

.dashboard-bg::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: 
    linear-gradient(rgba(102, 126, 234, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(102, 126, 234, 0.03) 1px, transparent 1px);
  background-size: 50px 50px;
  z-index: 1;
}

.dashboard-header {
  position: relative;
  z-index: 20;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 30px;
  background: linear-gradient(180deg, rgba(26, 32, 44, 0.95) 0%, rgba(26, 32, 44, 0.7) 100%);
  border-bottom: 1px solid rgba(102, 126, 234, 0.3);
  backdrop-filter: blur(10px);
}

.header-left {
  flex: 1;
}

.title-wrapper {
  position: relative;
}

.main-title {
  margin: 0;
  font-size: 28px;
  font-weight: 700;
  color: #e2e8f0;
  text-shadow: 0 0 30px rgba(102, 126, 234, 0.3);
  position: relative;
  z-index: 20;
  display: flex;
  align-items: center;
  gap: 10px;
  background: transparent;
  white-space: nowrap;
}

.main-title span {
  letter-spacing: 2px;
}

.title-part {
  letter-spacing: 2px;
}

.year-selectable {
  cursor: pointer;
  position: relative;
  padding-bottom: 2px;
  transition: all 0.3s ease;
  z-index: 21;
  color: #e2e8f0;
  font-weight: 700;
  text-shadow: 0 0 30px rgba(102, 126, 234, 0.3);
}

.year-selectable:hover {
  text-shadow: 0 0 20px rgba(102, 126, 234, 0.8);
  transform: translateY(-1px);
  color: #667eea;
}

.year-selectable::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 1px;
  background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
  transform: scaleX(0);
  transform-origin: right;
  transition: transform 0.3s ease;
}

.year-selectable:hover::after {
  transform: scaleX(1);
  transform-origin: left;
}

/* 年份选择弹窗样式 */
.year-options {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 10px 0;
}

.year-option {
  padding: 12px 16px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: center;
  background: linear-gradient(135deg, rgba(26, 32, 44, 0.9) 0%, rgba(26, 32, 44, 0.7) 100%);
  border: 1px solid rgba(102, 126, 234, 0.2);
  color: #e2e8f0;
}

.year-option:hover {
  border-color: rgba(102, 126, 234, 0.5);
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(102, 126, 234, 0.2);
}

.year-option.active {
  border-color: #667eea;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.2) 0%, rgba(118, 75, 162, 0.2) 100%);
  box-shadow: 0 0 20px rgba(102, 126, 234, 0.3);
}

/* 弹窗样式 */
:deep(.el-dialog) {
  background: transparent;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
  border-radius: 12px;
  overflow: hidden;
}

:deep(.el-dialog__header) {
  background: linear-gradient(135deg, rgba(26, 32, 44, 0.95) 0%, rgba(26, 32, 44, 0.9) 100%);
  border-bottom: 1px solid rgba(102, 126, 234, 0.3);
  padding: 15px 20px;
}

:deep(.el-dialog__title) {
  color: #e2e8f0;
  font-weight: 600;
}

:deep(.el-dialog__body) {
  background: linear-gradient(135deg, rgba(15, 20, 25, 0.95) 0%, rgba(15, 20, 25, 1) 100%);
  padding: 20px;
  border: none;
}

:deep(.el-dialog__footer) {
  background: linear-gradient(135deg, rgba(26, 32, 44, 0.95) 0%, rgba(26, 32, 44, 0.9) 100%);
  border-top: 1px solid rgba(102, 126, 234, 0.3);
  padding: 15px 20px;
}

:deep(.el-button--primary) {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
}

:deep(.el-button--primary:hover) {
  background: linear-gradient(135deg, #5a6fd8 0%, #6a4391 100%);
}

:deep(.el-button--default) {
  background: linear-gradient(135deg, rgba(26, 32, 44, 0.9) 0%, rgba(26, 32, 44, 0.7) 100%);
  border: 1px solid rgba(102, 126, 234, 0.5);
  color: #e2e8f0;
}

:deep(.el-button--default:hover) {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.2) 0%, rgba(118, 75, 162, 0.2) 100%);
  border-color: #667eea;
}

:deep(.el-dialog__headerbtn .el-dialog__close) {
  color: #a0aec0;
}

:deep(.el-dialog__headerbtn .el-dialog__close:hover) {
  color: #e2e8f0;
}

.title-decoration {
  position: absolute;
  bottom: -8px;
  left: 0;
  width: 100%;
  height: 2px;
  background: linear-gradient(90deg, transparent 0%, #667eea 50%, transparent 100%);
}

.header-center {
  flex: 1;
  display: flex;
  justify-content: center;
}

.year-selector-wrapper {
  position: relative;
}

.year-selector {
  width: 150px;
}

.year-selector :deep(.el-input__wrapper) {
  background: linear-gradient(135deg, rgba(26, 32, 44, 0.9) 0%, rgba(26, 32, 44, 0.7) 100%);
  border: 1px solid rgba(102, 126, 234, 0.5);
  box-shadow: 0 0 15px rgba(102, 126, 234, 0.2);
  backdrop-filter: blur(10px);
}

.year-selector :deep(.el-input__inner) {
  color: #e2e8f0;
  font-weight: 500;
  background: transparent;
}

.year-selector :deep(.el-input__suffix-inner) {
  color: #a0aec0;
}

.year-selector :deep(.el-select-dropdown) {
  background: linear-gradient(135deg, rgba(26, 32, 44, 0.95) 0%, rgba(26, 32, 44, 0.9) 100%);
  border: 1px solid rgba(102, 126, 234, 0.3);
  backdrop-filter: blur(10px);
}

.year-selector :deep(.el-select-dropdown__item) {
  color: #e2e8f0;
}

.year-selector :deep(.el-select-dropdown__item:hover) {
  background: rgba(102, 126, 234, 0.2);
}

.year-selector :deep(.el-select-dropdown__item.selected) {
  background: rgba(102, 126, 234, 0.3);
  color: #e2e8f0;
}

.header-right {
  flex: 1;
  display: flex;
  justify-content: flex-end;
}

.fullscreen-btn {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.2) 0%, rgba(118, 75, 162, 0.2) 100%);
  border: 1px solid rgba(102, 126, 234, 0.5);
  color: #e2e8f0;
  padding: 10px 20px;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.fullscreen-btn:hover {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.4) 0%, rgba(118, 75, 162, 0.4) 100%);
  border-color: #667eea;
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(102, 126, 234, 0.3);
}

.dashboard-body {
  position: relative;
  z-index: 5;
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 20px 30px;
  overflow: auto;
  min-height: 0;
}

.is-fullscreen .dashboard-body {
  overflow: auto;
  padding: 15px 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.bottom-section {
  flex: 2;
  min-height: 400px;
}

.is-fullscreen .bottom-section {
  flex: 1;
  min-height: 250px;
}

.top-section {
  margin-bottom: 20px;
}

.is-fullscreen .top-section {
  margin-bottom: 0;
  flex: 0 0 auto;
}

.kpi-cards {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}

.kpi-card {
  background: linear-gradient(135deg, rgba(26, 32, 44, 0.9) 0%, rgba(26, 32, 44, 0.7) 100%);
  border: 1px solid rgba(102, 126, 234, 0.2);
  border-radius: 12px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 15px;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
}

.kpi-card:hover {
  border-color: rgba(102, 126, 234, 0.5);
  transform: translateY(-3px);
  box-shadow: 0 10px 30px rgba(102, 126, 234, 0.2);
}

.kpi-icon {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  color: white;
  flex-shrink: 0;
}

.kpi-content {
  flex: 1;
}

.kpi-label {
  font-size: 14px;
  color: #a0aec0;
  margin-bottom: 5px;
}

.kpi-value {
  font-size: 28px;
  font-weight: 700;
  color: #e2e8f0;
  margin-bottom: 5px;
}

.kpi-unit {
  font-size: 14px;
  font-weight: 400;
  color: #a0aec0;
  margin-left: 5px;
}

.kpi-trend {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  font-size: 13px;
  padding: 2px 8px;
  border-radius: 12px;
}

.kpi-trend.up {
  color: #48bb78;
  background: rgba(72, 187, 120, 0.1);
}

.kpi-trend.down {
  color: #f56565;
  background: rgba(245, 101, 101, 0.1);
}

.middle-section {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 20px;
  flex: 1;
}

.is-fullscreen .middle-section {
  margin-bottom: 0;
  min-height: 200px;
}

.bottom-section {
  display: flex;
  flex-direction: column;
  gap: 20px;
  flex: 1;
  min-height: 0;
}

.is-fullscreen .bottom-section {
  margin-bottom: 0;
}

.full-width-panel {
  flex: 1;
  min-height: 250px;
}

.chart-panel,
.data-panel {
  background: linear-gradient(135deg, rgba(26, 32, 44, 0.9) 0%, rgba(26, 32, 44, 0.7) 100%);
  border: 1px solid rgba(102, 126, 234, 0.2);
  border-radius: 12px;
  backdrop-filter: blur(10px);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.panel-header {
  padding: 15px 20px;
  border-bottom: 1px solid rgba(102, 126, 234, 0.2);
  background: rgba(15, 20, 25, 0.5);
}

.panel-title {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 16px;
  font-weight: 600;
  color: #e2e8f0;
}

.title-icon {
  width: 4px;
  height: 18px;
  background: linear-gradient(180deg, #667eea 0%, #764ba2 100%);
  border-radius: 2px;
}

.panel-body {
  flex: 1;
  padding: 15px;
  min-height: 0;
}

.chart {
  width: 100%;
  height: 100%;
  min-height: 200px;
}

.table-wrapper {
  width: 100%;
  height: 100%;
  overflow-y: auto;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
}

.data-table thead {
  position: sticky;
  top: 0;
  background: rgba(15, 20, 25, 0.95);
  z-index: 5;
}

.data-table th {
  padding: 12px 15px;
  text-align: left;
  font-size: 13px;
  font-weight: 600;
  color: #a0aec0;
  border-bottom: 1px solid rgba(102, 126, 234, 0.2);
  white-space: nowrap;
}

.data-table td {
  padding: 10px 15px;
  font-size: 13px;
  color: #e2e8f0;
  border-bottom: 1px solid rgba(74, 85, 104, 0.2);
}

.data-table tbody tr {
  transition: all 0.2s ease;
}

.data-table tbody tr:hover {
  background: rgba(102, 126, 234, 0.1);
}

.data-table td.high {
  color: #f56565;
  font-weight: 600;
}

.data-table td.medium {
  color: #ed8936;
  font-weight: 600;
}

.data-table td.low {
  color: #48bb78;
  font-weight: 600;
}

.is-fullscreen .dashboard-container {
  height: 100vh;
}

.is-fullscreen .main-title {
  font-size: 32px;
}

.is-fullscreen .top-section {
  margin-bottom: 12px;
}

.is-fullscreen .kpi-cards {
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
}

.is-fullscreen .kpi-card {
  padding: 12px;
  min-height: 100px;
  flex-direction: column;
  text-align: center;
  gap: 8px;
}

.is-fullscreen .kpi-icon {
  width: 40px;
  height: 40px;
  font-size: 20px;
}

.is-fullscreen .kpi-label {
  font-size: 11px;
}

.is-fullscreen .kpi-value {
  font-size: 20px;
}

.is-fullscreen .kpi-trend {
  font-size: 10px;
  padding: 2px 5px;
}

.is-fullscreen .middle-section {
  flex-direction: row;
  margin-bottom: 12px;
  flex: 1;
  min-height: 180px;
  gap: 12px;
}

.is-fullscreen .chart-panel {
  min-height: 180px;
  flex: 1;
}

.is-fullscreen .panel-header {
  padding: 10px 12px;
}

.is-fullscreen .panel-title {
  font-size: 13px;
}

.is-fullscreen .panel-body {
  padding: 8px;
}

.is-fullscreen .chart {
  min-height: 160px;
}

.is-fullscreen .bottom-section {
  flex: 1;
  min-height: 250px;
}

.is-fullscreen .data-panel {
  min-height: 250px;
  flex: 1;
}

.is-fullscreen .table-wrapper {
  height: 100%;
  max-height: 200px;
  overflow-y: auto;
}

.is-fullscreen .data-table {
  font-size: 11px;
}

.is-fullscreen .data-table th,
.is-fullscreen .data-table td {
  padding: 6px 10px;
}

.is-fullscreen .data-table th {
  font-size: 10px;
}

/* 响应式缩放 - 全屏模式 */
@media (max-height: 850px) {
  .is-fullscreen .kpi-card {
    padding: 10px;
    min-height: 90px;
  }
  
  .is-fullscreen .kpi-icon {
    width: 38px;
    height: 38px;
    font-size: 19px;
  }
  
  .is-fullscreen .kpi-value {
    font-size: 19px;
  }
  
  .is-fullscreen .middle-section {
    min-height: 180px;
  }
  
  .is-fullscreen .chart {
    min-height: 140px;
  }
  
  .is-fullscreen .bottom-section {
    min-height: 230px;
  }
  
  .is-fullscreen .data-table th,
  .is-fullscreen .data-table td {
    padding: 5px 9px;
    font-size: 10px;
  }
}

@media (max-height: 750px) {
  .is-fullscreen .kpi-card {
    padding: 9px;
    min-height: 80px;
  }
  
  .is-fullscreen .kpi-icon {
    width: 35px;
    height: 35px;
    font-size: 18px;
  }
  
  .is-fullscreen .kpi-value {
    font-size: 18px;
  }
  
  .is-fullscreen .kpi-label {
    font-size: 10px;
  }
  
  .is-fullscreen .middle-section {
    min-height: 160px;
  }
  
  .is-fullscreen .chart {
    min-height: 120px;
  }
  
  .is-fullscreen .bottom-section {
    min-height: 200px;
  }
  
  .is-fullscreen .data-table th,
  .is-fullscreen .data-table td {
    padding: 4px 8px;
    font-size: 9px;
  }
}

@media (max-height: 650px) {
  .is-fullscreen .kpi-cards {
    gap: 8px;
  }
  
  .is-fullscreen .kpi-card {
    padding: 8px;
    min-height: 70px;
  }
  
  .is-fullscreen .kpi-icon {
    width: 32px;
    height: 32px;
    font-size: 16px;
  }
  
  .is-fullscreen .kpi-value {
    font-size: 16px;
  }
  
  .is-fullscreen .kpi-trend {
    font-size: 9px;
    padding: 1px 4px;
  }
  
  .is-fullscreen .middle-section {
    min-height: 140px;
    gap: 8px;
  }
  
  .is-fullscreen .chart {
    min-height: 100px;
  }
  
  .is-fullscreen .bottom-section {
    min-height: 180px;
  }
  
  .is-fullscreen .panel-header {
    padding: 8px 10px;
  }
  
  .is-fullscreen .panel-title {
    font-size: 12px;
  }
  
  .is-fullscreen .panel-body {
    padding: 6px;
  }
  
  .is-fullscreen .data-table th,
  .is-fullscreen .data-table td {
    padding: 3px 6px;
    font-size: 8px;
  }
}

@media (max-height: 550px) {
  .is-fullscreen .kpi-card {
    padding: 6px;
    min-height: 60px;
    gap: 6px;
  }
  
  .is-fullscreen .kpi-icon {
    width: 28px;
    height: 28px;
    font-size: 14px;
  }
  
  .is-fullscreen .kpi-value {
    font-size: 14px;
  }
  
  .is-fullscreen .kpi-label {
    font-size: 9px;
  }
  
  .is-fullscreen .middle-section {
    min-height: 120px;
  }
  
  .is-fullscreen .chart {
    min-height: 80px;
  }
  
  .is-fullscreen .bottom-section {
    min-height: 150px;
  }
  
  .is-fullscreen .data-table th,
  .is-fullscreen .data-table td {
    padding: 2px 4px;
    font-size: 7px;
  }
}

@media (max-width: 1600px) {
  .kpi-cards {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .middle-section {
    flex-direction: column;
  }
  
  .bottom-section {
    flex: 1;
  }
}

@media (max-width: 1200px) {
  .dashboard-header {
    padding: 15px 20px;
  }
  
  .main-title {
    font-size: 24px;
  }
  
  .dashboard-body {
    padding: 15px 20px;
  }
  
  .kpi-cards {
    grid-template-columns: 1fr;
  }
  
  .middle-section {
    flex-direction: column;
  }
}

:fullscreen .dashboard-bg {
  background: 
    radial-gradient(circle at 20% 30%, rgba(102, 126, 234, 0.2) 0%, transparent 50%),
    radial-gradient(circle at 80% 70%, rgba(118, 75, 162, 0.2) 0%, transparent 50%),
    radial-gradient(circle at 50% 50%, rgba(15, 20, 25, 1) 0%, rgba(15, 20, 25, 1) 100%);
}

:fullscreen .dashboard-container {
  height: 100vh;
}

:-webkit-full-screen .dashboard-container {
  height: 100vh;
}

:-moz-full-screen .dashboard-container {
  height: 100vh;
}

:-ms-fullscreen .dashboard-container {
  height: 100vh;
}
</style>