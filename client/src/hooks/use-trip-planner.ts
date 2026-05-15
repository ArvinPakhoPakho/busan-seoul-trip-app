/*
  Style reminder for this hook:
  - State must support multiple pages while preserving a simple, app-like mental model.
  - Editing remains available because itinerary flexibility is a core product requirement.
  - Local storage should persist changes without making the interface feel technical.
*/

import { useCallback, useEffect, useMemo, useState } from "react";
import { nanoid } from "nanoid";
import { toast } from "sonner";
import {
  categoryLabels,
  initialTripData,
  priorityLabels,
  TRIP_STORAGE_KEY,
  type TripAppData,
  type TripCategory,
  type TripCity,
  type TripDay,
  type TripPlace,
  type TripPlaceStatus,
  type TripPriority,
  type TripStop,
  type TripStopRole,
} from "@/lib/trip-data";

export interface EditorDraft {
  stopId: string;
  placeId: string;
  fromDayId: string;
  targetDayId: string;
  time: string;
  note: string;
  title: string;
  district: string;
  address: string;
  description: string;
  originalQuote: string;
  category: TripCategory;
  priority: TripPriority;
  role: TripStopRole;
  status: TripPlaceStatus;
}

export type MapMode = "focus" | "all";
export type CategoryFilter = TripCategory | "all";
export type StatusFilter = TripPlaceStatus | "all";

const DATA_VERSION_KEY = "busan-duck-trip-version";

function getDataSignature(data: unknown): string {
  const str = JSON.stringify(data);
  return `${str.length}-${str.charCodeAt(0)}-${str.charCodeAt(str.length - 1)}`;
}

function getStoredTrip(): TripAppData {
  if (typeof window === "undefined") return initialTripData;

  try {
    const currentSignature = getDataSignature(initialTripData);
    const savedSignature = window.localStorage.getItem(DATA_VERSION_KEY);

    if (savedSignature !== currentSignature) {
      window.localStorage.removeItem(TRIP_STORAGE_KEY);
      window.localStorage.setItem(DATA_VERSION_KEY, currentSignature);
      return initialTripData;
    }

    const raw = window.localStorage.getItem(TRIP_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as TripAppData) : initialTripData;
  } catch {
    return initialTripData;
  }
}


export function buildPlaceMap(city: TripCity): Record<string, TripPlace> {
  return city.places.reduce<Record<string, TripPlace>>((accumulator, place) => {
    accumulator[place.id] = place;
    return accumulator;
  }, {});
}

export function collectDayPlaceIds(day: TripDay): string[] {
  const ids = day.stops.map(stop => stop.placeId);
  day.bookings.forEach(booking => {
    if (booking.relatedPlaceId) ids.push(booking.relatedPlaceId);
  });
  return Array.from(new Set(ids));
}

export function relatedDayLabels(city: TripCity, placeId: string): string[] {
  return city.days
    .filter(day => collectDayPlaceIds(day).includes(placeId))
    .map(day => day.label);
}

function stopSortValue(time: string): number {
  if (time === "待定") return 9999;
  const matched = time.match(/(\d{1,2}):(\d{2})/);
  if (!matched) return 9999;
  return Number(matched[1]) * 60 + Number(matched[2]);
}

export function sortStops(stops: TripStop[]): TripStop[] {
  return [...stops].sort((left, right) => stopSortValue(left.time) - stopSortValue(right.time));
}

export function useTripPlanner() {
  const [trip, setTrip] = useState<TripAppData>(() => getStoredTrip());
  const [selectedCityId, setSelectedCityId] = useState<string>("busan");
  const [selectedDayId, setSelectedDayId] = useState<string>("busan-day-1");
  const [activePlaceId, setActivePlaceId] = useState<string | null>(null);
  const [mapMode, setMapMode] = useState<MapMode>("focus");
  const [librarySearch, setLibrarySearch] = useState<string>("");
  const [libraryCategory, setLibraryCategory] = useState<CategoryFilter>("all");
  const [libraryStatus, setLibraryStatus] = useState<StatusFilter>("all");
  const [editorDraft, setEditorDraft] = useState<EditorDraft | null>(null);

  useEffect(() => {
    window.localStorage.setItem(TRIP_STORAGE_KEY, JSON.stringify(trip));
  }, [trip]);

  const selectedCity = useMemo(
    () => trip.cities.find(city => city.id === selectedCityId) || trip.cities[0],
    [selectedCityId, trip.cities],
  );

  useEffect(() => {
    if (!selectedCity.days.some(day => day.id === selectedDayId)) {
      setSelectedDayId(selectedCity.days[0]?.id ?? "");
    }
  }, [selectedCity, selectedDayId]);

  const selectedDay = useMemo(
    () => selectedCity.days.find(day => day.id === selectedDayId) || selectedCity.days[0] || null,
    [selectedCity.days, selectedDayId],
  );

  const placeMap = useMemo(() => buildPlaceMap(selectedCity), [selectedCity]);

  const dayPlaceIds = useMemo(() => {
    if (!selectedDay) return [];
    return collectDayPlaceIds(selectedDay);
  }, [selectedDay]);

  const highlightedPlaces = useMemo(() => {
    const idSet = new Set(dayPlaceIds);
    return selectedCity.places.filter(place => idSet.has(place.id));
  }, [dayPlaceIds, selectedCity.places]);

  useEffect(() => {
    const availablePlaces = mapMode === "focus" ? highlightedPlaces : selectedCity.places;
    if (!availablePlaces.length) {
      setActivePlaceId(null);
      return;
    }
    if (!activePlaceId || !availablePlaces.some(place => place.id === activePlaceId)) {
      setActivePlaceId(availablePlaces[0].id);
    }
  }, [activePlaceId, highlightedPlaces, mapMode, selectedCity.places]);

  const summary = useMemo(() => {
    const places = selectedCity.places;
    return {
      total: places.length,
      mapped: places.filter(place => Boolean(place.address)).length,
      must: places.filter(place => place.priority === "must").length,
      active: places.filter(place => place.status === "active").length,
    };
  }, [selectedCity.places]);

  const mainStops = useMemo(() => {
    if (!selectedDay) return [];
    return sortStops(selectedDay.stops.filter(stop => stop.role === "main"));
  }, [selectedDay]);

  const optionalStops = useMemo(() => {
    if (!selectedDay) return [];
    return sortStops(selectedDay.stops.filter(stop => stop.role !== "main"));
  }, [selectedDay]);

  const visibleLibraryPlaces = useMemo(() => {
    return selectedCity.places.filter(place => {
      const searchPass =
        librarySearch.trim().length === 0
          ? true
          : [
              place.title,
              place.district,
              place.description,
              place.originalQuote || "",
              place.tags.join(" "),
            ]
              .join(" ")
              .toLowerCase()
              .includes(librarySearch.toLowerCase());

      const categoryPass = libraryCategory === "all" ? true : place.category === libraryCategory;
      const statusPass = libraryStatus === "all" ? true : place.status === libraryStatus;
      return searchPass && categoryPass && statusPass;
    });
  }, [libraryCategory, librarySearch, libraryStatus, selectedCity.places]);

  const updateTrip = useCallback(
    (updater: (draft: TripAppData) => void, successMessage?: string) => {
      setTrip(previous => {
        const draft = structuredClone(previous) as TripAppData;
        updater(draft);
        return draft;
      });
      if (successMessage) toast.success(successMessage);
    },
    [],
  );

  const openEditor = useCallback(
    (stop?: TripStop, place?: TripPlace) => {
      if (!selectedDay) return;

      const draftPlace =
        place ||
        ({
          id: nanoid(),
          title: "",
          category: "food",
          priority: "option",
          status: "active",
          district: "",
          address: "",
          description: "",
          originalQuote: "",
          source: "user",
          tags: [],
        } as TripPlace);

      setEditorDraft({
        stopId: stop?.id || nanoid(),
        placeId: draftPlace.id,
        fromDayId: selectedDay.id,
        targetDayId: selectedDay.id,
        time: stop?.time || "待定",
        note: stop?.note || "",
        title: draftPlace.title,
        district: draftPlace.district,
        address: draftPlace.address || "",
        description: draftPlace.description,
        originalQuote: draftPlace.originalQuote || "",
        category: draftPlace.category,
        priority: draftPlace.priority,
        role: stop?.role || "option",
        status: draftPlace.status,
      });
    },
    [selectedDay],
  );

  const saveEditor = useCallback(() => {
    if (!editorDraft) return;

    updateTrip(draft => {
      const city = draft.cities.find(entry => entry.id === selectedCity.id);
      if (!city) return;

      const fromDay = city.days.find(day => day.id === editorDraft.fromDayId);
      const targetDay = city.days.find(day => day.id === editorDraft.targetDayId);
      if (!targetDay) return;

      const existingPlaceIndex = city.places.findIndex(place => place.id === editorDraft.placeId);
      const nextPlace: TripPlace = {
        id: editorDraft.placeId,
        title: editorDraft.title || "未命名地點",
        category: editorDraft.category,
        priority: editorDraft.priority,
        status: editorDraft.status,
        district: editorDraft.district || "待補區域",
        address: editorDraft.address || undefined,
        naverUrl: existingPlaceIndex >= 0 ? city.places[existingPlaceIndex].naverUrl : undefined,
        description: editorDraft.description || "待補描述",
        originalQuote: editorDraft.originalQuote || undefined,
        source: existingPlaceIndex >= 0 ? city.places[existingPlaceIndex].source : "user",
        tags:
          existingPlaceIndex >= 0
            ? city.places[existingPlaceIndex].tags
            : [categoryLabels[editorDraft.category], priorityLabels[editorDraft.priority]],
      };

      if (existingPlaceIndex >= 0) {
        city.places[existingPlaceIndex] = nextPlace;
      } else {
        city.places.push(nextPlace);
      }

      if (fromDay) {
        fromDay.stops = fromDay.stops.filter(stop => stop.id !== editorDraft.stopId);
      }

      targetDay.stops.push({
        id: editorDraft.stopId,
        placeId: editorDraft.placeId,
        time: editorDraft.time || "待定",
        role: editorDraft.role,
        note: editorDraft.note || "待補備註",
      });
    }, "已儲存行程修改");

    if (editorDraft.targetDayId !== editorDraft.fromDayId) {
      setSelectedDayId(editorDraft.targetDayId);
    }
    setEditorDraft(null);
  }, [editorDraft, selectedCity.id, updateTrip]);

  const deleteStop = useCallback(() => {
    if (!editorDraft) return;
    updateTrip(draft => {
      const city = draft.cities.find(entry => entry.id === selectedCity.id);
      const day = city?.days.find(entry => entry.id === editorDraft.fromDayId);
      if (!day) return;
      day.stops = day.stops.filter(stop => stop.id !== editorDraft.stopId);
    }, "已從該日移除項目");
    setEditorDraft(null);
  }, [editorDraft, selectedCity.id, updateTrip]);

  const addPlaceToToday = useCallback(
    (place: TripPlace) => {
      if (!selectedDay) return;
      const alreadyInDay = selectedDay.stops.some(stop => stop.placeId === place.id);
      if (alreadyInDay) {
        setActivePlaceId(place.id);
        toast.info("這個地點已經在當日清單中，已為你定位到該項目。");
        return;
      }

      updateTrip(draft => {
        const city = draft.cities.find(entry => entry.id === selectedCity.id);
        const day = city?.days.find(entry => entry.id === selectedDay.id);
        if (!day) return;
        day.stops.push({
          id: nanoid(),
          placeId: place.id,
          time: "待定",
          role: "option",
          note: "從完整點位庫加入，可按當日情況再決定是否列入主線。",
        });
      }, `已將「${place.title}」加入 ${selectedDay.label}`);
      setActivePlaceId(place.id);
    },
    [selectedCity.id, selectedDay, updateTrip],
  );

  const resetTrip = useCallback(() => {
    const confirmed = window.confirm("要把所有修改重設回最新整理版嗎？");
    if (!confirmed) return;
    setTrip(initialTripData);
    setSelectedCityId("busan");
    setSelectedDayId("busan-day-1");
    setActivePlaceId(null);
    setMapMode("focus");
    setLibrarySearch("");
    setLibraryCategory("all");
    setLibraryStatus("all");
    setEditorDraft(null);
    toast.success("已重設回最新整理版本");
  }, []);

  return {
    trip,
    setTrip,
    selectedCity,
    selectedCityId,
    setSelectedCityId,
    selectedDay,
    selectedDayId,
    setSelectedDayId,
    activePlaceId,
    setActivePlaceId,
    mapMode,
    setMapMode,
    librarySearch,
    setLibrarySearch,
    libraryCategory,
    setLibraryCategory,
    libraryStatus,
    setLibraryStatus,
    editorDraft,
    setEditorDraft,
    summary,
    placeMap,
    dayPlaceIds,
    highlightedPlaces,
    mainStops,
    optionalStops,
    visibleLibraryPlaces,
    openEditor,
    saveEditor,
    deleteStop,
    addPlaceToToday,
    resetTrip,
    updateTrip,
  };
}
