"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { RefreshCw, Search, Save } from "lucide-react";

import { AdminShell } from "@/components/admin/AdminShell";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  disableAdminUser,
  enableAdminUser,
  listAdminUsers,
  updateAdminUser,
} from "@/lib/api/admin";
import type { AdminUser, NonAdminUserRole } from "@/lib/types/user";

const nonAdminRoles: NonAdminUserRole[] = [
  "user",
  "vip-plus",
  "vip-pro",
  "vip-pro-max",
];

function formatDateTime(value?: string | null) {
  if (!value) {
    return "未记录";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function UserRow({
  user,
  onUpdated,
}: {
  user: AdminUser;
  onUpdated: (user: AdminUser) => void;
}) {
  const [role, setRole] = useState<NonAdminUserRole>(user.role);
  const [displayName, setDisplayName] = useState(user.display_name ?? "");
  const [saving, setSaving] = useState(false);
  const [toggling, setToggling] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const hasChanges = role !== user.role || displayName !== (user.display_name ?? "");

  const handleSave = async () => {
    if (!hasChanges || saving) {
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const updatedUser = await updateAdminUser(user.id, {
        role,
        display_name: displayName.trim() || null,
      });
      onUpdated(updatedUser);
    } catch (err) {
      setError(err instanceof Error ? err.message : "保存用户失败");
    } finally {
      setSaving(false);
    }
  };

  const handleToggleActive = async () => {
    if (toggling) {
      return;
    }

    setToggling(true);
    setError(null);

    try {
      const updatedUser = user.is_active
        ? await disableAdminUser(user.id)
        : await enableAdminUser(user.id);
      onUpdated(updatedUser);
    } catch (err) {
      setError(err instanceof Error ? err.message : "更新用户状态失败");
    } finally {
      setToggling(false);
    }
  };

  return (
    <TableRow>
      <TableCell>
        <div className="font-medium">{user.username}</div>
        {error ? <div className="mt-1 text-xs text-destructive">{error}</div> : null}
      </TableCell>
      <TableCell className="min-w-60 text-muted-foreground">{user.email}</TableCell>
      <TableCell className="min-w-52">
        <Input
          value={displayName}
          onChange={(event) => setDisplayName(event.target.value)}
          placeholder="显示名称"
          disabled={saving || toggling}
        />
      </TableCell>
      <TableCell>
        <select
          value={role}
          onChange={(event) => setRole(event.target.value as NonAdminUserRole)}
          disabled={saving || toggling}
          className="h-10 min-w-36 rounded-2xl border border-input bg-background px-3 text-sm outline-none transition-all focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
        >
          {nonAdminRoles.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </TableCell>
      <TableCell>
        <Badge variant={user.is_active ? "secondary" : "destructive"}>
          {user.is_active ? "已启用" : "已禁用"}
        </Badge>
      </TableCell>
      <TableCell>
        <Badge variant={user.is_email_verified ? "secondary" : "outline"}>
          {user.is_email_verified ? "已验证" : "未验证"}
        </Badge>
      </TableCell>
      <TableCell className="min-w-44 text-muted-foreground">
        {formatDateTime(user.created_at)}
      </TableCell>
      <TableCell className="min-w-44 text-muted-foreground">
        {formatDateTime(user.last_login_at)}
      </TableCell>
      <TableCell>
        <div className="flex min-w-48 gap-2">
          <Button
            type="button"
            size="sm"
            variant="outline"
            disabled={!hasChanges || saving || toggling}
            onClick={handleSave}
          >
            <Save className="size-4" />
            保存
          </Button>
          <Button
            type="button"
            size="sm"
            variant={user.is_active ? "destructive" : "outline"}
            disabled={saving || toggling}
            onClick={handleToggleActive}
          >
            {user.is_active ? "禁用" : "启用"}
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(20);
  const [search, setSearch] = useState("");
  const [role, setRole] = useState<NonAdminUserRole | "">("");
  const [isActive, setIsActive] = useState<"all" | "active" | "disabled">("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(total / pageSize)),
    [pageSize, total]
  );

  const loadUsers = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await listAdminUsers({
        q: search.trim() || undefined,
        role: role || undefined,
        is_active: isActive === "all" ? undefined : isActive === "active",
        page,
        page_size: pageSize,
      });
      setUsers(response.items);
      setTotal(response.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : "加载用户列表失败");
    } finally {
      setLoading(false);
    }
  }, [isActive, page, pageSize, role, search]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadUsers();
    }, 300);

    return () => window.clearTimeout(timer);
  }, [loadUsers]);

  const handleUpdated = (updatedUser: AdminUser) => {
    setUsers((current) =>
      current.map((user) => (user.id === updatedUser.id ? updatedUser : user))
    );
  };

  return (
    <AdminShell>
      <div className="space-y-6 pb-12">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Admin Users</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight">用户管理</h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground">
              管理所有非管理员用户，不允许设置 admin 角色。
            </p>
          </div>
          <Button variant="outline" onClick={() => void loadUsers()} disabled={loading}>
            <RefreshCw className="size-4" />
            刷新
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>筛选</CardTitle>
            <CardDescription>按用户名、邮箱、角色和状态筛选用户</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 lg:grid-cols-[1fr_180px_180px]">
              <div className="space-y-2">
                <Label htmlFor="admin-user-search">搜索</Label>
                <div className="relative">
                  <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="admin-user-search"
                    value={search}
                    onChange={(event) => {
                      setSearch(event.target.value);
                      setPage(1);
                    }}
                    className="pl-10"
                    placeholder="搜索用户名或邮箱"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="admin-user-role">角色</Label>
                <select
                  id="admin-user-role"
                  value={role}
                  onChange={(event) => {
                    setRole(event.target.value as NonAdminUserRole | "");
                    setPage(1);
                  }}
                  className="h-10 w-full rounded-2xl border border-input bg-background px-3 text-sm outline-none transition-all focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
                >
                  <option value="">全部角色</option>
                  {nonAdminRoles.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="admin-user-status">状态</Label>
                <select
                  id="admin-user-status"
                  value={isActive}
                  onChange={(event) => {
                    setIsActive(event.target.value as "all" | "active" | "disabled");
                    setPage(1);
                  }}
                  className="h-10 w-full rounded-2xl border border-input bg-background px-3 text-sm outline-none transition-all focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
                >
                  <option value="all">全部状态</option>
                  <option value="active">已启用</option>
                  <option value="disabled">已禁用</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {error ? (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : null}

        <Card>
          <CardHeader>
            <CardTitle>用户列表</CardTitle>
            <CardDescription>
              共 {total} 个用户，当前第 {page} / {totalPages} 页
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="rounded-[1.5rem] border border-border/70 bg-muted/30 p-8 text-center text-sm text-muted-foreground">
                正在加载用户列表...
              </div>
            ) : users.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>用户名</TableHead>
                    <TableHead>邮箱</TableHead>
                    <TableHead>显示名称</TableHead>
                    <TableHead>角色</TableHead>
                    <TableHead>状态</TableHead>
                    <TableHead>邮箱</TableHead>
                    <TableHead>注册时间</TableHead>
                    <TableHead>最近登录</TableHead>
                    <TableHead>操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <UserRow key={user.id} user={user} onUpdated={handleUpdated} />
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="rounded-[1.5rem] border border-border/70 bg-muted/30 p-8 text-center text-sm text-muted-foreground">
                暂无匹配用户
              </div>
            )}

            <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
              <div className="text-sm text-muted-foreground">
                每页 {pageSize} 条
              </div>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={page <= 1 || loading}
                  onClick={() => setPage((current) => Math.max(1, current - 1))}
                >
                  上一页
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={page >= totalPages || loading}
                  onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
                >
                  下一页
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminShell>
  );
}
