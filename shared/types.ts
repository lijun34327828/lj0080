
export type PackageType = 'hourly' | 'daily' | 'monthly'

export interface DiscountRule {
  id: string
  type: 'tier' | 'bulk' | 'time-slot'
  name: string
  tiers?: { threshold: number; rate: number }[]
  bulkThreshold?: number
  bulkDiscount?: number
  slotStartHour?: number
  slotEndHour?: number
  slotRate?: number
}

export interface TextStyleConfig {
  fontSize: number
  color: string
  fontWeight: 100 | 300 | 400 | 500 | 700 | 900
  underline: boolean
  strikethrough: boolean
  glow: boolean
}

export interface RentalPackage {
  id: string
  type: PackageType
  name: string
  description: string
  basePrice: number
  durationHours: number
  maxDurationHours: number
  discountRules: DiscountRule[]
  promoText: string
  promoTextStyle: TextStyleConfig
  priority: number
  enabled: boolean
}

export interface CalculateRequest {
  rentalHours: number
  startHour?: number
  peopleCount?: number
  packages: RentalPackage[]
}

export interface CalculationBreakdown {
  step: string
  amount: number
  description: string
}

export interface CalculateResponse {
  success: boolean
  matchedPackageId?: string
  matchedPackageName?: string
  originalPrice: number
  finalPrice: number
  savedAmount: number
  breakdown: CalculationBreakdown[]
  warning?: string
  exceededMaxDuration?: boolean
  suggestedMaxHours?: number
}
