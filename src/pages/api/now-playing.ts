import type { APIRoute } from "astro";
import { getNowPlaying } from "../../lib/spotify";

export const prerender = false; // Forces SSR for this route only in default static/hybrid build

export const GET: APIRoute = async (context) => {
    // Determine runtime environment (Cloudflare locals vs Local Node import.meta.env)
    const env = (context.locals as any)?.runtime?.env || import.meta.env;

    const keys = {
        client_id: env.SPOTIFY_CLIENT_ID,
        client_secret: env.SPOTIFY_CLIENT_SECRET,
        refresh_token: env.SPOTIFY_REFRESH_TOKEN,
    };

    const data = await getNowPlaying(keys);
    return new Response(JSON.stringify(data), {
        headers: {
            "Content-Type": "application/json",
            "Cache-Control": "public, s-maxage=10, stale-while-revalidate=5",
        },
    });
};
