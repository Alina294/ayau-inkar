import * as THREE from 'three';
import type { PartId } from '../data/orbitalData';
import type { ProceduralTexturePack } from './proceduralTextures';

export interface HotelModelHandle {
  root: THREE.Group;
  ringAssembly: THREE.Group;
  parts: Record<PartId, THREE.Group>;
  setLedIntensity: (intensity: number) => void;
  setHighlightPart: (partId: PartId | null) => void;
  setActiveSuiteIndex: (suiteIndex: number | null) => void;
  updateRocket: (elapsed: number, visible: boolean) => void;
  dispose: () => void;
}

export function buildHotelModel(
  textures: ProceduralTexturePack,
  isSoftwareGl: boolean
): HotelModelHandle {
  const root = new THREE.Group();
  const ringAssembly = new THREE.Group();
  root.add(ringAssembly);

  const geometries: THREE.BufferGeometry[] = [];
  const materials: THREE.Material[] = [];

  const trackGeo = <T extends THREE.BufferGeometry>(g: T): T => {
    geometries.push(g);
    return g;
  };
  const trackMat = <T extends THREE.Material>(m: T): T => {
    materials.push(m);
    return m;
  };

  // PBR Materials
  const darkAnodizedMat = trackMat(
    new THREE.MeshStandardMaterial({
      map: textures.darkTowerMap,
      roughness: 0.45,
      metalness: 0.78,
    })
  );

  const brushedSilverMat = trackMat(
    new THREE.MeshPhysicalMaterial({
      map: textures.brushedMetalMap,
      roughnessMap: textures.brushedMetalRoughness,
      roughness: 0.24,
      metalness: 0.9,
      anisotropy: 0.75,
      clearcoat: 0.25,
    })
  );

  const matteWhiteMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0xf1f5f9,
      roughness: 0.55,
      metalness: 0.1,
    })
  );

  const shuttleTileMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      roughness: 0.72,
      metalness: 0.25,
    })
  );

  const warmOakMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0xb89572,
      roughness: 0.7,
      metalness: 0.05,
    })
  );

  const darkTrimMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.5,
      metalness: 0.65,
    })
  );

  const ironFrameMat = trackMat(
    new THREE.MeshPhysicalMaterial({
      color: 0x2b323c,
      roughness: 0.36,
      metalness: 0.92,
      clearcoat: 0.16,
    })
  );

  const ironDoorLeafMat = trackMat(
    new THREE.MeshPhysicalMaterial({
      color: 0x4b5565,
      roughness: 0.28,
      metalness: 0.94,
      clearcoat: 0.22,
    })
  );

  const ironAccentMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0x1b2028,
      roughness: 0.42,
      metalness: 0.88,
    })
  );

  const airlockStatusMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0xfef3c7,
      emissive: 0xf59e0b,
      emissiveIntensity: 2.2,
      roughness: 0.25,
      metalness: 0.1,
    })
  );

  const solarMat = trackMat(
    new THREE.MeshPhysicalMaterial({
      map: textures.solarMap,
      roughnessMap: textures.solarRoughnessMap,
      roughness: 0.22,
      metalness: 0.6,
      clearcoat: 0.85,
      clearcoatRoughness: 0.12,
      side: THREE.DoubleSide,
    })
  );

  const glassMat = trackMat(
    new THREE.MeshPhysicalMaterial({
      color: 0x7dd3fc,
      metalness: 0.05,
      roughness: 0.08,
      transmission: isSoftwareGl ? 0 : 0.68,
      transparent: true,
      opacity: isSoftwareGl ? 0.36 : 0.88,
      ior: 1.5,
      thickness: 0.25,
      depthWrite: false,
      side: THREE.DoubleSide,
    })
  );

  const cockpitGlassMat = trackMat(
    new THREE.MeshPhysicalMaterial({
      color: 0x0284c7,
      metalness: 0.2,
      roughness: 0.08,
      clearcoat: 1.0,
    })
  );

  const cyanLedMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0xe0f2fe,
      emissive: 0x38bdf8,
      emissiveIntensity: 2.8,
      roughness: 0.2,
      metalness: 0.1,
    })
  );

  const warmLedMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0xfff7ed,
      emissive: 0xf59e0b,
      emissiveIntensity: 2.4,
      roughness: 0.25,
      metalness: 0.1,
    })
  );

  const thrusterPlumeMat = trackMat(
    new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.78,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      side: THREE.DoubleSide,
    })
  );

  const thrusterCoreMat = trackMat(
    new THREE.MeshBasicMaterial({
      color: 0xfef08a,
      transparent: true,
      opacity: 0.92,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })
  );

  const floorMat = trackMat(
    new THREE.MeshStandardMaterial({
      map: textures.interiorFloorMap,
      roughness: 0.62,
      metalness: 0.08,
    })
  );

  const foliageMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0x2d7d46,
      roughness: 0.82,
      metalness: 0.02,
    })
  );

  const trunkMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0x6b4f3a,
      roughness: 0.88,
      metalness: 0.02,
    })
  );

  const spriteMat = trackMat(
    new THREE.SpriteMaterial({
      map: textures.glowSpriteMap,
      color: 0x7dd3fc,
      transparent: true,
      opacity: 0.68,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })
  );

  const addGlowSprite = (parent: THREE.Object3D, x: number, y: number, z: number, scale = 0.25) => {
    const sp = new THREE.Sprite(spriteMat);
    sp.position.set(x, y, z);
    sp.scale.setScalar(scale);
    parent.add(sp);
  };

  // Part Groups
  const parts: Record<PartId, THREE.Group> = {
    pedestal: new THREE.Group(),
    lowerSpindle: new THREE.Group(),
    interiorDeck: new THREE.Group(),
    suites: new THREE.Group(),
    habitationFrame: new THREE.Group(),
    solarRoof: new THREE.Group(),
    upperHub: new THREE.Group(),
    spire: new THREE.Group(),
  };

  root.add(parts.pedestal, parts.lowerSpindle);
  ringAssembly.add(
    parts.interiorDeck,
    parts.suites,
    parts.habitationFrame,
    parts.solarRoof,
    parts.upperHub,
    parts.spire
  );

  // ---------------------------------------------------------------------------
  // 1. PEDESTAL (Closed Multi-Tiered Stabilization Base + 120 LEDs)
  // ---------------------------------------------------------------------------
  {
    const p = parts.pedestal;
    const tiers = [
      { rTop: 2.38, rBot: 2.58, h: 0.24, y: 0.12 },
      { rTop: 2.0, rBot: 2.38, h: 0.24, y: 0.36 },
      { rTop: 1.56, rBot: 2.0, h: 0.24, y: 0.6 },
      { rTop: 1.12, rBot: 1.56, h: 0.26, y: 0.85 },
    ];
    tiers.forEach((t, idx) => {
      const geo = trackGeo(new THREE.CylinderGeometry(t.rTop, t.rBot, t.h, 64));
      const mesh = new THREE.Mesh(geo, idx % 2 === 0 ? darkAnodizedMat : darkTrimMat);
      mesh.position.y = t.y;
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      p.add(mesh);

      const ledRingGeo = trackGeo(new THREE.TorusGeometry(t.rTop + 0.015, 0.016, 8, 72));
      ledRingGeo.rotateX(Math.PI / 2);
      const ledRing = new THREE.Mesh(ledRingGeo, cyanLedMat);
      ledRing.position.y = t.y + t.h * 0.46;
      p.add(ledRing);
    });

    // Top collar sealing pedestal seamlessly into lowerSpindle
    const seatCollar = new THREE.Mesh(
      trackGeo(new THREE.CylinderGeometry(0.84, 1.14, 0.14, 48)),
      brushedSilverMat
    );
    seatCollar.position.y = 1.02;
    p.add(seatCollar);

    // 120 Instanced Cyan LED Beacons across all 4 tiers
    const ledDotGeo = trackGeo(new THREE.SphereGeometry(0.026, 10, 10));
    const ledDots = new THREE.InstancedMesh(ledDotGeo, cyanLedMat, 120);
    const dummy = new THREE.Object3D();
    for (let i = 0; i < 120; i++) {
      const tier = i % 4;
      const angle = (Math.floor(i / 4) / 30) * Math.PI * 2;
      const rad = [2.5, 2.18, 1.76, 1.32][tier];
      const yy = [0.23, 0.47, 0.71, 0.96][tier];
      dummy.position.set(Math.cos(angle) * rad, yy, Math.sin(angle) * rad);
      dummy.updateMatrix();
      ledDots.setMatrixAt(i, dummy.matrix);
    }
    ledDots.instanceMatrix.needsUpdate = true;
    ledDots.computeBoundingSphere();
    p.add(ledDots);

    // 12 Radial Stabilizer Fins closing side profile
    const strutGeo = trackGeo(new THREE.BoxGeometry(0.14, 0.54, 1.05));
    for (let i = 0; i < 12; i++) {
      const angle = (i / 12) * Math.PI * 2;
      const strut = new THREE.Mesh(strutGeo, brushedSilverMat);
      strut.position.set(Math.cos(angle) * 1.78, 0.52, Math.sin(angle) * 1.78);
      strut.rotation.set(0, -angle + Math.PI / 2, 0);
      strut.castShadow = true;
      p.add(strut);
    }
  }

  // ---------------------------------------------------------------------------
  // 2. LOWER SPINDLE (Sealed Central Core & Vertical LED Channels)
  // ---------------------------------------------------------------------------
  {
    const s = parts.lowerSpindle;
    // Extends continuously from pedestal collar (0.98) up into interior deck base (2.82)
    const mainShaftGeo = trackGeo(new THREE.CylinderGeometry(0.76, 0.84, 1.88, 48));
    const mainShaft = new THREE.Mesh(mainShaftGeo, darkAnodizedMat);
    mainShaft.position.y = 1.9;
    mainShaft.castShadow = true;
    mainShaft.receiveShadow = true;
    s.add(mainShaft);

    // Silver seam rings + LED accent bands
    [1.12, 1.54, 1.96, 2.38, 2.74].forEach((yy) => {
      const collarGeo = trackGeo(new THREE.CylinderGeometry(0.83, 0.83, 0.06, 48));
      const collar = new THREE.Mesh(collarGeo, brushedSilverMat);
      collar.position.y = yy;
      s.add(collar);

      const ledRingGeo = trackGeo(new THREE.TorusGeometry(0.84, 0.012, 8, 48));
      ledRingGeo.rotateX(Math.PI / 2);
      const ledRing = new THREE.Mesh(ledRingGeo, cyanLedMat);
      ledRing.position.y = yy;
      s.add(ledRing);
    });

    // 6 External Life-Support Conduits + 6 Vertical Cyan LED Strips
    const pipeGeo = trackGeo(new THREE.CylinderGeometry(0.04, 0.04, 1.84, 12));
    const ledBarGeo = trackGeo(new THREE.BoxGeometry(0.024, 1.74, 0.024));
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * Math.PI * 2;
      const pipe = new THREE.Mesh(pipeGeo, brushedSilverMat);
      pipe.position.set(Math.cos(a) * 0.86, 1.9, Math.sin(a) * 0.86);
      s.add(pipe);

      const aLed = a + Math.PI / 6;
      const ledBar = new THREE.Mesh(ledBarGeo, cyanLedMat);
      ledBar.position.set(Math.cos(aLed) * 0.81, 1.9, Math.sin(aLed) * 0.81);
      ledBar.rotation.y = -aLed;
      s.add(ledBar);
    }
  }

  // ---------------------------------------------------------------------------
  // 3. INTERIOR DECK (Closed Core Wall, Underbelly Hull, 48 Chandeliers, 48 Floor LEDs)
  // ---------------------------------------------------------------------------
  {
    const d = parts.interiorDeck;
    const deckY = 2.74;

    // Closed inner hub core shaft running smoothly from y=2.66 up to solarRoof y=4.26
    const innerCoreGeo = trackGeo(new THREE.CylinderGeometry(1.06, 1.06, 1.62, 64));
    const innerCore = new THREE.Mesh(innerCoreGeo, darkAnodizedMat);
    innerCore.position.y = 3.46;
    innerCore.receiveShadow = true;
    d.add(innerCore);

    // 12 Brushed silver pilasters + elevator portal frames around the inner core
    const pilasterGeo = trackGeo(new THREE.BoxGeometry(0.08, 1.38, 0.1));
    const doorLedGeo = trackGeo(new THREE.BoxGeometry(0.24, 0.022, 0.03));
    for (let i = 0; i < 12; i++) {
      const a = (i / 12) * Math.PI * 2;
      const pil = new THREE.Mesh(pilasterGeo, brushedSilverMat);
      pil.position.set(Math.cos(a) * 1.07, 3.45, Math.sin(a) * 1.07);
      pil.rotation.y = -a;
      d.add(pil);

      const portalAngle = a + Math.PI / 12;
      const portalLed = new THREE.Mesh(doorLedGeo, cyanLedMat);
      portalLed.position.set(Math.cos(portalAngle) * 1.08, 3.55, Math.sin(portalAngle) * 1.08);
      portalLed.rotation.y = -portalAngle + Math.PI / 2;
      d.add(portalLed);
    }

    // Closed Underbelly Torus Hull (seals gap beneath interiorDeck from spindle to outer ring)
    const underbellyProfile = [
      new THREE.Vector2(0.76, 2.58),
      new THREE.Vector2(1.12, 2.66),
      new THREE.Vector2(2.65, 2.64),
      new THREE.Vector2(3.95, 2.72),
      new THREE.Vector2(4.28, 2.86),
      new THREE.Vector2(4.28, 2.91),
      new THREE.Vector2(1.04, 2.91),
      new THREE.Vector2(0.76, 2.74),
    ];
    const underbellyGeo = trackGeo(new THREE.LatheGeometry(underbellyProfile, 72));
    const underbelly = new THREE.Mesh(underbellyGeo, brushedSilverMat);
    underbelly.castShadow = true;
    underbelly.receiveShadow = true;
    d.add(underbelly);

    // Flat walkable promenade deck surface
    const deckShape = new THREE.Shape();
    deckShape.absarc(0, 0, 4.26, 0, Math.PI * 2, false);
    const holePath = new THREE.Path();
    holePath.absarc(0, 0, 1.05, 0, Math.PI * 2, true);
    deckShape.holes.push(holePath);

    const deckGeo = trackGeo(
      new THREE.ExtrudeGeometry(deckShape, {
        depth: 0.14,
        bevelEnabled: false,
        curveSegments: 72,
      })
    );
    deckGeo.rotateX(Math.PI / 2);
    const deckMesh = new THREE.Mesh(deckGeo, floorMat);
    deckMesh.position.y = deckY + 0.16;
    deckMesh.receiveShadow = true;
    d.add(deckMesh);

    // Dual circular promenade LED guide rings
    [2.68, 3.35, 3.88].forEach((r, idx) => {
      const walkwayRingGeo = trackGeo(new THREE.TorusGeometry(r, 0.016, 8, 96));
      walkwayRingGeo.rotateX(Math.PI / 2);
      const walkwayRing = new THREE.Mesh(walkwayRingGeo, idx === 1 ? cyanLedMat : warmLedMat);
      walkwayRing.position.y = deckY + 0.175;
      d.add(walkwayRing);
    });

    // 48 Floor Recessed LED Bollards along walkway edges
    const floorLedGeo = trackGeo(new THREE.CylinderGeometry(0.025, 0.03, 0.05, 10));
    const floorLeds = new THREE.InstancedMesh(floorLedGeo, cyanLedMat, 48);
    const dummy = new THREE.Object3D();
    for (let i = 0; i < 48; i++) {
      const angle = (i / 48) * Math.PI * 2;
      const rad = i % 2 === 0 ? 2.74 : 3.82;
      dummy.position.set(Math.cos(angle) * rad, deckY + 0.19, Math.sin(angle) * rad);
      dummy.rotation.set(0, 0, 0);
      dummy.scale.setScalar(1);
      dummy.updateMatrix();
      floorLeds.setMatrixAt(i, dummy.matrix);
    }
    floorLeds.instanceMatrix.needsUpdate = true;
    floorLeds.computeBoundingSphere();
    d.add(floorLeds);

    // 36 Botanical Trees + Planter Uplight LEDs
    const trunkGeo = trackGeo(new THREE.CylinderGeometry(0.022, 0.032, 0.24, 8));
    const crownGeo = trackGeo(new THREE.DodecahedronGeometry(0.11, 1));
    const uplightGeo = trackGeo(new THREE.TorusGeometry(0.075, 0.012, 8, 16));
    uplightGeo.rotateX(Math.PI / 2);

    const trunks = new THREE.InstancedMesh(trunkGeo, trunkMat, 36);
    const crowns = new THREE.InstancedMesh(crownGeo, foliageMat, 36);
    const uplights = new THREE.InstancedMesh(uplightGeo, warmLedMat, 36);

    for (let i = 0; i < 36; i++) {
      const angle = (i / 36) * Math.PI * 2 + 0.04;
      const rad = i % 2 === 0 ? 3.55 : 2.52;
      const scale = 0.85 + ((i * 7) % 5) * 0.07;

      dummy.position.set(Math.cos(angle) * rad, deckY + 0.28, Math.sin(angle) * rad);
      dummy.scale.setScalar(scale);
      dummy.rotation.set(0, angle, 0);
      dummy.updateMatrix();
      trunks.setMatrixAt(i, dummy.matrix);

      dummy.position.set(Math.cos(angle) * rad, deckY + 0.44 * scale + 0.04, Math.sin(angle) * rad);
      dummy.updateMatrix();
      crowns.setMatrixAt(i, dummy.matrix);

      dummy.position.set(Math.cos(angle) * rad, deckY + 0.175, Math.sin(angle) * rad);
      dummy.scale.setScalar(1);
      dummy.rotation.set(0, 0, 0);
      dummy.updateMatrix();
      uplights.setMatrixAt(i, dummy.matrix);
    }
    trunks.instanceMatrix.needsUpdate = true;
    trunks.computeBoundingSphere();
    crowns.instanceMatrix.needsUpdate = true;
    crowns.computeBoundingSphere();
    uplights.instanceMatrix.needsUpdate = true;
    uplights.computeBoundingSphere();
    d.add(trunks, crowns, uplights);

    // 24 White Lounge Tables
    const tableTopGeo = trackGeo(new THREE.CylinderGeometry(0.11, 0.11, 0.022, 16));
    const tableLegGeo = trackGeo(new THREE.CylinderGeometry(0.018, 0.028, 0.14, 10));
    const tableTops = new THREE.InstancedMesh(tableTopGeo, matteWhiteMat, 24);
    const tableLegs = new THREE.InstancedMesh(tableLegGeo, brushedSilverMat, 24);
    for (let i = 0; i < 24; i++) {
      const angle = (i / 24) * Math.PI * 2 + 0.12;
      const rad = 2.95;
      dummy.scale.setScalar(1);
      dummy.rotation.set(0, 0, 0);
      dummy.position.set(Math.cos(angle) * rad, deckY + 0.31, Math.sin(angle) * rad);
      dummy.updateMatrix();
      tableTops.setMatrixAt(i, dummy.matrix);

      dummy.position.set(Math.cos(angle) * rad, deckY + 0.23, Math.sin(angle) * rad);
      dummy.updateMatrix();
      tableLegs.setMatrixAt(i, dummy.matrix);
    }
    tableTops.instanceMatrix.needsUpdate = true;
    tableTops.computeBoundingSphere();
    tableLegs.instanceMatrix.needsUpdate = true;
    tableLegs.computeBoundingSphere();
    d.add(tableTops, tableLegs);

    // 48 Ceiling LED Chandeliers (24 outer ring + 24 inner ring)
    const chandGeo = trackGeo(new THREE.TorusGeometry(0.085, 0.015, 8, 24));
    chandGeo.rotateX(Math.PI / 2);
    const chandeliers = new THREE.InstancedMesh(chandGeo, warmLedMat, 48);
    for (let i = 0; i < 48; i++) {
      const angle = (Math.floor(i / 2) / 24) * Math.PI * 2 + (i % 2 === 0 ? 0 : 0.08);
      const rad = i % 2 === 0 ? 3.22 : 2.65;
      dummy.position.set(Math.cos(angle) * rad, 3.88, Math.sin(angle) * rad);
      dummy.rotation.set(0, 0, 0);
      dummy.scale.setScalar(1);
      dummy.updateMatrix();
      chandeliers.setMatrixAt(i, dummy.matrix);
    }
    chandeliers.instanceMatrix.needsUpdate = true;
    chandeliers.computeBoundingSphere();
    d.add(chandeliers);

    // Continuous 360° Ceiling LED Cove Strip
    const coveLedGeo = trackGeo(new THREE.TorusGeometry(2.94, 0.018, 8, 96));
    coveLedGeo.rotateX(Math.PI / 2);
    const coveLed = new THREE.Mesh(coveLedGeo, warmLedMat);
    coveLed.position.y = 3.96;
    d.add(coveLed);

    // Interior warm point lights (8 radially spaced)
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * Math.PI * 2;
      const pt = new THREE.PointLight(0xfde68a, 1.9, 6.0);
      pt.position.set(Math.cos(a) * 3.05, 3.6, Math.sin(a) * 3.05);
      d.add(pt);
    }
  }

  // ---------------------------------------------------------------------------
  // 4. SUITES 101–112 (Fully Enclosed Cabins: Walls, Ceiling, Glass Door, LEDs)
  // ---------------------------------------------------------------------------
  const suiteGroupRefs: THREE.Group[] = [];
  {
    const su = parts.suites;
    const baseY = 2.91;

    const sideWallGeo = trackGeo(new THREE.BoxGeometry(0.045, 0.78, 0.92));
    const backWallGeo = trackGeo(new THREE.BoxGeometry(0.92, 0.78, 0.045));
    const ceilingGeo = trackGeo(new THREE.BoxGeometry(0.92, 0.045, 0.94));
    const frontGlassGeo = trackGeo(new THREE.PlaneGeometry(0.84, 0.68));
    const bedGeo = trackGeo(new THREE.BoxGeometry(0.32, 0.09, 0.42));
    const sofaGeo = trackGeo(new THREE.BoxGeometry(0.28, 0.08, 0.14));
    const lampGeo = trackGeo(new THREE.CylinderGeometry(0.032, 0.032, 0.07, 10));
    const coveStripGeo = trackGeo(new THREE.BoxGeometry(0.76, 0.022, 0.024));
    const doorLedGeo = trackGeo(new THREE.BoxGeometry(0.84, 0.022, 0.022));
    const plaqueGeo = trackGeo(new THREE.PlaneGeometry(0.28, 0.14));

    for (let i = 0; i < 12; i++) {
      const angle = (i / 12) * Math.PI * 2;
      const cabin = new THREE.Group();
      const rad = 1.88;
      cabin.position.set(Math.cos(angle) * rad, baseY, Math.sin(angle) * rad);
      cabin.rotation.y = -angle + Math.PI / 2;

      // Left & Right full partition walls
      const leftWall = new THREE.Mesh(sideWallGeo, matteWhiteMat);
      leftWall.position.set(-0.44, 0.39, 0);
      cabin.add(leftWall);

      const rightWall = new THREE.Mesh(sideWallGeo, matteWhiteMat);
      rightWall.position.set(0.44, 0.39, 0);
      cabin.add(rightWall);

      // Rear inner wall sealing against core shaft
      const backWall = new THREE.Mesh(backWallGeo, darkTrimMat);
      backWall.position.set(0, 0.39, -0.45);
      cabin.add(backWall);

      // Suite ceiling enclosure
      const ceiling = new THREE.Mesh(ceilingGeo, matteWhiteMat);
      ceiling.position.set(0, 0.78, 0);
      cabin.add(ceiling);

      // Front panoramic glass storefront door
      const frontGlass = new THREE.Mesh(frontGlassGeo, glassMat);
      frontGlass.position.set(0, 0.36, 0.45);
      cabin.add(frontGlass);

      // Bed + Warm oak headboard
      const bed = new THREE.Mesh(bedGeo, matteWhiteMat);
      bed.position.set(0.06, 0.06, -0.14);
      cabin.add(bed);

      const hb = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(0.34, 0.2, 0.04)), warmOakMat);
      hb.position.set(0.06, 0.15, -0.35);
      cabin.add(hb);

      // Lounge sofa
      const sofa = new THREE.Mesh(sofaGeo, darkTrimMat);
      sofa.position.set(-0.1, 0.055, 0.22);
      cabin.add(sofa);

      // Warm LED bedside lamp + interior ceiling LED cove + door cyan frame LED
      const lamp = new THREE.Mesh(lampGeo, warmLedMat);
      lamp.position.set(0.26, 0.16, -0.26);
      cabin.add(lamp);

      const ceilingLed = new THREE.Mesh(coveStripGeo, warmLedMat);
      ceilingLed.position.set(0, 0.74, -0.1);
      cabin.add(ceilingLed);

      const doorLed = new THREE.Mesh(doorLedGeo, cyanLedMat);
      doorLed.position.set(0, 0.72, 0.46);
      cabin.add(doorLed);

      // Numbered Plaque facing the promenade
      const plaqueMat = trackMat(
        new THREE.MeshBasicMaterial({
          map: textures.suitePlaqueMaps[i],
        })
      );
      const plaque = new THREE.Mesh(plaqueGeo, plaqueMat);
      plaque.position.set(0, 0.56, 0.475);
      cabin.add(plaque);

      suiteGroupRefs.push(cabin);
      su.add(cabin);
    }
  }

  // ---------------------------------------------------------------------------
  // 5. HABITATION FRAME (Sealed Upper/Lower Torus Hull + 84 Arch LEDs + Double Glass)
  // ---------------------------------------------------------------------------
  {
    const hf = parts.habitationFrame;

    // Closed Upper Crown Ring Soffit (seals top gap between outer glass and solar roof)
    const upperCrownProfile = [
      new THREE.Vector2(1.05, 4.02),
      new THREE.Vector2(1.05, 4.24),
      new THREE.Vector2(2.42, 4.22),
      new THREE.Vector2(4.12, 4.18),
      new THREE.Vector2(4.24, 4.01),
      new THREE.Vector2(1.05, 4.01),
    ];
    const upperCrownGeo = trackGeo(new THREE.LatheGeometry(upperCrownProfile, 72));
    const upperCrown = new THREE.Mesh(upperCrownGeo, brushedSilverMat);
    upperCrown.castShadow = true;
    upperCrown.receiveShadow = true;
    hf.add(upperCrown);

    // Lower & Upper Structural Perimeter Rings + Glowing LED Bands
    const ringLevels = [
      { r: 4.26, y: 2.86, tube: 0.058 },
      { r: 4.35, y: 3.44, tube: 0.052 },
      { r: 4.22, y: 4.02, tube: 0.058 },
      { r: 1.08, y: 2.88, tube: 0.05 },
      { r: 1.08, y: 4.02, tube: 0.05 },
    ];
    ringLevels.forEach((rl, idx) => {
      const geo = trackGeo(new THREE.TorusGeometry(rl.r, rl.tube, 14, 96));
      geo.rotateX(Math.PI / 2);
      const mesh = new THREE.Mesh(geo, brushedSilverMat);
      mesh.position.y = rl.y;
      mesh.castShadow = true;
      hf.add(mesh);

      const ledBandGeo = trackGeo(
        new THREE.TorusGeometry(idx < 3 ? rl.r + 0.056 : rl.r + 0.048, 0.014, 8, 96)
      );
      ledBandGeo.rotateX(Math.PI / 2);
      const ledBand = new THREE.Mesh(ledBandGeo, cyanLedMat);
      ledBand.position.y = rl.y;
      hf.add(ledBand);
    });

    // Double-tier curved panoramic glass skin (overlapping structural rings so zero slit gaps!)
    const lowerGlassGeo = trackGeo(new THREE.CylinderGeometry(4.33, 4.25, 0.59, 72, 1, true));
    const lowerGlass = new THREE.Mesh(lowerGlassGeo, glassMat);
    lowerGlass.position.y = 3.15;
    lowerGlass.renderOrder = 2;
    hf.add(lowerGlass);

    const upperGlassGeo = trackGeo(new THREE.CylinderGeometry(4.21, 4.33, 0.59, 72, 1, true));
    const upperGlass = new THREE.Mesh(upperGlassGeo, glassMat);
    upperGlass.position.y = 3.73;
    upperGlass.renderOrder = 2;
    hf.add(upperGlass);

    // 12 Radial Satin-Silver Structural Arches + 84 Arch-Mounted Cyan LEDs
    const archPoints = [
      new THREE.Vector3(1.06, 2.74, 0),
      new THREE.Vector3(2.85, 2.55, 0),
      new THREE.Vector3(4.36, 2.95, 0),
      new THREE.Vector3(4.44, 3.44, 0),
      new THREE.Vector3(4.3, 3.98, 0),
      new THREE.Vector3(2.8, 4.24, 0),
      new THREE.Vector3(1.06, 4.06, 0),
    ];
    const archCurve = new THREE.CatmullRomCurve3(archPoints);
    const archGeo = trackGeo(new THREE.TubeGeometry(archCurve, 36, 0.064, 12, false));

    const archLedGeo = trackGeo(new THREE.SphereGeometry(0.03, 10, 10));
    const archLeds = new THREE.InstancedMesh(archLedGeo, cyanLedMat, 84);
    const dummy = new THREE.Object3D();
    let ledIdx = 0;

    for (let i = 0; i < 12; i++) {
      const a = (i / 12) * Math.PI * 2;
      const arch = new THREE.Mesh(archGeo, brushedSilverMat);
      arch.rotation.y = a;
      arch.castShadow = true;
      hf.add(arch);

      for (let k = 0; k < 7; k++) {
        const pt = archCurve.getPoint(0.14 + k * 0.12);
        const rx = pt.x * Math.cos(a);
        const rz = -pt.x * Math.sin(a);
        dummy.position.set(rx, pt.y + (k >= 2 && k <= 4 ? 0 : 0.05), rz);
        dummy.updateMatrix();
        archLeds.setMatrixAt(ledIdx++, dummy.matrix);
      }
    }
    archLeds.instanceMatrix.needsUpdate = true;
    archLeds.computeBoundingSphere();
    hf.add(archLeds);
  }

  // ---------------------------------------------------------------------------
  // 6. SOLAR ROOF (Dual Concentric Closed Photovoltaic Array + 36 Perimeter LEDs)
  // ---------------------------------------------------------------------------
  {
    const sr = parts.solarRoof;
    const roofY = 4.22;

    // Solid backing plate so there are zero see-through gaps from beneath
    const backingGeo = trackGeo(new THREE.CylinderGeometry(4.12, 4.12, 0.06, 72));
    const backing = new THREE.Mesh(backingGeo, darkAnodizedMat);
    backing.position.y = roofY - 0.02;
    backing.receiveShadow = true;
    sr.add(backing);

    const outerRingGeo = trackGeo(new THREE.RingGeometry(2.38, 4.08, 72, 2));
    outerRingGeo.rotateX(-Math.PI / 2);
    const outerSolar = new THREE.Mesh(outerRingGeo, solarMat);
    outerSolar.position.y = roofY + 0.02;
    outerSolar.receiveShadow = true;
    sr.add(outerSolar);

    const innerRingGeo = trackGeo(new THREE.RingGeometry(1.06, 2.26, 64, 2));
    innerRingGeo.rotateX(-Math.PI / 2);
    const innerSolar = new THREE.Mesh(innerRingGeo, solarMat);
    innerSolar.position.y = roofY + 0.07;
    sr.add(innerSolar);

    [1.06, 2.26, 2.38, 4.1].forEach((r, idx) => {
      const collarGeo = trackGeo(new THREE.TorusGeometry(r, 0.036, 10, 72));
      collarGeo.rotateX(Math.PI / 2);
      const collar = new THREE.Mesh(collarGeo, brushedSilverMat);
      collar.position.y = idx < 2 ? roofY + 0.07 : roofY + 0.02;
      sr.add(collar);
    });

    // 36 Solar Rim LEDs
    const sLedGeo = trackGeo(new THREE.SphereGeometry(0.028, 8, 8));
    const sLeds = new THREE.InstancedMesh(sLedGeo, cyanLedMat, 36);
    const dummy = new THREE.Object3D();
    for (let i = 0; i < 36; i++) {
      const a = (i / 36) * Math.PI * 2;
      const rad = i % 3 === 0 ? 2.32 : 4.11;
      dummy.position.set(Math.cos(a) * rad, roofY + 0.06, Math.sin(a) * rad);
      dummy.updateMatrix();
      sLeds.setMatrixAt(i, dummy.matrix);
    }
    sLeds.instanceMatrix.needsUpdate = true;
    sLeds.computeBoundingSphere();
    sr.add(sLeds);
  }

  // ---------------------------------------------------------------------------
  // 7. UPPER HUB + IRON AIRLOCK DOOR + APPROACHING ORBITAL ROCKET / SHUTTLE
  // ---------------------------------------------------------------------------
  const rocketAssembly = new THREE.Group();
  const rocketPlumeOuter = new THREE.Group();
  const rocketGuideLineGroup = new THREE.Group();
  const leftIronDoor = new THREE.Group();
  const rightIronDoor = new THREE.Group();
  let plumeMesh: THREE.Mesh;
  let plumeCoreMesh: THREE.Mesh;

  {
    const uh = parts.upperHub;

    const collarGeo = trackGeo(new THREE.CylinderGeometry(0.62, 1.06, 0.56, 48));
    const collar = new THREE.Mesh(collarGeo, brushedSilverMat);
    collar.position.y = 4.48;
    uh.add(collar);

    const hubProfile = [
      new THREE.Vector2(0, 4.72),
      new THREE.Vector2(0.96, 4.72),
      new THREE.Vector2(1.06, 4.78),
      new THREE.Vector2(1.06, 5.0),
      new THREE.Vector2(0.96, 5.06),
      new THREE.Vector2(0, 5.06),
    ];
    const hubMesh = new THREE.Mesh(
      trackGeo(new THREE.LatheGeometry(hubProfile, 64)),
      brushedSilverMat
    );
    hubMesh.castShadow = true;
    hubMesh.receiveShadow = true;
    uh.add(hubMesh);

    [4.73, 4.89, 5.05].forEach((yy) => {
      const ringGeo = trackGeo(new THREE.TorusGeometry(1.02, 0.016, 8, 56));
      ringGeo.rotateX(Math.PI / 2);
      const rMesh = new THREE.Mesh(ringGeo, cyanLedMat);
      rMesh.position.y = yy;
      uh.add(rMesh);
    });

    // 3 Standard Shuttle Docking Clamps (ports +Z, -X, -Z); Port +X houses the Iron Airlock Door
    const clampGeo = trackGeo(new THREE.BoxGeometry(0.42, 0.14, 0.18));
    const beaconGeo = trackGeo(new THREE.SphereGeometry(0.036, 10, 10));
    const clamps = new THREE.InstancedMesh(clampGeo, brushedSilverMat, 3);
    const beacons = new THREE.InstancedMesh(beaconGeo, cyanLedMat, 24);
    const dummy = new THREE.Object3D();

    for (let i = 1; i <= 3; i++) {
      const a = (i / 4) * Math.PI * 2;
      dummy.position.set(Math.cos(a) * 1.22, 4.89, Math.sin(a) * 1.22);
      dummy.rotation.set(0, -a, 0);
      dummy.updateMatrix();
      clamps.setMatrixAt(i - 1, dummy.matrix);
      addGlowSprite(uh, Math.cos(a) * 1.44, 4.89, Math.sin(a) * 1.44, 0.42);
    }
    for (let i = 0; i < 24; i++) {
      const a = (i / 24) * Math.PI * 2;
      const rad = i % 6 === 0 ? 1.42 : 1.07;
      dummy.position.set(Math.cos(a) * rad, 4.89, Math.sin(a) * rad);
      dummy.rotation.set(0, 0, 0);
      dummy.updateMatrix();
      beacons.setMatrixAt(i, dummy.matrix);
    }
    clamps.instanceMatrix.needsUpdate = true;
    clamps.computeBoundingSphere();
    beacons.instanceMatrix.needsUpdate = true;
    beacons.computeBoundingSphere();
    uh.add(clamps, beacons);

    // -------------------------------------------------------------------------
    // HEAVY METALLIC IRON AIRLOCK DOOR ASSEMBLY AT +X ROCKET ENTRANCE (x=1.04..1.38)
    // -------------------------------------------------------------------------
    const airlockGroup = new THREE.Group();
    airlockGroup.position.set(0, 4.89, 0);

    // Recessed Pressurized Steel Airlock Tunnel (sealed back + top/bottom/sides)
    const tunnelFloorCeilGeo = trackGeo(new THREE.BoxGeometry(0.46, 0.05, 0.82));
    const tunnelSideGeo = trackGeo(new THREE.BoxGeometry(0.46, 0.56, 0.06));
    const tunnelBackGeo = trackGeo(new THREE.BoxGeometry(0.06, 0.56, 0.78));

    const tunnelCeil = new THREE.Mesh(tunnelFloorCeilGeo, ironFrameMat);
    tunnelCeil.position.set(1.14, 0.28, 0);
    const tunnelFloor = new THREE.Mesh(tunnelFloorCeilGeo, ironFrameMat);
    tunnelFloor.position.set(1.14, -0.28, 0);
    const tunnelWallL = new THREE.Mesh(tunnelSideGeo, ironFrameMat);
    tunnelWallL.position.set(1.14, 0, -0.39);
    const tunnelWallR = new THREE.Mesh(tunnelSideGeo, ironFrameMat);
    tunnelWallR.position.set(1.14, 0, 0.39);
    const tunnelBack = new THREE.Mesh(tunnelBackGeo, ironAccentMat);
    tunnelBack.position.set(0.95, 0, 0);
    airlockGroup.add(tunnelCeil, tunnelFloor, tunnelWallL, tunnelWallR, tunnelBack);

    // Interior Airlock Guiding LED Strips inside the tunnel
    const innerStripGeo = trackGeo(new THREE.BoxGeometry(0.34, 0.022, 0.022));
    [-0.33, 0.33].forEach((zz) => {
      const sLed = new THREE.Mesh(innerStripGeo, warmLedMat);
      sLed.position.set(1.14, 0.21, zz);
      airlockGroup.add(sLed);
    });

    // Armored Outer Portal Frame Pillars, Lintel & Threshold Sill (x = 1.35)
    const pillarGeo = trackGeo(new THREE.BoxGeometry(0.14, 0.72, 0.13));
    const leftPillar = new THREE.Mesh(pillarGeo, ironFrameMat);
    leftPillar.position.set(1.34, 0, -0.43);
    leftPillar.castShadow = true;
    const rightPillar = new THREE.Mesh(pillarGeo, ironFrameMat);
    rightPillar.position.set(1.34, 0, 0.43);
    rightPillar.castShadow = true;

    const beamGeo = trackGeo(new THREE.BoxGeometry(0.16, 0.1, 0.99));
    const topLintel = new THREE.Mesh(beamGeo, ironFrameMat);
    topLintel.position.set(1.34, 0.32, 0);
    topLintel.castShadow = true;
    const bottomSill = new THREE.Mesh(beamGeo, ironFrameMat);
    bottomSill.position.set(1.34, -0.32, 0);
    bottomSill.castShadow = true;
    airlockGroup.add(leftPillar, rightPillar, topLintel, bottomSill);

    // Steel Hydraulic Slide Tracks & Top/Bottom Status LED Bars
    const railGeo = trackGeo(new THREE.BoxGeometry(0.05, 0.032, 1.24));
    const topRail = new THREE.Mesh(railGeo, brushedSilverMat);
    topRail.position.set(1.39, 0.27, 0);
    const botRail = new THREE.Mesh(railGeo, brushedSilverMat);
    botRail.position.set(1.39, -0.27, 0);
    airlockGroup.add(topRail, botRail);

    const frameLedGeo = trackGeo(new THREE.BoxGeometry(0.024, 0.024, 0.74));
    const frameStatusLed = new THREE.Mesh(frameLedGeo, airlockStatusMat);
    frameStatusLed.position.set(1.425, 0.32, 0);
    airlockGroup.add(frameStatusLed);

    // Corner Rivet Bolts on the Armored Iron Frame
    const boltGeo = trackGeo(new THREE.CylinderGeometry(0.018, 0.018, 0.03, 10));
    boltGeo.rotateZ(Math.PI / 2);
    [
      [0.32, -0.43],
      [0.32, 0.43],
      [-0.32, -0.43],
      [-0.32, 0.43],
      [0.12, -0.43],
      [-0.12, -0.43],
      [0.12, 0.43],
      [-0.12, 0.43],
    ].forEach(([by, bz]) => {
      const bolt = new THREE.Mesh(boltGeo, brushedSilverMat);
      bolt.position.set(1.415, by, bz);
      airlockGroup.add(bolt);
    });

    // Dual Sliding Heavy Iron Blast Door Leaves (left & right)
    const buildIronDoorLeaf = (sideSign: -1 | 1, targetGroup: THREE.Group) => {
      const leafSlab = new THREE.Mesh(
        trackGeo(new THREE.BoxGeometry(0.068, 0.54, 0.38)),
        ironDoorLeafMat
      );
      leafSlab.castShadow = true;
      leafSlab.receiveShadow = true;
      targetGroup.add(leafSlab);

      // 3 Horizontal Forged Iron Reinforcement Ribs
      const ribGeo = trackGeo(new THREE.BoxGeometry(0.022, 0.048, 0.35));
      [-0.17, 0, 0.17].forEach((ry) => {
        const rib = new THREE.Mesh(ribGeo, ironAccentMat);
        rib.position.set(0.036, ry, 0);
        targetGroup.add(rib);
      });

      // Vertical Steel Interlocking Seam Flange & Heavy Iron Handle Bar on Inner Edge
      const seamBar = new THREE.Mesh(
        trackGeo(new THREE.BoxGeometry(0.084, 0.54, 0.045)),
        ironFrameMat
      );
      seamBar.position.set(0.006, 0, -sideSign * 0.172);
      targetGroup.add(seamBar);

      const handleBar = new THREE.Mesh(
        trackGeo(new THREE.CylinderGeometry(0.014, 0.014, 0.18, 10)),
        brushedSilverMat
      );
      handleBar.position.set(0.055, 0, -sideSign * 0.12);
      targetGroup.add(handleBar);

      // 4 Industrial Door Rivets + Glowing Door Status LED Strip
      const rivetGeo = trackGeo(new THREE.CylinderGeometry(0.014, 0.014, 0.022, 8));
      rivetGeo.rotateZ(Math.PI / 2);
      [
        [0.22, -0.11],
        [0.22, 0.11],
        [-0.22, -0.11],
        [-0.22, 0.11],
      ].forEach(([ry, rz]) => {
        const rv = new THREE.Mesh(rivetGeo, brushedSilverMat);
        rv.position.set(0.038, ry, rz);
        targetGroup.add(rv);
      });

      const doorLed = new THREE.Mesh(
        trackGeo(new THREE.BoxGeometry(0.018, 0.022, 0.24)),
        airlockStatusMat
      );
      doorLed.position.set(0.045, 0.085, 0);
      targetGroup.add(doorLed);
    };

    buildIronDoorLeaf(-1, leftIronDoor);
    buildIronDoorLeaf(1, rightIronDoor);
    leftIronDoor.position.set(1.33, 0, -0.19);
    rightIronDoor.position.set(1.33, 0, 0.19);
    airlockGroup.add(leftIronDoor, rightIronDoor);

    uh.add(airlockGroup);

    const neck = new THREE.Mesh(
      trackGeo(new THREE.CylinderGeometry(0.48, 0.62, 0.34, 48)),
      darkAnodizedMat
    );
    neck.position.y = 5.21;
    uh.add(neck);

    // -------------------------------------------------------------------------
    // APPROACH GUIDANCE LASER CORRIDOR (Port +X: from (1.36, 4.89, 0) out to (4.95, 6.28, 0))
    // -------------------------------------------------------------------------
    const guideCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(1.36, 4.89, 0),
      new THREE.Vector3(2.45, 4.96, 0),
      new THREE.Vector3(3.65, 5.58, 0),
      new THREE.Vector3(4.95, 6.28, 0),
    ]);
    const guideGeo = trackGeo(new THREE.BufferGeometry().setFromPoints(guideCurve.getPoints(32)));
    const guideMat = trackMat(
      new THREE.LineDashedMaterial({
        color: 0x38bdf8,
        dashSize: 0.14,
        gapSize: 0.1,
        transparent: true,
        opacity: 0.7,
      })
    );
    const guideLine = new THREE.Line(guideGeo, guideMat);
    guideLine.computeLineDistances();
    rocketGuideLineGroup.add(guideLine);

    // 3 Glowing Approach Corridor Alignment Rings
    [0.22, 0.48, 0.74].forEach((t) => {
      const pt = guideCurve.getPoint(t);
      const tan = guideCurve.getTangent(t);
      const gateGeo = trackGeo(new THREE.TorusGeometry(0.18, 0.008, 8, 24));
      const gate = new THREE.Mesh(gateGeo, cyanLedMat);
      gate.position.copy(pt);
      gate.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), tan);
      rocketGuideLineGroup.add(gate);
    });
    uh.add(rocketGuideLineGroup);

    // -------------------------------------------------------------------------
    // COMPOSITE 10-PART ORBITAL ROCKET / PASSENGER SHUTTLE (nose oriented along -X toward docking port)
    // -------------------------------------------------------------------------
    const rocketBody = new THREE.Group();
    // Build nose along +Y, then rotate Z by +PI/2 so nose points toward -X (the docking hub!)
    const hullProfile = [
      new THREE.Vector2(0.0, 0.92),
      new THREE.Vector2(0.08, 0.86),
      new THREE.Vector2(0.16, 0.68),
      new THREE.Vector2(0.21, 0.35),
      new THREE.Vector2(0.22, -0.35),
      new THREE.Vector2(0.2, -0.68),
      new THREE.Vector2(0.0, -0.68),
    ];
    const hullMesh = new THREE.Mesh(
      trackGeo(new THREE.LatheGeometry(hullProfile, 32)),
      matteWhiteMat
    );
    hullMesh.castShadow = true;
    rocketBody.add(hullMesh);

    // Dark thermal lower belly shield
    const bellyGeo = trackGeo(new THREE.CylinderGeometry(0.215, 0.205, 0.85, 24, 1, false, -0.8, 1.6));
    const bellyMesh = new THREE.Mesh(bellyGeo, shuttleTileMat);
    bellyMesh.position.y = -0.08;
    rocketBody.add(bellyMesh);

    // Forward docking probe ring (at nose tip y = 0.92)
    const probeRing = new THREE.Mesh(
      trackGeo(new THREE.TorusGeometry(0.068, 0.012, 8, 24)),
      cyanLedMat
    );
    probeRing.rotation.x = Math.PI / 2;
    probeRing.position.y = 0.9;
    rocketBody.add(probeRing);

    // Cockpit panoramic visor
    const cockpitGeo = trackGeo(new THREE.CylinderGeometry(0.165, 0.19, 0.18, 20, 1, false, -0.7, 1.4));
    const cockpitMesh = new THREE.Mesh(cockpitGeo, cockpitGlassMat);
    cockpitMesh.position.set(0, 0.56, 0.01);
    rocketBody.add(cockpitMesh);

    // Swept Delta Wings (ExtrudeGeometry)
    const wingShape = new THREE.Shape();
    wingShape.moveTo(0.16, 0.15);
    wingShape.lineTo(0.62, -0.52);
    wingShape.lineTo(0.62, -0.66);
    wingShape.lineTo(0.18, -0.64);
    wingShape.closePath();

    const wingGeo = trackGeo(
      new THREE.ExtrudeGeometry(wingShape, {
        depth: 0.024,
        bevelEnabled: true,
        bevelThickness: 0.008,
        bevelSize: 0.008,
      })
    );
    const rightWing = new THREE.Mesh(wingGeo, matteWhiteMat);
    rightWing.position.set(0, 0, -0.012);
    rocketBody.add(rightWing);

    const leftWing = new THREE.Mesh(wingGeo, matteWhiteMat);
    leftWing.scale.x = -1;
    leftWing.position.set(0, 0, -0.012);
    rocketBody.add(leftWing);

    // Vertical Tail Stabilizer Fin
    const finShape = new THREE.Shape();
    finShape.moveTo(0.16, -0.15);
    finShape.lineTo(0.48, -0.58);
    finShape.lineTo(0.48, -0.68);
    finShape.lineTo(0.18, -0.66);
    finShape.closePath();
    const tailGeo = trackGeo(
      new THREE.ExtrudeGeometry(finShape, {
        depth: 0.022,
        bevelEnabled: true,
        bevelThickness: 0.006,
        bevelSize: 0.006,
      })
    );
    const tailFin = new THREE.Mesh(tailGeo, darkAnodizedMat);
    tailFin.rotation.y = Math.PI / 2;
    tailFin.position.set(0.011, 0, 0);
    rocketBody.add(tailFin);

    // 3 Rear Thruster Nozzles
    const nozzleGeo = trackGeo(new THREE.CylinderGeometry(0.042, 0.065, 0.14, 16));
    [
      [0, -0.73, 0.075],
      [-0.07, -0.73, -0.05],
      [0.07, -0.73, -0.05],
    ].forEach(([nx, ny, nz]) => {
      const nozzle = new THREE.Mesh(nozzleGeo, darkTrimMat);
      nozzle.position.set(nx, ny, nz);
      rocketBody.add(nozzle);
    });

    // Rocket Navigation Wingtip & Fuselage LEDs
    const rLedGeo = trackGeo(new THREE.SphereGeometry(0.022, 8, 8));
    [
      [0.58, -0.6, 0],
      [-0.58, -0.6, 0],
      [0, -0.62, 0.45],
      [0, 0.32, 0.21],
    ].forEach(([lx, ly, lz]) => {
      const rLed = new THREE.Mesh(rLedGeo, cyanLedMat);
      rLed.position.set(lx, ly, lz);
      rocketBody.add(rLed);
    });

    // Animated Thruster Exhaust Plume (cone pointing -Y from nozzles)
    const plumeGeo = trackGeo(new THREE.ConeGeometry(0.15, 0.82, 20, 1, true));
    plumeGeo.translate(0, -0.41, 0);
    plumeMesh = new THREE.Mesh(plumeGeo, thrusterPlumeMat);
    plumeMesh.position.y = -0.78;
    rocketPlumeOuter.add(plumeMesh);

    const plumeCoreGeo = trackGeo(new THREE.ConeGeometry(0.07, 0.46, 16));
    plumeCoreGeo.translate(0, -0.23, 0);
    plumeCoreMesh = new THREE.Mesh(plumeCoreGeo, thrusterCoreMat);
    plumeCoreMesh.position.y = -0.78;
    rocketPlumeOuter.add(plumeCoreMesh);

    rocketBody.add(rocketPlumeOuter);

    // Rotate rocketBody so nose (+Y) points along -X toward docking port, tilted cleanly
    rocketBody.rotation.z = Math.PI / 2;
    rocketAssembly.add(rocketBody);
    rocketAssembly.position.set(2.9, 5.38, 0);
    uh.add(rocketAssembly);
  }

  // ---------------------------------------------------------------------------
  // 8. TELEMETRY SPIRE (Sealed Antenna Tower + 16 Spire LEDs)
  // ---------------------------------------------------------------------------
  {
    const sp = parts.spire;

    const towerBase = new THREE.Mesh(
      trackGeo(new THREE.CylinderGeometry(0.42, 0.48, 0.92, 48)),
      darkAnodizedMat
    );
    towerBase.position.y = 5.76;
    towerBase.castShadow = true;
    sp.add(towerBase);

    const finGeo = trackGeo(new THREE.BoxGeometry(0.14, 0.74, 0.03));
    for (let i = 0; i < 4; i++) {
      const a = (i / 4) * Math.PI * 2;
      const fin = new THREE.Mesh(finGeo, brushedSilverMat);
      fin.position.set(Math.cos(a) * 0.48, 5.76, Math.sin(a) * 0.48);
      fin.rotation.set(0, -a, 0);
      sp.add(fin);
    }

    const midCollar = new THREE.Mesh(
      trackGeo(new THREE.CylinderGeometry(0.46, 0.46, 0.045, 48)),
      brushedSilverMat
    );
    midCollar.position.y = 5.76;
    sp.add(midCollar);

    const cap = new THREE.Mesh(
      trackGeo(new THREE.CylinderGeometry(0.54, 0.56, 0.22, 48)),
      brushedSilverMat
    );
    cap.position.y = 6.29;
    cap.castShadow = true;
    sp.add(cap);

    const dome = new THREE.Mesh(
      trackGeo(new THREE.CylinderGeometry(0.28, 0.34, 0.16, 32)),
      brushedSilverMat
    );
    dome.position.y = 6.48;
    sp.add(dome);

    const mast = new THREE.Mesh(
      trackGeo(new THREE.CylinderGeometry(0.14, 0.18, 0.18, 24)),
      darkTrimMat
    );
    mast.position.y = 6.64;
    sp.add(mast);

    const needle = new THREE.Mesh(
      trackGeo(new THREE.CylinderGeometry(0.02, 0.042, 0.44, 16)),
      darkTrimMat
    );
    needle.position.y = 6.94;
    sp.add(needle);

    [
      { r: 0.48, y: 5.45 },
      { r: 0.47, y: 5.76 },
      { r: 0.56, y: 6.18 },
      { r: 0.32, y: 6.55 },
    ].forEach(({ r, y }) => {
      const ringGeo = trackGeo(new THREE.TorusGeometry(r, 0.014, 8, 40));
      ringGeo.rotateX(Math.PI / 2);
      const ring = new THREE.Mesh(ringGeo, cyanLedMat);
      ring.position.y = y;
      sp.add(ring);
    });

    const tipBeacons = new THREE.InstancedMesh(
      trackGeo(new THREE.SphereGeometry(0.03, 10, 10)),
      cyanLedMat,
      17
    );
    const dummy = new THREE.Object3D();
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * Math.PI * 2;
      dummy.position.set(Math.cos(a) * 0.55, 6.29, Math.sin(a) * 0.55);
      dummy.scale.setScalar(1);
      dummy.updateMatrix();
      tipBeacons.setMatrixAt(i, dummy.matrix);
    }
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * Math.PI * 2;
      dummy.position.set(Math.cos(a) * 0.46, 5.46, Math.sin(a) * 0.46);
      dummy.scale.setScalar(0.9);
      dummy.updateMatrix();
      tipBeacons.setMatrixAt(8 + i, dummy.matrix);
    }
    dummy.position.set(0, 7.16, 0);
    dummy.scale.setScalar(1.3);
    dummy.updateMatrix();
    tipBeacons.setMatrixAt(16, dummy.matrix);
    tipBeacons.instanceMatrix.needsUpdate = true;
    tipBeacons.computeBoundingSphere();
    sp.add(tipBeacons);

    addGlowSprite(sp, 0, 7.16, 0, 0.65);
  }

  // Tag every child mesh with partId & enable raycast layer 1
  (Object.keys(parts) as PartId[]).forEach((partId) => {
    parts[partId].traverse((obj) => {
      obj.userData.partId = partId;
      obj.layers.enable(1);
    });
  });

  // Selection Bounding Indicator (non-intrusive glowing highlight ring without distorting seams)
  const highlightRingGeo = trackGeo(new THREE.TorusGeometry(4.55, 0.022, 8, 96));
  highlightRingGeo.rotateX(Math.PI / 2);
  const highlightRingMat = trackMat(
    new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.78,
    })
  );
  const highlightRing = new THREE.Mesh(highlightRingGeo, highlightRingMat);
  highlightRing.visible = false;
  root.add(highlightRing);

  const partFocusConfig: Record<PartId, { y: number; scale: number }> = {
    pedestal: { y: 0.5, scale: 0.62 },
    lowerSpindle: { y: 1.9, scale: 0.25 },
    interiorDeck: { y: 3.15, scale: 1.0 },
    suites: { y: 3.35, scale: 0.55 },
    habitationFrame: { y: 3.45, scale: 1.03 },
    solarRoof: { y: 4.24, scale: 0.94 },
    upperHub: { y: 4.89, scale: 0.36 },
    spire: { y: 6.25, scale: 0.2 },
  };

  let activeHighlight: PartId | null = null;
  let activeSuite: number | null = null;

  const approachCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(4.95, 6.28, 0),
    new THREE.Vector3(3.65, 5.58, 0),
    new THREE.Vector3(2.68, 4.96, 0),
    new THREE.Vector3(2.06, 4.89, 0),
  ]);
  const _posTmp = new THREE.Vector3();
  const _tanTmp = new THREE.Vector3();
  const _amberColor = new THREE.Color(0xf59e0b);
  const _cyanColor = new THREE.Color(0x38bdf8);

  return {
    root,
    ringAssembly,
    parts,
    setLedIntensity: (intensity: number) => {
      cyanLedMat.emissiveIntensity = 2.8 * intensity;
      warmLedMat.emissiveIntensity = 2.4 * intensity;
      airlockStatusMat.emissiveIntensity = 2.2 * intensity;
      spriteMat.opacity = Math.min(0.8 * intensity, 0.95);
    },
    setHighlightPart: (partId: PartId | null) => {
      if (activeHighlight === partId) return;
      activeHighlight = partId;
      if (partId) {
        const cfg = partFocusConfig[partId];
        highlightRing.position.y = cfg.y;
        highlightRing.scale.set(cfg.scale, 1, cfg.scale);
        highlightRing.visible = true;
      } else {
        highlightRing.visible = false;
      }
    },
    setActiveSuiteIndex: (suiteIdx: number | null) => {
      if (activeSuite === suiteIdx) return;
      activeSuite = suiteIdx;
      suiteGroupRefs.forEach((grp, idx) => {
        grp.position.y = suiteIdx === idx ? 2.95 : 2.91;
      });
    },
    updateRocket: (elapsed: number, visible: boolean) => {
      rocketAssembly.visible = visible;
      rocketGuideLineGroup.visible = visible;
      if (!visible) {
        // Keep heavy iron blast doors tightly closed when no rocket is docking
        leftIronDoor.position.z = -0.19;
        rightIronDoor.position.z = 0.19;
        airlockStatusMat.emissive.copy(_amberColor);
        return;
      }

      // Smooth 14-second orbital docking cycle: approach -> iron doors slide open -> enter airlock -> retreat -> doors lock
      const cycle = (elapsed % 14) / 14;
      let u = 0;
      let thrustPower = 1;
      let doorOpen = 0;

      if (cycle < 0.65) {
        const p = cycle / 0.65;
        u = 1 - Math.pow(1 - p, 2.3);
        thrustPower = 1.0 - u * 0.65;
        // Doors stay sealed until p >= 0.22, then smoothly slide open as the rocket enters
        doorOpen = THREE.MathUtils.smoothstep(p, 0.22, 0.56);
      } else if (cycle < 0.85) {
        // Nose nestled right inside the open iron airlock doorway
        u = 1 - 0.015 * Math.sin(((cycle - 0.65) / 0.2) * Math.PI);
        thrustPower = 0.22;
        doorOpen = 1;
      } else {
        // Rocket pulls back and heavy iron blast doors slide shut behind it
        const p = (cycle - 0.85) / 0.15;
        u = 1 - p * p;
        thrustPower = 0.85;
        doorOpen = 1 - THREE.MathUtils.smoothstep(p, 0.35, 0.92);
      }

      // Slide dual iron door leaves smoothly along Z rails (closed at ±0.19, open to ±0.41)
      const leafOffset = 0.19 + doorOpen * 0.22;
      leftIronDoor.position.z = -leafOffset;
      rightIronDoor.position.z = leafOffset;
      airlockStatusMat.emissive.lerpColors(_amberColor, _cyanColor, doorOpen);

      approachCurve.getPoint(u, _posTmp);
      approachCurve.getTangent(u, _tanTmp);
      rocketAssembly.position.copy(_posTmp);

      // Pitch rocket smoothly along approach tangent (-tanTmp points forward toward iron airlock)
      const angleZ = Math.atan2(-_tanTmp.y, -_tanTmp.x);
      rocketAssembly.rotation.set(0, 0, angleZ);

      // Flickering exhaust plume
      const flicker = 0.85 + 0.22 * Math.sin(elapsed * 26);
      const scaleLen = Math.max(0.2, thrustPower * flicker);
      plumeMesh.scale.set(0.95, scaleLen, 0.95);
      plumeCoreMesh.scale.set(0.9, scaleLen * 1.1, 0.9);
      thrusterPlumeMat.opacity = 0.4 + 0.45 * thrustPower;
    },
    dispose: () => {
      geometries.forEach((g) => g.dispose());
      materials.forEach((m) => m.dispose());
    },
  };
}
