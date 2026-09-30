import type { Product } from '../types/product'

export const makeProduct = (overrides: Partial<Product> = {}): Product => ({
  id: '1',
  name: 'Test Guitar',
  brand: 'Fender',
  category: 'guitar',
  price: 10000,
  stock: 5,
  image: '',
  description: '',
  specs: {},
  ...overrides,
})