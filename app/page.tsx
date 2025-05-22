import Link from "next/link";
import toolsData from "@/lib/tools-data";
import * as LucideIcons from "lucide-react";

export default function Home() {
  const getIcon = (iconName: string) => {
    const IconComponent = LucideIcons[iconName as keyof typeof LucideIcons] as React.ComponentType<{ size?: number }>;
    return IconComponent ? <IconComponent size={40} /> : null;
  };

  return (
    <div className="min-h-screen bg-white">
      {/* 英雄区 */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-800 text-white">
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Simple and Credible Open AI and Gemini Detector Tool for Free</h1>
          <p className="text-xl md:text-2xl mb-10 max-w-3xl mx-auto">
            Millions of Users Trust JulesGPT, See what sets JulesGPT apart
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link 
              href={`/tools/${toolsData[0].id}`}
              className="px-8 py-3 bg-white text-blue-600 rounded-md font-medium hover:bg-gray-100 transition-colors"
            >
              Try Free Detector
            </Link>
            <Link 
              href="/pricing"
              className="px-8 py-3 bg-transparent border border-white text-white rounded-md font-medium hover:bg-white/10 transition-colors"
            >
              See Premium Features
            </Link>
          </div>
        </div>
      </section>

      {/* 功能特性 */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* 特性1: 高亮句子 */}
            <div className="text-center">
              <div className="flex justify-center mb-6">
                <div className="w-28 h-28 relative bg-blue-100 rounded-full flex items-center justify-center">
                  {getIcon("HighlighterIcon")}
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-4">Highlighted Sentences</h3>
              <p className="text-gray-600">
                Every sentence written by AI is highlighted, with a gauge showing the percentage of AI inside the text
              </p>
            </div>

            {/* 特性2: 多功能 */}
            <div className="text-center">
              <div className="flex justify-center mb-6">
                <div className="w-28 h-28 relative bg-green-100 rounded-full flex items-center justify-center">
                  {getIcon("LayersIcon")}
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-4">Multiple Features</h3>
              <p className="text-gray-600">
                Enjoy our Top-notch Plagiarism Checker, Paraphraser, Summarizer, Grammar checker, Translator, Writing Assistant...
              </p>
            </div>

            {/* 特性3: 高精度模型 */}
            <div className="text-center">
              <div className="flex justify-center mb-6">
                <div className="w-28 h-28 relative bg-purple-100 rounded-full flex items-center justify-center">
                  {getIcon("TargetIcon")}
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-4">High Accuracy Model</h3>
              <p className="text-gray-600">
                Advanced and premium model, trained on all languages to provide highly accurate results
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mt-20">
            {/* 特性4: 生成报告 */}
            <div className="text-center">
              <div className="flex justify-center mb-6">
                <div className="w-28 h-28 relative bg-yellow-100 rounded-full flex items-center justify-center">
                  {getIcon("FileTextIcon")}
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-4">Generated Report</h3>
              <p className="text-gray-600">
                Automatically generated .pdf reports for every detection, used as a proof of AI-Free plagiarism
              </p>
            </div>

            {/* 特性5: 支持所有语言 */}
            <div className="text-center">
              <div className="flex justify-center mb-6">
                <div className="w-28 h-28 relative bg-red-100 rounded-full flex items-center justify-center">
                  {getIcon("GlobeIcon")}
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-4">Support All Languages</h3>
              <p className="text-gray-600">
                Support all the languages with the highest accuracy rate of detection
              </p>
            </div>

            {/* 特性6: 批量文件上传 */}
            <div className="text-center">
              <div className="flex justify-center mb-6">
                <div className="w-28 h-28 relative bg-indigo-100 rounded-full flex items-center justify-center">
                  {getIcon("UploadIcon")}
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-4">Batch Files Upload</h3>
              <p className="text-gray-600">
                Simply upload multiple files at once, and they will get checked automatically in the dashboard
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 工具展示 */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Our AI Detection Tools</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {toolsData.map((tool) => (
              <Link
                key={tool.id}
                href={`/tools/${tool.id}`}
                className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="mb-4 text-blue-600">
                  {getIcon(tool.iconName)}
                </div>
                <h3 className="text-xl font-semibold mb-2">{tool.name}</h3>
                <p className="text-gray-600 mb-4">{tool.description}</p>
                <span className="inline-flex items-center text-blue-600 font-medium">
                  Try now <LucideIcons.ArrowRight className="ml-2" size={16} />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 行动召唤 */}
      <section className="py-12 bg-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <Link 
            href="/pricing"
            className="px-8 py-3 bg-white text-blue-600 rounded-md font-medium hover:bg-gray-100 transition-colors inline-block"
          >
            Get Premium Features
          </Link>
        </div>
      </section>
    </div>
  );
}
