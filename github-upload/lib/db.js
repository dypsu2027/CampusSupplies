import { neon } from "@neondatabase/serverless";

let _sql;
export function sql(strings, ...values) {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not set. Add your Neon connection string to .env.local (or Vercel env vars).");
  }
  _sql ??= neon(process.env.DATABASE_URL);
  return _sql(strings, ...values);
}

export { FREE_AI_LIMIT } from "./plans";
