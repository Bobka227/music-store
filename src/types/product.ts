export type Category = 'guitar' | 'bass' | 'keyboard' | 'drums' | 'accessory'

export interface Product {
  id: string
  name: string
  brand: string
  category: Category
  price: number
  stock: number
  image: string
  description: string
  specs: Record<string, string>
}