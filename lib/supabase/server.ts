import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { cache } from 'react'
import 'server-only'

export const dynamic = 'force-dynamic'

// 检测是否在Cloudflare Pages环境中运行
const isCloudflarePages = process.env.CF_PAGES === 'true' || 
                          typeof process.env.NEXT_RUNTIME === 'string' && 
                          process.env.NEXT_RUNTIME === 'edge';

// 创建适合Edge环境的简化客户端
const createEdgeClient = cache(async () => {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      // 提供一个简化的cookie处理器，避免使用async_hooks
      cookies: {
        get(name) {
          // Edge环境中简化的cookie获取
          return null;
        },
        set() {
          // 空实现
        },
        remove() {
          // 空实现
        }
      }
    }
  )
})

// 创建完整功能的Node.js客户端
const createNodeClient = cache(async () => {
  // 在Node.js环境中，cookies()函数是异步的
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
            cookieStore.set({ name, value, ...options })
          } catch (error) {
            console.error('Cookie set error:', error)
          }
        },
        remove(name, options) {
          try {
            cookieStore.set({ name, value: '', ...options })
          } catch (error) {
            console.error('Cookie remove error:', error)
          }
        }
      }
    }
  )
})

// 导出适合当前环境的客户端创建函数
export const createClient = isCloudflarePages ? createEdgeClient : createNodeClient; 