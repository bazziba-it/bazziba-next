import WpStaticPage from "@/components/layout/wp-static-page";

export const revalidate = 3600;

export default function TermsPage() {
  return <WpStaticPage slug="terms" fallbackTitle="Termini e Condizioni" />;
}
