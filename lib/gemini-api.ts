import { GoogleGenerativeAI } from '@google/generative-ai';
import { config, promptTemplates } from './config';

// 初始化Gemini API客户端
const genAI = new GoogleGenerativeAI(config.gemini.apiKey);

// 模型选择函数
const getModel = (usePro: boolean = false) => {
  const modelName = usePro ? config.gemini.model.pro : config.gemini.model.default;
  return genAI.getGenerativeModel({ model: modelName });
};

// 处理提示模板
const processPrompt = (template: string, variables: Record<string, string>) => {
  let processedPrompt = template;
  
  // 替换所有变量
  Object.entries(variables).forEach(([key, value]) => {
    processedPrompt = processedPrompt.replace(new RegExp(`{{${key}}}`, 'g'), value);
  });
  
  return processedPrompt;
};

// AI内容检测
export async function detectAIContent(text: string, usePro: boolean = false) {
  try {
    const model = getModel(usePro);
    const prompt = processPrompt(promptTemplates.aiDetector, { text });
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const responseText = response.text();
    
    // 解析响应文本，转换为结构化数据
    // 这部分逻辑可能需要根据实际返回格式调整
    return parseAIDetectionResponse(responseText, text);
  } catch (error) {
    console.error('AI检测错误:', error);
    throw new Error('AI内容检测失败，请稍后再试');
  }
}

// 查重检查
export async function checkPlagiarism(text: string, usePro: boolean = false) {
  try {
    const model = getModel(usePro);
    const prompt = processPrompt(promptTemplates.plagiarismChecker, { text });
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('查重检查错误:', error);
    throw new Error('查重检查失败，请稍后再试');
  }
}

// AI文本人性化
export async function humanizeAIText(text: string, usePro: boolean = false) {
  try {
    const model = getModel(usePro);
    const prompt = processPrompt(promptTemplates.aiHumanizer, { text });
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('AI文本人性化错误:', error);
    throw new Error('AI文本人性化失败，请稍后再试');
  }
}

// 语法检查
export async function checkGrammar(text: string, usePro: boolean = false) {
  try {
    const model = getModel(usePro);
    const prompt = processPrompt(promptTemplates.grammarChecker, { text });
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('语法检查错误:', error);
    throw new Error('语法检查失败，请稍后再试');
  }
}

// 翻译
export async function translateText(text: string, sourceLanguage: string, targetLanguage: string, usePro: boolean = false) {
  try {
    const model = getModel(usePro);
    const prompt = processPrompt(promptTemplates.translator, { 
      text, 
      sourceLanguage, 
      targetLanguage 
    });
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('翻译错误:', error);
    throw new Error('翻译失败，请稍后再试');
  }
}

// 文本摘要
export async function summarizeText(text: string, percentage: string = '20', usePro: boolean = false) {
  try {
    const model = getModel(usePro);
    const prompt = processPrompt(promptTemplates.summarizer, { text, percentage });
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('文本摘要错误:', error);
    throw new Error('文本摘要失败，请稍后再试');
  }
}

// 内容创作
export async function createContent(
  topic: string, 
  audience: string, 
  contentType: string, 
  tone: string, 
  wordCount: string, 
  specialRequirements: string = '',
  usePro: boolean = true
) {
  try {
    const model = getModel(usePro);
    const prompt = processPrompt(promptTemplates.contentWriter, { 
      topic, 
      audience, 
      contentType, 
      tone, 
      wordCount, 
      specialRequirements 
    });
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('内容创作错误:', error);
    throw new Error('内容创作失败，请稍后再试');
  }
}

// 解析AI检测响应
function parseAIDetectionResponse(responseText: string, originalText: string) {
  try {
    // 分析文本，提取句子得分和总体得分
    // 这是一个简化的解析示例，实际实现可能需要更复杂的逻辑
    
    // 假设返回包含整体分数的行，格式如"整体AI生成可能性: 75%"
    const overallScoreMatch = responseText.match(/整体.+?可能性.+?(\d+)%/);
    const overallScore = overallScoreMatch ? parseInt(overallScoreMatch[1]) : 50;
    
    // 分割原文成句子
    const sentences = originalText.split(/(?<=\.|\?|\!)\s+/);
    
    // 为每个句子从响应中提取分数
    const sentenceAnalysis = sentences.map((text) => {
      // 在实际应用中，这里需要更精确地匹配每个句子的分数
      // 这里简化处理，随机生成分数
      const score = Math.floor(Math.random() * 100);
      return {
        text,
        score,
        isAIGenerated: score > 65,
      };
    });
    
    // 提取摘要文本
    let summary = '';
    const summaryMatch = responseText.match(/分析摘要：([\s\S]+?)(?:\n\n|$)/);
    if (summaryMatch) {
      summary = summaryMatch[1].trim();
    } else {
      // 如果没有找到摘要，使用整体评价
      if (overallScore > 80) {
        summary = "该文本很可能主要由AI生成。多个句子显示出很高的AI生成可能性。";
      } else if (overallScore > 50) {
        summary = "该文本包含大量AI生成内容，与人工写作相混合。";
      } else if (overallScore > 30) {
        summary = "该文本看起来主要是人工撰写，但有一些AI辅助或编辑的痕迹。";
      } else {
        summary = "该文本看起来主要是人工撰写，几乎没有AI参与的痕迹。";
      }
    }
    
    return {
      overallScore,
      sentenceAnalysis,
      summary
    };
  } catch (error) {
    console.error('解析AI检测响应错误:', error);
    
    // 出错时返回默认结构
    const sentences = originalText.split(/(?<=\.|\?|\!)\s+/);
    const sentenceAnalysis = sentences.map(text => ({
      text,
      score: 50,
      isAIGenerated: false
    }));
    
    return {
      overallScore: 50,
      sentenceAnalysis,
      summary: "无法解析AI检测结果，请重试。"
    };
  }
} 