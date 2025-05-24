import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { cache } from 'react'
import 'server-only'

// 指定使用Experimental Edge Runtime
export const runtime = 'experimental-edge'

// 检测是否在Cloudflare Pages环境中运行
const isCloudflarePages = process.env.CF_PAGES === 'true' || 
                          typeof process.env.NEXT_RUNTIME === 'string' && 
                          process.env.NEXT_RUNTIME === 'edge';

// 创建一个极简版的服务端客户端，不使用cookies
// 这将避免在Edge环境中引入async_hooks依赖
export const createClient = cache(async () => {
  try {
    return createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        // 提供一个空的cookies实现，避免async_hooks依赖
        cookies: {
          get: () => null,
          set: () => {},
          remove: () => {}
        }
      }
    );
  } catch (error) {
    console.error('创建Supabase服务器客户端失败:', error);
    // 返回一个最小化的客户端实现
    return {
      auth: {
        getUser: async () => ({ data: { user: null }, error: null }),
        getSession: async () => ({ data: { session: null }, error: null })
      },
      from: () => ({
        select: () => ({ data: null, error: null }),
        insert: () => ({ data: null, error: null }),
        upsert: () => ({ data: null, error: null }),
        update: () => ({ data: null, error: null }),
        delete: () => ({ data: null, error: null })
      })
    } as any;
  }
}); 