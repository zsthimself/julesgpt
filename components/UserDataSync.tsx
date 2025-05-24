"use client";

import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';

// 保持同步功能启用
const SYNC_ENABLED = true;

export default function UserDataSync() {
  const { isSignedIn, isLoaded } = useUser();
  const [syncAttempts, setSyncAttempts] = useState(0);
  const [environment, setEnvironment] = useState<string | null>(null);
  
  useEffect(() => {
    if (!SYNC_ENABLED) return; // 如果禁用则跳过
    
    // Sync user data when user is loaded and signed in
    if (isLoaded && isSignedIn) {
      syncUserData();
    }
  }, [isLoaded, isSignedIn, syncAttempts]);
  
  // Retry sync after delay
  const retrySyncAfterDelay = (delayMs = 5000) => {
    console.log(`Will retry user sync in ${delayMs/1000} seconds...`);
    setTimeout(() => {
      setSyncAttempts(prev => prev + 1);
    }, delayMs);
  };
  
  // Sync user data to Supabase
  const syncUserData = async () => {
    try {
      console.log('同步用户数据到Supabase...');
      
      const response = await fetch('/sync-user', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      // Check if response is successful
      if (!response.ok) {
        console.error('同步用户数据失败:', response.statusText);
        
        // Don't retry on 401 (not authenticated) or 403 (forbidden)
        if (response.status !== 401 && response.status !== 403) {
          retrySyncAfterDelay();
        }
        return;
      }
      
      // Check response content type
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        console.error('同步用户数据失败: 服务器未返回JSON');
        retrySyncAfterDelay();
        return;
      }
      
      // Safely parse JSON
      const text = await response.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch (e) {
        console.error('解析服务器响应失败:', e);
        console.error('原始响应内容:', text);
        retrySyncAfterDelay();
        return;
      }
      
      if (!data.success) {
        console.error('用户数据同步失败:', data.message || '未知错误');
        if (data.error) {
          console.error('错误详情:', data.error);
        }
        
        // Retry for certain types of errors
        if (data.message?.includes('table') || 
            data.message?.includes('UUID') || 
            data.message?.includes('permission')) {
          retrySyncAfterDelay(10000); // Longer delay for infrastructure issues
        }
      } else {
        console.log('用户数据同步成功');
        
        // 保存环境信息，可以根据需要显示给用户
        if (data.environment) {
          setEnvironment(data.environment);
          console.log(`运行环境: ${data.environment}`);
          
          // 如果在edge环境中运行，显示相关消息
          if (data.environment === 'edge' && data.message) {
            console.log(`消息: ${data.message}`);
          }
        }
      }
    } catch (error) {
      console.error('同步请求过程中出错:', error);
      retrySyncAfterDelay();
    }
  };
  
  // This component doesn't render any content
  return null;
} 