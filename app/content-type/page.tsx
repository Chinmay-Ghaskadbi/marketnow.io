'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function ContentTypePage() {
  const [contentType, setContentType] = useState({
    style: '',
    platform: '',
    mediaType: []
  })

  const handleSelection = (category: 'style' | 'platform' | 'mediaType', value: string) => {
    setContentType(prev => {
      if (category === 'mediaType') {
        const updatedMediaType = prev.mediaType.includes(value)
          ? prev.mediaType.filter(item => item !== value)
          : [...prev.mediaType, value]
        return { ...prev, [category]: updatedMediaType }
      }
      return { ...prev, [category]: value }
    })
  }

  const handleSubmit = () => {
    console.log('Submitted content type:', contentType)
    // Handle form submission here
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white font-sans p-8 flex items-center justify-center">
      <div className="max-w-4xl w-full mx-auto bg-gray-800 rounded-xl shadow-2xl p-8">
        <Link href="/" className="text-red-500 text-xl font-bold mb-8 block">MarketNow.io</Link>
        <h1 className="text-4xl font-bold mb-12 text-center bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-pink-500">
          What type of <span className="text-white">content</span> are you creating?
        </h1>

        <div className="space-y-12">
          {['style', 'platform', 'mediaType'].map((category) => (
            <div key={category} className="bg-gray-900 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4 text-red-400">
                {category === 'style' && "What's your style (select 1)?"}
                {category === 'platform' && "Choose your Platform (select 1)?"}
                {category === 'mediaType' && "Choose your media type? (Choose Multiple)"}
              </h2>
              <div className="flex flex-wrap justify-center gap-3">
                {category === 'style' && (
                  ['Minimalistic', 'Pop Art', 'Photorealistic', 'Animated'].map(style => (
                    <button
                      key={style}
                      onClick={() => handleSelection('style', style)}
                      className={`px-6 py-3 rounded-full transition-all ${
                        contentType.style === style
                          ? 'bg-red-500 text-white shadow-lg transform scale-105'
                          : 'bg-gray-700 hover:bg-gray-600 hover:shadow-md'
                      }`}
                    >
                      {style}
                    </button>
                  ))
                )}
                {category === 'platform' && (
                  ['Instagram Reel', 'Instagram Post', 'X Post', 'Tik Tok'].map(platform => (
                    <button
                      key={platform}
                      onClick={() => handleSelection('platform', platform)}
                      className={`px-6 py-3 rounded-full transition-all ${
                        contentType.platform === platform
                          ? 'bg-red-500 text-white shadow-lg transform scale-105'
                          : 'bg-gray-700 hover:bg-gray-600 hover:shadow-md'
                      }`}
                    >
                      {platform}
                    </button>
                  ))
                )}
                {category === 'mediaType' && (
                  ['Video', 'Image', 'Audio', 'Only Script'].map(media => (
                    <button
                      key={media}
                      onClick={() => handleSelection('mediaType', media)}
                      className={`px-6 py-3 rounded-full transition-all ${
                        contentType.mediaType.includes(media)
                          ? 'bg-red-500 text-white shadow-lg transform scale-105'
                          : 'bg-gray-700 hover:bg-gray-600 hover:shadow-md'
                      }`}
                    >
                      {media}
                    </button>
                  ))
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <button
            onClick={handleSubmit}
            className="px-10 py-4 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 rounded-full transition-all transform hover:scale-105 text-lg font-semibold shadow-lg"
          >
            Try Now
          </button>
        </div>
      </div>
    </div>
  )
}