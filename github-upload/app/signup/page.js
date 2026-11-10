import Link from "next/link";
import { redirect } from "next/navigation";
import AuthForm from "../AuthForm";
import { signup } from "../actions";
import { currentUser } from "@/lib/auth";

export const metadata = { title: "Sign up · Reduce, Reuse, CampusSupplies" };

export default async function SignupPage() {
  if (await currentUser()) redirect("/dashboard");
  return (
    <main className="narrow">
      <h1>Create your account</h1>
      <p className="muted">Use your school email so buyers know you're a student.</p>
      <AuthForm action={signup} mode="signup" />
      <p className="muted">Already have an account? <Link href="/login">Log in</Link></p>
    </main>
  );
}
