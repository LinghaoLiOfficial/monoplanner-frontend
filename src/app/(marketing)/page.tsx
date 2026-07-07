import Link from "next/link";

import { MarketingHero } from "@/components/layout/marketing-hero";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { projectSections } from "@/features/dashboard/data";

export default function MarketingPage() {
  return (
    <>
      <MarketingHero />

      <section id="features" className="grid gap-4 py-10 md:grid-cols-3">
        {[
          "支持官网、登录页和后台控制台的多场景前端工程",
          "具备 features 分层、页面边界、主题切换和请求基础设施",
          "适合继续接入鉴权、权限、API 模块、表格与表单体系",
        ].map((item, index) => (
          <div
            key={item}
            className="rounded-[1.5rem] border border-border/60 bg-card/70 p-5"
          >
            <div className="text-sm text-muted-foreground">0{index + 1}</div>
            <p className="mt-3 text-base leading-7">{item}</p>
          </div>
        ))}
      </section>

      <section id="structure" className="grid gap-4 pb-10 lg:grid-cols-[1.1fr_0.9fr]">
        <Card>
          <CardHeader>
            <CardTitle>推荐目录策略</CardTitle>
            <CardDescription>
              当前项目按照“路由负责组装，features 承载业务域，components 沉淀公共 UI”的原则组织。
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {projectSections.map((item, index) => (
              <div key={item}>
                <div className="text-sm font-medium">0{index + 1}</div>
                <p className="mt-2 text-sm leading-7 text-muted-foreground">{item}</p>
                {index < projectSections.length - 1 ? (
                  <Separator className="mt-4" />
                ) : null}
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>项目开发建议</CardTitle>
            <CardDescription>
              这个仓库现在已经是 fullstack-forge-frontend 的项目基础仓库，而不是一次性 demo 页面。
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm leading-7 text-muted-foreground">
            <p>1. 在 `src/config/site.ts` 统一维护站点信息与导航。</p>
            <p>2. 在 `src/features` 中按业务域拆分 schema、api、hooks 和组件。</p>
            <p>3. 在 `src/app/(dashboard)` 中继续扩展受保护路由和后台页面。</p>
            <p>4. 为每个关键页面补充 `loading.tsx`、`error.tsx` 与空态处理。</p>
            <p>5. 登录页、middleware、会话 cookie 和表格能力也已具备基础占位。</p>
            <div className="pt-2">
              <Button asChild>
                <Link href="/dashboard">查看后台页面</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>
    </>
  );
}
