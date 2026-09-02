"use client"

import AppField from '@/components/shared/form/AppField';
import AppSubmitButton from '@/components/shared/form/AppSubmitButton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { changePasswordAction } from '@/src/app/(dashboardRoute)/(commonProtectedLayout)/change-password/_action';
import { IChangePasswordPayload, changePasswordSchema } from '@/src/zod/auth.validation';
import { useForm } from '@tanstack/react-form';
import { useMutation } from '@tanstack/react-query';
import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react'

export default function ChangePasswordForm() {
    const [serverError, setServerError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const { mutateAsync, isPending } = useMutation({
        mutationFn: (payload: IChangePasswordPayload) => changePasswordAction(payload),
    })

    const form = useForm({
        defaultValues: { currentPassword: "", newPassword: "", confirmPassword: "" },
        onSubmit: async ({ value }) => {
            setServerError(null);
            setSuccess(false);
            try {
                const result = await mutateAsync(value) as any;
                if (!result.success) {
                    setServerError(result.messsage || "Failed to change password");
                    return;
                }
                setSuccess(true);
                form.reset();
            } catch (error: any) {
                setServerError(`Failed to change password: ${error.message}`);
            }
        }
    })

    return (
        <Card className='w-full max-w-md mx-auto shadow-md'>
            <CardHeader>
                <CardTitle className='text-2xl font-bold'>Change password</CardTitle>
                <CardDescription>Update the password for your account.</CardDescription>
            </CardHeader>

            <CardContent>
                <form
                    method="POST"
                    action="#"
                    noValidate
                    onSubmit={(e) => { e.preventDefault(); e.stopPropagation(); form.handleSubmit(); }}
                >
                    <form.Field name="currentPassword" validators={{ onChange: changePasswordSchema.shape.currentPassword }}>
                        {(field) => (
                            <AppField
                                className="mb-4"
                                field={field}
                                label='Current password'
                                type={showCurrent ? "text" : "password"}
                                placeholder='Enter current password'
                                append={
                                    <Button onClick={() => setShowCurrent(v => !v)} variant="ghost" size="icon">
                                        {showCurrent ? <EyeOff className='size-4' /> : <Eye className='size-4' />}
                                    </Button>
                                }
                            />
                        )}
                    </form.Field>

                    <form.Field name="newPassword" validators={{ onChange: changePasswordSchema.shape.newPassword }}>
                        {(field) => (
                            <AppField
                                className="mb-4"
                                field={field}
                                label='New password'
                                type={showNew ? "text" : "password"}
                                placeholder='Enter new password'
                                append={
                                    <Button onClick={() => setShowNew(v => !v)} variant="ghost" size="icon">
                                        {showNew ? <EyeOff className='size-4' /> : <Eye className='size-4' />}
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
                                type={showConfirm ? "text" : "password"}
                                placeholder='Re-enter new password'
                                append={
                                    <Button onClick={() => setShowConfirm(v => !v)} variant="ghost" size="icon">
                                        {showConfirm ? <EyeOff className='size-4' /> : <Eye className='size-4' />}
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
                    {success && (
                        <Alert className="mb-4">
                            <AlertDescription>Password updated successfully.</AlertDescription>
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
        </Card>
    )
}