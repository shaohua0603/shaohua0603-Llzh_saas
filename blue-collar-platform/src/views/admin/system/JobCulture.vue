<template>
  <div class="job-culture-container">
    <!-- 工具栏 -->
    <div class="toolbar">
      <el-button type="primary" @click="handleAdd">
        新增岗位文化
      </el-button>
    </div>

    <!-- 岗位文化列表 -->
    <el-table
      v-loading="loading"
      :data="tableData"
      row-key="id"
      border
      stripe
      style="width: 100%; margin-top: 16px"
    >
      <el-table-column type="index" label="序号" width="60" />
      <el-table-column prop="factoryName" label="工厂名称" min-width="150" show-overflow-tooltip />
      <el-table-column prop="title" label="岗位文化标题" min-width="150" show-overflow-tooltip />
      <el-table-column prop="content" label="岗位文化内容" min-width="300" show-overflow-tooltip>
        <template #default="scope">
          <span v-html="scope.row.content"></span>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间" width="180" />
      <el-table-column label="操作" width="200" fixed="right">
        <template #default="scope">
          <el-button size="small" type="primary" @click="handleEdit(scope.row)">
            编辑
          </el-button>
          <el-button size="small" type="danger" @click="handleDelete(scope.row)">
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
      width="800px"
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
        <el-form-item label="工厂名称" prop="factoryId">
          <el-select
            v-model="formData.factoryId"
            placeholder="请选择工厂"
            filterable
            style="width: 100%"
          >
            <el-option
              v-for="factory in factoryList"
              :key="factory.id"
              :label="factory.name"
              :value="factory.id"
            />
          </el-select>
        </el-form-item>
        
        <el-form-item label="岗位文化标题" prop="title">
          <el-input
            v-model="formData.title"
            placeholder="请输入岗位文化标题"
            maxlength="100"
            show-word-limit
          />
        </el-form-item>
        
        <el-form-item label="岗位文化内容" prop="content">
          <RichTextEditor
            v-model="formData.content"
            placeholder="请输入岗位文化内容"
            :height="300"
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
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import RichTextEditor from '@/components/RichTextEditor.vue'

// 表格数据
const loading = ref(false)
const tableData = ref<any[]>([])
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

// 对话框
const dialogVisible = ref(false)
const dialogTitle = ref('')
const submitting = ref(false)
const formRef = ref()

// 表单数据
const formData = reactive({
  id: '',
  factoryId: '',
  title: '',
  content: ''
})

// 表单验证规则
const formRules = {
  factoryId: [
    { required: true, message: '请选择工厂', trigger: 'change' }
  ],
  title: [
    { required: true, message: '请输入岗位文化标题', trigger: 'blur' }
  ],
  content: [
    { required: true, message: '请输入岗位文化内容', trigger: 'blur' }
  ]
}

// 工厂列表
const factoryList = ref<any[]>([
  { id: '1', name: '比亚迪汽车有限公司' },
  { id: '2', name: '富士康科技集团' },
  { id: '3', name: '华为技术有限公司' },
  { id: '4', name: '小米科技有限公司' }
])

// 获取数据
const fetchData = async () => {
  loading.value = true
  try {
    // 模拟数据
    await new Promise(resolve => setTimeout(resolve, 500))
    tableData.value = [
      {
        id: '1',
        factoryId: '1',
        factoryName: '比亚迪汽车有限公司',
        title: '焊装车间岗位文化',
        content: '<p>焊装车间强调团队协作、安全第一、质量至上。我们倡导工匠精神，鼓励员工不断提升技能水平。</p>',
        createTime: '2024-01-15 10:00:00'
      },
      {
        id: '2',
        factoryId: '2',
        factoryName: '富士康科技集团',
        title: '组装线岗位文化',
        content: '<p>追求高效、精准、创新是我们组装线的核心价值。每一位员工都是品质的把关人。</p>',
        createTime: '2024-01-20 14:30:00'
      }
    ]
    total.value = 2
  } finally {
    loading.value = false
  }
}

// 新增
const handleAdd = () => {
  dialogTitle.value = '新增岗位文化'
  Object.assign(formData, {
    id: '',
    factoryId: '',
    title: '',
    content: ''
  })
  dialogVisible.value = true
}

// 编辑
const handleEdit = (row: any) => {
  dialogTitle.value = '编辑岗位文化'
  Object.assign(formData, {
    id: row.id,
    factoryId: row.factoryId,
    title: row.title,
    content: row.content
  })
  dialogVisible.value = true
}

// 删除
const handleDelete = async (row: any) => {
  try {
    await ElMessageBox.confirm('确定要删除该岗位文化吗？', '提示', {
      type: 'warning'
    })
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
.job-culture-container {
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
}

.toolbar {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 16px;
}

.pagination {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
}

/* 响应式设计 */
@media screen and (max-width: 768px) {
  .job-culture-container {
    padding: 16px;
  }
  
  :deep(.el-table) {
    font-size: 12px;
  }
  
  :deep(.el-button) {
    padding: 8px 12px;
    font-size: 12px;
  }
}
</style>
