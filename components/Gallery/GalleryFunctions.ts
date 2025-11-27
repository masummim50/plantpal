import { Directory, File, Paths } from "expo-file-system";
import * as ImagePicker from "expo-image-picker";

export type PhotoMeta = {
  uri: string;
  date: string;
  daysAfterPlanting: number;
  daysAgo: number;
};

const getFolderUri = (plantId: string) => {
  const imageDirectory = new Directory(Paths.document,  `${plantId}_images`);
  
  return imageDirectory.uri;
};



const loadPhotos = async (plantId: string, plantedAt: string, whereto:string="default"): Promise<PhotoMeta[]> => {
  
  const imageDirectory = new Directory(Paths.document,  `${plantId}_images`);
  if(imageDirectory.exists){
  }else{
    await imageDirectory.create();
  }
  const files = imageDirectory.list();
  const loadedPhotos = await Promise.all(
    files.map(async (file) => {
      const takenDate = new Date(Number((file as File).creationTime));
      const plantedDate = new Date(plantedAt);
      const now = new Date();

      return {
        uri: file.uri,
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
    const imageFile =  new File(result.assets[0].uri);
    const imageDirectory = new Directory(Paths.document,  `${plantId}_images`);
    const newtextfile = new File(Paths.document, 'hello.txt');
    imageFile.copy(imageDirectory);
  }
};

const deletePhoto = async (uri: string) => {
  const file = new File(uri);
  file.delete();
};

export const GalleryFunctions = {
  getFolderUri,
  // ensureFolderExists,
  loadPhotos,
  takePhoto,
  deletePhoto,
};
