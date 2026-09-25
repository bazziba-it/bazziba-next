export default function PrivacyPage() {
  return (
    <div className="py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-3xl font-bold mb-8">Privacy Policy</h1>
        <div className="space-y-6 text-sm text-muted-foreground">
          <p>Ultimo aggiornamento: {new Date().toLocaleDateString("it-IT")}</p>
          <p>
            Bazziba S.r.l. (di seguito "Bazziba", "noi", "nostri") si impegna a proteggere la privacy
            dei suoi utenti. Il presente documento descrive come raccogliamo, utilizziamo e proteggiamo
            i dati personali forniti dagli utenti.
          </p>
          
          <h2 className="text-xl font-semibold text-foreground mb-2">Dati Raccolti</h2>
          <p>
            Raccogliamo i seguenti dati personali durante la registrazione: nome, indirizzo email,
            username e informazioni sul profilo. Inoltre raccogliamo dati su come gli utenti
            interagiscono con la piattaforma (visualizzazioni, like, commenti).
          </p>
          
          <h2 className="text-xl font-semibold text-foreground mb-2">Utilizzo dei Dati</h2>
          <ul className="list-disc list-inside space-y-2">
            <li>Fornire e migliorare il servizio</li>
            <li>Gestire l'account utente</li>
            <li>Personalizzare l'esperienza</li>
            <li>Comunicare aggiornamenti e notizie</li>
            <li>Analizzare l'utilizzo della piattaforma</li>
          </ul>
          
          <h2 className="text-xl font-semibold text-foreground mb-2">Base Giuridica</h2>
          <p>
            Il trattamento dei dati si basa sul consenso espresso in fase di registrazione,
            in conformità al Regolamento (UE) 2016/679 (GDPR). Il consenso può essere revocato
            in qualsiasi momento.
          </p>
          
          <h2 className="text-xl font-semibold text-foreground mb-2">Condivisione con Terzi</h2>
          <p>
            I dati personali non vengono ceduti a terzi, salvo per le seguenti eccezioni:
            servizi di streaming video (Cloudflare Stream), servizi di analisi (Plausible),
            e servizi di email (per newsletter). Tutti i fornitori sono GDPR-compliant.
          </p>
          <h2 className="text-xl font-semibold text-foreground mb-2">Diritti degli Utenti</h2>
          <ul className="list-disc list-inside space-y-2">
            <li>Diritto di accesso ai propri dati personali</li>
            <li>Diritto di rettifica e cancellazione</li>
            <li>Diritto di portabilità dei dati</li>
            <li>Diritto di opposizione e revoca del consenso</li>
            <li>Diritto di accesso limitato (per utenti sotto i 16 anni)</li>
          </ul>
          
          <h2 className="text-xl font-semibold text-foreground mb-2">Contatti</h2>
          <p>
            Per esercitare i tuoi diritti o per domande sulla privacy:
            Email: info@bazziba.it
            Indirizzo: Bazziba S.r.l., Via Gaspero Barbera 103, REA RM-1722388, P.IVA 17497291009
          </p>
          
          <h2 className="text-xl font-semibold text-foreground mb-2">Età Minima</h2>
          <p>
            La registrazione è permessa a chi ha almeno 14 anni. Per utenti tra i 14 e i 16 anni,
            il trattamento dei dati richiede il consenso dei genitori.
          </p>
        </div>
      </div>
    </div>
  );
}
