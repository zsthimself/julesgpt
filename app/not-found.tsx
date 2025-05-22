import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[calc(100vh-16rem)] flex items-center justify-center">
      <div className="text-center p-8 max-w-md">
        <h1 className="text-6xl font-bold text-blue-600 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Page Not Found</h2>
        <p className="text-gray-600 mb-8">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <Link 
          href="/"
          className="inline-flex items-center px-6 py-3 text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
        >
          <ArrowLeft size={18} className="mr-2" />
          Back to Home
        </Link>
      </div>
    </div>
  );
} 