import { Clock, Calendar, DollarSign } from 'lucide-react'
import type { PackageType } from '../../../shared/types'
import { cn } from '@/lib/utils'

interface PackageTemplate {
  type: PackageType
  name: string
  description: string
  icon: typeof Clock
  gradient: string
  borderColor: string
}

const templates: PackageTemplate[] = [
  {
    type: 'hourly',
    name: '小时套餐',
    description: '按小时灵活计费，适合短时学习',
    icon: Clock,
    gradient: 'from-sky-500/20 to-ink-700/30',
    borderColor: 'hover:border-sky-400/50',
  },
  {
    type: 'daily',
    name: '全天套餐',
    description: '单日无限畅学，适合备考冲刺',
    icon: Calendar,
    gradient: 'from-amber-500/20 to-ink-700/30',
    borderColor: 'hover:border-amber-400/50',
  },
  {
    type: 'monthly',
    name: '月度套餐',
    description: '包月超值优惠，适合长期自习',
    icon: DollarSign,
    gradient: 'from-emerald-500/20 to-ink-700/30',
    borderColor: 'hover:border-emerald-400/50',
  },
]

interface ComponentLibraryProps {
  onAdd: (type: PackageType) => void
}

export default function ComponentLibrary({ onAdd }: ComponentLibraryProps) {
  return (
    <aside className="glass h-full w-72 flex flex-col border-r border-ink-700/50">
      <div className="px-5 py-4 border-b border-ink-700/40">
        <h2 className="font-display text-lg text-ink-50 tracking-wide">
          套餐模板库
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto scroll-area p-4 space-y-3">
        {templates.map((template) => {
          const Icon = template.icon
          return (
            <button
              key={template.type}
              onClick={() => onAdd(template.type)}
              className={cn(
                'w-full text-left p-4 rounded-2xl',
                'bg-gradient-to-br',
                template.gradient,
                'glass-soft',
                'border border-ink-700/40',
                template.borderColor,
                'transition-all duration-300 ease-out',
                'hover:shadow-card hover:-translate-y-0.5',
                'hover:shadow-glow-amber/50',
                'active:scale-[0.98]',
                'group cursor-pointer'
              )}
            >
              <div className="flex items-start gap-3">
                <div
                  className={cn(
                    'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl',
                    'bg-ink-900/60 border border-ink-700/50',
                    'transition-all duration-300',
                    'group-hover:shadow-[0_0_15px_rgba(245,158,11,0.35)]'
                  )}
                >
                  <Icon
                    className={cn(
                      'h-5 w-5 text-ink-200',
                      'transition-colors duration-300',
                      template.type === 'hourly' && 'group-hover:text-sky-300',
                      template.type === 'daily' && 'group-hover:text-amber-300',
                      template.type === 'monthly' && 'group-hover:text-emerald-300'
                    )}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-ink-100 text-base mb-1 group-hover:text-amber-200 transition-colors">
                    {template.name}
                  </h3>
                  <p className="text-xs text-ink-300/80 leading-relaxed">
                    {template.description}
                  </p>
                </div>
              </div>
            </button>
          )
        })}
      </div>

      <div className="px-5 py-4 border-t border-ink-700/40 bg-ink-950/30">
        <p className="text-xs text-ink-400 text-center leading-relaxed">
          <span className="text-amber-400/80">💡</span> 点击或拖拽模板至右侧画布
        </p>
      </div>
    </aside>
  )
}
