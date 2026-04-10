import Link from 'next/link'
import { Button } from '@repo/ui'

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6">
      <h1 className="text-4xl font-bold">Welcome</h1>
      <div className="flex gap-4">
        <Button asChild>
          <Link href="/login">登录</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/register">注册</Link>
        </Button>
      </div>
    </main>
  )
}
