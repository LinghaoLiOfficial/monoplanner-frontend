import { LoginForm } from "@/components/demo/login-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type LoginPageProps = {
  searchParams: Promise<{
    redirectTo?: string;
  }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-7xl items-center justify-center px-6 py-10 md:px-10 lg:px-12">
      <div className="grid w-full max-w-5xl gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-[2rem] border border-border/60 bg-card/80 p-8 shadow-sm">
          <div className="inline-flex rounded-full border border-border bg-background px-4 py-2 text-sm text-muted-foreground">
            fullstack-forge Auth
          </div>
          <h1 className="mt-6 max-w-xl text-4xl font-semibold tracking-tight">
            登录 fullstack-forge-frontend
          </h1>
          <p className="mt-4 max-w-xl text-sm leading-7 text-muted-foreground">
            这个页面配合 `middleware.ts`、登录 API Route 和服务端 session
            读取逻辑，构成了当前项目的登录与受保护路由基础实现。
          </p>
          <div className="mt-8 grid gap-3 text-sm text-muted-foreground sm:grid-cols-2">
            <div className="rounded-2xl bg-background/80 px-4 py-3">Middleware 路由保护</div>
            <div className="rounded-2xl bg-background/80 px-4 py-3">HTTP Only Session Cookie</div>
            <div className="rounded-2xl bg-background/80 px-4 py-3">表单校验与错误提示</div>
            <div className="rounded-2xl bg-background/80 px-4 py-3">登录后重定向支持</div>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>登录账号</CardTitle>
            <CardDescription>
              请输入邮箱和密码。当前为项目示例，任意符合规则的邮箱和 6
              位以上密码即可通过。
            </CardDescription>
          </CardHeader>
          <CardContent>
            <LoginForm redirectTo={params.redirectTo} />
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
