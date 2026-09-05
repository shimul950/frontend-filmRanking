"use client"

import AppField from '@/components/shared/form/AppField';
import AppSubmitButton from '@/components/shared/form/AppSubmitButton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { updateProfileAction } from '@/src/app/(dashboardRoute)/(commonProtectedLayout)/myProfile/_action';
import { useForm } from '@tanstack/react-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { BadgeCheck, Calendar, KeyRound, Mail, Pencil, ShieldCheck, X } from 'lucide-react';
import Link from 'next/link';
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

    const memberSince = new Date(user.createdAt).toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    return (
        <div className="w-full max-w-4xl mx-auto space-y-6">
            {/* HERO CARD */}
            <Card className="shadow-md">
                <CardContent className="px-4 sm:px-8 py-8">
                    <div className="flex flex-col items-center sm:flex-row sm:items-center sm:gap-6">
                        <Avatar className="h-28 w-28 sm:h-32 sm:w-32 border-4 border-background shadow-lg shrink-0">
                            <AvatarImage
                                src={previewUrl ?? user.image ?? undefined}
                                alt={user.name}
                                className="object-cover"
                            />
                            <AvatarFallback className="text-3xl sm:text-4xl font-bold bg-zinc-800 text-white">
                                {user.name?.charAt(0).toUpperCase()}
                            </AvatarFallback>
                        </Avatar>

                        <div className="mt-4 sm:mt-0 text-center sm:text-left flex-1 min-w-0">
                            <h1 className="text-2xl sm:text-3xl font-bold truncate">{user.name}</h1>
                            <p className="text-sm sm:text-base text-muted-foreground truncate">{user.email}</p>

                            <div className="flex flex-wrap justify-center sm:justify-start gap-2 mt-3">
                                <Badge variant="secondary" className="gap-1">
                                    <ShieldCheck className="size-3" />
                                    {user.role}
                                </Badge>
                                <Badge variant={user.emailVerified ? "default" : "destructive"} className="gap-1">
                                    <BadgeCheck className="size-3" />
                                    {user.emailVerified ? "Verified" : "Unverified"}
                                </Badge>
                                <Badge variant="outline">{user.status}</Badge>
                            </div>
                        </div>

                        {!isEditing && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setIsEditing(true)}
                                className="mt-4 sm:mt-0 gap-2 shrink-0"
                            >
                                <Pencil className="size-4" />
                                <span className="hidden sm:inline">Edit profile</span>
                            </Button>
                        )}
                    </div>

                    {success && !isEditing && (
                        <Alert className="mt-6">
                            <AlertDescription>Profile updated successfully.</AlertDescription>
                        </Alert>
                    )}

                    {isEditing && (
                        <>
                            <Separator className="my-6" />
                            <form
                                method="POST"
                                action="#"
                                noValidate
                                onSubmit={(e) => { e.preventDefault(); e.stopPropagation(); form.handleSubmit(); }}
                                className="max-w-md mx-auto sm:mx-0"
                            >
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <form.Field name="name">
                                        {(field) => (
                                            <AppField field={field} label="Name" type="text" placeholder='Your name' className="sm:col-span-2" />
                                        )}
                                    </form.Field>

                                    <form.Field name="image">
                                        {(field) => (
                                            <div className="space-y-1.5 sm:col-span-2">
                                                <label className="text-sm font-medium">Avatar</label>
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={(e) => {
                                                        const file = e.target.files?.[0];
                                                        field.handleChange(file);
                                                        if (file) setPreviewUrl(URL.createObjectURL(file));
                                                    }}
                                                    className="block w-full text-sm file:mr-4 file:rounded-md file:border-0 file:bg-primary file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-primary-foreground cursor-pointer"
                                                />
                                            </div>
                                        )}
                                    </form.Field>
                                </div>

                                {serverError && (
                                    <Alert variant="destructive" className="mt-4">
                                        <AlertDescription>{serverError}</AlertDescription>
                                    </Alert>
                                )}

                                <div className="flex gap-2 mt-4">
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
                                        <X className="size-4 mr-1" /> Cancel
                                    </Button>
                                </div>
                            </form>
                        </>
                    )}
                </CardContent>
            </Card>

            {/* INFO GRID */}
            {!isEditing && (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <Card className="shadow-sm">
                        <CardContent className="flex items-center gap-3 py-5">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-red-600/10 text-red-600">
                                <Mail className="size-5" />
                            </div>
                            <div className="min-w-0">
                                <p className="text-xs text-muted-foreground">Email</p>
                                <p className="text-sm font-medium truncate">{user.email}</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="shadow-sm">
                        <CardContent className="flex items-center gap-3 py-5">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-red-600/10 text-red-600">
                                <Calendar className="size-5" />
                            </div>
                            <div className="min-w-0">
                                <p className="text-xs text-muted-foreground">Member since</p>
                                <p className="text-sm font-medium">{memberSince}</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="shadow-sm">
                        <CardContent className="flex items-center justify-between gap-3 py-5">
                            <div className="flex items-center gap-3 min-w-0">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-red-600/10 text-red-600">
                                    <KeyRound className="size-5" />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-xs text-muted-foreground">Security</p>
                                    <p className="text-sm font-medium">Password</p>
                                </div>
                            </div>
                            <Button asChild variant="ghost" size="sm">
                                <Link href="/change-password">Change</Link>
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    )
}