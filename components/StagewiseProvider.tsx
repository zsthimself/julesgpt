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
  plugins: []
};

export default function StagewiseProvider() {
  const [isDev, setIsDev] = useState(false);

  useEffect(() => {
    // 在客户端检查是否为开发环境
    setIsDev(process.env.NODE_ENV === 'development');
  }, []);

  if (!isDev) return null;
  
  return <StagewiseToolbar config={stagewiseConfig} />;
} 