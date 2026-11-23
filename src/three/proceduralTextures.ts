import * as THREE from 'three';

export interface ProceduralTexturePack {
  solarMap: THREE.CanvasTexture;
  solarRoughnessMap: THREE.CanvasTexture;
  brushedMetalMap: THREE.CanvasTexture;
  brushedMetalRoughness: THREE.CanvasTexture;
  darkTowerMap: THREE.CanvasTexture;
  interiorFloorMap: THREE.CanvasTexture;
  suitePlaqueMaps: THREE.CanvasTexture[];
  contactShadowMap: THREE.CanvasTexture;
  earthAlbedoMap: THREE.CanvasTexture;
  glowSpriteMap: THREE.CanvasTexture;
  dispose: () => void;
}

function makeCanvas(width: number, height: number): [HTMLCanvasElement, CanvasRenderingContext2D] {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;
  return [canvas, ctx];
}

export function createProceduralTextures(maxAnisotropy: number): ProceduralTexturePack {
  const aniso = Math.min(Math.max(maxAnisotropy, 1), 16);

  // 1. Solar Photovoltaic Panel Albedo & Roughness
  const [solarCanvas, sCtx] = makeCanvas(512, 512);
  const sGrad = sCtx.createLinearGradient(0, 0, 512, 512);
  sGrad.addColorStop(0, '#0a2b6e');
  sGrad.addColorStop(0.5, '#11429d');
  sGrad.addColorStop(1, '#0b3078');
  sCtx.fillStyle = sGrad;
  sCtx.fillRect(0, 0, 512, 512);

  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 16; col++) {
      const alpha = 0.04 + ((row * 7 + col * 13) % 5) * 0.04;
      sCtx.fillStyle = `rgba(56, 189, 248, ${alpha})`;
      sCtx.fillRect(col * 32 + 1, row * 64 + 1, 30, 62);
    }
  }
  sCtx.strokeStyle = 'rgba(180, 215, 255, 0.35)';
  sCtx.lineWidth = 1;
  for (let x = 0; x <= 512; x += 16) {
    sCtx.beginPath();
    sCtx.moveTo(x, 0);
    sCtx.lineTo(x, 512);
    sCtx.stroke();
  }
  for (let y = 0; y <= 512; y += 32) {
    sCtx.beginPath();
    sCtx.moveTo(0, y);
    sCtx.lineTo(512, y);
    sCtx.stroke();
  }
  sCtx.strokeStyle = '#dbe7f7';
  sCtx.lineWidth = 4;
  for (let x = 0; x <= 512; x += 64) {
    sCtx.beginPath();
    sCtx.moveTo(x, 0);
    sCtx.lineTo(x, 512);
    sCtx.stroke();
  }
  for (let y = 0; y <= 512; y += 128) {
    sCtx.beginPath();
    sCtx.moveTo(0, y);
    sCtx.lineTo(512, y);
    sCtx.stroke();
  }

  const solarMap = new THREE.CanvasTexture(solarCanvas);
  solarMap.colorSpace = THREE.SRGBColorSpace;
  solarMap.wrapS = THREE.RepeatWrapping;
  solarMap.wrapT = THREE.RepeatWrapping;
  solarMap.anisotropy = aniso;

  const [solarRoughCanvas, srCtx] = makeCanvas(512, 512);
  srCtx.fillStyle = '#2d2d2d';
  srCtx.fillRect(0, 0, 512, 512);
  srCtx.strokeStyle = '#999999';
  srCtx.lineWidth = 4;
  for (let x = 0; x <= 512; x += 64) {
    srCtx.beginPath();
    srCtx.moveTo(x, 0);
    srCtx.lineTo(x, 512);
    srCtx.stroke();
  }
  const solarRoughnessMap = new THREE.CanvasTexture(solarRoughCanvas);
  solarRoughnessMap.wrapS = THREE.RepeatWrapping;
  solarRoughnessMap.wrapT = THREE.RepeatWrapping;
  solarRoughnessMap.anisotropy = aniso;

  // 2. Brushed Satin Silver Titanium
  const [metalCanvas, mCtx] = makeCanvas(512, 256);
  mCtx.fillStyle = '#e3e8f0';
  mCtx.fillRect(0, 0, 512, 256);
  for (let y = 0; y < 256; y += 2) {
    const v = 220 + ((y * 17) % 18);
    mCtx.fillStyle = `rgb(${v}, ${v + 4}, ${v + 10})`;
    mCtx.fillRect(0, y, 512, 1);
  }
  mCtx.strokeStyle = 'rgba(90, 102, 120, 0.22)';
  mCtx.lineWidth = 2;
  mCtx.strokeRect(1, 1, 510, 254);

  const brushedMetalMap = new THREE.CanvasTexture(metalCanvas);
  brushedMetalMap.colorSpace = THREE.SRGBColorSpace;
  brushedMetalMap.wrapS = THREE.RepeatWrapping;
  brushedMetalMap.wrapT = THREE.RepeatWrapping;
  brushedMetalMap.anisotropy = aniso;

  const [metalRoughCanvas, mrCtx] = makeCanvas(256, 256);
  mrCtx.fillStyle = '#585858';
  mrCtx.fillRect(0, 0, 256, 256);
  for (let y = 0; y < 256; y += 2) {
    const v = 75 + ((y * 19) % 30);
    mrCtx.fillStyle = `rgb(${v},${v},${v})`;
    mrCtx.fillRect(0, y, 256, 1);
  }
  const brushedMetalRoughness = new THREE.CanvasTexture(metalRoughCanvas);
  brushedMetalRoughness.wrapS = THREE.RepeatWrapping;
  brushedMetalRoughness.wrapT = THREE.RepeatWrapping;

  // 3. Dark Anodized Tower & Pedestal Cladding
  const [darkCanvas, dCtx] = makeCanvas(512, 256);
  dCtx.fillStyle = '#151820';
  dCtx.fillRect(0, 0, 512, 256);
  for (let y = 0; y < 256; y += 64) {
    dCtx.fillStyle = y % 128 === 0 ? '#181c26' : '#13161e';
    dCtx.fillRect(0, y, 512, 64);
    dCtx.fillStyle = '#090b10';
    dCtx.fillRect(0, y, 512, 3);
  }
  for (let x = 0; x < 512; x += 64) {
    dCtx.fillStyle = '#bcc6d4';
    dCtx.fillRect(x, 0, 2, 256);
    dCtx.fillStyle = '#090b0f';
    dCtx.fillRect(x + 2, 0, 2, 256);
  }
  const darkTowerMap = new THREE.CanvasTexture(darkCanvas);
  darkTowerMap.colorSpace = THREE.SRGBColorSpace;
  darkTowerMap.wrapS = THREE.RepeatWrapping;
  darkTowerMap.wrapT = THREE.RepeatWrapping;
  darkTowerMap.anisotropy = aniso;

  // 4. Interior Atrium Promenade Floor
  const [floorCanvas, fCtx] = makeCanvas(512, 512);
  fCtx.fillStyle = '#d6cfc4';
  fCtx.fillRect(0, 0, 512, 130);
  fCtx.fillStyle = '#eef3f8';
  fCtx.fillRect(0, 130, 512, 160);
  fCtx.fillStyle = '#38bdf8';
  fCtx.fillRect(0, 140, 512, 5);
  fCtx.fillRect(0, 282, 512, 5);
  fCtx.fillStyle = '#2d7d44';
  fCtx.fillRect(0, 290, 512, 108);
  fCtx.fillStyle = '#f1f5f9';
  fCtx.fillRect(0, 398, 512, 114);
  fCtx.strokeStyle = 'rgba(100, 116, 139, 0.22)';
  fCtx.lineWidth = 1;
  for (let x = 0; x <= 512; x += 32) {
    fCtx.beginPath();
    fCtx.moveTo(x, 0);
    fCtx.lineTo(x, 512);
    fCtx.stroke();
  }
  for (let y = 0; y <= 512; y += 32) {
    fCtx.beginPath();
    fCtx.moveTo(0, y);
    fCtx.lineTo(512, y);
    fCtx.stroke();
  }
  const interiorFloorMap = new THREE.CanvasTexture(floorCanvas);
  interiorFloorMap.colorSpace = THREE.SRGBColorSpace;
  interiorFloorMap.wrapS = THREE.RepeatWrapping;
  interiorFloorMap.wrapT = THREE.ClampToEdgeWrapping;
  interiorFloorMap.anisotropy = aniso;

  // 5. 12 Suite Numbered Plaques (101 - 112)
  const suitePlaqueMaps: THREE.CanvasTexture[] = [];
  for (let i = 0; i < 12; i++) {
    const [pCanvas, pCtx] = makeCanvas(256, 128);
    pCtx.fillStyle = '#0f172a';
    pCtx.fillRect(0, 0, 256, 128);
    pCtx.strokeStyle = '#38bdf8';
    pCtx.lineWidth = 6;
    pCtx.strokeRect(6, 6, 244, 116);
    pCtx.fillStyle = '#e0f2fe';
    pCtx.font = '700 54px "Manrope", system-ui, sans-serif';
    pCtx.textAlign = 'center';
    pCtx.textBaseline = 'middle';
    pCtx.fillText(`${101 + i}`, 128, 56);
    pCtx.fillStyle = '#7dd3fc';
    pCtx.font = '600 18px "Manrope", system-ui, sans-serif';
    pCtx.fillText('ЛЮКС БӨЛМЕ', 128, 98);
    const tex = new THREE.CanvasTexture(pCanvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = aniso;
    suitePlaqueMaps.push(tex);
  }

  // 6. Contact Shadow Map
  const [csCanvas, csCtx] = makeCanvas(256, 256);
  const csGrad = csCtx.createRadialGradient(128, 128, 16, 128, 128, 124);
  csGrad.addColorStop(0, 'rgba(15, 23, 42, 0.58)');
  csGrad.addColorStop(0.42, 'rgba(15, 23, 42, 0.28)');
  csGrad.addColorStop(0.75, 'rgba(15, 23, 42, 0.08)');
  csGrad.addColorStop(1, 'rgba(15, 23, 42, 0)');
  csCtx.fillStyle = csGrad;
  csCtx.fillRect(0, 0, 256, 256);
  const contactShadowMap = new THREE.CanvasTexture(csCanvas);

  // 7. Earth Albedo Map for Orbital Mode
  const [earthCanvas, eCtx] = makeCanvas(1024, 512);
  const eGrad = eCtx.createLinearGradient(0, 0, 0, 512);
  eGrad.addColorStop(0, '#09244f');
  eGrad.addColorStop(0.5, '#0b3878');
  eGrad.addColorStop(1, '#082046');
  eCtx.fillStyle = eGrad;
  eCtx.fillRect(0, 0, 1024, 512);

  const continents: [number, number, number, number][] = [
    [180, 140, 140, 65],
    [320, 190, 95, 50],
    [540, 130, 180, 80],
    [680, 220, 130, 75],
    [830, 160, 110, 55],
    [240, 320, 110, 60],
  ];
  continents.forEach(([cx, cy, rx, ry], idx) => {
    const cg = eCtx.createRadialGradient(cx, cy, 8, cx, cy, rx);
    cg.addColorStop(0, idx % 2 === 0 ? '#3a6b48' : '#7b6c4a');
    cg.addColorStop(0.7, '#2d533d');
    cg.addColorStop(1, 'rgba(11, 56, 120, 0)');
    eCtx.fillStyle = cg;
    eCtx.beginPath();
    eCtx.ellipse(cx, cy, rx, ry, 0.25, 0, Math.PI * 2);
    eCtx.fill();
  });

  for (let i = 0; i < 65; i++) {
    const x = (i * 173) % 1024;
    const y = 40 + ((i * 97) % 430);
    const rx = 80 + ((i * 43) % 140);
    const ry = 10 + ((i * 19) % 24);
    const cl = eCtx.createRadialGradient(x, y, 2, x, y, rx * 0.6);
    cl.addColorStop(0, 'rgba(245, 250, 255, 0.45)');
    cl.addColorStop(1, 'rgba(245, 250, 255, 0)');
    eCtx.fillStyle = cl;
    eCtx.beginPath();
    eCtx.ellipse(x, y, rx, ry, 0.1, 0, Math.PI * 2);
    eCtx.fill();
  }
  const earthAlbedoMap = new THREE.CanvasTexture(earthCanvas);
  earthAlbedoMap.colorSpace = THREE.SRGBColorSpace;
  earthAlbedoMap.wrapS = THREE.RepeatWrapping;
  earthAlbedoMap.anisotropy = aniso;

  // 8. Cyan Glow Sprite Map
  const [glowCanvas, gCtx] = makeCanvas(128, 128);
  const gGrad = gCtx.createRadialGradient(64, 64, 2, 64, 64, 62);
  gGrad.addColorStop(0, 'rgba(224, 248, 255, 1.0)');
  gGrad.addColorStop(0.22, 'rgba(56, 189, 248, 0.72)');
  gGrad.addColorStop(0.55, 'rgba(14, 165, 233, 0.22)');
  gGrad.addColorStop(1, 'rgba(14, 165, 233, 0.0)');
  gCtx.fillStyle = gGrad;
  gCtx.fillRect(0, 0, 128, 128);
  const glowSpriteMap = new THREE.CanvasTexture(glowCanvas);
  glowSpriteMap.colorSpace = THREE.SRGBColorSpace;

  return {
    solarMap,
    solarRoughnessMap,
    brushedMetalMap,
    brushedMetalRoughness,
    darkTowerMap,
    interiorFloorMap,
    suitePlaqueMaps,
    contactShadowMap,
    earthAlbedoMap,
    glowSpriteMap,
    dispose: () => {
      solarMap.dispose();
      solarRoughnessMap.dispose();
      brushedMetalMap.dispose();
      brushedMetalRoughness.dispose();
      darkTowerMap.dispose();
      interiorFloorMap.dispose();
      suitePlaqueMaps.forEach((t) => t.dispose());
      contactShadowMap.dispose();
      earthAlbedoMap.dispose();
      glowSpriteMap.dispose();
    },
  };
}
