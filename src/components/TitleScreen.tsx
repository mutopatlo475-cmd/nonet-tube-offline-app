import React, { useState } from 'react';
import { RouteInfo } from '../types/game';
import { PUNJAB_ROUTES } from '../data/routes';
import { Play, Volume2, VolumeX, Sparkles, Navigation } from 'lucide-react';

interface TitleScreenProps {
  onStartRoute: (route: RouteInfo) => void;
  isMuted: boolean;
  onToggleMute: () => void;
}

export const TitleScreen: React.FC<TitleScreenProps> = ({
  onStartRoute,
  isMuted,
  onToggleMute,
}) => {
  const [selectedRoute, setSelectedRoute] = useState<RouteInfo>(PUNJAB_ROUTES[0]);

  return (
    <div className="absolute inset-0 z-20 pointer-events-none flex flex-col justify-between p-6 md:p-10 select-none overflow-hidden">
      {/* Top Bar */}
      <div className="flex items-center justify-between w-full pointer-events-auto">
        {/* Pakistani Flag Emblem & Badge */}
        <div className="flex items-center gap-3 bg-emerald-950/85 border border-emerald-600/60 px-4 py-2 rounded-xl shadow-lg">
          <div className="w-8 h-8 rounded-full bg-emerald-700 flex items-center justify-center font-bold text-amber-300 text-lg shadow-inner">
            ★
          </div>
          <div>
            <div className="text-emerald-400 font-mono text-xs uppercase tracking-widest font-semibold">
              Pakistan Commercial Heavy Fleet
            </div>
            <div className="text-white text-sm font-bold tracking-wide">
              پنجاب ایکسپریس • سڑک کا سلطان
            </div>
          </div>
        </div>

        {/* Audio Mute & Info */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleMute}
            aria-label={isMuted ? 'Unmute game audio' : 'Mute game audio'}
            className="flex items-center gap-2 bg-slate-900/80 hover:bg-slate-800 text-amber-300 border border-amber-500/40 px-3.5 py-2 rounded-xl transition-all shadow-md active:scale-95"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
            <span className="text-xs font-semibold">{isMuted ? 'Unmute' : 'Audio On'}</span>
          </button>
        </div>
      </div>

      {/* Center Left: Bespoke SVG Title Lockup with Negative Space */}
      <div className="max-w-xl pointer-events-auto my-auto pt-6">
        {/* Ornate Truck Art Header Banner */}
        <div className="inline-flex items-center gap-2 bg-amber-500 text-slate-950 px-3.5 py-1 rounded-md text-xs font-extrabold uppercase tracking-wider mb-3 shadow-md">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Bedford Rocket & Hino Coach Simulator</span>
        </div>

        {/* Primary Title Lockup */}
        <div className="relative">
          <h1 className="text-5xl md:text-7xl font-black text-white tracking-tight drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)] font-['Chakra_Petch'] leading-none">
            PUNJAB <span className="text-amber-400">EXPRESS</span>
          </h1>
          <div className="text-2xl md:text-3xl font-extrabold text-emerald-300 tracking-wider font-['Noto_Nastaliq_Urdu'] mt-1 drop-shadow-md">
            شاہین کوچ • ایکسٹریم روڈز تھری ڈی
          </div>
        </div>

        <p className="mt-3 text-sm md:text-base text-slate-200/90 leading-relaxed max-w-lg drop-shadow">
          Inspired by <span className="text-amber-300 font-semibold">BUSSID</span> & <span className="text-amber-300 font-semibold">IDBS Extreme Road</span>.
          Drive Pakistan’s legendary truck-art rocket coach across the GT Road, treacherous canal banks, single-lane brick bridges, and vibrant mustard fields.
        </p>

        {/* Route Selector Selector Cards */}
        <div className="mt-5 space-y-2">
          <div className="text-xs uppercase tracking-wider font-bold text-amber-300/90">
            Select Commercial Route:
          </div>
          <div className="grid grid-cols-1 gap-2">
            {PUNJAB_ROUTES.map(route => {
              const isSelected = selectedRoute.id === route.id;
              return (
                <button
                  key={route.id}
                  onClick={() => setSelectedRoute(route)}
                  className={`text-left p-3 rounded-xl border transition-all ${
                    isSelected
                      ? 'bg-slate-900/90 border-amber-400 ring-2 ring-amber-400/30'
                      : 'bg-slate-950/70 border-slate-700/60 hover:bg-slate-900/70'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-white">{route.name}</span>
                    <span
                      className={`text-[10px] uppercase font-extrabold px-2 py-0.5 rounded ${
                        route.difficulty === 'Brutal'
                          ? 'bg-rose-950 text-rose-300 border border-rose-600/50'
                          : route.difficulty === 'Extreme'
                          ? 'bg-amber-950 text-amber-300 border border-amber-600/50'
                          : 'bg-emerald-950 text-emerald-300 border border-emerald-600/50'
                      }`}
                    >
                      {route.difficulty}
                    </span>
                  </div>
                  <div className="text-xs text-amber-200/80 font-['Noto_Nastaliq_Urdu'] mt-0.5">
                    {route.urduName}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1 line-clamp-1">
                    {route.description}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Start Game CTA */}
        <div className="mt-6 flex flex-wrap items-center gap-4">
          <button
            onClick={() => onStartRoute(selectedRoute)}
            className="group flex items-center gap-3 bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black text-base px-8 py-3.5 rounded-xl shadow-xl transition-all hover:scale-105 active:scale-95"
          >
            <Play className="w-5 h-5 fill-slate-950" />
            <span>START ENGINES • چلو استاد</span>
          </button>

          <div className="text-xs text-slate-300 flex items-center gap-1.5 bg-black/50 px-3 py-2 rounded-lg border border-white/10">
            <Navigation className="w-3.5 h-3.5 text-amber-400" />
            <span>Press <kbd className="bg-slate-800 px-1.5 py-0.5 rounded text-amber-300 font-mono">ENTER</kbd> or <kbd className="bg-slate-800 px-1.5 py-0.5 rounded text-amber-300 font-mono">SPACE</kbd></span>
          </div>
        </div>
      </div>

      {/* Flat Control Hints Bar at Bottom */}
      <div className="pointer-events-auto flex items-center justify-between text-xs text-slate-300 bg-slate-950/80 border border-slate-700/50 px-4 py-2.5 rounded-xl shadow-md">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-[11px]">
          <span><b className="text-amber-400">WASD / Arrows:</b> Steer & Throttle</span>
          <span><b className="text-amber-400">SPACE:</b> Pneumatic Air Brake</span>
          <span><b className="text-amber-400">1-5:</b> WAPDA & Musical Horns</span>
          <span><b className="text-amber-400">C:</b> Camera (Cockpit / Chase / Bumper)</span>
          <span><b className="text-amber-400">O:</b> Passenger Door</span>
          <span><b className="text-amber-400">L:</b> Lights</span>
          <span><b className="text-amber-400">R:</b> Punjabi Cassette Radio</span>
        </div>
        <div className="hidden md:block font-bold text-amber-400">
          60 FPS ULTRA • REALISTIC LEAF-SPRING PHYSICS
        </div>
      </div>
    </div>
  );
};
