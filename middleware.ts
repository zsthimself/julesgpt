// middleware.js or middleware.ts
export function middleware() { // Removed 'const' and arrow for standard export
  // 返回一个空的 HTTP 响应，用于测试
  return new Response(null, {
    headers: { 'x-middleware-processed': 'minimal-test-1' } // Changed header slightly for clarity
  });
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
  runtime: 'experimental-edge', // 确保这个配置存在
};