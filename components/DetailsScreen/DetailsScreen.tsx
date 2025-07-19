// app/[id].tsx
import { Colors } from "@/constants/Colors";
import { Event, Note, Plant } from "@/interfaces/plantInterface";
import * as FileSystem from "expo-file-system";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import {
  Keyboard,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  useColorScheme,
  View
} from "react-native";
import PlantInfo from "./PlantInfo";
import PlantTabs from "./PlantTabs";

const PLANTS_DIR = FileSystem.documentDirectory + "plants/";

export const unstable_settings = {
  initialRouteName: "Details",
};

export const dynamic = "force-dynamic";

export default function DetailsScreen() {
  const { idn:id } = useLocalSearchParams();
  const plantId = Array.isArray(id) ? id[0] : id;
  const router = useRouter();
  const colorScheme = useColorScheme();
  const color = Colors[colorScheme ?? "light"];
  const [plant, setPlant] = useState<Plant | null>(null);
  const [loading, setLoading] = useState(true);

  // new load plant solution with usefocuseffect
  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const loadPlant = async () => {
        try {
          setLoading(true);
          const filePath = `${PLANTS_DIR}plant_${id}.json`;
          const fileInfo = await FileSystem.getInfoAsync(filePath);
          if (!fileInfo.exists) {
            console.warn("Plant file not found:", filePath);
            router.back();
            return;
          }

          const content = await FileSystem.readAsStringAsync(filePath);
          const plantData: Plant = JSON.parse(content);
          if (isActive) {
            setPlant(plantData);
            setLoading(false);
          }
        } catch (error) {
          console.error("Error loading plant:", error);
        } finally {
          setLoading(false);
        }
      };
      loadPlant();
      return () => {
        isActive = false;
      };
    }, [id])
  );
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
        setModalVisible(false);
      } else {
        console.warn("Plant file does not exist:", filePath);
      }

      router.replace("/"); // Navigate back to home screen
    } catch (error) {
      console.error("Error deleting plant:", error);
      setModalVisible(false);
    }
  };

  const handleDeleteClick = async () => {
    // show to modal to confirm
    setModalVisible(true);
  };
  const [modalVisible, setModalVisible] = useState(false);

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: color.background }]}>
        {/* <ActivityIndicator size="large" color={Colors.primary} /> */}
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
      <View style={{ flex: 1, backgroundColor: color.background , }}>
        
      {/* Fixed Header */}
      <PlantInfo plant={plant} handleDeleteClick={handleDeleteClick} />

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)} // Android back button
      >
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalText}>
                Are you sure you want to delete the plant?
                {"\n"}This will remove all data associated with the plant
                permanently.
              </Text>
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  onPress={() => setModalVisible(false)}
                  style={styles.cancelButton}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={deletePlant}
                  style={styles.deleteButton}
                >
                  <Text style={styles.deleteButtonText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* Fixed Tab Bar */}
      <PlantTabs
        plant={plant}
        handleAddEvent={handleAddEvent}
        handleDeleteEvent={handleDeleteEvent}
        handleAddNote={handleAddNote}
        handleDeleteNote={handleDeleteNote}
      />
      
      </View>
  );
}

const styles = StyleSheet.create({
  scrollTabContent: {
    padding: 16,
    paddingBottom: 32,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    width: "85%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    fontSize: 16,
    color: "#333",
    marginBottom: 20,
    textAlign: "center",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  cancelButton: {
    flex: 1,
    backgroundColor: "#ccc",
    padding: 10,
    borderRadius: 8,
    marginRight: 10,
  },
  cancelButtonText: {
    textAlign: "center",
    color: "#000",
    fontWeight: "600",
  },
  deleteButton: {
    flex: 1,
    backgroundColor: "#cc475a",
    padding: 10,
    borderRadius: 8,
  },
  deleteButtonText: {
    textAlign: "center",
    color: "#fff",
    fontWeight: "600",
  },
});
