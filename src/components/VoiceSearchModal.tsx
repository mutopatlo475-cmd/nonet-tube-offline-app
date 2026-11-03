import React, { useState, useEffect } from 'react';
import { Mic, X, Sparkles, Volume2 } from 'lucide-react';

interface VoiceSearchModalProps {
  onClose: () => void;
  onResult: (query: string) => void;
}

export const VoiceSearchModal: React.FC<VoiceSearchModalProps> = ({
  onClose,
  onResult,
}) => {
  const [transcript, setTranscript] = useState('');
  const [isListening, setIsListening] = useState(true);

  const sampleVoicePrompts = [
    'Kabhi Main Kabhi Tum',
    'Surah Rahman Tilawat',
    'Burka Avenger Kids',
    'Maula Jatt 4K Movie',
    'Ertugrul Ghazi Urdu',
    'Python Full Course',
  ];

  useEffect(() => {
    // Check Web Speech API
    const SpeechRecognition =
      (window as unknown as { SpeechRecognition?: any; webkitSpeechRecognition?: any })
        .SpeechRecognition ||
      (window as unknown as { SpeechRecognition?: any; webkitSpeechRecognition?: any })
        .webkitSpeechRecognition;

    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onresult = (event: any) => {
          const text = event.results[0][0].transcript;
          setTranscript(text);
          if (event.results[0].isFinal) {
            onResult(text);
            onClose();
          }
        };

        recognition.onerror = () => {
          setIsListening(false);
        };

        recognition.start();

        return () => {
          try {
            recognition.stop();
          } catch {}
        };
      } catch {
        setIsListening(false);
      }
    } else {
      setIsListening(false);
    }
  }, [onResult, onClose]);

  const handleSelectSample = (prompt: string) => {
    onResult(prompt);
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

        {/* Pulsing Mic Circle */}
        <div className="relative mt-2">
          <div className="w-20 h-20 rounded-full bg-red-600/20 animate-ping absolute inset-0" />
          <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-red-600 to-rose-600 flex items-center justify-center text-white shadow-xl shadow-red-600/40 relative">
            <Mic className="w-9 h-9" />
          </div>
        </div>

        <div>
          <h3 className="text-lg font-black text-gray-900 dark:text-white">
            {transcript ? `"${transcript}"` : 'Listening... Speak Now'}
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Search 10,000+ hours offline content with your voice
          </p>
        </div>

        {/* Quick Voice Prompt Suggestions */}
        <div className="w-full flex flex-col gap-1.5 mt-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 font-mono">
            Or Tap Quick Voice Prompt:
          </span>
          <div className="flex flex-wrap gap-1.5 justify-center">
            {sampleVoicePrompts.map(p => (
              <button
                key={p}
                onClick={() => handleSelectSample(p)}
                className="px-2.5 py-1 bg-gray-100 dark:bg-gray-800 hover:bg-red-50 dark:hover:bg-red-950/40 text-xs font-semibold rounded-full text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 transition-colors"
              >
                "{p}"
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
