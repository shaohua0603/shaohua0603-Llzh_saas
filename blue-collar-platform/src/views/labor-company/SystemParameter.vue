<template>
  <div class="system-parameter-container">
    <el-card>


      <div class="search-bar">
        <el-form :inline="true" :model="searchForm">
          <el-form-item label="参数名称">
            <el-input
              v-model="searchForm.name"
              placeholder="请输入参数名称"
              clearable
              style="width: 200px"
            />
          </el-form-item>
          <el-form-item label="参数编码">
            <el-input
              v-model="searchForm.code"
              placeholder="请输入参数编码"
              clearable
              style="width: 200px"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleSearch">
              搜索
            </el-button>
            <el-button @click="handleReset">
              重置
            </el-button>
          </el-form-item>
        </el-form>
      </div>

      <div class="action-bar">
        <el-button type="primary" @click="handleAdd">
          新增参数
        </el-button>
        <el-button @click="handleExport">
          导出
        </el-button>
        <el-button
          type="danger"
          :disabled="selectedRows.length === 0"
          @click="handleBatchDelete"
        >
          批量删除
        </el-button>
      </div>

      <el-table
        v-loading="loading"
        :data="tableData"
        border
        stripe
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column type="index" label="序号" width="60" />
        <el-table-column prop="name" label="参数名称" min-width="150" show-overflow-tooltip />
        <el-table-column prop="code" label="参数编码" width="150" show-overflow-tooltip />
        <el-table-column prop="value" label="参数值" min-width="200" show-overflow-tooltip />
        <el-table-column prop="description" label="参数说明" min-width="200" show-overflow-tooltip />
        <el-table-column label="操作" width="180" fixed="right">
          <template #default="scope">
            <el-button size="small" type="primary" link @click="handleEdit(scope.row)">
              编辑
            </el-button>
            <el-button size="small" type="danger" link @click="handleDelete(scope.row)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

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
    </el-card>

    <!-- 新增/编辑对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="isEdit ? '编辑参数' : '新增参数'"
      width="500px"
      :close-on-click-modal="false"
    >
      <el-form
        ref="formRef"
        :model="formData"
        :rules="formRules"
        label-width="120px"
      >
        <el-form-item label="参数名称" prop="name">
          <el-input
            v-model="formData.name"
            placeholder="请输入参数名称"
            maxlength="50"
            show-word-limit
          />
        </el-form-item>
        <el-form-item label="参数编码" prop="code">
          <el-input
            v-model="formData.code"
            placeholder="请输入参数编码"
            maxlength="50"
            show-word-limit
          />
        </el-form-item>
        <el-form-item label="参数值" prop="value">
          <el-input
            v-model="formData.value"
            placeholder="请输入参数值"
            maxlength="200"
            show-word-limit
          />
        </el-form-item>
        <el-form-item label="参数说明" prop="description">
          <el-input
            v-model="formData.description"
            type="textarea"
            :rows="3"
            placeholder="请输入参数说明"
            maxlength="200"
            show-word-limit
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit" :loading="submitting">
          {{ isEdit ? '更新' : '保存' }}
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox, type FormInstance } from 'element-plus'
import { exportExcelWithWatermark, getWatermarkText } from '@/utils/exportUtil'

// 状态管理
const loading = ref(false)
const tableData = ref<any[]>([])
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)
const selectedRows = ref<any[]>([])

// 搜索表单
const searchForm = reactive({
  name: '',
  code: ''
})

// 对话框状态
const dialogVisible = ref(false)
const isEdit = ref(false)
const submitting = ref(false)
const formRef = ref<FormInstance>()

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

// 模拟数据
const mockData = [
  { id: '1', name: '系统名称', code: 'system_name', value: '蓝领智汇', description: '系统的名称' },
  { id: '2', name: '系统版本', code: 'system_version', value: '1.0.0', description: '系统的版本号' },
  { id: '3', name: '默认语言', code: 'default_language', value: 'zh-CN', description: '系统默认语言' },
  { id: '4', name: 'session超时时间', code: 'session_timeout', value: '3600', description: 'Session超时时间（秒）' },
  { id: '5', name: '最大上传文件大小', code: 'max_upload_size', value: '10485760', description: '最大上传文件大小（字节）' },
  { id: '6', name: '系统邮箱', code: 'system_email', value: 'admin@lanlingzhihui.com', description: '系统管理员邮箱' },
  { id: '7', name: '系统电话', code: 'system_phone', value: '400-123-4567', description: '系统联系电话' },
  { id: '8', name: '首页轮播图数量', code: 'home_carousel_count', value: '5', description: '首页轮播图显示数量' },
  { id: '9', name: '资讯每页显示数量', code: 'news_page_size', value: '10', description: '资讯列表每页显示数量' },
  { id: '10', name: '活动每页显示数量', code: 'activity_page_size', value: '10', description: '活动列表每页显示数量' }
]

// 获取数据
const fetchData = async () => {
  loading.value = true
  try {
    // 模拟API调用
    setTimeout(() => {
      // 模拟搜索过滤
      let filteredData = [...mockData]
      if (searchForm.name) {
        filteredData = filteredData.filter(item => item.name.includes(searchForm.name))
      }
      if (searchForm.code) {
        filteredData = filteredData.filter(item => item.code.includes(searchForm.code))
      }
      
      // 模拟分页
      const start = (currentPage.value - 1) * pageSize.value
      const end = start + pageSize.value
      tableData.value = filteredData.slice(start, end)
      total.value = filteredData.length
      loading.value = false
    }, 500)
  } catch (error) {
    ElMessage.error('获取数据失败')
    loading.value = false
  }
}

// 搜索
const handleSearch = () => {
  currentPage.value = 1
  fetchData()
}

// 重置
const handleReset = () => {
  searchForm.name = ''
  searchForm.code = ''
  currentPage.value = 1
  fetchData()
}

// 选择变更
const handleSelectionChange = (selection: any[]) => {
  selectedRows.value = selection
}

// 新增
const handleAdd = () => {
  isEdit.value = false
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
  isEdit.value = true
  Object.assign(formData, row)
  dialogVisible.value = true
}

// 删除
const handleDelete = async (row: any) => {
  try {
    await ElMessageBox.confirm(`确定要删除参数"${row.name}"吗？`, '提示', {
      type: 'warning',
      confirmButtonText: '确定',
      cancelButtonText: '取消'
    })
    // 模拟删除
    ElMessage.success('删除成功')
    fetchData()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败')
    }
  }
}

// 批量删除
const handleBatchDelete = async () => {
  try {
    await ElMessageBox.confirm(`确定要删除选中的${selectedRows.value.length}个参数吗？`, '提示', {
      type: 'warning',
      confirmButtonText: '确定',
      cancelButtonText: '取消'
    })
    // 模拟批量删除
    ElMessage.success('批量删除成功')
    selectedRows.value = []
    fetchData()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('批量删除失败')
    }
  }
}

// 导出
const handleExport = () => {
  try {
    // 从localStorage获取用户信息
    const storedUserInfo = localStorage.getItem('userInfo')
    const userInfo = storedUserInfo ? JSON.parse(storedUserInfo) : null
    
    // 准备导出数据
    let exportData = [...mockData]
    if (searchForm.name) {
      exportData = exportData.filter(item => item.name.includes(searchForm.name))
    }
    if (searchForm.code) {
      exportData = exportData.filter(item => item.code.includes(searchForm.code))
    }
    
    // 定义表头
    const headers = {
      name: '参数名称',
      code: '参数编码',
      value: '参数值',
      description: '参数说明'
    }
    
    // 获取水印文本
    const watermark = getWatermarkText(userInfo)
    
    // 导出Excel文件
    const success = exportExcelWithWatermark(exportData, headers, '系统参数', watermark)
    
    if (success) {
      ElMessage.success('导出成功')
    } else {
      ElMessage.error('导出失败')
    }
  } catch (error) {
    ElMessage.error('导出失败')
  }
}

// 提交
const handleSubmit = async () => {
  if (!formRef.value) return
  
  await formRef.value.validate(async (valid: boolean) => {
    if (valid) {
      submitting.value = true
      try {
        // 模拟API调用
        setTimeout(() => {
          ElMessage.success(isEdit.value ? '更新成功' : '创建成功')
          dialogVisible.value = false
          fetchData()
          submitting.value = false
        }, 500)
      } catch (error) {
        ElMessage.error(isEdit.value ? '更新失败' : '创建失败')
        submitting.value = false
      }
    }
  })
}

// 分页
const handleSizeChange = (size: number) => {
  pageSize.value = size
  fetchData()
}

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
.system-parameter-container {
  padding: 20px;
}



.search-bar {
  margin-bottom: 20px;
}

.action-bar {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
  padding: 16px 20px;
  background-color: #f5f7fa;
  border-radius: 4px;
}

.pagination {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}

@media screen and (max-width: 768px) {
  .system-parameter-container {
    padding: 16px;
  }
  
  .card-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
  
  .search-bar {
    margin-bottom: 16px;
  }
  
  .search-bar :deep(.el-form-item) {
    display: block;
    margin-right: 0;
    margin-bottom: 12px;
  }
  
  .search-bar :deep(.el-input) {
    width: 100% !important;
  }
  
  .action-bar {
    flex-direction: column;
    align-items: stretch;
  }
  
  .action-bar > .el-button {
    width: 100%;
  }
  
  :deep(.el-table) {
    font-size: 12px;
  }
}
</style>