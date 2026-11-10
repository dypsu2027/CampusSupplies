import Link from "next/link";
import "./globals.css";
import { currentUser } from "@/lib/auth";
import { logout } from "./actions";

export const metadata = {
  title: "Reduce, Reuse, CampusSupplies",
  description: "A student-only marketplace for buying and selling furniture and decor from college homes.",
};

export default async function RootLayout({ children }) {
  let user = null;
  try { user = await currentUser(); } catch {}
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Caveat:wght@500&family=Bricolage+Grotesque:opsz,wght@12..96,500;12..96,700;12..96,800&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@500&display=swap" />
      </head>
      <body>
        <nav className="nav">
          <div className="nav-inner">
            <Link href="/" className="brand">Reduce, Reuse, CampusSupplies</Link>
            <Link href="/listings">Browse</Link>
            {user ? (
              <>
                <Link href="/dashboard">Dashboard</Link>
                <form action={logout}><button className="linkbtn" type="submit">Log out</button></form>
              </>
            ) : (
              <>
                <Link href="/login">Log in</Link>
                <Link href="/signup" className="btn">Sign up</Link>
              </>
            )}
          </div>
        </nav>
        {children}
      </body>
    </html>
  );
}
