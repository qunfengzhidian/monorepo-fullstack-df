import { useNavigate } from 'react-router-dom'
import { Button } from '@repo/ui'

const techStack = [
  { name: 'Supabase', desc: '后端即服务 (BaaS)，提供数据库、认证、存储、实时订阅', icon: '🗄️' },
  { name: 'PostgreSQL', desc: '关系型数据库，Supabase 底层存储引擎', icon: '🐘' },
  { name: 'PostgREST', desc: '自动将 PostgreSQL 表暴露为 RESTful API', icon: '🔌' },
  { name: 'Node.js / Edge Functions', desc: 'Supabase Edge Functions 运行时，支持 Deno/Node 无服务器函数', icon: '⚡' },
  { name: 'Row Level Security (RLS)', desc: 'PostgreSQL 行级安全策略，数据访问权限控制', icon: '🔒' },
  { name: 'Vite + React 19', desc: '前端构建工具与 UI 框架', icon: '⚛️' },
  { name: 'Turborepo', desc: 'Monorepo 构建系统，管理多个应用与共享包', icon: '🏗️' },
  { name: 'TypeScript', desc: '全栈类型安全', icon: '📘' },
]

export default function DashboardPage() {
  const navigate = useNavigate()

  return (
    <main className="flex min-h-screen flex-col gap-6 p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <Button variant="outline" onClick={() => navigate('/login')}>退出登录</Button>
      </div>
      <p className="text-muted-foreground">欢迎，admin@example.com</p>

      <section>
        <h2 className="text-lg font-semibold mb-4">后端技术栈</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {techStack.map(item => (
            <div key={item.name} className="rounded-lg border bg-card p-4 flex flex-col gap-2 shadow-sm">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{item.icon}</span>
                <span className="font-semibold">{item.name}</span>
              </div>
              <p className="text-sm text-muted-foreground">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}
