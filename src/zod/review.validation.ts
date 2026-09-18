import { z } from "zod";

export const createReviewSchema = z.object({
    mediaId: z.string().min(1, "Movie ID is required"),
    rating: z
        .coerce
        .number()
        .int("Rating must be an integer")
        .min(1, "Rating must be at least 1 star")
        .max(5, "Rating cannot exceed 5 stars"),
    content: z
        .string()
        .min(5, "Review must be at least 5 characters")
        .max(1000, "Review must not exceed 1000 characters"),
    spoiler: z.boolean().optional().default(false),
    tagIds: z.array(z.string()).optional(),
});

export const updateReviewSchema = z.object({
    rating: z.coerce.number().int().min(1).max(5).optional(),
    content: z.string().min(5).max(1000).optional(),
    spoiler: z.boolean().optional(),
    tagIds: z.array(z.string()).optional(),
});

export const createCommentSchema = z.object({
    reviewId: z.string().min(1, "Review ID is required"),
    content: z
        .string()
        .min(1, "Comment cannot be empty")
        .max(500, "Comment must not exceed 500 characters"),
    parentId: z.string().optional(),
});

export const updateCommentSchema = z.object({
    content: z
        .string()
        .min(1, "Comment cannot be empty")
        .max(500, "Comment must not exceed 500 characters"),
});

export type ICreateReviewForm = z.infer<typeof createReviewSchema>;
export type IUpdateReviewForm = z.infer<typeof updateReviewSchema>;
export type ICreateCommentForm = z.infer<typeof createCommentSchema>;
export type IUpdateCommentForm = z.infer<typeof updateCommentSchema>;
