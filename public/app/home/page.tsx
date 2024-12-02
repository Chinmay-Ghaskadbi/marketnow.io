import { ChevronDown } from "lucide-react";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-black text-white font-sans">
      <section className="min-h-screen flex flex-col justify-center items-center p-8 bg-gradient-to-br from-red-900 to-black relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/placeholder.svg?height=1080&width=1920')] opacity-20 animate-pulse"></div>
        <div className="z-10 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            <span className="text-red-500">Create with Ease,</span> Save with
            GenAI
          </h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            At GenAd.io, we simplify content creation with AI, empowering your
            business to craft impactful social media marketing for less.
          </p>
          <Link
            href="/idea-prompt"
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-full transition duration-300"
          >
            Try Now
          </Link>
        </div>
        <ChevronDown className="absolute bottom-8 animate-bounce" size={32} />
      </section>
    </div>
  );
}
