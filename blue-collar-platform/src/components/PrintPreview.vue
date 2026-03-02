<template>
  <div class="print-preview-container">
    <div class="preview-toolbar">
      <div class="toolbar-left">
        <el-button-group>
          <el-tooltip content="缩小" placement="top">
            <el-button @click="handleZoomOut">
              <el-icon><ZoomOut /></el-icon>
            </el-button>
          </el-tooltip>
          <el-button disabled>
            {{ Math.round(scale * 100) }}%
          </el-button>
          <el-tooltip content="放大" placement="top">
            <el-button @click="handleZoomIn">
              <el-icon><ZoomIn /></el-icon>
            </el-button>
          </el-tooltip>
        </el-button-group>
      </div>
      <div class="toolbar-right">
        <el-button @click="handlePrint" type="primary">
          <el-icon><Printer /></el-icon>
          打印
        </el-button>
        <el-button @click="handleDownload">
          <el-icon><Download /></el-icon>
          下载PDF
        </el-button>
        <el-button @click="handleClose">
          关闭
        </el-button>
      </div>
    </div>

    <div class="preview-content" :style="{ transform: `scale(${scale})` }">
      <div
        ref="printContentRef"
        class="print-page"
        :style="pageStyle"
      >
        <div v-html="htmlContent"></div>
      </div>
    </div>

    <div class="preview-footer">
      <div class="footer-info">
        <span>共 {{ totalPages }} 页</span>
        <span v-if="currentPage">当前第 {{ currentPage }} 页</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { ElMessage } from 'element-plus'
import { ZoomIn, ZoomOut, Printer, Download } from '@element-plus/icons-vue'

interface Props {
  htmlContent: string
  pageSettings?: {
    orientation: 'portrait' | 'landscape'
    paperSize: 'A4' | 'A3' | 'B4' | 'B5'
    margin: {
      top: number
      right: number
      bottom: number
      left: number
    }
  }
}

const props = withDefaults(defineProps<Props>(), {
  pageSettings: () => ({
    orientation: 'portrait',
    paperSize: 'A4',
    margin: {
      top: 20,
      right: 20,
      bottom: 20,
      left: 20
    }
  })
})

const emit = defineEmits<{
  close: []
  print: []
}>()

const printContentRef = ref<HTMLElement>()
const scale = ref(1)
const currentPage = ref(1)
const totalPages = ref(1)

const pageStyle = computed(() => {
  const sizeMap: Record<string, { width: string; height: string }> = {
    A4: { width: '210mm', height: '297mm' },
    A3: { width: '297mm', height: '420mm' },
    B4: { width: '250mm', height: '353mm' },
    B5: { width: '176mm', height: '250mm' }
  }

  const size = sizeMap[props.pageSettings.paperSize] || sizeMap.A4
  const isPortrait = props.pageSettings.orientation === 'portrait'

  return {
    width: isPortrait ? size.width : size.height,
    height: isPortrait ? size.height : size.width,
    padding: `${props.pageSettings.margin.top}px ${props.pageSettings.margin.right}px ${props.pageSettings.margin.bottom}px ${props.pageSettings.margin.left}px`
  }
})

const handleZoomIn = () => {
  if (scale.value < 2) {
    scale.value = Math.min(scale.value + 0.1, 2)
  }
}

const handleZoomOut = () => {
  if (scale.value > 0.5) {
    scale.value = Math.max(scale.value - 0.1, 0.5)
  }
}

const handlePrint = () => {
  const printWindow = window.open('', '_blank')
  if (printWindow) {
    const printContent = printContentRef.value?.innerHTML || ''
    const printStyle = `
      <style>
        @page {
          size: ${props.pageSettings.paperSize} ${props.pageSettings.orientation};
          margin: ${props.pageSettings.margin.top}px ${props.pageSettings.margin.right}px ${props.pageSettings.margin.bottom}px ${props.pageSettings.margin.left}px;
        }
        body {
          margin: 0;
          padding: 0;
        }
      </style>
    `
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <title>打印</title>
          ${printStyle}
        </head>
        <body>${printContent}</body>
      </html>
    `)
    printWindow.document.close()
    printWindow.onload = () => {
      printWindow.print()
    }
    emit('print')
  }
}

const handleDownload = async () => {
  try {
    ElMessage.info('PDF下载功能开发中,可使用浏览器打印功能保存为PDF')
  } catch (error) {
    console.error('下载失败:', error)
    ElMessage.error('下载失败')
  }
}

const handleClose = () => {
  emit('close')
}

const calculatePages = () => {
  if (!printContentRef.value) return

  const contentHeight = printContentRef.value.scrollHeight
  const pageHeight = parseFloat(pageStyle.value.height)

  totalPages.value = Math.ceil(contentHeight / pageHeight)
}

const handleWheel = (event: WheelEvent) => {
  if (event.ctrlKey) {
    event.preventDefault()
    if (event.deltaY < 0) {
      handleZoomIn()
    } else {
      handleZoomOut()
    }
  }
}

onMounted(() => {
  window.addEventListener('wheel', handleWheel, { passive: false })
  setTimeout(() => {
    calculatePages()
  }, 100)
})

onUnmounted(() => {
  window.removeEventListener('wheel', handleWheel)
})

defineExpose({
  handlePrint,
  handleDownload,
  scale,
  currentPage,
  totalPages
})
</script>

<style scoped>
.print-preview-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: #f0f2f5;
}

.preview-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 20px;
  background-color: #fff;
  border-bottom: 1px solid #dcdfe6;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.toolbar-left,
.toolbar-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.preview-content {
  flex: 1;
  overflow: auto;
  padding: 40px;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  transform-origin: top center;
  transition: transform 0.2s ease;
}

.print-page {
  background-color: #fff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  margin: 0 auto;
  overflow: hidden;
}

.print-page :deep(table) {
  border-collapse: collapse;
  width: 100%;
  margin: 8px 0;
}

.print-page :deep(table td),
.print-page :deep(table th) {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}

.print-page :deep(img) {
  max-width: 100%;
  height: auto;
}

.print-page :deep(h1),
.print-page :deep(h2),
.print-page :deep(h3),
.print-page :deep(h4),
.print-page :deep(h5),
.print-page :deep(h6) {
  margin: 12px 0 8px 0;
  font-weight: bold;
}

.print-page :deep(p) {
  margin: 8px 0;
  line-height: 1.6;
}

.print-page :deep(ul),
.print-page :deep(ol) {
  margin: 8px 0;
  padding-left: 24px;
}

.print-page :deep(li) {
  margin: 4px 0;
}

.preview-footer {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 12px 20px;
  background-color: #fff;
  border-top: 1px solid #dcdfe6;
}

.footer-info {
  display: flex;
  gap: 20px;
  font-size: 14px;
  color: #606266;
}

@media screen and (max-width: 768px) {
  .preview-toolbar {
    flex-direction: column;
    gap: 12px;
  }

  .toolbar-left,
  .toolbar-right {
    width: 100%;
    justify-content: center;
  }

  .preview-content {
    padding: 20px;
  }

  .footer-info {
    flex-direction: column;
    gap: 8px;
  }
}

@media print {
  .preview-toolbar,
  .preview-footer {
    display: none;
  }

  .preview-content {
    padding: 0;
    overflow: visible;
  }

  .print-page {
    box-shadow: none;
    margin: 0;
  }
}
</style>
