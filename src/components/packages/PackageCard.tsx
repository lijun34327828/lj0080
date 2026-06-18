
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical, Trash2 } from 'lucide-react'
import type { RentalPackage } from '../../../shared/types'
import { applyTextStyle, formatCurrency, formatHours, packageTypeMeta } from '../../utils/formatters'
import { cn } from '../../lib/utils'

interface PackageCardProps {
  pkg: RentalPackage
  isSelected: boolean
  onSelect: (id: string) => void
  onRemove: (id: string) => void
  onToggleEnabled: (id: string) => void
}

const typeColorMap: Record<string, { bg: string; text: string; border: string }> = {
  hourly: { bg: 'bg-ink-500/20', text: 'text-ink-200', border: 'border-ink-500/30' },
  daily: { bg: 'bg-emerald-500/20', text: 'text-emerald-300', border: 'border-emerald-500/30' },
  monthly: { bg: 'bg-violet-500/20', text: 'text-violet-300', border: 'border-violet-500/30' },
}

export default function PackageCard({ pkg, isSelected, onSelect, onRemove, onToggleEnabled }: PackageCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: pkg.id })

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const typeColor = typeColorMap[pkg.type]
  const priority = pkg.priority + 1

  return (
    <div
      ref={setNodeRef}
      style={style}
      onClick={() => onSelect(pkg.id)}
      className={cn(
        'group relative rounded-2xl p-5 transition-all duration-300 cursor-pointer animate-fade-in',
        'glass-soft border',
        isSelected
          ? 'border-amber-500/60 shadow-glow-amber bg-amber-500/5'
          : 'border-ink-500/15 hover:border-ink-500/30 hover:shadow-card',
        isDragging ? 'opacity-50 scale-[0.98]' : 'opacity-100'
      )}
    >
      {isSelected && (
        <div className="absolute -inset-px rounded-2xl pointer-events-none ring-2 ring-amber-500/40" />
      )}

      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <button
            {...attributes}
            {...listeners}
            onClick={(e) => e.stopPropagation()}
            className="drag-handle p-1.5 rounded-lg hover:bg-ink-500/20 text-ink-200/60 hover:text-ink-200 transition-colors"
          >
            <GripVertical size={18} />
          </button>

          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/30">
            <span className="text-amber-400 font-bold text-sm">#{priority}</span>
          </div>

          <div className={cn(
            'px-2.5 py-1 rounded-md text-xs font-medium border',
            typeColor.bg,
            typeColor.text,
            typeColor.border
          )}>
            {packageTypeMeta[pkg.type].shortLabel}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation()
              onToggleEnabled(pkg.id)
            }}
            className={cn(
              'relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none',
              pkg.enabled ? 'bg-amber-500' : 'bg-ink-700'
            )}
          >
            <span
              className={cn(
                'pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
                pkg.enabled ? 'translate-x-4' : 'translate-x-0'
              )}
            />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation()
              onRemove(pkg.id)
            }}
            className="p-1.5 rounded-lg text-ink-200/40 hover:text-red-400 hover:bg-red-500/10 transition-colors opacity-0 group-hover:opacity-100"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      <div className="mb-4">
        <h3 className="text-lg font-semibold text-ink-50 mb-1">{pkg.name}</h3>
        <p className="text-sm text-ink-200/50">{pkg.description}</p>
      </div>

      <div className="flex items-baseline gap-2 mb-4">
        <span className="font-display text-3xl font-bold text-amber-400 tracking-tight">
          {formatCurrency(pkg.basePrice)}
        </span>
        <span className="text-sm text-ink-200/50">
          / {formatHours(pkg.durationHours)}
        </span>
      </div>

      {pkg.discountRules.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {pkg.discountRules.map((rule) => (
            <span
              key={rule.id}
              className="px-2 py-0.5 rounded-md text-xs bg-ink-500/15 text-ink-200/70 border border-ink-500/20"
            >
              {rule.name}
            </span>
          ))}
        </div>
      )}

      {pkg.promoText && (
        <div
          className="text-sm inline-block"
          style={applyTextStyle(pkg.promoTextStyle)}
        >
          {pkg.promoText}
        </div>
      )}
    </div>
  )
}
