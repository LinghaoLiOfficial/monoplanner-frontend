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

## 2026-08-13 19:57 +08 - 项目入口文案调整

- Request: `/projects` 页面去除标题英文文案和说明文字，将“项目列表”改为“我的项目”。
- Actions: 更新项目页标题区、加载和错误提示、站点导航标签、首页入口按钮、项目工作区返回链接及管理员页面返回链接。
- Result: `/projects` 页面现在仅显示“我的项目”标题，指定的 `Projects` 和 Project Blueprint 说明已移除，相关入口名称已统一。
- Verification: 残留文案搜索无结果；`pnpm lint` 通过。

## 2026-08-13 20:02 +08 - 我的项目页面整体下移

- Request: 将 `/projects` 页面中“我的项目”、新建按钮、搜索框和空状态列表区域通过 `mt` 整体往下移动。
- Actions: 在 `src/app/projects/page.tsx` 的页面最外层内容容器上使用 `mt-5`。
- Result: `/projects` 主内容区域以 `mt-5` 整体向下移动，内部布局保持不变。
- Verification: `pnpm lint` 通过。

## 2026-08-13 20:07 +08 - 搜索空结果文案去重

- Request: `/projects` 页面搜索框没有任何搜索结果时，不再重复显示“没有找到匹配的项目”标题和描述。
- Actions: 将 `EmptyState` 的 `description` 改为可选，并让 `ProjectList` 搜索空结果分支只传入标题。
- Result: 搜索无结果时只显示 h3 级别的“没有找到匹配的项目”，其他空状态描述保持可用。
- Verification: `pnpm lint` 通过。

## 2026-08-13 20:10 +08 - 搜索空结果标题调整

- Request: 将 `/projects` 页面搜索无结果标题从“没有找到匹配的项目”改为“无匹配项目”。
- Actions: 更新 `src/components/project/ProjectList.tsx` 中搜索空结果的 `EmptyState` 标题。
- Result: 搜索无结果时显示“无匹配项目”。
- Verification: `pnpm lint` 通过；源码残留搜索确认仅新文案保留。

## 2026-08-13 20:15 +08 - 新建项目页面说明文案移除

- Request: `/projects/new` 页面去除 `New Project` 和“先记录项目名称，再进入工作台补充业务需求”。
- Actions: 删除新建项目页的英文小标题，并移除项目表单卡片描述及对应 `CardDescription` 导入。
- Result: 新建项目页只保留“创建项目”页面标题和“创建新项目”表单标题。
- Verification: 指定文案残留搜索无结果；`pnpm lint` 通过。

## 2026-08-13 20:19 +08 - 我的项目空状态说明调整

- Request: 将 `/projects` 页面空状态说明改为“还没有项目，创建第一个项目开始编排你的web全栈程序”。
- Actions: 更新 `src/components/project/ProjectList.tsx` 中非搜索空状态的 `description`。
- Result: 无项目时显示新的 web 全栈程序说明文案。
- Verification: 旧文案残留搜索无结果；`pnpm lint` 通过。

## 2026-08-13 21:06 +08 - 项目卡片进入按钮文案调整

- Request: 将 `/projects` 页面所有项目卡片的“进入工作台”按钮文字改为“进入”。
- Actions: 更新 `src/components/project/ProjectCard.tsx` 中项目详情链接按钮文案。
- Result: 项目卡片操作按钮现在显示“进入”，链接行为保持不变。
- Verification: 源码中“进入工作台”无残留；`pnpm lint` 通过。

## 2026-08-13 21:29 +08 - 项目卡片状态徽标移除

- Request: 去除 `/projects` 页面项目卡片中显示 `draft` 的 badge。
- Actions: 从 `src/components/project/ProjectCard.tsx` 移除 `ProjectStatusBadge` 渲染和对应导入。
- Result: 项目列表卡片不再显示状态徽标，项目名称和操作区域保持展示。
- Verification: `pnpm lint` 通过。

## 2026-08-13 21:37 +08 - 我的项目搜索框位置调整

- Request: 将 `/projects` 页面搜索框移动到“新建项目”按钮左侧。
- Actions: 更新 `src/app/projects/page.tsx` 标题操作区布局，把搜索输入框移入右侧 flex 操作组并放在新建按钮之前。
- Result: 桌面宽度下搜索框位于“新建项目”按钮左侧，窄屏下可自然换行。
- Verification: `pnpm lint` 通过。

## 2026-08-13 21:39 +08 - 项目详情状态徽标移除

- Request: 在具体项目页面去除显示 `draft` 的 badge。
- Actions: 从 `src/app/projects/[projectId]/page.tsx` 移除 `ProjectStatusBadge` 渲染和导入。
- Result: 具体项目页顶部只显示项目名称，不再显示项目状态徽标。
- Verification: 具体项目页无 `ProjectStatusBadge` 引用；`pnpm lint` 通过。

## 2026-08-13 21:42 +08 - 具体项目工作台模块移除

- Request: 在具体项目页面去除“工作台”模块。
- Actions: 从 `project-navigation.ts` 移除项目内导航的“工作台”入口；将具体项目页加载/错误文案改为“项目”；把相关子页面“返回工作台”按钮改为“返回项目”。
- Result: 具体项目区域不再显示“工作台”导航模块或返回工作台文案，根项目页路由继续保留。
- Verification: `src/app/projects` 与 `src/components/project` 中“工作台”残留搜索无结果；`pnpm lint` 通过。

## 2026-08-13 21:50 +08 - PromptPack 页面文案中文化

- Request: 将具体项目页面中的“PromptPack”改名为中文。
- Actions: 将项目导航、主流程入口、具体项目概览、提示词包页面、变更集成功提示、一致性检查描述和 Context Pack 空状态中的用户可见 `PromptPack`/`Prompt Pack` 文案改为“提示词包”。
- Result: 具体项目区域面向用户显示“提示词包”，代码类型名、变量名和 API 名保持不变。
- Verification: `pnpm lint` 通过；残留搜索确认仅代码标识仍包含 `PromptPack`。

## 2026-08-13 21:54 +08 - 指令集合文案统一

- Request: 将用户可见的“提示词包”统一改名为“指令集合”。
- Actions: 更新站点描述、项目导航、主流程入口、具体项目概览、指令集合页面、变更集成功提示和一致性检查文案。
- Result: 页面统一显示“指令集合”；`PromptPack` 仅保留为代码类型、变量和 API 命名。
- Verification: 源码中“提示词包”无残留；`pnpm lint` 通过。

## 2026-08-13 23:17 +08 - 具体项目导航分组优化

- Request: 将具体项目页左侧导航分组改为更专业的命名，并把变更集并入需求分析。
- Actions: 更新 `src/components/project/project-navigation.ts` 的分组名称与归类；同步 `codex-project-tech-doc.md` 中的 IA 说明与当前约定。
- Result: 左侧导航现在使用“全局约束 / 需求分析 / 方案资产 / 交付校验”，其中变更集并入需求分析。
- Verification: 旧分组名搜索只剩菜单项标签；`pnpm lint` 通过。

## 2026-08-14 13:17 +08 - 项目卡片描述展示

- Request: 将 `/projects` 页面“我的项目”中的所有项目卡片去除前端和后端技术栈显示，改为显示项目描述。
- Actions: 更新 `src/components/project/ProjectCard.tsx`，把技术栈两行替换为项目描述文本，并保留创建时间和操作按钮。
- Result: 项目卡片现在显示 `project.description`，无描述时显示“暂无项目描述”，不再显示前端/后端技术栈。
- Verification: `pnpm lint` 通过。

## 2026-08-14 13:22 +08 - 项目配置页说明移除

- Request: 在具体项目页面的项目配置模块去除“单个项目的基础信息、技术栈和全局生成约束。”说明。
- Actions: 更新 `src/app/projects/[projectId]/config/page.tsx`，删除项目配置标题下方说明文字并简化标题容器。
- Result: 项目配置页顶部只显示“项目配置”标题和“返回项目”按钮。
- Verification: 指定文案残留搜索无结果；`pnpm lint` 通过。

## 2026-08-14 13:25 +08 - 具体项目返回按钮收口

- Request: 在具体项目页面将每个模块中的“返回项目”按钮改为“返回”。
- Actions: 更新 `src/app/projects/[projectId]/config/page.tsx`、`business-stories/page.tsx`、`requirements/page.tsx` 和 `consistency/page.tsx` 中的返回链接文案。
- Result: 具体项目各模块的返回按钮现在统一显示为“返回”。
- Verification: `pnpm lint` 通过；`src/app/projects/[projectId]` 中“返回项目”无残留。

## 2026-08-14 13:30 +08 - 项目配置保存提示改为 Toast

- Request: 将具体项目页面项目配置模块“保存配置”成功后的弹窗改为全局 toast 悬浮提示。
- Actions: 更新 `src/app/projects/[projectId]/config/page.tsx`，引入 `toast.success`，移除本地保存成功状态与内联 `Alert` 提示，保留保存失败的页面内错误展示。
- Result: 项目配置保存成功后现在通过右上角全局 toast 提示“项目配置已保存”。
- Verification: `pnpm lint` 通过。

## 2026-08-15 22:06 +08 - 项目配置 Toast 复原确认

- Request: 将项目配置模块“保存配置”按钮点击后的全局 toast 提示复原。
- Actions: 检查 `src/app/projects/[projectId]/config/page.tsx` 与 `src/components/blueprint/TechStackConfigCard.tsx`，确认当前保存成功态已由模块内 `saved` 提示承接且无保存成功 toast；同步更新技术文档中的提示约定。
- Result: 项目配置保存成功提示保持在配置模块内展示，技术文档不再记录全局 toast 约定。
- Verification: 源码搜索确认项目配置保存链路无 `toast`/`sonner` 引用。

## 2026-08-15 19:53 +08 - 项目配置页只读说明移除

- Request: 去除具体项目页面项目配置模块中的只读展示说明句。
- Actions: 更新 `src/app/projects/[projectId]/config/page.tsx`，删除项目配置标题下方说明段落；同步项目技术文档中的页面约定。
- Result: 项目配置页顶部只保留“项目配置”标题和返回按钮。
- Verification: 源码与项目记忆中指定完整文案残留搜索无结果。

## 2026-08-15 22:09 +08 - 项目配置保存 Toast 修复

- Request: 修复项目配置模块“保存配置”按钮点击后全局 toast 无法显示的问题。
- Actions: 更新 `src/app/projects/[projectId]/config/page.tsx`，在保存成功后调用 `toast.success("项目配置已保存")`；更新 `src/components/blueprint/TechStackConfigCard.tsx`，移除本地 `saved` 成功文本接口，避免重复提示；同步技术文档中的提示约定。
- Result: 项目配置保存成功后恢复右上角全局 toast 悬浮提示，保存失败仍由页面内错误提示展示。
- Verification: `pnpm lint` 通过。

## 2026-08-15 22:14 +08 - 项目配置保存按钮文案稳定

- Request: 修复项目配置模块“保存配置”按钮点击后因切换“保存中...”文案造成的闪烁，不需要按钮文字变化。
- Actions: 更新 `src/components/blueprint/TechStackConfigCard.tsx`，让保存按钮始终显示“保存配置”，保留 `saving` 期间禁用按钮的行为；同步技术文档中的按钮交互约定。
- Result: 保存配置按钮点击后不再在“保存中...”和“保存配置”之间切换，保存成功仍由全局 toast 提示。
- Verification: `pnpm lint` 通过。

## 2026-08-15 22:22 +08 - 项目配置页桌面端内部滚动

- Request: 按计划修复选中项目配置后全局页面出现滚动条的问题，让项目配置卡片内部滚动。
- Actions: 更新 `src/app/projects/[projectId]/config/page.tsx`，在 `lg` 及以上为页面根容器、配置卡片和 `CardContent` 建立 `h-full/min-h-0/flex-1/overflow-y-auto` 高度与滚动链路；同步技术文档中的桌面端滚动约定。
- Result: 项目配置页桌面端内容溢出时由配置卡片内部滚动承接，未改动全局 shell、其他项目模块或移动端自然滚动行为。
- Verification: `pnpm lint` 通过；未运行浏览器交互验证，原因是需要可用登录态和项目后端数据。

## 2026-08-15 22:31 +08 - 项目配置页父容器 Padding 溢出修正

- Request: 反馈项目配置页全局滚动条仍存在，需要继续修复。
- Actions: 复查 `ProjectWorkspaceShell`，确认项目内容外层有 `lg:p-6` 和 `lg:overflow-y-auto`；将 `src/app/projects/[projectId]/config/page.tsx` 的桌面端根高度从 `h-full` 调整为 `h-[calc(100%-3rem)]`，扣除父容器上下 padding 后再让配置卡片内部滚动。
- Result: 项目配置页桌面端不再因父容器 padding 产生外层滚动，溢出仍由配置卡片内部 `CardContent` 承接。
- Verification: `pnpm lint`、`pnpm build` 通过；未运行浏览器交互验证，原因是需要可用登录态和项目后端数据。
