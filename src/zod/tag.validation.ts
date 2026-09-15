import { z } from "zod";

export const createTagSchema = z.object({
    name: z
        .string()
        .trim()
        .min(1, "Tag name is required")
        .max(50, "Tag name cannot exceed 50 characters"),
});

export const updateTagSchema = z.object({
    name: z
        .string()
        .trim()
        .min(1, "Tag name cannot be empty")
        .max(50, "Tag name cannot exceed 50 characters"),
});

export type ICreateTagForm = z.infer<typeof createTagSchema>;
export type IUpdateTagForm = z.infer<typeof updateTagSchema>;
