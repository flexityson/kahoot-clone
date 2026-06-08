export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-purple-900 flex items-center justify-center">
      <div className="text-center text-white">
        <h1 className="text-6xl font-bold mb-4">404</h1>
        <p className="text-2xl mb-6">Page not found</p>
        <a href="/" className="text-purple-200 underline">Go Home</a>
      </div>
    </div>
  )
}