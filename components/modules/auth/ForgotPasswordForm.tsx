"use client"

import AppField from '@/components/shared/form/AppField';
import AppSubmitButton from '@/components/shared/form/AppSubmitButton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { forgotPasswordAction } from '@/src/app/(commonRoute)/forgot-password/_action';

import { IForgotPasswordPayload, forgotPasswordSchema } from '@/src/zod/auth.validation';
import { useForm } from '@tanstack/react-form';
import { useMutation } from '@tanstack/react-query';
import Link from 'next/link';
import { useState } from 'react'

export default function ForgotPasswordForm() {
    const [serverError, setServerError] = useState<string | null>(null);

    const { mutateAsync, isPending } = useMutation({
        mutationFn: (payload: IForgotPasswordPayload) => forgotPasswordAction(payload),
    })

    const form = useForm({
        defaultValues: { email: "" },
        onSubmit: async ({ value }) => {
            setServerError(null);
            try {
                const result = await mutateAsync(value) as any;
                if (!result.success) {
                    setServerError(result.messsage || "Failed to send reset code");
                    return;
                }
            } catch (error: any) {
                if (error?.digest?.startsWith?.("NEXT_REDIRECT")) throw error;
                setServerError(`Failed to send reset code: ${error.message}`);
            }
        }
    })

    return (
        <Card className='w-full max-w-md mx-auto shadow-md'>
            <CardHeader className='text-center'>
                <CardTitle className='text-2xl font-bold'>Reset your password</CardTitle>
                <CardDescription>Enter your email and we'll send you a reset code.</CardDescription>
            </CardHeader>

            <CardContent>
                <form
                    method="POST"
                    action="#"
                    noValidate
                    onSubmit={(e) => { e.preventDefault(); e.stopPropagation(); form.handleSubmit(); }}
                >
                    <form.Field name="email" validators={{ onChange: forgotPasswordSchema.shape.email }}>
                        {(field) => (
                            <AppField field={field} label="Email" type="email" placeholder='Enter your Email' className="mb-4" />
                        )}
                    </form.Field>

                    {serverError && (
                        <Alert variant="destructive" className="mb-4">
                            <AlertDescription>{serverError}</AlertDescription>
                        </Alert>
                    )}

                    <form.Subscribe selector={(s) => [s.canSubmit, s.isSubmitting] as const}>
                        {([canSubmit, isSubmitting]) => (
                            <AppSubmitButton isPending={isSubmitting || isPending} pendingLebel='Sending.....' disabled={!canSubmit}>
                                Send reset code
                            </AppSubmitButton>
                        )}
                    </form.Subscribe>
                </form>
            </CardContent>

            <CardFooter className='justify-center border-t'>
                <Link href="/login" className="text-sm text-primary hover:underline underline-offset-4">
                    Back to sign in
                </Link>
            </CardFooter>
        </Card>
    )
}