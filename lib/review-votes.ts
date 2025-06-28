import { supabase } from './supabase';

// Insert a new vote (upvote or downvote)
export async function insertReviewVote({ review_id, user_id, is_upvote }: { review_id: number, user_id: number, is_upvote: boolean }) {
  const { data, error } = await supabase
    .from('broker_review_votes')
    .insert([{ review_id, user_id, is_upvote }]);
  if (error) throw new Error(error.message);
  return data?.[0];
}

// Delete a vote by review_id and user_id
export async function deleteReviewVote({ review_id, user_id }: { review_id: number, user_id: number }) {
  const { error } = await supabase
    .from('broker_review_votes')
    .delete()
    .eq('review_id', review_id)
    .eq('user_id', user_id);
  if (error) throw new Error(error.message);
}

// Update a vote (change is_upvote)
export async function updateReviewVote({ review_id, user_id, is_upvote }: { review_id: number, user_id: number, is_upvote: boolean }) {
  const { error } = await supabase
    .from('broker_review_votes')
    .update({ is_upvote })
    .eq('review_id', review_id)
    .eq('user_id', user_id);
  if (error) throw new Error(error.message);
}

// Get current user's vote for a review
export async function getUserReviewVote({ review_id, user_id }: { review_id: number, user_id: number }) {
  const { data, error } = await supabase
    .from('broker_review_votes')
    .select('*')
    .eq('review_id', review_id)
    .eq('user_id', user_id)
    .single();
  if (error && error.code !== 'PGRST116') throw new Error(error.message); // Not found is OK
  return data;
}
