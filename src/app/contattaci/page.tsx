import ContactForm from "./contact-form";

export const dynamic = "force-dynamic";

export default function ContactPage() {
  return (
    <div className="py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-10 animate-fade-in">
          <h1 className="text-4xl font-bold mb-4 gradient-text">Contattaci</h1>
          <p className="text-lg text-muted-foreground">
            Hai domande, suggerimenti o vuoi collaborare? Scrivici!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Info */}
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-3">Informazioni Aziendali</h2>
              <div className="glass-card text-card-foreground p-4 rounded-xl">
                <p className="text-sm text-muted-foreground">
                  Bazziba S.r.l. - P.IVA 17497291009 - REA RM-1722388
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Via Gaspero Barbera 103, 00173 Roma RM, Italia
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-brand-yellow/10 flex items-center justify-center flex-shrink-0">
                <svg className="h-5 w-5 text-brand-yellow" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <p className="font-medium text-sm">Email</p>
                <p className="text-sm text-muted-foreground">info@bazziba.it</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-brand-yellow/10 flex items-center justify-center flex-shrink-0">
                <svg className="h-5 w-5 text-brand-yellow" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <div>
                <p className="font-medium text-sm">Telefono</p>
                <p className="text-sm text-muted-foreground">Non disponibile</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-brand-yellow/10 flex items-center justify-center flex-shrink-0">
                <svg className="h-5 w-5 text-brand-yellow" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <p className="font-medium text-sm">Sede Legale</p>
                <p className="text-sm text-muted-foreground">
                  Via Gaspero Barbera 103, Roma RM, Italia
                </p>
              </div>
            </div>
          </div>

          {/* Form */}
          <ContactForm />
        </div>
      </div>
    </div>
  );
}
