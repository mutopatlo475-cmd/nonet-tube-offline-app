/**
 * 3D Punjab, Pakistan Environment & Extreme Road System
 * Features: GT Road (N-5), Nehr di Patri (Canal Road), British-era Brick Canal Bridge,
 * Sarson (Mustard) Fields, Peter-Engine Tubewells, Brick Kilns (Bhattas),
 * Roadside Dhabas with Charpais, NHA Signage, and Extreme Traffic Hazards.
 */
import * as THREE from 'three';
import {
  createRoadAsphaltTexture,
  createSarsonFieldTexture,
  createNHASignboardTexture,
  createDhabaSignTexture,
} from './textures';

export interface TrafficVehicle {
  mesh: THREE.Group;
  type: 'sugarcane_tractor' | 'qingqi' | 'bedford_truck' | 'buffalo';
  x: number;
  z: number;
  targetZ: number;
  speed: number;
  width: number;
  length: number;
  swayAngle: number;
  laneX: number;
}

export interface BusStopArea {
  id: string;
  name: string;
  urduName: string;
  zStart: number;
  zEnd: number;
  xPos: number;
  targetPassengers: number;
  visited: boolean;
  isTerminal: boolean;
}

export interface EnvironmentWorld {
  root: THREE.Group;
  trafficList: TrafficVehicle[];
  busStops: BusStopArea[];
  smokeParticles: THREE.Points;
  waterMesh: THREE.Mesh;
  checkBridgeCollision: (x: number, z: number) => { onBridge: boolean; fallenInWater: boolean };
  checkPotholeOrMud: (x: number, z: number) => { isOffroad: boolean; isPothole: boolean; slipFactor: number };
  update: (delta: number, busZ: number) => void;
}

export function createPunjabEnvironment(): EnvironmentWorld {
  const root = new THREE.Group();
  root.name = 'PunjabEnvironmentRoot';

  const trafficList: TrafficVehicle[] = [];
  const busStops: BusStopArea[] = [];

  // World length: 3200 meters of continuous Punjab road corridors
  const roadLength = 3200;

  // 1. Textures & Materials
  const roadTex = createRoadAsphaltTexture();
  const sarsonTex = createSarsonFieldTexture();

  const roadMaterial = new THREE.MeshStandardMaterial({
    map: roadTex,
    roughness: 0.85,
    metalness: 0.1,
  });

  const sarsonMaterial = new THREE.MeshStandardMaterial({
    map: sarsonTex,
    roughness: 0.7,
  });

  const soilMaterial = new THREE.MeshStandardMaterial({
    color: 0x92400e, // Punjab alluvial rich clay soil
    roughness: 0.95,
  });

  const waterMaterial = new THREE.MeshStandardMaterial({
    color: 0x0284c7, // Canal irrigation water
    roughness: 0.15,
    metalness: 0.6,
  });

  const brickMaterial = new THREE.MeshStandardMaterial({
    color: 0xb91c1c, // Punjabi red clay kiln brick
    roughness: 0.9,
  });

  const foliageMaterial = new THREE.MeshStandardMaterial({
    color: 0x166534, // Eucalyptus and neem dark leaves
    roughness: 0.8,
  });

  const woodMaterial = new THREE.MeshStandardMaterial({
    color: 0x78350f, // Charpayi wood
    roughness: 0.75,
  });

  // 2. Continuous Ground & Agricultural Terrain
  const terrainGeom = new THREE.PlaneGeometry(300, roadLength, 4, 32);
  terrainGeom.rotateX(-Math.PI / 2);
  const terrainMesh = new THREE.Mesh(terrainGeom, soilMaterial);
  terrainMesh.position.set(0, -0.05, roadLength / 2 - 100);
  terrainMesh.receiveShadow = true;
  root.add(terrainMesh);

  // Vast Sarson (Yellow Mustard) Fields flanking both sides
  const fieldLeft = new THREE.Mesh(new THREE.PlaneGeometry(120, roadLength), sarsonMaterial);
  fieldLeft.rotation.x = -Math.PI / 2;
  fieldLeft.position.set(-75, 0.05, roadLength / 2 - 100);
  root.add(fieldLeft);

  const fieldRight = new THREE.Mesh(new THREE.PlaneGeometry(120, roadLength), sarsonMaterial);
  fieldRight.rotation.x = -Math.PI / 2;
  fieldRight.position.set(75, 0.05, roadLength / 2 - 100);
  root.add(fieldRight);

  // 3. Road Sectors
  // Segment A: GT Road (N-5 Highway) [0 to 1100m] - Wide 4-lane road (Width: 16m)
  const gtRoadGeom = new THREE.PlaneGeometry(16, 1100);
  gtRoadGeom.rotateX(-Math.PI / 2);
  const gtRoad = new THREE.Mesh(gtRoadGeom, roadMaterial);
  gtRoad.position.set(0, 0.02, 550);
  gtRoad.receiveShadow = true;
  root.add(gtRoad);

  // Concrete Jersey barrier dividers on GT Road
  const barrierGeom = new THREE.BoxGeometry(0.6, 0.8, 1000);
  const barrierMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.9 });
  const barrier = new THREE.Mesh(barrierGeom, barrierMat);
  barrier.position.set(0, 0.4, 550);
  root.add(barrier);

  // Segment B: Canal Road ("Nehr di Patri") [1100m to 2100m]
  // Runs parallel to a deep irrigation canal on the left (x = -8m)
  const canalRoadGeom = new THREE.PlaneGeometry(9.5, 1000);
  canalRoadGeom.rotateX(-Math.PI / 2);
  const canalRoad = new THREE.Mesh(canalRoadGeom, roadMaterial);
  canalRoad.position.set(2, 0.02, 1600);
  root.add(canalRoad);

  // The Canal Waterway (Length 1000m, Width 14m, Depth -1.8m)
  const canalWaterGeom = new THREE.PlaneGeometry(14, 1000);
  canalWaterGeom.rotateX(-Math.PI / 2);
  const waterMesh = new THREE.Mesh(canalWaterGeom, waterMaterial);
  waterMesh.position.set(-11, -0.6, 1600);
  root.add(waterMesh);

  // Canal embankments (steep dirt slopes)
  const bankGeom = new THREE.BoxGeometry(2, 1.2, 1000);
  const bankMesh = new THREE.Mesh(bankGeom, soilMaterial);
  bankMesh.position.set(-3.2, -0.2, 1600);
  root.add(bankMesh);

  // Segment C: The Treacherous British-Era Brick Canal Bridge ("Pulli") [2100m to 2260m]
  // Extreme single-lane arched brick bridge over canal crossover! Width only 4.8m!
  const bridgeLength = 160;
  const bridgeWidth = 4.8;
  const bridgeGroup = new THREE.Group();
  bridgeGroup.position.set(0, 0.4, 2180);
  root.add(bridgeGroup);

  const bridgeDeck = new THREE.Mesh(
    new THREE.BoxGeometry(bridgeWidth, 0.8, bridgeLength),
    brickMaterial
  );
  bridgeGroup.add(bridgeDeck);

  // Brick Arched Parapet Guard Walls along the bridge
  for (let z = -bridgeLength / 2; z <= bridgeLength / 2; z += 4) {
    for (let side of [-bridgeWidth / 2 - 0.2, bridgeWidth / 2 + 0.2]) {
      const pier = new THREE.Mesh(
        new THREE.BoxGeometry(0.4, 1.1, 3.8),
        brickMaterial
      );
      pier.position.set(side, 0.8, z);
      bridgeGroup.add(pier);

      // Ornate brick cap
      const cap = new THREE.Mesh(
        new THREE.CylinderGeometry(0.25, 0.25, 0.45, 8),
        brickMaterial
      );
      cap.position.set(side, 1.45, z);
      bridgeGroup.add(cap);
    }
  }

  // Canal water under the bridge
  const underBridgeWater = new THREE.Mesh(new THREE.PlaneGeometry(40, 200), waterMaterial);
  underBridgeWater.rotation.x = -Math.PI / 2;
  underBridgeWater.position.set(0, -1.2, 2180);
  root.add(underBridgeWater);

  // Segment D: Rural Punjab Agricultural Bypass [2260m to 3200m]
  // Rutted road with potholes, mud shoulders, leading to Faisalabad Terminal
  const ruralRoadGeom = new THREE.PlaneGeometry(11, 940);
  ruralRoadGeom.rotateX(-Math.PI / 2);
  const ruralRoad = new THREE.Mesh(ruralRoadGeom, roadMaterial);
  ruralRoad.position.set(0, 0.02, 2730);
  root.add(ruralRoad);

  // 4. Cultural Landmark Assets: Tubewells (Peter Engines) & Brick Kilns (Bhattas)
  // Tubewell 1 at z = 480m
  const createTubewell = (x: number, z: number) => {
    const twGroup = new THREE.Group();
    twGroup.position.set(x, 0, z);

    // Brick pump house shed
    const shed = new THREE.Mesh(new THREE.BoxGeometry(4.5, 3.2, 4.5), brickMaterial);
    shed.position.y = 1.6;
    twGroup.add(shed);

    // Corrugated tin roof
    const roof = new THREE.Mesh(
      new THREE.ConeGeometry(3.6, 1.2, 4),
      new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.6 })
    );
    roof.rotation.y = Math.PI / 4;
    roof.position.y = 3.6;
    twGroup.add(roof);

    // Heavy Peter diesel engine flywheel outside
    const flywheel = new THREE.Mesh(
      new THREE.TorusGeometry(0.65, 0.12, 8, 16),
      new THREE.MeshStandardMaterial({ color: 0x059669, metalness: 0.7 })
    );
    flywheel.rotation.y = Math.PI / 2;
    flywheel.position.set(2.4, 0.8, 0);
    twGroup.add(flywheel);

    // Concrete water tank discharging into irrigation drain
    const tank = new THREE.Mesh(
      new THREE.BoxGeometry(3, 1.2, 6),
      new THREE.MeshStandardMaterial({ color: 0x64748b })
    );
    tank.position.set(4.5, 0.6, 0);
    twGroup.add(tank);

    const twWater = new THREE.Mesh(new THREE.PlaneGeometry(2.6, 5.6), waterMaterial);
    twWater.rotation.x = -Math.PI / 2;
    twWater.position.set(4.5, 1.1, 0);
    twGroup.add(twWater);

    root.add(twGroup);
  };

  createTubewell(18, 480);
  createTubewell(16, 2550);

  // Brick Kilns ("Bhattas") with towering round chimneys puffing smoke
  const createBrickKiln = (x: number, z: number) => {
    const kilnGroup = new THREE.Group();
    kilnGroup.position.set(x, 0, z);

    // Oval trench kiln body
    const base = new THREE.Mesh(new THREE.CylinderGeometry(18, 22, 3.5, 16), brickMaterial);
    base.position.y = 1.75;
    kilnGroup.add(base);

    // Towering 30-meter red brick chimney
    const chimney = new THREE.Mesh(new THREE.CylinderGeometry(1.6, 3.2, 28, 16), brickMaterial);
    chimney.position.y = 15.5;
    kilnGroup.add(chimney);

    // Stacks of unbaked clay bricks drying in the sun
    for (let bx = -12; bx <= 12; bx += 3) {
      const stack = new THREE.Mesh(new THREE.BoxGeometry(2, 1.2, 4), brickMaterial);
      stack.position.set(bx, 0.6, 16);
      kilnGroup.add(stack);
    }

    root.add(kilnGroup);
  };

  createBrickKiln(-65, 850);
  createBrickKiln(75, 2350);

  // 5. Smoke Particles from Kiln Chimneys
  const smokeCount = 120;
  const smokeGeom = new THREE.BufferGeometry();
  const smokePositions = new Float32Array(smokeCount * 3);
  for (let i = 0; i < smokeCount; i++) {
    smokePositions[i * 3] = -65 + (Math.random() - 0.5) * 4;
    smokePositions[i * 3 + 1] = 30 + Math.random() * 20;
    smokePositions[i * 3 + 2] = 850 + (Math.random() - 0.5) * 4;
  }
  smokeGeom.setAttribute('position', new THREE.BufferAttribute(smokePositions, 3));
  const smokeMat = new THREE.PointsMaterial({
    color: 0x475569,
    size: 4.5,
    transparent: true,
    opacity: 0.45,
  });
  const smokeParticles = new THREE.Points(smokeGeom, smokeMat);
  root.add(smokeParticles);

  // 6. Roadside Dhabas & Truck Hotels with Charpais (Day and Night life of GT Road)
  const createDhaba = (x: number, z: number, nameUrdu: string, nameEng: string) => {
    const dhabaGroup = new THREE.Group();
    dhabaGroup.position.set(x, 0, z);

    // Open tin canopy
    const canopy = new THREE.Mesh(
      new THREE.BoxGeometry(14, 0.3, 10),
      new THREE.MeshStandardMaterial({ color: 0x0284c7, metalness: 0.4 })
    );
    canopy.position.set(0, 4.2, 0);
    dhabaGroup.add(canopy);

    // Wooden canopy pillars
    for (let cx of [-6, 6]) {
      for (let cz of [-4, 4]) {
        const pillar = new THREE.Mesh(
          new THREE.CylinderGeometry(0.12, 0.12, 4.2, 8),
          woodMaterial
        );
        pillar.position.set(cx, 2.1, cz);
        dhabaGroup.add(pillar);
      }
    }

    // Roadside Charpais (Woven Punjabi cots)
    const charpaiGeom = new THREE.BoxGeometry(2.4, 0.5, 1.3);
    for (let i = 0; i < 4; i++) {
      const charpai = new THREE.Mesh(charpaiGeom, woodMaterial);
      charpai.position.set(-4 + i * 2.8, 0.25, 0);
      dhabaGroup.add(charpai);
    }

    // Dhaba Neon Signboard
    const signTex = createDhabaSignTexture(nameUrdu, nameEng);
    const signMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(7, 3.5),
      new THREE.MeshStandardMaterial({ map: signTex, roughness: 0.2 })
    );
    signMesh.position.set(0, 5.2, -4.5);
    dhabaGroup.add(signMesh);

    // Warm lantern light
    const lantern = new THREE.PointLight(0xf59e0b, 20, 18);
    lantern.position.set(0, 3.8, 0);
    dhabaGroup.add(lantern);

    root.add(dhabaGroup);
  };

  createDhaba(18, 320, 'بسم اللہ ہوٹل و کڑک چائے', 'BISMILLAH TRUCK DHABA');
  createDhaba(16, 1750, 'المدینہ ہوٹل نہر کنارہ', 'AL-MADINA CANAL DHABA');

  // 7. NHA Provincial Overhead Signboards
  const createNHAGantry = (
    z: number,
    urduText: string,
    engText: string,
    distText: string
  ) => {
    const gantry = new THREE.Group();
    gantry.position.set(0, 0, z);

    // Steel truss columns
    const trussMat = new THREE.MeshStandardMaterial({ color: 0x64748b, metalness: 0.8 });
    const colLeft = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.25, 7.5, 8), trussMat);
    colLeft.position.set(-10, 3.75, 0);
    gantry.add(colLeft);

    const colRight = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.25, 7.5, 8), trussMat);
    colRight.position.set(10, 3.75, 0);
    gantry.add(colRight);

    // Cross beam
    const beam = new THREE.Mesh(new THREE.BoxGeometry(20.5, 0.4, 0.4), trussMat);
    beam.position.set(0, 7.2, 0);
    gantry.add(beam);

    // Large NHA Green Sign
    const signTex = createNHASignboardTexture(urduText, engText, distText);
    const signBoard = new THREE.Mesh(
      new THREE.BoxGeometry(8, 3.8, 0.2),
      new THREE.MeshStandardMaterial({ map: signTex, roughness: 0.3 })
    );
    signBoard.position.set(0, 5.6, 0);
    gantry.add(signBoard);

    root.add(gantry);
  };

  createNHAGantry(150, 'لاہور جنتا روڈ - گوجرانوالہ', 'N-5 LAHORE - GUJRANWALA', 'GUJRANWALA 42 KM');
  createNHAGantry(1120, 'خطرناک نہر روڈ - احتیاط کریں', 'EXTREME CANAL BYPASS', 'NARROW ROAD 15 KM');
  createNHAGantry(2280, 'فیصل آباد جنرل بس اسٹینڈ', 'FAISALABAD TERMINAL', 'TERMINAL 9 KM');

  // 8. Eucalyptus & Neem Trees lining the road (Instanced for 60fps)
  const treeCount = 140;
  const trunkGeom = new THREE.CylinderGeometry(0.25, 0.45, 6, 8);
  const foliageGeom = new THREE.ConeGeometry(2.4, 6, 8);

  const trunkMesh = new THREE.InstancedMesh(trunkGeom, woodMaterial, treeCount);
  const foliageMesh = new THREE.InstancedMesh(foliageGeom, foliageMaterial, treeCount);

  const dummy = new THREE.Object3D();
  for (let i = 0; i < treeCount; i++) {
    const side = i % 2 === 0 ? 1 : -1;
    const treeZ = 80 + (i / treeCount) * (roadLength - 200);
    const treeX = side * (12 + Math.random() * 8);

    dummy.position.set(treeX, 3, treeZ);
    dummy.scale.set(1, 1 + Math.random() * 0.4, 1);
    dummy.updateMatrix();
    trunkMesh.setMatrixAt(i, dummy.matrix);

    dummy.position.set(treeX, 7, treeZ);
    dummy.updateMatrix();
    foliageMesh.setMatrixAt(i, dummy.matrix);
  }
  trunkMesh.computeBoundingSphere();
  foliageMesh.computeBoundingSphere();
  root.add(trunkMesh);
  root.add(foliageMesh);

  // 9. Bus Terminal Stops ("Addas")
  // Stop 1: Badami Bagh General Bus Stand (Starting Adda)
  busStops.push({
    id: 'adda_lahore',
    name: 'Badami Bagh Terminal, Lahore',
    urduName: 'بادامی باغ لاری اڈا لاہور',
    zStart: 10,
    zEnd: 90,
    xPos: 5,
    targetPassengers: 35,
    visited: false,
    isTerminal: true,
  });

  // Stop 2: Canal Chowk / Chianwali Stop (Mid-Route Adda)
  busStops.push({
    id: 'adda_canal',
    name: 'Canal Mor Adda, Sheikhupura',
    urduName: 'نہر موڑ اڈا شیخوپورہ',
    zStart: 1420,
    zEnd: 1520,
    xPos: 4.5,
    targetPassengers: 18,
    visited: false,
    isTerminal: false,
  });

  // Stop 3: Faisalabad General Bus Stand (Destination Terminal)
  busStops.push({
    id: 'adda_faisalabad',
    name: 'General Bus Stand, Faisalabad',
    urduName: 'جنرل بس اسٹینڈ فیصل آباد',
    zStart: 3000,
    zEnd: 3120,
    xPos: 4,
    targetPassengers: 40,
    visited: false,
    isTerminal: true,
  });

  // Add visual passenger platforms & waiting sheds at stops
  busStops.forEach(stop => {
    const stopGroup = new THREE.Group();
    stopGroup.position.set(stop.xPos + 3.5, 0, (stop.zStart + stop.zEnd) / 2);

    // Platform slab
    const platform = new THREE.Mesh(
      new THREE.BoxGeometry(4.5, 0.45, 35),
      new THREE.MeshStandardMaterial({ color: 0x94a3b8 })
    );
    platform.position.y = 0.22;
    stopGroup.add(platform);

    // Passenger waiting shed
    const shed = new THREE.Mesh(
      new THREE.BoxGeometry(3.5, 3.2, 18),
      new THREE.MeshStandardMaterial({ color: 0x1e293b })
    );
    shed.position.set(0.5, 1.6, 0);
    stopGroup.add(shed);

    // Urdu Sign on Platform
    const signGeom = new THREE.PlaneGeometry(8, 2);
    const sign = new THREE.Mesh(
      signGeom,
      new THREE.MeshStandardMaterial({
        color: 0x059669,
        roughness: 0.3,
      })
    );
    sign.position.set(-1.8, 3.2, 0);
    sign.rotation.y = -Math.PI / 2;
    stopGroup.add(sign);

    root.add(stopGroup);
  });

  // 10. AI Traffic Hazards: Overloaded Sugarcane Tractor-Trolleys, Qingqi Rickshaws & Bedford Cargo Trucks
  const createTrafficVehicle = (
    type: 'sugarcane_tractor' | 'qingqi' | 'bedford_truck' | 'buffalo',
    initZ: number,
    laneX: number
  ): TrafficVehicle => {
    const tGroup = new THREE.Group();
    let width = 2.4;
    let length = 5.0;
    let speed = 25; // km/h

    if (type === 'sugarcane_tractor') {
      // Overloaded Sugarcane Tractor-Trolley (The quintessential Punjabi road hazard)
      width = 3.8;
      length = 9.5;
      speed = 18; // Very slow and swaying!

      // Red Massey Ferguson style tractor body
      const tractor = new THREE.Mesh(
        new THREE.BoxGeometry(2.2, 2.2, 3.2),
        new THREE.MeshStandardMaterial({ color: 0xdc2626, roughness: 0.6 })
      );
      tractor.position.set(0, 1.1, 2.5);
      tGroup.add(tractor);

      // Huge high-wheel rear tires
      for (let s of [-1.1, 1.1]) {
        const bigTire = new THREE.Mesh(
          new THREE.CylinderGeometry(0.85, 0.85, 0.45, 16),
          new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.9 })
        );
        bigTire.rotation.z = Math.PI / 2;
        bigTire.position.set(s, 0.85, 1.8);
        tGroup.add(bigTire);
      }

      // Massive overloaded sugarcane trolley filled with stalks tilting dangerously
      const caneGeom = new THREE.BoxGeometry(3.6, 4.2, 6.2);
      const caneMat = new THREE.MeshStandardMaterial({ color: 0x854d0e, roughness: 0.95 });
      const caneLoad = new THREE.Mesh(caneGeom, caneMat);
      caneLoad.position.set(0, 2.5, -2.5);
      tGroup.add(caneLoad);

      // Hanging red warning cloth rags on cane overhang
      const rag = new THREE.Mesh(
        new THREE.BoxGeometry(0.4, 0.7, 0.1),
        new THREE.MeshStandardMaterial({ color: 0xef4444 })
      );
      rag.position.set(0, 1.5, -5.8);
      tGroup.add(rag);

    } else if (type === 'qingqi') {
      // 6-Seater Qingqi Motorcycle Rickshaw
      width = 1.8;
      length = 3.6;
      speed = 40;

      // Motorcycle front
      const bike = new THREE.Mesh(
        new THREE.BoxGeometry(0.8, 1.4, 1.6),
        new THREE.MeshStandardMaterial({ color: 0x0284c7 })
      );
      bike.position.set(0, 0.7, 1.2);
      tGroup.add(bike);

      // Passenger passenger carriage box behind
      const carriage = new THREE.Mesh(
        new THREE.BoxGeometry(1.6, 1.8, 2.2),
        new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.5 })
      );
      carriage.position.set(0, 1.1, -0.6);
      tGroup.add(carriage);

    } else if (type === 'bedford_truck') {
      // Pakistani Bedford Truck with towering wooden Taj
      width = 2.6;
      length = 8.5;
      speed = 50;

      const truckBody = new THREE.Mesh(
        new THREE.BoxGeometry(2.5, 3.4, 7.8),
        new THREE.MeshStandardMaterial({ color: 0x047857, roughness: 0.4 })
      );
      truckBody.position.set(0, 1.9, 0);
      tGroup.add(truckBody);

    } else {
      // Holy Punjab Buffalo / Cow crossing the road!
      width = 1.2;
      length = 2.2;
      speed = 4; // Wandering slowly across

      const buffalo = new THREE.Mesh(
        new THREE.BoxGeometry(1.0, 1.2, 2.0),
        new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.95 })
      );
      buffalo.position.set(0, 0.8, 0);
      tGroup.add(buffalo);
    }

    tGroup.position.set(laneX, 0, initZ);
    root.add(tGroup);

    return {
      mesh: tGroup,
      type,
      x: laneX,
      z: initZ,
      targetZ: initZ,
      speed,
      width,
      length,
      swayAngle: 0,
      laneX,
    };
  };

  // Populate dynamic traffic along the route
  trafficList.push(createTrafficVehicle('sugarcane_tractor', 280, 3.2));
  trafficList.push(createTrafficVehicle('qingqi', 520, -3.0));
  trafficList.push(createTrafficVehicle('bedford_truck', 780, 2.8));
  trafficList.push(createTrafficVehicle('sugarcane_tractor', 1350, 1.8)); // On narrow canal road!
  trafficList.push(createTrafficVehicle('buffalo', 1880, 0.5)); // Crossing near village
  trafficList.push(createTrafficVehicle('sugarcane_tractor', 2140, 0.0)); // Over extreme brick bridge!
  trafficList.push(createTrafficVehicle('qingqi', 2480, 2.2));
  trafficList.push(createTrafficVehicle('bedford_truck', 2850, -2.2));

  // Bridge collision helper
  const checkBridgeCollision = (
    x: number,
    z: number
  ): { onBridge: boolean; fallenInWater: boolean } => {
    // Bridge spans z = 2100m to 2260m
    if (z >= 2100 && z <= 2260) {
      // Bridge roadway width is 4.8m (from x = -2.4m to +2.4m)
      if (Math.abs(x) > 2.8) {
        return { onBridge: true, fallenInWater: true }; // Plunged off bridge into canal!
      }
      return { onBridge: true, fallenInWater: false };
    }
    // Canal bank alongside road z = 1100 to 2100
    if (z >= 1100 && z <= 2100) {
      if (x < -4.0) {
        return { onBridge: false, fallenInWater: true }; // Fell into canal!
      }
    }
    return { onBridge: false, fallenInWater: false };
  };

  // Potholes and mud patches
  const checkPotholeOrMud = (
    x: number,
    z: number
  ): { isOffroad: boolean; isPothole: boolean; slipFactor: number } => {
    // Check if off-road beyond road shoulders
    const roadHalfWidth = z < 1100 ? 8 : z <= 2260 ? 4.5 : 5.5;
    const isOffroad = Math.abs(x) > roadHalfWidth;

    // Check specific mud rut sections in rural sector
    let isPothole = false;
    if (z > 2300 && z < 2900) {
      // Periodic potholes every 80m
      if (Math.abs((z % 80) - 40) < 6 && Math.abs(x) < 3.5) {
        isPothole = true;
      }
    }

    const slipFactor = isOffroad ? 0.45 : isPothole ? 0.7 : 1.0;
    return { isOffroad, isPothole, slipFactor };
  };

  // Update loop for traffic sway, movement, and smoke particles
  let timeElapsed = 0;
  const update = (delta: number, busZ: number) => {
    timeElapsed += delta;

    // Animate traffic movement
    trafficList.forEach(tv => {
      // Move vehicle along road
      const speedMs = (tv.speed * 1000) / 3600;
      tv.z += speedMs * delta;

      // Wrap around road length if too far behind or ahead
      if (tv.z > roadLength + 50) {
        tv.z = 50;
      }

      // Tractor-trolley dangerous sway animation
      if (tv.type === 'sugarcane_tractor') {
        tv.swayAngle = Math.sin(timeElapsed * 2.8 + tv.z * 0.1) * 0.08;
        tv.mesh.rotation.z = tv.swayAngle;
      }

      // Buffalo meandering across road
      if (tv.type === 'buffalo') {
        tv.x = Math.sin(timeElapsed * 0.8) * 3.5;
        tv.mesh.position.x = tv.x;
      }

      tv.mesh.position.z = tv.z;
    });

    // Animate smoke particles from kiln chimneys
    const posAttr = smokeGeom.getAttribute('position') as THREE.BufferAttribute;
    for (let i = 0; i < smokeCount; i++) {
      let y = posAttr.getY(i) + delta * 6;
      let x = posAttr.getX(i) + Math.sin(timeElapsed + i) * delta * 1.5;
      if (y > 65) {
        y = 28;
        x = -65 + (Math.random() - 0.5) * 4;
      }
      posAttr.setY(i, y);
      posAttr.setX(i, x);
    }
    posAttr.needsUpdate = true;
  };

  return {
    root,
    trafficList,
    busStops,
    smokeParticles,
    waterMesh,
    checkBridgeCollision,
    checkPotholeOrMud,
    update,
  };
}
