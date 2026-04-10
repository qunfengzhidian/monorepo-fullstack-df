'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@repo/ui'
import { AUTH_COOKIE } from '../../lib/auth'

const techStack = [
  {
    name: 'Next.js 15',
    desc: 'React 全栈框架，支持 App Router、Server Components、Server Actions',
    color: 'bg-black text-white',
  },
  {
    name: 'React 19',
    desc: '最新版 React，支持并发特性、use() hook、Actions',
    color: 'bg-blue-500 text-white',
  },
  {
    name: 'TypeScript 5',
    desc: '静态类型系统，提升代码可维护性与开发体验',
    color: 'bg-blue-700 text-white',
  },
  {
    name: 'Tailwind CSS 4',
    desc: '原子化 CSS 框架，零配置、极速构建样式',
    color: 'bg-teal-500 text-white',
  },
  {
    name: 'Turborepo',
    desc: 'Monorepo 构建系统，智能缓存、并行任务执行',
    color: 'bg-red-500 text-white',
  },
  {
    name: 'pnpm Workspace',
    desc: '高效包管理器，支持 workspace 协议共享内部包',
    color: 'bg-orange-500 text-white',
  },
  {
    name: '@repo/ui',
    desc: '内部共享组件库，基于 Tailwind 构建，跨应用复用',
    color: 'bg-purple-500 text-white',
  },
  {
    name: '@repo/types',
    desc: '共享 TypeScript 类型定义，统一前后端数据契约',
    color: 'bg-indigo-500 text-white',
  },
]

export default function DashboardPage() {
  const router = useRouter()

  function handleSignOut() {
    document.cookie = `${AUTH_COOKIE}=; path=/; max-age=0`
    router.push('/login')
  }

  return (
    <main className="flex min-h-screen flex-col gap-8 p-8 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">前端技术栈</h1>
          <p className="text-muted-foreground mt-1">Fullstack Monorepo 项目所用技术一览</p>
        </div>
        <Button variant="outline" onClick={handleSignOut}>退出登录</Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {techStack.map((tech) => (
          <div key={tech.name} className="rounded-xl border p-5 flex flex-col gap-2 shadow-sm hover:shadow-md transition-shadow">
            <span className={`inline-block self-start text-xs font-semibold px-2 py-1 rounded-full ${tech.color}`}>
              {tech.name}
            </span>
            <p className="text-sm text-muted-foreground">{tech.desc}</p>
          </div>
        ))}
      </div>
    </main>
  )
}
