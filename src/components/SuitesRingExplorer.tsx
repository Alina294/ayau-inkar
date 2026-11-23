import React, { useMemo, useState } from 'react';
import { ArrowUpRight, CheckCircle2, Clock, Compass } from 'lucide-react';
import {
  GENERATED_IMAGES,
  ORBITAL_SUITES,
  SuiteCategory,
  SuiteInfo,
} from '../data/orbitalData';

interface SuitesRingExplorerProps {
  selectedSuiteNumber: number;
  onSelectSuite: (suite: SuiteInfo) => void;
  onViewSuiteIn3D: (suiteIndex: number) => void;
  onBookSuite: (suiteNumber: number) => void;
}

export const SuitesRingExplorer: React.FC<SuitesRingExplorerProps> = ({
  selectedSuiteNumber,
  onSelectSuite,
  onViewSuiteIn3D,
  onBookSuite,
}) => {
  const [filter, setFilter] = useState<SuiteCategory>('all');
  const [imgFailed, setImgFailed] = useState(false);

  const filteredSuites = useMemo(() => {
    if (filter === 'all') return ORBITAL_SUITES;
    return ORBITAL_SUITES.filter((s) => s.category === filter);
  }, [filter]);

  const activeSuite =
    ORBITAL_SUITES.find((s) => s.number === selectedSuiteNumber) ?? ORBITAL_SUITES[0];

  const activeIndex = ORBITAL_SUITES.findIndex((s) => s.number === activeSuite.number);

  return (
    <section id="suites" className="border-t border-slate-800/80 bg-[#0A0E18] py-20 lg:py-24">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
        {/* Header + Segmented Filter */}
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-xs font-medium tracking-wider text-sky-400">
              Тұрғын сақина секторлары · №101–112
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white sm:text-4xl [text-wrap:balance]">
              360° орбиталық панорамалы 12 люкс нөмір
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-400">
              Сақина диаграммасынан кез келген секторды таңдап, оның орналасу бұрышын, ауданын
              және бос орын күйін тексеріңіз.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-1 rounded-lg border border-slate-800 bg-[#07090E] p-1 self-start">
            {(
              [
                { id: 'all', label: 'Барлығы (12)' },
                { id: 'earth', label: 'Жер панорамасы' },
                { id: 'garden', label: 'Атриум бағы' },
                { id: 'commander', label: 'Командор' },
              ] as { id: SuiteCategory; label: string }[]
            ).map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setFilter(tab.id)}
                className={`cursor-pointer rounded-md px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                  filter === tab.id
                    ? 'bg-sky-600 text-white'
                    : 'text-slate-400 hover:text-slate-100'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Interactive SVG Orbital Ring + Active Suite Card */}
        <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-start">
          {/* Left: Interactive 12-Sector Torus Diagram */}
          <div className="rounded-xl border border-slate-800 bg-[#07090E] p-6 lg:col-span-5">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Сақина жоспары (Төбеден көрініс)</span>
              <span className="font-mono-tabular">R = 90 м</span>
            </div>

            <div className="relative mx-auto mt-4 aspect-square w-full max-w-[360px]">
              <svg viewBox="0 0 360 360" className="h-full w-full select-none">
                {/* Outer and Inner structural ring guides */}
                <circle
                  cx="180"
                  cy="180"
                  r="146"
                  fill="none"
                  stroke="#1E293B"
                  strokeWidth="1.5"
                />
                <circle
                  cx="180"
                  cy="180"
                  r="82"
                  fill="none"
                  stroke="#1E293B"
                  strokeWidth="1.5"
                />
                <circle
                  cx="180"
                  cy="180"
                  r="38"
                  fill="#0F172A"
                  stroke="#334155"
                  strokeWidth="1.5"
                />
                <text
                  x="180"
                  y="176"
                  textAnchor="middle"
                  className="fill-slate-300 text-[10px] font-medium"
                >
                  Орталық
                </text>
                <text
                  x="180"
                  y="190"
                  textAnchor="middle"
                  className="fill-sky-400 text-[10px] font-mono"
                >
                  Шлюз
                </text>

                {ORBITAL_SUITES.map((suite, idx) => {
                  const startDeg = idx * 30 - 90 - 13;
                  const endDeg = idx * 30 - 90 + 13;
                  const startRad = (startDeg * Math.PI) / 180;
                  const endRad = (endDeg * Math.PI) / 180;
                  const midRad = (((idx * 30 - 90) * Math.PI) / 180);

                  const rIn = 88;
                  const rOut = 140;
                  const x1 = 180 + rIn * Math.cos(startRad);
                  const y1 = 180 + rIn * Math.sin(startRad);
                  const x2 = 180 + rOut * Math.cos(startRad);
                  const y2 = 180 + rOut * Math.sin(startRad);
                  const x3 = 180 + rOut * Math.cos(endRad);
                  const y3 = 180 + rOut * Math.sin(endRad);
                  const x4 = 180 + rIn * Math.cos(endRad);
                  const y4 = 180 + rIn * Math.sin(endRad);

                  const d = `M ${x1} ${y1} L ${x2} ${y2} A ${rOut} ${rOut} 0 0 1 ${x3} ${y3} L ${x4} ${y4} A ${rIn} ${rIn} 0 0 0 ${x1} ${y1} Z`;
                  const lx = 180 + 114 * Math.cos(midRad);
                  const ly = 180 + 114 * Math.sin(midRad);

                  const matchesFilter = filter === 'all' || suite.category === filter;
                  const isActive = suite.number === activeSuite.number;
                  const isBooked = suite.status === 'Брондалған';

                  let fill = '#0F172A';
                  let stroke = '#334155';
                  if (isActive) {
                    fill = '#0284C7';
                    stroke = '#7DD3FC';
                  } else if (!matchesFilter) {
                    fill = '#090D16';
                    stroke = '#1E293B';
                  } else if (isBooked) {
                    fill = '#1E293B';
                    stroke = '#475569';
                  }

                  return (
                    <g
                      key={suite.number}
                      onClick={() => onSelectSuite(suite)}
                      className="cursor-pointer transition-opacity"
                      style={{ opacity: matchesFilter || isActive ? 1 : 0.32 }}
                    >
                      <path
                        d={d}
                        fill={fill}
                        stroke={stroke}
                        strokeWidth={isActive ? 2 : 1.2}
                      />
                      <text
                        x={lx}
                        y={ly + 4}
                        textAnchor="middle"
                        className={`text-[11px] font-mono font-medium pointer-events-none ${
                          isActive
                            ? 'fill-white'
                            : isBooked
                            ? 'fill-slate-500'
                            : 'fill-slate-200'
                        }`}
                      >
                        {suite.number}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>

            {/* Compact Sector Quick Grid */}
            <div className="mt-5 grid grid-cols-4 gap-1.5 sm:grid-cols-6">
              {filteredSuites.map((suite) => {
                const isActive = suite.number === activeSuite.number;
                return (
                  <button
                    key={suite.number}
                    type="button"
                    onClick={() => onSelectSuite(suite)}
                    className={`cursor-pointer rounded-md border px-2 py-1.5 text-center text-xs font-mono-tabular transition-colors ${
                      isActive
                        ? 'border-sky-400 bg-sky-600 text-white'
                        : 'border-slate-800 bg-slate-900/70 text-slate-300 hover:border-slate-700 hover:text-white'
                    }`}
                  >
                    {suite.number}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right: Active Suite Detailed Card */}
          <div className="overflow-hidden rounded-xl border border-slate-800 bg-[#07090E] lg:col-span-7">
            <div className="grid grid-cols-1 md:grid-cols-12">
              <div className="relative min-h-[260px] bg-slate-900 md:col-span-5">
                {!imgFailed ? (
                  <img
                    src={GENERATED_IMAGES.suite}
                    alt={activeSuite.name}
                    referrerPolicy="no-referrer"
                    onError={() => setImgFailed(true)}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 p-6 text-center">
                    <span className="text-3xl font-semibold text-sky-400 font-mono-tabular">
                      №{activeSuite.number}
                    </span>
                    <span className="mt-2 text-xs text-slate-400">{activeSuite.categoryLabel}</span>
                  </div>
                )}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs text-slate-200">
                  <span className="font-mono-tabular">
                    Сектор {activeSuite.sector} · {activeSuite.angleDeg}°
                  </span>
                  <span className="font-mono-tabular">{activeSuite.areaSqm} м²</span>
                </div>
              </div>

              <div className="flex flex-col justify-between p-6 md:col-span-7">
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-xs text-slate-400">{activeSuite.categoryLabel}</span>
                    <span
                      className={`inline-flex items-center gap-1.5 text-xs font-medium ${
                        activeSuite.status === 'Бос' ? 'text-emerald-400' : 'text-amber-400'
                      }`}
                    >
                      {activeSuite.status === 'Бос' ? (
                        <CheckCircle2 className="h-3.5 w-3.5" />
                      ) : (
                        <Clock className="h-3.5 w-3.5" />
                      )}
                      <span>{activeSuite.status}</span>
                    </span>
                  </div>

                  <h3 className="mt-2 text-xl font-semibold text-white">{activeSuite.name}</h3>
                  <p className="mt-1 text-sm text-slate-400">{activeSuite.viewOrientation}</p>

                  {/* Metrics Row */}
                  <div className="mt-5 grid grid-cols-3 gap-3 border-y border-slate-800 py-3.5">
                    <div>
                      <div className="text-[11px] text-slate-500">Ауданы</div>
                      <div className="mt-0.5 text-sm font-semibold text-white font-mono-tabular">
                        {activeSuite.areaSqm} м²
                      </div>
                    </div>
                    <div>
                      <div className="text-[11px] text-slate-500">Сыйымдылығы</div>
                      <div className="mt-0.5 text-sm font-semibold text-white font-mono-tabular">
                        {activeSuite.capacity} қонақ
                      </div>
                    </div>
                    <div>
                      <div className="text-[11px] text-slate-500">Тәуліктік тарифі</div>
                      <div className="mt-0.5 text-sm font-semibold text-sky-400 font-mono-tabular">
                        ${activeSuite.pricePerNightUsd.toLocaleString('en-US')}
                      </div>
                    </div>
                  </div>

                  {/* Highlights */}
                  <ul className="mt-4 space-y-2 text-xs text-slate-300">
                    {activeSuite.highlights.map((item) => (
                      <li key={item} className="flex items-start gap-2">
                        <span className="mt-1.5 h-1 w-1 rounded-full bg-sky-400 shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-6 flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={() => onBookSuite(activeSuite.number)}
                    disabled={activeSuite.status === 'Брондалған'}
                    className={`inline-flex cursor-pointer items-center gap-2 rounded-lg px-4 py-2.5 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
                      activeSuite.status === 'Брондалған'
                        ? 'cursor-not-allowed bg-slate-800 text-slate-500'
                        : 'bg-sky-600 text-white hover:bg-sky-500'
                    }`}
                  >
                    <span>
                      {activeSuite.status === 'Брондалған'
                        ? 'Бұл сектор брондалған'
                        : 'Осы нөмірді брондау'}
                    </span>
                    {activeSuite.status === 'Бос' && <ArrowUpRight className="h-3.5 w-3.5" />}
                  </button>

                  <button
                    type="button"
                    onClick={() => onViewSuiteIn3D(activeIndex)}
                    className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-slate-700 bg-slate-900 px-4 py-2.5 text-xs font-medium text-slate-200 transition-colors hover:bg-slate-800 whitespace-nowrap shrink-0"
                  >
                    <Compass className="h-3.5 w-3.5 text-sky-400" />
                    <span>3D модельден көру</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
