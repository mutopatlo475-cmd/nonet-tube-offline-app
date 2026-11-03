import React from 'react';
import { Play, RotateCcw, Home, Volume2, VolumeX } from 'lucide-react';
import { BusPhysicsState } from '../types/game';

interface PauseModalProps {
  onResume: () => void;
  onRestart: () => void;
  onHome: () => void;
  state: BusPhysicsState;
  isMuted: boolean;
  onToggleMute: () => void;
}

export const PauseModal: React.FC<PauseModalProps> = ({
  onResume,
  onRestart,
  onHome,
  state,
  isMuted,
  onToggleMute,
}) => {
  return (
    <div className="absolute inset-0 z-30 bg-black/75 flex items-center justify-center p-4 select-none">
      <div className="bg-slate-950 border-2 border-amber-500/80 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl flex flex-col items-center text-center">
        {/* Pakistani Ornament Header */}
        <div className="w-12 h-12 rounded-full bg-amber-500/20 border border-amber-400 flex items-center justify-center text-amber-300 font-black text-xl mb-3">
          ⏸
        </div>

        <h2 className="text-3xl font-black text-white font-['Chakra_Petch']">
          GAME PAUSED
        </h2>
        <div className="text-lg font-bold text-amber-300 font-['Noto_Nastaliq_Urdu'] mt-1">
          کھیل روکا گیا ہے
        </div>

        {/* Current Trip Summary */}
        <div className="w-full bg-slate-900 border border-slate-800 rounded-2xl p-4 my-6 grid grid-cols-2 gap-3 text-left">
          <div>
            <div className="text-[10px] text-slate-400 uppercase font-mono">Passengers</div>
            <div className="text-lg font-extrabold text-white font-mono">
              {state.passengerCount} / {state.maxPassengers}
            </div>
          </div>
          <div>
            <div className="text-[10px] text-slate-400 uppercase font-mono">Fares Collected</div>
            <div className="text-lg font-extrabold text-amber-400 font-mono">
              Rs {state.fareEarnedPKR.toLocaleString()}
            </div>
          </div>
          <div>
            <div className="text-[10px] text-slate-400 uppercase font-mono">Air Pressure</div>
            <div className="text-lg font-extrabold text-cyan-400 font-mono">
              {state.airPressurePsi} PSI
            </div>
          </div>
          <div>
            <div className="text-[10px] text-slate-400 uppercase font-mono">Satisfaction</div>
            <div className="text-lg font-extrabold text-emerald-400 font-mono">
              {state.passengerSatisfaction}%
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3 w-full">
          <button
            onClick={onResume}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black py-3 rounded-xl shadow-lg transition-all active:scale-95 text-sm"
          >
            <Play className="w-4 h-4 fill-slate-950" />
            <span>RESUME SIMULATION (ESC)</span>
          </button>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={onRestart}
              className="flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white font-bold py-2.5 rounded-xl transition-all active:scale-95 text-xs"
            >
              <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
              <span>RESTART TRIP</span>
            </button>

            <button
              onClick={onHome}
              className="flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white font-bold py-2.5 rounded-xl transition-all active:scale-95 text-xs"
            >
              <Home className="w-3.5 h-3.5 text-cyan-400" />
              <span>MAIN MENU</span>
            </button>
          </div>

          <button
            onClick={onToggleMute}
            className="flex items-center justify-center gap-2 text-slate-400 hover:text-white py-1.5 text-xs transition-colors"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
            <span>Sound: {isMuted ? 'Muted' : 'Enabled'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
