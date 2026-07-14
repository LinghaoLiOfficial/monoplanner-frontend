"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { LogOut, Settings, Shield, UserRound } from "lucide-react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/components/auth/AuthProvider";
import { UserAvatar } from "@/components/user/UserAvatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function UserMenu() {
  const router = useRouter();
  const menuRef = useRef<HTMLDivElement | null>(null);
  const { user, isAdmin, logoutUser } = useAuth();
  const [open, setOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    function handlePointerDown(event: PointerEvent) {
      if (!menuRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, []);

  if (!user) {
    return (
      <div className="flex items-center gap-2">
        <Button asChild variant="ghost" size="sm">
          <Link href="/login">登录</Link>
        </Button>
        <Button asChild size="sm">
          <Link href="/register">注册</Link>
        </Button>
      </div>
    );
  }

  const displayName = user.display_name || user.username;

  const handleLogout = async () => {
    if (loggingOut) {
      return;
    }

    setLoggingOut(true);
    await logoutUser();
    setLoggingOut(false);
    router.replace("/login");
  };

  return (
    <div ref={menuRef} className="relative">
      <button
        type="button"
        className="flex items-center gap-2 rounded-full border border-border bg-background px-2 py-1.5 text-left shadow-xs transition-colors hover:bg-muted"
        onClick={() => setOpen((current) => !current)}
        aria-expanded={open}
        aria-haspopup="menu"
      >
        <UserAvatar
          username={user.username}
          displayName={user.display_name}
          bgColor={user.avatar_bg_color}
          size="sm"
        />
        <span className="hidden max-w-28 truncate text-sm font-medium md:inline">
          {displayName}
        </span>
      </button>

      {open ? (
        <div
          role="menu"
          className="absolute right-0 top-12 z-50 w-72 rounded-[1.5rem] border border-border bg-card p-3 shadow-lg"
        >
          <div className="flex items-center gap-3 border-b border-border/70 px-2 pb-3">
            <UserAvatar
              username={user.username}
              displayName={user.display_name}
              bgColor={user.avatar_bg_color}
            />
            <div className="min-w-0">
              <div className="truncate text-sm font-semibold">{displayName}</div>
              <div className="truncate text-xs text-muted-foreground">{user.email}</div>
              <Badge variant="outline" className="mt-2">
                {user.role}
              </Badge>
            </div>
          </div>

          <div className="mt-2 space-y-1">
            {isAdmin ? (
              <Button asChild variant="ghost" className="w-full justify-start">
                <Link href="/admin" onClick={() => setOpen(false)}>
                  <Shield className="size-4" />
                  管理员控制面板
                </Link>
              </Button>
            ) : null}
            <Button asChild variant="ghost" className="w-full justify-start">
              <Link href="/account" onClick={() => setOpen(false)}>
                <UserRound className="size-4" />
                个人资料
              </Link>
            </Button>
            {isAdmin ? (
              <Button asChild variant="ghost" className="w-full justify-start">
                <Link href="/admin/users" onClick={() => setOpen(false)}>
                  <Settings className="size-4" />
                  用户管理
                </Link>
              </Button>
            ) : null}
            <Button
              type="button"
              variant="ghost"
              className="w-full justify-start text-destructive hover:text-destructive"
              disabled={loggingOut}
              onClick={handleLogout}
            >
              <LogOut className="size-4" />
              {loggingOut ? "正在退出..." : "退出登录"}
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
