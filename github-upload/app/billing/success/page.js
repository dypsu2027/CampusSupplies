import Link from "next/link";
import { redirect } from "next/navigation";
import { currentUser } from "@/lib/auth";
import { stripe } from "@/lib/stripe";
import { sql } from "@/lib/db";

export const metadata = { title: "Welcome to Seller Pro" };

export default async function Success({ searchParams }) {
  const user = await currentUser();
  if (!user) redirect("/login");
  const { session_id } = await searchParams;

  let upgraded = false;
  if (session_id) {
    const s = await stripe().checkout.sessions.retrieve(session_id);
    if (s.status === "complete" && s.client_reference_id === String(user.id)) {
      await sql`UPDATE users SET plan = 'pro', stripe_customer_id = ${s.customer} WHERE id = ${user.id}`;
      upgraded = true;
    }
  }

  return (
    <main className="narrow stack">
      <span className="label">Billing</span>
      <h1>{upgraded ? "You're on Seller Pro" : "We couldn't confirm your payment"}</h1>
      <p className="muted">
        {upgraded
          ? "Thanks! Your account now has unlimited AI listings and featured placement."
          : "If you completed checkout, refresh this page in a moment. Otherwise head back to your dashboard and try again."}
      </p>
      <Link className="btn" href="/dashboard">Go to your dashboard</Link>
    </main>
  );
}
