## 2026-08-19 01:51 +08 - 项目模块页面主标题图标化

- Request: 将左侧导航模块打开后右侧内容区左上角的页面主标题缩小到卡片主标题字号，并改为更凸显的样式。
- Actions: 新增 `ProjectPageTitle` 页面标题组件；更新项目配置、原始用户需求、敏捷业务需求池、分层变更集、版本资产通用页、指令集合和一致性检查页面标题；撤回此前误加到卡片内部标题和工作台模块标题上的图标化改动。
- Result: 具体项目各模块页面左上角主标题统一使用 `text-lg`，并通过浅色 lucide 图标徽标凸显；卡片内部标题保持普通 `CardTitle` 语义。
- Verification: `pnpm exec eslint src/components/project/ProjectPageTitle.tsx src/components/design-assets/VersionedAssetPage.tsx src/components/design-assets/CompositeVersionedAssetPage.tsx 'src/app/projects/[projectId]/config/page.tsx' 'src/app/projects/[projectId]/requirements/page.tsx' 'src/app/projects/[projectId]/business-stories/page.tsx' 'src/app/projects/[projectId]/change-sets/page.tsx' 'src/app/projects/[projectId]/prompts/page.tsx' 'src/app/projects/[projectId]/consistency/page.tsx' src/components/project/GenerationActionPanel.tsx src/components/requirement/RequirementEditor.tsx` 通过；`pnpm exec tsc --noEmit` 通过。

## 2026-08-19 02:00 +08 - 项目模块页面标题图标对齐导航

- Request: 每个模块页面主标题的图标需要与左侧导航栏对应模块的图标相同。
- Actions: 对齐 `ProjectPageTitle` 调用与 `project-navigation.ts` 的图标映射；为 `VersionedAssetPage` 增加可选 `icon` 入参，并在 UX、UI、前端实现、API 契约、后端实现和数据库模型页面传入导航同款图标。
- Result: 项目配置、原始用户需求、敏捷业务需求池、变更集、方案资产、指令集合和一致性检查页面标题图标均与左侧导航一致；历史兼容资产页保留 `FileJson` 默认图标。
- Verification: `pnpm exec eslint ...` 通过；`pnpm exec tsc --noEmit` 通过。

## 2026-08-19 13:03 +08 - 移除项目模块页冗余顶部提示

- Request: 去除左侧导航模块右侧内容区显示的文本主标题和顶部返回按钮。
- Actions: 删除 `ProjectPageTitle` 组件和所有模块页调用；移除项目配置、原始用户需求、敏捷业务需求池、版本资产通用页、合并版本资产页、分层变更集、指令集合和一致性检查页面顶部的主标题及返回按钮；保留非返回类操作按钮和页面说明文字。
- Result: 具体项目左侧导航模块页不再重复展示当前位置标题和返回入口，内容区更紧凑，当前位置由左侧导航高亮承接。
- Verification: `pnpm exec eslint src/components/design-assets/VersionedAssetPage.tsx src/components/design-assets/CompositeVersionedAssetPage.tsx 'src/app/projects/[projectId]/config/page.tsx' 'src/app/projects/[projectId]/requirements/page.tsx' 'src/app/projects/[projectId]/business-stories/page.tsx' 'src/app/projects/[projectId]/change-sets/page.tsx' 'src/app/projects/[projectId]/prompts/page.tsx' 'src/app/projects/[projectId]/consistency/page.tsx' 'src/app/projects/[projectId]/ux-design/page.tsx' 'src/app/projects/[projectId]/ui-design/page.tsx' 'src/app/projects/[projectId]/frontend-implementation/page.tsx' 'src/app/projects/[projectId]/api-contract/page.tsx' 'src/app/projects/[projectId]/backend-implementation/page.tsx' 'src/app/projects/[projectId]/db-model/page.tsx` 通过；`pnpm exec tsc --noEmit` 通过。

## 2026-08-19 13:07 +08 - 缩小通用卡片圆角

- Request: 减少通用卡片的圆角弧度。
- Actions: 将 `src/components/ui/card.tsx` 中通用 `Card` 默认圆角从 `rounded-[1.75rem]` 调整为 `rounded-lg`。
- Result: 默认卡片视觉更克制，已有调用处显式覆盖的特殊圆角保持不变。
- Verification: `pnpm exec eslint src/components/ui/card.tsx` 通过；`pnpm exec tsc --noEmit` 通过。

## 2026-08-19 13:12 +08 - 调整通用卡片边框与阴影

- Request: 将通用卡片的样式改为无阴影、灰色细边。
- Actions: 更新 `src/components/ui/card.tsx`，移除通用 `Card` 默认 `shadow-sm`，将边框从语义色 `border-border/60` 改为 `border-gray-200 dark:border-gray-800`。
- Result: 默认卡片统一为无阴影、浅灰细边视觉。
- Verification: `pnpm exec eslint src/components/ui/card.tsx` 通过；`pnpm exec tsc --noEmit` 通过。

## 2026-08-19 13:15 +08 - 拆分原始用户需求页卡片

- Request: 将原始用户需求模块中的“新用户需求”和“用户需求历史”拆分为两个卡片，并让滚动条作用于用户需求历史卡片内部。
- Actions: 更新 `src/app/projects/[projectId]/requirements/page.tsx`，将合并卡片拆为输入卡片和历史卡片；历史卡片在桌面端使用 `flex-1/min-h-0` 占据剩余高度，滚动放在历史卡片 `CardContent`。
- Result: 新需求输入与需求历史在视觉和滚动行为上分离，长历史列表只在历史卡片内部滚动。
- Verification: `pnpm exec eslint 'src/app/projects/[projectId]/requirements/page.tsx'` 通过；`pnpm exec tsc --noEmit` 通过。

## 2026-08-19 13:23 +08 - 调整原始用户需求页卡片顺序

- Request: 交换原始用户需求模块中的新用户需求卡片和用户需求历史卡片的位置。
- Actions: 更新 `src/app/projects/[projectId]/requirements/page.tsx`，将“用户需求历史”卡片移动到“新用户需求”卡片上方，并保留历史卡片内部滚动设置。
- Result: 原始用户需求页先展示历史列表，再展示新需求输入区。
- Verification: `pnpm exec eslint 'src/app/projects/[projectId]/requirements/page.tsx'` 通过；`pnpm exec tsc --noEmit` 通过。

## 2026-08-19 02:02 +08 - 索引导航标题进入滚动区

- Request: 将敏捷业务需求模块中的索引导航主标题也纳入索引导航卡片的滚动范围内。
- Actions: 更新 `src/app/projects/[projectId]/business-stories/page.tsx`，移除索引导航单独的 `CardHeader`，把“索引导航”标题放入与索引条目相同的 `CardContent` 滚动容器。
- Result: 索引导航卡片在桌面端滚动时，卡片标题会与索引条目一起滚动。
- Verification: `pnpm lint` 通过。

## 2026-08-19 02:04 +08 - 索引导航条目名称完整显示

- Request: 将索引导航卡片中的每个条目的名称显示完整。
- Actions: 更新 `src/app/projects/[projectId]/business-stories/page.tsx`，移除索引条目名称的单行截断样式，改为自然换行和长词断行。
- Result: 索引导航中的需求名称会完整显示，右侧优先级 badge 保持固定宽度不被挤压。
- Verification: `pnpm lint` 通过。

## 2026-08-19 13:26 +08 - 调整原始用户需求卡片高度

- Request: 将用户需求历史卡片的高度增大，将新用户需求卡片的高度减小。
- Actions: 更新 `src/app/projects/[projectId]/requirements/page.tsx`，为历史卡片增加桌面端最小高度并保留 `flex-1`；更新 `src/components/requirement/RequirementEditor.tsx`，让 `compact` 模式使用更矮的输入框；收紧新用户需求卡片标题区间距。
- Result: 原始用户需求页在桌面端优先把纵向空间分配给用户需求历史卡片，新用户需求输入区更紧凑。
- Verification: `pnpm exec eslint 'src/app/projects/[projectId]/requirements/page.tsx' src/components/requirement/RequirementEditor.tsx` 通过；`pnpm exec tsc --noEmit` 通过。

## 2026-08-19 13:29 +08 - 进一步压缩新用户需求卡片

- Request: 再减小新用户需求卡片的高度，避免该卡片在当前布局中被部分遮挡。
- Actions: 更新 `src/components/requirement/RequirementEditor.tsx`，将 `compact` 输入框降为 `min-h-20`，并减少紧凑模式表单、输入容器的间距和内边距；更新 `src/app/projects/[projectId]/requirements/page.tsx`，将新用户需求卡片的 `CardHeader`/`CardContent` padding 收紧。
- Result: 新用户需求卡片整体高度进一步降低，更容易在固定高度项目详情工作区中完整显示。
- Verification: `pnpm exec eslint 'src/app/projects/[projectId]/requirements/page.tsx' src/components/requirement/RequirementEditor.tsx` 通过；`pnpm exec tsc --noEmit` 通过。

## 2026-08-19 13:31 +08 - 略微降低用户需求历史卡片高度

- Request: 略微减小用户需求历史卡片的高度。
- Actions: 更新 `src/app/projects/[projectId]/requirements/page.tsx`，将历史卡片桌面端最小高度从 `min-h-[28rem]` 调整为 `min-h-[26rem]`。
- Result: 用户需求历史卡片仍作为主要展示区，但为底部新用户需求卡片释放了少量空间。
- Verification: `pnpm exec eslint 'src/app/projects/[projectId]/requirements/page.tsx'` 通过；`pnpm exec tsc --noEmit` 通过。

## 2026-08-19 13:34 +08 - 添加项目配置卡片标题

- Request: 为项目配置模块中包含项目名称、项目描述、前端技术栈和后端技术栈的卡片添加“全局配置”标题。
- Actions: 更新 `src/app/projects/[projectId]/config/page.tsx`，引入 `CardHeader` 和 `CardTitle`，将原配置卡片改为标准标题区加内容区结构。
- Result: 项目配置页主配置卡片现在显示“全局配置”标题，表单内容继续在卡片内容区内滚动。
- Verification: `pnpm exec eslint 'src/app/projects/[projectId]/config/page.tsx'` 通过；`pnpm exec tsc --noEmit` 通过。

## 2026-08-19 13:36 +08 - 调整敏捷业务需求池滚动边界

- Request: 将敏捷业务需求池模块中的需求列表卡片排除出卡片滚动范围，并将需求详情标题排除出卡片滚动范围。
- Actions: 更新 `src/app/projects/[projectId]/business-stories/page.tsx`，为需求列表卡和需求详情卡恢复 `CardHeader` 标题区，将滚动容器限制在各自的 `CardContent` 内容区。
- Result: “需求列表”和“需求详情”标题不再随卡片内容滚动，需求列表条目、筛选区和详情内容继续在内容区内滚动。
- Verification: `pnpm exec eslint 'src/app/projects/[projectId]/business-stories/page.tsx'` 通过；`pnpm exec tsc --noEmit` 通过。

## 2026-08-19 13:46 +08 - 更新项目配置卡片标题文案

- Request: 将项目配置模块的“全局配置”标题改为“配置表单”。
- Actions: 更新 `src/app/projects/[projectId]/config/page.tsx` 的 `CardTitle` 文案，并同步 `codex-project-tech-doc.md` 中的项目配置页说明。
- Result: 项目配置主卡片现在显示“配置表单”。
- Verification: `pnpm exec eslint 'src/app/projects/[projectId]/config/page.tsx'` 通过；`pnpm exec tsc --noEmit` 通过。

## 2026-08-19 14:46 +08 - 移除新用户需求外层卡片

- Request: 去除原始用户需求模块中新用户需求卡片的“新用户需求”标题和外部卡片，只保留内部输入框和按钮。
- Actions: 更新 `src/app/projects/[projectId]/requirements/page.tsx`，删除新用户需求外层 `Card`、`CardHeader` 和标题元数据，仅保留 `RequirementEditor compact` 输入器容器。
- Result: 原始用户需求页底部新需求输入区不再显示额外卡片和标题，只保留输入框与图标提交按钮。
- Verification: `pnpm exec eslint 'src/app/projects/[projectId]/requirements/page.tsx'` 通过；`pnpm exec tsc --noEmit` 通过。

## 2026-08-19 15:12 +08 - 为模块卡片标题增加图标

- Request: 为项目配置模块中的配置表单标题、原始用户需求模块中的用户需求历史标题、敏捷业务需求池模块中的需求列表标题和需求详情标题增加 icon。
- Actions: 更新 `src/app/projects/[projectId]/config/page.tsx`、`src/app/projects/[projectId]/requirements/page.tsx` 和 `src/app/projects/[projectId]/business-stories/page.tsx`，为四个卡片标题补充同尺寸 lucide 图标。
- Result: 配置表单、用户需求历史、需求列表和需求详情标题现在均显示语义图标，标题布局保持 `text-lg` 与现有卡片视觉一致。
- Verification: `pnpm exec eslint 'src/app/projects/[projectId]/config/page.tsx' 'src/app/projects/[projectId]/requirements/page.tsx' 'src/app/projects/[projectId]/business-stories/page.tsx'` 通过；`pnpm exec tsc --noEmit` 通过。
