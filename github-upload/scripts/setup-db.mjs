// Creates the tables in your Neon database and the demo account.
// Run with: npm run setup-db   (reads .env.local)
import { readFileSync } from "node:fs";
import { neon } from "@neondatabase/serverless";
import bcrypt from "bcryptjs";

const { DATABASE_URL, DEMO_EMAIL, DEMO_PASSWORD } = process.env;
if (!DATABASE_URL) throw new Error("Set DATABASE_URL in .env.local first.");
const sql = neon(DATABASE_URL);

const schema = readFileSync(new URL("../lib/schema.sql", import.meta.url), "utf8");
for (const stmt of schema.split(";").map((s) => s.trim()).filter(Boolean)) {
  await sql.query(stmt);
}
console.log("Tables ready.");

if (DEMO_EMAIL && DEMO_PASSWORD) {
  const hash = await bcrypt.hash(DEMO_PASSWORD, 10);
  const [demo] = await sql`
    INSERT INTO users (email, name, password_hash, plan)
    VALUES (${DEMO_EMAIL.toLowerCase()}, 'Demo Student', ${hash}, 'pro')
    ON CONFLICT (email) DO UPDATE SET password_hash = EXCLUDED.password_hash, plan = 'pro'
    RETURNING id`;
  const [{ count }] = await sql`SELECT count(*)::int AS count FROM listings WHERE user_id = ${demo.id}`;
  if (count === 0) {
    await sql`INSERT INTO listings (user_id, title, description, category, condition, price_cents, pickup_note) VALUES
      (${demo.id}, 'Grey 3-seat couch, lightly used', 'Comfy grey fabric couch from our living room. No stains or tears, cushions still firm. About 80 inches long, so bring a friend and a van or SUV.', 'Seating', 'Good', 4500, 'Near campus, available May 8-12'),
      (${demo.id}, 'White IKEA desk with drawer', 'Simple white desk that fits a dorm room. Light scratches on top, drawer slides smoothly. Legs unscrew for easy transport.', 'Tables & Desks', 'Good', 2000, 'Pick up any weekday after 4pm'),
      (${demo.id}, 'Warm-white string lights (2 sets)', 'Two 20-foot plug-in string lights. All bulbs work. Great for dorm walls.', 'Lighting', 'Like new', 800, 'Can meet on campus')`;
  }
  console.log(`Demo account ready: ${DEMO_EMAIL} (Seller Pro).`);
} else {
  console.log("DEMO_EMAIL / DEMO_PASSWORD not set; skipped the demo account.");
}
