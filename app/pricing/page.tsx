import { Check } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

// 添加动态配置，防止预渲染错误
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: "Pricing - AI Toolbox",
  description: "Choose the plan that fits your needs. Upgrade to unlock additional features and higher usage limits.",
};

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Basic access to all tools with usage limits",
    features: [
      "Access to all AI tools",
      "Up to 5 requests per day",
      "5,000 character limit per request",
      "Standard processing speed",
      "Basic file formats support (.txt only)"
    ],
    buttonText: "Get Started",
    buttonLink: "/tools/summarizer",
    highlighted: false
  },
  {
    name: "Pro",
    price: "$12",
    period: "per month",
    description: "Perfect for individuals and content creators",
    features: [
      "Access to all AI tools",
      "Unlimited requests",
      "25,000 character limit per request",
      "Priority processing",
      "Advanced file formats (.txt, .docx, .pdf)",
      "Save and export history",
      "Email support"
    ],
    buttonText: "Upgrade to Pro",
    buttonLink: "#", // 实际项目中应该指向真实的结账页面
    highlighted: true
  },
  {
    name: "Team",
    price: "$49",
    period: "per month",
    description: "Ideal for teams and businesses",
    features: [
      "Everything in Pro",
      "5 team members included",
      "50,000 character limit per request",
      "Fastest processing speed",
      "Custom language models",
      "API access",
      "Advanced analytics",
      "Dedicated support"
    ],
    buttonText: "Contact Sales",
    buttonLink: "/contact",
    highlighted: false
  }
];

export default function PricingPage() {
  return (
    <div className="py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* 页面标题 */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Simple, Transparent Pricing</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Choose the plan that fits your needs. Upgrade anytime to unlock additional features and higher usage limits.
          </p>
        </div>
        
        {/* 定价卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <div 
              key={plan.name}
              className={`rounded-lg overflow-hidden border ${
                plan.highlighted 
                  ? 'border-blue-500 shadow-lg relative' 
                  : 'border-gray-200 shadow-sm'
              }`}
            >
              {plan.highlighted && (
                <div className="absolute top-0 left-0 right-0 bg-blue-500 text-white text-center py-1 text-sm font-medium">
                  Most Popular
                </div>
              )}
              
              <div className={`p-6 ${plan.highlighted ? 'pt-8' : ''}`}>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <div className="flex items-baseline mb-4">
                  <span className="text-4xl font-extrabold text-gray-900">{plan.price}</span>
                  <span className="text-gray-600 ml-2">/{plan.period}</span>
                </div>
                <p className="text-gray-600 mb-6">{plan.description}</p>
                
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <Check size={20} className="text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Link
                  href={plan.buttonLink}
                  className={`block w-full text-center py-3 rounded-md font-medium ${
                    plan.highlighted 
                      ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                      : 'bg-white border border-gray-300 hover:bg-gray-50 text-gray-800'
                  }`}
                >
                  {plan.buttonText}
                </Link>
              </div>
            </div>
          ))}
        </div>
        
        {/* FAQ部分 */}
        <div className="mt-20">
          <h2 className="text-3xl font-bold text-center mb-10">Frequently Asked Questions</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h3 className="text-xl font-semibold mb-3">Can I switch plans later?</h3>
              <p className="text-gray-700">
                Yes, you can upgrade, downgrade, or cancel your subscription at any time. Changes will be applied to your next billing cycle.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h3 className="text-xl font-semibold mb-3">What payment methods do you accept?</h3>
              <p className="text-gray-700">
                We accept all major credit cards, PayPal, and for Team plans, we can also provide invoicing options.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h3 className="text-xl font-semibold mb-3">Is there a free trial for paid plans?</h3>
              <p className="text-gray-700">
                Yes, Pro plans come with a 7-day free trial, and Team plans with a 14-day free trial. No credit card required to start.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h3 className="text-xl font-semibold mb-3">Do you offer refunds?</h3>
              <p className="text-gray-700">
                We offer a 30-day money-back guarantee for any reason. Just contact our support team for assistance.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 