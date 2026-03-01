import { useState, useMemo } from "react";
import Fuse from "fuse.js";

interface Post {
    slug: string;
    title: string;
    description: string;
    date: string;
    tags: string[];
}

interface SearchBarProps {
    posts: Post[];
}

function highlightMatches(
    text: string,
    indices: readonly [number, number][] | undefined
): React.ReactNode {
    if (!indices || indices.length === 0) return text;
    const result: React.ReactNode[] = [];
    let lastIndex = 0;
    for (const [start, end] of indices) {
        if (start > lastIndex) result.push(text.substring(lastIndex, start));
        result.push(
            <mark key={`${start}-${end}`} className="bg-transparent text-[var(--color-accent)] font-medium underline underline-offset-2">
                {text.substring(start, end + 1)}
            </mark>
        );
        lastIndex = end + 1;
    }
    if (lastIndex < text.length) result.push(text.substring(lastIndex));
    return result;
}

export default function SearchBar({ posts }: SearchBarProps) {
    const [query, setQuery] = useState("");

    const fuse = useMemo(
        () =>
            new Fuse(posts, {
                keys: [
                    { name: "title", weight: 2 },
                    { name: "description", weight: 1 },
                    { name: "tags", weight: 0.5 },
                ],
                threshold: 0.3,
                includeScore: true,
                includeMatches: true,
            }),
        [posts]
    );

    const results = useMemo(() => {
        if (!query.trim()) return posts.map((p) => ({ item: p, matches: undefined }));
        return fuse.search(query).map((r) => ({ item: r.item, matches: r.matches }));
    }, [query, fuse, posts]);

    function getMatchIndices(matches: Fuse.FuseResultMatch[] | undefined, key: string) {
        if (!matches) return undefined;
        return matches.find((m) => m.key === key)?.indices;
    }

    return (
        <div className="w-full">
            <input
                type="text"
                placeholder="search..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full bg-transparent border-b border-[var(--color-border)] pb-2 text-sm font-[var(--font-mono)] text-[var(--color-foreground)] placeholder:text-[var(--color-muted-foreground)] focus:outline-none focus:border-[var(--color-accent)] transition-colors"
                autoFocus
            />

            <p className="text-xs text-[var(--color-muted-foreground)] mt-3 mb-6" style={{ fontFamily: "var(--font-mono)" }}>
                {query.trim()
                    ? `${results.length} result${results.length !== 1 ? "s" : ""} for "${query}"`
                    : `${posts.length} posts`}
            </p>

            <div className="space-y-5">
                {results.map(({ item: post, matches }) => (
                    <a key={post.slug} href={`/blog/${post.slug}`} className="block group">
                        <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1">
                            <span className="text-sm text-[var(--color-foreground)] group-hover:text-[var(--color-accent)] transition-colors" style={{ fontFamily: "var(--font-mono)" }}>
                                {query.trim()
                                    ? highlightMatches(post.title, getMatchIndices(matches, "title"))
                                    : post.title}
                            </span>
                            <span className="text-xs text-[var(--color-muted-foreground)] tabular-nums" style={{ fontFamily: "var(--font-mono)" }}>
                                {new Date(post.date).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                            </span>
                        </div>
                        <p className="text-xs text-[var(--color-muted-foreground)] mt-1" style={{ fontFamily: "var(--font-mono)" }}>
                            {query.trim()
                                ? highlightMatches(post.description, getMatchIndices(matches, "description"))
                                : post.description}
                        </p>
                    </a>
                ))}

                {results.length === 0 && query.trim() && (
                    <p className="text-xs text-[var(--color-muted-foreground)]" style={{ fontFamily: "var(--font-mono)" }}>
                        no results for "{query}"
                    </p>
                )}
            </div>
        </div>
    );
}
