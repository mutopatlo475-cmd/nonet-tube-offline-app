/**
 * Punjab Express 3D - Low-Occlusion World-Matched Simulation HUD
 * Zero backdrop-filter, tabular-nums readouts, 5-tone musical horn soundboard,
 * and collapsible bottom dock.
 */
import React, { useState } from 'react';
import {
  BusPhysicsState,
  CameraMode,
  GameControls,
} from '../types/game';
import {
  Camera,
  DoorOpen,
  DoorClosed,
  Lightbulb,
  Radio,
  Pause,
  ChevronDown,
  ChevronUp,
  Volume2,
  VolumeX,
  Gauge,
  Wind,
  Users,
  Coins,
  ShieldAlert,
} from 'lucide-react';

interface GameHUDProps {
  state: BusPhysicsState;
  cameraMode: CameraMode;
  onSetCameraMode: (mode: CameraMode) => void;
  onSendControl: (ctrl: Partial<GameControls>) => void;
  onPause: () => void;
  notification: { text: string; urdu?: string } | null;
  isMuted: boolean;
  onToggleMute: () => void;
}

export const GameHUD: React.FC<GameHUDProps> = ({
  state,
  cameraMode,
  onSetCameraMode,
  onSendControl,
  onPause,
  notification,
  isMuted,
  onToggleMute,
}) => {
  const [isDockCollapsed, setIsDockCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState<'horns' | 'controls' | 'views'>('horns');

  const absSpeed = Math.abs(state.speedKmh);

  return (
    <div className="absolute inset-0 z-10 pointer-events-none flex flex-col justify-between p-4 md:p-6 select-none overflow-hidden font-sans">
      {/* 1. TOP CLUSTER: World-Matched Perimeter Indicators */}
      <div className="flex items-start justify-between w-full">
        {/* Top Left: Tachometer, Speedometer & Air Pressure */}
        <div className="pointer-events-auto flex items-center gap-3">
          {/* Speedometer Card */}
          <div className="bg-slate-950/90 border border-amber-500/50 rounded-2xl p-3 shadow-xl flex items-center gap-3">
            <div className="flex flex-col items-center">
              <span className="text-[10px] uppercase font-bold tracking-wider text-amber-400 font-mono">
                SPEED
              </span>
              <div className="flex items-baseline">
                <span className="text-4xl font-black text-white font-mono tabular-nums leading-none tracking-tight">
                  {absSpeed}
                </span>
                <span className="text-xs text-amber-300 font-bold ml-1">KM/H</span>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[11px] font-bold bg-amber-500/20 text-amber-300 px-1.5 py-0.2 rounded font-mono">
                  GEAR: {state.gear === -1 ? 'R' : state.gear === 0 ? 'N' : state.gear}
                </span>
                <span className="text-[11px] font-mono text-slate-400">
                  {state.engineRpm} RPM
                </span>
              </div>
            </div>

            <div className="h-10 w-px bg-slate-800" />

            {/* Air Brake Pressure Reservoir */}
            <div className="flex flex-col items-center">
              <span className="text-[10px] uppercase font-bold tracking-wider text-cyan-400 font-mono flex items-center gap-1">
                <Wind className="w-3 h-3" /> AIR TANK
              </span>
              <div className="flex items-baseline">
                <span
                  className={`text-2xl font-black font-mono tabular-nums leading-none ${
                    state.airPressurePsi < 45 ? 'text-rose-500' : 'text-cyan-300'
                  }`}
                >
                  {state.airPressurePsi}
                </span>
                <span className="text-[10px] text-cyan-400 ml-0.5">PSI</span>
              </div>
              <div className="w-16 h-1.5 bg-slate-800 rounded-full mt-1.5 overflow-hidden">
                <div
                  className={`h-full transition-all duration-200 ${
                    state.airPressurePsi < 45 ? 'bg-rose-500' : 'bg-cyan-400'
                  }`}
                  style={{ width: `${(state.airPressurePsi / 120) * 100}%` }}
                />
              </div>
            </div>
          </div>

          {/* Off-road / Bridge status chip */}
          {state.isOverBridge && (
            <div className="bg-rose-950/90 border border-rose-500 text-rose-200 px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-lg">
              <ShieldAlert className="w-4 h-4 text-rose-400" />
              <span>NARROW BRICK BRIDGE! WATCH CANAL</span>
            </div>
          )}

          {state.isOffroad && (
            <div className="bg-amber-950/90 border border-amber-500 text-amber-200 px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-lg">
              <Gauge className="w-4 h-4 text-amber-400" />
              <span>MUD SHOULDER • REDUCED GRIP</span>
            </div>
          )}
        </div>

        {/* Top Center: Conductor Announcement Toast */}
        {notification && (
          <div className="pointer-events-none hidden sm:flex flex-col items-center bg-slate-950/95 border-2 border-amber-400 px-5 py-2 rounded-2xl shadow-2xl max-w-md text-center">
            <span className="text-sm font-extrabold text-amber-300 font-['Noto_Nastaliq_Urdu']">
              {notification.urdu || 'استاد جی دھیان نال!'}
            </span>
            <span className="text-xs font-semibold text-slate-200 tracking-wide mt-0.5">
              {notification.text}
            </span>
          </div>
        )}

        {/* Top Right: Passengers, Fare & Menu buttons */}
        <div className="pointer-events-auto flex items-center gap-3">
          {/* Passenger & Fare Status Card */}
          <div className="bg-slate-950/90 border border-emerald-500/50 rounded-2xl p-2.5 shadow-xl flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-emerald-400" />
              <div>
                <div className="text-[10px] uppercase font-bold text-slate-400 font-mono">
                  PASSENGERS
                </div>
                <div className="text-sm font-extrabold text-white font-mono tabular-nums">
                  {state.passengerCount} / {state.maxPassengers}
                </div>
              </div>
            </div>

            <div className="h-8 w-px bg-slate-800" />

            <div className="flex items-center gap-2">
              <Coins className="w-4 h-4 text-amber-400" />
              <div>
                <div className="text-[10px] uppercase font-bold text-slate-400 font-mono">
                  FARE
                </div>
                <div className="text-sm font-extrabold text-amber-300 font-mono tabular-nums">
                  Rs {state.fareEarnedPKR.toLocaleString()}
                </div>
              </div>
            </div>

            <div className="h-8 w-px bg-slate-800" />

            {/* Satisfaction */}
            <div className="flex flex-col items-end">
              <span className="text-[10px] uppercase font-bold text-slate-400 font-mono">
                RATING
              </span>
              <span className="text-sm font-extrabold text-emerald-300 font-mono tabular-nums">
                {state.passengerSatisfaction}%
              </span>
            </div>
          </div>

          {/* Audio & Pause Controls */}
          <button
            onClick={onToggleMute}
            aria-label={isMuted ? 'Unmute' : 'Mute'}
            className="p-3 bg-slate-950/90 hover:bg-slate-900 border border-slate-700 rounded-2xl text-slate-300 transition-all active:scale-95 shadow-md"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
          </button>

          <button
            onClick={onPause}
            aria-label="Pause game"
            className="p-3 bg-slate-950/90 hover:bg-slate-900 border border-slate-700 rounded-2xl text-amber-400 transition-all active:scale-95 shadow-md"
          >
            <Pause className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2. CENTER SCREEN BUS STOP NOTICE (When inside adda zone) */}
      {state.atStop && (
        <div className="pointer-events-auto self-center my-auto bg-slate-950/95 border-2 border-emerald-500 rounded-2xl p-4 shadow-2xl flex flex-col items-center text-center animate-fade-in max-w-sm">
          <div className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center text-white mb-2 shadow-inner">
            <Users className="w-5 h-5" />
          </div>
          <div className="text-lg font-bold text-white font-['Noto_Nastaliq_Urdu']">
            بس اسٹاپ • اڈا پہنچ گئے
          </div>
          <div className="text-sm font-bold text-emerald-300 mt-1">{state.currentStopName}</div>
          <div className="text-xs text-slate-300 mt-1">
            {state.doorsOpen
              ? 'Boarding passengers... Ready to pull out!'
              : 'Bring bus to a stop (< 2 km/h) & press "O" to open doors!'}
          </div>
          <button
            onClick={() => onSendControl({ toggleDoor: true })}
            className={`mt-3 px-5 py-2 rounded-xl font-bold text-xs flex items-center gap-2 transition-all ${
              state.doorsOpen
                ? 'bg-rose-600 hover:bg-rose-500 text-white'
                : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950'
            }`}
          >
            {state.doorsOpen ? <DoorClosed className="w-4 h-4" /> : <DoorOpen className="w-4 h-4" />}
            <span>{state.doorsOpen ? 'CLOSE DOORS (O)' : 'OPEN DOORS TO BOARD (O)'}</span>
          </button>
        </div>
      )}

      {/* 3. TOUCH ON-SCREEN STEERING CONTROLS (For Mobile / Touch Users) */}
      <div className="flex md:hidden items-end justify-between w-full pointer-events-auto mb-2 px-2">
        {/* Steering Buttons */}
        <div className="flex gap-2">
          <button
            onTouchStart={() => onSendControl({ steerLeft: true })}
            onTouchEnd={() => onSendControl({ steerLeft: false })}
            onMouseDown={() => onSendControl({ steerLeft: true })}
            onMouseUp={() => onSendControl({ steerLeft: false })}
            className="w-14 h-14 bg-slate-900/90 active:bg-amber-500 border-2 border-slate-700 active:border-amber-400 text-white font-black text-xl rounded-2xl flex items-center justify-center shadow-lg active:scale-95"
          >
            ◀
          </button>
          <button
            onTouchStart={() => onSendControl({ steerRight: true })}
            onTouchEnd={() => onSendControl({ steerRight: false })}
            onMouseDown={() => onSendControl({ steerRight: true })}
            onMouseUp={() => onSendControl({ steerRight: false })}
            className="w-14 h-14 bg-slate-900/90 active:bg-amber-500 border-2 border-slate-700 active:border-amber-400 text-white font-black text-xl rounded-2xl flex items-center justify-center shadow-lg active:scale-95"
          >
            ▶
          </button>
        </div>

        {/* Gas & Brake Pedals */}
        <div className="flex gap-3">
          <button
            onTouchStart={() => onSendControl({ brake: true })}
            onTouchEnd={() => onSendControl({ brake: false })}
            onMouseDown={() => onSendControl({ brake: true })}
            onMouseUp={() => onSendControl({ brake: false })}
            className="w-16 h-20 bg-rose-950/90 active:bg-rose-600 border-2 border-rose-600 rounded-2xl flex flex-col items-center justify-center text-rose-300 active:text-white font-extrabold text-xs shadow-lg active:scale-95"
          >
            <Wind className="w-5 h-5 mb-1" />
            <span>BRAKE</span>
          </button>
          <button
            onTouchStart={() => onSendControl({ throttle: true })}
            onTouchEnd={() => onSendControl({ throttle: false })}
            onMouseDown={() => onSendControl({ throttle: true })}
            onMouseUp={() => onSendControl({ throttle: false })}
            className="w-16 h-24 bg-emerald-950/90 active:bg-emerald-500 border-2 border-emerald-500 rounded-2xl flex flex-col items-center justify-center text-emerald-300 active:text-slate-950 font-black text-xs shadow-lg active:scale-95"
          >
            <span>GAS</span>
            <span className="text-[10px] mt-1 font-mono">DRIVE</span>
          </button>
        </div>
      </div>

      {/* 4. UNIFIED COLLAPSIBLE BOTTOM DOCK (Clean, low-occlusion centered dock) */}
      <div className="pointer-events-auto self-center w-full max-w-3xl flex flex-col items-center">
        {/* Collapse / Expand Toggle Button */}
        <button
          onClick={() => setIsDockCollapsed(!isDockCollapsed)}
          className="flex items-center gap-1.5 bg-slate-950/90 hover:bg-slate-900 border border-slate-700/80 text-amber-300 px-4 py-1 rounded-t-xl text-xs font-bold transition-all shadow-md active:scale-95"
        >
          {isDockCollapsed ? (
            <>
              <ChevronUp className="w-3.5 h-3.5" />
              <span>SHOW DOCK & HORNS (H)</span>
            </>
          ) : (
            <>
              <ChevronDown className="w-3.5 h-3.5" />
              <span>HIDE DOCK (H)</span>
            </>
          )}
        </button>

        {!isDockCollapsed && (
          <div className="w-full bg-slate-950/95 border border-slate-700/90 rounded-2xl rounded-t-none p-3 shadow-2xl flex flex-col gap-2.5">
            {/* Dock Tabs Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setActiveTab('horns')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    activeTab === 'horns'
                      ? 'bg-amber-500 text-slate-950'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900'
                  }`}
                >
                  🎺 MUSICAL AIR HORNS (1-5)
                </button>
                <button
                  onClick={() => setActiveTab('views')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    activeTab === 'views'
                      ? 'bg-amber-500 text-slate-950'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900'
                  }`}
                >
                  📷 CAMERAS (C)
                </button>
                <button
                  onClick={() => setActiveTab('controls')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    activeTab === 'controls'
                      ? 'bg-amber-500 text-slate-950'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900'
                  }`}
                >
                  ⚙️ BUS FUNCTIONS
                </button>
              </div>

              <div className="hidden sm:block text-[11px] font-mono text-slate-400">
                PUNJAB EXPRESS DULHAN COACH
              </div>
            </div>

            {/* Tab 1: The 5-Tone Musical Pakistani Air Horn Soundboard */}
            {activeTab === 'horns' && (
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {[
                  { id: 1, name: 'WAPDA Horn', desc: 'Dual High Tone', key: '1' },
                  { id: 2, name: 'Babul Di Dua', desc: 'Folk Melody', key: '2' },
                  { id: 3, name: 'Bhangra Dhol', desc: '4-Beat Staccato', key: '3' },
                  { id: 4, name: 'Police Siren', desc: 'Express Clear', key: '4' },
                  { id: 5, name: 'Bedford Blast', desc: 'Heavy Chime', key: '5' },
                ].map(h => (
                  <button
                    key={h.id}
                    onClick={() => onSendControl({ horn: h.id })}
                    className="flex flex-col items-center justify-center bg-slate-900 hover:bg-amber-500/20 active:bg-amber-500 border border-slate-700 hover:border-amber-400 active:border-amber-300 p-2 rounded-xl transition-all active:scale-95 group"
                  >
                    <div className="flex items-center gap-1">
                      <span className="text-amber-400 group-hover:text-amber-300 font-extrabold text-xs">
                        [{h.key}]
                      </span>
                      <span className="text-white group-hover:text-amber-300 font-bold text-xs truncate">
                        {h.name}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400 group-hover:text-slate-300 mt-0.5">
                      {h.desc}
                    </span>
                  </button>
                ))}
              </div>
            )}

            {/* Tab 2: Camera View Selector */}
            {activeTab === 'views' && (
              <div className="flex items-center justify-center gap-3">
                {[
                  { id: 'chase' as CameraMode, label: 'Chase View (3P)', desc: 'Follow Behind' },
                  { id: 'cockpit' as CameraMode, label: 'Cockpit View (1P)', desc: 'Behind Wooden Wheel' },
                  { id: 'bumper' as CameraMode, label: 'Bumper Cam', desc: 'Low Extreme Road' },
                ].map(v => (
                  <button
                    key={v.id}
                    onClick={() => onSetCameraMode(v.id)}
                    className={`flex-1 py-2 px-3 rounded-xl border flex flex-col items-center transition-all ${
                      cameraMode === v.id
                        ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold'
                        : 'bg-slate-900 text-slate-300 border-slate-700 hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 text-xs font-extrabold">
                      <Camera className="w-3.5 h-3.5" />
                      <span>{v.label}</span>
                    </div>
                    <span className="text-[10px] opacity-80">{v.desc}</span>
                  </button>
                ))}
              </div>
            )}

            {/* Tab 3: Bus Controls (Door, Lights, Cassette Radio) */}
            {activeTab === 'controls' && (
              <div className="flex flex-wrap items-center justify-center gap-3">
                <button
                  onClick={() => onSendControl({ toggleDoor: true })}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-xs font-bold transition-all ${
                    state.doorsOpen
                      ? 'bg-emerald-600 text-white border-emerald-400'
                      : 'bg-slate-900 text-slate-300 border-slate-700 hover:bg-slate-800'
                  }`}
                >
                  {state.doorsOpen ? <DoorOpen className="w-4 h-4" /> : <DoorClosed className="w-4 h-4" />}
                  <span>DOORS: {state.doorsOpen ? 'OPEN (O)' : 'CLOSED (O)'}</span>
                </button>

                <button
                  onClick={() => onSendControl({ toggleLights: true })}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-xs font-bold transition-all ${
                    state.headlightsOn
                      ? 'bg-amber-500 text-slate-950 border-amber-400'
                      : 'bg-slate-900 text-slate-300 border-slate-700 hover:bg-slate-800'
                  }`}
                >
                  <Lightbulb className="w-4 h-4" />
                  <span>HEADLIGHTS: {state.headlightsOn ? 'ON (L)' : 'OFF (L)'}</span>
                </button>

                <button
                  onClick={() => onSendControl({ toggleRadio: true })}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-xs font-bold transition-all ${
                    state.radioPlaying
                      ? 'bg-cyan-600 text-white border-cyan-400'
                      : 'bg-slate-900 text-slate-300 border-slate-700 hover:bg-slate-800'
                  }`}
                >
                  <Radio className="w-4 h-4" />
                  <span>CASSETTE TAPE: {state.radioPlaying ? 'PLAYING (R)' : 'OFF (R)'}</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
