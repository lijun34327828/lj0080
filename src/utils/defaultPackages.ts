
import type { RentalPackage, TextStyleConfig } from '../../shared/types'
import { uid } from './formatters'

const defaultPromoStyle = (color = '#F59E0B'): TextStyleConfig => ({
  fontSize: 14,
  color,
  fontWeight: 700,
  underline: false,
  strikethrough: false,
  glow: true,
})

export const createDefaultPackages = (): RentalPackage[] => [
  {
    id: uid(),
    type: 'hourly',
    name: '灵活·2小时体验卡',
    description: '2小时短租，适合临时办公或快速学习',
    basePrice: 30,
    durationHours: 2,
    maxDurationHours: 2,
    priority: 0,
    enabled: true,
    promoText: '新客首单立减10元！',
    promoTextStyle: defaultPromoStyle(),
    discountRules: [
      {
        id: uid(),
        type: 'bulk',
        name: '新客满减',
        bulkThreshold: 20,
        bulkDiscount: 10,
      },
    ],
  },
  {
    id: uid(),
    type: 'hourly',
    name: '高效·半日4小时卡',
    description: '半天专注，适合深度工作或备考',
    basePrice: 55,
    durationHours: 4,
    maxDurationHours: 4,
    priority: 1,
    enabled: true,
    promoText: '工作日下午 0.85折限时优惠',
    promoTextStyle: defaultPromoStyle('#10B981'),
    discountRules: [
      {
        id: uid(),
        type: 'tier',
        name: '长时折扣',
        tiers: [{ threshold: 4, rate: 0.9 }],
      },
    ],
  },
  {
    id: uid(),
    type: 'daily',
    name: '全天畅享日卡',
    description: '全天12小时营业时段任意使用',
    basePrice: 98,
    durationHours: 12,
    maxDurationHours: 12,
    priority: 2,
    enabled: true,
    promoText: '深夜时段（18:00-22:00）再享0.75折',
    promoTextStyle: defaultPromoStyle('#6366F1'),
    groupBillingMode: 'per-person',
    groupDiscountTiers: [
      { threshold: 3, rate: 0.95 },
      { threshold: 5, rate: 0.9 },
      { threshold: 10, rate: 0.85 },
    ],
    discountRules: [
      {
        id: uid(),
        type: 'time-slot',
        name: '夜间特惠',
        slotStartHour: 18,
        slotEndHour: 22,
        slotRate: 0.75,
      },
      {
        id: uid(),
        type: 'tier',
        name: '长包日折扣',
        tiers: [{ threshold: 10, rate: 0.9 }],
      },
    ],
  },
  {
    id: uid(),
    type: 'monthly',
    name: '勤学包月卡',
    description: '30天无限时畅学，平均5元/天',
    basePrice: 598,
    durationHours: 720,
    maxDurationHours: 720,
    priority: 3,
    enabled: true,
    promoText: '💎 包月最超值！赠3人同行再享满600减100',
    promoTextStyle: { fontSize: 15, color: '#F59E0B', fontWeight: 900, underline: true, strikethrough: false, glow: true },
    groupBillingMode: 'flat',
    groupDiscountTiers: [
      { threshold: 3, rate: 0.95 },
      { threshold: 5, rate: 0.88 },
    ],
    discountRules: [
      {
        id: uid(),
        type: 'bulk',
        name: '包月满减',
        bulkThreshold: 500,
        bulkDiscount: 100,
      },
    ],
  },
]
