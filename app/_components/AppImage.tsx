"use client";

import { useState } from "react";

// Renders a photo from /public/images/... but if the file isn't there yet,
// shows a tasteful gradient tile with the item's name — so the layout looks
// complete before the client drops real images in. See REDESIGN_PLAN.md §6.
export function AppImage({
  src,
  alt,
  label,
  className = "",
  fit = "cover",
}: {
  src: string;
  alt: string;
  label?: string;
  className?: string;
  // "cover" for photos (fills the box); "contain" for logos (shows the whole
  // mark on a clean surface, no cropping).
  fit?: "cover" | "contain";
}) {
  const [failed, setFailed] = useState(false);
  const isContain = fit === "contain";
  return (
    <div
      className={`relative overflow-hidden ${
        isContain ? "bg-surface" : "bg-gradient-to-br from-primary/20 via-muted to-accent/20"
      } ${className}`}
    >
      {!failed && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={alt}
          loading="lazy"
          onError={() => setFailed(true)}
          className={`absolute inset-0 h-full w-full ${
            isContain ? "object-contain p-1.5" : "object-cover"
          }`}
        />
      )}
      {failed && (
        <span className="absolute inset-0 flex items-center justify-center p-3 text-center text-sm font-semibold text-muted-foreground">
          {label ?? alt}
        </span>
      )}
    </div>
  );
}
