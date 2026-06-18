
import { Router } from 'express'
import { calculatePricing, validateRequest } from '../services/calculationService.js'

const router = Router()

router.post('/api/calculate', (req, res) => {
  const validation = validateRequest(req.body)
  if (!validation.valid) {
    return res.status(400).json({
      success: false,
      originalPrice: 0,
      finalPrice: 0,
      savedAmount: 0,
      breakdown: [],
      warning: validation.error,
    })
  }
  const result = calculatePricing(validation.value!)
  const statusCode = result.success ? 200 : 422
  return res.status(statusCode).json(result)
})

router.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'study-room-package-calculator',
    timestamp: new Date().toISOString(),
  })
})

export default router
