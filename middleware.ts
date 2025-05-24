import { NextResponse, type NextRequest } from 'next/server'

// 我们不需要显式设置runtime，让Next.js自动选择合适的运行时
// Cloudflare Pages环境下不支持async_hooks模块

export async function middleware(request: NextRequest) {
  // 不使用任何可能依赖Node.js特有模块的操作
  // 特别是避免使用createClient或updateSession等操作
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