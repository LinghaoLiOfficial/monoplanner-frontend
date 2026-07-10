# Project Technical Documentation

## Overview

本项目是“全栈上下文编排器”前端，基于 `Next.js 16 + React 19 + TypeScript 5 + Tailwind CSS 4 + shadcn/ui 风格组件 + pnpm`。当前已完成可联调产品骨架：用户可以从首页进入项目列表，搜索、创建和删除项目，进入工作台，保存自然语言需求，生成项目蓝图，并继续生成/查看 API 契约草案、数据库模型草案、指令集合和一致性检查结果。

## Architecture

- 使用 `src/` 目录结构和 Next.js App Router。
- 新主流程位于 `/` 与 `/projects` 系列路由，不依赖 `/dashboard` 登录保护。
- 项目、需求、蓝图、API 契约、数据库模型、指令集合、一致性检查请求封装在 `src/lib/api`。
- 核心类型位于 `src/lib/types`，字段按任务定义并已对照真实 OpenAPI；后端业务接口默认直接返回实体或实体数组。
- `src/lib/api/client.ts` 基于 `fetch`，从 `NEXT_PUBLIC_API_BASE_URL` 读取后端地址；站内 `/api` 路由仍走 `NEXT_PUBLIC_APP_URL` 以保证旧模板页面可运行。
- 页面请求状态使用 React 内置状态，不新增 React Query/SWR/Redux/Zustand 用法。
- `/projects` 列表页使用 React state + 300ms debounce 调用 `listProjects(q)`；删除项目使用全局 `ConfirmDialog`，确认后调用 `deleteProject(projectId)` 并刷新当前搜索结果。
- 主题切换使用本地轻量主题上下文，避免 `next-themes` 在 React 19/Next 16 开发环境中注入脚本导致 hydration 警告。

### 项目工作流与产物关系

- `工作台` 是单个项目的编排入口，加载项目、业务需求和蓝图列表；用户可在此录入需求、生成最新项目蓝图，并触发第二批产物生成。
- `业务需求` 是自然语言输入源，字段包括 `raw_text`、`language`、`source_type`，当前前端默认以 `zh-CN` 和 `manual` 保存。
- `蓝图` 是从项目需求生成的上层设计产物，带 `version`、`title`、`summary` 和通用 JSON `content`；后续 API 契约、数据库模型、指令集合、一致性检查都要求项目已有蓝图。
- `API 契约` 是基于蓝图生成的接口草案，记录 `blueprint_id`、`base_path`、resources、endpoints、schemas 和错误模型等。
- `数据库模型` 是基于蓝图生成的数据草案，记录 `blueprint_id`、数据库/ORM/迁移工具信息、entities、fields、relationships、indexes 和迁移说明。
- `指令集合` 即 Context Packs，是面向不同工程角色的 Codex prompt 产物；可引用 `blueprint_id`、`api_contract_id`、`db_model_id`，核心展示字段是 `prompt_text`，并支持 Markdown 导出。
- `一致性检查` 是校验视角，不是持久编辑产物；它检查 `blueprint`、`api_contract`、`db_model`、`context_pack` 之间是否存在信息缺失、冲突或警告，返回总体 `status` 与按来源标注的检查项。

## Key Files and Directories

- `src/app/(marketing)/page.tsx`: 首页，展示产品名称、说明、能力和项目入口；首页中文案统一使用“产品闭环”“项目蓝图”“指令集合”，能力卡片后追加“敏捷开发下的 Vibe Coding 对比”响应式表格，比较传统 Vibe Coding 与敏捷开发约束下的差异；该表格区块与上方能力卡片保持额外上边距。
- `src/components/layout/AppShell.tsx` 和 `src/components/layout/TopNav.tsx`: 新主流程外壳与顶部导航；`TopNav` 是 client component，使用 `usePathname()` 高亮当前导航项，并使用 `sticky top-6` 与外壳 `py-6` 保持一致，避免滚动时从初始位置跳到视口顶部。
- `src/app/projects`: 项目列表、新建项目、工作台、需求页、蓝图页、API 契约页、数据库模型页、指令集合页、一致性检查页；项目列表支持搜索、删除确认和删除后刷新。具体项目内各页面标题区不使用 `Project Workspace`、`Requirements`、`Blueprints` 等英文 eyebrow；需求页标题为“原始用户需求”，采用“新用户需求”在上、“用户需求历史”在下的上下布局。
- `src/components/common/ConfirmDialog.tsx` 与 `src/components/ui/alert-dialog.tsx`: 基于 Radix AlertDialog 的全局确认弹窗，用于危险操作确认。
- `src/components/project/ProjectWorkspaceNav.tsx`: 项目内导航，覆盖工作台、用户需求、蓝图、API 契约、数据库模型、指令集合、一致性检查。
- `src/components/project/GenerationActionPanel.tsx`: 第二批生成操作区，支持独立 loading/error/success 状态。
- `src/components/common/JsonViewer.tsx` 和 `CopyButton.tsx`: 复用 JSON 展示和复制能力，复制按钮支持失败态。
- `src/components/contract`: API 契约查看、endpoint 表格和 schema 列表。
- `src/components/db-model`: 数据库模型查看、entity 字段表、relationship/index 列表；后端 `entities[].relationships` 为 relationship 对象数组。
- `src/components/prompts`: Context Pack 列表、详情、Prompt 查看、Markdown 导出。
- `src/components/consistency`: 一致性检查状态面板和检查项列表。
- `src/lib/api/projects.ts`: 项目接口封装，包含 `listProjects(q?)`、`getProjects()`、`createProject()`、`getProject()`、`updateProject()` 和 `deleteProject()`。
- `src/components/project/ProjectForm.tsx`: 创建项目表单，只保留必填项目名称，提交时只发送 `{ name }`；失败错误直接展示上层 API client 解析出的后端信息。项目列表卡片和工作台头部不展示项目描述。
- `src/components/requirement/RequirementEditor.tsx`: 需求输入卡片默认标题为“需求输入”，可通过 `title`、`hideLabel`、`submitButton` 在特定页面覆盖标题、隐藏字段标签或使用圆形 icon 提交按钮；需求页当前覆盖为“新用户需求”，textarea 与向上箭头提交按钮在同一个有背景的输入容器中上下排列，按钮位于容器底部右下角。
- `src/components/requirement/RequirementList.tsx`: 需求历史条目左侧展示语言和来源 badge，右侧展示创建日期；该组件同时复用于工作台和业务需求页。
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
5. 在 `/projects` 搜索项目名称，或通过项目卡片的“删除”按钮打开确认弹窗并删除项目。
6. 在 `/projects/{projectId}` 保存需求并生成蓝图草案。
7. 使用第二批生成操作区生成 API 契约、数据库模型、指令集合。
8. 分别进入 `/api-contract`、`/db-model`、`/prompts`、`/consistency` 页面查看结果。

## Testing and Verification

- `pnpm lint` 通过。
- `pnpm exec tsc --noEmit` 通过。
- `pnpm build` 通过。
- 已用浏览器验证首页文案、能力卡片桌面/移动底部留白、无横向滚动、顶部导航高亮规则和创建项目表单字段。
- 首页 Vibe Coding 对比表新增后，`pnpm lint` 与 `pnpm exec tsc --noEmit` 通过。
- 已读取 `http://127.0.0.1:8000/openapi.json` 并对照前端 API client/type。
- 已用只读 GET 验证现有项目、第二批列表接口和无 Blueprint 的一致性检查响应。
- 尚未执行生成类 POST 做完整真实联调，以避免额外写入后端数据库。

## Current Decisions and Conventions

- 后端业务接口默认直接返回任务定义中的实体或实体数组，不实现旧响应结构兼容层。
- 创建需求时前端发送 `language: "zh-CN"` 与 `source_type: "manual"` 作为最小默认值。
- 最新蓝图、API 契约、数据库模型按 `version` 降序优先，版本相同再按 `created_at` 降序选择。
- 指令集合按 `created_at` 降序展示，默认选择最新一条；由于当前类型没有批次字段，不做复杂分组。
- 后端 OpenAPI 中 `ApiContractDraftResponse.content`、`DbModelDraftResponse.content`、`ContextPackResponse.content` 是通用 object；前端 viewer 对关键数组字段做运行时容错。
- 项目列表搜索不同步 URL query；删除失败优先在确认弹窗内展示错误并保持弹窗打开。
- 全局页面背景由 `src/app/globals.css` 的 `body` 控制，背景渐变只渲染首屏高度并禁用重复铺贴，滚动后的长页面区域使用基础 `--background` 色承接。
- 顶部导航栏应保持 `sticky top-6`，以匹配页面容器顶部间距；不要改回 `top-0`，否则滚动时会产生 y 轴位置变化。
- 顶部导航高亮规则：`/projects` 与 `/projects/{projectId}` 高亮“项目列表”，`/projects/new` 高亮“新建项目”，首页 `/` 不高亮项目导航。
- 创建项目请求只提交 `name`；`Project.description` 响应字段仍保留为 `string | null`，但 `CreateProjectPayload` 不再包含 `description`。
- 项目描述字段仅作为后端兼容字段保留，当前项目列表和工作台界面不展示“项目描述”或“暂无项目描述”。
- 主流程页面和相关组件的用户可见硬编码中文文案不使用全角句号 `。`；旧模板页面、README 和项目记忆文档不纳入该约定。
- 创建项目失败时复用 `ApiError.message`，后端 409 返回 `{ detail: "项目名称已存在，请使用其他名称。" }` 时会展示该具体错误。
- 本批不实现真实 AI、登录注册、复杂权限、图谱可视化或拖拽编辑器。

## Known Issues and Follow-ups

- `/dashboard`、`/login` 等旧模板页面仍存在，但不作为新主流程入口。
- 需要真实后端验证项目搜索、删除项目、项目不存在、生成前无需求、生成接口 400、后端未启动、复制失败、导出失败等状态是否符合产品预期。
- 后续可考虑 URL query 同步、服务端分页、撤销/回收站、权限控制、删除审计、真实 LLM 集成、产物版本对比、Context Pack 批次概念、端到端测试和更精细的联调监控。
