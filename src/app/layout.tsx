import "./globals.css";
import type { ReactNode } from "react";
import { Inter, Poppins } from "next/font/google";
import { Toaster } from "sonner";
import { Navigation } from "@/components/layout/navigation";
import { MobileBottomNav } from "@/components/layout/mobile-bottom-nav";
import Footer from "@/components/layout/footer";
import { ThemeProvider } from "next-themes";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800", "900"],
  variable: "--font-display",
});

export const metadata = {
  title: {
    default: "BAZZIBA! - La Nuova Piattaforma delle Arti",
    template: `%s | BAZZIBA!`,
  },
  description: "Bazziba! è la Nuova Piattaforma digitale dedicata esclusivamente al mondo artistico di vario genere e lingua. Video, musica, arte, cultura.",
  keywords: "bazziba, video art, musica, artisti, cultura, concorsi, video contest, italiano",
  authors: [{ name: "Bazziba S.r.l." }],
  creator: "Bazziba S.r.l.",
  publisher: "Bazziba S.r.l.",
  openGraph: {
    type: "website",
    locale: "it_IT",
    url: "https://bazziba.it",
    siteName: "BAZZIBA!",
    title: "BAZZIBA! - La Nuova Piattaforma delle Arti",
    description: "Bazziba! è la Nuova Piattaforma digitale dedicata esclusivamente al mondo artistico.",
    images: [{ url: "https://bazziba.it/og.png", width: 1200, height: 630, alt: "BAZZIBA! - La Nuova Piattaforma delle Arti" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "BAZZIBA! - La Nuova Piattaforma delle Arti",
    description: "Scopri l'arte digitale con BAZZIBA!",
    images: ["https://bazziba.it/og.png"],
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-video-preview": -1, "max-image-preview": "large", "max-snippet": -1 } },
  alternates: { canonical: "https://bazziba.it", languages: { "it-IT": "https://bazziba.it" } },
  icons: { icon: "/favicon.ico", apple: "/apple-touch-icon.png" },
};

function ThemeScript() {
  return (
    <script
      id="__theme"
      dangerouslySetInnerHTML={{
        __html: `
        (function() {
          try {
            var theme = localStorage.getItem('theme');
            var useDark = theme === 'dark' || (!theme);
            var html = document.documentElement;
            if (useDark) {
              html.classList.add('dark');
              html.setAttribute('data-theme', 'dark');
            }
          } catch(e) {}
        })();
        `,
      }}
    />
  );
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="it" className="dark" data-theme="dark" suppressHydrationWarning>
      <head>
        <ThemeScript />
      </head>
      <body className={`${inter.variable} ${poppins.variable} min-h-screen bg-background text-foreground antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <div className="relative flex min-h-screen flex-col">
            <Navigation />
            <main className="flex-1 pb-16 md:pb-0">{children}</main>
            <Footer />
            <MobileBottomNav />
          </div>
          <Toaster closeButton position="bottom-left" theme="system" richColors />
        </ThemeProvider>
      </body>
    </html>
  );
}
