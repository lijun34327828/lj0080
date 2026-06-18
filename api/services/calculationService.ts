
import type {
  RentalPackage,
  DiscountRule,
  CalculateRequest,
  CalculateResponse,
  CalculationBreakdown,
} from '../../shared/types.js'

export function calculatePricing(request: CalculateRequest): CalculateResponse {
  const { rentalHours, startHour = 9, packages } = request
  const breakdown: CalculationBreakdown[] = []

  const enabledPackages = packages.filter(p => p.enabled)
  const globalMaxHours = enabledPackages.reduce(
    (max, p) => Math.max(max, p.maxDurationHours),
    0
  )

  if (rentalHours > globalMaxHours) {
    return {
      success: false,
      originalPrice: 0,
      finalPrice: 0,
      savedAmount: 0,
      breakdown: [],
      exceededMaxDuration: true,
      suggestedMaxHours: globalMaxHours,
      warning: `租赁时长 ${rentalHours} 小时超出所有套餐的最大可租时长上限（${globalMaxHours}小时），请降低租赁时长或调整套餐上限。`,
    }
  }

  const sorted = [...enabledPackages].sort((a, b) => a.priority - b.priority)
  const matched = sorted.find(p => rentalHours <= p.durationHours)

  if (!matched) {
    const availableMax = sorted.reduce(
      (m, p) => Math.max(m, p.durationHours),
      0
    )
    return {
      success: false,
      originalPrice: 0,
      finalPrice: 0,
      savedAmount: 0,
      breakdown: [],
      exceededMaxDuration: true,
      suggestedMaxHours: availableMax,
      warning: `租赁时长 ${rentalHours} 小时未匹配到任何套餐（最长套餐覆盖 ${availableMax} 小时），请调整时长或新增套餐。`,
    }
  }

  breakdown.push({
    step: '基础定价',
    amount: matched.basePrice,
    description: `匹配套餐【${matched.name}】，基础定价 ¥${matched.basePrice}，覆盖 ${matched.durationHours} 小时`,
  })

  let currentAmount = matched.basePrice
  const originalPrice = matched.basePrice

  for (const rule of matched.discountRules) {
    const result = applyDiscountRule(rule, currentAmount, rentalHours, startHour)
    if (result) {
      currentAmount = result.amount
      breakdown.push({
        step: rule.name || rule.type,
        amount: result.amount,
        description: result.description,
      })
    }
  }

  const finalPrice = Math.max(0, Math.round(currentAmount * 100) / 100)
  const savedAmount = Math.round((originalPrice - finalPrice) * 100) / 100

  return {
    success: true,
    matchedPackageId: matched.id,
    matchedPackageName: matched.name,
    originalPrice,
    finalPrice,
    savedAmount,
    breakdown,
  }
}

function applyDiscountRule(
  rule: DiscountRule,
  currentAmount: number,
  rentalHours: number,
  startHour: number
): { amount: number; description: string } | null {
  switch (rule.type) {
    case 'tier':
      return applyTierRule(rule, currentAmount, rentalHours)
    case 'bulk':
      return applyBulkRule(rule, currentAmount)
    case 'time-slot':
      return applyTimeSlotRule(rule, currentAmount, startHour, rentalHours)
    default:
      return null
  }
}

function applyTierRule(
  rule: DiscountRule,
  currentAmount: number,
  rentalHours: number
): { amount: number; description: string } | null {
  if (!rule.tiers || rule.tiers.length === 0) return null
  const sortedTiers = [...rule.tiers].sort((a, b) => b.threshold - a.threshold)
  const hit = sortedTiers.find(t => rentalHours >= t.threshold)
  if (!hit) return null
  const discounted = currentAmount * hit.rate
  const saved = currentAmount - discounted
  return {
    amount: discounted,
    description: `阶梯折扣：时长≥${hit.threshold}h 触发折扣率 ${(hit.rate * 100).toFixed(0)}%，节省 ¥${saved.toFixed(2)}`,
  }
}

function applyBulkRule(
  rule: DiscountRule,
  currentAmount: number
): { amount: number; description: string } | null {
  if (rule.bulkThreshold == null || rule.bulkDiscount == null) return null
  if (currentAmount < rule.bulkThreshold) return null
  const discounted = currentAmount - rule.bulkDiscount
  return {
    amount: discounted,
    description: `满减优惠：满 ¥${rule.bulkThreshold} 减 ¥${rule.bulkDiscount}，实付 ¥${discounted.toFixed(2)}`,
  }
}

function applyTimeSlotRule(
  rule: DiscountRule,
  currentAmount: number,
  startHour: number,
  rentalHours: number
): { amount: number; description: string } | null {
  if (
    rule.slotStartHour == null ||
    rule.slotEndHour == null ||
    rule.slotRate == null
  ) {
    return null
  }
  const endHour = (startHour + rentalHours) % 24
  let overlaps = false
  if (rule.slotStartHour < rule.slotEndHour) {
    overlaps = startHour < rule.slotEndHour && endHour > rule.slotStartHour
  } else {
    overlaps = startHour < rule.slotEndHour || endHour > rule.slotStartHour
  }
  if (!overlaps) return null
  const discounted = currentAmount * rule.slotRate
  const saved = currentAmount - discounted
  return {
    amount: discounted,
    description: `时段折扣：${String(rule.slotStartHour).padStart(2, '0')}:00-${String(rule.slotEndHour).padStart(2, '0')}:00 时段折扣 ${(rule.slotRate * 100).toFixed(0)}%，节省 ¥${saved.toFixed(2)}`,
  }
}

export function validateRequest(
  body: unknown
): { valid: boolean; error?: string; value?: CalculateRequest } {
  if (!body || typeof body !== 'object') {
    return { valid: false, error: '请求体必须为 JSON 对象' }
  }
  const req = body as CalculateRequest
  if (typeof req.rentalHours !== 'number' || req.rentalHours <= 0) {
    return { valid: false, error: 'rentalHours 必须为大于0的数字' }
  }
  if (!Array.isArray(req.packages)) {
    return { valid: false, error: 'packages 必须为数组' }
  }
  if (req.packages.length === 0) {
    return { valid: false, error: '至少配置一个套餐' }
  }
  return { valid: true, value: req }
}

export type { RentalPackage }
