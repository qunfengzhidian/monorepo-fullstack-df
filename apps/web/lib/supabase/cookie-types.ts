/** Items passed to `cookies.setAll` in @supabase/ssr createServerClient */
export type SupabaseCookieToSet = {
  name: string
  value: string
  options?: {
    domain?: string
    path?: string
    maxAge?: number
    expires?: Date
    httpOnly?: boolean
    secure?: boolean
    sameSite?: 'strict' | 'lax' | 'none' | boolean
    priority?: 'low' | 'medium' | 'high'
    partitioned?: boolean
  }
}
