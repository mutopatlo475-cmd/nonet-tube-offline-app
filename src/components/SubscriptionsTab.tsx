import React, { useState } from 'react';
import { VideoItem } from '../types/tubefree';
import { storageService } from '../services/storageService';
import { VideoCard } from './VideoCard';
import { PlaySquare, CheckCircle2, Bell } from 'lucide-react';

interface SubscriptionsTabProps {
  allVideos: VideoItem[];
  onSelectVideo: (v: VideoItem) => void;
}

export const SubscriptionsTab: React.FC<SubscriptionsTabProps> = ({
  allVideos,
  onSelectVideo,
}) => {
  const [subscribedChannels, setSubscribedChannels] = useState(storageService.getSubscriptions());
  const [selectedChannel, setSelectedChannel] = useState<string | null>(null);

  // Group videos by channel
  const channelsList = Array.from(new Set(allVideos.map(v => v.channelName))).map(name => {
    const v = allVideos.find(x => x.channelName === name)!;
    return {
      name,
      avatar: v.channelAvatar,
      subscribers: v.subscribers,
      verified: v.verified,
      isSubscribed: subscribedChannels.includes(name),
    };
  });

  const filteredVideos = allVideos.filter(v => {
    if (selectedChannel) {
      return v.channelName === selectedChannel;
    }
    return subscribedChannels.includes(v.channelName);
  });

  const handleToggleSub = (name: string) => {
    const next = storageService.toggleSubscription(name);
    setSubscribedChannels(storageService.getSubscriptions());
  };

  return (
    <div className="flex-1 w-full overflow-y-auto p-3 md:p-6 pb-24 flex flex-col gap-6 select-none bg-gray-50 dark:bg-[#0f0f0f] transition-colors">
      {/* Subscribed Channels Avatar Carousel */}
      <div className="flex flex-col gap-2">
        <h2 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-wider font-mono">
          Subscribed Offline Channels
        </h2>

        <div className="flex items-center gap-4 overflow-x-auto no-scrollbar py-2">
          {/* All Filter Circle */}
          <button
            onClick={() => setSelectedChannel(null)}
            className="flex flex-col items-center gap-1.5 flex-shrink-0"
          >
            <div
              className={`w-14 h-14 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                selectedChannel === null
                  ? 'bg-red-600 text-white shadow-lg ring-2 ring-red-400'
                  : 'bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
              }`}
            >
              ALL
            </div>
            <span className="text-[11px] font-bold text-gray-700 dark:text-gray-300">
              All Channels
            </span>
          </button>

          {channelsList.map(ch => {
            const isSelected = selectedChannel === ch.name;
            return (
              <button
                key={ch.name}
                onClick={() => setSelectedChannel(isSelected ? null : ch.name)}
                className="flex flex-col items-center gap-1.5 flex-shrink-0 group"
              >
                <div className="relative">
                  <img
                    src={ch.avatar}
                    alt={ch.name}
                    className={`w-14 h-14 rounded-full object-cover border-2 transition-all ${
                      isSelected
                        ? 'border-red-600 ring-2 ring-red-400 scale-105'
                        : 'border-transparent group-hover:border-red-400'
                    }`}
                  />
                  {ch.isSubscribed && (
                    <div className="absolute bottom-0 right-0 w-4 h-4 bg-red-600 rounded-full border-2 border-white dark:border-gray-900 flex items-center justify-center text-white">
                      <Bell className="w-2.5 h-2.5 fill-current" />
                    </div>
                  )}
                </div>
                <span className="text-[11px] font-bold text-gray-700 dark:text-gray-300 max-w-[70px] truncate">
                  {ch.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Videos from Subscribed Channels */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-black text-gray-900 dark:text-white">
            {selectedChannel ? `Releases from ${selectedChannel}` : 'Fresh Offline Releases'}
          </h3>
          <span className="text-xs text-gray-500 font-mono">
            {filteredVideos.length} pre-loaded videos
          </span>
        </div>

        {filteredVideos.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredVideos.map(v => (
              <VideoCard key={v.id} video={v} onSelect={onSelectVideo} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 text-gray-500 text-xs">
            No videos found for this channel.
          </div>
        )}
      </div>
    </div>
  );
};
