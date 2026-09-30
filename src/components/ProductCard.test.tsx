import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import ProductCard from './ProductCard'
import { makeProduct } from '../test/fixtures'

const renderCard = (overrides = {}) =>
  render(
    <MemoryRouter>
      <ProductCard product={makeProduct(overrides)} />
    </MemoryRouter>,
  )

describe('ProductCard', () => {
  it('zobrazí název, značku a odkaz na detail', () => {
    renderCard({ id: '7', name: 'Stratocaster' })
    expect(screen.getByText('Stratocaster')).toBeInTheDocument()
    expect(screen.getByText('Fender')).toBeInTheDocument()
    expect(screen.getByRole('link')).toHaveAttribute('href', '/product/7')
  })

  it('zobrazí "Není skladem" při nulové zásobě', () => {
    renderCard({ stock: 0 })
    expect(screen.getByText('Není skladem')).toBeInTheDocument()
  })

  it('zobrazí počet kusů skladem', () => {
    renderCard({ stock: 4 })
    expect(screen.getByText('Skladem (4 ks)')).toBeInTheDocument()
  })
})