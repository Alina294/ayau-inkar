import React, { useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { CameraPresetId, GENERATED_IMAGES, VrViewMode } from '../data/orbitalData';

interface InfrastructureTab {
  id: string;
  index: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  stats: { label: string; value: string }[];
  cameraPreset: CameraPresetId;
  vrMode?: VrViewMode;
}

const INFRA_TABS: InfrastructureTab[] = [
  {
    id: 'atrium',
    index: '01',
    title: '360° Атриум променады',
    subtitle: 'Ботаникалық бақ және панорамалық серуен жолы',
    description:
      'Қонақүйдің бүкіл шеңберін бойлай өтетін кең дәліз. 36 гидропонды ағаш пен 24 төбелік LED люстра табиғи ауа айналымын және Жерге ашылатын үздіксіз панорамалық көріністі біріктіреді.',
    image: GENERATED_IMAGES.atrium,
    stats: [
      { label: 'Шеңбер ұзындығы', value: '565 м' },
      { label: 'Жасыл белдеу', value: '36 ағаш' },
      { label: 'Орташа климат', value: '21.5 °C' },
    ],
    cameraPreset: 'atrium',
    vrMode: 'walk',
  },
  {
    id: 'docking',
    index: '02',
    title: 'Орбиталық шаттл түйісуі',
    subtitle: 'Жоғарғы шлюз сақинасы және қонақ қабылдау',
    description:
      'Жоғарғы түйісу торабы бір мезгілде екі жолаушы шаттлы мен жүк капсуласын қабылдай алады. 12 периметрлік маяк пен лазерлік дәлдік жүйесі қону қауіпсіздігін қамтамасыз етеді.',
    image: GENERATED_IMAGES.docking,
    stats: [
      { label: 'Түйісу шлюзі', value: '4 радиалды' },
      { label: 'Қабылдау биіктігі', value: '+49.0 м' },
      { label: 'Герметикалық циклі', value: '8 мин' },
    ],
    cameraPreset: 'upperHub',
  },
  {
    id: 'suites',
    index: '03',
    title: 'Люкс кабиналар стандарты',
    subtitle: 'Қисық кварц әйнегі және 0.38 g жайлылық',
    description:
      'Сақинаның айналуы арқылы жасалған 0.38 g тартылыс қонақтарға кәдімгі төсекте демалуға мүмкіндік береді. Әр нөмір дыбыс оқшаулағыш әйнек есікпен және бейімделгіш жарықпен жабдықталған.',
    image: GENERATED_IMAGES.suite,
    stats: [
      { label: 'Жалпы нөмірлер', value: '12 люкс' },
      { label: 'Тартылыс деңгейі', value: '0.38 g' },
      { label: 'Иллюминатор радиусы', value: '2.8 м' },
    ],
    cameraPreset: 'suites',
  },
  {
    id: 'model',
    index: '04',
    title: 'Студиялық сәулеттік макет',
    subtitle: 'Физикалық макет негізіндегі цифрлық егіз',
    description:
      'Интерактивті 3D жүйе мен WebXR ортасы дәл осы сәулеттік макеттің пропорциялары, 12 радиалды сатин-күміс аркасы және күн панельдерінің орналасу геометриясы бойынша құрастырылған.',
    image: GENERATED_IMAGES.model,
    stats: [
      { label: 'Күн массиві', value: '4.2 МВт' },
      { label: 'Қаңқа аркалары', value: '12 титан' },
      { label: 'Сәулеттік дәлдік', value: '1:100' },
    ],
    cameraPreset: 'overview',
  },
];

interface InfrastructureSectionProps {
  onLaunchCameraFromInfra: (preset: CameraPresetId, vrMode?: VrViewMode) => void;
}

export const InfrastructureSection: React.FC<InfrastructureSectionProps> = ({
  onLaunchCameraFromInfra,
}) => {
  const [activeTabId, setActiveTabId] = useState<string>('atrium');
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});

  const activeTab = INFRA_TABS.find((t) => t.id === activeTabId) ?? INFRA_TABS[0];

  return (
    <section id="infrastructure" className="border-t border-slate-800/80 bg-[#07090E] py-20 lg:py-24">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <p className="text-xs font-medium tracking-wider text-sky-400">
              Инфрақұрылым және орбиталық өмір сүру ортасы
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white sm:text-4xl [text-wrap:balance]">
              Ғарыштық инженерия мен қонақжайлылық үйлесімі
            </h2>
          </div>
          <p className="max-w-md text-sm leading-relaxed text-slate-400">
            Променад галереясынан бастап жоғарғы шаттл шлюзіне дейінгі кеңістікті зерттеңіз.
          </p>
        </div>

        {/* Interactive Tab Navigation */}
        <div className="mt-10 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {INFRA_TABS.map((tab) => {
            const isActive = tab.id === activeTab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTabId(tab.id)}
                className={`cursor-pointer rounded-xl border p-4 text-left transition-colors ${
                  isActive
                    ? 'border-sky-500/60 bg-[#0B0F1A] text-white'
                    : 'border-slate-800/90 bg-[#090C14] text-slate-400 hover:border-slate-700 hover:text-slate-200'
                }`}
              >
                <div className="text-xs font-mono-tabular text-sky-400">{tab.index}</div>
                <div className="mt-1 text-sm font-semibold">{tab.title}</div>
                <div className="mt-1 text-xs text-slate-500 line-clamp-1">{tab.subtitle}</div>
              </button>
            );
          })}
        </div>

        {/* Active Visual Showcase */}
        <div className="mt-6 overflow-hidden rounded-xl border border-slate-800 bg-[#0B0F1A]">
          <div className="grid grid-cols-1 lg:grid-cols-12">
            <div className="relative aspect-video bg-slate-900 lg:col-span-7 lg:aspect-auto lg:min-h-[420px]">
              {!failedImages[activeTab.id] ? (
                <img
                  src={activeTab.image}
                  alt={activeTab.title}
                  referrerPolicy="no-referrer"
                  onError={() => setFailedImages((prev) => ({ ...prev, [activeTab.id]: true }))}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 p-8 text-center">
                  <div>
                    <div className="text-xl font-semibold text-white">{activeTab.title}</div>
                    <div className="mt-1 text-xs text-slate-400">{activeTab.subtitle}</div>
                  </div>
                </div>
              )}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
              <div className="absolute bottom-5 left-5 right-5 flex flex-wrap items-end justify-between gap-4">
                <div>
                  <div className="text-xs font-mono-tabular text-sky-300">{activeTab.index} · Орбиталық аймақ</div>
                  <div className="mt-0.5 text-lg font-semibold text-white">{activeTab.title}</div>
                </div>
              </div>
            </div>

            <div className="flex flex-col justify-between p-6 sm:p-8 lg:col-span-5">
              <div>
                <h3 className="text-xl font-semibold text-white">{activeTab.subtitle}</h3>
                <p className="mt-4 text-sm leading-relaxed text-slate-300">
                  {activeTab.description}
                </p>

                <div className="mt-8 grid grid-cols-3 gap-4 border-y border-slate-800 py-5">
                  {activeTab.stats.map((st) => (
                    <div key={st.label}>
                      <div className="text-[11px] text-slate-500">{st.label}</div>
                      <div className="mt-1 text-base font-semibold text-white font-mono-tabular">
                        {st.value}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() =>
                    onLaunchCameraFromInfra(activeTab.cameraPreset, activeTab.vrMode)
                  }
                  className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-sky-600 px-4 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-sky-500 whitespace-nowrap shrink-0"
                >
                  <span>
                    {activeTab.vrMode === 'walk'
                      ? 'Атриум серуенін бастау'
                      : '3D сахнада осы бұрышты ашу'}
                  </span>
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
