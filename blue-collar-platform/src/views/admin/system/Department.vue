<template>
  <div class="department-container">
    <!-- 工具栏 -->
    <div class="toolbar">
      <el-input
        v-model="searchKeyword"
        placeholder="搜索部门名称"
        prefix-icon="Search"
        clearable
        style="width: 300px; margin-right: 16px"
        @input="handleSearch"
      />
      <el-button type="primary" @click="handleAdd">
        新增部门
      </el-button>
    </div>

    <!-- 部门树形表格 -->
    <el-table
      v-loading="loading"
      :data="tableData"
      row-key="id"
      border
      stripe
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      style="width: 100%; margin-top: 16px"
      default-expand-all
    >
      <el-table-column type="index" label="序号" width="60" />
      <el-table-column prop="name" label="部门名称" min-width="180" />
      <el-table-column prop="levelName" label="级别别名" width="120" />
      <el-table-column prop="level" label="级别" width="80" />
      <el-table-column prop="description" label="部门介绍" min-width="200" show-overflow-tooltip />
      <el-table-column prop="contactPhone" label="联系电话" width="130" />
      <el-table-column prop="contactEmail" label="联系邮箱" width="180" show-overflow-tooltip />
      <el-table-column prop="contactAddress" label="联系地址" min-width="200" show-overflow-tooltip />
      <el-table-column label="操作" width="200" fixed="right">
        <template #default="scope">
          <el-button
            v-if="scope.row.parentId"
            size="small"
            type="primary"
            link
            @click.stop="handleAddChild(scope.row)"
          >
            添加下级
          </el-button>
          <el-button size="small" type="primary" link @click.stop="handleEdit(scope.row)">
            编辑
          </el-button>
          <el-button size="small" type="danger" link @click.stop="handleDelete(scope.row)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <div class="pagination">
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :page-sizes="[10, 20, 50, 100]"
        :total="total"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>

    <!-- 新增/编辑对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="700px"
      :close-on-click-modal="false"
      @close="handleDialogClose"
    >
      <el-form
        ref="formRef"
        :model="formData"
        :rules="formRules"
        label-width="120px"
        label-position="right"
      >
        <el-form-item label="上级部门" prop="parentId">
          <el-tree-select
            v-model="formData.parentId"
            :data="departmentTree"
            :props="treeProps"
            check-strictly
            :render-after-expand="false"
            placeholder="请选择上级部门"
            clearable
            style="width: 100%"
          />
        </el-form-item>
        
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="部门名称" prop="name">
              <el-input
                v-model="formData.name"
                placeholder="请输入部门名称"
                maxlength="50"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="级别" prop="level">
              <el-input-number
                v-model="formData.level"
                :min="1"
                :max="10"
                placeholder="请输入级别"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="级别别名" prop="levelName">
              <el-input
                v-model="formData.levelName"
                placeholder="如：总部、部门、小组"
                maxlength="20"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系电话" prop="contactPhone">
              <el-input
                v-model="formData.contactPhone"
                placeholder="请输入联系电话"
                maxlength="20"
              />
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="联系邮箱" prop="contactEmail">
              <el-input
                v-model="formData.contactEmail"
                placeholder="请输入联系邮箱"
                maxlength="50"
              />
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-form-item label="联系地址" prop="contactAddress">
          <el-input
            v-model="formData.contactAddress"
            placeholder="请输入联系地址"
            maxlength="200"
          />
        </el-form-item>
        
        <el-form-item label="部门介绍" prop="description">
          <el-input
            v-model="formData.description"
            type="textarea"
            :rows="4"
            placeholder="请输入部门介绍"
            maxlength="500"
            show-word-limit
          />
        </el-form-item>
      </el-form>
      
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit" :loading="submitting">
          保存
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

// 表格数据
const loading = ref(false)
const tableData = ref<any[]>([])
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)
const searchKeyword = ref('')

// 对话框
const dialogVisible = ref(false)
const dialogTitle = ref('')
const submitting = ref(false)
const formRef = ref()

// 树形选择器配置
const treeProps = {
  value: 'id',
  label: 'name',
  children: 'children'
}

// 部门树形数据（用于选择上级部门）
const departmentTree = computed(() => {
  const buildTree = (list: any[]): any[] => {
    return list.map(item => ({
      id: item.id,
      name: item.name,
      children: item.children ? buildTree(item.children) : []
    }))
  }
  return buildTree(tableData.value)
})

// 表单数据
const formData = reactive({
  id: '',
  parentId: '',
  name: '',
  level: 1,
  levelName: '',
  description: '',
  contactPhone: '',
  contactEmail: '',
  contactAddress: ''
})

// 表单验证规则
const formRules = {
  name: [
    { required: true, message: '请输入部门名称', trigger: 'blur' }
  ],
  level: [
    { required: true, message: '请输入级别', trigger: 'blur' }
  ],
  contactEmail: [
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
  ]
}

// 获取数据
const fetchData = async () => {
  loading.value = true
  try {
    // 模拟数据
    await new Promise(resolve => setTimeout(resolve, 500))
    tableData.value = [
      {
        id: '1',
        parentId: '',
        name: '蓝领智汇总部',
        level: 1,
        levelName: '总部',
        description: '蓝领智汇总部职能部门',
        contactPhone: '400-888-8888',
        contactEmail: 'hq@lanlingzhihui.com',
        contactAddress: '北京市朝阳区建国路88号',
        children: [
          {
            id: '1-1',
            parentId: '1',
            name: '技术研发部',
            level: 2,
            levelName: '部门',
            description: '负责平台技术研发工作',
            contactPhone: '010-12345678',
            contactEmail: 'tech@lanlingzhihui.com',
            contactAddress: '北京市朝阳区建国路88号A座',
            children: [
              {
                id: '1-1-1',
                parentId: '1-1',
                name: '前端开发组',
                level: 3,
                levelName: '小组',
                description: '负责前端开发工作',
                contactPhone: '010-12345679',
                contactEmail: 'frontend@lanlingzhihui.com',
                contactAddress: '北京市朝阳区建国路88号A座'
              },
              {
                id: '1-1-2',
                parentId: '1-1',
                name: '后端开发组',
                level: 3,
                levelName: '小组',
                description: '负责后端开发工作',
                contactPhone: '010-12345680',
                contactEmail: 'backend@lanlingzhihui.com',
                contactAddress: '北京市朝阳区建国路88号号A座'
              }
            ]
          },
          {
            id: '1-2',
            parentId: '1',
            name: '人力资源部',
            level: 2,
            levelName: '部门',
            description: '负责人员招聘和管理工作',
            contactPhone: '010-12345681',
            contactEmail: 'hr@lanlingzhihui.com',
            contactAddress: '北京市朝阳区建国路88号B座'
          },
          {
            id: '1-3',
            parentId: '1',
            name: '财务部',
            level: 2,
            levelName: '部门',
            description: '负责财务管理工作',
            contactPhone: '010-12345682',
            contactEmail: 'finance@lanlingzhihui.com',
            contactAddress: '北京市朝阳区建国路88号B座'
          }
        ]
      }
    ]
    total.value = 6
  } finally {
    loading.value = false
  }
}

// 搜索
const handleSearch = () => {
  currentPage.value = 1
  fetchData()
}

// 新增
const handleAdd = () => {
  dialogTitle.value = '新增部门'
  Object.assign(formData, {
    id: '',
    parentId: '',
    name: '',
    level: 1,
    levelName: '',
    description: '',
    contactPhone: '',
    contactEmail: '',
    contactAddress: ''
  })
  dialogVisible.value = true
}

// 添加下级
const handleAddChild = (row: any) => {
  dialogTitle.value = '添加下级部门'
  Object.assign(formData, {
    id: '',
    parentId: row.id,
    name: '',
    level: row.level + 1,
    levelName: '',
    description: '',
    contactPhone: '',
    contactEmail: '',
    contactAddress: ''
  })
  dialogVisible.value = true
}

// 编辑
const handleEdit = (row: any) => {
  dialogTitle.value = '编辑部门'
  Object.assign(formData, {
    id: row.id,
    parentId: row.parentId,
    name: row.name,
    level: row.level,
    levelName: row.levelName,
    description: row.description,
    contactPhone: row.contactPhone,
    contactEmail: row.contactEmail,
    contactAddress: row.contactAddress
  })
  dialogVisible.value = true
}

// 删除
const handleDelete = async (row: any) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除部门"${row.name}"吗？${row.children && row.children.length > 0 ? '该部门包含下级部门，将一并删除。' : ''}`,
      '提示',
      { type: 'warning' }
    )
    ElMessage.success('删除成功')
    fetchData()
  } catch {
    // 用户取消
  }
}

// 提交
const handleSubmit = async () => {
  if (!formRef.value) return
  
  await formRef.value.validate(async (valid: boolean) => {
    if (valid) {
      submitting.value = true
      try {
        await new Promise(resolve => setTimeout(resolve, 1000))
        ElMessage.success('保存成功')
        dialogVisible.value = false
        fetchData()
      } finally {
        submitting.value = false
      }
    }
  })
}

// 对话框关闭
const handleDialogClose = () => {
  formRef.value?.resetFields()
}

// 分页大小变化
const handleSizeChange = (size: number) => {
  pageSize.value = size
  fetchData()
}

// 当前页变化
const handleCurrentChange = (page: number) => {
  currentPage.value = page
  fetchData()
}

// 初始化
onMounted(() => {
  fetchData()
})
</script>

<style scoped>
.department-container {
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
}

.toolbar {
  display: flex;
  justify-content: flex-start;
  align-items: center;
}

.pagination {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
}

/* 响应式设计 */
@media screen and (max-width: 768px) {
  .department-container {
    padding: 16px;
  }
  
  .toolbar {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .toolbar > * {
    margin-bottom: 12px;
    margin-right: 0 !important;
  }
  
  :deep(.el-input) {
    width: 100% !important;
  }
  
  :deep(.el-table) {
    font-size: 12px;
  }
}
</style>
