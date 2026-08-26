import { z } from "zod";

export const loginZodSchema = z.object({
    email: z.email({ message: "Invalid email address" }),
    password: z.string()
        .min(1, "password is required")
        .min(6, { message: "Password must be at least 6 characters long" })
    // .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
    // .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
    // .regex(/[0-9]/, { message: "Password must contain at least one number" })
    // .regex(/[@$!%*?&]/, { message: "Password must contain at least one special character(@, $, !, %, *, ?, &)" }),
})

export const registerZodSchema = z
    .object({
        name: z.string().min(2, "Name is too short"),
        email: z.string().email("Enter a valid email"),
        password: z.string().min(8, "Password must be at least 8 characters"),
        confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords don't match",
        path: ["confirmPassword"],
    });

export const verifyEmailZodSchema = z.object({
    otp: z.string().min(6, "Enter the 6-digit code").max(6, "Enter the 6-digit code"),
});

export type IVerifyEmailPayload = z.infer<typeof verifyEmailZodSchema> & {
    email: string;
};

export type IRegisterPayload = z.infer<typeof registerZodSchema>;

export type ILoginPayload = z.infer<typeof loginZodSchema>