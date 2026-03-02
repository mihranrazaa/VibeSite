import type { APIRoute } from "astro";
import { getNowPlaying } from "../../lib/spotify";

export const prerender = false; // Forces SSR for this route only in default static/hybrid build

export const GET: APIRoute = async (context) => {
    // CORS: Only allow requests from our own origin
    const origin = context.request.headers.get("origin");
    const referer = context.request.headers.get("referer");
    const siteUrl = import.meta.env.SITE || "https://mihranrazaa.info";

    // Allow same-origin requests (no origin header) and requests from our domain
    if (origin && !origin.startsWith(siteUrl)) {
        return new Response(JSON.stringify({ error: "Forbidden" }), {
            status: 403,
            headers: { "Content-Type": "application/json" },
        });
    }

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
            "X-Content-Type-Options": "nosniff",
            "X-Frame-Options": "DENY",
        },
    });
};
