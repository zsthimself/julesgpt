import { notFound } from "next/navigation";
import ToolPage from "../../../components/tools/ToolPage";
import toolsData from "../../../lib/tools-data";
import type { Metadata } from "next";

// 添加动态配置，防止预渲染错误
export const dynamic = 'force-dynamic';
// 添加Edge Runtime配置
export const runtime = 'edge';

// 定义路由参数类型
interface ToolParams {
  id: string;
}

// 修复类型，使用正确的Next.js页面参数格式
type ToolPageProps = {
  params: ToolParams;
}

// 动态生成页面元数据
export async function generateMetadata({ params }: ToolPageProps): Promise<Metadata> {
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

export default function ToolRoute({ params }: ToolPageProps) {
  // 查找匹配的工具
  const tool = toolsData.find(tool => tool.id === params.id);
  
  // 如果没有找到工具，返回404
  if (!tool) {
    notFound();
  }
  
  return <ToolPage tool={tool} />;
} 