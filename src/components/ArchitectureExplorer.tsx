import React, { useState } from 'react';
import { ArrowUpRight, Compass, Layers } from 'lucide-react';
import {
  HOTEL_PARTS,
  PartId,
  STATION_SPECS,
} from '../data/orbitalData';

interface ArchitectureExplorerProps {
  selectedPart: PartId | null;
  onInspectPartIn3D: (partId: PartId, withExplode?: boolean) => void;
}

export const ArchitectureExplorer: React.FC<ArchitectureExplorerProps> = ({
  selectedPart,
  onInspectPartIn3D,
}) => {
  const partsList = Object.values(HOTEL_PARTS);
  const [activeId, setActiveId] = useState<PartId>(selectedPart ?? 'habitationFrame');

  const currentId = selectedPart ?? activeId;
  const activePart = HOTEL_PARTS[currentId];

  return (
    <section id="architecture" className="border-t border-slate-800/80 bg-[#07090E] py-20 lg:py-24">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <p className="text-xs font-medium tracking-wider text-sky-400">
              Сәулеттік құрылым және инженерлік сипаттама
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white sm:text-4xl [text-wrap:balance]">
              Сегіз функционалды деңгейден тұратын орбиталық кешен
            </h2>
          </div>
          <p className="max-w-md text-sm leading-relaxed text-slate-400">
            Төменгі тұрақтандыру іргетасынан бастап жоғарғы телеметрия мұнарасына дейінгі әрбір
            торап автономды өмірді қамтамасыз етуге және 0.38 g жасанды тартылысқа есептелген.
          </p>
        </div>

        {/* 6-Cell Station Spec Matrix */}
        <div className="mt-10 grid grid-cols-2 border border-slate-800 bg-[#0B0F1A] sm:grid-cols-3 lg:grid-cols-6">
          {STATION_SPECS.map((spec, idx) => (
            <div
              key={spec.label}
              className={`p-5 ${
                idx < STATION_SPECS.length - 1 ? 'border-b border-slate-800 lg:border-b-0 lg:border-r' : ''
              } ${idx % 2 === 0 ? 'border-r border-slate-800 sm:border-r' : 'sm:border-r lg:border-r'}`}
            >
              <div className="text-xs text-slate-400">{spec.label}</div>
              <div className="mt-2 text-2xl font-semibold tracking-tight text-white font-mono-tabular">
                {spec.value}
              </div>
              <div className="mt-1 text-xs text-slate-500">{spec.note}</div>
            </div>
          ))}
        </div>

        {/* Asymmetric 8-Module Explorer */}
        <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Left: Interactive 8-Module Index */}
          <div className="lg:col-span-5">
            <div className="divide-y divide-slate-800/80 border-y border-slate-800/80">
              {partsList.map((part) => {
                const isSelected = currentId === part.id;
                return (
                  <button
                    key={part.id}
                    type="button"
                    onClick={() => setActiveId(part.id)}
                    className={`group flex w-full cursor-pointer items-center justify-between gap-4 px-4 py-3.5 text-left transition-colors ${
                      isSelected
                        ? 'bg-slate-900/90 text-white'
                        : 'text-slate-300 hover:bg-slate-900/40 hover:text-white'
                    }`}
                  >
                    <div className="flex items-baseline gap-3.5 min-w-0">
                      <span
                        className={`text-xs font-mono-tabular shrink-0 ${
                          isSelected ? 'text-sky-400' : 'text-slate-500'
                        }`}
                      >
                        {part.index}
                      </span>
                      <div className="min-w-0">
                        <div className="truncate text-sm font-medium">{part.title}</div>
                        <div className="truncate text-xs text-slate-500">{part.subtitle}</div>
                      </div>
                    </div>
                    <span
                      className={`text-xs font-mono-tabular shrink-0 transition-opacity ${
                        isSelected ? 'text-sky-400 opacity-100' : 'text-slate-500 opacity-0 group-hover:opacity-100'
                      }`}
                    >
                      {part.metrics.elevation}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right: Active Module Engineering Dossier */}
          <div className="flex flex-col justify-between rounded-xl border border-slate-800 bg-[#0B0F1A] p-6 sm:p-8 lg:col-span-7">
            <div>
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400">
                <span className="font-mono-tabular text-sky-400">
                  Құрылымдық торап {activePart.index} / 08
                </span>
                <span className="font-mono-tabular">{activePart.metrics.elevation}</span>
              </div>

              <h3 className="mt-3 text-2xl font-semibold tracking-tight text-white">
                {activePart.title}
              </h3>
              <p className="mt-1 text-sm text-sky-300/90">{activePart.subtitle}</p>

              <p className="mt-5 text-sm leading-relaxed text-slate-300 sm:text-base">
                {activePart.description}
              </p>

              {/* Technical Parameters */}
              <div className="mt-8 grid grid-cols-1 gap-4 border-t border-slate-800 pt-6 sm:grid-cols-3">
                <div>
                  <div className="text-xs text-slate-500">Биіктік белдеуі</div>
                  <div className="mt-1 text-sm font-medium text-white font-mono-tabular">
                    {activePart.metrics.elevation}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-slate-500">Негізгі материал</div>
                  <div className="mt-1 text-sm font-medium text-white">
                    {activePart.metrics.material}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-slate-500">Энергия балансы</div>
                  <div className="mt-1 text-sm font-medium text-white font-mono-tabular">
                    {activePart.metrics.powerLoad}
                  </div>
                </div>
              </div>

              <div className="mt-6 border-t border-slate-800/80 pt-4 text-xs font-mono-tabular text-slate-400">
                {activePart.specs}
              </div>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => onInspectPartIn3D(activePart.id, false)}
                className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-sky-600 px-4 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-sky-500 whitespace-nowrap shrink-0"
              >
                <Compass className="h-4 w-4" />
                <span>3D модельде көрсету</span>
                <ArrowUpRight className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                onClick={() => onInspectPartIn3D(activePart.id, true)}
                className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-slate-700 bg-slate-900 px-4 py-2.5 text-xs font-medium text-slate-200 transition-colors hover:bg-slate-800 whitespace-nowrap shrink-0"
              >
                <Layers className="h-4 w-4 text-sky-400" />
                <span>Қима (Бөлшектеу) күйінде ашу</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
