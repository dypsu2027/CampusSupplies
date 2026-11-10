# Pricing and Homepage – Reduce, Reuse, CampusSupplies

ENGR 310 · Devon

## Plans

| | **Free** | **Seller Pro – $4.99 / month** |
|---|---|---|
| Listings and browsing | Unlimited | Unlimited |
| AI-written listings with a suggested price | 3 to try it out | Unlimited |
| Featured placement at the top of Browse | – | ✓ |
| "Featured seller" badge on your listings | – | ✓ |

### Why this price

- **$4.99 a month.** Selling one extra item pays for the month.
- **Monthly, not yearly.** Students sell around move-out, so most will subscribe for that month and cancel once they've moved.
- **Real features only.** Every Pro feature listed above is built into the app.

The price and feature list live in one file, `lib/plans.js`. The homepage, dashboard and Stripe checkout all read from it, so changing the price there updates it everywhere.

## Homepage

The homepage (`app/page.js`) has these sections, top to bottom:

1. **Hero** – "Your couch has one more semester in it," next to a board of example listings with price tags.
2. **The problem** – why move-out week wastes good furniture and money.
3. **How it works** – sign up with a school email, snap a photo, meet up and hand it off.
4. **AI listing helper demo** – a seller's quick handwritten note next to the full listing the AI writes from it.
5. **Pricing** – Free and Seller Pro side by side.
6. **FAQ** – who can join, how buying works, cancelling Pro, and what the AI does.
7. **Sign-up banner** and a footer.
