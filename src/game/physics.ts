/**
 * Vehicle Physics & Commercial Bus Dynamics Engine for Punjab Express 3D
 * Simulates heavy diesel inertia, pneumatic air brakes, leaf-spring body roll,
 * steering resistance, and collision impulses.
 */
import * as THREE from 'three';
import { BusPhysicsState, GameControls } from '../types/game';
import { soundManager } from '../audio/SoundSystem';
import { TrafficVehicle } from './environment';

export class VehiclePhysics {
  // Vehicle parameters
  public position = new THREE.Vector3(0, 0, 30);
  public rotation = new THREE.Euler(0, 0, 0, 'YXZ');
  public velocity = new THREE.Vector3(0, 0, 0);

  public speedMs = 0;
  public engineRpm = 800;
  public gear = 1; // -1: R, 1-5: Forward
  public steeringWheelAngle = 0; // -1 to 1
  public actualWheelSteer = 0;

  // Suspension & Dynamics
  public bodyRoll = 0;
  public pitch = 0;
  public verticalJolt = 0;
  public airPressurePsi = 115;
  public isAirBraking = false;
  private wasBrakingLastFrame = false;
  private wasReversingLastFrame = false;

  // Passengers & Satisfaction
  public passengerCount = 24;
  public maxPassengers = 48;
  public passengerSatisfaction = 95;
  public fareEarnedPKR = 3600;
  public health = 100;
  public doorsOpen = false;

  // Lights & Accessories
  public headlightsOn = false;
  public neonLightsOn = true;
  public hazardLightsOn = false;
  public leftBlinkerOn = false;
  public rightBlinkerOn = false;
  public radioPlaying = false;

  // Collision box
  public busHalfWidth = 1.3;
  public busHalfLength = 4.9;

  // State
  public atStop = false;
  public currentStopName = 'Badami Bagh Terminal, Lahore';
  public isOverBridge = false;
  public isFallenInWater = false;
  public isOffroad = false;

  constructor() {}

  public update(
    delta: number,
    controls: GameControls,
    checkBridge: (x: number, z: number) => { onBridge: boolean; fallenInWater: boolean },
    checkRoughness: (x: number, z: number) => { isOffroad: boolean; isPothole: boolean; slipFactor: number },
    trafficList: TrafficVehicle[]
  ): BusPhysicsState {
    const dt = Math.min(delta, 0.05); // Cap delta to prevent frame lag spikes

    // 1. Air Reservoir Dynamics
    if (this.engineRpm > 600 && this.airPressurePsi < 120) {
      // Engine compressor recharges air tank
      this.airPressurePsi = Math.min(120, this.airPressurePsi + 3.5 * dt);
    }

    // 2. Steering Physics
    let targetSteer = 0;
    if (controls.analogSteer !== 0) {
      targetSteer = controls.analogSteer;
    } else {
      if (controls.steerLeft) targetSteer -= 1.0;
      if (controls.steerRight) targetSteer += 1.0;
    }

    // Speed-dependent steering rate (faster speed = more deliberate steering response)
    const speedRatio = Math.abs(this.speedMs) / 30;
    const steerResponsiveness = Math.max(3.2, 7.5 - speedRatio * 4.5);

    this.steeringWheelAngle = THREE.MathUtils.damp(
      this.steeringWheelAngle,
      targetSteer,
      steerResponsiveness,
      dt
    );

    // Physical front wheel angle (max ~32 degrees = 0.55 rad)
    this.actualWheelSteer = this.steeringWheelAngle * 0.55;

    // 3. Terrain Roughness & Offroad check
    const terrainInfo = checkRoughness(this.position.x, this.position.z);
    this.isOffroad = terrainInfo.isOffroad;

    // Pothole jolt
    if (terrainInfo.isPothole && Math.abs(this.speedMs) > 3) {
      this.verticalJolt = (Math.random() - 0.5) * 0.35;
      this.passengerSatisfaction = Math.max(20, this.passengerSatisfaction - 0.4);
      soundManager.playBumpSound(0.7);
    } else {
      this.verticalJolt = THREE.MathUtils.damp(this.verticalJolt, 0, 10, dt);
    }

    // 4. Throttle & Air Brake Simulation
    const maxForwardSpeed = 33.3; // ~120 km/h
    const maxReverseSpeed = -6.0; // ~-22 km/h
    const enginePower = (terrainInfo.slipFactor * 8.5) * (this.doorsOpen ? 0 : 1);

    // Brake efficiency depends on air reservoir pressure
    const brakeMultiplier = Math.max(0.25, this.airPressurePsi / 110);
    const brakingPower = 16.0 * brakeMultiplier;

    let isAccelerating = false;
    let isBraking = false;

    if (controls.throttle && !this.doorsOpen) {
      if (this.speedMs < -0.2) {
        // Braking in reverse
        this.speedMs += brakingPower * dt;
        isBraking = true;
      } else {
        // Accelerating forward
        this.speedMs = Math.min(maxForwardSpeed, this.speedMs + enginePower * dt);
        isAccelerating = true;
      }
    } else if (controls.brake) {
      if (this.speedMs > 0.2) {
        // Braking forward
        this.speedMs = Math.max(0, this.speedMs - brakingPower * dt);
        isBraking = true;
        // Bleed air tank pressure
        this.airPressurePsi = Math.max(20, this.airPressurePsi - 7.5 * dt);
      } else {
        // Reversing
        this.speedMs = Math.max(maxReverseSpeed, this.speedMs - enginePower * 0.55 * dt);
        isAccelerating = true;
      }
    } else if (controls.handbrake) {
      // Emergency park / handbrake
      this.speedMs = THREE.MathUtils.damp(this.speedMs, 0, 8.0, dt);
      isBraking = true;
    } else {
      // Natural rolling resistance and air drag
      const rollingDrag = this.isOffroad ? 5.5 : 1.8;
      this.speedMs = THREE.MathUtils.damp(this.speedMs, 0, rollingDrag, dt);
    }

    // Pneumatic brake exhaust hiss sound ("khisssss-phatt!") when brake pedal is released
    if (this.wasBrakingLastFrame && !isBraking && Math.abs(this.speedMs) > 1) {
      soundManager.playAirBrakeHiss();
    }
    this.wasBrakingLastFrame = isBraking;

    // Conductor pea whistle when reversing
    if (this.speedMs < -0.5 && !this.wasReversingLastFrame) {
      soundManager.playReverseWhistle();
    }
    this.wasReversingLastFrame = this.speedMs < -0.5;

    // 5. Gear Ratios & Engine RPM Calculation
    const currentSpeedKmh = Math.abs(this.speedMs) * 3.6;
    if (this.speedMs < -0.2) {
      this.gear = -1;
      this.engineRpm = 800 + (currentSpeedKmh / 22) * 1400;
    } else if (currentSpeedKmh < 0.5) {
      this.gear = 1;
      this.engineRpm = controls.throttle ? 1400 : 750;
    } else if (currentSpeedKmh < 24) {
      this.gear = 1;
      this.engineRpm = 800 + (currentSpeedKmh / 24) * 1700;
    } else if (currentSpeedKmh < 46) {
      this.gear = 2;
      this.engineRpm = 1100 + ((currentSpeedKmh - 24) / 22) * 1500;
    } else if (currentSpeedKmh < 70) {
      this.gear = 3;
      this.engineRpm = 1300 + ((currentSpeedKmh - 46) / 24) * 1400;
    } else if (currentSpeedKmh < 95) {
      this.gear = 4;
      this.engineRpm = 1500 + ((currentSpeedKmh - 70) / 25) * 1300;
    } else {
      this.gear = 5;
      this.engineRpm = 1600 + ((currentSpeedKmh - 95) / 30) * 1000;
    }

    // Update diesel engine sound in Web Audio API
    soundManager.updateEngine(this.engineRpm, isAccelerating, currentSpeedKmh);

    // 6. Turn Kinematics & Yaw
    const turnRadius = 5.2 / Math.tan(Math.max(0.01, Math.abs(this.actualWheelSteer)));
    const angularVelocity = (this.speedMs / turnRadius) * Math.sign(this.actualWheelSteer);
    this.rotation.y += angularVelocity * dt;

    // Forward vector
    const headingX = Math.sin(this.rotation.y);
    const headingZ = Math.cos(this.rotation.y);

    this.position.x += headingX * this.speedMs * dt;
    this.position.z += headingZ * this.speedMs * dt;

    // 7. Leaf-Spring Suspension Body Roll & Pitch
    // Lateral acceleration: a = v^2 / r
    const lateralAcc = Math.pow(this.speedMs, 2) * angularVelocity * 0.08;
    const targetRoll = -Math.max(-0.28, Math.min(0.28, lateralAcc * 0.45));
    this.bodyRoll = THREE.MathUtils.damp(this.bodyRoll, targetRoll, 6.0, dt);

    // Longitudinal pitch (weight transfer on braking / acceleration)
    const targetPitch = isBraking ? 0.06 : isAccelerating ? -0.04 : 0.0;
    this.pitch = THREE.MathUtils.damp(this.pitch, targetPitch, 5.0, dt);

    // If extreme body roll, passengers scream and satisfaction decreases
    if (Math.abs(this.bodyRoll) > 0.2) {
      this.passengerSatisfaction = Math.max(10, this.passengerSatisfaction - 0.8 * dt);
    }

    // 8. Bridge and Canal Water Detection
    const bridgeState = checkBridge(this.position.x, this.position.z);
    this.isOverBridge = bridgeState.onBridge;

    if (bridgeState.fallenInWater && !this.isFallenInWater) {
      this.isFallenInWater = true;
      this.health = Math.max(0, this.health - 50);
      this.passengerSatisfaction = 0;
      soundManager.playCrashSound();
      // Reset position back onto road
      setTimeout(() => {
        this.position.x = 0;
        this.speedMs = 0;
        this.isFallenInWater = false;
      }, 1800);
    }

    // 9. Traffic Vehicle Collisions
    trafficList.forEach(tv => {
      const dx = Math.abs(this.position.x - tv.x);
      const dz = Math.abs(this.position.z - tv.z);
      const minDistX = this.busHalfWidth + tv.width / 2;
      const minDistZ = this.busHalfLength + tv.length / 2;

      if (dx < minDistX && dz < minDistZ) {
        // Collision impact!
        soundManager.playCrashSound();
        this.speedMs *= -0.3; // Bounce back
        this.health = Math.max(0, this.health - 12);
        this.passengerSatisfaction = Math.max(15, this.passengerSatisfaction - 15);

        // Push away
        const pushX = (this.position.x - tv.x) > 0 ? 0.8 : -0.8;
        this.position.x += pushX;
      }
    });

    return {
      speedKmh: Math.round(currentSpeedKmh * (this.speedMs < 0 ? -1 : 1)),
      engineRpm: Math.round(this.engineRpm),
      gear: this.gear,
      steeringAngle: this.steeringWheelAngle,
      bodyRoll: this.bodyRoll,
      pitch: this.pitch,
      airPressurePsi: Math.round(this.airPressurePsi),
      doorsOpen: this.doorsOpen,
      headlightsOn: this.headlightsOn,
      neonLightsOn: this.neonLightsOn,
      hazardLightsOn: this.hazardLightsOn,
      leftBlinkerOn: this.leftBlinkerOn,
      rightBlinkerOn: this.rightBlinkerOn,
      radioPlaying: this.radioPlaying,
      passengerCount: this.passengerCount,
      maxPassengers: this.maxPassengers,
      passengerSatisfaction: Math.round(this.passengerSatisfaction),
      fareEarnedPKR: this.fareEarnedPKR,
      health: Math.max(0, Math.round(this.health)),
      isBraking,
      isAirBrakeExhausting: false,
      isOffroad: this.isOffroad,
      isOverBridge: this.isOverBridge,
      currentStopName: this.currentStopName,
      atStop: this.atStop,
    };
  }

  public toggleDoors(): boolean {
    // Only open if bus is virtually stationary (under 5 km/h)
    if (Math.abs(this.speedMs) < 1.5) {
      this.doorsOpen = !this.doorsOpen;
      if (this.doorsOpen) {
        soundManager.playAirBrakeHiss();
      }
      return this.doorsOpen;
    }
    return false;
  }

  public boardPassengers(count: number, farePerPassenger: number) {
    const space = this.maxPassengers - this.passengerCount;
    const boarded = Math.min(space, count);
    if (boarded > 0) {
      this.passengerCount += boarded;
      this.fareEarnedPKR += boarded * farePerPassenger;
      soundManager.playCashChime();
      soundManager.playConductorSlap();
    }
  }

  public toggleHeadlights(): boolean {
    this.headlightsOn = !this.headlightsOn;
    return this.headlightsOn;
  }

  public toggleNeon(): boolean {
    this.neonLightsOn = !this.neonLightsOn;
    return this.neonLightsOn;
  }

  public resetVehicle(zPos: number = 20) {
    this.position.set(0, 0, zPos);
    this.rotation.set(0, 0, 0);
    this.speedMs = 0;
    this.steeringWheelAngle = 0;
    this.health = 100;
    this.airPressurePsi = 115;
    this.passengerSatisfaction = 95;
  }
}
