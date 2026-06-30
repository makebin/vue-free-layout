<script setup lang="ts">
import { ref, watch, computed, onMounted } from 'vue'
import { useFreeLayout } from './useFreeLayout'
import type { LayoutItem, FreeLayoutOptions, LayoutItemPartial } from './types'

interface Props<TPayload = any> {
  items: LayoutItem<TPayload>[]
  animationDuration?: number
  animationEasing?: string
  roundPixel?: boolean
  overflow?: 'hidden' | 'auto' | 'visible' | 'scroll'
  multiSelect?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  animationDuration: 300,
  animationEasing: 'cubic-bezier(0.4, 0, 0.2, 1)',
  roundPixel: false,
  overflow: 'hidden',
  multiSelect: false,
})

const emit = defineEmits<{
  'item-click': [item: LayoutItem, index: number]
  'item-double-click': [item: LayoutItem, index: number]
  'item-contextmenu': [item: LayoutItem, index: number, event: MouseEvent]
  'item-mouseenter': [item: LayoutItem, index: number]
  'item-mouseleave': [item: LayoutItem, index: number]
  'items-change': [changedItems: LayoutItem[]]
  'selection-change': [selectedItems: LayoutItem[]]
  'container-resize': [size: { width: number; height: number }]
  'ready': []
}>()

const itemsRef = computed(() => props.items)

const options: FreeLayoutOptions = {
  animationDuration: props.animationDuration,
  animationEasing: props.animationEasing,
  roundPixel: props.roundPixel,
  multiSelect: props.multiSelect,
}

const {
  containerRef,
  containerSize,
  itemStyles,
  findChangedItems,
  refreshLayout,
  resolveItem,
  resolveAllItems,
  getItemById,
  getItemIndex,
  getItemPixelRect,
  updateItem,
  addItem,
  removeItem,
  clearAll,
  selectItem,
  deselectItem,
  toggleSelect,
  clearSelection,
  getSelectedItems,
  showItem,
  hideItem,
  toggleVisibility,
  getVisibleItems,
  setZIndex,
  bringToFront,
  sendToBack,
  moveForward,
  moveBackward,
} = useFreeLayout(itemsRef, options)

let prevItemsSnapshot = ''
let prevSelectedIds: (string | number)[] = []

function getSelectedIds() {
  return props.items.filter((i) => i.selected).map((i) => i.id)
}

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

    const newSelectedIds = getSelectedIds()
    if (JSON.stringify(newSelectedIds) !== JSON.stringify(prevSelectedIds)) {
      prevSelectedIds = newSelectedIds
      emit('selection-change', newItems.filter((i) => i.selected))
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

onMounted(() => {
  emit('ready')
})

function handleItemClick(item: LayoutItem, index: number) {
  if (item.locked) return
  emit('item-click', item, index)
}

function handleItemDoubleClick(item: LayoutItem, index: number) {
  if (item.locked) return
  emit('item-double-click', item, index)
}

function handleItemContextMenu(item: LayoutItem, index: number, e: MouseEvent) {
  if (item.locked) return
  emit('item-contextmenu', item, index, e)
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
  refreshLayout,
  resolveItem,
  resolveAllItems,
  getItemById,
  getItemIndex,
  getItemPixelRect,
  updateItem,
  addItem,
  removeItem,
  clearAll,
  selectItem,
  deselectItem,
  toggleSelect,
  clearSelection,
  getSelectedItems,
  showItem,
  hideItem,
  toggleVisibility,
  getVisibleItems,
  setZIndex,
  bringToFront,
  sendToBack,
  moveForward,
  moveBackward,
})
</script>

<template>
  <div ref="containerRef" class="free-layout" :style="{ overflow }">
    <div
      v-for="(item, index) in items"
      v-show="item.visible !== false"
      :key="item.id"
      class="free-layout__item"
      :class="{
        'is-selected': item.selected,
        'is-locked': item.locked,
      }"
      :style="itemStyles[index]"
      @click="handleItemClick(item, index)"
      @dblclick="handleItemDoubleClick(item, index)"
      @contextmenu.prevent="handleItemContextMenu(item, index, $event)"
      @mouseenter="handleItemMouseEnter(item, index)"
      @mouseleave="handleItemMouseLeave(item, index)"
    >
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
  cursor: default;
}

.free-layout__item.is-selected {
  box-shadow: 0 0 0 2px #409eff inset;
}

.free-layout__item.is-locked {
  cursor: not-allowed;
  user-select: none;
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
