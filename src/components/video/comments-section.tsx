import type { BazzibaVideo } from "@/data/wp";
import { useState } from "react";
import { MessageSquare } from "lucide-react";

interface CommentsSectionProps {
  videoId: string;
  commentCount: number;
}

export function CommentsSection({ videoId, commentCount }: CommentsSectionProps) {
  const [comments, setComments] = useState<Array<{ id: string; user: string; text: string; time: string }>>([
    { id: "1", user: "AnnaM_arts", text: "Bellissimo lavoro! I colori sono straordinari 🔥", time: "2 ore fa" },
    { id: "2", user: "Marco_Video", text: "Che tecnica!! Consegna pure il tutorial 😍", time: "5 ore fa" },
    { id: "3", user: "Luca_Creativo", text: "Dai un like e una iscrizione a questo artista!", time: "1 giorno fa" },
  ]);

  const [newComment, setNewComment] = useState("");

  const submitComment = () => {
    if (!newComment.trim()) return;
    setComments([...comments, { id: Date.now().toString(), user: "Te", text: newComment, time: "Appena ora" }]);
    setNewComment("");
  };

  return (
    <div className="space-y-4 pt-2">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <MessageSquare className="h-4 w-4" />
        <span className="font-medium text-white">{commentCount} Commenti</span>
      </div>

      <div className="space-y-4">
        {comments.map((c) => (
          <div key={c.id} className="flex gap-3">
            <img
              src={`https://i.pravatar.com/32?u=${c.user}`}
              alt=""
 className="w-8 h-8 rounded-full flex-shrink-0"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-white">{c.user}</span>
                <span className="text-xs text-muted-foreground">{c.time}</span>
              </div>
              <p className="text-sm text-muted-foreground mt-0.5">{c.text}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-2 pt-2 border-t border-white/5">
        <input
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && submitComment()}
          placeholder="Scrivi un commento..."
          className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#00f2ff] transition-colors"
        />
        <button
          onClick={submitComment}
          className="px-4 py-2 bg-[#00f2ff] text-black font-medium rounded-lg text-sm hover:bg-[#00d4e6] transition-colors disabled:opacity-50"
          disabled={!newComment.trim()}
        >
          Invia
        </button>
      </div>
    </div>
  );
}
