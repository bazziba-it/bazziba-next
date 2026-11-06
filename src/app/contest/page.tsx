import { Trophy, Users, Calendar, Upload, Medal } from "lucide-react";
import Link from "next/link";
import {
  fetchContests,
  fetchContestTerms,
  fetchVideosByContestTerm,
  fetchVideosByTagSlug,
} from "@/data/wp";
import { VideoGrid } from "@/components/video/video-card";
import { GlassSurface, GlassCard } from "@/components/ui";

export const revalidate = 300;

function rendered(raw: string | { rendered: string } | undefined): string {
  if (!raw) return "";
  return typeof raw === "string" ? raw : raw.rendered ?? "";
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, " ").replace(/\s{2,}/g, " ").trim();
}

export default async function ContestPage() {
  const [contests, terms, winners] = await Promise.all([
    fetchContests(10).catch(() => []),
    fetchContestTerms().catch(() => []),
    fetchVideosByTagSlug("vincitori-contest", 8).catch(() => []),
  ]);

  // Latest edition = first contest CPT entry; entries = videos carrying its contest_taxonomy term
  const latest = contests[0] ?? null;
  const latestTerm = terms[0] ?? null;
  const entries = latestTerm ? await fetchVideosByContestTerm(latestTerm.id, 24).catch(() => []) : [];

  const latestTitle = latest ? stripHtml(rendered(latest.title)) : "Contest Bazziba";
  const latestDescription = latest ? stripHtml(rendered(latest.content)).slice(0, 400) : "";

  return (
    <div className="py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Contest header — real latest edition from the contest CPT */}
        <div className="relative overflow-hidden rounded-2xl border mb-8">
          <div className="absolute inset-0 -z-10">
            <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-[#00f2ff]/5 blur-3xl" />
            <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-[#00f2ff]/5 blur-3xl" />
          </div>

          <div className="p-8">
            <div className="flex items-center gap-2 mb-4">
              <Trophy className="h-5 w-5 text-[#00f2ff] fill-current" />
              <span className="text-sm font-medium text-[#00f2ff]">CONTEST MENSILE BAZZIBA</span>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold mb-4">{latestTitle}</h1>
            {latestDescription && (
              <p className="text-lg text-muted-foreground mb-8 max-w-3xl">{latestDescription}</p>
            )}

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
              <div className="flex items-center gap-3 p-4 rounded-xl glass-card text-card-foreground">
                <Calendar className="h-5 w-5 text-[#00f2ff] flex-shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground uppercase">Edizione</p>
                  <p className="font-medium">{latestTitle}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 rounded-xl glass-card text-card-foreground">
                <Users className="h-5 w-5 text-[#00f2ff] flex-shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground uppercase">Partecipanti</p>
                  <p className="font-bold text-2xl text-[#00f2ff]">{latestTerm?.count ?? entries.length}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 rounded-xl glass-card text-card-foreground">
                <Medal className="h-5 w-5 text-[#00f2ff] flex-shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground uppercase">Vincitori passati</p>
                  <p className="font-bold text-2xl text-[#00f2ff]">{winners.length}</p>
                </div>
              </div>
            </div>

            <Link
              href="/upload"
              className="inline-flex items-center justify-center rounded-lg bg-[#00f2ff] px-6 py-3 text-sm font-bold text-black transition-all duration-200 hover:bg-[#00d4e6] hover:scale-105"
            >
              <Upload className="h-5 w-5 mr-2" />
              Candida il tuo video
            </Link>
          </div>
        </div>

        {/* Real entries for the latest edition */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Trophy className="h-6 w-6 text-[#00f2ff]" />
              {latestTerm ? `Video in gara — ${latestTerm.name}` : "Video in gara"}
            </h2>
          </div>
          <VideoGrid
            videos={entries}
            showAuthor
            emptyMessage="Nessun video in gara in questa edizione — candida il tuo!"
          />
        </section>

        {/* Real winners hall of fame (video_tag: vincitori-contest) */}
        {winners.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold flex items-center gap-2 mb-6">
              <Medal className="h-6 w-6 text-[#00f2ff]" />
              Albo d'oro — Vincitori dei contest
            </h2>
            <VideoGrid videos={winners} showAuthor />
          </section>
        )}

        {/* Past editions — real contest CPT list */}
        {contests.length > 1 && (
          <section className="mb-12">
            <h2 className="text-xl font-bold mb-4">Edizioni precedenti</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {contests.slice(1).map((c) => (
                <GlassCard key={c.id} interactive={false} className="p-4 rounded-xl">
                  <p className="font-semibold text-white">{stripHtml(rendered(c.title))}</p>
                  <p className="text-xs text-white/40 mt-1">
                    {new Date(c.date).toLocaleDateString("it-IT", { month: "long", year: "numeric" })}
                  </p>
                </GlassCard>
              ))}
            </div>
          </section>
        )}

        {/* Rules — real WP page link */}
        <GlassSurface tier="card" className="rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-4">Come partecipare</h3>
          <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
            <li>Pubblica il tuo video artistico su bazziba.it</li>
            <li>Il video viene iscritto all'edizione del mese in corso</li>
            <li>La community vota i video in gara</li>
            <li>I vincitori entrano nell'albo d'oro con il tag &quot;Vincitori Contest&quot;</li>
          </ol>
          <a
            href="https://bazziba.it/regolamento-del-contest/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-4 text-sm text-[#00f2ff] hover:underline"
          >
            Leggi il regolamento completo su bazziba.it →
          </a>
        </GlassSurface>
      </div>
    </div>
  );
}
