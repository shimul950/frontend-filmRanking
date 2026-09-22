"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { IDirector } from "@/src/types/director.types";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { PersonPhotoUpload } from "../common/PersonPhotoUpload";
import { updateDirectorAction } from "@/src/app/(dashboardRoute)/admin/dashboard/director-management/_action/updateDirector.action";
import { Video, Loader2, Sparkles } from "lucide-react";

interface EditDirectorDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    director: IDirector | null;
    onSuccess?: () => void;
}

export function EditDirectorDialog({
    open,
    onOpenChange,
    director,
    onSuccess,
}: EditDirectorDialogProps) {
    const [name, setName] = useState("");
    const [bio, setBio] = useState("");
    const [nationality, setNationality] = useState("");
    const [birthDate, setBirthDate] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (director) {
            setName(director.name || "");
            setBio(director.bio || "");
            setNationality(director.nationality || "");
            setBirthDate(
                director.birthDate ? new Date(director.birthDate).toISOString().split("T")[0] : ""
            );
            setImageUrl(director.imageUrl || "");
        }
    }, [director]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!director) return;
        if (!name.trim()) {
            toast.error("Please provide the director's name");
            return;
        }

        setIsSubmitting(true);
        try {
            const res = await updateDirectorAction(director.id, {
                name: name.trim(),
                bio: bio.trim() || undefined,
                nationality: nationality.trim() || undefined,
                birthDate: birthDate ? new Date(birthDate).toISOString() : undefined,
                imageUrl: imageUrl || undefined,
            });

            if (res.success) {
                toast.success(`Director "${name}" updated successfully!`);
                onOpenChange(false);
                onSuccess?.();
            } else {
                toast.error(res.messsage || "Failed to update director");
            }
        } catch {
            toast.error("An unexpected error occurred while updating director");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-4xl lg:max-w-5xl max-h-[92vh] overflow-y-auto bg-zinc-950 border-white/10 text-white p-6 sm:p-8 shadow-2xl">
                <DialogHeader className="border-b border-white/10 pb-4">
                    <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-600/20 text-red-500 border border-red-500/30 shadow-md shadow-red-600/10">
                            <Video className="h-6 w-6" />
                        </div>
                        <div>
                            <DialogTitle className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                                Edit Film Director
                                <Sparkles className="h-4 w-4 text-amber-400" />
                            </DialogTitle>
                            <DialogDescription className="text-xs sm:text-sm text-zinc-400 mt-0.5">
                                Modify auteur credentials, headshot photograph, filmography background, and director details.
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6 pt-4">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                        {/* Left: Photo Upload - 5 cols */}
                        <div className="lg:col-span-5 space-y-3 rounded-2xl bg-zinc-900/40 border border-white/5 p-5">
                            <label className="text-xs font-bold uppercase tracking-wider text-zinc-400 block">
                                Director Portrait
                            </label>
                            <PersonPhotoUpload
                                value={imageUrl}
                                onChange={setImageUrl}
                                folder="/director"
                                label="Director Headshot / Photo"
                                isSubmitting={isSubmitting}
                            />
                            <p className="text-[11px] text-zinc-500 leading-relaxed mt-2">
                                Update the high-resolution portrait photograph displayed across cinema credits and director showcases.
                            </p>
                        </div>

                        {/* Right: Info fields - 7 cols */}
                        <div className="lg:col-span-7 space-y-5">
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-wider text-zinc-300">
                                    Full Name <span className="text-red-500">*</span>
                                </label>
                                <Input
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="e.g. Christopher Nolan, Denis Villeneuve"
                                    required
                                    className="bg-zinc-900/80 border-white/10 text-white text-sm h-11 px-3.5 focus:border-red-500/50"
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-wider text-zinc-300">
                                        Nationality / Origin
                                    </label>
                                    <Input
                                        value={nationality}
                                        onChange={(e) => setNationality(e.target.value)}
                                        placeholder="e.g. British-American, French-Canadian"
                                        className="bg-zinc-900/80 border-white/10 text-white text-sm h-11 px-3.5 focus:border-red-500/50"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-wider text-zinc-300">
                                        Date of Birth
                                    </label>
                                    <Input
                                        type="date"
                                        value={birthDate}
                                        onChange={(e) => setBirthDate(e.target.value)}
                                        className="bg-zinc-900/80 border-white/10 text-white text-sm h-11 px-3.5 focus:border-red-500/50 [color-scheme:dark]"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-wider text-zinc-300">
                                    Director Biography & Directorial Style
                                </label>
                                <Textarea
                                    value={bio}
                                    onChange={(e) => setBio(e.target.value)}
                                    placeholder="Summarize directorial style, major cinematic achievements, trademark techniques, and film awards..."
                                    rows={6}
                                    className="bg-zinc-900/80 border-white/10 text-white text-sm p-3.5 resize-none leading-relaxed focus:border-red-500/50"
                                />
                            </div>
                        </div>
                    </div>

                    <DialogFooter className="gap-2 sm:gap-0 pt-4 border-t border-white/10">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => onOpenChange(false)}
                            className="text-zinc-400 hover:text-white text-xs h-10 px-5"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="bg-red-600 hover:bg-red-700 text-white font-semibold text-xs h-10 px-6 shadow-lg shadow-red-600/30"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Saving Changes...
                                </>
                            ) : (
                                "Save Director Changes"
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
