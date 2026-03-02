<template>
  <div class="print-config">
    <h1>打印配置</h1>
    <el-card>
      <el-form label-width="120px">
        <el-form-item label="默认打印机">
          <el-input placeholder="请输入默认打印机名称" v-model="defaultPrinter" />
        </el-form-item>
        <el-form-item label="打印方向">
          <el-select placeholder="请选择打印方向" v-model="printOrientation">
            <el-option label="纵向" value="portrait" />
            <el-option label="横向" value="landscape" />
          </el-select>
        </el-form-item>
        <el-form-item label="纸张大小">
          <el-select placeholder="请选择纸张大小" v-model="paperSize">
            <el-option label="A4" value="A4" />
            <el-option label="A3" value="A3" />
            <el-option label="B4" value="B4" />
            <el-option label="B5" value="B5" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="save">保存</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'

const defaultPrinter = ref('')
const printOrientation = ref('portrait')
const paperSize = ref('A4')

const save = () => {
  ElMessage.success('保存成功')
}
</script>

<style scoped>
.print-config {
  padding: 20px;
}

h1 {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 20px;
  color: #303133;
}
</style>