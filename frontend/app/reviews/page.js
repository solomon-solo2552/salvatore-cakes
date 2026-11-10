"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";
import { toast } from "sonner";
import EmptyState from "@/components/EmptyState";

export default function ReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [form, setForm] = useState({ rating: 5, title: "", comment: "" });
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchReviews = async () => {
    try {
      const res = await api.get("/reviews/");
      setReviews(res.data.results || res.data || []);
    } catch (err) {
      console.error("Error fetching reviews:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post("/reviews/", form);
      setForm({ rating: 5, title: "", comment: "" });
      fetchReviews();
      toast.success("Thank you! Your review has been published.");
    } catch (err) {
      toast.error("Failed to submit review. Make sure you are logged in.");
    } finally {
      setSubmitting(false);
    }
  };

  const renderStars = (rating) => {
    return "★".repeat(rating) + "☆".repeat(5 - rating);
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 space-y-12">
      <div className="text-center space-y-2">
        <h1 className="font-display text-4xl text-espresso">Customer Love & Reviews</h1>
        <p className="text-cocoa/70 text-sm">See what our community says about Salvatore Cakes or leave your own feedback.</p>
      </div>

      {/* SUBMISSION FORM */}
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-3xl border border-espresso/15 shadow-sm space-y-4">
        <h2 className="text-lg font-bold text-espresso">Leave a Review</h2>

        {/* Interactive Star Picker */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase text-cocoa/60">Rating:</span>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setForm({ ...form, rating: star })}
                className={`text-2xl transition ${star <= form.rating ? "text-amber-500 scale-110" : "text-stone-300"
                  }`}
              >
                ★
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase text-cocoa/60 mb-1">Headline</label>
          <input
            required
            type="text"
            placeholder="e.g. Best Tiramisu in town!"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border border-espresso/20 text-sm bg-stone-50"
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase text-cocoa/60 mb-1">Your Experience / Feedback</label>
          <textarea
            required
            rows={3}
            placeholder="Tell us about the texture, flavor, or delivery experience..."
            value={form.comment}
            onChange={(e) => setForm({ ...form, comment: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border border-espresso/20 text-sm bg-stone-50"
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="btn-primary px-6 py-3 text-xs uppercase tracking-wider font-bold"
        >
          {submitting ? "Posting..." : "Post Review"}
        </button>
      </form>

      {/* REVIEWS LIST */}
      <div className="space-y-4">
        <h2 className="text-2xl font-display text-espresso">All Feedback ({reviews.length})</h2>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-white p-6 rounded-3xl border border-espresso/15 space-y-3">
                <div className="h-4 w-24 bg-espresso/10 rounded animate-pulse" />
                <div className="h-5 w-3/4 bg-espresso/10 rounded animate-pulse" />
                <div className="h-3 w-full bg-espresso/10 rounded animate-pulse" />
                <div className="h-3 w-2/3 bg-espresso/10 rounded animate-pulse" />
              </div>
            ))}
          </div>
        ) : reviews.length === 0 ? (
          <EmptyState
            icon="⭐"
            title="No reviews yet"
            description="Be the first to share your experience with our cakes!"
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reviews.map((rev) => (
              <div key={rev.id} className="bg-white p-6 rounded-3xl border border-espresso/15 shadow-sm space-y-3 flex flex-col justify-between">
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-amber-500 tracking-wider text-lg">{renderStars(rev.rating)}</span>
                    <span className="text-[10px] text-cocoa/40">{new Date(rev.created_at).toLocaleDateString()}</span>
                  </div>
                  <h3 className="font-bold text-espresso text-base">{rev.title}</h3>
                  <p className="text-xs text-cocoa/70 italic">"{rev.comment}"</p>
                </div>

                <div className="pt-3 border-t border-espresso/10 text-xs font-semibold text-espresso/80">
                  — {rev.username}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}