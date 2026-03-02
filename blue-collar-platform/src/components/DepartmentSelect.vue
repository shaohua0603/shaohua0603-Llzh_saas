<template>
  <div class="department-select-container">
    <!-- 搜索区域 -->
    <div class="search-area">
      <el-input
        v-model="searchKeyword"
        placeholder="搜索部门名称"
        prefix-icon="Search"
        clearable
        @input="handleSearch"
      />
    </div>

    <!-- 部门树 -->
    <div class="department-tree">
      <el-tree
        ref="treeRef"
        v-loading="loading"
        :data="filteredDepartmentTree"
        :props="treeProps"
        :show-checkbox="multiple"
        :check-strictly="!checkStrictly"
        :node-key="nodeKey"
        :default-expanded-keys="defaultExpandedKeys"
        :filter-node-method="filterNode"
        @check="handleCheck"
        @node-click="handleNodeClick"
      >
        <template #default="{ node, data }">
          <span class="custom-tree-node">
            <el-icon><OfficeBuilding /></el-icon>
            <span class="node-label">{{ node.label }}</span>
            <span v-if="showCount" class="node-count">({{ data.userCount || 0 }})</span>
          </span>
        </template>
      </el-tree>
    </div>

    <!-- 底部按钮 -->
    <div class="dialog-footer">
      <el-button @click="handleCancel">取消</el-button>
      <el-button
        type="primary"
        @click="handleConfirm"
        :disabled="!hasSelection"
      >
        确定
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, nextTick } from 'vue'
import { ElMessage } from 'element-plus'
import { OfficeBuilding } from '@element-plus/icons-vue'
import type { TreeInstance, TreeKey } from 'element-plus'

// Props定义
interface Props {
  /** 是否多选 */
  multiple?: boolean
  /** 是否严格选择（父子不关联） */
  checkStrictly?: boolean
  /** 是否显示人数 */
  showCount?: boolean
  /** 节点Key */
  nodeKey?: string
}

const props = withDefaults(defineProps<Props>(), {
  multiple: false,
  checkStrictly: true,
  showCount: true,
  nodeKey: 'id'
})

// Emits定义
const emit = defineEmits<{
  'confirm': [selected: any]
  'cancel': []
}>()

// 响应式数据
const treeRef = ref<TreeInstance>()
const loading = ref(false)
const searchKeyword = ref('')
const departmentTree = ref<any[]>([])
const defaultExpandedKeys = ref<TreeKey[]>([])
const selectedNodes = ref<any[]>([])
const selectedNode = ref<any>(null)

// 树配置
const treeProps = {
  children: 'children',
  label: 'name'
}

// 过滤后的部门树
const filteredDepartmentTree = computed(() => {
  if (!searchKeyword.value) {
    return departmentTree.value
  }
  return filterTree(departmentTree.value, searchKeyword.value.toLowerCase())
})

// 是否有选中项
const hasSelection = computed(() => {
  if (props.multiple) {
    return selectedNodes.value.length > 0
  } else {
    return !!selectedNode.value
  }
})

// 过滤树节点
const filterTree = (tree: any[], keyword: string): any[] => {
  const result: any[] = []

  tree.forEach(node => {
    const match = node.name?.toLowerCase().includes(keyword)
    const children = node.children ? filterTree(node.children, keyword) : []

    if (match || children.length > 0) {
      result.push({
        ...node,
        children: children.length > 0 ? children : node.children
      })
    }
  })

  return result
}

// 过滤节点方法
const filterNode = (value: string, data: any) => {
  if (!value) return true
  return data.name?.toLowerCase().includes(value.toLowerCase())
}

// 加载部门树
const loadDepartmentTree = async () => {
  loading.value = true
  try {
    // TODO: 调用实际API
    // 模拟数据
    const mockData = generateMockData()
    departmentTree.value = mockData

    // 默认展开第一层
    defaultExpandedKeys.value = mockData.map(node => node.id)
  } catch (error) {
    ElMessage.error('加载部门树失败')
  } finally {
    loading.value = false
  }
}

// 生成模拟数据
const generateMockData = () => {
  return [
    {
      id: 'dept-1',
      name: '总公司',
      userCount: 150,
      children: [
        {
          id: 'dept-1-1',
          name: '人力资源部',
          userCount: 25,
          children: [
            { id: 'dept-1-1-1', name: '招聘组', userCount: 10 },
            { id: 'dept-1-1-2', name: '培训组', userCount: 8 },
            { id: 'dept-1-1-3', name: '薪酬组', userCount: 7 }
          ]
        },
        {
          id: 'dept-1-2',
          name: '财务部',
          userCount: 20,
          children: [
            { id: 'dept-1-2-1', name: '会计组', userCount: 12 },
            { id: 'dept-1-2-2', name: '出纳组', userCount: 8 }
          ]
        },
        {
          id: 'dept-1-3',
          name: '行政部',
          userCount: 15,
          children: [
            { id: 'dept-1-3-1', name: '后勤组', userCount: 8 },
            { id: 'dept-1-3-2', name: '安保组', userCount: 7 }
          ]
        }
      ]
    },
    {
      id: 'dept-2',
      name: '分公司A',
      userCount: 100,
      children: [
        {
          id: 'dept-2-1',
          name: '生产部',
          userCount: 60,
          children: [
            { id: 'dept-2-1-1', name: '生产一组', userCount: 20 },
            { id: 'dept-2-1-2', name: '生产二组', userCount: 20 },
            { id: 'dept-2-1-3', name: '生产三组', userCount: 20 }
          ]
        },
        {
          id: 'dept-2-2',
          name: '质检部',
          userCount: 20,
          children: [
            { id: 'dept-2-2-1', name: '质检一组', userCount: 10 },
            { id: 'dept-2-2-2', name: '质检二组', userCount: 10 }
          ]
        },
        {
          id: 'dept-2-3',
          name: '仓储部',
          userCount: 20,
          children: [
            { id: 'dept-2-3-1', name: '原料仓', userCount: 10 },
            { id: 'dept-2-3-2', name: '成品仓', userCount: 10 }
          ]
        }
      ]
    },
    {
      id: 'dept-3',
      name: '分公司B',
      userCount: 80,
      children: [
        {
          id: 'dept-3-1',
          name: '生产部',
          userCount: 50,
          children: [
            { id: 'dept-3-1-1', name: '生产一组', userCount: 25 },
            { id: 'dept-3-1-2', name: '生产二组', userCount: 25 }
          ]
        },
        {
          id: 'dept-3-2',
          name: '质检部',
          userCount: 15,
          children: [
            { id: 'dept-3-2-1', name: '质检一组', userCount: 8 },
            { id: 'dept-3-2-2', name: '质检二组', userCount: 7 }
          ]
        },
        {
          id: 'dept-3-3',
          name: '仓储部',
          userCount: 15,
          children: [
            { id: 'dept-3-3-1', name: '原料仓', userCount: 8 },
            { id: 'dept-3-3-2', name: '成品仓', userCount: 7 }
          ]
        }
      ]
    }
  ]
}

// 处理搜索
const handleSearch = () => {
  // 搜索由filterNode方法处理
}

// 处理选中
const handleCheck = (data: any, checked: any) => {
  if (props.multiple) {
    selectedNodes.value = checked.checkedNodes
  }
}

// 处理节点点击
const handleNodeClick = (data: any) => {
  if (!props.multiple) {
    selectedNode.value = data
  }
}

// 处理确认
const handleConfirm = () => {
  if (!hasSelection.value) {
    ElMessage.warning('请选择部门')
    return
  }

  let selected: any
  if (props.multiple) {
    selected = selectedNodes.value.map(node => ({
      id: node.id,
      name: node.name,
      path: getNodePath(node)
    }))
  } else {
    selected = {
      id: selectedNode.value.id,
      name: selectedNode.value.name,
      path: getNodePath(selectedNode.value)
    }
  }

  emit('confirm', selected)
}

// 获取节点路径
const getNodePath = (node: any): string => {
  const path: string[] = []
  let current = node

  while (current) {
    path.unshift(current.name)
    current = treeRef.value?.getNode(current.id)?.parent?.data
    if (current && current.id === undefined) {
      break
    }
  }

  return path.join(' / ')
}

// 处理取消
const handleCancel = () => {
  emit('cancel')
}

// 暴露方法
defineExpose({
  loadDepartmentTree
})

// 生命周期
onMounted(() => {
  loadDepartmentTree()
})
</script>

<style scoped>
.department-select-container {
  display: flex;
  flex-direction: column;
  height: 100%;
}

/* 搜索区域 */
.search-area {
  margin-bottom: 16px;
}

/* 部门树 */
.department-tree {
  flex: 1;
  overflow: auto;
  max-height: 400px;
  padding: 8px;
  border: 1px solid #ebeef5;
  border-radius: 4px;
}

.custom-tree-node {
  display: flex;
  align-items: center;
  gap: 4px;
  flex: 1;
  padding-right: 8px;
}

.node-label {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.node-count {
  color: #909399;
  font-size: 12px;
}

/* 底部按钮 */
.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #ebeef5;
}

/* 响应式设计 */
@media screen and (max-width: 768px) {
  .dialog-footer {
    flex-direction: column;
  }

  .dialog-footer .el-button {
    width: 100%;
  }
}
</style>
