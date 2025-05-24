import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { cache } from 'react'
import 'server-only'

export const dynamic = 'force-dynamic'

// 检测是否在Cloudflare Pages环境中运行
const isCloudflarePages = process.env.CF_PAGES === 'true' || 
                          typeof process.env.NEXT_RUNTIME === 'string' && 
                          process.env.NEXT_RUNTIME === 'edge';

// 创建一个极简版的服务端客户端，不使用cookies
// 这将避免在Edge环境中引入async_hooks依赖
export const createClient = cache(async () => {
  // 在Cloudflare环境中提供一个极简实现
  if (isCloudflarePages) {
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
  }
  
  // 在Node.js环境中，可以使用正常的实现
  // 但我们这里也使用简化版本以保持一致性
  // 推荐使用客户端集成而不是服务器端
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      // 提供一个简化的cookies实现
      cookies: {
        get: () => null,
        set: () => {},
        remove: () => {}
      }
    }
  );
}); 