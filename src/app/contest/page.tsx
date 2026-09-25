"use client";

import { useState, useEffect } from "react";
import { VideoCard } from "@/components/video/video-card";
import { Button, Card, CardContent, CardHeader, CardTitle } from "@/components/ui";
import { Trophy, Calendar, Users, Clock, Share2 } from "lucide-react";
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
  const [userEntries, setUserEntries] = useState(0);

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
      <div className="py-6">
        <div className="container mx-auto px-4">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded w-1/3"></div>
            <div className="h-4 bg-muted rounded w-2/3"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!contest) {
    return (
      <div className="py-6">
        <div className="container mx-auto px-4 text-center py-12">
          <Trophy className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Nessun Contest Attivo</h2>
          <p className="text-muted-foreground">
            Non ci sono contest in corso in questo momento. Torna presto!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-6">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Contest Header */}
        <div className="bg-gradient-to-r from-brand-yellow/20 to-brand-orange/20 rounded-xl p-8 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Trophy className="h-6 w-6 text-brand-yellow" />
            <span className="text-sm font-medium text-brand-yellow">
              CONTEST MENSILE BAZZIBA
            </span>
          </div>

          <h1 className="text-4xl font-bold mb-4">{contest.title}</h1>
          <p className="text-lg text-muted-foreground mb-6">
            {contest.description}
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-brand-yellow" />
              <div>
                <p className="text-sm text-muted-foreground">Inizio</p>
                <p className="font-medium">
                  {new Date(contest.startAt).toLocaleDateString("it-IT")}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-brand-yellow" />
              <div>
                <p className="text-sm text-muted-foreground">Giorni Rimanenti</p>
                <p className="font-medium text-2xl">{remainingDays}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-brand-yellow" />
              <div>
                <p className="text-sm text-muted-foreground">Partecipanti</p>
                <p className="font-medium">{contest.entries.length}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-brand-yellow" />
              <div>
                <p className="text-sm text-muted-foreground">Premio</p>
                <p className="font-medium">€{contest.prizePool.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <Button size="lg" asChild>
            <Link href="/upload">Candida il tuo video</Link>
          </Button>
        </div>

        {/* Contest Leaderboard */}
        <div>
          <h2 className="text-2xl font-bold mb-6">Classifica</h2>

          <div className="space-y-4">
            {contest.entries.map((entry, index) => (
              <div
                key={entry.id}
                className="flex items-center gap-4 p-4 rounded-lg bg-card border"
              >
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-brand-yellow text-black font-bold">
                  {index + 1}
                </div>

                <Link href={`/watch/${entry.video.slug}`}>
                  <img
                    src={entry.video.thumbnail}
                    alt={entry.video.title}
                    className="w-24 h-16 object-cover rounded"
                  />
                </Link>

                <div className="flex-1">
                  <Link href={`/watch/${entry.video.slug}`}>
                    <h3 className="font-medium hover:underline">
                      {entry.video.title}
                    </h3>
                  </Link>
                  <p className="text-sm text-muted-foreground">
                    di{" "}
                    <Link href={`/u/${entry.video.author.username}`}>
                      {entry.video.author.name || entry.video.author.username}
                    </Link>
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="font-bold">{entry.voteCount}</span>
                  <Share2 className="h-4 w-4 text-muted-foreground" />
                </div>

                <Button
                  variant="outline"
                  size="sm"
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
              <li>Pubblica un video con contenuti artistici nella tua categoria preferita</li>
              <li>Vai alla pagina del contest e clicca "Candida il tuo video"</li>
              <li>Potresti candidare fino a 3 video al mese</li>
              <li>Lascia che la community voti il tuo video</li>
              <li>I 3 video con più voti vincitori ricevono premi in denaro</li>
              <li>I vincitori vengono annunciati alla fine del periodo di contest</li>
            </ol>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
