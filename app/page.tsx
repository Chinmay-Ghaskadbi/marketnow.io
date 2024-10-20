import Link from 'next/link'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-8">Welcome to MarketNow.io</h1>
      <div className="flex gap-4">
        <Link href="/landing" className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors">
          Landing Page
        </Link>
        <Link href="/idea-prompt" className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors">
          Idea Prompt
        </Link>
        <Link href="/content-type" className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors">
          Content Type
        </Link>
      </div>
    </main>
  )
}