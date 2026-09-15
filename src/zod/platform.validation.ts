import { z } from "zod";

export const createPlatformSchema = z.object({
    name: z
        .string()
        .trim()
        .min(1, "Platform name is required")
        .max(50, "Platform name cannot exceed 50 characters"),
});

export const updatePlatformSchema = z.object({
    name: z
        .string()
        .trim()
        .min(1, "Platform name cannot be empty")
        .max(50, "Platform name cannot exceed 50 characters"),
});

export type ICreatePlatformForm = z.infer<typeof createPlatformSchema>;
export type IUpdatePlatformForm = z.infer<typeof updatePlatformSchema>;
