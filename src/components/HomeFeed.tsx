import React from 'react';
import { VideoItem, ContentCategory } from '../types/tubefree';
import { CategoryChips } from './CategoryChips';
import { VideoCard } from './VideoCard';
import { OfflineAdBanner } from './OfflineAdBanner';
import { Flame, Compass } from 'lucide-react';

interface HomeFeedProps {
  videos: VideoItem[];
  shorts: VideoItem[];
  selectedCategory: ContentCategory;
  onSelectCategory: (cat: ContentCategory) => void;
  onSelectVideo: (video: VideoItem) => void;
  onSelectShorts: () => void;
  isKidsMode: boolean;
  isPremium: boolean;
  onUpgradePremium: () => void;
  onToggleWatchLater: (id: string) => void;
  watchLaterIds: string[];
}

export const HomeFeed: React.FC<HomeFeedProps> = ({
  videos,
  shorts,
  selectedCategory,
  onSelectCategory,
  onSelectVideo,
  onSelectShorts,
  isKidsMode,
  isPremium,
  onUpgradePremium,
  onToggleWatchLater,
  watchLaterIds,
}) => {
  return (
    <div className="flex-1 w-full overflow-y-auto pb-24 bg-gray-50 dark:bg-[#0f0f0f] select-none transition-colors">
      {/* Category Pills Bar */}
      <CategoryChips
        selectedCategory={selectedCategory}
        onSelectCategory={onSelectCategory}
        isKidsMode={isKidsMode}
      />

      {/* Pre-loaded Offline AdMob Banner / Pro Pass */}
      <OfflineAdBanner
        isPremium={isPremium}
        onUpgradePremium={onUpgradePremium}
      />

      {/* Main Video Feed Container */}
      <div className="p-3 md:p-6 flex flex-col gap-6">
        {/* First Half of Main Videos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {videos.slice(0, 4).map(video => (
            <VideoCard
              key={video.id}
              video={video}
              onSelect={onSelectVideo}
              onToggleWatchLater={onToggleWatchLater}
              isSavedWatchLater={watchLaterIds.includes(video.id)}
            />
          ))}
        </div>

        {/* Embedded Shorts Shelf (Classic YouTube 2026 Home Feed element) */}
        {!isKidsMode && shorts.length > 0 && selectedCategory === 'all' && (
          <div className="my-2 p-4 bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 rounded-3xl shadow-sm flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Flame className="w-5 h-5 text-red-600 fill-current" />
                <h3 className="text-base font-black text-gray-900 dark:text-white">
                  Trending Offline Shorts
                </h3>
              </div>
              <button
                onClick={onSelectShorts}
                className="text-xs font-bold text-red-600 dark:text-red-400 hover:underline flex items-center gap-1"
              >
                <span>View All</span>
                <Compass className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Horizontal Scrollable Shorts Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 overflow-x-auto no-scrollbar">
              {shorts.slice(0, 5).map(short => (
                <div
                  key={short.id}
                  onClick={() => onSelectVideo(short)}
                  className="group relative aspect-[9/16] rounded-2xl overflow-hidden cursor-pointer shadow-md flex-shrink-0 bg-slate-900"
                >
                  <img
                    src={short.thumbnail}
                    alt={short.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent flex flex-col justify-end p-2.5">
                    <p className="text-xs font-bold text-white line-clamp-2 leading-snug drop-shadow">
                      {short.title}
                    </p>
                    <span className="text-[10px] text-gray-300 font-mono mt-1">
                      {short.views} views
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Second Half of Main Videos */}
        {videos.length > 4 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {videos.slice(4).map(video => (
              <VideoCard
                key={video.id}
                video={video}
                onSelect={onSelectVideo}
                onToggleWatchLater={onToggleWatchLater}
                isSavedWatchLater={watchLaterIds.includes(video.id)}
              />
            ))}
          </div>
        )}

        {/* Empty Search Results */}
        {videos.length === 0 && (
          <div className="text-center py-20 flex flex-col items-center gap-2">
            <span className="text-4xl">🔍</span>
            <h3 className="text-base font-bold text-gray-900 dark:text-white">
              No matching offline videos found
            </h3>
            <p className="text-xs text-gray-500 max-w-sm">
              Try searching for "Maula Jatt", "Tilawat", "Kabhi Main Kabhi Tum", "Python", or open P2P Mesh Sync to get new releases!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
