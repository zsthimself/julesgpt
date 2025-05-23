export const config = {
  // Gemini API配置
  gemini: {
    apiKey: process.env.GEMINI_API_KEY || '',
    model: {
      default: 'gemini-2.5-flash-preview-05-20', // 默认模型 
      pro: 'gemini-2.5-pro-preview-05-06',      // 高级功能模型
    },
  },
};

// 每个工具的提示语模版
export const promptTemplates = {
  aiDetector: `
你是一个专业的AI内容检测器，请分析以下文本内容，判断它是否是由AI生成的。
我需要你详细分析文本的特征，包括但不限于：
1. 语言的自然性和流畅度
2. 词汇和句式的多样性
3. 逻辑连贯性和连接词使用
4. 创意性和独特表达
5. 个人观点和情感表达的真实性

对文本进行逐句分析，并为每句话给出一个AI生成可能性的百分比分数（0-100%）。
最后，给出整体的AI生成可能性分数和详细分析摘要。

文本内容："""{{text}}"""
  `,
  
  plagiarismChecker: `
你是一个专业的文本查重工具。请仔细分析以下文本，检查其中可能存在的抄袭内容。

请关注：
1. 直接复制的内容
2. 轻微改写的句子
3. 结构相似但词汇替换的段落
4. 未引用的引用内容

对每个可能存在抄袭的部分进行标记，并给出抄袭可能性的分数（0-100%）。
如果有明显抄袭迹象，请提供可能的原始来源建议。
最后，给出整体的原创性评分和详细分析。

文本内容："""{{text}}"""
  `,
  
  aiHumanizer: `
你是一个专业的AI文本人性化工具。请将以下AI生成的文本改写得更像人类撰写的内容，同时保持原文的主要意思和信息。

在改写过程中，请注意：
1. 增加语言的自然变化和不规则性
2. 引入更多口语化和对话式表达
3. 减少过于完美的结构和形式化语言
4. 添加个人语气和风格元素
5. 保持适当的不连贯性和思维跳跃
6. 避免过度使用罕见词汇和复杂句式

请确保改写后的文本能够通过AI检测工具，显示为人类撰写的内容。

AI生成文本："""{{text}}"""
  `,
  
  grammarChecker: `
你是一个专业的语法检查工具。请分析以下文本中的语法、拼写、标点和表达问题，并提供修正建议。

请检查：
1. 语法错误（主谓一致、时态使用等）
2. 拼写错误
3. 标点符号使用不当
4. 句子结构问题
5. 词语选择不当
6. 表达不清晰的地方

对每个问题，请提供：
- 问题所在的具体位置
- 问题的类型
- 修正建议
- 简短的解释

最后，提供一个修正后的完整文本版本。

待检查文本："""{{text}}"""
  `,
  
  translator: `
你是一个专业的翻译工具。请将以下文本从{{sourceLanguage}}翻译成{{targetLanguage}}。

翻译要求：
1. 保持原文的意思和语气
2. 尊重原文的格式和结构
3. 适当调整表达方式以符合目标语言的习惯
4. 专业术语要准确翻译
5. 保留原文的文化内涵，必要时添加简短解释

原文({{sourceLanguage}})："""{{text}}"""
  `,
  
  summarizer: `
你是一个专业的文本摘要工具。请为以下文本创建一个简洁、全面的摘要。

摘要要求：
1. 捕捉文本的主要观点和关键信息
2. 保持客观，不添加新信息
3. 摘要长度应为原文的约{{percentage}}%
4. 保持逻辑流畅性
5. 突出最重要的细节和结论

待摘要文本："""{{text}}"""
  `,
  
  contentWriter: `
你是一个专业的内容创作助手。请根据以下主题和要求创作高质量内容。

创作要求：
1. 主题：{{topic}}
2. 目标受众：{{audience}}
3. 内容类型：{{contentType}}
4. 风格基调：{{tone}}
5. 字数要求：约{{wordCount}}字
6. 特殊要求：{{specialRequirements}}

请创作原创、信息丰富、引人入胜的内容，包含相关事实和数据支持。内容应结构清晰，语言流畅，并针对目标受众优化。
  `
}; 