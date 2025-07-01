"use client";
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { fetchReviewsByUserId } from '@/lib/supabase';
import Link from 'next/link';

function UserReviewsList() {
  const user = useSelector((state: RootState | any) => state.auth.user);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(10);
  const [error, setError] = useState<string|null>(null);

  useEffect(() => {
    if (!user?.id) return;
    setLoading(true);
    fetchReviewsByUserId(user.id)
      .then((data) => setReviews(data))
      .catch((e) => setError(e.message || 'Failed to fetch reviews'))
      .finally(() => setLoading(false));
  }, [user?.id]);

  if (!user?.id) {
    return <div className="text-gray-500 dark:text-gray-300 text-lg text-center py-16 w-full">Please log in to see your reviews.</div>;
  }
  if (loading) {
    return <div className="text-gray-500 dark:text-gray-300 text-lg text-center py-16 w-full">Loading reviews...</div>;
  }
  if (error) {
    return <div className="text-red-500 text-center py-8">{error}</div>;
  }
  if (!reviews.length) {
    return <div className="text-gray-500 dark:text-gray-300 text-lg text-center py-16 w-full">No reviews yet.</div>;
  }
  return (
    <div className="space-y-6 px-2 pb-8">
      {reviews.slice(0, visible).map((review) => (
        <div key={review.id} className="bg-white dark:bg-gray-900/80 rounded-lg shadow p-4 border border-gray-100 dark:border-gray-800">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-lg text-gray-800 dark:text-gray-100">{review.title}</span>
              <span className="text-xs text-gray-400 ml-2">{new Date(review.comment_at).toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-1 mt-2 md:mt-0">
              {[1,2,3,4,5,6,7,8,9,10].map(star => (
                <svg key={star} className={`h-4 w-4 ${parseFloat(review.rating) >= star ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20"><polygon points="9.9,1.1 7.6,6.6 1.5,7.6 6,11.9 4.9,18 9.9,14.9 14.9,18 13.8,11.9 18.3,7.6 12.2,6.6"/></svg>
              ))}
              <span className="ml-1 text-xs text-gray-500">{review.rating}</span>
            </div>
          </div>
          <div className="font-semibold text-md text-gray-700 dark:text-gray-200 mb-1">{review.content}</div>
          <div className="flex justify-end mt-2">
            <Link href={`/broker/${review.broker_details?.slug}`} className="text-blue-600 hover:underline px-3 py-1 rounded border border-blue-100 bg-blue-50 dark:bg-blue-900/20">View Broker</Link>
          </div>
        </div>
      ))}
      {visible < reviews.length && (
        <div className="flex justify-center mt-4">
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            onClick={() => setVisible(v => Math.min(v + 10, reviews.length))}
          >
            View More
          </button>
        </div>
      )}
    </div>
  );
}

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
          <div className="w-full rounded-2xl border border-border bg-transparent shadow-lg p-0 md:p-8 backdrop-blur-md">
            <div className="px-6 pt-8 pb-2">
              <h2 className="text-3xl font-extrabold mb-2 text-gray-900 dark:text-white tracking-tight">My Reviews</h2>
              <p className="text-gray-500 dark:text-gray-300 mb-6">See all your broker reviews and ratings here.</p>
            </div>
            <UserReviewsList />
          </div>
        </div>
      </div>
    </div>
  );
}
