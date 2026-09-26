"use client";

import { useState } from "react";
import { ThumbsUp, Reply, MoreHorizontal, User } from "lucide-react";
import { Avatar } from "@/components/ui";
import { timeAgo } from "@/lib/utils";

interface Comment {
  id: string;
  author: {
    id: string;
    username: string;
    name: string;
    image: string;
  };
  content: string;
  createdAt: string;
  likes: number;
  liked: boolean;
  replies?: Comment[];
}

const mockComments: Comment[] = [
  {
    id: "c1",
    author: { id: "u1", username: "giulia_arte", name: "Giulia Arte", image: "https://i.pravatar.com/64?img=31" },
    content: "Questa performance è incredibile! L'emozione trasmessa è autentica.",
    createdAt: "2025-09-12T10:30:00Z",
    likes: 42,
    liked: false,
    replies: [
      {
        id: "c1r1",
        author: { id: "u2", username: "elena_arte", name: "Elena Rossi", image: "https://i.pravatar.com/64?img=1" },
        content: "Grazie Giulia! Significa tanto per me.",
        createdAt: "2025-09-12T14:20:00Z",
        likes: 12,
        liked: false,
      },
    ],
  },
  {
    id: "c2",
    author: { id: "u3", username: "marco_music", name: "Marco Music", image: "https://i.pravatar.com/64?img=32" },
    content: "Mi ha ricordato le serate d'estate al porto. Bellissimo!",
    createdAt: "2025-09-11T08:15:00Z",
    likes: 28,
    liked: true,
  },
  {
    id: "c3",
    author: { id: "u4", username: "sofia_danza", name: "Sofia Marchetti", image: "https://i.pravatar.com/64?img=2" },
    content: "Elena, sei una artista incredibile. Continua così!",
    createdAt: "2025-09-10T16:45:00Z",
    likes: 156,
    liked: false,
  },
];

interface CommentsSectionProps {
  videoId: string;
  commentCount?: number;
}

export function CommentsSection({ videoId, commentCount = 24 }: CommentsSectionProps) {
  const [comments, setComments] = useState<Comment[]>(mockComments);
  const [newComment, setNewComment] = useState("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");

  const handleLike = (commentId: string) => {
    setComments((prev) =>
      prev.map((c) => {
        if (c.id === commentId) {
          return {
            ...c,
            likes: c.liked ? c.likes - 1 : c.likes + 1,
            liked: !c.liked,
          };
        }
        return c;
      })
    );
  };

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    const newC: Comment = {
      id: `c${Date.now()}`,
      author: {
        id: "current-user",
        username: "tu",
        name: "Tu",
        image: "https://i.pravatar.com/64?img=50",
      },
      content: newComment,
      createdAt: new Date().toISOString(),
      likes: 0,
      liked: false,
    };
    setComments([newC, ...comments]);
    setNewComment("");
  };

  const handleReply = (commentId: string) => {
    if (!replyText.trim()) return;
    const newReply: Comment = {
      id: `c${Date.now()}-r`,
      author: {
        id: "current-user",
        username: "tu",
        name: "Tu",
        image: "https://i.pravatar.com/64?img=50",
      },
      content: replyText,
      createdAt: new Date().toISOString(),
      likes: 0,
      liked: false,
    };
    setComments((prev) =>
      prev.map((c) => {
        if (c.id === commentId) {
          return {
            ...c,
            replies: [...(c.replies || []), newReply],
          };
        }
        return c;
      })
    );
    setReplyText("");
    setReplyingTo(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold">{commentCount} commenti</h3>
        <button className="text-sm text-muted-foreground hover:text-foreground">
          Ordina per: Nuovi prima
        </button>
      </div>

      {/* Comment Input */}
      <div className="flex gap-3">
        <div className="w-10 h-10 rounded-full bg-brand-yellow/10 flex-shrink-0 flex items-center justify-center">
          <User className="h-5 w-5 text-brand-yellow" />
        </div>
        <div className="flex-1">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Aggiungi un commento..."
            className="w-full px-3 py-2 rounded-lg border bg-background resize-none focus:outline-none focus:ring-1 focus:ring-brand-yellow"
            rows={2}
          />
          <button
            onClick={handleAddComment}
            disabled={!newComment.trim()}
            className="mt-2 px-3 py-1 text-sm bg-brand-yellow text-black rounded-full font-medium hover:bg-brand-gold-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Invia
          </button>
        </div>
      </div>

      {/* Comments List */}
      <div className="space-y-4">
        {comments.map((comment) => (
          <CommentItem
            key={comment.id}
            comment={comment}
            onLike={handleLike}
            onReply={handleReply}
            replyingTo={replyingTo}
            replyText={replyText}
            setReplyText={setReplyText}
          />
        ))}
      </div>
    </div>
  );
}

function CommentItem({
  comment,
  onLike,
  onReply,
  replyingTo,
  replyText,
  setReplyText,
}: {
  comment: Comment;
  onLike: (id: string) => void;
  onReply: (id: string) => void;
  replyingTo: string | null;
  replyText: string;
  setReplyText: (text: string) => void;
}) {
  return (
    <div className="group">
      <div className="flex gap-3">
        <img
          src={comment.author.image}
          alt={comment.author.name}
          className="w-8 h-8 rounded-full object-cover"
        />
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">{comment.author.name}</span>
            <span className="text-xs text-muted-foreground">
              @{comment.author.username}
            </span>
            <span className="text-xs text-muted-foreground">
              · {timeAgo(comment.createdAt)}
            </span>
          </div>
          <p className="text-sm mt-1 leading-relaxed">{comment.content}</p>
          <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
            <button
              onClick={() => onLike(comment.id)}
              className={`flex items-center gap-1 hover:text-foreground transition-colors ${
                comment.liked ? "text-brand-yellow" : ""
              }`}
            >
              <ThumbsUp className="h-3 w-3" />
              {comment.likes}
            </button>
            <button
              onClick={() => setReplyingTo(comment.id)}
              className="flex items-center gap-1 hover:text-foreground transition-colors"
            >
              <Reply className="h-3 w-3" />
              Rispondi
            </button>
            <button className="hover:text-foreground transition-colors">
              <MoreHorizontal className="h-3 w-3" />
            </button>
          </div>

          {/* Reply Box */}
          {replyingTo === comment.id && (
            <div className="mt-3 ml-4">
              <textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Scrivi una risposta..."
                className="w-full px-2 py-1 text-sm rounded border bg-background focus:outline-none focus:ring-1 focus:ring-brand-yellow resize-none"
                rows={2}
              />
              <div className="flex gap-2 mt-1">
                <button
                  onClick={() => onReply(comment.id)}
                  className="text-xs px-2 py-1 bg-brand-yellow text-black rounded-full font-medium hover:bg-brand-gold-hover"
                >
                  Invia
                </button>
                <button
                  onClick={() => setReplyingTo(null)}
                  className="text-xs px-2 py-1 text-muted-foreground hover:text-foreground"
                >
                  Annulla
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Replies */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="ml-11 mt-3 space-y-3">
          {comment.replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              onLike={onLike}
              onReply={onReply}
              replyingTo={replyingTo}
              replyText={replyText}
              setReplyText={setReplyText}
            />
          ))}
        </div>
      )}
    </div>
  );
}
