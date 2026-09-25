"use client";

import { MapPin, Mail, Phone } from "lucide-react";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export default function ContactPage() {
  return (
    <div className="py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-3xl font-bold mb-8">Contattaci</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-3">Informazioni Aziendali</h2>
              <p className="text-muted-foreground">
                Bazziba S.r.l. - P.IVA 17497291009 - REA RM-1722388
              </p>
              <p className="text-muted-foreground mt-2">
                Via Gaspero Barbera 103, 00173 Roma RM, Italia
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-brand-yellow" />
              <div>
                <p className="font-medium">Email</p>
                <p className="text-muted-foreground">info@bazziba.it</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Phone className="h-5 w-5 text-brand-yellow" />
              <div>
                <p className="font-medium">Telefono</p>
                <p className="text-muted-foreground">Non disponibile</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <MapPin className="h-5 w-5 text-brand-yellow" />
              <div>
                <p className="font-medium">Sede Legale</p>
                <p className="text-muted-foreground">
                  Via Gaspero Barbera 103, Roma RM, Italia
                </p>
              </div>
            </div>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              const form = e.currentTarget as HTMLFormElement;
              const data = new FormData(form);
              fetch("/api/contact", {
                method: "POST",
                body: data,
              }).then(() => {
                alert("Messaggio inviato con successo!");
                form.reset();
              });
            }}
            className="space-y-4"
          >
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                name="firstName"
                placeholder="Nome"
                required
                className="rounded-md border border-input px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-yellow"
              />
              <input
                type="text"
                name="lastName"
                placeholder="Cognome"
                required
                className="rounded-md border border-input px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-yellow"
              />
            </div>
            <input
              type="email"
              name="email"
              placeholder="Email"
              required
              className="w-full rounded-md border border-input px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-yellow"
            />
            <input
              type="text"
              name="subject"
              placeholder="Oggetto"
              required
              className="w-full rounded-md border border-input px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-yellow"
            />
            <textarea
              name="message"
              placeholder="Messaggio"
              rows={5}
              required
              className="w-full rounded-md border border-input px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-yellow"
            />
            <button
              type="submit"
              className="w-full rounded-md bg-brand-yellow px-4 py-2 text-sm font-semibold text-black hover:bg-brand-yellow/90"
            >
              Invia Messaggio
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
