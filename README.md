## fullstack-forge-frontend

`fullstack-forge` 项目的前端工程，基于 `Next.js + React + TypeScript + Tailwind CSS 4 + shadcn/ui + pnpm` 构建，覆盖官网、登录页、后台控制台与业务系统场景。

## 技术栈

- Next.js 16（App Router）
- React 19
- TypeScript 5
- Tailwind CSS 4
- shadcn/ui 风格基础配置
- pnpm
- next-themes
- @tanstack/react-query
- Zustand
- Zod
- React Hook Form
- Sonner

## 启动项目

先准备环境变量：

```bash
cp .env.example .env.local
```

然后启动开发环境：

```bash
pnpm dev
```

打开 [http://localhost:3000](http://localhost:3000) 查看页面。

## 常用命令

```bash
pnpm dev
pnpm lint
pnpm build
pnpm start
```

## 目录结构

```text
src
├─ app
│  ├─ (marketing)       # 官网/落地页
│  ├─ (dashboard)       # 后台控制台
│  ├─ (auth)            # 登录等认证页面
│  ├─ api               # Next.js route handlers
│  ├─ error.tsx         # 全局错误边界
│  └─ not-found.tsx     # 404 页面
├─ components
│  ├─ dashboard         # 后台列表等组合组件
│  ├─ demo              # 可替换的示例组件
│  ├─ layout            # 布局类组件
│  ├─ theme             # 主题切换相关
│  └─ ui                # 可复用 UI 基础组件
├─ config               # 站点配置、导航配置
├─ features             # 按业务域组织模块
├─ lib
│  ├─ api               # 请求封装
│  ├─ auth              # session、鉴权工具
│  ├─ env.ts            # 环境变量解析与校验
│  └─ utils.ts          # 通用工具函数
├─ store                # Zustand 状态管理
└─ types                # 公共类型定义
```

## 已完成的基础能力

- TypeScript 与路径别名 `@/*`
- Tailwind CSS 4 主题变量
- `components.json` 与 shadcn/ui 兼容结构
- `Button` 基础组件与 `cn` 工具函数
- `Input`、`Card`、`Dialog`、`Sheet`、`Toast` 等通用 UI 组件
- `Table`、`Pagination`、`EmptyState`、`Skeleton` 等后台常用基础件
- 明暗主题切换
- React Query Provider
- 环境变量校验
- 统一请求函数 `apiRequest` 与 `ApiError` 错误约定
- Zustand 全局状态示例
- `features` 分层示例
- 官网与后台控制台双场景基础结构
- `loading.tsx`、`error.tsx`、`not-found.tsx` 页面边界
- 登录页、`middleware.ts`、session cookie 与受保护路由实现

## 下一步建议

- 接入真实鉴权、用户信息、权限控制与路由守卫
- 将 `dashboard` 示例页替换成具体业务模块
- 补充表格、筛选器、分页、空状态和 skeleton 组件
- 增加测试、CI、国际化、RBAC 与部署配置
- 增加测试、CI 和部署配置

## 参考文档

- [Next.js Documentation](https://nextjs.org/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
