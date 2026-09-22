"use client";

import { useState, useRef, DragEvent, ChangeEvent } from "react";
import Image from "next/image";
import { toast } from "sonner";
import {
    Upload,
    ImageIcon,
    CheckCircle2,
    X,
    RotateCcw,
    ExternalLink,
    Copy,
    Check,
    CloudUpload,
    Sparkles,
    AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { uploadToImageKit } from "@/lib/imagekit-upload";

interface MoviePosterUploadProps {
    value: string;
    onChange: (url: string, file?: File | null) => void;
    isSubmitting?: boolean;
    className?: string;
}

export function MoviePosterUpload({
    value,
    onChange,
    isSubmitting = false,
    className = "",
}: MoviePosterUploadProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [uploadError, setUploadError] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);
    const [activeTab, setActiveTab] = useState<"upload" | "url">("upload");
    const [customUrl, setCustomUrl] = useState(value);
    const [localPreview, setLocalPreview] = useState<string | null>(null);
    const abortControllerRef = useRef<AbortController | null>(null);

    const displayImage = localPreview || value;

    const handleFile = async (file: File) => {
        // Validate file type
        const validTypes = ["image/jpeg", "image/png", "image/webp", "image/avif", "image/jpg"];
        if (!validTypes.includes(file.type.toLowerCase())) {
            toast.error("Unsupported file type. Please upload a JPG, PNG, or WEBP image.");
            return;
        }

        // Validate file size (max 10MB)
        if (file.size > 10 * 1024 * 1024) {
            toast.error("File is too large. Poster images must be under 10MB.");
            return;
        }

        setUploadError(null);
        setUploadProgress(0);
        setIsUploading(true);

        // Immediate local preview for responsive UX
        const localUrl = URL.createObjectURL(file);
        setLocalPreview(localUrl);

        abortControllerRef.current = new AbortController();

        try {
            const result = await uploadToImageKit(file, {
                folder: "/movies/posters",
                signal: abortControllerRef.current.signal,
                onProgress: (percent) => {
                    setUploadProgress(percent);
                },
            });

            // Update parent state with permanent ImageKit URL
            onChange(result.url, file);
            setCustomUrl(result.url);
            setLocalPreview(null);
            toast.success("Poster uploaded to ImageKit CDN successfully!");
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : "Failed to upload image";
            if (message.includes("aborted")) {
                toast.info("Upload cancelled");
            } else {
                console.error("ImageKit upload error:", error);
                setUploadError(message);
                toast.error(`ImageKit Upload Failed: ${message}`);
            }
            // Keep local preview so user doesn't lose image, but pass file
            onChange(localUrl, file);
        } finally {
            setIsUploading(false);
            setUploadProgress(0);
        }
    };

    const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        if (!isSubmitting && !isUploading) {
            setIsDragging(true);
        }
    };

    const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };

    const handleDrop = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        if (isSubmitting || isUploading) return;

        const files = e.dataTransfer.files;
        if (files && files.length > 0) {
            handleFile(files[0]);
        }
    };

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            handleFile(files[0]);
        }
    };

    const handleCancelUpload = () => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }
        setIsUploading(false);
        setUploadProgress(0);
        setLocalPreview(null);
    };

    const handleRemovePoster = () => {
        if (localPreview) {
            URL.revokeObjectURL(localPreview);
            setLocalPreview(null);
        }
        onChange("", null);
        setCustomUrl("");
        setUploadError(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleCopyUrl = async () => {
        if (!value) return;
        await navigator.clipboard.writeText(value);
        setCopied(true);
        toast.success("Image URL copied to clipboard");
        setTimeout(() => setCopied(false), 2000);
    };

    const handleUrlBlur = () => {
        if (customUrl.trim() !== value) {
            onChange(customUrl.trim(), null);
        }
    };

    const isImageKitUrl = value?.includes("ik.imagekit.io");

    return (
        <div className={`space-y-3 ${className}`}>
            {/* Header with Mode Selector */}
            <div className="flex items-center justify-between">
                <label className="text-xs font-semibold uppercase tracking-wider text-zinc-300 flex items-center gap-1.5">
                    <ImageIcon className="h-3.5 w-3.5 text-red-500" />
                    Movie Poster Image
                </label>
                <div className="flex items-center gap-1 rounded-lg bg-zinc-900/80 p-0.5 border border-white/5 text-[11px]">
                    <button
                        type="button"
                        onClick={() => setActiveTab("upload")}
                        className={`rounded-md px-2.5 py-1 font-medium transition-all ${
                            activeTab === "upload"
                                ? "bg-red-600 text-white shadow-sm"
                                : "text-zinc-400 hover:text-white"
                        }`}
                    >
                        Upload
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveTab("url")}
                        className={`rounded-md px-2.5 py-1 font-medium transition-all ${
                            activeTab === "url"
                                ? "bg-red-600 text-white shadow-sm"
                                : "text-zinc-400 hover:text-white"
                        }`}
                    >
                        Image URL
                    </button>
                </div>
            </div>

            {/* Hidden file input */}
            <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp,image/avif,image/jpg"
                className="hidden"
                onChange={handleInputChange}
                disabled={isSubmitting || isUploading}
            />

            {/* Main Poster Container (Enlarged 2:3 cinematic poster ratio) */}
            <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`group relative aspect-[2/3] w-full max-w-[280px] mx-auto sm:max-w-none rounded-2xl border-2 transition-all duration-300 overflow-hidden flex flex-col items-center justify-center ${
                    isDragging
                        ? "border-red-500 bg-red-950/20 shadow-xl shadow-red-600/20 scale-[1.01]"
                        : displayImage
                        ? "border-white/10 bg-zinc-950 hover:border-white/20"
                        : "border-dashed border-zinc-700/80 bg-zinc-900/40 hover:border-red-500/50 hover:bg-zinc-900/70"
                }`}
            >
                {/* Visual state: Display Image (Preview or Uploaded) */}
                {displayImage ? (
                    <>
                        <Image
                            src={displayImage}
                            alt="Movie Poster Preview"
                            fill
                            sizes="(max-width: 768px) 100vw, 320px"
                            className={`object-cover transition-transform duration-500 group-hover:scale-105 ${
                                isUploading ? "brightness-50 filter blur-[2px]" : ""
                            }`}
                        />

                        {/* Top Badge: ImageKit CDN status */}
                        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none z-10">
                            {isImageKitUrl ? (
                                <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-[10px] font-semibold text-emerald-400 backdrop-blur-md shadow-md">
                                    <Sparkles className="h-2.5 w-2.5" />
                                    ImageKit CDN
                                </div>
                            ) : (
                                <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-zinc-900/80 border border-white/10 text-[10px] font-medium text-zinc-300 backdrop-blur-md">
                                    Poster Preview
                                </div>
                            )}

                            {!isUploading && (
                                <button
                                    type="button"
                                    onClick={handleRemovePoster}
                                    title="Remove poster"
                                    className="pointer-events-auto flex h-7 w-7 items-center justify-center rounded-full bg-black/60 hover:bg-red-600 text-zinc-300 hover:text-white backdrop-blur-md border border-white/10 transition-colors shadow-md"
                                >
                                    <X className="h-3.5 w-3.5" />
                                </button>
                            )}
                        </div>

                        {/* Hover Overlay with Quick Actions */}
                        {!isUploading && (
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col justify-end p-4 z-10">
                                <div className="space-y-2">
                                    <Button
                                        type="button"
                                        size="sm"
                                        variant="outline"
                                        onClick={() => fileInputRef.current?.click()}
                                        className="w-full bg-white/10 hover:bg-white/20 border-white/20 text-white text-xs backdrop-blur-md flex items-center justify-center gap-1.5"
                                    >
                                        <RotateCcw className="h-3.5 w-3.5" />
                                        Replace Poster
                                    </Button>

                                    {value && (
                                        <div className="flex items-center gap-1.5">
                                            <Button
                                                type="button"
                                                size="sm"
                                                variant="ghost"
                                                onClick={handleCopyUrl}
                                                className="flex-1 bg-black/40 hover:bg-black/70 text-zinc-300 hover:text-white text-[11px] h-7 px-2"
                                            >
                                                {copied ? (
                                                    <Check className="h-3 w-3 text-emerald-400 mr-1" />
                                                ) : (
                                                    <Copy className="h-3 w-3 mr-1" />
                                                )}
                                                Copy CDN URL
                                            </Button>
                                            <a
                                                href={value}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="flex h-7 w-7 items-center justify-center rounded-md bg-black/40 hover:bg-black/70 text-zinc-300 hover:text-white transition-colors"
                                                title="Open original image"
                                            >
                                                <ExternalLink className="h-3 w-3" />
                                            </a>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </>
                ) : (
                    /* Visual state: Empty Dropzone */
                    <div
                        onClick={() => fileInputRef.current?.click()}
                        className="cursor-pointer flex flex-col items-center justify-center text-center p-6 space-y-3 w-full h-full"
                    >
                        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-red-600/10 text-red-500 border border-red-500/20 group-hover:scale-110 group-hover:bg-red-600/20 group-hover:border-red-500/40 transition-all duration-300 shadow-lg shadow-red-600/5">
                            <CloudUpload className="h-8 w-8 transition-transform group-hover:-translate-y-0.5" />
                        </div>

                        <div className="space-y-1">
                            <p className="text-xs font-semibold text-white group-hover:text-red-400 transition-colors">
                                Drop poster image here
                            </p>
                            <p className="text-[11px] text-zinc-400">
                                or <span className="text-red-400 underline underline-offset-2">browse file</span>
                            </p>
                        </div>

                        <div className="space-y-1 pt-2">
                            <div className="inline-flex items-center gap-1 rounded-full bg-zinc-800/80 px-2 py-0.5 text-[10px] text-zinc-400 border border-white/5">
                                <Sparkles className="h-2.5 w-2.5 text-red-400" />
                                ImageKit CDN Storage
                            </div>
                            <p className="text-[10px] text-zinc-500">
                                Cinematic 2:3 ratio · Max 10MB (JPG, PNG, WEBP)
                            </p>
                        </div>
                    </div>
                )}

                {/* Uploading State Overlay */}
                {isUploading && (
                    <div className="absolute inset-0 bg-black/85 backdrop-blur-md flex flex-col items-center justify-center p-6 space-y-4 z-20">
                        <div className="relative flex items-center justify-center">
                            <div className="h-14 w-14 rounded-full border-4 border-red-500/20 border-t-red-500 animate-spin" />
                            <span className="absolute text-xs font-bold text-white">
                                {uploadProgress}%
                            </span>
                        </div>

                        <div className="space-y-1 text-center w-full max-w-[200px]">
                            <p className="text-xs font-semibold text-white">Uploading to ImageKit</p>
                            <div className="h-1.5 w-full rounded-full bg-zinc-800 overflow-hidden">
                                <div
                                    className="h-full bg-red-600 transition-all duration-200 rounded-full"
                                    style={{ width: `${uploadProgress}%` }}
                                />
                            </div>
                            <p className="text-[10px] text-zinc-400 pt-0.5">Optimizing for global CDN...</p>
                        </div>

                        <Button
                            type="button"
                            size="sm"
                            variant="ghost"
                            onClick={handleCancelUpload}
                            className="text-xs text-zinc-400 hover:text-white h-7 px-3"
                        >
                            Cancel
                        </Button>
                    </div>
                )}
            </div>

            {/* Upload Error Banner */}
            {uploadError && (
                <div className="rounded-xl border border-red-500/30 bg-red-950/30 p-2.5 text-xs text-red-400 flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-red-400" />
                    <div className="flex-1">
                        <p className="font-medium text-[11px]">{uploadError}</p>
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="text-[11px] underline hover:text-white mt-1"
                        >
                            Try uploading again
                        </button>
                    </div>
                </div>
            )}

            {/* URL Input Fallback Tab */}
            {activeTab === "url" && (
                <div className="space-y-1.5 pt-1">
                    <div className="flex gap-2">
                        <Input
                            type="url"
                            value={customUrl}
                            onChange={(e) => setCustomUrl(e.target.value)}
                            onBlur={handleUrlBlur}
                            placeholder="https://ik.imagekit.io/... or image URL"
                            className="border-white/10 bg-zinc-900 text-xs text-white"
                        />
                        <Button
                            type="button"
                            size="sm"
                            onClick={() => onChange(customUrl.trim(), null)}
                            className="bg-zinc-800 hover:bg-zinc-700 text-white text-xs px-3"
                        >
                            Set
                        </Button>
                    </div>
                    <p className="text-[10px] text-zinc-500">
                        Paste any direct ImageKit or public image URL.
                    </p>
                </div>
            )}
        </div>
    );
}
