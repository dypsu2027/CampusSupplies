// One place for pricing so the homepage, dashboard and Stripe checkout always agree.

export const FREE_AI_LIMIT = 3;

export const PRO = {
  name: "Seller Pro",
  priceCents: 499,
  priceLabel: "$4.99",
  interval: "month",
  pitch: "Sell one extra item and the month pays for itself. Cancel once you've moved out.",
};

// Each feature here is built into the app.
export const FREE_FEATURES = [
  "Unlimited listings and browsing",
  "Student-only marketplace",
  `${FREE_AI_LIMIT} AI-written listings to try it out`,
];

export const PRO_FEATURES = [
  "Unlimited AI-written listings with price suggestions",
  "Featured placement at the top of Browse",
  "Featured badge on every listing you post",
  "Everything in Free",
];
