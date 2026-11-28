"use client";

export default function LogoutButton() {
  return (
    <button
      className="adm-btn ghost adm-logout"
      type="button"
      onClick={async () => {
        await fetch("/api/admin/logout", { method: "POST" }).catch(() => null);
        window.location.href = "/admin/login";
      }}
    >
      Log out
    </button>
  );
}
