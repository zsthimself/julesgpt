import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// 指定使用Experimental Edge Runtime
export const runtime = 'experimental-edge';

export async function middleware(request: NextRequest) {
  // 简化的中间件逻辑，不再调用updateSession
  const response = NextResponse.next();
  return response;
}

// 使用简单的matcher配置，避免使用捕获组
export const config = {
  matcher: [
    '/',
    '/:path*',
  ],
}; 