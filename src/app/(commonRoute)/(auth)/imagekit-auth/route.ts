import ImageKit from "imagekit";
import { NextResponse } from "next/server";

const publicKey = (process.env.IMAGEKIT_PUBLIC_KEY || process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY || "").trim();
const privateKey = (process.env.IMAGEKIT_PRIVATE_KEY || "").trim();
const urlEndpoint = (process.env.URL_ENDPOINT || process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT || "").trim();

const imagekit = new ImageKit({
    publicKey,
    privateKey,
    urlEndpoint,
});

export async function GET() {
    try {
        if (!publicKey || !privateKey || !urlEndpoint) {
            return NextResponse.json(
                { error: "ImageKit configuration is missing on server" },
                { status: 500 }
            );
        }

        const authParams = imagekit.getAuthenticationParameters();
        return NextResponse.json({
            ...authParams,
            publicKey,
            urlEndpoint,
        });
    } catch (error) {
        console.error(
            "Error generating ImageKit authentication parameters:",
            error
        );
        return NextResponse.json(
            { error: "Failed to generate authentication parameters" },
            { status: 500 }
        );
    }
}