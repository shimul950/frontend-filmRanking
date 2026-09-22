import { Pool } from "pg";
import { IBanner, ICreateBannerPayload, IUpdateBannerPayload } from "@/src/types/banner.types";
import crypto from "crypto";

const connectionString =
    process.env.DATABASE_URL ||
    "postgres://8f3a3a2612bf0d90c0e151d39409ca04fc60ece45515b1b798547fced521827a:sk_wc2s4s7HKFQmYmRFfEvTX@db.prisma.io:5432/postgres?sslmode=require";

// Global pool to prevent connection exhaustion in serverless / hot-reload environments
declare global {
    var __pgPool: Pool | undefined;
}

export const dbPool =
    global.__pgPool ||
    new Pool({
        connectionString,
        max: 10,
        idleTimeoutMillis: 30000,
    });

if (process.env.NODE_ENV !== "production") {
    global.__pgPool = dbPool;
}

export interface IBannerRow {
    id: string;
    title: string;
    synopsis: string | null;
    image_url: string;
    poster_url: string | null;
    rating: number | null;
    release_year: number | null;
    duration: number | null;
    genre: string | null;
    pricing: "FREE" | "PREMIUM";
    youtube_link: string | null;
    director: string | null;
    link_url: string | null;
    is_active: boolean;
    order: number;
    created_at: Date;
    updated_at: Date;
}

export function mapRowToBanner(row: IBannerRow): IBanner {
    return {
        id: row.id,
        title: row.title,
        synopsis: row.synopsis,
        imageUrl: row.image_url,
        posterUrl: row.poster_url,
        rating: row.rating ? parseFloat(String(row.rating)) : 0,
        releaseYear: row.release_year,
        duration: row.duration,
        genre: row.genre,
        pricing: row.pricing || "FREE",
        youtubeLink: row.youtube_link,
        director: row.director,
        linkUrl: row.link_url,
        isActive: row.is_active,
        order: row.order,
        createdAt: row.created_at?.toISOString?.() || String(row.created_at),
        updatedAt: row.updated_at?.toISOString?.() || String(row.updated_at),
    };
}

export async function getBannersFromDb(filters?: {
    searchTerm?: string;
    isActive?: boolean | string;
    genre?: string;
}): Promise<IBanner[]> {
    try {
        const conditions: string[] = [];
        const values: any[] = [];
        let idx = 1;

        if (filters?.searchTerm) {
            conditions.push(
                `(title ILIKE $${idx} OR genre ILIKE $${idx} OR director ILIKE $${idx})`
            );
            values.push(`%${filters.searchTerm}%`);
            idx++;
        }

        if (filters?.isActive !== undefined && filters?.isActive !== "") {
            const activeBool =
                typeof filters.isActive === "string"
                    ? filters.isActive === "true"
                    : Boolean(filters.isActive);
            conditions.push(`is_active = $${idx}`);
            values.push(activeBool);
            idx++;
        }

        if (filters?.genre && filters.genre.toLowerCase() !== "all") {
            conditions.push(`genre ILIKE $${idx}`);
            values.push(`%${filters.genre}%`);
            idx++;
        }

        const whereClause =
            conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";
        const sql = `SELECT * FROM banners ${whereClause} ORDER BY "order" ASC, created_at DESC;`;

        const res = await dbPool.query<IBannerRow>(sql, values);
        return res.rows.map(mapRowToBanner);
    } catch (error) {
        console.error("Direct DB query for banners failed:", error);
        return [];
    }
}

export async function createBannerInDb(data: ICreateBannerPayload): Promise<IBanner> {
    const id = crypto.randomUUID();
    const now = new Date();
    const sql = `
        INSERT INTO banners (
            id, title, synopsis, image_url, poster_url, rating,
            release_year, duration, genre, pricing, youtube_link,
            director, link_url, is_active, "order", created_at, updated_at
        ) VALUES (
            $1, $2, $3, $4, $5, $6,
            $7, $8, $9, $10, $11,
            $12, $13, $14, $15, $16, $17
        ) RETURNING *;
    `;
    const values = [
        id,
        data.title,
        data.synopsis || null,
        data.imageUrl,
        data.posterUrl || null,
        data.rating ?? 0,
        data.releaseYear ?? null,
        data.duration ?? null,
        data.genre || null,
        data.pricing || "FREE",
        data.youtubeLink || null,
        data.director || null,
        data.linkUrl || null,
        data.isActive ?? true,
        data.order ?? 0,
        now,
        now,
    ];

    const res = await dbPool.query<IBannerRow>(sql, values);
    return mapRowToBanner(res.rows[0]);
}

export async function updateBannerInDb(
    id: string,
    data: IUpdateBannerPayload
): Promise<IBanner | null> {
    const updates: string[] = [];
    const values: any[] = [];
    let idx = 1;

    if (data.title !== undefined) {
        updates.push(`title = $${idx++}`);
        values.push(data.title);
    }
    if (data.synopsis !== undefined) {
        updates.push(`synopsis = $${idx++}`);
        values.push(data.synopsis);
    }
    if (data.imageUrl !== undefined) {
        updates.push(`image_url = $${idx++}`);
        values.push(data.imageUrl);
    }
    if (data.posterUrl !== undefined) {
        updates.push(`poster_url = $${idx++}`);
        values.push(data.posterUrl);
    }
    if (data.rating !== undefined) {
        updates.push(`rating = $${idx++}`);
        values.push(data.rating);
    }
    if (data.releaseYear !== undefined) {
        updates.push(`release_year = $${idx++}`);
        values.push(data.releaseYear);
    }
    if (data.duration !== undefined) {
        updates.push(`duration = $${idx++}`);
        values.push(data.duration);
    }
    if (data.genre !== undefined) {
        updates.push(`genre = $${idx++}`);
        values.push(data.genre);
    }
    if (data.pricing !== undefined) {
        updates.push(`pricing = $${idx++}`);
        values.push(data.pricing);
    }
    if (data.youtubeLink !== undefined) {
        updates.push(`youtube_link = $${idx++}`);
        values.push(data.youtubeLink);
    }
    if (data.director !== undefined) {
        updates.push(`director = $${idx++}`);
        values.push(data.director);
    }
    if (data.linkUrl !== undefined) {
        updates.push(`link_url = $${idx++}`);
        values.push(data.linkUrl);
    }
    if (data.isActive !== undefined) {
        updates.push(`is_active = $${idx++}`);
        values.push(data.isActive);
    }
    if (data.order !== undefined) {
        updates.push(`"order" = $${idx++}`);
        values.push(data.order);
    }

    updates.push(`updated_at = $${idx++}`);
    values.push(new Date());

    values.push(id);
    const sql = `UPDATE banners SET ${updates.join(", ")} WHERE id = $${idx} RETURNING *;`;

    const res = await dbPool.query<IBannerRow>(sql, values);
    if (res.rows.length === 0) return null;
    return mapRowToBanner(res.rows[0]);
}

export async function deleteBannerInDb(id: string): Promise<boolean> {
    const res = await dbPool.query(`DELETE FROM banners WHERE id = $1;`, [id]);
    return (res.rowCount ?? 0) > 0;
}
