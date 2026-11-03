/**
 * Punjab Express: Extreme Roads 3D - Core Engine
 * Coordinates Three.js render loop, physics, environment, cameras, and passenger flow.
 */
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { CameraMode, GameControls, BusPhysicsState, RouteInfo } from '../types/game';
import { BusComponents, createPakistaniBusModel } from './busModel';
import { createPunjabEnvironment, EnvironmentWorld } from './environment';
import { VehiclePhysics } from './physics';
import { soundManager } from '../audio/SoundSystem';

export class GameEngine {
  private container: HTMLElement;
  private renderer!: THREE.WebGLRenderer;
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private isSoftwareGl: boolean = false;

  private busModel!: BusComponents;
  private environment!: EnvironmentWorld;
  private physics: VehiclePhysics = new VehiclePhysics();

  private cameraMode: CameraMode = 'chase';
  private frameId: number = 0;
  private clock: THREE.Clock = new THREE.Clock();

  // Callbacks to UI
  private onStateUpdate?: (state: BusPhysicsState) => void;
  private onNotification?: (msg: string, urduMsg?: string) => void;
  private onRouteComplete?: (fareTotal: number, satisfaction: number) => void;

  // Active route
  private currentRoute: RouteInfo | null = null;
  private activeControls: GameControls = {
    throttle: false,
    brake: false,
    steerLeft: false,
    steerRight: false,
    handbrake: false,
    horn: null,
    toggleDoor: false,
    toggleLights: false,
    toggleCamera: false,
    toggleRadio: false,
    analogSteer: 0,
  };

  // Exhaust particles
  private exhaustParticles!: THREE.Points;
  private exhaustCount = 40;
  private exhaustGeom!: THREE.BufferGeometry;

  // Cinematic title rotation
  private titleCinematicAngle = 0;
  public isTitleScreen = true;

  constructor(
    container: HTMLElement,
    callbacks: {
      onStateUpdate?: (state: BusPhysicsState) => void;
      onNotification?: (msg: string, urduMsg?: string) => void;
      onRouteComplete?: (fareTotal: number, satisfaction: number) => void;
    }
  ) {
    this.container = container;
    this.onStateUpdate = callbacks.onStateUpdate;
    this.onNotification = callbacks.onNotification;
    this.onRouteComplete = callbacks.onRouteComplete;

    this.init();
  }

  private init() {
    // 1. Software WebGL Detection Guard
    this.isSoftwareGl = (() => {
      const gl = document.createElement('canvas').getContext('webgl2');
      if (!gl) return true;
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
      const gpu = String(gl.getParameter(param));
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    })();

    // 2. Three.js Renderer Setup
    this.renderer = new THREE.WebGLRenderer({
      antialias: !this.isSoftwareGl,
      powerPreference: 'high-performance',
      alpha: false,
    });
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.15;
    this.renderer.setPixelRatio(this.isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = !this.isSoftwareGl;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);

    this.container.appendChild(this.renderer.domElement);

    // 3. Scene & Fog Setup (Warm Punjabi afternoon haze)
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xfde68a); // Warm golden horizon
    this.scene.fog = new THREE.FogExp2(0xfef08a, 0.0035);

    // 4. Camera Setup
    this.camera = new THREE.PerspectiveCamera(
      60,
      this.container.clientWidth / this.container.clientHeight,
      0.3,
      1200
    );
    this.camera.position.set(0, 5, -12);

    // 5. Studio Environment Map (PMREMGenerator with RoomEnvironment)
    const pmrem = new THREE.PMREMGenerator(this.renderer);
    this.scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    pmrem.dispose();

    // 6. Lighting Rig: Golden Hour Sun + Hemisphere Sky Fill
    const sunLight = new THREE.DirectionalLight(0xfff7ed, 2.2);
    sunLight.position.set(60, 90, 80);
    sunLight.castShadow = !this.isSoftwareGl;
    sunLight.shadow.mapSize.width = 1024;
    sunLight.shadow.mapSize.height = 1024;
    sunLight.shadow.camera.near = 10;
    sunLight.shadow.camera.far = 250;
    sunLight.shadow.camera.left = -45;
    sunLight.shadow.camera.right = 45;
    sunLight.shadow.camera.top = 45;
    sunLight.shadow.camera.bottom = -45;
    sunLight.shadow.bias = -0.0005;
    this.scene.add(sunLight);

    const hemiLight = new THREE.HemisphereLight(0x93c5fd, 0xd97706, 0.85);
    this.scene.add(hemiLight);

    // 7. Load Pakistani Bus & Punjab World
    this.busModel = createPakistaniBusModel();
    this.scene.add(this.busModel.root);

    this.environment = createPunjabEnvironment();
    this.scene.add(this.environment.root);

    // 8. Diesel Exhaust Puff Particle System
    this.initExhaustParticles();

    // 9. Resize Listener
    window.addEventListener('resize', this.onWindowResize);

    // 10. Start Animation Loop
    this.startLoop();
  }

  private initExhaustParticles() {
    this.exhaustGeom = new THREE.BufferGeometry();
    const positions = new Float32Array(this.exhaustCount * 3);
    for (let i = 0; i < this.exhaustCount; i++) {
      positions[i * 3] = 0;
      positions[i * 3 + 1] = -100; // start hidden
      positions[i * 3 + 2] = 0;
    }
    this.exhaustGeom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const mat = new THREE.PointsMaterial({
      color: 0x1f2937, // Black diesel soot (Dhuan)
      size: 0.65,
      transparent: true,
      opacity: 0.5,
    });
    this.exhaustParticles = new THREE.Points(this.exhaustGeom, mat);
    this.scene.add(this.exhaustParticles);
  }

  private onWindowResize = () => {
    if (!this.container || !this.renderer || !this.camera) return;
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  };

  public setRoute(route: RouteInfo) {
    this.currentRoute = route;
    this.physics.resetVehicle(35);
    this.isTitleScreen = false;
    soundManager.startEngine();
    this.onNotification?.(`Route: ${route.name}`, route.urduName);
  }

  public setCameraMode(mode: CameraMode) {
    this.cameraMode = mode;
  }

  public getCameraMode(): CameraMode {
    return this.cameraMode;
  }

  public setControls(controls: Partial<GameControls>) {
    Object.assign(this.activeControls, controls);

    if (controls.horn !== undefined && controls.horn !== null) {
      soundManager.playHorn(controls.horn);
    }

    if (controls.toggleDoor) {
      const open = this.physics.toggleDoors();
      this.onNotification?.(
        open ? 'Door Open - Passengers Boarding' : 'Door Closed - Ready to Depart',
        open ? 'دروازہ کھلا ہے' : 'چلو استاد کھچ کے رکھو'
      );
    }

    if (controls.toggleLights) {
      const on = this.physics.toggleHeadlights();
      this.busModel.headlights.forEach(h => (h.intensity = on ? 50 : 0));
    }

    if (controls.toggleRadio) {
      const playing = soundManager.toggleRadio();
      this.physics.radioPlaying = playing;
      this.onNotification?.(
        playing ? 'Cassette Playing: Attaullah Esakhelvi' : 'Cassette Paused',
        playing ? 'کیسٹ آن ہے' : 'کیسٹ بند'
      );
    }
  }

  private startLoop() {
    const tick = () => {
      const rawDt = this.clock.getDelta();
      const dt = Math.min(rawDt, 0.05);

      this.update(dt);
      this.renderer.render(this.scene, this.camera);

      this.frameId = requestAnimationFrame(tick);
    };

    this.frameId = requestAnimationFrame(tick);
  }

  private update(dt: number) {
    if (this.isTitleScreen) {
      // Cinematic live-world showcase orbit around the Dulhan bus
      this.titleCinematicAngle += dt * 0.45;
      const camDist = 13;
      this.camera.position.set(
        Math.sin(this.titleCinematicAngle) * camDist,
        3.5 + Math.sin(this.titleCinematicAngle * 0.5) * 1.2,
        Math.cos(this.titleCinematicAngle) * camDist + 35
      );
      this.camera.lookAt(0, 1.8, 35);

      // Gentle tire and light animation
      this.busModel.underglowLight.intensity = 15 + Math.sin(this.titleCinematicAngle * 4) * 5;
      this.environment.update(dt, 35);
      return;
    }

    // 1. Update Vehicle Physics
    const state = this.physics.update(
      dt,
      this.activeControls,
      this.environment.checkBridgeCollision,
      this.environment.checkPotholeOrMud,
      this.environment.trafficList
    );

    // 2. Update 3D Bus Mesh Transform
    this.busModel.root.position.copy(this.physics.position);
    this.busModel.root.rotation.set(0, this.physics.rotation.y, 0);

    // Suspension body roll and pitch applied to bus cabin
    this.busModel.chassis.rotation.z = this.physics.bodyRoll;
    this.busModel.chassis.rotation.x = this.physics.pitch;
    this.busModel.chassis.position.y = 0.55 + this.physics.verticalJolt;

    // Front Wheels Steering Angle
    this.busModel.frontLeftWheel.rotation.y = this.physics.actualWheelSteer;
    this.busModel.frontRightWheel.rotation.y = this.physics.actualWheelSteer;

    // Wheel Spin
    const wheelRotDelta = (this.physics.speedMs / 0.52) * dt;
    this.busModel.frontLeftWheel.rotation.x += wheelRotDelta;
    this.busModel.frontRightWheel.rotation.x += wheelRotDelta;
    this.busModel.rearLeftWheel.rotation.x += wheelRotDelta;
    this.busModel.rearRightWheel.rotation.x += wheelRotDelta;

    // Cockpit Steering Wheel & Fan Animation
    this.busModel.cockpitSteeringWheel.rotation.z = -this.physics.steeringWheelAngle * 4.2;
    this.busModel.cockpitFanBlades.rotation.x += dt * 25;

    // Swinging Tassel & Bumper Chains Physics
    const tasselTargetRoll = this.physics.bodyRoll * 1.8 + Math.sin(this.clock.elapsedTime * 8) * 0.05;
    this.busModel.hangingTassel.rotation.z = THREE.MathUtils.damp(
      this.busModel.hangingTassel.rotation.z,
      tasselTargetRoll,
      8.0,
      dt
    );

    this.busModel.bumperChains.forEach(chain => {
      chain.rotation.z = this.physics.bodyRoll * 1.2;
      chain.rotation.x = this.physics.pitch * 2.0;
    });

    // Passenger Door Animation (Slides / Rotates open)
    const targetDoorAngle = this.physics.doorsOpen ? Math.PI / 2 : 0;
    this.busModel.passengerDoor.rotation.y = THREE.MathUtils.damp(
      this.busModel.passengerDoor.rotation.y,
      targetDoorAngle,
      8.0,
      dt
    );

    // Brake Lights Glow
    this.busModel.brakeLights.forEach(bl => {
      const mat = bl.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = state.isBraking ? 1.5 : 0.2;
    });

    // 3. Update Environment (Traffic, Water, Smoke)
    this.environment.update(dt, this.physics.position.z);

    // 4. Passenger Adda Detection
    this.checkBusStops();

    // 5. Update Camera
    this.updateCamera(dt);

    // 6. Exhaust Particles Emitter
    this.updateExhaustParticles(dt);

    // 7. Dispatch state to UI
    this.onStateUpdate?.(state);

    // 8. Check Route Finish (reaching Faisalabad Terminal)
    if (this.physics.position.z >= 3050 && !this.isTitleScreen) {
      this.onRouteComplete?.(this.physics.fareEarnedPKR, this.physics.passengerSatisfaction);
    }
  }

  private checkBusStops() {
    const busZ = this.physics.position.z;
    let foundStop = false;

    this.environment.busStops.forEach(stop => {
      if (busZ >= stop.zStart && busZ <= stop.zEnd) {
        foundStop = true;
        this.physics.atStop = true;
        this.physics.currentStopName = stop.name;

        // If stopped with doors open, board passengers
        if (this.physics.doorsOpen && Math.abs(this.physics.speedMs) < 0.8 && !stop.visited) {
          stop.visited = true;
          this.physics.boardPassengers(stop.targetPassengers, 120);
          this.onNotification?.(
            `+${stop.targetPassengers} Passengers Boarded at ${stop.name}!`,
            `سواری سوار ہو گئی ہے - چلو استاد!`
          );
        }
      }
    });

    if (!foundStop) {
      this.physics.atStop = false;
    }
  }

  private updateCamera(dt: number) {
    const busPos = this.physics.position;
    const yaw = this.physics.rotation.y;

    if (this.cameraMode === 'chase') {
      // Third-person trailing camera with dynamic pitch & damping
      const followDist = 11.5 + (Math.abs(this.physics.speedMs) / 33) * 3;
      const height = 4.2 + (Math.abs(this.physics.speedMs) / 33) * 1.2;

      const targetCamX = busPos.x - Math.sin(yaw) * followDist;
      const targetCamZ = busPos.z - Math.cos(yaw) * followDist;
      const targetCamY = busPos.y + height;

      this.camera.position.x = THREE.MathUtils.damp(this.camera.position.x, targetCamX, 6.0, dt);
      this.camera.position.z = THREE.MathUtils.damp(this.camera.position.z, targetCamZ, 6.0, dt);
      this.camera.position.y = THREE.MathUtils.damp(this.camera.position.y, targetCamY, 6.0, dt);

      const lookTarget = new THREE.Vector3(
        busPos.x + Math.sin(yaw) * 6,
        busPos.y + 1.8,
        busPos.z + Math.cos(yaw) * 6
      );
      this.camera.lookAt(lookTarget);

    } else if (this.cameraMode === 'cockpit') {
      // First-person cockpit camera right at driver seat looking through windshield
      const driverEyeOffset = new THREE.Vector3(
        0.55, // driver seat on right side in Pakistan!
        2.2, // eye height
        1.8 // positioned behind wooden wheel
      );
      driverEyeOffset.applyAxisAngle(new THREE.Vector3(0, 1, 0), yaw);

      this.camera.position.copy(busPos).add(driverEyeOffset);

      const forwardLook = new THREE.Vector3(
        Math.sin(yaw) * 30,
        -0.4,
        Math.cos(yaw) * 30
      );
      this.camera.lookAt(this.camera.position.clone().add(forwardLook));

    } else if (this.cameraMode === 'bumper') {
      // Low cinematic front bumper camera
      const bumperOffset = new THREE.Vector3(
        0,
        0.7,
        5.2
      );
      bumperOffset.applyAxisAngle(new THREE.Vector3(0, 1, 0), yaw);
      this.camera.position.copy(busPos).add(bumperOffset);

      const forwardLook = new THREE.Vector3(
        Math.sin(yaw) * 20,
        0.1,
        Math.cos(yaw) * 20
      );
      this.camera.lookAt(this.camera.position.clone().add(forwardLook));
    }
  }

  private updateExhaustParticles(dt: number) {
    if (!this.exhaustGeom) return;
    const pos = this.exhaustGeom.getAttribute('position') as THREE.BufferAttribute;
    const isAccelerating = this.activeControls.throttle;

    // Emit from exhaust pipe
    const emitPos = new THREE.Vector3(-1.1, 0.4, -4.5);
    emitPos.applyAxisAngle(new THREE.Vector3(0, 1, 0), this.physics.rotation.y);
    emitPos.add(this.physics.position);

    for (let i = 0; i < this.exhaustCount; i++) {
      let py = pos.getY(i);
      if (py < 0 || py > 10) {
        if (isAccelerating && Math.random() < 0.4) {
          pos.setXYZ(i, emitPos.x, emitPos.y, emitPos.z);
        }
      } else {
        pos.setY(i, py + dt * 1.5);
        pos.setX(i, pos.getX(i) + (Math.random() - 0.5) * 0.1);
        pos.setZ(i, pos.getZ(i) - dt * (this.physics.speedMs * 0.4));
      }
    }
    pos.needsUpdate = true;
  }

  public dispose() {
    window.removeEventListener('resize', this.onWindowResize);
    cancelAnimationFrame(this.frameId);
    soundManager.dispose();
    this.renderer.dispose();
  }
}
