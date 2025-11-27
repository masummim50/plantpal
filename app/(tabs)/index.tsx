// app/(tabs)/index.tsx
import { Colors } from "@/constants/Colors";
import { formatPrettyDate, getDaysDifference } from "@/functions/Date";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { Directory, File, Paths } from "expo-file-system";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
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


export default function HomeScreen() {
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");
  const theme = useColorScheme();
  const themeColors = Colors[theme || "light"];
  const router = useRouter();
  const [plants, setPlants] = useState<Plant[]>([]);
  const [loading, setLoading] = useState(true);

  function sortPlantsByDate(plants: Plant[], order: "newest" | "oldest") {
    return [...plants].sort((a, b) => {
      const dateA = new Date(a.plantedAt).getTime();
      const dateB = new Date(b.plantedAt).getTime();
      return order === "newest" ? dateB - dateA : dateA - dateB;
    });
  }

  const loadPlants = async () => {
    try {
      const dirInfo = new Directory(Paths.document, "plants");
      if (!dirInfo.exists) {
        setPlants([]);
        setLoading(false);
        return;
      }

      const files = dirInfo.list();
      const loadedPlants: Plant[] = [];


      for(const file of files){
        if(file instanceof File){
          const text = await file.text();
          loadedPlants.push(JSON.parse(text));
        }
      }


      const sortedPlants = sortPlantsByDate(loadedPlants, sortOrder);
      setPlants(sortedPlants);
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

  useEffect(() => {
    setPlants((prev) => sortPlantsByDate(prev, sortOrder));
  }, [sortOrder]);
  // const [sortNewestFirst, setSortNewestFirst] = useState(true);
  const toggleSort = () => {
    setSortOrder(sortOrder === "newest" ? "oldest" : "newest");
  };

  return (
    <View
      style={[styles.container, { backgroundColor: themeColors.background }]}
    >
      <View style={styles.header}>
        <Text style={[styles.title, { color: themeColors.text }]}>
          🌱 My Garden
        </Text>
        <TouchableOpacity onPress={toggleSort} style={[styles.toggleButton, { backgroundColor: themeColors.uiBackground }]}>
          <Ionicons
            name={sortOrder === "newest" ? "arrow-down" : "arrow-up"}
            size={18}
            color={themeColors.iconColor}
          />
          <Text style={[styles.toggleText, { color: themeColors.text }]}>
            {sortOrder === "newest" ? "Newest first" : "Oldest first"}
          </Text>
        </TouchableOpacity>
      </View>
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
              router.replace({
                pathname: "/[idn]",
                params: { idn: item.id },
              })
            }
          >
            <Text style={[styles.plantName, { color: themeColors.text }]}>
              {item.name}
            </Text>
            <Text
              style={[styles.date, { color: themeColors.text, opacity: 0.6 }]}
            >
              {getDaysDifference(new Date(item.plantedAt)).time === 0
                ? "Planted today"
                : `Planted ${
                    getDaysDifference(new Date(item.plantedAt)).time
                  } days ago on ${formatPrettyDate(item.plantedAt)}`}
              {/* Planted {getDaysDifference(new Date(item.plantedAt)).time === 0 ? "today" : getDaysDifference(new Date(item.plantedAt)).time} days ago on {formatPrettyDate(item.plantedAt)} */}
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: "row", justifyContent: "space-between" , alignItems: "center",  paddingVertical: 16},
  container: { flex: 1, padding: 16 },
  title: { fontSize: 24, fontWeight: "bold",  },
  empty: { textAlign: "center", color: "#888", marginTop: 20 },
  card: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  plantName: { fontSize: 18, fontWeight: "600" },
  date: { fontSize: 14, color: "#666" },

  toggleButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal:8,
    borderRadius: 20,
    
  },
  toggleText: {
    marginLeft: 6,
    fontSize: 14,
  },
});
