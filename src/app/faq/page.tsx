export const runtime = "nodejs";

export default async function FaqPage() {
  const faqs = [
    {
      q: "Cosa è Bazziba?",
      a: "La Nuova Piattaforma digitale dedicata esclusivamente al mondo artistico di vario genere e lingua che ospita contenuti video. Bazziba rappresenterà un luogo di incontro, di condivisione e di comunicazione, in cui sarà possibile pubblicare esclusivamente contenuti aventi carattere e/o interesse artistico e culturale.",
    },
    {
      q: "Come funziona Bazziba?",
      a: "Bazziba è una piattaforma semplice da usare. Per usufruire di tutte le funzioni consigliamo di registrarsi. Gli utenti non registrati possono comunque vedere e ascoltare i video degli artisti.",
    },
    {
      q: "Come eliminare i video e rimuovere i commenti?",
      a: "Ogni Utente registrato potrà caricare ed eliminare i propri video, inserire e cancellare commenti in piena libertà.",
    },
    {
      q: "Come partecipare al contest?",
      a: "Dopo aver caricato almeno un video con contenuti artistici, puoi partecipare al contest mensile gratuito scegliendo un video come candidatura.",
    },
    {
      q: "Quanto dura un contest?",
      a: "I contest durano 30 giorni, iniziando ogni mese.",
    },
    {
      q: "Cosa non si può caricare su Bazziba?",
      a: "Contenuti non artistici, violenti o pericolrosi, cyberbullismo, incitamento all'odio.",
    },
  ];

  return (
    <div className="py-8">
      <div className="container mx-auto px-4 max-w-3xl">
        <h1 className="text-3xl font-bold mb-8">FAQ - Domande Frequenti</h1>
        <div className="space-y-6">
          {faqs.map((faq, i) => (
            <div key={i} className="border rounded-lg p-4">
              <h2 className="text-xl font-semibold mb-2">{faq.q}</h2>
              <p className="text-muted-foreground">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
