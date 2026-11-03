/**
 * Procedural HTML5 Canvas Texture Generators for Three.js
 * Generates authentic Pakistani truck art, chamakpatti tape, cockpit dials, and NHA signs
 */
import * as THREE from 'three';

/**
 * Generates authentic Pakistani Truck Art (Phool Patti) side & body texture
 */
export function createTruckArtBodyTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  // Base coach color - vibrant royal blue / bright yellow split
  const bgGrad = ctx.createLinearGradient(0, 0, 0, 512);
  bgGrad.addColorStop(0, '#f59e0b'); // Golden amber
  bgGrad.addColorStop(0.35, '#ef4444'); // Crimson red
  bgGrad.addColorStop(0.65, '#1e40af'); // Deep royal blue
  bgGrad.addColorStop(1, '#047857'); // Emerald green
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, 1024, 512);

  // Geometric Chamakpatti borders (chevron strips top and bottom)
  const drawChevronBand = (y: number, h: number) => {
    const segWidth = 32;
    for (let x = 0; x < 1024; x += segWidth) {
      ctx.fillStyle = (x / segWidth) % 2 === 0 ? '#facc15' : '#ef4444';
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + segWidth / 2, y + h);
      ctx.lineTo(x + segWidth, y);
      ctx.fill();

      ctx.fillStyle = (x / segWidth) % 2 === 0 ? '#0284c7' : '#22c55e';
      ctx.beginPath();
      ctx.moveTo(x + segWidth / 2, y + h);
      ctx.lineTo(x + segWidth, y);
      ctx.lineTo(x + segWidth * 1.5, y + h);
      ctx.fill();
    }
  };

  drawChevronBand(0, 24);
  drawChevronBand(488, 24);

  // Window band outline (upper half)
  ctx.fillStyle = '#0f172a';
  for (let w = 120; w < 920; w += 100) {
    ctx.fillRect(w, 40, 80, 100);
    // Passenger silhouettes
    ctx.fillStyle = '#cbd5e1';
    ctx.beginPath();
    ctx.arc(w + 40, 75, 16, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(w + 40, 120, 26, 18, 0, 0, Math.PI);
    ctx.fill();
    ctx.fillStyle = '#0f172a';
    // Glass reflection highlight
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(w + 10, 130);
    ctx.lineTo(w + 70, 50);
    ctx.stroke();
  }

  // Medallions with Truck Art Peacocks (Mor) and Floral Vines
  const drawMedallion = (cx: number, cy: number, r: number) => {
    // Outer radiant ring
    ctx.save();
    ctx.translate(cx, cy);

    ctx.beginPath();
    ctx.arc(0, 0, r + 8, 0, Math.PI * 2);
    ctx.fillStyle = '#eab308';
    ctx.fill();

    ctx.beginPath();
    ctx.arc(0, 0, r, 0, Math.PI * 2);
    ctx.fillStyle = '#065f46';
    ctx.fill();

    // Floral petals around circle
    for (let i = 0; i < 12; i++) {
      const angle = (i * Math.PI * 2) / 12;
      const px = Math.cos(angle) * (r - 12);
      const py = Math.sin(angle) * (r - 12);
      ctx.fillStyle = i % 2 === 0 ? '#f43f5e' : '#fbbf24';
      ctx.beginPath();
      ctx.arc(px, py, 10, 0, Math.PI * 2);
      ctx.fill();
    }

    // Peacock body silhouette in center
    ctx.fillStyle = '#38bdf8';
    ctx.beginPath();
    ctx.ellipse(0, 8, 16, 24, 0.2, 0, Math.PI * 2);
    ctx.fill();
    // Peacock neck and head
    ctx.beginPath();
    ctx.arc(10, -18, 9, 0, Math.PI * 2);
    ctx.fill();
    // Crown crest
    ctx.strokeStyle = '#fef08a';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(10, -27);
    ctx.lineTo(16, -38);
    ctx.stroke();

    ctx.restore();
  };

  drawMedallion(240, 310, 75);
  drawMedallion(780, 310, 75);

  // Center Urdu Poetry Banner & Emblem
  ctx.fillStyle = '#7f1d1d'; // Rich maroon
  ctx.strokeStyle = '#facc15'; // Gold trim
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.roundRect(360, 200, 320, 160, 20);
  ctx.fill();
  ctx.stroke();

  // Ornate corners
  ctx.fillStyle = '#f59e0b';
  ctx.font = 'bold 36px "Noto Nastaliq Urdu", "Cairo", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('ماں کی دعا جنت کی ہوا', 520, 260);

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 28px "Noto Nastaliq Urdu", "Cairo", sans-serif';
  ctx.fillText('فاصلہ رکھیں ورنہ پیار ہو جائے گا', 520, 320);

  // Bus Name Plate Banner
  ctx.fillStyle = '#0284c7';
  ctx.fillRect(180, 400, 660, 60);
  ctx.strokeStyle = '#fef08a';
  ctx.lineWidth = 4;
  ctx.strokeRect(180, 400, 660, 60);

  ctx.fillStyle = '#fef08a';
  ctx.font = '900 32px "Chakra Petch", sans-serif';
  ctx.fillText('PUNJAB EXPRESS ★ SHAHEEN COACH', 510, 442);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

/**
 * Front dome & windscreen top decal with "ALLAH-HO-AKBAR" and truck art spires
 */
export function createFrontDomeTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  // Emerald green & golden arched background
  const grad = ctx.createRadialGradient(256, 128, 20, 256, 128, 250);
  grad.addColorStop(0, '#047857');
  grad.addColorStop(0.7, '#064e3b');
  grad.addColorStop(1, '#b45309');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 512, 256);

  // Crescent and star in gold
  ctx.fillStyle = '#fef08a';
  ctx.beginPath();
  ctx.arc(256, 75, 45, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#064e3b';
  ctx.beginPath();
  ctx.arc(268, 70, 40, 0, Math.PI * 2);
  ctx.fill();

  // Star
  ctx.fillStyle = '#facc15';
  ctx.beginPath();
  ctx.arc(285, 65, 10, 0, Math.PI * 2);
  ctx.fill();

  // Arabic Calligraphy: Allah-ho-Akbar / SubhanAllah
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 44px "Noto Nastaliq Urdu", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('الله اكبر ★ ما شاء الله', 256, 170);

  ctx.fillStyle = '#fef08a';
  ctx.font = 'bold 24px "Chakra Petch", sans-serif';
  ctx.fillText('ROCKET LAHORE - FAISALABAD', 256, 215);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

/**
 * Chamakpatti retroreflective bumper texture (prismatic chevron tape)
 */
export function createChamakpattiBumperTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 128;
  const ctx = canvas.getContext('2d')!;

  const chevronW = 40;
  for (let x = -40; x < 550; x += chevronW) {
    ctx.fillStyle = (Math.floor(x / chevronW) % 2 === 0) ? '#e11d48' : '#facc15';
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x + chevronW * 0.7, 64);
    ctx.lineTo(x, 128);
    ctx.lineTo(x + chevronW * 0.5, 128);
    ctx.lineTo(x + chevronW * 1.2, 64);
    ctx.lineTo(x + chevronW * 0.5, 0);
    ctx.fill();
  }

  // Micro-prism diamond pattern overlay
  ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
  for (let y = 4; y < 128; y += 12) {
    for (let x = 4; x < 512; x += 12) {
      ctx.fillRect(x, y, 4, 4);
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

/**
 * Authentic wood dashboard with gauges, radio, and Urdu blessing stickers
 */
export function createCockpitDashboardTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  // Polished sheesham / rosewood texture
  const woodGrad = ctx.createLinearGradient(0, 0, 1024, 512);
  woodGrad.addColorStop(0, '#451a03');
  woodGrad.addColorStop(0.5, '#78350f');
  woodGrad.addColorStop(1, '#3a1302');
  ctx.fillStyle = woodGrad;
  ctx.fillRect(0, 0, 1024, 512);

  // Wood grain stripes
  ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
  for (let y = 0; y < 512; y += 14) {
    ctx.fillRect(0, y, 1024, 4);
  }

  // Instrument Cluster Panel (dark aluminum casing)
  ctx.fillStyle = '#0f172a';
  ctx.strokeStyle = '#d97706'; // Brass bezel
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.roundRect(140, 80, 740, 240, 16);
  ctx.fill();
  ctx.stroke();

  // Speedometer Dial (Left)
  const drawDial = (cx: number, cy: number, r: number, label: string, val: string) => {
    ctx.fillStyle = '#020617';
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Ticks
    for (let i = 0; i <= 10; i++) {
      const angle = Math.PI * 0.75 + (i / 10) * Math.PI * 1.5;
      const x1 = cx + Math.cos(angle) * (r - 6);
      const y1 = cy + Math.sin(angle) * (r - 6);
      const x2 = cx + Math.cos(angle) * (r - 18);
      const y2 = cy + Math.sin(angle) * (r - 18);
      ctx.strokeStyle = i > 7 ? '#ef4444' : '#38bdf8';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    }

    // Needle
    ctx.strokeStyle = '#f43f5e';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + Math.cos(Math.PI * 1.25) * (r - 15), cy + Math.sin(Math.PI * 1.25) * (r - 15));
    ctx.stroke();

    // Center pin
    ctx.fillStyle = '#facc15';
    ctx.beginPath();
    ctx.arc(cx, cy, 8, 0, Math.PI * 2);
    ctx.fill();

    // Label
    ctx.fillStyle = '#94a3b8';
    ctx.font = '600 16px "Chakra Petch", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(label, cx, cy + 32);

    ctx.fillStyle = '#38bdf8';
    ctx.font = '700 22px "Chakra Petch", sans-serif';
    ctx.fillText(val, cx, cy - 20);
  };

  drawDial(280, 200, 80, 'KM / H', 'SPEED');
  drawDial(510, 200, 80, 'RPM x1000', 'DIESEL');
  drawDial(740, 200, 80, 'AIR PSI', 'BRAKE');

  // Cassette Deck Player (Bottom Center)
  ctx.fillStyle = '#1e293b';
  ctx.strokeStyle = '#64748b';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.roundRect(320, 350, 380, 110, 8);
  ctx.fill();
  ctx.stroke();

  // Cassette Tape Window
  ctx.fillStyle = '#020617';
  ctx.fillRect(360, 370, 300, 45);
  ctx.fillStyle = '#ef4444';
  ctx.font = '700 16px monospace';
  ctx.textAlign = 'center';
  ctx.fillText('CASSETTE: ATTAULLAH ESAKHELVI', 510, 400);

  // Urdu Sticker on Dashboard
  ctx.fillStyle = '#16a34a';
  ctx.fillRect(80, 400, 180, 60);
  ctx.strokeStyle = '#facc15';
  ctx.strokeRect(80, 400, 180, 60);
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 20px "Noto Nastaliq Urdu", sans-serif';
  ctx.fillText('بسم الله الرحمن الرحيم', 170, 438);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

/**
 * Authentic Pakistani NHA Green Highway Overhead / Roadside Signboard
 */
export function createNHASignboardTexture(
  urduDest: string,
  engDest: string,
  km: string
): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  // NHA Highway Green
  ctx.fillStyle = '#065f46';
  ctx.fillRect(0, 0, 512, 256);

  // White reflective double border
  ctx.strokeStyle = '#f8fafc';
  ctx.lineWidth = 8;
  ctx.strokeRect(12, 12, 488, 232);

  // NHA Highway Shield
  ctx.fillStyle = '#047857';
  ctx.fillRect(380, 30, 90, 60);
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 3;
  ctx.strokeRect(380, 30, 90, 60);
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 24px "Chakra Petch", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('N-5', 425, 70);

  // Urdu destination name
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 44px "Noto Nastaliq Urdu", sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText(urduDest, 40, 85);

  // English destination name
  ctx.font = 'bold 34px "Plus Jakarta Sans", sans-serif';
  ctx.fillText(engDest, 40, 145);

  // Distance & Arrow
  ctx.fillStyle = '#facc15';
  ctx.font = '700 36px "Chakra Petch", sans-serif';
  ctx.fillText(km, 40, 205);

  // Direction arrow
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.moveTo(420, 150);
  ctx.lineTo(460, 185);
  ctx.lineTo(420, 220);
  ctx.lineTo(420, 195);
  ctx.lineTo(370, 195);
  ctx.lineTo(370, 175);
  ctx.lineTo(420, 175);
  ctx.closePath();
  ctx.fill();

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

/**
 * Roadside Dhaba / Truck Hotel neon signboard
 */
export function createDhabaSignTexture(nameUrdu: string, nameEng: string): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#09090b';
  ctx.fillRect(0, 0, 512, 256);

  // Glowing neon frame
  ctx.strokeStyle = '#ef4444';
  ctx.lineWidth = 6;
  ctx.strokeRect(10, 10, 492, 236);

  // Teapot / Chai cup icon
  ctx.fillStyle = '#f59e0b';
  ctx.font = 'bold 42px "Noto Nastaliq Urdu", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(nameUrdu, 256, 80);

  ctx.fillStyle = '#22d3ee';
  ctx.font = '800 32px "Chakra Petch", sans-serif';
  ctx.fillText(nameEng, 256, 135);

  ctx.fillStyle = '#fbbf24';
  ctx.font = '600 24px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('HOT KETTLE CHAI • DAAL MASH • ROTI', 256, 180);

  ctx.fillStyle = '#22c55e';
  ctx.font = '700 20px monospace';
  ctx.fillText('OPEN 24 HOURS • 24 گھنٹے کھلا ہے', 256, 220);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

/**
 * Road asphalt texture with lane markings and potholes
 */
export function createRoadAsphaltTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  // Dark rough asphalt
  ctx.fillStyle = '#27272a';
  ctx.fillRect(0, 0, 512, 512);

  // Gravel grain
  for (let i = 0; i < 4000; i++) {
    const x = Math.random() * 512;
    const y = Math.random() * 512;
    const s = Math.random() * 2 + 1;
    ctx.fillStyle = Math.random() > 0.5 ? '#3f3f46' : '#18181b';
    ctx.fillRect(x, y, s, s);
  }

  // Yellow center double divider line
  ctx.fillStyle = '#eab308';
  ctx.fillRect(246, 0, 8, 512);
  ctx.fillRect(258, 0, 8, 512);

  // White edge markings
  ctx.fillStyle = '#f1f5f9';
  ctx.fillRect(20, 0, 8, 512);
  ctx.fillRect(484, 0, 8, 512);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(1, 20);
  return texture;
}

/**
 * Sarson (Mustard flower) field texture
 */
export function createSarsonFieldTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  // Lush green foliage background
  ctx.fillStyle = '#15803d';
  ctx.fillRect(0, 0, 256, 256);

  // Golden yellow blooming flowers
  for (let i = 0; i < 300; i++) {
    const x = Math.random() * 256;
    const y = Math.random() * 256;
    const r = Math.random() * 4 + 2;
    ctx.fillStyle = Math.random() > 0.3 ? '#facc15' : '#fef08a';
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(12, 12);
  return texture;
}
