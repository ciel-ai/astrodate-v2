export const REVENUECAT_PRODUCT_IDS = {
  astro_plus: 'astrodate_astroplus_monthly',
  astro_x: 'astrodate_astrox_monthly',
} as const;

export const REVENUECAT_CONSUMABLE_IDS = {
  stars_3: 'astrodate_stars_3',
  boost_1: 'astrodate_boost_1',
  synastry_1: 'astrodate_synastry_1',
  ai_1: 'astrodate_ai_read_1',
} as const;

// Set these in EAS Secrets (never commit real values). Also add to .env for local dev.
export const REVENUECAT_API_KEY_IOS =
  process.env.EXPO_PUBLIC_REVENUECAT_API_KEY_IOS ?? '';

export const REVENUECAT_API_KEY_ANDROID =
  process.env.EXPO_PUBLIC_REVENUECAT_API_KEY_ANDROID ?? '';

export type RevenueCatPlanSlug = keyof typeof REVENUECAT_PRODUCT_IDS;
export type RevenueCatConsumableId = keyof typeof REVENUECAT_CONSUMABLE_IDS;
