import { z } from "zod";

export const createGenreSchema = z.object({
    name: z
        .string()
        .trim()
        .min(1, "Genre name is required")
        .max(50, "Genre name cannot exceed 50 characters"),
});

export const updateGenreSchema = z.object({
    name: z
        .string()
        .trim()
        .min(1, "Genre name is required")
        .max(50, "Genre name cannot exceed 50 characters"),
});

export type ICreateGenreForm = z.infer<typeof createGenreSchema>;
export type IUpdateGenreForm = z.infer<typeof updateGenreSchema>;
