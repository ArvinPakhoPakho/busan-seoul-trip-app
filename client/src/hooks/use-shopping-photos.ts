import { useState, useEffect, useCallback } from "react";

export type UploadStatus = {
  itemId: string;
  fileName: string;
  progress: "uploading" | "done" | "error";
  percent: number;
  error?: string;
};

export type ShoppingPhoto = {
  id: string;          // Cloudinary public_id
  itemId: string;
  name: string;
  cloudinaryUrl: string;
  sizeKb: number;
  uploadedAt: Date;
  objectUrl: string;   // 同 cloudinaryUrl
};

const CLOUD_NAME = "dhtv7akpx";
const UPLOAD_PRESET = "busan_trip";
const FOLDER = "busan-seoul-trip";

// ── 上傳到 Cloudinary（帶 tag = itemId）────────────────────────────────────────

async function uploadToCloudinary(
  file: File,
  itemId: string,
  onProgress: (percent: number) => void,
): Promise<{ url: string; publicId: string; sizeKb: number }> {
  return new Promise((resolve, reject) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);
    formData.append("folder", FOLDER);
    formData.append("tags", itemId);   // ← 關鍵：用 tag 記錄 itemId

    const xhr = new XMLHttpRequest();

    xhr.upload.addEventListener("progress", (e) => {
      if (e.lengthComputable) {
        onProgress(Math.round((e.loaded / e.total) * 100));
      }
    });

    xhr.addEventListener("load", () => {
      if (xhr.status === 200) {
        const res = JSON.parse(xhr.responseText);
        resolve({
          url: res.secure_url as string,
          publicId: res.public_id as string,
          sizeKb: Math.round((res.bytes as number) / 1024),
        });
      } else {
        reject(new Error(`上傳失敗 (${xhr.status})`));
      }
    });

    xhr.addEventListener("error", () => {
      reject(new Error("網路錯誤，請檢查連線"));
    });

    xhr.open("POST", `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`);
    xhr.send(formData);
  });
}

// ── 從 Cloudinary tag list 讀取照片 ────────────────────────────────────────────

async function fetchPhotosByTag(itemId: string): Promise<ShoppingPhoto[]> {
  try {
    const url = `https://res.cloudinary.com/${CLOUD_NAME}/image/list/${encodeURIComponent(itemId)}.json`;
    const res = await fetch(url);
    if (!res.ok) return [];
    const data = await res.json();
    return (data.resources || []).map((r: any) => {
      const cloudinaryUrl = `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/${r.public_id}.${r.format}`;
      return {
        id: r.public_id,
        itemId,
        name: r.public_id.split("/").pop() || r.public_id,
        cloudinaryUrl,
        objectUrl: cloudinaryUrl,
        sizeKb: Math.round((r.bytes || 0) / 1024),
        uploadedAt: new Date(r.created_at),
      };
    });
  } catch {
    return [];
  }
}

// ── hook ───────────────────────────────────────────────────────────────────────

const ITEM_IDS = ["olive-young-beauty", "pharmacy-beauty", "korea-snacks-souvenir"];

export function useShoppingPhotos() {
  const [photoMap, setPhotoMap] = useState<Record<string, ShoppingPhoto[]>>({});
  const [uploadStatuses, setUploadStatuses] = useState<UploadStatus[]>([]);

  const refreshPhotos = useCallback(async () => {
    const entries = await Promise.all(
      ITEM_IDS.map(async (id) => {
        const photos = await fetchPhotosByTag(id);
        return [id, photos] as const;
      }),
    );
    setPhotoMap(Object.fromEntries(entries));
  }, []);

  useEffect(() => {
    refreshPhotos();
  }, [refreshPhotos]);

  const uploadPhotos = useCallback(
    async (itemId: string, files: FileList | null) => {
      if (!files || files.length === 0) return;

      for (const file of Array.from(files)) {
        const fileName = file.name;

        setUploadStatuses((prev) => [
          ...prev,
          { itemId, fileName, progress: "uploading", percent: 0 },
        ]);

        try {
          const { url, sizeKb } = await uploadToCloudinary(file, itemId, (percent) => {
            setUploadStatuses((prev) =>
              prev.map((s) =>
                s.itemId === itemId && s.fileName === fileName && s.progress === "uploading"
                  ? { ...s, percent }
                  : s,
              ),
            );
          });

          // 直接把新照片加進 photoMap，不等 API 刷新
          const newPhoto: ShoppingPhoto = {
            id: url,
            itemId,
            name: fileName,
            cloudinaryUrl: url,
            objectUrl: url,
            sizeKb,
            uploadedAt: new Date(),
          };

          setPhotoMap((prev) => ({
            ...prev,
            [itemId]: [...(prev[itemId] ?? []), newPhoto],
          }));

          setUploadStatuses((prev) =>
            prev.map((s) =>
              s.itemId === itemId && s.fileName === fileName && s.progress === "uploading"
                ? { ...s, progress: "done", percent: 100 }
                : s,
            ),
          );

          setTimeout(() => {
            setUploadStatuses((prev) =>
              prev.filter(
                (s) => !(s.itemId === itemId && s.fileName === fileName && s.progress === "done"),
              ),
            );
          }, 3000);

        } catch (err) {
          setUploadStatuses((prev) =>
            prev.map((s) =>
              s.itemId === itemId && s.fileName === fileName && s.progress === "uploading"
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

  const removePhoto = useCallback(
    async (_itemId: string, photoId: string | number) => {
      // Cloudinary 免費版不支援前端刪除，只從本地 state 移除
      setPhotoMap((prev) => {
        const updated = { ...prev };
        for (const key of Object.keys(updated)) {
          updated[key] = updated[key].filter((p) => p.id !== String(photoId));
        }
        return updated;
      });
    },
    [],
  );

  return { photoMap, uploadStatuses, uploadPhotos, removePhoto };
}
