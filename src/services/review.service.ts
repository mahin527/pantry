import { connectDB } from "@/lib/db";
import { Review, Product } from "@/models";
import { success, error } from "@/lib/api-response";
import { MESSAGES } from "@/lib/messages";
import type { ApiResponse } from "@/types/common";

type ReviewResponse = {
  _id: string;
  user: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  comment: string;
  isVerifiedPurchase: boolean;
  helpfulCount: number;
  createdAt: string;
};

function toReviewResponse(review: Record<string, unknown>): ReviewResponse {
  return {
    _id: String(review._id),
    user: String(review.user),
    userName: review.userName as string,
    userAvatar: review.userAvatar as string | undefined,
    rating: review.rating as number,
    comment: review.comment as string,
    isVerifiedPurchase: review.isVerifiedPurchase as boolean,
    helpfulCount: review.helpfulCount as number,
    createdAt: (review.createdAt as Date).toISOString(),
  };
}

async function updateProductRating(productId: string): Promise<void> {
  const stats = await Review.aggregate([
    { $match: { product: productId as unknown as Record<string, unknown>["_id"], isApproved: true } },
    {
      $group: {
        _id: null,
        averageRating: { $avg: "$rating" },
        count: { $sum: 1 },
      },
    },
  ]);

  const rating = stats.length > 0 ? Math.round(stats[0].averageRating * 10) / 10 : 0;
  const reviewCount = stats.length > 0 ? stats[0].count : 0;

  await Product.findByIdAndUpdate(productId, { rating, reviewCount });
}

export const reviewService = {
  async getByProduct(productId: string): Promise<ApiResponse<ReviewResponse[]>> {
    await connectDB();

    const reviews = await Review.find({ product: productId, isApproved: true })
      .sort({ createdAt: -1 })
      .lean();

    return success(reviews.map(toReviewResponse), MESSAGES.SUCCESS);
  },

  async create(
    userId: string,
    userName: string,
    userAvatar: string,
    productId: string,
    rating: number,
    comment: string,
  ): Promise<ApiResponse<ReviewResponse>> {
    await connectDB();

    const product = await Product.findById(productId);
    if (!product) {
      return error(MESSAGES.PRODUCT_NOT_FOUND);
    }

    const existing = await Review.findOne({ user: userId, product: productId });
    if (existing) {
      return error("You have already reviewed this product");
    }

    if (rating < 1 || rating > 5) {
      return error("Rating must be between 1 and 5");
    }

    if (comment.length < 10) {
      return error("Comment must be at least 10 characters");
    }

    const review = await Review.create({
      user: userId,
      product: productId,
      userName,
      userAvatar,
      rating,
      comment,
      isVerifiedPurchase: false,
      helpfulCount: 0,
      isApproved: true,
    });

    await updateProductRating(productId);

    return success(toReviewResponse(review.toObject()), "Review submitted successfully");
  },

  async markHelpful(reviewId: string): Promise<ApiResponse<null>> {
    await connectDB();

    const review = await Review.findByIdAndUpdate(
      reviewId,
      { $inc: { helpfulCount: 1 } },
      { new: true },
    );

    if (!review) {
      return error("Review not found");
    }

    return success(null, "Marked as helpful");
  },
};