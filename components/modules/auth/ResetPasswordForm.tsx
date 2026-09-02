"use client"

import AppField from '@/components/shared/form/AppField';
import AppSubmitButton from '@/components/shared/form/AppSubmitButton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { resetPasswordAction } from '@/src/app/(commonRoute)/reset-password/_action';

import { IResetPasswordPayload, resetPasswordSchema } from '@/src/zod/auth.validation';
import { useForm } from '@tanstack/react-form';
import { useMutation } from '@tanstack/react-query';
import { Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react'

export default function ResetPasswordForm() {
    const searchParams = useSearchParams();
    const email = searchParams.get("email") ?? "";

    const [serverError, setServerError] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const { mutateAsync, isPending } = useMutation({
        mutationFn: (payload: IResetPasswordPayload & { email: string }) => resetPasswordAction(payload),
    })

    const form = useForm({
        defaultValues: { otp: "", newPassword: "", confirmPassword: "" },
        onSubmit: async ({ value }) => {
            setServerError(null);
            if (!email) {
                setServerError("Missing email — go back and request a new code.");
                return;
            }
            try {
                const result = await mutateAsync({ ...value, email }) as any;
                if (!result.success) {
                    setServerError(result.messsage || "Reset failed");
                    return;
                }
            } catch (error: any) {
                if (error?.digest?.startsWith?.("NEXT_REDIRECT")) throw error;
                setServerError(`Reset failed: ${error.message}`);
            }
        }
    })

    return (
        <Card className='w-full max-w-md mx-auto shadow-md'>
            <CardHeader className='text-center'>
                <CardTitle className='text-2xl font-bold'>Set a new password</CardTitle>
                <CardDescription>
                    {email ? <>Enter the code sent to <span className='font-medium'>{email}</span></> : "Enter the code sent to your email"}
                </CardDescription>
            </CardHeader>

            <CardContent>
                <form
                    method="POST"
                    action="#"
                    noValidate
                    onSubmit={(e) => { e.preventDefault(); e.stopPropagation(); form.handleSubmit(); }}
                >
                    <form.Field name="otp" validators={{ onChange: resetPasswordSchema.shape.otp }}>
                        {(field) => (
                            <AppField field={field} label="Reset code" type="text" placeholder='Enter 6-digit code' className="mb-4"  />
                        )}
                    </form.Field>

                    <form.Field name="newPassword" validators={{ onChange: resetPasswordSchema.shape.newPassword }}>
                        {(field) => (
                            <AppField
                                className="mb-4"
                                field={field}
                                label='New password'
                                type={showPassword ? "text" : "password"}
                                placeholder='Enter new password'
                                append={
                                    <Button onClick={() => setShowPassword(v => !v)} variant="ghost" size="icon">
                                        {showPassword ? <EyeOff className='size-4' /> : <Eye className='size-4' />}
                                    </Button>
                                }
                            />
                        )}
                    </form.Field>

                    <form.Field
                        name="confirmPassword"
                        validators={{
                            onChangeListenTo: ['newPassword'],
                            onChange: ({ value, fieldApi }) =>
                                value !== fieldApi.form.getFieldValue('newPassword') ? "Passwords don't match" : undefined,
                        }}
                    >
                        {(field) => (
                            <AppField
                                className="mb-4"
                                field={field}
                                label='Confirm new password'
                                type={showConfirmPassword ? "text" : "password"}
                                placeholder='Re-enter new password'
                                append={
                                    <Button onClick={() => setShowConfirmPassword(v => !v)} variant="ghost" size="icon">
                                        {showConfirmPassword ? <EyeOff className='size-4' /> : <Eye className='size-4' />}
                                    </Button>
                                }
                            />
                        )}
                    </form.Field>

                    {serverError && (
                        <Alert variant="destructive" className="mb-4">
                            <AlertDescription>{serverError}</AlertDescription>
                        </Alert>
                    )}

                    <form.Subscribe selector={(s) => [s.canSubmit, s.isSubmitting] as const}>
                        {([canSubmit, isSubmitting]) => (
                            <AppSubmitButton isPending={isSubmitting || isPending} pendingLebel='Updating.....' disabled={!canSubmit}>
                                Update password
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