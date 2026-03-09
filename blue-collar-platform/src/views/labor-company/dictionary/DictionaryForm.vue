<template>
  <div class="dictionary-form-container">
    <div class="form-content">
      <el-card>
        <template #header>
          <div class="card-header">
            <span class="card-title">{{ title }}</span>
          </div>
        </template>

        <el-form
          ref="formRef"
          :model="formData"
          :rules="formRules"
          :disabled="isView"
          label-width="120px"
          label-position="right"
        >
          <el-form-item label="字典名称" prop="name">
            <el-input
              v-model="formData.name"
              placeholder="请输入字典名称"
              maxlength="50"
              show-word-limit
            />
          </el-form-item>
          
          <el-form-item label="字典类型" prop="type">
            <el-select
              v-model="formData.type"
              placeholder="请选择字典类型"
              style="width: 100%"
            >
              <el-option label="业务字典" value="business" />
              <el-option label="自定义字典" value="custom" />
            </el-select>
          </el-form-item>
          
          <el-form-item label="字典编码" prop="code">
            <el-input
              v-model="formData.code"
              placeholder="请输入字典编码（英文）"
              maxlength="50"
              show-word-limit
            />
          </el-form-item>
          
          <el-form-item label="字典说明" prop="description">
            <el-input
              v-model="formData.description"
              type="textarea"
              :rows="3"
              placeholder="请输入字典说明"
              maxlength="200"
              show-word-limit
            />
          </el-form-item>
          
          <el-form-item label="字典值">
            <div class="dict-values-section">
              <el-table
                :data="formData.values"
                border
                style="width: 100%"
              >
                <el-table-column type="index" label="序号" width="60" />
                <el-table-column prop="value" label="字典值" width="150">
                  <template #default="scope">
                    <el-input
                      v-model="scope.row.value"
                      size="small"
                      placeholder="字典值"
                      :disabled="isView"
                    />
                  </template>
                </el-table-column>
                <el-table-column prop="label" label="显示标签" width="150">
                  <template #default="scope">
                    <el-input
                      v-model="scope.row.label"
                      size="small"
                      placeholder="显示标签"
                      :disabled="isView"
                    />
                  </template>
                </el-table-column>
                <el-table-column prop="sort" label="排序" width="100">
                  <template #default="scope">
                    <el-input-number
                      v-model="scope.row.sort"
                      size="small"
                      :min="0"
                      controls-position="right"
                      style="width: 100px"
                      :disabled="isView"
                    />
                  </template>
                </el-table-column>
                <el-table-column prop="status" label="状态" width="100">
                  <template #default="scope">
                    <el-select
                      v-model="scope.row.status"
                      size="small"
                      style="width: 100%"
                      :disabled="isView"
                    >
                      <el-option label="启用" value="enabled" />
                      <el-option label="禁用" value="disabled" />
                    </el-select>
                  </template>
                </el-table-column>
                <el-table-column prop="remark" label="备注" min-width="150">
                  <template #default="scope">
                    <el-input
                      v-model="scope.row.remark"
                      size="small"
                      placeholder="备注"
                      :disabled="isView"
                    />
                  </template>
                </el-table-column>
                <el-table-column label="操作" width="120" fixed="right" v-if="!isView">
                  <template #default="scope">
                    <el-button
                      size="small"
                      type="danger"
                      link
                      @click="removeDictValue(scope.$index)"
                    >
                      删除
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <div class="add-value-button" v-if="!isView">
              <el-button
                type="primary"
                size="small"
                @click="addDictValue"
              >
                新增字典值
              </el-button>
            </div>
          </el-form-item>
        </el-form>
      </el-card>
    </div>

    <div class="form-footer">
      <el-button @click="handleCancel">
        <el-icon><ArrowLeft /></el-icon>
        返回
      </el-button>
      <el-button v-if="!isView" type="primary" @click="handleSubmit" :loading="submitting">
        <el-icon><Check /></el-icon>
        {{ isEdit ? '更新' : '保存' }}
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage, type FormInstance } from 'element-plus'
import { ArrowLeft, Check } from '@element-plus/icons-vue'
import { useRouter, useRoute } from 'vue-router'
import DictionaryService from '@/services/dictionaryService'
import type {
  Dictionary,
  DictionaryFormData
} from '@/types/dictionary'

const router = useRouter()
const route = useRoute()

const formRef = ref<FormInstance>()
const submitting = ref(false)

const isEdit = computed(() => !!route.params.id)
const isView = computed(() => route.query.mode === 'view')

const title = computed(() => {
  if (isView.value) return '查看字典'
  if (isEdit.value) return '编辑字典'
  return '新增字典'
})

const formData = reactive<DictionaryFormData>({
  id: '',
  name: '',
  type: 'business',
  code: '',
  description: '',
  values: []
})

const formRules = {
  name: [
    { required: true, message: '请输入字典名称', trigger: 'blur' }
  ],
  type: [
    { required: true, message: '请选择字典类型', trigger: 'change' }
  ],
  code: [
    { required: true, message: '请输入字典编码', trigger: 'blur' },
    { pattern: /^[a-zA-Z0-9_]+$/, message: '字典编码只能包含字母、数字和下划线', trigger: 'blur' }
  ]
}

const addDictValue = () => {
  const maxSort = Math.max(...formData.values.map(v => v.sort || 0), 0)
  formData.values.push({
    id: '',
    value: '',
    label: '',
    sort: maxSort + 1,
    status: 'enabled',
    remark: ''
  })
}

const removeDictValue = (index: number) => {
  formData.values.splice(index, 1)
}

const handleSubmit = async () => {
  if (!formRef.value) return
  
  await formRef.value.validate(async (valid: boolean) => {
    if (valid) {
      submitting.value = true
      try {
        console.log('Submitting form data:', formData)
        if (isEdit.value) {
          await DictionaryService.updateDictionary(formData.id, formData)
          ElMessage.success('更新成功')
        } else {
          await DictionaryService.createDictionary(formData)
          ElMessage.success('创建成功')
        }
        router.push('/tenant/dictionary')
      } catch (error) {
        console.error('Error submitting form:', error)
        ElMessage.error(isEdit.value ? '更新失败' : '创建失败')
      } finally {
        submitting.value = false
      }
    }
  })
}

const handleCancel = () => {
  router.push('/tenant/dictionary')
}

const loadDictionaryData = async () => {
  if (isEdit.value || isView.value) {
    try {
      const id = route.params.id as string
      console.log('Loading dictionary data for id:', id)
      const dictionary = await DictionaryService.getDictionaryById(id)
      console.log('Received dictionary data:', dictionary)
      Object.assign(formData, {
        id: dictionary.id,
        name: dictionary.name,
        type: dictionary.type,
        code: dictionary.code,
        description: dictionary.description || '',
        values: (dictionary.values || []).map(value => ({
          id: value.id,
          value: value.value,
          label: value.label,
          sort: value.sort,
          status: value.status,
          remark: value.remark || ''
        }))
      })
      console.log('Form data after assignment:', formData)
    } catch (error) {
      console.error('Error loading dictionary data:', error)
      ElMessage.error('获取字典详情失败')
      router.push('/tenant/dictionary')
    }
  }
}

onMounted(() => {
  loadDictionaryData()
})
</script>

<style scoped>
.dictionary-form-container {
  padding: 20px;
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #f5f7fa;
}

.form-content {
  flex: 1;
  overflow-y: auto;
  padding-bottom: 80px; /* 为底部按钮栏留出空间 */
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.card-title {
  font-size: 18px;
  font-weight: 600;
  color: #303133;
}

.dict-values-section {
  margin-top: 16px;
  max-height: 300px;
  overflow-y: auto;
  border: 1px solid #ebeef5;
  border-radius: 4px;
  padding: 12px;
  background-color: #ffffff;
}

.dict-values-section :deep(.el-table) {
  margin-bottom: 0;
  border: none;
}

.add-value-button {
  margin-top: 16px;
  display: flex;
  justify-content: flex-start;
}

.form-footer {
  position: fixed;
  bottom: 0;
  left: var(--sidebar-width);
  right: 0;
  display: flex;
  justify-content: center;
  gap: 16px;
  padding: 16px;
  background-color: #f5f7fa;
  border-top: 1px solid #e4e7ed;
  z-index: 100;
  transition: left var(--transition-base);
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.05);
}

.form-footer .el-button {
  min-width: 100px;
}

:deep(.el-form-item) {
  margin-bottom: 20px;
}

:deep(.el-form-item__label) {
  font-weight: 500;
}

:deep(.el-input),
:deep(.el-select),
:deep(.el-textarea) {
  width: 100%;
  max-width: 500px;
}

:deep(.el-table__row) {
  height: 52px;
}

:deep(.el-table__cell) {
  padding: 12px 16px;
}

@media screen and (max-width: 768px) {
  .dictionary-form-container {
    padding: 16px;
  }
  
  .form-content {
    padding-bottom: 120px; /* 为垂直排列的按钮栏留出更多空间 */
  }
  
  .card-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
    margin-bottom: 16px;
  }
  
  .card-title {
    font-size: 16px;
  }
  
  .dict-values-section {
    max-height: 250px;
    padding: 8px;
  }
  
  .dict-values-section :deep(.el-table) {
    font-size: 11px;
  }
  
  .dict-values-section :deep(.el-input),
  .dict-values-section :deep(.el-select),
  .dict-values-section :deep(.el-input-number) {
    width: 100% !important;
  }
  
  :deep(.el-input),
  :deep(.el-select),
  :deep(.el-textarea) {
    max-width: 100%;
  }
  
  .add-value-button {
    margin-top: 12px;
  }
  
  .form-footer {
    left: 0;
    flex-direction: column;
    gap: 12px;
    padding: 16px;
  }
  
  .form-footer .el-button {
    width: 100%;
    min-width: unset;
  }
  
  :deep(.el-form-item) {
    margin-bottom: 16px;
  }
  
  :deep(.el-table__row) {
    height: 48px;
  }
  
  :deep(.el-table__cell) {
    padding: 8px 12px;
  }
}
</style>