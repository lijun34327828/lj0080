
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
  sortableKeyboardCoordinates,
} from '@dnd-kit/sortable'
import { Layers } from 'lucide-react'
import type { RentalPackage } from '../../../shared/types'
import { cn } from '../../lib/utils'
import PackageCard from './PackageCard'

interface PackageCanvasProps {
  packages: RentalPackage[]
  selectedId: string | null
  onSelect: (id: string) => void
  onReorder: (fromIndex: number, toIndex: number) => void
  onRemove: (id: string) => void
  onToggleEnabled: (id: string) => void
}

export default function PackageCanvas({
  packages,
  selectedId,
  onSelect,
  onReorder,
  onRemove,
  onToggleEnabled,
}: PackageCanvasProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return

    const oldIndex = packages.findIndex((p) => p.id === active.id)
    const newIndex = packages.findIndex((p) => p.id === over.id)

    if (oldIndex === -1 || newIndex === -1) return

    const reordered = arrayMove(packages, oldIndex, newIndex)
    if (reordered !== packages) {
      onReorder(oldIndex, newIndex)
    }
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex-shrink-0 px-6 py-4 border-b border-ink-500/15 bg-ink-900/40">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/25">
              <Layers size={20} className="text-amber-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-ink-50">
                已配置套餐
                <span className="ml-2 text-amber-400 font-bold">({packages.length}套)</span>
              </h2>
              <p className="text-xs text-ink-200/50 mt-0.5">
                匹配优先级：数字越小，越先匹配
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto scroll-area p-6">
        {packages.length === 0 ? (
          <div className={cn(
            'h-full flex flex-col items-center justify-center text-center',
            'min-h-[300px] rounded-2xl border-2 border-dashed border-ink-500/20',
            'bg-ink-900/20'
          )}>
            <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-ink-500/10 border border-ink-500/20 mb-4">
              <Layers size={28} className="text-ink-200/40" />
            </div>
            <h3 className="text-base font-medium text-ink-100/70 mb-2">暂无套餐</h3>
            <p className="text-sm text-ink-200/40 max-w-xs">
              从左侧模板库拖拽或点击添加套餐开始配置
            </p>
          </div>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={packages.map((p) => p.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="flex flex-col gap-4">
                {packages.map((pkg) => (
                  <PackageCard
                    key={pkg.id}
                    pkg={pkg}
                    isSelected={selectedId === pkg.id}
                    onSelect={onSelect}
                    onRemove={onRemove}
                    onToggleEnabled={onToggleEnabled}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}
      </div>
    </div>
  )
}
