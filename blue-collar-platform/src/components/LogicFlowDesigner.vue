<template>
  <div class="logicflow-designer-container" ref="designerContainer">
    <!-- 顶部工具栏 -->
    <div class="designer-toolbar">
      <div class="toolbar-left">
        <el-button type="primary" size="small" @click="handleSave">
          <el-icon><Check /></el-icon>
          保存
        </el-button>
        <el-button size="small" @click="handleReset">
          <el-icon><Refresh /></el-icon>
          重置
        </el-button>
      </div>
      <div class="toolbar-right">
        <el-button size="small" @click="handleZoomIn">
          <el-icon><ZoomIn /></el-icon>
          放大
        </el-button>
        <el-button size="small" @click="handleZoomOut">
          <el-icon><ZoomOut /></el-icon>
          缩小
        </el-button>
        <el-button size="small" @click="handleZoomReset">
          <el-icon><View /></el-icon>
          重置缩放
        </el-button>
        <el-button size="small" @click="handleFullscreen">
          <el-icon><FullScreen /></el-icon>
          {{ isFullscreen ? '退出全屏' : '全屏' }}
        </el-button>
      </div>
    </div>

    <!-- 主设计区域 -->
    <div class="designer-main">
      <!-- 左侧组件库 -->
      <div class="designer-palette">
        <h3>组件库</h3>
        <div class="palette-categories">
          <div 
            class="palette-category" 
            v-for="(category, index) in paletteCategories" 
            :key="index"
          >
            <h4>{{ category.title }}</h4>
            <div class="palette-items">
              <div 
                class="palette-item" 
                v-for="item in category.items" 
                :key="item.type + item.label"
                @mousedown="handleDragStart($event, item)"
              >
                <div class="item-icon" :class="[item.shape, item.className]"></div>
                <span>{{ item.label }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 中央画布 -->
      <div class="designer-canvas">
        <div id="logicflow-container" ref="lfContainer"></div>
      </div>

      <!-- 右侧属性面板 -->
      <div class="designer-properties">
        <h3>属性设置</h3>
        <div v-if="selectedNode" class="properties-content">
          <el-form label-width="80px" @submit.prevent="updateNodeProperties">
            <!-- 基础信息 -->
            <el-form-item label="节点名称">
              <el-input v-model="nodeProperties.text" @input="updateNodeProperties" />
            </el-form-item>
            <el-form-item label="节点类型">
              <el-input :model-value="getNodeTypeLabel(selectedNode.type || selectedNode.properties?.nodeType)" disabled />
            </el-form-item>
            <el-form-item label="节点ID">
              <el-input :model-value="selectedNode.id" disabled />
            </el-form-item>

            <!-- 审批节点属性 -->
            <template v-if="isApprovalNode">
              <el-divider content-position="left">审批设置</el-divider>
              <el-form-item label="审批模式">
                <el-select v-model="nodeProperties.approvalMode" placeholder="请选择审批模式" style="width: 100%" @change="updateNodeProperties">
                  <el-option v-for="item in approvalModeOptions" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
              </el-form-item>
              <el-form-item label="审批人类型">
                <el-select v-model="nodeProperties.approverType" placeholder="请选择审批人类型" style="width: 100%" @change="updateNodeProperties">
                  <el-option v-for="item in approverTypeOptions" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
              </el-form-item>
              <el-form-item label="审批人">
                <!-- 指定人 -->
                <el-input v-if="nodeProperties.approverType === 'user'" v-model="nodeProperties.approver" placeholder="请输入或选择审批人" @input="updateNodeProperties" />
                <!-- 岗位 -->
                <el-select v-else-if="nodeProperties.approverType === 'position'" v-model="nodeProperties.approver" placeholder="请选择岗位" style="width: 100%" @change="updateNodeProperties">
                  <el-option v-for="item in positionOptions" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
                <!-- 角色 -->
                <el-select v-else-if="nodeProperties.approverType === 'role'" v-model="nodeProperties.approver" placeholder="请选择角色" style="width: 100%" @change="updateNodeProperties">
                  <el-option v-for="item in roleOptions" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
                <!-- 部门 -->
                <el-select v-else-if="nodeProperties.approverType === 'department'" v-model="nodeProperties.approver" placeholder="请选择部门" style="width: 100%" @change="updateNodeProperties">
                  <el-option v-for="item in departmentOptions" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
              </el-form-item>
              <el-form-item label="超时时间">
                <div style="display: flex; align-items: center; gap: 8px;">
                  <el-input-number v-model="nodeProperties.timeoutHours" :min="0" :max="999" @change="updateNodeProperties" />
                  <span>小时</span>
                </div>
              </el-form-item>
              <el-form-item label="超时处理">
                <el-select v-model="nodeProperties.timeoutAction" placeholder="请选择超时处理方式" style="width: 100%" @change="updateNodeProperties">
                  <el-option v-for="item in timeoutActionOptions" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
              </el-form-item>
            </template>

            <!-- 抄送节点属性 -->
            <template v-if="isCcNode">
              <el-divider content-position="left">抄送设置</el-divider>
              <el-form-item label="接收人类型">
                <el-select v-model="nodeProperties.ccType" placeholder="请选择接收人类型" style="width: 100%" @change="updateNodeProperties">
                  <el-option v-for="item in approverTypeOptions" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
              </el-form-item>
              <el-form-item label="接收人">
                <el-input v-model="nodeProperties.ccUser" placeholder="请输入或选择接收人" @input="updateNodeProperties" />
              </el-form-item>
            </template>

            <!-- 条件节点属性 -->
            <template v-if="isConditionNode">
              <el-divider content-position="left">条件设置</el-divider>
              <el-form-item label="条件表达式">
                <el-input v-model="nodeProperties.condition" type="textarea" :rows="3" placeholder="请输入条件表达式" @input="updateNodeProperties" />
              </el-form-item>
              <el-form-item label="分支标签">
                <el-input v-model="nodeProperties.branchLabel" placeholder="如：通过/拒绝" @input="updateNodeProperties" />
              </el-form-item>
            </template>
          </el-form>
        </div>
        <div v-else class="properties-empty">
          <el-empty description="请在画布中选择一个节点" :image-size="60" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, computed } from 'vue'
import LogicFlow from '@logicflow/core'
import '@logicflow/core/lib/style/index.css'
import { Check, Refresh, ZoomIn, ZoomOut, View, FullScreen } from '@element-plus/icons-vue'

// 修复EventTarget类型错误
declare global {
  interface EventTarget {
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void;
    removeEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions): void;
  }
}

// Props
const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  readonly: {
    type: Boolean,
    default: false
  }
})

// Emits
const emit = defineEmits(['update:modelValue', 'save'])

// Refs
const designerContainer = ref<HTMLElement>()
const lfContainer = ref<HTMLElement>()
const lf = ref<LogicFlow>()
const selectedNode = ref<any>(null)
const nodeProperties = ref<any>({})
const isFullscreen = ref(false)

// 节点类型定义
interface PaletteItem {
  type: string
  label: string
  shape: string
  nodeType?: string
}

interface PaletteCategory {
  title: string
  items: PaletteItem[]
}

// 审批人类型选项
const approverTypeOptions = [
  { label: '指定人', value: 'user' },
  { label: '岗位', value: 'position' },
  { label: '角色', value: 'role' },
  { label: '部门', value: 'department' }
]

// 审批模式选项
const approvalModeOptions = [
  { label: '或签（任一人通过）', value: 'or' },
  { label: '会签（全部通过）', value: 'and' }
]

// 超时处理方式选项
const timeoutActionOptions = [
  { label: '自动通过', value: 'auto_pass' },
  { label: '自动驳回', value: 'auto_reject' },
  { label: '通知', value: 'notify' }
]

// 岗位选项
const positionOptions = [
  { label: '项目经理', value: 'project_manager' },
  { label: '部门经理', value: 'department_manager' },
  { label: '人事专员', value: 'hr_specialist' },
  { label: '财务专员', value: 'finance_specialist' }
]

// 角色选项
const roleOptions = [
  { label: '管理员', value: 'admin' },
  { label: '审批人', value: 'approver' },
  { label: '申请人', value: 'applicant' },
  { label: '查看者', value: 'viewer' }
]

// 部门选项
const departmentOptions = [
  { label: '人力资源部', value: 'hr' },
  { label: '财务部', value: 'finance' },
  { label: '技术部', value: 'tech' },
  { label: '市场部', value: 'marketing' }
]

// 判断选中节点是否为审批相关节点
const isApprovalNode = computed(() => {
  if (!selectedNode.value) return false
  const type = selectedNode.value.type || selectedNode.value.properties?.nodeType || ''
  return type === 'approval' || type === 'userTask' || selectedNode.value.properties?.isApprovalNode
})

// 判断选中节点是否为抄送节点
const isCcNode = computed(() => {
  if (!selectedNode.value) return false
  const type = selectedNode.value.type || selectedNode.value.properties?.nodeType || ''
  return type === 'cc' || selectedNode.value.properties?.isCcNode
})

// 判断选中节点是否为条件节点
const isConditionNode = computed(() => {
  if (!selectedNode.value) return false
  const type = selectedNode.value.type || selectedNode.value.properties?.nodeType || ''
  return type === 'condition' || selectedNode.value.properties?.isConditionNode
})

const paletteCategories = ref<PaletteCategory[]>([
  {
    title: '开始/结束',
    items: [
      { type: 'start', label: '开始', shape: 'circle', className: 'node-start', nodeType: 'start' },
      { type: 'end', label: '结束', shape: 'circle', className: 'node-end', nodeType: 'end' }
    ]
  },
  {
    title: '审批节点',
    items: [
      { type: 'approval', label: '审批节点', shape: 'rect', className: 'node-approval', nodeType: 'approval' }
    ]
  },
  {
    title: '抄送节点',
    items: [
      { type: 'cc', label: '抄送节点', shape: 'polygon', className: 'node-cc', nodeType: 'cc' }
    ]
  },
  {
    title: '条件节点',
    items: [
      { type: 'condition', label: '条件节点', shape: 'diamond', className: 'node-condition', nodeType: 'condition' }
    ]
  }
])

// 兼容旧接口
const basicNodes = computed(() => {
  const items: any[] = []
  paletteCategories.value.forEach(cat => {
    items.push(...cat.items)
  })
  return items
})

// 初始化LogicFlow
const initLogicFlow = () => {
  if (!lfContainer.value) return

  lf.value = new LogicFlow({
    container: lfContainer.value,
    grid: {
      type: 'dot',
      size: 10
    },
    keyboard: {
      enabled: true
    },
    snapline: true,
    background: {
      color: '#f5f7fa'
    },
    stopScrollGraph: false,
    stopZoomGraph: false
  })

  // 监听节点点击事件
  lf.value.on('node:click', (event: any) => {
    if (event.node) {
      selectedNode.value = event.node
      updateNodePropertiesForm(event.node)
    } else if (event.data) {
      selectedNode.value = event.data
      updateNodePropertiesForm(event.data)
    }
  })

  // 空白区域点击取消选中
  lf.value.on('blank:click', () => {
    selectedNode.value = null
  })

  // 连线点击也取消选中
  lf.value.on('edge:click', () => {
    selectedNode.value = null
  })

  // 加载数据并渲染
  if (props.modelValue) {
    try {
      const data = typeof props.modelValue === 'string' ? JSON.parse(props.modelValue) : props.modelValue
      lf.value.render(data)
    } catch (error) {
      console.error('Failed to load workflow data:', error)
      // 如果加载失败，渲染空画布
      lf.value.render()
    }
  } else {
    // 渲染空画布
    lf.value.render()
  }
}

// 更新节点属性表单
const updateNodePropertiesForm = (node: any) => {
  const nodeType = node.type || node.properties?.nodeType
  nodeProperties.value = {
    text: node.properties?.text || node.text || '',
    nodeType: nodeType,
    // 审批节点属性
    approvalMode: node.properties?.approvalMode || 'or',
    approverType: node.properties?.approverType || 'user',
    approver: node.properties?.approver || '',
    timeoutHours: node.properties?.timeoutHours || 0,
    timeoutAction: node.properties?.timeoutAction || 'notify',
    // 抄送节点属性
    ccType: node.properties?.ccType || 'user',
    ccUser: node.properties?.ccUser || '',
    // 条件节点属性
    condition: node.properties?.condition || '',
    branchLabel: node.properties?.branchLabel || ''
  }
}

// 获取节点类型标签
const getNodeTypeLabel = (type: string): string => {
  const typeMap: Record<string, string> = {
    'start': '开始',
    'end': '结束',
    'approval': '审批节点',
    'cc': '抄送节点',
    'condition': '条件节点',
    'userTask': '用户任务',
    'circle': '圆形',
    'rect': '矩形',
    'diamond': '菱形'
  }
  return typeMap[type] || type
}

// 更新节点属性
const updateNodeProperties = () => {
  if (!lf.value || !selectedNode.value) return

  const node = selectedNode.value
  const updatedProperties = {
    ...node.properties,
    ...nodeProperties.value
  }
  
  // 更新selectedNode对象，触发Vue响应式更新
  selectedNode.value = {
    ...selectedNode.value,
    properties: updatedProperties
  }
  
  // 更新LogicFlow中的节点属性
  lf.value.updateNode(node.id, {
    properties: updatedProperties
  })

  // 触发数据更新
  handleSave()
}

// 处理拖拽开始
const handleDragStart = (event: any, item: any) => {
  if (!lf.value) return

  if (event.preventDefault) {
    event.preventDefault()
  }

  // 获取节点类型的默认属性
  const getDefaultProperties = (type: string, label: string) => {
    const nodeType = type
    const baseProps: any = {
      text: label,
      nodeType: type
    }

    // 根据nodeType添加标记属性，帮助属性面板正确识别节点类型
    if (type === 'approval' || type === 'userTask') {
      baseProps.isApprovalNode = true
    } else if (type === 'cc') {
      baseProps.isCcNode = true
    } else if (type === 'condition') {
      baseProps.isConditionNode = true
    }

    switch (type) {
      case 'approval':
        return {
          ...baseProps,
          approvalMode: 'or',
          approverType: 'user',
          approver: '',
          timeoutHours: 0,
          timeoutAction: 'notify'
        }
      case 'cc':
        return {
          ...baseProps,
          ccType: 'user',
          ccUser: ''
        }
      case 'condition':
        return {
          ...baseProps,
          condition: '',
          branchLabel: ''
        }
      default:
        return baseProps
    }
  }

  // 检查是否有 dnd.startDrag 方法
  if (lf.value.dnd && lf.value.dnd.startDrag) {
    lf.value.dnd.startDrag({
      type: item.shape,
      text: item.label,
      properties: getDefaultProperties(item.nodeType || item.type, item.label)
    })
  } else {
    console.warn('DnD functionality not available')
  }
}

// 保存
const handleSave = () => {
  if (!lf.value) return

  const data = lf.value.save()
  emit('update:modelValue', JSON.stringify(data))
  emit('save', data)
}

// 重置
const handleReset = () => {
  if (!lf.value) return
  lf.value.clear()
  emit('update:modelValue', '')
}

// 放大
const handleZoomIn = () => {
  if (!lf.value) return
  lf.value.zoom(0.1)
}

// 缩小
const handleZoomOut = () => {
  if (!lf.value) return
  lf.value.zoom(-0.1)
}

// 重置缩放
const handleZoomReset = () => {
  if (!lf.value) return
  lf.value.zoomTo(1)
}

// 全屏
const handleFullscreen = () => {
  if (!designerContainer.value) return

  // 检查当前是否处于全屏状态
  const isCurrentlyFullscreen = document.fullscreenElement !== null

  if (!isCurrentlyFullscreen) {
    if (designerContainer.value.requestFullscreen) {
      designerContainer.value.requestFullscreen()
        .then(() => {
          isFullscreen.value = true
          // 延迟调整LogicFlow大小，确保DOM已经更新
          setTimeout(() => {
            if (lf.value) {
              lf.value.resize()
            }
          }, 300)
        })
        .catch((error) => {
          console.error('Error entering fullscreen:', error)
        })
    }
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen()
        .then(() => {
          isFullscreen.value = false
          // 延迟调整LogicFlow大小，确保DOM已经更新
          setTimeout(() => {
            if (lf.value) {
              lf.value.resize()
            }
          }, 300)
        })
        .catch((error) => {
          console.error('Error exiting fullscreen:', error)
          // 强制重置状态
          isFullscreen.value = false
        })
    }
  }
}

// 监听模型值变化
watch(
  () => props.modelValue,
  (newValue) => {
    if (!lf.value || !newValue) return

    try {
      lf.value.render(newValue)
    } catch (error) {
      console.error('Failed to load workflow data:', error)
    }
  }
)

// 生命周期
onMounted(() => {
  initLogicFlow()
})

onUnmounted(() => {
  if (lf.value) {
    lf.value.destroy()
  }
})
</script>

<style scoped>
.logicflow-designer-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #f5f7fa;
}

.designer-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  background-color: #fff;
  border-bottom: 1px solid #e4e7ed;
  z-index: 10;
}

.toolbar-left,
.toolbar-right {
  display: flex;
  gap: 8px;
}

.designer-main {
  flex: 1;
  display: flex;
  overflow: hidden;
}

.designer-palette {
  width: 200px;
  background-color: #fff;
  border-right: 1px solid #e4e7ed;
  padding: 16px;
  overflow-y: auto;
  z-index: 5;
}

.designer-palette h3 {
  margin: 0 0 16px 0;
  font-size: 14px;
  font-weight: 600;
  color: #333;
}

.palette-category {
  margin-bottom: 20px;
}

.palette-category h4 {
  margin: 0 0 10px 0;
  font-size: 12px;
  font-weight: 500;
  color: #666;
}

.palette-items {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.palette-item {
  display: flex;
  align-items: center;
  padding: 8px;
  border: 1px solid #e4e7ed;
  border-radius: 4px;
  cursor: grab;
  transition: all 0.2s;
}

.palette-item:hover {
  border-color: #409eff;
  background-color: #ecf5ff;
}

.palette-item:active {
  cursor: grabbing;
}

.palette-item .item-icon {
  width: 28px;
  height: 28px;
  margin-right: 8px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.palette-item .item-icon.node-start {
  background-color: #67c23a;
  border-radius: 50%;
}

.palette-item .item-icon.node-end {
  background-color: #f56c6c;
  border-radius: 50%;
}

.palette-item .item-icon.node-approval {
  background-color: #409eff;
  border-radius: 4px;
}

.palette-item .item-icon.node-cc {
  background-color: #e6a23c;
  clip-path: polygon(25% 0%, 100% 0%, 75% 100%, 0% 100%);
}

.palette-item .item-icon.node-condition {
  background-color: #f39c12;
  transform: rotate(45deg);
  width: 20px;
  height: 20px;
}

.palette-item .item-icon.node-task {
  background-color: #409eff;
}

.palette-item .item-icon.node-user-task {
  background-color: #e6a23c;
}

.palette-item .item-icon.node-service-task {
  background-color: #9b59b6;
}

.palette-item .item-icon.node-condition {
  background-color: #f39c12;
  transform: rotate(45deg);
  width: 20px;
  height: 20px;
}

.palette-item .item-icon.node-parallel {
  background-color: #3498db;
}

.palette-item .item-icon.node-inclusive {
  background-color: #1abc9c;
}

.palette-item .item-icon.node-rect {
  background-color: #409eff;
}

.palette-item .item-icon.node-circle {
  background-color: #67c23a;
  border-radius: 50%;
}

.palette-item .item-icon.node-ellipse {
  background-color: #e6a23c;
  border-radius: 50%;
}

.palette-item .item-icon.node-diamond {
  background-color: #f39c12;
  transform: rotate(45deg);
  width: 20px;
  height: 20px;
}

.designer-canvas {
  flex: 1;
  position: relative;
  overflow: auto;
}

#logicflow-container {
  width: 100%;
  height: 100%;
  min-height: 600px;
}

.designer-properties {
  width: 280px;
  background-color: #fff;
  border-left: 1px solid #e4e7ed;
  padding: 16px;
  overflow-y: auto;
  z-index: 5;
}

.designer-properties h3 {
  margin: 0 0 16px 0;
  font-size: 14px;
  font-weight: 600;
  color: #333;
}

.properties-content {
  margin-top: 16px;
}

.properties-empty {
  margin-top: 40px;
  text-align: center;
}

/* 全屏样式 */
:fullscreen {
  background-color: #f5f7fa;
}

:fullscreen .logicflow-designer-container {
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
}

:fullscreen .designer-main {
  flex: 1;
  display: flex;
  overflow: hidden;
}

:fullscreen .designer-toolbar {
  position: relative;
  z-index: 10;
}

:fullscreen .designer-palette {
  position: relative;
  z-index: 5;
}

:fullscreen .designer-properties {
  position: relative;
  z-index: 5;
}

:fullscreen .designer-canvas {
  flex: 1;
  position: relative;
}

:fullscreen #logicflow-container {
  width: 100%;
  height: 100%;
}

/* 响应式设计 */
@media screen and (max-width: 1200px) {
  .designer-palette {
    width: 160px;
  }

  .designer-properties {
    width: 240px;
  }
}

@media screen and (max-width: 768px) {
  .designer-main {
    flex-direction: column;
  }

  .designer-palette {
    width: 100%;
    height: 120px;
    border-right: none;
    border-bottom: 1px solid #e4e7ed;
  }

  .palette-items {
    flex-direction: row;
    flex-wrap: wrap;
  }

  .palette-item {
    width: calc(25% - 6px);
    justify-content: center;
    text-align: center;
  }

  .designer-properties {
    width: 100%;
    height: 200px;
    border-left: none;
    border-top: 1px solid #e4e7ed;
  }

  .designer-canvas {
    flex: 1;
  }
}
</style>