import Link from "next/link";
import { ArrowRight, Braces, Code2, Database, FileJson, Workflow } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const capabilities = [
  {
    title: "生成 Project Blueprint",
    description: "把业务目标、角色、流程和约束整理成结构化项目蓝图。",
    icon: FileJson,
  },
  {
    title: "生成 API 契约草案",
    description: "为后续前后端联调沉淀接口边界和数据交换预期。",
    icon: Workflow,
  },
  {
    title: "生成数据库模型草案",
    description: "从需求中识别核心实体、关系和字段方向。",
    icon: Database,
  },
  {
    title: "生成 Codex prompts",
    description: "面向前端/后端 vibe coding 工具输出可执行提示词包。",
    icon: Code2,
  },
];

export default function MarketingPage() {
  return (
    <div className="space-y-14 pb-12">
      <section className="grid min-h-[520px] items-center gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="space-y-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-card/70 px-4 py-2 text-sm text-muted-foreground">
            <Braces className="size-4" />
            面向全栈开发的上下文工作台
          </div>
          <div className="space-y-5">
            <h1 className="max-w-4xl text-5xl font-semibold tracking-tight md:text-6xl">
              全栈上下文编排器
            </h1>
            <p className="max-w-2xl text-lg leading-9 text-muted-foreground">
              将自然语言业务需求转化为适合 vibe coding 工具使用的结构化开发上下文和提示词包。
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link href="/projects">
                进入项目列表
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/projects/new">创建新项目</Link>
            </Button>
          </div>
        </div>

        <Card className="overflow-hidden bg-card/80">
          <CardHeader>
            <CardTitle>第二批产品闭环</CardTitle>
            <CardDescription>从需求到蓝图、契约、模型与 prompt pack 的可联调骨架。</CardDescription>
          </CardHeader>
          <CardContent>
            <pre className="rounded-[1.5rem] border border-border/60 bg-muted/40 p-4 font-mono text-xs leading-6">
              <code>{`{
  "project": "业务系统",
  "requirements": ["自然语言需求"],
  "blueprint": "结构化开发上下文",
  "outputs": ["api-contract", "db-model", "prompts"]
}`}</code>
            </pre>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {capabilities.map((item) => (
          <Card key={item.title} className="bg-card/80">
            <CardHeader>
              <div className="mb-3 flex size-11 items-center justify-center rounded-2xl bg-secondary">
                <item.icon className="size-5" />
              </div>
              <CardTitle className="text-lg">{item.title}</CardTitle>
              <CardDescription>{item.description}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </section>
    </div>
  );
}
