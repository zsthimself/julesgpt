"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import type { FAQItem } from "@/lib/tools-data";

interface FAQAccordionProps {
  faqs: FAQItem[];
}

export default function FAQAccordion({ faqs }: FAQAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };
  
  if (faqs.length === 0) {
    return null;
  }

  return (
    <div className="w-full mt-8">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Frequently Asked Questions</h3>
      <div className="space-y-3">
        {faqs.map((faq, index) => (
          <div 
            key={index} 
            className="border border-gray-200 rounded-md overflow-hidden"
          >
            <button
              className="w-full flex justify-between items-center p-4 text-left bg-white hover:bg-gray-50 transition-colors"
              onClick={() => toggleFAQ(index)}
              aria-expanded={openIndex === index}
              tabIndex={0}
            >
              <span className="font-medium text-gray-800">{faq.question}</span>
              <span className="text-gray-500 ml-4">
                {openIndex === index ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </span>
            </button>
            
            {openIndex === index && (
              <div className="p-4 pt-0 bg-white border-t border-gray-100">
                <p className="text-gray-700">{faq.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
} 