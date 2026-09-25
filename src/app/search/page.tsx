"use client";

import { useState, useEffect } from "react";
import { Search, Video, User, Tag, Clock } from "lucide-react";
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

  return (
    <div className="py-6">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
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
                className="pl-10"
                autoFocus
              />
            </form>
          </div>
        </div>

        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-yellow mx-auto"></div>
            <p className="text-muted-foreground mt-4">Ricerca in corso...</p>
          </div>
        )}

        {!loading && query.length > 0 && (
          <>
            <div className="border-b mb-6">
              <nav className="flex gap-6">
                {(["all", "videos", "users", "categories"] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`py-3 px-1 border-b-2 font-medium text-sm ${
                      activeTab === tab
                        ? "border-brand-yellow text-brand-yellow"
                        : "border-transparent text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </nav>
            </div>

            <div className="space-y-8">
              {filteredResults.videos.length > 0 && (
                <section>
                  <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <Video className="h-5 w-5" />
                    Video ({filteredResults.videos.length})
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredResults.videos.map((video) => (
                      <VideoCard key={video.id} video={video} />
                    ))}
                  </div>
                </section>
              )}

              {filteredResults.users.length > 0 && (
                <section>
                  <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Utenti ({filteredResults.users.length})
                  </h2>
                  <div className="space-y-4">
                    {filteredResults.users.map((user) => (
                      <div key={user.id} className="flex items-center gap-4 p-4 rounded-lg bg-card">
                        <img
                          src={user.image || "/placeholder.png"}
                          alt={user.username}
                          className="w-12 h-12 rounded-full"
                        />
                        <div>
                          <p className="font-medium">{user.name || user.username}</p>
                          <p className="text-sm text-muted-foreground">
                            @{user.username} • {user.videoCount} video
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {filteredResults.categories.length > 0 && (
                <section>
                  <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <Tag className="h-5 w-5" />
                    Categorie ({filteredResults.categories.length})
                  </h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {filteredResults.categories.map((cat) => (
                      <div key={cat.id} className="p-4 border rounded-lg text-center hover:bg-accent">
                        <h3 className="font-medium">{cat.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {cat._count?.videos} video
                        </p>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {filteredResults.videos.length === 0 &&
                filteredResults.users.length === 0 &&
                filteredResults.categories.length === 0 &&
                query.length > 0 && (
                  <div className="text-center py-12">
                    <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">
                      Nessun risultato trovato per "{query}"
                    </p>
                  </div>
                )}
            </div>
          </>
        )}

        {!loading && query.length === 0 && (
          <div className="text-center py-12">
            <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              Inserisci un termine di ricerca per iniziare
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
