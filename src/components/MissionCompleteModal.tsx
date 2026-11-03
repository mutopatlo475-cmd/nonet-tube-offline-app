import React, { useEffect } from 'react';
import { Trophy, RotateCcw, Home, Star, Coins, Users } from 'lucide-react';
import confetti from 'canvas-confetti';

interface MissionCompleteModalProps {
  onRestart: () => void;
  onHome: () => void;
  fareEarned: number;
  satisfaction: number;
  routeName: string;
}

export const MissionCompleteModal: React.FC<MissionCompleteModalProps> = ({
  onRestart,
  onHome,
  fareEarned,
  satisfaction,
  routeName,
}) => {
  useEffect(() => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#f59e0b', '#10b981', '#3b82f6', '#ef4444'],
      });
    } catch {
      // Ignore if canvas not supported
    }
  }, []);

  return (
    <div className="absolute inset-0 z-30 bg-black/80 flex items-center justify-center p-4 select-none">
      <div className="bg-slate-950 border-2 border-amber-400 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl flex flex-col items-center text-center">
        {/* Trophy icon */}
        <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-600 to-yellow-400 flex items-center justify-center text-slate-950 shadow-xl mb-3">
          <Trophy className="w-8 h-8" />
        </div>

        <h2 className="text-3xl font-black text-white font-['Chakra_Petch']">
          DESTINATION REACHED!
        </h2>
        <div className="text-xl font-bold text-amber-300 font-['Noto_Nastaliq_Urdu'] mt-1">
          مبارک ہو! منزل مقصود پہنچ گئے
        </div>
        <p className="text-sm text-slate-300 mt-1 max-w-sm">
          {routeName} completed successfully! The passengers are thrilled with your driving skills.
        </p>

        {/* Reward Stats Grid */}
        <div className="w-full bg-slate-900 border border-slate-800 rounded-2xl p-4 my-6 grid grid-cols-3 gap-2">
          <div className="flex flex-col items-center p-2 rounded-xl bg-slate-950/60">
            <Coins className="w-5 h-5 text-amber-400 mb-1" />
            <span className="text-[10px] text-slate-400 uppercase font-mono">Total Fare</span>
            <span className="text-base font-extrabold text-amber-300 font-mono">
              Rs {fareEarned.toLocaleString()}
            </span>
          </div>

          <div className="flex flex-col items-center p-2 rounded-xl bg-slate-950/60">
            <Star className="w-5 h-5 text-yellow-400 mb-1" />
            <span className="text-[10px] text-slate-400 uppercase font-mono">Satisfaction</span>
            <span className="text-base font-extrabold text-emerald-400 font-mono">
              {satisfaction}%
            </span>
          </div>

          <div className="flex flex-col items-center p-2 rounded-xl bg-slate-950/60">
            <Users className="w-5 h-5 text-cyan-400 mb-1" />
            <span className="text-[10px] text-slate-400 uppercase font-mono">Rank</span>
            <span className="text-base font-extrabold text-cyan-300 font-mono">
              USTAAD ★
            </span>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-3 w-full">
          <button
            onClick={onRestart}
            className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 text-slate-950 font-black py-3 rounded-xl transition-all active:scale-95 text-xs sm:text-sm"
          >
            <RotateCcw className="w-4 h-4 fill-slate-950" />
            <span>DRIVE AGAIN</span>
          </button>

          <button
            onClick={onHome}
            className="flex-1 flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white font-bold py-3 rounded-xl transition-all active:scale-95 text-xs sm:text-sm"
          >
            <Home className="w-4 h-4 text-cyan-400" />
            <span>ROUTE SELECTION</span>
          </button>
        </div>
      </div>
    </div>
  );
};
