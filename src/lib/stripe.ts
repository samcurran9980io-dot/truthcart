// Stripe price IDs for TruthCart plans
export const STRIPE_PRICES = {
  basic: {
    monthly: "price_1SmCAUAh61tDVg3ixpUAU2Ng",
    yearly: "price_1SmCCpAh61tDVg3ipgefRMXx",
  },
  pro: {
    monthly: "price_1SmCCHAh61tDVg3itk8UMIFS",
    yearly: "price_1SmCD6Ah61tDVg3ipH9QYrp0",
  },
} as const;

export type StripePlanId = keyof typeof STRIPE_PRICES;
export type BillingInterval = "monthly" | "yearly";

export function getPriceId(planId: StripePlanId, interval: BillingInterval): string {
  return STRIPE_PRICES[planId][interval];
}
