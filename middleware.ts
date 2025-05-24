import { NextResponse, type NextRequest } from 'next/server';

// Cloudflare Pages要求中间件使用Edge Runtime
export const runtime = 'edge';

// 检测是否在Cloudflare Pages环境中运行
const isCloudflarePages = process.env.CF_PAGES === 'true' || 
                          typeof process.env.NEXT_RUNTIME === 'string' && 
                          process.env.NEXT_RUNTIME === 'edge';

export async function middleware(request: NextRequest) {
  // 创建基本的响应对象
  const response = NextResponse.next();
  
  // 在Cloudflare Pages环境中不执行复杂操作
  if (isCloudflarePages) {
    // 只做最基本的处理，避免使用可能导致async_hooks依赖的功能
    return response;
  }
  
  // 在非Cloudflare环境中，可以添加更多中间件功能
  // 但要注意避免添加会引入async_hooks依赖的功能
  
  return response;
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