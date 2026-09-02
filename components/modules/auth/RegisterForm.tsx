"use client"

import AppField from '@/components/shared/form/AppField';
import AppSubmitButton from '@/components/shared/form/AppSubmitButton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { registerAction } from '@/src/app/(commonRoute)/(auth)/register/_action';

import { IRegisterPayload, registerZodSchema } from '@/src/zod/auth.validation';
import { useForm } from '@tanstack/react-form';
import { useMutation } from '@tanstack/react-query';
import { Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import React, { useState } from 'react'

export default function RegisterForm() {
    const [serverError, setServerError] = useState<string | null>(null);

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const { mutateAsync, isPending } = useMutation({
        mutationFn: (payload: IRegisterPayload) => registerAction(payload),
    })

    const form = useForm({
        defaultValues: {
            name: "",
            email: "",
            password: "",
            confirmPassword: ""
        },
        onSubmit: async ({ value }) => {
            setServerError(null);
            try {
                const result = await mutateAsync(value) as any;

                if (!result.success) {
                    setServerError(result.messsage || "Registration failed");
                    return;
                }

            } catch (error: any) {
                if (
                    error &&
                    typeof error === 'object' &&
                    'digest' in error &&
                    typeof error.digest === 'string' &&
                    error.digest.startsWith("NEXT_REDIRECT")
                ) {
                    throw error;
                }
                console.log("RegisterForm onSubmit error:", error.message);
                setServerError(`Registration failed: ${error.message}`);
            }
        }
    })

    return (
        <Card className='w-full max-w-md mx-auto shadow-md my-10'>
            <CardHeader className='text-center'>
                <CardTitle className='text-2xl font-bold'>
                    Create your account
                </CardTitle>
                <CardDescription>
                    Sign up to start rating and reviewing films.
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
                        name="name"
                        validators={{ onChange: registerZodSchema.shape.name }}
                    >
                        {(field) => (
                            <AppField
                                field={field}
                                label="Name"
                                type="text"
                                placeholder='Enter your name'
                                className="mb-4"
                            />
                        )}
                    </form.Field>

                    <form.Field
                        name="email"
                        validators={{ onChange: registerZodSchema.shape.email }}
                    >
                        {(field) => (
                            <AppField
                                field={field}
                                label="Email"
                                type="email"
                                placeholder='Enter your Email'
                                className="mb-4"
                            />
                        )}
                    </form.Field>

                    <form.Field
                        name="password"
                        validators={{ onChange: registerZodSchema.shape.password }}
                    >
                        {(field) => (
                            <AppField
                                className="mb-4"
                                field={field}
                                label='Password'
                                type={showPassword ? "text" : "password"}
                                placeholder='Create a password'
                                aria-label={
                                    showPassword ? "Hide password" : "Show password"
                                }
                                append={
                                    <Button
                                        onClick={() => setShowPassword((value) => !value)}
                                        variant="ghost"
                                        size="icon"
                                    >
                                        {showPassword ? <EyeOff className='size-4' aria-hidden="true" /> : <Eye className='size-4' aria-hidden="true" />}
                                    </Button>
                                }
                            />
                        )}
                    </form.Field>

                    <form.Field
                        name="confirmPassword"
                        validators={{
                            onChangeListenTo: ['password'],
                            onChange: ({ value, fieldApi }) =>
                                value !== fieldApi.form.getFieldValue('password')
                                    ? "Passwords don't match"
                                    : undefined,
                        }}
                    >
                        {(field) => (
                            <AppField
                                className="mb-4"
                                field={field}
                                label='Confirm Password'
                                type={showConfirmPassword ? "text" : "password"}
                                placeholder='Re-enter your password'
                                aria-label={
                                    showConfirmPassword ? "Hide password" : "Show password"
                                }
                                append={
                                    <Button
                                        onClick={() => setShowConfirmPassword((value) => !value)}
                                        variant="ghost"
                                        size="icon"
                                    >
                                        {showConfirmPassword ? <EyeOff className='size-4' aria-hidden="true" /> : <Eye className='size-4' aria-hidden="true" />}
                                    </Button>
                                }
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
                                    pendingLebel='Creating account.....'
                                    disabled={!canSubmit}
                                >
                                    Sign Up
                                </AppSubmitButton>
                            )
                        }
                    </form.Subscribe>
                </form>

                <div className='relative my-6'>
                    <div className='absolute inset-0 flex items-center'>
                        <div className='w-full border-t border-gray-300'></div>
                    </div>
                    <div className='relative flex justify-center text-sm'>
                        <span className='bg-white px-2 text-gray-900'>
                            Or continue with
                        </span>
                    </div>
                </div>

                <Button
                    variant='outline'
                    className='w-full'
                    onClick={() => {
                        const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL
                        window.location.href = `${baseUrl}/auth/login/google`
                    }}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100" height="100" viewBox="0 0 48 48">
                        <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path><path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path><path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path><path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
                    </svg>
                    Sign up with Google
                </Button>
            </CardContent>

            <CardFooter className='justify-center border-t'>
                <p className='text-sm text-muted-foreground'>
                    Already have an account?{" "}
                    <Link href="/login" className="text-primary hover:underline focus:text-primary focus:underline underline-offset-4">
                        Log in
                    </Link>
                </p>
            </CardFooter>
        </Card>
    )
}