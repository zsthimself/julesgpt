import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { createClient } from '@/lib/supabase/server';

// 添加Edge Runtime配置
export const runtime = 'edge';

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
    
    // 使用已经配置好的服务器端Supabase客户端
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
    
    return NextResponse.json({ success: true });
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