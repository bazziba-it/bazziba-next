/** Root loading UI — branded animated skeleton shown during route transitions. */
export default function Loading() {
  return (
    <div className="min-h-screen bg-[#050a14] flex flex-col items-center justify-center gap-6">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 rounded-full border-2 border-white/10" />
        <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-[#00f2ff] animate-spin" />
        <div className="absolute inset-3 rounded-full bg-[#00f2ff]/10 animate-pulse" />
      </div>
      <p className="text-sm text-white/30 font-['Poppins'] animate-pulse">Caricamento…</p>
      <div className="flex gap-1.5">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="w-1.5 h-1.5 rounded-full bg-[#00f2ff]/60 animate-bounce"
            style={{ animationDelay: `${i * 150}ms` }}
          />
        ))}
      </div>
    </div>
  );
}
