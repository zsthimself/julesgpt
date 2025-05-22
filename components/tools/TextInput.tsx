"use client";

import { useState, useRef, ChangeEvent } from "react";
import { Upload } from "lucide-react";

interface TextInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  maxFileSize?: number; // in MB
  onFileUpload?: (fileName: string) => void; // 添加回调函数用于通知文件名
}

export default function TextInput({ 
  value, 
  onChange, 
  placeholder,
  maxFileSize = 5, // 默认5MB限制
  onFileUpload
}: TextInputProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleTextChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
    if (error) setError(null);
  };

  const handleFileClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 检查文件类型
    const fileType = file.name.split('.').pop()?.toLowerCase();
    if (fileType !== 'txt' && fileType !== 'docx') {
      setError("Unsupported file type. Please upload .txt or .docx files.");
      return;
    }

    // 检查文件大小
    if (file.size > maxFileSize * 1024 * 1024) {
      setError(`File size exceeds the ${maxFileSize}MB limit.`);
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      // 处理txt文件
      if (fileType === 'txt') {
        const text = await file.text();
        onChange(text);
        // 调用回调函数，传递文件名
        if (onFileUpload) {
          onFileUpload(file.name);
        }
      } 
      // 处理docx文件需要额外库，简单示例
      else if (fileType === 'docx') {
        // 真实实现需要使用mammoth.js等库处理docx文件
        // 这里仅作示例，实际项目中需要替换为真实处理逻辑
        setError("DOCX processing requires additional setup. Implementation pending.");
        // 如果已有DOCX处理逻辑，则替换上面的错误为实际处理代码：
        // const text = await processDocxFile(file);
        // onChange(text);
        // if (onFileUpload) {
        //   onFileUpload(file.name);
        // }
      }
    } catch (err) {
      setError("Failed to read file. Please try again.");
      console.error(err);
    } finally {
      setIsUploading(false);
      // 重置文件输入以允许再次上传相同文件
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="w-full">
      <div className="relative">
        <textarea
          value={value}
          onChange={handleTextChange}
          placeholder={placeholder}
          className="w-full min-h-[400px] p-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y"
          disabled={isUploading}
        />
        
        <button
          type="button"
          onClick={handleFileClick}
          className="absolute top-4 right-4 p-2 bg-gray-100 text-gray-600 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={isUploading}
          aria-label="Upload file"
          tabIndex={0}
        >
          <Upload size={20} />
        </button>
        
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept=".txt,.docx"
          className="hidden"
        />
      </div>
      
      {/* 文件格式提示 */}
      <div className="mt-2 text-xs text-gray-500 flex justify-between">
        <span>Supported formats: .txt, .docx</span>
        <span>Max file size: {maxFileSize}MB</span>
      </div>
      
      {/* 错误提示 */}
      {error && (
        <div className="mt-2 text-sm text-red-600">
          {error}
        </div>
      )}
      
      {/* 上传中提示 */}
      {isUploading && (
        <div className="mt-2 text-sm text-blue-600">
          Processing file...
        </div>
      )}
    </div>
  );
} 