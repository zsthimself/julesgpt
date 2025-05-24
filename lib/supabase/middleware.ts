import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export const runtime = 'edge';

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

  const supabase = createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        get(name) {
          return request.cookies.get(name)?.value
        },
        set(name, value, options) {
          // 设置到响应中，供浏览器使用
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name, options) {
          response.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )

  try {
    // 只读取会话信息，不进行复杂操作
    const { data } = await supabase.auth.getSession();
    // 不要尝试修改request.cookies，这可能导致Edge Runtime错误
  } catch (error) {
    console.error('Supabase会话更新失败:', error);
    // 出错时不影响请求继续进行
  }

  return response
} 