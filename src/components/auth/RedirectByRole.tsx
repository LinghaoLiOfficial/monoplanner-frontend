"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { LoadingState } from "@/components/common/LoadingState";
import { useAuth } from "@/components/auth/AuthProvider";

type RedirectByRoleProps = {
  children?: React.ReactNode;
  redirectTo?: string;
};

export function RedirectByRole({ children, redirectTo }: RedirectByRoleProps) {
  const router = useRouter();
  const { loading, user, isAdmin } = useAuth();

  useEffect(() => {
    if (loading || !user) {
      return;
    }

    router.replace(redirectTo ?? (isAdmin ? "/admin" : "/projects"));
  }, [isAdmin, loading, redirectTo, router, user]);

  if (loading) {
    return <LoadingState label="正在恢复登录态..." />;
  }

  if (user) {
    return <LoadingState label="正在跳转..." />;
  }

  return children ?? null;
}
