// app/[id].tsx
import AddNotes from "@/components/AddNotes";
import EventSection from "@/components/EventSection";
import NotesSection from "@/components/NotesSection";
import PlantEvents from "@/components/PlantEvents";
import { Colors } from "@/constants/Colors";
import { formatPrettyDate } from "@/functions/Date";
import { Event, Note, Plant } from "@/interfaces/plantInterface";
import * as FileSystem from "expo-file-system";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Keyboard,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";

const PLANTS_DIR = FileSystem.documentDirectory + "plants/";

export default function PlantDetailsScreen() {
  const { id } = useLocalSearchParams();
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

  return (
    <ScrollView
      style={{ backgroundColor: color.background }}
      contentContainerStyle={styles.scrollContent}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.inner}>
        <View
          style={{
            borderBottomWidth: 2,
            borderColor: color.uiBackground,
            flexDirection: "row",
            justifyContent: "space-between",
            alignContent: "center",
            alignItems: "center",
          }}
        >
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
            <Text
              style={{ color: "#fff", textAlign: "center", fontWeight: "600" }}
            >
              Delete Plant
            </Text>
          </TouchableOpacity>
        </View>

        <PlantEvents onAddEvent={handleAddEvent} />

        <AddNotes onAddNote={handleAddNote} />

        {plant.events?.length ? (
          <EventSection events={plant.events} handleDeleteEvent={handleDeleteEvent} />
        ) : (
          <Text style={[styles.itemText, { color: color.text }]}>
            No events recorded.
          </Text>
        )}

        {plant.notes.length ? (
          <NotesSection notes={plant.notes} onDeleteNote={handleDeleteNote} />
        ) : (
          <Text style={[styles.itemText, { color: color.text }]}>
            No notes
          </Text>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  scrollContent: {
    padding: 16,
  },
  inner: {
    paddingBottom: 32,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 24,
  },
  section: {
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 8,
  },
  itemText: {
    fontSize: 16,
    marginBottom: 6,
  },
  errorText: {
    fontSize: 18,
    textAlign: "center",
  },
});
