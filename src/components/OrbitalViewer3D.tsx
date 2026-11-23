import React, { useEffect, useImperativeHandle, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import {
  CAMERA_PRESETS,
  CameraPresetId,
  GENERATED_IMAGES,
  HOTEL_PARTS,
  PartId,
  SceneThemeId,
  VR_STATIONS,
  VrStationId,
  VrViewMode,
} from '../data/orbitalData';
import { createProceduralTextures } from '../three/proceduralTextures';
import { buildEnvironment } from '../three/buildEnvironment';
import { buildHotelModel } from '../three/buildHotelModel';

export interface WalkInput {
  forward: number;
  strafe: number;
}

export interface OrbitalViewer3DHandle {
  enterWebXr: () => Promise<{ ok: boolean; reason?: string }>;
  exitWebXr: () => Promise<void>;
  setVrStation: (station: VrStationId) => void;
  resetCamera: () => void;
}

interface OrbitalViewer3DProps {
  cameraPreset: CameraPresetId;
  presetTrigger: number;
  theme: SceneThemeId;
  explodeAmount: number;
  autoRotate: boolean;
  ledsEnabled: boolean;
  showRocket: boolean;
  showDistanceGuide: boolean;
  vrViewMode: VrViewMode;
  vrStation: VrStationId;
  selectedPart: PartId | null;
  selectedSuiteIndex: number | null;
  walkInput: WalkInput;
  onSelectPart: (part: PartId | null) => void;
  onWebXrSupportChange: (supported: boolean) => void;
  onWebXrPresentingChange: (presenting: boolean) => void;
  onVrStationChange: (station: VrStationId) => void;
}

function detectSoftwareGl(): boolean {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2');
    if (!gl) return true;
    const ext = gl.getExtension('WEBGL_debug_renderer_info');
    const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
    const gpu = String(gl.getParameter(param));
    gl.getExtension('WEBGL_lose_context')?.loseContext();
    return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
  } catch {
    return true;
  }
}

const _stereoLeftCam = new THREE.PerspectiveCamera();
const _stereoRightCam = new THREE.PerspectiveCamera();
const _lookEuler = new THREE.Euler(0, 0, 0, 'YXZ');
const _targetPos = new THREE.Vector3();
const _lookCenter = new THREE.Vector3();
const _eyeOffset = new THREE.Vector3();

function renderStereoPair(
  renderer: THREE.WebGLRenderer,
  scene: THREE.Scene,
  camera: THREE.PerspectiveCamera,
  width: number,
  height: number
) {
  const halfW = Math.floor(width / 2);
  const eyeSep = 0.032;

  camera.updateMatrixWorld();

  _stereoLeftCam.copy(camera);
  _stereoRightCam.copy(camera);
  _stereoLeftCam.aspect = Math.max(halfW, 1) / Math.max(height, 1);
  _stereoRightCam.aspect = Math.max(halfW, 1) / Math.max(height, 1);
  _stereoLeftCam.updateProjectionMatrix();
  _stereoRightCam.updateProjectionMatrix();

  _eyeOffset.set(1, 0, 0).applyQuaternion(camera.quaternion).multiplyScalar(eyeSep);
  _stereoLeftCam.position.copy(camera.position).sub(_eyeOffset);
  _stereoRightCam.position.copy(camera.position).add(_eyeOffset);

  renderer.setScissorTest(true);

  renderer.setViewport(0, 0, halfW, height);
  renderer.setScissor(0, 0, halfW, height);
  renderer.render(scene, _stereoLeftCam);

  renderer.setViewport(halfW, 0, width - halfW, height);
  renderer.setScissor(halfW, 0, width - halfW, height);
  renderer.render(scene, _stereoRightCam);

  renderer.setScissorTest(false);
  renderer.setViewport(0, 0, width, height);
}

export const OrbitalViewer3D = React.forwardRef<OrbitalViewer3DHandle, OrbitalViewer3DProps>(
  function OrbitalViewer3D(
    {
      cameraPreset,
      presetTrigger,
      theme,
      explodeAmount,
      autoRotate,
      ledsEnabled,
      showRocket,
      showDistanceGuide,
      vrViewMode,
      vrStation,
      selectedPart,
      selectedSuiteIndex,
      walkInput,
      onSelectPart,
      onWebXrSupportChange,
      onWebXrPresentingChange,
      onVrStationChange,
    },
    ref
  ) {
    const mountRef = useRef<HTMLDivElement>(null);
    const [contextLost, setContextLost] = useState(false);

    const stateRef = useRef({
      cameraPreset,
      theme,
      explodeAmount,
      autoRotate,
      ledsEnabled,
      showRocket,
      showDistanceGuide,
      vrViewMode,
      vrStation,
      selectedPart,
      selectedSuiteIndex,
      walkInput,
      onSelectPart,
      onWebXrPresentingChange,
      onVrStationChange,
    });

    stateRef.current = {
      cameraPreset,
      theme,
      explodeAmount,
      autoRotate,
      ledsEnabled,
      showRocket,
      showDistanceGuide,
      vrViewMode,
      vrStation,
      selectedPart,
      selectedSuiteIndex,
      walkInput,
      onSelectPart,
      onWebXrPresentingChange,
      onVrStationChange,
    };

    const transitionRef = useRef({
      active: false,
      pos: new THREE.Vector3(),
      target: new THREE.Vector3(),
      fov: 38,
    });

    const walkRef = useRef({
      yaw: 0.4,
      pitch: 0.02,
      ringAngle: 0.25,
      radialPos: 3.02,
      dragging: false,
      lastX: 0,
      lastY: 0,
      keys: {} as Record<string, boolean>,
    });

    const engineRef = useRef<{
      renderer: THREE.WebGLRenderer;
      scene: THREE.Scene;
      camera: THREE.PerspectiveCamera;
      controls: OrbitControls;
      hotel: ReturnType<typeof buildHotelModel>;
      envRig: ReturnType<typeof buildEnvironment>;
      vrRig: THREE.Group;
      activeXrSession: XRSession | null;
      applyCameraPreset: (id: CameraPresetId) => void;
      applyVrStationTransform: (id: VrStationId) => void;
      resetFirstPersonLook: (yaw?: number) => void;
    } | null>(null);

    useImperativeHandle(ref, () => ({
      enterWebXr: async () => {
        const eng = engineRef.current;
        if (!eng) return { ok: false, reason: '3D сахна дайын емес.' };
        if (!('xr' in navigator) || !navigator.xr) {
          return {
            ok: false,
            reason:
              'Бұл браузерде WebXR құрылғысы табылмады. Төмендегі «Стерео VR» режимін қолдана аласыз.',
          };
        }
        try {
          const supported = await navigator.xr.isSessionSupported('immersive-vr');
          if (!supported) {
            return {
              ok: false,
              reason:
                'VR гарнитура қосылмаған. Құрылғысыз тексеру үшін «Стерео VR» режимін ашыңыз.',
            };
          }
          const session = await navigator.xr.requestSession('immersive-vr', {
            optionalFeatures: ['local-floor', 'bounded-floor'],
          });
          eng.activeXrSession = session;
          eng.controls.enabled = false;
          eng.vrRig.add(eng.camera);
          eng.applyVrStationTransform(stateRef.current.vrStation);
          await eng.renderer.xr.setSession(session);
          stateRef.current.onWebXrPresentingChange(true);
          session.addEventListener('end', () => {
            eng.activeXrSession = null;
            eng.scene.add(eng.camera);
            eng.hotel.root.scale.setScalar(1);
            eng.controls.enabled = true;
            eng.applyCameraPreset('overview');
            stateRef.current.onWebXrPresentingChange(false);
          });
          return { ok: true };
        } catch (err) {
          return {
            ok: false,
            reason: err instanceof Error ? err.message : 'WebXR сессиясын бастау мүмкін болмады.',
          };
        }
      },
      exitWebXr: async () => {
        const eng = engineRef.current;
        if (eng?.activeXrSession) {
          await eng.activeXrSession.end();
        }
      },
      setVrStation: (station: VrStationId) => {
        engineRef.current?.applyVrStationTransform(station);
      },
      resetCamera: () => {
        engineRef.current?.applyCameraPreset('overview');
      },
    }));

    useEffect(() => {
      const container = mountRef.current;
      if (!container) return;

      const isSoftwareGl = detectSoftwareGl();
      const width = container.clientWidth || window.innerWidth;
      const height = container.clientHeight || window.innerHeight;

      const renderer = new THREE.WebGLRenderer({
        antialias: !isSoftwareGl,
        powerPreference: 'high-performance',
      });
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.08;
      renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
      renderer.setSize(width, height);
      renderer.shadowMap.enabled = !isSoftwareGl;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      renderer.xr.enabled = true;
      container.appendChild(renderer.domElement);

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(38, width / height, 0.05, 220);
      const initialPreset = CAMERA_PRESETS[0];
      camera.position.set(...initialPreset.position);

      const controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = !isSoftwareGl;
      controls.dampingFactor = 0.06;
      controls.minDistance = 1.8;
      controls.maxDistance = 26;
      controls.maxPolarAngle = Math.PI * 0.85;
      controls.target.set(...initialPreset.target);
      controls.update();

      const onControlStart = () => {
        transitionRef.current.active = false;
      };
      controls.addEventListener('start', onControlStart);

      const textures = createProceduralTextures(renderer.capabilities.getMaxAnisotropy());
      const envRig = buildEnvironment(scene, renderer, textures, isSoftwareGl);
      const hotel = buildHotelModel(textures, isSoftwareGl);
      scene.add(hotel.root);

      const vrRig = new THREE.Group();
      scene.add(vrRig);

      if (!isSoftwareGl) {
        renderer.compile(scene, camera);
      }

      const applyCameraPreset = (presetId: CameraPresetId) => {
        const preset = CAMERA_PRESETS.find((p) => p.id === presetId) ?? CAMERA_PRESETS[0];
        transitionRef.current.pos.set(...preset.position);
        transitionRef.current.target.set(...preset.target);
        transitionRef.current.fov = preset.fov;
        transitionRef.current.active = true;
      };

      const applyVrStationTransform = (stationId: VrStationId) => {
        const st = VR_STATIONS.find((s) => s.id === stationId) ?? VR_STATIONS[0];
        hotel.root.scale.setScalar(st.hotelScale);
        vrRig.position.set(...st.position);
        vrRig.rotation.set(0, st.lookYaw, 0);
      };

      engineRef.current = {
        renderer,
        scene,
        camera,
        controls,
        hotel,
        envRig,
        vrRig,
        activeXrSession: null,
        applyCameraPreset,
        applyVrStationTransform,
        resetFirstPersonLook: (yaw = 0.25) => {
          walkRef.current.yaw = yaw;
          walkRef.current.pitch = 0.02;
          walkRef.current.ringAngle = 0.25;
          walkRef.current.radialPos = 3.02;
        },
      };

      // Check WebXR support
      if ('xr' in navigator && navigator.xr) {
        navigator.xr
          .isSessionSupported('immersive-vr')
          .then((ok) => onWebXrSupportChange(ok))
          .catch(() => onWebXrSupportChange(false));
      } else {
        onWebXrSupportChange(false);
      }

      // Raycasting & First-Person Look Listeners
      const raycaster = new THREE.Raycaster();
      raycaster.layers.set(1);
      const downPos = { x: 0, y: 0 };
      const pointerNdc = new THREE.Vector2();

      const onPointerDown = (e: PointerEvent) => {
        downPos.x = e.clientX;
        downPos.y = e.clientY;
        const mode = stateRef.current.vrViewMode;
        if (mode === 'stereo' || mode === 'walk') {
          walkRef.current.dragging = true;
          walkRef.current.lastX = e.clientX;
          walkRef.current.lastY = e.clientY;
        }
      };

      const onPointerMove = (e: PointerEvent) => {
        const mode = stateRef.current.vrViewMode;
        if ((mode === 'stereo' || mode === 'walk') && walkRef.current.dragging) {
          const dx = e.clientX - walkRef.current.lastX;
          const dy = e.clientY - walkRef.current.lastY;
          walkRef.current.lastX = e.clientX;
          walkRef.current.lastY = e.clientY;
          walkRef.current.yaw -= dx * 0.0045;
          walkRef.current.pitch = THREE.MathUtils.clamp(
            walkRef.current.pitch - dy * 0.0045,
            -Math.PI * 0.42,
            Math.PI * 0.42
          );
        }
      };

      const onPointerUp = (e: PointerEvent) => {
        walkRef.current.dragging = false;
        const mode = stateRef.current.vrViewMode;
        if (mode === 'stereo' || mode === 'walk') return;
        if (Math.hypot(e.clientX - downPos.x, e.clientY - downPos.y) > 5) return;

        const rect = renderer.domElement.getBoundingClientRect();
        pointerNdc.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        pointerNdc.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

        raycaster.setFromCamera(pointerNdc, camera);
        const hits = raycaster.intersectObjects([hotel.root], true);
        if (hits.length > 0) {
          let obj: THREE.Object3D | null = hits[0].object;
          while (obj && !obj.userData.partId) {
            obj = obj.parent;
          }
          const partId = obj?.userData.partId as PartId | undefined;
          if (partId) {
            stateRef.current.onSelectPart(partId);
          }
        } else {
          stateRef.current.onSelectPart(null);
        }
      };

      const onKeyDown = (e: KeyboardEvent) => {
        walkRef.current.keys[e.code] = true;
      };
      const onKeyUp = (e: KeyboardEvent) => {
        walkRef.current.keys[e.code] = false;
      };

      const onContextLost = (e: Event) => {
        e.preventDefault();
        setContextLost(true);
      };
      const onContextRestored = () => {
        setContextLost(false);
      };

      const onResize = () => {
        if (!container) return;
        const w = container.clientWidth || window.innerWidth;
        const h = container.clientHeight || window.innerHeight;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      };

      const dom = renderer.domElement;
      dom.addEventListener('pointerdown', onPointerDown);
      window.addEventListener('pointermove', onPointerMove);
      window.addEventListener('pointerup', onPointerUp);
      window.addEventListener('keydown', onKeyDown);
      window.addEventListener('keyup', onKeyUp);
      dom.addEventListener('webglcontextlost', onContextLost);
      dom.addEventListener('webglcontextrestored', onContextRestored);
      window.addEventListener('resize', onResize);

      // Exploded Y offsets damped per frame
      const currentOffsets: Record<PartId, number> = {
        pedestal: 0,
        lowerSpindle: 0,
        interiorDeck: 0,
        suites: 0,
        habitationFrame: 0,
        solarRoof: 0,
        upperHub: 0,
        spire: 0,
      };

      const clock = new THREE.Clock();
      let frameId = 0;
      let disposed = false;

      const stepScene = (delta: number, elapsed: number) => {
        const s = stateRef.current;

        // Smooth explode transitions
        (Object.keys(hotel.parts) as PartId[]).forEach((pid) => {
          const targetY = HOTEL_PARTS[pid].explodeOffset * s.explodeAmount;
          currentOffsets[pid] = THREE.MathUtils.damp(currentOffsets[pid], targetY, 7.5, delta);
          hotel.parts[pid].position.y = currentOffsets[pid];
        });

        // Auto-rotate station ring unless inside atrium/suites/walk/rocket closeup
        const lockRotation =
          s.vrViewMode === 'walk' ||
          s.cameraPreset === 'atrium' ||
          s.cameraPreset === 'suites' ||
          s.cameraPreset === 'rocket';
        if (s.autoRotate && !lockRotation) {
          hotel.ringAssembly.rotation.y += delta * 0.16;
        } else if (s.cameraPreset === 'rocket') {
          hotel.ringAssembly.rotation.y = THREE.MathUtils.damp(
            hotel.ringAssembly.rotation.y,
            0,
            6,
            delta
          );
        }

        // LED intensity pulse
        if (s.ledsEnabled) {
          const pulse = 0.92 + 0.14 * Math.sin(elapsed * 2.4);
          hotel.setLedIntensity(pulse);
        } else {
          hotel.setLedIntensity(0.06);
        }

        hotel.updateRocket(elapsed, s.showRocket);
        envRig.update(delta, elapsed);

        if (!renderer.xr.isPresenting) {
          if (
            s.vrViewMode === 'walk' ||
            (s.vrViewMode === 'stereo' && s.vrStation === 'atrium')
          ) {
            const w = walkRef.current;
            const k = w.keys;
            const fwd =
              (k.KeyW || k.ArrowUp ? 1 : 0) -
              (k.KeyS || k.ArrowDown ? 1 : 0) +
              s.walkInput.forward;
            const str =
              (k.KeyD || k.ArrowRight ? 1 : 0) -
              (k.KeyA || k.ArrowLeft ? 1 : 0) +
              s.walkInput.strafe;

            const speed = delta * 1.15;
            const cosY = Math.cos(w.yaw);
            const sinY = Math.sin(w.yaw);
            const dx = (-sinY * fwd + cosY * str) * speed;
            const dz = (-cosY * fwd - sinY * str) * speed;

            const nx = Math.cos(w.ringAngle) * w.radialPos + dx;
            const nz = Math.sin(w.ringAngle) * w.radialPos + dz;
            w.ringAngle = Math.atan2(nz, nx);
            w.radialPos = THREE.MathUtils.clamp(Math.hypot(nx, nz), 2.66, 3.85);

            const cx = Math.cos(w.ringAngle) * w.radialPos;
            const cz = Math.sin(w.ringAngle) * w.radialPos;
            const cy = 3.24 + currentOffsets.interiorDeck;

            camera.position.set(cx, cy, cz);
            _lookEuler.set(w.pitch, w.yaw, 0, 'YXZ');
            camera.quaternion.setFromEuler(_lookEuler);

            if (Math.abs(camera.fov - 62) > 0.1) {
              camera.fov = THREE.MathUtils.damp(camera.fov, 62, 6, delta);
              camera.updateProjectionMatrix();
            }
          } else if (s.vrViewMode === 'stereo') {
            const w = walkRef.current;
            if (Math.abs(camera.fov - 70) > 0.1) {
              camera.fov = THREE.MathUtils.damp(camera.fov, 70, 6, delta);
              camera.updateProjectionMatrix();
            }
            const radius =
              s.vrStation === 'spire' ? 4.4 : s.vrStation === 'pedestal' ? 4.8 : 9.2;
            const heightY =
              s.vrStation === 'spire' ? 5.3 : s.vrStation === 'pedestal' ? 1.1 : 3.25;

            _targetPos.set(
              Math.sin(w.yaw) * Math.cos(w.pitch) * radius,
              heightY + Math.sin(-w.pitch) * radius * 0.65,
              Math.cos(w.yaw) * Math.cos(w.pitch) * radius
            );
            camera.position.lerp(_targetPos, 1 - Math.exp(-8 * delta));
            _lookCenter.set(0, heightY, 0);
            camera.lookAt(_lookCenter);
          } else {
            if (transitionRef.current.active) {
              const t = transitionRef.current;
              camera.position.x = THREE.MathUtils.damp(camera.position.x, t.pos.x, 6, delta);
              camera.position.y = THREE.MathUtils.damp(camera.position.y, t.pos.y, 6, delta);
              camera.position.z = THREE.MathUtils.damp(camera.position.z, t.pos.z, 6, delta);
              controls.target.x = THREE.MathUtils.damp(controls.target.x, t.target.x, 6, delta);
              controls.target.y = THREE.MathUtils.damp(controls.target.y, t.target.y, 6, delta);
              controls.target.z = THREE.MathUtils.damp(controls.target.z, t.target.z, 6, delta);

              if (Math.abs(camera.fov - t.fov) > 0.05) {
                camera.fov = THREE.MathUtils.damp(camera.fov, t.fov, 6, delta);
                camera.updateProjectionMatrix();
              }
              if (
                camera.position.distanceTo(t.pos) < 0.015 &&
                controls.target.distanceTo(t.target) < 0.015
              ) {
                t.active = false;
              }
            }
            controls.update();
          }
        }
      };

      const renderFrame = () => {
        const w = container.clientWidth || window.innerWidth;
        const h = container.clientHeight || window.innerHeight;
        if (!renderer.xr.isPresenting && stateRef.current.vrViewMode === 'stereo') {
          renderStereoPair(renderer, scene, camera, w, h);
        } else {
          renderer.render(scene, camera);
        }
      };

      const afterDraw = (cb: () => void) => {
        const gl = renderer.getContext() as WebGL2RenderingContext;
        const sync = gl.fenceSync ? gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0) : null;
        gl.flush();
        const poll = () => {
          if (disposed) return;
          const status = sync ? gl.getSyncParameter(sync, gl.SYNC_STATUS) : gl.SIGNALED;
          if (status === gl.UNSIGNALED) {
            frameId = window.setTimeout(poll, 5);
          } else {
            if (sync) gl.deleteSync(sync);
            frameId = window.setTimeout(cb, 80);
          }
        };
        frameId = window.setTimeout(poll, 5);
      };

      const tick = () => {
        if (disposed || renderer.xr.isPresenting) return;
        const delta = Math.min(clock.getDelta(), 0.1);
        const elapsed = clock.getElapsedTime();
        stepScene(delta, elapsed);
        renderFrame();
        if (isSoftwareGl) {
          afterDraw(tick);
        } else {
          frameId = requestAnimationFrame(tick);
        }
      };

      renderer.setAnimationLoop(() => {
        if (!renderer.xr.isPresenting) return;
        const delta = Math.min(clock.getDelta(), 0.1);
        const elapsed = clock.getElapsedTime();
        stepScene(delta, elapsed);
        renderer.render(scene, camera);
      });

      tick();

      return () => {
        disposed = true;
        cancelAnimationFrame(frameId);
        clearTimeout(frameId);
        renderer.setAnimationLoop(null);
        controls.removeEventListener('start', onControlStart);
        controls.dispose();
        dom.removeEventListener('pointerdown', onPointerDown);
        window.removeEventListener('pointermove', onPointerMove);
        window.removeEventListener('pointerup', onPointerUp);
        window.removeEventListener('keydown', onKeyDown);
        window.removeEventListener('keyup', onKeyUp);
        dom.removeEventListener('webglcontextlost', onContextLost);
        dom.removeEventListener('webglcontextrestored', onContextRestored);
        window.removeEventListener('resize', onResize);
        hotel.dispose();
        envRig.dispose();
        textures.dispose();
        renderer.dispose();
        if (dom.parentNode === container) {
          container.removeChild(dom);
        }
        engineRef.current = null;
      };
    }, [onWebXrSupportChange]);

    useEffect(() => {
      engineRef.current?.envRig.applyTheme(theme);
    }, [theme]);

    useEffect(() => {
      if (stateRef.current.vrViewMode === 'none') {
        engineRef.current?.applyCameraPreset(cameraPreset);
      }
    }, [cameraPreset, presetTrigger]);

    useEffect(() => {
      const eng = engineRef.current;
      if (!eng) return;
      if (vrViewMode === 'walk') {
        eng.controls.enabled = false;
        transitionRef.current.active = false;
        eng.resetFirstPersonLook(1.1);
      } else if (vrViewMode === 'stereo') {
        eng.controls.enabled = false;
        transitionRef.current.active = false;
        eng.resetFirstPersonLook(0.65);
      } else {
        eng.controls.enabled = true;
        eng.hotel.root.scale.setScalar(1);
        eng.applyCameraPreset(cameraPreset);
      }
    }, [vrViewMode, cameraPreset]);

    useEffect(() => {
      engineRef.current?.hotel.setHighlightPart(selectedPart);
    }, [selectedPart]);

    useEffect(() => {
      engineRef.current?.hotel.setActiveSuiteIndex(selectedSuiteIndex);
    }, [selectedSuiteIndex]);

    useEffect(() => {
      engineRef.current?.envRig.setDistanceGuideVisible(showDistanceGuide);
    }, [showDistanceGuide]);

    return (
      <div className="relative h-full w-full overflow-hidden">
        <div ref={mountRef} className="h-full w-full cursor-grab active:cursor-grabbing" />

        {vrViewMode === 'stereo' && !contextLost && (
          <div className="pointer-events-none fixed inset-0 z-20 flex items-center justify-center">
            <div className="absolute inset-y-0 left-1/2 w-[2px] -translate-x-1/2 bg-black/80" />
            <div className="flex w-1/2 items-center justify-center">
              <div className="h-2.5 w-2.5 rounded-full border border-sky-300/80" />
            </div>
            <div className="flex w-1/2 items-center justify-center">
              <div className="h-2.5 w-2.5 rounded-full border border-sky-300/80" />
            </div>
          </div>
        )}

        {contextLost && (
          <div className="absolute inset-0 z-30 flex items-center justify-center bg-slate-950/95 p-6 text-slate-100">
            <div className="max-w-md rounded-xl border border-slate-800 bg-slate-900 p-6 text-center">
              <img
                src={GENERATED_IMAGES.model}
                alt="Orbital Hotel 3D моделінің түпнұсқа бейнесі"
                referrerPolicy="no-referrer"
                className="mx-auto mb-4 h-48 w-full rounded-lg object-cover"
              />
              <h2 className="text-lg font-semibold">3D графикалық контекст үзілді</h2>
              <p className="mt-2 text-sm text-slate-400">
                WebGL контексті қайта қалпына келтірілуде. Егер көрінбесе, бетті жаңартыңыз.
              </p>
            </div>
          </div>
        )}
      </div>
    );
  }
);
