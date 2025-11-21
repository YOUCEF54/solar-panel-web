"use client";

import { useAuth } from "@/components/AuthProvider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProtectedLayout({ children }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/auth/login");
    }
  }, [loading, user, router]);

  useEffect(() => {
  console.log("PROTECTED LAYOUT → user:", user, "loading:", loading);
}, [user, loading]);


  if (loading) return <div>Loading...</div>;

  return <>{children}</>;
}
