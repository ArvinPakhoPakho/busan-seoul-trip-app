/*
  Style reminder for data modeling:
  - The app must preserve the full density of the PDF, not just one simplified final route.
  - Every place should exist in the shared place library first, then be surfaced day-by-day according to relevance and flexibility.
  - Fixed reservations and optional branches must be explicit, especially the 16:00 capsule train booking.
*/

export type TripCategory =
  | "sight"
  | "activity"
  | "food"
  | "cafe"
  | "spa"
  | "market"
  | "travel"
  | "stay"
  | "shopping";

export type TripPriority = "must" | "planned" | "option" | "future";
export type TripStopRole = "main" | "option" | "nearby" | "backup";
export type TripPlaceStatus = "active" | "optional" | "dropped" | "future";
export type TripSource = "pdf-final" | "pdf-reference" | "user" | "future-seoul";
export type TripBookingKind = "reservation" | "transport" | "pass" | "stay" | "wellness";

export interface TripPlace {
  id: string;
  title: string;
  category: TripCategory;
  priority: TripPriority;
  status: TripPlaceStatus;
  district: string;
  address?: string;
  naverUrl?: string;
  description: string;
  originalQuote?: string;
  source: TripSource;
  tags: string[];
}

export interface TripStop {
  id: string;
  placeId: string;
  time: string;
  role: TripStopRole;
  note: string;
  groupId?: string;
}

export interface TripBooking {
  id: string;
  time: string;
  title: string;
  kind: TripBookingKind;
  locked: boolean;
  district: string;
  note: string;
  relatedPlaceId?: string;
}

export interface TripOptionGroup {
  id: string;
  title: string;
  description: string;
  accent: "amber" | "sky" | "mint" | "rose";
}

export interface TripDay {
  id: string;
  label: string;
  dateLabel: string;
  area: string;
  theme: string;
  summary: string;
  bookings: TripBooking[];
  optionGroups: TripOptionGroup[];
  stops: TripStop[];
}

export interface TripCity {
  id: string;
  name: string;
  subtitle: string;
  status: "active" | "future";
  heroImage: string;
  accent: string;
  places: TripPlace[];
  days: TripDay[];
}

export interface TripAppData {
  cities: TripCity[];
}

export const TRIP_STORAGE_KEY = "busan-duck-trip-planner-v8";

export const categoryLabels: Record<TripCategory, string> = {
  sight: "景點",
  activity: "體驗",
  food: "餐廳",
  cafe: "甜品 / Cafe",
  spa: "汗蒸幕",
  market: "市場",
  travel: "交通",
  stay: "住宿",
  shopping: "購物",
};

export const priorityLabels: Record<TripPriority, string> = {
  must: "必去 / 必食",
  planned: "主線保留",
  option: "彈性備選",
  future: "之後加入",
};

export const stopRoleLabels: Record<TripStopRole, string> = {
  main: "主線",
  option: "可換選項",
  nearby: "附近可補位",
  backup: "補漏 / 延後",
};

export const placeStatusLabels: Record<TripPlaceStatus, string> = {
  active: "現役",
  optional: "可視情況",
  dropped: "已放棄主線",
  future: "未來城市",
};

export const bookingKindLabels: Record<TripBookingKind, string> = {
  reservation: "固定預約",
  transport: "車次 / 移動",
  pass: "Pass 錨點",
  stay: "住宿節點",
  wellness: "晚間收尾",
};

const BUSAN_HERO_URL =
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663572166655/hf99YrcowfraBrE3xoZGHJ/busan-duck-hero-day-JpcDqY3fcnkZVky8Kk3vj5.webp";
const SEOUL_HERO_URL =
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663572166655/hf99YrcowfraBrE3xoZGHJ/seoul-duck-future-panel-R4pcykFFC78MKhbV7yQHTU.webp";

const busanPlaces: TripPlace[] = [
  {
    id: "eggdrop-nampo",
    title: "Egg Drop 南浦店",
    category: "food",
    priority: "planned",
    status: "active",
    district: "南浦",
    address: "Egg Drop Nampo, Busan",
    description: "進市區後先吃早餐開展美好的一天，亦讓第一段移動後的節奏更穩定舒適。",
    source: "pdf-final",
    tags: ["早餐", "Day 1", "南浦"],
  },
  {
    id: "bupyeong-market",
    title: "富平罐頭市場",
    category: "market",
    priority: "planned",
    status: "active",
    district: "富平",
    address: "Bupyeong Kkangtong Market, Busan",
    description: "富平市場集合街頭小食、在地生活感與補買選擇，適合在旅程初段感受釜山舊城區氣氛，亦方便最後一天收尾補買。",
    source: "pdf-final",
    tags: ["市場", "暖機", "補買"],
  },
  {
    id: "milgot",
    title: "Milgot",
    category: "cafe",
    priority: "must",
    status: "active",
    district: "富平",
    address: "釜山廣域市 中區 富平洞二街 72-2",
    description: "富平附近最值得保留的糕點店，適合 Day 1 或 Day 4 早段補入。",
    originalQuote:
      "推薦呢間糕點！我叫咗經典紅豆嗰款，個餡唔太甜，個皮又幾有咬口。最好早啲去，上次去6pm已經賣晒",
    source: "pdf-final",
    tags: ["糕點", "早去", "富平"],
  },
  {
    id: "busan-stay-chungmu",
    title: "釜山住宿（Busan Seo-gu Chungmu-daero 120）",
    category: "stay",
    priority: "planned",
    status: "active",
    district: "西區 / 松島連接帶",
    address: "Busan Seo-gu Chungmu-daero 120",
    naverUrl: "https://naver.me/GWW5LqJQ",
    description: "釜山段住宿節點，Day 1 check-in 與 Day 4 離開市區前的動線都以此為核心。",
    source: "user",
    tags: ["釜山住宿", "固定", "松島附近"],
  },
  {
    id: "luggage-storage-101",
    title: "101 大廈行李寄存（3F 304 室）",
    category: "travel",
    priority: "planned",
    status: "active",
    district: "南浦 / 富平銜接帶",
    address: "101 大廈 3樓 304 室（營業 08:30–22:00）",
    description: "使用者已更正 Day 1 行李寄存點，不再使用樂天百貨寄存方案。",
    source: "user",
    tags: ["寄存行李", "Day 1", "已更正"],
  },
  {
    id: "myeongseong-one-dak",
    title: "Myeongseong 一隻雞",
    category: "food",
    priority: "must",
    status: "active",
    district: "影島",
    address: "釜山廣域市 影島區 絶影路 22 1樓",
    naverUrl: "https://naver.me/xjYXGEuO",
    description: "已確認為 Day 1 固定午餐，需取代原先所有南浦午餐彈性方案。",
    source: "user",
    tags: ["固定午餐", "Day 1", "一隻雞"],
  },
  {
    id: "jeongseong-sikdang",
    title: "精誠食堂",
    category: "food",
    priority: "planned",
    status: "active",
    district: "南浦",
    address: "Nampo-dong, Busan",
    description: "Day 1 南浦午餐的穩定選項之一，適合看心情即場決定。",
    source: "pdf-reference",
    tags: ["午餐", "彈性", "南浦"],
  },
  {
    id: "solsot-nampo",
    title: "SOLSOT",
    category: "food",
    priority: "planned",
    status: "active",
    district: "南浦",
    address: "SOLSOT Nampo, Busan",
    description: "與精誠食堂並列的 Day 1 午餐選項，保留給當刻心情選擇。",
    source: "pdf-reference",
    tags: ["午餐", "彈性", "南浦"],
  },
  {
    id: "taejongdae-zipline",
    title: "太宗台高空滑索",
    category: "activity",
    priority: "option",
    status: "optional",
    district: "太宗台",
    address: "Taejongdae Zipline, Busan",
    description: "Day 1 影島下午候選，天氣好、營業正常、排隊不長才做，否則略過不影響遊艇主線。",
    source: "pdf-reference",
    tags: ["太宗台", "影島", "天氣依賴", "候選"],
  },
  {
    id: "burger-yo",
    title: "Burger Yo 釜山總店",
    category: "food",
    priority: "must",
    status: "active",
    district: "影島",
    address: "釜山廣域市 影島區 瀛仙洞四街 1055",
    naverUrl: "https://naver.me/5o0Xx3Cp",
    description: "影島人氣漢堡店，以海鮮口味漢堡作為旅程中具記憶點的一餐。",
    originalQuote: "好好食嘅扇貝/蟹burger！！",
    source: "user",
    tags: ["必食", "影島", "Burger"],
  },
  {
    id: "bielleu",
    title: "Bielleu",
    category: "cafe",
    priority: "option",
    status: "optional",
    district: "影島",
    address: "釜山廣域市 影島區 瀛仙洞四街 663",
    description: "影島海景 cafe，可作 Day 1 或 Burger Yo 周邊的食景補位。",
    originalQuote: "平日 11點半包場！上2樓對正個海＋大太陽靚到癲主要食景，坐咗 2 粒鐘先走",
    source: "pdf-reference",
    tags: ["影島", "海景", "Cafe"],
  },
  {
    id: "songdo-cable-car",
    title: "松島海上纜車",
    category: "activity",
    priority: "must",
    status: "active",
    district: "松島",
    address: "Busan Air Cruise, Busan",
    description: "乘坐松島海上纜車，可盡覽陽光下閃爍的蔚藍大海、奇岩怪石與翠綠景致，是 Day 2 早上的第一個 Pass 景點。",
    source: "pdf-final",
    tags: ["Pass", "海景", "松島"],
  },
  {
    id: "songdo-yonggung",
    title: "松島龍宮雲橋",
    category: "sight",
    priority: "planned",
    status: "active",
    district: "松島",
    address: "Songdo Yonggung Suspension Bridge, Busan",
    description: "因住宿在附近，屬於 Day 2 纜車後很順手的小願望景點。",
    source: "pdf-final",
    tags: ["松島", "順路", "海邊"],
  },
  {
    id: "diamond-bay-yacht",
    title: "鑽石灣遊艇",
    category: "activity",
    priority: "must",
    status: "active",
    district: "南區 / 港灣",
    address: "Diamond Bay, Busan",
    description: "Day 1 偏夕陽感的固定主軸，若天氣取消可直接放棄，不必硬補。",
    source: "pdf-final",
    tags: ["遊艇", "情侶", "儀式感"],
  },
  {
    id: "busandaek",
    title: "Busandaek 廣安里直营店",
    category: "food",
    priority: "must",
    status: "active",
    district: "廣安里",
    address: "釜山廣域市 水營區 廣安洞 199-6",
    description: "遊艇後若仍有精神，這是高權重的晚餐選項。",
    originalQuote: "心目中第一名屌打濟州島黑毛豬 兩人價錢HKD 280",
    source: "pdf-final",
    tags: ["廣安里", "晚餐", "高權重"],
  },
  {
    id: "cheongsan-1954",
    title: "青山1954 廣安里总店",
    category: "food",
    priority: "must",
    status: "active",
    district: "廣安里",
    address: "釜山廣域市 水營區 南川洞 45-9",
    description: "與 Busandaek 同屬 Day 1 晚餐高權重備選。",
    originalQuote:
      "章魚超嫩超好吃，是用12種韓藥材＋炭火煮的還有蒸的白切肉，預定還有送一籠四顆小餃子，吃完後面超多人",
    source: "pdf-final",
    tags: ["廣安里", "晚餐", "高權重"],
  },
  // ── 新增：Day 1 其他可考慮行程 ──
  {
    id: "chopilssal-gwangan",
    title: "Chopilssal 豬燒烤廣安直营店",
    category: "food",
    priority: "option",
    status: "active",
    district: "廣安里",
    address: "釜山廣域市 水營區 民樂洞 181-20",
    naverUrl: "https://naver.me/GcAn3SD8",
    description: "廣安里當地人推薦豬燒烤，五花肉與豬皮外脆內軟，可作 Day 1 晚餐其他可考慮選項。",
    originalQuote:
      "釜山當地人推薦，主要食烤五花肉、豬皮外脆內軟、又有油香，第二次星期一傍晚去到要等50枱都等咗兩個半鐘",
    source: "user",
    tags: ["廣安里", "晚餐", "其他可考慮", "Day 1"],
  },
  {
    id: "tonsyou-gwangan",
    title: "Tonsyou Gwangan店",
    category: "food",
    priority: "option",
    status: "active",
    district: "廣安里",
    address: "釜山廣域市 水營區 民樂洞 181-20",
    naverUrl: "https://naver.me/GcAn3SD8",
    description: "廣安里豬燒烤選項，可作 Day 1 晚餐其他可考慮選項。",
    source: "user",
    tags: ["廣安里", "晚餐", "其他可考慮", "Day 1"],
  },
  {
    id: "mudflat-shellfish-gwangan",
    title: "泥灘貝殼廣安里店",
    category: "food",
    priority: "option",
    status: "active",
    district: "廣安里",
    address: "釜山廣域市 水營區 民樂洞 176-18",
    naverUrl: "https://naver.me/GQGNDb76",
    description: "廣安里貝殼海鮮餐廳，可作 Day 1 晚餐其他可考慮選項。",
    source: "user",
    tags: ["廣安里", "晚餐", "貝殼", "其他可考慮", "Day 1"],
  },
  {
    id: "arte-museum-gwangan",
    title: "Arte Museum 廣安",
    category: "sight",
    priority: "must",
    status: "active",
    district: "廣安里",
    address: "Arte Museum Busan",
    naverUrl: "https://naver.me/FIfsvnna",
    description: "沉浸式媒體藝術展館，可作 Day 1 廣安里一帶其他可考慮行程。",
    source: "user",
    tags: ["沉浸式", "拍照", "廣安里", "其他可考慮", "Day 1"],
  },
  {
    id: "skyline-luge",
    title: "Skyline Luge Busan",
    category: "activity",
    priority: "must",
    status: "active",
    district: "東釜山",
    address: "Skyline Luge Busan",
    description: "Day 2 核心體驗之一，應放早段處理。",
    source: "pdf-final",
    tags: ["必去", "Pass", "刺激"],
  },
  {
    id: "gungnam-jajangmyeon",
    title: "龍宮炸醬麵",
    category: "food",
    priority: "must",
    status: "active",
    district: "機張",
    address: "393-6 Sirang-ri, Gijang-eup, Gijang, Busan",
    description: "Day 2 已決定的午餐，Skyline Luge 後前往，控制在 1–1.5 小時內。",
    source: "user",
    tags: ["午餐", "Day 2", "機張", "炸醬麵"],
  },
  {
    id: "lotte-world-busan",
    title: "釜山樂天世界",
    category: "activity",
    priority: "must",
    status: "active",
    district: "東釜山",
    address: "Lotte World Adventure Busan",
    description: "Day 2 下午主景點，需保留完整玩樂時間。",
    source: "pdf-final",
    tags: ["樂園", "Pass", "雙核心"],
  },
  {
    id: "dongbusan-outlet",
    title: "東釜山 Outlet",
    category: "shopping",
    priority: "option",
    status: "optional",
    district: "東釜山",
    address: "Lotte Premium Outlets DongBusan",
    description: "只在 Day 2 尚有精神時快速補位，不應主導行程。",
    source: "pdf-final",
    tags: ["Outlet", "購物", "可選"],
  },
  {
    id: "rapseu",
    title: "Rapseu",
    category: "food",
    priority: "must",
    status: "active",
    district: "松亭",
    address: "釜山廣域市 海雲台區 松亭洞 821",
    description: "Day 2 最推薦的一間晚餐，留一晚專門吃它是合理的。",
    originalQuote:
      "一定要留一晚去食呢間，本身我麻麻地豬肉，但呢間啲豬肉入口即溶，好似牛咁，勁好食！仲有海景，室內亦好靚",
    source: "pdf-final",
    tags: ["海景", "豬肉", "高權重"],
  },
  {
    id: "kkotgedang",
    title: "辛舍 Kkotgedang 海雲台站",
    category: "food",
    priority: "must",
    status: "active",
    district: "海雲台",
    address: "釜山廣域市 海雲台區 佑洞 627-1",
    description: "海雲台區高權重海鮮餐廳，可作 Day 2 或 Day 3 的晚餐替代。",
    originalQuote:
      "海雲台附近的醬油蟹，鮮甜唔會死鹹，醬油蝦直頭係爽嘅，好好食！ catch table 可以book",
    source: "pdf-reference",
    tags: ["醬油蟹", "海雲台", "可預約"],
  },
  {
    id: "geumsu-bokguk",
    title: "锦绣河豚汤海云台总店",
    category: "food",
    priority: "option",
    status: "active",
    district: "海雲台",
    address: "釜山廣域市 海雲台區 中洞 1394-65",
    description: "適合作為 Day 2 或 Day 3 的穩定熱湯選項。",
    originalQuote: "海雲台錦繡河豚，鱈魚湯都好味，啱啱先jap完",
    source: "pdf-reference",
    tags: ["河豚湯", "海雲台", "穩定"],
  },
  // ── 新增：釜山鰻魚（Day 2 海雲台晚餐選項）──
  {
    id: "busan-eel",
    title: "釜山鰻魚",
    category: "food",
    priority: "option",
    status: "active",
    district: "海雲台",
    address: "釜山廣域市 海雲台區 中洞 1394-232",
    naverUrl: "https://naver.me/FSv5BQse",
    description: "海雲台鰻魚專門店，可作 Day 2 或 Day 3 海雲台晚餐其他可考慮選項。",
    source: "user",
    tags: ["鰻魚", "海雲台", "晚餐", "其他可考慮"],
  },
  {
    id: "songjeong-3dae",
    title: "松亭3代湯飯",
    category: "food",
    priority: "option",
    status: "optional",
    district: "釜田 / 松亭系補記",
    address: "釜山廣域市 釜山鎮區 釜田洞 255-19",
    description: "PDF 中被列入店家名單，應在總圖與資料層保留。",
    source: "pdf-reference",
    tags: ["湯飯", "資料層"],
  },
  {
    id: "gamcheon-hanbok",
    title: "甘川浪漫韓服",
    category: "activity",
    priority: "must",
    status: "active",
    district: "甘川",
    address: "Gamcheon Culture Village, Busan",
    description: "韓服正式定案店，放在 Day 3 上午，避開 Day 1 臉色與體力問題。",
    source: "pdf-final",
    tags: ["韓服", "情侶照", "甘川"],
  },
  {
    id: "haeon-hanbok",
    title: "海雲台 HAEON 韓服租借店",
    category: "activity",
    priority: "option",
    status: "optional",
    district: "海雲台",
    address: "HAEON Hanbok Haeundae, Busan",
    description: "屬 PDF 早段比較用備份，現已不作主線。",
    source: "pdf-reference",
    tags: ["韓服備份", "海雲台"],
  },
  {
    id: "ibgogage-hanbok",
    title: "ibgogage 韓服／制服體驗",
    category: "activity",
    priority: "option",
    status: "optional",
    district: "釜山",
    address: "ibgogage Hanbok Busan",
    description: "韓服比較用備份資料，保留於總圖與資料層。",
    source: "pdf-reference",
    tags: ["韓服備份"],
  },
  {
    id: "cheolsu-yeongchae-hanbok",
    title: "哲秀與英采韓服租借",
    category: "activity",
    priority: "option",
    status: "optional",
    district: "釜山",
    address: "Cheolsu & Yeongchae Hanbok Busan",
    description: "韓服比較用備份資料，現時不作主線。",
    source: "pdf-reference",
    tags: ["韓服備份"],
  },
  {
    id: "gamcheon-flipbook",
    title: "甘川洞手翻書",
    category: "activity",
    priority: "planned",
    status: "active",
    district: "甘川",
    address: "Gamcheon Culture Village Flipbook, Busan",
    description: "若排隊約 25–30 分鐘內可加，超過就應略過。",
    source: "pdf-final",
    tags: ["排隊風險", "甘川", "拍照加分"],
  },
  {
    id: "dyupeullit",
    title: "Dyupeullit 釜山海雲台 Haeridan Gil 店",
    category: "cafe",
    priority: "must",
    status: "active",
    district: "海雲台",
    address: "釜山廣域市 海雲台區 佑洞 533-3",
    description: "用戶新增必食甜點，應排在 Day 3 進海雲台後、膠囊列車前的緩衝時段。",
    originalQuote:
      "人生草莓蛋糕下晝之後先黎會sold out 海棉蛋糕係好soft 影幾幅相就會倒塌狀態 士多啤梨粒好甜",
    source: "user",
    tags: ["必食", "草莓蛋糕", "Haeridan-gil"],
  },
  {
    id: "momoseu-marine-city",
    title: "Momoseu 咖啡 Marine 城市店",
    category: "cafe",
    priority: "option",
    status: "active",
    district: "海雲台",
    address: "釜山廣域市 海雲台區 佑洞 1410-1",
    description: "世界級咖啡，可作 Day 3 膠囊列車前的輕咖啡選項，但不需為它特別改線。",
    originalQuote: "momos coffee 世界級的，仲要每一間分店都超靚",
    source: "pdf-reference",
    tags: ["咖啡", "海雲台", "膠囊列車前"],
  },
  {
    id: "goraesa-fishcake",
    title: "高莱沙魚糕海云台店",
    category: "food",
    priority: "option",
    status: "active",
    district: "海雲台",
    address: "釜山廣域市 海雲台區 佑洞 541-1",
    description: "海雲台附近很順路的小食補位，不需專程當正餐處理。",
    originalQuote: "古來思魚糕日日食都得！ 唔係街邊嗰種口感 食咗幾日",
    source: "pdf-reference",
    tags: ["小食", "海雲台", "順路"],
  },
  {
    id: "capsule-train",
    title: "海雲台藍線公園膠囊列車",
    category: "activity",
    priority: "must",
    status: "active",
    district: "尾浦 → 青沙浦",
    address: "Haeundae Blueline Park Sky Capsule, Busan",
    description: "已明確回歸 Day 3 主角位置，且現已知預約時間為 16:00。",
    source: "pdf-final",
    tags: ["必去", "預約", "16:00", "主角"],
  },
  {
    id: "haeundae-coast-train",
    title: "海雲台海岸列車",
    category: "travel",
    priority: "planned",
    status: "active",
    district: "青沙浦 / 海雲台",
    address: "Haeundae Beach Train, Busan",
    description: "與膠囊列車同線，作為 Day 3 線性接駁比獨立景點更重要。",
    source: "pdf-final",
    tags: ["接駁", "海雲台", "同線"],
  },
  {
    id: "haewol-observatory",
    title: "海月展望台",
    category: "sight",
    priority: "must",
    status: "active",
    district: "青沙浦 / 海雲台線",
    address: "Cheongsapo Daritdol Observatory, Busan",
    description: "因與膠囊列車同線，所以應保留為 Day 3 主線，而非挪到 Day 4。",
    source: "pdf-final",
    tags: ["海雲台線", "主線", "景觀"],
  },
  {
    id: "xthe-sky",
    title: "Busan X the SKY",
    category: "sight",
    priority: "must",
    status: "active",
    district: "海雲台",
    address: "Busan X the SKY",
    description: "主要為拍照與玻璃地板體驗，放在膠囊列車之前。",
    source: "pdf-final",
    tags: ["高空", "玻璃地板", "拍照"],
  },
  {
    id: "starbucks-haeundae",
    title: "X the SKY 周邊 / 同棟星巴克",
    category: "cafe",
    priority: "planned",
    status: "active",
    district: "海雲台",
    address: "Starbucks Haeundae Busan",
    description: "作為 Day 3 在高空景點前後的休息與補妝緩衝。",
    source: "pdf-final",
    tags: ["咖啡", "緩衝", "海雲台"],
  },
  {
    id: "arte-museum-busan",
    title: "Arte Museum 釜山",
    category: "sight",
    priority: "planned",
    status: "active",
    district: "海雲台",
    address: "Arte Museum Busan",
    description: "在膠囊列車升級為主角後，它仍值得保留，但可降級成可變選項。",
    source: "pdf-final",
    tags: ["沉浸式", "拍照", "可降級"],
  },
  {
    id: "clubd-oasis",
    title: "ClubD Oasis",
    category: "spa",
    priority: "must",
    status: "active",
    district: "海雲台",
    address: "ClubD Oasis, Busan",
    description: "依 clean、新淨、美觀的偏好正式勝出，為 Day 3 夜段主線收尾。",
    originalQuote: "clean、新淨、美觀",
    source: "pdf-final",
    tags: ["汗蒸幕", "Pass 尾段", "最終定案"],
  },
  {
    id: "mipojip",
    title: "Mipojip 海云台总店",
    category: "food",
    priority: "must",
    status: "active",
    district: "海雲台",
    address: "釜山廣域市 海雲台區 中洞 940-3",
    description: "味道很強，但排隊風險高，較適合作為 Day 3 晚餐備選而非主線硬排。",
    originalQuote:
      "海鮮唔會話醃到好咸，算係我食過當中最好食一間，但好多人排，建議5點就去拎飛，5:15去已經要等1hr",
    source: "pdf-reference",
    tags: ["海鮮", "排隊高風險", "海雲台"],
  },
  {
    id: "dae-galbi-haeundae",
    title: "传说牛肉 Dae 排骨海云台直营店",
    category: "food",
    priority: "option",
    status: "active",
    district: "海雲台",
    address: "釜山廣域市 海雲台區 中洞 1412-7",
    description: "Day 3 晚餐備選之一，適合想吃燒牛肉時切入。",
    originalQuote: "見google map 4.9分亂入間舖得幾款肉揀啲牛燒得好淋配埋芝士都好食招牌傳說牛大排骨",
    source: "pdf-reference",
    tags: ["海雲台", "牛肉", "晚餐備選"],
  },
  {
    id: "whos-who-mumu",
    title: "Who's who Mumu 西餅店",
    category: "cafe",
    priority: "option",
    status: "active",
    district: "海雲台",
    address: "釜山廣域市 海雲台區 中洞 940-3",
    description: "Day 3 若想加甜點，可與晚餐或海雲台散步一併處理。",
    originalQuote: "入去買咗個earl grey小蛋糕超驚豔， 可惜食嘅時候已經返咗首爾",
    source: "pdf-reference",
    tags: ["甜點", "海雲台", "補位"],
  },
  {
    id: "beuroni",
    title: "Beuroni",
    category: "cafe",
    priority: "option",
    status: "optional",
    district: "海雲台",
    address: "釜山廣域市 海雲台區 中洞 524-15",
    description: "被列在海雲台 cafe 名單中，雖未入主線，仍需保留在資料庫與地圖。",
    source: "pdf-reference",
    tags: ["Cafe", "海雲台", "資料層"],
  },
  {
    id: "the-art-cafe",
    title: "The Art 咖啡",
    category: "cafe",
    priority: "option",
    status: "optional",
    district: "海雲台",
    address: "釜山廣域市 海雲台區 中洞 586",
    description: "Kaymak 吐司被特別提及，應保留在完整點位庫。",
    originalQuote: "個kaymak（土耳其濃厚奶油）搽包勁好食 好濃奶香",
    source: "pdf-reference",
    tags: ["Kaymak", "Cafe", "海雲台"],
  },
  {
    id: "oryukdo-skywalk",
    title: "五六島 Skywalk",
    category: "sight",
    priority: "must",
    status: "active",
    district: "南區",
    address: "Oryukdo Skywalk, Busan",
    description: "不是松島順路點，較適合留在 Day 4 當最後補景點。",
    source: "pdf-final",
    tags: ["刺激", "Day 4", "補漏"],
  },
  {
    id: "onbap-jeonpo",
    title: "On飯 Jeonpo 店",
    category: "food",
    priority: "planned",
    status: "active",
    district: "田浦",
    address: "釜山廣域市 釜山鎮區 田浦洞 355-7",
    description: "Day 4 若想穩定收尾，這是很好的午餐線。",
    originalQuote:
      "田浦和廣安里有分店兩間分店差別不大水準很高家庭式的定食小菜及湯可以續最愛吃的是대삼치구이馬鮫魚",
    source: "pdf-reference",
    tags: ["定食", "穩定", "田浦"],
  },
  {
    id: "gowon",
    title: "Gowon",
    category: "food",
    priority: "must",
    status: "active",
    district: "田浦",
    address: "釜山廣域市 釜山鎮區 田浦洞 312-26",
    description: "Day 4 西面／田浦收尾版的高權重餐廳。",
    originalQuote: "烤豬皮的口感非常的神奇不敢吃肥肉的我，真的是吃下去驚為天人 整家店都是韓國人",
    source: "pdf-reference",
    tags: ["整家店都是韓國人", "高權重", "田浦"],
  },
  {
    id: "mirye-soup-rice",
    title: "Mirye 湯飯 Jeonpo 总店",
    category: "food",
    priority: "planned",
    status: "active",
    district: "田浦",
    address: "釜山廣域市 釜山鎮區 田浦洞 356-10",
    description: "不想吃太重時，可作 Day 4 的穩定湯飯收尾選項。",
    originalQuote:
      "湯不會有豬燥味肉量也很多 個人不喜歡吃肥肉所以很滿足 旁邊的冷切肉超級好吃肉很軟不會柴",
    source: "pdf-reference",
    tags: ["湯飯", "田浦", "午餐"],
  },
  {
    id: "your-type-jeonpo",
    title: "Your Type Jeonpo",
    category: "cafe",
    priority: "planned",
    status: "active",
    district: "田浦",
    address: "釜山廣域市 釜山鎮區 田浦洞 363-27",
    description: "田浦 cafe 補位點，被明確大推，適合 Day 4 食前或食後輕停。",
    originalQuote: "大推田浦cafe Your Type Jeonpo 유어타입 전포점",
    source: "pdf-reference",
    tags: ["田浦", "Cafe", "大推"],
  },
  {
    id: "lasoop",
    title: "LASOOP",
    category: "cafe",
    priority: "option",
    status: "optional",
    district: "西面",
    address: "釜山廣域市 釜山鎮區 釜田洞 168-273",
    description: "夜晚打卡型 cafe，較適合總圖與資料層保留。",
    originalQuote: "建議夜晚去 打卡真係超靚 好似仙境咁",
    source: "pdf-reference",
    tags: ["西面", "夜間", "打卡"],
  },
  {
    id: "bujebi",
    title: "Bujebi",
    category: "food",
    priority: "option",
    status: "optional",
    district: "田浦",
    address: "釜山廣域市 釜山鎮區 田浦洞 680-4",
    description: "田浦區特色餐廳，宜作資料層保留與補位。",
    originalQuote: "湯望落好清但幾辣辛辣麵再辣啲嘅辣但好鮮甜 오리갈비전係鴨 肉煎餅食落係韓式烤肉調味煎到好香口勁好jap",
    source: "pdf-reference",
    tags: ["田浦", "特色店", "資料層"],
  },
  {
    id: "eighty-three-haechi",
    title: "83Haechi",
    category: "food",
    priority: "option",
    status: "optional",
    district: "釜田",
    address: "釜山廣域市 釜山鎮區 釜田洞 142-8",
    description: "被列為很強的燒肉店，應保留於完整資料庫。",
    originalQuote: "食過燒肉呢間真係勁dope",
    source: "pdf-reference",
    tags: ["燒肉", "資料層"],
  },
  {
    id: "yeongjin-gukbap",
    title: "Yeongjin 豬肉湯飯",
    category: "food",
    priority: "option",
    status: "optional",
    district: "南區",
    address: "釜山廣域市 南區 大淵洞 40-1",
    description: "雖不在主要景點附近，仍是值得保留的湯飯點。",
    originalQuote: "豬肉湯飯：영진돼지국밥 呢間我覺得最好dap 雖然附近冇咩旅遊景點 搭地鐵都好方便",
    source: "pdf-reference",
    tags: ["湯飯", "南區", "資料層"],
  },
  {
    id: "chopilssal",
    title: "Chopilssal 豬燒烤廣安直营店",
    category: "food",
    priority: "must",
    status: "dropped",
    district: "廣安里",
    address: "釜山廣域市 水營區 廣安洞 198-5",
    description: "曾屬動物咖啡廳版本的晚餐高權重備選，現因該版本刪除而降為已放棄主線。",
    originalQuote:
      "釜山當地人推薦，主要食烤五花肉、豬皮外脆內軟、又有油香，第二次星期一傍晚去到要等50枱都等咗兩個半鐘",
    source: "pdf-reference",
    tags: ["當地人推薦", "排隊高風險", "已降級"],
  },
  {
    id: "running-man-busan",
    title: "Running Man 體驗館",
    category: "activity",
    priority: "option",
    status: "optional",
    district: "釜山",
    address: "Running Man Busan",
    description: "早段 PDF 列為想去的 Pass 景點，後續版本未納入主線，仍應保留資料。",
    source: "pdf-reference",
    tags: ["Pass", "早段願望", "資料層"],
  },
  {
    id: "museum-one",
    title: "Museum 1",
    category: "sight",
    priority: "option",
    status: "dropped",
    district: "釜山",
    address: "Museum 1 Busan",
    description: "後續版本已明確說不要了，但仍應可在資料層看見被移除原因。",
    source: "pdf-reference",
    tags: ["已移除", "資料層"],
  },
  {
    id: "spa-land",
    title: "Spa Land Centum City",
    category: "spa",
    priority: "option",
    status: "dropped",
    district: "Centum City",
    address: "Spa Land Centum City, Busan",
    description: "因人多與品質感下降而被正式排除，但比較結果仍要保留。",
    source: "pdf-reference",
    tags: ["汗蒸幕", "已排除", "比較資料"],
  },
  {
    id: "hillspa",
    title: "Hillspa 汗蒸幕",
    category: "spa",
    priority: "option",
    status: "optional",
    district: "海雲台",
    address: "Hillspa Jjimjilbang, Busan",
    description: "以休息舒適見長，但不符合 clean / 新淨 / 美觀為首的最新偏好。",
    source: "pdf-reference",
    tags: ["汗蒸幕比較", "休息型"],
  },
  {
    id: "aqua-palace",
    title: "Hotel Aqua Palace Spa & Sauna",
    category: "spa",
    priority: "option",
    status: "optional",
    district: "廣安里",
    address: "Hotel Aqua Palace Spa & Sauna, Busan",
    description: "早段候選汗蒸幕之一，現保留在比較資料層。",
    source: "pdf-reference",
    tags: ["汗蒸幕比較"],
  },
  {
    id: "seven-theme-cafe",
    title: "Seven Theme Cafe",
    category: "cafe",
    priority: "option",
    status: "dropped",
    district: "廣安里",
    address: "Seven Theme Cafe, Gwangalli, Busan",
    description: "曾作 Day 3 晚間分支，但用戶已決定刪除，之後首爾會去 Zoolung Zoolung。",
    originalQuote: "釜山這家海景動物咖啡廳太萌了！",
    source: "pdf-reference",
    tags: ["已刪除", "廣安里", "動物咖啡廳"],
  },
];

const busanDays: TripDay[] = [
  {
    id: "busan-day-1",
    label: "Day 1",
    dateLabel: "5/18（日）",
    area: "南浦・富平・影島・太宗台・鑽石灣遊艇",
    theme: "暖機日",
    summary:
      "首日由南浦與富平展開，感受舊城區節奏後前往影島吃一隻雞午餐，下午視體力補入 Burger Yo、Bielleu 或太宗台飛索，晚上以鑽石灣遊艇為核心，並於此時啟用 Busan Pass。",
    bookings: [
      {
        id: "d1-luggage",
        time: "08:30",
        title: "101 大廈行李寄存可用",
        kind: "transport",
        locked: true,
        district: "南浦 / 富平銜接帶",
        note: "3F 304室，營業 08:30–22:00。如下機＋入市區時間配合，可先放行李再吃早餐。",
        relatedPlaceId: "luggage-storage-101",
      },
      {
        id: "d1-checkin",
        time: "16:00",
        title: "住宿 check-in",
        kind: "stay",
        locked: true,
        district: "西區 / 松島連接帶",
        note: "Busan Seo-gu Chungmu-daero 120。不要拖太晚，需留時間休息整理。",
        relatedPlaceId: "busan-stay-chungmu",
      },
      {
        id: "d1-yacht-booking",
        time: "18:50",
        title: "鑽石灣遊艇報到",
        kind: "reservation",
        locked: true,
        district: "南區 / 港灣",
        note: "19:30 開船，需提前 30–40 分鐘報到。Busan Pass 由此啟用，需確認是否可稍後才掃。",
        relatedPlaceId: "diamond-bay-yacht",
      },
      {
        id: "d1-pass",
        time: "19:30",
        title: "Busan Pass 啟用（遊艇出發）",
        kind: "pass",
        locked: true,
        district: "南區 / 港灣",
        note: "Pass 由遊艇出發時正式啟用，Day 3 ClubD 為尾段使用，目標 18:35–18:45 前到場。",
      },
    ],
    optionGroups: [
      {
        id: "d1-west-bites",
        title: "影島可補位",
        description:
          "午餐後視體力與飽肚程度，在影島一帶補入 Burger Yo、Bielleu 或太宗台飛索。",
        accent: "amber",
      },
      {
        id: "d1-taejongdae-branch",
        title: "太宗台飛索候選",
        description:
          "天氣好、營業正常、排隊不長才做。否則直接略過，不影響遊艇主線。",
        accent: "sky",
      },
      {
        id: "d1-evening-food",
        title: "遊艇後晚餐",
        description:
          "遊艇約 20:45–21:00 結束，若還有精神可前往廣安里吃高權重晚餐。",
        accent: "rose",
      },
      {
        id: "d1-other-options",
        title: "其他可考慮行程",
        description:
          "廣安里一帶另可考慮：Chopilssal 豬燒烤、Tonsyou Gwangan 店、泥灘貝殼廣安里店，或 Arte Museum 沉浸式展覽。",
        accent: "mint",
      },
    ],
    stops: [
      {
        id: "d1-stop-luggage",
        placeId: "luggage-storage-101",
        time: "08:30",
        role: "main",
        note: "如下機時間配合，先放行李再開始行程。",
      },
      {
        id: "d1-stop-eggdrop",
        placeId: "eggdrop-nampo",
        time: "09:10",
        role: "main",
        note: "放完行李後順路吃早餐，開展第一天節奏。",
      },
      {
        id: "d1-stop-bupyeong",
        placeId: "bupyeong-market",
        time: "09:50",
        role: "main",
        note: "輕鬆散步，感受舊城區氣氛。",
      },
      {
        id: "d1-stop-milgot",
        placeId: "milgot",
        time: "10:45",
        role: "main",
        note: "Must-eat 糕點，早去較穩，否則易售罄。太遲則 Day 4 補回。",
      },
      {
        id: "d1-stop-myeongseong",
        placeId: "myeongseong-one-dak",
        time: "12:00",
        role: "main",
        note: "固定午餐，影島區 絶影路 22 1樓。",
      },
      {
        id: "d1-stop-burgeryo",
        placeId: "burger-yo",
        time: "13:30",
        role: "main",
        note: "午餐後視體力補入，影島同區。",
      },
      {
        id: "d1-stop-bielleu",
        placeId: "bielleu",
        time: "13:45",
        role: "main",
        note: "與 Burger Yo 同區考慮，海景 Cafe 補位。",
      },
      {
        id: "d1-stop-taejongdae",
        placeId: "taejongdae-zipline",
        time: "14:30",
        role: "main",
        note: "天氣好、營業正常、排隊不長才做，否則略過。",
      },
      {
        id: "d1-stop-checkin",
        placeId: "busan-stay-chungmu",
        time: "16:30",
        role: "main",
        note: "休息、整理、準備晚上遊艇。不要拖太晚。",
      },
      {
        id: "d1-stop-yacht",
        placeId: "diamond-bay-yacht",
        time: "18:50",
        role: "main",
        note: "19:30 開船，提前 30–40 分鐘報到。Busan Pass 由此啟用。",
      },
      {
        id: "d1-stop-busandaek",
        placeId: "busandaek",
        time: "20:45",
        role: "main",
        note: "遊艇後有精神才去，不必硬排。",
      },
      {
        id: "d1-stop-cheongsan",
        placeId: "cheongsan-1954",
        time: "20:50",
        role: "backup",
        note: "與 Busandaek 同屬晚餐高權重備選。",
        groupId: "d1-evening-food",
      },
      {
        id: "d1-stop-chopilssal-gwangan",
        placeId: "chopilssal-gwangan",
        time: "21:00",
        role: "option",
        note: "廣安里其他可考慮晚餐選項之一。",
        groupId: "d1-other-options",
      },
      {
        id: "d1-stop-tonsyou",
        placeId: "tonsyou-gwangan",
        time: "21:00",
        role: "option",
        note: "廣安里其他可考慮晚餐選項之一。",
        groupId: "d1-other-options",
      },
      {
        id: "d1-stop-mudflat",
        placeId: "mudflat-shellfish-gwangan",
        time: "21:00",
        role: "option",
        note: "廣安里貝殼海鮮，其他可考慮晚餐選項。",
        groupId: "d1-other-options",
      },
      {
        id: "d1-stop-arte",
        placeId: "arte-museum-gwangan",
        time: "21:00",
        role: "option",
        note: "Arte Museum 沉浸式展覽，廣安里其他可考慮行程。",
        groupId: "d1-other-options",
      },
    ],
  },
  {
    id: "busan-day-2",
    label: "Day 2",
    dateLabel: "5/19（一）",
    area: "松島・東釜山・機張・樂天世界・松亭",
    theme: "Pass 設施日",
    summary:
      "早上由住宿步行至松島海上纜車，完成後的士直奔東釜山玩 Skyline Luge，再吃龍宮炸醬麵，下午把完整時間留給釜山樂天世界，晚上以 Rapseu 作高權重收尾。",
    bookings: [],
    optionGroups: [
      {
        id: "d2-east-side-evening",
        title: "東邊晚餐選項",
        description: "Day 2 晚上只選一間就夠，避免玩完設施後還硬轉場。",
        accent: "amber",
      },
      {
        id: "d2-east-side-nearby",
        title: "Day 2 可再補的點",
        description: "不影響樂園主體驗的前提下才補。",
        accent: "sky",
      },
      {
        id: "d2-fallback-rules",
        title: "Day 2 降級規則",
        description:
          "早上任何一段延誤：先取消龍宮雲橋 → Luge 控制時間 → 樂天只玩重點 → Outlet 直接刪除。",
        accent: "mint",
      },
            {
        id: "d2-haeundae-dinner-options",
        title: "其他可考慮行程（海雲台晚餐）",
        description:
          "海雲台一帶晚餐另可考慮：釜山鰻魚、Kkotgedang 醬油蟹、锦绣河豚汤，視當日位置與體力選擇。",
        accent: "rose",
      },
    ],
    stops: [
      {
        id: "d2-stop-cable-car",
        placeId: "songdo-cable-car",
        time: "09:00",
        role: "main",
        note: "住宿在松島附近，步行距離近，Day 2 早上完成，避免 Day 1 開 Pass 太早。",
      },
      {
        id: "d2-stop-yonggung",
        placeId: "songdo-yonggung",
        time: "09:45",
        role: "nearby",
        note: "順路短停；如排隊 / 天氣差可跳過。",
        groupId: "d2-east-side-nearby",
      },
      {
        id: "d2-stop-luge",
        placeId: "skyline-luge",
        time: "11:25",
        role: "main",
        note: "的士前往，玩重點次數，不要玩到過午太久。",
      },
      {
        id: "d2-stop-jajang",
        placeId: "gungnam-jajangmyeon",
        time: "12:45",
        role: "main",
        note: "已決定的 Day 2 午餐，控制在 1–1.5 小時內。",
      },
      {
        id: "d2-stop-lotte",
        placeId: "lotte-world-busan",
        time: "14:10",
        role: "main",
        note: "下午完整交給樂園，主攻想玩的設施。",
      },
      {
        id: "d2-stop-outlet",
        placeId: "dongbusan-outlet",
        time: "18:30",
        role: "nearby",
        note: "有精神才快速逛，否則直接去晚餐。",
        groupId: "d2-east-side-nearby",
      },
      {
        id: "d2-stop-rapseu",
        placeId: "rapseu",
        time: "19:30",
        role: "option",
        note: "Day 2 最值得保留的一頓正式晚餐。",
        groupId: "d2-east-side-evening",
      },
      {
        id: "d2-stop-kkotgedang",
        placeId: "kkotgedang",
        time: "19:40",
        role: "option",
        note: "若想改吃醬油蟹，這是同晚替代。",
        groupId: "d2-haeundae-dinner-options",
      },
      {
        id: "d2-stop-geumsu",
        placeId: "geumsu-bokguk",
        time: "19:45",
        role: "option",
        note: "若這晚想要熱湯型收尾，可改選河豚湯。",
        groupId: "d2-haeundae-dinner-options",
      },
      {
        id: "d2-stop-busan-eel",
        placeId: "busan-eel",
        time: "19:50",
        role: "option",
        note: "釜山鰻魚，海雲台晚餐其他可考慮選項。",
        groupId: "d2-haeundae-dinner-options",
      },
    ],
  },
  {
    id: "busan-day-3",
    label: "Day 3",
    dateLabel: "5/20（二）",
    area: "甘川・海雲台・青沙浦・ClubD",
    theme: "拍照日",
    summary:
      "全釜山段最需要控時的一天。上午甘川韓服拍照，中午甘川 / 南浦一帶輕食，下午進海雲台吃 Dyupeullit 草莓蛋糕，再完成 Busan X the SKY，15:40 前到尾浦站趕上 16:00 膠囊列車，青沙浦短停後務必於 18:35–18:45 前到達 ClubD Oasis 完成 Pass 尾段使用。",
    bookings: [
      {
        id: "d3-capsule-booking",
        time: "16:00",
        title: "膠囊列車已預約",
        kind: "reservation",
        locked: true,
        district: "尾浦 → 青沙浦",
        note: "Day 3 最重要的時間鎖。需 15:40–15:45 前抵達尾浦站。",
        relatedPlaceId: "capsule-train",
      },
      {
        id: "d3-clubd-window",
        time: "18:35",
        title: "ClubD Oasis 入場死線",
        kind: "wellness",
        locked: true,
        district: "海雲台",
        note: "Pass 到期前的保守目標：18:35–18:45 前完成入場。若 Day 1 確認 Pass 是 19:30 才開，可稍鬆，但仍不建議 19:00 後才到。",
        relatedPlaceId: "clubd-oasis",
      },
    ],
    optionGroups: [
      {
        id: "d3-pre-train-buffer",
        title: "膠囊列車前緩衝",
        description:
          "膠囊前只留甜點、X the SKY，不再塞大景點。15:20 前必須出發往尾浦。",
        accent: "amber",
      },
      {
        id: "d3-post-capsule",
        title: "青沙浦短停",
        description: "下車後只短拍海月展望台，不久留，優先保 ClubD 時間。",
        accent: "sky",
      },
      {
        id: "d3-dinner-light",
        title: "ClubD 前輕食",
        description:
          "這天不建議吃排隊晚餐。便利店小食 / 魚糕 / 輕食最合適，ClubD 後視情況再補。",
        accent: "mint",
      },
      {
        id: "d3-haeundae-dinner-options",
        title: "其他可考慮行程（海雲台晚餐）",
        description:
          "ClubD 後若仍有食慾，海雲台一帶可考慮：釜山鰻魚、Kkotgedang 醬油蟹、锦绣河豚汤、Mipojip、Dae 排骨等。",
        accent: "rose",
      },
    ],
    stops: [
      {
        id: "d3-stop-hanbok",
        placeId: "gamcheon-hanbok",
        time: "09:30",
        role: "main",
        note: "先化妝與整理頭髮，再的士過去，保住拍照情緒值。",
      },
      {
        id: "d3-stop-flipbook",
        placeId: "gamcheon-flipbook",
        time: "11:00",
        role: "option",
        note: "排隊 25–30 分鐘內才做，否則略過。",
      },
      {
        id: "d3-stop-lunch-light",
        placeId: "bupyeong-market",
        time: "12:00",
        role: "nearby",
        note: "甘川 / 南浦一帶輕食，即場決定，不排正式長餐，避免下午太趕。",
      },
      {
        id: "d3-stop-dyupeullit",
        placeId: "dyupeullit",
        time: "13:50",
        role: "main",
        note: "必食草莓蛋糕，海雲台區 佑洞 533-3。放前段比後段安全。",
        groupId: "d3-pre-train-buffer",
      },
      {
        id: "d3-stop-xthe-sky",
        placeId: "xthe-sky",
        time: "14:40",
        role: "main",
        note: "Busan X the SKY 一定放膠囊前。短停拍照與玻璃地板即可。",
        groupId: "d3-pre-train-buffer",
      },
      {
        id: "d3-stop-goraesa-pre",
        placeId: "goraesa-fishcake",
        time: "15:10",
        role: "nearby",
        note: "前往尾浦站途中的快速小食補肚。",
        groupId: "d3-pre-train-buffer",
      },
      {
        id: "d3-stop-capsule",
        placeId: "capsule-train",
        time: "16:00",
        role: "main",
        note: "已預約，15:40–15:45 前到尾浦站。",
      },
      {
        id: "d3-stop-haewol",
        placeId: "haewol-observatory",
        time: "16:45",
        role: "main",
        note: "青沙浦下車後短拍，不久留，優先保 ClubD。",
      },
      {
        id: "d3-stop-coast-train",
        placeId: "haeundae-coast-train",
        time: "17:10",
        role: "main",
        note: "線性接駁，把 Day 3 再接回海雲台 / ClubD 方向。",
      },
      {
        id: "d3-stop-goraesa-post",
        placeId: "goraesa-fishcake",
        time: "18:10",
        role: "nearby",
        note: "ClubD 前便利店 / 小食補給，不排正式餐廳。",
        groupId: "d3-dinner-light",
      },
      {
        id: "d3-stop-clubd",
        placeId: "clubd-oasis",
        time: "18:35",
        role: "main",
        note: "Pass 尾段最重要的收尾，保守目標 18:35–18:45 前入場。",
      },
      {
        id: "d3-stop-kkotgedang",
        placeId: "kkotgedang",
        time: "21:00",
        role: "option",
        note: "ClubD 後若仍有食慾，可考慮醬油蟹。",
        groupId: "d3-haeundae-dinner-options",
      },
      {
        id: "d3-stop-busan-eel",
        placeId: "busan-eel",
        time: "21:00",
        role: "option",
        note: "ClubD 後海雲台鰻魚，其他可考慮晚餐。",
        groupId: "d3-haeundae-dinner-options",
      },
      {
        id: "d3-stop-geumsu",
        placeId: "geumsu-bokguk",
        time: "21:00",
        role: "option",
        note: "ClubD 後若想吃熱湯，可選河豚湯。",
        groupId: "d3-haeundae-dinner-options",
      },
    ],
  },
    {
    id: "busan-day-4",
    label: "Day 4",
    dateLabel: "5/21（三）",
    area: "南浦・富平・影島・釜山站 → 首爾・明洞",
    theme: "補漏移動日",
    summary:
      "早上輕鬆補漏，中午乘 KTX 北上首爾，傍晚聖水洞剪頭髮，晚上明洞 Sura Gejang 醬油蟹。KTX 建議 12:30–13:00 時段，確保 18:00 前能到達聖水洞。",
    bookings: [
      {
        id: "d4-ktx",
        time: "12:30",
        title: "KTX 釜山 → 首爾",
        kind: "transport",
        locked: true,
        district: "釜山站",
        note: "建議 12:30–13:00 時段出發，約 2.5 小時後抵達首爾站。不建議 15:30 才出發，否則剪頭髮會太趕。",
      },
    ],
    optionGroups: [
      {
        id: "d4-soft-landing",
        title: "釜山補漏（早上）",
        description:
          "輕鬆收尾，不排遠點。Milgot 和 Burger Yo 是 Day 1 未完成的補位。",
        accent: "amber",
      },
      {
        id: "d4-seoul-night-shopping",
        title: "首爾夜買候選",
        description:
          "有精神才去東大門，不要硬撐。The OT / Nujyon 二選一即可。",
        accent: "sky",
      },
    ],
    stops: [
      {
        id: "d4-stop-bupyeong",
        placeId: "bupyeong-market",
        time: "09:30",
        role: "backup",
        note: "南浦 / 富平輕鬆補買，不排遠點。",
        groupId: "d4-soft-landing",
      },
      {
        id: "d4-stop-milgot",
        placeId: "milgot",
        time: "10:15",
        role: "backup",
        note: "Day 1 未買到就今天補。",
        groupId: "d4-soft-landing",
      },
      {
        id: "d4-stop-burgeryo",
        placeId: "burger-yo",
        time: "10:45",
        role: "backup",
        note: "Day 1 未成功插入才做。",
        groupId: "d4-soft-landing",
      },
      {
        id: "d4-stop-to-station",
        placeId: "luggage-storage-101",
        time: "11:45",
        role: "main",
        note: "前往釜山站，取回行李，準備 KTX。",
      },
      {
        id: "d4-stop-seoul-checkin",
        placeId: "moment-mansion",
        time: "16:20",
        role: "main",
        note: "抵達首爾站後前往住宿 check-in，中區 退溪路87街 24-7 1樓。",
      },
      {
        id: "d4-stop-haircut",
        placeId: "seongsu-haircut",
        time: "18:00",
        role: "main",
        note: "聖水洞剪頭髮，預約最晚開始時間。剪＋洗＋造型後約 20:30 可吃晚餐。",
      },
      {
        id: "d4-stop-sura",
        placeId: "sura-gejang-seoul",
        time: "20:30",
        role: "main",
        note: "首爾第一晚晚餐，明洞 Sura Gejang 醬油蟹，地址為中區 明洞10街 18 2樓。",
      },
      {
        id: "d4-stop-the-ot",
        placeId: "dioteu-dongdaemun",
        time: "22:30",
        role: "option",
        note: "有精神才去，太累可直接刪除。",
        groupId: "d4-seoul-night-shopping",
      },
      {
        id: "d4-stop-nujyon",
        placeId: "nujyon-dongdaemun",
        time: "22:45",
        role: "option",
        note: "與 The OT 二選一即可。",
        groupId: "d4-seoul-night-shopping",
      },
    ],
  },
];

const seoulPlaces: TripPlace[] = [
  {
    id: "moment-mansion",
    title: "Moment Mansion 花園樓",
    category: "stay",
    priority: "planned",
    status: "active",
    district: "東大門 / 黃鶴洞",
    address: "首爾特別市 中區 退溪路87街 24-7 1樓",
    naverUrl: "https://naver.me/FaeAbgm5",
    description: "首爾段住宿節點，所有東大門起迄與休息時段均以此為核心。",
    source: "user",
    tags: ["首爾住宿", "東大門", "固定"],
  },
  {
    id: "deepin-sindang",
    title: "Deepin 新堂",
    category: "food",
    priority: "must",
    status: "active",
    district: "新堂",
    address: "首爾特別市 中區 退溪路 411 1樓",
    naverUrl: "https://map.naver.com/p/search/Deepin%20%EC%8B%A0%EB%8B%B9/place/1647309508",
    description: "首爾到達日晚餐主線，與東大門住宿距離合理，能穩定展開首爾第一晚。",
    source: "pdf-final",
    tags: ["首選晚餐", "首爾 Day 1", "固定主線"],
  },
  {
    id: "dioteu-dongdaemun",
    title: "The OT / Dioteu 時裝批發商城東門",
    category: "shopping",
    priority: "planned",
    status: "active",
    district: "東大門",
    address: "首爾特別市 中區 興仁洞",
    naverUrl: "https://naver.me/5eDeLjfu",
    description: "抵達日晚間的夜買主線之一，可按體力與營業情況延長或縮短。",
    source: "user",
    tags: ["東大門", "夜買", "The OT"],
  },
  {
    id: "nujyon-dongdaemun",
    title: "Nujyon 時裝商場",
    category: "shopping",
    priority: "planned",
    status: "active",
    district: "東大門",
    address: "首爾特別市 中區 新堂洞 200-5",
    naverUrl: "https://naver.me/FWTvkCt2",
    description: "可與 The OT 連看，形成首爾到達日的東大門夜買支線。",
    source: "user",
    tags: ["東大門", "夜買", "批發商城"],
  },
  {
    id: "sinsa-apgujeong",
    title: "新沙 / 狎鷗亭散步線",
    category: "sight",
    priority: "planned",
    status: "active",
    district: "新沙 / 狎鷗亭",
    address: "首爾特別市 江南區 新沙洞 林蔭道一帶",
    naverUrl: "https://map.naver.com/p/search/%EC%8B%A0%EC%82%AC%EB%8F%99%20%EA%B0%80%EB%A1%9C%EC%88%98%EA%B8%B8",
    description: "生日當日白天以散步、選物與拍照為主，營造輕鬆而帶儀式感的前段節奏。",
    source: "pdf-final",
    tags: ["生日", "散步", "拍照"],
  },
  // ── 新增：面首爾（狎鷗亭散步線後的餐廳選項）──
  {
    id: "myeon-seoul",
    title: "面首爾",
    category: "food",
    priority: "option",
    status: "active",
    district: "新沙 / 狎鷗亭",
    address: "首爾特別市 江南區 新沙洞 666-8",
    naverUrl: "https://naver.me/x0Ozc7q6",
    description: "狎鷗亭散步線後的餐廳選項，如肚子有空間才去吃。",
    source: "user",
    tags: ["新沙", "狎鷗亭", "如有空間", "Day 6"],
  },
  {
    id: "superpan-seoul",
    title: "SUPERPAN",
    category: "food",
    priority: "must",
    status: "active",
    district: "新沙 / 狎鷗亭",
    address: "首爾特別市 江南區 論峴路167街 15 休F大樓 2樓",
    naverUrl: "https://map.naver.com/p/search/SUPERPAN%20%EC%84%9C%EC%9A%B8/place/36262174",
    description: "生日午餐首選，適合放在白天散步與晚餐之間，保留慶祝感與節奏。",
    source: "pdf-final",
    tags: ["生日午餐", "首選", "江南"],
  },
  {
    id: "original-numbers-cheongdam",
    title: "Original Numbers 清潭",
    category: "food",
    priority: "must",
    status: "active",
    district: "清潭",
    address: "首爾特別市 江南區 島山大路55街 24",
    naverUrl: "https://map.naver.com/p/search/Original%20Numbers%20%EC%B2%AD%EB%8B%B4/place/1524329439",
    description: "生日晚餐主角，應完整保留作為當晚最重要的慶祝用餐安排。",
    source: "pdf-final",
    tags: ["生日晚餐", "清潭", "固定主線"],
  },
  {
    id: "myeongdong-walk",
    title: "明洞 / 乙支路慢走",
    category: "shopping",
    priority: "planned",
    status: "active",
    district: "明洞",
    address: "首爾特別市 中區 明洞街一帶",
    naverUrl: "https://map.naver.com/p/search/%EB%AA%85%EB%8F%99",
    description: "作為 5/23 的白天主線，午餐前後均可留出逛街與 café 彈性。",
    source: "pdf-final",
    tags: ["明洞", "慢走", "購物"],
  },
  {
    id: "sura-gejang-seoul",
    title: "Sura Gejang 醬油蟹",
    category: "food",
    priority: "must",
    status: "active",
    district: "明洞",
    address: "首爾特別市 中區 明洞10街 18 2樓",
    naverUrl: "https://map.naver.com/p/search/Sura%20Gejang%20%EC%84%9C%EC%9A%B8/place/2025015878",
    description: "5/23 明洞主線的午餐首選，能把一天節奏穩定鎖在明洞區內。",
    source: "pdf-final",
    tags: ["明洞午餐", "首選", "蟹料理"],
  },
  {
    id: "amton-hongdae",
    title: "AMTON 弘大",
    category: "spa",
    priority: "planned",
    status: "active",
    district: "弘大 / 西橋洞",
    address: "首爾特別市 麻浦區 西橋洞一帶",
    naverUrl: "https://map.naver.com/p/search/AMTON%20%ED%99%8D%EB%8C%80",
    description: "已確認為美容室，作為 5/23 下午的 beauty 時段安排。",
    source: "user",
    tags: ["美容室", "弘大", "確認無誤"],
  },
  {
    id: "hongdae-street",
    title: "弘大商店街 / 夜場自由活動",
    category: "shopping",
    priority: "planned",
    status: "active",
    district: "弘大",
    address: "首爾特別市 麻浦區 弘益路一帶",
    naverUrl: "https://map.naver.com/p/search/%ED%99%8D%EB%8C%80%20%EA%B1%B0%EB%A6%AC",
    description: "5/23 晚間以街頭、小食與自由活動作收尾，保持行程的輕盈感。",
    source: "pdf-final",
    tags: ["弘大", "夜場", "自由活動"],
  },
  {
    id: "gongneung-dak-sinchon",
    title: "孔陵一隻雞（新村備選）",
    category: "food",
    priority: "option",
    status: "active",
    district: "新村",
    address: "首爾特別市 西大門區 新村一帶",
    naverUrl: "https://map.naver.com/p/search/%EA%B3%B5%EB%A6%89%20%EB%8B%AD%ED%95%9C%EB%A7%88%EB%A6%AC%20%EC%8B%A0%EC%B4%8C",
    description: "若釜山的一隻雞安排有變數，可作 5/23 晚上較穩定的補位選項。",
    source: "pdf-final",
    tags: ["備選晚餐", "一隻雞", "新村"],
  },
  // ── 更新：Congdu 明洞（原 Kongdu，更新名稱、地址與 naverUrl）──
  {
    id: "kongdu-myeongdong",
    title: "Congdu 明洞",
    category: "food",
    priority: "must",
    status: "active",
    district: "明洞",
    address: "首爾特別市 中區 明洞一街 59-1",
    naverUrl: "https://naver.me/GM3WHnSa",
    description: "離境日午餐主角，需準時入座，避免壓縮後續永登浦與機場移動。",
    source: "user",
    tags: ["離境日", "首選午餐", "固定主線"],
  },
  {
    id: "jureongjureong-yeongdeungpo",
    title: "Jureongjureong 動物園 永登浦店",
    category: "activity",
    priority: "planned",
    status: "active",
    district: "永登浦",
    address: "首爾特別市 永登浦區 永登浦洞四街 442",
    naverUrl: "https://naver.me/5T0HkM70",
    description: "離境日下午的主要活動，需控制在 1.5 至 2 小時內，避免影響赴機場時間。",
    source: "user",
    tags: ["離境日", "動物園", "永登浦"],
  },
  {
    id: "times-square-yeongdeungpo",
    title: "Time Square / 地下街補逛",
    category: "shopping",
    priority: "option",
    status: "active",
    district: "永登浦",
    address: "首爾特別市 永登浦區 永中路 15",
    naverUrl: "https://map.naver.com/p/search/%EC%98%81%EB%93%B1%ED%8F%AC%20%ED%83%80%EC%9E%84%EC%8A%A4%ED%80%98%EC%96%B4",
    description: "只在時間順利時短暫補逛，不應搶走 Congdu、Jureongjureong 與機場主線。",
    source: "pdf-final",
    tags: ["永登浦", "補逛", "可放棄"],
  },
  {
    id: "myeongseong-dak-seoul",
    title: "明星一隻雞（首爾待排）",
    category: "food",
    priority: "must",
    status: "optional",
    district: "首爾待確認分店",
    description: "你已明確指定為首爾必食，之後若要再加吃一隻雞，可放入首爾主線或備選晚餐。",
    originalQuote: "用戶指定首爾必食，之後規劃首爾時必須排入。",
    source: "user",
    tags: ["首爾", "必食", "待排入"],
  },
  {
    id: "seongsu-haircut",
    title: "聖水洞剪頭髮",
    category: "activity",
    priority: "must",
    status: "active",
    district: "聖水洞",
    address: "首爾特別市 城東區 聖水洞一帶",
    description: "Day 5 傍晚安排，預約最晚開始時間為 18:00。剪＋洗＋造型後約 20:30 可吃晚餐。如加染 / 燙，會影響晚餐時間。",
    source: "user",
    tags: ["剪頭髮", "聖水洞", "Day 5"],
  },
  {
    id: "gwangjang-market",
    title: "廣藏市場",
    category: "market",
    priority: "planned",
    status: "active",
    district: "鐘路",
    address: "首爾特別市 鐘路區 昌慶宮路 88",
    description: "Day 7 早上買綿被的主線，早去選擇較好，買完務必回住宿放低再繼續行程。",
    source: "user",
    tags: ["綿被", "Day 7", "早去"],
  },
  {
  id: "goryo-house-tea",
  title: "古好齋傳統宮廷茶點體驗",
  category: "cafe",
  priority: "planned",
  status: "active",
  district: "忠武路",
  address: "首爾特別市 中區 忠武路一帶",
  description: "傳統宮廷茶點體驗，適合作為生日當天上午較有儀式感、節奏安靜的開始；完成後再前往江南一帶銜接 SUPERPAN 午餐。",
  source: "user",
  tags: ["茶點", "忠武路", "生日", "Day 5", "主線"],
  },
  {
    id: "national-aviation-museum",
    title: "國立航空博物館",
    category: "sight",
    priority: "must",
    status: "active",
    district: "金浦機場附近",
    address: "首爾特別市 江西區 하늘길 177",
    description: "Day 8 離境日景點，18:00 關門，最遲 16:15 前入場，約留 1.5–1.75 小時。",
    source: "user",
    tags: ["離境日", "金浦", "18:00關門"],
  },
  // ── 更新：雲西站晚餐改為新浦國際市場 ──
  {
    id: "unsi-station-dinner",
    title: "新浦國際市場",
    category: "market",
    priority: "planned",
    status: "active",
    district: "仁川 / 新浦洞",
    address: "仁川廣域市 中區 新浦洞 6-6",
    naverUrl: "https://naver.me/GZDs3Org",
    description: "Day 8 離境前最後一餐，新浦國際市場一帶用餐，20:10 前必須離開。",
    source: "user",
    tags: ["離境日", "最後一餐", "新浦", "仁川", "即場決定"],
  },
];

const seoulDays: TripDay[] = [
  {
    id: "seoul-day-1",
    label: "Day 4",
    dateLabel: "5/21（四）",
    area: "首爾站・聖水・東大門",
    theme: "到達日",
    summary:
      "KTX 抵達首爾後先 check-in，傍晚前往聖水洞剪頭髮（預約最晚 18:00 開始），有精神才補東大門夜買。",
    bookings: [
      {
        id: "s1-arrive-window",
        time: "15:50",
        title: "抵達首爾站",
        kind: "transport",
        locked: true,
        district: "首爾站",
        note: "KTX 約 2.5 小時，視實際班次。抵達後盡快前往住宿。",
        relatedPlaceId: "moment-mansion",
      },
      {
        id: "s1-haircut-lock",
        time: "18:00",
        title: "聖水洞剪頭髮",
        kind: "wellness",
        locked: true,
        district: "聖水洞",
        note: "預約最晚開始時間為 18:00。剪＋洗＋造型後約 20:30 可吃晚餐。如加染 / 燙，會影響晚餐時間，不建議同晚做大型髮型項目。",
        relatedPlaceId: "seongsu-haircut",
      },
    ],
    optionGroups: [
      {
        id: "s1-night-shopping-flex",
        title: "夜買彈性",
        description: "若太累可只保留一間，或直接略過。到達日不要硬撐。",
        accent: "sky",
      },
    ],
    stops: [
      {
        id: "s1-stop-stay",
        placeId: "moment-mansion",
        time: "16:20",
        role: "main",
        note: "先 check-in、放行李，再出發聖水洞。",
      },
      {
        id: "s1-stop-haircut",
        placeId: "seongsu-haircut",
        time: "18:00",
        role: "main",
        note: "預約最晚開始時間，剪完後可視體力決定是否夜買。",
      },
      {
        id: "s1-stop-sura",
        placeId: "sura-gejang-seoul",
        time: "20:30",
        role: "main",
        note: "首爾第一晚晚餐，明洞 Sura Gejang 醬油蟹，地址為中區 明洞10街 18 2樓。",
      },     
      {
        id: "s1-stop-the-ot",
        placeId: "dioteu-dongdaemun",
        time: "22:30",
        role: "option",
        note: "夜買第一站，若太累可縮短或略過。",
        groupId: "s1-night-shopping-flex",
      },
      {
        id: "s1-stop-nujyon",
        placeId: "nujyon-dongdaemun",
        time: "22:45",
        role: "option",
        note: "與 The OT 連看最順，兩者擇其一亦可。",
        groupId: "s1-night-shopping-flex",
      },
    ],
  },
  {
    id: "seoul-day-2",
    label: "Day 5",
    dateLabel: "5/22（五）",
    area: "忠武路・江南・新沙・狎鷗亭・清潭",
    theme: "生日線",
    summary:
      "以上午古好齋傳統宮廷茶點體驗作為具儀式感的開始，之後前往江南一帶銜接 SUPERPAN 生日午餐；下午保留 café、beauty、換衫與休息緩衝，晚上以 Original Numbers 清潭作為慶祝晚餐主角。狎鷗亭散步後如肚子有空間，可順道去面首爾。",
    bookings: [],
    optionGroups: [
      {
        id: "s2-birthday-flex",
        title: "生日慢逛緩衝",
        description:
          "午餐與晚餐之間保留 café、選物與 beauty 時間，讓生日線保持從容。",
        accent: "rose",
      },
      {
        id: "s2-myeon-seoul-option",
        title: "狎鷗亭散步後餐廳選項",
        description:
          "狎鷗亭散步線後如肚子有空間，可考慮面首爾（新沙洞 666-8）。",
        accent: "mint",
      },
    ],
    stops: [
      {
        id: "s2-stop-goryo-tea",
        placeId: "goryo-house-tea",
        time: "11:00",
        role: "main",
        note: "上午先安排古好齋傳統宮廷茶點體驗，作為生日當天較有儀式感的開始；之後再前往江南一帶銜接 SUPERPAN 午餐。",
      },
      {
        id: "s2-stop-myeon-seoul",
        placeId: "myeon-seoul",
        time: "12:00",
        role: "option",
        note: "狎鷗亭散步後如肚子有空間才去，不強制。",
        groupId: "s2-myeon-seoul-option",
      },
      {
        id: "s2-stop-superpan",
        placeId: "superpan-seoul",
        time: "12:45",
        role: "main",
        note: "生日午餐固定保留，不建議再塞第二頓正式主餐。",
      },
      {
        id: "s2-stop-cafe-beauty",
        placeId: "sinsa-apgujeong",
        time: "14:30",
        role: "main",
        note: "Café / Beauty / 逛店彈性時段，不塞遠點。",
      },
      {
        id: "s2-stop-original-numbers",
        placeId: "original-numbers-cheongdam",
        time: "19:00",
        role: "main",
        note: "慶祝晚餐主角，建議當日夜段只圍繞這頓安排。",
      },
    ],
  },
  {
    id: "seoul-day-3",
    label: "Day 6",
    dateLabel: "5/23（六）",
    area: "廣藏市場・明洞・忠武路・弘大",
    theme: "廣藏 / 明洞 / 弘大線",
    summary:
      "中午前後前往明洞 Congdu 午餐，下午可考慮去做美容然後轉往弘大，整晚留給商店街、小店、café。",
    bookings: [],
    optionGroups: [
      {
        id: "s3-night-food-flex",
        title: "弘大晚餐 / 宵夜",
        description:
          "晚上以小食型為主，即興決定。孔陵一隻雞或明星一隻雞可作備選，但不建議硬塞。",
        accent: "mint",
      },
    ],
    stops: [
      {
        id: "s3-stop-congdu",
        placeId: "kongdu-myeongdong",
        time: "12:00",
        role: "main",
        note: "Congdu 明洞午餐，12:00 入座，地址為明洞一街 59-1。",
      },
      {
        id: "s3-stop-hongdae",
        placeId: "hongdae-street",
        time: "15:45",
        role: "main",
        note: "下午轉往弘大，整晚留給弘大商店街 / 小店 / Café / 夜場。",
      },
      {
        id: "s3-stop-gongneung",
        placeId: "gongneung-dak-sinchon",
        time: "20:00",
        role: "option",
        note: "若當晚想吃得更完整，或需要補回一隻雞，可作候補。",
        groupId: "s3-night-food-flex",
      },
      {
        id: "s3-stop-myeongseong-seoul",
        placeId: "myeongseong-dak-seoul",
        time: "20:15",
        role: "option",
        note: "明星一隻雞首爾候選，視體力安排，不建議硬塞。",
        groupId: "s3-night-food-flex",
      },
    ],
  },
  {
    id: "seoul-day-4",
    label: "Day 7",
    dateLabel: "5/24（日）",
    area: "永登浦・金浦・新浦・仁川機場",
    theme: "離境日",
    summary:
      "離境日採地理順路版：住宿出發 → 永登浦 Time Square 動物園 → 金浦國立航空博物館 → 新浦國際市場晚餐 → 仁川機場。方向由市中心一路往西，22:30 起飛，建議 20:30 前到達仁川機場。",
    bookings: [
      {
        id: "s4-aviation-closing",
        time: "18:00",
        title: "國立航空博物館關門",
        kind: "transport",
        locked: true,
        district: "金浦機場附近",
        note: "最遲 16:15 前入場，約留 1.5–1.75 小時。17:45 開始收尾出館。",
        relatedPlaceId: "national-aviation-museum",
      },
      {
        id: "s4-airport-window",
        time: "20:30",
        title: "抵達仁川機場",
        kind: "transport",
        locked: true,
        district: "仁川機場",
        note: "22:30 起飛，建議 20:30 前到達，處理 check-in / 寄艙 / 退稅 / 安檢。20:10 前離開新浦。",
      },
    ],
    optionGroups: [
      {
        id: "s4-luggage-strategy",
        title: "行李處理策略",
        description:
          "全日帶行李，優先在 Time Square 找置物櫃。航空博物館現場處理。",
        accent: "amber",
      },
      {
        id: "s4-yeongdeungpo-flex",
        title: "永登浦補逛彈性",
        description:
          "Time Square 地下街只在時間順利時短暫補逛，不是當日主角。15:20 前必須離開永登浦。",
        accent: "sky",
      },
    ],
    stops: [
      {
        id: "s4-stop-checkout",
        placeId: "moment-mansion",
        time: "10:15",
        role: "main",
        note: "Check-out，帶行李（包括綿被）出發。",
      },
      {
        id: "s4-stop-zoolung",
        placeId: "jureongjureong-yeongdeungpo",
        time: "13:20",
        role: "main",
        note: "控制在 1.5–2 小時內，15:10 開始收尾，15:20 前離開永登浦。",
      },
      {
        id: "s4-stop-timesquare",
        placeId: "times-square-yeongdeungpo",
        time: "15:10",
        role: "main",
        note: "只在時間順利時短暫補逛，15:20 前必須離開永登浦。",
      },
      {
        id: "s4-stop-aviation",
        placeId: "national-aviation-museum",
        time: "16:05",
        role: "main",
        note: "最遲 16:15 前入場，約留 1.5–1.75 小時，17:45 開始收尾。",
      },
      {
        id: "s4-stop-unsi-dinner",
        placeId: "unsi-station-dinner",
        time: "18:50",
        role: "main",
        note: "新浦國際市場晚餐，仁川中區新浦洞 6-6，即場選擇，20:10 前必須離開。",
      },
      {
        id: "s4-stop-airport",
        placeId: "unsi-station-dinner",
        time: "20:30",
        role: "main",
        note: "抵達仁川機場，處理 check-in / 寄艙 / 退稅 / 安檢。22:30 起飛。",
      },
    ],
  },
];


const citySubtitlePatch: Record<string, string> = {
  busan:
    "釜山是一座很適合沿海走訪的城市。南浦和富平保留了舊城區的市場氣氛，影島、松島和海雲台則展現出不同面向的海岸風景。這趟行程會在街區、美食和海景之間取得平衡。",
  seoul:
    "首爾的行程集中在幾個容易逛、容易吃的街區。江南與清潭偏精緻，明洞和弘大較熱鬧，永登浦與金浦一帶則適合放在離境日前順路走訪。",
};

const dayThemePatch: Record<string, string> = {
  "busan-day-1": "南浦與影島",
  "busan-day-2": "松島與東釜山",
  "busan-day-3": "甘川與海雲台",
  "busan-day-4": "釜山收尾與北上首爾",
  "seoul-day-1": "抵達首爾",
  "seoul-day-2": "忠武路、江南與清潭",
  "seoul-day-3": "廣藏、明洞與弘大",
  "seoul-day-4": "永登浦、金浦與離境",
};

const daySummaryPatch: Record<string, string> = {
  "busan-day-1":
    "第一天以南浦、富平和影島為主。早上先在舊城區吃早餐、逛市場，中午到影島用餐，下午視天氣與體力加入海景 café、漢堡或太宗台飛索。晚上前往鑽石灣遊艇，從港灣一帶看釜山夜景。",
  "busan-day-2":
    "這天集中在松島和東釜山一帶。早上安排松島海上纜車和龍宮雲橋，之後前往 Skyline Luge，中午在機張吃炸醬麵。下午留給釜山樂天世界，晚上可選松亭或海雲台一帶用餐。",
  "busan-day-3":
    "第三天由甘川洞開始，上午安排韓服和村內散步，中午於甘川或南浦一帶簡單用餐。下午轉往海雲台，安排 Dyupeullit、Busan X the SKY 和 16:00 膠囊列車，晚上到 ClubD Oasis 休息。",
  "busan-day-4":
    "早上留在南浦、富平或影島一帶補回未完成的小店與餐點，中午前往釜山站乘 KTX 北上首爾。抵達後先到住宿 check-in，傍晚前往聖水洞剪頭髮，晚上明洞 Sura Gejang 醬油蟹。",
  "seoul-day-1":
    "KTX 抵達首爾後先前往住宿放下行李，傍晚到聖水洞剪頭髮。完成後若時間和體力許可，可到東大門一帶短暫夜逛。",
  "seoul-day-2":
  "生日當天以上午古好齋傳統宮廷茶點體驗作為具儀式感的開始，之後前往江南一帶銜接 SUPERPAN 生日午餐；下午保留 café、beauty、換衫與休息緩衝，晚上以 Original Numbers 清潭作為慶祝晚餐主角。",
  "seoul-day-3":
    "中午前後前往明洞 Congdu 午餐，下午可考慮去做美容然後轉往弘大，整晚留給商店街、小店、café。",
  "seoul-day-4":
    "離境日由市中心逐步往西移動。下午前往永登浦和金浦國立航空博物館，傍晚到新浦國際市場吃晚餐，晚上前往仁川機場。",
};

const placeDescriptionPatch: Record<string, string> = {
  "eggdrop-nampo":
    "Egg Drop 在韓國多個城市都有分店，南浦店位置方便，適合早上簡單吃一份雞蛋吐司，再開始附近行程。",
  "bupyeong-market":
    "富平罐頭市場由傳統市場發展而成，現在仍能看到熟食、小食和本地採買的混合景象。早上較容易慢慢走，晚上則氣氛更熱鬧。",
  milgot:
    "Milgot 是富平一帶的小型糕點店，以紅豆、麵皮和傳統風味糕點較受留意。熱門款式售完時間不一，早一點前往會較穩妥。",
  "busan-stay-chungmu":
    "住宿位於西區與松島之間，連接南浦、松島和釜山站都算方便。行程中多個早晚段落都可由這裡作為出發或休息點。",
  "luggage-storage-101":
    "101 大廈的行李寄存點位於南浦與富平一帶，適合抵達釜山後先放下行李，再輕鬆開始舊城區行程。",
  "myeongseong-one-dak":
    "Myeongseong 一隻雞位於影島，主打韓式一隻雞料理。熱湯、雞肉和配料組合簡單直接，適合作為中午較完整的一餐。",
  "jeongseong-sikdang":
    "精誠食堂是南浦一帶可考慮的韓式餐廳，適合想留在舊城區用餐時作為替代選擇。",
  "solsot-nampo":
    "SOLSOT 以韓式鍋飯類餐點為主，南浦店位置方便。若想在附近吃一頓較安定的正餐，可把它列入候選。",
  "taejongdae-zipline":
    "太宗台高空滑索位於影島東南端一帶，體驗以海岸景觀和高空滑行為特色。天氣和排隊情況會直接影響體驗感。",
  "burger-yo":
    "Burger Yo 是影島一帶較有特色的漢堡店，海鮮口味漢堡是較突出的選擇，比一般漢堡店多一點釜山海港城市的味道。",
  bielleu:
    "Bielleu 位於影島海邊一帶，店內視野以海景為賣點。若天氣好，二樓座位的景觀會比餐點本身更令人留下印象。",
  "songdo-cable-car":
    "松島海上纜車跨越海面，可俯瞰松島海岸、岩石景觀和城市邊緣。天氣晴朗時，海面顏色和視野都會更開闊。",
  "songdo-yonggung":
    "松島龍宮雲橋位於纜車一帶，可近距離看海岸岩石和海面景色。路線不長，適合在松島行程中短暫停留。",
  "diamond-bay-yacht":
    "鑽石灣遊艇從港灣一帶出發，可從海上欣賞釜山的城市線和夜色。傍晚至入夜時段視野較有層次，也較適合拍照。",
  busandaek:
    "Busandaek 位於廣安里一帶，主打烤肉類餐點。若晚上轉到廣安里，這間是可優先考慮的晚餐選擇。",
  "cheongsan-1954":
    "青山1954 是廣安里一帶的韓式餐廳，餐點以章魚、藥材湯底和白切肉等組合為特色。適合想吃得較豐富的一晚。",
  "skyline-luge":
    "Skyline Luge Busan 是東釜山的人氣體驗設施，以下坡滑車為主，節奏輕快，適合安排在上午或中午前後。",
  "gungnam-jajangmyeon":
    "龍宮炸醬麵位於機張一帶，餐點以炸醬麵和中式韓餐為主。若當日集中在東釜山活動，位置上相當順路。",
  "lotte-world-busan":
    "釜山樂天世界位於東釜山，是釜山較大型的主題樂園。園區設施集中，適合預留一段完整時間慢慢玩。",
  "dongbusan-outlet":
    "東釜山 Outlet 鄰近樂天世界和機張一帶，品牌店和商場空間集中。若時間順利，可作為東釜山行程中的短暫購物點。",
  rapseu:
    "Rapseu 位於松亭海邊一帶，店內空間明亮，部分座位可看到海景。餐點以豬肉料理為主，適合安排作東釜山行程後的晚餐。",
  kkotgedang:
    "辛舍 Kkotgedang 海雲台站以醬油蟹、醬油蝦等海鮮料理為特色。位置接近海雲台站，適合放在海雲台一帶用餐。",
  "geumsu-bokguk":
    "錦繡河豚湯海雲台總店是當地有名的河豚湯店，湯品選擇清爽，適合想吃熱湯或較輕身晚餐的時候。",
  "busan-eel":
    "釜山鰻魚位於海雲台中洞一帶，是海雲台晚餐的其他可考慮選項之一，適合想換換口味時切入。",
  "songjeong-3dae":
    "松亭3代湯飯是湯飯類餐廳資料之一，雖然位置未必與主線完全重合，但可保留作釜山餐廳資料庫中的補充選項。",
  "gamcheon-hanbok":
    "甘川浪漫韓服位於甘川文化村一帶，適合配合村內彩色房屋、階梯和壁畫拍照。上午前往通常較容易安排後續行程。",
  "haeon-hanbok":
    "HAEON 是海雲台一帶的韓服租借選項，位置與甘川文化村不同。若之後改以海雲台為拍照區域，可再作比較。",
  "ibgogage-hanbok":
    "ibgogage 提供韓服或制服體驗，屬於釜山韓服租借的備選資料。適合保留作日後比較不同風格和地點之用。",
  "cheolsu-yeongchae-hanbok":
    "哲秀與英采韓服租借是韓服體驗備選之一，可作為比較店舖風格、價格和位置時的資料。",
  "gamcheon-flipbook":
    "甘川洞手翻書是村內較有趣的小型體驗，可把短片或相片做成手翻書效果。排隊時間不長時較適合加入。",
  dyupeullit:
    "Dyupeullit 位於海雲台 Haeridan-gil 一帶，主打精緻蛋糕和甜點。草莓蛋糕是較受留意的款式，售完時間不固定，適合下午較早時段前往。",
  "momoseu-marine-city":
    "Momoseu 是韓國具代表性的咖啡品牌之一，Marine City 分店帶有海雲台一帶較開闊的城市感。適合想在行程中加入一杯好咖啡時考慮。",
  "goraesa-fishcake":
    "高萊沙魚糕是釜山具代表性的魚糕品牌，海雲台店位置方便。可作為路過時的小食補充，也適合買來簡單試味。",
  "capsule-train":
    "海雲台藍線公園膠囊列車連接尾浦與青沙浦，路線沿海而行。車廂速度不快，適合留意沿途海岸、鐵道和小漁港景色。",
  "haeundae-coast-train":
    "海雲台海岸列車與膠囊列車同屬藍線公園路線，沿途連接青沙浦、尾浦等海岸站點。作為區域接駁也相當方便。",
  "haewol-observatory":
    "海月展望台位於青沙浦一帶，可近距離看海岸與橋身景觀。與膠囊列車路線相近，適合下車後短暫走訪。",
  "xthe-sky":
    "Busan X the SKY 位於海雲台高樓之上，可從高處俯瞰海灘、城市和廣安大橋一帶。玻璃地板和高空視角是這裡較具記憶點的部分。",
  "starbucks-haeundae":
    "X the SKY 周邊及同棟星巴克適合在海雲台高空景點前後稍作休息。若需要等候或整理行程，這一帶會比較方便。",
  "arte-museum-busan":
    "Arte Museum 釜山是沉浸式媒體藝術展館，以光影、聲音和大型影像空間為特色。若下午時間充裕，可作為海雲台區內的室內選項。",
  "arte-museum-gwangan":
    "Arte Museum 廣安分館同樣以沉浸式光影藝術為特色，位於廣安里一帶，可作 Day 1 晚間其他可考慮行程。",
  "chopilssal-gwangan":
    "Chopilssal 廣安直营店位於水營區民樂洞，主打豬燒烤，五花肉與豬皮外脆內軟，是廣安里晚餐的其他可考慮選項。",
  "tonsyou-gwangan":
    "Tonsyou Gwangan 店位於廣安里民樂洞一帶，可作 Day 1 晚餐其他可考慮選項。",
  "mudflat-shellfish-gwangan":
    "泥灘貝殼廣安里店位於水營區民樂洞，以貝殼海鮮料理為主，是廣安里晚餐的其他可考慮選項。",
  "clubd-oasis":
    "ClubD Oasis 位於海雲台一帶，整體環境較新，風格比傳統汗蒸幕更現代。適合安排在海雲台行程之後，作為晚上休息點。",
  mipojip:
    "Mipojip 海雲台總店以海鮮料理為主，評價集中在醬料和海鮮新鮮度。店舖人氣高，用餐時段可能需要較長等候。",
  "dae-galbi-haeundae":
    "傳說牛肉 Dae 排骨位於海雲台一帶，以牛肉燒烤和大排骨類餐點為特色。若當晚想吃烤肉，可作為附近候選。",
  "whos-who-mumu":
    "Who's who Mumu 是海雲台一帶的西餅店，蛋糕款式較精緻。適合在晚餐前後順路買甜點。",
  beuroni:
    "Beuroni 是海雲台區內的 café 資料之一，適合作為附近散步時的備用休息點。",
  "the-art-cafe":
    "The Art 咖啡位於海雲台一帶，Kaymak 吐司是較有特色的品項。喜歡奶香味甜點或吐司類餐點的話，可列入備選。",
  "oryukdo-skywalk":
    "五六島 Skywalk 位於釜山南區，可看到海岸、島嶼和透明步道景觀。位置與松島不同，較適合在移動日或有空檔時前往。",
  "onbap-jeonpo":
    "On飯 Jeonpo 店位於田浦一帶，以家庭式定食和烤魚類餐點為特色。若想吃一頓穩定的韓式午餐，這間相當合適。",
  gowon:
    "Gowon 位於田浦，店內以韓式烤肉和豬皮等餐點較受留意。本地客比例較高，氣氛會比觀光區餐廳更貼近日常。",
  "mirye-soup-rice":
    "Mirye 湯飯 Jeonpo 總店主打豬肉湯飯和冷切肉。湯品路線相對樸實，適合想吃熱湯和米飯的一餐。",
  "your-type-jeonpo":
    "Your Type Jeonpo 是田浦一帶的 café 選項，位置適合配合附近餐廳或小店散步。若想在田浦短暫停留，可以順路加入。",
  lasoop:
    "LASOOP 位於西面一帶，店內裝潢偏打卡型，夜晚燈光效果較突出。適合保留作西面夜間 café 選項。",
  bujebi:
    "Bujebi 位於田浦，餐點帶有較強的韓式調味，湯品和煎餅類都具特色。適合想試一間較不標準觀光路線的餐廳。",
  "eighty-three-haechi":
    "83Haechi 是釜田一帶的燒肉店資料，評語集中在肉質和燒肉體驗。可保留作日後想吃燒肉時的候選。",
  "yeongjin-gukbap":
    "Yeongjin 豬肉湯飯位於南區，位置不算緊貼主要景點，但以豬肉湯飯評價較突出。若行程經過附近，可作為湯飯選項。",
  chopilssal:
    "Chopilssal 是廣安里一帶的豬燒烤店，評語集中在五花肉和豬皮。由於等候時間可能較長，目前較適合保留作資料參考。",
  "running-man-busan":
    "Running Man 體驗館是釜山 Pass 類型的室內活動之一，以遊戲關卡和互動體驗為主。若遇上雨天或臨時改行程，可再考慮。",
  "museum-one":
    "Museum 1 是釜山的媒體藝術展館之一，曾列入早段候選。現時不放入主線，但可保留作已比較資料。",
  "spa-land":
    "Spa Land Centum City 是釜山知名汗蒸幕之一，位於新世界百貨 Centum City 內。由於人流和偏好因素，目前只作比較資料保留。",
  hillspa:
    "Hillspa 位於海雲台一帶，走較傳統的汗蒸幕和休息空間路線。若偏好安靜休息型場所，可作為比較選項。",
  "aqua-palace":
    "Hotel Aqua Palace Spa & Sauna 位於廣安里一帶，可看到海邊區域的城市景觀。現時作為汗蒸幕候選資料保留。",
  "seven-theme-cafe":
    "Seven Theme Cafe 位於廣安里一帶，曾列入海景動物 café 候選。現時不放入釜山主線，僅保留作刪除資料。",
  "moment-mansion":
    "Moment Mansion 位於東大門與黃鶴洞一帶，適合連接東大門夜間購物、新堂用餐和市中心移動。首爾段多數早晚行程都可由此出發。",
  "deepin-sindang":
    "Deepin 新堂位於新堂站一帶，距離東大門住宿區不遠。適合抵達首爾後安排一頓不需大幅轉場的晚餐。",
  "dioteu-dongdaemun":
    "The OT / Dioteu 是東大門一帶的時裝批發商城，夜間營業氣氛較明顯。適合想看韓國服飾批發和夜買文化時前往。",
  "nujyon-dongdaemun":
    "Nujyon 位於東大門商圈，與 The OT 可連同安排。商場以服飾批發和女裝款式為主，適合夜間短逛。",
  "sinsa-apgujeong":
    "新沙與狎鷗亭一帶集合選物店、café、服飾店和街區散步路線。白天走訪較舒服，也方便接續清潭或江南餐廳。",
  "myeon-seoul":
    "面首爾位於新沙洞，是狎鷗亭散步線後的餐廳選項。如肚子有空間才去，不強制安排。",
  "superpan-seoul":
    "SUPERPAN 位於江南區，餐廳風格較精緻，適合安排作新沙、狎鷗亭或清潭一帶的午餐。",
  "original-numbers-cheongdam":
    "Original Numbers 位於清潭，區域本身餐廳和選物店較集中。適合作為江南一帶行程後的晚餐選擇。",
  "myeongdong-walk":
    "明洞與乙支路一帶適合購物、吃飯和短暫 café 停留。街區密度高，無論午餐前後都容易安排。",
  "sura-gejang-seoul":
    "Sura Gejang 位於明洞，主打醬油蟹和蟹料理。位置在市中心，適合配合明洞、乙支路或忠武路一帶行程。",
  "amton-hongdae":
    "AMTON 位於弘大一帶，屬美容室資料。若當日安排美容或造型項目，可配合弘大下午至晚上的行程。",
  "hongdae-street":
    "弘大商店街一帶集合小店、服飾、街頭小食和夜間人流。下午至晚上都適合自由散步。",
  "gongneung-dak-sinchon":
    "孔陵一隻雞新村一帶分店可作晚餐備選。若當晚在弘大、新村附近活動，位置上較容易銜接。",
  "kongdu-myeongdong":
    "Congdu 明洞位於明洞一街，是離境日午餐主角。13:20 入座，之後往永登浦方向移動。",
  "jureongjureong-yeongdeungpo":
    "Jureongjureong 永登浦店是室內動物互動型設施，位於 Time Square 一帶。適合與永登浦商場行程一併安排。",
  "times-square-yeongdeungpo":
    "Time Square 是永登浦的大型商場，集合購物、餐飲和室內活動。若時間有餘，可在動物園前後短暫補逛。",
  "myeongseong-dak-seoul":
    "明星一隻雞是首爾一隻雞餐廳候選，分店或具體位置仍可再確認。若之後想在首爾補吃一隻雞，可放入晚餐備選。",
  "seongsu-haircut":
    "聖水洞是首爾近年較受歡迎的街區之一，聚集 café、選物店和髮型店。若已預約剪髮，需預留洗剪和造型時間。",
  "gwangjang-market":
    "廣藏市場是首爾具代表性的傳統市場，布料、棉被、熟食和小食都集中在同一區域。早上前往選擇通常較充足。",
  "goryo-house-tea":
    "古好齋是傳統宮廷茶點體驗，適合安排在生日當天上午，作為較有儀式感而安靜的開始。體驗後可轉往江南一帶，銜接 SUPERPAN 午餐與下午的 café、beauty 緩衝。",
  "national-aviation-museum":
    "國立航空博物館位於金浦機場附近，館內以航空歷史、飛行器和互動展示為主。因閉館時間較早，下午入場需留意時間。",
  "unsi-station-dinner":
    "新浦國際市場位於仁川中區新浦洞，是離境前最後一餐的用餐地點。市場一帶選擇多元，即場決定即可，20:10 前必須離開。",
};

const optionGroupDescriptionPatch: Record<string, string> = {
  "d1-west-bites":
    "午餐後可留在影島一帶，按時間加入漢堡、海景 café 或太宗台飛索。",
  "d1-taejongdae-branch":
    "飛索較受天氣和排隊時間影響，現場情況合適時再前往。",
  "d1-evening-food":
    "遊艇約 20:45–21:00 結束，之後可視情況轉到廣安里晚餐。",
  "d1-other-options":
    "廣安里一帶另可考慮：Chopilssal 豬燒烤、Tonsyou Gwangan 店、泥灘貝殼廣安里店，或 Arte Museum 沉浸式展覽。",
  "d2-east-side-evening":
    "晚上可在松亭或海雲台一帶選一間餐廳，避免再作太多轉場。",
  "d2-east-side-nearby":
    "若樂園後仍有時間，可短暫加入附近商場或順路景點。",
  "d2-fallback-rules":
    "若早上行程延誤，可先略過龍宮雲橋，並縮短 Outlet 或其他補充點時間。",
  "d2-haeundae-dinner-options":
    "海雲台晚餐另可考慮釜山鰻魚、Kkotgedang 醬油蟹或锦绣河豚汤，視當日位置與體力選擇。",
  "d3-pre-train-buffer":
    "膠囊列車前集中在海雲台區內活動，15:20 左右開始往尾浦站移動。",
  "d3-post-capsule":
    "青沙浦下車後短暫看海和拍照，再接回海雲台方向。",
  "d3-dinner-light":
    "ClubD 前不安排長時間晚餐，可用魚糕、便利店或輕食簡單補充。",
  "d3-haeundae-dinner-options":
    "ClubD 後若仍有食慾，海雲台一帶可考慮釜山鰻魚、Kkotgedang、锦绣河豚汤、Mipojip 或 Dae 排骨等。",
  "d4-soft-landing":
    "早上留給南浦、富平或影島一帶，補回前幾天未完成的小店和餐點。",
  "d4-seoul-night-shopping":
    "抵達首爾後若仍有精神，可在東大門一帶短暫夜逛。",
  "s1-night-shopping-flex":
    "到達日晚上可視體力安排東大門夜買，時間不夠時保留一間即可。",
  "s2-birthday-flex":
    "午餐與晚餐之間留給 café、選物店和整理時間，行程集中在江南一帶。",
  "s2-myeon-seoul-option":
    "狎鷗亭散步後如肚子有空間，可順道去面首爾（新沙洞 666-8），不強制。",
  "s3-duvet-handling":
    "買完綿被後先回住宿放下；若店舖可壓縮包裝，對後續行李會更方便。",
  "s3-night-food-flex":
    "弘大晚上以自由逛街和小食為主，若想吃正餐，可加入一隻雞候選。",
  "s4-luggage-strategy":
    "離境日需帶同行李移動，可優先在 Time Square 尋找置物櫃，餐廳和博物館則視現場安排。",
  "s4-yeongdeungpo-flex":
    "Time Square 和地下街只作短暫補逛，15:20 前宜離開永登浦。",
};

const bookingNotePatch: Record<string, string> = {
  "d1-luggage":
    "3F 304室，營業時間 08:30–22:00。若抵達時間配合，可先寄存行李再到南浦一帶早餐。",
  "d1-checkin":
    "地址為 Busan Seo-gu Chungmu-daero 120。下午回住宿整理，預留時間前往晚上遊艇報到。",
  "d1-yacht-booking":
    "19:30 開船，建議提前 30–40 分鐘到達報到位置。Busan Pass 預計由這段開始使用。",
  "d1-pass":
    "Pass 由遊艇出發時段開始計算，Day 3 晚上 ClubD Oasis 需留意尾段使用時間。",
  "d3-capsule-booking":
    "16:00 膠囊列車已預約，建議 15:40–15:45 前抵達尾浦站。",
  "d3-clubd-window":
    "建議 18:35–18:45 前完成 ClubD Oasis 入場，以保留 Pass 尾段使用空間。",
  "d4-ktx":
    "建議乘坐 12:30–13:00 時段 KTX，車程約 2.5 小時。抵達首爾後仍需預留 check-in 和前往聖水洞時間。",
  "s1-arrive-window":
    "KTX 車程約 2.5 小時，實際時間視班次而定。抵達首爾站後先前往住宿。",
  "s1-haircut-lock":
    "聖水洞剪髮預約最晚開始時間為 18:00。洗剪和造型後約 20:30 可安排晚餐；若加染或燙，晚餐時間需再調整。",
  "s4-aviation-closing":
    "國立航空博物館 18:00 關門，最遲 16:15 前入場較穩妥，17:45 左右開始準備離開。",
  "s4-airport-window":
    "22:30 起飛，建議 20:30 前到達仁川機場，預留 check-in、寄艙、退稅和安檢時間。20:10 前離開新浦。",
};

const stopNotePatch: Record<string, string> = {
  "d1-stop-luggage":
    "若抵達時間配合，可先在南浦一帶寄存行李，再輕鬆開始第一段行程。",
  "d1-stop-eggdrop":
    "先在南浦吃一份簡單熱食，之後步行或短程移動到富平一帶。",
  "d1-stop-bupyeong":
    "市場適合慢慢走一圈，看到想試的小食再買，不用預設太多必吃項目。",
  "d1-stop-milgot":
    "Milgot 熱門款式有機會售罄，早一點前往會比較穩妥；若錯過，可留到 Day 4 再補。",
  "d1-stop-myeongseong":
    "中午到影島用餐，地址為影島區 絶影路 22 1樓。",
  "d1-stop-burgeryo":
    "若午餐後仍有時間，可在影島一帶補入這間特色漢堡店。",
  "d1-stop-bielleu":
    "與 Burger Yo 同在影島一帶，天氣好時可考慮停留看海。",
  "d1-stop-taejongdae":
    "太宗台飛索受天氣和排隊情況影響較大，現場情況合適再加入。",
  "d1-stop-checkin":
    "下午回住宿稍作整理，預留時間準備晚上遊艇行程。",
  "d1-stop-yacht":
    "19:30 開船，建議提前 30–40 分鐘到達報到位置。Busan Pass 由這段開始使用。",
  "d1-stop-busandaek":
    "遊艇結束後若仍想吃晚餐，可轉到廣安里一帶用餐。",
  "d1-stop-cheongsan":
    "若 Busandaek 不合適，可改選同區的青山1954。",
  "d1-stop-chopilssal-gwangan":
    "廣安里其他可考慮晚餐選項，豬燒烤風格，排隊時間可能較長。",
  "d1-stop-tonsyou":
    "廣安里其他可考慮晚餐選項之一，與 Chopilssal 同區。",
  "d1-stop-mudflat":
    "廣安里貝殼海鮮，其他可考慮晚餐，地址為民樂洞 176-18。",
  "d1-stop-arte":
    "Arte Museum 沉浸式展覽，廣安里其他可考慮行程，視時間與興趣補入。",
  "d2-stop-cable-car":
    "早上先到松島坐海上纜車，天氣好時海岸線視野會比較開闊。",
  "d2-stop-yonggung":
    "纜車後可順路短停龍宮雲橋；若人多或天氣不佳，可直接略過。",
  "d2-stop-luge":
    "前往東釜山後先玩 Skyline Luge，時間控制得宜會較容易接續午餐和樂園。",
  "d2-stop-jajang":
    "午餐安排在機張一帶，吃完可直接轉往樂天世界。",
  "d2-stop-lotte":
    "下午留給樂園，優先挑想玩的設施和園區路線。",
  "d2-stop-outlet":
    "若離開樂園後仍有時間，可在 Outlet 短暫逛一圈。",
  "d2-stop-rapseu":
    "若晚上想留在松亭一帶用餐，Rapseu 是較值得預留時間的一間。",
  "d2-stop-kkotgedang":
    "若想改吃醬油蟹，可把晚餐轉到海雲台站附近。",
  "d2-stop-geumsu":
    "若這晚想吃得清爽一點，可選河豚湯作晚餐。",
  "d2-stop-busan-eel":
    "釜山鰻魚位於海雲台中洞，是 Day 2 海雲台晚餐其他可考慮選項。",
  "d3-stop-hanbok":
    "上午先處理妝髮和韓服，再在甘川洞一帶慢慢拍照和散步。",
  "d3-stop-flipbook":
    "若排隊時間約 25–30 分鐘內，可以順路加入；排太久則略過。",
  "d3-stop-lunch-light":
    "中午在甘川或南浦一帶簡單用餐，避免下午海雲台行程太趕。",
  "d3-stop-dyupeullit":
    "草莓蛋糕較適合下午早段前往，地址為海雲台區 佑洞 533-3。",
  "d3-stop-xthe-sky":
    "到高處看海雲台一帶景色，短暫停留拍照和看玻璃地板即可。",
  "d3-stop-goraesa-pre":
    "前往尾浦站途中可順路買魚糕，作為簡單小食。",
  "d3-stop-capsule":
    "16:00 班次已預約，15:40–15:45 前抵達尾浦站較穩妥。",
  "d3-stop-haewol":
    "抵達青沙浦後可短暫到展望台看海，不宜停留太久。",
  "d3-stop-coast-train":
    "以海岸列車接回海雲台方向，路線上會比重新轉車更順。",
  "d3-stop-goraesa-post":
    "ClubD 前可用魚糕、便利店或輕食簡單補充，不另排正式餐廳。",
  "d3-stop-clubd":
    "目標 18:35–18:45 前入場，保留 Pass 尾段使用時間。",
  "d3-stop-kkotgedang":
    "ClubD 後若仍有食慾，可考慮醬油蟹作宵夜。",
  "d3-stop-busan-eel":
    "ClubD 後海雲台鰻魚，其他可考慮晚餐選項。",
  "d3-stop-geumsu":
    "ClubD 後若想吃熱湯，可選河豚湯。",
  "d4-stop-bupyeong":
    "早上可在南浦或富平一帶輕鬆補買，不安排太遠的地點。",
  "d4-stop-milgot":
    "若 Day 1 未買到 Milgot，可在離開釜山前再試一次。",
  "d4-stop-burgeryo":
    "若 Day 1 未能安排 Burger Yo，可視時間和位置補入。",
  "d4-stop-to-station":
    "取回行李後前往釜山站，預留足夠時間處理 KTX 進站。",
  "d4-stop-seoul-checkin":
    "抵達首爾後先到住宿 check-in，地址為中區 退溪路87街 24-7 1樓。",
  "d4-stop-haircut":
    "聖水洞剪髮預約為 18:00，洗剪和造型後再前往晚餐。",
  "d4-stop-the-ot":
    "若晚上仍有精神，可到東大門一帶短暫逛街。",
  "d4-stop-nujyon":
    "可與 The OT 連同安排；時間不夠時二選一即可。",
  "s1-stop-stay":
    "抵達首爾後先到住宿放下行李，再前往聖水洞。",
  "s1-stop-sura":
    "首爾第一晚晚餐，明洞 Sura Gejang 醬油蟹，地址為中區 明洞10街 18 2樓。",    
  "s1-stop-the-ot":
    "晚餐後若仍想逛街，可先到 The OT 看一圈。",
  "s1-stop-nujyon":
    "Nujyon 與 The OT 可連同安排，時間不夠時擇一即可。",
  "s2-stop-goryo-tea":
    "上午先安排古好齋傳統宮廷茶點體驗，作為生日當天具儀式感的開始；之後預留交通時間前往江南 SUPERPAN。",
  "s2-stop-myeon-seoul":
    "狎鷗亭散步後如肚子有空間才去，不強制，地址為新沙洞 666-8。",
  "s2-stop-superpan":
    "中午到 SUPERPAN 用餐，之後可繼續留在江南一帶活動。",
  "s2-stop-cafe-beauty":
    "下午保留給 café、選物店或整理時間，不另安排太遠地點。",
  "s2-stop-original-numbers":
    "晚上到清潭用餐，建議預留充足交通和入座時間。",
  "s3-stop-gwangjang":
    "早上到廣藏市場買綿被，早一點前往通常選擇較多。",
  "s3-stop-return-duvet":
    "買完後先回住宿放下綿被，後面行程會輕鬆很多。",
  "s3-stop-sura":
    "中午在明洞用餐，地址為中區 明洞10街 18 2樓。",
  "s3-stop-hongdae":
    "下午轉往弘大，之後可自由安排小店、café 和晚餐。",
  "s3-stop-gongneung":
    "若晚上想吃一頓較完整的熱湯餐，可考慮新村一帶的一隻雞。",
  "s3-stop-myeongseong-seoul":
    "明星一隻雞可作同晚候選，視當日位置和體力決定。",
  "s4-stop-checkout":
    "早上退房後帶同行李出發，綿被也要一併處理。",
  "s4-stop-kongdu":
    "Congdu 明洞 13:20 入座，地址為明洞一街 59-1。",
  "s4-stop-zoolung":
    "動物園停留約 1.5–2 小時較剛好，15:10 左右開始收尾。",
  "s4-stop-timesquare":
    "若時間順利，可在 Time Square 或地下街短暫逛一圈。",
  "s4-stop-aviation":
    "最遲 16:15 前入場，約留 1.5–1.75 小時參觀。",
  "s4-stop-unsi-dinner":
    "新浦國際市場晚餐，仁川中區新浦洞 6-6，即場選擇，20:10 前必須離開。",
  "s4-stop-airport":
    "20:30 前抵達仁川機場，預留 check-in、寄艙、退稅和安檢時間。",
      "d4-stop-sura":
    "首爾第一晚晚餐，明洞 Sura Gejang 醬油蟹，地址為中區 明洞10街 18 2樓。",
  "s3-stop-congdu":
    "Congdu 明洞 13:20 入座，地址為明洞一街 59-1。",
};

const timelineDuplicateStopIds = new Set<string>([
  "d1-stop-luggage",
  "d1-stop-checkin",
  "d1-stop-yacht",
  "d3-stop-capsule",
  "d3-stop-clubd",
  "s1-stop-haircut",
  "s4-stop-aviation",
]);

const applyTripCopyPatch = (data: TripAppData): TripAppData => ({
  cities: data.cities.map((city) => ({
    ...city,
    subtitle: citySubtitlePatch[city.id] ?? city.subtitle,
    places: city.places.map((place) => ({
      ...place,
      description: placeDescriptionPatch[place.id] ?? place.description,
    })),
    days: city.days.map((day) => ({
      ...day,
      theme: dayThemePatch[day.id] ?? day.theme,
      summary: daySummaryPatch[day.id] ?? day.summary,
      bookings: day.bookings.map((booking) => ({
        ...booking,
        note: bookingNotePatch[booking.id] ?? booking.note,
      })),
      optionGroups: day.optionGroups.map((group) => ({
        ...group,
        description: optionGroupDescriptionPatch[group.id] ?? group.description,
      })),
      stops: day.stops
        .filter((stop) => !timelineDuplicateStopIds.has(stop.id))
        .map((stop) => ({
          ...stop,
          note: stopNotePatch[stop.id] ?? stop.note,
        })),
    })),
  })),
});

export const initialTripData: TripAppData = applyTripCopyPatch({
  cities: [
    {
      id: "busan",
      name: "釜山",
      subtitle:
        "釜山是韓國的海港重鎮，也是國內第二大城市，以壯麗的海岸線、多元的文化景觀和活力十足的都市氛圍聞名",
      status: "active",
      heroImage: BUSAN_HERO_URL,
      accent: "navy",
      places: busanPlaces,
      days: busanDays,
    },
    {
      id: "seoul",
      name: "首爾",
      subtitle:
        "首爾是韓國的首都與最大城市，也是其政治、經濟、文化中心，融合了朝鮮王朝的古老傳統與現代摩天大樓的科技感",
      status: "active",
      heroImage: SEOUL_HERO_URL,
      accent: "rose",
      places: seoulPlaces,
      days: seoulDays,
    },
  ],
});

