import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@repo/ui'
import { supabase } from '../lib/supabase'
import type { User } from '@supabase/supabase-js'

export default function DashboardPage() {
  const navigate = useNavigate()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    supabase.auth.getUser().then(({ data }) => {
      if (cancelled) return
      if (!data.user) navigate('/login')
      else setUser(data.user)
      setLoading(false)
    })
    return () => { cancelled = true }
  }, [navigate])

  if (loading) return <main className="flex min-h-screen items-center justify-center"><p className="text-muted-foreground">加载中...</p></main>
  if (!user) return null

  async function handleSignOut() {
    await supabase.auth.signOut()
    navigate('/login')
  }

  return (
    <main className="flex min-h-screen flex-col gap-6 p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <Button variant="outline" onClick={handleSignOut}>退出登录</Button>
      </div>
      <p className="text-muted-foreground">欢迎，{user.email}</p>
    </main>
  )
}
