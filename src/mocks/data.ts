import type { Config, PlaceDetail, PlaceSummary, RouteResponse, SceneResponse } from '../types'

export const mockConfig: Config = {
  screen_id: 'AKTAU-EMB-01',
  origin: { lat: 43.6582, lng: 51.1352, heading_deg: 45 },
  languages: ['kk', 'ru', 'en'],
  default_lang: 'kk',
  modes: { voice: true, tarihsky: true, qr: true, huskylens: false },
  session: { idle_timeout_sec: 90, qr_timeout_sec: 60 },
  district: 'aktau-15-mkr',
  categories: ['culture', 'nature', 'park', 'history', 'religion', 'mall', 'food', 'hotel', 'tour'],
}

type Localized = Record<'ru' | 'kk' | 'en', { name: string; summary: string; description: string; address: string }>

interface MockPlaceSeed {
  id: number
  category: string
  lat: number
  lng: number
  has_scene: boolean
  access: 'walk' | 'transit'
  image: string
  texts: Localized
}

export const mockPlaceSeeds: MockPlaceSeed[] = [
  {
    "id": 1,
    "category": "culture",
    "lat": 43.661365,
    "lng": 51.132965,
    "has_scene": false,
    "access": "walk",
    "image": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=85",
    "texts": {
      "ru": {
        "name": "Амфитеатр и набережная",
        "summary": "Открытая сцена на берегу Каспия — центр городских событий. Бесплатно, 24/7.",
        "description": "Амфитеатр на набережной 15-го микрорайона. Здесь проходят городские праздники, фестивали и открывается лучший вид на морской закат. Точка стелы BaGdar. Вход свободный, круглосуточно.",
        "address": "Актау, набережная 15-го микрорайона"
      },
      "kk": {
        "name": "Амфитеатр және набережная",
        "summary": "Каспий жағасындағы ашық сахна — қала мерекелерінің орталығы. Тегін, 24/7.",
        "description": "15-шағынаудан жағалауындағы амфитеатр. Мұнда қалалық мерекелер, концерттер мен кешкі серуендер өтеді. Стеланың негізгі бастапқы нүктесі (AKTAU-EMB-01). Бағасы: Тегін.",
        "address": "Ақтау, 15-шағынаудан жағалауы"
      },
      "en": {
        "name": "Amphitheater & Promenade",
        "summary": "Open-air seaside stage and the main city event hub. Free, 24/7.",
        "description": "Amphitheater on the 15th microdistrict waterfront. The prime spot for cultural festivals, evening walks and sunset views. BaGdar kiosk origin. Free admission, open 24/7.",
        "address": "Aktau, 15th microdistrict waterfront"
      }
    }
  },
  {
    "id": 2,
    "category": "park",
    "lat": 43.662252,
    "lng": 51.133075,
    "has_scene": true,
    "access": "walk",
    "image": "https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?auto=format&fit=crop&w=1200&q=85",
    "texts": {
      "ru": {
        "name": "Набережная 15-го микрорайона (Променад)",
        "summary": "Морской променад длиной 5 км вдоль Каспия. История «Тогда и сейчас» (TarihSky).",
        "description": "Главный променад Актау вдоль моря. Построен в 1970-х годах на месте скалистого берега. Идеален для пеших прогулок, бега и вечернего отдыха под шум прибоя.",
        "address": "Актау, набережная 15-го микрорайона"
      },
      "kk": {
        "name": "15-шағынаудан жағалауы (Променад)",
        "summary": "Каспий бойымен 5 шақырымға созылатын серуен жолы. Бұрын және қазір (TarihSky).",
        "description": "Ақтаудың басты теңіз променады. 1970-жылдары салынғаннан бері қаланың мақтанышы. Жүгіру жолақтары, орындықтар, түнгі шамдар бар.",
        "address": "Ақтау, 15-шағынаудан жағалауы"
      },
      "en": {
        "name": "15th Microdistrict Promenade",
        "summary": "Seaside 5 km promenade along the Caspian. Then and Now history (TarihSky).",
        "description": "Aktau's landmark coastal promenade. Built in the 1970s over rocky cliffs. Features cycling tracks, night lights, and sweeping sea horizons.",
        "address": "Aktau, 15th microdistrict waterfront"
      }
    }
  },
  {
    "id": 3,
    "category": "park",
    "lat": 43.642,
    "lng": 51.155,
    "has_scene": false,
    "access": "walk",
    "image": "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=85",
    "texts": {
      "ru": {
        "name": "Скальная тропа (Rock Trail)",
        "summary": "Уникальная пешеходная тропа прямо по скалам над волнами Каспия. ~850 м от центра.",
        "description": "Главная визитная карточка Актау. Деревянный настил проложен прямо по отвесным скалам над морем. Вечером включается художественная иллюминация, открываются гроты и пещеры. Вход свободный, круглосуточно.",
        "address": "Актау, скальное побережье 4-го микрорайона"
      },
      "kk": {
        "name": "Жартасты соқпақ (Скальная тропа)",
        "summary": "Каспий жартастарының үстімен салынған керемет жаяу жүргіншілер жолы. ~850 м.",
        "description": "Ақтаудың басты туристік визиткасы. Жартас қуыстары арқылы өтетін, ағаш төселген және кешкі түрлі-түсті жарықтандыруы бар соқпақ. Теңіз үстіндегі көпірлер мен үңгірлер. Тегін, 24/7.",
        "address": "Ақтау, 4-шағынаудан жартасы"
      },
      "en": {
        "name": "Rock Trail (Skalnaya Tropa)",
        "summary": "Scenic coastal pathway built directly onto sea cliffs. ~850 m from center.",
        "description": "Aktau's signature attraction. A wooden boardwalk clinging to vertical cliffs over the Caspian waves, with caves and dynamic evening illumination. Free access, 24/7.",
        "address": "Aktau, 4th microdistrict cliff coast"
      }
    }
  },
  {
    "id": 4,
    "category": "history",
    "lat": 43.6438,
    "lng": 51.1594,
    "has_scene": true,
    "access": "walk",
    "image": "https://images.unsplash.com/photo-1509233725247-49e657c54213?auto=format&fit=crop&w=1200&q=85",
    "texts": {
      "ru": {
        "name": "Маяк на крыше жилого дома",
        "summary": "Единственный в СНГ действующий маяк на крыше жилой высотки. Символ Актау.",
        "description": "Маяк «Меловой» установлен на крыше 11-этажного жилого дома №9 в 4-м микрорайоне в 1974 году. Уникальное инженерное решение, ориентир для судов в Каспийском море. Осмотр снаружи 24/7, бесплатно.",
        "address": "Актау, 4-й микрорайон, дом 9"
      },
      "kk": {
        "name": "Тұрғын үй төбесіндегі шамшырақ (Маяк)",
        "summary": "Тұрғын үйдің шатырында орналасқан ТМД-дағы жалғыз жұмыс істеп тұрған маяк.",
        "description": "4-шағынаудандағы 9-үйдің төбесінде 1974 жылы орнатылған Меловой маягы. Кемелерге жол көрсететін ерекше сәулет ескерткіші. Сыртынан көру 24/7, тегін.",
        "address": "Ақтау, 4-шағынаудан, 9-үй"
      },
      "en": {
        "name": "Rooftop Lighthouse",
        "summary": "The only functioning lighthouse in CIS built on top of a residential building.",
        "description": "The Melovoy Lighthouse was installed in 1974 on the roof of a high-rise residential block in the 4th microdistrict. A unique maritime landmark visible across the bay. View outside 24/7, free.",
        "address": "Aktau, 4th microdistrict, building 9"
      }
    }
  },
  {
    "id": 5,
    "category": "history",
    "lat": 43.6385,
    "lng": 51.1685,
    "has_scene": false,
    "access": "walk",
    "image": "https://images.unsplash.com/photo-1566127444979-b3d2b654e3d7?auto=format&fit=crop&w=1200&q=85",
    "texts": {
      "ru": {
        "name": "Мангистауский историко-краеведческий музей",
        "summary": "Океан Тетис, Шелковый путь, сокровища кочевников и этнография. Билет ~500–1000 ₸.",
        "description": "Крупнейший музей региона. 9 экспозиционных залов: палеонтология древнего океана Тетис, археология стоянок Шелкового пути, традиционная казахская юрта, ковры и оружие адайцев. Пн — выходной.",
        "address": "Актау, 9-й микрорайон, 23А"
      },
      "kk": {
        "name": "Маңғыстау облыстық тарихи-өлкетану музейі",
        "summary": "Тетис теңізі, Жібек жолы, қазақ этнографиясы және өлкенің бай тарихы. ~500–1000 ₸.",
        "description": "Өңірдің ең ірі музейі. Мұнда көне аммониттер, суфийлік жәдігерлер, көшпенділердің алтын бұйымдары мен Маңғыстаудың табиғи байлықтары қойылған. Дс — демалыс.",
        "address": "Ақтау, 9-шағынаудан, 23А ғимараты"
      },
      "en": {
        "name": "Mangystau Regional History Museum",
        "summary": "Ancient Tethys Ocean, Silk Road history, and nomad ethnography. Tickets ~500–1000 KZT.",
        "description": "The largest museum in the region with 9 halls covering prehistoric fossils, Silk Road archaeological finds, traditional Kazakh yurts, and Mangystau heritage. Closed on Mondays.",
        "address": "Aktau, 9th microdistrict, 23A"
      }
    }
  },
  {
    "id": 6,
    "category": "culture",
    "lat": 43.6395,
    "lng": 51.1662,
    "has_scene": false,
    "access": "walk",
    "image": "https://images.unsplash.com/photo-1569974498991-d3c12a504f95?auto=format&fit=crop&w=1200&q=85",
    "texts": {
      "ru": {
        "name": "Мемориал «Вечный огонь» и памятник Шевченко",
        "summary": "Центральная площадь города, сквер Победы и надпись «I Love Aktau». 24/7.",
        "description": "Исторический центр Актау. Мемориал в виде стилизованной казахской юрты, памятник Тарасу Шевченко и популярная фотозона «I Love Aktau». Отличный ориентир в центре города.",
        "address": "Актау, 7-й микрорайон, сквер Победы"
      },
      "kk": {
        "name": "«Мәңгілік алау» және Т. Шевченко ескерткіші",
        "summary": "Қаланың орталық алаңы, Жеңіс гүлзары мен «I Love Aktau» стеласы. 24/7.",
        "description": "Ақтаудың қақ ортасындағы басты тарихи және серуен алаңы. Қала тұрғындары мен қонақтарының кездесу орны. Тегін, тәулік бойы.",
        "address": "Ақтау, 7-шағынаудан, Жеңіс алаңы"
      },
      "en": {
        "name": "Eternal Flame Memorial & Shevchenko Monument",
        "summary": "Central city memorial square, Victory park and 'I Love Aktau' sign. 24/7.",
        "description": "The historic core of Aktau. Features a yurt-shaped war memorial, monument to Taras Shevchenko, and the iconic 'I Love Aktau' photo spot. Open 24/7.",
        "address": "Aktau, 7th microdistrict, Victory Square"
      }
    }
  },
  {
    "id": 7,
    "category": "religion",
    "lat": 43.648,
    "lng": 51.173,
    "has_scene": false,
    "access": "walk",
    "image": "https://images.unsplash.com/photo-1542810634-71277d95dcbb?auto=format&fit=crop&w=1200&q=85",
    "texts": {
      "ru": {
        "name": "Городская мечеть Бекет-Ата",
        "summary": "Центральная мечеть Актау из белого ракушечника. 08:00–20:00, вход свободный.",
        "description": "Главная соборная мечеть города, названная в честь святого суфия Бекет-ата. Построена из белоснежного мангистауского известняка с золотыми куполами. Просьба соблюдать дресс-код при посещении.",
        "address": "Актау, 26-й микрорайон"
      },
      "kk": {
        "name": "Бекет-Ата қалалық мешіті",
        "summary": "Ақтаудың орталық мешіті — ақ ұлутастан қаланған сәулет өнері. 08:00–20:00, тегін.",
        "description": "Қала орталығындағы еңселі бас мешіт. Маңғыстаудың ақ тасынан қаланған, алтын жалатқан күмбездері бар рухани кешен. Киім кию әдебін сақтау сұралады.",
        "address": "Ақтау, 26-шағынаудан"
      },
      "en": {
        "name": "Beket-Ata City Mosque",
        "summary": "Central Aktau mosque crafted from white Mangystau limestone. 08:00–20:00, free.",
        "description": "The principal cathedral mosque of Aktau named after the venerated Sufi philosopher Beket-Ata. Built of glowing white local limestone with golden domes. Modest dress required.",
        "address": "Aktau, 26th microdistrict"
      }
    }
  },
  {
    "id": 8,
    "category": "nature",
    "lat": 43.6475,
    "lng": 51.189,
    "has_scene": false,
    "access": "walk",
    "image": "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=1200&q=85",
    "texts": {
      "ru": {
        "name": "Ботанический сад Актау",
        "summary": "Рукотворный зелёный оазис посреди полупустыни. Билет ~500 ₸.",
        "description": "Уникальный ботанический сад, выращенный в засушливом климате полуострова Мангышлак. Коллекция редких засухоустойчивых деревьев, розарий и тенистые аллеи. Вс — выходной.",
        "address": "Актау, 10-й микрорайон"
      },
      "kk": {
        "name": "Ақтау ботаникалық бағы",
        "summary": "Шөл ортасындағы жасыл оазис — сирек өсімдіктер мекені. Билет ~500 ₸.",
        "description": "Маңғыстаудың қуаң климатында қолдан жасалған ғылыми-тәжірибелік бақ. Мұнда шөл жағдайына бейімделген жүздеген ағаш пен бұта өседі. Жексенбі — демалыс.",
        "address": "Ақтау, 10-шағынаудан"
      },
      "en": {
        "name": "Aktau Botanical Garden",
        "summary": "A lush man-made oasis amidst the arid semi-desert. Entry ~500 KZT.",
        "description": "An experimental botanical garden cultivated on the Mangyshlak peninsula. Showcases hundreds of drought-resistant plant species, shady avenues, and roses.",
        "address": "Aktau, 10th microdistrict"
      }
    }
  },
  {
    "id": 9,
    "category": "park",
    "lat": 43.628,
    "lng": 51.185,
    "has_scene": false,
    "access": "walk",
    "image": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=85",
    "texts": {
      "ru": {
        "name": "Пляжи Актау (Манила, Марракеш, Достар)",
        "summary": "Песчаный берег, бирюзовый Каспий, шезлонги 2000–5000 ₸, сезон май–сентябрь.",
        "description": "Главная пляжная линия города в районе 1-го микрорайона. Мелкий золотистый песок, пологий вход в воду, прокат сапбордов, пляжные кафе и зоны отдыха.",
        "address": "Актау, 1-й микрорайон, теплое побережье"
      },
      "kk": {
        "name": "Ақтау қалалық жағажайлары (Манила, Марракеш, Достар)",
        "summary": "Құмды жағажай, Каспий толқыны, су аттракциондары. Жатын орын 2000–5000 ₸.",
        "description": "1-шағынаудан маңындағы жағажай аймағы. Жазда шомылуға, күнге қыздырынуға және су спортына арналған ең қолайлы орын. Жағалауда дәмханалар бар.",
        "address": "Ақтау, 1-шағынаудан, жылы жағажай"
      },
      "en": {
        "name": "Aktau Beaches (Manila, Marrakesh, Dostar)",
        "summary": "Sandy Caspian shore, sun loungers 2000–5000 KZT, swimming season May–Sept.",
        "description": "The primary beach strip of Aktau located near the 1st microdistrict. Features golden sand, gentle sea entry, paddleboard rentals, and lively beachside cafes.",
        "address": "Aktau, 1st microdistrict coastline"
      }
    }
  },
  {
    "id": 10,
    "category": "mall",
    "lat": 43.645,
    "lng": 51.165,
    "has_scene": false,
    "access": "walk",
    "image": "https://images.unsplash.com/photo-1519567241046-7f570eee3ce6?auto=format&fit=crop&w=1200&q=85",
    "texts": {
      "ru": {
        "name": "ТРК Aktau Mall и ТРК Дина",
        "summary": "Шопинг, сувениры, фудкорт, местная сим-карта и банкоматы. 10:00–22:00.",
        "description": "Крупнейший торгово-развлекательный комплекс Актау. Отличное место, чтобы купить сувениры, оформить местную SIM-карту, перекусить на фудкорте или зайти в супермаркет.",
        "address": "Актау, 16-й микрорайон"
      },
      "kk": {
        "name": "Aktau Mall және «Дина» сауда орталығы",
        "summary": "Басты сауда орталықтары, фудкорт, кәдесыйлар және банкоматтар. 10:00–22:00.",
        "description": "Ақтаудағы сауда және ойын-сауық орталығы. Мұнда жергілікті кәдесыйлар, ұялы байланыс нүктелері, фудкорт және супермаркет орналасқан.",
        "address": "Ақтау, 16-шағынаудан"
      },
      "en": {
        "name": "Aktau Mall & Shopping Centers",
        "summary": "Shopping, Mangystau souvenirs, food court, telecom and ATMs. 10:00–22:00.",
        "description": "Aktau's top shopping mall. Ideal for buying local handicrafts and souvenirs, obtaining local SIM cards, grabbing a meal at the food court, or shopping essentials.",
        "address": "Aktau, 16th microdistrict"
      }
    }
  },
  {
    "id": 101,
    "category": "nature",
    "lat": 43.4167,
    "lng": 54.0667,
    "has_scene": true,
    "access": "transit",
    "image": "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1200&q=85",
    "texts": {
      "ru": {
        "name": "Урочище Бозжыра («Клыки и Гребень Дракона»)",
        "summary": "Белоснежные меловые замки (250 м) на дне океана Тетис — символ Мангистау. Джип-тур.",
        "description": "Жемчужина плато Устюрт. «Казахстанский Гранд-Каньон» и «Париж без Эйфелевой башни». Огромные белые останцы-клыки высотой до 250 метров, Гребень Дракона и инопланетные просторы. Расстояние от Актау ~270 км, доступно на внедорожниках 4х4.",
        "address": "Мангистауская область, плато Устюрт, Бозжыра"
      },
      "kk": {
        "name": "Бозжыра шатқалы («Айдаһар қырқасы»)",
        "summary": "Марс пейзажындай ақ бор шыңдары (250 м) — Маңғыстаудың бас символы. Джип-тур.",
        "description": "Үстірт қыртысындағы ғажайып шатқал. Биіктігі 250 метрге жететін ақ бор кездері («Азу тістер»), Айдаһар қырқасы мен Марс ландшафты. Ақтаудан ~270 км, тек 4x4 джиппен бару керек.",
        "address": "Маңғыстау, Үстірт қорығы, Бозжыра шатқалы"
      },
      "en": {
        "name": "Bozjyra Tract (Fangs & Dragon Crest)",
        "summary": "Towering 250m white chalk cliffs on the ancient Tethys seabed — Mangystau's icon.",
        "description": "The crown jewel of the Ustyurt Plateau. Spectacular chalk buttes rising 250 meters, the famous Dragon Crest, and Martian desert panoramas. ~270 km from Aktau, accessible exclusively by 4x4 expedition.",
        "address": "Mangystau Region, Ustyurt Plateau, Bozjyra"
      }
    }
  },
  {
    "id": 102,
    "category": "nature",
    "lat": 44.3211,
    "lng": 51.5956,
    "has_scene": false,
    "access": "transit",
    "image": "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=85",
    "texts": {
      "ru": {
        "name": "Торыш — Долина шаров (Valley of Balls)",
        "summary": "Поле загадочных каменных шаров-сфер диаметром до 4 метров. Рейтинг 4.9 в 2ГИС.",
        "description": "Уникальное геологическое явление в ~100 км от Актау. Сотни гигантских шаровидных конкреций, словно раскиданных великанами по степи. Возраст сфер — десятки миллионов лет, внутри находят окаменелости древних аммонитов.",
        "address": "Мангистауская область, урочище Торыш"
      },
      "kk": {
        "name": "Торыш — Шарлар алқабы (Долина шаров)",
        "summary": "Диаметрі 3-4 метрлік жұмбақ тас шарлар. 2ГИС рейтингі 4.9/5.",
        "description": "Ақтаудан ~100 км жердегі табиғат ғажайыбы. Мыңдаған дөп-дөңгелек тас конкрециялар далада шашылып жатыр. Ішінде миллиондаған жылдар бұрынғы аммониттер сақталған.",
        "address": "Маңғыстау ауданы, Торыш алқабы"
      },
      "en": {
        "name": "Torysh — Valley of Balls",
        "summary": "A field of mysterious spherical stones up to 4 meters wide. Rated 4.9 on 2GIS.",
        "description": "An enigmatic geological wonder ~100 km from Aktau. Hundreds of gigantic spherical stone concretions scattered across the steppe like marbles dropped by titans. Rich in ancient marine fossils.",
        "address": "Mangystau Region, Torysh Tract"
      }
    }
  },
  {
    "id": 103,
    "category": "history",
    "lat": 44.2547,
    "lng": 52.0069,
    "has_scene": false,
    "access": "transit",
    "image": "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1200&q=85",
    "texts": {
      "ru": {
        "name": "Священная гора Шеркала",
        "summary": "Одинокая гора-юрта и гора-сфинкс с древними пещерами. Обход 2 часа — на желание.",
        "description": "Одиноко стоящая гора-останец в ~140 км от Актау. С одного ракурса выглядит как гигантская белая юрта, с другого — как спящий лев-сфинкс. У подножия находился средневековый город Кызкала. Традиция: обойти гору вокруг за 2 часа и загадать желание.",
        "address": "Мангистауская область, близ посёлка Шетпе"
      },
      "kk": {
        "name": "Шерқала қасиетті тауы",
        "summary": "Киіз үйге немесе сфинкске ұқсайтын аңызға толы тау. ~140 км, айналу 2 сағат.",
        "description": "Ақтаудан 140 км қашықтықтағы оқшау тау. Бір жағынан қарағанда алып ақ киіз үйге, екінші жағынан ұйқыдағы сфинкске ұқсайды. Аңыз бойынша тауды 2 сағатта толық айналып өткен адамның тілегі орындалады.",
        "address": "Маңғыстау ауданы, Шетпе маңы, Шерқала"
      },
      "en": {
        "name": "Sacred Mount Sherkala",
        "summary": "Solitary mountain resembling a giant yurt or sleeping sphinx. ~140 km from Aktau.",
        "description": "An iconic solitary limestone butte ~140 km from Aktau. Resembles a giant traditional yurt from one angle and a resting sphinx from another. Legend says circling its base makes a wish come true.",
        "address": "Mangystau Region, near Shetpe"
      }
    }
  },
  {
    "id": 104,
    "category": "religion",
    "lat": 44.4333,
    "lng": 51.1333,
    "has_scene": true,
    "access": "transit",
    "image": "https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?auto=format&fit=crop&w=1200&q=85",
    "texts": {
      "ru": {
        "name": "Подземная мечеть Шакпак-ата (IX–X вв)",
        "summary": "Вырубленная в белой меловой скале святыня с настенными рисунками. TarihSky.",
        "description": "Уникальный памятник суфийского зодчества на полуострове Тюбкараган. Мечеть вырублена целиком в монолитной меловой толще в IX–X веках. Внутри — крестообразные залы с колоннами и древняя наскальная эпиграфика.",
        "address": "Тюбкараганский район, урочище Шакпаката"
      },
      "kk": {
        "name": "Шақпақ-ата жерасты мешіті (IX–X ғғ)",
        "summary": "Ақ бор жартасқа ойып жасалған бірегей суфийлік жерасты ғибадатханасы. Түпқараған.",
        "description": "Түпқараған түбегіндегі бор жартасқа ойып жасалған IX–X ғасырлардың крест тәріздес ғибадатханасы. Қабырғаларында көне суреттер мен жазулар сақталған. TarihSky арқылы бұрынғы бейнесін көріңіз.",
        "address": "Түпқараған ауданы, Шақпақ-ата"
      },
      "en": {
        "name": "Shakpak-Ata Underground Mosque (9th–10th c.)",
        "summary": "Ancient sanctuary carved entirely inside a chalk cliff with petroglyphs. TarihSky.",
        "description": "An extraordinary 10th-century Sufi underground temple carved into a sheer chalk massif on the Tupkaragan peninsula. Features a cruciform hall, columns, and ancient wall inscriptions.",
        "address": "Tupkaragan District, Shakpak-Ata"
      }
    }
  },
  {
    "id": 105,
    "category": "nature",
    "lat": 44.5833,
    "lng": 50.5833,
    "has_scene": false,
    "access": "transit",
    "image": "https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?auto=format&fit=crop&w=1200&q=85",
    "texts": {
      "ru": {
        "name": "Оазис Тамшалы и каньон Саура",
        "summary": "Живой водопад в пустыне и реликтовые черепахи в горном озере. ~150 км.",
        "description": "Чудо природы полуострова Тюбкараган. Каменный амфитеатр Тамшалы с сочащимися сквозь пласты скал каплями воды, ручьем и зарослями дикой мяты. В соседнем каньоне Саура прячется реликтовое озеро с водяными черепахами.",
        "address": "Тюбкараганский район, оазис Тамшалы"
      },
      "kk": {
        "name": "Тамшалы сарқырамасы мен Саура каньоны",
        "summary": "Шөлдегі нағыз сарқырама мен тұщы көлдегі жәдігер тасбақалар. ~150 км.",
        "description": "Құрғақ шөлейт арасындағы табиғат таңғажайыбы. Тамшалыда жартастан тамып тұрған суық тұщы су мен жалбызды оазис бар. Көрші Саура каньонында сирек кездесетін батпақ тасбақалары мекендейді.",
        "address": "Түпқараған ауданы, Тамшалы сайы"
      },
      "en": {
        "name": "Tamshaly Oasis & Saura Canyon",
        "summary": "A freshwater waterfall dripping through desert cliffs and a turtle lake. ~150 km.",
        "description": "A magical natural oasis on the Tupkaragan peninsula. Tamshaly features fresh water dripping through mossy stone amphitheater tiers into lush green pools, while Saura Canyon shelters rare freshwater turtles.",
        "address": "Tupkaragan District, Tamshaly Oasis"
      }
    }
  },
  {
    "id": 106,
    "category": "nature",
    "lat": 43.45,
    "lng": 53.8167,
    "has_scene": false,
    "access": "transit",
    "image": "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1200&q=85",
    "texts": {
      "ru": {
        "name": "Урочище Кызылкуп («Тирамису») и гора Бокты",
        "summary": "Слоистые холмы цвета десерта Тирамису и гора с купюры 1000 ₸. Джип-тур.",
        "description": "Природная иллюзия в ~240 км от Актау. Полосатые красно-розово-белые холмы словно слоеный пирог или десерт Тирамису. Рядом возвышается пирамидальная гора Бокты, изображенная на купюре 1000 тенге.",
        "address": "Мангистауская область, урочище Кызылкуп"
      },
      "kk": {
        "name": "Қызылқұп («Тирамису» қырқалары) және Боқты тауы",
        "summary": "Қызыл-ақ қабатты тәтті тортқа ұқсайтын табиғат кереметі. Закатта ең әдемі.",
        "description": "Ақтаудан ~240 км. Қызылқұптың қызыл, сары, ақ жолақты топырағы италиялық «Тирамису» тортына қатты ұқсайды. Жанында 1000 теңгелік банкнотта бейнеленген Боқты тауы бар.",
        "address": "Маңғыстау облысы, Қызылқұп алқабы"
      },
      "en": {
        "name": "Kyzylkup ('Tiramisu Hills') & Mount Bokty",
        "summary": "Multi-colored striped hills resembling tiramisu cake and Mount Bokty. Jeep tour.",
        "description": "Spectacular natural layers of red, pink, and white chalk strata evoking a giant tiramisu dessert. Nearby stands the trapezoid Mount Bokty, immortalized on Kazakhstan's 1000 tenge banknote.",
        "address": "Mangystau Region, Kyzylkup Tract"
      }
    }
  },
  {
    "id": 107,
    "category": "nature",
    "lat": 43.4,
    "lng": 51.8,
    "has_scene": false,
    "access": "transit",
    "image": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=85",
    "texts": {
      "ru": {
        "name": "Впадина Карагие (-132 метра)",
        "summary": "Одна из глубочайших впадин планеты — на 132 м ниже уровня моря. ~50 км от Актау.",
        "description": "Грандиозная тектоническая впадина, 5-я по глубине в мире (-132 м). Длина около 85 км. На дне впадины расположено пересыхающее соленое озеро Батыр и космические инопланетные пейзажи.",
        "address": "Каракиянский район, впадина Карагие"
      },
      "kk": {
        "name": "Қарақия ойысы (-132 метр)",
        "summary": "Дүние жүзіндегі ең терең ойыстардың бірі — мұхит деңгейінен -132 м төмен. ~50 км.",
        "description": "Ақтауға жақын орналасқан табиғи феномен. Әлемдегі тереңдігі бойынша 5-орындағы ойыс. Төмен түскенде ауа қысымының өзгерісі мен ай пейзажы бірден сезіледі.",
        "address": "Қарақия ауданы, Қарақия ойысы"
      },
      "en": {
        "name": "Karagiye Depression (-132 meters)",
        "summary": "One of Earth's deepest depressions, plunging 132m below sea level. ~50 km.",
        "description": "The 5th deepest continental depression on the planet, dropping 132 meters below sea level. An immense tectonic canyon spanning 85 km with lunar salt-flat scenery.",
        "address": "Karakiya District, Karagiye Depression"
      }
    }
  },
  {
    "id": 108,
    "category": "history",
    "lat": 44.5106,
    "lng": 50.2633,
    "has_scene": true,
    "access": "transit",
    "image": "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=85",
    "texts": {
      "ru": {
        "name": "Город-крепость Форт-Шевченко",
        "summary": "Старейший город Мангистау на Каспии, музей Шевченко и крепость 1846 г. ~120 км.",
        "description": "Основан в 1846 году как Новопетровское укрепление. Здесь отбывал 7-летнюю солдатскую ссылку поэт Тарас Шевченко. Действует его мемориальный музейный комплекс, сад и старинная крепостная стена.",
        "address": "г. Форт-Шевченко, Тюбкараганский район"
      },
      "kk": {
        "name": "Форт-Шевченко қаласы мен музейі",
        "summary": "Каспийдегі ең көне қала — Тарас Шевченко сүргінде болған жер. ~120 км.",
        "description": "1846 жылы Новопетровск бекінісі ретінде салынған қала. Мұнда украин ақыны Тарас Шевченко 7 жыл айдауда болған. Оның мемориалдық музейі, көне бақ және форт қалдықтары сақталған.",
        "address": "Форт-Шевченко қаласы, Маңғыстау"
      },
      "en": {
        "name": "Fort-Shevchenko Historic Town & Museum",
        "summary": "Oldest town in Mangystau on the Caspian, Shevchenko exile museum. ~120 km.",
        "description": "Established in 1846 as Novopetrovsk fortress. Famous as the place of 7-year military exile of Ukrainian poet Taras Shevchenko. Preserves a memorial museum, orchard, and fortress ramparts.",
        "address": "Fort-Shevchenko, Tupkaragan District"
      }
    }
  },
  {
    "id": 109,
    "category": "religion",
    "lat": 43.596,
    "lng": 53.674,
    "has_scene": false,
    "access": "transit",
    "image": "https://images.unsplash.com/photo-1519817650390-64a93db51149?auto=format&fit=crop&w=1200&q=85",
    "texts": {
      "ru": {
        "name": "Степной некрополь Бекет-Ата (Огланды) и Шопан-Ата",
        "summary": "Главная сакральная святыня Западного Казахстана в глубине плато. ~280 км.",
        "description": "Священное место паломничества. Вырубленный в скальном амфитеатре суфийский храм святого Бекет-ата (XVIII в.). Дорога ведет через древний некрополь Шопан-ата и марсианские просторы степи.",
        "address": "Каракиянский район, урочище Огланды"
      },
      "kk": {
        "name": "Бекет-Ата (Оғыланды) және Шопан-Ата",
        "summary": "Батыс Қазақстанның бас рухани сакралды орны. Далалық жерасты некрополі.",
        "description": "Маңғыстаудың ең киелі жері. XVIII ғасырда әулие Бекет-ата бор шатқалына қашап жасаған жерасты мешіті. Мыңдаған паломниктер келіп тағзым етеді. Ақтаудан ~280 км.",
        "address": "Қарақия ауданы, Оғыланды шатқалы"
      },
      "en": {
        "name": "Beket-Ata Steppe Sanctuary (Oglandy) & Shopan-Ata",
        "summary": "The supreme spiritual sanctuary of Western Kazakhstan hidden in desert cliffs.",
        "description": "The holy pilgrimage heart of Mangystau. An 18th-century underground sanctuary carved into a remote amphitheater canyon by Sufi saint Beket-Ata, visited along with the ancient Shopan-Ata necropolis.",
        "address": "Karakiya District, Oglandy Canyon"
      }
    }
  },
  {
    "id": 201,
    "category": "food",
    "lat": 43.6425,
    "lng": 51.158,
    "has_scene": false,
    "access": "walk",
    "image": "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=85",
    "texts": {
      "ru": {
        "name": "Этно-ресторан «Ethno» (Пещера Ungir)",
        "summary": "Аутентичная казахская кухня в интерьере пещеры Ungir. Бешбармак, чек ~5 000 ₸.",
        "description": "Один из самых колоритных ресторанов Актау. Залы стилизованы под священную пещеру Ungir. Традиционный бешбармак из конины и баранины, куырдак, сырне, пышные баурсаки, шубат и кумыс. Рейтинг 5.0.",
        "address": "Актау, 5А микрорайон, дом 8"
      },
      "kk": {
        "name": "«Ethno» мейрамханасы (Үңгір / Ungir)",
        "summary": "Үңгір ішіндегі ұлттық қазақ асханасы: ет, бауырсақ, қымыз, шұбат. Чек ~5 000 ₸.",
        "description": "5А шағынаудандағы нағыз үңгір секілді жасалған ерекше этно-мейрамхана. Қазақтың дәстүрлі бесбармағы, сірне, қуырдақ және жаңа піскен бауырсақтарымен танымал. Рейтингі 5.0.",
        "address": "Ақтау, 5А шағынаудан, 8-үй"
      },
      "en": {
        "name": "Ethno Restaurant (Ungir Cave)",
        "summary": "Authentic Kazakh national cuisine in an Ungir cave ambiance. Avg check ~5000 KZT.",
        "description": "Top authentic dining venue in Aktau styled like the sacred Ungir cave. Serves traditional horsemeat and lamb beshbarmak, kuyrdak, hot baursaks, shubat and kumis. Rated 5.0 on 2GIS.",
        "address": "Aktau, 5A microdistrict, building 8"
      }
    }
  },
  {
    "id": 202,
    "category": "food",
    "lat": 43.649,
    "lng": 51.164,
    "has_scene": false,
    "access": "walk",
    "image": "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=1200&q=85",
    "texts": {
      "ru": {
        "name": "Шашлычная «У дяди Гадима»",
        "summary": "Легендарный сочный шашлык Актау. Рейтинг 4.8 / 3745 отзывов в 2ГИС. Чек ~3 500 ₸.",
        "description": "Культовое гастрономическое место города. Свежайший сочный шашлык на углях из баранины, люля-кебаб, антрекот, домашние соусы и горячий лаваш. Высочайший народный рейтинг.",
        "address": "Актау, 8-й микрорайон, 39Б, тел: +7 776 730 3939"
      },
      "kk": {
        "name": "«Ғадім көкеден кәуап» (Дядя Гадим)",
        "summary": "Ақтаудағы аңызға айналған ең дәмді кәуап (шашлык). Чек 3 000–5 600 ₸. 2ГИС 4.8/3745.",
        "description": "Ақтаудың ең танымал шашлык орны. Қой, сиыр, тауық және кәуап түрлері. 2ГИС-те 3700-ден астам оң пікір жинаған халықтық орын.",
        "address": "Ақтау, 8-шағынаудан, 39Б ғимараты"
      },
      "en": {
        "name": "Uncle Gadim's Barbecue (Shashlyk)",
        "summary": "Aktau's legendary charcoal barbecue. Rated 4.8 with 3700+ reviews. Check ~3500 KZT.",
        "description": "The city's most famous shashlyk institution. Masterfully grilled lamb, beef, lula kebabs, homemade spiced sauces, and fresh flatbreads. Exceptional customer rating on 2GIS.",
        "address": "Aktau, 8th microdistrict, 39B"
      }
    }
  },
  {
    "id": 203,
    "category": "food",
    "lat": 43.646,
    "lng": 51.156,
    "has_scene": false,
    "access": "walk",
    "image": "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=85",
    "texts": {
      "ru": {
        "name": "Мята Lounge Aktau",
        "summary": "Панорамный лаунж-ресторан с видом на Каспий: стейки, рамен, пицца. Чек ~5 000 ₸.",
        "description": "Популярный видовой ресторан на побережье 5-го микрорайона. Панорамные окна на закат, европейская и азиатская кухня, сочные стейки, пицца и авторская карта напитков. 2ГИС: 4.8/1085.",
        "address": "Актау, 5-й микрорайон, 20/20"
      },
      "kk": {
        "name": "Мята Lounge Aktau",
        "summary": "Теңіз панорамасы бар заманауи лаунж-мейрамхана: пицца, стейк, рамен. Чек ~5 000 ₸.",
        "description": "5-шағынаудандағы теңізге қарайтын кең панорамалық лаунж. Стейктер, азиялық рамен, авторлық коктейльдер және демалыс атмосферасы. Рейтингі 4.8/1085.",
        "address": "Ақтау, 5-шағынаудан, 20/20"
      },
      "en": {
        "name": "Myata Lounge Aktau",
        "summary": "Panoramic Caspian sunset lounge: steaks, pizza, ramen. Check ~5000 KZT. Rated 4.8.",
        "description": "Trendy sea-view restaurant in the 5th microdistrict. Wide glass facades overlooking the Caspian sunset, featuring tender steaks, Japanese ramen, artisan pizzas and cocktails.",
        "address": "Aktau, 5th microdistrict, 20/20"
      }
    }
  },
  {
    "id": 204,
    "category": "food",
    "lat": 43.641,
    "lng": 51.169,
    "has_scene": false,
    "access": "walk",
    "image": "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=1200&q=85",
    "texts": {
      "ru": {
        "name": "Рыбный ресторан «MegaFish»",
        "summary": "Свежая рыба Каспия, осетрина на углях, судак и морепродукты. Чек ~7 000 ₸. 4.9/5.",
        "description": "Главный рыбный ресторан Актау. Фирменная каспийская осетрина на гриле, свежий судак, кефаль, уха по-каспийски и японское меню. Высочайшая оценка 4.9 в 2ГИС.",
        "address": "Актау, 12А микрорайон, 6"
      },
      "kk": {
        "name": "MegaFish балық мейрамханасы",
        "summary": "Каспийдің жаңа ауланған балығы, бекіре, кефал және теңіз өнімдері. 2ГИС 4.9/363.",
        "description": "Ақтаудағы таңдаулы балық мейрамханасы. Шоққа піскен Каспий бекіресі, көксерке, кефал және жапондық суши. Орташа чек ~7 000 ₸.",
        "address": "Ақтау, 12А шағынаудан, 6"
      },
      "en": {
        "name": "MegaFish Seafood Restaurant",
        "summary": "Fresh Caspian sturgeon, pike-perch and seafood grilled on coals. Rated 4.9 on 2GIS.",
        "description": "Aktau's premier seafood destination. Savor authentic Caspian sturgeon grilled over charcoal, fresh local mullet, Caspian fish soup and gourmet sushi. Average check ~7000 KZT.",
        "address": "Aktau, 12A microdistrict, 6"
      }
    }
  },
  {
    "id": 205,
    "category": "food",
    "lat": 43.636,
    "lng": 51.171,
    "has_scene": false,
    "access": "walk",
    "image": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=85",
    "texts": {
      "ru": {
        "name": "Ресторан «Алые Паруса» на набережной",
        "summary": "Терраса прямо у кромки Каспия, незабываемые закаты, европейская кухня.",
        "description": "Панорамный прибрежный ресторан на набережной 1-го микрорайона. Шум прибоя, живая музыка, свежие морепродукты и великолепный вид на заходящее в море солнце.",
        "address": "Актау, набережная 1-го микрорайона"
      },
      "kk": {
        "name": "«Алые Паруса» жағалау мейрамханасы",
        "summary": "Дәл теңіз жағасындағы ашық терраса, керемет закаттар мен еуропалық асхана.",
        "description": "Теңіз толқынының жанында орналасқан жайлы мейрамхана. Кешкі күннің батуын тамашалауға ең қолайлы нүкте. Орташа чек 5 000–8 000 ₸.",
        "address": "Ақтау, 1-шағынаудан, теңіз жағалауы"
      },
      "en": {
        "name": "Alyye Parusa Waterfront Restaurant",
        "summary": "Open-air terrace right on the Caspian shore with spectacular sunsets.",
        "description": "Iconic seaside terrace restaurant in the 1st microdistrict. Dine with the sound of Caspian waves, sunset vistas, fresh seafood and Mediterranean dishes.",
        "address": "Aktau, 1st microdistrict waterfront"
      }
    }
  },
  {
    "id": 301,
    "category": "hotel",
    "lat": 43.485,
    "lng": 51.352,
    "has_scene": false,
    "access": "transit",
    "image": "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=85",
    "texts": {
      "ru": {
        "name": "Курорт Rixos Water World Aktau 5*",
        "summary": "Люкс-курорт All-Inclusive на берегу Каспия: огромный аквапарк и пляж. От $256/ночь.",
        "description": "Премиальный пятизвездочный курортный отель на Тёплом пляже в 20 км от города. Система «Всё включено», гигантский аквапарк Water World, бассейны с подогреваемой морской водой, песчаный берег и SPA.",
        "address": "Актау, Тёплый пляж (Warm Beach), 34"
      },
      "kk": {
        "name": "Rixos Water World Aktau 5*",
        "summary": "Каспийдегі All-Inclusive люкс-курорты, үлкен аквапарк және жеке жағажай. 24/7.",
        "description": "Қазақстандағы ең үздік теңіз шипажайы. «Жылы жағажай» аймағында орналасқан. Аквапарк, теңіз суы толтырылған бассейндер, SPA-орталық және жеке құмды жағажай. Тәулік бойы.",
        "address": "Ақтау, Жылы жағажай (Warm Beach), 34"
      },
      "en": {
        "name": "Rixos Water World Aktau 5*",
        "summary": "Luxury All-Inclusive Caspian resort with giant theme waterpark. From $256/night.",
        "description": "Kazakhstan's premier coastal resort situated on Warm Beach ~20 km south of Aktau. Features All-Inclusive service, massive water park, infinity seawater pools, sandy beach and luxury SPA.",
        "address": "Aktau, Warm Beach 34"
      }
    }
  },
  {
    "id": 302,
    "category": "hotel",
    "lat": 43.633,
    "lng": 51.168,
    "has_scene": false,
    "access": "walk",
    "image": "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=85",
    "texts": {
      "ru": {
        "name": "Отель Caspian Riviera Grand Palace 5*",
        "summary": "Отель 5* на скалах с подземным осетровым аквариумом и SPA. От ~47 000 ₸ ($91).",
        "description": "Фешенебельный отель на скалистом берегу Каспия. Знаменит уникальным подземным аквариумом с живыми осетрами и белугами, панорамным рестораном, бассейном и близостью к Скальной тропе. Рейтинг 8.8.",
        "address": "Актау, 4-й микрорайон, набережная"
      },
      "kk": {
        "name": "Caspian Riviera Grand Palace 5*",
        "summary": "Жартас үстіндегі 5 жұлдызды қонақүй, жерасты бекіре аквариумы және SPA. 24/7.",
        "description": "Каспий жағасындағы жартасқа салынған люкс қонақүй. Бірегей жерасты бекіре аквариумы, панорамды террасасы және жоғары деңгейлі сервисімен танымал. Бағасы ~47 000 ₸-ден басталады.",
        "address": "Ақтау, 4-шағынаудан, жағалау"
      },
      "en": {
        "name": "Caspian Riviera Grand Palace 5*",
        "summary": "Clifftop 5-star hotel featuring an underground sturgeon aquarium & SPA. From $91.",
        "description": "Exclusive clifftop hotel overlooking the Caspian Sea. Renowned for its subterranean living sturgeon aquarium, sea-view balconies, indoor pools, luxury spa, and walking access to Rock Trail. Rated 8.8.",
        "address": "Aktau, 4th microdistrict coastal strip"
      }
    }
  },
  {
    "id": 303,
    "category": "hotel",
    "lat": 43.655,
    "lng": 51.152,
    "has_scene": false,
    "access": "walk",
    "image": "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=85",
    "texts": {
      "ru": {
        "name": "Отель Grand Hotel Victory 5*",
        "summary": "Ближайший 5* отель к стеле BaGdar: премиум-сервис, SPA и фитнес. От 34 000 ₸.",
        "description": "Пятизвездочный бизнес-отель в 13-м микрорайоне. Ближайшая люксовая гостиница к стеле BaGdar у амфитеатра. Включает просторный SPA-комплекс, крытый бассейн, ресторан панорамного вида и конференц-залы.",
        "address": "Актау, 13-й микрорайон, дом 25А"
      },
      "kk": {
        "name": "Grand Hotel Victory 5*",
        "summary": "Стелаға ең жақын 5* бизнес-қонақүй: люкс нөмірлер, бассейн және SPA. 24/7.",
        "description": "13-шағынаудандағы бес жұлдызды премиум қонақүй. BaGdar стеласы мен набережнаяға жақын. Бизнес-орталық, фитнес, SPA-кешені. 34 000–150 000 ₸.",
        "address": "Ақтау, 13-шағынаудан, 25А, тел: +7 7292 70-00-00"
      },
      "en": {
        "name": "Grand Hotel Victory 5*",
        "summary": "Closest 5-star hotel to the BaGdar kiosk: luxury SPA, indoor pool. From 34,000 KZT.",
        "description": "Upscale 5-star business and leisure hotel situated in the 13th microdistrict, walking distance to the 15th microdistrict promenade and amphitheater. Features luxury SPA, pool and skyline restaurant.",
        "address": "Aktau, 13th microdistrict, 25A"
      }
    }
  },
  {
    "id": 304,
    "category": "hotel",
    "lat": 43.631,
    "lng": 51.175,
    "has_scene": false,
    "access": "walk",
    "image": "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1200&q=85",
    "texts": {
      "ru": {
        "name": "Отель Salem на набережной",
        "summary": "Уютный отель у моря, 500 м до пляжа Манила. Номера от 12 800 ₸, рейтинг 8.6.",
        "description": "Популярный приморский отель в 1-м микрорайоне. 22 чистых комфортных номера, первая береговая линия, вкусные завтраки и всего 5 минут ходьбы до городских пляжей Манила и Марракеш.",
        "address": "Актау, 1-й микрорайон, набережная"
      },
      "kk": {
        "name": "Salem Hotel на набережной",
        "summary": "Теңіз жағасындағы жайлы отель, Манила жағажайына 500 м. Бағасы 12 800 ₸ бастап.",
        "description": "1-шағынаудандағы теңіз көрінісі бар жайлы қонақүй. Пляжға, дәмханаларға жақын. Таңғы ас, таза әрі ыңғайлы нөмірлер. 2ГИС рейтингі 8.6.",
        "address": "Ақтау, 1-шағынаудан, жағалау"
      },
      "en": {
        "name": "Salem Hotel Seaside",
        "summary": "Cozy seaside hotel, 500m to Manila Beach. Rooms from 12,800 KZT. Rated 8.6.",
        "description": "Comfortable boutique hotel along the 1st microdistrict waterfront. Features 22 sea-facing rooms, breakfast buffet, and rapid walking access to beaches and cafes.",
        "address": "Aktau, 1st microdistrict waterfront"
      }
    }
  },
  {
    "id": 401,
    "category": "tour",
    "lat": 43.6582,
    "lng": 51.1352,
    "has_scene": false,
    "access": "transit",
    "image": "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1200&q=85",
    "texts": {
      "ru": {
        "name": "Джип-сафари «Гран-тур по Мангистау» (1–3 дня)",
        "summary": "Бозжыра, Торыш, Шеркала, Шакпак-ата на внедорожниках 4х4. От 21 500 ₸/чел.",
        "description": "Официальные экспедиции по Мангистау с выездом из Актау. Проверенные операторы: mangystausafari.kz, tour-mangystau.kz. Включено: джипы 4х4, опытные гиды-водители, ночевки под звездным небом Устюрта, питание и пропуска в нацпарки.",
        "address": "Актау, отправление от отелей / стелы BaGdar"
      },
      "kk": {
        "name": "Маңғыстау бойынша джип-сафари (1–3 күндік)",
        "summary": "Бозжыра, Шарлар алқабы, Шерқала, Шақпақ-ата экспедициялары. 21 500 ₸-ден бастап.",
        "description": "Ақтаудан басталатын кәсіби 4х4 джип-турлары. Үстірттің ең ғажайып нүктелеріне гидпен, шатырмен және тамақпен саяхат. mangystausafari.kz, tour-mangystau.kz. Маусым: сәуір–қазан.",
        "address": "Ақтау, қала қонақүйлерінен / стеладан шығу"
      },
      "en": {
        "name": "Mangystau 4x4 Jeep Safari (1–3 Days)",
        "summary": "Expeditions to Bozjyra, Torysh, Sherkala and Shakpak-Ata. From 21,500 KZT/person.",
        "description": "Guided 4x4 overland safaris into Mangystau's remote canyons. Operators: mangystausafari.kz, tour-mangystau.kz. Includes high-clearance offroad vehicles, guides, Ustyurt camping gear, meals, and park permits.",
        "address": "Aktau, departures from hotels / BaGdar kiosk"
      }
    }
  }
]

function safeLang(lang: string): 'ru' | 'kk' | 'en' {
  return lang === 'kk' || lang === 'en' ? lang : 'ru'
}

export function mockSummaries(lang: string): PlaceSummary[] {
  const key = safeLang(lang)
  return mockPlaceSeeds.map((place) => ({
    id: place.id,
    name: place.texts[key].name,
    summary: place.texts[key].summary,
    category: place.category,
    lat: place.lat,
    lng: place.lng,
    thumb_url: place.image,
    has_scene: place.has_scene,
    hours: null,
    access: place.access,
  }))
}

export function mockDetail(id: number, lang: string): PlaceDetail | undefined {
  const seed = mockPlaceSeeds.find((place) => place.id === id)
  if (!seed) return undefined
  const key = safeLang(lang)
  const text = seed.texts[key]
  return {
    id: seed.id,
    name: text.name,
    summary: text.summary,
    description: text.description,
    category: seed.category,
    lat: seed.lat,
    lng: seed.lng,
    thumb_url: seed.image,
    photos: [seed.image],
    address: text.address,
    hours: null,
    is_open_now: true,
    opens_next: null,
    has_scene: seed.has_scene,
    access: seed.access,
    langs: ['kk', 'ru', 'en'],
  }
}

export const mockRoutes: Record<number, RouteResponse> = Object.fromEntries(
  mockPlaceSeeds.map((place) => {
    const dist = Math.round(
      6371000 *
      2 *
      Math.asin(
        Math.sqrt(
          Math.sin(((place.lat - 43.6582) * Math.PI) / 360) ** 2 +
          Math.cos((43.6582 * Math.PI) / 180) *
          Math.cos((place.lat * Math.PI) / 180) *
          Math.sin(((place.lng - 51.1352) * Math.PI) / 360) ** 2
        )
      )
    )
    const dur = Math.max(1, Math.round(dist / (place.access === 'walk' ? 80 : 500)))
    const b = 45.0
    return [
      place.id,
      {
        place_id: place.id,
        mode: place.access,
        distance_m: dist,
        duration_min: dur,
        bearing_deg: b,
        direction_text: place.access === 'walk' ? 'следуйте по набережной' : 'поезжайте на транспорте от стелы',
        is_approximate: place.access === 'transit' || dist > 2000,
        geometry: {
          type: 'LineString',
          coordinates: [
            [51.1352, 43.6582],
            [(51.1352 + place.lng) / 2, (43.6582 + place.lat) / 2],
            [place.lng, place.lat],
          ],
        },
        steps: [
          {
            instruction: place.access === 'walk' ? 'Прямо от стелы BaGdar' : 'Поездка на автомобиле/джипе',
            distance_m: dist,
          },
        ],
      },
    ]
  })
)

export const mockScene: SceneResponse = {
  place_id: 2,
  enabled: true,
  modern_url: '/media/waterfront-now.svg',
  historic_url: '/media/waterfront-then.svg',
  attribution: 'художественная реконструкция',
  texts: {
    ru: { title: 'Берег до города', body: 'До появления современной набережной берег оставался открытым пространством у Каспия. Реконструкция показывает собирательный образ местности и не является документальной фотографией.' },
    kk: { title: 'Қалаға дейінгі жағалау', body: 'Қазіргі жағалау салынғанға дейін Каспий маңы ашық кеңістік болған. Бұл — деректі фото емес, көркем реконструкция.' },
    en: { title: 'The coast before the city', body: 'Before the modern promenade, this was open land by the Caspian Sea. This is an artistic reconstruction, not a documentary photograph.' },
  },
  sources: ['Архивные планы развития Актау', 'Материалы городского музея'],
}
