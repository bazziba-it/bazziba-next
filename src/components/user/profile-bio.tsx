"use client";

import { useState } from "react";

/** Bio with word-breaking + expand/collapse for long artist bios. */
export function ProfileBio({ bio }: { bio: string }) {
  const [expanded, setExpanded] = useState(false);
  const isLong = bio.length > 220;

  return (
    <div className="mt-3">
      <p className={`text-white/70 leading-relaxed break-words ${!expanded && isLong ? "line-clamp-4" : ""}`}>
        {bio}
      </p>
      {isLong && (
        <button
          onClick={() => setExpanded((v) => !v)}
          className="mt-1 text-sm text-[#00f2ff] hover:underline"
        >
          {expanded ? "Mostra meno" : "Mostra di più"}
        </button>
      )}
    </div>
  );
}
