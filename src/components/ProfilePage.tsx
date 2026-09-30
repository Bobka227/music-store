import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { profileSchema, type ProfileData } from '../schemas/checkout'
import { useUserStore } from '../store/userStore'
import { useOrderStore } from '../store/orderStore'
import OrderList from '../components/OrderList'

const inputClass = 'w-full border rounded px-3 py-2'

const fields: { name: keyof ProfileData; label: string; type?: string }[] = [
  { name: 'name', label: 'Jméno a příjmení' },
  { name: 'email', label: 'E-mail', type: 'email' },
  { name: 'phone', label: 'Telefon', type: 'tel' },
  { name: 'street', label: 'Ulice a číslo' },
  { name: 'city', label: 'Město' },
  { name: 'zip', label: 'PSČ' },
]

export default function ProfilePage() {
  const profile = useUserStore((s) => s.profile)
  const updateProfile = useUserStore((s) => s.updateProfile)
  const orders = useOrderStore((s) => s.orders)
  const [saved, setSaved] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileData>({
    resolver: zodResolver(profileSchema),
    defaultValues: profile,
  })

  const onSubmit = (data: ProfileData) => {
    updateProfile(data)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <section>
        <h1 className="text-2xl font-bold mb-4">Profil</h1>
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-3">
          {fields.map((f) => (
            <label key={f.name} className="block">
              <span className="text-sm font-medium">{f.label}</span>
              <input type={f.type ?? 'text'} {...register(f.name)} className={inputClass} />
              {errors[f.name] && (
                <span className="text-red-600 text-sm">{errors[f.name]?.message}</span>
              )}
            </label>
          ))}
          <div className="flex items-center gap-4">
            <button type="submit" className="px-6 py-2 rounded-lg bg-black text-white">
              Uložit
            </button>
            {saved && <span className="text-green-600">Uloženo ✓</span>}
          </div>
        </form>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">Moje objednávky</h2>
        <OrderList orders={orders} />
      </section>
    </div>
  )
}