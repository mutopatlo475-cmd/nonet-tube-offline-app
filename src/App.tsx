/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import React, { useState, useEffect, useMemo } from 'react';
import { VideoItem, ContentCategory } from './types/tubefree';
import { storageService } from './services/storageService';
import { Header } from './components/Header';
import { Navigation, NavTab } from './components/Navigation';
import { HomeFeed } from './components/HomeFeed';
import { VideoPlayer } from './components/VideoPlayer';
import { ShortsViewer } from './components/ShortsViewer';
import { LibraryTab } from './components/LibraryTab';
import { SubscriptionsTab } from './components/SubscriptionsTab';
import { P2PRadarModal } from './components/P2PRadarModal';
import { SmartStorageModal } from './components/SmartStorageModal';
import { UploadModal } from './components/UploadModal';
import { VoiceSearchModal } from './components/VoiceSearchModal';
import { KidsModeModal } from './components/KidsModeModal';
import { Smartphone, Monitor, WifiOff } from 'lucide-react';

export default function App() {
  const [allVideos, setAllVideos] = useState<VideoItem[]>([]);
  const [activeTab, setActiveTab] = useState<NavTab>('home');
  const [selectedVideo, setSelectedVideo] = useState<VideoItem | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<ContentCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [showP2PRadar, setShowP2PRadar] = useState(false);
  const [showStorageModal, setShowStorageModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showVoiceSearch, setShowVoiceSearch] = useState(false);
  const [showKidsModeModal, setShowKidsModeModal] = useState(false);
  const [shareTargetVideo, setShareTargetVideo] = useState<VideoItem | null>(null);

  // States
  const [isKidsMode, setIsKidsMode] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isPremium, setIsPremium] = useState(false);
  const [isMobileFrame, setIsMobileFrame] = useState(false);
  const [watchLaterIds, setWatchLaterIds] = useState<string[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Initialize data on mount
  useEffect(() => {
    const vids = storageService.getAllVideos();
    setAllVideos(vids);
    setIsKidsMode(storageService.isKidsMode());
    setIsPremium(storageService.isPremium());
    setWatchLaterIds(storageService.getWatchLater());

    // Sync HTML theme class
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleToggleTheme = () => {
    setIsDarkMode(prev => !prev);
  };

  const handleTogglePremium = () => {
    const next = !isPremium;
    setIsPremium(next);
    storageService.setPremium(next);
    showToast(next ? 'TubeFree Pro Active • 100% Ad-Free Master' : 'Pro Pass Expired');
  };

  const handleToggleWatchLater = (id: string) => {
    const isSaved = storageService.toggleWatchLater(id);
    setWatchLaterIds(storageService.getWatchLater());
    showToast(isSaved ? 'Saved to Offline Watch Later' : 'Removed from Watch Later');
  };

  const handleOpenP2PShare = (v: VideoItem) => {
    setShareTargetVideo(v);
    setShowP2PRadar(true);
  };

  const handleP2PSyncComplete = (newVideos: VideoItem[]) => {
    setAllVideos(storageService.getAllVideos());
    showToast(`P2P Sync Complete: ${newVideos[0]?.title} received at 78 MB/s!`);
  };

  const handleVideoUploaded = (newVideo: VideoItem) => {
    setAllVideos(storageService.getAllVideos());
    showToast('Published locally to your TubeFree Channel!');
  };

  // Filter videos based on Kids Mode, Category, and Search Query
  const filteredVideos = useMemo(() => {
    let result = allVideos;

    // Filter by Kids Mode
    if (isKidsMode) {
      result = result.filter(v => v.category === 'kids' || v.category === 'islamic');
    }

    // Filter by Category
    if (selectedCategory !== 'all') {
      result = result.filter(v => v.category === selectedCategory);
    }

    // Filter by Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        v =>
          v.title.toLowerCase().includes(q) ||
          v.urduTitle?.toLowerCase().includes(q) ||
          v.channelName.toLowerCase().includes(q) ||
          v.tags.some(t => t.toLowerCase().includes(q))
      );
    }

    return result.filter(v => !v.isShort);
  }, [allVideos, isKidsMode, selectedCategory, searchQuery]);

  const shortsList = useMemo(() => {
    return allVideos.filter(v => v.isShort);
  }, [allVideos]);

  return (
    <div className={`min-h-screen w-full bg-slate-950 flex flex-col items-center justify-center ${isDarkMode ? 'dark' : ''}`}>
      {/* Device Mode Toggle Bar (Allows user to toggle between Mobile Phone frame and Fullscreen desktop) */}
      <div className="w-full bg-slate-900 border-b border-slate-800 px-4 py-1.5 flex items-center justify-between text-xs text-slate-300 z-40 select-none">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-bold text-white font-mono">TUBEFREE ENGINE v2026.4</span>
          <span className="hidden sm:inline text-slate-400">• 100% Offline YouTube Alternative</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsMobileFrame(!isMobileFrame)}
            className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1 rounded-lg font-semibold transition-colors"
          >
            {isMobileFrame ? (
              <>
                <Monitor className="w-3.5 h-3.5 text-amber-400" />
                <span>Desktop Mode</span>
              </>
            ) : (
              <>
                <Smartphone className="w-3.5 h-3.5 text-red-400" />
                <span>Mobile Phone Frame</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main App Container (Adaptive fullscreen or mobile phone container) */}
      <div
        className={`w-full transition-all duration-300 flex flex-col bg-white dark:bg-[#0f0f0f] relative overflow-hidden ${
          isMobileFrame
            ? 'max-w-[420px] h-[860px] my-4 rounded-[42px] border-[10px] border-slate-800 shadow-[0_25px_60px_rgba(0,0,0,0.8)]'
            : 'flex-1 h-[calc(100vh-36px)]'
        }`}
      >
        {/* Toast Notification Banner */}
        {toastMessage && (
          <div className="absolute top-16 left-1/2 -translate-x-1/2 z-50 bg-slate-950/95 border border-red-500/80 text-white px-4 py-2 rounded-2xl text-xs font-bold shadow-2xl backdrop-blur-md animate-fade-in flex items-center gap-2 max-w-sm text-center">
            <WifiOff className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Header */}
        <Header
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onOpenVoiceSearch={() => setShowVoiceSearch(true)}
          onOpenP2PRadar={() => {
            setShareTargetVideo(null);
            setShowP2PRadar(true);
          }}
          onOpenStorage={() => setShowStorageModal(true)}
          onToggleKidsMode={() => setShowKidsModeModal(true)}
          isKidsMode={isKidsMode}
          isDarkMode={isDarkMode}
          onToggleTheme={handleToggleTheme}
          onOpenChannel={() => {
            setSelectedVideo(null);
            setActiveTab('library');
          }}
          isPremium={isPremium}
          onTogglePremium={handleTogglePremium}
        />

        {/* Body Viewport */}
        <div className="flex-1 flex overflow-hidden relative">
          {/* Desktop Left Sidebar (when not watching a video) */}
          {!selectedVideo && (
            <Navigation
              currentTab={activeTab}
              onTabChange={tab => {
                setSelectedVideo(null);
                if (tab === 'p2p') {
                  setShowP2PRadar(true);
                } else {
                  setActiveTab(tab);
                }
              }}
              isKidsMode={isKidsMode}
            />
          )}

          {/* Center Content Router */}
          {selectedVideo ? (
            <VideoPlayer
              video={selectedVideo}
              allVideos={allVideos}
              onBack={() => setSelectedVideo(null)}
              onSelectRelated={v => setSelectedVideo(v)}
              onOpenP2PShare={handleOpenP2PShare}
            />
          ) : activeTab === 'home' ? (
            <HomeFeed
              videos={filteredVideos}
              shorts={shortsList}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
              onSelectVideo={v => setSelectedVideo(v)}
              onSelectShorts={() => setActiveTab('shorts')}
              isKidsMode={isKidsMode}
              isPremium={isPremium}
              onUpgradePremium={handleTogglePremium}
              onToggleWatchLater={handleToggleWatchLater}
              watchLaterIds={watchLaterIds}
            />
          ) : activeTab === 'shorts' ? (
            <ShortsViewer
              shorts={shortsList}
              onOpenP2PShare={handleOpenP2PShare}
            />
          ) : activeTab === 'subscriptions' ? (
            <SubscriptionsTab
              allVideos={allVideos}
              onSelectVideo={v => setSelectedVideo(v)}
            />
          ) : activeTab === 'library' ? (
            <LibraryTab
              allVideos={allVideos}
              onSelectVideo={v => setSelectedVideo(v)}
              onOpenStorage={() => setShowStorageModal(true)}
              onOpenUpload={() => setShowUploadModal(true)}
              onOpenP2PRadar={() => {
                setShareTargetVideo(null);
                setShowP2PRadar(true);
              }}
            />
          ) : activeTab === 'upload' ? (
            <div className="flex-1 flex items-center justify-center p-6 bg-gray-50 dark:bg-[#0f0f0f]">
              <UploadModal
                onClose={() => setActiveTab('home')}
                onUploaded={handleVideoUploaded}
              />
            </div>
          ) : null}
        </div>
      </div>

      {/* Modals */}
      {showP2PRadar && (
        <P2PRadarModal
          onClose={() => {
            setShowP2PRadar(false);
            setShareTargetVideo(null);
          }}
          onSyncComplete={handleP2PSyncComplete}
          shareTargetVideo={shareTargetVideo}
        />
      )}

      {showStorageModal && (
        <SmartStorageModal onClose={() => setShowStorageModal(false)} />
      )}

      {showUploadModal && (
        <UploadModal
          onClose={() => setShowUploadModal(false)}
          onUploaded={handleVideoUploaded}
        />
      )}

      {showVoiceSearch && (
        <VoiceSearchModal
          onClose={() => setShowVoiceSearch(false)}
          onResult={q => {
            setSearchQuery(q);
            setSelectedVideo(null);
            setActiveTab('home');
          }}
        />
      )}

      {showKidsModeModal && (
        <KidsModeModal
          onClose={() => setShowKidsModeModal(false)}
          isCurrentlyKidsMode={isKidsMode}
          onKidsModeToggled={enabled => {
            setIsKidsMode(enabled);
            showToast(enabled ? 'Kids Safe Mode Enabled' : 'Kids Mode Deactivated');
          }}
        />
      )}
    </div>
  );
}
