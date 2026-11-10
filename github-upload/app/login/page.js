import Link from "next/link";
import { redirect } from "next/navigation";
import AuthForm from "../AuthForm";
import { login } from "../actions";
import { currentUser } from "@/lib/auth";

export const metadata = { title: "Log in · Reduce, Reuse, CampusSupplies" };

export default async function LoginPage() {
  if (await currentUser()) redirect("/dashboard");
  return (
    <main className="narrow">
      <h1>Welcome back</h1>
      <AuthForm action={login} mode="login" />
      <p className="muted">New here? <Link href="/signup">Create an account</Link></p>
    </main>
  );
}
