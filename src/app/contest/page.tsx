import { Trophy, Users, Calendar, Upload, Medal, Crown, Flame, Clock, ChevronDown } from "lucide-react";
import Link from "next/link";
import {
  fetchContests,
  fetchContestTerms,
  fetchVideosByContestTerm,
  fetchVideosByTagSlug,
  type BazzibaVideo,
} from "@/data/wp";
import { VideoGrid } from "@/components/video/video-card";
import { SafeImage, ThumbPlaceholder, RealAvatar } from "@/components/ui/media";
import { GlassSurface, GlassCard } from "@/components/ui";
import { formatDurationSec } from "@/lib/format";

export const revalidate = 300;

const MONTHS: Record<string, number> = {
  gennaio: 0, febbraio: 1, marzo: 2, aprile: 3, maggio: 4, giugno: 5,
  luglio: 6, agosto: 7, settembre: 8, ottobre: 9, novembre: 10, dicembre: 11,
};

function rendered(raw: string | { rendered: string } | undefined): string {
  if (!raw) return "";
  return typeof raw === "string" ? raw : raw.rendered ?? "";
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, " ").replace(/\s{2,}/g, " ").trim();
}

/** Display-prettify a contest_taxonomy term: "maggio2025" → "Maggio 2025". */
function prettifyTermName(name: string): string {
  const m = name.replace(/[-_]/g, " ").match(/^([a-zàèéìòù]+)\s*(\d{4})$/i);
  if (m) return m[1][0].toUpperCase() + m[1].slice(1) + " " + m[2];
  return name[0]?.toUpperCase() + name.slice(1);
}

/** Edition end date from the term name ("settembre2025" → 2025-09-30T23:59). */
function editionEndDate(termName: string): Date | null {
  const m = termName.toLowerCase().match(/^([a-zàèéìòù]+)\s*(\d{4})$/);
  if (!m || !(m[1] in MONTHS)) return null;
  return new Date(parseInt(m[2]), MONTHS[m[1]] + 1, 0, 23, 59, 59);
}

const PODIUM = [
  { rank: 1, medal: "🥇", ring: "ring-[#FFD700]/60", label: "text-[#FFD700]", lift: "sm:-mt-6" },
  { rank: 2, medal: "🥈", ring: "ring-[#C0C0C0]/50", label: "text-[#C0C0C0]", lift: "" },
  { rank: 3, medal: "🥉", ring: "ring-[#CD7F32]/50", label: "text-[#CD7F32]", lift: "" },
];

function PodiumCard({ video, rank, medal, ring, label, lift }: {
  video: BazzibaVideo; rank: number; medal: string; ring: string; label: string; lift: string;
}) {
  return (
    <Link
      href={`/watch/${video.id}`}
      className={`group relative rounded-2xl overflow-hidden bg-black border border-white/10 ring-2 ${ring} ${lift} transition-transform hover:-translate-y-1`}
    >
      <div className="relative aspect-video">
        {video.thumbnail ? (
          <SafeImage
            src={video.thumbnail}
            alt={video.title}
            sizes="(max-width: 640px) 100vw, 33vw"
            className={`object-cover transition-transform duration-300 group-hover:scale-105 ${video.portrait ? "object-top" : ""}`}
          />
        ) : (
          <ThumbPlaceholder title={video.title} className="h-full w-full" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
        <span className="absolute top-3 left-3 text-3xl drop-shadow-lg">{medal}</span>
        {video.durationSec && (
          <span className="absolute bottom-2 right-2 bg-black/75 text-white text-[10px] font-mono px-1.5 py-0.5 rounded">
            {formatDurationSec(video.durationSec)}
          </span>
        )}
        <div className="absolute bottom-0 left-0 right-0 p-3">
          <p className={`text-[10px] font-bold uppercase tracking-widest ${label}`}>{rank}° classificato</p>
          <p className="text-sm font-bold text-white line-clamp-2 leading-snug mt-0.5">{video.title}</p>
          <p className="text-[11px] text-white/50 mt-1 flex items-center gap-1.5">
            <RealAvatar src={video.authorAvatar} name={video.authorName} className="w-4 h-4 text-[7px]" />
            {video.authorName}
          </p>
        </div>
      </div>
    </Link>
  );
}

export default async function ContestPage() {
  const [contests, terms, winners] = await Promise.all([
    fetchContests(10).catch(() => []),
    fetchContestTerms().catch(() => []),
    fetchVideosByTagSlug("vincitori-contest", 8).catch(() => []),
  ]);

  // Latest edition = first contest CPT entry; match its taxonomy term by normalized slug
  const latest = contests[0] ?? null;
  const normalize = (s: string) => s.toLowerCase().replace(/[^a-z0-9àèéìòù]/g, "");
  const latestTitleNorm = latest ? normalize(stripHtml(rendered(latest.title))) : "";
  const latestTerm =
    (latestTitleNorm &&
      terms.find((t) => normalize(t.slug) === latestTitleNorm || normalize(t.name) === latestTitleNorm)) ||
    terms[0] ||
    null;
  const entries = latestTerm ? await fetchVideosByContestTerm(latestTerm.id, 24).catch(() => []) : [];

  const latestTitle = latest ? stripHtml(rendered(latest.title)) : "Contest Bazziba";
  const latestDescription = latest ? stripHtml(rendered(latest.content)).slice(0, 400) : "";
  const editionName = latestTerm ? prettifyTermName(latestTerm.name) : latestTitle;

  // Live countdown derived from the edition month
  const endDate = latestTerm ? editionEndDate(latestTerm.name) : null;
  const daysLeft = endDate ? Math.ceil((endDate.getTime() - Date.now()) / 86400000) : null;
  const isLive = daysLeft != null && daysLeft > 0;

  const podiumVideos = winners.slice(0, 3);
  const weekMs = 7 * 86400000;

  return (
    <div className="py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* ===== HERO: edition + live countdown ===== */}
        <div className="relative overflow-hidden rounded-2xl border border-white/10 mb-10">
          <div className="absolute inset-0 -z-10">
            <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-[#00f2ff]/8 blur-3xl" />
            <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-purple-600/10 blur-3xl" />
          </div>

          <div className="p-6 sm:p-8">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#00f2ff] flex items-center gap-2">
                <Trophy className="h-4 w-4" />
                Contest mensile Bazziba
              </span>
              {isLive && (
                <span className="inline-flex items-center gap-1.5 bg-red-500/15 text-red-400 text-[11px] font-bold px-2.5 py-1 rounded-full">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-red-400" />
                  </span>
                  VOTAZIONI APERTE
                </span>
              )}
            </div>

            <h1 className="text-3xl md:text-5xl font-extrabold mb-3 tracking-tight">{latestTitle}</h1>
            {latestDescription && (
              <p className="text-base text-white/50 mb-6 max-w-2xl leading-relaxed">{latestDescription}</p>
            )}

            <div className="flex flex-wrap items-center gap-3 mb-8">
              <div className="flex items-center gap-2.5 bg-white/5 rounded-xl px-4 py-2.5 border border-white/5">
                <Calendar className="h-4 w-4 text-[#00f2ff]" />
                <span className="text-sm text-white/70">{editionName}</span>
              </div>
              <div className="flex items-center gap-2.5 bg-white/5 rounded-xl px-4 py-2.5 border border-white/5">
                <Users className="h-4 w-4 text-[#00f2ff]" />
                <span className="text-sm text-white/70">
                  <strong className="text-[#00f2ff]">{latestTerm?.count ?? entries.length}</strong> partecipanti
                </span>
              </div>
              {daysLeft != null && (
                <div className={`flex items-center gap-2.5 rounded-xl px-4 py-2.5 border ${
                  isLive ? "bg-[#00f2ff]/10 border-[#00f2ff]/30" : "bg-white/5 border-white/5"
                }`}>
                  <Clock className={`h-4 w-4 ${isLive ? "text-[#00f2ff]" : "text-white/40"}`} />
                  <span className={`text-sm ${isLive ? "text-[#00f2ff] font-semibold" : "text-white/50"}`}>
                    {isLive ? `Si chiude tra ${daysLeft} giorni` : "Votazioni chiuse"}
                  </span>
                </div>
              )}
            </div>

            <Link
              href="/upload"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#00f2ff] px-7 py-3.5 text-sm font-bold text-black transition-all hover:bg-[#00d4e6] hover:scale-[1.02] shadow-lg shadow-cyan-glow-1"
            >
              <Upload className="h-4 w-4" />
              Candida il tuo video
            </Link>
          </div>
        </div>

        {/* ===== ALBO D'ORO: winners podium ===== */}
        {podiumVideos.length > 0 && (
          <section className="mb-12">
            <h2 className="text-xl font-bold flex items-center gap-2 mb-5">
              <Crown className="h-5 w-5 text-[#FFD700]" />
              Albo d'oro — gli ultimi vincitori
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-start">
              {/* gold center-first on mobile, ordered 2-1-3 on desktop for the podium look */}
              {[1, 0, 2].map((idx) =>
                podiumVideos[idx] ? (
                  <PodiumCard key={podiumVideos[idx].id} video={podiumVideos[idx]} {...PODIUM[idx]} />
                ) : null
              )}
            </div>
          </section>
        )}

        {/* ===== ENTRIES with rank + NUOVO badges ===== */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Flame className="h-5 w-5 text-[#00f2ff]" />
              Video in gara — {editionName}
            </h2>
            <span className="text-xs text-white/30">{entries.length} video</span>
          </div>

          {entries.length === 0 ? (
            <p className="text-center py-12 text-white/40">
              Nessun video in gara in questa edizione — candida il tuo!
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {entries.map((v, i) => {
                const isNew = Date.now() - new Date(v.date).getTime() < weekMs;
                return (
                  <GlassCard key={v.id} staggerIndex={i % 8} scrollList className="overflow-hidden">
                    <Link href={`/watch/${v.id}`} className="group block">
                      <div className="relative aspect-video overflow-hidden bg-black">
                        {v.thumbnail ? (
                          <SafeImage
                            src={v.thumbnail}
                            alt={v.title}
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                            className={`object-cover transition-transform duration-300 group-hover:scale-105 ${v.portrait ? "object-top" : ""}`}
                          />
                        ) : (
                          <ThumbPlaceholder title={v.title} className="h-full w-full" />
                        )}
                        <span className="absolute top-2 left-2 bg-black/70 text-white/80 text-[10px] font-mono font-bold px-1.5 py-0.5 rounded">
                          #{i + 1}
                        </span>
                        {isNew && (
                          <span className="absolute top-2 right-2 bg-[#00f2ff] text-[#050a14] text-[9px] font-bold px-1.5 py-0.5 rounded uppercase">
                            Nuovo
                          </span>
                        )}
                        {v.durationSec && (
                          <span className="absolute bottom-2 right-2 bg-black/75 text-white text-[10px] font-mono px-1.5 py-0.5 rounded">
                            {formatDurationSec(v.durationSec)}
                          </span>
                        )}
                      </div>
                      <div className="p-3">
                        <p className="text-sm font-medium text-white line-clamp-2 leading-snug group-hover:text-[#00f2ff] transition-colors">
                          {v.title}
                        </p>
                        <p className="text-[11px] text-white/40 mt-1.5 flex items-center gap-1.5 truncate">
                          <RealAvatar src={v.authorAvatar} name={v.authorName} className="w-4 h-4 text-[7px] flex-shrink-0" />
                          {v.authorName}
                        </p>
                      </div>
                    </Link>
                  </GlassCard>
                );
              })}
            </div>
          )}
        </section>

        {/* ===== PAST EDITIONS + RULES accordion ===== */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
          {contests.length > 1 && (
            <section>
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Medal className="h-5 w-5 text-[#00f2ff]" />
                Edizioni precedenti
              </h3>
              <div className="space-y-2">
                {contests.slice(1, 5).map((c) => (
                  <GlassCard key={c.id} interactive={false} className="p-3.5 rounded-xl flex items-center justify-between">
                    <p className="font-medium text-sm text-white">{stripHtml(rendered(c.title))}</p>
                    <p className="text-[11px] text-white/35">
                      {new Date(c.date).toLocaleDateString("it-IT", { month: "long", year: "numeric" })}
                    </p>
                  </GlassCard>
                ))}
              </div>
            </section>
          )}

          <section>
            <h3 className="text-lg font-bold mb-4">Come funziona</h3>
            <div className="space-y-2">
              {[
                { q: "Come partecipo?", a: "Pubblica il tuo video artistico su bazziba.it — viene iscritto automaticamente all'edizione del mese in corso." },
                { q: "Come si vota?", a: "Guarda i video in gara e vota i tuoi preferiti. La community decide i vincitori di ogni edizione." },
                { q: "Cosa si vince?", a: "I vincitori entrano nell'Albo d'oro con il riconoscimento 'Vincitori Contest' e visibilità in homepage." },
              ].map((item) => (
                <details key={item.q} className="group glass-card rounded-xl border border-white/5 open:border-[#00f2ff]/20">
                  <summary className="flex items-center justify-between cursor-pointer px-4 py-3 text-sm font-medium text-white/80 list-none">
                    {item.q}
                    <ChevronDown className="h-4 w-4 text-white/30 transition-transform group-open:rotate-180" />
                  </summary>
                  <p className="px-4 pb-3.5 text-sm text-white/50 leading-relaxed">{item.a}</p>
                </details>
              ))}
            </div>
            <a
              href="https://bazziba.it/regolamento-del-contest/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-3 text-sm text-[#00f2ff] hover:underline"
            >
              Leggi il regolamento completo su bazziba.it →
            </a>
          </section>
        </div>
      </div>
    </div>
  );
}
