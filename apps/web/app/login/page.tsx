'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button, FormField, Card, CardContent, CardHeader, CardTitle, CardDescription } from '@repo/ui'
import { validateCredentials, AUTH_COOKIE, DEFAULT_CREDENTIALS } from '../../lib/auth'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState(DEFAULT_CREDENTIALS.email)
  const [password, setPassword] = useState(DEFAULT_CREDENTIALS.password)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    if (validateCredentials(email, password)) {
      document.cookie = `${AUTH_COOKIE}=1; path=/; max-age=86400`
      router.push('/dashboard')
    } else {
      setError('账号或密码错误，默认账号：admin@example.com / admin123')
      setLoading(false)
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>登录</CardTitle>
          <CardDescription>默认账号：{DEFAULT_CREDENTIALS.email}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <FormField
              id="email"
              label="邮箱"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
            <FormField
              id="password"
              label="密码"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button type="submit" disabled={loading}>
              {loading ? '登录中...' : '登录'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  )
}
