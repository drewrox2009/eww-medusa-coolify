// Pharmaceutical Product Types extending Medusa types

export interface PharmaceuticalMetadata {
  active_ingredient?: string;
  prescription_required?: boolean;
  therapeutic_use?: string;
  drug_class?: string;
  dosage?: string;
  quantity?: number;
  unit?: string;
}

export interface ProductVariant {
  id: string;
  title: string;
  sku?: string;
  prices: Array<{
    amount: number;
    currency_code: string;
  }>;
  calculated_price?: {
    calculated_amount: number;
    currency_code: string;
  };
  metadata?: PharmaceuticalMetadata;
  inventory_quantity?: number;
  manage_inventory?: boolean;
  allow_backorder?: boolean;
}

export interface Product {
  id: string;
  handle: string;
  title: string;
  subtitle?: string;
  description: string;
  thumbnail?: string;
  images?: Array<{ url: string; id: string }>;
  variants: ProductVariant[];
  categories?: Array<{ id: string; name: string; handle: string }>;
  collection?: { id: string; title: string; handle: string };
  tags?: Array<{ id: string; value: string }>;
  metadata?: PharmaceuticalMetadata;
  status: string;
}

export interface CartItem {
  id: string;
  cart_id: string;
  variant_id: string;
  variant: ProductVariant;
  product: Product;
  quantity: number;
  unit_price: number;
  subtotal: number;
  metadata?: Record<string, unknown>;
}

export interface Cart {
  id: string;
  email?: string;
  items: CartItem[];
  subtotal: number;
  total: number;
  created_at: string;
  updated_at: string;
  metadata?: Record<string, unknown>;
}

export interface Customer {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  has_account: boolean;
  metadata?: Record<string, unknown>;
}

export interface Address {
  id: string;
  customer_id?: string;
  company?: string;
  first_name?: string;
  last_name?: string;
  address_1?: string;
  address_2?: string;
  city?: string;
  country_code?: string;
  province?: string;
  postal_code?: string;
  phone?: string;
  metadata?: Record<string, unknown>;
}

export interface Order {
  id: string;
  display_id: number;
  email: string;
  customer_id: string;
  items: CartItem[];
  shipping_address: Address;
  billing_address: Address;
  subtotal: number;
  shipping_total: number;
  tax_total: number;
  total: number;
  status: string;
  payment_status: string;
  fulfillment_status: string;
  created_at: string;
  updated_at: string;
}

// Filter and Search Types
export interface ProductFilters {
  categories?: string[];
  priceRange?: {
    min: number;
    max: number;
  };
  prescriptionRequired?: boolean;
  inStock?: boolean;
  sortBy?: "price_asc" | "price_desc" | "name_asc" | "name_desc" | "popular";
  search?: string;
}

export interface PaginationParams {
  limit: number;
  offset: number;
}

export interface ProductListResponse {
  products: Product[];
  count: number;
  limit: number;
  offset: number;
}
