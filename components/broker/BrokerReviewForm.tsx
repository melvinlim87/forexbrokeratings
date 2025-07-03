"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Star } from "lucide-react";
import { saveBrokerReviews, Users } from "@/lib/supabase";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
interface BrokerReviewFormProps {
  brokerId: number;
  onReviewSubmitted: () => void;
  onRequireLogin?: () => void;
}

export default function BrokerReviewForm({ brokerId, onReviewSubmitted, onRequireLogin }: BrokerReviewFormProps) {
  const user = useSelector((state: RootState) => state.auth.user);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [rating, setRating] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    if (!user || !user.user_metadata.email_verified) {
      if (onRequireLogin) {
        onRequireLogin();
        return;
      }
      setError("You must be logged in to submit a review.");
      return;
    }
    if (!title || !content || rating < 1 || rating > 10) {
      setError("Please fill all fields and provide a rating between 1 and 10.");
      return;
    }
    setLoading(true);
    try {
      const userDetails = user as Users
      await saveBrokerReviews({
        broker_details_id: brokerId,
        user_id: userDetails.id,
        name: userDetails.name || userDetails.email,
        rating: rating.toString(),
        title,
        content,
        status: true,
        is_featured: false,
        created_at: new Date().toISOString(),
        comment_at: new Date().toISOString(),
      });
      setSuccess(true);
      setTitle("");
      setContent("");
      setRating(0);
      onReviewSubmitted();
    } catch (err: any) {
      setError(err.message || "Failed to submit review.");
    } finally {
      setLoading(false);
    }
  };

  // Helper to fetch user by email (since Redux only stores email)
  async function fetchUserByIdOrEmail(email: string) {
    try {
      // Try to fetch by email (Supabase function returns single user)
      const res = await fetch(`/api/user-by-email?email=${encodeURIComponent(email)}`);
      if (res.ok) {
        return await res.json();
      }
    } catch {}
    return null;
  }

  return (
    <Card className="mb-6 p-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium mb-1">Title</label>
          <input
            className="w-full border rounded px-3 py-2 bg-white dark:bg-gray-900 focus:outline-none focus:ring focus:border-blue-400"
            value={title}
            onChange={e => setTitle(e.target.value)}
            maxLength={100}
            required
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Content</label>
          <textarea
            className="w-full border rounded px-3 py-2 bg-white dark:bg-gray-900 focus:outline-none focus:ring focus:border-blue-400"
            value={content}
            onChange={e => setContent(e.target.value)}
            rows={4}
            maxLength={1000}
            required
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Rating</label>
          <div className="flex items-center gap-1">
            {[1,2,3,4,5,6,7,8,9,10].map(star => (
              <button
                type="button"
                key={star}
                className="focus:outline-none"
                onClick={() => setRating(star)}
                aria-label={`Rate ${star}`}
              >
                <Star
                  className={`h-6 w-6 ${star <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                  fill={star <= rating ? '#facc15' : 'none'}
                />
              </button>
            ))}
            <span className="ml-2 text-sm font-medium">{rating}/10</span>
          </div>
        </div>
        {error && <div className="text-red-500 text-sm">{error}</div>}
        {success && <div className="text-green-600 text-sm">Review submitted successfully!</div>}
        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Submitting..." : "Write your reviews now"}
        </Button>
      </form>
    </Card>
  );
}
