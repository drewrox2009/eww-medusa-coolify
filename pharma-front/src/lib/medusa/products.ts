import { medusa } from "./client";

export async function getProducts(params?: {
  categoryId?: string[];
  limit?: number;
  offset?: number;
  q?: string;
}) {
  return medusa.store.product.list({
    limit: params?.limit || 20,
    offset: params?.offset || 0,
    category_id: params?.categoryId,
    q: params?.q,
  });
}

export async function getProduct(handle: string) {
  const response = await medusa.store.product.list({ handle });
  return response.products?.[0] || null;
}

export async function getProductById(id: string) {
  return medusa.store.product.retrieve(id);
}

export async function searchProducts(query: string, limit: number = 20) {
  return medusa.store.product.list({
    q: query,
    limit,
  });
}
