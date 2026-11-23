export type PartId =
  | 'pedestal'
  | 'lowerSpindle'
  | 'interiorDeck'
  | 'suites'
  | 'habitationFrame'
  | 'solarRoof'
  | 'upperHub'
  | 'spire';

export type CameraPresetId =
  | 'overview'
  | 'atrium'
  | 'suites'
  | 'upperHub'
  | 'rocket'
  | 'pedestal'
  | 'solarRoof';

export type SceneThemeId = 'orbit' | 'studio' | 'night';

export type VrViewMode = 'none' | 'stereo' | 'walk';

export type VrStationId = 'overview' | 'atrium' | 'spire' | 'pedestal';

export interface HotelPartMeta {
  id: PartId;
  index: string;
  title: string;
  subtitle: string;
  description: string;
  specs: string;
  explodeOffset: number;
  cameraPreset: CameraPresetId;
  metrics: {
    elevation: string;
    material: string;
    powerLoad: string;
  };
}

export const HOTEL_PARTS: Record<PartId, HotelPartMeta> = {
  pedestal: {
    id: 'pedestal',
    index: '01',
    title: 'Тұрақтандыру негізі',
    subtitle: 'Төменгі қозғалтқыш және тірек платформасы',
    description:
      'Станцияның тепе-теңдігін сақтайтын сатылы қара анодталған корпус пен көгілдір бағдарлау шамдары бар іргетас торабы. Микро-импульсті бағдарлау қозғалтқыштары осы деңгейде орналасады.',
    specs: '4 сатылы сақина · 64 LED шам · Күміс тігісті панельдер',
    explodeOffset: -1.65,
    cameraPreset: 'pedestal',
    metrics: {
      elevation: '-18.0 м',
      material: 'Анодталған титан-алюминий',
      powerLoad: '420 кВт',
    },
  },
  lowerSpindle: {
    id: 'lowerSpindle',
    index: '02',
    title: 'Төменгі орталық тірек',
    subtitle: 'Магистральді коммуникация шахтасы',
    description:
      'Қуат желілерін, өмірді қамтамасыз ету құбырларын және тік лифттерді негізден тұрғын сақинаға жеткізетін негізгі діңгек. Герметикалық өткелдер арқылы барлық қабаттарды біріктіреді.',
    specs: 'Күміс тігісті сегменттер · Төменгі түйісу сақинасы',
    explodeOffset: -0.9,
    cameraPreset: 'pedestal',
    metrics: {
      elevation: '0.0 – +22.0 м',
      material: 'Көміртекті композит және болат',
      powerLoad: '310 кВт',
    },
  },
  interiorDeck: {
    id: 'interiorDeck',
    index: '03',
    title: 'Кең дәліз және LED бақ',
    subtitle: 'Панорамалық променад және сәндік жарықтандыру',
    description:
      'Тірі ағаштармен, ақ демалыс үстелдерімен, төбелік LED люстралармен және едендік бағдарлау шамдарымен жабдықталған кең айналмалы 360° дәліз.',
    specs: 'Кең 360° дәліз · 24 LED люстра · 36 ағаш · 24 үстел',
    explodeOffset: 0.0,
    cameraPreset: 'atrium',
    metrics: {
      elevation: '+32.0 м',
      material: 'Ақ терраццо және гидропонды бақ',
      powerLoad: '680 кВт',
    },
  },
  suites: {
    id: 'suites',
    index: '04',
    title: 'Қонақүй нөмірлері (101–112)',
    subtitle: '12 люкс бөлме және жылы LED жарығы',
    description:
      'Әр секторда орналасқан нөмірленген люкс бөлмелер: панорамалық әйнек есік, кереует, диван, жылы жарық шамдары және жарық тақтайшасы. Центрифугалық 0.38 g жасанды тартылыс аймағында орналасқан.',
    specs: '12 люкс нөмір (№101–112) · Жылы LED шамдар · Шыны есіктер',
    explodeOffset: 0.45,
    cameraPreset: 'suites',
    metrics: {
      elevation: '+33.5 м',
      material: 'Жылы емен, титан және кварц әйнегі',
      powerLoad: '540 кВт',
    },
  },
  habitationFrame: {
    id: 'habitationFrame',
    index: '05',
    title: 'Тұрғын сақина қаңқасы',
    subtitle: 'Қос ярусты панорамалық әйнек пен күштік аркалар',
    description:
      'Жоғарғы және төменгі қисық көгілдір әйнек терезелерді біріктіретін 12 радиалды сатин-күміс арка мен периметрлік белдеу. Микрометеориттерден қорғайтын көпқабатты шпагатты әйнекпен қапталған.',
    specs: '12 радиалды арка · Қос панорамалық қабат · LED контур',
    explodeOffset: 0.95,
    cameraPreset: 'overview',
    metrics: {
      elevation: '+30.0 – +42.0 м',
      material: 'Сатин-күміс титан қорытпасы',
      powerLoad: '290 кВт',
    },
  },
  solarRoof: {
    id: 'solarRoof',
    index: '06',
    title: 'Күн панельдері шатыры',
    subtitle: 'Қос сақиналы фотоэлектрлік массив',
    description:
      'Бүкіл станцияны таза энергиямен қамтамасыз ететін ішкі және сыртқы концентрлі көк кремнийлі күн батареялары. Төменгі Жер орбитасында үздіксіз 4.2 МВт қуат өндіреді.',
    specs: '2 концентрлі сақина · 24 фотоэлектрлік сегмент',
    explodeOffset: 1.45,
    cameraPreset: 'solarRoof',
    metrics: {
      elevation: '+44.5 м',
      material: 'Монокристалды кремний панелі',
      powerLoad: '+4.2 МВт генерация',
    },
  },
  upperHub: {
    id: 'upperHub',
    index: '07',
    title: 'Жоғарғы түйісу торабы',
    subtitle: 'Орбиталық кемелерді қабылдау сақинасы',
    description:
      'Қонақтар мен жүк тасымалдау шаттлдарын қабылдауға арналған жоғарғы бақылау галереясы мен айналмалы түйісу белдеуі. Төрт радиалды герметикалық шлюзбен жабдықталған.',
    specs: '12 периметрлік маяк · Герметикалық шлюз торабы',
    explodeOffset: 2.0,
    cameraPreset: 'upperHub',
    metrics: {
      elevation: '+49.0 м',
      material: 'Герметикалық болат және эластомер',
      powerLoad: '380 кВт',
    },
  },
  spire: {
    id: 'spire',
    index: '08',
    title: 'Телеметрия мұнарасы',
    subtitle: 'Байланыс антеннасы және бақылау ұшы',
    description:
      'Жермен және орбиталық желілермен үздіксіз байланыс орнататын жоғары жиілікті антенна жүйесі. Оптикалық лазерлік ретранслятор мен навигациялық маякты қамтиды.',
    specs: 'Көпсатылы антенна · Жоғарғы навигациялық маяк',
    explodeOffset: 2.7,
    cameraPreset: 'upperHub',
    metrics: {
      elevation: '+54.0 – +72.0 м',
      material: 'Алтын-титан рефлектор және композит',
      powerLoad: '185 кВт',
    },
  },
};

export interface CameraPreset {
  id: CameraPresetId;
  label: string;
  position: [number, number, number];
  target: [number, number, number];
  fov: number;
}

export const CAMERA_PRESETS: CameraPreset[] = [
  {
    id: 'overview',
    label: 'Сыртқы көрініс',
    position: [8.8, 5.1, 9.6],
    target: [0.4, 2.55, 0],
    fov: 40,
  },
  {
    id: 'atrium',
    label: 'Кең дәліз (1:1)',
    position: [3.12, 3.28, 0.45],
    target: [1.85, 3.2, 2.55],
    fov: 58,
  },
  {
    id: 'suites',
    label: 'Нөмірлер',
    position: [3.4, 3.32, 2.35],
    target: [2.6, 3.22, 1.5],
    fov: 50,
  },
  {
    id: 'solarRoof',
    label: 'Күн шатыры',
    position: [4.8, 7.6, 5.4],
    target: [0, 4.1, 0],
    fov: 38,
  },
  {
    id: 'upperHub',
    label: 'Жоғарғы мұнара',
    position: [4.2, 6.2, 4.5],
    target: [0.6, 5.15, 0],
    fov: 40,
  },
  {
    id: 'rocket',
    label: 'Зымыран түйісуі',
    position: [5.4, 6.4, 3.8],
    target: [1.9, 5.2, 0.2],
    fov: 38,
  },
  {
    id: 'pedestal',
    label: 'Негізгі платформа',
    position: [4.4, 1.55, 4.9],
    target: [0, 1.15, 0],
    fov: 40,
  },
];

export interface VrStation {
  id: VrStationId;
  label: string;
  position: [number, number, number];
  lookYaw: number;
  hotelScale: number;
}

export const VR_STATIONS: VrStation[] = [
  {
    id: 'overview',
    label: 'Сыртқы панорама',
    position: [0, 3.25, 9.2],
    lookYaw: 0,
    hotelScale: 1,
  },
  {
    id: 'atrium',
    label: 'Кең дәліз (1:1)',
    position: [3.02, 3.24, 0.78],
    lookYaw: 1.1,
    hotelScale: 1,
  },
  {
    id: 'spire',
    label: 'Мұнара ұшы',
    position: [0, 5.3, 4.4],
    lookYaw: 0.4,
    hotelScale: 1,
  },
  {
    id: 'pedestal',
    label: 'Тірек деңгейі',
    position: [0, 1.1, 4.8],
    lookYaw: -0.4,
    hotelScale: 1,
  },
];

export type SuiteCategory = 'all' | 'earth' | 'garden' | 'commander';

export interface SuiteInfo {
  number: number;
  sector: number;
  angleDeg: number;
  name: string;
  category: Exclude<SuiteCategory, 'all'>;
  categoryLabel: string;
  viewOrientation: string;
  areaSqm: number;
  capacity: number;
  pricePerNightUsd: number;
  status: 'Бос' | 'Брондалған';
  highlights: string[];
}

export const ORBITAL_SUITES: SuiteInfo[] = [
  {
    number: 101,
    sector: 1,
    angleDeg: 0,
    name: 'Аврора Сьюті №101',
    category: 'earth',
    categoryLabel: 'Жер панорамасы',
    viewOrientation: 'Орбиталық көкжиек және Жер шары',
    areaSqm: 68,
    capacity: 2,
    pricePerNightUsd: 14500,
    status: 'Бос',
    highlights: ['Қисық панорамалық иллюминатор', '0.38 g жасанды тартылыс', 'Жеке телеметрия экраны'],
  },
  {
    number: 102,
    sector: 2,
    angleDeg: 30,
    name: 'Зенит Люксі №102',
    category: 'garden',
    categoryLabel: 'Атриум бағы',
    viewOrientation: '360° Ботаникалық бақ және променад',
    areaSqm: 64,
    capacity: 2,
    pricePerNightUsd: 12800,
    status: 'Бос',
    highlights: ['LED баққа тікелей шығу', 'Ақ емен интерьер', 'Дыбыс оқшаулағыш әйнек есік'],
  },
  {
    number: 103,
    sector: 3,
    angleDeg: 60,
    name: 'Байқоңыр Сьюті №103',
    category: 'earth',
    categoryLabel: 'Жер панорамасы',
    viewOrientation: 'Жер атмосферасының көгілдір доғасы',
    areaSqm: 74,
    capacity: 2,
    pricePerNightUsd: 15200,
    status: 'Брондалған',
    highlights: ['Кең бұрышты бақылау әйнегі', 'Био-ырғақты жарықтандыру', 'Кең демалыс диваны'],
  },
  {
    number: 104,
    sector: 4,
    angleDeg: 90,
    name: 'Командор Апартаменті №104',
    category: 'commander',
    categoryLabel: 'Командор',
    viewOrientation: 'Қос бағытты: Жер + Атриум',
    areaSqm: 105,
    capacity: 4,
    pricePerNightUsd: 22500,
    status: 'Бос',
    highlights: ['Қос панорамалық аймақ', 'Жеке шағын обсерватория', 'Шаттл шлюзіне басым қолжетімділік'],
  },
  {
    number: 105,
    sector: 5,
    angleDeg: 120,
    name: 'Эклиптика Люксі №105',
    category: 'garden',
    categoryLabel: 'Атриум бағы',
    viewOrientation: 'Орталық атриум және субұрқақ галереясы',
    areaSqm: 64,
    capacity: 2,
    pricePerNightUsd: 12800,
    status: 'Бос',
    highlights: ['Орталық баққа жақын орналасу', 'Жылы амбер LED жарығы', 'Эргономикалық кереует'],
  },
  {
    number: 106,
    sector: 6,
    angleDeg: 150,
    name: 'Солярис Сьюті №106',
    category: 'earth',
    categoryLabel: 'Жер панорамасы',
    viewOrientation: 'Күн шығуы мен Жер терминаторы',
    areaSqm: 72,
    capacity: 2,
    pricePerNightUsd: 14900,
    status: 'Бос',
    highlights: ['Тәулігіне 16 рет күн шығуын тамашалау', 'Ультракүлгін сүзгілі кварц әйнегі', 'Жеке капсула гардеробы'],
  },
  {
    number: 107,
    sector: 7,
    angleDeg: 180,
    name: 'Меридиан Люксі №107',
    category: 'earth',
    categoryLabel: 'Жер панорамасы',
    viewOrientation: 'Оңтүстік жартышар және жұлдызды аспан',
    areaSqm: 68,
    capacity: 2,
    pricePerNightUsd: 14500,
    status: 'Брондалған',
    highlights: ['Терең ғарыш телескопына қосылым', 'Жұмсақ акустикалық панельдер', 'Климат-бақылау 21.5°C'],
  },
  {
    number: 108,
    sector: 8,
    angleDeg: 210,
    name: 'Оазис Сьюті №108',
    category: 'garden',
    categoryLabel: 'Атриум бағы',
    viewOrientation: 'Гидропонды орман белдеуі',
    areaSqm: 66,
    capacity: 2,
    pricePerNightUsd: 13200,
    status: 'Бос',
    highlights: ['Табиғи оттегі аймағына жақын', 'Панорамалық жылжымалы есік', 'Ақ терраццо кіреберіс'],
  },
  {
    number: 109,
    sector: 9,
    angleDeg: 240,
    name: 'Каспий Сьюті №109',
    category: 'earth',
    categoryLabel: 'Жер панорамасы',
    viewOrientation: 'Еуразия континентінің орбиталық траекториясы',
    areaSqm: 74,
    capacity: 2,
    pricePerNightUsd: 15400,
    status: 'Бос',
    highlights: ['Қисық әйнек галереясы', 'Таңертеңгі жарық сценарийі', 'Жоғары жылдамдықты лазерлік байланыс'],
  },
  {
    number: 110,
    sector: 10,
    angleDeg: 270,
    name: 'Командор Апартаменті №110',
    category: 'commander',
    categoryLabel: 'Командор',
    viewOrientation: 'Шексіз 360° бұрыштық көрініс',
    areaSqm: 108,
    capacity: 4,
    pricePerNightUsd: 23000,
    status: 'Бос',
    highlights: ['Кеңес бөлмесі және демалыс салоны', 'Екі бөлек жатын аймағы', 'Жеке орбиталық стюард қызметі'],
  },
  {
    number: 111,
    sector: 11,
    angleDeg: 300,
    name: 'Люмина Люксі №111',
    category: 'garden',
    categoryLabel: 'Атриум бағы',
    viewOrientation: 'Төбелік LED люстралар галереясы',
    areaSqm: 64,
    capacity: 2,
    pricePerNightUsd: 12800,
    status: 'Бос',
    highlights: ['Тік лифт шахтасына жақын', 'Жылы жарық диодты рельеф', 'Ыңғайлы жұмыс үстелі'],
  },
  {
    number: 112,
    sector: 12,
    angleDeg: 330,
    name: 'Орион Сьюті №112',
    category: 'earth',
    categoryLabel: 'Жер панорамасы',
    viewOrientation: 'Түнгі қалалар шамы мен поляр шұғыласы',
    areaSqm: 70,
    capacity: 2,
    pricePerNightUsd: 14800,
    status: 'Бос',
    highlights: ['Астрофотография бекіткіші', 'Түнгі бейімделгіш жарық', 'Жоғарғы шлюзге тікелей көтерілу'],
  },
];

export const STATION_SPECS = [
  { label: 'Орбита биіктігі', value: '420 км', note: 'Төменгі Жер орбитасы (LEO)' },
  { label: 'Сыртқы диаметр', value: '180 м', note: '12 радиалды титан аркасы' },
  { label: 'Жасанды тартылыс', value: '0.38 g', note: 'Сақинаның айналуы арқылы' },
  { label: 'Күн энергетикасы', value: '4.2 МВт', note: '24 фотоэлектрлік сегмент' },
  { label: 'Секторлар мен люкс', value: '12 сектор', note: '№101–112 нөмірленген люкстер' },
  { label: 'Айналу периоды', value: '92.4 мин', note: 'Тәулігіне 15.6 орбита' },
];

export const GENERATED_IMAGES = {
  atrium: '/src/assets/images/orbital_atrium_promenade_1795417989973.jpg',
  suite: '/src/assets/images/orbital_luxury_suite_1795417989724.jpg',
  docking: '/src/assets/images/orbital_shuttle_docking_1795417989421.jpg',
  model: '/src/assets/images/orbital_architectural_model_1795417989289.jpg',
};
