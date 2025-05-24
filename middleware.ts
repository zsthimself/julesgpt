import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// 指定使用Edge Runtime
export const runtime = 'edge';

export async function middleware(request: NextRequest) {
  // 简化的中间件逻辑，不再调用updateSession
  const response = NextResponse.next();
  return response;
}

// 可选：配置哪些路径需要应用中间件
export const config = {
  matcher: [
    /*
     * 匹配所有路径除了:
     * - api 路由
     * - _next (Next.js内部文件)
     * - .*\\.(.*)$ (带扩展名的文件，如静态文件)
     */
    '/((?!api|_next|.*\\.(.*)$).*)',
  ],
}; 