import { medusa } from "./client";

// Cache the region to avoid repeated API calls
let cachedRegion: any = null;

async function getRegion() {
  if (cachedRegion) {
    return cachedRegion;
  }
  
  try {
    const regions = await medusa.store.region.list();
    cachedRegion = regions.regions?.[0] || null;
    return cachedRegion;
  } catch (error) {
    console.error("Failed to fetch region:", error);
    return null;
  }
}

export async function getProducts(params?: {
  categoryId?: string[];
  limit?: number;
  offset?: number;
  q?: string;
}) {
  const region = await getRegion();
  
  return medusa.store.product.list({
    limit: params?.limit || 20,
    offset: params?.offset || 0,
    category_id: params?.categoryId,
    q: params?.q,
    region_id: region?.id,
  });
}

export async function getProduct(handle: string) {
  const region = await getRegion();
  
  const response = await medusa.store.product.list({
    handle,
    region_id: region?.id,
  });
  return response.products?.[0] || null;
}

export async function getProductById(id: string) {
  return medusa.store.product.retrieve(id);
}

export async function searchProducts(query: string, limit: number = 20) {
  const region = await getRegion();
  
  return medusa.store.product.list({
    q: query,
    limit,
    region_id: region?.id,
  });
}
