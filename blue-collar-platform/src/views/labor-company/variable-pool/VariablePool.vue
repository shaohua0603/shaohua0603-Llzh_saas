<template>
  <div class="variable-pool-container">
    <div class="variable-pool-content">
      <!-- 左侧面板 -->
      <div class="left-panel">
        <!-- 数据库连接配置 -->
        <div class="database-config-header">
          <div class="card-header">
            <span>数据库连接配置</span>
            <el-button
              type="primary"
              @click="openDatabaseConfigDialog"
              size="small"
              class="config-button"
            >
              <el-icon><Setting /></el-icon>
            </el-button>
          </div>
        </div>
        
        <!-- 表结构浏览 -->
        <el-card class="left-card">
          <template #header>
            <div class="card-header">
              <span>表结构浏览</span>
            </div>
          </template>
          <div class="table-browser">
            <el-input v-model="tableSearch" placeholder="搜索表名" class="table-search" />
            <el-tree
              :data="tableTree"
              :props="tableTreeProps"
              node-key="id"
              default-expand-all
              @node-click="handleTableClick"
              class="table-tree"
            />
          </div>
        </el-card>
      </div>
      
      <!-- 右侧面板 -->
      <div class="right-panel">
        <el-card class="right-card">
          <template #header>
            <div class="card-header">
              <span>变量管理</span>
              <div class="header-buttons">
                <el-button type="primary" @click="generateVariables" :disabled="!selectedTable" size="small">
                  从表结构生成变量
                </el-button>
                <el-button type="success" @click="toggleSqlPanel" size="small">
                  从SQL添加变量
                </el-button>
              </div>
            </div>
          </template>
          <div class="variable-management">
            <el-table :data="variables" style="width: 100%" class="variable-table">
              <el-table-column prop="name" label="变量名称" width="150" />
              <el-table-column prop="code" label="变量编码" width="150" />
              <el-table-column prop="type" label="变量类型" width="100" />
              <el-table-column prop="source" label="来源" width="100" />
              <el-table-column prop="tableName" label="所属表" width="120" />
              <el-table-column prop="fieldName" label="字段名" width="120" />
              <el-table-column prop="description" label="变量描述" />
              <el-table-column label="操作" width="120">
                <template #default="scope">
                  <el-button size="small" @click="editVariable(scope.row)">编辑</el-button>
                  <el-button size="small" type="danger" @click="deleteVariable(scope.row.id)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-card>
        
        <!-- SQL解析右侧栏 -->
        <div class="sql-panel" :class="{ 'visible': sqlPanelVisible }">
          <div class="sql-panel-header">
            <h3>SQL解析</h3>
            <el-button type="text" @click="toggleSqlPanel" class="close-button">
              <el-icon><Close /></el-icon>
            </el-button>
          </div>
          <div class="sql-panel-content">
            <el-input
              v-model="sqlStatement"
              type="textarea"
              rows="6"
              placeholder="输入SQL语句"
              class="sql-input"
            />
            <el-button type="primary" @click="parseSql" size="small" style="margin-bottom: 16px">
              解析SQL
            </el-button>
            <div v-if="sqlVariables.length > 0" class="sql-variables-section">
              <h4>解析结果</h4>
              <el-checkbox-group v-model="selectedSqlVariables" class="sql-variables-list">
                <el-checkbox v-for="(item, index) in sqlVariables" :key="index" :label="item">
                  <div class="sql-variable-item">
                    <div class="variable-name">{{ item.name }}</div>
                    <div class="variable-type">{{ item.type }}</div>
                    <div class="variable-desc">{{ item.description }}</div>
                  </div>
                </el-checkbox>
              </el-checkbox-group>
              <div class="sql-panel-footer">
                <el-button @click="toggleSqlPanel">取消</el-button>
                <el-button type="primary" @click="confirmSqlVariables" :disabled="selectedSqlVariables.length === 0">
                  确认添加
                </el-button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 数据库连接配置对话框 -->
    <el-dialog v-model="databaseConfigVisible" title="数据库连接配置">
      <el-form :model="databaseForm" label-width="120px" class="database-form">
        <el-form-item label="数据库类型">
          <el-select v-model="databaseForm.type" placeholder="选择数据库类型">
            <el-option label="MySQL" value="mysql" />
            <el-option label="PostgreSQL" value="postgresql" />
            <el-option label="Oracle" value="oracle" />
            <el-option label="SQL Server" value="sqlserver" />
          </el-select>
        </el-form-item>
        <el-form-item label="主机地址">
          <el-input v-model="databaseForm.host" placeholder="输入主机地址" />
        </el-form-item>
        <el-form-item label="端口">
          <el-input-number v-model="databaseForm.port" :min="1" :max="65535" />
        </el-form-item>
        <el-form-item label="数据库名">
          <el-input v-model="databaseForm.database" placeholder="输入数据库名" />
        </el-form-item>
        <el-form-item label="用户名">
          <el-input v-model="databaseForm.username" placeholder="输入用户名" />
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="databaseForm.password" type="password" placeholder="输入密码" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="databaseConfigVisible = false">取消</el-button>
          <el-button type="primary" @click="testConnection">测试连接</el-button>
          <el-button type="success" @click="saveDatabaseConfig">保存配置</el-button>
        </span>
      </template>
    </el-dialog>
    
    <!-- 编辑变量对话框 -->
    <el-dialog v-model="editDialogVisible" title="编辑变量">
      <el-form :model="editForm" label-width="120px">
        <el-form-item label="变量名称">
          <el-input v-model="editForm.name" />
        </el-form-item>
        <el-form-item label="变量编码">
          <el-input v-model="editForm.code" />
        </el-form-item>
        <el-form-item label="变量类型">
          <el-select v-model="editForm.type">
            <el-option label="文本" value="text" />
            <el-option label="数字" value="number" />
            <el-option label="日期" value="date" />
            <el-option label="布尔" value="boolean" />
          </el-select>
        </el-form-item>
        <el-form-item label="变量描述">
          <el-input v-model="editForm.description" type="textarea" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="editDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="saveVariable">保存</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Close, Setting } from '@element-plus/icons-vue'

// 数据库连接配置
const databaseForm = reactive({
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  database: '',
  username: '',
  password: ''
})

// 数据库配置对话框可见性
const databaseConfigVisible = ref(false)

// SQL解析面板可见性
const sqlPanelVisible = ref(false)

// 表结构树
const tableTree = ref([])
const tableTreeProps = {
  children: 'children',
  label: 'label',
  isLeaf: 'isLeaf'
}

// 搜索
const tableSearch = ref('')

// 选中的表
const selectedTable = ref(null)

// 变量列表
const variables = ref([])

// SQL解析
const sqlStatement = ref('')
const sqlVariables = ref([])
const selectedSqlVariables = ref([])

// 编辑对话框
const editDialogVisible = ref(false)
const editForm = reactive({
  id: '',
  name: '',
  code: '',
  type: 'text',
  source: '',
  tableName: '',
  fieldName: '',
  description: ''
})

// 打开数据库配置对话框
const openDatabaseConfigDialog = () => {
  databaseConfigVisible.value = true
}

// 测试数据库连接
const testConnection = async () => {
  try {
    // 模拟测试连接
    ElMessage.success('数据库连接测试成功')
  } catch (error) {
    ElMessage.error('数据库连接测试失败')
  }
}

// 保存数据库配置
const saveDatabaseConfig = () => {
  ElMessage.success('数据库配置保存成功')
  // 模拟获取表结构
  fetchTableStructure()
  databaseConfigVisible.value = false
}

// 获取表结构
const fetchTableStructure = () => {
  // 模拟表结构数据
  tableTree.value = [
    {
      id: 'workers',
      label: '工人表 (workers)',
      children: [
        { id: 'workers_id', label: 'ID (id)', isLeaf: true },
        { id: 'workers_name', label: '姓名 (name)', isLeaf: true },
        { id: 'workers_gender', label: '性别 (gender)', isLeaf: true },
        { id: 'workers_age', label: '年龄 (age)', isLeaf: true },
        { id: 'workers_phone', label: '手机号 (phone)', isLeaf: true }
      ]
    },
    {
      id: 'departments',
      label: '部门表 (departments)',
      children: [
        { id: 'departments_id', label: 'ID (id)', isLeaf: true },
        { id: 'departments_name', label: '部门名称 (name)', isLeaf: true },
        { id: 'departments_manager', label: '部门经理 (manager)', isLeaf: true }
      ]
    },
    {
      id: 'positions',
      label: '岗位表 (positions)',
      children: [
        { id: 'positions_id', label: 'ID (id)', isLeaf: true },
        { id: 'positions_name', label: '岗位名称 (name)', isLeaf: true },
        { id: 'positions_salary', label: '薪资 (salary)', isLeaf: true }
      ]
    }
  ]
}

// 处理表点击
const handleTableClick = (data) => {
  if (data.isLeaf) {
    selectedTable.value = data
  }
}

// 生成变量
const generateVariables = () => {
  if (!selectedTable.value) {
    ElMessage.warning('请先选择一个字段')
    return
  }
  
  // 模拟生成变量
  const newVariable = {
    id: Date.now(),
    name: selectedTable.value.label.split(' ')[0],
    code: selectedTable.value.id,
    type: 'text',
    source: '表结构',
    tableName: selectedTable.value.id.split('_')[0],
    fieldName: selectedTable.value.id.split('_')[1],
    description: `来自${selectedTable.value.label.split(' ')[1]}表的${selectedTable.value.label.split(' ')[0]}字段`
  }
  
  variables.value.push(newVariable)
  ElMessage.success('变量生成成功')
}

// 切换SQL面板
const toggleSqlPanel = () => {
  sqlPanelVisible.value = !sqlPanelVisible.value
  if (!sqlPanelVisible.value) {
    // 关闭面板时清空选择
    selectedSqlVariables.value = []
  }
}

// 解析SQL
const parseSql = () => {
  if (!sqlStatement.value) {
    ElMessage.warning('请输入SQL语句')
    return
  }
  
  // 模拟SQL解析
  sqlVariables.value = [
    { name: '工人ID', type: 'number', description: '来自WHERE条件的id参数' },
    { name: '部门名称', type: 'text', description: '来自WHERE条件的department参数' }
  ]
  
  ElMessage.success('SQL解析成功')
}

// 确认SQL变量
const confirmSqlVariables = () => {
  if (selectedSqlVariables.value.length === 0) {
    ElMessage.warning('请至少选择一个变量')
    return
  }
  
  // 将选中的SQL变量添加到变量列表
  selectedSqlVariables.value.forEach((sqlVar, index) => {
    const newVariable = {
      id: Date.now() + index,
      name: sqlVar.name,
      code: `sql_var_${Date.now()}_${index}`,
      type: sqlVar.type,
      source: 'SQL解析',
      tableName: '',
      fieldName: '',
      description: sqlVar.description
    }
    variables.value.push(newVariable)
  })
  
  ElMessage.success('从SQL添加变量成功')
  toggleSqlPanel()
}

// 编辑变量
const editVariable = (row) => {
  Object.assign(editForm, row)
  editDialogVisible.value = true
}

// 保存变量
const saveVariable = () => {
  const index = variables.value.findIndex(v => v.id === editForm.id)
  if (index !== -1) {
    variables.value[index] = { ...editForm }
    ElMessage.success('变量保存成功')
    editDialogVisible.value = false
  }
}

// 删除变量
const deleteVariable = (id) => {
  ElMessageBox.confirm('确定要删除这个变量吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    variables.value = variables.value.filter(v => v.id !== id)
    ElMessage.success('变量删除成功')
  })
}

// 初始化
onMounted(() => {
  // 加载保存的数据库配置
  // 模拟加载
  databaseForm.database = 'blue_collar'
  databaseForm.username = 'root'
  databaseForm.password = '123456'
  
  // 获取表结构
  fetchTableStructure()
})
</script>

<style scoped>
.variable-pool-container {
  padding: 20px;
  height: calc(100vh - 120px);
  overflow: hidden;
}

.variable-pool-content {
  display: flex;
  height: 100%;
  gap: 20px;
}

/* 左侧面板 */
.left-panel {
  width: 350px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 16px;
  overflow-y: auto;
}

.left-card {
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.database-config-header {
  padding: 16px 20px;
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 16px;
}

.table-browser {
  margin-top: 10px;
}

.table-search {
  margin-bottom: 10px;
}

.table-tree {
  height: calc(100vh - 300px);
  border: 1px solid #e4e7ed;
  border-radius: 4px;
  overflow: auto;
}

/* 右侧面板 */
.right-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;
  transition: all 0.3s ease;
}



.right-card {
  flex: 1;
  display: flex;
  flex-direction: column;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.header-buttons {
  display: flex;
  gap: 8px;
}

.variable-management {
  flex: 1;
  overflow: hidden;
  margin-top: 10px;
}

.variable-table {
  width: 100%;
  height: 100%;
  overflow: auto;
}

/* SQL解析右侧栏 */
.sql-panel {
  position: fixed;
  top: 60px;
  right: -400px;
  width: 400px;
  height: calc(100vh - 60px);
  background-color: #ffffff;
  box-shadow: -2px 0 8px rgba(0, 0, 0, 0.15);
  border-radius: 4px 0 0 4px;
  transition: right 0.3s ease;
  display: flex;
  flex-direction: column;
  z-index: 1000;
}

.sql-panel.visible {
  right: 0;
}

.sql-panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid #e4e7ed;
  background-color: #f5f7fa;
}

.sql-panel-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 500;
}

.close-button {
  padding: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.sql-panel-content {
  flex: 1;
  padding: 16px;
  overflow-y: auto;
}

.sql-input {
  margin-bottom: 16px;
}

.sql-variables-section {
  margin-top: 16px;
}

.sql-variables-section h4 {
  margin: 0 0 12px 0;
  font-size: 14px;
  font-weight: 500;
}

.sql-variables-list {
  margin-bottom: 20px;
}

.sql-variable-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 8px;
  border: 1px solid #e4e7ed;
  border-radius: 4px;
  margin-bottom: 8px;
  background-color: #f9f9f9;
}

.variable-name {
  font-weight: 500;
  font-size: 14px;
}

.variable-type {
  font-size: 12px;
  color: #606266;
}

.variable-desc {
  font-size: 12px;
  color: #909399;
  line-height: 1.4;
}

.sql-panel-footer {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  padding: 16px;
  border-top: 1px solid #e4e7ed;
  background-color: #f5f7fa;
}

/* 对话框样式 */
.dialog-footer {
  text-align: right;
}

/* 响应式适配 */
@media screen and (max-width: 1200px) {
  .left-panel {
    width: 300px;
  }
  
  .sql-panel {
    width: 350px;
    right: -350px;
  }
}

@media screen and (max-width: 768px) {
  .variable-pool-content {
    flex-direction: column;
  }
  
  .left-panel {
    width: 100%;
    max-height: 300px;
  }
  
  .right-panel {
    flex: 1;
  }
  
  .sql-panel {
    width: 100%;
    right: -100%;
  }
}
</style>