import { z } from "zod";

export const createMovieSchema = z.object({
    title: z
        .string()
        .min(1, "Title is required")
        .max(200, "Title is too long"),
    synopsis: z
        .string()
        .min(10, "Synopsis must be at least 10 characters"),
    releaseYear: z
        .coerce
        .number()
        .int("Release year must be an integer")
        .min(1888, "Invalid year")
        .max(new Date().getFullYear() + 5, "Year is too far in future"),
    director: z
        .string()
        .min(1, "Director name is required"),
    cast: z
        .array(z.string().min(1))
        .min(1, "At least one cast member is required"),
    duration: z
        .coerce
        .number()
        .int("Duration must be an integer")
        .min(1, "Duration must be at least 1 minute"),
    language: z
        .string()
        .min(1, "Language is required"),
    country: z
        .string()
        .min(1, "Country is required"),
    pricing: z
        .enum(["FREE", "PREMIUM"])
        .default("FREE"),
    youtubeLink: z
        .string()
        .url("Must be a valid URL")
        .optional()
        .or(z.literal("")),
    genreIds: z
        .array(z.string())
        .optional(),
    platformIds: z
        .array(z.string())
        .optional(),
    posterUrl: z
        .string()
        .optional(),
});

export const updateMovieSchema = createMovieSchema.partial();

export type ICreateMovieForm = z.infer<typeof createMovieSchema>;
export type IUpdateMovieForm = z.infer<typeof updateMovieSchema>;
