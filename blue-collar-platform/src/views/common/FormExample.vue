<template>
  <div class="form-example-page">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>通用表单组件示例</span>
          <el-button type="primary" @click="handleLoadExample">加载示例数据</el-button>
        </div>
      </template>

      <CommonForm
        ref="formRef"
        v-model="formData"
        :config="formConfig"
        :loading="loading"
        @submit="handleSubmit"
        @reset="handleReset"
        @field-change="handleFieldChange"
        @save-draft="handleSaveDraft"
        @restore-draft="handleRestoreDraft"
      >
        <!-- 自定义字段示例 -->
        <template #field-customField="{ field, value, model }">
          <div class="custom-field">
            <el-input v-model="model.customField" placeholder="自定义输入框" />
            <el-button type="primary" @click="handleCustomAction">自定义操作</el-button>
          </div>
        </template>
      </CommonForm>
    </el-card>

    <!-- 表单数据展示 -->
    <el-card style="margin-top: 20px">
      <template #header>
        <span>表单数据</span>
      </template>
      <pre>{{ JSON.stringify(formData, null, 2) }}</pre>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import CommonForm from '@/components/CommonForm.vue'
import type { FormConfig, FormDataValue } from '@/types/common-form'

// 响应式数据
const formRef = ref()
const loading = ref(false)
const formData = ref<FormDataValue>({
  // 基本信息
  name: '',
  phone: '',
  email: '',
  idCard: '',
  gender: '',
  birthDate: '',

  // 联系信息
  address: '',
  zipCode: '',
  remark: '',

  // 工作信息
  userType: '',
  department: '',
  position: '',
  salary: 0,

  // 时间信息
  entryDate: '',
  dateRange: [],

  // 人员选择
  manager: '',
  teamMembers: [],

  // 兴趣爱好
  hobbies: [],

  // 附件
  attachments: [],
  images: [],

  // 自定义字段
  customField: ''
})

// 表单配置
const formConfig: FormConfig = {
  fields: [
    // ========== 基本信息 ==========
    {
      field: 'name',
      label: '姓名',
      type: 'TEXT',
      required: true,
      placeholder: '请输入姓名',
      maxLength: 20,
      span: 12,
      rules: [
        {
          type: 'required',
          message: '请输入姓名',
          trigger: 'blur'
        }
      ]
    },
    {
      field: 'phone',
      label: '手机号',
      type: 'TEXT',
      required: true,
      placeholder: '请输入手机号',
      span: 12,
      rules: [
        {
          type: 'required',
          message: '请输入手机号',
          trigger: 'blur'
        },
        {
          type: 'phone',
          message: '请输入正确的手机号',
          trigger: 'blur'
        }
      ]
    },
    {
      field: 'email',
      label: '邮箱',
      type: 'TEXT',
      required: true,
      placeholder: '请输入邮箱',
      span: 12,
      rules: [
        {
          type: 'required',
          message: '请输入邮箱',
          trigger: 'blur'
        },
        {
          type: 'email',
          message: '请输入正确的邮箱地址',
          trigger: 'blur'
        }
      ]
    },
    {
      field: 'idCard',
      label: '身份证号',
      type: 'TEXT',
      placeholder: '请输入身份证号',
      span: 12,
      rules: [
        {
          type: 'idcard',
          message: '请输入正确的身份证号',
          trigger: 'blur'
        }
      ]
    },
    {
      field: 'gender',
      label: '性别',
      type: 'SELECT',
      required: true,
      placeholder: '请选择性别',
      span: 12,
      options: [
        { value: 'male', label: '男' },
        { value: 'female', label: '女' }
      ],
      rules: [
        {
          type: 'required',
          message: '请选择性别',
          trigger: 'change'
        }
      ]
    },
    {
      field: 'birthDate',
      label: '出生日期',
      type: 'DATE',
      required: true,
      placeholder: '请选择出生日期',
      span: 12,
      rules: [
        {
          type: 'required',
          message: '请选择出生日期',
          trigger: 'change'
        }
      ]
    },

    // ========== 联系信息 ==========
    {
      field: 'address',
      label: '联系地址',
      type: 'TEXT',
      placeholder: '请输入联系地址',
      span: 18
    },
    {
      field: 'zipCode',
      label: '邮政编码',
      type: 'TEXT',
      placeholder: '请输入邮政编码',
      span: 6
    },
    {
      field: 'remark',
      label: '备注',
      type: 'TEXTAREA',
      placeholder: '请输入备注',
      rows: 3,
      maxLength: 500,
      span: 24
    },

    // ========== 工作信息 ==========
    {
      field: 'userType',
      label: '用户类型',
      type: 'SELECT',
      required: true,
      placeholder: '请选择用户类型',
      span: 12,
      options: [
        { value: 'worker', label: '工人' },
        { value: 'employee', label: '员工' }
      ],
      rules: [
        {
          type: 'required',
          message: '请选择用户类型',
          trigger: 'change'
        }
      ]
    },
    {
      field: 'department',
      label: '所属部门',
      type: 'SELECT',
      required: true,
      placeholder: '请选择所属部门',
      span: 12,
      options: [],
      linkage: [
        {
          type: 'options',
          field: 'userType',
          condition: (formData) => !!formData.userType,
          resultFn: (formData) => {
            if (formData.userType === 'worker') {
              return [
                { value: 'dept-1', label: '生产部' },
                { value: 'dept-2', label: '质检部' },
                { value: 'dept-3', label: '仓储部' }
              ]
            } else {
              return [
                { value: 'dept-4', label: '人力资源部' },
                { value: 'dept-5', label: '财务部' },
                { value: 'dept-6', label: '行政部' }
              ]
            }
          }
        }
      ],
      rules: [
        {
          type: 'required',
          message: '请选择所属部门',
          trigger: 'change'
        }
      ]
    },
    {
      field: 'position',
      label: '岗位',
      type: 'SELECT',
      placeholder: '请选择岗位',
      span: 12,
      visible: (formData) => formData.userType === 'employee',
      options: [
        { value: 'position-1', label: '经理' },
        { value: 'position-2', label: '主管' },
        { value: 'position-3', label: '专员' }
      ]
    },
    {
      field: 'salary',
      label: '薪资',
      type: 'NUMBER',
      placeholder: '请输入薪资',
      span: 12,
      min: 0,
      max: 100000,
      step: 100,
      precision: 2
    },

    // ========== 时间信息 ==========
    {
      field: 'entryDate',
      label: '入职日期',
      type: 'DATETIME',
      placeholder: '请选择入职日期',
      span: 12
    },
    {
      field: 'dateRange',
      label: '日期范围',
      type: 'DATERANGE',
      placeholder: '请选择日期范围',
      span: 12
    },

    // ========== 人员选择 ==========
    {
      field: 'manager',
      label: '负责人',
      type: 'PERSON',
      placeholder: '请选择负责人',
      span: 12,
      personSource: 'all',
      multiple: false
    },
    {
      field: 'teamMembers',
      label: '团队成员',
      type: 'PERSON',
      placeholder: '请选择团队成员',
      span: 12,
      personSource: 'all',
      multiple: true
    },

    // ========== 兴趣爱好 ==========
    {
      field: 'hobbies',
      label: '兴趣爱好',
      type: 'CHECKBOX',
      span: 24,
      options: [
        { value: 'reading', label: '阅读' },
        { value: 'sports', label: '运动' },
        { value: 'music', label: '音乐' },
        { value: 'travel', label: '旅游' },
        { value: 'cooking', label: '烹饪' },
        { value: 'photography', label: '摄影' }
      ]
    },

    // ========== 附件上传 ==========
    {
      field: 'attachments',
      label: '附件',
      type: 'FILE',
      span: 12,
      uploadLimit: 5,
      fileSizeLimit: 10,
      accept: ['.pdf', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx'],
      tip: '支持上传PDF、Word、Excel、PPT等文件，大小不超过10MB'
    },
    {
      field: 'images',
      label: '图片',
      type: 'IMAGE',
      span: 12,
      uploadLimit: 5,
      fileSizeLimit: 5,
      tip: '支持上传JPG、PNG等图片，大小不超过5MB'
    },

    // ========== 自定义字段 ==========
    {
      field: 'customField',
      label: '自定义字段',
      type: 'TEXT',
      span: 24
    }
  ],

  // 表单布局配置
  columns: 2,
  gutter: 20,
  labelWidth: '120px',
  labelPosition: 'right',
  size: 'default',

  // 按钮配置
  submitText: '提交',
  resetText: '重置',
  saveDraftText: '保存草稿',
  showSubmit: true,
  showReset: true,
  showSaveDraft: true,

  // 草稿配置
  autoSaveDraft: true,
  autoSaveDraftInterval: 30000,
  draftStorageKey: 'form-example-draft',

  // 按钮布局
  buttonAlign: 'center',
  buttonPosition: 'bottom'
}

// 处理表单提交
const handleSubmit = (data: FormDataValue) => {
  loading.value = true
  console.log('表单提交:', data)

  // 模拟API调用
  setTimeout(() => {
    loading.value = false
    ElMessage.success('提交成功')
  }, 1000)
}

// 处理表单重置
const handleReset = (data: FormDataValue) => {
  console.log('表单重置:', data)
  ElMessage.info('表单已重置')
}

// 处理字段变化
const handleFieldChange = (field: string, value: any) => {
  console.log('字段变化:', field, value)
}

// 处理保存草稿
const handleSaveDraft = (draftData: any) => {
  console.log('保存草稿:', draftData)
}

// 处理恢复草稿
const handleRestoreDraft = (draftData: any) => {
  console.log('恢复草稿:', draftData)
}

// 处理自定义操作
const handleCustomAction = () => {
  ElMessage.info('自定义操作')
}

// 加载示例数据
const handleLoadExample = () => {
  formData.value = {
    name: '张三',
    phone: '13800138000',
    email: 'zhangsan@example.com',
    idCard: '110101199001011234',
    gender: 'male',
    birthDate: '1990-01-01',
    address: '北京市朝阳区',
    zipCode: '100000',
    remark: '这是一条备注信息',
    userType: 'worker',
    department: 'dept-1',
    position: 'position-1',
    salary: 8000,
    entryDate: '2020-01-01 09:00:00',
    dateRange: ['2024-01-01', '2024-12-31'],
    manager: '',
    teamMembers: [],
    hobbies: ['reading', 'sports'],
    attachments: [],
    images: [],
    customField: '自定义字段值'
  }

  ElMessage.success('示例数据已加载')
}
</script>

<style scoped>
.form-example-page {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.custom-field {
  display: flex;
  gap: 12px;
}

pre {
  background-color: #f5f7fa;
  padding: 16px;
  border-radius: 4px;
  overflow-x: auto;
  font-size: 12px;
  line-height: 1.5;
}
</style>
