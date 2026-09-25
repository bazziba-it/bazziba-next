import { Logo } from "@/components/ui/logo";

export default function Footer() {
  return (
    <footer className="border-t py-8 mt-auto">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Logo />
            <span className="font-bold text-xl">Bazziba!</span>
          </div>
          <p className="text-sm text-muted-foreground">
            La Nuova Piattaforma delle Arti
          </p>
        </div>

        <div>
          <h3 className="font-semibold mb-3">Navigazione</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="/feed/latest" className="hover:text-brand-yellow">Home</a></li>
            <li><a href="/feed/trending" className="hover:text-brand-yellow">Popolari</a></li>
            <li><a href="/contest" className="hover:text-brand-yellow">Contest</a></li>
            <li><a href="/upload" className="hover:text-brand-yellow">Carica</a></li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold mb-3">Informazioni</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="/about" className="hover:text-brand-yellow">Chi Siamo</a></li>
            <li><a href="/faq" className="hover:text-brand-yellow">FAQ</a></li>
            <li><a href="/privacy-policy" className="hover:text-brand-yellow">Privacy</a></li>
            <li><a href="/terms" className="hover:text-brand-yellow">Termini</a></li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold mb-3">Contatti</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>Email: info@bazziba.it</li>
            <li>P.IVA: 17497291009</li>
            <li>Via Gaspero Barbera 103</li>
          </ul>
        </div>
      </div>

      <div className="container mx-auto px-4 border-t mt-8 pt-4 text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} Bazziba S.r.l. Tutti i diritti riservati.</p>
      </div>
    </footer>
  );
}
