import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { RectAreaLightUniformsLib } from 'three/addons/lights/RectAreaLightUniformsLib.js';
import type { SceneThemeId } from '../data/orbitalData';
import type { ProceduralTexturePack } from './proceduralTextures';

export interface EnvironmentRig {
  applyTheme: (theme: SceneThemeId) => void;
  setDistanceGuideVisible: (visible: boolean) => void;
  update: (delta: number, elapsed: number) => void;
  dispose: () => void;
}

function createDistanceLabelTexture(maxAnisotropy: number): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 176;
  const ctx = canvas.getContext('2d')!;

  ctx.clearRect(0, 0, 512, 176);

  // Dark translucent aerospace telemetry card
  ctx.fillStyle = 'rgba(7, 11, 20, 0.92)';
  ctx.beginPath();
  ctx.roundRect(8, 8, 496, 160, 18);
  ctx.fill();

  ctx.strokeStyle = 'rgba(56, 189, 248, 0.85)';
  ctx.lineWidth = 3;
  ctx.stroke();

  ctx.fillStyle = '#38BDF8';
  ctx.font = '700 46px "JetBrains Mono", monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('↕ 420 км', 256, 68);

  ctx.fillStyle = '#CBD5E1';
  ctx.font = '500 24px "Manrope", system-ui, sans-serif';
  ctx.fillText('Жер бетінен орбиталық қашықтық', 256, 124);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = Math.min(Math.max(maxAnisotropy, 1), 16);
  return tex;
}

export function buildEnvironment(
  scene: THREE.Scene,
  renderer: THREE.WebGLRenderer,
  textures: ProceduralTexturePack,
  isSoftwareGl: boolean
): EnvironmentRig {
  const envGroup = new THREE.Group();
  scene.add(envGroup);

  const pmremGenerator = new THREE.PMREMGenerator(renderer);
  const envRt = pmremGenerator.fromScene(new RoomEnvironment(), 0.04);
  scene.environment = envRt.texture;
  pmremGenerator.dispose();

  // 3-Point Studio Rig
  const keyLight = new THREE.DirectionalLight(0xfff5eb, 2.2);
  keyLight.position.set(7.5, 11.5, 8);
  if (!isSoftwareGl) {
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.set(2048, 2048);
    keyLight.shadow.camera.near = 1;
    keyLight.shadow.camera.far = 32;
    const d = 6.2;
    keyLight.shadow.camera.left = -d;
    keyLight.shadow.camera.right = d;
    keyLight.shadow.camera.top = d;
    keyLight.shadow.camera.bottom = -d;
    keyLight.shadow.bias = -0.0005;
    keyLight.shadow.normalBias = 0.02;
  }
  envGroup.add(keyLight);

  const hemiLight = new THREE.HemisphereLight(0xdbeafe, 0x334155, 0.95);
  hemiLight.position.set(0, 20, 0);
  envGroup.add(hemiLight);

  const rimLight = new THREE.DirectionalLight(0x93c5fd, 1.2);
  rimLight.position.set(-8, 6, -7.5);
  envGroup.add(rimLight);

  const softboxes: THREE.RectAreaLight[] = [];
  if (!isSoftwareGl) {
    RectAreaLightUniformsLib.init();
    const box1 = new THREE.RectAreaLight(0xffffff, 2.2, 6, 4);
    box1.position.set(-6.5, 6, 5.5);
    box1.lookAt(0, 3.2, 0);
    envGroup.add(box1);
    softboxes.push(box1);

    const box2 = new THREE.RectAreaLight(0xe0f2fe, 1.8, 6, 4);
    box2.position.set(6.5, 4.5, -5);
    box2.lookAt(0, 3.2, 0);
    envGroup.add(box2);
    softboxes.push(box2);
  }

  // Contact Shadow Grounding Plane
  const shadowGeo = new THREE.PlaneGeometry(7.2, 7.2);
  shadowGeo.rotateX(-Math.PI / 2);
  const shadowMat = new THREE.MeshBasicMaterial({
    map: textures.contactShadowMap,
    transparent: true,
    opacity: 0.65,
    depthWrite: false,
  });
  const shadowPlane = new THREE.Mesh(shadowGeo, shadowMat);
  shadowPlane.position.y = 0.004;
  envGroup.add(shadowPlane);

  // Architectural Studio Pedestal Floor
  const floorGeo = new THREE.CircleGeometry(28, 64);
  floorGeo.rotateX(-Math.PI / 2);
  const floorMat = new THREE.MeshStandardMaterial({
    color: 0xdce1e8,
    roughness: 0.88,
    metalness: 0.05,
  });
  const studioFloor = new THREE.Mesh(floorGeo, floorMat);
  studioFloor.position.y = -0.004;
  studioFloor.receiveShadow = true;
  envGroup.add(studioFloor);

  // Orbital Space Backdrop (Stars + Earth + Atmosphere Rim)
  const spaceGroup = new THREE.Group();
  envGroup.add(spaceGroup);

  const starCount = 2200;
  const starPos = new Float32Array(starCount * 3);
  const starCol = new Float32Array(starCount * 3);
  for (let i = 0; i < starCount; i++) {
    const u = Math.random();
    const v = Math.random();
    const theta = 2 * Math.PI * u;
    const phi = Math.acos(2 * v - 1);
    const radius = 75 + Math.random() * 45;
    starPos[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
    starPos[i * 3 + 1] = radius * Math.cos(phi);
    starPos[i * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta);

    const tone = Math.random();
    if (tone > 0.75) {
      starCol[i * 3] = 0.78;
      starCol[i * 3 + 1] = 0.88;
      starCol[i * 3 + 2] = 1.0;
    } else if (tone < 0.15) {
      starCol[i * 3] = 1.0;
      starCol[i * 3 + 1] = 0.92;
      starCol[i * 3 + 2] = 0.78;
    } else {
      starCol[i * 3] = 0.96;
      starCol[i * 3 + 1] = 0.97;
      starCol[i * 3 + 2] = 1.0;
    }
  }
  const starGeo = new THREE.BufferGeometry();
  starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
  starGeo.setAttribute('color', new THREE.BufferAttribute(starCol, 3));
  const starMat = new THREE.PointsMaterial({
    size: 0.28,
    vertexColors: true,
    transparent: true,
    opacity: 0.92,
    sizeAttenuation: true,
  });
  const starPoints = new THREE.Points(starGeo, starMat);
  spaceGroup.add(starPoints);

  // Earth positioned directly beneath the orbital station so curvature is visible in Overview
  const earthRadius = 44;
  const earthCenter = new THREE.Vector3(0, -45.75, -8);
  const earthGeo = new THREE.SphereGeometry(earthRadius, 64, 48);
  const earthMat = new THREE.MeshStandardMaterial({
    map: textures.earthAlbedoMap,
    roughness: 0.75,
    metalness: 0.05,
  });
  const earthMesh = new THREE.Mesh(earthGeo, earthMat);
  earthMesh.position.copy(earthCenter);
  spaceGroup.add(earthMesh);

  const atmoGeo = new THREE.SphereGeometry(earthRadius + 1.1, 64, 48);
  const atmoMat = new THREE.MeshBasicMaterial({
    color: 0x38bdf8,
    transparent: true,
    opacity: 0.16,
    side: THREE.BackSide,
    depthWrite: false,
  });
  const atmoMesh = new THREE.Mesh(atmoGeo, atmoMat);
  atmoMesh.position.copy(earthCenter);
  spaceGroup.add(atmoMesh);

  // ---------------------------------------------------------------------------
  // DISTANCE TO EARTH TELEMETRY LINE (420 KM) BESIDE THE MODEL
  // ---------------------------------------------------------------------------
  const distanceGuideGroup = new THREE.Group();
  spaceGroup.add(distanceGuideGroup);

  const lineX = 3.55;
  const lineZ = -0.6;
  const dx = lineX - earthCenter.x;
  const dz = lineZ - earthCenter.z;
  const earthSurfaceY =
    earthCenter.y + Math.sqrt(Math.max(0, earthRadius * earthRadius - dx * dx - dz * dz));
  const stationBaseY = 0.12;

  const lineMat = new THREE.LineDashedMaterial({
    color: 0x38bdf8,
    dashSize: 0.16,
    gapSize: 0.1,
    transparent: true,
    opacity: 0.9,
  });

  const mainLineGeo = new THREE.BufferGeometry().setFromPoints([
    new THREE.Vector3(lineX, stationBaseY, lineZ),
    new THREE.Vector3(lineX, earthSurfaceY, lineZ),
  ]);
  const mainLine = new THREE.Line(mainLineGeo, lineMat);
  mainLine.computeLineDistances();
  distanceGuideGroup.add(mainLine);

  // Horizontal leader tick from pedestal edge (x = 2.55) out to lineX
  const solidTickMat = new THREE.LineBasicMaterial({
    color: 0x7dd3fc,
    transparent: true,
    opacity: 0.85,
  });
  const topTickGeo = new THREE.BufferGeometry().setFromPoints([
    new THREE.Vector3(2.45, stationBaseY, lineZ),
    new THREE.Vector3(lineX + 0.25, stationBaseY, lineZ),
  ]);
  const topTick = new THREE.Line(topTickGeo, solidTickMat);
  distanceGuideGroup.add(topTick);

  const bottomTickGeo = new THREE.BufferGeometry().setFromPoints([
    new THREE.Vector3(lineX - 0.35, earthSurfaceY, lineZ),
    new THREE.Vector3(lineX + 0.35, earthSurfaceY, lineZ),
  ]);
  const bottomTick = new THREE.Line(bottomTickGeo, solidTickMat);
  distanceGuideGroup.add(bottomTick);

  // Glowing Target Reticle Ring on Earth Surface & Pedestal End
  const markerMat = new THREE.MeshBasicMaterial({
    color: 0x38bdf8,
    side: THREE.DoubleSide,
  });
  const surfaceRingGeo = new THREE.RingGeometry(0.11, 0.17, 24);
  surfaceRingGeo.rotateX(-Math.PI / 2);
  const surfaceRing = new THREE.Mesh(surfaceRingGeo, markerMat);
  surfaceRing.position.set(lineX, earthSurfaceY + 0.03, lineZ);
  distanceGuideGroup.add(surfaceRing);

  const endpointDotGeo = new THREE.SphereGeometry(0.055, 12, 12);
  const topDot = new THREE.Mesh(endpointDotGeo, markerMat);
  topDot.position.set(lineX, stationBaseY, lineZ);
  const botDot = new THREE.Mesh(endpointDotGeo, markerMat);
  botDot.position.set(lineX, earthSurfaceY, lineZ);
  distanceGuideGroup.add(topDot, botDot);

  // 3D Billboard Telemetry Plaque ("420 км · Жер бетінен орбиталық қашықтық")
  const labelTexture = createDistanceLabelTexture(renderer.capabilities.getMaxAnisotropy());
  const labelSpriteMat = new THREE.SpriteMaterial({
    map: labelTexture,
    transparent: true,
    depthTest: true,
  });
  const labelSprite = new THREE.Sprite(labelSpriteMat);
  labelSprite.position.set(lineX + 1.42, (stationBaseY + earthSurfaceY) * 0.5, lineZ);
  labelSprite.scale.set(2.45, 0.84, 1);
  distanceGuideGroup.add(labelSprite);

  let currentTheme: SceneThemeId = 'orbit';
  let guideVisible = true;

  const applyTheme = (theme: SceneThemeId) => {
    currentTheme = theme;
    if (theme === 'studio') {
      const bg = new THREE.Color(0xeef2f6);
      scene.background = bg;
      scene.fog = new THREE.Fog(0xeef2f6, 22, 62);
      studioFloor.visible = true;
      shadowPlane.visible = true;
      spaceGroup.visible = false;
      floorMat.color.setHex(0xdce2ea);
      keyLight.intensity = 2.15;
      hemiLight.intensity = 1.0;
      rimLight.intensity = 1.15;
      softboxes.forEach((b, i) => {
        b.intensity = i === 0 ? 2.2 : 1.8;
      });
    } else if (theme === 'night') {
      const bg = new THREE.Color(0x070a12);
      scene.background = bg;
      scene.fog = new THREE.Fog(0x070a12, 20, 60);
      studioFloor.visible = true;
      shadowPlane.visible = true;
      spaceGroup.visible = false;
      floorMat.color.setHex(0x0b101b);
      keyLight.intensity = 1.25;
      hemiLight.intensity = 0.48;
      rimLight.intensity = 1.4;
      softboxes.forEach((b) => {
        b.intensity = 1.0;
      });
    } else {
      const bg = new THREE.Color(0x04070e);
      scene.background = bg;
      scene.fog = new THREE.FogExp2(0x04070e, 0.0045);
      studioFloor.visible = false;
      shadowPlane.visible = false;
      spaceGroup.visible = true;
      distanceGuideGroup.visible = guideVisible;
      keyLight.intensity = 2.4;
      hemiLight.intensity = 0.65;
      rimLight.intensity = 1.5;
      softboxes.forEach((b) => {
        b.intensity = 1.3;
      });
    }
  };

  applyTheme('orbit');

  return {
    applyTheme,
    setDistanceGuideVisible: (visible: boolean) => {
      guideVisible = visible;
      distanceGuideGroup.visible = visible;
    },
    update: (delta: number, _elapsed: number) => {
      if (currentTheme === 'orbit') {
        earthMesh.rotation.y += delta * 0.012;
        starPoints.rotation.y += delta * 0.003;
      }
    },
    dispose: () => {
      envRt.dispose();
      shadowGeo.dispose();
      shadowMat.dispose();
      floorGeo.dispose();
      floorMat.dispose();
      starGeo.dispose();
      starMat.dispose();
      earthGeo.dispose();
      earthMat.dispose();
      atmoGeo.dispose();
      atmoMat.dispose();
      mainLineGeo.dispose();
      topTickGeo.dispose();
      bottomTickGeo.dispose();
      surfaceRingGeo.dispose();
      endpointDotGeo.dispose();
      lineMat.dispose();
      solidTickMat.dispose();
      markerMat.dispose();
      labelTexture.dispose();
      labelSpriteMat.dispose();
    },
  };
}
