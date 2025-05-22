"use client";

import { useState } from "react";
import { Copy, Download, FileText, Check } from "lucide-react";
import { jsPDF } from "jspdf";
import "jspdf/dist/polyfills.es.js";

interface AIAnalysisResult {
  overallScore: number;
  sentenceAnalysis: Array<{
    text: string;
    score: number;
    isAIGenerated: boolean;
  }>;
  summary: string;
}

interface ResultDisplayProps {
  result: string | null | AIAnalysisResult;
  fileName?: string; // 原始文件名，用于生成下载文件名
  isLoading: boolean;
  error?: string | null;
  showDownload?: boolean; // 是否显示下载按钮
  isAIDetector?: boolean; // 是否为AI检测器工具
}

export default function ResultDisplay({
  result,
  fileName,
  isLoading,
  error = null,
  showDownload = false,
  isAIDetector = false
}: ResultDisplayProps) {
  const [copied, setCopied] = useState(false);
  const [generatingPDF, setGeneratingPDF] = useState(false);

  const handleCopy = async () => {
    if (!result) return;
    
    try {
      let textToCopy = "";
      if (typeof result === "string") {
        textToCopy = result;
      } else {
        // 如果是AIAnalysisResult对象，则复制摘要和句子分析
        textToCopy = `${result.summary}\n\n`;
        result.sentenceAnalysis.forEach(sentence => {
          textToCopy += `[${sentence.score}%] ${sentence.text}\n`;
        });
      }
      
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleDownload = () => {
    if (!result) return;
    
    const downloadFileName = fileName 
      ? `${fileName.split('.')[0]}_result.txt`
      : `result_${new Date().getTime()}.txt`;
    
    let content = "";
    if (typeof result === "string") {
      content = result;
    } else {
      // 如果是AIAnalysisResult对象，则格式化分析结果
      content = `AI Analysis Results\n`;
      content += `Overall AI Content Score: ${result.overallScore}%\n\n`;
      content += `Summary: ${result.summary}\n\n`;
      content += `Detailed Sentence Analysis:\n`;
      result.sentenceAnalysis.forEach(sentence => {
        content += `[${sentence.score}%] ${sentence.text}\n`;
      });
    }
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = downloadFileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // 生成PDF报告
  const handleGeneratePDF = () => {
    if (!result || typeof result === "string" || generatingPDF) return;
    
    setGeneratingPDF(true);
    
    try {
      // 创建PDF文档
      const doc = new jsPDF();
      
      // 添加标题
      doc.setFontSize(20);
      doc.text("AI Content Analysis Report", 20, 20);
      
      // 添加日期和时间
      doc.setFontSize(10);
      doc.text(`Generated: ${new Date().toLocaleString()}`, 20, 30);
      
      // 添加分隔线
      doc.setLineWidth(0.5);
      doc.line(20, 35, 190, 35);
      
      // 添加摘要
      doc.setFontSize(16);
      doc.text("Analysis Summary", 20, 45);
      doc.setFontSize(12);
      
      // 处理摘要文本自动换行
      const splitSummary = doc.splitTextToSize(result.summary, 170);
      doc.text(splitSummary, 20, 55);
      
      // 添加总体分数
      let yPos = 55 + splitSummary.length * 7;
      doc.setFontSize(16);
      doc.text("Overall AI Content Score", 20, yPos);
      doc.setFontSize(24);
      doc.text(`${result.overallScore}%`, 20, yPos + 12);
      
      // 添加句子分析
      yPos += 25;
      doc.setFontSize(16);
      doc.text("Sentence Analysis", 20, yPos);
      doc.setFontSize(12);
      
      yPos += 10;
      
      // 遍历所有句子并添加到PDF
      result.sentenceAnalysis.forEach((sentence, index) => {
        // 检查是否需要新页面
        if (yPos > 250) {
          doc.addPage();
          yPos = 20;
        }
        
        // 设置颜色：AI生成内容为红色，人工内容为绿色
        if (sentence.isAIGenerated) {
          doc.setTextColor(220, 53, 69); // 红色
        } else {
          doc.setTextColor(40, 167, 69); // 绿色
        }
        
        // 添加句子得分
        doc.text(`[${sentence.score}%] `, 20, yPos);
        
        // 添加句子文本，处理自动换行
        const splitText = doc.splitTextToSize(sentence.text, 160);
        doc.text(splitText, 35, yPos);
        
        // 更新Y坐标位置，为下一个句子做准备
        yPos += splitText.length * 7 + 5;
        
        // 重置文本颜色
        doc.setTextColor(0, 0, 0);
      });
      
      // 添加页脚
      const pageCount = doc.internal.pages.length - 1;
      for(let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(10);
        doc.setTextColor(150);
        doc.text(`Higgsfieldgpt AI Detection Report - Page ${i} of ${pageCount}`, 20, 287);
      }
      
      // 生成文件名
      const pdfFileName = fileName 
        ? `${fileName.split('.')[0]}_ai_analysis.pdf`
        : `ai_analysis_${new Date().getTime()}.pdf`;
      
      // 保存PDF
      doc.save(pdfFileName);
      
    } catch (err) {
      console.error("Failed to generate PDF:", err);
    } finally {
      setGeneratingPDF(false);
    }
  };

  // 加载状态
  if (isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center p-8 bg-white border border-gray-200 rounded-md shadow-sm min-h-[400px]">
        <div className="flex items-center justify-center space-x-2">
          <div className="w-4 h-4 rounded-full bg-blue-600 animate-pulse"></div>
          <div className="w-4 h-4 rounded-full bg-blue-600 animate-pulse delay-150"></div>
          <div className="w-4 h-4 rounded-full bg-blue-600 animate-pulse delay-300"></div>
          <span className="ml-2 text-gray-600">Processing...</span>
        </div>
      </div>
    );
  }

  // 错误状态
  if (error) {
    return (
      <div className="w-full h-full flex items-center p-6 bg-red-50 border border-red-200 rounded-md min-h-[400px]">
        <div className="text-red-600">{error}</div>
      </div>
    );
  }

  // 空结果状态
  if (!result) {
    return (
      <div className="w-full h-full flex items-center justify-center p-8 bg-white border border-gray-200 rounded-md text-center text-gray-500 min-h-[400px]">
        Your results will appear here.
      </div>
    );
  }

  // AI检测结果展示
  if (isAIDetector && typeof result !== "string") {
    return (
      <div className="w-full h-full bg-white border border-gray-200 rounded-md shadow-sm overflow-hidden flex flex-col min-h-[400px]">
        <div className="flex justify-between items-center p-4 bg-gray-50 border-b border-gray-200">
          <h3 className="font-medium text-gray-700">AI Detection Result</h3>
          <div className="flex space-x-2">
            <button
              onClick={handleCopy}
              className="p-2 text-gray-600 hover:text-blue-600 hover:bg-gray-100 rounded-md transition-colors"
              aria-label="Copy to clipboard"
              tabIndex={0}
            >
              {copied ? <Check size={18} /> : <Copy size={18} />}
            </button>
            
            <button
              onClick={handleGeneratePDF}
              disabled={generatingPDF}
              className="p-2 text-gray-600 hover:text-blue-600 hover:bg-gray-100 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Generate PDF report"
              tabIndex={0}
            >
              <FileText size={18} />
            </button>
            
            {showDownload && (
              <button
                onClick={handleDownload}
                className="p-2 text-gray-600 hover:text-blue-600 hover:bg-gray-100 rounded-md transition-colors"
                aria-label="Download result"
                tabIndex={0}
              >
                <Download size={18} />
              </button>
            )}
          </div>
        </div>
        
        <div className="p-6 flex-1 overflow-y-auto">
          {/* 总体AI内容百分比 */}
          <div className="mb-6">
            <h4 className="text-lg font-medium text-gray-800 mb-2">Overall AI Content</h4>
            <div className="relative h-8 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 to-indigo-600"
                style={{ width: `${result.overallScore}%` }}
              ></div>
              <div className="absolute inset-0 flex items-center justify-center text-sm font-medium">
                {result.overallScore}%
              </div>
            </div>
          </div>
          
          {/* 摘要 */}
          <div className="mb-6 p-4 border border-gray-200 rounded-md bg-gray-50">
            <h4 className="text-md font-medium text-gray-800 mb-2">Analysis Summary</h4>
            <p className="text-gray-700">{result.summary}</p>
          </div>
          
          {/* 逐句分析 */}
          <div>
            <h4 className="text-lg font-medium text-gray-800 mb-3">Sentence Analysis</h4>
            <div className="space-y-4">
              {result.sentenceAnalysis.map((sentence, index) => (
                <div 
                  key={index} 
                  className={`p-3 rounded-md ${
                    sentence.isAIGenerated 
                      ? 'bg-yellow-50 border border-yellow-200' 
                      : 'bg-green-50 border border-green-200'
                  }`}
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className={`text-sm font-medium ${
                      sentence.isAIGenerated ? 'text-amber-600' : 'text-green-600'
                    }`}>
                      {sentence.isAIGenerated ? 'AI Generated' : 'Human Written'}
                    </span>
                    <span className="text-sm font-medium">
                      {sentence.score}%
                    </span>
                  </div>
                  <p className="text-gray-800">{sentence.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 标准结果展示（字符串类型）
  return (
    <div className="w-full h-full bg-white border border-gray-200 rounded-md shadow-sm overflow-hidden flex flex-col min-h-[400px]">
      <div className="flex justify-between items-center p-4 bg-gray-50 border-b border-gray-200">
        <h3 className="font-medium text-gray-700">Result</h3>
        <div className="flex space-x-2">
          <button
            onClick={handleCopy}
            className="p-2 text-gray-600 hover:text-blue-600 hover:bg-gray-100 rounded-md transition-colors"
            aria-label="Copy to clipboard"
            tabIndex={0}
          >
            {copied ? <Check size={18} /> : <Copy size={18} />}
          </button>
          
          {showDownload && (
            <button
              onClick={handleDownload}
              className="p-2 text-gray-600 hover:text-blue-600 hover:bg-gray-100 rounded-md transition-colors"
              aria-label="Download result"
              tabIndex={0}
            >
              <Download size={18} />
            </button>
          )}
        </div>
      </div>
      
      <div className="p-6 whitespace-pre-wrap text-gray-800 flex-1 overflow-y-auto">
        {typeof result === "string" ? result : JSON.stringify(result, null, 2)}
      </div>
    </div>
  );
} 