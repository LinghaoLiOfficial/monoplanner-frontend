"use client";

import Link from "next/link";
import { ShieldCheck, Users } from "lucide-react";

import { AdminShell } from "@/components/admin/AdminShell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminPage() {
  return (
    <AdminShell>
      <div className="space-y-6 pb-12">
        <div>
          <p className="text-sm text-muted-foreground">Admin</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">管理员控制面板</h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground">
            管理非管理员用户的角色、状态和显示名称。
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <div className="mb-3 flex size-11 items-center justify-center rounded-2xl bg-secondary">
                <Users className="size-5" />
              </div>
              <CardTitle>用户管理</CardTitle>
              <CardDescription>查看、搜索、修改、启用或禁用非管理员用户</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild>
                <Link href="/admin/users">进入用户管理</Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="mb-3 flex size-11 items-center justify-center rounded-2xl bg-secondary">
                <ShieldCheck className="size-5" />
              </div>
              <CardTitle>权限边界</CardTitle>
              <CardDescription>admin 只进入管理面板，普通角色使用项目工作台</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    </AdminShell>
  );
}
