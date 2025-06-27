export default function UserReviewsPage() {
  return (
    <div className="container mx-auto py-10">
      <div className="flex flex-col md:flex-row gap-8 mx-10">
        {/* Sidebar */}
        <aside className="w-full md:w-64 mb-6 md:mb-0">
          <nav className="rounded-2xl border border-border shadow-md flex flex-col gap-2 py-6 px-0 md:px-4">
            <a
              href="/profile"
              className="font-semibold text-lg px-6 py-3 rounded transition hover:bg-gray-50 dark:hover:bg-gray-50 text-black"
            >
              User Profile
            </a>
            <a
              href="/profile/reviews"
              className="font-semibold text-lg px-6 py-3 rounded transition text-black bg-gray-50 dark:bg-gray-100 ring-2 ring-gray-900/30"
            >
              Reviews
            </a>
          </nav>
        </aside>
        {/* Reviews Card */}
        <div className="flex-1">
          <div className="max-w-2xl rounded-2xl border border-border bg-transparent shadow-lg p-0 md:p-8 backdrop-blur-md">
            <div className="px-6 pt-8 pb-2">
              <h2 className="text-3xl font-extrabold mb-2 text-gray-900 dark:text-white tracking-tight">My Reviews</h2>
              <p className="text-gray-500 dark:text-gray-300 mb-6">See all your broker reviews and ratings here.</p>
            </div>
            <div className="flex items-center justify-center px-6 pb-16">
              <div className="text-gray-500 dark:text-gray-300 text-lg text-center py-16 w-full">No reviews yet.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
