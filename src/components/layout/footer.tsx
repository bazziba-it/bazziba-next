import Link from "next/link";
import { fetchVideoCategories } from "@/data/wp";

/** Real bazziba.it social profiles (verified on the live site). */
const SOCIALS: { label: string; href: string; stroke?: boolean; icon: React.ReactNode }[] = [
  {
    label: "Facebook",
    href: "https://www.facebook.com/bazzibaofficial/",
    icon: <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />,
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/bazziba_official/",
    stroke: true,
    icon: (
      <>
        <rect x="2" y="2" width="20" height="20" rx="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
      </>
    ),
  },
  {
    label: "TikTok",
    href: "https://www.tiktok.com/@bazziba_official",
    icon: <path d="M12.53.02C13.84 0 15.14.01 16.44 0c.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />,
  },
  {
    label: "YouTube",
    href: "https://www.youtube.com/@Bazziba-e8q",
    icon: <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />,
  },
];

function BrandMark({ size = 40 }: { size?: number }) {
  return (
    <svg width={size} height={(size * 64) / 100} viewBox="0 0 100 64" fill="none">
      <path d="M20 48V16a8 8 0 0 1 8-8h44a8 8 0 0 1 8 8v32a8 8 0 0 1-8 8H28a8 8 0 0 1-8-8Z" fill="#00f2ff" />
      <rect x="24" y="22" width="8" height="20" rx="2" fill="#050a14" />
      <rect x="36" y="28" width="6" height="14" rx="2" fill="#050a14" />
      <rect x="46" y="24" width="8" height="18" rx="2" fill="#050a14" />
      <rect x="58" y="30" width="6" height="12" rx="2" fill="#050a14" />
      <rect x="68" y="20" width="8" height="22" rx="2" fill="#050a14" />
    </svg>
  );
}

export default async function Footer() {
  // Real categories with real counts (5-min cache in the data layer)
  const categories = await fetchVideoCategories().catch(() => []);

  return (
    <footer className="bg-[#050a14] border-t border-white/5">
      <div className="max-w-[1600px] mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand col */}
          <div>
            <div className="mb-3"><BrandMark /></div>
            <h4 className="text-xs uppercase tracking-widest font-semibold text-[#00f2ff] mb-2">Chi siamo</h4>
            <p className="text-sm text-white/50 leading-relaxed mb-3 max-w-xs">
              La piattaforma digitale dedicata al mondo artistico.
              Condividi e scopri contenuti video con carattere e interesse artistico.
            </p>
            <div className="text-xs text-white/30 flex flex-col gap-1.5">
              <div className="flex items-start gap-2">
                <svg className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                <span>Via Gaspero Barbera 103, 00173 Roma RM</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-3.5 h-3.5 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                <a href="mailto:info@bazziba.it" className="hover:text-[#00f2ff] transition-colors">info@bazziba.it</a>
              </div>
            </div>
          </div>

          {/* Real categories with real counts */}
          <div>
            <h4 className="text-xs uppercase tracking-widest font-semibold text-[#00f2ff] mb-3">Categorie</h4>
            <ul className="space-y-2">
              {categories.slice(0, 6).map((cat) => (
                <li key={cat.id}>
                  <Link href={`/c/${cat.slug}`} className="text-sm text-white/50 hover:text-white/80 transition-colors flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00f2ff]/40" />
                    {cat.name}
                    <span className="text-[10px] text-white/25">{cat.count}</span>
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/feed" className="text-sm text-[#00f2ff]/70 hover:text-[#00f2ff] transition-colors">
                  Tutti i video →
                </Link>
              </li>
            </ul>
          </div>

          {/* Explore + help — all real routes */}
          <div>
            <h4 className="text-xs uppercase tracking-widest font-semibold text-[#00f2ff] mb-3">Esplora</h4>
            <ul className="space-y-2">
              {[
                { href: "/", label: "Home" },
                { href: "/feed/trending", label: "In Evidenza" },
                { href: "/contest", label: "Contest" },
                { href: "/search", label: "Cerca" },
                { href: "/about", label: "Cos'è Bazziba" },
                { href: "/faq", label: "FAQ" },
                { href: "/contattaci", label: "Contattaci" },
              ].map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-sm text-white/50 hover:text-white/80 transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal — real routes + real external rules pages */}
          <div>
            <h4 className="text-xs uppercase tracking-widest font-semibold text-[#00f2ff] mb-3">Legal</h4>
            <ul className="space-y-2 mb-4">
              <li><Link href="/privacy-policy" className="text-sm text-white/50 hover:text-white/80 transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-sm text-white/50 hover:text-white/80 transition-colors">Termini e Condizioni</Link></li>
              <li>
                <a href="https://bazziba.it/regole-della-community/" target="_blank" rel="noopener noreferrer" className="text-sm text-white/50 hover:text-white/80 transition-colors">
                  Regole della Community ↗
                </a>
              </li>
              <li>
                <a href="https://bazziba.it/regolamento-del-contest/" target="_blank" rel="noopener noreferrer" className="text-sm text-white/50 hover:text-white/80 transition-colors">
                  Regolamento del Contest ↗
                </a>
              </li>
              <li>
                <a href="https://bazziba.it/cookie-policy/" target="_blank" rel="noopener noreferrer" className="text-sm text-white/50 hover:text-white/80 transition-colors">
                  Cookie Policy ↗
                </a>
              </li>
            </ul>
            <div className="border-t border-white/5 pt-3">
              <p className="text-[11px] text-white/30 leading-relaxed">
                REA: RM-1722388<br />
                P.IVA 17497291009
              </p>
            </div>
          </div>
        </div>

        {/* Bottom bar: copyright + real socials */}
        <div className="border-t border-white/5 mt-10 pt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[11px] text-white/20 font-mono tracking-wide">
            &copy; {new Date().getFullYear()} BAZZIBA! — Tutti i diritti riservati. Dati da{" "}
            <a href="https://bazziba.it" target="_blank" rel="noopener noreferrer" className="text-[#00f2ff]/60 hover:text-[#00f2ff]">
              bazziba.it
            </a>
          </p>
          <div className="flex items-center gap-4">
            {SOCIALS.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/20 hover:text-[#00f2ff] transition-colors"
                aria-label={s.label}
              >
                <svg
                  className="w-4 h-4"
                  viewBox="0 0 24 24"
                  {...(s.stroke
                    ? { fill: "none", stroke: "currentColor", strokeWidth: 2 }
                    : { fill: "currentColor" })}
                >
                  {s.icon}
                </svg>
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
