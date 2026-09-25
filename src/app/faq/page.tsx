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
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">
            <span className="gradient-text">FAQ</span>
          </h1>
          <p className="text-muted-foreground">
            Domande frequenti su Bazziba e il suo funzionamento
          </p>
        </div>

        {/* FAQ items */}
        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <details
              key={i}
              className="group border rounded-xl p-4 bg-card transition-all duration-200 hover:shadow-md"
            >
              <summary className="flex items-center justify-between cursor-pointer font-semibold text-lg">
                <span>{faq.q}</span>
                <span className="text-muted-foreground group-hover:text-brand-yellow transition-colors">
                  ▼
                </span>
              </summary>
              <div className="mt-3 text-muted-foreground leading-relaxed">
                {faq.a}
              </div>
            </details>
          ))}
        </div>

        {/* Contact section */}
        <div className="border-t mt-12 pt-8 text-center">
          <h3 className="font-semibold mb-2">Non hai trovato la risposta?</h3>
          <p className="text-muted-foreground mb-4">
            Contattaci all'indirizzo{" "}
            <a
              href="mailto:info@bazziba.it"
              className="text-brand-yellow hover:underline"
            >
              info@bazziba.it
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
