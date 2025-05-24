// 添加Edge Runtime配置
export const runtime = 'edge';

import type { NextApiRequest, NextApiResponse } from 'next';
import { createContent } from '@/lib/gemini-api';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ status: 'error', message: '仅支持POST请求' });
  }

  try {
    const { 
      topic, 
      audience, 
      contentType, 
      tone, 
      wordCount, 
      specialRequirements = '',
      usePro = true 
    } = req.body;

    // 验证必填字段
    if (!topic || !audience || !contentType || !tone || !wordCount) {
      return res.status(400).json({ 
        status: 'error', 
        message: '请提供所有必填字段（主题、目标受众、内容类型、语调和字数）' 
      });
    }

    // 调用Gemini API进行内容创作
    const resultText = await createContent(
      topic, 
      audience, 
      contentType, 
      tone, 
      wordCount, 
      specialRequirements,
      usePro
    );

    return res.status(200).json({ 
      status: 'success', 
      resultText
    });
  } catch (error) {
    console.error('内容创作API错误:', error);
    return res.status(500).json({ 
      status: 'error', 
      message: error instanceof Error ? error.message : '处理请求时发生错误'
    });
  }
} 