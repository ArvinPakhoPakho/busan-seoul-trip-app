/*
  Style reminder for presentation modeling:
  - Page structure must feel like a mobile travel app with clear sections, not a collapsible dashboard.
  - Suggested itinerary copy should read like an editorial travel guide in formal written Chinese.
  - Optional plans should live on dedicated pages instead of being mixed into the main suggested route.
*/

export type MainTabId = "itinerary" | "map" | "library" | "shopping" | "calculator";

export interface MainTabItem {
  id: MainTabId;
  label: string;
  shortLabel: string;
  icon: string;
}

export interface DayEditorialContent {
  dayId: string;
  heroTitle: string;
  heroSummary: string;
  featuredMoments: string[];
  optionalPageTitle: string;
  optionalPageSummary: string;
}

export interface CalculatorModule {
  id: "currency" | "split";
  title: string;
  description: string;
  inputLabels: string[];
}

export interface TipsSection {
  id: string;
  title: string;
  summary: string;
  items: string[];
}

export const MAIN_TABS: MainTabItem[] = [
  { id: "itinerary", label: "建議行程", shortLabel: "行程", icon: "🗓️" },
  { id: "map",       label: "地圖",     shortLabel: "地圖", icon: "🗺️" },
  { id: "library",   label: "完整點位庫", shortLabel: "點位", icon: "📍" },
  { id: "shopping",  label: "門票與購物", shortLabel: "購買", icon: "🎟️" },
  { id: "calculator",label: "計算機",   shortLabel: "計算", icon: "🧮" },
];

export const APP_EDITORIAL_TITLE = "七日韓國旅程精選路線";
export const APP_EDITORIAL_SUMMARY =
  "本行程把釜山與首爾兩段旅程整理成可切換的手機版規劃頁，結合海景、生日慶祝餐廳、購物動線、預約體驗、交通提示與靈活備選安排，讓旅程在清晰主線與臨場調整之間取得平衡。";

export const DAY_EDITORIAL_CONTENT: DayEditorialContent[] = [
  {
    dayId: "busan-day-1",
    heroTitle: "由南浦與松島展開旅程，從市場氣氛步入海岸景色。",
    heroSummary:
      "第一天以節奏輕鬆的暖身路線為主，先在市區享用早餐，再到富平市場感受釜山舊城區生活感，午後前往松島海上纜車與龍宮雲橋欣賞海岸景觀，晚上則保留遊艇與廣安里晚餐作為具儀式感的延伸安排。",
    featuredMoments: [
      "進市區後先吃早餐，作為旅程第一個輕鬆而穩定的起點。",
      "富平市場可感受在地街區氣氛，亦方便補買伴手禮與小食。",
      "乘坐松島海上纜車，可盡覽陽光下閃爍的蔚藍大海、奇岩怪石與翠綠景致。",
    ],
    optionalPageTitle: "Day 1 其他可考慮行程",
    optionalPageSummary:
      "此頁集中收納影島與廣安里周邊的可替換安排，包括海景咖啡店、午餐選項與晚餐備選，方便按抵達精神與當時狀態再作決定。",
  },
  {
    dayId: "busan-day-2",
    heroTitle: "以東釜山玩樂設施為主軸，兼顧海鮮與海景晚餐。",
    heroSummary:
      "第二天安排以設施體驗為核心，先處理機動性較高的 Skyline Luge 與東釜山區域，再把樂天世界保留作完整玩樂時段；中段以穩定海鮮餐廳控制節奏，晚上則可依體力在松亭與海雲台一帶選擇重點餐廳。",
    featuredMoments: [
      "Luge 與主題樂園相互配合，形成節奏鮮明的一天。",
      "機張海鮮安排以穩定用餐為原則，避免臨場排隊拖慢主線。",
      "松亭晚餐兼具海景與用餐質感，適合作為當日收尾。",
    ],
    optionalPageTitle: "Day 2 其他可考慮行程",
    optionalPageSummary:
      "此頁整理東釜山 Outlet、河豚湯、醬油蟹及其他海雲台晚餐替代方案，方便按天氣、排隊情況與體力即場調整。",
  },
  {
    dayId: "busan-day-3",
    heroTitle: "以膠囊列車預約時段為核心，串連甘川、海雲台與青沙浦景致。",
    heroSummary:
      "第三天以拍照與海岸景觀為主題，上午前往甘川文化村與韓服體驗，下午回到海雲台享用甜點，並以已預約的膠囊列車 16:00 時段作為全日重點，之後銜接海月展望台、海岸列車與高空觀景安排，形成連續而具層次的海岸線體驗。",
    featuredMoments: [
      "Dyupeullit 可作為進入海雲台區前的代表性甜點安排。",
      "膠囊列車為已確定預約項目，需作為當日最重要的時間節點。",
      "海月展望台、海岸列車與 X the SKY 可連成視覺亮點最集中的傍晚路線。",
    ],
    optionalPageTitle: "Day 3 其他可考慮行程",
    optionalPageSummary:
      "此頁收錄海雲台晚餐、咖啡、魚糕、甜品與館內型景點等備選內容，供當日視排隊時間、光線與體力再作取捨。",
  },
  {
    dayId: "busan-day-4",
    heroTitle: "把最後一天留給補漏與收尾，保留最舒適的離開節奏。",
    heroSummary:
      "最後一天不再安排過度密集的大型景點，而是以補漏與收尾為主，可在南區、西面、富平或釜山站周邊擇一重點區域完成最後想吃或想買的內容，並預留北上或轉場所需的從容時間。",
    featuredMoments: [
      "最後一天適合以一條簡潔主線完成補買、補吃或短時體驗。",
      "可視情況選擇富平市場、西面美食或南區海景其中一個方向。",
      "預留餘裕可令整段旅程的收尾更輕鬆完整。",
    ],
    optionalPageTitle: "Day 4 其他可考慮行程",
    optionalPageSummary:
      "此頁集中整合刺激活動、西面餐廳、咖啡店與汗蒸幕等最後一天備選，方便當時再選擇最合適的收尾方式。",
  },
  {
    dayId: "seoul-day-1",
    heroTitle: "把首爾第一晚收在東大門與新堂，維持最穩定的抵達節奏。",
    heroSummary:
      "到達首爾後先以東大門住宿安頓行李與休息，再前往明洞 Sura Gejang 完成晚餐主線，深夜若仍有精神，才把東大門夜買作為延伸支線，避免到達日一開始就拉得太滿。",
    featuredMoments: [
      "住宿、晚餐與夜買三段距離合理，適合在移動後保持節奏穩定。",
      "明洞 Sura Gejang 是到達日晚餐主線，應優先保留訂位與出發節奏。",
      "The OT 與 Nujyon 屬體力決定項，不必硬排成必做清單。",
    ],
    optionalPageTitle: "Day 4 其他可考慮行程",
    optionalPageSummary:
      "此頁集中整理東大門夜買與晚餐備位邏輯，方便按抵達時間、精神狀態與店家情況作彈性調整。",
  },
  {
    dayId: "seoul-day-2",
    heroTitle: "生日線維持江南節奏，以散步、午餐與晚餐構成完整儀式感。",
    heroSummary:
      "5/22 生日當天以新沙、狎鷗亭與清潭為主軸，白天保持慢逛、拍照與選物節奏，中午保留 SUPERPAN，晚間則以 Original Numbers 清潭作為生日晚餐重點。",
    featuredMoments: [
      "生日白天不宜塞過多硬性景點，散步感比打卡密度更重要。",
      "SUPERPAN 與 Original Numbers 應分別承接白天與夜晚的慶祝節奏。",
      "午晚餐之間需保留 café、beauty 與休息緩衝，讓整天更從容。",
    ],
    optionalPageTitle: "Day 5 其他可考慮行程",
    optionalPageSummary:
      "此頁集中保留生日午晚餐的訂位備援邏輯與江南線的慢逛彈性，方便臨場按狀態微調。",
  },
  {
    dayId: "seoul-day-3",
    heroTitle: "白天鎖在明洞，傍晚再轉弘大，讓雙區線保持乾淨俐落。",
    heroSummary:
      "這一天先以明洞與乙支路慢走展開，中午安排 Sura Gejang，下午再轉往弘大進行 AMTON 與夜場自由活動，整體比原本更乾淨，也較不會出現兩頓過重主餐。",
    featuredMoments: [
      "明洞午餐前後都可留 café 與補逛空間，白天節奏較舒適。",
      "AMTON 已確認為美容室，因此下午轉弘大是合理主線。",
      "晚上以街頭、小食與自由活動收尾，比硬塞正式晚餐更輕巧。",
    ],
    optionalPageTitle: "Day 6 其他可考慮行程",
    optionalPageSummary:
      "此頁集中整理弘大夜場的小食與一隻雞備位邏輯，方便按排隊、體力與當日食欲再作取捨。",
  },
  {
    dayId: "seoul-day-4",
    heroTitle: "離境日只保留真正重要的主角，再把機場節奏抓穩。",
    heroSummary:
      "5/24 正式版把 Kongdu 明洞午餐與 Jureongjureong 永登浦放在主線，Time Square 只作可有可無的補逛空間；只要午餐不拖太晚、動物園時間控制得宜，整體仍可穩定接上晚間航班。",
    featuredMoments: [
      "Kongdu 應盡量 12:00 準時入座，不宜吃到過晚。",
      "Jureongjureong 建議控制在 1.5 至 2 小時內，避免失控拉長。",
      "永登浦地下街與 Time Square 只是能逛就逛，機場準時才是核心。",
    ],
    optionalPageTitle: "Day 7 其他可考慮行程",
    optionalPageSummary:
      "此頁保留離境日補逛彈性與時間控制原則，方便當天按用餐、活動與赴機場時間快速決定是否刪減。",
  },
];

export interface TripMapImageItem {
  id: string;
  dayLabel: string;
  cityLabel: string;
  title: string;
  summary: string;
  imageUrl: string;
}

export const TRIP_MAP_IMAGES: TripMapImageItem[] = [
  {
    id: "day-1",
    dayLabel: "Day 1",
    cityLabel: "釜山",
    title: "南浦・富平・影島・太宗台・鑽石灣遊艇",
    summary: "以釜山舊城區、影島海景與夜間遊艇為主軸，適合作為旅程的開場。",
    imageUrl: "/trip-maps/day-1-busan.png",
  },
  {
    id: "day-2",
    dayLabel: "Day 2",
    cityLabel: "釜山",
    title: "松島・東釜山・機張・樂天世界",
    summary: "以 Busan Pass 設施體驗為核心，串連松島海上纜車、Luge、樂天世界與東釜山晚餐。",
    imageUrl: "/trip-maps/day-2-busan.png",
  },
  {
    id: "day-3",
    dayLabel: "Day 3",
    cityLabel: "釜山",
    title: "甘川・海雲台・膠囊列車・ClubD",
    summary: "早上甘川洞韓服拍攝，16:00 乘坐膠囊列車與 18:35 前到 ClubD Oasis。",
    imageUrl: "/trip-maps/day-3-busan.png",
  },
  {
    id: "day-4",
    dayLabel: "Day 4",
    cityLabel: "釜山 → 首爾",
    title: "釜山收尾・KTX・聖水・明洞・東大門",
    summary: "釜山西面逛街或補漏，中午乘 KTX 去首爾，抵達首爾後接續聖水剪髮、明洞晚餐與東大門夜買。",
    imageUrl: "/trip-maps/day-4-busan-seoul.png",
  },
  {
    id: "day-5",
    dayLabel: "Day 5",
    cityLabel: "首爾",
    title: "古好齋・江南・新沙・狎鷗亭・清潭",
    summary: "上午以古好齋韓國傳統宮廷點心作儀式感開場，中午去首爾媽媽 SUPERPAN 品嘗現代首爾料理，晚上去判逆天才 Original Numbers。",
    imageUrl: "/trip-maps/day-5-seoul.png",
  },
  {
    id: "day-6",
    dayLabel: "Day 6",
    cityLabel: "首爾",
    title: "明洞 Congdu・美容・弘大",
    summary: "白天在明洞午餐與美容，下午至晚上轉往弘大，逛小店、café 與街頭散步。",
    imageUrl: "/trip-maps/day-6-seoul.png",
  },
  {
    id: "day-7",
    dayLabel: "Day 7",
    cityLabel: "首爾 → 仁川",
    title: "永登浦・航空博物館・新浦・仁川機場",
    summary: "離境日由市中心逐步往西移動，去永登浦動物 cafe、金浦嘗試模擬駕駛飛機、新浦市場晚餐與仁川機場。",
    imageUrl: "/trip-maps/day-7-seoul.png",
  },
];

export const CALCULATOR_MODULES: CalculatorModule[] = [
  {
    id: "currency",
    title: "旅費匯率換算",
    description: "快速把韓元換算成港幣或其他參考金額，方便即場判斷餐費與購物支出。",
    inputLabels: ["韓元金額", "匯率", "參考貨幣金額"],
  },
  {
    id: "split",
    title: "同行分攤計算",
    description: "輸入總金額、人數與額外服務費後，即可估算每人應付金額。",
    inputLabels: ["總金額", "同行人數", "附加費 / 小費"],
  },
];

export type ShoppingCategory =
  | "ticket"
  | "transport"
  | "beauty"
  | "souvenir"
  | "food"
  | "daily";

export type ShoppingStatus = "bought" | "consider" | "local";

export interface ShoppingItem {
  id: string;
  title: string;
  category: ShoppingCategory;
  city: "釜山" | "首爾" | "共用";
  status: ShoppingStatus;
  note: string;
  price?: string;
  relatedDay?: string;
}

export const SHOPPING_ITEMS: ShoppingItem[] = [
  {
    id: "olive-young-beauty",
    title: "Olive Young 美妝保養品",
    category: "beauty",
    city: "共用",
    status: "local",
    note: "可於釜山或首爾分店現場看優惠組合，建議集中記錄想買品牌、色號、價錢與優惠組合，最後一至兩日再統一購買。",
  },
  {
    id: "pharmacy-beauty",
    title: "Pharmacy 美妝保養品",
    category: "beauty",
    city: "共用",
    status: "local",
    note: "可於藥局查看修復霜、痘痘貼、敏感肌產品或限定款，適合拍下貨架、產品包裝與價格牌作比較。",
  },
  {
    id: "korea-snacks-souvenir",
    title: "韓國零食與伴手禮",
    category: "souvenir",
    city: "共用",
    status: "local",
    note: "可於最後一至兩日集中購買，適合放在超市、便利店或百貨地下食品區處理，也可拍下包裝避免買錯口味。",
  },
];

export function shoppingCategoryLabel(category: ShoppingCategory): string {
  switch (category) {
    case "ticket":
      return "門票";
    case "transport":
      return "交通 / 票券";
    case "beauty":
      return "美妝保養";
    case "souvenir":
      return "伴手禮";
    case "food":
      return "食品";
    case "daily":
      return "日用品";
    default:
      return "其他";
  }
}

export function shoppingStatusLabel(status: ShoppingStatus): string {
  switch (status) {
    case "bought":
      return "已購買";
    case "consider":
      return "可考慮";
    case "local":
      return "到當地再決定";
    default:
      return "待確認";
  }
}

export const BUSAN_TIPS: TipsSection[] = [
  {
    id: "booking",
    title: "預約與固定安排",
    summary: "此區集中列出不能錯過的已確定時段，方便每天出門前快速核對。",
    items: [
      "Day 3 膠囊列車已預約 16:00，海雲台與青沙浦動線應圍繞此時間安排。",
      "遊艇、主題設施及需使用 Pass 的景點宜預先確認開放時間。",
      "如餐廳支援預約，建議優先處理高權重晚餐選項。",
    ],
  },
  {
    id: "food",
    title: "餐廳與甜點選擇原則",
    summary: "餐飲安排以主線穩定、備選靈活為原則，避免因排隊而打亂主要體驗。",
    items: [
      "甜點店與熱門餐廳應留意售罄及排隊風險。",
      "主頁只保留最順路的建議路線，其餘餐飲選項集中在獨立頁面查閱。",
      "如當日精神一般，建議優先保留景觀價值最高或你特別在意的店家。",
    ],
  },
  {
    id: "transport",
    title: "交通與移動節奏",
    summary: "釜山區域跨度較大，應盡量把同區內容放在同一時段完成。",
    items: [
      "南浦、松島、影島與廣安里可視為西區至港灣系統。",
      "海雲台、青沙浦與松亭可視為東岸系統，安排時應避免來回折返。",
      "最後一天以少轉乘、易補漏的區域作主線會較為舒適。",
    ],
  },
];

export function getDayEditorialContent(dayId: string): DayEditorialContent | undefined {
  return DAY_EDITORIAL_CONTENT.find(item => item.dayId === dayId);
}
