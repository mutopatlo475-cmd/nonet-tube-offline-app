import React from 'react';
import {
  Home,
  Compass,
  PlaySquare,
  PlusCircle,
  FolderHeart,
  Radio,
  Flame,
} from 'lucide-react';

export type NavTab = 'home' | 'shorts' | 'upload' | 'subscriptions' | 'library' | 'p2p';

interface NavigationProps {
  currentTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  isKidsMode?: boolean;
}

export const Navigation: React.FC<NavigationProps> = ({
  currentTab,
  onTabChange,
  isKidsMode,
}) => {
  return (
    <>
      {/* 1. Mobile Bottom Navigation Bar (Sticky bottom) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-white/95 dark:bg-[#0f0f0f]/95 border-t border-gray-200 dark:border-gray-800 backdrop-blur-md px-2 py-1.5 flex items-center justify-around select-none transition-colors">
        <button
          onClick={() => onTabChange('home')}
          className={`flex flex-col items-center py-1 px-2 rounded-xl transition-all ${
            currentTab === 'home'
              ? 'text-red-600 dark:text-red-500 font-extrabold'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          <Home className="w-5 h-5 mb-0.5" />
          <span className="text-[10px]">Home</span>
        </button>

        {!isKidsMode && (
          <button
            onClick={() => onTabChange('shorts')}
            className={`flex flex-col items-center py-1 px-2 rounded-xl transition-all ${
              currentTab === 'shorts'
                ? 'text-red-600 dark:text-red-500 font-extrabold'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <Compass className="w-5 h-5 mb-0.5" />
            <span className="text-[10px]">Shorts</span>
          </button>
        )}

        {/* Center Quick Upload / Create Button */}
        <button
          onClick={() => onTabChange('upload')}
          title="Create / Upload Offline Video"
          className="flex flex-col items-center py-0.5 px-2 active:scale-90 transition-transform"
        >
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-red-600 to-amber-500 flex items-center justify-center text-white shadow-md shadow-red-600/30">
            <PlusCircle className="w-6 h-6 stroke-[2.2]" />
          </div>
          <span className="text-[9px] font-bold text-gray-700 dark:text-gray-300 mt-0.5">Upload</span>
        </button>

        <button
          onClick={() => onTabChange('subscriptions')}
          className={`flex flex-col items-center py-1 px-2 rounded-xl transition-all ${
            currentTab === 'subscriptions'
              ? 'text-red-600 dark:text-red-500 font-extrabold'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          <PlaySquare className="w-5 h-5 mb-0.5" />
          <span className="text-[10px]">Subscriptions</span>
        </button>

        <button
          onClick={() => onTabChange('library')}
          className={`flex flex-col items-center py-1 px-2 rounded-xl transition-all ${
            currentTab === 'library'
              ? 'text-red-600 dark:text-red-500 font-extrabold'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          <FolderHeart className="w-5 h-5 mb-0.5" />
          <span className="text-[10px]">Library</span>
        </button>
      </nav>

      {/* 2. Desktop Sidebar (Sticky left) */}
      <aside className="hidden md:flex flex-col w-56 flex-shrink-0 bg-white dark:bg-[#0f0f0f] border-r border-gray-200 dark:border-gray-800 p-3 gap-1 select-none transition-colors">
        <button
          onClick={() => onTabChange('home')}
          className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
            currentTab === 'home'
              ? 'bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 font-bold'
              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800/80'
          }`}
        >
          <Home className="w-5 h-5" />
          <span>Home Feed</span>
        </button>

        {!isKidsMode && (
          <button
            onClick={() => onTabChange('shorts')}
            className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              currentTab === 'shorts'
                ? 'bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 font-bold'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800/80'
            }`}
          >
            <Flame className="w-5 h-5 text-amber-500" />
            <span>Shorts & Reels</span>
          </button>
        )}

        <button
          onClick={() => onTabChange('subscriptions')}
          className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
            currentTab === 'subscriptions'
              ? 'bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 font-bold'
              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800/80'
          }`}
        >
          <PlaySquare className="w-5 h-5" />
          <span>Subscriptions</span>
        </button>

        <button
          onClick={() => onTabChange('upload')}
          className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
            currentTab === 'upload'
              ? 'bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 font-bold'
              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800/80'
          }`}
        >
          <PlusCircle className="w-5 h-5 text-emerald-500" />
          <span>Channel Studio</span>
        </button>

        <button
          onClick={() => onTabChange('library')}
          className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
            currentTab === 'library'
              ? 'bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 font-bold'
              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800/80'
          }`}
        >
          <FolderHeart className="w-5 h-5" />
          <span>My Offline Library</span>
        </button>

        <div className="my-2 border-t border-gray-200 dark:border-gray-800" />

        {/* P2P Quick Trigger */}
        <button
          onClick={() => onTabChange('p2p')}
          className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
            currentTab === 'p2p'
              ? 'bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 font-bold'
              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800/80'
          }`}
        >
          <Radio className="w-5 h-5 text-rose-500 animate-pulse" />
          <span>P2P Hotspot Radar</span>
        </button>
      </aside>
    </>
  );
};
