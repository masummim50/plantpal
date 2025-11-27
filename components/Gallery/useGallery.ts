import { useState } from "react";

export type PhotoMeta = {
  uri: string;
  date: string;
  daysAfterPlanting: number;
  daysAgo: number;
};

export function useGallery(plantId: string, plantedAt: string) {
  
  // const folderUri = `${FileSystem.documentDirectory}${plantId}_images`;
  const [photos, setPhotos] = useState<PhotoMeta[]>([]);
  const [sortNewestFirst, setSortNewestFirst] = useState(true);
  const [viewMode, setViewMode] = useState<"list" | "grid">("grid");
  const [loading, setLoading] = useState(true);

  


  return {
    setPhotos,
    photos,
    // takePhoto,
    // deletePhoto,
    viewMode,
    setViewMode,
    sortNewestFirst,
    setSortNewestFirst,
    loadingPhotos:loading,
    setLoadingPhotos: setLoading
  };
}
