import { notFound } from "next/navigation";
import ToolPage from "@/components/tools/ToolPage";
import toolsData from "@/lib/tools-data";
import type { Metadata } from "next";

// 定义路由参数类型
interface ToolPageParams {
  params: {
    id: string;
  };
}

// 动态生成页面元数据
export async function generateMetadata({ params }: ToolPageParams): Promise<Metadata> {
  const tool = toolsData.find(tool => tool.id === params.id);
  
  if (!tool) {
    return {
      title: "Tool Not Found - AI Toolbox",
      description: "The requested tool was not found."
    };
  }
  
  return {
    title: `${tool.name} - AI Toolbox`,
    description: tool.description,
  };
}

// 生成静态路径参数
export function generateStaticParams() {
  return toolsData.map(tool => ({
    id: tool.id,
  }));
}

export default function ToolRoute({ params }: ToolPageParams) {
  // 查找匹配的工具
  const tool = toolsData.find(tool => tool.id === params.id);
  
  // 如果没有找到工具，返回404
  if (!tool) {
    notFound();
  }
  
  return <ToolPage tool={tool} />;
} 