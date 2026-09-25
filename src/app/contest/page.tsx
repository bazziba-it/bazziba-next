"use client";

import { useState, useEffect } from "react";
import { VideoCard } from "@/components/video/video-card";
import { Button, Card, CardContent, CardHeader, CardTitle } from "@/components/ui";
import { Trophy, Calendar, Users, Clock, Share2, ExternalLink, Upload } from "lucide-react";
import Link from "next/link";

interface Contest {
  id: string;
  title: string;
  description: string;
  startAt: string;
  endAt: string;
  prizePool: number;
  status: "ACTIVE" | "UPCOMING" | "ENDED";
  entries: Array<{
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
  }>;
}

export default function ContestPage() {
  const [contest, setContest] = useState<Contest | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/contest")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.result.activeContest) {
          setContest(data.result.activeContest);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const remainingDays = contest
    ? Math.ceil((new Date(contest.endAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    : 0;

  if (loading) {
    return (
      <div className="py-8">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-muted rounded w-2/3 mb-6"></div>
            <div className="h-48 bg-muted rounded-xl mb-8"></div>
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-20 bg-muted rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!contest) {
    return (
      <div className="py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex h-20 w-20 rounded-full bg-muted items-center justify-center mb-6">
            <Trophy className="h-10 w-10 text-muted-foreground" />
          </div>
          <h2 className="text-3xl font-bold mb-2">Nessun Contest Attivo</h2>
          <p className="text-muted-foreground text-lg max-w-md mx-auto">
            Non ci sono contest in corso in questo momento. Torna presto per partecipare!
          </p>
        </div>
      </div>
    );
  }

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
                <Trophy className="h-5 w-5 text-brand-yellow flex-shrink-0 fill-current" />
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
              Vedi tutti →
            </a>
          </div>

          <div className="space-y-3">
            {contest.entries.map((entry, index) => (
              <div
                key={entry.id}
                className="flex items-center gap-4 p-4 rounded-xl bg-card border hover:shadow-md transition-all duration-200 group"
              >
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-b from-brand-yellow to-amber-400 text-black font-bold text-lg flex-shrink-0">
                  {index < 3 ? (
                    <>
                      {index === 0 && "🥇"}
                      {index === 1 && "🥈"}
                      {index === 2 && "🥉"}
                      {index >= 3 && index + 1}
                    </>
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
                  onClick={async () => {
                    const res = await fetch("/api/contest", {
                      method: "PUT",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        entryId: entry.id,
                        action: "vote",
                      }),
                    });
                    if (res.ok) {
                      window.location.reload();
                    }
                  }}
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
                Pubblica un video con contenuti artistici nella tua categoria
                preferita
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
