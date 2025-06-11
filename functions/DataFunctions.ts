import { LogEntry, Plant } from "@/interfaces/plantInterface";
import * as FileSystem from "expo-file-system";

const PLANTS_DIR = FileSystem.documentDirectory + "plants/";

export const getPlantFileUri = (plantId: string) => {
  return `${PLANTS_DIR}plant_${plantId}.json`;
};

export const getPlantInfo = async (plantId: string) => {
  try {
    const filePath = `${PLANTS_DIR}plant_${plantId}.json`;
    const fileInfo = await FileSystem.getInfoAsync(filePath);
    if (fileInfo.exists) {
      const content = await FileSystem.readAsStringAsync(filePath);
      return JSON.parse(content);
    } else {
      console.warn("Plant file does not exist:", filePath);
    }
  } catch (error) {
    console.error("Error getting plant info:", error);
  }
}

export const deletePlant = async (plantId: string) => {
  try {
    const filePath = `${PLANTS_DIR}plant_${plantId}.json`;
    const fileInfo = await FileSystem.getInfoAsync(filePath);
    if (fileInfo.exists) {
      await FileSystem.deleteAsync(filePath);
      console.log("Deleted plant:", filePath);
    } else {
      console.warn("Plant file does not exist:", filePath);
    }
  } catch (error) {
    console.error("Error deleting plant:", error);
  }
};

export const updatePlant = async (plantId: string, updatedPlant: any) => {
  try {
    const filePath = `${PLANTS_DIR}plant_${plantId}.json`;
    await FileSystem.writeAsStringAsync(filePath, JSON.stringify(updatedPlant));
    console.log("Updated plant:", filePath);
  } catch (error) {
    console.error("Error updating plant:", error);
  }
};

export const getAllPlants = async () => {
  try {
    const dirInfo = await FileSystem.getInfoAsync(PLANTS_DIR);
    if (!dirInfo.exists) {
      return [];
    }

    const files = await FileSystem.readDirectoryAsync(PLANTS_DIR);
    const plantFiles = files.filter((f) => f.endsWith(".json"));

    const plants = await Promise.all(
      plantFiles.map(async (fileName) => {
        const filePath = `${PLANTS_DIR}${fileName}`;
        const content = await FileSystem.readAsStringAsync(filePath);
        return JSON.parse(content);
      })
    );

    return plants;
  } catch (error) {
    console.error("Error getting all plants:", error);
    return [];
  }
};




export function createLogBook(plants: Plant[]): LogEntry[] {
  const logs: LogEntry[] = [];

  for (const plant of plants) {
    // Add the planted log
    logs.push({
      title: `${plant.name} - Planted`,
      date: plant.plantedAt,
    });

    // Add each event
    for (const event of plant.events) {
      logs.push({
        title: `${plant.name} - ${event.name}`,
        date: event.date,
      });
    }
  }

  // Sort the logs by date ascending
  logs.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return logs;
}
