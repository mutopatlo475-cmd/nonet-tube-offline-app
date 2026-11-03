import React, { useState } from 'react';
import { storageService } from '../services/storageService';
import {
  X,
  HardDrive,
  Sparkles,
  Trash2,
  CheckCircle2,
  Cpu,
  Layers,
  ShieldCheck,
} from 'lucide-react';

interface SmartStorageModalProps {
  onClose: () => void;
}

export const SmartStorageModal: React.FC<SmartStorageModalProps> = ({ onClose }) => {
  const stats = storageService.getStorageBreakdown();
  const [autoCleanEnabled, setAutoCleanEnabled] = useState(true);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizationResult, setOptimizationResult] = useState<{
    freedGB: number;
    preservedCount: number;
  } | null>(null);

  const handleRunOptimizer = () => {
    setIsOptimizing(true);
    setTimeout(() => {
      const res = storageService.runAiSmartStorageOptimization();
      setOptimizationResult(res);
      setIsOptimizing(false);
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-3 sm:p-6 select-none animate-fade-in backdrop-blur-sm">
      <div className="bg-white dark:bg-[#121212] border border-gray-200 dark:border-gray-800 rounded-3xl max-w-lg w-full p-5 sm:p-6 shadow-2xl flex flex-col gap-4 relative">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-600 to-blue-600 flex items-center justify-center text-white shadow-md shadow-cyan-600/30">
              <HardDrive className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-gray-900 dark:text-white flex items-center gap-1.5">
                <span>AI Smart Storage Engine</span>
                <span className="text-[10px] uppercase font-bold bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20 px-2 py-0.2 rounded-full font-mono">
                  H.265 / AV1
                </span>
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                10,000+ Hours Compressed Offline Media
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

        {/* Compression Savings Showcase Card */}
        <div className="bg-gradient-to-r from-cyan-950 via-slate-900 to-blue-950 border border-cyan-700/50 rounded-2xl p-4 text-white flex flex-col gap-2 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-cyan-300 flex items-center gap-1.5">
              <Cpu className="w-4 h-4" />
              <span>Neural Video Compression (AV1 & HEVC)</span>
            </span>
            <span className="bg-cyan-500 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-full uppercase">
              68% Storage Saved
            </span>
          </div>

          <div className="text-2xl font-black font-mono text-cyan-300">
            {stats.compressionSavedGB} GB Saved
          </div>
          <div className="text-[11px] text-gray-300 leading-snug">
            Advanced hardware codecs compress 4K and 1080p video by over 3x, allowing 10,000+ hours of video to fit in standard phone memory.
          </div>
        </div>

        {/* Storage Bar Breakdown */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="text-gray-700 dark:text-gray-300">TubeFree Offline Footprint</span>
            <span className="font-mono text-cyan-600 dark:text-cyan-400">
              {stats.tubeFreeUsedGB} GB of {stats.totalPhoneStorageGB} GB
            </span>
          </div>

          {/* Segmented Progress Bar */}
          <div className="w-full h-3 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden flex">
            <div className="bg-red-500 h-full" style={{ width: '40%' }} title="Movies" />
            <div className="bg-amber-500 h-full" style={{ width: '25%' }} title="Dramas" />
            <div className="bg-emerald-500 h-full" style={{ width: '15%' }} title="Islamic" />
            <div className="bg-purple-500 h-full" style={{ width: '12%' }} title="Kids" />
            <div className="bg-cyan-500 h-full" style={{ width: '8%' }} title="Other" />
          </div>

          {/* Legend */}
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 text-[10px] font-mono mt-1">
            <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
              <span className="w-2 h-2 rounded-full bg-red-500" /> Movies: {stats.moviesGB}G
            </div>
            <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
              <span className="w-2 h-2 rounded-full bg-amber-500" /> Dramas: {stats.dramasGB}G
            </div>
            <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500" /> Islamic: {stats.islamicGB}G
            </div>
            <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
              <span className="w-2 h-2 rounded-full bg-purple-500" /> Kids: {stats.kidsGB}G
            </div>
            <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
              <span className="w-2 h-2 rounded-full bg-cyan-500" /> Other: {stats.otherGB}G
            </div>
          </div>
        </div>

        {/* AI Auto-Storage Optimization Switch */}
        <div className="bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 rounded-2xl p-3.5 flex items-center justify-between gap-3">
          <div className="flex items-start gap-2.5">
            <Sparkles className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
            <div>
              <div className="text-xs font-bold text-gray-900 dark:text-white">
                On-Device AI Auto-Purge
              </div>
              <div className="text-[11px] text-gray-500 dark:text-gray-400 leading-snug">
                Automatically deletes unwatched videos after 30 days while keeping your starred and subscribed content.
              </div>
            </div>
          </div>

          <button
            onClick={() => setAutoCleanEnabled(!autoCleanEnabled)}
            className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors flex-shrink-0 ${
              autoCleanEnabled ? 'bg-emerald-500 justify-end' : 'bg-gray-300 dark:bg-gray-700 justify-start'
            }`}
          >
            <div className="w-4 h-4 rounded-full bg-white shadow-md" />
          </button>
        </div>

        {/* Optimization Result Alert */}
        {optimizationResult && (
          <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-700/60 rounded-2xl p-3 flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
            <div className="text-xs text-gray-900 dark:text-white">
              <b>AI Clean Complete:</b> Freed {optimizationResult.freedGB} GB of old unwatched cache. Preserved {optimizationResult.preservedCount} favorite and subscribed videos.
            </div>
          </div>
        )}

        {/* 1-Click Run AI Smart Optimizer */}
        <button
          onClick={handleRunOptimizer}
          disabled={isOptimizing}
          className="w-full py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-black text-xs sm:text-sm rounded-xl shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2"
        >
          {isOptimizing ? (
            <>
              <Sparkles className="w-4 h-4 animate-spin" />
              <span>Analyzing Watch History & Trimming...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>Run AI Smart Storage Optimizer</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
