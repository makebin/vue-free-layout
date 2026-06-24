<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { useFreeLayout } from './useFreeLayout'
import type { LayoutItem, FreeLayoutOptions } from './types'

interface Props<TPayload = any> {
  items: LayoutItem<TPayload>[]
  animationDuration?: number
  animationEasing?: string
  roundPixel?: boolean
  overflow?: 'hidden' | 'auto' | 'visible' | 'scroll'
}

const props = withDefaults(defineProps<Props>(), {
  animationDuration: 300,
  animationEasing: 'cubic-bezier(0.4, 0, 0.2, 1)',
  roundPixel: false,
  overflow: 'hidden',
})

const emit = defineEmits<{
  'item-click': [item: LayoutItem, index: number]
  'item-mouseenter': [item: LayoutItem, index: number]
  'item-mouseleave': [item: LayoutItem, index: number]
  'items-change': [changedItems: LayoutItem[]]
  'container-resize': [size: { width: number; height: number }]
}>()

const itemsRef = computed(() => props.items)

const options: FreeLayoutOptions = {
  animationDuration: props.animationDuration,
  animationEasing: props.animationEasing,
  roundPixel: props.roundPixel,
}

const { containerRef, containerSize, itemStyles, findChangedItems } = useFreeLayout(itemsRef, options)

let prevItemsSnapshot = ''

watch(
  () => props.items,
  (newItems, oldItems) => {
    const newSnapshot = JSON.stringify(newItems)
    if (newSnapshot === prevItemsSnapshot) return

    if (oldItems && oldItems.length > 0) {
      const changed = findChangedItems(newItems, oldItems)
      if (changed.length > 0) {
        emit('items-change', changed)
      }
    }

    prevItemsSnapshot = newSnapshot
  },
  { deep: true }
)

watch(
  containerSize,
  (size) => {
    if (size.width > 0 && size.height > 0) {
      emit('container-resize', { width: size.width, height: size.height })
    }
  }
)

function handleItemClick(item: LayoutItem, index: number) {
  emit('item-click', item, index)
}

function handleItemMouseEnter(item: LayoutItem, index: number) {
  emit('item-mouseenter', item, index)
}

function handleItemMouseLeave(item: LayoutItem, index: number) {
  emit('item-mouseleave', item, index)
}

defineExpose({
  containerSize,
  getContainerSize: () => ({ width: containerSize.width, height: containerSize.height }),
})
</script>

<template>
  <div ref="containerRef" class="free-layout" :style="{ overflow }">
    <!-- 外层：只负责定位样式，变化时不触发内部组件重渲染 -->
    <div
      v-for="(item, index) in items"
      :key="item.id"
      class="free-layout__item"
      :style="itemStyles[index]"
      @click="handleItemClick(item, index)"
      @mouseenter="handleItemMouseEnter(item, index)"
      @mouseleave="handleItemMouseLeave(item, index)"
    >
      <!-- 内层：用 v-memo 跳过不必要的渲染，只有 payload 变化才更新 -->
      <div
        v-memo="[item.id, item.payload]"
        class="free-layout__content"
      >
        <slot :item="item" :index="index" :style="itemStyles[index]" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.free-layout {
  position: relative;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
}

.free-layout__item {
  position: absolute;
  box-sizing: border-box;
  will-change: transform;
}

.free-layout__content {
  width: 100%;
  height: 100%;
}

@media (prefers-reduced-motion: reduce) {
  .free-layout__item {
    transition: none !important;
  }
}
</style>
