import Link from 'next/link'
 
export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <h2 className="text-4xl font-bold mb-4">Not Found</h2>
      <p className="text-white/60 mb-8">Could not find requested resource</p>
      <Link 
        href="/"
        className="px-6 py-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
      >
        Return Home
      </Link>
    </div>
  )
}