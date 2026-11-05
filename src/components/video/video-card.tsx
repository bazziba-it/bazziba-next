import type { Video, Category } from "@/types";

interface VideoProps {
  video: Video;
  showAuthor?: boolean;
}

export function VideoCard({ video, showAuthor }: VideoProps) {
  const thumb = video.thumbnail || "https://picsum.photos/seed/fallback/400/225";
  const dur = video.duration ? `${Math.floor(video.duration / 60)}:${(video.duration % 60).toString().padStart(2, "0")}` : "--:--";

  return (
    <a
      href={`/watch/${video.id}`}
      className="group block bg-[#0a0e1a] border border-white/5 rounded-xl overflow-hidden hover:border-[#00f2ff]/20 transition-all hover:shadow-lg hover:shadow-black/30"
    >
      <div className="relative aspect-video overflow-hidden">
        <img
          src={thumb}
          alt={video.title}
          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-1.5 py-0.5 rounded font-mono">
          {dur}
        </div>
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-[0] group-hover:opacity-[1] transition-opacity">
          <div className="w-12 h-12 rounded-full bg-[#00f2ff]/90 flex items-center justify-center">
            <svg className="w-6 h-6 text-black ml-0.5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
      </div>
      <div className="p-3">
        <h3 className="font-semibold text-sm line-clamp-2 text-white group-hover:text-[#00f2ff] transition-colors">
          {video.title}
        </h3>
        {showAuthor && video.author && (
          <p className="text-xs text-white/40 mt-1">{video.author.name}</p>
        )}
        {video.category && (
          <span className="inline-block mt-1.5 text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-[#00f2ff]/10 text-[#00f2ff]">
            {video.category.name}
          </span>
        )}
      </div>
    </a>
  );
}

interface VideoGridProps {
  videos: Video[];
  title?: string;
  showAuthor?: boolean;
  emptyMessage?: string;
  onLoadMore?: () => void;
  hasMore?: boolean;
}

export function VideoGrid({
  videos,
  title,
  showAuthor,
  emptyMessage = "Nessun video disponibile",
  onLoadMore,
  hasMore,
}: VideoGridProps) {
  return (
    <div>
      {title && (
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#00f2ff]" />
          {title}
        </h2>
      )}
      {videos.length === 0 ? (
        <p className="text-center py-12 text-white/40">{emptyMessage}</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {videos.map((video) => (
            <VideoCard key={video.id} video={video} showAuthor={showAuthor} />
          ))}
        </div>
      )}
      {hasMore && onLoadMore && (
        <div className="text-center py-8 mt-8">
          <button
            onClick={onLoadMore}
            className="px-6 py-3 bg-[#00f2ff]/10 text-[#00f2ff] font-medium rounded-full hover:bg-[#00f2ff]/20 transition-colors text-sm"
          >
            Carica altri video
          </button>
        </div>
      )}
    </div>
  );
}

interface CategoryGridProps {
  categories: Category[];
  activeCategory?: string;
  onSelect?: (slug: string) => void;
}

export function CategoryGrid({ categories, activeCategory, onSelect }: CategoryGridProps) {
  return (
    <div className="sticky top-24">
      <h3 className="text-sm font-semibold text-white/40 uppercase tracking-wider mb-3 px-2">Categorie</h3>
      <div className="space-y-1">
        <button
          onClick={() => onSelect?.("all")}
          className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
            activeCategory === "all" ? "bg-[#00f2ff]/10 text-[#00f2ff]" : "text-white/60 hover:text-white hover:bg-white/5"
          }`}
        >
          Tutti
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => onSelect?.(cat.slug)}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center gap-2 ${
              activeCategory === cat.slug ? "bg-[#00f2ff]/10 text-[#00f2ff]" : "text-white/60 hover:text-white hover:bg-white/5"
            }`}
          >
            <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: cat.color || "#00f2ff" }} />
            {cat.name}
            <span className="ml-auto text-xs text-white/30">{cat.videoCount}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
