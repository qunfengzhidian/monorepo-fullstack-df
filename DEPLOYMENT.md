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

在 GitHub 仓库 → **Settings → Secrets and variables → Actions → New repository secret** 添加以下 secrets：

### Supabase（必须）

| Secret 名称 | 说明 | 获取方式 |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase 项目 URL | Supabase Dashboard → Project Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key | Supabase Dashboard → Project Settings → API |

### Vercel（部署 web 用）

| Secret 名称 | 说明 | 获取方式 |
|---|---|---|
| `VERCEL_TOKEN` | Vercel 访问令牌 | Vercel → Settings → Tokens → Create |
| `VERCEL_ORG_ID` | Vercel 组织 ID | Vercel 项目 → Settings → 底部 |
| `VERCEL_PROJECT_ID_WEB` | Vercel 项目 ID | Vercel 项目 → Settings → 底部 |

### Cloudflare（部署 admin 用）

| Secret 名称 | 说明 | 获取方式 |
|---|---|---|
| `CF_API_TOKEN` | Cloudflare API Token | Cloudflare → My Profile → API Tokens → Create Token（选 Edit Cloudflare Pages 模板）|
| `CF_ACCOUNT_ID` | Cloudflare 账号 ID | Cloudflare Dashboard 右侧边栏 |

---

## 三、Vercel 配置（web 应用）

1. 登录 [vercel.com](https://vercel.com) → Add New Project → 导入 GitHub 仓库
2. 配置项目：
   - **Framework Preset**: Next.js
   - **Root Directory**: `apps/web`
3. 添加环境变量：
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. 点击 Deploy，部署完成后从项目 Settings 获取 `VERCEL_ORG_ID` 和 `VERCEL_PROJECT_ID_WEB` 填入 GitHub Secrets

---

## 四、Cloudflare Pages 配置（admin 应用）

1. 登录 [dash.cloudflare.com](https://dash.cloudflare.com) → Pages → Create a project → Connect to Git
2. 选择 GitHub 仓库，配置构建：
   - **Build command**: `pnpm turbo build --filter=admin`
   - **Build output directory**: `apps/admin/dist`
   - **Root directory**: `/`（保持根目录）
3. 添加环境变量：
   - `VITE_SUPABASE_URL` = 你的 Supabase URL
   - `VITE_SUPABASE_ANON_KEY` = 你的 Supabase anon key
4. 部署完成后从 Cloudflare Dashboard 获取 `CF_ACCOUNT_ID` 和创建 `CF_API_TOKEN` 填入 GitHub Secrets

---

## 五、CI/CD 触发规则

| 触发条件 | 执行内容 |
|---|---|
| PR 到 `main` 或 `develop` | CI：lint + typecheck + build |
| Push 到 `main` | 部署 web → Vercel，部署 admin → Cloudflare Pages |

工作流文件位于 `.github/workflows/`：
- `ci.yml` — 持续集成
- `deploy.yml` — 持续部署

---

## 六、本地开发

```bash
# 安装依赖
pnpm install

# 启动所有应用
pnpm dev

# web:   http://localhost:3000
# admin: http://localhost:3001
```

环境变量配置（复制并填入真实值）：

```bash
# apps/web/.env.local
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# apps/admin/.env.local
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```
