import { useEffect, useState } from 'react'
import { getProduct } from '../services/productService'
import type { Product } from '../types/product'

type State = {
  key: string
  product: Product | null
  error: string | null
}

export function useProduct(id?: string) {
  const [state, setState] = useState<State | null>(null)

  useEffect(() => {
    if (!id) return
    const controller = new AbortController()

    getProduct(id, controller.signal)
      .then((product) => setState({ key: id, product, error: null }))
      .catch((e) => {
        if (e.name !== 'AbortError') setState({ key: id, product: null, error: e.message })
      })

    return () => controller.abort()
  }, [id])

  const current = state?.key === id ? state : null

  return {
    product: current?.product ?? null,
    loading: !!id && current === null,
    error: id ? (current?.error ?? null) : 'Chybí ID produktu',
  }
}