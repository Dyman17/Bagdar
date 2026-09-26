import type { KioskConfig, Place, RouteResponse, SceneResponse } from '../types';

export const mockKioskConfig: KioskConfig = {
  screen_id: 'AKTAU-EMB-01',
  origin: {
    lat: 43.6582,
    lng: 51.1352,
    heading_deg: 45, // Facing along the scenic 15th microdistrict coastline
  },
  languages: ['kk', 'ru', 'en'],
  default_lang: 'kk',
  modes: {
    voice: true,
    tarihsky: true,
    qr: true,
    huskylens: false,
  },
  session: {
    idle_timeout_sec: 90,
    qr_timeout_sec: 60,
  },
  district: 'aktau-15-mkr',
  categories: ['culture', 'nature', 'park', 'history'],
};

export const rawPlacesSeed: any[] = [
  {
    id: 1,
    category: "culture",
    lat: 43.661365,
    lng: 51.132965,
    curatedBadge: "MUST-SEE · БАСТЫ ОРЫН",
    heroTag: "Амфитеатр",
    rating: 4.9,
    thumb_url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=85",
    photos: [
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=85",
      "https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=1600&q=85"
    ],
    hours: null,
    access: "walk",
    has_scene: true,
    texts: {
      kk: {
        name: "Амфитеатр",
        summary: "Каспий жағасындағы ашық сахна және басты мәдени алаң.",
        description: "Каспий жағасындағы ашық сахна. Жағалауда қалалық фестивальдер, концерттер мен халықаралық іс-шаралар өтеді.",
        address: "Ақтау, 15-шағынаудан жағалауы"
      },
      ru: {
        name: "Амфитеатр",
        summary: "Открытая сцена у Каспийского моря и центр культурных событий.",
        description: "Открытая сцена на набережной у Каспия. Здесь проходят главные городские праздники, закатные концерты и фестивали искусств.",
        address: "Актау, набережная 15-го микрорайона"
      },
      en: {
        name: "Amphitheater",
        summary: "Open-air seaside arena and premier cultural landmark.",
        description: "Open-air stage situated right by the Caspian shoreline. The venue hosts music festivals, city celebrations, and sunset concerts.",
        address: "Aktau, 15th microdistrict waterfront"
      }
    }
  },
  {
    id: 2,
    category: "park",
    lat: 43.662252,
    lng: 51.133075,
    curatedBadge: "CASPIAN SUNSET · КҮН БАТЫС",
    heroTag: "Променад",
    rating: 4.8,
    thumb_url: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=85",
    photos: [
      "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1600&q=85"
    ],
    hours: null,
    access: "walk",
    has_scene: true,
    texts: {
      kk: {
        name: "15-шағынаудан жағалауы",
        summary: "Теңіз бойындағы көркем серуен аймағы.",
        description: "Теңіз бойындағы серуен аймағы. Серуен жолы амфитеатрдың жанында орналасқан, ақшам уақытында күн батуын тамашалауға ең қолайлы орын.",
        address: "Ақтау, 15-шағынаудан жағалауы"
      },
      ru: {
        name: "Набережная 15-го микрорайона",
        summary: "Прогулочный променад вдоль бирюзовых вод Каспия.",
        description: "Широкий морской променад с освещением и скамейками. Лучшая локация города для вечерних прогулок и созерцания морского заката.",
        address: "Актау, набережная 15-го микрорайона"
      },
      en: {
        name: "15th Microdistrict Promenade",
        summary: "Scenic boulevard along the turquoise Caspian coast.",
        description: "Broad seaside promenade next to the amphitheater. The prime location to enjoy golden hour sea breezes and panoramic horizons.",
        address: "Aktau, 15th microdistrict waterfront"
      }
    }
  },
  {
    id: 3,
    category: "nature",
    lat: 43.658903,
    lng: 51.133838,
    curatedBadge: "PANORAMA · КӨРІНІС",
    heroTag: "Панорама",
    rating: 4.9,
    thumb_url: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=85",
    photos: [
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1600&q=85"
    ],
    hours: null,
    access: "walk",
    has_scene: false,
    texts: {
      kk: {
        name: "Көрініс алаңы",
        summary: "Каспий теңізіне қарайтын панорамалық кеңістік.",
        description: "Каспий теңізіне қарайтын панорамалық орын. Алаң жағалаудағы серуен аймағында орналасқан, алыс көкжиекке кең көрініс ашады.",
        address: "Ақтау, 15-шағынаудан жағалауы"
      },
      ru: {
        name: "Смотровая площадка",
        summary: "Панорамная площадка с обзором горизонта моря.",
        description: "Точка с великолепным панорамным обзором Каспийского моря. Идеальное место для панорамных фотографий побережья.",
        address: "Актау, набережная 15-го микрорайона"
      },
      en: {
        name: "Caspian Viewpoint",
        summary: "Panoramic observation terrace overlooking the sea.",
        description: "Elevated viewpoint opening into the endless marine horizon. A favorite photography stop along the coastal promenade.",
        address: "Aktau, 15th microdistrict waterfront"
      }
    }
  },
  {
    id: 4,
    category: "culture",
    lat: 43.659594,
    lng: 51.134827,
    curatedBadge: "HERITAGE · МҰРА",
    heroTag: "Скульптура",
    rating: 4.7,
    thumb_url: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1200&q=85",
    photos: [
      "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1600&q=85"
    ],
    hours: null,
    access: "walk",
    has_scene: false,
    texts: {
      kk: {
        name: "«Құдықшылар» мүсіні",
        summary: "Маңғыстау шебер құдықшыларына арналған монумент.",
        description: "Құрғақ далада өмір нәрін тапқан ержүрек құдық қазушы шеберлер құрметіне орнатылған мәдени ескерткіш.",
        address: "Ақтау, 15-шағынаудан жағалауы"
      },
      ru: {
        name: "Скульптура «Құдықшылар»",
        summary: "Монумент древним мастерам-колодцекопателям.",
        description: "Скульптурная композиция в честь мастеров, добывавших бесценную пресную воду в суровых известняковых плато Мангистау.",
        address: "Актау, набережная 15-го микрорайона"
      },
      en: {
        name: "Qudyqshylar Monument",
        summary: "Art tribute to the legendary desert well-diggers.",
        description: "Sculpture honoring the historical craftsmen whose deep wells brought life to the arid Mangystau steppes for millennia.",
        address: "Aktau, 15th microdistrict waterfront"
      }
    }
  },
  {
    id: 5,
    category: "culture",
    lat: 43.662236,
    lng: 51.132432,
    curatedBadge: "NOMADIC · ДАЛА РУХЫ",
    heroTag: "Скульптура",
    rating: 4.8,
    thumb_url: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=85",
    photos: [
      "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1600&q=85"
    ],
    hours: null,
    access: "walk",
    has_scene: false,
    texts: {
      kk: {
        name: "«Түйе мінген хан» мүсіні",
        summary: "Ұлы дала билеушісінің салтанатты бейнесі.",
        description: "Түйедегі салт атты бейнесі. Ұлы Жібек жолы мен Ұлы даланың бай тарихын еске салатын салтанатты монумент.",
        address: "Ақтау, 15-шағынаудан жағалауы"
      },
      ru: {
        name: "Скульптура «Хан на верблюде»",
        summary: "Монументальный образ правителя кочевой степи.",
        description: "Выразительная скульптура степного правителя, напоминающая о караванных дорогах Шелкового пути через полуостров Мангистау.",
        address: "Актау, набережная 15-го микрорайона"
      },
      en: {
        name: "Khan on a Camel",
        summary: "Monumental sculpture of a steppe sovereign.",
        description: "Striking bronze sculpture evoking the grandeur of the ancient Silk Road trading trails across the Caspian coast.",
        address: "Aktau, 15th microdistrict waterfront"
      }
    }
  },
  {
    id: 6,
    category: "culture",
    lat: 43.664791,
    lng: 51.132468,
    curatedBadge: "ICON · ТАҢБА",
    heroTag: "Скульптура",
    rating: 4.6,
    thumb_url: "https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=1200&q=85",
    photos: [
      "https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=1600&q=85"
    ],
    hours: null,
    access: "walk",
    has_scene: false,
    texts: {
      kk: {
        name: "«Кобра» мүсіні",
        summary: "Жағалау бойындағы айбарлы кобра бейнесі.",
        description: "Жағалаудағы кобра бейнесі. Туристердің сүйікті фотолокацияларының бірі болып табылатын ерекше өнер туындысы.",
        address: "Ақтау, 15-шағынаудан жағалауы"
      },
      ru: {
        name: "Скульптура «Кобра»",
        summary: "Динамичная фигура кобры на фоне морской глади.",
        description: "Скульптура кобры на набережной. Узнаваемый арт-объект современного Актау, популярное место для памятных снимков.",
        address: "Актау, набережная 15-го микрорайона"
      },
      en: {
        name: "Cobra Sculpture",
        summary: "Expressive coastal sculpture against the sea backdrop.",
        description: "Dynamic art installation depicting a cobra, representing the resilient fauna of the Mangystau desert plateau.",
        address: "Aktau, 15th microdistrict waterfront"
      }
    }
  },
  {
    id: 7,
    category: "culture",
    lat: 43.665396,
    lng: 51.132105,
    curatedBadge: "MYTHOLOGY · АҢЫЗ",
    heroTag: "Скульптура",
    rating: 4.8,
    thumb_url: "https://images.unsplash.com/photo-1490730141103-6cac27aaab94?auto=format&fit=crop&w=1200&q=85",
    photos: [
      "https://images.unsplash.com/photo-1490730141103-6cac27aaab94?auto=format&fit=crop&w=1600&q=85"
    ],
    hours: null,
    access: "walk",
    has_scene: false,
    texts: {
      kk: {
        name: "«Қасқыр мінген бала» мүсіні",
        summary: "Көкбөрі туралы көне түркілік аңыз мотивтері.",
        description: "Қасқыр мінген бала бейнесі. Ежелгі түркі шежіресіндегі батылдық пен табиғатпен үйлесімділікті паш ететін композиция.",
        address: "Ақтау, 15-шағынаудан жағалауы"
      },
      ru: {
        name: "Скульптура «Ребёнок на волке»",
        summary: "Тюркская легенда о священном волке Көкбөрі.",
        description: "Художественное воплощение древней легенды о предке-тотеме, символизирующее связь поколений и силу духа степи.",
        address: "Актау, набережная 15-го микрорайона"
      },
      en: {
        name: "Child on a Wolf Sculpture",
        summary: "Turkic mythology inspired monument to the sacred wolf.",
        description: "Mythological sculpture echoing the ancient steppe legends of Kok-Bori, the sacred protective wolf ancestor.",
        address: "Aktau, 15th microdistrict waterfront"
      }
    }
  },
  {
    id: 8,
    category: "culture",
    lat: 43.656153,
    lng: 51.147971,
    curatedBadge: "LANDMARK · ТУ ТҰҒЫРЫ",
    heroTag: "Флагшток",
    rating: 4.9,
    thumb_url: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=85",
    photos: [
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1600&q=85"
    ],
    hours: null,
    access: "walk",
    has_scene: false,
    texts: {
      kk: {
        name: "Бас ту тұғыры",
        summary: "Қазақстанның көгілдір туы желбіреген мемлекеттік монумент.",
        description: "Жағалау маңындағы биік ту тұғыры. Қаланың кез келген нүктесінен көрінетін айбынды мемлекеттік рәміз.",
        address: "Ақтау, 15-шағынаудан жағалауы"
      },
      ru: {
        name: "Главный флагшток",
        summary: "Величественный флагшток с государственным флагом Казахстана.",
        description: "Монументальный флагшток на возвышении у моря, где государственный флаг развевается на фоне каспийских просторов.",
        address: "Актау, набережная 15-го микрорайона"
      },
      en: {
        name: "Grand Flagpole",
        summary: "Majestic national flagpole towering over the shoreline.",
        description: "A commanding landmark bearing the sky-blue flag of Kazakhstan waving proudly in the open Caspian breezes.",
        address: "Aktau, 15th microdistrict waterfront"
      }
    }
  },
  {
    id: 9,
    category: "park",
    lat: 43.66546,
    lng: 51.141331,
    curatedBadge: "FAMILY · ОТБАСЫЛЫҚ",
    heroTag: "Парк",
    rating: 4.7,
    thumb_url: "https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=1200&q=85",
    photos: [
      "https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=1600&q=85"
    ],
    hours: null,
    access: "walk",
    has_scene: false,
    texts: {
      kk: {
        name: "Балалар ойын паркі",
        summary: "Заманауи қауіпсіз отбасылық демалыс кеңістігі.",
        description: "Жағалау ауданындағы жасыл демалыс аймағы, балғындар мен отбасыларға арналған түрлі ойын алаңдары бар.",
        address: "Ақтау, 15-шағынаудан"
      },
      ru: {
        name: "Детский игровой парк",
        summary: "Современное семейное пространство у моря.",
        description: "Благоустроенный парк с безопасным игровым городком, тенистыми навесами и зонами семейного отдыха.",
        address: "Актау, набережная 15-го микрорайона"
      },
      en: {
        name: "Seaside Play Park",
        summary: "Modern family recreation area near the beach.",
        description: "Well-equipped community recreation park featuring child-friendly installations, shaded walks, and green lawns.",
        address: "Aktau, 15th microdistrict waterfront"
      }
    }
  },
  {
    id: 10,
    category: "park",
    lat: 43.656405,
    lng: 51.139441,
    curatedBadge: "RELAX · ДЕМАЛЫС",
    heroTag: "Сквер",
    rating: 4.8,
    thumb_url: "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?auto=format&fit=crop&w=1200&q=85",
    photos: [
      "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?auto=format&fit=crop&w=1600&q=85"
    ],
    hours: null,
    access: "walk",
    has_scene: false,
    texts: {
      kk: {
        name: "Жағалау демалыс орталығы",
        summary: "Теңіз толқынын тыңдап тынығатын жайлы саябақ.",
        description: "Демалыс пен серуенге арналған жайлы орын. Теңіз жағасына тікелей шығатын ағаш жолдар мен демалыс орындары бар.",
        address: "Ақтау, 15-шағынаудан жағалауы"
      },
      ru: {
        name: "Прибрежная зона отдыха",
        summary: "Уютный зеленый сквер со спуском к воде.",
        description: "Зона релаксации со скамейками из натурального дерева, тенистыми аллеями и комфортным спуском к лазурной воде.",
        address: "Актау, набережная 15-го микрорайона"
      },
      en: {
        name: "Coastal Relaxation Park",
        summary: "Peaceful seaside park with direct water access.",
        description: "Serene garden area with wooden benches and direct walkways leading down to the gentle Caspian shoreline.",
        address: "Aktau, 15th microdistrict waterfront"
      }
    }
  }
];

export const mockScenes: Record<number, SceneResponse> = {
  1: {
    place_id: 1,
    enabled: true,
    modern_url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=85",
    historic_url: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1600&q=85",
    attribution: "TarihSky · Тарихи фотохроника 1968 г.",
    texts: {
      kk: {
        title: "Амфитеатр: өткен мен бүгін",
        body: "1960 жылдары бұл жағалауда тек геологтардың шағын айлағы мен ақ шағылдар ғана болған. Бүгінде мұнда қалалық мәдениеттің інжу-маржаны — заманауи ашық амфитеатр бой көтерген."
      },
      ru: {
        title: "Амфитеатр: тогда и сейчас",
        body: "В 1960-х годах на этом месте находился дикий известняковый берег Каспия и причал первых геологов. Сегодня здесь возведен главный амфитеатр города — эпицентр культурной жизни Мангистау."
      },
      en: {
        title: "Amphitheater: Then and Now",
        body: "In the 1960s, this coast was an untouched limestone bay used by the first desert geologists. Today, it stands as the vibrant architectural crown of Aktau's cultural waterfront."
      }
    },
    sources: ["Мангистауский областной историко-краеведческий музей", "Архив Шевченко/Актау"]
  },
  2: {
    place_id: 2,
    enabled: true,
    modern_url: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1600&q=85",
    historic_url: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1600&q=85",
    attribution: "TarihSky · Архивные кадры 1974 г.",
    texts: {
      kk: {
        title: "15-шағынаудан жағалауының тарихы",
        body: "Қаланың негізі қаланған алғашқы жылдары бұл аймақ ақтаулықтардың сүйікті жабайы жағажайы болған. Қазір бұл жайлы заманауи променад."
      },
      ru: {
        title: "Набережная 15-го микрорайона: хроника",
        body: "В период зарождения города здесь начиналась первая прогулочная линия вдоль белоснежных меловых скал. Сейчас это благоустроенный приморский бульвар."
      },
      en: {
        title: "15th Microdistrict Promenade Heritage",
        body: "During the early city boom of the 1970s, this limestone stretch was a wild swimming bay. Today it is one of the Caspian's most elegant boulevards."
      }
    },
    sources: ["Городской архив города Актау"]
  }
};

// Precise distance calculation
export function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371e3;
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return Math.round(R * c);
}

// Precise bearing calculation from Point 1 to Point 2 (0-360)
export function calculateBearing(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const y = Math.sin(((lon2 - lon1) * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180);
  const x =
    Math.cos((lat1 * Math.PI) / 180) * Math.sin((lat2 * Math.PI) / 180) -
    Math.sin((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.cos(((lon2 - lon1) * Math.PI) / 180);
  const θ = Math.atan2(y, x);
  const brng = ((θ * 180) / Math.PI + 360) % 360;
  return Math.round(brng);
}

export function generateMockRoute(origin: { lat: number; lng: number }, place: Place, lang: string = 'ru'): RouteResponse {
  const dist = calculateDistance(origin.lat, origin.lng, place.lat, place.lng);
  const bearing = calculateBearing(origin.lat, origin.lng, place.lat, place.lng);
  const durationMin = Math.max(1, Math.round(dist / 80)); // 80m/min walking speed

  let dirText = 'идите прямо';
  if (lang === 'kk') {
    dirText = bearing >= 315 || bearing < 45 ? 'солтүстікке қарай жүріңіз' :
              bearing >= 45 && bearing < 135 ? 'шығысқа қарай жүріңіз' :
              bearing >= 135 && bearing < 225 ? 'оңтүстікке қарай жүріңіз' : 'батысқа (теңізге) қарай жүріңіз';
  } else if (lang === 'en') {
    dirText = bearing >= 315 || bearing < 45 ? 'head north' :
              bearing >= 45 && bearing < 135 ? 'head east' :
              bearing >= 135 && bearing < 225 ? 'head south' : 'head west towards the sea';
  } else {
    dirText = bearing >= 315 || bearing < 45 ? 'направляйтесь на север' :
              bearing >= 45 && bearing < 135 ? 'направляйтесь на восток' :
              bearing >= 135 && bearing < 225 ? 'направляйтесь на юг' : 'направляйтесь на запад к морю';
  }

  // Realistic waypoint curve along the 15th microdistrict coastline
  const midLat = (origin.lat + place.lat) / 2 + 0.0002;
  const midLng = (origin.lng + place.lng) / 2 - 0.0001;

  return {
    place_id: place.id,
    mode: 'walk',
    distance_m: dist,
    duration_min: durationMin,
    bearing_deg: bearing,
    direction_text: dirText,
    is_approximate: false,
    geometry: {
      type: 'LineString',
      coordinates: [
        [origin.lng, origin.lat],
        [midLng, midLat],
        [place.lng, place.lat]
      ]
    },
    steps: [
      {
        instruction: lang === 'kk' ? `Стелладан шығып, ${dirText}` : lang === 'en' ? `From kiosk, ${dirText}` : `От стелы ${dirText}`,
        distance_m: Math.round(dist * 0.4)
      },
      {
        instruction: lang === 'kk' ? `Жағалау бойымен жалғастырыңыз (${place.name})` : lang === 'en' ? `Continue along seaside promenade to ${place.name}` : `Следуйте по набережной к «${place.name}»`,
        distance_m: Math.round(dist * 0.6)
      }
    ]
  };
}
