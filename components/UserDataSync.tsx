"use client";

import { useEffect } from 'react';
import { useUser } from '@clerk/nextjs';

export default function UserDataSync() {
  const { isSignedIn, isLoaded } = useUser();
  
  useEffect(() => {
    // 当用户登录状态加载完成并且已登录时，触发数据同步
    if (isLoaded && isSignedIn) {
      syncUserData();
    }
  }, [isLoaded, isSignedIn]);
  
  // 同步用户数据到Supabase
  const syncUserData = async () => {
    try {
      const response = await fetch('/sync-user', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      const data = await response.json();
      
      if (!data.success) {
        console.error('同步用户数据失败:', data.message);
      } else {
        console.log('用户数据同步成功');
      }
    } catch (error) {
      console.error('同步请求出错:', error);
    }
  };
  
  // 这个组件不会渲染任何内容
  return null;
} 