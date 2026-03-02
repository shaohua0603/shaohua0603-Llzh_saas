<template>
  <div class="attachment-container">
    <!-- 工具栏 -->
    <div class="toolbar">
      <el-input
        v-model="searchKeyword"
        placeholder="搜索附件名称"
        prefix-icon="Search"
        clearable
        style="width: 300px; margin-right: 16px"
        @input="handleSearch"
      />
      <el-select
        v-model="attachmentTypeFilter"
        placeholder="附件类型"
        clearable
        style="width: 150px; margin-right: 16px"
        @change="handleSearch"
      >
        <el-option label="全部" value="" />
        <el-option label="图片" value="image" />
        <el-option label="文件" value="file" />
        <el-option label="视频" value="video" />
        <el-option label="音频" value="audio" />
        <el-option label="文档" value="document" />
      </el-select>
      <el-button type="primary" @click="handleAdd">
        新增附件
      </el-button>
    </div>

    <!-- 附件列表 -->
    <el-table
      v-loading="loading"
      :data="tableData"
      border
      stripe
      style="width: 100%; margin-top: 16px"
    >
      <el-table-column type="index" label="序号" width="60" />
      <el-table-column prop="name" label="附件名称" min-width="200" />
      <el-table-column prop="typeName" label="附件类型" width="100">
        <template #default="scope">
          <el-tag :type="getAttachmentTypeTag(scope.row.type)" size="small">
            {{ scope.row.typeName }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="maxSize" label="附件大小" width="120">
        <template #default="scope">
          {{ scope.row.maxSize || '不限制' }}
        </template>
      </el-table-column>
      <el-table-column prop="required" label="是否必传" width="100">
        <template #default="scope">
          <el-tag :type="scope.row.required ? 'danger' : 'info'" size="small">
            {{ scope.row.required ? '必传' : '可选' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="menuName" label="关联菜单" min-width="180" show-overflow-tooltip />
      <el-table-column prop="templateName" label="附件模板" width="150">
        <template #default="scope">
          {{ scope.row.templateName || '-' }}
        </template>
      </el-table-column>
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
        <el-form-item label="附件名称" prop="name">
          <el-input
            v-model="formData.name"
            placeholder="请输入附件名称"
            maxlength="50"
          />
        </el-form-item>
        
        <el-form-item label="附件类型" prop="type">
          <el-select
            v-model="formData.type"
            placeholder="请选择附件类型"
            style="width: 100%"
          >
            <el-option label="图片" value="image" />
            <el-option label="文件" value="file" />
            <el-option label="视频" value="video" />
            <el-option label="音频" value="audio" />
            <el-option label="文档" value="document" />
          </el-select>
        </el-form-item>
        
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="附件大小" prop="maxSize">
              <el-input
                v-model="formData.maxSize"
                placeholder="如：10MB，不填则不限制"
                maxlength="20"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否必传" prop="required">
              <el-switch
                v-model="formData.required"
                active-text="是"
                inactive-text="否"
              />
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-form-item label="关联菜单" prop="menuId">
          <el-select
            v-model="formData.menuId"
            placeholder="请选择关联菜单"
            style="width: 100%"
            filterable
          >
            <el-option
              v-for="menu in menuList"
              :key="menu.id"
              :label="menu.name"
              :value="menu.id"
            />
          </el-select>
        </el-form-item>
        
        <el-form-item label="允许格式" prop="accept">
          <el-input
            v-model="formData.accept"
            placeholder="如：.jpg,.jpeg,.png,.pdf，多个用逗号分隔"
            maxlength="100"
          />
        </el-form-item>
        
        <el-form-item label="附件模板" prop="templateId">
          <el-select
            v-model="formData.templateId"
            placeholder="请选择附件模板（可选）"
            style="width: 100%"
            clearable
            filterable
          >
            <el-option
              v-for="template in templateList"
              :key="template.id"
              :label="template.name"
              :value="template.id"
            />
          </el-select>
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
const attachmentTypeFilter = ref('')

// 对话框
const dialogVisible = ref(false)
const dialogTitle = ref('')
const submitting = ref(false)
const formRef = ref()

// 菜单列表
const menuList = ref<any[]>([
  { id: '1', name: '请假管理' },
  { id: '2', name: '调岗管理' },
  { id: '3', name: '离职管理' },
  { id: '4', name: '报名管理' },
  { id: '5', name: '工人入职' },
  { id: '6', name: '合同签订' },
  { id: '7', name: '简历管理' }
])

// 模板列表
const templateList = ref<any[]>([
  { id: '1', name: '身份证模板.pdf' },
  { id: '2', name: '体检表模板.doc' },
  { id: '3', name: '劳动合同模板.pdf' }
])

// 附件类型名称映射
const typeNameMap: Record<string, string> = {
  image: '图片',
  file: '文件',
  video: '视频',
  audio: '音频',
  document: '文档'
}

// 表单数据
const formData = reactive({
  id: '',
  name: '',
  type: '',
  typeName: '',
  maxSize: '',
  required: false,
  menuId: '',
  menuName: '',
  accept: '',
  templateId: '',
  templateName: ''
})

// 表单验证规则
const formRules = {
  name: [
    { required: true, message: '请输入附件名称', trigger: 'blur' }
  ],
  type: [
    { required: true, message: '请选择附件类型', trigger: 'change' }
  ],
  menuId: [
    { required: true, message: '请选择关联菜单', trigger: 'change' }
  ]
}

// 获取附件类型标签
const getAttachmentTypeTag = (type: string) => {
  const tags: Record<string, string> = {
    image: 'success',
    file: 'primary',
    video: 'warning',
    audio: 'danger',
    document: 'info'
  }
  return tags[type] || 'info'
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
        name: '身份证照片',
        type: 'image',
        typeName: '图片',
        maxSize: '5MB',
        required: true,
        menuId: '5',
        menuName: '工人入职',
        templateName: '-',
        accept: '.jpg,.jpeg,.png',
        createTime: '2024-01-01 10:00:00'
      },
      {
        id: '2',
        name: '体检报告',
        type: 'document',
        typeName: '文档',
        maxSize: '10MB',
        required: true,
        menuId: '5',
        menuName: '工人入职',
        templateName: '体检表模板.doc',
        accept: '.pdf,.doc,.docx',
        createTime: '2024-01-01 10:00:00'
      },
      {
        id: '3',
        name: '劳动合同',
        type: 'document',
        typeName: '文档',
        maxSize: '10MB',
        required: true,
        menuId: '6',
        menuName: '合同签订',
        templateName: '劳动合同模板.pdf',
        accept: '.pdf',
        createTime: '2024-01-01 10:00:00'
      },
      {
        id: '4',
        name: '请假证明材料',
        type: 'file',
        typeName: '文件',
        maxSize: '20MB',
        required: false,
        menuId: '1',
        menuName: '请假管理',
        templateName: '-',
        accept: '.jpg,.jpeg,.png,.pdf',
        createTime: '2024-01-01 10:00:00'
      }
    ]
    total.value = 4
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
  dialogTitle.value = '新增附件配置'
  Object.assign(formData, {
    id: '',
    name: '',
    type: '',
    typeName: '',
    maxSize: '',
    required: false,
    menuId: '',
    menuName: '',
    accept: '',
    templateId: '',
    templateName: ''
  })
  dialogVisible.value = true
}

// 编辑
const handleEdit = (row: any) => {
  dialogTitle.value = '编辑附件配置'
  Object.assign(formData, {
    id: row.id,
    name: row.name,
    type: row.type,
    typeName: row.typeName,
    maxSize: row.maxSize,
    required: row.required,
    menuId: row.menuId,
    menuName: row.menuName,
    accept: row.accept,
    templateId: row.templateId || '',
    templateName: row.templateName || ''
  })
  dialogVisible.value = true
}

// 删除
const handleDelete = async (row: any) => {
  try {
    await ElMessageBox.confirm(`确定要删除附件配置"${row.name}"吗？`, '提示', {
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
        // 设置类型名称
        formData.typeName = typeNameMap[formData.type] || formData.type
        
        // 获取菜单名称
        const menu = menuList.value.find(m => m.id === formData.menuId)
        if (menu) {
          formData.menuName = menu.name
        }
        
        // 获取模板名称
        if (formData.templateId) {
          const template = templateList.value.find(t => t.id === formData.templateId)
          if (template) {
            formData.templateName = template.name
          }
        }
        
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
.attachment-container {
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
  .attachment-container {
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
