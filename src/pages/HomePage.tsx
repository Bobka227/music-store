import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { CATEGORIES } from '../constants/categories'
import { useProducts } from '../hooks/useProducts'
import ProductCard from '../components/ProductCard'

export default function HomePage() {
  const { products, loading, error } = useProducts()

  // Doporučené: skladem, nejdražší 4 (vlajkové modely)
  const recommended = useMemo(
    () =>
      products
        .filter((p) => p.stock > 0)
        .sort((a, b) => b.price - a.price)
        .slice(0, 4),
    [products],
  )

  return (
    <div className="space-y-10">
      <section className="rounded-xl bg-black text-white p-8 md:p-12">
        <h1 className="text-3xl md:text-4xl font-bold">Hudební nástroje pro každého</h1>
        <p className="mt-2 text-gray-300">
          Kytary, klávesy, bicí i příslušenství – od začátečníků po profesionály.
        </p>
        <Link
          to="/catalog"
          className="inline-block mt-6 px-6 py-2 rounded-lg bg-white text-black font-semibold"
        >
          Prohlédnout katalog
        </Link>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">Kategorie</h2>
        <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-5">
          {CATEGORIES.map((c) => (
            <Link
              key={c.id}
              to={`/catalog/${c.id}`}
              className="border rounded-lg p-6 text-center hover:shadow-lg transition"
            >
              <div className="text-4xl">{c.icon}</div>
              <p className="mt-2 font-semibold">{c.label}</p>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">Doporučujeme</h2>
        {loading && <p>Načítání…</p>}
        {error && <p className="text-red-600">{error}</p>}
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {recommended.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>
    </div>
  )
}