import { sql } from "@/lib/db";

export const metadata = { title: "Browse · Reduce, Reuse, CampusSupplies" };
export const dynamic = "force-dynamic";

export default async function Listings() {
  const rows = await sql`
    SELECT l.id, l.title, l.description, l.category, l.condition, l.price_cents, l.pickup_note,
           u.name AS seller, u.plan = 'pro' AS featured
    FROM listings l JOIN users u ON u.id = l.user_id
    ORDER BY (u.plan = 'pro') DESC, l.created_at DESC
    LIMIT 100`;
  return (
    <main>
      <section className="stack">
        <span className="label">Browse</span>
        <h1>Furniture and decor near campus</h1>
      </section>
      {rows.length === 0 ? (
        <p className="muted">No listings yet. Sign up and be the first to post.</p>
      ) : (
        <div className="grid">
          {rows.map((l) => (
            <article key={l.id} className="panel listing-card">
              <div className="row">
                <span className="price-tag">${(l.price_cents / 100).toFixed(0)}</span>
                {l.featured && <span className="pill pro">Featured seller</span>}
              </div>
              <h3>{l.title}</h3>
              <p className="muted">{l.description}</p>
              <span className="meta">{l.category} · {l.condition} · Seller: {l.seller.split(" ")[0]}{l.pickup_note ? ` · ${l.pickup_note}` : ""}</span>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}
