# 部署指南

本项目使用 GitHub Actions 实现 CI/CD，web 应用部署到 Vercel，admin 应用部署到 Cloudflare Pages。

---

## 一、上传到 GitHub

```bash
cd D:\workSpace\ai-native-frontend-bootcamp-main\monorepo-fullstack

git init
git add .
git commit -m "feat: init monorepo fullstack project"
```

去 [github.com/new](https://github.com/new) 创建新仓库，然后：

```bash
git remote add origin https://github.com/你的用户名/monorepo-fullstack.git
git branch -M main
git push -u origin main
```

---

## 二、配置 GitHub Secrets

**入口必须是「仓库」的设置，不是个人账号设置。**

![GitHub Actions Secrets 应在仓库 Settings 中配置](docs/deployment/images/github-secrets-location.svg)

在 **GitHub 打开你的仓库**（例如 `qunfengzhidian/monorepo-fullstack-df`）→ 顶部 **Settings** → 左侧 **Secrets and variables** → **Actions** → **New repository secret**。

**常见误区**：在右上角头像 → **Settings**（个人资料、Public profile）里**没有**「Actions 用的 Repository secrets」，那是账号级设置，与单个仓库的 CI/CD 密钥无关。

### Supabase（必须）

| Secret 名称 | 说明 | 获取方式 |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase 项目 URL | Supabase Dashboard → Project Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key | 见下文「如何识别 anon key」 |

### Vercel（部署 web 用）

| Secret 名称 | 说明 | 获取方式 |
|---|---|---|
| `VERCEL_TOKEN` | Vercel 访问令牌 | Vercel → Account Settings → Tokens → Create |
| `VERCEL_ORG_ID` | Vercel 组织 / Team ID | Vercel 项目 → Settings → General → 页面底部 |
| `VERCEL_PROJECT_ID_WEB` | Vercel 项目 ID | 同上 |

### Cloudflare（部署 admin 用，供 GitHub Actions 使用）

| Secret 名称 | 说明 | 获取方式 |
|---|---|---|
| `CF_API_TOKEN` | Cloudflare API Token | My Profile → API Tokens → Create（可用 **Edit Cloudflare Pages** 模板）|
| `CF_ACCOUNT_ID` | Cloudflare 账号 ID | Dashboard 右侧边栏或 Workers & Pages 概览 |

---

## 三、Supabase：如何找到 anon key

1. 打开 [Supabase Dashboard](https://supabase.com/dashboard) → 选中项目 → **Project Settings**（齿轮）。
2. 左侧 **Configuration** → **API Keys**（不是停留在 General）。
3. 在 **Legacy anon, service_role API keys** 标签页中：
   - **`anon` + `public`**：即 **anon key**，用于浏览器与 `NEXT_PUBLIC_*` / `VITE_*`。
   - **`service_role` + `secret`**：仅服务端使用，**不要**填入前端或公开仓库。

![anon 与 service_role 区别示意](docs/deployment/images/supabase-anon-vs-service-role.svg)

---

## 四、Vercel 配置（web 应用）

1. 登录 [vercel.com](https://vercel.com) → **Add New…** → **Project** → **Import** 你的 GitHub 仓库。
2. **Configure Project**：
   - **Framework Preset**：Next.js（通常会自动识别）。
   - **Root Directory**：点击 **Edit**，选 **`apps/web`**（monorepo 必设，否则会按仓库根目录构建）。
3. **Environment Variables**（生产环境必须配置，见下节「本地与线上环境变量」）：
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. **Deploy**。部署成功后：项目 **Settings → General** 页面底部可看到 **Project ID**、**Team / Org ID**，用于填入 GitHub Secrets 中的 `VERCEL_PROJECT_ID_WEB`、`VERCEL_ORG_ID`。
5. **Token**：个人头像 → **Account Settings** → **Tokens** → 创建并复制到 `VERCEL_TOKEN`。

### Vercel：Redeploy 与最新代码

- **Redeploy** 会说明：使用**与当前这次部署相同的 Git 提交**再构建一次（用于重试、清缓存等）。
- 若 GitHub 上 `main` 已有新提交，但界面仍显示旧 commit（例如只有 `feat: init...`），应先 **`git push origin main`**，在 **Deployments** 列表里确认**最新一条**已是新哈希，再部署；**不要**只对旧提交反复 Redeploy 却期望出现新代码。

### Vercel：项目名 / 仓库名冲突

若提示 *The specified name is already used for a different Git repository*，可更换 **Private repository name** 为未占用名称，或到 **Projects** 列表检查是否已存在同一仓库的项目，直接打开该项目在 **Settings** 里改 **Root Directory** 为 `apps/web` 后重新部署。

---

## 五、本地与线上环境变量（为何不能只靠 .env.local）

![本地 .env 与 Vercel / Cloudflare 需分别配置](docs/deployment/images/vercel-cloudflare-env-split.svg)

- **`apps/web/.env.local`**、**`apps/admin/.env`**（或 `.env.local`）通常在 **`.gitignore`** 中，**不会**推送到 GitHub。
- **Vercel / Cloudflare Pages** 构建时只 clone 仓库，**读不到你电脑里的** `.env` 文件。
- 因此：在 **Vercel 项目 → Settings → Environment Variables** 与 **Cloudflare Pages → Settings → Variables** 中**手动添加**与本地含义相同的变量（值可与本地一致，指向同一 Supabase 项目即可）。

**两套变量名不要混用：**

| 应用 | 平台 | 变量名前缀 |
|------|------|------------|
| `apps/web`（Next.js） | Vercel | `NEXT_PUBLIC_SUPABASE_URL`、`NEXT_PUBLIC_SUPABASE_ANON_KEY` |
| `apps/admin`（Vite） | Cloudflare Pages | `VITE_SUPABASE_URL`、`VITE_SUPABASE_ANON_KEY` |

---

## 六、Cloudflare Pages 配置（admin 应用）

![应使用 Pages 而非 Worker 创建向导](docs/deployment/images/cloudflare-pages-vs-workers.svg)

1. 打开 [Cloudflare Dashboard](https://dash.cloudflare.com) → 左侧 **Workers & Pages** → **Pages**（不要走 **Create a Worker** 那条线；若误入，可用页脚 **Looking to deploy Pages? Get started** 转到 Pages）。
2. **Create a project** → **Connect to Git** → 授权并选中 GitHub 上的 monorepo 仓库。
3. **Build configuration**（与 Vite + Turborepo 一致）：
   - **Root directory**：`/` 或留空（表示**仓库根目录**，不要改成 `apps/admin`，除非同时改构建命令）。
   - **Build command**：`pnpm turbo build --filter=admin`
   - **Build output directory**：**`apps/admin/dist`**（不要填 `/` 或仓库根目录；Vite 产物在 `apps/admin/dist`）。
   - **Framework preset**：可选 **None**。
4. **Environment variables**（展开 Advanced）：
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`  
   与 Next 的 `NEXT_PUBLIC_*` 不同，admin 源码使用 `import.meta.env.VITE_*`。
5. 保存并部署。若使用 GitHub Actions 部署 Pages，再按第二节配置 `CF_API_TOKEN`、`CF_ACCOUNT_ID`。

---

## 七、CI/CD 触发规则

| 触发条件 | 执行内容 |
|---|---|
| PR 到 `main` 或 `develop` | CI：lint + typecheck + build |
| Push 到 `main` | 部署 web → Vercel，部署 admin → Cloudflare Pages（以 `.github/workflows` 为准） |

工作流文件位于 `.github/workflows/`：

- `ci.yml` — 持续集成  
- `deploy.yml` — 持续部署  

---

## 八、本地开发

```bash
pnpm install
pnpm dev
```

- **web**：<http://localhost:3000>  
- **admin**：<http://localhost:3001>  

环境变量示例（复制为本地文件并填入真实值，**勿提交**）：

```bash
# apps/web/.env.local
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# apps/admin/.env 或 apps/admin/.env.local
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

---

## 九、常见问题与构建排错（对话中高频问题）

### 1）Vercel：`Parameter 'cookiesToSet' implicitly has an 'any' type`

- **原因**：`@supabase/ssr` 的 `cookies.setAll` 回调在严格 TypeScript 下需标注参数类型。  
- **处理**：已为 `setAll` 使用显式类型（见 `apps/web/lib/supabase/cookie-types.ts` 等），请拉取最新代码并重新部署。

### 2）Vercel：`Cannot find name 'Database'`（`packages/types`）

- **原因**：`export type { Database } from '...'` 不会在**同一文件**内产生 `Database` 标识符，后续 `Tables<...>` 等无法解析。  
- **处理**：在 `packages/types/src/index.ts` 中改为 `import type { Database, Json } from './database.types'` 再 `export type { Database, Json }`。

### 3）Vercel：`Your project's URL and API key are required`（预渲染 `/login` 等）

- **原因**：构建阶段执行了需要 Supabase 的代码，且**未在 Vercel 配置** `NEXT_PUBLIC_SUPABASE_*`；或旧代码在模块顶层 `createClient()`。  
- **处理**：在 Vercel 中配置上述环境变量；并已改为在提交表单时再 `createClient()`，必要时为 `/login`、`/register` 使用仅声明 `dynamic = 'force-dynamic'` 的 Server `layout.tsx`，避免无 env 时静态预渲染失败。

### 4）Vercel 日志 Commit 仍是旧哈希

- 本地已 `git push` 后，到 GitHub 仓库 **Commits** 确认 `main` 最新提交；在 Vercel **Deployments** 中应出现对应新部署。若仍只有旧 commit，检查是否推送到正确远程/分支，或对**最新部署**再操作。

### 5）Cloudflare Pages：`Property 'env' does not exist on type 'ImportMeta'`

- **原因**：`tsc` 检查 `import.meta.env` 时缺少 Vite 类型。  
- **处理**：在 `apps/admin/src/vite-env.d.ts` 中加入：

  ```ts
  /// <reference types="vite/client" />
  ```

  并已纳入 `src` 编译范围。

### 6）Cloudflare：构建命令成功但站点白屏或 Supabase 报错

- 检查 Pages **Environment Variables** 是否已配置 **`VITE_`** 前缀变量（不是仅配置 `NEXT_PUBLIC_*`）。



## 十一、相关链接

- [Supabase API Settings](https://supabase.com/dashboard/project/_/settings/api)  
- [Vercel Environment Variables](https://vercel.com/docs/projects/environment-variables)  
- [Cloudflare Pages Build Configuration](https://developers.cloudflare.com/pages/configuration/build-configuration/)  
- [Vite Env Variables](https://vite.dev/guide/env-and-mode.html)
