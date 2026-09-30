import { Link, useParams } from "react-router-dom";
import { useProduct } from "../hooks/useProduct";
import { formatPrice } from "../utils/format";
import { useCartStore } from "../store/cartStore";

export default function ProductPage() {
  const { id } = useParams();
  const { product, loading, error } = useProduct(id);
  const addItem = useCartStore((s) => s.addItem);
  const inCart = useCartStore(
    (s) => s.items.find((i) => i.id === id)?.quantity ?? 0,
  );

  if (loading) return <p>Načítání…</p>;
  if (error || !product) {
    return (
      <div>
        <p className="text-red-600 mb-4">{error ?? "Produkt nenalezen"}</p>
        <Link to="/catalog" className="underline">
          ← Zpět do katalogu
        </Link>
      </div>
    );
  }

  const inStock = product.stock > 0;
  const canAdd = inCart < product.stock;

  return (
    <div>
      <Link to="/catalog" className="underline text-sm">
        ← Zpět do katalogu
      </Link>

      <div className="grid gap-8 md:grid-cols-2 mt-4">
        <img
          src={product.image}
          alt={product.name}
          className="w-full aspect-3/2 object-cover rounded-lg"
        />

        <div>
          <p className="text-gray-500">{product.brand}</p>
          <h1 className="text-3xl font-bold">{product.name}</h1>
          <p className="text-2xl font-bold mt-4">
            {formatPrice(product.price)}
          </p>
          <p className={inStock ? "text-green-600" : "text-red-600"}>
            {inStock ? `Skladem (${product.stock} ks)` : "Není skladem"}
          </p>

          <button
            onClick={() => addItem(product)}
            disabled={!canAdd}
            className="mt-4 px-6 py-2 rounded-lg bg-black text-white disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {!inStock
              ? "Není skladem"
              : canAdd
                ? "Do košíku"
                : "Maximum v košíku"}
          </button>
          {inCart > 0 && (
            <p className="text-sm mt-2">V košíku: {inCart} ks</p>
          )}

          <p className="mt-6">{product.description}</p>

          <h2 className="text-xl font-semibold mt-6 mb-2">Parametry</h2>
          <table className="w-full text-sm">
            <tbody>
              {Object.entries(product.specs).map(([key, value]) => (
                <tr key={key} className="border-b">
                  <td className="py-2 text-gray-500">{key}</td>
                  <td className="py-2 font-medium">{value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}