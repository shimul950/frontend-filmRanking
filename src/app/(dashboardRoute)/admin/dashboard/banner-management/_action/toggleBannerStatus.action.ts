"use server";

import { updateBannerAction } from "./updateBanner.action";

export async function toggleBannerStatusAction(id: string, currentStatus: boolean) {
    return await updateBannerAction(id, {
        isActive: !currentStatus,
    });
}
