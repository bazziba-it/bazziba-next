export default function AboutPage() {
  return (
    <div className="py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-3xl font-bold mb-8">Chi Siamo</h1>
        <div className="prose dark:prose-invert max-w-none">
          <p>
            <strong>BAZZIBA!</strong> (tutto maiuscolo) rappresenta, al presente, il nuovo
            modo di concepire e condividere l'arte. La Nuova Piattaforma digitale dedicata
            esclusivamente al mondo artistico di vario genere e lingua che ospita contenuti
            video realizzati per eccellenza e con strumenti di ultima generazione.
          </p>

          <h2 className="text-xl font-semibold text-foreground">Bazziba - Chi siamo</h2>
          <p>
            Bazziba S.r.l. (P.IVA 17497291009), Via Gaspero Barbera 103, R.E.A. RM-1722388 —
            una startup innovativa nata per dare visibilità agli artisti di tutti i generi.
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
    </div>
  );
}
