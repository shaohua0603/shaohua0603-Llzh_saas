<script setup lang="ts">
import { useRouter } from 'vue-router'
import { ElIcon } from 'element-plus'
import { ArrowLeft } from '@element-plus/icons-vue'

const router = useRouter()

const backToPrevious = () => {
  router.back()
}
</script>

<template>
  <div class="back-button-container">
    <button class="back-button" @click="backToPrevious">
      <ElIcon size="20">
        <ArrowLeft />
      </ElIcon>
    </button>
  </div>
</template>

<style scoped>
.back-button-container {
  position: fixed;
  top: 50%;
  right: 20px;
  transform: translateY(-50%);
  z-index: 1000;
}

.back-button {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: #1890ff;
  color: white;
  border: none;
  box-shadow: 0 2px 12px 0 rgba(24, 144, 255, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.back-button:hover {
  background-color: #40a9ff;
  transform: scale(1.1);
}

.back-button {
  font-size: 20px;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .back-button-container {
    right: 15px;
  }
  
  .back-button {
    width: 45px;
    height: 45px;
    font-size: 18px;
  }
}
</style>