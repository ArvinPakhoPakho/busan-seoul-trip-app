import { useState, useEffect, useCallback } from "react";
import {
  savePhoto,
  deletePhoto,
  getAllPhotos,
  type PhotoRecord,
} from "@/lib/photo-db";

// ── 型別 ──────────────────────────────────────────────────────────────────────

export type UploadStatus = {
  itemId: string;
  fileName: string;
  progress: "uploading" | "done" | "error";
  percent: number;
  error?: string;
};

// Home.tsx 用 photo.objectUrl / photo.sizeKb / photo.name / photo.id
export type ShoppingPhoto = PhotoRecord & {
  objectUrl: string; // Cloudinary URL，直接當 objectUrl 用
};

// ── Cloudinary 設定 ───────────────────────────────────────────────────────────

const CLOUD_NAME = "dhtv7akpx";
const UPLOAD_PRESET = "busan_trip";

async function uploadToCloudinary(
  file: File,
  onProgress: (percent: number) => void,
): Promise<string> {
  return new Promise((resolve, reject) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);
    formData.append("folder", "busan-seoul-trip");

    const xhr = new XMLHttpRequest();

    xhr.upload.addEventListener("progress", (e) => {
      if (e.lengthComputable) {
        onProgress(Math.round((e.loaded / e.total) * 100));
      }
    });

    xhr.addEventListener("load", () => {
      if (xhr.status === 200) {
        const res = JSON.parse(xhr.responseText);
        resolve(res.secure_url as string);
      } else {
        reject(new Error("上傳失敗，請重試"));
      }
    });

    xhr.addEventListener("error", () => {
      reject(new Error("網路錯誤，請檢查連線"));
    });

    xhr.open(
      "POST",
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
    );
    xhr.send(formData);
  });
}

// ── hook ──────────────────────────────────────────────────────────────────────

export function useShoppingPhotos() {
  const [photoMap, setPhotoMap] = useState<Record<string, ShoppingPhoto[]>>({});
  const [uploadStatuses, setUploadStatuses] = useState<UploadStatus[]>([]);

  // 從 IndexedDB 載入，把 cloudinaryUrl 對應到 objectUrl
  const refreshPhotos = useCallback(async () => {
    const all = await getAllPhotos();
    const map: Record<string, ShoppingPhoto[]> = {};
    for (const record of all) {
      const photo: ShoppingPhoto = {
        ...record,
        objectUrl: record.cloudinaryUrl,
      };
      if (!map[record.itemId]) map[record.itemId] = [];
      map[record.itemId].push(photo);
    }
    setPhotoMap(map);
  }, []);

  useEffect(() => {
    refreshPhotos();
  }, [refreshPhotos]);

  // uploadPhotos(itemId, FileList | null)
  const uploadPhotos = useCallback(
    async (itemId: string, files: FileList | null) => {
      if (!files || files.length === 0) return;

      const fileArray = Array.from(files);

      for (const file of fileArray) {
        const fileName = file.name;

        // 加入「上傳中」狀態
        setUploadStatuses((prev) => [
          ...prev,
          { itemId, fileName, progress: "uploading", percent: 0 },
        ]);

        try {
          const cloudinaryUrl = await uploadToCloudinary(file, (percent) => {
            setUploadStatuses((prev) =>
              prev.map((s) =>
                s.itemId === itemId &&
                s.fileName === fileName &&
                s.progress === "uploading"
                  ? { ...s, percent }
                  : s,
              ),
            );
          });

          // 存到 IndexedDB
          await savePhoto({
            itemId,
            name: fileName,
            cloudinaryUrl,
            sizeKb: Math.round(file.size / 1024),
            uploadedAt: new Date(),
          });

          // 先更新為完成狀態
          setUploadStatuses((prev) =>
            prev.map((s) =>
              s.itemId === itemId &&
              s.fileName === fileName &&
              s.progress === "uploading"
                ? { ...s, progress: "done", percent: 100 }
                : s,
            ),
          );

          // 再刷新照片（確保在 done 狀態之後）
          await refreshPhotos();

          // 3 秒後移除狀態
          setTimeout(() => {
            setUploadStatuses((prev) =>
              prev.filter(
                (s) =>
                  !(
                    s.itemId === itemId &&
                    s.fileName === fileName &&
                    s.progress === "done"
                  ),
              ),
            );
          }, 3000);

        } catch (err) {
          setUploadStatuses((prev) =>
            prev.map((s) =>
              s.itemId === itemId &&
              s.fileName === fileName &&
              s.progress === "uploading"
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
    [refreshPhotos],
  );

  // removePhoto(itemId, photoId)  ← Home.tsx 的呼叫方式
  const removePhoto = useCallback(
    async (_itemId: string, photoId: number) => {
      await deletePhoto(photoId);
      await refreshPhotos();
    },
    [refreshPhotos],
  );

  return {
    photoMap,
    uploadStatuses,
    uploadPhotos,
    removePhoto,
  };
}
