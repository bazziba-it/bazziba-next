


import { VideoCard } from "@/components/video/video-card";
import { Button, Card, CardContent, CardHeader, CardTitle } from "@/components/ui";
import { Trophy, Calendar, Users, Clock, Share2, Upload } from "lucide-react";
import Link from "next/link";
import type { Video } from "@/types";

export const dynamic = "force-dynamic";

interface ContestEntry {
  id: string;
  voteCount: number;
  video: {
    id: string;
    title: string;
    slug: string;
    thumbnail: string;
    viewCount: number;
    duration: number;
    createdAt: string;
    author: { id: string; username: string; name: string; image: string };
  };
}

const mockContest = {
  id: "contest-1",
  title: "Arte e Street Culture",
  description: "Un contest dedicato all'arte urbana, street art, e culture di strada. Partecipa con i tuoi video artistici!",
  startAt: "2025-09-01T00:00:00Z",
  endAt: "2025-09-30T23:59:59Z",
  prizePool: 5000,
  status: "ACTIVE" as const,
  entries: [
    {
      id: "entry-1",
      voteCount: 1248,
      video: {
        id: "vid-7",
        title: "Musa Urbana - Frammenti di Luce",
        slug: "musa-urbana-frammenti-di-luce",
        thumbnail: "https://images.unsplash.com/photo-1578301979-642908803e52?w=400&h=300&fit=crop",
        viewCount: 890,
        duration: 520,
        createdAt: "2025-09-15T12:00:00Z",
        author: { id: "user-7", username: "musa_urbana", name: "Musa Urbana", image: "https://i.pravatar.com/64?img=7" },
      },
    },
    {
      id: "entry-2",
      voteCount: 982,
      video: {
        id: "vid-8",
        title: "Street Art Live Painting",
        slug: "street-art-live-painting",
        thumbnail: "https://images.unsplash.com/photo-1577032819764-2b9a6a3c3f8e?w=400&h=300&fit=crop",
        viewCount: 654,
        duration: 480,
        createdAt: "2025-09-14T15:30:00Z",
        author: { id: "user-8", username: "bluemark", name: "Blu Mark", image: "https://i.pravatar.com/64?img=8" },
      },
    },
    {
      id: "entry-3",
      voteCount: 756,
      video: {
        id: "vid-9",
        title: "Graffiti Stories - Roma",
        slug: "graffiti-stories-roma",
        thumbnail: "https://images.unsplash.com/photo-1578301979-642908803e52?w=400&h=300&fit=crop",
        viewCount: 445,
        duration: 380,
        createdAt: "2025-09-12T10:00:00Z",
        author: { id: "user-9", username: "romano_graffiti", name: "Romano", image: "https://i.pravatar.com/64?img=9" },
      },
    },
    {
      id: "entry-4",
      voteCount: 432,
      video: {
        id: "vid-10",
        title: "Bboying Under the Bridges",
        slug: "bboying-under-the-bridges",
        thumbnail: "https://images.unsplash.com/photo-15188376950205-8d818a1a3175?w=400&h=300&fit=crop",
        viewCount: 312,
        duration: 290,
        createdAt: "2025-09-08T18:00:00Z",
        author: { id: "user-10", username: "breaker_kid", name: "Kid Breaker", image: "https://i.pravatar.com/64?img=10" },
      },
    },
    {
      id: "entry-5",
      voteCount: 298,
      video: {
        id: "vid-11",
        title: "Urban Canvas - Berlin Walls",
        slug: "urban-canvas-berlin-walls",
        thumbnail: "https://images.unsplash.com/photo-1578301979-642908803e52?w=400&h=300&fit=crop",
        viewCount: 267,
        duration: 420,
        createdAt: "2025-09-05T14:00:00Z",
        author: { id: "user-11", username: "berlin_street", name: "Alex K", image: "https://i.pravatar.com/64?img=11" },
      },
    },
  ] as ContestEntry[],
};

const mockContestVideos: Video[] = mockContest.entries.reduce(
  (acc: Video[], entry) => [
    ...acc,
    {
      id: entry.video.id,
      title: entry.video.title,
      slug: entry.video.slug,
      description: "",
      thumbnail: entry.video.thumbnail,
      duration: entry.video.duration,
      viewCount: entry.video.viewCount,
      status: "PUBLISHED",
      visibility: "PUBLIC",
      authorId: entry.video.author.id,
      createdAt: entry.video.createdAt,
      updatedAt: entry.video.createdAt,
      author: entry.video.author,
      category: { id: "cat-1", name: "Cantanti", slug: "cantanti", color: "#FFD700" },
      tags: [],
    },
  ],
  []
);

export default function ContestPage() {
  const contest = mockContest;
  const remainingDays = Math.ceil(
    (new Date(contest.endAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  );

  return (
    <div className="py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Contest Header */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-brand-yellow/10 via-primary/5 to-background border mb-8">
          <div className="absolute inset-0 -z-10">
            <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-brand-yellow/10 blur-3xl"></div>
            <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-primary/5 blur-3xl"></div>
          </div>

          <div className="p-8">
            <div className="flex items-center gap-2 mb-4">
              <Trophy className="h-5 w-5 text-brand-yellow fill-current" />
              <span className="text-sm font-medium text-brand-yellow">
                CONTEST MENSILE BAZZIBA
              </span>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold mb-4">{contest.title}</h1>
            <p className="text-lg text-muted-foreground mb-8 max-w-3xl">
              {contest.description}
            </p>

            {/* Contest Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="flex items-center gap-3 p-4 rounded-xl bg-card border">
                <Calendar className="h-5 w-5 text-primary flex-shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground uppercase">Inizio</p>
                  <p className="font-medium">
                    {new Date(contest.startAt).toLocaleDateString("it-IT")}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 rounded-xl bg-card border">
                <Clock className="h-5 w-5 text-primary flex-shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground uppercase">Giorni Rimasti</p>
                  <p className="font-bold text-2xl text-brand-yellow">{remainingDays}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 rounded-xl bg-card border">
                <Users className="h-5 w-5 text-primary flex-shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground uppercase">Partecipanti</p>
                  <p className="font-medium">{contest.entries.length}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 rounded-xl bg-card border">
                <Trophy className="h-5 w-5 text-brand-yellow flex-shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground uppercase">Premio</p>
                  <p className="font-bold text-xl">€{contest.prizePool.toLocaleString()}</p>
                </div>
              </div>
            </div>

            <Button
              size="lg"
              className="bg-brand-yellow text-black hover:bg-brand-yellow-hover font-bold"
              asChild
            >
              <Link href="/upload" className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Candida il tuo video
              </Link>
            </Button>
          </div>
        </div>

        {/* Contest Leaderboard */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Trophy className="h-6 w-6 text-brand-yellow" />
              Classifica Partecipanti
            </h2>
            <a
              href="/contest/entries"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Vedi tutti
            </a>
          </div>

          <div className="space-y-3">
            {contest.entries.map((entry, index) => (
              <div
                key={entry.id}
                className="flex items-center gap-4 p-4 rounded-xl bg-card border hover:shadow-md transition-all duration-200 group"
              >
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-b from-brand-yellow to-amber-400 text-black font-bold flex-shrink-0">
                  {index < 3 ? (
                    <span className="text-xl">
                      {index === 0 ? "🥇" : index === 1 ? "🥈" : "🥉"}
                    </span>
                  ) : (
                    index + 1
                  )}
                </div>

                <Link href={`/watch/${entry.video.slug}`} className="flex-shrink-0">
                  <img
                    src={entry.video.thumbnail}
                    alt={entry.video.title}
                    className="w-24 h-16 object-cover rounded-lg group-hover:scale-105 transition-transform"
                  />
                </Link>

                <div className="flex-1 min-w-0">
                  <Link href={`/watch/${entry.video.slug}`}>
                    <h3 className="font-medium hover:underline line-clamp-1">
                      {entry.video.title}
                    </h3>
                  </Link>
                  <p className="text-sm text-muted-foreground line-clamp-1">
                    di{" "}
                    <Link
                      href={`/u/${entry.video.author.username}`}
                      className="hover:text-brand-yellow transition-colors"
                    >
                      {entry.video.author.name || entry.video.author.username}
                    </Link>
                  </p>
                </div>

                <div className="flex items-center gap-2 text-right">
                  <span className="font-bold text-lg">{entry.voteCount}</span>
                  <Share2 className="h-4 w-4 text-muted-foreground" />
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  className="flex-shrink-0"
                >
                  Vota
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* How to Participate */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Come partecipare</CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
              <li>
                Pubblica un video con contenuti artistici nella tua categoria preferita
              </li>
              <li>
                Vai alla pagina del contest e clicca "Candida il tuo video"
              </li>
              <li>Potresti candidare fino a 3 video al mese</li>
              <li>Lascia che la community voti il tuo video</li>
              <li>
                I 3 video con più voti vincitori ricevono premi in denaro
              </li>
              <li>I vincitori vengono annunciati alla fine del periodo di contest</li>
            </ol>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
