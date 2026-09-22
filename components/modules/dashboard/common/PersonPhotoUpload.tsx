"use client";

import { useState, useRef, DragEvent, ChangeEvent } from "react";
import Image from "next/image";
import { toast } from "sonner";
import {
    ImageIcon,
    X,
    RotateCcw,
    ExternalLink,
    Copy,
    Check,
    CloudUpload,
    Sparkles,
    AlertCircle,
    User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { uploadToImageKit } from "@/lib/imagekit-upload";

interface PersonPhotoUploadProps {
    value: string;
    onChange: (url: string) => void;
    folder?: string;
    label?: string;
    isSubmitting?: boolean;
    className?: string;
}

export function PersonPhotoUpload({
    value,
    onChange,
    folder = "/persons",
    label = "Profile Photo",
    isSubmitting = false,
    className = "",
}: PersonPhotoUploadProps) {
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
        const validTypes = ["image/jpeg", "image/png", "image/webp", "image/avif", "image/jpg"];
        if (!validTypes.includes(file.type.toLowerCase())) {
            toast.error("Unsupported file type. Please upload a JPG, PNG, or WEBP image.");
            return;
        }

        if (file.size > 10 * 1024 * 1024) {
            toast.error("File is too large. Image must be under 10MB.");
            return;
        }

        setUploadError(null);
        setUploadProgress(0);
        setIsUploading(true);

        const localUrl = URL.createObjectURL(file);
        setLocalPreview(localUrl);

        abortControllerRef.current = new AbortController();

        try {
            const result = await uploadToImageKit(file, {
                folder: folder,
                signal: abortControllerRef.current.signal,
                onProgress: (percent) => {
                    setUploadProgress(percent);
                },
            });

            onChange(result.url);
            setCustomUrl(result.url);
            setLocalPreview(null);
            toast.success("Photo uploaded to ImageKit CDN successfully!");
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : "Failed to upload image";
            if (message.includes("aborted")) {
                toast.info("Upload cancelled");
            } else {
                console.error("ImageKit upload error:", error);
                setUploadError(message);
                toast.error(`ImageKit Upload Failed: ${message}`);
            }
            onChange(localUrl);
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

    const handleRemove = () => {
        if (localPreview) {
            URL.revokeObjectURL(localPreview);
            setLocalPreview(null);
        }
        onChange("");
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
            onChange(customUrl.trim());
        }
    };

    const isImageKitUrl = value?.includes("ik.imagekit.io");

    return (
        <div className={`space-y-3 ${className}`}>
            <div className="flex items-center justify-between">
                <label className="text-xs font-semibold uppercase tracking-wider text-zinc-300 flex items-center gap-1.5">
                    <User className="h-3.5 w-3.5 text-red-500" />
                    {label}
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
                        URL
                    </button>
                </div>
            </div>

            <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp,image/avif,image/jpg"
                className="hidden"
                onChange={handleInputChange}
                disabled={isSubmitting || isUploading}
            />

            {/* Profile Avatar Container */}
            <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`group relative aspect-[3/4] max-w-[200px] mx-auto rounded-2xl border-2 transition-all duration-300 overflow-hidden flex flex-col items-center justify-center ${
                    isDragging
                        ? "border-red-500 bg-red-950/20 shadow-xl shadow-red-600/20 scale-[1.01]"
                        : displayImage
                        ? "border-white/10 bg-zinc-950 hover:border-white/20"
                        : "border-dashed border-zinc-700/80 bg-zinc-900/40 hover:border-red-500/50 hover:bg-zinc-900/70"
                }`}
            >
                {displayImage ? (
                    <>
                        <Image
                            src={displayImage}
                            alt="Preview"
                            fill
                            sizes="200px"
                            className={`object-cover transition-transform duration-500 group-hover:scale-105 ${
                                isUploading ? "brightness-50 filter blur-[2px]" : ""
                            }`}
                        />

                        <div className="absolute top-2 left-2 right-2 flex items-center justify-between pointer-events-none z-10">
                            {isImageKitUrl ? (
                                <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-[9px] font-semibold text-emerald-400 backdrop-blur-md shadow-md">
                                    <Sparkles className="h-2 w-2" />
                                    ImageKit
                                </div>
                            ) : (
                                <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-zinc-900/80 border border-white/10 text-[9px] font-medium text-zinc-300 backdrop-blur-md">
                                    Preview
                                </div>
                            )}

                            {!isUploading && (
                                <button
                                    type="button"
                                    onClick={handleRemove}
                                    title="Remove photo"
                                    className="pointer-events-auto flex h-6 w-6 items-center justify-center rounded-full bg-black/60 hover:bg-red-600 text-zinc-300 hover:text-white backdrop-blur-md border border-white/10 transition-colors shadow-md"
                                >
                                    <X className="h-3 w-3" />
                                </button>
                            )}
                        </div>

                        {!isUploading && (
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col justify-end p-3 z-10">
                                <Button
                                    type="button"
                                    size="sm"
                                    variant="outline"
                                    onClick={() => fileInputRef.current?.click()}
                                    className="w-full bg-white/10 hover:bg-white/20 border-white/20 text-white text-[11px] h-7 backdrop-blur-md flex items-center justify-center gap-1"
                                >
                                    <RotateCcw className="h-3 w-3" />
                                    Change Photo
                                </Button>
                            </div>
                        )}
                    </>
                ) : (
                    <div
                        onClick={() => fileInputRef.current?.click()}
                        className="cursor-pointer flex flex-col items-center justify-center text-center p-4 space-y-2 w-full h-full"
                    >
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-600/10 text-red-500 border border-red-500/20 group-hover:scale-110 group-hover:bg-red-600/20 group-hover:border-red-500/40 transition-all duration-300">
                            <CloudUpload className="h-6 w-6" />
                        </div>
                        <div className="space-y-0.5">
                            <p className="text-[11px] font-semibold text-white group-hover:text-red-400 transition-colors">
                                Upload Photo
                            </p>
                            <p className="text-[10px] text-zinc-400">or drop image</p>
                        </div>
                        <span className="text-[9px] text-zinc-500">ImageKit CDN · Max 10MB</span>
                    </div>
                )}

                {isUploading && (
                    <div className="absolute inset-0 bg-black/85 backdrop-blur-md flex flex-col items-center justify-center p-4 space-y-2 z-20">
                        <div className="relative flex items-center justify-center">
                            <div className="h-10 w-10 rounded-full border-2 border-red-500/20 border-t-red-500 animate-spin" />
                            <span className="absolute text-[10px] font-bold text-white">
                                {uploadProgress}%
                            </span>
                        </div>
                        <p className="text-[10px] font-medium text-zinc-300">Uploading...</p>
                        <Button
                            type="button"
                            size="sm"
                            variant="ghost"
                            onClick={handleCancelUpload}
                            className="text-[10px] text-zinc-400 hover:text-white h-6 px-2"
                        >
                            Cancel
                        </Button>
                    </div>
                )}
            </div>

            {uploadError && (
                <div className="rounded-lg border border-red-500/30 bg-red-950/30 p-2 text-xs text-red-400 flex items-center gap-1.5">
                    <AlertCircle className="h-3.5 w-3.5 shrink-0 text-red-400" />
                    <span className="text-[11px] flex-1">{uploadError}</span>
                </div>
            )}

            {activeTab === "url" && (
                <div className="flex gap-1.5 pt-1">
                    <Input
                        type="url"
                        value={customUrl}
                        onChange={(e) => setCustomUrl(e.target.value)}
                        onBlur={handleUrlBlur}
                        placeholder="https://ik.imagekit.io/... photo URL"
                        className="border-white/10 bg-zinc-900 text-xs text-white h-8"
                    />
                    <Button
                        type="button"
                        size="sm"
                        onClick={() => onChange(customUrl.trim())}
                        className="bg-zinc-800 hover:bg-zinc-700 text-white text-xs h-8 px-2.5"
                    >
                        Set
                    </Button>
                </div>
            )}
        </div>
    );
}
