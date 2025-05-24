import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { cache } from 'react'
import 'server-only'

export const dynamic = 'force-dynamic'

export const createClient = cache(async () => {
  // 由于cookies()现在是异步函数，我们需要await它
  const cookieStore = await cookies()
  
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
            // 现在cookieStore已经是非Promise对象，可以直接调用
            cookieStore.set({ name, value, ...options })
          } catch (error) {
            // 在边缘运行时中或Server Component中，cookies.set可能会抛出错误
            // 这可以被忽略，因为我们在中间件中已不再调用updateSession
            console.error('Cookie set error (可在Edge环境中忽略):', error)
          }
        },
        remove(name, options) {
          try {
            // 现在cookieStore已经是非Promise对象，可以直接调用
            cookieStore.set({ name, value: '', ...options })
          } catch (error) {
            // 在边缘运行时中或Server Component中，cookies.remove可能会抛出错误
            // 这可以被忽略，因为我们在中间件中已不再调用updateSession
            console.error('Cookie remove error (可在Edge环境中忽略):', error)
          }
        },
      },
    }
  )
}) 