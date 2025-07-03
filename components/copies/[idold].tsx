// app/[id].tsx
import DetailsTab from "@/components/DetailsTab";
import GalleryTab from "@/components/GalleryTab";
import { Colors } from "@/constants/Colors";
import { formatPrettyDate } from "@/functions/Date";
import { Event, Note, Plant } from "@/interfaces/plantInterface";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import * as FileSystem from "expo-file-system";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Keyboard,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const PLANTS_DIR = FileSystem.documentDirectory + "plants/";

export const unstable_settings = {
  initialRouteName: 'Details',
};

export const dynamic = 'force-dynamic';


export default function PlantDetailsScreen() {
  const Tab = createMaterialTopTabNavigator();
  const { id } = useLocalSearchParams();
  console.log("id from params: ", id)
  const plantId = Array.isArray(id) ? id[0] : id;
  const router = useRouter();
  const colorScheme = useColorScheme();
  const color = Colors[colorScheme ?? "light"];
  const [plant, setPlant] = useState<Plant | null>(null);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const loadPlant = async () => {
      try {
        const filePath = `${PLANTS_DIR}plant_${id}.json`;
        const fileInfo = await FileSystem.getInfoAsync(filePath);
        if (!fileInfo.exists) {
          console.warn("Plant file not found:", filePath);
          router.back();
          return;
        }

        const content = await FileSystem.readAsStringAsync(filePath);
        const plantData: Plant = JSON.parse(content);
        setPlant(plantData);
      } catch (error) {
        console.error("Error loading plant:", error);
      } finally {
        setLoading(false);
      }
    };

    loadPlant();
  }, [id]);
  

  const handleAddEvent = async (event: Event) => {
    if (!plant) return;

    try {
      const filePath = PLANTS_DIR + `plant_${plant.id}.json`;

      const existingData = await FileSystem.readAsStringAsync(filePath);
      const plantData = JSON.parse(existingData);

      if (!Array.isArray(plantData.events)) {
        plantData.events = [];
      }

      plantData.events.push(event);
      // need to add the modal
      // Sort by date (newest first or oldest first based on your preference)
      plantData.events.sort(
        (a: any, b: any) =>
          new Date(a.date).getTime() - new Date(b.date).getTime()
      );

      await FileSystem.writeAsStringAsync(
        filePath,
        JSON.stringify(plantData, null, 2)
      );

      // Optional: Update UI if needed
      setPlant({ ...plantData });
      Keyboard.dismiss();
    } catch (error) {
      console.error("Failed to add event", error);
    }
  };
  const handleDeleteEvent = async (eventId: string) => {
    if (!plant) return;

    try {
      const filePath = PLANTS_DIR + `plant_${plant.id}.json`;

      const existingData = await FileSystem.readAsStringAsync(filePath);
      const plantData = JSON.parse(existingData);

      if (!Array.isArray(plantData.events)) {
        plantData.events = [];
      }

      plantData.events = plantData.events.filter(
        (event: Event) => event.id !== eventId
      );

      await FileSystem.writeAsStringAsync(
        filePath,
        JSON.stringify(plantData, null, 2)
      );

      setPlant({ ...plantData });
    } catch (error) {
      console.error("Failed to add event", error);
    }
  };

  const handleAddNote = async (note: Note) => {
    if (!plant) return;

    try {
      const filePath = PLANTS_DIR + `plant_${plant.id}.json`;

      const existingData = await FileSystem.readAsStringAsync(filePath);
      const plantData = JSON.parse(existingData);

      if (!Array.isArray(plantData.notes)) {
        plantData.notes = [];
      }

      plantData.notes.push(note);

      await FileSystem.writeAsStringAsync(
        filePath,
        JSON.stringify(plantData, null, 2)
      );

      setPlant({ ...plantData });
    } catch (error) {
      console.error("Failed to add event", error);
    }
  };

  const handleDeleteNote = async (noteId: string) => {
    if (!plant) return;

    try {
      const filePath = PLANTS_DIR + `plant_${plant.id}.json`;

      const existingData = await FileSystem.readAsStringAsync(filePath);
      const plantData = JSON.parse(existingData);

      if (!Array.isArray(plantData.notes)) {
        plantData.notes = [];
      }

      plantData.notes = plantData.notes.filter(
        (note: Note) => note.id !== noteId
      );

      await FileSystem.writeAsStringAsync(
        filePath,
        JSON.stringify(plantData, null, 2)
      );

      setPlant({ ...plantData });
    } catch (error) {
      console.error("Failed to add event", error);
    }
  };

  const deletePlant = async () => {
    try {
      const filePath = `${PLANTS_DIR}plant_${id}.json`;
      const fileInfo = await FileSystem.getInfoAsync(filePath);
      if (fileInfo.exists) {
        await FileSystem.deleteAsync(filePath);
        console.log("Deleted plant:", filePath);
      } else {
        console.warn("Plant file does not exist:", filePath);
      }

      router.back(); // Navigate back to home screen
    } catch (error) {
      console.error("Error deleting plant:", error);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: color.background }]}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (!plant) {
    return (
      <View style={[styles.container, { backgroundColor: color.background }]}>
        <Text style={[styles.errorText, { color: color.text }]}>
          Could not find plant.
        </Text>
      </View>
    );
  }
// Inside your PlantDetailsScreen component:

  
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: color.background }}>
      {/* Fixed Header */}
      <View style={styles.headerContainer}>
        <View>
          <Text style={[styles.title, { color: color.title }]}>
            {plant.name}
          </Text>
          <Text style={[styles.subtitle, { color: color.text }]}>
            Planted on {formatPrettyDate(plant.plantedAt)}
          </Text>
        </View>
        <TouchableOpacity
          onPress={deletePlant}
          style={{
            backgroundColor: "#cc475a",
            padding: 12,
            borderRadius: 8,
          }}
        >
          <Text style={{ color: "#fff", fontWeight: "600" }}>Delete Plant</Text>
        </TouchableOpacity>
      </View>

      {/* Fixed Tab Bar */}
      <Tab.Navigator
      key={plantId}
  initialRouteName="Details"
      
        screenOptions={({ route }) => ({
          tabBarStyle: {
            backgroundColor: color.uiBackground,
          },
          tabBarLabelStyle: {
            fontWeight: "bold",
            color: color.text,
          },
          tabBarIndicatorStyle: {
            backgroundColor: Colors.primary,
          },
        })}
      >
        <Tab.Screen name="Details" key={`details-${plantId}`} >
          {() => (
            <DetailsTab
              plant={plant}
              color={color}
              handleAddEvent={handleAddEvent}
              handleAddNote={handleAddNote}
              handleDeleteEvent={handleDeleteEvent}
              handleDeleteNote={handleDeleteNote}
            />
          )}
        </Tab.Screen>
        <Tab.Screen  name="Gallery" key={`gallery-${plantId}`}>
          {() => <GalleryTab plant={plant} />}
        </Tab.Screen>
      </Tab.Navigator>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  scrollTabContent: {
    padding: 16,
    paddingBottom: 32,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 6,
  },
  itemText: {
    fontSize: 16,
    marginBottom: 10,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: 18,
    textAlign: "center",
  },
});
