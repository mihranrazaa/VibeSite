const TOKEN_ENDPOINT = "https://accounts.spotify.com/api/token";
const NOW_PLAYING_ENDPOINT = "https://api.spotify.com/v1/me/player/currently-playing";

const getAccessToken = async (client_id: string, client_secret: string, refresh_token: string) => {
    if (!client_id || !client_secret || !refresh_token) {
        throw new Error("Missing Spotify env vars (SPOTIFY_CLIENT_ID/SECRET/REFRESH_TOKEN)");
    }

    const basic = btoa(`${client_id}:${client_secret}`);
    const response = await fetch(TOKEN_ENDPOINT, {
        method: "POST",
        headers: {
            Authorization: `Basic ${basic}`,
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
            grant_type: "refresh_token",
            refresh_token,
        }),
    });

    return response.json();
};

export const getNowPlaying = async ({ client_id, client_secret, refresh_token }: { client_id?: string, client_secret?: string, refresh_token?: string }) => {
    try {
        if (!client_id || !client_secret || !refresh_token) return { isPlaying: false };
        const { access_token } = await getAccessToken(client_id, client_secret, refresh_token);

        const response = await fetch(NOW_PLAYING_ENDPOINT, {
            headers: {
                Authorization: `Bearer ${access_token}`,
            },
        });

        if (response.status === 204 || response.status > 400) {
            return { isPlaying: false };
        }

        const song = await response.json();

        if (!song.item) {
            return { isPlaying: false };
        }

        const isPlaying = song.is_playing;
        const title = song.item.name;
        const artist = song.item.artists.map((_artist: any) => _artist.name).join(", ");
        const album = song.item.album.name;
        const albumImageUrl = song.item.album.images[0].url;
        const songUrl = song.item.external_urls.spotify;
        const track_id = song.item.id;

        return {
            isPlaying,
            title,
            artist,
            album,
            albumImageUrl,
            songUrl,
            track_id,
        };
    } catch (error) {
        console.error("Spotify now playing error:", error);
        return { isPlaying: false };
    }
};
