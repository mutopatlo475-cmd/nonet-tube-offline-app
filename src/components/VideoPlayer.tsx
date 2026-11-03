import React, { useState, useRef, useEffect } from 'react';
import {
  VideoItem,
  VideoQuality,
  DubbingLanguage,
} from '../types/tubefree';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  CheckCircle2,
  ThumbsUp,
  ThumbsDown,
  Share2,
  Bookmark,
  Languages,
  Settings,
  HardDrive,
  MessageSquare,
  Send,
  Radio,
  ArrowLeft,
  Bell,
  Sparkles,
  Download,
} from 'lucide-react';
import { storageService } from '../services/storageService';
import { VideoCard } from './VideoCard';

interface VideoPlayerProps {
  video: VideoItem;
  allVideos: VideoItem[];
  onBack: () => void;
  onSelectRelated: (v: VideoItem) => void;
  onOpenP2PShare: (v: VideoItem) => void;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  video,
  allVideos,
  onBack,
  onSelectRelated,
  onOpenP2PShare,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(120);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showDubbingMenu, setShowDubbingMenu] = useState(false);
  const [quality, setQuality] = useState<VideoQuality>('1080p');
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [selectedDubbing, setSelectedDubbing] = useState<DubbingLanguage>('original');
  const [dubbingToast, setDubbingToast] = useState<string | null>(null);

  // Social states
  const [isLiked, setIsLiked] = useState(false);
  const [isDisliked, setIsDisliked] = useState(false);
  const [likesCount, setLikesCount] = useState(video.likes);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  // Comments
  const [comments, setComments] = useState(storageService.getComments(video.id));
  const [newCommentText, setNewCommentText] = useState('');
  const [showCommentsMobile, setShowCommentsMobile] = useState(false);

  // Save to history on mount
  useEffect(() => {
    storageService.addToHistory(video.id);
    setIsLiked(storageService.getLikedVideos().includes(video.id));
    setIsSubscribed(storageService.getSubscriptions().includes(video.channelName));
    setIsSaved(storageService.getWatchLater().includes(video.id));
    setComments(storageService.getComments(video.id));
    setLikesCount(video.likes);
  }, [video]);

  // Video Time updates
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
      setDuration(videoRef.current.duration || 120);
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

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const handleSpeedChange = (speed: number) => {
    setPlaybackSpeed(speed);
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
    }
    setShowSettings(false);
  };

  // Switch AI Dubbing Track
  const handleSelectDubbing = (dub: DubbingLanguage) => {
    setSelectedDubbing(dub);
    setShowDubbingMenu(false);
    const label =
      dub === 'urdu'
        ? 'AI On-Device Urdu Dubbing Activated (اردو آواز)'
        : dub === 'hindi'
        ? 'AI Hindi Dubbing Activated (हिंदी डब)'
        : dub === 'english'
        ? 'English Audio Track Activated'
        : 'Original Sound Track';
    setDubbingToast(label);
    setTimeout(() => setDubbingToast(null), 3500);
  };

  const handleToggleLike = () => {
    const nextState = storageService.toggleLike(video.id);
    setIsLiked(nextState);
    if (nextState) {
      setLikesCount(c => c + 1);
      setIsDisliked(false);
    } else {
      setLikesCount(c => c - 1);
    }
  };

  const handleToggleSubscribe = () => {
    const next = storageService.toggleSubscription(video.channelName);
    setIsSubscribed(next);
  };

  const handleToggleSave = () => {
    const next = storageService.toggleWatchLater(video.id);
    setIsSaved(next);
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;

    const userChannel = storageService.getUserChannel();
    const commentItem = {
      id: `c_${Date.now()}`,
      author: userChannel.name,
      authorAvatar: userChannel.avatar,
      text: newCommentText.trim(),
      timestamp: 'Just now',
      likes: 0,
    };

    storageService.addComment(video.id, commentItem);
    setComments(prev => [commentItem, ...prev]);
    setNewCommentText('');
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const relatedVideos = allVideos.filter(v => v.id !== video.id).slice(0, 8);

  return (
    <div className="flex-1 w-full overflow-y-auto bg-gray-50 dark:bg-[#0f0f0f] pb-20 select-none transition-colors">
      <div className="max-w-7xl mx-auto p-2 md:p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Player & Video Info (2 Columns wide on Desktop) */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          {/* Top Bar with Back Button */}
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="flex items-center gap-1.5 text-xs font-bold text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 p-2 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Feed</span>
            </button>
            <div className="h-4 w-px bg-gray-300 dark:bg-gray-700" />
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
              <HardDrive className="w-3.5 h-3.5" />
              <span>Playing from Local Storage ({video.codec} Compressed)</span>
            </span>
          </div>

          {/* Video Viewport Container */}
          <div className="relative w-full aspect-video rounded-3xl overflow-hidden bg-black shadow-2xl group">
            <video
              ref={videoRef}
              src={video.videoUrl}
              onTimeUpdate={handleTimeUpdate}
              onEnded={() => setIsPlaying(false)}
              autoPlay
              playsInline
              className="w-full h-full object-contain"
            />

            {/* AI Dubbing Toast Notification Overlay */}
            {dubbingToast && (
              <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 bg-slate-950/90 border border-emerald-500/80 text-emerald-300 px-4 py-2 rounded-2xl text-xs font-bold shadow-xl flex items-center gap-2 backdrop-blur-md animate-fade-in">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span>{dubbingToast}</span>
              </div>
            )}

            {/* Custom On-Screen Video Controls Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-4 z-10">
              {/* Top Controls: Quality & Dubbing Language */}
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white/90 truncate max-w-md drop-shadow">
                  {video.title}
                </span>

                <div className="flex items-center gap-2 relative">
                  {/* AI Dubbing Selector */}
                  <button
                    onClick={() => {
                      setShowDubbingMenu(!showDubbingMenu);
                      setShowSettings(false);
                    }}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all ${
                      selectedDubbing !== 'original'
                        ? 'bg-emerald-600 text-white shadow-md'
                        : 'bg-black/60 text-white/90 hover:bg-black/80'
                    }`}
                  >
                    <Languages className="w-3.5 h-3.5" />
                    <span className="capitalize">{selectedDubbing} Audio</span>
                  </button>

                  {/* Settings / Speed / Quality */}
                  <button
                    onClick={() => {
                      setShowSettings(!showSettings);
                      setShowDubbingMenu(false);
                    }}
                    className="p-1.5 bg-black/60 hover:bg-black/80 text-white rounded-full transition-colors"
                  >
                    <Settings className="w-4 h-4" />
                  </button>

                  {/* Dubbing Popover Menu */}
                  {showDubbingMenu && (
                    <div className="absolute top-10 right-0 bg-slate-950/95 border border-gray-700 rounded-2xl p-2 w-52 shadow-2xl z-30 flex flex-col gap-1 backdrop-blur-md">
                      <div className="text-[10px] uppercase font-bold text-gray-400 px-2 py-1 font-mono">
                        On-Device AI Dubbing
                      </div>
                      {[
                        { id: 'original' as DubbingLanguage, label: 'Original Audio Track' },
                        { id: 'urdu' as DubbingLanguage, label: 'Urdu AI Dub (اردو)' },
                        { id: 'hindi' as DubbingLanguage, label: 'Hindi AI Dub (हिंदी)' },
                        { id: 'english' as DubbingLanguage, label: 'English AI Voice' },
                      ].map(d => (
                        <button
                          key={d.id}
                          onClick={() => handleSelectDubbing(d.id)}
                          className={`text-left px-3 py-1.5 rounded-xl text-xs font-bold flex items-center justify-between transition-colors ${
                            selectedDubbing === d.id
                              ? 'bg-emerald-600 text-white'
                              : 'text-gray-300 hover:bg-gray-800'
                          }`}
                        >
                          <span>{d.label}</span>
                          {selectedDubbing === d.id && <Sparkles className="w-3.5 h-3.5" />}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Settings Popover Menu */}
                  {showSettings && (
                    <div className="absolute top-10 right-0 bg-slate-950/95 border border-gray-700 rounded-2xl p-3 w-56 shadow-2xl z-30 flex flex-col gap-2.5 backdrop-blur-md">
                      <div>
                        <div className="text-[10px] uppercase font-bold text-gray-400 font-mono mb-1">
                          Offline Quality
                        </div>
                        <div className="grid grid-cols-2 gap-1">
                          {(['4K', '1080p', '720p', 'DataSaver (360p)'] as VideoQuality[]).map(q => (
                            <button
                              key={q}
                              onClick={() => {
                                setQuality(q);
                                setShowSettings(false);
                              }}
                              className={`px-2 py-1 rounded-lg text-xs font-semibold ${
                                quality === q ? 'bg-red-600 text-white' : 'text-gray-300 hover:bg-gray-800'
                              }`}
                            >
                              {q}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="border-t border-gray-800 pt-2">
                        <div className="text-[10px] uppercase font-bold text-gray-400 font-mono mb-1">
                          Playback Speed
                        </div>
                        <div className="grid grid-cols-4 gap-1">
                          {[0.5, 1, 1.5, 2].map(s => (
                            <button
                              key={s}
                              onClick={() => handleSpeedChange(s)}
                              className={`px-1.5 py-1 rounded-lg text-xs font-semibold ${
                                playbackSpeed === s ? 'bg-red-600 text-white' : 'text-gray-300 hover:bg-gray-800'
                              }`}
                            >
                              {s}x
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Bottom Seek Bar & Controls */}
              <div className="flex flex-col gap-2">
                <input
                  type="range"
                  min={0}
                  max={duration || 100}
                  step={0.5}
                  value={currentTime}
                  onChange={handleSeek}
                  className="w-full h-1.5 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-red-600"
                />

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={togglePlay}
                      className="text-white hover:text-red-500 transition-colors p-1"
                    >
                      {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current" />}
                    </button>

                    <button
                      onClick={() => {
                        setIsMuted(!isMuted);
                        if (videoRef.current) videoRef.current.muted = !isMuted;
                      }}
                      className="text-white hover:text-red-500 transition-colors p-1"
                    >
                      {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                    </button>

                    <span className="text-xs text-white/90 font-mono">
                      {formatTime(currentTime)} / {formatTime(duration)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono uppercase bg-red-600 text-white px-2 py-0.5 rounded font-black">
                      {quality}
                    </span>

                    <button
                      onClick={() => {
                        if (!isFullscreen) {
                          videoRef.current?.requestFullscreen?.();
                          setIsFullscreen(true);
                        } else {
                          document.exitFullscreen?.();
                          setIsFullscreen(false);
                        }
                      }}
                      className="text-white hover:text-red-500 transition-colors p-1"
                    >
                      {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Video Metadata & Actions Bar */}
          <div className="flex flex-col gap-3">
            <h1 className="text-xl md:text-2xl font-black text-gray-900 dark:text-gray-100 leading-snug">
              {video.title}
            </h1>

            {video.urduTitle && (
              <div className="text-sm font-bold text-amber-600 dark:text-amber-400 font-['Noto_Nastaliq_Urdu']">
                {video.urduTitle}
              </div>
            )}

            {/* Channel Bar & Action Buttons */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-200 dark:border-gray-800 pb-4">
              {/* Channel Profile */}
              <div className="flex items-center gap-3">
                <img
                  src={video.channelAvatar}
                  alt={video.channelName}
                  className="w-11 h-11 rounded-full object-cover border border-gray-300 dark:border-gray-700"
                />
                <div>
                  <div className="flex items-center gap-1 font-bold text-sm text-gray-900 dark:text-white">
                    <span>{video.channelName}</span>
                    {video.verified && <CheckCircle2 className="w-3.5 h-3.5 text-blue-500" />}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {video.subscribers} subscribers
                  </div>
                </div>

                <button
                  onClick={handleToggleSubscribe}
                  className={`ml-2 px-4 py-2 rounded-full text-xs font-bold transition-all ${
                    isSubscribed
                      ? 'bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 flex items-center gap-1'
                      : 'bg-red-600 hover:bg-red-500 text-white shadow-md'
                  }`}
                >
                  {isSubscribed ? (
                    <>
                      <Bell className="w-3.5 h-3.5 fill-current" />
                      <span>Subscribed</span>
                    </>
                  ) : (
                    <span>Subscribe</span>
                  )}
                </button>
              </div>

              {/* Action Buttons: Like, Dislike, P2P Share, Saved */}
              <div className="flex items-center gap-2">
                {/* Like / Dislike Pill */}
                <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden p-0.5 border border-gray-200 dark:border-gray-700">
                  <button
                    onClick={handleToggleLike}
                    className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold transition-colors ${
                      isLiked ? 'text-red-600 dark:text-red-400' : 'text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    <ThumbsUp className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
                    <span>{likesCount.toLocaleString()}</span>
                  </button>

                  <div className="h-4 w-px bg-gray-300 dark:bg-gray-600" />

                  <button
                    onClick={() => {
                      setIsDisliked(!isDisliked);
                      if (!isDisliked && isLiked) {
                        setIsLiked(false);
                        setLikesCount(c => c - 1);
                      }
                    }}
                    className={`px-3 py-1.5 text-xs font-bold transition-colors ${
                      isDisliked ? 'text-red-600' : 'text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    <ThumbsDown className={`w-4 h-4 ${isDisliked ? 'fill-current' : ''}`} />
                  </button>
                </div>

                {/* Local P2P Beam Share */}
                <button
                  onClick={() => onOpenP2PShare(video)}
                  className="flex items-center gap-1.5 bg-gray-100 dark:bg-gray-800 hover:bg-red-50 dark:hover:bg-red-950/40 text-gray-800 dark:text-gray-200 hover:text-red-600 px-3.5 py-2 rounded-full text-xs font-bold border border-gray-200 dark:border-gray-700 transition-all active:scale-95"
                >
                  <Radio className="w-3.5 h-3.5 text-rose-500 animate-pulse" />
                  <span>P2P Share</span>
                </button>

                {/* Watch Later Bookmark */}
                <button
                  onClick={handleToggleSave}
                  className={`p-2 rounded-full border border-gray-200 dark:border-gray-700 transition-colors ${
                    isSaved ? 'bg-amber-100 dark:bg-amber-950 text-amber-500' : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                  }`}
                  title={isSaved ? "Saved in Watch Later" : "Save to Watch Later"}
                >
                  <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
                </button>

                {/* Offline Badge */}
                <div className="hidden sm:flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-300 dark:border-emerald-800 px-2.5 py-1 rounded-full">
                  <Download className="w-3 h-3" />
                  <span>Downloaded (0 MB Data)</span>
                </div>
              </div>
            </div>

            {/* Description Card */}
            <div className="bg-gray-100 dark:bg-gray-800/60 rounded-2xl p-4 text-xs leading-relaxed text-gray-800 dark:text-gray-200 flex flex-col gap-2">
              <div className="flex items-center gap-3 font-bold text-gray-600 dark:text-gray-400">
                <span>{video.views} views</span>
                <span>•</span>
                <span>{video.uploadDate}</span>
                <span>•</span>
                <span className="font-mono text-red-600 dark:text-red-400">Codec: {video.codec}</span>
              </div>
              <p>{video.description}</p>
              <div className="flex flex-wrap gap-1.5 mt-1">
                {video.tags.map(tag => (
                  <span
                    key={tag}
                    className="text-blue-600 dark:text-blue-400 font-semibold cursor-pointer hover:underline"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Comments Section */}
            <div className="flex flex-col gap-4 mt-2">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <MessageSquare className="w-4 h-4" />
                  <span>Comments ({comments.length})</span>
                </h3>
                <span className="text-xs text-gray-500">Stored on-device</span>
              </div>

              {/* Add Comment Box */}
              <form onSubmit={handleAddComment} className="flex gap-3 items-center">
                <img
                  src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80"
                  alt="You"
                  className="w-8 h-8 rounded-full object-cover"
                />
                <input
                  type="text"
                  placeholder="Add an offline comment..."
                  value={newCommentText}
                  onChange={e => setNewCommentText(e.target.value)}
                  className="flex-1 bg-transparent border-b border-gray-300 dark:border-gray-700 py-1.5 text-xs text-gray-900 dark:text-white focus:outline-none focus:border-red-500"
                />
                <button
                  type="submit"
                  disabled={!newCommentText.trim()}
                  className="p-2 bg-red-600 text-white rounded-full disabled:opacity-40 transition-opacity"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>

              {/* Comments List */}
              <div className="flex flex-col gap-3 mt-1">
                {comments.map(c => (
                  <div key={c.id} className="flex gap-3 items-start">
                    <img
                      src={c.authorAvatar}
                      alt={c.author}
                      className="w-8 h-8 rounded-full object-cover mt-0.5"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 text-xs">
                        <span className="font-bold text-gray-900 dark:text-gray-100">
                          {c.author}
                        </span>
                        <span className="text-[10px] text-gray-500">{c.timestamp}</span>
                      </div>
                      <p className="text-xs text-gray-700 dark:text-gray-300 mt-0.5 leading-snug">
                        {c.text}
                      </p>
                      <div className="flex items-center gap-2 text-[11px] text-gray-500 mt-1">
                        <button className="flex items-center gap-1 hover:text-red-500">
                          <ThumbsUp className="w-3 h-3" />
                          <span>{c.likes > 0 ? c.likes : ''}</span>
                        </button>
                        <span>Reply</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Related Offline Videos */}
        <div className="flex flex-col gap-3">
          <h2 className="text-base font-extrabold text-gray-900 dark:text-white flex items-center justify-between">
            <span>Related Offline Content</span>
            <span className="text-[11px] text-emerald-600 font-bold">100% Pre-loaded</span>
          </h2>

          <div className="flex flex-col gap-3">
            {relatedVideos.map(rel => (
              <VideoCard
                key={rel.id}
                video={rel}
                onSelect={onSelectRelated}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
