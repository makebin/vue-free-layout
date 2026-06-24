<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'

interface Props {
  id: number
  title: string
  videoUrl?: string
}

const props = withDefaults(defineProps<Props>(), {
  title: '播放器',
  videoUrl: '',
})

// 核心指标：追踪挂载和渲染次数
const mountTime = ref('')
const renderCount = ref(0)
const isMounted = ref(false)
const lastVideoUrl = ref('')

// 模拟播放器实例（只初始化一次）
let playerInstance: any = null

onMounted(() => {
  mountTime.value = new Date().toLocaleTimeString()
  isMounted.value = true
  
  // 模拟播放器初始化（耗时操作）
  playerInstance = {
    load: (url: string) => {
      lastVideoUrl.value = url
      console.log(`[播放器 ${props.id}] 加载视频: ${url}`)
    },
    destroy: () => {
      console.log(`[播放器 ${props.id}] 销毁实例`)
    }
  }
  
  // 初始加载
  if (props.videoUrl) {
    playerInstance.load(props.videoUrl)
  }
  
  console.log(`%c[播放器 ${props.id}] 挂载于 ${mountTime.value}`, 'color: green; font-weight: bold')
})

onUnmounted(() => {
  isMounted.value = false
  playerInstance?.destroy()
  console.log(`%c[播放器 ${props.id}] 卸载`, 'color: red; font-weight: bold')
})

// 只有 videoUrl 变化才重新加载（不重新创建实例）
watch(
  () => props.videoUrl,
  (newUrl) => {
    if (isMounted.value && playerInstance && newUrl !== lastVideoUrl.value) {
      playerInstance.load(newUrl)
    }
  }
)

// 每次组件渲染时计数（用于验证优化效果）
renderCount.value++

// 在控制台输出渲染信息
if (isMounted.value) {
  console.log(`[播放器 ${props.id}] 渲染次数: ${renderCount.value}`)
}
</script>

<template>
  <div class="mock-player">
    <div class="mock-player__header">
      <span class="mock-player__title">{{ title }}</span>
      <span class="mock-player__id">#{{ id }}</span>
    </div>
    
    <div class="mock-player__video">
      <div class="mock-player__placeholder">
        <svg viewBox="0 0 24 24" width="48" height="48">
          <path fill="currentColor" d="M8 5v14l11-7z"/>
        </svg>
        <span>模拟播放器</span>
      </div>
    </div>
    
    <div class="mock-player__stats">
      <div class="stat-item">
        <span class="stat-label">挂载时间</span>
        <span class="stat-value">{{ mountTime || '未挂载' }}</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">渲染次数</span>
        <span class="stat-value highlight">{{ renderCount }}</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">当前视频</span>
        <span class="stat-value">{{ videoUrl || '无' }}</span>
      </div>
    </div>
    
    <div class="mock-player__hint">
      改位置时渲染次数应保持不变
    </div>
  </div>
</template>

<style scoped>
.mock-player {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  color: #fff;
  font-family: monospace;
}

.mock-player__header {
  padding: 8px 12px;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 8px 8px 0 0;
}

.mock-player__title {
  font-size: 14px;
  font-weight: bold;
}

.mock-player__id {
  font-size: 12px;
  opacity: 0.6;
}

.mock-player__video {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 0;
}

.mock-player__placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  opacity: 0.5;
}

.mock-player__placeholder svg {
  color: #fff;
}

.mock-player__placeholder span {
  font-size: 12px;
}

.mock-player__stats {
  padding: 8px 12px;
  background: rgba(0, 0, 0, 0.2);
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.stat-item {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.stat-label {
  font-size: 10px;
  opacity: 0.6;
}

.stat-value {
  font-size: 12px;
}

.stat-value.highlight {
  color: #4ecdc4;
  font-weight: bold;
  font-size: 14px;
}

.mock-player__hint {
  padding: 6px 12px;
  font-size: 10px;
  opacity: 0.4;
  text-align: center;
  border-radius: 0 0 8px 8px;
}
</style>