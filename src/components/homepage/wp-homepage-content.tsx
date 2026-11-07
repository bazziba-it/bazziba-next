/** @format */

import FeaturedHero from "@/components/homepage/featured-hero";
import { HeroIntro } from "@/components/homepage/hero-intro";
import { HomePulse } from "@/components/homepage/home-pulse";
import { CategoryRails, type Rail } from "@/components/homepage/category-rails";
import type { BazzibaVideo, WpTerm, WpPulseItem } from "@/data/wp";

interface WpHomepageContentProps {
  heroVideos: BazzibaVideo[];
  contestCards: { title: string; subtitle: string }[];
  featuredArtists: { name: string; role: string; avatar?: string | null }[];
  categories: WpTerm[];
  stats: { videos: number; artists: number; comments: number };
  pulse: WpPulseItem[];
  rails: Rail[];
}

/* ===== Home: intro strip → hero carousel → community pulse → category rails ===== */
export default function WpHomepageContent({
  heroVideos,
  contestCards,
  featuredArtists,
  categories,
  stats,
  pulse,
  rails,
}: WpHomepageContentProps) {
  if (heroVideos.length === 0 && rails.length === 0) {
    return (
      <div className="min-h-screen flex flex-col bg-[#050a14]">
        <main className="flex-1 pt-[64px]">
          <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center py-20">
              <p className="text-white/40 text-sm font-['Poppins']">
                Nessun video trovato — bazziba.it non risponde. Riprova più tardi.
              </p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#050a14]">
      <main className="flex-1 pt-[64px]">
        {/* Live intro strip: headline + real counters + search CTA */}
        <HeroIntro stats={stats} />

        {/* Rotating hero carousel: in-evidenza videos + contest cards + artists */}
        <FeaturedHero
          featuredVideos={heroVideos}
          contestCards={contestCards}
          featuredArtists={featuredArtists}
        />

        {/* Community pulse: latest real comments across the site */}
        <div className="mt-6">
          <HomePulse items={pulse} />
        </div>

        {/* Discovery: latest arrivals + top category rails */}
        <CategoryRails rails={rails} />
      </main>
    </div>
  );
}
