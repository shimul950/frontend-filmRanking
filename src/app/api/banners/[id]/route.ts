import { NextRequest, NextResponse } from "next/server";
import { updateBannerAction } from "@/src/app/(dashboardRoute)/admin/dashboard/banner-management/_action/updateBanner.action";
import { deleteBannerAction } from "@/src/app/(dashboardRoute)/admin/dashboard/banner-management/_action/deleteBanner.action";

export async function PATCH(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await context.params;
        const body = await request.json();
        const result = await updateBannerAction(id, body);

        if (!result.success) {
            return NextResponse.json(
                { success: false, message: (result as any).messsage || "Failed to update banner" },
                { status: 400 }
            );
        }

        return NextResponse.json({ success: true, data: result.data });
    } catch (error) {
        return NextResponse.json(
            { success: false, message: "Internal server error" },
            { status: 500 }
        );
    }
}

export async function DELETE(
    _request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await context.params;
        const result = await deleteBannerAction(id);

        if (!result.success) {
            return NextResponse.json(
                { success: false, message: (result as any).messsage || "Failed to delete banner" },
                { status: 400 }
            );
        }

        return NextResponse.json({ success: true, message: result.message });
    } catch (error) {
        return NextResponse.json(
            { success: false, message: "Internal server error" },
            { status: 500 }
        );
    }
}
