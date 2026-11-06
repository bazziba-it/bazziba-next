import WpStaticPage from "@/components/layout/wp-static-page";

export const revalidate = 3600;

export default function FaqPage() {
  return <WpStaticPage slug="faq" fallbackTitle="FAQ" />;
}
