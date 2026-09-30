import type { Order } from '../types/order'
import { formatPrice } from '../utils/format'

const deliveryLabel = { courier: 'Kurýr', pickup: 'Osobní odběr' }
const paymentLabel = { card: 'Kartou online', cod: 'Na dobírku' }

export default function OrderList({ orders }: { orders: Order[] }) {
  if (orders.length === 0) return <p className="text-gray-500">Zatím žádné objednávky.</p>

  return (
    <ul className="space-y-4">
      {orders.map((order) => (
        <li key={order.id} className="border rounded-lg p-4">
          <div className="flex justify-between flex-wrap gap-2">
            <p className="font-semibold">Objednávka #{order.id.slice(0, 8)}</p>
            <p className="text-sm text-gray-500">
              {new Date(order.createdAt).toLocaleString('cs-CZ')}
            </p>
          </div>

          <ul className="text-sm mt-2">
            {order.items.map((item) => (
              <li key={item.id}>
                {item.quantity}× {item.brand} {item.name} – {formatPrice(item.price * item.quantity)}
              </li>
            ))}
          </ul>

          <p className="text-sm mt-2 text-gray-500">
            {deliveryLabel[order.customer.delivery]} · {paymentLabel[order.customer.payment]}
          </p>
          <p className="font-bold mt-1">Celkem: {formatPrice(order.total)}</p>
        </li>
      ))}
    </ul>
  )
}