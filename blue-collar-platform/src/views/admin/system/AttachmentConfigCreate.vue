<template>
  <div class="form-container">
    <div class="form-content">
      <el-card>
        <el-form
          ref="formRef"
          :model="formData"
          :rules="formRules"
          label-width="120px"
          label-position="right"
        >
          <el-form-item label="关联菜单" prop="menuId">
            <el-tree-select
              v-model="formData.menuId"
              :data="menuTree"
              :props="treeProps"
              placeholder="请选择关联菜单"
              check-strictly
              clearable
              style="width: 100%"
            />
          </el-form-item>

          <el-form-item label="附件名称" prop="attachmentName">
            <el-input
              v-model="formData.attachmentName"
              placeholder="请输入附件名称"
              maxlength="50"
              show-word-limit
            />
          </el-form-item>

          <el-form-item label="附件类型" prop="attachmentTypes">
            <el-checkbox-group v-model="formData.attachmentTypes">
              <el-checkbox
                v-for="(config, type) in AttachmentTypeConfig"
                :key="type"
                :label="type"
              >
                <el-icon><component :is="config.icon" /></el-icon>
                {{ config.label }}
              </el-checkbox>
            </el-checkbox-group>
          </el-form-item>

          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="大小限制(MB)" prop="maxSize">
                <el-input-number
                  v-model="formData.maxSize"
                  :min="0"
                  :max="1024"
                  :step="1"
                  placeholder="请输入大小限制"
                  style="width: 100%"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="排序" prop="sort">
                <el-input-number
                  v-model="formData.sort"
                  :min="0"
                  :max="9999"
                  :step="1"
                  placeholder="请输入排序"
                  style="width: 100%"
                />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="是否必传" prop="required">
                <el-switch
                  v-model="formData.required"
                  active-text="是"
                  inactive-text="否"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="状态" prop="status">
                <el-switch
                  v-model="formData.status"
                  active-text="启用"
                  inactive-text="禁用"
                  active-value="enabled"
                  inactive-value="disabled"
                />
              </el-form-item>
            </el-col>
          </el-row>

          <el-form-item label="允许类型" prop="allowedTypes">
            <el-checkbox-group v-model="formData.allowedTypes">
              <el-checkbox
                v-for="ext in allAllowedExtensions"
                :key="ext"
                :label="ext"
              >
                {{ ext.toUpperCase() }}
              </el-checkbox>
            </el-checkbox-group>
          </el-form-item>

          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="批量上传" prop="allowBatchUpload">
                <el-switch
                  v-model="formData.allowBatchUpload"
                  active-text="支持"
                  inactive-text="不支持"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="文件预览" prop="allowPreview">
                <el-switch
                  v-model="formData.allowPreview"
                  active-text="支持"
                  inactive-text="不支持"
                />
              </el-form-item>
            </el-col>
          </el-row>

          <el-form-item label="附件模板" prop="templateFileId">
            <el-upload
              class="upload-demo"
              :action="''"
              :auto-upload="false"
              :on-change="handleTemplateUpload"
              :limit="1"
              :file-list="templateFileList"
              accept=".pdf,.doc,.docx"
            >
              <el-button type="primary">
                <el-icon><Upload /></el-icon>
                上传模板文件
              </el-button>
              <template #tip>
                <div class="el-upload__tip">
                  支持上传 PDF、Word 格式文件，单个文件不超过 20MB
                </div>
              </template>
            </el-upload>
          </el-form-item>

          <el-form-item label="附件说明" prop="description">
            <el-input
              v-model="formData.description"
              type="textarea"
              :rows="3"
              placeholder="请输入附件说明"
              maxlength="200"
              show-word-limit
            />
          </el-form-item>
        </el-form>
      </el-card>
    </div>

    <div class="form-footer">
      <el-button @click="goBack">
        <el-icon><ArrowLeft /></el-icon>
        返回
      </el-button>
      <el-button type="primary" :loading="submitting" @click="handleSubmit">
        <el-icon><Check /></el-icon>
        保存
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { ArrowLeft, Check, Document, Upload } from '@element-plus/icons-vue'
import { attachmentConfigApi } from '@/api/attachmentConfigApi'
import { getMenuTree } from '@/api/system/menuApi'
import { AttachmentType, AttachmentTypeConfig, type AttachmentConfigFormData } from '@/types/attachment'

const route = useRoute()
const router = useRouter()

const formRef = ref()
const submitting = ref(false)
const menuTree = ref<any[]>([])
const templateFileList = ref<any[]>([])

const formData = reactive<AttachmentConfigFormData>({
  menuId: String(route.query.menuId || ''),
  attachmentName: '',
  attachmentTypes: [AttachmentType.IMAGE],
  maxSize: 10,
  required: false,
  allowedTypes: ['jpg', 'jpeg', 'png'],
  allowBatchUpload: true,
  allowPreview: true,
  sort: 0,
  status: 'enabled',
  templateFileId: '',
  templateFileName: '',
  templateFileUrl: '',
  description: ''
})

const formRules = {
  menuId: [
    { required: true, message: '请选择关联菜单', trigger: 'change' }
  ],
  attachmentName: [
    { required: true, message: '请输入附件名称', trigger: 'blur' },
    { min: 2, max: 50, message: '附件名称长度在2-50个字符', trigger: 'blur' }
  ],
  attachmentTypes: [
    { required: true, message: '请选择附件类型', trigger: 'change' }
  ],
  maxSize: [
    { required: true, message: '请输入大小限制', trigger: 'blur' },
    { type: 'number', min: 0, max: 1024, message: '大小限制在0-1024MB之间', trigger: 'blur' }
  ],
  allowedTypes: [
    { required: true, message: '请选择允许类型', trigger: 'change' }
  ]
}

const treeProps = {
  children: 'children',
  label: 'menuName',
  value: 'id'
}

const allAllowedExtensions = computed(() => {
  if (!formData.attachmentTypes || formData.attachmentTypes.length === 0) {
    return []
  }
  const extensions = new Set<string>()
  formData.attachmentTypes.forEach(type => {
    const config = AttachmentTypeConfig[type]
    if (config && config.allowedExtensions) {
      config.allowedExtensions.forEach(ext => extensions.add(ext))
    }
  })
  return Array.from(extensions)
})

const loadMenuTree = async () => {
  try {
    const response = await getMenuTree({ menuStatus: 'enabled' })
    if (response.data) {
      // 确保所有菜单的 id 都是字符串类型
      const processMenu = (menus: any[]): any[] => {
        return menus.map(menu => ({
          ...menu,
          id: String(menu.id),
          children: menu.children ? processMenu(menu.children) : undefined
        }))
      }
      menuTree.value = processMenu(response.data)
    }
  } catch (error) {
    ElMessage.error('加载菜单失败')
  }
}

const handleTemplateUpload = (file: any) => {
  templateFileList.value = [file]
  formData.templateFileId = file.uid
  formData.templateFileName = file.name
  formData.templateFileUrl = URL.createObjectURL(file.raw)
}

const handleSubmit = async () => {
  if (!formRef.value) return

  await formRef.value.validate(async (valid: boolean) => {
    if (valid) {
      submitting.value = true
      try {
        const menu = findMenuById(menuTree.value, formData.menuId)
        if (menu) {
          formData.menuName = menu.menuName
          formData.menuPath = menu.path || ''
        }
        
        await attachmentConfigApi.createAttachmentConfig(formData)
        ElMessage.success('创建成功')
        goBack()
      } catch (error) {
        ElMessage.error('创建失败')
      } finally {
        submitting.value = false
      }
    }
  })
}

const findMenuById = (menus: any[], id: string): any => {
  for (const menu of menus) {
    if (String(menu.id) === String(id)) {
      return menu
    }
    if (menu.children) {
      const found = findMenuById(menu.children, id)
      if (found) return found
    }
  }
  return null
}

const goBack = () => {
  router.back()
}

onMounted(() => {
  loadMenuTree()
})
</script>

<style scoped>
.form-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #f5f7fa;
}

.form-content {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  padding-bottom: 80px;
}

.form-footer {
  position: fixed;
  bottom: 0;
  left: 200px;
  right: 0;
  display: flex;
  justify-content: center;
  gap: 12px;
  padding: 16px;
  background-color: #f5f7fa;
  border-top: 1px solid #e4e7ed;
  z-index: 100;
}

:deep(.el-checkbox-group) {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

:deep(.el-checkbox) {
  margin-right: 0;
}

:deep(.el-upload__tip) {
  margin-top: 8px;
  font-size: 12px;
  color: #909399;
}
</style>
