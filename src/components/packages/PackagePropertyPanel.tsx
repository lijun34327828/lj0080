import type { RentalPackage, DiscountRule, GroupBillingMode, GroupDiscountTier } from '../../../shared/types'
import { packageTypeMeta } from '../../utils/formatters'
import { cn } from '../../lib/utils'
import { Layers3, Tag, Clock, Percent, Sparkles, MousePointerClick, Users, Plus, Trash2 } from 'lucide-react'
import DiscountRuleEditor from '../discount/DiscountRuleEditor'
import TextStyleEditor from '../discount/TextStyleEditor'

interface PackagePropertyPanelProps {
  pkg: RentalPackage | null
  onUpdate: (id: string, patch: Partial<RentalPackage>) => void
  onAddRule: (id: string, type: DiscountRule['type']) => void
  onRemoveRule: (id: string, ruleId: string) => void
  onUpdateRule: (id: string, ruleId: string, patch: Partial<DiscountRule>) => void
}

export default function PackagePropertyPanel({
  pkg,
  onUpdate,
  onAddRule,
  onRemoveRule,
  onUpdateRule,
}: PackagePropertyPanelProps) {
  if (!pkg) {
    return (
      <div className="flex h-full flex-col items-center justify-center p-8 text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100">
          <MousePointerClick className="h-8 w-8 text-slate-400" />
        </div>
        <h3 className="mb-1 text-base font-semibold text-slate-700">未选择套餐</h3>
        <p className="max-w-xs text-sm text-slate-500">
          从左侧列表中点击选择一个套餐，即可在此处编辑其详细属性配置。
        </p>
      </div>
    )
  }

  const typeMeta = packageTypeMeta[pkg.type]

  return (
    <div className="h-full overflow-y-auto">
      <div className="space-y-6 p-6">
        <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
          <div
            className={cn(
              'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl',
              pkg.type === 'hourly' && 'bg-amber-100 text-amber-600',
              pkg.type === 'daily' && 'bg-emerald-100 text-emerald-600',
              pkg.type === 'monthly' && 'bg-indigo-100 text-indigo-600'
            )}
          >
            <Layers3 className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="mb-0.5 flex items-center gap-2">
              <h2 className="truncate text-lg font-bold text-slate-800">{pkg.name}</h2>
              <span
                className={cn(
                  'shrink-0 rounded-md px-1.5 py-0.5 text-[10px] font-semibold',
                  pkg.type === 'hourly' && 'bg-amber-50 text-amber-700',
                  pkg.type === 'daily' && 'bg-emerald-50 text-emerald-700',
                  pkg.type === 'monthly' && 'bg-indigo-50 text-indigo-700'
                )}
              >
                {typeMeta.shortLabel}
              </span>
            </div>
            <p className="truncate text-xs text-slate-500">{typeMeta.description}</p>
          </div>
        </div>

        <Section icon={<Tag className="h-4 w-4" />} title="基本信息" accent="slate">
          <div className="space-y-4">
            <Field label="套餐名称">
              <input
                type="text"
                value={pkg.name}
                onChange={(e) => onUpdate(pkg.id, { name: e.target.value })}
                className="w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                placeholder="请输入套餐名称"
              />
            </Field>
            <Field label="套餐描述">
              <textarea
                value={pkg.description}
                onChange={(e) => onUpdate(pkg.id, { description: e.target.value })}
                rows={3}
                className="w-full resize-none rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                placeholder="简要描述此套餐的特点与适用场景"
              />
            </Field>
          </div>
        </Section>

        <Section icon={<Clock className="h-4 w-4" />} title="定价与时长" accent="sky">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <PricingField
              label="基础价格"
              value={pkg.basePrice}
              onChange={(v) => onUpdate(pkg.id, { basePrice: v })}
              min={0}
              step={1}
              prefix="¥"
              hint="套餐起步价"
            />
            <PricingField
              label="可用时长"
              value={pkg.durationHours}
              onChange={(v) => onUpdate(pkg.id, { durationHours: v })}
              min={0}
              step={1}
              suffix="小时"
              hint="套餐包含时长"
            />
            <PricingField
              label="上限时长"
              value={pkg.maxDurationHours}
              onChange={(v) => onUpdate(pkg.id, { maxDurationHours: v })}
              min={0}
              step={1}
              suffix="小时"
              hint="最大允许使用"
            />
          </div>
        </Section>

        <Section icon={<Percent className="h-4 w-4" />} title="折扣规则" accent="amber">
          <div className="space-y-3">
            <div className="flex flex-wrap gap-2">
              <AddRuleButton
                type="tier"
                label="阶梯折扣"
                hint="按时长阶梯"
                onClick={() => onAddRule(pkg.id, 'tier')}
              />
              <AddRuleButton
                type="bulk"
                label="满减优惠"
                hint="满额立减"
                onClick={() => onAddRule(pkg.id, 'bulk')}
              />
              <AddRuleButton
                type="time-slot"
                label="时段特惠"
                hint="指定时段折扣"
                onClick={() => onAddRule(pkg.id, 'time-slot')}
              />
            </div>

            {pkg.discountRules.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50/50 p-8 text-center">
                <p className="text-sm font-medium text-slate-600">暂无折扣规则</p>
                <p className="mt-1 text-xs text-slate-400">点击上方按钮添加优惠规则</p>
              </div>
            ) : (
              <div className="space-y-3">
                {pkg.discountRules.map((rule) => (
                  <DiscountRuleEditor
                    key={rule.id}
                    rule={rule}
                    onChange={(patch) => onUpdateRule(pkg.id, rule.id, patch)}
                    onDelete={() => onRemoveRule(pkg.id, rule.id)}
                  />
                ))}
              </div>
            )}
          </div>
        </Section>

        <Section icon={<Users className="h-4 w-4" />} title="团体计费" accent="violet">
          <div className="space-y-4">
            <Field label="计费方式">
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => onUpdate(pkg.id, { groupBillingMode: 'per-person' })}
                  className={cn(
                    'flex-1 rounded-lg border px-3.5 py-2.5 text-sm font-medium transition-all text-left',
                    pkg.groupBillingMode === 'per-person'
                      ? 'border-violet-400 bg-violet-50 text-violet-700 ring-2 ring-violet-100'
                      : 'border-slate-200 bg-white text-slate-600 hover:border-violet-200 hover:bg-violet-50/50'
                  )}
                >
                  每人单价叠加
                  <p className="text-[11px] mt-0.5 opacity-70 font-normal">基础价 × 人数</p>
                </button>
                <button
                  type="button"
                  onClick={() => onUpdate(pkg.id, { groupBillingMode: 'flat' })}
                  className={cn(
                    'flex-1 rounded-lg border px-3.5 py-2.5 text-sm font-medium transition-all text-left',
                    pkg.groupBillingMode === 'flat'
                      ? 'border-violet-400 bg-violet-50 text-violet-700 ring-2 ring-violet-100'
                      : 'border-slate-200 bg-white text-slate-600 hover:border-violet-200 hover:bg-violet-50/50'
                  )}
                >
                  整单价格不变
                  <p className="text-[11px] mt-0.5 opacity-70 font-normal">不随人数变化</p>
                </button>
                <button
                  type="button"
                  onClick={() => onUpdate(pkg.id, { groupBillingMode: undefined, groupDiscountTiers: undefined })}
                  className={cn(
                    'flex-1 rounded-lg border px-3.5 py-2.5 text-sm font-medium transition-all text-left',
                    !pkg.groupBillingMode
                      ? 'border-violet-400 bg-violet-50 text-violet-700 ring-2 ring-violet-100'
                      : 'border-slate-200 bg-white text-slate-600 hover:border-violet-200 hover:bg-violet-50/50'
                  )}
                >
                  未设置
                  <p className="text-[11px] mt-0.5 opacity-70 font-normal">不启用团体计费</p>
                </button>
              </div>
            </Field>

            {pkg.groupBillingMode && (
              <Field label="团体折扣阶梯">
                <div className="space-y-2">
                  {(pkg.groupDiscountTiers ?? []).map((tier, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <span className="text-xs text-slate-500 shrink-0 w-14">≥</span>
                      <input
                        type="number"
                        min={1}
                        value={tier.threshold}
                        onChange={(e) => {
                          const tiers = [...(pkg.groupDiscountTiers ?? [])]
                          tiers[idx] = { ...tiers[idx], threshold: Math.max(1, Number(e.target.value) || 1) }
                          onUpdate(pkg.id, { groupDiscountTiers: tiers })
                        }}
                        className="w-20 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 tabular-nums"
                        placeholder="人数"
                      />
                      <span className="text-xs text-slate-500 shrink-0">人，折扣率</span>
                      <input
                        type="number"
                        min={0}
                        max={1}
                        step={0.01}
                        value={tier.rate}
                        onChange={(e) => {
                          const tiers = [...(pkg.groupDiscountTiers ?? [])]
                          tiers[idx] = { ...tiers[idx], rate: Math.min(1, Math.max(0, Number(e.target.value) || 0)) }
                          onUpdate(pkg.id, { groupDiscountTiers: tiers })
                        }}
                        className="w-24 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 tabular-nums"
                        placeholder="0.90"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const tiers = (pkg.groupDiscountTiers ?? []).filter((_, i) => i !== idx)
                          onUpdate(pkg.id, { groupDiscountTiers: tiers.length > 0 ? tiers : undefined })
                        }}
                        className="shrink-0 p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => {
                      const tiers = [...(pkg.groupDiscountTiers ?? []), { threshold: 3, rate: 0.95 }]
                      onUpdate(pkg.id, { groupDiscountTiers: tiers })
                    }}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-dashed border-slate-300 bg-slate-50/50 px-3 py-2 text-xs font-medium text-slate-500 hover:border-violet-300 hover:bg-violet-50/50 hover:text-violet-600 transition-all"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    添加阶梯
                  </button>
                </div>
              </Field>
            )}
          </div>
        </Section>

        <Section icon={<Sparkles className="h-4 w-4" />} title="优惠文案与样式" accent="rose">
          <div className="space-y-4">
            <Field label="优惠文案">
              <textarea
                value={pkg.promoText}
                onChange={(e) => onUpdate(pkg.id, { promoText: e.target.value })}
                rows={2}
                className="w-full resize-none rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                placeholder="例如：限时特惠 · 超值福利等"
              />
            </Field>
            <TextStyleEditor
              style={pkg.promoTextStyle}
              onChange={(patch) =>
                onUpdate(pkg.id, { promoTextStyle: { ...pkg.promoTextStyle, ...patch } })
              }
            />
          </div>
        </Section>
      </div>
    </div>
  )
}

function Section({
  icon,
  title,
  accent,
  children,
}: {
  icon: React.ReactNode
  title: string
  accent: 'slate' | 'sky' | 'amber' | 'violet' | 'rose'
  children: React.ReactNode
}) {
  const accentClasses: Record<string, string> = {
    slate: 'bg-slate-500',
    sky: 'bg-sky-500',
    amber: 'bg-amber-500',
    violet: 'bg-violet-500',
    rose: 'bg-rose-500',
  }

  return (
    <section className="space-y-4">
      <div className="flex items-center gap-2.5">
        <div className={cn('h-5 w-1 shrink-0 rounded-full', accentClasses[accent])} />
        <div className="flex items-center gap-1.5 text-slate-700">
          {icon}
          <h3 className="text-sm font-bold">{title}</h3>
        </div>
      </div>
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">{children}</div>
    </section>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-semibold text-slate-600">{label}</label>
      {children}
    </div>
  )
}

function PricingField({
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
  prefix,
  suffix,
  hint,
}: {
  label: string
  value: number
  onChange: (v: number) => void
  min?: number
  max?: number
  step?: number
  prefix?: string
  suffix?: string
  hint?: string
}) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-semibold text-slate-600">{label}</label>
      <div className="flex items-stretch overflow-hidden rounded-lg border border-slate-200 bg-white focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-100">
        {prefix && (
          <span className="flex items-center border-r border-slate-200 bg-slate-50 px-3 text-sm font-medium text-slate-500">
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
          className="min-w-0 flex-1 bg-transparent px-3 py-2.5 text-sm text-slate-800 outline-none tabular-nums [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
        />
        <div className="flex flex-col border-l border-slate-200">
          <button
            type="button"
            onClick={() => {
              const next = value + step
              if (typeof max === 'number' && next > max) return
              onChange(Number(next.toFixed(10)))
            }}
            className="flex flex-1 items-center justify-center px-2 text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-700 active:bg-slate-100"
            tabIndex={-1}
          >
            <svg className="h-3 w-3" viewBox="0 0 10 10" fill="currentColor">
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
            className="flex flex-1 items-center justify-center border-t border-slate-200 px-2 text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-700 active:bg-slate-100"
            tabIndex={-1}
          >
            <svg className="h-3 w-3" viewBox="0 0 10 10" fill="currentColor">
              <path d="M5 8L1 3h8z" />
            </svg>
          </button>
        </div>
        {suffix && (
          <span className="flex items-center border-l border-slate-200 bg-slate-50 px-3 text-sm font-medium text-slate-500">
            {suffix}
          </span>
        )}
      </div>
      {hint && <p className="text-[11px] text-slate-400">{hint}</p>}
    </div>
  )
}

function AddRuleButton({
  type,
  label,
  hint,
  onClick,
}: {
  type: DiscountRule['type']
  label: string
  hint: string
  onClick: () => void
}) {
  const variants: Record<DiscountRule['type'], string> = {
    tier: 'border-amber-200 bg-amber-50 text-amber-700 hover:border-amber-300 hover:bg-amber-100',
    bulk: 'border-emerald-200 bg-emerald-50 text-emerald-700 hover:border-emerald-300 hover:bg-emerald-100',
    'time-slot': 'border-sky-200 bg-sky-50 text-sky-700 hover:border-sky-300 hover:bg-sky-100',
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex flex-1 min-w-[120px] flex-col items-start gap-0.5 rounded-lg border px-3.5 py-2.5 text-left transition-all',
        variants[type]
      )}
    >
      <span className="text-sm font-bold">{label}</span>
      <span className="text-[11px] opacity-80">{hint}</span>
    </button>
  )
}
