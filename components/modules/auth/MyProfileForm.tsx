"use client"

import AppField from '@/components/shared/form/AppField';
import AppSubmitButton from '@/components/shared/form/AppSubmitButton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { updateProfileAction } from '@/src/app/(dashboardRoute)/(commonProtectedLayout)/myProfile/_action';
import { useForm } from '@tanstack/react-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Pencil, X } from 'lucide-react';
import { useState } from 'react'

interface IProfileUser {
    id: string;
    name: string;
    email: string;
    role: string;
    image?: string | null;
    status: string;
    emailVerified: boolean;
    createdAt: string | Date;
}

export default function MyProfileForm({ user }: { user: IProfileUser }) {
    const queryClient = useQueryClient();
    const [isEditing, setIsEditing] = useState(false);
    const [serverError, setServerError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const { mutateAsync, isPending } = useMutation({
        mutationFn: (payload: { name: string; image?: File }) => updateProfileAction(payload),
    })

    const form = useForm({
        defaultValues: {
            name: user.name,
            image: undefined as File | undefined,
        },
        onSubmit: async ({ value }) => {
            setServerError(null);
            setSuccess(false);
            try {
                const result = await mutateAsync(value) as any;
                if (!result.success) {
                    setServerError(result.messsage || "Failed to update profile");
                    return;
                }
                setSuccess(true);
                setIsEditing(false);
                setPreviewUrl(null);
                queryClient.invalidateQueries({ queryKey: ["me"] });
            } catch (error: any) {
                setServerError(`Failed to update profile: ${error.message}`);
            }
        }
    })

    return (
        <Card className='w-full max-w-lg mx-auto shadow-md'>
            <CardHeader className='flex flex-row items-start justify-between'>
                <div>
                    <CardTitle className='text-2xl font-bold'>My Profile</CardTitle>
                    <CardDescription>View and manage your account information.</CardDescription>
                </div>
                {!isEditing && (
                    <Button variant="outline" size="icon" onClick={() => setIsEditing(true)}>
                        <Pencil className='size-4' />
                    </Button>
                )}
            </CardHeader>

            <CardContent>
                <div className='flex items-center gap-4 mb-6'>
                    <Avatar className='h-16 w-16'>
                        <AvatarImage src={previewUrl ?? user.image ?? undefined} alt={user.name} />
                        <AvatarFallback className='text-lg'>
                            {user.name?.charAt(0).toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                    <div>
                        <p className='font-semibold'>{user.name}</p>
                        <p className='text-sm text-muted-foreground'>{user.email}</p>
                        <div className='flex gap-2 mt-1'>
                            <Badge variant="secondary">{user.role}</Badge>
                            <Badge variant={user.emailVerified ? "default" : "destructive"}>
                                {user.emailVerified ? "Verified" : "Unverified"}
                            </Badge>
                        </div>
                    </div>
                </div>

                {isEditing ? (
                    <form
                        method="POST"
                        action="#"
                        noValidate
                        onSubmit={(e) => { e.preventDefault(); e.stopPropagation(); form.handleSubmit(); }}
                    >
                        <form.Field name="name">
                            {(field) => (
                                <AppField field={field} label="Name" type="text" placeholder='Your name' className="mb-4" />
                            )}
                        </form.Field>

                        <form.Field name="image">
                            {(field) => (
                                <div className='space-y-1.5 mb-4'>
                                    <label className='text-sm font-medium'>Avatar</label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            field.handleChange(file);
                                            if (file) {
                                                setPreviewUrl(URL.createObjectURL(file));
                                            }
                                        }}
                                        className="block w-full text-sm file:mr-4 file:rounded-md file:border-0 file:bg-primary file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-primary-foreground"
                                    />
                                </div>
                            )}
                        </form.Field>

                        {serverError && (
                            <Alert variant="destructive" className="mb-4">
                                <AlertDescription>{serverError}</AlertDescription>
                            </Alert>
                        )}

                        <div className='flex gap-2'>
                            <form.Subscribe selector={(s) => [s.canSubmit, s.isSubmitting] as const}>
                                {([canSubmit, isSubmitting]) => (
                                    <AppSubmitButton isPending={isSubmitting || isPending} pendingLebel='Saving.....' disabled={!canSubmit}>
                                        Save changes
                                    </AppSubmitButton>
                                )}
                            </form.Subscribe>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => { setIsEditing(false); setServerError(null); setPreviewUrl(null); form.reset(); }}
                            >
                                <X className='size-4 mr-1' /> Cancel
                            </Button>
                        </div>
                    </form>
                ) : (
                    <>
                        {success && (
                            <Alert className="mb-4">
                                <AlertDescription>Profile updated successfully.</AlertDescription>
                            </Alert>
                        )}
                        <div className='text-sm text-muted-foreground'>
                            Member since {new Date(user.createdAt).toLocaleDateString()}
                        </div>
                    </>
                )}
            </CardContent>
        </Card>
    )
}