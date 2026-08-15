import Link from "next/link";
import { ArrowRight, Braces, Code2, Database, FileJson, Workflow } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const capabilities = [
  {
    title: "生成项目蓝图",
    description: "把业务目标、角色、流程和约束整理成结构化项目蓝图",
    icon: FileJson,
  },
  {
    title: "生成 API 契约草案",
    description: "为后续前后端联调沉淀接口边界和数据交换预期",
    icon: Workflow,
  },
  {
    title: "生成数据库模型草案",
    description: "从需求中识别核心实体、关系和字段方向",
    icon: Database,
  },
  {
    title: "生成指令集合",
    description: "面向前端/后端 vibe coding 工具输出可执行指令集合",
    icon: Code2,
  },
];

const vibeCodingComparison = [
  {
    point: "1. 需求控制",
    traditional: "依赖模糊提示词，AI 容易自行补全需求，造成范围漂移",
    agile: "通过用户故事、验收标准和 Sprint Goal 明确目标，减少误解和返工",
  },
  {
    point: "2. 开发节奏",
    traditional: "倾向一次生成大量代码，修改范围大、问题难定位",
    agile: "按小任务和垂直功能切片迭代，逐步生成、验证和交付",
  },
  {
    point: "3. 代码质量",
    traditional: "重“能运行”轻架构，容易产生重复代码、技术债务和不可维护逻辑",
    agile: "通过架构规范、代码评审、Definition of Done 和持续重构保障可维护性",
  },
  {
    point: "4. 测试与安全",
    traditional: "容易缺少系统测试、权限校验和异常处理，AI 输出也常被直接采信",
    agile: "将自动化测试、安全检查、独立审查和人工验收作为强制质量门禁",
  },
  {
    point: "5. 交付与风险",
    traditional: "常直接修改主干或上线，缺少版本管理、监控和回滚机制",
    agile: "通过分支、PR、CI/CD、预览环境、灰度发布和复盘实现可控交付",
  },
];

export default function MarketingPage() {
  return (
    <div className="space-y-12 pb-20">
      <section className="grid min-h-[460px] items-center gap-8 lg:grid-cols-[1.05fr_0.95fr]">
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
              将自然语言业务需求转化为适合 vibe coding 工具使用的结构化开发上下文和指令集合
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link href="/projects">
                进入我的项目
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
            <CardTitle>产品闭环</CardTitle>
            <CardDescription>从需求到蓝图、契约、模型与指令集合的可联调骨架</CardDescription>
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

      <section className="space-y-6 pb-20 pt-10 md:pt-16">
        <div className="space-y-3">
          <h2 className="text-3xl font-semibold tracking-tight">
            敏捷开发下的 Vibe Coding 对比
          </h2>
          <p className="max-w-3xl text-base leading-8 text-muted-foreground">
            将 AI 生成能力纳入用户故事、验收标准、代码评审和持续交付流程，让产出更可控、更易维护
          </p>
        </div>

        <Card className="overflow-hidden bg-card/80">
          <CardContent className="p-0">
            <Table className="min-w-[860px]">
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[160px]">核心要点</TableHead>
                  <TableHead>传统 Vibe Coding 的劣势</TableHead>
                  <TableHead>敏捷开发下 Vibe Coding 的优势</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {vibeCodingComparison.map((item) => (
                  <TableRow key={item.point}>
                    <TableCell className="font-semibold text-foreground">
                      {item.point}
                    </TableCell>
                    <TableCell className="min-w-80 leading-7 text-muted-foreground">
                      {item.traditional}
                    </TableCell>
                    <TableCell className="min-w-96 leading-7 text-muted-foreground">
                      {item.agile}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
