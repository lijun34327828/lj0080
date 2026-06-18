import { cn } from '@/lib/utils'
import { formatCurrency, formatHours } from '@/utils/formatters'
import {
  Calculator,
  Clock,
  Users,
  ChevronDown,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  RefreshCw,
  Sparkles,
} from 'lucide-react'
import type { CalculateResponse } from '../../../shared/types'

interface DraftRequest {
  rentalHours: number
  startHour: number
  peopleCount: number
}

interface CalculationConsoleProps {
  draftRequest: DraftRequest
  result: CalculateResponse | null
  calculating: boolean
  onRequestChange: (patch: Partial<DraftRequest>) => void
}

const QUICK_HOURS = [2, 4, 8, 12, 720]
const START_HOURS = Array.from({ length: 15 }, (_, i) => i + 8)

export default function CalculationConsole({
  draftRequest,
  result,
  calculating,
  onRequestChange,
}: CalculationConsoleProps) {
  const isSuccess = result?.success
  const isBlocked = result && !result.success && result.exceededMaxDuration

  return (
    <div className="glass rounded-3xl p-5 shadow-card flex gap-5 h-full">
      {/* 输入区 40% */}
      <div className="w-[40%] bg-ink-950/70 rounded-2xl p-5 flex flex-col gap-5 border border-ink-700/50">
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-xl bg-amber-500/15 border border-amber-500/30">
            <Calculator className="w-5 h-5 text-amber-500" />
          </div>
          <div>
            <h3 className="font-display text-xl text-amber-50">金额演算调试台</h3>
            <p className="text-xs text-ink-200/50 mt-0.5">输入模拟参数，实时演算应付金额</p>
          </div>
        </div>

        {/* 租赁时长 */}
        <div className="space-y-2.5">
          <div className="flex items-center gap-2 text-sm text-ink-200/70">
            <Clock className="w-3.5 h-3.5" />
            <span>租赁时长（小时）</span>
          </div>
          <div className="relative">
            <input
              type="number"
              min={1}
              value={draftRequest.rentalHours}
              onChange={(e) => onRequestChange({ rentalHours: Math.max(1, Number(e.target.value) || 1) })}
              className="w-full h-11 px-4 rounded-xl bg-ink-900/80 border border-ink-700/60 text-ink-100 text-sm focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20 transition-all font-mono"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-ink-200/40">h</span>
          </div>
          <div className="flex gap-1.5 flex-wrap">
            {QUICK_HOURS.map((h) => (
              <button
                key={h}
                onClick={() => onRequestChange({ rentalHours: h })}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-xs font-medium transition-all',
                  draftRequest.rentalHours === h
                    ? 'bg-amber-500 text-ink-950 shadow-glow-amber'
                    : 'bg-ink-800/60 text-ink-200/60 hover:bg-ink-700/60 hover:text-ink-100/80 border border-ink-700/40'
                )}
              >
                {h < 24 ? `${h}h` : `${h / 24}天`}
              </button>
            ))}
          </div>
        </div>

        {/* 起始时段 */}
        <div className="space-y-2.5">
          <div className="flex items-center gap-2 text-sm text-ink-200/70">
            <Clock className="w-3.5 h-3.5" />
            <span>起始时段</span>
          </div>
          <div className="relative">
            <select
              value={draftRequest.startHour}
              onChange={(e) => onRequestChange({ startHour: Number(e.target.value) })}
              className="w-full h-11 px-4 pr-10 rounded-xl bg-ink-900/80 border border-ink-700/60 text-ink-100 text-sm focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20 transition-all appearance-none cursor-pointer font-mono"
            >
              {START_HOURS.map((h) => (
                <option key={h} value={h} className="bg-ink-900">
                  {String(h).padStart(2, '0')}:00
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-200/40 pointer-events-none" />
          </div>
        </div>

        {/* 人数 */}
        <div className="space-y-2.5">
          <div className="flex items-center gap-2 text-sm text-ink-200/70">
            <Users className="w-3.5 h-3.5" />
            <span>人数</span>
          </div>
          <div className="relative">
            <input
              type="number"
              min={1}
              max={99}
              value={draftRequest.peopleCount}
              onChange={(e) => onRequestChange({ peopleCount: Math.max(1, Math.min(99, Number(e.target.value) || 1)) })}
              className="w-full h-11 px-4 rounded-xl bg-ink-900/80 border border-ink-700/60 text-ink-100 text-sm focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20 transition-all font-mono"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-ink-200/40">人</span>
          </div>
        </div>

        <div className="mt-auto pt-3 border-t border-ink-700/40">
          <div className="text-[11px] text-ink-200/30 leading-relaxed">
            参数修改后自动触发演算，{formatHours(draftRequest.rentalHours)}
            ，自 {String(draftRequest.startHour).padStart(2, '0')}:00 起
          </div>
        </div>
      </div>

      {/* 结果展示区 60% */}
      <div className="flex-1 bg-gradient-to-br from-ink-50 to-ink-100/90 rounded-2xl p-6 flex flex-col relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-ink opacity-[0.15] pointer-events-none" />

        {calculating && <LoadingSkeleton />}

        {!calculating && isSuccess && result && (
          <SuccessView result={result} />
        )}

        {!calculating && isBlocked && result && (
          <BlockedView
            suggestedMaxHours={result.suggestedMaxHours ?? 8}
            warning={result.warning}
            onAdjust={() => onRequestChange({ rentalHours: result.suggestedMaxHours ?? 8 })}
          />
        )}

        {!calculating && !result && (
          <EmptyHint />
        )}
      </div>
    </div>
  )
}

function LoadingSkeleton() {
  return (
    <div className="relative z-10 flex flex-col gap-5 animate-pulse">
      <div className="flex items-center gap-3">
        <div className="h-8 w-40 bg-ink-200/50 rounded-lg" />
        <div className="h-6 w-24 bg-amber-300/50 rounded-full" />
      </div>
      <div className="flex items-end gap-4">
        <div className="h-6 w-24 bg-ink-200/40 rounded" />
        <div className="h-12 w-32 bg-amber-300/60 rounded-xl" />
        <div className="h-7 w-20 bg-green-300/50 rounded-lg" />
      </div>
      <div className="space-y-3 pt-3">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="flex items-center gap-3">
            <div className="h-9 w-9 bg-ink-200/50 rounded-lg" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-3/4 bg-ink-200/40 rounded" />
              <div className="h-3 w-1/2 bg-ink-200/30 rounded" />
            </div>
            <div className="h-5 w-16 bg-ink-200/50 rounded" />
          </div>
        ))}
      </div>
    </div>
  )
}

function SuccessView({ result }: { result: CalculateResponse }) {
  return (
    <div className="relative z-10 flex flex-col gap-5 animate-fade-in">
      {/* 套餐名称 */}
      <div className="flex items-center gap-3">
        <h2 className="font-display text-3xl text-amber-600 text-glow">
          {result.matchedPackageName}
        </h2>
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 text-amber-700 text-xs font-semibold border border-amber-500/30">
          <CheckCircle2 className="w-3.5 h-3.5" />
          已匹配套餐
        </span>
      </div>

      {/* 价格行 */}
      <div className="flex items-end gap-4 flex-wrap">
        <div className="text-sm text-ink-500/60 line-through font-mono">
          {formatCurrency(result.originalPrice)}
        </div>
        <div className="flex items-end gap-2">
          <ArrowRight className="w-5 h-5 text-ink-500/40 mb-1" />
          <div className="font-display text-5xl text-amber-500 text-glow tracking-tight">
            {formatCurrency(result.finalPrice)}
          </div>
        </div>
        {result.savedAmount > 0 && (
          <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-green-500/15 text-green-700 text-sm font-semibold border border-green-500/30">
            <Sparkles className="w-4 h-4" />
            节省{formatCurrency(result.savedAmount)}
          </span>
        )}
      </div>

      {/* 计费明细 */}
      <div className="mt-2 pt-5 border-t border-ink-200/60 flex-1 overflow-y-auto scroll-area pr-2">
        <div className="text-xs font-semibold text-ink-500/60 uppercase tracking-wider mb-4">
          计费明细 Breakdown
        </div>
        <div className="space-y-1">
          {result.breakdown.map((step, idx) => {
            const delta = idx === 0 ? step.amount : step.amount - result.breakdown[idx - 1].amount
            const isDiscount = delta < 0
            const isIncrease = delta > 0 && idx > 0
            return (
              <div key={idx} className="flex gap-4 items-start group">
                <div className="flex flex-col items-center">
                  <div className={cn(
                    'w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold border-2 shrink-0 transition-all',
                    idx === result.breakdown.length - 1
                      ? 'bg-amber-500 text-ink-950 border-amber-400 shadow-glow-amber'
                      : 'bg-white text-ink-600 border-ink-200'
                  )}>
                    {idx + 1}
                  </div>
                  {idx < result.breakdown.length - 1 && (
                    <div className="w-0.5 h-6 bg-gradient-to-b from-ink-300/80 to-ink-200/40 mt-0.5" />
                  )}
                </div>
                <div className="flex-1 py-2 pb-1">
                  <div className="text-sm font-semibold text-ink-800">{step.step}</div>
                  <div className="text-xs text-ink-500/70 mt-0.5">{step.description}</div>
                </div>
                <div className="py-2 pb-1 shrink-0 text-right">
                  <span className={cn(
                    'font-mono font-bold text-sm',
                    isDiscount
                      ? 'text-green-600'
                      : isIncrease
                        ? 'text-rose-600'
                        : 'text-ink-800'
                  )}>
                    {isDiscount
                      ? `-${formatCurrency(Math.abs(delta))}`
                      : isIncrease
                        ? `+${formatCurrency(delta)}`
                        : formatCurrency(delta)
                    }
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

function BlockedView({
  suggestedMaxHours,
  warning,
  onAdjust,
}: {
  suggestedMaxHours: number
  warning?: string
  onAdjust: () => void
}) {
  return (
    <div className="relative z-10 flex flex-col items-center justify-center h-full gap-5 text-center animate-fade-in">
      <div className="w-20 h-20 rounded-full bg-rose-500/10 border-2 border-rose-400/30 flex items-center justify-center shadow-[0_0_40px_rgba(244,63,94,0.25)]">
        <AlertTriangle className="w-10 h-10 text-rose-500" />
      </div>
      <div className="space-y-2">
        <h2 className="font-display text-3xl text-rose-600">超出时长上限</h2>
        <p className="text-sm text-ink-600 max-w-sm mx-auto leading-relaxed">
          {warning || `当前租赁时长超出所有可用套餐的最大限制，建议调整至 ${formatHours(suggestedMaxHours)} 以内。`}
        </p>
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-500/10 border border-rose-400/20 mt-2">
          <span className="text-xs text-rose-500 font-medium">建议最大时长：</span>
          <span className="font-display text-xl text-rose-600 font-bold">{formatHours(suggestedMaxHours)}</span>
        </div>
      </div>
      <button
        onClick={onAdjust}
        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-rose-500 text-white font-semibold text-sm shadow-lg shadow-rose-500/25 hover:bg-rose-600 hover:shadow-rose-500/40 transition-all active:scale-[0.98]"
      >
        <RefreshCw className="w-4 h-4" />
        调整参数
      </button>
    </div>
  )
}

function EmptyHint() {
  return (
    <div className="relative z-10 flex flex-col items-center justify-center h-full gap-4 text-center">
      <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-400/20 flex items-center justify-center">
        <Calculator className="w-8 h-8 text-amber-500/70" />
      </div>
      <div className="space-y-1">
        <h3 className="font-display text-xl text-ink-600">等待演算</h3>
        <p className="text-xs text-ink-500/70 max-w-xs">
          修改左侧参数后将自动开始金额演算
        </p>
      </div>
    </div>
  )
}
