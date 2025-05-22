# Supabase 配置指南

## 环境变量配置

要在本地环境中配置Supabase，您需要在项目根目录创建一个`.env.local`文件，并添加以下环境变量：

```
# Supabase配置
NEXT_PUBLIC_SUPABASE_URL=你的Supabase项目URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=你的Supabase匿名密钥

# 数据库配置（如果需要直接连接数据库）
DATABASE_URL=postgres://postgres.[PROJECT_REF]:[YOUR_PASSWORD]@[CLOUD_PROVIDER]-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true
```

## 获取配置信息

1. 登录到您的Supabase项目仪表板
2. 在侧边栏中点击"项目设置"
3. 选择"API"选项卡
4. 在"项目URL"部分找到您的项目URL
5. 在"项目API密钥"部分找到"anon public"密钥
6. 如果需要数据库连接字符串，请前往"数据库"设置页面

## 已安装的依赖

我们已经为您安装了以下依赖：

- `@supabase/supabase-js`: Supabase JavaScript客户端
- `@supabase/ssr`: Supabase的服务器端渲染辅助工具

## 代码结构

- `lib/supabase/client.ts`: 用于客户端组件的Supabase客户端
- `lib/supabase/server.ts`: 用于服务器端组件的Supabase客户端
- `lib/supabase/middleware.ts`: 用于刷新会话的中间件函数
- `middleware.ts`: Next.js中间件配置

## 使用方法

### 在客户端组件中：

```tsx
'use client'

import { createClient } from '@/lib/supabase/client'

export default function ClientComponent() {
  const supabase = createClient()
  
  // 使用supabase进行操作
  // 例如：supabase.from('表名').select()
  
  return <div>客户端组件</div>
}
```

### 在服务器端组件中：

```tsx
import { createClient } from '@/lib/supabase/server'

export default async function ServerComponent() {
  const supabase = await createClient()
  
  // 使用supabase进行操作
  // 例如：const { data } = await supabase.from('表名').select()
  
  return <div>服务器端组件</div>
}
``` 