// app/(tabs)/index.tsx
import { Colors } from "@/constants/Colors";
import { formatPrettyDate, getDaysDifference } from "@/functions/Date";
import { useFocusEffect } from "@react-navigation/native";
import * as FileSystem from "expo-file-system";
import { useRouter } from "expo-router";
import { useCallback, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";

interface Plant {
  id: string;
  name: string;
  plantedAt: string;
}

const PLANTS_DIR = FileSystem.documentDirectory + "plants/";

export default function HomeScreen() {
  const theme = useColorScheme();
  const themeColors = Colors[theme || "light"];
  const router = useRouter();
  const [plants, setPlants] = useState<Plant[]>([]);
  const [loading, setLoading] = useState(true);

  const loadPlants = async () => {
    try {
      const dirInfo = await FileSystem.getInfoAsync(PLANTS_DIR);
      if (!dirInfo.exists) {
        setPlants([]);
        setLoading(false);
        return;
      }

      const files = await FileSystem.readDirectoryAsync(PLANTS_DIR);
      const plantFiles = files.filter((f) => f.endsWith(".json"));

      const loadedPlants: Plant[] = [];

      for (const fileName of plantFiles) {
        const filePath = PLANTS_DIR + fileName;
        const content = await FileSystem.readAsStringAsync(filePath);
        const plant: Plant = JSON.parse(content);
        loadedPlants.push(plant);
      }

      setPlants(loadedPlants);
    } catch (error) {
      console.error("Failed to load plants", error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadPlants();
    }, [])
  );

  return (
    <View style={[styles.container, { backgroundColor: themeColors.background}]}>
      <Text style={[styles.title, { color: themeColors.text}]}>🌱 My Garden</Text>
      <FlatList
        data={plants}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          <Text style={styles.empty}>
            {loading ? "Loading..." : "No plants added yet."}
          </Text>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.card, { backgroundColor: themeColors.uiBackground }]}
            onPress={() =>
              router.push({
                pathname: "/[id]",
                params: { id: item.id },
              })
            }
          >
            <Text style={[styles.plantName, { color: themeColors.text}]}>{item.name}</Text>
            <Text style={[styles.date, { color: themeColors.text, opacity: 0.6}]}>
              {
                getDaysDifference(new Date(item.plantedAt)).time === 0
                  ? "Planted today"
                  : `Planted ${getDaysDifference(new Date(item.plantedAt)).time} days ago on ${formatPrettyDate(item.plantedAt)}`
              }
              {/* Planted {getDaysDifference(new Date(item.plantedAt)).time === 0 ? "today" : getDaysDifference(new Date(item.plantedAt)).time} days ago on {formatPrettyDate(item.plantedAt)} */}
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16,  },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 16 },
  empty: { textAlign: "center", color: "#888", marginTop: 20 },
  card: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  plantName: { fontSize: 18, fontWeight: "600" },
  date: { fontSize: 14, color: "#666" },
});
