"use client";
import { useActionState } from "react";

export default function AuthForm({ action, mode }) {
  const [state, formAction, pending] = useActionState(action, null);
  return (
    <form action={formAction} className="stack">
      {mode === "signup" && (
        <label>Name<input id="name" name="name" autoComplete="name" required /></label>
      )}
      <label>Email<input id="email" name="email" type="email" autoComplete="email" required /></label>
      <label>
        Password
        <input id="password" name="password" type="password" minLength={8} required
          autoComplete={mode === "signup" ? "new-password" : "current-password"} />
      </label>
      {state?.error && <p className="error" role="alert">{state.error}</p>}
      <button className="btn" disabled={pending}>
        {pending ? "One moment…" : mode === "signup" ? "Create account" : "Log in"}
      </button>
    </form>
  );
}
