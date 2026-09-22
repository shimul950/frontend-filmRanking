/**
 * ImageKit Client Upload Utility
 * Handles direct browser-to-ImageKit uploads with real-time progress tracking.
 */

export interface ImageKitAuthResponse {
    token: string;
    expire: number;
    signature: string;
    publicKey?: string;
    urlEndpoint?: string;
    error?: string;
}

export interface ImageKitUploadResult {
    url: string;
    fileId: string;
    name: string;
    size: number;
    filePath?: string;
    height?: number;
    width?: number;
    thumbnailUrl?: string;
}

export interface ImageKitUploadOptions {
    folder?: string;
    onProgress?: (progressPercent: number) => void;
    signal?: AbortSignal;
}

/**
 * Uploads a local file directly to ImageKit using authenticated client parameters.
 */
export async function uploadToImageKit(
    file: File,
    options?: ImageKitUploadOptions
): Promise<ImageKitUploadResult> {
    // 1. Fetch fresh authentication parameters from the server
    const authRes = await fetch("/imagekit-auth", {
        method: "GET",
        cache: "no-store",
    });

    if (!authRes.ok) {
        let errMessage = "Failed to authenticate with ImageKit server";
        try {
            const errData = await authRes.json();
            if (errData?.error) errMessage = errData.error;
        } catch {
            // ignore JSON parse error
        }
        throw new Error(errMessage);
    }

    const auth: ImageKitAuthResponse = await authRes.json();

    const publicKey = auth.publicKey || process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY;
    if (!publicKey) {
        throw new Error("Missing ImageKit public key for upload");
    }

    // 2. Prepare upload payload
    const safeFileName = `poster_${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
    const uploadFormData = new FormData();
    uploadFormData.append("file", file);
    uploadFormData.append("fileName", safeFileName);
    uploadFormData.append("publicKey", publicKey);
    uploadFormData.append("signature", auth.signature);
    uploadFormData.append("expire", String(auth.expire));
    uploadFormData.append("token", auth.token);
    uploadFormData.append("useUniqueFileName", "true");
    uploadFormData.append("folder", options?.folder || "/movies/posters");

    // 3. Perform upload with XMLHttpRequest for live progress feedback
    return new Promise<ImageKitUploadResult>((resolve, reject) => {
        const xhr = new XMLHttpRequest();

        if (options?.signal) {
            options.signal.addEventListener("abort", () => {
                xhr.abort();
                reject(new Error("Upload aborted by user"));
            });
        }

        if (options?.onProgress) {
            xhr.upload.onprogress = (event: ProgressEvent) => {
                if (event.lengthComputable && event.total > 0) {
                    const percent = Math.min(
                        100,
                        Math.max(0, Math.round((event.loaded / event.total) * 100))
                    );
                    options.onProgress?.(percent);
                }
            };
        }

        xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) {
                try {
                    const result = JSON.parse(xhr.responseText);
                    resolve({
                        url: result.url,
                        fileId: result.fileId,
                        name: result.name,
                        size: result.size,
                        filePath: result.filePath,
                        height: result.height,
                        width: result.width,
                        thumbnailUrl: result.thumbnailUrl,
                    });
                } catch {
                    reject(new Error("Invalid response format from ImageKit"));
                }
            } else {
                let errorMessage = `ImageKit upload failed with status ${xhr.status}`;
                try {
                    const errorJson = JSON.parse(xhr.responseText);
                    if (errorJson?.message) {
                        errorMessage = errorJson.message;
                    } else if (errorJson?.help) {
                        errorMessage = `${errorJson.help}`;
                    }
                } catch {
                    // ignore JSON parse error
                }
                reject(new Error(errorMessage));
            }
        };

        xhr.onerror = () => {
            reject(new Error("Network connection error during ImageKit upload"));
        };

        xhr.ontimeout = () => {
            reject(new Error("Upload request to ImageKit timed out"));
        };

        xhr.open("POST", "https://upload.imagekit.io/api/v1/files/upload", true);
        xhr.send(uploadFormData);
    });
}
