# FreeLayout - Vue3 自由布局容器

一款高性能的 Vue3 自由布局组件，支持像素/百分比混合定位、流畅动画、ResizeObserver 自适应、v-memo 渲染优化，适用于仪表盘、视频监控、可视化大屏等场景。

## 特性

- **灵活定位**：x/y/w/h 支持像素值、百分比、`calc()` 表达式，混合使用
- **流畅动画**：基于 CSS `transform` 的 GPU 加速定位动画
- **自适应容器**：内置 ResizeObserver，容器尺寸变化时自动重新计算
- **渲染优化**：v-memo 优化，位置变化不会触发内部组件重渲染
- **TypeScript 支持**：完整的类型定义，泛型 payload 类型推断
- **Composable 设计**：核心逻辑抽离为 `useFreeLayout`，可独立复用
- **丰富事件**：支持点击、悬停、布局变动、容器尺寸变化等事件

## 安装

```bash
npm install vue-free-layout
# 或
pnpm add vue-free-layout
# 或
yarn add vue-free-layout
```

## 快速开始

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { FreeLayout } from 'vue-free-layout'
import type { LayoutItem } from 'vue-free-layout'

const items = ref<LayoutItem[]>([
  { id: 1, x: 20, y: 20, w: 300, h: 200, payload: { title: '区块1' } },
  { id: 2, x: '40%', y: 20, w: '55%', h: 200, payload: { title: '区块2' } },
])

function handleItemClick(item, index) {
  console.log('点击:', item.payload.title, index)
}
</script>

<template>
  <FreeLayout
    :items="items"
    @item-click="handleItemClick"
  >
    <template #default="{ item, index }">
      <div class="panel">
        <h3>{{ item.payload.title }}</h3>
        <p>序号: {{ index + 1 }}</p>
      </div>
    </template>
  </FreeLayout>
</template>

<style scoped>
.panel {
  width: 100%;
  height: 100%;
  background: #fff;
  border-radius: 8px;
  padding: 16px;
}
</style>
```

## API

### Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| items | `LayoutItem[]` | `[]` | 布局数据数组 |
| animationDuration | `number` | `300` | 动画时长（毫秒） |
| animationEasing | `string` | `cubic-bezier(0.4, 0, 0.2, 1)` | 动画缓动函数 |
| roundPixel | `boolean` | `false` | 是否对小数像素取整 |
| overflow | `'hidden' \| 'auto' \| 'visible' \| 'scroll'` | `'hidden'` | 容器溢出处理 |

### LayoutItem 数据结构

```ts
interface LayoutItem<TPayload = any> {
  id: string | number          // 唯一标识（必填，用于 v-for key）
  x: number | string          // 横坐标：数字=px，字符串如 '20%'
  y: number | string          // 纵坐标
  w: number | string          // 宽度
  h: number | string          // 高度
  zIndex?: number             // 层级，默认 1
  payload?: TPayload           // 业务数据，透传给插槽
  [key: string]: any          // 允许扩展任意字段
}

// 尺寸值示例
{ x: 20 }                    // 20px
{ x: '20%' }                 // 20% 容器宽度
{ x: 'calc(100% - 40px)' }   // calc 表达式
```

### Events

| 事件名 | 参数 | 说明 |
|--------|------|------|
| item-click | `(item: LayoutItem, index: number)` | 点击区块 |
| item-mouseenter | `(item: LayoutItem, index: number)` | 鼠标进入区块 |
| item-mouseleave | `(item: LayoutItem, index: number)` | 鼠标离开区块 |
| items-change | `(changedItems: LayoutItem[])` | 布局数据变动（返回变动的项） |
| container-resize | `(size: { width: number, height: number })` | 容器尺寸变化 |

### Slots

```vue
<FreeLayout :items="items">
  <!-- 作用域插槽，暴露 item、index、style -->
  <template #default="{ item, index, style }">
    <YourComponent
      :data="item.payload"
      :position="style"
    />
  </template>

  <!-- 空状态插槽 -->
  <template #empty>
    <div>暂无内容</div>
  </template>
</FreeLayout>
```

### Expose

```vue
const layoutRef = ref()

// 获取容器尺寸
const size = layoutRef.value.getContainerSize()
// { width: 800, height: 600 }
```

## 进阶用法

### 1. 混合单位定位

```ts
const items = [
  { id: 1, x: 20, y: 20, w: 200, h: 150 },           // 全像素
  { id: 2, x: '50%', y: 10, w: '45%', h: 200 },      // 全百分比
  { id: 3, x: 'calc(100% - 220px)', y: 20, w: 200, h: 150 }, // calc
]
```

### 2. 带视频播放器等复杂组件

```vue
<FreeLayout :items="items">
  <template #default="{ item }">
    <VideoPlayer
      :key="item.id"
      :url="item.payload.videoUrl"
      :autoplay="item.payload.autoplay"
    />
  </template>
</FreeLayout>
```

> 由于 v-memo 优化，位置变化时内部组件不会重新渲染，只有 payload 变化才会触发更新。

### 3. 动态切换布局

```vue
<script setup lang="ts">
import { ref } from 'vue'

const layouts = {
  grid: [
    { id: 1, x: '2%', y: '2%', w: '47%', h: '47%' },
    { id: 2, x: '51%', y: '2%', w: '47%', h: '47%' },
  ],
  hero: [
    { id: 1, x: '2%', y: '2%', w: '60%', h: '96%' },
  ],
}

const currentLayout = ref('grid')

function switchLayout(name) {
  items.value = layouts[name]
}
</script>

<template>
  <button @click="switchLayout('hero')">切换到 Hero 布局</button>
  <FreeLayout :items="items" />
</template>
```

### 4. 使用 useFreeLayout Composable

如果只需要布局计算逻辑，不使用组件：

```ts
import { useFreeLayout } from 'vue-free-layout'

const itemsRef = ref([...])
const { containerRef, containerSize, itemStyles } = useFreeLayout(itemsRef, {
  animationDuration: 300,
})

// containerRef 绑定到容器元素
// containerSize 响应式容器尺寸
// itemStyles 计算后的样式数组
```

## 性能优化

### v-memo 优化

组件内部使用 `v-memo` 分离了定位样式和内容渲染：

```
位置变化 → CSS transform → 内部组件不重渲染 ✅
payload 变化 → 触发内容重新渲染
```

### transform 动画

位置动画使用 `transform: translate()` 实现，GPU 加速，性能是 `left/top` 的 3~5 倍。

### will-change 优化

```css
.free-layout__item {
  will-change: transform;
}
```

## 注意事项

1. **容器高度**：父容器必须指定明确的高度，否则绝对定位的子元素会不可见
2. **key 必须唯一**：`items` 中的 `id` 字段必须唯一
3. **动画性能**：位置动画推荐使用 transform，尺寸动画使用 width/height
4. **移动端**：移动端浏览器对 `calc()` 支持良好，但注意小数像素渲染

## 常见布局模板

### 四宫格

```ts
[
  { id: 1, x: '2%', y: '2%', w: '47%', h: '47%' },
  { id: 2, x: '51%', y: '2%', w: '47%', h: '47%' },
  { id: 3, x: '2%', y: '51%', w: '47%', h: '47%' },
  { id: 4, x: '51%', y: '51%', w: '47%', h: '47%' },
]
```

### 九宫格

```ts
const gap = 2
const cell = (100 - gap * 4) / 3
Array.from({ length: 9 }, (_, i) => ({
  id: i + 1,
  x: `${gap + (i % 3) * (cell + gap)}%`,
  y: `${gap + Math.floor(i / 3) * (cell + gap)}%`,
  w: `${cell}%`,
  h: `${cell}%`,
}))
```

### 左 C 位 + 右 8 小

```ts
[
  { id: 1, x: '2%', y: '2%', w: '47%', h: '96%' },  // 左侧大区块
  ...Array.from({ length: 8 }, (_, i) => ({
    id: i + 2,
    x: `${51 + (i % 4) * 12}%`,
    y: `${2 + Math.floor(i / 4) * 49}%`,
    w: '11%',
    h: '47%',
  })),
]
```

## 开发

```bash
# 安装依赖
npm install

# 启动演示
npm run dev

# 构建
npm run build
```

## License

MIT
