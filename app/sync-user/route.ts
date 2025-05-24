import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';

// 指定使用Experimental Edge Runtime
export const runtime = 'experimental-edge';

// 检测是否在Cloudflare Pages环境中运行
const isCloudflarePages = process.env.CF_PAGES === 'true' || 
                          typeof process.env.NEXT_RUNTIME === 'string' && 
                          process.env.NEXT_RUNTIME === 'edge';

export async function GET(request: Request) {
  try {
    // 获取Clerk用户信息
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { success: false, message: '用户未认证' },
        { status: 401 }
      );
    }

    // 返回成功状态，但告知客户端它应该使用客户端同步
    return NextResponse.json({ 
      success: true,
      environment: 'edge',
      userId,
      message: '请使用客户端同步方法，服务器端同步在Edge环境中不可用'
    });
    
  } catch (error: any) {
    console.error('同步用户数据错误:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: '同步用户数据失败', 
        error: error.message 
      },
      { status: 500 }
    );
  }
} 