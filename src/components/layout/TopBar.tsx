import { Layers, RotateCcw } from 'lucide-react'
import { cn } from '@/lib/utils'

interface TopBarProps {
  backendConnected: boolean
  onReset: () => void
}

export default function TopBar({ backendConnected, onReset }: TopBarProps) {
  return (
    <header className="glass border-b border-ink-700/50 px-6 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-ink-700 to-ink-900 border border-amber-500/30 shadow-glow-amber">
            <Layers className="h-5 w-5 text-amber-400" />
          </div>
          <h1 className="font-display text-xl text-ink-50 tracking-wide">
            自习室租赁套餐规则配置器
          </h1>
        </div>

        <div className="flex items-center gap-2 rounded-full bg-ink-900/50 px-4 py-2 border border-ink-700/40">
          <span
            className={cn(
              'h-2.5 w-2.5 rounded-full transition-colors duration-300',
              backendConnected
                ? 'bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.6)]'
                : 'bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.6)]'
            )}
          />
          <span className="text-sm text-ink-200">
            演算服务 <span className="text-amber-400 font-medium">8850端口</span>
          </span>
        </div>

        <button
          onClick={onReset}
          className={cn(
            'group flex items-center gap-2 rounded-xl px-4 py-2',
            'bg-ink-800/60 border border-ink-700/50',
            'text-ink-200 text-sm font-medium',
            'transition-all duration-200 ease-out',
            'hover:bg-amber-500/15 hover:border-amber-500/40 hover:text-amber-300',
            'hover:shadow-[0_0_20px_rgba(245,158,11,0.25)]',
            'active:scale-95'
          )}
        >
          <RotateCcw className="h-4 w-4 transition-transform duration-300 group-hover:rotate-180" />
          <span>重置</span>
        </button>
      </div>
    </header>
  )
}
