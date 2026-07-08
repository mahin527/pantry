"use client"

import { useState, useEffect } from "react"
import Rating from "@mui/material/Rating"
import TextareaAutosize from "@mui/material/TextareaAutosize"
import { Button, CircularProgress } from "@mui/material"
import { toast } from "sonner"

type Review = {
  _id: string
  userName: string
  userAvatar?: string
  rating: number
  comment: string
  isVerifiedPurchase: boolean
  helpfulCount: number
  createdAt: string
}

function ProductReviews({ productId }: { productId: string }) {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [comment, setComment] = useState("")
  const [rating, setRating] = useState<number | null>(5)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/reviews?productId=${productId}`)
        const json = await res.json()
        if (json.success && json.data) setReviews(json.data)
      } catch {
        // ignore
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [productId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!rating || !comment.trim()) return
    if (comment.trim().length < 10) {
      toast.error("Comment must be at least 10 characters")
      return
    }

    setSubmitting(true)
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ productId, rating, comment: comment.trim() }),
      })
      const json = await res.json()
      if (json.success) {
        toast.success("Review submitted!")
        setComment("")
        setRating(5)
        // Reload reviews
        const refreshed = await fetch(`/api/reviews?productId=${productId}`)
        const refreshedJson = await refreshed.json()
        if (refreshedJson.success && refreshedJson.data) setReviews(refreshedJson.data)
      } else {
        toast.error(json.message || "Failed to submit review")
      }
    } catch {
      toast.error("Failed to submit review")
    } finally {
      setSubmitting(false)
    }
  }

  const handleHelpful = async (reviewId: string) => {
    try {
      await fetch(`/api/reviews/${reviewId}`, { method: "PATCH" })
      setReviews((prev) =>
        prev.map((r) =>
          r._id === reviewId ? { ...r, helpfulCount: r.helpfulCount + 1 } : r,
        ),
      )
    } catch {
      // ignore
    }
  }

  const formatDate = (iso: string) => {
    return new Date(iso).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <section className="pt-2 w-full md:w-[70%]">
      <div className="space-y-5">
        <h3 className="text-xl lg:text-2xl font-bold text-blue-500">
          Reviews ({reviews.length})
        </h3>

        {loading ? (
          <div className="flex justify-center py-8">
            <CircularProgress />
          </div>
        ) : reviews.length === 0 ? (
          <p className="text-gray-500 text-sm">No reviews yet. Be the first to review!</p>
        ) : (
          reviews.map((review) => (
            <div key={review._id} className="py-2">
              <div className="flex items-center gap-4 w-full">
                {review.userAvatar ? (
                  <img
                    src={review.userAvatar}
                    alt={review.userName}
                    className="size-14 lg:size-16 rounded-full object-cover shrink-0"
                  />
                ) : (
                  <div className="size-14 lg:size-16 rounded-full bg-blue-500 text-white flex items-center justify-center text-xl font-bold shrink-0">
                    {review.userName?.charAt(0)?.toUpperCase() || "U"}
                  </div>
                )}
                <div className="flex justify-between w-full">
                  <div>
                    <h6 className="font-bold text-gray-700">{review.userName}</h6>
                    <p className="text-xs lg:text-sm text-gray-500">{formatDate(review.createdAt)}</p>
                  </div>
                  <Rating value={review.rating} size="small" readOnly />
                </div>
              </div>
              <div className="px-6 py-2">
                <p className="text-xs lg:text-sm text-gray-600 tracking-wider leading-6 text-justify">
                  {review.comment}
                </p>
                <div className="flex items-center gap-3 mt-2">
                  {review.isVerifiedPurchase && (
                    <span className="text-xs text-green-600 font-medium">✓ Verified Purchase</span>
                  )}
                  <button
                    onClick={() => handleHelpful(review._id)}
                    className="text-xs text-gray-500 hover:text-blue-600 transition-colors"
                  >
                    Helpful ({review.helpfulCount})
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="py-3">
        <div className="pb-4 pt-1">
          <h5 className="text-base font-medium text-gray-700">Add a review</h5>
        </div>
        <form className="space-y-3" onSubmit={handleSubmit}>
          <TextareaAutosize
            aria-label="add-a-review"
            id="add-a-review"
            minRows={5}
            placeholder="Share your experience with this product (quality, freshness, taste, etc.)"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="text-xs lg:text-sm bg-gray-100 w-full max-w-sm sm:max-w-md lg:max-w-lg xl:w-200 outline-none border border-gray-200 px-2 py-2 rounded-md text-gray-700! tracking-widest! leading-5 lg:leading-7!"
          />
          <div className="flex items-center gap-2">
            <Rating
              value={rating}
              onChange={(_e, val) => setRating(val)}
            />
          </div>
          <Button
            variant="contained"
            className="font-bold!"
            type="submit"
            disabled={submitting}
          >
            {submitting ? "Submitting..." : "Submit Review"}
          </Button>
        </form>
      </div>
    </section>
  )
}

export default ProductReviews