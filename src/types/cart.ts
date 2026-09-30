import type { Product } from './product'

export type CartItem = Pick<Product, 'id' | 'name' | 'brand' | 'price' | 'image' | 'stock'> & {
  quantity: number
}