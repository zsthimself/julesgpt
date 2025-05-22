"use client";

import Link from "next/link";
import { useState } from "react";
import { ChevronDown, Menu, User, LogOut } from "lucide-react";
import toolsData from "@/lib/tools-data";
import Logo from "@/components/ui/Logo";
import { useAuth, UserButton, SignedIn, SignedOut } from "@clerk/nextjs";

export default function Header() {
  const [isProductsOpen, setIsProductsOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { isSignedIn } = useAuth();

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="container mx-auto px-4 flex items-center justify-between h-16">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <Logo size={32} />
          <span className="text-xl font-bold text-blue-600">JulesGPT</span>
        </Link>

        {/* Mobile Menu Button */}
        <button 
          className="lg:hidden p-2 text-gray-600 hover:text-gray-900"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle mobile menu"
          tabIndex={0}
        >
          <Menu size={24} />
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-8">
          {/* Products Dropdown */}
          <div className="relative">
            <button
              className="flex items-center space-x-1 text-gray-700 hover:text-blue-600"
              onClick={() => setIsProductsOpen(!isProductsOpen)}
              onBlur={() => setTimeout(() => setIsProductsOpen(false), 100)}
              aria-expanded={isProductsOpen}
              aria-label="Products menu"
              tabIndex={0}
            >
              <span>Products</span>
              <ChevronDown size={16} className={isProductsOpen ? "transform rotate-180" : ""} />
            </button>

            {isProductsOpen && (
              <div className="absolute top-full left-0 mt-2 w-64 bg-white border border-gray-200 rounded-md shadow-lg z-50">
                <div className="p-2">
                  {toolsData.map((tool) => (
                    <Link
                      key={tool.id}
                      href={`/tools/${tool.id}`}
                      className="block p-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-md"
                      onClick={() => setIsProductsOpen(false)}
                    >
                      {tool.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Pricing Link */}
          <Link href="/pricing" className="text-gray-700 hover:text-blue-600">
            Pricing
          </Link>

          {/* Auth Buttons */}
          <SignedIn>
            <UserButton 
              afterSignOutUrl="/"
              appearance={{
                elements: {
                  userButtonAvatarBox: "w-8 h-8"
                }
              }}
            />
          </SignedIn>
          
          <SignedOut>
            <div className="flex items-center space-x-3">
              <Link href="/sign-in" className="text-gray-700 hover:text-blue-600">
                Sign In
              </Link>
              <Link 
                href="/sign-up" 
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Sign Up
              </Link>
            </div>
          </SignedOut>
        </nav>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-200">
          <div className="container mx-auto px-4 py-2">
            <div className="flex flex-col space-y-2">
              <div className="px-4 py-2 font-medium text-gray-900">Products</div>
              {toolsData.map((tool) => (
                <Link
                  key={tool.id}
                  href={`/tools/${tool.id}`}
                  className="px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {tool.name}
                </Link>
              ))}
              <Link
                href="/pricing"
                className="px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Pricing
              </Link>
              
              {/* Mobile Auth Buttons */}
              <SignedIn>
                <div className="px-4 py-2 flex items-center justify-between">
                  <span className="text-gray-700">Account</span>
                  <UserButton afterSignOutUrl="/" />
                </div>
              </SignedIn>
              
              <SignedOut>
                <Link
                  href="/sign-in"
                  className="px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Sign In
                </Link>
                <Link
                  href="/sign-up"
                  className="mx-4 my-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-center"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </SignedOut>
            </div>
          </div>
        </div>
      )}
    </header>
  );
} 