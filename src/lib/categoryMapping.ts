/**
 * Maps UI category labels to database ilike patterns.
 * The seller_products.category column has varied values like
 * "Brain and Focus", "brain health", "Peptides brain health", etc.
 * We use multiple patterns joined with OR to match all relevant products.
 */
export const categoryPatterns: Record<string, string[]> = {
  "Anti-Aging": ["%anti%aging%", "%anti aging%", "%wrinkle%", "%skin%care%", "%microneedling%"],
  "General Wellness": ["%general%", "%wellness%", "%daily%", "%essential%", "%trio%bundle%", "%zero sugar%"],
  "Cellular Health": ["%cellular%", "%matcha%mind%"],
  "Longevity": ["%longevity%", "%NAD%", "%NMN%"],
  "Brain Health": ["%brain%", "%cognitive%", "%focus%"],
  "Recovery": ["%recovery%", "%energy%", "%vitality%", "%healing%"],
  "Weight Loss": ["%weight%loss%", "%weight%management%", "%gut%digestion%"],
  "Sexual Health": ["%libido%", "%hormonal%", "%menopausal%", "%womens%health%"],
  "Hair Loss": ["%hair%", "%hair%growth%"],
  "Devices": ["%device%", "%machine%", "%LED%", "%helmet%"],
  "Peptides": ["%peptide%"],
  "NAD+": ["%NAD%", "%NMN%"],
  "Supplements": ["%supplement%", "%gummies%", "%bar%"],
  "Skin & Hair": ["%skin%", "%hair%", "%beauty%"],
  "Pain & Recovery": ["%recovery%", "%healing%", "%bones%joints%"],
  "Menopause & HRT": ["%hormonal%", "%menopausal%"],
};

/**
 * Builds a Supabase OR filter string for a given UI category.
 * Returns something like: "category.ilike.%brain%,category.ilike.%cognitive%"
 */
export function getCategoryOrFilter(uiCategory: string): string | null {
  const patterns = categoryPatterns[uiCategory];
  if (!patterns) return null;
  return patterns.map(p => `category.ilike.${p}`).join(",");
}
