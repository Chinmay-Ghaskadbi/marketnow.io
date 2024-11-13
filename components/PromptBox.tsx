import { useState } from "react";

interface PromptBoxProps {
  title: string;
  initialPrompt: string;
}

export default function PromptBox({ title, initialPrompt }: PromptBoxProps) {
  const [prompt, setPrompt] = useState(initialPrompt);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4 text-red-600">{title}</h2>
      <textarea
        className="w-full h-32 p-2 border border-gray-300 rounded-md resize-none"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
      />
    </div>
  );
}