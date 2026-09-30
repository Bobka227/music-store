import { describe, it, expect, beforeEach } from 'vitest'
import { useCartStore, getTotalCount, getTotalPrice } from './cartStore'
import { makeProduct } from '../test/fixtures'

describe('cartStore', () => {
  beforeEach(() => {
    useCartStore.setState({ items: [] })
  })

  it('přidá produkt do košíku', () => {
    useCartStore.getState().addItem(makeProduct())
    expect(useCartStore.getState().items).toHaveLength(1)
    expect(useCartStore.getState().items[0].quantity).toBe(1)
  })

  it('opakované přidání zvýší množství', () => {
    const product = makeProduct()
    useCartStore.getState().addItem(product)
    useCartStore.getState().addItem(product)
    expect(useCartStore.getState().items[0].quantity).toBe(2)
  })

  it('nepřekročí skladovou zásobu', () => {
    useCartStore.getState().addItem(makeProduct({ stock: 2 }), 10)
    expect(useCartStore.getState().items[0].quantity).toBe(2)
  })

  it('updateQuantity drží hodnotu v rozsahu 1..stock', () => {
    useCartStore.getState().addItem(makeProduct({ stock: 3 }))
    useCartStore.getState().updateQuantity('1', 0)
    expect(useCartStore.getState().items[0].quantity).toBe(1)
    useCartStore.getState().updateQuantity('1', 99)
    expect(useCartStore.getState().items[0].quantity).toBe(3)
  })

  it('odebere produkt', () => {
    useCartStore.getState().addItem(makeProduct())
    useCartStore.getState().removeItem('1')
    expect(useCartStore.getState().items).toHaveLength(0)
  })

  it('spočítá celkový počet a cenu', () => {
    useCartStore.getState().addItem(makeProduct({ id: '1', price: 1000 }), 2)
    useCartStore.getState().addItem(makeProduct({ id: '2', price: 500 }), 3)
    const { items } = useCartStore.getState()
    expect(getTotalCount(items)).toBe(5)
    expect(getTotalPrice(items)).toBe(3500)
  })
})