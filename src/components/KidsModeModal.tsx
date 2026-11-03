import React, { useState } from 'react';
import { storageService } from '../services/storageService';
import { X, Baby, Lock, KeyRound, CheckCircle2, ShieldAlert } from 'lucide-react';

interface KidsModeModalProps {
  onClose: () => void;
  isCurrentlyKidsMode: boolean;
  onKidsModeToggled: (enabled: boolean) => void;
}

export const KidsModeModal: React.FC<KidsModeModalProps> = ({
  onClose,
  isCurrentlyKidsMode,
  onKidsModeToggled,
}) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleToggle = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin.length !== 4) {
      setError('Please enter a 4-digit parent PIN');
      return;
    }

    const nextMode = !isCurrentlyKidsMode;
    storageService.setKidsMode(nextMode);
    onKidsModeToggled(nextMode);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 select-none animate-fade-in backdrop-blur-sm">
      <div className="bg-white dark:bg-[#121212] border border-gray-200 dark:border-gray-800 rounded-3xl max-w-sm w-full p-6 shadow-2xl flex flex-col items-center text-center gap-4 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 rounded-full"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-500">
          <Baby className="w-7 h-7" />
        </div>

        <div>
          <h3 className="text-lg font-black text-gray-900 dark:text-white">
            {isCurrentlyKidsMode ? 'Exit Kids Mode' : 'Enable Kids Safe Mode'}
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {isCurrentlyKidsMode
              ? 'Enter parent PIN to return to full library'
              : 'Locks adult content & dramas. Only safe cartoons & moral stories are shown.'}
          </p>
        </div>

        <form onSubmit={handleToggle} className="w-full flex flex-col gap-3">
          <div>
            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
              4-Digit Parental PIN
            </label>
            <input
              type="password"
              maxLength={4}
              placeholder="••••"
              value={pin}
              onChange={e => {
                setPin(e.target.value.replace(/\D/g, ''));
                setError(null);
              }}
              className="w-full text-center tracking-[1em] text-lg font-mono px-3 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:border-amber-500"
            />
            {error && <span className="text-[11px] text-rose-500 mt-1 block">{error}</span>}
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs sm:text-sm rounded-xl shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            <KeyRound className="w-4 h-4" />
            <span>{isCurrentlyKidsMode ? 'Verify & Exit Kids Mode' : 'Lock Into Kids Mode'}</span>
          </button>
        </form>
      </div>
    </div>
  );
};
