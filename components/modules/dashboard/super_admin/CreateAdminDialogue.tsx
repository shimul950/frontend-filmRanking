"use client";

import AppField from "@/components/shared/form/AppField";
import AppSubmitButton from "@/components/shared/form/AppSubmitButton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { createAdminAction } from "@/src/app/(dashboardRoute)/admin/dashboard/admin-management/_action/createAdmin.action";
import { createAdminSchema, ICreateAdminForm } from "@/src/zod/auth.validation";
import { useForm } from "@tanstack/react-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Eye, EyeOff, Shield, UserPlus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function CreateAdminDialog() {
    const queryClient = useQueryClient();
    const [open, setOpen] = useState(false);
    const [serverError, setServerError] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);

    const { mutateAsync, isPending } = useMutation({
        mutationFn: (payload: ICreateAdminForm) => createAdminAction(payload),
    });

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
                const result = await mutateAsync(value);
                if (!result.success) {
                    setServerError(result.messsage || "Failed to create admin");
                    return;
                }
                toast.success(`Admin "${value.name}" created successfully!`);
                setOpen(false);
                form.reset();
                queryClient.invalidateQueries({ queryKey: ["admins"] });
            } catch (error: unknown) {
                const message = error instanceof Error ? error.message : "Failed to create admin";
                setServerError(`Failed to create admin: ${message}`);
            }
        },
    });

    return (
        <Dialog
            open={open}
            onOpenChange={(val) => {
                setOpen(val);
                if (!val) {
                    setServerError(null);
                    form.reset();
                }
            }}
        >
            <DialogTrigger asChild>
                <Button className="gap-2 shadow-lg shadow-amber-500/15 bg-amber-600 hover:bg-amber-700 text-white font-medium rounded-xl h-10 px-4 cursor-pointer">
                    <UserPlus className="h-4 w-4" />
                    <span>Add Administrator</span>
                </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-md rounded-2xl p-6">
                <DialogHeader className="space-y-1">
                    <div className="flex items-center gap-2 text-amber-500">
                        <Shield className="h-5 w-5" />
                        <span className="text-xs font-bold uppercase tracking-wider">
                            Privileged Staff
                        </span>
                    </div>
                    <DialogTitle className="text-xl font-bold">Create New Administrator</DialogTitle>
                    <DialogDescription className="text-muted-foreground text-sm">
                        Create an account with elevated ADMIN management privileges.
                    </DialogDescription>
                </DialogHeader>

                <form
                    method="POST"
                    action="#"
                    noValidate
                    onSubmit={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        form.handleSubmit();
                    }}
                    className="space-y-4 pt-2"
                >
                    <form.Field name="name" validators={{ onChange: createAdminSchema.shape.name }}>
                        {(field) => (
                            <AppField field={field} label="Full Name" type="text" placeholder="e.g. John Doe" />
                        )}
                    </form.Field>

                    <form.Field name="email" validators={{ onChange: createAdminSchema.shape.email }}>
                        {(field) => (
                            <AppField field={field} label="Email Address" type="email" placeholder="admin@example.com" />
                        )}
                    </form.Field>

                    <form.Field
                        name="contactNumber"
                        validators={{ onChange: createAdminSchema.shape.contactNumber }}
                    >
                        {(field) => (
                            <AppField field={field} label="Contact Phone" type="text" placeholder="+1..." />
                        )}
                    </form.Field>

                    <form.Field name="image">
                        {(field) => (
                            <AppField field={field} label="Avatar Image URL (optional)" type="text" placeholder="https://..." />
                        )}
                    </form.Field>

                    <form.Field
                        name="password"
                        validators={{ onChange: createAdminSchema.shape.password }}
                    >
                        {(field) => (
                            <AppField
                                field={field}
                                label="Temporary Password"
                                type={showPassword ? "text" : "password"}
                                placeholder="Set secure initial password"
                                append={
                                    <Button
                                        onClick={() => setShowPassword((v) => !v)}
                                        variant="ghost"
                                        size="icon"
                                        type="button"
                                        className="h-8 w-8 text-muted-foreground hover:text-foreground"
                                    >
                                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </Button>
                                }
                            />
                        )}
                    </form.Field>

                    {serverError && (
                        <Alert variant="destructive">
                            <AlertDescription>{serverError}</AlertDescription>
                        </Alert>
                    )}

                    <DialogFooter className="gap-2 sm:gap-0 pt-3">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setOpen(false)}
                            className="rounded-xl"
                        >
                            Cancel
                        </Button>
                        <form.Subscribe selector={(s) => [s.canSubmit, s.isSubmitting] as const}>
                            {([canSubmit, isSubmitting]) => (
                                <AppSubmitButton
                                    isPending={isSubmitting || isPending}
                                    pendingLebel="Creating Administrator..."
                                    disabled={!canSubmit}
                                >
                                    Create Administrator
                                </AppSubmitButton>
                            )}
                        </form.Subscribe>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}