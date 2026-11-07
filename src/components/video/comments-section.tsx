"use client";

import { useState } from "react";
import { MessageSquare, ExternalLink } from "lucide-react";
import { RealAvatar } from "@/components/ui/media";
import type { WpComment } from "@/data/wp";

interface CommentsSectionProps {
  videoId: string;
  /** Real comments from /wp/v2/comments?post= — server-fetched. */
  initialComments: WpComment[];
  /** Link to the video on bazziba.it (commenting happens there — WP REST posting needs auth). */
  sourceUrl?: string;
}

function timeAgoIT(iso: string): string {
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return "";
  const mins = Math.max(1, Math.floor((Date.now() - then) / 60000));
  if (mins < 60) return `${mins} min fa`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} ore fa`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days} giorni fa`;
  return new Date(iso).toLocaleDateString("it-IT");
}

export function CommentsSection({ videoId, initialComments, sourceUrl }: CommentsSectionProps) {
  const [notice, setNotice] = useState(false);
  const comments = initialComments;

  return (
    <div className="space-y-4 pt-2">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <MessageSquare className="h-4 w-4" />
        <span className="font-medium text-white">{comments.length} Commenti</span>
      </div>

      {comments.length === 0 ? (
        <p className="text-sm text-white/30 py-4">Nessun commento — sii il primo a commentare su bazziba.it.</p>
      ) : (
        <div className="space-y-4">
          {comments.map((c) => (
            <div key={c.id} className="flex gap-3">
              <RealAvatar
                src={c.author_avatar_urls?.["48"] ?? null}
                name={c.author_name || "Utente"}
                className="w-8 h-8 rounded-full flex-shrink-0 text-[10px]"
              />
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-white">{c.author_name || "Utente"}</span>
                  <span className="text-xs text-muted-foreground">{timeAgoIT(c.date)}</span>
                </div>
                {/* Real WP comment HTML — trusted source (bazziba.it), sanitized server-side by WP */}
                <div
                  className="text-sm text-muted-foreground mt-0.5 [&_a]:text-[#00f2ff] [&_a]:underline break-words"
                  dangerouslySetInnerHTML={{ __html: c.content.rendered }}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-2 pt-2 border-t border-white/5">
        <input
          type="text"
          placeholder="Scrivi un commento..."
          onFocus={() => setNotice(true)}
          readOnly
          className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#00f2ff] transition-colors cursor-pointer"
        />
        <a
          href={sourceUrl ?? `https://bazziba.it/?p=${videoId}`}
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2.5 bg-[#00f2ff] text-black font-medium rounded-lg text-sm hover:bg-[#00d4e6] transition-colors flex items-center justify-center gap-1.5"
        >
          <ExternalLink className="h-3.5 w-3.5" />
          Commenta
        </a>
      </div>
      {notice && (
        <p className="text-xs text-white/40">
          I commenti si scrivono su bazziba.it — il pulsante apre il video sul sito sorgente.
        </p>
      )}
    </div>
  );
}
