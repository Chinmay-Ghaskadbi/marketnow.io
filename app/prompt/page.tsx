"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { ClipLoader } from "react-spinners";
import JSZip from "jszip"; // Import JSZip

export default function PromptPage() {
  const searchParams = useSearchParams();

  // Retrieve query parameters
  const idea = searchParams.get("idea");
  const style = searchParams.get("style");
  const platform = searchParams.get("platform");
  const mediaTypes = JSON.parse(searchParams.get("mediaTypes") || "[]");

  // State for editable prompts, loading status, and download links
  const [editedPrompts, setEditedPrompts] = useState({});
  const [isLoadingPrompts, setIsLoadingPrompts] = useState(true);
  const [isCreatingContent, setIsCreatingContent] = useState(false);
  const [downloadLinks, setDownloadLinks] = useState([]);

  // Fetch AI-generated prompts on page load
  useEffect(() => {
    const fetchPrompts = async () => {
      const prompts = {};
      for (const mediaType of mediaTypes) {
        const response = await fetch("http://localhost:5000/generate-prompt", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ style, types: mediaType.toLowerCase(), idea }),
        });

        const data = await response.json();
        prompts[mediaType] = data.prompt;
      }
      setEditedPrompts(prompts);
      setIsLoadingPrompts(false);
    };

    if (isLoadingPrompts) {
      fetchPrompts();
    }
  }, [isLoadingPrompts, mediaTypes, style, idea]);

  const handlePromptChange = (mediaType, newPrompt) => {
    setEditedPrompts((prev) => ({
      ...prev,
      [mediaType]: newPrompt,
    }));
  };

  // Generate content for each selected media type
  const handleCreate = async () => {
    setIsCreatingContent(true);
    const downloadUrls = [];

    try {
      for (const mediaType of mediaTypes) {
        // Send request to generate content
        const response = await fetch("http://localhost:5000/generate-content", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            prompt: editedPrompts[mediaType],
            platform: platform,
            types: mediaType.toLowerCase(),
          }),
        });

        if (response.ok) {
          const blob = await response.blob();
          const url = window.URL.createObjectURL(blob);
          downloadUrls.push({
            url,
            fileName: `${mediaType.toLowerCase()}_content.${blob.type.split("/")[1]}`,
          });
        } else {
          throw new Error("Failed to generate content for " + mediaType);
        }
      }
      setDownloadLinks(downloadUrls);
    } catch (error) {
      console.error("Error during content creation:", error);
      alert("An error occurred during content creation. Please try again.");
    } finally {
      setIsCreatingContent(false);
    }
  };

  // Handle ZIP file generation
  const handleDownloadAll = async () => {
    const zip = new JSZip();

    try {
      for (const link of downloadLinks) {
        const response = await fetch(link.url);
        const blob = await response.blob();
        zip.file(link.fileName, blob);
      }

      const zipBlob = await zip.generateAsync({ type: "blob" });
      const zipUrl = window.URL.createObjectURL(zipBlob);

      const link = document.createElement("a");
      link.href = zipUrl;
      link.download = "marketnow_content.zip";
      link.click();

      window.URL.revokeObjectURL(zipUrl);
    } catch (error) {
      console.error("Error creating ZIP file:", error);
      alert("An error occurred while creating the ZIP file. Please try again.");
    }
  };

  if (isLoadingPrompts)
    return (
      <div className="text-center py-20">
        <ClipLoader color="#e63946" size={50} />
        <p className="mt-4 text-gray-600">Loading prompts...</p>
      </div>
    );

  if (isCreatingContent)
    return (
      <div className="text-center py-20">
        <ClipLoader color="#e63946" size={50} />
        <p className="mt-4 text-gray-600">Generating content...</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-[#f7f7ff]">
      <div className="flex-1 bg-white p-8 flex flex-col">
        <header className="mb-4">
          <Link href="/home" className="text-red-600 text-2xl font-bold hover:underline">
            MarketNow.io
          </Link>
        </header>
        <div className="flex flex-col items-center justify-center flex-grow">
          <div className="max-w-4xl w-full">
            <h1 className="text-4xl font-bold mb-12 text-center">
              Here are some <span className="text-red-500">ideas</span> we came up with
            </h1>
            <p className="text-center text-gray-600 mb-16">
              Feel free to edit the prompts or texts—we're ready for anything!
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

            {/* Create button */}
            <div className="mt-16 flex justify-center">
              <button
                onClick={handleCreate}
                disabled={isCreatingContent}
                className="px-16 py-4 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors font-medium text-lg"
              >
                {isCreatingContent ? "Creating..." : "Create"}
              </button>
            </div>

            {/* Display single ZIP download button */}
            {downloadLinks.length > 0 && (
              <div className="mt-8 text-center">
                <h2 className="text-lg font-bold mb-4">Your Content is Ready!</h2>
                <button
                  onClick={handleDownloadAll}
                  className="px-8 py-3 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors font-medium text-lg"
                >
                  Download
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
