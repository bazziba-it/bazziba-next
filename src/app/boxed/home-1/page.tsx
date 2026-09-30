"use client";

import dynamic from "next/dynamic";

const BoxedHome1Client = dynamic(
  () => import("./boxed-home-1-client"),
  { ssr: false }
);

export default function BoxedHome1Page() {
  return <BoxedHome1Client />;
}