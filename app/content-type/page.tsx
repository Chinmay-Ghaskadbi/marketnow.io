"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

export default function ContentTypePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const idea = searchParams.get("idea");  // Retrieve 'idea' from the URL
  console.log("Retrieved idea:", idea);
  const [contentType, setContentType] = useState({
    style: "",
    platform: "",
    mediaType: [] as string[],
  });

  const handleSelection = (
    category: "style" | "platform" | "mediaType",
    value: string,
  ) => {
    setContentType((prev) => {
      if (category === "mediaType") {
        const updatedMediaType = prev.mediaType.includes(value)
          ? prev.mediaType.filter((item) => item !== value)
          : [...prev.mediaType, value];
        console.log("Updated mediaType selections:", updatedMediaType);
        return { ...prev, [category]: updatedMediaType };
      }
      console.log(`Selected ${category}:`, value);
      return { ...prev, [category]: value };
    });
  };

  const generatePrompt = (mediaType: string) => {
    const { style, platform } = contentType;
    return `Create a ${style} ${mediaType.toLowerCase()} for ${platform} that showcases [product/service].`;
  };

  const handleSubmit = () => {
    const prompts = contentType.mediaType.reduce((acc, mediaType) => {
      acc[mediaType] = generatePrompt(mediaType);
      return acc;
    }, {} as Record<string, string>);

    const searchParams = new URLSearchParams();
    searchParams.append("prompts", JSON.stringify(prompts));
    if (idea) searchParams.append("idea", idea);            // Include 'idea' from the previous page
    searchParams.append("style", contentType.style);         // Include the selected style
    searchParams.append("platform", contentType.platform);   // Include the selected platform
    searchParams.append("mediaTypes", JSON.stringify(contentType.mediaType));  // Include selected media types
    console.log("Navigating to prompt page with data:", {
      idea, style: contentType.style,
      platform: contentType.platform,
      mediaTypes: contentType.mediaType,
      prompts });
    router.push(`/prompt?${searchParams.toString()}`);
  };

  return (
    <div className="min-h-screen bg-[url('/promptbg.png')] bg-cover bg-center relative">
    <div className="absolute inset-0 bg-black/80"></div>
    <div className="relative z-10 text-white font-sans p-8 md:p-12 flex flex-col min-h-screen">
      <header className="mb-4">
        <Link href="/home" className="text-red-600 text-2xl font-bold hover:underline">
          MarketNow.io
        </Link>
      </header>
        <div className="flex flex-col items-center justify-center flex-grow">
          <div className="max-w-4xl w-full">
            <h1 className="text-4xl font-bold mb-12 text-center">
              What type of <span className="text-red-500">content</span> are you creating?
            </h1>

            <div className="space-y-8">
              <div className="space-y-8">
                <h2 className="text-xl font-semibold">What's your style?</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
                  {["Minimalistic", "Pop Art", "Photorealistic", "Animated"].map((style) => (
                    <button
                      key={style}
                      onClick={() => handleSelection("style", style)}
                      className={`
                        px-6 py-3 rounded-full text-sm font-medium transition-all duration-200
                        ${contentType.style === style
                          ? "bg-red-500 text-white shadow-lg transform scale-105"
                          : "bg-white/90 text-red-500 hover:bg-white hover:scale-105"
                        }
                      `}
                    >
                      {style}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-8">
                <h2 className="text-xl font-semibold">Choose your Platform</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
                  {["Instagram Reel", "Instagram Post", "X Post", "Tik Tok"].map((platform) => (
                    <button
                      key={platform}
                      onClick={() => handleSelection("platform", platform)}
                      className={`
                        px-6 py-3 rounded-full text-sm font-medium transition-all duration-200
                        ${contentType.platform === platform
                          ? "bg-red-500 text-white shadow-lg transform scale-105"
                          : "bg-white/90 text-red-500 hover:bg-white hover:scale-105"
                        }
                      `}
                    >
                      {platform}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-8">
                <h2 className="text-xl font-semibold">Choose your media type (Choose Multiple)</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
                  {["Video", "Image", "Audio", "Only Script"].map((media) => (
                    <button
                      key={media}
                      onClick={() => handleSelection("mediaType", media)}
                      className={`
                        px-6 py-3 rounded-full text-sm font-medium transition-all duration-200
                        ${contentType.mediaType.includes(media)
                          ? "bg-red-500 text-white shadow-lg transform scale-105"
                          : "bg-white/90 text-red-500 hover:bg-white hover:scale-105"
                        }
                      `}
                    >
                      {media}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-12 text-center">
              <button
                onClick={handleSubmit}
                className="px-10 py-4 bg-gradient-to-r from-red-500 to-red-600 rounded-full transition-all duration-200 transform hover:scale-105 text-lg font-semibold shadow-lg hover:from-red-600 hover:to-red-700"
              >
                Try Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
