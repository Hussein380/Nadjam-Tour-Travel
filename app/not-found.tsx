export default function NotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center px-6 bg-gray-50">
            <div className="text-center max-w-xl">
                <h1 className="text-4xl font-semibold mb-3">Page not found</h1>
                <p className="text-gray-600 mb-6">The page you’re looking for doesn’t exist or has been moved.</p>
                <a href="/" className="text-emerald-700 font-medium hover:underline">Go back home →</a>
            </div>
        </div>
    )
}


