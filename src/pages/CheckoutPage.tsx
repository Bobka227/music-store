import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate } from 'react-router-dom'
import { checkoutSchema, SHIPPING_PRICE, type CheckoutFormData } from '../schemas/checkout'
import { useCartStore, getTotalPrice } from '../store/cartStore'
import { useOrderStore } from '../store/orderStore'
import { useUserStore } from '../store/userStore'
import { formatPrice } from '../utils/format'

const inputClass = 'w-full border rounded px-3 py-2'

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-sm font-medium">{label}</span>
      {children}
      {error && <span className="text-red-600 text-sm">{error}</span>}
    </label>
  )
}

export default function CheckoutPage() {
  const items = useCartStore((s) => s.items)
  const clearCart = useCartStore((s) => s.clear)
  const addOrder = useOrderStore((s) => s.addOrder)
  const profile = useUserStore((s) => s.profile)
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: { ...profile, delivery: 'courier', payment: 'card', consent: false, note: '' },
  })

  const delivery = useWatch({ control, name: 'delivery' })

  if (items.length === 0) {
    return (
      <div>
        <p className="mb-2">Košík je prázdný.</p>
        <Link to="/catalog" className="underline">Přejít do katalogu</Link>
      </div>
    )
  }

  const subtotal = getTotalPrice(items)
  const shipping = SHIPPING_PRICE[delivery]
  const total = subtotal + shipping

  const onSubmit = (data: CheckoutFormData) => {
    addOrder({
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      items,
      shippingPrice: shipping,
      total,
      customer: data,
    })
    navigate('/profile')
    clearCart()
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold mb-4">Objednávka</h1>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
        <Field label="Jméno a příjmení" error={errors.name?.message}>
          <input {...register('name')} className={inputClass} autoComplete="name" />
        </Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="E-mail" error={errors.email?.message}>
            <input type="email" {...register('email')} className={inputClass} autoComplete="email" />
          </Field>
          <Field label="Telefon" error={errors.phone?.message}>
            <input type="tel" {...register('phone')} className={inputClass} autoComplete="tel" />
          </Field>
        </div>

        <Field label="Ulice a číslo" error={errors.street?.message}>
          <input {...register('street')} className={inputClass} autoComplete="street-address" />
        </Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Město" error={errors.city?.message}>
            <input {...register('city')} className={inputClass} />
          </Field>
          <Field label="PSČ" error={errors.zip?.message}>
            <input {...register('zip')} className={inputClass} autoComplete="postal-code" />
          </Field>
        </div>

        <fieldset>
          <legend className="text-sm font-medium">Doprava</legend>
          <label className="flex gap-2">
            <input type="radio" value="courier" {...register('delivery')} /> Kurýr ({formatPrice(SHIPPING_PRICE.courier)})
          </label>
          <label className="flex gap-2">
            <input type="radio" value="pickup" {...register('delivery')} /> Osobní odběr (zdarma)
          </label>
          {errors.delivery && <p className="text-red-600 text-sm">{errors.delivery.message}</p>}
        </fieldset>

        <fieldset>
          <legend className="text-sm font-medium">Platba</legend>
          <label className="flex gap-2">
            <input type="radio" value="card" {...register('payment')} /> Kartou online
          </label>
          <label className="flex gap-2">
            <input type="radio" value="cod" {...register('payment')} /> Na dobírku
          </label>
          {errors.payment && <p className="text-red-600 text-sm">{errors.payment.message}</p>}
        </fieldset>

        <Field label="Poznámka (nepovinné)" error={errors.note?.message}>
          <textarea {...register('note')} rows={3} className={inputClass} />
        </Field>

        <label className="flex gap-2">
          <input type="checkbox" {...register('consent')} /> Souhlasím s obchodními podmínkami
        </label>
        {errors.consent && <p className="text-red-600 text-sm">{errors.consent.message}</p>}

        <div className="border-t pt-4 space-y-1">
          <p>Zboží: {formatPrice(subtotal)}</p>
          <p>Doprava: {formatPrice(shipping)}</p>
          <p className="text-xl font-bold">Celkem: {formatPrice(total)}</p>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2 rounded-lg bg-black text-white disabled:bg-gray-300"
        >
          Odeslat objednávku
        </button>
      </form>
    </div>
  )
}