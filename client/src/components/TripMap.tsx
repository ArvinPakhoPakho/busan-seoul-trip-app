/*
  Style reminder for this component:
  - The map should feel like a romantic planning surface, not a technical utilities panel.
  - Mist blue, cream, blush, and blue-grey should carry both markers and detail cards.
  - Highlights may feel warm and expressive, but never loud or juvenile.
*/

import { useEffect, useMemo, useRef, useState } from "react";
import { Compass, MapPinned, Quote, Sparkles } from "lucide-react";
import { MapView } from "@/components/Map";
import { categoryLabels, placeStatusLabels, type TripPlace } from "@/lib/trip-data";

interface TripMapProps {
  places: TripPlace[];
  highlightPlaceIds: string[];
  activePlaceId: string | null;
  mode: "focus" | "all";
  onActiveChange: (placeId: string) => void;
}

interface ResolvedLocation {
  placeId: string;
  title: string;
  district: string;
  address: string;
  description: string;
  originalQuote?: string;
  status: TripPlace["status"];
  category: TripPlace["category"];
  isHighlighted: boolean;
  position: google.maps.LatLngLiteral;
}

function categorySymbol(category: TripPlace["category"]): string {
  switch (category) {
    case "food":
      return "🍽";
    case "cafe":
      return "🍓";
    case "activity":
      return "🎟";
    case "spa":
      return "♨";
    case "market":
      return "🛍";
    case "shopping":
      return "👜";
    case "travel":
      return "🚉";
    case "stay":
      return "🛏";
    case "sight":
    default:
      return "📍";
  }
}

function createMarkerNode(location: ResolvedLocation, active: boolean): HTMLDivElement {
  const wrapper = document.createElement("div");
  const bgColor = active
    ? "linear-gradient(135deg, #6f859d, #8ea7c0)"
    : location.isHighlighted
      ? "linear-gradient(135deg, #f4e0d8, #e7bcc6)"
      : location.status === "dropped"
        ? "linear-gradient(135deg, #f5e8eb, #eadde2)"
        : "linear-gradient(135deg, #fffdf8, #eef3f6)";
  const textColor = active ? "#ffffff" : location.isHighlighted ? "#8a6870" : "#52697d";
  const labelBg = active
    ? "rgba(255,255,255,0.16)"
    : location.isHighlighted
      ? "rgba(255,250,247,0.72)"
      : "rgba(255,255,255,0.86)";

  wrapper.style.display = "flex";
  wrapper.style.alignItems = "center";
  wrapper.style.gap = "10px";
  wrapper.style.padding = active ? "10px 14px" : "9px 12px";
  wrapper.style.borderRadius = "999px";
  wrapper.style.border = active
    ? "1px solid rgba(255,255,255,0.18)"
    : "1px solid rgba(115,131,150,0.14)";
  wrapper.style.background = bgColor;
  wrapper.style.boxShadow = active
    ? "0 16px 34px rgba(120,138,160,0.26)"
    : "0 10px 22px rgba(135,149,166,0.14)";
  wrapper.style.color = textColor;
  wrapper.style.transform = active ? "translateY(-2px) scale(1.02)" : "translateY(0px) scale(1)";
  wrapper.style.transition = "all 160ms ease";

  const emoji = document.createElement("span");
  emoji.textContent = location.isHighlighted ? "🦆" : categorySymbol(location.category);
  emoji.style.display = "inline-flex";
  emoji.style.alignItems = "center";
  emoji.style.justifyContent = "center";
  emoji.style.width = "28px";
  emoji.style.height = "28px";
  emoji.style.borderRadius = "999px";
  emoji.style.background = labelBg;
  emoji.style.fontSize = "14px";

  const label = document.createElement("span");
  label.textContent = location.title;
  label.style.maxWidth = active ? "180px" : "140px";
  label.style.whiteSpace = "nowrap";
  label.style.overflow = "hidden";
  label.style.textOverflow = "ellipsis";
  label.style.fontWeight = "800";
  label.style.fontSize = active ? "13px" : "12px";
  label.style.letterSpacing = "0.01em";

  wrapper.appendChild(emoji);
  wrapper.appendChild(label);
  return wrapper;
}

export default function TripMap({
  places,
  highlightPlaceIds,
  activePlaceId,
  mode,
  onActiveChange,
}: TripMapProps) {
  const mapRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.marker.AdvancedMarkerElement[]>([]);
  const cacheRef = useRef<Record<string, google.maps.LatLngLiteral>>({});
  const [resolvedLocations, setResolvedLocations] = useState<ResolvedLocation[]>([]);
  const [mapTick, setMapTick] = useState<number>(0);

  const highlightSet = useMemo(() => new Set(highlightPlaceIds), [highlightPlaceIds]);

  const visiblePlaces = useMemo<TripPlace[]>(() => {
    const mappedPlaces = places.filter((place: TripPlace) => place.address && place.address.trim().length > 0);
    if (mode === "focus") {
      return mappedPlaces.filter((place: TripPlace) => highlightSet.has(place.id));
    }
    return mappedPlaces;
  }, [highlightSet, mode, places]);

  useEffect(() => {
    if (!mapRef.current || !window.google) return;

    let cancelled = false;
    const geocoder = new google.maps.Geocoder();

    const clearMarkers = () => {
      markersRef.current.forEach(marker => {
        marker.map = null;
      });
      markersRef.current = [];
    };

    const geocodeAddress = async (address: string) => {
      if (cacheRef.current[address]) return cacheRef.current[address];
      const result = await geocoder.geocode({ address, region: "KR" });
      const location = result.results?.[0]?.geometry?.location;
      if (!location) return null;
      const latLng = { lat: location.lat(), lng: location.lng() };
      cacheRef.current[address] = latLng;
      return latLng;
    };

    const drawMap = async () => {
      clearMarkers();

      const nextLocations: ResolvedLocation[] = [];
      for (const place of visiblePlaces) {
        const position = await geocodeAddress(place.address as string);
        if (!position) continue;
        nextLocations.push({
          placeId: place.id,
          title: place.title,
          district: place.district,
          address: place.address as string,
          description: place.description,
          originalQuote: place.originalQuote,
          status: place.status,
          category: place.category,
          isHighlighted: highlightSet.has(place.id),
          position,
        });
      }

      if (cancelled || !mapRef.current) return;

      setResolvedLocations(nextLocations);

      const bounds = new google.maps.LatLngBounds();
      nextLocations.forEach(location => {
        const marker = new google.maps.marker.AdvancedMarkerElement({
          map: mapRef.current!,
          position: location.position,
          title: location.title,
          content: createMarkerNode(location, location.placeId === activePlaceId),
        });
        marker.addListener("click", () => onActiveChange(location.placeId));
        markersRef.current.push(marker);
        bounds.extend(location.position);
      });

      if (nextLocations.length === 1) {
        mapRef.current.setCenter(nextLocations[0].position);
        mapRef.current.setZoom(14);
      } else if (nextLocations.length > 1) {
        mapRef.current.fitBounds(bounds, 64);
      }
    };

    void drawMap();

    return () => {
      cancelled = true;
      clearMarkers();
    };
  }, [activePlaceId, highlightSet, mapTick, mode, onActiveChange, visiblePlaces]);

  useEffect(() => {
    if (!mapRef.current || !activePlaceId) return;
    const current = resolvedLocations.find((location: ResolvedLocation) => location.placeId === activePlaceId);
    if (!current) return;
    mapRef.current.panTo(current.position);
  }, [activePlaceId, resolvedLocations]);

  const activeLocation =
    resolvedLocations.find((location: ResolvedLocation) => location.placeId === activePlaceId) ||
    resolvedLocations[0] ||
    null;

  return (
    <div className="space-y-4">
      <div className="romantic-shell overflow-hidden rounded-[1.8rem] p-3 shadow-[0_22px_60px_rgba(126,141,160,0.14)]">
        <div className="overflow-hidden rounded-[1.35rem] border border-white/75">
          <MapView
            className="h-[340px] w-full md:h-[520px]"
            initialCenter={{ lat: 35.1796, lng: 129.0756 }}
            initialZoom={12}
            onMapReady={map => {
              mapRef.current = map;
              setMapTick(value => value + 1);
            }}
          />
        </div>
      </div>

      <div className="romantic-shell rounded-[1.8rem] p-5">
        {activeLocation ? (
          <div className="space-y-4">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-white/80 bg-white/72 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#7c7683]">
                  <MapPinned className="h-3.5 w-3.5" />
                  {mode === "focus" ? "今日焦點位置" : "完整點位庫中的焦點"}
                </div>
                <h3 className="mt-3 text-xl font-black text-[#334b61] md:text-2xl">{activeLocation.title}</h3>
                <p className="mt-2 text-sm text-[#6a7c8d]">{activeLocation.district}</p>
                <p className="mt-3 text-sm leading-7 text-[#5d7184]">{activeLocation.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-3 md:min-w-[210px]">
                <div className="rounded-[1.2rem] border border-white/75 bg-[rgba(255,255,255,0.72)] px-4 py-3">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#7a8f9f]">正在顯示</p>
                  <p className="mt-2 text-2xl font-black text-[#173149]">{resolvedLocations.length}</p>
                  <p className="mt-1 text-xs text-[#6b7f90]">地圖點位</p>
                </div>
                <div className="rounded-[1.2rem] border border-white/75 bg-[rgba(255,247,242,0.86)] px-4 py-3">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#8a6928]">今日高亮</p>
                  <p className="mt-2 text-2xl font-black text-[#6d4f14]">{highlightPlaceIds.length}</p>
                  <p className="mt-1 text-xs text-[#8a7344]">個相關位置</p>
                </div>
              </div>
            </div>

            <div className="grid gap-3 md:grid-cols-3">
              <div className="rounded-[1.2rem] border border-[#e6eaee] bg-[rgba(255,255,255,0.76)] px-4 py-3 text-sm leading-6 text-[#5a6f82]">
                <div className="mb-2 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#708596]">
                  <Compass className="h-3.5 w-3.5" />
                  地址 / 搜尋字串
                </div>
                <p>{activeLocation.address}</p>
              </div>
              <div className="rounded-[1.2rem] border border-[#e6eaee] bg-[rgba(255,255,255,0.76)] px-4 py-3 text-sm leading-6 text-[#5a6f82]">
                <div className="mb-2 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#708596]">
                  <Sparkles className="h-3.5 w-3.5" />
                  分類 / 狀態
                </div>
                <p>
                  {categoryLabels[activeLocation.category]} · {placeStatusLabels[activeLocation.status]}
                </p>
              </div>
              <div className="rounded-[1.2rem] border border-[#e6eaee] bg-[rgba(255,255,255,0.76)] px-4 py-3 text-sm leading-6 text-[#5a6f82]">
                <div className="mb-2 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#708596]">
                  <MapPinned className="h-3.5 w-3.5" />
                  目前模式
                </div>
                <p>{mode === "focus" ? "只看當日較順路的地點" : "顯示這個城市全部已收錄點位"}</p>
              </div>
            </div>

            {activeLocation.originalQuote ? (
              <div className="rounded-[1.35rem] border border-[#ecdcd8] bg-[rgba(255,247,243,0.9)] px-4 py-4 text-sm leading-6 text-[#876c67]">
                <div className="mb-2 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#9f7223]">
                  <Quote className="h-3.5 w-3.5" />
                  原句筆記
                </div>
                <p>“{activeLocation.originalQuote}”</p>
              </div>
            ) : null}
          </div>
        ) : (
          <div className="rounded-[1.5rem] border border-dashed border-[#d9dfe4] bg-[rgba(255,255,255,0.72)] px-4 py-8 text-center text-sm leading-6 text-[#687d8e]">
            目前這個模式下沒有可定位的地址。你可以回到完整點位模式，或者在編輯器補上更明確的地址字串。
          </div>
        )}
      </div>
    </div>
  );
}
