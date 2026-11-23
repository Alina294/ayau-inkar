/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useCallback, useRef, useState } from 'react';
import { ArrowDown, Compass, Glasses } from 'lucide-react';
import {
  CameraPresetId,
  ORBITAL_SUITES,
  PartId,
  SceneThemeId,
  SuiteInfo,
  VrStationId,
  VrViewMode,
} from './data/orbitalData';
import {
  OrbitalViewer3D,
  OrbitalViewer3DHandle,
  WalkInput,
} from './components/OrbitalViewer3D';
import { ViewerHud } from './components/ViewerHud';
import { ArchitectureExplorer } from './components/ArchitectureExplorer';
import { SuitesRingExplorer } from './components/SuitesRingExplorer';
import { InfrastructureSection } from './components/InfrastructureSection';
import { BookingSection } from './components/BookingSection';

export default function App() {
  const viewerRef = useRef<OrbitalViewer3DHandle>(null);
  const stageContainerRef = useRef<HTMLDivElement>(null);

  const [cameraPreset, setCameraPreset] = useState<CameraPresetId>('overview');
  const [presetTrigger, setPresetTrigger] = useState(0);
  const [theme, setTheme] = useState<SceneThemeId>('orbit');
  const [explodeAmount, setExplodeAmount] = useState(0);
  const [autoRotate, setAutoRotate] = useState(true);
  const [ledsEnabled, setLedsEnabled] = useState(true);
  const [showRocket, setShowRocket] = useState(true);
  const [showDistanceGuide, setShowDistanceGuide] = useState(true);
  const [vrViewMode, setVrViewMode] = useState<VrViewMode>('none');
  const [vrStation, setVrStation] = useState<VrStationId>('overview');
  const [webXrSupported, setWebXrSupported] = useState(false);
  const [webXrPresenting, setWebXrPresenting] = useState(false);
  const [selectedPart, setSelectedPart] = useState<PartId | null>(null);
  const [selectedSuiteNumber, setSelectedSuiteNumber] = useState<number>(101);
  const [bookingSuiteNumber, setBookingSuiteNumber] = useState<number>(101);
  const [vrNotice, setVrNotice] = useState<string | null>(null);
  const [walkInput, setWalkInput] = useState<WalkInput>({ forward: 0, strafe: 0 });
  const [isFullscreen, setIsFullscreen] = useState(false);

  const scrollToSection = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  const handleSelectCameraPreset = useCallback((preset: CameraPresetId) => {
    setVrViewMode('none');
    setCameraPreset(preset);
    setPresetTrigger((n) => n + 1);
  }, []);

  const handleEnterWebXr = useCallback(async () => {
    if (!viewerRef.current) return;
    if (webXrPresenting) {
      await viewerRef.current.exitWebXr();
      return;
    }
    const res = await viewerRef.current.enterWebXr();
    if (!res.ok && res.reason) {
      setVrNotice(res.reason);
    } else {
      setVrNotice(null);
    }
  }, [webXrPresenting]);

  const handleSelectVrStation = useCallback((station: VrStationId) => {
    setVrStation(station);
    viewerRef.current?.setVrStation(station);
  }, []);

  const handleInspectPartIn3D = useCallback(
    (partId: PartId, withExplode = false) => {
      setVrViewMode('none');
      setSelectedPart(partId);
      setExplodeAmount(withExplode ? 0.82 : 0);
      const targetPreset: CameraPresetId =
        partId === 'pedestal' || partId === 'lowerSpindle'
          ? 'pedestal'
          : partId === 'interiorDeck'
          ? 'atrium'
          : partId === 'suites'
          ? 'suites'
          : partId === 'solarRoof'
          ? 'solarRoof'
          : partId === 'upperHub' || partId === 'spire'
          ? 'upperHub'
          : 'overview';
      setCameraPreset(targetPreset);
      setPresetTrigger((n) => n + 1);
      scrollToSection('viewer-3d');
    },
    [scrollToSection]
  );

  const handleViewSuiteIn3D = useCallback(
    (suiteIndex: number) => {
      const suite = ORBITAL_SUITES[suiteIndex];
      if (suite) setSelectedSuiteNumber(suite.number);
      setVrViewMode('none');
      setSelectedPart('suites');
      setExplodeAmount(0.28);
      setCameraPreset('suites');
      setPresetTrigger((n) => n + 1);
      scrollToSection('viewer-3d');
    },
    [scrollToSection]
  );

  const handleSelectSuite = useCallback((suite: SuiteInfo) => {
    setSelectedSuiteNumber(suite.number);
  }, []);

  const handleBookSuite = useCallback(
    (suiteNumber: number) => {
      setBookingSuiteNumber(suiteNumber);
      scrollToSection('booking');
    },
    [scrollToSection]
  );

  const handleLaunchCameraFromInfra = useCallback(
    (preset: CameraPresetId, vrMode?: VrViewMode) => {
      setExplodeAmount(0);
      if (vrMode) {
        setVrViewMode(vrMode);
      } else {
        setVrViewMode('none');
        setCameraPreset(preset);
        setPresetTrigger((n) => n + 1);
      }
      scrollToSection('viewer-3d');
    },
    [scrollToSection]
  );

  const handleToggleFullscreen = useCallback(async () => {
    const next = !isFullscreen;
    setIsFullscreen(next);
    const el = stageContainerRef.current;
    if (!el) return;
    try {
      if (next && document.fullscreenElement !== el && el.requestFullscreen) {
        await el.requestFullscreen();
      } else if (!next && document.fullscreenElement) {
        await document.exitFullscreen();
      }
    } catch {
      // CSS fixed-inset fullscreen fallback still handles it cleanly
    }
  }, [isFullscreen]);

  const activeSuiteIndex = ORBITAL_SUITES.findIndex((s) => s.number === selectedSuiteNumber);

  return (
    <div className="min-h-screen bg-[#07090E] text-slate-100">
      {/* Top Navigation Bar — 3-Zone Contract */}
      <header className="sticky top-0 z-40 border-b border-slate-800/80 bg-[#07090E]/95">
        <div className="mx-auto flex max-w-[1280px] items-center justify-between gap-8 px-4 py-3.5 sm:px-6 lg:px-8">
          {/* Zone 1: Single-line Brand Wordmark */}
          <a
            href="#top"
            className="text-base font-bold tracking-tight text-white whitespace-nowrap shrink-0"
          >
            Orbital Hotel
          </a>

          {/* Zone 2: 4 Concise Single-Line Links */}
          <nav className="hidden items-center gap-7 text-sm font-medium text-slate-400 md:flex">
            <a
              href="#viewer-3d"
              className="transition-colors hover:text-white whitespace-nowrap shrink-0"
            >
              3D &amp; VR
            </a>
            <a
              href="#architecture"
              className="transition-colors hover:text-white whitespace-nowrap shrink-0"
            >
              Архитектура
            </a>
            <a
              href="#suites"
              className="transition-colors hover:text-white whitespace-nowrap shrink-0"
            >
              Нөмірлер
            </a>
            <a
              href="#infrastructure"
              className="transition-colors hover:text-white whitespace-nowrap shrink-0"
            >
              Инфрақұрылым
            </a>
          </nav>

          {/* Zone 3: 1 Primary CTA */}
          <div className="shrink-0">
            <button
              type="button"
              onClick={() => scrollToSection('booking')}
              className="cursor-pointer rounded-lg bg-sky-600 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-sky-500 whitespace-nowrap shrink-0"
            >
              Тур брондау
            </button>
          </div>
        </div>
      </header>

      <main id="top">
        {/* Hero Proposition */}
        <section className="mx-auto max-w-[1280px] px-4 pt-10 pb-8 sm:px-6 lg:px-8 lg:pt-14">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
                <span className="font-medium text-sky-400">Төменгі Жер орбитасы · 420 км</span>
                <span aria-hidden="true">·</span>
                <span>12 люкс сектор (№101–112)</span>
                <span aria-hidden="true">·</span>
                <span>0.38 g жасанды тартылыс</span>
              </div>

              <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-5xl [text-wrap:balance]">
                Orbital Hotel архитектуралық кешені және интерактивті 3D/VR кеңістігі
              </h1>

              <p className="mt-4 max-w-2xl text-sm leading-relaxed text-slate-300 sm:text-base">
                Сатин-күміс радиалды аркалардан, 360° ботаникалық променадтан және қос сақиналы
                күн массивінен тұратын орбиталық қонақүйді нақты уақыт режимінде зерттеп, болашақ
                экспедицияға нөмір брондаңыз.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <button
                type="button"
                onClick={() => {
                  setVrViewMode('walk');
                  scrollToSection('viewer-3d');
                }}
                className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-slate-700 bg-slate-900 px-4 py-2.5 text-xs font-medium text-slate-100 transition-colors hover:bg-slate-800 whitespace-nowrap shrink-0"
              >
                <Compass className="h-4 w-4 text-sky-400" />
                <span>Атриум серуені (1-ші жақ)</span>
              </button>
              <button
                type="button"
                onClick={() => scrollToSection('suites')}
                className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-slate-100 px-4 py-2.5 text-xs font-semibold text-slate-950 transition-colors hover:bg-white whitespace-nowrap shrink-0"
              >
                <span>Нөмірлерді таңдау</span>
                <ArrowDown className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </section>

        {/* Full-Width Interactive 3D & WebXR VR Stage */}
        <section id="viewer-3d" className="mx-auto max-w-[1280px] px-4 pb-16 sm:px-6 lg:px-8">
          <div
            ref={stageContainerRef}
            className={
              isFullscreen
                ? 'fixed inset-0 z-50 h-screen w-screen overflow-hidden bg-slate-950'
                : 'relative h-[560px] w-full overflow-hidden rounded-2xl border border-slate-800 bg-slate-950 sm:h-[640px] lg:h-[720px]'
            }
          >
            <OrbitalViewer3D
              ref={viewerRef}
              cameraPreset={cameraPreset}
              presetTrigger={presetTrigger}
              theme={theme}
              explodeAmount={explodeAmount}
              autoRotate={autoRotate}
              ledsEnabled={ledsEnabled}
              showRocket={showRocket}
              showDistanceGuide={showDistanceGuide}
              vrViewMode={vrViewMode}
              vrStation={vrStation}
              selectedPart={selectedPart}
              selectedSuiteIndex={activeSuiteIndex >= 0 ? activeSuiteIndex : null}
              walkInput={walkInput}
              onSelectPart={setSelectedPart}
              onWebXrSupportChange={setWebXrSupported}
              onWebXrPresentingChange={setWebXrPresenting}
              onVrStationChange={setVrStation}
            />

            <ViewerHud
              cameraPreset={cameraPreset}
              theme={theme}
              explodeAmount={explodeAmount}
              autoRotate={autoRotate}
              ledsEnabled={ledsEnabled}
              showRocket={showRocket}
              showDistanceGuide={showDistanceGuide}
              vrViewMode={vrViewMode}
              vrStation={vrStation}
              webXrSupported={webXrSupported}
              webXrPresenting={webXrPresenting}
              selectedPart={selectedPart}
              vrNotice={vrNotice}
              isFullscreen={isFullscreen}
              onSelectCameraPreset={handleSelectCameraPreset}
              onSelectTheme={setTheme}
              onChangeExplode={setExplodeAmount}
              onToggleAutoRotate={() => setAutoRotate((v) => !v)}
              onToggleLeds={() => setLedsEnabled((v) => !v)}
              onToggleRocket={() => setShowRocket((v) => !v)}
              onToggleDistanceGuide={() => setShowDistanceGuide((v) => !v)}
              onEnterWebXr={handleEnterWebXr}
              onSetVrViewMode={setVrViewMode}
              onSelectVrStation={handleSelectVrStation}
              onSelectPart={setSelectedPart}
              onWalkInputChange={setWalkInput}
              onDismissNotice={() => setVrNotice(null)}
              onToggleFullscreen={handleToggleFullscreen}
            />
          </div>

          <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
            <div className="flex items-center gap-2">
              <Glasses className="h-3.5 w-3.5 text-sky-400" />
              <span>
                Кеңес: Станцияның 8 бөлігін бөлектеу үшін модельдің үстінен басыңыз немесе «Бөлшектеу»
                жүгірткісін жылжытыңыз.
              </span>
            </div>
            <span className="font-mono-tabular">WebGL2 · WebXR · 60 FPS</span>
          </div>
        </section>

        {/* Section 1: 8-Module Architectural Breakdown */}
        <ArchitectureExplorer
          selectedPart={selectedPart}
          onInspectPartIn3D={handleInspectPartIn3D}
        />

        {/* Section 2: 12-Sector Orbital Ring & Suites 101-112 */}
        <SuitesRingExplorer
          selectedSuiteNumber={selectedSuiteNumber}
          onSelectSuite={handleSelectSuite}
          onViewSuiteIn3D={handleViewSuiteIn3D}
          onBookSuite={handleBookSuite}
        />

        {/* Section 3: Orbital Infrastructure & Lifestyle */}
        <InfrastructureSection onLaunchCameraFromInfra={handleLaunchCameraFromInfra} />

        {/* Section 4: Expedition Booking Configurator */}
        <BookingSection preselectedSuiteNumber={bookingSuiteNumber} />
      </main>

      {/* Quiet Footer */}
      <footer className="border-t border-slate-800 bg-[#07090E] py-10">
        <div className="mx-auto flex max-w-[1200px] flex-col gap-6 px-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <div>
            <div className="text-sm font-bold tracking-tight text-white">Orbital Hotel</div>
            <p className="mt-1 text-xs text-slate-500">
              Архитектуралық 3D модель · WebXR VR жүйесі · 12 люкс сектор (№101–112)
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-6 text-xs text-slate-400">
            <a href="#viewer-3d" className="transition-colors hover:text-white">
              3D &amp; VR Сахна
            </a>
            <a href="#architecture" className="transition-colors hover:text-white">
              Архитектура
            </a>
            <a href="#suites" className="transition-colors hover:text-white">
              Нөмірлер
            </a>
            <a href="#booking" className="transition-colors hover:text-white">
              Тур брондау
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
