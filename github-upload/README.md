# Reduce, Reuse, CampusSupplies

A student-only marketplace for buying and selling furniture and decor from college homes. Built for ENGR 310.

## Features
- **Homepage** – what it is, who it's for, and pricing (`app/page.js`)
- **Accounts** – sign up, log in, stay logged in for 30 days. Passwords are hashed with bcrypt and stored in **Neon Postgres** (`app/actions.js`, `lib/auth.js`)
- **AI listing helper** – upload a photo or a few words and Claude writes the title, description, category and a fair student price (`app/api/ai/listing/route.js`)
- **Stripe checkout** – Seller Pro subscription, $4.99/month, in Stripe test mode (`app/api/checkout/route.js`)
- **Demo account** – created by `npm run setup-db` with full Pro access

## Setup
1. Copy `.env.example` to `.env.local` and fill in each value.
2. `npm install`
3. `npm run setup-db` – creates the tables and the demo account
4. `npm run dev` – open http://localhost:3000

## Deploy
Import this repo in Vercel and add the same variables from `.env.local` under Project → Settings → Environment Variables.

Stripe test card: `4242 4242 4242 4242`, any future date, any CVC.
