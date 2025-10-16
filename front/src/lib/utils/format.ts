export function formatPrice(amount: number, currency: string = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(amount);
}

export function formatPricePerUnit(
  amount: number,
  quantity: number,
  currency: string = "USD"
): string {
  const perUnit = amount / quantity;
  return `${formatPrice(perUnit, currency)}/pill`;
}

export function calculateSavings(
  originalPrice: number,
  discountedPrice: number
): string {
  const savings = ((originalPrice - discountedPrice) / originalPrice) * 100;
  return `${Math.round(savings)}%`;
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(date));
}
