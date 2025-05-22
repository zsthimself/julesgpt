import type { NextApiRequest, NextApiResponse } from 'next';
import { detectAIContent } from '@/lib/gemini-api';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ status: 'error', message: '仅支持POST请求' });
  }

  try {
    const { files, usePro = false } = req.body;

    if (!files || !Array.isArray(files) || files.length === 0) {
      return res.status(400).json({ status: 'error', message: '请提供有效的文件内容' });
    }

    // 批量处理文件
    const results = await Promise.all(
      files.map(async (file) => {
        try {
          const result = await detectAIContent(file.content, usePro);
          return {
            fileName: file.name,
            result,
            error: null
          };
        } catch (error) {
          return {
            fileName: file.name,
            result: null,
            error: error instanceof Error ? error.message : '处理文件时发生错误'
          };
        }
      })
    );

    return res.status(200).json({ 
      status: 'success', 
      results
    });
  } catch (error) {
    console.error('批量分析API错误:', error);
    return res.status(500).json({ 
      status: 'error', 
      message: error instanceof Error ? error.message : '处理请求时发生错误'
    });
  }
} 