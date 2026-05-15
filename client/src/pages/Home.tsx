/*
  Style reminder for this page:
  - The page should feel like a romantic editorial trip journal in app form, not a utility dashboard.
  - Cream white, blush pink, mist blue, and blue-grey should dominate; keep the tone soft but grown-up.
  - Insert illustrations as part of the storytelling surface so the UI feels curated and emotionally warm.
*/

import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  Calculator,
  CalendarDays,
  CircleDollarSign,
  ExternalLink,
  ImagePlus,
  LibraryBig,
  MapPinned,
  PenLine,
  Plus,
  Quote,
  Route,
  Search,
  Sparkles,
  StickyNote,
  Trash2,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTripPlanner, relatedDayLabels } from "@/hooks/use-trip-planner";
import {
  bookingKindLabels,
  categoryLabels,
  placeStatusLabels,
  priorityLabels,
  stopRoleLabels,
  type TripBooking,
  type TripPlace,
  type TripStop,
} from "@/lib/trip-data";
import {
  APP_EDITORIAL_SUMMARY,
  APP_EDITORIAL_TITLE,
  CALCULATOR_MODULES,
  getDayEditorialContent,
  MAIN_TABS,
  SHOPPING_ITEMS,
  shoppingCategoryLabel,
  shoppingStatusLabel,
  TRIP_MAP_IMAGES,
  type MainTabId,
} from "@/lib/trip-presentation";
import { useShoppingPhotos, type UploadStatus, type ShoppingPhoto } from "@/hooks/use-shopping-photos";

// ─── tone helpers ────────────────────────────────────────────────────────────

function dayBadgeTone(index: number): string {
  const tones = [
    "border-[#e7d4cb] bg-[#fff7f1] text-[#8a6870]",
    "border-[#d7e2ea] bg-[#f4f8fb] text-[#5e758a]",
    "border-[#e7d9e6] bg-[#fbf5fb] text-[#7f6887]",
    "border-[#dfe7de] bg-[#f6faf5] text-[#6f7d72]",
  ];
  return tones[index % tones.length];
}

function placeCardTone(place: TripPlace): string {
  if (place.priority === "must") return "border-[#ead8cb] bg-[#fff8f2]";
  if (place.status === "optional") return "border-[#dee6ec] bg-[#f7fafc]";
  return "border-[#dce4ea] bg-[#fffdfa]";
}

function stopRoleTone(stop: TripStop): string {
  switch (stop.role) {
    case "main":   return "bg-[#fff3ea] text-[#8f6d65]";
    case "option": return "bg-[#eff5f9] text-[#5f7385]";
    case "nearby": return "bg-[#f4f7f1] text-[#6c7a6f]";
    case "backup": return "bg-[#f4eff6] text-[#7a6881]";
    default:       return "bg-[#f0f3f5] text-[#637484]";
  }
}

function categoryPillTone(category: TripPlace["category"]): string {
  switch (category) {
    case "food":     return "bg-[#fff4ea] text-[#8d6757]";
    case "cafe":     return "bg-[#fcf1f6] text-[#92697d]";
    case "activity": return "bg-[#eef4f8] text-[#61788d]";
    case "market":   return "bg-[#f2f7f2] text-[#68806b]";
    case "shopping": return "bg-[#eef1f8] text-[#677797]";
    case "spa":      return "bg-[#f3eef6] text-[#7f6f8b]";
    case "travel":   return "bg-[#eff3f7] text-[#64788c]";
    case "stay":     return "bg-[#f5f2ef] text-[#746f72]";
    default:         return "bg-[#edf4f7] text-[#5f7888]";
  }
}

function placeFeatureCopy(place: TripPlace): string {
  switch (place.id) {
    case "eggdrop-nampo":
      return "進市區後先吃早餐開展美好的一天。";
    case "bupyeong-market":
      return "富平市場集合街頭小食、舊城區生活感與伴手禮選擇，是感受釜山在地氣氛的重要一站。";
    case "songdo-cable-car":
      return "乘坐松島海上纜車，盡覽陽光下閃爍的蔚藍大海、奇岩怪石與翠綠景致。";
    case "burger-yo":
      return "影島人氣漢堡店，以海鮮口味漢堡作為旅程中具記憶點的一餐。";
    case "dyupeullit":
      return "海雲台代表性甜點安排，適合在下午進入海岸主線前作短暫停留。";
    default:
      return place.description;
  }
}

function timeToOrder(time: string): number {
  const [hour, minute] = time.split(":").map(Number);
  if (Number.isNaN(hour) || Number.isNaN(minute)) return Number.MAX_SAFE_INTEGER;
  return hour * 60 + minute;
}

function fallbackNaverUrl(place: TripPlace): string {
  const keyword = [place.title, place.address || place.district]
    .filter(Boolean)
    .join(" ")
    .trim();
  return `https://map.naver.com/p/search/${encodeURIComponent(keyword)}`;
}

function getPlaceNaverUrl(place: TripPlace): string {
  return place.naverUrl || fallbackNaverUrl(place);
}

// ─── transport reference ──────────────────────────────────────────────────────

const transportReference: Record<string, string[]> = {
  "busan-day-1:eggdrop-nampo":              ["taxi 約 22 分", "步行至早餐點約 3 分"],
  "busan-day-1:bupyeong-market":            ["步行約 8 分"],
  "busan-day-1:d1-pass":                    ["步行約 5 分"],
  "busan-day-1:songdo-cable-car":           ["taxi 約 18 分"],
  "busan-day-1:songdo-yonggung":            ["步行約 12 分"],
  "busan-day-1:d1-checkin":                 ["步行約 6 分"],
  "busan-day-1:d1-yacht-booking":           ["taxi 約 22 分"],
  "busan-day-2:skyline-luge":               ["taxi 約 35 分"],
  "busan-day-2:kijang-seafood":             ["taxi 約 14 分"],
  "busan-day-2:lotte-world-busan":          ["步行約 9 分"],
  "busan-day-2:dongbusan-outlet":           ["步行約 6 分"],
  "busan-day-2:rapseu":                     ["taxi 約 18 分"],
  "busan-day-2:kkotgedang":                 ["taxi 約 20 分"],
  "busan-day-2:geumsu-bokguk":              ["taxi 約 22 分"],
  "busan-day-2:songjeong-3dae":             ["taxi 約 10 分"],
  "busan-day-3:gamcheon-hanbok":            ["taxi 約 28 分"],
  "busan-day-3:gamcheon-flipbook":          ["步行約 10 分"],
  "busan-day-3:dyupeullit":                 ["taxi 約 32 分"],
  "busan-day-3:momoseu-marine-city":        ["taxi 約 10 分"],
  "busan-day-3:goraesa-fishcake":           ["步行約 5 分"],
  "busan-day-3:d3-capsule-booking":         ["步行至乘車點約 8 分"],
  "busan-day-3:haewol-observatory":         ["步行約 6 分"],
  "busan-day-3:haeundae-coast-train":       ["步行約 10 分"],
  "busan-day-3:arte-museum-busan":          ["taxi 約 9 分"],
  "busan-day-3:xthe-sky":                   ["taxi 約 12 分"],
  "busan-day-3:starbucks-haeundae":         ["步行約 7 分"],
  "busan-day-3:mipojip":                    ["步行約 6 分"],
  "busan-day-3:dae-galbi-haeundae":         ["taxi 約 11 分"],
  "busan-day-3:whos-who-mumu":              ["步行約 4 分"],
  "busan-day-4:oryukdo-skywalk":            ["taxi 約 24 分"],
  "busan-day-4:bupyeong-market":            ["taxi 約 28 分"],
  "busan-day-4:burger-yo":                  ["taxi 約 16 分"],
  "busan-day-4:your-type-jeonpo":           ["KTX 前 taxi 約 18 分"],
  "busan-day-4:onbap-jeonpo":               ["步行約 5 分"],
  "busan-day-4:gowon":                      ["步行約 4 分"],
  "busan-day-4:mirye-soup-rice":            ["步行約 6 分"],
  "busan-day-4:d4-ktx-window":              ["KTX 建議預留 25 分進站"],
  "seoul-day-1:moment-mansion":             ["首爾站 → 東大門約 15–30 分"],
  "seoul-day-1:deepin-sindang":             ["東大門 → 新堂約 10–15 分"],
  "seoul-day-1:dioteu-dongdaemun":          ["晚餐後回東大門約 10–20 分"],
  "seoul-day-1:nujyon-dongdaemun":          ["與 The OT 同區步行可達"],
  "seoul-day-1:s1-arrive-window":           ["抵達後先安頓行李再出發"],
  "seoul-day-2:goryo-house-tea":            ["東大門 → 忠武路約 15–25 分", "古好齋 → 江南 / 新沙約 35–50 分"],
  "seoul-day-2:superpan-seoul":             ["散步線內步行 / 短程車移動"],
  "seoul-day-2:original-numbers-cheongdam":["SUPERPAN → 清潭約 10–20 分"],
  "seoul-day-3:myeongdong-walk":            ["東大門 → 明洞約 15–25 分"],
  "seoul-day-3:sura-gejang-seoul":          ["明洞區內步行銜接"],
  "seoul-day-3:amton-hongdae":              ["明洞 → 弘大約 25–35 分"],
  "seoul-day-3:hongdae-street":             ["美容室後步行延伸夜場"],
  "seoul-day-3:gongneung-dak-sinchon":      ["弘大 / 新村短程移動"],
  "seoul-day-4:kongdu-myeongdong":          ["東大門 → 明洞約 15–25 分"],
  "seoul-day-4:jureongjureong-yeongdeungpo":["明洞 → 永登浦地鐵約 25–35 分", "計程車約 25–40 分"],
  "seoul-day-4:times-square-yeongdeungpo": ["Jureongjureong 鄰近補逛"],
  "seoul-day-4:s4-airport-window":          ["永登浦 → 仁川機場約 60–80 分"],
};

function transportHints(dayId: string | undefined, nodeId: string): string[] {
  if (!dayId) return [];
  return transportReference[`${dayId}:${nodeId}`] || [];
}

// ─── shopping text-only content (localStorage — text is tiny, safe) ──────────

type ShoppingTextContent = Record<string, string>;

const SHOPPING_TEXT_STORAGE_KEY = "korea-shopping-text-content";

const CUSTOM_SHOPPING_ITEM_IDS = new Set([
  "olive-young-beauty",
  "pharmacy-beauty",
  "korea-snacks-souvenir",
]);

function loadShoppingText(): ShoppingTextContent {
  if (typeof window === "undefined") return {};
  try {
    const stored = window.localStorage.getItem(SHOPPING_TEXT_STORAGE_KEY);
    if (!stored) return {};
    const parsed = JSON.parse(stored);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return {};
    return Object.entries(parsed).reduce<ShoppingTextContent>((acc, [k, v]) => {
      if (typeof v === "string") acc[k] = v;
      return acc;
    }, {});
  } catch {
    return {};
  }
}

// ─── component ───────────────────────────────────────────────────────────────

export default function Home() {
  const {
    trip,
    selectedCity,
    selectedCityId,
    setSelectedCityId,
    selectedDay,
    selectedDayId,
    setSelectedDayId,
    librarySearch,
    setLibrarySearch,
    libraryCategory,
    setLibraryCategory,
    libraryStatus,
    setLibraryStatus,
    editorDraft,
    setEditorDraft,
    placeMap,
    mainStops,
    visibleLibraryPlaces,
    openEditor,
    saveEditor,
    deleteStop,
    addPlaceToToday,
    resetTrip,
  } = useTripPlanner();

  const [activeTab, setActiveTab] = useState<MainTabId>("itinerary");
  const [optionsDayId, setOptionsDayId] = useState<string | null>(null);

  // ── shopping: text notes (localStorage) ───────────────────────────────────
  const [shoppingText, setShoppingText] = useState<ShoppingTextContent>(loadShoppingText);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(SHOPPING_TEXT_STORAGE_KEY, JSON.stringify(shoppingText));
    } catch {
      // localStorage full — text is small so this is very unlikely
    }
  }, [shoppingText]);

  const updateShoppingUserText = (itemId: string, text: string) => {
    setShoppingText(current => ({ ...current, [itemId]: text }));
  };

  // ── shopping: photos (IndexedDB via hook) ─────────────────────────────────
  const {
    photoMap,
    uploadStatuses,
    uploadPhotos,
    removePhoto: removeShoppingPhoto,
  } = useShoppingPhotos();

  // ── calculator ────────────────────────────────────────────────────────────
  const [currencyKrw, setCurrencyKrw] = useState<string>("");
  const [currencyRate, setCurrencyRate] = useState<string>("0.0057");
  const [cashStart, setCashStart] = useState<string>("300000");
  const [cashTopUp, setCashTopUp] = useState<string>("0");
  const [expenseLabel, setExpenseLabel] = useState<string>("");
  const [expenseAmount, setExpenseAmount] = useState<string>("");
  const [expenseMethod, setExpenseMethod] = useState<"cash" | "card">("cash");
  const [expenseLog, setExpenseLog] = useState<
    Array<{ id: string; label: string; amount: number; method: "cash" | "card" }>
  >([
    { id: "exp-1", label: "交通儲備", amount: 25000, method: "cash" },
    { id: "exp-2", label: "晚餐預留", amount: 48000, method: "card" },
  ]);

  // ── map ───────────────────────────────────────────────────────────────────
  const [activeMapImageId, setActiveMapImageId] = useState("day-1");

  // ── derived ───────────────────────────────────────────────────────────────

  const editorial = selectedDay ? getDayEditorialContent(selectedDay.id) : undefined;

  const optionDay = useMemo(() => {
    if (!optionsDayId) return null;
    return selectedCity.days.find(day => day.id === optionsDayId) || null;
  }, [optionsDayId, selectedCity.days]);

  const optionDayEditorial = optionDay ? getDayEditorialContent(optionDay.id) : undefined;

  const suggestedTimeline = useMemo(() => {
    if (!selectedDay)
      return [] as Array<
        | { kind: "booking"; order: number; booking: TripBooking }
        | { kind: "stop"; order: number; stop: TripStop }
      >;

    const bookingItems = selectedDay.bookings.map(booking => ({
      kind: "booking" as const,
      order: timeToOrder(booking.time),
      booking,
    }));

    const stopItems = mainStops.map(stop => ({
      kind: "stop" as const,
      order: timeToOrder(stop.time),
      stop,
    }));

    return [...bookingItems, ...stopItems].sort((l, r) => {
      if (l.order !== r.order) return l.order - r.order;
      if (l.kind === r.kind) return 0;
      return l.kind === "booking" ? -1 : 1;
    });
  }, [mainStops, selectedDay]);

  const currencyResult = useMemo(() => {
    const krw = Number(currencyKrw);
    const rate = Number(currencyRate);
    if (!krw || !rate) return null;
    return (krw * rate).toFixed(2);
  }, [currencyKrw, currencyRate]);

  const cashSpent = useMemo(
    () =>
      expenseLog
        .filter(item => item.method === "cash")
        .reduce((sum, item) => sum + item.amount, 0),
    [expenseLog],
  );

  const cardSpent = useMemo(
    () =>
      expenseLog
        .filter(item => item.method === "card")
        .reduce((sum, item) => sum + item.amount, 0),
    [expenseLog],
  );

  const availableCash = useMemo(() => {
    const start = Number(cashStart) || 0;
    const topUp = Number(cashTopUp) || 0;
    return start + topUp - cashSpent;
  }, [cashSpent, cashStart, cashTopUp]);

  const totalSpent = useMemo(() => cashSpent + cardSpent, [cardSpent, cashSpent]);

  // ── handlers ──────────────────────────────────────────────────────────────

  const addExpenseEntry = () => {
    const amount = Number(expenseAmount);
    const label = expenseLabel.trim();
    if (!label || !amount) return;
    setExpenseLog(current => [
      { id: `${Date.now()}`, label, amount, method: expenseMethod },
      ...current,
    ]);
    setExpenseLabel("");
    setExpenseAmount("");
    setExpenseMethod("cash");
  };

  const removeExpenseEntry = (id: string) => {
    setExpenseLog(current => current.filter(item => item.id !== id));
  };

  // ── render: suggested itinerary ───────────────────────────────────────────

  const renderSuggestedItinerary = () => (
    <section className="space-y-4">
      <div className="romantic-shell glass-noise rounded-[2rem] px-4 py-4 text-[#35506a] shadow-[0_24px_60px_rgba(117,132,153,0.14)]">
        <div className="relative overflow-hidden rounded-[1.7rem] border border-white/70 bg-[linear-gradient(135deg,rgba(255,253,249,0.96),rgba(243,235,240,0.88)_45%,rgba(232,238,243,0.92))] px-4 py-4">
          <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-[#e5d6dd]/60 blur-3xl" />
          <div className="pointer-events-none absolute bottom-0 left-0 h-24 w-24 rounded-full bg-[#dce6ef]/70 blur-3xl" />
          <div className="relative">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/80 bg-white/72 px-3 py-1.5 text-[10px] font-semibold tracking-[0.18em] text-[#7d7382] editorial-kicker">
              Romantic Route Notes
            </div>
            <h1 className="mt-3 max-w-[18ch] text-[1.62rem] font-black leading-[1.02] tracking-[-0.055em] text-[#334a60] sm:max-w-[22ch] sm:text-[1.78rem]">
              {editorial?.heroTitle || APP_EDITORIAL_TITLE}
            </h1>
            <p className="mt-3 max-w-none text-[12px] leading-6 text-[#617489] sm:text-[13px]">
              {editorial?.heroSummary || APP_EDITORIAL_SUMMARY}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="soft-pill inline-flex items-center rounded-full px-3 py-1.5 text-[10px] font-semibold tracking-[0.04em]">
                {selectedCity.name} · {selectedCity.days.length} days
              </span>
              {selectedDay ? (
                <span className="soft-pill inline-flex items-center rounded-full px-3 py-1.5 text-[10px] font-semibold tracking-[0.04em]">
                  {selectedDay.label} · {selectedDay.theme}
                </span>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      <div className="romantic-shell rounded-[1.6rem] px-3.5 py-3.5">
        <div className="flex items-center justify-between gap-2.5">
          <div className="min-w-0">
            <p className="text-[10px] font-semibold tracking-[0.18em] text-[#8a7a86] editorial-kicker">
              Daily edit
            </p>
            <p className="mt-1 text-[11px] leading-5 text-[#6b7c8c]">
              快速查看每日安排、交通與餐廳，也保留臨場調整的餘地。
            </p>
          </div>
          <Button
            variant="outline"
            className="rounded-full border-[#e3d8d4] bg-[#fffaf6] px-3 py-1.5 text-[11px] text-[#5d7487] shadow-[0_10px_20px_rgba(133,145,163,0.08)]"
            onClick={resetTrip}
          >
            重設資料
          </Button>
        </div>
        <div className="mt-3 grid gap-2.5">
          {selectedCity.days.map((day, index) => (
            <button
              key={day.id}
              type="button"
              onClick={() => setSelectedDayId(day.id)}
              className={`rounded-[1.3rem] border px-3 py-3 text-left transition duration-200 ${
                selectedDayId === day.id
                  ? `${dayBadgeTone(index)} shadow-[0_18px_32px_rgba(153,164,178,0.12)]`
                  : "border-[#e6eaee] bg-[rgba(255,255,255,0.78)] text-[#4f6577]"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[1rem] font-black leading-tight">{day.label}</p>
                  <p className="mt-0.5 text-[12px] opacity-80">{day.dateLabel}</p>
                  <p className="mt-1.5 text-[11px] leading-5 opacity-80">{day.area}</p>
                </div>
                <span className="rounded-full border border-white/70 bg-white/72 px-2.5 py-1 text-[10px] font-semibold text-[#687c8f]">
                  {day.theme}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {selectedDay ? (
        <div className="rounded-[1.5rem] border border-[#e1e6ef] bg-[#fffdfb] px-3.5 py-3.5 shadow-[0_14px_36px_rgba(117,136,158,0.08)]">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-[#eef4fb] px-2.5 py-1 text-[10px] font-semibold tracking-[0.03em] text-[#55728d]">
                <CalendarDays className="h-3 w-3" />
                {selectedDay.theme}
              </div>
              <h2 className="mt-2 text-[1.14rem] font-black leading-[1.15] tracking-[-0.04em] text-[#24394d]">
                {selectedDay.label} · {selectedDay.dateLabel}
              </h2>
              <p className="mt-1.5 text-[12px] leading-5 text-[#617486]">{selectedDay.summary}</p>
            </div>
            <Button
              className="rounded-full bg-[#6c879d] px-3 py-1.5 text-[11px] text-white hover:bg-[#587287]"
              onClick={() => openEditor()}
            >
              <Plus className="mr-1.5 h-3.5 w-3.5" />
              新增
            </Button>
          </div>

          <div className="mt-5 space-y-3">
            {suggestedTimeline.map(item => {
              if (item.kind === "booking") {
                const booking = item.booking;
                const relatedPlace = booking.relatedPlaceId
                  ? placeMap[booking.relatedPlaceId]
                  : undefined;

                return (
                  <article
                    key={booking.id}
                    className="relative rounded-[1.2rem] border border-[#f1d8c6] bg-[#fff8f2] px-3 py-3 shadow-[0_10px_26px_rgba(190,152,133,0.12)]"
                  >
                    <span className="absolute right-3 top-3 rounded-full bg-white/88 px-2.5 py-1 text-[10px] font-semibold text-[#87695d] shadow-[0_8px_16px_rgba(146,121,106,0.08)]">
                      {booking.locked ? "已確認" : "可調整"}
                    </span>
                    <div className="min-w-0 pr-16">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="rounded-full bg-[#9b7d65] px-2.5 py-1 text-[10px] font-semibold text-white">
                          {booking.time}
                        </span>
                        <span className="rounded-full bg-white px-2.5 py-1 text-[10px] font-semibold text-[#876458]">
                          {bookingKindLabels[booking.kind]}
                        </span>
                      </div>
                    </div>
                    <h3 className="mt-2 text-[1rem] font-black leading-tight tracking-[-0.03em] text-[#5f4a43]">
                      {booking.title}
                    </h3>
                    <p className="mt-1 text-[11px] text-[#9a7a72]">{booking.district}</p>
                    {transportHints(selectedDay?.id, booking.id).length ? (
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {transportHints(selectedDay?.id, booking.id).map(hint => (
                          <span
                            key={hint}
                            className="rounded-full bg-[#f7ece4] px-2 py-1 text-[10px] font-medium text-[#7b6558]"
                          >
                            {hint}
                          </span>
                        ))}
                      </div>
                    ) : null}
                    <p className="mt-2 text-[12px] leading-5 text-[#7e665d]">{booking.note}</p>
                    {relatedPlace?.address ? (
                      <p className="mt-1.5 text-[11px] leading-5 text-[#96796d]">
                        {relatedPlace.address}
                      </p>
                    ) : null}
                    {relatedPlace ? (
                      <div className="mt-3 flex flex-wrap gap-2">
                        <a
                          href={getPlaceNaverUrl(relatedPlace)}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 rounded-full border border-[#ead7c9] bg-white px-3 py-1.5 text-[11px] font-semibold text-[#7b6558]"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                          NAVER Map
                        </a>
                      </div>
                    ) : null}
                  </article>
                );
              }

              const stop = item.stop;
              const place = placeMap[stop.placeId];
              if (!place) return null;

              return (
                <article
                  key={stop.id}
                  className="relative rounded-[1.2rem] border border-[#e2e8ef] bg-white px-3 py-3 shadow-[0_10px_26px_rgba(117,136,158,0.09)]"
                >
                  <Button
                    variant="outline"
                    className="absolute right-3 top-3 h-auto rounded-full border-[#dfe6ee] bg-white/92 px-2.5 py-1.5 text-[10px] shadow-[0_8px_16px_rgba(117,136,158,0.08)]"
                    onClick={() => openEditor(stop, place)}
                  >
                    <PenLine className="mr-1 h-3.5 w-3.5" />
                    編輯
                  </Button>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-1.5 pr-16">
                      <span className="rounded-full bg-[#6d889d] px-2.5 py-1 text-[10px] font-semibold text-white">
                        {stop.time}
                      </span>
                      <span className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${stopRoleTone(stop)}`}>
                        {stopRoleLabels[stop.role]}
                      </span>
                      <span className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${categoryPillTone(place.category)}`}>
                        {categoryLabels[place.category]}
                      </span>
                    </div>
                    <h3 className="mt-2 pr-2 text-[1rem] font-black leading-tight tracking-[-0.03em] text-[#24394d]">
                      {place.title}
                    </h3>
                    <p className="mt-1 text-[11px] text-[#718396]">{place.district}</p>
                    {place.address ? (
                      <p className="mt-1 text-[11px] leading-5 text-[#8090a0]">{place.address}</p>
                    ) : null}
                    {transportHints(selectedDay?.id, place.id).length ? (
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {transportHints(selectedDay?.id, place.id).map(hint => (
                          <span
                            key={hint}
                            className="rounded-full bg-[#edf4fa] px-2 py-1 text-[10px] font-medium text-[#577087]"
                          >
                            {hint}
                          </span>
                        ))}
                      </div>
                    ) : null}
                    <p className="mt-2 text-[12px] leading-5 text-[#566b7f]">
                      {placeFeatureCopy(place)}
                    </p>
                    <p className="mt-1.5 text-[12px] leading-5 text-[#6a7d8f]">
                      {stop.note}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <a
                        href={getPlaceNaverUrl(place)}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-full border border-[#d8e3ec] bg-[#f8fbfd] px-3 py-1.5 text-[11px] font-semibold text-[#35556f]"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                        NAVER Map
                      </a>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          <div className="mt-4 rounded-[1.2rem] border border-[#e4e9ef] bg-[#f8fafc] px-3 py-3.5">
            <p className="text-[10px] font-semibold tracking-[0.04em] text-[#7a8899]">
              其他安排
            </p>
            <h3 className="mt-1.5 text-[1rem] font-black text-[#24394d]">
              {editorial?.optionalPageTitle || "其他可考慮行程"}
            </h3>
            <p className="mt-1.5 text-[12px] leading-5 text-[#617486]">
              {editorial?.optionalPageSummary ||
                "當天其他可考慮的餐廳、甜品與景點已獨立整理成另一頁，方便保持主線閱讀清晰。"}
            </p>
            <Button
              className="mt-3 rounded-full bg-[#6c879d] px-4 py-1.5 text-[11px] text-white hover:bg-[#587287]"
              onClick={() => setOptionsDayId(selectedDay.id)}
            >
              查看其他可考慮行程
            </Button>
          </div>
        </div>
      ) : null}
    </section>
  );

  // ── render: option page ───────────────────────────────────────────────────

  const renderOptionPage = () => {
    if (!optionDay) return null;
    const optionStops = optionDay.stops.filter(stop => stop.role !== "main");

    return (
      <section className="space-y-3">
        <button
          type="button"
          onClick={() => setOptionsDayId(null)}
          className="inline-flex items-center gap-2 rounded-full border border-[#d7e3ec] bg-white px-4 py-2 text-sm font-semibold text-[#173149]"
        >
          <ArrowLeft className="h-4 w-4" />
          返回建議行程
        </button>

        <div className="romantic-shell glass-noise rounded-[1.8rem] px-4 py-5 text-[#35506a] shadow-[0_18px_50px_rgba(117,132,153,0.12)]">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/80 bg-white/72 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#7e7884]">
            Optional Route Notes
          </div>
          <p className="mt-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#72879a]">
            {optionDay.label}
          </p>
          <h2 className="mt-2 text-[1.45rem] font-black leading-tight tracking-[-0.045em] text-[#334b61]">
            {optionDayEditorial?.optionalPageTitle || "其他可考慮行程"}
          </h2>
          <p className="mt-3 text-[12px] leading-5 text-[#5f7386]">
            {optionDayEditorial?.optionalPageSummary ||
              "這裡集中整理當天可因應狀況靈活調整的其他行程內容。"}
          </p>
        </div>

        <div className="space-y-4">
          {optionStops.map(stop => {
            const place = placeMap[stop.placeId];
            if (!place) return null;

            return (
              <article
                key={stop.id}
                className="rounded-[1.2rem] border border-[#e2e8ef] bg-white px-3 py-3 shadow-[0_10px_26px_rgba(117,136,158,0.09)]"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-[#eff4f8] px-3 py-1 text-xs font-semibold text-[#52677b]">
                        {stop.time}
                      </span>
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold ${stopRoleTone(stop)}`}>
                        {stopRoleLabels[stop.role]}
                      </span>
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold ${categoryPillTone(place.category)}`}>
                        {categoryLabels[place.category]}
                      </span>
                    </div>
                    <h3 className="mt-2 text-[1rem] font-black leading-tight tracking-[-0.03em] text-[#24394d]">
                      {place.title}
                    </h3>
                    <p className="mt-1 text-sm text-[#6a7d8f]">{place.district}</p>
                    {place.address ? (
                      <p className="mt-1 text-[11px] leading-5 text-[#8090a0]">{place.address}</p>
                    ) : null}
                    <p className="mt-3 text-[12px] leading-5 text-[#53687b]">
                      {placeFeatureCopy(place)}
                    </p>
                    <p className="mt-2 text-[12px] leading-5 text-[#667b8e]">{stop.note}</p>
                    {place.originalQuote ? (
                      <div className="mt-3 rounded-[1.2rem] border border-[#ffe1ab] bg-[#fff8e8] px-4 py-3 text-sm leading-6 text-[#7a5c28]">
                        <div className="mb-1 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#9b7327]">
                          <Quote className="h-3.5 w-3.5" />
                          原句
                        </div>
                        <p>"{place.originalQuote}"</p>
                      </div>
                    ) : null}
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-2">
                    <a
                      href={getPlaceNaverUrl(place)}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-full border border-[#d8e3ec] bg-[#f8fbfd] px-3 py-1.5 text-[11px] font-semibold text-[#35556f]"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                      NAVER Map
                    </a>
                    <Button
                      variant="outline"
                      className="rounded-full border-[#d9e4ec] bg-white"
                      onClick={() => openEditor(stop, place)}
                    >
                      <PenLine className="mr-2 h-4 w-4" />
                      編輯
                    </Button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    );
  };

  // ── render: map page ──────────────────────────────────────────────────────

  const renderMapPage = () => {
    const activeMapImage =
      TRIP_MAP_IMAGES.find(item => item.id === activeMapImageId) ?? TRIP_MAP_IMAGES[0];

    return (
      <section className="space-y-5">
        <div className="romantic-shell glass-noise rounded-[1.7rem] px-4 py-4 text-[#35506a] shadow-[0_18px_42px_rgba(117,132,153,0.12)]">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/80 bg-white/72 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#7e7884]">
            Illustrated Route Maps
          </div>
          <h2 className="mt-2 text-[1.35rem] font-black tracking-[-0.045em] text-[#334b61]">
            每日圖片地圖
          </h2>
          <p className="mt-2 text-[12px] leading-5 text-[#66798b]">
            點選 Day 1 至 Day 7，即可查看對應的旅程圖片地圖。
          </p>
          <div className="mt-4 flex gap-2 overflow-x-auto pb-1 no-scrollbar">
            {TRIP_MAP_IMAGES.map(mapItem => {
              const isActive = activeMapImage.id === mapItem.id;
              return (
                <button
                  key={mapItem.id}
                  type="button"
                  onClick={() => setActiveMapImageId(mapItem.id)}
                  className={`shrink-0 rounded-full px-3.5 py-2 text-[11px] font-bold transition ${
                    isActive
                      ? "bg-[#b9a8bd] text-white shadow-[0_10px_24px_rgba(143,123,151,0.22)]"
                      : "border border-white/70 bg-white/72 text-[#687b8e]"
                  }`}
                >
                  {mapItem.dayLabel}
                </button>
              );
            })}
          </div>
        </div>

        <article className="overflow-hidden rounded-[1.7rem] border border-[#e1e8ef] bg-white/94 shadow-[0_18px_44px_rgba(117,136,158,0.12)]">
          <div className="px-4 pb-3 pt-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-[#eef4fb] px-3 py-1 text-[10px] font-bold text-[#55728d]">
                {activeMapImage.dayLabel}
              </span>
              <span className="rounded-full bg-[#fff4ea] px-3 py-1 text-[10px] font-bold text-[#8b6a60]">
                {activeMapImage.cityLabel}
              </span>
            </div>
            <h3 className="mt-2 text-[1.08rem] font-black leading-tight tracking-[-0.035em] text-[#2f465d]">
              {activeMapImage.title}
            </h3>
            <p className="mt-2 text-[12px] leading-5 text-[#687b8e]">
              {activeMapImage.summary}
            </p>
          </div>
          <div className="border-t border-[#edf1f5] bg-[#fbf8f4]">
            <img
              src={activeMapImage.imageUrl}
              alt={`${activeMapImage.dayLabel} ${activeMapImage.title} 圖片地圖`}
              className="block w-full object-cover"
              loading="lazy"
            />
          </div>
        </article>
      </section>
    );
  };

  // ── render: library page ──────────────────────────────────────────────────

  const renderLibraryPage = () => (
    <section className="space-y-5">
      <div className="romantic-shell rounded-[1.5rem] px-3.5 py-4">
        <p className="editorial-kicker text-[11px] font-semibold text-[#8b7987]">
          Place archive
        </p>
        <h2 className="mt-2 text-[1.25rem] font-black tracking-[-0.035em] text-[#334b61]">
          完整點位庫
        </h2>
        <p className="mt-2 text-[12px] leading-5 text-[#67798b]">
          這裡整合保留景點、餐廳、甜品與購物點位，並可直接加入當日行程。
        </p>
        <div className="mt-4 rounded-[1.25rem] border border-white/78 bg-[rgba(255,255,255,0.72)] px-4 py-3 shadow-[0_10px_20px_rgba(130,145,161,0.08)]">
          <div className="flex items-center gap-2 text-[#6a7f92]">
            <Search className="h-4 w-4" />
            <input
              value={librarySearch}
              onChange={event => setLibrarySearch(event.target.value)}
              placeholder="搜尋景點、餐廳、甜品或原句"
              className="w-full bg-transparent text-sm outline-none placeholder:text-[#92a3b0]"
            />
          </div>
        </div>
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {["all", "food", "cafe", "activity", "sight", "market", "spa", "shopping"].map(item => (
            <button
              key={item}
              type="button"
              onClick={() => setLibraryCategory(item as typeof libraryCategory)}
              className={`rounded-full px-4 py-2 text-sm font-semibold whitespace-nowrap ${
                libraryCategory === item
                  ? "bg-[linear-gradient(135deg,#8da6bf,#d8b4be)] text-white shadow-[0_14px_24px_rgba(146,161,183,0.2)]"
                  : "bg-white/80 text-[#667b8d] border border-white/75"
              }`}
            >
              {item === "all" ? "全部分類" : categoryLabels[item as TripPlace["category"]]}
            </button>
          ))}
        </div>
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {["all", "active", "optional", "future"].map(item => (
            <button
              key={item}
              type="button"
              onClick={() => setLibraryStatus(item as typeof libraryStatus)}
              className={`rounded-full px-4 py-2 text-sm font-semibold whitespace-nowrap ${
                libraryStatus === item
                  ? "bg-[#fff1e8] text-[#8b6b61]"
                  : "bg-white/80 text-[#667b8d] border border-white/75"
              }`}
            >
              {item === "all" ? "全部狀態" : placeStatusLabels[item as TripPlace["status"]]}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {visibleLibraryPlaces.map(place => (
          <article
            key={place.id}
            className={`rounded-[1.65rem] border px-4 py-4 shadow-[0_14px_36px_rgba(15,41,64,0.05)] ${placeCardTone(place)}`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${categoryPillTone(place.category)}`}>
                    {categoryLabels[place.category]}
                  </span>
                  <span className="rounded-full bg-[#edf2f6] px-3 py-1 text-xs font-semibold text-[#5d7183]">
                    {priorityLabels[place.priority]}
                  </span>
                  <span className="rounded-full bg-[#f5f7fa] px-3 py-1 text-xs font-semibold text-[#667a8d]">
                    {placeStatusLabels[place.status]}
                  </span>
                </div>
                <h3 className="mt-2 text-[1rem] font-black leading-tight tracking-[-0.03em] text-[#24394d]">
                  {place.title}
                </h3>
                <p className="mt-1 text-sm text-[#6a7d8f]">{place.district}</p>
                {place.address ? (
                  <p className="mt-1 text-[11px] leading-5 text-[#8090a0]">{place.address}</p>
                ) : null}
                <p className="mt-3 text-[12px] leading-5 text-[#53687b]">
                  {placeFeatureCopy(place)}
                </p>
                {place.originalQuote ? (
                  <div className="mt-3 rounded-[1.2rem] border border-[#ffe1ab] bg-[#fff8e8] px-4 py-3 text-sm leading-6 text-[#7a5c28]">
                    <div className="mb-1 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#9b7327]">
                      <Quote className="h-3.5 w-3.5" />
                      原句
                    </div>
                    <p>"{place.originalQuote}"</p>
                  </div>
                ) : null}
                <p className="mt-3 text-xs leading-6 text-[#72879a]">
                  相關日子：{relatedDayLabels(selectedCity, place.id).join("、") || "尚未編入建議行程"}
                </p>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <a
                href={getPlaceNaverUrl(place)}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 rounded-full border border-[#d8e3ec] bg-white px-4 py-2 text-[12px] font-semibold text-[#35556f]"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                NAVER Map
              </a>
              <Button
                className="rounded-full bg-[linear-gradient(135deg,#8ea5bf,#d8b3be)] text-white shadow-[0_16px_24px_rgba(147,162,183,0.22)] hover:opacity-95"
                onClick={() => addPlaceToToday(place)}
              >
                加入今日
              </Button>
              <Button
                variant="outline"
                className="rounded-full border-[#e1d8d8] bg-[#fffaf7] text-[#687d90]"
                onClick={() => openEditor(undefined, place)}
              >
                <PenLine className="mr-2 h-4 w-4" />
                編輯地點
              </Button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );

  // ── render: shopping page ─────────────────────────────────────────────────

  const renderShoppingPage = () => {
    const shoppingItems = SHOPPING_ITEMS.filter(
      item => item.city === selectedCity.name || item.city === "共用",
    );

    const categoryTone = (category: string) => {
      switch (category) {
        case "ticket":    return "bg-[#fff1e8] text-[#8b6a60]";
        case "transport": return "bg-[#eef4fb] text-[#55728d]";
        case "beauty":    return "bg-[#fbedf4] text-[#8c6680]";
        case "souvenir":  return "bg-[#f6f2e8] text-[#7f6b45]";
        case "food":      return "bg-[#fff6dc] text-[#8b681f]";
        case "daily":     return "bg-[#f2f7f2] text-[#687f6b]";
        default:          return "bg-[#edf2f6] text-[#5d7183]";
      }
    };

    const statusTone = (status: string) => {
      switch (status) {
        case "bought":  return "bg-[#eef7ef] text-[#336949]";
        case "consider":return "bg-[#fff4ea] text-[#8d6757]";
        case "local":   return "bg-[#eff4f8] text-[#52677b]";
        default:        return "bg-[#edf2f6] text-[#5d7183]";
      }
    };

    return (
      <section className="space-y-5">
        <div className="romantic-shell rounded-[1.5rem] px-3.5 py-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/80 bg-white/72 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#7e7884]">
            <Sparkles className="h-3.5 w-3.5" />
            Tickets & Little Finds
          </div>
          <h2 className="mt-2 text-[1.22rem] font-black tracking-[-0.04em] text-[#334b61]">
            可考慮購買清單
          </h2>
          <p className="mt-2 text-[12px] leading-5 text-[#67798b]">
            把適合購買的保養品、零食、伴手禮整理在這裡。Olive Young、Pharmacy 與韓國零食可加入個人文字與相片，方便現場比較與回看。
          </p>
        </div>

        <div className="space-y-3">
          {shoppingItems.map(item => {
            const isCustomShoppingItem = CUSTOM_SHOPPING_ITEM_IDS.has(item.id);
            const personalText = shoppingText[item.id] ?? "";
            const itemPhotos = photoMap[item.id] ?? [];
            const itemUploadStatuses = uploadStatuses.filter((s: UploadStatus) => s.itemId === item.id);
            const inputId = `shopping-photo-upload-${item.id}`;

            return (
              <article
                key={item.id}
                className="rounded-[1.35rem] border border-[#e3e8ee] bg-[#fffdfb] px-3.5 py-3.5 shadow-[0_12px_30px_rgba(117,136,158,0.08)]"
              >
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${categoryTone(item.category)}`}>
                    {shoppingCategoryLabel(item.category)}
                  </span>
                  <span className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${statusTone(item.status)}`}>
                    {shoppingStatusLabel(item.status)}
                  </span>
                  <span className="rounded-full bg-[#f5f7fa] px-2.5 py-1 text-[10px] font-semibold text-[#667a8d]">
                    {item.city}
                  </span>
                </div>

                <h3 className="mt-2 text-[1rem] font-black leading-tight tracking-[-0.03em] text-[#24394d]">
                  {item.title}
                </h3>

                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  {item.relatedDay ? (
                    <span className="rounded-full bg-[#f1f5f8] px-2.5 py-1 text-[10px] font-semibold text-[#60788d]">
                      {item.relatedDay}
                    </span>
                  ) : null}
                  {item.price ? (
                    <span className="rounded-full bg-[#fff8e8] px-2.5 py-1 text-[10px] font-semibold text-[#8a6b31]">
                      {item.price}
                    </span>
                  ) : null}
                </div>

                <p className="mt-2.5 text-[12px] leading-5 text-[#617486]">
                  {item.note}
                </p>

                {isCustomShoppingItem ? (
                  <div className="mt-3 rounded-[1.2rem] border border-[#eadfe5] bg-[linear-gradient(180deg,rgba(255,248,251,0.92),rgba(248,251,253,0.9))] px-3 py-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#9a7b8a]">
                          Personal Shopping Notes
                        </p>
                        <p className="mt-1 text-[11px] leading-5 text-[#6b7c8c]">
                          可加入想買清單、色號、品牌、價錢比較或現場試用感想。
                          {itemPhotos.length > 0
                            ? ` 已加入 ${itemPhotos.length} 張相片。`
                            : ""}
                        </p>
                      </div>

                      <label
                        htmlFor={inputId}
                        className="inline-flex shrink-0 cursor-pointer items-center gap-1.5 rounded-full border border-[#e5d6dd] bg-white/88 px-3 py-1.5 text-[11px] font-semibold text-[#7d6573] shadow-[0_8px_16px_rgba(128,105,118,0.08)]"
                      >
                        <ImagePlus className="h-3.5 w-3.5" />
                        上傳相片
                      </label>

                      <input
                        id={inputId}
                        type="file"
                        accept="image/*"
                        multiple
                        className="hidden"
                        onChange={event => {
                          uploadPhotos(item.id, event.target.files);
                          event.target.value = "";
                        }}
                      />
                    </div>

                    {itemUploadStatuses.length > 0 ? (
                      <div className="mt-2 space-y-1.5">
                        {itemUploadStatuses.map((s: UploadStatus) => (
                          <div
                            key={s.fileName}
                            className={`flex items-center gap-2 rounded-[0.9rem] px-3 py-2 text-[11px] font-semibold ${
                              s.progress === "error"
                                ? "bg-[#fff1f1] text-[#8b4a4a]"
                                : s.progress === "done"
                                  ? "bg-[#eef7ef] text-[#336949]"
                                  : "bg-[#f4f8fb] text-[#55728d]"
                            }`}
                          >
                            {s.progress === "compressing" && (
                              <>
                                <span className="animate-spin inline-block">⏳</span>
                                <span className="truncate">{s.fileName} — 壓縮中…</span>
                              </>
                            )}
                            {s.progress === "saving" && (
                              <>
                                <span className="animate-pulse inline-block">💾</span>
                                <span className="truncate">{s.fileName} — 儲存中…</span>
                              </>
                            )}
                            {s.progress === "done" && (
                              <span className="truncate">✅ {s.fileName} — 已完成</span>
                            )}
                            {s.progress === "error" && (
                              <span className="truncate">❌ {s.fileName} — {s.error}</span>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : null}

                    <textarea
                      value={personalText}
                      onChange={event => updateShoppingUserText(item.id, event.target.value)}
                      placeholder={
                        item.id === "olive-young-beauty"
                          ? "例如：Torriden 面膜、Round Lab 防曬、Aestura cream、想比較優惠組合..."
                          : item.id === "pharmacy-beauty"
                            ? "例如：藥局痘痘貼、修復霜、敏感肌保養、想問店員的產品..."
                            : "例如：Honey Butter Almond、Market O、海苔、送同事伴手禮數量..."
                      }
                      className="mt-3 min-h-[92px] w-full resize-none rounded-[1rem] border border-[#e1e8ef] bg-white/86 px-3 py-2.5 text-[12px] leading-5 text-[#31495f] outline-none placeholder:text-[#9aabb8]"
                    />

                    {itemPhotos.length > 0 ? (
                      <div className="mt-3 grid grid-cols-3 gap-2">
                        {itemPhotos.map((photo: ShoppingPhoto) => (
                          <div
                            key={photo.id}
                            className="group relative overflow-hidden rounded-[1rem] border border-white/80 bg-white shadow-[0_10px_20px_rgba(117,136,158,0.1)]"
                          >
                            <img
                              src={photo.objectUrl}
                              alt={photo.name}
                              className="aspect-square w-full object-cover"
                              loading="lazy"
                            />
                            <span className="absolute bottom-1 left-1.5 rounded-full bg-black/40 px-1.5 py-0.5 text-[9px] font-semibold text-white/90">
                              {photo.sizeKb > 999
                                ? `${(photo.sizeKb / 1024).toFixed(1)} MB`
                                : `${photo.sizeKb} KB`}
                            </span>
                            <button
                              type="button"
                              onClick={() => removeShoppingPhoto(item.id, photo.id)}
                              className="absolute right-1.5 top-1.5 rounded-full bg-white/92 p-1 text-[#7d6573] shadow-[0_8px_14px_rgba(70,50,60,0.16)]"
                              aria-label="移除相片"
                            >
                              <X className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="mt-3 rounded-[1rem] border border-dashed border-[#d9e2ea] bg-white/56 px-3 py-4 text-center">
                        <p className="text-[11px] font-semibold text-[#7a8b9a]">
                          尚未加入相片
                        </p>
                        <p className="mt-1 text-[10px] leading-4 text-[#93a3af]">
                          支援大圖上傳，自動壓縮後儲存於裝置本地。
                        </p>
                      </div>
                    )}
                  </div>
                ) : null}
              </article>
            );
          })}
        </div>
      </section>
    );
  };

  // ── render: calculator page ───────────────────────────────────────────────

  const renderCalculatorPage = () => (
    <section className="space-y-5">
      <div className="romantic-shell rounded-[1.5rem] px-3.5 py-4">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/80 bg-white/72 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#7e7884]">
          <Calculator className="h-3.5 w-3.5" />
          計算機
        </div>
        <h2 className="mt-2 text-[1.18rem] font-black tracking-[-0.04em] text-[#334b61]">
          旅途常用換算與記帳工具
        </h2>
        <p className="mt-2 text-[12px] leading-5 text-[#67798b]">
          此頁整理成更適合旅遊現場使用的匯率換算與支出記錄工具。
        </p>
      </div>

      <div className="grid gap-4">
        <article className="romantic-shell rounded-[1.45rem] px-3.5 py-4">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#fff4dc] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#8b611f]">
            <CircleDollarSign className="h-3.5 w-3.5" />
            {CALCULATOR_MODULES[0].title}
          </div>
          <p className="mt-3 text-[12px] leading-5 text-[#5f7386]">
            {CALCULATOR_MODULES[0].description}
          </p>
          <div className="mt-4 grid gap-3">
            <label className="rounded-[1.2rem] border border-[#dce5ed] bg-[#f8fbfd] px-4 py-3">
              <span className="block text-xs font-semibold text-[#738799]">
                韓元金額
              </span>
              <input
                value={currencyKrw}
                onChange={event => setCurrencyKrw(event.target.value)}
                inputMode="decimal"
                className="mt-2 w-full bg-transparent text-lg font-semibold text-[#163046] outline-none"
                placeholder="例如 18000"
              />
            </label>
            <label className="rounded-[1.2rem] border border-[#dce5ed] bg-[#f8fbfd] px-4 py-3">
              <span className="block text-xs font-semibold text-[#738799]">
                參考匯率
              </span>
              <input
                value={currencyRate}
                onChange={event => setCurrencyRate(event.target.value)}
                inputMode="decimal"
                className="mt-2 w-full bg-transparent text-lg font-semibold text-[#163046] outline-none"
                placeholder="例如 0.0057"
              />
            </label>
          </div>
          <div className="mt-4 rounded-[1.4rem] bg-[linear-gradient(135deg,#8ea5bf,#d7b2bd)] px-4 py-4 text-white shadow-[0_18px_28px_rgba(147,162,182,0.24)]">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/72">
              換算結果
            </p>
            <p className="mt-2 text-3xl font-black">
              {currencyResult ? `${currencyResult}` : "—"}
            </p>
            <p className="mt-2 text-sm text-white/78">
              可用作快速判斷餐費、購物金額與現場付款參考。
            </p>
          </div>
        </article>

        <article className="romantic-shell rounded-[1.45rem] px-3.5 py-4">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#eef7ef] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#336949]">
            <Route className="h-3.5 w-3.5" />
            剩餘現金與消費記帳
          </div>
          <p className="mt-3 text-[12px] leading-5 text-[#5f7386]">
            集中記錄現金與信用卡支出，方便即時知道手上還有多少韓元可用。
          </p>
          <div className="mt-4 grid gap-3">
            <div className="grid gap-2.5 sm:grid-cols-2">
              <label className="rounded-[1.2rem] border border-[#dce5ed] bg-[#f8fbfd] px-3.5 py-3">
                <span className="block text-xs font-semibold text-[#738799]">
                  起始現金（KRW）
                </span>
                <input
                  value={cashStart}
                  onChange={event => setCashStart(event.target.value)}
                  inputMode="decimal"
                  className="mt-2 w-full bg-transparent text-base font-semibold text-[#163046] outline-none"
                  placeholder="例如 300000"
                />
              </label>
              <label className="rounded-[1.2rem] border border-[#dce5ed] bg-[#f8fbfd] px-3.5 py-3">
                <span className="block text-xs font-semibold text-[#738799]">
                  追加現金（KRW）
                </span>
                <input
                  value={cashTopUp}
                  onChange={event => setCashTopUp(event.target.value)}
                  inputMode="decimal"
                  className="mt-2 w-full bg-transparent text-base font-semibold text-[#163046] outline-none"
                  placeholder="例如 50000"
                />
              </label>
            </div>

            <div className="grid gap-2 rounded-[1.2rem] border border-[#e5ebf1] bg-[#fffdfb] px-3 py-3">
              <p className="text-xs font-semibold text-[#738799]">新增記帳</p>
              <input
                value={expenseLabel}
                onChange={event => setExpenseLabel(event.target.value)}
                className="rounded-[0.95rem] border border-[#dde6ee] bg-[#f8fbfd] px-3 py-2 text-[13px] text-[#163046] outline-none"
                placeholder="例如：海雲台晚餐、計程車、便利店"
              />
              <div className="grid gap-2 sm:grid-cols-[1fr_auto]">
                <input
                  value={expenseAmount}
                  onChange={event => setExpenseAmount(event.target.value)}
                  inputMode="decimal"
                  className="rounded-[0.95rem] border border-[#dde6ee] bg-[#f8fbfd] px-3 py-2 text-[13px] text-[#163046] outline-none"
                  placeholder="金額（KRW）"
                />
                <select
                  value={expenseMethod}
                  onChange={event => setExpenseMethod(event.target.value as "cash" | "card")}
                  className="rounded-[0.95rem] border border-[#dde6ee] bg-[#f8fbfd] px-3 py-2 text-[13px] font-medium text-[#163046] outline-none"
                >
                  <option value="cash">現金</option>
                  <option value="card">信用卡</option>
                </select>
              </div>
              <Button
                className="rounded-full bg-[#6c879d] py-2 text-[12px] text-white hover:bg-[#587287]"
                onClick={addExpenseEntry}
              >
                加入記帳
              </Button>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-3">
            <div className="rounded-[1.1rem] bg-[#fff6d8] px-3 py-3 text-[#6f5218]">
              <p className="text-[10px] font-semibold text-[#97712b]">剩餘現金</p>
              <p className="mt-1.5 text-lg font-black">{availableCash.toLocaleString()}</p>
            </div>
            <div className="rounded-[1.1rem] bg-[#edf5ff] px-3 py-3 text-[#275d7d]">
              <p className="text-[10px] font-semibold text-[#5b7b98]">現金支出</p>
              <p className="mt-1.5 text-lg font-black">{cashSpent.toLocaleString()}</p>
            </div>
            <div className="rounded-[1.1rem] bg-[#fff1f6] px-3 py-3 text-[#8a4e6c]">
              <p className="text-[10px] font-semibold text-[#a16f87]">信用卡支出</p>
              <p className="mt-1.5 text-lg font-black">{cardSpent.toLocaleString()}</p>
            </div>
          </div>

          <div className="mt-3 rounded-[1.2rem] border border-[#e7edf3] bg-[#f8fbfd] px-3.5 py-3">
            <div className="flex items-center justify-between gap-3">
              <p className="text-xs font-semibold text-[#5f7386]">總支出</p>
              <p className="text-sm font-black text-[#24394d]">
                {totalSpent.toLocaleString()} KRW
              </p>
            </div>
            <div className="mt-3 space-y-2">
              {expenseLog.map(item => (
                <div
                  key={item.id}
                  className="flex items-center justify-between gap-2 rounded-[1rem] border border-[#e4e9ef] bg-white px-3 py-2.5"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[12px] font-semibold text-[#24394d]">
                      {item.label}
                    </p>
                    <p className="mt-0.5 text-[11px] text-[#6c7f90]">
                      {item.method === "cash" ? "現金" : "信用卡"}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <p className="text-[11px] font-black text-[#24394d] sm:text-[12px]">
                      {item.amount.toLocaleString()}
                    </p>
                    <button
                      type="button"
                      className="rounded-full border border-[#e0e6ed] bg-[#fffdfb] p-1.5 text-[#72879a]"
                      onClick={() => removeExpenseEntry(item.id)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </article>
      </div>
    </section>
  );

  // ── root render ───────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-transparent text-[#31495f]">
      <div className="mx-auto min-h-screen w-full max-w-[430px] px-4 pb-28 pt-4">

        <header className="sticky top-0 z-30 -mx-4 border-b border-white/55 bg-[rgba(248,243,236,0.76)] px-4 pb-4 pt-4 backdrop-blur-xl">
          <div className="romantic-shell rounded-[1.85rem] px-4 py-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="editorial-kicker normal-case text-xs font-normal text-[#8b7987]">
                  Arvin and Camille Korea Journal
                </p>
                <h1 className="mt-1 text-[1.55rem] font-black text-[#334b61]">
                  {selectedCity.name}
                </h1>
              </div>
              <div className="flex gap-2">
                {trip.cities.map(city => (
                  <button
                    key={city.id}
                    type="button"
                    onClick={() => setSelectedCityId(city.id)}
                    className={`rounded-full px-4 py-2 text-sm font-semibold ${
                      selectedCityId === city.id
                        ? "bg-[linear-gradient(135deg,#8fa5bf,#d8b4be)] text-white shadow-[0_14px_24px_rgba(146,161,183,0.22)]"
                        : "bg-white/76 text-[#647789] border border-white/80"
                    }`}
                  >
                    {city.name}
                  </button>
                ))}
              </div>
            </div>
            <p className="mt-3 text-[12px] leading-5 text-[#67798b]">
              {selectedCity.subtitle}
            </p>
          </div>
        </header>

        <main className="pt-4">
          {optionsDayId ? (
            renderOptionPage()
          ) : activeTab === "itinerary" ? (
            renderSuggestedItinerary()
          ) : activeTab === "map" ? (
            renderMapPage()
          ) : activeTab === "library" ? (
            renderLibraryPage()
          ) : activeTab === "shopping" ? (
            renderShoppingPage()
          ) : activeTab === "calculator" ? (
            renderCalculatorPage()
          ) : (
            renderSuggestedItinerary()
          )}
        </main>

        {editorDraft ? (
          <div className="fixed inset-0 z-50 flex items-end justify-center bg-[rgba(58,73,92,0.28)] p-3 backdrop-blur-sm">
            <div className="max-h-[88vh] w-full max-w-[430px] overflow-y-auto rounded-[2rem] border border-white/85 bg-[linear-gradient(180deg,rgba(255,253,249,0.98),rgba(248,242,236,0.95))] p-4 shadow-[0_30px_80px_rgba(125,139,160,0.24)]">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="editorial-kicker text-[11px] font-semibold text-[#8b7987]">
                    編輯行程
                  </p>
                  <h3 className="mt-1 text-xl font-black text-[#334b61]">
                    調整時間、地點與說明
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setEditorDraft(null)}
                  className="rounded-full border border-white/80 bg-white/76 px-3 py-2 text-sm font-semibold text-[#64778a] shadow-[0_10px_18px_rgba(136,147,160,0.12)]"
                >
                  關閉
                </button>
              </div>

              <div className="mt-4 grid gap-3">
                <label className="rounded-[1.2rem] border border-[#dce5ed] bg-[#f8fbfd] px-3.5 py-3">
                  <span className="block text-xs font-semibold text-[#738799]">名稱</span>
                  <input
                    value={editorDraft.title}
                    onChange={event => setEditorDraft({ ...editorDraft, title: event.target.value })}
                    className="mt-2 w-full bg-transparent text-base font-semibold text-[#163046] outline-none"
                  />
                </label>

                <label className="rounded-[1.2rem] border border-[#dce5ed] bg-[#f8fbfd] px-3.5 py-3">
                  <span className="block text-xs font-semibold text-[#738799]">時間</span>
                  <input
                    value={editorDraft.time}
                    onChange={event => setEditorDraft({ ...editorDraft, time: event.target.value })}
                    className="mt-2 w-full bg-transparent text-base font-semibold text-[#163046] outline-none"
                  />
                </label>

                <label className="rounded-[1.2rem] border border-[#dce5ed] bg-[#f8fbfd] px-3.5 py-3">
                  <span className="block text-xs font-semibold text-[#738799]">地區</span>
                  <input
                    value={editorDraft.district}
                    onChange={event => setEditorDraft({ ...editorDraft, district: event.target.value })}
                    className="mt-2 w-full bg-transparent text-base font-semibold text-[#163046] outline-none"
                  />
                </label>

                <label className="rounded-[1.2rem] border border-[#dce5ed] bg-[#f8fbfd] px-3.5 py-3">
                  <span className="block text-xs font-semibold text-[#738799]">地址</span>
                  <input
                    value={editorDraft.address}
                    onChange={event => setEditorDraft({ ...editorDraft, address: event.target.value })}
                    className="mt-2 w-full bg-transparent text-base font-semibold text-[#163046] outline-none"
                  />
                </label>

                <label className="rounded-[1.2rem] border border-[#dce5ed] bg-[#f8fbfd] px-3.5 py-3">
                  <span className="block text-xs font-semibold text-[#738799]">說明</span>
                  <textarea
                    value={editorDraft.description}
                    onChange={event => setEditorDraft({ ...editorDraft, description: event.target.value })}
                    className="mt-2 min-h-[100px] w-full resize-none bg-transparent text-[12px] leading-5 text-[#163046] outline-none"
                  />
                </label>

                <label className="rounded-[1.2rem] border border-[#dce5ed] bg-[#f8fbfd] px-3.5 py-3">
                  <span className="block text-xs font-semibold text-[#738799]">原句</span>
                  <textarea
                    value={editorDraft.originalQuote}
                    onChange={event => setEditorDraft({ ...editorDraft, originalQuote: event.target.value })}
                    className="mt-2 min-h-[80px] w-full resize-none bg-transparent text-[12px] leading-5 text-[#163046] outline-none"
                  />
                </label>

                <label className="rounded-[1.2rem] border border-[#dce5ed] bg-[#f8fbfd] px-3.5 py-3">
                  <span className="block text-xs font-semibold text-[#738799]">備註</span>
                  <textarea
                    value={editorDraft.note}
                    onChange={event => setEditorDraft({ ...editorDraft, note: event.target.value })}
                    className="mt-2 min-h-[80px] w-full resize-none bg-transparent text-[12px] leading-5 text-[#163046] outline-none"
                  />
                </label>
              </div>

              <div className="mt-5 flex gap-2">
                <Button
                  className="flex-1 rounded-full bg-[linear-gradient(135deg,#8ca4bf,#d7b3be)] text-white shadow-[0_18px_26px_rgba(148,164,183,0.24)] hover:opacity-95"
                  onClick={saveEditor}
                >
                  儲存
                </Button>
                <Button
                  variant="outline"
                  className="rounded-full border-[#e4d8d5] bg-[#fffaf7] text-[#6f7e8d]"
                  onClick={deleteStop}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  刪除
                </Button>
              </div>
            </div>
          </div>
        ) : null}

        {!optionsDayId ? (
          <nav className="fixed bottom-0 left-1/2 z-40 flex w-full max-w-[430px] -translate-x-1/2 gap-2 border-t border-white/65 bg-[rgba(248,243,236,0.84)] px-3 pb-[calc(env(safe-area-inset-bottom)+12px)] pt-3 backdrop-blur-xl">
            {MAIN_TABS.map(tab => {
              const Icon =
                tab.id === "itinerary"
                  ? CalendarDays
                  : tab.id === "map"
                    ? MapPinned
                    : tab.id === "library"
                      ? LibraryBig
                      : tab.id === "shopping"
                        ? Sparkles
                        : tab.id === "calculator"
                          ? Calculator
                          : StickyNote;

              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex min-w-0 flex-1 flex-col items-center gap-1 rounded-[1.15rem] px-2 py-3 text-center transition ${
                    activeTab === tab.id
                      ? "bg-[linear-gradient(135deg,#89a4be,#d6b2bd)] text-white shadow-[0_16px_26px_rgba(145,160,182,0.24)]"
                      : "bg-white/82 text-[#688094]"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="text-[11px] font-semibold leading-tight">
                    {tab.shortLabel}
                  </span>
                </button>
              );
            })}
          </nav>
        ) : null}

      </div>
    </div>
  );
}

