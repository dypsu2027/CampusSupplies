import Link from "next/link";
import { PRO, FREE_FEATURES, PRO_FEATURES } from "@/lib/plans";

const SAMPLE = [
  { price: 45, title: "Grey 3-seat couch", meta: "0.4 mi · gone by May 12", tilt: -2 },
  { price: 20, title: "White IKEA desk", meta: "0.8 mi · legs unscrew", tilt: 1.5 },
  { price: 8, title: "String lights, 2 sets", meta: "On campus · like new", tilt: -1 },
];

const FAQ = [
  ["Who can join?", "Anyone with a school email. Accounts are for students only, so you're always buying from and selling to other students."],
  ["How do payments for items work?", "Buyer and seller agree on a price in person or through the listing and meet up for pickup. Seller Pro is the only thing the site charges for."],
  ["Can I cancel Seller Pro?", "Yes, any time. Most sellers subscribe for move-out month and cancel once they've cleared out."],
  ["What does the AI actually do?", "It looks at your photo and notes, writes an honest title and description, picks a category and condition, and suggests a fair price for the student resale market with a low-high range."],
];

export default function Home() {
  return (
    <>
      <section className="hero">
        <div className="hero-inner">
          <div className="hero-copy">
            <span className="label">Student-only marketplace</span>
            <h1 className="hero-title">
              Your couch has one more <span className="mark">semester</span> in it.
            </h1>
            <p className="lede">
              Reduce, Reuse, CampusSupplies helps college students sell the furniture and decor they can't take with
              them, and helps the next student furnish a room for a fraction of retail. A few blocks from campus,
              never the curb.
            </p>
            <div className="row">
              <Link className="btn btn-lg" href="/signup">Create a free account</Link>
              <Link className="btn btn-lg secondary" href="/listings">Browse listings</Link>
            </div>
          </div>
          <div className="board" aria-label="Example listings">
            {SAMPLE.map((s) => (
              <div className="flyer" key={s.title} style={{ transform: `rotate(${s.tilt}deg)` }}>
                <span className="price-tag">${s.price}</span>
                <div className="flyer-body">
                  <strong>{s.title}</strong>
                  <span className="meta">{s.meta}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <main>
        <section className="stack">
          <span className="label">The problem</span>
          <h2>Move-out week wastes good furniture and real money.</h2>
          <div className="grid stats">
            <div><strong className="stat">1 week</strong><p className="muted">Most leases end within days of each other, so everyone is selling at once.</p></div>
            <div><strong className="stat">Curb</strong><p className="muted">Where couches, desks and lamps end up when there's no quick way to sell them.</p></div>
            <div><strong className="stat">Full price</strong><p className="muted">What incoming students pay for the same items a few blocks away.</p></div>
          </div>
        </section>

        <section className="stack">
          <span className="label">How it works</span>
          <h2>Listed in a minute, picked up by Friday.</h2>
          <ol className="steps">
            <li><div><h3>Sign up with your school email</h3><p className="muted">Every buyer and seller is a verified student.</p></div></li>
            <li><div><h3>Snap a photo</h3><p className="muted">The AI listing helper writes the title, description and a fair price.</p></div></li>
            <li><div><h3>Meet up and hand it off</h3><p className="muted">Pick a pickup time that works before your move-out date.</p></div></li>
          </ol>
        </section>

        <section className="ai-demo">
          <div className="stack">
            <span className="label">AI listing helper</span>
            <h2>You type eight words. It writes the listing.</h2>
            <p className="muted">
              Upload a photo or jot down a few details. The helper writes an honest description, picks the category
              and condition, and suggests a price based on what students actually pay for used furniture.
            </p>
          </div>
          <div className="demo-pair">
            <div className="panel note">
              <span className="label">You write</span>
              <p className="handwritten">ikea malm dresser white, one drawer sticks, 2 yrs old</p>
            </div>
            <div className="panel">
              <span className="label">It writes</span>
              <div className="row"><span className="price-tag">$40</span><span className="meta">Range $30–$55</span></div>
              <h3>White IKEA Malm 6-drawer dresser</h3>
              <p className="muted">
                Sturdy white Malm dresser, two years old. Five drawers glide smoothly; one sticks a little but works.
                Light wear on top. Heavy, so bring a friend and a car with fold-down seats.
              </p>
              <span className="meta">Storage · Good condition</span>
            </div>
          </div>
        </section>

        <section className="stack" id="pricing">
          <span className="label">Pricing</span>
          <h2>Free to list. Pro when it's time to clear out.</h2>
          <div className="plans">
            <div className="panel plan">
              <h3>Free</h3>
              <p className="plan-price">$0</p>
              <ul className="checks">{FREE_FEATURES.map((f) => <li key={f}>{f}</li>)}</ul>
              <Link className="btn secondary" href="/signup">Start free</Link>
            </div>
            <div className="panel plan plan-pro">
              <div className="row"><h3>{PRO.name}</h3><span className="pill pro">Most popular in May</span></div>
              <p className="plan-price">{PRO.priceLabel}<span className="muted"> / {PRO.interval}</span></p>
              <ul className="checks">{PRO_FEATURES.map((f) => <li key={f}>{f}</li>)}</ul>
              <p className="muted">{PRO.pitch}</p>
              <Link className="btn" href="/signup">Get {PRO.name}</Link>
            </div>
          </div>
        </section>

        <section className="stack">
          <span className="label">Questions</span>
          <h2>Good to know</h2>
          <div className="faq">
            {FAQ.map(([q, a]) => (
              <details key={q}>
                <summary>{q}</summary>
                <p className="muted">{a}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="cta">
          <h2>Moving out soon? List your first item tonight.</h2>
          <Link className="btn btn-lg" href="/signup">Create a free account</Link>
        </section>
      </main>

      <footer className="site-footer">
        <div>Reduce, Reuse, CampusSupplies · ENGR 310 · Devon</div>
      </footer>
    </>
  );
}
