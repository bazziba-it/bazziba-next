import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#050a14] border-t border-white/5">
      {/* Top bar: logo + brands + languages */}
      <div className="max-w-[1600px] mx-auto px-4 py-4 flex items-center justify-between border-b border-white/5">
        <div className="flex items-center gap-4">
          <svg width="24" height="18" viewBox="0 0 100 64" fill="none">
            <path d="M20 48V16a8 8 0 0 1 8-8h44a8 8 0 0 1 8 8v32a8 8 0 0 1-8 8H28a8 8 0 0 1-8-8Z" fill="#00f2ff" />
            <rect x="24" y="22" width="8" height="20" rx="2" fill="#00f2ff" />
            <rect x="36" y="28" width="6" height="14" rx="2" fill="#00f2ff" />
            <rect x="46" y="24" width="8" height="18" rx="2" fill="#00f2ff" />
            <rect x="58" y="30" width="6" height="12" rx="2" fill="#00f2ff" />
            <rect x="68" y="20" width="8" height="22" rx="2" fill="#00f2ff" />
          </svg>
          <span className="text-xs text-white/40 font-mono tracking-wide">BAZZIBA!</span>
        </div>
        <div className="flex items-center gap-5">
          <nav className="flex items-center gap-4">
            <Link href="/" className="text-[11px] text-white/30 hover:text-[#00f2ff] transition-colors">Home</Link>
            <Link href="/feed/trending" className="text-[11px] text-white/30 hover:text-[#00f2ff] transition-colors">Trending</Link>
            <Link href="/contest" className="text-[11px] text-white/30 hover:text-[#00f2ff] transition-colors">Contest</Link>
            <Link href="/upload" className="text-[11px] text-white/30 hover:text-[#00f2ff] transition-colors">Carica</Link>
          </nav>
          <div className="h-4 w-px bg-white/10" />
          <div className="flex items-center gap-3">
            <span className="text-[10px] text-white/20 uppercase tracking-widest">LINGUA</span>
            {["EN", "IT", "FR", "ES", "DE"].map((lang) => (
              <Link
                key={lang}
                href="#"
                className={`text-[11px] font-medium transition-colors ${
                  lang === "IT"
                    ? "text-[#00f2ff] border-b border-[#00f2ff]"
                    : "text-white/30 hover:text-white/50"
                }`}
              >
                {lang}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="max-w-[1600px] mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand col */}
          <div>
            <svg width="32" height="24" viewBox="0 0 100 64" fill="none" className="mb-3">
              <path d="M20 48V16a8 8 0 0 1 8-8h44a8 8 0 0 1 8 8v32a8 8 0 0 1-8 8H28a8 8 0 0 1-8-8Z" fill="#00f2ff" />
              <rect x="24" y="22" width="8" height="20" rx="2" fill="#00f2ff" />
              <rect x="36" y="28" width="6" height="14" rx="2" fill="#00f2ff" />
              <rect x="46" y="24" width="8" height="18" rx="2" fill="#00f2ff" />
              <rect x="58" y="30" width="6" height="12" rx="2" fill="#00f2ff" />
              <rect x="68" y="20" width="8" height="22" rx="2" fill="#00f2ff" />
            </svg>
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
                <span>info@bazziba.it</span>
              </div>
            </div>
          </div>

          {/* Explore */}
          <div>
            <h4 className="text-xs uppercase tracking-widest font-semibold text-[#00f2ff] mb-3">Esplora</h4>
            <ul className="space-y-2">
              {[
                { href: "/", label: "Home" },
                { href: "/feed/trending", label: "Trending" },
                { href: "/contest", label: "Contest" },
                { href: "/search", label: "Cerca" },
                { href: "/feed/latest", label: "Ultimi video" },
              ].map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-sm text-white/50 hover:text-white/80 transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-xs uppercase tracking-widest font-semibold text-[#00f2ff] mb-3">Aiuto</h4>
            <ul className="space-y-2">
              {[
                { href: "/cose-bazziba", label: "Cos'è Bazziba" },
                { href: "/regolamento", label: "Regolamento" },
                { href: "/privacy-policy", label: "Privacy Policy" },
                { href: "/terms", label: "Termini e Condizioni" },
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

          {/* Legal */}
          <div>
            <h4 className="text-xs uppercase tracking-widest font-semibold text-[#00f2ff] mb-3">Legal</h4>
            <div className="border-t border-white/5 pt-3">
              <p className="text-[11px] text-white/30 leading-relaxed">
                REA: RM-1722388<br />
                P.IVA 17497291009
              </p>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/5 mt-10 pt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[11px] text-white/20 font-mono tracking-wide">
            &copy; {new Date().getFullYear()} BAZZIBA! — Tutti i diritti riservati.
          </p>
          <div className="flex items-center gap-4">
            <a href="#" className="text-white/20 hover:text-[#00f2ff] transition-colors" aria-label="Facebook">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
            </a>
            <a href="#" className="text-white/20 hover:text-[#00f2ff] transition-colors" aria-label="Instagram">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" /></svg>
            </a>
            <a href="#" className="text-white/20 hover:text-[#00f2ff] transition-colors" aria-label="X (Twitter)">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            </a>
            <a href="#" className="text-white/20 hover:text-[#00f2ff] transition-colors" aria-label="YouTube">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
            </a>
            <a href="#" className="text-white/20 hover:text-[#00f2ff] transition-colors" aria-label="WhatsApp">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.72.966-.92 1.164-.198.198-.4.298-.603.199-.203-.1-.514-.2-.791.01-.286.205-.754.612-.944 1.227-.228.67-.482 1.487-.482 1.728 0 .34.1.542.287.734.228.246 1.045.89 1.39.665.149-.1.228-.2.37-.3.214-.148.48-.382.716-.578.176-.146.31-.298.383-.407.131-.198.157-.297.114-.496-.151-.716-.577-.974-1.132-.899-.149.02-.298.03-.447.03-.198 0-.4-.049-.553-.247-.207-.248-.37-.63-.482-1.106-.099-.478-.099-1.058.049-1.36.149-.302.31-.471.52-.67.314-.293.684-.443 1.083-.498.323-.044.482-.098.648-.153.17-.055.34-.098.496-.098.157 0 .34.043.447.13.11.09.198.23.228.383.029.152.03.34.03.548a6.84 6.84 0 0 1-.716 1.562c-.227.397-.444.716-.628.944-.304.36-.627.539-.944.569-.348.03-.597-.069-.874-.267-.223-.166-.429-.397-.615-.67-.185-.273-.274-.548-.274-.874 0-.327.087-.603.262-.827.174-.223.43-.482.631-.778.2-.296.3-.53.373-.801.163-.548.163-1.034 0-1.487-.164-.453-.482-.801-.768-1.106-.328-.35-.684-.615-1.086-.79-.244-.106-.53-.153-.791-.153h-.15c-.46.049-.944.263-1.28.627-.36.397-.587.92-.648 1.344-.074.478.074.944.37.944.297 0 .471.05.67.198.297.247.548.444.874.444.327 0 .597-.15.827-.444.23-.294.42-.78.37-1.154-.029-.298-.125-.548-.377-.77-.31-.3-.685-.442-1.083-.442-1.312 0-3.383 1.524-3.383 3.984 0 .298.049.603.147.827.152.42.445.74.696 1.083.174.228.298.471.422.728.125.257.245.548.198.744 0 .257-.1.546-.377.728-.276.181-.576.216-.867.37-.29.153-.627.43-.778.77-.149.34-.22.74-.22.944 0 1.312.768 2.684 2.046 3.426.149.082.37.114.576.114.297 0 .597-.03.893-.098.31-.069.597-.198.894-.346.305-.149.628-.304.944-.407.303-.105.597-.262.894-.407.327-.145.67-.412.944-.79l.15-.37a3.89 3.89 0 0 1-.648-.397c-.298-.247-.597-.346-.944-.297l-.447.05a2.98 2.98 0 0 0 1.28.79c.297.148.596.198.894.198.297 0 .597-.05.827-.247.23-.197.42-.548.497-.944.049-.397.029-.874-.327-1.023-.3-.148-.718-.12-.944.05-.148.12-.273.34-.37.648-.149.471-.174.973-.098 1.487.074.514.323.894.648 1.16.325.267.685.397 1.084.397.374 0 .716-.105 1.01-.346.295-.241.42-.597.42-1.023 0-.716-.587-1.19-1.28-1.19h-.766zm-3.55 1.87a1.06 1.06 0 1 0 0-2.12 1.06 1.06 0 0 0 0 2.12z"/></svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
