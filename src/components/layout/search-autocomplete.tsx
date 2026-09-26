"use client";

import { useState, useRef, useEffect } from "react";
import { Search, Clock, TrendingUp } from "lucide-react";
import Link from "next/link";

const popularSearches = [
  "Musa Urbana",
  "Pittura astrale",
  "Danza urbana",
  "Cover canzoni",
  "Arte digitale",
  "Poesia sonora",
  "DJ set",
  "Performance live",
  "Video art",
  "Musica indie",
];

const mockResults = [
  { id: 1, type: "video", title: "Il Canto dell'Anima - Performance Live", views: "1.2K", href: "/watch/vid-1" },
  { id: 2, type: "channel", title: "Elena Rossi", href: "/u/elena_arte", verified: true },
  { id: 3, type: "video", title: "Pittura Astrale - Il Viaggio di un Artista", views: "892", href: "/watch/vid-2" },
  { id: 4, type: "category", title: "Cantanti", href: "/c/cantanti" },
  { id: 5, type: "video", title: "Danza Contemporanea - Spazio e Movimento", views: "2.1K", href: "/watch/vid-3" },
];

export function SearchAutocomplete() {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState<typeof mockResults>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (query.length > 1) {
      // Simulate search results
      const filtered = mockResults.filter(
        (r) => r.title.toLowerCase().includes(query.toLowerCase())
      );
      setResults(filtered.length > 0 ? filtered : mockResults.slice(0, 3));
    } else {
      setResults([]);
    }
  }, [query]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(query)}`;
    }
  };

  const handleResultClick = (href: string) => {
    setIsOpen(false);
    setQuery("");
    window.location.href = href;
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <form onSubmit={handleSearch} className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          ref={inputRef}
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsOpen(true)}
          onBlur={() => setTimeout(() => setIsOpen(false), 200)}
          placeholder="Cerca video, canali, categorie..."
          className="w-full rounded-full border border-input pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-yellow bg-background transition-all duration-200"
        />
      </form>

      {isOpen && (
        <div className="absolute top-full mt-1 w-full rounded-xl border bg-popover shadow-lg z-50 overflow-hidden">
          {query.length > 1 && results.length > 0 ? (
            <div className="py-1">
              {results.map((result) => (
                <button
                  key={result.id}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => handleResultClick(result.href)}
                  className="w-full flex items-center gap-3 px-4 py-2 text-left hover:bg-accent transition-colors"
                >
                  <div className="flex-shrink-0">
                    {result.type === "video" ? (
                      <div className="w-12 h-8 bg-muted rounded overflow-hidden flex items-center justify-center">
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                      </div>
                    ) : (
                      <div className="w-8 h-8 bg-brand-yellow/20 rounded-full flex items-center justify-center">
                        <span className="text-xs font-bold text-brand-yellow">
                          {result.type === "channel" ? "C" : "C"}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{result.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {result.type === "video" && `${result.views} visualizzazioni`}
                      {result.type === "channel" && "Canale"}
                      {result.type === "category" && "Categoria"}
                    </p>
                  </div>
                </button>
              ))}

              {query && (
                <button
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => handleSearch({ preventDefault: () => {} } as any)}
                  className="w-full flex items-center gap-3 px-4 py-2 text-left hover:bg-accent transition-colors border-t"
                >
                  <Search className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Cerca "{query}"</span>
                </button>
              )}
            </div>
          ) : query.length === 0 ? (
            <div className="py-2">
              <p className="px-4 text-xs font-semibold text-muted-foreground mb-2">RICERCHE POPULARI</p>
              {popularSearches.map((search, i) => (
                <button
                  key={search}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => {
                    setQuery(search);
                    handleSearch({ preventDefault: () => {} } as any);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2 text-left hover:bg-accent transition-colors"
                >
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{search}</span>
                </button>
              ))}
            </div>
          ) : (
            <div className="py-4 text-center text-sm text-muted-foreground">
              Nessun risultato per "{query}"
            </div>
          )}
        </div>
      )}
    </div>
  );
}
