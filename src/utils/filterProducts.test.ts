import { describe, it, expect } from 'vitest'
import { filterProducts } from './filterProducts'
import { makeProduct } from '../test/fixtures'
import type { Filters } from '../schemas/filters'

const products = [
  makeProduct({ id: '1', name: 'Stratocaster', brand: 'Fender', price: 20000, stock: 3 }),
  makeProduct({ id: '2', name: 'Pacifica', brand: 'Yamaha', price: 8000, stock: 0 }),
  makeProduct({ id: '3', name: 'Les Paul', brand: 'Gibson', price: 70000, stock: 1 }),
]

const base: Filters = { q: '', brand: '', inStock: false, sort: 'name' }

describe('filterProducts', () => {
  it('hledá podle názvu i značky bez ohledu na velikost písmen', () => {
    expect(filterProducts(products, { ...base, q: 'FENDER' })).toHaveLength(1)
    expect(filterProducts(products, { ...base, q: 'paul' })[0].id).toBe('3')
  })

  it('filtruje podle značky', () => {
    const result = filterProducts(products, { ...base, brand: 'Yamaha' })
    expect(result.map((p) => p.id)).toEqual(['2'])
  })

  it('filtruje podle cenového rozsahu', () => {
    const result = filterProducts(products, { ...base, minPrice: 10000, maxPrice: 50000 })
    expect(result.map((p) => p.id)).toEqual(['1'])
  })

  it('skryje produkty, které nejsou skladem', () => {
    const result = filterProducts(products, { ...base, inStock: true })
    expect(result.every((p) => p.stock > 0)).toBe(true)
  })

  it('řadí podle ceny vzestupně i sestupně', () => {
    expect(filterProducts(products, { ...base, sort: 'price-asc' }).map((p) => p.price)).toEqual([8000, 20000, 70000])
    expect(filterProducts(products, { ...base, sort: 'price-desc' }).map((p) => p.price)).toEqual([70000, 20000, 8000])
  })

  it('nemění původní pole', () => {
    const copy = [...products]
    filterProducts(products, { ...base, sort: 'price-desc' })
    expect(products).toEqual(copy)
  })
})