import { createClient } from '@supabase/supabase-js';
import { currentUser } from '@clerk/nextjs/server';

// 此函数用于在登录后手动将Clerk用户数据同步到Supabase
export async function syncUserToSupabase() {
  // 获取当前Clerk用户
  const user = await currentUser();
  
  if (!user) {
    console.error('未找到当前登录用户');
    return { success: false, message: '未找到当前登录用户' };
  }

  // 检查Supabase环境变量
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey || 
      supabaseUrl === 'your_supabase_url_here' || 
      supabaseAnonKey === 'your_supabase_anon_key_here') {
    console.warn('Supabase环境变量未配置，跳过用户同步');
    return { success: false, message: 'Supabase环境变量未配置' };
  }

  // 创建Supabase客户端
  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  // 准备用户数据
  const userData = {
    clerk_id: user.id,
    email: user.emailAddresses[0]?.emailAddress,
    username: user.username,
    first_name: user.firstName,
    last_name: user.lastName,
    avatar_url: user.imageUrl,
    updated_at: new Date().toISOString(),
  };

  try {
    // 将用户数据保存到Supabase
    const { error } = await supabase
      .from('users')
      .upsert(userData, { onConflict: 'clerk_id' });

    if (error) {
      console.error('同步用户数据到Supabase失败:', error);
      return { success: false, error: error.message };
    }

    return { success: true, message: '用户数据已同步到Supabase' };
  } catch (error) {
    console.error('同步用户数据时发生错误:', error);
    return { success: false, error: String(error) };
  }
} 