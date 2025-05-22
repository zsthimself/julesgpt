import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { cache } from 'react'
import 'server-only'

export const dynamic = 'force-dynamic'

export const createClient = cache(async () => {
  const cookieStore = cookies()
  
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name) {
          return cookieStore.get(name)?.value
        },
        set(name, value, options) {
          try {
            cookieStore.set({ name, value, ...options })
          } catch (error) {
            // 在边缘运行时中或Server Component中，cookies.set可能会抛出错误
            // 这可以被忽略，因为中间件会刷新用户会话
            console.error('Cookie set error (can be ignored in Server Components):', error)
          }
        },
        remove(name, options) {
          try {
            cookieStore.set({ name, value: '', ...options })
          } catch (error) {
            // 在边缘运行时中或Server Component中，cookies.remove可能会抛出错误
            // 这可以被忽略，因为中间件会刷新用户会话
            console.error('Cookie remove error (can be ignored in Server Components):', error)
          }
        },
      },
    }
  )
}) 