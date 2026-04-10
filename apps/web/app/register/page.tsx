'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button, FormField, Card, CardContent, CardHeader, CardTitle, CardDescription } from '@repo/ui'
import { createClient } from '../../lib/supabase/client'

export default function RegisterPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const supabase = createClient()
      const { error } = await supabase.auth.signUp({ email, password })
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
          <CardTitle>注册</CardTitle>
          <CardDescription>创建新账号</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <FormField id="email" label="邮箱" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
            <FormField id="password" label="密码" type="password" value={password} onChange={e => setPassword(e.target.value)} required minLength={6} />
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button type="submit" disabled={loading}>{loading ? '注册中...' : '注册'}</Button>
            <p className="text-center text-sm text-muted-foreground">
              已有账号？<Link href="/login" className="text-primary underline-offset-4 hover:underline">登录</Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </main>
  )
}
