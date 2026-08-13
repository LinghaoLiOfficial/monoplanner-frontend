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

## 2026-08-07 00:09 +08 - 前端工程实现字段契约重构

- Request: 按最新 `frontend_implementation` 字段定义重构前端工程实现模块，主页面展示所有字段中文名、英文字段名和含义。
- Actions: 新增 `src/lib/frontend-implementation-contract.ts` 和 `src/components/frontend-implementation/` 专用展示器；将 `frontend-implementation` 主页面从组合资产页切换为单一版本化资产页；更新前端实现类型、API 语义别名和资产标签。
- Result: `/projects/:projectId/frontend-implementation` 现在按 `route_definitions`、`directory_structure`、`code_logic`、`environment_variables`、`design_theme`、`dependencies` 展示新版资产；历史内容保留兼容提示并回退旧分段展示。
- Verification: `pnpm exec tsc --noEmit`、`pnpm lint`、`pnpm build` 通过。

## 2026-08-07 13:41 +08 - API 契约字段契约重构

- Request: 按最新 `api_contract` 字段定义重构 API 契约模块，前端展示所有字段中文名、英文字段名和含义。
- Actions: 新增 `src/lib/api-contract-contract.ts`、`ApiContractFieldDefinition` 和 `ApiContractContentViewer`；将 API 契约类型改为新版/旧版联合类型；主页面接入新版专用 viewer，旧表格 viewer 保留为历史回退。
- Result: `/projects/:projectId/api-contract` 现在按 `api_base_path`、`api_resource_groups`、`api_resource_group`、`endpoint` 和 `error_case` 展示新版资产；历史 `base_path/resources/schemas` 内容仍可查看。
- Verification: `pnpm exec tsc --noEmit`、`pnpm lint`、`pnpm build` 通过。
## 2026-08-07 14:12 +08 - 后端工程实现字段契约重构

- Request: 按最新 `backend_implementation` 字段定义重构后端工程实现模块，前端展示所有字段中文名、英文字段名和含义。
- Actions: 新增后端工程实现字段元数据、专用字段说明组件和内容 viewer；将 `/projects/:projectId/backend-implementation` 从双资产合并页改为单一版本化资产页；更新类型守卫和 API 语义别名。
- Result: 后端工程实现页现在按目录结构、代码逻辑、工具类、大模型交互模板、环境变量和依赖包展示新版资产；历史旧结构保留回退展示。
- Verification: `pnpm exec tsc --noEmit`、`pnpm lint`、`pnpm build` 通过。
## 2026-08-07 14:34 +08 - 数据库模型字段契约重构

- Request: 按最新 `database_model` 字段定义重构数据库模型模块，前端展示所有字段中文名、英文字段名和含义。
- Actions: 新增数据库模型字段元数据和专用内容 viewer；将 `/projects/:projectId/db-model` 接入新版/旧版联合类型渲染；更新类型层支持 `database_tables` 和历史 `entities`。
- Result: 数据库模型页现在按“数据库模型 -> 数据表 -> 表 -> 字段集合 -> 字段”展示新版资产；旧 `entities` 内容显示历史结构提示并回退通用展示。
- Verification: `pnpm exec tsc --noEmit`、`pnpm lint`、`pnpm build` 通过。

## 2026-08-09 01:17 +08 - 新主链路前端重构

- Request: 按后端重构后的新主链路更新前端业务模型、接口适配和页面流程，去蓝图化主流程并把业务故事池、分层变更集、版本资产和 PromptPack 串起来。
- Actions: 更新业务故事、变更集和版本资产相关类型与 API 别名；重排项目导航和工作台入口；重写业务故事页、变更集页和 PromptPack 页的当前/历史分区；同步前后端实现页、需求文案和一致性页面措辞。
- Result: 前端主链路已切换到“业务故事池 -> 分层变更集 -> 版本资产 -> PromptPack”，蓝图退回历史兼容语义；当前版本标识、层级分组和一次性消耗语义已在页面上体现。
- Verification: `pnpm exec tsc --noEmit`、`pnpm lint`、`pnpm build` 通过。
