/**
 * Maps telehealth program slug + tier label to a Stripe price ID.
 */
const tierToPriceMap: Record<string, Record<string, string>> = {
  "weight-loss": {
    "Level 1": "weight_loss_level1_monthly",
    "Level 2": "weight_loss_level2_monthly",
    "Level 3": "weight_loss_level3_monthly",
  },
  "menopause-hrt": {
    "Level 1": "menopause_level1_monthly",
    "Level 2": "menopause_level2_monthly",
  },
  "sexual-health": {
    "Good": "sexual_health_good_monthly",
    "Better": "sexual_health_better_monthly",
    "Best": "sexual_health_best_monthly",
  },
  "skin-hair": {
    "Good": "skin_hair_good_monthly",
    "Better": "skin_hair_better_monthly",
    "Best": "skin_hair_best_monthly",
  },
  "longevity": {
    "Good": "longevity_good_monthly",
    "Better": "longevity_better_monthly",
    "Best": "longevity_best_monthly",
  },
  "pain-recovery": {
    "Single": "pain_recovery_single_monthly",
  },
  "brain-cognitive": {
    "Good": "brain_good_monthly",
    "Better": "brain_better_monthly",
    "Best": "brain_best_monthly",
  },
  "gut-health": {
    "Level 1": "gut_level1_monthly",
    "Level 2": "gut_level2_monthly",
    "Level 3": "gut_level3_monthly",
  },
  "mental-health": {
    "Good": "mental_health_therapy_monthly",
    "Better": "mental_health_psychiatry_monthly",
    "Best": "mental_health_full_monthly",
  },
  "hot-health": {
    "Good": "hot_health_good_monthly",
    "Better": "hot_health_better_monthly",
    "Best": "hot_health_best_monthly",
  },
};

export function getStripePriceIdForTier(programSlug: string, tierLabel: string): string | null {
  return tierToPriceMap[programSlug]?.[tierLabel] || null;
}
