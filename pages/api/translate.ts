// 添加Edge Runtime配置
export const runtime = 'edge';

import type { NextApiRequest, NextApiResponse } from 'next';
import { translateText } from '@/lib/gemini-api';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ status: 'error', message: '仅支持POST请求' });
  }

  try {
    const { inputText, sourceLanguage, targetLanguage, usePro = false } = req.body;

    if (!inputText || typeof inputText !== 'string') {
      return res.status(400).json({ status: 'error', message: '请提供有效的文本内容' });
    }

    if (!sourceLanguage || !targetLanguage) {
      return res.status(400).json({ status: 'error', message: '请提供源语言和目标语言' });
    }

    // 调用Gemini API进行翻译
    const resultText = await translateText(inputText, sourceLanguage, targetLanguage, usePro);

    return res.status(200).json({ 
      status: 'success', 
      resultText
    });
  } catch (error) {
    console.error('翻译API错误:', error);
    return res.status(500).json({ 
      status: 'error', 
      message: error instanceof Error ? error.message : '处理请求时发生错误'
    });
  }
} 