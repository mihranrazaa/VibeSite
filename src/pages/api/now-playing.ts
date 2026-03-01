import { getNowPlaying } from "../../lib/spotify";

export const prerender = false; // Forces SSR for this route only in default static/hybrid build

export const GET = async () => {
    const data = await getNowPlaying();
    return new Response(JSON.stringify(data), {
        headers: {
            "Content-Type": "application/json",
            "Cache-Control": "public, s-maxage=10, stale-while-revalidate=5",
        },
    });
};
