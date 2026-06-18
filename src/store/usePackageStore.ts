
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { RentalPackage, PackageType, CalculateResponse, DiscountRule } from '../../shared/types'
import { createDefaultPackages } from '../utils/defaultPackages'
import { calculatePrice } from '../services/calculationApi'
import { uid } from '../utils/formatters'

interface DraftRequest {
  rentalHours: number
  startHour: number
  peopleCount: number
}

interface PackageStore {
  packages: RentalPackage[]
  selectedId: string | null
  draftRequest: DraftRequest
  lastResult: CalculateResponse | null
  calculating: boolean
  backendConnected: boolean

  addPackage: (type: PackageType) => void
  removePackage: (id: string) => void
  updatePackage: (id: string, patch: Partial<RentalPackage>) => void
  reorderPackages: (fromIndex: number, toIndex: number) => void
  selectPackage: (id: string | null) => void

  addDiscountRule: (packageId: string, type: DiscountRule['type']) => void
  removeDiscountRule: (packageId: string, ruleId: string) => void
  updateDiscountRule: (packageId: string, ruleId: string, patch: Partial<DiscountRule>) => void

  setDraftRequest: (patch: Partial<DraftRequest>) => void
  calculate: () => Promise<void>
  resetToDefault: () => void
  setBackendConnected: (v: boolean) => void
}

const buildNewPackage = (type: PackageType, priority: number): RentalPackage => {
  const base: Record<PackageType, Omit<RentalPackage, 'id' | 'priority'>> = {
    hourly: {
      type,
      name: '小时套餐',
      description: '灵活短租方案',
      basePrice: 30,
      durationHours: 2,
      maxDurationHours: 2,
      enabled: true,
      promoText: '限时特惠',
      promoTextStyle: { fontSize: 14, color: '#F59E0B', fontWeight: 700, underline: false, strikethrough: false, glow: true },
      discountRules: [],
    },
    daily: {
      type,
      name: '全天套餐',
      description: '当日营业时间畅用',
      basePrice: 98,
      durationHours: 12,
      maxDurationHours: 12,
      enabled: true,
      promoText: '全天畅学超值价',
      promoTextStyle: { fontSize: 14, color: '#10B981', fontWeight: 700, underline: false, strikethrough: false, glow: true },
      discountRules: [],
    },
    monthly: {
      type,
      name: '月度套餐',
      description: '包月畅学',
      basePrice: 598,
      durationHours: 720,
      maxDurationHours: 720,
      enabled: true,
      promoText: '💎 包月超值',
      promoTextStyle: { fontSize: 15, color: '#6366F1', fontWeight: 900, underline: true, strikethrough: false, glow: true },
      discountRules: [],
    },
  }
  return {
    id: uid(),
    priority,
    ...base[type],
  }
}

const STORAGE_KEY = 'study-room-packages-v1'

export const usePackageStore = create<PackageStore>()(
  persist(
    (set, get) => ({
      packages: createDefaultPackages(),
      selectedId: null,
      draftRequest: { rentalHours: 3, startHour: 9, peopleCount: 1 },
      lastResult: null,
      calculating: false,
      backendConnected: false,

      addPackage: (type) => {
        const list = get().packages
        const newPkg = buildNewPackage(type, list.length)
        set({ packages: [...list, newPkg], selectedId: newPkg.id })
        setTimeout(() => get().calculate(), 50)
      },

      removePackage: (id) => {
        const list = get().packages.filter((p) => p.id !== id)
        const reordered = list.map((p, i) => ({ ...p, priority: i }))
        set({
          packages: reordered,
          selectedId: get().selectedId === id ? null : get().selectedId,
        })
        setTimeout(() => get().calculate(), 50)
      },

      updatePackage: (id, patch) => {
        set({
          packages: get().packages.map((p) => (p.id === id ? { ...p, ...patch } : p)),
        })
        setTimeout(() => get().calculate(), 50)
      },

      reorderPackages: (fromIndex, toIndex) => {
        const list = [...get().packages]
        const [moved] = list.splice(fromIndex, 1)
        list.splice(toIndex, 0, moved)
        const reordered = list.map((p, i) => ({ ...p, priority: i }))
        set({ packages: reordered })
        setTimeout(() => get().calculate(), 50)
      },

      selectPackage: (id) => set({ selectedId: id }),

      addDiscountRule: (packageId, type) => {
        const baseRule: DiscountRule = {
          id: uid(),
          type,
          name: type === 'tier' ? '阶梯折扣' : type === 'bulk' ? '满减优惠' : '时段特惠',
        }
        if (type === 'tier') baseRule.tiers = [{ threshold: 4, rate: 0.9 }]
        if (type === 'bulk') {
          baseRule.bulkThreshold = 100
          baseRule.bulkDiscount = 20
        }
        if (type === 'time-slot') {
          baseRule.slotStartHour = 18
          baseRule.slotEndHour = 22
          baseRule.slotRate = 0.85
        }
        set({
          packages: get().packages.map((p) =>
            p.id === packageId
              ? { ...p, discountRules: [...p.discountRules, baseRule] }
              : p
          ),
        })
        setTimeout(() => get().calculate(), 50)
      },

      removeDiscountRule: (packageId, ruleId) => {
        set({
          packages: get().packages.map((p) =>
            p.id === packageId
              ? { ...p, discountRules: p.discountRules.filter((r) => r.id !== ruleId) }
              : p
          ),
        })
        setTimeout(() => get().calculate(), 50)
      },

      updateDiscountRule: (packageId, ruleId, patch) => {
        set({
          packages: get().packages.map((p) =>
            p.id === packageId
              ? {
                  ...p,
                  discountRules: p.discountRules.map((r) =>
                    r.id === ruleId ? { ...r, ...patch } : r
                  ),
                }
              : p
          ),
        })
        setTimeout(() => get().calculate(), 50)
      },

      setDraftRequest: (patch) => {
        set({ draftRequest: { ...get().draftRequest, ...patch } })
        setTimeout(() => get().calculate(), 50)
      },

      calculate: async () => {
        const { draftRequest, packages } = get()
        if (packages.length === 0) return
        set({ calculating: true })
        try {
          const result = await calculatePrice({
            rentalHours: draftRequest.rentalHours,
            startHour: draftRequest.startHour,
            peopleCount: draftRequest.peopleCount,
            packages,
          })
          set({ lastResult: result, calculating: false })
        } catch {
          set({ calculating: false })
        }
      },

      resetToDefault: () => {
        const defaults = createDefaultPackages()
        set({ packages: defaults, selectedId: null })
        setTimeout(() => get().calculate(), 50)
      },

      setBackendConnected: (v) => set({ backendConnected: v }),
    }),
    {
      name: STORAGE_KEY,
      partialize: (state) => ({ packages: state.packages }),
    }
  )
)
