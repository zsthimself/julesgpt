"use client";

import { useState } from "react";
import TextInput from "./TextInput";
import ResultDisplay from "./ResultDisplay";
import FAQAccordion from "./FAQAccordion";
import type { Tool } from "@/lib/tools-data";
import { AlertTriangle } from "lucide-react";

// AI分析结果接口
interface AIAnalysisResult {
  overallScore: number;
  sentenceAnalysis: Array<{
    text: string;
    score: number;
    isAIGenerated: boolean;
  }>;
  summary: string;
}

interface ToolPageProps {
  tool: Tool;
}

export default function ToolPage({ tool }: ToolPageProps) {
  const [inputText, setInputText] = useState("");
  const [result, setResult] = useState<string | AIAnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | undefined>(undefined);

  const handleProcess = async () => {
    if (!inputText.trim()) {
      setError("Please enter some text or upload a file.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // 模拟API调用
      setTimeout(() => {
        if (tool.id === "ai-detector") {
          // 模拟AI检测结果
          const sentences = inputText.split(/(?<=\.|\?|\!)\s+/);
          const sentenceAnalysis = sentences.map(sentence => {
            // 随机生成AI生成概率（仅作演示）
            const score = Math.floor(Math.random() * 100);
            return {
              text: sentence,
              score,
              isAIGenerated: score > 65 // 假设大于65%的概率为AI生成
            };
          });
          
          // 计算整体AI生成概率
          const aiSentences = sentenceAnalysis.filter(s => s.isAIGenerated).length;
          const overallScore = Math.round((aiSentences / sentences.length) * 100);
          
          // 生成分析摘要
          let summary = "";
          if (overallScore > 80) {
            summary = "This text appears to be predominantly AI-generated. Multiple sentences show high probability of having been written by AI.";
          } else if (overallScore > 50) {
            summary = "This text contains a significant amount of AI-generated content mixed with human writing.";
          } else if (overallScore > 30) {
            summary = "This text appears to be mostly human-written with some AI assistance or editing.";
          } else {
            summary = "This text appears to be predominantly human-written with minimal or no AI involvement.";
          }
          
          // 设置AI检测结果
          setResult({
            overallScore,
            sentenceAnalysis,
            summary
          });
        } else {
          // 其他工具的标准字符串结果
          setResult(`Processed result for ${tool.name}:\n\n${inputText.slice(0, 100)}...`);
        }
        
        setIsLoading(false);
      }, 2000);

      // 真实API调用示例
      // const response = await fetch(tool.apiEndpoint, {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({ inputText }),
      // });
      //
      // if (!response.ok) {
      //   throw new Error('Failed to process your request');
      // }
      //
      // const data = await response.json();
      // if (data.status === 'success') {
      //   setResult(data.resultText || data.analysisResult);
      // } else {
      //   setError(data.errorMessage || 'An error occurred');
      // }
    } catch (err) {
      console.error("Processing error:", err);
      setError("An error occurred while processing your request. Please try again.");
    } finally {
      // setIsLoading(false); // 如果使用真实API调用，取消注释
    }
  };

  // 处理文件上传
  const handleFileUpload = (filename: string) => {
    setFileName(filename);
  };

  return (
    <div className="w-full max-w-7xl mx-auto">
      {/* 工具标题和介绍 */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-3">{tool.name}</h1>
        <p className="text-lg text-gray-600">{tool.description}</p>
      </div>

      {/* AI检测器警告声明 */}
      {tool.id === "ai-detector" && (
        <div className="mb-8 flex items-start gap-3 bg-amber-50 border border-amber-200 p-4 rounded-md">
          <AlertTriangle className="text-amber-500 flex-shrink-0 mt-1" size={24} />
          <p className="text-gray-700">
            <span className="font-semibold">Caution:</span> Our AI Detector is advanced, but no detectors are 100% reliable, no matter what their accuracy scores claim. 
            Never use AI detection alone to make decisions that could impact a person's career or academic standing.
          </p>
        </div>
      )}

      {/* 左右布局的主要内容区域 */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* 左侧输入区域 */}
        <div className="w-full lg:w-1/2">
          <TextInput
            value={inputText}
            onChange={(value) => {
              setInputText(value);
              // 当输入变化时，清除之前的结果和错误
              if (result) setResult(null);
              if (error) setError(null);
            }}
            placeholder={tool.inputPlaceholder}
            maxFileSize={5}
            onFileUpload={handleFileUpload}
          />
          
          {/* 操作按钮 */}
          <div className="mt-4">
            <button
              onClick={handleProcess}
              disabled={isLoading || !inputText.trim()}
              className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors w-full"
              tabIndex={0}
            >
              {isLoading ? "Processing..." : tool.actionButtonText}
            </button>
          </div>
        </div>

        {/* 右侧结果展示区域 */}
        <div className="w-full lg:w-1/2 lg:min-h-[200px]">
          <ResultDisplay
            result={result}
            fileName={fileName}
            isLoading={isLoading}
            error={error}
            showDownload={!!fileName}
            isAIDetector={tool.id === "ai-detector"}
          />
        </div>
      </div>

      {/* FAQ区域 */}
      <div className="mt-12">
        <FAQAccordion faqs={tool.faqs} />
      </div>
    </div>
  );
} 