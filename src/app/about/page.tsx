export default function AboutPage() {
  return (
    <div className="py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Hero */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">
            <span className="gradient-text">Chi Siamo</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            BAZZIBA! è la nuova piattaforma digitale dedicata esclusivamente al mondo artistico.
          </p>
        </div>

        {/* Main content */}
        <div className="space-y-8 mb-12">
          <div className="prose dark:prose-invert max-w-none">
            <p>
              <strong>BAZZIBA!</strong> (tutto maiuscolo) rappresenta, al presente, il nuovo
              modo di concepire e condividere l'arte. La Nuova Piattaforma digitale dedicata
              esclusivamente al mondo artistico di vario genere e lingua che ospita contenuti
              video realizzati per eccellenza e con strumenti di ultima generazione.
            </p>

            <h2 className="text-xl font-semibold text-foreground">Bazziba S.r.l.</h2>
            <p>
              P.IVA 17497291009 — Via Gaspero Barbera 103, R.E.A. RM-1722388
              <br />
              Una startup innovativa nata per dare visibilità agli artisti di tutti i generi.
              La nostra missione è semplice: far incontrare artisti e appassionati di bellezza,
              creando un ecosistema digitale sostenibile e inclusivo.
            </p>

            <h2 className="text-xl font-semibold text-foreground">La Nostra Visione</h2>
            <p>
              Rappresentare un luogo di incontro, di condivisione e di comunicazione, in cui
              sarà possibile pubblicare esclusivamente contenuti aventi carattere e/o interesse
              artistico e culturale. Il nostro obiettivo è rendere accessibile l'arte a tutti,
              superando barriere geografiche e sociali.
            </p>

            <h2 className="text-xl font-semibold text-foreground">I Nostri Valori</h2>
            <ul>
              <li><strong>Qualità:</strong> Contenuti di eccellenza, sempre.</li>
              <li><strong>Condivisione:</strong> L'arte è per tutti.</li>
              <li><strong>Sostenibilità:</strong> Piattaforma a impatto zero.</li>
              <li><strong>Inclusione:</strong> Accessibile a tutti.</li>
            </ul>
          </div>
        </div>

        {/* Categories showcase */}
        <div className="border-t pt-12">
          <h2 className="text-2xl font-bold mb-6 text-center">Le nostre categorie</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { name: "Cantanti", icon: "🎤", count: "42 video" },
              { name: "Musicisti", icon: "🎸", count: "87 video" },
              { name: "Arti Varie", icon: "🎨", count: "31 video" },
              { name: "Artisti Di Strada", icon: "🎭", count: "28 video" },
              { name: "Poeti", icon: "📜", count: "56 video" },
              { name: "DJ", icon: "🎧", count: "19 video" },
              { name: "Ballerini", icon: "💃", count: "44 video" },
              { name: "Cinema", icon: "🎬", count: "35 video" },
              { name: "Pittori", icon: "🖼️", count: "23 video" },
            ].map((cat) => (
              <div
                key={cat.name}
                className="flex items-center gap-3 p-4 rounded-xl bg-card border"
              >
                <span className="text-2xl">{cat.icon}</span>
                <div>
                  <h3 className="font-medium">{cat.name}</h3>
                  <p className="text-sm text-muted-foreground">{cat.count}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
