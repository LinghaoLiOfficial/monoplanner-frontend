## 2026-07-11 22:16 CST - 用户需求历史三态进度与输入禁用

- Request: 用户要求按计划实现原始用户需求页历史进度三态、去除进度文案句号、进行中禁用新需求输入，并限制重试按钮可点击状态。
- Actions: 新增统一需求进度状态类型和 `src/lib/requirement-progress.ts` 映射工具；修改需求页、需求输入组件和需求历史列表，接入三态 Badge、进度文案尾部标点清理、进行中禁用输入和重试按钮状态控制。
- Result: 用户需求历史卡片显示“进行中/成功/失败”，缺失或 `idle/null` 进度按失败处理；任一需求进行中时新用户需求输入框和箭头按钮禁用；重试按钮仅在成功或失败状态可点击。
- Verification: `pnpm lint` 通过；`pnpm build` 通过。

## 2026-07-11 15:23 CST - 用户需求历史展开按钮缩小

- Request: 用户要求将原始用户需求页面用户需求历史模块中的展开按钮及其中文字整体缩小。
- Actions: 修改 `src/components/requirement/RequirementList.tsx`，为“展开/收起”按钮增加紧凑高度、内边距、字号和更小的三角 icon；同步更新项目技术文档。
- Result: 用户需求历史卡片右下角“展开/收起”按钮整体更小，按钮文字和左侧三角 icon 一起缩小。
- Verification: `pnpm lint` 通过。

## 2026-07-11 15:39 CST - 用户需求历史重试确认弹窗

- Request: 用户要求点击用户需求历史“重试”按钮时弹出全局确认框，确认后才执行重试功能。
- Actions: 修改 `src/app/projects/[projectId]/requirements/page.tsx`，引入 `ConfirmDialog`，新增待重试需求状态，将列表重试回调改为打开确认弹窗，并在确认后调用原有 `runBusinessStoryGeneration()`；同步更新项目技术文档。
- Result: 用户点击“重试”后会看到“确认重试更新业务需求故事？”全局弹窗，点击“确认重试”后才重新触发该需求的业务故事更新。
- Verification: `pnpm exec eslint 'src/app/projects/[projectId]/requirements/page.tsx' src/components/requirement/RequirementList.tsx` 通过。

## 2026-07-11 15:36 CST - 用户需求历史重试按钮普通样式显式化

- Request: 用户要求将“重试生成”按钮的背景颜色和边框样式改为当前项目普通按钮样式。
- Actions: 检查 `src/components/ui/button.tsx` 的普通按钮 `default` variant，并在 `src/components/requirement/RequirementList.tsx` 的重试按钮上显式设置 `variant="default"`。
- Result: 用户需求历史的“重试”按钮明确使用项目普通按钮背景、文字和无 outline 边框样式。
- Verification: `pnpm exec eslint src/components/requirement/RequirementList.tsx` 通过。

## 2026-07-11 15:32 CST - 用户需求历史重试按钮图标与文案

- Request: 用户要求将“重试生成”按钮文本改为“重试”，并像展开按钮一样增加对应 icon。
- Actions: 修改 `src/components/requirement/RequirementList.tsx`，引入 `RotateCcw` icon，放在重试按钮文字左侧，并将按钮文案改为“重试”；同步更新项目技术文档。
- Result: 用户需求历史常驻操作区中重试按钮现在显示重试 icon 和“重试”文本，样式尺寸与展开按钮一致。
- Verification: `pnpm exec eslint src/components/requirement/RequirementList.tsx` 通过。

## 2026-07-11 15:30 CST - 用户需求历史重试按钮常驻

- Request: 用户要求“重试生成”按钮像展开按钮一样一直存在。
- Actions: 修改 `src/components/requirement/RequirementList.tsx`，将重试按钮显示条件从 `failed`/`idle` 改为只要存在重试回调就渲染；同步更新项目技术文档。
- Result: 原始用户需求页每条用户需求历史都会在“展开/收起”按钮左侧常驻显示“重试生成”按钮。
- Verification: `pnpm exec eslint src/components/requirement/RequirementList.tsx` 通过。

## 2026-07-11 15:27 CST - 移除用户需求历史 90 秒无进展判定

- Request: 用户要求去除原始用户需求页用户需求历史进度条的 90 秒无进展判定，并将“重试生成”按钮改为类似展开按钮的样式、放在展开按钮左侧。
- Actions: 修改 `src/app/projects/[projectId]/requirements/page.tsx`，移除进度签名追踪、卡住计时器和 `stalledRequirementIds` 传参；修改 `src/components/requirement/RequirementList.tsx`，移除卡住文案和卡住触发重试逻辑，将重试按钮移到展开按钮同一操作行左侧并使用同样紧凑普通按钮样式；同步更新项目技术文档。
- Result: running 状态不再因 90 秒无变化被前端判定为卡住；仅 `failed` 或 `idle` 状态显示“重试生成”，且按钮位于“展开/收起”按钮左侧。
- Verification: `pnpm exec eslint 'src/app/projects/[projectId]/requirements/page.tsx' src/components/requirement/RequirementList.tsx` 通过；`rg` 确认目标代码中无 `STALLED`、`stalled`、`长时间无进展` 等残留。

## 2026-07-11 15:19 CST - 用户需求历史进度条逻辑说明

- Request: 用户要求阐述当前原始用户需求页面的用户需求历史模块进度条逻辑。
- Actions: 排查 `src/app/projects/[projectId]/requirements/page.tsx`、`src/components/requirement/RequirementList.tsx`、`src/lib/types/requirement.ts` 和相关 API 封装，梳理保存、触发生成、轮询、卡住判定、失败重试与 UI 渲染关系。
- Result: 明确进度条由需求记录上的 `business_story_generation` 驱动，保存需求后前端先写入本地 running 状态并调用普通业务故事生成接口，随后通过需求列表和单条状态查询接口恢复/更新状态；90 秒无进展会标记为卡住并展示重试。
- Verification: Not run；本次为代码阅读和逻辑说明，未修改业务代码。

## 2026-07-11 15:01 CST - 用户需求历史进度提示精确调整

- Request: 用户要求将原始用户需求页面用户需求历史模块中进度条硬编码提示改为指定的“更新”表述，并保持“重试生成”不变。
- Actions: 修改 `src/components/requirement/RequirementList.tsx`，将卡住、失败、完成、运行和等待状态兜底文案改为目标文案，按钮文案保持“重试生成”。
- Result: 用户需求历史进度条现在显示“更新任务长时间无进展，请稍后重试”“更新失败：...”“已完成业务需求故事更新”“正在更新业务需求故事...”“等待更新业务需求故事”，重试按钮仍显示“重试生成”。
- Verification: `pnpm exec eslint src/components/requirement/RequirementList.tsx` 通过；`rg` 确认目标进度文案与用户指定一致。

## 2026-07-11 14:44 CST - 用户需求历史进度提示改为更新

- Request: 用户要求将原始用户需求页面用户需求历史模块中进度条所有文本提示硬编码里的“生成”改为“更新”。
- Actions: 修改 `src/components/requirement/RequirementList.tsx` 的进度条兜底、失败、完成、运行、等待和重试按钮文案；修改 `src/app/projects/[projectId]/requirements/page.tsx` 的本地初始、失败、异常和接口错误兜底进度文案。
- Result: 用户需求历史进度条相关前端硬编码提示初步改为“更新”表述；后续按精确需求保留“重试生成”。
- Verification: `pnpm exec eslint src/components/requirement/RequirementList.tsx 'src/app/projects/[projectId]/requirements/page.tsx'` 通过。

## 2026-07-11 14:40 CST - 用户需求历史进度提示归属评估

- Request: 用户要求评估原始用户需求页面的用户需求历史模块中进度条所有文本提示是在前端设定还是后端设定。
- Actions: 排查 `src/components/requirement/RequirementList.tsx`、`src/app/projects/[projectId]/requirements/page.tsx`、`src/lib/types/requirement.ts` 和 `src/lib/api/requirements.ts`，梳理进度文本、百分比、状态和错误信息的数据来源。
- Result: 进度条文案是前后端混合来源：后端返回 `business_story_generation.message`、`error_message`、`status`、`progress`；前端负责显示逻辑、兜底文案、本地初始/异常/卡住提示、百分比格式化和“重试生成”按钮文案。
- Verification: 静态代码阅读；未修改业务代码，未运行测试。

## 2026-07-08 13:55 CST - 第一批工作台任务评估

- Request: 用户要求全面深度评估当前 Next.js 白板项目中的第一批基础功能开发任务。
- Actions: 阅读附件任务说明，检查项目结构、关键配置、现有 API client、路由布局、UI 组件、middleware、README，并运行 `pnpm lint`。
- Result: 确认当前项目是 `src/` 结构的 Next.js 16 应用，已有 marketing/dashboard/auth 示例、shadcn/ui 基础组件、统一请求封装、React Query 与 Zustand 依赖；目标任务需要新增项目/需求/蓝图工作台能力，并注意不要扩大到真实 AI、登录注册或复杂权限。
- Verification: `pnpm lint` 通过。
- Follow-ups: 实现时应优先在 `src/app/projects`、`src/components/{layout,project,requirement,blueprint,common}`、`src/lib/api`、`src/lib/types` 下补齐产品骨架；需要修正 `NEXT_PUBLIC_API_BASE_URL` 默认值为后端假设的 `http://localhost:8000/api/v1`。

## 2026-07-08 14:15 CST - 第一批基础工作台实现

- Request: 用户要求按已确认计划实现“全栈上下文编排器”第一批基础工作台功能。
- Actions: 替换首页与主导航，新增 `/projects` 路由、项目/需求/蓝图组件、类型定义、资源 API client、最小 shadcn 风格 `Textarea`/`Badge`/`Alert`，更新 API base URL 默认值和 README。
- Result: 前端已支持项目列表、创建项目、项目工作台、需求保存、蓝图生成、蓝图版本查看和复制 JSON 的基础闭环。
- Verification: `pnpm lint` 通过；`pnpm build` 通过。
- Follow-ups: 需要启动后端并配置 `NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api/v1` 后做真实接口联调；本批仍未实现真实 AI、登录注册、复杂权限、图谱可视化或拖拽编辑器。

## 2026-07-08 14:20 CST - 后端 OpenAPI 对照检查

- Request: 用户要求根据实际后端 API 文档 `http://127.0.0.1:8000/docs` 全面检查前端 API 是否需要调整。
- Actions: 读取 `http://127.0.0.1:8000/openapi.json`，对照前端 API client、类型和页面调用；探测 `/api/v1/health` 与 `/api/v1/projects`；更新类型、health API、错误处理和环境变量示例。
- Result: 确认项目/需求/蓝图主接口路径与当前前端设计一致；修正 `ProjectRead` 可选技术栈字段、`ProjectUpdate.status`、FastAPI 422 错误 detail 数组展示、`/health` API 封装，以及 `.env`/`.env.example` 默认后端地址。
- Verification: `/api/v1/health` 返回 200；`/api/v1/projects` 返回 200 空数组；`pnpm lint` 通过；`pnpm build` 通过。
- Follow-ups: 尚未创建真实项目或生成 blueprint，以避免对后端数据库产生测试数据；可在产品流手动联调时完成。

## 2026-07-08 14:24 CST - 修复首页主题 Hydration 报错

- Request: 用户反馈访问 `http://localhost:3000/` 时出现 `next-themes` script tag 警告和主题图标 hydration mismatch。
- Actions: 检查主题 Provider、Toggle 和 Sonner；用本地轻量 ThemeProvider 替代 `next-themes` 注入脚本；让 ThemeToggle 在 mounted 前保持稳定占位图标；更新 Sonner 使用本地主题上下文。
- Result: 移除了客户端渲染期间的脚本注入来源，并避免服务端 `MonitorCog` 与客户端 `Moon/Sun` 首屏不一致。
- Verification: `pnpm lint` 通过；`pnpm build` 通过；启动 dev server 后 `GET /` 返回 200。
- Follow-ups: 首屏主题在 mounted 后同步 localStorage/system，可能有极轻微主题切换闪烁；如后续需要完全无闪烁，可在根 layout 添加受控内联初始化脚本。

## 2026-07-08 15:58 CST - 第二批产物闭环实现

- Request: 用户要求按计划实现第二批功能，补齐 Blueprint 到 API 契约、数据库模型、Context Packs / Codex Prompts 和一致性检查的前端闭环。
- Actions: 新增第二批领域类型和 API client；新增项目内导航、生成操作区、JsonViewer、增强 CopyButton；新增 API 契约、数据库模型、Prompts、一致性检查页面和对应展示组件；更新 README、技术文档、环境变量默认值和首页说明。
- Result: 前端已支持第二批生成、查看、复制、导出和检查页面，保留第一批项目/需求/Blueprint 主流程。
- Verification: `pnpm lint` 通过；`pnpm build` 通过；构建刷新 `.next` 路由类型后 `pnpm exec tsc --noEmit` 通过。
- Follow-ups: 需要启动真实后端第二批接口后做完整联调，重点验证生成接口 400、无 Blueprint、导出失败和后端未启动等错误态。

## 2026-07-08 16:12 CST - 真实后端 OpenAPI 对照检查

- Request: 用户要求根据实际后端 API 文档 `http://127.0.0.1:8000/docs` 全面检查当前前端是否需要修改 API 接口。
- Actions: 读取 `http://127.0.0.1:8000/openapi.json`，对照 `src/lib/api` 和 `src/lib/types`；只读请求现有项目及第二批列表/一致性接口；查阅本地后端生成器和 schema 源码确认生成内容结构；修正前端 DB relationship 类型和渲染容错。
- Result: 确认前端 API 路径、方法、查询参数和主要响应类型与真实后端一致；修复 `DbEntity.relationships` 应为 relationship 对象数组而非字符串数组的问题，并增强 API/DB/Consistency viewer 对通用 `content` object 的容错。
- Verification: `pnpm lint` 通过；`pnpm exec tsc --noEmit` 通过；`pnpm build` 通过。
- Follow-ups: 后端 OpenAPI 对 `content` 仍声明为通用 object，后续若后端细化 schema，前端类型可进一步收紧或自动生成。

## 2026-07-08 20:13 CST - 固定顶部导航滚动位置

- Request: 用户反馈 `http://localhost:3000/` 顶部导航栏会随向下滚轮改变 y 轴位置，希望固定在当前位置不随滚动变化。
- Actions: 定位首页使用的 `src/components/layout/TopNav.tsx`，将导航栏 sticky 偏移从 `top-0` 调整为 `top-6`，与 `AppShell` 的页面顶部内边距保持一致。
- Result: 顶部导航栏滚动后保持在初始 24px 顶部位置，不再吸附到视口 0px。
- Verification: `pnpm lint` 通过；`curl -I http://localhost:3000/` 返回 200；浏览器滚轮后测得 `scrollY: 252` 且 `headerTop: 24`。

## 2026-07-09 12:02 CST - 项目列表搜索与删除确认

- Request: 用户要求实现项目列表按名称模糊搜索、删除项目、全局确认弹窗、删除后刷新和友好错误/空状态。
- Actions: 新增 `listProjects(q)` API client；添加 `@radix-ui/react-alert-dialog`、Shadcn 风格 `alert-dialog` 和可复用 `ConfirmDialog`；扩展 `Button` destructive 样式；改造 `/projects` 页面、项目列表和项目卡片。
- Result: `/projects` 支持 300ms debounce 搜索、搜索/初始空状态区分、删除确认、删除 loading、防重复提交、删除失败弹窗内错误展示和成功后按当前搜索词刷新。
- Verification: `pnpm lint` 通过；`pnpm build` 通过。
- Follow-ups: 需要连接真实后端手动验证 `GET /projects?q=...` 与 `DELETE /projects/{project_id}`；后续可增强 URL query 同步、分页、撤销/回收站、权限和删除审计。

## 2026-07-09 22:16 CST - 首页文案、导航高亮与创建项目表单调整

- Request: 用户要求修改首页 UI 文案和能力卡片底部间距，给顶部导航增加当前路由高亮，并移除创建项目描述字段且展示重复名称错误。
- Actions: 修改 `src/app/(marketing)/page.tsx` 首页术语与卡片区域 `pb-10`；将 `TopNav` 改为 client component 并基于 `usePathname()` 高亮 `/projects`、`/projects/new` 和项目详情路径；移除 `ProjectForm` 的 description state、`Textarea` 和提交字段；收紧 `CreateProjectPayload` 为仅 `name`。
- Result: 首页不再出现旧文案，能力卡片底部有稳定留白；导航在列表、新建和项目详情路由有预期高亮；创建项目表单只显示项目名称并只提交 `{ name }`，失败时继续显示 API client 从后端 `detail` 解析出的错误信息。
- Verification: `pnpm lint` 通过；`pnpm tsc --noEmit` 通过；本机已有 `pnpm dev` 跑在 `http://localhost:3000`，浏览器验证首页文案、桌面/移动底部留白、无横向滚动、`/` 不高亮、`/projects` 高亮项目列表、`/projects/new` 高亮新建项目、`/projects/example-id` 高亮项目列表、表单仅一个输入框。
- Follow-ups: 真实重复项目名的 409 展示依赖后端返回 `detail`，当前前端已复用统一 API client 解析逻辑；仍建议后端运行时手动创建同名项目验证一次。

## 2026-07-09 22:25 CST - 首页能力卡片文案微调

- Request: 用户要求将首页的“生成 Codex prompts”改为“生成指令集合”。
- Actions: 修改 `src/app/(marketing)/page.tsx` 中能力卡片标题。
- Result: 首页能力卡片标题已改为“生成指令集合”。
- Verification: 使用 `rg` 确认目标文件中出现“生成指令集合”，且原文案不再出现。

## 2026-07-09 22:29 CST - 首页能力卡片位置上移

- Request: 用户要求将首页“生成项目蓝图”“生成 API 契约草案”“生成数据库模型草案”“生成指令集合”四个矩形卡片远离底部并向上移动一定距离。
- Actions: 调整 `src/app/(marketing)/page.tsx` 首页外层间距、hero 区块最小高度和能力卡片区底部留白。
- Result: 能力卡片组整体更靠上，页面底部留白增加。
- Verification: 通过 `git diff` 确认布局类名已按预期更新；未运行自动化测试，因本次为样式间距微调。

## 2026-07-09 22:38 CST - 移除项目描述展示

- Request: 用户要求项目列表和工作台中无需再显示“项目描述”。
- Actions: 从 `src/components/project/ProjectCard.tsx` 移除项目描述行和未用 `CardDescription` import；从 `src/app/projects/[projectId]/page.tsx` 移除工作台标题下方项目描述段落；更新技术文档约定。
- Result: 项目列表卡片和项目工作台头部不再显示项目描述或“暂无项目描述”。
- Verification: `rg` 确认相关路由/组件中不再出现“项目描述”；`pnpm lint` 通过；`pnpm exec tsc --noEmit` 通过。

## 2026-07-10 09:47 CST - 移除项目内页英文标题标签

- Request: 用户要求进入具体项目后的工作台、需求、蓝图、API 契约、数据库模型、Prompts、一致性检查页面中去除指定英文标题标签。
- Actions: 移除 `src/app/projects/[projectId]` 下七个页面标题区的英文 eyebrow；将蓝图页标题改为“项目蓝图”，Prompts 页标题改为“指令集合”；同步更新技术文档中的页面命名约定。
- Result: 项目内页标题区不再显示 `Project Workspace`、`Requirements`、`Blueprints`、`API Contract`、`Database Model`、`Context Packs`、`Consistency`，标题间距也已去掉对应上边距。
- Verification: `rg` 确认指定标题标签和 `Context Packs / Codex Prompts` 不再出现在项目内页标题区；直接运行 `./node_modules/.bin/eslint` 与 `./node_modules/.bin/tsc --noEmit` 通过；`pnpm lint`/`pnpm exec tsc --noEmit` 因 pnpm 触发依赖重装且当前 build script 审批策略阻止 `sharp`、`unrs-resolver` 而未完成。

## 2026-07-10 09:54 CST - 副导航 Prompts 文案改为指令集合

- Request: 用户要求将项目内副导航栏中的“Prompts”改为“指令集合”。
- Actions: 修改 `src/components/project/ProjectWorkspaceNav.tsx` 的 prompts 导航标签，并同步将工作台生成面板入口 `查看 Prompts` 改为 `查看指令集合`。
- Result: 项目内副导航和工作台入口文案统一使用“指令集合”。
- Verification: `rg` 确认目标文案更新；`./node_modules/.bin/eslint src/components/project/ProjectWorkspaceNav.tsx src/components/project/GenerationActionPanel.tsx` 通过；`./node_modules/.bin/tsc --noEmit` 通过。

## 2026-07-10 10:51 CST - 清理主流程硬编码中文句号

- Request: 用户要求按计划去除前端主流程页面中硬编码字符串的中文全角句号 `。`。
- Actions: 在首页、项目列表、项目工作台及项目详情子页面、主流程相关组件、`src/config/site.ts` 和 `src/lib/api/client.ts` 中移除硬编码中文全角句号；保留旧模板页面、README 和项目记忆文档不变。
- Result: 主流程用户可见硬编码文案不再包含中文全角句号。
- Verification: `rg -n "。" 'src/app/(marketing)' src/app/projects src/components/blueprint src/components/requirement src/components/contract src/components/db-model src/components/prompts src/components/consistency src/components/project src/lib/api/client.ts src/config/site.ts` 无命中；`./node_modules/.bin/eslint` 通过；`./node_modules/.bin/tsc --noEmit` 通过。

## 2026-07-10 12:29 CST - 需求页标题与上下布局调整

- Request: 用户要求实现需求页面标题重命名，并将需求输入卡片移动到已保存需求卡片下方。
- Actions: 修改 `src/app/projects/[projectId]/requirements/page.tsx` 的页面主标题、历史卡片标题和卡片排列；为 `src/components/requirement/RequirementEditor.tsx` 增加可选 `title` prop，保持默认标题不影响工作台复用。
- Result: `/projects/{projectId}/requirements` 显示“原始业务需求”，上方为“业务需求历史”卡片，下方为“业务需求输入”卡片；项目工作台仍默认显示“需求输入”。
- Verification: `pnpm lint` 通过。

## 2026-07-10 13:09 CST - 业务需求导航与输入按钮调整

- Request: 用户要求将副导航“需求”改为“业务需求”，并调整需求页输入卡片标题、字段标签和保存按钮样式。
- Actions: 修改 `src/components/project/ProjectWorkspaceNav.tsx` 导航文案；扩展 `src/components/requirement/RequirementEditor.tsx` 支持隐藏标签和 icon 提交按钮；在 `src/app/projects/[projectId]/requirements/page.tsx` 将输入卡片配置为“新业务需求”、隐藏标签并使用圆形向上箭头按钮。
- Result: 项目内副导航显示“业务需求”；需求页输入卡片显示“新业务需求”，不显示“自然语言业务需求”字段标签，提交按钮为圆形白色向上箭头 icon；工作台默认输入卡片保持文字按钮和字段标签。
- Verification: `pnpm lint` 通过。

## 2026-07-10 13:29 CST - 需求页输入卡片上移与箭头内嵌

- Request: 用户要求将业务需求页“新业务需求”卡片放到“业务需求历史”上方，并把箭头提交按钮放入输入背景矩形右下角。
- Actions: 调整 `src/app/projects/[projectId]/requirements/page.tsx` 卡片顺序；修改 `src/components/requirement/RequirementEditor.tsx` 中 `submitButton="icon"` 的输入区结构，让 textarea 和箭头按钮共享同一背景容器。
- Result: `/projects/{projectId}/requirements` 先显示“新业务需求”，再显示“业务需求历史”；需求页 icon 提交按钮内嵌于输入矩形底部右下角，工作台默认文字按钮形态不受影响。
- Verification: `pnpm lint` 通过。

## 2026-07-10 13:36 CST - 新业务需求输入控件上下排列

- Request: 用户要求业务需求页“新业务需求”卡片中的 `textarea` 和 `button` 上下排列。
- Actions: 修改 `src/components/requirement/RequirementEditor.tsx` 中 `submitButton="icon"` 分支，移除按钮绝对定位和共享输入背景容器，改为 textarea 在上、圆形箭头按钮在下的纵向布局。
- Result: 需求页“新业务需求”卡片内 textarea 与箭头提交按钮按上下顺序显示；工作台默认文字按钮形态不受影响。
- Verification: `pnpm lint` 通过。

## 2026-07-10 13:39 CST - 新业务需求输入背景容器调整

- Request: 用户进一步要求业务需求页“新业务需求”卡片中 `textarea` 和 `button` 上下排列，并共同位于有颜色的矩形背景外层 `div` 内，按钮在底部右下角。
- Actions: 修改 `src/components/requirement/RequirementEditor.tsx` 中 `submitButton="icon"` 分支，为外层 `div` 增加背景、边框、圆角和内边距；textarea 去掉独立背景和边框；按钮使用 `self-end` 放在容器底部右侧。
- Result: “新业务需求”输入区现在由同一个有背景矩形承载 textarea 和圆形箭头按钮，二者上下排列，按钮位于底部右下角；默认文字按钮形态不受影响。
- Verification: `pnpm lint` 通过。

## 2026-07-10 13:46 CST - 修复全局背景滚动重复拼接

- Request: 用户要求实现全局背景滚动后不再上下重复拼接，避免拼接边界突兀。
- Actions: 修改 `src/app/globals.css` 中 `body` 和 `.dark body` 的背景策略，增加 `background-repeat: no-repeat`、首屏高度 `background-size` 和 `background-attachment: scroll`。
- Result: 全局背景渐变只渲染首屏高度，长页面继续滚动后由基础背景色承接，不再出现纵向重复拼接边界。
- Verification: `pnpm lint` 通过。

## 2026-07-10 13:50 CST - 需求历史日期右对齐

- Request: 用户要求在业务需求页面将每个需求历史的日期位置改为右侧。
- Actions: 修改 `src/components/requirement/RequirementList.tsx` 的条目头部布局，将语言和来源 badge 分组放在左侧，创建日期放在右侧。
- Result: 需求历史列表中每条记录的日期靠右展示；该复用组件在工作台需求历史中也保持同样布局。
- Verification: `pnpm lint` 通过。

## 2026-07-10 13:54 CST - 梳理项目工作流概念关系

- Request: 用户要求介绍当前项目的工作台、业务需求、蓝图、API 契约、数据库模型、指令集合、一致性检查各是什么，以及相互之间的关系。
- Actions: 阅读项目内导航、工作台页面、需求/蓝图/指令/一致性页面、第二批生成面板、API client 和领域类型定义；更新技术文档中的项目工作流与产物关系说明。
- Result: 确认当前前端主流程是“业务需求 -> 蓝图 -> API 契约/数据库模型/指令集合 -> 一致性检查”的项目产物链路，工作台作为单项目编排入口。
- Verification: Not run；本次为代码阅读和文档说明任务，未修改业务代码。

## 2026-07-10 15:23 CST - 首页追加 Vibe Coding 对比表

- Request: 用户要求将给定的传统 Vibe Coding 劣势与敏捷开发下 Vibe Coding 优势对比表增加到前端首页后面显示。
- Actions: 修改 `src/app/(marketing)/page.tsx`，新增对比数据数组，复用 `src/components/ui/table.tsx` 表格组件，在能力卡片后追加“敏捷开发下的 Vibe Coding 对比”区块；同步更新项目技术文档。
- Result: 首页末尾新增响应式表格，展示需求控制、开发节奏、代码质量、测试与安全、交付与风险五项对比内容。
- Verification: `pnpm lint` 通过；`pnpm exec tsc --noEmit` 通过。

## 2026-07-10 15:28 CST - 首页对比表区块下移

- Request: 用户要求将刚新增的首页对比表部分向下移动一定距离。
- Actions: 修改 `src/app/(marketing)/page.tsx`，为 Vibe Coding 对比表 section 增加 `pt-10 md:pt-16` 上边距；同步更新项目技术文档。
- Result: 首页对比表区域与上方能力卡片之间的距离增大，视觉位置整体下移。
- Verification: `pnpm lint` 通过。

## 2026-07-10 15:38 CST - 业务需求页面文案改为用户需求

- Request: 用户要求将业务需求页面相关标题从“业务需求”体系改为“用户需求”体系。
- Actions: 修改 `src/components/project/ProjectWorkspaceNav.tsx` 导航标签；修改 `src/app/projects/[projectId]/requirements/page.tsx` 的主标题、输入卡片标题和历史卡片标题；同步更新项目技术文档。
- Result: 项目内导航显示“用户需求”；需求页显示“原始用户需求”“新用户需求”“用户需求历史”。
- Verification: `./node_modules/.bin/eslint 'src/app/projects/[projectId]/requirements/page.tsx' src/components/project/ProjectWorkspaceNav.tsx` 通过；`pnpm lint` 因 pnpm 依赖状态检查触发 `sharp`、`unrs-resolver` build script 审批而未完成。

## 2026-07-10 17:14 CST - 业务需求池前端模块实现

- Request: 用户要求按计划新增“业务需求池”模块，位于用户需求和蓝图之间，支持生成、展示和更新业务需求故事。
- Actions: 新增业务需求故事类型、API client、项目内页面和 `components/business-stories` 展示组件；在项目内导航插入“业务需求池”；实现生成按钮、列表卡片、优先级/状态 badge、下拉更新和 400/503 友好错误文案。
- Result: `/projects/{projectId}/business-stories` 已可加载故事列表、触发生成、刷新列表，并通过 `PATCH /business-stories/{storyId}` 更新优先级和状态。
- Verification: `pnpm lint` 通过；`pnpm build` 通过，新路由出现在 Next 构建输出中。
- Follow-ups: 需要连接真实后端验证生成、列表和 PATCH 接口的实际响应，尤其是 400 无用户需求、503 LLM 未配置和字段空数组场景。

## 2026-07-10 17:29 CST - 移除用户需求保存成功提示

- Request: 用户要求前端用户需求页面的新用户需求卡片内不要显示“需求已保存”之类的提示。
- Actions: 修改 `src/components/requirement/RequirementEditor.tsx`，移除保存成功状态和卡片内成功提示渲染，保留提交失败错误提示。
- Result: 保存用户需求成功后仅清空输入并由页面刷新需求历史，不再显示“需求已保存”提示。
- Verification: `pnpm lint` 通过。

## 2026-07-10 18:46 CST - 用户需求历史与业务需求故事分页

- Request: 用户要求实现用户需求历史和业务需求故事列表每页 5 条分页，并让用户需求历史条目支持悬浮高亮和点击展开/收起全文。
- Actions: 更新 `src/components/ui/pagination.tsx` 为可交互中文分页；修改 `src/components/requirement/RequirementList.tsx` 增加本地分页、条目 hover/focus 高亮、点击和键盘展开；修改 `src/components/business-stories/BusinessStoryList.tsx` 增加本地分页。
- Result: 两个列表均按每页 5 条展示，单页数据时隐藏分页；用户需求历史默认展示摘要，点击或按 Enter/Space 可展开全文并再次收起。
- Verification: `pnpm lint` 通过；`pnpm build` 通过。

## 2026-07-10 19:22 CST - 用户需求历史展开按钮调整

- Request: 用户要求将用户需求历史的整卡点击展开改为右下角“展开/收起”按钮控制，按钮文字随展开状态切换。
- Actions: 修改 `src/components/requirement/RequirementList.tsx`，移除卡片级点击与键盘切换，保留 hover 高亮，在每条历史右下角增加按钮并绑定展开状态。
- Result: 用户需求历史条目默认显示摘要和“展开”按钮；点击按钮后显示全文并切换为“收起”，再次点击恢复摘要和“展开”。
- Verification: `pnpm lint` 通过；`pnpm build` 通过。

## 2026-07-10 19:25 CST - 用户需求历史展开按钮边框

- Request: 用户要求用户需求历史中“展开/收起”按钮在未悬浮情况下显示黑色加粗边框。
- Actions: 修改 `src/components/requirement/RequirementList.tsx`，将按钮改为 outline 形态并增加 `border-2 border-black` 样式。
- Result: “展开/收起”按钮默认显示加粗黑色边框，悬浮高亮和展开状态切换不变。
- Verification: `pnpm lint` 通过。

## 2026-07-10 19:26 CST - 用户需求历史展开按钮边框粗细

- Request: 用户要求用户需求历史中“展开/收起”按钮在未悬浮情况下显示黑色边框但不要加粗。
- Actions: 修改 `src/components/requirement/RequirementList.tsx`，移除按钮的 `border-2`，保留 `border-black`。
- Result: “展开/收起”按钮默认显示普通黑色边框。
- Verification: `pnpm lint` 通过。

## 2026-07-10 19:28 CST - 用户需求历史展开按钮尺寸与图标

- Request: 用户要求缩小“展开/收起”按钮及文字，并在文字左侧增加实心三角 icon，展开时朝下，收起时朝上。
- Actions: 修改 `src/components/requirement/RequirementList.tsx`，缩小按钮高度、内边距和字号，增加 `Triangle` icon 并按展开状态旋转。
- Result: “展开”按钮显示朝下实心三角，“收起”按钮显示朝上实心三角，按钮整体更紧凑。
- Verification: `pnpm lint` 通过。

## 2026-07-10 19:30 CST - 分页页码居中

- Request: 用户要求分页组件中的“第 m / n 页”文案水平居中。
- Actions: 修改 `src/components/ui/pagination.tsx`，将分页条布局调整为三列 grid，页码放在中间列，翻页按钮靠右。
- Result: 分页页码相对分页条整体居中显示。
- Verification: `pnpm lint` 通过。

## 2026-07-10 19:36 CST - 业务需求故事删除

- Request: 用户要求业务需求池页面的业务需求故事条目支持删除，每个卡片右上角增加叉叉按钮，并通过全局确认框确认后删除。
- Actions: 新增 `deleteBusinessStory()` API client；修改业务需求故事页面维护待删除故事、删除 loading/error 状态和 `ConfirmDialog`；在故事列表和卡片中传递删除回调，并在卡片右上角渲染叉叉按钮。
- Result: 点击故事卡片右上角叉叉会打开确认框，确认后调用 `DELETE /business-stories/{storyId}` 并从当前列表移除该条故事。
- Verification: `pnpm lint` 通过；`pnpm build` 通过。

## 2026-07-10 20:32 CST - 用户需求历史展开按钮普通样式

- Request: 用户要求将用户需求历史右下角“展开/收起”按钮改为当前项目普通按钮的相同样式。
- Actions: 修改 `src/components/requirement/RequirementList.tsx`，移除按钮的 outline、小尺寸、黑色边框和文字缩小覆盖，保留展开状态与三角 icon。
- Result: “展开/收起”按钮恢复为项目默认普通按钮样式。
- Verification: `./node_modules/.bin/eslint src/components/requirement/RequirementList.tsx` 通过；`pnpm lint` 被 pnpm build-script 审批拦截，未进入 ESLint。

## 2026-07-10 21:15 CST - 业务需求故事双击编辑

- Request: 用户要求按计划为业务需求池故事卡片增加用户故事、业务范围、数据规则和验收标准的双击编辑能力。
- Actions: 新增 `InlineEditableText` 与 `InlineEditableList` 组件；改造 `BusinessStoryCard` 支持字段级 textarea 编辑、Esc 取消、blur 保存、字段错误展示和数据规则文本解析；在页面和列表层接入通用 `onUpdateStory` PATCH 回调。
- Result: 业务需求故事卡片现在可双击编辑五类正文内容，保存成功后用后端返回故事刷新本地列表，保存失败时保留当前字段编辑态以便重试；优先级、状态和删除功能保持原有路径。
- Verification: `pnpm lint` 通过；`pnpm build` 通过。

## 2026-07-10 21:46 CST - 副导航蓝图文案改为项目蓝图

- Request: 用户要求将项目内副导航栏中的“蓝图”改名为“项目蓝图”。
- Actions: 修改 `src/components/project/ProjectWorkspaceNav.tsx` 的 blueprint 导航标签，并同步更新项目技术文档中的导航说明。
- Result: 项目内副导航现在显示“项目蓝图”。
- Verification: 使用 `rg` 确认副导航目标文案已更新。

## 2026-07-10 21:56 CST - 业务需求故事卡片正文样式调整

- Request: 用户要求将业务需求故事卡片中的垂直切片说明放到最前面并去除背景框，同时让用户故事和验收标准正文拥有与数据规则一致的大背景矩形。
- Actions: 修改 `src/components/business-stories/BusinessStoryCard.tsx`，调整垂直切片说明顺序和主题色文本样式，抽取正文块样式并应用到用户故事和验收标准；修改 `src/components/business-stories/InlineEditableList.tsx` 支持列表项自定义样式并保证传入样式优先生效；同步更新项目技术文档。
- Result: 业务需求故事卡片现在先显示主题色的垂直切片说明，用户故事、数据规则和验收标准正文视觉形态保持一致。
- Verification: `./node_modules/.bin/eslint src/components/business-stories/BusinessStoryCard.tsx src/components/business-stories/InlineEditableList.tsx` 通过。

## 2026-07-10 22:05 CST - 业务需求故事块状背景与棕色主题文本

- Request: 用户要求将业务需求故事卡片中的垂直切片说明改为与当前配色相符的棕色主题文本，并将数据规则、验收标准改为单个大背景矩形。
- Actions: 修改 `src/components/business-stories/BusinessStoryCard.tsx`，将垂直切片说明改为明暗模式兼容的棕色 `oklch` 文本；将数据规则外层列表和空状态改为单个块状背景；将验收标准列表外层改为单个块状背景并移除逐条背景样式；同步更新项目技术文档。
- Result: 业务需求故事卡片中垂直切片说明使用棕色主题色，数据规则和验收标准均以单个大背景矩形承载正文。
- Verification: `./node_modules/.bin/eslint src/components/business-stories/BusinessStoryCard.tsx src/components/business-stories/InlineEditableList.tsx` 通过。

## 2026-07-10 22:13 CST - 业务需求池需求故事总览

- Request: 用户要求参考项目蓝图页“版本列表”模块样式，为业务需求池增加左侧“需求故事总览”，展示所有业务需求故事标题。
- Actions: 修改 `src/app/projects/[projectId]/business-stories/page.tsx`，新增 `BusinessStoryOverview` 左侧卡片，并将业务需求池主体改为 `320px + 内容区` 双栏布局，右侧保留原业务需求故事列表、刷新和生成操作；同步更新项目技术文档。
- Result: 业务需求池页面左侧现在展示全部业务需求故事标题总览，右侧继续展示分页故事卡片。
- Verification: `./node_modules/.bin/eslint 'src/app/projects/[projectId]/business-stories/page.tsx'` 通过。

## 2026-07-10 23:06 CST - 业务需求故事优先级简化与总览跳转

- Request: 用户要求将业务需求故事卡片优先级标识简化为 `P1`、`P2`、`P3`、`P4`，并让需求故事总览点击条目时滚动右侧列表到对应故事。
- Actions: 修改 `src/components/business-stories/BusinessStoryPriorityBadge.tsx`，新增短 badge 文案并保留下拉选项完整说明；修改 `src/components/business-stories/BusinessStoryList.tsx`，导出分页大小、接收外部页码和目标故事并通过 ref 滚动到卡片；修改业务需求池页面，在总览点击时计算目标页并触发滚动请求；同步更新项目技术文档。
- Result: 业务需求故事卡片优先级 badge 仅显示 `P1`/`P2`/`P3`/`P4`，点击左侧总览标题会切到对应分页并平滑滚动到目标故事。
- Verification: `./node_modules/.bin/eslint src/components/business-stories/BusinessStoryPriorityBadge.tsx src/components/business-stories/BusinessStoryList.tsx 'src/app/projects/[projectId]/business-stories/page.tsx'` 通过。

## 2026-07-10 23:14 CST - 业务需求故事列表内部滚动

- Request: 用户确认总览点击后滚动整个页面会让左侧总览离开视口，要求按计划改为右侧列表内部滚动。
- Actions: 修改 `src/components/business-stories/BusinessStoryList.tsx`，新增右侧列表滚动容器 ref 和固定最大高度，将 `scrollIntoView()` 替换为基于容器/目标卡片相对位置的 `container.scrollTo()`；手动分页时重置内部滚动位置；同步更新项目技术文档。
- Result: 点击左侧需求故事总览后，右侧列表会在内部滚动到目标故事卡片，页面整体不再跟随滚动，左侧总览保持可见。
- Verification: `./node_modules/.bin/eslint src/components/business-stories/BusinessStoryList.tsx 'src/app/projects/[projectId]/business-stories/page.tsx'` 通过。

## 2026-07-10 23:19 CST - 需求故事总览增加优先级标识

- Request: 用户要求在业务需求池页面的需求故事总览中为每个条目增加优先级标识。
- Actions: 修改 `src/app/projects/[projectId]/business-stories/page.tsx`，在总览条目中复用 `BusinessStoryPriorityBadge`，将标题和优先级 badge 按左右布局展示；同步更新项目技术文档。
- Result: 需求故事总览每个条目现在同时展示故事标题和 `P1`/`P2`/`P3`/`P4` 优先级标识。
- Verification: `./node_modules/.bin/eslint 'src/app/projects/[projectId]/business-stories/page.tsx'` 通过。

## 2026-07-10 23:26 CST - 业务需求池自动模式与紧凑下拉

- Request: 用户要求将业务需求故事优先级下拉选项简化为 `P1`、`P2`、`P3`、`P4`，缩短优先级和状态下拉框，并将刷新按钮改为自动模式启用状态，启用时需要全局确认。
- Actions: 修改 `src/components/business-stories/BusinessStoryPriorityBadge.tsx` 导出短优先级标签；修改 `src/components/business-stories/BusinessStoryCard.tsx` 让优先级下拉使用短标签，并将优先级/状态下拉框改为紧凑宽度；修改 `src/app/projects/[projectId]/business-stories/page.tsx`，移除刷新按钮，新增前端自动模式状态和启用确认弹窗；同步更新项目技术文档。
- Result: 业务需求故事卡片中的优先级下拉选项显示 `P1`/`P2`/`P3`/`P4`，两个下拉框更短；列表头部显示自动模式按钮，点击启用会先弹出全局确认框，确认后显示“自动模式已启用”。
- Verification: `./node_modules/.bin/eslint src/components/business-stories/BusinessStoryPriorityBadge.tsx src/components/business-stories/BusinessStoryCard.tsx 'src/app/projects/[projectId]/business-stories/page.tsx'` 通过。

## 2026-07-10 23:31 CST - 自动模式按钮红色启用态与图标

- Request: 用户要求“自动模式已启用”按钮使用当前项目配色的红色背景，并让“启用自动模式”和“自动模式已启用”按钮左侧显示不同 icon。
- Actions: 修改 `src/app/projects/[projectId]/business-stories/page.tsx`，引入 `Power` 和 `PowerOff` icon；未启用态保持 outline 并显示 `Power`，已启用态使用 `destructive` 红色按钮并显示 `PowerOff`；同步更新项目技术文档。
- Result: 自动模式按钮现在有明确的两态图标，启用后显示项目红色背景。
- Verification: `./node_modules/.bin/eslint 'src/app/projects/[projectId]/business-stories/page.tsx'` 通过。

## 2026-07-10 23:54 CST - 去除产物页左侧列表标题

- Request: 用户要求去除项目蓝图中的“版本列表”、API 契约中的“契约列表”、数据库模型中的“模型列表”。
- Actions: 修改 `src/app/projects/[projectId]/blueprint/page.tsx`、`src/app/projects/[projectId]/api-contract/page.tsx` 和 `src/app/projects/[projectId]/db-model/page.tsx`，移除左侧选择卡片的标题/说明区，并补回 `CardContent` 顶部内边距；同步更新项目技术文档。
- Result: 三个产物页面左侧版本选择卡片不再显示列表标题，生成按钮和版本条目保留。
- Verification: `pnpm lint` 通过；`rg` 确认目标列表标题文案不再存在于三个页面文件。

## 2026-07-11 00:05 CST - 移除产物页左侧列表卡片模块

- Request: 用户进一步要求去除项目蓝图、API 契约和数据库模型页面中的整个左侧列表卡片模块。
- Actions: 修改 `src/app/projects/[projectId]/blueprint/page.tsx`、`src/app/projects/[projectId]/api-contract/page.tsx` 和 `src/app/projects/[projectId]/db-model/page.tsx`，移除左侧卡片、版本条目、生成按钮和对应选择/生成状态逻辑，页面默认直接展示最新产物详情；同步更新项目技术文档。
- Result: 三个产物页面不再渲染左侧列表卡片模块，保留加载、错误、无数据空态和最新详情展示。
- Verification: `pnpm lint` 通过；`rg` 确认目标模块相关标题、生成按钮、选择状态和双栏布局残留不在三个页面文件中。

## 2026-07-11 00:09 CST - 副导航需求文案调整

- Request: 用户要求将项目内副导航栏中的“用户需求”改为“原始用户需求”，将“业务需求”改为“敏捷业务需求”。
- Actions: 修改 `src/components/project/ProjectWorkspaceNav.tsx` 的两个导航标签，保持原路由 segment 不变；同步更新项目技术文档。
- Result: 工作台及各项目内页面复用的副导航现在显示“原始用户需求”和“敏捷业务需求”。
- Verification: `pnpm lint` 通过；`rg` 确认副导航配置中出现新标签且旧标签不再作为导航 label 存在。

## 2026-07-11 00:11 CST - 敏捷业务需求页面标题调整

- Request: 用户要求将敏捷业务需求页面中的“业务需求池”标题改名为“敏捷业务需求”。
- Actions: 修改 `src/app/projects/[projectId]/business-stories/page.tsx` 的页面主标题，并同步更新项目技术文档中的页面称呼。
- Result: 敏捷业务需求页面主标题现在显示“敏捷业务需求”。
- Verification: `./node_modules/.bin/eslint 'src/app/projects/[projectId]/business-stories/page.tsx'` 通过；`rg` 确认页面主标题已更新。

## 2026-07-11 00:13 CST - 敏捷业务需求卡片标题调整

- Request: 用户要求将敏捷业务需求页面中的“业务需求故事列表”标题改名为“业务需求池”，将“需求故事总览”标题改名为“需求总览”。
- Actions: 修改 `src/app/projects/[projectId]/business-stories/page.tsx` 的左右两栏卡片标题，并同步更新项目技术文档中的页面布局说明。
- Result: 敏捷业务需求页面左侧卡片显示“需求总览”，右侧卡片显示“业务需求池”。
- Verification: `./node_modules/.bin/eslint 'src/app/projects/[projectId]/business-stories/page.tsx'` 通过；`rg` 确认目标卡片标题已更新。

## 2026-07-11 00:31 CST - LLM 生成体验增强

- Request: 用户要求按计划增强蓝图、API 契约和数据库模型的大模型生成文案、错误处理、依赖提示和成功刷新行为。
- Actions: 增强 `ApiError` 兼容 `detail/details` 字段，新增 `getGenerationErrorMessage()` 统一处理 400/404/502/503/网络错误；在蓝图、API 契约、数据库模型页面和工作台生成区补充大模型生成按钮、loading 文案、依赖提示、成功刷新和失败保留历史内容逻辑；更新相关空状态文案。
- Result: 三个产物页和工作台现在展示 LLM 生成上下文，HTTP 502/503 会按大模型配置/调用问题提示，只有 fetch 失败显示后端连接失败，生成失败不会清空已有 JSON。
- Verification: `pnpm lint` 通过；`pnpm build` 通过。

## 2026-07-11 00:36 CST - 去除需求总览选中高亮

- Request: 用户要求去除敏捷业务需求页面需求总览中条目的选中高亮。
- Actions: 修改 `src/app/projects/[projectId]/business-stories/page.tsx`，移除 `BusinessStoryOverview` 的 `activeStoryId` prop、`data-active` 属性和对应 active 样式，保留点击后右侧列表定位逻辑。
- Result: 需求总览条目不再显示选中态边框或背景高亮，只保留普通 hover 效果。
- Verification: `./node_modules/.bin/eslint 'src/app/projects/[projectId]/business-stories/page.tsx'` 通过。

## 2026-07-11 00:55 CST - 流式生成前端改造

- Request: 用户要求按计划实现 Next.js 前端流式生成能力，覆盖业务需求故事、项目蓝图、API 契约和数据库模型。
- Actions: 新增 `src/lib/types/streaming.ts`、`src/lib/api/streaming.ts`、`StreamingGenerationPanel` 和 `StreamingOutputViewer`；扩展四个生成 API 的 `/stream` 方法；改造业务需求故事页、工作台蓝图预览页、项目蓝图页、API 契约页、数据库模型页和第二批生成操作区使用 `fetch + ReadableStream` 实时展示 LLM 输出。
- Result: 四类大模型生成入口现在调用后端 `text/event-stream` 接口，支持实时 `delta` 展示、取消生成、`saved`/`done` 后刷新正式列表，失败时保留已有产物内容；旧非流式 API 方法保留兼容。
- Verification: `pnpm exec tsc --noEmit` 通过；`pnpm lint` 通过；用 Node 脚本验证 SSE 半包、多事件、`[DONE]`、非法 JSON 和后端 `error` 事件解析场景。

## 2026-07-11 11:51 CST - 原始用户需求触发业务故事生成进度

- Request: 用户要求在原始用户需求页保存需求后自动触发业务需求故事生成，并在最新需求历史卡片底部展示可刷新恢复的生成进度，敏捷业务需求页不再显示原始输出面板。
- Actions: 扩展 `Requirement` 业务故事生成状态类型和单条状态查询 API；改造原始用户需求页保存后使用最新 `requirement.id` 调用 `streamGenerateBusinessStories({ requirement_id, overwrite: false })`，消费 SSE 事件更新卡片进度并对 running 状态轮询后端；为 `RequirementList` 增加进度文字和进度条；给 `StreamingGenerationPanel` 增加隐藏输出开关并用于敏捷业务需求页。
- Result: 原始用户需求页保存成功后会自动生成业务需求故事，失败保留已保存需求并在需求卡片展示失败状态；刷新或页面切换后可从后端 `business_story_generation` 或单条状态接口恢复 running/succeeded/failed 进度；敏捷业务需求页保留生成按钮但隐藏“业务需求故事实时生成内容”原始输出卡片。
- Verification: `pnpm lint` 通过；`pnpm build` 通过。

## 2026-07-11 12:38 CST - 原始需求生成业务故事卡住修复

- Request: 用户要求修复原始用户需求页点击箭头后业务需求故事生成长时间卡在 25%、输入框一直禁用且敏捷业务需求页无新条目的问题。
- Actions: 修改 `src/app/projects/[projectId]/requirements/page.tsx`，将保存需求与业务故事生成解耦，保存成功后立即返回编辑器并后台 fire-and-track 生成；增加 SSE 事件开发日志、最终状态轮询、`null/idle` 异常状态处理和 90 秒无进展卡住检测。修改 `src/components/requirement/RequirementList.tsx`，在需求卡片底部展示长时间无进展提示并提供按当前 `requirement.id` 重试生成按钮。
- Result: 箭头提交只等待用户需求保存成功，业务故事生成进度继续在需求历史卡片底部更新；SSE 异常结束后会继续通过状态接口确认最终状态，成功后重新拉取需求列表，失败或异常会展示可理解提示且可重试。
- Verification: `pnpm lint` 通过；`pnpm build` 通过。

## 2026-07-11 12:48 CST - 移除业务需求池生成按钮

- Request: 用户要求去除敏捷业务需求页面的业务需求池模块中的“生成业务需求故事”按钮。
- Actions: 修改 `src/app/projects/[projectId]/business-stories/page.tsx`，移除业务需求池卡片内容区的 `StreamingGenerationPanel` 生成入口，并清理对应未使用导入；同步更新项目技术文档。
- Result: 敏捷业务需求页右侧“业务需求池”模块不再渲染“生成业务需求故事”按钮，保留自动模式按钮、加载/错误状态和业务故事列表。
- Verification: `pnpm lint` 通过；`rg` 确认目标页面中不再引用生成面板或流式生成函数，剩余同名文案仅存在于错误提示函数中。

## 2026-07-11 13:33 CST - 生成主流程回退为普通 POST

- Request: 用户要求按计划将前端生成主流程从 SSE streaming 改回普通 POST 生成后读取数据库结果。
- Actions: 新增 `SavedGenerationPanel` 普通生成面板；改造敏捷业务需求、项目蓝图、API 契约、数据库模型页面和工作台蓝图预览使用普通 generate 接口并成功后刷新列表；改造 `GenerationActionPanel` 使用普通生成按钮；将原始用户需求页业务故事生成从 `streamGenerateBusinessStories` 改为 `generateBusinessStories`；保留 legacy streaming client 和组件但不在页面主流程调用；扩展 `getGenerationErrorMessage()` 支持“业务需求故事”。
- Result: 页面和工作台主流程不再消费 `/stream` 或实时 delta，生成失败只显示错误且保留已有数据库内容，生成成功后重新读取数据库保存后的最终结果。
- Verification: `pnpm lint` 通过；`pnpm build` 通过；`rg "StreamingGenerationPanel|streamGenerate|/stream" src/app src/components/project src/components/business-stories src/components/requirement` 确认页面主流程无 streaming 调用残留。

## 2026-07-11 14:32 CST - 移除业务需求池手动生成入口

- Request: 用户要求去除敏捷业务需求页面的业务需求池模块中的“生成业务需求故事”按钮。
- Actions: 修改 `src/app/projects/[projectId]/business-stories/page.tsx`，移除右侧“业务需求池”卡片中的 `SavedGenerationPanel` 手动生成入口、生成处理函数和未使用导入；更新项目技术文档中的页面说明。
- Result: 敏捷业务需求页的业务需求池模块不再显示“生成业务需求故事”按钮，自动模式按钮、加载/错误状态和业务故事列表保留。
- Verification: `pnpm lint` 通过；`rg` 确认目标页面中不再引用 `SavedGenerationPanel`、`generateBusinessStories` 或 `getGenerationErrorMessage`，剩余同名文案仅存在于 400 错误提示中。

## 2026-07-11 23:03 CST - 项目蓝图技术栈配置

- Request: 用户要求按计划在项目蓝图页增加前端和后端技术栈配置，保存到 Project，并在生成蓝图前自动保存未保存修改。
- Actions: 新增 `src/lib/constants/project.ts` 默认技术栈常量和 `src/components/blueprint/TechStackConfigCard.tsx` 配置卡片；扩展 `UpdateProjectPayload` 技术栈字段；改造 `src/app/projects/[projectId]/blueprint/page.tsx` 加载 Project、保存配置、恢复默认并在生成前自动保存 dirty 状态。
- Result: 蓝图页可编辑并保存前端/后端技术栈，空输入保存时回落默认值；保存失败保留输入且阻止生成，保存成功后更新本地 Project 状态并继续生成蓝图。
- Verification: `pnpm lint` 通过。

## 2026-07-11 23:22 CST - 项目蓝图技术栈一次性锁定

- Request: 用户要求实现项目蓝图技术栈只能首次配置，配置后不能更改，并阻断工作台旁路生成入口。
- Actions: 新增 `src/lib/project-tech-stack.ts` 配置状态判断；改造 `TechStackConfigCard` 支持已配置锁定态和未修改默认值也可首次保存；改造蓝图页自动保存未配置技术栈后再生成；改造工作台蓝图生成入口和 `GenerationActionPanel`，未配置技术栈时禁用生成并引导到蓝图页。
- Result: 项目只要已有前后端技术栈即视为已配置并前端只读锁定；新项目可直接保存默认技术栈完成首次配置；未配置技术栈时无法从工作台直接生成蓝图。
- Verification: `pnpm lint` 通过；`pnpm exec tsc --noEmit` 通过；相关主流程文件无全角句号残留。
- Follow-ups: 该限制当前仅为前端交互约束，如需彻底防止直接 PATCH 修改技术栈，应在后端增加一次性写入校验。

## 2026-07-11 23:28 CST - 项目蓝图提示框精简

- Request: 用户要求去除项目蓝图页业务需求池检测提示框，并将技术栈配置状态简化为“未配置”或“已配置”，同时去除已配置说明提示框。
- Actions: 修改 `src/app/projects/[projectId]/blueprint/page.tsx`，移除业务需求池检测请求、状态和提示框；修改 `src/components/blueprint/TechStackConfigCard.tsx`，将状态 badge 简化为两态并移除已配置说明 Alert。
- Result: 项目蓝图页不再展示业务需求池检测提示框；技术栈配置模块只显示“未配置”或“已配置”状态。
- Verification: `pnpm lint` 通过；`pnpm exec tsc --noEmit` 通过；`rg` 确认目标移除文案无残留。

## 2026-07-11 23:35 CST - 项目内副导航顺序调整

- Request: 用户要求将项目内副导航调整为工作台、项目蓝图、原始用户需求、敏捷业务需求、API 契约、数据库模型、指令集合、一致性检查，并保持路径和高亮逻辑不变。
- Actions: 修改 `src/components/project/ProjectWorkspaceNav.tsx` 中 `navItems` 的顺序；同步更新项目技术文档中的项目内导航说明。
- Result: 项目内副导航现在优先展示“项目蓝图”，引导用户先配置技术栈，再进入原始用户需求；各导航项显示名和 segment 路径保持不变。
- Verification: `pnpm lint` 通过；`pnpm exec tsc --noEmit` 通过。

## 2026-07-12 11:17 CST - 用户系统前端接入

- Request: 用户要求按已评估计划实现后端 HttpOnly cookie 用户系统的前端接入。
- Actions: 新增认证/用户类型、Auth/Admin API client、`AuthProvider`、路由守卫、密码强度校验、用户头像和用户菜单；替换登录页，新增注册、个人资料、管理员控制面板和管理员用户管理页；普通项目路由接入登录保护，统一 API client 和 streaming fetch 增加 `credentials: "include"`，删除旧 demo `middleware.ts`。
- Result: 前端已支持用户名密码登录、邮箱验证码注册、`/auth/me` 恢复登录态、admin/普通用户分流、项目路由保护、个人资料修改、登出和非管理员用户管理 MVP。
- Verification: `pnpm lint` 通过；`pnpm build` 通过；`pnpm dev` 启动在 `http://localhost:3000`；`curl -I` 验证 `/login`、`/register`、`/account`、`/admin/users` 返回 200。
- Follow-ups: 需要连接真实后端手动验证验证码发送、登录 Set-Cookie/CORS、7 天保持登录、admin 用户列表和禁用用户无法登录等端到端行为。

## 2026-07-12 20:57 CST - 注册页布局精简

- Request: 用户要求注册页不显示密码规则列表，并将验证码、用户名、密码、确认密码全部改为占用一整行。
- Actions: 修改 `src/app/register/page.tsx`，移除 `PasswordRules` 渲染和导入，将验证码/用户名、密码/确认密码两组双列布局改为单列 `grid gap-4`。
- Result: 注册页不再展示“至少 8 位”等逐条密码规则，目标输入项在桌面和移动端均按整行纵向排列；强密码校验逻辑仍保留。
- Verification: `pnpm lint` 通过。

## 2026-07-12 21:05 CST - 注册后自动登录

- Request: 用户要求注册成功后自动使用注册信息调用登录相关接口，使浏览器获得登录 cookie，并跳转到“项目列表”页面。
- Actions: 修改 `AuthProvider.registerWithCode()`，注册成功后立即用同一用户名和密码调用 `/auth/login`；扩展 `RedirectByRole` 支持固定跳转路径；修改注册页成功后固定 `router.replace("/projects")` 并使用固定重定向目标。
- Result: 注册流程现在会通过登录接口写入后端 HttpOnly cookie，成功后进入 `/projects`，不再按 admin 角色跳转到 `/admin`。
- Verification: `pnpm lint` 通过；`pnpm exec tsc --noEmit` 通过。

## 2026-07-12 21:42 CST - 顶部导航精简

- Request: 用户要求去除顶部冗余“项目列表”“新建项目”，将主题按钮移到用户按钮右侧，拉大“项目/新建”和用户按钮间距，并移除用户菜单里的普通用户“项目列表”入口。
- Actions: 修改 `src/components/layout/TopNav.tsx`，删除中间文字导航，保留右侧“项目”“新建”按钮，将导航按钮组和用户工具组分组并加大间距，主题按钮放到用户按钮右侧；修改 `src/components/user/UserMenu.tsx`，普通用户菜单只保留“个人资料”和“退出登录”，管理员仍保留用户管理入口。
- Result: 顶部导航减少重复入口，主题切换位置符合用户按钮右侧要求，普通用户下拉菜单不再重复显示项目列表。
- Verification: `pnpm lint` 通过；`pnpm exec tsc --noEmit` 通过。

## 2026-07-12 21:55 CST - 修复新建项目技术栈默认值误锁定

- Request: 用户反馈第一次创建项目时，项目蓝图页技术栈配置无法正常修改前端和后端技术栈字符串。
- Actions: 修改 `src/lib/project-tech-stack.ts`，将后端自动写入的默认前后端技术栈占位值排除出“已配置”判断；修改蓝图页和工作台调用，传入已有蓝图和本页保存成功上下文；同步更新项目技术文档。
- Result: 新建项目即使返回默认技术栈字符串，蓝图页仍保持可编辑；保存成功、有自定义技术栈或已有蓝图后继续按已配置状态锁定。
- Verification: `pnpm lint` 通过。
- Follow-ups: 若要彻底表达“一次配置后锁定”，后端最好增加显式技术栈锁定/已确认字段，避免仅靠字符串默认值推断。
