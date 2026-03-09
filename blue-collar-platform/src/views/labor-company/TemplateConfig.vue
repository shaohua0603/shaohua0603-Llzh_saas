<template>
  <div class="template-config">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>模板配置</span>
          <el-input
            v-model="searchKeyword"
            placeholder="搜索模板"
            prefix-icon="Search"
            clearable
            size="small"
            style="width: 200px"
            @input="handleSearch"
          />
        </div>
      </template>

      <!-- 功能按钮 -->
      <div class="action-bar">
        <el-button type="primary" @click="handleAdd">
          <el-icon><Plus /></el-icon>新增模板
        </el-button>
        <el-button @click="handleBatchDelete" :disabled="selectedRows.length === 0">
          <el-icon><Delete /></el-icon>批量删除
        </el-button>
      </div>

      <!-- 表格 -->
      <el-table
        v-loading="loading"
        :data="tableData"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="50" />
        <el-table-column prop="templateCode" label="模板编码" width="150" />
        <el-table-column prop="templateName" label="模板名称" min-width="180" />
        <el-table-column prop="templateType" label="模板类型" width="120">
          <template #default="{ row }">
            {{ getTemplateTypeText(row.templateType) }}
          </template>
        </el-table-column>
        <el-table-column prop="variables" label="变量数量" width="100">
          <template #default="{ row }">
            {{ row.variables ? row.variables.length : 0 }}
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getStatusColor(row.status)">
              {{ getStatusText(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createdBy" label="创建人" width="120" />
        <el-table-column prop="createdAt" label="创建时间" width="180" />
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button size="small" type="primary" link @click="handleEdit(row)">
              编辑
            </el-button>
            <el-button
              size="small"
              type="success"
              link
              @click="handlePublish(row)"
              v-if="row.status === 'draft'"
            >
              发布
            </el-button>
            <el-button
              size="small"
              type="warning"
              link
              @click="handleUnpublish(row)"
              v-if="row.status === 'published'"
            >
              取消发布
            </el-button>
            <el-button size="small" type="danger" link @click="handleDelete(row)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination" v-if="tableData.length > 0">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :total="total"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handlePageChange"
        />
      </div>

      <!-- 空状态提示 -->
      <el-empty v-if="tableData.length === 0 && !loading" description="暂无模板" />
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Delete, Search } from '@element-plus/icons-vue'
import type { PrintTemplate } from '@/types/print-management'

const router = useRouter()
const searchKeyword = ref('')
const loading = ref(false)
const tableData = ref<PrintTemplate[]>([])
const selectedRows = ref<PrintTemplate[]>([])
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

// 模拟数据
const mockTemplates = [
  {
    id: '1',
    templateName: '工人信息模板',
    templateCode: 'worker_info_template',
    templateType: 'form',
    status: 'published',
    variables: [
      { variableName: 'workerName', variableLabel: '工人姓名', variableType: 'text', required: true },
      { variableName: 'workerId', variableLabel: '工号', variableType: 'text', required: true },
      { variableName: 'idCard', variableLabel: '身份证号', variableType: 'text', required: true },
      { variableName: 'phone', variableLabel: '手机号', variableType: 'text', required: true },
      { variableName: 'hireDate', variableLabel: '入职日期', variableType: 'date', required: true }
    ],
    createdBy: 'admin',
    createdAt: '2026-01-01 10:00:00'
  },
  {
    id: '2',
    templateName: '合同模板',
    templateCode: 'contract_template',
    templateType: 'contract',
    status: 'published',
    variables: [
      { variableName: 'contractNo', variableLabel: '合同编号', variableType: 'text', required: true },
      { variableName: 'workerName', variableLabel: '工人姓名', variableType: 'text', required: true },
      { variableName: 'companyName', variableLabel: '公司名称', variableType: 'text', required: true },
      { variableName: 'startDate', variableLabel: '开始日期', variableType: 'date', required: true },
      { variableName: 'endDate', variableLabel: '结束日期', variableType: 'date', required: true }
    ],
    createdBy: 'admin',
    createdAt: '2026-01-02 14:30:00'
  },
  {
    id: '3',
    templateName: '考勤记录模板',
    templateCode: 'attendance_template',
    templateType: 'form',
    status: 'published',
    variables: [
      { variableName: 'workerName', variableLabel: '工人姓名', variableType: 'text', required: true },
      { variableName: 'workerId', variableLabel: '工号', variableType: 'text', required: true },
      { variableName: 'month', variableLabel: '月份', variableType: 'text', required: true },
      { variableName: 'totalDays', variableLabel: '总天数', variableType: 'number', required: true },
      { variableName: 'absentDays', variableLabel: '缺勤天数', variableType: 'number', required: true }
    ],
    createdBy: 'admin',
    createdAt: '2026-01-03 09:15:00'
  },
  {
    id: '4',
    templateName: '工资单模板',
    templateCode: 'salary_template',
    templateType: 'form',
    status: 'published',
    variables: [
      { variableName: 'workerName', variableLabel: '工人姓名', variableType: 'text', required: true },
      { variableName: 'workerId', variableLabel: '工号', variableType: 'text', required: true },
      { variableName: 'month', variableLabel: '月份', variableType: 'text', required: true },
      { variableName: 'basicSalary', variableLabel: '基本工资', variableType: 'number', required: true },
      { variableName: 'overtimeSalary', variableLabel: '加班费', variableType: 'number', required: true },
      { variableName: 'totalSalary', variableLabel: '总工资', variableType: 'number', required: true }
    ],
    createdBy: 'admin',
    createdAt: '2026-01-04 16:45:00'
  }
]

const fetchTemplateList = async () => {
  loading.value = true
  try {
    // 模拟 API 请求延迟
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // 模拟搜索功能
    let filteredTemplates = [...mockTemplates]
    if (searchKeyword.value) {
      const keyword = searchKeyword.value.toLowerCase()
      filteredTemplates = filteredTemplates.filter(template => 
        template.templateName.toLowerCase().includes(keyword) ||
        template.templateCode.toLowerCase().includes(keyword)
      )
    }
    
    // 模拟分页
    const start = (currentPage.value - 1) * pageSize.value
    const end = start + pageSize.value
    tableData.value = filteredTemplates.slice(start, end)
    total.value = filteredTemplates.length
  } catch (error) {
    console.error('获取模板列表失败:', error)
    ElMessage.error('获取模板列表失败')
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  currentPage.value = 1
  fetchTemplateList()
}

const handleAdd = () => {
  router.push('/tenant/template-config/add')
}

const handleEdit = (row: PrintTemplate) => {
  router.push(`/tenant/template-config/edit/${row.id}`)
}

const handlePublish = async (row: PrintTemplate) => {
  try {
    const response = await fetch(`/api/v1/print-templates/${row.id}/publish`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    const result = await response.json()
    if (result.code === 200) {
      ElMessage.success('发布成功')
      fetchTemplateList()
    } else {
      ElMessage.error(result.message || '发布失败')
    }
  } catch (error) {
    console.error('发布失败:', error)
    ElMessage.error('发布失败')
  }
}

const handleUnpublish = async (row: PrintTemplate) => {
  try {
    const response = await fetch(`/api/v1/print-templates/${row.id}/unpublish`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    const result = await response.json()
    if (result.code === 200) {
      ElMessage.success('取消发布成功')
      fetchTemplateList()
    } else {
      ElMessage.error(result.message || '取消发布失败')
    }
  } catch (error) {
    console.error('取消发布失败:', error)
    ElMessage.error('取消发布失败')
  }
}

const handleDelete = async (row: PrintTemplate) => {
  try {
    await ElMessageBox.confirm(`确定要删除模板 ${row.templateName} 吗？`, '提示', {
      type: 'warning'
    })
    const response = await fetch(`/api/v1/print-templates/${row.id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    const result = await response.json()
    if (result.code === 200) {
      ElMessage.success('删除成功')
      fetchTemplateList()
    } else {
      ElMessage.error(result.message || '删除失败')
    }
  } catch (error) {
    console.error('删除失败:', error)
    ElMessage.error('删除失败')
  }
}

const handleBatchDelete = async () => {
  if (selectedRows.value.length === 0) {
    ElMessage.warning('请先选择要删除的模板')
    return
  }
  try {
    await ElMessageBox.confirm(`确定要删除选中的${selectedRows.value.length}个模板吗？`, '提示', {
      type: 'warning'
    })
    let successCount = 0
    for (const row of selectedRows.value) {
      try {
        const response = await fetch(`/api/v1/print-templates/${row.id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json'
          }
        })
        const result = await response.json()
        if (result.code === 200) {
          successCount++
        }
      } catch (error) {
        console.error('删除失败:', error)
      }
    }
    ElMessage.success(`成功删除${successCount}个模板`)
    fetchTemplateList()
  } catch {
  }
}

const handleSelectionChange = (selection: PrintTemplate[]) => {
  selectedRows.value = selection
}

const handlePageChange = (page: number) => {
  currentPage.value = page
  fetchTemplateList()
}

const handleSizeChange = (size: number) => {
  pageSize.value = size
  currentPage.value = 1
  fetchTemplateList()
}

const getStatusColor = (status: string) => {
  const colorMap: Record<string, string> = {
    published: 'success',
    draft: 'info'
  }
  return colorMap[status] || 'info'
}

const getStatusText = (status: string) => {
  const textMap: Record<string, string> = {
    published: '已发布',
    draft: '草稿'
  }
  return textMap[status] || '草稿'
}

const getTemplateTypeText = (type: string) => {
  const typeMap: Record<string, string> = {
    contract: '合同类',
    proof: '证明类',
    form: '表单类',
    certificate: '证书类',
    other: '其他'
  }
  return typeMap[type] || '其他'
}

onMounted(() => {
  fetchTemplateList()
})
</script>

<style scoped>
.template-config {
  padding: 16px;
  background-color: #f5f7fa;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 15px;
  font-weight: 600;
}

.action-bar {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
}

.pagination {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
}

.editor-container {
  position: relative;
}

.editor-tools {
  position: absolute;
  bottom: 10px;
  right: 10px;
  z-index: 10;
}

.variables-container {
  margin-top: 10px;
}
</style>