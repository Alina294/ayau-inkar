import React, { useEffect, useState } from 'react';
import { Calendar, CheckCircle2, Trash2 } from 'lucide-react';
import { ORBITAL_SUITES } from '../data/orbitalData';

interface BookingRecord {
  id: string;
  suiteNumber: number;
  suiteName: string;
  durationDays: number;
  guests: number;
  launchWindow: string;
  includeVrPrep: boolean;
  totalUsd: number;
  fullName: string;
  email: string;
  phone: string;
  createdAt: string;
}

const LAUNCH_WINDOWS = [
  '2027 · Наурыз — Байқоңыр Орбита-1',
  '2027 · Мамыр — Байқоңыр Орбита-2',
  '2027 · Қыркүйек — Экспедиция-3',
];

const DURATIONS = [3, 7, 14] as const;

const STORAGE_KEY = 'orbital_hotel_reservations_v1';

interface BookingSectionProps {
  preselectedSuiteNumber: number;
}

export const BookingSection: React.FC<BookingSectionProps> = ({
  preselectedSuiteNumber,
}) => {
  const availableSuites = ORBITAL_SUITES.filter((s) => s.status === 'Бос');
  const [suiteNumber, setSuiteNumber] = useState<number>(
    availableSuites.some((s) => s.number === preselectedSuiteNumber)
      ? preselectedSuiteNumber
      : availableSuites[0].number
  );
  const [durationDays, setDurationDays] = useState<number>(3);
  const [guests, setGuests] = useState<number>(2);
  const [launchWindow, setLaunchWindow] = useState<string>(LAUNCH_WINDOWS[0]);
  const [includeVrPrep, setIncludeVrPrep] = useState<boolean>(true);

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [latestBooking, setLatestBooking] = useState<BookingRecord | null>(null);
  const [savedBookings, setSavedBookings] = useState<BookingRecord[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as BookingRecord[]) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    const match = availableSuites.find((s) => s.number === preselectedSuiteNumber);
    if (match) {
      setSuiteNumber(match.number);
    }
  }, [preselectedSuiteNumber]);

  const selectedSuite =
    ORBITAL_SUITES.find((s) => s.number === suiteNumber) ?? availableSuites[0];

  const suiteCost = selectedSuite.pricePerNightUsd * durationDays;
  const shuttleTransferCost = guests * 18000;
  const vrPrepCost = includeVrPrep ? 4500 : 0;
  const totalUsd = suiteCost + shuttleTransferCost + vrPrepCost;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (fullName.trim().length < 2) {
      setErrorMsg('Толық аты-жөніңізді енгізіңіз.');
      return;
    }
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email.trim())) {
      setErrorMsg('Дұрыс электрондық пошта мекенжайын енгізіңіз.');
      return;
    }
    if (phone.trim().length < 7) {
      setErrorMsg('Байланыс телефонын толық көрсетіңіз.');
      return;
    }

    const record: BookingRecord = {
      id: `ORB-${Math.floor(100000 + Math.random() * 900000)}`,
      suiteNumber: selectedSuite.number,
      suiteName: selectedSuite.name,
      durationDays,
      guests,
      launchWindow,
      includeVrPrep,
      totalUsd,
      fullName: fullName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      createdAt: new Date().toLocaleDateString('kk-KZ'),
    };

    const next = [record, ...savedBookings];
    setSavedBookings(next);
    setLatestBooking(record);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // Ignore storage quota errors
    }
    setFullName('');
    setEmail('');
    setPhone('');
  };

  const handleCancelBooking = (id: string) => {
    const next = savedBookings.filter((b) => b.id !== id);
    setSavedBookings(next);
    if (latestBooking?.id === id) setLatestBooking(null);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // Ignore storage quota errors
    }
  };

  return (
    <section id="booking" className="border-t border-slate-800/80 bg-[#0A0E18] py-20 lg:py-24">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-xs font-medium tracking-wider text-sky-400">
            Орбиталық экспедиция және брондау
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white sm:text-4xl [text-wrap:balance]">
            Люкс нөмір мен шаттл рейсін алдын ала брондау
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-slate-400">
            Сектор нөмірін, ұшу терезесін және экспедиция ұзақтығын таңдап, алдын ала өтінімді
            рәсімдеңіз.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Left: Configuration & Form */}
          <form
            onSubmit={handleSubmit}
            className="space-y-6 rounded-xl border border-slate-800 bg-[#07090E] p-6 sm:p-8 lg:col-span-7"
          >
            {/* Suite Select & Launch Window */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="suite-select" className="block text-xs font-medium text-slate-300">
                  Люкс нөмірі (Бос секторлар)
                </label>
                <select
                  id="suite-select"
                  value={suiteNumber}
                  onChange={(e) => setSuiteNumber(Number(e.target.value))}
                  className="mt-1.5 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2.5 text-sm text-white focus:border-sky-500 focus:outline-none"
                >
                  {availableSuites.map((s) => (
                    <option key={s.number} value={s.number}>
                      №{s.number} · {s.categoryLabel} (${s.pricePerNightUsd.toLocaleString('en-US')}/түн)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="launch-window" className="block text-xs font-medium text-slate-300">
                  Шаттл ұшу терезесі
                </label>
                <select
                  id="launch-window"
                  value={launchWindow}
                  onChange={(e) => setLaunchWindow(e.target.value)}
                  className="mt-1.5 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2.5 text-sm text-white focus:border-sky-500 focus:outline-none"
                >
                  {LAUNCH_WINDOWS.map((win) => (
                    <option key={win} value={win}>
                      {win}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Duration & Guests */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <span className="block text-xs font-medium text-slate-300">Болу ұзақтығы</span>
                <div className="mt-1.5 grid grid-cols-3 gap-1.5 rounded-lg border border-slate-800 bg-slate-900 p-1">
                  {DURATIONS.map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setDurationDays(d)}
                      className={`cursor-pointer rounded-md py-2 text-xs font-medium transition-colors font-mono-tabular ${
                        durationDays === d
                          ? 'bg-sky-600 text-white'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {d} тәулік
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <span className="block text-xs font-medium text-slate-300">Қонақтар саны</span>
                <div className="mt-1.5 grid grid-cols-2 gap-1.5 rounded-lg border border-slate-800 bg-slate-900 p-1">
                  {[1, 2].map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setGuests(g)}
                      className={`cursor-pointer rounded-md py-2 text-xs font-medium transition-colors font-mono-tabular ${
                        guests === g
                          ? 'bg-sky-600 text-white'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {g} қонақ
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Optional Pre-flight VR Training */}
            <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-slate-800 bg-slate-900/60 p-3.5">
              <input
                type="checkbox"
                checked={includeVrPrep}
                onChange={(e) => setIncludeVrPrep(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-slate-600 bg-slate-800 text-sky-500 focus:ring-sky-500"
              />
              <div className="flex-1 text-xs">
                <div className="flex items-center justify-between font-medium text-white">
                  <span>WebXR &amp; Центрифуга алдын ала дайындық курсы</span>
                  <span className="font-mono-tabular text-sky-400">+$4,500</span>
                </div>
                <p className="mt-1 text-slate-400">
                  Байқоңыр оқу орталығында 3 күндік 0.38 g бейімделу және шлюзді басқару симуляциясы.
                </p>
              </div>
            </label>

            {/* Passenger Details */}
            <div className="grid grid-cols-1 gap-4 border-t border-slate-800 pt-5 sm:grid-cols-3">
              <div>
                <label htmlFor="guest-name" className="block text-xs font-medium text-slate-300">
                  Толық аты-жөні
                </label>
                <input
                  id="guest-name"
                  type="text"
                  placeholder="Алина Сағынбаева"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="mt-1.5 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:border-sky-500 focus:outline-none"
                />
              </div>
              <div>
                <label htmlFor="guest-email" className="block text-xs font-medium text-slate-300">
                  Электрондық пошта
                </label>
                <input
                  id="guest-email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1.5 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:border-sky-500 focus:outline-none"
                />
              </div>
              <div>
                <label htmlFor="guest-phone" className="block text-xs font-medium text-slate-300">
                  Байланыс телефоны
                </label>
                <input
                  id="guest-phone"
                  type="tel"
                  placeholder="+7 701 000 00 00"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="mt-1.5 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:border-sky-500 focus:outline-none"
                />
              </div>
            </div>

            {errorMsg && (
              <div className="rounded-lg border border-rose-500/40 bg-rose-500/10 px-4 py-2.5 text-xs text-rose-300">
                {errorMsg}
              </div>
            )}

            <button
              type="submit"
              className="w-full cursor-pointer rounded-lg bg-sky-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-sky-500 sm:w-auto"
            >
              Экспедицияны брондауға жіберу
            </button>
          </form>

          {/* Right: Live Cost Breakdown & Confirmed Reservations */}
          <div className="space-y-6 lg:col-span-5">
            <div className="rounded-xl border border-slate-800 bg-[#07090E] p-6">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div>
                  <div className="text-xs text-slate-400">Таңдалған конфигурация</div>
                  <div className="mt-1 text-base font-semibold text-white">{selectedSuite.name}</div>
                </div>
                <Calendar className="h-5 w-5 text-sky-400" />
              </div>

              <div className="mt-4 space-y-3 text-sm">
                <div className="flex items-center justify-between text-slate-300">
                  <span>
                    Тұру құны ({durationDays} тәулік × $
                    {selectedSuite.pricePerNightUsd.toLocaleString('en-US')})
                  </span>
                  <span className="font-mono-tabular text-white">
                    ${suiteCost.toLocaleString('en-US')}
                  </span>
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span>Орбиталық шаттл трансфері ({guests} қонақ)</span>
                  <span className="font-mono-tabular text-white">
                    ${shuttleTransferCost.toLocaleString('en-US')}
                  </span>
                </div>
                {includeVrPrep && (
                  <div className="flex items-center justify-between text-slate-300">
                    <span>WebXR &amp; Центрифуга дайындығы</span>
                    <span className="font-mono-tabular text-white">
                      ${vrPrepCost.toLocaleString('en-US')}
                    </span>
                  </div>
                )}
              </div>

              <div className="mt-5 flex items-baseline justify-between border-t border-slate-800 pt-4">
                <span className="text-sm font-medium text-slate-300">Жалпы бағалау</span>
                <span className="text-2xl font-semibold text-sky-400 font-mono-tabular">
                  ${totalUsd.toLocaleString('en-US')}
                </span>
              </div>
              <p className="mt-2 text-xs text-slate-500">
                Ұшу кестесі: {launchWindow} · Сектор {selectedSuite.sector} ({selectedSuite.areaSqm}{' '}
                м²)
              </p>
            </div>

            {latestBooking && (
              <div className="rounded-xl border border-emerald-500/40 bg-emerald-950/20 p-5">
                <div className="flex items-center gap-2 text-sm font-semibold text-emerald-300">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Өтінім тіркелді · {latestBooking.id}</span>
                </div>
                <p className="mt-2 text-xs leading-relaxed text-slate-300">
                  {latestBooking.fullName}, сіздің {latestBooking.suiteName} ({latestBooking.durationDays}{' '}
                  тәулік, {latestBooking.launchWindow}) бойынша алдын ала броныңыз сақталды.
                </p>
              </div>
            )}

            {/* Saved Reservations List */}
            {savedBookings.length > 0 && (
              <div className="rounded-xl border border-slate-800 bg-[#07090E] p-5">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Тіркелген өтінімдер ({savedBookings.length})
                  </h3>
                </div>
                <div className="mt-3 divide-y divide-slate-800/80">
                  {savedBookings.map((b) => (
                    <div key={b.id} className="flex items-center justify-between gap-3 py-3 text-xs">
                      <div className="min-w-0">
                        <div className="truncate font-medium text-white">
                          {b.id} · {b.suiteName}
                        </div>
                        <div className="mt-0.5 truncate text-slate-400">
                          {b.fullName} · {b.durationDays} тәулік ·{' '}
                          <span className="font-mono-tabular text-sky-400">
                            ${b.totalUsd.toLocaleString('en-US')}
                          </span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleCancelBooking(b.id)}
                        aria-label="Өтінімді жою"
                        className="cursor-pointer rounded p-1.5 text-slate-500 transition-colors hover:bg-slate-800 hover:text-rose-400 shrink-0"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
