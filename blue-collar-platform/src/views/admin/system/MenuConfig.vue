<template>
  <div class="menu-config-container">
    <el-card class="search-card">
      <el-form :model="queryParams" inline>
        <el-form-item label="菜单名称">
          <el-input
            v-model="queryParams.keyword"
            placeholder="请输入菜单名称"
            clearable
            @clear="handleSearch"
          />
        </el-form-item>
        <el-form-item label="菜单类型">
          <el-select
            v-model="queryParams.menuType"
            placeholder="请选择菜单类型"
            clearable
          >
            <el-option label="目录" :value="MenuType.DIRECTORY" />
            <el-option label="菜单" :value="MenuType.MENU" />
            <el-option label="按钮" :value="MenuType.BUTTON" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <div class="action-bar">
      <el-button type="primary" @click="handleCreate" v-permission="'MENU_CONFIG_CREATE'">
        <el-icon><Plus /></el-icon>
        新增
      </el-button>
      <el-button @click="handleExpandAll">
        <el-icon><DCaret /></el-icon>
        展开全部
      </el-button>
      <el-button @click="handleCollapseAll">
        <el-icon><CaretTop /></el-icon>
        折叠全部
      </el-button>
      <el-button @click="handleRefresh">
        <el-icon><Refresh /></el-icon>
        刷新
      </el-button>
    </div>

    <el-card>
      <el-table
        ref="tableRef"
        v-loading="loading"
        :data="menuList"
        row-key="id"
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
        :default-expand-all="expandAll"
      >
        <el-table-column prop="menuName" label="菜单名称" min-width="200" />
        <el-table-column prop="menuType" label="菜单类型" width="120">
          <template #default="{ row }">
            <el-tag :type="getMenuTypeTagType(row.menuType)">
              {{ getMenuTypeLabel(row.menuType) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="businessCode" label="业务代码" width="180" />
        <el-table-column prop="menuPath" label="菜单路径" width="200" />
        <el-table-column prop="sortOrder" label="排序序号" width="100" />
        <el-table-column prop="menuStatus" label="菜单状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.menuStatus === MenuStatus.ENABLED ? 'success' : 'info'">
              {{ row.menuStatus === MenuStatus.ENABLED ? '启用' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180" fixed="right">
          <template #default="{ row }">
            <el-button
              v-if="row.menuType !== MenuType.BUTTON"
              type="primary"
              link
              @click.stop="handleAddChild(row)"
              v-permission="'MENU_CONFIG_CREATE'"
            >
              添加子项
            </el-button>
            <el-button
              type="primary"
              link
              @click.stop="handleEdit(row)"
              v-permission="'MENU_CONFIG_UPDATE'"
            >
              编辑
            </el-button>
            <el-button
              type="danger"
              link
              @click.stop="handleDelete(row)"
              v-permission="'MENU_CONFIG_DELETE'"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

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
        <el-form-item label="上级菜单" prop="parentId">
          <el-tree-select
            v-model="formData.parentId"
            :data="menuTree"
            :props="treeProps"
            check-strictly
            :render-after-expand="false"
            placeholder="请选择上级菜单（顶级不选）"
            clearable
            style="width: 100%"
          />
        </el-form-item>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="菜单名称" prop="menuName">
              <el-input
                v-model="formData.menuName"
                placeholder="请输入菜单名称"
                maxlength="50"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="菜单类型" prop="menuType">
              <el-select
                v-model="formData.menuType"
                placeholder="请选择菜单类型"
                style="width: 100%"
                @change="handleMenuTypeChange"
              >
                <el-option label="目录" :value="MenuType.DIRECTORY" />
                <el-option label="菜单" :value="MenuType.MENU" />
                <el-option label="按钮" :value="MenuType.BUTTON" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="菜单路径" prop="menuPath">
              <el-input
                v-model="formData.menuPath"
                placeholder="请输入菜单路径"
                maxlength="200"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="菜单图标" prop="menuIcon">
              <el-select
                v-model="formData.menuIcon"
                placeholder="请选择菜单图标"
                filterable
                clearable
                style="width: 100%"
              >
                <el-option
                  v-for="icon in iconList"
                  :key="icon"
                  :label="icon"
                  :value="icon"
                >
                  <el-icon style="margin-right: 8px">
                    <component :is="icon" />
                  </el-icon>
                  <span>{{ icon }}</span>
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="业务代码" prop="businessCode">
              <el-input
                v-model="formData.businessCode"
                placeholder="请输入业务代码"
                maxlength="50"
                @blur="checkBusinessCodeUnique"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="排序序号" prop="sortOrder">
              <el-input-number
                v-model="formData.sortOrder"
                :min="0"
                :max="999"
                placeholder="请输入排序号"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="组件路径" prop="componentPath">
          <el-input
            v-model="formData.componentPath"
            placeholder="请输入组件路径（如：/views/admin/system/Department）"
            maxlength="200"
          />
        </el-form-item>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="是否显示" prop="visible">
              <el-switch
                v-model="formData.visible"
                :active-value="MenuVisible.TRUE"
                :inactive-value="MenuVisible.FALSE"
                active-text="显示"
                inactive-text="隐藏"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="状态" prop="menuStatus">
              <el-switch
                v-model="formData.menuStatus"
                :active-value="MenuStatus.ENABLED"
                :inactive-value="MenuStatus.DISABLED"
                active-text="启用"
                inactive-text="禁用"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="菜单描述" prop="menuDesc">
          <el-input
            v-model="formData.menuDesc"
            type="textarea"
            :rows="3"
            placeholder="请输入菜单描述"
            maxlength="500"
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
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, DCaret, CaretTop, Refresh } from '@element-plus/icons-vue'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import { getMenuList, deleteMenu } from '@/api/system/menuApi'
import type { Menu, MenuQueryParams, MenuForm } from '@/types/system/menuTypes'
import { MenuType, MenuStatus, MenuVisible } from '@/types/system/menuTypes'

const router = useRouter()
const tableRef = ref()
const loading = ref(false)
const menuList = ref<Menu[]>([])
const expandAll = ref(false)

const queryParams = reactive<MenuQueryParams>({
  page: 1,
  pageSize: 10,
  keyword: '',
  menuType: undefined
})

const dialogVisible = ref(false)
const dialogTitle = ref('')
const submitting = ref(false)
const formRef = ref()

const iconList = Object.keys(ElementPlusIconsVue).filter(key => {
  return typeof ElementPlusIconsVue[key] === 'object'
})

const treeProps = {
  value: 'id',
  label: 'menuName',
  children: 'children'
}

const menuTree = computed(() => {
  const buildTree = (list: Menu[]): any[] => {
    return list.map(item => ({
      id: item.id,
      menuName: item.menuName,
      children: item.children ? buildTree(item.children) : []
    }))
  }
  return buildTree(menuList.value)
})

const formData = reactive<MenuForm>({
  id: undefined,
  parentId: undefined,
  menuName: '',
  menuType: MenuType.MENU,
  menuIcon: '',
  businessCode: '',
  menuPath: '',
  componentPath: '',
  sortOrder: 0,
  menuStatus: MenuStatus.ENABLED,
  visible: MenuVisible.TRUE,
  menuDesc: ''
})

const formRules = {
  menuName: [
    { required: true, message: '请输入菜单名称', trigger: 'blur' },
    { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
  ],
  menuType: [
    { required: true, message: '请选择菜单类型', trigger: 'change' }
  ],
  businessCode: [
    { required: true, message: '请输入业务代码', trigger: 'blur' },
    { pattern: /^[A-Z_]+$/, message: '业务代码只能包含大写字母和下划线', trigger: 'blur' }
  ],
  sortOrder: [
    { required: true, message: '请输入排序序号', trigger: 'blur' },
    { type: 'number', min: 0, max: 999, message: '排序序号范围为 0-999', trigger: 'blur' }
  ]
}

const loadMenuList = async () => {
  loading.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 500))
    menuList.value = [
      {
        id: 1,
        parentId: 0,
        menuName: '工作中心',
        menuType: MenuType.DIRECTORY,
        menuIcon: 'House',
        businessCode: 'WORK_CENTER',
        menuPath: '/work-center',
        sortOrder: 1,
        menuStatus: MenuStatus.ENABLED,
        visible: MenuVisible.TRUE,
        children: [
          {
            id: 11,
            parentId: 1,
            menuName: '待办任务',
            menuType: MenuType.MENU,
            menuIcon: 'Task',
            businessCode: 'TODO',
            menuPath: '/work-center/todo',
            sortOrder: 1,
            menuStatus: MenuStatus.ENABLED,
            visible: MenuVisible.TRUE
          },
          {
            id: 12,
            parentId: 1,
            menuName: '消息中心',
            menuType: MenuType.MENU,
            menuIcon: 'Message',
            businessCode: 'MESSAGE',
            menuPath: '/work-center/messages',
            sortOrder: 2,
            menuStatus: MenuStatus.ENABLED,
            visible: MenuVisible.TRUE
          },
          {
            id: 13,
            parentId: 1,
            menuName: '预警信息',
            menuType: MenuType.MENU,
            menuIcon: 'Warning',
            businessCode: 'WARNING',
            menuPath: '/work-center/warnings',
            sortOrder: 3,
            menuStatus: MenuStatus.ENABLED,
            visible: MenuVisible.TRUE
          }
        ]
      },
      {
        id: 2,
        parentId: 0,
        menuName: '招聘管理',
        menuType: MenuType.DIRECTORY,
        menuIcon: 'UserFilled',
        businessCode: 'RECRUITMENT',
        menuPath: '/recruitment',
        sortOrder: 2,
        menuStatus: MenuStatus.ENABLED,
        visible: MenuVisible.TRUE,
        children: [
          {
            id: 21,
            parentId: 2,
            menuName: '招聘需求',
            menuType: MenuType.MENU,
            menuIcon: 'Document',
            businessCode: 'RECRUITMENT_DEMAND',
            menuPath: '/recruitment/demand',
            sortOrder: 1,
            menuStatus: MenuStatus.ENABLED,
            visible: MenuVisible.TRUE
          },
          {
            id: 22,
            parentId: 2,
            menuName: '简历管理',
            menuType: MenuType.MENU,
            menuIcon: 'Files',
            businessCode: 'RESUME',
            menuPath: '/recruitment/resume',
            sortOrder: 2,
            menuStatus: MenuStatus.ENABLED,
            visible: MenuVisible.TRUE
          }
        ]
      },
      {
        id: 9,
        parentId: 0,
        menuName: '系统管理',
        menuType: MenuType.DIRECTORY,
        menuIcon: 'Setting',
        businessCode: 'SYSTEM',
        menuPath: '/system',
        sortOrder: 9,
        menuStatus: MenuStatus.ENABLED,
        visible: MenuVisible.TRUE,
        children: [
          {
            id: 91,
            parentId: 9,
            menuName: '企业介绍',
            menuType: MenuType.DIRECTORY,
            menuIcon: 'OfficeBuilding',
            businessCode: 'COMPANY_INTRO',
            menuPath: '/system/company-intro',
            sortOrder: 1,
            menuStatus: MenuStatus.ENABLED,
            visible: MenuVisible.TRUE,
            children: [
              {
                id: 911,
                parentId: 91,
                menuName: '企业文化介绍',
                menuType: MenuType.MENU,
                menuIcon: 'OfficeBuilding',
                businessCode: 'COMPANY_CULTURE',
                menuPath: '/system/company-culture',
                sortOrder: 1,
                menuStatus: MenuStatus.ENABLED,
                visible: MenuVisible.TRUE
              },
              {
                id: 912,
                parentId: 91,
                menuName: '岗位文化介绍',
                menuType: MenuType.MENU,
                menuIcon: 'Avatar',
                businessCode: 'JOB_CULTURE',
                menuPath: '/system/job-culture',
                sortOrder: 2,
                menuStatus: MenuStatus.ENABLED,
                visible: MenuVisible.TRUE
              }
            ]
          },
          {
            id: 92,
            parentId: 9,
            menuName: '部门管理',
            menuType: MenuType.MENU,
            menuIcon: 'Organization',
            businessCode: 'DEPARTMENT',
            menuPath: '/system/department',
            sortOrder: 2,
            menuStatus: MenuStatus.ENABLED,
            visible: MenuVisible.TRUE
          },
          {
            id: 93,
            parentId: 9,
            menuName: '正式员工',
            menuType: MenuType.MENU,
            menuIcon: 'User',
            businessCode: 'EMPLOYEE',
            menuPath: '/system/employee',
            sortOrder: 3,
            menuStatus: MenuStatus.ENABLED,
            visible: MenuVisible.TRUE
          },
          {
            id: 94,
            parentId: 9,
            menuName: '岗位管理',
            menuType: MenuType.MENU,
            menuIcon: 'Avatar',
            businessCode: 'ROLE',
            menuPath: '/system/role',
            sortOrder: 4,
            menuStatus: MenuStatus.ENABLED,
            visible: MenuVisible.TRUE
          },
          {
            id: 95,
            parentId: 9,
            menuName: '规则配置',
            menuType: MenuType.MENU,
            menuIcon: 'List',
            businessCode: 'RULE_CONFIG',
            menuPath: '/system/rule-config',
            sortOrder: 5,
            menuStatus: MenuStatus.ENABLED,
            visible: MenuVisible.TRUE
          },
          {
            id: 96,
            parentId: 9,
            menuName: '菜单配置',
            menuType: MenuType.MENU,
            menuIcon: 'Menu',
            businessCode: 'MENU_CONFIG',
            menuPath: '/system/menu-config',
            sortOrder: 6,
            menuStatus: MenuStatus.ENABLED,
            visible: MenuVisible.TRUE
          },
          {
            id: 97,
            parentId: 9,
            menuName: '字典管理',
            menuType: MenuType.MENU,
            menuIcon: 'Notebook',
            businessCode: 'DICTIONARY',
            menuPath: '/system/dictionary',
            sortOrder: 7,
            menuStatus: MenuStatus.ENABLED,
            visible: MenuVisible.TRUE
          },
          {
            id: 98,
            parentId: 9,
            menuName: '系统参数',
            menuType: MenuType.MENU,
            menuIcon: 'Tools',
            businessCode: 'SYSTEM_PARAM',
            menuPath: '/system/system-param',
            sortOrder: 8,
            menuStatus: MenuStatus.ENABLED,
            visible: MenuVisible.TRUE
          },
          {
            id: 99,
            parentId: 9,
            menuName: '流程管理',
            menuType: MenuType.MENU,
            menuIcon: 'Operation',
            businessCode: 'PROCESS',
            menuPath: '/system/process',
            sortOrder: 9,
            menuStatus: MenuStatus.ENABLED,
            visible: MenuVisible.TRUE
          },
          {
            id: 910,
            parentId: 9,
            menuName: '流程配置',
            menuType: MenuType.MENU,
            menuIcon: 'Connection',
            businessCode: 'PROCESS_CONFIG',
            menuPath: '/system/process-config',
            sortOrder: 10,
            menuStatus: MenuStatus.ENABLED,
            visible: MenuVisible.TRUE
          },
          {
            id: 911,
            parentId: 9,
            menuName: '附件管理',
            menuType: MenuType.MENU,
            menuIcon: 'Folder',
            businessCode: 'ATTACHMENT',
            menuPath: '/system/attachment',
            sortOrder: 11,
            menuStatus: MenuStatus.ENABLED,
            visible: MenuVisible.TRUE
          },
          {
            id: 912,
            parentId: 9,
            menuName: '打印管理',
            menuType: MenuType.DIRECTORY,
            menuIcon: 'Printer',
            businessCode: 'PRINT',
            menuPath: '/system/print',
            sortOrder: 12,
            menuStatus: MenuStatus.ENABLED,
            visible: MenuVisible.TRUE,
            children: [
              {
                id: 9121,
                parentId: 912,
                menuName: '模版配置',
                menuType: MenuType.MENU,
                menuIcon: 'Document',
                businessCode: 'PRINT_TEMPLATE',
                menuPath: '/system/print-template',
                sortOrder: 1,
                menuStatus: MenuStatus.ENABLED,
                visible: MenuVisible.TRUE
              },
              {
                id: 9122,
                parentId: 912,
                menuName: '打印配置',
                menuType: MenuType.MENU,
                menuIcon: 'Setting',
                businessCode: 'PRINT_CONFIG',
                menuPath: '/system/print-config',
                sortOrder: 2,
                menuStatus: MenuStatus.ENABLED,
                visible: MenuVisible.TRUE
              }
            ]
          }
        ]
      }
    ]
  } catch (error) {
    ElMessage.error('加载菜单列表失败')
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  queryParams.page = 1
  loadMenuList()
}

const handleReset = () => {
  queryParams.keyword = ''
  queryParams.menuType = undefined
  handleSearch()
}

const handleCreate = () => {
  dialogTitle.value = '新增菜单'
  Object.assign(formData, {
    id: undefined,
    parentId: undefined,
    menuName: '',
    menuType: MenuType.MENU,
    menuIcon: '',
    businessCode: '',
    menuPath: '',
    componentPath: '',
    sortOrder: 0,
    menuStatus: MenuStatus.ENABLED,
    visible: MenuVisible.TRUE,
    menuDesc: ''
  })
  dialogVisible.value = true
}

const handleAddChild = (row: Menu) => {
  dialogTitle.value = '添加子菜单'
  Object.assign(formData, {
    id: undefined,
    parentId: row.id,
    menuName: '',
    menuType: row.menuType === MenuType.DIRECTORY ? MenuType.MENU : MenuType.BUTTON,
    menuIcon: '',
    businessCode: '',
    menuPath: '',
    componentPath: '',
    sortOrder: 0,
    menuStatus: MenuStatus.ENABLED,
    visible: MenuVisible.TRUE,
    menuDesc: ''
  })
  dialogVisible.value = true
}

const handleEdit = (row: Menu) => {
  dialogTitle.value = '编辑菜单'
  Object.assign(formData, {
    id: row.id,
    parentId: row.parentId,
    menuName: row.menuName,
    menuType: row.menuType,
    menuIcon: row.menuIcon,
    businessCode: row.businessCode,
    menuPath: row.menuPath,
    componentPath: row.componentPath,
    sortOrder: row.sortOrder,
    menuStatus: row.menuStatus,
    visible: row.visible,
    menuDesc: row.menuDesc
  })
  dialogVisible.value = true
}

const handleDelete = async (row: Menu) => {
  try {
    const hasChildren = row.children && row.children.length > 0
    await ElMessageBox.confirm(
      `确定要删除菜单"${row.menuName}"吗？${hasChildren ? '该菜单包含子菜单，将一并删除。' : ''}`,
      '提示',
      { type: 'warning' }
    )
    ElMessage.success('删除成功')
    loadMenuList()
  } catch {
  }
}

const handleSubmit = async () => {
  if (!formRef.value) return

  await formRef.value.validate(async (valid: boolean) => {
    if (valid) {
      submitting.value = true
      try {
        await new Promise(resolve => setTimeout(resolve, 1000))
        ElMessage.success('保存成功')
        dialogVisible.value = false
        loadMenuList()
      } finally {
        submitting.value = false
      }
    }
  })
}

const handleDialogClose = () => {
  formRef.value?.resetFields()
}

const handleExpandAll = () => {
  expandAll.value = true
}

const handleCollapseAll = () => {
  expandAll.value = false
}

const handleRefresh = () => {
  loadMenuList()
}

const handleMenuTypeChange = (value: MenuType) => {
  if (value === MenuType.DIRECTORY) {
    formData.menuPath = ''
  }
}

const checkBusinessCodeUnique = async () => {
  if (!formData.businessCode) return
}

const getMenuTypeTagType = (type: MenuType) => {
  const map = {
    [MenuType.DIRECTORY]: 'primary',
    [MenuType.MENU]: 'success',
    [MenuType.BUTTON]: 'warning'
  }
  return map[type]
}

const getMenuTypeLabel = (type: MenuType) => {
  const map = {
    [MenuType.DIRECTORY]: '目录',
    [MenuType.MENU]: '菜单',
    [MenuType.BUTTON]: '按钮'
  }
  return map[type]
}

watch(() => formData.parentId, (newVal) => {
  if (newVal) {
    const parentMenu = findMenuById(newVal, menuList.value)
    if (parentMenu) {
      formData.menuPath = parentMenu.menuPath + '/' + generatePath(formData.menuName)
    }
  }
})

const findMenuById = (id: number, list: Menu[]): Menu | null => {
  for (const item of list) {
    if (item.id === id) return item
    if (item.children) {
      const found = findMenuById(id, item.children)
      if (found) return found
    }
  }
  return null
}

const generatePath = (name: string): string => {
  return name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '')
}

onMounted(() => {
  loadMenuList()
})
</script>

<style scoped>
.menu-config-container {
  padding: 20px;
}

.search-card {
  margin-bottom: 20px;
}

.action-bar {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
  padding: 16px 20px;
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

@media screen and (max-width: 768px) {
  .menu-config-container {
    padding: 16px;
  }

  .action-bar {
    flex-direction: column;
  }

  .action-bar > * {
    width: 100%;
  }
}
</style>
