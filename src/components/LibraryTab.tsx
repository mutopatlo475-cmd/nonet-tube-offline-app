import React, { useState } from 'react';
import { VideoItem } from '../types/tubefree';
import { storageService } from '../services/storageService';
import { VideoCard } from './VideoCard';
import {
  History,
  ThumbsUp,
  Bookmark,
  HardDrive,
  Trash2,
  Video,
  Radio,
  PlusCircle,
  User,
} from 'lucide-react';

interface LibraryTabProps {
  allVideos: VideoItem[];
  onSelectVideo: (v: VideoItem) => void;
  onOpenStorage: () => void;
  onOpenUpload: () => void;
  onOpenP2PRadar: () => void;
}

export const LibraryTab: React.FC<LibraryTabProps> = ({
  allVideos,
  onSelectVideo,
  onOpenStorage,
  onOpenUpload,
  onOpenP2PRadar,
}) => {
  const [historyIds, setHistoryIds] = useState(storageService.getHistory());
  const [activeSubTab, setActiveSubTab] = useState<'history' | 'liked' | 'watchlater' | 'myvideos'>('history');

  const historyVideos = historyIds
    .map(id => allVideos.find(v => v.id === id))
    .filter(Boolean) as VideoItem[];

  const likedIds = storageService.getLikedVideos();
  const likedVideos = likedIds
    .map(id => allVideos.find(v => v.id === id))
    .filter(Boolean) as VideoItem[];

  const watchLaterIds = storageService.getWatchLater();
  const watchLaterVideos = watchLaterIds
    .map(id => allVideos.find(v => v.id === id))
    .filter(Boolean) as VideoItem[];

  const customVideos = storageService.getCustomVideos();
  const userChannel = storageService.getUserChannel();
  const storageStats = storageService.getStorageBreakdown();

  const handleClearHistory = () => {
    storageService.clearHistory();
    setHistoryIds([]);
  };

  return (
    <div className="flex-1 w-full overflow-y-auto p-3 md:p-6 pb-24 flex flex-col gap-6 select-none bg-gray-50 dark:bg-[#0f0f0f] transition-colors">
      {/* User Channel Profile Header Banner */}
      <div className="bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 rounded-3xl p-5 md:p-6 text-white flex flex-wrap items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-4">
          <img
            src={userChannel.avatar}
            alt={userChannel.name}
            className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-md"
          />
          <div>
            <div className="text-xl font-black">{userChannel.name}</div>
            <div className="text-xs text-red-100 font-mono mt-0.5">
              {userChannel.handle} • {userChannel.subscribersCount} Offline Subscribers
            </div>
            <div className="text-xs text-white/90 mt-1">
              {customVideos.length} Uploaded Videos • Joined {userChannel.joinedDate}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenUpload}
            className="flex items-center gap-2 bg-white text-gray-900 font-black text-xs px-4 py-2.5 rounded-2xl shadow-md hover:bg-gray-100 transition-all active:scale-95"
          >
            <PlusCircle className="w-4 h-4 text-red-600" />
            <span>Upload New Video</span>
          </button>
        </div>
      </div>

      {/* Offline Storage Status Card */}
      <div className="bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 rounded-3xl p-4 md:p-5 flex flex-wrap items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-600 dark:text-cyan-400">
            <HardDrive className="w-6 h-6" />
          </div>
          <div>
            <div className="text-sm font-black text-gray-900 dark:text-white flex items-center gap-2">
              <span>On-Device Storage: {storageStats.tubeFreeUsedGB} GB Used</span>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 px-2 py-0.2 rounded-full font-mono font-bold">
                {storageStats.compressionSavedGB} GB Saved via H.265
              </span>
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              10,000+ hours compressed library safely stored on your phone.
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenStorage}
            className="text-xs font-bold bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 px-4 py-2 rounded-xl transition-colors"
          >
            Storage Breakdown
          </button>
          <button
            onClick={onOpenP2PRadar}
            className="text-xs font-bold bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-xl transition-colors flex items-center gap-1.5"
          >
            <Radio className="w-3.5 h-3.5" />
            <span>P2P Hotspots</span>
          </button>
        </div>
      </div>

      {/* Library Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-gray-200 dark:border-gray-800 pb-2 overflow-x-auto no-scrollbar">
        {[
          { id: 'history', label: 'Watch History', icon: History, count: historyVideos.length },
          { id: 'liked', label: 'Liked Videos', icon: ThumbsUp, count: likedVideos.length },
          { id: 'watchlater', label: 'Watch Later', icon: Bookmark, count: watchLaterVideos.length },
          { id: 'myvideos', label: 'My Channel Uploads', icon: Video, count: customVideos.length },
        ].map(tab => {
          const Icon = tab.icon;
          const isSelected = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                isSelected
                  ? 'bg-red-600 text-white shadow-md'
                  : 'bg-white dark:bg-[#1a1a1a] text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              <span className="bg-black/20 dark:bg-white/20 text-[10px] px-1.5 py-0.2 rounded-full font-mono">
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Active Tab Content Grid */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-black text-gray-900 dark:text-white capitalize">
            {activeSubTab === 'history' && 'Recently Watched Offline'}
            {activeSubTab === 'liked' && 'Liked Offline Videos'}
            {activeSubTab === 'watchlater' && 'Saved to Watch Later'}
            {activeSubTab === 'myvideos' && 'My Offline Channel Uploads'}
          </h2>

          {activeSubTab === 'history' && historyVideos.length > 0 && (
            <button
              onClick={handleClearHistory}
              className="text-xs text-rose-500 hover:text-rose-600 font-bold flex items-center gap-1"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear History</span>
            </button>
          )}
        </div>

        {/* Video Grid */}
        {activeSubTab === 'history' && (
          historyVideos.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {historyVideos.map(v => (
                <VideoCard key={v.id} video={v} onSelect={onSelectVideo} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500 text-xs">
              No watch history yet. Start watching offline movies or dramas!
            </div>
          )
        )}

        {activeSubTab === 'liked' && (
          likedVideos.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {likedVideos.map(v => (
                <VideoCard key={v.id} video={v} onSelect={onSelectVideo} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500 text-xs">
              No liked videos yet. Tap the like button on any video to bookmark it here!
            </div>
          )
        )}

        {activeSubTab === 'watchlater' && (
          watchLaterVideos.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {watchLaterVideos.map(v => (
                <VideoCard key={v.id} video={v} onSelect={onSelectVideo} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500 text-xs">
              Your Watch Later queue is empty.
            </div>
          )
        )}

        {activeSubTab === 'myvideos' && (
          customVideos.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {customVideos.map(v => (
                <VideoCard key={v.id} video={v} onSelect={onSelectVideo} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500 text-xs flex flex-col items-center gap-3">
              <span>You haven't uploaded any videos to your offline channel yet.</span>
              <button
                onClick={onOpenUpload}
                className="px-4 py-2 bg-red-600 text-white font-bold rounded-xl text-xs flex items-center gap-1.5"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Upload First Video</span>
              </button>
            </div>
          )
        )}
      </div>
    </div>
  );
};
