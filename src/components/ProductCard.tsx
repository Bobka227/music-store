import { Link } from 'react-router-dom'
import type { Product } from '../types/product'
import { formatPrice } from '../utils/format'

export default function ProductCard({ product }: { product: Product }) {
  const inStock = product.stock > 0
  return (
    <Link
      to={`/product/${product.id}`}
      className="border rounded-lg overflow-hidden hover:shadow-lg transition"
    >
      <img src={product.image} alt={product.name} className="w-full aspect-[3/2] object-cover" loading="lazy" />
      <div className="p-3">
        <p className="text-sm text-gray-500">{product.brand}</p>
        <h2 className="font-semibold">{product.name}</h2>
        <p className="mt-2 font-bold">{formatPrice(product.price)}</p>
        <p className={inStock ? 'text-green-600 text-sm' : 'text-red-600 text-sm'}>
          {inStock ? `Skladem (${product.stock} ks)` : 'Není skladem'}
        </p>
      </div>
    </Link>
  )
}