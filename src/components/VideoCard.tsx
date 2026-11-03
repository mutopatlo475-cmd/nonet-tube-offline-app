import React from 'react';
import { VideoItem } from '../types/tubefree';
import { CheckCircle2, Bookmark, Clock, HardDrive, Languages } from 'lucide-react';

interface VideoCardProps {
  video: VideoItem;
  onSelect: (video: VideoItem) => void;
  onToggleWatchLater?: (videoId: string) => void;
  isSavedWatchLater?: boolean;
}

export const VideoCard: React.FC<VideoCardProps> = ({
  video,
  onSelect,
  onToggleWatchLater,
  isSavedWatchLater,
}) => {
  const sizeMB = Math.round(video.fileSizeBytes / (1024 * 1024));

  return (
    <div
      onClick={() => onSelect(video)}
      className="group flex flex-col cursor-pointer rounded-2xl overflow-hidden bg-transparent hover:bg-gray-50 dark:hover:bg-[#1a1a1a]/60 transition-all p-2 select-none"
    >
      {/* Thumbnail Container */}
      <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-gray-200 dark:bg-gray-800">
        <img
          src={video.thumbnail}
          alt={video.title}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />

        {/* Duration Badge */}
        <div className="absolute bottom-2 right-2 bg-black/80 text-white text-[11px] font-bold font-mono px-2 py-0.5 rounded-md backdrop-blur-sm">
          {video.duration}
        </div>

        {/* Codec & Compression Badge (USP: H.265 / AV1) */}
        <div className="absolute top-2 left-2 bg-gradient-to-r from-red-600 to-rose-600 text-white text-[10px] font-black uppercase px-2 py-0.5 rounded-md shadow-md backdrop-blur-sm flex items-center gap-1">
          <HardDrive className="w-2.5 h-2.5" />
          <span>{video.codec} • {sizeMB}MB</span>
        </div>

        {/* AI Dubbing Badge if available */}
        {video.availableDubbings.includes('urdu') && (
          <div className="absolute top-2 right-2 bg-emerald-600/90 text-white text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded-md flex items-center gap-1 backdrop-blur-sm">
            <Languages className="w-2.5 h-2.5" />
            <span>AI Urdu Dub</span>
          </div>
        )}
      </div>

      {/* Video Details */}
      <div className="flex gap-3 mt-3 items-start px-0.5">
        {/* Channel Avatar */}
        <img
          src={video.channelAvatar}
          alt={video.channelName}
          className="w-9 h-9 rounded-full object-cover border border-gray-200 dark:border-gray-700 flex-shrink-0 mt-0.5"
        />

        {/* Info Column */}
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 line-clamp-2 leading-snug group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
            {video.title}
          </h3>

          {video.urduTitle && (
            <div className="text-xs text-amber-600 dark:text-amber-400 font-['Noto_Nastaliq_Urdu'] line-clamp-1 mt-0.5">
              {video.urduTitle}
            </div>
          )}

          <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 mt-1">
            <span className="font-semibold truncate">{video.channelName}</span>
            {video.verified && <CheckCircle2 className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />}
          </div>

          <div className="flex items-center gap-2 text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">
            <span>{video.views} views</span>
            <span>•</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-semibold">100% Offline</span>
          </div>
        </div>

        {/* Quick Save to Watch Later */}
        {onToggleWatchLater && (
          <button
            onClick={e => {
              e.stopPropagation();
              onToggleWatchLater(video.id);
            }}
            title={isSavedWatchLater ? "Remove from Watch Later" : "Save to Watch Later"}
            className="p-1.5 text-gray-400 hover:text-red-600 dark:hover:text-red-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            {isSavedWatchLater ? (
              <Bookmark className="w-4 h-4 fill-red-600 text-red-600" />
            ) : (
              <Clock className="w-4 h-4" />
            )}
          </button>
        )}
      </div>
    </div>
  );
};
