import { z } from 'zod'

export const categorySchema = z.enum(['guitar', 'bass', 'keyboard', 'drums', 'accessory'])

export const productSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  brand: z.string().min(1),
  category: categorySchema,
  price: z.number().nonnegative(),
  stock: z.number().int().nonnegative(),
  image: z.string(),
  description: z.string(),
  specs: z.record(z.string(), z.string()),
})

export const productListSchema = z.array(productSchema)