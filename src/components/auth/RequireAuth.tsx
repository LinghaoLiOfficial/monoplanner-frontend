"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

import { useAuth } from "@/components/auth/AuthProvider";
import { LoadingState } from "@/components/common/LoadingState";
import { buildLoginRequiredUrl } from "@/lib/auth/login-required";

export function RequireAuth({
  children,
  redirectAdmin = false,
}: {
  children: React.ReactNode;
  redirectAdmin?: boolean;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { loading, authenticated, isAdmin } = useAuth();

  useEffect(() => {
    if (loading) {
      return;
    }

    if (!authenticated) {
      const redirectTo = `${pathname}${window.location.search}`;
      router.replace(buildLoginRequiredUrl(redirectTo));
      return;
    }

    if (redirectAdmin && isAdmin) {
      router.replace("/admin");
    }
  }, [authenticated, isAdmin, loading, pathname, redirectAdmin, router]);

  if (loading || !authenticated || (redirectAdmin && isAdmin)) {
    return <LoadingState label="正在检查登录状态..." />;
  }

  return children;
}
