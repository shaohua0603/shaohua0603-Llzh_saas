<template>
  <div class="rich-text-editor-container">
    <!-- 工具栏 -->
    <div v-if="showToolbar" class="editor-toolbar">
      <el-button-group>
        <!-- 文本格式 -->
        <el-tooltip content="加粗" placement="top">
          <el-button
            :type="isFormatActive('bold') ? 'primary' : 'default'"
            @click="execCommand('bold')"
          >
            <el-icon><Grid /></el-icon>
          </el-button>
        </el-tooltip>
        <el-tooltip content="斜体" placement="top">
          <el-button
            :type="isFormatActive('italic') ? 'primary' : 'default'"
            @click="execCommand('italic')"
          >
            <el-icon><Grid /></el-icon>
          </el-button>
        </el-tooltip>
        <el-tooltip content="下划线" placement="top">
          <el-button
            :type="isFormatActive('underline') ? 'primary' : 'default'"
            @click="execCommand('underline')"
          >
            <el-icon><Grid /></el-icon>
          </el-button>
        </el-tooltip>
        <el-tooltip content="删除线" placement="top">
          <el-button
            :type="isFormatActive('strikeThrough') ? 'primary' : 'default'"
            @click="execCommand('strikeThrough')"
          >
            <el-icon><Grid /></el-icon>
          </el-button>
        </el-tooltip>
      </el-button-group>

      <el-divider direction="vertical" />

      <!-- 字体大小 -->
      <el-select
        v-model="fontSize"
        :placeholder="'字号'"
        size="small"
        style="width: 100px"
        @change="handleFontSizeChange"
      >
        <el-option label="12px" value="1" />
        <el-option label="14px" value="2" />
        <el-option label="16px" value="3" />
        <el-option label="18px" value="4" />
        <el-option label="24px" value="5" />
        <el-option label="32px" value="6" />
        <el-option label="48px" value="7" />
      </el-select>

      <!-- 字体颜色 -->
      <el-color-picker
        v-model="foreColor"
        :show-alpha="false"
        size="small"
        @change="handleForeColorChange"
      />

      <!-- 背景颜色 -->
      <el-color-picker
        v-model="backColor"
        :show-alpha="false"
        size="small"
        @change="handleBackColorChange"
      />

      <el-divider direction="vertical" />

      <!-- 对齐方式 -->
      <el-button-group>
        <el-tooltip content="左对齐" placement="top">
          <el-button
            :type="isFormatActive('justifyLeft') ? 'primary' : 'default'"
            @click="execCommand('justifyLeft')"
          >
            <el-icon><ArrowLeft /></el-icon>
          </el-button>
        </el-tooltip>
        <el-tooltip content="居中" placement="top">
          <el-button
            :type="isFormatActive('justifyCenter') ? 'primary' : 'default'"
            @click="execCommand('justifyCenter')"
          >
            <el-icon><Grid /></el-icon>
          </el-button>
        </el-tooltip>
        <el-tooltip content="右对齐" placement="top">
          <el-button
            :type="isFormatActive('justifyRight') ? 'primary' : 'default'"
            @click="execCommand('justifyRight')"
          >
            <el-icon><ArrowRight /></el-icon>
          </el-button>
        </el-tooltip>
      </el-button-group>

      <el-divider direction="vertical" />

      <!-- 列表 -->
      <el-button-group>
        <el-tooltip content="无序列表" placement="top">
          <el-button
            :type="isFormatActive('insertUnorderedList') ? 'primary' : 'default'"
            @click="execCommand('insertUnorderedList')"
          >
            <el-icon><List /></el-icon>
          </el-button>
        </el-tooltip>
        <el-tooltip content="有序列表" placement="top">
          <el-button
            :type="isFormatActive('insertOrderedList') ? 'primary' : 'default'"
            @click="execCommand('insertOrderedList')"
          >
            <el-icon><List /></el-icon>
          </el-button>
        </el-tooltip>
      </el-button-group>

      <el-divider direction="vertical" />

      <!-- 插入功能 -->
      <el-button-group>
        <el-tooltip content="插入链接" placement="top">
          <el-button @click="showLinkDialog = true">
            <el-icon><Link /></el-icon>
          </el-button>
        </el-tooltip>
        <el-tooltip content="插入表格" placement="top">
          <el-button @click="showTableDialog = true">
            <el-icon><Grid /></el-icon>
          </el-button>
        </el-tooltip>
        <el-tooltip content="插入图片" placement="top">
          <el-button @click="showImageDialog = true">
            <el-icon><Picture /></el-icon>
          </el-button>
        </el-tooltip>
        <el-tooltip content="插入文件" placement="top">
          <el-button @click="showFileDialog = true">
            <el-icon><Document /></el-icon>
          </el-button>
        </el-tooltip>
      </el-button-group>

      <el-divider direction="vertical" />

      <!-- 变量选择 -->
      <el-tooltip content="插入变量" placement="top">
        <el-button @click="showVariableDialog = true">
          <el-icon><DataAnalysis /></el-icon>
        </el-button>
      </el-tooltip>

      <el-divider direction="vertical" />

      <!-- 其他操作 -->
      <el-button-group>
        <el-tooltip content="撤销" placement="top">
          <el-button @click="execCommand('undo')">
            <el-icon><ArrowLeft /></el-icon>
          </el-button>
        </el-tooltip>
        <el-tooltip content="重做" placement="top">
          <el-button @click="execCommand('redo')">
            <el-icon><ArrowRight /></el-icon>
          </el-button>
        </el-tooltip>
        <el-tooltip content="清除格式" placement="top">
          <el-button @click="execCommand('removeFormat')">
            <el-icon><Refresh /></el-icon>
          </el-button>
        </el-tooltip>
      </el-button-group>

      <!-- 自定义工具栏插槽 -->
      <slot name="toolbar"></slot>
    </div>

    <!-- 编辑器区域 -->
    <div
      ref="editorRef"
      class="editor-content"
      :class="{ 'editor-disabled': disabled }"
      :style="{ height: height, minHeight: minHeight }"
      :contenteditable="!disabled"
      @input="handleInput"
      @blur="handleBlur"
      @focus="handleFocus"
      @paste="handlePaste"
      @dragover.prevent
      @drop.prevent="handleDrop"
    ></div>

    <!-- 底部信息栏 -->
    <div v-if="showFooter" class="editor-footer">
      <div class="footer-left">
        <slot name="footer-left"></slot>
      </div>
      <div class="footer-right">
        <!-- 字符数统计 -->
        <span v-if="maxLength" class="char-count">
          {{ currentLength }} / {{ maxLength }}
        </span>
        <!-- 自动保存提示 -->
        <span v-if="autoSave && lastSavedTime" class="save-time">
          上次保存：{{ formatTime(lastSavedTime) }}
        </span>
      </div>
    </div>

    <!-- 插入链接对话框 -->
    <el-dialog
      v-model="showLinkDialog"
      title="插入链接"
      width="500px"
      :close-on-click-modal="false"
    >
      <el-form :model="linkForm" label-width="80px">
        <el-form-item label="链接地址">
          <el-input
            v-model="linkForm.url"
            placeholder="请输入链接地址，如：https://www.example.com"
          />
        </el-form-item>
        <el-form-item label="链接文字">
          <el-input v-model="linkForm.text" placeholder="请输入链接文字" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showLinkDialog = false">取消</el-button>
        <el-button type="primary" @click="insertLink">确定</el-button>
      </template>
    </el-dialog>

    <!-- 插入表格对话框 -->
    <el-dialog
      v-model="showTableDialog"
      title="插入表格"
      width="400px"
      :close-on-click-modal="false"
    >
      <el-form :model="tableForm" label-width="80px">
        <el-form-item label="行数">
          <el-input-number v-model="tableForm.rows" :min="1" :max="20" />
        </el-form-item>
        <el-form-item label="列数">
          <el-input-number v-model="tableForm.cols" :min="1" :max="10" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showTableDialog = false">取消</el-button>
        <el-button type="primary" @click="insertTable">确定</el-button>
      </template>
    </el-dialog>

    <!-- 插入图片对话框 -->
    <el-dialog
      v-model="showImageDialog"
      title="插入图片"
      width="600px"
      :close-on-click-modal="false"
    >
      <el-tabs v-model="imageTab">
        <el-tab-pane label="本地上传" name="upload">
          <el-upload
            :action="uploadAction"
            :headers="uploadHeaders"
            :data="uploadData"
            :file-list="imageFileList"
            :limit="1"
            accept="image/*"
            list-type="picture-card"
            :on-success="handleImageUploadSuccess"
            :on-remove="handleImageRemove"
            :before-upload="handleBeforeImageUpload"
          >
            上传
          </el-upload>
        </el-tab-pane>
        <el-tab-pane label="网络图片" name="url">
          <el-input
            v-model="imageUrl"
            placeholder="请输入图片地址"
            clearable
          />
          <div v-if="imageUrl" class="image-preview">
            <img :src="imageUrl" alt="预览" />
          </div>
        </el-tab-pane>
      </el-tabs>
      <template #footer>
        <el-button @click="showImageDialog = false">取消</el-button>
        <el-button type="primary" @click="insertImage">确定</el-button>
      </template>
    </el-dialog>

    <!-- 插入变量对话框 -->
    <el-dialog
      v-model="showVariableDialog"
      title="插入变量"
      width="600px"
      :close-on-click-modal="false"
    >
      <el-input
        v-model="variableSearch"
        placeholder="搜索变量"
        clearable
        style="margin-bottom: 16px"
      >
        <template #prefix>
          <el-icon><Search /></el-icon>
        </template>
      </el-input>
      <el-table
        :data="filteredVariables"
        border
        max-height="400"
        @row-click="handleVariableSelect"
      >
        <el-table-column prop="variableLabel" label="变量名称" min-width="150" />
        <el-table-column prop="variableName" label="变量编码" width="150" />
        <el-table-column prop="variableType" label="变量类型" width="100">
          <template #default="{ row }">
            <el-tag size="small" :type="getVariableTypeColor(row.variableType)">
              {{ getVariableTypeText(row.variableType) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="required" label="必填" width="80">
          <template #default="{ row }">
            <el-tag size="small" :type="row.required ? 'danger' : 'info'">
              {{ row.required ? '是' : '否' }}
            </el-tag>
          </template>
        </el-table-column>
      </el-table>
      <template #footer>
        <el-button @click="showVariableDialog = false">取消</el-button>
      </template>
    </el-dialog>

    <!-- 插入文件对话框 -->
    <el-dialog
      v-model="showFileDialog"
      title="插入文件"
      width="600px"
      :close-on-click-modal="false"
    >
      <el-tabs v-model="fileTab">
        <el-tab-pane label="本地上传" name="upload">
          <el-upload
            :action="uploadAction"
            :headers="uploadHeaders"
            :data="uploadData"
            :file-list="fileFileList"
            :limit="1"
            accept=".doc,.docx,.xls,.xlsx,.pdf,.mp4,.webm,.mov,.jpg,.jpeg,.png,.gif,.webp"
            list-type="text"
            :on-success="handleFileUploadSuccess"
            :on-remove="handleFileRemove"
            :before-upload="handleBeforeFileUpload"
            :on-error="handleFileUploadError"
          >
            <el-button type="primary" :loading="isFileUploading">
              <el-icon v-if="isFileUploading"><Loading /></el-icon>
              {{ isFileUploading ? '上传中...' : '点击上传' }}
            </el-button>
            <template #tip>
              <div class="el-upload__tip">
                支持上传图片、Word、Excel、PDF、视频等格式文件，单个文件大小不超过10MB
              </div>
            </template>
          </el-upload>
        </el-tab-pane>
        <el-tab-pane label="网络文件" name="url">
          <el-input
            v-model="fileUrl"
            placeholder="请输入文件地址"
            clearable
          />
        </el-tab-pane>
      </el-tabs>
      <template #footer>
        <el-button @click="showFileDialog = false">取消</el-button>
        <el-button type="primary" @click="insertFile">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue'
import { ElMessage } from 'element-plus'
import { Loading, 
  Search, List, Link, Grid, Picture, Document, 
  DataAnalysis, ArrowLeft, ArrowRight, Refresh 
} from '@element-plus/icons-vue'

// Props定义
interface Props {
  /** 编辑器内容 */
  modelValue: string
  /** 编辑器高度 */
  height?: string
  /** 编辑器最小高度 */
  minHeight?: string
  /** 是否禁用 */
  disabled?: boolean
  /** 是否显示工具栏 */
  showToolbar?: boolean
  /** 是否显示底部信息栏 */
  showFooter?: boolean
  /** 最大字符数 */
  maxLength?: number
  /** 占位符 */
  placeholder?: string
  /** 是否自动保存草稿 */
  autoSave?: boolean
  /** 自动保存间隔（毫秒） */
  autoSaveInterval?: number
  /** 草稿存储键 */
  draftStorageKey?: string
  /** 上传地址 */
  uploadAction?: string
  /** 上传请求头 */
  uploadHeaders?: Record<string, string>
  /** 上传额外参数 */
  uploadData?: Record<string, any>
  /** 可用变量列表 */
  variables?: any[]
}

const props = withDefaults(defineProps<Props>(), {
  height: '400px',
  minHeight: '200px',
  disabled: false,
  showToolbar: true,
  showFooter: true,
  placeholder: '请输入内容...',
  autoSave: false,
  autoSaveInterval: 30000,
  uploadAction: '/api/upload',
  uploadHeaders: () => ({}),
  uploadData: () => ({}),
  variables: () => ([])
})

// Emits定义
const emit = defineEmits<{
  'update:modelValue': [value: string]
  'change': [value: string]
  'blur': [value: string]
  'focus': [value: string]
  'paste': [event: ClipboardEvent]
  'save-draft': [draftData: DraftData]
  'restore-draft': [draftData: DraftData]
}>()

// 草稿数据接口
interface DraftData {
  content: string
  savedAt: string
  userId: string
}

// 响应式数据
const editorRef = ref<HTMLElement>()
const fontSize = ref('3')
const foreColor = ref('#000000')
const backColor = ref('#ffffff')
const showLinkDialog = ref(false)
const showTableDialog = ref(false)
const showImageDialog = ref(false)
const showFileDialog = ref(false)
const showVariableDialog = ref(false)
const imageTab = ref('upload')
const imageFileList = ref<any[]>([])
const imageUrl = ref('')
const fileTab = ref('upload')
const fileFileList = ref<any[]>([])
const fileUrl = ref('')
const currentLength = ref(0)
const lastSavedTime = ref<Date | null>(null)
const autoSaveTimer = ref<any>(null)
const isFocused = ref(false)
const variableSearch = ref('')
const isFileUploading = ref(false)

// 链接表单
const linkForm = ref({
  url: '',
  text: ''
})

// 表格表单
const tableForm = ref({
  rows: 3,
  cols: 3
})

// 过滤后的变量列表
const filteredVariables = computed(() => {
  if (!variableSearch.value) {
    return props.variables
  }
  const search = variableSearch.value.toLowerCase()
  return props.variables.filter((v: any) =>
    v.variableLabel?.toLowerCase().includes(search) ||
    v.variableName?.toLowerCase().includes(search)
  )
})

// 获取当前用户ID
const getCurrentUserId = () => {
  const userInfo = localStorage.getItem('userInfo')
  if (userInfo) {
    try {
      const user = JSON.parse(userInfo)
      return user.id || 'default'
    } catch {
      return 'default'
    }
  }
  return 'default'
}

// 获取存储键
const getStorageKey = () => {
  const userId = getCurrentUserId()
  const key = props.draftStorageKey || 'rich-text-editor'
  return `${key}-${userId}`
}

// 执行编辑器命令
const execCommand = (command: string, value?: string) => {
  if (props.disabled) return

  document.execCommand(command, false, value)
  editorRef.value?.focus()
  updateContent()
}

// 检查格式是否激活
const isFormatActive = (command: string) => {
  return document.queryCommandState(command)
}

// 处理字体大小变化
const handleFontSizeChange = (value: string) => {
  execCommand('fontSize', value)
}

// 处理字体颜色变化
const handleForeColorChange = (color: string) => {
  if (color) {
    execCommand('foreColor', color)
  }
}

// 处理背景颜色变化
const handleBackColorChange = (color: string) => {
  if (color) {
    execCommand('hiliteColor', color)
  }
}

// 插入链接
const insertLink = () => {
  if (!linkForm.value.url) {
    ElMessage.warning('请输入链接地址')
    return
  }

  const selection = window.getSelection()
  if (selection && selection.rangeCount > 0) {
    const range = selection.getRangeAt(0)
    const linkText = linkForm.value.text || range.toString() || linkForm.value.url

    const link = document.createElement('a')
    link.href = linkForm.value.url
    link.target = '_blank'
    link.textContent = linkText

    range.deleteContents()
    range.insertNode(link)

    showLinkDialog.value = false
    linkForm.value = { url: '', text: '' }
    updateContent()
  }
}

// 插入表格
const insertTable = () => {
  const { rows, cols } = tableForm.value
  let tableHtml = '<table style="border-collapse: collapse; width: 100%;">'

  for (let i = 0; i < rows; i++) {
    tableHtml += '<tr>'
    for (let j = 0; j < cols; j++) {
      tableHtml += '<td style="border: 1px solid #ddd; padding: 8px; min-width: 50px;">&nbsp;</td>'
    }
    tableHtml += '</tr>'
  }

  tableHtml += '</table><p><br></p>'

  execCommand('insertHTML', tableHtml)
  showTableDialog.value = false
}

// 上传前验证
const handleBeforeImageUpload = (file: any) => {
  const maxSize = 5 * 1024 * 1024 // 5MB
  if (file.size > maxSize) {
    ElMessage.error('图片大小不能超过5MB')
    return false
  }
  return true
}

// 图片上传成功
const handleImageUploadSuccess = (response: any, file: any, fileList: any[]) => {
  imageFileList.value = fileList
}

// 移除图片
const handleImageRemove = (file: any, fileList: any[]) => {
  imageFileList.value = fileList
}

// 插入图片
const insertImage = () => {
  let imgSrc = ''

  if (imageTab.value === 'upload') {
    if (imageFileList.value.length === 0) {
      ElMessage.warning('请先上传图片')
      return
    }
    imgSrc = imageFileList.value[0].response?.data?.url || imageFileList.value[0].url
  } else {
    if (!imageUrl.value) {
      ElMessage.warning('请输入图片地址')
      return
    }
    imgSrc = imageUrl.value
  }

  execCommand('insertImage', imgSrc)
  showImageDialog.value = false
  imageFileList.value = []
  imageUrl.value = ''
}

// 插入变量
const handleVariableSelect = (row: any) => {
  const variableText = `{{${row.variableName}}}`
  execCommand('insertText', variableText)
  showVariableDialog.value = false
  variableSearch.value = ''
}

// 文件上传前验证
const handleBeforeFileUpload = (file: any) => {
  const maxSize = 10 * 1024 * 1024 // 10MB
  if (file.size > maxSize) {
    ElMessage.error('文件大小不能超过10MB')
    return false
  }
  isFileUploading.value = true
  return true
}

// 文件上传成功
const handleFileUploadSuccess = (response: any, file: any, fileList: any[]) => {
  fileFileList.value = fileList
  isFileUploading.value = false
}

// 文件上传失败
const handleFileUploadError = () => {
  ElMessage.error('文件上传失败，请重试')
  isFileUploading.value = false
}

// 移除文件
const handleFileRemove = (file: any, fileList: any[]) => {
  fileFileList.value = fileList
  isFileUploading.value = false
}

// 获取文件图标
const getFileIcon = (fileName: string) => {
  const ext = fileName.toLowerCase().split('.').pop()
  switch (ext) {
    case 'doc':
    case 'docx':
      return '📄'
    case 'xls':
    case 'xlsx':
      return '📊'
    case 'pdf':
      return '📋'
    case 'mp4':
    case 'webm':
    case 'mov':
      return '🎬'
    case 'jpg':
    case 'jpeg':
    case 'png':
    case 'gif':
    case 'webp':
      return '🖼️'
    default:
      return '📎'
  }
}

// 插入文件
const insertFile = () => {
  let fileUrl = ''
  let fileName = ''

  if (fileTab.value === 'upload') {
    if (fileFileList.value.length === 0) {
      ElMessage.warning('请先上传文件')
      return
    }
    fileUrl = fileFileList.value[0].response?.data?.url || fileFileList.value[0].url
    fileName = fileFileList.value[0].name
  } else {
    if (!fileUrl.value) {
      ElMessage.warning('请输入文件地址')
      return
    }
    fileUrl = fileUrl.value
    fileName = fileUrl.split('/').pop() || '文件'
  }

  const selection = window.getSelection()
  if (selection && selection.rangeCount > 0) {
    const range = selection.getRangeAt(0)
    
    const link = document.createElement('a')
    link.href = fileUrl
    link.target = '_blank'
    link.style.textDecoration = 'none'
    link.style.color = '#409eff'
    link.style.display = 'inline-flex'
    link.style.alignItems = 'center'
    link.style.gap = '4px'
    
    const iconSpan = document.createElement('span')
    iconSpan.textContent = getFileIcon(fileName)
    iconSpan.style.fontSize = '16px'
    
    const textSpan = document.createElement('span')
    textSpan.textContent = fileName
    
    link.appendChild(iconSpan)
    link.appendChild(textSpan)

    range.deleteContents()
    range.insertNode(link)

    showFileDialog.value = false
    fileFileList.value = []
    fileUrl.value = ''
    updateContent()
  }
}

// 获取变量类型颜色
const getVariableTypeColor = (type: string) => {
  const colorMap: Record<string, string> = {
    text: 'primary',
    date: 'success',
    number: 'warning',
    image: 'danger'
  }
  return colorMap[type] || 'info'
}

// 获取变量类型文本
const getVariableTypeText = (type: string) => {
  const textMap: Record<string, string> = {
    text: '文本',
    date: '日期',
    number: '数字',
    image: '图片'
  }
  return textMap[type] || '其他'
}

// 处理输入
const handleInput = () => {
  updateContent()
}

// 更新内容
const updateContent = () => {
  if (!editorRef.value) return

  const content = editorRef.value.innerHTML
  currentLength.value = content.length

  // 检查字符数限制
  if (props.maxLength && currentLength.value > props.maxLength) {
    ElMessage.warning(`内容长度不能超过${props.maxLength}个字符`)
    return
  }

  emit('update:modelValue', content)
  emit('change', content)
}

// 处理失焦
const handleBlur = () => {
  isFocused.value = false
  const content = editorRef.value?.innerHTML || ''
  emit('blur', content)
}

// 处理聚焦
const handleFocus = () => {
  isFocused.value = true
  const content = editorRef.value?.innerHTML || ''
  emit('focus', content)
}

// 处理粘贴
const handlePaste = (event: ClipboardEvent) => {
  emit('paste', event)

  // 阻止默认粘贴行为
  event.preventDefault()

  // 获取纯文本
  const text = event.clipboardData?.getData('text/plain') || ''
  document.execCommand('insertText', false, text)
}

// 处理拖放
const handleDrop = (event: DragEvent) => {
  const files = event.dataTransfer?.files
  if (files && files.length > 0) {
    const file = files[0]
    if (file.type.startsWith('image/')) {
      // 处理图片拖放
      const reader = new FileReader()
      reader.onload = (e) => {
        const imgSrc = e.target?.result as string
        execCommand('insertImage', imgSrc)
      }
      reader.readAsDataURL(file)
    }
  }
}

// 格式化时间
const formatTime = (date: Date) => {
  const now = new Date()
  const diff = now.getTime() - date.getTime()

  if (diff < 60000) {
    return '刚刚'
  } else if (diff < 3600000) {
    return `${Math.floor(diff / 60000)}分钟前`
  } else if (diff < 86400000) {
    return `${Math.floor(diff / 3600000)}小时前`
  } else {
    return date.toLocaleString('zh-CN')
  }
}

// 保存草稿
const saveDraft = () => {
  if (!editorRef.value) return

  const draftData: DraftData = {
    content: editorRef.value.innerHTML,
    savedAt: new Date().toISOString(),
    userId: getCurrentUserId()
  }

  localStorage.setItem(getStorageKey(), JSON.stringify(draftData))
  lastSavedTime.value = new Date()
  emit('save-draft', draftData)
}

// 恢复草稿
const restoreDraft = () => {
  const draftStr = localStorage.getItem(getStorageKey())
  if (draftStr && editorRef.value) {
    try {
      const draftData: DraftData = JSON.parse(draftStr)
      editorRef.value.innerHTML = draftData.content
      updateContent()
      emit('restore-draft', draftData)
      ElMessage.success('草稿恢复成功')
      return true
    } catch (error) {
      ElMessage.error('草稿恢复失败')
      return false
    }
  }
  return false
}

// 清除草稿
const clearDraft = () => {
  localStorage.removeItem(getStorageKey())
  lastSavedTime.value = null
}

// 启动自动保存
const startAutoSave = () => {
  if (!props.autoSave) return

  autoSaveTimer.value = setInterval(() => {
    saveDraft()
  }, props.autoSaveInterval)
}

// 停止自动保存
const stopAutoSave = () => {
  if (autoSaveTimer.value) {
    clearInterval(autoSaveTimer.value)
    autoSaveTimer.value = null
  }
}

// 设置编辑器内容
const setContent = (content: string) => {
  if (editorRef.value) {
    editorRef.value.innerHTML = content
    updateContent()
  }
}

// 获取编辑器内容
const getContent = () => {
  return editorRef.value?.innerHTML || ''
}

// 获取纯文本内容
const getTextContent = () => {
  return editorRef.value?.innerText || ''
}

// 清空编辑器
const clearContent = () => {
  if (editorRef.value) {
    editorRef.value.innerHTML = ''
    updateContent()
  }
}

// 监听外部内容变化
watch(
  () => props.modelValue,
  (newVal) => {
    if (editorRef.value && editorRef.value.innerHTML !== newVal) {
      editorRef.value.innerHTML = newVal
      currentLength.value = newVal.length
    }
  }
)

// 暴露方法
defineExpose({
  setContent,
  getContent,
  getTextContent,
  clearContent,
  saveDraft,
  restoreDraft,
  clearDraft,
  execCommand,
  focus: () => editorRef.value?.focus()
})

// 生命周期
onMounted(() => {
  if (editorRef.value) {
    editorRef.value.innerHTML = props.modelValue
    currentLength.value = props.modelValue.length
  }
  startAutoSave()
})

onUnmounted(() => {
  stopAutoSave()
})
</script>

<style scoped>
.rich-text-editor-container {
  width: 100%;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  overflow: hidden;
}

/* 工具栏 */
.editor-toolbar {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background-color: #f5f7fa;
  border-bottom: 1px solid #dcdfe6;
  flex-wrap: wrap;
}

.editor-toolbar :deep(.el-button-group) {
  display: flex;
}

.editor-toolbar :deep(.el-divider--vertical) {
  height: 24px;
  margin: 0 8px;
}

/* 编辑器内容 */
.editor-content {
  padding: 16px;
  overflow-y: auto;
  background-color: #fff;
  outline: none;
  word-wrap: break-word;
}

.editor-content:focus {
  background-color: #fafafa;
}

.editor-disabled {
  background-color: #f5f7fa;
  cursor: not-allowed;
}

/* 编辑器内部样式 */
.editor-content :deep(table) {
  border-collapse: collapse;
  width: 100%;
  margin: 8px 0;
}

.editor-content :deep(table td),
.editor-content :deep(table th) {
  border: 1px solid #ddd;
  padding: 8px;
  min-width: 50px;
}

.editor-content :deep(img) {
  max-width: 100%;
  height: auto;
}

.editor-content :deep(a) {
  color: #409eff;
  text-decoration: underline;
}

.editor-content :deep(ul),
.editor-content :deep(ol) {
  padding-left: 20px;
  margin: 8px 0;
}

.editor-content :deep(blockquote) {
  border-left: 4px solid #dcdfe6;
  padding-left: 12px;
  margin: 8px 0;
  color: #606266;
}

/* 底部信息栏 */
.editor-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  background-color: #f5f7fa;
  border-top: 1px solid #dcdfe6;
  font-size: 12px;
  color: #909399;
}

.footer-left,
.footer-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.char-count {
  color: #606266;
}

.char-count.warning {
  color: #e6a23c;
}

.char-count.danger {
  color: #f56c6c;
}

.save-time {
  color: #909399;
}

/* 图片预览 */
.image-preview {
  margin-top: 12px;
  text-align: center;
}

.image-preview img {
  max-width: 100%;
  max-height: 300px;
  border-radius: 4px;
}

/* 响应式设计 */
@media screen and (max-width: 768px) {
  .editor-toolbar {
    gap: 4px;
    padding: 8px;
  }

  .editor-toolbar :deep(.el-divider--vertical) {
    margin: 0 4px;
  }

  .editor-content {
    padding: 12px;
  }

  .editor-footer {
    flex-direction: column;
    gap: 8px;
    align-items: flex-start;
  }
}
</style>
