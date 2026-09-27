"use client";

import { useState } from "react";

export default function ContactForm() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="contact-form-wrap">
      {submitted ? (
        <div className="glass-card text-card-foreground p-8 rounded-xl text-center animate-fade-in">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-500/10 flex items-center justify-center">
            <svg className="h-8 w-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-xl font-bold mb-2">Messaggio Inviato!</h3>
          <p className="text-muted-foreground">
            Ti ringraziamo per averci contattato. Risponderemo entro 48 ore.
          </p>
          <button
            onClick={() => setSubmitted(false)}
            className="mt-6 text-sm text-brand-yellow hover:underline"
          >
            Invia un altro messaggio
          </button>
        </div>
      ) : (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setSubmitted(true);
          }}
          className="space-y-4"
        >
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1.5 text-muted-foreground">
                Nome
              </label>
              <input
                type="text"
                name="firstName"
                required
                className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-yellow transition-all"
                placeholder="Il tuo nome"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5 text-muted-foreground">
                Cognome
              </label>
              <input
                type="text"
                name="lastName"
                required
                className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-yellow transition-all"
                placeholder="Il tuo cognome"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5 text-muted-foreground">
              Email
            </label>
            <input
              type="email"
              name="email"
              required
              className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-yellow transition-all"
              placeholder="email@esempio.it"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5 text-muted-foreground">
              Oggetto
            </label>
            <input
              type="text"
              name="subject"
              required
              className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-yellow transition-all"
              placeholder="Di cosa vuoi parlerà?"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5 text-muted-foreground">
              Messaggio
            </label>
            <textarea
              name="message"
              required
              rows={5}
              className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-yellow transition-all resize-y"
              placeholder="Scrivi il tuo messaggio..."
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-brand-yellow px-4 py-3 text-sm font-semibold text-black hover:bg-brand-gold-hover transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            Invia Messaggio
          </button>
        </form>
      )}
    </div>
  );
}
