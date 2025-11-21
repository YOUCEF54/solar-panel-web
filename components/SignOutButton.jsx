"use client";

import { logout } from "@/lib/auth";
import { useRouter } from "next/navigation";

export default function SignOutButton() {
  const router = useRouter();

  async function handleLogout() {
    await logout();
    router.push("/login");
  }

  return (
    <button
      onClick={handleLogout}
      style={{ padding: "10px 20px", background: "lightgray" }}
    >
      Logout
    </button>
  );
}
