import { NextResponse } from "next/server";
import { currentUser } from "@/lib/auth";
import { stripe, PRO } from "@/lib/stripe";

export async function POST(req) {
  const user = await currentUser();
  const origin = new URL(req.url).origin;
  if (!user) return NextResponse.redirect(`${origin}/login`, 303);

  const session = await stripe().checkout.sessions.create({
    mode: "subscription",
    customer_email: user.email,
    client_reference_id: String(user.id),
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: "usd",
          unit_amount: PRO.priceCents,
          recurring: { interval: PRO.interval },
          product_data: {
            name: PRO.name,
            description: "Unlimited AI listings and featured placement on Reduce, Reuse, CampusSupplies",
          },
        },
      },
    ],
    success_url: `${origin}/billing/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/dashboard?checkout=cancelled`,
  });

  return NextResponse.redirect(session.url, 303);
}
