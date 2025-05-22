'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

// 动态导入Stagewise工具栏
const StagewiseToolbar = dynamic(
  () => import('@stagewise/toolbar-next').then(mod => mod.StagewiseToolbar),
  { ssr: false }
);

// 工具栏配置
const stagewiseConfig = {
  plugins: [],
  connection: {
    reconnect: {
      maxAttempts: 20, // 增加最大重连尝试次数
      delay: 2000,     // 每次重连之间的延迟（毫秒）
      jitter: true     // 随机抖动以避免同时重连
    }
  }
};

export default function StagewiseProvider() {
  const [isDev, setIsDev] = useState(false);
  const [isEnabled, setIsEnabled] = useState(true);

  useEffect(() => {
    // 在客户端检查是否为开发环境
    setIsDev(process.env.NODE_ENV === 'development');
    
    // 添加错误处理
    const handleError = (event: ErrorEvent) => {
      // 安全地检查错误消息
      const errorMessage = event.error?.message || '';
      if (errorMessage.includes('Max reconnection attempts reached')) {
        console.warn('Stagewise重连失败 - 暂时禁用此功能');
        setIsEnabled(false);
        
        // 延迟后重新尝试启用
        setTimeout(() => setIsEnabled(true), 30000);
      }
    };
    
    // 添加全局错误监听器
    window.addEventListener('error', handleError as EventListener);
    
    return () => {
      window.removeEventListener('error', handleError as EventListener);
    };
  }, []);

  if (!isDev || !isEnabled) return null;
  
  return <StagewiseToolbar config={stagewiseConfig} />;
} 