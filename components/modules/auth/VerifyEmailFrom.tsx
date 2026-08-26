"use client"

import AppField from '@/components/shared/form/AppField';
import AppSubmitButton from '@/components/shared/form/AppSubmitButton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { verifyEmailAction } from '@/src/app/(commonRoute)/(auth)/verify-email/_action';
import { IVerifyEmailPayload, verifyEmailZodSchema } from '@/src/zod/auth.validation';
import { useForm } from '@tanstack/react-form';
import { useMutation } from '@tanstack/react-query';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useState } from 'react'

export default function VerifyEmailForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const email = searchParams.get("email") ?? "";

    const [serverError, setServerError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const { mutateAsync, isPending } = useMutation({
        mutationFn: (payload: IVerifyEmailPayload) => verifyEmailAction(payload),
    })

    const form = useForm({
        defaultValues: {
            otp: ""
        },
        onSubmit: async ({ value }) => {
            setServerError(null);
            try {
                const result = await mutateAsync({ ...value, email }) as any;

                if (!result.success) {
                    setServerError(result.message || "Verification failed");
                    return;
                }

                setSuccess(true);
                setTimeout(() => router.push("/login"), 2000);

            } catch (error: any) {
                console.log("VerifyEmailForm onSubmit error:", error.message);
                setServerError(`Verification failed: ${error.message}`);
            }
        }
    })

    if (success) {
        return (
            <Card className='w-full max-w-md mx-auto shadow-md'>
                <CardHeader className='text-center'>
                    <CardTitle className='text-2xl font-bold'>
                        Email verified
                    </CardTitle>
                    <CardDescription>
                        Redirecting you to sign in…
                    </CardDescription>
                </CardHeader>
            </Card>
        )
    }

    return (
        <Card className='w-full max-w-md mx-auto shadow-md'>
            <CardHeader className='text-center'>
                <CardTitle className='text-2xl font-bold'>
                    Verify your email
                </CardTitle>
                <CardDescription>
                    {email
                        ? <>Enter the code we sent to <span className='font-medium'>{email}</span></>
                        : "Enter the verification code we sent to your email"}
                </CardDescription>
            </CardHeader>

            <CardContent>
                <form
                    method="POST"
                    action="#"
                    noValidate
                    onSubmit={
                        (e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            form.handleSubmit();
                        }
                    }
                >
                    <form.Field
                        name="otp"
                        validators={{ onChange: verifyEmailZodSchema.shape.otp }}
                    >
                        {(field) => (
                            <AppField
                                field={field}
                                label="Verification code"
                                type="text"
                                placeholder='Enter 6-digit code'
                                className="mb-4"
                            />
                        )}
                    </form.Field>

                    {serverError && (
                        <Alert variant="destructive" className="mb-4">
                            <AlertDescription>
                                {serverError}
                            </AlertDescription>
                        </Alert>
                    )}

                    <form.Subscribe selector={(s) => [s.canSubmit, s.isSubmitting] as const}>
                        {
                            ([canSubmit, isSubmitting]) => (
                                <AppSubmitButton
                                    isPending={isSubmitting || isPending}
                                    pendingLebel='Verifying.....'
                                    disabled={!canSubmit}
                                >
                                    Verify Email
                                </AppSubmitButton>
                            )
                        }
                    </form.Subscribe>
                </form>
            </CardContent>

            <CardFooter className='justify-center border-t'>
                <p className='text-sm text-muted-foreground'>
                    Wrong email?{" "}
                    <Link href="/register" className="text-primary hover:underline focus:text-primary focus:underline underline-offset-4">
                        Go back
                    </Link>
                </p>
            </CardFooter>
        </Card>
    )
}