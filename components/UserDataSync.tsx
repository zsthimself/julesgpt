"use client";

import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { getSupabaseClient } from '@/lib/supabase/client';

export default function UserDataSync() {
  const { isSignedIn, isLoaded, user } = useUser();
  const [syncAttempts, setSyncAttempts] = useState(0);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'success' | 'error'>('idle');
  const [lastSynced, setLastSynced] = useState<Date | null>(null);
  
  useEffect(() => {
    // 只有当用户已加载且已登录时才同步
    if (isLoaded && isSignedIn && user) {
      syncUserData(user.id);
    }
  }, [isLoaded, isSignedIn, user, syncAttempts]);
  
  // 延迟重试同步
  const retrySyncAfterDelay = (delayMs = 5000) => {
    console.log(`将在 ${delayMs/1000} 秒后重试用户同步...`);
    setTimeout(() => {
      setSyncAttempts(prev => prev + 1);
    }, delayMs);
  };
  
  // 同步用户数据到Supabase (客户端实现)
  const syncUserData = async (userId: string) => {
    try {
      // 防止重复同步
      if (syncStatus === 'syncing') return;
      
      setSyncStatus('syncing');
      console.log('同步用户数据到Supabase(客户端方式)...');
      
      // 使用客户端Supabase集成
      const supabase = getSupabaseClient();
      
      // 直接同步用户数据到Supabase
      const { error } = await supabase
        .from('users')
        .upsert({ 
          id: userId,
          last_seen: new Date().toISOString() 
        }, { 
          onConflict: 'id'
        });
      
      if (error) {
        console.error('用户数据同步失败:', error.message);
        setSyncStatus('error');
        
        // 根据错误类型调整重试延迟
        if (error.message?.includes('table') || 
            error.message?.includes('UUID') || 
            error.message?.includes('permission')) {
          retrySyncAfterDelay(10000); // 基础设施问题延长重试时间
        } else {
          retrySyncAfterDelay();
        }
        return;
      }
      
      console.log('用户数据同步成功');
      setSyncStatus('success');
      setLastSynced(new Date());
      
    } catch (error: any) {
      console.error('同步请求过程中出错:', error);
      setSyncStatus('error');
      retrySyncAfterDelay();
    }
  };
  
  // 此组件不渲染任何内容
  return null;
} 