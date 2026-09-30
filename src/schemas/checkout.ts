import { z } from "zod";

export const checkoutSchema = z.object({
  name: z.string().trim().min(3, "Zadejte celé jméno").max(100),
  email: z.email({ error: "Neplatný e-mail" }),
  phone: z
    .string()
    .trim()
    .regex(/^(\+420)?\s?\d{3}\s?\d{3}\s?\d{3}$/, "Formát: +420 123 456 789"),
  street: z.string().trim().min(3, "Zadejte ulici a číslo"),
  city: z.string().trim().min(2, "Zadejte město"),
  zip: z
    .string()
    .trim()
    .regex(/^\d{3}\s?\d{2}$/, "PSČ ve formátu 123 45"),
  delivery: z.enum(["courier", "pickup"], { error: "Vyberte dopravu" }),
  payment: z.enum(["card", "cod"], { error: "Vyberte platbu" }),
  note: z.string().trim().max(500, "Max. 500 znaků").optional(),
  consent: z.boolean().refine((v) => v, "Musíte souhlasit s podmínkami"),
});

export type CheckoutFormData = z.infer<typeof checkoutSchema>;

export const SHIPPING_PRICE: Record<CheckoutFormData["delivery"], number> = {
  courier: 149,
  pickup: 0,
};

export const profileSchema = checkoutSchema.pick({
  name: true,
  email: true,
  phone: true,
  street: true,
  city: true,
  zip: true,
})

export type ProfileData = z.infer<typeof profileSchema> 