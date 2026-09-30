import type { Filters } from '../schemas/filters'
import type { Product } from '../types/product'

export function filterProducts(products: Product[], f: Filters): Product[] {
  const q = f.q.toLowerCase()

  const result = products.filter((p) => {
    if (q && !`${p.brand} ${p.name}`.toLowerCase().includes(q)) return false
    if (f.brand && p.brand !== f.brand) return false
    if (f.minPrice !== undefined && p.price < f.minPrice) return false
    if (f.maxPrice !== undefined && p.price > f.maxPrice) return false
    if (f.inStock && p.stock === 0) return false
    return true
  })

  switch (f.sort) {
    case 'price-asc':
      return result.sort((a, b) => a.price - b.price)
    case 'price-desc':
      return result.sort((a, b) => b.price - a.price)
    default:
      return result.sort((a, b) => a.name.localeCompare(b.name, 'cs'))
  }
}