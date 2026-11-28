import { redirect } from "next/navigation";
import { adminEnabled, isAdmin } from "@/lib/auth";
import LoginForm from "@/components/admin/LoginForm";

export const dynamic = "force-dynamic";
export const metadata = { title: "Login" };

export default async function LoginPage() {
  if (await isAdmin()) redirect("/admin");
  return (
    <main className="adm-login">
      <div className="adm-card">
        <p className="adm-brand">Salad Street · Admin</p>
        <h1>Sign in</h1>
        {adminEnabled() ? (
          <LoginForm />
        ) : (
          <p className="adm-note">Admin login isn&apos;t set up yet. The password needs to be added on the server (ADMIN_PASSWORD).</p>
        )}
      </div>
    </main>
  );
}
