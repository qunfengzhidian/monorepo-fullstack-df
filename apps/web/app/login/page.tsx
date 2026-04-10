'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button, FormField, Card, CardContent, CardHeader, CardTitle, CardDescription } from '@repo/ui'
import { createClient } from '../../lib/supabase/client'

const supabase = createClient()

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('test@example.com')
  const [password, setPassword] = useState('Test123456')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) {
        setError(error.message)
      } else {
        router.push('/dashboard')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>登录</CardTitle>
          <CardDescription>输入邮箱和密码登录</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <FormField id="email" label="邮箱" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
            <FormField id="password" label="密码" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button type="submit" disabled={loading}>{loading ? '登录中...' : '登录'}</Button>
            <p className="text-center text-sm text-muted-foreground">
              没有账号？<Link href="/register" className="text-primary underline-offset-4 hover:underline">注册</Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </main>
  )
}
