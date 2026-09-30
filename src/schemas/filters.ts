import { z } from 'zod'

export const SORT_OPTIONS = ['name', 'price-asc', 'price-desc'] as const

export const filtersSchema = z.object({
  q: z.string().trim().max(100).catch(''),
  brand: z.string().max(50).catch(''),
  minPrice: z.coerce.number().nonnegative().optional().catch(undefined),
  maxPrice: z.coerce.number().nonnegative().optional().catch(undefined),
  inStock: z.string().optional().transform((v) => v === '1'),
  sort: z.enum(SORT_OPTIONS).catch('name'),
})

export type Filters = z.infer<typeof filtersSchema>
export type SortOption = (typeof SORT_OPTIONS)[number]