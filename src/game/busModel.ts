/**
 * Procedural 3D Pakistani "Dulhan" Bedford Rocket Coach
 * Full hierarchical THREE.Group model with Truck Art, Chamakpatti,
 * ornate "Taj" crown luggage rack, hanging brass chains, and detailed cockpit interior.
 */
import * as THREE from 'three';
import {
  createTruckArtBodyTexture,
  createFrontDomeTexture,
  createChamakpattiBumperTexture,
  createCockpitDashboardTexture,
} from './textures';

export interface BusComponents {
  root: THREE.Group;
  chassis: THREE.Group;
  frontLeftWheel: THREE.Group;
  frontRightWheel: THREE.Group;
  rearLeftWheel: THREE.Group;
  rearRightWheel: THREE.Group;
  cabinInterior: THREE.Group;
  cockpitSteeringWheel: THREE.Mesh;
  cockpitFanBlades: THREE.Mesh;
  hangingTassel: THREE.Group;
  bumperChains: THREE.Group[];
  passengerDoor: THREE.Group;
  headlights: THREE.SpotLight[];
  headlightLensMeshes: THREE.Mesh[];
  brakeLights: THREE.Mesh[];
  underglowLight: THREE.PointLight;
  exhaustPipe: THREE.Object3D;
}

export function createPakistaniBusModel(): BusComponents {
  const root = new THREE.Group();
  root.name = 'PakistaniBusRoot';

  // Bus Dimensions
  // Length: 10m, Width: 2.6m, Height: 3.4m (with Taj ~4.2m)
  const busLength = 9.8;
  const busWidth = 2.6;
  const busHeight = 2.7;
  const wheelBase = 5.2; // Distance between front and rear axles
  const trackWidth = 2.1;
  const groundClearance = 0.55;

  // Shared Procedural Textures
  const truckArtBodyTex = createTruckArtBodyTexture();
  const frontDomeTex = createFrontDomeTexture();
  const chamakpattiBumperTex = createChamakpattiBumperTexture();
  const dashboardTex = createCockpitDashboardTexture();

  // Materials with varied roughness and metalness
  const chromeMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    metalness: 0.95,
    roughness: 0.1,
  });

  const brassMat = new THREE.MeshStandardMaterial({
    color: 0xf59e0b,
    metalness: 0.85,
    roughness: 0.25,
  });

  const paintedSteelMat = new THREE.MeshStandardMaterial({
    map: truckArtBodyTex,
    roughness: 0.35,
    metalness: 0.15,
  });

  const frontDomeMat = new THREE.MeshStandardMaterial({
    map: frontDomeTex,
    roughness: 0.3,
    metalness: 0.2,
  });

  const chamakpattiMat = new THREE.MeshStandardMaterial({
    map: chamakpattiBumperTex,
    roughness: 0.2,
    metalness: 0.3,
    emissive: 0x221100,
    emissiveIntensity: 0.3,
  });

  const glassMat = new THREE.MeshPhysicalMaterial({
    color: 0x88ccee,
    transparent: true,
    opacity: 0.45,
    roughness: 0.1,
    metalness: 0.1,
    transmission: 0.6,
    ior: 1.5,
    depthWrite: false,
  });

  const darkRubberMat = new THREE.MeshStandardMaterial({
    color: 0x18181b,
    roughness: 0.9,
    metalness: 0.05,
  });

  const chassisFrameMat = new THREE.MeshStandardMaterial({
    color: 0x27272a,
    roughness: 0.8,
    metalness: 0.6,
  });

  // 1. Chassis Sub-assembly
  const chassis = new THREE.Group();
  chassis.position.y = groundClearance;
  root.add(chassis);

  // Heavy steel longitudinal beam rails
  const frameGeometry = new THREE.BoxGeometry(busLength * 0.92, 0.25, 1.2);
  const frameMesh = new THREE.Mesh(frameGeometry, chassisFrameMat);
  frameMesh.position.set(0, 0.15, 0);
  frameMesh.castShadow = true;
  chassis.add(frameMesh);

  // Rear differential axle casing
  const axleGeom = new THREE.CylinderGeometry(0.12, 0.12, trackWidth, 16);
  axleGeom.rotateX(Math.PI / 2);
  const rearAxle = new THREE.Mesh(axleGeom, chassisFrameMat);
  rearAxle.position.set(-wheelBase / 2, 0, 0);
  chassis.add(rearAxle);

  const diffSphere = new THREE.Mesh(new THREE.SphereGeometry(0.28, 12, 12), chassisFrameMat);
  diffSphere.position.set(-wheelBase / 2, 0, 0);
  chassis.add(diffSphere);

  // Front axle
  const frontAxle = new THREE.Mesh(axleGeom, chassisFrameMat);
  frontAxle.position.set(wheelBase / 2, 0, 0);
  chassis.add(frontAxle);

  // 2. Main Bus Cabin Body
  const bodyGroup = new THREE.Group();
  bodyGroup.position.set(0, 0.3, 0);
  chassis.add(bodyGroup);

  // Main rectangular passenger body
  const bodyGeom = new THREE.BoxGeometry(busLength * 0.72, busHeight, busWidth);
  const bodyMesh = new THREE.Mesh(bodyGeom, paintedSteelMat);
  bodyMesh.position.set(-0.9, busHeight / 2, 0);
  bodyMesh.castShadow = true;
  bodyMesh.receiveShadow = true;
  bodyGroup.add(bodyMesh);

  // Rocket Nose / Bedford Bonnet (curved front engine hood)
  const hoodGeom = new THREE.BoxGeometry(busLength * 0.22, busHeight * 0.58, busWidth * 0.88);
  const hoodMesh = new THREE.Mesh(hoodGeom, paintedSteelMat);
  hoodMesh.position.set(busLength * 0.35, busHeight * 0.3, 0);
  hoodMesh.castShadow = true;
  bodyGroup.add(hoodMesh);

  // Front curved nose dome cap (quintessential Pakistani coach rounded dome)
  const domeGeom = new THREE.SphereGeometry(
    busWidth * 0.44,
    20,
    16,
    0,
    Math.PI * 2,
    0,
    Math.PI * 0.5
  );
  const domeMesh = new THREE.Mesh(domeGeom, frontDomeMat);
  domeMesh.rotation.z = -Math.PI / 2;
  domeMesh.position.set(busLength * 0.45, busHeight * 0.3, 0);
  domeMesh.scale.set(0.65, 0.95, 0.95);
  domeMesh.castShadow = true;
  bodyGroup.add(domeMesh);

  // Over-windshield upper ornamental arch / sun visor
  const visorGeom = new THREE.BoxGeometry(0.3, 0.4, busWidth * 0.98);
  const visorMesh = new THREE.Mesh(visorGeom, chamakpattiMat);
  visorMesh.position.set(busLength * 0.28, busHeight * 0.9, 0);
  visorMesh.rotation.z = -0.2;
  bodyGroup.add(visorMesh);

  // Windshield glass
  const windshieldGeom = new THREE.BoxGeometry(0.08, busHeight * 0.42, busWidth * 0.92);
  const windshieldMesh = new THREE.Mesh(windshieldGeom, glassMat);
  windshieldMesh.position.set(busLength * 0.26, busHeight * 0.7, 0);
  windshieldMesh.rotation.z = -0.16;
  bodyGroup.add(windshieldMesh);

  // Heavy Front Chrome Grille
  const grilleGeom = new THREE.BoxGeometry(0.12, busHeight * 0.4, busWidth * 0.65);
  const grilleMesh = new THREE.Mesh(grilleGeom, chromeMat);
  grilleMesh.position.set(busLength * 0.46, busHeight * 0.28, 0);
  bodyGroup.add(grilleMesh);

  // Iconic Horizontal Chrome Grille Slats
  for (let i = 0; i < 6; i++) {
    const slatGeom = new THREE.BoxGeometry(0.14, 0.04, busWidth * 0.62);
    const slatMesh = new THREE.Mesh(slatGeom, chromeMat);
    slatMesh.position.set(busLength * 0.462, busHeight * 0.15 + i * 0.055, 0);
    bodyGroup.add(slatMesh);
  }

  // Dual Horns mounted on front grille (Pakistani WAPDA musical air horns)
  for (let s of [-0.22, 0.22]) {
    const hornGeom = new THREE.ConeGeometry(0.09, 0.45, 16);
    hornGeom.rotateZ(-Math.PI / 2);
    const hornMesh = new THREE.Mesh(hornGeom, brassMat);
    hornMesh.position.set(busLength * 0.46, busHeight * 0.52, s);
    bodyGroup.add(hornMesh);
  }

  // 3. The "Taj" (The Majestic Pakistani Crown Luggage Carrier on Roof)
  const tajGroup = new THREE.Group();
  tajGroup.position.set(-0.8, busHeight + 0.05, 0);
  bodyGroup.add(tajGroup);

  // Perimeter steel guardrails with ornate spires
  const tajLength = busLength * 0.68;
  const tajWidth = busWidth * 0.94;
  const tajHeight = 0.75;

  const rackFrameGeom = new THREE.BoxGeometry(tajLength, 0.08, tajWidth);
  const rackFrame = new THREE.Mesh(rackFrameGeom, brassMat);
  tajGroup.add(rackFrame);

  // Vertical brass balusters around the crown
  for (let x = -tajLength / 2; x <= tajLength / 2; x += 0.45) {
    for (let z of [-tajWidth / 2, tajWidth / 2]) {
      const baluster = new THREE.Mesh(
        new THREE.CylinderGeometry(0.02, 0.02, tajHeight, 8),
        brassMat
      );
      baluster.position.set(x, tajHeight / 2, z);
      tajGroup.add(baluster);

      // Pointed brass spire crown on top
      const spire = new THREE.Mesh(
        new THREE.ConeGeometry(0.04, 0.12, 8),
        brassMat
      );
      spire.position.set(x, tajHeight + 0.06, z);
      tajGroup.add(spire);
    }
  }

  // Luggage bundled under heavy colorful tarpaulin sheet (green & orange tarpaulin)
  const tarpGeom = new THREE.BoxGeometry(tajLength * 0.85, tajHeight * 0.9, tajWidth * 0.85);
  const tarpMat = new THREE.MeshStandardMaterial({
    color: 0x15803d, // Dark emerald green tarpaulin
    roughness: 0.85,
    metalness: 0.1,
  });
  const tarpMesh = new THREE.Mesh(tarpGeom, tarpMat);
  tarpMesh.position.set(0, tajHeight * 0.48, 0);
  tarpMesh.castShadow = true;
  tajGroup.add(tarpMesh);

  // Spare heavy truck tires mounted on the Taj roof rack
  for (let z of [-0.55, 0.55]) {
    const spareTire = new THREE.Mesh(
      new THREE.TorusGeometry(0.42, 0.18, 12, 24),
      darkRubberMat
    );
    spareTire.rotation.x = Math.PI / 2;
    spareTire.position.set(-tajLength * 0.32, tajHeight * 0.85, z);
    spareTire.castShadow = true;
    tajGroup.add(spareTire);
  }

  // 4. Heavy Front & Rear Steel Bumpers with Chamakpatti Chevron Tape
  const frontBumperGeom = new THREE.BoxGeometry(0.35, 0.4, busWidth * 1.05);
  const frontBumper = new THREE.Mesh(frontBumperGeom, chamakpattiMat);
  frontBumper.position.set(busLength * 0.48, 0.1, 0);
  frontBumper.castShadow = true;
  bodyGroup.add(frontBumper);

  const rearBumperGeom = new THREE.BoxGeometry(0.35, 0.4, busWidth * 1.05);
  const rearBumper = new THREE.Mesh(rearBumperGeom, chamakpattiMat);
  rearBumper.position.set(-busLength * 0.46, 0.1, 0);
  rearBumper.castShadow = true;
  bodyGroup.add(rearBumper);

  // Hanging Brass Chains & Ghungroos under the front and rear bumpers
  const bumperChains: THREE.Group[] = [];
  const createBumperChains = (parentBumper: THREE.Mesh, zCount: number) => {
    const chainGroup = new THREE.Group();
    chainGroup.position.set(0, -0.18, 0);
    parentBumper.add(chainGroup);
    bumperChains.push(chainGroup);

    for (let i = 0; i < zCount; i++) {
      const zOffset = -busWidth * 0.45 + (i / (zCount - 1)) * (busWidth * 0.9);
      const chainLink = new THREE.Mesh(
        new THREE.CylinderGeometry(0.015, 0.015, 0.35, 6),
        brassMat
      );
      chainLink.position.set(0, -0.16, zOffset);
      chainGroup.add(chainLink);

      // Hanging brass bell / ghungroo at tip
      const bell = new THREE.Mesh(
        new THREE.SphereGeometry(0.035, 8, 8),
        brassMat
      );
      bell.position.set(0, -0.34, zOffset);
      chainGroup.add(bell);
    }
  };

  createBumperChains(frontBumper, 11);
  createBumperChains(rearBumper, 11);

  // 5. Wheels (Dual Rear Wheels & Steerable Front Wheels)
  const createWheelAssembly = (isDual: boolean): THREE.Group => {
    const wheelAssembly = new THREE.Group();
    const tireRadius = 0.52;
    const tireWidth = 0.32;

    const createSingleTire = (offsetZ: number) => {
      const tireMesh = new THREE.Mesh(
        new THREE.CylinderGeometry(tireRadius, tireRadius, tireWidth, 24),
        darkRubberMat
      );
      tireMesh.rotation.x = Math.PI / 2;
      tireMesh.position.z = offsetZ;
      tireMesh.castShadow = true;

      // Chrome rim with lug nuts
      const rimMesh = new THREE.Mesh(
        new THREE.CylinderGeometry(tireRadius * 0.58, tireRadius * 0.58, tireWidth * 1.05, 16),
        chromeMat
      );
      rimMesh.rotation.x = Math.PI / 2;
      rimMesh.position.z = offsetZ;
      tireMesh.add(rimMesh);

      // Pointed Pakistani chrome wheel cap (hub spike)
      const spikeMesh = new THREE.Mesh(
        new THREE.ConeGeometry(0.12, 0.22, 12),
        brassMat
      );
      spikeMesh.rotation.z = offsetZ > 0 ? -Math.PI / 2 : Math.PI / 2;
      spikeMesh.position.z = offsetZ > 0 ? offsetZ + tireWidth * 0.6 : offsetZ - tireWidth * 0.6;
      tireMesh.add(spikeMesh);

      return tireMesh;
    };

    if (isDual) {
      wheelAssembly.add(createSingleTire(-tireWidth * 0.55));
      wheelAssembly.add(createSingleTire(tireWidth * 0.55));
    } else {
      wheelAssembly.add(createSingleTire(0));
    }

    return wheelAssembly;
  };

  const frontLeftWheel = createWheelAssembly(false);
  frontLeftWheel.position.set(wheelBase / 2, 0, trackWidth / 2);
  chassis.add(frontLeftWheel);

  const frontRightWheel = createWheelAssembly(false);
  frontRightWheel.position.set(wheelBase / 2, 0, -trackWidth / 2);
  chassis.add(frontRightWheel);

  const rearLeftWheel = createWheelAssembly(true);
  rearLeftWheel.position.set(-wheelBase / 2, 0, trackWidth / 2);
  chassis.add(rearLeftWheel);

  const rearRightWheel = createWheelAssembly(true);
  rearRightWheel.position.set(-wheelBase / 2, 0, -trackWidth / 2);
  chassis.add(rearRightWheel);

  // 6. Cockpit Interior (For Cockpit Camera View)
  const cabinInterior = new THREE.Group();
  cabinInterior.position.set(busLength * 0.15, busHeight * 0.55, 0);
  bodyGroup.add(cabinInterior);

  // Wooden Dashboard Shelf
  const dashMat = new THREE.MeshStandardMaterial({
    map: dashboardTex,
    roughness: 0.4,
    metalness: 0.2,
  });
  const dashMesh = new THREE.Mesh(
    new THREE.BoxGeometry(0.7, 0.45, busWidth * 0.88),
    dashMat
  );
  dashMesh.position.set(0.6, -0.15, 0);
  cabinInterior.add(dashMesh);

  // Steering Column & 900-degree Steering Wheel
  const steeringColumn = new THREE.Mesh(
    new THREE.CylinderGeometry(0.04, 0.04, 0.5, 12),
    chassisFrameMat
  );
  steeringColumn.position.set(0.45, -0.05, 0.52);
  steeringColumn.rotation.z = -0.55;
  cabinInterior.add(steeringColumn);

  // Large Pakistani bus steering wheel with velvet green rim
  const wheelRimMat = new THREE.MeshStandardMaterial({
    color: 0x065f46, // Velvet emerald green cover
    roughness: 0.7,
  });
  const cockpitSteeringWheel = new THREE.Mesh(
    new THREE.TorusGeometry(0.24, 0.03, 12, 24),
    wheelRimMat
  );
  cockpitSteeringWheel.position.set(0.35, 0.12, 0.52);
  cockpitSteeringWheel.rotation.y = Math.PI / 2;
  cockpitSteeringWheel.rotation.x = -0.55;
  cabinInterior.add(cockpitSteeringWheel);

  // 3-Spoke Chrome Hub for steering wheel
  const spokeGeom = new THREE.BoxGeometry(0.03, 0.02, 0.45);
  const spokeMesh = new THREE.Mesh(spokeGeom, chromeMat);
  cockpitSteeringWheel.add(spokeMesh);

  // 12V Oscillating Mini Fan mounted on dash
  const fanStand = new THREE.Mesh(
    new THREE.CylinderGeometry(0.02, 0.02, 0.18, 8),
    chromeMat
  );
  fanStand.position.set(0.55, 0.15, 0.15);
  cabinInterior.add(fanStand);

  const fanCage = new THREE.Mesh(
    new THREE.CylinderGeometry(0.09, 0.09, 0.04, 16),
    chromeMat
  );
  fanCage.rotation.z = Math.PI / 2;
  fanCage.position.set(0.55, 0.26, 0.15);
  cabinInterior.add(fanCage);

  const cockpitFanBlades = new THREE.Mesh(
    new THREE.BoxGeometry(0.01, 0.15, 0.03),
    brassMat
  );
  fanCage.add(cockpitFanBlades);

  // Rearview Mirror with Hanging Latkan Tassel (swings with vehicle G-force)
  const mirrorMesh = new THREE.Mesh(
    new THREE.BoxGeometry(0.04, 0.1, 0.28),
    chromeMat
  );
  mirrorMesh.position.set(0.65, 0.65, 0);
  cabinInterior.add(mirrorMesh);

  const hangingTassel = new THREE.Group();
  hangingTassel.position.set(0.65, 0.58, 0);
  cabinInterior.add(hangingTassel);

  const stringMesh = new THREE.Mesh(
    new THREE.CylinderGeometry(0.005, 0.005, 0.14, 6),
    brassMat
  );
  stringMesh.position.y = -0.07;
  hangingTassel.add(stringMesh);

  // Green Latkan Fluff Ball
  const fluffBall = new THREE.Mesh(
    new THREE.SphereGeometry(0.035, 10, 10),
    new THREE.MeshStandardMaterial({ color: 0x16a34a, roughness: 0.9 })
  );
  fluffBall.position.y = -0.16;
  hangingTassel.add(fluffBall);

  // 7. Interactive Passenger Door (Opens at bus stops for boarding)
  const passengerDoor = new THREE.Group();
  passengerDoor.position.set(busLength * 0.18, busHeight * 0.38, busWidth * 0.505);
  bodyGroup.add(passengerDoor);

  const doorLeaf = new THREE.Mesh(
    new THREE.BoxGeometry(0.85, busHeight * 0.72, 0.06),
    paintedSteelMat
  );
  doorLeaf.position.set(-0.42, 0, 0);
  passengerDoor.add(doorLeaf);

  // 8. Lights: Headlights, Brake Lights, and Chamakpatti Underglow
  const headlights: THREE.SpotLight[] = [];
  const headlightLensMeshes: THREE.Mesh[] = [];

  const lensMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    emissive: 0xfffaed,
    emissiveIntensity: 0.8,
    roughness: 0.1,
  });

  for (let z of [-0.65, 0.65]) {
    // Quad round headlights
    const lens = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.05, 16), lensMat);
    lens.rotation.z = Math.PI / 2;
    lens.position.set(busLength * 0.485, busHeight * 0.28, z);
    bodyGroup.add(lens);
    headlightLensMeshes.push(lens);

    const spot = new THREE.SpotLight(0xfff4d6, 50, 60, Math.PI / 5, 0.4, 1.2);
    spot.position.set(busLength * 0.52, busHeight * 0.28, z);
    spot.target.position.set(busLength * 0.52 + 30, 0, z);
    root.add(spot.target);
    bodyGroup.add(spot);
    headlights.push(spot);
  }

  // Brake Lights (Rear)
  const brakeLights: THREE.Mesh[] = [];
  const brakeLightMat = new THREE.MeshStandardMaterial({
    color: 0xef4444,
    emissive: 0x7f1d1d,
    emissiveIntensity: 0.3,
  });

  for (let z of [-0.9, 0.9]) {
    const bLight = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.05, 16), brakeLightMat);
    bLight.rotation.z = Math.PI / 2;
    bLight.position.set(-busLength * 0.465, busHeight * 0.3, z);
    bodyGroup.add(bLight);
    brakeLights.push(bLight);
  }

  // Neon Underglow Light (Vibrant cyan/green ground glow)
  const underglowLight = new THREE.PointLight(0x06b6d4, 15, 6, 1.5);
  underglowLight.position.set(0, 0.2, 0);
  chassis.add(underglowLight);

  // Roof LED Marker Dots (Red, Amber, Green on top of windshield)
  for (let i = 0; i < 9; i++) {
    const ledColor = i % 2 === 0 ? 0xf59e0b : 0x10b981;
    const marker = new THREE.Mesh(
      new THREE.SphereGeometry(0.04, 8, 8),
      new THREE.MeshStandardMaterial({ color: ledColor, emissive: ledColor, emissiveIntensity: 1 })
    );
    const zOffset = -busWidth * 0.4 + (i / 8) * (busWidth * 0.8);
    marker.position.set(busLength * 0.27, busHeight * 0.92, zOffset);
    bodyGroup.add(marker);
  }

  // Exhaust pipe at rear left
  const exhaustPipe = new THREE.Object3D();
  exhaustPipe.position.set(-busLength * 0.44, 0.2, -busWidth * 0.42);
  chassis.add(exhaustPipe);

  return {
    root,
    chassis,
    frontLeftWheel,
    frontRightWheel,
    rearLeftWheel,
    rearRightWheel,
    cabinInterior,
    cockpitSteeringWheel,
    cockpitFanBlades,
    hangingTassel,
    bumperChains,
    passengerDoor,
    headlights,
    headlightLensMeshes,
    brakeLights,
    underglowLight,
    exhaustPipe,
  };
}
