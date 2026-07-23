/**
 * Escape special regex characters to prevent ReDoS attacks
 */
export const escapeRegex = (text: string): string => {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(" ")
}

export function formatPrice(price: number): string {
  return `$${price.toFixed(2)}`
}

/**
 * Whether a product has an active discount.
 * A discount is active only when discountPrice is defined and strictly
 * less than the original price (handles the edge case discountPrice === 0).
 */
export function hasDiscount(price: number, discountPrice?: number): boolean {
  return discountPrice !== undefined && discountPrice < price
}

/**
 * The price to display to the customer — the discount price when a
 * discount is active, otherwise the original price.
 */
export function getEffectivePrice(price: number, discountPrice?: number): number {
  return hasDiscount(price, discountPrice) ? (discountPrice as number) : price
}

export function formatDate(
  date: string | Date,
  options?: Intl.DateTimeFormatOptions,
): string {
  const d = typeof date === "string" ? new Date(date) : date
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    ...options,
  })
}
