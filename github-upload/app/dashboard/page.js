import { redirect } from "next/navigation";
import { currentUser } from "@/lib/auth";
import { sql, FREE_AI_LIMIT } from "@/lib/db";
import { PRO, PRO_FEATURES } from "@/lib/plans";
import ListingHelper from "./ListingHelper";

export const metadata = { title: "Dashboard · Reduce, Reuse, CampusSupplies" };
export const dynamic = "force-dynamic";

export default async function Dashboard({ searchParams }) {
  const user = await currentUser();
  if (!user) redirect("/login");
  const { checkout } = await searchParams;
  const pro = user.plan === "pro";
  const usesLeft = pro ? null : Math.max(0, FREE_AI_LIMIT - user.ai_uses);
  const mine = await sql`SELECT id, title, price_cents, category, created_at FROM listings WHERE user_id = ${user.id} ORDER BY created_at DESC`;

  return (
    <main>
      <section className="stack">
        <div className="row">
          <span className="label">Dashboard</span>
          <span className={`pill ${pro ? "pro" : ""}`}>{pro ? "Seller Pro" : "Free plan"}</span>
        </div>
        <h1>Hi, {user.name.split(" ")[0]}</h1>
        {checkout === "cancelled" && <p className="muted">Checkout cancelled. You haven't been charged.</p>}
      </section>

      <ListingHelper canUseAi={pro || usesLeft > 0} usesLeft={usesLeft} />

      {!pro && (
        <section className="panel">
          <span className="label">{PRO.name} · {PRO.priceLabel}/{PRO.interval}</span>
          <h3>Sell faster with {PRO.name}</h3>
          <ul className="checks">{PRO_FEATURES.map((f) => <li key={f}>{f}</li>)}</ul>
          <p className="muted">Pay securely with Stripe. Cancel any time.</p>
          <form action="/api/checkout" method="POST"><button className="btn">Upgrade to Seller Pro</button></form>
        </section>
      )}

      <section className="stack">
        <h2>Your listings</h2>
        {mine.length === 0 ? (
          <p className="muted">Nothing posted yet. Use the helper above to write your first listing.</p>
        ) : (
          <div className="grid">
            {mine.map((l) => (
              <div key={l.id} className="panel listing-card">
                <span className="price-tag">${(l.price_cents / 100).toFixed(0)}</span>
                <h3>{l.title}</h3>
                <span className="meta">{l.category}</span>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
