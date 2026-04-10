import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, FormField, Card, CardContent, CardHeader, CardTitle, CardDescription } from '@repo/ui'

const DEFAULT_EMAIL = 'admin@example.com'
const DEFAULT_PASSWORD = 'admin123'

export default function LoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState(DEFAULT_EMAIL)
  const [password, setPassword] = useState(DEFAULT_PASSWORD)
  const [error, setError] = useState<string | null>(null)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (email === DEFAULT_EMAIL && password === DEFAULT_PASSWORD) {
      navigate('/dashboard')
    } else {
      setError('邮箱或密码错误')
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
            <Button type="submit">登录</Button>
          </form>
        </CardContent>
      </Card>
    </main>
  )
}
