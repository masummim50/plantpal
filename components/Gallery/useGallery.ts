import * as FileSystem from "expo-file-system";
import * as ImagePicker from "expo-image-picker";
import { useCallback, useEffect, useState } from "react";

export type PhotoMeta = {
  uri: string;
  date: string;
  daysAfterPlanting: number;
  daysAgo: number;
};

export function useGallery(plantId: string, plantedAt: string) {
  const folderUri = `${FileSystem.documentDirectory}${plantId}_images`;
  const [photos, setPhotos] = useState<PhotoMeta[]>([]);
  const [sortNewestFirst, setSortNewestFirst] = useState(true);
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");

  const ensureFolderExists = async () => {
    const folderInfo = await FileSystem.getInfoAsync(folderUri);
    if (!folderInfo.exists) {
      await FileSystem.makeDirectoryAsync(folderUri, { intermediates: true });
    }
  };

  const loadPhotos = useCallback(async () => {
    await ensureFolderExists();
    const files = await FileSystem.readDirectoryAsync(folderUri);
    const loadedPhotos = await Promise.all(
      files.map(async (filename) => {
        const fileUri = `${folderUri}/${filename}`;
        const info = await FileSystem.getInfoAsync(fileUri);
        const takenDate = new Date(Number(filename.replace(".jpg", "")));
        const plantedDate = new Date(plantedAt);
        const now = new Date();

        return {
          uri: fileUri,
          date: takenDate.toISOString(),
          daysAfterPlanting: Math.floor((takenDate.getTime() - plantedDate.getTime()) / (1000 * 60 * 60 * 24)),
          daysAgo: Math.floor((now.getTime() - takenDate.getTime()) / (1000 * 60 * 60 * 24)),
        };
      })
    );

    const sorted = loadedPhotos.sort((a, b) =>
      sortNewestFirst
        ? new Date(b.date).getTime() - new Date(a.date).getTime()
        : new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    setPhotos(sorted);
  }, [plantId, plantedAt, sortNewestFirst]);

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      alert("Camera permission required.");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({ quality: 0.7 });
    if (!result.canceled && result.assets?.length) {
      const asset = result.assets[0];
      const filename = `${Date.now()}.jpg`;
      const dest = `${folderUri}/${filename}`;
      await ensureFolderExists();
      await FileSystem.copyAsync({ from: asset.uri, to: dest });
      await loadPhotos(); // refresh
    }
  };

  const deletePhoto = async (uri: string) => {
    await FileSystem.deleteAsync(uri);
    await loadPhotos();
  };

  useEffect(() => {
    loadPhotos();
  }, [sortNewestFirst]);

  return {
    photos,
    takePhoto,
    deletePhoto,
    viewMode,
    setViewMode,
    sortNewestFirst,
    setSortNewestFirst,
  };
}
