## 2026-08-26 12:45 +08 - 优化六大方案资产可视化展示

- Request: 仅在前端展示层全面优化 UX、UI、前端工程实现、API 契约、后端工程实现和数据库模型六个模块的可视化效果。
- Actions: 新增 `src/components/design-assets/visual-dashboard.tsx` 通用可视化组件，并重写六个新版资产内容查看器，提供指标条、流程/关系视图、schema 面板、字段表格、状态标签和完整 JSON 调试入口。
- Result: 新版方案资产从原先偏文本/JSON 的展示升级为专业仪表盘视图；旧版资产仍保留兼容回退，不修改后端 API、Pydantic schema 或数据库模型。
- Verification: `pnpm lint`、`pnpm exec tsc --noEmit` 通过。

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

## 2026-08-19 17:54 +08 - 新增 shadcn 通用下拉框

- Request: 通过 shadcn/ui 重构一个样式更加专业美观的通用下拉框组件。
- Actions: 添加 `@radix-ui/react-select` 依赖，新增 `src/components/ui/select.tsx`，并迁移管理员用户页、敏捷业务需求池全局筛选和需求故事卡优先级编辑下拉。
- Result: 前端下拉框统一使用 shadcn/Radix 风格触发器与弹层，箭头位置、选中态、禁用态和菜单样式统一可控。
- Verification: `pnpm exec eslint 'src/components/ui/select.tsx' 'src/app/admin/users/page.tsx' 'src/app/projects/[projectId]/business-stories/page.tsx' 'src/components/business-stories/BusinessStoryCard.tsx'`、`pnpm exec tsc --noEmit`、`pnpm build` 通过；`rg` 确认业务代码无原生 `<select>` 残留。

## 2026-08-20 17:05 +08 - 将项目配置字段说明改为悬停提示

- Request: 在前端项目配置模块中，将项目名称、项目描述、前端技术栈和后端技术栈的阐述文本改为鼠标悬停时冒泡显示。
- Actions: 新增 `src/components/ui/field-hint.tsx`，并更新 `src/app/projects/[projectId]/config/page.tsx` 和 `src/components/blueprint/TechStackConfigCard.tsx`，把四个字段的说明改为 hover tooltip 形式。
- Result: 项目配置页现在默认不显示字段阐述文本，鼠标悬停在对应字段区域时会显示说明气泡。
- Verification: `pnpm exec eslint 'src/app/projects/[projectId]/config/page.tsx' src/components/blueprint/TechStackConfigCard.tsx src/components/ui/field-hint.tsx` 通过。

## 2026-08-20 17:09 +08 - 将字段提示气泡调整到上方

- Request: 将项目配置字段的悬停提示改为显示在上方。
- Actions: 更新 `src/components/ui/field-hint.tsx`，把提示层定位从字段下方改到上方。
- Result: 项目名称、项目描述、前端技术栈和后端技术栈的提示气泡现在在字段上方出现。
- Verification: `pnpm exec eslint src/components/ui/field-hint.tsx` 通过。

## 2026-08-20 17:14 +08 - 修复项目名称提示气泡显示受限

- Request: 修复项目名称的悬停提示在当前布局下无法正常显示的问题。
- Actions: 将 `src/components/ui/field-hint.tsx` 的提示层改为通过 portal 挂载到 `document.body`，避免被配置卡片的滚动容器裁切。
- Result: 项目名称的提示气泡可正常显示，且仍保持在字段上方出现。
- Verification: `pnpm exec eslint src/components/ui/field-hint.tsx` 通过。

## 2026-08-20 17:18 +08 - 更新项目名称提示文案

- Request: 将项目名称的悬停提示文案改为指定表述。
- Actions: 更新 `src/app/projects/[projectId]/config/page.tsx` 中 `FieldHint` 的 `hint` 文案。
- Result: 项目名称提示文案现为“用于标识当前项目，需要与业务主题一致”。
- Verification: `pnpm exec eslint 'src/app/projects/[projectId]/config/page.tsx'` 通过。

## 2026-08-20 17:20 +08 - 更新项目描述提示文案

- Request: 将项目描述的悬停提示文案改为指定表述。
- Actions: 更新 `src/app/projects/[projectId]/config/page.tsx` 中项目描述字段的 `FieldHint` 文案。
- Result: 项目描述提示文案现为“概括项目目标、范围或业务背景，但不参与任何业务上下文”。
- Verification: `pnpm exec eslint 'src/app/projects/[projectId]/config/page.tsx'` 通过。

## 2026-08-20 17:23 +08 - 更新项目名称提示文案

- Request: 将项目名称的悬停提示文案改为指定表述。
- Actions: 更新 `src/app/projects/[projectId]/config/page.tsx` 中项目名称字段的 `FieldHint` 文案。
- Result: 项目名称提示文案现为“标识当前项目，需要和业务主题保持一致”。
- Verification: `pnpm exec eslint 'src/app/projects/[projectId]/config/page.tsx'` 通过。

## 2026-08-20 17:26 +08 - 更新技术栈提示文案

- Request: 更新前端技术栈和后端技术栈的悬停提示文案。
- Actions: 修改 `src/components/blueprint/TechStackConfigCard.tsx` 中两个 `StackColumn` 的 `description` 文案。
- Result: 前端技术栈提示文案现为“确定系统中使用的框架、语言、UI库、包管理器等前端相关技术项”，后端技术栈提示文案现为“确定系统中使用的语言、框架、数据库和ORM等后端相关技术项”。
- Verification: `pnpm exec eslint src/components/blueprint/TechStackConfigCard.tsx` 通过。

## 2026-08-20 17:31 +08 - 收紧登录页文案

- Request: 将登录页中的品牌名改为 Monoplanner，并移除两处登录说明文本。
- Actions: 更新 `src/app/(auth)/login/page.tsx`，把 `Monoplanner Auth` 改为 `Monoplanner`，并删除页面说明段落和 `CardDescription` 文案。
- Result: 登录页现在仅保留品牌名、登录标题和表单，不再显示额外说明文本。
- Verification: `pnpm exec eslint 'src/app/(auth)/login/page.tsx'` 通过。

## 2026-08-20 17:38 +08 - 让登录标题垂直居中

- Request: 将登录页中的“登录”标题垂直居中。
- Actions: 调整 `src/app/(auth)/login/page.tsx` 中标题的上边距，让它回到文案块的垂直中心位置。
- Result: 登录标题不再上移偏置，左侧文案块视觉更接近垂直居中。
- Verification: `pnpm exec eslint 'src/app/(auth)/login/page.tsx'` 通过。

## 2026-08-20 17:41 +08 - 大幅上移登录页品牌名

- Request: 将登录页中的“Monoplanner”大幅度向上移动。
- Actions: 更新 `src/app/(auth)/login/page.tsx`，为品牌胶囊增加 `-translate-y-6`。
- Result: 登录页左侧品牌名明显上移，标题和表单结构保持不变。
- Verification: `pnpm exec eslint 'src/app/(auth)/login/page.tsx'` 通过。

## 2026-08-20 17:44 +08 - 拉开登录页表单间距

- Request: 增大登录页中“登录账号”和“邮箱”之间的间距，以及“密码”输入框和“登录”按钮之间的间距。
- Actions: 调整 `src/app/(auth)/login/page.tsx` 中 `CardHeader` 和 `form` 的垂直间距。
- Result: 登录卡片标题区与第一个输入框之间更松，密码框与提交按钮之间也更疏朗。
- Verification: `pnpm exec eslint 'src/app/(auth)/login/page.tsx'` 通过。

## 2026-08-23 22:54 +08 - 调整敏捷业务需求池同优先级排序

- Request: 前端敏捷业务需求池中，相同优先级的需求条目按标题首字母排序，中文按拼音排序。
- Actions: 更新 `src/app/projects/[projectId]/business-stories/page.tsx`，使用 `Intl.Collator("zh-CN")` 在优先级排序后比较需求标题，并保留现有稳定兜底排序。
- Result: 需求列表和需求详情现在会在同一优先级内按中文拼音、英文和数字标题顺序展示。
- Verification: `pnpm exec eslint 'src/app/projects/[projectId]/business-stories/page.tsx'`、`pnpm exec tsc --noEmit`、`pnpm build` 通过；用中文标题样例验证 `zh-CN` 拼音排序结果。

## 2026-08-23 23:11 +08 - 取消前端需求池本地排序

- Request: 需求池排序由后端负责，前端不执行新的标题首字母/中文拼音排序规则。
- Actions: 移除 `src/app/projects/[projectId]/business-stories/page.tsx` 的本地排序函数和 `Intl.Collator`，让筛选结果保持后端接口返回顺序。
- Result: 需求列表和详情列表现在只筛选、不重排；标题拼音排序规则暂不纳入前端。
- Verification: 待执行前端 `eslint`、`tsc --noEmit` 和 `build`。

## 2026-08-23 23:11 +08 - 增加敏捷需求池历史执行悬浮卡片

- Request: 当前需求池只显示当前有效条目，已成功执行的条目通过右上角按钮在全局悬浮历史卡片中查看，并移除需求条目中的“当前有效” badge。
- Actions: 更新需求池详情与历史记录交互，调整相关卡片布局与状态展示。
- Result: 历史执行记录以浮层形式查看，详情卡按钮位置与当前交互布局保持一致。
- Verification: 待补充。

## 2026-08-24 13:47 +08 - 调整变更集资产“应用”按钮位置

- Request: 参照敏捷业务需求池模块中需求详情卡片“执行”按钮的位置，调整变更集模块中资产详情卡片“应用”按钮的位置。
- Actions: 更新 `src/app/projects/[projectId]/change-sets/page.tsx`，将资产详情的版本 Badge 与“应用”按钮从内容区移至卡片头部右侧操作区。
- Result: 变更集资产详情的“应用”按钮现在与需求池“执行”按钮同处卡片头部右侧，布局更一致。
- Verification: `pnpm exec tsc --noEmit`、`git diff --check` 通过。

## 2026-08-24 13:52 +08 - 回迁变更集版本 Badge 位置

- Request: 版本 Badge 不要修改位置。
- Actions: 更新 `src/app/projects/[projectId]/change-sets/page.tsx`，将版本 Badge 从卡片头部右侧移回资产详情正文区，保留“应用”按钮在标题右侧。
- Result: 资产详情的版本 Badge 回到原来的信息层级位置，按钮位置仍保持在标题右侧。
- Verification: `pnpm exec tsc --noEmit`、`git diff --check` 待执行。

## 2026-08-24 13:56 +08 - 修正变更集默认选中资产

- Request: 刚进入变更集模块时，方案资产中的默认选中条目应该为最上面的 UX 用户体验设计。
- Actions: 更新 `src/app/projects/[projectId]/change-sets/page.tsx`，补全方案资产 layer 排序顺序，并在列表首次可用且尚未选中时自动选中第一条资产。
- Result: 变更集模块进入后会稳定默认选中最上方的 UX 用户体验设计资产。
- Verification: `pnpm exec tsc --noEmit`、`git diff --check` 通过。

## 2026-08-24 14:00 +08 - 修复默认选中被数据库模型覆盖

- Request: 默认选中仍错误地落在“数据库模型”。
- Actions: 更新 `src/app/projects/[projectId]/change-sets/page.tsx`，让首次加载和后台刷新都先执行方案资产固定顺序排序，再决定保留当前选中项或选择第一项；移除会触发 ESLint 级联渲染告警的多余同步 effect。
- Result: 默认选中项不再受接口返回顺序影响，会选择排序后的第一条 UX 用户体验设计资产。
- Verification: `pnpm exec tsc --noEmit`、`pnpm exec eslint 'src/app/projects/[projectId]/change-sets/page.tsx'`、`git diff --check` 通过。

## 2026-08-24 14:05 +08 - 更新资产详情标题与图标

- Request: 将资产详情标题改为具体资产名称，并添加与敏捷业务需求池详情/列表标题一致风格的图标。
- Actions: 更新 `src/app/projects/[projectId]/change-sets/page.tsx`，引入 `FileJson` 图标；详情标题改为当前资产名称，副标题仅保留变更集标题。
- Result: 资产详情标题会显示“UX 用户体验设计”等具体资产名称，并使用 `size-5 text-muted-foreground` 的左侧图标样式。
- Verification: `pnpm exec tsc --noEmit`、`pnpm exec eslint 'src/app/projects/[projectId]/change-sets/page.tsx'`、`git diff --check` 通过。

## 2026-08-24 14:10 +08 - 为方案资产标题增加图标

- Request: 为“方案资产”增加一个与需求池标题一致风格的 icon。
- Actions: 更新 `src/app/projects/[projectId]/change-sets/page.tsx`，引入 `Layers3` 并放置在“方案资产”标题左侧。
- Result: 方案资产卡片标题现在显示 `Layers3` 图标，尺寸和颜色与其他模块卡片标题保持一致。
- Verification: `pnpm exec tsc --noEmit`、`pnpm exec eslint 'src/app/projects/[projectId]/change-sets/page.tsx'`、`git diff --check` 通过。

## 2026-08-24 14:20 +08 - 梳理变更集与方案资产的 LLM 输出边界

- Request: 说明每个方案资产变更集的完整内容，以及敏捷业务需求池执行需求后 LLM 的实际输出结果。
- Actions: 检查变更集生成服务、ChangeSet 契约、应用变更集服务和六类方案资产输出契约；确认前端变更集详情当前只展示影响摘要与新增/修改/删除明细。
- Result: 明确执行需求先生成 ChangeSet 变更计划，应用变更集后再按 layer 生成并持久化完整方案资产 `content`；当前变更集详情并未展示完整方案资产内容。
- Verification: 代码静态阅读，未修改业务代码。

## 2026-08-24 14:30 +08 - 评估变更集原子级变更明细契约

- Request: 全面评估当前每个原子级变更只有短语的问题，并设计更适合后续方案资产修改的变更明细方向。
- Actions: 检查 `change_set/prompt.j2`、ChangeSet 校验器、设计资产生成 Prompt、应用变更集服务和 PromptPack 输入；分析当前 `module_changes` 仅为 `added/modified/removed` 的 `list[Any]`，以及后续 LLM 可获得的上下文。
- Result: 确认当前条目属于摘要标签，缺少目标定位、前后状态、变更规则、跨层依赖和验收条件，无法稳定承担后续资产生成的执行规格职责；建议演进为带结构化字段的原子变更对象，同时保留历史字符串兼容和人类可读摘要。
- Verification: 代码静态阅读，未修改业务代码。

## 2026-08-24 14:40 +08 - 评估字段驱动的变更集设计

- Request: 评估将每个资产的 ChangeSet 变更内容直接按该资产 LLM 输出字段定义的可行性。
- Actions: 检查六类资产的输出契约、变更集与资产生成 Prompt、上下文快照和前端查看器；核实上一版本完整 `content` 与完整 ChangeSet 都会进入后续资产生成任务。
- Result: 字段驱动方向与现有链路一致，建议采用“公共变更信封 + layer 专属字段 patch”而不是通用短语或完整资产副本；需解决数组对象稳定定位、patch 语义、前端结构化渲染和跨层依赖。另发现 API 契约与数据库模型在应用流程中仍走通用设计资产输出模型，和其更细的前端内容契约存在待收敛风险。
- Verification: 代码静态阅读，未修改业务代码。

## 2026-08-24 23:59 +08 - 评估完整资产字段作为 ChangeSet 主输出

- Request: 评估将完整资产字段放入 ChangeSet，因为当前业务流主要依靠 ChangeSet 上下文生成前后端指令，资产主要用于存储并作为下一轮 ChangeSet 输入。
- Actions: 复核 ChangeSet 生成、方案资产应用、下一轮资产快照和 PromptPack 生成链路。
- Result: 该方向在当前业务定位下成立，但需要把 ChangeSet 定义为“待应用的完整目标资产版本”，应用时直接校验并物化其字段；若仍在应用阶段再次独立调用资产生成 LLM，则会产生第二份事实来源并削弱完整 ChangeSet 的意义。方案资产应作为已应用的版本快照和下一轮 ChangeSet 输入，PromptPack 应消费应用后的资产快照与 ChangeSet 差异。
- Verification: 代码静态阅读，未修改业务代码。
- Actions: 扩展 `listBusinessStories` 的 `include_history` 查询参数；更新 `src/app/projects/[projectId]/business-stories/page.tsx`，按需加载非当前且成功执行状态的历史条目并显示固定悬浮卡片；更新 `src/components/business-stories/BusinessStoryCard.tsx` 移除当前有效 badge。
- Result: 主列表继续只展示当前有效需求；历史执行记录默认隐藏，点击“历史执行记录”后显示；需求详情不再显示“当前有效” badge。
- Verification: `pnpm exec eslint 'src/app/projects/[projectId]/business-stories/page.tsx' 'src/components/business-stories/BusinessStoryCard.tsx' src/lib/api/business-stories.ts`、`pnpm exec tsc --noEmit`、`pnpm build` 通过。

## 2026-08-23 23:15 +08 - 调整历史执行记录卡片位置

- Request: 将历史执行记录卡片向下并向左移动。
- Actions: 更新 `src/app/projects/[projectId]/business-stories/page.tsx`，将悬浮卡片定位从 `top-20 right-4` 调整为 `top-24 right-8`，并同步调整最大高度。
- Result: 历史执行记录卡片现在显示得更靠下、更靠左。
- Verification: `pnpm exec eslint 'src/app/projects/[projectId]/business-stories/page.tsx'` 和 `git diff --check` 通过。

## 2026-08-23 23:47 +08 - 再次左移历史执行记录卡片

- Request: 将历史执行记录卡片再次向左移动。
- Actions: 更新 `src/app/projects/[projectId]/business-stories/page.tsx`，将固定定位从 `right-12` 调整为 `right-16`。
- Result: 历史执行记录卡片再次向左移动，垂直位置和尺寸保持不变。
- Verification: `pnpm exec eslint 'src/app/projects/[projectId]/business-stories/page.tsx'` 和 `git diff --check` 通过。

## 2026-08-23 23:47 +08 - 修复历史卡片闪烁和主卡片高度变化

- Request: 修复点击历史执行记录后历史卡片先大后小闪烁，以及需求列表和需求详情卡片高度变小的问题。
- Actions: 为历史执行记录卡片设置稳定视口约束高度；将加载态改为卡片内部固定区域文本；将历史按钮改为绝对定位并从主布局流中移除，避免占用需求池纵向空间。
- Result: 历史卡片加载前后保持稳定高度，主需求列表和详情卡片不再因历史按钮出现而被压缩。
- Verification: `pnpm exec eslint 'src/app/projects/[projectId]/business-stories/page.tsx'`、`pnpm exec tsc --noEmit`、`pnpm build`、`git diff --check` 通过。

## 2026-08-23 23:47 +08 - 将历史卡片 Portal 化隔离布局

- Request: 继续修复历史执行记录卡片悬浮时需求列表和需求详情卡片高度变短的问题。
- Actions: 使用 `createPortal` 将 `ExecutionHistoryCard` 挂载到 `document.body`，彻底移出需求池页面的 flex 布局树。
- Result: 历史卡片的显示状态不再参与需求池主区域尺寸计算，打开历史记录不会改变需求列表和需求详情卡片高度。
- Verification: `pnpm exec eslint 'src/app/projects/[projectId]/business-stories/page.tsx'`、`pnpm exec tsc --noEmit`、`pnpm build`、`git diff --check` 通过。

## 2026-08-24 00:00 +08 - 解释业务故事垂直切片说明字段

- Request: 确认需求详情卡片中无特征名称的一句话说明的含义，以及后端 LLM 是否输出并参与上下文。
- Actions: 检查前端 `BusinessStoryCard`、业务故事 LLM output schema/prompt、落库归一化逻辑和后续编排上下文快照。
- Result: 该文本对应 `vertical_slice_note`，语义为“垂直切片说明”；后端 LLM 可选输出并落库，当前前端仅展示它；业务故事更新输入和 selected story 下游上下文快照均未传递该字段，因此当前不参与后续 LLM 编排。
- Verification: 未修改代码，完成源码路径核对。

## 2026-08-24 00:05 +08 - 调整垂直切片说明位置

- Request: 将垂直切片说明移动到需求标题下方。
- Actions: 更新 `src/components/business-stories/BusinessStoryCard.tsx`，将 `vertical_slice_note` 从影响范围区域移动到需求标题/优先级下方、创建时间上方。
- Result: 垂直切片说明现在紧跟需求标题展示。
- Verification: `pnpm exec eslint 'src/components/business-stories/BusinessStoryCard.tsx'`、`pnpm exec tsc --noEmit` 和 `git diff --check` 通过。

## 2026-08-24 00:10 +08 - 规划垂直切片说明提示冒泡

- Request: 讨论为垂直切片说明字段增加提示冒泡的合适方式。
- Actions: 检查现有 `FieldHint` 组件、业务需求字段定义和需求卡片标题区布局。
- Result: 建议增加“垂直切片说明”小标签，并在标签旁复用 `FieldHint` 信息图标；提示解释该字段用于说明需求是否形成从用户操作到相关服务/API/数据层的完整、可独立交付闭环。
- Verification: 未修改代码。

## 2026-08-24 00:15 +08 - 增加垂直切片说明提示冒泡

- Request: 为垂直切片说明字段增加提示冒泡。
- Actions: 在 `src/lib/types/business-story.ts` 和 `src/lib/business-story-contract.ts` 中补充 `vertical_slice_note` 字段定义；在 `src/components/business-stories/BusinessStoryCard.tsx` 中复用 `FieldHint` 显示字段标签和说明。
- Result: 垂直切片说明正文上方现在显示“垂直切片说明”标签，悬停旁侧信息图标可查看完整含义。
- Verification: `pnpm exec eslint 'src/components/business-stories/BusinessStoryCard.tsx' src/lib/business-story-contract.ts src/lib/types/business-story.ts`、`pnpm exec tsc --noEmit` 和 `git diff --check` 通过。

## 2026-08-24 00:20 +08 - 评估需求详情卡片信息层级

- Request: 评估敏捷业务需求池需求详情条目内容杂乱、缺少信息优先级和视觉聚焦的问题。
- Actions: 检查 `BusinessStoryCard` 的标题区、操作区、字段分组、嵌套容器、可编辑内容块和提示图标布局。
- Result: 确认当前所有字段基本使用同级标题和相近的可编辑块样式；用户故事未形成核心焦点，影响范围与执行控件竞争注意力，业务范围使用嵌套边框容器增加视觉噪音，业务细节缺少折叠或次级分组。建议按“标题/执行 -> 垂直切片说明 -> 用户故事 -> 影响范围 -> 验收标准 -> 业务约束与执行细节”重构层级。
- Verification: 未修改代码，仅完成源码评估。

## 2026-08-24 00:35 +08 - 撤销需求详情信息层级重构

- Request: 撤销当前需求详情卡片的信息层级重构。
- Actions: 恢复 `src/components/business-stories/BusinessStoryCard.tsx` 原有字段顺序、统一内容间距、普通字段提示图标、业务范围嵌套容器和验收标准位置；保留垂直切片说明提示冒泡及其他此前功能。
- Result: 需求详情卡片回到重构前的视觉和字段组织方式。
- Verification: `pnpm exec eslint 'src/components/business-stories/BusinessStoryCard.tsx'`、`pnpm exec tsc --noEmit`、`pnpm build`、`git diff --check` 通过。

## 2026-08-24 00:40 +08 - 增大创建时间与影响范围间距

- Request: 显著增大需求详情卡片中创建时间与影响范围之间的间距。
- Actions: 更新 `src/components/business-stories/BusinessStoryCard.tsx`，将 `CardHeader` 下内边距从 `pb-4` 调整为 `pb-10`。
- Result: 创建时间元信息与下方影响范围区域之间增加明显留白。
- Verification: `pnpm exec eslint 'src/components/business-stories/BusinessStoryCard.tsx'` 和 `git diff --check` 通过。

## 2026-08-24 00:45 +08 - 继续增大创建时间与影响范围间距

- Request: 继续增大需求详情卡片中创建时间与影响范围之间的间距。
- Actions: 将 `src/components/business-stories/BusinessStoryCard.tsx` 的 `CardHeader` 下内边距从 `pb-10` 调整为 `pb-14`。
- Result: 创建时间与影响范围之间的留白进一步增大。
- Verification: `pnpm exec eslint 'src/components/business-stories/BusinessStoryCard.tsx'` 和 `git diff --check` 通过。

## 2026-08-24 00:50 +08 - 移除垂直切片说明标签和提示

- Request: 去除需求详情中的“垂直切片说明”及其提示冒泡。
- Actions: 更新 `src/components/business-stories/BusinessStoryCard.tsx`，移除该字段的名称标签和 `FieldHint` 提示展示；保留 `vertical_slice_note` 正文内容。同步清理前端字段定义中的对应展示项，后端字段和 API 数据保持不变。
- Result: 需求详情不再显示“垂直切片说明”名称或提示冒泡，已有正文仍可展示。
- Verification: `pnpm exec eslint 'src/components/business-stories/BusinessStoryCard.tsx' src/lib/business-story-contract.ts src/lib/types/business-story.ts`、`pnpm exec tsc --noEmit`、`pnpm build`、`git diff --check` 通过。

## 2026-08-24 00:55 +08 - 增大垂直切片说明与标题间距

- Request: 增加垂直切片说明文段与标题之间的间距。
- Actions: 更新 `src/components/business-stories/BusinessStoryCard.tsx`，为 `vertical_slice_note` 正文增加 `pt-2` 上内边距。
- Result: 垂直切片说明正文与需求标题之间增加约 8px 间距，其他布局保持不变。
- Verification: `pnpm exec eslint 'src/components/business-stories/BusinessStoryCard.tsx'`、`git diff --check` 通过。

## 2026-08-23 - 将全局筛选名称改为影响范围

- Request: 将敏捷业务需求池模块中的全局下拉框“实现范围”名称改为“影响范围”。
- Actions: 更新 `src/app/projects/[projectId]/business-stories/page.tsx` 的筛选标签；保留 `implementation_scope` 的筛选字段、选项值和类型；同步更新技术文档。
- Result: 全局下拉框现在显示“影响范围”，筛选行为不变。
- Verification: `pnpm exec eslint 'src/app/projects/[projectId]/business-stories/page.tsx'`、`pnpm exec tsc --noEmit`、`git diff --check`。

## 2026-08-23 - 去除全局筛选控件 placeholder 加粗

- Request: 去除敏捷业务需求池模块中三个全局筛选控件的 placeholder 加粗。
- Actions: 在 `src/app/projects/[projectId]/business-stories/page.tsx` 的优先级、影响范围和关键词控件上增加 `font-normal`，不修改通用 `Select` 组件。
- Result: 三个全局筛选控件的当前值和 placeholder 不再继承外层标签的加粗样式。
- Verification: `pnpm exec eslint 'src/app/projects/[projectId]/business-stories/page.tsx'`、`pnpm exec tsc --noEmit`、`git diff --check` 通过。

## 2026-08-23 - 说明需求故事执行链路

- Request: 确认当前敏捷业务需求池条目点击“执行”后的行为。
- Actions: 核对前端执行按钮、`executeBusinessStory` API、后端 `generate_change_set` 队列任务、分层变更集生成服务和变更集页面跳转逻辑。
- Result: 当前“执行”只生成分层变更集，不直接应用资产；后端按需求影响层调用 LLM 并创建同一批次的多个变更集，前端跳转到变更集页。当前跳转参数使用后台任务 ID，变更集页加载后会回退选择当前有效变更集。
- Verification: 完成源码和已有后端测试路径核对，未修改业务代码。

## 2026-08-23 - 修复执行后变更集定位参数

- Request: 修复敏捷业务需求池执行后把后台任务 ID 当作变更集 ID传入的问题。
- Actions: 将 `executeBusinessStory` 返回类型改为 `GenerationRun`；业务故事页轮询生成任务，读取 `output_snapshot.change_set_ids` 的真实变更集 ID 后再跳转；补充失败、取消和超时处理。
- Result: 执行完成后变更集页面会使用真实变更集 ID 定位并选中对应条目，不再依赖错误的 run ID 回退选择。
- Verification: `pnpm exec eslint 'src/app/projects/[projectId]/business-stories/page.tsx' src/lib/api/business-stories.ts src/lib/types/generation-run.ts`、`pnpm exec tsc --noEmit`、`git diff --check` 通过。

## 2026-08-23 - 去除执行按钮自动跳转

- Request: 去除敏捷业务需求池条目点击“执行”后的页面跳转。
- Actions: 移除业务故事页对 `useRouter` 和变更集 ID跳转的使用；保留后台任务轮询、失败和超时处理，执行完成后停留在当前需求池页面。
- Result: 点击“执行”不再自动进入变更集页面。
- Verification: `pnpm exec eslint 'src/app/projects/[projectId]/business-stories/page.tsx' src/lib/api/business-stories.ts src/lib/types/generation-run.ts`、`pnpm exec tsc --noEmit`、`git diff --check` 通过。

## 2026-08-23 - 为敏捷需求条目增加执行实时进度条

- Request: 在敏捷业务需求池条目的创建时间和影响范围之间增加原始用户需求模块风格的实时进度条。
- Actions: 在需求池页面按故事 ID 保存并轮询 `GenerationRun`；更新 `BusinessStoryList` 和 `BusinessStoryCard` 透传并展示任务进度、消息、百分比和状态颜色。
- Result: 点击执行后，目标需求条目会在创建时间与影响范围之间显示实时进度；排队/运行使用主色，完成使用绿色，失败/取消使用红色。
- Verification: `pnpm exec eslint 'src/app/projects/[projectId]/business-stories/page.tsx' src/components/business-stories/BusinessStoryList.tsx src/components/business-stories/BusinessStoryCard.tsx`、`pnpm exec tsc --noEmit`、`git diff --check` 通过。

## 2026-08-23 - 展开执行进度条和分隔线宽度

- Request: 展开敏捷业务需求条目中进度条和分隔线的长度。
- Actions: 将 `BusinessStoryExecutionProgress` 从标题信息左列移到标题与操作区整行下方，使其使用卡片内容区完整宽度。
- Result: 进度条及其上方分隔线不再受右侧控件列宽限制。
- Verification: `pnpm exec eslint 'src/components/business-stories/BusinessStoryCard.tsx'`、`pnpm exec tsc --noEmit`、`git diff --check` 通过。

## 2026-08-23 - 恢复刷新后的业务故事执行进度

- Request: 修复刷新敏捷业务需求池后需求进度条和分隔线消失的问题。
- Actions: 前端读取业务故事的 `execution_generation_run_id`，恢复对应 `GenerationRun` 并继续轮询；后端新增并持久化独立的执行任务关联字段，避免与业务故事生成任务的 `generation_run_id` 混用。
- Result: 刷新后已完成任务保留最终进度，运行中任务继续实时更新，进度条及分隔线恢复显示。
- Verification: 前端 ESLint、TypeScript、`git diff --check`，后端修改文件定向 Ruff、SQLAlchemy model mapper、`compileall` 和 `alembic heads` 通过；目标 pytest 因当前环境没有可用的 pytest 可执行文件未运行。

## 2026-08-23 - 限制敏捷需求池执行并发

- Request: 确保某个敏捷业务需求执行时其他需求不能执行。
- Actions: 前端增加项目级执行中状态并禁用其他故事的执行按钮；后端在入队前检查同项目活跃的 `generate_change_set` 任务，同一故事复用原任务，其他故事返回 409；新增后端回归测试。
- Result: 前端和后端均保证同一项目同时只有一个需求生成分层变更集。
- Verification: 前端 ESLint、TypeScript、`git diff --check`，后端定向 Ruff、SQLAlchemy model mapper 和 `git diff --check` 通过；目标 pytest 因当前环境没有可用的 pytest 可执行文件未运行。

## 2026-08-23 - 自动刷新需求执行完成后的变更集

- Request: 修复需求执行完成后变更集列表无法自动更新的问题。
- Actions: 在变更集页面轮询当前项目故事的 `execution_generation_run_id`；执行任务活动期间自动刷新列表，任务完成后立即刷新一次并停止轮询；增加执行中提示。
- Result: 从敏捷业务需求池执行需求后，变更集页面会自动显示新生成的分层变更集，无需手动刷新。
- Verification: `pnpm exec eslint 'src/app/projects/[projectId]/change-sets/page.tsx'`、`pnpm exec tsc --noEmit`、`git diff --check` 通过。

## 2026-08-23 17:24 UTC - 移除变更集页面说明文案

- Request: 去除变更集模块中的说明文本“按 layer 和 batch_id 查看变更集，已应用的版本会退回历史，不再作为默认有效项。”
- Actions: 删除 `src/app/projects/[projectId]/change-sets/page.tsx` 顶部说明段落，保留其他页面逻辑和现有未提交改动。
- Result: 变更集页面不再显示该说明文本。
- Verification: 定向 ESLint、全文检索和 `git diff --check` 通过。

## 2026-08-23 17:34 UTC - 为按层查看卡片增加滚动区域

- Request: 为“按层查看”卡片内增加滚动条。
- Actions: 将变更集页面桌面端主内容网格和“按层查看”卡片改为可收缩布局，并为卡片内容区增加独立垂直滚动。
- Result: 桌面端卡片标题区保持固定，层与版本列表在卡片内容区内滚动；移动端继续使用页面自然滚动。
- Verification: `pnpm exec eslint 'src/app/projects/[projectId]/change-sets/page.tsx'`、`pnpm exec tsc --noEmit`、`git diff --check` 通过。

## 2026-08-23 17:42 UTC - 修复按层查看卡片滚动未生效

- Request: 修复“按层查看”卡片内滚动条未生效的问题。
- Actions: 为桌面端主网格明确设置可收缩的 `minmax(0, 1fr)` 行轨道，并禁止卡片自身溢出，确保 `CardContent` 的 `overflow-y-auto` 接管列表滚动。
- Result: 层与版本列表不会再将卡片撑高，超出可用高度时在卡片内容区滚动。
- Verification: `pnpm exec eslint 'src/app/projects/[projectId]/change-sets/page.tsx'`、`pnpm exec tsc --noEmit`、`git diff --check` 通过。

## 2026-08-23 17:47 UTC - 强化按层查看卡片滚动高度约束

- Request: 根据截图继续修复“按层查看”卡片仍不能滚动的问题。
- Actions: 为变更集页面主网格增加 `lg:h-0`，为按层查看卡片增加 `lg:h-full`，并使用 `overflow-y-scroll` 明确将滚动交给卡片内容区。
- Result: 桌面端卡片高度由可用网格空间确定，列表内容超出后在卡片内部滚动；移动端布局不变。
- Verification: 定向 ESLint、TypeScript 和 `git diff --check` 通过；浏览器自动化未复用截图中的登录会话，未完成已登录页面的视觉复测。

## 2026-08-23 - 暂时隐藏变更集双栏卡片

- Request: 暂时不显示变更集模块中的“按层查看”卡片和其右侧详情卡片。
- Actions: 移除变更集页面下方双栏展示区域及其专属展示/操作代码，保留顶部统计卡、变更集加载、错误处理和需求执行状态轮询。
- Result: 变更集页面当前不再显示按层列表、详情内容、模块变更、JSON 和详情操作按钮。
- Verification: `pnpm lint`、`pnpm exec tsc --noEmit` 通过。

## 2026-08-23 - 增加方案资产与资产详情双卡片

- Request: 在变更集模块中添加左侧“方案资产”卡片和右侧“资产详情”卡片。
- Actions: 恢复变更集双栏展示；左侧按变更集列出方案资产并支持选择，右侧展示选中资产的版本状态、影响摘要、四类模块变更明细和资产变更 JSON。
- Result: 变更集页面恢复可浏览的资产选择与详情查看，不新增后端接口。
- Verification: `pnpm lint`、`pnpm exec tsc --noEmit`、`git diff --check` 通过。

## 2026-08-24 13:03 +08 - 固定方案资产展示顺序

- Request: 将方案资产卡片顺序调整为 UX 用户体验设计最前、数据库模型最后。
- Actions: 在 `src/app/projects/[projectId]/change-sets/page.tsx` 增加固定 layer 排序：UX、UI、前端工程实现、API 契约、后端工程实现、数据库模型；同层继续按版本和创建时间倒序。
- Result: 方案资产卡片按产品设计到数据库模型的顺序展示。
- Verification: `pnpm lint`、`pnpm exec tsc --noEmit`、`git diff --check` 通过。

## 2026-08-24 13:09 +08 - 简化资产详情版本 Badge

- Request: 资产详情卡片中的版本 Badge 去除“版本”两字，只显示 `v1`、`v2` 等版本号。
- Actions: 修改 `src/app/projects/[projectId]/change-sets/page.tsx`，将资产详情版本 Badge 从“版本 vX”改为“vX”。
- Result: 左侧方案资产列表和右侧资产详情的版本 Badge 统一使用纯版本号格式。
- Verification: `pnpm lint`、`pnpm exec tsc --noEmit`、`git diff --check` 通过。

## 2026-08-23 - 修复方案资产卡片滚动失效

- Request: 参考敏捷业务需求池的卡片内滚动条，为方案资产卡片增加滚动条，并排查外部全局设置是否导致滚动失效。
- Actions: 对齐需求池的滚动布局，在变更集页面根节点、双栏网格、左右卡片和内容区补齐 `h-full`、`h-0`、`min-h-0`、`flex-1`、`overflow-hidden` 与 `overflow-y-auto`；检查 `AppShell` 和 `ProjectWorkspaceShell` 的固定高度及外部 `overflow-hidden`。
- Result: 方案资产列表由左侧 `CardContent` 独立滚动，资产详情内容也独立滚动；外部全局 `overflow-hidden` 保留为项目工作区布局约束，确认根因是页面内部高度收缩链不完整。
- Verification: `pnpm lint`、`pnpm exec tsc --noEmit`、`git diff --check` 通过。

## 2026-08-23 - 统一修复方案资产组滚动

- Request: 为方案资产组中的各个模块都进行卡片内滚动条修复。
- Actions: 修改共享 `src/components/design-assets/VersionedAssetPage.tsx` 和 `src/components/design-assets/VersionList.tsx`，补齐页面、双栏网格、版本列表卡片和详情列的高度收缩链，并让左右内容区分别使用内部滚动。
- Result: UX、UI、前端实现、API 契约、后端实现和数据库模型六个方案资产模块统一具备卡片内滚动，不需要逐页重复修改。
- Verification: `pnpm lint`、`pnpm exec tsc --noEmit`、`git diff --check` 通过。

## 2026-08-24 10:58 +08 - 移除变更集方案资产卡片描述

- Request: 在前端的变更集模块中去除文本“选择一个方案资产查看变更详情”。
- Actions: 修改 `src/app/projects/[projectId]/change-sets/page.tsx`，删除左侧“方案资产”卡片标题下方的 `CardDescription` 文案。
- Result: 变更集页面左侧方案资产卡片不再显示该说明文本，右侧资产详情逻辑保持不变。
- Verification: `pnpm lint`、`git diff --check` 通过。

## 2026-08-24 11:07 +08 - 修复变更集方案资产版本展示

- Request: 修复只执行一次敏捷业务后，方案资产列表显示 UX v1、UI v2、前端 v3、API v4、后端 v5、数据库 v6 的问题。
- Actions: 在 `src/app/projects/[projectId]/change-sets/page.tsx` 中按 layer 和创建顺序推导展示用资产版本，并将左侧列表与右侧详情的版本 Badge 改为使用该派生版本。
- Result: 即使后端已有旧数据使用项目级全局 `ChangeSet.version`，首批每个方案资产层也会显示为 v1；后续同层记录按 v2、v3 递增展示。
- Verification: `pnpm lint`、`git diff --check` 通过。

## 2026-08-24 11:37 +08 - 移除变更集顶部统计卡片

- Request: 在前端变更集模块中去除“分层数”“当前有效”“已应用”三个数字卡片。
- Actions: 修改 `src/app/projects/[projectId]/change-sets/page.tsx`，删除顶部三列统计卡片区域，并清理不再使用的 `currentLayerCount` memo。
- Result: 变更集页面顶部不再展示三个统计数字卡片，页面直接进入加载状态或方案资产/资产详情双栏区域。
- Verification: `pnpm lint`、`git diff --check` 通过。

## 2026-08-24 12:01 +08 - 对齐方案资产 UX/UI 名称

- Request: 将变更集方案资产中的“UX设计”“UI设计”对齐左侧导航栏模块名称。
- Actions: 修改 `src/lib/design-asset-labels.ts`，将 `ux_design` 与 `ui_design` 的展示名改为“UX 用户体验设计”和“UI 视觉设计”。
- Result: 变更集方案资产列表、资产详情模块标题和相关影响层 Badge 使用与导航一致的 UX/UI 名称。
- Verification: `pnpm lint`、`git diff --check` 通过。

## 2026-08-24 12:11 +08 - 更新方案资产导航名称

- Request: 将左侧导航栏中的“前端实现版本”改为“前端工程实现”，将“后端实现版本”改为“后端工程实现”。
- Actions: 修改 `src/components/project/project-navigation.ts` 中方案资产分组的前端和后端导航项 label。
- Result: 桌面侧栏和移动端项目导航复用的新名称与方案资产标签保持一致。
- Verification: `pnpm lint`、`git diff --check` 通过。

## 2026-08-24 12:14 +08 - 隐藏方案资产列表状态 Badge

- Request: 变更集模块的每个方案资产条目不显示“就绪”等状态 Badge。
- Actions: 修改 `src/app/projects/[projectId]/change-sets/page.tsx`，删除左侧方案资产列表条目中的 `changeSetStatusLabels` 状态 Badge。
- Result: 方案资产列表仅保留资产名称、版本和当前标记；右侧资产详情仍保留状态展示。
- Verification: `pnpm lint`、`git diff --check` 通过。

## 2026-08-24 12:17 +08 - 隐藏资产详情状态 Badge

- Request: 资产详情卡片中也不显示“就绪”等状态 Badge。
- Actions: 修改 `src/app/projects/[projectId]/change-sets/page.tsx`，删除右侧资产详情头部的状态 Badge，并清理不再使用的 `changeSetStatusLabels` import。
- Result: 变更集页面的方案资产列表和资产详情卡片都不再显示变更集状态 Badge，仅保留版本与当前/历史标记。
- Verification: `pnpm lint`、`git diff --check` 通过。

## 2026-08-24 12:23 +08 - 增加变更集历史应用记录与应用按钮

- Request: 参照敏捷业务需求池的“历史执行记录”和“执行”按钮，在变更集模块实现“历史应用记录”，并为资产详情增加“应用”按钮。
- Actions: 修改 `src/app/projects/[projectId]/change-sets/page.tsx`，新增历史应用记录浮层、应用按钮、`applyChangeSet` 调用和 `GenerationRun` 轮询逻辑；应用完成后刷新变更集和历史记录。
- Result: 变更集页面可查看已应用方案资产记录，选中资产详情后可直接点击“应用”执行应用任务。
- Verification: `pnpm lint`、`pnpm exec tsc --noEmit`、`git diff --check` 通过。

## 2026-08-24 12:27 +08 - 变更集主视图仅显示当前有效资产

- Request: 方案资产和资产详情卡片中只显示“当前有效”的条目，成功应用的条目放入历史应用记录卡片。
- Actions: 修改 `src/app/projects/[projectId]/change-sets/page.tsx`，新增当前有效与已应用筛选函数；主列表和详情只使用未应用且 `is_current !== false` 的 ChangeSet，历史应用记录使用 `applied_at` 或 `status="applied"` 的记录。
- Result: 已应用的方案资产不会继续出现在主视图中，会进入历史应用记录浮层展示。
- Verification: `pnpm lint`、`pnpm exec tsc --noEmit`、`git diff --check` 通过。

## 2026-08-24 12:30 +08 - 隐藏当前有效标记 Badge

- Request: 方案资产和资产详情卡片中的条目不显示“当前”和“当前有效”所在的 Badge。
- Actions: 修改 `src/app/projects/[projectId]/change-sets/page.tsx`，删除左侧列表的“当前” Badge 和右侧详情的“当前有效/历史版本” Badge。
- Result: 变更集主视图只保留资产层名称、版本、标题、时间和详情内容，不再展示当前状态标记。
- Verification: `pnpm lint`、`pnpm exec tsc --noEmit`、`git diff --check` 通过。

## 2026-08-24 12:38 +08 - 移除变更集不变分组展示

- Request: 从每个变更集资产中移除“不变”分类，只保留新增、修改、删除。
- Actions: 修改 `src/lib/types/design-asset.ts`、`src/components/design-assets/ModuleChangeViewer.tsx` 和 `src/app/projects/[projectId]/change-sets/page.tsx`，删除 `unchanged` 类型/分组配置，并在变更集详情中对历史 `module_changes` 做展示和 JSON 过滤。
- Result: 变更集资产详情和资产变更 JSON 只显示新增、修改、删除三类，历史数据中的 `unchanged` 不再出现在 UI 中。
- Verification: `pnpm lint`、`pnpm exec tsc --noEmit`、`git diff --check` 通过。

## 2026-08-24 12:51 +08 - 移除资产变更 JSON 展示

- Request: 去除资产详情中的“资产变更 JSON”。
- Actions: 修改 `src/app/projects/[projectId]/change-sets/page.tsx`，删除资产详情底部的 `JsonViewer` 及其 import；保留新增、修改、删除明细展示。
- Result: 资产详情卡片不再显示资产变更 JSON，只保留结构化模块变更内容。
- Verification: `pnpm lint`、`pnpm exec tsc --noEmit`、`git diff --check` 通过。

## 2026-08-24 12:57 +08 - 调整变更集日期展示位置

- Request: 将方案资产条目的日期移动到资产详情描述文本下方、版本 Badge 上方。
- Actions: 删除左侧方案资产列表中的创建日期；在右侧资产详情的影响摘要下方新增创建日期，并置于版本 Badge 之前。
- Result: 日期只在资产详情中展示，顺序为描述文本、创建日期、版本 Badge。
- Verification: `pnpm lint`、`pnpm exec tsc --noEmit`、`git diff --check` 通过。

## 2026-08-25 13:57 +08 - 移除变更集等待提示

- Request: 去除变更集模块中的“正在等待需求执行完成，变更集列表会自动更新...”文本。
- Actions: 更新 `src/app/projects/[projectId]/change-sets/page.tsx`，删除等待提示的条件渲染及仅供该文案使用的状态变量；保留后台任务检测与变更集自动刷新逻辑。
- Result: 变更集模块不再显示该等待提示，需求执行期间仍会自动更新列表。
- Verification: `pnpm exec eslint 'src/app/projects/[projectId]/change-sets/page.tsx'`、`git diff --check` 通过；`rg` 确认目标文本不存在。

## 2026-08-25 14:00 +08 - 移除原始用户需求等待提示

- Request: 去除原始用户需求模块中的“已有需求正在更新，请等待完成后再提交新的用户需求”文本。
- Actions: 更新 `src/app/projects/[projectId]/requirements/page.tsx`，移除传给 `RequirementEditor` 的提示文案；更新 `src/components/requirement/RequirementEditor.tsx`，删除没有其他调用方的 `disabledMessage` 属性和渲染。
- Result: 原始用户需求模块不再显示该提示，需求更新期间的输入和提交禁用逻辑保持不变。
- Verification: `pnpm exec eslint 'src/app/projects/[projectId]/requirements/page.tsx' src/components/requirement/RequirementEditor.tsx`、`git diff --check` 通过；`rg` 确认目标文本和 `disabledMessage` 均不存在于 `src`。

## 2026-08-25 14:10 +08 - 按项目打开时间排序

- Request: 我的项目按点击进入时间排序；新建项目的点击时间默认为创建时间。
- Actions: 扩展 `Project` 类型与项目 API，新增打开时间上报函数；在 `src/app/projects/[projectId]/layout.tsx` 进入任意项目页面时调用后端打开记录接口。
- Result: 点击进入项目会更新其后端打开时间，项目列表刷新后会按最近打开时间倒序展示；新项目的初始排序时间由后端创建时间提供。
- Verification: `pnpm exec eslint 'src/app/projects/[projectId]/layout.tsx' src/lib/api/projects.ts src/lib/types/project.ts`、`pnpm exec tsc --noEmit`、`git diff --check` 通过。

## 2026-08-25 14:22 +08 - 调整变更集名称展示

- Request: 去除变更集模块方案资产条目里的具体名称，仅保留资产名称，并把右侧资产详情卡片中的当前资产名称改为具体变更集名称。
- Actions: 更新 `src/app/projects/[projectId]/change-sets/page.tsx`，左侧列表移除条目标题、收紧资产名称字号和字重；右侧卡片交换标题与副标题展示，让具体变更集名称上移。
- Result: 左侧方案资产条目现在只显示层名和版本，右侧资产详情顶部显示具体变更集名称，层名作为说明保留在下方。
- Verification: `pnpm exec eslint 'src/app/projects/[projectId]/change-sets/page.tsx'`、`pnpm exec tsc --noEmit` 通过。

## 2026-08-25 14:31 +08 - 移动资产详情版本标记

- Request: 将资产详情中的版本 Badge 移动到资产名称右侧。
- Actions: 更新 `src/app/projects/[projectId]/change-sets/page.tsx`，将版本 Badge 放入资产详情标题行，并移除正文中原有的版本展示。
- Result: 选中资产时，具体变更集名称右侧会直接显示对应的方案资产版本。
- Verification: `pnpm exec eslint 'src/app/projects/[projectId]/change-sets/page.tsx'`、`pnpm exec tsc --noEmit` 通过。

## 2026-08-25 14:35 +08 - 修正资产详情版本标记位置

- Request: 将版本 Badge 从具体变更集名称旁移至资产名称旁。
- Actions: 更新 `src/app/projects/[projectId]/change-sets/page.tsx`，将 Badge 从标题行挪到资产层名所在的副标题行。
- Result: 资产详情标题只显示具体变更集名称；下方显示“UX 用户体验设计 v1”等资产名称和对应版本。
- Verification: `pnpm exec eslint 'src/app/projects/[projectId]/change-sets/page.tsx'`、`pnpm exec tsc --noEmit`、`git diff --check` 通过。

## 2026-08-25 14:38 +08 - 调整变更集应用按钮位置

- Request: 将资产详情中的“应用”按钮向下、向左移动。
- Actions: 更新 `src/app/projects/[projectId]/change-sets/page.tsx`，为桌面端按钮容器增加顶部和右侧间距。
- Result: “应用”按钮相对资产详情右上角向下、向左收进，移动端布局保持不变。
- Verification: `pnpm exec eslint 'src/app/projects/[projectId]/change-sets/page.tsx'`、`pnpm exec tsc --noEmit`、`git diff --check` 通过。

## 2026-08-25 14:40 +08 - 撤销变更集应用按钮位置调整

- Request: 撤销资产详情“应用”按钮向下、向左移动的调整。
- Actions: 更新 `src/app/projects/[projectId]/change-sets/page.tsx`，移除按钮容器的桌面端顶部和右侧间距。
- Result: “应用”按钮恢复到资产详情卡片头部右侧的原始对齐位置。
- Verification: `pnpm exec eslint 'src/app/projects/[projectId]/change-sets/page.tsx'`、`pnpm exec tsc --noEmit`、`git diff --check` 通过。

## 2026-08-25 14:44 +08 - 对齐资产详情阐述文本颜色

- Request: 将变更集资产详情的影响摘要颜色改为敏捷业务需求详情中垂直切片说明正文的颜色。
- Actions: 更新 `src/app/projects/[projectId]/change-sets/page.tsx`，为 `impact_summary` 使用与 `BusinessStoryCard` 的 `vertical_slice_note` 相同的浅色和深色主题文字颜色。
- Result: 资产详情的阐述文本现在使用 `text-[oklch(0.42_0.06_55)] dark:text-[oklch(0.82_0.08_65)]`，原有字号和行距保持不变。
- Verification: `pnpm exec eslint 'src/app/projects/[projectId]/change-sets/page.tsx'`、`pnpm exec tsc --noEmit`、`git diff --check` 通过。

## 2026-08-25 14:47 +08 - 加粗资产详情阐述文本

- Request: 将资产详情卡片中的阐述文本加粗。
- Actions: 更新 `src/app/projects/[projectId]/change-sets/page.tsx`，为 `impact_summary` 增加 `font-medium`。
- Result: 资产详情阐述文本在保持既有颜色、字号和行距的基础上加粗显示。
- Verification: `pnpm exec eslint 'src/app/projects/[projectId]/change-sets/page.tsx'`、`pnpm exec tsc --noEmit`、`git diff --check` 通过。

## 2026-08-25 14:51 +08 - 移除资产详情冗余层级

- Request: 去除资产详情中“UX 用户体验设计”等外层卡片，只保留新增、修改、删除部分。
- Actions: 更新 `src/app/projects/[projectId]/change-sets/page.tsx`，移除模块层外壳、边框和层名标题，保留变更分组网格。
- Result: 资产详情直接展示新增、修改、删除三个内容块，不再嵌套显示资产层名称。
- Verification: `pnpm exec eslint 'src/app/projects/[projectId]/change-sets/page.tsx'`、`pnpm exec tsc --noEmit`、`git diff --check` 通过。

## 2026-08-25 14:53 +08 - 纵向排列资产变更分组

- Request: 将“新增”“修改”“删除”改为垂直排布。
- Actions: 更新 `src/app/projects/[projectId]/change-sets/page.tsx`，移除变更分组网格的桌面端双列样式。
- Result: 新增、修改、删除内容块在所有屏幕尺寸下按单列从上到下排列。
- Verification: `pnpm exec eslint 'src/app/projects/[projectId]/change-sets/page.tsx'`、`pnpm exec tsc --noEmit`、`git diff --check` 通过。

## 2026-08-25 14:56 +08 - 增大资产详情日期后间距

- Request: 显著增大资产详情创建日期和新增分组之间的间距。
- Actions: 更新 `src/app/projects/[projectId]/change-sets/page.tsx`，为变更分组容器增加 `mt-8`。
- Result: 创建日期下方与新增、修改、删除变更分组之间保留更明显的垂直留白。
- Verification: `pnpm exec eslint 'src/app/projects/[projectId]/change-sets/page.tsx'`、`pnpm exec tsc --noEmit`、`git diff --check` 通过。

## 2026-08-25 15:00 +08 - 再增大资产详情日期后间距

- Request: 继续增大资产详情创建日期和新增分组之间的间距。
- Actions: 更新 `src/app/projects/[projectId]/change-sets/page.tsx`，将变更分组容器的顶部间距从 `mt-8` 扩大为 `mt-12`。
- Result: 创建日期下方与新增、修改、删除变更分组之间保留更大的垂直留白。
- Verification: `pnpm exec eslint 'src/app/projects/[projectId]/change-sets/page.tsx'`、`pnpm exec tsc --noEmit`、`git diff --check` 通过。

## 2026-08-25 15:04 +08 - 收紧资产名称与阐述文本间距

- Request: 缩小资产详情中资产名称与影响摘要之间的间距。
- Actions: 更新 `src/app/projects/[projectId]/change-sets/page.tsx`，将资产详情 `CardHeader` 的底部内边距设为 `pb-3`。
- Result: 资产层名及版本下方到影响摘要正文之间的垂直留白缩小，头部内部排版保持不变。
- Verification: `pnpm exec eslint 'src/app/projects/[projectId]/change-sets/page.tsx'`、`pnpm exec tsc --noEmit`、`git diff --check` 通过。

## 2026-08-25 15:07 +08 - 增大资产详情阐述文本顶部间距

- Request: 增大资产详情阐述文本的顶部间距。
- Actions: 更新 `src/app/projects/[projectId]/change-sets/page.tsx`，为 `impact_summary` 增加 `pt-4`。
- Result: 阐述文本与上方资产名称及版本之间保留更明显的顶部留白，其他文字样式保持不变。
- Verification: `pnpm exec eslint 'src/app/projects/[projectId]/change-sets/page.tsx'`、`pnpm exec tsc --noEmit`、`git diff --check` 通过。

## 2026-08-25 23:40 +08 - 增加变更集应用实时进度条

- Request: 点击变更集“应用”按钮后，在按钮下方显示类似敏捷业务需求池需求详情卡片的实时进度条。
- Actions: 更新 `src/app/projects/[projectId]/change-sets/page.tsx`，复用 `GenerationRun` 的 `progress`、`message` 和 `status`，在应用轮询期间同步更新进度展示，并为完成、失败状态使用对应颜色。
- Result: 应用按钮下方会显示百分比、后端进度文案和实时进度条；批量应用与单个变更集应用均支持，失败时保留错误进度状态。
- Verification: `pnpm lint`、`pnpm build`、`git diff --check` 通过。

## 2026-08-25 23:56 +08 - 恢复变更集应用进度

- Request: 刷新页面或切换模块后，变更集应用进度条仍需保持并继续更新。
- Actions: 新增项目级活动应用任务查询接口；前端重新进入变更集页面时加载活动 `apply_change_set` 父任务，按关联变更集/批次恢复进度条并继续轮询。
- Result: 应用任务状态不再只依赖页面内存，刷新、导航切换和重新打开页面后可以恢复进度。
- Verification: 前端 `pnpm lint`、`pnpm build`；后端 `uv run pytest tests/test_generation_queue.py -q`（16 passed）；前后端 `git diff --check` 通过。

## 2026-08-26 13:17 +08 - 缩小指令集合版本列表宽度

- Request: 缩小指令集合模块中版本列表的宽度。
- Actions: 更新 `src/app/projects/[projectId]/prompts/page.tsx`，将桌面两栏布局的版本列表列宽从 `minmax(280px,360px)` 收窄为 `minmax(220px,280px)`；同步更新项目技术文档。
- Result: 指令集合详情区获得更多横向阅读空间，版本列表仍保留标题截断和滚动能力。
- Verification: `pnpm lint`、`pnpm exec tsc --noEmit` 通过。

## 2026-08-26 13:21 +08 - 调整指令集合提示词卡片标题层级

- Request: 交换指令集合详情卡片中前端/后端提示词类型文本与具体实现标题的视觉样式。
- Actions: 更新 `src/app/projects/[projectId]/prompts/page.tsx` 的 `PromptBlock`，将“前端提示词/后端提示词”渲染为 `CardTitle`，将具体实现标题渲染为 `CardDescription`；同步更新项目技术文档。
- Result: 前端和后端提示词卡片现在以提示词类型作为主标题，具体实现标题降为说明层级。
- Verification: `pnpm lint`、`pnpm exec tsc --noEmit` 通过。

## 2026-08-26 13:24 +08 - 为指令集合标题补充图标

- Request: 为指令集合模块内的版本列表、后端提示词和前端提示词标题增加 icon。
- Actions: 更新 `src/components/design-assets/VersionList.tsx`，为版本列表标题加入 `History` 图标；更新 `src/app/projects/[projectId]/prompts/page.tsx`，为后端提示词和前端提示词标题分别加入 `ServerCog` 与 `PanelTopOpen` 图标；同步更新项目技术文档。
- Result: 指令集合模块三个标题现在都带有语义化图标，视觉层级与其他模块标题保持一致。
- Verification: `pnpm lint`、`pnpm exec tsc --noEmit` 通过。

## 2026-08-26 13:28 +08 - 结构化指令集合提示词正文

- Request: 改善指令集合模块中后端提示词和前端提示词正文框的可视化效果。
- Actions: 更新 `src/app/projects/[projectId]/prompts/page.tsx`，把提示词正文从单一 `pre` 块改为可解析的结构化步骤视图，自动拆分前置说明和编号步骤，并在无结构化内容时回退纯文本。
- Result: 长提示词现在更适合扫读，步骤层级更清楚，正文框的视觉密度也更平衡。
- Verification: `pnpm lint`、`pnpm exec tsc --noEmit` 通过。

## 2026-08-26 13:30 +08 - 修复提示词段内编号解析

- Request: 用户反馈结构化提示词正文修改后页面无变化。
- Actions: 更新 `src/app/projects/[projectId]/prompts/page.tsx` 的正文解析逻辑，在解析前为段内 `1. ...`、`2. ...` 编号插入换行，支持单段长 prompt 拆分为步骤卡片；同步更新项目技术文档。
- Result: 同一段内连续编号的后端/前端提示词也会进入结构化步骤视图。
- Verification: `pnpm lint`、`pnpm exec tsc --noEmit` 通过。

## 2026-08-26 13:33 +08 - 移除指令集合提示词状态 Badge

- Request: 去除指令集合模块中前端/后端提示词卡片的“需要修改/无需修改”badge。
- Actions: 更新 `src/app/projects/[projectId]/prompts/page.tsx`，删除 `PromptNeededBadge` 组件、`Badge` 导入以及前端/后端提示词卡片头部的状态 badge；同步更新项目技术文档。
- Result: 提示词卡片头部只保留标题、说明和复制按钮，视觉更简洁。
- Verification: `pnpm lint`、`pnpm exec tsc --noEmit` 通过。

## 2026-08-26 13:36 +08 - 优化指令集合差异摘要展示

- Request: 优化指令集合模块中差异摘要的可视化效果。
- Actions: 更新 `src/app/projects/[projectId]/prompts/page.tsx`，新增 `DiffSummaryPanel`，为差异摘要加入图标标题、对象分组展示和字符串拆条展示；同步更新项目技术文档。
- Result: 差异摘要从普通段落升级为结构化摘要面板，更易扫描变更点。
- Verification: `pnpm lint`、`pnpm exec tsc --noEmit` 通过。

## 2026-08-26 20:11 +08 - 升级变更集历史应用浮层详情

- Request: 点击变更集模块历史应用记录条目后，在全局悬浮框内按原样显示对应旧方案资产和资产详情。
- Actions: 更新 `src/app/projects/[projectId]/change-sets/page.tsx`，抽出方案资产列表与资产详情展示组件，历史应用浮层改为批次列表、旧方案资产列表和只读资产详情三栏布局，并保留加载、错误、空态、关闭和重试状态。
- Result: 历史应用记录条目可切换对应批次，批次内层级资产可继续切换，右侧复用 `ModuleChangeViewer` 展示旧 ChangeSet 详情；未改 API、后端 schema 或数据库。
- Verification: `pnpm exec tsc --noEmit`、`pnpm lint` 通过。

## 2026-08-26 20:20 +08 - 缩小变更集历史浮层尺寸

- Request: 缩小历史应用记录悬浮框的长和宽。
- Actions: 更新 `src/app/projects/[projectId]/change-sets/page.tsx`，将历史应用记录浮层改为居中固定最大宽高，并收窄批次列表和方案资产列表两列。
- Result: 历史应用记录浮层不再接近铺满视口，桌面端最大宽度和高度更克制，内部三栏仍保持独立滚动。
- Verification: `pnpm exec tsc --noEmit`、`pnpm lint` 通过。

## 2026-08-26 20:22 +08 - 回调历史浮层中等尺寸

- Request: 用户反馈历史应用记录悬浮框缩得太小，需要放大一些。
- Actions: 更新 `src/app/projects/[projectId]/change-sets/page.tsx`，将历史应用记录浮层最大宽高调大，并把批次列表和方案资产列表列宽回调。
- Result: 历史浮层保持居中和不铺满屏幕，同时比前一版更宽更高，详情阅读空间增加。
- Verification: `pnpm exec tsc --noEmit`、`pnpm lint` 通过。

## 2026-08-26 20:30 +08 - 简化历史浮层记录列表

- Request: 将历史应用记录作为浮层标题，第一列改名为“记录列表”，只显示版本号和应用时间并缩小列宽。
- Actions: 更新 `src/app/projects/[projectId]/change-sets/page.tsx`，把历史浮层第一列标题改为“记录列表”，移除批次标题、层数和层级 Badge，条目只保留版本号与应用时间，列宽缩至 180px。
- Result: 历史浮层总标题与第一列导航语义分离，记录列表更轻量，详情空间更集中。
- Verification: `pnpm exec tsc --noEmit`、`pnpm lint` 通过。

## 2026-08-26 20:33 +08 - 下移变更集历史浮层

- Request: 将历史应用记录悬浮框整体向下移动一些。
- Actions: 更新 `src/app/projects/[projectId]/change-sets/page.tsx`，将历史浮层顶部定位从 `top-20`/`lg:top-24` 调整为 `top-28`/`lg:top-32`，并同步收紧最大高度计算避免底部溢出。
- Result: 历史应用记录浮层整体位置下移，仍保持居中固定和内部滚动。
- Verification: `pnpm exec tsc --noEmit`、`pnpm lint` 通过。

## 2026-08-26 20:36 +08 - 撤销历史浮层下移

- Request: 撤销上一轮将历史应用记录悬浮框整体向下移动的改动。
- Actions: 更新 `src/app/projects/[projectId]/change-sets/page.tsx`，将历史浮层顶部定位和最大高度计算恢复为下移前的 `top-20`/`lg:top-24` 与 `calc(100vh-6rem)`/`calc(100vh-8rem)`。
- Result: 历史应用记录浮层恢复到下移前的位置，尺寸、三栏布局和记录列表简化保持不变。
- Verification: `pnpm exec tsc --noEmit`、`pnpm lint` 通过。

## 2026-08-26 20:38 +08 - 区分历史浮层记录列表图标

- Request: 更改记录列表的 icon，避免与历史应用记录标题的 icon 相同。
- Actions: 更新 `src/app/projects/[projectId]/change-sets/page.tsx`，将历史浮层第一列“记录列表”的图标从 `History` 改为 `List`。
- Result: 浮层总标题继续使用历史图标，第一列导航使用列表图标，语义和视觉更清楚。
- Verification: `pnpm exec tsc --noEmit`、`pnpm lint` 通过。

## 2026-08-26 20:43 +08 - 支持拖拽历史应用记录浮层

- Request: 历史应用记录窗口能够拖拽移动。
- Actions: 更新 `src/app/projects/[projectId]/change-sets/page.tsx`，为历史应用记录浮层增加基于 pointer 事件的标题栏拖拽定位，拖动时限制窗口留在视口内，并保留关闭按钮点击行为。
- Result: 用户可以按住浮层标题栏移动历史应用记录窗口，拖动后窗口使用固定像素位置展示。
- Verification: `pnpm exec tsc --noEmit`、`pnpm lint` 通过。

## 2026-08-26 20:51 +08 - 优化敏捷业务历史执行记录

- Request: 参考变更集模块的历史应用记录优化，优化敏捷业务需求池模块的历史执行记录。
- Actions: 更新 `src/app/projects/[projectId]/business-stories/page.tsx`，将历史执行记录改为可拖拽全局浮层，内部使用“记录列表 / 需求详情”两栏；记录列表只显示推导版本号和执行时间，详情复用 `BusinessStoryCard`。同步更新 `BusinessStoryCard`、`InlineEditableText` 和 `InlineEditableList`，支持历史只读展示时禁用编辑提示和保存入口。
- Result: 历史执行记录浮层与变更集历史浮层交互保持一致，可移动、可切换记录，并以原需求详情卡片样式只读查看历史故事。
- Verification: `pnpm exec tsc --noEmit`、`pnpm lint` 通过。

## 2026-08-26 21:00 +08 - 指令集合版本列表显示创建日期

- Request: 为指令集合模块中的版本列表卡片条目增加创建日期。
- Actions: 更新 `src/components/design-assets/VersionList.tsx`，为通用版本列表增加可选 `showCreatedAt` 展示开关；更新 `src/app/projects/[projectId]/prompts/page.tsx`，仅在指令集合版本列表启用该开关。
- Result: 指令集合版本列表条目在标题和版本号下方显示“创建于”日期时间，其他版本资产列表默认不受影响。
- Verification: `pnpm exec eslint src/components/design-assets/VersionList.tsx 'src/app/projects/[projectId]/prompts/page.tsx'` 通过。

## 2026-08-27 12:44 +08 - 缩小变更集方案资产卡片

- Request: 缩小变更集模块中方案资产卡片的宽度。
- Actions: 更新 `src/app/projects/[projectId]/change-sets/page.tsx`，将主页面方案资产列从 360px 缩至 300px，并将历史应用记录浮层中的方案资产列从 240px 缩至 220px。
- Result: 桌面端方案资产卡片更窄，右侧资产详情获得更多横向空间；移动端仍保持单列全宽展示。
- Verification: `pnpm exec eslint 'src/app/projects/[projectId]/change-sets/page.tsx'` 通过。

## 2026-08-27 12:50 +08 - 调整方案资产版本页头部布局

- Request: 将 UX 用户体验设计、UI 视觉设计、前端工程实现、API 契约、后端工程实现和数据库模型的版本列表卡片收窄，把右侧详情日期移动到版本阐述文段下方，并为详情标题增加与导航一致的 icon。
- Actions: 更新 `src/components/design-assets/VersionedAssetPage.tsx` 和 `src/components/design-assets/AssetHeader.tsx`，增加窄版版本列表列宽、详情标题 icon 和日期位置调整；在六个方案资产页面传入对应 lucide 导航图标。
- Result: 指定六个方案资产模块桌面端版本列表列宽缩至 260px，详情卡标题左侧显示对应模块图标，创建日期位于摘要文段下方。
- Verification: `pnpm exec eslint src/components/design-assets/VersionedAssetPage.tsx src/components/design-assets/AssetHeader.tsx 'src/app/projects/[projectId]/ux-design/page.tsx' 'src/app/projects/[projectId]/ui-design/page.tsx' 'src/app/projects/[projectId]/frontend-implementation/page.tsx' 'src/app/projects/[projectId]/api-contract/page.tsx' 'src/app/projects/[projectId]/backend-implementation/page.tsx' 'src/app/projects/[projectId]/db-model/page.tsx'` 和 `pnpm exec tsc --noEmit` 通过。

## 2026-08-27 13:07 +08 - 调整敏捷业务需求执行结果展示

- Request: 敏捷业务需求池中执行成功的需求条目移动到历史执行记录，执行失败的需求条目按钮文案从“执行”改为“重试”。
- Actions: 更新 `src/app/projects/[projectId]/business-stories/page.tsx`、`src/components/business-stories/BusinessStoryList.tsx` 和 `src/components/business-stories/BusinessStoryCard.tsx`，用执行任务完成状态兜底判断成功历史，用失败任务状态驱动按钮文案。
- Result: 成功生成变更集的需求会从当前需求列表隐藏并进入历史执行记录；失败需求保留在当前列表，执行按钮显示“重试”。
- Verification: `pnpm exec eslint 'src/app/projects/[projectId]/business-stories/page.tsx' src/components/business-stories/BusinessStoryCard.tsx src/components/business-stories/BusinessStoryList.tsx` 和 `pnpm exec tsc --noEmit` 通过。

## 2026-08-27 13:26 +08 - 展开 UX 页面低保真结构卡片

- Request: 将 UX 用户体验设计模块中的页面低保真结构卡片宽度展开。
- Actions: 更新 `src/components/ux-design/UXDesignContentViewer.tsx`，移除页面低保真结构列表在桌面端的双列网格限制。
- Result: 页面低保真结构中的每个页面卡片改为单列展示，占满右侧详情区域宽度。
- Verification: `pnpm exec eslint src/components/ux-design/UXDesignContentViewer.tsx` 和 `pnpm exec tsc --noEmit` 通过。

## 2026-08-27 15:25 +08 - 优化方案资产版本差异卡片

- Request: 优化 UX 用户体验设计、UI 视觉设计、前端工程实现、API 契约、后端工程实现和数据库模型中的版本差异卡片可视化效果。
- Actions: 更新 `src/components/design-assets/DiffSummary.tsx`，将标准 `added/modified/removed` 差异渲染为统计栏和分类差异卡片，并为非标准对象保留摘要与复制原始内容能力。
- Result: 六个方案资产页通过共享 `DiffSummary` 获得结构化版本差异展示，字符串、空差异和历史非标准对象继续兼容。
- Verification: `pnpm exec tsc --noEmit`、`pnpm exec eslint src/components/design-assets/DiffSummary.tsx src/components/design-assets/VersionedAssetPage.tsx` 和 `git diff --check` 通过。

## 2026-08-27 15:37 +08 - 隐藏空版本差异详情分组

- Request: 共享版本差异卡片中，新增、修改、删除任一项为 0 时不显示下方详情区块，但保留顶部统计。
- Actions: 更新 `src/components/design-assets/DiffSummary.tsx`，仅在对应分类存在差异项时渲染 `DiffOperationSection`。
- Result: 顶部新增/修改/删除统计始终保留；0 项分类不再显示空详情分组。
- Verification: `pnpm exec tsc --noEmit`、`pnpm exec eslint src/components/design-assets/DiffSummary.tsx` 和 `git diff --check` 通过。

## 2026-08-27 18:48 +08 - 登录失效全局跳转提示

- Request: 用户登录信息失效时直接跳转到登录页，并给出警告级别全局提示“请先登录”。
- Actions: 新增 `src/lib/auth/login-required.ts` 统一构造登录跳转参数；更新 `src/lib/api/client.ts` 在 401 响应时默认触发浏览器跳转，并允许登录态静默恢复请求关闭该行为；更新 `RequireAuth`、`RequireAdmin` 和 dashboard 服务端 layout 的未登录跳转；登录页读取 `loginRequired=1` 后通过 `sonner` 展示 warning toast。
- Result: 受保护页面和普通业务 API 遇到登录失效都会跳转到 `/login`，并在登录页显示全局警告提示“请先登录”，同时保留原页面作为 `redirectTo`。
- Verification: `pnpm exec tsc --noEmit`、目标文件 `pnpm exec eslint`、`git diff --check` 通过。

## 2026-08-27 22:44 +08 - 调整 UX 页面区域计数位置

- Request: 将 UX 用户体验设计模块中页面低保真结构区块的区域计数 badge 移动至小标题右侧。
- Actions: 更新 `src/components/ux-design/UXDesignContentViewer.tsx`，把每个页面卡片的区域计数 `StatusBadge` 从标题行右侧移入页面小标题旁的水平标题组。
- Result: “X 区域” badge 贴近对应页面小标题展示，不再独立靠右对齐。
- Verification: `pnpm exec eslint src/components/ux-design/UXDesignContentViewer.tsx` 和 `pnpm exec tsc --noEmit` 通过。

## 2026-08-27 22:49 +08 - 为 UX 信息优先级 Badge 增加序号

- Request: 为页面低保真结构区块中信息优先级的多个 badge 文本左侧增加数字小圆圈。
- Actions: 更新 `src/components/design-assets/visual-dashboard.tsx`，为共享 `TextChips` 增加可选 `numbered` 渲染能力；更新 `src/components/ux-design/UXDesignContentViewer.tsx`，仅在信息优先级 chip 组启用编号。
- Result: 信息优先级 badge 左侧显示从 1 开始的圆形序号，其他 chip 组默认样式保持不变。
- Verification: `pnpm exec eslint src/components/design-assets/visual-dashboard.tsx src/components/ux-design/UXDesignContentViewer.tsx` 和 `pnpm exec tsc --noEmit` 通过。

## 2026-08-27 23:15 +08 - 建立前端核心阅读最小字号

- Request: 按前端最小字号治理方案，确保正文与核心界面信息不小于 14px。
- Actions: 更新 `src/components/ui/badge.tsx` 将通用 Badge 默认字号提升为 `text-sm`；更新方案资产可视化组件和 UX/UI/前端工程/API/后端工程/数据库模型查看器，把字段标签、说明、元信息和差异摘要等核心阅读文本从 `text-xs` 提升到 `text-sm`；保留 tooltip、代码、JSON、路径、schema 字段和装饰序号的小字号。
- Result: 六类方案资产详情与共享 Badge 的核心阅读文字遵循 `text-sm` 最小字号基线，UX 页面低保真结构的“信息优先级”标签不再过小。
- Verification: 目标文件 `pnpm exec eslint`、`pnpm exec tsc --noEmit` 和 `git diff --check` 通过；剩余 `text-xs` 经搜索确认集中在保留范围。
