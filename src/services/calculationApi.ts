
import axios from 'axios'
import type { CalculateRequest, CalculateResponse } from '../../shared/types'

const client = axios.create({
  baseURL: '/api',
  timeout: 5000,
})

export const calculatePrice = async (
  payload: CalculateRequest
): Promise<CalculateResponse> => {
  try {
    const res = await client.post<CalculateResponse>('/calculate', payload)
    return res.data
  } catch (err: unknown) {
    if (axios.isAxiosError(err) && err.response?.data) {
      return err.response.data as CalculateResponse
    }
    return {
      success: false,
      originalPrice: 0,
      finalPrice: 0,
      savedAmount: 0,
      breakdown: [],
      warning: `演算服务连接失败：${(err as Error).message}`,
    }
  }
}

export const checkHealth = async (): Promise<boolean> => {
  try {
    await client.get('/health')
    return true
  } catch {
    return false
  }
}
