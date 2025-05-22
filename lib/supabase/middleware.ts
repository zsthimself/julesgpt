import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

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
          // 设置到请求中，供后续的中间件和服务器组件使用
          request.cookies.set({
            name,
            value,
            ...options,
          })
          // 设置到响应中，供浏览器使用
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name, options) {
          request.cookies.set({
            name,
            value: '',
            ...options,
          })
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
    // 刷新会话，确保令牌有效
    await supabase.auth.getUser()
  } catch (error) {
    console.error('Supabase会话更新失败:', error);
  }

  return response
} 