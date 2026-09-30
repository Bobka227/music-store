import { useDeferredValue, useMemo } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { categorySchema } from "../schemas/product";
import { filtersSchema, type SortOption } from "../schemas/filters";
import { CATEGORIES } from "../constants/categories";
import { useProducts } from "../hooks/useProducts";
import { filterProducts } from "../utils/filterProducts";
import ProductCard from "../components/ProductCard";

const inputClass = "w-full border rounded px-3 py-2";

export default function CatalogPage() {
  const { category } = useParams();
  const parsedCategory = categorySchema.safeParse(category);
  const validCategory = parsedCategory.success
    ? parsedCategory.data
    : undefined;

  const [searchParams, setSearchParams] = useSearchParams();
  const filters = filtersSchema.parse(Object.fromEntries(searchParams));
  const deferredQ = useDeferredValue(filters.q);

  const { products, loading, error } = useProducts(validCategory);

  const brands = useMemo(
    () => [...new Set(products.map((p) => p.brand))].sort(),
    [products],
  );

  const filtered = useMemo(
    () => filterProducts(products, { ...filters, q: deferredQ }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      products,
      deferredQ,
      filters.brand,
      filters.minPrice,
      filters.maxPrice,
      filters.inStock,
      filters.sort,
    ],
  );

  const updateParam = (key: string, value: string) => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value);
    else next.delete(key);
    setSearchParams(next, { replace: true });
  };

  if (category && !parsedCategory.success) return <p>Neznámá kategorie.</p>;

  const title =
    CATEGORIES.find((c) => c.id === validCategory)?.label ?? "Katalog";

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">{title}</h1>

      <nav className="flex flex-wrap gap-2 mb-6">
        <Link
          to={{ pathname: "/catalog", search: searchParams.toString() }}
          className={`px-3 py-1 rounded-full border ${!validCategory ? "bg-black text-white" : ""}`}
        >
          Vše
        </Link>
        {CATEGORIES.map((c) => (
          <Link
            key={c.id}
            to={{
              pathname: `/catalog/${c.id}`,
              search: searchParams.toString(),
            }}
            className={`px-3 py-1 rounded-full border ${validCategory === c.id ? "bg-black text-white" : ""}`}
          >
            {c.label}
          </Link>
        ))}
      </nav>

      <div className="grid gap-6 lg:grid-cols-[250px_1fr]">
        <aside className="space-y-4">
          <label className="block">
            <span className="text-sm font-medium">Hledat</span>
            <input
              type="search"
              value={filters.q}
              onChange={(e) => updateParam("q", e.target.value)}
              placeholder="Název nebo značka"
              maxLength={100}
              className={inputClass}
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium">Značka</span>
            <select
              value={filters.brand}
              onChange={(e) => updateParam("brand", e.target.value)}
              className={inputClass}
            >
              <option value="">Všechny</option>
              {brands.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </label>

          <div className="grid grid-cols-2 gap-2">
            <label className="block">
              <span className="text-sm font-medium">Cena od</span>
              <input
                type="number"
                min={0}
                value={filters.minPrice ?? ""}
                onChange={(e) => updateParam("minPrice", e.target.value)}
                className={inputClass}
              />
            </label>
            <label className="block">
              <span className="text-sm font-medium">Cena do</span>
              <input
                type="number"
                min={0}
                value={filters.maxPrice ?? ""}
                onChange={(e) => updateParam("maxPrice", e.target.value)}
                className={inputClass}
              />
            </label>
          </div>

          <label className="flex gap-2">
            <input
              type="checkbox"
              checked={filters.inStock}
              onChange={(e) =>
                updateParam("inStock", e.target.checked ? "1" : "")
              }
            />
            Pouze skladem
          </label>

          <label className="block">
            <span className="text-sm font-medium">Řadit</span>
            <select
              value={filters.sort}
              onChange={(e) =>
                updateParam("sort", e.target.value as SortOption)
              }
              className={inputClass}
            >
              <option value="name">Podle názvu</option>
              <option value="price-asc">Od nejlevnějšího</option>
              <option value="price-desc">Od nejdražšího</option>
            </select>
          </label>

          <button
            onClick={() => setSearchParams({}, { replace: true })}
            className="text-sm underline"
          >
            Zrušit filtry
          </button>
        </aside>

        <section>
          {loading && <p>Načítání…</p>}
          {error && <p className="text-red-600">{error}</p>}
          {!loading && !error && (
            <>
              <p className="text-sm text-gray-500 mb-3">
                Nalezeno: {filtered.length}
              </p>
              {filtered.length === 0 ? (
                <p>Žádné produkty neodpovídají filtrům.</p>
              ) : (
                <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
                  {filtered.map((p) => (
                    <ProductCard key={p.id} product={p} />
                  ))}
                </div>
              )}
            </>
          )}
        </section>
      </div>
    </div>
  );
}
