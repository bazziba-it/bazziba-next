"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Play, Pause, Volume2, VolumeX, Settings, Maximize, Heart, Share2, Download, Flag, Copy, Check } from "lucide-react";
import { Button, Badge } from "@/components/ui";
import { formatViews, formatDate, timeAgo, cn } from "@/lib/utils";
import { getAvatarUrl } from "@/lib/server";
import type { Video } from "@/types";

interface VideoPlayerProps {
  video: Video & {
    author?: {
      id: string;
      username: string;
      name?: string;
      image?: string;
    };
  };
}

export function VideoPlayer({ video }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [quality, setQuality] = useState("hd1080");
  const [showControls, setShowControls] = useState(true);
  const controlsTimeoutRef = useRef<NodeJS.Timeout>();
  const [copied, setCopied] = useState(false);

  // Auto-hide controls during playback
  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleProgress = () => {
    if (videoRef.current) {
      const percent = (videoRef.current.currentTime / videoRef.current.duration) * 100;
      setProgress(isNaN(percent) ? 0 : percent);
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (videoRef.current) {
      const bar = e.currentTarget;
      const rect = bar.getBoundingClientRect();
      const seekPercent = (e.clientX - rect.left) / rect.width;
      videoRef.current.currentTime = seekPercent * videoRef.current.duration;
    }
  };

  const toggleFullscreen = async () => {
    if (!document.fullscreenElement && videoRef.current) {
      await videoRef.current.requestFullscreen();
      setIsFullscreen(true);
    } else if (document.fullscreenElement) {
      await document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return "0:00";
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    if (h > 0) return `${h}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // HLS.js for adaptive streaming support
  useEffect(() => {
    let hls: any;
    if (videoRef.current && typeof window !== "undefined") {
      const video = videoRef.current;
      
      if (video.canPlayType("application/vnd.apple.mpegurl")) {
        // Safari/iOS native HLS support
        video.src = video.src || "";
      } else if (Hls.isSupported()) {
        // HLS.js for Chrome/Firefox/etc
        hls = new Hls({
          autoStartLoad: true,
          startPosition: 0,
          capStructuredCopy: true,
          maxBufferLength: 10,
          maxMaxBufferLength: 30,
        });
        hls.loadSource(video.src);
        hls.attachMedia(video);
      }
    }
    
    return () => {
      if (hls) {
        hls.destroy();
      }
    };
  }, [video.videoUrl]);

  return (
    <div className="space-y-4">
      {/* Video Player */}
      <div
        className="relative aspect-video bg-black rounded-xl overflow-hidden group"
        onMouseMove={() => {
          setShowControls(true);
          if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
          controlsTimeoutRef.current = setTimeout(() => setShowControls(true), 5000);
        }}
        onMouseLeave={() => setShowControls(true)}
      >
        {video.videoUrl ? (
          <video
            ref={videoRef}
            src={video.videoUrl}
            poster={video.thumbnail || undefined}
            playsInline
            muted={isMuted}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onTimeUpdate={handleProgress}
            onSeeked={handleProgress}
            onVolumeChange={() => {
              if (videoRef.current) {
                setVolume(videoRef.current.volume);
                setIsMuted(videoRef.current.muted);
              }
            }}
            onClick={togglePlayPause}
            className="w-full h-full object-contain"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-900">
            <Play className="h-12 w-12 text-gray-600" />
          </div>
        )}

        {/* Progress Bar */}
        <div
          className="absolute bottom-14 left-0 right-0 h-1.5 bg-white/20 cursor-pointer group"
          onClick={handleSeek}
        >
          <div
            className="h-full bg-brand-yellow rounded-full transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Controls Overlay */}
        <div
          className={cn(
            "absolute inset-0 flex items-center justify-center bg-black/40 transition-opacity duration-300",
            isPlaying ? "opacity-0" : "opacity-100"
          )}
          onClick={togglePlayPause}
        >
          <Button
            size="lg"
            variant="ghost"
            className="h-16 w-16 rounded-full border-2 border-white bg-white/20 hover:bg-white/30"
          >
            <Play className="h-8 w-8 text-white fill-white" />
          </Button>
        </div>

        {/* Bottom Controls */}
        <div
          className={cn(
            "absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent px-4 py-3 transition-all duration-300",
            showControls ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"
          )}
        >
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={togglePlayPause}
              className="text-white hover:text-white hover:bg-white/20"
            >
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </Button>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleMute}
                className="text-white hover:text-white hover:bg-white/20"
              >
                {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
              </Button>
              <input
                type="range"
                min={0}
                max={1}
                step={0.1}
                value={volume}
                onChange={(e) => {
                  setVolume(parseFloat(e.target.value));
                  if (videoRef.current) {
                    videoRef.current.volume = parseFloat(e.target.value);
                    videoRef.current.muted = false;
                    setIsMuted(false);
                  }
                }}
                className="w-20 h-1 bg-white/30 rounded-full accent-white"
              />
            </div>

            <div className="flex items-center gap-2 text-xs text-white/70">
              <span>{formatTime(videoRef.current?.currentTime || 0)}</span>
              <span>/</span>
              <span>{formatTime(videoRef.current?.duration || 0)}</span>
            </div>

            <div className="ml-auto flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:text-white hover:bg-white/20"
              >
                <Settings className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleFullscreen}
                className="text-white hover:text-white hover:bg-white/20"
              >
                <Maximize className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Video Info */}
      <div className="space-y-3">
        <h1 className="text-xl font-bold md:text-2xl">{video.title}</h1>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={getAvatarUrl(video.author?.image, video.author?.username)}
              alt={video.author?.username || "Author"}
              className="h-10 w-10 rounded-full object-cover"
            />
            <div>
              <p className="font-medium">{video.author?.name || video.author?.username}</p>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>{formatViews(video.viewCount)} views</span>
                <span>•</span>
                <span>Published {timeAgo(video.publishedAt || video.createdAt)}</span>
              </div>
            </div>
            <Button variant="outline" size="sm">
              Subscribe
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm">
              <Heart className="h-4 w-4 mr-1" />
              {formatViews(video.likeCount)}
            </Button>
            <Button variant="ghost" size="sm" onClick={copyToClipboard}>
              {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
              Share
            </Button>
            <Button variant="ghost" size="sm">
              <Download className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Flag className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// HLS.js import (loaded conditionally in the browser)
let Hls: any;
if (typeof window !== "undefined") {
  // @ts-expect-error - hls.js types
  import("hls.js").then((mod) => {
    Hls = mod.default;
  });
}
