"use server";

import { httpClient } from "@/lib/axios/httpClient";
import { buildCookieHeader } from "@/lib/cookie-relay";
import { ApiErrorResponse } from "@/src/types/api.types";
import { IEpisode, ISeason } from "@/src/types/webSeries.types";
import axios from "axios";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export interface IAddSeasonPayload {
    seasonNumber: number;
    title?: string;
    synopsis?: string;
    posterUrl?: string;
    youtubeTrailer?: string;
    releaseDate?: string;
}

export async function addSeasonAction(
    seriesId: string,
    payload: IAddSeasonPayload
): Promise<{ success: true; data: ISeason } | ApiErrorResponse> {
    if (!seriesId) return { success: false, messsage: "Series ID is required" };
    if (!payload.seasonNumber) return { success: false, messsage: "Season number is required" };

    const cookieStore = await cookies();
    const cookieHeader = buildCookieHeader(cookieStore);
    if (!cookieHeader) return { success: false, messsage: "You must be authenticated as admin" };

    try {
        const response = await axios.post<{ success: boolean; data: ISeason }>(
            `${API_BASE_URL}/web-series/${seriesId}/seasons`,
            payload,
            {
                headers: {
                    Cookie: cookieHeader,
                    "Content-Type": "application/json",
                },
            }
        );

        revalidatePath("/admin/dashboard/web-series-management");
        revalidatePath(`/web-series/${seriesId}`);
        return { success: true, data: response.data.data };
    } catch (error: unknown) {
        let message = "Failed to add season";
        if (axios.isAxiosError(error)) {
            message = error.response?.data?.message || error.message;
        } else if (error instanceof Error) {
            message = error.message;
        }
        return { success: false, messsage: message };
    }
}

export async function deleteSeasonAction(
    seasonId: string,
    seriesId?: string
): Promise<{ success: true; message: string } | ApiErrorResponse> {
    if (!seasonId) return { success: false, messsage: "Season ID is required" };

    const cookieStore = await cookies();
    const cookieHeader = buildCookieHeader(cookieStore);
    if (!cookieHeader) return { success: false, messsage: "You must be authenticated as admin" };

    try {
        await httpClient.delete(`/web-series/seasons/${seasonId}`, {
            headers: { Cookie: cookieHeader },
        });

        revalidatePath("/admin/dashboard/web-series-management");
        if (seriesId) revalidatePath(`/web-series/${seriesId}`);
        return { success: true, message: "Season deleted successfully" };
    } catch (error: unknown) {
        let message = "Failed to delete season";
        if (axios.isAxiosError(error)) {
            message = error.response?.data?.message || error.message;
        } else if (error instanceof Error) {
            message = error.message;
        }
        return { success: false, messsage: message };
    }
}

export interface IAddEpisodePayload {
    episodeNumber: number;
    title: string;
    synopsis?: string;
    duration?: number;
    stillUrl?: string;
    videoUrl?: string;
}

export async function addEpisodeAction(
    seasonId: string,
    payload: IAddEpisodePayload,
    seriesId?: string
): Promise<{ success: true; data: IEpisode } | ApiErrorResponse> {
    if (!seasonId) return { success: false, messsage: "Season ID is required" };
    if (!payload.title?.trim()) return { success: false, messsage: "Episode title is required" };

    const cookieStore = await cookies();
    const cookieHeader = buildCookieHeader(cookieStore);
    if (!cookieHeader) return { success: false, messsage: "You must be authenticated as admin" };

    try {
        const response = await axios.post<{ success: boolean; data: IEpisode }>(
            `${API_BASE_URL}/web-series/seasons/${seasonId}/episodes`,
            payload,
            {
                headers: {
                    Cookie: cookieHeader,
                    "Content-Type": "application/json",
                },
            }
        );

        revalidatePath("/admin/dashboard/web-series-management");
        if (seriesId) revalidatePath(`/web-series/${seriesId}`);
        return { success: true, data: response.data.data };
    } catch (error: unknown) {
        let message = "Failed to add episode";
        if (axios.isAxiosError(error)) {
            message = error.response?.data?.message || error.message;
        } else if (error instanceof Error) {
            message = error.message;
        }
        return { success: false, messsage: message };
    }
}

export async function deleteEpisodeAction(
    episodeId: string,
    seriesId?: string
): Promise<{ success: true; message: string } | ApiErrorResponse> {
    if (!episodeId) return { success: false, messsage: "Episode ID is required" };

    const cookieStore = await cookies();
    const cookieHeader = buildCookieHeader(cookieStore);
    if (!cookieHeader) return { success: false, messsage: "You must be authenticated as admin" };

    try {
        await httpClient.delete(`/web-series/episodes/${episodeId}`, {
            headers: { Cookie: cookieHeader },
        });

        revalidatePath("/admin/dashboard/web-series-management");
        if (seriesId) revalidatePath(`/web-series/${seriesId}`);
        return { success: true, message: "Episode deleted successfully" };
    } catch (error: unknown) {
        let message = "Failed to delete episode";
        if (axios.isAxiosError(error)) {
            message = error.response?.data?.message || error.message;
        } else if (error instanceof Error) {
            message = error.message;
        }
        return { success: false, messsage: message };
    }
}
