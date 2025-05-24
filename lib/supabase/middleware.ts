import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

// 移除runtime声明，让Next.js自动选择合适的运行时
// export const runtime = 'edge';

// 此函数在Cloudflare Pages环境中会导致依赖async_hooks模块
// 我们已在主middleware中不再调用它，保留此函数仅作参考
export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  // 检查Supabase环境变量是否配置
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // 如果没有配置Supabase环境变量，直接返回响应
  if (!supabaseUrl || !supabaseAnonKey || 
      supabaseUrl === 'your_supabase_url_here' || 
      supabaseAnonKey === 'your_supabase_anon_key_here') {
    console.warn('Supabase环境变量未配置，跳过会话更新');
    return response;
  }

  // 注意：下面的代码在Cloudflare Pages环境中可能会导致错误
  // 因为它依赖于Node.js的async_hooks模块
  
  try {
    // 仅模拟会话检查，不实际执行Supabase操作
    console.log('会话检查被跳过，避免Edge Runtime兼容性问题');
  } catch (error) {
    console.error('Supabase会话更新失败:', error);
  }

  return response
} 