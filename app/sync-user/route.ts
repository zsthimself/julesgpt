import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { createClient } from '@/lib/supabase/server';

// 移除runtime声明，让Next.js自动选择合适的环境
// export const runtime = 'edge';

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

    // Cloudflare Pages环境中提供降级功能
    if (isCloudflarePages) {
      console.log('在Cloudflare Pages环境中运行，提供基本功能');
      // 返回成功但不执行数据库操作
      return NextResponse.json({ 
        success: true,
        environment: 'edge',
        message: '在Edge环境中数据同步功能有限'
      });
    }
    
    // 在Node.js环境中执行完整功能
    const supabase = await createClient();
    
    // 同步用户数据
    const { error } = await supabase
      .from('users')
      .upsert({ 
        id: userId,
        last_seen: new Date().toISOString() 
      }, { 
        onConflict: 'id'
      });
    
    if (error) throw error;
    
    return NextResponse.json({ 
      success: true,
      environment: 'node'
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