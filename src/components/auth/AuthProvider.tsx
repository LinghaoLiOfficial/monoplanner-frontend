"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

import { ApiError } from "@/lib/api/client";
import {
  getCurrentUser,
  login,
  logout,
  register,
  updateMe,
} from "@/lib/api/auth";
import type { LoginInput, RegisterInput, UpdateMeInput } from "@/lib/types/auth";
import type { CurrentUser } from "@/lib/types/user";

type AuthContextValue = {
  user: CurrentUser | null;
  loading: boolean;
  error: string | null;
  authenticated: boolean;
  isAdmin: boolean;
  refreshUser: () => Promise<void>;
  loginWithPassword: (input: LoginInput) => Promise<CurrentUser>;
  registerWithCode: (input: RegisterInput) => Promise<CurrentUser>;
  logoutUser: () => Promise<void>;
  updateCurrentUser: (input: UpdateMeInput) => Promise<CurrentUser>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshUser = useCallback(async () => {
    setError(null);

    try {
      setUser(await getCurrentUser());
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        setUser(null);
        return;
      }

      setError(err instanceof Error ? err.message : "恢复登录态失败");
      setUser(null);
    }
  }, []);

  useEffect(() => {
    let mounted = true;

    async function restoreSession() {
      setLoading(true);
      await refreshUser();

      if (mounted) {
        setLoading(false);
      }
    }

    void restoreSession();

    return () => {
      mounted = false;
    };
  }, [refreshUser]);

  const loginWithPassword = useCallback(async (input: LoginInput) => {
    const response = await login(input);
    setUser(response.user);
    setError(null);
    return response.user;
  }, []);

  const registerWithCode = useCallback(async (input: RegisterInput) => {
    await register(input);

    const response = await login({
      email: input.email,
      password: input.password,
    });
    setError(null);
    setUser(response.user);
    return response.user;
  }, []);

  const logoutUser = useCallback(async () => {
    try {
      await logout();
    } finally {
      setUser(null);
      setError(null);
    }
  }, []);

  const updateCurrentUser = useCallback(async (input: UpdateMeInput) => {
    const updatedUser = await updateMe(input);
    setUser(updatedUser);
    setError(null);
    return updatedUser;
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      error,
      authenticated: Boolean(user),
      isAdmin: user?.role === "admin",
      refreshUser,
      loginWithPassword,
      registerWithCode,
      logoutUser,
      updateCurrentUser,
    }),
    [
      user,
      loading,
      error,
      refreshUser,
      loginWithPassword,
      registerWithCode,
      logoutUser,
      updateCurrentUser,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
}
