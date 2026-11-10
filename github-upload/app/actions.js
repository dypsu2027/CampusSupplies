"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { sql } from "@/lib/db";
import { startSession, endSession, currentUser } from "@/lib/auth";

const emailOk = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

export async function signup(_prev, formData) {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (!name) return { error: "Enter your name." };
  if (!emailOk(email)) return { error: "Enter a valid email address." };
  if (password.length < 8) return { error: "Use a password with at least 8 characters." };

  const existing = await sql`SELECT id FROM users WHERE email = ${email}`;
  if (existing.length) return { error: "An account with that email already exists. Log in instead." };

  const hash = await bcrypt.hash(password, 10);
  const rows = await sql`
    INSERT INTO users (email, name, password_hash) VALUES (${email}, ${name}, ${hash})
    RETURNING id`;
  await startSession(rows[0].id);
  redirect("/dashboard");
}

export async function login(_prev, formData) {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  const rows = await sql`SELECT id, password_hash FROM users WHERE email = ${email}`;
  const user = rows[0];
  if (!user || !(await bcrypt.compare(password, user.password_hash))) {
    return { error: "That email and password don't match an account." };
  }
  await startSession(user.id);
  redirect("/dashboard");
}

export async function logout() {
  await endSession();
  redirect("/");
}

export async function saveListing(_prev, formData) {
  const user = await currentUser();
  if (!user) redirect("/login");

  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const category = String(formData.get("category") ?? "Other").trim();
  const condition = String(formData.get("condition") ?? "Good").trim();
  const pickup = String(formData.get("pickup_note") ?? "").trim();
  const price = Math.round(Number(formData.get("price")) * 100);

  if (!title || !description) return { error: "Add a title and description first." };
  if (!Number.isFinite(price) || price < 0) return { error: "Enter a price in dollars, like 25." };

  await sql`
    INSERT INTO listings (user_id, title, description, category, condition, price_cents, pickup_note)
    VALUES (${user.id}, ${title}, ${description}, ${category}, ${condition}, ${price}, ${pickup || null})`;
  return { ok: true, message: "Listing posted." };
}
