# Project Technical Documentation

## Overview
这是一个基于 Next.js 16、React 19、TypeScript、Tailwind CSS 4、shadcn/ui、pnpm 的“全栈上下文编排器”前端。
当前目标是把原始业务需求编排成“业务故事池 -> 分层变更集 -> 版本资产 -> PromptPack”的结构化主链路，而不是直接生成业务代码。

## Architecture
- App Router 为主，项目内工作区位于 `/projects/[projectId]`。
- 项目工作区使用侧边导航 + 主内容区布局，移动端使用 Sheet 抽屉导航；导航现在按业务故事池、分层变更集、版本资产和 PromptPack 组织。
- 通用版本资产页复用 `VersionedDesignAsset<TContent>` 体系，`is_current` 作为当前版本标识；部分自定义 draft 类型也补齐了 `is_current`。
- 业务故事页默认只展示当前有效池，历史记录单独分区；变更集页按 `layer` 和 `batch_id` 分组，强调一次性消耗语义。
- UX/UI、前端实现、后端实现、API 契约和数据库模型页继续使用专用内容渲染器；新版资产按字段契约就地展示中文名、英文字段名和含义，旧版内容保留兼容读取并回退通用分段展示。
- 前端实现和后端实现页现在使用“版本资产”语义，历史 `pages/services` 相关标题只保留为兼容提示，不进入主导航。
- PromptPack 页默认聚焦最新有效版本，同时保留历史记录可查；不再把 blueprint 当作主输入假设。
- 蓝图相关路由和数据仍保留为历史兼容，但不再是工作台默认入口。
- 新 IA 已落地为：
  - 工作台
  - 项目配置
  - 原始用户需求
  - 敏捷业务需求
  - UX 用户体验设计
  - UI 视觉设计
  - 前端工程实现
  - API 契约
  - 后端工程实现
  - 数据库模型
  - 交付 / 指令集合
  - 一致性检查

## Key Files and Directories
- `src/components/project/project-navigation.ts`：项目内副导航分组与路由段映射。
- `src/components/project/GenerationActionPanel.tsx`：工作台主操作入口，承接业务故事池、变更集、版本资产和 PromptPack 的主链路。
- `src/components/design-assets/CompositeVersionedAssetPage.tsx`：合并展示前端/后端工程实现的通用页面组件。
- `src/components/design-assets/VersionList.tsx`、`src/components/design-assets/AssetHeader.tsx`：版本列表和当前版本标识的通用展示组件。
- `src/app/projects/[projectId]/business-stories/page.tsx`、`src/app/projects/[projectId]/change-sets/page.tsx`、`src/app/projects/[projectId]/prompts/page.tsx`：新主链路的核心页面。
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
- 旧路由保留兼容跳转，不做后端契约改造。
- 蓝图只保留历史兼容语义，不再出现在主导航和默认操作中。
- `frontend-pages` / `frontend-tools` 与 `backend-services` / `backend-tools` 只作为历史兼容文案或旧路由重定向，不作为主入口。
- 交付页在主链路里统一对应 PromptPack，导航文案直接显示为 `PromptPack`。
- UI 视觉设计新版公开内容契约为 `visual_system/layout_rules/component_style_rules`；历史 `visual_hierarchy/layout_guidelines/badge_rules/button_rules/form_rules/responsive_rules/accessibility_visual_rules` 只作为旧资产展示兼容，不作为新版主展示字段。
- 前端实现版本资产新版公开内容契约为 `route_definitions/directory_structure/code_logic/environment_variables/design_theme/dependencies`；历史 `pages/components/data_flow/internal_utilities/install_commands` 只作为旧资产展示兼容。
- 后端实现版本资产新版公开内容契约为 `directory_structure/code_logic/utility_classes/llm_interaction_templates/environment_variables/dependencies`；历史 `services/cross_cutting_rules/api_mappings/database_mappings/external_services/internal_utilities/install_commands` 只作为旧资产展示兼容。
- API 契约新版公开内容契约为 `api_base_path/api_resource_groups/endpoints/request_schema/response_schema/error_model`；历史 `base_path/resources/schemas` 只作为旧资产展示兼容。
- 数据库模型新版公开内容契约为 `database_tables/fields`；历史 `entities/relationships/indexes/migration_notes/api_field_mappings` 只作为旧资产展示兼容或扩展信息。

## Known Issues and Follow-ups
- 旧的 blueprint、frontend-pages、backend-services 等页面文件仍保留为兼容入口，后续可继续收敛成统一的版本资产命名。
- 如果后端再进一步细化 DTO，可以继续把 `frontend-page-structures`、`backend-service-designs` 等客户端文件名收敛到新语义。
