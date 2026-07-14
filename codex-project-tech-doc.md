# Project Technical Documentation

## Overview

本项目是“全栈上下文编排器”前端，基于 `Next.js 16 + React 19 + TypeScript 5 + Tailwind CSS 4 + shadcn/ui 风格组件 + pnpm`。当前已完成可联调产品骨架：用户可以注册、登录、恢复 HttpOnly cookie 登录态，普通用户进入项目工作台，管理员进入控制面板；普通用户可搜索、创建和删除项目，保存自然语言需求，生成业务需求故事和项目蓝图，并继续生成/查看 API 契约草案、数据库模型草案、指令集合和一致性检查结果。

## Architecture

- 使用 `src/` 目录结构和 Next.js App Router。
- 新主流程位于 `/`、`/login`、`/register`、`/account`、`/admin` 与 `/projects` 系列路由，不依赖旧 `/dashboard` 登录保护。
- 全局认证由 `src/components/auth/AuthProvider.tsx` 提供，启动时调用 `/auth/me` 恢复登录态；前端不读取、不保存 token，只依赖后端 HttpOnly cookie。
- `RequireAuth` 保护普通业务页面，`RequireAdmin` 保护管理员页面；admin 用户访问普通项目路由会跳转 `/admin`，普通用户访问 admin 页面会显示无权限。
- 项目、需求、业务需求故事、蓝图、API 契约、数据库模型、指令集合、一致性检查请求封装在 `src/lib/api`。
- 认证和管理员接口封装在 `src/lib/api/auth.ts` 与 `src/lib/api/admin.ts`，用户类型位于 `src/lib/types/auth.ts` 与 `src/lib/types/user.ts`。
- 核心类型位于 `src/lib/types`，字段按任务定义并已对照真实 OpenAPI；后端业务接口默认直接返回实体或实体数组。
- `src/lib/api/client.ts` 基于 `fetch`，从 `NEXT_PUBLIC_API_BASE_URL` 读取后端地址，默认带 `credentials: "include"`；站内 `/api` 路由仍走 `NEXT_PUBLIC_APP_URL` 以保证旧模板页面可运行；`ApiError` 区分 fetch 网络错误和 HTTP 错误，并同时暴露 `detail`/`details` 兼容字段。
- `src/lib/api/streaming.ts` 保留 legacy `streamPost<TBody>()`，用于兼容旧 `text/event-stream` POST 接口，并同样带 `credentials: "include"`；当前页面主流程不再调用 `/stream`，而是普通 POST 生成完成后重新读取数据库结果。
- `src/lib/api/generation-errors.ts` 统一格式化业务需求故事、蓝图、API 契约、数据库模型生成错误：400 显示上游缺失提示，502/503 显示大模型调用或配置问题，只有 `status = 0` 才显示后端连接失败。
- 页面请求状态使用 React 内置状态，不新增 React Query/SWR/Redux/Zustand 用法。
- `/projects` 列表页使用 React state + 300ms debounce 调用 `listProjects(q)`；删除项目使用全局 `ConfirmDialog`，确认后调用 `deleteProject(projectId)` 并刷新当前搜索结果。
- 主题切换使用本地轻量主题上下文，避免 `next-themes` 在 React 19/Next 16 开发环境中注入脚本导致 hydration 警告。

### 项目工作流与产物关系

- `工作台` 是单个项目的编排入口，加载项目、用户需求和蓝图列表；用户可在此录入需求、查看最新项目蓝图，并触发第二批产物生成；项目蓝图生成前必须先在蓝图页完成技术栈首次配置。
- `用户需求` 是自然语言输入源，字段包括 `raw_text`、`language`、`source_type`，当前前端默认以 `zh-CN` 和 `manual` 保存。
- `业务需求池` 位于用户需求和蓝图之间，展示 LLM 从用户需求中拆解出的业务需求故事；故事包含优先级、状态、用户故事、业务范围、数据规则、验收标准和可选垂直切片说明，并支持前端更新优先级/状态、双击编辑故事正文相关字段、确认删除单条故事。
- `蓝图` 是从项目需求、业务需求池和 Project 上保存的目标前后端技术栈生成的上层设计产物，带 `version`、`title`、`summary` 和通用 JSON `content`；后续 API 契约、数据库模型、指令集合、一致性检查都要求项目已有蓝图。
- `API 契约` 是基于蓝图生成的接口草案，记录 `blueprint_id`、`base_path`、resources、endpoints、schemas 和错误模型等。
- `数据库模型` 是基于蓝图生成的数据草案，记录 `blueprint_id`、数据库/ORM/迁移工具信息、entities、fields、relationships、indexes 和迁移说明。
- `指令集合` 即 Context Packs，是面向不同工程角色的 Codex prompt 产物；可引用 `blueprint_id`、`api_contract_id`、`db_model_id`，核心展示字段是 `prompt_text`，并支持 Markdown 导出。
- `一致性检查` 是校验视角，不是持久编辑产物；它检查 `blueprint`、`api_contract`、`db_model`、`context_pack` 之间是否存在信息缺失、冲突或警告，返回总体 `status` 与按来源标注的检查项。

## Key Files and Directories

- `src/app/(marketing)/page.tsx`: 首页，展示产品名称、说明、能力和项目入口；首页中文案统一使用“产品闭环”“项目蓝图”“指令集合”，能力卡片后追加“敏捷开发下的 Vibe Coding 对比”响应式表格，比较传统 Vibe Coding 与敏捷开发约束下的差异；该表格区块与上方能力卡片保持额外上边距。
- `src/app/(auth)/login/page.tsx` 与 `src/app/register/page.tsx`: 新认证入口，登录使用用户名和密码，注册使用邮箱验证码、用户名、密码和确认密码；注册页保留强密码校验但不展示逐条密码规则，验证码、用户名、密码、确认密码均为单列整行输入；注册成功后立即用注册用户名和密码调用登录接口以写入后端 HttpOnly cookie，并固定跳转 `/projects`；登录成功后按角色分流到 `/admin` 或 `/projects`。
- `src/app/account/page.tsx`: 个人资料页，展示邮箱、角色、头像和状态，支持修改用户名、显示名称和可选新密码，保存后同步 `AuthProvider`。
- `src/app/admin/page.tsx` 与 `src/app/admin/users/page.tsx`: 管理员控制面板和用户管理页；用户管理支持搜索、角色筛选、状态筛选、分页、修改非 admin 角色、修改显示名称和启用/禁用。
- `src/components/auth`: 认证上下文、路由守卫、角色分流和密码强度规则 UI。
- `src/components/user`: 用户头像和顶部用户菜单；头像使用显示名或用户名首字母，优先使用后端 `avatar_bg_color`，缺失时按用户名稳定生成背景色；普通用户菜单包含“个人资料”“退出登录”，管理员菜单额外包含“管理员控制面板”和“用户管理”，不重复放置项目列表入口。
- `src/components/admin/AdminShell.tsx`: admin 页面专用外壳，避免管理员进入普通项目工作台导航。
- `src/components/layout/AppShell.tsx` 和 `src/components/layout/TopNav.tsx`: 新主流程外壳与顶部导航；`TopNav` 是 client component，使用 `sticky top-6` 与外壳 `py-6` 保持一致，避免滚动时从初始位置跳到视口顶部；顶部只保留右侧“项目”“新建”快捷按钮，不再重复显示“项目列表”“新建项目”文字导航；已登录用户显示头像菜单，主题按钮位于用户按钮右侧，未登录用户显示登录/注册入口。
- `src/app/projects`: 项目列表、新建项目、工作台、用户需求页、业务需求池页、蓝图页、API 契约页、数据库模型页、指令集合页、一致性检查页；项目列表支持搜索、删除确认和删除后刷新。具体项目内各页面标题区不使用 `Project Workspace`、`Requirements`、`Blueprints` 等英文 eyebrow；需求页标题为“原始用户需求”，采用“新用户需求”在上、“用户需求历史”在下的上下布局，保存需求成功后立即结束编辑器保存态并在后台触发该需求的业务需求故事普通生成请求；蓝图、API 契约和数据库模型页面不再显示左侧版本选择卡片，默认直接展示最新产物详情，并提供普通生成按钮；蓝图页额外提供“技术栈配置”卡片，用于首次配置 Project 的目标前端和后端技术栈，配置保存后前端只读锁定，页面不再展示业务需求池检测提示框。
- `src/components/common/ConfirmDialog.tsx` 与 `src/components/ui/alert-dialog.tsx`: 基于 Radix AlertDialog 的全局确认弹窗，用于危险操作确认。
- `src/components/project/ProjectWorkspaceNav.tsx`: 项目内导航，覆盖工作台、项目蓝图、原始用户需求、敏捷业务需求、API 契约、数据库模型、指令集合、一致性检查；导航顺序引导用户先进入项目蓝图配置前后端技术栈，再录入原始用户需求。
- `src/app/projects/[projectId]/business-stories/page.tsx` 与 `src/components/business-stories`: 敏捷业务需求页面和展示组件，采用左侧“需求总览”加右侧“业务需求池”的双栏布局；总览列出所有业务需求故事标题和优先级标识，点击标题会切换右侧列表分页并在右侧列表内部滚动到对应故事卡片，避免页面整体滚动后左侧总览离开视口，条目不显示选中高亮；右侧业务需求池不提供手动“生成业务需求故事”按钮，故事生成由原始用户需求保存流程或其他上游入口触发；列表按每页 5 条本地分页展示故事卡片、优先级/状态 badge、通过原生下拉控件更新优先级和状态、双击编辑用户故事/业务范围/数据规则/验收标准，以及通过卡片右上角叉叉按钮触发全局确认框删除单条故事；故事卡片中优先级 badge 与优先级下拉选项均简化显示为 `P1`、`P2`、`P3`、`P4`，优先级和状态下拉框使用紧凑宽度；列表头部原刷新按钮改为前端自动模式开关，启用前通过全局确认框确认，未启用和已启用按钮分别显示不同 icon，已启用态使用项目红色 `destructive` 按钮样式；垂直切片说明置顶并使用棕色主题文本，用户故事、数据规则和验收标准正文各使用单个块状背景。
- `src/components/project/GenerationActionPanel.tsx`: 工作台生成操作区，业务需求故事、项目蓝图、API 契约、数据库模型使用普通 generate 接口，支持独立 loading/error/success 状态；项目蓝图生成在未完成技术栈首次配置时禁用并引导到蓝图页，依赖蓝图的操作在无蓝图时禁用，并复用统一生成错误格式化。
- `src/components/blueprint/TechStackConfigCard.tsx`: 蓝图页技术栈配置卡片，包含前端/后端 textarea、保存配置、恢复默认、保存中和失败提示；状态 badge 仅显示“未配置”或“已配置”，已配置项目的输入区只读，保存与恢复默认入口隐藏。
- `src/lib/project-tech-stack.ts`: Project 技术栈配置状态判断工具；两个技术栈字段非空且不只是前端默认占位值时视为已配置，或在本页刚保存成功、项目已有蓝图时视为已配置。
- `src/components/common/SavedGenerationPanel.tsx`: 普通生成面板，封装按钮、spinner、长请求说明、成功提示和错误展示；页面传入 `onGenerate()`，由调用方在成功后重新读取数据库列表。
- `src/components/common/StreamingGenerationPanel.tsx` 与 `src/components/common/StreamingOutputViewer.tsx`: legacy 流式生成 UI，保留代码但当前页面主流程不再使用。
- `src/components/common/JsonViewer.tsx` 和 `CopyButton.tsx`: 复用 JSON 展示和复制能力，复制按钮支持失败态。
- `src/components/ui/pagination.tsx`: 通用分页条，单页时隐藏；页码文案采用“第 m / n 页”并在分页条内水平居中，上一页/下一页按钮靠右。
- `src/components/contract`: API 契约查看、endpoint 表格和 schema 列表。
- `src/components/db-model`: 数据库模型查看、entity 字段表、relationship/index 列表；后端 `entities[].relationships` 为 relationship 对象数组。
- `src/components/prompts`: Context Pack 列表、详情、Prompt 查看、Markdown 导出。
- `src/components/consistency`: 一致性检查状态面板和检查项列表。
- `src/lib/api/projects.ts`: 项目接口封装，包含 `listProjects(q?)`、`getProjects()`、`createProject()`、`getProject()`、`updateProject()` 和 `deleteProject()`。
- `src/lib/constants/project.ts`: Project 相关前端常量，包含默认前端技术栈 `DEFAULT_FRONTEND_STACK` 和默认后端技术栈 `DEFAULT_BACKEND_STACK`。
- `src/components/project/ProjectForm.tsx`: 创建项目表单，只保留必填项目名称，提交时只发送 `{ name }`；失败错误直接展示上层 API client 解析出的后端信息。项目列表卡片和工作台头部不展示项目描述。
- `src/components/requirement/RequirementEditor.tsx`: 需求输入卡片默认标题为“需求输入”，可通过 `title`、`hideLabel`、`submitButton` 在特定页面覆盖标题、隐藏字段标签或使用圆形 icon 提交按钮；需求页当前覆盖为“新用户需求”，textarea 与向上箭头提交按钮在同一个有背景的输入容器中上下排列，按钮位于容器底部右下角；支持 `disabled` 和 `disabledMessage`，用于存在进行中历史需求时禁用输入框和提交按钮；保存成功后不显示卡片内确认提示，仅保留失败错误提示。
- `src/components/requirement/RequirementList.tsx`: 需求历史按每页 5 条本地分页；条目左侧展示语言、来源和进度状态 badge，右侧展示创建日期，默认显示摘要，右下角“展开/收起”按钮用于展开全文并再次收起，按钮沿用项目普通按钮风格但使用更紧凑的高度、内边距、字号和三角 icon，文字左侧使用实心三角 icon 区分展开和收起方向；条目底部展示业务需求故事更新进度文字和 0-100 横向进度条，进度状态统一为 `进行中`、`成功`、`失败`，并通过 `progress_status` 或 `business_story_generation.status` 派生；进度文案优先使用后端 `progress_text`、`progress_label`、`message`，展示前会清理尾部 `。`、`.`、`…`，本地兜底文案不带句号；原始用户需求页传入重试回调时，每条历史在展开按钮左侧常驻展示同样紧凑普通按钮风格的“重试”按钮，左侧使用 `RotateCcw` icon，只有成功或失败状态可点击，进行中状态禁用；点击“重试”先打开全局确认弹窗，确认后再复用当前 `requirement.id` 重新调用业务故事生成接口；该组件同时复用于工作台和用户需求页。
- `src/lib/requirement-progress.ts`: 用户需求历史进度状态映射工具，优先读取后端 `progress_status`，再兼容 `business_story_generation.status`；`running` 映射为 `in_progress`，`succeeded` 映射为 `success`，`failed`、`idle`、`null` 或缺失状态映射为 `failed`。
- `src/lib/api/business-stories.ts`: 业务需求故事接口封装，包含普通生成、legacy 流式生成、列表、详情、更新和删除；页面主流程使用普通生成接口，指定 `requirement_id` 时保留真实 id 传给后端，不再归一为 `null`。
- `src/lib/api/requirements.ts`: 用户需求接口封装，包含项目需求列表、创建需求，以及 `GET /requirements/{requirement_id}/business-story-generation` 单条业务故事生成状态查询。
- `src/lib/api/generation-errors.ts`: 业务需求故事、蓝图、API 契约、数据库模型生成错误文案映射，保证 502/503 不被误判为网络连接失败。
- `src/lib/api/{blueprints,api-contracts,db-models}.ts`: 蓝图、API 契约和数据库模型接口封装；页面主流程使用普通生成方法，`/stream` 方法仅作为 legacy 兼容代码保留。
- `src/lib/api/{context-packs,consistency}.ts`: 指令集合和一致性检查后端接口封装，当前仍使用普通请求。
- `src/lib/types/business-story.ts`: 业务需求故事领域类型，按后端假设定义优先级、状态、业务范围、数据规则和更新 payload。
- `src/lib/types/requirement.ts`: 用户需求类型包含统一前端进度状态 `RequirementProgressStatus`，并兼容可选 `progress_status`、`progress_label`、`progress_text` 和 `business_story_generation`；业务故事生成进度字段包括 `run_id`、`status`、`progress`、`message`、`error_message` 和 `updated_at`。
- `src/lib/types/streaming.ts`: 流式生成事件类型，覆盖 `start`、`delta`、`raw_complete`、`parsed`、`saved`、`done` 和 `error`，并允许后端额外字段。
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
4. 打开 `/register`，发送邮箱验证码并完成注册；或打开 `/login` 使用用户名和密码登录。
5. 普通用户登录后进入 `/projects`，admin 登录后进入 `/admin`。
6. 普通用户在 `/projects` 创建项目，搜索项目名称，或通过项目卡片的“删除”按钮打开确认弹窗并删除项目。
7. 在 `/projects/{projectId}` 保存需求并生成蓝图草案。
8. 进入 `/projects/{projectId}/business-stories`，生成并维护业务需求故事。
9. 使用第二批生成操作区生成 API 契约、数据库模型、指令集合。
10. 分别进入 `/api-contract`、`/db-model`、`/prompts`、`/consistency` 页面查看结果。
11. admin 在 `/admin/users` 搜索非管理员用户、修改角色/显示名称，并启用或禁用用户。

## Testing and Verification

- `pnpm lint` 通过。
- 项目蓝图技术栈一次性配置锁定后，`pnpm lint` 与 `pnpm exec tsc --noEmit` 通过。
- `pnpm exec tsc --noEmit` 通过。
- `pnpm build` 通过。
- 用户系统前端接入后，`pnpm lint` 与 `pnpm build` 通过；`pnpm dev` 启动在 `http://localhost:3000`，`curl -I` 验证 `/login`、`/register`、`/account`、`/admin/users` 返回 200。
- 注册页布局调整后，`pnpm lint` 通过。
- LLM 生成体验增强后，`pnpm lint` 与 `pnpm build` 通过。
- 已用浏览器验证首页文案、能力卡片桌面/移动底部留白、无横向滚动、顶部导航高亮规则和创建项目表单字段。
- 首页 Vibe Coding 对比表新增后，`pnpm lint` 与 `pnpm exec tsc --noEmit` 通过。
- 业务需求池模块新增后，`pnpm lint` 与 `pnpm build` 通过。
- 原始用户需求保存后自动触发业务故事生成进度改造后，`pnpm lint` 与 `pnpm build` 通过。
- 用户需求历史三态进度、输入禁用和重试按钮状态控制实现后，`pnpm lint` 与 `pnpm build` 通过。
- 原始用户需求触发业务故事生成卡住修复后，`pnpm lint` 与 `pnpm build` 通过。
- 业务需求故事双击编辑新增后，`pnpm lint` 与 `pnpm build` 通过。
- 用户需求历史和业务需求故事本地分页新增后，`pnpm lint` 与 `pnpm build` 通过。
- 流式生成前端改造后，`pnpm exec tsc --noEmit` 与 `pnpm lint` 通过；已用 Node 脚本验证 SSE 半包、多事件、`[DONE]`、非法 JSON 和后端 `error` 事件解析场景。
- 已读取 `http://127.0.0.1:8000/openapi.json` 并对照前端 API client/type。
- 已用只读 GET 验证现有项目、第二批列表接口和无 Blueprint 的一致性检查响应。
- 尚未执行生成类 POST 做完整真实联调，以避免额外写入后端数据库。

## Current Decisions and Conventions

- 后端业务接口默认直接返回任务定义中的实体或实体数组，不实现旧响应结构兼容层。
- 登录态只通过后端 HttpOnly cookie 维护；前端不使用 `localStorage` 或 `sessionStorage` 保存 token。
- 所有 `apiRequest()` 请求和 legacy `streamPost()` 请求默认带 `credentials: "include"`。
- `AuthProvider` 将 401 `/auth/me` 视为未登录，其他错误记录为恢复登录态失败；登录、登出、个人资料更新后都会同步当前 user；注册流程先调用 `/auth/register`，成功后立即使用同一用户名和密码调用 `/auth/login`，以确保浏览器获得登录 cookie 后再进入项目列表。
- 角色分流规则：admin 登录后进入 `/admin`，普通角色进入 `/projects`；所有非 admin 角色当前都能使用普通项目功能，不做 VIP 功能限制。
- 管理员用户管理只操作非 admin 用户，前端角色选项限制为 `user`、`vip-plus`、`vip-pro`、`vip-pro-max`。
- 创建需求时前端发送 `language: "zh-CN"` 与 `source_type: "manual"` 作为最小默认值。
- 最新蓝图、API 契约、数据库模型按 `version` 降序优先，版本相同再按 `created_at` 降序选择。
- 业务需求故事、蓝图、API 契约、数据库模型页面主流程调用后端普通 `/generate/*` POST 接口；后端返回后前端重新拉取对应数据库列表并展示最新正式版本；生成失败只更新错误状态，不清空已有列表、版本数组或当前 JSON。
- legacy `/generate/*/stream` client 和流式 UI 代码保留但不作为页面主流程调用；前端不直接调用 LLM，也不保存 `LLM_API_KEY`。
- 指令集合按 `created_at` 降序展示，默认选择最新一条；由于当前类型没有批次字段，不做复杂分组。
- 后端 OpenAPI 中 `ApiContractDraftResponse.content`、`DbModelDraftResponse.content`、`ContextPackResponse.content` 是通用 object；前端 viewer 对关键数组字段做运行时容错。
- 项目列表搜索不同步 URL query；删除失败优先在确认弹窗内展示错误并保持弹窗打开。
- 全局页面背景由 `src/app/globals.css` 的 `body` 控制，背景渐变只渲染首屏高度并禁用重复铺贴，滚动后的长页面区域使用基础 `--background` 色承接。
- 顶部导航栏应保持 `sticky top-6`，以匹配页面容器顶部间距；不要改回 `top-0`，否则滚动时会产生 y 轴位置变化。
- 顶部导航不再渲染“项目列表”“新建项目”文字导航，右侧“项目”“新建”按钮与用户按钮之间使用明显间距分组，主题按钮固定在用户按钮右侧。
- 创建项目请求只提交 `name`；`Project.description` 响应字段仍保留为 `string | null`，但 `CreateProjectPayload` 不再包含 `description`。
- `Project.target_frontend_stack` 和 `Project.target_backend_stack` 作为可选响应字段保留；蓝图页展示时空值回落到 `DEFAULT_FRONTEND_STACK` 和 `DEFAULT_BACKEND_STACK`，保存时 trim 后空字符串也回落默认值；后端自动写入的默认占位值不再单独触发已配置锁定。
- 蓝图页“技术栈配置”使用 `PATCH /projects/{project_id}` 保存 Project 技术栈；未配置项目即使输入值等于默认值也允许首次保存；保存成功后前端立即锁定为只读，有自定义技术栈或已有蓝图的项目也会锁定。
- 点击蓝图页“生成蓝图”时如果项目尚未配置技术栈，会先自动保存当前技术栈，保存成功后再调用普通蓝图生成接口，保存失败则不继续生成；工作台内所有项目蓝图生成入口在技术栈未配置时禁用并引导到蓝图页。
- 蓝图页“恢复默认”只在未配置项目中可用，只改本地输入并标记为未保存，不立即写入后端；用户可手动保存或在生成蓝图前由自动保存写入。
- 当前“一次配置后不能更改”是前端交互约束；若要防止直接调用 API 修改技术栈，仍需后端增加一次性写入校验。
- 项目描述字段仅作为后端兼容字段保留，当前项目列表和工作台界面不展示“项目描述”或“暂无项目描述”。
- 主流程页面和相关组件的用户可见硬编码中文文案不使用全角句号 `。`；旧模板页面、README 和项目记忆文档不纳入该约定。
- 创建项目失败时复用 `ApiError.message`，后端 409 返回 `{ detail: "项目名称已存在，请使用其他名称。" }` 时会展示该具体错误。
- 原始用户需求页保存成功后使用后端返回的最新 `requirement.id` 调用业务需求故事普通生成接口，发送 `{ requirement_id: latestRequirementId, overwrite: false }`；保存流程不等待业务故事生成完成，编辑器在需求保存成功后立即清空并结束保存态；保存失败不触发生成，生成失败保留已保存需求并展示失败进度。
- 需求历史的业务故事生成进度以后端返回的 `business_story_generation` 和单条状态查询接口为准；前端在普通生成请求进行中显示本地 running 状态，并通过轮询恢复刷新中的 running 状态，不使用 `localStorage` 作为最终数据源；状态为 `succeeded` 时重新拉取需求列表，状态为 `failed` 时展示后端 `error_message`，状态为 `null` 或 `idle` 时展示异常提示；前端不再按运行时长判定 running 卡住，也不再因 90 秒无进展展示重试。
- 用户需求历史进度展示统一使用 `进行中`、`成功`、`失败` 三态；后端缺少进度字段、`business_story_generation` 为 `null` 或状态为 `idle` 时前端按失败态展示；任一历史需求为进行中时，原始用户需求页的新用户需求输入框和箭头提交按钮禁用；重试按钮常驻但仅成功或失败状态可点击。
- 敏捷业务需求页的右侧“业务需求池”模块不提供手动生成按钮；业务故事生成由原始用户需求页保存需求后自动触发，列表仍以重新拉取后的后端数据作为最终数据源。
- 业务需求故事支持更新 `priority` 和 `status`，并支持双击编辑 `user_story`、`business_scope.included`、`business_scope.excluded`、`data_rules`、`acceptance_criteria` 和删除单条故事；本批不实现排序、看板或批量编辑。
- 用户需求历史和业务需求故事列表当前使用前端本地分页，每页固定 5 条；未接入服务端分页参数。
- 本批不实现真实 AI、付费系统、会员限额、图谱可视化或拖拽编辑器。

## Known Issues and Follow-ups

- `/dashboard` 示例页面和本地 `/api/auth/login`、`/api/auth/logout` demo route 仍存在，但不作为新主流程入口；主登录页已替换为后端 `/auth/login` 调用。
- 用户系统仍需真实后端联调验证码发送、`Set-Cookie`、CORS credentials、7 天保持登录、禁用用户无法登录和 admin 用户列表数据。
- 需要真实后端验证项目搜索、删除项目、项目不存在、生成前无需求、生成接口 400、后端未启动、复制失败、导出失败等状态是否符合产品预期。
- 后续可考虑 URL query 同步、服务端分页、撤销/回收站、权限控制、删除审计、真实 LLM 集成、产物版本对比、Context Pack 批次概念、端到端测试和更精细的联调监控。
