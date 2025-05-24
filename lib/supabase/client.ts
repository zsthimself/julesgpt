import { createClient } from '@supabase/supabase-js';

// 创建客户端版本的Supabase客户端
// 这个版本在浏览器中运行，使用localStorage存储会话
// 不依赖Node.js特有的API

let supabaseClient: ReturnType<typeof createClient> | null = null;

export const getSupabaseClient = () => {
  // 如果已经创建了客户端，直接返回
  if (supabaseClient) {
    return supabaseClient;
  }

  // 检查环境变量是否存在
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    console.error('Supabase环境变量未配置');
    throw new Error('Supabase环境变量未配置');
  }

  // 创建新的客户端
  supabaseClient = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      auth: {
        // 持久化会话到localStorage
        persistSession: true,
        // Clerk集成：不使用Supabase自带的认证UI
        autoRefreshToken: false,
        detectSessionInUrl: false
      }
    }
  );

  return supabaseClient;
};

// 用于客户端组件的自定义钩子
export function useSupabase() {
  return getSupabaseClient();
} 