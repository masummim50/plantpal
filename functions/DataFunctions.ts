import { LogEntry, Plant } from "@/interfaces/plantInterface";
import { Directory, File, Paths } from "expo-file-system";

const PLANTS_DIR = new Directory(Paths.document,  "plants/");

export const getPlantFileUri = (plantId: string) => {
  return `${PLANTS_DIR}plant_${plantId}.json`;
};

export const getPlantInfo = async (plantId: string) => {
  try {
    const plantFile = new File(PLANTS_DIR, `plant_${plantId}.json`);
    if (plantFile.exists) {
      const content = await plantFile.text();
      return JSON.parse(content);
    } else {
      console.warn("Plant file does not exist:", plantFile);
    }
  } catch (error) {
    console.error("Error getting plant info:", error);
  }
};
const deleteAllPhotos = async (plantId: string) => {
  const imageDir = new Directory(Paths.document, `${plantId}_images`);
  
  if (imageDir.exists) {
    imageDir.delete();
  }
};

export const deletePlant = async (plantId: string) => {
  try {
    const plantFile = new File(PLANTS_DIR, `plant_${plantId}.json`);
    if (plantFile.exists) {
      plantFile.delete();
    } else {
      console.warn("Plant file does not exist:", plantFile);
    }

    await deleteAllPhotos(plantId);
  } catch (error) {
    console.error("Error deleting plant:", error);
  }
};

export const updatePlant = async (plantId: string, updatedPlant: any) => {
  try {
    const plantFile = new File(PLANTS_DIR, `plant_${plantId}.json`);
    plantFile.write(JSON.stringify(updatedPlant, null, 2));
  } catch (error) {
    console.error("Error updating plant:", error);
  }
};

// export const getAllPlants = async () => {
//   try {
//     const dirInfo = await FileSystem.getInfoAsync(PLANTS_DIR);
//     if (!dirInfo.exists) {
//       return [];
//     }

//     const files = await FileSystem.readDirectoryAsync(PLANTS_DIR);
//     const plantFiles = files.filter((f) => f.endsWith(".json"));

//     const plants = await Promise.all(
//       plantFiles.map(async (fileName) => {
//         const filePath = `${PLANTS_DIR}${fileName}`;
//         const content = await FileSystem.readAsStringAsync(filePath);
//         return JSON.parse(content);
//       })
//     );

//     return plants;
//   } catch (error) {
//     console.error("Error getting all plants:", error);
//     return [];
//   }
// };

// export function createLogBook(plants: Plant[]): LogEntry[] {
//   const logs: LogEntry[] = [];

//   for (const plant of plants) {
//     // Add the planted log
//     logs.push({
//       title: `${plant.name} - Planted`,
//       date: plant.plantedAt,
//     });

//     // Add each event
//     for (const event of plant.events) {
//       logs.push({
//         title: `${plant.name} - ${event.name}`,
//         date: event.date,
//       });
//     }
//   }

//   // Sort the logs by date ascending
//   logs.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

//   return logs;
// }


export async function createLogBook(): Promise< LogEntry[]> {
  const logs: LogEntry[] = [];

  const plantFiles = new Directory(PLANTS_DIR).list();
  for(const file of plantFiles){
    if(file instanceof File){

      const content = await file.text();
      const plant: Plant = JSON.parse(content);
      logs.push({
        title: `${plant.name} - Planted`,
        date: plant.plantedAt,
        plantedEvent:true
      });
      for(const event of plant.events){
        logs.push({
          title: `${plant.name} - ${event.name}`,
          date: event.date,
        })
      }
    }
  }

  

  // Sort the logs by date ascending
  logs.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return logs;
}

export const plantFunctions = {
  getPlantFileUri,
  getPlantInfo,
  deletePlant,
  updatePlant,
}