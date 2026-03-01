import React, { useEffect, useState } from "react";
import { Music } from "lucide-react";

type SpotifyData = {
    isPlaying: boolean;
    title?: string;
    artist?: string;
    albumImageUrl?: string;
    songUrl?: string;
    track_id?: string;
};

export default function SpotifyWidget() {
    const [data, setData] = useState<SpotifyData | null>(null);

    useEffect(() => {
        const fetchSpotify = async () => {
            try {
                const res = await fetch(`/api/now-playing`);
                const json = await res.json();
                setData(json);
            } catch (error) {
                console.error("Failed to fetch Spotify data:", error);
            }
        };

        fetchSpotify();
        // Poll every 10 seconds for live updates
        const interval = setInterval(fetchSpotify, 10000);
        return () => clearInterval(interval);
    }, []);

    if (!data) {
        return (
            <div className="flex items-center gap-3 p-3 rounded-xl border border-border/50 bg-background/50 h-[72px] animate-pulse">
                <div className="w-10 h-10 bg-muted rounded-md shrink-0"></div>
                <div className="space-y-2 flex-1">
                    <div className="h-3 w-24 bg-muted rounded"></div>
                    <div className="h-2 w-16 bg-muted rounded"></div>
                </div>
            </div>
        );
    }

    // Not playing anything
    if (!data.isPlaying) {
        return (
            <div className="flex items-center gap-3 p-3 rounded-xl border border-border/50 bg-accent/5 h-[72px]">
                <div className="w-10 h-10 bg-muted rounded-md flex items-center justify-center shrink-0">
                    <Music className="w-5 h-5 text-muted-foreground" />
                </div>
                <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-0.5">Spotify</span>
                    <span className="text-sm text-muted-foreground truncate w-full">Not playing</span>
                </div>
            </div>
        );
    }

    return (
        <a
            href={data.songUrl || `https://open.spotify.com/track/${data.track_id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-3 rounded-xl border border-border/50 bg-accent/5 transition-colors hover:bg-accent/10 h-[72px] group"
        >
            <div className="relative w-10 h-10 shrink-0 overflow-hidden rounded-md">
                <img
                    src={data.albumImageUrl}
                    alt={data.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Music className="w-4 h-4 text-white" />
                </div>
            </div>
            <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
                <span className="text-xs font-semibold text-green-500 uppercase tracking-wider mb-0.5 flex items-center gap-1.5">
                    <span className="relative flex h-2 w-2 shrink-0 ml-1">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                    </span>
                    Currently Playing
                </span>
                <span className="text-sm font-medium text-foreground truncate">{data.title}</span>
                <span className="text-xs text-muted-foreground truncate">{data.artist}</span>
            </div>
        </a>
    );
}
