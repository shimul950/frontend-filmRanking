import { z } from "zod";

export const createBannerSchema = z.object({
    title: z
        .string()
        .min(1, "Title is required")
        .max(120, "Title cannot exceed 120 characters"),
    synopsis: z.string().optional().or(z.literal("")),
    imageUrl: z
        .string()
        .min(1, "Banner image URL is required")
        .url("Please provide a valid image URL"),
    posterUrl: z.string().url("Please provide a valid poster URL").optional().or(z.literal("")),
    rating: z.coerce.number().min(0).max(5).optional(),
    releaseYear: z.coerce.number().int().min(1888).max(2100).optional(),
    duration: z.coerce.number().int().min(0).optional(),
    genre: z.string().optional().or(z.literal("")),
    pricing: z.enum(["FREE", "PREMIUM"]).default("FREE"),
    youtubeLink: z.string().url("Please provide a valid YouTube URL").optional().or(z.literal("")),
    director: z.string().optional().or(z.literal("")),
    linkUrl: z.string().optional().or(z.literal("")),
    isActive: z.boolean().default(true),
    order: z.coerce.number().int().default(0),
});

export const updateBannerSchema = z.object({
    title: z.string().min(1, "Title is required").max(120).optional(),
    synopsis: z.string().optional().or(z.literal("")),
    imageUrl: z.string().url("Please provide a valid image URL").optional().or(z.literal("")),
    posterUrl: z.string().url("Please provide a valid poster URL").optional().or(z.literal("")),
    rating: z.coerce.number().min(0).max(5).optional(),
    releaseYear: z.coerce.number().int().min(1888).max(2100).optional(),
    duration: z.coerce.number().int().min(0).optional(),
    genre: z.string().optional().or(z.literal("")),
    pricing: z.enum(["FREE", "PREMIUM"]).optional(),
    youtubeLink: z.string().url("Please provide a valid YouTube URL").optional().or(z.literal("")),
    director: z.string().optional().or(z.literal("")),
    linkUrl: z.string().optional().or(z.literal("")),
    isActive: z.boolean().optional(),
    order: z.coerce.number().int().optional(),
});

export type ICreateBannerForm = z.infer<typeof createBannerSchema>;
export type IUpdateBannerForm = z.infer<typeof updateBannerSchema>;
