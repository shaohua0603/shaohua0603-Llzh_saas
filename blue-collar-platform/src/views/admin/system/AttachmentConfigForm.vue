<template>
  <el-dialog
    v-model="visible"
    :title="formData.id ? '编辑附件配置' : '新增附件配置'"
    width="800px"
    :close-on-click-modal="false"
    @close="handleClose"
  >
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

      <el-form-item label="附件类型" prop="attachmentType">
        <el-select
          v-model="formData.attachmentType"
          placeholder="请选择附件类型"
          style="width: 100%"
          @change="handleAttachmentTypeChange"
        >
          <el-option
            v-for="(config, type) in AttachmentTypeConfig"
            :key="type"
            :label="config.label"
            :value="type"
          >
            <el-icon><component :is="config.icon" /></el-icon>
            {{ config.label }}
          </el-option>
        </el-select>
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
            v-for="ext in currentTypeConfig?.allowedExtensions || []"
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
        <el-select
          v-model="formData.templateFileId"
          placeholder="请选择附件模板(可选)"
          clearable
          filterable
          style="width: 100%"
        >
          <el-option
            v-for="template in templateList"
            :key="template.id"
            :label="template.name"
            :value="template.id"
          >
            <el-icon><Document /></el-icon>
            {{ template.name }}
          </el-option>
        </el-select>
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

    <template #footer>
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" :loading="submitting" @click="handleSubmit">
        保存
      </el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, watch, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { Document } from '@element-plus/icons-vue'
import { attachmentConfigApi } from '@/api/attachmentConfigApi'
import { AttachmentType, AttachmentTypeConfig, type AttachmentConfigFormData } from '@/types/attachment'

interface Props {
  visible: boolean
  formData: Partial<AttachmentConfigFormData>
  menuList: any[]
  templateList: any[]
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:visible': [visible: boolean]
  'submit': []
}>()

const formRef = ref()
const submitting = ref(false)

const formData = reactive<AttachmentConfigFormData>({
  menuId: '',
  attachmentName: '',
  attachmentType: AttachmentType.IMAGE,
  maxSize: 10,
  required: false,
  allowedTypes: ['jpg', 'jpeg', 'png'],
  allowBatchUpload: true,
  allowPreview: true,
  sort: 0,
  status: 'enabled'
})

const formRules = {
  menuId: [
    { required: true, message: '请选择关联菜单', trigger: 'change' }
  ],
  attachmentName: [
    { required: true, message: '请输入附件名称', trigger: 'blur' },
    { min: 2, max: 50, message: '附件名称长度在2-50个字符', trigger: 'blur' }
  ],
  attachmentType: [
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
  label: 'name',
  value: 'id'
}

const menuTree = computed(() => {
  return buildMenuTree(props.menuList)
})

const currentTypeConfig = computed(() => {
  return AttachmentTypeConfig[formData.attachmentType]
})

const buildMenuTree = (menuList: any[]) => {
  const tree: any[] = []
  const map = new Map()

  menuList.forEach(menu => {
    map.set(menu.id, { ...menu, children: [] })
  })

  menuList.forEach(menu => {
    const node = map.get(menu.id)
    if (menu.parentId && map.has(menu.parentId)) {
      map.get(menu.parentId).children.push(node)
    } else {
      tree.push(node)
    }
  })

  return tree
}

const handleAttachmentTypeChange = (type: AttachmentType) => {
  const config = AttachmentTypeConfig[type]
  if (config) {
    formData.maxSize = config.maxSize
    formData.allowedTypes = [...config.allowedExtensions]
    formData.allowBatchUpload = config.supportBatchUpload
    formData.allowPreview = config.supportPreview
  }
}

const handleSubmit = async () => {
  if (!formRef.value) return

  await formRef.value.validate(async (valid: boolean) => {
    if (valid) {
      submitting.value = true
      try {
        if (formData.id) {
          await attachmentConfigApi.updateAttachmentConfig(formData.id, formData)
          ElMessage.success('更新成功')
        } else {
          await attachmentConfigApi.createAttachmentConfig(formData)
          ElMessage.success('创建成功')
        }
        emit('submit')
        handleClose()
      } catch (error) {
        ElMessage.error('保存失败')
      } finally {
        submitting.value = false
      }
    }
  })
}

const handleClose = () => {
  formRef.value?.resetFields()
  emit('update:visible', false)
}

watch(
  () => props.visible,
  (visible) => {
    if (visible) {
      Object.assign(formData, {
        menuId: '',
        attachmentName: '',
        attachmentType: AttachmentType.IMAGE,
        maxSize: 10,
        required: false,
        allowedTypes: ['jpg', 'jpeg', 'png'],
        allowBatchUpload: true,
        allowPreview: true,
        sort: 0,
        status: 'enabled'
      })
      if (props.formData.id) {
        Object.assign(formData, props.formData)
      }
    }
  }
)
</script>

<style scoped>
:deep(.el-checkbox-group) {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

:deep(.el-checkbox) {
  margin-right: 0;
}
</style>
