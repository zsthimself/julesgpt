import { NextResponse, type NextRequest } from 'next/server'


export const runtime = 'experimental-edge';

// 在Cloudflare Pages部署时先移除runtime配置

export async function middleware(request: NextRequest) {
  // 简化中间件，不使用Supabase会话更新
  // 这样可以避免Edge Runtime中的兼容性问题
  return NextResponse.next();
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