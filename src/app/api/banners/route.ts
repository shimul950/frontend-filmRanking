import { NextRequest, NextResponse } from "next/server";
import { getAllBannersAction } from "@/src/app/(dashboardRoute)/admin/dashboard/banner-management/_action/getAllBanners.action";
import { createBannerAction } from "@/src/app/(dashboardRoute)/admin/dashboard/banner-management/_action/createBanner.action";

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const searchTerm = searchParams.get("searchTerm") || undefined;
    const isActive = searchParams.get("isActive") || undefined;
    const genre = searchParams.get("genre") || undefined;

    try {
        const banners = await getAllBannersAction({ searchTerm, isActive, genre });
        return NextResponse.json({
            success: true,
            data: banners || [],
        });
    } catch (error) {
        return NextResponse.json(
            { success: false, message: "Failed to fetch banners" },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const result = await createBannerAction(body);

        if (!result.success) {
            return NextResponse.json(
                { success: false, message: (result as any).messsage || "Failed to create banner" },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { success: true, data: result.data },
            { status: 201 }
        );
    } catch (error) {
        return NextResponse.json(
            { success: false, message: "Internal server error" },
            { status: 500 }
        );
    }
}
