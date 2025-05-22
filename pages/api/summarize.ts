import type { NextApiRequest, NextApiResponse } from 'next';
import { summarizeText } from '@/lib/gemini-api';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ status: 'error', message: '仅支持POST请求' });
  }

  try {
    const { inputText, percentage = '20', usePro = false } = req.body;

    if (!inputText || typeof inputText !== 'string') {
      return res.status(400).json({ status: 'error', message: '请提供有效的文本内容' });
    }

    // 调用Gemini API进行文本摘要
    const resultText = await summarizeText(inputText, percentage, usePro);

    return res.status(200).json({ 
      status: 'success', 
      resultText
    });
  } catch (error) {
    console.error('摘要API错误:', error);
    return res.status(500).json({ 
      status: 'error', 
      message: error instanceof Error ? error.message : '处理请求时发生错误'
    });
  }
} 