# Project Technical Documentation

## Overview
这是一个基于 Next.js 16、React 19、TypeScript、Tailwind CSS 4、shadcn/ui、pnpm 的“全栈上下文编排器”前端。
当前目标是把业务需求编排成结构化设计资产与交付指令，而不是直接生成业务代码。

## Architecture
- App Router 为主，项目内工作区位于 `/projects/[projectId]`。
- 项目工作区使用侧边导航 + 主内容区布局，移动端使用 Sheet 抽屉导航。
- 资产页主要复用 `VersionedDesignAsset<TContent>` 体系和通用版本页组件。
- UX/UI 资产页在通用版本页基础上使用专用内容渲染器；新版资产按字段契约就地展示中文名、英文字段名和含义，旧版资产保留兼容读取并回退通用分段展示。
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
- `src/components/project/GenerationActionPanel.tsx`：工作台主操作入口。
- `src/components/design-assets/CompositeVersionedAssetPage.tsx`：合并展示前端/后端工程实现的通用页面组件。
- `src/components/ux-design/`、`src/lib/ux-design-contract.ts`：UX 用户体验设计新版字段契约和专用展示器。
- `src/components/ui-design/`、`src/lib/ui-design-contract.ts`：UI 视觉设计新版字段契约和专用展示器，覆盖 `visual_system`、`layout_rules`、`component_style_rules` 及其嵌套字段。
- `src/app/projects/[projectId]/configuration/page.tsx` 等新路由页：新的 IA 入口。
- `next.config.ts`：旧路径到新路径的兼容重定向。
- `src/lib/types/*.ts`：版本化资产与新命名类型别名。
- `src/lib/types/ui-design.ts`：UI 视觉设计新版/旧版联合类型，`isNewUIDesignContent()` 以 `visual_system` 或 `layout_rules` 判断新版内容。

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
  - 新路由可正常构建。
  - 旧路由 `/projects/:projectId/config` 会 307 跳转到 `/projects/:projectId/configuration`。

## Current Decisions and Conventions
- 旧路由保留兼容跳转，不做后端契约改造。
- 蓝图保留在工作台摘要和一致性检查入口中，不作为一级导航核心页。
- `frontend-pages` / `frontend-tools` 合并为 `frontend-implementation`，`backend-services` / `backend-tools` 合并为 `backend-implementation`。
- 交付页统一为 `delivery`，导航文案显示为 `交付 / 指令集合`。
- UI 视觉设计新版公开内容契约为 `visual_system/layout_rules/component_style_rules`；历史 `visual_hierarchy/layout_guidelines/badge_rules/button_rules/form_rules/responsive_rules/accessibility_visual_rules` 只作为旧资产展示兼容，不作为新版主展示字段。

## Known Issues and Follow-ups
- `change-sets` 仍是独立流程页，当前不在主导航中，但仍可从业务需求与交付页面抵达。
- 若后端未来同步新 IA，可进一步把 API 命名与类型文件名收敛到新语义。
