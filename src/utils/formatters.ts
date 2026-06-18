
import type { PackageType, TextStyleConfig } from '../../shared/types'

export const formatCurrency = (value: number): string => {
  return `¥${value.toFixed(2)}`
}

export const formatHours = (hours: number): string => {
  if (hours < 24) return `${hours} 小时`
  const days = Math.floor(hours / 24)
  const remain = hours % 24
  if (remain === 0) return `${days} 天`
  return `${days}天${remain}小时`
}

export const packageTypeMeta: Record<PackageType, { label: string; description: string; shortLabel: string }> = {
  hourly: {
    label: '小时套餐',
    shortLabel: '小时',
    description: '按小时计费的灵活短租方案',
  },
  daily: {
    label: '全天套餐',
    shortLabel: '全天',
    description: '按自然日计费，覆盖当日营业时间',
  },
  monthly: {
    label: '月度套餐',
    shortLabel: '月度',
    description: '包月畅学卡，高频用户首选',
  },
}

export const applyTextStyle = (style: TextStyleConfig): React.CSSProperties => {
  const css: React.CSSProperties = {
    fontSize: `${style.fontSize}px`,
    color: style.color,
    fontWeight: style.fontWeight,
  }
  const decorations: string[] = []
  if (style.underline) decorations.push('underline')
  if (style.strikethrough) decorations.push('line-through')
  if (decorations.length > 0) {
    css.textDecoration = decorations.join(' ')
  }
  if (style.glow) {
    css.textShadow = `0 0 14px ${style.color}99, 0 0 28px ${style.color}66`
  }
  return css
}

export const uid = (): string => Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4)
