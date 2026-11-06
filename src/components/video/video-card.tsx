import type { BazzibaVideo, WpTerm } from "@/data/wp";
import { GlassCard } from "@/components/ui";
import { ThumbPlaceholder, RealAvatar } from "@/components/ui/media";

interface VideoCardProps {
  video: BazzibaVideo;
  showAuthor?: boolean;
  /** §5.4 grid stagger position — capped inside GlassCard. */
  staggerIndex?: number;
}

export function VideoCard({ video, showAuthor, staggerIndex }: VideoCardProps) {
  return (
    <GlassCard staggerIndex={staggerIndex} scrollList className="overflow-hidden">
      <a href={`/watch/${video.id}`} className="group block">
        <div className="relative aspect-video overflow-hidden bg-black">
          {video.thumbnail ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={video.thumbnail}
              alt={video.title}
              className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
          ) : (
            <ThumbPlaceholder title={video.title} className="h-full w-full" />
          )}
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="w-12 h-12 rounded-full bg-[#00f2ff]/90 flex items-center justify-center">
              <svg className="w-6 h-6 text-black ml-0.5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>
          {video.tags.includes("in-evidenza") && (
            <span className="absolute top-2 left-2 bg-[#00f2ff] text-[#050a14] text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">
              In evidenza
            </span>
          )}
        </div>
        <div className="p-3">
          <h3 className="font-semibold text-sm line-clamp-2 text-white group-hover:text-[#00f2ff] transition-colors">
            {video.title}
          </h3>
          {showAuthor && (
            <div className="flex items-center gap-2 mt-2">
              <RealAvatar src={video.authorAvatar} name={video.authorName} className="w-5 h-5 text-[9px]" />
              <p className="text-xs text-white/40 truncate">{video.authorName}</p>
            </div>
          )}
          {video.categorySlug && (
            <span className="inline-block mt-1.5 text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-[#00f2ff]/10 text-[#00f2ff]">
              {video.category}
            </span>
          )}
        </div>
      </a>
    </GlassCard>
  );
}

interface VideoGridProps {
  videos: BazzibaVideo[];
  title?: string;
  showAuthor?: boolean;
  emptyMessage?: string;
}

export function VideoGrid({
  videos,
  title,
  showAuthor,
  emptyMessage = "Nessun video disponibile",
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
          {videos.map((video, i) => (
            <VideoCard key={video.id} video={video} showAuthor={showAuthor} staggerIndex={i} />
          ))}
        </div>
      )}
    </div>
  );
}

interface CategoryGridProps {
  categories: WpTerm[];
  activeCategory?: string;
  className?: string;
}

/** Real video_category terms sidebar (links to /c/[slug]). */
export function CategoryGrid({ categories, activeCategory, className = "" }: CategoryGridProps) {
  return (
    <div className={`sticky top-24 ${className}`}>
      <h3 className="text-sm font-semibold text-white/40 uppercase tracking-wider mb-3 px-2">Categorie</h3>
      <div className="space-y-1">
        <a
          href="/feed"
          className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
            !activeCategory ? "bg-[#00f2ff]/10 text-[#00f2ff]" : "text-white/60 hover:text-white hover:bg-white/5"
          }`}
        >
          Tutti
        </a>
        {categories.map((cat) => (
          <a
            key={cat.id}
            href={`/c/${cat.slug}`}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center gap-2 ${
              activeCategory === cat.slug ? "bg-[#00f2ff]/10 text-[#00f2ff]" : "text-white/60 hover:text-white hover:bg-white/5"
            }`}
          >
            <span className="w-2 h-2 rounded-full flex-shrink-0 bg-[#00f2ff]/50" />
            {cat.name}
            <span className="ml-auto text-xs text-white/30">{cat.count}</span>
          </a>
        ))}
      </div>
    </div>
  );
}
