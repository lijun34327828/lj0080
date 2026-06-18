import type { TextStyleConfig } from '../../../shared/types'
import { applyTextStyle } from '../../utils/formatters'
import { cn } from '../../lib/utils'

const PRESET_COLORS = [
  '#EF4444',
  '#F59E0B',
  '#10B981',
  '#3B82F6',
  '#6366F1',
  '#EC4899',
]

const FONT_WEIGHTS: Array<{ value: TextStyleConfig['fontWeight']; label: string }> = [
  { value: 400, label: '常规' },
  { value: 500, label: '中等' },
  { value: 700, label: '加粗' },
  { value: 900, label: '黑粗' },
]

interface TextStyleEditorProps {
  style: TextStyleConfig
  onChange: (patch: Partial<TextStyleConfig>) => void
}

export default function TextStyleEditor({ style, onChange }: TextStyleEditorProps) {
  return (
    <div className="space-y-5 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center gap-2">
        <div className="h-4 w-1 rounded-full bg-indigo-500" />
        <h3 className="text-sm font-semibold text-slate-800">文字样式</h3>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-medium text-slate-600">字号</label>
          <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-700 tabular-nums">
            {style.fontSize}px
          </span>
        </div>
        <input
          type="range"
          min={12}
          max={28}
          step={1}
          value={style.fontSize}
          onChange={(e) => onChange({ fontSize: Number(e.target.value) })}
          className="h-2 w-full cursor-pointer appearance-none rounded-full bg-slate-200 accent-indigo-500"
        />
      </div>

      <div className="space-y-3">
        <label className="block text-xs font-medium text-slate-600">颜色</label>
        <div className="flex flex-wrap items-center gap-2">
          {PRESET_COLORS.map((color) => (
            <button
              key={color}
              type="button"
              onClick={() => onChange({ color })}
              className={cn(
                'h-7 w-7 rounded-full border-2 transition-transform hover:scale-110',
                style.color.toLowerCase() === color.toLowerCase()
                  ? 'border-slate-800 scale-110 shadow-md'
                  : 'border-white shadow'
              )}
              style={{ backgroundColor: color }}
              aria-label={`颜色 ${color}`}
            />
          ))}
          <label className="relative h-7 w-7 cursor-pointer overflow-hidden rounded-full border-2 border-dashed border-slate-300 bg-slate-50 transition-colors hover:border-slate-400">
            <input
              type="color"
              value={style.color}
              onChange={(e) => onChange({ color: e.target.value })}
              className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
            />
            <span className="flex h-full w-full items-center justify-center text-xs text-slate-400">
              +
            </span>
          </label>
        </div>
      </div>

      <div className="space-y-3">
        <label className="block text-xs font-medium text-slate-600">字重</label>
        <div className="grid grid-cols-4 gap-2">
          {FONT_WEIGHTS.map((fw) => (
            <button
              key={fw.value}
              type="button"
              onClick={() => onChange({ fontWeight: fw.value })}
              className={cn(
                'rounded-md border px-2 py-1.5 text-xs transition-all',
                style.fontWeight === fw.value
                  ? 'border-indigo-500 bg-indigo-50 text-indigo-700 shadow-sm'
                  : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
              )}
              style={{ fontWeight: fw.value }}
            >
              {fw.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <ToggleSwitch
          label="下划线"
          active={style.underline}
          onToggle={() => onChange({ underline: !style.underline })}
        />
        <ToggleSwitch
          label="删除线"
          active={style.strikethrough}
          onToggle={() => onChange({ strikethrough: !style.strikethrough })}
        />
        <ToggleSwitch
          label="发光"
          active={style.glow}
          onToggle={() => onChange({ glow: !style.glow })}
        />
      </div>

      <div className="rounded-lg border border-slate-200 bg-gradient-to-br from-slate-50 to-slate-100 p-4">
        <p className="mb-2 text-[10px] font-medium uppercase tracking-wider text-slate-400">
          实时预览
        </p>
        <p style={applyTextStyle(style)} className="break-words text-center leading-relaxed">
          {style.glow ? '✨ ' : ''}
          限时优惠 · 超值福利
          {style.glow ? ' ✨' : ''}
        </p>
      </div>
    </div>
  )
}

function ToggleSwitch({
  label,
  active,
  onToggle,
}: {
  label: string
  active: boolean
  onToggle: () => void
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={cn(
        'flex flex-col items-center gap-1.5 rounded-md border px-2 py-2 text-xs transition-all',
        active
          ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
          : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300'
      )}
    >
      <span
        className={cn(
          'relative h-4 w-7 rounded-full transition-colors',
          active ? 'bg-indigo-500' : 'bg-slate-300'
        )}
      >
        <span
          className={cn(
            'absolute top-0.5 h-3 w-3 rounded-full bg-white shadow transition-transform',
            active ? 'translate-x-3.5' : 'translate-x-0.5'
          )}
        />
      </span>
      <span className="font-medium">{label}</span>
    </button>
  )
}
