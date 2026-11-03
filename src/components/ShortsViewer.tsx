import React, { useState, useRef, useEffect } from 'react';
import { VideoItem } from '../types/tubefree';
import {
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  Share2,
  Volume2,
  VolumeX,
  Play,
  Pause,
  ArrowUp,
  ArrowDown,
  CheckCircle2,
  Radio,
  Flame,
} from 'lucide-react';
import { storageService } from '../services/storageService';

interface ShortsViewerProps {
  shorts: VideoItem[];
  onOpenP2PShare: (v: VideoItem) => void;
}

export const ShortsViewer: React.FC<ShortsViewerProps> = ({
  shorts,
  onOpenP2PShare,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [likesMap, setLikesMap] = useState<Record<string, boolean>>({});
  const videoRef = useRef<HTMLVideoElement>(null);

  const currentShort = shorts[currentIndex] || shorts[0];

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
  }, [currentIndex]);

  const handleNext = () => {
    if (currentIndex < shorts.length - 1) {
      setCurrentIndex(i => i + 1);
    } else {
      setCurrentIndex(0); // loop
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(i => i - 1);
    }
  };

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleToggleLike = (id: string) => {
    const next = storageService.toggleLike(id);
    setLikesMap(prev => ({ ...prev, [id]: next }));
  };

  if (!currentShort) return null;

  const isLiked = !!likesMap[currentShort.id];

  return (
    <div className="flex-1 w-full h-[calc(100vh-110px)] md:h-[calc(100vh-64px)] flex items-center justify-center bg-black select-none overflow-hidden relative">
      {/* Phone Screen Aspect Box */}
      <div className="relative w-full max-w-[420px] h-full max-h-[820px] rounded-3xl overflow-hidden bg-slate-900 shadow-2xl flex flex-col justify-between">
        {/* HTML5 Video */}
        <video
          ref={videoRef}
          src={currentShort.videoUrl}
          autoPlay
          loop
          playsInline
          muted={isMuted}
          onClick={togglePlay}
          className="absolute inset-0 w-full h-full object-cover cursor-pointer"
        />

        {/* Top Floating Controls */}
        <div className="relative z-20 p-4 flex items-center justify-between bg-gradient-to-b from-black/60 to-transparent">
          <div className="flex items-center gap-1.5 bg-red-600/90 text-white text-xs font-black px-2.5 py-1 rounded-full backdrop-blur-md">
            <Flame className="w-3.5 h-3.5 fill-current" />
            <span>Shorts Offline</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="p-2 bg-black/50 hover:bg-black/70 text-white rounded-full backdrop-blur-md transition-colors"
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Center Pause/Play Indicator */}
        {!isPlaying && (
          <div
            onClick={togglePlay}
            className="absolute inset-0 z-10 flex items-center justify-center cursor-pointer bg-black/20"
          >
            <div className="w-16 h-16 rounded-full bg-black/60 text-white flex items-center justify-center backdrop-blur-md">
              <Play className="w-8 h-8 fill-current ml-1" />
            </div>
          </div>
        )}

        {/* Bottom Metadata & Floating Right Actions Bar */}
        <div className="relative z-20 p-4 pb-6 flex items-end justify-between bg-gradient-to-t from-black/90 via-black/40 to-transparent">
          {/* Bottom Left: Channel & Title */}
          <div className="flex flex-col gap-2 max-w-[75%] text-left">
            <div className="flex items-center gap-2">
              <img
                src={currentShort.channelAvatar}
                alt={currentShort.channelName}
                className="w-9 h-9 rounded-full object-cover border border-white/50"
              />
              <span className="font-bold text-xs text-white truncate drop-shadow">
                {currentShort.channelName}
              </span>
              <button className="bg-red-600 hover:bg-red-500 text-white font-bold text-[10px] px-2.5 py-1 rounded-full shadow-md">
                Subscribe
              </button>
            </div>

            <p className="text-xs font-semibold text-white drop-shadow line-clamp-2 leading-snug">
              {currentShort.title}
            </p>

            {currentShort.urduTitle && (
              <div className="text-xs font-bold text-amber-300 font-['Noto_Nastaliq_Urdu'] line-clamp-1 drop-shadow">
                {currentShort.urduTitle}
              </div>
            )}
          </div>

          {/* Bottom Right Floating Action Column */}
          <div className="flex flex-col items-center gap-4 text-white">
            {/* Like */}
            <button
              onClick={() => handleToggleLike(currentShort.id)}
              className="flex flex-col items-center gap-1 group active:scale-90 transition-transform"
            >
              <div
                className={`w-11 h-11 rounded-full flex items-center justify-center backdrop-blur-md transition-colors ${
                  isLiked ? 'bg-red-600 text-white' : 'bg-black/50 text-white'
                }`}
              >
                <ThumbsUp className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
              </div>
              <span className="text-[11px] font-bold font-mono">
                {(currentShort.likes + (isLiked ? 1 : 0)).toLocaleString()}
              </span>
            </button>

            {/* Dislike */}
            <button className="flex flex-col items-center gap-1 group active:scale-90 transition-transform">
              <div className="w-11 h-11 rounded-full bg-black/50 flex items-center justify-center backdrop-blur-md">
                <ThumbsDown className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-bold">Dislike</span>
            </button>

            {/* Comments */}
            <button className="flex flex-col items-center gap-1 group active:scale-90 transition-transform">
              <div className="w-11 h-11 rounded-full bg-black/50 flex items-center justify-center backdrop-blur-md">
                <MessageSquare className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-bold font-mono">
                {currentShort.commentsCount}
              </span>
            </button>

            {/* P2P Share */}
            <button
              onClick={() => onOpenP2PShare(currentShort)}
              className="flex flex-col items-center gap-1 group active:scale-90 transition-transform"
            >
              <div className="w-11 h-11 rounded-full bg-red-600 flex items-center justify-center backdrop-blur-md shadow-lg shadow-red-600/40">
                <Radio className="w-5 h-5 animate-pulse" />
              </div>
              <span className="text-[10px] font-bold">P2P</span>
            </button>
          </div>
        </div>
      </div>

      {/* Up/Down Scroll Navigation Pill Buttons */}
      <div className="hidden lg:flex flex-col gap-3 absolute right-12 z-30">
        <button
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className="p-3 bg-white/10 hover:bg-white/20 disabled:opacity-30 text-white rounded-full backdrop-blur-md transition-all active:scale-95"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
        <button
          onClick={handleNext}
          className="p-3 bg-white/10 hover:bg-white/20 text-white rounded-full backdrop-blur-md transition-all active:scale-95"
        >
          <ArrowDown className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
