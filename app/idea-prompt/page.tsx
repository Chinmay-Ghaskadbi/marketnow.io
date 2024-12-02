"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function IdeaPromptPage() {
  const [idea, setIdea] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Log the idea input for debugging
    console.log("Submitted idea:", idea);
    // Navigate to the content-type page with idea as a query parameter
    router.push(`/content-type?idea=${encodeURIComponent(idea)}`);
  };

  return (
    <div className="flex h-screen bg-black">
    <div className="flex-1 bg-white p-8 flex flex-col">
      <header className="mb-4">
        <Link href="/home" className="text-red-600 text-2xl font-bold hover:underline">
          MarketNow.io
          </Link>
        </header>
        <main className="flex-1 flex flex-col justify-center max-w-2xl">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            Got a Brilliant Idea?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Tell us your vision, and let our AI bring Marketing content to life.
          </p>
          <form onSubmit={handleSubmit} className="relative">
            <input
              type="text"
              value={idea}
              onChange={(e) => setIdea(e.target.value)}
              placeholder="Enter your idea"
              className="w-full p-4 pr-12 text-lg border-2 border-gray-300 rounded-lg focus:outline-none focus:border-red-500"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              aria-label="Submit idea"
            >
              <ArrowRight size={24} />
            </button>
          </form>
        </main>
      </div>
      <div className="flex-1 bg-gradient-to-br from-red-600 via-red-400 to-pink-500 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/placeholder.svg?height=1080&width=1080')] bg-cover bg-center mix-blend-overlay"></div>
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          <path
            d="M0,0 L100,0 L100,100 L0,100 Z"
            fill="none"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="0.5"
            vectorEffect="non-scaling-stroke"
          >
            <animate
              attributeName="d"
              dur="10s"
              repeatCount="indefinite"
              values="
                M0,0 L100,0 L100,100 L0,100 Z;
                M0,20 L100,0 L100,80 L0,100 Z;
                M0,0 L100,0 L100,100 L0,100 Z
              "
            />
          </path>
        </svg>
      </div>
    </div>
  );
}
