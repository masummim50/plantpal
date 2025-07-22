import * as FileSystem from "expo-file-system";
import * as ImagePicker from "expo-image-picker";

export type PhotoMeta = {
  uri: string;
  date: string;
  daysAfterPlanting: number;
  daysAgo: number;
};

const getFolderUri = (plantId: string) => {
  return `${FileSystem.documentDirectory}${plantId}_images`;
};

const ensureFolderExists = async (folderUri: string) => {
  const folderInfo = await FileSystem.getInfoAsync(folderUri);
  if (!folderInfo.exists) {
    await FileSystem.makeDirectoryAsync(folderUri, { intermediates: true });
  }
};

const loadPhotos = async (plantId: string, plantedAt: string, whereto:string="default"): Promise<PhotoMeta[]> => {
  console.log("load photos function starting with id: ", plantId, "coming from: ", whereto);
  // get folder uri
  const folderUri = getFolderUri(plantId);
  await ensureFolderExists(folderUri);
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
        daysAfterPlanting: Math.floor(
          (takenDate.getTime() - plantedDate.getTime()) / (1000 * 60 * 60 * 24)
        ),
        daysAgo: Math.floor(
          (now.getTime() - takenDate.getTime()) / (1000 * 60 * 60 * 24)
        ),
      };
    })
  );

  return loadedPhotos;
};

const takePhoto = async (plantId: string, plantedAt: string) => {
  const { status } = await ImagePicker.requestCameraPermissionsAsync();
  if (status !== "granted") {
    alert("Camera permission required.");
    return;
  }

  const result = await ImagePicker.launchCameraAsync({ quality: 0.7 });
  if (!result.canceled && result.assets?.length) {
    const asset = result.assets[0];
    const filename = `${Date.now()}.jpg`;
    const folderUri = getFolderUri(plantId);
    const dest = `${folderUri}/${filename}`;
    await ensureFolderExists(folderUri);
    await FileSystem.copyAsync({ from: asset.uri, to: dest });
    // await loadPhotos(plantId, plantedAt); // refresh
  }
};

const deletePhoto = async (uri: string) => {
  await FileSystem.deleteAsync(uri);
};

export const GalleryFunctions = {
  getFolderUri,
  ensureFolderExists,
  loadPhotos,
  takePhoto,
  deletePhoto,
};
