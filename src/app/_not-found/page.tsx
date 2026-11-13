export const dynamic = "force-dynamic";
export const dynamicParams = false;
export const revalidate = 0;

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 text-center">
      <div className="space-y-6 max-w-md">
        <div>
          <h1 className="text-8xl font-bold text-primary">404</h1>
          <h2 className="text-2xl font-semibold text-foreground mt-2">
            Pagina non trovata
          </h2>
        </div>
        <p className="text-muted-foreground">
          La pagina che stai cercando non esiste o è stata rimossa.
        </p>
        <a
          href="/"
          className="inline-block rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Torna alla Home
        </a>
      </div>
    </div>
  );
}
