import { Link } from "react-router-dom";
import { useCartStore, getTotalPrice } from "../store/cartStore";
import { formatPrice } from "../utils/format";

export default function CartPage() {
  const items = useCartStore((s) => s.items);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);

  if (items.length === 0) {
    return (
      <div>
        <h1 className="text-2xl font-bold mb-4">Košík</h1>
        <p>Košík je prázdný.</p>
        <Link to="/catalog" className="underline">
          Přejít do katalogu
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Košík</h1>

      <ul className="divide-y">
        {items.map((item) => (
          <li key={item.id} className="flex items-center gap-4 py-4">
            <img
              src={item.image}
              alt={item.name}
              className="w-24 aspect-3/2 object-cover rounded"
            />
            <div className="flex-1">
              <Link
                to={`/product/${item.id}`}
                className="font-semibold hover:underline"
              >
                {item.brand} {item.name}
              </Link>
              <p className="text-sm text-gray-500">
                {formatPrice(item.price)} / ks
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                disabled={item.quantity <= 1}
                className="w-8 h-8 border rounded disabled:opacity-40"
              >
                −
              </button>
              <span className="w-8 text-center">{item.quantity}</span>
              <button
                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                disabled={item.quantity >= item.stock}
                className="w-8 h-8 border rounded disabled:opacity-40"
              >
                +
              </button>
            </div>

            <p className="w-28 text-right font-bold">
              {formatPrice(item.price * item.quantity)}
            </p>

            <button
              onClick={() => removeItem(item.id)}
              className="text-red-600 text-sm"
            >
              Odebrat
            </button>
          </li>
        ))}
      </ul>

      <div className="flex justify-between items-center mt-6 pt-4 border-t">
        <p className="text-xl">
          Celkem:{" "}
          <span className="font-bold">{formatPrice(getTotalPrice(items))}</span>
        </p>
        <Link
          to="/checkout"
          className="px-6 py-2 rounded-lg bg-black text-white"
        >
          Pokračovat k objednávce
        </Link>
      </div>
    </div>
  );
}
