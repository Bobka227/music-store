import type { CartItem } from './cart'
import type { CheckoutFormData } from '../schemas/checkout'

export type Order = {
  id: string
  createdAt: string
  items: CartItem[]
  shippingPrice: number
  total: number
  customer: CheckoutFormData
}