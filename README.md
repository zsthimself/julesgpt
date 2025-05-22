This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## API 集成

本项目集成了Google Gemini API，提供以下功能：

- AI内容检测：检测文本是否由AI生成
- 查重检查：检查文本的原创性
- AI文本人性化：让AI生成的文本更像人类撰写
- 语法检查：检查和修正文本中的语法错误
- 翻译：在不同语言之间翻译文本
- 文本摘要：生成长文本的简洁摘要
- 内容创作：根据要求生成原创内容

### 环境配置

1. 从 [Google AI Studio](https://ai.google.dev/) 获取Gemini API密钥
2. 在项目根目录创建`.env.local`文件，并添加以下内容：

```
GEMINI_API_KEY=your_gemini_api_key_here
```

3. 安装依赖：

```bash
npm install
```

4. 启动开发服务器：

```bash
npm run dev
```

### 使用API

每个工具都通过Next.js API路由实现，可以通过以下方式调用：

- AI检测: `/api/detect`
- 查重检查: `/api/plagiarism`
- AI文本人性化: `/api/humanize`
- 批量分析: `/api/batch-analyze`
- 语法检查: `/api/grammar`
- 翻译: `/api/translate`
- 文本摘要: `/api/summarize`
- 内容创作: `/api/content-writer`
