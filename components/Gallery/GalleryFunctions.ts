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
  // return `${FileSystem.documentDirectory}${plantId}_images`;
  console.log("get folder uri function: ", imageDirectory);
  return imageDirectory.uri;
};

// const ensureFolderExists = async (folderUri: string) => {
//   const folderInfo = await FileSystem.getInfoAsync(folderUri);
//   if (!folderInfo.exists) {
//     await FileSystem.makeDirectoryAsync(folderUri, { intermediates: true });
//   }
// };

// const loadPhotos = async (plantId: string, plantedAt: string, whereto:string="default"): Promise<PhotoMeta[]> => {
//   console.log("load photos function starting with id: ", plantId, "coming from: ", whereto);
//   // get folder uri
//   const folderUri = getFolderUri(plantId);
//   await ensureFolderExists(folderUri);
//   const files = await FileSystem.readDirectoryAsync(folderUri);
//   const loadedPhotos = await Promise.all(
//     files.map(async (filename) => {
//       const fileUri = `${folderUri}/${filename}`;
//       const info = await FileSystem.getInfoAsync(fileUri);
//       const takenDate = new Date(Number(filename.replace(".jpg", "")));
//       const plantedDate = new Date(plantedAt);
//       const now = new Date();

//       return {
//         uri: fileUri,
//         date: takenDate.toISOString(),
//         daysAfterPlanting: Math.floor(
//           (takenDate.getTime() - plantedDate.getTime()) / (1000 * 60 * 60 * 24)
//         ),
//         daysAgo: Math.floor(
//           (now.getTime() - takenDate.getTime()) / (1000 * 60 * 60 * 24)
//         ),
//       };
//     })
//   );

//   return loadedPhotos;
// };


const loadPhotos = async (plantId: string, plantedAt: string, whereto:string="default"): Promise<PhotoMeta[]> => {
  
  const imageDirectory = new Directory(Paths.document,  `${plantId}_images`);
  if(imageDirectory.exists){
    console.log("image directory exists: ", imageDirectory);
  }else{
    console.log("image directory does not exist, creating now: ", imageDirectory);
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
    console.log("image file uri: ", imageFile);
    console.log("type of result assets is : ", typeof(result.assets[0]));
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
