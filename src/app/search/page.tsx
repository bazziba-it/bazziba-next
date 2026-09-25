"use client";

import { useState, useEffect } from "react";
import { Search, Video, User, Tag, Clock, Filter } from "lucide-react";
import { VideoCard } from "@/components/video/video-card";
import { Input } from "@/components/ui";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

interface SearchResult {
  videos: any[];
  users: any[];
  categories: any[];
}

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult>({ videos: [], users: [], categories: [] });
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"all" | "videos" | "users" | "categories">("all");

  // Get query param on client side only
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setQuery(params.get("q") || "");
  }, []);

  useEffect(() => {
    if (query) {
      setLoading(true);
      fetch(`/api/search?q=${encodeURIComponent(query)}`)
        .then((res) => res.json())
        .then((data) => {
          setResults(data.result || data);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [query]);

  const filteredResults = {
    videos: activeTab === "all" || activeTab === "videos" ? results.videos : [],
    users: activeTab === "all" || activeTab === "users" ? results.users : [],
    categories: activeTab === "all" || activeTab === "categories" ? results.categories : [],
  };

  const totalResults = filteredResults.videos.length + filteredResults.users.length + filteredResults.categories.length;

  return (
    <div className="py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Search Header */}
        <div className="mb-8">
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const input = e.currentTarget.querySelector("input");
                const value = input?.value || "";
                window.location.href = `/search?q=${encodeURIComponent(value)}`;
              }}
            >
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Cerca video, utenti, categorie..."
                className="pl-12 h-12 rounded-full border-2 focus:border-primary"
                autoFocus
              />
            </form>
          </div>
          {query && !loading && totalResults > 0 && (
            <p className="text-sm text-muted-foreground mt-3 text-center">
              {totalResults} risultati per "{query}"
            </p>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-16">
            <div className="inline-flex items-center gap-3">
              <div className="animate-spin rounded-full h-6 w-6 border-2 border-brand-yellow border-t-transparent"></div>
              <span className="text-muted-foreground">Ricerca in corso...</span>
            </div>
          </div>
        )}

        {/* Search Results */}
        {!loading && query.length > 0 && (
          <>
            {/* Tabs */}
            <div className="border-b mb-6">
              <nav className="flex gap-2 overflow-x-auto pb-2">
                {([
                  { id: "all", label: "Tutto", icon: Search },
                  { id: "videos", label: "Video", icon: Video },
                  { id: "users", label: "Utenti", icon: User },
                  { id: "categories", label: "Categorie", icon: Tag },
                ] as const).map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-2 py-3 px-4 border-b-2 font-medium text-sm whitespace-nowrap rounded-t-lg transition-all ${
                        isActive
                          ? "border-brand-yellow text-brand-yellow bg-brand-yellow/5"
                          : "border-transparent text-muted-foreground hover:text-foreground hover:bg-accent"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      {tab.label}
                    </button>
                  );
                })}
              </nav>
            </div>

            <div className="space-y-10">
              {/* Videos */}
              {filteredResults.videos.length > 0 && (
                <section>
                  <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <Video className="h-5 w-5 text-primary" />
                    Video ({filteredResults.videos.length})
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {filteredResults.videos.map((video) => (
                      <VideoCard key={video.id} video={video} size="sm" />
                    ))}
                  </div>
                </section>
              )}

              {/* Users */}
              {filteredResults.users.length > 0 && (
                <section>
                  <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <User className="h-5 w-5 text-primary" />
                    Utenti ({filteredResults.users.length})
                  </h2>
                  <div className="space-y-3">
                    {filteredResults.users.slice(0, 10).map((user) => (
                      <div
                        key={user.id}
                        className="flex items-center gap-4 p-4 rounded-xl bg-card border hover:shadow-md transition-shadow"
                      >
                        <img
                          src={user.image || "/placeholder.png"}
                          alt={user.username}
                          className="w-12 h-12 rounded-full object-cover ring-2 ring-border"
                        />
                        <div className="flex-1">
                          <p className="font-medium">{user.name || user.username}</p>
                          <p className="text-sm text-muted-foreground">
                            @{user.username} • {user.videoCount} video
                          </p>
                        </div>
                        <a
                          href={`/u/${user.username}`}
                          className="text-sm text-brand-yellow hover:underline"
                        >
                          Vai al profilo →
                        </a>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Categories */}
              {filteredResults.categories.length > 0 && (
                <section>
                  <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <Tag className="h-5 w-5 text-primary" />
                    Categorie ({filteredResults.categories.length})
                  </h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {filteredResults.categories.map((cat) => (
                      <div
                        key={cat.id}
                        className="p-4 border rounded-xl text-center hover:bg-accent transition-colors"
                      >
                        <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                          <span className="text-lg font-bold text-primary">
                            {cat.name.charAt(0)}
                          </span>
                        </div>
                        <h3 className="font-medium">{cat.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {cat._count?.videos} video
                        </p>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* No Results */}
              {totalResults === 0 && (
                <div className="text-center py-16">
                  <div className="inline-flex h-16 w-16 rounded-full bg-muted items-center justify-center mb-4">
                    <Search className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Nessun risultato</h3>
                  <p className="text-muted-foreground">
                    Non abbiamo trovato risultati per "{query}".
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Prova a cercare con parole diverse o meno specifiche.
                  </p>
                </div>
              )}
            </div>
          </>
        )}

        {/* Empty State */}
        {!loading && query.length === 0 && (
          <div className="text-center py-16">
            <div className="inline-flex h-16 w-16 rounded-full bg-muted items-center justify-center mb-6">
              <Clock className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Cerca su Bazziba</h3>
            <p className="text-muted-foreground">
              Inserisci un termine di ricerca per iniziare
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Cerca video, utenti e categorie artistiche
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
