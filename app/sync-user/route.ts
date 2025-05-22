import { NextResponse } from 'next/server';
import { syncUserToSupabase } from '@/lib/sync-user';
import { auth } from '@clerk/nextjs/server';

export async function GET(request: Request) {
  // 检查用户是否已登录
  const session = await auth();
  const userId = session.userId;
  
  if (!userId) {
    return NextResponse.json(
      { success: false, message: '用户未登录' },
      { status: 401 }
    );
  }
  
  // 同步用户数据
  const result = await syncUserToSupabase();
  
  if (!result.success) {
    return NextResponse.json(
      { success: false, message: result.message || '同步失败', error: result.error },
      { status: 500 }
    );
  }
  
  return NextResponse.json(
    { success: true, message: '用户数据已同步到Supabase' }
  );
} 