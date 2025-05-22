import { NextResponse, type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// 定义公共路由
const isPublicRoute = createRouteMatcher([
  '/',
  '/pricing',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/api(.*)'
]);

// 使用单独的中间件函数
export async function middleware(request: NextRequest) {
  // 创建基础响应
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  try {
    // 检查是否是公共路由
    if (!isPublicRoute(request)) {
      // 使用Clerk的中间件处理认证
      const authMiddleware = clerkMiddleware();
      response = await authMiddleware(request);
      
      // 如果返回非200状态码（比如重定向到登录页面），直接返回
      if (response.status !== 200) {
        return response;
      }
    }
    
    // 更新Supabase会话
    return await updateSession(request);
  } catch (error) {
    console.error('中间件错误:', error);
    return response;
  }
}

export const config = {
  matcher: [
    /*
     * 匹配所有请求路径，除了以下开头的路径：
     * - _next/static (静态文件)
     * - _next/image (图像优化文件)
     * - favicon.ico (网站图标文件)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
} 