// Stripe price IDs for TruthCart plans
export const STRIPE_PRICES = {
  basic: {
    monthly: "price_1SnkJIAh61tDVg3imVX5thGm",
    yearly: "price_1SnkMZAh61tDVg3i7oRpeEud",
  },
  pro: {
    monthly: "price_1SnkL1Ah61tDVg3iIuLIemFU",
    yearly: "price_1SnkNtAh61tDVg3is8E8qBNy",
  },
} as const;

export type StripePlanId = keyof typeof STRIPE_PRICES;
export type BillingInterval = "monthly" | "yearly";

export function getPriceId(planId: StripePlanId, interval: BillingInterval): string {
  return STRIPE_PRICES[planId][interval];
}
