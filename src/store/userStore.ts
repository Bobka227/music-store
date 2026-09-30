import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { ProfileData } from '../schemas/checkout'

const emptyProfile: ProfileData = { name: '', email: '', phone: '', street: '', city: '', zip: '' }

type UserState = {
  profile: ProfileData
  updateProfile: (data: ProfileData) => void
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      profile: emptyProfile,
      updateProfile: (data) => set({ profile: data }),
    }),
    { name: 'music-store-user' },
  ),
)