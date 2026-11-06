/** @format */

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, Video, User, Tag, Clock, Filter } from "lucide-react";
import { VideoCard } from "@/components/video/video-card";
import { Input } from "@/components/ui";

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
      // Simulate search - in production would call search API
      const timer = setTimeout(() => {
        setResults({
          videos: [
            {
              id: "vid-1",
              title: `Risultato per "${query}"`,
              slug: "result-1",
              description: "Video trovato",
              thumbnail: "https://picsum.photos/seed/search1/400/225",
              duration: 180,
              viewCount: "12.5K",
              status: "PUBLISHED",
              visibility: "PUBLIC",
              authorId: "user-1",
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              author: { id: "user-1", username: "test", name: "Test User", image: "https://i.pravatar.com/64?img=1" },
              category: { id: "cat-1", name: "Test", slug: "test", color: "#00f2ff" },
              tags: [],
            },
          ],
          users: [
            {
              id: "user-1",
              username: "test_user",
              name: "Test User",
              image: "https://i.pravatar.com/64?img=1",
              bio: "Utente di test",
              videoCount: 5,
            },
          ],
          categories: [
            {
              id: "cat-1",
              name: "Test Category",
              slug: "test",
              color: "#00f2ff",
              videoCount: 10,
            },
          ],
        });
        setLoading(false);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [query]);

  const totalResults = results.videos.length + results.users.length + results.categories.length;

  return (
    <div className="min-h-screen bg-[#050a14] text-white">
      {/* Local header removed: the root layout GlassNav is the single docked
          surface per page (ADR-0001 §6.4/§8) — this page had two stacked headers. */}

      <div className="py-8">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="mb-8">
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/30" />
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
                  className="pl-12 h-12 rounded-full border-2 focus:border-[#00f2ff]"
                  autoFocus
                />
              </form>
            </div>
            {query && !loading && totalResults > 0 && (
              <p className="text-sm text-white/50 mt-3 text-center">
                {totalResults} risultati per "{query}"
              </p>
            )}
          </div>

          {loading && (
            <div className="text-center py-16">
              <div className="inline-flex items-center gap-3">
                <div className="animate-spin rounded-full h-6 w-6 border-2 border-[#00f2ff] border-t-transparent"></div>
                <span className="text-white/50">Ricerca in corso...</span>
              </div>
            </div>
          )}

          {!loading && query.length > 0 && (
            <>
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
                            ? "border-[#00f2ff] text-white"
                            : "border-transparent text-white/50 hover:text-white hover:bg-white/5"
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
                {results.videos.length > 0 && (
                  <section>
                    <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                      <Video className="h-5 w-5 text-[#00f2ff]" />
                      Video ({results.videos.length})
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                      {results.videos.map((video) => (
                        <VideoCard key={video.id} video={video} size="sm" />
                      ))}
                    </div>
                  </section>
                )}

                {results.users.length > 0 && (
                  <section>
                    <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                      <User className="h-5 w-5 text-[#00f2ff]" />
                      Utenti ({results.users.length})
                    </h2>
                    <div className="space-y-3">
                      {results.users.slice(0, 10).map((user) => (
                        <div
                          key={user.id}
                          className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-colors"
                        >
                          <img
                            src={user.image || "/placeholder.png"}
                            alt={user.username}
                            className="w-12 h-12 rounded-full object-cover ring-2 ring-white/10"
                          />
                          <div className="flex-1">
                            <p className="font-medium">{user.name || user.username}</p>
                            <p className="text-sm text-white/50">
                              @{user.username} {user.videoCount !== undefined && `• ${user.videoCount} video`}
                            </p>
                          </div>
                          <Link
                            href={`/u/${user.username}`}
                            className="text-sm text-[#00f2ff] hover:underline"
                          >
                            Vai al profilo →
                          </Link>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {results.categories.length > 0 && (
                  <section>
                    <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                      <Tag className="h-5 w-5 text-[#00f2ff]" />
                      Categorie ({results.categories.length})
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {results.categories.map((cat) => (
                        <Link
                          key={cat.id}
                          href={`/c/${cat.slug}`}
                          className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-[#00f2ff]/30 transition-colors"
                        >
                          <div
                            className="w-3 h-3 rounded-full mb-2"
                            style={{ backgroundColor: cat.color || "#00f2ff" }}
                          />
                          <p className="font-medium text-sm">{cat.name}</p>
                          <p className="text-xs text-white/50 mt-1">{cat.videoCount} video</p>
                        </Link>
                      ))}
                    </div>
                  </section>
                )}

                {results.videos.length === 0 && results.users.length === 0 && results.categories.length === 0 && (
                  <div className="text-center py-20">
                    <Search className="h-12 w-12 text-white/20 mx-auto mb-4" />
                    <p className="text-white/50">Nessun risultato per "{query}"</p>
                    <p className="text-sm text-white/30 mt-1">Prova con altri termini di ricerca</p>
                  </div>
                )}
              </div>
            </>
          )}

          {!loading && query.length === 0 && (
            <div className="text-center py-20">
              <Search className="h-16 w-16 text-white/20 mx-auto mb-6" />
              <h2 className="text-2xl font-bold text-white mb-2">Cerca su Bazziba</h2>
              <p className="text-white/50 mb-8 max-w-md mx-auto">
                Trova video, utenti e categorie nella nostra community artistica
              </p>
              <div className="max-w-md mx-auto">
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Cosa cerchi oggi?"
                  className="pl-12 h-14 rounded-full border-2 text-lg focus:border-[#00f2ff]"
                  autoFocus
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
