"use client"

import AppField from '@/components/shared/form/AppField';
import AppSubmitButton from '@/components/shared/form/AppSubmitButton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { createAdminAction } from '@/src/app/(dashboardRoute)/admin/dashboard/admin-management/_action/createAdmin.action';
import { createAdminSchema, ICreateAdminForm } from '@/src/zod/auth.validation';
import { useForm } from '@tanstack/react-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Eye, EyeOff, UserPlus } from 'lucide-react';
import { useState } from 'react'

export default function CreateAdminDialog({ defaultOpen = false }: { defaultOpen?: boolean }) {
    const queryClient = useQueryClient();
    const [open, setOpen] = useState(defaultOpen);
    const [serverError, setServerError] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);

    const { mutateAsync, isPending } = useMutation({
        mutationFn: (payload: ICreateAdminForm) => createAdminAction(payload),
    })

    const form = useForm({
        defaultValues: {
            password: "",
            name: "",
            email: "",
            image: "",
            contactNumber: "",
        },
        onSubmit: async ({ value }) => {
            setServerError(null);
            try {
                const result = await mutateAsync(value) as any;
                if (!result.success) {
                    setServerError(result.messsage || "Failed to create admin");
                    return;
                }
                setOpen(false);
                form.reset();
                queryClient.invalidateQueries({ queryKey: ["admins"] });
            } catch (error: any) {
                setServerError(`Failed to create admin: ${error.message}`);
            }
        }
    })

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="gap-2">
                    <UserPlus className="size-4" />
                    Create Admin
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Create a new admin</DialogTitle>
                    <DialogDescription>
                        This creates a login account with ADMIN privileges.
                    </DialogDescription>
                </DialogHeader>

                <form
                    method="POST"
                    action="#"
                    noValidate
                    onSubmit={(e) => { e.preventDefault(); e.stopPropagation(); form.handleSubmit(); }}
                >
                    <div className="space-y-4">
                        <form.Field name="name" validators={{ onChange: createAdminSchema.shape.name }}>
                            {(field) => (
                                <AppField field={field} label="Name" type="text" placeholder="Admin's name" />
                            )}
                        </form.Field>

                        <form.Field name="email" validators={{ onChange: createAdminSchema.shape.email }}>
                            {(field) => (
                                <AppField field={field} label="Email" type="email" placeholder="admin@example.com" />
                            )}
                        </form.Field>

                        <form.Field name="contactNumber" validators={{ onChange: createAdminSchema.shape.contactNumber }}>
                            {(field) => (
                                <AppField field={field} label="Contact number" type="text" placeholder="+880..." />
                            )}
                        </form.Field>

                        <form.Field name="image">
                            {(field) => (
                                <AppField field={field} label="Avatar URL (optional)" type="text" placeholder="https://..." />
                            )}
                        </form.Field>

                        <form.Field name="password" validators={{ onChange: createAdminSchema.shape.password }}>
                            {(field) => (
                                <AppField
                                    field={field}
                                    label="Temporary password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Set an initial password"
                                    append={
                                        <Button onClick={() => setShowPassword(v => !v)} variant="ghost" size="icon" type="button">
                                            {showPassword ? <EyeOff className='size-4' /> : <Eye className='size-4' />}
                                        </Button>
                                    }
                                />
                            )}
                        </form.Field>
                    </div>

                    {serverError && (
                        <Alert variant="destructive" className="mt-4">
                            <AlertDescription>{serverError}</AlertDescription>
                        </Alert>
                    )}

                    <DialogFooter className="mt-6">
                        <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                            Cancel
                        </Button>
                        <form.Subscribe selector={(s) => [s.canSubmit, s.isSubmitting] as const}>
                            {([canSubmit, isSubmitting]) => (
                                <AppSubmitButton isPending={isSubmitting || isPending} pendingLebel='Creating.....' disabled={!canSubmit}>
                                    Create admin
                                </AppSubmitButton>
                            )}
                        </form.Subscribe>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}   