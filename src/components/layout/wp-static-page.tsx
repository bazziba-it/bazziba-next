import { fetchPageBySlug } from "@/data/wp";
import { GlassSurface } from "@/components/ui";

/**
 * Renders a real bazziba.it WP page (content.rendered) inside the glass shell.
 * Used by about/faq/privacy-policy/terms — content lives in WP, not in code.
 */
export default async function WpStaticPage({ slug, fallbackTitle }: { slug: string; fallbackTitle: string }) {
  const page = await fetchPageBySlug(slug).catch(() => null);

  return (
    <div className="py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold mb-4 gradient-text">{page?.title ?? fallbackTitle}</h1>
        </div>
        {page ? (
          <GlassSurface tier="card" className="rounded-2xl p-6 md:p-10">
            {/* Real WP page HTML — trusted first-party source (bazziba.it) */}
            <div
              className="prose dark:prose-invert max-w-none
                [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:mt-8 [&_h1]:mb-4
                [&_h2]:text-xl [&_h2]:font-bold [&_h2]:mt-8 [&_h2]:mb-3
                [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:mt-6 [&_h3]:mb-2
                [&_p]:text-white/70 [&_p]:leading-relaxed [&_p]:mb-4
                [&_a]:text-[#00f2ff] [&_a]:underline
                [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-4
                [&_li]:text-white/70 [&_li]:mb-1
                [&_strong]:text-white"
              dangerouslySetInnerHTML={{ __html: page.content }}
            />
          </GlassSurface>
        ) : (
          <p className="text-center text-white/40 py-12">
            Contenuto non disponibile — bazziba.it non risponde. Riprova più tardi.
          </p>
        )}
      </div>
    </div>
  );
}
