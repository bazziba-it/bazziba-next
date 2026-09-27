/** @format */

import { Suspense } from "react";
import WpHomepageContent from "@/components/homepage/wp-homepage-content";

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#050a14]" />}>
      <WpHomepageContent />
    </Suspense>
  );
}
