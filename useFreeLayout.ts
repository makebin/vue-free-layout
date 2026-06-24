import { ref, reactive, computed, onMounted, onUnmounted, watch, type Ref } from 'vue'
import type { LayoutItem, LayoutItemStyle, ContainerSize, FreeLayoutOptions, SizeValue } from './types'

export function useFreeLayout<TPayload = any>(
  itemsRef: Ref<LayoutItem<TPayload>[]>,
  options: FreeLayoutOptions = {}
) {
  const {
    animationDuration = 300,
    animationEasing = 'cubic-bezier(0.4, 0, 0.2, 1)',
    roundPixel = false,
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

  return {
    containerRef,
    containerSize,
    itemStyles,
    toPixel,
    normalizeSize,
    findChangedItems,
  }
}
