"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { Skeleton } from "@/components/ui/skeleton";

export default function HomePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  useEffect(() => {
    if (loading) return;
    if (!user) router.replace("/login");
    else if (user.isAdmin) router.replace("/admin");
    else router.replace("/dashboard");
  }, [user, loading, router]);
  return (
    <div className="flex h-screen items-center justify-center bg-background">
      <Skeleton className="w-8 h-8 rounded-full" />
    </div>
  );
}
