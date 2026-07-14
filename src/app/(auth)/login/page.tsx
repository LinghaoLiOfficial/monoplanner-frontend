"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { LogIn } from "lucide-react";
import { useRouter } from "next/navigation";

import { RedirectByRole } from "@/components/auth/RedirectByRole";
import { useAuth } from "@/components/auth/AuthProvider";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
  const router = useRouter();
  const { loginWithPassword } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!username.trim() || !password) {
      setError("请输入用户名和密码");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const user = await loginWithPassword({
        username: username.trim(),
        password,
      });
      const redirectTo = new URLSearchParams(window.location.search).get("redirectTo");
      router.replace(user.role === "admin" ? "/admin" : redirectTo || "/projects");
    } catch (err) {
      setError(err instanceof Error ? err.message : "登录失败");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <RedirectByRole>
      <main className="mx-auto flex min-h-screen w-full max-w-7xl items-center justify-center px-6 py-10 md:px-10 lg:px-12">
        <div className="grid w-full max-w-5xl gap-6 lg:grid-cols-[1fr_0.9fr]">
          <section className="flex flex-col justify-center rounded-[1.75rem] border border-border/60 bg-card/80 p-8 shadow-sm">
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-border bg-background px-4 py-2 text-sm text-muted-foreground">
              <LogIn className="size-4" />
              Monoplanner Auth
            </div>
            <h1 className="mt-6 max-w-xl text-4xl font-semibold tracking-tight">
              登录
            </h1>
            <p className="mt-4 max-w-xl text-sm leading-7 text-muted-foreground">
              使用用户名和密码登录，登录态由后端 HttpOnly cookie 保持。
            </p>
          </section>

          <Card>
            <CardHeader>
              <CardTitle>登录账号</CardTitle>
              <CardDescription>使用用户名和密码登录</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4" onSubmit={handleSubmit}>
                {error ? (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                ) : null}

                <div className="space-y-2">
                  <Label htmlFor="username">用户名</Label>
                  <Input
                    id="username"
                    value={username}
                    onChange={(event) => setUsername(event.target.value)}
                    autoComplete="username"
                    disabled={submitting}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">密码</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    autoComplete="current-password"
                    disabled={submitting}
                  />
                </div>

                <Button type="submit" className="w-full" disabled={submitting}>
                  {submitting ? "正在登录..." : "登录"}
                </Button>
              </form>

              <p className="mt-5 text-center text-sm text-muted-foreground">
                还没有账号？{" "}
                <Link href="/register" className="font-medium text-foreground underline-offset-4 hover:underline">
                  去注册
                </Link>
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </RedirectByRole>
  );
}
