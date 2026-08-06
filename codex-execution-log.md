## 2026-08-05 19:38 +08 - 前端 IA 重构落地

- Request: 按新的 12 页信息架构重构项目前端，并保留旧路径兼容。
- Actions: 重写项目导航与工作台入口，新增 configuration/raw-requirements/business-requirements/frontend-implementation/backend-implementation/database-model/delivery 路由，加入旧路由重定向，补充新的类型别名文件和合并资产页组件，更新交付与一致性页面文案。
- Result: 前端主导航已切换到新 IA，旧路径可 307 跳转到新路径，前端工程实现与后端工程实现已合并展示，蓝图保留为工作台摘要而非一级入口。
- Verification: `pnpm exec tsc --noEmit`、`pnpm lint`、`pnpm build` 通过；本地 `pnpm start` 验证旧路径 `/projects/demo/config` 会重定向到 `/projects/demo/configuration`。
- Follow-ups: 后端若后续同步新命名，可继续收敛 API/数据层的旧文件名与响应字段语义。

## 2026-08-06 23:38 +08 - UI 视觉设计字段契约重构

- Request: 按最新 `ui_design` 字段定义重构 UI 视觉设计模块，前端展示所有字段的中文名、英文字段名和含义，并兼容旧 UI 资产。
- Actions: 新增 `src/lib/ui-design-contract.ts` 字段元数据、`src/components/ui-design/` 专用字段说明和内容查看器；重写 `src/lib/types/ui-design.ts` 为新版/旧版联合类型和 `isNewUIDesignContent()`；更新 `/projects/[projectId]/ui-design` 页面接入专用渲染。
- Result: 新版 UI 资产按 `visual_system/layout_rules/component_style_rules` 三大结构就地展示字段说明，旧版资产显示“历史 UI 内容结构”提示并回退通用分段展示。
- Verification: `pnpm exec tsc --noEmit`、`pnpm lint`、`pnpm build` 通过。
