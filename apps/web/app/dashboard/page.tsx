import { redirect } from 'next/navigation'
import { createClient } from '../../lib/supabase/server'
import { Button } from '@repo/ui'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  async function signOut() {
    'use server'
    const supabase = await createClient()
    await supabase.auth.signOut()
    redirect('/login')
  }

  return (
    <main className="flex min-h-screen flex-col gap-6 p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <form action={signOut}>
          <Button variant="outline" type="submit">退出登录</Button>
        </form>
      </div>
      <p className="text-muted-foreground">欢迎，{user.email}</p>
    </main>
  )
}
