import { useEffect, useState } from 'react'
import { getProducts } from '../services/productService'
import type { Category, Product } from '../types/product'

type State = {
  key: string
  products: Product[]
  error: string | null
}

export function useProducts(category?: Category) {
  const key = category ?? 'all'
  const [state, setState] = useState<State | null>(null)

  useEffect(() => {
    const controller = new AbortController()
    const k = category ?? 'all'

    getProducts(category, controller.signal)
      .then((products) => setState({ key: k, products, error: null }))
      .catch((e) => {
        if (e.name !== 'AbortError') setState({ key: k, products: [], error: e.message })
      })

    return () => controller.abort()
  }, [category])

  const current = state?.key === key ? state : null

  return {
    products: current?.products ?? [],
    loading: current === null,
    error: current?.error ?? null,
  }
}