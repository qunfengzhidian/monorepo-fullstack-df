import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, FormField, Card, CardContent, CardHeader, CardTitle, CardDescription } from '@repo/ui'
import { supabase } from '../lib/supabase'

export default function LoginPage() {
  const navigate = useNavigate()
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
        navigate('/dashboard')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Admin 登录</CardTitle>
          <CardDescription>管理员后台</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <FormField id="email" label="邮箱" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
            <FormField id="password" label="密码" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button type="submit" disabled={loading}>{loading ? '登录中...' : '登录'}</Button>
          </form>
        </CardContent>
      </Card>
    </main>
  )
}
