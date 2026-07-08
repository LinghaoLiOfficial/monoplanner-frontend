# Project Technical Documentation

## Overview

本项目是“全栈上下文编排器”前端，基于 `Next.js 16 + React 19 + TypeScript 5 + Tailwind CSS 4 + shadcn/ui 风格组件 + pnpm`。当前已完成第二批可联调产品骨架：用户可以从首页进入项目列表，创建项目，进入工作台，保存自然语言需求，生成 Project Blueprint，并继续生成/查看 API 契约草案、数据库模型草案、Context Packs / Codex Prompts 和一致性检查结果。

## Architecture

- 使用 `src/` 目录结构和 Next.js App Router。
- 新主流程位于 `/` 与 `/projects` 系列路由，不依赖 `/dashboard` 登录保护。
- 项目、需求、蓝图、API 契约、数据库模型、Context Packs、一致性检查请求封装在 `src/lib/api`。
- 核心类型位于 `src/lib/types`，字段按任务定义并已对照真实 OpenAPI；后端业务接口默认直接返回实体或实体数组。
- `src/lib/api/client.ts` 基于 `fetch`，从 `NEXT_PUBLIC_API_BASE_URL` 读取后端地址；站内 `/api` 路由仍走 `NEXT_PUBLIC_APP_URL` 以保证旧模板页面可运行。
- 页面请求状态使用 React 内置状态，不新增 React Query/SWR/Redux/Zustand 用法。
- 主题切换使用本地轻量主题上下文，避免 `next-themes` 在 React 19/Next 16 开发环境中注入脚本导致 hydration 警告。

## Key Files and Directories

- `src/app/(marketing)/page.tsx`: 首页，展示产品名称、说明、能力和项目入口。
- `src/app/projects`: 项目列表、新建项目、工作台、需求页、蓝图页、API 契约页、数据库模型页、Prompts 页、一致性检查页。
- `src/components/project/ProjectWorkspaceNav.tsx`: 项目内导航，覆盖工作台、需求、蓝图、API 契约、数据库模型、Prompts、一致性检查。
- `src/components/project/GenerationActionPanel.tsx`: 第二批生成操作区，支持独立 loading/error/success 状态。
- `src/components/common/JsonViewer.tsx` 和 `CopyButton.tsx`: 复用 JSON 展示和复制能力，复制按钮支持失败态。
- `src/components/contract`: API 契约查看、endpoint 表格和 schema 列表。
- `src/components/db-model`: 数据库模型查看、entity 字段表、relationship/index 列表；后端 `entities[].relationships` 为 relationship 对象数组。
- `src/components/prompts`: Context Pack 列表、详情、Prompt 查看、Markdown 导出。
- `src/components/consistency`: 一致性检查状态面板和检查项列表。
- `src/lib/api/{api-contracts,db-models,context-packs,consistency}.ts`: 第二批后端接口封装。
- `src/lib/types/{api-contract,db-model,context-pack,consistency}.ts`: 第二批领域类型。

## Setup and Runbook

配置后端地址：

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api/v1
```

常用命令：

```bash
pnpm dev
pnpm lint
pnpm exec tsc --noEmit
pnpm build
pnpm start
```

联调流程：

1. 启动后端服务，确认 API 前缀为 `http://localhost:8000/api/v1`。
2. 启动前端：`pnpm dev`。
3. 打开 `http://localhost:3000`。
4. 进入 `/projects`，创建项目。
5. 在 `/projects/{projectId}` 保存需求并生成蓝图草案。
6. 使用第二批生成操作区生成 API 契约、数据库模型、Context Packs。
7. 分别进入 `/api-contract`、`/db-model`、`/prompts`、`/consistency` 页面查看结果。

## Testing and Verification

- `pnpm lint` 通过。
- `pnpm exec tsc --noEmit` 通过。
- `pnpm build` 通过。
- 已读取 `http://127.0.0.1:8000/openapi.json` 并对照前端 API client/type。
- 已用只读 GET 验证现有项目、第二批列表接口和无 Blueprint 的一致性检查响应。
- 尚未执行生成类 POST 做完整真实联调，以避免额外写入后端数据库。

## Current Decisions and Conventions

- 后端业务接口默认直接返回任务定义中的实体或实体数组，不实现旧响应结构兼容层。
- 创建需求时前端发送 `language: "zh-CN"` 与 `source_type: "manual"` 作为最小默认值。
- 最新蓝图、API 契约、数据库模型按 `version` 降序优先，版本相同再按 `created_at` 降序选择。
- Context Packs 按 `created_at` 降序展示，默认选择最新一条；由于当前类型没有批次字段，不做复杂分组。
- 后端 OpenAPI 中 `ApiContractDraftResponse.content`、`DbModelDraftResponse.content`、`ContextPackResponse.content` 是通用 object；前端 viewer 对关键数组字段做运行时容错。
- 本批不实现真实 AI、登录注册、复杂权限、图谱可视化或拖拽编辑器。

## Known Issues and Follow-ups

- `/dashboard`、`/login` 等旧模板页面仍存在，但不作为新主流程入口。
- 需要真实后端验证项目不存在、生成前无需求、生成接口 400、后端未启动、复制失败、导出失败等状态是否符合产品预期。
- 后续第三批可考虑真实 LLM 集成、产物版本对比、Context Pack 批次概念、端到端测试和更精细的联调监控。
