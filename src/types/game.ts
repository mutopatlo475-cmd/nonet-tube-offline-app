/**
 * Types and interfaces for Punjab Express: Extreme Roads 3D
 */

export type CameraMode = 'chase' | 'cockpit' | 'bumper' | 'cinematic';

export type SteeringInputMode = 'buttons' | 'wheel' | 'tilt';

export interface RouteInfo {
  id: string;
  name: string;
  urduName: string;
  origin: string;
  destination: string;
  distanceKm: number;
  difficulty: 'Moderate' | 'Extreme' | 'Brutal';
  description: string;
  targetPassengers: number;
  baseFarePKR: number;
}

export interface BusPhysicsState {
  speedKmh: number;
  engineRpm: number;
  gear: number; // -1: R, 0: N, 1-5: Forward
  steeringAngle: number; // -1 to 1
  bodyRoll: number; // radians
  pitch: number;
  airPressurePsi: number; // 0 to 120
  doorsOpen: boolean;
  headlightsOn: boolean;
  neonLightsOn: boolean;
  hazardLightsOn: boolean;
  leftBlinkerOn: boolean;
  rightBlinkerOn: boolean;
  radioPlaying: boolean;
  passengerCount: number;
  maxPassengers: number;
  passengerSatisfaction: number; // 0 to 100
  fareEarnedPKR: number;
  health: number; // 0 to 100
  isBraking: boolean;
  isAirBrakeExhausting: boolean;
  isOffroad: boolean;
  isOverBridge: boolean;
  currentStopName: string;
  atStop: boolean;
}

export interface GameControls {
  throttle: boolean;
  brake: boolean;
  steerLeft: boolean;
  steerRight: boolean;
  handbrake: boolean;
  horn: number | null; // 1-5 or null
  toggleDoor: boolean;
  toggleLights: boolean;
  toggleCamera: boolean;
  toggleRadio: boolean;
  analogSteer: number; // -1 to 1
}

export type GameState = 'title' | 'playing' | 'paused' | 'completed' | 'gameover';
