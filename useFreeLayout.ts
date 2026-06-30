import { ref, reactive, computed, onMounted, onUnmounted, watch, type Ref } from 'vue'
import type { LayoutItem, LayoutItemStyle, ContainerSize, FreeLayoutOptions, SizeValue, LayoutItemPartial } from './types'

export function useFreeLayout<TPayload = any>(
  itemsRef: Ref<LayoutItem<TPayload>[]>,
  options: FreeLayoutOptions = {}
) {
  const {
    animationDuration = 300,
    animationEasing = 'cubic-bezier(0.4, 0, 0.2, 1)',
    roundPixel = false,
    multiSelect = false,
  } = options

  const containerRef = ref<HTMLElement | null>(null)
  const containerSize = reactive<ContainerSize>({ width: 0, height: 0 })
  let resizeObserver: ResizeObserver | null = null

  function toPixel(val: SizeValue, base: number): number {
    if (val == null) return 0
    let result: number
    if (typeof val === 'number') {
      result = val
    } else if (val.endsWith('%')) {
      result = (parseFloat(val) / 100) * base
    } else {
      const parsed = parseFloat(val)
      result = isNaN(parsed) ? 0 : parsed
    }
    return roundPixel ? Math.round(result) : result
  }

  function normalizeSize(val: SizeValue): string {
    if (val == null) return '0px'
    if (typeof val === 'number') return `${val}px`
    return val
  }

  const itemStyles = computed<LayoutItemStyle[]>(() => {
    const items = itemsRef.value || []
    const { width: cw, height: ch } = containerSize

    return items.map((item) => {
      const px = cw > 0 ? toPixel(item.x, cw) : 0
      const py = ch > 0 ? toPixel(item.y, ch) : 0
      const pw = cw > 0 ? toPixel(item.w, cw) : 0
      const ph = ch > 0 ? toPixel(item.h, ch) : 0

      return {
        position: 'absolute' as const,
        left: '0px',
        top: '0px',
        width: `${pw}px`,
        height: `${ph}px`,
        transform: `translate(${px}px, ${py}px)`,
        zIndex: item.zIndex ?? 1,
        transition: `transform ${animationDuration}ms ${animationEasing}, width ${animationDuration}ms ease, height ${animationDuration}ms ease`,
      }
    })
  })

  function updateContainerSize() {
    if (!containerRef.value) return
    const rect = containerRef.value.getBoundingClientRect()
    containerSize.width = rect.width
    containerSize.height = rect.height
  }

  function setupResizeObserver() {
    if (!containerRef.value) return
    resizeObserver = new ResizeObserver(() => {
      updateContainerSize()
    })
    resizeObserver.observe(containerRef.value)
  }

  function teardownResizeObserver() {
    if (resizeObserver) {
      resizeObserver.disconnect()
      resizeObserver = null
    }
  }

  onMounted(() => {
    updateContainerSize()
    setupResizeObserver()
  })

  onUnmounted(() => {
    teardownResizeObserver()
  })

  watch(
    containerSize,
    (newSize) => {
      // 容器尺寸变化时，itemStyles 会自动重新计算（computed 依赖 containerSize）
    }
  )

  function findChangedItems(
    newItems: LayoutItem<TPayload>[],
    oldItems: LayoutItem<TPayload>[]
  ): LayoutItem<TPayload>[] {
    const oldMap = new Map(oldItems.map((item) => [item.id, item]))
    return newItems.filter((item) => {
      const old = oldMap.get(item.id)
      if (!old) return true
      return (
        item.x !== old.x ||
        item.y !== old.y ||
        item.w !== old.w ||
        item.h !== old.h ||
        item.zIndex !== old.zIndex
      )
    })
  }

  function refreshLayout() {
    updateContainerSize()
  }

  function resolveItem(item: LayoutItem<TPayload>): { x: number; y: number; w: number; h: number } {
    const { width: cw, height: ch } = containerSize
    return {
      x: cw > 0 ? toPixel(item.x, cw) : 0,
      y: ch > 0 ? toPixel(item.y, ch) : 0,
      w: cw > 0 ? toPixel(item.w, cw) : 0,
      h: ch > 0 ? toPixel(item.h, ch) : 0,
    }
  }

  function resolveAllItems(): Array<LayoutItem<TPayload> & { pixelX: number; pixelY: number; pixelW: number; pixelH: number }> {
    const items = itemsRef.value || []
    return items.map((item) => {
      const resolved = resolveItem(item)
      return {
        ...item,
        pixelX: resolved.x,
        pixelY: resolved.y,
        pixelW: resolved.w,
        pixelH: resolved.h,
      }
    })
  }

  function getItemById(id: string | number): LayoutItem<TPayload> | undefined {
    return (itemsRef.value || []).find((item) => item.id === id)
  }

  function getItemIndex(id: string | number): number {
    return (itemsRef.value || []).findIndex((item) => item.id === id)
  }

  function getItemPixelRect(id: string | number): { x: number; y: number; w: number; h: number } | null {
    const item = getItemById(id)
    if (!item) return null
    return resolveItem(item)
  }

  function updateItem(id: string | number, updates: LayoutItemPartial): boolean {
    const items = itemsRef.value || []
    const idx = getItemIndex(id)
    if (idx === -1) return false
    items[idx] = { ...items[idx], ...updates }
    return true
  }

  function addItem(item: LayoutItem<TPayload>): number {
    const items = itemsRef.value || []
    items.push(item)
    return items.length - 1
  }

  function removeItem(id: string | number): boolean {
    const items = itemsRef.value || []
    const idx = getItemIndex(id)
    if (idx === -1) return false
    items.splice(idx, 1)
    return true
  }

  function clearAll() {
    if (itemsRef.value) {
      itemsRef.value = []
    }
  }

  function selectItem(id: string | number): boolean {
    if (multiSelect) {
      return updateItem(id, { selected: true })
    }
    const items = itemsRef.value || []
    let found = false
    items.forEach((item) => {
      if (item.id === id) {
        item.selected = true
        found = true
      } else {
        item.selected = false
      }
    })
    return found
  }

  function deselectItem(id: string | number): boolean {
    return updateItem(id, { selected: false })
  }

  function toggleSelect(id: string | number): boolean {
    const item = getItemById(id)
    if (!item) return false
    if (item.selected) {
      return deselectItem(id)
    } else {
      return selectItem(id)
    }
  }

  function clearSelection() {
    const items = itemsRef.value || []
    items.forEach((item) => {
      item.selected = false
    })
  }

  function getSelectedItems(): LayoutItem<TPayload>[] {
    return (itemsRef.value || []).filter((item) => item.selected)
  }

  function showItem(id: string | number): boolean {
    return updateItem(id, { visible: true })
  }

  function hideItem(id: string | number): boolean {
    return updateItem(id, { visible: false })
  }

  function toggleVisibility(id: string | number): boolean {
    const item = getItemById(id)
    if (!item) return false
    return updateItem(id, { visible: item.visible === false })
  }

  function getVisibleItems(): LayoutItem<TPayload>[] {
    return (itemsRef.value || []).filter((item) => item.visible !== false)
  }

  function setZIndex(id: string | number, zIndex: number): boolean {
    return updateItem(id, { zIndex })
  }

  function bringToFront(id: string | number): boolean {
    const items = itemsRef.value || []
    const maxZ = Math.max(...items.map((i) => i.zIndex ?? 1))
    return updateItem(id, { zIndex: maxZ + 1 })
  }

  function sendToBack(id: string | number): boolean {
    const items = itemsRef.value || []
    const minZ = Math.min(...items.map((i) => i.zIndex ?? 1))
    return updateItem(id, { zIndex: minZ - 1 })
  }

  function moveForward(id: string | number): boolean {
    const item = getItemById(id)
    if (!item) return false
    return updateItem(id, { zIndex: (item.zIndex ?? 1) + 1 })
  }

  function moveBackward(id: string | number): boolean {
    const item = getItemById(id)
    if (!item) return false
    return updateItem(id, { zIndex: Math.max(1, (item.zIndex ?? 1) - 1) })
  }

  return {
    containerRef,
    containerSize,
    itemStyles,
    toPixel,
    normalizeSize,
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
  }
}
