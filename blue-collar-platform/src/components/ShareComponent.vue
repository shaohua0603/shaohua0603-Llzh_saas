<template>
  <div class="share-component">
    <el-button 
      type="info" 
      @click="showShareDialog = true"
      :icon="Share"
    >
      分享
    </el-button>
    
    <!-- 分享对话框 -->
    <el-dialog
      v-model="showShareDialog"
      title="分享到"
      width="400px"
    >
      <div class="share-content">
        <!-- 复制链接 -->
        <div class="share-item">
          <el-input 
            v-model="shareLink" 
            readonly 
            placeholder="分享链接"
          >
            <template #append>
              <el-button @click="copyLink">
                <el-icon><DocumentCopy /></el-icon>
                复制
              </el-button>
            </template>
          </el-input>
        </div>
        
        <!-- 分享平台 -->
        <div class="share-platforms">
          <h3>选择分享平台</h3>
          <div class="platform-buttons">
            <el-button 
              v-for="platform in platforms" 
              :key="platform.key"
              @click="shareToPlatform(platform.key)"
              class="platform-button"
            >
              <el-icon :size="24">
                <component :is="platform.icon" />
              </el-icon>
              <span>{{ platform.name }}</span>
            </el-button>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { Share, DocumentCopy, ChatLineRound, VideoCamera, Link, ChatLineSquare, Message, ChatDotRound } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'

// Props
const props = defineProps({
  title: {
    type: String,
    required: true
  },
  id: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true,
    validator: (value: string) => ['news', 'entertainment', 'community'].includes(value)
  }
})

// 响应式数据
const showShareDialog = ref(false)
const router = useRouter()

// 暴露方法给父组件
defineExpose({
  openShareDialog: () => {
    showShareDialog.value = true
  }
})

// 分享平台
const platforms = [
  {
    key: 'wechat',
    name: '微信',
    icon: ChatLineRound
  },
  {
    key: 'qq',
    name: 'QQ',
    icon: VideoCamera
  },
  {
    key: 'wecom',
    name: '企业微信',
    icon: ChatLineSquare
  },
  {
    key: 'feishu',
    name: '飞书',
    icon: Message
  },
  {
    key: 'dingtalk',
    name: '钉钉',
    icon: ChatDotRound
  },
  {
    key: 'link',
    name: '复制链接',
    icon: Link
  }
]

// 计算分享链接
const shareLink = computed(() => {
  const baseUrl = window.location.origin
  let path = ''
  
  switch (props.type) {
    case 'news':
      path = `/tenant/on-duty/news/detail/${props.id}`
      break
    case 'entertainment':
      path = `/tenant/on-duty/entertainment/detail/${props.id}`
      break
    case 'community':
      path = `/tenant/on-duty/community/detail/${props.id}`
      break
    default:
      path = `/tenant/on-duty/community/detail/${props.id}`
  }
  
  return `${baseUrl}${path}`
})

// 复制链接
const copyLink = async () => {
  try {
    await navigator.clipboard.writeText(shareLink.value)
    ElMessage.success('链接已复制到剪贴板')
    showShareDialog.value = false
  } catch (error) {
    console.error('复制失败:', error)
    ElMessage.error('复制失败，请手动复制')
  }
}

// 分享到平台
const shareToPlatform = (platform: string) => {
  switch (platform) {
    case 'wechat':
      ElMessage.info('请使用微信扫描二维码分享')
      // 这里可以生成二维码
      break
    case 'qq':
      ElMessage.info('请使用QQ扫描二维码分享')
      // 这里可以生成二维码
      break
    case 'wecom':
      ElMessage.info('请使用企业微信扫描二维码分享')
      // 这里可以生成二维码
      break
    case 'feishu':
      ElMessage.info('请使用飞书扫描二维码分享')
      // 这里可以生成二维码
      break
    case 'dingtalk':
      ElMessage.info('请使用钉钉扫描二维码分享')
      // 这里可以生成二维码
      break
    case 'link':
      copyLink()
      break
  }
}
</script>

<style scoped>
.share-component {
  display: inline-block;
}

.share-content {
  padding: 10px 0;
}

.share-item {
  margin-bottom: 20px;
}

.share-platforms h3 {
  margin-bottom: 15px;
  font-size: 14px;
  color: #606266;
}

.platform-buttons {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}

.platform-button {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  width: 80px;
  padding: 15px 10px;
  border-radius: 8px;
  transition: all 0.3s;
}

.platform-button:hover {
  background-color: #f5f7fa;
  transform: translateY(-2px);
}

.platform-button .el-icon {
  margin-bottom: 5px;
}
</style>