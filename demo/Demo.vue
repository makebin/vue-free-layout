<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { FreeLayout } from '../index'
import { layoutPresets } from './layouts'
import MockPlayer from './MockPlayer.vue'
import type { LayoutItem } from '../types'

interface DemoPayload {
  title: string
  bgColor: string
  videoUrl?: string
}

const currentLayoutName = ref('grid9')
const animationDuration = ref(350)
const containerSize = ref({ width: 0, height: 0 })
const clickedItem = ref<string | null>(null)
const changeLog = ref<string[]>([])
const useMockPlayer = ref(false)
const layoutRef = ref<InstanceType<typeof FreeLayout> | null>(null)

const currentPreset = computed(() => {
  return layoutPresets.find(p => p.name === currentLayoutName.value) || layoutPresets[0]
})

const items = ref<LayoutItem<DemoPayload>[]>(currentPreset.value.generate())

// 播放器测试布局（4 个播放器）
function createPlayerLayout(): LayoutItem<DemoPayload>[] {
  return [
    { id: 1, x: '2%', y: '2%', w: '47%', h: '47%', payload: { title: '播放器 1', bgColor: '#FF6B6B', videoUrl: 'video-1.mp4' } },
    { id: 2, x: '51%', y: '2%', w: '47%', h: '47%', payload: { title: '播放器 2', bgColor: '#4ECDC4', videoUrl: 'video-2.mp4' } },
    { id: 3, x: '2%', y: '51%', w: '47%', h: '47%', payload: { title: '播放器 3', bgColor: '#45B7D1', videoUrl: 'video-3.mp4' } },
    { id: 4, x: '51%', y: '51%', w: '47%', h: '47%', payload: { title: '播放器 4', bgColor: '#96CEB4', videoUrl: 'video-4.mp4' } },
  ]
}

function switchLayout(name: string) {
  currentLayoutName.value = name
  const preset = layoutPresets.find(p => p.name === name)
  if (preset) {
    items.value = preset.generate()
  }
}

function toggleMockPlayer() {
  useMockPlayer.value = !useMockPlayer.value
  if (useMockPlayer.value) {
    items.value = createPlayerLayout()
    addLog('切换到播放器测试模式')
  } else {
    items.value = currentPreset.value.generate()
    addLog('切换到普通布局模式')
  }
}

function handleItemClick(item: LayoutItem<DemoPayload>, index: number) {
  clickedItem.value = item.payload.title
  addLog(`点击: ${item.payload.title} (index=${index})`)
}

function handleItemsChange(changed: LayoutItem<DemoPayload>[]) {
  addLog(`布局变动: ${changed.length} 个区块位置/尺寸变化`)
}

function handleContainerResize(size: { width: number; height: number }) {
  containerSize.value = size
}

function addLog(msg: string) {
  const time = new Date().toLocaleTimeString()
  changeLog.value.unshift(`[${time}] ${msg}`)
  if (changeLog.value.length > 20) {
    changeLog.value.pop()
  }
}

// 只改位置（测试 v-memo 效果）
function shufflePositions() {
  const shuffled = items.value.map(item => {
    const maxX = 80
    const maxY = 80
    return {
      ...item,
      x: `${Math.random() * maxX}%`,
      y: `${Math.random() * maxY}%`,
      w: `${10 + Math.random() * 20}%`,
      h: `${10 + Math.random() * 20}%`,
    }
  })
  items.value = shuffled
  addLog('随机打乱位置（payload 不变，播放器应不重渲染）')
}

// 改 payload（触发重渲染）
function changePayload() {
  items.value = items.value.map(item => ({
    ...item,
    payload: {
      ...item.payload,
      videoUrl: `video-${Math.floor(Math.random() * 100)}.mp4`,
    },
  }))
  addLog('修改 payload.videoUrl（播放器应重新渲染并加载新视频）')
}

function resetLayout() {
  if (useMockPlayer.value) {
    items.value = createPlayerLayout()
  } else {
    items.value = currentPreset.value.generate()
  }
  addLog('重置布局')
}

let isCompact = false
function toggleCompact() {
  isCompact = !isCompact
  if (isCompact) {
    items.value = items.value.map(item => ({
      ...item,
      w: typeof item.w === 'string' && item.w.endsWith('%')
        ? `${parseFloat(item.w) * 0.8}%`
        : item.w,
      h: typeof item.h === 'string' && item.h.endsWith('%')
        ? `${parseFloat(item.h) * 0.8}%`
        : item.h,
    }))
    addLog('切换为紧凑模式（payload 不变，播放器应不重渲染）')
  } else {
    resetLayout()
  }
}

onMounted(() => {
  addLog('组件已挂载，当前布局: ' + currentPreset.value.label)
})

function testRefreshLayout() {
  layoutRef.value?.refreshLayout()
  const size = layoutRef.value?.getContainerSize()
  addLog(`手动刷新布局，容器尺寸: ${Math.round(size?.width || 0)} × ${Math.round(size?.height || 0)}`)
}

function testResolveAllItems() {
  const resolved = layoutRef.value?.resolveAllItems()
  if (resolved && resolved.length > 0) {
    const first = resolved[0]
    addLog(`解析像素尺寸: 第1个区块 x=${Math.round(first.pixelX)}px, y=${Math.round(first.pixelY)}px, w=${Math.round(first.pixelW)}px, h=${Math.round(first.pixelH)}px`)
  }
}

function testGetItemPixelRect() {
  const rect = layoutRef.value?.getItemPixelRect(1)
  if (rect) {
    addLog(`获取 id=1 的区块尺寸: x=${Math.round(rect.x)}px, y=${Math.round(rect.y)}px, w=${Math.round(rect.w)}px, h=${Math.round(rect.h)}px`)
  }
}

function testSelectItem() {
  const firstItem = items.value[0]
  if (firstItem) {
    const ok = layoutRef.value?.toggleSelect(firstItem.id)
    const selected = layoutRef.value?.getSelectedItems()
    addLog(`选中区块 id=${firstItem.id}: ${ok ? '成功' : '失败'}, 当前选中 ${selected?.length || 0} 个`)
  }
}

function testClearSelection() {
  layoutRef.value?.clearSelection()
  addLog('已清空选中')
}

function testHideItem() {
  const firstItem = items.value.find(i => i.visible !== false)
  if (firstItem) {
    layoutRef.value?.hideItem(firstItem.id)
    addLog(`隐藏区块 id=${firstItem.id}`)
  }
}

function testShowAll() {
  items.value.forEach(item => {
    layoutRef.value?.showItem(item.id)
  })
  addLog('显示所有区块')
}

function testBringToFront() {
  const firstItem = items.value[0]
  if (firstItem) {
    layoutRef.value?.bringToFront(firstItem.id)
    const item = layoutRef.value?.getItemById(firstItem.id)
    addLog(`区块 id=${firstItem.id} 置顶, zIndex=${item?.zIndex}`)
  }
}

function testSendToBack() {
  const firstItem = items.value[0]
  if (firstItem) {
    layoutRef.value?.sendToBack(firstItem.id)
    const item = layoutRef.value?.getItemById(firstItem.id)
    addLog(`区块 id=${firstItem.id} 置底, zIndex=${item?.zIndex}`)
  }
}

function testAddItem() {
  const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7']
  const newId = Math.max(...items.value.map(i => Number(i.id) || 0), 0) + 1
  const newItem: LayoutItem<DemoPayload> = {
    id: newId,
    x: `${Math.random() * 70 + 10}%`,
    y: `${Math.random() * 70 + 10}%`,
    w: '20%',
    h: '20%',
    payload: {
      title: `新增区块 ${newId}`,
      bgColor: colors[newId % colors.length],
    },
  }
  layoutRef.value?.addItem(newItem)
  addLog(`新增区块 id=${newId}`)
}

function testRemoveItem() {
  const lastItem = items.value[items.value.length - 1]
  if (lastItem) {
    layoutRef.value?.removeItem(lastItem.id)
    addLog(`删除区块 id=${lastItem.id}`)
  }
}

function testUpdateItem() {
  const firstItem = items.value[0]
  if (firstItem) {
    layoutRef.value?.updateItem(firstItem.id, {
      x: '5%',
      y: '5%',
      w: '30%',
      h: '30%',
    })
    addLog(`更新区块 id=${firstItem.id} 的位置尺寸`)
  }
}

function handleSelectionChange(selected: LayoutItem<DemoPayload>[]) {
  addLog(`选中变化: 当前选中 ${selected.length} 个区块`)
}

function handleItemDoubleClick(item: LayoutItem<DemoPayload>, index: number) {
  addLog(`双击: ${item.payload.title} (index=${index})`)
}

function handleItemContextMenu(item: LayoutItem<DemoPayload>, index: number) {
  addLog(`右键: ${item.payload.title} (index=${index})`)
}
</script>

<template>
  <div class="demo-container">
    <header class="demo-header">
      <h1>FreeLayout 组件演示</h1>
      <div class="info">
        <span>容器尺寸: {{ Math.round(containerSize.width) }} × {{ Math.round(containerSize.height) }}</span>
        <span>区块数量: {{ items.length }}</span>
        <span v-if="clickedItem">当前点击: {{ clickedItem }}</span>
      </div>
    </header>

    <div class="demo-toolbar">
      <div class="preset-btns">
        <button
          v-for="preset in layoutPresets"
          :key="preset.name"
          :class="{ active: currentLayoutName === preset.name && !useMockPlayer }"
          @click="switchLayout(preset.name)"
        >
          {{ preset.label }}
        </button>
        <button
          :class="{ active: useMockPlayer }"
          class="player-btn"
          @click="toggleMockPlayer"
        >
          🎬 播放器测试
        </button>
      </div>
      <div class="action-btns">
        <button @click="shufflePositions">随机打乱位置</button>
        <button v-if="useMockPlayer" @click="changePayload" class="warn-btn">修改 Payload</button>
        <button @click="toggleCompact">切换紧凑模式</button>
        <button @click="resetLayout">重置</button>
      </div>
      <div class="action-btns">
        <button @click="testRefreshLayout">刷新布局</button>
        <button @click="testResolveAllItems">解析全部像素</button>
        <button @click="testGetItemPixelRect">获取id=1尺寸</button>
      </div>
      <div class="action-btns">
        <button @click="testSelectItem">切换选中</button>
        <button @click="testClearSelection">清空选中</button>
        <button @click="testHideItem">隐藏一个</button>
        <button @click="testShowAll">显示全部</button>
      </div>
      <div class="action-btns">
        <button @click="testBringToFront">置顶</button>
        <button @click="testSendToBack">置底</button>
        <button @click="testAddItem">新增</button>
        <button @click="testRemoveItem">删除最后</button>
        <button @click="testUpdateItem">更新第1个</button>
      </div>
      <div class="duration-control">
        <label>动画时长: {{ animationDuration }}ms</label>
        <input type="range" v-model.number="animationDuration" min="0" max="1000" step="50" />
      </div>
    </div>

    <div class="demo-main">
      <div class="layout-area">
        <FreeLayout
          ref="layoutRef"
          :items="items"
          :animation-duration="animationDuration"
          overflow="hidden"
          @item-click="handleItemClick"
          @item-double-click="handleItemDoubleClick"
          @item-contextmenu="handleItemContextMenu"
          @items-change="handleItemsChange"
          @selection-change="handleSelectionChange"
          @container-resize="handleContainerResize"
        >
          <template #default="{ item, index }">
            <!-- 播放器测试模式 -->
            <MockPlayer
              v-if="useMockPlayer"
              :id="item.id"
              :title="item.payload.title"
              :video-url="item.payload.videoUrl"
            />
            <!-- 普通布局模式 -->
            <div
              v-else
              class="demo-block"
              :style="{
                backgroundColor: item.payload.bgColor + '20',
                borderColor: item.payload.bgColor,
              }"
            >
              <div class="demo-block__title">{{ item.payload.title }}</div>
              <div class="demo-block__info">
                <span>x: {{ item.x }}</span>
                <span>y: {{ item.y }}</span>
                <span>w: {{ item.w }}</span>
                <span>h: {{ item.h }}</span>
              </div>
              <div class="demo-block__index">#{{ index + 1 }}</div>
            </div>
          </template>
        </FreeLayout>
      </div>

      <aside class="demo-sidebar">
        <h3>事件日志</h3>
        <div class="log-list">
          <div v-for="(log, i) in changeLog" :key="i" class="log-item">
            {{ log }}
          </div>
          <div v-if="changeLog.length === 0" class="log-empty">暂无事件</div>
        </div>
      </aside>
    </div>
  </div>
</template>

<style scoped>
.demo-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: #f5f5f5;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.demo-header {
  padding: 16px 24px;
  background: #fff;
  border-bottom: 1px solid #e8e8e8;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.demo-header h1 {
  margin: 0;
  font-size: 20px;
  color: #333;
}

.info {
  display: flex;
  gap: 20px;
  font-size: 14px;
  color: #666;
}

.demo-toolbar {
  padding: 12px 24px;
  background: #fff;
  border-bottom: 1px solid #e8e8e8;
  display: flex;
  gap: 24px;
  align-items: center;
  flex-wrap: wrap;
}

.preset-btns,
.action-btns {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

button {
  padding: 6px 14px;
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  background: #fff;
  cursor: pointer;
  font-size: 13px;
  transition: all 0.2s;
}

button:hover {
  border-color: #1890ff;
  color: #1890ff;
}

button.active {
  background: #1890ff;
  border-color: #1890ff;
  color: #fff;
}

button.player-btn {
  background: #722ed1;
  border-color: #722ed1;
  color: #fff;
}

button.player-btn:hover {
  background: #9254de;
  border-color: #9254de;
}

button.warn-btn {
  background: #ff4d4f;
  border-color: #ff4d4f;
  color: #fff;
}

button.warn-btn:hover {
  background: #ff7875;
  border-color: #ff7875;
}

.duration-control {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 13px;
  color: #666;
}

.duration-control input[type='range'] {
  width: 120px;
}

.demo-main {
  flex: 1;
  display: flex;
  gap: 16px;
  padding: 16px 24px 24px;
  min-height: 0;
}

.layout-area {
  flex: 1;
  background: #fff;
  border-radius: 8px;
  border: 1px solid #e8e8e8;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.layout-area > :deep(.free-layout) {
  height: 100%;
}

.demo-sidebar {
  width: 280px;
  background: #fff;
  border-radius: 8px;
  border: 1px solid #e8e8e8;
  padding: 16px;
  display: flex;
  flex-direction: column;
}

.demo-sidebar h3 {
  margin: 0 0 12px 0;
  font-size: 15px;
  color: #333;
}

.log-list {
  flex: 1;
  overflow-y: auto;
  font-size: 12px;
  color: #666;
  line-height: 1.8;
}

.log-item {
  padding: 4px 8px;
  border-bottom: 1px solid #f0f0f0;
}

.log-empty {
  color: #999;
  text-align: center;
  padding: 20px 0;
}

.demo-block {
  width: 100%;
  height: 100%;
  border: 2px solid;
  border-radius: 8px;
  padding: 10px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  cursor: pointer;
  transition: box-shadow 0.2s, transform 0.2s;
  background: rgba(255, 255, 255, 0.6);
}

.demo-block:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transform: translateY(-2px);
}

.demo-block__title {
  font-weight: 600;
  font-size: 14px;
  color: #333;
}

.demo-block__info {
  display: flex;
  flex-direction: column;
  gap: 2px;
  font-size: 11px;
  color: #666;
  font-family: monospace;
}

.demo-block__index {
  font-size: 24px;
  font-weight: bold;
  opacity: 0.2;
  text-align: right;
}
</style>
