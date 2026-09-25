export default function TermsPage() {
  return (
    <div className="py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-3xl font-bold mb-8">Termini e Condizioni</h1>
        <div className="space-y-6 text-sm text-muted-foreground">
          <p>Ultimo aggiornamento: {new Date().toLocaleDateString("it-IT")}</p>
          <p>
            Bazziba S.r.l. (P.IVA 17497291009) - Via Gaspero Barbera 103 - R.E.A. RM-1722388
          </p>
          <p>
            Il presente documento costituisce il contratto tra l'utente e Bazziba per l'uso
            della piattaforma. Leggendo e accettando questi Termini, l'utente dichiara di
            averli compresi e accettati integralmente.
          </p>

          <h2 className="text-xl font-semibold text-foreground mb-2">1. Registrazione</h2>
          <p>
            La registrazione è aperta a tutti i cittadini italiani con età minima di 14 anni.
            Per gli utenti tra i 14 e i 16 anni, è richiesto il consenso dei genitori.
            L'accesso alle funzionalità complete richiede la registrazione.
          </p>

          <h2 className="text-xl font-semibold text-foreground mb-2">2. Contenuti</h2>
          <p>
            Gli utenti possono caricare video esclusivamente aventi carattere artistico e/o
            culturale. Sono vietati: contenuti violenti, pornografici, discriminatori,
            incitamenti all'odio, cyberbullo, e contenuti non artistici. Bazziba si riserva
            il diritto di rimuovere qualsiasi contenuto inappropriato.
          </p>

          <h2 className="text-xl font-semibold text-foreground mb-2">3. Proprietà Intellettuale</h2>
          <p>
            Gli autori mantengono i diritti sui propri contenuti. Bazziba non si assume
            alcuna responsabilità per la violazione dei diritti di terzi. È vietata la
            duplicazione di contenuti protetti da copyright senza autorizzazione.
          </p>

          <h2 className="text-xl font-semibold text-foreground mb-2">4. Responsabilità</h2>
          <p>
            Bazziba non è responsabile per i contenuti pubblicati dagli utenti né per eventuali
            danni derivanti da essi. Il servizio è fornito "così com'è" senza garanzie.
          </p>

          <h2 className="text-xl font-semibold text-foreground mb-2">5. Modifiche</h2>
          <p>
            Bazziba si riserva il diritto di modificare i presenti Termini in qualsiasi momento.
            Le modifiche saranno comunicate agli utenti tramite email e notifica sulla piattaforma.
          </p>
        </div>
      </div>
    </div>
  );
}
