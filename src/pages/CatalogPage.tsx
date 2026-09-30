import { useParams } from 'react-router-dom'
import { categorySchema } from '../schemas/product'
import { useProducts } from '../hooks/useProducts'
import ProductCard from '../components/ProductCard'

export default function CatalogPage() {
  const { category } = useParams()
  const parsed = categorySchema.safeParse(category)
  const validCategory = parsed.success ? parsed.data : undefined
  const { products, loading, error } = useProducts(validCategory)

  if (category && !parsed.success) return <p>Neznámá kategorie.</p>
  if (loading) return <p>Načítání…</p>
  if (error) return <p className="text-red-600">{error}</p>

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Katalog</h1>
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  )
}