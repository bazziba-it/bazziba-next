/** @format */

"use client";

import { useState, useEffect, useRef } from "react";
import { Search, Tag } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { MOTION } from "@/components/ui/glass";
import { searchVideos, searchUsers, fetchVideoCategories, type BazzibaVideo, type WpUser, type WpTerm } from "@/data/wp";
import { RealAvatar } from "@/components/ui/media";

export function SearchAutocomplete({ inputClassName = "" }: { inputClassName?: string }) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [videos, setVideos] = useState<BazzibaVideo[]>([]);
  const [users, setUsers] = useState<WpUser[]>([]);
  const [categories, setCategories] = useState<WpTerm[]>([]);
  const [searching, setSearching] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Load real top categories once for the empty-query dropdown
  useEffect(() => {
    fetchVideoCategories()
      .then((cats) => setCategories(cats.slice(0, 8)))
      .catch(() => setCategories([]));
  }, []);

  // Debounced real search against the WP API
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    const q = query.trim();
    if (q.length < 2) {
      setVideos([]);
      setUsers([]);
      setSearching(false);
      return;
    }
    setSearching(true);
    debounceRef.current = setTimeout(async () => {
      try {
        const [v, u] = await Promise.all([searchVideos(q, 5), searchUsers(q, 4)]);
        setVideos(v);
        setUsers(u);
      } catch {
        setVideos([]);
        setUsers([]);
      } finally {
        setSearching(false);
      }
    }, 300);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query]);

  const go = (href: string) => {
    setIsOpen(false);
    setQuery("");
    window.location.href = href;
  };

  const submit = () => {
    const q = query.trim();
    if (q) go(`/search?q=${encodeURIComponent(q)}`);
  };

  const hasResults = videos.length > 0 || users.length > 0;

  return (
    <div className="relative w-full">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          submit();
        }}
        className="relative"
      >
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="search"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onBlur={() => setTimeout(() => setIsOpen(false), 200)}
          placeholder="Cerca video, canali, categorie..."
          className={`w-full rounded-full border border-input pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-cyan bg-background transition-all duration-200 ${inputClassName}`}
        />
      </form>

      <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -6, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -6, scale: 0.98, transition: { duration: 0.12 } }}
          transition={MOTION.enter}
          className="absolute top-full mt-1 w-full rounded-xl border bg-popover shadow-lg z-50 overflow-hidden origin-top"
        >
          {query.trim().length >= 2 ? (
            <div className="py-1">
              {searching && (
                <p className="px-4 py-3 text-xs text-muted-foreground">Ricerca in corso...</p>
              )}
              {!searching && !hasResults && (
                <p className="px-4 py-3 text-sm text-muted-foreground">Nessun risultato per &quot;{query}&quot;</p>
              )}
              {videos.map((v) => (
                <button
                  key={v.id}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => go(`/watch/${v.id}`)}
                  className="w-full flex items-center gap-3 px-4 py-2 text-left hover:bg-accent transition-colors"
                >
                  <div className="w-12 h-8 bg-muted rounded overflow-hidden flex-shrink-0">
                    {v.thumbnail && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={v.thumbnail} alt="" className="w-full h-full object-cover" loading="lazy" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{v.title}</p>
                    <p className="text-xs text-muted-foreground">{v.category}</p>
                  </div>
                </button>
              ))}
              {users.map((u) => (
                <button
                  key={u.id}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => go(`/u/${u.slug}`)}
                  className="w-full flex items-center gap-3 px-4 py-2 text-left hover:bg-accent transition-colors"
                >
                  <RealAvatar src={u.avatar_urls?.["48"] ?? null} name={u.name} className="w-8 h-8 text-[10px]" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{u.name}</p>
                    <p className="text-xs text-muted-foreground">Canale</p>
                  </div>
                </button>
              ))}
              <button
                onMouseDown={(e) => e.preventDefault()}
                onClick={submit}
                className="w-full flex items-center gap-3 px-4 py-2 text-left hover:bg-accent transition-colors border-t"
              >
                <Search className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Cerca &quot;{query.trim()}&quot;</span>
              </button>
            </div>
          ) : (
            <div className="py-2">
              <p className="px-4 text-xs font-semibold text-muted-foreground mb-2">CATEGORIE POPOLARI</p>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => go(`/c/${cat.slug}`)}
                  className="w-full flex items-center gap-3 px-4 py-2 text-left hover:bg-accent transition-colors"
                >
                  <Tag className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{cat.name}</span>
                  <span className="ml-auto text-xs text-muted-foreground">{cat.count}</span>
                </button>
              ))}
            </div>
          )}
        </motion.div>
      )}
      </AnimatePresence>
    </div>
  );
}
