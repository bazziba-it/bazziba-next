import WpStaticPage from "@/components/layout/wp-static-page";

export const revalidate = 3600;

export default function PrivacyPolicyPage() {
  return <WpStaticPage slug="privacy-policy" fallbackTitle="Privacy Policy" />;
}
