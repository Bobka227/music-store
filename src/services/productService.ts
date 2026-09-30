import { productListSchema, productSchema } from "../schemas/product";
import type { Category, Product } from "../types/product";

const API_URL = "http://localhost:3001";

export async function getProducts(
  category?: Category,
  signal?: AbortSignal,
): Promise<Product[]> {
  const url = category
    ? `${API_URL}/products?category=${category}`
    : `${API_URL}/products`;
  const res = await fetch(url, { signal });
  if (!res.ok) throw new Error("Nepodařilo se načíst produkty");
  return productListSchema.parse(await res.json());
}

export async function getProduct(
  id: string,
  signal?: AbortSignal,
): Promise<Product> {
  const res = await fetch(`${API_URL}/products/${encodeURIComponent(id)}`, {
    signal,
  });
  if (!res.ok) throw new Error("Produkt nenalezen");
  return productSchema.parse(await res.json());
}
