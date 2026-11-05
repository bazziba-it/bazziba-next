/**
 * VideoPlayer — React wrapper using react-player (already installed)
 * Gold-dark themed player for Bazziba, with poster, controls, and
 * a branded overlay. Supports YouTube, direct MP4, HLS, etc.
 */

"use client";

import { useRef, useEffect, useState } from "react";
import ReactPlayer from "react-player";

interface VideoPlayerProps {
  url: string;
  poster?: string;
  title?: string;
  autoPlay?: boolean;
  className?: string;
  width?: string | number;
  height?: string | number;
}

export default function VideoPlayer({
  url,
  poster,
  title = "",
  autoPlay = false,
  className = "",
  width = "100%",
  height = "100%",
}: VideoPlayerProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const playerRef = useRef<ReactPlayer>(null);
  const [playing, setPlaying] = useState(autoPlay);
  const [played, setPlayed] = useState(0);
  const [duration, setDuration] = useState(0);
  const [buffered, setBuffered] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setPlaying(autoPlay);
  }, [autoPlay]);

  return (
    <div
      className={`relative w-full aspect-video rounded-xl overflow-hidden bg-muted ${className}`}
      style={{ background: "hsl(var(--background))" }}
    >
      {/* Poster image */}
      {poster && (
        <div
          className="absolute inset-0 w-full h-full bg-cover bg-center transition-opacity"
          style={{
            backgroundImage: `url(${poster})`,
            opacity: playing ? 0 : 1,
          }}
        />
      )}
      {/* Gradient overlay on poster */}
      {poster && (
        <div
          className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent transition-opacity"
          style={{ opacity: playing ? 0 : 1 }}
        />
      )}

      {/* React Player */}
      <ReactPlayer
        ref={playerRef}
        url={url}
        width={width}
        height={height}
        playing={playing}
        loop={false}
        controls={true}
        playsinline={true}
        muted={false}
        preload="metadata"
        config={{
          file: {
            attributes: {
              crossorigin: "anonymous",
              playsinline: true,
            },
          },
          youtube: {
            playerVars: {
              modestbranding: 1 as const,
              rel: 0 as const,
            },
          },
        }}
        onReady={(p) => {
          const player = p as ReactPlayer | null;
          setDuration(player?.getDuration?.() || 0);
          setLoading(false);
        }}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onProgress={(state: any) => setPlayed(state.played || 0)}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onBuffer={(state: any) => setBuffered(state.buffered || 0)}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          objectFit: "contain",
        }}
      />

      {/* Play/pause overlay */}
      {!playing && (
        <div
          className="absolute inset-0 flex items-center justify-center cursor-pointer group"
          onClick={() => {
            setPlaying(true);
            playerRef.current?.play?.();
          }}
        >
          <div
            className="w-16 h-16 rounded-full bg-brand-yellow/90 flex items-center justify-center shadow-2xl transition-transform group-hover:scale-105"
            style={{ backdropFilter: "blur(6px)" }}
          >
            <svg
              className="w-7 h-7 text-black ml-0.5"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
          {/* Video title label */}
          {title && (
            <div className="absolute bottom-4 left-4 right-4">
              <p className="text-white/90 text-sm font-medium text-center truncate">
                {title}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Bottom gradient (ensures controls are readable) */}
      <div
        className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/60 to-transparent pointer-events-none"
        style={{ opacity: playing ? 1 : 0 }}
      />

      {/* Loading spinner */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/30">
          <div className="w-10 h-10 rounded-full border-2 border-brand-yellow/50 border-t-brand-yellow animate-spin" />
        </div>
      )}
    </div>
  );
}
