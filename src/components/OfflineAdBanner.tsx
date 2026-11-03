import React, { useState } from 'react';
import { Crown, Sparkles, X, ExternalLink } from 'lucide-react';

interface OfflineAdBannerProps {
  isPremium: boolean;
  onUpgradePremium: () => void;
}

export const OfflineAdBanner: React.FC<OfflineAdBannerProps> = ({
  isPremium,
  onUpgradePremium,
}) => {
  const [dismissed, setDismissed] = useState(false);

  if (isPremium || dismissed) return null;

  return (
    <div className="mx-3 md:mx-6 my-3 p-3 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-indigo-700/50 rounded-2xl text-white flex flex-wrap items-center justify-between gap-3 shadow-lg select-none">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-400 flex items-center justify-center text-amber-300 font-bold text-xs flex-shrink-0">
          AD
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-white">
              Jazz Super 4G • Pre-loaded Offline Sponsor
            </span>
            <span className="text-[9px] bg-indigo-500/30 text-indigo-200 px-1.5 py-0.2 rounded font-mono">
              Offline AdMob
            </span>
          </div>
          <div className="text-[11px] text-gray-300">
            Enjoy unlimited TubeFree offline streaming across Pakistan with zero data consumption.
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onUpgradePremium}
          className="bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 text-slate-950 font-black text-xs px-3 py-1.5 rounded-xl shadow-md transition-all active:scale-95 flex items-center gap-1.5"
        >
          <Crown className="w-3.5 h-3.5 fill-slate-950" />
          <span>Go Ad-Free Pro</span>
        </button>

        <button
          onClick={() => setDismissed(true)}
          className="p-1 text-gray-400 hover:text-white rounded-lg transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
