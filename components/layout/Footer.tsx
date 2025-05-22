"use client";

import Link from "next/link";
import toolsData from "@/lib/tools-data";
import { useSidebarContext } from "@/components/SidebarContext";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const { isCollapsed } = useSidebarContext();

  return (
    <footer className="bg-white border-t border-gray-200 py-12 w-full mt-auto">
      <div className={`container mx-auto px-4 transition-all duration-300 ${
        isCollapsed ? "lg:max-w-[calc(100%-4rem)] lg:ml-16" : "lg:max-w-[calc(100%-6rem)] lg:ml-24"
      }`}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Tools Section */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Our Tools</h3>
            <ul className="space-y-2">
              {toolsData.map((tool) => (
                <li key={tool.id}>
                  <Link 
                    href={`/tools/${tool.id}`}
                    className="text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    {tool.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Section */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  href="/about"
                  className="text-gray-600 hover:text-blue-600 transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link 
                  href="/contact"
                  className="text-gray-600 hover:text-blue-600 transition-colors"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link 
                  href="/pricing"
                  className="text-gray-600 hover:text-blue-600 transition-colors"
                >
                  Pricing
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Section */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  href="/terms"
                  className="text-gray-600 hover:text-blue-600 transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link 
                  href="/privacy"
                  className="text-gray-600 hover:text-blue-600 transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Connect Section */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Connect</h3>
            <ul className="space-y-2">
              <li>
                <a 
                  href="https://twitter.com/aitoolbox" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-blue-600 transition-colors"
                >
                  Twitter
                </a>
              </li>
              <li>
                <a 
                  href="https://linkedin.com/company/aitoolbox" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-blue-600 transition-colors"
                >
                  LinkedIn
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200 text-center">
          <p className="text-gray-600">
            © {currentYear} JulesGPT. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}