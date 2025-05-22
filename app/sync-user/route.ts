import { NextResponse } from 'next/server';
import { syncUserToSupabase } from '@/lib/sync-user';
import { auth } from '@clerk/nextjs/server';

export async function GET(request: Request) {
  try {
    // 检查用户是否已登录
    const session = await auth();
    const userId = session.userId;
    
    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'User not logged in' },
        { status: 401 }
      );
    }
    
    // 同步用户数据
    const result = await syncUserToSupabase();
    
    if (!result.success) {
      console.error('User sync failed:', result.message, result.error);
      return NextResponse.json(
        { success: false, message: result.message || 'Sync failed', error: result.error },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { success: true, message: 'User data synced to Supabase' }
    );
  } catch (error) {
    console.error('Unexpected error in sync-user route:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error', error: String(error) },
      { status: 500 }
    );
  }
} 