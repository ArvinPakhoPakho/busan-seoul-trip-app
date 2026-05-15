import Dexie, { type Table } from "dexie";

export interface PhotoRecord {
  id?: number;
  itemId: string;
  name: string;
  cloudinaryUrl: string;
  sizeKb: number;
  uploadedAt: Date;
}

class PhotoDatabase extends Dexie {
  photos!: Table<PhotoRecord>;

  constructor() {
    super("ShoppingPhotosDB");
    this.version(2).stores({
      photos: "++id, itemId, cloudinaryUrl, name, sizeKb, uploadedAt",
    });
  }
}

export const photoDB = new PhotoDatabase();

export async function savePhoto(record: Omit<PhotoRecord, "id">): Promise<number> {
  const id = await photoDB.photos.add(record);
  return id as number;
}

export async function getPhotosByItemId(itemId: string): Promise<PhotoRecord[]> {
  return await photoDB.photos.where("itemId").equals(itemId).toArray();
}

export async function deletePhoto(id: number): Promise<void> {
  await photoDB.photos.delete(id);
}

export async function getAllPhotos(): Promise<PhotoRecord[]> {
  return await photoDB.photos.toArray();
}
