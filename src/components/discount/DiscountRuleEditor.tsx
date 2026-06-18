import type { DiscountRule } from '../../../shared/types'
import { Trash2, Plus, Minus } from 'lucide-react'
import { cn } from '../../lib/utils'

const TYPE_META: Record<DiscountRule['type'], { label: string; color: string; bg: string }> = {
  tier: { label: '阶梯折扣', color: 'text-amber-700', bg: 'bg-amber-50 border-amber-200' },
  bulk: { label: '满减优惠', color: 'text-emerald-700', bg: 'bg-emerald-50 border-emerald-200' },
  'time-slot': { label: '时段特惠', color: 'text-sky-700', bg: 'bg-sky-50 border-sky-200' },
}

interface DiscountRuleEditorProps {
  rule: DiscountRule
  onChange: (patch: Partial<DiscountRule>) => void
  onDelete: () => void
}

export default function DiscountRuleEditor({ rule, onChange, onDelete }: DiscountRuleEditorProps) {
  const meta = TYPE_META[rule.type]

  return (
    <div className={cn('space-y-4 rounded-xl border bg-white p-4 shadow-sm', meta.bg)}>
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <span
            className={cn(
              'shrink-0 rounded-md border px-2 py-0.5 text-[11px] font-semibold',
              meta.color,
              meta.bg
            )}
          >
            {meta.label}
          </span>
          <input
            type="text"
            value={rule.name}
            onChange={(e) => onChange({ name: e.target.value })}
            className="min-w-0 flex-1 rounded-md border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-800 placeholder-slate-400 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
            placeholder="规则名称"
          />
        </div>
        <button
          type="button"
          onClick={onDelete}
          className="shrink-0 rounded-md border border-rose-200 bg-white p-1.5 text-rose-500 transition-all hover:bg-rose-50 hover:border-rose-300 hover:text-rose-600"
          aria-label="删除规则"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      {rule.type === 'tier' && <TierEditor rule={rule} onChange={onChange} />}
      {rule.type === 'bulk' && <BulkEditor rule={rule} onChange={onChange} />}
      {rule.type === 'time-slot' && <TimeSlotEditor rule={rule} onChange={onChange} />}
    </div>
  )
}

function TierEditor({
  rule,
  onChange,
}: {
  rule: DiscountRule
  onChange: (patch: Partial<DiscountRule>) => void
}) {
  const tiers = rule.tiers ?? []

  const updateTier = (index: number, patch: { threshold?: number; rate?: number }) => {
    const next = tiers.map((t, i) => (i === index ? { ...t, ...patch } : t))
    onChange({ tiers: next })
  }

  const addTier = () => {
    const lastThreshold = tiers.length > 0 ? tiers[tiers.length - 1].threshold : 0
    const newThreshold = lastThreshold + 2
    onChange({ tiers: [...tiers, { threshold: newThreshold, rate: 0.9 }] })
  }

  const removeTier = (index: number) => {
    if (tiers.length <= 1) return
    onChange({ tiers: tiers.filter((_, i) => i !== index) })
  }

  return (
    <div className="space-y-3">
      <p className="text-[11px] font-medium text-slate-500">
        达到指定时长后按折扣率计算，阶梯按阈值升序生效
      </p>
      <div className="space-y-2">
        {tiers.map((tier, i) => (
          <div
            key={i}
            className="grid grid-cols-[auto_1fr_1fr_auto] items-center gap-2 rounded-lg border border-slate-200 bg-white p-2.5"
          >
            <span className="text-[11px] font-bold text-slate-400 tabular-nums w-6 text-center">
              #{i + 1}
            </span>
            <div className="space-y-1">
              <label className="text-[10px] font-medium text-slate-500">阈值(小时)</label>
              <NumberField
                value={tier.threshold}
                min={0}
                step={1}
                onChange={(v) => updateTier(i, { threshold: v })}
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-medium text-slate-500">折扣率(0~1)</label>
              <NumberField
                value={tier.rate}
                min={0}
                max={1}
                step={0.05}
                onChange={(v) => updateTier(i, { rate: v })}
                suffix={`×${tier.rate.toFixed(2)}`}
              />
            </div>
            <button
              type="button"
              onClick={() => removeTier(i)}
              disabled={tiers.length <= 1}
              className={cn(
                'mt-5 rounded-md border p-1.5 transition-all',
                tiers.length <= 1
                  ? 'border-slate-100 bg-slate-50 text-slate-300 cursor-not-allowed'
                  : 'border-slate-200 bg-white text-slate-500 hover:bg-rose-50 hover:border-rose-200 hover:text-rose-500'
              )}
              aria-label="删除阶梯"
            >
              <Minus className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={addTier}
        className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-dashed border-slate-300 bg-white py-2 text-xs font-medium text-slate-600 transition-all hover:border-amber-400 hover:bg-amber-50 hover:text-amber-700"
      >
        <Plus className="h-3.5 w-3.5" />
        添加阶梯
      </button>
    </div>
  )
}

function BulkEditor({
  rule,
  onChange,
}: {
  rule: DiscountRule
  onChange: (patch: Partial<DiscountRule>) => void
}) {
  return (
    <div className="grid grid-cols-2 gap-3 rounded-lg border border-slate-200 bg-white p-3">
      <div className="space-y-1.5">
        <label className="text-[11px] font-medium text-slate-600">满减阈值(元)</label>
        <NumberField
          value={rule.bulkThreshold ?? 0}
          min={0}
          step={10}
          onChange={(v) => onChange({ bulkThreshold: v })}
          prefix="¥"
        />
        <p className="text-[10px] text-slate-400">订单金额达标后生效</p>
      </div>
      <div className="space-y-1.5">
        <label className="text-[11px] font-medium text-slate-600">满减金额(元)</label>
        <NumberField
          value={rule.bulkDiscount ?? 0}
          min={0}
          step={5}
          onChange={(v) => onChange({ bulkDiscount: v })}
          prefix="-¥"
        />
        <p className="text-[10px] text-slate-400">达标后直接减免</p>
      </div>
    </div>
  )
}

function TimeSlotEditor({
  rule,
  onChange,
}: {
  rule: DiscountRule
  onChange: (patch: Partial<DiscountRule>) => void
}) {
  const rate = rule.slotRate ?? 0.85

  return (
    <div className="space-y-3 rounded-lg border border-slate-200 bg-white p-3">
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <label className="text-[11px] font-medium text-slate-600">开始时间</label>
          <NumberField
            value={rule.slotStartHour ?? 0}
            min={0}
            max={23}
            step={1}
            onChange={(v) => onChange({ slotStartHour: v })}
            suffix="时"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-[11px] font-medium text-slate-600">结束时间</label>
          <NumberField
            value={rule.slotEndHour ?? 0}
            min={0}
            max={24}
            step={1}
            onChange={(v) => onChange({ slotEndHour: v })}
            suffix="时"
          />
        </div>
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-[11px] font-medium text-slate-600">时段折扣率</label>
          <span className="rounded-md bg-sky-50 px-2 py-0.5 text-[11px] font-semibold text-sky-700 tabular-nums">
            {rate.toFixed(2)} ({Math.round(rate * 100)}%)
          </span>
        </div>
        <input
          type="range"
          min={0.3}
          max={1.0}
          step={0.05}
          value={rate}
          onChange={(e) => onChange({ slotRate: Number(e.target.value) })}
          className="h-2 w-full cursor-pointer appearance-none rounded-full bg-slate-200 accent-sky-500"
        />
        <div className="flex justify-between text-[10px] text-slate-400 tabular-nums">
          <span>0.3 (3折)</span>
          <span>1.0 (原价)</span>
        </div>
      </div>
    </div>
  )
}

function NumberField({
  value,
  onChange,
  min,
  max,
  step = 1,
  prefix,
  suffix,
}: {
  value: number
  onChange: (v: number) => void
  min?: number
  max?: number
  step?: number
  prefix?: string
  suffix?: string
}) {
  return (
    <div className="flex items-stretch overflow-hidden rounded-md border border-slate-200 bg-white focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-100">
      {prefix && (
        <span className="flex items-center border-r border-slate-200 bg-slate-50 px-2 text-xs font-medium text-slate-500">
          {prefix}
        </span>
      )}
      <input
        type="number"
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={(e) => {
          const v = Number(e.target.value)
          if (Number.isNaN(v)) return
          let clamped = v
          if (typeof min === 'number') clamped = Math.max(min, clamped)
          if (typeof max === 'number') clamped = Math.min(max, clamped)
          onChange(clamped)
        }}
        className="min-w-0 flex-1 bg-transparent px-2.5 py-1.5 text-sm text-slate-800 outline-none tabular-nums [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
      />
      <div className="flex flex-col border-l border-slate-200">
        <button
          type="button"
          onClick={() => {
            const next = value + step
            if (typeof max === 'number' && next > max) return
            onChange(Number(next.toFixed(10)))
          }}
          className="flex flex-1 items-center justify-center px-1.5 text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-700 active:bg-slate-100"
          tabIndex={-1}
        >
          <svg className="h-2.5 w-2.5" viewBox="0 0 10 10" fill="currentColor">
            <path d="M5 2L9 7H1z" />
          </svg>
        </button>
        <button
          type="button"
          onClick={() => {
            const next = value - step
            if (typeof min === 'number' && next < min) return
            onChange(Number(next.toFixed(10)))
          }}
          className="flex flex-1 items-center justify-center border-t border-slate-200 px-1.5 text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-700 active:bg-slate-100"
          tabIndex={-1}
        >
          <svg className="h-2.5 w-2.5" viewBox="0 0 10 10" fill="currentColor">
            <path d="M5 8L1 3h8z" />
          </svg>
        </button>
      </div>
      {suffix && (
        <span className="flex items-center border-l border-slate-200 bg-slate-50 px-2 text-xs font-medium text-slate-500">
          {suffix}
        </span>
      )}
    </div>
  )
}
