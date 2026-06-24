import type { LayoutItem } from '../types'

interface DemoPayload {
  title: string
  bgColor: string
}

type LayoutGenerator = () => LayoutItem<DemoPayload>[]

const colors = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4',
  '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F',
  '#BB8FCE', '#85C1E9', '#F8B500', '#00CED1',
]

function makeItem(
  id: number,
  x: string,
  y: string,
  w: string,
  h: string,
  title: string
): LayoutItem<DemoPayload> {
  return {
    id,
    x,
    y,
    w,
    h,
    zIndex: 1,
    payload: {
      title,
      bgColor: colors[(id - 1) % colors.length],
    },
  }
}

export const layoutPresets: { name: string; label: string; generate: LayoutGenerator }[] = [
  {
    name: 'grid4',
    label: '四宫格',
    generate: () => [
      makeItem(1, '2%', '2%', '47%', '47%', '区块 1'),
      makeItem(2, '51%', '2%', '47%', '47%', '区块 2'),
      makeItem(3, '2%', '51%', '47%', '47%', '区块 3'),
      makeItem(4, '51%', '51%', '47%', '47%', '区块 4'),
    ],
  },
  {
    name: 'grid6',
    label: '六宫格',
    generate: () => [
      makeItem(1, '2%', '2%', '30.67%', '47%', '区块 1'),
      makeItem(2, '34.67%', '2%', '30.67%', '47%', '区块 2'),
      makeItem(3, '67.33%', '2%', '30.67%', '47%', '区块 3'),
      makeItem(4, '2%', '51%', '30.67%', '47%', '区块 4'),
      makeItem(5, '34.67%', '51%', '30.67%', '47%', '区块 5'),
      makeItem(6, '67.33%', '51%', '30.67%', '47%', '区块 6'),
    ],
  },
  {
    name: 'grid9',
    label: '九宫格',
    generate: () => {
      const items: LayoutItem<DemoPayload>[] = []
      const gap = 2
      const cellW = (100 - gap * 4) / 3
      const cellH = (100 - gap * 4) / 3
      for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 3; col++) {
          const idx = row * 3 + col + 1
          items.push(
            makeItem(
              idx,
              `${gap + col * (cellW + gap)}%`,
              `${gap + row * (cellH + gap)}%`,
              `${cellW}%`,
              `${cellH}%`,
              `区块 ${idx}`
            )
          )
        }
      }
      return items
    },
  },
  {
    name: 'leftRight',
    label: '左右布局',
    generate: () => [
      makeItem(1, '2%', '2%', '47%', '96%', '左侧区域'),
      makeItem(2, '51%', '2%', '47%', '30%', '右上'),
      makeItem(3, '51%', '34%', '47%', '30%', '右中'),
      makeItem(4, '51%', '66%', '47%', '32%', '右下'),
    ],
  },
  {
    name: 'heroRight8',
    label: '左C位+右8小',
    generate: () => {
      const items: LayoutItem<DemoPayload>[] = []
      items.push(makeItem(1, '2%', '2%', '47%', '96%', 'C位主区块'))
      const startX = 51
      const cellW = (47 - 6) / 4
      const cellH = (96 - 6) / 2
      for (let row = 0; row < 2; row++) {
        for (let col = 0; col < 4; col++) {
          const idx = row * 4 + col + 2
          items.push(
            makeItem(
              idx,
              `${startX + col * (cellW + 2)}%`,
              `${2 + row * (cellH + 2)}%`,
              `${cellW}%`,
              `${cellH}%`,
              `小 ${idx - 1}`
            )
          )
        }
      }
      return items
    },
  },
  {
    name: 'mixed',
    label: '混合像素+百分比',
    generate: () => [
      makeItem(1, 20, 20, 200, 150, '固定像素'),
      makeItem(2, 'calc(100% - 220px)', 20, 200, 150, '右固定'),
      makeItem(3, 20, 190, '30%', 200, '左百分比'),
      makeItem(4, '35%', 190, '30%', 200, '中百分比'),
      makeItem(5, 'calc(100% - 30% - 20px)', 190, '30%', 200, '右百分比'),
      makeItem(6, 20, 'calc(100% - 120px)', 'calc(100% - 40px)', 100, '底部通栏'),
    ],
  },
  {
    name: 'dashboard',
    label: '仪表盘布局',
    generate: () => [
      makeItem(1, '2%', '2%', '22%', '28%', '指标卡 1'),
      makeItem(2, '26%', '2%', '22%', '28%', '指标卡 2'),
      makeItem(3, '50%', '2%', '22%', '28%', '指标卡 3'),
      makeItem(4, '74%', '2%', '24%', '28%', '指标卡 4'),
      makeItem(5, '2%', '32%', '60%', '36%', '主趋势图'),
      makeItem(6, '64%', '32%', '34%', '36%', '饼图'),
      makeItem(7, '2%', '70%', '40%', '28%', '柱状图'),
      makeItem(8, '44%', '70%', '54%', '28%', '数据列表'),
    ],
  },
  {
    name: 'single',
    label: '单元素居中',
    generate: () => [
      makeItem(1, '25%', '25%', '50%', '50%', '居中大卡片'),
    ],
  },
]
