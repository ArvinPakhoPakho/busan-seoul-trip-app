// hooks/use-shopping-photos.ts
// Manages shopping photo state — loads from IndexedDB, compresses on upload,
// creates object URLs for display, and cleans up on unmount.

import { useCallback, useEffect, useRef, useState } from "react";
import { deletePhoto, getAllPhotos, savePhoto, type StoredPhoto } from "@/lib/photo-db";
import { compressImage } from "@/lib/compress-image";

export type PhotoEntry = {
  id: string;
  itemId: string;
  name: string;
  objectUrl: string;
  sizeKb: number;
};

export type UploadStatus = {
  itemId: string;
  fileName: string;
  progress: "compressing" | "saving" | "done" | "error";
  error?: string;
};

type PhotoMap = Record<string, PhotoEntry[]>;

export function useShoppingPhotos() {
  const [photoMap, setPhotoMap] = useState<PhotoMap>({});
  const [uploadStatuses, setUploadStatuses] = useState<UploadStatus[]>([]);
  const objectUrlsRef = useRef<string[]>([]);

  // ── load all photos from IndexedDB on mount ───────────────────────────────
  useEffect(() => {
    if (typeof window === "undefined") return;

    getAllPhotos().then((stored) => {
      const map: PhotoMap = {};

      for (const photo of stored) {
        const objectUrl = URL.createObjectURL(photo.blob);
        objectUrlsRef.current.push(objectUrl);

        const entry: PhotoEntry = {
          id: photo.id,
          itemId: photo.itemId,
          name: photo.name,
          objectUrl,
          sizeKb: Math.round(photo.blob.size / 1024),
        };

        if (!map[photo.itemId]) map[photo.itemId] = [];
        map[photo.itemId].push(entry);
      }

      setPhotoMap(map);
    }).catch(() => {
      // IndexedDB unavailable (e.g. private browsing on some browsers) — fail silently
    });

    return () => {
      for (const url of objectUrlsRef.current) {
        URL.revokeObjectURL(url);
      }
    };
  }, []);

  // ── upload ────────────────────────────────────────────────────────────────
  const uploadPhotos = useCallback(
    async (itemId: string, files: FileList | null) => {
      if (!files?.length) return;

      const fileArray = Array.from(files).filter((f) =>
        f.type.startsWith("image/"),
      );

      for (const file of fileArray) {
        const fileName = file.name;

        setUploadStatuses((prev) => [
          { itemId, fileName, progress: "compressing" },
          ...prev,
        ]);

        try {
          const blob = await compressImage(file, {
            maxWidthPx: 1800,
            maxHeightPx: 1800,
            quality: 0.84,
          });

          setUploadStatuses((prev) =>
            prev.map((s) =>
              s.fileName === fileName && s.itemId === itemId
                ? { ...s, progress: "saving" }
                : s,
            ),
          );

          const photoId = `${Date.now()}-${Math.random().toString(36).slice(2)}`;

          const storedPhoto: StoredPhoto = {
            id: photoId,
            itemId,
            name: fileName,
            blob,
            createdAt: Date.now(),
          };

          await savePhoto(storedPhoto);

          const objectUrl = URL.createObjectURL(blob);
          objectUrlsRef.current.push(objectUrl);

          const entry: PhotoEntry = {
            id: photoId,
            itemId,
            name: fileName,
            objectUrl,
            sizeKb: Math.round(blob.size / 1024),
          };

          setPhotoMap((prev) => ({
            ...prev,
            [itemId]: [...(prev[itemId] ?? []), entry],
          }));

          setUploadStatuses((prev) =>
            prev.map((s) =>
              s.fileName === fileName && s.itemId === itemId
                ? { ...s, progress: "done" }
                : s,
            ),
          );

          setTimeout(() => {
            setUploadStatuses((prev) =>
              prev.filter(
                (s) => !(s.fileName === fileName && s.itemId === itemId),
              ),
            );
          }, 2500);
        } catch (err) {
          setUploadStatuses((prev) =>
            prev.map((s) =>
              s.fileName === fileName && s.itemId === itemId
                ? {
                    ...s,
                    progress: "error",
                    error: err instanceof Error ? err.message : "上傳失敗",
                  }
                : s,
            ),
          );
        }
      }
    },
    [],
  );

  // ── remove ────────────────────────────────────────────────────────────────
  const removePhoto = useCallback(async (itemId: string, photoId: string) => {
    await deletePhoto(photoId).catch(() => {});

    setPhotoMap((prev) => {
      const updated = (prev[itemId] ?? []).filter((p) => {
        if (p.id === photoId) {
          URL.revokeObjectURL(p.objectUrl);
          return false;
        }
        return true;
      });
      return { ...prev, [itemId]: updated };
    });
  }, []);

  return {
    photoMap,
    uploadStatuses,
    uploadPhotos,
    removePhoto,
  };
}
