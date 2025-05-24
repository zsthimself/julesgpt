"use client";

import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { getSupabaseClient } from '@/lib/supabase/client';

// 保持同步功能启用
const SYNC_ENABLED = true;

export default function UserDataSync() {
  const { isSignedIn, isLoaded, user } = useUser();
  const [syncAttempts, setSyncAttempts] = useState(0);
  const [environment, setEnvironment] = useState<string | null>(null);
  
  useEffect(() => {
    if (!SYNC_ENABLED) return; // 如果禁用则跳过
    
    // Sync user data when user is loaded and signed in
    if (isLoaded && isSignedIn && user) {
      syncUserData(user.id);
    }
  }, [isLoaded, isSignedIn, user, syncAttempts]);
  
  // Retry sync after delay
  const retrySyncAfterDelay = (delayMs = 5000) => {
    console.log(`Will retry user sync in ${delayMs/1000} seconds...`);
    setTimeout(() => {
      setSyncAttempts(prev => prev + 1);
    }, delayMs);
  };
  
  // Sync user data to Supabase (客户端实现)
  const syncUserData = async (userId: string) => {
    try {
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
        if (error.message?.includes('table') || 
            error.message?.includes('UUID') || 
            error.message?.includes('permission')) {
          retrySyncAfterDelay(10000); // Longer delay for infrastructure issues
        } else {
          retrySyncAfterDelay();
        }
        return;
      }
      
      console.log('用户数据同步成功');
      setEnvironment('client');
      
    } catch (error: any) {
      console.error('同步请求过程中出错:', error);
      retrySyncAfterDelay();
    }
  };
  
  // This component doesn't render any content
  return null;
} 