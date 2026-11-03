import React from 'react';
import {
  Search,
  Mic,
  WifiOff,
  Radio,
  HardDrive,
  Baby,
  Moon,
  Sun,
  Crown,
} from 'lucide-react';
import { PWAInstallButton } from './PWAInstallButton';

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onOpenVoiceSearch: () => void;
  onOpenP2PRadar: () => void;
  onOpenStorage: () => void;
  onToggleKidsMode: () => void;
  isKidsMode: boolean;
  isDarkMode: boolean;
  onToggleTheme: () => void;
  onOpenChannel: () => void;
  isPremium: boolean;
  onTogglePremium: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  searchQuery,
  onSearchChange,
  onOpenVoiceSearch,
  onOpenP2PRadar,
  onOpenStorage,
  onToggleKidsMode,
  isKidsMode,
  isDarkMode,
  onToggleTheme,
  onOpenChannel,
  isPremium,
  onTogglePremium,
}) => {
  return (
    <header className="sticky top-0 z-30 w-full bg-white/95 dark:bg-[#0f0f0f]/95 border-b border-gray-200 dark:border-gray-800 backdrop-blur-sm px-3 md:px-6 py-2.5 flex items-center justify-between gap-2 md:gap-4 select-none transition-colors">
      {/* Brand Logo & Offline Badge */}
      <div className="flex items-center gap-2 md:gap-3 flex-shrink-0">
        <div className="flex items-center gap-1.5 cursor-pointer" onClick={() => onSearchChange('')}>
          {/* Custom Modern TubeFree Play Logo */}
          <div className="w-8 h-8 md:w-9 md:h-9 rounded-xl bg-gradient-to-tr from-rose-600 via-red-600 to-amber-500 flex items-center justify-center shadow-md shadow-red-600/20">
            <svg
              className="w-4 h-4 md:w-5 md:h-5 text-white fill-current ml-0.5"
              viewBox="0 0 24 24"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1">
              <span className="font-black text-lg md:text-xl tracking-tight text-gray-900 dark:text-white font-['Chakra_Petch'] leading-none">
                Tube<span className="text-red-600">Free</span>
              </span>
              {isPremium && (
                <span className="bg-amber-500 text-slate-950 text-[9px] font-black px-1.5 py-0.2 rounded-full uppercase tracking-wider flex items-center gap-0.5">
                  <Crown className="w-2.5 h-2.5 fill-slate-950" /> PRO
                </span>
              )}
            </div>
            <div className="flex items-center gap-1 text-[9px] text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider">
              <WifiOff className="w-2.5 h-2.5 stroke-[3]" />
              <span>100% Offline Super-App</span>
            </div>
          </div>
        </div>

        {/* Kids Mode Badge */}
        {isKidsMode && (
          <span className="bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-700/60 px-2 py-0.5 rounded-full text-[10px] font-extrabold flex items-center gap-1">
            <Baby className="w-3 h-3" /> KIDS MODE ACTIVE
          </span>
        )}
      </div>

      {/* Center: Search Bar with Voice Search */}
      <div className="flex-1 max-w-xl mx-2 flex items-center">
        <div className="relative w-full flex items-center">
          <div className="absolute left-3 text-gray-400 pointer-events-none">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            placeholder={isKidsMode ? "Search safe kids cartoons & tilawat..." : "Search 10,000+ hrs offline movies, dramas, islamic..."}
            value={searchQuery}
            onChange={e => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-10 py-1.5 md:py-2 text-xs md:text-sm bg-gray-100 dark:bg-[#222222] text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-700 rounded-full focus:outline-none focus:border-red-500 dark:focus:border-red-500 transition-all placeholder:text-gray-400 dark:placeholder:text-gray-500"
          />
          <button
            onClick={onOpenVoiceSearch}
            title="Voice Search"
            className="absolute right-2 p-1.5 text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors"
          >
            <Mic className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Right Action Icons: P2P Radar, Storage, Theme, Channel */}
      <div className="flex items-center gap-1.5 md:gap-2 flex-shrink-0">
        {/* P2P Sync Radar Button with Pulsing Signal */}
        <button
          onClick={onOpenP2PRadar}
          title="P2P Mesh Sync (Wi-Fi Direct / Local Hotspot)"
          className="relative flex items-center gap-1.5 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white px-2.5 md:px-3 py-1.5 rounded-full text-xs font-bold shadow-sm shadow-red-500/20 active:scale-95 transition-all"
        >
          <Radio className="w-3.5 h-3.5 animate-pulse" />
          <span className="hidden sm:inline">P2P Sync</span>
        </button>

        {/* AI Storage Manager */}
        <button
          onClick={onOpenStorage}
          title="AI Smart Storage & Compression"
          className="p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
        >
          <HardDrive className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
        </button>

        {/* Kids Mode Toggle */}
        <button
          onClick={onToggleKidsMode}
          title={isKidsMode ? "Exit Kids Mode" : "Turn on Kids Mode (Parental Lock)"}
          className={`p-2 rounded-full transition-colors ${
            isKidsMode
              ? 'bg-amber-500 text-white'
              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
          }`}
        >
          <Baby className="w-4 h-4" />
        </button>

        {/* Premium Toggle */}
        <button
          onClick={onTogglePremium}
          title={isPremium ? "Premium Active" : "Get TubeFree Premium (Ad-Free)"}
          className={`p-2 rounded-full transition-colors hidden sm:block ${
            isPremium
              ? 'text-amber-500'
              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
          }`}
        >
          <Crown className="w-4 h-4" />
        </button>

        {/* Theme Toggle */}
        <button
          onClick={onToggleTheme}
          title="Toggle Light/Dark Theme"
          className="p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
        >
          {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
        </button>

        {/* PWA In-App Install Button */}
        <PWAInstallButton />

        {/* User Channel Profile Avatar */}
        <button
          onClick={onOpenChannel}
          title="My Channel Studio"
          className="w-8 h-8 rounded-full overflow-hidden border-2 border-red-500/80 active:scale-95 transition-transform ml-1"
        >
          <img
            src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80"
            alt="Channel Profile"
            className="w-full h-full object-cover"
          />
        </button>
      </div>
    </header>
  );
};
