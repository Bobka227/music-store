import type { z } from "zod";
import type { categorySchema, productSchema } from "../schemas/product";

export type Category = z.infer<typeof categorySchema>;
export type Product = z.infer<typeof productSchema>;
