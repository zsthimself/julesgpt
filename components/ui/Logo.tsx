"use client";

import React from "react";

interface LogoProps {
  size?: number;
  className?: string;
}

export default function Logo({ size = 32, className = "" }: LogoProps) {
  return (
    <div className={`relative flex items-center ${className}`}>
      <svg 
        width={size} 
        height={size} 
        viewBox="0 0 100 100" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="flex-shrink-0"
      >
        {/* 大脑底部 */}
        <path 
          d="M50 90C72 90 85 75 85 55C85 35 72 15 50 15C28 15 15 35 15 55C15 75 28 90 50 90Z" 
          fill="#3B82F6" 
        />
        
        {/* 大脑纹理 */}
        <path 
          d="M26 40C32 32 38 38 45 32C52 26 56 32 65 28C74 24 78 35 75 45C72 55 78 60 72 68C66 76 58 72 50 76C42 80 32 76 28 68C24 60 20 48 26 40Z" 
          fill="#2563EB" 
        />
        
        {/* 眼镜框 */}
        <path 
          d="M30 45C30 40 35 40 40 40C45 40 50 40 50 45C50 50 45 50 40 50C35 50 30 50 30 45Z" 
          stroke="#FFFFFF" 
          strokeWidth="3" 
          fill="none"
        />
        <path 
          d="M50 45C50 40 55 40 60 40C65 40 70 40 70 45C70 50 65 50 60 50C55 50 50 50 50 45Z" 
          stroke="#FFFFFF" 
          strokeWidth="3" 
          fill="none"
        />
        
        {/* 眼镜腿 */}
        <path 
          d="M30 45L20 42" 
          stroke="#FFFFFF" 
          strokeWidth="3" 
          fill="none"
        />
        <path 
          d="M70 45L80 42" 
          stroke="#FFFFFF" 
          strokeWidth="3" 
          fill="none"
        />
        
        {/* 眼镜中间的连接部分 */}
        <path 
          d="M50 45L50 45" 
          stroke="#FFFFFF" 
          strokeWidth="3" 
          fill="none"
        />
        
        {/* 神经连接 - 表示智能 */}
        <circle cx="35" cy="68" r="2" fill="#FFFFFF" />
        <circle cx="45" cy="62" r="2" fill="#FFFFFF" />
        <circle cx="55" cy="68" r="2" fill="#FFFFFF" />
        <circle cx="65" cy="62" r="2" fill="#FFFFFF" />
        
        <line x1="35" y1="68" x2="45" y2="62" stroke="#FFFFFF" strokeWidth="1" />
        <line x1="45" y1="62" x2="55" y2="68" stroke="#FFFFFF" strokeWidth="1" />
        <line x1="55" y1="68" x2="65" y2="62" stroke="#FFFFFF" strokeWidth="1" />
      </svg>
    </div>
  );
} 