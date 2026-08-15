# Project Technical Documentation

## Overview
这是一个基于 Next.js 16、React 19、TypeScript、Tailwind CSS 4、shadcn/ui、pnpm 的“全栈上下文编排器”前端。
当前目标是把原始业务需求编排成“业务故事池 -> 分层变更集 -> 版本资产 -> 指令集合”的结构化主链路，而不是直接生成业务代码。

## Architecture
- App Router 为主，项目内工作区位于 `/projects/[projectId]`。
- 项目工作区使用侧边导航 + 主内容区布局，移动端使用 Sheet 抽屉导航；导航现在按全局约束、需求分析、方案资产和交付校验组织，不显示独立“工作台”入口。
- 通用版本资产页复用 `VersionedDesignAsset<TContent>` 体系，`is_current` 作为当前版本标识；部分自定义 draft 类型也补齐了 `is_current`。
- 业务故事页默认只展示当前有效池，历史记录单独分区；变更集页按 `layer` 和 `batch_id` 分组，强调一次性消耗语义。
- UX/UI、前端实现、后端实现、API 契约和数据库模型页继续使用专用内容渲染器；新版资产按字段契约就地展示中文名、英文字段名和含义，旧版内容保留兼容读取并回退通用分段展示。
- 前端实现和后端实现页现在使用“版本资产”语义，历史 `pages/services` 相关标题只保留为兼容提示，不进入主导航。
- 指令集合页默认聚焦最新有效版本，同时保留历史记录可查；不再把 blueprint 当作主输入假设。
- 蓝图相关路由和数据仍保留为历史兼容，但不再是工作台默认入口。
- 新 IA 分组已落地为：
  - 全局约束：项目配置
  - 需求分析：原始用户需求、业务故事池、变更集
  - 方案资产：UX 用户体验设计、UI 视觉设计、前端实现版本、API 契约、后端实现版本、数据库模型
  - 交付校验：指令集合、一致性检查

## Key Files and Directories
- `src/components/project/project-navigation.ts`：项目内副导航分组与路由段映射，当前分组为全局约束、需求分析、方案资产和交付校验。
- `src/components/project/GenerationActionPanel.tsx`：主流程入口，承接业务故事池、变更集、版本资产和指令集合的主链路。
- `src/components/design-assets/CompositeVersionedAssetPage.tsx`：合并展示前端/后端工程实现的通用页面组件。
- `src/components/design-assets/VersionList.tsx`、`src/components/design-assets/AssetHeader.tsx`：版本列表和当前版本标识的通用展示组件。
- `src/app/projects/[projectId]/business-stories/page.tsx`、`src/app/projects/[projectId]/change-sets/page.tsx`、`src/app/projects/[projectId]/prompts/page.tsx`：新主链路的核心页面，其中 `prompts/page.tsx` 面向用户显示为“指令集合”。
- `src/components/ux-design/`、`src/lib/ux-design-contract.ts`：UX 用户体验设计新版字段契约和专用展示器。
- `src/components/ui-design/`、`src/lib/ui-design-contract.ts`：UI 视觉设计新版字段契约和专用展示器，覆盖 `visual_system`、`layout_rules`、`component_style_rules` 及其嵌套字段。
- `src/components/frontend-implementation/`、`src/lib/frontend-implementation-contract.ts`：前端实现版本资产新版字段契约和专用展示器，覆盖路由、目录、代码逻辑、环境变量、设计主题和依赖包。
- `src/components/backend-implementation/`、`src/lib/backend-implementation-contract.ts`：后端实现版本资产新版字段契约和专用展示器，覆盖目录、代码逻辑、工具类、大模型交互模板、环境变量和依赖包。
- `src/components/contract/ApiContractContentViewer.tsx`、`src/components/contract/ApiContractFieldDefinition.tsx`、`src/lib/api-contract-contract.ts`：API 契约新版字段元数据和专用展示器，覆盖 API 前缀、资源分组、接口、请求/响应结构和错误模式。
- `src/components/db-model/DatabaseModelContentViewer.tsx`、`src/lib/database-model-contract.ts`：数据库模型新版字段元数据和专用展示器，覆盖数据库模型、数据表、表、字段集合和字段。
- `src/app/projects/[projectId]/configuration/page.tsx` 等新路由页：新的 IA 入口。
- `next.config.ts`：旧路径到新路径的兼容重定向。
- `src/lib/types/*.ts`：版本化资产、当前版本标识和新命名类型别名。
- `src/lib/types/ui-design.ts`：UI 视觉设计新版/旧版联合类型，`isNewUIDesignContent()` 以 `visual_system` 或 `layout_rules` 判断新版内容。
- `src/lib/types/frontend-implementation.ts`：前端工程实现新版/旧版联合类型，`isNewFrontendImplementationContent()` 用于区分新版契约与历史页面结构/工具内容。
- `src/lib/types/backend-implementation.ts`：后端工程实现新版/旧版联合类型，`isNewBackendImplementationContent()` 用于区分新版契约与历史服务/工具内容。
- `src/lib/types/api-contract.ts`：API 契约新版/旧版联合类型，`isNewApiContractContent()` 用于区分新版契约与历史 `base_path/resources/schemas` 内容。
- `src/lib/types/db-model.ts`：数据库模型新版/旧版联合类型，`isNewDbModelContent()` 用于区分新版 `database_tables` 内容与历史 `entities` 内容。

## Setup and Runbook
- 安装与启动：
  - `pnpm dev`
  - `pnpm build`
  - `pnpm start`
- API 默认基址：`NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api/v1`

## Testing and Verification
- 已执行：
- `pnpm exec tsc --noEmit`
- `pnpm lint`
- `pnpm build`
- `pnpm start --hostname 127.0.0.1 --port 3001`
- 验证结果：
  - 新主链路页面可正常构建。
  - 旧路由 `/projects/:projectId/config` 会 307 跳转到 `/projects/:projectId/configuration`。

## Current Decisions and Conventions
- 项目列表入口统一使用“我的项目”文案；`/projects` 页面标题不再显示 `Projects` 英文副标题或 Project Blueprint 说明段落。
- `/projects` 页面无项目空状态说明为“还没有项目，创建第一个项目开始编排你的web全栈程序”。
- `/projects` 项目卡片显示项目描述和创建时间，不显示前端/后端技术栈；进入详情/工作台的按钮文案统一为“进入”。
- `/projects` 项目卡片和具体项目页顶部都不显示项目状态 badge。
- 具体项目区域不显示“工作台”模块入口；相关返回按钮文案使用“返回项目”。
- 具体项目的项目配置页顶部只显示“项目配置”标题，不显示基础信息、技术栈、全局生成约束或只读展示说明句。
- 具体项目配置页在桌面端使用固定高度布局，页面根高度用 `h-[calc(100%-3rem)]` 扣除父级 `lg:p-6` 的上下 padding，配置卡片为 `flex-1 overflow-hidden`，卡片内容区负责 `overflow-y-auto`；移动端继续沿用页面自然滚动。
- 具体项目各模块的返回按钮统一显示为“返回”。
- 具体项目区域面向用户统一使用“指令集合”中文文案；`PromptPack` 保留为代码类型、API 和数据模型命名。
- 具体项目左侧导航的分组名为“全局约束 / 需求分析 / 方案资产 / 交付校验”，其中“变更集”并入“需求分析”。
- `/projects/new` 页面不显示 `New Project` 英文小标题，项目表单不显示“先记录项目名称，再进入工作台补充业务需求”说明句。
- `/projects` 页面主内容容器使用 `mt-5 space-y-6 pb-12`，让标题、操作按钮、搜索框和列表/空状态整体下移。
- `/projects` 页面搜索框位于标题右侧操作区，在“新建项目”按钮左侧；窄屏下操作区可换行。
- `EmptyState` 的 `description` 为可选；`/projects` 搜索无结果状态只显示 h3 标题“无匹配项目”，避免标题和描述重复。
- 旧路由保留兼容跳转，不做后端契约改造。
- 蓝图只保留历史兼容语义，不再出现在主导航和默认操作中。
- `frontend-pages` / `frontend-tools` 与 `backend-services` / `backend-tools` 只作为历史兼容文案或旧路由重定向，不作为主入口。
- 交付页在主链路里统一对应 `PromptPack` 数据，导航文案直接显示为“指令集合”。
- 具体项目配置页保存成功后使用右上角全局 toast 提示“项目配置已保存”，失败态仍保留页面内错误提示；保存按钮在 `saving` 期间保持“保存配置”文案，仅通过禁用态防止重复提交，避免按钮文字闪烁。
- UI 视觉设计新版公开内容契约为 `visual_system/layout_rules/component_style_rules`；历史 `visual_hierarchy/layout_guidelines/badge_rules/button_rules/form_rules/responsive_rules/accessibility_visual_rules` 只作为旧资产展示兼容，不作为新版主展示字段。
- 前端实现版本资产新版公开内容契约为 `route_definitions/directory_structure/code_logic/environment_variables/design_theme/dependencies`；历史 `pages/components/data_flow/internal_utilities/install_commands` 只作为旧资产展示兼容。
- 后端实现版本资产新版公开内容契约为 `directory_structure/code_logic/utility_classes/llm_interaction_templates/environment_variables/dependencies`；历史 `services/cross_cutting_rules/api_mappings/database_mappings/external_services/internal_utilities/install_commands` 只作为旧资产展示兼容。
- API 契约新版公开内容契约为 `api_base_path/api_resource_groups/endpoints/request_schema/response_schema/error_model`；历史 `base_path/resources/schemas` 只作为旧资产展示兼容。
- 数据库模型新版公开内容契约为 `database_tables/fields`；历史 `entities/relationships/indexes/migration_notes/api_field_mappings` 只作为旧资产展示兼容或扩展信息。

## Known Issues and Follow-ups
- 旧的 blueprint、frontend-pages、backend-services 等页面文件仍保留为兼容入口，后续可继续收敛成统一的版本资产命名。
- 如果后端再进一步细化 DTO，可以继续把 `frontend-page-structures`、`backend-service-designs` 等客户端文件名收敛到新语义。
