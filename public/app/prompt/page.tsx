"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

export default function PromptPage() {
  const searchParams = useSearchParams();

  // Retrieve query parameters
  const idea = searchParams.get("idea");
  const style = searchParams.get("style");
  const platform = searchParams.get("platform");
  const mediaTypes = JSON.parse(searchParams.get("mediaTypes") || "[]");
  const promptsJson = searchParams.get("prompts");
  const initialPrompts = promptsJson ? JSON.parse(promptsJson) : {};

  // State for editable prompts and additional information
  const [editedPrompts, setEditedPrompts] = useState(initialPrompts);
  const [addInfo, setAddInfo] = useState("");

  // Handle prompt edits
  const handlePromptChange = (mediaType, newPrompt) => {
    setEditedPrompts((prev) => ({
      ...prev,
      [mediaType]: newPrompt,
    }));
  };

  // Handle additional information input
  const handleAddInfoChange = (e) => {
    setAddInfo(e.target.value);
  };

  // Generate final prompts and content for each selected media type
  const handleCreate = async () => {
    for (const mediaType of mediaTypes) {
      // Generate final prompt using prompt_gen function
      const response = await fetch("http://localhost:5000/generate-prompt", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          style: style,
          types: mediaType.toLowerCase(),
          idea: idea,
          add_info: addInfo,
        }),
      });

      const data = await response.json();
      const finalPrompt = data.prompt;

      // Use control_center to generate content based on the final prompt
      await fetch("http://localhost:5000/generate-content", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: finalPrompt,
          platform: platform,
          types: mediaType.toLowerCase(),
        }),
      });
    }

    // Optionally redirect to a results page or show a success message
    alert("Content creation initiated for all selected media types!");
  };

  return (
    <div className="min-h-screen bg-[#f7f7ff]">
      <div className="container mx-auto px-6 py-12 max-w-4xl">
        <Link href="/" className="text-red-500 text-2xl font-bold mb-16 block">
          MarketNow.io
        </Link>
        
        <h1 className="text-4xl font-bold text-center text-red-500 mb-6">
          Here are some Ideas we came up with
        </h1>
        <p className="text-center text-gray-600 mb-16">
          Feel free to edit the prompts or Texts—we're ready for anything!
        </p>

        {/* Display text areas for each media type */}
        <div className="space-y-12">
          {Object.entries(editedPrompts).map(([mediaType, prompt]) => (
            <div key={mediaType} className="space-y-3">
              <h2 className="text-gray-700 font-medium text-lg">
                Edit your {mediaType} Prompt
              </h2>
              <div className="relative">
                <textarea
                  value={prompt as string}
                  onChange={(e) => handlePromptChange(mediaType, e.target.value)}
                  className={`w-full min-h-[150px] p-5 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500 resize-none text-gray-700
                    ${mediaType === "Image" ? "bg-blue-50 selection:bg-blue-200" : "bg-white"}`}
                />
                <div className="absolute right-3 top-3 w-3 h-3 rounded-full bg-red-500" />
              </div>
            </div>
          ))}
        </div>

        {/* Additional information input */}
        <div className="mt-8">
          <h2 className="text-gray-700 font-medium text-lg mb-3">
            Add Additional Information (optional)
          </h2>
          <textarea
            value={addInfo}
            onChange={handleAddInfoChange}
            placeholder="Add any additional instructions or information here"
            className="w-full min-h-[100px] p-5 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500 resize-none text-gray-700 bg-white"
          />
        </div>

        {/* Create button */}
        <div className="mt-16 flex justify-center">
          <button
            onClick={handleCreate}
            className="px-16 py-4 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors font-medium text-lg"
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
}