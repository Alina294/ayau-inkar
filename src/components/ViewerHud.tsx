import React, { useEffect, useState } from 'react';
import {
  Camera,
  ChevronDown,
  ChevronUp,
  Eye,
  Glasses,
  Image as ImageIcon,
  Layers,
  Maximize2,
  Minimize2,
  Rocket,
  RotateCw,
  Ruler,
  Sliders,
  Sparkles,
  X,
} from 'lucide-react';
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
import type { WalkInput } from './OrbitalViewer3D';

type DockTab = 'camera' | 'environment' | 'parts' | 'vr';

interface ViewerHudProps {
  cameraPreset: CameraPresetId;
  theme: SceneThemeId;
  explodeAmount: number;
  autoRotate: boolean;
  ledsEnabled: boolean;
  showRocket: boolean;
  showDistanceGuide: boolean;
  vrViewMode: VrViewMode;
  vrStation: VrStationId;
  webXrSupported: boolean;
  webXrPresenting: boolean;
  selectedPart: PartId | null;
  vrNotice: string | null;
  isFullscreen: boolean;
  onSelectCameraPreset: (id: CameraPresetId) => void;
  onSelectTheme: (theme: SceneThemeId) => void;
  onChangeExplode: (val: number) => void;
  onToggleAutoRotate: () => void;
  onToggleLeds: () => void;
  onToggleRocket: () => void;
  onToggleDistanceGuide: () => void;
  onEnterWebXr: () => void;
  onSetVrViewMode: (mode: VrViewMode) => void;
  onSelectVrStation: (station: VrStationId) => void;
  onSelectPart: (part: PartId | null) => void;
  onWalkInputChange: (input: WalkInput) => void;
  onDismissNotice: () => void;
  onToggleFullscreen: () => void;
}

export const ViewerHud: React.FC<ViewerHudProps> = ({
  cameraPreset,
  theme,
  explodeAmount,
  autoRotate,
  ledsEnabled,
  showRocket,
  showDistanceGuide,
  vrViewMode,
  vrStation,
  webXrSupported,
  webXrPresenting,
  selectedPart,
  vrNotice,
  isFullscreen,
  onSelectCameraPreset,
  onSelectTheme,
  onChangeExplode,
  onToggleAutoRotate,
  onToggleLeds,
  onToggleRocket,
  onToggleDistanceGuide,
  onEnterWebXr,
  onSetVrViewMode,
  onSelectVrStation,
  onSelectPart,
  onWalkInputChange,
  onDismissNotice,
  onToggleFullscreen,
}) => {
  const [hudOpen, setHudOpen] = useState(true);
  const [activeTab, setActiveTab] = useState<DockTab>('camera');
  const [photoOpen, setPhotoOpen] = useState(false);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT')) {
        return;
      }
      if (e.key === 'h' || e.key === 'H' || e.key === 'һ' || e.key === 'Һ') {
        setHudOpen((prev) => !prev);
      } else if (e.key === 'Escape' && (vrViewMode === 'stereo' || vrViewMode === 'walk')) {
        onSetVrViewMode('none');
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [vrViewMode, onSetVrViewMode]);

  const isStudioLight = theme === 'studio' && vrViewMode === 'none';
  const surfaceClass = isStudioLight
    ? 'bg-white/95 text-slate-900 border-slate-300/90 shadow-lg'
    : 'bg-[#0B0F1A]/95 text-slate-100 border-slate-800 shadow-2xl';
  const mutedText = isStudioLight ? 'text-slate-600' : 'text-slate-400';
  const btnMuted = isStudioLight
    ? 'text-slate-700 hover:bg-slate-200/80'
    : 'text-slate-300 hover:bg-slate-800';
  const subSurface = isStudioLight ? 'bg-slate-100' : 'bg-slate-900';

  const activePartMeta = selectedPart ? HOTEL_PARTS[selectedPart] : null;
  const isInVrMode = vrViewMode === 'stereo' || vrViewMode === 'walk';

  return (
    <>
      {/* Top-Right Compact Stage Actions */}
      <div className="pointer-events-none absolute inset-x-0 top-4 z-20 flex items-start justify-between gap-4 px-4 sm:px-6">
        <div
          className={`pointer-events-auto rounded-lg border px-3.5 py-2 text-xs ${surfaceClass}`}
        >
          <span className="font-semibold tracking-tight">Интерактивті 3D Сахна</span>
          <span className={`mx-2 ${mutedText}`} aria-hidden="true">
            ·
          </span>
          <span className={mutedText}>Бөлікке басып тексеріңіз · Сүйреп айналдырыңыз</span>
        </div>

        <div className="pointer-events-auto flex items-center gap-2">
          {isInVrMode ? (
            <button
              type="button"
              onClick={() => onSetVrViewMode('none')}
              className="flex cursor-pointer items-center gap-2 rounded-lg bg-sky-600 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-sky-500 whitespace-nowrap shrink-0"
            >
              <X className="h-3.5 w-3.5" />
              <span>VR режимінен шығу</span>
            </button>
          ) : (
            <>
              <button
                type="button"
                onClick={() => setPhotoOpen((v) => !v)}
                className={`flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${surfaceClass} ${
                  photoOpen ? 'ring-2 ring-sky-500' : ''
                }`}
              >
                <ImageIcon className="h-3.5 w-3.5 text-sky-400" />
                <span className="hidden sm:inline">Макет фотосы</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  if (webXrSupported) {
                    onEnterWebXr();
                  } else {
                    setActiveTab('vr');
                    setHudOpen(false);
                    onSetVrViewMode('stereo');
                  }
                }}
                className="flex cursor-pointer items-center gap-2 rounded-lg bg-sky-600 px-3.5 py-2 text-xs font-semibold text-white transition-colors hover:bg-sky-500 whitespace-nowrap shrink-0"
              >
                <Glasses className="h-4 w-4" />
                <span>{webXrSupported ? 'VR іске қосу' : 'Стерео VR'}</span>
              </button>

              <button
                type="button"
                onClick={onToggleFullscreen}
                aria-label={isFullscreen ? 'Толық экраннан шығу' : 'Толық экран'}
                className={`flex cursor-pointer items-center justify-center rounded-lg border p-2 text-xs transition-colors shrink-0 ${surfaceClass}`}
              >
                {isFullscreen ? (
                  <Minimize2 className="h-4 w-4" />
                ) : (
                  <Maximize2 className="h-4 w-4" />
                )}
              </button>
            </>
          )}
        </div>
      </div>

      {/* Reference Scale Model Photo Drawer */}
      {photoOpen && !isInVrMode && (
        <aside
          className={`absolute right-4 top-16 z-20 w-72 rounded-xl border p-3 sm:right-6 ${surfaceClass}`}
        >
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs font-semibold">Түпнұсқа макет фотосы</span>
            <button
              type="button"
              aria-label="Фотоны жабу"
              onClick={() => setPhotoOpen(false)}
              className={`cursor-pointer rounded p-1 transition-colors ${btnMuted}`}
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
          <img
            src={GENERATED_IMAGES.model}
            alt="Orbital Hotel түпнұсқа сәулеттік макеті"
            referrerPolicy="no-referrer"
            className="h-44 w-full rounded-lg object-cover"
          />
          <p className={`mt-2 text-xs leading-relaxed ${mutedText}`}>
            3D модель осы архитектуралық макеттің геометриясы мен жарық контуры негізінде жасалды.
          </p>
        </aside>
      )}

      {/* WebXR Notice Toast */}
      {vrNotice && (
        <div className="pointer-events-none absolute inset-x-0 top-16 z-30 flex justify-center px-4">
          <div
            className={`pointer-events-auto flex items-center gap-3 rounded-lg border px-4 py-2.5 text-xs ${surfaceClass}`}
          >
            <span>{vrNotice}</span>
            <button
              type="button"
              onClick={onDismissNotice}
              aria-label="Хабарламаны жабу"
              className={`cursor-pointer rounded p-1 ${btnMuted}`}
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Selected Part Compact Corner Readout */}
      {activePartMeta && !isInVrMode && (
        <div
          className={`absolute left-4 top-16 z-20 w-72 rounded-xl border p-3.5 sm:left-6 ${surfaceClass}`}
        >
          <div className="flex items-start justify-between gap-2">
            <div>
              <span className={`text-[11px] font-mono-tabular ${mutedText}`}>
                Торап {activePartMeta.index}
              </span>
              <h3 className="text-sm font-semibold">{activePartMeta.title}</h3>
              <p className={`text-xs ${mutedText}`}>{activePartMeta.subtitle}</p>
            </div>
            <button
              type="button"
              onClick={() => onSelectPart(null)}
              aria-label="Ақпаратты жабу"
              className={`cursor-pointer rounded p-1 ${btnMuted}`}
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
          <p className="mt-2 text-xs leading-relaxed opacity-90">{activePartMeta.description}</p>
          <div
            className={`mt-2.5 border-t pt-2 text-[11px] font-mono-tabular ${mutedText} ${
              isStudioLight ? 'border-slate-200' : 'border-slate-800'
            }`}
          >
            {activePartMeta.specs}
          </div>
        </div>
      )}

      {/* Stereo VR / Atrium Walk Floating Bar */}
      {isInVrMode ? (
        <div className="pointer-events-none absolute inset-x-0 bottom-5 z-20 flex flex-col items-center gap-3 px-4">
          <div
            className={`pointer-events-auto flex flex-wrap items-center justify-center gap-2 rounded-xl border px-3 py-2 text-xs ${surfaceClass}`}
          >
            <span className="px-1.5 font-medium text-sky-400">
              {vrViewMode === 'stereo' ? 'Стерео VR' : 'Атриум серуені'}
            </span>
            <span aria-hidden="true" className={mutedText}>
              ·
            </span>
            {VR_STATIONS.map((st) => (
              <button
                key={st.id}
                type="button"
                onClick={() => onSelectVrStation(st.id)}
                className={`cursor-pointer rounded-md px-2.5 py-1.5 font-medium transition-colors whitespace-nowrap shrink-0 ${
                  vrStation === st.id ? 'bg-sky-600 text-white' : btnMuted
                }`}
              >
                {st.label}
              </button>
            ))}

            {(vrViewMode === 'walk' || vrStation === 'atrium') && (
              <div className="flex items-center gap-1 pl-1">
                <button
                  type="button"
                  onPointerDown={() => onWalkInputChange({ forward: 1, strafe: 0 })}
                  onPointerUp={() => onWalkInputChange({ forward: 0, strafe: 0 })}
                  onPointerLeave={() => onWalkInputChange({ forward: 0, strafe: 0 })}
                  className={`cursor-pointer rounded-md px-2.5 py-1.5 font-medium whitespace-nowrap shrink-0 ${subSurface}`}
                >
                  Алға (W)
                </button>
                <button
                  type="button"
                  onPointerDown={() => onWalkInputChange({ forward: -1, strafe: 0 })}
                  onPointerUp={() => onWalkInputChange({ forward: 0, strafe: 0 })}
                  onPointerLeave={() => onWalkInputChange({ forward: 0, strafe: 0 })}
                  className={`cursor-pointer rounded-md px-2.5 py-1.5 font-medium whitespace-nowrap shrink-0 ${subSurface}`}
                >
                  Артқа (S)
                </button>
              </div>
            )}
          </div>
          <p className="rounded-lg bg-slate-950/90 px-3 py-1 text-[11px] text-slate-300">
            Айналаға қарау үшін экранды сүйреңіз · Қозғалу: W A S D · Шығу: Esc
          </p>
        </div>
      ) : (
        /* Collapsible Unified Bottom Control Dock */
        <div className="pointer-events-none absolute inset-x-0 bottom-4 z-20 flex flex-col items-center px-3">
          <button
            type="button"
            onClick={() => setHudOpen((v) => !v)}
            className={`pointer-events-auto mb-2 flex cursor-pointer items-center gap-1.5 rounded-t-lg border px-3 py-1.5 text-[11px] font-medium transition-colors whitespace-nowrap shrink-0 ${surfaceClass}`}
          >
            {hudOpen ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronUp className="h-3.5 w-3.5" />}
            <span>{hudOpen ? 'Таза көрініс (H)' : 'Басқаруды ашу (H)'}</span>
          </button>

          {hudOpen && (
            <div
              className={`pointer-events-auto w-full max-w-[920px] rounded-xl border p-3 transition-transform duration-200 ${surfaceClass}`}
            >
              {/* Tab Row */}
              <div
                className={`mb-3 flex flex-wrap items-center justify-between gap-2 border-b pb-2.5 ${
                  isStudioLight ? 'border-slate-200' : 'border-slate-800'
                }`}
              >
                <div className={`flex flex-wrap items-center gap-1 rounded-lg p-1 ${subSurface}`}>
                  <button
                    type="button"
                    onClick={() => setActiveTab('camera')}
                    className={`flex cursor-pointer items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                      activeTab === 'camera'
                        ? isStudioLight
                          ? 'bg-white text-slate-900 shadow-sm'
                          : 'bg-slate-800 text-white'
                        : mutedText
                    }`}
                  >
                    <Camera className="h-3.5 w-3.5" />
                    <span>Камера</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('environment')}
                    className={`flex cursor-pointer items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                      activeTab === 'environment'
                        ? isStudioLight
                          ? 'bg-white text-slate-900 shadow-sm'
                          : 'bg-slate-800 text-white'
                        : mutedText
                    }`}
                  >
                    <Sliders className="h-3.5 w-3.5" />
                    <span>Орта және қима</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('parts')}
                    className={`flex cursor-pointer items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                      activeTab === 'parts'
                        ? isStudioLight
                          ? 'bg-white text-slate-900 shadow-sm'
                          : 'bg-slate-800 text-white'
                        : mutedText
                    }`}
                  >
                    <Layers className="h-3.5 w-3.5" />
                    <span>Бөліктер (8)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('vr')}
                    className={`flex cursor-pointer items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                      activeTab === 'vr'
                        ? isStudioLight
                          ? 'bg-white text-slate-900 shadow-sm'
                          : 'bg-slate-800 text-white'
                        : mutedText
                    }`}
                  >
                    <Glasses className="h-3.5 w-3.5" />
                    <span>VR режимі</span>
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={onToggleAutoRotate}
                    className={`flex cursor-pointer items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                      autoRotate
                        ? 'border-sky-500/50 bg-sky-500/15 text-sky-400'
                        : `${isStudioLight ? 'border-slate-300' : 'border-slate-800'} ${mutedText}`
                    }`}
                  >
                    <RotateCw className="h-3.5 w-3.5" />
                    <span>Айналу</span>
                  </button>
                  <button
                    type="button"
                    onClick={onToggleLeds}
                    className={`flex cursor-pointer items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                      ledsEnabled
                        ? 'border-sky-500/50 bg-sky-500/15 text-sky-400'
                        : `${isStudioLight ? 'border-slate-300' : 'border-slate-800'} ${mutedText}`
                    }`}
                  >
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>LED контур</span>
                  </button>
                </div>
              </div>

              {/* Active Tab Panel */}
              {activeTab === 'camera' && (
                <div className="flex flex-wrap items-center gap-1.5">
                  {CAMERA_PRESETS.map((preset) => (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => onSelectCameraPreset(preset.id)}
                      className={`cursor-pointer rounded-lg px-3 py-2 text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                        cameraPreset === preset.id
                          ? 'bg-sky-600 text-white'
                          : `${subSurface} ${btnMuted}`
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              )}

              {activeTab === 'environment' && (
                <div className="flex flex-col gap-3">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex flex-wrap items-center gap-1.5">
                      {(
                        [
                          { id: 'orbit', label: 'Орбита кеңістігі' },
                          { id: 'studio', label: 'Студия макеті' },
                          { id: 'night', label: 'Түнгі стенд' },
                        ] as { id: SceneThemeId; label: string }[]
                      ).map((t) => (
                        <button
                          key={t.id}
                          type="button"
                          onClick={() => onSelectTheme(t.id)}
                          className={`cursor-pointer rounded-lg px-3 py-2 text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                            theme === t.id ? 'bg-sky-600 text-white' : `${subSurface} ${btnMuted}`
                          }`}
                        >
                          {t.label}
                        </button>
                      ))}
                    </div>

                    <div className="flex flex-1 items-center gap-3 sm:max-w-xs">
                      <label htmlFor="explode-slider" className={`text-xs font-medium whitespace-nowrap ${mutedText}`}>
                        Бөлшектеу
                      </label>
                      <input
                        id="explode-slider"
                        type="range"
                        min={0}
                        max={1}
                        step={0.01}
                        value={explodeAmount}
                        onChange={(e) => onChangeExplode(parseFloat(e.target.value))}
                        className="orbital-slider w-full"
                      />
                      <span className="w-10 text-right text-xs font-mono-tabular">
                        {Math.round(explodeAmount * 100)}%
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 border-t border-slate-800/50 pt-2.5">
                    <button
                      type="button"
                      onClick={onToggleRocket}
                      className={`flex cursor-pointer items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                        showRocket
                          ? 'border-sky-500/50 bg-sky-500/15 text-sky-400'
                          : `${isStudioLight ? 'border-slate-300' : 'border-slate-800'} ${mutedText}`
                      }`}
                    >
                      <Rocket className="h-3.5 w-3.5" />
                      <span>Зымыран түйісуі</span>
                    </button>

                    <button
                      type="button"
                      onClick={onToggleDistanceGuide}
                      className={`flex cursor-pointer items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                        showDistanceGuide
                          ? 'border-sky-500/50 bg-sky-500/15 text-sky-400'
                          : `${isStudioLight ? 'border-slate-300' : 'border-slate-800'} ${mutedText}`
                      }`}
                    >
                      <Ruler className="h-3.5 w-3.5" />
                      <span>Жермен арақашықтық (420 км)</span>
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'parts' && (
                <div className="flex flex-wrap items-center gap-1.5">
                  {Object.values(HOTEL_PARTS).map((part) => (
                    <button
                      key={part.id}
                      type="button"
                      onClick={() => {
                        onSelectPart(selectedPart === part.id ? null : part.id);
                        onSelectCameraPreset(part.cameraPreset);
                      }}
                      className={`cursor-pointer rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                        selectedPart === part.id
                          ? 'bg-sky-600 text-white'
                          : `${subSurface} ${btnMuted}`
                      }`}
                    >
                      {part.index}. {part.title}
                    </button>
                  ))}
                </div>
              )}

              {activeTab === 'vr' && (
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onSetVrViewMode('walk')}
                      className={`flex cursor-pointer items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${subSurface} ${btnMuted}`}
                    >
                      <Eye className="h-3.5 w-3.5 text-sky-400" />
                      <span>Кең дәліз серуені (1-ші жақ)</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => onSetVrViewMode('stereo')}
                      className={`flex cursor-pointer items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${subSurface} ${btnMuted}`}
                    >
                      <Glasses className="h-3.5 w-3.5 text-sky-400" />
                      <span>Стерео VR (Қос экран)</span>
                    </button>

                    <button
                      type="button"
                      onClick={onEnterWebXr}
                      className="flex cursor-pointer items-center gap-1.5 rounded-lg bg-sky-600 px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-sky-500 whitespace-nowrap shrink-0"
                    >
                      <Glasses className="h-3.5 w-3.5" />
                      <span>
                        {webXrPresenting
                          ? 'WebXR белсенді'
                          : webXrSupported
                          ? 'WebXR гарнитура'
                          : 'WebXR тексеру'}
                      </span>
                    </button>
                  </div>
                  <span className={`text-xs ${mutedText}`}>
                    Гарнитурасыз Стерео VR және Серуен қолжетімді
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </>
  );
};
