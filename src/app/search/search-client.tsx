/** @format */

"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, Video, User, Tag } from "lucide-react";
import { VideoCard } from "@/components/video/video-card";
import { LoadMoreVideos } from "@/components/video/load-more";
import { RealAvatar } from "@/components/ui/media";
import type { BazzibaVideo, WpUser, WpTerm } from "@/data/wp";

interface SearchClientProps {
  query: string;
  videos: BazzibaVideo[];
  users: WpUser[];
  categories: WpTerm[];
}

export default function SearchClient({ query, videos, users, categories }: SearchClientProps) {
  const [activeTab, setActiveTab] = useState<"all" | "videos" | "users" | "categories">("all");
  const totalResults = videos.length + users.length + categories.length;

  const showVideos = activeTab === "all" || activeTab === "videos";
  const showUsers = activeTab === "all" || activeTab === "users";
  const showCats = activeTab === "all" || activeTab === "categories";

  return (
    <div className="min-h-screen bg-[#050a14] text-white">
      <div className="py-8">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="mb-8">
            <form action="/search" method="get" className="relative max-w-2xl mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/30" />
              <input
                name="q"
                defaultValue={query}
                placeholder="Cerca video, utenti, categorie..."
                className="w-full pl-12 h-12 rounded-full border-2 border-white/10 focus:border-[#00f2ff] bg-white/5 text-white focus:outline-none"
                autoFocus
              />
            </form>
            {query && (
              <p className="text-sm text-white/50 mt-3 text-center">
                {totalResults} risultati per &quot;{query}&quot;
              </p>
            )}
          </div>

          {query.length > 0 && (
            <>
              <div className="border-b border-white/5 mb-6">
                <nav className="flex gap-2 overflow-x-auto pb-2">
                  {([
                    { id: "all", label: "Tutto", icon: Search },
                    { id: "videos", label: `Video (${videos.length})`, icon: Video },
                    { id: "users", label: `Utenti (${users.length})`, icon: User },
                    { id: "categories", label: `Categorie (${categories.length})`, icon: Tag },
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
                {showVideos && videos.length > 0 && (
                  <section>
                    <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                      <Video className="h-5 w-5 text-[#00f2ff]" />
                      Video
                    </h2>
                    <LoadMoreVideos
                      initialVideos={videos}
                      scope="search"
                      query={query}
                      perPage={24}
                      showAuthor
                    />
                  </section>
                )}

                {showUsers && users.length > 0 && (
                  <section>
                    <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                      <User className="h-5 w-5 text-[#00f2ff]" />
                      Utenti
                    </h2>
                    <div className="space-y-3">
                      {users.map((user) => (
                        <div
                          key={user.id}
                          className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-colors"
                        >
                          <RealAvatar
                            src={user.avatar_urls?.["48"] ?? null}
                            name={user.name}
                            className="w-12 h-12 rounded-full ring-2 ring-white/10 text-sm"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="font-medium">{user.name}</p>
                            {user.description && (
                              <p className="text-sm text-white/50 line-clamp-1">{user.description}</p>
                            )}
                          </div>
                          <Link href={`/u/${user.slug}`} className="text-sm text-[#00f2ff] hover:underline">
                            Vai al profilo →
                          </Link>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {showCats && categories.length > 0 && (
                  <section>
                    <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                      <Tag className="h-5 w-5 text-[#00f2ff]" />
                      Categorie
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {categories.map((cat) => (
                        <Link
                          key={cat.id}
                          href={`/c/${cat.slug}`}
                          className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-[#00f2ff]/30 transition-colors"
                        >
                          <div className="w-3 h-3 rounded-full mb-2 bg-[#00f2ff]" />
                          <p className="font-medium text-sm">{cat.name}</p>
                          <p className="text-xs text-white/50 mt-1">{cat.count} video</p>
                        </Link>
                      ))}
                    </div>
                  </section>
                )}

                {totalResults === 0 && (
                  <div className="text-center py-20">
                    <Search className="h-12 w-12 text-white/20 mx-auto mb-4" />
                    <p className="text-white/50">Nessun risultato per &quot;{query}&quot;</p>
                    <p className="text-sm text-white/30 mt-1">Prova con altri termini di ricerca</p>
                  </div>
                )}
              </div>
            </>
          )}

          {query.length === 0 && (
            <div className="text-center py-20">
              <Search className="h-16 w-16 text-white/20 mx-auto mb-6" />
              <h2 className="text-2xl font-bold text-white mb-2">Cerca su Bazziba</h2>
              <p className="text-white/50 mb-8 max-w-md mx-auto">
                Trova video, utenti e categorie nella community artistica di bazziba.it
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
