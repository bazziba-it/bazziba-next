/**
 * BazzibaPlayer — custom HTML5 video player (replaces react-player, whose v3
 * API dropped `url` and silently never played). Real controls per the design
 * language: glass control bar, cyan accent, auto-hide, keyboard shortcuts,
 * PiP, playback speed, fullscreen, volume, seek bar with buffered display.
 */

"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { savePosition, getPosition, clearPosition } from "@/lib/watch-later";
import Hls from "hls.js";
import {
  Play, Pause, Volume2, VolumeX, Maximize, Minimize,
  PictureInPicture2, Gauge, ExternalLink, Loader2, Settings,
} from "lucide-react";
import { MOTION } from "@/components/ui/glass";

interface UpNext {
  href: string;
  title: string;
  thumbnail: string | null;
}

interface VideoSource {
  src: string;
  type: string;
}

interface VideoPlayerProps {
  url: string;
  /** Preferred multi-source list (HLS playlist first when Bunny-hosted). */
  sources?: VideoSource[];
  poster?: string | null;
  title?: string;
  autoPlay?: boolean;
  className?: string;
  width?: string | number;
  height?: string | number;
  /** Stable video id — enables resume-position memory (localStorage). */
  videoId?: string;
  /** Autoplay-next overlay with countdown when the video ends. */
  upNext?: UpNext | null;
}

const RATES = [0.5, 0.75, 1, 1.25, 1.5, 2];

function fmt(sec: number): string {
  if (!Number.isFinite(sec) || sec < 0) return "0:00";
  const s = Math.floor(sec);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const r = s % 60;
  return h > 0
    ? `${h}:${String(m).padStart(2, "0")}:${String(r).padStart(2, "0")}`
    : `${m}:${String(r).padStart(2, "0")}`;
}

export default function VideoPlayer({
  url,
  sources,
  poster,
  title = "",
  autoPlay = false,
  className = "",
  videoId,
  upNext = null,
}: VideoPlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hlsRef = useRef<Hls | null>(null);

  const [playing, setPlaying] = useState(false);
  const [started, setStarted] = useState(false); // user started playback at least once
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [buffered, setBuffered] = useState(0);
  const [volume, setVolume] = useState(1);
  const [muted, setMuted] = useState(false);
  const [rate, setRate] = useState(1);
  const [fullscreen, setFullscreen] = useState(false);
  const [waiting, setWaiting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errorCode, setErrorCode] = useState(0);
  const [controlsVisible, setControlsVisible] = useState(true);
  const [rateOpen, setRateOpen] = useState(false);
  const [upNextCountdown, setUpNextCountdown] = useState<number | null>(null);
  const [resumeOffer, setResumeOffer] = useState<number | null>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [qualityLevels, setQualityLevels] = useState<{ height: number; index: number }[]>([]);
  const [quality, setQuality] = useState<number>(-1); // -1 = Auto

  // Source resolution: HLS playlist (multi-quality) preferred over single MP4
  const src = sources?.find((s) => /mpegurl|m3u8/i.test(s.type))?.src ?? sources?.[0]?.src ?? url;
  const isHls = /\.m3u8($|\?)/i.test(src) || /mpegurl/i.test(sources?.[0]?.type ?? "");

  const wakeControls = useCallback(() => {
    setControlsVisible(true);
    if (hideTimer.current) clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => {
      if (videoRef.current && !videoRef.current.paused) setControlsVisible(false);
    }, 2800);
  }, []);

  const togglePlay = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      v.play().then(() => setStarted(true)).catch(() => setPlaying(false));
    } else {
      v.pause();
    }
    wakeControls();
  }, [wakeControls]);

  const seekTo = useCallback((clientX: number, el: HTMLDivElement) => {
    const v = videoRef.current;
    if (!v || !Number.isFinite(v.duration)) return;
    const rect = el.getBoundingClientRect();
    const frac = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
    v.currentTime = frac * v.duration;
    wakeControls();
  }, [wakeControls]);

  // Autoplay attempt: must start muted per browser policy, then unmute on first gesture
  useEffect(() => {
    const v = videoRef.current;
    if (!v || !autoPlay) return;
    v.muted = true;
    setMuted(true);
    v.play()
      .then(() => setStarted(true))
      .catch(() => { setMuted(false); v.muted = false; });
  }, [autoPlay, url]);

  useEffect(() => setIsClient(true), []);

  // HLS attach: hls.js where supported, native (Safari) otherwise
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (isHls && Hls.isSupported()) {
      const hls = new Hls({ enableWorker: true, lowLatencyMode: false });
      hlsRef.current = hls;
      hls.loadSource(src);
      hls.attachMedia(v);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        const levels = (hls.levels ?? [])
          .map((l, i) => ({ height: l.height ?? 0, index: i }))
          .filter((l) => l.height > 0)
          .sort((a, b) => b.height - a.height);
        setQualityLevels(levels);
        setQuality(-1);
        if (autoPlay) v.play().catch(() => {});
      });
      hls.on(Hls.Events.LEVEL_SWITCHED, (_e, data) => {
        if (quality === -1) setQuality(-1); // keep "Auto" label; hls picks the level
        void data;
      });
      hls.on(Hls.Events.ERROR, (_e, data) => {
        if (data.fatal) setError("Errore di streaming HLS — riprova o apri il file sorgente.");
      });
      return () => {
        hls.destroy();
        hlsRef.current = null;
      };
    }
    if (isHls && v.canPlayType("application/vnd.apple.mpegurl")) {
      v.src = src; // Safari native HLS
    }
    return undefined;
  }, [src, isHls, autoPlay]);

  // Quality switch (hls.js): -1 Auto, else pin the level index
  const selectQuality = useCallback((index: number) => {
    setQuality(index);
    const hls = hlsRef.current;
    if (hls) hls.currentLevel = index;
  }, []);

  // Resume-position offer (localStorage memory, 30-day TTL)
  useEffect(() => {
    if (!videoId) return;
    const pos = getPosition(videoId);
    if (pos && pos > 20) setResumeOffer(pos);
  }, [videoId]);

  // Save position ~every 5s while playing; clear on ended
  const lastSave = useRef(0);
  useEffect(() => {
    if (!videoId) return;
    const v = videoRef.current;
    if (!v) return;
    const onTime = () => {
      const now = Date.now();
      if (now - lastSave.current > 5000 && v.currentTime > 10 && !v.ended) {
        lastSave.current = now;
        savePosition(videoId, v.currentTime);
      }
    };
    const onEnd = () => {
      clearPosition(videoId);
      if (upNext) setUpNextCountdown(8);
    };
    v.addEventListener("timeupdate", onTime);
    v.addEventListener("ended", onEnd);
    return () => {
      v.removeEventListener("timeupdate", onTime);
      v.removeEventListener("ended", onEnd);
    };
  }, [videoId, upNext]);

  // Autoplay-next countdown ticks then navigates
  useEffect(() => {
    if (upNextCountdown == null || !upNext) return;
    if (upNextCountdown <= 0) {
      window.location.href = upNext.href;
      return;
    }
    const t = setTimeout(() => setUpNextCountdown((s) => (s != null ? s - 1 : null)), 1000);
    return () => clearTimeout(t);
  }, [upNextCountdown, upNext]);

  // Keyboard shortcuts on the focused container
  const onKeyDown = (e: React.KeyboardEvent) => {
    const v = videoRef.current;
    if (!v) return;
    switch (e.key) {
      case " ": case "k": e.preventDefault(); togglePlay(); break;
      case "ArrowRight": v.currentTime = Math.min(v.duration, v.currentTime + 10); break;
      case "ArrowLeft": v.currentTime = Math.max(0, v.currentTime - 10); break;
      case "ArrowUp": e.preventDefault(); v.volume = Math.min(1, v.volume + 0.1); break;
      case "ArrowDown": e.preventDefault(); v.volume = Math.max(0, v.volume - 0.1); break;
      case "f": toggleFullscreen(); break;
      case "m": v.muted = !v.muted; break;
    }
    wakeControls();
  };

  const toggleFullscreen = useCallback(async () => {
    const c = containerRef.current;
    const v = videoRef.current;
    if (!c) return;
    if (document.fullscreenElement) {
      await document.exitFullscreen().catch(() => {});
    } else if (c.requestFullscreen) {
      await c.requestFullscreen().catch(() => {});
    } else if (v && (v as any).webkitEnterFullscreen) {
      (v as any).webkitEnterFullscreen(); // iOS Safari
    }
  }, []);

  const togglePiP = useCallback(async () => {
    const v = videoRef.current;
    if (!v || !document.pictureInPictureEnabled) return;
    try {
      if (document.pictureInPictureElement) await document.exitPictureInPicture();
      else await v.requestPictureInPicture();
    } catch { /* unsupported */ }
  }, []);

  useEffect(() => {
    const onFsChange = () => setFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", onFsChange);
    return () => document.removeEventListener("fullscreenchange", onFsChange);
  }, []);

  useEffect(() => () => { if (hideTimer.current) clearTimeout(hideTimer.current); }, []);

  const playedPct = duration > 0 ? (currentTime / duration) * 100 : 0;
  const bufferedPct = duration > 0 ? (buffered / duration) * 100 : 0;

  return (
    <div
      ref={containerRef}
      tabIndex={0}
      onKeyDown={onKeyDown}
      onMouseMove={wakeControls}
      onTouchStart={wakeControls}
      className={`relative w-full aspect-video bg-black rounded-xl overflow-hidden group/player outline-none focus-visible:ring-2 focus-visible:ring-[#00f2ff] ${className}`}
    >
      {/* src is always rendered (SSR-safe); hls.js swaps to MSE in the effect.
          Never call Hls.isSupported() during render — it differs server/client
          and caused React #418 hydration mismatches. */}
      <video
        ref={videoRef}
        src={src}
        poster={poster ?? undefined}
        playsInline
        preload="metadata"
        className="absolute inset-0 w-full h-full object-contain"
        onClick={togglePlay}
        onDoubleClick={toggleFullscreen}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
        onDurationChange={(e) => setDuration(e.currentTarget.duration)}
        onProgress={(e) => {
          const v = e.currentTarget;
          try {
            if (v.buffered.length > 0) setBuffered(v.buffered.end(v.buffered.length - 1));
          } catch { /* no buffered data yet */ }
        }}
        onWaiting={() => setWaiting(true)}
        onPlaying={() => setWaiting(false)}
        onVolumeChange={(e) => {
          setVolume(e.currentTarget.volume);
          setMuted(e.currentTarget.muted);
        }}
        onRateChange={(e) => setRate(e.currentTarget.playbackRate)}
        onError={(e) => {
          const code = e.currentTarget.error?.code;
          setErrorCode(code ?? 0);
          setError(
            code === 2
              ? "Connessione interrotta durante il caricamento del video."
              : code === 3
                ? "Il file video è danneggiato o non decodificabile."
                : "Questo browser non supporta la riproduzione del formato video."
          );
        }}
        aria-label={title}
      />

      {/* Resume-position offer */}
      {resumeOffer != null && !started && !error && (
        <div className="absolute top-3 left-1/2 -translate-x-1/2 z-30 flex items-center gap-1 bg-black/80 border border-white/15 rounded-full pl-3 pr-1.5 py-1.5 backdrop-blur-sm">
          <span className="text-xs text-white/80">Riprendi da {fmt(resumeOffer)}?</span>
          <button
            onClick={() => {
              if (videoRef.current) videoRef.current.currentTime = resumeOffer;
              setResumeOffer(null);
            }}
            className="ml-1 px-3 py-1 bg-[#00f2ff] text-black text-xs font-bold rounded-full"
          >
            Sì
          </button>
          <button
            onClick={() => setResumeOffer(null)}
            className="px-3 py-1 text-xs text-white/60 hover:text-white rounded-full"
          >
            No
          </button>
        </div>
      )}

      {/* Autoplay-next countdown overlay */}
      {upNext && upNextCountdown != null && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 z-40 bg-black/85 flex flex-col items-center justify-center gap-4 text-center px-6"
        >
          <p className="text-[11px] uppercase tracking-widest text-white/50">Prossimo video tra {upNextCountdown}s</p>
          <a href={upNext.href} className="group relative rounded-xl overflow-hidden w-56 aspect-video border border-white/20">
            {upNext.thumbnail ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={upNext.thumbnail} alt={upNext.title} className="h-full w-full object-cover group-hover:scale-105 transition-transform" />
            ) : (
              <div className="h-full w-full bg-white/5" />
            )}
            <div className="absolute inset-0 flex items-center justify-center bg-black/30">
              <Play className="h-10 w-10 text-[#00f2ff] fill-current" />
            </div>
          </a>
          <p className="text-sm font-medium text-white line-clamp-2 max-w-xs">{upNext.title}</p>
          <div className="flex items-center gap-3">
            <a
              href={upNext.href}
              className="px-5 py-2 bg-[#00f2ff] text-black text-sm font-bold rounded-full"
            >
              Riproduci ora
            </a>
            <button
              onClick={() => setUpNextCountdown(null)}
              className="px-5 py-2 bg-white/10 text-white text-sm rounded-full border border-white/20"
            >
              Annulla
            </button>
          </div>
        </motion.div>
      )}

      {/* Error state — code-specific message + retry + direct-file fallback */}
      {error && (
        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center gap-3 bg-black/85 text-center px-6">
          <p className="text-white/80 text-sm max-w-xs">{error}</p>
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                const v = videoRef.current;
                setError(null);
                setErrorCode(0);
                if (v) { v.load(); v.play().catch(() => {}); }
              }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#00f2ff] text-black text-sm font-bold rounded-full"
            >
              Riprova
            </button>
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 text-white text-sm font-medium rounded-full border border-white/20"
            >
              <ExternalLink className="h-4 w-4" />
              Apri il file
            </a>
          </div>
        </div>
      )}

      {/* Buffering spinner */}
      {waiting && !error && (
        <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
          <Loader2 className="h-10 w-10 text-[#00f2ff] animate-spin" />
        </div>
      )}

      {/* Big play overlay before first play */}
      {!started && !error && (
        <motion.button
          onClick={togglePlay}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 z-20 flex items-center justify-center cursor-pointer bg-black/20"
          aria-label="Riproduci il video"
        >
          <motion.div
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.94 }}
            transition={MOTION.press}
            className="w-20 h-20 rounded-full bg-[#00f2ff]/90 flex items-center justify-center shadow-2xl shadow-cyan-glow-1"
          >
            <Play className="w-9 h-9 text-black ml-1 fill-current" />
          </motion.div>
          {title && (
            <p className="absolute bottom-16 left-4 right-4 text-center text-white/90 text-sm font-medium truncate">
              {title}
            </p>
          )}
        </motion.button>
      )}

      {/* Control bar */}
      <AnimatePresence>
        {(controlsVisible || !playing) && !error && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8, transition: { duration: 0.15 } }}
            transition={MOTION.enter}
            className="absolute bottom-0 left-0 right-0 z-20 px-3 pb-2.5 pt-8 bg-gradient-to-t from-black/85 via-black/40 to-transparent"
          >
            {/* Seek bar */}
            <div
              className="group/seek relative h-4 flex items-center cursor-pointer"
              onClick={(e) => seekTo(e.clientX, e.currentTarget)}
              role="slider"
              aria-label="Posizione di riproduzione"
              aria-valuemin={0}
              aria-valuemax={Math.round(duration)}
              aria-valuenow={Math.round(currentTime)}
            >
              <div className="relative w-full h-1 group-hover/seek:h-1.5 rounded-full bg-white/20 transition-all">
                <div className="absolute inset-y-0 left-0 rounded-full bg-white/25" style={{ width: `${bufferedPct}%` }} />
                <div className="absolute inset-y-0 left-0 rounded-full bg-[#00f2ff]" style={{ width: `${playedPct}%` }}>
                  <span className="absolute -right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-[#00f2ff] opacity-0 group-hover/seek:opacity-100 transition-opacity shadow" />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1.5 mt-1">
              <button onClick={togglePlay} aria-label={playing ? "Pausa" : "Riproduci"}
                className="w-9 h-9 flex items-center justify-center rounded-full text-white hover:bg-white/10 transition-colors">
                {playing ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 ml-0.5" />}
              </button>

              <button
                onClick={() => { const v = videoRef.current; if (v) v.muted = !v.muted; }}
                aria-label={muted || volume === 0 ? "Riattiva l'audio" : "Silenzia"}
                className="w-9 h-9 flex items-center justify-center rounded-full text-white hover:bg-white/10 transition-colors"
              >
                {muted || volume === 0 ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
              </button>
              <input
                type="range"
                min={0} max={1} step={0.05}
                value={muted ? 0 : volume}
                onChange={(e) => {
                  const v = videoRef.current;
                  if (!v) return;
                  v.volume = Number(e.target.value);
                  v.muted = Number(e.target.value) === 0;
                }}
                aria-label="Volume"
                className="w-20 accent-[#00f2ff] h-1 cursor-pointer"
              />

              <span className="text-[11px] text-white/80 font-mono ml-1 whitespace-nowrap">
                {fmt(currentTime)} <span className="text-white/40">/ {fmt(duration)}</span>
              </span>

              <div className="flex-1" />

              {/* Speed */}
              <div className="relative">
                <button
                  onClick={() => setRateOpen((v) => !v)}
                  aria-label="Velocità di riproduzione"
                  className="h-9 px-2.5 flex items-center gap-1 rounded-full text-white hover:bg-white/10 transition-colors text-xs font-mono"
                >
                  <Gauge className="h-4 w-4" />
                  {rate}x
                </button>
                {rateOpen && (
                  <div className="absolute bottom-11 right-0 glass-raised rounded-xl border border-white/10 py-1 min-w-[88px] z-30">
                    {RATES.map((r) => (
                      <button
                        key={r}
                        onClick={() => {
                          if (videoRef.current) videoRef.current.playbackRate = r;
                          setRateOpen(false);
                        }}
                        className={`w-full text-left px-3 py-1.5 text-xs font-mono transition-colors ${
                          r === rate ? "text-[#00f2ff] bg-[#00f2ff]/10" : "text-white/70 hover:bg-white/10"
                        }`}
                      >
                        {r}x
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Settings: quality (HLS levels / source info) + speed */}
              <div className="relative">
                <button
                  onClick={() => setSettingsOpen((v) => !v)}
                  aria-label="Impostazioni"
                  className="w-9 h-9 flex items-center justify-center rounded-full text-white hover:bg-white/10 transition-colors"
                >
                  <Settings className="h-5 w-5" />
                </button>
                {settingsOpen && (
                  <div className="absolute bottom-11 right-0 glass-raised rounded-xl border border-white/10 py-2 min-w-[180px] z-30">
                    <p className="px-3 pb-1.5 text-[10px] uppercase tracking-widest text-white/35">Qualità</p>
                    {qualityLevels.length > 0 ? (
                      <>
                        <button
                          onClick={() => selectQuality(-1)}
                          className={`w-full text-left px-3 py-1.5 text-xs transition-colors ${quality === -1 ? "text-[#00f2ff] bg-[#00f2ff]/10" : "text-white/70 hover:bg-white/10"}`}
                        >
                          Auto
                        </button>
                        {qualityLevels.map((l) => (
                          <button
                            key={l.index}
                            onClick={() => selectQuality(l.index)}
                            className={`w-full text-left px-3 py-1.5 text-xs font-mono transition-colors ${quality === l.index ? "text-[#00f2ff] bg-[#00f2ff]/10" : "text-white/70 hover:bg-white/10"}`}
                          >
                            {l.height}p
                          </button>
                        ))}
                      </>
                    ) : (
                      <p className="px-3 py-1.5 text-xs text-white/40">
                        {duration > 0 && videoRef.current?.videoHeight
                          ? `${videoRef.current.videoHeight}p (sorgente unica)`
                          : "Sorgente unica"}
                      </p>
                    )}
                    <div className="h-px bg-white/10 my-1.5" />
                    <p className="px-3 pb-1.5 text-[10px] uppercase tracking-widest text-white/35">Velocità</p>
                    <div className="px-3 pb-1 flex flex-wrap gap-1">
                      {RATES.map((r) => (
                        <button
                          key={r}
                          onClick={() => { if (videoRef.current) videoRef.current.playbackRate = r; }}
                          className={`px-2 py-1 text-[11px] font-mono rounded-full transition-colors ${
                            r === rate ? "bg-[#00f2ff]/20 text-[#00f2ff]" : "bg-white/5 text-white/60 hover:bg-white/10"
                          }`}
                        >
                          {r}x
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {isClient && document.pictureInPictureEnabled && (
                <button onClick={togglePiP} aria-label="Picture in Picture"
                  className="w-9 h-9 hidden sm:flex items-center justify-center rounded-full text-white hover:bg-white/10 transition-colors">
                  <PictureInPicture2 className="h-5 w-5" />
                </button>
              )}

              <button onClick={toggleFullscreen} aria-label={fullscreen ? "Esci da schermo intero" : "Schermo intero"}
                className="w-9 h-9 flex items-center justify-center rounded-full text-white hover:bg-white/10 transition-colors">
                {fullscreen ? <Minimize className="h-5 w-5" /> : <Maximize className="h-5 w-5" />}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
