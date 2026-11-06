import Link from "next/link";

export const metadata = { title: "Offline" };

export default function OfflinePage() {
  return (
    <div className="min-h-screen bg-[#050a14] flex flex-col items-center justify-center px-6 text-center">
      <div className="w-20 h-20 rounded-full bg-[#00f2ff]/10 border border-[#00f2ff]/30 flex items-center justify-center mb-6">
        <svg className="w-8 h-8 text-[#00f2ff]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="1" y1="1" x2="23" y2="23" />
          <path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55" />
          <path d="M5 12.55a10.94 10.94 0 0 1 5.17-2.39" />
          <path d="M10.71 5.05A16 16 0 0 1 22.58 9" />
          <path d="M1.42 9a15.91 15.91 0 0 1 4.7-2.88" />
          <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
          <line x1="12" y1="20" x2="12.01" y2="20" />
        </svg>
      </div>
      <h1 className="text-2xl font-bold text-white mb-2">Sei offline</h1>
      <p className="text-white/50 max-w-sm mb-8">
        Nessuna connessione a bazziba.it al momento. Controlla la rete e riprova —
        i contenuti che hai già visitato restano disponibili dalla cache.
      </p>
      <Link
        href="/"
        className="px-6 py-3 bg-[#00f2ff] text-black font-bold rounded-full text-sm hover:bg-[#00d4e6] transition-colors"
      >
        Riprova
      </Link>
    </div>
  );
}
