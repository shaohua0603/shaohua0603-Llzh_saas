<template>
  <div class="system-param-container">
    <!-- 工具栏 -->
    <div class="toolbar">
      <el-input
        v-model="searchKeyword"
        placeholder="搜索参数名称或编码"
        prefix-icon="Search"
        clearable
        style="width: 300px; margin-right: 16px"
        @input="handleSearch"
      />
      <el-button type="primary" @click="handleAdd">
        新增参数
      </el-button>
    </div>

    <!-- 参数列表 -->
    <el-table
      v-loading="loading"
      :data="tableData"
      border
      stripe
      style="width: 100%; margin-top: 16px"
    >
      <el-table-column type="index" label="序号" width="60" />
      <el-table-column prop="name" label="参数名称" min-width="180" />
      <el-table-column prop="code" label="参数编码" min-width="200" />
      <el-table-column prop="value" label="参数值" min-width="250" show-overflow-tooltip />
      <el-table-column prop="description" label="参数说明" min-width="250" show-overflow-tooltip />
      <el-table-column prop="createTime" label="创建时间" width="180" />
      <el-table-column label="操作" width="180" fixed="right">
        <template #default="scope">
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
      width="600px"
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
        <el-form-item label="参数名称" prop="name">
          <el-input
            v-model="formData.name"
            placeholder="请输入参数名称"
            maxlength="100"
          />
        </el-form-item>
        
        <el-form-item label="参数编码" prop="code">
          <el-input
            v-model="formData.code"
            placeholder="请输入参数编码"
            maxlength="100"
          />
        </el-form-item>
        
        <el-form-item label="参数值" prop="value">
          <el-input
            v-model="formData.value"
            type="textarea"
            :rows="3"
            placeholder="请输入参数值"
            maxlength="500"
          />
        </el-form-item>
        
        <el-form-item label="参数说明" prop="description">
          <el-input
            v-model="formData.description"
            type="textarea"
            :rows="3"
            placeholder="请输入参数说明"
            maxlength="200"
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

// 表单数据
const formData = reactive({
  id: '',
  name: '',
  code: '',
  value: '',
  description: ''
})

// 表单验证规则
const formRules = {
  name: [
    { required: true, message: '请输入参数名称', trigger: 'blur' }
  ],
  code: [
    { required: true, message: '请输入参数编码', trigger: 'blur' }
  ],
  value: [
    { required: true, message: '请输入参数值', trigger: 'blur' }
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
        name: '系统名称',
        code: 'system_name',
        value: '蓝领智汇SaaS系统',
        description: '系统显示名称',
        createTime: '2024-01-01 10:00:00'
      },
      {
        id: '2',
        name: '系统版本',
        code: 'system_version',
        value: 'v1.0.0',
        description: '系统当前版本号',
        createTime: '2024-01-01 10:00:00'
      },
      {
        id: '3',
        name: '文件上传大小限制',
        code: 'file_upload_max_size',
        value: '10MB',
        description: '单个文件上传大小限制',
        createTime: '2024-01-01 10:00:00'
      },
      {
        id: '4',
        name: '图片上传大小限制',
        code: 'image_upload_max_size',
        value: '5MB',
        description: '单张图片上传大小限制',
        createTime: '2024-01-01 10:00:00'
      },
      {
        id: '5',
        name: '允许的文件类型',
        code: 'allowed_file_types',
        value: 'doc,docx,xls,xlsx,pdf,jpg,jpeg,png',
        description: '允许上传的文件类型，用逗号分隔',
        createTime: '2024-01-01 10:00:00'
      },
      {
        id: '6',
        name: '会话超时时间',
        code: 'session_timeout',
        value: '7200',
        description: '会话超时时间（秒），默认2小时',
        createTime: '2024-01-01 10:00:00'
      },
      {
        id: '7',
        name: '密码最小长度',
        code: 'password_min_length',
        value: '6',
        description: '用户密码最小长度',
        createTime: '2024-01-01 10:00:00'
      },
      {
        id: '8',
        name: '密码最大长度',
        code: 'password_max_length',
        value: '20',
        description: '用户密码最大长度',
        createTime: '2024-01-01 10:00:00'
      },
      {
        id: '9',
        name: '登录失败锁定次数',
        code: 'login_fail_lock_count',
        value: '5',
        description: '连续登录失败锁定账号的次数',
        createTime: '2024-01-01 10:00:00'
      },
      {
        id: '10',
        name: '短信验证码有效期',
        code: 'sms_code_expire_minutes',
        value: '5',
        description: '短信验证码有效期（分钟）',
        createTime: '2024-01-01 10:00:00'
      }
    ]
    total.value = 10
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
  dialogTitle.value = '新增参数'
  Object.assign(formData, {
    id: '',
    name: '',
    code: '',
    value: '',
    description: ''
  })
  dialogVisible.value = true
}

// 编辑
const handleEdit = (row: any) => {
  dialogTitle.value = '编辑参数'
  Object.assign(formData, {
    id: row.id,
    name: row.name,
    code: row.code,
    value: row.value,
    description: row.description
  })
  dialogVisible.value = true
}

// 删除
const handleDelete = async (row: any) => {
  try {
    await ElMessageBox.confirm(`确定要删除参数"${row.name}"吗？`, '提示', {
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
.system-param-container {
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
  .system-param-container {
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
