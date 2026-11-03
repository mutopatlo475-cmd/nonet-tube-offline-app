import React, { useState } from 'react';
import { P2PPeer, VideoItem } from '../types/tubefree';
import { DISCOVERED_PEERS, simulateP2PTransfer } from '../services/p2pSyncService';
import {
  X,
  Radio,
  Wifi,
  Smartphone,
  Store,
  Sparkles,
  Zap,
  CheckCircle2,
  Share2,
  HardDrive,
} from 'lucide-react';

interface P2PRadarModalProps {
  onClose: () => void;
  onSyncComplete: (newVideos: VideoItem[]) => void;
  shareTargetVideo?: VideoItem | null;
}

export const P2PRadarModal: React.FC<P2PRadarModalProps> = ({
  onClose,
  onSyncComplete,
  shareTargetVideo,
}) => {
  const [peers, setPeers] = useState<P2PPeer[]>(DISCOVERED_PEERS);
  const [activeTab, setActiveTab] = useState<'radar' | 'franchise'>('radar');
  const [syncingPeerId, setSyncingPeerId] = useState<string | null>(null);
  const [syncProgress, setSyncProgress] = useState<{
    percent: number;
    speedMBps: number;
    transferredMB: number;
  } | null>(null);
  const [syncedVideoResult, setSyncedVideoResult] = useState<VideoItem | null>(null);

  const handleStartSync = async (peer: P2PPeer) => {
    setSyncingPeerId(peer.id);
    setSyncProgress({ percent: 0, speedMBps: 45, transferredMB: 0 });

    const newVideos = await simulateP2PTransfer(peer, (percent, speedMBps, transferredMB) => {
      setSyncProgress({ percent, speedMBps, transferredMB });
    });

    setSyncingPeerId(null);
    setSyncProgress(null);
    if (newVideos.length > 0) {
      setSyncedVideoResult(newVideos[0]);
      onSyncComplete(newVideos);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-3 sm:p-6 select-none animate-fade-in backdrop-blur-sm">
      <div className="bg-white dark:bg-[#121212] border border-gray-200 dark:border-gray-800 rounded-3xl max-w-lg w-full p-5 sm:p-6 shadow-2xl flex flex-col gap-4 relative overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-rose-600 to-red-600 flex items-center justify-center text-white shadow-md shadow-red-600/30">
              <Radio className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-gray-900 dark:text-white flex items-center gap-1.5">
                <span>P2P Smart Mesh Sync</span>
                <span className="text-[10px] uppercase font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 px-2 py-0.2 rounded-full font-mono">
                  0 MB Internet Data
                </span>
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Wi-Fi Direct / Local Mesh Peer Discovery
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Share Target Video Banner if opened via Share */}
        {shareTargetVideo && (
          <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800/60 rounded-2xl p-3 flex items-center gap-3">
            <img
              src={shareTargetVideo.thumbnail}
              alt={shareTargetVideo.title}
              className="w-14 h-9 rounded-lg object-cover"
            />
            <div className="flex-1 min-w-0">
              <div className="text-[11px] font-bold text-red-600 dark:text-red-400 uppercase font-mono">
                Broadcasting to Nearby Peers:
              </div>
              <div className="text-xs font-bold text-gray-900 dark:text-white truncate">
                {shareTargetVideo.title}
              </div>
            </div>
          </div>
        )}

        {/* Tab Switcher: Nearby Peers vs Franchise Kiosk Points */}
        <div className="flex items-center gap-2 p-1 bg-gray-100 dark:bg-gray-800 rounded-xl text-xs font-bold">
          <button
            onClick={() => setActiveTab('radar')}
            className={`flex-1 py-1.5 rounded-lg transition-all ${
              activeTab === 'radar'
                ? 'bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            Nearby Phones & Shops ({peers.length})
          </button>
          <button
            onClick={() => setActiveTab('franchise')}
            className={`flex-1 py-1.5 rounded-lg transition-all ${
              activeTab === 'franchise'
                ? 'bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            Super-Update Kiosks (1-Click)
          </button>
        </div>

        {/* Transfer Progress Overlay */}
        {syncProgress && (
          <div className="bg-slate-950 border border-red-500/80 rounded-2xl p-4 text-white flex flex-col gap-2.5 shadow-xl">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="flex items-center gap-1.5 text-amber-400">
                <Zap className="w-4 h-4 fill-current" />
                <span>Wi-Fi Direct Beam Active</span>
              </span>
              <span className="font-mono text-emerald-400">{syncProgress.speedMBps} MB/s</span>
            </div>

            <div className="w-full h-2.5 bg-gray-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-red-600 via-amber-500 to-emerald-400 transition-all duration-150"
                style={{ width: `${syncProgress.percent}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-[11px] text-gray-400 font-mono">
              <span>{syncProgress.transferredMB} MB received</span>
              <span>{syncProgress.percent}% Complete</span>
            </div>
          </div>
        )}

        {/* Synced Success Alert */}
        {syncedVideoResult && (
          <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-700/60 rounded-2xl p-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
              <div className="text-xs">
                <span className="font-bold text-gray-900 dark:text-white block">
                  New Offline Video Added!
                </span>
                <span className="text-emerald-700 dark:text-emerald-300 line-clamp-1">
                  {syncedVideoResult.title}
                </span>
              </div>
            </div>
            <button
              onClick={() => setSyncedVideoResult(null)}
              className="text-[11px] font-bold text-emerald-700 dark:text-emerald-300 hover:underline"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Peers List */}
        <div className="flex flex-col gap-2.5 max-h-72 overflow-y-auto no-scrollbar">
          {peers
            .filter(p => (activeTab === 'franchise' ? p.type === 'kiosk' : p.type !== 'kiosk'))
            .map(peer => {
              const isSyncing = syncingPeerId === peer.id;
              return (
                <div
                  key={peer.id}
                  className="bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 rounded-2xl p-3 flex items-center justify-between gap-3 hover:border-red-400/50 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-gray-200 dark:bg-gray-800 flex items-center justify-center text-gray-700 dark:text-gray-300 flex-shrink-0">
                      {peer.type === 'shop_hotspot' ? (
                        <Store className="w-5 h-5 text-amber-500" />
                      ) : peer.type === 'kiosk' ? (
                        <HardDrive className="w-5 h-5 text-cyan-500" />
                      ) : (
                        <Smartphone className="w-5 h-5 text-red-500" />
                      )}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs sm:text-sm text-gray-900 dark:text-white truncate">
                          {peer.name}
                        </span>
                        <span className="text-[10px] text-gray-400 font-mono">
                          {peer.distanceMeters}m away
                        </span>
                      </div>

                      <div className="text-[11px] text-gray-500 dark:text-gray-400 truncate mt-0.5">
                        <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                          {peer.availableVideosCount} new releases
                        </span>{' '}
                        • {peer.totalSizeGB} GB pack
                      </div>
                    </div>
                  </div>

                  {/* 1-Tap Beam Sync Button */}
                  <button
                    onClick={() => handleStartSync(peer)}
                    disabled={isSyncing}
                    className="flex-shrink-0 bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow-md transition-all active:scale-95 flex items-center gap-1.5"
                  >
                    <Zap className="w-3.5 h-3.5 fill-current" />
                    <span>{isSyncing ? 'Syncing...' : 'Sync P2P'}</span>
                  </button>
                </div>
              );
            })}
        </div>

        {/* Footer info explaining P2P Technology */}
        <div className="text-[11px] text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800/40 p-3 rounded-2xl leading-relaxed flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-500 flex-shrink-0" />
          <span>
            <b>How It Works:</b> TubeFree creates an encrypted local Wi-Fi Direct mesh. When you walk past another user or partner shop, new videos transfer at up to 125 MB/s with zero internet usage.
          </span>
        </div>
      </div>
    </div>
  );
};
